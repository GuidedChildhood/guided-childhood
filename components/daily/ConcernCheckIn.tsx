'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// A running check in, not a one day question: this card asks about whatever
// is still open, however many days it has been coming up, and keeps asking
// until the family says it is better twice in a row.
//
// ONE DIAL IS THE WHOLE ANSWER, AND IT STAYS ON SCREEN
//
// The scale runs UP: 1 is really tough, 10 is going great, so a family's
// chart climbs as their weeks improve. Last check in sits on the track as a
// red dotted ring the whole time, so today's number is always read against
// it, and the thumb starts in the middle rather than on top of the marker
// (Justin, 8 August: the first version hid last time under the handle, saved
// too fast, and folded away before the note could be read).
//
// So now: slide, let go, and a note appears saying where today sits against
// last time. The row then LOCKS AND STAYS, dotted ring for last time, filled
// track for today, so the before and after of every check in is left on
// screen rather than vanishing. Nothing here is ever on a countdown before
// the parent has moved anything, and a fresh grab during the save beat
// cancels it. Direction is computed on the server from the event log, never
// asked.

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

// The live word above the dial. Same bands the whole app uses to talk
// about the scale, so a 7 means the same thing everywhere.
export function scoreWord(n: number): string {
  if (n <= 2) return 'Really tough'
  if (n <= 4) return 'Hard going'
  if (n <= 6) return 'Up and down'
  if (n <= 8) return 'Getting there'
  return 'Going great'
}

// What their number means against their last one. Shown when the save beat
// starts and left on screen afterwards. The maths mirrors the server's,
// which owns the real verdict.
function verdictLine(n: number, last: number | null): string {
  if (last == null) {
    return n >= 9
      ? 'First mark down, and nearly sorted already. One more like this and we mark it done.'
      : 'First mark down. Your next check in reads against this one.'
  }
  if (n > last) return `Today ${n}, last check in ${last}. The line is climbing.`
  if (n < last) return `Today ${n}, last check in ${last}. A dip is information, not a verdict. DiGi has the next move when you want it.`
  return `Holding at ${n}, same as last check in. Steady counts.`
}

// How long the note sits before the answer posts. Long enough to read the
// comparison, and grabbing the dial again cancels it and starts over.
const SAVE_BEAT_MS = 2600

export default function ConcernCheckIn({ concerns }: { concerns: ConcernCheckItem[] }) {
  // value: where the dial sits once touched. touched: the live word shows
  // and release will save. saved: posted, the row is locked and stays.
  const [value, setValue] = useState<Record<string, number>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const posted = useRef<Record<string, boolean>>({})
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  // The release handler can fire before React re-renders the last change
  // event, so the freshest value lives in a ref rather than in the closure.
  const liveValue = useRef<Record<string, number>>({})

  if (concerns.length === 0) return null

  const allSaved = concerns.every(c => saved[c.slug])

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
  }

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
      {/* The dial chrome: the native input supplies the drag and the
          accessibility, our own track underneath supplies the look. Only the
          thumb of the input is visible. The tall hit area is deliberate:
          thumbs, not cursors. */}
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
        .gc-scale-input:disabled { cursor: default; }
        .gc-scale-input::-webkit-slider-runnable-track { background: transparent; height: 100%; }
        .gc-scale-input::-moz-range-track { background: transparent; height: 100%; }
        .gc-scale-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 34px;
          height: 34px;
          margin-top: 11px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid var(--ink);
          box-shadow: 0 3px 0 rgba(26,26,46,0.35);
        }
        .gc-scale-input::-moz-range-thumb {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid var(--ink);
          box-shadow: 0 3px 0 rgba(26,26,46,0.35);
        }
      `}</style>

      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '.12em', textTransform: 'uppercase',
        color: 'var(--stage-2-text)', marginBottom: '8px',
      }}>
        Still on the list
      </div>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '16px' }}>
        Slide to where each one is today. That is the whole answer. The red ring is where it was last time.
      </p>

      {concerns.map(c => {
        const isSaved = saved[c.slug]
        const isTouched = touched[c.slug]
        // The thumb starts mid track, never on top of the last time ring, so
        // the ring is visible from the first glance.
        const n = value[c.slug] ?? 5
        const pct = ((n - 1) / 9) * 100
        const lastPct = c.lastScore != null ? ((c.lastScore - 1) / 9) * 100 : null
        return (
          <div key={c.slug} style={{ padding: '9px 0 15px' }}>
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

            {/* The live readout: an invitation before the first touch, the
                word and number while dialling, and the comparison note once
                the save beat starts. The note STAYS after saving. */}
            <div aria-live="polite" style={{ textAlign: 'center', marginBottom: '10px', minHeight: '2.6em' }}>
              {isTouched ? (
                <>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                    {scoreWord(n)}
                  </span>
                  <span style={{ display: 'block', fontSize: 'var(--text-base)', fontWeight: 600, color: isSaved ? 'var(--ink)' : 'var(--ink-soft)', lineHeight: 1.45, marginTop: '3px' }}>
                    {verdictLine(n, c.lastScore)}{isSaved ? ' Saved.' : ''}
                  </span>
                </>
              ) : isSaved ? (
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.45 }}>
                  Skipped for today. It stays on the list.
                </span>
              ) : (
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)' }}>
                  Where is it today?
                </span>
              )}
            </div>

            {/* The track: butter fills to the thumb once touched, and the red
                dotted ring holds last check in's spot the whole time, before
                and after saving. */}
            <div style={{ position: 'relative', height: '56px' }}>
              <div style={{
                position: 'absolute', left: '17px', right: '17px', top: '23px', height: '10px',
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
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.85)', border: '2.5px dotted var(--alert)',
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
        )
      })}

      {allSaved && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', fontWeight: 600,
          color: 'var(--ink-soft)',
        }}>
          <span aria-hidden style={{
            width: '22px', height: '22px', borderRadius: '50%',
            background: 'var(--tint-green)', border: '1.5px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'var(--text-sm)', color: 'var(--ink)', flexShrink: 0,
          }}>✓</span>
          All checked. Small steps, kept up, are how this turns. The rings show how far each one has moved.
        </div>
      )}
    </div>
  )
}
