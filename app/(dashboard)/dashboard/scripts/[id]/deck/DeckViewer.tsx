'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'

type ScriptData = {
  sort_order: number
  title: string
  situation: string
  say_this: string
  not_this: string
  why_it_works: string
  tonight: string
  category: string | null
  stage_id: string
}

// Card tints rotate through the Good Inside blue and green pastels.
// Butter stays reserved for the primary action button.
const CARDS = [
  {
    key: 'say_this' as const,
    label: 'Say this',
    step: 1,
    header: 'var(--stage-2-bold)',
    bg: 'var(--stage-2)',
    text: 'var(--stage-2-text)',
    tip: 'Use these words tonight',
  },
  {
    key: 'not_this' as const,
    label: 'Not this',
    step: 2,
    header: 'var(--tint-blue)',
    bg: 'var(--tint-sage)',
    text: 'var(--stage-2-text)',
    tip: 'Easy to say, hard to come back from',
  },
  {
    key: 'why_it_works' as const,
    label: 'Why it works',
    step: 3,
    header: 'var(--stage-2-bold)',
    bg: 'var(--tint-green)',
    text: 'var(--stage-2-text)',
    tip: 'The reason behind the approach',
  },
  {
    key: 'tonight' as const,
    label: 'Tonight',
    step: 4,
    header: 'var(--tint-blue)',
    bg: 'var(--stage-2)',
    text: 'var(--stage-2-text)',
    tip: 'One thing to do right now',
  },
]

type CardDef = typeof CARDS[number]

// ── DECK MOTION ──────────────────────────────────────────────────────────────
// Advancing a card: slow 3D flip to a green Done face, a beat to read it,
// then the card slides away revealing the next card already waiting beneath.
// Nothing runs under half a second. Reduced motion skips it all.
const FLIP_MS = 700
const HOLD_MS = 400
const SLIDE_MS = 600
const BACK_MS = 500

type Phase = 'rest' | 'flip' | 'slide' | 'back'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const CARD_SHADOW = '0 10px 40px rgba(26,26,46,0.14), 0 2px 8px rgba(26,26,46,0.08)'

function ScriptCardFace({ card, script }: { card: CardDef; script: ScriptData }) {
  return (
    <div style={{
      background: card.bg,
      borderRadius: '28px',
      overflow: 'hidden',
      boxShadow: CARD_SHADOW,
      border: '1px solid var(--border)',
    }}>
      {/* Curved header band */}
      <div style={{
        background: card.header,
        padding: '22px 26px 26px',
        borderRadius: '0 0 32px 32px',
      }}>
        <div style={{ color: card.text, opacity: 0.75, fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '6px' }}>
          Step {card.step} of {CARDS.length}
        </div>
        <div style={{ color: card.text, fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '4px' }}>
          {card.label}
        </div>
        <div style={{ color: card.text, opacity: 0.85, fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600 }}>
          {card.tip}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: '30px 26px 34px', background: card.bg }}>
        <p style={{
          fontSize: 'clamp(16px, 3.8vw, 19px)',
          fontWeight: 500,
          lineHeight: 1.6,
          color: 'var(--ink)',
          margin: 0,
          fontFamily: 'var(--font-body)',
          ...(card.key === 'not_this' ? { color: 'var(--danger)', fontStyle: 'italic' } : {}),
        }}>
          {card.key === 'say_this' ? `"${script[card.key]}"` : script[card.key]}
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

export default function DeckViewer({
  script,
  initialCompleted,
  categorySlug,
}: {
  script: ScriptData
  initialCompleted: boolean
  categorySlug: string | null
}) {
  const [cardIndex, setCardIndex] = useState(0)
  const [completed, setCompleted] = useState(initialCompleted)
  const [showCelebration, setShowCelebration] = useState(false)
  const [phase, setPhase] = useState<Phase>('rest')

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const animating = useRef(false)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const navigate = useCallback(async (dir: 'next' | 'back') => {
    if (animating.current) return
    if (dir === 'back' && cardIndex === 0) return
    if (dir === 'next' && cardIndex >= CARDS.length) return

    // Leaving the completion view back to the last card is a plain swap
    if (dir === 'back' && cardIndex === CARDS.length) {
      setCardIndex(CARDS.length - 1)
      return
    }

    animating.current = true

    const commitNext = () => {
      if (cardIndex < CARDS.length - 1) {
        setCardIndex(i => i + 1)
      } else {
        setCardIndex(CARDS.length)
        if (!completed) {
          setCompleted(true)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 2800)
          fetch('/api/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sort_order: script.sort_order }),
          }).catch(() => {})
        }
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
  }, [cardIndex, completed, script.sort_order])

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
    if (Math.abs(dx) > 44 && dy < 80) {
      navigate(dx > 0 ? 'next' : 'back')
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  const card = CARDS[Math.min(cardIndex, CARDS.length - 1)]
  const isCompletionCard = cardIndex === CARDS.length
  // Most seeded categories have no category page, so Back always goes to the list.
  const backHref = '/dashboard/scripts'

  const underCard = phase === 'back'
    ? (cardIndex > 0 ? CARDS[cardIndex - 1] : undefined)
    : (cardIndex < CARDS.length - 1 ? CARDS[cardIndex + 1] : undefined)
  const underRaised = phase === 'slide' || phase === 'back'
  const exitMs = phase === 'back' ? BACK_MS : SLIDE_MS

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px 16px 48px', minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href={backHref}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--ink-muted)', textDecoration: 'none', marginBottom: '20px', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
        >
          ← Back
        </Link>

        <h1 style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)', lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: '6px' }}>
          {script.title}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--ink-muted)', fontStyle: 'italic', margin: 0 }}>
          {script.situation}
        </p>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '24px' }}>
        {CARDS.map((_, i) => (
          <div key={i} style={{
            width: i === cardIndex ? 20 : 7,
            height: 7, borderRadius: '100px',
            background: i <= cardIndex ? 'var(--stage-2-text)' : 'var(--border)',
            transition: 'width 0.5s ease, background 0.5s ease',
          }} />
        ))}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)', marginLeft: '8px', letterSpacing: '0.06em' }}>
          {isCompletionCard ? '✓ Done' : `${cardIndex + 1} of ${CARDS.length}`}
        </span>
      </div>

      {/* Card area */}
      <div
        style={{ flex: 1 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {isCompletionCard ? (
          <CompletionCard script={script} backHref={backHref} />
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Card stack: the next card waits visibly beneath the current one */}
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
                <ScriptCardFace card={underCard} script={script} />
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
              marginBottom: '16px',
            }}>
              <div
                onClick={() => navigate('next')}
                style={{
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transform: phase === 'flip' || phase === 'slide' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transition: phase === 'flip'
                    ? `transform ${FLIP_MS}ms cubic-bezier(0.45, 0, 0.55, 1)`
                    : 'none',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                  <ScriptCardFace card={card} script={script} />
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
        )}
      </div>

      {/* Navigation: one Next affordance, the single big butter button */}
      {!isCompletionCard && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          {cardIndex > 0 && (
            <button
              onClick={() => navigate('back')}
              style={{
                padding: '14px 20px',
                background: 'var(--cream)',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-btn)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: 'var(--ink)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={() => navigate('next')}
            style={{
              flex: 1,
              padding: '14px 20px',
              background: 'var(--terracotta)',
              border: 'none',
              borderRadius: 'var(--radius-btn)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--ink)',
              cursor: 'pointer',
              boxShadow: '0 5px 0 var(--terracotta-dark)',
            }}
          >
            {cardIndex === CARDS.length - 1
              ? (completed ? 'Finish →' : 'Done →')
              : 'Next →'}
          </button>
        </div>
      )}

      {/* Completion celebration overlay */}
      {showCelebration && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(61, 106, 80, 0.92)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          animation: 'fadeInUp 0.5s ease',
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>✓</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Script complete
          </div>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', textAlign: 'center', maxWidth: '280px', lineHeight: 1.5 }}>
            You now know what to say, what not to say, and why it works.
          </p>
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

    </div>
  )
}

function CompletionCard({
  script,
  backHref,
}: {
  script: ScriptData
  backHref: string
}) {
  const [worked, setWorked] = useState<'yes' | 'somewhat' | 'no' | null>(null)

  const sendWorked = (value: 'yes' | 'somewhat' | 'no') => {
    setWorked(value)
    fetch('/api/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sort_order: script.sort_order, worked: value }),
    }).catch(() => {})
  }

  return (
    <div style={{ animation: 'gcCompletionIn 0.5s ease' }}>
      <style>{`
        @keyframes gcCompletionIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes gcCompletionIn {
            from { opacity: 1; transform: none; }
            to   { opacity: 1; transform: none; }
          }
        }
      `}</style>
      <div style={{
        background: 'var(--tint-sage)',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: CARD_SHADOW,
        marginBottom: '16px',
      }}>
        <div style={{ background: 'var(--tint-green)', padding: '22px 26px 26px', borderRadius: '0 0 32px 32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--tint-sage)', border: '1.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', color: 'var(--ink)',
          }}>✓</div>
          <div style={{ color: 'var(--ink)', fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Script complete
          </div>
        </div>
        <div style={{ padding: '30px 26px', background: 'var(--tint-sage)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--stage-2-text)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>
            Keep this in mind
          </div>
          <p style={{ fontSize: 'clamp(17px, 4vw, 20px)', fontWeight: 700, lineHeight: 1.5, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>
            {script.why_it_works}
          </p>
        </div>
      </div>

      {/* Did this work feedback — feeds DiGi so it knows what has actually helped */}
      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', padding: '18px 20px', marginBottom: '16px' }}>
        {worked ? (
          <div style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 600 }}>
            ✓ Thanks, saved. DiGi will remember this next time.
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
              Did this work for you?
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {([
                { value: 'yes' as const, label: 'Yes, it helped' },
                { value: 'somewhat' as const, label: 'Somewhat' },
                { value: 'no' as const, label: 'Not really' },
              ]).map(opt => (
                <button
                  key={opt.value}
                  onClick={() => sendWorked(opt.value)}
                  style={{
                    padding: '9px 14px', borderRadius: '100px',
                    border: '1.5px solid var(--border)', background: 'var(--cream)',
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
                    color: 'var(--ink)', cursor: 'pointer', letterSpacing: '.02em',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Link
          href={backHref}
          className="btn btn-outline"
          style={{ flex: 1, textAlign: 'center', padding: '13px 18px', fontSize: '12px' }}
        >
          ← Back to list
        </Link>
        <Link
          href={`/dashboard/digi?q=${encodeURIComponent(`I just read the script: ${script.title}. I want to adapt it for my situation.`)}`}
          className="btn btn-gold"
          style={{ flex: 1, textAlign: 'center', padding: '13px 18px', fontSize: '12px' }}
        >
          Ask DiGi about this
        </Link>
      </div>
    </div>
  )
}
