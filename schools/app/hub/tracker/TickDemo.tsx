'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { STEPS, STEP_ORDER, type StepDef } from '@gc/shared/schools-progress'

// WATCH A LESSON TICK ITSELF.
//
// Justin, 18 September 2026: "can we have a demo animation of how they tick as
// you do lessons". The tracker already explained itself in a paragraph, and a
// paragraph about a thing that ticks is a worse explanation than the thing
// ticking. A subject lead deciding whether this is real evidence wants to see
// the mechanism, once, in about twelve seconds.
//
// BUILT FROM THE PRODUCT, NOT FROM A SCRIPT. The steps, their claims and the
// signal that ticks each one all come from shared/schools-progress.ts, which
// is the same file the real tracker reads. A demo with its own hand written
// list is a demo that lies the first time a step changes. The two `yours`
// steps are excluded because they are a teacher's word rather than something
// the product can see, and a demo that ticked them would be claiming a
// detector that does not exist.
//
// IT IS LABELLED AS A DEMO, twice, because a panel of green ticks beside a
// panel of real green ticks is the one thing that could make the real one
// worthless.

const DEMO_STEPS: StepDef[] = STEP_ORDER.map(id => STEPS[id]).filter(s => s.kind === 'auto')

// Long enough to read the signal line, short enough that nobody leaves.
const BEAT_MS = 1400

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase',
}

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function TickDemo() {
  // Server render and first paint show the finished state, so a visitor who
  // never gets the timeline (no JS, reduced motion, a screenshot) still sees
  // what the tracker is claiming rather than an empty checklist.
  const [lit, setLit] = useState(DEMO_STEPS.length)
  const [running, setRunning] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const stop = () => {
    if (timer.current) { clearInterval(timer.current); timer.current = null }
    setRunning(false)
  }

  const play = () => {
    stop()
    if (reduced()) { setLit(DEMO_STEPS.length); return }
    setLit(0)
    setRunning(true)
    let i = 0
    timer.current = setInterval(() => {
      i += 1
      setLit(i)
      if (i >= DEMO_STEPS.length) stop()
    }, BEAT_MS)
  }

  // Play once when the demo first comes into view, which is the only moment it
  // is worth anything. An animation that has already finished above the fold
  // is a static list with extra code.
  useEffect(() => {
    const el = root.current
    if (!el || reduced() || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { io.disconnect(); play() }
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); stop() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The pop on the tick that just landed. Nothing else moves, because seven
  // rows all animating is a loading screen rather than a mechanism.
  useEffect(() => {
    if (!lit || reduced()) return
    const tick = root.current?.querySelector(`[data-tick="${lit - 1}"]`)
    if (!tick) return
    const tl = gsap.timeline()
    tl.fromTo(tick, { scale: 0.4 }, { scale: 1, duration: 0.28, ease: 'back.out(2.4)' })
    return () => { tl.kill() }
  }, [lit])

  const done = lit >= DEMO_STEPS.length

  return (
    <div ref={root} className="no-print" style={{
      background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)',
      padding: 'var(--space-4)', marginBottom: 'var(--space-5)',
      boxShadow: '0 1px 2px rgba(23,60,70,0.04), 0 12px 32px -18px rgba(23,60,70,0.28)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: '4px' }}>
        <span style={{ ...mono, color: 'var(--green-dark)' }}>Demo, not your data</span>
        <span style={{ ...mono, color: 'var(--ink-light)', letterSpacing: '0.06em', textTransform: 'none', fontWeight: 600 }}>
          one lesson, start to finish
        </span>
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.2 }}>
        Watch a lesson tick itself
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '560px', margin: '0 0 14px' }}>
        Nothing here is tapped by a teacher. Each line ticks when the thing beside it actually happens,
        which is why the green is worth something when your subject lead reads it.
      </p>

      <ol aria-live="polite" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {DEMO_STEPS.map((s, i) => {
          const on = i < lit
          return (
            <li key={s.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
              padding: 'var(--space-2) 0', borderTop: i ? '1px solid var(--border)' : 'none',
              opacity: on ? 1 : 0.45, transition: 'opacity var(--dur-move) var(--ease)',
            }}>
              <span data-tick={i} aria-hidden style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: on ? 'var(--retro-green)' : '#fff',
                border: `2px solid ${on ? 'var(--retro-green)' : 'var(--border)'}`,
                color: '#fff', fontSize: 13, fontWeight: 900,
              }}>{on ? '✓' : ''}</span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.3 }}>
                  {s.claim}
                </span>
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, marginTop: '1px' }}>
                  ticked by {s.signal}
                </span>
              </span>
            </li>
          )
        })}
      </ol>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: '14px' }}>
        <span style={{
          ...mono, fontSize: 'var(--text-xs)',
          color: done ? 'var(--green-dark)' : 'var(--ink-muted)',
          background: done ? 'var(--green-lt)' : 'transparent',
          borderRadius: 'var(--radius-pill)', padding: done ? 'var(--space-1) var(--space-3)' : 'var(--space-1) 0',
        }}>
          {done ? 'Lesson green' : `${lit} of ${DEMO_STEPS.length} done`}
        </span>
        <button
          type="button"
          onClick={play}
          disabled={running}
          className="gc-tap"
          style={{
            marginLeft: 'auto', background: 'transparent', color: 'var(--green-dark)',
            border: '1.5px solid var(--green-dark)', borderRadius: 'var(--radius-btn)',
            padding: 'var(--space-2) var(--space-4)', minHeight: 44, cursor: running ? 'default' : 'pointer',
            opacity: running ? 0.5 : 1,
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
          }}
        >
          {running ? 'Ticking…' : 'Play it again'}
        </button>
      </div>
    </div>
  )
}
