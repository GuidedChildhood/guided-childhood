'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// The animated lesson intro: DiGi the golden star (DiGi Junior wears the
// number 10 football kit, so a star with a ball is on brand and never the
// legacy robot or owl) does a lively kick, the ball arcs across, sparkles
// trail, and the lesson title reveals word by word. Pure SVG and GSAP, no
// render pipeline, so it ships without credits, loads instantly and can be
// tuned to perfect. This replaces the busy classroom video as the opener.

export default function AnimatedIntro({
  title,
  eyebrow,
  onStart,
  accent = 'var(--terracotta)',
}: {
  title: string
  eyebrow?: string
  onStart?: () => void
  accent?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const [replay, setReplay] = useState(0)
  const words = title.split(/(\s+)/)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const star = el.querySelector('[data-star]')
    const ball = el.querySelector('[data-ball]')
    const grass = el.querySelectorAll('[data-blade]')
    const wordEls = el.querySelectorAll('[data-word]')
    const sparks = el.querySelectorAll('[data-spark]')
    const eyebrowEl = el.querySelector('[data-eyebrow]')
    const cta = el.querySelector('[data-cta]')

    if (reduce) {
      gsap.set([star, ball, ...wordEls, eyebrowEl, cta], { opacity: 1, x: 0, y: 0, scale: 1 })
      return
    }

    const tl = gsap.timeline()
    // Grass sways in
    tl.fromTo(grass, { scaleY: 0, transformOrigin: 'bottom center' }, { scaleY: 1, duration: 0.4, stagger: 0.03, ease: 'back.out(2)' }, 0)
    // Star drops in with a bounce and a wind up lean
    tl.fromTo(star, { y: -160, scale: 0.4, opacity: 0, rotation: -18 },
      { y: 0, scale: 1, opacity: 1, rotation: -8, duration: 0.7, ease: 'bounce.out' }, 0.1)
    // The kick: star lunges forward and snaps upright
    tl.to(star, { rotation: 10, x: 8, duration: 0.14, ease: 'power2.in' }, 0.95)
    tl.to(star, { rotation: 0, x: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, 1.1)
    // Ball is struck: arcs up and across, spinning, then drops and rests
    // on the grass to the right of the star. x runs the whole flight so it
    // never stalls mid air; y goes up then bounces down to the grass line.
    tl.fromTo(ball, { x: -6, y: 0, opacity: 1, rotation: 0 },
      { x: 96, rotation: 540, duration: 0.75, ease: 'none' }, 1.04)
    tl.to(ball, { y: -64, duration: 0.36, ease: 'power2.out' }, 1.04)
    tl.to(ball, { y: 2, duration: 0.4, ease: 'bounce.out' }, 1.42)
    // Sparks burst at the moment of contact
    tl.fromTo(sparks, { scale: 0, opacity: 1, x: 0, y: 0 },
      { scale: 1, opacity: 0, duration: 0.55, ease: 'power2.out',
        x: () => gsap.utils.random(-40, 40), y: () => gsap.utils.random(-46, -6) }, 1.05)
    // Title reveals word by word
    tl.fromTo(eyebrowEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, 0.5)
    tl.fromTo(wordEls, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.07, ease: 'back.out(1.6)' }, 1.3)
    tl.fromTo(cta, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.6)' }, '>-0.1')
    // Gentle idle bob on the star after it lands
    tl.to(star, { y: -8, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 2.2)

    return () => { tl.kill() }
  }, [replay])

  return (
    <div
      ref={root}
      style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #1F5560 0%, #173C46 60%, #12313A 100%)',
        borderRadius: '22px', padding: '30px 24px 26px', textAlign: 'center',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,0.25)',
      }}
    >
      {/* Soft gold glow behind the star */}
      <div aria-hidden style={{ position: 'absolute', top: '18%', left: '50%', width: 260, height: 260, transform: 'translateX(-50%)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(237,195,95,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {eyebrow && (
        <div data-eyebrow style={{ opacity: 0, fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '14px' }}>
          {eyebrow}
        </div>
      )}

      {/* The pitch: star, ball, grass */}
      <div style={{ position: 'relative', height: 148, margin: '0 auto 18px', maxWidth: 300 }}>
        {/* Grass blades along the bottom */}
        <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', gap: '5px' }}>
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} data-blade style={{ width: 3, height: 10 + (i % 3) * 4, background: 'rgba(143,191,108,0.6)', borderRadius: '2px' }} />
          ))}
        </div>

        {/* Sparks at contact point */}
        <div aria-hidden style={{ position: 'absolute', left: '46%', bottom: 34 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} data-spark style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: 'var(--terracotta)', opacity: 0 }} />
          ))}
        </div>

        {/* DiGi the star, number 10 football kit implied by the ball */}
        <div data-star style={{ position: 'absolute', left: '50%', bottom: 22, transform: 'translateX(-50%)', width: 92, height: 92 }}>
          <svg viewBox="0 0 64 64" width="92" height="92">
            <path d="M32 3 L40 22.5 L60.5 24.5 L45 38 L49 58.5 L32 47.5 L15 58.5 L19 38 L3.5 24.5 L24 22.5 Z" fill="#EDC35F" stroke="#C99A28" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="26" cy="31" r="2.6" fill="#1A1A2E" />
            <circle cx="38" cy="31" r="2.6" fill="#1A1A2E" />
            <path d="M25.5 38 q 6.5 6 13 0" fill="none" stroke="#1A1A2E" strokeWidth="2.6" strokeLinecap="round" />
            {/* rosy cheeks */}
            <circle cx="21.5" cy="36" r="2.4" fill="#F4A9A0" opacity="0.7" />
            <circle cx="42.5" cy="36" r="2.4" fill="#F4A9A0" opacity="0.7" />
          </svg>
        </div>

        {/* The football */}
        <div data-ball style={{ position: 'absolute', left: 'calc(50% - 40px)', bottom: 20, width: 26, height: 26 }}>
          <svg viewBox="0 0 32 32" width="26" height="26">
            <circle cx="16" cy="16" r="15" fill="#fff" stroke="#1A1A2E" strokeWidth="1.5" />
            <path d="M16 7 l4 3 -1.5 5 h-5 L12 10 Z" fill="#1A1A2E" />
            <path d="M16 7 V3 M20 10 l4 -1.5 M18.5 15 l3.5 3 M13.5 15 l-3.5 3 M12 10 l-4 -1.5" stroke="#1A1A2E" strokeWidth="1.3" />
          </svg>
        </div>
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.12, letterSpacing: '-0.02em', margin: '0 0 20px' }}>
        {words.map((w, i) => (
          w.trim() === '' ? w : <span key={i} data-word style={{ display: 'inline-block', opacity: 0 }}>{w}</span>
        ))}
      </h1>

      {onStart && (
        <button
          data-cta
          onClick={onStart}
          style={{
            opacity: 0, background: accent, color: 'var(--ink)', border: 'none',
            borderRadius: '16px', padding: '14px 30px', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          Let&apos;s go ▶
        </button>
      )}

      {/* Replay, quietly, so a child can watch it again */}
      <button
        onClick={() => setReplay(r => r + 1)}
        aria-label="Play the intro again"
        style={{
          position: 'absolute', top: 12, right: 14, background: 'rgba(255,255,255,0.14)',
          border: 'none', borderRadius: '100px', width: 30, height: 30, cursor: 'pointer',
          color: '#fff', fontSize: '13px',
        }}
      >
        ↻
      </button>
    </div>
  )
}
