import LessonsBrowser, { type LibraryItem, type WatchItem } from '@/app/(dashboard)/dashboard/lessons/LessonsBrowser'

// A harness for the Lessons browser, built for the bug Justin found on his
// phone: "This button doesn't [work] it should show just the age related
// lessons."
//
// The browser had no fixture at all, so the one control a parent uses to get to
// their own child's lessons had never been driven outside a signed in session.
// This renders it on a bare page with a Stage 4 child and lessons spread across
// all five stages, which is the shape that makes the fault visible: the chip
// row overflows, so the selected chip sits off screen and the filter looks like
// it is not on.
//
// Deliberately opens on the Lessons view, because that is where the button is.

// Was force-static. It now takes ?child=<1..5> so both sides of the module age
// gate can be looked at: a Foundation child must not be offered a module whose
// earliest lesson is ages 11 to 13, and an Explorer child must be.
export const dynamic = 'force-dynamic'

const CATEGORIES = ['safety', 'privacy', 'wellbeing', 'misinformation', 'identity', 'bullying']

function lessons(): LibraryItem[] {
  const out: LibraryItem[] = []
  const perStage = [6, 6, 6, 8, 4]
  const stages = [
    { num: 1, label: 'Foundation', ages: '4 to 7' },
    { num: 2, label: 'Builder', ages: '8 to 10' },
    { num: 3, label: 'Explorer', ages: '11 to 13' },
    { num: 4, label: 'Shaper', ages: '13 to 15' },
    { num: 5, label: 'Independent', ages: '16 and up' },
  ]
  for (const s of stages) {
    for (let i = 0; i < perStage[s.num - 1]; i++) {
      const cat = CATEGORIES[i % CATEGORIES.length]
      out.push({
        // The banner only counts ids that start with lesson-, the family
        // library set, so the fixture has to use real looking ids or the card
        // under test never renders.
        id: `lesson-s${s.num}-${i}`,
        href: '#',
        stageNum: s.num,
        stageLabel: s.label,
        stageAges: s.ages,
        categoryLabel: cat,
        title: `Stage ${s.num} lesson ${i + 1}`,
        keyMessage: 'A one line message so the tile has something to say.',
        locked: false,
        // A few passed at the child's own stage, so the banner reads like the
        // screenshot: "Stage 4 lessons, 3 of 29 passed".
        done: s.num === 4 && i < 3,
        attempted: false,
        score: null,
        ks: s.num <= 2 ? 'KS1' : 'KS3',
        strand: 'Online relationships',
        coverUrl: null,
        deep: i % 2 === 0,
        module: false,
      })
    }
  }
  return out
}

// The Social Media Ready module as it really is on the live database: nine
// lessons, four at Explorer, three at Shaper, two at Independent, and NOTHING
// at Foundation or Builder. That shape is the whole bug of 10 September, so
// the fixture carries it exactly rather than a tidy spread.
function moduleLessons(): LibraryItem[] {
  const shape = [[3, 4], [4, 3], [5, 2]] as const
  const out: LibraryItem[] = []
  for (const [stageNum, count] of shape) {
    for (let i = 0; i < count; i++) {
      out.push({
        id: `lesson-mod${stageNum}-${i}`,
        href: '#',
        stageNum,
        stageLabel: `Stage ${stageNum}`,
        stageAges: '',
        categoryLabel: 'safety',
        title: `Social media lesson ${stageNum}.${i + 1}`,
        keyMessage: 'One line so the tile has something to say.',
        locked: false, done: false, attempted: false, score: null,
        ks: 'KS3', strand: 'Online relationships', coverUrl: null,
        deep: true, module: true,
      })
    }
  }
  return out
}

function films(): WatchItem[] {
  return [1, 2, 3].map(n => ({
    code: `w${n}`,
    stageNum: n,
    stageName: `Stage ${n}`,
    title: `Watch together ${n}`,
    catchphrase: 'A short line under the poster.',
    strand: 'screens',
    posterUrl: null,
    journeyStep: n,
    duration: '4 min',
    done: false,
  }))
}

export default async function LessonsFilterFixture({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child } = await searchParams
  const n = Number(child)
  const childStageNum = Number.isInteger(n) && n >= 1 && n <= 5 ? n : 4
  // The same 20px gutters the real page has. Without them this fixture
  // reported a 21px overflow that the product does not have: the sticky filter
  // bar runs full bleed with margin 0 -20px, which needs a 20px padded column
  // to cancel against. A fixture that lies about the layout is worse than no
  // fixture, now that the overflow check reads it.
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 20px' }}>
      <LessonsBrowser
        childId="fixture-child"
        childName="Teo"
        childStageNum={childStageNum}
        watchItems={films()}
        libraryItems={[...lessons(), ...moduleLessons()]}
        initialView="library"
      />
    </div>
  )
}
