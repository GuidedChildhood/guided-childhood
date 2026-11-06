// UTM parameters, read safely (funnel audit, 6 November 2026, fixes 7 and 8).
//
// A post's link says which platform and which post sent the visitor:
//   utm_source    the platform: instagram, tiktok, youtube, facebook, linkedin
//   utm_medium    social
//   utm_campaign  the post slug, mmdd plus a few words: 1106-stage-check
//   utm_content   optional, which version of the post
//
// Both apps keep them with what the visitor goes on to do (the parent app on
// the source link counts and the profile, the schools app on the pilot
// request), so the cleaning lives here, once.
//
// THE RULE IS A SLUG, NOTHING ELSE. Small letters, numbers, single hyphens or
// underscores, at most 60 long. Anything else is dropped, not repaired, so an
// email address (it has an @), a long run of digits (a phone number) or a
// sentence typed into an address bar never reaches a database. These values
// are about the post, never about the person. The database checks the same
// pattern (migration 387), and scripts/check-stage-sources.mjs pins the two
// together.
//
// Pure, so both apps and the tests can import it.

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const
export type UtmKey = typeof UTM_KEYS[number]
export type Utm = Partial<Record<UtmKey, string>>

/** The pattern a kept value matches. Mirrored by the check in migration 387. */
export const UTM_VALUE_PATTERN = '^[a-z0-9]+([_-][a-z0-9]+)*$'
const VALUE = new RegExp(UTM_VALUE_PATTERN)
export const UTM_VALUE_MAX = 60

/** One value, cleaned: trimmed, lower case, spaces as hyphens. Null when it is not a slug. */
export function cleanUtmValue(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const v = raw.trim().toLowerCase().replace(/\s+/g, '-')
  if (!v || v.length > UTM_VALUE_MAX) return null
  if (!VALUE.test(v)) return null
  // A phone number or an account number is a long run of digits. A post slug
  // carries a date (four digits) or a week number, never seven in a row.
  if (/\d{7,}/.test(v)) return null
  return v
}

export type ParamSource = { get(name: string): unknown } | Record<string, unknown> | null | undefined

/** One parameter from a query string, a form or a plain object. */
export function getParam(from: ParamSource, key: string): unknown {
  if (!from) return null
  if (typeof (from as { get?: unknown }).get === 'function') return (from as { get(name: string): unknown }).get(key)
  return (from as Record<string, unknown>)[key]
}

/** The UTMs worth keeping from a query string, a form or a parsed body. Empty when none are. */
export function readUtm(from: ParamSource): Utm {
  const out: Utm = {}
  for (const key of UTM_KEYS) {
    const v = cleanUtmValue(getParam(from, key))
    if (v) out[key] = v
  }
  return out
}

export function hasUtm(utm: Utm | null | undefined): boolean {
  return Boolean(utm && UTM_KEYS.some(k => utm[k]))
}

/** The UTMs as a query string, in a fixed order, for a redirect or a cookie. Empty string when none. */
export function utmQuery(utm: Utm | null | undefined): string {
  if (!utm) return ''
  const p = new URLSearchParams()
  for (const key of UTM_KEYS) if (utm[key]) p.set(key, utm[key] as string)
  return p.toString()
}

/** The platforms a social post comes from, by the names people actually put in utm_source. */
const SOCIAL = new Set([
  'instagram', 'ig', 'tiktok', 'tt', 'youtube', 'yt', 'facebook', 'fb', 'linkedin', 'li',
  'threads', 'x', 'twitter', 'pinterest', 'snapchat', 'whatsapp', 'reddit', 'bluesky', 'social',
])

/** True when utm_source names a social platform. */
export function isSocialSource(raw: unknown): boolean {
  const v = cleanUtmValue(raw)
  return Boolean(v && SOCIAL.has(v))
}
