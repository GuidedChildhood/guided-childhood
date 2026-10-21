'use client'

import { useState } from 'react'
import { captureStandaloneLead } from './actions'

// THE FORM ON THE STANDALONE GATE (21 October 2026). Two boxes and one button.
// On success the action has set the cookie, so reloading the very same URL is
// the lesson: the proxy lets it through this time. A reload rather than a
// client navigation, so the gate can never be served again from the router's
// cache.

const label: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
  fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-muted)', marginBottom: '6px',
}

export default function StandaloneGate({ moduleId }: { moduleId: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'opening'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setState('sending')
    const result = await captureStandaloneLead(new FormData(e.currentTarget))
    if (result.ok) {
      setState('opening')
      window.location.reload()
    } else {
      setError(result.error)
      setState('idle')
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <input type="hidden" name="module_id" value={moduleId} />
      <div>
        <label style={label} htmlFor="gate_email">Your school email</label>
        <input className="input" id="gate_email" name="email" type="email" required autoComplete="email" maxLength={200} placeholder="s.carter@school.sch.uk" />
      </div>
      <div>
        <label style={label} htmlFor="gate_school">Your school</label>
        <input className="input" id="gate_school" name="school_name" required autoComplete="organization" maxLength={200} placeholder="St Example Primary" />
      </div>

      {error && (
        <div role="alert" style={{
          padding: '12px 16px', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
          borderRadius: 'var(--radius-tile)', color: 'var(--danger)', fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)', lineHeight: 1.5,
        }}>
          {error}
        </div>
      )}

      <button type="submit" className="btn btn-gold" disabled={state !== 'idle'} style={{ justifyContent: 'center', fontSize: 'var(--text-md)', padding: '15px 30px' }}>
        {state === 'idle' ? 'Open the lesson' : 'Opening…'}
      </button>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', lineHeight: 1.6, textAlign: 'center' }}>
        Free, no card, no newsletter. We may write once to ask how the lesson went.
      </p>
    </form>
  )
}
