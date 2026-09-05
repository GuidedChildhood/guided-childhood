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
  { key: 'script', label: 'The words', href: '#', done: false },
  { key: 'quests', label: "Ava's jobs", href: '#', done: false },
  { key: 'lesson', label: 'A lesson', href: '#', done: false },
]

export default function TodayPathFixture() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '16px 16px 40px' }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <DigiGreeting firstName="Justin" childName="Ava" stageName="Explorer" stageNum={3} minutesLeft={8} dayDone={false} streakCount={3} aliveToday jobsStatus="pending" balanceHref="#" />
        <TodayPathBig tasks={tasks} dailyMinutes={10} childName="Ava" streakCount={3} bonus={null} childId={null} />
        <HomeRows stageName="Explorer" stageNum={3} initialToApprove={2} />
        <HomeMain />
      </div>
    </div>
  )
}
