'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import DeviceSweepCard from '@/components/devices/DeviceSweepCard'

// Dev fixture: DiGi's fortnightly device sweep, in the three states it leads
// with, plus the state it must NOT appear in at all.
//
//   /dev/device-sweep              the plain nudge
//   /dev/device-sweep?focus=birthday   a birthday just landed
//   /dev/device-sweep?focus=games      a console is in the house
//   /dev/device-sweep?focus=none       no devices recorded, so nothing renders
//
// The real card needs a signed in parent, at least one device on record and a
// fortnight clock that has run out, which is three conditions that cannot be
// arranged by walking the product. The server route decides all of it, so this
// stands in for the route and lets the card be looked at.
//
// It also renders the anchor the card scrolls to, because "Yes, add it" going
// nowhere is precisely the kind of thing a fixture without it would miss.

export default function DeviceSweepFixture() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') notFound()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const focus = new URLSearchParams(window.location.search).get('focus') ?? 'generic'
    const payload = focus === 'none' ? { due: false } : {
      due: true,
      childId: 'fixture-child',
      childName: 'Alma',
      focus:
        focus === 'birthday' ? {
          kind: 'birthday', headline: 'Alma is 11 now.',
          sub: 'The right settings shift as they grow. Give the guides another look so everything still fits their age, and set up anything new from their birthday here.',
          chat: { label: 'Ask DiGi what changes at 11', q: 'Alma just turned 11. Which settings should I update?' },
        } : focus === 'games' ? {
          kind: 'games', headline: 'Any new devices for Alma?',
          sub: 'And how is the Nintendo Switch going? Tell DiGi which games they play the most and I will flag anything worth knowing about them.',
          chat: { label: 'Talk to DiGi about their games', q: 'Alma plays on the Nintendo Switch. Which games should I know the ratings for?' },
        } : {
          kind: 'generic', headline: 'Any new devices for Alma?',
          sub: 'A new phone, console or tablet? Add it below, and give the settings a look so they still match their age.',
        },
    }
    const real = window.fetch
    window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      if (url.includes('/api/devices/sweep')) {
        return Promise.resolve(new Response(JSON.stringify(init?.method === 'POST' ? { ok: true } : payload), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        }))
      }
      return real(input as RequestInfo, init)
    }) as typeof window.fetch
    setReady(true)
    return () => { window.fetch = real }
  }, [])

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--app-bg)', padding: '24px 20px 60px', maxWidth: 640, margin: '0 auto' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 14px' }}>
        Reference · the fortnightly device sweep
      </p>
      {ready && <DeviceSweepCard />}
      {/* The thing "Yes, add it" scrolls to. */}
      <div id="your-screens" style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: 18, boxShadow: '0 4px 0 var(--ink)', padding: '16px 18px', marginTop: 600 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', margin: 0 }}>The screens in your home</h2>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', margin: '6px 0 0' }}>Stands in for the real list, so the scroll target is real.</p>
      </div>
    </main>
  )
}
