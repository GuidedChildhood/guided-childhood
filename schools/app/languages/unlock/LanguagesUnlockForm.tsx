'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { unlockLanguages } from './actions'

// One field, one button, the same shape as the scheme's door.
export default function LanguagesUnlockForm({ next }: { next: string }) {
  const router = useRouter()
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setChecking(true)
    const result = await unlockLanguages(new FormData(e.currentTarget))
    if (result.ok) {
      router.replace(next)
      router.refresh()
      return
    }
    setError(result.error)
    setChecking(false)
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)',
        padding: '28px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
      }}
    >
      <label htmlFor="code" style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)',
      }}>
        Languages code
      </label>
      <input
        className="input" id="code" name="code" required autoFocus autoComplete="off"
        autoCapitalize="off" spellCheck={false} maxLength={64} placeholder="your languages code"
        style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
      />
      {error && (
        <div style={{
          padding: '12px 16px', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
          borderRadius: 'var(--radius-tile)', color: 'var(--danger)', fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)', lineHeight: 1.5,
        }}>{error}</div>
      )}
      <button type="submit" className="btn btn-gold" disabled={checking} style={{ justifyContent: 'center' }}>
        {checking ? 'Checking…' : 'Open French and Spanish'}
      </button>
    </form>
  )
}
