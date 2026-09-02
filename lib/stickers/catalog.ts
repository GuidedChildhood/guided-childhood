import { characterByKey } from '@/lib/content/stage-characters'
import { FRIEND_STREAKS } from '@/lib/pathway/streak-unlock'

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
  | { kind: 'streak'; n: number }
  // A Planet Friend. `n` is which one (1 to 5, in stage order) and `streaks` is
  // the completed days it costs, from the ladder in lib/pathway/streak-unlock.
  //
  // This used to be `{ kind: 'stage' }` and the book read the child's AGE BAND
  // for it, so a child who joined at 13 was handed Pebble, Bloop, Orbit and
  // Nova on their first afternoon for having had birthdays. Two rows up the
  // same screen, My wins counted stages actually stamped and said 0 of 5, which
  // is how Pebble came to be earned and locked at the same time.
  //
  // Underneath the display bug was the worse one: a Friend earned by getting
  // older is not a collectible. There was nothing left to collect.
  //
  // Justin, 6 August 2026, on killing the age rule: "yes to all".
  | { kind: 'friend'; n: number; streaks: number }
  // A passport stamp. `n` is the stage (1 to 5) whose page has been stamped.
  | { kind: 'stamp'; n: number }
  // Lessons passed in the shared player, counted for THIS child. Justin, 2
  // September 2026: "stickers that lessons done are added." A whole stage
  // stamps the passport, which takes months; these are the rungs on the way.
  | { kind: 'lessons'; n: number }
  // A worry the parent raised for this child and then gave five stars.
  //
  // Justin, 2 September 2026: "trace the moment that the parent said phones
  // in the car were a problem: as the star went to 5 stars, so great, you
  // scored a stamp in your passport." One sticker per worry, made at read
  // time from the concerns table rather than listed here, because the worries
  // are the family's own. `n` is always 5: the stars it takes.
  | { kind: 'sorted'; n: 5 }

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
  // The Planet Friends, earned with completed days. The KEYS are unchanged, so
  // any child who already holds one keeps it: earned_stickers is permanent and
  // the reconcile in book.ts only ever adds.
  { key: 'friend-pebble', name: 'Pebble', friendKey: 'pebble', colour: '#EDC35F', earn: 'Finish 2 full days', rule: { kind: 'friend', n: 1, streaks: FRIEND_STREAKS[0] } },
  { key: 'friend-bloop', name: 'Bloop', friendKey: 'bloop', colour: '#2F8F6B', earn: 'Finish 10 full days', rule: { kind: 'friend', n: 2, streaks: FRIEND_STREAKS[1] } },
  { key: 'friend-orbit', name: 'Orbit', friendKey: 'orbit', colour: '#2E6F8E', earn: 'Finish 22 full days', rule: { kind: 'friend', n: 3, streaks: FRIEND_STREAKS[2] } },
  { key: 'friend-nova', name: 'Nova', friendKey: 'nova', colour: '#7A5CC0', earn: 'Finish 38 full days', rule: { kind: 'friend', n: 4, streaks: FRIEND_STREAKS[3] } },
  { key: 'friend-cosmo', name: 'Cosmo', friendKey: 'cosmo', colour: '#D4600A', earn: 'Finish 58 full days', rule: { kind: 'friend', n: 5, streaks: FRIEND_STREAKS[4] } },

  // The stamps. The rare tier, and the reason the book has a top.
  //
  // Justin asked for "other highly collectible items". The product already has
  // the five rarest things it will ever have, and they were landing on the
  // parent's passport and nowhere in the child's book at all. Finishing a
  // stage's lessons and passing the big end of stage check is the hardest and
  // most meaningful thing a child does here, it takes months rather than days,
  // and it cannot be rushed with one good fortnight the way the saving ladder
  // can. It also finally gives the stage check a prize on the child's side.
  { key: 'stamp-foundation', name: 'Foundation Stamp', emoji: '🛂', colour: '#EDC35F', earn: 'Stamp your Foundation page', rule: { kind: 'stamp', n: 1 } },
  { key: 'stamp-builder', name: 'Builder Stamp', emoji: '🛂', colour: '#2F8F6B', earn: 'Stamp your Builder page', rule: { kind: 'stamp', n: 2 } },
  { key: 'stamp-explorer', name: 'Explorer Stamp', emoji: '🛂', colour: '#2E6F8E', earn: 'Stamp your Explorer page', rule: { kind: 'stamp', n: 3 } },
  { key: 'stamp-shaper', name: 'Shaper Stamp', emoji: '🛂', colour: '#7A5CC0', earn: 'Stamp your Shaper page', rule: { kind: 'stamp', n: 4 } },
  { key: 'stamp-independent', name: 'Independent Stamp', emoji: '🛂', colour: '#D4600A', earn: 'Stamp your Independent page', rule: { kind: 'stamp', n: 5 } },

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
  //
  // The earn lines are uniform now. The first used to carry "you did not use" as
  // a one off explainer, which meant the definition of a save lived on one tile
  // and every other tile assumed you had read it. It lives on the page itself
  // instead, in the how it works block, along with the two things a child could
  // not have guessed: that saves are counted on Monday, and that they buy these
  // stickers rather than more minutes. See components/kid/KidStickers.tsx.
  { key: 'stars-1', name: 'First Save', emoji: '⭐', colour: '#EDC35F', earn: 'Save 3 half hours', rule: { kind: 'credits', n: 3 } },
  { key: 'stars-10', name: 'Good Saver', emoji: '🌟', colour: '#EDC35F', earn: 'Save 8 half hours', rule: { kind: 'credits', n: 8 } },
  { key: 'stars-25', name: 'Time Keeper', emoji: '✨', colour: '#C99A28', earn: 'Save 15 half hours', rule: { kind: 'credits', n: 15 } },
  { key: 'stars-50', name: 'Minute Master', emoji: '🏅', colour: '#C99A28', earn: 'Save 25 half hours', rule: { kind: 'credits', n: 25 } },
  { key: 'stars-100', name: 'Champion Saver', emoji: '🏆', colour: '#D4600A', earn: 'Save 40 half hours', rule: { kind: 'credits', n: 40 } },

  // Printables done away from a screen.
  { key: 'sheets-1', name: 'First Sheet', emoji: '🖍️', colour: '#2E6F8E', earn: 'Finish your first printable', rule: { kind: 'sheets', n: 1 } },
  { key: 'sheets-5', name: 'Five Sheets', emoji: '📚', colour: '#2E6F8E', earn: 'Finish 5 printables', rule: { kind: 'sheets', n: 5 } },

  // Showing up.
  { key: 'streak-7', name: 'Week Streak', emoji: '🔥', colour: '#D4600A', earn: 'Keep a 7 day streak', rule: { kind: 'streak', n: 7 } },

  // Lessons passed. The first is the moment (one lesson, passed properly at
  // the seventy percent line the player holds), then five, then ten. Every
  // lesson also fills the stage stamp above, so the ladder is the short road
  // and the stamp is the long one.
  { key: 'lessons-1', name: 'First Lesson', emoji: '📚', colour: '#2E6F8E', earn: 'Pass your first lesson', rule: { kind: 'lessons', n: 1 } },
  { key: 'lessons-5', name: 'Five Lessons', emoji: '📚', colour: '#2E6F8E', earn: 'Pass 5 lessons', rule: { kind: 'lessons', n: 5 } },
  { key: 'lessons-10', name: 'Ten Lessons', emoji: '🎓', colour: '#7A5CC0', earn: 'Pass 10 lessons', rule: { kind: 'lessons', n: 10 } },
]

/** The sticker key for a sorted worry, one per concern. */
export function sortedStickerKey(concernId: string): string {
  return `sorted-${concernId}`
}

/** The green every sorted stamp wears: the retro green the check in says "better" in. */
export const SORTED_COLOUR = '#2F8F6B'

/**
 * A sorted stamp for one of the family's worries, in the same shape as the
 * catalog entries so every book, badge and celebration draws it the same way.
 */
export function sortedSticker(concern: { id: string; label: string }): Sticker {
  return {
    key: sortedStickerKey(concern.id),
    name: concern.label,
    emoji: '🛂',
    colour: SORTED_COLOUR,
    earn: 'Five stars from your grown up',
    rule: { kind: 'sorted', n: 5 },
  }
}

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
