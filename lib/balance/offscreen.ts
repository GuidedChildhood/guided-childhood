// The off screen total, in one place, because it was being worked out three
// different ways and the same effort read differently depending where you looked.
//
// What the three were: the stats page counted a flat 15 minutes a job, the
// tracker multiplied the STARS by the screen time exchange rate, and the job
// load advisor on the Quests page used a real per job estimate. So a parent
// could be told today's jobs are about 45 minutes in one place and see them
// counted as 30 in another.
//
// The star route was the wrong idea twice over: stars measure what a job is
// WORTH, not how long it took, and the exchange rate is about buying screen
// time, nothing to do with how long a child sat colouring. The flat average was
// not much better: putting shoes away and an hour outside are not the same
// afternoon.
//
// So this uses jobMinutes, the same per job estimate the advisor already uses,
// which reads a real number when a job carries one and otherwise matches on what
// the job actually is. More accurate than an average, no extra effort from
// anyone, and it makes the two features agree by construction.

import { jobMinutes } from '@/lib/quests/job-load'

// A printed sheet is a sit down at the table. One number is fair here because,
// unlike jobs, colouring a sheet is much the same shape whichever sheet it is.
export const MINUTES_PER_SHEET = 20

export type OffscreenInput = {
  /** Approved job ticks this week, with the title so the minutes can be read
   *  from what the job actually is rather than an average across all of them. */
  jobs: { title: string; minutes?: number | null }[]
  /** Stars those jobs paid. */
  jobStars: number
  /** Confirmed printable sheets this week. */
  sheets: number
  /** Stars those sheets paid. */
  sheetStars: number
}

export type Offscreen = { activities: number; stars: number; minutes: number }

export function buildOffscreen({ jobs, jobStars, sheets, sheetStars }: OffscreenInput): Offscreen {
  const jobMins = jobs.reduce((sum, j) => sum + jobMinutes({ title: j.title, minutes: j.minutes ?? undefined }), 0)
  return {
    activities: jobs.length + Math.max(0, sheets),
    stars: Math.max(0, jobStars) + Math.max(0, sheetStars),
    minutes: jobMins + Math.max(0, sheets) * MINUTES_PER_SHEET,
  }
}
