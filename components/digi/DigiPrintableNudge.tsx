'use client'

import { useState } from 'react'
import Link from 'next/link'

// DiGi brings a printable to Home: one offline sheet suited to the child's
// stage, the away from screens pathway, offered as a warm aside not a nag.
// The flash up gate decides when it shows, so this card only handles the
// content and a Not now that tucks it away for the visit.

export default function DigiPrintableNudge({
  emoji, title, blurb,
}: {
  emoji: string
  title: string
  blurb: string
}) {
  const [show, setShow] = useState(true)
  if (!show) return null

  return (
    <div style={{
      background: 'var(--stage-2)', border: '1.5px solid var(--border)',
      borderRadius: '18px', padding: '16px 18px', marginBottom: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '10px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
          background: '#fff', border: '1.5px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px',
        }}>
          {emoji}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
            A printable from DiGi
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)', lineHeight: 1.2, marginTop: '2px' }}>
            {title}
          </div>
        </div>
      </div>

      <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 13px' }}>
        {blurb}
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link
          href="/dashboard/printables"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
            border: 'none', borderRadius: '12px', padding: '9px 15px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
            boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}
        >
          🖨️ Print it
        </Link>
        <button
          onClick={() => setShow(false)}
          style={{
            marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)', padding: '6px 4px',
          }}
        >
          Not now
        </button>
      </div>
    </div>
  )
}
