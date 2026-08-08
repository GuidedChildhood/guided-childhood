'use client'

import KidSchoolWeek, { type KidWeekItem } from '@/components/kid/KidSchoolWeek'
import { KidSchoolBanner } from '@/app/k/[token]/KidQuestScreen'

// Layout fixture for the child's week from school.
//
// The real screen lives behind a kid link token and reads one family's
// school_actions, so there is no way to click your way to a busy week, an empty
// week or a week with a routine already ticked off. All three are rendered
// here instead.
//
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

function isoIn(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

// A real week from a real family: two routines that come back every week, a
// dated club, and a trip letter with a time on it.
const BUSY: KidWeekItem[] = [
  { id: 'a', title: 'PE kit, and the black shorts not the blue ones', kind: 'kit', dueDate: null, weekday: 2, time: null, clearedOn: null },
  { id: 'b', title: 'Reading record signed and in the bag', kind: 'homework', dueDate: null, weekday: 5, time: null, clearedOn: null },
  { id: 'c', title: 'Cubs', kind: 'event', dueDate: null, weekday: 4, time: '18:15', clearedOn: null },
  { id: 'd', title: 'Trip letter back in', kind: 'homework', dueDate: isoIn(1), time: '09:00', weekday: null, clearedOn: null },
  { id: 'e', title: 'Swimming kit', kind: 'kit', dueDate: isoIn(0), weekday: null, time: null, clearedOn: isoIn(0) },
]

// One thing, no time, nothing ticked. The commonest week there is.
const QUIET: KidWeekItem[] = [
  { id: 'q', title: 'PE kit', kind: 'kit', dueDate: null, weekday: 3, time: null, clearedOn: null },
]

export default function RefKidWeek() {
  return (
    <main style={{ background: 'var(--kid-bg)', minHeight: '100vh', padding: '24px 16px 60px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: '0 0 16px',
        }}>
          Reference · the child’s week from school
        </p>

        <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.72)', fontWeight: 700, margin: '0 0 8px' }}>
          A busy week, with today already ticked off
        </p>
        <KidSchoolWeek items={BUSY} childName="Teo" />

        <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.72)', fontWeight: 700, margin: '34px 0 8px' }}>
          One thing all week, and six empty days
        </p>
        <KidSchoolWeek items={QUIET} childName="Teo" />

        {/* The two ways in, from the child's home screen. */}
        <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.72)', fontWeight: 700, margin: '34px 0 8px' }}>
          The banner, with something due today
        </p>
        <KidSchoolBanner
          token="000000000000000000"
          weekCount={4}
          items={[
            { id: 'x', title: 'PE kit, black shorts', kind: 'kit', time: null, when: 'today' },
            { id: 'y', title: 'Trip letter back in', kind: 'homework', time: '09:00', when: 'tomorrow' },
          ]}
        />

        <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.72)', fontWeight: 700, margin: '26px 0 8px' }}>
          Nothing today, but the week is still worth a look
        </p>
        <KidSchoolBanner token="000000000000000000" weekCount={3} items={[]} />
      </div>
    </main>
  )
}
