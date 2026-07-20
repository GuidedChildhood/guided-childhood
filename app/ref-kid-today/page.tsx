import KidQuestScreen from '@/app/k/[token]/KidQuestScreen'

// Fixture reference page: the REAL kid screen components with made up props,
// so the one Today list and the age based contract can be screenshotted
// without a database. Not linked from anywhere. ?view=contract shows the
// first run contract gate; the default shows the board with the one list,
// a waiting job, and a gift still being paid back.

export const dynamic = 'force-dynamic'

const QUESTS = [
  { id: 'q1', title: 'Make your bed', emoji: '🛏️', stars: 2, schedule: 'daily', blocks_screens: true },
  { id: 'q2', title: 'Feed the dog', emoji: '🐕', stars: 1, schedule: 'daily' },
  { id: 'q3', title: 'Read for ten minutes', emoji: '📚', stars: 2, schedule: 'daily' },
]

export default async function RefKidToday({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams
  const contract = view === 'contract'
  return (
    <KidQuestScreen
      token="000000000000000000"
      childName="Alfie"
      stageId={2}
      quests={QUESTS}
      todayTicks={[{ quest_id: 'q2', status: 'pending' }]}
      weekStars={14}
      goal={{ title: 'Cinema trip', stars_needed: 40, daily_stars: null, achieved_at: null }}
      streakDays={3}
      bank={{ child_id: 'fixture-child', earned: 30, spent: 12, balance: 18, minutes: 90 }}
      usedWeekMinutes={60}
      usedTodayMinutes={20}
      recommendedMinutes={90}
      activeSession={null}
      contractLevel="8to10"
      contractReady
      contractAgreedAt={contract ? null : '2026-07-18T16:20:00Z'}
      giftStarsOwed={contract ? 0 : 4}
    />
  )
}
