import { createClient } from '@/lib/supabase/server'
import { firstText, makeDashStripper } from '@/lib/digi/text'
import { hasFullAccess, inStarterTrial, isAllowlisted } from '@/lib/access'
import { getTrialConfig } from '@/lib/config/trial'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS, digiModelsFor } from '@/lib/config/digi'
import { NextResponse, after } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getStageFromAgeBand, STAGES, ageBandInList, type AgeBand, type ChallengeId } from '@/lib/content/stages'
import { getRecommendedScript } from '@/lib/pathway/recommend'
import type { StageId } from '@/lib/pathway/progress'
import { getExpertKnowledge, getFamilyMemory, getWhatWorked, getPathwayPosition } from '@/lib/digi/brain'
import { getAggregateWisdom, getProvenSolutions } from '@/lib/digi/wisdom'
import { getTriedAlready, getRatedForSituation } from '@/lib/digi/outcomes'
import { getRatingShifts } from '@/lib/digi/rating-loop'
import { inferSituation } from '@/lib/digi/situation'
import { lexicalFlags, highestSeverity } from '@/lib/digi/safety'
import { classifyLane, laneShape, missCandidates } from '@/lib/digi/lane'
import { startTimer } from '@/lib/digi/timing'
import { loadLaneKeywords } from '@/lib/digi/keywords'
import { matchScripts, type MatchableScript } from '@/lib/digi/script-match'
import { DIGI_TOOLS, TOOL_RULES, CLIENT_TOOL_NAMES, runDigiTool } from '@/lib/digi/tools'
import { consumeStream } from '@/lib/digi/stream'
import { STATIC_SYSTEM } from '@/lib/digi/system'
import { schoolSubjectFor, learningContextFor, learningRules } from '@/lib/learning/digi-context'
import { asksAboutNextTerm, buildTermPreview, previewRules } from '@/lib/learning/term-preview'
import { getFamilyRegion } from '@/lib/learning/region'
import { deviceLabel } from '@/lib/quests/device-time'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import { createAdminClient } from '@/lib/supabase/admin'
import { raiseConcern } from '@/lib/concerns/raise'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 45_000,
  maxRetries: 1,
})

const WARM_ERROR = 'DiGi took too long to think just then. Ask again, your message was not lost.'
const BUSY_ERROR = 'DiGi is helping a lot of parents right now. Give it a minute and ask again, your message was not lost.'

async function callDigi(params: Anthropic.MessageCreateParamsNonStreaming): Promise<Anthropic.Message> {
  const modelsToTry = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  let lastError: unknown
  for (const model of modelsToTry) {
    try {
      return await anthropic.messages.create({ ...params, model })
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) throw err
      lastError = err
    }
  }
  throw lastError
}

// Streaming variant of callDigi with the same model fallback chain. The await
// resolves once response headers arrive, so 404/400 model errors throw here
// and the next model is tried before any text has been sent to the client.
async function callDigiStream(params: Omit<Anthropic.MessageCreateParamsStreaming, 'stream'>) {
  const modelsToTry = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  let lastError: unknown
  for (const model of modelsToTry) {
    try {
      return await anthropic.messages.create({ ...params, model, stream: true })
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) throw err
      lastError = err
    }
  }
  throw lastError
}

// Raised from 60 when the tool loop landed. A message where DiGi searches costs
// an extra model round trip, and the 45 second client timeout means two rounds
// could in principle outlast the old ceiling. The common case, where no tool is
// called, is unchanged and nowhere near either number.
export const maxDuration = 90
export const dynamic = 'force-dynamic'

// The DiGi cap used to be `const FREE_DAILY_LIMIT = 3` right here. It is
// platform_config.trial_digi_daily_limit now (migration 199), because the
// homepage sells "DiGi, with a daily limit" and how big that limit is is a
// pricing decision, not a line of code. lib/config/trial.ts carries the same
// number as a fallback, so an unreachable database costs nobody their answer.

// How to weigh everything that follows.
//
// Justin: "I want it to use the researchers when answering specific questions,
// as well as weighting the parent input, what we learn from the platform, and
// all the data reports from the researchers we agree with. How is this working,
// and can we make sure it is that clear?"
//
// The honest answer was that it was not clear. Thirteen context blocks were
// concatenated into one flat string and handed over, so the precedence was
// whatever the model inferred that time. It mostly behaved, but nothing said
// what should win when a research finding and a family's own history disagree,
// which is the exact moment a parenting guide either earns trust or loses it.
//
// So the order is stated rather than hoped for. It sits FIRST in the context,
// before any of the material it governs, because an instruction about how to
// read something has to arrive before the something.
//
// The order itself is the product's argument. Safety outranks everything because
// it must. Research sets the direction, since what is generally true is the
// honest starting point. This family outranks the research for FIT, because a
// finding about eleven year olds is not a finding about this eleven year old.
// Other families come last and never as authority, because "other people do it
// this way" is social pressure, not evidence, and a parent already gets plenty
// of that. And when they genuinely conflict, saying so out loud is better than
// silently picking, because a parent who can see the tension makes a better
// decision than one handed false certainty.
const PRECEDENCE = `

HOW TO WEIGH WHAT FOLLOWS (this ordering overrides the order the sections happen to appear in):
1. SAFETY FIRST. Anything touching harm, crisis or safeguarding outranks everything else here, always, and the human signpost (GP, NHS 111, Childline 0800 1111) is never replaced by advice.
2. THE FAMILY'S OWN AGREEMENT outranks your suggestion. If they have written a rule down, work inside it or say plainly why it might be worth revisiting. Never quietly contradict a deal a parent and child signed.
3. RESEARCH SETS THE DIRECTION. The expert knowledge base is what is generally true, and it is where an answer starts. Cite the source by name when you use one.
4. THIS FAMILY SETS THE FIT. Their history, what has worked for them before, their child's age and stage decide how the general thing applies here. A finding about eleven year olds is not a finding about THIS eleven year old, so when the family's own record points somewhere else, follow the family and say why.
5. WHAT HAS WORKED for other families is a starting suggestion only. Offer it, never lean on it, never present it as what people do, and never give numbers.
6. WHEN THEY CONFLICT, SAY SO. If the research points one way and this family's experience the other, name the tension in one plain sentence and give the parent the choice. Do not pick silently and do not pretend there is more certainty than there is.
7. IF YOU DO NOT KNOW, SAY YOU DO NOT KNOW. Never invent a study, a statistic, a source or a number. An honest gap is worth more than a confident guess. A subject the knowledge base below happens not to cover is NOT one of those gaps: answer it fully from what you know and simply attach no source. Silence in the bank is never a reason to give a parent less than you have.
`


export async function POST(request: Request) {
  // Measuring only. Nothing below is reordered or gated on a duration, and the
  // timer does no I/O. See lib/digi/timing.ts for why time to first token is
  // the number and total request duration is not.
  const timer = startTimer()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { message, device_key } = await request.json()
  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }
  timer.mark('auth')

  // Gather all independent context in one parallel round trip: profile,
  // conversation (rate limit + history), child, tracker history, reflection
  // feedback, script feedback, AI lessons, device guide, live concerns,
  // family memory.
  const [
    profileResult,
    convResult,
    childResult,
    trackerResult,
    feedbackResult,
    scriptFeedbackResult,
    aiLessonsResult,
    deviceGuideResult,
    concernsResult,
    familyMemory,
    whatWorked,
    agreementResult,
    weekSessionsResult,
    sundayCheckinResult,
    ratingShifts,
    // The routing vocabulary, in here rather than next to classifyLane on
    // purpose. This round is already thirteen queries wide, so the read hides
    // behind the slowest of them and the database backed list costs nothing on
    // the clock. Adding it later, where it would be serial, would have made the
    // very phase this is meant to speed up slower.
    laneKeywords,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('subscription_status, trial_ends_at, created_at, onboarding_answers')
      .eq('id', user.id)
      .single(),
    supabase
      .from('digi_conversations')
      .select('messages, messages_today, last_message_date')
      .eq('user_id', user.id)
      .single(),
    // Every child, not only the primary one.
    //
    // This asked for is_primary and nothing else, so DiGi genuinely did not
    // know a family's other children existed. In a house with more than one it
    // would answer about the primary whatever the parent meant, and the name
    // rule below then instructed it to use that name and no other, so a parent
    // typing about Ada was told about Alma and DiGi was forbidden from
    // correcting itself. The guard written to stop invented names was enforcing
    // the wrong real one.
    supabase
      .from('children')
      .select('id, name, age_band, stage_id, streak_weeks, actions_this_week, device_trust, is_primary')
      .eq('parent_id', user.id)
      .order('is_primary', { ascending: false }),
    supabase
      .from('wellbeing_checks')
      .select('week_start, mood_score, sleep_score, social_score, screen_mood_score, open_communication, concern_level, notes')
      .eq('parent_id', user.id)
      .order('week_start', { ascending: false })
      .limit(6),
    supabase
      .from('digi_feedback')
      .select('feedback_date, question, parent_response, digi_insight')
      .eq('user_id', user.id)
      .not('parent_response', 'is', null)
      .order('feedback_date', { ascending: false })
      .limit(10),
    supabase
      .from('script_completions')
      .select('script_sort_order, worked, completed_at')
      .eq('user_id', user.id)
      .not('worked', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(10),
    supabase
      .from('ai_lessons')
      .select('title, key_message, the_idea')
      .eq('audience', 'parent')
      .order('sort_order', { ascending: true }),
    device_key && typeof device_key === 'string'
      ? supabase
          .from('device_guides')
          .select('name, subtitle, why, steps, note')
          .eq('device_key', device_key)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from('concerns')
      .select('slug, label, status, times_flagged')
      .eq('user_id', user.id)
      .in('status', ['open', 'improving'])
      .order('last_flagged_at', { ascending: false })
      .limit(6),
    getFamilyMemory(supabase, user.id, message),
    getWhatWorked(supabase, user.id),
    supabase
      .from('family_agreements')
      // The actual terms, not only whether one exists. DiGi used to know a
      // family had an agreement and nothing about what was in it, which meant
      // it could cheerfully advise something the family had already written
      // down the opposite of. Undermining a parent's own signed rule is the
      // single worst thing this product can do, so DiGi reads the deal.
      .select('signed_by_parent, signed_by_child, agreed_date, review_date, family_values, bedroom_rule_time, bedroom_rule_location, social_media_terms, when_things_go_wrong, extra_agreements')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('device_sessions')
      .select('device, minutes')
      .eq('user_id', user.id)
      .gte('started_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    // The Sunday check in and its agreed plan. This existed for months and
    // DiGi never read it, so it could not say "last Sunday you agreed X, how
    // is it going", which is the single most listening thing it could say.
    supabase
      .from('wellbeing_checkins')
      .select('week_start, parent_mood, focus, plan, plan_agreed')
      .eq('user_id', user.id)
      .order('week_start', { ascending: false })
      .limit(2),
    // What moved the family's own weekly rating, and what they did that week.
    // Written by the checkin-learning cron, migration 190.
    getRatingShifts(supabase, user.id),
    loadLaneKeywords(supabase),
  ])
  timer.mark('gather1')

  const profile = profileResult.data
  const convData = convResult.data
  // The whole family, and the one to assume when the parent has not said.
  type DigiChild = {
    id: string; name: string | null; age_band: string | null; stage_id: string | null
    streak_weeks: number | null; actions_this_week: number | null
    device_trust: string | null; is_primary: boolean | null
  }
  const children = (childResult.data ?? []) as DigiChild[]
  const child = children.find(c => c.is_primary) ?? children[0] ?? null

  const isPaid = hasFullAccess(profile, user.email)

  // ── WHO THE DAILY LIMIT ACTUALLY APPLIES TO ─────────────────────────────
  //
  // Justin, 14 August 2026: "The trial itself is identical: 4 days inside the
  // platform with DiGi on a daily limit and a starter set of scripts." Both
  // paths. The homepage sells the same thing on the trial card.
  //
  // SO IT IS THE TRIAL THAT IS CAPPED, NOT THE MISSING CARD. That is the
  // change, and it is the third answer this line has had. It first asked
  // hasFullAccess, which is true for the whole trial, so nobody was ever
  // capped. Then it asked hasPaidPlan, which capped the no card path only, so
  // the founder bought their way out of a limit that is meant to be part of
  // what a trial IS. Now it asks whether the four days are running, which is
  // the same question the scripts policy asks and the same one the front page
  // answers.
  //
  // The clock closes on the first charge (see the Stripe webhook), so a
  // founder is uncapped the moment their money moves rather than a day later.
  //
  // The allowlist is asked separately and by name, because it is a grant of
  // access rather than a record of payment and the founder must never be
  // capped on his own product.
  //
  // A SEPARATE VARIABLE, not a redefinition of isPaid, on purpose: isPaid
  // also drives preferFree in the recommendation below, which changes the
  // RECOMMENDED NEXT STEP block DiGi is thinking with. Changing the rate
  // limit is not a reason to quietly change what DiGi says.
  const limitApplies = inStarterTrial(profile) && !isAllowlisted(user.email)

  const today = new Date().toISOString().split('T')[0]
  const isNewDay = !convData || convData.last_message_date !== today
  const currentCount = isNewDay ? 0 : (convData?.messages_today ?? 0)

  // Checked before any streaming starts, so a parent at their limit gets a
  // clean answer rather than a half written one.
  if (limitApplies) {
    const { digiDailyLimit } = await getTrialConfig()
    if (currentCount >= digiDailyLimit) {
      return NextResponse.json(
        { error: 'Daily limit reached', messagesUsedToday: currentCount, limit: digiDailyLimit },
        { status: 429 },
      )
    }
  }

  const stage = child?.age_band
    ? getStageFromAgeBand(child.age_band as AgeBand)
    : STAGES[2]

  const aiKnowledge = (aiLessonsResult.data ?? [])
    .map(l => `- ${l.title}: ${l.key_message} (${l.the_idea})`)
    .join('\n')

  const scriptFeedback = scriptFeedbackResult.data ?? []
  const parentChallenge = (profile?.onboarding_answers as Record<string, string> | null)?.challenge as ChallengeId | undefined

  // Which shape this message needs, before the research queries run so a
  // question that has nothing to do with the child does not go and fetch six
  // findings about eleven year olds to ignore. Nearly always free: the keyword
  // pass answers it with no model call, and every failure lands on 'parenting',
  // which is the shape that loses least by being wrong.
  const hasHistoryNow = (convData?.messages ?? []).length > 0
  const lane = await classifyLane(message, hasHistoryNow, laneKeywords)
  timer.mark('lane')
  const wantsResearch = lane !== 'general'

  // A slow lane phase means the keyword pass could not answer and we paid a
  // model call to find out. Those are the messages whose words are worth
  // knowing, so the list can learn and the next parent does not pay it.
  //
  // The threshold, not a flag: a fall through is the only thing that takes real
  // time here, so the clock is a more honest signal than re-deriving what
  // fastLane decided. Words only, and missCandidates strips names, stopwords
  // and anything short before they reach the table.
  const laneMissed = (timer.read().lane ?? 0) > 200
  const missWords = laneMissed
    ? missCandidates(message, new Set(laneKeywords))
    : []

  // Second parallel round trip for the queries that depend on the first
  // The counted cross family evidence needs a situation shape to look up, so
  // one is guessed from the message's own words, no model call. A miss costs
  // nothing: no topic, no query, and the block tells DiGi to ignore a bad fit.
  const situation = inferSituation(String(message))
  const [expertKnowledge, aggregateWisdom, provenSolutions, ratedForSituation, triedAlready, recommended, matchingScriptsResult, pathwayPosition] = await Promise.all([
    wantsResearch ? getExpertKnowledge(supabase, child?.age_band ?? null, message) : Promise.resolve(''),
    wantsResearch ? getAggregateWisdom(supabase, child?.age_band ?? null, message) : Promise.resolve(''),
    wantsResearch ? getProvenSolutions(supabase, child?.age_band ?? null, message) : Promise.resolve(''),
    // Built with migration 147 and never called until now: what parents in the
    // same situation shape actually told us worked, counted, three verdicts
    // minimum before anything is offered as working elsewhere.
    wantsResearch ? getRatedForSituation(supabase, child?.age_band ?? null, situation.topic, situation.time_band) : Promise.resolve(''),
    // What this family has already tried and what they told us happened. Not
    // gated on wantsResearch: a parent's own verdict on their own child is not
    // research, it is the thing DiGi must not contradict or repeat back to
    // them. Suggesting again the exact thing somebody told you failed is worse
    // than having no memory at all, because the first is not listening.
    wantsResearch ? getTriedAlready(supabase, user.id) : Promise.resolve(''),
    child?.stage_id
      ? getRecommendedScript(supabase, user.id, child.stage_id as StageId, parentChallenge ?? null, { preferFree: !isPaid })
      : Promise.resolve(null),
    scriptFeedback.length > 0
      ? supabase
          .from('scripts')
          .select('sort_order, title')
          .in('sort_order', scriptFeedback.map(f => f.script_sort_order))
      : Promise.resolve({ data: null }),
    child?.stage_id
      ? getPathwayPosition(supabase, user.id, { id: stage.id, name: stage.name, ages: stage.ages, stageId: child.stage_id as StageId }, (child?.streak_weeks as number | null) ?? 0)
      : Promise.resolve(''),
  ])
  timer.mark('gather2')

  let nextStepKnowledge = ''
  if (recommended) {
    // The reason is passed through rather than summarised, so DiGi can say why
    // it is offering this one. "Because the console keeps coming up" is a
    // different sentence from "here is the next script", and only one of them
    // sounds like something that has been listening.
    const why = recommended.reason
      ? `We are offering it because: ${recommended.reason}.`
      : recommended.matchesChallenge
        ? 'This directly matches the main concern they told us about at signup.'
        : ''
    nextStepKnowledge = `\n\nRECOMMENDED NEXT STEP ON THE PATHWAY: The next script this parent has not yet used is "${recommended.title}" (${recommended.situation}). ${why} If the conversation naturally allows it, or if they ask what to do next, mention this specific script by name as the next concrete step, do not just give generic advice when a specific next step already exists.`
  }

  // The agreed Sunday plan, so DiGi can coach inside the week the family has
  // already chosen rather than beside it, and can ask how it is actually going.
  let sundayPlanKnowledge = ''
  {
    type SundayRow = { week_start: string; parent_mood: number | null; focus: string | null; plan: { title?: string }[] | null; plan_agreed: boolean | null }
    const sundayRows = (sundayCheckinResult.data ?? []) as SundayRow[]
    const agreed = sundayRows.find(r => r.plan_agreed && Array.isArray(r.plan) && r.plan.length > 0)
    if (agreed) {
      const steps = (agreed.plan ?? []).map(p => p.title).filter(Boolean).join('; ')
      const mood = typeof agreed.parent_mood === 'number' ? ` The parent rated their own week ${agreed.parent_mood} out of 5.` : ''
      const focus = agreed.focus ? ` They want the week to feel like: ${agreed.focus}.` : ''
      sundayPlanKnowledge = `\n\nTHE PLAN THIS FAMILY AGREED AT THEIR SUNDAY CHECK IN (week of ${agreed.week_start}):\n${steps}.${focus}${mood}\nCoach inside this plan, never against it. When the conversation touches what the plan covers, refer to it as the thing they chose, ask warmly how it is going, and build on it rather than starting fresh. If it is clearly not working, say so plainly and offer a different angle.`
    }
  }

  let scriptFeedbackKnowledge = ''
  if (scriptFeedback.length > 0) {
    const matchingScripts = matchingScriptsResult.data
    const titleFor = (sortOrder: number) => matchingScripts?.find(s => s.sort_order === sortOrder)?.title ?? `script ${sortOrder}`
    scriptFeedbackKnowledge = `\n\nSCRIPTS THIS PARENT HAS TRIED, AND WHETHER THEY WORKED (use this, do not suggest a script that already failed without acknowledging it first, and lean on ones that worked):\n` +
      scriptFeedback.map(f => `- "${titleFor(f.script_sort_order)}": ${f.worked === 'yes' ? 'worked well' : f.worked === 'somewhat' ? 'partly worked' : 'did not work'}`).join('\n')
  }

  // Scripts we already have that may fit what the parent just said, so DiGi can
  // point them at the exact one rather than only talking in general. DiGi still
  // decides whether one genuinely fits; this only chooses what it gets to see.
  //
  // The picking moved to lib/digi/script-match on 10 August 2026. It used to
  // count how MANY of the parent's words appeared and need two, which meant a
  // parent who named one platform ("she wants tiktok") was handed nothing at
  // all, so the newest and most specific scripts were the least reachable.
  let scriptLinkKnowledge = ''
  try {
    const { data: allScripts } = await supabase.from('scripts').select('sort_order, title, situation, category')
    const matched = matchScripts((allScripts ?? []) as MatchableScript[], String(message))
    if (matched.length > 0) {
      scriptLinkKnowledge = `\n\nSCRIPTS WE ALREADY HAVE THAT MAY FIT WHAT THE PARENT JUST SAID. If one genuinely fits their situation, name it warmly in your reply and link it so they can open it, exactly in this markdown form [Script title](/dashboard/scripts/SORT_ORDER). Only ever link one of these real scripts, never invent a title or a link, and only when it truly fits:\n` +
        matched.map(s => `- [${s.title}](/dashboard/scripts/${s.sort_order}) — ${s.situation}`).join('\n')
    }
  } catch { /* scripts are a bonus, never block the reply */ }

  // Moment cards that may fit what the parent just said, so when a chat leads
  // to a real everyday moment DiGi can say that is a moment and link straight to
  // the card. A light keyword match over the library, filtered to the child's
  // age, and DiGi decides if one genuinely fits.
  let momentLinkKnowledge = ''
  try {
    const { data: allMoments } = await supabase
      .from('daily_moments')
      .select('id, title, category, science_brief, age_bands')
      .eq('active', true)
    const stop = new Set(['this', 'that', 'with', 'have', 'they', 'them', 'their', 'when', 'what', 'about', 'from', 'want', 'wants', 'will', 'wont', 'does', 'been', 'kids', 'child'])
    const words = [...new Set(String(message).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !stop.has(w)))]
    const scored = (allMoments ?? [])
      .filter(mo => ageBandInList(child?.age_band ?? null, (mo.age_bands as string[] | null) ?? []))
      .map(mo => {
        const hay = `${mo.title} ${mo.category} ${mo.science_brief}`.toLowerCase()
        let score = 0
        for (const w of words) if (hay.includes(w)) score += 1
        return { mo, score }
      }).filter(x => x.score >= 2).sort((a, b) => b.score - a.score).slice(0, 3)
    if (scored.length > 0) {
      momentLinkKnowledge = `\n\nMOMENT CARDS WE ALREADY HAVE THAT MAY FIT WHAT THE PARENT JUST SAID. If the conversation has landed on one of these everyday moments, tell them warmly that this is a known moment and link the card so they can open it, exactly in this markdown form [Moment title](/m/MOMENT_ID). Only ever link one of these real moments, never invent a title or a link, only when it truly fits, and never link both a script and a moment in the same reply, choose the one that fits best:\n` +
        scored.map(x => `- [${x.mo.title}](/m/${x.mo.id}) — ${x.mo.category}`).join('\n')
    }
  } catch { /* moments are a bonus, never block the reply */ }

  let deviceGuideKnowledge = ''
  const deviceGuide = deviceGuideResult.data
  if (deviceGuide) {
    const steps = ((deviceGuide.steps as string[] | null) ?? [])
      .map(s => s.replace(/\*\*/g, ''))
      .map((s, i) => `  ${i + 1}. ${s}`)
      .join('\n')
    deviceGuideKnowledge = `\n\nDEVICE SETUP GUIDE — the parent is asking about ${deviceGuide.name} (${deviceGuide.subtitle}). Walk them through this step by step, one step at a time, checking in before moving to the next rather than dumping all steps at once. Why this matters: ${deviceGuide.why}\nSteps:\n${steps}\nClosing note: ${deviceGuide.note}
IMPORTANT: this guide is the ONLY device the parent is asking about right now. If you were discussing a different device or app earlier in this conversation, that topic is finished. Do not mention it, and do not offer its steps.`
  } else if (typeof message === 'string' && /\b(set ?up|settings|parental control|filter|walk me through)\b/i.test(message)) {
    // The parent is clearly asking how to set something up and we have no
    // guide for it.
    //
    // Without this DiGi filled the silence from earlier in the conversation: a
    // parent who had asked about TikTok and then asked about their home WiFi
    // got TikTok's steps a second time, confidently. Improvising steps for a
    // real device is worse than saying we do not have that one, because a
    // parent following invented settings believes their house is covered when
    // it is not.
    deviceGuideKnowledge = `\n\nNO DEVICE GUIDE IS LOADED for what this parent is asking to set up. Do NOT invent step by step settings, and do NOT reuse the steps of a different device or app from earlier in this conversation, which is a different question that is now finished. Give the honest general principle in a sentence or two, say plainly that we do not have a written guide for that one yet, and offer to help them think it through. Never present improvised steps as if they were our guide.`
  }

  let concernsKnowledge = ''
  const liveConcerns = concernsResult.data ?? []
  if (liveConcerns.length > 0) {
    concernsKnowledge = `\n\nLIVE CONCERNS THIS FAMILY HAS FLAGGED (from daily check ins and flagged moments, most recent first):\n` +
      liveConcerns.map(c => `- ${c.label}: ${c.status}, flagged ${c.times_flagged} time${c.times_flagged === 1 ? '' : 's'}`).join('\n') +
      `\nWhen the conversation touches one of these, acknowledge it with empathy as something you know has been coming up for them, and move them to the NEXT practical step rather than repeating what they have already tried. A concern that keeps returning means the approach needs adjusting, never that the parent is failing. No guilt, ever.`
  }

  // This family's actual screen life: the agreement, the trust level, the
  // timer's own numbers and the healthy guide for the age. So when a parent
  // asks "should Teo have a Switch and for how long", DiGi answers from what
  // this family has actually set up, and gently points at the missing piece
  // (the family deal, the timer) instead of only giving good general advice.
  let screenLifeKnowledge = ''
  try {
    const agreement = agreementResult.data
    const byDevice = new Map<string, number>()
    for (const s of weekSessionsResult.data ?? []) {
      byDevice.set(String(s.device), (byDevice.get(String(s.device)) ?? 0) + (Number(s.minutes) || 0))
    }
    const usageLine = [...byDevice.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([d, m]) => `${deviceLabel(d)} ${m} min`)
      .join(', ')
    const agreementLine = !agreement
      ? 'No family media agreement exists yet.'
      : !(agreement.signed_by_parent && agreement.signed_by_child)
        ? 'A family media agreement was started but is not yet signed by both sides.'
        : `A family media agreement is in place, signed by both sides${agreement.review_date ? `, next review ${agreement.review_date}` : ''}.`

    // What the family actually agreed, in their own words, so advice can be
    // held against it.
    const agreementTerms = agreement
      ? ([
          ['What matters to us', agreement.family_values],
          ['Where devices sleep', [agreement.bedroom_rule_time, agreement.bedroom_rule_location].filter(Boolean).join(', ')],
          ['Apps and social media', agreement.social_media_terms],
          ['When something goes wrong', agreement.when_things_go_wrong],
          ['Also agreed', agreement.extra_agreements],
        ] as [string, string | null][])
          .filter(([, v]) => typeof v === 'string' && v.trim())
          .map(([k, v]) => `- ${k}: ${(v as string).trim()}`)
          .join('\n')
      : ''
    const trust = (child as { device_trust?: string } | null)?.device_trust ?? 'watch'
    screenLifeKnowledge = `\n\nTHIS FAMILY'S SCREEN LIFE (use whenever the question touches a device, a console like a Switch or Xbox, TV, gaming, or how long on screens):
- Healthy daily guide for this child's age: about ${recommendedDailyMinutes(child?.age_band ?? null)} minutes of recreational screen a day. Always a calibrated guide, never a hard cap.
- Screen time through the family timer in the last 7 days: ${usageLine || 'none logged, which likely means screen time is happening without the timer'}.
- Device trust level: ${trust} (ask means the child asks first, watch means they start freely and the parent gets a ping, trusted means a lighter touch).
- ${agreementLine}
${agreementTerms ? `
THIS FAMILY'S OWN AGREEMENT, IN THEIR WORDS:
${agreementTerms}

Treat these as settled decisions this family already made together, not as
suggestions. Never advise something that cuts across a term above. If what a
parent is asking about is already covered, say so plainly and quote their own
wording back before anything else, because the most useful thing you can do is
remind them they already decided this and it is written down. If they want to
change a term, that is completely fine, but it is a change they make together
at [our family deal](/dashboard/agreement), not something you overrule in a
chat. If holding to a term is genuinely going wrong for them, say that too and
point them at reviewing it, rather than quietly advising around it.` : ''}
When a parent asks whether or for how long their child should use any device, do two things beyond the advice itself. First, ground the answer in this family's own numbers above rather than only general figures. Second, check what is missing and add ONE warm sentence for it: if the agreement is missing or unsigned, suggest writing the deal down together while it is topical and link it exactly as [our family deal](/dashboard/agreement); if the timer shows nothing for the device being discussed, remind them every screen session, TV and consoles included, can run through the star timer on [the quests board](/dashboard/quests) so the time is earned, visible to both of them, and winds up on its own at the healthy amount. Never both sentences if only one is missing, never either if both are in place, and never a lecture.`
  } catch { /* screen life context is a bonus, never blocks the reply */ }

  // Where this child actually is at school, but only when school is what the
  // parent is asking about. Fetched per message rather than held in the system
  // prompt: 448 objectives sitting in every call would cost a fortune, bury the
  // parenting guidance, and still leave the model free to paraphrase statutory
  // wording into something plausible and wrong.
  //
  // The rules that travel with it matter more than the facts. They live in
  // learningRules and the short version is: never tell a parent their child is
  // behind, quote rather than paraphrase, and never claim the school is
  // teaching this now. Nothing is added at all unless we are certain, so no
  // birthday, an age outside years 1 to 6, or an empty curriculum map all mean
  // DiGi answers exactly as it did before.
  let schoolKnowledge = ''
  try {
    const subject = schoolSubjectFor(message)
    if (subject) {
      const learning = await learningContextFor(user.id, subject)
      if (learning) schoolKnowledge = `\n\n${learningRules(learning)}`
    }

    // What is coming NEXT, which is a different question from what they are
    // being taught now and was previously answered only in generalities.
    //
    // Gated on the question rather than run every time: it costs two reads, and
    // a parent asking about bedtime should not pay for a curriculum lookup.
    // buildTermPreview returns null outside a holiday and the first week back,
    // so even a matching question is silent for most of the year, which is
    // correct: "what is she doing next term" in the middle of October is a
    // question about a term nobody has started thinking about.
    if (asksAboutNextTerm(String(message))) {
      const region = await getFamilyRegion(supabase, user.id).catch(() => 'uk' as const)
      const preview = await buildTermPreview(
        supabase,
        { date_of_birth: (child as { date_of_birth?: string | null } | null)?.date_of_birth ?? null },
        new Date(),
        region,
      )
      if (preview) schoolKnowledge += `\n\n${previewRules(preview, (child as { name?: string | null } | null)?.name ?? null)}`
    }
  } catch { /* school context is a bonus, never blocks the reply */ }

  const familyContext = buildSystemPrompt(
    stage,
    child,
    children,
    profile?.onboarding_answers,
    trackerResult.data ?? [],
    feedbackResult.data ?? [],
    aiKnowledge,
    // The order these are concatenated in is not the order they should be
    // weighed in, which is what PRECEDENCE exists to say. Before it, thirteen
    // blocks arrived as one flat wall of context and the model decided the
    // precedence for itself, differently each time.
    // laneShape goes LAST because it overrides the format rules in the static
    // prompt, and an override that arrives before the thing it overrides reads
    // as a suggestion. PRECEDENCE stays first: it decides what outranks what,
    // and safety leading is not negotiable for any lane.
    PRECEDENCE + pathwayPosition + deviceGuideKnowledge + screenLifeKnowledge + scriptFeedbackKnowledge + scriptLinkKnowledge + momentLinkKnowledge + nextStepKnowledge + concernsKnowledge + whatWorked + sundayPlanKnowledge + ratingShifts + triedAlready + ratedForSituation + provenSolutions + aggregateWisdom + expertKnowledge + familyMemory + schoolKnowledge + laneShape(lane) + TOOL_RULES,
  )

  // Drop any malformed or empty entries before the history reaches the model:
  // the API rejects a conversation containing an empty message, so one bad
  // saved row would otherwise poison every future call.
  const history = ((convData?.messages ?? []) as Array<{ role: string; content: string }>)
    .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-12)

  const messages = [
    ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: message },
  ]
  // The growing turn list, which the tool loop appends to. `messages` stays as
  // the opening state so nothing else in this route sees the tool traffic.
  const conversation: Anthropic.MessageParam[] = [...messages]

  const newCount = currentCount + 1

  // Everything above this line is our own work, and the parent has seen none of
  // it. The prompt is now built, so close that phase off before the one part of
  // the wait that is not ours.
  timer.mark('prompt')

  // Open the model stream. Failures here happen before any bytes reach the
  // client, so the warm error can still go out as JSON like before.
  let modelStream: Awaited<ReturnType<typeof callDigiStream>>
  try {
    modelStream = await callDigiStream({
      model: DIGI_MODEL,
      // Headroom for the main reply AND the reflective question that follows the
      // --- marker. At 700 a long lesson ate the whole budget and the reflection
      // came through chopped mid word, so it gets its own room here.
      max_tokens: 1000,
      system: [
        { type: 'text', text: STATIC_SYSTEM, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: familyContext },
      ],
      messages,
      tools: DIGI_TOOLS,
    })
  } catch (err) {
    const status = err instanceof Anthropic.APIError ? err.status : null
    return NextResponse.json({ error: status === 429 || status === 529 ? BUSY_ERROR : WARM_ERROR }, { status: 503 })
  }
  // The await above resolves when Anthropic starts sending, so this is time to
  // first token and it is the last thing standing between the parent and a
  // reply. If this phase is the big one, the fix is not in our code.
  timer.mark('model')

  // The post-response work (saving the conversation, memory extraction, the
  // reflective question) runs after the stream completes, once the full text
  // has been collected. `after` keeps the serverless function alive for it.
  let resolveDone: (fullText: string) => void = () => {}
  const donePromise = new Promise<string>(resolve => { resolveDone = resolve })

  after(async () => {
    const responseText = await donePromise

    // Timings first, and deliberately BEFORE the empty reply guard below. A
    // message that failed still waited, and a reply that took eleven seconds
    // and then fell over is the single most interesting row this table can
    // hold. Dropping it would mean the numbers only ever describe the good
    // days, which is how a slow path stays invisible.
    //
    // Wrapped because diagnostics must never be the reason a conversation is
    // not saved. The real work is below this and it is not allowed to depend
    // on us being curious.
    try {
      const t = timer.read()
      const replied = responseText.trim().length > 0
      await supabase.from('digi_latency').insert({
        user_id: user.id,
        auth_ms: t.auth ?? null,
        gather1_ms: t.gather1 ?? null,
        lane_ms: t.lane ?? null,
        gather2_ms: t.gather2 ?? null,
        prompt_ms: t.prompt ?? null,
        model_ms: t.model ?? null,
        total_ms: t.total ?? null,
        lane,
        first_message: history.length === 0,
        tool_fired: toolFired,
        // Migration 149 recorded how long every phase took and not whether an
        // answer came out. So when Justin asked which of four rows was his
        // failure, there was no way to tell: a four second success and a four
        // second empty reply were the same row. Speed measured, outcome
        // forgotten. This is that gap closed.
        replied,
        reply_chars: responseText.trim().length,
        failure: replied ? null : 'empty',
      })

      // The words we did not know, from a message the keyword pass could not
      // place. Words only, already stripped of names and stopwords, and nothing
      // surfaces on the board until two or more separate families have said it.
      if (missWords.length > 0) {
        await supabase.from('digi_lane_misses').insert(
          missWords.map(word => ({ word, user_id: user.id })),
        )
      }
    } catch { /* never at the cost of the reply */ }

    if (!responseText.trim()) {
      // NO ANSWER CAME, SO THE CLAIM IS WITHDRAWN.
      //
      // The row was inserted before the stream so the pathway could tick the
      // moment a parent asked, instead of a minute later behind the model call.
      // That is right when a reply arrives and wrong when one does not, because
      // lib/pathway/daily-tasks.ts asks only whether a row exists today. Left in
      // place, an empty row ticks "ask DiGi a question" green for a conversation
      // that ended by apologising and telling them to ask again.
      //
      // It is not only the rare empty model reply either: the catch around the
      // stream sets fullText to '' on ANY throw, so a dropped connection or the
      // client's own timeout lands here too, and the client's retry would then
      // claim a SECOND row for the same question, inflating the weekly count
      // Justin reads and double counting the sentence in the theme tally.
      //
      // A read side filter cannot fix this: response is '' for the whole of a
      // successful stream as well, which is the entire point of claiming early.
      // So the write side takes it back.
      if (questionRowId) {
        try {
          await createAdminClient().from('digi_questions').delete().eq('id', questionRowId)
        } catch { /* best effort, exactly as the claim itself is */ }
      }
      return
    }

    // Extract the reflective question from the response (after the marker line).
    // The reflection is written last, so a long reply can chop it off mid word.
    // A real reflective question always ends with a question mark, so anything
    // that does not is a truncated fragment and is dropped rather than saved as
    // a half sentence ("...or does he pr").
    const reflectiveSplit = responseText.split(/\n\s*---\s*\n/)
    const mainResponse = reflectiveSplit[0]?.trim() ?? responseText
    const rawReflective = reflectiveSplit[1]?.trim() ?? null
    const reflectiveQuestion = rawReflective && rawReflective.endsWith('?') ? rawReflective : null

    // Save the main reply only. The reflective question lives in digi_feedback,
    // and saving the filtered history heals any poisoned rows already stored.
    const updatedMessages = [
      ...history,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: mainResponse || responseText, timestamp: new Date().toISOString() },
    ]

    if (convData) {
      await supabase.from('digi_conversations').update({
        messages: updatedMessages,
        message_count: Math.floor(updatedMessages.length / 2),
        messages_today: newCount,
        last_message_date: today,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id)
    } else {
      await supabase.from('digi_conversations').insert({
        user_id: user.id,
        messages: updatedMessages,
        message_count: 1,
        messages_today: newCount,
        last_message_date: today,
      })
    }

    // DiGi learns: extract one durable memory from the exchange when there is
    // one worth keeping, so future conversations start from what is known.
    // When the memory is a concern, it also joins the same concerns ledger
    // Right now and the daily moments tagger write to, so a worry raised only
    // in chat still gets carried forward and asked about again tomorrow,
    // exactly like one flagged any other way. Existing slugs are offered back
    // so a repeat of the same theme bumps the same row instead of forking it.
    try {
      const existingConcernList = liveConcerns.length > 0
        ? liveConcerns.map(c => `${c.slug}: ${c.label}`).join('; ')
        : 'none yet'
      // A message that was never about the child has no durable family fact in
      // it, so the extraction call is skipped rather than paid for and answered
      // NONE. It also stops a stray note about someone's work deadline being
      // filed as lasting context about the family.
      const extraction = (lane === 'general' || savedItsOwnMemory) ? null : await callDigi({
        model: digiModelsFor('extract')[0],
        max_tokens: 220,
        messages: [{
          role: 'user',
          content: `From this parent coaching exchange, extract at most ONE durable fact worth remembering for future conversations (a concern, a win, a preference, or lasting context about the child or family). Skip small talk and one off logistics. If nothing durable, reply exactly NONE.\n\nParent: ${message}\nAdvisor: ${mainResponse.slice(0, 600)}\n\nThis family's existing tracked concerns (slug: label): ${existingConcernList}\n\nReply as JSON only: {"kind":"observation|concern|win|preference|context","content":"one sentence, third person","concern_slug":"kebab-case-2-to-4-words","concern_label":"Short label, sentence case, correctly spelled, never copy a typo from the parent"} or NONE. Only include concern_slug and concern_label when kind is concern: reuse an existing slug above verbatim if this is the same theme, otherwise invent a new short one.`,
        }],
      })
      const memText = extraction ? firstText(extraction).trim() || 'NONE' : 'NONE'
      if (memText !== 'NONE') {
        const memMatch = memText.match(/\{[\s\S]*\}/)
        if (memMatch) {
          const mem = JSON.parse(memMatch[0]) as { kind: string; content: string; concern_slug?: string; concern_label?: string }
          if (['observation', 'concern', 'win', 'preference', 'context'].includes(mem.kind) && mem.content) {
            // Embed at write time so the memory is findable by meaning from
            // the very next question. No key or a failed call stores null and
            // the backfill sweeps it up later.
            const { embedText } = await import('@/lib/digi/embeddings')
            const embedding = await embedText(mem.content.slice(0, 400), 'document').catch(() => null)
            await supabase.from('digi_memory').insert({
              user_id: user.id, child_id: child?.id ?? null,
              kind: mem.kind, content: mem.content.slice(0, 400), source: 'chat',
              ...(embedding ? { embedding } : {}),
            })

            if (mem.kind === 'concern' && mem.concern_slug && mem.concern_label) {
              const slug = mem.concern_slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
              if (slug) {
                // THE COUNT USED TO RESET TO 1 HERE.
                //
                // `prior` was read from liveConcerns, which is the DISPLAY
                // list: open and improving only, ordered by recency, capped at
                // six. A resolved worry or a seventh one is not in it, so prior
                // came back undefined and this wrote times_flagged: 1 over a
                // row that said 4, and status 'open' over one that said
                // resolved.
                //
                // That number is what wisdom.ts calls stuck at three or more,
                // what alerts/suggestions.ts gates on, and what recommend.ts,
                // journey.ts and IsItWorkingReport all rank by. Resetting it
                // told every one of them a worry raised five times was brand
                // new, when the fifth raise is exactly the one that deserves a
                // different approach.
                //
                // raiseConcern reads the actual row by the actual key, which
                // since migration 194 includes the child, so it can no longer
                // pick up a sibling's history either.
                await raiseConcern(supabase, user.id, child?.id ?? null, {
                  slug,
                  label: mem.concern_label,
                  source: 'digi',
                  linkedType: 'digi',
                })
              }
            }
          }
        }
      }
    } catch { /* memory is best effort, never blocks the reply */ }

    // The row already exists, claimed before the stream started so the pathway
    // could tick immediately (see the note by the Response above). All that is
    // left is to put the answer in it. If the claim failed, insert as before,
    // so a bad moment costs the instant tick rather than the record.
    try {
      if (questionRowId) {
        await createAdminClient().from('digi_questions')
          .update({ response: mainResponse })
          .eq('id', questionRowId)
      } else {
        await supabase.from('digi_questions').insert({
          user_id: user.id,
          child_id: child?.id ?? null,
          stage_id: stage.id,
          question: message,
          response: mainResponse,
          // Stored so the insight agent and the research updater can ignore the
          // questions that were never about a child. See migration 141.
          lane,
        })
      }
    } catch { /* best-effort */ }

    // The safety verifier's cheap deterministic pass runs on the finished
    // reply. It never touched the parent's stream and cannot change it, it only
    // records anything it caught so the founder can review it and the evals can
    // trust the same check. Service role write, so the admin client, and the
    // whole thing is best effort: a flag that fails to save must never surface
    // to the parent.
    try {
      const flags = lexicalFlags(message, mainResponse)
      if (flags.length > 0) {
        await createAdminClient().from('digi_safety_flags').insert({
          user_id: user.id,
          stage_id: stage.id,
          question: message.slice(0, 1000),
          reply: mainResponse.slice(0, 2000),
          violations: flags,
          severity: highestSeverity(flags),
          source: 'live',
        })
      }
    } catch { /* best-effort, never blocks the reply */ }

    // Save the reflective question for today (upsert — only keeps the latest per day)
    if (reflectiveQuestion) {
      try {
        await supabase.from('digi_feedback').upsert({
          user_id: user.id,
          child_id: child?.id ?? null,
          feedback_date: today,
          question: reflectiveQuestion,
        }, { onConflict: 'user_id,feedback_date', ignoreDuplicates: true })
      } catch { /* best-effort */ }
    }
  })

  // Stream the reply to the client as plain text. The reflective question
  // travels inside the stream after the --- marker and the client splits on
  // it, exactly as the model writes it.
  // Set by the tool loop when DiGi chose to remember something itself. Declared
  // out here because the extraction step in after() has to read it.
  let savedItsOwnMemory = false

  // Whether any client tool ran, for the same reason and read in the same
  // place. A tool costs a whole extra model turn, so mixing tool messages in
  // with the rest would make the ordinary case look worse than it is.
  let toolFired = false

  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let fullText = ''
      // The no dashes rule, enforced on the way out. The system prompt asks for
      // it twice and the model still lands one occasionally, and a dash is the
      // clearest tell that a machine wrote the reply. One stripper across all
      // rounds, so a dash split over a tool pause is still caught.
      const dashes = makeDashStripper()
      try {
        // The tool loop.
        //
        // Streaming FIRST and handling tools if they happen, rather than doing a
        // tool pass and then streaming. Almost every message needs no tool at
        // all, and a pre pass would make every one of them wait for a round trip
        // to serve the few that do. This way the common case is exactly as fast
        // as it was, and only a message where DiGi decides to go and look
        // something up pauses, which is the one place a parent would forgive it.
        //
        // Two rounds. One search answers the question; a second is occasionally
        // worth it when the first came back empty. Beyond that it is a model
        // stuck in a loop, and the right response to that is a good answer from
        // what it already knows rather than a third search.
        let stream = modelStream
        for (let round = 0; round < 3; round++) {
          const turn = await consumeStream(stream, controller, encoder, dashes)
          fullText += turn.clean

          // web_search is resolved at Anthropic's end inside the same turn, so
          // it never reaches here. Only the tools we run ourselves continue the
          // loop, and an unknown name is ignored rather than answered, so a
          // model inventing a tool cannot spin us.
          turn.toolUses = turn.toolUses.filter(t => CLIENT_TOOL_NAMES.has(t.name))
          const wantsTool = turn.stopReason === 'tool_use' && turn.toolUses.length > 0
          if (!wantsTool || round === 2) break
          toolFired = true

          // Every tool the model asked for, in parallel, then all the results in
          // one user turn. The API requires a tool_result for every tool_use id
          // in the assistant turn, so a partial reply here would be rejected.
          const results = await Promise.all(
            turn.toolUses.map(async t => ({
              type: 'tool_result' as const,
              tool_use_id: t.id,
              content: await runDigiTool({
                supabase,
                userId: user.id,
                childId: (child?.id as string | undefined) ?? null,
                ageBand: (child?.age_band as string | undefined) ?? null,
                childName: (child?.name as string | undefined) ?? null,
              }, t.name, t.input),
            }))
          )
          // Noted so the extraction pass afterwards can stand down. DiGi
          // deciding in the moment what is worth keeping beats a second model
          // guessing at it after the fact, and running both would file the same
          // fact twice under two different wordings.
          //
          // ── EXCEPT A CONCERN THAT ARRIVED WITHOUT A SLUG (14 August 2026) ──
          //
          // This gate used to trip on the tool NAME alone, and that was the
          // leak. save_memory wrote only digi_memory, so choosing it silenced
          // the one pass that puts a worry on the family's check in. The moment
          // DiGi judged something worth keeping was the moment it stopped being
          // trackable.
          //
          // save_memory writes the ledger itself now, so standing down is right
          // whenever it CAN: kind is not a concern, or it is and it carried the
          // slug and label the ledger needs. When a concern arrives without
          // them there is nothing on the ledger yet, so extraction runs after
          // all and the worry still lands. One duplicate memory row is a far
          // cheaper mistake than a worry the parent can never score.
          const savedEnough = turn.toolUses.some(t => {
            if (t.name !== 'save_memory') return false
            const inp = (t.input ?? {}) as Record<string, unknown>
            if (inp.kind !== 'concern') return true
            return typeof inp.concern_slug === 'string' && !!inp.concern_slug
              && typeof inp.concern_label === 'string' && !!inp.concern_label
          })
          if (savedEnough) savedItsOwnMemory = true

          conversation.push({ role: 'assistant', content: turn.blocks })
          conversation.push({ role: 'user', content: results })

          stream = await callDigiStream({
            model: DIGI_MODEL,
            max_tokens: 1000,
            system: [
              { type: 'text', text: STATIC_SYSTEM, cache_control: { type: 'ephemeral' } },
              { type: 'text', text: familyContext },
            ],
            messages: conversation,
            tools: DIGI_TOOLS,
          })
        }

        // Anything held back waiting for the next chunk that never came.
        const tail = dashes.flush()
        if (tail) {
          fullText += tail
          controller.enqueue(encoder.encode(tail))
        }
      } catch {
        // Stream failed. If nothing reached the client yet, send the warm
        // apology as the reply. Partial replies are kept and not saved.
        if (!fullText) {
          try { controller.enqueue(encoder.encode(WARM_ERROR)) } catch { /* client gone */ }
        }
        fullText = ''
      } finally {
        resolveDone(fullText)
        try { controller.close() } catch { /* already closed */ }
      }
    },
  })

  // ── THE PATHWAY TICK IS WRITTEN BEFORE THE REPLY, NOT AFTER ────────────────
  //
  // Justin, 12 August 2026: "I did ask DiGi a preset question but it did not
  // update pathway... looks like pathway did update but took a while."
  //
  // The row below is the ONLY thing the pathway step reads (lib/pathway/
  // daily-tasks.ts asks whether a digi_questions row exists today). It used to
  // be written inside the after() block, which by definition only starts once
  // the response has finished streaming, and it sat at the BACK of that block
  // behind a second blocking Anthropic call and an embedding call.
  //
  // Meanwhile DigiChat's finally block fires router.refresh() the instant the
  // stream drains. So the refresh went looking for a row that was still two API
  // round trips away from existing, found nothing, drew the step as not done,
  // and the row landed seconds later. Exactly "it updated but took a while".
  //
  // A refresh was added on 8 August for this same complaint and did not fix it,
  // because the fault was never on the read side. It is a write ordering race,
  // so the write moves in front of the read: claim the row here, fill in the
  // answer in after() once there is one. The tick is true before the parent
  // sees their first word.
  //
  // Admin client because `response` is NOT NULL in migration 001 and users hold
  // no UPDATE policy on this table, only SELECT and INSERT. Best effort: a
  // failed claim costs the instant tick and nothing else, since after() still
  // writes the row the old way when there is no id to update.
  let questionRowId: string | null = null
  try {
    const { data: claimed } = await createAdminClient()
      .from('digi_questions')
      .insert({
        user_id: user.id,
        child_id: child?.id ?? null,
        stage_id: stage.id,
        question: message,
        response: '',
        lane,
      })
      .select('id')
      .single()
    questionRowId = (claimed?.id as string | undefined) ?? null
  } catch { /* the tick waits for after(), which is where it used to live */ }

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Messages-Used-Today': String(newCount),
      // Chrome DevTools renders this natively under Network then Timing, so the
      // phase breakdown is readable on any real request without opening the
      // database. CLAUDE.md rule 5 already has us in DevTools on every change.
      'Server-Timing': timer.header(),
    },
  })
}

// ─── System Prompt ─────────────────────────────────────────────────────────

interface TrackerEntry {
  week_start: string
  mood_score: number | null
  sleep_score: number | null
  social_score: number | null
  screen_mood_score: number | null
  open_communication: number | null
  concern_level: string
  notes: string | null
}
interface FeedbackEntry { feedback_date: string; question: string; parent_response: string | null; digi_insight: string | null }

function buildSystemPrompt(
  stage: ReturnType<typeof getStageFromAgeBand>,
  child: Record<string, unknown> | null,
  /** Every child on the account, so DiGi can follow whichever the parent means. */
  children: Array<{ name: string | null; age_band: string | null }>,
  onboardingAnswers: Record<string, string> | null,
  trackerHistory: TrackerEntry[],
  feedbackHistory: FeedbackEntry[],
  aiKnowledge: string = '',
  deviceGuideKnowledge: string = ''
): string {
  const aiKnowledgeBlock = aiKnowledge ? `

AI LITERACY KNOWLEDGE (the platform's curated, accurate framing on AI. When a parent asks about AI, chatbots, deepfakes, hallucinations, or using AI with their child, ground your answer in this. Do not contradict it, and never claim to know the very latest model release):
${aiKnowledge}` : ''

  // Build tracker context.
  //
  // Two things used to be thrown away here. The five dimensions were averaged
  // into one number, so six weeks of sleep at 1 out of 5 presented as a bland
  // 3.4 and DiGi never saw the thing that was actually wrong. And the trend
  // compared only the newest week with the oldest, so a family that went 5 to
  // 1 to 5 read as stable. The dimensions are named now and the trend
  // compares the average of the newer half of the window with the older half.
  let trackerContext = ''
  if (trackerHistory.length > 0) {
    const DIMS: [keyof TrackerEntry, string][] = [
      ['mood_score', 'mood'],
      ['sleep_score', 'sleep'],
      ['social_score', 'friendships'],
      ['screen_mood_score', 'mood after screens'],
      ['open_communication', 'talking openly'],
    ]
    const weekAvg = (t: TrackerEntry) => {
      const vals = DIMS.map(([k]) => t[k]).filter((v): v is number => typeof v === 'number')
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
    }
    const dimLine = (t: TrackerEntry) =>
      DIMS.filter(([k]) => typeof t[k] === 'number').map(([k, label]) => `${label} ${t[k]}`).join(', ')
    trackerContext = `\nWELLBEING TRACKER — PARENT'S OWN DATA (last ${trackerHistory.length} weeks, each score 1 to 5):\n`
    trackerContext += trackerHistory.map(t => {
      const avg = weekAvg(t)
      const dims = dimLine(t)
      return `  ${t.week_start}: ${dims || 'no scores'}${avg !== null ? ` (avg ${avg.toFixed(1)})` : ''}, concern ${t.concern_level}${t.notes ? ` — "${t.notes}"` : ''}`
    }).join('\n')

    const scores = trackerHistory.map(weekAvg).filter((v): v is number => v !== null)
    if (scores.length >= 2) {
      // trackerHistory arrives newest first. Halves, not endpoints.
      const half = Math.floor(scores.length / 2)
      const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
      const newer = mean(scores.slice(0, half || 1))
      const older = mean(scores.slice(half || 1))
      const trend = newer - older >= 0.2 ? 'improving' : older - newer >= 0.2 ? 'declining' : 'steady'
      trackerContext += `\n  Overall average: ${mean(scores).toFixed(1)}/5. Trend across the window: ${trend}.`
    }

    // The dimension that is actually low, named, because that is the one the
    // answer should be about even when the average looks fine.
    for (const [key, label] of DIMS) {
      const vals = trackerHistory.map(t => t[key]).filter((v): v is number => typeof v === 'number')
      if (vals.length >= 2 && vals.reduce((a, b) => a + b, 0) / vals.length <= 2.5) {
        trackerContext += `\n  Worth noticing: ${label} has been low across these weeks. Weigh it in your answer even when the question is about something else.`
      }
    }
  }

  // Build feedback context (what this parent has told DiGi previously)
  let feedbackContext = ''
  const answeredFeedback = feedbackHistory.filter(f => f.parent_response)
  if (answeredFeedback.length > 0) {
    feedbackContext = `\nWHAT THIS PARENT HAS TOLD DiGi (from daily reflections):\n`
    feedbackContext += answeredFeedback.map(f =>
      `  ${f.feedback_date}: "${f.question}" → Parent: "${f.parent_response}"`
    ).join('\n')
    feedbackContext += `\n\nUSE THIS to personalise today's advice. If they said something worked, acknowledge it. If something failed, adjust your approach.`
  }

  const childName = (child?.name as string | null) ?? null
  const nameRef = childName && childName !== 'Your child' ? childName : 'their child'

  // What time it actually is for the parent (UK), so DiGi never says tonight in
  // the morning. Server clock is UTC, so read it in Europe/London.
  const now = new Date()
  const londonHour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: 'numeric', hour12: false }).format(now))
  const weekday = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long' }).format(now)
  const daypart = londonHour < 6 ? 'the middle of the night' : londonHour < 12 ? 'the morning' : londonHour < 17 ? 'the afternoon' : londonHour < 21 ? 'the evening' : 'late at night'

  // Names DiGi is allowed to say, which is every child on this account and
  // nothing else.
  //
  // The previous rule named one child and forbade every other name "not even
  // once". That stops an invented name, but in a house with more than one child
  // it turns a wrong name into a locked in one: a parent asking about Ada was
  // answered about Alma, and DiGi was explicitly instructed not to switch even
  // when the parent said the other name themselves. It could not take the
  // correction. Worse, the only name it knew was whichever row happened to be
  // primary, so it was not even a guess, it was confidently the wrong child.
  //
  // The list plus a default is the honest version: still no invented names,
  // but the parent's own words decide which real child is meant.
  const realNames = children.map(c => c.name).filter((n): n is string => !!n && n !== 'Your child')
  const nameRule = realNames.length === 0
    ? `No child name has been given. Always say "your child". Never invent or use a made up name.`
    : realNames.length === 1
      ? `The child's name is ${realNames[0]}, and this family has ONE child. Use only this name. Never invent, guess, shorten, or use any other name for the child.
The memory and history below come from past conversations and CAN BE OUT OF DATE. Any other child's name in them belongs to a child no longer on this account. Ignore it entirely, and never tell this parent they have more than one child.`
      : `This family has ${realNames.length} children: ${realNames.join(', ')}. These are the ONLY names you may ever use for a child. Never invent, guess or shorten a name, and never use a name that is not on that list, including any name from our own lessons or characters.
Work out which child the parent means from what they have just said, and if they name one, that is the child, even if you were talking about a different one a moment ago. Follow the parent, always.
If it is genuinely unclear which child they mean, say "your child" or ask which one. Do not pick one and hope. When nothing points either way, assume ${realNames[0]}.
The memory and history below are written from past conversations and CAN BE OUT OF DATE. A child's name appearing there that is not on the list above belongs to a child who is no longer on this account. Ignore it entirely: never use it, never treat it as a sibling, and never tell this parent they have more children than the list shows.`

  return `RIGHT NOW: it is ${daypart} on ${weekday}, UK time. Match every time reference to this. Do not say tonight, this evening, or an evening off unless it is actually evening or night. If it is morning or afternoon and you want them to wait, say later today or this evening, never tonight.

CHILD NAME RULE: ${nameRule}

THE CHILD'S CONTEXT (the child assumed when the parent has not said which):
- Name: ${nameRef}${children.length > 1 ? `\n- Other children in this family: ${children.filter(c => c.name && c.name !== child?.name).map(c => `${c.name}${c.age_band ? ` (${c.age_band})` : ''}`).join(', ')}. The stage and streak below are for ${nameRef} only, so do not quote them about another child.` : ''}
- Stage: ${stage.id} (${stage.name}, ${stage.ages})
- Key Stage: ${stage.keyStage}, ${stage.yearGroup}
- Main challenge at onboarding: ${onboardingAnswers?.challenge ?? 'not specified'}
- Daily time this parent committed to at signup: ${onboardingAnswers?.timeCommitment ?? 'not specified'}. Keep advice and suggested actions within this budget, do not casually suggest things that need more time than they said they have.
- Streak: ${(child?.streak_weeks as number | null) ?? 0} weeks on the pathway
${trackerContext}
${feedbackContext}

STAGE-SPECIFIC CONTEXT:
${stage.digiContext}
${aiKnowledgeBlock}
${deviceGuideKnowledge}

The child's name for the reflective question example is ${nameRef}.`
}
