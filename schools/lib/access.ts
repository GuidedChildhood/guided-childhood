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

// No imports on purpose: scripts/check-pilot-door.mjs and
// scripts/check-taster-wall.mjs load this file under plain node, which cannot
// resolve an extension free import. The phase primitives live here and
// lib/pilot.ts takes the type only, which strip types erases.
export type PilotPhase = 'primary' | 'secondary' | 'post16' | 'all_through'
export const PILOT_PHASES: PilotPhase[] = ['primary', 'secondary', 'post16', 'all_through']

/** The phase a bare pilot code means when the env entry names none. All
 *  through is the generous reading, and a code Justin typed in a hurry
 *  should open more rather than less. */
export const DEFAULT_PILOT_PHASE: PilotPhase = 'all_through'

export function isPilotPhase(v: string): v is PilotPhase {
  return (PILOT_PHASES as string[]).includes(v)
}

const COOKIE = 'gc_schools_access'
const TTL_DAYS = 180

/** Licence codes we currently honour. Config, never hardcoded: one per
 *  school. Comma separated, case insensitive. */
function allowedCodes(): string[] {
  return (process.env.SCHOOLS_ACCESS_CODES || '')
    .split(',')
    .map(c => c.trim().toLowerCase())
    .filter(Boolean)
}

// TWO KINDS OF CODE (14 September 2026). A licence code opens everything. A
// pilot code opens two lessons matched to the school's phase, plus the Hub
// (lib/pilot.ts holds the sets and the path rule). The pilot codes are their
// own env list, `SCHOOLS_PILOT_CODES`, each entry `code:phase`; a bare code
// means all through. The cookie format is unchanged: it carries the code, and
// the tier and the phase are looked up from the env on every request, so a
// school moving from pilot to licence is an env edit and a redeploy, and a
// pilot code pulled from the list stops on the school's next request.
export type AccessTier = 'licence' | 'pilot'
export type Access = { tier: 'licence' } | { tier: 'pilot'; phase: PilotPhase }

function pilotCodes(): Map<string, PilotPhase> {
  const out = new Map<string, PilotPhase>()
  for (const entry of (process.env.SCHOOLS_PILOT_CODES || '').split(',')) {
    const [rawCode, rawPhase] = entry.split(':')
    const code = (rawCode ?? '').trim().toLowerCase()
    if (!code) continue
    const phase = (rawPhase ?? '').trim().toLowerCase()
    out.set(code, isPilotPhase(phase) ? phase : DEFAULT_PILOT_PHASE)
  }
  return out
}

/** What a code opens, or null for a code we do not honour. A code on both
 *  lists is a licence: the wider door wins, because the only way that
 *  happens is a school upgrading before its pilot entry is removed. */
function accessFor(code: string): Access | null {
  if (allowedCodes().includes(code)) return { tier: 'licence' }
  const phase = pilotCodes().get(code)
  if (phase) return { tier: 'pilot', phase }
  return null
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
// '/hub/data-protection' is open on purpose, added 10 September 2026. It is a
// procurement document, not teaching content: what pupil data is processed,
// the lawful basis, retention, and consultation evidence for a DPIA. A school
// needs it to evaluate us, which happens before it buys, so putting it behind
// the licence made the reason to buy invisible until after buying. The same
// logic already applies to '/hub/rshe-mapping', the sheet an inspector reads.
// The staff briefings stay gated, because those are the product.
export const OPEN_PATHS = ['/', '/pricing', '/draw', '/unlock', '/curriculum', '/hub/rshe-mapping', '/hub/data-protection', '/philosophy', '/pilot', '/terms', '/privacy', '/dpa']

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

/** What the cookie opens: a licence, a pilot with its phase, or null when the
 *  cookie is malformed, badly signed, expired, or issued against a code we no
 *  longer honour. */
export async function tokenAccess(token: string | undefined): Promise<Access | null> {
  if (!token || !secret()) return null
  const parts = token.split('|')
  if (parts.length !== 3) return null
  const [code, expires, signature] = parts

  const expiry = Number(expires)
  if (!Number.isFinite(expiry) || expiry < Date.now()) return null
  const access = accessFor(code)
  if (!access) return null

  return sameSignature(await sign(`${code}|${expires}`), signature) ? access : null
}

/** True only if the cookie is well formed, correctly signed, unexpired, and
 *  issued against a code we still honour, licence or pilot. */
export async function tokenIsValid(token: string | undefined): Promise<boolean> {
  return (await tokenAccess(token)) !== null
}

/** Check a code a teacher has just typed, against both lists. Returns the
 *  normalised code so the caller signs exactly what we matched, spacing and
 *  capitals forgiven. */
export function matchCode(input: string): string | null {
  const tidy = input.trim().toLowerCase().replace(/\s+/g, '')
  const hit = [...allowedCodes(), ...pilotCodes().keys()].find(c => c.replace(/\s+/g, '') === tidy)
  return hit ?? null
}

export const ACCESS_COOKIE = COOKIE
export const ACCESS_MAX_AGE = TTL_DAYS * 24 * 60 * 60
