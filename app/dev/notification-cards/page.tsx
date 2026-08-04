import NotificationCard from '@/components/notifications/NotificationCard'
import type { Notification } from '@/lib/notifications/collect'

// Layout harness for the notification cards. No auth and no feed: the four
// shapes side by side at a phone width, so the approve card can be checked
// without a child having to finish a job first. The buttons post for real, so
// this page is for looking rather than clicking.

const CASES: Notification[] = [
  {
    id: 'tick-11111111-1111-1111-1111-111111111111', kind: 'approve', icon: '✅', urgent: true,
    title: 'Teo finished a quest',
    body: '🛏️ Tidy your bedroom · tap to land the stars',
    href: '/dashboard/quests/manage', at: '2026-08-04',
  },
  {
    id: 'printable-22222222-2222-2222-2222-222222222222', kind: 'approve', icon: '🖍️', urgent: true,
    title: 'Alma finished a printable',
    body: '🎨 Under the sea colouring · tap to land the stars',
    href: '/dashboard/printables', at: '2026-08-04',
  },
  {
    id: 'ask-33333333-3333-3333-3333-333333333333', kind: 'ask', icon: '💡', urgent: false,
    title: 'Teo pitched a job',
    body: 'Wash the car for 3 stars',
    href: '/dashboard/quests/manage', at: '2026-08-04',
  },
  {
    id: 'school-44444444-4444-4444-4444-444444444444', kind: 'school', icon: '🏫', urgent: false,
    title: 'PE kit on Thursday',
    body: 'Every week, from the school newsletter',
    href: '/dashboard/school', at: '2026-08-04', recurring: true,
  },
]

export default function Page() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto', display: 'grid', gap: '14px' }}>
        {CASES.map(n => <NotificationCard key={n.id} n={n} />)}
      </div>
    </main>
  )
}
