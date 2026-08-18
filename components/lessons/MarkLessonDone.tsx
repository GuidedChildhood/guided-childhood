'use client'

import { useState } from 'react'
import { currentChildId } from '@/lib/children/current'

export default function MarkLessonDone({
  lessonId,
  lessonSource,
  initialDone,
}: {
  lessonId: string
  lessonSource: 'lesson' | 'ai_lesson'
  initialDone: boolean
}) {
  const [done, setDone] = useState(initialDone)
  const [pending, setPending] = useState(false)

  const toggle = async () => {
    setPending(true)
    const wasDone = done
    setDone(!wasDone)
    try {
      await fetch('/api/lessons/complete', {
        method: wasDone ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        // child_id so the parent's pass is recorded for the child they have
        // open, not for the household. Sent on the DELETE too, so un ticking
        // removes the same row it added. See lib/children/current.
        body: JSON.stringify({ lesson_id: lessonId, lesson_source: lessonSource, child_id: currentChildId() }),
      })
    } catch { /* non-blocking */ }
    setPending(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={done ? 'btn btn-outline' : 'btn btn-gold'}
      style={{ width: '100%', justifyContent: 'center', fontSize: 'var(--text-base)', marginBottom: '16px' }}
    >
      {done ? 'Completed ✓' : 'Mark as done'}
    </button>
  )
}
