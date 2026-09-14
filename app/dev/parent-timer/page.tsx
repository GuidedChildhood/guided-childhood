'use client'

import { PendingAskBox, DailyGuideLine } from '@/components/quests/ParentDeviceTime'

// The parent's screen time card, the two pieces that speak at the yes, with
// fixture data so they can be screenshotted without a session or a child
// asking. The full card fetches live; these two are pure, so they render
// here in every state the copy has: under the guide with jobs left, nearly
// there, reached, and the yes box with a deal, with no deal, and unknown.
export default function DevParentTimer() {
  const noop = () => {}
  const request = { device: 'tablet' as const, minutes: 30, deviceName: null }
  return (
    <main style={{ minHeight: '100dvh', background: 'var(--app-bg)', padding: '24px 20px 80px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 16px' }}>
        Reference · the parent&apos;s timer, the deal at the yes
      </p>
      <div style={{ display: 'grid', gap: 18, maxWidth: 520 }}>
        <section style={{ background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: 16, boxShadow: 'var(--lift)' }}>
          <DailyGuideLine name="Andy" usedToday={20} recommended={75} ageBand="8-10" addingMinutes={0} sessionsToday={1} jobsLeft={3} />
          <PendingAskBox childName="Andy" request={request} exceedsGuide={false} busy={false} onApprove={noop} onDecline={noop} starMinutes={5}
            deal={{ lines: ['7pm on school nights, later at weekends', 'Stars from quests buy screen minutes, one star is five minutes'], signed: true }} />
        </section>
        <section style={{ background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: 16, boxShadow: 'var(--lift)' }}>
          <DailyGuideLine name="Andy" usedToday={70} recommended={75} ageBand="8-10" addingMinutes={0} sessionsToday={2} jobsLeft={0} />
          <PendingAskBox childName="Andy" request={request} exceedsGuide={true} busy={false} onApprove={noop} onDecline={noop} starMinutes={5} deal={null} />
        </section>
        <section style={{ background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: 16, boxShadow: 'var(--lift)' }}>
          <DailyGuideLine name="Andy" usedToday={90} recommended={75} ageBand="8-10" addingMinutes={0} sessionsToday={3} jobsLeft={2} />
          <PendingAskBox childName="Andy" request={request} exceedsGuide={true} busy={false} onApprove={noop} onDecline={noop} starMinutes={5} />
        </section>
      </div>
    </main>
  )
}
