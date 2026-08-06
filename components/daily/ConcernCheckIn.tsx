'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// A running check in, not a one day question: this card asks about
// whatever is still open, however many days it has been coming up, and
// keeps asking every day until the family says it is better twice in a
// row. One tap answers, the row folds away, and when every row is
// answered the card becomes a single warm line. Answers post to the
// concerns ledger, which moves each one along open → improving → resolved.
//
// THE NUMBER, AND WHY IT NEVER COSTS A TAP
//
// Better, same and still hard is too coarse to show distance travelled: a
// parent who went from a screaming match every night to one grumble a week
// reads the same as one who was mildly irritated. So after the chip, a 0 to 10
// strip appears and the answer is held for a beat.
//
// The chip stays the whole interaction. If the parent taps a number we save it,
// if they tap skip we save without it, and if they do neither the answer posts
// itself after a few seconds and the row folds anyway. Nobody is ever made to
// score their own family to get their card to go away.
//
// Holding the post rather than firing on the chip keeps one parent action to one
// immutable event (migration 164). Posting twice would either double count the
// check in or move the concern two steps along its arc for a single tap.

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
// How long the number strip waits before giving up and saving without one. Long
// enough to notice and answer, short enough that an abandoned card still records
// the tap the parent actually made.
const RATING_GRACE_MS = 6000

const SCALE = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export default function ConcernCheckIn({ concerns }: { concerns: ConcernCheckItem[] }) {
  // answered: the chip is chosen and highlighted. rating: the row is waiting on
  // an optional number. folded: the row has collapsed out of the card. The gap
  // between them is the beat the parent gets to see their answer land.
  const [answered, setAnswered] = useState<Record<string, Answer>>({})
  const [rating, setRating] = useState<Record<string, boolean>>({})
  const [folded, setFolded] = useState<Record<string, boolean>>({})
  const router = useRouter()

  // One post per concern, whichever path gets there first.
  const posted = useRef<Record<string, boolean>>({})
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  if (concerns.length === 0) return null

  const allAnswered = concerns.every(c => answered[c.slug])
  const allFolded = concerns.every(c => folded[c.slug])

  const send = (slug: string, choice: Answer, severity: number | null) => {
    if (posted.current[slug]) return
    posted.current[slug] = true
    if (timers.current[slug]) clearTimeout(timers.current[slug])

    fetch('/api/daily/concern-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, answer: choice, severity }),
    })
      // The Home path strip reads this same data server side. Refresh the
      // router cache the moment an answer lands, so tapping Home right
      // after does not show the check in step as still glowing and undone.
      .then(() => router.refresh())
      .catch(() => {})

    setRating(prev => ({ ...prev, [slug]: false }))
    setTimeout(() => {
      setFolded(prev => ({ ...prev, [slug]: true }))
    }, FOLD_DELAY_MS)
  }

  const answer = (slug: string, choice: Answer) => {
    if (answered[slug]) return
    setAnswered(prev => ({ ...prev, [slug]: choice }))
    setRating(prev => ({ ...prev, [slug]: true }))
    // The safety net. If the parent walks away, their tap still counts.
    timers.current[slug] = setTimeout(() => send(slug, choice, null), RATING_GRACE_MS)
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
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '.12em', textTransform: 'uppercase',
            color: 'var(--stage-2-text)', marginBottom: '8px',
          }}>
            Still on the list
          </div>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '16px' }}>
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
                      fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 800,
                      color: 'var(--ink)', marginBottom: '2px',
                    }}>
                      {c.label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600,
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
                              fontSize: 'var(--text-md)',
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

                    {rating[c.slug] && chosen && (
                      <div style={{ marginTop: '12px' }}>
                        <div style={{
                          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                          gap: '10px', marginBottom: '7px',
                        }}>
                          <span style={{
                            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                            fontWeight: 600, color: 'var(--ink-soft)',
                          }}>
                            How bad is it now? 0 is fine, 10 is the worst it gets.
                          </span>
                          <button
                            onClick={() => send(c.slug, chosen, null)}
                            style={{
                              background: 'none', border: 'none', padding: 0,
                              fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                              fontWeight: 700, color: 'var(--ink-muted)',
                              textDecoration: 'underline', cursor: 'pointer', flexShrink: 0,
                            }}
                          >
                            Skip
                          </button>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {SCALE.map(n => (
                            <button
                              key={n}
                              onClick={() => send(c.slug, chosen, n)}
                              aria-label={`${n} out of 10`}
                              style={{
                                flex: 1,
                                minWidth: 0,
                                padding: '9px 0',
                                borderRadius: '9px',
                                border: '1.5px solid var(--border)',
                                background: '#fff',
                                fontFamily: 'var(--font-mono)',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 700,
                                color: 'var(--ink-soft)',
                                cursor: 'pointer',
                              }}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', fontWeight: 600,
          color: 'var(--ink-soft)',
        }}>
          <span aria-hidden style={{
            width: '22px', height: '22px', borderRadius: '50%',
            background: 'var(--tint-green)', border: '1.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'var(--text-sm)', color: 'var(--ink)', flexShrink: 0,
          }}>✓</span>
          All checked. Small steps, kept up, are how this turns.
        </div>
      )}
    </div>
  )
}
