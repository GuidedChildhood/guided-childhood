'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// A running check in, not a one day question: this card asks about whatever
// is still open, however many days it has been coming up, and keeps asking
// until the family says it is better twice in a row.
//
// ONE NUMBER IS THE WHOLE ANSWER, AND IT STAYS ON SCREEN
//
// The scale runs UP: 1 is really tough, 10 is going great, so a family's chart
// climbs as their weeks improve. Last check in keeps its red dotted ring on the
// same scale the whole time, so today's number is always read against it.
//
// ── TEN TAPS, NOT A DRAG (11 August 2026) ────────────────────────────────────
//
// Justin, twice: "the sliders here are still clunky, is there a better way to
// give a 1 to 10 rating."
//
// He was right, and the reason is that a drag was always the wrong instrument.
// A slider is for a continuous quantity you dial in. This is ten discrete
// answers and the parent knows which one they want before they touch the
// screen, so a drag made them press, aim and release to say a number they had
// already picked, while fighting the page scroll the whole way.
//
// Every piece of cleverness this card had needed existed to prop that up: a
// fractional step so the thumb glided rather than stepped, touch-action none so
// the page did not scroll away mid drag, a reserved text height so the track
// could not shift under a moving thumb. All of it is gone. Ten targets you can
// see, one tap each, chosen and committed in the same movement.
//
// What survives, because it was never the problem: the save beat, so the
// comparison line can be read and the answer changed; the row LOCKING AND
// STAYING afterwards, so the before and after of every check in is left on
// screen; the green that means set; and the gentle hand over to the next one.
// Direction is computed on the server from the event log, never asked.

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
// comparison, and tapping a different number starts it over.
const SAVE_BEAT_MS = 2600

export default function ConcernCheckIn({ concerns }: { concerns: ConcernCheckItem[] }) {
  // value: the number tapped, always a whole one now that there is no drag to
  // glide. touched: something has been picked, so the word and the comparison
  // show. pending: the save beat is running and can still be changed. saved:
  // posted and locked.
  const [value, setValue] = useState<Record<string, number>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [pending, setPending] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const posted = useRef<Record<string, boolean>>({})
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  // Each row's element, so a finished one can hand over to the next.
  const rows = useRef<Record<string, HTMLDivElement | null>>({})
  // The number as of the last tap, outside React's batching, so the timer that
  // fires two and a half seconds later posts what the parent actually chose
  // rather than what the closure captured.
  const liveValue = useRef<Record<string, number>>({})

  if (concerns.length === 0) return null

  const allSaved = concerns.every(c => saved[c.slug])

  // Hand over to the next one that still needs an answer.
  //
  // Justin: "a gentle little scroll to the next one, so they know this is set
  // and move on to the next one." Two jobs in one movement. It confirms the
  // one just answered is finished, because the card would not be moving if it
  // were not, and it puts the next question where their thumb already is
  // rather than leaving them to find it.
  //
  // GENTLE MEANS GENTLE. Smooth, centred rather than jammed to the top, and
  // only ever to a row that is still unanswered, so a parent working back up
  // the list is never dragged forwards. On the last one nothing moves at all:
  // the all checked line appears directly underneath and yanking the page at
  // the moment somebody finishes reads as the app losing interest.
  //
  // A parent who has asked their system for less motion gets a jump instead of
  // a glide, which is the same handover without the movement.
  const handOver = (fromSlug: string, done: Record<string, boolean>) => {
    const i = concerns.findIndex(c => c.slug === fromSlug)
    const next = concerns.slice(i + 1).find(c => !done[c.slug])
    const el = next ? rows.current[next.slug] : null
    if (!el) return
    const still = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' })
  }

  const post = (slug: string, body: Record<string, unknown>) => {
    if (posted.current[slug]) return
    posted.current[slug] = true
    if (timers.current[slug]) clearTimeout(timers.current[slug])
    setSaved(prev => {
      const next = { ...prev, [slug]: true }
      // After paint, so the row being left has already settled into its saved
      // state and the scroll lands on a card that has stopped changing.
      requestAnimationFrame(() => handOver(slug, next))
      return next
    })
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

  // One tap picks the number AND commits it, because with ten targets there is
  // nothing to aim at while moving and nothing to release. The save beat stays:
  // it is what lets a parent read the comparison line and change their mind,
  // and tapping a different number inside it simply starts the beat again.
  const pick = (slug: string, n: number) => {
    if (posted.current[slug]) return
    liveValue.current[slug] = n
    setValue(prev => ({ ...prev, [slug]: n }))
    setTouched(prev => ({ ...prev, [slug]: true }))
    if (timers.current[slug]) clearTimeout(timers.current[slug])
    setPending(prev => ({ ...prev, [slug]: true }))
    timers.current[slug] = setTimeout(() => post(slug, { score: n }), SAVE_BEAT_MS)
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

      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '.12em', textTransform: 'uppercase',
        color: 'var(--stage-2-text)', marginBottom: '8px',
      }}>
        Still on the list
      </div>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, marginBottom: '16px' }}>
        Tap where each one is today. That is the whole answer. The red ring is where it was last time.
      </p>

      {concerns.map(c => {
        const isSaved = saved[c.slug]
        const isTouched = touched[c.slug]
        const isPending = pending[c.slug]
        // The thumb starts mid track, never on top of the last time ring, so
        // the ring is visible from the first glance. The raw value glides
        // fractionally under the thumb; the words and the save always use
        // the rounded score.
        const n = value[c.slug] ?? 5
        const shown = Math.min(10, Math.max(1, Math.round(n)))
        return (
          <div
            key={c.slug}
            ref={el => { rows.current[c.slug] = el }}
            style={{ padding: '9px 0 15px', scrollMarginTop: '16px' }}
          >
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

            {/* One line above the dots, and one only. Everything the answer
                produces now sits BELOW them.

                The old readout lived up here and reserved 6.4em of empty space
                on every row, because with a drag the text growing would have
                shifted the track under a moving thumb. That reservation was the
                single biggest thing making this card enormous: three concerns
                meant three screenfuls of mostly nothing.

                With taps there is no thumb to shift under, and putting the
                result underneath means the dots never move at all, even when a
                parent changes their mind and the sentence under them gets
                longer. Same protection, no empty space. */}
            <div style={{ textAlign: 'center', marginBottom: '8px', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)' }}>
              {isTouched ? scoreWord(shown) : isSaved ? 'Skipped for today' : 'Where is it today?'}
            </div>

            {/* TEN TAPS, NOT A DRAG.
                Justin, twice: "the sliders here are still clunky, is there a
                better way to give a 1 to 10 rating."

                He is right, and the reason is that a drag was always the wrong
                instrument. A slider is for a continuous quantity you dial in.
                This is ten discrete answers, and the parent already knows which
                one they want before they touch the screen. A drag makes them
                press, aim, and release to say a number they had picked a second
                earlier, and on a phone it fights the page scroll the whole way.
                Every bit of cleverness this card has needed, the fractional
                glide, the touch-action, the reserved height so the track cannot
                shift mid drag, existed to make a drag survive a gesture it was
                not suited to.

                Ten targets you can see, one tap each. The number is chosen and
                committed in the same movement, there is nothing to aim at while
                moving, and nothing to release.

                LAST TIME KEEPS ITS RED RING, in the same place on the same
                scale, so the comparison is spatial before anybody reads a word:
                you can see whether today is left or right of last time. */}
            <div
              role="radiogroup"
              aria-label={`${c.label}: 1 really tough to 10 going great`}
              style={{ display: 'flex', gap: '5px', justifyContent: 'space-between', padding: '2px 0' }}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(dot => {
                const chosen = isTouched && shown === dot
                const filled = isTouched && dot <= shown
                const wasLast = c.lastScore === dot
                return (
                  <button
                    key={dot}
                    role="radio"
                    aria-checked={chosen}
                    aria-label={`${dot} out of 10, ${scoreWord(dot)}`}
                    disabled={!!isSaved}
                    onClick={() => pick(c.slug, dot)}
                    style={{
                      // A 30px dot inside a 44px tall button. The dot is what
                      // you read, the button is what your thumb hits, and the
                      // two are not the same size on purpose.
                      flex: '1 1 0', minWidth: 0, height: '44px', padding: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'none', border: 'none',
                      cursor: isSaved ? 'default' : 'pointer',
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '100%', maxWidth: '30px', aspectRatio: '1',
                        borderRadius: '50%',
                        fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700,
                        // Set is green, exactly as the dial was, so a finished
                        // row and the all checked tick agree on one colour.
                        background: chosen && (isPending || isSaved) ? 'var(--tint-green)'
                          : chosen ? 'var(--terracotta)'
                          : filled ? 'var(--terracotta-lt)'
                          : '#fff',
                        border: chosen && (isPending || isSaved) ? '2.5px solid var(--retro-green)'
                          : chosen ? '2.5px solid var(--terracotta-dark)'
                          // Last time, held on the scale the whole time, before
                          // and after today's answer lands.
                          : wasLast ? '2px dotted var(--alert)'
                          : '1.5px solid var(--border)',
                        color: 'var(--ink)',
                        boxShadow: chosen ? '0 2px 0 rgba(26,26,46,0.18)' : 'none',
                        transition: 'background 0.14s, border-color 0.14s',
                      }}
                    >
                      {dot}
                    </span>
                  </button>
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', marginTop: '4px', padding: '0 4px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: 'left' }}>
                1<br />Really tough
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: 'right' }}>
                10<br />Going great
              </span>
            </div>

            {/* What it means, under the dots, so nothing above ever moves.
                It STAYS after saving: the before and after of every check in is
                left on screen rather than vanishing, which is the whole reason
                a parent can see the line climbing over weeks. */}
            {(isTouched || isSaved) && (
              <div aria-live="polite" style={{ textAlign: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: isSaved ? 'var(--ink)' : 'var(--ink-soft)', lineHeight: 1.45 }}>
                  {isTouched
                    ? `${verdictLine(shown, c.lastScore)}${isSaved ? ' Saved.' : isPending ? ' Saving.' : ''}`
                    : 'Skipped for today. It stays on the list.'}
                </span>
              </div>
            )}
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
