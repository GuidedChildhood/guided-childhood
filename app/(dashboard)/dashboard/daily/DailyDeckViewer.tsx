'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export type DailyCard = {
  id: string
  type: 'review' | 'focus' | 'watchfor' | 'question' | 'complete'
  eyebrow: string
  headline: string
  body: string
  accent: string
  bg: string
  icon: string
}

export default function DailyDeckViewer({
  cards,
  alreadyDone,
}: {
  cards: DailyCard[]
  alreadyDone: boolean
}) {
  const router = useRouter()
  const [cardIndex, setCardIndex] = useState(0)
  const [done, setDone] = useState(alreadyDone)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [exitDir, setExitDir] = useState<'left' | 'right'>('left')

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const animating = useRef(false)

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
    setIsExiting(true)
    setExitDir(dir === 'next' ? 'left' : 'right')

    await new Promise(r => setTimeout(r, 200))

    if (dir === 'next') {
      if (!isLast) {
        setCardIndex(i => i + 1)
      } else if (!done) {
        setDone(true)
        setShowCelebration(true)
        setTimeout(() => {
          setShowCelebration(false)
          router.push('/dashboard')
        }, 2000)
        try {
          await fetch('/api/daily/complete', { method: 'POST' })
        } catch { /* non-blocking */ }
      }
    } else {
      setCardIndex(i => i - 1)
    }

    setIsExiting(false)
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

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: card.bg,
        transition: 'background 0.35s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        userSelect: 'none',
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress bar — thin, at very top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'rgba(0,0,0,0.10)' }}>
        <div style={{
          height: '100%',
          background: 'rgba(255,255,255,0.6)',
          width: `${((cardIndex + 1) / cards.length) * 100}%`,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Top controls */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 20px 0', position: 'relative', zIndex: 1,
      }}>
        <button
          onClick={() => router.push('/dashboard')}
          aria-label="Close"
          style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(0,0,0,0.15)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', color: 'rgba(0,0,0,0.55)',
            lineHeight: 1,
          }}
        >
          ×
        </button>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: 'rgba(0,0,0,0.38)', letterSpacing: '0.08em',
        }}>
          {cardIndex + 1} / {cards.length}
        </div>
      </div>

      {/* Card */}
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 16px 0' }}
        onClick={() => !isLast && navigate('next')}
      >
        <div style={{
          flex: 1,
          background: '#fff',
          borderRadius: '28px 28px 0 0',
          overflow: 'hidden',
          boxShadow: '0 12px 48px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.07)',
          display: 'flex',
          flexDirection: 'column',
          opacity: isExiting ? 0 : 1,
          transform: isExiting
            ? `translateX(${exitDir === 'left' ? '-24px' : '24px'}) scale(0.97)`
            : 'translateX(0) scale(1)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          cursor: isLast ? 'default' : 'pointer',
        }}>
          {/* Coloured header band */}
          <div style={{
            background: card.accent,
            padding: '22px 26px 18px',
            flexShrink: 0,
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)', marginBottom: '6px',
            }}>
              {card.eyebrow}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 800,
              color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2,
            }}>
              {card.headline}
            </div>
          </div>

          {/* Card body */}
          <div style={{
            flex: 1, padding: '30px 26px 36px',
            overflowY: 'auto',
            display: 'flex', flexDirection: 'column',
          }}>
            <p style={{
              fontSize: 'clamp(17px, 4.2vw, 22px)',
              lineHeight: 1.68,
              color: 'var(--ink)',
              margin: 0,
              fontFamily: card.type === 'question' ? 'var(--font-display)' : 'inherit',
              fontWeight: card.type === 'question' ? 700 : 400,
              fontStyle: card.type === 'review' ? 'italic' : 'normal',
              textAlign: card.type === 'complete' ? 'center' : 'left',
            }}>
              {card.body}
            </p>
            {isLast && !done && (
              <button
                onClick={(e) => { e.stopPropagation(); navigate('next') }}
                style={{
                  marginTop: '32px', padding: '18px 28px',
                  background: 'var(--terracotta)',
                  border: 'none', borderRadius: '16px',
                  fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: '#fff', cursor: 'pointer',
                  boxShadow: '0 4px 0 var(--terracotta-dark)',
                  width: '100%',
                }}
              >
                Done for today
              </button>
            )}
            {isLast && done && (
              <button
                onClick={(e) => { e.stopPropagation(); router.push('/dashboard') }}
                style={{
                  marginTop: '32px', padding: '18px 28px',
                  background: 'var(--terracotta)',
                  border: 'none', borderRadius: '16px',
                  fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: '#fff', cursor: 'pointer',
                  boxShadow: '0 4px 0 var(--terracotta-dark)',
                  width: '100%',
                }}
              >
                Back to home
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom — previous card */}
      <div style={{
        padding: '16px 16px 36px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '72px',
      }}>
        {cardIndex > 0 ? (
          <button
            onClick={() => navigate('back')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.38)', padding: '8px 16px',
            }}
          >
            ↩ Previous card
          </button>
        ) : (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            color: 'rgba(0,0,0,0.3)', letterSpacing: '0.08em',
          }}>
            Tap card to continue
          </div>
        )}
      </div>

      {showCelebration && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,26,46,0.95)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--terracotta)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', marginBottom: '24px',
            boxShadow: '0 6px 0 var(--terracotta-dark)',
          }}>
            ✓
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: '28px', color: '#fff', marginBottom: '10px',
            letterSpacing: '-0.03em',
          }}>
            Done for today
          </div>
          <p style={{
            fontSize: '15px', color: 'rgba(255,255,255,0.6)',
            textAlign: 'center', maxWidth: '260px', lineHeight: 1.6,
          }}>
            Come back tomorrow and keep the streak going.
          </p>
        </div>
      )}
    </div>
  )
}
