'use client'

import { useState } from 'react'
import { createClient, isSupabaseConfigured, NOT_CONFIGURED_MESSAGE } from '@/lib/supabase/client'
import { enabledProviders, PROVIDER_LABEL, type AuthProvider } from '@/lib/auth/providers'

// ONE TAP, AND THE PARENT IS IN.
//
// Justin, 10 September 2026: "Go ahead with Apple and google".
//
// ── WHERE THEY SIT, AND WHY IT IS ABOVE ────────────────────────────────────
//
// From the Mobbin sweep of account creation on iOS: Strava, monday.com and
// Finimize all put the providers FIRST, then a small "or", then the email.
// Zocdoc and Swarm put them underneath. Ours go above, because the whole value
// of the thing is that it is the fast way, and a fast way printed below the
// slow way is decoration.
//
// ── WHY THEY MAY NOT BE THERE AT ALL ───────────────────────────────────────
//
// enabledProviders() reads a config value that is unset by default, so this
// renders nothing until Google or Apple is genuinely switched on in Supabase.
// That is deliberate: an unconfigured provider does not fail gently, it answers
// "Unsupported provider", and this component draws on the last screen before a
// parent pays us.
//
// ── THE MARKS ──────────────────────────────────────────────────────────────
//
// Both marks are inline SVG, unaltered, as both companies' brand rules require,
// and inline because a logo fetched from a CDN is a third party watching our
// signup screen. The plate around them is ours: white, the 2px ink border and
// the 5px hard shadow, the same finish as the rest of the app.

export default function ProviderButtons({
  redirectTo,
  onBeforeRedirect,
  label = 'or',
}: {
  /** Where the parent lands once the provider sends them back. A path, not a
   *  URL: the origin is added here so a preview deployment returns to itself. */
  redirectTo: string
  /** Runs before the browser leaves. The starter pack uses it to put the child's
   *  answers somewhere that survives the round trip. */
  onBeforeRedirect?: () => void
  /** The word on the rule underneath. Null draws no rule, for screens where
   *  these are the only way in. */
  label?: string | null
}) {
  const providers = enabledProviders()
  const [busy, setBusy] = useState<AuthProvider | null>(null)
  const [error, setError] = useState('')

  // Nothing configured, nothing drawn, and no empty rule left hanging.
  if (providers.length === 0) return null

  async function go(provider: AuthProvider) {
    setError('')
    if (!isSupabaseConfigured()) {
      setError(NOT_CONFIGURED_MESSAGE)
      return
    }
    setBusy(provider)
    // Whatever the caller needs kept must be written BEFORE the redirect is
    // asked for, because once Supabase resolves this the page is gone.
    try { onBeforeRedirect?.() } catch { /* never block the sign in on a full disk */ }
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}` },
    })
    // A success never returns: the browser has already left. Anything here is a
    // real failure and the parent is still looking at the screen.
    if (err) {
      setError(
        /unsupported provider|not enabled/i.test(err.message)
          ? `${PROVIDER_LABEL[provider].replace('Continue with ', '')} sign in is not switched on yet. Use your email just below.`
          : err.message
      )
      setBusy(null)
    }
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {providers.map(p => (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            disabled={busy !== null}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              width: '100%', padding: '15px 18px',
              background: '#fff', border: '2px solid var(--ink)', borderRadius: 'var(--radius-btn)',
              boxShadow: '0 5px 0 var(--ink)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-base)',
              color: 'var(--ink)', cursor: busy ? 'default' : 'pointer',
              opacity: busy && busy !== p ? 0.55 : 1,
            }}
          >
            {p === 'google' ? <GoogleMark /> : <AppleMark />}
            {busy === p ? 'One moment...' : PROVIDER_LABEL[p]}
          </button>
        ))}
      </div>

      {error && (
        <p style={{ color: 'var(--terracotta-dark)', fontSize: 'var(--text-sm)', textAlign: 'center', marginTop: '12px', lineHeight: 1.5 }}>
          {error}
        </p>
      )}

      {label && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0 4px' }}>
          <span style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
          <span style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
      )}
    </div>
  )
}

/** Google's four colour G, unaltered, as their brand rules require. */
function GoogleMark() {
  return (
    <svg width="19" height="19" viewBox="0 0 48 48" aria-hidden focusable="false" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

/** The Apple glyph, in ink rather than pure black so it sits in our palette,
 *  which their rules allow on a light plate. */
function AppleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--ink)" aria-hidden focusable="false" style={{ flexShrink: 0, marginTop: '-2px' }}>
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.24 3.03-.99 1-2.14 1.57-3.36 1.47-.05-1.2.44-2.35 1.24-3.19.84-.88 2.2-1.48 3.36-1.31zM20.9 17.06c-.5 1.16-.74 1.68-1.39 2.71-.9 1.44-2.17 3.23-3.75 3.24-1.4.01-1.76-.91-3.66-.9-1.9.01-2.3.92-3.7.9-1.58-.01-2.78-1.63-3.68-3.06-2.52-3.99-2.79-8.74-1.22-11.25 1.1-1.77 2.85-2.8 4.5-2.8 1.68 0 2.73.92 4.12.92 1.34 0 2.16-.92 4.1-.92 1.47 0 3.02.8 4.13 2.18-3.63 1.99-3.04 7.17.85 8.98z" />
    </svg>
  )
}
