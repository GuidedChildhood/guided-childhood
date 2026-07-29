'use client'

import { useState } from 'react'
import YourScreens from '@/components/devices/YourScreens'
import type { DeviceGuide } from '@/app/(dashboard)/dashboard/devices/DeviceList'

// Dev harness for the one list of screens.
//
// The real page needs auth, a child, and rows in family_devices, so this feeds
// the component the same shapes and lets the /api/devices/family call be
// stubbed in the browser. Sample guides only, enough to see a row expand, a
// device tick off, and the dashed suggestions underneath.

const GUIDES: DeviceGuide[] = [
  {
    device_key: 'android', name: 'Android Phone and Tablet', category: 'Phones and Tablets',
    emoji: '🤖', min_age: 8, subtitle: 'Google Family Link',
    why: 'Family Link is the one place to set app limits, downtime and content ratings on an Android phone, and it works from your phone rather than theirs.',
    steps: [
      '**Install Family Link** on your own phone from the Play Store.',
      '**Sign in with your Google account**, then pick your child from the list.',
      '**Set daily limits** under Screen time, and a bedtime that matches the one you already agreed.',
      '**Turn on content filters** in Controls, then check the Play Store rating limit.',
    ],
    note: 'Do this with them watching, not behind their back. It is the difference between a rule and a trap.',
    sort_order: 2,
  },
  {
    device_key: 'smarttv', name: 'Smart TV', category: 'TV and Streaming',
    emoji: '📺', min_age: 4, subtitle: 'Profiles and PIN locks',
    why: 'The TV is usually the most shared screen in the house and the least locked down, so it is worth ten minutes.',
    steps: [
      '**Make a child profile** on each streaming app rather than sharing yours.',
      '**Set a PIN** on the adult profiles so a tap does not land them somewhere else.',
    ],
    note: 'A shared screen in a shared room is a good thing. This is about what plays next, not about watching together.',
    sort_order: 6,
  },
]

export default function YourScreensHarness() {
  const [completed, setCompleted] = useState<Set<string>>(new Set(['smarttv']))
  const [notOwned, setNotOwned] = useState<Set<string>>(new Set())

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 60px' }}>
      <p className="eyebrow" style={{ marginBottom: 14 }}>One list of screens</p>
      <YourScreens
        guides={GUIDES}
        childAge={14}
        childName="Ada"
        completed={completed}
        notOwned={notOwned}
        pending={null}
        onToggleGuide={key => setCompleted(prev => {
          const next = new Set(prev)
          if (next.has(key)) next.delete(key); else next.add(key)
          return next
        })}
        onNotOwned={key => setNotOwned(prev => new Set(prev).add(key))}
      />
    </div>
  )
}
