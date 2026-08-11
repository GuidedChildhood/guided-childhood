// Is the child's app still on the child's phone?
//
// Justin, 11 August 2026: "I've lost the app on my child's phone, deleted, and
// this may happen to users, so if we are able to see the app gone we can flag a
// quick share this code to put it back on the child's device."
//
// ── WHY THE APP CAN VANISH AND NOBODY FINDS OUT ──────────────────────────────
//
// The child's side is a web page saved to a home screen, which is the whole
// reason it needs no install, no login and no app store. The cost of that is
// that it can be swiped away as easily as any other icon, by a child tidying
// their screen, by a phone being reset, or by a new handset arriving at
// Christmas. Nothing tells anybody. The parent side carries on looking healthy
// while the jobs, the earned minutes and the printables all quietly stop.
//
// Home already reads kid_links.last_seen_at, and it reads it as a BOOLEAN:
// `.some(k => !!k.last_seen_at)`, true once the child has ever opened their
// app. Once true it is true for ever. A family whose app was opened in March
// and deleted in April looks identical to one using it this morning, which is
// exactly the case Justin hit.
//
// The timestamp has been there the whole time. This reads it.

export type LinkHealth =
  /** No link, or a link that has never once been opened. Setup, not loss. */
  | 'never'
  /** Seen recently. Nothing to say. */
  | 'live'
  /** A quiet stretch. Could be a holiday, a busy fortnight, or nothing at all. */
  | 'quiet'
  /** Long enough that the likeliest explanation is the app is not there any more. */
  | 'gone'

const DAY = 86400000

/**
 * A fortnight before anything is said, and a month before we call it gone.
 *
 * These are deliberately slow. The cost of crying wolf here is high: a card
 * telling a parent their child has deleted the app, during a half term when the
 * child simply had nothing to tick, is the app inventing a problem in a family
 * that does not have one. A real deletion is not urgent to the hour, so the
 * threshold can afford to be generous and be right.
 */
const QUIET_DAYS = 14
const GONE_DAYS = 30

export function linkHealth(lastSeenAt: string | null | undefined, now: number = Date.now()): LinkHealth {
  if (!lastSeenAt) return 'never'
  const seen = Date.parse(lastSeenAt)
  if (!Number.isFinite(seen)) return 'never'
  // A clock skewed into the future is not evidence of anything. Treat it as
  // just seen rather than as a negative age that would read as gone.
  const days = Math.max(0, (now - seen) / DAY)
  if (days < QUIET_DAYS) return 'live'
  if (days < GONE_DAYS) return 'quiet'
  return 'gone'
}

/** Whole days since the app was last opened, for saying it in the parent's words. */
export function daysSinceSeen(lastSeenAt: string | null | undefined, now: number = Date.now()): number | null {
  if (!lastSeenAt) return null
  const seen = Date.parse(lastSeenAt)
  if (!Number.isFinite(seen)) return null
  return Math.max(0, Math.floor((now - seen) / DAY))
}

/**
 * What to say about it, or null when the honest answer is nothing.
 *
 * NEVER AN ACCUSATION. "They have deleted it" is a guess, and a guess about a
 * child, put to a parent, is the same mistake the recommender made with its
 * heaviest scripts. The line says what we can actually see, which is that the
 * app has not been opened, offers the likeliest reason, and hands over the fix.
 */
export function linkHealthLine(
  health: LinkHealth,
  childName: string | null | undefined,
  days: number | null,
): { title: string; body: string } | null {
  if (health !== 'gone') return null
  const who = childName && childName !== 'Your child' ? childName : 'Your child'
  const weeks = days != null ? Math.floor(days / 7) : null
  const howLong = weeks != null && weeks >= 4 ? `${weeks} weeks` : 'a month'
  return {
    title: `${who}'s app has been quiet for ${howLong}`,
    body: `Nothing has been ticked or opened on their side since then. Most often the page has come off their home screen, which happens with a tidy up or a new phone and takes thirty seconds to put back. Send the link again and it lands where it was.`,
  }
}
