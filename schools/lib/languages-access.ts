// THE LANGUAGES DOOR.
//
// Decision, 9 October 2026 (Justin): French and Spanish live in this app under
// /languages, hidden from the site until they are finished, and opened by a
// licence code of their own. A languages code opens languages and nothing
// else; the online safety licence in lib/access.ts does not open languages.
// The two doors share nothing but the signing secret.
//
//   LANGUAGES_LIVE           off by default. While it is off, every
//                            /languages page is a 404 to anyone without a
//                            languages code, so a stranger cannot even tell
//                            the area exists. /languages/unlock is the one
//                            way in, unlinked and noindexed.
//   SCHOOLS_LANGUAGES_CODES  comma separated, each entry `code:es`,
//                            `code:fr` or `code:both`. A bare code means both.
//
// The cookie carries a `lang|` prefix and four parts, so a languages cookie
// can never verify as a scheme cookie (that one has three parts) and a scheme
// cookie can never verify here.
//
// No imports on purpose, the same as lib/access.ts: a guard script loads this
// file under plain node, which cannot resolve an extension free import. The
// HMAC helpers are therefore repeated here rather than shared.

export type Lang = 'es' | 'fr'
export const LANGS: Lang[] = ['es', 'fr']
export type LanguagesAccess = { langs: Lang[] }

const COOKIE = 'gc_languages_access'
const TTL_DAYS = 180

export function languagesLive(): boolean {
  return (process.env.LANGUAGES_LIVE || '').trim().toLowerCase() === 'true'
}

function languageCodes(): Map<string, Lang[]> {
  const out = new Map<string, Lang[]>()
  for (const entry of (process.env.SCHOOLS_LANGUAGES_CODES || '').split(',')) {
    const [rawCode, rawLang] = entry.split(':')
    const code = (rawCode ?? '').trim().toLowerCase()
    if (!code) continue
    const lang = (rawLang ?? '').trim().toLowerCase()
    out.set(code, lang === 'es' || lang === 'fr' ? [lang] : [...LANGS])
  }
  return out
}

function secret(): string {
  return process.env.SCHOOLS_ACCESS_SECRET || ''
}

const enc = new TextEncoder()

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  )
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('')
}

function sameSignature(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** Check a code a teacher has just typed. Returns the normalised code, or
 *  null when it is not a languages code. */
export function matchLanguagesCode(input: string): string | null {
  const tidy = input.trim().toLowerCase().replace(/\s+/g, '')
  return [...languageCodes().keys()].find(c => c.replace(/\s+/g, '') === tidy) ?? null
}

/** Mint a cookie value for a code that has already been checked. */
export async function issueLanguagesToken(code: string): Promise<string> {
  const expires = Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000
  const payload = `lang|${code.toLowerCase()}|${expires}`
  return `${payload}|${await sign(payload)}`
}

/** What the cookie opens, or null when it is malformed, badly signed,
 *  expired, or issued against a code no longer on the list. Re-checked
 *  against the CURRENT list, so pulling a code locks that school out on its
 *  next request. */
export async function languagesTokenAccess(token: string | undefined): Promise<LanguagesAccess | null> {
  if (!token || !secret()) return null
  const parts = token.split('|')
  if (parts.length !== 4 || parts[0] !== 'lang') return null
  const [, code, expires, signature] = parts
  const expiry = Number(expires)
  if (!Number.isFinite(expiry) || expiry < Date.now()) return null
  const langs = languageCodes().get(code)
  if (!langs) return null
  return sameSignature(await sign(`lang|${code}|${expires}`), signature) ? { langs } : null
}

export function isLanguagesPath(pathname: string): boolean {
  return pathname === '/languages' || pathname.startsWith('/languages/')
}

/** The door itself. Reachable without a code, or nobody could ever type one. */
export const LANGUAGES_DOOR = '/languages/unlock'

/** The language a path belongs to, if any: /languages/es/... is Spanish. */
export function langOfPath(pathname: string): Lang | null {
  const seg = pathname.split('/')[2]
  return seg === 'es' || seg === 'fr' ? seg : null
}

export const LANGUAGES_COOKIE = COOKIE
export const LANGUAGES_MAX_AGE = TTL_DAYS * 24 * 60 * 60
