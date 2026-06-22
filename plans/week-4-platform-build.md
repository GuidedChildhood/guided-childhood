# Week 4 Plan — Platform V1 Build

Date: 2026-06-22 (starts 2026-06-23)
Branch: claude/agent-management-guided-childhood-lDYLl

## What already exists (do not rebuild)

Full audit done 2026-06-22. The platform code is complete in structure:
- Auth: signup, login, forgot-password, callback — all written
- Dashboard: home, digi, scripts, tracker, upgrade — all written
- API: /api/digi, /api/stripe/checkout, /api/stripe/webhook, /api/tracker, /api/founder-spots — all written
- Lib: supabase client+server, stripe, config/digi, config/social-media-law, content/stages — all written
- Middleware: protects /dashboard, /educator, /admin, /onboarding — written

The problem is simple: vercel.json has "framework": null and "buildCommand": "" — Vercel never builds the Next.js app.

## The deployment decision

Deploy the platform to app.guidedchildhood.com as a separate Vercel project.
Keep guidedchildhood.com as the static marketing site.

Reasons:
- Static site is converting well — do not risk breaking it
- app.guidedchildhood.com is a clean member destination
- The /join flow on the static site already points to /starter-pack (which will redirect to app.guidedchildhood.com/starter-pack for auth)

## 6-Week Build Sequence

### Week 4 (this week) — Deploy + Auth + Core shell
Day 1: Fix deployment. New vercel.json for app.guidedchildhood.com. Env vars. Build passes.
Day 2: Supabase schema migration. All tables. RLS policies. Seed stage content.
Day 3: Auth flow end to end. Sign up → onboarding → dashboard. Test on mobile.
Day 4: Dashboard home polish. Good Inside feel. Stage card, today's action, DiGi prompts.
Day 5: Scripts library. Full 17 scripts visible. Free (3) vs paid (all). Good Inside numbered card format.

### Week 5 — DiGi + Stripe + Member gating
Day 1: DiGi chat interface. Mobile-first. Warm, not clinical.
Day 2: DiGi stage awareness. Prompts change by stage. banWorld wiring for Stage 4.
Day 3: Stripe checkout end to end. Founder cap enforced. Webhook tested.
Day 4: Member gating. Free preview (3 scripts, 3 DiGi/day). Paid unlocks everything.
Day 5: Upgrade page. Vivid future framing (Good Inside pattern). Founder countdown live.

### Week 6 — Tracker + Schools alignment
Day 1: Wellbeing tracker UI. Weekly check-in, score saved, clear next action shown.
Day 2: Tracker history view. Trend line. Monthly summary. "What changed this week."
Day 3: Schools portal shell. Educator signup, DSL dashboard, school code link to parent accounts.
Day 4: Parent/school alignment. Parent dashboard shows "Your child's school is on Guided Childhood." Stage syncs with KS curriculum.
Day 5: PWA service worker. Install banner on mobile. Offline fallback.

### Week 7 — Content + polish
Day 1: All 17 scripts seeded in Supabase. Stage-filtered. Law_flag column working.
Day 2: DiGi Junior digi-squad lessons. 3 complete lesson packs (one per character).
Day 3: Wellbeing check email trigger. If concern_level = high → email parent with next step.
Day 4: Admin panel basics. Banner control, founder cap view, member count.
Day 5: Cross-device test. Chrome DevTools 375px + 1280px. Console clean.

### Week 8 — Schools full build
Day 1: School billing. school_small (£299/yr) and school_medium (£499/yr) tiers. Stripe products created.
Day 2: School admin. Add/remove pupils. DSL sees wellbeing overview (anonymised).
Day 3: Assembly resources in educator portal. Download links for Module 9 materials.
Day 4: Parent/school crossover page. "Your child is doing [unit] at school this week. Here is what to say at home."
Day 5: Schools launch email. Pilot outreach to 20 schools.

## Parent + Schools alignment model

The two products share the same stage framework. The connection is explicit on both sides.

PARENT DASHBOARD shows:
- "Stage 3. Your child's school is working on Unit 7 (Online Safety) this term."
- "The conversation to have at home this week aligns with what they are learning in class."
- Script for that unit shown.

SCHOOL PORTAL shows:
- DSL sees which pupils' parents are on Guided Childhood
- "11 of your Year 8 pupils have parents on the programme."
- Assembly resources reference the same stage framework

The message to both sides:
- To parents: "You and the school are working from the same map."
- To schools: "Parents who are engaged at home reinforce what you teach. This makes your job easier."

## Good Inside patterns to apply

From design-refs/good-inside-notes.md:

1. Quiz: one question per screen, auto-advance, no CONTINUE button
2. Reassurance screen after quiz: "You're in the right place." + one tailored line
3. Scripts: numbered gold circles (1=Say this, 2=Not this, 3=Why it works, 4=Tonight)
4. Pricing: vivid future framing above plan cards ("Imagine this time next year...")
5. Risk reversal always visible near CTA: "30 days. Full refund. No questions asked."
6. Dashboard: "Today's action" prominent. Not a list of features — one clear thing.
7. DiGi: conversational. Short responses. Never lectures. Warm.

## Success criteria for V1

- Sign up to dashboard: under 90 seconds on mobile
- DiGi responds in under 3 seconds
- Scripts readable and printable
- Stripe checkout works on first attempt
- Founder cap enforced correctly
- School educator can create an account and see their school code
- Parent sees school alignment if their school is connected

## Environment variables needed (Vercel)

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL (= https://app.guidedchildhood.com)
SUPABASE_SERVICE_KEY
ANTHROPIC_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_FOUNDER
STRIPE_PRICE_STANDARD
STRIPE_PRICE_ANNUAL
STRIPE_PRICE_SCHOOL_SMALL
STRIPE_PRICE_SCHOOL_MEDIUM
NEXT_PUBLIC_SOCIAL_MEDIA_LAW (= partial_ban)
DIGI_MODEL (= claude-fable-5)

Justin needs to supply:
- Supabase project URL + anon key + service key
- Anthropic API key
- Stripe secret + webhook secret + price IDs

## Files to create tomorrow (Day 1)

1. app-vercel.json — New vercel.json for the platform app (Next.js config, not static)
2. supabase/migrations/001_initial.sql — All tables + RLS
3. supabase/seed.sql — Stage content seed data
4. .env.local.template — Updated with all required vars

## Non-negotiables (carry forward)

1. No dashes in any copy
2. DIGI_MODEL via env var only, default claude-fable-5
3. Checker design tokens only
4. Mobile and desktop checked before declaring done
5. Scripts in database, not hardcoded
6. social_media_law flag drives Stage 4 content
7. Justin's voice throughout
8. Every CTA on /join routes to /starter-pack
9. Founder rate capped at 50, enforced in code
10. Never allow/deny — DiGi always returns a calibrated pathway
