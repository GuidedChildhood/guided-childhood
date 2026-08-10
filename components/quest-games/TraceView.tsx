'use client'

import { useRef, useState } from 'react'
import type { TraceGame } from '@/lib/quest-games/registry'
import { characterByKey } from '@/lib/content/stage-characters'

// Trace with Pebble. The letterform sits faint on the page, the child puts a
// finger on the start dot and follows the guide points stroke by stroke, and
// the letter fills in butter gold behind their finger. Duolingo ABC's proven
// pattern, rebuilt to our rules (quest-games-plan sections 8 and 9): no
// timer, no failing, forgiving touch targets, and lifting a finger mid
// stroke loses nothing. A single point stroke (the dot on i) is a tap.

const BOX_W = 100
const BOX_H = 140
// How close a finger must pass to a guide point, in viewBox units. Generous
// on purpose: a four year old's aim is the whole audience.
const HIT_RADIUS = 12

export default function TraceView({ game, onDone }: { game: TraceGame; onDone: () => void }) {
  const guide = characterByKey(game.guide)
  const svgRef = useRef<SVGSVGElement>(null)
  const [letterIdx, setLetterIdx] = useState(0)
  const [strokeIdx, setStrokeIdx] = useState(0)
  const [pointIdx, setPointIdx] = useState(0)     // next guide point to hit
  const [letterDone, setLetterDone] = useState(false)

  const item = game.items[letterIdx]
  const strokes = item.strokes
  const isLast = letterIdx === game.items.length - 1

  function toBox(e: React.PointerEvent): [number, number] {
    const r = svgRef.current!.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * BOX_W, ((e.clientY - r.top) / r.height) * BOX_H]
  }

  function advance(x: number, y: number) {
    if (letterDone) return
    const stroke = strokes[strokeIdx]
    let p = pointIdx
    // A finger can sweep past several guide points in one move event.
    while (p < stroke.length && Math.hypot(stroke[p][0] - x, stroke[p][1] - y) <= HIT_RADIUS) p++
    if (p === pointIdx) return
    if (p < stroke.length) { setPointIdx(p); return }
    // Stroke finished.
    if (strokeIdx + 1 < strokes.length) { setStrokeIdx(strokeIdx + 1); setPointIdx(0) }
    else setLetterDone(true)
  }

  function onPointer(e: React.PointerEvent) {
    if (e.buttons === 0 && e.type === 'pointermove') return
    const [x, y] = toBox(e)
    advance(x, y)
  }

  function nextLetter() {
    if (isLast) { onDone(); return }
    setLetterIdx(letterIdx + 1)
    setStrokeIdx(0)
    setPointIdx(0)
    setLetterDone(false)
  }

  function restartLetter() {
    setStrokeIdx(0)
    setPointIdx(0)
    setLetterDone(false)
  }

  const current = strokes[strokeIdx]
  const nextPoint = letterDone ? null : current[Math.min(pointIdx, current.length - 1)]
  const poly = (pts: [number, number][]) => pts.map(p => p.join(',')).join(' ')

  return (
    <>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        {game.stage} · letter {letterIdx + 1} of {game.items.length}
      </div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.2rem, 4.5vw, 1.5rem)', letterSpacing: '-0.02em', lineHeight: 1.15, margin: '0 0 4px' }}>
        Trace the letter {item.glyph}
      </h2>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-muted)', margin: '0 0 10px' }}>
        {item.sound}
      </p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${BOX_W} ${BOX_H}`}
          onPointerDown={onPointer}
          onPointerMove={onPointer}
          style={{ width: 'min(100%, 280px)', touchAction: 'none', background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', cursor: 'crosshair' }}
        >
          {/* Exercise book lines, so the letter has a home like it does at school */}
          <line x1="6" y1="55" x2="94" y2="55" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="6" y1="110" x2="94" y2="110" stroke="var(--border)" strokeWidth="1" />

          {/* The whole letterform, faint, the ground the child writes on */}
          {strokes.map((s, i) => s.length > 1
            ? <polyline key={i} points={poly(s)} fill="none" stroke="rgba(26,26,46,0.10)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
            : <circle key={i} cx={s[0][0]} cy={s[0][1]} r="5.5" fill="rgba(26,26,46,0.10)" />)}

          {/* Finished strokes in butter */}
          {strokes.slice(0, strokeIdx + (letterDone ? 1 : 0)).map((s, i) => s.length > 1
            ? <polyline key={i} points={poly(s)} fill="none" stroke="var(--terracotta)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
            : <circle key={i} cx={s[0][0]} cy={s[0][1]} r="5.5" fill="var(--terracotta)" />)}

          {!letterDone && (
            <>
              {/* Progress along the current stroke */}
              {pointIdx > 0 && current.length > 1 && (
                <polyline points={poly(current.slice(0, pointIdx))} fill="none" stroke="var(--terracotta)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              )}
              {/* Guide points still to hit */}
              {current.slice(pointIdx).map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r="2.2" fill="var(--terracotta-dark)" opacity="0.5" />
              ))}
              {/* The next point, big and obvious: put your finger here */}
              {nextPoint && (
                <>
                  <circle cx={nextPoint[0]} cy={nextPoint[1]} r="9" fill="var(--terracotta)" opacity="0.35" />
                  <circle cx={nextPoint[0]} cy={nextPoint[1]} r="4.5" fill="var(--terracotta-dark)" />
                </>
              )}
            </>
          )}
        </svg>
      </div>

      {letterDone ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', background: 'var(--tint-sage)', borderLeft: '3px solid var(--sage-ink, #2D5016)', borderRadius: '10px', padding: '10px 14px' }}>
            {guide && <img src={guide.cutout} alt={guide.name} width={40} height={40} style={{ objectFit: 'contain', flexShrink: 0 }} />}
            <span style={{ fontSize: 'var(--text-base)', lineHeight: 1.5, fontWeight: 600, color: 'var(--ink)' }}>
              You wrote {item.glyph}! {item.sound}.
            </span>
          </div>
          <button onClick={nextLetter} style={{
            marginTop: '14px', width: '100%', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            padding: '14px', borderRadius: '16px', border: 'none', background: 'var(--terracotta)', color: 'var(--ink)',
            boxShadow: '0 5px 0 var(--terracotta-dark)', cursor: 'pointer',
          }}>{isLast ? 'Finish' : 'Next letter'}</button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', fontWeight: 600 }}>
            {current.length === 1 ? 'Tap the dot' : 'Follow the dots from the big one'}
          </span>
          <button onClick={restartLetter} style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-muted)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
            Start again
          </button>
        </div>
      )}
    </>
  )
}
