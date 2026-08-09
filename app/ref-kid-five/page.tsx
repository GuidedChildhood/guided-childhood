'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { pickDay } from '@/lib/kid/five-a-day'
import KidFiveADay from '@/components/kid/KidFiveADay'
import KidStreakTakeover from '@/components/kid/KidStreakTakeover'

// Fixture reference page for the five a day card and the streak takeover, so
// both can be screenshotted without a database. Not linked from anywhere,
// 404s in production via middleware like every ref-* page.
//
// ?view=part    a day partly done: slim ticked lines, ONE live step, the
//               rest hidden behind the count. The ordinary state.
// ?view=fresh   nothing done yet, the first step leading
// ?view=done    every step ticked, folded to the one proud line
// ?view=streak  the takeover at five days, the moment a friend is earned
//
// This used to copy the card's markup because the component owned its fetch.
// The component takes initialState now precisely so this page can render the
// REAL KidFiveADay: a fixture that renders less than production certifies
// nothing.

function Fixture() {
  const view = useSearchParams().get('view') ?? 'part'
  const [open, setOpen] = useState(view === 'streak')
  const steps = pickDay('fixture-child', '2026-08-03')
  const done = view === 'done' || view === 'streak' ? steps : view === 'fresh' ? [] : steps.slice(0, 2)
  const complete = done.length === steps.length

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--kid-bg)', padding: '22px 16px 50px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: '0 0 16px',
        }}>
          Reference · the five a day, one step at a time · {view}
        </p>
        <KidFiveADay
          token="000000000000000000"
          childName="Alfie"
          jobsAllDone={false}
          jobsProgress={{ done: 1, total: 3 }}
          newQuestCount={view === 'fresh' ? 2 : 0}
          readingMinutes={20}
          moveJobs={null}
          onOpenJobs={() => {}}
          initialState={{ day: '2026-08-03', steps, done, complete, streak: complete ? 5 : 4 }}
        />
      </div>
      {/* streak is the run of days, completedStreaks the cumulative count the
          Friends are bought with. Four of them lands one, so this fixture shows
          the friend earned state. */}
      {open && <KidStreakTakeover streak={5} completedStreaks={4} childName="Alfie" onClose={() => setOpen(false)} />}
    </div>
  )
}

export default function RefKidFive() {
  return <Suspense><Fixture /></Suspense>
}
