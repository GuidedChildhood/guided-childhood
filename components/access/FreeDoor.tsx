'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Door two. No card, the same free days, and it says out loud what it costs.
//
// The DiGi limit is named here rather than discovered later. Three messages a
// day is a real restriction and a parent who meets it without having been
// told feels tricked, which is a worse outcome than the one it is trying to
// cause. Said up front it does the honest version of the same job: it is a
// reason to take the founder door, offered as information.

export default function FreeDoor({
  days,
  trialDays,
  next,
}: {
  /** Free days actually left, so this card and the founder card agree. */
  days: number
  /** TRIAL_DAYS, so the copy can never disagree with the gate. */
  trialDays: number
  /** Where they were going before the block caught them. */
  next: string
}) {
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)
  const router = useRouter()

  async function choose() {
    setSaving(true)
    setFailed(false)
    try {
      const res = await fetch('/api/plan/free', { method: 'POST' })
      if (!res.ok) throw new Error('not saved')
      // A full navigation rather than a push: the block lives in the
      // middleware, so the redirect has to be re evaluated by the server or
      // a client side route change walks straight back into it.
      window.location.href = next
    } catch {
      // Never strand them. The block is the only thing between this parent
      // and the app they just checked in on, so a failed write says so and
      // offers the tap again rather than silently doing nothing.
      setSaving(false)
      setFailed(true)
      router.refresh()
    }
  }

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)',
      borderRadius: 20, padding: '22px 24px', marginTop: '14px',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px',
      }}>
        Option two · No card
      </div>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '16px' }}>
        The same {days} {days === 1 ? 'free day' : 'free days'}, nothing to enter. DiGi answers three times a day on this one. When the {trialDays} days are up the app closes until you join, at the standard rate.
      </p>
      {failed && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--danger)', lineHeight: 1.5, margin: '0 0 12px' }}>
          That did not save. Tap again and it will.
        </p>
      )}
      <button
        type="button"
        onClick={choose}
        disabled={saving}
        style={{
          display: 'block', width: '100%',
          padding: '15px 24px', background: '#fff',
          border: '2px solid var(--ink)', borderRadius: 16,
          color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
          cursor: saving ? 'default' : 'pointer', textAlign: 'center',
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? 'One second...' : 'Carry on without a card'}
      </button>
    </div>
  )
}
