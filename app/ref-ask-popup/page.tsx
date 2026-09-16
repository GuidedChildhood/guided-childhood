import AskPopup from '@/components/quests/AskPopup'

// Layout fixture for the parent's screen time ask pop up. 404s in production
// via middleware, like every other ref-* page.
//
// ?bedtime=1 is the case Justin asked for on 16 September: the ask arrives at
// five to nine, the parent is doing something else, and the yes lands inside
// the window where screens are meant to be resting. Without the flag the same
// pop up renders as it always did, so the two can be compared side by side and
// the warning can be seen NOT to appear when it should not.
//
// It mounts the real AskPopup, which is the point: the warning reads a field
// off the live feed, and a fixture that reimplemented the card would prove
// nothing about the card a parent is actually looking at.

export default async function RefAskPopup({
  searchParams,
}: { searchParams: Promise<{ bedtime?: string }> }) {
  const { bedtime } = await searchParams

  return (
    <main style={{ background: 'var(--butter)', minHeight: '100vh' }}>
      <AskPopup initial={[{
        id: 'c1',
        name: 'Bumble',
        balance: 6,
        starMinutes: 5,
        session: null,
        request: { id: 'r1', device: 'tv', minutes: 30, deviceName: null },
        protectedNow: bedtime === '1' ? { reason: 'bedtime', label: 'Screens are meant to be resting' } : null,
      }]} />
    </main>
  )
}
