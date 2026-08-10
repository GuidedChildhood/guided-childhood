// Which school reminders a child gets to see.
//
// This rule lived inline on the child's home page, and now two screens need it:
// the today and tomorrow banner, and the week viewer Justin asked for. Written
// twice it would drift, and the way it would drift is a payment reminder
// appearing on a nine year old's phone.
//
// The rule itself: some kinds are obviously the child's own business and go to
// them without anybody deciding anything, and everything else only reaches them
// when the grown up chose to send it.

import { isSchoolHoliday, type Region } from '@/lib/learning/holidays'

/** Kinds that are the child's own business, so they go through by default. */
export const CHILD_KINDS = new Set(['kit', 'event', 'homework'])

export type ChildVisibleAction = {
  kind: string
  recurs_weekday?: number | null
  sent_to_child?: boolean | null
  auto_send_to_child?: boolean | null
}

/**
 * Should this reminder show on the child's phone?
 *
 * A weekly routine reaches them when the grown up ticked "send it to their
 * phone too" on it, a one off when it was actually sent. Either way the child
 * kinds pass regardless, because a PE kit is a thing a child needs and not a
 * thing a parent should have to remember to forward every week.
 */
export function isChildVisible(a: ChildVisibleAction): boolean {
  if (CHILD_KINDS.has(a.kind)) return true
  return a.recurs_weekday != null ? !!a.auto_send_to_child : !!a.sent_to_child
}

export type HolidayHoldAction = {
  recurs_weekday?: number | null
  /** Missing or null reads as false: a school time reminder. */
  runs_in_holidays?: boolean | null
}

/**
 * Is this reminder on hold for the school holidays on a given day?
 *
 * Justin, 10 August 2026, from Teo's phone: a Show and tell weekly routine
 * firing overdue red on Monday 10 August, mid summer holidays. "we need to
 * know if it's school time reminders or home life reminders."
 *
 * The rule: only WEEKLY ROUTINES are ever held, because a dated one off in
 * the holidays was typed on purpose. A routine is held when the day is a
 * school holiday (lib/learning/holidays, per the family's region) and the
 * reminder has not been marked as running in the holidays too. Missing
 * runs_in_holidays (pre migration 182, or a guarded read that failed) reads
 * as a school time reminder, which is the truthful default for a school
 * diary and is what fixes August without anybody editing anything.
 *
 * One rule, used by the child's banner, the child's week, the parent's card
 * and the reminder crons, because four copies of "is it the holidays" is how
 * one surface ends up shouting about PE kit in the middle of August.
 */
export function isHeldForHolidays(a: HolidayHoldAction, on: Date, region: Region): boolean {
  if (a.recurs_weekday == null) return false
  if (a.runs_in_holidays === true) return false
  return isSchoolHoliday(on, region)
}
