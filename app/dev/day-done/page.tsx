'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import TodayPathBig from '@/components/daily/TodayPathBig'
import DigiGreeting from '@/components/home/DigiGreeting'
import type { TodayLoopTask } from '@/lib/pathway/daily-tasks'

// Dev only fixture: the three states of a day, since 11 September 2026 there
// are three and there used to be two.
//
// Justin: "one tick keeps the streak, the pathway earns the celebration." The
// middle state is the new one and the one worth looking at: the lead rung is
// green, the day counts, the streak is safe, and the road is still open with
// the rest of it on offer. It used to jump straight from here to "Today is
// made", which is what he caught.
//
// Gated on the Vercel env rather than NODE_ENV so a production BUILD served
// locally still shows it. The container cannot hydrate `next dev`.

const BASE: TodayLoopTask[] = [
  { key: 'moment', label: 'A moment', href: '#', done: false },
  { key: 'checkin', label: 'Check in', href: '#', done: false, lead: true },
  { key: 'tonight', label: 'Phones to bed', href: '#', done: false },
  { key: 'script', label: 'The words', href: '#', done: false },
  { key: 'quests', label: "Ava's jobs", href: '#', done: false },
]

type State = 'start' | 'tick' | 'done'

const DONE_KEYS: Record<State, string[]> = {
  start: [],
  tick: ['checkin'],
  done: ['moment', 'checkin', 'tonight', 'script', 'quests'],
}

const TITLE: Record<State, string> = {
  start: 'Nothing done yet',
  tick: 'One tick done (the new middle state)',
  done: 'Every rung done',
}

export default function DayDoneFixture() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') notFound()
  const [state, setState] = useState<State>('tick')
  const tasks = BASE.map(t => ({ ...t, done: DONE_KEYS[state].includes(t.key) }))
  const allDone = state === 'done'
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '16px 16px 40px' }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {(['start', 'tick', 'done'] as State[]).map(s => (
            <button
              key={s}
              onClick={() => setState(s)}
              style={{
                flex: 1, padding: '8px 6px', borderRadius: 12, cursor: 'pointer',
                border: '2px solid var(--ink)', boxShadow: '0 3px 0 var(--ink)',
                background: s === state ? 'var(--terracotta)' : '#fff',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 10px' }}>
          {TITLE[state]}
        </p>
        <DigiGreeting
          firstName="Justin" childName="Ava" stageName="Explorer" stageNum={3}
          minutesLeft={8} dayDone={allDone} streakCount={3} aliveToday
          jobsStatus="pending" balanceHref="#"
        />
        <TodayPathBig
          key={state}
          tasks={tasks} dailyMinutes={10} childName="Ava"
          streakCount={3} bonus={null} childId={null}
        />
      </div>
    </div>
  )
}
