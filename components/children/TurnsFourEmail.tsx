'use client'

import { useState } from 'react'

// One optional field under "We start at 4": the email for the month the child
// turns 4. See lib/starter/turns-four.ts for what happens to it (one email,
// that month, nothing before).
export default function TurnsFourEmail({ turnsFour, monthLabel }: { turnsFour: string; monthLabel: string }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle')

  if (state === 'saved') {
    return (
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.55, margin: '10px 0 0', fontWeight: 700 }}>
        Saved. We will write once, in {monthLabel}, and not before.
      </p>
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setState('saving')
    try {
      const r = await fetch('/api/starter/turns-four', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnsFour }),
      })
      const d = await r.json().catch(() => ({}))
      setState(r.ok && d.ok ? 'saved' : 'failed')
    } catch {
      setState('failed')
    }
  }

  return (
    <form onSubmit={submit} style={{ marginTop: '10px' }}>
      <label htmlFor="turns-four-email" style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginBottom: '6px', lineHeight: 1.45 }}>
        Want a reminder? Leave your email and we will write once, in {monthLabel}.
      </label>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          id="turns-four-email" type="email" required autoComplete="email" inputMode="email"
          value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
          style={{ flex: '1 1 180px', minWidth: 0, minHeight: 44, padding: '10px 12px', fontSize: 'var(--text-base)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', background: 'var(--white)', color: 'var(--ink)', fontFamily: 'inherit' }}
        />
        <button type="submit" disabled={state === 'saving'} className="btn btn-gold" style={{ minHeight: 44, padding: '10px 18px', fontSize: 'var(--text-base)' }}>
          {state === 'saving' ? 'Saving' : 'Remind me'}
        </button>
      </div>
      {state === 'failed' && (
        <p role="alert" style={{ fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', margin: '6px 0 0' }}>
          That did not save. Check the address and try again.
        </p>
      )}
    </form>
  )
}
