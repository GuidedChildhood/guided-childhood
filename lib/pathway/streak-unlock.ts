// Streaks unlock the Planet Friends. A streak is a completed jobs run (five
// days in a row of every job done on time, recorded in job_streaks). Every four
// completed streaks unlocks the next Friend, so a reliable child earns the
// family in weeks rather than waiting years for the passport stages. This sits
// on top of the stage unlock: a child has whichever is further along.

import { characterForStage, type StageCharacter } from '@/lib/content/stage-characters'

export const STREAKS_PER_FRIEND = 4

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
