# Week 1 Plan — Shell + Auth + PWA + Join LP + Starter Check

**Goal:** Everything needed for a founder to sign up, onboard, reach the dashboard, and pay.

---

## Deliverables checklist

### Setup
- [x] Next.js 16, TypeScript, Tailwind 4, App Router
- [x] CLAUDE.md + AGENTS.md (from docs/10 template)
- [x] /plans/decisions.md + /plans/week-1-plan.md
- [x] guided-childhood-build/ copied into project
- [x] docs/11 ban resilience created
- [ ] .env.local template
- [ ] Install deps: @supabase/supabase-js @supabase/ssr stripe @anthropic-ai/sdk gsap

### Design system
- [ ] globals.css: colour tokens, typography, button recipe
- [ ] Google Fonts: Hanken Grotesk + IBM Plex Mono in layout.tsx
- [ ] UI components: Button, Card, Badge, Input, Logo

### PWA
- [ ] public/manifest.json (name, icons, display: standalone, theme_color)
- [ ] public/sw.js (service worker, cache shell)
- [ ] <link rel="manifest"> in layout.tsx
- [ ] Install prompt component

### Supabase + Auth
- [ ] lib/supabase/client.ts (browser client)
- [ ] lib/supabase/server.ts (server component client)
- [ ] lib/supabase/middleware.ts (session refresh)
- [ ] middleware.ts (route protection: /dashboard /educator /admin)
- [ ] /login page (email + password, magic link fallback)
- [ ] /signup page (name + email + password)
- [ ] /forgot-password page (reset email)
- [ ] Supabase auth callback route (/auth/callback)

### Onboarding (the starter check)
- [ ] /starter-pack — 3-question quiz (no auth required)
  - Q1: How old is your child? (age band selector)
  - Q2: What is your main challenge right now? (6 options)
  - Q3: How are you feeling about it? (3 options)
  - Result: stage card + script excerpt + one action + warning signs
  - CTA: "Save your child's pathway" → /signup (answers in localStorage)
- [ ] /onboarding — post-signup stage assignment (reads from localStorage, writes to DB)

### Dashboard shell
- [ ] /dashboard layout (protected)
- [ ] Bottom tab bar component (Home · DiGi · Scripts · Tracker · More)
- [ ] Dashboard home — stage card placeholder, weekly actions placeholder, DiGi quick access placeholder
- [ ] /dashboard/digi — DiGi chat shell (no AI yet, Week 2)
- [ ] /dashboard/scripts — scripts grid shell
- [ ] /dashboard/tracker — tracker shell
- [ ] /dashboard/upgrade — paywall page

### /join LP (membership landing page)
Following docs/09 final structure exactly. Every CTA → /starter-pack.
- [ ] Hero: "Your child deserves a guide through this" + quiz CTA
- [ ] 30-day guarantee badge
- [ ] Stage cards with parent quotes (5 stages)
- [ ] TRUST framework loop (5 steps visual)
- [ ] Justin story block (photo placeholder + 3 sentences)
- [ ] Expert bench (Justin + DiGi + Orben/Livingstone/Przybylski)
- [ ] Everything-included feature cards (Good Inside parity map)
- [ ] Outcome narrative: Tonight / This term / Age 16
- [ ] Testimonials (3 placeholder, real on launch)
- [ ] Pricing: Founder £7.99 (if <50) · Monthly £12.99 · Annual £99
- [ ] FAQ (7 objections from docs/09)
- [ ] Final CTA → /starter-pack

### Stripe
- [ ] lib/stripe/index.ts (Stripe client)
- [ ] /api/stripe/checkout (POST — create checkout session, founder-50 gate)
- [ ] /api/stripe/webhook (POST — handle events, update profiles)
- [ ] Founder count display on /join ("X of 50 places taken")
- [ ] .env.local: STRIPE_* price IDs

### Deployment
- [ ] .env.local template (all vars listed, no values)
- [ ] vercel.json (if needed)
- [ ] git init + initial commit
- [ ] Push to guided-childhood repo, branch: platform-week-1
- [ ] Vercel project connected (Justin to do — needs his credentials)

---

## Build order (today)

1. Install dependencies
2. globals.css design tokens + fonts
3. UI component primitives (Button, Card, Input)
4. Supabase lib files + middleware
5. Auth pages (login, signup, forgot-password)
6. /starter-pack (3 questions, result, localStorage)
7. /onboarding (reads localStorage, writes to DB)
8. Dashboard layout + bottom tab bar
9. Dashboard shell pages
10. /join LP (full structure)
11. Stripe checkout + webhook
12. PWA manifest + service worker
13. Verification: iPhone 14 + desktop in DevTools
14. Commit + push

---

## Acceptance criteria (must pass before Week 1 is done)

- [ ] Can sign up with email + password
- [ ] Password reset email sends
- [ ] Starter check completes and shows correct stage for each age input
- [ ] "Save your pathway" creates account and lands on /dashboard with stage set
- [ ] /dashboard protected — /login redirect if not authed
- [ ] Bottom tab bar visible on mobile, hidden on desktop (top nav instead)
- [ ] /join fully rendered at mobile and desktop, all CTAs route to /starter-pack
- [ ] Founder count shows correctly (mock 0 of 50)
- [ ] Stripe checkout opens (test mode)
- [ ] PWA installs on iPhone (add to home screen)
- [ ] No console errors at either breakpoint
- [ ] No dashes in any visible copy
