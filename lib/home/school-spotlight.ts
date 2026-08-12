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

/** Today's date in London, as the YYYY-MM-DD that school_actions stores. */
export function londonToday(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD, which is the one locale that gives an ISO date
  // without reaching for a library or doing UTC arithmetic that drifts in BST.
  return now.toLocaleDateString('en-CA', { timeZone: 'Europe/London' })
}

/** The shape countWaitingToday needs. A subset of SchoolAction on purpose. */
export type WaitingAction = {
  recurs_weekday?: number | null
  due_date?: string | null
  cleared_on?: string | null
}

/**
 * How many school reminders are ACTUALLY waiting on a parent today.
 *
 * ── WHY THIS EXISTS, AND IT IS A BUG I SHIPPED ──────────────────────────────
 *
 * schoolTakesTheTop was being handed the raw count of open rows, and the two
 * things wrong with that only show up over days rather than in a screenshot.
 *
 * A WEEKLY ROUTINE NEVER LEAVES THE LIST. "PE kit, every Tuesday" is one open
 * row for ever: clearing it stamps cleared_on and it comes back next week, by
 * design, because it is a routine and not a task. So one routine made the count
 * permanently non zero, the exception fired before the day check ever ran, and
 * the card sat at the top of Home seven days a week with a red badge. Justin
 * asked for "in rotation to top once a week" and got it every day, which is the
 * same as not having asked.
 *
 * AND HOLIDAY HELD ROUTINES COUNTED TOO. The card already greys those out and
 * says "on hold until school is back", because Justin caught Show and tell
 * firing red mid August on Teo's phone. That fix went into the card and not
 * into the thing that decides where the card sits, so all summer the top of
 * Home carried a red count for items that say on their face that nothing is
 * happening.
 *
 * ── THE RULE ────────────────────────────────────────────────────────────────
 *
 *   held for the holidays   never waiting. The card already says so.
 *   cleared today           not waiting. It comes back next week.
 *   a weekly routine        waiting only on its own weekday.
 *   a one off               waiting when it is due today or overdue, and when
 *                           it carries no date at all, because somebody typed
 *                           it on purpose and it clears when it is settled.
 *
 * isHeld is passed in rather than imported so this file keeps no app imports
 * and stays runnable by the check script. The caller already holds the region
 * and the holiday flags.
 */
export function countWaitingToday(
  actions: WaitingAction[],
  now: Date = new Date(),
  isHeld: (a: WaitingAction) => boolean = () => false,
): number {
  const today = londonToday(now)
  const dow = londonDayOfWeek(now)
  return actions.filter(a => {
    if (isHeld(a)) return false
    if (String(a.cleared_on ?? '') === today) return false
    if (a.recurs_weekday != null) return a.recurs_weekday === dow
    return !a.due_date || a.due_date <= today
  }).length
}
