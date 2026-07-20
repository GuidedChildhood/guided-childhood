'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { deviceEmoji, deviceLabel, type DeviceKey } from '@/lib/quests/device-time'

// The device timer surfacing on Home only when it matters: a child's time
// running shows as one slim live row with the same countdown they see, and a
// pending ask shows as one warm row. Tapping either opens the full screen time
// card on the quests page. When nothing is live, this renders nothing at all,
// so a calm day stays calm. Read only: every control stays on the full card.

type Session = { device: DeviceKey; minutes: number; ends_at: string }
type Req = { device: DeviceKey; minutes: number }
type Kid = { id: string; name: string; session: Session | null; request: Req | null }

function fmt(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export default function LiveTimerChip({ initial }: { initial?: Kid[] }) {
  const [kids, setKids] = useState<Kid[]>(initial ?? [])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    // A fixture render (the reference pages) never polls: it shows what it
    // was handed, so the sample look reviews without live data.
    if (initial) return
    let live = true
    const load = () => {
      fetch('/api/quests/time/active')
        .then(r => r.json())
        .then(d => { if (live) setKids(d.children ?? []) })
        .catch(() => {})
    }
    load()
    const id = setInterval(load, 30000)
    return () => { live = false; clearInterval(id) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const running = kids.filter(k => k.session && new Date(k.session.ends_at).getTime() > now)
  const asking = kids.filter(k => k.request && !k.session)

  // Tick the countdown every second only while something is running.
  useEffect(() => {
    if (kids.every(k => !k.session)) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [kids])

  if (running.length === 0 && asking.length === 0) return null

  return (
    <div style={{ display: 'grid', gap: '8px', marginBottom: '14px' }}>
      <style>{`
        @keyframes gc-live-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
        .gc-live-dot { animation: gc-live-dot 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .gc-live-dot { animation: none; } }
      `}</style>

      {running.map(k => (
        <Link key={k.id} href="/dashboard/quests" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '11px',
            background: '#E8F4EE', border: '1.5px solid #2F8F6B',
            borderRadius: '14px', padding: '10px 14px',
          }}>
            <span aria-hidden className="gc-live-dot" style={{ width: 9, height: 9, borderRadius: '50%', background: '#2F8F6B', flexShrink: 0 }} />
            <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-body)', fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {deviceEmoji(k.session!.device)} {k.name} has time running
            </span>
            <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: '#236F52', fontVariantNumeric: 'tabular-nums' }}>
              {fmt(new Date(k.session!.ends_at).getTime() - now)}
            </span>
            <span aria-hidden style={{ color: 'var(--ink-muted)', fontWeight: 800, flexShrink: 0 }}>›</span>
          </div>
        </Link>
      ))}

      {asking.map(k => (
        <Link key={k.id} href="/dashboard/quests" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '11px',
            background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
            borderRadius: '14px', padding: '10px 14px',
          }}>
            <span aria-hidden style={{ fontSize: '16px', flexShrink: 0 }}>🙋</span>
            <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-body)', fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {k.name} is asking for {k.request!.minutes} min on the {deviceLabel(k.request!.device)}
            </span>
            <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--terracotta-dark)', whiteSpace: 'nowrap' }}>
              Answer →
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
