'use client'

import { useEffect, useState } from 'react'

import SchoolActionsCard, { type SchoolAction } from '@/components/school/SchoolActionsCard'

// Dev harness for the homework early reminders (19 November 2026): a two week
// project with both early reminders, a five day one with three days before,
// and a kit item with none. Dates are worked out from today so it never ages.
const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10)
const added = new Date().toISOString()

const ACTIONS: SchoolAction[] = [
  { id: '00000000-0000-4000-8000-000000000001', kind: 'homework', title: 'Anderson shelter project', detail: 'Make a model shelter at home, shoebox size, and bring it in.', due_date: day(12), created_at: added, child_name: 'Teo', remind_ready: true },
  { id: '00000000-0000-4000-8000-000000000002', kind: 'homework', title: 'Spelling test: words with ough', detail: null, due_date: day(5), created_at: added, child_name: 'Teo', remind_ready: true },
  { id: '00000000-0000-4000-8000-000000000003', kind: 'kit', title: 'Wellies for forest school', detail: null, due_date: day(3), created_at: added, child_name: 'Olga' },
]

export default function SchoolRemindersHarness() {
  // ?only=project shows the long project alone, for the film of that card.
  const [only, set] = useState(false)
  useEffect(() => { set(new URLSearchParams(window.location.search).get('only') === 'project') }, [])
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 40px' }}>
      <SchoolActionsCard key={String(only)} actions={only ? ACTIONS.slice(0, 1) : ACTIONS} childName="Teo" />
    </div>
  )
}
