'use client'

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import DigiCharacter from '@/components/digi/DigiCharacter'
import type { FishingGame } from '@/lib/quest-games/registry'

// ── fishing view ──────────────────────────────────────────────────────
// A pond of word fish for the quest game player. DiGi calls a word, the
// child taps the fish carrying it. Right catches wiggle and swim off with a
// sparkle, wrong taps dart away with a gentle nudge (the round never ends on
// a wrong tap). Play game.catches targets from the chosen phase, then call
// onDone once so the player awards the stars. The paper twin is the Word
// Fishing printable. Tap only, GSAP only, phonics safe wording only.
//
// FishingGame lives in lib/quest-games/registry.ts (same as CoinsGame and
// WheelGame) and joins the QuestGame union there:
//   export type FishingGame = QuestGameMeta & {
//     mechanic: 'fishing'
//     catches: number
//     phases: { id: string; label: string; words: string[] }[]
//   }

const FISH_W = 108

// The five house fish colours, straight from the Word Fishing printable.
// Coral and green are deep enough for white words, the rest take ink.
type FishPalette = { body: string; fin: string; text: string }
const PALETTES: FishPalette[] = [
  { body: '#EDC35F', fin: '#C99A28', text: 'var(--ink, #1A1A2E)' }, // butter
  { body: '#D8E8F8', fin: '#9FC0E4', text: 'var(--ink, #1A1A2E)' }, // tint blue
  { body: '#FBCFE8', fin: '#F09CC8', text: 'var(--ink, #1A1A2E)' }, // pastel pink
  { body: '#D4600A', fin: '#A84A06', text: '#FFFFFF' },             // coral
  { body: '#2F8F6B', fin: '#236F52', text: '#FFFFFF' },             // green
]

// Scatter slots as top left percentages, tuned so 108px fish never overlap.
const SLOTS = [
  { left: '4%', top: '5%' },
  { left: '53%', top: '3%' },
  { left: '29%', top: '38%' },
  { left: '3%', top: '58%' },
  { left: '55%', top: '55%' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Pick the round's target words, no back to back repeats where we can help it.
function pickTargets(words: string[], n: number): string[] {
  if (words.length === 0) return []
  const out: string[] = []
  let pool = shuffle(words)
  while (out.length < n) {
    if (pool.length === 0) pool = shuffle(words)
    const next = pool.shift() as string
    if (out.length > 0 && next === out[out.length - 1] && pool.length > 0) {
      pool.push(next)
      continue
    }
    out.push(next)
  }
  return out
}

type Fish = { id: string; word: string; pal: FishPalette; slot: { left: string; top: string } }

// The correct fish is always included, then 3 or 4 decoys from the same phase.
function buildFish(words: string[], targetWord: string, tIndex: number): Fish[] {
  const others = words.filter(w => w !== targetWord)
  const wantTotal = words.length >= 5 ? (Math.random() < 0.5 ? 4 : 5) : Math.min(4, words.length)
  const decoyCount = Math.min(wantTotal - 1, others.length)
  const decoys = shuffle(others).slice(0, decoyCount)
  const all = shuffle([targetWord, ...decoys])
  const pals = shuffle(PALETTES)
  const slots = shuffle(SLOTS).slice(0, all.length)
  return all.map((w, i) => ({ id: `${tIndex}-${i}-${w}`, word: w, pal: pals[i % pals.length], slot: slots[i] }))
}

function wordFont(word: string): number {
  const len = word.length
  if (len <= 1) return 30
  if (len === 2) return 23
  if (len === 3) return 18
  return 14.5
}

function pillLabel(p: { id: string; label: string }): string {
  if (p.id === 'phase-2') return 'Phase 2'
  if (p.id === 'phase-3') return 'Phase 3'
  if (p.id === 'letters') return 'First letters'
  return p.label
}

// The house fish: chunky ink outline, glinting eye, smile, blush, with the
// word riding on the body just past the eye.
function FishArt({ word, pal, showWord = true }: { word: string; pal: FishPalette; showWord?: boolean }) {
  const ink = 'var(--ink, #1A1A2E)'
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox="0 0 216 150" style={{ display: 'block', width: '100%', height: 'auto' }} aria-hidden="true">
        <path d="M150 75 C178 44 196 34 206 28 C202 52 202 98 206 122 C196 116 178 106 150 75 Z" fill={pal.fin} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
        <path d="M62 32 C74 8 112 6 128 27 C106 19 82 22 62 32 Z" fill={pal.fin} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
        <path d="M76 120 C86 142 114 143 126 122 C108 130 90 130 76 120 Z" fill={pal.fin} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
        <ellipse cx={94} cy={76} rx={72} ry={52} fill={pal.body} stroke={ink} strokeWidth={6} />
        <path d="M142 44 C154 62 154 90 142 108 M154 52 C162 66 162 86 154 100" fill="none" stroke={ink} strokeWidth={4} opacity={0.15} />
        <circle cx={44} cy={58} r={13} fill="#FFFFFF" stroke={ink} strokeWidth={5} />
        <circle cx={47.5} cy={60.5} r={6.5} fill={ink} />
        <circle cx={44} cy={55.5} r={2.6} fill="#FFFFFF" />
        <path d="M25 85 Q34 94 45 89" fill="none" stroke={ink} strokeWidth={4.5} strokeLinecap="round" />
        <ellipse cx={58} cy={90} rx={8} ry={5} fill={ink} opacity={0.1} />
      </svg>
      {showWord && (
        <span style={{
          position: 'absolute', left: '22%', top: '14%', width: '44%', height: '74%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, color: pal.text,
          fontSize: `${wordFont(word)}px`, lineHeight: 1, textAlign: 'center',
          letterSpacing: '0.01em', textTransform: 'none', pointerEvents: 'none',
        }}>
          {word}
        </span>
      )}
    </div>
  )
}

export function FishingView({ game, onDone }: { game: FishingGame; onDone: () => void }) {
  const phases = game.phases
  const catches = game.catches

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [targets, setTargets] = useState<string[]>(() => pickTargets(phases[0]?.words ?? [], catches))
  const [targetIndex, setTargetIndex] = useState(0)
  const [fish, setFish] = useState<Fish[]>([])
  const [feedback, setFeedback] = useState<{ text: string; tone: 'good' | 'soft' } | null>(null)
  const [roundKey, setRoundKey] = useState(0)

  const phase = phases[phaseIdx] ?? phases[0]
  const target = targets[targetIndex] ?? ''
  const isLetters = phase?.id === 'letters'

  const nodesRef = useRef<Record<string, HTMLDivElement | null>>({})
  const sparkRef = useRef<Record<string, HTMLSpanElement | null>>({})
  const tweensRef = useRef<gsap.core.Animation[]>([])
  const introducedRef = useRef<Set<string>>(new Set())
  const leavingRef = useRef<Set<string>>(new Set())
  const busyRef = useRef(false)
  const doneRef = useRef(false)

  const track = (t: gsap.core.Animation) => { tweensRef.current.push(t); return t }
  const killAll = () => { tweensRef.current.forEach(t => t.kill()); tweensRef.current = [] }

  function startRound(idx: number) {
    killAll()
    busyRef.current = false
    introducedRef.current = new Set()
    leavingRef.current = new Set()
    setPhaseIdx(idx)
    setTargets(pickTargets(phases[idx]?.words ?? [], catches))
    setTargetIndex(0)
    setFeedback(null)
    setFish([])
    setRoundKey(k => k + 1)
  }

  // Build the shoal for the current target. Runs on a fresh target or round.
  useEffect(() => {
    const t = targets[targetIndex]
    if (!t) return
    killAll()
    introducedRef.current = new Set()
    setFish(buildFish(phases[phaseIdx]?.words ?? [], t, targetIndex))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIndex, roundKey])

  // Give each new fish its entrance and its gentle drift and bob.
  useEffect(() => {
    fish.forEach((f, i) => {
      if (introducedRef.current.has(f.id)) return
      introducedRef.current.add(f.id)
      const el = nodesRef.current[f.id]
      if (!el) return
      gsap.set(el, { x: 0, y: 0, opacity: 0, scale: 0.7 })
      track(gsap.to(el, { opacity: 1, scale: 1, duration: 0.42, delay: i * 0.07, ease: 'back.out(1.6)' }))
      const driftAmt = 13 + Math.random() * 11
      const dir = i % 2 === 0 ? 1 : -1
      track(gsap.to(el, { x: dir * driftAmt, duration: 2.2 + Math.random() * 1.3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.35 + i * 0.08 }))
      track(gsap.to(el, { y: (i % 2 === 0 ? -1 : 1) * (5 + Math.random() * 4), duration: 1.5 + Math.random() * 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.35 }))
    })
  }, [fish])

  // Clean up every timeline when the game leaves the screen.
  useEffect(() => () => killAll(), [])

  function advanceFrom(fromIndex: number) {
    busyRef.current = false
    setFeedback(null)
    if (fromIndex + 1 >= catches) {
      if (!doneRef.current) { doneRef.current = true; onDone() }
    } else {
      setTargetIndex(fromIndex + 1)
    }
  }

  function onTapFish(f: Fish, fromIndex: number) {
    if (busyRef.current || doneRef.current) return
    if (leavingRef.current.has(f.id)) return
    const el = nodesRef.current[f.id]

    if (f.word === target) {
      busyRef.current = true
      leavingRef.current.add(f.id)
      setFeedback({ text: 'Great catch! ⭐', tone: 'good' })
      if (el) {
        gsap.killTweensOf(el)
        const spark = sparkRef.current[f.id]
        const tl = gsap.timeline({ onComplete: () => advanceFrom(fromIndex) })
        tl.to(el, { rotation: 11, scale: 1.15, duration: 0.16, ease: 'power2.out' })
          .to(el, { rotation: -8, duration: 0.13, ease: 'sine.inOut' })
          .to(el, { rotation: 0, duration: 0.12, ease: 'sine.inOut' })
        if (spark) tl.to(spark, { opacity: 1, scale: 1.6, duration: 0.28, ease: 'back.out(2)' }, '<')
        tl.to(el, { x: '+=190', y: -34, opacity: 0, scale: 0.6, rotation: 6, duration: 0.5, ease: 'power2.in' }, '>-0.05')
        if (spark) tl.to(spark, { opacity: 0, scale: 2, duration: 0.32, ease: 'power1.out' }, '<')
        track(tl)
      } else {
        advanceFrom(fromIndex)
      }
    } else {
      // A wrong tap never ends the round. The fish darts off, the correct
      // one stays, and the child tries again.
      leavingRef.current.add(f.id)
      setFeedback({ text: 'Nearly! That fish says ' + f.word + '. Try another one.', tone: 'soft' })
      if (el) {
        gsap.killTweensOf(el)
        track(gsap.to(el, {
          x: '+=150', y: 16, rotation: 24, opacity: 0, scale: 0.7, duration: 0.42, ease: 'power2.in',
          onComplete: () => setFish(list => list.filter(x => x.id !== f.id)),
        }))
      } else {
        setFish(list => list.filter(x => x.id !== f.id))
      }
    }
  }

  const stageEyebrow: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px',
  }

  const pondFrame: React.CSSProperties = {
    position: 'relative', width: '100%', maxWidth: '440px', margin: '0 auto',
    height: 'clamp(292px, 72vw, 322px)', borderRadius: '24px', overflow: 'hidden',
    background: 'linear-gradient(180deg, #E6F1FB 0%, #D3E6F7 100%)',
    border: '2.5px solid var(--ink, #1A1A2E)', boxShadow: '0 5px 0 var(--border)',
  }

  return (
    <>
      <div style={stageEyebrow}>{game.stage} · {Math.min(targetIndex + 1, catches)} of {catches}</div>

      {/* DiGi calls the word */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '12px' }}>
        <DigiCharacter mood="speak" size={62} />
        <div style={{
          flex: 1, maxWidth: '280px', background: '#fff', border: '1.5px solid var(--border)',
          borderRadius: '18px', boxShadow: '0 4px 0 var(--border)', padding: '10px 14px', textAlign: 'left',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '2px' }}>
            {isLetters ? 'Catch this sound' : 'Catch this word'}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.7rem, 8vw, 2.2rem)', color: 'var(--ink)', lineHeight: 1, textTransform: 'none' }}>
            {target}
          </div>
        </div>
      </div>

      {/* The pond */}
      <div style={pondFrame}>
        {/* Faint bubbles, never in the way of a tap */}
        <span style={{ position: 'absolute', left: '14%', top: '20%', width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #B7D4EE', opacity: 0.7, pointerEvents: 'none' }} />
        <span style={{ position: 'absolute', left: '20%', top: '13%', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #B7D4EE', opacity: 0.7, pointerEvents: 'none' }} />
        <span style={{ position: 'absolute', right: '12%', bottom: '16%', width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #B7D4EE', opacity: 0.6, pointerEvents: 'none' }} />
        <span style={{ position: 'absolute', right: '20%', bottom: '11%', width: '9px', height: '9px', borderRadius: '50%', border: '2px solid #B7D4EE', opacity: 0.6, pointerEvents: 'none' }} />

        {fish.map(f => (
          <div
            key={f.id}
            ref={el => { nodesRef.current[f.id] = el }}
            onClick={() => onTapFish(f, targetIndex)}
            role="button"
            tabIndex={0}
            aria-label={`Fish, ${f.word}`}
            style={{
              position: 'absolute', left: f.slot.left, top: f.slot.top, width: `${FISH_W}px`,
              cursor: 'pointer', zIndex: 1, transformOrigin: '50% 50%', touchAction: 'manipulation',
            }}
          >
            <FishArt word={f.word} pal={f.pal} />
            <span
              ref={el => { sparkRef.current[f.id] = el }}
              aria-hidden="true"
              style={{ position: 'absolute', left: '50%', top: '-8%', transform: 'translateX(-50%)', fontSize: '26px', opacity: 0, pointerEvents: 'none' }}
            >
              ✨
            </span>
          </div>
        ))}
      </div>

      {/* Gentle feedback line */}
      <p style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', textAlign: 'center',
        color: feedback?.tone === 'good' ? 'var(--ink)' : 'var(--ink-soft)',
        minHeight: '20px', margin: '14px 0 12px', lineHeight: 1.5,
      }}>
        {feedback ? feedback.text : 'Tap the fish that matches the word.'}
      </p>

      {/* Phase switcher */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {phases.map((p, i) => {
          const active = i === phaseIdx
          return (
            <button key={p.id} onClick={() => startRound(i)} style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer',
              color: active ? 'var(--ink)' : 'var(--ink-soft)',
              background: active ? 'var(--terracotta)' : '#fff',
              border: active ? '1.5px solid var(--terracotta-dark)' : '1.5px solid var(--border)',
              borderRadius: '100px', padding: '8px 15px',
              boxShadow: active ? '0 3px 0 var(--terracotta-dark)' : 'none',
            }}>
              {pillLabel(p)}
            </button>
          )
        })}
      </div>
    </>
  )
}

export default FishingView
