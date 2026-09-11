'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient, isSupabaseConfigured, NOT_CONFIGURED_MESSAGE, networkAuthMessage } from '@/lib/supabase/client'

// ── THE HALF OF THE RESET THAT WAS NEVER BUILT ──────────────────────────────
//
// Justin, 11 September 2026: "if they forget password is there a reset
// password?"
//
// Half of one. /forgot-password sends the mail, and the link worked in the
// sense that it signed the parent in. What it did next was drop them on
// /dashboard/settings, and there is no password field anywhere in this
// product: supabase.auth.updateUser is not called in a single file.
//
// So the flow LOOKED like it worked. A locked out parent clicks the link, sees
// their dashboard, and concludes it is fixed. Their password is unchanged, and
// the next time they are signed out they are locked out again with the same
// forgotten password, having already used the one thing that would have told
// them something was wrong.
//
// This is that missing screen. The reset link now lands here instead, and the
// session the link established is what authorises the change.
//
// ── WHY IT CHECKS FOR A SESSION ────────────────────────────────────────────
//
// updateUser without one fails with an unhelpful auth error. An expired link
// (they are an hour) is the common case, and it deserves the plain sentence
// plus the way to ask for another rather than a red string from an SDK.
export default function ResetPasswordPage() {
  const router = useRouter()
  const [ready, setReady] = useState<'checking' | 'ok' | 'expired'>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) { setReady('expired'); setError(NOT_CONFIGURED_MESSAGE); return }
    const supabase = createClient()
    supabase.auth.getSession()
      .then(({ data }) => setReady(data.session ? 'ok' : 'expired'))
      .catch(() => setReady('expired'))
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    // Supabase's own floor is six. Eight is ours, and it is the same number the
    // sign up form asks for, so a parent is never told two different rules
    // about the same password.
    if (password.length < 8) { setError('Use at least 8 characters.'); return }
    if (password !== confirm) { setError('Those two do not match.'); return }

    setSaving(true)
    const supabase = createClient()
    const { error: saveError } = await supabase.auth.updateUser({ password })
    const offline = networkAuthMessage(saveError?.message)
    if (offline) { setError(offline); setSaving(false); return }
    if (saveError) {
      setError(saveError.message.toLowerCase().includes('session')
        ? 'That link has expired. Ask for a new one and try again.'
        : saveError.message)
      setSaving(false)
      return
    }
    setDone(true)
    setSaving(false)
    // Straight in. They are already signed in from the link, so a login screen
    // here would be asking for the password they have just this second set.
    setTimeout(() => router.push('/dashboard'), 1200)
  }

  const field: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '12px 14px',
    border: '2px solid var(--ink)', borderRadius: '12px',
    fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)',
    background: '#fff',
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--cream)' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Link href="/" style={{ display: 'block', marginBottom: '32px', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--ink)' }}>Guided Childhood</span>
        </Link>

        <div className="card">
          {done ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '12px' }}>That is set</h2>
              <p style={{ color: 'var(--ink-muted)' }}>Your new password is saved. Taking you in.</p>
            </div>
          ) : ready === 'expired' ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '12px' }}>That link has expired</h2>
              <p style={{ color: 'var(--ink-muted)', lineHeight: 1.5 }}>
                {error || 'Reset links last an hour. Ask for a fresh one and it will work.'}
              </p>
              <Link href="/forgot-password" className="btn btn-gold" style={{ marginTop: '24px', display: 'inline-flex' }}>
                Send a new link
              </Link>
            </div>
          ) : (
            <form onSubmit={save}>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '6px' }}>Set a new password</h2>
              <p style={{ color: 'var(--ink-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                Pick something you will remember. You stay signed in on this device either way.
              </p>

              <label style={{ display: 'block', marginBottom: '12px' }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '5px' }}>
                  New password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  style={field}
                />
              </label>

              <label style={{ display: 'block', marginBottom: '16px' }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '5px' }}>
                  Again, to be sure
                </span>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  style={field}
                />
              </label>

              {error && (
                <p style={{ color: 'var(--terracotta-dark)', fontWeight: 700, fontSize: 'var(--text-base)', margin: '0 0 14px' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={saving || ready !== 'ok'}
                className="btn btn-gold"
                style={{ display: 'flex', width: '100%', justifyContent: 'center' }}
              >
                {saving ? 'Saving...' : 'Save it'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
