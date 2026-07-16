'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import DigiCharacter from '@/components/digi/DigiCharacter'
import type { TodayLoopTask } from '@/lib/pathway/daily-tasks'

// Today's loop as a horizontal five node path strip: the seed of the
// full node path home. Done nodes fill in their pastel with a tick, the
// current node glows butter with DiGi standing on it, future nodes wait
// in grey. Every node is a link straight to its task.

const NODE_SIZE = 46
// Room above each node for DiGi plus the new instruction bubble stacked
// on top of the character, so neither ever clips the header above.
const TOP_OFFSET = 72

// What each step actually involves, shown in the Next banner so the
// parent knows what they are walking into before they tap. The wording
// follows the clock: the same step reads differently at breakfast and at
// bedtime, so the path always feels like it belongs to this moment.
function nextHint(key: TodayLoopTask['key']): string {
  const hour = new Date().getHours()
  const daypart = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
  const hints: Record<TodayLoopTask['key'], Record<string, string>> = {
    checkin: {
      morning: 'Start the day: thirty seconds on how yesterday’s worry went',
      afternoon: 'Thirty seconds on how yesterday’s worry went',
      evening: 'Before the day closes: how did yesterday’s worry go?',
    },
    moment: {
      morning: 'Two minutes with today’s cards, best before the day runs off',
      afternoon: 'Two minutes with today’s cards',
      evening: 'Two minutes with today’s cards while the kettle boils',
    },
    script: {
      morning: 'Today’s words, ready for the after school moment',
      afternoon: 'The words for the tricky moment coming after school',
      evening: 'Tonight’s words for the wind down, ready to read',
    },
    digi: {
      morning: 'Ask DiGi the thing on your mind before the day starts',
      afternoon: 'Ask DiGi one question about your day',
      evening: 'Tell DiGi how today actually went',
    },
    done: {
      morning: 'Tap to see your progress',
      afternoon: 'Tap to see your progress',
      evening: 'Tap to see your progress',
    },
  }
  return hints[key][daypart]
}

const NODE_LOOK: Record<TodayLoopTask['key'], { fill: string; tick: string; icon: string }> = {
  checkin: { fill: 'var(--tint-sage)',    tick: 'var(--ink)',          icon: '🪴' },
  moment:  { fill: 'var(--stage-1-bold)', tick: 'var(--stage-1-text)', icon: '☀️' },
  script:  { fill: 'var(--stage-2-bold)', tick: 'var(--stage-2-text)', icon: '💬' },
  digi:    { fill: 'var(--stage-5-bold)', tick: 'var(--stage-5-text)', icon: '✦' },
  done:    { fill: 'var(--stage-3-bold)', tick: 'var(--stage-3-text)', icon: '🏁' },
}

// How many steps count as a full day at each budget. Five minutes is one
// small thing, and that is genuinely enough to keep the streak. Ten and
// fifteen ask for a little more, for the days there is room.
const STEPS_FOR_MINUTES: Record<number, number> = { 5: 1, 10: 2, 15: 3 }

export default function TodayPathStrip({ tasks, dailyMinutes = 10 }: { tasks: TodayLoopTask[]; dailyMinutes?: number }) {
  const stripRef = useRef<HTMLDivElement>(null)
  // The celebration: a step finished since the last look at Home gets a half
  // second of delight, the node pops and DiGi says so. The evidence from the
  // big pathway apps is that these tiny moments are what compound into
  // retention. Tracked per day in localStorage, so it fires once per win.
  const [celebrating, setCelebrating] = useState<string | null>(null)

  // The parent's daily budget. The day is counted done when they have spent
  // it, not when every step is ticked, so a short day still keeps the streak
  // and the steps they did not reach simply wait for tomorrow. Never a guilt.
  const [minutes, setMinutes] = useState(dailyMinutes)
  const requiredCount = STEPS_FOR_MINUTES[minutes] ?? 2

  const firstOpen = tasks.findIndex(t => !t.done)
  const allDone = firstOpen === -1
  const currentIndex = allDone ? tasks.length - 1 : firstOpen
  // The Done flag is the finish line, not a step: count real steps only.
  const steps = tasks.filter(t => t.key !== 'done')
  const doneCount = steps.filter(t => t.done).length
  // The day is done once the budget is met, even if steps remain. Those
  // become optional bonus, not unfinished business.
  const dayDone = doneCount >= requiredCount
  const toBudget = Math.max(0, requiredCount - doneCount)
  // No pressure once the budget is met: DiGi stops pointing and just smiles.
  const pressure = !dayDone && !allDone
  const centre = (i: number) => ((i + 0.5) / tasks.length) * 100

  function pickMinutes(m: number) {
    setMinutes(m)
    fetch('/api/daily-minutes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes: m }),
    }).catch(() => { /* the choice still holds for this view */ })
  }

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const nodes = strip.querySelectorAll('[data-path-node]')
    const tween = gsap.fromTo(
      nodes,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: 'power2.out', delay: 0.15 }
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

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && stripRef.current) {
      const nodes = newly
        .map(k => stripRef.current!.querySelector(`[data-node-key="${k}"]`))
        .filter(Boolean)
      if (nodes.length) {
        gsap.fromTo(nodes, { scale: 1 }, { scale: 1.22, duration: 0.28, yoyo: true, repeat: 1, ease: 'back.out(2.4)', delay: 0.6, stagger: 0.1 })
      }
    }
    return () => clearTimeout(clear)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid var(--border)',
      borderRadius: '20px',
      padding: '18px 16px 16px',
      marginBottom: '20px',
    }}>
      <style>{`
        @keyframes todaypath-pulse {
          0%   { transform: scale(1);    opacity: 0.55; }
          70%  { transform: scale(1.45); opacity: 0;    }
          100% { transform: scale(1.45); opacity: 0;    }
        }
        .todaypath-pulse-ring {
          animation: todaypath-pulse 1.8s ease-out infinite;
        }
        @keyframes todaypath-throb {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 0 5px var(--terracotta-lt), 0 0 10px 1px rgba(224,122,63,0.35); }
          50%      { transform: scale(1.1);  box-shadow: 0 0 0 8px var(--terracotta-lt), 0 0 20px 6px rgba(224,122,63,0.6);  }
        }
        .todaypath-throb {
          animation: todaypath-throb 1.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .todaypath-pulse-ring { animation: none; opacity: 0.35; }
          .todaypath-throb { animation: none; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', padding: '0 4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          Today&apos;s path
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: dayDone ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>
          {dayDone ? 'Today done' : `${doneCount} of ${requiredCount}`}
        </span>
      </div>

      {/* The budget: how much the parent has today. The day counts as done at
          whichever size they pick, so a five minute day still keeps the
          streak. Quiet, tappable, never a demand. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', padding: '0 4px' }}>
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

      <div ref={stripRef} style={{ position: 'relative', paddingTop: `${TOP_OFFSET}px` }}>
        {/* DiGi stands above the node the parent is on. When a step is still
            waiting today, DiGi keeps bouncing, says Click me, and IS the tap
            target, dropping straight onto the thing to do next. When the day is
            done or a win just landed, DiGi bounces once, celebrates and settles,
            and stops being a button so nothing nags. Clamped to the visible
            width so the bubble never runs off the edge at the first or last. */}
        {(() => {
          const nudging = pressure && !celebrating
          const wrapStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${Math.min(82, Math.max(18, centre(currentIndex)))}%`,
            top: `${TOP_OFFSET}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: nudging ? 'auto' : 'none',
            cursor: nudging ? 'pointer' : 'default',
            textDecoration: 'none',
            zIndex: 2,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
          }
          const inner = (
            <>
              {(celebrating || pressure) && (
                <span style={{
                  background: celebrating ? 'var(--terracotta)' : 'var(--terracotta-lt)',
                  color: 'var(--ink)',
                  border: celebrating ? 'none' : '1.5px solid var(--terracotta)',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '10.5px',
                  padding: '5px 10px', borderRadius: '100px', whiteSpace: 'nowrap',
                  boxShadow: '0 3px 10px rgba(237,195,95,0.35)',
                  marginBottom: '2px', transition: 'background 0.3s',
                }}>
                  {celebrating ? `${celebrating} done, lovely 🎉` : '👆 Click me, do this next'}
                </span>
              )}
              <DigiCharacter mood={celebrating || !pressure ? 'happy' : 'idle'} size={38} once={!pressure && !celebrating} />
            </>
          )
          return nudging
            ? <Link href={tasks[currentIndex].href} aria-label={`Do this next: ${tasks[currentIndex].label}`} style={wrapStyle}>{inner}</Link>
            : <div style={wrapStyle}>{inner}</div>
        })()}

        {/* Connector line, with the walked part in butter */}
        <div style={{
          position: 'absolute',
          top: `${TOP_OFFSET + NODE_SIZE / 2 - 2}px`,
          left: `${centre(0)}%`,
          right: `${100 - centre(tasks.length - 1)}%`,
          height: '4px',
          borderRadius: '4px',
          background: 'var(--border)',
        }}>
          {/* Walked part in pastel gold: butter stays reserved for the
              current node and CTAs, the past keeps the softer tint */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0,
            width: `${(currentIndex / (tasks.length - 1)) * 100}%`,
            borderRadius: '4px',
            background: 'var(--stage-1-bold)',
          }} />
        </div>

        <div style={{ display: 'flex' }}>
          {tasks.map((task, i) => {
            const look = NODE_LOOK[task.key]
            const isCurrent = i === currentIndex && pressure
            const isDoneNode = task.done
            return (
              <Link
                key={task.key}
                href={task.href}
                data-path-node
                aria-label={isDoneNode ? `${task.label}, done` : isCurrent ? `${task.label}, up next` : task.label}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '7px',
                  textDecoration: 'none',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <div data-node-key={task.key} style={{ position: 'relative', width: NODE_SIZE, height: NODE_SIZE }}>
                  {isCurrent && (
                    <div
                      className="todaypath-pulse-ring"
                      style={{
                        position: 'absolute', inset: '-4px',
                        borderRadius: '50%',
                        border: '3px solid var(--terracotta)',
                      }}
                    />
                  )}
                  <div
                    className={isCurrent ? 'todaypath-throb' : undefined}
                    style={{
                      width: '100%', height: '100%',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDoneNode ? look.fill : '#fff',
                      border: isDoneNode
                        ? '2.5px solid ' + look.fill
                        : isCurrent
                        ? '3px solid var(--terracotta)'
                        : '2.5px solid var(--border)',
                      boxShadow: isCurrent ? '0 0 0 5px var(--terracotta-lt)' : 'none',
                      fontSize: '17px',
                      filter: !isDoneNode && !isCurrent ? 'grayscale(1) opacity(0.55)' : 'none',
                    }}
                  >
                    {isDoneNode ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 12.5l4.5 4.5L19 7.5" stroke={look.tick} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span aria-hidden="true" style={task.key === 'digi' ? { color: 'var(--terracotta)', fontWeight: 800 } : undefined}>
                        {look.icon}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: isCurrent ? 700 : 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: isCurrent ? 'var(--ink)' : isDoneNode ? 'var(--ink-soft)' : 'var(--ink-muted)',
                  textAlign: 'center',
                  lineHeight: 1.35,
                  maxWidth: '100%',
                  padding: '0 3px',
                }}>
                  {task.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Three ways the day ends. While the budget is unmet, the next step is
          named with an unmissable Go, counted down to the minutes the parent
          chose, not to all five steps. Once the budget is met the day is
          declared done and the streak safe, with anything left offered as a
          gentle bonus and never as a debt. When every step is done, the warm
          full house line. */}
      {pressure ? (
        <Link
          href={tasks[currentIndex].href}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
            marginTop: '14px', padding: '12px 14px',
            background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
            borderRadius: '14px', textDecoration: 'none',
          }}
        >
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>
              Next: {tasks[currentIndex].label}
              <span style={{ color: 'var(--ink-muted)', fontWeight: 500 }}>
                {' '}· {toBudget === 1 ? `last of your ${minutes} min` : `${toBudget} to your ${minutes} min`}
              </span>
            </span>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--ink-soft)', marginTop: '2px' }}>
              {nextHint(tasks[currentIndex].key)}
            </span>
          </span>
          <span style={{
            flexShrink: 0, background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: '12px', padding: '9px 16px',
            fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800,
            boxShadow: '0 3px 0 var(--terracotta-dark)',
          }}>
            Go
          </span>
        </Link>
      ) : !allDone ? (
        <div style={{
          marginTop: '14px', padding: '13px 15px',
          background: 'var(--tint-sage)', borderRadius: '14px',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)' }}>
            That is your {minutes} minutes, day done 🎉
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: '3px' }}>
            Streak safe. The rest waits for tomorrow, no rush. Got a spare minute and want to carry on?
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
      ) : (
        <Link
          href="/dashboard/tracker"
          style={{
            display: 'block', marginTop: '14px', textAlign: 'center', textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)',
          }}
        >
          Day complete, streak safe. <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)' }}>See what it moved →</span>
        </Link>
      )}
    </div>
  )
}
