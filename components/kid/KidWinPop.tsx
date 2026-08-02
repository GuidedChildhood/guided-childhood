'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { playKidSound } from '@/lib/sound/kidSounds'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'

// The moment a child comes back to.
//
// Justin: "when streaks are achieved on child's app the add a family member are
// real celebrations and can pop up then on next login so you can see the family
// growing and they feel they have achieved."
//
// WHY THIS IS A TAKEOVER AND NOT THE LITTLE POP. HappyNews springs a friend up
// from the bottom for four seconds and tucks itself away, which is exactly right
// for "your grown up approved a job". It is not right for a Planet Friend
// joining the family, because that happens about five times in a childhood and a
// thing that rare has to be allowed to stop the screen.
//
// The child dismisses it. Nothing here is on a timer, because a four second
// window on the best news of the month is the app deciding it has somewhere else
// to be.
//
// ONE AT A TIME, OLDEST FIRST. A child who was away for a fortnight can come
// back to three wins. They meet them in the order they happened, each with its
// own tap, rather than as a stack. Each one is marked seen the moment it is
// SHOWN rather than when it is dismissed, so a closed tab or a flat battery
// still spends it: a moment shown and not recorded would replay forever.

export type Win = {
  kind: string
  key: string
  value: number
  label: string
  detail: string
  character: string
  earnedOn: string
}

const CHAR = new Map(STAGE_CHARACTERS.map(c => [c.key, c]))

export default function KidWinPop({ token, wins, onDone }: {
  token: string
  wins: Win[]
  /** Fired when the last one is dismissed, so the page can refresh its counts. */
  onDone?: () => void
}) {
  const [i, setI] = useState(0)
  const popRef = useRef<HTMLDivElement>(null)
  const sent = useRef(false)

  // Spend the whole queue up front. See above: shown is spent, because the
  // alternative is a child seeing their hundred day streak celebrated every
  // single time they open the app until they happen to tap the right button.
  useEffect(() => {
    if (wins.length === 0 || sent.current) return
    sent.current = true
    try {
      fetch('/api/kid/celebrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, seen: wins.map(w => ({ kind: w.kind, key: w.key })) }),
      }).catch(() => {})
    } catch { /* best effort. The child still gets their moment. */ }
    try { playKidSound('star') } catch { /* sound off */ }
  }, [wins, token])

  const win = wins[i]

  useEffect(() => {
    if (!win || !popRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.gc-win-card', { scale: 0.4, opacity: 0, y: 30, duration: 0.55, ease: 'back.out(1.8)' })
      gsap.from('.gc-win-face', { scale: 0, rotate: -20, duration: 0.6, ease: 'back.out(2.2)', delay: 0.12 })
      gsap.from('.gc-win-spark', { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.035, delay: 0.2 })
    }, popRef)
    return () => ctx.revert()
  }, [win])

  if (!win) return null

  const friend = CHAR.get(win.character)
  const colour = friend?.colour ?? 'var(--terracotta)'
  const more = wins.length - i - 1

  function next() {
    try { playKidSound('tap') } catch { /* sound off */ }
    if (i + 1 < wins.length) { setI(i + 1); return }
    onDone?.()
  }

  return (
    <div
      ref={popRef}
      role="dialog"
      aria-live="polite"
      aria-label={win.label}
      style={{
        position: 'fixed', inset: 0, zIndex: 220, background: 'rgba(26,26,46,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        className="gc-win-card"
        style={{
          background: 'var(--cream, #FDF8EE)', borderRadius: 26, padding: '26px 22px 22px',
          maxWidth: 380, width: '100%', textAlign: 'center', position: 'relative',
          border: `3px solid ${colour}`, boxShadow: `0 8px 0 ${colour}`,
        }}
      >
        {/* Sparks around the face. Decoration only, so they are hidden from a
            screen reader rather than read out as a row of stars. */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: 26 }}>
          {Array.from({ length: 10 }).map((_, n) => (
            <span key={n} className="gc-win-spark" style={{
              position: 'absolute', fontSize: 18,
              left: `${8 + (n * 9.4) % 84}%`, top: `${6 + (n * 17) % 46}%`,
            }}>{n % 3 === 0 ? '⭐' : n % 3 === 1 ? '✨' : '🎉'}</span>
          ))}
        </div>

        <div className="gc-win-face" style={{
          width: 116, height: 116, margin: '0 auto 12px', borderRadius: '50%',
          background: '#fff', border: `3px solid ${colour}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          {friend
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={friend.cutout} alt={friend.name} width={100} height={100} style={{ width: 100, height: 100, objectFit: 'contain' }} />
            : <span style={{ fontSize: 56 }}>🔥</span>}
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: colour, marginBottom: 6,
        }}>
          {win.kind === 'friend' ? 'A new Planet Friend' : win.kind === 'run' ? 'Look at that run' : 'Stars banked'}
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl, 26px)',
          color: 'var(--ink)', lineHeight: 1.1, margin: '0 0 8px',
        }}>
          {win.label}
        </h2>

        {win.detail && (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600,
            color: 'var(--ink-soft, #4a4a5e)', lineHeight: 1.45, margin: '0 0 18px',
          }}>
            {win.detail}
          </p>
        )}

        <button
          onClick={next}
          style={{
            width: '100%', background: colour, color: '#fff', border: 'none', borderRadius: 16,
            padding: '15px', cursor: 'pointer', fontFamily: 'var(--font-display)',
            fontWeight: 900, fontSize: 'var(--text-lg)', boxShadow: '0 5px 0 rgba(26,26,46,0.22)',
          }}
        >
          {more > 0 ? `Brilliant. What else? (${more} more)` : 'Brilliant!'}
        </button>
      </div>
    </div>
  )
}
