'use client'

import { useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'

// The welcome, the Duolingo way but slower and warmer. On first open, DiGi's
// Planet Friends come up ONE AT A TIME, each saying hello and which stage earns
// them, so a child meets the whole team before the app. Then they gather around
// DiGi as a family, and one Lets go button drops into the app. Shown once,
// remembered in localStorage. No character to pick here: a child only ever
// chooses from the Friends they have actually earned, inside the app.

const SEEN_KEY = 'gc_kid_squad_intro_seen'

export function squadIntroSeen(): boolean {
  try { return localStorage.getItem(SEEN_KEY) === '1' } catch { return true }
}

export default function KidSquadIntro({ childName, onDone }: { childName: string; onDone: () => void }) {
  const [step, setStep] = useState(0) // 0..4 = each Friend, 5 = the family
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
      padding: '28px 22px', textAlign: 'center', overflowY: 'auto',
    }}>
      <button onClick={finish} style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-muted)' }}>
        Skip
      </button>

      {!onFamily ? (
        (() => {
          const c = STAGE_CHARACTERS[step]
          return (
            <div key={c.stageId} style={{ animation: 'gcIntroIn 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 360 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 16 }}>
                {step === 0 ? `Welcome ${name}! Meet the Planet Friends` : `Planet Friend ${step + 1} of ${total}`}
              </div>
              <div style={{
                width: 180, height: 180, borderRadius: '28px', overflow: 'hidden',
                background: '#fff', border: `3px solid ${c.colour}`,
                boxShadow: `0 8px 0 ${c.colour}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'gcIntroPop 0.55s cubic-bezier(0.34,1.56,0.64,1)',
              }}>
                <img src={c.img} alt={c.name} width={172} height={172} style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 8vw, 2.3rem)', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '14px 0 2px' }}>
                {c.name}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.colour, marginBottom: 10 }}>
                {c.action} · {c.ages}
              </div>
              <div style={{
                background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px',
                padding: '14px 18px', boxShadow: '0 4px 0 rgba(26,26,46,0.06)', marginBottom: 22,
              }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--ink)', lineHeight: 1.4, margin: 0 }}>
                  {c.intro}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '9px 0 0' }}>
                  Earn me when you reach Stage {c.stageId}
                </p>
              </div>
            </div>
          )
        })()
      ) : (
        <div style={{ animation: 'gcIntroIn 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 400 }}>
          <div style={{ marginBottom: 8 }}>
            <DigiCharacter mood="happy" size={84} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
            {STAGE_CHARACTERS.map(c => (
              <span key={c.key} style={{ width: 52, height: 52, borderRadius: '14px', overflow: 'hidden', border: `2px solid ${c.colour}`, background: '#fff' }}>
                <img src={c.img} alt={c.name} width={48} height={48} style={{ objectFit: 'cover' }} />
              </span>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 7vw, 2rem)', color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.1 }}>
            DiGi &amp; the Planet Friends
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 22px' }}>
            Each stage unlocks a new Planet Friend. Earn them one at a time, all the way to 16. Look out for jobs to do, and friendly tips your grown up sends from their app. Ready {name}?
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

      <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
        {Array.from({ length: total + 1 }).map((_, i) => (
          <span key={i} style={{ width: i === step ? 20 : 7, height: 7, borderRadius: 100, background: i === step ? 'var(--terracotta)' : 'var(--border)', transition: 'width 0.25s ease' }} />
        ))}
      </div>

      <style>{`
        @keyframes gcIntroIn { from { opacity: 0; transform: translateY(10px) scale(0.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes gcIntroPop { 0% { transform: scale(0.5); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  )
}
