'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import KidIcon from './KidIcon'

// The little cheer when a child ticks a job done: a handful of stars springing
// out from the tick and fading, GSAP only and gone in under a second, so it
// lands as delight and never gets in the way. Honours reduced motion by drawing
// nothing, the sound and the news card still carry the moment.

const STARS = 7

export default function KidTickBurst({ color = 'var(--terracotta)' }: { color?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const pieces = Array.from(root.children) as HTMLElement[]
    const tl = gsap.timeline()
    pieces.forEach((el, i) => {
      const angle = (i / STARS) * Math.PI * 2
      const dist = 30 + (i % 3) * 10
      const at = i * 0.015
      // Spring out and grow, staying bright, then fade only at the end, so the
      // stars are actually seen on their way out instead of vanishing at once.
      tl.fromTo(el,
        { x: 0, y: 0, scale: 0.3, opacity: 1 },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 4,
          scale: 0.9 + (i % 3) * 0.3,
          duration: 0.7,
          ease: 'back.out(1.7)',
        },
        at,
      )
      tl.to(el, { opacity: 0, duration: 0.32, ease: 'power2.in' }, at + 0.42)
    })
    return () => { tl.kill() }
  }, [])

  return (
    <span ref={ref} aria-hidden style={{ position: 'absolute', inset: 0, display: 'block', pointerEvents: 'none' }}>
      {Array.from({ length: STARS }).map((_, i) => (
        <span key={i} style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -8, marginLeft: -8, display: 'block' }}>
          <KidIcon name="star" size={16} color={color} />
        </span>
      ))}
    </span>
  )
}
