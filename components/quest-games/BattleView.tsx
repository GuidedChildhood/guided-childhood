'use client'

import { useState } from 'react'
import type { BattleGame } from '@/lib/quest-games/registry'
import { characterByKey } from '@/lib/content/stage-characters'

// The DiGi Quiz Battle. The child's Planet Friend faces a friendly trouble
// (the Muddle, the Tangle) and every right answer powers the Friend's move.
// Built to the quest games rules in plans/quest-games-plan.md section 8:
// there is no losing side for the child. A wrong answer means the move
// fizzles, the right answer is shown kindly and the question returns later
// in the set, so the battle always ends in a win once every question is
// beaten. No timer, no randomness, fixed stars, calm finish.

export default function BattleView({ game, onDone }: { game: BattleGame; onDone: () => void }) {
  const hero = characterByKey(game.hero)
  const total = game.questions.length
  const [started, setStarted] = useState(false)
  // The set is a queue of question indices. A miss sends the question to the
  // back of the queue rather than counting against the child.
  const [queue, setQueue] = useState(() => game.questions.map((_, i) => i))
  const [hits, setHits] = useState(0)
  const [answered, setAnswered] = useState<number | null>(null)
  const [moveCount, setMoveCount] = useState(0)

  const eyebrowStyle = {
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px',
  } as const
  const bigBtnStyle = {
    width: '100%', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
    padding: '14px', borderRadius: '16px', border: 'none', background: 'var(--terracotta)', color: 'var(--ink)',
    boxShadow: '0 5px 0 var(--terracotta-dark)', cursor: 'pointer',
  } as const

  if (!started) {
    return (
      <>
        <div style={eyebrowStyle}>{game.stage}</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.2rem, 4.5vw, 1.5rem)', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 16px' }}>
          {game.title}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', margin: '18px 0' }}>
          {hero && (
            <img src={hero.cutout} alt={hero.name} width={110} height={110} style={{ width: 'min(28vw, 110px)', height: 'auto', objectFit: 'contain' }} />
          )}
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>VS</span>
          <span style={{ fontSize: 'min(18vw, 80px)', lineHeight: 1 }}>{game.opponent.emoji}</span>
        </div>
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '16px 18px', marginBottom: '16px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>
            {game.opponent.name} says
          </p>
          <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.5, fontWeight: 600, margin: 0, color: 'var(--ink)' }}>{game.opponent.taunt}</p>
        </div>
        <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.5, color: 'var(--ink-muted)', margin: '0 0 14px' }}>
          Every right answer powers {hero ? hero.name : 'your Friend'}. Clear all {total} to win. No rush and no losing, a missed one simply comes back around.
        </p>
        <button onClick={() => setStarted(true)} style={bigBtnStyle}>Start the battle</button>
      </>
    )
  }

  const item = game.questions[queue[0]]
  const isCorrect = answered !== null && answered === item.answer
  const won = hits === total
  const longOptions = item.options.some(o => o.length > 8)
  const move = game.moves[moveCount % game.moves.length]

  function pick(idx: number) {
    if (answered !== null) return
    setAnswered(idx)
    if (idx === item.answer) {
      setHits(hits + 1)
      setMoveCount(moveCount + 1)
    }
  }
  function next() {
    if (won) { onDone(); return }
    setQueue(isCorrect ? queue.slice(1) : [...queue.slice(1), queue[0]])
    setAnswered(null)
  }

  return (
    <>
      <div style={eyebrowStyle}>{game.stage} · {total - hits} to clear</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <span style={{ fontSize: '26px', lineHeight: 1 }}>{game.opponent.emoji}</span>
        <div style={{ flex: 1, height: '10px', borderRadius: '8px', background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: '8px', background: 'var(--deep-teal)', width: `${((total - hits) / total) * 100}%`, transition: 'width .3s' }} />
        </div>
        {hero && (
          <img src={hero.cutout} alt={hero.name} width={38} height={38} style={{ objectFit: 'contain', flexShrink: 0 }} />
        )}
      </div>

      <div style={{ textAlign: 'center', margin: '6px 0 18px' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--ink)',
          fontSize: item.q.length > 24 ? 'clamp(1.15rem, 4.5vw, 1.45rem)' : 'clamp(2rem, 10vw, 3rem)',
          lineHeight: item.q.length > 24 ? 1.3 : 1.05,
        }}>
          {item.q}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: longOptions ? '1fr' : 'repeat(3, 1fr)', gap: '10px' }}>
        {item.options.map((opt, idx) => {
          const chosen = answered === idx
          const showAsAnswer = answered !== null && idx === item.answer
          return (
            <button
              key={idx}
              onClick={() => pick(idx)}
              disabled={answered !== null}
              style={{
                padding: longOptions ? '14px 16px' : '18px 6px', borderRadius: '16px', cursor: answered === null ? 'pointer' : 'default',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: longOptions ? 'var(--text-md)' : 'var(--text-xl)', color: 'var(--ink)',
                background: showAsAnswer ? 'var(--tint-sage)' : chosen ? '#FBEAEA' : '#fff',
                border: `2px solid ${showAsAnswer ? 'var(--sage-ink, #2D5016)' : chosen ? '#c0392b' : 'var(--border)'}`,
                textAlign: longOptions ? 'left' : 'center',
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
            fontSize: 'var(--text-base)', lineHeight: 1.55, color: 'var(--ink)', marginTop: '14px',
            background: isCorrect ? 'var(--tint-sage)' : '#FBEAEA',
            borderLeft: `3px solid ${isCorrect ? 'var(--sage-ink, #2D5016)' : '#c0392b'}`,
            borderRadius: '10px', padding: '12px 14px', fontWeight: 600,
          }}>
            {won
              ? `${move}! ${game.opponent.beaten}`
              : isCorrect
                ? `${move}! A direct hit on ${game.opponent.name}.`
                : `The move fizzled. The answer is ${item.options[item.answer]}. That one will come back around.`}
          </div>
          <button onClick={next} style={{ ...bigBtnStyle, marginTop: '14px', background: 'var(--deep-teal)', color: '#fff', boxShadow: 'none', borderRadius: '15px' }}>
            {won ? 'Finish' : 'Next'}
          </button>
        </div>
      )}
    </>
  )
}
