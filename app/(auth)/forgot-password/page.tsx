'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings`,
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--cream)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Link href="/" style={{ display: 'block', marginBottom: '32px', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>Guided Childhood</span>
        </Link>

        <div className="card">
          {sent ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>✉️</div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Check your inbox</h2>
              <p style={{ color: 'var(--ink-muted)' }}>We sent a reset link to <strong>{email}</strong>. It expires in 1 hour.</p>
              <Link href="/login" className="btn btn-outline" style={{ marginTop: '24px', display: 'inline-flex' }}>
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Reset your password</h1>
                <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>Enter your email and we will send a reset link.</p>
              </div>

              <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input className="input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                <button type="submit" className="btn btn-gold" disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link href="/login" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)', textDecoration: 'none' }}>
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
