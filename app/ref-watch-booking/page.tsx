'use client'

import WatchBookingPanel from '@/components/lessons/WatchBookingPanel'
import WatchTimeCard from '@/components/kid/WatchTimeCard'
import WatchBookingCard from '@/components/home/WatchBookingCard'

// Layout fixture for Watch together booking (migration 400): the parent's
// panel unbooked and booked, Home's two cards, and the child's film card, all
// the real components with made up data. The booking routes need a parent
// session, so the browser check stubs /api/watch-bookings with Playwright.
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

const soon = new Date(Date.now() + 40 * 60000)
soon.setUTCMinutes(Math.ceil(soon.getUTCMinutes() / 15) * 15, 0, 0)

export default function RefWatchBooking() {
  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '22px 16px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <p className="eyebrow">Parent, film page, nothing booked</p>
        <WatchBookingPanel childId="00000000-0000-0000-0000-000000000001" childName="Bumble" lessonCode="1.6"
          title="Screens go to bed first" initial={null} filmUrl="https://www.guidedchildhood.com/dashboard/lessons/together/1.6" />

        <p className="eyebrow">Parent, film page, booked</p>
        <WatchBookingPanel childId="00000000-0000-0000-0000-000000000001" childName="Bumble" lessonCode="1.6"
          title="Screens go to bed first" initial={{ id: '00000000-0000-0000-0000-0000000000b1', starts_at: soon.toISOString(), buzz_child: true }}
          filmUrl="https://www.guidedchildhood.com/dashboard/lessons/together/1.6" />

        <p className="eyebrow">Home, soon</p>
        <WatchBookingCard state="soon" title="Screens go to bed first" childName="Bumble" when="today at 5pm" href="#" />
        <p className="eyebrow">Home, missed yesterday</p>
        <WatchBookingCard state="missed" title="Screens go to bed first" childName="Bumble" when="yesterday" href="#" />

        <p className="eyebrow">Child, at the booked time</p>
        <div style={{ maxWidth: 420 }}>
          <WatchTimeCard token="000000000000000000" grownUp="Mum" watch={{ code: '1.6', title: 'Screens go to bed first', posterUrl: null }} />
        </div>
      </div>
    </main>
  )
}
