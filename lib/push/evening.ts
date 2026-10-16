import { londonNow } from '@/lib/time/london'

// The evening reminder, per parent, at their time, only when it helps.
//
// Justin, 13 September 2026: a Duolingo grade habit for parents, "do not stop
// until that works". The audit of the loop found the one mechanic Duolingo is
// built on missing: the 21:00 push went to everyone, said the same thing to a
// parent who finished at breakfast and to one who had not opened the app, and
// never looked at the day. This file is the rule the cron now reads.
//
// ── THREE RULES ─────────────────────────────────────────────────────────────
//
// 1. ONLY WHEN TODAY IS NOT DONE does the reminder say so. A finished day
//    gets the wind down it always got (the bedtime moment), never a nudge to
//    do what is already done.
// 2. NEVER A LOSS. Duolingo's copy is "don't lose your streak". Ours says
//    what KEEPS it, because lib/kid/milestones.ts already rules loss language
//    out for the child and a parent deserves the same. scripts/check-habit-
//    loop.mjs fails on lose, lost, break, broken or miss in any line here.
// 3. AT THEIR TIME. A parent can pick an evening time in Settings. Without
//    one, the time is learned: an hour after when this parent usually
//    finishes their day, read from daily_sessions.completed_at over the last
//    fortnight, so a parent who does it at 19:30 is reminded at 20:30 and a
//    parent who never told us anything is reminded at 21:00, as before.

/** Earliest and latest a parent may choose, in minutes from midnight UK. */
export const REMINDER_EARLIEST = 17 * 60
export const REMINDER_LATEST = 22 * 60
/** The default when nothing is chosen and nothing has been learned. */
export const REMINDER_DEFAULT = 21 * 60
/** The learned time is this long after the parent's usual finish. */
export const LEARNED_OFFSET = 60
/** Fewer completed days than this and we do not claim to know their habit. */
export const LEARN_MIN_SAMPLES = 5
/** The cron runs every half hour; a target is due when the clock is this close. */
export const DUE_WINDOW = 10

export function roundToHalfHour(minutes: number): number {
  return Math.round(minutes / 30) * 30
}

/** Minutes from midnight, UK wall clock, of a timestamp. */
export function ukMinutesOf(iso: string): number | null {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const { hour, minute } = londonNow(d)
  return hour * 60 + minute
}

function median(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2)
}

/**
 * When to remind this parent, in minutes from midnight UK.
 *
 * A chosen time wins. Otherwise the learned time from their finishes, clamped
 * to the evening. Otherwise 21:00.
 */
export function reminderTargetMinutes(chosen: number | null | undefined, finishesUkMinutes: number[]): number {
  if (typeof chosen === 'number' && Number.isFinite(chosen)) {
    return Math.min(REMINDER_LATEST, Math.max(REMINDER_EARLIEST, roundToHalfHour(chosen)))
  }
  const finishes = finishesUkMinutes.filter(n => Number.isFinite(n))
  if (finishes.length >= LEARN_MIN_SAMPLES) {
    const learned = roundToHalfHour(median(finishes) + LEARNED_OFFSET)
    return Math.min(REMINDER_LATEST - 30, Math.max(18 * 60, learned))
  }
  return REMINDER_DEFAULT
}

/** Is a target due on this run of the cron? */
export function dueNow(nowMinutes: number, target: number): boolean {
  return Math.abs(nowMinutes - target) <= DUE_WINDOW
}

export type EveningLine = { title: string; body: string; url: string }

/** The evening wind down a finished day always got. */
export const WIND_DOWN: EveningLine = {
  title: 'Evening wind down',
  body: 'Bedtime and the phone, how did it go? Log the moment and DiGi will help you prepare for tomorrow.',
  url: '/dashboard',
}

/**
 * The line for one parent tonight.
 *
 * Done: the wind down. Not done: the one tap that keeps the streak going,
 * with the number when there is one worth naming. No loss language, ever.
 */
export function eveningLine(input: { done: boolean; streakCount: number; childName?: string | null }): EveningLine {
  if (input.done) return WIND_DOWN
  const kid = input.childName && input.childName !== 'Your child' ? input.childName : 'your child'
  if (input.streakCount >= 2) {
    return {
      title: 'Your day is still open',
      body: `One tap keeps the ${input.streakCount} days going. ${kid}'s road is right there, and it takes a few minutes.`,
      url: '/dashboard#today',
    }
  }
  return {
    title: 'Your day is still open',
    body: `One tap finishes today. Small and daily beats big and rarely, and ${kid}'s road is right there.`,
    url: '/dashboard#today',
  }
}

// ── THE EVENING STOPS WHEN THE PARENT HAS GONE QUIET ────────────────────────
//
// Review board, 16 October 2026 (keeps-coming-back): the nightly push had no
// ceiling. A parent who had not opened the app for a month still got "Your day
// is still open" every evening, which is how a notification is turned off for
// good. Duolingo's own test found the same: past about a week of ignored
// nudges, more of them cost the opt in rather than winning the person back.
//
// So the evening goes quiet after seven unanswered nights. Night one to seven
// of being quiet still sends; the eighth does not. What is left is the four day
// re engagement line (app/api/push/reengage), one warm DiGi nudge at most every
// four days, which is a different job: it asks a lapsed parent back, where the
// evening line assumes they are still in the habit.
//
// "Showed up" is the same reading the streak and the done today check use (a
// session, a moment, an approved tick, an answered DiGi note), so any
// meaningful return resets the count and the evening starts again the next
// night. A parent with no activity at all counts from the day they joined.
// This does not touch the parent flame streak or what it counts.

/** Quiet nights the evening still sends for. The next one does not. */
export const EVENING_QUIET_NIGHTS = 7

function utcDay(iso: string): number {
  return Date.parse(`${iso}T00:00:00Z`)
}

/** Whole days from one YYYY-MM-DD date to a later one. */
export function daysBetween(from: string, to: string): number {
  return Math.round((utcDay(to) - utcDay(from)) / 86400000)
}

/** The London date (YYYY-MM-DD) of a timestamp, or null if it is not one. */
export function londonDateOf(iso: string): string | null {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(d)
}

/**
 * Which night of being quiet tonight is, counting tonight. The latest day the
 * parent showed up (or, with no activity at all, the day they joined) is night
 * zero; the evening after is night one. A date in the future reads as zero.
 */
export function quietNightNumber(showedUpOn: Array<string | null | undefined>, joinedOn: string | null | undefined, today: string): number {
  const days = [...showedUpOn, joinedOn].filter((d): d is string => typeof d === 'string' && d.length >= 10).map(d => d.slice(0, 10))
  if (days.length === 0) return 0
  const latest = days.reduce((a, b) => (a > b ? a : b))
  return Math.max(0, daysBetween(latest, today))
}

/** True when tonight's evening push should be held back. */
export function eveningHeldForQuiet(quietNight: number): boolean {
  return quietNight > EVENING_QUIET_NIGHTS
}
