import Link from 'next/link'

// A Watch together time on Home (migration 400). Two states only:
//   soon    the booking is in the next hour, or happening now
//   missed  yesterday's booked time passed unwatched: one line, pick a new time
//
// Its own card rather than a turn in lib/home/next-up.ts, because next up only
// draws once the day's habit is ticked, and a reminder for 5pm that only shows
// to a parent who has already finished their day is not a reminder. It is an
// event, like the school window card, not a suggestion competing for the lead.
// Never a streak, never "you missed it" in red: a missed time is just a time
// to pick again.

export default function WatchBookingCard({ state, title, childName, when, href }: {
  state: 'soon' | 'missed'
  title: string
  childName: string | null
  /** "today at 5pm", already in words. */
  when: string
  href: string
}) {
  const who = childName ?? 'your child'
  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block', marginBottom: '22px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', background: 'var(--cream)', border: 'var(--edge)', boxShadow: 'var(--lift)', borderRadius: 'var(--radius-card)', padding: '18px 20px' }}>
        <span aria-hidden style={{ flexShrink: 0, width: 52, height: 52, borderRadius: '15px', background: 'var(--white)', border: 'var(--edge)', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-2xl)' }}>🍿</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dark)', marginBottom: '4px' }}>
            {state === 'soon' ? 'Watch together' : 'Pick a new time'}
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.25 }}>
            {title}
          </span>
          <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: '4px' }}>
            {state === 'soon'
              ? `With ${who}, ${when}. It is waiting on their page.`
              : `The time with ${who} slipped by. It happens. Tap to pick another.`}
          </span>
        </span>
      </div>
    </Link>
  )
}
