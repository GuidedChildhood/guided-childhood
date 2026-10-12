// The video link (migration 372): /v/<code> in a film's caption or bio tells
// us which film sent a family. Attribution only; the offer is the ordinary one.
// Codes follow the school link's rules, so the same normaliser checks both.
//
// Pure, so it can be imported anywhere without a database.

import { normaliseLinkCode } from '@/lib/school/link'

export { normaliseLinkCode }

/** The cookie the link sets, read by the start counter and the trial grant. */
export const VIDEO_LINK_COOKIE = 'gc_video'

/** Set once the stage check start is counted, so a reload is not a second start. */
export const VIDEO_STARTED_COOKIE = 'gc_video_started'

/** A film is watched and acted on within days, not the school newsletter's weeks. */
export const VIDEO_LINK_MAX_AGE_SECONDS = 30 * 24 * 60 * 60

/** A code made from a film's title: "Short 2: the first phone" becomes short-2-the-first-phone. */
export function codeFromTitle(title: string): string | null {
  const slug = title
    .toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/g, '')
  return normaliseLinkCode(slug)
}
