'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import KidBackLink from '@/components/kid/KidBackLink'
import { playKidSound } from '@/lib/sound/kidSounds'
import type { KidTheme } from '@/lib/kid/theme'

// ME V MY GROWN UP: the game screen. One device on the table between them.
// The grown up's half is turned round to face them; the child's half faces the
// child. Both halves show the same question and the same answers, in the same
// order, so it is fair and either can read it aloud.
//
// First right tap wins the point. A wrong tap sits that player out for the
// rest of the question, so hammering buttons never pays, and a child who is
// slower but right still wins it when the grown up guesses. When nobody gets
// it, the right answer is shown anyway. Every question ends on the lesson's
// own why line, "Talk about it", which is the real point of the game.
//
// First to WIN_AT. Nothing is saved anywhere. Plan:
// plans/2026-11-22-me-v-my-grown-up-plan.md.

export type VersusQuestion = { q: string; options: string[]; answer: number; why: string }
type Player = 'kid' | 'grown'
type Round = { q: string; options: string[]; answer: number; why: string }

const WIN_AT = 5
const MIN_QUESTIONS = 3

function shuffled<T>(a: T[], seed: number): T[] {
  const out = a.slice()
  let s = (seed % 2147483647) || 1
  const rnd = () => (s = (s * 48271) % 2147483647) / 2147483647
  for (let i = out.length-1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]] }
  return out
}

function deal(pool: VersusQuestion[], seed: number): Round[] {
  return shuffled(pool, seed).map((item, n) => {
    const order = shuffled(item.options.map((_, i) => i), seed + n * 101)
    return { q: item.q, options: order.map(i => item.options[i]), answer: order.indexOf(item.answer), why: item.why }
  })
}

export default function KidVersus({ token, childName, pool, theme: t }: {
  token: string
  childName: string
  pool: VersusQuestion[]
  theme: KidTheme
}) {
  const [seed, setSeed] = useState(() => Math.floor(Date.now() % 2147483647) || 1)
  const rounds = useMemo(() => deal(pool, seed), [pool, seed])
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [score, setScore] = useState<Record<Player, number>>({ kid: 0, grown: 0 })
  const [out, setOut] = useState<Record<Player, boolean>>({ kid: false, grown: false })
  const [won, setWon] = useState<Player | 'nobody' | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  const r = rounds.length ? rounds[step % rounds.length] : null
  const winner: Player | null = score.kid >= WIN_AT ? 'kid' : score.grown >= WIN_AT ? 'grown' : null
  const name = childName.trim() || 'You'

  useEffect(() => {
    if (!stageRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(stageRef.current.querySelectorAll('.gc-vs-opt'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .25, stagger: .05 })
  }, [step, started])

  function tap(p: Player, i: number) {
    if (!r || won || out[p]) return
    if (i === r.answer) {
      playKidSound('star')
      setWon(p)
      setScore(s => ({ ...s, [p]: s[p] + 1 }))
    } else {
      const nowOut = { ...out, [p]: true }
      setOut(nowOut)
      if (nowOut.kid && nowOut.grown) setWon('nobody')
    }
  }

  function next() {
    setStep(s => s + 1); setWon(null); setOut({ kid: false, grown: false })
  }
  function again() {
    setSeed(x => x + 7); setStep(0); setScore({ kid: 0, grown: 0 }); setWon(null); setOut({ kid: false, grown: false })
  }

  const shell: React.CSSProperties = { minHeight: '100dvh', background: t.bg, fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column' }
  const display: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, color: t.ink, margin: 0 }
  const big: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 56, padding: '0 var(--space-5)',
    background: t.hex, color: t.onAccent, border: 'none', borderRadius: 'var(--radius-btn)', boxShadow: `0 5px 0 ${t.hexDark}`,
    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', cursor: 'pointer',
  }

  // Not enough taught yet: say so plainly, and point at the lessons.
  if (pool.length < MIN_QUESTIONS) {
    return (
      <main style={{ ...shell, padding: 'var(--space-5) var(--space-4)' }}>
        <KidBackLink href={`/k/${token}`} color={t.inkSoft} label="Home" />
        <div style={{ maxWidth: 460, margin: 'var(--space-6) auto 0', textAlign: 'center' }}>
          <div style={{ fontSize: 56 }} aria-hidden>🤝</div>
          <h1 style={{ ...display, fontSize: 'var(--text-2xl)', margin: 'var(--space-3) 0' }}>Me v my grown up</h1>
          <p style={{ color: t.inkSoft, fontSize: 'var(--text-md)', lineHeight: 1.6 }}>
            The questions come from your own lessons. Do a few more lessons first, then come back and take on your grown up.
          </p>
          <a href={`/k/${token}/lessons`} style={{ ...big, textDecoration: 'none', marginTop: 'var(--space-4)' }}>My lessons</a>
        </div>
      </main>
    )
  }

  // The start card: how it works, in three lines.
  if (!started) {
    return (
      <main style={{ ...shell, padding: 'var(--space-5) var(--space-4)' }}>
        <KidBackLink href={`/k/${token}`} color={t.inkSoft} label="Home" />
        <div style={{ maxWidth: 480, margin: 'var(--space-5) auto 0', textAlign: 'center' }}>
          <div style={{ fontSize: 56 }} aria-hidden>🤝</div>
          <h1 style={{ ...display, fontSize: 'var(--text-2xl)', margin: 'var(--space-3) 0 var(--space-2)' }}>Me v my grown up</h1>
          <p style={{ color: t.inkSoft, fontSize: 'var(--text-md)', lineHeight: 1.6, margin: '0 0 var(--space-4)' }}>
            Put the phone flat on the table between you. Your grown up sits opposite.
          </p>
          <ol style={{ listStyle: 'decimal', textAlign: 'left', color: t.ink, fontSize: 'var(--text-base)', lineHeight: 1.6, padding: 'var(--space-3) var(--space-4) var(--space-3) var(--space-6)', background: t.panel, border: `1.5px solid ${t.panelBorder}`, borderRadius: 'var(--radius-card)', margin: '0 0 var(--space-5)' }}>
            <li>You both see the same question from your lessons.</li>
            <li>First to tap the right answer wins the point. Get it wrong and you sit that one out.</li>
            <li>After each one, talk about it. First to {WIN_AT} wins.</li>
          </ol>
          <button type="button" style={big} onClick={() => { playKidSound('tap'); setStarted(true) }}>Let&apos;s play</button>
        </div>
      </main>
    )
  }

  const half = (p: Player) => {
    const flipped = p === 'grown'
    const isOut = out[p]
    return (
      <section
        aria-label={p === 'kid' ? `${name}'s side` : "Grown up's side"}
        style={{
          flex: '1 1 0', minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'safe center', gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-4) calc(var(--space-2) + env(safe-area-inset-bottom))', transform: flipped ? 'rotate(180deg)' : undefined,
          background: flipped ? t.panel : 'transparent', opacity: isOut && !won ? .55 : 1,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-3)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: t.inkMuted }}>
            {p === 'kid' ? name : 'Grown up'}{isOut && !won ? ' · sit this one out' : ''}
          </span>
          <span style={{ ...display, fontSize: 'var(--text-xl)' }} aria-label={`${score[p]} points`}>{score[p]}</span>
        </div>
        <p style={{ ...display, fontWeight: 800, fontSize: 'var(--text-md)', lineHeight: 1.35 }}>{r!.q}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {r!.options.map((o, i) => {
            const show = won !== null
            const right = show && i === r!.answer
            return (
              <button
                key={i} type="button" className="gc-vs-opt" disabled={isOut || won !== null}
                onClick={() => tap(p, i)}
                style={{
                  textAlign: 'left', minHeight: 46, padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-btn)',
                  border: `2px solid ${right ? 'var(--retro-green)' : t.panelBorder}`,
                  background: right ? 'var(--retro-green)' : 'var(--white)', color: right ? 'var(--white)' : 'var(--ink)',
                  boxShadow: `0 4px 0 ${t.shadow}`, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--text-base)',
                  cursor: isOut || won !== null ? 'default' : 'pointer', opacity: show && !right ? .5 : 1,
                }}
              >
                {o}
              </button>
            )
          })}
        </div>
      </section>
    )
  }

  // Someone reached WIN_AT: the end card, then play again or go home.
  if (winner && won === null) {
    return (
      <main style={{ ...shell, padding: 'var(--space-5) var(--space-4)', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 64 }} aria-hidden>{winner === 'kid' ? '🏆' : '🎉'}</div>
        <h1 style={{ ...display, fontSize: 'var(--text-3xl)', margin: 'var(--space-3) 0' }}>
          {winner === 'kid' ? `${name} wins!` : 'Your grown up wins!'}
        </h1>
        <p style={{ color: t.inkSoft, fontSize: 'var(--text-md)', margin: '0 0 var(--space-5)' }}>
          {score.kid} to {score.grown}. {winner === 'kid' ? 'You knew your stuff.' : 'Rematch?'}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" style={big} onClick={again}>Play again</button>
          <a href={`/k/${token}`} style={{ ...big, background: 'var(--white)', color: 'var(--ink)', boxShadow: `0 5px 0 ${t.shadow}`, textDecoration: 'none' }}>Home</a>
        </div>
      </main>
    )
  }

  return (
    <main style={{ ...shell, height: '100dvh', minHeight: 0, overflow: 'hidden' }} ref={stageRef}>
      {half('grown')}
      <div style={{ padding: 'var(--space-2) var(--space-4)', background: t.hex, color: t.onAccent, textAlign: 'center', minHeight: 56, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }} aria-live="polite">
        {won === null ? (
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)' }}>First to tap the right answer</span>
        ) : (
          <>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', lineHeight: 1.4, maxWidth: 560 }}>
              <b>{won === 'kid' ? `Point to ${name}!` : won === 'grown' ? 'Point to your grown up!' : 'Nobody this time.'}</b>{' '}
              Talk about it: {r!.why}
            </span>
            <button type="button" onClick={next} style={{ ...big, minHeight: 44, fontSize: 'var(--text-base)', background: 'var(--white)', color: 'var(--ink)', boxShadow: `0 4px 0 ${t.hexDark}` }}>
              {score.kid >= WIN_AT || score.grown >= WIN_AT ? 'See who won' : 'Next question'}
            </button>
          </>
        )}
      </div>
      {half('kid')}
    </main>
  )
}
