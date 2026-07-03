'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import DigiCharacter from '@/components/digi/DigiCharacter'

// DiGi lives on the page: pops up in the corner and talks the way it talks
// in the product, real moments, not marketing lines. Each bubble pops in
// with GSAP, holds, and hands over to the next. Dismissible, respects
// reduced motion by showing only the final line statically.

const LINES = [
  { mood: 'speak' as const, text: 'I checked the school email. PE kit needed tomorrow.' },
  { mood: 'thinking' as const, text: 'Bedtime was a battle last night? I have the exact words for tonight.' },
  { mood: 'happy' as const, text: 'Four week streak. Your consistency is doing the work.' },
  { mood: 'wave' as const, text: 'I am DiGi. I will let you know, every step of the way.' },
]

export default function DigiLive() {
  const [index, setIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (dismissed) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setIndex(LINES.length - 1); return }

    if (wrapRef.current && index === 0) {
      gsap.fromTo(wrapRef.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.6)', delay: 1.2 })
    }
    if (bubbleRef.current) {
      gsap.fromTo(bubbleRef.current, { scale: 0.6, opacity: 0, y: 10 }, { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.8)', delay: index === 0 ? 1.6 : 0.1 })
    }
    const t = setTimeout(() => setIndex(i => (i + 1) % LINES.length), index === 0 ? 7200 : 5600)
    return () => clearTimeout(t)
  }, [index, dismissed])

  if (dismissed) return null
  const line = LINES[index]

  return (
    <div ref={wrapRef} className="digi-live hide-mobile" style={{
      position: 'fixed', bottom: '22px', right: '22px', zIndex: 200,
      display: 'flex', alignItems: 'flex-end', gap: '10px', maxWidth: '340px',
    }}>
      <div ref={bubbleRef} style={{
        background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px 18px 4px 18px',
        boxShadow: '0 12px 40px rgba(26,26,46,0.14)', padding: '13px 16px', position: 'relative',
      }}>
        <button onClick={() => setDismissed(true)} aria-label="Dismiss DiGi" style={{
          position: 'absolute', top: '6px', right: '10px', background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--ink-light)', fontSize: '13px', lineHeight: 1,
        }}>×</button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '4px' }}>
          DiGi, live in the app
        </div>
        <p style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.5, margin: 0, paddingRight: '10px' }}>
          {line.text}
        </p>
      </div>
      <div style={{ flexShrink: 0 }}>
        <DigiCharacter mood={line.mood} size={58} />
      </div>
    </div>
  )
}
