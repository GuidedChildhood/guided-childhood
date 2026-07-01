'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import DigiCharacter from '@/components/digi/DigiCharacter'

// The Duolingo moment: a winding trail through the five stages with DiGi
// walking it. On load, DiGi travels from the start of the path to the
// family's true position (completed stages plus the blended progress
// percentage within the current one) while the trail draws in behind.

const VIEW_W = 360
const VIEW_H = 600

const NODES = [
  { x: 70,  y: 60,  label: 'Foundation',  ages: '4 to 7',   bold: 'var(--stage-1-bold)', text: 'var(--stage-1-text)' },
  { x: 290, y: 175, label: 'First Steps', ages: '8 to 10',  bold: 'var(--stage-2-bold)', text: 'var(--stage-2-text)' },
  { x: 70,  y: 300, label: 'Explorer',    ages: '11 to 13', bold: 'var(--stage-3-bold)', text: 'var(--stage-3-text)' },
  { x: 290, y: 425, label: 'Navigator',   ages: '13 to 15', bold: 'var(--stage-4-bold)', text: 'var(--stage-4-text)' },
  { x: 180, y: 545, label: 'Independent', ages: '16 plus',  bold: 'var(--stage-5-bold)', text: 'var(--stage-5-text)' },
]

// Horizontal tangents at every node make the trail snake, not zigzag.
function segmentD(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = a.x + (b.x - a.x) / 2
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`
}

function fullPathD() {
  let d = `M ${NODES[0].x} ${NODES[0].y}`
  for (let i = 1; i < NODES.length; i++) {
    const a = NODES[i - 1], b = NODES[i]
    const mx = a.x + (b.x - a.x) / 2
    d += ` C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`
  }
  return d
}

export default function PathwayMap({
  currentStageNum,
  progressPct,
}: {
  currentStageNum: number
  progressPct: number
}) {
  const pathRef = useRef<SVGPathElement>(null)
  const progressRef = useRef<SVGPathElement>(null)
  const digiRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const [digiPos, setDigiPos] = useState({ x: NODES[0].x, y: NODES[0].y })

  const pathD = useMemo(fullPathD, [])

  useEffect(() => {
    const path = pathRef.current
    const progress = progressRef.current
    if (!path || !progress) return

    // Length along the trail where this family currently stands: every
    // completed stage's segment in full, plus the blended percentage of the
    // segment they are on now.
    const segLengths: number[] = []
    const ns = 'http://www.w3.org/2000/svg'
    for (let i = 1; i < NODES.length; i++) {
      const seg = document.createElementNS(ns, 'path')
      seg.setAttribute('d', segmentD(NODES[i - 1], NODES[i]))
      segLengths.push(seg.getTotalLength())
    }
    const doneSegs = Math.min(currentStageNum - 1, segLengths.length)
    let targetLen = 0
    for (let i = 0; i < doneSegs; i++) targetLen += segLengths[i]
    if (doneSegs < segLengths.length) {
      targetLen += segLengths[doneSegs] * Math.min(progressPct, 100) / 100
    }

    const total = path.getTotalLength()
    progress.style.strokeDasharray = `${total}`

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const setAt = (len: number) => {
      const pt = path.getPointAtLength(len)
      setDigiPos({ x: pt.x, y: pt.y })
      progress.style.strokeDashoffset = `${total - len}`
    }

    if (reduced) {
      setAt(targetLen)
      return
    }

    const walker = { len: 0 }
    const tween = gsap.to(walker, {
      len: targetLen,
      duration: 2.2,
      delay: 0.3,
      ease: 'power2.inOut',
      onUpdate: () => setAt(walker.len),
    })

    let pulse: gsap.core.Tween | null = null
    if (ringRef.current) {
      pulse = gsap.to(ringRef.current, {
        attr: { r: 30 }, opacity: 0, duration: 1.6, repeat: -1, ease: 'sine.out',
      })
    }

    return () => { tween.kill(); pulse?.kill() }
  }, [currentStageNum, progressPct])

  return (
    <div style={{ position: 'relative', maxWidth: '420px', margin: '0 auto' }}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ width: '100%', height: 'auto', display: 'block' }} aria-label="Your pathway from age 4 to 16">
        {/* Trail base: dotted, the road not yet walked */}
        <path ref={pathRef} d={pathD} fill="none" stroke="var(--border)" strokeWidth="7" strokeLinecap="round" strokeDasharray="1 14" />
        {/* Trail walked: solid, draws in behind DiGi */}
        <path ref={progressRef} d={pathD} fill="none" stroke="var(--terracotta)" strokeWidth="7" strokeLinecap="round" style={{ strokeDashoffset: 99999 }} />

        {NODES.map((n, i) => {
          const stageNum = i + 1
          const done = stageNum < currentStageNum
          const isCurrent = stageNum === currentStageNum
          const labelLeft = n.x > VIEW_W / 2
          return (
            <g key={i}>
              {isCurrent && (
                <circle ref={ringRef} cx={n.x} cy={n.y} r={20} fill="none" stroke="var(--terracotta)" strokeWidth="2.5" opacity="0.8" />
              )}
              <circle
                cx={n.x} cy={n.y} r={19}
                fill={done ? n.bold : '#fff'}
                stroke={done || isCurrent ? 'var(--terracotta)' : 'var(--border)'}
                strokeWidth={isCurrent ? 3.5 : 2.5}
              />
              <text
                x={n.x} y={n.y + 1}
                textAnchor="middle" dominantBaseline="middle"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px' }}
                fill={done ? n.text : isCurrent ? 'var(--terracotta)' : 'var(--ink-light)'}
              >
                {done ? '✓' : stageNum}
              </text>
              <text
                x={labelLeft ? n.x - 30 : n.x + 30} y={n.y - 5}
                textAnchor={labelLeft ? 'end' : 'start'}
                style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px' }}
                fill="var(--ink)"
              >
                {n.label}
              </text>
              <text
                x={labelLeft ? n.x - 30 : n.x + 30} y={n.y + 12}
                textAnchor={labelLeft ? 'end' : 'start'}
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '10px', letterSpacing: '0.06em' }}
                fill="var(--ink-muted)"
              >
                Ages {n.ages}
              </text>
            </g>
          )
        })}
      </svg>

      {/* DiGi walking the trail, positioned in the SVG's coordinate space */}
      <div
        ref={digiRef}
        style={{
          position: 'absolute',
          left: `${(digiPos.x / VIEW_W) * 100}%`,
          top: `${(digiPos.y / VIEW_H) * 100}%`,
          transform: 'translate(-50%, -100%)',
          pointerEvents: 'none',
        }}
      >
        <div style={{
          position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: '100px',
          padding: '3px 10px', fontFamily: 'var(--font-mono)', fontSize: '10px',
          fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap',
          boxShadow: '0 3px 0 var(--terracotta-dark)',
        }}>
          {Math.min(progressPct, 100)}%
        </div>
        <DigiCharacter mood="idle" size={54} />
      </div>
    </div>
  )
}
