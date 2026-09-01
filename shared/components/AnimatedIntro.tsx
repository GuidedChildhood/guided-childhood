'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { introCharacterFor } from '../intro-characters'

// The lesson intro: the real DiGi Squad character (the footballer, the
// dancer, the celebration leap) plays in a clean framed clip while a
// speech bubble types their warm hello and the lesson title reveals. No
// busy classroom, just the character and a simple spoken welcome, which is
// what JP asked for. The clip is muted and loops; a child taps to begin.

export default function AnimatedIntro({
  title,
  eyebrow,
  character,
  onStart,
}: {
  title: string
  eyebrow?: string
  character?: string
  onStart?: () => void
}) {
  const root = useRef<HTMLDivElement>(null)
  const c = introCharacterFor(character, title)
  const [typed, setTyped] = useState('')

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const frame = el.querySelector('[data-frame]')
    const bubble = el.querySelector('[data-bubble]')
    const words = el.querySelectorAll('[data-word]')
    const eyebrowEl = el.querySelector('[data-eyebrow]')
    const cta = el.querySelector('[data-cta]')

    if (reduce) {
      gsap.set([frame, bubble, ...words, eyebrowEl, cta], { opacity: 1, y: 0, scale: 1 })
      setTyped(c.line)
      return
    }

    const tl = gsap.timeline()
    tl.fromTo(eyebrowEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, 0.1)
    tl.fromTo(frame, { opacity: 0, scale: 0.85, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }, 0.2)
    tl.fromTo(bubble, { opacity: 0, y: 12, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, 0.7)
    tl.fromTo(words, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'back.out(1.6)' }, 0.9)
    tl.fromTo(cta, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, '>-0.1')

    // Type the character's hello out word by word, starting as the bubble lands
    const parts = c.line.split(/(\s+)/)
    let i = 0
    const typer = setInterval(() => {
      i += 1
      setTyped(parts.slice(0, i).join(''))
      if (i >= parts.length) clearInterval(typer)
    }, 90)

    return () => { tl.kill(); clearInterval(typer) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, character])

  const titleWords = title.split(/(\s+)/)

  return (
    <div
      ref={root}
      style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #1F5560 0%, #173C46 60%, #12313A 100%)',
        borderRadius: '22px', padding: '22px 20px 24px', textAlign: 'center',
      }}
    >
      {eyebrow && (
        <div data-eyebrow style={{ opacity: 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '14px' }}>
          {eyebrow}
        </div>
      )}

      {/* Speech bubble ABOVE the frame, tail pointing down at the character.
          It used to sit inside the frame, absolutely positioned over the
          clip, and on a phone it covered most of the character's body with a
          white block of text. Justin, 1 September 2026: "characters seemed
          to be blocked out with text". The Duolingo register (Mobbin refs,
          lesson plan) never lets the bubble touch the mascot: bubble first,
          tail down, character fully visible underneath. */}
      <div data-bubble style={{ opacity: 0 }}>
        <div style={{
          maxWidth: 300, margin: '0 auto',
          background: '#fff', borderRadius: '16px', padding: '11px 14px',
          textAlign: 'left', boxShadow: '0 4px 0 rgba(0,0,0,0.18)', minHeight: '2.6em',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.4 }}>
            {typed}
            {typed.length < c.line.length && <span style={{ display: 'inline-block', width: '2px', height: '1em', background: 'var(--terracotta)', marginLeft: '1px', verticalAlign: '-2px', animation: 'introCaret 0.7s step-end infinite' }} />}
          </span>
        </div>
        <div style={{
          width: 0, height: 0, margin: '0 auto 10px',
          borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
          borderTop: '12px solid #fff',
        }} />
      </div>

      {/* The character clip in a rounded frame, nothing over it */}
      <div data-frame style={{
        // 200 rather than the old 280: with the bubble now OUTSIDE the frame
        // the intro runs taller, and the Continue button must stay on a phone
        // screen without scrolling. The clip reads perfectly at this size.
        opacity: 0, position: 'relative', width: '100%', maxWidth: 200, margin: '0 auto',
        aspectRatio: '1 / 1', borderRadius: '20px', overflow: 'hidden',
        border: '3px solid rgba(237,195,95,0.5)', boxShadow: '0 12px 34px rgba(0,0,0,0.3)',
        background: '#0F2A32',
      }}>
        <video
          src={c.clip}
          autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 5vw, 1.9rem)', fontWeight: 900, color: '#fff', lineHeight: 1.14, letterSpacing: '-0.02em', margin: '18px 0 18px' }}>
        {titleWords.map((w, i) => (
          w.trim() === '' ? w : <span key={i} data-word style={{ display: 'inline-block', opacity: 0 }}>{w}</span>
        ))}
      </h1>

      {onStart && (
        <button
          data-cta
          onClick={onStart}
          style={{
            opacity: 0, background: c.accent, color: 'var(--ink)', border: 'none',
            borderRadius: '16px', padding: '14px 30px', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          Let&apos;s go ▶
        </button>
      )}

      <style>{`@keyframes introCaret { 50% { opacity: 0; } }`}</style>
    </div>
  )
}
