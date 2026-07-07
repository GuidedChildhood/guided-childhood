'use client'

import { useState } from 'react'

// A running check in, not a one day question: this card asks about
// whatever is still open, however many days it has been coming up, and
// keeps asking every day until the family says it is better twice in a
// row. One tap answers, the row folds away, and when every row is
// answered the card becomes a single warm line. Answers post to the
// concerns ledger, which moves each one along open → improving → resolved.

export type ConcernCheckItem = {
  slug: string
  label: string
  timesFlagged: number
  lastFlaggedAt: string
}

function recencyLabel(item: ConcernCheckItem): string {
  const daysSince = Math.floor((Date.now() - new Date(item.lastFlaggedAt).getTime()) / 86400000)
  if (item.timesFlagged > 1) return `Come up ${item.timesFlagged} times, still open`
  if (daysSince <= 1) return 'You flagged this yesterday'
  return `You flagged this ${daysSince} days ago`
}

type Answer = 'better' | 'same' | 'hard'

const CHIPS: { answer: Answer; label: string }[] = [
  { answer: 'better', label: 'Better' },
  { answer: 'same', label: 'Same' },
  { answer: 'hard', label: 'Still hard' },
]

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const FOLD_MS = 550
const FOLD_DELAY_MS = 500

export default function ConcernCheckIn({ concerns }: { concerns: ConcernCheckItem[] }) {
  // answered: the chip is chosen and highlighted. folded: the row has
  // collapsed out of the card. The gap between the two is the beat the
  // parent gets to see their answer land.
  const [answered, setAnswered] = useState<Record<string, Answer>>({})
  const [folded, setFolded] = useState<Record<string, boolean>>({})

  if (concerns.length === 0) return null

  const allAnswered = concerns.every(c => answered[c.slug])
  const allFolded = concerns.every(c => folded[c.slug])

  const answer = (slug: string, choice: Answer) => {
    if (answered[slug]) return
    setAnswered(prev => ({ ...prev, [slug]: choice }))
    fetch('/api/daily/concern-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, answer: choice }),
    }).catch(() => {})
    setTimeout(() => {
      setFolded(prev => ({ ...prev, [slug]: true }))
    }, FOLD_DELAY_MS)
  }

  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid var(--border)',
      borderRadius: '20px',
      padding: '22px',
      marginBottom: '16px',
    }}>
      {!(allAnswered && allFolded) ? (
        <>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
            letterSpacing: '.12em', textTransform: 'uppercase',
            color: 'var(--stage-2-text)', marginBottom: '8px',
          }}>
            Still on the list
          </div>
          <p style={{ fontSize: '15px', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '16px' }}>
            One tap each. How did these go today?
          </p>

          {concerns.map(c => {
            const chosen = answered[c.slug]
            const isFolded = folded[c.slug]
            return (
              <div
                key={c.slug}
                style={{
                  display: 'grid',
                  gridTemplateRows: isFolded ? '0fr' : '1fr',
                  opacity: isFolded ? 0 : 1,
                  transform: isFolded ? 'translateX(24px)' : 'translateX(0)',
                  transition: `grid-template-rows ${FOLD_MS}ms ${EASE}, opacity ${FOLD_MS}ms ease, transform ${FOLD_MS}ms ${EASE}`,
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '9px 0' }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: '16.5px', fontWeight: 800,
                      color: 'var(--ink)', marginBottom: '2px',
                    }}>
                      {c.label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 600,
                      color: 'var(--ink-muted)', marginBottom: '9px',
                    }}>
                      {recencyLabel(c)}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {CHIPS.map(chip => {
                        const active = chosen === chip.answer
                        return (
                          <button
                            key={chip.answer}
                            onClick={() => answer(c.slug, chip.answer)}
                            disabled={!!chosen}
                            style={{
                              padding: '12px 8px',
                              borderRadius: '14px',
                              border: `2px solid ${active ? 'var(--terracotta)' : 'var(--border)'}`,
                              background: active ? 'var(--terracotta)' : '#fff',
                              fontFamily: 'var(--font-display)',
                              fontSize: '14.5px',
                              fontWeight: 800,
                              color: active ? 'var(--ink)' : 'var(--ink-soft)',
                              cursor: chosen ? 'default' : 'pointer',
                              opacity: chosen && !active ? 0.4 : 1,
                              boxShadow: active ? '0 3px 0 var(--terracotta-dark)' : '0 3px 0 var(--border)',
                              transition: 'all 0.5s ease',
                            }}
                          >
                            {chip.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          fontFamily: 'var(--font-body)', fontSize: '14.5px', fontWeight: 600,
          color: 'var(--ink-soft)',
        }}>
          <span aria-hidden style={{
            width: '22px', height: '22px', borderRadius: '50%',
            background: 'var(--tint-green)', border: '1.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', color: 'var(--ink)', flexShrink: 0,
          }}>✓</span>
          All checked. Small steps, kept up, are how this turns.
        </div>
      )}
    </div>
  )
}
