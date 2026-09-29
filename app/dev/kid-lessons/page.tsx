import { notFound } from 'next/navigation'
import KidLessonList from '@/components/kid/KidLessonList'

// Dev only fixture: the child's My lessons list with sample data, so the
// kid surface can be checked without a kid link or a database. Never
// reachable in production.
//
// Since 29 September 2026 the list is the school version of each lesson, so
// the sample rows are real school modules with their own "I can" lines.
// ?together=1 shows the Foundation wording (do these with your grown up).

export const dynamic = 'force-dynamic'

export default async function KidLessonsFixturePage({ searchParams }: { searchParams: Promise<{ together?: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound()
  const together = (await searchParams).together === '1'
  return (
    <KidLessonList
      backHref="/dev/kid-lessons"
      childName={together ? 'Teo' : 'Alfie'}
      stageName={together ? 'Foundation' : 'Builder'}
      ages={together ? 'Ages 4 to 6' : 'Ages 7 to 10'}
      together={together}
      items={together ? [
        { id: 'fx-1', title: 'Screens and kindness, real and not real', emoji: '🎬', keyMessage: 'I can ask a grown up if something on a screen is real.', done: true, score: 3, locked: false },
        { id: 'fx-2', title: 'Kind screens, calm bodies', emoji: '🎬', keyMessage: 'I can name how I feel after screen time and tell a grown up.', done: false, score: null, locked: false },
        { id: 'fx-3', title: 'Real, pretend, or made by a computer', emoji: '🎬', keyMessage: 'I can spot that a picture might not be real.', done: false, score: null, locked: false },
      ] : [
        { id: 'fx-1', title: 'Screen routines that work', emoji: '🎬', keyMessage: 'I can build one screen routine that works and stick to it.', done: true, score: 4, locked: false },
        { id: 'fx-2', title: 'Gaming: time, intensity and spend', emoji: '🎬', keyMessage: 'I can spot when a game is trying to get me to spend.', done: false, score: null, locked: false },
        { id: 'fx-3', title: 'How algorithms work', emoji: '🎬', keyMessage: 'I can explain why my feed keeps me watching.', done: false, score: null, locked: true },
      ]}
      hrefFor={() => '#'}
    />
  )
}
