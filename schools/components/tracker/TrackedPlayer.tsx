'use client'

import { useCallback, useEffect, useState } from 'react'
import LessonPlayer from '@gc/shared/components/LessonPlayer'
import { markStep } from '@gc/shared/schools-progress'
import { useYourSchool } from '@/components/YourSchoolLead'
import BeforeSlideOne from './BeforeSlideOne'

// The player, with the two signals a classroom actually gives off.
//
// THE BOARD IS READY the moment this route is open, because that is what
// opening it means: the lesson is on the screen the class will watch.
//
// YOU TAUGHT IT when the deck reaches its finish, which the player now
// reports through `onFinish`. Not a button, not a page visit: the last slide.
//
// A THIN WRAPPER ON PURPOSE. The teach route is a server component and cannot
// hand the player a function, and the player should not know what a tracker
// is. So the knowing lives here, in the schools app, where the memory lives.

type PlayerProps = React.ComponentProps<typeof LessonPlayer>

export default function TrackedPlayer({ moduleId, flagged = false, young = false, ...props }: PlayerProps & {
  moduleId: string
  // One of the seventeen safeguarding flagged lessons (FLAGGED_MODULES), and
  // whether it is a KS1 one, which changes what the quiet exit sounds like.
  flagged?: boolean
  young?: boolean
}) {
  useEffect(() => { markStep(moduleId, 'board') }, [moduleId])
  const onFinish = useCallback(() => { markStep(moduleId, 'taught') }, [moduleId])
  // The safeguarding lead this screen was told about, for the slides that
  // ask who to tell. Same reasoning as the tracker: the route cannot read
  // the browser and the player should not know what a Hub is, so the
  // knowing lives here.
  const schoolLead = useYourSchool()
  // A flagged lesson opened at its start shows the teacher one screen first
  // (BeforeSlideOne, sync plan F1). Stepping back in mid lesson from the run
  // sheet (?slide=N) goes straight to that slide: that teacher has already
  // seen it today. The board counts as ready either way, above.
  const [started, setStarted] = useState(() => !flagged || (props.initialIndex ?? 0) > 0)
  const start = useCallback(() => setStarted(true), [])
  if (!started) return <BeforeSlideOne young={young} onStart={start} />
  return <LessonPlayer {...props} schoolLead={schoolLead} scriptFolded={flagged} onFinish={onFinish} />
}
