import { londonNow } from '@/lib/time/london'

// NOTHING BUZZES A CHILD'S PHONE AT NIGHT.
//
// Justin, 8 August 2026: "Can we make sure we don't send late pwas to child
// app. Should stop any between 19:00 and 8:00 am."
//
// Seven in the evening until eight in the morning, so the allowed window is
// 08:00 to 18:59 and everything else is held. 19:00 exactly is already quiet,
// 08:00 exactly is already awake.
//
// WHY THE HOUR IS READ IN LONDON AND NOT FROM THE SERVER CLOCK. Vercel runs in
// UTC and the families are in the UK, which is an hour ahead for seven months
// of the year. A naive UTC check would be a blanket that slips: through August
// it would let pushes through until 20:00 British time, which is the exact hour
// Justin is complaining about, and then keep blocking until 09:00, holding back
// the morning ones nobody asked to stop. londonNow already exists and already
// survives the clocks changing, so this leans on it rather than doing date
// arithmetic again. That helper's own comment records what the last hand rolled
// version of this cost.
//
// HELD, NOT QUEUED. A push stopped here is dropped, not delivered later. That
// is deliberate and it is the honest reading of "stop any": a jobs reminder
// from 21:00 is not worth waking up to at 08:00, and every one of these has a
// home on the child's own page, which shows the same news the next time they
// open it. Nothing is lost, it just stops being a buzz.

/** The first hour that is too late. 19:00 is quiet. */
export const QUIET_FROM_HOUR = 19
/** The first hour that is early enough. 08:00 is awake. */
export const QUIET_UNTIL_HOUR = 8

/**
 * Is it currently too late, or too early, to buzz a child's device?
 *
 * The window crosses midnight, so this is an OR rather than the range check it
 * looks like it should be. 19, 20 ... 23, 0, 1 ... 7 are all quiet.
 */
export function inChildQuietHours(at: Date = new Date()): boolean {
  const { hour } = londonNow(at)
  return hour >= QUIET_FROM_HOUR || hour < QUIET_UNTIL_HOUR
}
