'use client'

import { useState } from 'react'
import { currentChildId } from '@/lib/children/current'
import { useRouter } from 'next/navigation'
import { card, cardPad, band, chunky } from '@/components/scripts/card-system'

// Did you use this, or does it not apply?
//
// Justin: "there should be a not needed at this time button, and a see the
// next one for this age. There also needs to know that the scripts have been
// done, and rerun them to finish the pathway."
//
// Those are the same request. Until now the only thing a script recorded was
// that it had been OPENED, and the pathway counted that as done, so there was
// nothing to say "not this one" with and nothing that could ever come back.
//
// Two buttons, and the second is the one that was missing. Deliberately equal
// in weight, because "this does not apply to us" is a real and useful answer
// rather than a failure to comply. A family with a seven year old SHOULD skip
// the first serious social media request, and the product should hear that
// rather than quietly counting it as read.
//
// Not needed comes back. See migration 157: it is set aside for ninety days,
// because not now at seven is not not ever at eleven.

const AWAY_DAYS = 90

export default function ScriptStatusButtons({
  sortOrder, status,
}: {
  sortOrder: number
  status: 'opened' | 'read' | 'used' | 'not_needed'
}) {
  const [current, setCurrent] = useState(status)
  const [busy, setBusy] = useState<string | null>(null)
  const router = useRouter()

  async function set(next: 'used' | 'not_needed') {
    if (busy) return
    setBusy(next)
    try {
      const res = await fetch('/api/scripts/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder, status: next, awayDays: next === 'not_needed' ? AWAY_DAYS : null , child_id: currentChildId() }),
      })
      if (!res.ok) throw new Error('failed')
      setCurrent(next)
      // The passport and the road both read this, so refresh rather than
      // leaving a parent to wonder why the number did not move.
      router.refresh()
    } catch {
      // Left as it was, so the button can simply be pressed again. Silently
      // showing it as saved when it is not is the one thing worth avoiding on
      // a control that feeds a progress number.
    } finally {
      setBusy(null)
    }
  }

  const done = current !== 'opened'

  return (
    // Used it is a landed state, so it wears the green band the child's
    // Printed! screen wears; the question and the set aside stay on a card.
    <div style={{ ...(current === 'used' ? band('green') : { ...card, padding: cardPad }), marginTop: 18 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: current === 'used' ? 'rgba(255,255,255,0.85)' : 'var(--ink-muted)', marginBottom: 9 }}>
        {current === 'used' ? 'You marked this used'
          : current === 'not_needed' ? 'Set aside for now'
          : 'Where are you with this one?'}
      </div>

      {current === 'not_needed' ? (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 11px' }}>
          It will come back in a few months in case it fits better then. Nothing to do.
        </p>
      ) : current === 'used' ? (
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: '#fff', lineHeight: 1.15, margin: '0 0 12px' }}>
          Nice one. Counted towards this stage of the passport.
        </p>
      ) : (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 11px' }}>
          Reading it does not count for anything on its own. Tell us which and the passport keeps up.
        </p>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => set('used')}
          disabled={!!busy}
          style={{
            ...chunky(current === 'used' ? 'white' : 'green'), flex: '1 1 150px',
            cursor: busy ? 'default' : 'pointer', opacity: busy === 'not_needed' ? 0.45 : 1,
          }}
        >
          {busy === 'used' ? 'Saving...' : current === 'used' ? 'We used this ✓' : 'We used this'}
        </button>
        <button
          type="button"
          onClick={() => set('not_needed')}
          disabled={!!busy}
          style={{
            ...chunky(current === 'not_needed' ? 'butter' : 'white'), flex: '1 1 150px',
            cursor: busy ? 'default' : 'pointer', opacity: busy === 'used' ? 0.45 : 1,
          }}
        >
          {busy === 'not_needed' ? 'Saving...' : current === 'not_needed' ? 'Not needed ✓' : 'Not needed right now'}
        </button>
      </div>

      {!done && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.45, margin: '9px 0 0' }}>
          Not needed is a real answer. Plenty of these will not fit your family yet, and saying so is how the pathway knows what is genuinely left.
        </p>
      )}
    </div>
  )
}
