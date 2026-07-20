import TodayPathBig from '@/components/daily/TodayPathBig'
import DigiGreeting from '@/components/home/DigiGreeting'
import HomeRows from '@/components/home/HomeRows'
import LiveTimerChip from '@/components/home/LiveTimerChip'
import ExploreGrid from '@/components/home/ExploreGrid'
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

        {/* On the real home this grid sits folded behind the See everything
            we do row; shown open here so the whole section reviews at once. */}
        <details open style={{ marginTop: '10px' }}>
          <summary style={{
            display: 'flex', alignItems: 'center', gap: '13px', cursor: 'pointer',
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px',
            padding: '14px 15px', boxShadow: '0 3px 0 rgba(26,26,46,0.05)', listStyle: 'none', marginBottom: '16px',
          }}>
            <span style={{ width: 50, height: 50, borderRadius: '14px', background: 'var(--terracotta-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>🧭</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--ink)', lineHeight: 1.2 }}>See everything we do</span>
              <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-muted)', marginTop: '3px' }}>Every part of the platform, one tap away</span>
            </span>
            <span aria-hidden style={{ color: 'var(--ink-muted)', fontWeight: 800, flexShrink: 0 }}>›</span>
          </summary>
          <ExploreGrid />
        </details>
      </div>
    </div>
  )
}
