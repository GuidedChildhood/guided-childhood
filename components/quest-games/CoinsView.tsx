'use client'

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import type { CoinsGame } from '@/lib/quest-games/registry'

// Sofia's Ice Cream Shop, the coins mechanic. Sofia runs the counter and
// asks for a treat at price P pence. The child taps play coins from the
// till to build the total; when it lands on P exactly the order is served
// (Sofia cheers, the scoops pop). Tapping over P gently bounces the coin
// back, and a coin already in the pile can be tapped to take it back.
// Finishing all serves calls onDone once, which awards the stars. No pass
// mark, no losing. Tap only, big targets, GSAP only.
//
// Coins are stylised house colour circles with PLAY MONEY microtext, never
// Royal Mint artwork. Coppers terracotta, silvers tint blue, pounds
// terracotta dark, matching the printable. The paper uses heptagons for
// the 20p and 50p, circles are fine on screen. Integer pence throughout,
// every check is exact.

// Under a pound shows pence ("45p"), a pound or more shows the pound sign
// ("£1.20"). Never a dash.
function priceLabel(p: number): string {
  if (p < 100) return `${p}p`
  const pounds = Math.floor(p / 100)
  const pence = p % 100
  return `£${pounds}.${pence.toString().padStart(2, '0')}`
}
function coinLabel(v: number): string {
  return v >= 100 ? `£${v / 100}` : `${v}p`
}
// Sort colours for small hands: 1p and 2p coppers, 5p to 50p silvers,
// £1 and £2 pounds.
function coinFill(v: number): string {
  if (v <= 2) return 'var(--terracotta, #EDC35F)'
  if (v < 100) return 'var(--tint-blue, #D8E8F8)'
  return 'var(--terracotta-dark, #C99A28)'
}

// Six freezer flavours, bottom scoop first, matching the printable.
const FLAVOURS = ['#FBCFE8', '#FEF7E0', '#C99A28', '#E8F0EE', '#D8E8F8', '#EDC35F']
function scoopColours(item: string): string[] {
  const n = /triple|sundae|tub/.test(item) ? 3 : /double/.test(item) ? 2 : 1
  return Array.from({ length: n }, (_, i) => FLAVOURS[i % FLAVOURS.length])
}

function sample<T>(arr: T[], n: number): T[] {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

// ── A play coin ───────────────────────────────────────────────────────
function PlayCoin({ value, size }: { value: number; size: number }) {
  const label = coinLabel(value)
  const fontValue = label.length > 2 ? size * 0.3 : size * 0.36
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{ display: 'block' }} aria-hidden="true">
      <circle cx={32} cy={32} r={30} fill={coinFill(value)} stroke="var(--ink, #1A1A2E)" strokeWidth={3} />
      <circle cx={32} cy={32} r={25.5} fill="none" stroke="rgba(26,26,46,.28)" strokeWidth={1.4} />
      {value === 200 && (
        <circle cx={32} cy={32} r={16} fill="var(--tint-blue, #D8E8F8)" stroke="rgba(26,26,46,.28)" strokeWidth={1.2} />
      )}
      <text x={32} y={value === 200 ? 34 : 32} textAnchor="middle" dominantBaseline="central"
        fontFamily="var(--font-display, sans-serif)" fontWeight={900} fontSize={value === 200 ? size * 0.26 : fontValue}
        fill="var(--ink, #1A1A2E)">{label}</text>
      <text x={32} y={49} textAnchor="middle" dominantBaseline="central"
        fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={6.4} letterSpacing={0.3}
        fill="rgba(26,26,46,.72)">PLAY MONEY</text>
    </svg>
  )
}

// Sofia, the shopkeeper, is the real character portrait
// (public/digi-squad/Sofia.jpeg), shown as a round avatar at the counter.

// ── The built ice cream that pops in when an order is served ──────────
function ServedTreat({ colours, size }: { colours: string[]; size: number }) {
  return (
    <svg viewBox="0 0 120 150" width={size} height={size * 1.25} style={{ display: 'block' }} aria-hidden="true">
      <g className="ic-cone">
        <path d="M42 74 L60 148 L78 74 Z" fill="var(--terracotta, #EDC35F)" stroke="var(--ink, #1A1A2E)" strokeWidth={3} strokeLinejoin="round" />
        <g stroke="rgba(26,26,46,.30)" strokeWidth={2}>
          <path d="M49 86 L71 108" /><path d="M43 98 L65 120" /><path d="M71 86 L49 108" />
        </g>
      </g>
      {colours.map((c, i) => {
        const cy = 68 - i * 20
        const r = 22 - i * 2
        const top = i === colours.length - 1
        return (
          <g className="ic-scoop" key={i}>
            <circle cx={60} cy={cy} r={r} fill={c} stroke="var(--ink, #1A1A2E)" strokeWidth={3} />
            {top && (
              <>
                <circle cx={54} cy={cy - 2} r={2} fill="var(--ink, #1A1A2E)" />
                <circle cx={66} cy={cy - 2} r={2} fill="var(--ink, #1A1A2E)" />
                <path d={`M55 ${cy + 4} Q60 ${cy + 8} 65 ${cy + 4}`} fill="none" stroke="var(--ink, #1A1A2E)" strokeWidth={2} strokeLinecap="round" />
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function CoinsView({ game, onDone }: { game: CoinsGame; onDone: () => void }) {
  // Sample the serves, then sort by price so the shop opens gently and the
  // orders climb from Year 1 coins to Year 2 combinations.
  const [round] = useState(() =>
    sample(game.orders, Math.min(game.serves, game.orders.length)).sort((a, b) => a.price - b.price)
  )
  const [idx, setIdx] = useState(0)
  const [paid, setPaid] = useState<number[]>([])
  const [nudge, setNudge] = useState<string | null>(null)
  const [serving, setServing] = useState(false)

  const busyRef = useRef(false)
  const doneRef = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const sofiaRef = useRef<HTMLDivElement>(null)
  const treatRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const tweens = useRef<gsap.core.Tween[]>([])

  const track = (t: gsap.core.Tween) => { tweens.current.push(t); return t }
  const after = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
  }
  const finishOnce = () => {
    if (doneRef.current) return
    doneRef.current = true
    onDone()
  }

  // Clean every tween and timer on unmount.
  useEffect(() => () => {
    tweens.current.forEach(t => t.kill()); tweens.current = []
    timers.current.forEach(id => clearTimeout(id)); timers.current = []
  }, [])

  // An empty order set (only ever from a malformed config) finishes at once
  // rather than leaving the shop stuck with nothing to serve.
  useEffect(() => {
    if (round.length === 0) finishOnce()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const order = round[idx]
  const total = paid.reduce((a, b) => a + b, 0)

  // Gentle entrance as each new order lands.
  useEffect(() => {
    if (!serving && stageRef.current) {
      track(gsap.fromTo(stageRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.3)' }))
    }
  }, [idx, serving])

  const serve = () => {
    busyRef.current = true
    setNudge(null)
    setServing(true)
    if (sofiaRef.current) {
      track(gsap.fromTo(sofiaRef.current, { y: 0 }, { y: -9, duration: 0.24, yoyo: true, repeat: 3, ease: 'sine.inOut' }))
    }
    after(() => {
      if (treatRef.current) {
        track(gsap.fromTo(treatRef.current, { scale: 0, y: 12 }, { scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }))
        track(gsap.fromTo(treatRef.current.querySelectorAll('.ic-scoop'),
          { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12, delay: 0.12, ease: 'back.out(2)' }))
      }
    }, 20)
    after(() => {
      const next = idx + 1
      if (next >= round.length) {
        finishOnce()
      } else {
        setPaid([])
        setIdx(next)
        setServing(false)
        busyRef.current = false
      }
    }, 1500)
  }

  const bounce = (el: HTMLElement | null) => {
    if (el) track(gsap.fromTo(el, { y: 0 }, { y: -12, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' }))
  }

  const tapCoin = (value: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (serving || busyRef.current || !order) return
    // Integer pence, and never allowed to go over the price.
    const next = total + value
    if (next > order.price) {
      setNudge('A little too much! Tap a smaller coin.')
      bounce(e.currentTarget)
      return
    }
    setNudge(null)
    setPaid([...paid, value])
    if (next === order.price) serve()
  }

  const removeCoin = (i: number) => {
    if (serving || busyRef.current) return
    setNudge(null)
    setPaid(paid.filter((_, j) => j !== i))
  }

  if (!order) return null

  const tray = Array.from(new Set(game.coins)).sort((a, b) => a - b)
  const eyebrowStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px',
  }

  return (
    <>
      <div style={eyebrowStyle}>
        {game.stage} · {Math.min(idx + 1, round.length)} of {round.length}
      </div>

      {serving ? (
        <div style={{ textAlign: 'center', padding: '14px 0 8px' }}>
          <div ref={treatRef} style={{ display: 'inline-flex', margin: '0 auto 8px', transformOrigin: 'center bottom' }}>
            <ServedTreat colours={scoopColours(order.item)} size={100} />
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.15rem, 5vw, 1.5rem)', letterSpacing: '-0.01em', color: 'var(--terracotta-dark)', margin: 0 }}>
            Yes! One {order.item} coming up!
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-soft)', marginTop: '4px' }}>
            Exactly {priceLabel(order.price)}. Sofia is so proud of you.
          </p>
        </div>
      ) : (
        <div ref={stageRef}>
          {/* Sofia and her order */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div ref={sofiaRef} style={{ flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/digi-squad/Sofia.jpeg" alt="Sofia" width={72} height={72}
                style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 4px 0 var(--border)' }} />
            </div>
            <div style={{
              flex: 1, background: '#fff', border: '1.5px solid var(--border)',
              borderRadius: '18px', padding: '12px 15px', boxShadow: '0 5px 0 var(--border)',
            }}>
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '14.5px', color: 'var(--ink)', lineHeight: 1.45, margin: 0 }}>
                A {order.item} please! That is{' '}
                <strong style={{ color: 'var(--terracotta-dark)' }}>{priceLabel(order.price)}</strong>.
                Tap coins to make it.
              </p>
            </div>
          </div>

          {/* Running total and the coins placed so far */}
          <div style={{
            background: 'var(--stage-1, #FFFBEE)', border: '1.5px solid var(--border)',
            borderRadius: '16px', padding: '12px 14px', marginBottom: '12px',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', textAlign: 'center', marginBottom: paid.length ? '10px' : 0 }}>
              You have {priceLabel(total)} of {priceLabel(order.price)}
            </div>
            {paid.length > 0 && (
              <>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {paid.map((v, i) => (
                    <button key={i} onClick={() => removeCoin(i)} aria-label={`Take back ${coinLabel(v)}`} style={{
                      border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', lineHeight: 0,
                      filter: 'drop-shadow(0 3px 0 rgba(0,0,0,0.14))',
                    }}>
                      <PlayCoin value={v} size={42} />
                    </button>
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-muted)', textAlign: 'center', marginTop: '8px' }}>
                  Tap a coin here to take it back
                </p>
              </>
            )}
          </div>

          {/* Gentle nudge (space is always reserved so nothing jumps) */}
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '13.5px', fontWeight: 700, lineHeight: 1.5, textAlign: 'center',
            color: nudge ? 'var(--terracotta-dark)' : 'transparent', minHeight: '20px', margin: '0 0 12px',
          }}>
            {nudge ?? ' '}
          </p>

          {/* The till */}
          <div style={{ ...eyebrowStyle, textAlign: 'center', marginBottom: '10px' }}>The till · tap a coin</div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {tray.map(v => (
              <button key={v} onClick={(e) => tapCoin(v, e)} aria-label={`Pay ${coinLabel(v)}`} style={{
                border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', lineHeight: 0,
                filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.16))',
              }}>
                <PlayCoin value={v} size={60} />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default CoinsView
