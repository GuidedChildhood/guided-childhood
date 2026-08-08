'use client'

import { useState } from 'react'
import YourScreens from '@/components/devices/YourScreens'
import type { DeviceGuide } from '@/app/(dashboard)/dashboard/devices/DeviceList'
import type { FamilyDevice } from '@/lib/devices/family'

// Dev harness for the one list of screens.
//
// The real page needs auth, a child, and rows in family_devices, so this feeds
// the component the same shapes and stubs the /api/devices/family call it makes
// on mount. Sample guides only, enough to see a row expand, a screen tick off,
// and the dashed suggestions underneath.
//
// The house it describes is deliberately the one that broke. An iPhone and an
// iPad both point at guide 'iphone', because "iPhone and iPad" is one guide
// over two screens, and that is what used to tick the second one on its own.
// Justin, 8 August 2026: "I've added these devices and it is automatically
// saying set up although I haven't." The iPhone here is set up and the iPad is
// not, and the list has to be able to say so.

const HOUSE: FamilyDevice[] = [
  { id: 'dev-iphone', label: 'iPhone', kind: 'phone', guideKey: 'iphone', shared: false, retiredAt: null },
  { id: 'dev-ipad', label: 'iPad', kind: 'tablet', guideKey: 'iphone', shared: true, retiredAt: null },
  { id: 'dev-tv', label: 'Smart TV', kind: 'tv', guideKey: 'smarttv', shared: true, retiredAt: null },
  { id: 'dev-laptop', label: 'Old laptop', kind: 'computer', guideKey: null, shared: true, retiredAt: null },
]

// Patched at module scope rather than in an effect on purpose: YourScreens
// fetches its list the moment it mounts, and a child's effect runs before its
// parent's, so an effect here would always be too late.
if (typeof window !== 'undefined') {
  const real = window.fetch.bind(window)
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    if (url.startsWith('/api/devices/')) {
      return Promise.resolve(new Response(JSON.stringify({ devices: HOUSE, askedAt: null, ok: true }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      }))
    }
    return real(input as RequestInfo, init)
  }) as typeof window.fetch
}

const GUIDES: DeviceGuide[] = [
  {
    device_key: 'iphone', name: 'iPhone and iPad', category: 'Phones and Tablets',
    emoji: '📱', min_age: 8, subtitle: 'Screen Time, Apple’s own parental controls',
    why: 'Screen Time is the most powerful parental control on any consumer platform, and it is set on the device, which is why every Apple screen in the house needs its own pass.',
    steps: [
      '**Set a Screen Time passcode** that is not the unlock PIN.',
      '**Turn on Downtime** from a set evening time.',
      '**Content and Privacy Restrictions,** age ratings for apps, films and music.',
    ],
    note: 'Look at the weekly report with them rather than at them.',
    sort_order: 1,
  },
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
  // Guide level: both Apple guides worked through, which before migration 169
  // was the only thing recorded and is what ticked the iPad on its own.
  const [completed, setCompleted] = useState<Set<string>>(new Set(['iphone', 'smarttv']))
  const [notOwned, setNotOwned] = useState<Set<string>>(new Set())
  // Screen level: only the iPhone. The iPad has to read as not set up.
  const [doneDevices, setDoneDevices] = useState<Set<string> | null>(new Set(['dev-iphone', 'dev-tv']))

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 60px' }}>
      <p className="eyebrow" style={{ marginBottom: 14 }}>One list of screens</p>

      <button
        type="button"
        onClick={() => setDoneDevices(prev => (prev ? null : new Set(['dev-iphone', 'dev-tv'])))}
        style={{
          marginBottom: 14, border: '1.5px solid var(--border)', borderRadius: 100,
          background: '#fff', padding: '8px 14px', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-soft)',
        }}
      >
        {doneDevices ? 'Showing per screen, migration 169 applied' : 'Showing per guide, before migration 169'}
      </button>

      <YourScreens
        guides={GUIDES}
        childAge={14}
        childName="Ada"
        completed={completed}
        notOwned={notOwned}
        doneDevices={doneDevices}
        pending={null}
        onToggleDevice={(d, lastForGuide) => {
          if (!d.guideKey) return
          if (!doneDevices) {
            setCompleted(prev => {
              const next = new Set(prev)
              if (next.has(d.guideKey as string)) next.delete(d.guideKey as string)
              else next.add(d.guideKey as string)
              return next
            })
            return
          }
          const wasDone = doneDevices.has(d.id)
          setDoneDevices(prev => {
            const next = new Set(prev)
            if (wasDone) next.delete(d.id); else next.add(d.id)
            return next
          })
          setCompleted(prev => {
            const next = new Set(prev)
            if (wasDone) { if (lastForGuide) next.delete(d.guideKey as string) }
            else next.add(d.guideKey as string)
            return next
          })
        }}
        onNotOwned={key => setNotOwned(prev => new Set(prev).add(key))}
      />
    </div>
  )
}
