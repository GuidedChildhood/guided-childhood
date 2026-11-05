// THE SCHOOL PARENT SHARE, ON THE PARENTS SIDE (5 November 2026).
//
// The link's shape and its signature live in @gc/shared/parent-share, because
// the schools app mints it and this app opens it. This file is the parents
// app's half: the secret, and the parent note read without trusting its shape.
//
// What a share link opens, and to whom:
//
//   anybody          the title, what the class learned, the question to ask
//                    at home, and a free account door
//   any account      the whole parent note and the lesson in the together
//                    register, recording nothing (free accounts included,
//                    which is the point: Justin, "has to be done by parents
//                    signing up so a secret way to get users")
//   a bad link       nothing about any lesson, and the stage check
//
// And which school sent the family is written once, at the trial grant
// (app/api/trial/start), from the cookie the start route sets: migration 386.

export {
  PARENT_SHARE_PATH, SCHOOL_SHARE_COOKIE, SCHOOL_SHARE_COOKIE_SECONDS,
  readParentShare, readShareCookie, shareCookieValue, parentSharePath,
  type ParentShare,
} from '@gc/shared/parent-share'

/** The secret both apps sign with. Empty means no link opens, by design. */
export function shareSecret(): string {
  return process.env.PARENT_SHARE_SECRET || ''
}

export type ShareNote = {
  headline?: string
  taught?: string
  try_this?: string
  family_question?: string
  listen_for?: string
  then_ask?: string
  say_this?: string
  passport?: string
}

const KEYS: (keyof ShareNote)[] = ['headline', 'taught', 'try_this', 'family_question', 'listen_for', 'then_ask', 'say_this', 'passport']

/** The parent note as strings or nothing: a row with a field in another shape prints without it. */
export function asShareNote(raw: unknown): ShareNote {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const out: ShareNote = {}
  for (const k of KEYS) {
    const v = (raw as Record<string, unknown>)[k]
    if (typeof v === 'string' && v.trim()) out[k] = v.trim()
  }
  return out
}

/**
 * The teaser: what anybody with the link is shown. Exactly three things, so a
 * test can hold the line between free to read and behind the account.
 */
export function shareTeaser(row: { title: string; year_band: string | null; single_action_outcome: string | null; parent_note: unknown }) {
  const note = asShareNote(row.parent_note)
  return {
    title: row.title,
    yearBand: row.year_band,
    learned: note.taught ?? row.single_action_outcome ?? null,
    askAtHome: note.family_question ?? null,
  }
}

/** Everything behind the account, beyond the teaser. */
export function shareFull(row: { parent_note: unknown }) {
  const note = asShareNote(row.parent_note)
  return {
    tryThis: note.try_this ?? null,
    listenFor: note.listen_for ?? null,
    thenAsk: note.then_ask ?? null,
    sayThis: note.say_this ?? null,
    passport: note.passport ?? null,
  }
}
