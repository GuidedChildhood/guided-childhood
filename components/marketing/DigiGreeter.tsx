'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'

// DiGi pops up once per visit and types the message out word by word, like
// a friend talking, inside a proper speech bubble with a tail. The golden
// star, the same character the child meets inside. Names the problem, then
// the whole offer, then the door. Dismissed with one tap, never nags again.

const BUBBLES = [
  'At 16 the apps arrive all at once. A ban delays them, but it does not teach your child a single thing.',
  'We do it differently. Full digital literacy lessons, taught at the right age. A star system that rewards real jobs and outside play. And the skills to navigate the online world, with a healthy balance of screens and life.',
]

// Split into words but keep trailing spaces so the typed text reflows cleanly.
function words(s: string): string[] {
  return s.split(/(\s+)/)
}

export default function DigiGreeter() {
  const [show, setShow] = useState(false)
  const [bubble, setBubble] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const wrap = useRef<HTMLDivElement>(null)

  const parts = words(BUBBLES[bubble])
  const typed = parts.slice(0, wordCount).join('')
  const done = wordCount >= parts.length

  useEffect(() => {
    if (sessionStorage.getItem('gc_digi_greeted')) return
    const t = setTimeout(() => {
      setShow(true)
      sessionStorage.setItem('gc_digi_greeted', '1')
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!reduced && wrap.current) {
        gsap.fromTo(wrap.current,
          { y: 40, scale: 0.6, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.7)' })
      }
    }, 2000)
    return () => clearTimeout(t)
  }, [])

  // Type the current bubble out word by word.
  useEffect(() => {
    if (!show) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setWordCount(parts.length); return }
    setWordCount(0)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setWordCount(i)
      if (i >= parts.length) clearInterval(id)
    }, 95)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, bubble])

  if (!show) return null

  return (
    <div
      ref={wrap}
      role="dialog"
      aria-label="DiGi has a message"
      style={{
        position: 'fixed', right: '18px', bottom: '18px', zIndex: 90,
        maxWidth: '340px', display: 'flex', alignItems: 'flex-end', gap: '4px',
      }}
    >
      <div style={{ position: 'relative', flex: 1 }}>
        <div style={{
          background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px',
          boxShadow: '0 16px 44px rgba(26,26,46,0.2)', padding: '16px 18px 15px',
        }}>
          <button
            onClick={() => setShow(false)}
            aria-label="Close"
            style={{
              position: 'absolute', top: '8px', right: '10px', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '15px', color: 'var(--ink-muted)', lineHeight: 1, padding: '4px',
            }}
          >
            ×
          </button>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '7px' }}>
            DiGi
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.6, margin: '0 0 12px', fontWeight: 600, minHeight: '4.8em' }}>
            {typed}
            {!done && <span style={{ display: 'inline-block', width: '2px', height: '1em', background: 'var(--terracotta)', marginLeft: '1px', verticalAlign: '-2px', animation: 'digiCaret 0.7s step-end infinite' }} />}
          </p>
          {done && (
            bubble === 0 ? (
              <button
                onClick={() => setBubble(1)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta-dark)',
                  animation: 'digiFadeIn 0.4s ease both',
                }}
              >
                So what do you do? →
              </button>
            ) : (
              <Link
                href="/starter-pack"
                style={{
                  display: 'inline-block', background: 'var(--terracotta)', color: 'var(--ink)',
                  borderRadius: '12px', padding: '10px 18px', textDecoration: 'none',
                  fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800,
                  boxShadow: '0 3px 0 var(--terracotta-dark)', animation: 'digiFadeIn 0.4s ease both',
                }}
              >
                Show me, it is free
              </Link>
            )
          )}
        </div>
        {/* Speech bubble tail pointing at DiGi */}
        <div style={{ position: 'absolute', right: '-7px', bottom: '18px', width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '10px solid #fff', filter: 'drop-shadow(1.5px 0 0 var(--border))' }} />
      </div>

      {/* DiGi the golden star */}
      <div aria-hidden style={{ width: 58, height: 58, flexShrink: 0, animation: 'digiBob 3s ease-in-out infinite' }}>
        <svg viewBox="0 0 64 64" width="58" height="58">
          <path d="M32 4 L39.5 22.5 L59 24.5 L44.5 37.5 L48.5 57 L32 46.5 L15.5 57 L19.5 37.5 L5 24.5 L24.5 22.5 Z" fill="#EDC35F" stroke="#C99A28" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="26.5" cy="30" r="2.4" fill="#1A1A2E" />
          <circle cx="37.5" cy="30" r="2.4" fill="#1A1A2E" />
          <path d="M26 37 q 6 5 12 0" fill="none" stroke="#1A1A2E" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>

      <style>{`
        @keyframes digiCaret { 50% { opacity: 0; } }
        @keyframes digiFadeIn { 0% { opacity: 0; transform: translateY(4px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes digiBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes digiBob { 0%, 100% { transform: none; } }
        }
      `}</style>
    </div>
  )
}
