'use client'

import QuestManager from '@/app/(dashboard)/dashboard/quests/QuestManager'

// The hand it over panel, which is where the privacy reassurance lives.
//
// Justin, 11 August 2026: "use this principle for each page, do not have the
// whole thing all down each page, just a one line explaining what it is and the
// ability to expand or reduce."
//
// QuestManager fetches everything itself and takes no props, so it is behind
// auth and could never be looked at without a login. Stubbed here the same way
// ref-status-board stubs its board, and for the reason written on that file: a
// fixture that renders nothing certifies nothing, and this panel had no fixture
// at all when its copy was being changed.
//
// One child with a link already created, which is the state that shows the
// hand over block and the reassurance fold underneath it.

const TODAY = new Date().toISOString().slice(0, 10)

const QUESTS = {
  children: [{ id: 'c1', name: 'Teo', use_mode: 'app', stage_id: 'builder', age_band: '8-10' }],
  links: [{ child_id: 'c1', token: '000000000000000000' }],
  quests: [
    { id: 'q1', child_id: 'c1', title: 'Tidy your room', emoji: '🧹', stars: 1, schedule: 'daily', schedule_days: null, active: true },
    { id: 'q2', child_id: 'c1', title: 'Reading, twenty minutes', emoji: '📚', stars: 2, schedule: 'daily', schedule_days: null, active: true },
  ],
  ticks: [{ id: 't1', quest_id: 'q1', child_id: 'c1', status: 'approved', tick_date: TODAY }],
  goals: [],
  previous: [],
}

if (typeof window !== 'undefined') {
  const real = window.fetch.bind(window)
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const json = (body: unknown) =>
      Promise.resolve(new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }))
    if (url.startsWith('/api/quests/ping')) return json({ ok: true })
    if (url.startsWith('/api/quests/approve')) return json({ ok: true })
    if (url.startsWith('/api/quests/spend')) return json({ ok: true })
    if (url.startsWith('/api/devices/family')) return json({ devices: [] })
    if (url.startsWith('/api/quests')) return json(QUESTS)
    return real(input as RequestInfo, init)
  }) as typeof window.fetch
}

export default function QuestHandoverFixture() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '20px 16px 60px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <QuestManager />
      </div>
    </div>
  )
}
