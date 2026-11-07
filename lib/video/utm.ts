// UTMs on the parent app's source links (funnel audit, 6 November 2026).
//
// Until now /v/<code> dropped the query string on its redirect and nothing read
// utm_*, so a post's UTMs reached nobody: PostHog never saw them after a /v/
// link, and the sign-up kept only the src code. Now:
//
//   /v/<code>?utm_...      counts the follow with its UTMs, remembers them in a
//                          cookie, and keeps them on the redirect so PostHog's
//                          $pageview sees them
//   /starter-pack?utm_...  the stage check posts them to /api/video-link/follow,
//                          which does the same
//   the start counter      writes them on the started row
//   the trial grant        writes them on the profile, beside video_link
//
// The values are cleaned by shared/utm.ts: slugs about the post, never anything
// about the person.
//
// Pure, so the guard and the tests import it without a database.

import { readUtm, utmQuery, isSocialSource, type Utm, UTM_KEYS } from '@gc/shared/utm'
import { normaliseLinkCode } from '@/lib/school/link'

export { readUtm, utmQuery, isSocialSource, UTM_KEYS }
export type { Utm }

/** The cookie the UTMs ride in between the follow and the trial grant. */
export const UTM_COOKIE = 'gc_utm'

/**
 * The marker /v/<code> puts on its redirect: this visit has been counted
 * already, so the stage check must not post it again, and it came from a link
 * that promised the stage check, so it opens on question one.
 */
export const VIA_PARAM = 'via'
export const VIA_LINK = 'v'

/** The cookie's value. Empty string when there is nothing to keep. */
export function utmCookieValue(utm: Utm | null | undefined): string {
  return utmQuery(utm)
}

/** The UTMs a cookie holds, cleaned again: a cookie is the visitor's to edit. */
export function utmFromCookie(raw: string | null | undefined): Utm {
  if (!raw) return {}
  try { return readUtm(new URLSearchParams(raw)) } catch { return {} }
}

/** The utm_* columns for an insert or an update, only those that are set. */
export function utmColumns(utm: Utm | null | undefined): Utm {
  const out: Utm = {}
  if (!utm) return out
  for (const k of UTM_KEYS) if (utm[k]) out[k] = utm[k]
  return out
}

/**
 * Whether the stage check opens on question one rather than the intro.
 *
 * A parent who tapped "Free stage check" on a post has already been made the
 * promise; the intro saying it again is one more screen between them and the
 * thing they came for (funnel audit, fix 4). So a visit through a source link
 * (/v/<code> or ?src=<code>) or with a social utm_source starts on question
 * one. Everyone else, the home page and a typed address, still meets the intro.
 */
export function opensOnQuestionOne(params: { get(name: string): string | null }): boolean {
  if (params.get(VIA_PARAM) === VIA_LINK) return true
  if (normaliseLinkCode(params.get('src'))) return true
  return isSocialSource(params.get('utm_source'))
}
