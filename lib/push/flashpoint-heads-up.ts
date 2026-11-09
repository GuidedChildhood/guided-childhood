import { FAMILY_FLASHPOINTS, headsUpLine, type Flashpoint } from '@/lib/content/family-flashpoints'
import { concernMeansFlashpoint } from '@/lib/content/family-flashpoints-match'

// THE HEADS UP: the push that arrives just before a row this family has told
// us is theirs, instead of the usual rotation line, in the same window.
//
// Justin, 9 November 2026: "letting parents know these things happen and we
// are here to pre empt and assist." So a family who has said "the room is a
// Monday morning row in our house" gets, on Monday in their before school
// window, the line that heads it off, and not a general tip.
//
// No new push. It takes the place of the window line on the days the
// flashpoint happens (at most two a week each, held by the guard), so the
// family still gets one push per window and no more. On a non school day the
// window is normally quiet; a weekend flashpoint the family has claimed (the
// Sunday homework panic, a Saturday party) is the one thing that speaks then.
//
// Pure, so the cron and the guard (scripts/check-family-flashpoints.mjs) read
// the same rule.

export type ClaimedConcern = { slug: string; label: string | null; child_id: string | null }

/** UK day of week, 0 Sunday, from the day number (day 0 was a Thursday). */
export function dayOfWeek(ukDay: number): number {
  return (((4 + ukDay) % 7) + 7) % 7
}

/** The flashpoints this family has said are theirs, with the child each is for. */
export function claimedFlashpoints(concerns: ClaimedConcern[]): { flashpoint: Flashpoint; childId: string | null }[] {
  const out: { flashpoint: Flashpoint; childId: string | null }[] = []
  for (const f of FAMILY_FLASHPOINTS) {
    const c = concerns.find(row => concernMeansFlashpoint(f, row))
    if (c) out.push({ flashpoint: f, childId: c.child_id })
  }
  return out
}

/**
 * The heads up for this window today, or null to keep the usual line.
 * When two claimed rows fall on the same window and day, the week decides,
 * so a family with both hears each in turn rather than the same one always.
 */
export function pickHeadsUp(
  window: 'morning' | 'home',
  ukDay: number,
  schoolDay: boolean,
  claimed: { flashpoint: Flashpoint; childId: string | null }[],
): { flashpoint: Flashpoint; childId: string | null } | null {
  const dow = dayOfWeek(ukDay)
  const due = claimed.filter(({ flashpoint: f }) =>
    f.headsUp.window === window && f.headsUp.days.includes(dow) && (schoolDay || !f.headsUp.schoolDaysOnly))
  if (due.length === 0) return null
  const week = Math.floor(ukDay / 7)
  return due[((week % due.length) + due.length) % due.length]
}

/** The push itself: the row's words for this child, opening its plan. */
export function headsUpPush(f: Flashpoint, childName: string | null, childId: string | null): { title: string; body: string; url: string } {
  const line = headsUpLine(f, childName)
  const q = childId ? `?child=${encodeURIComponent(childId)}` : ''
  return { ...line, url: `/dashboard/flashpoints${q}#${f.key}` }
}
