'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { STEPS, type StepKey } from '@/lib/kid/five-a-day'
import { playKidSound } from '@/lib/sound/kidSounds'
import { resolveTheme, type KidTheme } from '@/lib/kid/theme'
import KidStepSheet from '@/components/kid/KidStepSheet'
import { Ribbon } from '@/components/kid/HappyNewsBits'
import { KID_DAY_EVENT, type PrintableTick } from '@/lib/kid/print-anywhere'

// The five a day card: the whole of a child's day, one step at a time.
//
// Justin, 9 August 2026: "Tap to open one at a time: do the first, the second
// appears, and so on. Not five open rows at once."
//
// So the card shows ONE live step. Done steps shrink to slim ticked lines
// above it so the climb stays visible, the live step is the big obvious
// thing, and what is still to come stays hidden behind a quiet count: the
// next one appears the moment this one lands. Finch's goal list is the
// reference from the Mobbin sweep for this build (one card leads, the rest
// wait), translated into butter, ink and Nunito. The original Duolingo Daily
// Quests shape (all five open at once) is what this replaces.
//
// What this deliberately does NOT do:
//
//   No countdown. Duolingo puts a timer on the panel because the pressure drives
//   daily return. A clock on a child's chores turns a habit into an exam, and
//   the ICO Children's Code names exactly that kind of engineered urgency.
//
//   No loss language. Nothing here says a streak is at risk. The run is shown
//   when it exists and is silent when it does not.

export type DayState = {
  /** The UK date this row is for, so the celebration is remembered per day. */
  day?: string
  steps: StepKey[]
  done: StepKey[]
  complete: boolean
  streak: number
}

// Whether the takeover has already played for a given day.
//
// Wrapped because a child's phone can refuse localStorage entirely (private
// mode, a locked down device), and a throw here would take the whole list down
// with it. Unreadable storage means "not celebrated", which errs towards
// showing a child their moment twice rather than never.
const CELEBRATED_KEY = 'gc.kid.celebrated'

function celebratedToday(day?: string): boolean {
  if (!day) return false
  try { return window.localStorage.getItem(CELEBRATED_KEY) === day } catch { return false }
}

function rememberCelebrated(day?: string) {
  if (!day) return
  // One day at a time. Yesterday's value is simply overwritten, so nothing
  // accumulates on the device.
  try { window.localStorage.setItem(CELEBRATED_KEY, day) } catch { /* nothing to remember it with */ }
}

export default function KidFiveADay({
  token,
  childName,
  jobsAllDone,
  jobsProgress,
  newQuestCount = 0,
  readingMinutes,
  moveJobs,
  onOpenJobs,
  onDayComplete,
  initialState = null,
  theme,
}: {
  token: string
  childName?: string
  /** Whether every job due today is ticked, which is step one's own condition. */
  jobsAllDone: boolean
  /**
   * How today's jobs are going, so the row can say it.
   *
   * The row used to read "Tick off what your grown up sent" whether none were
   * done or five of six were, which is the least useful thing it could say to a
   * child standing in front of it. Justin: it "should give the jobs then need to
   * do by the time on app and when cleared it goes green". The going green part
   * already worked; saying where they are up to did not.
   */
  jobsProgress?: { done: number; total: number } | null
  /**
   * Jobs added since this child last opened their app. The arrival banner
   * lived on the separate Today list; now the jobs live behind this card's
   * jobs step, the step itself has to be the thing that says so on first
   * glance, or a parent's new job is invisible until the child happens to
   * open the page.
   */
  newQuestCount?: number
  /** Minutes of reading to ask for, from the child's age band. */
  readingMinutes?: number
  /**
   * The moving about jobs actually on the board today, and whether they are
   * ticked. Null when this child has none, which is the case that has to keep
   * the plain self tick: a step that cannot be completed must never be one of
   * the five, and pointing a child at a job that does not exist is exactly that.
   */
  moveJobs: { total: number; done: boolean } | null
  /** Jobs completes on this screen, so the parent scrolls the list into view. */
  onOpenJobs: () => void
  /** Fired once when the fifth step lands, for the celebration. */
  onDayComplete?: (streak: number, day: { steps: StepKey[]; done: StepKey[]; completedDays?: number }) => void
  /**
   * A ready made day, for the ref fixtures only. When set, the card renders
   * it and never calls /api/kid/day, which no fixture can answer. Production
   * never passes this, so the real screen keeps the real fetch, and the
   * fixture renders the REAL component instead of a copy of its markup.
   */
  initialState?: DayState | null
  /**
   * The colour the child chose in Make it mine. Justin: "this should match app
   * colours chosen." The live step's edge, its shadow and the progress bar were
   * all fixed terracotta, so a child on Ocean still got a terracotta card.
   */
  theme?: KidTheme
}) {
  const t = theme ?? resolveTheme(null)
  const [state, setState] = useState<DayState | null>(initialState)
  const [busy, setBusy] = useState<StepKey | null>(null)
  // The step whose sheet is open. A self tick step opens this instead of
  // ticking, which is the whole of the "flashed off as soon as clicked" fix.
  const [sheet, setSheet] = useState<StepKey | null>(null)
  // A finished day folds to one proud line; this reopens it. Not remembered
  // across loads on purpose, the same rule the parent's path uses: the point
  // of folding is that the next visit leads with the day done, not the list.
  const [openAnyway, setOpenAnyway] = useState(false)

  const liveRef = useRef(true)
  useEffect(() => { liveRef.current = true; return () => { liveRef.current = false } }, [])
  const stateRef = useRef(state)
  useEffect(() => { stateRef.current = state }, [state])

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/kid/day?token=${encodeURIComponent(token)}`, { cache: 'no-store' })
      const d = r.ok ? await r.json() : null
      if (!liveRef.current || !d || !Array.isArray(d.steps)) return
      setState(d)
      // The day may have been finished somewhere else entirely.
      //
      // Three of the five are ticked by the routes that know the child did
      // the thing: passing a lesson, passing the quiz, sending a printable.
      // Any of those can be the fifth, and when it is, the child is on
      // another page and mark() never runs, so the celebration below never
      // fires. They would come back to a finished list and no moment at all,
      // which is the whole reward for the day quietly missing.
      //
      // Remembered per day in localStorage rather than in the database. It is
      // a moment on a screen, not a record: completed_at and the streak are
      // the record, and they are already right. Worst case on a cleared phone
      // is one replay of a good thing.
      if (d.complete && !celebratedToday(d.day)) {
        rememberCelebrated(d.day)
        onDayComplete?.(d.streak, { steps: d.steps, done: d.done ?? d.steps })
      }
    } catch { /* the card simply does not show, or keeps what it had */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Fetched on mount, and again every time the child comes BACK to this
  // screen: from Safari after a print, from a lesson, from the app switcher.
  //
  // It used to fetch once and trust itself for the rest of the day. On the
  // installed app that is a long time: the print page opens in Safari, ticks
  // the printable in the database, and the child returns to an app that has
  // been sitting in the background with the old answer, A printable still
  // open, four of five for ever. Justin, 2 September 2026, from that print
  // page: "go back to the 5 a day marked as completed and onto next."
  // Coming back to the screen is now a reason to ask again. Cheap, fails soft
  // to what it had.
  useEffect(() => {
    if (initialState) return
    void load()
    const onVis = () => { if (document.visibilityState === 'visible') void load() }
    const onShow = () => { void load() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pageshow', onShow)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pageshow', onShow)
    }
  }, [load, initialState])

  // A tick made elsewhere on THIS page arrives as an event, so the card moves
  // on the instant it lands, no round trip: the print buttons on the
  // printables tab and the assigned sheet both raise it (see
  // tickPrintableStep). The done row shrinks up, the next step lights, and
  // the star plays for a step that genuinely just landed.
  useEffect(() => {
    const onTick = (e: Event) => {
      const t = (e as CustomEvent<PrintableTick>).detail
      if (!t || !Array.isArray(t.done)) return
      const before = stateRef.current
      setState(s => (s ? { ...s, steps: t.steps.length > 0 ? t.steps : s.steps, done: t.done, complete: t.complete, streak: t.streak } : s))
      if (t.ticked) playKidSound('star')
      if (t.justCompleted) {
        rememberCelebrated(before?.day)
        onDayComplete?.(t.streak, { steps: t.steps.length > 0 ? t.steps : (before?.steps ?? []), done: t.done })
      }
    }
    window.addEventListener(KID_DAY_EVENT, onTick)
    return () => window.removeEventListener(KID_DAY_EVENT, onTick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Jobs is the one step the child does not tick here: it is true when every job
  // due today is ticked, which the board already knows. Marked through on its
  // own so a child never has to claim something the app can see for itself.
  useEffect(() => {
    if (!state || !jobsAllDone) return
    if (!state.steps.includes('jobs') || state.done.includes('jobs')) return
    // On a day with nothing on the board the step marks itself the same way,
    // and the note says why, so the record never claims jobs were done.
    void mark('jobs', true, jobsProgress && jobsProgress.total === 0 ? 'No jobs today' : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, jobsAllDone])

  // Move about, when the board already carries a job that IS moving about.
  //
  // It marks itself off the real job rather than asking for a second tick, the
  // same way jobs does. A child who spent an hour outside and ticked the job
  // that paid them for it has plainly moved about, and asking them to confirm
  // it again in a different box is how a list teaches a child that some of its
  // rows are pretend.
  useEffect(() => {
    if (!state || !moveJobs || !moveJobs.done) return
    if (!state.steps.includes('move') || state.done.includes('move')) return
    void mark('move', true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, moveJobs])

  async function mark(step: StepKey, silent = false, note: string | null = null) {
    if (busy) return
    setBusy(step)
    // Shown at once. A child who taps and sees nothing assumes it broke.
    setState(s => (s ? { ...s, done: Array.from(new Set([...s.done, step])) } : s))
    if (!silent) playKidSound('star')
    try {
      const res = await fetch('/api/kid/day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, step, note }),
      })
      const d = await res.json().catch(() => null)
      if (!res.ok || !d?.ok) {
        // Take the optimistic tick back rather than leave a child believing a
        // step landed when it did not.
        setState(s => (s ? { ...s, done: s.done.filter(k => k !== step) } : s))
      } else {
        setState(s => (s ? { ...s, done: d.done, complete: d.complete, streak: d.streak } : s))
        if (d.justCompleted) {
          // Remembered here too, so coming back to the list does not replay a
          // takeover the child has just watched.
          rememberCelebrated(state?.day)
          onDayComplete?.(d.streak, { steps: state?.steps ?? [], done: d.done })
        }
      }
    } catch {
      setState(s => (s ? { ...s, done: s.done.filter(k => k !== step) } : s))
    }
    setBusy(null)
  }

  if (!state || state.steps.length === 0) return null

  const doneCount = state.done.length
  const total = state.steps.length

  // The finished day is one line, not five crossed out rows. Justin, on
  // Teo's screen: "of 5 jobs done it should close up to 1 line as no need to
  // see done 5." Done work is worth a proud line and a way back in, not the
  // same room it took while it still needed doing. A tap reopens the list.
  if (state.complete && !openAnyway) {
    return (
      <button
        onClick={() => { playKidSound('tap'); setOpenAnyway(true) }}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
          background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: '22px',
          padding: '14px 16px', marginBottom: '16px', boxShadow: '0 5px 0 rgba(26,26,46,0.08)',
          cursor: 'pointer', textAlign: 'left', font: 'inherit', color: 'var(--ink)',
        }}
      >
        <span aria-hidden style={{ fontSize: 'var(--text-2xl)', lineHeight: 1, flexShrink: 0 }}>🎉</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.2 }}>
            Today is done!
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', marginTop: 2 }}>
            {doneCount} of {total}{state.streak > 0 ? ` · 🔥 ${state.streak} day${state.streak === 1 ? '' : 's'} in a row` : ''}
          </span>
        </span>
        <span aria-hidden style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--ink-muted)' }}>
          Show ›
        </span>
      </button>
    )
  }

  return (
    <div style={{
      background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: '22px',
      padding: '16px 16px 12px', marginBottom: '16px', boxShadow: '0 5px 0 rgba(26,26,46,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
        {/* The one ribbon heading on the screen (the Happy Newspaper pass):
            the five a day is the heading that matters, so it gets the banner. */}
        <Ribbon tone={state.complete ? 'green' : 'butter'}>
          {state.complete ? 'Today is done! 🎉' : 'Your five for today'}
        </Ribbon>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', flexShrink: 0 }}>
          {doneCount} of {total}
        </span>
      </div>

      {/* One bar for the whole day. A child reads the row of ticks first and the
          bar second, so it stays thin and quiet. */}
      <div style={{ height: 8, borderRadius: 100, background: 'var(--cream)', overflow: 'hidden', margin: '8px 0 14px' }}>
        <div style={{
          width: `${Math.round((doneCount / total) * 100)}%`, height: '100%',
          background: t.hex, borderRadius: 100, transition: 'width 0.35s ease',
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Done steps first, as slim ticked lines: the climb so far. */}
        {state.steps.filter(key => state.done.includes(key)).map(key => {
          const def = STEPS[key]
          return (
            <div key={key} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 10px', opacity: 0.68,
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--text-sm)', lineHeight: 1,
                background: 'var(--tint-sage)', border: '1.5px solid #2F8F6B',
              }}>
                ✓
              </span>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                // "No jobs today" is a fact, not a chore the child crossed off,
                // so it does not wear the strikethrough the real ones earn.
                color: 'var(--ink-muted)',
                textDecoration: key === 'jobs' && jobsProgress?.total === 0 ? 'none' : 'line-through',
                lineHeight: 1.2,
              }}>
                {key === 'reading' && readingMinutes
                  ? `${readingMinutes} minutes reading`
                  : key === 'jobs' && jobsProgress?.total === 0
                    // Justin, from the child app: "there is no jobs so should
                    // know that." The row says so instead of pretending a job
                    // list was finished.
                    ? 'No jobs today, this one is free'
                    : def.label}
              </span>
            </div>
          )
        })}

        {/* The ONE live step. The next appears when this lands. */}
        {(() => {
          const key = state.steps.find(k => !state.done.includes(k))
          if (!key) return null
          const def = STEPS[key]
          const isDone = false
          const href = def.href ? def.href(token) : null
          // Jobs and the moving about jobs open the jobs page, so they count as
          // going somewhere even though they have no href of their own.
          const goesSomewhere = Boolean(href) || key === 'jobs' || (key === 'move' && Boolean(moveJobs))

          const inner = (
            <>
              <span style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--text-lg)', lineHeight: 1,
                background: isDone ? 'var(--tint-sage)' : 'var(--cream)',
                border: isDone ? '1.5px solid #2F8F6B' : '1.5px solid rgba(26,26,46,0.1)',
              }}>
                {isDone ? '✓' : def.emoji}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 'var(--text-md)', lineHeight: 1.25,
                  color: isDone ? 'var(--ink-muted)' : 'var(--ink)',
                  textDecoration: isDone ? 'line-through' : 'none',
                }}>
                  {/* Reading states its own number, which changes with the
                      child's age. Everything else says what it always says. */}
                  {key === 'reading' && readingMinutes
                    ? `${readingMinutes} minutes reading`
                    : def.label}
                </span>
                {!isDone && (
                  <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.35, marginTop: '1px' }}>
                    {key === 'jobs' && jobsProgress && jobsProgress.total === 0
                      // Seen only for the moment before the step marks itself
                      // done, but that moment must not say "tick off what your
                      // grown up sent" when nothing was sent.
                      ? 'Nothing on the board today'
                      : key === 'move' && moveJobs
                      ? `You have ${moveJobs.total === 1 ? 'a job' : `${moveJobs.total} jobs`} for this. Tap to see ${moveJobs.total === 1 ? 'it' : 'them'}`
                      : key === 'jobs' && newQuestCount > 0
                        // A fresh job beats the running count: the child has
                        // to hear something arrived on first glance.
                        ? `✨ ${newQuestCount === 1 ? 'A new job just arrived' : `${newQuestCount} new jobs just arrived`}! Tap to see`
                        : key === 'jobs' && jobsProgress && jobsProgress.total > 0
                          // Where they are up to, not a generic instruction. A
                          // child who has done four of six is told so, and the
                          // number is the reason to tap.
                          ? `${jobsProgress.done} of ${jobsProgress.total} done. Tap to see the rest`
                          : def.hint}
                  </span>
                )}
              </span>
              {/* Only on rows that really do go somewhere.
                  A self tick step wore this too, which is half of why Justin
                  tapped Something kind expecting a page and got a silent tick
                  instead. The chevron is a promise about what happens next, and
                  it was lying on seven of the twelve steps. */}
              {!isDone && goesSomewhere && (
                <span style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink-muted)' }}>
                  ›
                </span>
              )}
            </>
          )

          // The live step wears the loud edge, because it is the one thing
          // the card is asking for right now.
          const rowStyle: React.CSSProperties = {
            display: 'flex', alignItems: 'center', gap: '11px', width: '100%',
            textAlign: 'left', cursor: 'pointer',
            background: 'var(--cream)',
            border: `2px solid ${t.hex}`,
            borderRadius: '16px', padding: '14px 13px',
            boxShadow: `0 4px 0 ${t.hexDark}`,
            textDecoration: 'none',
          }

          // Jobs opens the jobs page, which is where the do these jobs list
          // and the pay back message live now the home screen no longer
          // repeats them under this card. Move goes the same way when the
          // board carries a job that IS moving about, so a child is pointed
          // at the real job rather than asked for a second tick of the same
          // hour outside. With no such job it falls through to the self tick.
          if (key === 'jobs' || (key === 'move' && moveJobs)) {
            return (
              <button key={key} onClick={() => { playKidSound('tap'); onOpenJobs() }} style={rowStyle}>
                {inner}
              </button>
            )
          }

          if (href) {
            return (
              <a key={key} href={href} onClick={() => playKidSound('tap')} style={rowStyle}>
                {inner}
              </a>
            )
          }

          // The offline ones are the child's own word for it. Deliberately not
          // sent to a grown up to verify: the point is encouraging time away
          // from the screen, and putting an approval gate on going outside
          // would make it another thing to be checked on.
          //
          // But the child's own word has to actually be ASKED FOR. This used to
          // run mark() straight from the tap, which ticked the step and folded
          // the row away on the same frame. Justin, 9 August: "something kind
          // just flashed off as soon as clicked." Now it opens the sheet, which
          // offers ideas and asks, and only the confirm in there marks anything.
          return (
            <button key={key} onClick={() => { playKidSound('tap'); setSheet(key) }} disabled={busy === key} style={rowStyle}>
              {inner}
            </button>
          )
        })()}

        {/* What is still hidden, said out loud so the appearing trick is a
            promise rather than a mystery. */}
        {total - doneCount > 1 && (
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.06em', color: 'var(--ink-muted)',
            margin: '2px 2px 0', textAlign: 'center',
          }}>
            {total - doneCount - 1} more to come. The next appears when this one is done.
          </p>
        )}
      </div>

      {state.streak > 0 && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '12px 2px 2px', textAlign: 'center' }}>
          🔥 {state.streak} day{state.streak === 1 ? '' : 's'} in a row
        </p>
      )}
      {state.complete && state.streak === 0 && childName && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '10px 2px 2px', textAlign: 'center' }}>
          Every single one, {childName}. Come back tomorrow to start a run.
        </p>
      )}

      {/* The sheet a self tick step opens. Confirming is the only thing that
          marks anything; Not yet closes and leaves the step where it was. */}
      {sheet && (
        <KidStepSheet
          step={sheet}
          childName={childName}
          readingMinutes={readingMinutes}
          theme={t}
          busy={busy === sheet}
          onClose={() => setSheet(null)}
          onConfirm={note => { const k = sheet; setSheet(null); void mark(k, true, note) }}
        />
      )}
    </div>
  )
}
