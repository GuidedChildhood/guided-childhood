// WHERE A PARENT GOES AFTER SIGNING UP OR SIGNING IN, CHECKED ONCE.
//
// Justin, 5 November 2026: the emails link to the child's app and the family
// agreement, and a signed out parent tapping either met the login page with
// no way to make an account that brought them back. The public pages now send
// them to the starter pack with ?next=, and the starter pack, the login form
// and /auth/callback all honour it.
//
// A destination that arrives in a URL is a value somebody else can write, so
// all three read it through here. Only a path on this site comes back:
//
//   /dashboard/agreement            yes
//   /from-school/ks2-06/1a2b.3c     yes, query and hash kept
//   //evil.example, /\evil, @evil   no: each one leaves the site once it is
//                                   glued onto an origin or handed to a router
//   https://anything                no
//
// /auth/callback used to build `${origin}${next}` from the raw parameter, and
// next=@evil.example makes that https://www.guidedchildhood.com@evil.example,
// which is a different host. That is the bug this closes on the way past.
//
// Pure, no imports, so the tests run it under plain node.

const MAX = 512

/** A same site path, or null when the value is anything else. */
export function safeNext(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const value = raw.trim()
  if (!value || value.length > MAX) return null
  if (!value.startsWith('/') || value.startsWith('//')) return null
  // Backslashes are read as slashes by browsers, so /\host is //host.
  if (value.includes('\\')) return null
  // Control characters and spaces: a tab or newline inside a URL is stripped
  // by the parser and can stitch a // back together.
  if (/[\u0000-\u001f\u007f\s]/.test(value)) return null
  let url: URL
  try { url = new URL(value, 'https://same.invalid') } catch { return null }
  if (url.origin !== 'https://same.invalid') return null
  return `${url.pathname}${url.search}${url.hash}`
}

/**
 * The places the starter pack will send a brand new account instead of the
 * Setup Quest. Narrower than safeNext on purpose: a link anybody can write
 * should not be able to aim a fresh account at an API route.
 */
const STARTER_PREFIXES = ['/dashboard', '/from-school/', '/home-code/']

export function safeStarterNext(raw: unknown): string | null {
  const next = safeNext(raw)
  if (!next) return null
  const path = next.split(/[?#]/)[0]
  return STARTER_PREFIXES.some(p => path === p || path.startsWith(p.endsWith('/') ? p : `${p}/`)) ? next : null
}

/** localStorage key that carries ?next= through Google, Apple and a reload. */
export const STARTER_NEXT_KEY = 'gc_starter_next'
/** A next older than this is from another visit and is dropped. */
export const STARTER_NEXT_MAX_AGE_MS = 24 * 60 * 60 * 1000

/** What the starter pack stores. */
export function packStarterNext(next: string, now = Date.now()): string {
  return JSON.stringify({ next, at: now })
}

/** What the starter pack reads back, rechecked, or null when stale or bad. */
export function unpackStarterNext(stored: string | null | undefined, now = Date.now()): string | null {
  if (!stored) return null
  try {
    const { next, at } = JSON.parse(stored) as { next?: unknown; at?: unknown }
    if (typeof at !== 'number' || now - at > STARTER_NEXT_MAX_AGE_MS || at > now + 60_000) return null
    return safeStarterNext(next)
  } catch { return null }
}
