'use client'

import { useState } from 'react'
import SetupQuest from '@/components/setup/SetupQuest'
import { visibleSteps, type SetupFlags } from '@/lib/setup/steps'

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

// In list order: home screen, children, share. The middle states are the ones
// worth looking at, because they are where the green ticks stack up above the
// live card, which is the whole point of the 15 August change.
const STATES: { label: string; flags: SetupFlags; about?: boolean }[] = [
  // A family who joined on the one tap stage check with no name or birth month
  // (14 November 2026): Tell us about your child leads, the four follow.
  { label: 'Joined on one tap', about: true, flags: { aboutChild: false, homeScreen: false, children: false, coreTime: false, childLink: false } },
  { label: 'Fresh',      flags: { aboutChild: true, homeScreen: false, children: false, coreTime: false, childLink: false } },
  { label: 'One done',   flags: { aboutChild: true, homeScreen: true, children: false, coreTime: false, childLink: false } },
  { label: 'Two done',   flags: { aboutChild: true, homeScreen: true,  children: true, coreTime: false, childLink: false } },
  { label: 'Three done', flags: { aboutChild: true, homeScreen: true,  children: true,  coreTime: true, childLink: false } },
  { label: 'All done',   flags: { aboutChild: true, homeScreen: true,  children: true,  coreTime: true, childLink: true } },
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
              border: '1.5px solid var(--border)', borderRadius: 'var(--radius-tile)', padding: '8px 14px', cursor: 'pointer',
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
              : STATES[i].about ? 'Five things and you are set' : 'Four things and you are set'}
          </h1>
        </div>
        <SetupQuest
          flags={STATES[i].flags}
          steps={visibleSteps({ about: STATES[i].about })}
          signupAge={STATES[i].about ? { years: 9, on: '2026-11-14' } : null}
          child={{ id: 'devfixture-child', name: STATES[i].about ? 'Your child' : 'Olga' }}
          children={STATES[i].about
            ? [{ id: 'devfixture-child', name: 'Your child', age_band: '8-10', linked: false, noPhone: false, dob: null }]
            : [
                { id: 'devfixture-child', name: 'Olga', age_band: '8-10', linked: false, noPhone: false },
                { id: 'devfixture-child-2', name: 'Teo', age_band: '11-13', linked: false, noPhone: false },
              ]}
          userId="devfixture-user"
        />
      </div>
    </div>
  )
}
