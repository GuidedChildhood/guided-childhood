import { characterByKey } from '@/lib/content/stage-characters'

// The sticker book catalog. A small, hand picked set a child can actually fill:
// the five Planet Friends they grow into, a ladder of star badges, two for
// printables done at the table, and a streak. Keyed by a stable sticker_key so
// the earned_stickers table can never drift from the art. Copy is child facing,
// warm and plain, no dashes.

export type StickerRule =
  // Sticker credits (screen minutes earned and NOT spent, paid out each Monday),
  // confirmed printables, the stage the child has grown into, or the daily streak.
  //
  // This used to be `stars`, meaning the all time star total. That made the book a
  // second scoreboard for the one behaviour the star chart already rewards, and it
  // was also the reason a weekly reset could not ship on its own: sticker progress
  // came off the same cumulative number the reset was there to clear, so every
  // Monday would have taken stickers away.
  //
  // Credits invert it. The chart pays doing the jobs; the book pays not spending
  // what you earned. That is the lesson the product exists to teach, in a mechanic
  // a child can see: the one who uses less gets more.
  | { kind: 'credits'; n: number }
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

  // The saving ladder. One credit is half an hour of screen time a child earned
  // and chose not to use, paid out on a Monday.
  //
  // The KEYS are unchanged on purpose, even though the rule behind them is not.
  // They are persisted in earned_stickers, so keeping them means a child who has
  // already got one keeps it. Renaming them would have quietly emptied every test
  // family's book.
  //
  // Thresholds re-cut for the new currency. The old 1, 10, 25, 50, 100 were set
  // against cumulative stars and finished the whole set in about seventeen days,
  // which is not the "month or so" Justin asked for. At a realistic 2 to 5 credits
  // a week these land the first inside week two and the last around week ten, so
  // the book is felt early and still has somewhere to go.
  { key: 'stars-1', name: 'First Save', emoji: '⭐', colour: '#EDC35F', earn: 'Save 3 half hours you did not use', rule: { kind: 'credits', n: 3 } },
  { key: 'stars-10', name: 'Good Saver', emoji: '🌟', colour: '#EDC35F', earn: 'Save 8 half hours', rule: { kind: 'credits', n: 8 } },
  { key: 'stars-25', name: 'Time Keeper', emoji: '✨', colour: '#C99A28', earn: 'Save 15 half hours', rule: { kind: 'credits', n: 15 } },
  { key: 'stars-50', name: 'Minute Master', emoji: '🏅', colour: '#C99A28', earn: 'Save 25 half hours', rule: { kind: 'credits', n: 25 } },
  { key: 'stars-100', name: 'Champion Saver', emoji: '🏆', colour: '#D4600A', earn: 'Save 40 half hours', rule: { kind: 'credits', n: 40 } },

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
