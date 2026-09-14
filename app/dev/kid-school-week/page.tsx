import KidSchoolWeek, { type KidWeekItem } from '@/components/kid/KidSchoolWeek'
import { HAPPY, Plate } from '@/components/kid/HappyNewsBits'
import { buddyFor } from '@/lib/kid/buddy'

// Dev fixture: the child's own week page, on the dotted sky with their Friend
// (14 September 2026, the Kenji note). Mirrors app/k/[token]/week/page.tsx,
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
      background: `radial-gradient(circle at 12px 10px, ${HAPPY.coral}55 3px, transparent 3.5px), radial-gradient(circle at 36px 30px, ${HAPPY.butter}88 3px, transparent 3.5px), var(--tint-blue, #D8E8F8)`,
      backgroundSize: '48px 40px, 48px 40px, auto',
      padding: 'calc(18px + env(safe-area-inset-top)) 16px 50px',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--ink)', marginBottom: 14, background: '#fff', border: `2px solid ${HAPPY.ink}`, borderRadius: 'var(--radius-pill)', padding: '7px 14px 7px 10px', boxShadow: `0 3px 0 ${HAPPY.ink}` }}>‹ Back</span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 7vw, 2.1rem)', letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0, color: 'var(--ink)' }}>Jonny&apos;s week</h1>
          <Plate size={72} tint={HAPPY.butterLt}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={buddy.img} alt={buddy.name} width={56} height={56} style={{ width: 56, height: 56, objectFit: 'contain', display: 'block' }} />
          </Plate>
        </div>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 18px' }}>
          School things and your own reminders, on the day they land. Tap a day to see it.
        </p>
        <KidSchoolWeek items={ITEMS} childName="Jonny" region="uk" />
      </div>
    </div>
  )
}
