import PassportBook from '@/components/pathway/PassportBook'
import PathwayIntro from '@/components/pathway/PathwayIntro'
import type { Stamp } from '@/components/pathway/PassportStamps'

// Fixture reference page: the REAL passport book with made up stamps, so the
// print mark in the corner can be seen against the burgundy cover and against
// a coloured inner page without a logged in parent. Not linked from anywhere.
//
// The post stamp offer line cannot be reached from here, because it only fires
// when a page crosses to earned during a visit, which is a localStorage fact
// about a real family. That is the correct behaviour and the reason it is not
// faked: an offer that appears on a page nobody just earned is exactly the
// thing the change was made to avoid.

export const dynamic = 'force-dynamic'

const STAMPS: Stamp[] = [
  { id: 1, name: 'Foundation', ages: 'Ages 4 to 7', pct: 100, status: 'earned', href: '#',
    lessonsDone: 6, lessonsTotal: 6, scriptsPct: 100, streakPct: 100, devicesPct: 100, lessonsPct: 100 },
  // Deliberately a family who moved on without stamping Builder, so the
  // "pages behind you" prompt is visible here at all. A fixture where nothing
  // is ever left behind cannot check the one state that exists because
  // something was.
  { id: 2, name: 'Builder', ages: 'Ages 8 to 10', pct: 62, status: 'catchup', href: '#',
    lessonsDone: 4, lessonsTotal: 7, scriptsPct: 80, streakPct: 55, devicesPct: 100, lessonsPct: 57 },
  { id: 3, name: 'Explorer', ages: 'Ages 11 to 13', pct: 34, status: 'current', href: '#',
    lessonsDone: 3, lessonsTotal: 8, scriptsPct: 40, streakPct: 25, devicesPct: 60, lessonsPct: 38 },
  { id: 4, name: 'Shaper', ages: 'Ages 13 to 15', pct: 0, status: 'upcoming', href: '#',
    lessonsDone: 0, lessonsTotal: 8, scriptsPct: 0, streakPct: 0, devicesPct: 0, lessonsPct: 0 },
  { id: 5, name: 'Independent', ages: 'Age 16', pct: 0, status: 'upcoming', href: '#',
    lessonsDone: 0, lessonsTotal: 6, scriptsPct: 0, streakPct: 0, devicesPct: 0, lessonsPct: 0 },
]

// ?stage=2 opens straight onto Builder, which is what a parent arriving from
// "See your passport fill" after a lesson gets. Without it the book rests on
// its cover, which is right for browsing and is the default.
export default async function RefPassportBookPage({
  searchParams,
}: { searchParams: Promise<{ stage?: string }> }) {
  const { stage } = await searchParams
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 48px' }}>
      {/* The collapsed intro is here for the same reason the book is: the real
          page is behind a login, and the one thing that has to be checked on a
          phone is how much of the screen is spent before the passport starts. */}
      <div className="pathway-hero">
        <PathwayIntro kidLabel="Teo" childCount={1} />
        <PassportBook openAtStage={stage ? Number(stage) : null} stamps={STAMPS} childName="Teo" />
      </div>
    </div>
  )
}
