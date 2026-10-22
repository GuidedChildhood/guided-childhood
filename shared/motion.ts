import gsap from 'gsap'

// Small motion helpers both apps share, so a move that means one thing (a
// reward landing, a number arriving) looks the same wherever it happens.
// GSAP only, and every helper is a no op when the reader asks for less motion.

export function motionOk(): boolean {
  if (typeof window === 'undefined') return false
  try { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches } catch { return true }
}

// True when the element starts below the fold. The house rule from
// HomeReveals: only what the reader has not seen yet may be reset and
// animated, so nothing they are already looking at blinks to zero first.
export function belowFold(el: Element, at = 0.9): boolean {
  if (typeof window === 'undefined') return false
  return el.getBoundingClientRect().top > window.innerHeight * at
}

// Squash and stretch as something lands: a quick flatten on impact, then an
// elastic settle back to its own shape. From the Prompt Motion gallery's
// "slow in, slow out, squash" study (Justin, 22 October 2026). Added to a
// timeline at `position`, so it lands exactly when the drop does.
export function squashLand(
  tl: gsap.core.Timeline,
  target: gsap.TweenTarget,
  position?: gsap.Position,
  amount = 0.14,
): gsap.core.Timeline {
  return tl
    .to(target, { scaleX: 1 + amount, scaleY: 1 - amount, duration: 0.09, ease: 'power1.out' }, position)
    .to(target, { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' })
}
