import Anthropic from '@anthropic-ai/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'
import { digiModelsFor, stepInAllowed, ukDate, DIGI_STEP_IN_PER_WEEK } from '@/lib/config/digi'
import { firstText, stripDashes } from '@/lib/digi/text'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { horizonsFor, type Horizon } from '@/lib/digi/horizons'
import { findTriggers } from '@/lib/digi/brain'
import { readFamilyState, renderFamilyState } from '@/lib/digi/family-state'
import { getWeekParentReport } from '@/lib/balance/week-report'
import { FIXED_LINKS } from '@/lib/digi/word'
import { sendPush } from '@/lib/push/send'

// The moment reader: DiGi deciding whether to step in today.
//
// Justin, 13 September 2026: DiGi "should be able to think when to step in and
// advise the user what is best for the goals we set. Proactively looking for
// wow moments to help parents."
//
// ── WHAT THIS REPLACES ──────────────────────────────────────────────────────
//
// Stepping in used to be a calendar. findTriggers fired on four hard rules and
// then, every three days, a drumbeat: a tip, a parent care nudge, on alternate
// days a nudge to send a printable. The twice weekly word fired on Tuesday and
// Friday whatever had happened. None of it knew the goal, so none of it could
// say the thing a parent most needs, which is usually nothing.
//
// ── THE SHAPE ───────────────────────────────────────────────────────────────
//
// One reading of what CHANGED for this family since DiGi last looked (a worry
// rated higher, a lesson passed, a device arriving, a stage arriving, a
// birthday inside a month, a horizon for the next band not yet said, the
// timer unused while the balance is over), the hard signals findTriggers
// still finds, where the family stands against the goal, and what DiGi said
// before. Then one question to the model: is there something worth an
// interruption today. Most days the answer is no, and the answer is recorded
// as a quiet row so the same day is never asked twice and Justin can see how
// often DiGi chose silence, which is the product.
//
// ── THE CAP IS CODE ─────────────────────────────────────────────────────────
//
// DIGI_STEP_IN_PER_WEEK, default two, never two days running. Checked before
// the model is called (lib/config/digi.ts, stepInAllowed). The model decides
// whether; it never decides how often.
//
// ── NO MIGRATION ────────────────────────────────────────────────────────────
//
// A step in is a digi_prompts row in a kind the table already accepts. Its
// provenance is the reason column, which starts with STEP_IN_PREFIX, and the
// horizon it leaned on is the source column, so a horizon is never said twice.

export const STEP_IN_PREFIX = 'step_in:'
export const QUIET_REASON = 'step_in: quiet'
/** Marks the one change line that is a stage crossing, so it can be matched later. */
const ARRIVAL_MARK = 'STAGE ARRIVAL:'

/** The kinds the table accepts that a step in may use. new_research carries a horizon. */
export const STEP_IN_KINDS = ['watch_for', 'tip', 'parent_care', 'celebration', 'new_research'] as const
type StepInKind = (typeof STEP_IN_KINDS)[number]

export type MomentResult =
  | { ok: true; prompt: { id: string; kind: string; title: string; body: string; href: string | null } }
  | { ok: false; reason: string }

type Kid = { id: string; name: string | null; age_band: string | null; stage_id: string | null; date_of_birth: string | null; streak_weeks: number | null; is_primary: boolean | null }

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

async function callModel(system: string, user: string): Promise<string> {
  const models = digiModelsFor('chat')
  let lastError: unknown
  for (const model of models) {
    try {
      const msg = await anthropic.messages.create({ model, max_tokens: 700, system, messages: [{ role: 'user', content: user }] })
      return firstText(msg)
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) throw err
      lastError = err
    }
  }
  throw lastError
}

const SYSTEM = `You are DiGi, the evidence led guide inside Guided Childhood, a UK platform for parents of 4 to 16 year olds. You are deciding whether to say ONE thing to a parent who did not ask. Most days the right answer is no.

Justin's voice: warm, plain, direct, British. No AI phrases. No dashes of any kind anywhere, not even a hyphen between words. Never allow or deny; always a calibrated pathway. Educate, never ban. Never shame the parent or the child.

SPEAK ONLY WHEN one of these is true and the parent would be glad you did:
- Something real moved: a worry the parent rated higher, especially reaching five stars; a first lesson passed; a stage arrived; a device arrived.
- A horizon is coming: a milestone that typically lands at the NEXT age, when the child is within a few months of it and nobody has said it yet. Say it before it lands and give the one move to make now. This is the thing parents tell other parents about.
- A hard signal from the check ins: mood dropping, sleep low two weeks running, a concern the parent marked medium or high, phone and social time at an age where the guide keeps it near zero.
- The goal is one step away and the step is small.

STAY QUIET WHEN: nothing changed, the change is routine, the same angle was said before, or the parent said a previous step in did not help and the only thing to add is the same again.

WHEN YOU SPEAK: one card. A title under eight words, specific to this child by name. Two to three sentences: what you noticed (only from the facts given, never inferred from age or number of children), why it matters in one clause leaning on a named source from the bank if one fits, and the one thing to do, tonight or this week, matching the link you choose. The kind is one of: watch_for (one thing to notice and one gentle action), tip (one small improvement in daily life), parent_care (the parent's own wellbeing, permission giving), celebration (short and genuinely warm), new_research (a horizon or a finding, with its source). If anything suggests crisis, the action is a human: GP, NHS 111, Childline 0800 1111.

Return ONLY a JSON object, no prose before or after:
{"speak": true or false, "why_not": "one short line when speak is false", "kind": "...", "title": "...", "body": "...", "reason": "one line naming the change or horizon you are answering", "href": "one href from the list, copied exactly", "cta": "three to five words", "source": "the source name exactly as given, or empty"}`

const BAND_START: Record<string, number> = { '4-7': 4, '8-10': 8, '11-13': 11, '13-15': 13, '16+': 16 }
const BAND_ORDER: AgeBand[] = ['4-7', '8-10', '11-13', '13-15', '16+']

/** Months until the child's next band starts, or null when unknown or none. */
function monthsToNextBand(dob: string | null, band: AgeBand | null, now: Date): number | null {
  if (!dob || !band) return null
  const i = BAND_ORDER.indexOf(band)
  const next = BAND_ORDER[i + 1]
  if (!next) return null
  const startAge = BAND_START[next]
  const birth = new Date(dob)
  if (!Number.isFinite(birth.getTime())) return null
  const at = new Date(birth)
  at.setFullYear(birth.getFullYear() + startAge)
  return Math.round((at.getTime() - now.getTime()) / (30.4 * 86_400_000))
}

function starsOf(score: number | null | undefined): number {
  if (typeof score !== 'number') return 0
  return Math.ceil(Math.min(10, Math.max(1, score)) / 2)
}

/** Everything that changed for one child since a moment in time, in plain lines. */
async function changesSince(client: SupabaseClient, userId: string, kid: Kid, since: string): Promise<string[]> {
  const scope = `child_id.eq.${kid.id},child_id.is.null`
  const [concernsRes, lessonsRes, devicesRes, daysRes, sessionsRes, arrivalsRes] = await Promise.all([
    client.from('concerns').select('id, label').eq('user_id', userId).or(scope).in('status', ['open', 'improving', 'resolved']),
    client.from('lesson_completions').select('lesson_id, lesson_source, passed, completed_at').eq('user_id', userId).or(scope).gte('completed_at', since).limit(20),
    client.from('family_devices').select('label, kind, created_at').eq('user_id', userId).or(scope).gte('created_at', since).limit(10),
    client.from('kid_days').select('day', { count: 'exact', head: true }).eq('child_id', kid.id).not('completed_at', 'is', null).gte('completed_at', since),
    client.from('device_sessions').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('child_id', kid.id).gte('started_at', since),
    client.from('stage_arrivals').select('stage_id, prompted_at').eq('user_id', userId).eq('child_id', kid.id),
  ])
  const lines: string[] = []

  // Worries: the scored events since, with the band before, in the parent's stars.
  const concerns = (concernsRes.data ?? []) as { id: string; label: string }[]
  if (concerns.length > 0) {
    const { data: events } = await client.from('concern_events').select('concern_id, score, created_at')
      .in('concern_id', concerns.map(c => c.id)).not('score', 'is', null).order('created_at', { ascending: false }).limit(80)
    const byConcern = new Map<string, { score: number; at: string }[]>()
    for (const e of (events ?? []) as { concern_id: string; score: number; created_at: string }[]) {
      if (!byConcern.has(e.concern_id)) byConcern.set(e.concern_id, [])
      byConcern.get(e.concern_id)!.push({ score: e.score, at: e.created_at })
    }
    for (const c of concerns) {
      const evs = byConcern.get(c.id) ?? []
      const fresh = evs.filter(e => e.at >= since)
      if (fresh.length === 0) continue
      const latest = fresh[0]
      const before = evs.find(e => e.at < since)
      const now = starsOf(latest.score)
      const was = before ? starsOf(before.score) : null
      lines.push(`"${c.label}" rated ${now} star${now === 1 ? '' : 's'}${was !== null ? ` (was ${was})` : ' (first rating)'}${now === 5 ? ', the top' : ''}.`)
    }
  }

  const passes = ((lessonsRes.data ?? []) as { lesson_source: string | null; passed: boolean | null }[]).filter(l => l.passed !== false)
  if (passes.length > 0) {
    const ai = passes.filter(l => l.lesson_source === 'ai_lesson').length
    lines.push(`${passes.length} lesson${passes.length === 1 ? '' : 's'} passed${ai > 0 ? ` (${ai} of them ${kid.name ?? 'the child'}'s own AI modules)` : ''}.`)
  }
  for (const d of (devicesRes.data ?? []) as { label: string | null; kind: string | null }[]) {
    lines.push(`A new device in the house: ${d.label ?? d.kind ?? 'a device'}.`)
  }
  const days = (daysRes as { count?: number | null }).count ?? 0
  if (days > 0) lines.push(`${kid.name ?? 'The child'} finished ${days} full day${days === 1 ? '' : 's'} in their own app.`)
  const sessions = (sessionsRes as { count?: number | null }).count ?? 0
  if (sessions > 0) lines.push(`The device timer was used ${sessions} time${sessions === 1 ? '' : 's'}.`)

  // A stage the child has arrived in and nobody has yet said anything about.
  const stageNow = kid.age_band ? getStageFromAgeBand(kid.age_band as AgeBand) : null
  const arrivals = (arrivalsRes.data ?? []) as { stage_id: number; prompted_at: string | null }[]
  if (stageNow && arrivals.length === 0) {
    // The baseline the old prompts route wrote: the stage the child is in
    // when DiGi first looks is where they started, not an arrival. Without
    // this row no crossing can ever be noticed, because a crossing is a stage
    // that is not on the list.
    await client.from('stage_arrivals').insert({ user_id: userId, child_id: kid.id, stage_id: stageNow.id })
      .then(() => {}, () => { /* next look tries again */ })
  } else if (stageNow && !arrivals.some(a => a.stage_id === stageNow.id)) {
    lines.push(`${ARRIVAL_MARK} ${kid.name ?? 'The child'} has just arrived in Stage ${stageNow.id}, ${stageNow.name} (ages ${stageNow.ages}). Nobody has said what changes yet.`)
  }
  return lines
}

/**
 * Read the moment for one family and, if there is something worth saying,
 * say it. One child per step in: the primary child, or the one with the most
 * change since DiGi last looked.
 */
export async function readMoment(
  client: SupabaseClient,
  userId: string,
  opts: { now?: Date; force?: boolean } = {},
): Promise<MomentResult> {
  const now = opts.now ?? new Date()

  // The cap, before anything else costs a call. Three separate reads on
  // purpose: the quiet rows accrue one a day and would push the spoken rows
  // out of any single window, which would misread both the cap and what has
  // been said. The sources ever said are read over every kind, so a horizon
  // the word or a research card leaned on counts as said too.
  const dayStart = new Date(now.getTime() - 36 * 3_600_000).toISOString()
  const [spokenRes, quietRes, saidRes] = await Promise.all([
    client.from('digi_prompts').select('created_at, title, reason, reaction')
      .eq('user_id', userId).like('reason', `${STEP_IN_PREFIX}%`).neq('reason', QUIET_REASON)
      .order('created_at', { ascending: false }).limit(12),
    client.from('digi_prompts').select('created_at').eq('user_id', userId).eq('reason', QUIET_REASON).gte('created_at', dayStart),
    client.from('digi_prompts').select('source').eq('user_id', userId).not('source', 'is', null).limit(200),
  ])
  const spoken = (spokenRes.data ?? []) as { created_at: string; title: string; reason: string; reaction: string | null }[]
  const quietToday = ((quietRes.data ?? []) as { created_at: string }[]).some(r => ukDate(new Date(r.created_at)) === ukDate(now))
  const saidSources = new Set(((saidRes.data ?? []) as { source: string | null }[]).map(r => r.source).filter((x): x is string => !!x))
  if (!opts.force) {
    if (quietToday) return { ok: false, reason: 'looked today already' }
    const verdict = stepInAllowed(spoken.map(r => r.created_at), now)
    if (!verdict.ok) return { ok: false, reason: verdict.reason }
    const { count: pending } = await client.from('digi_prompts').select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'pending').neq('kind', 'insight')
    if ((pending ?? 0) > 0) return { ok: false, reason: 'pending' }
  }

  const { data: kidsRaw } = await client.from('children')
    .select('id, name, age_band, stage_id, date_of_birth, streak_weeks, is_primary')
    .eq('parent_id', userId).order('is_primary', { ascending: false })
  const kids = (kidsRaw ?? []) as Kid[]
  if (kids.length === 0) return { ok: false, reason: 'no child' }

  // Since DiGi last spoke, or two days, whichever is shorter.
  const lastLook = spoken[0]?.created_at ?? null
  const twoDays = new Date(now.getTime() - 2 * 86_400_000).toISOString()
  const since = lastLook && lastLook > twoDays ? lastLook : twoDays

  const perKid = await Promise.all(kids.map(async kid => ({ kid, changes: await changesSince(client, userId, kid, since).catch(() => [] as string[]) })))
  const pick = perKid.slice().sort((a, b) => b.changes.length - a.changes.length)[0]
  const kid = pick.changes.length > 0 ? pick.kid : kids[0]
  const changes = pick.changes.length > 0 ? pick.changes : []
  const band = (kid.age_band ?? null) as AgeBand | null
  const stage = band ? getStageFromAgeBand(band) : null
  const kidName = kid.name && kid.name !== 'Your child' ? kid.name : 'your child'

  const [state, checksRes, report, researchRes, scriptsRes, lessonsRes] = await Promise.all([
    readFamilyState(client, userId, kid.id, stage?.id ?? 1, band),
    client.from('wellbeing_checks').select('week_start, mood_score, sleep_score, concern_level').eq('child_id', kid.id).order('week_start', { ascending: false }).limit(4),
    getWeekParentReport(client, userId, { id: kid.id, name: kid.name, age_band: kid.age_band }).catch(() => null),
    band
      ? client.from('expert_knowledge').select('source_name, finding').eq('active', true).contains('age_bands', [band]).order('created_at', { ascending: false }).limit(10)
      : Promise.resolve({ data: [] as { source_name: string; finding: string }[] }),
    kid.stage_id ? client.from('scripts').select('sort_order, title, situation').eq('stage_id', kid.stage_id).order('sort_order').limit(30) : Promise.resolve({ data: [] }),
    kid.stage_id ? client.from('lessons').select('id, title').eq('stage_id', kid.stage_id).eq('audience', 'parent').neq('status', 'stub').limit(20) : Promise.resolve({ data: [] }),
  ])

  // The hard signals the old rules found, kept, minus the drumbeat.
  const signals = findTriggers(
    (checksRes.data ?? []) as { week_start: string; mood_score: number | null; sleep_score: number | null; concern_level: string }[],
    kid.streak_weeks ?? 0, null,
    { phoneFlag: report?.topState.key === 'phone', includeRoutine: false },
  ).map(t => t.reason)

  // The horizons, minus the ones already said, with the next band flagged.
  const months = monthsToNextBand(kid.date_of_birth, band, now)
  const horizons: (Horizon & { next: boolean })[] = horizonsFor(band)
    .filter(h => !saidSources.has(h.source))
    .map(h => ({ ...h, next: h.band !== band }))

  const research = (researchRes.data ?? []) as { source_name: string; finding: string }[]
  const scripts = (scriptsRes.data ?? []) as { sort_order: number; title: string; situation: string | null }[]
  const lessons = (lessonsRes.data ?? []) as { id: string; title: string }[]
  const links = [
    { href: '/dashboard/pathway', label: `${kidName}'s passport, the record of the whole journey` },
    ...FIXED_LINKS,
    ...lessons.map(l => ({ href: `/dashboard/lessons/${l.id}`, label: `lesson "${l.title}"` })),
    ...scripts.map(s => ({ href: `/dashboard/scripts/${s.sort_order}`, label: `script "${s.title}"${s.situation ? `: ${s.situation.slice(0, 70)}` : ''}` })),
  ]
  const allowedHrefs = new Set(links.map(l => l.href))
  const sourceNames = new Set<string>([...research.map(r => r.source_name), ...horizons.map(h => h.source)])

  const brief = [
    `THE CHILD: ${kidName}, age band ${band ?? 'unknown'}${stage ? `, Stage ${stage.id} of 5, ${stage.name} (${stage.ages})` : ''}${months !== null ? `, about ${months} month${months === 1 ? '' : 's'} from the next age band` : ''}. ${kids.length > 1 ? `The family has ${kids.length} children; this is about ${kidName} only.` : ''}`,
    `TODAY: ${ukDate(now)}. DiGi may step in at most ${DIGI_STEP_IN_PER_WEEK} times a week and has ${spoken.filter(r => new Date(r.created_at).getTime() > now.getTime() - 7 * 86_400_000).length} this week already.`,
    '',
    `WHAT CHANGED SINCE DiGi LAST LOOKED (${since.slice(0, 10)}):`,
    ...(changes.length > 0 ? changes.map(c => `- ${c}`) : ['- Nothing recorded.']),
    '',
    signals.length > 0 ? `HARD SIGNALS FROM THE CHECK INS:\n${signals.map(s => `- ${s}`).join('\n')}` : 'HARD SIGNALS FROM THE CHECK INS: none.',
    renderFamilyState(state, kidName),
    '',
    horizons.length > 0
      ? `HORIZONS NOT YET SAID (next means it lands at the NEXT age band; say one early only when the child is within a few months of it):\n${horizons.map(h => `- ${h.next ? 'NEXT BAND' : 'this band'}: ${h.what} ${h.before} (${h.source}, ${h.country})`).join('\n')}`
      : 'HORIZONS: every one for this age has been said.',
    '',
    spoken.length > 0
      ? `WHAT DiGi SAID BEFORE (never repeat an angle; a "did not help" means take a different line or stay quiet): ${spoken.slice(0, 5).map(r => `"${r.title}"${r.reaction === 'helped' ? ' (helped)' : r.reaction === 'not' ? ' (did NOT help)' : ''}`).join('; ')}.`
      : 'DiGi has not stepped in before.',
    '',
    'THE RESEARCH BANK FOR THIS AGE (name a source exactly as written, or none):',
    ...research.map(r => `- ${r.source_name}: ${r.finding.slice(0, 200)}`),
    '',
    'LINKS YOU MAY USE (copy one href exactly):',
    ...links.slice(0, 60).map(l => `- ${l.href}  ${l.label}`),
    '',
    'Decide now. Return the JSON.',
  ].join('\n')

  let decision: { speak?: boolean; why_not?: string; kind?: string; title?: string; body?: string; reason?: string; href?: string; cta?: string; source?: string } | null = null
  try {
    const text = await callModel(SYSTEM, brief)
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start !== -1 && end > start) decision = JSON.parse(text.slice(start, end + 1))
  } catch (err) {
    return { ok: false, reason: `model: ${err instanceof Error ? err.message : String(err)}`.slice(0, 200) }
  }
  if (!decision) return { ok: false, reason: 'model returned nothing usable' }

  const clean = (s: unknown) => stripDashes(String(s ?? '')).replace(/\s+/g, ' ').trim()

  // Quiet is the usual answer, and it is recorded: once per day, never shown,
  // so the same day is not asked twice and the silence is on the record.
  if (!decision.speak) {
    await client.from('digi_prompts').insert({
      user_id: userId, child_id: kid.id, kind: 'tip', status: 'dismissed',
      title: 'DiGi looked and stayed quiet', body: clean(decision.why_not).slice(0, 300) || 'Nothing worth an interruption today.',
      reason: QUIET_REASON,
    }).then(() => {}, () => { /* best effort */ })
    return { ok: false, reason: `quiet: ${clean(decision.why_not).slice(0, 120)}` }
  }

  const kind: StepInKind = (STEP_IN_KINDS as readonly string[]).includes(String(decision.kind)) ? (decision.kind as StepInKind) : 'watch_for'
  const href = allowedHrefs.has(String(decision.href)) ? String(decision.href) : '/dashboard/pathway'
  const source = decision.source && sourceNames.has(String(decision.source)) ? String(decision.source) : null
  const title = clean(decision.title).slice(0, 80)
  const body = clean(decision.body).slice(0, 600)
  if (!title || !body) return { ok: false, reason: 'model spoke without words' }

  const { data: row, error } = await client.from('digi_prompts').insert({
    user_id: userId, child_id: kid.id, kind, title, body, href, source,
    cta: clean(decision.cta).slice(0, 40) || null,
    reason: `${STEP_IN_PREFIX} ${clean(decision.reason).slice(0, 200)}`,
  }).select('id, kind, title, body, href').single()
  if (error || !row) return { ok: false, reason: `insert: ${error?.message ?? 'no row'}` }

  // A stage arrival, once SAID, is marked so it is never said again. Said
  // means the card was about it: a card about a worry that moved must not
  // quietly consume the crossing, or it is never said at all.
  const stageNow = band ? getStageFromAgeBand(band) : null
  const aboutArrival = /\b(arriv|stage|new age|secondary|senior school)/i.test(`${decision.reason ?? ''} ${decision.title ?? ''}`)
  if (stageNow && aboutArrival && changes.some(c => c.startsWith(ARRIVAL_MARK))) {
    await client.from('stage_arrivals').insert({ user_id: userId, child_id: kid.id, stage_id: stageNow.id, prompted_at: now.toISOString() })
      .then(() => {}, () => { /* next look tries again */ })
  }

  // The alert on the phone, one line. Quiet hours and mute live in sendPush.
  try {
    await sendPush({ userId, title: 'DiGi stepped in', body: title, url: href })
  } catch { /* the card on Home still carries it */ }

  return { ok: true, prompt: row as MomentResult extends { ok: true; prompt: infer P } ? P : never }
}
