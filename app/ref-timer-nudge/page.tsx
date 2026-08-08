'use client'

import { ChildRow, type Kid } from '@/components/quests/ParentDeviceTime'

// Layout fixture for the jobs left nudge that sits above the screen timer's
// Start button.
//
// It only appears for a logged in parent whose child has jobs due today and
// unticked, which no fixture can reach through the API, so the row is rendered
// directly with a made up child instead. A layout nobody can look at is a
// layout nobody has checked, and I shipped this one once already saying so.
//
// Three cases, because the banner has three and only one is interesting.
//
// 404s in production via middleware, like every other ref-* page.

const BASE: Kid = {
  id: '00000000-0000-0000-0000-0000000000aa',
  name: 'Teo',
  balance: 17,
  session: null,
  trust: 'ask',
  request: null,
  ageBand: '13-15',
  usedToday: 0,
  recommended: 90,
  week: [],
  sessionsToday: 0,
  giftOwed: 0,
  agreedAt: new Date().toISOString(),
}

// Ten and the real first title, because that is Justin's own family: the
// quests board says "0 of 10 done today" and the longest job name in there is
// the one most likely to wrap badly next to a button.
const CASES: [string, Kid][] = [
  ['Jobs left today, the case Justin asked for', { ...BASE, jobsLeft: { count: 10, first: 'Build, draw or make something real' } }],
  ['One left, so the sentence has to stay singular', { ...BASE, jobsLeft: { count: 1, first: 'Tidy your room' } }],
  ['Nothing left, and therefore no banner at all', { ...BASE, jobsLeft: { count: 0, first: null } }],
]

export default function RefTimerNudge() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '24px 16px 60px' }}>
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 16px',
        }}>
          Reference · jobs left before the timer
        </p>
        {CASES.map(([label, kid]) => (
          <div key={label} style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', fontWeight: 700, margin: '0 0 8px' }}>
              {label}
            </p>
            <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16, padding: 14 }}>
              <ChildRow kid={kid} onChange={() => {}} onAlarm={() => {}} />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
