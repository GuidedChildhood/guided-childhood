import { NextOnTheApplication, StrandCards, buildStrands, nextTask } from '@/components/passport/Application'
import BalanceZone, { type DayDot } from '@/components/passport/BalanceZone'
import type { ParentReport } from '@/lib/balance/parent-report'
import { stagePace, paceLine } from '@/lib/pathway/pace'
import type { ChecklistSection } from '@/components/pathway/PassportStamps'
import type { StageProgress } from '@/lib/pathway/progress'

// Fixture reference page: the passport application's bands one and two, the
// REAL components with made up rows, so the reshape can be seen and
// screenshotted without a logged in parent. Not linked from anywhere; 404s in
// production via middleware like every ref- page.
//
// ?done=1 shows the all strands green state where the rail offers the check.
// ?behind=1 shows the behind pace timeline voice.

export const dynamic = 'force-dynamic'

const SECTIONS: ChecklistSection[] = [
  { key: 'devices', emoji: '🔧', label: 'Devices set up', pct: 100, detail: 'All set', href: '/dashboard/devices?from=passport', help: '' },
  { key: 'moments', emoji: '💬', label: 'Moments to resolve', pct: 50, detail: '1 open', href: '/dashboard/pathway#working-on', help: '' },
  { key: 'lessons', emoji: '📚', label: 'Lessons and tests', pct: 40, detail: '6 of 15', href: '/dashboard/lessons?stage=3&from=passport', help: '' },
  { key: 'jobs', emoji: '⭐', label: 'Jobs and routines', pct: 100, detail: 'On track', href: '/dashboard/quests?from=passport', help: '', ongoing: true },
  { key: 'balance', emoji: '⚖️', label: 'Screen balance', pct: 100, detail: 'Healthy this week', href: '/dashboard/stats?from=passport', help: '', ongoing: true },
]

const PROGRESS: StageProgress = {
  scriptsPct: 26, streakPct: 75, devicesPct: 100, lessonsPct: 40,
  lessonsDone: 6, lessonsTotal: 15, scriptsDone: 12, scriptsTotal: 47,
  overallPct: 47, contentComplete: false,
}

const REPORT_GREEN = {
  childName: 'Teo', bandLabel: 'Ages 11 to 13', totalWeekMins: 540, healthyWeekMins: 1260,
  status: 'healthy', topState: null as unknown, buckets: [], typeGuides: [],
  offscreen: { activities: 3, stars: 12, minutes: 240 }, guidance: '', daysSoFar: 4,
} as unknown as ParentReport

const REPORT_OVER = { ...REPORT_GREEN, totalWeekMins: 860, status: 'over' } as unknown as ParentReport

const DAYS: DayDot[] = [
  { kept: true, today: false, future: false },
  { kept: true, today: false, future: false },
  { kept: true, today: false, future: false },
  { kept: true, today: true, future: false },
  { kept: false, today: false, future: true },
  { kept: false, today: false, future: true },
  { kept: false, today: false, future: true },
]

export default async function RefApplication({
  searchParams,
}: { searchParams: Promise<{ done?: string; behind?: string }> }) {
  const { done, behind } = await searchParams
  const allDone = done === '1'

  // behind=1 also turns the balance rows amber, so the strand card and the
  // zone below can never tell two stories in a screenshot: on the real page
  // both derive from the same rows and cannot disagree.
  const sections = allDone
    ? SECTIONS.map(s => ({ ...s, pct: 100, detail: 'Done' }))
    : behind === '1'
      ? SECTIONS.map(s => (s.key === 'balance' || s.key === 'jobs') ? { ...s, pct: 50, detail: 'Worth a look' } : s)
      : SECTIONS
  const progress = allDone
    ? { ...PROGRESS, lessonsDone: 15, lessonsPct: 100, scriptsDone: 47, scriptsPct: 100, contentComplete: true }
    : PROGRESS

  const strands = buildStrands(sections, progress, null)
  const next = nextTask(strands)
  const itemsLeft = allDone ? 0
    : (progress.lessonsTotal - progress.lessonsDone) + (progress.scriptsTotal - progress.scriptsDone)
  // A twelve year old Explorer; behind=1 makes the birthday eight months out.
  const now = new Date()
  const dob = new Date(Date.UTC(now.getUTCFullYear() - 12, now.getUTCMonth() - (behind === '1' ? 4 : 0), 15))
  const pace = stagePace(3, itemsLeft, dob, now)
  const onTrack = ['stamped', 'few', 'month', 'fortnight', 'week'].includes(pace.kind)

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '24px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div aria-hidden style={{
            width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
            background: `conic-gradient(var(--stage-3-text) 0 ${allDone ? 100 : 38}%, var(--border) ${allDone ? 100 : 38}% 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              width: 34, height: 34, borderRadius: '50%', background: 'var(--cream)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)',
            }}>
              {allDone ? 100 : 38}%
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: 0, lineHeight: 1.15 }}>
              Teo&rsquo;s application to 16
            </h1>
            <span style={{
              display: 'inline-block', marginTop: 3,
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: 'var(--stage-3-bold)', color: 'var(--stage-3-text)',
              borderRadius: 6, padding: '2px 8px',
            }}>
              Explorer · Ages 11 to 12
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 9,
          background: onTrack ? 'var(--tint-sage)' : 'var(--terracotta-lt)',
          border: `1.5px solid ${onTrack ? '#C9DDD5' : 'var(--terracotta)'}`,
          borderRadius: 14, padding: '11px 14px', marginBottom: 14,
        }}>
          <span aria-hidden style={{ flexShrink: 0, fontSize: 'var(--text-md)', lineHeight: 1.4 }}>🕰️</span>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
            {paceLine(pace, 'Teo', 3)}
          </p>
        </div>

        <NextOnTheApplication strands={strands} checkHref={allDone && !next ? '#stage-check' : null} />
        <div style={{ height: 8 }} />
        <StrandCards strands={strands} kid="Teo" />

        <BalanceZone
          report={behind === '1' ? REPORT_OVER : REPORT_GREEN}
          jobsLine={behind === '1' ? 'None yet this week' : '4 days in a row'}
          jobsOk={behind !== '1'}
          days={behind === '1' ? DAYS.map(d => ({ ...d, kept: false })) : DAYS}
          kid="Teo"
          childParam={null}
          siblingGlance={behind === '1' ? null : { name: 'Alma', href: '/dashboard/pathway?child=alma#balance-zone' }}
        />
      </div>
    </main>
  )
}
