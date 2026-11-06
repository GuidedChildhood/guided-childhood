// WHERE THE STARTER PACK SENDS A NEW ACCOUNT (5 November 2026).
//
// The Setup Quest by default, as it always was. A page that sent the parent
// here with ?next= (the child's app page, the agreement page, a lesson a
// school shared) gets them back instead, because that is what they came for.
//
// Kept in localStorage rather than state, because a parent who signs up with
// Google or Apple leaves this page and comes back with no React state at all
// (?finish=1), and one who reloads mid quiz should not lose it either. Read
// and written through lib/auth/safe-next.ts, so only a path on this site, under
// the prefixes it names, can ever come back out. Browser only.

import { packStarterNext, safeStarterNext, STARTER_NEXT_KEY, unpackStarterNext } from '@/lib/auth/safe-next'

export const SETUP_HREF = '/dashboard/setup'

/**
 * Called once when the starter pack opens. A valid ?next= is kept; a visit
 * with none clears an old one, so last week's lesson link cannot steer
 * today's sign up. The return from a provider (?finish=1) leaves it alone,
 * since that visit is the same sign up coming back.
 */
export function rememberStarterNext(): void {
  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get('finish') === '1') return
    const next = safeStarterNext(params.get('next'))
    if (next) localStorage.setItem(STARTER_NEXT_KEY, packStarterNext(next))
    else localStorage.removeItem(STARTER_NEXT_KEY)
  } catch { /* private mode: the Setup Quest is the answer */ }
}

/** The kept destination, or null. */
export function starterNext(): string | null {
  try { return unpackStarterNext(localStorage.getItem(STARTER_NEXT_KEY)) } catch { return null }
}

/** Where a parent goes the moment their account exists. Spends the kept next. */
export function takeAfterSignupHref(): string {
  const next = starterNext()
  try { localStorage.removeItem(STARTER_NEXT_KEY) } catch { /* nothing to spend */ }
  return next ?? SETUP_HREF
}
