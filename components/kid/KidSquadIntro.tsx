'use client'

import { useEffect, useRef, useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import { streaksToUnlockFriend } from '@/lib/pathway/streak-unlock'

// The welcome splash: a rich warm screen, big white words, and one character at
// a time floating and glowing in the middle. It runs every open, because
// arriving should feel like something.
//
// DiGi says hello first, always, then the WHOLE family one by one, in order, so
// a child meets every Planet Friend and knows who is out there to collect. Each
// one says plainly whether it is theirs yet, and if not, exactly how many
// streaks away it is. Seeing Cosmo on day one is the point: it is the thing
// worth working toward, and a locked one is a teaser, not a disappointment.
//
// Paced slowly on purpose. A child reads far slower than an adult skims, and
// this is the moment the whole collection is being taught.

const SEEN_KEY = 'gc_kid_squad_intro_seen'
const AUTO_MS = 4600

export function squadIntroSeen(): boolean {
  try { return localStorage.getItem(SEEN_KEY) === '1' } catch { return true }
}

type Card = { kind: 'digi' } | { kind: 'friend'; index: number }

export default function KidSquadIntro({
  childName, earnedFriends = 0, completedStreaks = 0, onDone,
}: {
  childName: string
  currentStageId?: number
  earnedFriends?: number
  completedStreaks?: number
  onDone: () => void
}) {
  const name = childName && childName !== 'Your child' ? childName : 'friend'
  const earned = Math.max(0, Math.min(5, earnedFriends))

  // DiGi, then every Planet Friend in stage order. Always all of them.
  const cards: Card[] = [
    { kind: 'digi' },
    ...STAGE_CHARACTERS.map((_, i) => ({ kind: 'friend' as const, index: i })),
  ]
  const total = cards.length

  // A first meeting is tapped through at the child's own pace. Every open after
  // auto plays, tap anywhere to hurry it along.
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

  useEffect(() => {
    if (!autoPlay) return
    timer.current = setTimeout(advance, AUTO_MS)
    return () => { if (timer.current) clearTimeout(timer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, autoPlay])

  const card = cards[step]
  const friend = card.kind === 'friend' ? STAGE_CHARACTERS[card.index] : null
  // Theirs already, the very next one to chase, or further down the road.
  const isYours = !!friend && friend.stageId <= earned
  const isNext = !!friend && friend.stageId === earned + 1
  const streaksAway = friend ? streaksToUnlockFriend(friend.stageId, completedStreaks) : 0

  const white = '#FFFFFF'
  const soft = 'rgba(255,255,255,0.76)'
  const headline: React.CSSProperties = {
    fontFamily: 'var(--font-display)', fontWeight: 900, color: white,
    letterSpacing: '-0.02em', lineHeight: 1.1, margin: '14px 0 4px',
    fontSize: 'clamp(1.8rem, 8.5vw, 2.4rem)',
  }
  const body: React.CSSProperties = {
    fontFamily: 'var(--font-body)', fontSize: '17px', color: soft,
    lineHeight: 1.55, margin: 0, maxWidth: 340,
  }
  const eyebrow: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
    letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta)',
  }

  return (
    <div
      onClick={autoPlay ? advance : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: 'radial-gradient(circle at 50% 38%, #4A4029 0%, #2E2818 55%, #1E1A10 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '28px 22px', textAlign: 'center', overflowY: 'auto',
        cursor: autoPlay ? 'pointer' : 'default',
      }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); finish() }}
        style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.55)' }}
      >
        Skip
      </button>

      <div key={step} style={{ animation: 'gcIntroIn 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 380 }}>

        {card.kind === 'digi' && (
          <>
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'gcFloat 3.2s ease-in-out infinite' }}>
              <span aria-hidden style={{ position: 'absolute', width: 210, height: 210, borderRadius: '50%', background: 'radial-gradient(circle, rgba(237,195,95,0.42) 0%, rgba(237,195,95,0) 68%)', animation: 'gcGlow 2.6s ease-in-out infinite' }} />
              <span style={{ position: 'relative', animation: 'gcFriendPop 0.65s cubic-bezier(0.34,1.56,0.64,1)' }}>
                <DigiCharacter mood="happy" size={140} />
              </span>
            </span>
            <div style={{ ...eyebrow, marginTop: 20 }}>Your guiding star</div>
            <div style={headline}>Hi {name}! I&apos;m DiGi</div>
            <p style={{ ...body, marginTop: 8 }}>
              I am with you every day. Now meet my family of Planet Friends. Do your jobs, earn your device time, and they come to join us one by one.
            </p>
          </>
        )}

        {friend && (
          <>
            <div style={eyebrow}>
              {isYours ? 'Already yours' : isNext ? 'Earn me next' : `Planet Friend ${friend.stageId} of 5`}
            </div>

            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12, animation: 'gcFloat 3.2s ease-in-out infinite' }}>
              <span aria-hidden style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: `radial-gradient(circle, ${friend.colour}${isYours || isNext ? '55' : '2E'} 0%, ${friend.colour}00 68%)`, animation: 'gcGlow 2.6s ease-in-out infinite' }} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={friend.cutout} alt={friend.name} width={196} height={196}
                style={{
                  position: 'relative', objectFit: 'contain',
                  // A friend still to come is dimmed, so the collection reads at
                  // a glance, but never so dark they cannot see who it is.
                  filter: isYours
                    ? 'drop-shadow(0 14px 16px rgba(0,0,0,0.45))'
                    : 'grayscale(0.55) brightness(0.92) drop-shadow(0 14px 16px rgba(0,0,0,0.45))',
                  animation: 'gcFriendPop 0.65s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              />
            </span>

            <div style={headline}>{friend.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: friend.colour, marginBottom: 10 }}>
              {friend.action} · {friend.ages}
            </div>
            <p style={{ ...body, marginBottom: 14 }}>{friend.intro}</p>

            {/* The plain answer to how do I get this one. Never a bare padlock. */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: isYours ? 'rgba(47,143,107,0.22)' : 'rgba(255,255,255,0.1)',
              border: `1.5px solid ${isYours ? 'rgba(104,197,159,0.6)' : 'rgba(255,255,255,0.22)'}`,
              borderRadius: 100, padding: '9px 16px',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
              color: isYours ? '#9FE3C4' : white,
            }}>
              {isYours
                ? <>✓ {friend.name} is yours</>
                : streaksAway === 1
                ? <>🔥 One more streak</>
                : <>🔥 {streaksAway} streaks away</>}
            </div>
          </>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); advance() }}
        style={{
          background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '16px',
          padding: '16px 32px', cursor: 'pointer', minWidth: 210, marginTop: 26,
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px',
          boxShadow: '0 5px 0 var(--terracotta-dark)',
        }}
      >
        {step < total - 1 ? 'Next ▶' : "Let's go! ⭐"}
      </button>

      <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
        {cards.map((_, i) => (
          <span key={i} style={{ width: i === step ? 20 : 7, height: 7, borderRadius: 100, background: i === step ? 'var(--terracotta)' : 'rgba(255,255,255,0.25)', transition: 'width 0.25s ease' }} />
        ))}
      </div>

      <style>{`
        @keyframes gcIntroIn { from { opacity: 0; transform: translateY(10px) scale(0.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes gcFriendPop { 0% { opacity: 0; transform: scale(0.4) translateY(12px) } 100% { opacity: 1; transform: scale(1) translateY(0) } }
        @keyframes gcFloat { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
        @keyframes gcGlow { 0%, 100% { opacity: 0.55; transform: scale(0.94) } 50% { opacity: 1; transform: scale(1.06) } }
        @media (prefers-reduced-motion: reduce) {
          [style*="gcFloat"], [style*="gcGlow"] { animation: none !important }
        }
      `}</style>
    </div>
  )
}
