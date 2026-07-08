'use client'

import { useEffect, useRef } from 'react'

// A one shot celebration: a soft confetti burst in the Guided Childhood
// palette, fired when a real milestone lands, the daily practice done, a
// stage walked. Canvas based so it is cheap, self contained, and gone in
// a couple of seconds. Honours reduced motion by drawing nothing, the
// milestone copy around it still lands. This is the delight moment the
// design audit flagged as missing.

const COLORS = ['#EDC35F', '#C99A28', '#C8E6C9', '#FBCFE8', '#BAE6FD', '#E07A3F', '#2E2818']

type Particle = {
  x: number; y: number; vx: number; vy: number
  size: number; color: string; rot: number; vrot: number; life: number
}

export default function Celebration({ fire = true }: { fire?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!fire) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    // Two gentle bursts from the upper third, fanning out and down.
    const particles: Particle[] = []
    const spawn = (originX: number) => {
      for (let i = 0; i < 55; i++) {
        const angle = (Math.PI * (0.2 + (i / 55) * 0.6)) - Math.PI / 2
        const speed = 3 + (i % 7)
        particles.push({
          x: originX, y: h * 0.28,
          vx: Math.cos(angle) * speed * (i % 2 ? 1 : -1) * 0.7,
          vy: Math.sin(angle) * speed - 2,
          size: 5 + (i % 4) * 2,
          color: COLORS[i % COLORS.length],
          rot: i, vrot: (i % 2 ? 1 : -1) * 0.2,
          life: 1,
        })
      }
    }
    spawn(w * 0.32)
    spawn(w * 0.68)

    let raf = 0
    let frame = 0
    const tick = () => {
      frame++
      ctx.clearRect(0, 0, w, h)
      let alive = false
      for (const p of particles) {
        if (p.life <= 0) continue
        alive = true
        p.vy += 0.12          // gravity
        p.vx *= 0.99          // drag
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vrot
        if (frame > 70) p.life -= 0.02
        ctx.save()
        ctx.globalAlpha = Math.max(0, p.life)
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      }
      if (alive && frame < 200) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, w, h)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [fire])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 5,
      }}
    />
  )
}
