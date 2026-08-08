import ConcernCheckIn from '@/components/daily/ConcernCheckIn'

// Dev fixture for the check in slider: one concern with a last score to show
// the ghost marker and verdict, one first timer without. Posts will 401 here,
// which is fine, the fixture is for eyes and thumbs, not data.

export default function ConcernScaleFixture() {
  const dayAgo = new Date(Date.now() - 86400000).toISOString()
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <ConcernCheckIn concerns={[
          { slug: 'online-safety', label: 'Online safety', timesFlagged: 2, lastFlaggedAt: dayAgo, lastScore: 3 },
          { slug: 'staying-asleep', label: 'Staying asleep', timesFlagged: 1, lastFlaggedAt: dayAgo, lastScore: null },
        ]} />
      </div>
    </div>
  )
}
