'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import DeviceTimeCard from '@/components/quests/DeviceTimeCard'
import AskPopup from '@/components/quests/AskPopup'

// Dev only fixture: the child's device time card and the parent's pop up.
//
//   /dev/device-time                 idle with stars, idle with none, the
//                                    picker open with a short bank
//   /dev/device-time?view=popup      the parent's ask pop up (fixture data)
//
// Never reachable in production.

export default function DeviceTimeFixture() {
  if (process.env.NODE_ENV === 'production') notFound()
  const [q, setQ] = useState<URLSearchParams | null>(null)
  useEffect(() => { setQ(new URLSearchParams(window.location.search)) }, [])
  if (!q) return null
  if (q.get('view') === 'popup') {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--app-bg)', fontFamily: 'var(--font-body)', padding: 20 }}>
        <p style={{ color: 'var(--ink-soft)' }}>The dashboard behind the pop up.</p>
        <AskPopup initial={[{ id: 'k1', name: 'Jonny', balance: 3, starMinutes: 5, session: null, request: { id: 'r1', device: 'tv', minutes: 30, deviceName: null } }]} />
      </div>
    )
  }
  const label = (t: string) => (
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', margin: '18px 0 10px' }}>{t}</p>
  )
  return (
    <div style={{ minHeight: '100dvh', background: '#3B3F47', padding: '10px 16px 40px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        {label('Idle, stars in the bank')}
        <DeviceTimeCard token="000000000000000000" balanceStars={6} initialSession={null} usedTodayMinutes={20} recommendedMinutes={90} deviceTrust="ask" outstandingJobs={['Tidy my room']} outstandingMinutes={10} />
        {label('Idle, no stars')}
        <DeviceTimeCard token="000000000000000000" balanceStars={0} initialSession={null} usedTodayMinutes={0} recommendedMinutes={90} deviceTrust="ask" outstandingJobs={['Tidy my room', 'Feed the cat']} outstandingMinutes={15} />
        {label('Picking, two stars short')}
        <DeviceTimeCard token="000000000000000000" balanceStars={2} initialSession={null} usedTodayMinutes={0} recommendedMinutes={90} deviceTrust="ask" startPicking outstandingJobs={['Tidy my room']} outstandingMinutes={10} />
      </div>
    </div>
  )
}
