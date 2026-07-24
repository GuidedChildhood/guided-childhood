'use client'

import { useEffect, useRef, useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'

// The welcome, the Duolingo way: the family introduced one at a time. DiGi says
// hello first, then each Planet Friend floats in on its own with its own hello,
// Pebble, Bloop, Orbit, Nova, Cosmo, in order, before the child drops into the
// app. It plays every time the child opens, because meeting the family is part
// of arriving. The very first open is a gentle tap through so a new child can
// read each one; every open after auto plays like a short animated splash they
// can tap to hurry or skip. A child only ever picks from the Friends they have
// earned, inside the app, so there is no character to choose here.

const SEEN_KEY = 'gc_kid_squad_intro_seen'
const AUTO_MS = 1700

export function squadIntroSeen(): boolean {
  try { return localStorage.getItem(SEEN_KEY) === '1' } catch { return true }
}

// One card per member: DiGi at the front, then the five Planet Friends in stage
// order, each with its own hello line from the character source.
type Member =
  | { kind: 'digi'; name: string }
  | { kind: 'friend'; index: number }

export default function KidSquadIntro({
  childName, onDone,
}: {
  childName: string
  currentStageId?: number
  onDone: () => void
}) {
  const name = childName && childName !== 'Your child' ? childName : 'friend'
  const members: Member[] = [
    { kind: 'digi', name: 'DiGi' },
    ...STAGE_CHARACTERS.map((_, i) => ({ kind: 'friend' as const, index: i })),
  ]
  const total = members.length

  // Auto play only for a returning child, so a first meeting can be read at the
  // child's own pace. Fixed at mount so it does not flip mid sequence.
  const [autoPlay] = useState(() => squadIntroSeen())
  const [step, setStep] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function finish() {
    if (timer.current) clearTimeout(timer.current)
    try { localStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
    onDone()
  }
  function advance() {
    if (step < total - 1) setStep(s => s + 1)
    else finish()
  }

  // Returning child: each card holds for a beat then moves itself on, all the
  // way into the app. A tap anywhere hurries it along.
  useEffect(() => {
    if (!autoPlay) return
    timer.current = setTimeout(advance, AUTO_MS)
    return () => { if (timer.current) clearTimeout(timer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, autoPlay])

  const m = members[step]
  const isDigi = m.kind === 'digi'
  const friend = m.kind === 'friend' ? STAGE_CHARACTERS[m.index] : null

  return (
    <div
      onClick={autoPlay ? advance : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 80, background: 'var(--kid-bg, #FFF9EC)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '28px 22px', textAlign: 'center', overflowY: 'auto',
        cursor: autoPlay ? 'pointer' : 'default',
      }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); finish() }}
        style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-muted)' }}
      >
        Skip
      </button>

      {/* One member at a time. The key on the sequence re-runs the pop in on
          every step, so each hello lands as its own little arrival. */}
      <div key={step} style={{ animation: 'gcIntroIn 0.45s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 380 }}>
        {isDigi ? (
          <>
            <div style={{ animation: 'gcFriendPop 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
              <DigiCharacter mood="happy" size={132} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 8vw, 2.2rem)', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '16px 0 8px', lineHeight: 1.1 }}>
              Hi {name}! I&apos;m DiGi
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16.5px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
              Meet my family of Planet Friends. Do your jobs and earn device time, and you earn them one by one, all the way to the whole team.
            </p>
          </>
        ) : friend && (
          <>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: 10 }}>
              Planet Friend {m.kind === 'friend' ? m.index + 1 : ''} of {STAGE_CHARACTERS.length}
            </div>
            <img
              src={friend.cutout} alt={friend.name} width={200} height={200}
              style={{ objectFit: 'contain', filter: 'drop-shadow(0 12px 14px rgba(26,26,46,0.18))', animation: 'gcFriendPop 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}
            />
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 9vw, 2.4rem)', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '8px 0 2px' }}>
              {friend.name}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: friend.colour, marginBottom: 12 }}>
              {friend.action} · {friend.ages}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
              {friend.intro}
            </p>
          </>
        )}
      </div>

      {/* On a first meeting, a button to move through at the child's pace. On a
          replay it auto plays, so the button becomes a gentle hurry along. */}
      <button
        onClick={(e) => { e.stopPropagation(); advance() }}
        style={{
          background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '16px',
          padding: '15px 30px', cursor: 'pointer', minWidth: 200, marginTop: 26,
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px',
          boxShadow: '0 5px 0 var(--terracotta-dark)',
        }}
      >
        {step < total - 1 ? (isDigi ? 'Meet the family ▶' : 'Next ▶') : "Let's go! ⭐"}
      </button>

      {/* Progress dots, one per member, so the child sees the whole family
          coming and how far through they are. */}
      <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
        {members.map((_, i) => (
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
