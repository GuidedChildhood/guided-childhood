import KidSchoolWeek, { type KidWeekItem } from '@/components/kid/KidSchoolWeek'
import { HAPPY } from '@/components/kid/HappyNewsBits'
import KidWeekMasthead from '@/components/kid/KidWeekMasthead'
import { buddyFor } from '@/lib/kid/buddy'

// Dev fixture: the child's own week page, on the white page with the painted
// rainbow masthead and their Friend (14 September 2026, the Happy News note). Mirrors app/k/[token]/week/page.tsx,
// which needs a real link; this needs nothing. No token, so no add button.

export const dynamic = 'force-dynamic'

const monday = (() => { const d = new Date(); const day = (d.getDay() + 6) % 7; d.setDate(d.getDate() - day); return d })()
const iso = (offset: number) => { const d = new Date(monday); d.setDate(monday.getDate() + offset); return d.toISOString().slice(0, 10) }

const ITEMS: KidWeekItem[] = [
  { id: '1', title: 'PE kit', kind: 'kit', dueDate: null, weekday: 2, time: '08:30', clearedOn: null, addedBy: 'parent', runsInHolidays: false },
  { id: '2', title: 'Forest school', kind: 'kit', dueDate: null, weekday: 3, time: null, clearedOn: null, addedBy: 'child', runsInHolidays: false },
  { id: '3', title: 'Trip money', kind: 'payment', dueDate: iso(4), weekday: null, time: null, clearedOn: null, addedBy: 'parent', runsInHolidays: false },
  { id: '4', title: 'Swimming', kind: 'club', dueDate: null, weekday: 6, time: '10:00', clearedOn: null, addedBy: 'parent', runsInHolidays: true },
]

export default function KidSchoolWeekFixture() {
  const buddy = buddyFor('pebble')
  return (
    <div style={{
      minHeight: '100dvh', fontFamily: 'var(--font-body)',
      background: HAPPY.cream,
      padding: 'calc(18px + env(safe-area-inset-top)) 16px 50px',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink)', marginBottom: 14, background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 'var(--radius-pill)', padding: '7px 14px 7px 10px', boxShadow: `0 3px 0 ${HAPPY.ink}` }}>‹ Back</span>
        <KidWeekMasthead
          title="Jonny's week"
          sub="School things and your own reminders, on the day they land. Tap a day to see it."
          friend={{ name: buddy.name, img: buddy.img }}
        />
        <KidSchoolWeek items={ITEMS} childName="Jonny" region="uk" />
      </div>
    </div>
  )
}
