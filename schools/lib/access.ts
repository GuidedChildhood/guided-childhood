// THE SCHOOLS ACCESS GATE.
//
// Decision, 15 August 2026 (Justin): the lessons do not sit in the open. A
// school gets a code when its invoice is raised, and the code unlocks the
// teaching content. Only the two selling pages stay open to the world:
//
//   OPEN    /            /pricing
//   GATED   /curriculum  /hub/*  /teach/*  /class/*  /print/*
//
// This replaces the Oak style open catalogue we launched with on 14 August.
// The reasoning is in plans/decisions.md; the short version is that the
// catalogue was the product being given away, and the licence has to buy
// something.
//
// WHY A CODE AND NOT A LOGIN. A code is a door, not an identity. It needs no
// email, no name, no row in any table, and it therefore keeps the promise the
// split was built on: the schools app still holds no session, no user and no
// personal data of any kind. Real teacher accounts come next, in the
// staffroom, where they buy something a door cannot: a register, marking and
// a report. When they land, this gate stays as the outer door and nothing
// here has to be unpicked.
//
// HOW IT IS SIGNED. The cookie carries the code it was issued against and an
// expiry, signed with HMAC SHA-256 using Web Crypto so it runs unchanged in
// the edge proxy and in a server action. Verification re-checks the code
// against the CURRENT allow list, so pulling a code out of the env var locks
// that school out on the next request rather than whenever its cookie
// happens to lapse.

const COOKIE = 'gc_schools_access'
const TTL_DAYS = 180

/** Codes we currently honour. Config, never hardcoded: one per school, or a
 *  shared one for a pilot cohort. Comma separated, case insensitive. */
function allowedCodes(): string[] {
  return (process.env.SCHOOLS_ACCESS_CODES || '')
    .split(',')
    .map(c => c.trim().toLowerCase())
    .filter(Boolean)
}

function secret(): string {
  return process.env.SCHOOLS_ACCESS_SECRET || ''
}

/** Routes anyone may see. Everything else needs the cookie. Kept here rather
 *  than in the proxy so the copy checks and the tests can read the same list.
 *
 *  THE OPEN MAP, decided by Justin on 30 August 2026: the curriculum map and
 *  the RSHE mapping matrix are public, because a free progression is how a
 *  scheme becomes the standard everyone else aligns to (White Rose proved
 *  it), and neither page can be taught from. The paid wall stays exactly
 *  where it earns its keep: the lessons, the scripts, the packs and the
 *  testing. A visitor who reads the map and taps into a lesson meets
 *  /unlock, and /unlock points at /pricing, which is the funnel working as
 *  designed rather than a leak. */
/** /philosophy joined the open list on 31 August 2026: the evidence spine
 *  is the sales argument, and it cites public sources, so it sells best in
 *  the open. Still nothing teachable outside the code. */
export const OPEN_PATHS = ['/', '/pricing', '/draw', '/unlock', '/curriculum', '/hub/rshe-mapping', '/philosophy']

export function isOpenPath(pathname: string): boolean {
  if (OPEN_PATHS.includes(pathname)) return true
  // Next's own plumbing and the static files under /public must never be
  // gated or the gate page itself renders without styles.
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    /\.[a-z0-9]+$/i.test(pathname)
  )
}

const enc = new TextEncoder()

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  )
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return [...new Uint8Array(mac)].map(b => b.toString(16).padStart(2, '0')).join('')
}

/** Length independent, value independent compare. A plain === on a signature
 *  leaks how much of a guess was right through timing. */
function sameSignature(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** Mint a cookie value for a code that has already been checked. */
export async function issueToken(code: string): Promise<string> {
  const expires = Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000
  const payload = `${code.toLowerCase()}|${expires}`
  return `${payload}|${await sign(payload)}`
}

/** True only if the cookie is well formed, correctly signed, unexpired, and
 *  issued against a code we still honour. */
export async function tokenIsValid(token: string | undefined): Promise<boolean> {
  if (!token || !secret()) return false
  const parts = token.split('|')
  if (parts.length !== 3) return false
  const [code, expires, signature] = parts

  const expiry = Number(expires)
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false
  if (!allowedCodes().includes(code)) return false

  return sameSignature(await sign(`${code}|${expires}`), signature)
}

/** Check a code a teacher has just typed. Returns the normalised code so the
 *  caller signs exactly what we matched, spacing and capitals forgiven. */
export function matchCode(input: string): string | null {
  const tidy = input.trim().toLowerCase().replace(/\s+/g, '')
  const hit = allowedCodes().find(c => c.replace(/\s+/g, '') === tidy)
  return hit ?? null
}

export const ACCESS_COOKIE = COOKIE
export const ACCESS_MAX_AGE = TTL_DAYS * 24 * 60 * 60
