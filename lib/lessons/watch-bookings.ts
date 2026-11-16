// Watch together booking: the pure part (migration 400). Times, slots, the
// calendar file and the rules about when a booking shows. No database and no
// server imports, so the parent's booking sheet can use it in the browser.
// The reads and writes live in watch-bookings-server.ts.
//
// Every clock here is London's, because the families are in the UK and the
// server runs in UTC. See lib/time/london.ts for why that matters twice a year.
//
// Plan: plans/2026-11-16-watch-together-booking-plan.md. Justin's answers,
// 16 November: three suggested times plus "another time"; nothing on the
// child's page before the time; evening bookings allowed and silent after
// 19:00; a calendar file with no child's name; the child's buzz on by default.

import { londonNow } from '@/lib/time/london'

export type WatchBookingStatus = 'booked' | 'watched' | 'cancelled' | 'missed'

export type WatchBooking = {
  id: string
  parent_id: string
  child_id: string
  lesson_code: string
  starts_at: string
  status: WatchBookingStatus
  buzz_child: boolean
  reminded_at: string | null
  child_pinged_at: string | null
  watched_at: string | null
}

/** The parent's reminder goes this many minutes before the time. */
export const REMINDER_LEAD_MIN = 15
/** How far ahead a parent can book. Two weeks keeps it a plan, not a diary. */
export const MAX_DAYS_AHEAD = 14
/** Times move in quarter hours, which is what the picker offers. */
export const STEP_MIN = 15
/** Finished rows are deleted after this many days (the plan's retention line). */
export const RETAIN_DAYS = 90

/**
 * The UTC instant for a London wall clock time. Built by guessing UTC and
 * correcting by however far London reads from the guess, so it is right in
 * GMT and BST alike without a timezone library.
 */
export function londonToUtc(dateStr: string, hour: number, minute: number): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  const guess = Date.UTC(y, m - 1, d, hour, minute)
  const read = londonNow(new Date(guess))
  let diff = (read.hour * 60 + read.minute) - (hour * 60 + minute)
  if (diff > 720) diff -= 1440
  if (diff < -720) diff += 1440
  return new Date(guess - diff * 60000)
}

/** The London date N days on from a given London date, as YYYY-MM-DD. */
function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, d + days, 12))
  return t.toISOString().slice(0, 10)
}

function weekdayOf(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay()
}

export type SuggestedSlot = { key: string; label: string; startsAt: string }

/**
 * Three suggestions: after school (16:00 on the next school day), before tea
 * (17:00 the same way), and the weekend morning (Saturday 10:00). Each is the
 * next one that is still at least half an hour away, so a parent at 15:50 is
 * never offered 16:00 today.
 */
export function suggestedSlots(now: Date = new Date()): SuggestedSlot[] {
  const today = londonNow(now).dateStr
  const soonest = now.getTime() + 30 * 60000
  const next = (hour: number, minute: number, ok: (wd: number) => boolean): Date => {
    for (let i = 0; i <= MAX_DAYS_AHEAD; i++) {
      const day = addDays(today, i)
      if (!ok(weekdayOf(day))) continue
      const t = londonToUtc(day, hour, minute)
      if (t.getTime() >= soonest) return t
    }
    return londonToUtc(addDays(today, 1), hour, minute)
  }
  const schoolDay = (wd: number) => wd >= 1 && wd <= 5
  const slots = [
    { key: 'after-school', name: 'After school', at: next(16, 0, schoolDay) },
    { key: 'before-tea', name: 'Before tea', at: next(17, 0, schoolDay) },
    { key: 'weekend-morning', name: 'Weekend morning', at: next(10, 0, wd => wd === 6) },
  ]
  return slots.map(s => ({ key: s.key, label: `${s.name}, ${whenLabel(s.at.toISOString(), now)}`, startsAt: s.at.toISOString() }))
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/** "5pm", "4:30pm", "10am", in London. */
export function clockLabel(iso: string): string {
  const { hour, minute } = londonNow(new Date(iso))
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  const suffix = hour < 12 ? 'am' : 'pm'
  return minute === 0 ? `${h12}${suffix}` : `${h12}:${String(minute).padStart(2, '0')}${suffix}`
}

/** "today at 5pm", "tomorrow at 4pm", "Saturday 22 November at 10am". */
export function whenLabel(iso: string, now: Date = new Date()): string {
  const at = londonNow(new Date(iso))
  const today = londonNow(now).dateStr
  const day = at.dateStr === today ? 'today'
    : at.dateStr === addDays(today, 1) ? 'tomorrow'
    : `${DAY_NAMES[at.weekday]} ${at.day} ${MONTHS[at.month - 1]}`
  return `${day} at ${clockLabel(iso)}`
}

/**
 * Whether a requested time is one we accept: on a quarter hour, not in the
 * past (a minute's grace for a slow tap), and no more than two weeks ahead.
 * Returns the reason when it is not, in words the sheet can show.
 */
export function checkStartsAt(iso: unknown, now: Date = new Date()): { ok: true; at: Date } | { ok: false; reason: string } {
  if (typeof iso !== 'string') return { ok: false, reason: 'Pick a time.' }
  const at = new Date(iso)
  if (Number.isNaN(at.getTime())) return { ok: false, reason: 'Pick a time.' }
  if (at.getTime() < now.getTime() - 60000) return { ok: false, reason: 'That time has already gone. Pick a later one.' }
  if (at.getTime() > now.getTime() + MAX_DAYS_AHEAD * 86400000) return { ok: false, reason: 'Pick a time in the next two weeks.' }
  if (londonNow(at).minute % STEP_MIN !== 0 || at.getUTCSeconds() !== 0) return { ok: false, reason: 'Pick a time on the quarter hour.' }
  return { ok: true, at }
}

/**
 * Does this booking lead the child's page right now? From its time until the
 * end of that London day, while it is still booked. Never before the time
 * (Justin's answer 2), so there is no countdown on a child's screen.
 */
export function isLiveForChild(b: Pick<WatchBooking, 'status' | 'starts_at'>, now: Date = new Date()): boolean {
  if (b.status !== 'booked') return false
  const at = new Date(b.starts_at)
  if (at.getTime() > now.getTime()) return false
  return londonNow(at).dateStr === londonNow(now).dateStr
}

/** Is the parent's reminder due? Once, from the lead time until the start. */
export function reminderDue(b: Pick<WatchBooking, 'status' | 'starts_at' | 'reminded_at'>, now: Date = new Date()): boolean {
  if (b.status !== 'booked' || b.reminded_at) return false
  const at = new Date(b.starts_at).getTime()
  return now.getTime() >= at - REMINDER_LEAD_MIN * 60000 && now.getTime() < at + 5 * 60000
}

/** Has the day of this booking ended without it being watched? */
export function isMissed(b: Pick<WatchBooking, 'status' | 'starts_at'>, now: Date = new Date()): boolean {
  if (b.status !== 'booked') return false
  return londonNow(new Date(b.starts_at)).dateStr < londonNow(now).dateStr
}

/** Is a booking within the next hour, or happening now? For the Home card. */
export function isSoonForParent(b: Pick<WatchBooking, 'status' | 'starts_at'>, now: Date = new Date()): boolean {
  if (b.status !== 'booked') return false
  const at = new Date(b.starts_at).getTime()
  return at - now.getTime() <= 60 * 60000 && londonNow(new Date(at)).dateStr === londonNow(now).dateStr
}

/**
 * The calendar file for the parent's own calendar. It carries the film's
 * title and the time, and never the child's name: calendars sync to outside
 * services (Justin's answer 4).
 */
export function calendarFile(opts: { title: string; startsAt: string; minutes?: number; url?: string; uid: string }): string {
  const start = new Date(opts.startsAt)
  const end = new Date(start.getTime() + (opts.minutes ?? 20) * 60000)
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Guided Childhood//Watch together//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${opts.uid}@guidedchildhood.com`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(`Watch together: ${opts.title}`)}`,
    `DESCRIPTION:${esc('A few minutes on the sofa with the Watch together film.')}`,
    ...(opts.url ? [`URL:${opts.url}`] : []),
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(`Watch together: ${opts.title}`)}`, `TRIGGER:-PT${REMINDER_LEAD_MIN}M`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n')
}
