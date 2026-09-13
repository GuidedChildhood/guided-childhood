// Is the habit forming? The numbers the founder reads, from one table.
//
// Justin, 13 September 2026: a Duolingo grade habit, "do not stop until that
// works". Nothing measured it: the product pulse counted active families from
// quest ticks and screen time spends and never read daily_sessions, so a loop
// could be quietly dying and the dashboard would say families were active.
//
// Pure, so scripts/check-habit-loop.mjs can run a simulated month through it.
// Duolingo reports DAU over MAU, day one and day seven retention and streak
// length. These are the same four, in the words a parent would use.

export type SessionRow = { user_id: string; session_date: string }

export type HabitMetrics = {
  /** Families who completed at least one day in the last 7 days. */
  dayDoneFamilies7d: number
  /** Of families with any completed day ever in the window, the share who did one in the last 7 days. 0 to 100. */
  dayDoneRate7d: number | null
  /** Current streak lengths, bucketed: 1, 2 to 6, 7 to 29, 30 and up. */
  streakBuckets: { one: number; two_to_six: number; week_plus: number; month_plus: number }
  /** Of families who completed a day 7 to 13 days ago, the share who completed one in the last 7 days. 0 to 100. */
  returnedD7: number | null
  /** Families on a streak of 7 or more. */
  perfectWeeks: number
}

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** Consecutive completed days ending today or yesterday. 0 when neither. */
export function currentStreak(dates: Set<string>, today: string): number {
  let day = dates.has(today) ? today : dates.has(addDays(today, -1)) ? addDays(today, -1) : null
  if (!day) return 0
  let n = 0
  while (dates.has(day)) { n++; day = addDays(day, -1) }
  return n
}

export function habitMetrics(sessions: SessionRow[], today: string): HabitMetrics {
  const byUser = new Map<string, Set<string>>()
  for (const s of sessions) {
    if (!s.user_id || !s.session_date) continue
    if (!byUser.has(s.user_id)) byUser.set(s.user_id, new Set())
    byUser.get(s.user_id)!.add(s.session_date)
  }
  const weekAgo = addDays(today, -6)
  const twoWeeksAgo = addDays(today, -13)
  let done7 = 0, everybody = 0, cohort = 0, returned = 0, perfect = 0
  const buckets = { one: 0, two_to_six: 0, week_plus: 0, month_plus: 0 }
  for (const dates of byUser.values()) {
    everybody++
    const recent = [...dates].some(d => d >= weekAgo && d <= today)
    if (recent) done7++
    const prior = [...dates].some(d => d >= twoWeeksAgo && d < weekAgo)
    if (prior) { cohort++; if (recent) returned++ }
    const streak = currentStreak(dates, today)
    if (streak >= 30) buckets.month_plus++
    else if (streak >= 7) buckets.week_plus++
    else if (streak >= 2) buckets.two_to_six++
    else if (streak === 1) buckets.one++
    if (streak >= 7) perfect++
  }
  return {
    dayDoneFamilies7d: done7,
    dayDoneRate7d: everybody > 0 ? Math.round((done7 / everybody) * 100) : null,
    streakBuckets: buckets,
    returnedD7: cohort > 0 ? Math.round((returned / cohort) * 100) : null,
    perfectWeeks: perfect,
  }
}
