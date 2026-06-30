# Guided Childhood — Master Build Plan

> Reviewed at the start of every session. Updated as things are built.
> Fable review: run `DIGI_MODEL=claude-fable-5` and ask DiGi to audit this plan against decisions.md.
> No dashes in copy ever. Justin's voice throughout. Checker tokens only.

---

## Status key

- [x] Built and pushed
- [~] Partially built or deployed but not complete
- [ ] Not started

---

## 1. Infrastructure and deployment

| Item | Status | Notes |
|------|--------|-------|
| Supabase project created | [x] | |
| Database schema (6 migration files) | [x] | Run in Supabase SQL Editor |
| Vercel project (Next.js app) | [~] | New project exists, env vars need to go on correct project (not the marketing site one) |
| vercel.json pointing to Next.js | [x] | framework: nextjs, buildCommand: next build |
| .vercelignore clean (no app/ exclusions) | [x] | Only .env files excluded |
| Stripe module-level crash fixed | [x] | `?? ''` not `!` |
| Stripe webhook secret | [~] | Placeholder `whsec_placeholder` set — needs real secret after app is live |
| Branch: claude/agent-management-guided-childhood-lDYLl | [x] | All platform work here |
| PR open | [~] | Draft PR exists, not merged to main |
| PWA icons | [ ] | icon-192.png + icon-512.png needed in /public |
| Custom domain on Vercel (app.guidedchildhood.com or platform) | [ ] | |

### Environment variables (add to NEW Vercel project, not www project)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_PRICE_FOUNDER
STRIPE_PRICE_STANDARD
STRIPE_PRICE_ANNUAL
STRIPE_PRICE_SCHOOL_SMALL
STRIPE_PRICE_SCHOOL_MEDIUM
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL
DIGI_MODEL=claude-fable-5
```

---

## 2. Database schema

| Table | Status | Notes |
|-------|--------|-------|
| profiles | [x] | id, full_name, subscription_tier, subscription_status, onboarding_complete |
| children | [x] | id, parent_id, name, age_band, stage_id, is_primary, streak_weeks |
| scripts | [x] | stage_id, category, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order |
| script_completions | [x] | user_id, script_sort_order, completed_at |
| digi_conversations | [x] | user_id, messages jsonb, created_at |
| tracker_entries | [x] | user_id, week_start, score, notes |
| onboarding_answers | [x] | user_id, age_band, challenge, feeling |
| school_accounts | [ ] | For school platform (see Section 6) |
| school_educators | [ ] | Many educators per school account |
| curriculum_progress | [ ] | School tracking per module/year group |

---

## 3. Script library

| Batch | Sort orders | Status | Action needed |
|-------|------------|--------|---------------|
| Original 17 (seed.sql) | 1-17 | [x] | Run in Supabase |
| Expansion batch (84 scripts) | 101-184 | [~] | Run supabase/seed-scripts-expansion.sql in Supabase SQL Editor |
| Daily moments batch 1 | 1301-1315 | [~] | Run supabase/seeds/daily_moments_batch1.sql |
| Daily moments batch 2 | 1316-1330 | [~] | Run supabase/seeds/daily_moments_batch2.sql |

**Total when all loaded: 131 scripts** (marketing says 100+ — correct)

### Scripts still needed (Batch 3+)

- [ ] Group chat batch (6-8 scripts on messaging app dynamics, friend group pressure, left on read)
- [ ] Specific gaming titles batch (Roblox, Fortnite, Minecraft, calls of duty — age-appropriate)
- [ ] Sleep and screens batch (10pm devices, melatonin, morning fog links)
- [ ] AI-specific batch (ChatGPT for homework, deepfakes, voice cloning, AI girlfriends)
- [ ] Parent self-reflection batch (your own phone use, modelling, guilt)

---

## 4. Parent platform — dashboard pages

### Built

| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Dashboard home | /dashboard | [x] | Stage card, last script insight, weekly actions, DiGi prompts |
| DiGi chat | /dashboard/digi | [x] | Fable-5 powered, stage-aware, conversation history |
| Scripts list | /dashboard/scripts | [x] | Stage-based, groups foundation through independent |
| Script reader | /dashboard/scripts/[sort_order] | [x] | Good Inside format, law flag, deck mode, DiGi CTA |
| Script card deck | /dashboard/scripts/[id]/deck | [x] | Swipeable card format |
| Tracker | /dashboard/tracker | [~] | Basic exists, full check-in form + trend line not built |
| Upgrade / pricing | /dashboard/upgrade | [x] | Founder rate, Stripe checkout |
| Pathway | /dashboard/pathway | [x] | Swipeable stage cards, Find Your Stage |
| Onboarding | /onboarding | [x] | Age band, challenge, feeling — sets child record |
| Login | /login | [x] | |
| Signup | /signup | [x] | |

### Still to build

| Page | Route | Status | Priority |
|------|-------|--------|---------|
| Settings | /dashboard/settings | [ ] | High — manage children, name, email, billing |
| Billing portal | /api/stripe/portal | [ ] | High — let members manage subscription |
| Multiple children management | /dashboard/settings | [ ] | Medium — add/switch child profiles |
| Streak + progress visuals | /dashboard | [ ] | Medium — visual streak indicator on home |
| Email: welcome email | — | [ ] | Medium — trigger on signup |
| Email: weekly check-in reminder | — | [ ] | Low — retention |
| Push notifications | — | [ ] | Low — PWA manifest first |

---

## 5. Parent-school curriculum link

The parent platform loosely mirrors what schools cover at each stage. This is NOT a data-sharing integration. No parent data goes to schools. No school data visible to parents. It is a loose curriculum alignment that adds value to parent members.

### How it works

1. Parent sets their child's age band → maps to a stage (1 to 5)
2. Stage maps to a UK Key Stage and approximate school year
3. Dashboard shows a "What your school may be covering this term" section
4. Content is drawn from the schools scheme of work topics for that Key Stage (not live school data)

### Curriculum mapping

| Parent stage | School Key Stage | School topics |
|-------------|-----------------|---------------|
| Foundation (4-7) | EYFS & KS1 | Screens, kindness, real vs not real |
| Builder (8-10) | KS2 Yr 3-6 | Algorithms, privacy, internet safety, coding basics |
| Explorer (11-13) | KS3 Yr 7-9 | Social media, AI chatbots, deepfakes, dark web awareness |
| Shaper (13-15) | KS4 Yr 10-11 | Manipulation, sextortion, radicalisation, readiness for 16 |
| Independent (16+) | KS5 Yr 12-13 | AI mastery, data rights, vibe coding, future technology |

### What to build

| Feature | Status | Notes |
|---------|--------|-------|
| Curriculum context section on dashboard home | [ ] | One card per stage. "Schools at this stage cover X." |
| Curriculum page | [ ] | /dashboard/curriculum — what schools cover at your child's stage |
| Parent evening prep script | [ ] | Script for the parent evening conversation matching the school curriculum |
| "Your school may be using Guided Childhood" prompt | [ ] | Soft awareness nudge — drives school enquiries |

---

## 6. Schools platform

The schools product is a separate offering sold directly to schools. It shares the Guided Childhood brand but has its own account type, dashboard, and content.

### Marketing page (guidedchildhood.com)

The marketing site already has a tab "For Teachers & Schools". The full schools marketing page needs:

| Section | Status | Notes |
|---------|--------|-------|
| Hero: A digital literacy curriculum every school can actually use | [~] | Exists in marketing HTML but needs review |
| Statutory alignment (4 frameworks) | [~] | Online Safety Act 2023, RSE, Education for a Connected World, DfE AI Guidance 2025 |
| What is included (3 pillars) | [~] | Scheme of work, CPD, Policy compliance |
| School DiGi section | [ ] | Safeguarding advisor, GDPR note |
| Pricing table (4 tiers) | [~] | £49, £299, £499, £999+ |
| Free assembly pack lead capture | [ ] | Email input → download + school licence enquiry flow |
| Social proof / testimonials | [ ] | |
| Footer nav update | [ ] | Add Teachers & Schools, How It Works, Wellbeing Tool |

### Schools platform dashboard (separate from parent dashboard)

| Feature | Status | Priority | Notes |
|---------|--------|---------|-------|
| School account type in Supabase | [ ] | High | school_accounts table |
| Educator login (multiple per school) | [ ] | High | school_educators, linked to school_account |
| Scheme of work browser | [ ] | High | 21 modules, filterable by Key Stage and Year Group |
| Module detail: lesson plan, worksheet, slides, parent note | [ ] | High | Each module has 4 downloadable assets |
| CPD module (4 parts + certificate) | [ ] | Medium | Self-paced, completion tracking |
| Assembly materials (6 assemblies) | [ ] | Medium | KS1 through KS5 + whole-school |
| Policy templates | [ ] | Medium | Digital behaviour policy, AI tools policy, online safety statement |
| Statutory alignment document (Ofsted pack) | [ ] | Medium | Downloadable, maps all 4 frameworks |
| Parent evening packs (primary + secondary) | [ ] | Medium | Downloadable PDFs |
| School dashboard (usage, educators, modules) | [ ] | Low | Small+ tiers |
| Multi-site dashboard | [ ] | Low | MAT tier only |
| School DiGi | [ ] | High | Separate DiGi instance, safeguarding-trained, no parent data |

### School pricing tiers

| Tier | Price | Includes |
|------|-------|---------|
| Individual Teacher Licence | £49/year | Single login, all lesson plans, CPD module, School DiGi |
| Small School (up to 300 pupils) | £299/year | Unlimited educator logins, full curriculum pack, assembly materials, policy template, school dashboard |
| Medium School (300-800 pupils) | £499/year | Everything in small + parent evening pack, staff training module, priority support |
| Large School / MAT (800+) | £999+/year | Everything in medium + multi-site dashboard, co-branded materials, bespoke onboarding |

Discounts: 10% on 2-year commitments. Free assembly pack for all enquiries.

### School DiGi specifics

- Separate DiGi instance from parent DiGi
- Trained for: safeguarding questions, statutory queries, class preparation
- GDPR: No parent or child personal data visible to school view
- No cross-contamination between school and parent accounts
- Uses same DIGI_MODEL env var (claude-fable-5)

---

## 7. Scheme of work — 21 half-term modules

| # | Key Stage | Year Group | Topic |
|---|-----------|-----------|-------|
| 1 | EYFS | Yr R | Screens and us — what they are and how we use them |
| 2 | KS1 | Yr 1-2 | Kindness online, real vs not real |
| 3 | KS2 | Yr 3 | Algorithms and how your feed learns |
| 4 | KS2 | Yr 4 | Privacy basics — what you share and with whom |
| 5 | KS2 | Yr 5 | Internet safety — strangers, trust, and what to do |
| 6 | KS2 | Yr 6 | Coding basics and how apps are built |
| 7 | KS3 | Yr 7 | Social media — how it works and what it wants |
| 8 | KS3 | Yr 7 | AI chatbots — what they are and what they are not |
| 9 | KS3 | Yr 8 | Deepfakes — how to spot them and why they matter |
| 10 | KS3 | Yr 8 | Dark web awareness — myths and realities |
| 11 | KS3 | Yr 9 | Comparison culture and body image online |
| 12 | KS4 | Yr 10 | Manipulation — how influence works at scale |
| 13 | KS4 | Yr 10 | Sextortion and image-based abuse — recognition and response |
| 14 | KS4 | Yr 11 | Radicalisation — what it looks like and where it starts |
| 15 | KS4 | Yr 11 | Readiness for 16 — the ban, the gap, the plan |
| 16 | KS5 | Yr 12 | AI mastery — using tools well, ethically, critically |
| 17 | KS5 | Yr 12 | Data rights — ownership, surveillance, consent |
| 18 | KS5 | Yr 13 | Vibe coding and what AI means for work |
| 19 | KS5 | Yr 13 | Future technology — agency, not anxiety |
| 20 | Whole school | All | Assembly: the cliff edge conversation |
| 21 | Whole school | All | Assembly: the TRUST framework for families |

### Module assets (each module needs)

- [ ] Teacher lesson plan (1 A4 page, editable)
- [ ] Pupil worksheet (age-appropriate, printable)
- [ ] Slide deck (15-20 slides, no prep required)
- [ ] Parent note (1 page, sent home or via school app)

---

## 8. Content and copy still needed

| Item | Status | Notes |
|------|--------|-------|
| Welcome email copy | [ ] | Warm, plain, Justin's voice. Trigger on signup. |
| Weekly check-in email | [ ] | Retention. One question. Not a newsletter. |
| School enquiry response email | [ ] | Auto-reply to free assembly pack requests |
| Terms and conditions | [ ] | Parent platform + school platform |
| Privacy policy | [ ] | Covers both platforms, GDPR compliant |
| Safeguarding statement | [ ] | For school DiGi |
| All 21 lesson plan drafts | [ ] | Core schools product content |
| CPD module script (4 parts) | [ ] | Two-hour content — research, classroom practice, etc. |
| 6 assembly scripts | [ ] | KS1-KS5 + whole-school |
| Policy templates (3 documents) | [ ] | Behaviour policy, AI tools policy, online safety statement |
| Statutory alignment document | [ ] | Ofsted readiness pack |
| Parent evening packs (primary + secondary) | [ ] | |

---

## 9. Build order

### Week 4 (current — deployment + core parent platform)

- [~] Fix Vercel deployment: env vars on correct project, redeploy from feature branch
- [ ] Fix Stripe webhook: get real endpoint URL once app is live
- [ ] Add settings page (/dashboard/settings)
- [ ] Add billing portal (/api/stripe/portal)
- [ ] Add PWA icons
- [ ] Run seed scripts in Supabase (expansion + batch 1 + batch 2)

### Week 5 (parent platform completion)

- [ ] Tracker: full check-in form + trend line
- [ ] Multiple children management (add/switch from settings)
- [ ] Curriculum context section on dashboard home
- [ ] Welcome email
- [ ] Test full user journey: signup → onboarding → scripts → DiGi → upgrade → billing

### Week 6 (schools marketing + lead capture)

- [ ] Schools marketing page final pass
- [ ] Free assembly pack lead capture (email input → download)
- [ ] School enquiry form + auto-response
- [ ] School pricing page

### Week 7 (schools platform foundation)

- [ ] School account type in Supabase (school_accounts, school_educators tables)
- [ ] School login flow (separate from parent login)
- [ ] School dashboard skeleton
- [ ] Scheme of work browser (21 modules, filterable)
- [ ] First 6 module assets (EYFS through Yr 6 — primary focus first)

### Week 8 (schools platform full)

- [ ] Remaining 15 module assets
- [ ] CPD module (4 parts, completion tracking, certificate)
- [ ] Assembly materials (6 assemblies)
- [ ] Policy templates (3 documents)
- [ ] Statutory alignment document
- [ ] Parent evening packs

### Week 9 (school DiGi + integration)

- [ ] School DiGi instance (safeguarding mode)
- [ ] Parent-school curriculum link (loose mapping in parent dashboard)
- [ ] School dashboard (usage, educators, module completion)
- [ ] Multi-site dashboard (MAT tier)

### Week 10 (launch)

- [ ] Full QA pass: parent platform, schools platform, mobile + desktop
- [ ] Terms, privacy policy, safeguarding statement
- [ ] Stripe: school pricing tiers in dashboard
- [ ] Press and LinkedIn launch content
- [ ] Founder 50 close (parent platform)

---

## 10. Non-negotiables (never break these)

1. DiGi never allows or denies. Always returns a calibrated pathway.
2. DIGI_MODEL is an env var. Default: claude-fable-5. Never hardcoded.
3. Checker design tokens only. No Inter. No purple gradients.
4. No dashes in any copy — ever. Not in headings, buttons, body text, or this plan.
5. Mobile and desktop checked in Chrome DevTools before declaring anything done.
6. Scripts live in the database, not hardcoded in the app.
7. social_media_law flag drives Stage 4 content without a rewrite.
8. Justin's voice throughout. Warm, plain, direct. No AI-isms.
9. Every CTA on /join routes to /starter-pack.
10. Founder rate capped at 50 — enforced in code, not just in copy.
11. School DiGi: no parent or child personal data visible to school view. Ever.
12. GDPR: school and parent data are completely separate. No crossover.

---

## 11. Fable review protocol

At the start of each session, after reading this plan, ask DiGi (running on claude-fable-5):

> "Review this plan against what has been built. What is missing? What has been built that is not in the plan? What is the next single most important thing to build?"

DiGi will audit the plan against decisions.md and the current codebase. Its answer is the start point for the session.

To trigger a Fable review from the terminal:
```
DIGI_MODEL=claude-fable-5 claude "Review /plans/master-build-plan.md against /plans/decisions.md and the current codebase. What is the most important gap?"
```

---

## 12. Decisions log (link)

See `/plans/decisions.md` for all architectural and product decisions made to date.

---

*Last updated: 2026-06-27*
*Branch: claude/agent-management-guided-childhood-lDYLl*
