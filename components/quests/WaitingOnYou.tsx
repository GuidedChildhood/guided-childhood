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
    <Link href="/dashboard/notifications" style={{ textDecoration: 'none', display: 'block', marginBottom: '18px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        background: '#fff', border: `1.5px solid ${urgent > 0 ? '#E5484D' : 'var(--border)'}`,
        borderRadius: '18px', padding: '15px 18px',
        boxShadow: urgent > 0 ? '0 4px 16px rgba(229,72,77,0.14)' : '0 2px 12px rgba(26,26,46,0.05)',
      }}>
        <span style={{
          position: 'relative', flexShrink: 0,
          width: 46, height: 46, borderRadius: '13px', background: urgent > 0 ? '#FDECEC' : 'var(--cream)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
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
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.05rem', color: 'var(--ink)', lineHeight: 1.2 }}>
            {urgent > 0 ? 'Waiting on you' : 'Notifications'}
          </span>
          <span style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', marginTop: '2px' }}>
            {parts.join(' · ')}
          </span>
        </span>
        <span style={{
          flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px',
          color: '#fff', background: urgent > 0 ? '#E5484D' : 'var(--deep-teal)', borderRadius: '11px', padding: '9px 15px',
          boxShadow: urgent > 0 ? '0 3px 0 #B93B3F' : '0 3px 0 rgba(0,0,0,0.25)',
        }}>
          {urgent > 0 ? 'Review' : 'Open'}
        </span>
      </div>
    </Link>
  )
}
