'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { belowFold, motionOk } from '../motion'

// One stacked bar for a coverage page: each verdict a segment in the page's
// own colours, in the page's own order, so a head sees the whole answer at a
// glance before reading a row. It draws itself in left to right as it scrolls
// into view, the "draw on" move from the Prompt Motion gallery (Justin,
// 22 October 2026).
//
// The server renders the full bar, so it is complete with no JavaScript and
// in print. Like CountUp it is only hidden just before it scrolls in, never
// while someone is looking at it, and reduced motion gets the finished bar.

export type CoverageSegment = { value: number; color: string; label: string }

const CSS = `@media print{.gc-cov-fill{clip-path:none!important}}`

export default function CoverageBar({ segments, label }: { segments: CoverageSegment[]; label: string }) {
  const fill = useRef<HTMLDivElement>(null)
  const shown = segments.filter(s => s.value > 0)

  useEffect(() => {
    const el = fill.current
    if (!el || !motionOk() || !belowFold(el)) return
    let tween: gsap.core.Tween | null = null
    const arm = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { arm.disconnect(); gsap.set(el, { clipPath: 'inset(0 100% 0 0)' }) }
    }, { rootMargin: '0px 0px 25% 0px' })
    const go = new IntersectionObserver(es => {
      if (!es.some(e => e.isIntersecting)) return
      go.disconnect(); arm.disconnect()
      tween = gsap.fromTo(el,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.out', delay: 0.1, clearProps: 'clipPath' })
    }, { rootMargin: '0px 0px -12% 0px' })
    arm.observe(el)
    go.observe(el)
    return () => { arm.disconnect(); go.disconnect(); tween?.kill(); gsap.set(el, { clearProps: 'clipPath' }) }
  }, [])

  return (
    <div>
      <style href="gc-coverage-bar" precedence="default">{CSS}</style>
      <div role="img" aria-label={label} style={{
        height: 16, borderRadius: 8, background: 'var(--cream)', border: '1px solid var(--border)', overflow: 'hidden',
      }}>
        <div ref={fill} className="gc-cov-fill" style={{ display: 'flex', height: '100%' }}>
          {shown.map(s => (
            <div key={s.label} style={{ flex: `${s.value} 0 0`, background: s.color }} />
          ))}
        </div>
      </div>
      {/* The key, so a colour never has to be guessed. The bar's label
          already reads the same thing to a screen reader. */}
      <div aria-hidden style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 8 }}>
        {shown.map(s => (
          <span key={s.label} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)', letterSpacing: '0.06em', color: 'var(--ink-soft)',
          }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            {s.label} {s.value}
          </span>
        ))}
      </div>
    </div>
  )
}
