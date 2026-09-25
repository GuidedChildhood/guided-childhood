'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import DayTickFlow from '@/components/daily/DayTickFlow'

// Layout fixture for the day's tick confirmation (components/daily/DayTickFlow).
// ?first=1 shows the family's first day, the getting started version, with two
// of the four moves already done. ?beat is not a param: tap Continue.
//
// 404s in production via middleware, like every other ref- page.

function Fixture() {
  const first = useSearchParams().get('first') === '1'
  return (
    <main style={{ background: 'var(--app-bg)', minHeight: '100vh' }}>
      <DayTickFlow
        firstDay={first ? {
          moves: [
            { key: 'share', emoji: '📲', label: 'Send Teo their app', why: 'Show them the code and it opens on their phone. Tick a job together to test it.', href: '#', done: true },
            { key: 'quests', emoji: '⭐', label: 'Set their first jobs', why: 'Jobs done earn screen time, so the deal runs itself.', href: '#', done: false },
            { key: 'school', emoji: '🏫', label: 'Add school reminders', why: 'Forward the school emails or photo a letter, and we pull out the dates.', href: '#', done: false },
            { key: 'home', emoji: '🔔', label: 'Home screen and reminders', why: 'One tap to open us, and a nudge at the times screens turn up.', href: '#', done: true },
          ],
        } : null}
        childName="Teo"
        minutes={10}
        streak={first ? 1 : 4}
        doneLabels={['Check in']}
        left={3}
        next={{ label: 'A lesson together', href: '#' }}
        facts={{ next_line: 'A lesson day: the next one on the path' } as never}
        onClose={() => {}}
      />
    </main>
  )
}

export default function RefDayTick() {
  return <Suspense fallback={null}><Fixture /></Suspense>
}
