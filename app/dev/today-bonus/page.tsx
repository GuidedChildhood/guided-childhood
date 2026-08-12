import TodayPathBig from '@/components/daily/TodayPathBig'
import { planetOfTheWeek } from '@/lib/pathway/planets'

// Dev fixture for the bonus that hangs beside today's loop.
//
// Justin: "can these go on the right of the green line to do today, sparking
// and bouncing as a bonus like Duolingo."
//
// The real Home needs a signed in family, so this is the only way to check the
// thing that actually goes wrong: whether a 58px coin at the right edge touches
// a node that has meandered the same way, at 390 wide.

const TASKS = [
  { key: 'checkin' as const, label: 'Check in', href: '#', done: true },
  { key: 'moment' as const, label: 'Moment', href: '#', done: true },
  { key: 'script' as const, label: 'Script', href: '#', done: false },
  { key: 'digi' as const, label: 'DiGi', href: '#', done: false },
  { key: 'done' as const, label: 'Done', href: '#', done: false },
]

export default function TodayBonusFixture() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '20px 16px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <TodayPathBig tasks={TASKS} childName="Teo" streakCount={3} bonusIndex={planetOfTheWeek()} />
      </div>
    </div>
  )
}
