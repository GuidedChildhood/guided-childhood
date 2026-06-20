# Week 3 Plan — Homepage to £100,000 quality

Date: 2026-06-17
Branch: claude/agent-management-guided-childhood-lDYLl

## Goal
Rebuild the homepage to match the quality of Good Inside (parents) and Jigsaw (schools). Every section designed to stop the scroll. Warm expert authority throughout. Young DiGi character introduced.

## The problem with the current homepage
1. No responsive CSS at all — broken on mobile
2. Hero is centred text only — no visual anchor
3. DiGi is a "D" in a circle — no character
4. Inconsistent button styling — some use .btn classes, some inline
5. Stage cards in 5-column grid — unusable on mobile
6. Too many sections with similar visual weight — no hierarchy of importance
7. Stats strip is three simple pills — not compelling

## Section order (final)
1. Announcement bar (coral, dismissable, ban reference)
2. Nav (sticky, mobile-friendly)
3. HERO — 2-column, giant type, DiGi chat visual on right
4. Stats strip — 4 numbers in dark ink panel (131 · 5 · 20 · 2027)
5. Ticker (green, existing)
6. Stage cards (responsive, horizontal scroll on mobile)
7. How it works walkthrough
8. DiGi section — character introduced properly
9. 20 issues grid
10. Mental health signals
11. Online risks
12. TRUST method
13. About Justin
14. What changes (outcome cards)
15. Testimonials
16. Research + expert bench
17. Policy strip
18. Schools crossover
19. Pricing
20. FAQ
21. Final CTA
22. Footer

## Key design decisions
- Hero: left text (60%), right DiGi chat visual (40%)
- Stats strip: var(--ink) background, white numbers, below hero
- Stage cards: CSS class `stages-grid` — 5col > 3col > 2col > 1col
- DiGi avatar: 52px green-dark circle, strong box-shadow, feels like a character
- Floating badges on DiGi card: "Ages 4 to 16" and "10 min/week"
- All grids get responsive CSS classes instead of inline grid-template-columns
- Buttons: all use .btn .btn-gold / .btn-green / .btn-ink classes
- No dashes in any copy
- GSAP: add .fu class to section headings and cards for fade-up

## Files changed
- app/globals.css — add responsive classes, new utilities
- app/page.tsx — complete hero redesign, responsive classes throughout
- components/marketing/AnnouncementBar.tsx — updated copy
- components/marketing/GsapInit.tsx — NEW, client component for animations

## Success criteria
- Chrome DevTools mobile (375px) looks clean and intentional
- Hero stops the scroll — parent immediately understands the product
- DiGi visual communicates "warm AI advisor" not "wireframe chatbot"
- Testimonials feel real and substantial
- Pricing is clear and the Founder Rate has urgency
- All buttons are chunky with hard shadows
