// WHICH ONE TAP SIGN INS ARE ACTUALLY SWITCHED ON.
//
// Justin, 10 September 2026: "Go ahead with Apple and google".
//
// This is a config value, not a list in the code, for the same reason DIGI_MODEL
// is: the answer differs between his machine, a preview and production, and it
// has to be changeable without a deploy.
//
// It matters more here than it would elsewhere. A provider button is not inert
// when the provider is off. Supabase answers `signInWithOAuth` for an unconfigured
// provider with "Unsupported provider: provider is not enabled", so a button
// shipped ahead of the setup is a dead end on the single screen that stands
// between a convinced parent and paying us. Unset means no buttons, which means
// the account screen is exactly what merged in PR 1036.
//
// Turning them on is two things and neither is code:
//   1. Enable the provider in Supabase (Authentication, Sign In / Providers)
//   2. Set NEXT_PUBLIC_AUTH_PROVIDERS in Vercel, then redeploy
//
// Google is free and takes about fifteen minutes. Apple needs a paid Apple
// Developer Program membership, so `google` on its own is a normal state to be
// in for a while and the value is a list precisely so it can be.

export type AuthProvider = 'google' | 'apple'

const KNOWN: AuthProvider[] = ['google', 'apple']

/**
 * The providers this deployment may offer, in the order they should be drawn.
 *
 * Read from NEXT_PUBLIC_AUTH_PROVIDERS, a comma separated list, for example
 * `google` or `google,apple`. Unknown names are dropped rather than trusted:
 * a typo in an environment variable should cost us a missing button, never a
 * button that throws when a parent taps it.
 *
 * NEXT_PUBLIC values are inlined at build time, so this must stay a plain read
 * of the whole identifier. Anything computed gets missed by the bundler and
 * comes back undefined in the browser.
 */
export function enabledProviders(): AuthProvider[] {
  const raw = process.env.NEXT_PUBLIC_AUTH_PROVIDERS || ''
  const asked = raw.toLowerCase().split(',').map(s => s.trim()).filter(Boolean)
  return KNOWN.filter(p => asked.includes(p))
}

/** The words on the button. "Continue with" rather than "Sign up with" because
 *  the same button is both, and a parent coming back should not be told they
 *  are signing up again. */
export const PROVIDER_LABEL: Record<AuthProvider, string> = {
  google: 'Continue with Google',
  apple: 'Continue with Apple',
}
