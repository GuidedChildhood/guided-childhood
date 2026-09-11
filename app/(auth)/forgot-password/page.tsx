'use client'
import { useState } from 'react'
import { createClient, isSupabaseConfigured, NOT_CONFIGURED_MESSAGE, networkAuthMessage } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // THIS ONE SAID "CHECK YOUR INBOX" WHATEVER HAPPENED.
    //
    // The result of resetPasswordForEmail was thrown away, so a parent locked
    // out of a deployment that cannot reach the database was told a mail was on
    // its way and then waited for it. Not sending is bad; saying you sent it is
    // worse, because it takes away the one clue that something is wrong.
    //
    // A real Supabase reply is still swallowed on purpose: telling a stranger
    // whether an address has an account is an account enumeration hole, and
    // "check your inbox" is the right answer to a valid request either way. It
    // is only a failure to ASK that has to be told the truth.
    if (!isSupabaseConfigured()) { setError(NOT_CONFIGURED_MESSAGE); return }

    setLoading(true)
    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      // ── AND IT LANDS SOMEWHERE THAT CAN ACTUALLY CHANGE IT ──────────────
      //
      // This pointed at /dashboard/settings, which has no password field, and
      // neither does anywhere else in the product. So the link signed a parent
      // in, showed them their dashboard, and left the forgotten password
      // exactly as it was. It looked like it worked, which is the worst way
      // for it not to.
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    const offline = networkAuthMessage(resetError?.message)
    if (offline) {
      setError(offline)
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--cream)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Link href="/" style={{ display: 'block', marginBottom: '32px', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--ink)' }}>Guided Childhood</span>
        </Link>

        <div className="card">
          {sent ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 'var(--text-3xl)', marginBottom: '16px' }}>✉️</div>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '12px' }}>Check your inbox</h2>
              <p style={{ color: 'var(--ink-muted)' }}>We sent a reset link to <strong>{email}</strong>. It expires in 1 hour.</p>
              <Link href="/login" className="btn btn-outline" style={{ marginTop: '24px', display: 'inline-flex' }}>
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: '4px' }}>Reset your password</h1>
                <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-md)' }}>Enter your email and we will send a reset link.</p>
              </div>

              <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input className="input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                <button type="submit" className="btn btn-gold" disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              {error && (
                <p style={{ color: 'var(--terracotta-dark)', fontSize: 'var(--text-sm)', lineHeight: 1.5, marginTop: '14px', textAlign: 'center' }}>
                  {error}
                </p>
              )}

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link href="/login" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none' }}>
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
