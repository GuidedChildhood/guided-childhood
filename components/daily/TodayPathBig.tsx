'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import DigiCharacter from '@/components/digi/DigiCharacter'
import type { TodayLoopTask } from '@/lib/pathway/daily-tasks'
import { TASK_MINUTES } from '@/lib/pathway/task-minutes'
import { nextHint } from '@/components/daily/TodayPathStrip'

// Today's loop as the BIG vertical winding path, Duolingo sized: the same
// engine as TodayPathStrip (same tasks, same minute budget, same copy), only
// rendered tall. Fat circular nodes with the pressed 3D edge, a gentle left
// and right meander, done nodes filled green with big ticks, the current node
// ringed and gently pulsing with DiGi sitting beside it, and the action
// callout riding right next to the current node with one big butter Go.

const NODE = 68
// The gentle meander, in pixels from the centre line, one offset per node in
// walking order. Small enough that a 390px phone never clips a node.
const MEANDER = [-58, 42, -48, 52, 0]
// The connector drawing space between rows: a fixed size SVG so the curve
// between two known offsets is exact on every screen width.
const GAP_W = 280
const GAP_H = 46

// The green of a done step: the win colour the approved sample used, with its
// darker shade carrying the pressed edge.
const GREEN = '#2F8F6B'
const GREEN_DARK = '#236F52'

const NODE_ICON: Record<TodayLoopTask['key'], string> = {
  checkin: '🪴', moment: '☀️', script: '💬', digi: '✦', done: '🏁',
}

function Connector({ fromX, toX, walked }: { fromX: number; toX: number; walked: boolean }) {
  const cx = GAP_W / 2
  const x1 = cx + fromX
  const x2 = cx + toX
  return (
    <div aria-hidden style={{ position: 'relative', height: GAP_H, overflow: 'visible' }}>
      <svg
        width={GAP_W}
        height={GAP_H}
        viewBox={`0 0 ${GAP_W} ${GAP_H}`}
        style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'block', overflow: 'visible' }}
      >
        <path
          d={`M ${x1} ${-NODE / 2} C ${x1} ${GAP_H * 0.7}, ${x2} ${GAP_H * 0.3}, ${x2} ${GAP_H + NODE / 2}`}
          fill="none"
          stroke={walked ? 'var(--stage-1-bold)' : 'var(--border)'}
          strokeWidth={10}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export default function TodayPathBig({ tasks, dailyMinutes = 10, childName, streakCount = 0 }: { tasks: TodayLoopTask[]; dailyMinutes?: number; childName?: string; streakCount?: number }) {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  const pathRef = useRef<HTMLDivElement>(null)
  // A step finished since the last look at Home gets its half second of
  // delight, exactly as the strip did: the node pops and DiGi says so.
  const [celebrating, setCelebrating] = useState<string | null>(null)

  // The parent's daily budget, same engine as the strip: the day is counted
  // done when the chosen minutes are spent, never when every step is ticked.
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
    const el = pathRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const nodes = el.querySelectorAll('[data-path-node]')
    const tween = gsap.fromTo(
      nodes,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out', delay: 0.15 }
    )
    return () => { tween.kill() }
  }, [])

  useEffect(() => {
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

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && pathRef.current) {
      const nodes = newly
        .map(k => pathRef.current!.querySelector(`[data-node-key="${k}"]`))
        .filter(Boolean)
      if (nodes.length) {
        gsap.fromTo(nodes, { scale: 1 }, { scale: 1.18, duration: 0.28, yoyo: true, repeat: 1, ease: 'back.out(2.4)', delay: 0.6, stagger: 0.1 })
      }
    }
    return () => clearTimeout(clear)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The exact minute line the strip's Go banner carried, unchanged.
  const minuteLine = investedMinutes + nextWeight >= minutes
    ? `last of your ${minutes} min`
    : investedMinutes > 0
      ? `${investedMinutes} min done today, about ${toBudgetMin} more to your ${minutes}`
      : `about ${toBudgetMin} min to your ${minutes} min`

  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid var(--border)',
      borderRadius: '20px',
      padding: '18px 16px 18px',
      marginBottom: '20px',
    }}>
      <style>{`
        @keyframes todaypathbig-pulse {
          0%   { transform: scale(1);    opacity: 0.55; }
          70%  { transform: scale(1.35); opacity: 0;    }
          100% { transform: scale(1.35); opacity: 0;    }
        }
        .todaypathbig-pulse-ring { animation: todaypathbig-pulse 1.8s ease-out infinite; }
        @keyframes todaypathbig-throb {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        .todaypathbig-throb { animation: todaypathbig-throb 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .todaypathbig-pulse-ring { animation: none; opacity: 0.35; }
          .todaypathbig-throb { animation: none; }
        }
      `}</style>

      {/* The point of the day, one line, same words as ever */}
      <div style={{ padding: '0 4px', marginBottom: '12px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '19px', color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.2, margin: '0 0 3px' }}>
          {dayDone ? 'Today, sorted' : `Today with ${kid}`}
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.45, margin: 0 }}>
          {dayDone
            ? 'You understood a moment and you have the words. That is the day.'
            : 'Understand one moment, and walk away with the exact words for it.'}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '0 4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          {dayDone ? 'Today' : 'Today · do this next'}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: dayDone ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>
          {dayDone ? 'All done ✓' : `${investedMinutes} of ${minutes} min`}
        </span>
      </div>

      {/* The budget, now as big friendly icon chips: the same three choices,
          the same promise (a five minute day still keeps the streak), just a
          proper thumb sized tap. */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
        {([[5, '⚡', 'A quick day'], [10, '☀️', 'The usual'], [15, '🌙', 'Room to go deep']] as const).map(([m, icon, hint]) => {
          const on = m === minutes
          return (
            <button
              key={m}
              onClick={() => pickMinutes(m)}
              aria-pressed={on}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                padding: '10px 6px 9px', borderRadius: '14px', cursor: 'pointer',
                border: on ? '2px solid var(--terracotta)' : '2px solid var(--border)',
                background: on ? 'var(--terracotta-lt)' : '#fff',
                boxShadow: on ? '0 3px 0 var(--terracotta-dark)' : '0 3px 0 var(--border)',
                transition: 'all 0.15s',
              }}
            >
              <span aria-hidden style={{ fontSize: '18px', lineHeight: 1, filter: on ? 'none' : 'grayscale(1) opacity(0.6)' }}>{icon}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: on ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>
                {m} min
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--ink-muted)', lineHeight: 1.1 }}>{hint}</span>
            </button>
          )
        })}
      </div>

      {/* The big path itself: down the middle with a gentle meander */}
      <div ref={pathRef} style={{ position: 'relative', paddingTop: 14 }}>
        {tasks.map((task, i) => {
          const x = MEANDER[i % MEANDER.length]
          const isCurrent = i === currentIndex && !allDone
          const isDoneNode = task.done
          const showCallout = isCurrent && pressure
          // DiGi sits on whichever side of the current node has the room.
          const digiOnRight = x <= 0
          return (
            <div key={task.key}>
              {i > 0 && (
                <Connector
                  fromX={MEANDER[(i - 1) % MEANDER.length]}
                  toX={x}
                  walked={tasks[i - 1].done}
                />
              )}

              <div data-path-node style={{ position: 'relative' }}>
                <Link
                  href={task.href}
                  aria-label={isDoneNode ? `${task.label}, done` : isCurrent ? `${task.label}, up next` : task.label}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                    textDecoration: 'none', width: 'fit-content', margin: '0 auto',
                    transform: `translateX(${x}px)`, position: 'relative', zIndex: 1,
                  }}
                >
                  <div data-node-key={task.key} className={isCurrent ? 'todaypathbig-throb' : undefined} style={{ position: 'relative', width: NODE, height: NODE }}>
                    {isCurrent && (
                      <div
                        className="todaypathbig-pulse-ring"
                        style={{ position: 'absolute', inset: '-6px', borderRadius: '50%', border: '4px solid var(--terracotta)' }}
                      />
                    )}
                    <div
                      style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isDoneNode ? GREEN : isCurrent ? '#fff' : 'var(--cream)',
                        border: isDoneNode ? 'none' : isCurrent ? '3px solid var(--terracotta)' : '2.5px solid var(--border)',
                        boxShadow: isDoneNode
                          ? `0 5px 0 ${GREEN_DARK}`
                          : isCurrent
                            ? '0 5px 0 var(--terracotta-dark), 0 0 0 6px var(--terracotta-lt)'
                            : '0 5px 0 var(--border)',
                        fontSize: '26px',
                        filter: !isDoneNode && !isCurrent ? 'grayscale(1) opacity(0.5)' : 'none',
                      }}
                    >
                      {isDoneNode ? (
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span aria-hidden="true" style={task.key === 'digi' ? { color: 'var(--terracotta)', fontWeight: 800 } : undefined}>
                          {NODE_ICON[task.key]}
                        </span>
                      )}
                    </div>

                    {/* DiGi sits beside the current node, the guide on the road */}
                    {isCurrent && (
                      <div style={{
                        position: 'absolute', top: '50%',
                        [digiOnRight ? 'left' : 'right']: NODE + 8,
                        transform: 'translateY(-58%)', zIndex: 2, pointerEvents: 'none',
                      }}>
                        <DigiCharacter mood={celebrating || !pressure ? 'happy' : 'idle'} size={48} once={!pressure && !celebrating} />
                      </div>
                    )}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    fontWeight: isCurrent ? 700 : 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: isCurrent ? 'var(--ink)' : isDoneNode ? 'var(--ink-soft)' : 'var(--ink-muted)',
                    textAlign: 'center', lineHeight: 1.3,
                  }}>
                    {task.label}
                  </span>
                </Link>

                {/* The celebration bubble, when a win just landed */}
                {isCurrent && celebrating && (
                  <span style={{
                    position: 'absolute', top: -12, left: '50%',
                    transform: `translateX(calc(-50% + ${x}px))`,
                    background: 'var(--terracotta)', color: 'var(--ink)',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '11px',
                    padding: '5px 11px', borderRadius: '100px', whiteSpace: 'nowrap',
                    boxShadow: '0 3px 10px rgba(237,195,95,0.4)', zIndex: 3,
                  }}>
                    {celebrating} done, lovely 🎉
                  </span>
                )}
              </div>

              {/* The action callout rides right next to the current node: the
                  exact next step, the honest minute line, and one big Go. */}
              {showCallout && (
                <div style={{ position: 'relative', marginTop: 14 }}>
                  <span aria-hidden style={{
                    position: 'absolute', top: -9, left: '50%',
                    transform: `translateX(calc(-50% + ${x}px)) rotate(45deg)`,
                    width: 16, height: 16, background: '#fff',
                    borderTop: '2px solid var(--terracotta)', borderLeft: '2px solid var(--terracotta)',
                  }} />
                  <div style={{
                    background: '#fff', border: '2px solid var(--terracotta)', borderRadius: 16,
                    padding: '14px 14px 14px', boxShadow: '0 5px 0 rgba(201,154,40,0.25)',
                  }}>
                    <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '18px', color: 'var(--ink)', lineHeight: 1.2 }}>
                      Next: {tasks[currentIndex].label}
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-muted)', fontWeight: 500 }}>
                        {' '}· {minuteLine}
                      </span>
                    </p>
                    <p style={{ margin: '4px 0 12px', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                      {nextHint(tasks[currentIndex].key)}
                    </p>
                    <Link
                      href={tasks[currentIndex].href}
                      style={{
                        display: 'block', textAlign: 'center', textDecoration: 'none',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px',
                        color: 'var(--ink)', background: 'var(--terracotta)',
                        border: 'none', borderRadius: 16, padding: '14px 0',
                        boxShadow: '0 5px 0 var(--terracotta-dark)',
                      }}
                    >
                      Go
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* The two quieter endings, word for word from the strip: budget met but
          steps remain, and the full house. While a step is still due, the Go
          lives in the callout on the path above. */}
      {!pressure && !allDone ? (
        <div style={{
          marginTop: '16px', padding: '13px 15px',
          background: 'var(--tint-sage)', borderRadius: '14px',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)' }}>
            That is your {minutes} minutes, day done 🎉
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '3px' }}>
            You are readier for {kid} today than yesterday.{streakCount >= 2 ? ` ${streakCount} days in a row now.` : ''} Streak safe, the rest waits for tomorrow. Got a spare minute?
          </div>
          <Link
            href={tasks[currentIndex].href}
            style={{
              display: 'inline-block', marginTop: '9px',
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
              color: 'var(--terracotta-dark)', textDecoration: 'none',
            }}
          >
            Keep going: {tasks[currentIndex].label} →
          </Link>
        </div>
      ) : allDone ? (
        <Link
          href="/dashboard/tracker"
          style={{
            display: 'block', marginTop: '16px', textAlign: 'center', textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)',
          }}
        >
          Day complete, streak safe. <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)' }}>See what it moved →</span>
        </Link>
      ) : null}
    </div>
  )
}
