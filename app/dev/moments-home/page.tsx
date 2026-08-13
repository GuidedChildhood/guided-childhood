import MomentsToday from '@/components/home/MomentsToday'

// Layout fixture for the day timeline in its new home.
//
// Justin, 13 August 2026: "the timeline is orphaned." It was mounted only at
// the end of the daily deck, which needs a finished deck and a session to
// reach, so the one state that matters, a parent opening Home in the morning
// with the day ahead of them, could not be looked at by anybody.
//
// Both states are drawn: nothing flagged yet, and the day already answered.
//
// 404s in production via middleware, like every other dev page.

export const dynamic = 'force-dynamic'

export default function RefMomentsHome() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: 20 }}>
        <p className="eyebrow" style={{ color: 'var(--ink-muted)', margin: '0 0 14px' }}>
          Reference · nothing flagged yet
        </p>
        <MomentsToday savedToday={[]} />

        <p className="eyebrow" style={{ color: 'var(--ink-muted)', margin: '26px 0 14px' }}>
          Reference · already answered today
        </p>
        <MomentsToday savedToday={['bedtime', 'come_off']} />
      </div>
    </div>
  )
}
