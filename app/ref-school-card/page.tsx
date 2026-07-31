import SchoolActionsCard, { type SchoolAction } from '@/components/school/SchoolActionsCard'

// Layout fixture for the school reminders card, which otherwise only renders
// behind a login. The weekly routine below is the one from Justin's screenshot:
// a Friday routine that auto sends to the child AND has been cleared for today,
// which is the combination that carries the most controls and so is the one
// that used to run off the right edge of a phone.
//
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

const TODAY = new Date().toISOString().slice(0, 10)

const ACTIONS: SchoolAction[] = [
  {
    id: 'r1', kind: 'kit', title: 'Cubs', detail: null, due_date: null,
    recurs_weekday: 5, auto_send_to_child: true, cleared_on: TODAY,
  },
  {
    id: 'r2', kind: 'homework', title: 'Reading record signed and in the bag', detail: null,
    due_date: null, recurs_weekday: 1, auto_send_to_child: true, cleared_on: null,
  },
]

export default function RefSchoolCardPage() {
  return (
    <main style={{ background: 'var(--butter)', minHeight: '100vh', padding: '20px 16px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <SchoolActionsCard actions={ACTIONS} childName="Teo" />
      </div>
    </main>
  )
}
