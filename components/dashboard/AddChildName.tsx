'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Shown when the primary child has no real name yet (onboarding lets a parent
// skip it). One line in, one tap, and the whole app becomes personal: scripts,
// lessons and DiGi all speak to their child by name. Dismissable for the
// session so it asks, never nags.

export default function AddChildName() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [hidden, setHidden] = useState(() =>
    typeof window !== 'undefined' && sessionStorage.getItem('gc_name_ask_hidden') === '1'
  )

  if (hidden) return null

  async function save() {
    if (!name.trim() || saving) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/children/name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error('save failed')
      router.refresh()
    } catch {
      setError('That did not save. Have another go.')
      setSaving(false)
    }
  }

  function dismiss() {
    sessionStorage.setItem('gc_name_ask_hidden', '1')
    setHidden(true)
  }

  return (
    <div style={{
      position: 'relative',
      background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
      borderRadius: '16px', padding: '16px 18px', marginBottom: '16px',
    }}>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Not now"
        style={{
          position: 'absolute', top: 10, right: 10, width: 26, height: 26,
          borderRadius: '50%', background: 'rgba(0,0,0,0.06)', border: 'none',
          color: 'var(--ink-muted)', fontSize: 13, lineHeight: 1, cursor: 'pointer',
        }}
      >
        ✕
      </button>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 5 }}>
        Make it personal
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15.5, color: 'var(--ink)', margin: '0 0 4px' }}>
        What is your child&rsquo;s first name?
      </p>
      <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
        Scripts, lessons and DiGi all speak to them by name. First name only, nothing else is stored.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') save() }}
          placeholder="Their first name"
          style={{
            flex: 1, minWidth: 0, padding: '11px 14px', borderRadius: 12,
            border: '1.5px solid var(--border)', background: '#fff',
            fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink)', outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={save}
          disabled={saving || !name.trim()}
          style={{
            flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)',
            border: 'none', borderRadius: 12, padding: '11px 18px', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13.5,
            boxShadow: '0 3px 0 var(--terracotta-dark)', opacity: saving || !name.trim() ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      {error && <p style={{ fontSize: 12, color: 'var(--danger, #B4423A)', margin: '8px 0 0' }}>{error}</p>}
    </div>
  )
}
