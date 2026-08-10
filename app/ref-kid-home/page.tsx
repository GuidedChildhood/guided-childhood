'use client'

import KidQuestScreen from '@/app/k/[token]/KidQuestScreen'
import { pickDay } from '@/lib/kid/five-a-day'

// Layout fixture for the child's WHOLE home screen, so the reorder can be
// seen and screenshotted without a signed in child (there is no test account
// in the sandbox). It renders the REAL KidQuestScreen with a made up family:
// a school diary with something due, a part done five a day, a few jobs, a
// modest streak. The fake token means every tap posts and quietly fails,
// which is fine for a layout check.
//
// The order under test is Justin's, 9 August 2026: school diary, morning
// welcome, streaks (small), five a day, use my time, with a more visible tab
// bar. 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

const TOKEN = '000000000000000000'
const steps = pickDay('fixture-child', '2026-08-03')

export default function RefKidHome() {
  return (
    <KidQuestScreen
      token={TOKEN}
      childName="Teo"
      buddy="digi"
      accent="graphite"
      stageId={2}
      quests={[
        { id: 'a', title: 'Make your bed', emoji: '🛏️', stars: 2, schedule: 'daily' },
        { id: 'b', title: 'Feed the dog before school', emoji: '🐕', stars: 3, schedule: 'daily', blocks_screens: true },
        { id: 'c', title: 'One hour of outside play', emoji: '⚽', stars: 5, schedule: 'daily' },
      ]}
      todayTicks={[{ quest_id: 'a', status: 'pending' }]}
      weekStars={24}
      goal={null}
      streakDays={3}
      completedStreaks={2}
      earnedStages={1}
      jobStreaks={2}
      completedDays={1}
      bank={null}
      schoolToday={[
        { id: 'x', title: 'PE kit, black shorts', kind: 'kit', time: null, when: 'today' },
        { id: 'y', title: 'Trip letter back in', kind: 'homework', time: '09:00', when: 'tomorrow' },
      ]}
      schoolWeekCount={4}
      weekChart={[]}
      fiveADayInitial={{ day: '2026-08-03', steps, done: steps.slice(0, 2), complete: false, streak: 4 }}
    />
  )
}
