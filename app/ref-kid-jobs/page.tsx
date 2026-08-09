'use client'

import KidJobsScreen from '@/app/k/[token]/jobs/KidJobsScreen'

// Layout fixture for the child's jobs page (the do these jobs list and the
// pay back message the five a day's jobs step opens). The real screen needs a
// kid link token and a family's quests, so the states are rendered here with
// the REAL KidJobsScreen and made up rows. The fake token means a tick posts
// and quietly fails, which is fine for a layout check.
//
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

const QUESTS = [
  { id: 'a', title: 'Make your bed', emoji: '🛏️', stars: 2 },
  { id: 'b', title: 'Feed the dog before school', emoji: '🐕', stars: 3, blocks_screens: true },
  { id: 'c', title: 'One hour of outside play', emoji: '⚽', stars: 5 },
  { id: 'd', title: 'Shoes on and by the door', emoji: '👟', stars: 1 },
]

export default function RefKidJobs() {
  return (
    <KidJobsScreen
      token="000000000000000000"
      childName="Teo"
      buddy="digi"
      stageId={2}
      quests={QUESTS}
      todayTicks={[{ quest_id: 'a', status: 'pending' }]}
      giftStarsOwed={6}
    />
  )
}
