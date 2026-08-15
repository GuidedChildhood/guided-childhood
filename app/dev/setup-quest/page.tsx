'use client'

import { useState } from 'react'
import SetupQuest from '@/components/setup/SetupQuest'
import type { SetupFlags } from '@/lib/setup/steps'

// Dev harness for the Setup Quest (components/setup/SetupQuest.tsx).
//
// The real page is three server reads behind auth, and the container blocks
// supabase.co, so a headless signup cannot reach it. This renders the same
// component over the same shell with the flags driven by hand, which is the
// only way to see all four states at 390 and 1280 in one sitting.
//
// The four that matter: nothing done, so step one is live and two and three
// wait; the middle of it, so a number that is not 1 leads and the numbering has
// not renumbered itself; step three alone; and everything done, which is the
// only state that should show a button off this page.

// In list order: agreement, home screen, children, share. The middle two states
// are the ones worth looking at, because they are where the green ticks stack
// up above the live card, which is the whole point of the 15 August change.
const STATES: { label: string; flags: SetupFlags }[] = [
  { label: 'Fresh',      flags: { agreement: false, homeScreen: false, children: false, childLink: false } },
  { label: 'One done',   flags: { agreement: true,  homeScreen: false, children: false, childLink: false } },
  { label: 'Two done',   flags: { agreement: true,  homeScreen: true,  children: false, childLink: false } },
  { label: 'Three done', flags: { agreement: true,  homeScreen: true,  children: true,  childLink: false } },
  { label: 'All done',   flags: { agreement: true,  homeScreen: true,  children: true,  childLink: true } },
]

export default function SetupQuestDevPage() {
  const [i, setI] = useState(0)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px 20px 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {STATES.map((s, n) => (
          <button
            key={s.label}
            onClick={() => setI(n)}
            style={{
              border: '1.5px solid var(--border)', borderRadius: 12, padding: '8px 14px', cursor: 'pointer',
              background: i === n ? 'var(--terracotta)' : '#fff', color: 'var(--ink)',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Remounted per state so the reveal animation runs again, which is half
          of what there is to check here. */}
      <div key={STATES[i].label} style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 20px 48px' }}>
        <div style={{ marginBottom: '18px' }}>
          <p className="eyebrow" style={{ marginBottom: '4px' }}>Setting up</p>
          <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '8px' }}>
            {Object.values(STATES[i].flags).every(Boolean)
              ? 'Setup Quest'
              : 'Four things and you are set'}
          </h1>
        </div>
        <SetupQuest
          flags={STATES[i].flags}
          child={{ id: 'devfixture-child', name: 'Olga' }}
          userId="devfixture-user"
        />
      </div>
    </div>
  )
}
