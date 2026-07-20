import HomeGreeting from '@/components/daily/HomeGreeting'
import TodayTenCard from '@/components/daily/TodayTenCard'
import HomeSlimRows from '@/components/daily/HomeSlimRows'
import StageRoad from '@/components/pathway/StageRoad'
import RoadToSixteen from '@/components/pathway/RoadToSixteen'
import type { TodayLoopTask } from '@/lib/pathway/daily-tasks'

// REFERENCE ONLY, never linked from the app. The REAL simplified home
// components (HomeGreeting, TodayTenCard, HomeSlimRows) and the REAL
// enlarged road (StageRoad, MiniRoad via RoadToSixteen) rendered with
// fixture data, so the new home can be screenshotted without a database.
// Delete this route once the PR is approved.

const TASKS: TodayLoopTask[] = [
  { key: 'checkin', label: 'Check in', href: '#', done: true },
  { key: 'moment', label: 'Moment', href: '#', done: true },
  { key: 'script', label: 'Script', href: '#', done: false },
  { key: 'digi', label: 'DiGi', href: '#', done: false },
  { key: 'done', label: 'Done', href: '#', done: false },
]

export default function RefSimplifiedHome() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      {/* The simplified home, exactly as the dashboard composes it */}
      <div id="home" style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
        <HomeGreeting
          firstName="Justin"
          childName="Teo"
          stageName="Builder"
          stageNum={2}
          minutes={10}
          dayDone={false}
          streakCount={6}
          aliveToday
        />
        <TodayTenCard tasks={TASKS} dailyMinutes={10} childName="Teo" streakCount={6} />
        <HomeSlimRows
          approveCount={2}
          stageName="Builder"
          stageNum={2}
          showRoundup
          handoverName="Teo"
        />
        <details className="gc-home-more" style={{ marginBottom: '20px' }}>
          <summary style={{
            display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px',
            padding: '13px 14px', boxShadow: '0 3px 0 rgba(26,26,46,0.05)', listStyle: 'none',
          }}>
            <span style={{ width: 38, height: 38, borderRadius: '12px', background: 'var(--terracotta-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px', flexShrink: 0 }}>🧺</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.2 }}>Everything else</span>
              <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-muted)', marginTop: '2px' }}>Moments, lessons, printables, school and more</span>
            </span>
            <span aria-hidden style={{ color: 'var(--ink-muted)', fontWeight: 800 }}>›</span>
          </summary>
        </details>
      </div>

      {/* The enlarged road, as the pathway page draws it */}
      <div id="road" style={{ maxWidth: '720px', margin: '0 auto', padding: '10px 20px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fff', border: '1.5px solid var(--terracotta)',
            borderRadius: '100px', padding: '8px 16px',
            boxShadow: '0 3px 0 var(--terracotta-dark)',
          }}>
            <span aria-hidden style={{ fontSize: 14 }}>🪪</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)' }}>
              Builder · stamp 2 of 5
            </span>
          </span>
        </div>
        <StageRoad currentStageNum={2} progressPct={40} childName="Teo" />
        <div style={{ marginTop: '20px' }}>
          <RoadToSixteen childName="Teo" stageId={2} streakCount={6} />
        </div>
      </div>
    </div>
  )
}
