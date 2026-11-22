'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Celebration from '@/components/ui/Celebration'
import type { QuestGame, PairsGame, JudgeGame, SumsGame } from '@/lib/quest-games/registry'
import WheelView from './WheelView'
import FishingView from './FishingView'
import CoinsView from './CoinsView'
import BattleView from './BattleView'
import TraceView from './TraceView'
import { resolveTheme, DEFAULT_ACCENT, type KidTheme } from '@/lib/kid/theme'

// The in app quest game player. Renders a game by its mechanic, calm and
// finite, ending in a warm finish that names the stars. Scoring wiring (send
// to child, pending tick) comes with the mission flow; for now a parent can
// open and play any game here. Board and finish match the daily deck.

function shuffle<T>(a: T[]): T[] {
  const b = a.slice()
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

// onComplete fires once when the game is finished (the kid screen records
// the stars there). onClose closes the player. When neither is given, the
// player falls back to links, for the parent gallery preview.
// The games takeover paints the whole screen, so it has to wear the colour the
// child chose rather than a colour of its own. It used to hardcode the old
// anthracite ground and white title text, which was invisible the moment Paper
// became the default on 14 September 2026 and wrong for every pastel accent
// before that. Ask the theme, the way the rest of the child app does.
export default function QuestGamePlayer({ game, onComplete, onClose, theme }: {
  game: QuestGame
  onComplete?: () => void
  onClose?: () => void
  /** The child's chosen colour. Falls back to the default on the parent and dev routes. */
  theme?: KidTheme
}) {
  const t = theme ?? resolveTheme(DEFAULT_ACCENT)
  const [finished, setFinished] = useState(false)
  // Beat the clock (22 November 2026): after a judgement game is played and
  // its stars are earned, the child can race the same cards against a timer.
  // Modelled on the practice or round choice in the French scheme's pupil
  // games (plans/2026-11-22-french-games-review.md). No extra stars, so it
  // can never be used to earn screen time; the best score lives on this
  // device only, nothing is sent anywhere.
  const [round, setRound] = useState(false)

  function finish() {
    if (finished) return
    setFinished(true)
    onComplete?.()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60, background: t.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: 'max(14px, env(safe-area-inset-top)) 14px max(14px, env(safe-area-inset-bottom))',
    }}>
      <div style={{ width: 'min(100%, 460px)', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <CloseControl onClose={onClose} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: t.inkSoft }}>
            {game.title}
          </span>
        </div>

        <div style={{ flex: 1, minHeight: 0, background: 'var(--cream)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: '20px', overflowY: 'auto', boxShadow: 'var(--lift)', position: 'relative' }}>
          {round && game.mechanic === 'judge' ? (
            <JudgeRound game={game} onClose={onClose} onAgainDone={() => setRound(false)} />
          ) : finished ? (
            <Finish game={game} onClose={onClose} onRound={game.mechanic === 'judge' ? () => setRound(true) : undefined} />
          ) : game.mechanic === 'pairs' ? (
            <PairsView game={game} onDone={finish} />
          ) : game.mechanic === 'sums' ? (
            <SumsView game={game} onDone={finish} />
          ) : game.mechanic === 'wheel' ? (
            <WheelView game={game} onDone={finish} />
          ) : game.mechanic === 'fishing' ? (
            <FishingView game={game} onDone={finish} />
          ) : game.mechanic === 'coins' ? (
            <CoinsView game={game} onDone={finish} />
          ) : game.mechanic === 'battle' ? (
            <BattleView game={game} onDone={finish} />
          ) : game.mechanic === 'trace' ? (
            <TraceView game={game} onDone={finish} />
          ) : (
            <JudgeView game={game} onDone={finish} />
          )}
        </div>
      </div>
    </div>
  )
}

const closeStyle = {
  width: 34, height: 34, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: 'var(--edge)', background: '#fff', color: 'var(--ink)', fontSize: 'var(--text-md)', textDecoration: 'none', cursor: 'pointer',
} as const

function CloseControl({ onClose }: { onClose?: () => void }) {
  if (onClose) return <button onClick={onClose} aria-label="Close" style={closeStyle}>✕</button>
  return <Link href="/dashboard/quests/play" aria-label="Close" style={closeStyle}>✕</Link>
}

function Finish({ game, onClose, onRound }: { game: QuestGame; onClose?: () => void; onRound?: () => void }) {
  const btnStyle = {
    display: 'inline-block', marginTop: '20px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
    background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: 'var(--radius-tile)', padding: '13px 22px', textDecoration: 'none',
    boxShadow: '0 4px 0 var(--terracotta-dark)', cursor: 'pointer',
  } as const
  return (
    <div style={{ position: 'relative', textAlign: 'center', padding: '30px 10px' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}><Celebration /></div>
      <div style={{ fontSize: '54px' }}>⭐</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', letterSpacing: '-0.02em', margin: '8px 0 4px' }}>Well done!</h2>
      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--terracotta-dark)', fontSize: 'var(--text-sm)' }}>
        {game.stars} star{game.stars === 1 ? '' : 's'} sent to your grown up
      </div>
      {onClose
        ? <button onClick={onClose} style={btnStyle}>Done</button>
        : <Link href="/dashboard/quests/play" style={btnStyle}>Back to games</Link>}
      {onRound && (
        <div style={{ marginTop: '14px' }}>
          <button onClick={onRound} style={{ ...btnStyle, marginTop: 0, background: 'var(--white)', border: 'var(--edge)', boxShadow: 'var(--lift)' }}>
            ⏱ Beat the clock
          </button>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '8px 0 0' }}>Just for fun: no extra stars.</p>
        </div>
      )}
    </div>
  )
}

const ROUND_SECONDS = 45

// The timed round: the same cards, shuffled, looping until the clock runs out.
// Right moves on fast; wrong shows the right side for a moment, then moves on.
function JudgeRound({ game, onClose, onAgainDone }: { game: JudgeGame; onClose?: () => void; onAgainDone: () => void }) {
  const key = `gc.round.best.${game.key}`
  const [order, setOrder] = useState(() => shuffle(game.items))
  const [i, setI] = useState(0)
  const [left, setLeft] = useState(ROUND_SECONDS)
  const [score, setScore] = useState(0)
  const [flash, setFlash] = useState<null | { ok: boolean; label: string }>(null)
  const [best, setBest] = useState(0)
  const [newBest, setNewBest] = useState(false)
  const over = left <= 0

  useEffect(() => { try { setBest(Number(localStorage.getItem(key) || 0)) } catch { /* private mode */ } }, [key])
  useEffect(() => {
    if (over) return
    const t = setInterval(() => setLeft(s => s-1), 1000)
    return () => clearInterval(t)
  }, [over])
  useEffect(() => {
    if (!over) return
    if (score > best) {
      setNewBest(true); setBest(score)
      try { localStorage.setItem(key, String(score)) } catch { /* private mode */ }
    }
  }, [over]) // eslint-disable-line react-hooks/exhaustive-deps

  const item = order[i % order.length]
  function answer(side: 'left' | 'right') {
    if (flash || over) return
    const ok = side === item.correct
    if (ok) setScore(s => s + 1)
    setFlash({ ok, label: item.correct === 'left' ? game.leftLabel : game.rightLabel })
    setTimeout(() => {
      setFlash(null)
      if ((i + 1) % order.length === 0) setOrder(o => shuffle(o))
      setI(n => n + 1)
    }, ok ? 450 : 1300)
  }
  function again() { setOrder(shuffle(game.items)); setI(0); setLeft(ROUND_SECONDS); setScore(0); setFlash(null); setNewBest(false) }

  const chip = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-pill)', padding: '4px 12px' } as const
  const big = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', padding: '15px', borderRadius: '15px', cursor: 'pointer', minHeight: 52 } as const

  if (over) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 8px' }}>
        <div style={{ fontSize: '48px' }} aria-hidden>⏱</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', margin: '6px 0' }}>Time&apos;s up!</h2>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-3xl)' }}>{score} right</div>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', margin: '6px 0 18px' }}>{newBest ? 'Your best ever! Brilliant.' : `Your best: ${best} right`}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={again} style={{ ...big, background: 'var(--terracotta)', border: 'none', boxShadow: '0 4px 0 var(--terracotta-dark)', color: 'var(--ink)' }}>Play again</button>
          {onClose
            ? <button onClick={onClose} style={{ ...big, background: 'var(--white)', border: 'var(--edge)', color: 'var(--ink)' }}>Done</button>
            : <button onClick={onAgainDone} style={{ ...big, background: 'var(--white)', border: 'var(--edge)', color: 'var(--ink)' }}>Done</button>}
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ ...chip, color: left <= 10 ? 'var(--danger)' : 'var(--ink)' }} aria-label={`${left} seconds left`}>0:{String(left).padStart(2, '0')}</span>
        <span style={chip} aria-live="polite">{score} right</span>
        <span style={{ ...chip, color: 'var(--ink-muted)' }}>Best {best}</span>
      </div>
      <div style={{ background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: '20px', marginBottom: '16px', minHeight: 110 }}>
        <p style={{ fontSize: 'var(--text-lg)', lineHeight: 1.5, fontWeight: 600, margin: 0, color: 'var(--ink)' }}>{item.text}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button onClick={() => answer('left')} disabled={!!flash} style={{ ...big, background: 'var(--white)', border: 'var(--edge)', color: 'var(--ink)', boxShadow: 'var(--lift)' }}>{game.leftLabel}</button>
        <button onClick={() => answer('right')} disabled={!!flash} style={{ ...big, background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', boxShadow: '0 4px 0 var(--terracotta-dark)' }}>{game.rightLabel}</button>
      </div>
      <p aria-live="polite" style={{ minHeight: 28, textAlign: 'center', fontWeight: 700, margin: '12px 0 0', color: flash ? (flash.ok ? 'var(--retro-green-dark, #236F52)' : 'var(--danger)') : 'transparent' }}>
        {flash ? (flash.ok ? 'Yes!' : `It's ${flash.label}.`) : '.'}
      </p>
    </>
  )
}

function PairsView({ game, onDone }: { game: PairsGame; onDone: () => void }) {
  const [cards] = useState(() => shuffle(game.pairs.flatMap((p, i) => [{ k: i, t: p[0], w: false }, { k: i, t: p[1], w: true }])))
  const [sel, setSel] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [bad, setBad] = useState<number[]>([])

  function tap(idx: number) {
    if (sel.includes(idx) || matched.has(cards[idx].k) || sel.length === 2) return
    const next = [...sel, idx]
    setSel(next)
    if (next.length === 2) {
      const [a, b] = next
      if (cards[a].k === cards[b].k) {
        setTimeout(() => {
          setMatched(prev => {
            const s = new Set(prev); s.add(cards[a].k)
            if (s.size === game.pairs.length) setTimeout(onDone, 300)
            return s
          })
          setSel([])
        }, 250)
      } else {
        setBad(next)
        setTimeout(() => { setBad([]); setSel([]) }, 500)
      }
    }
  }

  return (
    <>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        {game.stage}
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.2rem, 4.5vw, 1.5rem)', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 16px' }}>
        {game.pictorial ? 'Tap the two that go together' : 'Match the animal to its name'}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {cards.map((c, idx) => {
          const isDone = matched.has(c.k)
          const isSel = sel.includes(idx)
          const isBad = bad.includes(idx)
          return (
            <button key={idx} onClick={() => tap(idx)} style={{
              aspectRatio: '1', borderRadius: 'var(--radius-btn)', cursor: isDone ? 'default' : 'pointer',
              border: `2px solid ${isDone ? 'var(--sage-ink, #2D5016)' : isBad ? '#c0392b' : isSel ? 'var(--terracotta)' : 'var(--ink)'}`,
              background: isDone ? 'var(--tint-sage)' : isSel ? 'var(--terracotta-lt)' : '#fff',
              fontSize: game.pictorial ? '30px' : (c.w ? '15px' : '26px'), fontWeight: 800, color: 'var(--ink)',
              transition: 'transform .12s', transform: isSel ? 'scale(0.96)' : 'none',
            }}>{c.t}</button>
          )
        })}
      </div>
    </>
  )
}

function SumsView({ game, onDone }: { game: SumsGame; onDone: () => void }) {
  const PER_Q = 7000
  const [i, setI] = useState(0)
  // null while unanswered, the tapped number when answered, or -1 on timeout.
  const [answered, setAnswered] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(PER_Q)
  const item = game.questions[i]

  useEffect(() => {
    if (!game.timed || answered !== null) return
    setTimeLeft(PER_Q)
    const start = Date.now()
    const id = setInterval(() => {
      const left = PER_Q - (Date.now() - start)
      if (left <= 0) { clearInterval(id); setAnswered(-1) }
      else setTimeLeft(left)
    }, 100)
    return () => clearInterval(id)
  }, [i, game.timed, answered])

  const isCorrect = answered !== null && answered === item.answer
  function pick(opt: number) { if (answered === null) setAnswered(opt) }
  function next() {
    if (i + 1 < game.questions.length) { setI(i + 1); setAnswered(null) }
    else onDone()
  }

  return (
    <>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        {game.stage} · {i + 1} of {game.questions.length}
      </div>

      {game.timed && (
        <div style={{ height: '8px', borderRadius: '8px', background: 'var(--border)', overflow: 'hidden', marginBottom: '14px' }}>
          <div style={{ height: '100%', borderRadius: '8px', background: answered === null ? 'var(--terracotta)' : 'transparent', width: `${Math.max(0, (timeLeft / PER_Q) * 100)}%`, transition: 'width 0.1s linear' }} />
        </div>
      )}

      <div style={{ textAlign: 'center', margin: '10px 0 22px' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--ink)',
          // A question with line breaks is a picture puzzle (the squares grid):
          // render it as the multi line figure it is, at a size that fits.
          fontSize: item.q.includes('\n') ? 'clamp(1.4rem, 7vw, 2rem)' : 'clamp(2.4rem, 12vw, 3.4rem)',
          lineHeight: item.q.includes('\n') ? 1.15 : 1,
          whiteSpace: 'pre-line',
        }}>
          {item.q}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {item.options.map(opt => {
          const chosen = answered === opt
          const showAsAnswer = answered !== null && opt === item.answer
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              disabled={answered !== null}
              style={{
                padding: '18px 6px', borderRadius: 'var(--radius-btn)', cursor: answered === null ? 'pointer' : 'default',
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--ink)',
                background: showAsAnswer ? 'var(--tint-sage)' : chosen ? '#FBEAEA' : '#fff',
                border: `2px solid ${showAsAnswer ? 'var(--sage-ink, #2D5016)' : chosen ? '#c0392b' : 'var(--ink)'}`,
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {answered !== null && (
        <div>
          <div style={{
            fontSize: 'var(--text-md)', lineHeight: 1.5, color: 'var(--ink)', marginTop: '14px', textAlign: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800,
          }}>
            {isCorrect ? 'Correct! ⭐' : answered === -1 ? `Time! It was ${item.answer}.` : `Not quite, it was ${item.answer}.`}
          </div>
          <button onClick={next} style={{
            marginTop: '14px', width: '100%', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            padding: '14px', borderRadius: '15px', border: 'none', background: 'var(--deep-teal)', color: '#fff', cursor: 'pointer',
          }}>{i + 1 < game.questions.length ? 'Next' : 'Finish'}</button>
        </div>
      )}
    </>
  )
}

function JudgeView({ game, onDone }: { game: JudgeGame; onDone: () => void }) {
  const [i, setI] = useState(0)
  const [answered, setAnswered] = useState<null | boolean>(null)
  const item = game.items[i]

  function answer(side: 'left' | 'right') {
    if (answered !== null) return
    setAnswered(side === item.correct)
  }
  function next() {
    if (i + 1 < game.items.length) { setI(i + 1); setAnswered(null) }
    else onDone()
  }

  return (
    <>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        {game.stage} · {i + 1} of {game.items.length}
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.2rem, 4.5vw, 1.5rem)', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 14px' }}>
        {game.title}
      </h2>
      <div style={{ background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: '20px', marginBottom: '16px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 8px' }}>Post {i + 1}</p>
        <p style={{ fontSize: 'var(--text-lg)', lineHeight: 1.5, fontWeight: 600, margin: 0, color: 'var(--ink)' }}>{item.text}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button onClick={() => answer('left')} disabled={answered !== null} style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', padding: '15px', borderRadius: '15px',
          cursor: answered === null ? 'pointer' : 'default', background: '#fff', border: 'var(--edge)', color: 'var(--ink)', boxShadow: 'var(--lift)',
        }}>{game.leftLabel}</button>
        <button onClick={() => answer('right')} disabled={answered !== null} style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', padding: '15px', borderRadius: '15px',
          cursor: answered === null ? 'pointer' : 'default', background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
          boxShadow: '0 4px 0 var(--terracotta-dark)',
        }}>{game.rightLabel}</button>
      </div>
      {answered !== null && (
        <div>
          <div style={{
            fontSize: 'var(--text-base)', lineHeight: 1.55, color: 'var(--ink)', marginTop: '14px',
            background: answered ? 'var(--stage-4)' : '#FBEAEA', borderLeft: `3px solid ${answered ? 'var(--gold-dark, #C99A28)' : '#c0392b'}`,
            borderRadius: '10px', padding: '12px 14px',
          }}>
            {answered ? 'Yes. ' : 'Not quite. '}{item.why}
          </div>
          <button onClick={next} style={{
            marginTop: '14px', width: '100%', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            padding: '14px', borderRadius: '15px', border: 'none', background: 'var(--deep-teal)', color: '#fff', cursor: 'pointer',
          }}>{i + 1 < game.items.length ? 'Next post' : 'Finish'}</button>
        </div>
      )}
    </>
  )
}
