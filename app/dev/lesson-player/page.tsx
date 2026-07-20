import { notFound } from 'next/navigation'
import LessonPlayer from '@/components/lessons/LessonPlayer'
import type { LessonSlide } from '@/lib/content/lesson-slides'

// Dev only fixture: the cinematic player with a sample Rosenshine deck so
// the design can be checked without a database or a signed in parent.
// ?slide=N opens at that slide, ?class=1 renders the whole class projector
// mode. Never reachable in production.

export const dynamic = 'force-dynamic'

const SLIDES: LessonSlide[] = [
  {
    type: 'concept', phase: 'teach', minutes: 2, emoji: '🧲',
    heading: 'The feed is built to hold you',
    body: 'Every scroll is a guess about what keeps you watching one more minute. The app is not being kind when it shows you exactly what you love. It is doing its job, and its job is your attention.',
  },
  {
    type: 'choice', phase: 'practise', minutes: 2,
    question: 'The feed keeps showing you videos you love. Why?',
    options: [
      { text: 'It is learning what holds my attention, so I stay longer', correct: true, feedback: 'Exactly. The feed works for the app, not for you. Knowing that is the superpower.' },
      { text: 'It likes me and wants to be kind', correct: false, feedback: 'It feels that way, and that is the clever part. The feed is a machine guessing what keeps you watching.' },
      { text: 'It is random, nobody chooses', correct: false, feedback: 'It is the opposite of random. Every video is a guess about what holds you one more minute.' },
    ],
  },
  {
    type: 'digi', phase: 'close', minutes: 1, heading: 'DiGi says',
    lines: [
      'The feed is a machine, and now you know its trick.',
      'You can enjoy it and still be the one in charge.',
      'Watching with your eyes open is the whole skill.',
    ],
  },
]

export default async function LessonPlayerFixturePage({ searchParams }: { searchParams: Promise<{ slide?: string; class?: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound()
  const sp = await searchParams
  const slideIndex = Math.max(0, Number(sp.slide) || 0)
  const classMode = sp.class === '1'
  return (
    <LessonPlayer
      lessonId="00000000-0000-0000-0000-000000000000"
      lessonSource="lesson"
      slides={SLIDES}
      backHref="/dev/lesson-player"
      completeEndpoint={null}
      classMode={classMode}
      initialIndex={slideIndex}
      badges={{ keyStage: 'KS2/3', strand: 'Managing online information' }}
    />
  )
}
