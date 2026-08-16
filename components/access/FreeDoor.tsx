'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FREE_BTN } from './door-button'

// Path two. No card, the same free days, and it says out loud what it costs.
//
// TWO THINGS ARE NAMED HERE RATHER THAN DISCOVERED LATER, and both are the
// honest version of a sales argument.
//
// The prices, because this path does not hold a founder place and does not
// count toward the fifty. A parent who takes it and finds £12.99 waiting on
// day five was not told the truth on the screen where they decided.
//
// And the daily limit, which is said once under both cards now rather than
// only under this one, because the four days are identical on both paths.
// A restriction a parent meets without warning feels like a trick, which is a
// worse outcome than the one it is trying to cause.

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
      borderRadius: 20, padding: '22px 20px',
      boxShadow: '0 4px 24px rgba(26,26,46,0.07)',
      // Matches CARD in TwoDoors exactly. marginTop is gone: the grid owns the
      // spacing now, and a top margin on one of two side by side cards drops it
      // below the other.
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '8px',
      }}>
        Path two · No card
      </div>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '16px' }}>
        The same {days} {days === 1 ? 'free day' : 'free days'}, nothing to enter and nothing taken. When the {trialDays} days are up the app closes until you join, at the standard rate: £12.99 a month or £99 a year. No founder place is held on this one.
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
          ...FREE_BTN,
          marginTop: 'auto',
          cursor: saving ? 'default' : 'pointer',
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? 'One second...' : 'Carry on without a card'}
      </button>
    </div>
  )
}
