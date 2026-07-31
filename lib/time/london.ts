// What time it is in London, without going through a string a parser cannot read.
//
// Four places did this:
//
//   new Date(new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }))
//
// which looks reasonable and is broken twice over. en-GB formats as
// "31/07/2026, 06:45:35", day first, and JavaScript's Date parser has no idea
// what that means. On the 1st to the 12th of a month it guesses, reading the
// day as the month and quietly returning the wrong date. From the 13th there is
// no month it could be, so it returns Invalid Date and the next toISOString
// throws RangeError: Invalid time value.
//
// So a bug that silently swapped day and month for twelve days, then crashed
// for the rest of the month. On 31 July it took out both school crons, and the
// push cron had been reporting "ukHour": null for who knows how long, which is
// NaN once it has been through JSON: its whole check in window was comparing
// against nothing.
//
// Intl.DateTimeFormat.formatToParts asks for the numbers directly and never
// builds a string for something else to take apart again.

const PARTS = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: false,
  weekday: 'short',
})

const WEEKDAY: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
}

export type LondonNow = {
  year: number
  month: number      // 1 to 12, as a human writes it
  day: number
  hour: number       // 0 to 23
  minute: number
  weekday: number    // 0 Sunday to 6 Saturday, matching Date.getDay
  /** YYYY-MM-DD, the shape every query in this codebase compares against. */
  dateStr: string
}

export function londonNow(at: Date = new Date()): LondonNow {
  const got: Record<string, string> = {}
  for (const p of PARTS.formatToParts(at)) got[p.type] = p.value

  // Midnight comes back as 24 in some runtimes and 00 in others. Both mean
  // the same moment and only one of them sorts correctly.
  const hour = Number(got.hour) % 24

  return {
    year: Number(got.year),
    month: Number(got.month),
    day: Number(got.day),
    hour,
    minute: Number(got.minute),
    weekday: WEEKDAY[got.weekday] ?? at.getUTCDay(),
    dateStr: `${got.year}-${got.month}-${got.day}`,
  }
}

/**
 * The London date N days from now, as YYYY-MM-DD.
 *
 * Built by moving a real UTC date and then reading it back in London, rather
 * than by adding to the parts, so the clocks going forward or back does not
 * skip or repeat a day.
 */
export function londonDateIn(days: number, at: Date = new Date()): string {
  return londonNow(new Date(at.getTime() + days * 86400000)).dateStr
}

/** Weekday in London N days from now, 0 Sunday to 6 Saturday. */
export function londonWeekdayIn(days: number, at: Date = new Date()): number {
  return londonNow(new Date(at.getTime() + days * 86400000)).weekday
}
