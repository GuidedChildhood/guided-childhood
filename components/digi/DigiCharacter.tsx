'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export type DigiMood = 'idle' | 'speak' | 'happy' | 'thinking' | 'wave'

interface DigiCharacterProps {
  mood?: DigiMood
  size?: number          // controls SVG width; height scales proportionally
  className?: string
  style?: React.CSSProperties
}

export default function DigiCharacter({
  mood = 'idle',
  size = 160,
  className,
  style,
}: DigiCharacterProps) {
  const rootRef   = useRef<SVGSVGElement>(null)
  const bodyRef   = useRef<SVGGElement>(null)
  const headRef   = useRef<SVGGElement>(null)
  const eyeL      = useRef<SVGRectElement>(null)
  const eyeR      = useRef<SVGRectElement>(null)
  const mouthRef  = useRef<SVGPathElement>(null)
  const antL      = useRef<SVGGElement>(null)
  const antR      = useRef<SVGGElement>(null)
  const glowL     = useRef<SVGCircleElement>(null)
  const glowR     = useRef<SVGCircleElement>(null)
  const armL      = useRef<SVGRectElement>(null)
  const armR      = useRef<SVGRectElement>(null)

  // idle timelines stored so they can be killed on mood change
  const idleTL = useRef<gsap.core.Timeline | null>(null)
  const blinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!headRef.current) return

    // Kill previous animations
    idleTL.current?.kill()
    if (blinkTimer.current) clearTimeout(blinkTimer.current)
    gsap.killTweensOf([
      headRef.current, bodyRef.current,
      eyeL.current, eyeR.current,
      mouthRef.current, antL.current, antR.current,
      glowL.current, glowR.current,
      armL.current, armR.current,
    ])

    // Reset transforms
    gsap.set([eyeL.current, eyeR.current], { scaleY: 1, transformOrigin: '50% 50%' })
    gsap.set(mouthRef.current, { attr: { d: 'M 58 93 Q 80 106 102 93' } })
    gsap.set([antL.current, antR.current], { rotation: 0, transformOrigin: '50% 100%' })
    gsap.set(headRef.current, { rotation: 0, transformOrigin: '50% 50%', y: 0 })
    gsap.set(bodyRef.current, { y: 0 })
    gsap.set([armL.current, armR.current], { rotation: 0, transformOrigin: '50% 0%' })

    const tl = gsap.timeline({ repeat: -1 })
    idleTL.current = tl

    if (mood === 'idle') {
      tl.to(headRef.current, { y: -7, duration: 1.8, ease: 'sine.inOut' })
        .to(headRef.current, { y: 0,  duration: 1.8, ease: 'sine.inOut' })
      gsap.to([antL.current, antR.current], { rotation: 4, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.3 })
      gsap.to([glowL.current, glowR.current], { opacity: 0.4, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.5 })

      const scheduleBlink = () => {
        blinkTimer.current = setTimeout(() => {
          if (eyeL.current && eyeR.current) {
            gsap.to([eyeL.current, eyeR.current], {
              scaleY: 0.08, duration: 0.07, ease: 'power2.in', yoyo: true, repeat: 1,
              transformOrigin: '50% 50%',
            })
          }
          scheduleBlink()
        }, 1800 + Math.random() * 2800)
      }
      scheduleBlink()
    }

    if (mood === 'speak') {
      tl.to(headRef.current, { y: -4, duration: 0.7, ease: 'sine.inOut' })
        .to(headRef.current, { y: 0,  duration: 0.7, ease: 'sine.inOut' })
      gsap.to([eyeL.current, eyeR.current], {
        scaleY: 0.7, duration: 0.22, ease: 'sine.inOut', yoyo: true, repeat: -1,
        transformOrigin: '50% 50%', stagger: 0.1,
      })
      gsap.to([glowL.current, glowR.current], { opacity: 1, duration: 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }

    if (mood === 'happy') {
      tl.to(headRef.current, { y: -14, rotation: 6, duration: 0.35, ease: 'back.out(2)' })
        .to(headRef.current, { y: 0, rotation: 0, duration: 0.35, ease: 'bounce.out' })
        .to(headRef.current, { y: -8, rotation: -4, duration: 0.25, ease: 'back.out(1.5)' })
        .to(headRef.current, { y: 0, rotation: 0, duration: 0.25, ease: 'bounce.out' })
        .to({}, { duration: 0.8 }) // pause before repeat
      gsap.set(mouthRef.current, { attr: { d: 'M 55 90 Q 80 112 105 90' } }) // bigger smile
      gsap.to([eyeL.current, eyeR.current], {
        scaleX: 1.2, scaleY: 1.15, duration: 0.3, ease: 'back.out(2)',
        transformOrigin: '50% 50%',
      })
      gsap.to([glowL.current, glowR.current], { opacity: 1, r: 9, duration: 0.5, ease: 'back.out(2)' })
    }

    if (mood === 'thinking') {
      tl.to(headRef.current, { rotation: -7, duration: 1.2, ease: 'sine.inOut' })
        .to(headRef.current, { rotation: 0,  duration: 1.2, ease: 'sine.inOut' })
      gsap.to(antL.current, { rotation: -18, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to(eyeR.current, { scaleY: 0.5, duration: 0.3, ease: 'power2.out', transformOrigin: '50% 50%' })
      gsap.to([glowL.current, glowR.current], { opacity: 0.2, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }

    if (mood === 'wave') {
      tl.to(headRef.current, { y: -6, duration: 0.5, ease: 'back.out(2)' })
        .to(headRef.current, { y: 0, duration: 0.5, ease: 'bounce.out' })
      gsap.to(armR.current, {
        rotation: -50, duration: 0.3, ease: 'power2.out',
        transformOrigin: '50% 0%', yoyo: true, repeat: 5,
      })
    }

    return () => {
      idleTL.current?.kill()
      if (blinkTimer.current) clearTimeout(blinkTimer.current)
    }
  }, [mood])

  const h = Math.round(size * 1.3)

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 160 210"
      width={size}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible', ...style }}
      aria-label="DiGi, your AI parenting advisor"
    >
      <defs>
        <radialGradient id="digi-head-fill" cx="45%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#E8F4FF" />
          <stop offset="100%" stopColor="#B8D4E8" />
        </radialGradient>
        <radialGradient id="digi-screen" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#1A2E40" />
          <stop offset="100%" stopColor="#0D1F2E" />
        </radialGradient>
        <radialGradient id="digi-body-fill" cx="45%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#C8DFF0" />
          <stop offset="100%" stopColor="#9ABCE0" />
        </radialGradient>
        <filter id="digi-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="digi-drop-shadow">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#5B8FA8" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* ── Body group (bobs with head) ── */}
      <g ref={bodyRef}>

        {/* Body */}
        <rect x="42" y="148" width="76" height="52" rx="20" fill="url(#digi-body-fill)" filter="url(#digi-drop-shadow)" />
        {/* Body highlight */}
        <rect x="42" y="148" width="76" height="18" rx="20" fill="white" opacity="0.18" />
        {/* Body chest dots */}
        <circle cx="66" cy="174" r="7" fill="#7FB3D0" />
        <circle cx="80" cy="174" r="7" fill="#5B8FA8" />
        <circle cx="94" cy="174" r="7" fill="#7FB3D0" />
        {/* Chest dot shine */}
        <circle cx="63" cy="172" r="2.5" fill="white" opacity="0.5" />
        <circle cx="77" cy="172" r="2.5" fill="white" opacity="0.5" />
        <circle cx="91" cy="172" r="2.5" fill="white" opacity="0.5" />

        {/* Arms */}
        <rect ref={armL} x="18" y="152" width="26" height="12" rx="6" fill="#9ABCE0" />
        <rect ref={armR} x="116" y="152" width="26" height="12" rx="6" fill="#9ABCE0" />
        {/* Hands */}
        <circle cx="18" cy="158" r="7" fill="#7FB3D0" />
        <circle cx="142" cy="158" r="7" fill="#7FB3D0" />

        {/* ── Head group ── */}
        <g ref={headRef}>
          {/* Antennae */}
          <g ref={antL} style={{ transformOrigin: '52px 38px' }}>
            <line x1="52" y1="38" x2="42" y2="10" stroke="#7FB3D0" strokeWidth="3.5" strokeLinecap="round" />
            <circle ref={glowL} cx="42" cy="9" r="7" fill="#9ABCE0" filter="url(#digi-glow)" />
            <circle cx="42" cy="9" r="4" fill="#C8E8FF" />
          </g>
          <g ref={antR} style={{ transformOrigin: '108px 38px' }}>
            <line x1="108" y1="38" x2="118" y2="10" stroke="#7FB3D0" strokeWidth="3.5" strokeLinecap="round" />
            <circle ref={glowR} cx="118" cy="9" r="7" fill="#9ABCE0" filter="url(#digi-glow)" />
            <circle cx="118" cy="9" r="4" fill="#C8E8FF" />
          </g>

          {/* Head */}
          <rect x="18" y="34" width="124" height="114" rx="34" fill="url(#digi-head-fill)" filter="url(#digi-drop-shadow)" />
          {/* Head highlight */}
          <rect x="28" y="38" width="60" height="30" rx="15" fill="white" opacity="0.25" />

          {/* Ear panels */}
          <rect x="6" y="58" width="16" height="36" rx="8" fill="#9ABCE0" />
          <rect x="138" y="58" width="16" height="36" rx="8" fill="#9ABCE0" />
          {/* Ear shine */}
          <rect x="9" y="62" width="5" height="10" rx="3" fill="white" opacity="0.4" />
          <rect x="141" y="62" width="5" height="10" rx="3" fill="white" opacity="0.4" />

          {/* Screen face */}
          <rect x="30" y="50" width="100" height="82" rx="18" fill="url(#digi-screen)" />
          {/* Screen shine */}
          <rect x="34" y="53" width="42" height="8" rx="4" fill="white" opacity="0.07" />

          {/* Eyes */}
          <rect ref={eyeL} x="42" y="66" width="28" height="20" rx="6" fill="#5B8FA8" />
          <rect ref={eyeR} x="90" y="66" width="28" height="20" rx="6" fill="#5B8FA8" />
          {/* Eye glow */}
          <rect x="42" y="66" width="28" height="20" rx="6" fill="#9ABCE0" opacity="0.5" />
          <rect x="90" y="66" width="28" height="20" rx="6" fill="#9ABCE0" opacity="0.5" />
          {/* Eye shine dots */}
          <circle cx="48" cy="71" r="4" fill="white" opacity="0.9" />
          <circle cx="96" cy="71" r="4" fill="white" opacity="0.9" />
          <circle cx="52" cy="74" r="2" fill="white" opacity="0.5" />
          <circle cx="100" cy="74" r="2" fill="white" opacity="0.5" />

          {/* Mouth */}
          <path
            ref={mouthRef}
            d="M 58 93 Q 80 106 102 93"
            stroke="#7FB3D0"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Cheek blush */}
          <circle cx="38" cy="100" r="10" fill="#FBCAAE" opacity="0.35" />
          <circle cx="122" cy="100" r="10" fill="#FBCAAE" opacity="0.35" />
        </g>
      </g>
    </svg>
  )
}
