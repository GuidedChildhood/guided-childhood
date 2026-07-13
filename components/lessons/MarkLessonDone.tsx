'use client'

import { useState } from 'react'

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
        body: JSON.stringify({ lesson_id: lessonId, lesson_source: lessonSource }),
      })
    } catch { /* non-blocking */ }
    setPending(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={done ? 'btn btn-outline' : 'btn btn-gold'}
      style={{ width: '100%', justifyContent: 'center', fontSize: '13px', marginBottom: '16px' }}
    >
      {done ? 'Completed ✓' : 'Mark as done'}
    </button>
  )
}
