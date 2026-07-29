import { characterByKey } from '@/lib/content/stage-characters'

// The sticker book catalog. A small, hand picked set a child can actually fill:
// the five Planet Friends they grow into, a ladder of star badges, two for
// printables done at the table, and a streak. Keyed by a stable sticker_key so
// the earned_stickers table can never drift from the art. Copy is child facing,
// warm and plain, no dashes.

export type StickerRule =
  // All time stars earned (the star bank), confirmed printables, the stage the
  // child has grown into, or the family's daily streak.
  | { kind: 'stars'; n: number }
  | { kind: 'sheets'; n: number }
  | { kind: 'stage'; n: number }
  | { kind: 'streak'; n: number }

export type Sticker = {
  key: string
  name: string
  // A Planet Friend sticker shows the real character art; a badge shows an emoji
  // on a coloured ring. Exactly one of these is set.
  friendKey?: string
  emoji?: string
  // The ring colour, from the house tokens, so the book reads as one set.
  colour: string
  // How to earn it, in the child's words.
  earn: string
  rule: StickerRule
}

export const STICKERS: Sticker[] = [
  // The Planet Friends, one for each stage the child grows into.
  { key: 'friend-pebble', name: 'Pebble', friendKey: 'pebble', colour: '#EDC35F', earn: 'Reach Stage 1', rule: { kind: 'stage', n: 1 } },
  { key: 'friend-bloop', name: 'Bloop', friendKey: 'bloop', colour: '#2F8F6B', earn: 'Reach Stage 2', rule: { kind: 'stage', n: 2 } },
  { key: 'friend-orbit', name: 'Orbit', friendKey: 'orbit', colour: '#2E6F8E', earn: 'Reach Stage 3', rule: { kind: 'stage', n: 3 } },
  { key: 'friend-nova', name: 'Nova', friendKey: 'nova', colour: '#7A5CC0', earn: 'Reach Stage 4', rule: { kind: 'stage', n: 4 } },
  { key: 'friend-cosmo', name: 'Cosmo', friendKey: 'cosmo', colour: '#D4600A', earn: 'Reach Stage 5', rule: { kind: 'stage', n: 5 } },

  // The star ladder.
  { key: 'stars-1', name: 'First Star', emoji: '⭐', colour: '#EDC35F', earn: 'Earn your first star', rule: { kind: 'stars', n: 1 } },
  { key: 'stars-10', name: 'Ten Stars', emoji: '🌟', colour: '#EDC35F', earn: 'Earn 10 stars', rule: { kind: 'stars', n: 10 } },
  { key: 'stars-25', name: 'Twenty Five', emoji: '✨', colour: '#C99A28', earn: 'Earn 25 stars', rule: { kind: 'stars', n: 25 } },
  { key: 'stars-50', name: 'Fifty Stars', emoji: '🏅', colour: '#C99A28', earn: 'Earn 50 stars', rule: { kind: 'stars', n: 50 } },
  { key: 'stars-100', name: 'Star Champion', emoji: '🏆', colour: '#D4600A', earn: 'Earn 100 stars', rule: { kind: 'stars', n: 100 } },

  // Printables done away from a screen.
  { key: 'sheets-1', name: 'First Sheet', emoji: '🖍️', colour: '#2E6F8E', earn: 'Finish your first printable', rule: { kind: 'sheets', n: 1 } },
  { key: 'sheets-5', name: 'Five Sheets', emoji: '📚', colour: '#2E6F8E', earn: 'Finish 5 printables', rule: { kind: 'sheets', n: 5 } },

  // Showing up.
  { key: 'streak-7', name: 'Week Streak', emoji: '🔥', colour: '#D4600A', earn: 'Keep a 7 day streak', rule: { kind: 'streak', n: 7 } },
]

// The full colour art for a Planet Friend sticker, or null for a badge.
//
// The CUTOUT, not the img. A sticker is a thing peeled off a sheet and stuck
// down, so it has to float with no background of its own. img is the character
// standing on a finished scene, and dropping that into a 64px circle put a
// rectangle of background inside a round frame on every Planet Friend sticker,
// in the parent book and the child one.
//
// cutout exists for exactly this and every other child facing surface already
// uses it: KidRoad, KidSquadIntro, StreakBar, CoinsView, KidQuestScreen and
// BalanceInsight. The sticker book was the only one that did not.
export function stickerArt(s: Sticker): string | null {
  return s.friendKey ? (characterByKey(s.friendKey)?.cutout ?? null) : null
}
