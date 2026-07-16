'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import DigiCharacter, { type DigiMood } from '@/components/digi/DigiCharacter'

// The DiGi widget: the Duolingo streak card charm, our way. Duolingo leans on
// guilt (the dying owl, "ghosted by you"). We never do that, it breaks the one
// rule that a parent must never be made to feel they have failed. So DiGi keeps
// the delight (a character that reacts, the streak front and centre, a week
// strip) and swaps the guilt for warmth: proud when you show up, gently keeping
// the flame when it is still warm, and an open door when you have been away.

interface Props {
  count: number
  aliveToday: boolean
  firstName?: string
}

type State = {
  mood: DigiMood
  eyebrow: string
  headline: string
  body: string
  cta: string
  href: string
  warm: boolean
}

function resolveState(count: number, aliveToday: boolean, firstName?: string): State {
  const who = firstName ? `, ${firstName}` : ''
  if (count > 0 && aliveToday) {
    return {
      mood: 'happy',
      eyebrow: 'On a roll',
      headline: `${count} day streak`,
      body: `You showed up today${who}. That steady drumbeat is the whole thing, and DiGi is right there with you.`,
      cta: 'Open DiGi',
      href: '/dashboard/digi',
      warm: true,
    }
  }
  if (count > 0 && !aliveToday) {
    return {
      mood: 'wave',
      eyebrow: 'Still warm',
      headline: `${count} day streak`,
      body: 'One small thing today keeps it going. Even a two minute check in counts, it does not have to be about screens.',
      cta: 'Keep it going',
      href: '/dashboard/daily',
      warm: false,
    }
  }
  return {
    mood: 'wave',
    eyebrow: 'Ready when you are',
    headline: 'Start a streak today',
    body: `Show up in any small way and DiGi remembers${who}. No pressure, no catch up, just today.`,
    cta: 'Start today',
    href: '/dashboard/daily',
    warm: true,
  }
}

export default function DigiStreakWidget({ count, aliveToday, firstName }: Props) {
  const s = resolveState(count, aliveToday, firstName)
  const ref = useRef<HTMLDivElement>(null)
  const starRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = ref.current
    const star = starRef.current
    if (!card) return
    const tl = gsap.timeline()
    tl.fromTo(card, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
    if (star) tl.fromTo(star, { scale: 0.6, rotate: -12 }, { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2.2)' }, '-=0.3')
    return () => { tl.kill() }
  }, [])

  // The seven day strip, the Duolingo week glance. Filled dots for the run so
  // far (capped at seven), the last one lit only when today is done.
  const filled = Math.min(count, 7)

  const accent = s.warm ? 'var(--terracotta)' : 'var(--ink-light)'
  const surface = s.warm
    ? 'radial-gradient(120% 90% at 82% -10%, rgba(237,195,95,0.30), transparent 55%), linear-gradient(160deg, #FFFDF7 0%, #FFF6E4 100%)'
    : 'linear-gradient(160deg, #FFFFFF 0%, #F6F5F1 100%)'

  return (
    <div
      ref={ref}
      style={{
        position: 'relative', overflow: 'hidden',
        background: surface,
        border: `1.5px solid ${s.warm ? 'rgba(237,195,95,0.5)' : 'var(--border)'}`,
        borderRadius: '20px', padding: '18px 20px', marginBottom: '20px',
        boxShadow: '0 4px 20px rgba(26,26,46,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div ref={starRef} style={{ flexShrink: 0 }}>
          {/* When the streak is alive today there is nothing to chase, so DiGi
              bounces once and rests. When it needs keeping warm, the motion
              loops as a gentle, guilt free nudge. */}
          <DigiCharacter mood={s.mood} size={64} once={aliveToday} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, marginBottom: 3 }}>
            {s.eyebrow}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.4rem, 5vw, 1.75rem)', letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1 }}>
              {s.headline}
            </span>
            {count > 0 && (
              <span aria-hidden style={{ fontSize: 18, lineHeight: 1, filter: aliveToday ? 'none' : 'grayscale(0.7) opacity(0.6)' }}>🔥</span>
            )}
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>{s.body}</p>
        </div>
      </div>

      {/* Week strip */}
      <div style={{ display: 'flex', gap: 6, marginTop: 16, marginBottom: 4 }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const on = i < filled
          const isTodaySlot = i === filled - 1
          return (
            <div
              key={i}
              style={{
                flex: 1, height: 7, borderRadius: 100,
                background: on ? (isTodaySlot && !aliveToday ? 'var(--ink-light)' : accent) : 'var(--border)',
                transition: 'background 0.3s ease',
              }}
            />
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <Link
          href={s.href}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--terracotta)', color: 'var(--ink)',
            borderRadius: 14, padding: '10px 18px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13,
            boxShadow: '0 4px 0 var(--terracotta-dark)',
          }}
        >
          {s.cta} →
        </Link>
      </div>
    </div>
  )
}
