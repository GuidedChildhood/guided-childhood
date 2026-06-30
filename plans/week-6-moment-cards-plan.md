# Week 6 — Moment Cards, Animated DiGi, Premium Homepage

Date: 2026-06-28
Branch: claude/agent-management-guided-childhood-lDYLl

## Vision

A parent opens the app and sees a stack of flipable cards — one for each real
moment in their day. They flip "Won't get out of bed." The card turns over.
DiGi's face animates in and asks one specific question. They answer. DiGi gives
them the science in one sentence and the exact words to use tonight. They close
the app. That is the product.

## Architecture

### DiGi character
- SVG robot, custom designed, fully animatable with GSAP
- States: idle (bobbing), speak (eyes pulse), happy (bounce), thinking (tilt)
- Used on: homepage hero, moment card backs, onboarding, DiGi chat header
- Mobile-friendly SVG — scales from 32px avatar to full-screen hero

### Moment cards system
- CSS 3D flip — rotateY(180deg) on click
- Front: moment icon + title + age tags + "Flip for DiGi" hint
- Back: DiGi character animates in, asks opening question, shows science brief
- Cards are driven by the daily_moments table (age-filtered, category-browsable)
- Categories: Morning · Digital · School · Food · Evening · Transitions · Emotions

### daily_moments table (migration 009)
- title, category, age_bands[], icon, science_brief, digi_opener,
  solutions jsonb, expert_note, sort_order
- 60+ moments seeded at launch covering every scenario the user listed

### DiGi moment API (/api/digi/moment)
- POST with { momentId, childName, ageBand }
- Builds context-aware system prompt focused on the specific moment
- Returns: digiQuestion, science (1 sentence), solutions (3 items), script

### Homepage
- Hero: large animated DiGi + floating 3D-perspective card stack
- Cards tilt on mouse move (GSAP + CSS perspective)
- No Three.js — CSS 3D + GSAP achieves premium depth feel

### Progress layer (milestone engine)
- Moments completed tracked in moment_completions table
- Weekly summary card on dashboard home
- Monthly milestone celebrations (GSAP confetti burst)
- Duolingo-style: every completion gets a micro-win animation

## Build order this sprint

1. DiGi SVG character component (DigiCharacter.tsx)
2. Moment card component with CSS 3D flip
3. 009 migration + comprehensive seed (60 moments)
4. Dashboard moments section (today's 3 cards + browse all)
5. /api/digi/moment endpoint
6. Homepage hero update with animated DiGi + floating cards
7. Milestone/completion tracking
