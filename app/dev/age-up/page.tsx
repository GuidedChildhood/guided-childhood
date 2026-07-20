'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import ChildSwitcher from '@/components/children/ChildSwitcher'
import DigiGreeting from '@/components/home/DigiGreeting'
import { AGE_BAND_OPTIONS, getStageFromAgeBand } from '@/lib/content/stages'
import { bandForAge } from '@/lib/children/age'

// Dev only fixture: the multi child switcher over the Home greeting, and the
// settings birthday field, with sample data so both can be checked without a
// signed in parent. Never reachable in production.

const KIDS = [
  { id: 'fixture-1', name: 'Alfie', is_primary: true },
  { id: 'fixture-2', name: 'Maya', is_primary: false },
  { id: 'fixture-3', name: 'Teo', is_primary: false },
]

export default function AgeUpFixturePage() {
  if (process.env.NODE_ENV === 'production') notFound()
  const [dob, setDob] = useState('2015-07-21')
  const derivedBand = bandForAge(dob)
  const derivedOpt = derivedBand ? AGE_BAND_OPTIONS.find(o => o.value === derivedBand) : null
  const stage = derivedBand ? getStageFromAgeBand(derivedBand) : null
  void stage
  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px', background: 'var(--cream)', minHeight: '100vh' }}>
      <section id="switcher" style={{ padding: '16px 0 24px' }}>
        <ChildSwitcher kids={KIDS} selectedId="fixture-1" basePath="/dev/age-up" />
        <DigiGreeting
          firstName="Justin"
          childName="Alfie"
          stageName="Builder"
          stageNum={2}
          minutesLeft={8}
          dayDone={false}
          streakCount={5}
          aliveToday={true}
        />
      </section>

      <section id="birthday" style={{ padding: '8px 0 24px' }}>
        <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '18px', color: 'var(--ink)' }}>Alfie</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                Birthday
              </label>
              <input
                className="input"
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
              />
              <p style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '4px' }}>
                Set the birthday and everything grows up with them on its own.
              </p>
              {derivedOpt && (
                <p style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '2px' }}>
                  From this birthday: {derivedOpt.label} · {derivedOpt.sub}
                </p>
              )}
            </div>
            <button type="button" className="btn btn-green" style={{ alignSelf: 'flex-start', padding: '10px 24px', fontSize: '14px' }}>
              Save child details
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
