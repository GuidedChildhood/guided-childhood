import HomeLive from '@/components/home/HomeLive'
import TodayCard from '@/components/home/TodayCard'
import TrialCountdown from '@/components/home/TrialCountdown'

// Reference page for phase 3 of the type plan: the "this needs you" pattern
// in its real components, outside the logged in dashboard, so layout and
// colour can be checked on a phone without an account. The Now slot falls
// back to the due check in here because the notifications read is not
// signed in, which is itself a useful state to look at.

export default function RefNeedsYou() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px', background: 'var(--cream)', minHeight: '100dvh' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 14px' }}>
        Ref · phase 3 · Now row and Today card
      </p>
      <HomeLive childName="Teo" />
      {/* The trial's three registers, mocked: mid trial, the last day clock,
          and the honest close. Real Home shows exactly one. */}
      <TrialCountdown trialEndsAt={new Date(Date.now() + 2.2 * 86400000).toISOString()} ended={false} trialDays={4} jobsTicked={5} streakCount={3} />
      <TrialCountdown trialEndsAt={new Date(Date.now() + 3.6 * 3600000).toISOString()} ended={false} trialDays={4} jobsTicked={5} streakCount={3} />
      <TrialCountdown trialEndsAt={null} ended trialDays={4} jobsTicked={9} streakCount={4} />
      <TodayCard
        childApp={{ childName: 'Teo' }}
        dealReview={{ daysSinceChange: 21 }}
        deviceSetup={{ stageId: 2, stageName: 'Builder' }}
        weekBrief={{ childName: 'Teo', lead: 'count to and across 100, forwards and backwards, beginning with 0 or 1', preview: false }}
      />
    </div>
  )
}
