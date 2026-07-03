'use client'

import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Drives every element marked .fu on the marketing page. The class was
// scaffolded across the whole homepage but never animated: this is the
// missing engine. Hero elements sequence in on load, everything else
// fades up as it scrolls into view, one gentle stagger per batch.
// Reduced motion preference turns the whole thing off, and content is
// fully visible without JavaScript because hiding only happens here.
export default function HomeReveals() {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const hero = gsap.utils.toArray<HTMLElement>('#hero .fu')
      const rest = gsap.utils.toArray<HTMLElement>('.fu').filter(el => !hero.includes(el))

      if (hero.length) {
        gsap.set(hero, { opacity: 0, y: 22 })
        gsap.to(hero, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.09, delay: 0.05, clearProps: 'transform,opacity' })
      }

      if (rest.length) {
        gsap.set(rest, { opacity: 0, y: 22 })
        ScrollTrigger.batch(rest, {
          start: 'top 88%',
          once: true,
          onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.09, clearProps: 'transform,opacity' }),
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return null
}
