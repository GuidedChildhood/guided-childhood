// ── THE PARENT LINK ON THE CHILD'S HOME ─────────────────────────────────────
//
// Justin, 13 October 2026: "the most useful parent linked app ... super easy to
// follow through." A child ticks a job and then, until now, heard nothing until
// the grown up happened to answer while the app was open. Two things close that:
//
// 1. THE WAITING LINE. One line under the day, "2 waiting for Mum or Dad to say
//    yes", naming what is waiting. The child knows the tick landed and who it is
//    with, so a job does not get ticked twice or forgotten.
//
// 2. SINCE YOU LAST LOOKED. Pushes to children are held from 19:00 to 07:00, so
//    a yes given in the evening is never seen that day. The next time the child
//    opens the app, a card says what the grown up said yes to while they were
//    away, with the stars it earned. A yes seen live (the HappyNews pop) is not
//    shown again.
//
// The grown up is named by what the child calls them. Justin chose that on
// 13 October 2026 "if it is set on the account". It is not set anywhere yet
// (profiles holds only full_name, and a child does not call their dad Justin),
// so Settings now asks "What does Teo call you?" (migration 376,
// components/settings/CallsYouField.tsx) and the child's page passes it here.
// Until a parent answers, every family reads "Mum or Dad".

export function grownUpWord(label?: string | null): string {
  const t = (label ?? '').trim()
  return t.length > 0 ? t : 'Mum or Dad'
}

/** One yes the child has not seen yet. */
export type SinceItem = {
  /** Unique across kinds: `tick:<id>` or `idea:<id>`. */
  key: string
  kind: 'job' | 'idea'
  title: string
  emoji: string | null
  /** Stars it earned. 0 for a family job (thanked, never priced) or an idea. */
  stars: number
  familyJob: boolean
  /** ISO time the grown up said yes. */
  at: string
}

/** How far back a yes still counts as news. Two days covers a weekend away. */
export const SINCE_WINDOW_MS = 48 * 3600 * 1000

/**
 * The yeses a child has not seen, newest first. `seenAt` is the later of the
 * link's last activity and the moment this device last dismissed the card or
 * celebrated a yes live. Anything at or before it is old news.
 */
export function sinceYouLooked(items: SinceItem[], seenAt: string | null, now: number): SinceItem[] {
  const floor = Math.max(seenAt ? Date.parse(seenAt) || 0 : 0, now - SINCE_WINDOW_MS)
  return items
    .filter(i => {
      const t = Date.parse(i.at)
      return Number.isFinite(t) && t > floor && t <= now + 60_000
    })
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
}

/** The later of two ISO times, either of which may be missing. */
export function laterOf(a: string | null | undefined, b: string | null | undefined): string | null {
  const ta = a ? Date.parse(a) : NaN
  const tb = b ? Date.parse(b) : NaN
  if (!Number.isFinite(ta)) return Number.isFinite(tb) ? (b as string) : null
  if (!Number.isFinite(tb)) return a as string
  return ta >= tb ? (a as string) : (b as string)
}

/** The device's own "seen up to" mark. Read and written in try blocks: a
 *  private window or blocked storage must never break the home. */
export const SINCE_SEEN_KEY = 'gc_kid_since_seen_at'
