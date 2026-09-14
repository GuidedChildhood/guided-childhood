'use client'

import { useEffect, useState } from 'react'
import KidAskScreenTime from '@/components/kid/KidAskScreenTime'
import { buddyFor } from '@/lib/kid/buddy'

// Dev fixture: ask for screen time, the child's page (14 September 2026).
//
//   /dev/kid-ask               stars in the bank, four family screens
//   /dev/kid-ask?none=1        no minutes ready, still can ask
//   /dev/kid-ask?sent=1        lands on the wait, an ask pending
//   /dev/kid-ask?yes=1         the yes is in, the Start button
//   /dev/kid-ask?block=1       a before screens job still to do
//
// The send posts to the real route with a fixture token and fails, which
// shows the did not send line; the states above are what to look at.

export default function KidAskFixture() {
  const [q, setQ] = useState<URLSearchParams | null>(null)
  useEffect(() => { setQ(new URLSearchParams(window.location.search)) }, [])
  if (!q) return null
  const b = buddyFor('bloop')
  const none = q.get('none') === '1'
  return (
    <KidAskScreenTime
      token="0123456789abcdef01"
      childName="Jonny"
      friend={{ name: b.name, img: b.img }}
      devices={[
        { id: 'd1', kind: 'tv', label: 'Living room TV', emoji: '📺' },
        { id: 'd2', kind: 'tablet', label: 'The iPad', emoji: '📲' },
        { id: 'd3', kind: 'console', label: 'Switch', emoji: '🎮' },
        { id: 'd4', kind: 'computer', label: 'Family laptop', emoji: '💻' },
      ]}
      balanceStars={none ? 0 : 8}
      starMinutes={5}
      coreMinutesLeft={none ? 0 : 15}
      holidayMinutes={0}
      recommendedMinutes={75}
      usedTodayMinutes={20}
      asksFirst
      jobsLeft={[{ title: 'Tidy my room', emoji: '🧺', minutes: 10 }, { title: 'One hour of outside play', emoji: '🌳', minutes: 20 }]}
      blockingJobs={q.get('block') === '1' ? ['Phone charges outside the bedroom'] : []}
      fiveLeft={['Move about', 'Ten minutes reading']}
      dealLines={['7pm on school nights, later at weekends', 'Jobs earn stars, stars buy screen time']}
      initialAsk={q.get('sent') === '1' ? { id: 'a1', device: 'tv', minutes: 30, status: 'pending' } : q.get('yes') === '1' ? { id: 'a1', device: 'tv', minutes: 30, status: 'approved' } : null}
    />
  )
}
