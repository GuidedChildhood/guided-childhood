'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// The one clear "do this next" banner at the top of Home, and the mobile way
// into the notifications hub (mobile has no header bell). It carries the same
// red count, names what is waiting in plain English, and taps straight to the
// full list. Renders nothing when the coast is clear, so a calm day stays calm.

type Notif = { kind: string; urgent: boolean }

export default function WaitingOnYou() {
  const [items, setItems] = useState<Notif[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let live = true
    fetch('/api/notifications')
      .then(r => r.json())
      .then(d => { if (live) setItems(d.items ?? []) })
      .catch(() => {})
      .finally(() => { if (live) setLoaded(true) })
    return () => { live = false }
  }, [])

  const total = items.length
  if (!loaded || total === 0) return null

  const urgent = items.filter(i => i.urgent).length
  const asks = items.filter(i => i.kind === 'ask').length
  const digi = items.filter(i => i.kind === 'digi').length

  // Plain English summary: approvals first (a child is stood there), then
  // ideas, then DiGi, then a catch all.
  const parts: string[] = []
  if (urgent > 0) parts.push(`${urgent} to approve`)
  if (asks > 0) parts.push(`${asks} new ${asks === 1 ? 'idea' : 'ideas'}`)
  if (digi > 0) parts.push(`${digi} from DiGi`)
  const rest = total - urgent - asks - digi
  if (rest > 0) parts.push(`${rest} more`)

  return (
    <Link href="/dashboard/notifications" style={{ textDecoration: 'none', display: 'block', marginBottom: '22px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '15px',
        background: '#fff', border: `1.5px solid ${urgent > 0 ? '#E5484D' : 'var(--border)'}`,
        borderRadius: '22px', padding: '17px 20px',
        boxShadow: urgent > 0 ? '0 6px 22px -6px rgba(229,72,77,0.22)' : '0 2px 4px rgba(26,26,46,0.03), 0 14px 34px -12px rgba(26,26,46,0.12)',
      }}>
        <span style={{
          position: 'relative', flexShrink: 0,
          width: 50, height: 50, borderRadius: '15px', background: urgent > 0 ? '#FDECEC' : 'var(--cream)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
        }}>
          🔔
          <span style={{
            position: 'absolute', top: -7, right: -7, minWidth: 22, height: 22, padding: '0 5px',
            borderRadius: '100px', background: urgent > 0 ? '#E5484D' : 'var(--ink-muted)', color: '#fff',
            fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, lineHeight: '22px',
            textAlign: 'center', boxShadow: '0 0 0 2px #fff',
          }}>
            {total > 9 ? '9+' : total}
          </span>
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
            {urgent > 0 ? 'Waiting on you' : 'Notifications'}
          </span>
          <span style={{ display: 'block', fontSize: '14px', color: 'var(--ink-soft)', marginTop: '3px' }}>
            {parts.join(' · ')}
          </span>
        </span>
        <span style={{
          flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
          color: '#fff', background: urgent > 0 ? '#E5484D' : 'var(--deep-teal)', borderRadius: '13px', padding: '11px 18px',
          boxShadow: urgent > 0 ? '0 4px 0 #B93B3F' : '0 4px 0 rgba(0,0,0,0.25)',
        }}>
          {urgent > 0 ? 'Review' : 'Open'}
        </span>
      </div>
    </Link>
  )
}
