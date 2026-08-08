'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// A running check in, not a one day question: this card asks about whatever
// is still open, however many days it has been coming up, and keeps asking
// until the family says it is better twice in a row.
//
// ONE SLIDER IS THE WHOLE ANSWER
//
// This used to ask twice: a better same or still hard chip, then an optional
// 0 to 10 strip on a six second timer. Justin, 8 August: the strip shut down
// on anyone who paused to think, answering twice was too much, and nobody
// knew what the numbers meant. So the chips and the timer are gone, and the
// answer is one slider, the Apple Health mood pattern in our own butter and
// ink: a big live word that names the number as you move, both ends
// labelled, and last time's number marked on the track so today's has
// something to mean something against.
//
// The scale runs UP: 1 is really tough, 10 is going great, so a family's
// chart climbs as their weeks improve. Direction is computed on the server
// by comparing with their last score, never asked. Nothing here is on a
// countdown: the card sits open until the parent moves the slider, and only
// their own release starts the short save beat, which a second touch cancels.

export type ConcernCheckItem = {
  slug: string
  label: string
  timesFlagged: number
  lastFlaggedAt: string
  /** Their previous 1 to 10, from the event log. Null before the first one. */
  lastScore: number | null
}

function recencyLabel(item: ConcernCheckItem): string {
  const daysSince = Math.floor((Date.now() - new Date(item.lastFlaggedAt).getTime()) / 86400000)
  if (item.timesFlagged > 1) return `Come up ${item.timesFlagged} times, still open`
  if (daysSince <= 1) return 'You flagged this yesterday'
  return `You flagged this ${daysSince} days ago`
}

// The live word above the slider. Same bands the whole app uses to talk
// about the scale, so a 7 means the same thing everywhere.
export function scoreWord(n: number): string {
  if (n <= 2) return 'Really tough'
  if (n <= 4) return 'Hard going'
  if (n <= 6) return 'Up and down'
  if (n <= 8) return 'Getting there'
  return 'Going great'
}

// What their number means against their last one, shown in the beat before
// the row folds. The maths mirrors the server's, which owns the real verdict.
function verdictLine(n: number, last: number | null): string {
  if (n >= 9) return 'That is nearly sorted. One more like this and we mark it done.'
  if (last == null) return 'First mark down. Next check shows which way it is moving.'
  if (n > last) return `Up from ${last}. The line is moving your way.`
  if (n < last) return `Down from ${last}. DiGi has the next move when you want it.`
  return `Holding at ${n}. Steady counts.`
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const FOLD_MS = 550
// How long the chosen number and its verdict sit on screen before the row
// folds. Long enough to read, and grabbing the slider again cancels it.
const SAVE_BEAT_MS = 1600

export default function ConcernCheckIn({ concerns }: { concerns: ConcernCheckItem[] }) {
  // value: where the slider sits. touched: they have moved it, so the live
  // word shows and a release will save. saved: posted, verdict showing.
  // folded: collapsed out of the card.
  const [value, setValue] = useState<Record<string, number>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [folded, setFolded] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const posted = useRef<Record<string, boolean>>({})
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  // The release handler fires in the same breath as the last change event,
  // sometimes before React has re-rendered, so the freshest value lives in a
  // ref rather than in the closure.
  const liveValue = useRef<Record<string, number>>({})

  if (concerns.length === 0) return null

  const allFolded = concerns.every(c => folded[c.slug])

  const post = (slug: string, body: Record<string, unknown>) => {
    if (posted.current[slug]) return
    posted.current[slug] = true
    if (timers.current[slug]) clearTimeout(timers.current[slug])
    setSaved(prev => ({ ...prev, [slug]: true }))
    fetch('/api/daily/concern-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, ...body }),
    })
      // The Home path strip reads this same data server side. Refresh the
      // router cache the moment an answer lands, so tapping Home right
      // after does not show the check in step as still glowing and undone.
      .then(() => router.refresh())
      .catch(() => {})
    setTimeout(() => setFolded(prev => ({ ...prev, [slug]: true })), 1800)
  }

  // Release starts the beat; a fresh grab cancels it. Nothing saves until
  // the parent has actually moved the slider.
  const armSave = (slug: string) => {
    if (posted.current[slug]) return
    const n = liveValue.current[slug]
    if (typeof n !== 'number') return
    if (timers.current[slug]) clearTimeout(timers.current[slug])
    timers.current[slug] = setTimeout(() => post(slug, { score: n }), SAVE_BEAT_MS)
  }
  const cancelSave = (slug: string) => {
    if (timers.current[slug]) clearTimeout(timers.current[slug])
  }

  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid var(--border)',
      borderRadius: '20px',
      padding: '22px',
      marginBottom: '16px',
    }}>
      {/* The slider chrome: the native input supplies the drag and the
          accessibility, our own track underneath supplies the look. Only the
          thumb of the input is visible. */}
      <style>{`
        .gc-scale-input {
          -webkit-appearance: none;
          appearance: none;
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          background: transparent;
          cursor: pointer;
        }
        .gc-scale-input::-webkit-slider-runnable-track { background: transparent; height: 100%; }
        .gc-scale-input::-moz-range-track { background: transparent; height: 100%; }
        .gc-scale-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 30px;
          height: 30px;
          margin-top: 5px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid var(--ink);
          box-shadow: 0 3px 0 rgba(26,26,46,0.35);
        }
        .gc-scale-input::-moz-range-thumb {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid var(--ink);
          box-shadow: 0 3px 0 rgba(26,26,46,0.35);
        }
      `}</style>

      {!allFolded ? (
        <>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '.12em', textTransform: 'uppercase',
            color: 'var(--stage-2-text)', marginBottom: '8px',
          }}>
            Still on the list
          </div>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '16px' }}>
            Slide to where each one is today. That is the whole answer.
          </p>

          {concerns.map(c => {
            const isFolded = folded[c.slug]
            const isSaved = saved[c.slug]
            const isTouched = touched[c.slug]
            const n = value[c.slug] ?? c.lastScore ?? 5
            // 1..10 mapped across the track, matching the thumb's travel:
            // the 30px thumb keeps 15px in reserve at each end.
            const pct = ((n - 1) / 9) * 100
            const lastPct = c.lastScore != null ? ((c.lastScore - 1) / 9) * 100 : null
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
                  <div style={{ padding: '9px 0 13px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px' }}>
                      <div style={{
                        fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 800,
                        color: 'var(--ink)', marginBottom: '2px',
                      }}>
                        {c.label}
                      </div>
                      {!isSaved && (
                        <button
                          onClick={() => post(c.slug, { answer: 'same', score: null })}
                          style={{
                            background: 'none', border: 'none', padding: 0,
                            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                            fontWeight: 700, color: 'var(--ink-muted)',
                            textDecoration: 'underline', cursor: 'pointer', flexShrink: 0,
                          }}
                        >
                          Skip
                        </button>
                      )}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600,
                      color: 'var(--ink-muted)', marginBottom: '12px',
                    }}>
                      {recencyLabel(c)}{c.lastScore != null ? ` · last time you said ${c.lastScore}` : ''}
                    </div>

                    {/* The live readout. Before the first touch it invites,
                        after it names the number, and once saved it says what
                        the number means against last time. */}
                    <div aria-live="polite" style={{ textAlign: 'center', marginBottom: '10px', minHeight: '2.4em' }}>
                      {isSaved ? (
                        <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.4 }}>
                          {verdictLine(n, c.lastScore)}
                        </span>
                      ) : isTouched ? (
                        <>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                            {scoreWord(n)}
                          </span>
                          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', marginTop: '2px' }}>
                            {n} of 10
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)' }}>
                          Where is it today?
                        </span>
                      )}
                    </div>

                    {/* The track: butter fills to the thumb, a hollow ring
                        remembers last time. */}
                    <div style={{ position: 'relative', height: '40px', opacity: isSaved ? 0.55 : 1, transition: 'opacity 0.4s ease' }}>
                      <div style={{
                        position: 'absolute', left: '15px', right: '15px', top: '15px', height: '10px',
                        borderRadius: '100px', background: 'var(--cream)', border: '1px solid var(--border)',
                      }}>
                        {isTouched && (
                          <div style={{
                            position: 'absolute', left: 0, top: '-1px', bottom: '-1px',
                            width: `${pct}%`, borderRadius: '100px',
                            background: 'var(--terracotta)', border: '1px solid var(--terracotta-dark)',
                          }} />
                        )}
                        {lastPct != null && (
                          <div aria-hidden style={{
                            position: 'absolute', left: `${lastPct}%`, top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '16px', height: '16px', borderRadius: '50%',
                            background: '#fff', border: '2px solid var(--ink-muted)',
                          }} />
                        )}
                      </div>
                      <input
                        className="gc-scale-input"
                        type="range"
                        min={1}
                        max={10}
                        step={1}
                        value={n}
                        disabled={!!isSaved}
                        aria-label={`${c.label}: 1 really tough to 10 going great`}
                        onChange={e => {
                          const next = Number(e.target.value)
                          liveValue.current[c.slug] = next
                          setValue(prev => ({ ...prev, [c.slug]: next }))
                          setTouched(prev => ({ ...prev, [c.slug]: true }))
                        }}
                        onPointerDown={() => cancelSave(c.slug)}
                        onPointerUp={() => armSave(c.slug)}
                        // Keyboard users get the same release-to-save rhythm.
                        onKeyUp={() => armSave(c.slug)}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', marginTop: '4px', padding: '0 4px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: 'left' }}>
                        1<br />Really tough
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: 'right' }}>
                        10<br />Going great
                      </span>
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
