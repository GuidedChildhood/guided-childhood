// THE PARENT SHARE LINK, SHARED BY BOTH APPS (5 November 2026).
//
// Justin: schools share every lesson with parents, and a parent sees the
// whole of it by signing up free, "a secret way to get users".
//
// The schools app mints the link on a lesson page for a school whose code
// opens that lesson. The parents app opens it at /from-school/<module>/<token>:
// a short teaser to anybody, the full lesson to anybody signed in. One file
// holds the shape so the two ends can never disagree about it.
//
//   https://www.guidedchildhood.com/from-school/ks2-06-how-algorithms-work/1a2b3c4d.0f1e2d3c4b5a6978
//                                               module                     ref      sig
//
// THE REF IS A PSEUDONYM OF THE SCHOOL'S ACCESS CODE, NEVER THE CODE. The code
// is the password to the licence, and a link that goes home in two hundred
// book bags is public the moment it is printed. The ref is the first eight hex
// characters of an HMAC of the code under the share secret: the same school
// always gets the same ref, nobody can work back from it to the code, and the
// founder can work forwards (scripts/school-share-ref.mjs <code>) to put a
// school's name on a row in the admin page.
//
// THE SIG IS WHAT KEEPS THE LICENCE A LICENCE. Without it a parent could edit
// the module in the address bar and open every lesson in the scheme for the
// price of a free account. With it, the parents app opens only a pairing of
// lesson and school that the schools app signed, and the schools app signs
// only lessons the school's own code opens (licence: all, pilot: its two).
// Sixteen hex characters, 64 bits: a forger gains a teaser and a lesson a
// school could have sent them anyway, so this is a fence, not a vault.
//
// Both apps read the secret from PARENT_SHARE_SECRET. Unset on either side
// fails CLOSED: the schools app shows no link and the parents app opens none.
// Changing the secret retires every link already printed, which is the lever
// if one ever needs pulling.
//
// No imports on purpose, Web Crypto only: it runs in either app's server, the
// edge, and under plain node for the tests.

export const PARENT_SHARE_PATH = '/from-school'

const MODULE_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const REF_RE = /^[0-9a-f]{8}$/
const SIG_RE = /^[0-9a-f]{16}$/

const enc = new TextEncoder()

async function hmacHex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('')
}

/** Constant time compare, so a guess does not learn how much of it was right. */
function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** A module id as the schools table stores it, or null. */
export function cleanModuleId(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null
  const id = raw.trim().toLowerCase()
  return id.length >= 3 && id.length <= 80 && MODULE_RE.test(id) ? id : null
}

/** A school's public ref, from its access code. Null without a secret or a code. */
export async function schoolShareRef(accessCode: string, secret: string): Promise<string | null> {
  const code = accessCode.trim().toLowerCase()
  if (!code || !secret) return null
  return (await hmacHex(secret, `school:${code}`)).slice(0, 8)
}

/** The token for one lesson from one school: `<ref>.<sig>`. */
export async function signParentShare(moduleId: string, ref: string, secret: string): Promise<string | null> {
  const id = cleanModuleId(moduleId)
  if (!id || !REF_RE.test(ref) || !secret) return null
  const sig = (await hmacHex(secret, `share:${id}:${ref}`)).slice(0, 16)
  return `${ref}.${sig}`
}

/** The path a parent opens, without the host. */
export function parentSharePath(moduleId: string, token: string): string {
  return `${PARENT_SHARE_PATH}/${moduleId}/${token}`
}

export type ParentShare = { moduleId: string; ref: string; token: string }

/**
 * What a link opens, or null when it is malformed, badly signed, or the secret
 * is missing. Exact or nothing: a link that was edited learns only that it
 * does not open.
 */
export async function readParentShare(moduleId: string, token: string, secret: string): Promise<ParentShare | null> {
  const id = cleanModuleId(moduleId)
  if (!id || !secret || typeof token !== 'string') return null
  const [ref, sig, ...rest] = token.trim().toLowerCase().split('.')
  if (rest.length || !REF_RE.test(ref ?? '') || !SIG_RE.test(sig ?? '')) return null
  const expected = await signParentShare(id, ref, secret)
  return expected && same(expected, `${ref}.${sig}`) ? { moduleId: id, ref, token: expected } : null
}

/** The cookie the start route sets and the trial grant reads: `<module>:<ref>.<sig>`. */
export const SCHOOL_SHARE_COOKIE = 'gc_school_share'
/** A note read on a Friday and an account made a few weeks later. */
export const SCHOOL_SHARE_COOKIE_SECONDS = 60 * 24 * 60 * 60

/** The cookie value for a verified share. */
export function shareCookieValue(moduleId: string, token: string): string {
  return `${moduleId}:${token}`
}

/** A cookie value read back, verified again rather than trusted. */
export async function readShareCookie(value: string | null | undefined, secret: string): Promise<ParentShare | null> {
  if (typeof value !== 'string') return null
  const at = value.indexOf(':')
  if (at < 1) return null
  return readParentShare(value.slice(0, at), value.slice(at + 1), secret)
}
