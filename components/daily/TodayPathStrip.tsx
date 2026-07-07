'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import DigiCharacter from '@/components/digi/DigiCharacter'
import type { TodayLoopTask } from '@/lib/pathway/daily-tasks'

// Today's loop as a horizontal five node path strip: the seed of the
// full node path home. Done nodes fill in their pastel with a tick, the
// current node glows butter with DiGi standing on it, future nodes wait
// in grey. Every node is a link straight to its task.

const NODE_SIZE = 46

// What each step actually involves, shown in the Next banner so the
// parent knows what they are walking into before they tap.
const NEXT_HINT: Record<TodayLoopTask['key'], string> = {
  checkin: 'Thirty seconds on how yesterday’s worry went, on the daily page',
  moment:  'Two minutes with today’s cards',
  script:  'Tonight’s words, picked for you, ready to read',
  digi:    'Ask DiGi one question about your day',
  done:    'Tap to see your progress',
}

const NODE_LOOK: Record<TodayLoopTask['key'], { fill: string; tick: string; icon: string }> = {
  checkin: { fill: 'var(--tint-sage)',    tick: 'var(--ink)',          icon: '🪴' },
  moment:  { fill: 'var(--stage-1-bold)', tick: 'var(--stage-1-text)', icon: '☀️' },
  script:  { fill: 'var(--stage-2-bold)', tick: 'var(--stage-2-text)', icon: '💬' },
  digi:    { fill: 'var(--stage-5-bold)', tick: 'var(--stage-5-text)', icon: '✦' },
  done:    { fill: 'var(--stage-3-bold)', tick: 'var(--stage-3-text)', icon: '🏁' },
}

export default function TodayPathStrip({ tasks }: { tasks: TodayLoopTask[] }) {
  const stripRef = useRef<HTMLDivElement>(null)

  const firstOpen = tasks.findIndex(t => !t.done)
  const allDone = firstOpen === -1
  const currentIndex = allDone ? tasks.length - 1 : firstOpen
  // The Done flag is the finish line, not a step: count real steps only.
  const steps = tasks.filter(t => t.key !== 'done')
  const doneCount = steps.filter(t => t.done).length
  const stepsLeft = steps.length - doneCount
  const centre = (i: number) => ((i + 0.5) / tasks.length) * 100

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
        @media (prefers-reduced-motion: reduce) {
          .todaypath-pulse-ring { animation: none; opacity: 0.35; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', padding: '0 4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
          Today&apos;s path
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: allDone ? 'var(--terracotta-dark)' : 'var(--ink-muted)' }}>
          {allDone ? 'All walked' : `${doneCount} of ${steps.length}`}
        </span>
      </div>

      <div ref={stripRef} style={{ position: 'relative', paddingTop: '40px' }}>
        {/* DiGi stands above the node the parent is on */}
        <div
          style={{
            position: 'absolute',
            left: `${centre(currentIndex)}%`,
            top: '40px',
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <DigiCharacter mood={allDone ? 'happy' : 'idle'} size={38} />
        </div>

        {/* Connector line, with the walked part in butter */}
        <div style={{
          position: 'absolute',
          top: `${40 + NODE_SIZE / 2 - 2}px`,
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
            const isCurrent = i === currentIndex && !allDone
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
                <div style={{ position: 'relative', width: NODE_SIZE, height: NODE_SIZE }}>
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
                  <div style={{
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
                  }}>
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

      {/* What finishes the day: the next step named, what it involves,
          and an unmissable Go */}
      {!allDone ? (
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
                {' '}· {stepsLeft === 1 ? 'last step of today' : `${stepsLeft} steps to finish today`}
              </span>
            </span>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--ink-soft)', marginTop: '2px' }}>
              {NEXT_HINT[tasks[currentIndex].key]}
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
      ) : (
        <p style={{
          marginTop: '14px', marginBottom: 0, textAlign: 'center',
          fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)',
        }}>
          Day complete. Your streak is safe, see you tomorrow.
        </p>
      )}
    </div>
  )
}
