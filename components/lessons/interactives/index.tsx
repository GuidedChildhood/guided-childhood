'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import DigiCharacter from '@/components/digi/DigiCharacter'

// The interactive layer: the eighth slide type. A lesson row names a
// component by key and passes config; the code lives here so a new
// interaction in one module is instantly available to all 21 (rule 6:
// content in the database, code in the app). Every interaction is tap
// based (projector and touch friendly, no drag), GSAP only, and has a
// described paper twin in the teacher notes for the no device room.

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)',
}

// ── verdict-sort ──────────────────────────────────────────────────────
// Post cards the class flicks into verdict piles. Tap a card, tap a
// verdict, it flies to the pile and the tally animates. The core detective
// drill for module 12 and its cousins.
type SortPost = { handle: string; avatar: string; text: string; answer: number; why?: string }
function VerdictSort({ config }: { config: { verdicts?: string[]; posts?: SortPost[] } }) {
  const verdicts = config.verdicts ?? ['Believe', 'Pause', 'Do not share']
  const posts = config.posts ?? []
  const [index, setIndex] = useState(0)
  const [tallies, setTallies] = useState<number[]>(verdicts.map(() => 0))
  const [picked, setPicked] = useState<number | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const post = posts[index]
  const done = index >= posts.length

  const pick = (v: number) => {
    if (picked !== null || !post) return
    setPicked(v)
    setTallies(t => t.map((n, i) => (i === v ? n + 1 : n)))
    const dir = v === 0 ? -1 : v === verdicts.length - 1 ? 1 : 0
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        x: dir * 320, y: -40, rotate: dir * 12, opacity: 0, scale: 0.8,
        duration: 0.5, ease: 'power2.in',
        onComplete: () => { setPicked(null); setIndex(i => i + 1) },
      })
    } else {
      setPicked(null); setIndex(i => i + 1)
    }
  }

  useEffect(() => {
    if (cardRef.current && !done) gsap.fromTo(cardRef.current, { opacity: 0, y: 20, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' })
  }, [index, done])

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ ...eyebrow, marginBottom: '10px' }}>Sort the feed · tap a verdict</div>
      {/* Tallies */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '18px', flexWrap: 'wrap' }}>
        {verdicts.map((v, i) => (
          <span key={v} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px',
            color: 'var(--ink)', background: 'var(--stage-1)', border: '1.5px solid var(--stage-1-bold)',
            borderRadius: '100px', padding: '6px 14px',
          }}>
            {v} · {tallies[i]}
          </span>
        ))}
      </div>

      {done ? (
        <div style={{ padding: '30px 0' }}>
          <div style={{ fontSize: '38px', marginBottom: '8px' }}>🕵️</div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.3rem', color: 'var(--ink)', marginBottom: '4px' }}>Feed sorted!</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-soft)' }}>Every card got a verdict and a reason. That is the whole skill.</p>
        </div>
      ) : (
        <>
          <div ref={cardRef} style={{
            maxWidth: '400px', margin: '0 auto 18px', background: '#fff',
            border: '1.5px solid var(--border)', borderRadius: '20px', padding: '16px 18px',
            boxShadow: '0 6px 0 var(--border)', textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--stage-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{post.avatar}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '14px', color: 'var(--ink)' }}>{post.handle}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)' }}>{index + 1} of {posts.length}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.55 }}>{post.text}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {verdicts.map((v, i) => (
              <button key={v} onClick={() => pick(i)} disabled={picked !== null} style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', cursor: 'pointer',
                color: '#fff', background: i === 0 ? 'var(--green-dark)' : i === verdicts.length - 1 ? 'var(--coral, #D4600A)' : 'var(--terracotta)',
                border: 'none', borderRadius: '14px', padding: '12px 18px',
                boxShadow: '0 4px 0 rgba(0,0,0,0.18)', opacity: picked !== null ? 0.5 : 1,
              }}>
                {v}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── signal-meter ──────────────────────────────────────────────────────
// Tap an action, the signal bar grows by that action's weight. The point
// lands itself: watch time and rewatches dwarf a like. Feeds the algorithm
// literacy modules.
type SignalAction = { label: string; weight: number; emoji: string }
function SignalMeter({ config }: { config: { actions?: SignalAction[]; caption?: string } }) {
  const actions = config.actions ?? [
    { label: 'Like', weight: 1, emoji: '❤️' },
    { label: 'Comment', weight: 3, emoji: '💬' },
    { label: 'Watch to the end', weight: 8, emoji: '👀' },
    { label: 'Watch it again', weight: 12, emoji: '🔁' },
  ]
  const [signal, setSignal] = useState(0)
  const max = actions.reduce((s, a) => s + a.weight, 0) * 2
  const barRef = useRef<HTMLDivElement>(null)

  const tap = (w: number) => setSignal(s => Math.min(max, s + w))
  useEffect(() => {
    if (barRef.current) gsap.to(barRef.current, { width: `${Math.min(100, (signal / max) * 100)}%`, duration: 0.5, ease: 'power2.out' })
  }, [signal, max])

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ ...eyebrow, marginBottom: '10px' }}>Signal meter · tap what you would do</div>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.1rem, 2.6vw, 1.4rem)', color: 'var(--ink)', lineHeight: 1.35, maxWidth: '440px', margin: '0 auto 18px' }}>
        Every tap tells the feed &ldquo;more like this&rdquo;. Watch which taps shout loudest.
      </p>
      <div style={{ height: '22px', borderRadius: '100px', background: 'var(--border)', overflow: 'hidden', maxWidth: '440px', margin: '0 auto 18px' }}>
        <div ref={barRef} style={{ height: '100%', width: '0%', borderRadius: '100px', background: 'linear-gradient(90deg, var(--terracotta), var(--coral, #D4600A))' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', maxWidth: '440px', margin: '0 auto' }}>
        {actions.map(a => (
          <button key={a.label} onClick={() => tap(a.weight)} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', cursor: 'pointer',
            color: 'var(--ink)', background: '#fff', border: '2px solid var(--border)', borderRadius: '16px',
            padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center',
          }}>
            <span style={{ fontSize: '22px' }}>{a.emoji}</span>
            {a.label}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)' }}>+{a.weight} signal</span>
          </button>
        ))}
      </div>
      {config.caption && <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '420px', margin: '18px auto 0' }}>{config.caption}</p>}
    </div>
  )
}

// ── star-breath ───────────────────────────────────────────────────────
// DiGi Junior, the golden star, breathing on a 4 second cycle. The calm
// pause companion, usable in every module.
function StarBreath({ config }: { config: { seconds?: number } }) {
  const dur = config.seconds ?? 4
  const starRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState('Breathe in')

  useEffect(() => {
    if (!starRef.current) return
    const tl = gsap.timeline({ repeat: -1 })
    tl.to(starRef.current, { scale: 1.35, duration: dur, ease: 'sine.inOut', onStart: () => setPhase('Breathe in') })
      .to(starRef.current, { scale: 1, duration: dur, ease: 'sine.inOut', onStart: () => setPhase('Breathe out') })
    return () => { tl.kill() }
  }, [dur])

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ ...eyebrow, marginBottom: '20px' }}>Star breath · everyone together</div>
      <div ref={starRef} style={{ display: 'inline-flex', margin: '10px 0 24px', transformOrigin: 'center' }}>
        <DigiCharacter mood="idle" size={110} />
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.3rem, 3.4vw, 1.8rem)', color: 'var(--terracotta)', letterSpacing: '-0.01em' }}>
        {phase}
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-soft)', marginTop: '6px' }}>
        Follow the star. In as it grows, out as it shrinks.
      </p>
    </div>
  )
}

// ── feed-loop ─────────────────────────────────────────────────────────
// The feedback loop drawn live: watch, signal, more of the same, watch
// more. Each lap runs faster, and after four laps the bubble closes
// around the loop. The algorithm literacy centrepiece.
function FeedLoop({ config }: { config: { laps?: number } }) {
  const laps = config.laps ?? 4
  const [running, setRunning] = useState(false)
  const [lap, setLap] = useState(0)
  const [bubbled, setBubbled] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const NODES = [
    { emoji: '👀', label: 'You watch', top: '0%', left: '50%' },
    { emoji: '📡', label: 'The feed learns', top: '50%', left: '100%' },
    { emoji: '📦', label: 'More of the same', top: '100%', left: '50%' },
    { emoji: '🔁', label: 'You watch more', top: '50%', left: '0%' },
  ]

  const start = () => {
    if (running || bubbled || !dotRef.current) return
    setRunning(true)
    const R = 110
    const tl = gsap.timeline({
      onComplete: () => {
        setRunning(false)
        setBubbled(true)
        if (ringRef.current) {
          gsap.fromTo(ringRef.current, { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' })
        }
      },
    })
    for (let i = 0; i < laps; i++) {
      const dur = Math.max(0.5, 2.2 - i * 0.55) // each lap faster
      tl.to(dotRef.current, {
        motionPath: undefined, // keep dependency free: rotate a wrapper instead
        duration: 0,
      })
      tl.to(wrapRef.current, {
        rotation: `+=360`, duration: dur, ease: 'none',
        onStart: () => setLap(i + 1),
      })
    }
  }

  const reset = () => {
    setBubbled(false); setLap(0)
    if (ringRef.current) gsap.set(ringRef.current, { opacity: 0 })
    if (wrapRef.current) gsap.set(wrapRef.current, { rotation: 0 })
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ ...eyebrow, marginBottom: '10px' }}>The feed loop · watch it close</div>
      <div style={{ position: 'relative', width: '260px', height: '260px', margin: '10px auto 18px' }}>
        {/* Bubble ring, appears at the end */}
        <div ref={ringRef} style={{
          position: 'absolute', inset: '-16px', borderRadius: '50%',
          border: '3px solid var(--coral, #D4600A)', opacity: 0, pointerEvents: 'none',
        }} />
        {/* Track */}
        <div style={{ position: 'absolute', inset: '18px', borderRadius: '50%', border: '2px dashed var(--border)' }} />
        {/* Rotating dot */}
        <div ref={wrapRef} style={{ position: 'absolute', inset: 0 }}>
          <div ref={dotRef} style={{
            position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)',
            width: '26px', height: '26px', borderRadius: '50%',
            background: 'var(--terracotta)', boxShadow: '0 3px 0 rgba(0,0,0,0.2)',
          }} />
        </div>
        {/* Nodes */}
        {NODES.map(n => (
          <div key={n.label} style={{
            position: 'absolute', top: n.top, left: n.left, transform: 'translate(-50%, -50%)',
            background: '#fff', border: '1.5px solid var(--border)', borderRadius: '14px',
            padding: '8px 10px', width: '108px',
          }}>
            <div style={{ fontSize: '18px' }}>{n.emoji}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '10.5px', color: 'var(--ink)', lineHeight: 1.25 }}>{n.label}</div>
          </div>
        ))}
      </div>
      {bubbled ? (
        <>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', color: 'var(--coral, #D4600A)', marginBottom: '4px' }}>
            The bubble just closed.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-soft)', maxWidth: '380px', margin: '0 auto 14px', lineHeight: 1.6 }}>
            Four laps, each faster than the last, and now the feed only shows more of the same. Knowing the recipe is how you open it back up.
          </p>
          <button onClick={reset} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', cursor: 'pointer', color: 'var(--ink)', background: '#fff', border: '2px solid var(--border)', borderRadius: '14px', padding: '11px 20px' }}>
            Run it again
          </button>
        </>
      ) : (
        <button onClick={start} disabled={running} style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', cursor: 'pointer',
          color: 'var(--ink)', background: 'var(--terracotta)', border: 'none', borderRadius: '14px',
          padding: '12px 24px', boxShadow: '0 4px 0 var(--terracotta-dark, #C99A28)', opacity: running ? 0.6 : 1,
        }}>
          {running ? `Lap ${lap} of ${laps}...` : 'Start watching'}
        </button>
      )}
    </div>
  )
}

// ── spread-race ───────────────────────────────────────────────────────
// Two posts race across the screen, the outrage one pulling ahead. Then
// the class calms the reactions and re runs it: the race tightens. The
// point about engineered outrage, made kinetic.
function SpreadRace({ config }: { config: { calm?: boolean } }) {
  const [phase, setPhase] = useState<'ready' | 'racing' | 'done' | 'calmDone'>('ready')
  const [shares, setShares] = useState({ outrage: 0, honest: 0 })
  const outrageRef = useRef<HTMLDivElement>(null)
  const honestRef = useRef<HTMLDivElement>(null)
  const dampened = phase === 'calmDone'

  const run = (calm: boolean) => {
    if (!outrageRef.current || !honestRef.current) return
    setPhase('racing')
    setShares({ outrage: 0, honest: 0 })
    gsap.set([outrageRef.current, honestRef.current], { x: 0 })
    const outrageEnd = calm ? 235 : 240
    const honestEnd = calm ? 210 : 110
    const dur = 3
    const counters = { o: 0, h: 0 }
    const oTarget = calm ? 3100 : 9600
    const hTarget = calm ? 2600 : 1400
    gsap.to(counters, {
      o: oTarget, h: hTarget, duration: dur, ease: 'power1.in',
      onUpdate: () => setShares({ outrage: Math.round(counters.o), honest: Math.round(counters.h) }),
    })
    gsap.to(outrageRef.current, { x: outrageEnd, duration: dur, ease: calm ? 'power1.inOut' : 'power2.in' })
    gsap.to(honestRef.current, {
      x: honestEnd, duration: dur, ease: 'power1.inOut',
      onComplete: () => setPhase(calm ? 'calmDone' : 'done'),
    })
  }

  const lane: React.CSSProperties = { position: 'relative', height: '64px', background: 'var(--warm, #fff)', border: '1.5px solid var(--border)', borderRadius: '16px', marginBottom: '10px', overflow: 'hidden' }
  const racer: React.CSSProperties = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '8px', display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '7px 10px', width: '170px' }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ ...eyebrow, marginBottom: '10px' }}>The spread race · same day, two posts</div>
      <div style={{ maxWidth: '460px', margin: '0 auto 14px', textAlign: 'left' }}>
        <div style={lane}>
          <div ref={outrageRef} style={racer}>
            <span style={{ fontSize: '20px' }}>😡</span>
            <span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '11px', color: 'var(--ink)' }}>THEY are lying to you!!</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--coral, #D4600A)', fontWeight: 700 }}>↻ {shares.outrage.toLocaleString()}</span>
            </span>
          </div>
        </div>
        <div style={lane}>
          <div ref={honestRef} style={racer}>
            <span style={{ fontSize: '20px' }}>📰</span>
            <span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '11px', color: 'var(--ink)' }}>Careful, sourced report</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--green-dark, #2E7D5A)', fontWeight: 700 }}>↻ {shares.honest.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </div>
      {phase === 'ready' && (
        <button onClick={() => run(false)} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', cursor: 'pointer', color: 'var(--ink)', background: 'var(--terracotta)', border: 'none', borderRadius: '14px', padding: '12px 24px', boxShadow: '0 4px 0 var(--terracotta-dark, #C99A28)' }}>
          Run the race
        </button>
      )}
      {phase === 'done' && (
        <>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink)', maxWidth: '400px', margin: '0 auto 12px', lineHeight: 1.6 }}>
            <strong>The outrage post wins by miles.</strong> Not because it is true, because reactions are the fuel. Now calm the reactions: what if people paused instead of raging?
          </p>
          <button onClick={() => run(true)} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', cursor: 'pointer', color: '#fff', background: 'var(--green-dark, #2E7D5A)', border: 'none', borderRadius: '14px', padding: '12px 24px', boxShadow: '0 4px 0 rgba(0,0,0,0.2)' }}>
            Calm the reactions, race again
          </button>
        </>
      )}
      {dampened && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
          <strong>Look at the race now.</strong> When people pause instead of react, the fake loses its engine. Your pause is not nothing, it is the brake.
        </p>
      )}
    </div>
  )
}

// ── class-tally ───────────────────────────────────────────────────────
// The whole class check for no device rooms: the teacher taps hands
// counted per option and the bars animate. Works in every module.
function ClassTally({ config }: { config: { question?: string; options?: string[] } }) {
  const question = config.question ?? 'What does the class think?'
  const options = config.options ?? ['Yes', 'Not sure', 'No']
  const [counts, setCounts] = useState<number[]>(options.map(() => 0))
  const total = counts.reduce((a, b) => a + b, 0)

  const bump = (i: number, d: number) =>
    setCounts(c => c.map((n, j) => (j === i ? Math.max(0, n + d) : n)))

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ ...eyebrow, marginBottom: '10px' }}>Class tally · hands up, teacher taps</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.15rem, 2.8vw, 1.45rem)', color: 'var(--ink)', lineHeight: 1.35, maxWidth: '460px', margin: '0 auto 20px' }}>
        {question}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '440px', margin: '0 auto' }}>
        {options.map((opt, i) => {
          const pct = total > 0 ? (counts[i] / total) * 100 : 0
          return (
            <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => bump(i, -1)} aria-label={`One fewer for ${opt}`} style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1.5px solid var(--border)', background: '#fff', fontWeight: 900, fontSize: '16px', cursor: 'pointer', color: 'var(--ink-muted)', flexShrink: 0 }}>−</button>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)' }}>{opt}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--ink-muted)' }}>{counts[i]}</span>
                </div>
                <div style={{ height: '12px', borderRadius: '100px', background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, borderRadius: '100px', background: 'linear-gradient(90deg, var(--terracotta), var(--coral, #D4600A))', transition: 'width 0.45s cubic-bezier(0.22,1,0.36,1)' }} />
                </div>
              </div>
              <button onClick={() => bump(i, 1)} aria-label={`One more for ${opt}`} style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: 'var(--terracotta)', fontWeight: 900, fontSize: '20px', cursor: 'pointer', color: 'var(--ink)', boxShadow: '0 3px 0 var(--terracotta-dark, #C99A28)', flexShrink: 0 }}>+</button>
            </div>
          )
        })}
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', marginTop: '14px' }}>
        {total} hand{total === 1 ? '' : 's'} counted
      </p>
    </div>
  )
}

// The registry: lesson rows name a component by key.
const INTERACTIVES: Record<string, React.ComponentType<{ config: Record<string, unknown> }>> = {
  'verdict-sort': VerdictSort as React.ComponentType<{ config: Record<string, unknown> }>,
  'signal-meter': SignalMeter as React.ComponentType<{ config: Record<string, unknown> }>,
  'star-breath': StarBreath as React.ComponentType<{ config: Record<string, unknown> }>,
  'feed-loop': FeedLoop as React.ComponentType<{ config: Record<string, unknown> }>,
  'spread-race': SpreadRace as React.ComponentType<{ config: Record<string, unknown> }>,
  'class-tally': ClassTally as React.ComponentType<{ config: Record<string, unknown> }>,
}

export default function Interactive({ component, config, caption }: { component: string; config?: Record<string, unknown>; caption?: string }) {
  const Comp = INTERACTIVES[component]
  if (!Comp) {
    // Unknown key: degrade to the caption so an ahead of deploy database never breaks a lesson.
    return caption ? <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', textAlign: 'center', padding: '20px' }}>{caption}</p> : null
  }
  return (
    <div>
      <Comp config={config ?? {}} />
      {caption && <p style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.6, maxWidth: '420px', margin: '18px auto 0' }}>{caption}</p>}
    </div>
  )
}
