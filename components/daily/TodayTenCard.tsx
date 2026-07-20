'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import type { TodayLoopTask } from '@/lib/pathway/daily-tasks'
import { TASK_MINUTES, nextHint } from '@/lib/pathway/today-loop-copy'

// THE one card of the narrowed daily flow: the parent's real minute
// commitment as the eyebrow, four progress dots, the one next step named,
// one butter button. Driven by the exact same engine as the old path strip
// (getTodayLoop, the honest minute weights, the same minutes line copy), so
// nothing about how the day is counted changed, only how it is shown.

function minutesWord(m: number): string {
  return m === 5 ? 'five' : m === 15 ? 'fifteen' : m === 10 ? 'ten' : String(m)
}

type DotState = 'done' | 'now' | 'ahead'

function Dot({ state, dataKey }: { state: DotState; dataKey: string }) {
  return (
    <span
      data-ten-dot={dataKey}
      style={{
        width: state === 'now' ? 16 : 12, height: state === 'now' ? 16 : 12, borderRadius: '50%',
        background: state === 'done' ? 'var(--retro-green)' : state === 'now' ? '#fff' : 'var(--cream)',
        border: state === 'now' ? '3px solid var(--terracotta-dark)' : `2px solid ${state === 'done' ? 'var(--retro-green-dark)' : 'var(--border)'}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 8, fontWeight: 900, flexShrink: 0,
      }}
    >
      {state === 'done' ? '✓' : ''}
    </span>
  )
}

export default function TodayTenCard({ tasks, dailyMinutes = 10, childName, streakCount = 0 }: {
  tasks: TodayLoopTask[]
  dailyMinutes?: number
  childName?: string
  streakCount?: number
}) {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  const cardRef = useRef<HTMLDivElement>(null)
  // The same celebration the path strip had: a step finished since the last
  // look at Home gets its half second of delight. Same localStorage key, so
  // nothing double fires across the redesign.
  const [celebrating, setCelebrating] = useState<string | null>(null)
  // The parent's daily budget, changeable right here, saved to the profile.
  const [minutes, setMinutes] = useState(dailyMinutes)

  const firstOpen = tasks.findIndex(t => !t.done)
  const allDone = firstOpen === -1
  const currentIndex = allDone ? tasks.length - 1 : firstOpen
  const steps = tasks.filter(t => t.key !== 'done')
  const doneCount = steps.filter(t => t.done).length
  const investedMinutes = steps.filter(t => t.done).reduce((sum, t) => sum + (TASK_MINUTES[t.key] ?? 0), 0)
  const dayDone = investedMinutes >= minutes || (steps.length > 0 && doneCount === steps.length)
  const toBudgetMin = Math.max(0, minutes - investedMinutes)
  const nextWeight = TASK_MINUTES[tasks[currentIndex].key] ?? 0
  const pressure = !dayDone && !allDone

  function pickMinutes(m: number) {
    setMinutes(m)
    fetch('/api/daily-minutes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes: m }),
    }).catch(() => { /* the choice still holds for this view */ })
  }

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tween = gsap.fromTo(
      card,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
    )
    return () => { tween.kill() }
  }, [])

  useEffect(() => {
    // Spot the steps completed since the parent last looked at Home today.
    const today = new Date().toDateString()
    const doneKeys = tasks.filter(t => t.key !== 'done' && t.done).map(t => t.key)
    let seen: { date: string; keys: string[] } = { date: today, keys: [] }
    try {
      const raw = localStorage.getItem('gc_todaypath_seen')
      if (raw) seen = JSON.parse(raw)
    } catch { /* fresh start */ }
    const newly = seen.date === today ? doneKeys.filter(k => !seen.keys.includes(k)) : []
    localStorage.setItem('gc_todaypath_seen', JSON.stringify({ date: today, keys: doneKeys }))
    if (newly.length === 0) return

    const last = newly[newly.length - 1]
    const label = tasks.find(t => t.key === last)?.label ?? 'That'
    setCelebrating(label)
    const clear = setTimeout(() => setCelebrating(null), 2800)

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && cardRef.current) {
      const dots = newly
        .map(k => cardRef.current!.querySelector(`[data-ten-dot="${k}"]`))
        .filter(Boolean)
      if (dots.length) {
        gsap.fromTo(dots, { scale: 1 }, { scale: 1.5, duration: 0.28, yoyo: true, repeat: 1, ease: 'back.out(2.4)', delay: 0.5, stagger: 0.1 })
      }
    }
    return () => clearTimeout(clear)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={cardRef}
      style={{
        background: '#fff', border: '2px solid var(--terracotta)', borderRadius: '20px',
        padding: '18px 16px', boxShadow: '0 5px 0 rgba(201,154,40,0.25)', marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          Your {minutesWord(minutes)} minutes today
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {steps.map((t, i) => (
            <Dot key={t.key} dataKey={t.key} state={t.done ? 'done' : i === currentIndex && pressure ? 'now' : 'ahead'} />
          ))}
        </span>
      </div>

      {celebrating && (
        <div style={{
          display: 'inline-block', marginBottom: 10,
          background: 'var(--terracotta)', color: 'var(--ink)',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '11.5px',
          padding: '5px 12px', borderRadius: '100px',
          boxShadow: '0 3px 10px rgba(237,195,95,0.4)',
        }}>
          {celebrating} done, lovely 🎉
        </div>
      )}

      {pressure ? (
        <>
          <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '22px', color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            Next: {tasks[currentIndex].label}
          </p>
          <p style={{ margin: '5px 0 14px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            {nextHint(tasks[currentIndex].key)}. About {nextWeight} {nextWeight === 1 ? 'minute' : 'minutes'}.
          </p>
          <Link
            href={tasks[currentIndex].href}
            style={{
              display: 'block', width: '100%', textAlign: 'center', textDecoration: 'none',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)',
              background: 'var(--terracotta)', border: 'none', borderRadius: '16px', padding: '15px 0',
              boxShadow: '0 5px 0 var(--terracotta-dark)', cursor: 'pointer',
            }}
          >
            Do it now
          </Link>
          {/* The same minutes line the path strip carried, word for word */}
          <p style={{ margin: '11px 0 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--ink-muted)' }}>
            {investedMinutes + nextWeight >= minutes
              ? `last of your ${minutes} min`
              : investedMinutes > 0
              ? `${investedMinutes} min done today, about ${toBudgetMin} more to your ${minutes}`
              : `about ${toBudgetMin} min to your ${minutes} min`}
          </p>
        </>
      ) : !allDone ? (
        <>
          <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '22px', color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            That is your {minutes} minutes, day done 🎉
          </p>
          <p style={{ margin: '5px 0 12px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            You are readier for {kid} today than yesterday.{streakCount >= 2 ? ` ${streakCount} days in a row now.` : ''} Streak safe, the rest waits for tomorrow. Got a spare minute?
          </p>
          <Link
            href={tasks[currentIndex].href}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
              color: 'var(--terracotta-dark)', textDecoration: 'none',
            }}
          >
            Keep going: {tasks[currentIndex].label} →
          </Link>
        </>
      ) : (
        <>
          <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '22px', color: 'var(--ink)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            Day complete, streak safe
          </p>
          <p style={{ margin: '5px 0 14px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            You understood a moment and you have the words. That is the day.
          </p>
          <Link
            href="/dashboard/tracker"
            style={{
              display: 'block', width: '100%', textAlign: 'center', textDecoration: 'none',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)',
              background: 'var(--terracotta)', borderRadius: '16px', padding: '13px 0',
              boxShadow: '0 5px 0 var(--terracotta-dark)',
            }}
          >
            See what it moved →
          </Link>
        </>
      )}

      {/* The budget, kept from the strip: the day counts as done at whichever
          size the parent picks, so a five minute day still keeps the streak. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '13px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, color: 'var(--ink-light)' }}>
          I have
        </span>
        {[5, 10, 15].map(m => {
          const on = m === minutes
          return (
            <button
              key={m}
              onClick={() => pickMinutes(m)}
              aria-pressed={on}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
                padding: '4px 11px', borderRadius: '100px', cursor: 'pointer',
                border: on ? '1.5px solid var(--terracotta)' : '1.5px solid var(--border)',
                background: on ? 'var(--terracotta-lt)' : '#fff',
                color: on ? 'var(--terracotta-dark)' : 'var(--ink-muted)',
                transition: 'all 0.15s',
              }}
            >
              {m} min
            </button>
          )
        })}
      </div>
    </div>
  )
}
