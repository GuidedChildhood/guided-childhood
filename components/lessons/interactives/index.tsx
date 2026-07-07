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

// The registry: lesson rows name a component by key.
const INTERACTIVES: Record<string, React.ComponentType<{ config: Record<string, unknown> }>> = {
  'verdict-sort': VerdictSort as React.ComponentType<{ config: Record<string, unknown> }>,
  'signal-meter': SignalMeter as React.ComponentType<{ config: Record<string, unknown> }>,
  'star-breath': StarBreath as React.ComponentType<{ config: Record<string, unknown> }>,
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
