import LessonsBrowser, { type WatchItem, type LibraryItem } from '@/app/(dashboard)/dashboard/lessons/LessonsBrowser'

// Layout fixture for the Watch together tab at each stage. 404s in production
// via middleware, like every other ref-* page.
//
// Justin, 16 September 2026, with a screenshot of this tab on a 13 to 15 year
// old reading "Nothing written for this stage yet": "is it true? I'm sure we
// have lessons, if not let's build them."
//
// Checked against the live database: ten films exist and all ten are Stage 1,
// so there genuinely is no film at her stage. Her Lessons tab holds 39 real
// lessons, so the word "written" was the wrong one and read as the product
// having nothing for her at all.
//
// ?stage=1  a child the films WERE made for: no notice at all
// ?stage=2  inside the film years but not filmed yet: the warm catch up
// ?stage=4  past them: what the format is for, and the lessons that are hers
//
// The numbers below mirror production on 16 September 2026, taken from the
// database rather than invented, so what this page shows is what a parent sees.

const FILMS: { code: string; title: string; strand: string }[] = [
  { code: '1.1', title: 'Me on a screen and me in real life', strand: 'identity' },
  { code: '1.5', title: 'Real or pretend?', strand: 'misinformation' },
  { code: '1.2', title: 'Kind words on screens', strand: 'kindness' },
  { code: '1.4', title: 'When screens make you sad', strand: 'feelings' },
  { code: '1.3', title: 'The internet remembers', strand: 'privacy' },
  { code: '1.7', title: 'My privacy shield', strand: 'privacy' },
  { code: '1.8', title: 'Someone made that', strand: 'algorithms' },
  { code: '1.6', title: 'Screens, sleep and growing bodies', strand: 'bodies' },
  { code: '1.9', title: 'Some voices are not people', strand: 'screens' },
  { code: '1.10', title: 'The Yes No Button', strand: 'screens' },
]

const watchItems: WatchItem[] = FILMS.map((f, i) => ({
  code: f.code, stageNum: 1, stageName: '', title: f.title,
  catchphrase: '', strand: f.strand, posterUrl: null,
  journeyStep: i + 1, duration: '10 min', done: false,
}))

// Enough lessons at each stage to render the real counts. Only the stage and
// the count matter to the block this fixture exists for.
const STAGE_LESSON_COUNTS: Record<number, number> = { 1: 17, 2: 19, 3: 18, 4: 39, 5: 17 }

function lessonsFor(stageNum: number): LibraryItem[] {
  return Array.from({ length: STAGE_LESSON_COUNTS[stageNum] ?? 0 }, (_, i) => ({
    id: `lesson-${stageNum}-${i}`,
    href: '#',
    stageNum, stageLabel: '', stageAges: '',
    categoryLabel: 'Screens',
    title: `A lesson you lead, number ${i + 1}`,
    keyMessage: 'The one thing to leave them with.',
    locked: false, done: false, attempted: false, score: null,
    ks: '', strand: 'screens', coverUrl: null, deep: true, module: false,
  }))
}

export default async function RefWatchStages({
  searchParams,
}: { searchParams: Promise<{ stage?: string }> }) {
  const { stage } = await searchParams
  const stageNum = Number(stage) >= 1 && Number(stage) <= 5 ? Number(stage) : 4
  const libraryItems = [1, 2, 3, 4, 5].flatMap(lessonsFor)

  return (
    <main style={{ background: 'var(--app-bg)', minHeight: '100vh', padding: '20px 20px 48px' }}>
      <p className="eyebrow" style={{ marginBottom: 10 }}>
        Watch together, stage {stageNum}
      </p>
      <LessonsBrowser
        childId={null}
        childName={stageNum >= 3 ? 'Bumble' : 'Teo'}
        childStageNum={stageNum}
        watchItems={watchItems}
        libraryItems={libraryItems}
      />
    </main>
  )
}
