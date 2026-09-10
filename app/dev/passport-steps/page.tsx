'use client'

import { useEffect, useState } from 'react'
import PassportToDo from '@/components/pathway/PassportToDo'
import type { ParentToDo, ChildToDo } from '@/lib/pathway/passport-todo'

// The passport's step runner, with fixture data.
//
// ?app=0 renders the family with no app, which is the path that matters most
// here: it is the one that used to offer a Send button that could do nothing
// for them, and it is the one that now carries the lines to say out loud.
// ?done=1 renders a page with nothing open.

const ITEMS: ParentToDo[] = [
  { key: 'devices', emoji: '🔧', label: 'Devices set up', detail: 'Add yours', href: '/dashboard/devices', help: 'Measured against the screens you listed as yours.', ongoing: false },
  { key: 'moments', emoji: '💬', label: 'Moments to resolve', detail: '2 to resolve', href: '/dashboard/moments', help: 'Open a moment and mark it resolved.', ongoing: false },
  { key: 'lessons', emoji: '📚', label: 'Lessons and tests', detail: '0 of 18', href: '/dashboard/lessons', help: 'Watch each lesson, then pass its check.', ongoing: false },
  { key: 'jobs', emoji: '⭐', label: 'Jobs and routines', detail: 'Set a job', href: '/dashboard/quests', help: 'Goes green once the jobs are being done on time.', ongoing: true },
]

const CHILD: ChildToDo[] = [
  { key: 'lessons', emoji: '📚', line: '18 lessons to watch with a grown up' },
  { key: 'jobs', emoji: '⭐', line: 'your jobs ticked off this week' },
]

export default function DevPassportSteps() {
  const [onApp, setOnApp] = useState(true)
  const [done, setDone] = useState(false)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    setOnApp(q.get('app') !== '0')
    setDone(q.get('done') === '1')
  }, [])
  return (
    <main style={{ background: 'var(--app-bg)', minHeight: '100dvh', padding: '22px 20px 120px' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <p className="eyebrow" style={{ marginBottom: 4 }}>Dev fixture</p>
        <h1 style={{ fontSize: 'clamp(1.6rem, 6vw, 2.1rem)', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
          Passport steps
        </h1>
        <PassportToDo
          childId="00000000-0000-0000-0000-000000000000"
          childName="Alma"
          items={done ? [] : ITEMS}
          childItems={done ? [] : CHILD}
          onApp={onApp}
          stageName="Stage 3, Explorer"
        />
      </div>
    </main>
  )
}
