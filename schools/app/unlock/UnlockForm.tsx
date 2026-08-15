'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { unlock } from './actions'

// One field, one button. A teacher opening this on a Sunday night with a
// code copied out of an email should be through it in ten seconds.

export default function UnlockForm({ next }: { next: string }) {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'checking'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setState('checking')
    const result = await unlock(new FormData(e.currentTarget))
    if (result.ok) {
      // Replace, not push, so the back button does not walk them into a page
      // that will only bounce them here again.
      router.replace(next)
      router.refresh()
      return
    }
    setError(result.error)
    setState('idle')
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        background: '#fff', border: '1px solid var(--border)', borderRadius: '20px',
        padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px',
        boxShadow: '0 1px 2px rgba(46,40,24,0.05)',
      }}
    >
      <label
        htmlFor="code"
        style={{
          display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--ink-muted)',
        }}
      >
        School code
      </label>
      <input
        className="input"
        id="code"
        name="code"
        required
        autoFocus
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={64}
        placeholder="oakfield-2026"
        style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
      />

      {error && (
        <div style={{
          padding: '12px 16px', background: 'var(--danger-bg)',
          border: '1px solid var(--danger-border)', borderRadius: '10px',
          color: 'var(--danger)', fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)', lineHeight: 1.5,
        }}>
          {error}
        </div>
      )}

      <button type="submit" className="btn btn-gold" disabled={state === 'checking'} style={{ justifyContent: 'center' }}>
        {state === 'checking' ? 'Checking…' : 'Open the curriculum'}
      </button>
    </form>
  )
}
