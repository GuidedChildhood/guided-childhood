'use client'

import { useState } from 'react'
import LessonPlayer from '@gc/shared/components/LessonPlayer'
import type { LessonSlide } from '@gc/shared/lesson-slides'
import type { Register } from '@gc/shared/friend-register'
import type { CharacterKey } from '@gc/shared/schools-curriculum'

// The lesson on a shared lesson page, behind one button (5 November 2026).
//
// The player takes the whole screen the moment it mounts, which is right on a
// lesson page and wrong here: the parent note is what a parent opened the
// link for, so it reads first and the lesson starts when they choose. The
// player's close goes back to this same page, which shows the note again.
// Records nothing (completeEndpoint null): no completion, no answers, no child.

export default function SharedLessonStart({ lessonId, slides, backHref, character, register }: {
  lessonId: string
  slides: LessonSlide[]
  backHref: string
  character?: CharacterKey
  register?: Register
}) {
  const [open, setOpen] = useState(false)
  if (!open) {
    return (
      <button type="button" className="btn btn-gold" onClick={() => setOpen(true)} style={{ minHeight: 52, fontSize: 'var(--text-md)' }}>
        Start the lesson
      </button>
    )
  }
  return (
    <LessonPlayer
      lessonId={lessonId}
      lessonSource="school_lesson"
      slides={slides}
      backHref={backHref}
      audience="together"
      character={character}
      register={register}
      completeEndpoint={null}
    />
  )
}
