import TodayPathBig from '@/components/daily/TodayPathBig'
import type { TodayLoopTask } from '@/lib/pathway/daily-tasks'

// Layout fixture for today's path on Home. Add ?done=1 for the finished day,
// which is the case that now folds to a single line. 404s in production via
// middleware, like every other ref-* page.

const STEPS: Omit<TodayLoopTask, 'done'>[] = [
  { key: 'checkin', label: 'Check in', href: '/dashboard/checkin' },
  { key: 'moment', label: 'A moment', href: '/dashboard/moments' },
  { key: 'script', label: 'The words', href: '/dashboard/scripts' },
  { key: 'digi', label: 'Ask DiGi', href: '/dashboard/digi' },
]

export default async function RefTodayPath({
  searchParams,
}: { searchParams: Promise<{ done?: string }> }) {
  const { done } = await searchParams
  const allDone = done === '1'

  const tasks: TodayLoopTask[] = [
    ...STEPS.map((s, i) => ({ ...s, done: allDone || i === 0 })),
    { key: 'done', label: 'Done', href: '/dashboard', done: allDone },
  ]

  return (
    <main style={{ background: 'var(--butter)', minHeight: '100vh', padding: '20px 16px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <TodayPathBig tasks={tasks} dailyMinutes={10} childName="Teo" streakCount={4} />
      </div>
    </main>
  )
}
