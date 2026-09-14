import { assessJobLoad, JOB_LOAD_SOURCES } from './job-load'

// The daily jobs guide: start small, build up as the weeks go well.
//
// Justin, 14 September 2026, having just put twelve jobs on Jonny's board
// from the Top picks tab without a word from the app: "can we check we only
// allow recommended daily jobs and build up as they get better at doing them
// so they are not overwhelmed. A little warning and advice, not blocked."
//
// The sweet spot per age already lived in job-load.ts (three a day at four to
// seven, up to six from thirteen), with NHS, NSPCC and the chores research
// behind it. What was missing was the BUILD UP: a child new to the deal does
// not start at their ceiling, they start with two or three and earn the next
// one by having a week go well. So the guide has three numbers:
//
//   start     where a new child begins: two at four to ten, three from eleven
//   ceiling   the age's sweet spot, from job-load
//   guide     start plus one for every week that went well, never past the
//             ceiling. A week goes well when four or more jobs were ticked
//             and agreed in it (most days, something got done). The last four
//             weeks count, this one included, so a good week lifts the guide
//             the moment it happens.
//
// NOTHING IS ENFORCED. The API takes every add it took before. The guide is
// a card that says where the child is, why, and what to do, in the parent's
// own hands. Pure and side effect free, so the page, the composer and a guard
// all read the same number.

export type JobGuideStatus = 'room' | 'at' | 'over'

export type JobGuide = {
  count: number
  start: number
  ceiling: number
  guide: number
  weeksWell: number
  status: JobGuideStatus
  bandLabel: string
  headline: string
  advice: string
  /** The one line that keeps this advice, never a rule. */
  nothingBlocked: string
  sources: typeof JOB_LOAD_SOURCES
}

/** Where a new child starts: half the ceiling, rounded up, never under two. */
export function startingJobs(ceiling: number): number {
  return Math.max(2, Math.ceil(ceiling / 2))
}

/** Monday of the week holding `d`, as a local date at midnight. */
function mondayOf(d: Date): Date {
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const day = (m.getDay() + 6) % 7
  m.setDate(m.getDate() - day)
  return m
}

/**
 * How many of the last `weeks` weeks (this one included) had at least
 * `needed` approved ticks. Dates are ISO days (YYYY-MM-DD) as the ticks table
 * stores them.
 */
export function weeksGoingWell(approvedDates: readonly string[], today = new Date(), weeks = 4, needed = 4): number {
  const thisMonday = mondayOf(today)
  const counts = new Array<number>(weeks).fill(0)
  for (const iso of approvedDates) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
    if (!m) continue
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    const weeksBack = Math.round((thisMonday.getTime() - mondayOf(d).getTime()) / (7 * 86400000))
    if (weeksBack < 0 || weeksBack >= weeks) continue
    counts[weeksBack] += 1
  }
  return counts.filter(c => c >= needed).length
}

export function jobGuide(ageBand: string | null, dueToday: number, approvedDates: readonly string[], today = new Date()): JobGuide {
  const load = assessJobLoad(ageBand, [])
  const ceiling = load.maxJobs
  const start = startingJobs(ceiling)
  const weeksWell = weeksGoingWell(approvedDates, today)
  const guide = Math.min(ceiling, start + weeksWell)
  const count = Math.max(0, dueToday)
  const status: JobGuideStatus = count > guide ? 'over' : count === guide ? 'at' : 'room'
  const bandLabel = load.bandLabel
  const room = guide - count

  const headline =
    status === 'over' ? `${count} a day is a lot for ${bandLabel}`
    : status === 'at' ? `${count} a day is the guide for now`
    : count === 0 ? `Start with ${guide} a day`
    : `Room for ${room} more`

  const advice =
    status === 'over'
      ? `The guide right now is ${guide}: ${start} to start, one more for every week that goes well, up to ${ceiling} at ${bandLabel}. A list a child stops reading earns nothing. Keep the best ${guide} and bring the others back one at a time as the weeks go well.`
    : status === 'at'
      ? `Enough for ${bandLabel} while the routine settles. When a week goes well, most days ticked and agreed, the guide goes up by one, to ${ceiling} at most.`
    : `The guide for ${bandLabel} is ${guide} a day right now${weeksWell > 0 ? `, up ${weeksWell} from the start because ${weeksWell === 1 ? 'a week' : `${weeksWell} weeks`} went well` : ''}. Start small and build up as the weeks go well.`

  return {
    count, start, ceiling, guide, weeksWell, status, bandLabel, headline, advice,
    nothingBlocked: 'Nothing is blocked. Add what suits your family, this is advice, not a rule.',
    sources: JOB_LOAD_SOURCES,
  }
}
