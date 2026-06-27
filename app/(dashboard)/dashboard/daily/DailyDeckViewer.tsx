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

  const navigate = useCallback(async (dir: 'next' | 'back') => {
    if (animating.current) return
    if (dir === 'back' && cardIndex === 0) return
    if (dir === 'next' && cardIndex >= cards.length - 1 && done) {
      router.push('/dashboard')
      return
    }

    animating.current = true
    setIsExiting(true)
    setExitDir(dir === 'next' ? 'left' : 'right')

    await new Promise(r => setTimeout(r, 220))

    if (dir === 'next') {
      if (!isLast) {
        setCardIndex(i => i + 1)
      } else if (!done) {
        setDone(true)
        setShowCelebration(true)
        setTimeout(() => {
          setShowCelebration(false)
          router.push('/dashboard')
        }, 2200)
        try {
          await fetch('/api/daily/complete', { method: 'POST' })
        } catch { /* non-blocking */ }
      }
    } else {
      setCardIndex(i => i - 1)
    }

    setIsExiting(false)
    animating.current = false
  }, [cardIndex, cards.length, done, isLast, router])

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

  const card = cards[cardIndex]
  if (!card) return null

  return (
    <div style={{
      maxWidth: '480px', margin: '0 auto', padding: '20px 16px 40px',
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
    }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i <= cardIndex ? c.accent : 'var(--border)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>

      {/* Card */}
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div style={{
          opacity: isExiting ? 0 : 1,
          transform: isExiting
            ? `translateX(${exitDir === 'left' ? '-32px' : '32px'})`
            : 'translateX(0)',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
          flex: 1, display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 2px 28px rgba(0,0,0,0.10)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Coloured header */}
            <div style={{
              background: card.accent,
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: '14px',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', flexShrink: 0,
              }}>
                {card.icon}
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)', marginBottom: '3px',
                }}>
                  {card.eyebrow}
                </div>
                <div style={{
                  color: '#fff', fontFamily: 'var(--font-display)',
                  fontWeight: 800, fontSize: '17px', letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}>
                  {card.headline}
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '28px 24px 32px', background: card.bg, flex: 1 }}>
              <p style={{
                fontSize: 'clamp(15px, 3.5vw, 18px)',
                lineHeight: 1.7,
                color: 'var(--ink)',
                margin: 0,
                ...(card.type === 'complete' ? { textAlign: 'center', fontWeight: 600 } : {}),
              }}>
                {card.body}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        {cardIndex > 0 && (
          <button
            onClick={() => navigate('back')}
            style={{
              padding: '14px 20px',
              background: 'var(--cream)', border: '1.5px solid var(--border)',
              borderRadius: '14px', fontFamily: 'var(--font-mono)',
              fontSize: '12px', letterSpacing: '0.06em',
              color: 'var(--ink-muted)', cursor: 'pointer', flexShrink: 0,
            }}
          >
            ← Back
          </button>
        )}
        {!done && (
          <button
            onClick={() => navigate('next')}
            style={{
              flex: 1, padding: '14px 20px',
              background: isLast ? 'var(--terracotta)' : card.accent,
              border: 'none', borderRadius: '14px',
              fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#fff', cursor: 'pointer',
            }}
          >
            {isLast ? 'Done for today' : 'Next →'}
          </button>
        )}
        {done && (
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              flex: 1, padding: '14px 20px',
              background: 'var(--terracotta)', border: 'none',
              borderRadius: '14px', fontFamily: 'var(--font-mono)',
              fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: '#fff', cursor: 'pointer',
            }}
          >
            Back to home →
          </button>
        )}
      </div>

      {cardIndex === 0 && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-light)', letterSpacing: '0.06em' }}>
            swipe or tap to move through
          </span>
        </div>
      )}

      {showCelebration && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(61, 106, 80, 0.94)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>✓</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: '28px', color: '#fff', marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}>
            Done for today
          </div>
          <p style={{
            fontSize: '15px', color: 'rgba(255,255,255,0.8)',
            textAlign: 'center', maxWidth: '280px', lineHeight: 1.5,
          }}>
            Come back tomorrow and keep the streak going.
          </p>
        </div>
      )}
    </div>
  )
}
