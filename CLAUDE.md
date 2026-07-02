# Guided Childhood — Claude Code Instructions

Read guided-childhood-build/README.md at the start of every session.
Re-read /plans/decisions.md after any compaction.

## CONTEXT ROUTING — load only what the task needs

- Building any UI            → docs/05 + docs/07 (design system, motion rules)
- Anything DiGi              → digi/01-philosophy.md (DIGI_MODEL env var, default claude-fable-5)
- Characters / lessons       → digi-squad/README.md (Teo, Olga, Alma, DiGi Junior, UK animals)
- Database work              → docs/02 only
- Payments / paywall         → docs/01 (Stripe section) + docs/08 (save flow)
- Emails or any copy         → research/01 voice rules; no dashes ever in copy
- School features            → schools/01 + docs/09
- Retention features         → docs/08
- Marketing pages            → docs/06 + docs/09 (delivery model)
- Ban resilience             → docs/11 (social_media_law config flag)
- UX flow / onboarding       → design-refs/good-inside-notes.md (copy structure, not brand)

## PLANS

Write every plan to /plans/<week>-plan.md INSIDE this repo before building.
Re-read it after any compaction. Never rely on plan mode's disposable global file.

## NON-NEGOTIABLES

1. Never allow/deny. DiGi always returns a calibrated pathway.
2. DIGI_MODEL is a config value (env var). Default: claude-fable-5. Never hardcoded.
3. Checker design tokens only. No Inter. No purple gradients. No generic AI patterns.
4. No dashes in any copy — ever. Not in headings, not in buttons, not in body text.
5. Mobile and desktop checked in Chrome DevTools before declaring anything done.
6. Scripts live in the database (scripts table), not hardcoded in the app.
7. social_media_law flag drives Stage 4 content without a rewrite (docs/11).
8. Justin's voice throughout. Warm, plain, direct. No AI-isms.
9. Every CTA on /join routes to /starter-pack.
10. Founder rate capped at 50 — enforced in code, not just in copy.

## DESIGN SYSTEM

Fonts: Nunito (700-900 display, 400-600 body) + IBM Plex Mono (labels, eyebrows)
Colours: see README.md colour token block
Buttons: border-radius 16px, box-shadow 0 5px 0 <shadow-colour>, chunky
Motion: GSAP only — subtle fade-ups, staggered reveals, no Three.js

## WEEKLY RHYTHM

Monday: new session → read CLAUDE.md + decisions.md → write week-N-plan.md → approve → build
Daily: check /plans/, update decisions.md with anything decided
Friday: layout + console check → push → Vercel deploy
