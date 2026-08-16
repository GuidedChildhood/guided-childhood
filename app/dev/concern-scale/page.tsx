import ConcernCheckIn from '@/components/daily/ConcernCheckIn'

// Dev fixture for the check in slider: one concern with a last score to show
// the ghost marker and verdict, one first timer without. Posts will 401 here,
// which is fine, the fixture is for eyes and thumbs, not data.
//
// THREE, not two, since 11 August 2026. The card gained a gentle scroll to the
// next unanswered row when one is finished, and with two rows both fit on a
// phone at once, so the handover has nowhere to go and the fixture would have
// certified a feature it could not show. Three is enough that the third sits
// off screen on a 390 wide phone, which is the case worth looking at.

export default function ConcernScaleFixture() {
  const dayAgo = new Date(Date.now() - 86400000).toISOString()
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <ConcernCheckIn concerns={[
          // One low, so the ring sits at the bottom of the five. One with no
          // history at all, so nothing is ringed. And one carrying an ODD legacy
          // score from the ten point scale, which must still ring the right word
          // rather than nothing: 7 is "getting there", the fourth band.
          { id: 'fixture-online-safety', slug: 'online-safety', label: 'Online safety', timesFlagged: 2, lastFlaggedAt: dayAgo, lastScore: 3, childName: 'Teo' },
          { id: 'fixture-staying-asleep', slug: 'staying-asleep', label: 'Staying asleep', timesFlagged: 1, lastFlaggedAt: dayAgo, lastScore: null, childName: 'Teo' },
          { id: 'fixture-phone-handover', slug: 'rightnow-phone-handover', label: 'Phone handover fight', timesFlagged: 4, lastFlaggedAt: dayAgo, lastScore: 6, childName: 'Olga' },
        ]} />
      </div>
    </div>
  )
}
