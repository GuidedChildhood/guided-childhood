import { createAdminClient } from '@/lib/supabase/admin'
import { firstText } from '@/lib/digi/text'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'
import type { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

// Aggregate wisdom: what tends to work across ALL families, de-identified, so
// DiGi can lean on the wider track record and not only this one family's. The
// rebuild reads the real wins across the base (concerns that turned around,
// scripts marked as worked, reflections a parent said helped), distils them
// with the model into short reusable patterns, and replaces the wisdom rows.
// Only paraphrased patterns are stored, never a family's raw content, and no
// user or child id ever reaches the model.

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder',
  timeout: 120_000,
  maxRetries: 1,
})

export interface WisdomRow {
  topic: string
  age_band: string | null
  what_works: string
  evidence_count: number
}

async function callModel(prompt: string): Promise<string> {
  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  let lastError: unknown
  for (const model of models) {
    try {
      const msg = await anthropic.messages.create({ model, max_tokens: 2000, messages: [{ role: 'user', content: prompt }] })
      return firstText(msg)
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) throw err
      lastError = err
    }
  }
  throw lastError
}

export interface WisdomRebuild {
  ranAt: string
  signals: number
  written: number
  rows: WisdomRow[]
}

export async function rebuildWisdom(): Promise<WisdomRebuild> {
  const admin = createAdminClient()

  // Pull the de-identified wins. child_id and user_id are read only to join an
  // age band, never sent onward. Ages let the wisdom stay stage aware.
  //
  // The concern signals come from the append only event log (migration 164)
  // rather than the concerns table, because the current row only knows where a
  // family ended up. The log knows the shape: where it started, where it is
  // now, how long it took, and whether it came back. Scores climb as things
  // get better, 1 really tough to 10 going great. "Bedtime went 2 to 8 over
  // nine days for a 7 year old, and stayed up" is a pattern worth having.
  // "A family sorted bedtime", which is all this used to say, is not.
  //
  // Backfilled rows are excluded outright. Their timestamps were reconstructed
  // when the log was created and they carry no score, so including them
  // would put invented durations in front of the model.
  const [concernsRes, eventsRes, scriptWorkedRes, reflectionsRes, childrenRes, shiftsRes] = await Promise.all([
    admin.from('concerns').select('id, label, status, times_flagged, child_id').limit(600),
    admin.from('concern_events')
      .select('concern_id, event, score, score_at_start, created_at')
      .eq('backfilled', false)
      .order('created_at', { ascending: true })
      .limit(4000),
    admin.from('script_completions').select('script_sort_order, worked, user_id').eq('worked', 'yes').limit(600),
    admin.from('digi_feedback').select('question, parent_response').not('parent_response', 'is', null).limit(600),
    admin.from('children').select('id, parent_id, age_band'),
    // The check in shifts: a family's own weekly rating moving, paired with
    // what they did that week (migration 190). The shapes and directions are
    // read, never a parent's notes, same de-identification rule as the rest.
    admin.from('checkin_shifts')
      .select('child_id, direction, avg_now, avg_prev, actions, had_plan')
      .gte('week_start', new Date(Date.now() - 60 * 86_400_000).toISOString().slice(0, 10))
      .limit(600),
  ])

  const children = childrenRes.data ?? []
  const ageByChild = new Map(children.map(c => [c.id as string, c.age_band as string]))
  const ageByParent = new Map<string, string>()
  for (const c of children) if (!ageByParent.has(c.parent_id as string)) ageByParent.set(c.parent_id as string, c.age_band as string)

  // Group the observed events by concern so each one can be read as an arc.
  const eventsByConcern = new Map<string, typeof eventsRes.data>()
  for (const e of eventsRes.data ?? []) {
    const list = eventsByConcern.get(e.concern_id as string)
    if (list) list.push(e)
    else eventsByConcern.set(e.concern_id as string, [e])
  }

  const wins: { kind: string; text: string; age: string | null }[] = []
  // The failures, kept separate so the prompt can weigh them against the wins
  // instead of only ever seeing what worked.
  const misses: { kind: string; text: string; age: string | null }[] = []

  for (const c of concernsRes.data ?? []) {
    const rows = eventsByConcern.get(c.id as string)
    if (!rows?.length) continue

    const age = c.child_id ? ageByChild.get(c.child_id as string) ?? null : null
    const label = String(c.label)
    const resolved = [...rows].reverse().find(r => r.event === 'resolved')
    const recurrences = rows.filter(r => r.event === 'recurred').length

    const start = resolved?.score_at_start ?? rows.find(r => typeof r.score === 'number')?.score ?? null
    const end = [...rows].reverse().find(r => typeof r.score === 'number')?.score ?? null
    const moved = typeof start === 'number' && typeof end === 'number' && end > start

    const days = resolved
      ? Math.max(0, Math.round((new Date(resolved.created_at as string).getTime() - new Date(rows[0].created_at as string).getTime()) / 86400000))
      : null

    const scale = moved ? ` It went from ${start} out of 10 to ${end}.` : ''
    const took = days !== null ? ` It took about ${days} ${days === 1 ? 'day' : 'days'}.` : ''

    if (resolved && recurrences === 0) {
      wins.push({ kind: 'turnaround', text: `A family sorted "${label}" and it stayed sorted.${scale}${took}`, age })
    } else if (resolved && recurrences > 0) {
      // Sorted, but it came back on the way. Useful, and not the same as clean.
      misses.push({ kind: 'fragile', text: `A family got "${label}" sorted but it came back ${recurrences} ${recurrences === 1 ? 'time' : 'times'} first.${scale}`, age })
    } else if (moved) {
      wins.push({ kind: 'turning', text: `A family is turning "${label}" around.${scale}`, age })
    } else if ((c.times_flagged as number) >= 3) {
      misses.push({ kind: 'stuck', text: `A family has raised "${label}" ${c.times_flagged} times and it is still not sorted.`, age })
    }
  }

  const scriptWins = (scriptWorkedRes.data ?? []).map(s => ({
    kind: 'script',
    // The sort order is the script's stable identity across the library, and it
    // was being selected and then thrown away, so every script win read as an
    // anonymous "something worked" and told the model nothing.
    text: `Script ${s.script_sort_order ?? 'unknown'} worked for a family.`,
    age: s.user_id ? ageByParent.get(s.user_id as string) ?? null : null,
  }))
  const reflectionWins = (reflectionsRes.data ?? [])
    .filter(r => (r.parent_response as string | null)?.trim())
    .map(r => ({
      kind: 'reflection',
      text: `Reflection: "${(r.question as string).slice(0, 140)}" the parent said "${(r.parent_response as string).slice(0, 160)}".`,
      age: null as string | null,
    }))

  // What moved a family's own weekly rating, and what they did that week. A
  // rise with recorded actions is the most direct win signal the platform
  // holds, because the family measured it themselves. A fall under a live
  // agreed plan is the equally direct miss: the plan was tried and the week
  // got harder. Flat weeks teach nothing and are skipped.
  for (const s of shiftsRes.data ?? []) {
    const age = s.child_id ? ageByChild.get(s.child_id as string) ?? null : null
    const acts = (Array.isArray(s.actions) ? (s.actions as { detail?: string }[]) : [])
      .map(a => a.detail)
      .filter((d): d is string => Boolean(d))
      .slice(0, 4)
    const from = Number(s.avg_prev)
    const to = Number(s.avg_now)
    const scale = Number.isFinite(from) && Number.isFinite(to) ? ` It went from ${from} to ${to} out of 5.` : ''
    if (s.direction === 'up' && acts.length > 0) {
      wins.push({ kind: 'rating', text: `A family's weekly wellbeing rating rose.${scale} That week they: ${acts.join('; ')}.`, age })
    } else if (s.direction === 'down' && s.had_plan) {
      misses.push({ kind: 'rating', text: `A family's weekly wellbeing rating fell in a week with an agreed plan running${acts.length ? ` (${acts.join('; ')})` : ''}.${scale}`, age })
    }
  }

  // The misses count as signal too. A run with nothing but failures still has
  // something worth telling DiGi, and reporting the total as wins only would
  // have quietly hidden how much of the evidence was negative.
  const signals = [...wins, ...scriptWins, ...reflectionWins, ...misses]
  if (signals.length === 0) {
    return { ranAt: new Date().toISOString(), signals: 0, written: 0, rows: [] }
  }

  const prompt = `You are distilling aggregate, de-identified evidence of what works for the families using Guided Childhood, a digital parenting platform. None of this is one identifiable family. Turn the recurring patterns into a small set of reusable pieces of wisdom DiGi can lean on when it coaches a new parent.

WHAT WENT WELL (${wins.length + scriptWins.length + reflectionWins.length}, de-identified):
${[...wins, ...scriptWins, ...reflectionWins].slice(0, 240).map(s => `- [${s.age ?? 'any'}] ${s.text}`).join('\n')}
${misses.length > 0 ? `
WHAT DID NOT HOLD (${misses.length}, de-identified). These matter as much as the wins. A pattern that keeps coming back, or keeps not shifting, should make you MORE cautious about the advice around it, not less. Where a problem recurs often, say so in the wisdom itself, because a parent who is told something will fix it and then watches it return trusts nothing we say afterwards:
${misses.slice(0, 120).map(s => `- [${s.age ?? 'any'}] ${s.text}`).join('\n')}` : ''}

Write between 6 and 12 pieces of wisdom. Each is a pattern of what tends to work, phrased so DiGi can lean on it warmly and specifically, never as pressure and never as a rule. Where the evidence is mixed, say that plainly inside what_works rather than dropping the pattern or overselling it. Attach an age band only when the pattern is clearly stage specific, otherwise leave it null. Justin's voice: warm, plain, direct, no dashes.

Reply with ONLY valid JSON in this shape:
{"wisdom":[{"topic":"short name","age_band":"4-7|8-10|11-13|13-15|16+|null","what_works":"one or two sentences, the pattern and why it helps","evidence_count":number}]}
evidence_count is roughly how many signals point to this pattern.`

  const text = await callModel(prompt)
  const match = text.match(/\{[\s\S]*\}/)
  const parsed = match ? (JSON.parse(match[0]) as { wisdom?: WisdomRow[] }) : { wisdom: [] }
  const validBands = new Set(['4-7', '8-10', '11-13', '13-15', '16+'])
  const rows: WisdomRow[] = (parsed.wisdom ?? [])
    .filter(w => w && w.topic && w.what_works)
    .map(w => ({
      topic: String(w.topic).slice(0, 120),
      age_band: w.age_band && validBands.has(String(w.age_band)) ? String(w.age_band) : null,
      what_works: String(w.what_works).slice(0, 600),
      evidence_count: Math.max(1, Math.round(Number(w.evidence_count) || 1)),
    }))

  // Into the holding pen, never straight to a parent. See migration 165.
  //
  // This used to deactivate the live set and insert the new one live in the same
  // breath, on an unattended Sunday cron, so an off run reached every parent for
  // a week before anyone could have noticed. Now the candidates land pending and
  // DiGi carries on serving the last approved set until a human promotes them on
  // /dashboard/admin/wisdom.
  //
  // The old guard still holds too: a run that parses to zero rows writes nothing
  // at all, so a bad model response cannot even empty the pen.
  if (rows.length > 0) {
    await admin.from('digi_wisdom').delete().eq('pending', true)
    await admin.from('digi_wisdom').insert(rows.map(r => ({
      ...r,
      active: false,
      pending: true,
      updated_at: new Date().toISOString(),
    })))
  }

  return { ranAt: new Date().toISOString(), signals: signals.length, written: rows.length, rows }
}

// Retrieval for the DiGi context block. Same shape as getWhatWorked, but this
// is the whole community's track record, not one family's. Age matched first,
// then the message keywords nudge the ordering.
/**
 * The solutions that have actually worked, ranked by how often.
 *
 * Justin: "make DiGi learn from successes, look at positive feedback from
 * parents where they have marked a solution fixed, trace the best answers, look
 * for popular issues and moments, then be proactive on known success solutions."
 *
 * rebuildWisdom already reads the three places a success is recorded: a concern
 * a family marked resolved, a script a parent said worked, and their own written
 * feedback. What it did not do was let the ANSWER know which of those had the
 * most weight behind it. getAggregateWisdom scores mostly by word overlap, so a
 * pattern proven across many families and one seen once read the same.
 *
 * evidence_count is that weight, and it was already being stored and then thrown
 * away at retrieval. This surfaces the proven ones as their own block so DiGi can
 * lead with what has worked rather than treating it as background colour.
 *
 * Deliberately NOT a rule. A pattern that helped many families is a good place
 * to start and not a verdict, which is the whole product in one sentence, so the
 * instruction below says offer it first and stay ready to be wrong.
 */
export async function getProvenSolutions(
  supabase: SupabaseClient,
  ageBand: string | null,
  message = '',
  limit = 3,
): Promise<string> {
  const { data } = await supabase
    .from('digi_wisdom')
    .select('topic, age_band, what_works, evidence_count')
    .eq('active', true)
    // Proven means more than one family, so a single report never presents as
    // a pattern. One family's success is an anecdote and saying otherwise is
    // the overclaiming this whole brain is built to avoid.
    .gte('evidence_count', 2)
    .order('evidence_count', { ascending: false })
    .limit(30)

  if (!data || data.length === 0) return ''

  const msg = message.toLowerCase()
  const words = new Set(msg.split(/[^a-z0-9]+/).filter(w => w.length > 3))
  const scored = data.map(w => {
    let score = 0
    if (!w.age_band) score += 1
    else if (w.age_band === ageBand) score += 3
    else score -= 3
    const hay = `${w.topic} ${w.what_works}`.toLowerCase()
    for (const word of words) if (hay.includes(word)) score += 2
    // How many families, compressed. Raw counts would let one very common
    // pattern win every question regardless of what was asked, which is how a
    // guide starts answering the popular question instead of yours.
    score += Math.min(3, Math.log2((Number(w.evidence_count) || 1) + 1))
    return { w, score }
  })

  const top = scored.sort((a, b) => b.score - a.score).slice(0, limit).filter(s => s.score > 0)
  if (top.length === 0) return ''

  return '\n\nWHAT HAS ACTUALLY WORKED (patterns from families who told us the problem was solved, ranked by how many. Offer the closest one FIRST when it fits the question, in your own words, as a place to start rather than an instruction. Never give numbers of families, never name anyone, and if it does not fit, ignore it and answer normally):\n' +
    top.map(s => `- ${s.w.topic}: ${s.w.what_works}`).join('\n')
}

export async function getAggregateWisdom(
  supabase: SupabaseClient,
  ageBand: string | null,
  message = '',
  limit = 4,
): Promise<string> {
  const { data } = await supabase
    .from('digi_wisdom')
    .select('topic, age_band, what_works')
    .eq('active', true)
    .order('evidence_count', { ascending: false })
    .limit(40)

  if (!data || data.length === 0) return ''

  const msg = message.toLowerCase()
  const words = new Set(msg.split(/[^a-z0-9]+/).filter(w => w.length > 3))
  const scored = data.map(w => {
    let score = 0
    if (!w.age_band) score += 1
    else if (w.age_band === ageBand) score += 3
    else score -= 2
    const hay = `${w.topic} ${w.what_works}`.toLowerCase()
    for (const word of words) if (hay.includes(word)) score += 2
    return { w, score }
  })

  const top = scored.sort((a, b) => b.score - a.score).slice(0, limit).filter(s => s.score > -2)
  if (top.length === 0) return ''

  return '\n\nWHAT TENDS TO WORK ACROSS FAMILIES LIKE THIS ONE (aggregate, de-identified patterns from the wider Guided Childhood community, lean on these gently to reassure and suggest, never as a rule or pressure, and never say how many families):\n' +
    top.map(s => `- ${s.w.topic}: ${s.w.what_works}`).join('\n')
}
