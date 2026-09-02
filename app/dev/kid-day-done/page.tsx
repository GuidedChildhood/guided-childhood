'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import KidDayDone from '@/components/kid/KidDayDone'
import type { StepKey } from '@/lib/kid/five-a-day'

// Dev only fixture: the Day done screen, every voice.
//
//   /dev/kid-day-done                    Bloop, an offline day, 4 day run
//   /dev/kid-day-done?buddy=digi         DiGi as the buddy
//   /dev/kid-day-done?days=10            the day a Friend is earned
//   /dev/kid-day-done?week=1             with the Monday to Sunday strip
//   /dev/kid-day-done?steps=jobs,lesson,balance,quiz,ask   a screen heavy day
//
// Never reachable in production.

export default function KidDayDoneFixture() {
  if (process.env.NODE_ENV === 'production') notFound()
  const [q, setQ] = useState<URLSearchParams | null>(null)
  const [open, setOpen] = useState(true)
  useEffect(() => { setQ(new URLSearchParams(window.location.search)) }, [])
  if (!q) return null
  const steps = (q.get('steps') ?? 'jobs,printable,lesson,balance,ask').split(',') as StepKey[]
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--kid-bg)', fontFamily: 'var(--font-body)' }}>
      {open ? (
        <KidDayDone
          day={{ streak: Number(q.get('run') ?? 4), completedDays: Number(q.get('days') ?? 7), steps }}
          childName={q.get('name') ?? 'Alfie'}
          buddy={q.get('buddy') ?? 'bloop'}
          weekStrip={q.get('week') === '1'}
          onClose={() => setOpen(false)}
        />
      ) : (
        <button onClick={() => setOpen(true)} style={{ margin: 20 }}>Open again</button>
      )}
    </div>
  )
}
