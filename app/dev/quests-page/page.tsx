'use client'

import QuestBoard from '@/components/quests/QuestBoard'
import SpotSomethingGood from '@/components/quests/SpotSomethingGood'
import PrintablesToConfirm from '@/components/quests/PrintablesToConfirm'
import QuestShortcuts from '@/components/quests/QuestShortcuts'
import StreakRewards from '@/components/quests/StreakRewards'
import DealChangeAsks from '@/components/deal/DealChangeAsks'
import QuestStatusBoard from '@/components/quests/QuestStatusBoard'

// Dev harness for the parent Quests page as a whole.
//
// The real page is a server component that reads the family from Supabase, so
// it cannot be drawn without a signed in account. This is its client half in
// the same order, so the length of the page and what sits above the fold can
// be measured on purpose: stub /api/quests in Playwright with a quiet day and
// a busy one. On 15 November 2026 this is what showed the page was seventeen
// phone screens long. Keep it in step with page.tsx when the order changes.
export default function QuestsPageHarness() {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <QuestStatusBoard />
      <StreakRewards streaks={[]} />
      <DealChangeAsks />
      <div id="quest-board"><QuestBoard foldQueue /></div>
      <PrintablesToConfirm />
      <QuestShortcuts status={{ ticksToConfirm: 0, printablesToConfirm: 0, schoolOpen: 0, agreementSigned: true, starsToSpend: 3, starChartPrinted: true, chartWeekDue: false, timeAsks: 0, timersRunning: 0 } as never} />
      <SpotSomethingGood kids={[{ id: 'c1', name: 'Teo' }, { id: 'c2', name: 'Olga' }]} />
    </div>
  )
}
