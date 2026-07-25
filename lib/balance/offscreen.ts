// The off screen total, in one place, because it was being worked out two
// different ways and the same week read differently on two screens.
//
// The stats page counted 15 minutes a job and 20 a sheet. The tracker multiplied
// the STARS by the screen time exchange rate. Those disagree, and the star route
// is the wrong idea twice over: stars measure what a thing is WORTH, not how
// long it took, and the exchange rate is about buying screen time, nothing to do
// with how long a child sat colouring.
//
// So the estimate is by count, honestly labelled as an estimate. We do not track
// off screen minutes directly and should not pretend otherwise: a job is a
// quarter of an hour of real world effort, a printed sheet is twenty minutes at
// the table. Both are deliberately modest, so the off screen total is never
// flattering.

export const MINUTES_PER_JOB = 15
export const MINUTES_PER_SHEET = 20

export type OffscreenInput = {
  /** Approved job ticks this week. */
  jobs: number
  /** Stars those jobs paid. */
  jobStars: number
  /** Confirmed printable sheets this week. */
  sheets: number
  /** Stars those sheets paid. */
  sheetStars: number
}

export type Offscreen = { activities: number; stars: number; minutes: number }

export function buildOffscreen({ jobs, jobStars, sheets, sheetStars }: OffscreenInput): Offscreen {
  return {
    activities: Math.max(0, jobs) + Math.max(0, sheets),
    stars: Math.max(0, jobStars) + Math.max(0, sheetStars),
    minutes: Math.max(0, jobs) * MINUTES_PER_JOB + Math.max(0, sheets) * MINUTES_PER_SHEET,
  }
}
