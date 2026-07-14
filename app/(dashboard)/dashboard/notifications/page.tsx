import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getNotifications, type Notification } from '@/lib/notifications/collect'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Notifications — Guided Childhood' }

const KIND_LABEL: Record<Notification['kind'], string> = {
  approve: 'Approve', ask: 'A request', digi: 'DiGi', school: 'School', device: 'Device time',
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { items, urgentCount } = await getNotifications(supabase, user.id)

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 48px' }}>
      <div style={{ marginBottom: '18px' }}>
        <p className="eyebrow" style={{ marginBottom: '4px' }}>What has popped up</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '6px' }}>Notifications</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '14px', lineHeight: 1.6 }}>
          {items.length === 0
            ? 'Nothing needs you right now.'
            : `${items.length} thing${items.length === 1 ? '' : 's'} here${urgentCount > 0 ? `, ${urgentCount} waiting on you` : ''}. Tap any one to act on it.`}
        </p>
      </div>

      {items.length === 0 ? (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '34px 22px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--ink)', marginBottom: '4px' }}>
            You are all caught up
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--ink-muted)', lineHeight: 1.55, margin: 0 }}>
            When a child ticks a quest, pitches an idea, or DiGi spots something, it lands here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map(n => (
            <Link key={n.id} href={n.href} style={{
              display: 'flex', alignItems: 'flex-start', gap: '13px', textDecoration: 'none',
              background: '#fff', border: `1.5px solid ${n.urgent ? '#E5484D' : 'var(--border)'}`,
              borderRadius: '16px', padding: '14px 16px',
              boxShadow: n.urgent ? '0 4px 16px rgba(229,72,77,0.12)' : '0 2px 10px rgba(26,26,46,0.04)',
            }}>
              <span style={{
                flexShrink: 0, width: 42, height: 42, borderRadius: '12px',
                background: n.urgent ? '#FDECEC' : 'var(--cream)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
              }}>{n.icon}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: n.urgent ? '#B93B3F' : 'var(--ink-muted)' }}>
                    {KIND_LABEL[n.kind]}
                  </span>
                  {n.urgent && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E5484D', display: 'inline-block' }} />}
                </span>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.25, marginBottom: '2px' }}>
                  {n.title}
                </span>
                <span style={{ display: 'block', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                  {n.body}
                </span>
              </span>
              <span style={{ flexShrink: 0, alignSelf: 'center', fontSize: '15px', color: 'var(--ink-light)' }}>→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
