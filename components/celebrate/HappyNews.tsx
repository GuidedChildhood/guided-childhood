'use client'

import { useEffect } from 'react'

// The happy news pop up. When something good happens on the child's screen a
// squad friend springs up from the bottom with a speech bubble and a little
// burst of confetti, says the good news, and tucks away again. One friendly
// face delivering the news, never a grey toast. Tap it to send it away early,
// or it leaves on its own after a few seconds.
//
// The art is the real squad: DiGi the golden star, and Oliver, Zara and Sofia.
// Swappable for warmer Happy News style illustrations later without touching
// any of the call sites.

export type CharacterKey = 'digi' | 'oliver' | 'zara' | 'sofia'

const CHARACTER: Record<CharacterKey, { src: string; name: string; ring: string }> = {
  digi:   { src: '/digi-squad/DiGi-star.svg', name: 'DiGi',   ring: 'var(--terracotta)' },
  oliver: { src: '/digi-squad/Oliver.png',    name: 'Oliver', ring: '#D4600A' },
  zara:   { src: '/digi-squad/Zara.png',      name: 'Zara',   ring: '#C9962A' },
  sofia:  { src: '/digi-squad/Sofia.jpeg',    name: 'Sofia',  ring: '#2E7D5A' },
}

// An optional action turns the pop into a doorway: a chunky button that takes
// the child straight to the thing it is about (their to-do list, or a fun sheet)
// and tucks the pop away, so a pop is something they can act on, not just read.
// It either scrolls to a targetId on the page or runs onClick (for example to
// open a tab), whichever is given.
export type HappyNewsItem = { character: CharacterKey; headline: string; sub?: string; action?: { label: string; targetId?: string; onClick?: () => void } }

const CONFETTI = ['#F6C244', '#E5734B', '#2E7D5A', '#7C5CBF', '#4B9CE5', '#E5484D']

export default function HappyNews({ item, onClose }: { item: HappyNewsItem | null; onClose: () => void }) {
  useEffect(() => {
    if (!item) return
    const t = setTimeout(onClose, 4200)
    return () => clearTimeout(t)
  }, [item, onClose])

  if (!item) return null
  const c = CHARACTER[item.character]

  return (
    <div
      onClick={onClose}
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 200,
        display: 'flex', justifyContent: 'center', padding: '0 16px 22px',
        pointerEvents: 'auto',
      }}
    >
      <style>{`
        @keyframes gcHappyUp { 0% { transform: translateY(120%); opacity: 0 } 60% { transform: translateY(-6px); opacity: 1 } 100% { transform: translateY(0); opacity: 1 } }
        @keyframes gcHappyBob { 0%,100% { transform: translateY(0) rotate(-3deg) } 50% { transform: translateY(-6px) rotate(3deg) } }
        @keyframes gcConfetti { 0% { transform: translateY(0) scale(0); opacity: 0 } 20% { opacity: 1 } 100% { transform: translateY(var(--fall)) translateX(var(--drift)) scale(1) rotate(320deg); opacity: 0 } }
      `}</style>

      {/* Confetti burst behind the card */}
      <div style={{ position: 'absolute', bottom: '70px', left: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
        {Array.from({ length: 18 }).map((_, i) => {
          const drift = `${(i % 2 ? 1 : -1) * (20 + (i * 7) % 90)}px`
          const fall = `${-70 - (i * 13) % 120}px`
          return (
            <span key={i} style={{
              position: 'absolute', width: 9, height: 9, borderRadius: i % 3 === 0 ? '2px' : '100px',
              background: CONFETTI[i % CONFETTI.length],
              // @ts-expect-error custom props for the keyframe
              '--drift': drift, '--fall': fall,
              animation: `gcConfetti ${1.1 + (i % 4) * 0.25}s ease-out ${(i % 5) * 0.05}s forwards`,
            }} />
          )
        })}
      </div>

      <div style={{
        position: 'relative', maxWidth: 420, width: '100%',
        background: '#fff', borderRadius: '22px', padding: '16px 18px',
        boxShadow: '0 12px 40px rgba(26,26,46,0.28)', border: '2px solid var(--terracotta)',
        display: 'flex', alignItems: 'center', gap: '14px',
        animation: 'gcHappyUp 0.55s cubic-bezier(0.22,1.2,0.36,1) both',
      }}>
        <span style={{
          flexShrink: 0, width: 76, height: 76, borderRadius: '50%', overflow: 'hidden',
          background: '#FFF7E8', border: `3px solid ${c.ring}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'gcHappyBob 1.6s ease-in-out infinite',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.src} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: c.ring, marginBottom: '2px' }}>
            {c.name} says
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '19px', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
            {item.headline}
          </div>
          {item.sub && (
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: '3px' }}>
              {item.sub}
            </div>
          )}
          {item.action && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                try {
                  if (item.action!.onClick) item.action!.onClick()
                  else if (item.action!.targetId) document.getElementById(item.action!.targetId)?.scrollIntoView({ behavior: 'smooth' })
                } catch { /* no target */ }
                onClose()
              }}
              style={{
                marginTop: '9px', background: 'var(--terracotta)', color: 'var(--ink)', border: 'none',
                borderRadius: '12px', padding: '9px 16px', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
                boxShadow: '0 4px 0 var(--terracotta-dark)',
              }}
            >
              {item.action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
