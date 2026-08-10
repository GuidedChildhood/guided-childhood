'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { pickHabitNudge, snoozeDays, type HabitNudge as Nudge, type NudgeFacts } from '@/lib/home/habit-nudges'

// The quiet card. One line, one thing to do, and Not now means it.
//
// Justin, 10 August 2026: "little pop ups, not intrusive or annoying."
//
// So this is not a pop up. It does not cover the page, it does not take the
// tap, and it does not appear the moment a parent arrives. It slides into the
// flow of the page after a few seconds and waits to be read or ignored, and
// ignoring it is a perfectly good outcome.
//
// FOUR RULES, and they are the whole design:
//
//   1. It only ever says something TRUE of this family right now. The rules are
//      in lib/home/habit-nudges.ts and every one of them is a fact, not a
//      schedule.
//   2. One per visit. Two nudges in one sitting is a queue, and a queue is the
//      thing people learn to dismiss without reading.
//   3. Not now backs OFF. Two days, then four, eight, then a fortnight. A flat
//      snooze put the same card back every morning for a month in the
//      simulation, which is the exact complaint Justin has already made twice
//      about other cards.
//   4. And a day between any two nudges, whatever they are about, so a family
//      with several things going on does not get a card every single morning.
//
// The state lives in localStorage rather than the database on purpose: it is a
// preference about this browser's noise level, it is worth nothing to us, and
// putting it in a table would mean a migration and a write on every dismissal
// to hold something nobody will ever query.

const SHOW_AFTER_MS = 4000
const DAY_MS = 86400000
const LAST_SHOWN = 'gc_habit_last'
const seenKey = (key: string) => `gc_habit_${key}`
const countKey = (key: string) => `gc_habit_n_${key}`

const dayNow = () => Math.floor(Date.now() / DAY_MS)

export default function HabitNudge({ facts }: { facts: NudgeFacts }) {
  const [nudge, setNudge] = useState<Nudge | null>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('gc_habit_shown') === '1') return
    const today = dayNow()

    // Rule 4: a whole day between any two, whatever they were about.
    if (Number(localStorage.getItem(LAST_SHOWN) ?? 0) >= today) return

    // Everything still inside its own snooze.
    const suppressed = new Set<string>()
    for (const key of ['waiting-yes', 'timer', 'offline', 'unspent']) {
      const until = Number(localStorage.getItem(seenKey(key)) ?? 0)
      if (until > today) suppressed.add(key)
    }

    const next = pickHabitNudge(facts, suppressed)
    if (!next) return

    const id = setTimeout(() => {
      sessionStorage.setItem('gc_habit_shown', '1')
      localStorage.setItem(LAST_SHOWN, String(today))
      setNudge(next)
      requestAnimationFrame(() => setEntered(true))
    }, SHOW_AFTER_MS)
    return () => clearTimeout(id)
  }, [facts])

  if (!nudge) return null

  function dismiss() {
    if (!nudge) return
    // Count first, so the snooze that gets written is the one this dismissal
    // has earned rather than the one before it.
    const n = Number(localStorage.getItem(countKey(nudge.key)) ?? 0)
    localStorage.setItem(countKey(nudge.key), String(n + 1))
    localStorage.setItem(seenKey(nudge.key), String(dayNow() + snoozeDays(n)))
    setEntered(false)
    setTimeout(() => setNudge(null), 300)
  }

  return (
    <div
      style={{
        background: 'var(--tint-sage)', border: '1.5px solid var(--border)',
        borderRadius: 18, padding: '15px 17px', marginBottom: 16,
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 5 }}>
        {nudge.eyebrow}
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.3, margin: '0 0 6px' }}>
        {nudge.line}
      </p>
      {/* The method, not just the prod. This sentence is the thing Justin asked
          for: a parent who understands why the timer works can keep the habit
          with the app shut, and a parent who was only prodded cannot. */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 12px' }}>
        {nudge.why}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Link
          href={nudge.href}
          onClick={dismiss}
          style={{
            display: 'inline-flex', alignItems: 'center', padding: '10px 18px',
            background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
            borderRadius: 14, boxShadow: '0 4px 0 var(--terracotta-dark)',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
          }}
        >
          {nudge.cta}
        </Link>
        <button
          type="button"
          onClick={dismiss}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '10px 4px',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)',
            color: 'var(--ink-muted)',
          }}
        >
          Not now
        </button>
      </div>
    </div>
  )
}
