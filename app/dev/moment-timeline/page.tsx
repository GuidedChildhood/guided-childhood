'use client'

import { useState } from 'react'
import MomentTimeline from '@/components/daily/MomentTimeline'

// The end of day tagger, on a route that is not behind the daily deck.
//
// Justin, 11 August 2026: "we should have struggle to come off device, and TV
// first thing morning, phones in car, at restaurant, walking in street, as
// moments need to solve."
//
// The tagger only appears at the end of a daily check in, so the one screen
// that asks a parent what went wrong today could only be looked at by doing a
// whole check in first. That is why it went this long carrying teeth brushing
// and packed lunches and no way at all to say the handover was a fight.

export const dynamic = 'force-static'

export default function MomentTimelineFixture() {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (key: string) =>
    setSelected(prev => (prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]))

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--app-bg)', padding: '22px 16px 60px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20, padding: 22 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--stage-2-text)', marginBottom: 8 }}>
            What came up today?
          </div>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: 18 }}>
            Tap anything that happened. We will show you the right scripts tomorrow.
          </p>
          <MomentTimeline selected={selected} onToggle={toggle} />
        </div>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: 16, lineHeight: 1.6 }}>
          Selected: {selected.length ? selected.join(', ') : 'nothing'}
        </p>
      </div>
    </div>
  )
}
