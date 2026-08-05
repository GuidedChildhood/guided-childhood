'use client'

import PassportToDo from '@/components/pathway/PassportToDo'
import type { ParentToDo, ChildToDo } from '@/lib/pathway/passport-todo'

// Layout harness for the TO DO above the passport. Three states side by side at
// a phone width: a family with work to do and a child on the app, the same
// family with no child app, and a family with nothing open. The Send button
// posts for real, so the first card is for looking rather than clicking.

const ITEMS: ParentToDo[] = [
  { key: 'devices', emoji: '🔧', label: 'Devices set up', detail: 'To set up', href: '/dashboard/devices', help: '', ongoing: false },
  { key: 'lessons', emoji: '📚', label: 'Lessons and tests', detail: '2 of 6', href: '/dashboard/lessons?stage=2', help: '', ongoing: false },
  { key: 'jobs', emoji: '⭐', label: 'Jobs and routines', detail: 'Jobs to do', href: '/dashboard/quests', help: '', ongoing: true },
  { key: 'balance', emoji: '⚖️', label: 'Screen balance', detail: 'Log a week', href: '/dashboard/stats', help: '', ongoing: true },
]

const CHILD_ITEMS: ChildToDo[] = [
  { key: 'lessons', emoji: '📚', line: '4 lessons to watch with a grown up' },
  { key: 'jobs', emoji: '⭐', line: 'your jobs ticked off this week' },
]

export default function Page() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto' }}>
        <PassportToDo childId="teo" childName="Teo" items={ITEMS} childItems={CHILD_ITEMS} onApp />
        <PassportToDo childId="alma" childName="Alma" items={ITEMS} childItems={CHILD_ITEMS} onApp={false} />
        <PassportToDo childId="mia" childName="Mia" items={[]} childItems={[]} onApp />
      </div>
    </main>
  )
}
