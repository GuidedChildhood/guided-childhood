// School holidays, UK and US.
//
// Justin: "we should also think about school holidays. In our family routines
// change, they do get up later and watch more TV. We should build this
// behaviour in as holidays can be more relaxed."
//
// He is describing the single biggest gap between what this app assumed and how
// a family actually lives. Nothing in the product knew about holidays at all:
// questDueToday still fired school days jobs in August, the screen guide held a
// term time number through six weeks of summer, and the tone stayed the same on
// a Tuesday in term as on a Tuesday in the holidays. So for roughly thirteen
// weeks a year the app quietly told families they were failing at a routine
// that had, entirely reasonably, stopped.
//
// ── Every window here is approximate, and that is deliberate ─────────────────
//
// UK school holidays are set by each local authority, and US ones by each
// district, so no national calendar exists in either country. What DOES hold is
// the shape: England breaks for roughly a week at the end of October, a
// fortnight over Christmas, a week in February, a fortnight around Easter, a
// week at the end of May, and six weeks over summer. Those windows are stable
// to within a few days almost everywhere.
//
// So this is not a schedule, it is a season. Every window is drawn slightly
// WIDE on purpose, because the cost of the two errors is not symmetrical: being
// relaxed for a couple of days while a school is still in is nothing, while
// telling a family their routine has slipped on the first Monday of the summer
// holidays is exactly the wrong message at exactly the wrong moment. When it
// matters, the copy says "around" rather than naming a date.
//
// US districts vary far more than UK ones, especially spring break, which can
// be any week from late February to late April. That is said plainly in the
// notes rather than papered over, and it is the main reason a family can turn
// this off entirely.
//
// ── Easter is computed, not guessed ─────────────────────────────────────────
//
// Easter moves by more than a month across years: 22 March at the earliest,
// 25 April at the latest. A fixed window would be wrong more often than right,
// so it is worked out with the standard anonymous Gregorian computus and the
// holiday is hung either side of it. This is the one date here that is exact,
// and the fortnight around it still is not, because schools split it differently.

export type Region = 'uk' | 'us'

export type HolidayKey =
  | 'summer'
  | 'autumn_half'
  | 'christmas'
  | 'spring_half'
  | 'easter'
  | 'may_half'
  | 'thanksgiving'
  | 'spring_break'

export type Holiday = {
  key: HolidayKey
  region: Region
  /** What a family calls it. */
  title: string
  /** Roughly how long, for copy that wants to say it. */
  lengthNote: string
  /**
   * How much more relaxed the daily screen guide gets, as a multiplier.
   *
   * These used to be much bigger: 1.6 in summer, 1.4 at Christmas. That was
   * the whole holiday mechanic, and it was the wrong one. It handed every
   * family the same six weeks of extra screen time whether or not a single job
   * got done, which is exactly the thing the product's own welcome card says it
   * does not do: screen time here is "earned from real world jobs, never just
   * handed over". A child who did nothing all term got the same August as one
   * who did everything.
   *
   * The holiday bank replaced it (migrations 127 and 128). Work beyond what an
   * ordinary week has room for is saved and spendable in the holidays, so the
   * extra time in August is EARNED, and a child can point at the June jobs that
   * paid for it.
   *
   * What is left here is the part that is genuinely nothing to do with effort:
   * a holiday day has a different shape. No school run, later mornings, longer
   * afternoons indoors when it rains. That is real and it deserves a lift, so
   * the numbers stayed rather than going to 1.0. They are just small now, and
   * the bank carries the rest.
   *
   * The ordering still holds and still means the same thing. Six unstructured
   * weeks need more slack than a week off in February.
   */
  relax: number
}

// ── Easter, by the anonymous Gregorian computus ──────────────────────────────
// Returns Easter Sunday for a given year. Standard algorithm, unchanged.
export function easterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(Date.UTC(year, month - 1, day))
}

function utc(y: number, m: number, d: number): Date {
  return new Date(Date.UTC(y, m - 1, d))
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * 86400000)
}

/** Midnight UTC on the same calendar day, so comparisons are date only. */
function dayOnly(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

type Window = { key: HolidayKey; from: Date; to: Date }

// The windows for one calendar year. Christmas is emitted twice, for the tail
// of the previous year and the head of the next, so a date in early January is
// caught without the caller having to think about year boundaries.
function windowsFor(year: number, region: Region): Window[] {
  const easter = easterSunday(year)

  if (region === 'us') {
    return [
      // Roughly Memorial Day to just after Labor Day. US summer is longer at
      // the front and shorter at the back than the UK one.
      { key: 'summer', from: utc(year, 6, 5), to: utc(year, 8, 28) },
      // Thanksgiving is the fourth Thursday in November; most districts take
      // that whole week. Drawn as the week around the 22nd to the 30th.
      { key: 'thanksgiving', from: utc(year, 11, 22), to: utc(year, 11, 30) },
      { key: 'christmas', from: utc(year, 12, 20), to: utc(year, 12, 31) },
      { key: 'christmas', from: utc(year, 1, 1), to: utc(year, 1, 3) },
      // The honest one. Spring break moves between districts by two months, so
      // this is hung on Easter as the least bad single guess and the copy never
      // claims to know a family's actual week.
      { key: 'spring_break', from: addDays(easter, -7), to: addDays(easter, 5) },
    ]
  }

  return [
    // England. Six weeks, and the one that matters most.
    { key: 'summer', from: utc(year, 7, 22), to: utc(year, 9, 2) },
    { key: 'autumn_half', from: utc(year, 10, 25), to: utc(year, 11, 2) },
    { key: 'christmas', from: utc(year, 12, 20), to: utc(year, 12, 31) },
    { key: 'christmas', from: utc(year, 1, 1), to: utc(year, 1, 3) },
    { key: 'spring_half', from: utc(year, 2, 14), to: utc(year, 2, 22) },
    // A fortnight hung around Easter Sunday. Some authorities take the two
    // weeks before and some the two after, so this spans both loosely.
    { key: 'easter', from: addDays(easter, -12), to: addDays(easter, 9) },
    { key: 'may_half', from: utc(year, 5, 24), to: utc(year, 6, 1) },
  ]
}

// A small automatic lift for the shape of the day, and the holiday bank for
// everything beyond it. See the relax note on the Holiday type for why these
// came down from 1.6 and 1.4.
const META: Record<HolidayKey, { title: string; lengthNote: string; relax: number }> = {
  summer:        { title: 'the summer holidays', lengthNote: 'about six weeks', relax: 1.25 },
  christmas:     { title: 'the Christmas holidays', lengthNote: 'about two weeks', relax: 1.2 },
  easter:        { title: 'the Easter holidays', lengthNote: 'about two weeks', relax: 1.2 },
  spring_break:  { title: 'spring break', lengthNote: 'about a week', relax: 1.2 },
  autumn_half:   { title: 'half term', lengthNote: 'about a week', relax: 1.15 },
  spring_half:   { title: 'half term', lengthNote: 'about a week', relax: 1.15 },
  may_half:      { title: 'half term', lengthNote: 'about a week', relax: 1.15 },
  thanksgiving:  { title: 'the Thanksgiving break', lengthNote: 'about a week', relax: 1.15 },
}

/**
 * The holiday this date falls in, or null in term time.
 *
 * Checks the previous calendar year too, so 2 January lands in the Christmas
 * window that opened in December rather than falling through the gap.
 */
export function holidayOn(on: Date, region: Region = 'uk'): Holiday | null {
  const d = dayOnly(on)
  const y = d.getUTCFullYear()
  const all = [...windowsFor(y, region), ...windowsFor(y - 1, region)]
  const hit = all.find(w => d >= dayOnly(w.from) && d <= dayOnly(w.to))
  if (!hit) return null
  const meta = META[hit.key]
  return { key: hit.key, region, title: meta.title, lengthNote: meta.lengthNote, relax: meta.relax }
}

export function isSchoolHoliday(on: Date, region: Region = 'uk'): boolean {
  return holidayOn(on, region) !== null
}

/**
 * The daily screen guide, relaxed if it is the holidays.
 *
 * Deliberately a lift and not a removal. A family who wants no limit in August
 * does not need us to agree with them in code, and a child who has learned that
 * the number vanishes for six weeks has learned that the number is not real.
 * The evidence we build on is about the whole shape of a childhood, not one
 * fortnight, so the guide bends rather than breaks.
 *
 * This is the AUTOMATIC part only, and it is small. The holiday bank sits on
 * top of it and is where the real difference in a holiday comes from, because
 * that part was earned. Two separate things on purpose: this one every family
 * gets, that one a family gets as much of as it did the work for.
 */
export function holidayAdjustedMinutes(base: number, on: Date, region: Region = 'uk'): number {
  const h = holidayOn(on, region)
  if (!h) return base
  return Math.round((base * h.relax) / 5) * 5
}
