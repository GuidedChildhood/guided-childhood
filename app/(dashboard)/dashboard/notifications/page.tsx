import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NotificationCard from '@/components/notifications/NotificationCard'
import { getNotifications } from '@/lib/notifications/collect'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Notifications — Guided Childhood' }

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { items, urgentCount } = await getNotifications(supabase, user.id)
  const urgent = items.filter(n => n.urgent)
  const rest = items.filter(n => !n.urgent)
  const bothGroups = urgent.length > 0 && rest.length > 0

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '26px 20px 48px' }}>
      <div style={{ marginBottom: '22px' }}>
        <p className="eyebrow" style={{ marginBottom: '5px' }}>What has popped up</p>
        <h1 style={{ fontSize: 'clamp(1.7rem, 5vw, 2.15rem)', marginBottom: '8px' }}>Notifications</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '15.5px', lineHeight: 1.6 }}>
          {items.length === 0
            ? 'Nothing needs you right now.'
            : `${items.length} thing${items.length === 1 ? '' : 's'} here${urgentCount > 0 ? `, ${urgentCount} waiting on you` : ''}. Tap any one to act on it.`}
        </p>
      </div>

      {items.length === 0 ? (
        <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '20px', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.4rem', marginBottom: '10px' }}>🎉</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--ink)', marginBottom: '6px' }}>
            You are all caught up
          </div>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-muted)', lineHeight: 1.6, margin: 0 }}>
            When a child ticks a quest, pitches an idea, or DiGi spots something, it lands here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
          {bothGroups && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B93B3F', margin: '2px 2px 0' }}>
              Waiting on you
            </p>
          )}
          {urgent.map(n => <NotificationCard key={n.id} n={n} />)}
          {bothGroups && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '10px 2px 0' }}>
              Also here
            </p>
          )}
          {rest.map(n => <NotificationCard key={n.id} n={n} />)}
        </div>
      )}
    </div>
  )
}
