'use client'

import { useState } from 'react'
import ShareQrButton from '@/components/quests/ShareQrButton'

// THE ONE TIME WE COME BACK, AND ONLY ONCE.
//
// Justin, 14 August 2026: stop telling a family who chose the paper chart to
// set up a child device, "but later in we just need to make them aware when
// they get a phone that we can share child's app."
//
// LATER is the whole design. Everything else in this change silences the ask,
// and silence on its own would be the wrong answer, because the fact that
// changes it is one we cannot see: a child who had no phone at nine very often
// has one at eleven, and the parent who told us no in year four has no reason
// to remember this product can put their jobs on it. They would simply never
// find out.
//
// SO IT COMES BACK ONCE, after six months, and it is written as news rather
// than as a nudge. The difference is the whole card. A nudge says do this. This
// says: if something has changed, here is the thing you would want, and if it
// has not, that is completely fine. Both answers are one tap, and both are
// final for another six months.
//
// It is NOT the old card returning. The old one had no dismiss that meant
// anything, no memory, and no idea it had ever been answered. Tapping "Still no
// phone" here writes the answer back through the same route that recorded it
// the first time, which restarts the clock properly, so a parent who says no
// three times has been asked three times in eighteen months rather than three
// times a week.

export default function PhoneLaterCard({ childId, childName }: {
  childId: string
  childName: string
}) {
  const [gone, setGone] = useState(false)
  const [saving, setSaving] = useState(false)

  if (gone) return null

  // Re-stamping no_phone rewrites no_phone_at, which is the clock the six month
  // wait is measured from. Optimistic: the card goes on the tap, because a
  // dismiss that waits on a round trip reads as a dead button.
  async function stillNo() {
    setSaving(true)
    setGone(true)
    try {
      await fetch('/api/children/no-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, noPhone: true }),
      })
    } catch { /* the card is gone for this visit either way */ }
    setSaving(false)
  }

  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px',
      padding: '16px 18px', marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '13px' }}>
        <span aria-hidden style={{
          width: 44, height: 44, borderRadius: '13px', flexShrink: 0,
          background: 'var(--tint-blue)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 'var(--text-lg)',
        }}>📲</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '3px' }}>
            Only if things have changed
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>
            Has {childName} got a phone or tablet now?
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '5px 0 0' }}>
            You told us you keep it on the fridge, and the chart carries on either way. If a device has arrived since, {childName} can scan a code and have their own side of it in about ten seconds.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap', marginTop: '13px' }}>
        <ShareQrButton
          childId={childId}
          childName={childName}
          label="Show the code"
          style={{ fontSize: 'var(--text-base)', padding: '11px 17px', borderRadius: 14, boxShadow: '0 4px 0 var(--terracotta-dark)' }}
        />
        <button
          onClick={stillNo}
          disabled={saving}
          style={{
            background: 'transparent', border: '1.5px solid var(--border)', borderRadius: '14px',
            padding: '11px 17px', cursor: saving ? 'default' : 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
            color: 'var(--ink-soft)',
          }}
        >
          Still no phone
        </button>
      </div>
    </div>
  )
}
