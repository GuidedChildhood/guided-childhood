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

// ── WHEN THE BROWSER NEVER GOT AN ANSWER ────────────────────────────────────
//
// Justin, 10 September 2026, with a screenshot of the starter pack signup:
// "cant log in". Under the password box, in our own amber, the word from the
// browser: **Failed to fetch**.
//
// That is not a message, it is a stack trace with a nice font. Supabase's logs
// show no signup request arriving at all, which means the fetch died before it
// left the machine, which on this product has exactly one common cause: a build
// made without the NEXT_PUBLIC Supabase variables points at
// placeholder.supabase.co, a domain that does not exist. See the note at the
// top of this file. Justin hit the same thing on 2 August and it told him his
// password was wrong.
//
// The login form already handles it and says so in words. The other three ways
// into an account did not, so the one screen a brand new customer meets was the
// one screen that answered them with a browser internal.

/** One sentence, in one place, so all four ways in say the same thing. */
export const NOT_CONFIGURED_MESSAGE =
  'This copy of the app is not connected to the database, so no account can be made here. Your details are fine. Try the main app instead.'

/**
 * Did this fail because the request never landed, rather than because the
 * server said no?
 *
 * Returns the sentence to show, or null when the error is a real answer and
 * should be shown as it is. Every browser words a dead fetch differently, and
 * supabase-js wraps some of them, so this matches on all of the shapes rather
 * than on Chrome's.
 */
export function networkAuthMessage(message?: string | null): string | null {
  const m = (message ?? '').toLowerCase()
  if (!m) return null
  const dead =
    m.includes('failed to fetch') ||        // Chrome, Edge
    m.includes('networkerror') ||           // Firefox
    m.includes('load failed') ||            // Safari
    m.includes('fetch failed') ||           // undici
    m.includes('retryablefetch')            // supabase-js wrapping any of them
  if (!dead) return null
  return isSupabaseConfigured()
    ? 'We could not reach our server just then. Check your connection and have another go.'
    : NOT_CONFIGURED_MESSAGE
}
