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

const CARDS = [
  {
    key: 'say_this' as const,
    label: 'Say this',
    step: 1,
    accent: 'var(--terracotta)',
    bg: 'var(--terracotta-lt)',
    tip: 'Use these words tonight',
  },
  {
    key: 'not_this' as const,
    label: 'Not this',
    step: 2,
    accent: 'var(--terracotta)',
    bg: 'var(--terracotta-lt)',
    tip: 'Easy to say, hard to come back from',
  },
  {
    key: 'why_it_works' as const,
    label: 'Why it works',
    step: 3,
    accent: 'var(--terracotta)',
    bg: 'var(--terracotta-lt)',
    tip: 'The reason behind the approach',
  },
  {
    key: 'tonight' as const,
    label: 'Tonight',
    step: 4,
    accent: 'var(--terracotta)',
    bg: 'var(--terracotta-lt)',
    tip: 'One thing to do right now',
  },
]

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
  const [isExiting, setIsExiting] = useState(false)
  const [exitDir, setExitDir] = useState<'left' | 'right'>('left')

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const animating = useRef(false)

  const navigate = useCallback((dir: 'next' | 'back') => {
    if (animating.current) return

    if (dir === 'back' && cardIndex === 0) return
    if (dir === 'next' && cardIndex >= CARDS.length) return

    animating.current = true
    setIsExiting(true)
    setExitDir(dir === 'next' ? 'left' : 'right')

    setTimeout(async () => {
      if (dir === 'next') {
        if (cardIndex < CARDS.length - 1) {
          setCardIndex(i => i + 1)
        } else if (!completed) {
          setCompleted(true)
          setCardIndex(CARDS.length)
          setShowCelebration(true)
          setTimeout(() => setShowCelebration(false), 2800)
          try {
            await fetch('/api/completions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sort_order: script.sort_order }),
            })
          } catch { /* non-blocking */ }
        }
      } else {
        if (cardIndex === CARDS.length) {
          setCardIndex(CARDS.length - 1)
        } else {
          setCardIndex(i => i - 1)
        }
      }
      setIsExiting(false)
      animating.current = false
    }, 320)
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
  const backHref = categorySlug
    ? `/dashboard/scripts/category/${categorySlug}`
    : '/dashboard/scripts'

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
            background: i <= cardIndex ? 'var(--terracotta)' : 'var(--border)',
            transition: 'width 0.25s ease, background 0.25s ease',
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
          <div style={{
            opacity: isExiting ? 0 : 1,
            transform: isExiting
              ? `translateX(${exitDir === 'left' ? '-130%' : '130%'}) rotate(${exitDir === 'left' ? '-12deg' : '12deg'})`
              : 'translateX(0) rotate(0deg)',
            transition: isExiting
              ? 'opacity 0.3s ease, transform 0.32s cubic-bezier(0.4, 0, 0.6, 1)'
              : 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <div
              style={{
                background: '#fff',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(26,26,46,0.14), 0 2px 8px rgba(26,26,46,0.08)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
              }}
              onClick={() => !isCompletionCard && navigate('next')}
            >
              {/* Curved header band */}
              <div style={{
                background: card.accent,
                padding: '22px 26px 26px',
                borderRadius: '0 0 32px 32px',
              }}>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Step {card.step} of {CARDS.length}
                </div>
                <div style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '4px' }}>
                  {card.label}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600 }}>
                  {card.tip}
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: '30px 26px 30px', background: card.bg }}>
                <p style={{
                  fontSize: 'clamp(17px, 4vw, 21px)',
                  fontWeight: 700,
                  lineHeight: 1.5,
                  color: 'var(--ink)',
                  margin: 0,
                  letterSpacing: '-0.01em',
                  ...(card.key === 'not_this' ? { color: '#991b1b', fontStyle: 'italic' } : {}),
                }}>
                  {card.key === 'say_this' ? `"${script[card.key]}"` : script[card.key]}
                </p>
              </div>

              {/* Tap hint */}
              <div style={{
                background: 'var(--cream)', borderTop: '1px solid var(--border)',
                padding: '9px 24px',
                fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
                color: 'var(--ink)', letterSpacing: '.08em',
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>Tap card or swipe</span>
                <span>Next →</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      {!isCompletionCard && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          {cardIndex > 0 && (
            <button
              onClick={() => navigate('back')}
              style={{
                padding: '14px 20px',
                background: 'var(--cream)',
                border: '1.5px solid var(--border)',
                borderRadius: '14px',
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
              background: cardIndex === CARDS.length - 1 && !completed ? 'var(--terracotta)' : card.accent,
              border: 'none',
              borderRadius: '14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: cardIndex === CARDS.length - 1 && !completed ? '0 4px 0 var(--terracotta-dark)' : 'none',
            }}
          >
            {cardIndex === CARDS.length - 1
              ? (completed ? 'Read again →' : 'Done →')
              : 'Next →'}
          </button>
        </div>
      )}

      {/* Swipe hint on first card (mobile only) */}
      {cardIndex === 0 && !isExiting && (
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.06em' }}>
            swipe to navigate
          </span>
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
          animation: 'fadeInUp 0.4s ease',
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
  return (
    <div>
      <div style={{
        background: '#fff',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(26,26,46,0.14), 0 2px 8px rgba(26,26,46,0.08)',
        marginBottom: '16px',
      }}>
        <div style={{ background: 'var(--terracotta)', padding: '22px 26px 26px', borderRadius: '0 0 32px 32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>✓</div>
          <div style={{ color: '#fff', fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Script complete
          </div>
        </div>
        <div style={{ padding: '30px 26px', background: 'var(--terracotta-lt)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--terracotta)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>
            Keep this in mind
          </div>
          <p style={{ fontSize: 'clamp(17px, 4vw, 20px)', fontWeight: 700, lineHeight: 1.5, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>
            {script.why_it_works}
          </p>
        </div>
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
