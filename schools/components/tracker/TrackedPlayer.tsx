'use client'

import { useCallback, useEffect } from 'react'
import LessonPlayer from '@gc/shared/components/LessonPlayer'
import { markStep } from '@gc/shared/schools-progress'

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

export default function TrackedPlayer({ moduleId, ...props }: PlayerProps & { moduleId: string }) {
  useEffect(() => { markStep(moduleId, 'board') }, [moduleId])
  const onFinish = useCallback(() => { markStep(moduleId, 'taught') }, [moduleId])
  return <LessonPlayer {...props} onFinish={onFinish} />
}
