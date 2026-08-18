'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FREE_BTN } from './door-button'
import { CARD_TITLE, CARD_SUB, Tick } from './TwoDoors'

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
      {/* No eyebrow. The founder card's badge sits in this row, and carrying
          BOTH an eyebrow and a badge spacer here pushed this card's price a
          line below the other one, which is the first thing the eye checks when
          two prices sit side by side. The card says "no card" in its price and
          its subtitle already. */}
      {/* THE SAME SHAPE AS THE FOUNDER CARD, imported rather than repeated.
          Justin: "text seems different font in each." It was never two fonts,
          it was --text-md in --ink-soft here against --text-lg in --ink there,
          which reads as two designs. Both cards take their scale from
          TwoDoors now, so the pair cannot drift again.
          The badge slot is deliberately empty: this card is not the offer, and
          an empty space where the other card has a badge is what makes the
          two line up rather than one starting higher than the other. */}
      <div style={{ height: 25, marginBottom: '12px' }} aria-hidden />

      <p style={CARD_TITLE}>£0<span style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}> for {days} {days === 1 ? 'day' : 'days'}</span></p>
      <p style={CARD_SUB}>No card, nothing taken</p>

      <Tick>Nothing to enter and nothing charged</Tick>
      <Tick>The same {trialDays} days, all of it open</Tick>
      <Tick>£12.99 a month or £99 a year after, if you stay</Tick>

      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '12px 0 16px' }}>
        No founder place is held on this one.
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
