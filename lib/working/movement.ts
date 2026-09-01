import type { SupabaseClient } from '@supabase/supabase-js'

// WHAT IS WORKING, and the arithmetic behind it.
//
// Justin's brief, 13 August 2026: movement over time from concern_events, "a
// sentence a parent can say out loud, bedtime went from 5 to 8 over six
// weeks", and NO COMPOSITE SCORE, EVER.
//
// THE COMPOSITE BAN IS THE DESIGN, not a preference to be worked around later.
// A single family wellbeing number would be the easiest thing in the world to
// build from this table and it would be worthless, for two separate reasons.
//
// It would be incomparable with itself. A family carrying three concerns and a
// family carrying nine cannot share a denominator, and the moment a parent
// raises a fourth worry an honest average FALLS. So the number would drop at
// exactly the moment the parent did the right thing by telling us about
// something new, and it would climb when they gave up mentioning things.
//
// And it would bury the only useful signal. Bedtime going 5 to 8 while gaming
// slides 7 to 4 averages to no change at all, when what has actually happened
// is two different stories a parent needs to hear separately. The average is
// the one presentation that guarantees neither gets told.
//
// So everything here is PER CONCERN. Each has its own line and its own
// sentence, and the page never adds them up.
//
// HONESTY RULES, carried over from HowFarYouHaveCome, which was doing this job
// inside the passport scroll before it got a page:
//   - Backfilled rows never carry a duration, because their timestamps were
//     reconstructed rather than observed.
//   - A concern that came back is counted and said out loud, never folded into
//     the wins.
//   - Nothing is invented. Two real numbers or no sentence.

export type MovementPoint = { at: string; score: number }

export type Movement = {
  concernId: string
  label: string
  status: string
  /** Whose worry this is. Null for a family wide row. Concerns went per child
   *  with migration 194 and every child is seeded the SAME four starting
   *  worries, so without this a two child family reads two identical
   *  "Bedtime screens" lines with no way to tell whose is whose. */
  childName: string | null
  /** Every scored check in, oldest first. The line, and the only history. */
  points: MovementPoint[]
  startScore: number | null
  endScore: number | null
  /** Whole weeks between the first and last scored check in. */
  weeks: number
  /** Whether every row behind this was observed live rather than reconstructed. */
  observed: boolean
  recurrences: number
  /** What the parent had been using when it moved, most used first. */
  used: { type: string; count: number }[]
}

type EventRow = {
  concern_id: string
  event: string
  score: number | null
  score_at_start: number | null
  backfilled: boolean
  linked_type: string | null
  created_at: string
}

const WEEK = 7 * 86_400_000

export function weeksBetween(a: string, b: string): number {
  return Math.max(0, Math.floor((new Date(b).getTime() - new Date(a).getTime()) / WEEK))
}

/** How long it has been, said the way a person says it. */
export function spanWords(weeks: number): string {
  if (weeks < 1) return 'this week'
  if (weeks === 1) return 'over a week'
  if (weeks < 9) return `over ${weeks} weeks`
  const months = Math.round(weeks / 4.345)
  return months === 1 ? 'over a month' : `over ${months} months`
}

/** The name a parent would use for the thing they were doing. */
export function usedWords(type: string): string {
  switch (type) {
    case 'script': return 'the scripts'
    case 'lesson': return 'the lessons'
    case 'digi': return 'talking it through with DiGi'
    case 'moment': return 'the moments'
    case 'rightnow': return 'Right now'
    default: return 'the pathway'
  }
}

/**
 * THE SENTENCE. One concern, said out loud, exactly as Justin asked for it.
 *
 * Returns null rather than a hedge when there is nothing true to say. A page
 * that pads itself with "no data yet" rows for every concern is a page that
 * teaches a parent to stop reading it.
 */
export function movementSentence(m: Movement): string | null {
  if (m.startScore == null || m.endScore == null || m.points.length < 2) return null
  const span = m.observed ? ` ${spanWords(m.weeks)}` : ''
  if (m.endScore > m.startScore) return `${m.label} went from ${m.startScore} to ${m.endScore}${span}.`
  if (m.endScore < m.startScore) return `${m.label} slipped from ${m.startScore} to ${m.endScore}${span}.`
  return `${m.label} is holding at ${m.endScore}${span}.`
}

/**
 * Every concern this family has, with its own line and nothing averaged.
 *
 * One query for the concerns and one for the events, then all of the shaping
 * in memory, because a family has tens of rows rather than thousands and a
 * round trip per concern would cost more than the whole page.
 */
export async function getMovements(
  supabase: SupabaseClient,
  userId: string,
): Promise<Movement[]> {
  const [{ data: concerns }, { data: events }, { data: children }] = await Promise.all([
    supabase.from('concerns').select('id, label, status, child_id').eq('user_id', userId),
    supabase
      .from('concern_events')
      .select('concern_id, event, score, score_at_start, backfilled, linked_type, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true }),
    supabase.from('children').select('id, name').eq('parent_id', userId),
  ])

  if (!concerns?.length || !events?.length) return []

  const childName = new Map((children ?? []).map(k => [k.id as string, (k.name as string | null) ?? null]))

  const byConcern = new Map<string, EventRow[]>()
  for (const e of events as EventRow[]) {
    const list = byConcern.get(e.concern_id)
    if (list) list.push(e)
    else byConcern.set(e.concern_id, [e])
  }

  const out: Movement[] = []
  for (const c of concerns) {
    const rows = byConcern.get(c.id as string)
    if (!rows?.length) continue

    const points: MovementPoint[] = rows
      .filter(r => typeof r.score === 'number')
      .map(r => ({ at: r.created_at, score: r.score as number }))

    // The parent's own read of where it started: the look back answer given at
    // resolution when there is one, because people recalibrate what a 7 means
    // as they learn their own problem, otherwise the earliest number recorded.
    const lastResolved = [...rows].reverse().find(r => r.event === 'resolved') ?? null
    const startScore = lastResolved?.score_at_start ?? points[0]?.score ?? null
    const endScore = points.length ? points[points.length - 1].score : null

    const observed = !rows.some(r => r.backfilled)
    const weeks = points.length >= 2
      ? weeksBetween(points[0].at, points[points.length - 1].at)
      : 0

    // What they had been using at each check in. This is the only honest answer
    // to "what is working": a sequence of things tried alongside a line that
    // moved. Never causation, and the page says so.
    const usedCount = new Map<string, number>()
    for (const r of rows) {
      if (!r.linked_type) continue
      usedCount.set(r.linked_type, (usedCount.get(r.linked_type) ?? 0) + 1)
    }

    out.push({
      concernId: c.id as string,
      label: c.label as string,
      status: c.status as string,
      childName: c.child_id ? (childName.get(c.child_id as string) ?? null) : null,
      points,
      startScore,
      endScore,
      weeks,
      observed,
      recurrences: rows.filter(r => r.event === 'recurred').length,
      used: [...usedCount.entries()]
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
    })
  }

  // Biggest climb first, because the point of the page is the payoff. Then the
  // ones that slipped, which are the ones worth acting on. Flat and unscored
  // last: nothing to say yet is the least urgent state there is.
  const delta = (m: Movement) =>
    m.startScore != null && m.endScore != null ? m.endScore - m.startScore : null
  return out.sort((a, b) => {
    const da = delta(a), db = delta(b)
    if (da == null && db == null) return 0
    if (da == null) return 1
    if (db == null) return -1
    if (da >= 0 && db < 0) return -1
    if (db >= 0 && da < 0) return 1
    return Math.abs(db) - Math.abs(da)
  })
}
