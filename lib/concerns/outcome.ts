import { SILVER_RUN, TOP_BAND } from '@/lib/concerns/resting'
import { bandOf } from '@/lib/concerns/bands'

// WHAT ONE TAP ON THE CHECK IN MEANS, SAID ONCE.
//
// Justin, 7 October 2026: "Stars rating needs to be made super easy and quick
// to do and obvious to do. It is all wired into keeping on check if less than
// 5 and drops off if 5, and special attention if less than 3 ... Tell the
// user exactly what happens."
//
// Before this file the card had four separate places that spoke after a tap:
// a verdict line comparing today with last time, a green box for five, a
// quiet line for four, another for one to three, and a pair of buttons that
// appeared on a dip. They were written months apart and on 7 October two of
// them were on screen together, one saying "one more like this" and the other
// "that is sorted". The rule had moved to two good days in a row on
// 9 September and only one of the four had heard.
//
// So the message is a pure function of three numbers, and the card renders
// what it returns and nothing else. `line` is the one sentence under the
// faces. `next` is what happens to the worry now, in plain words. `actions`
// are the help buttons, and they come with every low score rather than only
// a dip, because a parent at "really tough" needs the words tonight whether
// or not yesterday was better.
//
// It reads TOP_BAND and SILVER_RUN from resting.ts rather than carrying its
// own, which is the whole point: the card can never again say a worry is
// sorted on a day the resting rule would still ask about it.

export type OutcomeKind = 'rest' | 'nearly' | 'keep' | 'attention'
export type OutcomeAction = 'digi' | 'script'

export type CheckinOutcome = {
  kind: OutcomeKind
  /** The one sentence under the faces. */
  line: string
  /** What happens to the worry now, in plain words. */
  next: string
  /** Help buttons, in the order they are shown. Empty means none. */
  actions: OutcomeAction[]
}

/** The five bands as the parent reads them, worst to best. Index is band minus one. */
export const BAND_WORDS = ['Really tough', 'Hard going', 'Up and down', 'Getting there', 'Going great'] as const

/** The band a top score lands in: five, going great. */
export const TOP = bandOf(TOP_BAND)

/** At or below this band a parent gets help on the spot, not only a note. */
export const ATTENTION_BAND = 2

function word(band: number): string {
  return BAND_WORDS[Math.min(BAND_WORDS.length, Math.max(1, band)) - 1]
}

function count(n: number): string {
  return ['', 'one', 'two', 'three', 'four', 'five'][n] ?? String(n)
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/**
 * The outcome of rating a worry `band` today.
 *
 * `lastBand` is the band of the last score the parent gave it, null for a
 * first ever score. `topRun` is how many top band scores sit on the end of
 * its run BEFORE today, counted by lib/concerns/scores the way the resting
 * rule counts them.
 */
export function checkinOutcome({ band, lastBand, topRun }: {
  band: number
  lastBand: number | null
  topRun: number
}): CheckinOutcome {
  const b = Math.min(TOP, Math.max(1, Math.round(band)))

  if (b === TOP) {
    const run = Math.max(0, topRun) + 1
    if (run >= SILVER_RUN) {
      return {
        kind: 'rest',
        line: `Sorted! That is ${count(SILVER_RUN)} great days.`,
        next: 'Off your list. We will check in a week that it held. If it comes back, log it as a moment.',
        actions: [],
      }
    }
    const left = SILVER_RUN - run
    return {
      kind: 'nearly',
      line: 'Great day.',
      next: `${cap(count(left))} more like this and it comes off your list.`,
      actions: [],
    }
  }

  if (b <= ATTENTION_BAND) {
    return {
      kind: 'attention',
      line: 'Tough one. Thank you for telling us.',
      next: 'We are on it with you. Here is help for tonight.',
      actions: ['digi', 'script'],
    }
  }

  // Three or four: the word, and how it sits against last time, in words.
  const w = word(b)
  const line = lastBand == null
    ? `${w}. First one logged.`
    : b > lastBand ? `${w}, up from ${word(lastBand).toLowerCase()}.`
    : b < lastBand ? `${w}, down from ${word(lastBand).toLowerCase()}.`
    : `${w}, same as last time.`
  return {
    kind: 'keep',
    line,
    next: 'Stays on your list. We will ask again next check in.',
    actions: [],
  }
}
