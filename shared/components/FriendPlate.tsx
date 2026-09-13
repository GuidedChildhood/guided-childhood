'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import DigiCharacter, { type DigiMood } from './DigiCharacter'
import { CHARACTERS, type CharacterKey } from '../schools-curriculum'
import type { Register } from '../friend-register'

// THE PLANET FRIEND ON ITS PLATE.
//
// One component draws a friend everywhere a lesson wants one: arriving in a
// beat, sitting in the corner of a teach slide, breathing at half time. The
// art is the friend's cutout from CHARACTERS, the plate is the friend's own
// soft colour with its accent as the ring, which is the Happy News circle
// plate device translated into motion, and the motion is the register.
//
// DiGi is drawn by DigiCharacter, which already knows the five moods, so a
// plate for DiGi simply frames the star. Everything else is a still PNG that
// GSAP moves: no render pipeline, no credits, and consistent by construction
// because every lesson uses the same six files.
//
// The register is amplitude, not a different animation. Bouncy hops, still
// barely breathes, and the same timeline serves both, which is what keeps a
// Reception friend and a Year 11 friend reading as the same friend.

const AMP: Record<Register, number> = { bouncy: 1.25, playful: 1, level: 0.45, still: 0.15 }

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function FriendPlate({
  character,
  register = 'playful',
  mood = 'idle',
  size = 64,
  arrive = false,
  style,
}: {
  character: CharacterKey
  register?: Register
  mood?: DigiMood
  size?: number
  // Play the arrival once on mount: the plate blooms and the friend lands in
  // its register. Off for a friend that is simply present.
  arrive?: boolean
  style?: React.CSSProperties
}) {
  const c = CHARACTERS[character]
  const plateRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  const bobRef = useRef<HTMLDivElement>(null)
  // Still holds no plate: the character sits on the cream with one thin rule
  // under it, the KS4 and KS5 treatment.
  const plated = register !== 'still'

  // The arrival, once. Every tween runs FROM hidden TO the natural state, so
  // under reduced motion setting the natural state is the whole animation.
  useEffect(() => {
    const art = artRef.current, plate = plateRef.current
    if (!art) return
    if (!arrive || prefersReducedMotion()) {
      gsap.set(art, { opacity: 1, scale: 1, x: 0, y: 0 })
      if (plate) gsap.set(plate, { opacity: 1, scale: 1 })
      return
    }
    const tl = gsap.timeline()
    if (plate) tl.fromTo(plate, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, 0)
    if (register === 'bouncy') {
      tl.fromTo(art, { opacity: 0, scale: 0.3, y: 48 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' }, 0.1)
        .to(art, { y: -16, duration: 0.2, ease: 'power1.out', yoyo: true, repeat: 1 })
    } else if (register === 'playful') {
      tl.fromTo(art, { opacity: 0, scale: 0.5, y: 28 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.8)' }, 0.1)
        .to(art, { y: -8, duration: 0.18, ease: 'power1.out', yoyo: true, repeat: 1 })
    } else if (register === 'level') {
      tl.fromTo(art, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out' }, 0.1)
    } else {
      tl.fromTo(art, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: 'sine.out' }, 0)
    }
    return () => { tl.kill() }
  }, [arrive, register])

  // The mood loop, for the friends. DiGi runs its own inside DigiCharacter.
  useEffect(() => {
    const el = bobRef.current
    if (!el || character === 'digi') return
    gsap.killTweensOf(el)
    gsap.set(el, { rotation: 0, scale: 1, y: 0 })
    if (prefersReducedMotion()) return
    const a = AMP[register]
    const tl = gsap.timeline({ repeat: -1 })
    if (mood === 'idle') {
      tl.to(el, { y: -10 * a, duration: 1.8, ease: 'sine.inOut' })
        .to(el, { y: 0, duration: 1.8, ease: 'sine.inOut' })
    } else if (mood === 'speak') {
      tl.to(el, { scale: 1 + 0.06 * a, duration: 0.35, ease: 'sine.inOut' })
        .to(el, { scale: 1, duration: 0.35, ease: 'sine.inOut' })
        .to(el, { scale: 1 + 0.04 * a, duration: 0.25, ease: 'sine.inOut' })
        .to(el, { scale: 1, duration: 0.25, ease: 'sine.inOut' })
        .to({}, { duration: 0.4 })
    } else if (mood === 'happy') {
      tl.to(el, { y: -18 * a, rotation: 8 * a, scale: 1 + 0.1 * a, duration: 0.3, ease: 'back.out(2)' })
        .to(el, { y: 0, rotation: 0, scale: 1, duration: 0.3, ease: 'bounce.out' })
        .to(el, { y: -10 * a, rotation: -5 * a, scale: 1 + 0.05 * a, duration: 0.22, ease: 'back.out(1.5)' })
        .to(el, { y: 0, rotation: 0, scale: 1, duration: 0.22, ease: 'bounce.out' })
        .to({}, { duration: 0.7 })
    } else if (mood === 'thinking') {
      tl.to(el, { rotation: -10 * a, y: -4 * a, duration: 1.2, ease: 'sine.inOut' })
        .to(el, { rotation: 0, y: 0, duration: 1.2, ease: 'sine.inOut' })
    } else if (mood === 'wave') {
      tl.to(el, { rotation: 14 * a, y: -8 * a, duration: 0.2, ease: 'back.out(2)' })
        .to(el, { rotation: -10 * a, y: -8 * a, duration: 0.18, ease: 'sine.inOut' })
        .to(el, { rotation: 14 * a, y: -8 * a, duration: 0.18, ease: 'sine.inOut' })
        .to(el, { rotation: -10 * a, y: -8 * a, duration: 0.18, ease: 'sine.inOut' })
        .to(el, { rotation: 0, y: 0, duration: 0.3, ease: 'bounce.out' })
        .to({}, { duration: 1.2 })
    }
    return () => { tl.kill() }
  }, [mood, register, character])

  const inset = Math.round(size * 0.1)
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, ...style }}>
      {plated && (
        <div ref={plateRef} aria-hidden style={{
          position: 'absolute', inset: 0, opacity: 0,
          // A circle for the younger registers, a softened square band for
          // Level, so KS3 reads a step cooler than KS2 without a second cast.
          borderRadius: register === 'level' ? '28%' : '50%',
          background: c.soft, border: `2px solid ${c.accent}`,
          boxShadow: `0 4px 0 ${c.accent}`,
        }} />
      )}
      {!plated && (
        <div aria-hidden style={{
          position: 'absolute', left: '15%', right: '15%', bottom: 0, height: 3,
          borderRadius: 'var(--radius-pill)', background: c.accent, opacity: 0.6,
        }} />
      )}
      <div ref={artRef} style={{ position: 'absolute', inset: inset, opacity: 0, transformOrigin: '50% 80%' }}>
        <div ref={bobRef} style={{ width: '100%', height: '100%', transformOrigin: '50% 60%' }}>
          {character === 'digi' ? (
            <DigiCharacter mood={mood} size={size - inset * 2} />
          ) : (
            // A plain img on purpose: the art is a CDN cutout, the size is
            // fixed by the plate, and next/image would need a remote pattern
            // for one file family that never changes.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.img} alt={c.name} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          )}
        </div>
      </div>
    </div>
  )
}
