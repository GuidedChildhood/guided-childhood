'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import DigiCharacter from '../DigiCharacter'
import { WALL } from '../../wall-scale'

// The interactive layer: the eighth slide type. A lesson row names a
// component by key and passes config; the code lives here so a new
// interaction in one module is instantly available to all 21 (rule 6:
// content in the database, code in the app). Every interaction is tap
// based (projector and touch friendly, no drag), GSAP only, and has a
// described paper twin in the teacher notes for the no device room.

// --terracotta is the butter FILL: it is right behind dark ink on a button and
// wrong as ink itself. This eyebrow names what the class is about to do
// ("Signal meter, tap what you would do") and it measured 1.57:1 on cream,
// which is not a low contrast label, it is a barely visible one. The dark
// accent is the token meant for text, and it is the one the classroom variant
// re-points, so this label follows the wall scale up as well.
const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}

// Checked at animation time so a settings change is honoured immediately.
// Under reduced motion each interaction jumps to its finished state or
// paces itself with text instead of movement; the teaching point always
// still lands, because the words carry it, not the spin.
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ── verdict-sort ──────────────────────────────────────────────────────
// Post cards the class flicks into verdict piles. Tap a card, tap a
// verdict, it flies to the pile and the tally animates. The core detective
// drill for module 12 and its cousins.
type SortPost = { handle: string; avatar: string; text: string; answer: number; why?: string }
function VerdictSort({ config }: {
  config: {
    verdicts?: string[]
    posts?: SortPost[]
    // The three labels were hardcoded for the teen misinformation module,
    // which meant a Reception class sorting real from made up was told it
    // was "sorting the feed" and congratulated as a detective. Same drill,
    // wrong words. They are config now, with the old text as the default,
    // so module 12 is untouched and every other age can speak its own
    // language.
    label?: string
    doneTitle?: string
    doneBody?: string
    doneEmoji?: string
  }
}) {
  const verdicts = config.verdicts ?? ['Believe', 'Pause', 'Do not share']
  const posts = config.posts ?? []
  const label = config.label ?? 'Sort the feed · tap a verdict'
  const doneTitle = config.doneTitle ?? 'Feed sorted!'
  const doneBody = config.doneBody ?? 'Every card got a verdict and a reason. That is the whole skill.'
  const doneEmoji = config.doneEmoji ?? '🕵️'
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
    if (cardRef.current && !prefersReducedMotion()) {
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
    if (cardRef.current && !done && !prefersReducedMotion()) gsap.fromTo(cardRef.current, { opacity: 0, y: 20, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.4)' })
  }, [index, done])

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ ...eyebrow, marginBottom: '10px' }}>{label}</div>
      {/* Tallies */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '18px', flexWrap: 'wrap' }}>
        {verdicts.map((v, i) => (
          <span key={v} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
            color: 'var(--ink)', background: 'var(--stage-1)', border: '1.5px solid var(--stage-1-bold)',
            borderRadius: '100px', padding: '6px 14px',
          }}>
            {v} · {tallies[i]}
          </span>
        ))}
      </div>

      {done ? (
        <div style={{ padding: '30px 0' }}>
          <div style={{ fontSize: 'var(--text-3xl)', marginBottom: '8px' }}>{doneEmoji}</div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)', marginBottom: '4px' }}>{doneTitle}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)' }}>{doneBody}</p>
        </div>
      ) : (
        <>
          <div ref={cardRef} style={{
            maxWidth: '400px', margin: '0 auto 18px', background: '#fff',
            border: '1.5px solid var(--border)', borderRadius: '20px', padding: '16px 18px',
            boxShadow: '0 6px 0 var(--border)', textAlign: 'left',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--stage-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)', flexShrink: 0 }}>{post.avatar}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>{post.handle}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>{index + 1} of {posts.length}</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.55 }}>{post.text}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {verdicts.map((v, i) => (
              <button key={v} onClick={() => pick(i)} disabled={picked !== null} style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', cursor: 'pointer',
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
    if (!barRef.current) return
    const width = `${Math.min(100, (signal / max) * 100)}%`
    if (prefersReducedMotion()) { barRef.current.style.width = width; return }
    gsap.to(barRef.current, { width, duration: 0.5, ease: 'power2.out' })
  }, [signal, max])

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ ...eyebrow, marginBottom: '10px' }}>Signal meter · tap what you would do</div>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.1rem, 2.6vw, 1.4rem)', color: 'var(--ink)', lineHeight: 1.35, maxWidth: '440px', margin: '0 auto 18px' }}>
        Every tap tells the feed &ldquo;more like this&rdquo;. Watch which taps shout loudest.
      </p>
      <div role="meter" aria-label="Signal strength" aria-valuemin={0} aria-valuemax={max} aria-valuenow={signal}
        style={{ height: '22px', borderRadius: '100px', background: 'var(--border)', overflow: 'hidden', maxWidth: '440px', margin: '0 auto 18px' }}>
        <div ref={barRef} style={{ height: '100%', width: '0%', borderRadius: '100px', background: 'linear-gradient(90deg, var(--terracotta), var(--coral, #D4600A))' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', maxWidth: '440px', margin: '0 auto' }}>
        {actions.map(a => (
          <button key={a.label} onClick={() => tap(a.weight)} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', cursor: 'pointer',
            color: 'var(--ink)', background: '#fff', border: '2px solid var(--border)', borderRadius: '16px',
            padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center',
          }}>
            <span style={{ fontSize: 'var(--text-xl)' }}>{a.emoji}</span>
            {a.label}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>+{a.weight} signal</span>
          </button>
        ))}
      </div>
      {config.caption && <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '420px', margin: '18px auto 0' }}>{config.caption}</p>}
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
    if (prefersReducedMotion()) {
      // The star holds still and the words keep the class breathing in time.
      const timer = setInterval(() => {
        setPhase(p => (p === 'Breathe in' ? 'Breathe out' : 'Breathe in'))
      }, dur * 1000)
      return () => { clearInterval(timer) }
    }
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
      {/* "Breathe in" / "Breathe out": the one word the room is following, so
          it takes the accent meant for text rather than the button fill. */}
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.3rem, 3.4vw, 1.8rem)', color: 'var(--terracotta-dark)', letterSpacing: '-0.01em' }}>
        {phase}
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', marginTop: '6px' }}>
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
    if (prefersReducedMotion()) {
      // No spinning dot: jump straight to the closed bubble, the words
      // underneath explain the four laps that just happened.
      setLap(laps)
      setBubbled(true)
      if (ringRef.current) gsap.set(ringRef.current, { scale: 1, opacity: 1 })
      return
    }
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
      {/* The node cards hang half outside the circle (translate -50%), so the
          box needs real margin above and below or the bottom card sits on
          top of the start button and eats its taps. Found the day feed-loop
          finally entered a lesson (migration 259). */}
      <div style={{ position: 'relative', width: '260px', height: '260px', margin: '40px auto 52px' }}>
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
            <div style={{ fontSize: 'var(--text-lg)' }}>{n.emoji}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.25 }}>{n.label}</div>
          </div>
        ))}
      </div>
      {bubbled ? (
        <>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--coral, #D4600A)', marginBottom: '4px' }}>
            The bubble just closed.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink-soft)', maxWidth: '380px', margin: '0 auto 14px', lineHeight: 1.6 }}>
            Four laps, each faster than the last, and now the feed only shows more of the same. Knowing the recipe is how you open it back up.
          </p>
          <button onClick={reset} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', cursor: 'pointer', color: 'var(--ink)', background: '#fff', border: '2px solid var(--border)', borderRadius: '14px', padding: '11px 20px' }}>
            Run it again
          </button>
        </>
      ) : (
        <button onClick={start} disabled={running} style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', cursor: 'pointer',
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
    const outrageEnd = calm ? 235 : 240
    const honestEnd = calm ? 210 : 110
    const dur = 3
    const counters = { o: 0, h: 0 }
    const oTarget = calm ? 3100 : 9600
    const hTarget = calm ? 2600 : 1400
    if (prefersReducedMotion()) {
      // The finish line photograph instead of the race: same gap, no motion.
      gsap.set(outrageRef.current, { x: outrageEnd })
      gsap.set(honestRef.current, { x: honestEnd })
      setShares({ outrage: oTarget, honest: hTarget })
      setPhase(calm ? 'calmDone' : 'done')
      return
    }
    setPhase('racing')
    setShares({ outrage: 0, honest: 0 })
    gsap.set([outrageRef.current, honestRef.current], { x: 0 })
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
            <span style={{ fontSize: 'var(--text-xl)' }}>😡</span>
            <span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>THEY are lying to you!!</span>
              {/* THE SHARE COUNTS, which are the whole point of the race and
                  were the two least readable things in the deck. The palette
                  consolidation aliased --coral-dark to the amber accent and
                  --green-dark to the butter FILL, so the outrage count read
                  2.58:1 and the honest count 1.67:1 on white, and the two
                  sides had quietly become the same colour anyway. Amber and
                  the deep sky ink are both already in the system, both clear
                  AAA on white, and they give the race back its two sides.
                  Named directly rather than through the aliases: an alias
                  resolves at :root, so the classroom variant cannot reach it. */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--terracotta-dark)', fontWeight: 700 }}>↻ {shares.outrage.toLocaleString()}</span>
            </span>
          </div>
        </div>
        <div style={lane}>
          <div ref={honestRef} style={racer}>
            <span style={{ fontSize: 'var(--text-xl)' }}>📰</span>
            <span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink)' }}>Careful, sourced report</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--stage-2-text)', fontWeight: 700 }}>↻ {shares.honest.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </div>
      {phase === 'ready' && (
        <button onClick={() => run(false)} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', cursor: 'pointer', color: 'var(--ink)', background: 'var(--terracotta)', border: 'none', borderRadius: '14px', padding: '12px 24px', boxShadow: '0 4px 0 var(--terracotta-dark, #C99A28)' }}>
          Run the race
        </button>
      )}
      {phase === 'done' && (
        <>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', maxWidth: '400px', margin: '0 auto 12px', lineHeight: 1.6 }}>
            <strong>The outrage post wins by miles.</strong> Not because it is true, because reactions are the fuel. Now calm the reactions: what if people paused instead of raging?
          </p>
          <button onClick={() => run(true)} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', cursor: 'pointer', color: '#fff', background: 'var(--green-dark, #2E7D5A)', border: 'none', borderRadius: '14px', padding: '12px 24px', boxShadow: '0 4px 0 rgba(0,0,0,0.2)' }}>
            Calm the reactions, race again
          </button>
        </>
      )}
      {dampened && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
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
              <button onClick={() => bump(i, -1)} aria-label={`One fewer for ${opt}`} style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1.5px solid var(--border)', background: '#fff', fontWeight: 900, fontSize: 'var(--text-lg)', cursor: 'pointer', color: 'var(--ink-muted)', flexShrink: 0 }}>−</button>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{opt}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-muted)' }}>{counts[i]}</span>
                </div>
                <div style={{ height: '12px', borderRadius: '100px', background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, borderRadius: '100px', background: 'linear-gradient(90deg, var(--terracotta), var(--coral, #D4600A))', transition: 'width 0.45s cubic-bezier(0.22,1,0.36,1)' }} />
                </div>
              </div>
              <button onClick={() => bump(i, 1)} aria-label={`One more for ${opt}`} style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: 'var(--terracotta)', fontWeight: 900, fontSize: 'var(--text-xl)', cursor: 'pointer', color: 'var(--ink)', boxShadow: '0 3px 0 var(--terracotta-dark, #C99A28)', flexShrink: 0 }}>+</button>
            </div>
          )
        })}
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginTop: '14px' }}>
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

// PROJECTOR, THE SECOND ATTEMPT, and the first one is worth recording because
// it looked right and was not.
//
// Every widget sizes its TYPE from the design tokens, so the wall version was
// one override of those tokens on this wrapper: 41 font sizes fixed at once,
// no hand edits, and each widget keeping the type ratios its layout depends
// on. That much was true. What it missed is that the widgets size their BOXES
// in pixels, because they were drawn for a phone. Multiplying the text by 2.5
// and leaving a 170px card at 170px does not make a big card, it makes a card
// with the words falling out of it. On a 1920 wall the signal meter pushed its
// fourth option off the bottom of the screen and the spread race clipped both
// posts mid word. Neither could fail a typecheck and neither showed up in a
// contrast reading, because the colours were perfect. Only a screenshot found
// them.
//
// So the wall version zooms the whole widget instead. zoom scales the layout
// AND the space it takes, so every proportion the designer chose survives
// exactly and there is nothing per widget to keep in sync. The factor is the
// same 2.5 the token override used, chosen so the body text lands on the 40px
// ISO 9241 floor (shared/wall-scale.ts).
//
// The token override is gone rather than kept alongside: with zoom the text
// would scale twice.
// 2.5 is the factor that lands the widget's body text on the 40px ISO 9241
// floor. It is a CEILING, not a setting, because measuring the six widgets at
// a flat 2.5 showed three of them running past the bottom of a 1920x1080 wall
// and all six past a 1366x768 laptop, which is half the teacher laptops in the
// country. A slide the class has to scroll is a slide that stops.
const WALL_ZOOM_MAX = 2.5

// FIT THE ROOM, then be as large as the room allows.
//
// These widgets are drawn as tall phone layouts, so the honest answer on a wall
// is not one number. It is: measure the space this slide actually has, measure
// what the widget naturally needs, and take the largest zoom that still fits.
//
// GETTING THE BUDGET, which took three wrong attempts to measure.
//
//   - The stage's scrollHeight does NOT give the content height. The column
//     inside it is flex:1 with justifyContent center, so it stretches to the
//     full stage whatever it holds: scrollHeight reads exactly clientHeight and
//     the first version of this solved for a zoom of 1.00 every time.
//   - offsetHeight ignores zoom entirely. It read 429px at 1.0, at 1.5 and at
//     2.5, so any arithmetic mixing it with a painted height is wrong.
//   - getBoundingClientRect() is the painted height, and scrollHeight does tell
//     the truth once the content actually overflows.
//
// So: probe at the ceiling. If the widget fits there, take the ceiling. If it
// overflows, the overflow says exactly how tall the rest of the slide is, and
// the rest is fixed, so one division gives the zoom that lands flush.
function useFitZoom(enabled: boolean) {
  const box = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)

  useLayoutEffect(() => {
    if (!enabled) { setZoom(1); return }
    const el = box.current
    if (!el) return
    let measuring = false

    // Measuring means writing zoom, so the DOM is left wherever the last probe
    // put it. Every exit writes the answer to the element as well as to state:
    // when the computed zoom matches the state React does not re-render, and
    // the element would otherwise keep the probe's value. That is exactly how
    // this first shipped stuck at the ceiling with the widget hanging off the
    // bottom of the wall.
    const apply = (z: number) => {
      el.style.zoom = String(z)
      setZoom(z)
    }

    const fit = () => {
      if (measuring) return
      measuring = true
      try {
        let stage: HTMLElement | null = el.parentElement
        while (stage && !['auto', 'scroll'].includes(getComputedStyle(stage).overflowY)) {
          stage = stage.parentElement
        }
        if (!stage) { apply(WALL_ZOOM_MAX); return }

        const paintedAt = (z: number) => {
          el.style.zoom = String(z)
          return el.getBoundingClientRect().height
        }
        const spill = () => stage.scrollHeight - stage.clientHeight

        // Start at the ceiling and come down until it fits. Everything else on
        // the slide keeps its height whatever the zoom, so a spill of o painted
        // pixels means the widget has to lose exactly o: that is one division,
        // and it would be the whole answer if the widgets did not reflow. They
        // do (a card that fits on one line at 1.7 wraps to two at 2.5), so this
        // refines instead of trusting the first division, and it lands within a
        // pixel or two in three passes.
        let z = WALL_ZOOM_MAX
        for (let pass = 0; pass < 4; pass++) {
          const painted = paintedAt(z)
          const over = spill()
          if (over <= 0 || painted <= 0) break
          // 2px of slack so it lands just under rather than just over.
          const next = z * ((painted - over - 2) / painted)
          if (!Number.isFinite(next) || next >= z) break
          z = Math.max(1, next)
          if (z <= 1) break
        }
        apply(Math.max(1, Math.min(WALL_ZOOM_MAX, z)))
      } finally {
        measuring = false
      }
    }

    fit()
    // Content can arrive late (a webfont, an emoji, a widget's own state), and
    // a budget measured before it lands is the wrong budget.
    const ro = new ResizeObserver(() => { if (!measuring) fit() })
    ro.observe(el)
    if (el.parentElement) ro.observe(el.parentElement)
    window.addEventListener('resize', fit)
    return () => { ro.disconnect(); window.removeEventListener('resize', fit) }
  }, [enabled])

  return { box, zoom }
}

export default function Interactive({ component, config, caption, projector }: { component: string; config?: Record<string, unknown>; caption?: string; projector?: boolean }) {
  const Comp = INTERACTIVES[component]
  const { box, zoom } = useFitZoom(!!projector)
  // The zoom rides on the wrapper, so it reaches the fallback path too. A
  // widget key that arrives ahead of a deploy degrades to its caption, and
  // that caption is on the same wall as everything else.
  const wall: React.CSSProperties | undefined = projector ? { zoom } : undefined

  if (!Comp) {
    // Unknown key: degrade to the caption so an ahead of deploy database never breaks a lesson.
    return caption
      ? <p style={{ ...wall, fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink)', textAlign: 'center', padding: '20px' }}>{caption}</p>
      : null
  }
  return (
    <div>
      <div ref={box} style={wall}><Comp config={config ?? {}} /></div>
      {/* The caption stays outside the zoom and takes the player's own wall
          scale: it is the teacher's instruction to the room, not part of the
          widget, and it should match every other line of prose on the wall. */}
      {caption && <p style={{ fontFamily: 'var(--font-body)', fontSize: projector ? WALL.body : 'var(--text-base)', color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.6, maxWidth: projector ? WALL.column : '420px', margin: '18px auto 0' }}>{caption}</p>}
    </div>
  )
}
