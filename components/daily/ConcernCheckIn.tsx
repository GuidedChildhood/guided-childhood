'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// A running check in, not a one day question: this card asks about whatever
// is still open, however many days it has been coming up, and keeps asking
// until the family says it is better twice in a row.
//
// ── THREE ANSWERS, NOT TEN (12 August 2026) ──────────────────────────────────
//
// Justin: "is there an easier but just as accurate way to check in? 1 to 10 is
// confusing. I know we need to see previous rating and we record movement, but
// this needs to be quick and easy to go through."
//
// He is right on both counts and the research agrees. Reliability climbs
// steeply from two points to about five and then flattens; ten buys nothing but
// effort, and a single item ten point self report drifts about a point on its
// own with nothing having changed, so half the movement a chart like this
// celebrates is noise. Every clinical instrument that gets repeated week after
// week uses four or five. Nobody serious uses ten.
//
// And this app never used the ten anyway. scoreWord below collapses the scale
// into five bands, so a 7 and an 8 both read "Getting there" everywhere in the
// product. The ten point scale was a five point scale wearing a ten point coat,
// and the only place the extra grain did anything was the direction check,
// which is exactly where it turned drift into "the line is climbing".
//
// So the parent answers the question they can actually answer: is this better,
// the same, or harder than last time? Three targets across one row, the whole
// card short enough that every concern fits one screen.
//
// THE NUMBER IS NOT GONE, IT IS DERIVED. The server moves a level one step per
// answer and stores it, so the progress chart, the pathway history and DiGi's
// wisdom bank all keep reading exactly what they read before. See
// app/api/daily/concern-check/route.ts for why a derived level is the more
// honest number.
//
// What survives, because none of it was the problem: the save beat, so the
// verdict can be read and the answer changed; the row LOCKING AND STAYING
// afterwards, so the before and after of every check in is left on screen; the
// green that means set; and the hand over to the next one.

export type ConcernCheckItem = {
  slug: string
  label: string
  timesFlagged: number
  lastFlaggedAt: string
  /** Their previous 1 to 10, from the event log. Null before the first one.
   *  Still read so a family part way through the old scale keeps its history. */
  lastScore: number | null
  /** What they said last time, which is now the thing shown back to them.
   *  Null before the first check in. */
  lastAnswer?: 'better' | 'same' | 'hard' | null
}

/** The three answers, in the order they are shown. Better first because it is
 *  the one we are working towards, and putting the bad news last means a parent
 *  scanning left to right is not met with "harder" before anything else. */
export const ANSWERS = [
  { key: 'better' as const, label: 'Better', hint: 'Than last time' },
  { key: 'same' as const, label: 'The same', hint: 'No real change' },
  { key: 'hard' as const, label: 'Harder', hint: 'Tougher week' },
]

const ANSWER_WORD: Record<string, string> = {
  better: 'better', same: 'the same', hard: 'harder',
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

// What their answer means, shown when the save beat starts and left on screen
// afterwards. Words, not numbers, because a direction is what was asked.
//
// The dip line is the one that matters most. A parent who says it got harder
// has just told us something difficult about their own week, and the answer to
// that is never a frown or a score going down. It is a next move.
function verdictLine(answer: 'better' | 'same' | 'hard', lastAnswer?: string | null): string {
  if (answer === 'better') {
    return lastAnswer === 'better'
      ? 'Better again. Two in a row, so we can call this one sorted.'
      : 'Better than last time. That is the direction.'
  }
  if (answer === 'hard') {
    return 'Harder this time. A dip is information, not a verdict. DiGi has the next move whenever you want it.'
  }
  return 'About the same. Steady counts, and it stays on the list.'
}

// How long the note sits before the answer posts. Long enough to read the
// comparison, and tapping a different number starts it over.
const SAVE_BEAT_MS = 2600

export default function ConcernCheckIn({ concerns }: { concerns: ConcernCheckItem[] }) {
  // value: the number tapped, always a whole one now that there is no drag to
  // glide. touched: something has been picked, so the word and the comparison
  // show. pending: the save beat is running and can still be changed. saved:
  // posted and locked.
  const [value, setValue] = useState<Record<string, 'better' | 'same' | 'hard'>>({})
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
  const liveValue = useRef<Record<string, 'better' | 'same' | 'hard'>>({})

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
  // TO THE TOP OF THE NEXT ONE, NOT ITS MIDDLE (12 August 2026)
  //
  // Justin, with a photograph of the next question's title sliced off by the
  // status bar: "when I click a line it's good but it scrolls down and puts the
  // next one at the top where I can't see it. It just needs to go to the next
  // one."
  //
  // This was `block: 'center'`, and centring is the bug. A row is a title, a
  // history line, a question, ten targets and two labels, which on a phone is
  // taller than the screen it has to fit in. scrollIntoView centres the whole
  // element, so the taller the row the further its top is pushed above the
  // viewport, and the first thing to disappear is the one thing the parent
  // needs: which concern they are being asked about. Centring only ever looked
  // right on the desktop check where the rows fit.
  //
  // `start` aligns the top instead, so the title is always the first thing
  // there, and scroll-margin-top on the row keeps it clear of the notch on a
  // saved to home screen app and of the sticky nav on desktop.
  //
  // What has not changed: only ever to a row that is still unanswered, so a
  // parent working back up the list is never dragged forwards; nothing moves on
  // the last one, because yanking the page at the moment somebody finishes
  // reads as the app losing interest; and a jump rather than a glide for anyone
  // who has asked their system for less motion.
  const handOver = (fromSlug: string, done: Record<string, boolean>) => {
    const i = concerns.findIndex(c => c.slug === fromSlug)
    const next = concerns.slice(i + 1).find(c => !done[c.slug])
    const el = next ? rows.current[next.slug] : null
    if (!el) return
    const still = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' })
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

  // One tap picks the answer AND commits it. Three targets, each one a word a
  // parent can say out loud about their own week, and no aiming.
  const pick = (slug: string, answer: 'better' | 'same' | 'hard') => {
    if (posted.current[slug]) return
    liveValue.current[slug] = answer
    setValue(prev => ({ ...prev, [slug]: answer }))
    setTouched(prev => ({ ...prev, [slug]: true }))
    if (timers.current[slug]) clearTimeout(timers.current[slug])
    setPending(prev => ({ ...prev, [slug]: true }))
    timers.current[slug] = setTimeout(() => post(slug, { answer }), SAVE_BEAT_MS)
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
        One tap each, against how it was last time. That is the whole answer.
      </p>

      {concerns.map(c => {
        const isSaved = saved[c.slug]
        const isTouched = touched[c.slug]
        const isPending = pending[c.slug]
        return (
          <div
            key={c.slug}
            ref={el => { rows.current[c.slug] = el }}
            // The hand over aligns to the top of this row, so the margin is what
            // keeps the title clear of the notch on a saved to home screen app
            // and of the 64px sticky nav on desktop. 16px was enough when the
            // scroll centred and is not now.
            style={{ padding: '9px 0 15px', scrollMarginTop: 'calc(env(safe-area-inset-top, 0px) + 76px)' }}
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
              {/* What they said last time, which is the "previous rating" he
                  asked to keep. A word now rather than a number, because a word
                  is what they gave us. Falls back to the old number for a
                  family part way through the ten point scale. */}
              {recencyLabel(c)}
              {c.lastAnswer ? ` \u00b7 last time you said ${ANSWER_WORD[c.lastAnswer]}`
                : c.lastScore != null ? ` \u00b7 last time you said ${c.lastScore} out of 10` : ''}
            </div>

            {/* THREE ANSWERS ACROSS ONE ROW.
                A word each, big enough for a thumb without aiming, and the
                whole row is one line tall instead of the ten dots plus their
                two end labels. That is what makes every concern fit one screen,
                which in turn is what makes the hand over scroll a courtesy
                rather than the only way to reach the next question.

                The hint under each word does the job the 1 and 10 labels used
                to: it says what the answer is being measured against, which is
                last time rather than some absolute idea of a good week. */}
            <div
              role="radiogroup"
              aria-label={`${c.label}: better, the same, or harder than last time`}
              style={{ display: 'flex', gap: '8px' }}
            >
              {ANSWERS.map(a => {
                const chosen = isTouched && value[c.slug] === a.key
                return (
                  <button
                    key={a.key}
                    role="radio"
                    aria-checked={chosen}
                    aria-label={`${a.label}. ${a.hint}`}
                    disabled={!!isSaved}
                    onClick={() => pick(c.slug, a.key)}
                    style={{
                      flex: '1 1 0', minWidth: 0, padding: '12px 6px',
                      borderRadius: '16px', cursor: isSaved ? 'default' : 'pointer',
                      // Set is green, the same green the all checked tick uses,
                      // so a finished row and the summary agree on one colour.
                      background: chosen && (isPending || isSaved) ? 'var(--tint-green)'
                        : chosen ? 'var(--terracotta-lt)'
                        : '#fff',
                      border: chosen && (isPending || isSaved) ? '2.5px solid var(--retro-green)'
                        : chosen ? '2.5px solid var(--terracotta-dark)'
                        : '1.5px solid var(--border)',
                      boxShadow: chosen ? '0 3px 0 rgba(26,26,46,0.14)' : 'none',
                      opacity: isSaved && !chosen ? 0.45 : 1,
                      transition: 'background 0.14s, border-color 0.14s, opacity 0.14s',
                    }}
                  >
                    <span style={{
                      display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
                      fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.15,
                    }}>
                      {a.label}
                    </span>
                    <span aria-hidden style={{
                      display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                      fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                      color: 'var(--ink-muted)', marginTop: '3px', lineHeight: 1.2,
                    }}>
                      {a.hint}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* What it means, under the dots, so nothing above ever moves.
                It STAYS after saving: the before and after of every check in is
                left on screen rather than vanishing, which is the whole reason
                a parent can see the line climbing over weeks. */}
            {(isTouched || isSaved) && (
              <div aria-live="polite" style={{ textAlign: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: isSaved ? 'var(--ink)' : 'var(--ink-soft)', lineHeight: 1.45 }}>
                  {isTouched && value[c.slug]
                    ? `${verdictLine(value[c.slug], c.lastAnswer)}${isSaved ? ' Saved.' : isPending ? ' Saving.' : ''}`
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
          All checked. Small steps, kept up, are how this turns, and every answer moves the line on your progress page.
        </div>
      )}
    </div>
  )
}
