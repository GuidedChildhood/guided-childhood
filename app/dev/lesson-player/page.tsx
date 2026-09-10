import { notFound } from 'next/navigation'
import LessonPlayer from '@gc/shared/components/LessonPlayer'
import ReadingAhead from '@/components/lessons/ReadingAhead'
import type { LessonSlide } from '@gc/shared/lesson-slides'

// Dev only fixture: the cinematic player with a sample Rosenshine deck so
// the design can be checked without a database or a signed in parent.
// ?slide=N opens at that slide, ?class=1 renders the whole class projector
// mode, ?projector=1 the classroom type scale on its own. Never reachable in
// production.
//
// PROJECTOR WAS MISSING HERE, which is its own small joke: the fixture that
// exists so the design can be checked could not render the surface most
// likely to be wrong. Class mode implies it, because class mode IS the
// projector showcase, and the flag stands alone so the teach route's exact
// combination (projector without the family finish) can be looked at too.

export const dynamic = 'force-dynamic'

const SLIDES: LessonSlide[] = [
  {
    type: 'title', phase: 'connect', minutes: 1,
    eyebrow: 'Explorer stage', title: 'How the feed decides what you see',
    character: 'football',
    body: 'A five minute look inside the machine.',
  },
  {
    type: 'keywords', phase: 'starter', minutes: 1, heading: 'Words on the board',
    words: [
      { word: 'watch time', meaning: 'The one number the feed is built to grow.' },
      { word: 'signals', meaning: 'Pauses, replays, likes: everything the machine reads.' },
    ],
  },
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
    type: 'recap', phase: 'close', minutes: 1, heading: 'The lesson in three lines',
    points: [
      'The feed has one job: your watch time.',
      'It reads signals, not feelings.',
      'See the machine, and you hold the controls.',
    ],
  },
  {
    type: 'tryit', phase: 'close', minutes: 1, heading: 'Retrain one feed this week',
    body: 'Pick a topic you actually want more of and spend ten minutes deliberately pausing on, liking and finishing only that. Watch the feed obey you over the week.',
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

export default async function LessonPlayerFixturePage({ searchParams }: { searchParams: Promise<{ slide?: string; class?: string; projector?: string; ahead?: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound()
  const sp = await searchParams
  const slideIndex = Math.max(0, Number(sp.slide) || 0)
  const classMode = sp.class === '1'
  const projector = classMode || sp.projector === '1'
  // ?ahead=1 renders the reading ahead notice above the player, the way the
  // real lesson page does when a parent opens a lesson above their child's
  // stage. Added 10 September 2026 with the notice itself, so the one thing
  // standing between a parent and "I did a lesson and nothing happened" can be
  // looked at without a signed in session and a child of exactly the wrong age.
  const ahead = sp.ahead === '1'
  return (
    <LessonPlayer
      lessonId="00000000-0000-0000-0000-000000000000"
      lessonSource="lesson"
      slides={SLIDES}
      backHref="/dev/lesson-player"
      completeEndpoint={null}
      classMode={classMode}
      projector={projector}
      initialIndex={slideIndex}
      badges={{ keyStage: 'KS2/3', strand: 'Managing online information' }}
      notice={ahead ? (
        <ReadingAhead stageLabel="Explorer · Ages 11 to 13" childName="Tester" childStageName="Foundation" />
      ) : null}
    />
  )
}
