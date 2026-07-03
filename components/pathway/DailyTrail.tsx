'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import DigiCharacter, { type DigiMood } from '@/components/digi/DigiCharacter'
import type { DailyTask } from '@/lib/pathway/daily-tasks'

// The day at a glance, Duolingo style: five real tasks on a winding trail.
// DiGi walks to the first one that is not done, hops, and tells the parent
// exactly what to do next, with the real solution one tap away. Nothing is
// locked: every node is a link, DiGi just leads.

const VIEW_W = 360
const VIEW_H = 470

const NODE_POS = [
  { x: 70,  y: 50 },
  { x: 290, y: 140 },
  { x: 70,  y: 235 },
  { x: 290, y: 330 },
  { x: 180, y: 420 },
]

const TASK_ICON: Record<DailyTask['key'], string> = {
  moment: '☀️',
  script: '💬',
  lesson: '📖',
  device: '📱',
  checkin: '🪴',
}

function segmentD(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = a.x + (b.x - a.x) / 2
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`
}

function fullPathD() {
  let d = `M ${NODE_POS[0].x} ${NODE_POS[0].y}`
  for (let i = 1; i < NODE_POS.length; i++) {
    const a = NODE_POS[i - 1], b = NODE_POS[i]
    const mx = a.x + (b.x - a.x) / 2
    d += ` C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`
  }
  return d
}

export default function DailyTrail({ tasks }: { tasks: DailyTask[] }) {
  const pathRef = useRef<SVGPathElement>(null)
  const progressRef = useRef<SVGPathElement>(null)
  const digiWrapRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [digiPos, setDigiPos] = useState({ x: NODE_POS[0].x, y: NODE_POS[0].y })
  const [arrived, setArrived] = useState(false)

  const pathD = useMemo(fullPathD, [])

  const activeIndex = tasks.findIndex(t => !t.done)
  const allDone = activeIndex === -1
  const targetIndex = allDone ? tasks.length - 1 : activeIndex
  const activeTask = allDone ? null : tasks[targetIndex]
  const digiMood: DigiMood = allDone ? 'happy' : arrived ? 'speak' : 'idle'

  useEffect(() => {
    const path = pathRef.current
    const progress = progressRef.current
    if (!path || !progress) return

    const ns = 'http://www.w3.org/2000/svg'
    let targetLen = 0
    for (let i = 0; i < targetIndex; i++) {
      const seg = document.createElementNS(ns, 'path')
      seg.setAttribute('d', segmentD(NODE_POS[i], NODE_POS[i + 1]))
      targetLen += seg.getTotalLength()
    }

    const total = path.getTotalLength()
    progress.style.strokeDasharray = `${total}`

    const setAt = (len: number) => {
      const pt = path.getPointAtLength(len)
      setDigiPos({ x: pt.x, y: pt.y })
      progress.style.strokeDashoffset = `${total - len}`
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setAt(targetLen)
      setArrived(true)
      return
    }

    const walker = { len: 0 }
    const tl = gsap.timeline()
    tl.to(walker, {
      len: targetLen,
      duration: targetLen > 0 ? 1.8 : 0.01,
      delay: 0.3,
      ease: 'power2.inOut',
      onUpdate: () => setAt(walker.len),
    })
    // The arrival hop, then the bubble pops in.
    if (digiWrapRef.current) {
      tl.to(digiWrapRef.current, { y: -14, duration: 0.18, ease: 'power2.out' })
        .to(digiWrapRef.current, { y: 0, duration: 0.3, ease: 'bounce.out' })
    }
    tl.call(() => setArrived(true))

    return () => { tl.kill() }
  }, [targetIndex])

  useEffect(() => {
    if (!arrived || !bubbleRef.current) return
    gsap.fromTo(bubbleRef.current, { opacity: 0, scale: 0.7, y: 8 }, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.8)' })
  }, [arrived])

  const bubbleLeft = digiPos.x <= VIEW_W / 2

  return (
    <div style={{ position: 'relative', maxWidth: '420px', margin: '0 auto' }}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ width: '100%', height: 'auto', display: 'block' }} aria-label="Today on your pathway">
        <path ref={pathRef} d={pathD} fill="none" stroke="var(--border)" strokeWidth="7" strokeLinecap="round" strokeDasharray="1 14" />
        <path ref={progressRef} d={pathD} fill="none" stroke="var(--terracotta)" strokeWidth="7" strokeLinecap="round" style={{ strokeDashoffset: 99999 }} />

        {tasks.map((task, i) => {
          const n = NODE_POS[i]
          const isActive = i === targetIndex && !allDone
          const labelLeft = n.x > VIEW_W / 2
          return (
            <a key={task.key} href={task.href} aria-label={task.label}>
              {isActive && (
                <circle cx={n.x} cy={n.y} r={24} fill="none" stroke="var(--terracotta)" strokeWidth="2" opacity="0.45" />
              )}
              <circle
                cx={n.x} cy={n.y} r={20}
                fill={task.done ? 'var(--terracotta)' : '#fff'}
                stroke={task.done || isActive ? 'var(--terracotta)' : 'var(--border)'}
                strokeWidth={isActive ? 3.5 : 2.5}
              />
              {task.done ? (
                <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle" fill="#fff" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px' }}>✓</text>
              ) : (
                <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '15px' }}>{TASK_ICON[task.key]}</text>
              )}
              <text
                x={labelLeft ? n.x - 32 : n.x + 32} y={n.y + 4}
                textAnchor={labelLeft ? 'end' : 'start'}
                style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px' }}
                fill={task.done ? 'var(--ink-muted)' : 'var(--ink)'}
              >
                {task.label.length > 24 ? `${task.label.slice(0, 23)}…` : task.label}
              </text>
            </a>
          )
        })}
      </svg>

      {/* DiGi, walking then talking */}
      <div
        ref={digiWrapRef}
        style={{
          position: 'absolute',
          left: `${(digiPos.x / VIEW_W) * 100}%`,
          top: `${(digiPos.y / VIEW_H) * 100}%`,
          transform: 'translate(-50%, -108%)',
          pointerEvents: 'none',
        }}
      >
        <DigiCharacter mood={digiMood} size={52} />
      </div>

      {/* The prompt: what to do next, with the real solution one tap away */}
      {arrived && (
        <div
          ref={bubbleRef}
          style={{
            position: 'absolute',
            top: `${(digiPos.y / VIEW_H) * 100}%`,
            ...(bubbleLeft
              ? { left: `calc(${(digiPos.x / VIEW_W) * 100}% + 40px)` }
              : { right: `calc(${((VIEW_W - digiPos.x) / VIEW_W) * 100}% + 40px)` }),
            transform: 'translateY(-110%)',
            background: '#fff',
            border: '1.5px solid var(--border)',
            borderRadius: bubbleLeft ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
            boxShadow: '0 8px 28px rgba(26,26,46,0.12)',
            padding: '14px 16px',
            width: 'min(220px, 56vw)',
            opacity: 0,
          }}
        >
          {allDone ? (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)', marginBottom: '4px' }}>
                All done for today
              </div>
              <p style={{ fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
                Every step walked. See you tomorrow, or ask me anything tonight.
              </p>
            </>
          ) : activeTask && (
            <>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '5px' }}>
                Next on your path
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.3, marginBottom: '4px' }}>
                {activeTask.label}
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: '10px' }}>
                {activeTask.detail}
              </p>
              <Link
                href={activeTask.href}
                className="btn btn-gold"
                style={{ pointerEvents: 'auto', width: '100%', justifyContent: 'center', fontSize: '11.5px', padding: '9px 12px' }}
              >
                Take me there
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
