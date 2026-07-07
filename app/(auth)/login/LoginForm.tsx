'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import DigiCharacter from '@/components/digi/DigiCharacter'

// One door, two paths: families and schools sign in here. The path picker
// sets the destination and the copy, and arriving with ?next=/educator...
// preselects the school path, so a teacher never reads family copy again.

type Path = 'family' | 'school'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextParam = searchParams.get('next')
  const [path, setPath] = useState<Path>(nextParam?.startsWith('/educator') ? 'school' : 'family')
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const destination = nextParam ?? (path === 'school' ? '/educator' : '/dashboard')

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
      router.push(destination)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--cream)' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginBottom: '26px', textDecoration: 'none' }}>
          <DigiCharacter mood="wave" size={64} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '22px', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            Guided Childhood
          </span>
        </Link>

        {/* The path picker: same door, the right welcome */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          {([['family', '🏡 Family'], ['school', '🏫 School']] as const).map(([key, label]) => {
            const active = path === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPath(key)}
                style={{
                  flex: 1, padding: '12px 10px', borderRadius: '14px', cursor: 'pointer',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px',
                  background: active ? 'var(--gold, #F2C94C)' : '#fff',
                  color: 'var(--ink)',
                  border: active ? 'none' : '1.5px solid var(--border)',
                  boxShadow: active ? '0 4px 0 var(--gold-hover, #E3B53A)' : 'none',
                  transition: 'background 0.15s',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        <div className="card" style={{ borderRadius: '20px', boxShadow: '0 5px 0 var(--border)' }}>
          <div style={{ marginBottom: '26px' }}>
            <p className="eyebrow" style={{ marginBottom: '8px' }}>
              {path === 'school' ? 'Guided Childhood Schools' : 'Welcome back'}
            </p>
            <h1 style={{ fontSize: '1.7rem', marginBottom: '4px' }}>Sign in</h1>
            <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
              {path === 'school'
                ? 'Back to your classes, the curriculum map and the print room.'
                : 'Continue your family&rsquo;s pathway.'}
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px' }}>
                Email
              </label>
              <input
                className="input"
                type="email"
                placeholder={path === 'school' ? 'you@yourschool.sch.uk' : 'you@email.com'}
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
              <div style={{ padding: '12px 16px', background: 'var(--stage-1)', borderRadius: '10px', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-gold" disabled={loading} style={{ marginTop: '4px' }}>
              {loading ? 'Signing in...' : path === 'school' ? 'Into the workspace' : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link href="/forgot-password" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)', textDecoration: 'none' }}>
              Forgot your password?
            </Link>
          </div>
        </div>

        <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--ink-muted)', fontSize: '14px' }}>
          {path === 'school' ? (
            <>Setting up your school?{' '}
              <Link href="/signup?next=/educator" style={{ color: 'var(--terracotta)', fontWeight: 600, textDecoration: 'none' }}>
                Create your account
              </Link>
              {' '}then the workspace walks you through it.</>
          ) : (
            <>New here?{' '}
              <Link href="/signup" style={{ color: 'var(--terracotta)', fontWeight: 600, textDecoration: 'none' }}>
                Start your pathway
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
