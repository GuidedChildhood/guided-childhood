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
- Local Authority (LA): £5,000 to £15,000 / year — covers all schools in the LA footprint, LA digital lead as account owner, bulk CPD, governor briefing pack, LA-branded compliance report. One LA contract = 50 to 100 schools. Primary sales target: LA digital literacy leads and Director of Education offices.
- Pilot: one term free, no commitment, 48-hour response

### AI Literacy Strand
AI literacy runs as a named curriculum thread through the 21-module scheme of work, not a bolt-on. It future-proofs the platform and is the one area where no school scheme currently does the job.

Strand covers (by stage):
- EYFS to KS1: What is AI? Friendly vs tricky robots. Voice assistants.
- KS2: How recommendation algorithms work. Why the app keeps showing you more. AI in games.
- KS3: Deepfakes and synthetic media. How to spot AI-generated content. Prompt literacy basics.
- KS4: AI in hiring, policing, healthcare. Bias in AI. Your digital footprint and AI.
- KS5: Creating responsibly with AI. AI and employment. Digital rights in an AI world.

Each AI module:
- Maps to DfE AI guidance and Ofcom media literacy requirements
- Carries a parent version (same lesson, home-friendly language)
- Integrates with the Digital Driver's Licence (see below) — AI literacy = required for Gold and Platinum

Build note: AI literacy content lives in the scripts table (type: lesson_ai). No hardcoding.

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
- 🔲 /educator/slt-report — one-click SLT report (see below)

### SLT Reporting Dashboard
The conversion asset for senior leadership. DSLs can show the head; heads can show governors; governors can show Ofsted.

Report includes:
- Modules taught this term (by year group, date, teacher)
- Pupil Digital Driver's Licence progress (% at each level, by year group)
- Parent engagement rate (parent version sent + opened, where trackable)
- Safeguarding: disclosures raised via platform, escalation actions (aggregate count, never detail)
- Statutory coverage map: which frameworks are covered and to what depth
- Comparison to last term

Output: one-page PDF, school-branded (logo + name auto-inserted). Generated server-side on demand.

Why it matters: this report answers the Ofsted inspector question before it is asked. A head who can print this in 10 seconds will not cancel the subscription.

Route: /educator/slt-report → generate button → PDF download
Build: server-rendered PDF (use Puppeteer or a React-to-PDF library). Data pulled from module_progress + ddl_progress tables.

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

## DIGITAL DRIVER'S LICENCE (DDL)

The DDL is the student-facing certification system. Children earn credentials as they progress through the GDC curriculum. Schools get a tangible outcome to report. Parents get proof of progress. Children get something to work toward.

This is the feature that makes schools renew without being asked.

### Levels

| Level | Name | Age range | Requirements |
|-------|------|-----------|-------------|
| Bronze | Digital Starter | Ages 7 to 10 | Complete 4 KS2 modules. Pass Bronze assessment. |
| Silver | Digital Explorer | Ages 10 to 13 | Hold Bronze. Complete 4 KS3 modules including online safety + AI intro. Pass Silver assessment. |
| Gold | Digital Navigator | Ages 13 to 16 | Hold Silver. Complete 4 KS3/4 modules including deepfakes + AI literacy + wellbeing. Pass Gold assessment. |
| Platinum | Digital Ready | Ages 16 to 18 | Hold Gold. Complete 2 KS5 modules. Produce a Digital Portfolio (one original piece: article, video, or presentation). Pass Platinum panel. |

### What each level unlocks
- Bronze: printable certificate + digital badge (PNG/SVG to use in portfolios)
- Silver: as above + shareable achievement card (designed for parents to post — organic reach)
- Gold: as above + UCAS-ready wording for personal statements
- Platinum: as above + LinkedIn-ready credential + reference letter template from school

### Skills assessed across all levels
Online safety · Privacy · Critical thinking · Spotting misinformation · AI awareness · Digital wellbeing · Healthy technology habits · Content evaluation · Creating responsibly online

Each skill maps to a specific module. No module = no skill credit. Completion is tracked automatically via module_progress.

### Assessments
- Bronze and Silver: 20-question adaptive quiz (auto-marked, 3 attempts allowed, score stored)
- Gold: quiz + one short written response (teacher-marked, rubric provided)
- Platinum: panel review (teacher + one external — DSL or head of year)

Assessments live in the database (type: ddl_assessment). Never hardcoded.

### Dashboard views
- Student: /student/licence — current level, skills earned, next steps, certificate download
- Educator: /educator/dashboard includes DDL progress panel (% of year group at each level)
- SLT report: DDL progress included automatically

### Database additions
```sql
ddl_progress (id, student_id, school_id, level, status, assessed_at, assessed_by, score, attempt_count)
ddl_skills (id, student_id, skill_slug, earned_at, module_id)
ddl_certificates (id, student_id, level, issued_at, certificate_url)
```

Note: students are not full platform users. They are linked to a school_id. No personal login required at Bronze/Silver — teacher marks as complete on the class dashboard. Gold and Platinum require student email for certificate delivery.

### Sales pitch (one line per audience)
- To DSL: "Every pupil gets a credential Ofsted can see. You get the report in one click."
- To head: "It maps directly to the Online Safety Act duty and gives you something to put in your governor report."
- To parent: "Your child earns a certificate, like a swimming badge, but for the internet."
- To student: "It goes on your UCAS form."

### Build order
1. Bronze level only at launch — simplest assessment, highest volume
2. Silver once 3 schools are active
3. Gold and Platinum in year 2

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

## PLATFORM DIFFERENTIATION (core intellectual position)

Treating TikTok and YouTube as the same instrument is not targeted policy. It is blunt policy. The evidence does not support treating them as equivalent and the platform build must reflect this distinction throughout.

### Why it matters
TikTok: algorithmic feed, no user intent, engineered for compulsive consumption, short-form dopamine loop, no parental pathway to educational use.
YouTube: can be search-driven, educational, purposeful, has supervised accounts and parental controls. The same child can use YouTube to learn to code, play an instrument, or understand history.

A blanket ban that treats these identically removes real value from children's lives while failing to address the actual mechanics causing harm. The children who lose most are those who rely on online learning, connection and community — often the most vulnerable.

### The cliff edge and vulnerability
The children most at risk from the current ban approach are those at the cliff edge: the ones who most need a thoughtful, graduated pathway are the ones a blunt instrument hits hardest. Vulnerable young people who rely on online community do not stop using platforms because of a law. They find a way around it, now without any adult knowing they are there.

### How this shapes the platform build

**Scripts (already in database — add platform column)**
- Each script should be platform-aware: the TikTok conversation is different from the YouTube conversation, which is different from the gaming conversation
- Add a `platform` column to the scripts table (tiktok / youtube / instagram / gaming / general)
- DiGi should surface platform-specific scripts based on the child's stage and the parent's question
- 🔲 Platform-specific script variants for all 17 scripts where relevant

**DiGi platform intelligence**
- DiGi must answer "is YouTube okay for my 9-year-old" differently from "is TikTok okay for my 9-year-old" because the evidence supports different answers
- DiGi should know the difference between passive algorithmic consumption and active search-driven use
- 🔲 Add platform context to DiGi system prompt (docs/digi/01-philosophy.md to be updated)

**Digital Driver's Licence — platform literacy component**
- Students must demonstrate they understand how different platforms work and why the mechanics differ
- Bronze: can name the difference between a search-driven platform and an algorithm-driven feed
- Silver: can explain what an engagement loop is and identify it on a platform they use
- Gold: can evaluate a platform they use against a set of evidence-based criteria
- 🔲 Add platform literacy as a named skill strand in the DDL framework

**School scheme of work — platform-specific modules**
- At least two modules should address platform mechanics explicitly: one for KS2 (gaming/YouTube), one for KS3/4 (TikTok/Instagram/algorithmic feeds)
- No module should treat "the internet" or "social media" as a single category
- 🔲 Flag existing modules for platform-specificity in content review

**Positioning and copy**
- This distinction should be explicit on the /schools and /evidence pages
- The evidence paper already covers this platform by platform — surface it more prominently in marketing
- Key line: "The evidence does not treat all platforms equally. Neither do we."

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
