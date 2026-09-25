import { Suspense } from 'react'
import ChildRail from '@/components/children/ChildRail'
import MobileTabBar from '@/components/dashboard/MobileTabBar'
import DigiChat from '@/app/(dashboard)/dashboard/digi/DigiChat'

// Layout fixture for DiGi inside the dashboard shell: the child badges above,
// the tab bar below, and the real chat between. Built after Justin's
// screenshot of 25 September 2026, where the badges had pushed the box to
// type in down behind the tabs. The shell here copies the dashboard layout's
// structure and zoom rules, so the globals.css rules that size DiGi apply to
// it exactly as they do on the real page. ?kids=1 drops the badges, ?chat=1
// shows a conversation under way.
//
// 404s in production via middleware, like every other ref- page.

const KIDS = [
  { id: 'a', name: 'Teo', is_primary: true, age_band: '11-13' },
  { id: 'b', name: 'Olga', is_primary: false, age_band: '8-10' },
]

export default async function RefDigiChat({
  searchParams,
}: { searchParams: Promise<{ kids?: string; chat?: string }> }) {
  const { kids, chat } = await searchParams
  const count = Number(kids) === 1 ? 1 : 2
  const messages = chat
    ? [
        { role: 'user' as const, content: 'Teo wants TikTok. How do I handle this?' },
        { role: 'assistant' as const, content: '**Start with curiosity.** Ask what he wants it for.\n\n**Name the stage.** At Stage 3 the answer is not yet, with a date.\n\n**Offer a bridge.** Watch a few videos together on your phone this week.' },
      ]
    : []

  return (
    <div className="gc-shell gc-dash" style={{ minHeight: '100dvh', background: 'var(--app-bg)', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        body { zoom: 1; }
        .gc-dash > main, .gc-dash > header { zoom: 1.07; }
        .gc-dash > .bottom-tab-bar { height: calc(77px + env(safe-area-inset-bottom, 0px)); }
        .gc-dash .tab-item { font-size: var(--tab-label-size); }
        .gc-dash .tab-item svg { width: 26px; height: 26px; }
      `}</style>
      <main style={{ flex: 1, paddingBottom: 'calc(132px + env(safe-area-inset-bottom))' }}>
        <Suspense fallback={null}>
          <ChildRail kids={KIDS.slice(0, count)} forceShow />
        </Suspense>
        <DigiChat
          initialMessages={messages}
          initialCount={0}
          dailyLimit={null}
          stagePrompts={[
            'Teo\'s mood drops after Instagram. What do I say tonight?',
            'Teo wants TikTok. How do I handle this?',
            'How do I talk to Teo about the algorithm without sounding preachy?',
          ]}
          faqPrompts={['How long should an 11 to 13 year old be on a screen each day?']}
          pendingReflection={null}
          stageId={3}
          stageName="Explorer"
          childName="Teo"
        />
      </main>
      <Suspense fallback={null}><MobileTabBar pendingAsks={0} digiWord={0} /></Suspense>
    </div>
  )
}
