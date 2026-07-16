'use client'

// The email gate on a lead magnet page. The page above it is free and
// public; this is where the free printable is handed over in exchange for
// an email. On submit it saves the lead onto the same list the starter
// quiz fills, emails the download, and reveals a download button right
// away so the parent never has to leave to get value. One calm box, in
// the warm system, no dashes in any copy.

import { useState } from 'react'
import Link from 'next/link'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function MagnetGate({
  slug, heading, sub,
}: {
  slug: string
  heading: string
  sub: string
}) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const [download, setDownload] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const clean = email.trim().toLowerCase()
    if (!EMAIL_RE.test(clean)) { setError('That email does not look right. Have another go.'); return }
    setError('')
    setState('sending')
    try {
      const res = await fetch('/api/magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean, slug }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError('Something went wrong. Try again in a moment.'); setState('idle'); return }
      setDownload(data.download || `/api/magnet/${slug}/pdf`)
      setState('done')
    } catch {
      setError('Something went wrong. Try again in a moment.')
      setState('idle')
    }
  }

  const box: React.CSSProperties = {
    background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
    borderRadius: '20px', padding: '26px 24px', textAlign: 'center',
  }

  if (state === 'done') {
    return (
      <div style={box}>
        <div style={{ fontSize: '2rem', lineHeight: 1, marginBottom: '10px' }}>🎁</div>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--ink)', margin: '0 0 8px' }}>
          Your printable is ready
        </p>
        <p style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 auto 18px', maxWidth: 380 }}>
          We have popped a copy in your inbox too, in case you want it later.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={download} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ padding: '13px 26px', fontSize: '15px' }}>
            Download the printable
          </a>
          <Link href="/starter-pack" className="btn" style={{ padding: '13px 26px', fontSize: '15px', border: '1.5px solid var(--border)' }}>
            See the free plan
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={box}>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--ink)', margin: '0 0 6px' }}>
        {heading}
      </p>
      <p style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 auto 16px', maxWidth: 400 }}>
        {sub}
      </p>
      <form onSubmit={submit} style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: 440, margin: '0 auto' }}>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Your email"
          style={{
            flex: '1 1 200px', minWidth: 0, padding: '13px 16px', fontSize: '15px',
            fontFamily: 'var(--font-body, inherit)', color: 'var(--ink)',
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: '13px', outline: 'none',
          }}
        />
        <button type="submit" disabled={state === 'sending'} className="btn btn-gold" style={{ padding: '13px 24px', fontSize: '15px', opacity: state === 'sending' ? 0.7 : 1 }}>
          {state === 'sending' ? 'Sending...' : 'Send it to me'}
        </button>
      </form>
      {error && (
        <p style={{ fontSize: '13px', color: 'var(--danger)', margin: '10px 0 0' }}>{error}</p>
      )}
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', margin: '12px 0 0' }}>
        One printable, no spam. Unsubscribe any time.
      </p>
    </div>
  )
}
