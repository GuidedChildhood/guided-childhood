import ConcernCheckIn, { type ConcernCheckItem } from '@/components/daily/ConcernCheckIn'

// Dev fixture for the check in slider: one concern with a last score to show
// the ghost marker and verdict, one first timer without. Posts will 401 here,
// which is fine, the fixture is for eyes and thumbs, not data.
//
// THREE, not two, since 11 August 2026. The card gained a gentle scroll to the
// next unanswered row when one is finished, and with two rows both fit on a
// phone at once, so the handover has nowhere to go and the fixture would have
// certified a feature it could not show. Three is enough that the third sits
// off screen on a 390 wide phone, which is the case worth looking at.
//
// ── AND WHY THE FOURTH ROW IS BEHIND A QUERY (10 September 2026) ────────────
//
// The DiGi raised row was added here as a fourth and it turned CI red inside a
// minute. scripts/check-concern-dots drives THIS page and asserts on the three:
// it waits for exactly three hydrated groups, reads the run counter as "1 of
// 3", and holds the whole card under 1200px so the list stays one ordinary
// scroll. Every one of those is a real rule about the shipped design, and
// loosening three of them so a demo row could sit on the default page would
// have been the fixture quietly editing the guard.
//
//   /dev/concern-scale        the three the guard drives. Unchanged.
//   /dev/concern-scale?new=1  plus the worry raised with DiGi yesterday, which
//                             says where it came from and, once answered,
//                             folds to its two next moves.

export default async function ConcernScaleFixture({
  searchParams,
}: { searchParams: Promise<{ new?: string }> }) {
  const { new: showNew } = await searchParams
  const dayAgo = new Date(Date.now() - 86400000).toISOString()

  const rows: ConcernCheckItem[] = [
    // One low, so the ring sits at the bottom of the five. One with no
    // history at all, so nothing is ringed. And one carrying an ODD legacy
    // score from the ten point scale, which must still ring the right word
    // rather than nothing: 7 is "getting there", the fourth band.
    { id: 'fixture-online-safety', slug: 'online-safety', label: 'Online safety', timesFlagged: 2, lastFlaggedAt: dayAgo, lastScore: 3, childName: 'Teo' },
    { id: 'fixture-staying-asleep', slug: 'staying-asleep', label: 'Staying asleep', timesFlagged: 1, lastFlaggedAt: dayAgo, lastScore: null, childName: 'Teo' },
    { id: 'fixture-phone-handover', slug: 'rightnow-phone-handover', label: 'Phone handover fight', timesFlagged: 4, lastFlaggedAt: dayAgo, lastScore: 6, childName: 'Olga' },
  ]

  if (showNew) {
    rows.push({
      id: 'fixture-from-digi', slug: 'gaming-at-night', label: 'Gaming late at night',
      timesFlagged: 1, lastFlaggedAt: dayAgo, lastScore: null, childName: 'Olga',
      source: 'digi', isNew: true,
    })
  }

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <ConcernCheckIn lastNight={{ sortOrder: 107, title: 'The bedtime handover' }} concerns={rows} />
      </div>
    </div>
  )
}
