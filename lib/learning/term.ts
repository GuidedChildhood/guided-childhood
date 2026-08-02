// Which sheet does this child get today?
//
// Two questions, and both are easy to get quietly wrong in a way a parent would
// never spot but would act on.
//
// ── The year group ───────────────────────────────────────────────────────────
//
// England places a child by their age on 31 August, not by their age today. A
// child who turns 9 in October is in Year 4 all year, alongside children who
// turned 9 the previous September. Using today's age would move a child up a
// year in the middle of their birthday week and test them on work they have
// not been taught.
//
// ── The term ─────────────────────────────────────────────────────────────────
//
// The school year turns over on 1 September, so January is the same academic
// year as the previous October. Autumn runs September to December, spring
// January to Easter, summer from Easter to the end of July.
//
// August is the interesting one. A parent printing a sheet in the summer
// holidays gets the year their child has just FINISHED, not the one starting in
// September. Testing a child in August on work they have never been taught is
// the exact failure this whole feature is built to avoid, and August is when a
// worried parent is most likely to reach for it.
//
// Easter moves, so spring and summer are split on 15 April: near enough in
// every year, and wrong only for a fortnight in a term whose content overlaps
// anyway. Precision here would need a moveable feast calculation to decide
// between two sets of objectives that both apply.

export type Term = 'autumn' | 'spring' | 'summer'

export type SheetTarget = {
  yearGroup: number
  term: Term
  // True when this is the year just finished rather than the one in progress,
  // so the sheet can say so instead of implying it is current work.
  lookingBack: boolean
}

// Years 1 to 6. Outside that the sheets do not exist, so the caller shows
// nothing rather than the nearest thing.
export const MIN_YEAR = 1
export const MAX_YEAR = 6

// The academic year a date falls in, named by the September it started in.
export function academicYearStart(on: Date): number {
  const y = on.getUTCFullYear()
  return on.getUTCMonth() >= 8 ? y : y - 1
}

// A child's age on the 31 August that placed them in their current year group.
export function ageOnCutoff(birthday: Date, on: Date): number {
  const startYear = academicYearStart(on)
  const cutoff = new Date(Date.UTC(startYear, 7, 31))
  let age = cutoff.getUTCFullYear() - birthday.getUTCFullYear()
  const before = cutoff.getUTCMonth() < birthday.getUTCMonth()
    || (cutoff.getUTCMonth() === birthday.getUTCMonth() && cutoff.getUTCDate() < birthday.getUTCDate())
  if (before) age -= 1
  return age
}

// Reception is the year a child turns 5, so Year 1 is the year they turn 6,
// which makes the year group their cutoff age minus four.
export function yearGroupFor(birthday: Date, on: Date): number {
  return ageOnCutoff(birthday, on) - 4
}

export function termFor(on: Date): { term: Term; lookingBack: boolean } {
  const m = on.getUTCMonth() // 0 = January
  const d = on.getUTCDate()
  if (m >= 8) return { term: 'autumn', lookingBack: false }        // Sep, Oct, Nov, Dec
  if (m <= 2) return { term: 'spring', lookingBack: false }        // Jan, Feb, Mar
  if (m === 3 && d < 15) return { term: 'spring', lookingBack: false }
  if (m <= 6) return { term: 'summer', lookingBack: false }        // mid Apr, May, Jun, Jul
  // August: school is out. The year just finished is the one they have actually
  // been taught, so the sheet looks back at it rather than forward.
  return { term: 'summer', lookingBack: true }
}

/**
 * What is coming NEXT, for a child standing in a school holiday.
 *
 * Not the same question as termFor, which answers "where are we now". A holiday
 * summary is only interesting if it looks forward, and which way forward depends
 * on WHICH holiday it is:
 *
 *   Summer      the year is over. Next is Autumn, and the child moves up a year.
 *   Christmas   Autumn is finished. Next is Spring, same year group.
 *   Easter      Spring is finished. Next is Summer, same year group.
 *   Half term   nothing has finished. They go back into the SAME term, so the
 *               honest answer is the rest of the term they are already in.
 *
 * That last case is the one a naive "next term" would get wrong, and it would
 * get it wrong twice a year in a way that shows a child work they will not meet
 * for months.
 *
 * Returns null outside Years 1 to 6, where there are no objectives to read.
 */
export function nextTermTarget(birthday: Date, on: Date): SheetTarget | null {
  const m = on.getUTCMonth()
  const d = on.getUTCDate()
  const current = yearGroupFor(birthday, on)

  let term: Term
  let yearGroup = current
  if (m === 7) {
    // August. academicYearStart already reads August as the year just gone, so
    // the child's next year group is one above what yearGroupFor returns.
    term = 'autumn'
    yearGroup = current + 1
  } else if (m === 11 && d >= 20) {
    term = 'spring'
  } else if (m === 3 && d < 15) {
    term = 'summer'
  } else {
    // A half term, or term time. Either way the current term is what is next.
    term = termFor(on).term
  }

  if (yearGroup < MIN_YEAR || yearGroup > MAX_YEAR) return null
  return { yearGroup, term, lookingBack: false }
}

export function sheetTarget(birthday: Date, on: Date): SheetTarget | null {
  const { term, lookingBack } = termFor(on)
  const yearGroup = yearGroupFor(birthday, on)
  if (yearGroup < MIN_YEAR || yearGroup > MAX_YEAR) return null
  return { yearGroup, term, lookingBack }
}

// What the sheet calls itself, so the child is never tested on work they have
// not met and the parent knows which it is.
export function sheetLabel(t: SheetTarget): string {
  const termName = t.term === 'autumn' ? 'Autumn' : t.term === 'spring' ? 'Spring' : 'Summer'
  return t.lookingBack
    ? `Year ${t.yearGroup}, looking back over the year`
    : `Year ${t.yearGroup}, ${termName} term`
}
