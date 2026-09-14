import type { SupabaseClient } from '@supabase/supabase-js'

// WHO IS SIGNED IN, VERIFIED, WITHOUT A ROUND TRIP TO THE AUTH SERVER.
//
// Justin, 13 September 2026, on the review recommendation: yes, as its own
// small PR. Every tap on the dashboard was paying for two trips to Supabase
// Auth before a page could even start: getUser() in the middleware, then
// getUser() again in the dashboard layout, each one a network call to
// /auth/v1/user to ask "is this token still good". Between them, the profile
// read and the page's own queries, a navigation was five hops before the
// first byte.
//
// getClaims() answers the same question by checking the token's signature
// against the project's public signing keys, which the client fetches once and
// caches. On a project using asymmetric signing keys (ECC or RSA, the JWT
// Signing Keys page in the Supabase dashboard) that is a local check and no
// network at all. On a project still on the legacy shared secret it falls back
// to the same server call getUser() made, so this is never less safe than what
// it replaces, only faster once the keys are switched on. Either way the
// claims come back verified: an expired token, a bad signature or no session
// all answer null here, exactly as a missing user did before.
//
// Two callers, the two that run on every navigation: middleware.ts and the
// dashboard layout. The two hundred other getUser() calls in route handlers
// run once per action, not per tap, and stay as they are.

export type SessionUser = { id: string; email: string | null }

/**
 * The signed in parent, from a verified token, or null.
 *
 * `id` is the auth user id (the `sub` claim), the same value getUser() gave as
 * `user.id`. `email` is the token's email claim, present for every password
 * and provider sign in we offer.
 */
export async function sessionUser(supabase: Pick<SupabaseClient, 'auth'>): Promise<SessionUser | null> {
  const { data, error } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (error || !claims || typeof claims.sub !== 'string' || claims.sub.length === 0) return null
  const email = typeof claims.email === 'string' && claims.email.length > 0 ? claims.email : null
  return { id: claims.sub, email }
}
