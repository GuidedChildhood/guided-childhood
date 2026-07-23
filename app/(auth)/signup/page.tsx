'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  // Prefill from the starter pack (?email=) so the account is created against
  // the same address the pathway was saved to. Read from the URL directly so
  // no Suspense boundary is needed for useSearchParams.
  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('email')
      const fromStore = localStorage.getItem('gc_starter_email')
      const prefill = fromUrl ?? fromStore
      if (prefill) setEmail(prefill)
      // Name is captured at the very start of the pathway now, so carry it
      // through and never ask for it twice.
      const savedName = localStorage.getItem('gc_starter_name')
      if (savedName) setName(savedName)
    } catch {}
  }, [])

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    setError('')
    setAlreadyRegistered(false)

    const supabase = createClient()

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signupError) {
      if (signupError.message.toLowerCase().includes('already registered') || signupError.message.toLowerCase().includes('already been registered')) {
        setAlreadyRegistered(true)
        setLoading(false)
        return
      }
      setError(signupError.message)
      setLoading(false)
      return
    }

    // Do NOT write to profiles or clear localStorage here.
    // signUp may return a user object before the session is established (email confirm pending),
    // so an upsert here fails silently against RLS. /onboarding owns the write once a
    // real session exists, and it clears localStorage after a confirmed DB write.
    router.push('/onboarding')
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#fff' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Link href="/" style={{ display: 'block', marginBottom: '32px', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>Guided Childhood</span>
        </Link>

        <div className="card">
          <div style={{ marginBottom: '28px' }}>
            <p className="eyebrow" style={{ marginBottom: '8px' }}>Free to start</p>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Save your pathway</h1>
            <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>Your child's stage is already set. Create your free account to save it.</p>
          </div>

          {alreadyRegistered ? (
            /* ── Already has an account ── */
            <div>
              <div style={{
                padding: '20px',
                background: '#f9fafb',
                border: '1.5px solid #e5e7eb',
                borderRadius: 14,
                marginBottom: '16px',
              }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--ink)', marginBottom: 6 }}>
                  We found your account.
                </p>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                  {email} already has an account. Sign in to continue, your pathway is saved and waiting for you.
                </p>
              </div>
              <Link
                href={`/login?email=${encodeURIComponent(email)}`}
                style={{
                  display: 'block', textAlign: 'center', width: '100%',
                  padding: '16px 28px',
                  background: 'var(--terracotta)', color: 'var(--ink)',
                  borderRadius: 16, textDecoration: 'none',
                  fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  boxShadow: '0 5px 0 var(--terracotta-dark)',
                  marginBottom: 14,
                }}
              >
                Sign in to your account
              </Link>
              <button
                onClick={() => { setAlreadyRegistered(false); setPassword('') }}
                style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: '#9ca3af', fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', textAlign: 'center', padding: '8px 0', letterSpacing: '0.06em' }}
              >
                Use a different email instead
              </button>
            </div>
          ) : (
            /* ── Sign up form ── */
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                  Your name
                </label>
                <input className="input" type="text" placeholder="First name" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                  Email
                </label>
                <input className="input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                  Password
                </label>
                <input className="input" type="password" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
              </div>

              {error && (
                <div style={{ padding: '12px 16px', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: '10px', color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-gold" disabled={loading}>
                {loading ? 'Creating account...' : 'Create free account'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.55 }}>
                By creating an account you agree to our{' '}
                <Link href="/terms" style={{ color: 'var(--terracotta)', fontWeight: 600, textDecoration: 'none' }}>Terms</Link>
                {' '}and{' '}
                <Link href="/privacy" style={{ color: 'var(--terracotta)', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>.
                No card required.
              </p>
            </form>
          )}
        </div>

        <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--terracotta)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
