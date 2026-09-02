import { characterForStage } from '@/lib/content/stage-characters'
import { streaksForFriend, friendsFromStreaks } from '@/lib/pathway/streak-unlock'

// Which wins a child has earned, and what to say about each one.
//
// Pure. Given four numbers it returns the full list of milestones that SHOULD
// exist for this child. The route inserts the ones that do not yet, and the
// unique index on (child_id, kind, key) makes that safe to run on every load.
//
// Justin: "when streaks are achieved on child's app the add a family member are
// real celebrations and can pop up then on next login so you can see the family
// growing and they feel they have achieved."
//
// THE ONE RULE THAT SHAPES ALL OF THIS. A celebration has to be rare or it is
// not a celebration. A child who gets a takeover animation every single day
// learns in about a week that the animation means nothing, and the day they
// actually do something remarkable it looks the same as a Tuesday.
//
// So the day itself is NOT on this list. Finishing the five a day already has
// its own moment on the screen, in the moment, which is right: it is warm, it is
// immediate, and it is over. What lands here is only the thing worth stopping
// for, and there are about twenty of them in a childhood.
//
// NO LOSS LANGUAGE ANYWHERE. Nothing here says a run is at risk, that a streak
// will be lost, or that a child is behind. The run is named when it exists and
// is silent when it does not. That is the ICO Children's Code position on
// engineered urgency and it is also simply how you would talk to a child.

export type MilestoneKind = 'friend' | 'run' | 'bank' | 'sorted'

export type Milestone = {
  kind: MilestoneKind
  /** The rung of the ladder. Unique per child per kind, which is the once only rule. */
  key: string
  /** The number behind it: streaks, days, or stars. */
  value: number
  label: string
  detail: string
  /** Which Planet Friend delivers it. */
  character: string
}

/**
 * Days in a row worth stopping for.
 *
 * Nine rungs, and the gaps widen on purpose: three days is a real achievement
 * for a child who has never managed two, and by the time they are at fifty the
 * next one has to be a long way off or it stops being an achievement at all.
 *
 * A hundred is the last one. Not because nothing beyond it counts, but because a
 * child who has done a hundred days in a row does not need us to tell them.
 */
export const RUN_RUNGS = [3, 5, 7, 10, 14, 21, 30, 50, 100]

/** Stars in the bank worth stopping for. Same ladder the old localStorage one used. */
export const BANK_RUNGS = [10, 25, 50, 100, 200, 500]

function runCopy(days: number): { label: string; detail: string } {
  if (days >= 100) {
    return {
      label: `${days} days in a row`,
      detail: 'A hundred days. There is nothing left for us to say about that, so we will just say well done.',
    }
  }
  if (days >= 30) {
    return {
      label: `${days} days in a row`,
      detail: 'A whole month of showing up. That is not luck any more, that is who you are.',
    }
  }
  if (days >= 10) {
    return {
      label: `${days} days in a row`,
      detail: 'Ten days is where a thing stops being hard and starts being normal. You are past it.',
    }
  }
  if (days >= 7) {
    return {
      label: 'A full week in a row',
      detail: 'Seven days, every one of them. Your grown up should know about this.',
    }
  }
  return {
    label: `${days} days in a row`,
    detail: 'You showed up again and again. That is the hard bit and you have done it.',
  }
}

/**
 * Everything this child has earned, as milestone rows.
 *
 * `completedStreaks` is the streak currency (see streak-unlock: completed days
 * and job runs, combined with max). `bestRun` is the longest run of consecutive
 * days they have ever had, which is a different number from the current run and
 * is the one worth celebrating: a run milestone earned in March must not
 * disappear because the run ended in April.
 */
export function milestonesEarned(input: {
  completedStreaks: number
  bestRun: number
  bankBalance: number
  /**
   * The worries the parent raised for this child and has since given five
   * stars, from lib/concerns/sorted. Each is a stamp in the passport and the
   * win a child most deserves to be told about, because it is the one the
   * whole product is for.
   */
  sorted?: { id: string; label: string }[]
  /** The Planet Friend who delivers a sorted stamp: the child's own, or Pebble. */
  friend?: string
}): Milestone[] {
  const out: Milestone[] = []

  // ── Sorted together ─────────────────────────────────────────────────────
  // Justin, 2 September 2026: "as the star went to 5 stars, so great, you
  // scored a stamp in your passport." Keyed on the worry, so each one lands
  // once however many times the parent scores it five.
  for (const w of input.sorted ?? []) {
    out.push({
      kind: 'sorted',
      key: w.id,
      value: 5,
      label: `${w.label}: sorted`,
      detail: 'Your grown up gave it five stars. That was you. It is stamped in your passport.',
      character: input.friend ?? 'pebble',
    })
  }

  // ── The family growing ──────────────────────────────────────────────────
  // Each rung of the ladder brings a Planet Friend home. This is the big one, and it
  // is the one Justin means by "see the family growing".
  const friends = Math.min(5, friendsFromStreaks(input.completedStreaks))
  for (let stage = 1; stage <= friends; stage++) {
    const c = characterForStage(stage)
    if (!c) continue
    out.push({
      kind: 'friend',
      key: c.key,
      value: streaksForFriend(stage),
      label: `${c.name} joined your family`,
      detail: c.unlockLine,
      character: c.key,
    })
  }

  // ── Days in a row ───────────────────────────────────────────────────────
  for (const rung of RUN_RUNGS) {
    if (input.bestRun < rung) break
    const copy = runCopy(rung)
    out.push({
      kind: 'run',
      key: String(rung),
      value: rung,
      label: copy.label,
      detail: copy.detail,
      // Orbit is the explorer, and a run is the most ordinary kind of bravery
      // there is: doing the same thing again when nobody is watching.
      character: 'orbit',
    })
  }

  // ── Stars banked ────────────────────────────────────────────────────────
  for (const rung of BANK_RUNGS) {
    if (input.bankBalance < rung) break
    out.push({
      kind: 'bank',
      key: String(rung),
      value: rung,
      label: `${rung} stars in the bank`,
      detail: 'Every one of them earned. That is a proper pile.',
      character: 'nova',
    })
  }

  return out
}

/**
 * The longest run of consecutive days in a set of dates, and the current one.
 *
 * Both from the same walk because they answer the same shape of question and
 * disagreeing about it would be worse than either being slightly wrong. The
 * current run ends today or yesterday: a child who has not opened the app yet
 * today has not broken anything, and telling them they had at nine in the
 * morning would be both wrong and unkind.
 */
export function runsFromDays(days: string[], today: string): { best: number; current: number } {
  const set = new Set(days)
  const sorted = [...set].sort()
  let best = 0
  let run = 0
  let prev: string | null = null
  for (const d of sorted) {
    run = prev && isNextDay(prev, d) ? run + 1 : 1
    if (run > best) best = run
    prev = d
  }

  // The current run, walked backwards from today or yesterday.
  const yesterday = shiftDay(today, -1)
  let current = 0
  let cursor = set.has(today) ? today : set.has(yesterday) ? yesterday : null
  while (cursor && set.has(cursor)) {
    current++
    cursor = shiftDay(cursor, -1)
  }

  return { best, current }
}

/** Is `b` the calendar day right after `a`? Both YYYY-MM-DD. */
function isNextDay(a: string, b: string): boolean {
  return shiftDay(a, 1) === b
}

/** A date string moved by whole days. UTC arithmetic on a date only string, so
 *  no clock and no timezone can shift the answer by one. */
function shiftDay(day: string, by: number): string {
  const t = Date.parse(`${day}T00:00:00Z`)
  if (!Number.isFinite(t)) return day
  return new Date(t + by * 86_400_000).toISOString().slice(0, 10)
}
