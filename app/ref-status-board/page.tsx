'use client'

import QuestStatusBoard from '@/components/quests/QuestStatusBoard'

// Fixture reference page: the REAL status board, so its count tiles, its caught
// up line and its busy board can all be seen without a logged in parent.
//
// IT USED TO RENDER NOTHING, and that is worth writing down. The component
// fetches /api/quests itself, which is behind auth, so on this page the call
// 401s and the board draws an empty shell. A fixture that renders nothing
// certifies nothing, and this one has been quietly certifying nothing: Justin
// found the misaligned tile numbers on his phone, on a component that has had a
// reference page all along.
//
// So the fetch is stubbed here, with the four buckets deliberately UNEVEN.
// That is the case that broke: the tile labels wrap to one, three and four
// lines, and WebKit centres a button's content vertically by default, so each
// number settled at a different height. Even counts would hide it.

const TODAY = new Date().toISOString().slice(0, 10)

const STUB = {
  children: [{ id: 'c1', name: 'Teo', use_mode: 'app' }],
  links: [{ child_id: 'c1', token: '000000000000000000' }],
  quests: [
    { id: 'q1', child_id: 'c1', title: 'Lesson: Password power', emoji: '🔐', stars: 2, schedule: 'daily', schedule_days: null },
    { id: 'q2', child_id: 'c1', title: 'Tidy your room', emoji: '🧹', stars: 1, schedule: 'daily', schedule_days: null },
    { id: 'q3', child_id: 'c1', title: 'Reading, twenty minutes', emoji: '📚', stars: 2, schedule: 'daily', schedule_days: null },
  ],
  // One waiting, one on their app, none with you, eight done: the exact shape
  // of Justin's screenshot, so the tile labels wrap the way his did.
  ticks: [
    { id: 't1', quest_id: 'q1', child_id: 'c1', status: 'pending', tick_date: TODAY },
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `d${i}`, quest_id: 'q2', child_id: 'c1', status: 'approved', tick_date: TODAY,
    })),
  ],
}

if (typeof window !== 'undefined') {
  const real = window.fetch.bind(window)
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    if (url.startsWith('/api/quests')) {
      return Promise.resolve(new Response(JSON.stringify(STUB), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      }))
    }
    return real(input as RequestInfo, init)
  }) as typeof window.fetch
}

export default function RefStatusBoardPage() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: 20, maxWidth: 640, margin: '0 auto' }}>
      <QuestStatusBoard />
    </main>
  )
}
