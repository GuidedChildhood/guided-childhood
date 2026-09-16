import TodayPathBig from '@/components/daily/TodayPathBig'
import type { TodayLoopTask } from '@/lib/pathway/daily-tasks'

// Layout fixture for today's path on Home. Add ?done=1 for the finished day,
// which is the case that now folds to a single line. 404s in production via
// middleware, like every other ref-* page.
//
// ?clear=1 is the state Justin reported on 16 September: Quests settled with
// nothing owed, which used to paint a green tick for a family who had not
// touched their jobs in a week. It has to be visibly NOT a tick and visibly
// not skipped either, and that is a thing you can only judge by looking.

const STEPS: Omit<TodayLoopTask, 'done'>[] = [
  { key: 'checkin', label: 'Check in', href: '/dashboard/checkin' },
  { key: 'moment', label: 'A moment', href: '/dashboard/moments' },
  { key: 'script', label: 'The words', href: '/dashboard/scripts' },
  { key: 'quests', label: 'Quests', href: '/dashboard/quests' },
  // The rung that was dormant for six days: wired on 18 August, so the
  // fixture carries it to show the full road as a real family now sees it.
  { key: 'passport', label: 'Passport', href: '/dashboard/pathway?from=today' },
  { key: 'digi', label: 'Ask DiGi', href: '/dashboard/digi' },
]

export default async function RefTodayPath({
  searchParams,
}: { searchParams: Promise<{ done?: string; clear?: string }> }) {
  const { done, clear } = await searchParams
  const allDone = done === '1'
  const showClear = clear === '1'

  const tasks: TodayLoopTask[] = [
    ...STEPS.map((s, i) => {
      // The check in is ticked, the road is open, and Quests is settled with
      // nothing owed. Three states on one screen, which is the only way to see
      // whether they actually read as three different things.
      if (showClear && s.key === 'quests') return { ...s, label: 'All clear', done: false, clear: true }
      return { ...s, done: allDone || i === 0 }
    }),
    { key: 'done' as const, label: 'Done', href: '/dashboard', done: allDone },
  ]

  return (
    <main style={{ background: 'var(--butter)', minHeight: '100vh', padding: '20px 16px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <TodayPathBig tasks={tasks} dailyMinutes={10} childName="Teo" streakCount={4} />
      </div>
    </main>
  )
}
