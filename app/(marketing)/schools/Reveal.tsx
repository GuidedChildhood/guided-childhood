'use client'

import { useEffect, useRef, useState } from 'react'

// A quiet premium reveal: fade and rise as each block enters view. Only
// transform and opacity animate (GPU composited, never layout), so it
// stays smooth on a projector or an old staffroom laptop. Honours reduced
// motion by showing everything immediately.
export default function Reveal({
  children,
  delay = 0,
  y = 26,
  as: Tag = 'div',
  style,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  as?: 'div' | 'section' | 'li'
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { setShown(true); io.disconnect() } }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const Comp = Tag as React.ElementType
  return (
    <Comp
      ref={ref}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Comp>
  )
}
