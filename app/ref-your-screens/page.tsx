'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import YourScreens from '@/components/devices/YourScreens'
import type { FamilyDevice } from '@/lib/devices/family'

// Layout fixture for the family's own device list on the Devices page, built
// on 25 September 2026 for the all covered line and its way back to the road.
// The list loads from /api/devices/family, which needs a login, so the check
// script answers that route itself. ?done=1 ticks every screen, ?from=today
// shows the Back to today button a parent sees when they came from the road.
//
// 404s in production via middleware, like every other ref- page.

const GUIDES = [
  { device_key: 'iphone', name: 'iPhone and iPad', category: 'phone', emoji: '📱', min_age: 13, subtitle: 'Screen Time', why: '', steps: [], note: null, sort_order: 1 },
  { device_key: 'smarttv', name: 'Smart TV', category: 'tv', emoji: '📺', min_age: 6, subtitle: 'Parental controls', why: '', steps: [], note: null, sort_order: 2 },
]

function Fixture() {
  const params = useSearchParams()
  const allDone = params.get('done') === '1'
  const [doneDevices, setDoneDevices] = useState<Set<string>>(new Set(allDone ? ['a', 'b', 'c'] : ['c']))
  return (
    <main style={{ background: 'var(--app-bg)', minHeight: '100vh', padding: '24px 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <YourScreens
          guides={GUIDES as never}
          childAge={12}
          childName="Teo"
          completed={new Set(allDone ? ['iphone', 'smarttv'] : ['smarttv'])}
          notOwned={new Set()}
          doneDevices={doneDevices}
          pending={null}
          onToggleDevice={(d: FamilyDevice) => setDoneDevices(prev => new Set(prev).add(d.id))}
          onNotOwned={() => {}}
          agreedDevices={new Set()}
          agreedNotes={{}}
          onAgreeDevice={() => {}}
          from={params.get('from')}
        />
      </div>
    </main>
  )
}

export default function RefYourScreens() {
  return <Suspense fallback={null}><Fixture /></Suspense>
}
