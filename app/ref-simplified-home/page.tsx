import TodayPathBig from '@/components/daily/TodayPathBig'
import DigiGreeting from '@/components/home/DigiGreeting'
import HomeRows from '@/components/home/HomeRows'
import LiveTimerChip from '@/components/home/LiveTimerChip'
import type { TodayLoopTask } from '@/lib/pathway/daily-tasks'

// REFERENCE ONLY, never linked from the app. The REAL components of the
// simplified Home rendered with fixture props, so the new shape can be
// screenshotted and reviewed without live data. The big road renders at
// /ref-simplified-home/road. Delete this route once the direction is agreed.

const TASKS: TodayLoopTask[] = [
  { key: 'checkin', label: 'Check in', href: '#', done: true },
  { key: 'moment', label: 'Moment', href: '#', done: true },
  { key: 'script', label: 'Script', href: '#', done: false },
  { key: 'digi', label: 'DiGi', href: '#', done: false },
  { key: 'done', label: 'Done', href: '#', done: false },
]

export default function RefSimplifiedHome() {
  const endsAt = new Date(Date.now() + 17 * 60000 + 12000).toISOString()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 60px' }}>
        <DigiGreeting
          firstName="Justin"
          childName="Teo"
          stageName="Builder"
          stageNum={2}
          minutesLeft={5}
          dayDone={false}
          streakCount={6}
          aliveToday
        />
        <LiveTimerChip initial={[
          { id: 'k1', name: 'Teo', session: { device: 'console', minutes: 30, ends_at: endsAt }, request: null },
        ]} />
        <TodayPathBig tasks={TASKS} dailyMinutes={10} childName="Teo" streakCount={6} />
        <HomeRows
          stageName="Builder"
          stageNum={2}
          handoverChildName="Teo"
          isSunday
          initialToApprove={2}
        />
      </div>
    </div>
  )
}
