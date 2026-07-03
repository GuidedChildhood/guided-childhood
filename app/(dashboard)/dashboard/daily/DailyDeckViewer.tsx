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
  icon: string
}

const CARD_ICONS: Record<string, string> = {
  review: '◎',
  focus: '✦',
  watchfor: '△',
  question: '?',
  complete: '✓',
}

const DAILY_MOMENTS = [
  { key: 'morning', label: 'Morning routine', icon: '☀️' },
  { key: 'teeth', label: 'Teeth brushing', icon: '🦷' },
  { key: 'dressed', label: 'Getting dressed', icon: '👕' },
  { key: 'bag', label: 'School bag', icon: '🎒' },
  { key: 'lunch', label: 'Lunch / packed lunch', icon: '🥪' },
  { key: 'dropoff', label: 'School drop off', icon: '🏫' },
  { key: 'pickup', label: 'School pick up', icon: '🚗' },
  { key: 'snacks', label: 'Snacks and food', icon: '🍎' },
  { key: 'dinner', label: 'Choosing dinner', icon: '🍽️' },
  { key: 'tv_eve', label: 'Evening TV', icon: '📺' },
  { key: 'homework', label: 'Homework', icon: '📚' },
  { key: 'clothes', label: 'Clothes in washing', icon: '🧺' },
  { key: 'fighting', label: 'Sibling fighting', icon: '😤' },
  { key: 'bedtime', label: 'Getting to bed', icon: '🌙' },
  { key: 'sleep', label: 'Staying asleep', icon: '😴' },
]

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
  const [showComplete, setShowComplete] = useState(false)
  const [loggedTracker, setLoggedTracker] = useState(false)
  const [selectedMoments, setSelectedMoments] = useState<string[]>([])
  const [momentsSaved, setMomentsSaved] = useState(false)
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

    await new Promise(r => setTimeout(r, 320))

    if (dir === 'next') {
      if (!isLast) {
        setCardIndex(i => i + 1)
      } else if (!done) {
        setDone(true)
        setShowComplete(true)
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
            background: 'var(--terracotta)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', color: 'var(--ink)', margin: '0 auto 16px',
            boxShadow: '0 6px 0 var(--terracotta-dark)',
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

        {/* Tracker check-in */}
        {!loggedTracker ? (
          <div style={{
            background: '#fff', border: '1.5px solid var(--border)',
            borderRadius: '20px', padding: '22px', marginBottom: '16px',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>
              Quick tracker check-in
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

        {/* Daily moments feedback */}
        {!momentsSaved ? (
          <div style={{
            background: '#fff', border: '1.5px solid var(--border)',
            borderRadius: '20px', padding: '22px', marginBottom: '16px',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '8px' }}>
              What came up today?
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '16px' }}>
              Tap anything that happened. We will show you the right scripts tomorrow.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {DAILY_MOMENTS.map(m => {
                const active = selectedMoments.includes(m.key)
                return (
                  <button
                    key={m.key}
                    onClick={() => toggleMoment(m.key)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '100px',
                      border: `1.5px solid ${active ? 'var(--stage-2)' : 'var(--border)'}`,
                      background: active ? 'var(--stage-2)' : 'var(--cream)',
                      fontFamily: 'var(--font-mono)', fontSize: '11px',
                      fontWeight: active ? 700 : 500,
                      color: active ? 'var(--ink)' : 'var(--ink-soft)',
                      cursor: 'pointer', letterSpacing: '.04em',
                      transition: 'all 0.15s ease',
                      display: 'flex', alignItems: 'center', gap: '5px',
                    }}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                )
              })}
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
                transition: 'all 0.15s ease',
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
            border: 'none', borderRadius: '16px',
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
  return (
    <div
      style={{ maxWidth: '480px', margin: '0 auto', padding: '16px 16px 48px', minHeight: '70dvh' }}
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
              background: i <= cardIndex ? 'var(--terracotta)' : 'var(--border)',
              transition: 'width 0.25s ease, background 0.25s ease',
            }} />
          ))}
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', minWidth: 36, textAlign: 'right' }}>
          {cardIndex + 1}/{cards.length}
        </div>
      </div>

      {/* Card tile */}
      <div
        onClick={() => !isLast && navigate('next')}
        style={{
          background: '#fff',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(26,26,46,0.14), 0 2px 8px rgba(26,26,46,0.08)',
          border: '1px solid var(--border)',
          cursor: isLast ? 'default' : 'pointer',
          opacity: isExiting ? 0 : 1,
          transform: isExiting
            ? `translateX(${exitDir === 'left' ? '-130%' : '130%'}) rotate(${exitDir === 'left' ? '-12deg' : '12deg'})`
            : 'translateX(0) rotate(0deg)',
          transition: isExiting
            ? 'opacity 0.3s ease, transform 0.32s cubic-bezier(0.4, 0, 0.6, 1)'
            : 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          marginBottom: '20px',
          userSelect: 'none',
        }}
      >
        {/* Curved terracotta header band */}
        <div style={{
          background: 'var(--terracotta)',
          padding: '22px 24px 26px',
          borderRadius: '0 0 32px 32px',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
            letterSpacing: '.18em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,.9)', marginBottom: '6px',
          }}>
            {card.eyebrow}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(1.15rem, 4vw, 1.5rem)',
            color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em',
          }}>
            {card.headline}
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: '28px 24px 30px', background: 'var(--terracotta-lt)' }}>
          <p style={{
            fontSize: 'clamp(16px, 4vw, 20px)',
            lineHeight: 1.55,
            color: 'var(--ink)',
            margin: 0,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            fontFamily: 'var(--font-display)',
          }}>
            {card.body}
          </p>
        </div>

        {/* Tap hint strip — only on non-last cards */}
        {!isLast && (
          <div style={{
            background: 'var(--cream)', borderTop: '1px solid var(--border)',
            padding: '10px 24px',
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600,
            color: 'var(--ink)', letterSpacing: '.08em',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>Tap card or swipe left</span>
            <span>Next →</span>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {cardIndex > 0 && (
          <button
            onClick={() => navigate('back')}
            style={{
              padding: '14px 18px', background: 'var(--cream)',
              border: '1.5px solid var(--border)', borderRadius: '14px',
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
            border: 'none', borderRadius: '14px',
            fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700,
            letterSpacing: '.08em', textTransform: 'uppercase',
            color: 'var(--ink)', cursor: 'pointer',
            boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}
        >
          {isLast && done ? 'Back to home' : isLast ? 'Done for today ✓' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
