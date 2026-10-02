import { londonNow, londonDateIn } from '@/lib/time/london'

// Reminders at a set time (migration 359).
//
// Justin, 2 October 2026: "could we see if it can log a reminder". The parent
// says "remind me at six to start the wind down" and DiGi's set_reminder tool
// writes one row; /api/cron/digi-reminders sends it.
//
// The parent speaks in UK wall clock time, so every conversion goes through
// London and never through the server's own zone, which on Vercel is UTC and
// would put every summer reminder an hour late.

/** Waiting reminders a family can hold at once. A list longer than this stops being read. */
export const MAX_PENDING_REMINDERS = 5

/** How late a send may run and still be worth sending. Past this it is marked missed. */
export const LATE_LIMIT_MS = 60 * 60 * 1000

/** HH:MM on a 24 hour clock, which is what the tool asks the model for. */
export function parseClock(raw: unknown): { hour: number; minute: number } | null {
  if (typeof raw !== 'string') return null
  const m = raw.trim().match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const hour = Number(m[1])
  const minute = Number(m[2])
  if (hour > 23 || minute > 59) return null
  return { hour, minute }
}

/**
 * The real instant a London wall clock time falls on, for a London date.
 *
 * Guess the instant as if London were UTC, read back what London's clock
 * says at that guess, and move by the difference. Twice, so the answer is
 * right on the two days a year the clocks change as well as the other 363.
 */
export function londonWallClockToUtc(dateStr: string, hour: number, minute: number): Date {
  const [y, mo, d] = dateStr.split('-').map(Number)
  const target = Date.UTC(y, mo - 1, d, hour, minute)
  let guess = target
  for (let i = 0; i < 2; i++) {
    const seen = londonNow(new Date(guess))
    const shown = Date.UTC(seen.year, seen.month - 1, seen.day, seen.hour, seen.minute)
    guess += target - shown
  }
  return new Date(guess)
}

export type ResolvedTime = {
  at: Date
  /** The time asked for had already gone today, so it moved to tomorrow. */
  rolled: boolean
  /** London date it lands on, YYYY-MM-DD. */
  dateStr: string
}

/**
 * When a reminder should go, from the clock time and the days ahead the model
 * gave. A time already gone today moves to tomorrow rather than being sent
 * straight away, and the tool tells DiGi so, so the parent hears it said.
 */
export function resolveReminderTime(clock: { hour: number; minute: number }, daysAhead: number, now: Date = new Date()): ResolvedTime {
  const days = Math.min(14, Math.max(0, Math.round(daysAhead) || 0))
  let dateStr = londonDateIn(days, now)
  let at = londonWallClockToUtc(dateStr, clock.hour, clock.minute)
  let rolled = false
  if (at.getTime() <= now.getTime()) {
    dateStr = londonDateIn(days + 1, now)
    at = londonWallClockToUtc(dateStr, clock.hour, clock.minute)
    rolled = true
  }
  return { at, rolled, dateStr }
}

/** "today at 18:00", "tomorrow at 07:30", "Saturday at 09:00", for DiGi to say back. */
export function describeWhen(at: Date, now: Date = new Date()): string {
  const day = londonNow(at)
  const time = `${String(day.hour).padStart(2, '0')}:${String(day.minute).padStart(2, '0')}`
  if (day.dateStr === londonNow(now).dateStr) return `today at ${time}`
  if (day.dateStr === londonDateIn(1, now)) return `tomorrow at ${time}`
  const name = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', day: 'numeric', month: 'long' }).format(at)
  return `${name} at ${time}`
}
