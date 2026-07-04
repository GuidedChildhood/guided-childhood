'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MomentTimeline from '@/components/daily/MomentTimeline'
import ConcernCheckIn from '@/components/daily/ConcernCheckIn'
import type { ConcernCheckItem } from '@/components/daily/ConcernCheckIn'

export type DailyCard = {
  id: string
  type: 'review' | 'focus' | 'watchfor' | 'question' | 'complete'
  eyebrow: string
  headline: string
  body: string
  accent: string
  icon: string
}

// ── DECK MOTION ──────────────────────────────────────────────────────────────
// Completing a card: slow 3D flip to a green Done face, a beat to read it,
// then the card slides away revealing the next card already waiting beneath.
// Nothing runs under half a second. Reduced motion skips it all.
const FLIP_MS = 700
const HOLD_MS = 400
const SLIDE_MS = 600
const BACK_MS = 500

type Phase = 'rest' | 'flip' | 'slide' | 'back'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

// Card tints rotate through the Good Inside blue and green pastels.
// Butter stays reserved for the primary action button and the focus card.
type Palette = { header: string; body: string; text: string }

const BUTTER: Palette = {
  header: 'var(--tint-amber)',
  body: 'var(--terracotta-lt)',
  text: 'var(--ink)',
}

const PALETTES: Palette[] = [
  { header: 'var(--stage-2-bold)', body: 'var(--stage-2)', text: 'var(--stage-2-text)' },
  { header: 'var(--tint-blue)', body: 'var(--tint-sage)', text: 'var(--stage-2-text)' },
  { header: 'var(--stage-2-bold)', body: 'var(--tint-green)', text: 'var(--stage-2-text)' },
  { header: 'var(--tint-blue)', body: 'var(--stage-2)', text: 'var(--stage-2-text)' },
]

function paletteFor(card: DailyCard, index: number): Palette {
  if (card.type === 'focus') return BUTTER
  return PALETTES[index % PALETTES.length]
}

const CARD_SHADOW = '0 10px 40px rgba(26,26,46,0.14), 0 2px 8px rgba(26,26,46,0.08)'

function CardFace({ card, palette }: { card: DailyCard; palette: Palette }) {
  return (
    <div style={{
      background: palette.body,
      borderRadius: '28px',
      overflow: 'hidden',
      boxShadow: CARD_SHADOW,
      border: '1px solid var(--border)',
    }}>
      {/* Curved header band */}
      <div style={{
        background: palette.header,
        padding: '22px 24px 26px',
        borderRadius: '0 0 32px 32px',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
          letterSpacing: '.18em', textTransform: 'uppercase',
          color: palette.text, opacity: 0.75, marginBottom: '6px',
        }}>
          {card.eyebrow}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(1.15rem, 4vw, 1.5rem)',
          color: palette.text, lineHeight: 1.15, letterSpacing: '-0.02em',
        }}>
          {card.headline}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '28px 24px 34px', background: palette.body }}>
        <p style={{
          fontSize: 'clamp(15.5px, 3.8vw, 18px)',
          lineHeight: 1.6,
          color: 'var(--ink)',
          margin: 0,
          fontWeight: 500,
          fontFamily: 'var(--font-body)',
        }}>
          {card.body}
        </p>
      </div>
    </div>
  )
}

function DoneFace() {
  return (
    <div style={{
      height: '100%',
      background: 'var(--tint-green)',
      border: '1px solid var(--border)',
      borderRadius: '28px',
      boxShadow: CARD_SHADOW,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '14px',
    }}>
      <div style={{
        width: 76, height: 76, borderRadius: '50%',
        background: 'var(--tint-sage)', border: '1.5px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '34px', color: 'var(--ink)',
      }}>✓</div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700,
        letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-soft)',
      }}>
        Done
      </div>
    </div>
  )
}

export default function DailyDeckViewer({
  cards,
  alreadyDone,
  checkIns = [],
}: {
  cards: DailyCard[]
  alreadyDone: boolean
  checkIns?: ConcernCheckItem[]
}) {
  const router = useRouter()
  const [cardIndex, setCardIndex] = useState(0)
  const [done, setDone] = useState(alreadyDone)
  const [showComplete, setShowComplete] = useState(false)
  const [loggedTracker, setLoggedTracker] = useState(false)
  const [selectedMoments, setSelectedMoments] = useState<string[]>([])
  const [momentsSaved, setMomentsSaved] = useState(false)
  const [phase, setPhase] = useState<Phase>('rest')

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const animating = useRef(false)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const isLast = cardIndex === cards.length - 1
  const card = cards[cardIndex]

  const navigate = useCallback(async (dir: 'next' | 'back') => {
    if (animating.current) return
    if (dir === 'back' && cardIndex === 0) return
    if (dir === 'next' && isLast && done) {
      router.push('/dashboard')
      return
    }

    animating.current = true

    const commitNext = () => {
      if (!isLast) {
        setCardIndex(i => i + 1)
      } else if (!done) {
        setDone(true)
        setShowComplete(true)
        fetch('/api/daily/complete', { method: 'POST' }).catch(() => {})
      }
    }

    if (reducedMotion.current) {
      if (dir === 'next') commitNext()
      else setCardIndex(i => i - 1)
      animating.current = false
      return
    }

    if (dir === 'next') {
      setPhase('flip')
      await sleep(FLIP_MS + HOLD_MS)
      setPhase('slide')
      await sleep(SLIDE_MS)
      commitNext()
      setPhase('rest')
    } else {
      setPhase('back')
      await sleep(BACK_MS)
      setCardIndex(i => i - 1)
      setPhase('rest')
    }

    animating.current = false
  }, [cardIndex, isLast, done, router])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); navigate('next') }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); navigate('back') }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = touchStartX.current - e.changedTouches[0].clientX
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)
    if (Math.abs(dx) > 44 && dy < 80) navigate(dx > 0 ? 'next' : 'back')
    touchStartX.current = null
    touchStartY.current = null
  }

  if (!card) return null

  // ── COMPLETION SCREEN ─────────────────────────────────────────────────────
  if (showComplete) {
    const toggleMoment = (key: string) => {
      setSelectedMoments(prev =>
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      )
    }

    const saveMoments = () => {
      setMomentsSaved(true)
      fetch('/api/daily/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moments: selectedMoments }),
      }).catch(() => {})
    }

    return (
      <div style={{
        maxWidth: '480px', margin: '0 auto', padding: '40px 20px 60px',
      }}>
        {/* Done header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--tint-green)',
            border: '1.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', color: 'var(--ink)', margin: '0 auto 16px',
          }}>✓</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: '1.6rem', color: 'var(--ink)', marginBottom: '6px',
            letterSpacing: '-0.03em',
          }}>
            Done for today
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '260px', margin: '0 auto' }}>
            Come back tomorrow and keep the streak going.
          </p>
        </div>

        {/* Tracker check in */}
        {!loggedTracker ? (
          <div style={{
            background: '#fff', border: '1.5px solid var(--border)',
            borderRadius: '20px', padding: '22px', marginBottom: '16px',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--stage-2-text)', marginBottom: '10px' }}>
              Quick tracker check in
            </div>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '16px' }}>
              How is your child doing with screens this week?
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Really well', 'Doing ok', 'Bit of a battle', 'Struggling'].map((label, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setLoggedTracker(true)
                    fetch('/api/tracker/quick', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ rating: 4 - i, label }),
                    }).catch(() => {})
                  }}
                  style={{
                    padding: '9px 14px', borderRadius: '100px',
                    border: '1.5px solid var(--border)',
                    background: 'var(--cream)',
                    fontFamily: 'var(--font-mono)', fontSize: '11px',
                    fontWeight: 600, color: 'var(--ink-soft)',
                    cursor: 'pointer', letterSpacing: '.04em',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            background: 'var(--stage-2)', border: '1.5px solid var(--border)',
            borderRadius: '16px', padding: '14px 18px', marginBottom: '16px',
            fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-soft)',
          }}>
            ✓ Added to your tracker
          </div>
        )}

        {/* Yesterday's concerns, checked before today's flags */}
        {checkIns.length > 0 && <ConcernCheckIn concerns={checkIns} />}

        {/* Daily moments feedback: the day as a timeline of picture tiles */}
        {!momentsSaved ? (
          <div style={{
            background: '#fff', border: '1.5px solid var(--border)',
            borderRadius: '20px', padding: '22px', marginBottom: '16px',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--stage-2-text)', marginBottom: '8px' }}>
              What came up today?
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '18px' }}>
              Tap anything that happened. We will show you the right scripts tomorrow.
            </p>
            <div style={{ marginBottom: '18px' }}>
              <MomentTimeline selected={selectedMoments} onToggle={toggleMoment} />
            </div>
            <button
              onClick={saveMoments}
              style={{
                width: '100%', padding: '12px',
                background: selectedMoments.length > 0 ? 'var(--deep-teal)' : 'var(--cream)',
                border: selectedMoments.length > 0 ? 'none' : '1.5px solid var(--border)',
                borderRadius: '12px',
                fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700,
                letterSpacing: '.08em', textTransform: 'uppercase',
                color: selectedMoments.length > 0 ? '#fff' : 'var(--ink)',
                cursor: 'pointer',
                transition: 'all 0.5s ease',
              }}
            >
              {selectedMoments.length === 0 ? 'Nothing to flag today' : `Save ${selectedMoments.length} moment${selectedMoments.length > 1 ? 's' : ''}`}
            </button>
          </div>
        ) : (
          <div style={{
            background: 'var(--stage-2)', border: '1.5px solid var(--border)',
            borderRadius: '16px', padding: '14px 18px', marginBottom: '16px',
            fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-soft)',
          }}>
            ✓ Got it. Tomorrow we will cover what came up today.
          </div>
        )}

        <button
          onClick={() => router.push('/dashboard')}
          style={{
            width: '100%', padding: '16px', background: 'var(--terracotta)',
            border: 'none', borderRadius: 'var(--radius-btn)',
            fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700,
            letterSpacing: '.08em', textTransform: 'uppercase',
            color: 'var(--ink)', cursor: 'pointer',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          Back to home
        </button>
      </div>
    )
  }

  // ── CARD DECK ─────────────────────────────────────────────────────────────
  const underCard = phase === 'back'
    ? (cardIndex > 0 ? cards[cardIndex - 1] : undefined)
    : (cardIndex < cards.length - 1 ? cards[cardIndex + 1] : undefined)
  const underIndex = phase === 'back' ? cardIndex - 1 : cardIndex + 1
  const underRaised = phase === 'slide' || phase === 'back'
  const exitMs = phase === 'back' ? BACK_MS : SLIDE_MS

  return (
    <div
      style={{ maxWidth: '480px', margin: '0 auto', padding: '16px 16px 48px', minHeight: '84dvh', display: 'flex', flexDirection: 'column' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--border)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', color: 'var(--ink)',
          }}
        >
          ×
        </button>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {cards.map((_, i) => (
            <div key={i} style={{
              width: i === cardIndex ? 20 : 7,
              height: 7, borderRadius: '100px',
              background: i <= cardIndex ? 'var(--stage-2-text)' : 'var(--border)',
              transition: 'width 0.5s ease, background 0.5s ease',
            }} />
          ))}
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', minWidth: 36, textAlign: 'right' }}>
          {cardIndex + 1}/{cards.length}
        </div>
      </div>

      {/* Card group sits centred in the space below the top bar */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

      {/* Card stack: the next card waits visibly beneath the current one */}
      <div style={{ position: 'relative', marginBottom: '36px' }}>
        {underCard && (
          <div
            aria-hidden
            style={{
              position: 'absolute', inset: 0, zIndex: 1,
              transform: underRaised ? 'translateY(0) scale(1)' : 'translateY(26px) scale(0.965)',
              transformOrigin: 'top center',
              transition: underRaised ? `transform ${exitMs}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none',
              overflow: 'hidden', borderRadius: '28px',
            }}
          >
            <CardFace card={underCard} palette={paletteFor(underCard, underIndex)} />
          </div>
        )}

        {/* Top card: flips to its Done face, then slides away */}
        <div style={{
          position: 'relative', zIndex: 2,
          perspective: '1400px',
          transform: phase === 'slide'
            ? 'translateX(-115%) rotate(-10deg)'
            : phase === 'back'
              ? 'translateX(115%) rotate(10deg)'
              : 'none',
          opacity: phase === 'slide' || phase === 'back' ? 0 : 1,
          transition: phase === 'slide' || phase === 'back'
            ? `transform ${exitMs}ms cubic-bezier(0.55, 0, 0.68, 0.35), opacity ${exitMs}ms ease`
            : 'none',
        }}>
          <div
            onClick={() => !isLast && navigate('next')}
            style={{
              position: 'relative',
              transformStyle: 'preserve-3d',
              transform: phase === 'flip' || phase === 'slide' ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: phase === 'flip'
                ? `transform ${FLIP_MS}ms cubic-bezier(0.45, 0, 0.55, 1)`
                : 'none',
              cursor: isLast ? 'default' : 'pointer',
              userSelect: 'none',
            }}
          >
            <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
              <CardFace card={card} palette={paletteFor(card, cardIndex)} />
            </div>
            <div style={{
              position: 'absolute', inset: 0,
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            }}>
              <DoneFace />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation: one Next affordance, the single big button */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {cardIndex > 0 && (
          <button
            onClick={() => navigate('back')}
            style={{
              padding: '14px 18px', background: 'var(--cream)',
              border: '1.5px solid var(--border)', borderRadius: 'var(--radius-btn)',
              fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600,
              letterSpacing: '.06em', color: 'var(--ink)',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            ← Back
          </button>
        )}
        <button
          onClick={() => navigate('next')}
          style={{
            flex: 1, padding: '15px 20px',
            background: 'var(--terracotta)',
            border: 'none', borderRadius: 'var(--radius-btn)',
            fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700,
            letterSpacing: '.08em', textTransform: 'uppercase',
            color: 'var(--ink)', cursor: 'pointer',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          {isLast && done ? 'Back to home' : isLast ? 'Done for today ✓' : 'Next →'}
        </button>
      </div>

      </div>
    </div>
  )
}
