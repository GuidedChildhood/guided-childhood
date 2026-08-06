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

// A dated item on a named day of THIS week, so the calendar rows have real
// content whatever day the fixture is opened on.
function thisWeek(dow: number): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + ((dow + 6) % 7))
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${`${d.getDate()}`.padStart(2, '0')}`
}

const ACTIONS: SchoolAction[] = [
  {
    id: 'r1', kind: 'kit', title: 'Cubs', detail: null, due_date: null, due_time: '18:15',
    recurs_weekday: 5, auto_send_to_child: true, cleared_on: TODAY,
  },
  {
    id: 'r2', kind: 'homework', title: 'Reading record signed and in the bag', detail: null,
    due_date: null, recurs_weekday: 1, auto_send_to_child: true, cleared_on: null,
  },
  // The week view needs a mix to be worth looking at: a weekly routine with no
  // time, a dated one off, a timed appointment, and two things on one day.
  {
    id: 'r3', kind: 'kit', title: 'PE kit', detail: null, due_date: null,
    recurs_weekday: 4, auto_send_to_child: false, cleared_on: null,
  },
  {
    id: 'o1', kind: 'payment', title: 'Pay for the Warwick Castle trip', detail: null,
    due_date: thisWeek(3), due_time: null, recurs_weekday: null, auto_send_to_child: false, cleared_on: null,
  },
  {
    id: 'o2', kind: 'event', title: 'Class assembly', detail: null,
    due_date: thisWeek(3), due_time: '09:15', recurs_weekday: null, auto_send_to_child: false, cleared_on: null,
  },
  {
    id: 'o3', kind: 'deadline', title: 'Return the consent form', detail: null,
    due_date: thisWeek(1), due_time: null, recurs_weekday: null, auto_send_to_child: false, cleared_on: null,
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
