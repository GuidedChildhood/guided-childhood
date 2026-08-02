import { createBrowserClient } from '@supabase/ssr'

// The placeholders exist so `next build` can run without secrets, and they have
// to stay. What they must not do is fail silently at RUN time.
//
// NEXT_PUBLIC_ values are baked in at build time, so a deployment built without
// them carries `placeholder.supabase.co` for ever. Every call then fails to
// resolve, and the login form used to read that as a wrong password and tell a
// parent "Email or password not recognised". The credentials were fine. The app
// was pointed at a domain that does not exist.
//
// Justin hit this on a preview deployment on 2 August, where the Supabase
// variables were set for Production only. It is the same shape as the rest of
// this week's faults: a real failure reported as a confident wrong answer, and
// this one blames the person typing.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'build-placeholder'

/**
 * Is this build actually wired to a database, or is it running on the build
 * time placeholders?
 *
 * Anything that tells a user why something failed should ask this first, so the
 * answer can be "this deployment is not configured" rather than a guess about
 * what they typed.
 */
export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL !== 'https://placeholder.supabase.co' && SUPABASE_ANON_KEY !== 'build-placeholder'
}

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
