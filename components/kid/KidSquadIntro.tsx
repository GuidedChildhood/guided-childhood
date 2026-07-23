'use client'

import { useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAGE_CHARACTERS, characterForStage } from '@/lib/content/stage-characters'

// The welcome, the Duolingo way but slower and warmer. On first open a child
// meets the ONE Planet Friend they are on right now for their age, floating
// clean like DiGi (a cut out, no toy box). Then the whole family pops up one at
// a time as the goal: everyone they can earn on the way to 16. Shown once,
// remembered in localStorage. No character to pick here: a child only ever
// chooses from the Friends they have earned, inside the app.

const SEEN_KEY = 'gc_kid_squad_intro_seen'

export function squadIntroSeen(): boolean {
  try { return localStorage.getItem(SEEN_KEY) === '1' } catch { return true }
}

export default function KidSquadIntro({
  childName, currentStageId = 1, onDone,
}: {
  childName: string
  currentStageId?: number
  onDone: () => void
}) {
  const [step, setStep] = useState(0) // 0 = your Friend now, 1 = the family
  const current = characterForStage(Math.max(1, Math.min(5, currentStageId))) ?? STAGE_CHARACTERS[0]
  const onFamily = step >= 1
  const name = childName && childName !== 'Your child' ? childName : 'friend'

  function next() { if (!onFamily) setStep(1); else finish() }
  function finish() {
    try { localStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
    onDone()
  }

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
        <div style={{ animation: 'gcIntroIn 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 360 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 8 }}>
            Welcome {name}! This is your Planet Friend
          </div>
          {/* The current Friend, floating clean like DiGi, no box */}
          <img
            src={current.cutout} alt={current.name} width={200} height={200}
            style={{ objectFit: 'contain', filter: 'drop-shadow(0 12px 14px rgba(26,26,46,0.18))', animation: 'gcFriendPop 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 9vw, 2.4rem)', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '8px 0 2px' }}>
            {current.name}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: current.colour, marginBottom: 12 }}>
            {current.action} · {current.ages}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15.5px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 22px' }}>
            {current.blurb} {current.name} is here to help you {current.role}.
          </p>
        </div>
      ) : (
        <div style={{ animation: 'gcIntroIn 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 400 }}>
          <div style={{ marginBottom: 6 }}>
            <DigiCharacter mood="happy" size={78} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 7vw, 2rem)', color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 4, lineHeight: 1.1 }}>
            Meet the whole family
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
            Earn a new Planet Friend at every stage, all the way to 16.
          </p>
          {/* The family pops up one at a time */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 22, minHeight: 74 }}>
            {STAGE_CHARACTERS.map((c, i) => (
              <img
                key={c.key} src={c.cutout} alt={c.name} width={64} height={64}
                style={{
                  objectFit: 'contain', opacity: 0,
                  filter: 'drop-shadow(0 6px 6px rgba(26,26,46,0.14))',
                  animation: `gcFriendPop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.25 + i * 0.28}s forwards`,
                }}
              />
            ))}
          </div>
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
        {onFamily ? "Let's go! ⭐" : 'See who I can earn ▶'}
      </button>

      <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
        {[0, 1].map(i => (
          <span key={i} style={{ width: i === step ? 20 : 7, height: 7, borderRadius: 100, background: i === step ? 'var(--terracotta)' : 'var(--border)', transition: 'width 0.25s ease' }} />
        ))}
      </div>

      <style>{`
        @keyframes gcIntroIn { from { opacity: 0; transform: translateY(10px) scale(0.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes gcFriendPop { 0% { opacity: 0; transform: scale(0.4) translateY(12px) } 100% { opacity: 1; transform: scale(1) translateY(0) } }
      `}</style>
    </div>
  )
}
