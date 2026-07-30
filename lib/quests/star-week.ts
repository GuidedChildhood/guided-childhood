import { recommendedDailyMinutes } from './screen-balance'
import { STAR_MINUTES } from './templates'

// The star week: Monday morning to Monday morning, in London.
//
// Justin, after seeing a test child holding 342 stars and 1,710 minutes: "we
// refresh each week ... so the jobs roughly be limited to equate to time
// recommended per week, then any time not used resets each week fresh for a
// Monday morning."
//
// 342 was never a daily earning problem. About three jobs a day at two stars is
// six a day and 42 a week, and over eight weeks of testing that is roughly 336.
// It matches. The number was eight weeks with no reset, so a daily cap would
// have bitten a ceiling nobody reaches and changed nothing.
//
// Everything here is Europe/London rather than the server's zone, like every
// other date in the app. A week boundary that disagreed with the one on the
// parent's screen would hand a child a fresh allowance on a Sunday evening.

/**
 * The Monday that starts the star week containing `now`, as a YYYY-MM-DD date in
 * London. Sunday belongs to the week that began six days earlier, which is what
 * getDay() returning 0 would otherwise get wrong.
 */
export function starWeekStart(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',
  }).formatToParts(now)
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
  const ymd = `${get('year')}-${get('month')}-${get('day')}`
  const weekday = get('weekday') // Mon, Tue, ... Sun
  const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const back = Math.max(0, order.indexOf(weekday))
  // Date arithmetic on the date only, at noon UTC, so a British Summer Time
  // shift inside the week cannot move the answer by a day.
  const noon = new Date(`${ymd}T12:00:00Z`)
  noon.setUTCDate(noon.getUTCDate() - back)
  return noon.toISOString().slice(0, 10)
}

/** The instant that star week begins, for comparing against timestamptz rows. */
export function starWeekStartIso(now: Date = new Date()): string {
  // London is UTC or UTC+1, so measure the offset in force rather than assume.
  return londonMidnightIso(starWeekStart(now))
}

/** The star week before the one containing `now`, which is what a rollover pays out. */
export function previousStarWeekStart(now: Date = new Date()): string {
  return addDays(starWeekStart(now), -7)
}

/**
 * The Monday AFTER the given week, as an exclusive upper bound.
 *
 * Both ends are needed, not just the start. The rollover runs after midnight on a
 * Monday and pays out the week that just ended, so an open ended "everything since
 * that Monday" window would sweep the new week's rows into the old week's payout.
 * Bounding both ends also makes the current week's figures identical whichever way
 * they are asked for, since nothing can be dated in the future.
 */
export function starWeekEnd(weekStart: string): string {
  return addDays(weekStart, 7)
}

/** Midnight London at the start of a YYYY-MM-DD day, as an instant. */
export function londonMidnightIso(ymd: string): string {
  const guess = new Date(`${ymd}T00:00:00Z`)
  const local = new Date(guess.toLocaleString('en-US', { timeZone: 'Europe/London' }))
  const utc = new Date(guess.toLocaleString('en-US', { timeZone: 'UTC' }))
  return new Date(guess.getTime() - (local.getTime() - utc.getTime())).toISOString()
}

/** Date only arithmetic at noon UTC, so a clock change cannot shift the day. */
function addDays(ymd: string, days: number): string {
  const noon = new Date(`${ymd}T12:00:00Z`)
  noon.setUTCDate(noon.getUTCDate() + days)
  return noon.toISOString().slice(0, 10)
}

/**
 * The most stars a child of this age can hold in one week.
 *
 * This is the actual fix, and it is why a daily job cap was the wrong lever. The
 * ceiling is one week of the age guidance, sourced from the same BAND table the
 * balance graphs use, so the worst case a parent ever faces is one week's worth
 * of screen time rather than 28 hours. Over earning becomes impossible whatever
 * a family does with their board.
 *
 * `on` is which week is being priced, and it matters because the guidance is
 * now holiday aware: a school holiday week has a slightly higher ceiling than a
 * term time one. Left out it means today, which is right for every screen
 * asking what a child can spend now. The Monday rollover must pass it, because
 * it runs just after midnight to pay out the week that has ENDED, and on the
 * first Monday of the summer holidays it would otherwise price six weeks of
 * term time at holiday rates and bank too little.
 */
export function weeklyStarCap(ageBand: string | null, on?: Date): number {
  const weeklyMinutes = recommendedDailyMinutes(ageBand, on ? { on } : {}) * 7
  return Math.max(1, Math.floor(weeklyMinutes / STAR_MINUTES))
}

/** How many unused minutes buy one sticker credit at Monday rollover. */
export const MINUTES_PER_STICKER_CREDIT = 30

/**
 * Extra minutes for five clear day streaks, agreed with Justin at 30.
 *
 * Deliberately small. It has to be noticeable to a child and still sit well
 * inside one week of the age guidance, or the reward quietly undoes the
 * guideline the whole balance system is built on.
 */
export const WEEKEND_BONUS_MINUTES = 30

/** Day streaks needed for one older squad friend, and for the weekend minutes. */
export const STREAKS_PER_REWARD = 5
