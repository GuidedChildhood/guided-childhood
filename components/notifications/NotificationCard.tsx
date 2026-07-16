'use client'

import { useState } from 'react'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { NOTIFS_CHANGED_EVENT } from '@/components/dashboard/NotificationsBell'
import type { Notification } from '@/lib/notifications/collect'

// One notification card. A DiGi nudge is an informational step in, so opening
// it counts as handled: on tap it marks the prompt read (keepalive, so it
// lands even as the page navigates away) and it is gone from the bell next
// time. A school reminder clears right here without leaving the page: a weekly
// routine is cleared for the week (acknowledged, kept for next time), a one off
// is cleared for good. The others (approve, a child's ask) clear when the
// parent actually does the thing on the target page, not on a stray tap.

const KIND_LABEL: Record<Notification['kind'], string> = {
  approve: 'Approve', ask: 'A request', digi: 'DiGi', school: 'School', device: 'Device time',
}

function ctaLabel(n: Notification): string {
  if (n.kind === 'approve') return 'Approve the stars'
  if (n.kind === 'ask') return 'See the request'
  if (n.kind === 'device') return 'See the timer'
  if (n.kind === 'digi') return n.href.includes('/printables') ? 'Open Printables' : n.href.includes('/lessons') ? 'Open Lessons' : 'Talk it through'
  return 'Open'
}

function notifsChanged() {
  try { window.dispatchEvent(new Event(NOTIFS_CHANGED_EVENT)) } catch { /* SSR safety */ }
}

function CardShell({ n, children }: { n: Notification; children: React.ReactNode }) {
  const isDigi = n.kind === 'digi'
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '13px', marginBottom: '11px' }}>
        <span style={{
          flexShrink: 0, width: 48, height: 48, borderRadius: '14px',
          background: n.urgent ? '#FDECEC' : isDigi ? 'var(--terracotta-lt)' : 'var(--cream)',
          border: isDigi ? '1.5px solid var(--terracotta)' : '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
        }}>
          {isDigi ? <DigiCharacter mood="speak" size={32} once /> : n.icon}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: n.urgent ? '#B93B3F' : 'var(--terracotta-dark)' }}>
              {KIND_LABEL[n.kind]}
            </span>
            {n.urgent && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E5484D', display: 'inline-block' }} />}
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', lineHeight: 1.3, marginTop: '3px' }}>
            {n.title}
          </span>
        </span>
      </div>
      <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.62, margin: '0 0 14px' }}>
        {n.body}
      </p>
      {children}
    </>
  )
}

const cardStyle = (n: Notification): React.CSSProperties => ({
  display: 'block', textDecoration: 'none', background: '#fff',
  border: `1.5px solid ${n.urgent ? '#E5484D' : 'var(--border)'}`,
  borderRadius: '20px', padding: '18px 18px 16px',
  boxShadow: n.urgent ? '0 6px 22px rgba(229,72,77,0.14)' : '0 3px 14px rgba(26,26,46,0.05)',
})

const pill = (n: Notification): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: '7px',
  background: n.urgent ? '#E5484D' : 'var(--terracotta)', color: n.urgent ? '#fff' : 'var(--ink)',
  borderRadius: '13px', padding: '10px 16px', border: 'none', cursor: 'pointer',
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
  boxShadow: n.urgent ? '0 4px 0 #B93B3F' : '0 4px 0 var(--terracotta-dark)',
})

export default function NotificationCard({ n }: { n: Notification }) {
  const [cleared, setCleared] = useState(false)
  const [busy, setBusy] = useState(false)
  if (cleared) return null

  // School reminders clear in place. A weekly routine is acknowledged for the
  // week and kept; a one off is done for good. Either way the card folds away
  // and the bell re-counts at once.
  if (n.kind === 'school') {
    const id = n.id.replace(/^school-/, '')
    const clearIt = async () => {
      if (busy) return
      setBusy(true)
      setCleared(true)
      notifsChanged()
      try {
        await fetch('/api/school/actions', {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(n.recurring ? { id, clear_today: true } : { id, status: 'done' }),
        })
      } catch { /* the card is already gone locally, it reconciles on reload */ }
    }
    return (
      <div style={cardStyle(n)}>
        <CardShell n={n}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={clearIt} disabled={busy} style={pill(n)}>
              {n.recurring ? 'Clear for this week ✓' : 'Got it, clear ✓'}
            </button>
            <Link href="/dashboard/school" style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', fontWeight: 700, color: 'var(--ink-muted)', textDecoration: 'none' }}>
              Open school
            </Link>
          </div>
        </CardShell>
      </div>
    )
  }

  // Everything else: the whole card is the link. A DiGi nudge marks itself
  // acted as it opens, so it clears from the bell.
  const isDigi = n.kind === 'digi'
  const onClick = () => {
    if (!isDigi) return
    const id = n.id.replace(/^digi-/, '')
    try {
      fetch('/api/digi/prompts', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'acted' }), keepalive: true,
      }).catch(() => {})
      notifsChanged()
    } catch { /* clearing is best effort, the link still opens */ }
  }

  return (
    <Link href={n.href} onClick={onClick} style={cardStyle(n)}>
      <CardShell n={n}>
        <span style={pill(n)}>
          {ctaLabel(n)}
          <span style={{ fontSize: '15px' }} aria-hidden>→</span>
        </span>
      </CardShell>
    </Link>
  )
}
