'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// The one clear "do this next" banner at the top of Home. It carries the
// same red count the Quests tab wears, so the moment a child ticks a quest
// or pitches an idea, the parent sees exactly what is waiting and taps
// straight to it. Renders nothing when the coast is clear, so a calm day
// stays calm.

type Ask = { status: string }
type Tick = { status: string }

export default function WaitingOnYou() {
  const [asks, setAsks] = useState<number>(0)
  const [ticks, setTicks] = useState<number>(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let live = true
    fetch('/api/quests')
      .then(r => r.json())
      .then(data => {
        if (!live) return
        setAsks((data.requests ?? []).filter((a: Ask) => a.status === 'pending').length)
        setTicks((data.ticks ?? []).filter((t: Tick) => t.status === 'pending').length)
      })
      .catch(() => {})
      .finally(() => { if (live) setLoaded(true) })
    return () => { live = false }
  }, [])

  const total = asks + ticks
  if (!loaded || total === 0) return null

  // Plain English for what is waiting: approvals first (a child is stood
  // there), then their pitched ideas.
  const parts: string[] = []
  if (ticks > 0) parts.push(`${ticks} to approve`)
  if (asks > 0) parts.push(`${asks} new ${asks === 1 ? 'idea' : 'ideas'}`)

  return (
    <Link href="#quest-board" style={{ textDecoration: 'none', display: 'block', marginBottom: '18px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        background: '#fff', border: '1.5px solid #E5484D',
        borderRadius: '18px', padding: '15px 18px',
        boxShadow: '0 4px 16px rgba(229,72,77,0.14)',
      }}>
        <span style={{
          position: 'relative', flexShrink: 0,
          width: 46, height: 46, borderRadius: '13px', background: '#FDECEC',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
        }}>
          🔔
          <span style={{
            position: 'absolute', top: -7, right: -7, minWidth: 22, height: 22, padding: '0 5px',
            borderRadius: '100px', background: '#E5484D', color: '#fff',
            fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, lineHeight: '22px',
            textAlign: 'center', boxShadow: '0 0 0 2px #fff',
          }}>
            {total > 9 ? '9+' : total}
          </span>
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.2 }}>
            Waiting on you
          </span>
          <span style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', marginTop: '2px' }}>
            {parts.join(' · ')}
          </span>
        </span>
        <span style={{
          flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
          color: '#fff', background: '#E5484D', borderRadius: '11px', padding: '9px 15px',
          boxShadow: '0 3px 0 #B93B3F',
        }}>
          Review
        </span>
      </div>
    </Link>
  )
}
