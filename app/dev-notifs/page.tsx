import Link from 'next/link'
import type { Notification } from '@/lib/notifications/collect'

const items: Notification[] = [
  { id: '1', kind: 'approve', icon: '✅', urgent: true, title: 'Teo finished a quest', body: '🛏️ Tidy your bedroom · tap to land the stars', href: '#', at: '' },
  { id: '2', kind: 'ask', icon: '💡', urgent: false, title: 'Teo asked for something', body: '🚗 Wash the car', href: '#', at: '' },
  { id: '3', kind: 'ask', icon: '🖨️', urgent: false, title: 'Teo asked for something', body: '🖨️ Print the My Rainy Day Bucket List sheet', href: '#', at: '' },
  { id: '4', kind: 'digi', icon: '◎', urgent: false, title: 'Screens and sleep this week', body: 'Two low sleep weeks in a row. A screens off hour before bed is the single biggest lever right now.', href: '#', at: '' },
  { id: '5', kind: 'school', icon: '🏫', urgent: false, title: 'PE kit needed Thursday', body: 'From school · due 2026-07-17', href: '#', at: '' },
]
const KIND_LABEL: Record<Notification['kind'], string> = { approve: 'Approve', ask: 'A request', digi: 'DiGi', school: 'School', device: 'Device time' }

export default function DevNotifs() {
  const urgentCount = items.filter(i => i.urgent).length
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 48px', background: 'var(--cream)', minHeight: '100dvh' }}>
      <p className="eyebrow" style={{ marginBottom: 4 }}>What has popped up</p>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 6 }}>Notifications</h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
        {items.length} things here, {urgentCount} waiting on you. Tap any one to act on it.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(n => (
          <Link key={n.id} href={n.href} style={{ display: 'flex', alignItems: 'flex-start', gap: 13, textDecoration: 'none', background: '#fff', border: `1.5px solid ${n.urgent ? '#E5484D' : 'var(--border)'}`, borderRadius: 16, padding: '14px 16px', boxShadow: n.urgent ? '0 4px 16px rgba(229,72,77,0.12)' : '0 2px 10px rgba(26,26,46,0.04)' }}>
            <span style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 12, background: n.urgent ? '#FDECEC' : 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{n.icon}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: n.urgent ? '#B93B3F' : 'var(--ink-muted)' }}>{KIND_LABEL[n.kind]}</span>
                {n.urgent && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E5484D', display: 'inline-block' }} />}
              </span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--ink)', lineHeight: 1.25, marginBottom: 2 }}>{n.title}</span>
              <span style={{ display: 'block', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.45 }}>{n.body}</span>
            </span>
            <span style={{ flexShrink: 0, alignSelf: 'center', fontSize: 15, color: 'var(--ink-light)' }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
