'use client'

import { useEffect, useRef, useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'
import { nextFriendToEarn, streaksBankedTowardNext, STREAKS_PER_FRIEND } from '@/lib/pathway/streak-unlock'

// The welcome splash, built the way the best kid apps do it: a rich warm screen,
// big white words, and the character floating and glowing in the middle. It runs
// every open, because arriving should feel like something.
//
// The story it tells changes as the child earns. DiGi, the guiding star, says
// hello first, always. Then it shows the ONE Planet Friend they are working
// toward right now, glowing just out of reach, with how close they are. Earn
// that Friend and the next open brings up the next one. So a child in their
// first week is only ever chasing Pebble, not being shown five names they have
// no line to yet. Friends already earned ride along as a small proud row.

const SEEN_KEY = 'gc_kid_squad_intro_seen'
const AUTO_MS = 2100

export function squadIntroSeen(): boolean {
  try { return localStorage.getItem(SEEN_KEY) === '1' } catch { return true }
}

type Card = { kind: 'digi' } | { kind: 'team' } | { kind: 'next' } | { kind: 'complete' }

export default function KidSquadIntro({
  childName, earnedFriends = 0, completedStreaks = 0, onDone,
}: {
  childName: string
  currentStageId?: number
  // How many Planet Friends this child has actually earned, so the splash only
  // ever points at the next one.
  earnedFriends?: number
  completedStreaks?: number
  onDone: () => void
}) {
  const name = childName && childName !== 'Your child' ? childName : 'friend'
  const earned = Math.max(0, Math.min(5, earnedFriends))
  const next = nextFriendToEarn(earned)
  const banked = streaksBankedTowardNext(completedStreaks)

  // DiGi always leads. The team card only appears once there is a team. Then
  // either the next Friend to chase, or the whole family home.
  const cards: Card[] = [
    { kind: 'digi' },
    ...(earned > 0 ? [{ kind: 'team' as const }] : []),
    next ? { kind: 'next' as const } : { kind: 'complete' as const },
  ]
  const total = cards.length

  // A first meeting is tapped through at the child's own pace. Every open after
  // auto plays like a splash, tap anywhere to hurry it along.
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
  const earnedList = STAGE_CHARACTERS.slice(0, earned)

  // Everything on this screen is white or butter, because the splash is a rich
  // warm dark. Never ink on dark.
  const white = '#FFFFFF'
  const soft = 'rgba(255,255,255,0.76)'
  const headline: React.CSSProperties = {
    fontFamily: 'var(--font-display)', fontWeight: 900, color: white,
    letterSpacing: '-0.02em', lineHeight: 1.1, margin: '18px 0 8px',
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
        // A warm premium gradient of our own, never the flat app grey and never
        // a purple. The glow behind the character sits on top of it.
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

        {/* DiGi, the guiding star. Always first, always glowing. */}
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
            <p style={body}>
              I am with you every day. Do your jobs, earn your device time, and my Planet Friends come to join us one by one.
            </p>
          </>
        )}

        {/* The team already earned, a proud little row. */}
        {card.kind === 'team' && (
          <>
            <div style={eyebrow}>Your team</div>
            <div style={{ ...headline, margin: '10px 0 16px' }}>
              {earned === 1 ? 'You have earned 1 Friend' : `You have earned ${earned} Friends`}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {earnedList.map((c, i) => (
                <span key={c.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0, animation: `gcFriendPop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.12 + i * 0.16}s forwards` }}>
                  <img
                    src={c.cutout} alt={c.name} width={72} height={72}
                    style={{ objectFit: 'contain', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,0.4))' }}
                  />
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: white }}>{c.name}</span>
                </span>
              ))}
            </div>
            <p style={{ ...body, marginTop: 18 }}>
              They are yours for keeps. Keep your streaks going and the next one is on the way.
            </p>
          </>
        )}

        {/* The ONE Friend they are chasing right now, glowing just out of reach. */}
        {card.kind === 'next' && next && (
          <>
            <div style={eyebrow}>Earn me next</div>
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 14, animation: 'gcFloat 3.2s ease-in-out infinite' }}>
              <span aria-hidden style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: `radial-gradient(circle, ${next.colour}55 0%, ${next.colour}00 68%)`, animation: 'gcGlow 2.6s ease-in-out infinite' }} />
              <img
                src={next.cutout} alt={next.name} width={200} height={200}
                style={{ position: 'relative', objectFit: 'contain', filter: 'drop-shadow(0 14px 16px rgba(0,0,0,0.45))', animation: 'gcFriendPop 0.65s cubic-bezier(0.34,1.56,0.64,1)' }}
              />
            </span>
            <div style={{ ...headline, margin: '14px 0 4px' }}>{next.name}</div>
            <p style={{ ...body, marginBottom: 16 }}>{next.intro}</p>

            {/* How close they actually are: four streak stars, the banked ones lit. */}
            <div style={{ display: 'flex', gap: 9, justifyContent: 'center', alignItems: 'center' }}>
              {Array.from({ length: STREAKS_PER_FRIEND }).map((_, i) => (
                <span key={i} aria-hidden style={{
                  width: 30, height: 30, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
                  background: i < banked ? 'var(--terracotta)' : 'rgba(255,255,255,0.12)',
                  border: `1.5px solid ${i < banked ? 'var(--terracotta)' : 'rgba(255,255,255,0.22)'}`,
                  opacity: 0, animation: `gcFriendPop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${0.2 + i * 0.12}s forwards`,
                }}>
                  {i < banked ? '⭐' : ''}
                </span>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, color: 'var(--terracotta)', letterSpacing: '0.04em', margin: '11px 0 0' }}>
              {banked} of {STREAKS_PER_FRIEND} streaks banked
            </p>
          </>
        )}

        {/* The whole family home. */}
        {card.kind === 'complete' && (
          <>
            <div style={eyebrow}>The whole family</div>
            <div style={{ ...headline, margin: '10px 0 16px' }}>You earned them all</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              {STAGE_CHARACTERS.map((c, i) => (
                <img
                  key={c.key} src={c.cutout} alt={c.name} width={62} height={62}
                  style={{ objectFit: 'contain', opacity: 0, filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.4))', animation: `gcFriendPop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${0.15 + i * 0.18}s forwards` }}
                />
              ))}
            </div>
            <p style={{ ...body, marginTop: 18 }}>
              Every Planet Friend is home with you and DiGi. That took real staying power.
            </p>
          </>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); advance() }}
        style={{
          background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '16px',
          padding: '16px 32px', cursor: 'pointer', minWidth: 210, marginTop: 30,
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
