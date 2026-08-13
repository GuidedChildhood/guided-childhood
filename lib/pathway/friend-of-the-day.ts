import { STAGE_CHARACTERS, type StageCharacter } from '@/lib/content/stage-characters'
import { PLANETS, type Planet } from '@/lib/pathway/planets'
import { dayIndex } from '@/lib/home/next-up'
import { pairFor } from '@/lib/pathway/rotation'

// ── PLANET FRIENDS, NOT PLANETS ─────────────────────────────────────────────
//
// Justin, 13 August 2026: "fix the bonuses on daily. Do not like planets, I
// like the shooting star, but we need actual Planet Friend characters to
// rotate services and pop up on the daily pathway. Every 2 days we can have a
// new one explaining why to click and do."
//
// The coin beside the road was a drawn sphere with a motif on it, which is a
// planet in the astronomy sense and means nothing to anybody. The Planet
// FRIENDS are a cast the child already knows by name from their own app, and
// running two different visual languages for one idea across two phones in one
// house is how a family stops believing it is one product.
//
// So the parent side borrows the child's cast. Same five, same art, same
// names. Pebble, Bloop, Orbit, Nova and Cosmo, from lib/content/stage
// characters, which is already the single source for all of it.
//
// ── WHAT THE FRIEND IS ACTUALLY FOR ─────────────────────────────────────────
//
// The Friend is the messenger, not the message. Each one carries one of the
// six services from lib/pathway/planets and says why to open it, because
// "here is a planet" was never a reason to tap anything. The planet's own
// title and line have always been the pitch; they just had nobody to deliver
// them.
//
// ── EVERY TWO DAYS, AND WHY THE PAIRS DRIFT ─────────────────────────────────
//
// Two days is Justin's number and it is the right one: a coin that changed
// daily is noise beside a road a parent walks every morning, and one that
// changed weekly would take six weeks to show all six services.
//
// Six characters and six services, both stepped by the same two day clock,
// with the service taking one extra step each completed lap so the pairs do
// not lock. Thirty six pairings before anything repeats, which is over two
// years. Nobody planned a schedule and nobody has to maintain one.

// ── DIGI IS ONE OF THEM ─────────────────────────────────────────────────────
//
// Justin, 13 August 2026: "note DiGi star is also a character."
//
// True, and DiGi is the one every family meets first. The five in
// stage-characters are stage bound, earned as a child grows, so DiGi cannot
// live in that list without pretending to be a sixth stage. It is a cast
// member without a stage, which is exactly what it is on the child's side too.
//
// Only the fields the road needs, so nothing here has to invent an age band, a
// blurb or an unlock line for a character that is never unlocked.
export type CastMember = {
  key: string
  name: string
  colour: string
  cutout: string
}

const DIGI: CastMember = {
  key: 'digi',
  name: 'DiGi',
  colour: 'var(--gold-dark)',
  cutout: '/digi-squad/DiGi-star.svg',
}

/** The whole cast, DiGi first because DiGi is who a family meets first. */
export const CAST: CastMember[] = [
  DIGI,
  ...STAGE_CHARACTERS.map(c => ({ key: c.key, name: c.name, colour: c.colour, cutout: c.cutout })),
]

export type FriendOfTheDay = {
  friend: CastMember
  service: Planet
  /** Why to tap, in the Friend's voice. Never more than one sentence. */
  reason: string
}

/** Whole two day blocks since the shared anchor. One clock for the whole app:
 *  the same dayIndex the daily lead rotates on, so the two can never disagree
 *  about what day it is at midnight in British summer time. */
export function friendSlot(now: Date = new Date()): number {
  return Math.floor(dayIndex(now) / 2)
}

/**
 * Today's Friend, and the one thing they are here to show.
 *
 * `avoidServiceKey` is the daily lead's subject. The lead and the bonus must
 * never offer the same thing on the same day: the whole point of the bonus is
 * that it is something ELSE, and a road that says "do your quests" beside a
 * coin that says "have you seen quests" reads as the app repeating itself,
 * which is the exact fault Justin caught within an hour the last time Home
 * said one thing in two places.
 *
 * Stepping to the next service rather than to the next Friend, because the
 * Friend is on a two day cycle a parent will actually notice and the service
 * is the part that must not collide.
 */
export function friendOfTheDay(
  now: Date = new Date(),
  avoidServiceKey?: string | null,
): FriendOfTheDay {
  const slot = friendSlot(now)
  const avoidIndex = avoidServiceKey
    ? PLANETS.findIndex(p => p.key === avoidServiceKey)
    : -1
  const { castIndex, serviceIndex } = pairFor(
    slot,
    CAST.length,
    PLANETS.length,
    avoidIndex >= 0 ? avoidIndex : undefined,
  )
  const friend = CAST[castIndex]
  const service = PLANETS[serviceIndex]

  return { friend, service, reason: service.line }
}
