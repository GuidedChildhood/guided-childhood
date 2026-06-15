# Guided Childhood — Full Platform Roadmap

Not a build plan. A map of everything. Updated as decisions are made.

---

## STATUS KEY
- ✅ Built
- 🔲 Planned, not started
- 🔄 Partially built

---

## PARENT PLATFORM

### Auth
- ✅ /login (email + password)
- ✅ /signup
- ✅ /forgot-password
- ✅ /auth/callback (Supabase session)
- ✅ Middleware route protection

### Onboarding
- ✅ /starter-pack (3-question quiz, stage result, script excerpt, localStorage)
- ✅ /onboarding (reads localStorage, writes to profiles + children tables)

### Dashboard
- ✅ Dashboard layout + bottom tab bar (mobile) / top nav (desktop)
- ✅ /dashboard home (stage card, weekly actions placeholder, DiGi tip)
- ✅ /dashboard/digi (full DiGi chat, rate limiting, history)
- ✅ /dashboard/scripts (17 scripts listed, free/paid gating)
- 🔲 /dashboard/scripts/[id] (individual script page — say this / not this / why / action)
- ✅ /dashboard/tracker (shell)
- ✅ /dashboard/upgrade (paywall)
- 🔲 /dashboard/settings (account, billing portal, child stage edit)

### DiGi
- ✅ /api/digi (POST, auth, rate limit, history, model fallback chain)
- ✅ DIGI_MODEL env var, default claude-fable-5, fallbacks to claude-opus-4-8 then claude-sonnet-4-6
- 🔲 DiGi conversation history loaded on page open
- 🔲 DiGi notification feed (weekly tip pushed to parent)

### Scripts (17 total)
All content to be seeded into scripts table in Supabase.
- ✅ 1 · The First Device Conversation (Stage 1, free)
- ✅ 2 · The Bedroom Rule (Stage 2, free)
- ✅ 3 · The Algorithm Conversation (Stage 3, free)
- 🔲 4 · When Things Go Wrong Online (Stage 4, paid)
- 🔲 5 · The Mood and Phone Connection (Stage 3, paid)
- 🔲 6 · The Gaming Conversation (Stage 2, paid)
- 🔲 7 · The Social Media Ask (Stage 3, paid)
- 🔲 8 · The Bedtime Device Check-In (Stage 2, paid)
- 🔲 9 · The Unknown Contact Conversation (Stage 4, paid)
- 🔲 10 · The Sexting Risk Conversation (Stage 4, paid)
- 🔲 11 · The AI and Deepfakes Conversation (Stage 4, paid)
- 🔲 12 · The TikTok Algorithm Walk-Through (Stage 3, paid)
- 🔲 13 · The Family Agreement Introduction (Stage 2, paid)
- 🔲 14 · The Weekly Check-In Script (Stage 4, paid)
- 🔲 15 · The Influencer and Body Image Conversation (Stage 3, paid)
- 🔲 16 · The Digital Footprint Conversation (Stage 4, paid)
- 🔲 17 · Building Independence (Stage 5, paid)

### Tracker
- ✅ Shell page
- 🔲 Mark weekly action complete
- 🔲 Streak display (pulls streak_weeks from children table)
- 🔲 Weekly actions from database (currently hardcoded)
- 🔲 Monday 09:00 weekly reset

### Payments
- ✅ /api/stripe/checkout (POST, founder-50 gate, create session)
- ✅ /api/stripe/webhook (subscription events, profiles update)
- ✅ /dashboard/upgrade (paywall page)
- 🔲 /api/stripe/portal (Stripe billing portal redirect)
- 🔲 Founder count live on /join

---

## MARKETING PAGES

- ✅ Homepage (/)
- ✅ /join (full LP, stage cards, pricing, FAQ, every CTA to /starter-pack)
- 🔲 /schools (school-specific LP with DSL messaging, per-school pricing)
- 🔲 /blog or /research (links to the key studies, Justin's voice)

---

## SCHOOL PORTAL (future — Week 3 or 4)
Source of truth: guided-childhood-build/schools/01.md
Read with docs/09, docs/11, research/02 before building anything here.

### Model
B2B pilot-led, never self-serve. A teacher evaluates, then advocates internally.
Flow: /school-pack → sample lesson + assembly + statutory alignment → request pilot → 48-hour response → 30-min call → free one-term pilot → paid licence.
The free thing is the PILOT, not a free tier.

### Pricing
- Teacher Licence: £49 / year (single educator)
- Small School up to 300 pupils: £299 / year (most popular)
- Medium School 300 to 800 pupils: £499 / year
- Large School / MAT 800+: £999+ custom
- Pilot: one term free, no commitment, 48-hour response

### Scheme of Work (21 modules)
21 half-term modules, EYFS to Year 13, in Oak National Academy format (zero-prep, slide deck, teacher notes, no login to browse — the format schools already know).
Each module:
- Follows Rosenshine: daily review, small steps, questions, models, guided then independent practice
- Pairs with a parent version sent home (the home-school bridge, our moat)
- Carries a DSL safeguarding note and disclosure-handling guidance
- Maps to all statutory frameworks: Education for a Connected World (UKCIS), statutory RSHE, KCSIE online safety duties, Online Safety Act, Ofcom media literacy, DfE AI guidance
- Follows PSHE Association principles: safe environment, distancing techniques, NO scare tactics

Sample module on /school-pack: Module 9, Social Media and the Brain (KS3, 50 min)

### Marketing and routes
- 🔲 /school-pack — the school landing page (not /schools). No login to browse. Sample lesson + assembly + statutory alignment doc available immediately.
- 🔲 /teachers — redirect or alias for /school-pack

### Educator dashboard (/educator/*)
- 🔲 /educator/login (separate auth, school code or invite link)
- 🔲 /educator/dashboard — browse/teach modules by year group, one-click to slides, mark taught, send parent version, pilot status
- 🔲 /educator/modules — 21 modules, filterable by year group, KS, topic
- 🔲 /educator/cpd — 90-min onboarding session + per-module CPD notes
- 🔲 /educator/wellbeing — class wellbeing overview (aggregate only, never individual surveillance)
- 🔲 /educator/compliance — printable statutory alignment doc (the conversion asset for DSL to show head and governors)
- 🔲 /educator/share — QR code + parent letter template + newsletter copy per year group

### School DiGi (educator persona)
- 🔲 Same model (DIGI_MODEL), classroom framing
- 🔲 Knows which modules a class has covered
- 🔲 Safeguarding-aware: surfaces escalation pathway, never diagnoses, routes serious flags per research/02 Part 4 (DSL → CAMHS, NSPCC, CEOP, 999)
- 🔲 Role-gated: never serves parent-home content in school context or vice versa

### Database (extends Week 1 schema)
Three new tables needed:
```sql
school_profiles (id, name, type, pupil_count, licence_tier, pilot_status, primary_contact, created_at)
school_educators (school_id, user_id, role) -- role: dsl / lead / educator
module_progress (id, school_id, module_id, year_group, taught_by, taught_at, parent_version_sent)
```

### Admin
- 🔲 /admin/schools (list, seat count, renewal date, pilot status, contact)
- 🔲 /admin/users (search, subscription status, impersonate)

### Statutory alignment pitch line (ban resilience)
"The ban handles access. We handle readiness. Ofsted will ask about the second part."

---

## COUNTRY SELECTOR + BAN RESILIENCE

- ✅ social_media_law config flag in lib/config/social-media-law.ts (none / partial_ban / full_ban_u16)
- ✅ Stage 4 content adapts to flag value
- 🔲 Country selector on settings page (writes flag to profile)
- 🔲 Country-specific Stage 4 scripts in database (law_flag column)
- Countries to support at launch: UK, Australia, France, Germany, Canada, Ireland, US

---

## AI TOOLS SETTINGS GUIDE (future content)

A quarterly-updated guide for parents on how to set safety controls on:
- 🔲 ChatGPT (OpenAI parental controls)
- 🔲 Gemini (Google Family Link)
- 🔲 Snapchat My AI
- 🔲 TikTok parental controls
- 🔲 Instagram family centre
- 🔲 YouTube supervised accounts

Stored as scripts in the database (type: settings_guide), updatable without a deploy.

---

## PWA

- ✅ manifest.json
- ✅ service worker (sw.js)
- ✅ PwaRegister component in root layout
- 🔲 App icons (icon-192.png + icon-512.png) — Justin to create

---

## DATABASE (Justin to run)

- 🔲 Supabase project created
- 🔲 Schema from docs/02 applied
- 🔲 17 scripts seeded into scripts table
- 🔲 Env vars set in Vercel

---

## COMMUNITY (post-launch)

- 🔲 Founders Room (one room, Justin posts 3x weekly, report button on every post)
- 🔲 No topic rooms until 200 members
- 🔲 Weekly digest email to all members

---

## CONTENT PIPELINE (ongoing)

Justin's Instagram Reel scripts (10 written, to record):
1. The YouTube babysitter story
2. The day I noticed my daughter had changed
3. Two years of research in 60 seconds
4. What the algorithm actually does
5. The bedroom rule explained
6. The one conversation every parent needs to have
7. Why the Australian ban is not working
8. What Germany got right
9. The script for tonight
10. What I wish I had known at Stage 1

LinkedIn newsletter (live on Substack: https://substack.com/@justinphillips):
- It Was Never The Hours (published)
- The Villain Was Already In The Room (published, Part 2)
- Next edition: country-by-country approaches (timely given UK announcement)

---

## DECISIONS LOG

See /plans/decisions.md for all architecture and product decisions.
