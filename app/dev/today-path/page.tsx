'use client'

import { notFound } from 'next/navigation'
import TodayPathBig from '@/components/daily/TodayPathBig'
import type { TodayLoopTask } from '@/lib/pathway/daily-tasks'
import DigiGreeting from '@/components/home/DigiGreeting'
import HomeRows from '@/components/home/HomeRows'
import HomeMain from '@/components/home/HomeMain'

// Dev only fixture: the parent's daily path in the happy news finish, mid
// day (two done, the check in up next) and all done. Never in production.

const tasks: TodayLoopTask[] = [
  { key: 'moment', label: 'A moment', href: '#', done: true },
  { key: 'checkin', label: 'Check in', href: '#', done: false, lead: true },
  { key: 'tonight', label: 'Phones to bed', href: '#', done: false },
  { key: 'script', label: 'The words', href: '#', done: true, note: 'with Jonny' },
  { key: 'quests', label: "Ava's jobs", href: '#', done: false },
  // The passport rung wearing the real job's name rather than "Passport"
  // (10 September 2026). The longest of the five section labels, because a
  // rung label is a caption under a circle and "Moments to resolve" is three
  // times the width of the word it replaced.
  { key: 'passport', label: 'Moments to resolve', href: '#', done: false },
  { key: 'lesson', label: 'A lesson', href: '#', done: false },
]

// A LESSON DAY, which is the order Justin questioned on 18 September 2026:
// "didn't have check in as first thing to do?" One completed day makes the
// second day a lesson day, so the lesson is the tick and used to walk to the
// front on its own. Now the check in opens the road and the lesson keeps the
// lead, which is what puts the "Also today" seam after the lesson rather than
// after the check in. Both roads are on this page so the two can be compared.
const lessonDay: TodayLoopTask[] = [
  { key: 'checkin', label: 'Check in', href: '#', done: false },
  { key: 'lesson', label: 'A lesson', href: '#', done: false, lead: true },
  { key: 'moment', label: 'A moment', href: '#', done: false },
  { key: 'tonight', label: 'Phones to bed', href: '#', done: false },
  { key: 'quests', label: "Ava's jobs", href: '#', done: false },
  { key: 'passport', label: 'Moments to resolve', href: '#', done: false },
]

export default function TodayPathFixture() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '16px 16px 40px' }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <DigiGreeting firstName="Justin" childName="Ava" stageName="Explorer" stageNum={3} minutesLeft={8} dayDone={false} streakCount={3} aliveToday jobsStatus="pending" balanceHref="#" />
        <p className="eyebrow" style={{ margin: '0 0 8px' }}>Connect day, the check in leads and opens</p>
        <TodayPathBig tasks={tasks} dailyMinutes={10} childName="Ava" streakCount={3} bonus={null} childId={null} />
        <p className="eyebrow" style={{ margin: '28px 0 8px' }}>Lesson day, the check in opens and the lesson leads</p>
        <TodayPathBig tasks={lessonDay} dailyMinutes={10} childName="Ava" streakCount={3} bonus={null} childId={null} />
        <HomeRows stageName="Explorer" stageNum={3} initialToApprove={2} />
        <HomeMain />
      </div>
    </div>
  )
}
