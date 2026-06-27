# Week 5 — First-Time User Onboarding Flow

Date: 2026-06-27
Branch: claude/agent-management-guided-childhood-lDYLl

## What we are building

A 5-screen onboarding flow that runs for first-time users only. Returning users skip
it entirely (the login-state fix already handles this via onboarding_complete flag).

The goal: every new user finishes onboarding having solved one real thing, not having
watched a tour.

## Screens

1. Welcome — full cream screen, single CTA
2. Personalise — 3 sub-screens (name, age, challenges), progress dots
3. Meet DiGi — personalised AI intro, references child + challenge
4. Founding offer — real server-side counter, £7.99/mo lifetime lock
5. First task — DiGi opens on their hardest moment, one action + one script

## Files

- app/api/onboarding/digi/route.ts (NEW) — single API call returns DiGi intro + first task
- app/onboarding/page.tsx (REWRITE) — full 5-screen client component

## Key decisions

- Save to DB (profiles + children) after Q3, set onboarding_complete: true
- DiGi content (intro + task) fetched in one call during the loading transition
- Founder count from existing /api/founder-spots — real, server-side, 60s cache
- Claim button → form POST to /api/stripe/checkout with tier=founder
- Maybe later → skips to first-task screen
- After first task → redirect to /dashboard
- localStorage from starter-pack pre-fills age band + challenge if present
- No streaks, no gamification, no feature tour

## Design

- DESIGN_SYSTEM.md tokens: Fraunces display, Inter body, terracotta accent
- Cream background, white cards, 16px radius, one soft shadow
- Mobile-first 375px
- No dashes in copy
