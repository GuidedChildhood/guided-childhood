import TodayPathBig from '@/components/daily/TodayPathBig'
import { friendOfTheDay } from '@/lib/pathway/friend-of-the-day'

// Dev fixture for the bonus that hangs beside today's loop.
//
// Justin: "can these go on the right of the green line to do today, sparking
// and bouncing as a bonus like Duolingo."
//
// The real Home needs a signed in family, so this is the only way to check the
// thing that actually goes wrong: whether a 58px coin at the right edge touches
// a node that has meandered the same way, at 390 wide.

// A FAMILY ON DAY ONE, which is the longest the road ever gets: check in,
// setup, moment, script, quests, meet DiGi, done. Seven nodes rather than the
// five this fixture used to draw, and the widest case is the one worth
// checking, because the bonus coin has to clear a node that has meandered to
// the right at 390 wide.
// The lead flag rides on the first rung, matching what the engine now marks:
// one main tick makes the day (September 2026), the rest sit under the "also
// today" seam. The fixture keeps day one's longest road so the coin clearance
// check still means something.
const TASKS = [
  { key: 'setup' as const, label: 'Set up', href: '#', done: false, lead: true },
  { key: 'checkin' as const, label: 'Where things are now', href: '#', done: false },
  { key: 'moment' as const, label: 'Moment', href: '#', done: false },
  { key: 'script' as const, label: 'Script', href: '#', done: false },
  { key: 'quests' as const, label: 'First job', href: '#', done: false },
  { key: 'digi' as const, label: 'Meet DiGi', href: '#', done: false },
  { key: 'done' as const, label: 'Done', href: '#', done: false },
]

export default function TodayBonusFixture() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '20px 16px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <TodayPathBig tasks={TASKS} childName="Teo" streakCount={3} bonus={friendOfTheDay()} />
      </div>
    </div>
  )
}
