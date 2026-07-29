'use client'

import QuestStatusBoard from '@/components/quests/QuestStatusBoard'

// Dev harness for the where every job is board.
//
// It reads /api/quests, which needs auth and a family with jobs in several
// states at once, including a stale pending tick that is the whole reason the
// seven day window was widened. Stub the call in Playwright and all four
// buckets can be looked at on purpose.

export default function QuestStatusHarness() {
  return (
    <div style={{ maxWidth: 620, margin: '0 auto', padding: '24px 20px 60px' }}>
      <p className="eyebrow" style={{ marginBottom: 14 }}>Quest status board</p>
      <QuestStatusBoard />
    </div>
  )
}
