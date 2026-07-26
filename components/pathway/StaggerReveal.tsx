'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// A gentle entrance for a long page: the direct children fade up in a quick
// stagger on mount, so the Passport arrives with a little life instead of
// snapping in all at once. House motion rule: GSAP, subtle fade ups, and it
// steps aside entirely for anyone who asked for reduced motion. If the script
// never runs the content is simply already there, never hidden by CSS.

export default function StaggerReveal({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const kids = Array.from(el.children) as HTMLElement[]
    if (kids.length === 0) return
    const ctx = gsap.context(() => {
      gsap.from(kids, {
        opacity: 0,
        y: 14,
        duration: 0.42,
        ease: 'power2.out',
        stagger: 0.055,
        clearProps: 'opacity,transform',
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  )
}
