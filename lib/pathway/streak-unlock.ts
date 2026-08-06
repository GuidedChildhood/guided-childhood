// Streaks unlock the Planet Friends. This is the ONE rule now, and the ladder
// below is the whole of it.
//
// A streak is a completed DAY: all five of the five a day landed, recorded in
// kid_days. The older jobs run (five days of every job on time, in job_streaks)
// still counts, so no child loses ground, but the two are combined with max
// rather than summed. See streakCurrency for why.
//
// Until this, kid_days computed a streak and nothing on earth read it: a child
// finished all five, got an animation and a number, and the number bought
// nothing. That was the whole of "where does the five a day land".
//
// WHY THE LADDER IS NOT FLAT (Justin, 6 August 2026: "yes to all")
//
// It used to be four streaks per Friend, flat. Twenty completed days bought
// every character in the product, which at a realistic three or four good days
// a week is about five weeks. Then a collection meant to grow with a child all
// the way to 16 had nothing left in it.
//
// So the first is nearly free and the last is a season's work:
//
//   Pebble    2 days    inside week one, which is the one that decides
//                       whether a child believes any of this is real
//   Bloop    10 days    about week three
//   Orbit    22 days    about month two
//   Nova     38 days    about month three
//   Cosmo    58 days    about month five, and worth telling people about
//
// Fast at the start, rare at the top. The passport stamps sit above all five
// and take years, which is the honest shape of the promise.

import { characterForStage, type StageCharacter } from '@/lib/content/stage-characters'

/**
 * Completed days needed for each Friend, in stage order.
 *
 * Index 0 is Pebble. Exported because the sticker book prints these as the
 * "what this costs" line on every locked Friend, and a second copy of the
 * numbers is a second chance to disagree with this one.
 */
export const FRIEND_STREAKS = [2, 10, 22, 38, 58] as const

/** Completed days for the Friend at this stage (1 to 5), or Infinity if none. */
export function streaksForFriend(stageId: number): number {
  return FRIEND_STREAKS[stageId - 1] ?? Infinity
}

/**
 * The one number the Friends are bought with.
 *
 * Justin, 31 July: "a streak per day and then 4 streaks unlock family friends."
 * So a streak IS a completed day, which is what migration 134 always said it
 * was and what nothing ever read. (The four is now the ladder above.)
 *
 * Two counters feed it and they are combined with MAX, never a sum:
 *
 *   jobStreaks    rows in job_streaks, five days running of every job on time
 *   completedDays rows in kid_days with a completed_at, one per day all five landed
 *
 * They describe overlapping work. A child doing their jobs reliably earns on
 * both for the same days, so adding them would hand over the whole family in a
 * fortnight and make the unlock meaningless. Max is also what earnedFriends
 * already does with the stage route, for the same reason and with the same
 * guarantee: whichever way a child got there, they keep what they have and
 * nobody ever goes backwards when a second route is added.
 */
export function streakCurrency(jobStreaks: number, completedDays: number): number {
  return Math.max(0, Math.max(jobStreaks, completedDays))
}

export function friendsFromStreaks(completedStreaks: number): number {
  const s = Math.max(0, completedStreaks)
  let n = 0
  for (const need of FRIEND_STREAKS) if (s >= need) n++
  return n
}

// How many more streaks until the next Friend, and how many are banked toward
// it. Both walk the ladder rather than assuming an even step.
export function streaksToNextFriend(completedStreaks: number): number {
  const s = Math.max(0, completedStreaks)
  for (const need of FRIEND_STREAKS) if (s < need) return need - s
  return 0
}
export function streaksBankedTowardNext(completedStreaks: number): number {
  const s = Math.max(0, completedStreaks)
  let floor = 0
  for (const need of FRIEND_STREAKS) {
    if (s < need) return s - floor
    floor = need
  }
  return 0
}

/**
 * How many streaks the CURRENT rung is worth, end to end.
 *
 * The pip row on the streak bar draws one dot per streak in the rung it is
 * working through. That used to be a flat four, which the ladder breaks: the
 * run to Cosmo is twenty days and twenty pips would be a grey smear. Capped at
 * eight, so a long rung draws a bar rather than confetti, and the words
 * underneath carry the exact number either way.
 */
export function rungLength(completedStreaks: number): number {
  const s = Math.max(0, completedStreaks)
  let floor = 0
  for (const need of FRIEND_STREAKS) {
    if (s < need) return Math.min(8, need - floor)
    floor = need
  }
  return 0
}

/**
 * True when this exact number of streaks is the one that brings a Friend home,
 * which is the moment the takeover celebrates. A flat modulo cannot answer this
 * once the rungs are uneven.
 */
export function isFriendMoment(completedStreaks: number): boolean {
  return (FRIEND_STREAKS as readonly number[]).includes(Math.max(0, completedStreaks))
}

/**
 * The total Friends a child has earned.
 *
 * The further of the stage route and the streak route, capped at the five that
 * exist. `stageEarned` is stages actually STAMPED, which is real work, so it
 * stays. What is gone is the sticker book reading the child's AGE BAND for the
 * same thing, which handed a child who joined at 13 four of the five Friends on
 * their first afternoon and was why Pebble could read as earned and locked on
 * the same screen. See lib/stickers/book.ts.
 */
export function earnedFriends(stageEarned: number, completedStreaks: number): number {
  return Math.min(5, Math.max(Math.max(0, stageEarned), friendsFromStreaks(completedStreaks)))
}

// The next Friend still to earn, or null when the whole family is home.
export function nextFriendToEarn(earned: number): StageCharacter | null {
  if (earned >= 5) return null
  return characterForStage(earned + 1) ?? null
}

// How many more streaks until THIS particular Friend joins, so a child can be
// told exactly what each locked one costs rather than a vague keep going.
// Returns 0 once it is theirs.
export function streaksToUnlockFriend(stageId: number, completedStreaks: number): number {
  const needed = streaksForFriend(stageId)
  if (!Number.isFinite(needed)) return 0
  return Math.max(0, needed - Math.max(0, completedStreaks))
}
