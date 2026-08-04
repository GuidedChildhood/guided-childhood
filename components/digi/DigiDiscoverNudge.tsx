'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { CoverageCard } from '@/lib/dashboard/coverage'

// DiGi introduces one part of the product this family has not met.
//
// Justin: "the best way all vital info on the parent home page, like the week
// round up, gets in front of the user, and we rotate so everything we offer is
// at some point front of mind."
//
// Same shape and the same gate as the other flash up cards, so this adds
// nothing new to Home. It is one more theme in a rotation that already exists,
// and it is the one that knows when to stop: see lib/dashboard/coverage.ts,
// which only ever offers what a family has not already used.
//
// The tone is deliberately an introduction rather than a prompt. "Not tried
// yet" and a plain description of what a thing is for, because a parent who
// has been using this for a month does not need to be sold their own
// membership, they need to be told the tracker exists.

export default function DigiDiscoverNudge({ card }: { card: CoverageCard }) {
  const [show, setShow] = useState(true)
  if (!show) return null

  return (
    <div style={{
      background: 'var(--tint-sage)', border: '1.5px solid var(--border)',
      borderRadius: '18px', padding: '16px 18px', marginBottom: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '10px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
          background: '#fff', border: '1.5px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)',
        }}>
          {card.emoji}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--deep-teal)' }}>
            {card.eyebrow}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2, marginTop: '2px' }}>
            {card.title}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 13px' }}>
        {card.blurb}
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link
          href={card.href}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
            border: 'none', borderRadius: '12px', padding: '9px 15px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
            boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}
        >
          {card.cta}
        </Link>
        <button
          onClick={() => setShow(false)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            color: 'var(--ink-muted)', padding: '9px 4px',
          }}
        >
          Not now
        </button>
      </div>
    </div>
  )
}
