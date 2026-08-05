'use client'

import { useEffect, useState } from 'react'
import QuestStatusBoard from '@/components/quests/QuestStatusBoard'

// Layout harness for the caught up row and its new Remind button. The board
// fetches /api/quests, so the fetch is stubbed here with a family that is in
// exactly the state Justin photographed: nothing waiting on the parent, ten
// jobs sitting on the child's app, none of them ticked.

const TODAY = new Date().toISOString().slice(0, 10)

const FIXTURE = {
  children: [{ id: 'teo', name: 'Teo' }, { id: 'alma', name: 'Alma' }],
  links: [{ child_id: 'teo', token: 'aaaaaaaaaaaaaaaaaa' }, { child_id: 'alma', token: 'bbbbbbbbbbbbbbbbbb' }],
  quests: [
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `t${i}`, child_id: 'teo', title: ['Tidy your bedroom', 'Wash the car', 'Play football outside', 'Feed the dog', 'Reading, 20 minutes', 'Put the bins out', 'Lay the table', 'Homework'][i],
      emoji: '⭐', stars: 2, schedule: 'daily', schedule_days: null,
    })),
    ...Array.from({ length: 2 }, (_, i) => ({
      id: `a${i}`, child_id: 'alma', title: ['Tidy the playroom', 'Practise piano'][i],
      emoji: '⭐', stars: 2, schedule: 'daily', schedule_days: null,
    })),
  ],
  ticks: [] as unknown[],
}

export default function Page() {
  // The board is held back until the stub is in place. A child's effect runs
  // before its parent's, so mounting them together let the real fetch fire
  // first and come back 401.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const real = window.fetch
    window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)
      if (url.includes('/api/quests') && !url.includes('nudge')) {
        return new Response(JSON.stringify(FIXTURE), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      // The nudge itself is stubbed too, so this page never messages anybody.
      if (url.includes('/api/quests/nudge')) {
        return new Response(JSON.stringify({ ok: true, stored: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      return real(input as RequestInfo, init)
    }) as typeof window.fetch
    setReady(true)
    return () => { window.fetch = real }
  }, [])

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto' }}>
        {ready && <QuestStatusBoard />}
      </div>
    </main>
  )
}
