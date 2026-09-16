'use client'

import { useEffect, useState } from 'react'
import KidJobsScreen from '@/app/k/[token]/jobs/KidJobsScreen'
import type { WaitingAsk } from '@/components/kid/KidWaitingAsks'

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
  { id: 'e', title: 'Twenty minutes lost in a book', emoji: '📚', stars: 3 },
  { id: 'f', title: 'Empty the dishwasher', emoji: '🫧', stars: 1 },
  { id: 'g', title: 'Water the plants', emoji: '🪴', stars: 1 },
]

// The child's own asks, still with their grown up. This is what the Quests
// badge counts, and until 16 September 2026 it was the one thing this page
// could not show: Justin tapped a 2 and landed on "No jobs today".
// Seeded as the pair the live database actually held for the child in his
// photo, one pitched job and one screen time ask, so the fixture is the real
// case rather than a tidy one.
const WAITING: WaitingAsk[] = [
  { kind: 'job', id: 'w1', title: 'Wash the car with Dad', emoji: '🚗' },
  { kind: 'screen', id: 'w2', device: 'tv', minutes: 30 },
]

export default function RefKidJobs() {
  // ?empty=1 shows the first ever day, when a grown up has sent nothing yet.
  // That is the state Justin flagged as too big, so it needs to be lookable at.
  //
  // Read in an effect, not during render: this is a client component, so
  // touching window while rendering makes the server and the client disagree
  // and Next reports a hydration error.
  const [empty, setEmpty] = useState(false)
  // ?waiting=1 adds the asks sitting with a grown up, which is the state the
  // Quests badge points at. ?empty=1&waiting=1 is Justin's exact screenshot.
  const [waiting, setWaiting] = useState(false)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    setEmpty(q.has('empty'))
    setWaiting(q.has('waiting'))
  }, [])

  return (
    <KidJobsScreen
      token="000000000000000000"
      childName="Teo"
      buddy="digi"
      stageId={2}
      ageBand="8-10"
      quests={empty ? [] : QUESTS}
      todayTicks={[{ quest_id: 'a', status: 'pending' }]}
      giftStarsOwed={6}
      waiting={waiting ? WAITING : []}
    />
  )
}
