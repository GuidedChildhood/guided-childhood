import PassportBook from '@/components/pathway/PassportBook'
import type { Stamp } from '@/components/pathway/PassportStamps'

// Layout harness for the passport's five section checklist. No auth, no data.
//
// It exists because this is exactly what went missing without anyone noticing:
// stamp.sections is optional, so a page that stopped passing it typechecked
// clean and PassportBook quietly fell back to the old four task list. Nothing
// short of opening the passport as a logged in parent would have shown it. This
// page makes the rich version openable in one click, with all four things that
// only render inside it: the how it goes green lines, the kept up not ticked
// off chips, the amber ahead of age alert, and the this stage footer.

const NAMES = ['Foundation', 'Builder', 'Explorer', 'Shaper', 'Independent']
const AGES = ['4 to 7', '8 to 10', '11 to 13', '13 to 15', '16 plus']

// ?stage=N opens on that page, ?full=1 renders every stage stamped and
// ?empty=1 renders a stage nobody has touched. Added 10 September 2026 with the
// five slots, because the whole point of drawing an unearned slot at full size
// is what an EMPTY page looks like, and until now the fixture only had one
// shape: a stage part way through.
const mkStamps = (mode: 'mixed' | 'full' | 'empty'): Stamp[] => [1, 2, 3, 4, 5].map(id => ({
  id,
  name: NAMES[id - 1],
  ages: AGES[id - 1],
  pct: mode === 'full' ? 100 : mode === 'empty' ? 0 : id === 3 ? 62 : id < 3 ? 100 : 0,
  status: mode === 'full' ? 'earned' : mode === 'empty' ? (id === 3 ? 'current' : 'upcoming') : id < 3 ? 'earned' : id === 3 ? 'current' : 'upcoming',
  href: '/dashboard/lessons',
  lessonsDone: 3, lessonsTotal: 5,
  scriptsPct: 60, streakPct: 75, devicesPct: 80, lessonsPct: 60,
  sections: [
    {
      key: 'devices', emoji: '🔧', label: 'Devices set up',
      pct: mode === 'full' ? 100 : mode === 'empty' ? 0 : 80,
      detail: mode === 'full' ? 'Done' : mode === 'empty' ? '0%' : '80%',
      href: '/dashboard/devices',
      help: 'Measured against the 3 screens you listed as yours.',
      ...(id === 3 && mode === 'mixed' ? { alert: 'Smartphone is set up ahead of their age. Worth a look together.' } : {}),
    },
    {
      key: 'moments', emoji: '💬', label: 'Moments to resolve',
      pct: mode === 'full' ? 100 : mode === 'empty' ? 0 : id === 3 ? 40 : 0,
      detail: mode === 'full' ? 'Done' : id === 3 && mode === 'mixed' ? '3 to resolve' : 'Later',
      href: '/dashboard/moments',
      help: 'Open a moment, use the words it gives you, and mark it resolved.',
    },
    {
      key: 'lessons', emoji: '📚', label: 'Lessons and tests',
      pct: mode === 'full' ? 100 : mode === 'empty' ? 0 : 60,
      detail: mode === 'full' ? '5 of 5' : mode === 'empty' ? '0 of 5' : '3 of 5',
      href: '/dashboard/lessons',
      help: 'Watch or lead each lesson, then pass its check.',
    },
    {
      key: 'jobs', emoji: '⭐', label: 'Jobs and routines',
      pct: mode === 'full' ? 100 : mode === 'empty' ? 0 : id === 3 ? 100 : 0,
      detail: mode === 'full' ? '12 day streak' : id === 3 && mode === 'mixed' ? '4 day streak' : 'Later',
      href: '/dashboard/quests',
      help: 'Goes green once the jobs are set and being done on time.',
      ongoing: true,
    },
    {
      key: 'balance', emoji: '⚖️', label: 'Screen balance',
      pct: mode === 'full' ? 100 : mode === 'empty' ? 0 : id === 3 ? 50 : 0,
      detail: mode === 'full' ? 'On track' : id === 3 && mode === 'mixed' ? 'A bit over' : 'Later',
      href: '/dashboard/stats',
      help: 'Goes green when the week averages at or under the healthy amount.',
      ongoing: true,
    },
  ],
}))

export default async function Page({ searchParams }: { searchParams: Promise<{ stage?: string; full?: string; empty?: string; notimer?: string }> }) {
  const sp = await searchParams
  const mode = sp.full === '1' ? 'full' : sp.empty === '1' ? 'empty' : 'mixed'
  const stage = Number(sp.stage) || null
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: 20 }}>
      <PassportBook
        stamps={mkStamps(mode)}
        childName="Teo"
        currentStage={3}
        openAtStage={stage && stage >= 1 && stage <= 5 ? stage : null}
        passportCode="GC-4K7X-92"
        childId="00000000-0000-0000-0000-000000000000"
        onApp
        // The child's own numbers, so the strip at the foot of their page can
        // be looked at. ?notimer=1 is the nudge case: a week with no session
        // means screen balance above is reporting on nothing measured.
        childRead={{ daysDone: 12, stars: 8, timerDays: sp.notimer === '1' ? 0 : 4 }}
      />
    </main>
  )
}
