import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { getNotifications, type Notification } from '@/lib/notifications/collect'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Notifications — Guided Childhood' }

const KIND_LABEL: Record<Notification['kind'], string> = {
  approve: 'Approve', ask: 'A request', digi: 'DiGi', school: 'School', device: 'Device time',
}

// The affordance on each card. The whole card is the link, so this reads as a
// clear next action rather than a faint arrow, which is what made the old
// list feel flat.
function ctaLabel(n: Notification): string {
  if (n.kind === 'approve') return 'Approve the stars'
  if (n.kind === 'ask') return 'See the request'
  if (n.kind === 'device') return 'See the timer'
  if (n.kind === 'school') return 'Open school'
  if (n.kind === 'digi') return n.href.includes('/lessons') ? 'Open Lessons' : 'Talk it through'
  return 'Open'
}

function Card({ n }: { n: Notification }) {
  const isDigi = n.kind === 'digi'
  return (
    <Link
      href={n.href}
      style={{
        display: 'block', textDecoration: 'none',
        background: '#fff',
        border: `1.5px solid ${n.urgent ? '#E5484D' : 'var(--border)'}`,
        borderRadius: '20px', padding: '18px 18px 16px',
        boxShadow: n.urgent ? '0 6px 22px rgba(229,72,77,0.14)' : '0 3px 14px rgba(26,26,46,0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '13px', marginBottom: '11px' }}>
        <span style={{
          flexShrink: 0, width: 48, height: 48, borderRadius: '14px',
          background: n.urgent ? '#FDECEC' : isDigi ? 'var(--terracotta-lt)' : 'var(--cream)',
          border: isDigi ? '1.5px solid var(--terracotta)' : '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
        }}>
          {isDigi ? <DigiCharacter mood="speak" size={32} /> : n.icon}
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

      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        background: n.urgent ? '#E5484D' : 'var(--terracotta)',
        color: n.urgent ? '#fff' : 'var(--ink)',
        borderRadius: '13px', padding: '10px 16px',
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px',
        boxShadow: n.urgent ? '0 4px 0 #B93B3F' : '0 4px 0 var(--terracotta-dark)',
      }}>
        {ctaLabel(n)}
        <span style={{ fontSize: '15px' }} aria-hidden>→</span>
      </span>
    </Link>
  )
}

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
          {urgent.map(n => <Card key={n.id} n={n} />)}
          {bothGroups && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '10px 2px 0' }}>
              Also here
            </p>
          )}
          {rest.map(n => <Card key={n.id} n={n} />)}
        </div>
      )}
    </div>
  )
}
