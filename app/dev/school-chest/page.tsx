'use client'

import SchoolChest from '@/components/pathway/SchoolChest'

// The school chest, beside the road, in every state it has.
//
// Justin asked whether school should be a step stone on the pathway or a chest
// next to it. It is the chest, and the reasoning is in SchoolChest. This is
// where the closed and opened looks can be compared without a login, and where
// the no birthday case can be checked, since that is the one that has to name
// the child instead of a year group.
//
// Clear the opened state with localStorage.removeItem('gc.schoolchest.opened').

export default function SchoolChestFixture() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '28px 20px 60px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', display: 'grid', gap: 22 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0 }}>
          Reference · the school chest
        </p>
        <SchoolChest childName="Teo" yearLabel="Year 4, Autumn term" />
        {/* No birthday yet, so no year group. It has to still make sense. */}
        <SchoolChest childName="Teo" yearLabel={null} />
        {/* And with no name either, which is the day one state. */}
        <SchoolChest childName={null} yearLabel={null} />
      </div>
    </div>
  )
}
