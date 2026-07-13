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
      // The hero never animates: it is painted solid and still, so it can never
      // flash or flicker on landing, and there is no transform left on it to
      // eat a click. We still gather the hero elements only to EXCLUDE them
      // from the scroll reveal set below, so nothing here ever hides them.
      const hero = gsap.utils.toArray<HTMLElement>('#hero .fu')

      // Only hide and animate elements that start BELOW the fold. Anything
      // already on screen at load is left exactly as the server painted it,
      // so it can never be hidden then shown again, the little flicker on
      // landing. Off screen elements reveal as they scroll into view.
      const rest = gsap.utils.toArray<HTMLElement>('.fu')
        .filter(el => !hero.includes(el))
        .filter(el => el.getBoundingClientRect().top > window.innerHeight * 0.9)

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
