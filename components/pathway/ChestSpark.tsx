'use client'

import { useEffect, useRef } from 'react'

// A shooting star across the school chest, so it catches the eye beside the road.
//
// Justin, 12 August 2026: "it is definitely on below the parents pathway, but I
// want it sparking next to the pathway, like a shooting star."
//
// ── THE PROBLEM IT SOLVES ───────────────────────────────────────────────────
//
// The chest is the one thing on the pathway a parent can walk past for a whole
// term and lose nothing by, and it is drawn that way on purpose: small, closed,
// no count, no badge. That restraint is right and it has a cost, which is that
// it reads as scenery. Justin has been looking straight at it and reporting it
// as missing, which is about as clear a verdict as a design gets.
//
// So it needs to catch the eye without becoming a task. A badge or a red dot
// would fix the noticing and break the meaning: those say something is waiting
// on you, and nothing here ever is. A shooting star says look over here, and
// nothing more. It is the one attention grabber that carries no obligation.
//
// ── IT STOPS ONCE THEY HAVE BEEN IN ─────────────────────────────────────────
//
// `active` goes false the moment the chest is opened, and this renders nothing
// at all after that. An animation that never stops is a thing to be endured, and
// the whole argument for the chest is that it never nags. It sparks while it has
// something to tell you about, then it is quiet for good.
//
// ── WHY IT IS NOT A LOOP ────────────────────────────────────────────────────
//
// Three passes, spaced, then it stops even while the chest is still unopened.
// A star that crosses every four seconds for as long as the page is open is a
// screensaver, and by the third crossing the eye has stopped reporting it. Three
// is enough to be noticed on arrival and few enough to be over before it can
// annoy.
//
// GSAP because the house rule says GSAP, and because the timeline expresses
// "three passes then stop" in a way a keyframe animation cannot without a
// count and a delay fighting each other.

export default function ChestSpark({ active }: { active: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    const host = hostRef.current
    if (!host) return

    // Reduced motion gets nothing. Not a slower star, nothing: the chest is
    // perfectly usable without it and the copy carries the whole meaning.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let tl: gsap.core.Timeline | null = null
    let cancelled = false

    // Loaded on demand so a decorative flourish never sits in the bundle that
    // the pathway needs to render.
    import('gsap').then(({ gsap }) => {
      if (cancelled || !hostRef.current) return
      const star = hostRef.current.querySelector('.chest-star')
      if (!star) return

      // Opacity rides its OWN track rather than the travel tween, and that is
      // not tidiness. Fading in across the whole crossing and then out again
      // over the tail means the two overlap and the star never actually reaches
      // full: measured, it peaked at 0.49 and read as a smudge. Snap it bright
      // in 0.16s, hold it lit for the crossing, fade it over the last third.
      // PIXELS, NOT PERCENTAGES, and this is the bug that cost the most time.
      // xPercent and yPercent are percentages of the ELEMENT, not of the card
      // it crosses. On a streak 96 by 3.5 that meant it travelled about 130px
      // sideways and SIX pixels down: it skimmed the top edge and left, which
      // traced as lit frames at y=8 falling to y=1. It was animating perfectly
      // and going nowhere.
      //
      // The card is clipped by the wrapper's overflow hidden, so overshooting
      // at both ends is free and covers a tall card as well as a short one.
      tl = gsap.timeline({ repeat: 2, repeatDelay: 5.5, delay: 1.1 })
      tl.fromTo(
        star,
        { x: -120, y: -60, rotate: 34, scaleX: 0.55 },
        { x: 430, y: 330, rotate: 34, scaleX: 1, duration: 0.85, ease: 'power2.in' },
        0,
      )
        // Peaks at 0.82, not 1. At full it crossed the heading as a solid bar
        // and blanked "is doing next" for a beat. A shooting star should pass in
        // front of the words, not delete them.
        .fromTo(star, { opacity: 0 }, { opacity: 0.82, duration: 0.16, ease: 'none' }, 0)
        .to(star, { opacity: 0, duration: 0.3, ease: 'power1.in' }, 0.55)
    })

    return () => { cancelled = true; tl?.kill() }
  }, [active])

  if (!active) return null

  return (
    <div
      ref={hostRef}
      aria-hidden
      style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
        borderRadius: 20, pointerEvents: 'none',
      }}
    >
      <div
        className="chest-star"
        style={{
          position: 'absolute', top: 0, left: 0,
          width: 96, height: 3, opacity: 0,
          borderRadius: 100,
          // The head is the bright end and the tail fades out behind it, so the
          // streak reads as travelling rather than as a line that appeared.
          //
          // DEEP GOLD, NOT WHITE, and that is the whole colour decision. The
          // card behind this is --stage-1, a very pale cream, so the obvious
          // white hot star with a butter glow was invisible: measured at full
          // opacity it still photographed as a smudge. On a light ground a
          // streak has to go DARKER than its background to read, not brighter.
          background: 'linear-gradient(90deg, rgba(201,154,40,0) 0%, rgba(201,154,40,0.65) 45%, #C99A28 78%, #8A6410 100%)',
          boxShadow: '0 0 10px 2px rgba(237,195,95,0.9)',
          transformOrigin: 'right center',
        }}
      />
    </div>
  )
}
