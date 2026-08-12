// The pure half of the check in learning loop: given two weeks of wellbeing
// scores, did the rating move, and how is that said in one plain sentence.
//
// No imports on purpose, so scripts/check-checkin-shifts.mjs can throw cases
// at every function here with node --experimental-strip-types and no token,
// the same deal checkin-dips.ts has with its own check script. The database
// halves (the cron that writes shifts, the context reader DiGi uses) live in
// lib/digi/rating-loop.ts and import from here.

export type WeekRow = {
  week_start: string
  mood_score: number | null
  sleep_score: number | null
  social_score: number | null
  screen_mood_score: number | null
  open_communication: number | null
}

export type ShiftAction = { kind: 'script' | 'plan' | 'followup' | 'moment' | 'lesson'; detail: string }

export type Shift = {
  direction: 'up' | 'down' | 'flat'
  avgNow: number
  avgPrev: number
  // Only the dimensions present in both weeks.
  dimensions: Record<string, { now: number; prev: number }>
}

// Parent facing names for the five columns, used in summaries and context.
export const DIM_LABELS: [keyof Omit<WeekRow, 'week_start'>, string][] = [
  ['mood_score', 'mood'],
  ['sleep_score', 'sleep'],
  ['social_score', 'friendships'],
  ['screen_mood_score', 'mood after screens'],
  ['open_communication', 'talking openly'],
]

export function weekAverage(row: WeekRow): number | null {
  const vals = DIM_LABELS.map(([k]) => row[k]).filter((v): v is number => typeof v === 'number')
  if (vals.length === 0) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

// A quarter of a point on a five point scale is the noise floor. One dimension
// ticking one notch on an otherwise identical week moves the average by 0.2,
// and calling that a rise would fill the brain with weather. Real movement is
// rarer and louder.
export const MOVE_THRESHOLD = 0.25

/**
 * Compare two weeks of check in scores. Returns null when either week has no
 * scores at all, because a comparison with nothing on one side is not flat,
 * it is unknown, and unknown must not write rows.
 */
export function computeShift(nowRow: WeekRow, prevRow: WeekRow): Shift | null {
  const avgNow = weekAverage(nowRow)
  const avgPrev = weekAverage(prevRow)
  if (avgNow === null || avgPrev === null) return null

  const dimensions: Record<string, { now: number; prev: number }> = {}
  for (const [key, label] of DIM_LABELS) {
    const n = nowRow[key]
    const p = prevRow[key]
    if (typeof n === 'number' && typeof p === 'number') dimensions[label] = { now: n, prev: p }
  }

  const delta = avgNow - avgPrev
  const direction = delta >= MOVE_THRESHOLD ? 'up' : delta <= -MOVE_THRESHOLD ? 'down' : 'flat'
  return { direction, avgNow: Math.round(avgNow * 100) / 100, avgPrev: Math.round(avgPrev * 100) / 100, dimensions }
}

/**
 * The one plain sentence the DiGi context and the memory row carry. Written
 * here rather than by a model so it is the same sentence every time, costs
 * nothing, and can be tested. No dashes, house rule.
 */
export function shiftSummary(childName: string, shift: Shift, actions: ShiftAction[], hadPlan: boolean): string {
  const kid = childName || 'the child'
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))
  const move =
    shift.direction === 'up'
      ? `${kid}'s wellbeing rating rose from ${fmt(shift.avgPrev)} to ${fmt(shift.avgNow)} out of 5`
      : shift.direction === 'down'
        ? `${kid}'s wellbeing rating fell from ${fmt(shift.avgPrev)} to ${fmt(shift.avgNow)} out of 5`
        : `${kid}'s wellbeing rating held steady at ${fmt(shift.avgNow)} out of 5`

  // The loudest single dimension, when one moved by a full point or more.
  let loudest: string | null = null
  let loudestDelta = 0
  for (const [label, d] of Object.entries(shift.dimensions)) {
    const delta = d.now - d.prev
    if (Math.abs(delta) >= 1 && Math.abs(delta) > Math.abs(loudestDelta)) {
      loudest = `${label} went ${delta > 0 ? 'up' : 'down'} from ${d.prev} to ${d.now}`
      loudestDelta = delta
    }
  }

  const did =
    actions.length > 0
      ? ` That week the family: ${actions.slice(0, 5).map(a => a.detail).join('; ')}.`
      : hadPlan
        ? ' That week they had an agreed plan but nothing else was recorded.'
        : ' Nothing was recorded on the platform that week.'

  return `${move}${loudest ? ` (${loudest})` : ''}.${did}`
}
