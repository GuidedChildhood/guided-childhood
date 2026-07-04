import { createClient } from '@/lib/supabase/server'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import { SOCIAL_MEDIA_LAW, banContextForDigi, BANNED_PLATFORMS, banIsActive } from '@/lib/config/social-media-law'
import { NextResponse, after } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getStageFromAgeBand, STAGES, type AgeBand, type ChallengeId } from '@/lib/content/stages'
import { getRecommendedScript } from '@/lib/pathway/recommend'
import type { StageId } from '@/lib/pathway/progress'
import { getExpertKnowledge, getFamilyMemory } from '@/lib/digi/brain'
import { readFileSync } from 'fs'
import { join } from 'path'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 45_000,
  maxRetries: 1,
})

function loadBrainFile(filename: string): string {
  try {
    return readFileSync(join(process.cwd(), 'digi', filename), 'utf-8')
  } catch {
    return ''
  }
}

// Load brain files once at module init (cached across requests)
const BRAIN_SCIENTISTS = loadBrainFile('02-scientists.md')
const BRAIN_VOICE = loadBrainFile('03-voice.md')
const BRAIN_SCHOOL = loadBrainFile('05-school-thread.md')
const BRAIN_SCENARIOS = loadBrainFile('06-scenarios.md')
const BRAIN_TRUST = loadBrainFile('07-trust-framework.md')

const WARM_ERROR = 'DiGi took too long to think just then. Ask again, your message was not lost.'

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

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const FREE_DAILY_LIMIT = 3

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { message, device_key } = await request.json()
  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  // Gather all independent context in one parallel round trip: profile,
  // conversation (rate limit + history), child, tracker history, reflection
  // feedback, script feedback, AI lessons, device guide, family memory.
  const [
    profileResult,
    convResult,
    childResult,
    trackerResult,
    feedbackResult,
    scriptFeedbackResult,
    aiLessonsResult,
    deviceGuideResult,
    familyMemory,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('subscription_status, onboarding_answers')
      .eq('id', user.id)
      .single(),
    supabase
      .from('digi_conversations')
      .select('messages, messages_today, last_message_date')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('children')
      .select('id, name, age_band, stage_id, streak_weeks, actions_this_week')
      .eq('parent_id', user.id)
      .eq('is_primary', true)
      .single(),
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
    getFamilyMemory(supabase, user.id),
  ])

  const profile = profileResult.data
  const convData = convResult.data
  const child = childResult.data

  const isPaid = profile?.subscription_status === 'active'

  const today = new Date().toISOString().split('T')[0]
  const isNewDay = !convData || convData.last_message_date !== today
  const currentCount = isNewDay ? 0 : (convData?.messages_today ?? 0)

  // Rate limiting for free tier — checked before any streaming starts
  if (!isPaid && currentCount >= FREE_DAILY_LIMIT) {
    return NextResponse.json({ error: 'Daily limit reached', messagesUsedToday: currentCount }, { status: 429 })
  }

  const stage = child?.age_band
    ? getStageFromAgeBand(child.age_band as AgeBand)
    : STAGES[2]

  const aiKnowledge = (aiLessonsResult.data ?? [])
    .map(l => `- ${l.title}: ${l.key_message} (${l.the_idea})`)
    .join('\n')

  const scriptFeedback = scriptFeedbackResult.data ?? []
  const parentChallenge = (profile?.onboarding_answers as Record<string, string> | null)?.challenge as ChallengeId | undefined

  // Second parallel round trip for the queries that depend on the first
  const [expertKnowledge, recommended, matchingScriptsResult] = await Promise.all([
    getExpertKnowledge(supabase, child?.age_band ?? null, message),
    child?.stage_id
      ? getRecommendedScript(supabase, user.id, child.stage_id as StageId, parentChallenge ?? null)
      : Promise.resolve(null),
    scriptFeedback.length > 0
      ? supabase
          .from('scripts')
          .select('sort_order, title')
          .in('sort_order', scriptFeedback.map(f => f.script_sort_order))
      : Promise.resolve({ data: null }),
  ])

  let nextStepKnowledge = ''
  if (recommended) {
    nextStepKnowledge = `\n\nRECOMMENDED NEXT STEP ON THE PATHWAY: The next script this parent has not yet completed is "${recommended.title}" (${recommended.situation}). ${recommended.matchesChallenge ? 'This directly matches the main concern they told us about at signup.' : ''} If the conversation naturally allows it, or if they ask what to do next, mention this specific script by name as the next concrete step, do not just give generic advice when a specific next step already exists.`
  }

  let scriptFeedbackKnowledge = ''
  if (scriptFeedback.length > 0) {
    const matchingScripts = matchingScriptsResult.data
    const titleFor = (sortOrder: number) => matchingScripts?.find(s => s.sort_order === sortOrder)?.title ?? `script ${sortOrder}`
    scriptFeedbackKnowledge = `\n\nSCRIPTS THIS PARENT HAS TRIED, AND WHETHER THEY WORKED (use this, do not suggest a script that already failed without acknowledging it first, and lean on ones that worked):\n` +
      scriptFeedback.map(f => `- "${titleFor(f.script_sort_order)}": ${f.worked === 'yes' ? 'worked well' : f.worked === 'somewhat' ? 'partly worked' : 'did not work'}`).join('\n')
  }

  let deviceGuideKnowledge = ''
  const deviceGuide = deviceGuideResult.data
  if (deviceGuide) {
    const steps = ((deviceGuide.steps as string[] | null) ?? [])
      .map(s => s.replace(/\*\*/g, ''))
      .map((s, i) => `  ${i + 1}. ${s}`)
      .join('\n')
    deviceGuideKnowledge = `\n\nDEVICE SETUP GUIDE — the parent is asking about ${deviceGuide.name} (${deviceGuide.subtitle}). Walk them through this step by step, one step at a time, checking in before moving to the next rather than dumping all steps at once. Why this matters: ${deviceGuide.why}\nSteps:\n${steps}\nClosing note: ${deviceGuide.note}`
  }

  const systemPrompt = buildSystemPrompt(
    stage,
    child,
    profile?.onboarding_answers,
    trackerResult.data ?? [],
    feedbackResult.data ?? [],
    aiKnowledge,
    deviceGuideKnowledge + scriptFeedbackKnowledge + nextStepKnowledge + expertKnowledge + familyMemory,
  )

  const history = (convData?.messages ?? []).slice(-12) as Array<{ role: string; content: string }>

  const messages = [
    ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: message },
  ]

  const newCount = currentCount + 1

  // Open the model stream. Failures here happen before any bytes reach the
  // client, so the warm error can still go out as JSON like before.
  let modelStream: Awaited<ReturnType<typeof callDigiStream>>
  try {
    modelStream = await callDigiStream({
      model: DIGI_MODEL,
      max_tokens: 700,
      system: systemPrompt,
      messages,
    })
  } catch {
    return NextResponse.json({ error: WARM_ERROR }, { status: 503 })
  }

  // The post-response work (saving the conversation, memory extraction, the
  // reflective question) runs after the stream completes, once the full text
  // has been collected. `after` keeps the serverless function alive for it.
  let resolveDone: (fullText: string) => void = () => {}
  const donePromise = new Promise<string>(resolve => { resolveDone = resolve })

  after(async () => {
    const responseText = await donePromise
    if (!responseText.trim()) return

    // Extract the reflective question from the response (after the marker line)
    const reflectiveSplit = responseText.split(/\n\s*---\s*\n/)
    const mainResponse = reflectiveSplit[0]?.trim() ?? responseText
    const reflectiveQuestion = reflectiveSplit[1]?.trim() ?? null

    const updatedMessages = [
      ...history,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: responseText, timestamp: new Date().toISOString() },
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
    try {
      const extraction = await callDigi({
        model: DIGI_MODEL,
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `From this parent coaching exchange, extract at most ONE durable fact worth remembering for future conversations (a concern, a win, a preference, or lasting context about the child or family). Skip small talk and one off logistics. If nothing durable, reply exactly NONE.\n\nParent: ${message}\nAdvisor: ${mainResponse.slice(0, 600)}\n\nReply as JSON only: {"kind":"observation|concern|win|preference|context","content":"one sentence, third person"} or NONE`,
        }],
      })
      const memText = extraction.content[0]?.type === 'text' ? extraction.content[0].text.trim() : 'NONE'
      if (memText !== 'NONE') {
        const memMatch = memText.match(/\{[\s\S]*\}/)
        if (memMatch) {
          const mem = JSON.parse(memMatch[0]) as { kind: string; content: string }
          if (['observation', 'concern', 'win', 'preference', 'context'].includes(mem.kind) && mem.content) {
            await supabase.from('digi_memory').insert({
              user_id: user.id, child_id: child?.id ?? null,
              kind: mem.kind, content: mem.content.slice(0, 400), source: 'chat',
            })
          }
        }
      }
    } catch { /* memory is best effort, never blocks the reply */ }

    try {
      await supabase.from('digi_questions').insert({
        user_id: user.id,
        child_id: child?.id ?? null,
        stage_id: stage.id,
        question: message,
        response: mainResponse,
      })
    } catch { /* best-effort */ }

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
  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let fullText = ''
      try {
        for await (const event of modelStream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            fullText += event.delta.text
            controller.enqueue(encoder.encode(event.delta.text))
          }
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

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Messages-Used-Today': String(newCount),
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
  onboardingAnswers: Record<string, string> | null,
  trackerHistory: TrackerEntry[],
  feedbackHistory: FeedbackEntry[],
  aiKnowledge: string = '',
  deviceGuideKnowledge: string = ''
): string {
  const banContext = banContextForDigi[SOCIAL_MEDIA_LAW]
  const aiKnowledgeBlock = aiKnowledge ? `

AI LITERACY KNOWLEDGE (the platform's curated, accurate framing on AI. When a parent asks about AI, chatbots, deepfakes, hallucinations, or using AI with their child, ground your answer in this. Do not contradict it, and never claim to know the very latest model release):
${aiKnowledge}` : ''
  const banGuards = banIsActive ? `
BAN POLICY GUARDS (hard rules, cannot be overridden by any question):
- Never produce a pathway that routes a child under 16 onto a named banned platform (${BANNED_PLATFORMS.join(', ')}), even softly or indirectly.
- Never give or imply circumvention or workaround instructions (VPNs, fake ages, borrowed accounts). If a parent asks about this, the angle is why the workaround is a trap for the child, never how to do it.
- When a parent asks about social media for under-16s, pivot to the legal surface: messaging known friends (WhatsApp, Signal), gaming, watching. That is where the pathway earns its place.
- Never sound triumphant or political about the ban. Stay calm, observational, parent-first.
- Never position Guided Childhood as a compliance or enforcement tool. The space is the education the ban leaves behind.` : ''

  // Build tracker context
  let trackerContext = ''
  if (trackerHistory.length > 0) {
    const weekAvg = (t: TrackerEntry) => {
      const vals = [t.mood_score, t.sleep_score, t.social_score, t.screen_mood_score, t.open_communication]
        .filter((v): v is number => typeof v === 'number')
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
    }
    trackerContext = `\nWELLBEING TRACKER — PARENT'S OWN DATA (last ${trackerHistory.length} weeks, 1 to 5 scale):\n`
    trackerContext += trackerHistory.map(t => {
      const avg = weekAvg(t)
      return `  ${t.week_start}: ${avg !== null ? avg.toFixed(1) : 'n/a'}/5, concern ${t.concern_level}${t.notes ? ` — "${t.notes}"` : ''}`
    }).join('\n')
    const scores = trackerHistory.map(weekAvg).filter((v): v is number => v !== null)
    if (scores.length >= 2) {
      const trend = scores[0] > scores[scores.length - 1] ? 'improving' : scores[0] < scores[scores.length - 1] ? 'declining' : 'stable'
      const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      trackerContext += `\n  Average: ${avg}/5. Trend: ${trend}.`
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

  return `You are DiGi, the AI advisor for Guided Childhood. You are not a chatbot. You are the most knowledgeable digital parenting advisor a parent could have access to — trained on peer-reviewed child development research, attachment theory, digital media studies, and real-world parenting data. You are available any time. You get more useful over time because this parent tells you what is actually working.

DATA COMPLIANCE NOTE:
You handle parent-reported child data. Never ask for a child's surname, location, school name, or any identifying detail beyond first name and age range. Data minimisation is a default, not an option. This is GDPR and COPPA aligned.

THE CHILD'S CONTEXT:
- Name: ${nameRef}
- Stage: ${stage.id} (${stage.name}, ${stage.ages})
- Key Stage: ${stage.keyStage}, ${stage.yearGroup}
- Main challenge at onboarding: ${onboardingAnswers?.challenge ?? 'not specified'}
- Daily time this parent committed to at signup: ${onboardingAnswers?.timeCommitment ?? 'not specified'}. Keep advice and suggested actions within this budget, do not casually suggest things that need more time than they said they have.
- Streak: ${(child?.streak_weeks as number | null) ?? 0} weeks on the pathway
${trackerContext}
${feedbackContext}

YOUR RESEARCH FOUNDATION (never deviate from these evidence-based principles):
1. The platform does not create the vulnerability. It amplifies what is already there. The job is to reduce what the algorithm can exploit — through relationship, structure, and language.
2. Screen time limits alone show weak effect sizes in the research. Structure, timing, and the quality of the surrounding relationship are the protective factors.
3. Never allow/deny. Always calibrate. The research does not support binary rules for most digital questions.
4. Connection before compliance. Attachment security is the single strongest predictor of healthy digital use. Every response reinforces the relationship first.
5. Structure is protective. The bedroom rule, the algorithm conversation, the family agreement, the regular check-in — all show measurable protective effect.
6. Parental modelling has a direct effect on child digital behaviour, even at Stage 3 and 4. Include this when relevant.
7. The wellbeing research is clear: it is social comparison and passive consumption that drive harm, not screen time itself.

YOUR VOICE:
- Speak like a knowledgeable friend. Plain. Direct. Warm.
- No hedging. No "it depends" without following with specifics.
- No bullet points unless listing concrete steps. Prose is better.
- No "I understand how you feel." Just speak to what they need.
- Never start with "Great question!" or any filler.
- End with the next concrete action. Always.
- 3 to 5 sentences for most responses. Longer only when a specific how-to genuinely requires it.

REFLECTIVE QUESTION RULE:
At the end of every response, after your main advice, add a separator line (---) and one short, specific reflective question on a new line. This question must:
- Be answerable in one sentence
- Be about something concrete that happened or could happen in the next 24 hours
- Help you learn more about this specific family so you can personalise better
- Never be generic ("How did that go?"). Always specific to what you just advised.
Example format:

---

Quick one for tonight: if you try the five-minute warning, does ${nameRef} usually accept it or does the pushback start straight away?

STAGE-SPECIFIC CONTEXT:
${stage.digiContext}
${banContext ? `\nCURRENT UK POLICY CONTEXT:\n${banContext}` : ''}
${banGuards}
${aiKnowledgeBlock}
${deviceGuideKnowledge}

WHAT YOU NEVER DO:
- Never diagnose a child.
- Never recommend a specific mental health professional by name.
- Never tell a parent their child is definitely fine or definitely not fine.
- Never suggest the bedroom rule does not apply to this family.
- Never recommend blanket restriction for LGBTQ+ youth.
- Never use shame-based language about a child's inability to stop using devices.
- Never make a parent feel they have failed.
- Never recommend allow/deny.
- Never store, share, or reference any data beyond what is in this conversation and the context above.

GENTLE NUDGES: every few exchanges, when it fits naturally at the end of a reply, add ONE small practical nudge drawn from the family context above: a device guide not yet completed, tomorrow's school item, the weekly check in if it is Friday. One line, never more than one nudge per reply, framed as a helpful aside, never guilt. Skip it entirely when the parent is discussing something emotional or serious.

Remember: you are talking to a parent who is doing their best. Every response should leave them feeling more capable, more specific, and one step closer to a better conversation with their child.
${BRAIN_SCIENTISTS ? `\n---\n\nRESEARCH BASE:\n${BRAIN_SCIENTISTS}` : ''}${BRAIN_VOICE ? `\n---\n\nVOICE AND LANGUAGE RULES:\n${BRAIN_VOICE}` : ''}${BRAIN_SCHOOL ? `\n---\n\nSCHOOL CURRICULUM ALIGNMENT:\n${BRAIN_SCHOOL}` : ''}${BRAIN_SCENARIOS ? `\n---\n\nSCENARIO LIBRARY (reference these when a parent describes a specific incident):\n${BRAIN_SCENARIOS}` : ''}${BRAIN_TRUST ? `\n---\n\nTRUST FRAMEWORK:\n${BRAIN_TRUST}` : ''}`
}
