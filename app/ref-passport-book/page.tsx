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
  // The real page renders the five row `sections` checklist, not the four task
  // fallback, so the fixture has to carry sections or it cannot check the thing
  // Justin screenshotted: five rows each with a three line explanation under it,
  // which is what made the page run to three screens.
  { id: 3, name: 'Explorer', ages: 'Ages 11 to 13', pct: 34, status: 'current', href: '#',
    lessonsDone: 3, lessonsTotal: 8, scriptsPct: 40, streakPct: 25, devicesPct: 60, lessonsPct: 38,
    sections: [
      { key: 'devices', emoji: '🔧', label: 'Devices set up', pct: 100, detail: 'All set', href: '#',
        help: 'Measured against the 4 screens you listed as yours. Work through the setup guide for each one, and add anything new the day it arrives.' },
      { key: 'moments', emoji: '💬', label: 'Moments to resolve', pct: 30, detail: '10 to resolve', href: '#',
        help: 'Open a moment, use the words it gives you, and mark it resolved when it is done.' },
      { key: 'lessons', emoji: '📚', label: 'Lessons and tests', pct: 21, detail: '3 of 14', href: '#',
        help: 'Watch or lead each lesson for this stage, then pass its check. A failed run does not count, so it can be retaken.' },
      { key: 'jobs', emoji: '⭐', label: 'Jobs and routines', pct: 60, detail: 'Jobs to do', href: '#', ongoing: true,
        help: 'Screen time earned from real world jobs, kept up across the stage rather than ticked off once.' },
      { key: 'balance', emoji: '⚖️', label: 'Screen balance', pct: 100, detail: 'On track', href: '#', ongoing: true,
        help: 'This week sits inside the guide for their age. It moves both ways, so it is worth a glance each week.' },
    ] },
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
        <PassportBook openAtStage={stage ? Number(stage) : null} currentStage={3} stamps={STAMPS} childName="Teo" />
      </div>
    </div>
  )
}
