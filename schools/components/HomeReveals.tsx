'use client'

// The reveal engine, ported from the parents home page (components/marketing/
// HomeReveals.tsx): every element that should fade up carries className="fu",
// nothing is wrapped, and content is fully visible without JavaScript. On
// mount we hide only what sits below the fold, then ScrollTrigger.batch
// staggers each batch up as it enters. Numbers marked .stat-num with a
// data-count attribute count up once when seen. Reduced motion gets nothing.

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function HomeReveals() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)

    const els = (gsap.utils.toArray('.fu') as HTMLElement[]).filter(
      el => el.getBoundingClientRect().top > window.innerHeight * 0.82,
    )
    gsap.set(els, { opacity: 0, y: 26 })
    ScrollTrigger.batch(els, {
      start: 'top 88%',
      once: true,
      onEnter: batch =>
        gsap.to(batch, {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.09,
          ease: 'power3.out', clearProps: 'opacity,transform',
        }),
    })

    document.querySelectorAll<HTMLElement>('.stat-num[data-count]').forEach(el => {
      const target = Number(el.dataset.count)
      if (!Number.isFinite(target) || target <= 1) return
      if (el.getBoundingClientRect().top < window.innerHeight) return
      const suffix = el.dataset.suffix ?? ''
      const obj = { v: 0 }
      gsap.to(obj, {
        v: target, duration: 1.1, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.textContent = `${Math.round(obj.v)}${suffix}` },
      })
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return null
}
