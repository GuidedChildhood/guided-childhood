'use client'
import { useState, useCallback } from 'react'

interface Placard {
  front: string
  back: string
  frontLabel: string
  backLabel: string
  bg: string
  stage: string
}

export default function FlipCards({ cards }: { cards: Placard[] }) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set())

  const toggle = useCallback((i: number) => {
    setFlipped(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }, [])

  return (
    <div className="placard-grid">
      {cards.map((card, i) => {
        const isFlipped = flipped.has(i)
        return (
          <div
            key={i}
            className="placard-wrapper"
            onClick={() => toggle(i)}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggle(i)}
            tabIndex={0}
            role="button"
            aria-label={isFlipped ? 'Show parent problem' : 'Show solution'}
            aria-pressed={isFlipped}
          >
            <div className={`placard-inner${isFlipped ? ' flipped' : ''}`}>

              {/* Front face: parent problem */}
              <div className="placard-face" style={{ background: card.bg }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '.58rem',
                  fontWeight: 700,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-soft)',
                  marginBottom: '10px',
                }}>
                  {card.frontLabel}
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '.88rem',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: 'var(--ink)',
                  lineHeight: 1.55,
                  flex: 1,
                }}>
                  {card.front}
                </p>
                <p style={{
                  fontSize: '.6rem',
                  color: 'var(--ink-muted)',
                  fontWeight: 600,
                  letterSpacing: '.04em',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--ink-muted)',
                    textAlign: 'center',
                    lineHeight: '11px',
                    fontSize: '.55rem',
                  }}>↺</span>
                  Tap for the fix
                </p>
              </div>

              {/* Back face: solution */}
              <div className="placard-face placard-back-face">
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '.58rem',
                  fontWeight: 700,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,.45)',
                  marginBottom: '10px',
                }}>
                  {card.backLabel}
                </p>
                <p style={{
                  fontSize: '.84rem',
                  color: 'rgba(255,255,255,.92)',
                  lineHeight: 1.65,
                  flex: 1,
                }}>
                  {card.back}
                </p>
                <p style={{
                  fontSize: '.6rem',
                  color: 'rgba(255,255,255,.35)',
                  fontWeight: 600,
                  letterSpacing: '.06em',
                  marginTop: '12px',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {card.stage}
                </p>
              </div>

            </div>
          </div>
        )
      })}
    </div>
  )
}
