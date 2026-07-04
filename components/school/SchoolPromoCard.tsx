'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Shown on the dashboard while no active school connection exists.
// Dismissal is local to the device (localStorage), same pattern as the
// device setup banner, so a curious parent can find it again on another
// device but is never nagged on this one.

const STORAGE_KEY = 'gc-school-promo-dismissed'

export default function SchoolPromoCard() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(localStorage.getItem(STORAGE_KEY) !== '1')
  }, [])

  if (!visible) return null

  return (
    <div style={{
      background: 'var(--tint-sage)', border: '1.5px solid var(--tint-sage)',
      borderRadius: '16px', padding: '20px 22px', marginBottom: '20px',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        New · School emails
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
        Never miss a PE kit day again
      </div>
      <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '14px' }}>
        Give us a letterbox, not a key. Forward the school&apos;s emails to your own private address and the kit days, trips, payments and deadlines turn into reminders right here. We keep the actions, never the email.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link
          href="/dashboard/school"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: '16px', padding: '11px 20px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
            boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}
        >
          Set it up in one minute
        </Link>
        <button
          onClick={() => { localStorage.setItem(STORAGE_KEY, '1'); setVisible(false) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', padding: 0 }}
        >
          Not now
        </button>
      </div>
    </div>
  )
}
