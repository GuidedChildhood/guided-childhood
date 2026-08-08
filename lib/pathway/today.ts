// What "today" means, in one place.
//
// Everything a family does is bucketed into a day, and the day they mean is
// theirs, not the server's. Two different questions, and mixing them up is how
// a step completed at half past midnight lands on yesterday:
//
//   londonToday()      the DATE, for comparing against a date column
//   londonDayStart()   the INSTANT that date began, for comparing against a
//                      timestamptz column
//
// The second is the one that keeps getting written wrong. `${today}T00:00:00Z`
// looks like the start of today and is not: through British summer time the day
// starts at 23:00Z the evening before, so a UTC midnight boundary silently
// drops the first hour of every summer day into the day before. In the
// pathway's case that meant a parent who asked DiGi at 00:30 was told they
// still had to.

/** Today's date in Europe/London, as YYYY-MM-DD. */
export function londonToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date())
}

const HOUR = 3600_000

/** How London reads a given instant, as "YYYY-MM-DD HH:mm". */
function londonClock(at: Date): string {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(at)
  const v = (t: string) => p.find(x => x.type === t)?.value ?? ''
  // en-CA reports midnight as 24 in hour12: false, so normalise it.
  const h = String(Number(v('hour')) % 24).padStart(2, '0')
  return `${v('year')}-${v('month')}-${v('day')} ${h}:${v('minute')}`
}

/**
 * The instant today began in Europe/London, as an ISO string.
 *
 * Solved by trying the two offsets London ever has and keeping the one that
 * actually reads back as midnight, rather than computed.
 *
 * The obvious version, take what London's clock says now and subtract it from
 * the current instant, is wrong twice a year and I wrote it that way first. It
 * assumes the offset at midnight is the offset now, and on the two clock change
 * Sundays it is not: on the October morning the day is 25 hours long, so
 * subtracting 12 elapsed hours from midday lands an hour after the day actually
 * started. The test caught it, which is the only reason this is right.
 */
export function londonDayStart(now: Date = new Date()): string {
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(now)
  const utcMidnight = Date.parse(`${date}T00:00:00Z`)
  // London is UTC or UTC+1, so its midnight is at UTC midnight or an hour
  // before it. Nothing else is possible, and one of the two must read back as
  // 00:00 on the right date.
  for (const offset of [0, HOUR]) {
    const candidate = new Date(utcMidnight - offset)
    if (londonClock(candidate) === `${date} 00:00`) return candidate.toISOString()
  }
  // Unreachable unless the timezone database changes shape. Falling back to UTC
  // midnight is the old behaviour: an hour out at worst, never wrong by a day.
  return new Date(utcMidnight).toISOString()
}
