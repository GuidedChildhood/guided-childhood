'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email or password not recognised. Please try again.')
      setLoading(false)
    } else {
      router.push(next)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--cream)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Link href="/" style={{ display: 'block', marginBottom: '32px', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', color: 'var(--ink)' }}>Guided Childhood</span>
        </Link>

        <div className="card">
          <div style={{ marginBottom: '28px' }}>
            <p className="eyebrow" style={{ marginBottom: '8px' }}>Welcome back</p>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Sign in</h1>
            <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>Continue your family's pathway.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                Email
              </label>
              <input
                className="input"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                Password
              </label>
              <input
                className="input"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div style={{ padding: '12px 16px', background: 'var(--coral-lt)', borderRadius: '10px', color: 'var(--coral)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-gold" disabled={loading} style={{ marginTop: '4px' }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link href="/forgot-password" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)', textDecoration: 'none' }}>
              Forgot your password?
            </Link>
          </div>
        </div>

        <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '14px' }}>
          New here?{' '}
          <Link href="/signup" style={{ color: 'var(--green-dark)', fontWeight: 600, textDecoration: 'none' }}>
            Start your pathway
          </Link>
        </p>
      </div>
    </div>
  )
}
