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
// That first pass took the middleware and the dashboard layout and missed the
// third caller on every tap: THE PAGE ITSELF. Sixty seven dashboard pages each
// opened with getUser(), so a navigation still waited on one auth round trip
// (about 130ms, measured in digi_latency.auth_ms) before its own queries could
// start. Justin, 24 September 2026: "DiGi and navigating is still slow." Every
// dashboard page and the DiGi route now ask here instead, and
// scripts/check-page-auth.mjs keeps it that way. Route handlers behind a button
// press run once per action, not per tap, and stay on getUser().

export type SessionUser = {
  id: string
  email: string | null
  /**
   * What the parent typed at signup (full_name, name). Supabase puts it in
   * the token as the user_metadata claim, so it costs nothing to carry. Home
   * uses it for the greeting when the profile has no name yet.
   */
  user_metadata: Record<string, unknown>
}

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
  const meta = (claims as { user_metadata?: unknown }).user_metadata
  const user_metadata = meta && typeof meta === 'object' ? (meta as Record<string, unknown>) : {}
  return { id: claims.sub, email, user_metadata }
}
