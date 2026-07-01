'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DigiCharacter from '@/components/digi/DigiCharacter'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Wraps a block of content with DiGi walking left to right above it as the
// reader scrolls through, so the reframe from deep water to screens reads
// as DiGi guiding you across it, not a static mascot parked on the page.
export default function DigiWalker({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const digiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!digiRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(digiRef.current, {
        left: 'calc(100% - 64px)',
        ease: 'none',
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top 75%',
          end: 'bottom 40%',
          scrub: 0.6,
        },
      })
    }, trackRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={trackRef} style={{ position: 'relative' }}>
      <div ref={digiRef} style={{ position: 'absolute', left: 0, top: '-56px', zIndex: 2 }} className="hide-mobile">
        <DigiCharacter mood="thinking" size={64} />
      </div>
      {children}
    </div>
  )
}
