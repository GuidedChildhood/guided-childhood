import KidPath, { type PathJob, type PathLesson, type PathGame, type PathPrintable } from '@/components/kid/KidPath'
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
  { id: 'j2', title: 'Empty or load the dishwasher', emoji: '🍽️', stars: 2, state: 'waiting', band: 'after_school' },
  { id: 'j3', title: 'Bed made', emoji: '🛏️', stars: 1, state: 'waiting', band: 'morning' },
  { id: 'j4', title: 'Twenty minutes lost in a book', emoji: '📚', stars: 3, state: 'waiting', band: 'after_school' },
]
// Sorted the way the real page sorts them, so this shows the shipped order.
const ORDER = { morning: 0, after_school: 1, evening: 2 } as const
const SORTED = [...JOBS].sort((a, b) => ORDER[a.band] - ORDER[b.band])

const LESSONS: PathLesson[] = [
  { id: 'l1', title: 'What a strong password is', emoji: '🔐', done: false, score: null, locked: false },
]
const GAMES: PathGame[] = [{ key: 'sort-it', title: 'Sort it out', emoji: '🎮' }]

// A printable sitting untouched, which is the shape of the screen Justin sent:
// the jobs above it are with the grown up, so the glow lands on the one stone
// in the trail a child cannot finish by themselves. It must not gate the rest.
const PRINTABLES: PathPrintable[] = [
  { key: 'reading-bucket', title: 'My Reading Bucket List', emoji: '🖍️', stars: 5, sheetUrl: '#', status: 'todo' },
]

// ?claimed=1 claims the chest, which walks the glow forward onto the printable.
// That is the state Justin's screen was in, and the one worth checking: the
// trail must not grey out below a stone a child cannot finish alone.
export default async function RefKidPathPage({
  searchParams,
}: { searchParams: Promise<{ claimed?: string }> }) {
  const { claimed } = await searchParams
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
      printables={PRINTABLES}
      quiz={quizForBand('8-10')}
      dayIndex={3}
      chestClaimed={claimed === '1'}
      quizClaimed={false}
      usedTodayMinutes={30}
      guideMinutes={95}
      balanceStars={12}
    />
  )
}
