'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// A running check in, not a one day question: this card asks about whatever
// is still open, however many days it has been coming up, and keeps asking
// until the family says it is better twice in a row.
//
// ── FIVE WORDS, NOT TEN NUMBERS (12 August 2026) ─────────────────────────────
//
// Justin: "is there an easier but just as accurate way to check in? 1 to 10 is
// confusing. I know we need to see previous rating and we record movement, but
// this needs to be quick and easy to go through."
//
// He is right, and the research agrees. Rating scale reliability climbs steeply
// from two points to about five and then flattens; ten buys effort rather than
// accuracy, and a single item ten point self report drifts about a point on its
// own with nothing having changed, so a good share of the movement a chart like
// this celebrates is noise. Every clinical instrument that gets repeated week
// after week uses four or five. Nobody serious uses ten.
//
// And this app was already a five point scale wearing a ten point coat.
// scoreWord below has always collapsed the range into exactly five bands, so a
// 7 and an 8 both read "Getting there" everywhere in the product, and the only
// place the extra grain did anything was the direction check, which is exactly
// where it turned a wobble into "the line is climbing".
//
// So the five bands become the answer, in their own words. THE SCALE UNDERNEATH
// DOES NOT CHANGE: each word posts the top of its band (2, 4, 6, 8, 10), the
// column stays 1 to 10, and the progress chart, the pathway history and DiGi's
// wisdom bank all read exactly what they read before. A family part way through
// the old scale keeps every number they ever gave, and their last one still
// lights up whichever word it belonged to.
//
// The server compares BANDS rather than raw numbers now, so a legacy 7 followed
// by "Getting there" reads as holding rather than as progress. See
// app/api/daily/concern-check/route.ts.
//
// What survives, because none of it was the problem: the save beat, so the
// verdict can be read and the answer changed; the row LOCKING AND STAYING
// afterwards, so the before and after of every check in is left on screen; the
// green that means set; the red ring on last time; and the hand over to the
// next one.

export type ConcernCheckItem = {
  slug: string
  label: string
  timesFlagged: number
  lastFlaggedAt: string
  /** Their previous 1 to 10, from the event log. Null before the first one.
   *  Still read so a family part way through the old scale keeps its history. */
  lastScore: number | null
}

/** The five bands, worst to best, which is the direction the scale has always
 *  run: a family's line climbs as their weeks improve.
 *
 *  `score` is the TOP of each band, so scoreWord(score) returns the same word
 *  back. That is what keeps a five word question and a 1 to 10 column honest
 *  with each other, and it means "Going great" posts a 10, which is still the
 *  9 or above that tips a concern towards resolved. */
export const BANDS = [
  { score: 2, label: 'Really tough' },
  { score: 4, label: 'Hard going' },
  { score: 6, label: 'Up and down' },
  { score: 8, label: 'Getting there' },
  { score: 10, label: 'Going great' },
] as const

/** Which of the five a number belongs to. 1 to 5, matching BANDS by index+1.
 *  Reads a legacy 1 to 10 score just as happily as a new one, which is how last
 *  time's ring still lands on the right word for a family who has been checking
 *  in since before this changed. */
export function bandOf(n: number): number {
  return Math.ceil(Math.min(10, Math.max(1, n)) / 2)
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

// What their answer means against their last one, shown when the save beat
// starts and left on screen afterwards. Words, because words are what was
// asked, and the number is nobody's business but the chart's.
//
// The dip line is the one that matters most. A parent who says this week was
// harder has just told us something difficult about their own week, and the
// answer to that is never a frown or a lower score. It is a next move.
function verdictLine(score: number, last: number | null): string {
  const word = scoreWord(score)
  if (last == null) {
    return score >= 9
      ? `First one down, and already going great. One more like this and we mark it done.`
      : `First one down: ${word.toLowerCase()}. Your next check in reads against this one.`
  }
  const lastWord = scoreWord(last)
  if (bandOf(score) > bandOf(last)) {
    return `${word} today, ${lastWord.toLowerCase()} last time. The line is climbing.`
  }
  if (bandOf(score) < bandOf(last)) {
    return `${word} today, ${lastWord.toLowerCase()} last time. A dip is information, not a verdict. DiGi has the next move whenever you want it.`
  }
  return `Holding at ${word.toLowerCase()}, same as last check in. Steady counts.`
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

  // One tap picks the band AND commits it. Five words, each one a thing a
  // parent would actually say about their own week, and no aiming.
  const pick = (slug: string, score: number) => {
    if (posted.current[slug]) return
    liveValue.current[slug] = score
    setValue(prev => ({ ...prev, [slug]: score }))
    setTouched(prev => ({ ...prev, [slug]: true }))
    if (timers.current[slug]) clearTimeout(timers.current[slug])
    setPending(prev => ({ ...prev, [slug]: true }))
    timers.current[slug] = setTimeout(() => post(slug, { score }), SAVE_BEAT_MS)
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
        One tap each, in your own words. The red ring is where it was last time.
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
              {/* What they said last time, which is the previous rating Justin
                  asked to keep. Shown as the WORD rather than the number, even
                  for a legacy 1 to 10 score, because the word is what the five
                  buttons below are offering and a parent should not have to
                  translate between the two. The ring on the button says the same
                  thing spatially; this says it in prose. */}
              {recencyLabel(c)}
              {c.lastScore != null ? ` \u00b7 last time you said ${scoreWord(c.lastScore).toLowerCase()}` : ''}
            </div>

            {/* FIVE WORDS, STACKED, AND THE ONE YOU PICK BECOMES A BUTTON.
                Justin: "is there a tidy way with the yellow we use on buttons,
                make it a bit slicker?"

                Yes, and it is more than tidier. The butter gold with the solid
                shadow under it is what every real action in this product looks
                like, so a chosen answer that wears it reads as a thing you did
                rather than a thing that got highlighted. The unchosen four stay
                quiet and white, which is what makes the chosen one carry.

                Stacked rather than side by side because five words do not fit
                across 390 without truncating the longest of them, and a
                truncated answer is a worse answer. It is also the shape Visible
                and Superpower use for exactly this job: many things to rate,
                rated often, in one pass.

                LAST TIME KEEPS ITS RED RING, on whichever word it belonged to,
                so the comparison is spatial before anybody reads a sentence.
                bandOf() reads a legacy 1 to 10 score just as well as a new one,
                so a family who has been checking in for weeks sees their ring
                land where it should on the day this changes. */}
            <div
              role="radiogroup"
              aria-label={`${c.label}: how is it now, really tough to going great`}
              style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}
            >
              {BANDS.map(b => {
                const chosen = isTouched && value[c.slug] === b.score
                const wasLast = c.lastScore != null && bandOf(c.lastScore) === bandOf(b.score)
                const rung = bandOf(b.score)
                return (
                  <button
                    key={b.score}
                    role="radio"
                    aria-checked={chosen}
                    aria-label={wasLast ? `${b.label}, what you said last time` : b.label}
                    disabled={!!isSaved}
                    onClick={() => pick(c.slug, b.score)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      width: '100%', padding: '12px 14px', textAlign: 'left',
                      borderRadius: '16px', cursor: isSaved ? 'default' : 'pointer',
                      // The house button, exactly: butter gold, a solid shadow
                      // rather than a blur, and it presses down when it lands.
                      background: chosen ? 'var(--terracotta)' : '#fff',
                      border: chosen ? '1.5px solid var(--terracotta-dark)'
                        // Last time, held the whole time, before and after
                        // today's answer arrives.
                        : wasLast ? '2px dotted var(--alert)'
                        : '1.5px solid var(--border)',
                      // Raised while the save beat runs, because it can still be
                      // changed, then it PRESSES DOWN at the moment it commits.
                      // That press is what saved looks like now. It used to turn
                      // green, which said saved by throwing away the brand
                      // colour at the one moment the row matters.
                      boxShadow: chosen && !isSaved ? '0 4px 0 var(--terracotta-dark)'
                        : chosen ? '0 1px 0 var(--terracotta-dark)'
                        : 'none',
                      transform: chosen && isSaved ? 'translateY(3px)' : 'none',
                      opacity: isSaved && !chosen ? 0.4 : 1,
                      transition: 'background .14s, border-color .14s, box-shadow .14s, transform .14s, opacity .14s',
                    }}
                  >
                    {/* The rung. It GROWS down the five, so they read as a scale
                        going somewhere rather than as five unrelated options,
                        and a parent can see which end they are at without
                        reading a word. Length rather than shade, because five
                        tints of one colour is a difference nobody notices on a
                        phone in a kitchen.

                        The track behind it keeps every word on the same left
                        edge, so the five read as a column rather than a
                        staircase. */}
                    <span aria-hidden style={{
                      flexShrink: 0, width: '36px', height: '10px',
                      display: 'flex', alignItems: 'center',
                    }}>
                      <span style={{
                        width: `${6 + rung * 6}px`, height: '10px', borderRadius: '5px',
                        background: chosen ? 'var(--ink)'
                          : wasLast ? 'var(--alert)'
                          : 'var(--terracotta)',
                        opacity: chosen || wasLast ? 1 : 0.55,
                        transition: 'background .14s, opacity .14s',
                      }} />
                    </span>
                    <span style={{
                      flex: 1, fontFamily: 'var(--font-display)', fontWeight: 800,
                      fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.2,
                    }}>
                      {b.label}
                    </span>
                    {/* Saved still says saved, in the green the all checked line
                        uses, but as a tick on the row rather than by repainting
                        it. The answer keeps the colour of the thing you chose. */}
                    {chosen && isSaved && (
                      <span aria-hidden style={{
                        flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%',
                        background: 'var(--retro-green)', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 900,
                      }}>✓</span>
                    )}
                    {wasLast && !chosen && (
                      <span style={{
                        flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                        fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                        color: 'var(--alert)',
                      }}>
                        Last time
                      </span>
                    )}
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
                    ? `${verdictLine(value[c.slug], c.lastScore)}${isSaved ? ' Saved.' : isPending ? ' Saving.' : ''}`
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
