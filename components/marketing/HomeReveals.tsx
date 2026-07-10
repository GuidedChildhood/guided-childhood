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
      // The hero reveal is handled in CSS (#hero .fu in globals.css) so the
      // server painted hero is never hidden then shown by JS, which was the
      // one time flicker on landing. JS only drives the scroll reveals below.
      const hero = gsap.utils.toArray<HTMLElement>('#hero .fu')

      // The hero CSS animation uses transform with animation-fill-mode forwards.
      // Forwards keeps the final transform, and a transformed element holds its
      // own compositor layer, which made the first click on the hero CTA only
      // wake the layer and the second click register (the two click bug). Once
      // each hero element has finished animating, strip the transform so no
      // layer lingers under the button. The rise still plays, the click lands
      // first time. A safety timeout covers any element whose animationend
      // fired before hydration attached the listener.
      const settleHero = (el: HTMLElement) => {
        el.style.transform = 'none'
        el.style.willChange = 'auto'
      }
      hero.forEach(el => el.addEventListener('animationend', () => settleHero(el), { once: true }))
      window.setTimeout(() => hero.forEach(settleHero), 1600)
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
