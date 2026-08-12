// Once a week, the school card comes to the top of Home.
//
// Justin, 12 August 2026, on the From school card: "this is just the alert
// calendar for school tasks. Make sure this is in rotation to top once a week."
//
// ── WHY A DAY RATHER THAN A PLACE IN A QUEUE ────────────────────────────────
//
// The card lives near the bottom of Home, folded, and on most days that is
// exactly right: it says "nothing waiting" and costs one line. But it holds kit
// days, payments and deadlines, and those are not a thing you want to discover
// on the morning they are due.
//
// So the lift is timed rather than queued. Sunday is the day a parent looks at
// the week coming, and a card about Tuesday's PE kit is worth something on
// Sunday evening and worth much less on Wednesday. A rotation position would
// have surfaced it on an arbitrary week; a fixed day surfaces it on the day it
// is useful, every week, which is what makes it a habit rather than a surprise.
//
// It MOVES rather than appearing twice. Home already had one thing said in two
// places this week and Justin caught it.
//
// London time, because the whole product runs on the British school week and a
// parent in Cornwall and a server in Virginia have to agree on which day it is.

/** 0 is Sunday, matching getDay(). Change this one number to move the day. */
export const SCHOOL_SPOTLIGHT_DOW = 0

/** Which day of the week it is in London, 0 for Sunday. */
export function londonDayOfWeek(now: Date = new Date()): number {
  const day = now.toLocaleDateString('en-GB', { timeZone: 'Europe/London', weekday: 'short' })
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day.slice(0, 3))
}

/**
 * Does the school card take the top of Home today?
 *
 * True on the spotlight day. Also true ANY day there is something actually
 * waiting, because a deadline a school has already sent is not something to sit
 * on until Sunday. That second rule is the one that matters: the timed lift is
 * the habit, and the count is the exception that overrides it.
 */
export function schoolTakesTheTop(openActions: number, now: Date = new Date()): boolean {
  if (openActions > 0) return true
  return londonDayOfWeek(now) === SCHOOL_SPOTLIGHT_DOW
}
