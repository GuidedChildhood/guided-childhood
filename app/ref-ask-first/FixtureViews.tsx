'use client'

import KidAskBanner from '@/components/kid/KidAskBanner'
import DeviceTimeCard from '@/components/quests/DeviceTimeCard'
import ScreenGateBanner from '@/components/quests/ScreenGateBanner'
import ChildLinkShare from '@/components/quests/ChildLinkShare'

// Fixture views: the REAL ask flow components with made up props, so the
// child banner states, the picker, the parent's ask box with the locked
// banner, and the QR share can be screenshotted without a database. Not
// linked from anywhere.

const noop = () => { /* fixture */ }

export default function FixtureViews({ view }: { view: string }) {
  if (view === 'parent') {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '28px 16px', display: 'flex', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
        <div style={{ width: 'min(100%, 540px)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 12px' }}>
            The ask box and the locked banner
          </p>
          <ScreenGateBanner
            childId="fixture-child"
            childName="Alfie"
            gateCount={3}
            blocking={[
              { questId: 'q1', title: 'Tidy your bedroom', count: 2 },
              { questId: 'q2', title: 'Make your bed', count: 1 },
            ]}
            fixture={{ request: { id: 'fx-ask', device: 'console', minutes: 30 } }}
          />
        </div>
      </div>
    )
  }

  if (view === 'share') {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '28px 16px', display: 'flex', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
        <div style={{ width: 'min(100%, 540px)' }}>
          <ChildLinkShare token="000000000000000000" childName="Alfie" ageBand="8-10" useMode="own" onSetMode={noop} />
        </div>
      </div>
    )
  }

  // The child side: every banner state stacked, then the picker open, on the
  // kid app's own dark ground.
  return (
    <div style={{ minHeight: '100dvh', background: 'linear-gradient(180deg, #4C5057 0%, #34373D 100%)', padding: '28px 16px 40px', display: 'flex', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
      <div style={{ width: 'min(100%, 460px)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', margin: '0 0 12px' }}>
          Asked, waiting
        </p>
        <KidAskBanner
          ask={{ id: 'a1', device: 'tv', minutes: 30, status: 'pending' }}
          blockingJobs={[]} nudges={[]} hasSession={false} startBusy={false}
          onStart={noop} onDismissDeclined={noop} onDismissNudge={noop}
        />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', margin: '4px 0 12px' }}>
          The yes landed
        </p>
        <KidAskBanner
          ask={{ id: 'a2', device: 'tv', minutes: 30, status: 'approved' }}
          blockingJobs={[]} nudges={[]} hasSession={false} startBusy={false}
          onStart={noop} onDismissDeclined={noop} onDismissNudge={noop}
        />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', margin: '4px 0 12px' }}>
          Not right now, and a nudge
        </p>
        <KidAskBanner
          ask={{ id: 'a3', device: 'console', minutes: 45, status: 'declined' }}
          blockingJobs={[]}
          nudges={[{ id: 'n1', message: 'Your grown up asked: tidy your bedroom, then your timer can start 🌱' }]}
          hasSession={false} startBusy={false}
          onStart={noop} onDismissDeclined={noop} onDismissNudge={noop}
        />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', margin: '4px 0 12px' }}>
          Chores first
        </p>
        <KidAskBanner
          ask={null}
          blockingJobs={['Make your bed']} nudges={[]} hasSession={false} startBusy={false}
          onStart={noop} onDismissDeclined={noop} onDismissNudge={noop}
        />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', margin: '4px 0 12px' }}>
          The picker, ask first
        </p>
        <DeviceTimeCard
          token="000000000000000000"
          balanceStars={18}
          initialSession={null}
          usedTodayMinutes={70}
          recommendedMinutes={90}
          deviceTrust="ask"
          startPicking
        />
      </div>
    </div>
  )
}
