'use client'

import { KidSchoolBanner } from '@/app/k/[token]/KidQuestScreen'

// Dev harness for the child's side of the homework early reminders
// (lib/school/lead-up.ts): a project in its reminder window, on the slim home
// line and on the full banner. Made up data; the film kit records it.
const SOON = [{ id: 's', title: 'Anderson shelter project', kind: 'homework', time: null, when: 'soon' as const, daysLeft: 5 }]

export default function KidHomeworkSoonHarness() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100dvh', padding: '30px 20px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <KidSchoolBanner token="000000000000000000" weekCount={2} items={SOON} slim />
        <div style={{ height: 18 }} />
        <KidSchoolBanner token="000000000000000000" weekCount={2} items={SOON} />
      </div>
    </main>
  )
}
