'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Celebration from '@/components/ui/Celebration'
import type { QuestGame, PairsGame, JudgeGame, SumsGame } from '@/lib/quest-games/registry'
import WheelView from './WheelView'
import FishingView from './FishingView'
import CoinsView from './CoinsView'

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
export default function QuestGamePlayer({ game, onComplete, onClose }: {
  game: QuestGame
  onComplete?: () => void
  onClose?: () => void
}) {
  const [finished, setFinished] = useState(false)

  function finish() {
    if (finished) return
    setFinished(true)
    onComplete?.()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60, background: 'var(--kid-bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: 'max(14px, env(safe-area-inset-top)) 14px max(14px, env(safe-area-inset-bottom))',
    }}>
      <div style={{ width: 'min(100%, 460px)', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <CloseControl onClose={onClose} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.78)' }}>
            {game.title}
          </span>
        </div>

        <div style={{ flex: 1, minHeight: 0, background: 'var(--cream)', borderRadius: '24px', padding: '20px', overflowY: 'auto', boxShadow: '0 12px 40px rgba(0,0,0,0.3)', position: 'relative' }}>
          {finished ? (
            <Finish game={game} onClose={onClose} />
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
  border: '1.5px solid rgba(26,26,46,0.2)', background: 'transparent', color: 'var(--ink)', fontSize: '15px', textDecoration: 'none', cursor: 'pointer',
} as const

function CloseControl({ onClose }: { onClose?: () => void }) {
  if (onClose) return <button onClick={onClose} aria-label="Close" style={closeStyle}>✕</button>
  return <Link href="/dashboard/quests/play" aria-label="Close" style={closeStyle}>✕</Link>
}

function Finish({ game, onClose }: { game: QuestGame; onClose?: () => void }) {
  const btnStyle = {
    display: 'inline-block', marginTop: '20px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
    background: 'var(--terracotta)', color: 'var(--ink)', border: 'none', borderRadius: '14px', padding: '13px 22px', textDecoration: 'none',
    boxShadow: '0 4px 0 var(--terracotta-dark)', cursor: 'pointer',
  } as const
  return (
    <div style={{ position: 'relative', textAlign: 'center', padding: '30px 10px' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}><Celebration /></div>
      <div style={{ fontSize: '54px' }}>⭐</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em', margin: '8px 0 4px' }}>Well done!</h2>
      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--terracotta-dark)', fontSize: '13px' }}>
        {game.stars} star{game.stars === 1 ? '' : 's'} sent to your grown up
      </div>
      {onClose
        ? <button onClick={onClose} style={btnStyle}>Done</button>
        : <Link href="/dashboard/quests/play" style={btnStyle}>Back to games</Link>}
    </div>
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
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
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
              aspectRatio: '1', borderRadius: '16px', cursor: isDone ? 'default' : 'pointer',
              border: `2px solid ${isDone ? 'var(--sage-ink, #2D5016)' : isBad ? '#c0392b' : isSel ? 'var(--terracotta)' : 'var(--border)'}`,
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
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
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
                padding: '18px 6px', borderRadius: '16px', cursor: answered === null ? 'pointer' : 'default',
                fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: 'var(--ink)',
                background: showAsAnswer ? 'var(--tint-sage)' : chosen ? '#FBEAEA' : '#fff',
                border: `2px solid ${showAsAnswer ? 'var(--sage-ink, #2D5016)' : chosen ? '#c0392b' : 'var(--border)'}`,
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
            fontSize: '14px', lineHeight: 1.5, color: 'var(--ink)', marginTop: '14px', textAlign: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800,
          }}>
            {isCorrect ? 'Correct! ⭐' : answered === -1 ? `Time! It was ${item.answer}.` : `Not quite, it was ${item.answer}.`}
          </div>
          <button onClick={next} style={{
            marginTop: '14px', width: '100%', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
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
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        {game.stage} · {i + 1} of {game.items.length}
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.2rem, 4.5vw, 1.5rem)', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 14px' }}>
        {game.title}
      </h2>
      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '20px', boxShadow: '0 8px 24px rgba(46,40,24,0.1)', marginBottom: '16px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 8px' }}>Post {i + 1}</p>
        <p style={{ fontSize: '16px', lineHeight: 1.5, fontWeight: 600, margin: 0, color: 'var(--ink)' }}>{item.text}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button onClick={() => answer('left')} disabled={answered !== null} style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', padding: '15px', borderRadius: '15px',
          cursor: answered === null ? 'pointer' : 'default', background: '#fff', border: '2px solid var(--border)', color: 'var(--ink)',
        }}>{game.leftLabel}</button>
        <button onClick={() => answer('right')} disabled={answered !== null} style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', padding: '15px', borderRadius: '15px',
          cursor: answered === null ? 'pointer' : 'default', background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
          boxShadow: '0 4px 0 var(--terracotta-dark)',
        }}>{game.rightLabel}</button>
      </div>
      {answered !== null && (
        <div>
          <div style={{
            fontSize: '13.5px', lineHeight: 1.55, color: 'var(--ink)', marginTop: '14px',
            background: answered ? 'var(--stage-4)' : '#FBEAEA', borderLeft: `3px solid ${answered ? 'var(--gold-dark, #C99A28)' : '#c0392b'}`,
            borderRadius: '10px', padding: '12px 14px',
          }}>
            {answered ? 'Yes. ' : 'Not quite. '}{item.why}
          </div>
          <button onClick={next} style={{
            marginTop: '14px', width: '100%', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
            padding: '14px', borderRadius: '15px', border: 'none', background: 'var(--deep-teal)', color: '#fff', cursor: 'pointer',
          }}>{i + 1 < game.items.length ? 'Next post' : 'Finish'}</button>
        </div>
      )}
    </>
  )
}
