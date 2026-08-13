// The pairing maths behind the Planet Friend beside the road.
//
// Pulled out of friend-of-the-day and kept free of every import, so it can be
// checked without a database, a session or the app's module aliases. The data
// it runs over lives next door; this is only the arithmetic.
//
// ── WHY THE ARITHMETIC IS WORTH ITS OWN FILE ────────────────────────────────
//
// Justin, 13 August 2026: "note DiGi star is also a character."
//
// Before that there were five Friends and six services. Five and six share no
// factor, so `slot % 5` and `slot % 6` drifted against each other on their own
// and every character eventually presented every service.
//
// Adding DiGi made it six and six, and six into six is a LOCK. Each character
// would have presented the same service for ever: DiGi the school calendar,
// Pebble the quests, and so on, until somebody noticed months later. It looks
// perfectly fine for the first twelve days, which is exactly the kind of fault
// that never gets caught by looking at it.
//
// One extra step per completed lap fixes it for ANY two counts, whether they
// share factors or not, which also means nobody has to think about this again
// when a seventh character or a seventh service arrives.

export type Pairing = { castIndex: number; serviceIndex: number }

/** Positive modulo, because a slot before the anchor is a negative number and
 *  JavaScript's % keeps the sign. */
function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

/**
 * Which character presents which service in this slot.
 *
 * `avoidServiceIndex` is the service the daily lead is already about. The lead
 * and the bonus must never offer the same thing on the same day: a road saying
 * do your quests beside a coin saying have you seen quests reads as the app
 * repeating itself. The service steps on rather than the character, because
 * the character is the part a parent notices changing.
 */
export function pairFor(
  slot: number,
  castLength: number,
  serviceLength: number,
  avoidServiceIndex?: number,
): Pairing {
  const castIndex = mod(slot, castLength)
  // The lap step. Without it, matching counts pin every pair for ever.
  const lap = Math.floor(slot / castLength)
  let serviceIndex = mod(slot + lap, serviceLength)
  if (avoidServiceIndex != null && serviceIndex === avoidServiceIndex) {
    serviceIndex = mod(serviceIndex + 1, serviceLength)
  }
  return { castIndex, serviceIndex }
}
