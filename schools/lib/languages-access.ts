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

// PRIVATE UNTIL JUSTIN OPENS IT (25 November 2026). Justin: "make the
// languages pages only available to my log in". With this off (the default)
// the only way into /languages is a languages code from SCHOOLS_LANGUAGES_CODES,
// which is his alone. A school's scheme code no longer opens French, the free
// taster lesson is shut, the hub and nav do not link to it, and the pricing
// page stops promising French, because a licence must not sell what nobody can
// open. LANGUAGES_OPEN_TO_SCHOOLS=true puts back how it was on 15 November.
export function languagesOpenToSchools(): boolean {
  return (process.env.LANGUAGES_OPEN_TO_SCHOOLS || '').trim().toLowerCase() === 'true'
}

// A CODE AS A PERSON MEANS IT (10 November 2026). Justin saved a code in
// Vercel and the door refused it for an hour, because a code is typed by
// hand twice, once into a settings box and once at the door, and the two
// did not agree to the character. None of the differences that creep in
// carry any meaning, so none of them should decide whether a school gets
// in: capitals, spaces, quote marks around the value, and the long dashes a
// phone swaps in for a hyphen all fold away here, on both sides.
function plainCode(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/["'\u2018\u2019\u201c\u201d`]/g, '')
    .replace(/\s+/g, '')
}

function languageCodes(): Map<string, Lang[]> {
  const out = new Map<string, Lang[]>()
  for (const entry of (process.env.SCHOOLS_LANGUAGES_CODES || '').split(',')) {
    const [rawCode, rawLang] = entry.split(':')
    const code = plainCode(rawCode ?? '')
    if (!code) continue
    const lang = plainCode(rawLang ?? '')
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

/** True when this deployment has at least one languages code. The door uses
 *  it to tell "that code is wrong" from "no code has reached this site yet",
 *  which look identical from the outside and have different fixes: the first
 *  is a typing mistake, the second is an env var saved without a redeploy. */
export function languagesCodesConfigured(): boolean {
  return languageCodes().size > 0
}

/** Check a code a teacher has just typed. Returns the normalised code, or
 *  null when it is not a languages code. */
export function matchLanguagesCode(input: string): string | null {
  // The ending that says which language (:fr) belongs in the settings box,
  // not at the door, but a person who was shown "code:fr" will type it.
  const tidy = plainCode(input).replace(/:(fr|es|both)$/, '')
  return [...languageCodes().keys()].find(c => c === tidy) ?? null
}

// FRENCH IS IN EVERY SCHOOL'S LICENCE (Justin, 15 November 2026: "all schools
// get french"). A school with a digital scheme code no longer needs a second
// code. The proxy mints a languages cookie from the scheme cookie the first
// time that school opens a languages page, against a code written as
// scheme~<their code>. It opens French only (Spanish is still by its own
// code), it is checked against the CURRENT scheme list on every request, so
// pulling a school's scheme code closes French too, and because the code is
// part of the cookie the school's French record stays its own.
const SCHEME_PREFIX = 'scheme~'

/** Is this still a scheme code, licence or pilot? Read from the same two env
 *  lists lib/access.ts reads. Repeated here in six lines, not imported: this
 *  file is loaded as it stands by scripts/check-languages-door.mjs, which
 *  cannot resolve an extension free import. */
function schemeCodeLive(code: string): boolean {
  const tidy = (c: string) => c.trim().toLowerCase().replace(/\s+/g, '')
  const licence = (process.env.SCHOOLS_ACCESS_CODES || '').split(',').map(tidy)
  const pilot = (process.env.SCHOOLS_PILOT_CODES || '').split(',').map(e => tidy(e.split(':')[0] ?? ''))
  const want = tidy(code)
  return want.length > 0 && [...licence, ...pilot].includes(want)
}

/** Mint the French cookie for a school that holds a valid scheme code. */
export async function issueSchemeLanguagesToken(schemeCode: string): Promise<string> {
  return issueLanguagesToken(`${SCHEME_PREFIX}${schemeCode.trim().toLowerCase()}`)
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
  const langs = code.startsWith(SCHEME_PREFIX)
    ? (schemeCodeLive(code.slice(SCHEME_PREFIX.length)) ? (['fr'] as Lang[]) : undefined)
    : languageCodes().get(code)
  if (!langs) return null
  return sameSignature(await sign(`lang|${code}|${expires}`), signature) ? { langs } : null
}

export function isLanguagesPath(pathname: string): boolean {
  return pathname === '/languages' || pathname.startsWith('/languages/')
}

// THE FREE FRENCH TASTER (Justin, 15 November 2026: yes to one French lesson
// anyone can open without a code). One lesson and its slides, and nothing
// else: its unit, the print room and every other lesson still need a code.
// The same idea as the digital sample lesson: a head sees the quality before
// asking for anything. Named here, in the import free file, so the proxy and
// the guard read one list.
export const FRENCH_TASTER = { unit: 'y3-ht2', lesson: 1 } as const
export const FRENCH_TASTER_PATH = `/languages/fr/${FRENCH_TASTER.unit}/${FRENCH_TASTER.lesson}`

/** The taster lesson page and its teach screen. Exact paths, never a prefix. */
export function isFrenchTasterPath(pathname: string): boolean {
  const clean = pathname.replace(/\/$/, '')
  return clean === FRENCH_TASTER_PATH || clean === `${FRENCH_TASTER_PATH}/teach`
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
