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

const stamps: Stamp[] = [1, 2, 3, 4, 5].map(id => ({
  id,
  name: NAMES[id - 1],
  ages: AGES[id - 1],
  pct: id === 3 ? 62 : id < 3 ? 100 : 0,
  status: id < 3 ? 'earned' : id === 3 ? 'current' : 'upcoming',
  href: '/dashboard/lessons',
  lessonsDone: 3, lessonsTotal: 5,
  scriptsPct: 60, streakPct: 75, devicesPct: 80, lessonsPct: 60,
  sections: [
    {
      key: 'devices', emoji: '🔧', label: 'Devices set up', pct: 80, detail: '80%',
      href: '/dashboard/devices',
      help: 'Measured against the 3 screens you listed as yours.',
      ...(id === 3 ? { alert: 'Smartphone is set up ahead of their age. Worth a look together.' } : {}),
    },
    {
      key: 'moments', emoji: '💬', label: 'Moments to resolve',
      pct: id === 3 ? 40 : 0, detail: id === 3 ? '3 to resolve' : 'Later',
      href: '/dashboard/moments',
      help: 'Open a moment, use the words it gives you, and mark it resolved.',
    },
    {
      key: 'lessons', emoji: '📚', label: 'Lessons and tests', pct: 60, detail: '3 of 5',
      href: '/dashboard/lessons',
      help: 'Watch or lead each lesson, then pass its check.',
    },
    {
      key: 'jobs', emoji: '⭐', label: 'Jobs and routines',
      pct: id === 3 ? 100 : 0, detail: id === 3 ? '4 day streak' : 'Later',
      href: '/dashboard/quests',
      help: 'Goes green once the jobs are set and being done on time.',
      ongoing: true,
    },
    {
      key: 'balance', emoji: '⚖️', label: 'Screen balance',
      pct: id === 3 ? 50 : 0, detail: id === 3 ? 'A bit over' : 'Later',
      href: '#screen-balance',
      help: 'Goes green when the week averages at or under the healthy amount.',
      ongoing: true,
    },
  ],
}))

export default function Page() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: 20 }}>
      <PassportBook stamps={stamps} childName="Teo" />
    </main>
  )
}
