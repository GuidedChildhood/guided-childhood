'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { categoryForConcern } from '@/lib/content/signal-map'
import { bandOf } from '@/lib/concerns/bands'
import { SILVER_RUN, TOP_BAND } from '@/lib/concerns/resting'
import { checkinOutcome, type CheckinOutcome } from '@/lib/concerns/outcome'

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
// answer can be changed before it lands; the hand over to the next one; and
// a saved row folding to one line that KEEPS its verdict (1 September 2026,
// "pops up a result to show it's moved").
//
// ── FACES, ONE OUTCOME, A READ BEAT (7 October 2026) ─────────────────────────
//
// Justin, from the weekly UX walkthrough: "Stars rating needs to be made
// super easy and quick to do and obvious to do ... Happy face icons, easy
// messaging, flows super easy, as it is an important loop. Tell the user
// exactly what happens." Three moves, each with its own note below: the
// stars became faces (see Face), everything the card says after a tap comes
// from lib/concerns/outcome.ts (see the row), and the save lands in about a
// second while the result stays open long enough to read before the row
// folds (see SAVE_BEAT_MS and READ_BEAT_MS).

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
  /** Where it came from: 'digi', 'moment', 'rightnow', 'checkin', 'onboarding'. */
  source?: string | null
  /** First time this one has reached the check in, and not a seeded starter. */
  isNew?: boolean
  /** A DiGi suggestion for THIS worry that is still waiting on an answer. It
   *  is asked above the stars, never on a card days later. See lib/checkin. */
  followUp?: { outcomeId: string; suggestion: string } | null
  /** How many top band scores sit on the end of its run, before today. Read by
   *  lib/concerns/scores so the card counts the way the resting rule counts.
   *  Absent on the fixture, where last time's score stands in for it. */
  topRun?: number
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

// Which of the five a number belongs to is bandOf in lib/concerns/bands.ts,
// shared with the monthly review and DiGi so the three can never disagree.

/** A small run of good days, said as a word. Two in a row rests a worry. */
function runWord(n: number): string {
  return ['', 'one', 'two', 'three', 'four', 'five'][n] ?? String(n)
}

// WHERE A NEW WORRY CAME FROM, SAID BACK.
//
// Justin, 14 August 2026: "any issue raised in digi we can add to check in."
// It was added. It just arrived anonymous, so the row a parent had actually
// asked DiGi about on Tuesday looked the same on Wednesday as the four the app
// had guessed at, and the one thing that would have told them the app was
// listening, that it came from their own conversation, was the thing left out.
//
// Null for anything that is not new: an old worry says how many times it has
// come up instead, which is the more useful sentence by then.
function newSourceLine(item: ConcernCheckItem): string | null {
  if (!item.isNew) return null
  const days = Math.floor((Date.now() - new Date(item.lastFlaggedAt).getTime()) / 86400000)
  const when = days <= 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`
  switch (item.source) {
    case 'digi': return `New. You raised this with DiGi ${when}.`
    case 'moment': return `New. From a moment you logged ${when}.`
    case 'rightnow': return `New. You asked about this ${when}.`
    // ── NO DATE ON A ROW THAT HAS NO EVENT BEHIND IT (11 September 2026) ────
    //
    // Justin, looking at his own first check in: "it says added yesterday,
    // thats not true, it needs to say these were the issues we added when
    // setting up."
    //
    // He is right twice over. The three cases above name a thing the parent
    // DID on a day: a DiGi conversation, a moment logged, a Right now ask, and
    // the date is honest because there is an event behind it. This branch had
    // no event, so it read the row's own stamp instead, and a setup row is
    // deliberately stamped a day back so the check in's review filter cannot
    // eat it on the morning a family joins. So "yesterday" was never a day
    // anything happened, it was a filter workaround being read as a fact.
    //
    // Null hands the row to recencyLabel below, which already had the true
    // sentence and could never be reached.
    default: return null
  }
}

function recencyLabel(item: ConcernCheckItem, baseline: boolean): string {
  // A baseline row was named in the wizard minutes ago, so every sentence
  // below is a small lie about it: it has not come up any times, it was not
  // flagged yesterday, and "0 days ago" is not something anybody says. What is
  // true is where it came from, and saying that is also the reassurance that
  // the app was listening during setup.
  if (baseline) return 'Added when you set up'
  // ── A STARTING ROW NEVER SAYS "YOU FLAGGED" (19 August 2026) ──────────────
  //
  // Justin, first check in with a newly added child: "it says you flagged this
  // yesterday, but this is the first time I logged in with Jody."
  //
  // He never flagged anything. Her four worries are the seeded starting set,
  // stamped a day back so the review filter cannot eat them, and this line was
  // reading that stamp as a thing the parent DID. The page level baseline flag
  // above cannot catch it, because it only covers the family's literal first
  // check in, and Jody arrived in month two of somebody else's history.
  //
  // The honest per row signal needs no flag at all: a worry that has never
  // been rated and never re raised is the starting set, whichever day it was
  // born. The moment the parent rates it once, or raises it again, the row has
  // a real history and the dated wording becomes true.
  if (item.lastScore == null && item.timesFlagged <= 1) return 'Added when you set up'
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

// The sentence under the faces, what happens next and the help buttons all
// come from ONE pure function, lib/concerns/outcome.ts, since 7 October 2026.
// This file used to hold a verdict line, a green box for five, a quiet line
// for four and another for one to three, and two of them appeared together.
// Nothing here decides what a tap means any more. It only draws it.

// Which way today's answer moved against last time, for the folded row's
// verdict chip. 'first' covers both the baseline and any worry's first score.
function movementOf(score: number | undefined, last: number | null): 'up' | 'dip' | 'held' | 'first' | 'skipped' {
  if (score == null) return 'skipped'
  if (last == null) return 'first'
  const a = bandOf(score)
  const b = bandOf(last)
  return a > b ? 'up' : a < b ? 'dip' : 'held'
}

// How long after the tap the answer posts. About a second, which is enough
// to see the face light up and tap a different one, and short enough that
// nothing feels held (Justin, 7 October 2026: "super easy and quick"). It was
// 2.6 seconds of "Saving." with the parent waiting on it.
const SAVE_BEAT_MS = 1000

// How long the result stays open AFTER it saves, before the row folds and the
// next worry slides up. The fold used to land on the same tick as the save,
// so the only thing a parent got to read was the slim folded line; now the
// line and what happens next sit there long enough to be read.
const READ_BEAT_MS = 1800

// ── WHY "CHANGE" ONLY WORKS BEFORE THE SAVE LANDS ────────────────────────────
//
// The brief asked for a Change link instead of making the parent wait, and it
// is here, live for the whole save beat and gone once the answer has posted.
// It does not re open a saved row, deliberately. A second post for the same
// worry on the same day is compared against the first one by the route, so
// "getting there" corrected to "going great" reads as two betters in a row
// and the server marks the concern RESOLVED, and lib/checkin/today.ts never
// asks about a resolved concern again. A worry disappearing because a parent
// corrected a tap is a worse failure than a wrong reading that tomorrow's
// check in puts right, so the record stands once it lands.

// INK ON WHITE, NOT GOLD ON WHITE.
//
// These read as --terracotta-dark on #fff, which is 2.6 to 1. The AA floor
// for text this size is 4.5. It was legible enough to nobody's complaint
// while dips were rare; a low score now brings them to a row every family
// will meet, so the same pairing that was wrong on the house gold buttons is
// wrong here. The gold stays as the edge, which is decoration and has no
// floor to clear.
const pill: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', minHeight: 38,
  padding: '7px 14px', borderRadius: 'var(--radius-pill)', textDecoration: 'none',
  border: '2px solid var(--terracotta)', color: 'var(--ink)',
  boxShadow: '0 3px 0 var(--terracotta)',
  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
  background: '#fff',
}

export default function ConcernCheckIn({
  concerns,
  baseline = false,
  childName = null,
  childId = null,
  nextChild = null,
  lastNight = null,
}: {
  concerns: ConcernCheckItem[]
  /** The words opened in the last day and a half with no rating yet. One tap here rates them. */
  lastNight?: { sortOrder: number; title: string } | null
  /** Whose list this is, so finishing it can say their name. */
  childName?: string | null
  /** Their id, so a dip's Ask DiGi button lands on the right child's chat. */
  childId?: string | null
  /** Who is still waiting, if anybody. See the hand off at the foot. */
  nextChild?: { id: string; name: string | null } | null
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
  /** Saved, read, and folded to its slim line. Lags saved by the read beat. */
  const [folded, setFolded] = useState<Record<string, boolean>>({})
  const router = useRouter()
  // Did you use last night's words: idle, saving, or the answer given.
  const [words, setWords] = useState<'idle' | 'busy' | 'yes' | 'somewhat' | 'no'>('idle')
  async function rateWords(worked: 'yes' | 'somewhat' | 'no') {
    if (!lastNight || words === 'busy') return
    setWords('busy')
    try {
      await fetch('/api/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: lastNight.sortOrder, worked, child_id: childId }),
      })
      setWords(worked)
    } catch { setWords('idle') }
  }

  // ── "DID YOU GET TO TRY IT?", ON THE WORRY IT IS ABOUT ────────────────────
  //
  // Justin approved the move on 21 September 2026 after seeing the same
  // question answered 15 times out of 40 inside this screen and 0 times out of
  // 6 on its own card. Same parents, same three taps, and the only difference
  // is that here the worry is already in their head.
  //
  // Nothing is required. An untouched row saves its stars exactly as before,
  // and the band comparison that actually measures the worry runs either way,
  // so the learning no longer depends on the answer at all. It is now the
  // cheaper half of the reading rather than the whole of it.
  const [tried, setTried] = useState<Record<string, 'busy' | 'worked' | 'partly' | 'no'>>({})
  async function rateTried(concernId: string, outcomeId: string, verdict: 'worked' | 'partly' | 'no') {
    if (tried[concernId]) return
    setTried(t => ({ ...t, [concernId]: 'busy' }))
    try {
      const res = await fetch('/api/digi/outcome', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcomeId, verdict }),
      })
      if (!res.ok) throw new Error('save failed')
      setTried(t => ({ ...t, [concernId]: verdict }))
    } catch {
      // Back to askable. A question that silently ate the tap is worse than
      // one that is still there.
      setTried(t => { const next = { ...t }; delete next[concernId]; return next })
    }
  }

  const posted = useRef<Record<string, boolean>>({})
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const foldTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  // Each row's element, so a finished one can hand over to the next.
  const rows = useRef<Record<string, HTMLDivElement | null>>({})
  // The number as of the last tap, outside React's batching, so the timer that
  // fires two and a half seconds later posts what the parent actually chose
  // rather than what the closure captured.
  const liveValue = useRef<Record<string, number>>({})

  if (concerns.length === 0) return null

  const allSaved = concerns.every(c => saved[c.id])
  const savedCount = concerns.filter(c => saved[c.id]).length
  // The one question whose turn it is: the first unanswered row. Everything
  // else waits at reduced strength, which is what makes a visible list read
  // as one question at a time without hiding anything (1 September 2026).
  const activeId = concerns.find(c => !saved[c.id])?.id

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
  const handOver = (fromId: string, done: Record<string, boolean>) => {
    const i = concerns.findIndex(c => c.id === fromId)
    const next = concerns.slice(i + 1).find(c => !done[c.id])
    const el = next ? rows.current[next.id] : null
    if (!el) return
    const still = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' })
  }

  // ── KEYED BY THE CONCERN'S OWN ID, NEVER BY SLUG ──────────────────────────
  //
  // Justin, 18 August 2026: "it is saying Olgie is done even though it is not,
  // so it is getting it from Teo's. This needs separate database lines so only
  // one updates when done."
  //
  // The database lines ARE separate: concerns went per child with migration
  // 194 and every row has its own id. It was this component that collapsed
  // them. Every piece of its state, saved, touched, pending, failed, value, the
  // posted guard and the scroll refs, was keyed by SLUG, and seedChildBaseline
  // gives every child the SAME four worries. So Teo and Olgie both hold a row
  // with slug 'bedtime-screens', and rating Teo's marked Olgie's saved on the
  // spot, greyed it out and moved past it.
  //
  // Worse, the lookup below was concerns.find(c => c.slug === slug), which
  // returns the FIRST match. So Olgie's rating, if it had got that far, would
  // have been posted against TEO's concern id. The wrong child's record, from
  // the right child's question.
  //
  // Nothing here needed a new table or a migration. It needed to stop throwing
  // away the id it was already being given.
  const post = (id: string, body: Record<string, unknown>) => {
    // The row's own id travels with the answer. Slug alone stopped identifying
    // one concern when they went per child. See the note on CheckInRow.id.
    const concern = concerns.find(c => c.id === id)
    const concernId = concern?.id
    if (posted.current[id]) return
    posted.current[id] = true
    if (timers.current[id]) clearTimeout(timers.current[id])
    setPending(prev => ({ ...prev, [id]: false }))
    setSaved(prev => ({ ...prev, [id]: true }))
    // The row stays open for a read beat with its line and what happens next,
    // and only then folds and hands over. A skipped row has nothing to read,
    // so it folds at once. The hand over reads posted.current rather than the
    // saved state, because a row that failed and was released is unanswered
    // again and the scroll must be able to land back on it.
    if (foldTimers.current[id]) clearTimeout(foldTimers.current[id])
    foldTimers.current[id] = setTimeout(() => {
      setFolded(prev => ({ ...prev, [id]: true }))
      // After paint, so the row being left has already settled into its
      // folded state and the scroll lands on a card that has stopped changing.
      requestAnimationFrame(() => handOver(id, posted.current))
    }, body.score == null ? 0 : READ_BEAT_MS)
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
      // slug rides along for the route's legacy guard. Dropping it in the
      // re key is what turned every save into a 400 on 19 August.
      body: JSON.stringify({ concernId, slug: concern?.slug, id, ...body }),
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
        posted.current[id] = false
        if (foldTimers.current[id]) clearTimeout(foldTimers.current[id])
        setFolded(prev => ({ ...prev, [id]: false }))
        setSaved(prev => ({ ...prev, [id]: false }))
        setFailed(prev => ({ ...prev, [id]: true }))
      })
  }

  // One tap picks the band AND commits it. Five words, each one a thing a
  // parent would actually say about their own week, and no aiming.
  const pick = (id: string, score: number) => {
    if (posted.current[id]) return
    liveValue.current[id] = score
    setValue(prev => ({ ...prev, [id]: score }))
    setTouched(prev => ({ ...prev, [id]: true }))
    setFailed(prev => ({ ...prev, [id]: false }))
    if (timers.current[id]) clearTimeout(timers.current[id])
    setPending(prev => ({ ...prev, [id]: true }))
    timers.current[id] = setTimeout(() => post(id, { score }), SAVE_BEAT_MS)
  }

  // Change, while the save beat is still running: the tap is taken back and
  // the faces are open again with nothing chosen. Nothing has posted, so
  // there is nothing to undo on the server. See the note above SAVE_BEAT_MS
  // for why this stops once the answer has landed.
  const change = (id: string) => {
    if (posted.current[id]) return
    if (timers.current[id]) clearTimeout(timers.current[id])
    delete liveValue.current[id]
    setPending(prev => ({ ...prev, [id]: false }))
    setTouched(prev => ({ ...prev, [id]: false }))
    setValue(prev => { const next = { ...prev }; delete next[id]; return next })
  }


  // ── FACES, NOT STARS (7 October 2026) ─────────────────────────────────────
  //
  // Justin: "Happy face icons, easy messaging, flows super easy, as it is an
  // important loop."
  //
  // The five stars that replaced the five stacked words on 14 August did one
  // thing wrong that only showed once the child's side was built: gold stars
  // are the CHILD'S currency. Jobs earn stars, stars become minutes, and the
  // passport stamps on a worry going to five stars. A feeling rating that
  // looks like earning confuses both of them: the parent reads "five stars"
  // as a reward to award rather than a thing to notice, and the child reads
  // the parent's check in as their own bank. So the instrument is five faces,
  // drawn the way the child's app draws everything, a real ink outline and a
  // confident fill, with the band word under each so a parent still answers
  // in language. The mouth is the scale: a deep frown, a frown, a straight
  // line, a smile, an open grin with happy eyes.
  //
  // NOTHING DOWNSTREAM CHANGES, which is the constraint from 14 August and
  // again from 7 October. The five faces ARE the five bands: face n posts
  // BANDS[n-1].score, so the numbers reaching concern_events are the same
  // 2, 4, 6, 8 and 10. The weekly email, the monthly review, the What is
  // working page and DiGi's wisdom bank carry on against identical data.
  //
  // One face is chosen, not a cumulative fill. Stars filled up to a count;
  // a face is a single answer, and the four unchosen faces staying pale is
  // what makes the chosen one read from across the list. Last time is the
  // GREY face on the band it was (the 18 August rule, same shape as the grey
  // stars), and only that face carries the "what you said last time" label.
  function Face({ band, filled, past, size = 40 }: { band: number; filled: boolean; past: boolean; size?: number }) {
    const fill = filled ? 'var(--terracotta)' : past ? '#DCD7CB' : '#FBF9F4'
    const op = filled ? 1 : past ? 0.55 : 0.32
    const mouth = [
      'M13 28.5 Q20 21.5 27 28.5',
      'M13.5 27.5 Q20 23.5 26.5 27.5',
      'M13.5 26.5 L26.5 26.5',
      'M13.5 24 Q20 30.5 26.5 24',
      'M12.5 23 Q20 34 27.5 23 Z',
    ][Math.min(5, Math.max(1, band)) - 1]
    const grin = band === 5
    return (
      <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden style={{ display: 'block' }}>
        <circle cx="20" cy="20" r="17.5" fill={fill} stroke="var(--ink)" strokeOpacity={op} strokeWidth={filled ? 2.2 : 1.8} />
        {grin ? (
          <>
            <path d="M11 16.5 Q14 12.5 17 16.5" fill="none" stroke="var(--ink)" strokeOpacity={op} strokeWidth="2.1" strokeLinecap="round" />
            <path d="M23 16.5 Q26 12.5 29 16.5" fill="none" stroke="var(--ink)" strokeOpacity={op} strokeWidth="2.1" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="14" cy="16.5" r="2.1" fill="var(--ink)" fillOpacity={op} />
            <circle cx="26" cy="16.5" r="2.1" fill="var(--ink)" fillOpacity={op} />
          </>
        )}
        {band === 1 && (
          <>
            <path d="M10.5 11.5 L16 13.5" stroke="var(--ink)" strokeOpacity={op} strokeWidth="2" strokeLinecap="round" />
            <path d="M29.5 11.5 L24 13.5" stroke="var(--ink)" strokeOpacity={op} strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        <path d={mouth} fill={grin ? 'var(--ink)' : 'none'} fillOpacity={op} stroke="var(--ink)" strokeOpacity={op} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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
      border: 'var(--edge)',
      // The house finish, which this card was the last thing on the daily page
      // not wearing: a chunky ink shadow rather than a flat outline.
      boxShadow: 'var(--lift-deep)',
      borderRadius: 'var(--radius-card)',
      padding: '20px',
      marginBottom: '20px',
    }}>
      {lastNight && words !== 'yes' && words !== 'somewhat' && words !== 'no' && (
        <div style={{
          background: 'var(--terracotta-lt)', border: 'var(--edge)', borderRadius: 'var(--radius-btn)',
          padding: '14px 14px 12px', marginBottom: 16,
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 4px' }}>
            Last night's words
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 10px', lineHeight: 1.3 }}>
            {lastNight.title}. Did you use them?
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {([['yes', 'Yes'], ['somewhat', 'Sort of'], ['no', 'Not yet']] as const).map(([k, label]) => (
              <button
                key={k}
                onClick={() => rateWords(k)}
                disabled={words === 'busy'}
                style={{
                  flex: 1, minWidth: 80, padding: '10px 12px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
                  background: '#fff', border: 'var(--edge)', boxShadow: 'var(--lift)',
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)', color: 'var(--ink)',
                  opacity: words === 'busy' ? 0.6 : 1,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      {lastNight && (words === 'yes' || words === 'somewhat' || words === 'no') && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ink-muted)', margin: '0 0 12px' }}>
          {words === 'yes' ? 'Noted. That is the loop closing.' : words === 'somewhat' ? 'Noted. Sort of counts.' : 'Noted. They are there when you need them.'}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '.12em', textTransform: 'uppercase',
          color: 'var(--stage-2-text)', minWidth: 0,
        }}>
          {baseline ? 'Where things are now' : 'Still on the list'}
        </div>
        {/* The place in the run, so a parent mid list always knows how much is
            left. Counts answers, not children: the page heading owns whose day
            this is. Hidden for a single question, where 0 of 1 is just noise. */}
        {concerns.length > 1 && !allSaved && (
          <div aria-label={`${savedCount} of ${concerns.length} answered`} style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '.08em', color: 'var(--ink-muted)', flexShrink: 0,
          }}>
            {savedCount} of {concerns.length}
          </div>
        )}
      </div>

      {/* WHY THIS IS WORTH THIRTY SECONDS.
          Justin: "a quick note on why check in is important, eg we review each
          week to improve, lets us check which is working and if solutions works
          or we need another approach."
          It goes at the top because the reason has to arrive before the ask,
          not after it. A parent who knows the numbers come back to them as a
          judgement on the ADVICE rather than on their parenting answers
          honestly, and honest numbers are the only ones worth having. */}
      {/* ── ONE LINE, NOT THREE (11 September 2026) ────────────────────────
          Justin: "the text explainer needs to be simple, not much on this,
          just purely to see how these issues are going."
          There were two paragraphs above five rows of stars, and the second
          one explained our methodology to somebody who had opened the app to
          answer a question about their evening. Everything it said is still
          true and still said, in the place it is actually needed: the line
          under a rating of four or less says we stay on it, and the dip
          helpers offer the different approach. A promise kept beats a promise
          announced. */}
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 18px' }}>
        {baseline
          ? 'One tap each, just to see where things stand. No right answer.'
          : `One tap each, just to see how it is going. ${runWord(SILVER_RUN)[0].toUpperCase()}${runWord(SILVER_RUN).slice(1)} great days in a row and it comes off your list.`}
      </p>

      {concerns.map((c, idx) => {
        const isSaved = saved[c.id]
        const isFolded = folded[c.id]
        const isTouched = touched[c.id]
        const isPending = pending[c.id]
        const chosenBand = isTouched && value[c.id] != null ? bandOf(value[c.id]) : 0
        const lastBand = c.lastScore != null ? bandOf(c.lastScore) : 0
        // ── A FIVE IS SORTED ONLY WHEN IT IS THE SECOND IN A ROW (7 October 2026)
        //
        // The rule moved to two top scores in a row on 9 September and this
        // card was never told: the green "that is sorted" box showed on EVERY
        // five, including the first, right under a verdict line that said
        // "one more like this". The run before today is what decides, counted
        // the way lib/concerns/resting.ts counts it, and last time's score
        // stands in where the run was not supplied.
        const topRunBefore = c.topRun ?? (c.lastScore != null && c.lastScore >= TOP_BAND ? 1 : 0)
        // ── ONE OUTCOME, AND THE ROW DRAWS NOTHING ELSE ──────────────────
        //
        // The line, what happens next and the help buttons come from
        // checkinOutcome and only from there, so two messages can never sit
        // on one row again. Null until a face is tapped; a skipped row has no
        // band and so no outcome.
        const outcome: CheckinOutcome | null = chosenBand > 0
          ? checkinOutcome({ band: chosenBand, lastBand: lastBand || null, topRun: topRunBefore })
          : null
        // ── A NEW ROW STARTS AT REALLY TOUGH, NOT AT NOTHING ──────────────
        //
        // Justin, 11 September 2026: "if first time added from check in we can
        // populate with 1 star meaning just added and needs attention."
        //
        // A row nobody has rated drew five empty outlines, which reads as a
        // form waiting to be filled in rather than as a thing that needs
        // attention. The first face, grey, is the honest starting position for
        // something a parent has just told us is going on.
        //
        // It is drawn, NOT stored. A score is the parent's own word about
        // their week, and writing a 2 they never said would put a fake first
        // point on every line the What is working page draws. Same grey as
        // last time's face: clearly a starting mark, clearly not today's
        // answer, and gone the moment they tap.
        const startBand = c.lastScore == null && c.timesFlagged <= 1 ? 1 : 0
        const ghostBand = Math.max(lastBand, startBand)
        const newChild = grouped && c.childName && c.childName !== concerns[idx - 1]?.childName
        // ── HELP ON EVERY LOW SCORE, NOT ONLY A DIP ──────────────────────
        //
        // The buttons used to belong to a dip, then to a dip or a first
        // rating under five. Justin, 7 October 2026: "special attention if
        // less than 3." A parent at really tough needs the words tonight
        // whether or not yesterday was better, and the outcome says so.
        const nextMove = (outcome?.actions.length ?? 0) > 0
        const scriptCat = nextMove ? categoryForConcern(c.slug, c.label) : null
        const digiHref = `/dashboard/digi?${childId ? `child=${childId}&` : ''}ask=${encodeURIComponent(
          `${c.label} is ${scoreWord(value[c.id] ?? 2).toLowerCase()} at today's check in${c.childName ? ` for ${c.childName}` : ''}. What is our next move?`
        )}`
        // The same two buttons on the open row and on the folded line, so the
        // help offered at the tap is still there after the row has folded.
        const actionPills = nextMove && outcome ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {outcome.actions.map(a => a === 'digi'
              ? <Link key="digi" href={digiHref} style={pill}>Ask DiGi</Link>
              : scriptCat
                ? <Link key="script" href={`/dashboard/scripts/category/${scriptCat}`} style={pill}>Get the words</Link>
                : null)}
          </div>
        ) : null
        return (
          <div key={c.id}>
            {newChild && (
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
                margin: idx === 0 ? '0 0 6px' : '14px 0 6px',
              }}>
                {c.childName}
              </div>
            )}
            {/* ── A SAVED LINE FOLDS, AND KEEPS ITS RESULT (1 September 2026)
                Justin, 19 August: "you enter stars per line, that line then
                drops off and moves to the next line, until all done." Then
                1 September: the fold was eating the one thing worth keeping,
                the movement. So the slim line a row folds to carries the
                verdict ("Up from hard going") instead of the word "Saved",
                and a low score keeps its two next moves as real buttons. The
                fold itself settles via the grid rows transition in globals.css
                rather than snapping, and reduced motion keeps the jump.
                Since 7 October the fold waits a read beat after the save, so
                the line under the faces is actually read before it goes. */}
            {isFolded && (() => {
              const move = movementOf(value[c.id], c.lastScore)
              const verdictText =
                outcome?.kind === 'rest' ? 'Sorted, off your list'
                : move === 'up' ? `Up from ${scoreWord(c.lastScore!).toLowerCase()}`
                : move === 'dip' ? 'Dipped this time'
                : move === 'held' ? 'Holding steady'
                : move === 'first' ? (baseline ? 'Starting point set' : 'First one logged')
                : 'Skipped'
              const verdictColor =
                outcome?.kind === 'rest' || move === 'up' ? '#1F7A54'
                : move === 'dip' ? 'var(--terracotta-dark)'
                : 'var(--ink-muted)'
              return (
                <div className="ci-collapsed" style={{
                  padding: '9px 0',
                  borderTop: idx === 0 || newChild ? 'none' : '2px dotted rgba(26,26,46,0.18)',
                  color: 'var(--ink-muted)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span aria-hidden style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: move === 'dip' ? 'var(--terracotta-lt)' : 'var(--tint-sage)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', color: verdictColor, fontWeight: 900, flexShrink: 0,
                    }}>{move === 'dip' ? '↓' : '✓'}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)', flex: 1, minWidth: 0 }}>
                      {c.label}
                    </span>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: verdictColor, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {verdictText}
                    </span>
                  </div>
                  {actionPills && (
                    <div style={{ padding: '8px 0 4px 28px' }}>{actionPills}</div>
                  )}
                </div>
              )
            })()}
            <div className={`ci-fold${isFolded ? ' ci-folded' : ''}`} aria-hidden={isFolded || undefined}>
            <div className="ci-fold-inner">
            <div
              ref={el => { rows.current[c.id] = el }}
              style={{
                padding: '12px 0',
                borderTop: idx === 0 || newChild ? 'none' : '2px dotted rgba(26,26,46,0.18)',
                scrollMarginTop: 'calc(env(safe-area-inset-top, 0px) + 76px)',
                opacity: c.id === activeId || isTouched || isSaved ? 1 : 0.55,
                transition: 'opacity .3s ease',
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
                  // A real 44px target like the faces beside it: the padding
                  // makes the touch area and the negative margin keeps the
                  // visual layout where the small underlined word always sat.
                  <button
                    onClick={() => post(c.id, { answer: 'same', score: null })}
                    style={{
                      background: 'none', border: 'none',
                      padding: '12px 0 12px 14px', margin: '-12px 0',
                      minHeight: 44, display: 'inline-flex', alignItems: 'center',
                      fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                      fontWeight: 700, color: 'var(--ink-muted)',
                      textDecoration: 'underline', cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    Skip
                  </button>
                )}
              </div>

              {/* ── ONE LINE ABOVE THE FACES, AND ONLY WHEN SOMETHING IS
                  ACTUALLY WAITING (21 September 2026) ────────────────────────
                  The same shape as last night's words at the top of this
                  screen, because it is the same question: did you get to try
                  the thing we suggested. Never on a saved row, never more than
                  one per worry, and gone the moment it is answered. On current
                  volume this is a handful of times a month, never a normal
                  day, which is what keeps the thirty second habit thirty
                  seconds long. */}
              {c.followUp && !isSaved && tried[c.id] !== 'worked' && tried[c.id] !== 'partly' && tried[c.id] !== 'no' && (
                <div style={{
                  background: 'var(--cream)', border: 'var(--edge)', borderRadius: 'var(--radius-btn)',
                  padding: '12px 13px 11px', margin: '10px 0 4px',
                }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 8px' }}>
                    DiGi suggested: {c.followUp.suggestion}
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-base)', color: 'var(--ink)', margin: '0 0 9px', lineHeight: 1.3 }}>
                    Did you get to try it?
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {([['worked', 'Yes'], ['partly', 'Sort of'], ['no', 'Not yet']] as const).map(([v, label]) => (
                      <button
                        key={v}
                        onClick={() => rateTried(c.id, c.followUp!.outcomeId, v)}
                        disabled={tried[c.id] === 'busy'}
                        style={{
                          flex: '1 1 5em', minWidth: 0, minHeight: 44, padding: '10px 12px',
                          borderRadius: 'var(--radius-pill)', cursor: 'pointer',
                          background: '#fff', border: 'var(--edge)', boxShadow: 'var(--lift)',
                          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-sm)', color: 'var(--ink)',
                          opacity: tried[c.id] === 'busy' ? 0.6 : 1,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {c.followUp && !isSaved && (tried[c.id] === 'worked' || tried[c.id] === 'partly' || tried[c.id] === 'no') && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ink-muted)', margin: '10px 0 4px' }}>
                  {tried[c.id] === 'worked' ? 'Noted. Now, how is it going?'
                    : tried[c.id] === 'partly' ? 'Noted. Sort of counts. Now, how is it going?'
                    : 'Noted. It stays on the list. Now, how is it going?'}
                </p>
              )}

              {/* FIVE FACES, ONE TAP. Each one is a 48px target with its word
                  under it and its own label, so it is a proper radio group for
                  a screen reader and a proper thumb target for everyone else.
                  Last time is the grey face (see the note on Face above), and
                  only the face AT last time's band carries the "what you said
                  last time" label, so a screen reader is never told the parent
                  said something they did not. */}
              <div
                role="radiogroup"
                aria-label={`${c.label}${c.childName ? `, ${c.childName}` : ''}: how is it going, really tough to going great`}
                style={{ display: 'flex', marginTop: '8px', marginLeft: '-4px', marginRight: '-4px' }}
              >
                {BANDS.map((b, i) => {
                  const n = i + 1
                  const filled = chosenBand === n
                  // Grey on last time's face, and only while today is still
                  // unanswered. The moment a face is tapped the row is about
                  // today, and leaving last week's grey beside it would be two
                  // answers on one line.
                  const past = !isTouched && ghostBand === n
                  return (
                    <button
                      key={b.score}
                      role="radio"
                      aria-checked={chosenBand === n}
                      aria-label={past && lastBand === n ? `${b.label}, what you said last time` : b.label}
                      disabled={!!isSaved}
                      onClick={() => pick(c.id, b.score)}
                      style={{
                        background: 'none', border: 'none', padding: '4px 2px 2px',
                        cursor: isSaved ? 'default' : 'pointer',
                        flex: '1 1 0', minWidth: 44, minHeight: 48,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      }}
                    >
                      <Face band={n} filled={filled} past={past} />
                      <span aria-hidden style={{
                        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xs)',
                        lineHeight: 1.1, textAlign: 'center',
                        color: filled ? 'var(--ink)' : 'var(--ink-muted)',
                        opacity: filled || past ? 1 : 0.75,
                      }}>
                        {b.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* THE ONE MESSAGE. The line, what happens next, the help if any,
                  and the save state. Keyed by the chosen score so changing
                  your answer pops the new outcome in fresh rather than silently
                  editing the old sentence. The pop is a one shot scale settle
                  in globals.css, off under reduced motion. A sorted worry gets
                  the green ground, a tough one the butter ground, because the
                  two days a parent most needs to notice are those two. */}
              {outcome && (
                <div key={value[c.id]} className="ci-pop" style={{ marginTop: '8px' }}>
                  <div style={{
                    background: outcome.kind === 'rest' ? 'var(--tint-green)' : outcome.kind === 'attention' ? 'var(--terracotta-lt)' : 'transparent',
                    borderRadius: 'var(--radius-tile)',
                    padding: outcome.kind === 'rest' || outcome.kind === 'attention' ? '11px 13px' : 0,
                  }}>
                    <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3 }}>
                      {outcome.kind === 'rest' ? '🎉 ' : ''}{outcome.line}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                      {outcome.next}
                    </p>
                    {actionPills && <div style={{ marginTop: '9px' }}>{actionPills}</div>}
                  </div>
                  <p style={{
                    display: 'flex', alignItems: 'center', gap: '12px', margin: '6px 0 0',
                    fontSize: 'var(--text-sm)', fontWeight: 600, color: failed[c.id] ? 'var(--ink)' : 'var(--ink-muted)', lineHeight: 1.4,
                  }}>
                    <span>{isSaved ? 'Saved.' : failed[c.id] ? 'That did not save, tap a face to try again.' : 'Saving.'}</span>
                    {isPending && !isSaved && !failed[c.id] && (
                      <button
                        onClick={() => change(c.id)}
                        style={{
                          background: 'none', border: 'none', padding: '8px 0', margin: '-8px 0',
                          minHeight: 32, fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                          fontWeight: 700, color: 'var(--ink-soft)', textDecoration: 'underline', cursor: 'pointer',
                        }}
                      >
                        Change
                      </button>
                    )}
                  </p>
                </div>
              )}

              {/* Before anything is tapped, last time is said in prose as well
                  as spatially, because the grey face alone does not tell a
                  parent what that face MEANT. */}
              {/* Body face, not mono: this is a sentence, and the token rule
                  keeps mono for eyebrows and labels only. */}
              {!isTouched && !isSaved && (
                <div style={{
                  fontSize: 'var(--text-sm)', fontWeight: 600,
                  color: 'var(--ink-muted)', marginTop: '4px',
                }}>
                  {newSourceLine(c) ?? recencyLabel(c, baseline)}
                  {c.lastScore != null
                    ? ` · last time ${scoreWord(c.lastScore).toLowerCase()}`
                    : startBand > 0 ? ' · starts at really tough until you say otherwise' : ''}
                </div>
              )}
            </div>
            </div>
            </div>
          </div>
        )
      })}


      {allSaved && (
        <div style={{
          marginTop: '10px', paddingTop: '14px', borderTop: 'var(--edge)',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            color: 'var(--retro-green)', marginBottom: nextChild ? '12px' : 0,
          }}>
            {childName ? `${childName} is done ✓` : 'All checked in ✓'} We will read these into next week.
          </div>

          {/* ── THE DOOR TO THE WHOLE PICTURE (29 August 2026) ─────────────
              From the value visibility audit: the data went in here every day
              and came back only in the Sunday email. The per row verdict above
              already reads today against last time; this is the way to every
              line at once, and it only shows when there is history to see,
              because a first check in has no picture yet. A quiet text link,
              never competing with the terracotta buttons below. */}
          {concerns.some(c => c.lastScore != null) && (
            <Link
              href="/dashboard/what-is-working"
              style={{
                display: 'block', margin: '0 0 12px',
                fontSize: 'var(--text-base)', color: 'var(--ink-soft)',
                textDecoration: 'underline', textUnderlineOffset: '3px',
              }}
            >
              See every line, and how far each has come →
            </Link>
          )}

          {/* ── AND STRAIGHT ON TO THE NEXT CHILD ──────────────────────────
              Justin: "the parent runs through one child first then says done,
              onto next child."

              A link rather than an automatic jump. Finishing is a small moment
              and being thrown to a fresh list of worries without touching
              anything would take it away, which is the opposite of what the
              green line above is for. It also has to survive a parent who
              stops here, and a link does that by simply not being pressed. */}
          {nextChild && (
            <Link
              href={`/dashboard/checkin?child=${nextChild.id}`}
              style={{
                display: 'block', textAlign: 'center', textDecoration: 'none',
                background: 'var(--terracotta)', color: 'var(--ink)',
                borderRadius: 'var(--radius-btn)', padding: '14px 18px',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                boxShadow: '0 5px 0 var(--terracotta-dark)',
              }}
            >
              Now {nextChild.name ?? 'your other child'} →
            </Link>
          )}
          {/* The LAST child's finish is the whole family's. Justin: "only when
              the last child is done it marks as completed, then takes them
              back to Today." The rung on Today reads scored events per child,
              so by this point it is genuinely green, and the way back lands on
              it rather than leaving the parent on a finished form. */}
          {!nextChild && (
            <Link
              href="/dashboard#today"
              style={{
                display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '12px',
                background: 'var(--terracotta)', color: 'var(--ink)',
                borderRadius: 'var(--radius-btn)', padding: '14px 18px',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
                boxShadow: '0 5px 0 var(--terracotta-dark)',
              }}
            >
              Back to today, check in done ✓
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
