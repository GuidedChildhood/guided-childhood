// The video link (migration 372): /v/<code> in a film's caption or bio tells
// us which film sent a family. Attribution only; the offer is the ordinary one.
// Since migration 379 it is the source link for every channel, not only films.
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

// ── EVERY START, BY SOURCE (migration 379) ─────────────────────────────────
//
// The film link became the source link: a LinkedIn post, a group seed, a
// Facebook post, the printed Planet Post and the share action on the stage
// result each carry their own code, and every code belongs to a channel so the
// founder page can add up the week. A start with no link at all is counted
// too, against one of three rows that are never links themselves.

export const CHANNELS = [
  'film', 'linkedin', 'facebook', 'group', 'instagram', 'print',
  'share', 'referral', 'school', 'direct', 'other',
] as const
export type Channel = typeof CHANNELS[number]

/** The channels a founder can make a link for. referral, school and direct are counted without one. */
export const LINK_CHANNELS: Channel[] = ['film', 'linkedin', 'facebook', 'group', 'instagram', 'print', 'share', 'other']

/** What the founder page calls each channel. */
export const CHANNEL_LABEL: Record<Channel, string> = {
  film: 'Films',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  group: 'Parent groups',
  instagram: 'Instagram',
  print: 'Print and the newspaper',
  share: 'Shared from the stage result',
  referral: 'A member’s referral link',
  school: 'School newsletters',
  direct: 'No link',
  other: 'Other',
}

export function isChannel(raw: unknown): raw is Channel {
  return typeof raw === 'string' && (CHANNELS as readonly string[]).includes(raw)
}

/** The code the share action on the stage result carries for a visitor. */
export const SHARE_CODE = 'stage-share'

/** The rows a start is counted against when the visitor followed no source link. */
export const NO_LINK_CODES = { referral: 'referral', school: 'school', direct: 'direct' } as const

/**
 * Which code a stage check start counts against, from the cookies the visitor
 * holds. A source link wins; then a member's referral link; then a school
 * newsletter; otherwise no link at all. Null when this browser's start for
 * that code is already counted, so a reload is never a second start.
 */
export function startCode(cookies: { video?: string | null; started?: string | null; referral?: string | null; school?: string | null }): string | null {
  const code = normaliseLinkCode(cookies.video ?? null)
    ?? (cookies.referral ? NO_LINK_CODES.referral
      : cookies.school ? NO_LINK_CODES.school
      : NO_LINK_CODES.direct)
  return cookies.started === code ? null : code
}
