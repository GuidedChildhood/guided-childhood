import KidPath, { type PathJob, type PathLesson, type PathGame } from '@/components/kid/KidPath'
import { quizForBand } from '@/lib/content/school-quizzes'

// Fixture reference page: the REAL child path with made up jobs, so the when
// capsule on each job stone can be seen and screenshotted without a kid link.
// Not linked from anywhere, the same as every other ref- page here.
//
// The jobs deliberately arrive in the order a parent might have added them,
// bedtime one first, so the screenshot proves the day ordering is doing its
// job rather than the fixture flattering it.

export const dynamic = 'force-dynamic'

const JOBS: PathJob[] = [
  { id: 'j1', title: 'Clothes ready for tomorrow', emoji: '👕', stars: 1, state: 'todo', band: 'evening' },
  { id: 'j2', title: 'Empty or load the dishwasher', emoji: '🍽️', stars: 2, state: 'todo', band: 'after_school' },
  { id: 'j3', title: 'Bed made', emoji: '🛏️', stars: 1, state: 'todo', band: 'morning' },
  { id: 'j4', title: 'Twenty minutes lost in a book', emoji: '📚', stars: 3, state: 'waiting', band: 'after_school' },
]
// Sorted the way the real page sorts them, so this shows the shipped order.
const ORDER = { morning: 0, after_school: 1, evening: 2 } as const
const SORTED = [...JOBS].sort((a, b) => ORDER[a.band] - ORDER[b.band])

const LESSONS: PathLesson[] = [
  { id: 'l1', title: 'What a strong password is', emoji: '🔐', done: false, score: null, locked: false },
]
const GAMES: PathGame[] = [{ key: 'sort-it', title: 'Sort it out', emoji: '🎮' }]

export default function RefKidPathPage() {
  return (
    <KidPath
      token="ref"
      childName="Teo"
      stageId={2}
      stageName="Builder"
      ages="8 to 10"
      stamp="🛡️"
      jobs={SORTED}
      lessons={LESSONS}
      games={GAMES}
      quiz={quizForBand('8-10')}
      dayIndex={3}
      chestClaimed={false}
      quizClaimed={false}
      usedTodayMinutes={30}
      guideMinutes={95}
      balanceStars={12}
    />
  )
}
