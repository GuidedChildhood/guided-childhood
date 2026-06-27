'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    setError('')

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
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--cream)' }}>
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
              <div style={{ padding: '12px 16px', background: 'var(--coral-lt)', borderRadius: '10px', color: 'var(--coral)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-gold" disabled={loading}>
              {loading ? 'Creating account...' : 'Create free account'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--ink-muted)' }}>
              By signing up you agree to our{' '}
              <Link href="/privacy" style={{ color: 'var(--green-dark)' }}>privacy policy</Link>.
              No card required.
            </p>
          </form>
        </div>

        <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--green-dark)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
