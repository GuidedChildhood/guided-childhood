import SchoolActionsCard from '@/components/school/SchoolActionsCard'
import FoldSection from '@/components/dashboard/FoldSection'

// Dev fixture for the school reminders card, in the shape Home renders it.
//
// Justin, 12 August 2026: "the from school has completely lost the new calendar
// system we built, please get it back."
//
// It had not been deleted. It was inside a fold that started closed, inside
// Home's own fold that also starts closed, so reaching the week grid was two
// taps and a scroll from the screen a parent opens most. This fixture wraps the
// card in the same outer FoldSection Home uses, because the bug only exists in
// that nesting and a fixture that renders the card bare would have shown a
// perfectly good calendar and proved nothing.
//
// A mix on purpose: a routine on its own day, one on another day, a dated one
// off, and one already cleared today, which is the set that exercises both the
// grid and countWaitingToday.

const ACTIONS = [
  { id: '1', kind: 'kit', title: 'PE kit', detail: 'Trainers and shorts', due_date: null, due_time: '08:30', sent_to_child: false, recurs_weekday: 2, auto_send_to_child: true, cleared_on: null, runs_in_holidays: false },
  { id: '2', kind: 'kit', title: 'Swimming', detail: null, due_date: null, due_time: '08:15', sent_to_child: true, recurs_weekday: 4, auto_send_to_child: false, cleared_on: null, runs_in_holidays: false },
  { id: '3', kind: 'payment', title: 'Trip money', detail: 'Twelve pounds for the museum', due_date: '2026-08-14', due_time: null, sent_to_child: false, recurs_weekday: null, auto_send_to_child: false, cleared_on: null, runs_in_holidays: false },
  { id: '4', kind: 'other', title: 'Reading record', detail: null, due_date: null, due_time: '15:30', sent_to_child: false, recurs_weekday: 3, auto_send_to_child: false, cleared_on: '2026-08-12', runs_in_holidays: true },
]

export default function SchoolWeekFixture() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <FoldSection label="School reminders" count={ACTIONS.length} open>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <SchoolActionsCard actions={ACTIONS as any} childName="Teo" region="uk" compact />
        </FoldSection>
      </div>
    </div>
  )
}
