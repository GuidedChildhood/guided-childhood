'use client'

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import DigiCharacter from '@/components/digi/DigiCharacter'
import type { WheelGame } from '@/lib/quest-games/registry'

// DiGi's A to Z Showdown, the quest game twin of the print and play wheel.
// DiGi, the golden star, sits at the heart of a 26 letter ring and hands the
// child one letter at a time. Read the clue, tap the answer that both fits the
// clue and starts with the letter. A round is seven letters sampled from a
// tier. Tap only, GSAP only, design tokens only. Renders inside the quest
// game player's cream card, and calls onDone once when the round finishes, so
// the player runs the celebration and sends the stars. Content lives on the
// game row (rule 6), never hardcoded here.

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)',
}

const ROUND_LEN = 7

// Ring geometry, SVG user units.
const VIEW = 300
const CENTRE = VIEW / 2
const RING_R = 120
const BADGE = 30
const BADGE_R = 9
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function badgePoint(i: number) {
  const ang = -Math.PI / 2 + (i * 2 * Math.PI) / 26
  return { x: CENTRE + RING_R * Math.cos(ang), y: CENTRE + RING_R * Math.sin(ang) }
}

// Fisher Yates sample: a fresh seven every play.
function sample<T>(arr: T[], n: number): T[] {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, Math.min(n, copy.length))
}

type Item = WheelGame['rounds'][number]['items'][number]

export default function WheelView({ game, onDone }: { game: WheelGame; onDone: () => void }) {
  const rounds = game.rounds ?? []
  const [tierIndex, setTierIndex] = useState(0)
  const tier = rounds[tierIndex]

  const [items, setItems] = useState<Item[]>(() => (rounds[0] ? sample(rounds[0].items, ROUND_LEN) : []))
  const [qIndex, setQIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [status, setStatus] = useState<Record<string, 'right' | 'wrong'>>({})
  const [digiMood, setDigiMood] = useState<'idle' | 'happy' | 'thinking' | 'wave'>('idle')

  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const badgeRefs = useRef<Record<string, SVGGElement | null>>({})
  const haloRef = useRef<SVGCircleElement>(null)
  const timer = useRef<number | null>(null)

  const item = items[qIndex]

  // Start a fresh seven from a tier and reset the board.
  const startRound = (idx: number) => {
    if (timer.current) window.clearTimeout(timer.current)
    const source = rounds[idx]
    if (!source) return
    setItems(sample(source.items, ROUND_LEN))
    setQIndex(0)
    setPicked(null)
    setStatus({})
    setDigiMood('idle')
  }

  const chooseTier = (idx: number) => {
    setTierIndex(idx)
    startRound(idx)
  }

  // Gentle pulse on the current letter so the eye knows where to look.
  useEffect(() => {
    if (!item || !haloRef.current) return
    const p = badgePoint(ALPHABET.indexOf(item.letter))
    const tl = gsap.timeline({ repeat: -1, yoyo: true })
    tl.fromTo(haloRef.current, { opacity: 0.25, scale: 1 }, {
      opacity: 0.9, scale: 1.12, duration: 0.9, ease: 'sine.inOut',
      svgOrigin: `${p.x} ${p.y}`,
    })
    return () => { tl.kill() }
  }, [qIndex, item])

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current) }, [])

  const pick = (i: number) => {
    if (picked !== null || !item) return
    setPicked(i)
    const isRight = i === item.answer
    const letter = item.letter
    setStatus(s => ({ ...s, [letter]: isRight ? 'right' : 'wrong' }))

    const btn = optionRefs.current[i]
    if (isRight) {
      setDigiMood('happy')
      if (btn) gsap.fromTo(btn, { scale: 1 }, { scale: 1.08, duration: 0.16, ease: 'back.out(3)', yoyo: true, repeat: 1 })
    } else {
      setDigiMood('thinking')
      if (btn) gsap.fromTo(btn, { x: -9 }, { x: 0, duration: 0.55, ease: 'elastic.out(1, 0.3)' })
    }

    // Pop the badge on the ring as it takes its colour.
    const badge = badgeRefs.current[letter]
    if (badge) {
      const p = badgePoint(ALPHABET.indexOf(letter))
      gsap.fromTo(badge, { scale: 1 }, {
        scale: 1.3, duration: 0.26, ease: 'back.out(2.4)', yoyo: true, repeat: 1,
        svgOrigin: `${p.x} ${p.y}`,
      })
    }

    const last = qIndex + 1 >= items.length
    timer.current = window.setTimeout(() => {
      setPicked(null)
      if (last) {
        // The round is done: hand off to the player, which runs the warm
        // finish and sends the stars. Nothing more to show here.
        setDigiMood('wave')
        onDone()
      } else {
        setDigiMood('idle')
        setQIndex(q => q + 1)
      }
    }, isRight ? 850 : 1250)
  }

  // Nothing to play: degrade gently like the rest of the interactive layer.
  if (!tier || items.length === 0) {
    return (
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink)', textAlign: 'center', padding: '24px' }}>
        DiGi is polishing the letter wheel. Come back in a moment.
      </p>
    )
  }

  const currentIdx = item ? ALPHABET.indexOf(item.letter) : -1
  const currentPt = currentIdx >= 0 ? badgePoint(currentIdx) : { x: CENTRE, y: CENTRE }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ ...eyebrow, marginBottom: '10px' }}>{game.stage} · race the alphabet</div>

      {/* Tier switcher */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
        {rounds.map((r, i) => (
          <button key={r.tier} onClick={() => chooseTier(i)} style={{
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', cursor: 'pointer',
            color: i === tierIndex ? '#fff' : 'var(--ink)',
            background: i === tierIndex ? 'var(--terracotta)' : '#fff',
            border: i === tierIndex ? 'none' : '2px solid var(--border)',
            borderRadius: '100px', padding: '9px 16px',
            boxShadow: i === tierIndex ? '0 4px 0 var(--terracotta-dark)' : 'none',
          }}>
            {r.tier}
          </button>
        ))}
      </div>

      {/* The letter ring with DiGi in the middle */}
      <div style={{ position: 'relative', width: 'min(300px, 82vw)', aspectRatio: '1 / 1', margin: '0 auto 18px' }}>
        <svg viewBox={`0 0 ${VIEW} ${VIEW}`} width="100%" height="100%" role="img" aria-label="Alphabet letter ring">
          <circle cx={CENTRE} cy={CENTRE} r={RING_R} fill="none" stroke="var(--border)" strokeWidth={2} strokeDasharray="5 6" />
          {ALPHABET.map((L, i) => {
            const { x, y } = badgePoint(i)
            const st = status[L]
            const fill = st === 'right'
              ? 'var(--tint-sage)'
              : st === 'wrong'
                ? '#FBEAEA'
                : i % 2 === 0 ? 'var(--terracotta-lt)' : 'var(--stage-2)'
            const stroke = st === 'right' ? 'var(--sage-ink, #2D5016)' : st === 'wrong' ? '#c0392b' : 'var(--ink)'
            return (
              <g key={L} ref={el => { badgeRefs.current[L] = el }}>
                <rect
                  x={x - BADGE / 2} y={y - BADGE / 2} width={BADGE} height={BADGE} rx={BADGE_R}
                  fill={fill} stroke={stroke} strokeWidth={2.5}
                  style={{ transition: 'fill 0.35s ease, stroke 0.35s ease' }}
                />
                <text x={x} y={y} fontFamily="var(--font-display)" fontWeight={900} fontSize={15}
                  fill="var(--ink)" textAnchor="middle" dominantBaseline="central">{L}</text>
              </g>
            )
          })}
          {/* Pulse marking the letter in play */}
          {currentIdx >= 0 && (
            <circle ref={haloRef} cx={currentPt.x} cy={currentPt.y} r={BADGE * 0.82}
              fill="none" stroke="var(--terracotta-dark)" strokeWidth={3} pointerEvents="none" />
          )}
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <DigiCharacter mood={digiMood} size={84} />
        </div>
      </div>

      {/* Clue card */}
      <div style={{ ...eyebrow, marginBottom: '8px', color: 'var(--ink-muted)' }}>
        Letter {item.letter} · question {qIndex + 1} of {items.length}
      </div>
      <div style={{
        maxWidth: '440px', margin: '0 auto 16px', background: '#fff',
        border: '2px solid var(--border)', borderRadius: '18px', padding: '16px 20px',
        boxShadow: '0 5px 0 var(--border)',
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.15rem', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
          The letter is {item.letter}.
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '15.5px', color: 'var(--ink)', lineHeight: 1.5 }}>
          {item.clue}
        </p>
      </div>

      {/* Answer options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', maxWidth: '440px', margin: '0 auto' }}>
        {item.options.map((opt, i) => {
          const answered = picked !== null
          const isAnswer = i === item.answer
          const isPicked = i === picked
          let bg = '#fff', fg = 'var(--ink)', shadow = '0 4px 0 var(--border)', border = '2px solid var(--border)'
          if (answered && isAnswer) { bg = 'var(--tint-sage)'; fg = 'var(--ink)'; shadow = '0 4px 0 rgba(0,0,0,0.12)'; border = '2px solid var(--sage-ink, #2D5016)' }
          else if (answered && isPicked) { bg = '#FBEAEA'; fg = 'var(--ink)'; shadow = '0 4px 0 rgba(0,0,0,0.12)'; border = '2px solid #c0392b' }
          return (
            <button key={opt} ref={el => { optionRefs.current[i] = el }} onClick={() => pick(i)} disabled={answered} style={{
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
              cursor: answered ? 'default' : 'pointer', color: fg, background: bg,
              border, borderRadius: '16px', padding: '15px 14px', boxShadow: shadow,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              opacity: answered && !isAnswer && !isPicked ? 0.5 : 1,
            }}>
              {answered && isAnswer && <span aria-hidden style={{ fontSize: '17px' }}>✓</span>}
              {opt}
            </button>
          )
        })}
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-muted)', marginTop: '14px' }}>
        {tier.tier} round · {tier.label}
      </p>
    </div>
  )
}
