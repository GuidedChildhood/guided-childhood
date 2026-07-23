'use client'

import { useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAGE_CHARACTERS, characterForStage } from '@/lib/content/stage-characters'

// The welcome, the Duolingo way but slower and warmer. Four gentle steps on
// first open: DiGi says you earn more Friends by doing jobs and earning device
// time, then the child meets the Planet Friend they are on right now, then the
// whole family pops up as the goal, then DiGi explains how streaks unlock the
// next Friend. Shown once, remembered in localStorage. No character to pick
// here: a child only ever chooses from the Friends they have earned, in the app.

const SEEN_KEY = 'gc_kid_squad_intro_seen'
const STEPS = 4

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
  const [step, setStep] = useState(0)
  const current = characterForStage(Math.max(1, Math.min(5, currentStageId))) ?? STAGE_CHARACTERS[0]
  const name = childName && childName !== 'Your child' ? childName : 'friend'

  function next() { if (step < STEPS - 1) setStep(step + 1); else finish() }
  function finish() {
    try { localStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
    onDone()
  }

  const btnLabel = ['Meet my friends ▶', 'See the whole family ▶', 'How do I earn them? ▶', "Let's go! ⭐"][step]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 80, background: 'var(--kid-bg, #FFF9EC)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '28px 22px', textAlign: 'center', overflowY: 'auto',
    }}>
      <button onClick={finish} style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-muted)' }}>
        Skip
      </button>

      {/* Step 0: DiGi says how you earn more Friends */}
      {step === 0 && (
        <div key="s0" style={{ animation: 'gcIntroIn 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 360 }}>
          <div style={{ animation: 'gcFriendPop 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <DigiCharacter mood="happy" size={128} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 8vw, 2.2rem)', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '14px 0 6px', lineHeight: 1.1 }}>
            Hi {name}! I'm DiGi
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
            Do your jobs and earn time on your devices, and you will earn more of me and my whole family of Planet Friends.
          </p>
        </div>
      )}

      {/* Step 1: the Friend they are on right now, floating clean like DiGi */}
      {step === 1 && (
        <div key="s1" style={{ animation: 'gcIntroIn 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 360 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 8 }}>
            This is your Planet Friend
          </div>
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
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15.5px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
            {current.blurb} {current.name} is here to help you {current.role}.
          </p>
        </div>
      )}

      {/* Step 2: meet the whole family, popping up one at a time */}
      {step === 2 && (
        <div key="s2" style={{ animation: 'gcIntroIn 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 400 }}>
          <div style={{ marginBottom: 6 }}>
            <DigiCharacter mood="happy" size={70} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 7vw, 2rem)', color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 4, lineHeight: 1.1 }}>
            Meet the whole family
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
            Five Planet Friends to earn, all the way to 16.
          </p>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'wrap', minHeight: 74 }}>
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

      {/* Step 3: how streaks unlock the next Friend */}
      {step === 3 && (
        <div key="s3" style={{ animation: 'gcIntroIn 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 380 }}>
          <div style={{ marginBottom: 8 }}>
            <DigiCharacter mood="happy" size={70} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.5rem, 7vw, 2rem)', color: 'var(--ink)', letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.1 }}>
            How to earn a new Friend
          </div>

          {/* 4 days on time make a streak */}
          <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16, padding: '13px 15px', marginBottom: 10, width: '100%' }}>
            <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginBottom: 8 }}>
              {[0, 1, 2, 3].map(i => (
                <span key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--tint-sage)', border: '1.5px solid #CFE3D9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, animation: `gcFriendPop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${0.2 + i * 0.18}s both` }}>✓</span>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
              Do your jobs <b>on time 4 days in a row</b> to earn a <b>streak</b> ⭐
            </p>
          </div>

          {/* 4 streaks unlock a Friend */}
          <div style={{ background: 'var(--terracotta-lt)', border: '1.5px solid #F1E4BE', borderRadius: 16, padding: '13px 15px', width: '100%' }}>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
              {[0, 1, 2, 3].map(i => (
                <span key={i} style={{ fontSize: 20 }}>⭐</span>
              ))}
              <span style={{ fontSize: 18, color: 'var(--ink-muted)', margin: '0 2px' }}>→</span>
              <img src={STAGE_CHARACTERS[1].cutout} alt="" width={34} height={34} style={{ objectFit: 'contain' }} />
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.5, margin: 0 }}>
              Get <b>4 streaks</b> and you unlock your next Planet Friend. Then 4 more for the next one, all the way to the whole family.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={next}
        style={{
          background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '16px',
          padding: '15px 30px', cursor: 'pointer', minWidth: 200, marginTop: 24,
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px',
          boxShadow: '0 5px 0 var(--terracotta-dark)',
        }}
      >
        {btnLabel}
      </button>

      <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
        {Array.from({ length: STEPS }).map((_, i) => (
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
