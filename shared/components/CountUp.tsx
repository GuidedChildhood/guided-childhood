'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { belowFold, motionOk } from '../motion'

// A number that counts up from zero as it arrives, the "number arrives" move
// from the Prompt Motion gallery (Justin, 22 October 2026). The server always
// renders the final number, so it is right with no JavaScript, in print and
// for a screen reader, which reads a hidden copy of the final figure and never
// the ticking one.
//
// On a public page it only counts when it starts below the fold, and resets to
// zero just before it scrolls in, so nobody watches a figure they have already
// read blink back to nothing. Inside the app, where the number is the thing
// the parent opened the screen to see, `immediate` counts it on arrival.
// Reduced motion, or a number of one or less, simply shows the figure.

const CSS = `
.gc-cu-final{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@media print{.gc-cu-anim{display:none}.gc-cu-final{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto;white-space:normal}}
`

export default function CountUp({
  n,
  format,
  immediate = false,
  duration = 1.1,
}: {
  n: number
  format?: (v: number) => string
  immediate?: boolean
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(n)
  const fmt = useRef(format ?? ((v: number) => String(v)))
  fmt.current = format ?? ((v: number) => String(v))

  useEffect(() => {
    setShown(n)
    const el = ref.current
    if (!el || !motionOk() || n <= 1) return
    if (!immediate && !belowFold(el)) return

    const obj = { v: 0 }
    let tween: gsap.core.Tween | null = null
    const run = () => {
      tween = gsap.to(obj, {
        v: n, duration, ease: 'power2.out',
        onUpdate: () => setShown(Math.round(obj.v)),
        onComplete: () => setShown(n),
      })
    }

    if (immediate) {
      setShown(0)
      run()
      return () => { tween?.kill(); setShown(n) }
    }

    // Two edges: zero is set while the number is still a little below the
    // screen, and the count starts once it is properly in view.
    const arm = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { arm.disconnect(); setShown(0) }
    }, { rootMargin: '0px 0px 25% 0px' })
    const go = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { go.disconnect(); arm.disconnect(); setShown(0); run() }
    }, { rootMargin: '0px 0px -12% 0px' })
    arm.observe(el)
    go.observe(el)
    return () => { arm.disconnect(); go.disconnect(); tween?.kill(); setShown(n) }
  }, [n, immediate, duration])

  return (
    <>
      <style href="gc-count-up" precedence="default">{CSS}</style>
      <span ref={ref} className="gc-cu-anim" aria-hidden style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt.current(shown)}</span>
      <span className="gc-cu-final">{fmt.current(n)}</span>
    </>
  )
}
