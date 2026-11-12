// TWO REMINDERS A DAY, AT MOST (Justin, 12 November 2026).
//
// A parent hears from us on purpose, not by accident of how many crons ran.
// Each scheduled push already limits itself; this is the ceiling over all of
// them together. sendPush({ nudge: true }) claims a slot for the parent's
// London day before it sends, and a parent who has had their two hears nothing
// more until tomorrow.
//
// THE NUDGES (the only callers that pass nudge: true, checked by
// scripts/check-nudge-cap.mjs):
//   app/api/push/cron        the school window line, the usual rows heads up,
//                            and the evening line
//   app/api/push/reengage    come back after a quiet spell
//   app/api/cron/trial-pushes, settings-nudge, lesson-drip, age-up,
//   weekly-review
//
// NEVER CAPPED, on purpose: a reminder the parent asked DiGi for, a school
// item they added, the timer, and news that something just happened (the
// child finished a lesson, asked for time). Those are the parent's own asks or
// real events, and holding one back would hide something they wanted.
//
// If the count cannot be read (the migration not yet applied, the database
// having a moment) the nudge goes, as it did before the cap existed. A parent
// missing a reminder because of our outage is worse than one extra.

export const DAILY_NUDGE_CAP = 2

/** Today's date in London as YYYY-MM-DD, the day the cap counts in. */
export function londonDay(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}
