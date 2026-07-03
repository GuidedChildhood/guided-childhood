# Homepage polish: Good Inside warmth, Apple finish

**Date:** 2026-07-03
**Branch:** claude/continue-build-ldot8v
**Brief from Justin:** content and links stay, the look goes professional and high quality. Apple level finish, slick subtle motion, SEO, parent welcoming, aimed at the ICP. Benchmark goodinside.com.

## The core finding

92 elements on the homepage carry the fade up class `fu` and nothing animates them. The motion system was scaffolded and never wired. Bringing it alive is most of the "slick moving bits" ask.

## The pass

1. **Motion, finally wired.** New HomeReveals client component: GSAP + ScrollTrigger animates every `.fu` (opacity 0 to 1, y 22 to 0, power3.out, 0.7s), batched per section with 90ms stagger. Hero elements sequence on load without waiting for scroll. prefers-reduced-motion disables everything.
2. **Apple tactility in globals.css.** Glass nav (backdrop blur + saturate over translucent cream), buttons that lift 1px on hover and press 2px down on click with the hard shadow compressing, a `.lift` utility for cards (translateY(-3px) + shadow deepen on hover), butter selection colour, focus visible rings, text-wrap balance on headings, antialiasing.
3. **Section dressing, no copy changes.** Cards get `.lift`, consistent 20px radius and the warm shadow scale (0 4px 24px rgba(26,26,46,.07) resting, .12 hover).
4. **SEO check.** Metadata, JSON-LD and sitemap already exist; verify and leave alone unless something is wrong.

## Rules carried

Copy untouched. Tokens only. Nunito + IBM Plex Mono. GSAP only. No dashes. Mobile and desktop checked before done.
