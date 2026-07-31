// Streaks unlock the Planet Friends. Every four completed streaks unlocks the
// next Friend, so a reliable child earns the family in weeks rather than waiting
// years for the passport stages. This sits on top of the stage unlock: a child
// has whichever is further along.
//
// A streak is a completed DAY: all five of the five a day landed, recorded in
// kid_days. The older jobs run (five days of every job on time, in job_streaks)
// still counts, so no child loses ground, but the two are combined with max
// rather than summed. See streakCurrency for why.
//
// Until this, kid_days computed a streak and nothing on earth read it: a child
// finished all five, got an animation and a number, and the number bought
// nothing. That was the whole of "where does the five a day land".

import { characterForStage, type StageCharacter } from '@/lib/content/stage-characters'

export const STREAKS_PER_FRIEND = 4

/**
 * The one number the Friends are bought with.
 *
 * Justin, 31 July: "a streak per day and then 4 streaks unlock family friends."
 * So a streak IS a completed day, which is what migration 134 always said it
 * was and what nothing ever read.
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
  return Math.floor(Math.max(0, completedStreaks) / STREAKS_PER_FRIEND)
}

// How many streaks are banked toward the next Friend (0 to 3), and how many
// more are needed to unlock it.
export function streaksBankedTowardNext(completedStreaks: number): number {
  return Math.max(0, completedStreaks) % STREAKS_PER_FRIEND
}
export function streaksToNextFriend(completedStreaks: number): number {
  return STREAKS_PER_FRIEND - streaksBankedTowardNext(completedStreaks)
}

// The total Friends a child has earned: the further of the stage unlock and the
// streak unlock, capped at the five that exist.
export function earnedFriends(stageEarned: number, completedStreaks: number): number {
  return Math.min(5, Math.max(Math.max(0, stageEarned), friendsFromStreaks(completedStreaks)))
}

// The next Friend still to earn, or null when the whole family is home.
export function nextFriendToEarn(earned: number): StageCharacter | null {
  if (earned >= 5) return null
  return characterForStage(earned + 1) ?? null
}

// How many more streaks until THIS particular Friend joins, so a child can be
// told exactly what each locked one costs rather than a vague keep going. A
// Friend at stage N wants N complete runs of four, so Pebble is four streaks
// away from nothing and Cosmo is twenty. Returns 0 once it is theirs.
export function streaksToUnlockFriend(stageId: number, completedStreaks: number): number {
  const needed = Math.max(0, stageId) * STREAKS_PER_FRIEND
  return Math.max(0, needed - Math.max(0, completedStreaks))
}
