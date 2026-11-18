'use client'

import QuestManager from '@/app/(dashboard)/dashboard/quests/QuestManager'

// Dev harness for /dashboard/quests/setup (Stars, rewards and sharing). Stub
// /api/quests in Playwright with a family to see the whole page on a phone.
export default function QuestSetupHarness() {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <QuestManager />
    </div>
  )
}
