'use client'

import { useState } from 'react'
import ShardCharacter from '@/components/pathway/ShardCharacter'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'

// The welcome, the Duolingo way but slower and warmer. On first open, DiGi's
// five Sparks come up ONE AT A TIME, each saying hello and which stage earns
// it, so a child meets the whole family before the app. Then they appear all
// together around DiGi, and one Lets go button drops into the app. Shown once,
// remembered in localStorage. No character to pick here: a child only ever
// chooses from the Sparks they have actually earned, inside the app.

const SEEN_KEY = 'gc_kid_squad_intro_seen'

export function squadIntroSeen(): boolean {
  try { return localStorage.getItem(SEEN_KEY) === '1' } catch { return true }
}

export default function KidSquadIntro({ childName, onDone }: { childName: string; onDone: () => void }) {
  const [step, setStep] = useState(0) // 0..4 = each Spark, 5 = the family
  const total = STAGE_CHARACTERS.length
  const onFamily = step >= total

  function next() {
    if (step < total) setStep(s => s + 1)
    else finish()
  }
  function finish() {
    try { localStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
    onDone()
  }

  const name = childName && childName !== 'Your child' ? childName : 'friend'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 80, background: 'var(--kid-bg, #FFF9EC)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '28px 22px', textAlign: 'center',
    }}>
      {/* Skip, quiet, top right */}
      <button onClick={finish} style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-muted)' }}>
        Skip
      </button>

      {!onFamily ? (
        (() => {
          const c = STAGE_CHARACTERS[step]
          return (
            <div key={c.stageId} style={{ animation: 'gcIntroIn 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 360 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 18 }}>
                {step === 0 ? `Welcome ${name}! Meet DiGi's Sparks` : `Spark ${step + 1} of ${total}`}
              </div>
              <ShardCharacter accent={c.accent} sparkles={c.sparkles} size={150} />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 8vw, 2.2rem)', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '14px 0 4px' }}>
                {c.name}
              </div>
              <div style={{
                background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px',
                padding: '14px 18px', boxShadow: '0 4px 0 rgba(26,26,46,0.06)', marginTop: 6, marginBottom: 24,
              }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)', lineHeight: 1.4, margin: 0 }}>
                  {c.intro}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '9px 0 0' }}>
                  Earn me at Stage {c.stageId} · {c.role}
                </p>
              </div>
            </div>
          )
        })()
      ) : (
        <div style={{ animation: 'gcIntroIn 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 380 }}>
          <div style={{ marginBottom: 10 }}>
            <DigiCharacter mood="happy" size={92} />
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
            {STAGE_CHARACTERS.map(c => (
              <ShardCharacter key={c.stageId} accent={c.accent} sparkles={c.sparkles} size={54} idle={false} />
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 7vw, 2rem)', color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Together we make DiGi!
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 22px' }}>
            Earn one Spark at a time, all the way to the whole star. Look out for jobs to do, and friendly tips your grown up sends from their app. Ready {name}?
          </p>
        </div>
      )}

      <button
        onClick={next}
        style={{
          background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '16px',
          padding: '15px 30px', cursor: 'pointer', minWidth: 200,
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px',
          boxShadow: '0 5px 0 var(--terracotta-dark)',
        }}
      >
        {onFamily ? "Let's go! ⭐" : 'Next ▶'}
      </button>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
        {Array.from({ length: total + 1 }).map((_, i) => (
          <span key={i} style={{ width: i === step ? 20 : 7, height: 7, borderRadius: 100, background: i === step ? 'var(--terracotta)' : 'var(--border)', transition: 'width 0.25s ease' }} />
        ))}
      </div>

      <style>{`@keyframes gcIntroIn { from { opacity: 0; transform: translateY(10px) scale(0.96) } to { opacity: 1; transform: translateY(0) scale(1) } }`}</style>
    </div>
  )
}
