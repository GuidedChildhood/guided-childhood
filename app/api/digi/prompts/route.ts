import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { digiModelsFor } from '@/lib/config/digi'
import { findTriggers, SHARE_NUDGE_REASON, PHONE_FLAG_REASON } from '@/lib/digi/brain'
import { getWeekParentReport } from '@/lib/balance/week-report'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { hasFullAccess } from '@/lib/access'
import { getRecommendedScript } from '@/lib/pathway/recommend'
import { getStageProgress, type StageId } from '@/lib/pathway/progress'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

async function createWithFallback(params: Omit<Anthropic.MessageCreateParamsNonStreaming, 'model'>) {
  const models = digiModelsFor('prompts')
  let lastError: unknown
  for (const model of models) {
    try {
      return await anthropic.messages.create({ ...params, model })
    } catch (e) { lastError = e }
  }
  throw lastError
}

// GET: the parent's pending proactive prompts. If the family's data has
// tripped a trigger and nothing is pending, DiGi writes fresh prompts first,
// grounded in the expert knowledge base and what it remembers. This runs on
// dashboard visits, so DiGi leads without needing the parent to ask.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const [{ data: pending }, { data: kids }, { data: lastPrompt }] = await Promise.all([
    supabase.from('digi_prompts').select('id, kind, title, body, href, created_at, outcome_id').eq('user_id', user.id).eq('status', 'pending').order('created_at', { ascending: false }).limit(3),
    // Every child, not only the primary. The prompt needs the full roster so it
    // can say which names are real, and so a second child is not invented from
    // a stale memory row.
    supabase.from('children').select('id, name, age_band, stage_id, streak_weeks, is_primary').eq('parent_id', user.id).order('is_primary', { ascending: false }),
    supabase.from('digi_prompts').select('created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ])

  type PromptChild = { id: string; name: string | null; age_band: string | null; stage_id: string | null; streak_weeks: number | null; is_primary: boolean | null }
  const children = (kids ?? []) as PromptChild[]
  const child = children.find(c => c.is_primary) ?? children[0] ?? null

  if ((pending ?? []).length > 0 || !child) {
    return NextResponse.json({ prompts: pending ?? [] })
  }

  // ── EVERY CHILD IS SCANNED FOR SIGNALS, NOT THE PRIMARY ONE ───────────────
  //
  // From Justin's DiGi audit, 19 August 2026: DiGi must be "proactive on advice
  // that matches child and age".
  //
  // It was proactive for ONE child. The signal scan read is_primary and nothing
  // else, so a mood dip on Olga's weekly check, low sleep two weeks running, a
  // phone flag on her balance, none of it could ever trip a prompt. The
  // proactive half of DiGi was blind to every child but the first, which is the
  // same is_primary fault as everywhere else this week, in the one place whose
  // whole job is noticing.
  //
  // Signals are per child: wellbeing checks, the balance phone flag, the
  // streak. The routine cadence pair, a daily life tip and parent care, is
  // about the FAMILY, so only the first scan carries it; without that a three
  // child family got three copies of the same tip.
  // ── "THIS IS THE AGE": a crossing into a new stage fires ONCE ─────────────
  //
  // Justin, 19 August 2026: "this is the age, social media, school peers
  // talking about WhatsApp, base it on the research." The platform guides have
  // always known WHERE things become real (first_seen_stage); this is the watch
  // for a child CROSSING there, so the advice arrives before the problem, which
  // is the one moment no reactive product can own.
  //
  // A child's first ever scan writes a silent baseline mark, because telling a
  // parent about the stage their child is already mid way through is a lecture,
  // not an arrival. The mark is written AT TRIGGER TIME, not at delivery: a
  // missed arrival prompt is a lost nicety, a repeated one is spam, so dedupe
  // outranks delivery.
  const { data: arrivalRows } = await supabase
    .from('stage_arrivals').select('child_id, stage_id').eq('user_id', user.id)
  const marked = new Map<string, Set<number>>()
  for (const r of (arrivalRows ?? []) as { child_id: string; stage_id: number }[]) {
    if (!marked.has(r.child_id)) marked.set(r.child_id, new Set())
    marked.get(r.child_id)!.add(r.stage_id)
  }

  const perChild: { kid: PromptChild; triggers: ReturnType<typeof findTriggers> }[] = []
  for (const [i, kid] of children.entries()) {
    const { data: checks } = await supabase
      .from('wellbeing_checks')
      .select('week_start, mood_score, sleep_score, concern_level')
      .eq('child_id', kid.id)
      .order('week_start', { ascending: false })
      .limit(4)
    // Fail soft, a balance read that errors must never block the routine prompts.
    const report = await getWeekParentReport(supabase, user.id, { id: kid.id, name: kid.name, age_band: kid.age_band }).catch(() => null)
    const t = findTriggers(checks ?? [], kid.streak_weeks ?? 0, lastPrompt?.created_at ?? null, {
      phoneFlag: report?.topState.key === 'phone',
      includeRoutine: i === 0,
    })
    // The arrival check, after the signal scan so its trigger can lead.
    const stageNow = kid.age_band ? getStageFromAgeBand(kid.age_band as AgeBand) : null
    if (stageNow) {
      const seen = marked.get(kid.id)
      if (!seen || seen.size === 0) {
        // First ever scan: baseline, silently.
        await supabase.from('stage_arrivals')
          .insert({ user_id: user.id, child_id: kid.id, stage_id: stageNow.id })
          .then(() => {}, () => { /* next scan tries again */ })
      } else if (!seen.has(stageNow.id)) {
        const { error: markErr } = await supabase.from('stage_arrivals')
          .insert({ user_id: user.id, child_id: kid.id, stage_id: stageNow.id, prompted_at: new Date().toISOString() })
        // Only fire if OUR insert took the row: two requests racing here both
        // see the stage unmarked, and the unique key makes the second insert
        // fail, so the parent gets one card rather than two.
        if (!markErr) {
          t.push({
            kind: 'stage_arrival',
            reason: `${kid.name ?? 'This child'} has just arrived in Stage ${stageNow.id}, ${stageNow.name} (ages ${stageNow.ages}). Say what genuinely changes at this age and the ONE conversation worth having this week, before it comes up on its own.`,
          })
        }
      }
    }
    if (t.length > 0) perChild.push({ kid, triggers: t })
  }

  // Two prompts a day at most, whole family, same budget as before. A signal
  // about a child outranks the routine drumbeat, so the cap trims tips before
  // it trims a mood dip.
  const rank = (k: string) => k === 'stage_arrival' ? 0 : (k === 'watch_for' || k === 'celebration') ? 1 : 2
  const flat = perChild
    .flatMap(({ kid, triggers }) => triggers.map(t => ({ kid, t })))
    // Arrivals first: they fire once every two or three years per child, so
    // when one exists it IS the news. Then signals, then the routine drumbeat.
    .sort((a, b) => rank(a.t.kind) - rank(b.t.kind))
    .slice(0, 2)
  if (flat.length === 0) return NextResponse.json({ prompts: [] })

  // DiGi knows the pathway: where this family stands on the road to 16, how
  // far through the stage they are, what they told us the problem was, what
  // keeps coming up, and the exact next script with their child's name on it.
  // This is what turns a generic tip into a prompt that reads like it was
  // written by someone walking beside them.
  const stage = child.age_band ? getStageFromAgeBand(child.age_band as AgeBand) : null
  const { data: profile } = await supabase
    .from('profiles').select('onboarding_answers, subscription_status, trial_ends_at, created_at').eq('id', user.id).maybeSingle()
  const challenge = (profile?.onboarding_answers as Record<string, string> | null)?.challenge ?? null

  // What the arriving stage actually contains: the platforms that become real
  // there, by the guides' own first_seen_stage, and the arrival research
  // stamped in migration 218. Fetched only when an arrival fired.
  const arrivals = flat.filter(f => f.t.kind === 'stage_arrival')
  const [{ data: stagePlatforms }, { data: arrivalKnowledge }] = arrivals.length > 0
    ? await Promise.all([
        supabase.from('social_platform_guides')
          .select('name, min_age, first_seen_stage')
          .lte('first_seen_stage', Math.max(...arrivals.map(a => getStageFromAgeBand(a.kid.age_band as AgeBand).id)))
          .order('first_seen_stage', { ascending: false }).limit(8),
        supabase.from('expert_knowledge')
          .select('source_name, finding, age_bands')
          .eq('active', true).contains('topics', ['stage_arrival']).limit(10),
      ])
    : [{ data: null }, { data: null }]

  const [{ data: knowledge }, { data: norms }, { data: memory }, { data: concerns }, progress, recommended] = await Promise.all([
    supabase.from('expert_knowledge').select('source_name, finding').eq('active', true).limit(24),
    // The parent wellbeing "normal moments" library, pulled on its own so a
    // parent_care prompt is grounded in a real normalised position rather than
    // improvised. Retrieval is by the normal_moments topic seeded in 054.
    supabase.from('expert_knowledge').select('source_name, finding').eq('active', true).contains('topics', ['normal_moments']).limit(8),
    supabase.from('digi_memory').select('kind, content').eq('user_id', user.id).eq('active', true).order('created_at', { ascending: false }).limit(8),
    // This child's worries plus the household's, so a prompt about the
    // youngest does not lean on the teenager's ledger.
    supabase.from('concerns').select('label, status, times_flagged').eq('user_id', user.id).or(`child_id.eq.${child.id},child_id.is.null`).in('status', ['open', 'improving']).order('last_flagged_at', { ascending: false }).limit(3),
    child.stage_id
      ? getStageProgress(supabase, user.id, child.stage_id as StageId, child.streak_weeks ?? 0, child.id).catch(() => null)
      : Promise.resolve(null),
    child.stage_id
      ? getRecommendedScript(supabase, user.id, child.stage_id as StageId, (challenge as never) ?? null, { preferFree: !hasFullAccess(profile, user.email) }).catch(() => null)
      : Promise.resolve(null),
  ])

  const pathwayContext = [
    stage ? `Stage ${stage.id} of 5, ${stage.name} (${stage.ages}).` : null,
    progress ? `${progress.overallPct}% of the way through this stage.` : null,
    (child.streak_weeks ?? 0) > 0 ? `${child.streak_weeks} week streak on the pathway.` : null,
    challenge ? `The problem they signed up with: ${String(challenge).replace(/_/g, ' ')}.` : null,
    (concerns ?? []).length > 0
      ? `Live concerns they keep flagging: ${(concerns ?? []).map(c => `${c.label} (${c.status === 'improving' ? 'getting better' : 'still open'}, flagged ${c.times_flagged}x)`).join('; ')}.`
      : null,
    recommended ? `The exact next script on their pathway: "${recommended.title}" (${recommended.situation}).` : null,
  ].filter(Boolean).join('\n')

  try {
    const response = await createWithFallback({
      max_tokens: 900,
      messages: [{
        role: 'user',
        content: `You are DiGi, the warm and evidence grounded parenting guide inside Guided Childhood. Write ${flat.length} short proactive prompts for this parent, one per trigger below. Each prompt is a small card the parent sees on their dashboard before they ask anything.

Children: ${children.map(c => `${c.name} (age band ${c.age_band})`).join(', ')}.
Each trigger below names the child it is about. The prompt you write for it MUST
be about THAT child, by name, at their age. Advice tuned to the wrong sibling's
age is worse than generic advice, so never blur them.
${(() => {
    const names = children.map(c => c.name).filter((n): n is string => !!n && n !== 'Your child')
    return `CHILD NAME RULE, ABSOLUTE. This family has ${names.length === 1 ? 'ONE child' : `${names.length} children`}: ${names.join(', ')}. That list is complete and it is the only source of truth. Use no other name for a child, ever, and never say or imply the family has more children than are on that list.
The memory notes below are written from past conversations and CAN BE OUT OF DATE. A name in them that is not on the list above is a child who is no longer on this account, or was never one. Ignore it completely. Do not carry it into a prompt, do not treat it as a sibling, and do not reason about a relationship between it and a real child.`
  })()}

WHERE THIS FAMILY IS ON THE PATHWAY (you know their road, use it: name the stage, the progress, the concern, or the exact next script by title when it makes the prompt land harder, so the parent feels you genuinely know where they are):
${pathwayContext || 'Just getting started.'}

Triggers:
${flat.map(({ kid, t }, i) => `${i + 1}. kind=${t.kind}, about ${kid.name}: ${t.reason}`).join('\n')}
${arrivals.length > 0 ? `
STAGE ARRIVAL MATERIAL (for the stage_arrival trigger only). A stage_arrival
prompt is written for the child named in its trigger, at their NEW age. Lead
with the one thing that changes socially at this age, name at most one platform
from the list below where it is genuinely the age peers start talking about it
(WhatsApp class chats at the move to secondary, for example), and end with one
concrete conversation to have this week, framed as getting ahead rather than as
a warning. Never a list of platforms, never alarm. Cite a source name from the
research when a claim leans on it.
Platforms that become real at or before this stage (name, their own minimum age):
${(stagePlatforms ?? []).map(p => `- ${p.name}, min age ${p.min_age}, from stage ${p.first_seen_stage}`).join('\n') || '- (none listed)'}
What the research says about arrivals at this age:
${(arrivalKnowledge ?? []).filter(k => arrivals.some(a => (k.age_bands as string[] | null)?.includes(a.kid.age_band ?? ''))).map(k => `- ${k.source_name}: ${k.finding}`).join('\n') || '- (none for this band)'}` : ''}

What you remember about this family:
${(memory ?? []).map(m => `- ${m.content}`).join('\n') || '- nothing yet'}

Expert knowledge you may draw on (cite the source name inside the body when used):
${(knowledge ?? []).map(k => `- ${k.source_name}: ${k.finding}`).join('\n')}

NORMAL MOMENTS the parent may be feeling bad about (ground any parent_care prompt in one of these: name the everyday moment plainly, say what the research below shows is normal and cite the source name, then offer one small permission giving thing to do. The job is to stand beside them, never to guilt them):
${(norms ?? []).map(k => `- ${k.source_name}: ${k.finding}`).join('\n') || '- (none seeded yet)'}

GROUNDING, and this outranks being warm or insightful:
Only ever describe this family's situation using what is actually listed above,
which is the concerns they raised as moments, what you remember from DiGi, and
the pathway facts. Never infer a situation from the child's age, the number of
children, or anything else, and never state it as fact that something is going
on unless it appears above. If nothing is listed, write the prompt WITHOUT any
claim about their circumstances rather than inventing one.

A sentence like "raising two children at very different stages, with device
conflicts still live" is only allowed if BOTH halves came from the lists above.
A parent reading a confident description of a problem they never mentioned stops
believing the ones you get right, so an ungrounded observation costs more than
it adds.

Rules: warm, plain, direct, no alarmism, never diagnose. watch_for prompts describe one concrete thing to notice this week and one gentle action. If a watch_for reason is about phone and social at a young age, write it especially warmly and without alarm: name that at ${child.name}'s age we keep phone and social near zero, say plainly that it is the type of screen and not the total, and suggest one hands on swap to do instead, never a telling off and never a ban. tip prompts give one small daily life improvement (school run conversations, mealtimes, bedtime handover). If a tip trigger reason is about sharing a printable or lesson, write a short warm nudge to open Printables and send ${child.name} a printable so they earn stars (a real page of ready to print sheets), and make it feel like a treat not a task. parent_care prompts are about the parent's own wellbeing, grounded in a NORMAL MOMENT above, permission giving in tone, and they gently point to giving yourself space or letting the child be bored or play alone when it fits. celebration prompts are short and genuinely warm. If anything suggests crisis, the action is always a human: GP, NHS 111, Childline 0800 1111. No dashes in the text. Return ONLY a JSON array: [{"kind":"...","title":"max 8 words","body":"2 to 3 sentences","reason":"the trigger reason verbatim"}]`,
      }],
    })

    const text = response.content.filter(b => b.type === 'text').map(b => (b as { text: string }).text).join('')
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) return NextResponse.json({ prompts: [] })
    const items = JSON.parse(match[0]) as { kind: string; title: string; body: string; reason: string }[]

    const rows = items
      .filter(p => ['watch_for', 'tip', 'parent_care', 'new_research', 'celebration', 'stage_arrival'].includes(p.kind))
      .slice(0, 2)
      .map(p => ({
        // The prompt is filed against the child whose trigger produced it,
        // matched on the verbatim reason the model is required to echo back.
        // A prompt about Olga's sleep filed under Teo would put her worry on
        // his record, which is the exact fault this route existed to have.
        user_id: user.id,
        child_id: flat.find(f => f.t.reason === p.reason)?.kid.id ?? child.id,
        kind: p.kind, title: p.title, body: p.body, reason: p.reason,
        // A share nudge deep links straight to the Printables library, a real
        // page of real sheets, so the notification opens exactly what it names
        // and never lands on a hub with nothing to actually print.
        href: p.reason === SHARE_NUDGE_REASON ? '/dashboard/printables'
          : p.reason === PHONE_FLAG_REASON ? '/dashboard/stats'
          // An arrival card opens the road, which is where the new stage is
          // drawn: what it asks, what it unlocks, and the lessons for it.
          : p.kind === 'stage_arrival' ? '/dashboard/road'
          : null,
      }))

    if (rows.length > 0) await supabase.from('digi_prompts').insert(rows)

    const { data: fresh } = await supabase
      .from('digi_prompts').select('id, kind, title, body, href, created_at, outcome_id')
      .eq('user_id', user.id).eq('status', 'pending')
      .order('created_at', { ascending: false }).limit(3)
    return NextResponse.json({ prompts: fresh ?? [] })
  } catch {
    return NextResponse.json({ prompts: [] })
  }
}

// PATCH: mark a prompt seen, dismissed or acted.
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  if (!id || !['seen', 'dismissed', 'acted'].includes(status)) {
    return NextResponse.json({ error: 'missing or invalid id / status' }, { status: 400 })
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase.from('digi_prompts').update({ status }).eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
