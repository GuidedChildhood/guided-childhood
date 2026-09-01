// Which kind of day today is, and the rule that decides it.
//
// Justin, 1 September 2026: one main tick a day; rotate days between the
// check in led connect day, a lessons day working through what the age
// needs one by one, a DiGi day, and a passport check once a week.
//
// ── ROTATION ON COMPLETED DAYS, NOT CALENDAR DAYS ───────────────────────────
//
// The Duolingo lesson worth stealing is that the path waits. A parent who
// opens the app twice a week must walk the same road, in order, as one who
// opens it daily; a rotation pinned to the calendar would hand the twice a
// week parent a run of missed lesson days and a passport check they never
// see. So the focus is a function of HOW MANY DAYS THIS FAMILY HAS
// COMPLETED for this child, counted strictly before today, which makes it:
//
//   - stable for the whole of a day (nothing completed today moves it),
//   - the same on two devices with nothing to write on read,
//   - and gap proof: miss a week and tomorrow is simply the next day on
//     the road, never a pile of guilt.
//
// The day's focus is stamped onto the daily_sessions row when the day
// completes (migration 237), so reporting can ask "what kind of days does
// this family finish" without re-deriving history.

export type DayFocus = 'connect' | 'lesson' | 'digi' | 'passport'

// Seven completed days make one lap: three connect days carrying the check
// in, moment and script core, two lesson days for the age, one DiGi day,
// and the passport check closing the week. Connect leads the lap because it
// is the habit itself; the passport closes it because it is what the lap
// added up to.
export const FOCUS_CYCLE: readonly DayFocus[] = [
  'connect', 'lesson', 'connect', 'digi', 'connect', 'lesson', 'passport',
]

/** The focus for a day, given how many days this child's road has already completed. */
export function dayFocusFor(completedDaysBefore: number): DayFocus {
  const n = Number.isFinite(completedDaysBefore) && completedDaysBefore > 0
    ? Math.floor(completedDaysBefore)
    : 0
  return FOCUS_CYCLE[n % FOCUS_CYCLE.length]
}

/** Tomorrow's focus, for the see you tomorrow close: the hook is knowing what comes next. */
export function nextDayFocus(completedDaysBefore: number): DayFocus {
  return dayFocusFor(completedDaysBefore + 1)
}

/** One warm line naming the day, for headers and the close screen. */
export function focusLine(focus: DayFocus, childName?: string): string {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  switch (focus) {
    case 'lesson': return `A lesson day: the next one ${kid} needs for their age`
    case 'digi': return `A DiGi day: bring DiGi one real thing about ${kid}`
    case 'passport': return `Passport day: a quick look at how far ${kid} has come`
    default: return `A connect day: check in, one moment, and the words for tonight`
  }
}
