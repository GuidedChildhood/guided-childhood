'use client'

import { useEffect, useState } from 'react'
import ParentDeviceTime from '@/components/quests/ParentDeviceTime'

// Layout harness for the short this week offer on the parent's timer card.
// The component fetches its own data, so both calls are stubbed with a child
// who has 1 star in the bank and a 30 minute ask sitting above it, which is
// the state that used to render a dead "Needs 3 stars" button.

const KIDS = {
  children: [{
    id: 'teo', name: 'Teo', balance: 1, session: null, trust: 'trusted',
    request: null, ageBand: '8-10', usedToday: 0, recommended: 60,
    week: [], sessionsToday: 0, giftOwed: 0, agreedAt: null,
  }],
}

export default function Page() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const real = window.fetch
    window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)
      if (url.includes('/api/devices/family')) {
        return new Response(JSON.stringify({ devices: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      if (url.includes('/api/quests/time')) {
        return new Response(JSON.stringify(KIDS), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      return real(input as RequestInfo, init)
    }) as typeof window.fetch
    setReady(true)
    return () => { window.fetch = real }
  }, [])

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto' }}>
        {ready && <ParentDeviceTime />}
      </div>
    </main>
  )
}
