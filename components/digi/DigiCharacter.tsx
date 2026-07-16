'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'

export type DigiMood = 'idle' | 'speak' | 'happy' | 'thinking' | 'wave'

interface DigiCharacterProps {
  mood?: DigiMood
  size?: number
  className?: string
  style?: React.CSSProperties
  // One bounce on load, then still. Set this when DiGi is just present and
  // does not need to keep pulling the eye. Leave it off (the default) when
  // DiGi is asking to be noticed, so the motion loops as a gentle nudge.
  once?: boolean
}

export default function DigiCharacter({
  mood = 'idle',
  size = 120,
  className,
  style,
  once = false,
}: DigiCharacterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const idleTL = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    if (!ref.current) return

    idleTL.current?.kill()
    gsap.killTweensOf(ref.current)
    gsap.set(ref.current, { rotation: 0, scale: 1, y: 0 })

    const el = ref.current
    const tl = gsap.timeline({ repeat: once ? 0 : -1 })
    idleTL.current = tl

    if (mood === 'idle') {
      tl.to(el, { y: -10, duration: 1.8, ease: 'sine.inOut' })
        .to(el, { y: 0,   duration: 1.8, ease: 'sine.inOut' })
    }

    if (mood === 'speak') {
      tl.to(el, { scale: 1.06, duration: 0.35, ease: 'sine.inOut' })
        .to(el, { scale: 1,    duration: 0.35, ease: 'sine.inOut' })
        .to(el, { scale: 1.04, duration: 0.25, ease: 'sine.inOut' })
        .to(el, { scale: 1,    duration: 0.25, ease: 'sine.inOut' })
        .to({}, { duration: 0.4 })
    }

    if (mood === 'happy') {
      tl.to(el, { y: -18, rotation: 8,  scale: 1.1,  duration: 0.3,  ease: 'back.out(2)' })
        .to(el, { y: 0,   rotation: 0,  scale: 1,    duration: 0.3,  ease: 'bounce.out' })
        .to(el, { y: -10, rotation: -5, scale: 1.05, duration: 0.22, ease: 'back.out(1.5)' })
        .to(el, { y: 0,   rotation: 0,  scale: 1,    duration: 0.22, ease: 'bounce.out' })
        .to({}, { duration: 0.7 })
    }

    if (mood === 'thinking') {
      tl.to(el, { rotation: -10, y: -4, duration: 1.2, ease: 'sine.inOut' })
        .to(el, { rotation: 0,   y: 0,  duration: 1.2, ease: 'sine.inOut' })
    }

    if (mood === 'wave') {
      tl.to(el, { rotation: 14,  y: -8, duration: 0.2,  ease: 'back.out(2)' })
        .to(el, { rotation: -10, y: -8, duration: 0.18, ease: 'sine.inOut' })
        .to(el, { rotation: 14,  y: -8, duration: 0.18, ease: 'sine.inOut' })
        .to(el, { rotation: -10, y: -8, duration: 0.18, ease: 'sine.inOut' })
        .to(el, { rotation: 0,   y: 0,  duration: 0.3,  ease: 'bounce.out' })
        .to({}, { duration: 1.2 })
    }

    return () => { idleTL.current?.kill() }
  }, [mood, once])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        transformOrigin: '50% 60%',
        flexShrink: 0,
        ...style,
      }}
    >
      <Image
        src="/digi-squad/DiGi-star.svg"
        alt="DiGi, your evidence led guide"
        width={size}
        height={size}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        priority
      />
    </div>
  )
}
