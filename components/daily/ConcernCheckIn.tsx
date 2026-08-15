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
  /** The concern's own row id, which is what the save posts. See CheckInRow. */
  id: string
  slug: string
  label: string
  timesFlagged: number
  lastFlaggedAt: string
  /** Their previous 1 to 10, from the event log. Null before the first one.
   *  Still read so a family part way through the old scale keeps its history. */
  lastScore: number | null
  /** Whose worry it is. Null for a family wide one, or a single child family. */
  childName?: string | null
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

function recencyLabel(item: ConcernCheckItem, baseline: boolean): string {
  // A baseline row was named in the wizard minutes ago, so every sentence
  // below is a small lie about it: it has not come up any times, it was not
  // flagged yesterday, and "0 days ago" is not something anybody says. What is
  // true is where it came from, and saying that is also the reassurance that
  // the app was listening during setup.
  if (baseline) return 'You told us about this when you joined'
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

export default function ConcernCheckIn({
  concerns,
  baseline = false,
}: {
  concerns: ConcernCheckItem[]
  /**
   * Their first ever check in, on the worries they named at signup.
   *
   * ONE COMPONENT, TWO JOBS, and no separate first run form: a second screen
   * would ask the same question in different words and be a second thing to
   * maintain. All that changes is the framing, because on day one there is no
   * last time to compare against and nothing has been "on the list" yet.
   */
  baseline?: boolean
}) {
  // value: the number tapped, always a whole one now that there is no drag to
  // glide. touched: something has been picked, so the word and the comparison
  // show. pending: the save beat is running and can still be changed. saved:
  // posted and locked.
  const [value, setValue] = useState<Record<string, number>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [pending, setPending] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  /** The save came back an error. The row is answerable again and says so. */
  const [failed, setFailed] = useState<Record<string, boolean>>({})
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
    // The row's own id travels with the answer. Slug alone stopped identifying
    // one concern when they went per child. See the note on CheckInRow.id.
    const concernId = concerns.find(c => c.slug === slug)?.id
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
    // ── THE SAVE THAT COULD FAIL AND STILL LOOK LIKE A SAVE ──────────────────
    //
    // Justin, 15 August 2026: the check in "loops and cant get out of it ...
    // once it is done genuinely done it should move onto next stage."
    //
    // THE ROW WENT GREEN BEFORE THE REQUEST WAS EVEN SENT, and nothing ever
    // looked at what came back. fetch does NOT reject on a 4xx or a 5xx, only
    // on a network failure, so a 404, a 400 or a 500 from the route all landed
    // in .then() and were treated as success. This exact pattern has now bitten
    // this codebase three times: NoPhoneButton on 13 August, the only-one-child
    // save, and here.
    //
    // Here it was the worst of the three, because of what sits downstream. The
    // rung on Today is done only when a SCORED concern_event exists for today,
    // which is the correct rule and the one Justin asked for. So a failed save
    // painted every row saved, refreshed, and left the rung undone, with no
    // error anywhere. Tap Go, answer them all, come back, still to do. For ever.
    // The live database is what proved it rather than the code: zero scored
    // rows all day while he was trying.
    //
    // The optimistic paint stays, because waiting on a round trip before a star
    // lights up is the wrong trade for something tapped five times in a row. It
    // is now a paint that can be TAKEN BACK.
    fetch('/api/daily/concern-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concernId, slug, ...body }),
    })
      .then(res => {
        if (!res.ok) throw new Error(String(res.status))
        // The Home path strip reads this same data server side. Refresh the
        // router cache the moment an answer lands, so tapping Home right
        // after does not show the check in step as still glowing and undone.
        router.refresh()
      })
      .catch(() => {
        // Give the row back so it can be answered again. Without releasing
        // posted.current the guard at the top of post() would refuse every
        // retry, which is the loop with an error message on it.
        posted.current[slug] = false
        setSaved(prev => ({ ...prev, [slug]: false }))
        setFailed(prev => ({ ...prev, [slug]: true }))
      })
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


  // ── THE STARS, AND WHY THEY REPLACED THE FIVE STACKED WORDS ────────────────
  //
  // Justin, 14 August 2026, after seeing the Duolingo Food and Shopping screen
  // on Mobbin: "i quite like the food and shopping example as we could use
  // yellow digi stars but needs to work with what wired in as results weekly
  // email and progress reports when we change."
  //
  // He had asked for an accordion first: titles only, tap to expand. The star
  // row is better and it is better by being the same idea taken one step
  // further. An accordion is two taps, open then answer, and it hides the one
  // thing worth seeing at a glance, which is where each worry stands. A row of
  // five stars is short enough that nothing needs collapsing at all, shows last
  // time and today in the same five positions, and takes ONE tap.
  //
  // NOTHING DOWNSTREAM CHANGES, which is the constraint he named. The five
  // stars ARE the five bands: star n posts BANDS[n-1].score, so the numbers
  // reaching concern_events are the same 2, 4, 6, 8 and 10 they have always
  // been. The weekly email, the What is working page, scoreWord and every
  // progress read carry on against identical data. Only the instrument changed.
  //
  // The words did not go away either. The band name sits under the row as soon
  // as a star is tapped, inside the comparison sentence, so a parent still
  // answers in language rather than in numbers. What went is having to read all
  // five before answering one.

  /** One star. Filled to today's answer, outlined for last time's. */
  function Star({ filled, ghost, size = 34 }: { filled: boolean; ghost: boolean; size?: number }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ display: 'block' }}>
        <path
          d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z"
          fill={filled ? 'var(--terracotta)' : ghost ? 'var(--stage-1)' : '#fff'}
          stroke={filled ? 'var(--terracotta-dark)' : ghost ? 'var(--alert)' : 'var(--border)'}
          // Solid, never dashed. A dashed outline traced around a star's ten
          // points does not read as a marker, it reads as a star that has
          // shattered, which is the single worst thing to draw next to "how has
          // this week been". A clean heavier ring says last time just as well.
          strokeWidth={ghost && !filled ? 2.4 : 1.6}
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  // Group by child when there is more than one, so a parent always knows whose
  // week they are rating. concerns.child_id has been set on every row since the
  // table was made and nothing had ever read it, so until today a two child
  // family rated "Sibling fighting" and "Gaming concerns" in one flat list with
  // no idea which child each number was landing against.
  const childNames = [...new Set(concerns.map(c => c.childName).filter(Boolean))] as string[]
  const grouped = childNames.length > 1

  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid var(--border)',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '16px',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
        letterSpacing: '.12em', textTransform: 'uppercase',
        color: 'var(--stage-2-text)', marginBottom: '8px',
      }}>
        {baseline ? 'Where things are now' : 'Still on the list'}
      </div>

      {/* WHY THIS IS WORTH THIRTY SECONDS.
          Justin: "a quick note on why check in is important, eg we review each
          week to improve, lets us check which is working and if solutions works
          or we need another approach."
          It goes at the top because the reason has to arrive before the ask,
          not after it. A parent who knows the numbers come back to them as a
          judgement on the ADVICE rather than on their parenting answers
          honestly, and honest numbers are the only ones worth having. */}
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 6px' }}>
        {baseline
          ? 'One tap each. This is your starting point, so there is no right answer and nothing to work up to. Everything from here is measured against it.'
          : 'One tap each. More stars is a better week.'}
      </p>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '0 0 18px' }}>
        We read these every week. It is how we tell which of the things we have
        suggested is actually working for you, and when something is not moving,
        it is what tells us to try a different approach rather than more of the
        same.
      </p>

      {concerns.map((c, idx) => {
        const isSaved = saved[c.slug]
        const isTouched = touched[c.slug]
        const isPending = pending[c.slug]
        const chosenBand = isTouched ? bandOf(value[c.slug]) : 0
        const lastBand = c.lastScore != null ? bandOf(c.lastScore) : 0
        const newChild = grouped && c.childName && c.childName !== concerns[idx - 1]?.childName
        return (
          <div key={c.slug}>
            {newChild && (
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
                margin: idx === 0 ? '0 0 6px' : '14px 0 6px',
              }}>
                {c.childName}
              </div>
            )}
            <div
              ref={el => { rows.current[c.slug] = el }}
              style={{
                padding: '12px 0',
                borderTop: idx === 0 || newChild ? 'none' : '1px solid var(--border)',
                scrollMarginTop: 'calc(env(safe-area-inset-top, 0px) + 76px)',
                opacity: isSaved ? 0.82 : 1,
                transition: 'opacity .18s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 800,
                  color: 'var(--ink)', lineHeight: 1.25,
                }}>
                  {c.label}
                  {!grouped && c.childName && (
                    <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-muted)', fontSize: 'var(--text-base)' }}>
                      {' '}· {c.childName}
                    </span>
                  )}
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

              {/* FIVE STARS, ONE TAP. Each one is a 44px target with its own
                  label, so it is a proper radio group for a screen reader and a
                  proper thumb target for everyone else. Last time keeps the red
                  it always had, now as a dashed outline on its own star, which
                  is the same spatial comparison the ring used to make. */}
              <div
                role="radiogroup"
                aria-label={`${c.label}${c.childName ? `, ${c.childName}` : ''}: how has this week been, one star worst to five stars best`}
                style={{ display: 'flex', gap: '2px', marginTop: '6px', marginLeft: '-6px' }}
              >
                {BANDS.map((b, i) => {
                  const n = i + 1
                  const filled = chosenBand >= n
                  const ghost = lastBand === n
                  return (
                    <button
                      key={b.score}
                      role="radio"
                      aria-checked={chosenBand === n}
                      aria-label={ghost ? `${b.label}, what you said last time` : b.label}
                      disabled={!!isSaved}
                      onClick={() => pick(c.slug, b.score)}
                      style={{
                        background: 'none', border: 'none', padding: '5px 6px',
                        cursor: isSaved ? 'default' : 'pointer', lineHeight: 0,
                        minWidth: 44, minHeight: 44,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Star filled={filled} ghost={ghost} />
                    </button>
                  )
                })}
              </div>

              {/* The words did not go anywhere: the band name arrives inside the
                  comparison the moment a star is tapped, so the answer is still
                  in language rather than in a count of stars. */}
              {(isTouched || isSaved) && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: isSaved ? 'var(--ink)' : 'var(--ink-soft)', lineHeight: 1.45 }}>
                    {`${verdictLine(value[c.slug], c.lastScore)}${isSaved ? ' Saved.' : failed[c.slug] ? ' That did not save, tap a star to try again.' : isPending ? ' Saving.' : ''}`}
                  </span>
                </div>
              )}

              {/* FIVE STARS MEANS WE STOP ASKING, AND WE SAY SO.
                  Justin: "we could pop up message when they rate as top doing
                  great it says we will drop this off checkin but if it comes
                  back then mark as moment."
                  The rule itself lives in lib/checkin/today.ts. This is the
                  half a parent has to be told, because a row silently vanishing
                  from next week's list is indistinguishable from the app losing
                  it, and a parent who thinks we lost it stops trusting the
                  numbers. Saying it at the moment they earn it also makes the
                  top star mean something: it is the only answer that shortens
                  next week's list. */}
              {chosenBand === 5 && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '9px',
                  background: 'var(--tint-green)', borderRadius: '13px',
                  padding: '11px 13px', marginTop: '8px',
                }}>
                  <span aria-hidden style={{ fontSize: 'var(--text-md)', lineHeight: 1.2, flexShrink: 0 }}>🎉</span>
                  <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                    That is sorted, so we will drop it off your check in. If it comes back, log it as a moment and it returns here on its own.
                  </span>
                </div>
              )}

              {/* Before anything is tapped, last time is said in prose as well
                  as spatially, because the dashed star alone does not tell a
                  parent what that star MEANT. */}
              {!isTouched && !isSaved && (
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600,
                  color: 'var(--ink-muted)', marginTop: '4px',
                }}>
                  {recencyLabel(c, baseline)}
                  {c.lastScore != null ? ` · last time ${scoreWord(c.lastScore).toLowerCase()}` : ''}
                </div>
              )}
            </div>
          </div>
        )
      })}

      {allSaved && (
        <div style={{
          marginTop: '10px', paddingTop: '14px', borderTop: '1px solid var(--border)',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
          color: 'var(--retro-green)',
        }}>
          All checked in ✓ We will read these into next week.
        </div>
      )}
    </div>
  )
}
