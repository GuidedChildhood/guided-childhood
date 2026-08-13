import ConcernCheckIn from '@/components/daily/ConcernCheckIn'

// Layout fixture for the FIRST ever check in, the baseline.
//
// The state it draws is the one nobody on the team can reach any more: a
// family with no history at all, on the worries they named in the wizard, with
// no last time to compare against and no red ring on any row. Every existing
// account has been checking in for weeks, so this shape has never once been
// looked at, which is exactly how the "Still on the list" heading survived
// being shown to somebody on their first morning.
//
// Both cases are drawn, baseline above and the familiar running card below, so
// the difference between them is the thing under review rather than something
// to hold in mind across two page loads.
//
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

// The two the wizard maps onto the ledger. A baseline never has a lastScore,
// which is the case that matters here.
const BASELINE = [
  { slug: 'wont-put-down', label: 'Will not put it down', timesFlagged: 1, lastFlaggedAt: new Date().toISOString(), lastScore: null },
  { slug: 'bedtime-screens', label: 'Bedtime screens', timesFlagged: 1, lastFlaggedAt: new Date().toISOString(), lastScore: null },
]

const RUNNING = [
  { slug: 'morning-tv', label: 'Morning TV', timesFlagged: 6, lastFlaggedAt: new Date(Date.now() - 6 * 86400000).toISOString(), lastScore: 6 },
  { slug: 'mood-after-screens', label: 'Mood after screens', timesFlagged: 3, lastFlaggedAt: new Date(Date.now() - 2 * 86400000).toISOString(), lastScore: 8 },
]

export default function RefBaselineCheckIn() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: 20 }}>
        <p className="eyebrow" style={{ color: 'var(--ink-muted)', margin: '0 0 14px' }}>
          Reference · the first check in
        </p>
        <ConcernCheckIn baseline concerns={BASELINE} />

        <p className="eyebrow" style={{ color: 'var(--ink-muted)', margin: '26px 0 14px' }}>
          Reference · every check in after that
        </p>
        <ConcernCheckIn concerns={RUNNING} />
      </div>
    </div>
  )
}
