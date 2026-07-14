'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'

// DiGi pops up once per visit, names the problem in one line and the
// answer in the next, then offers the door. The golden star, the same
// character the child meets inside, greeting the parent at the window.
// Dismissed with one tap and never nags again that session.

const BUBBLES = [
  'The ban takes the apps away at 16. It does not teach your child a single thing.',
  'We do. Lessons, the exact words, quests that earn screen time, and a passport your child fills up on the way to 16.',
]

export default function DigiGreeter() {
  const [show, setShow] = useState(false)
  const [bubble, setBubble] = useState(0)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem('gc_digi_greeted')) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(() => {
      setShow(true)
      sessionStorage.setItem('gc_digi_greeted', '1')
      if (!reduced && wrap.current) {
        gsap.fromTo(wrap.current,
          { y: 40, scale: 0.6, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.7)' })
      }
    }, 2200)
    const t2 = setTimeout(() => setBubble(1), 7200)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  if (!show) return null

  return (
    <div
      ref={wrap}
      role="dialog"
      aria-label="DiGi has a message"
      style={{
        position: 'fixed', right: '18px', bottom: '18px', zIndex: 90,
        maxWidth: '310px', display: 'flex', alignItems: 'flex-end', gap: '10px',
      }}
    >
      <div style={{
        background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px 18px 4px 18px',
        boxShadow: '0 14px 40px rgba(26,26,46,0.18)', padding: '14px 16px', position: 'relative',
      }}>
        <button
          onClick={() => setShow(false)}
          aria-label="Close"
          style={{
            position: 'absolute', top: '6px', right: '8px', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1, padding: '4px',
          }}
        >
          ×
        </button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '5px' }}>
          DiGi
        </div>
        <p key={bubble} style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 10px', fontWeight: 600, animation: 'digiBubbleIn 0.4s ease both' }}>
          {BUBBLES[bubble]}
        </p>
        {bubble === 0 ? (
          <button
            onClick={() => setBubble(1)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)',
            }}
          >
            And you do? →
          </button>
        ) : (
          <Link
            href="/starter-pack"
            style={{
              display: 'inline-block', background: 'var(--terracotta)', color: 'var(--ink)',
              borderRadius: '12px', padding: '9px 16px', textDecoration: 'none',
              fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800,
              boxShadow: '0 3px 0 var(--terracotta-dark)',
            }}
          >
            Show me, free
          </Link>
        )}
      </div>

      {/* DiGi the golden star */}
      <div aria-hidden style={{ width: 56, height: 56, flexShrink: 0, animation: 'digiBob 3s ease-in-out infinite' }}>
        <svg viewBox="0 0 64 64" width="56" height="56">
          <path d="M32 4 L39.5 22.5 L59 24.5 L44.5 37.5 L48.5 57 L32 46.5 L15.5 57 L19.5 37.5 L5 24.5 L24.5 22.5 Z" fill="#EDC35F" stroke="#C99A28" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="26.5" cy="30" r="2.4" fill="#1A1A2E" />
          <circle cx="37.5" cy="30" r="2.4" fill="#1A1A2E" />
          <path d="M26 37 q 6 5 12 0" fill="none" stroke="#1A1A2E" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>

      <style>{`
        @keyframes digiBubbleIn { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes digiBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes digiBob { 0%, 100% { transform: none; } }
        }
      `}</style>
    </div>
  )
}
