'use client'

import { useEffect, useState } from 'react'
import { STEPS, type StepKey } from '@/lib/kid/five-a-day'
import { playKidSound } from '@/lib/sound/kidSounds'

// The five a day card: the whole of a child's day, on one screen, no scrolling.
//
// Modelled on Duolingo's Daily Quests panel, which is the proven version of this
// shape: a short list, one line each, its own progress, and a reward at the end.
// Five one line rows fit a phone with room to spare, which is what actually
// solves "no need to scroll". Tabs were never the fix for that.
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
  readingMinutes,
  moveJobs,
  onOpenJobs,
  onDayComplete,
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
  onDayComplete?: (streak: number) => void
}) {
  const [state, setState] = useState<DayState | null>(null)
  const [busy, setBusy] = useState<StepKey | null>(null)

  useEffect(() => {
    let live = true
    fetch(`/api/kid/day?token=${encodeURIComponent(token)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!live || !d || !Array.isArray(d.steps)) return
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
          onDayComplete?.(d.streak)
        }
      })
      .catch(() => { /* the card simply does not show */ })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // Jobs is the one step the child does not tick here: it is true when every job
  // due today is ticked, which the board already knows. Marked through on its
  // own so a child never has to claim something the app can see for itself.
  useEffect(() => {
    if (!state || !jobsAllDone) return
    if (!state.steps.includes('jobs') || state.done.includes('jobs')) return
    void mark('jobs', true)
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

  async function mark(step: StepKey, silent = false) {
    if (busy) return
    setBusy(step)
    // Shown at once. A child who taps and sees nothing assumes it broke.
    setState(s => (s ? { ...s, done: Array.from(new Set([...s.done, step])) } : s))
    if (!silent) playKidSound('star')
    try {
      const res = await fetch('/api/kid/day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, step }),
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
          onDayComplete?.(d.streak)
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

  return (
    <div style={{
      background: '#fff', border: '1.5px solid rgba(26,26,46,0.08)', borderRadius: '22px',
      padding: '16px 16px 12px', marginBottom: '16px', boxShadow: '0 5px 0 rgba(26,26,46,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: 0, lineHeight: 1.15 }}>
          {state.complete ? 'Today is done! 🎉' : 'Your five for today'}
        </p>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', flexShrink: 0 }}>
          {doneCount} of {total}
        </span>
      </div>

      {/* One bar for the whole day. A child reads the row of ticks first and the
          bar second, so it stays thin and quiet. */}
      <div style={{ height: 8, borderRadius: 100, background: 'var(--cream)', overflow: 'hidden', margin: '8px 0 14px' }}>
        <div style={{
          width: `${Math.round((doneCount / total) * 100)}%`, height: '100%',
          background: 'var(--terracotta)', borderRadius: 100, transition: 'width 0.35s ease',
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {state.steps.map(key => {
          const def = STEPS[key]
          const isDone = state.done.includes(key)
          const href = def.href ? def.href(token) : null

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
                    {key === 'move' && moveJobs
                      ? `You have ${moveJobs.total === 1 ? 'a job' : `${moveJobs.total} jobs`} for this. Tap to see ${moveJobs.total === 1 ? 'it' : 'them'}`
                      : key === 'jobs' && jobsProgress && jobsProgress.total > 0
                        // Where they are up to, not a generic instruction. A
                        // child who has done four of six is told so, and the
                        // number is the reason to tap.
                        ? `${jobsProgress.done} of ${jobsProgress.total} done. Tap to see the rest`
                        : def.hint}
                  </span>
                )}
              </span>
              {!isDone && (
                <span style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink-muted)' }}>
                  ›
                </span>
              )}
            </>
          )

          const rowStyle: React.CSSProperties = {
            display: 'flex', alignItems: 'center', gap: '11px', width: '100%',
            textAlign: 'left', cursor: isDone ? 'default' : 'pointer',
            background: isDone ? 'transparent' : 'var(--cream)',
            border: '1.5px solid ' + (isDone ? 'transparent' : 'rgba(26,26,46,0.07)'),
            borderRadius: '15px', padding: '10px 12px',
            textDecoration: 'none', opacity: isDone ? 0.72 : 1,
          }

          if (isDone) return <div key={key} style={rowStyle}>{inner}</div>

          // Jobs stays on this screen: it is the list directly below, and sending
          // a child somewhere else to do the thing they can already see would be
          // navigation for its own sake.
          // Move goes the same way when the board carries a job that IS moving
          // about: it is the same list, a few rows down, so pointing at it beats
          // asking for a second tick of the same hour outside. With no such job
          // it falls through to the self tick below, unchanged.
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

          // The offline ones (reading, homework, move) are the child's own word
          // for it. Deliberately not sent to a grown up to verify: the point is
          // encouraging time away from the screen, and putting an approval gate
          // on going outside would make it another thing to be checked on.
          return (
            <button key={key} onClick={() => mark(key)} disabled={busy === key} style={rowStyle}>
              {inner}
            </button>
          )
        })}
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
    </div>
  )
}
