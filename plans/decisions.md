# Decisions Log — Guided Childhood Platform

Append-only. Read at session start. Updated at session end.

---

## 2026-06-13 — Week 1 kickoff

**Project structure:** Next.js 16 (App Router), TypeScript, Tailwind 4, React 19. Built in gc-platform/ directory, pushed to guided-childhood repo on branch platform-week-1.

**DIGI_MODEL:** Config value via env var `DIGI_MODEL`. Default: claude-fable-5. Fallback chain: claude-fable-5 → claude-opus-4-8 → claude-sonnet-4-6. Never hardcoded. Never blocks launch.

**social_media_law flag:** Implemented in lib/config/social-media-law.ts. Three values: none / partial_ban / full_ban_u16. Drives Stage 4 content, DiGi injection, and script filtering. Scripts stored in database, not hardcoded.

**Fonts:** Hanken Grotesk + IBM Plex Mono (Google Fonts). docs/05 shows Fraunces + DM Sans for the static site — platform uses the README tokens (Hanken + IBM Plex Mono). README is canonical for the platform.

**Colour tokens:** Using README.md token set (cream/green/coral/gold/lav). Not the docs/05 token set (which targets the static index.html update, not the platform).

**Auth:** Supabase email + password. @supabase/ssr for server components. Middleware protects /dashboard/* and /educator/* and /admin/*.

**Starter check:** The 3 onboarding questions ARE the platform onboarding. Answers stored in localStorage first, written to profiles.onboarding_answers on signup. Parents never repeat questions.

**/join LP:** Every CTA goes to /starter-pack. Structure from docs/09: hero+quiz CTA > guarantee > stage cards with parent quotes > TRUST loop > Justin story > expert bench > features > outcome narrative > testimonials > pricing > FAQ > final CTA.

**Founder 50:** Enforced in code. /api/stripe/checkout counts active founder subscriptions. At 50, founder price hidden, standard shown. is_founder flag locks rate for life.

**Community:** Lean v1 at launch — one room (Founders Room), Justin posts 3x weekly, report button on every post. No topic rooms until 200 members.

**PWA:** manifest.json + service worker. Install banner on mobile. Full-screen mode. Bottom tab bar for in-app navigation (Home · DiGi · Scripts · Tracker · More).

**Scripts in DB:** All 17 scripts seeded into scripts table. law_flag column enables ban-adaptive script filtering. App never hardcodes script content.

**No dashes in copy:** enforced. Use em dash alternatives or restructure. No hyphens in UI text.

---

## 2026-06-22 — Social media ban world update

**Policy change confirmed:** On 15 June 2026 the UK government confirmed a full access ban for under-16s on named social media platforms (Instagram, YouTube, TikTok, Snapchat, Facebook, X), using the Australian model. Messaging (WhatsApp, Signal) is out of scope. Gaming keeps apps but loses high-risk features. Regulations due end 2026. Ban live Spring 2027. Final platform list not yet fixed.

**Dead line retired:** "Government prefers staged choices over blanket rules" / "NOT a blanket ban" framing is now false. Removed from diego_memory.json. Do not use in any new content.

**social_media_law flag:** `.env.local.template` updated to `partial_ban` (current state: ban confirmed, not yet in force). Switch to `full_ban_u16` Spring 2027.

**BANNED_PLATFORMS config:** Extracted as env-var-driven array in `lib/config/social-media-law.ts`. Edit there when Regulations finalise the UK list. Never hardcoded.

**DiGi wiring:** `app/api/digi/route.ts` now imports and injects `banContextForDigi` into the system prompt. Hard guards added: never route under-16s to banned platforms, never imply circumvention.

**Stage 4 ban-world variant:** `lib/content/stages.ts` Stage 4 (Shaper, 13-15) has `banWorld` block. Renders when flag is `partial_ban` or `full_ban_u16`. Reframes from "navigate Instagram" to messaging, gaming, watching, workaround trap, age-verification friction.

**Content engine SKILL.md:** Created at `/mnt/skills/user/gdc-content-engine/SKILL.md`. Includes ban-world section. Drives all post and comment writing going forward.

---

## 2026-06-27 — Week 4 platform + schools architecture

**Platform structure settled:** Next.js app lives at root of guided-childhood repo on branch `claude/agent-management-guided-childhood-lDYLl`. Marketing site stays on main. Two separate Vercel projects. Never move Next.js into a subdirectory again.

**Sort_order as script URL param:** Script reader uses sort_order (/dashboard/scripts/1301) not UUID. Human-readable, stable, enables prev/next navigation.

**Stage-based scripts page:** Scripts list switched from category grid to stage-grouped list. 84 of 131 scripts have no category. Stage-based works for all. Category tiles removed from main nav.

**Script library count:** 131 scripts when all seed files are loaded (17 original + 84 expansion + 15 daily moments batch 1 + 15 daily moments batch 2). Marketing says 100+ which is accurate.

**Pathway tab replaces Upgrade in bottom nav:** 5 tabs max on mobile. Pathway (swipeable stage cards) is a core product feature. Upgrade is accessible from home and scripts paywall.

**Daily moments scripts are a separate script type:** Sort orders 1301+. Situational micro-scripts (what to say RIGHT NOW when child walks in the door). Different from stage-based scripts but stored in the same scripts table. Category = daily-moments.

**Schools product is a separate Stripe product, same Supabase project:** school_accounts and school_educators tables to be created. RLS separates school and parent data. School DiGi has no access to parent or child data. GDPR critical.

**Parent-school link is loose curriculum alignment, not data integration:** Parents see what schools cover at their child's Key Stage as static content (not live school data). This is a value-add nudge, not a formal integration.

**Free assembly pack is the school entry point:** Email capture for 20-minute assembly download. No commitment. School licence only if they want one. This is the top of the school funnel.

**School DiGi is safeguarding-trained, not parenting-trained:** Different system prompt. Handles disclosure response, statutory queries, class prep. Same DIGI_MODEL env var. No parent persona data injected.

**Master build plan location:** /plans/master-build-plan.md. Read at start of every session. Fable reviews it against decisions.md. Updated as things are built.

---

## 2026-07-01 — Week 8: platform polish, Duolingo clarity, Good Inside cards, Device Hub

**Font swap:** Hanken Grotesk replaced with Nunito (display + body) sitewide. Justin wanted Duolingo-level clarity. IBM Plex Mono unchanged for labels/eyebrows. Heading letter-spacing loosened from -0.03em to -0.01em since Nunito's rounder letterforms read cramped at tight tracking.

**No black backgrounds anywhere:** New `--deep-teal` token (#173C46) replaces every use of var(--ink)/#1A1A2E as a section or card background (footer, CTA cards, founder rate cards). Text colours untouched, deep-teal has near-identical lightness to the old navy so contrast holds.

**Card deck mechanics match Good Inside:** DeckViewer (scripts) and DailyDeckViewer (daily check-in) both use a curved-bottom colored header, tinted body (var(--terracotta-lt)), bold display-weight body text, and a real flick-away exit animation (near-full-width translate + 12 degree rotation, not a small fade).

**Digital Health Check now points externally:** All 8 in-app links go to https://wellbeing.guidedchildhood.com/ (the real paid Digital Health Report product), not the internal 6-question quiz. That page still exists but is unlinked.

**Lessons hub built but not linked:** New `lessons` table and /dashboard/lessons pages exist as scaffolding for when the slide-based teaching module format (matching the schools build) is ready. Not in nav, not on dashboard home. AI module stays the linked destination for now.

**Device Safety Hub:** New /dashboard/devices, 18 device guides seeded from the real content at tools.guidedchildhood.com (migration 014). Each device has an "Ask DiGi to walk me through it" link that passes a device query param to /dashboard/digi, which fetches that device_guides row and injects it into DiGi's system prompt.

**Two real bugs found and fixed in existing "half-built" features, both worth remembering for future audits:**
1. Daily moments personalization: the "what came up today" tagger saved data and even threaded a yesterdayMoments prop down to the client, but the card selection logic never used it, pure date rotation regardless of what was flagged. Fixed with keyword matching against the daily-moments script pool.
2. DiGi's wellbeing tracker context: /api/digi/route.ts queried a table called tracker_entries that does not exist anywhere in the migrations. Silently always empty. The real table is wellbeing_checks. Fixed the query and field mapping.

**Script feedback loop:** New `worked` column on script_completions ('yes'/'somewhat'/'no'), captured via a prompt on the deck completion screen, fed into DiGi's system prompt so it does not re-suggest a script that already failed and leans on what has actually worked for that family.

**DIGI_MODEL fallback chain fixed:** lib/config/digi.ts had a stale, invalid model id (claude-sonnet-4-6) in the fallback chain. Corrected to claude-sonnet-5. Chain is claude-fable-5 (default) then claude-opus-4-8 then claude-sonnet-5.

**PWA is already fully built:** manifest.json, sw.js, and PwaRegister.tsx are all live and wired into the root layout. Real Web Push via VAPID keys in PushPrompt.tsx. "No native app" concern is an instructions/onboarding gap (tell parents to Add to Home Screen), not a missing dev feature. Native OS home-screen widgets (like Duolingo's streak widget) are NOT achievable via PWA on iOS, that would require a native wrapper (e.g. Capacitor) if ever prioritised.

---

## 2026-07-01 — Kids research skill (STORM pipeline)

**New skill:** `.claude/skills/kids-research/` — a STORM style multi perspective researcher for kids mental health and digital devices. Six lens agents run in parallel (Clinician, Academic, Skeptic, Economist, Historian, and The Child as the built in sixth lens fixing the adult chair blind spot), then contradiction mapping, synthesis into a self contained HTML briefing, then adversarial verification of every citation (confirmed / corrected / demoted) before delivery.

**Report template:** `report-template.html` in the skill folder uses the canonical build README token set (cream/green/coral/gold/lav) with Hanken Grotesk + IBM Plex Mono. No dashes in report copy. Every briefing ends with a "What This Means for Guided Childhood" section mapping findings to stages, DiGi, scripts, schools, marketing, and ban readiness.

**Output location:** verified V2 briefings save to `briefings/<date>-<slug>-v2.html` in the repo root.

---

## 2026-07-02 — Content engine skill and first three briefings

**New skill:** `.claude/skills/content-engine/` — a content council (Copywriter, Voice Keeper, Scientist, Reader, Strategist) that turns briefings into ready to paste LinkedIn posts and Substack issues in Justin's voice. Output goes to `content/packs/<date>-<slug>/`. Chains with kids-research: briefing first, content second. Voice calibrated on content/ban-series posts.

**First three STORM briefings written to /briefings (V1, verification queued behind session usage limit):**
1. Animated LinkedIn videos: verdict is do not animate top posts; keep text, add founder face video and PDF carousels, save animation for the product.
2. LinkedIn subjects for parents and schools: LinkedIn is the school leader channel with parents as spillover; two lanes from the personal profile; pre write ban milestone posts; scripts as forwardable carousels; 40/40/20 mix.
3. School lesson module format: editable slides plus scripted teacher notes plus starter and exit quiz plus worksheet, full hour and 15 minute variants, scripted discussion not scripted lecture, sell the evidence trail not the lessons, £300 to £800 whole school licence, DiGi Squad characters as the distancing technique.

**Queued when usage limit resets (3:20am UTC):** verification passes for all three briefings (V2), then kids-research on the science and history of recommendation algorithms and kids mental health, then content-engine pack including the scientific LinkedIn post.

---

## 2026-07-03 — Phase 1 and 2 of the finish roadmap built

**Invented social proof removed:** The homepage "Join 200 families" badge, the "200 parents already on their pathway" line and the fake five star row are gone, replaced with claims that are true today (free starter pack, no card needed, built on the research). Roadmap rule stands: no number in marketing copy that does not come from real data.

**Annual is the default plan everywhere:** Upgrade page order is founder, annual (highlighted, gold CTA), monthly (quiet downgrade with "Prefer monthly?" framing). Homepage pricing grid gives annual the emphasised centre card, and the invented "Most popular" label on monthly is retired. /api/stripe/checkout falls back to annual when no tier is passed.

**Onboarding ends in the recommended script:** The first-task screen existed but was dead code, nothing navigated to it, so DiGi's generated first task was written and never shown. Now: founding screen leads to first task, whose CTA opens /dashboard/scripts/recommended, a server redirect that picks the best next script from stage plus signup challenge. Two real bugs fixed on the way: CHALLENGE_TO_CATEGORY used category names that do not exist in the seeds, and only covered the old quiz challenge ids, never the ones onboarding actually saves. Challenge personalization had silently never matched for onboarded parents.

**Family agreements builder shipped (migration 021):** One living agreement per account at /dashboard/agreement. Five sections (values, bedroom rule time and place, social media readiness terms, the when things go wrong promise, house extras), stage calibrated starting points that the family edits together, parent and child sign, review date defaults a term out, version counts re agreements. /dashboard/agreement/print is the fridge copy. Stage 4 social media default switches to ban aware wording when social_media_law is set. Paid feature: free users get the locked preview. NOTE: numbered 021 because main took 018 to 020 while this branch was in flight.

**Email system shipped (migration 022):** Resend, five lifecycle emails in Justin's voice: welcome with first script (fires from /api/onboarding/digi at onboarding completion), day 2 stage guide, day 4 DiGi nudge, day 7 founder rate with the live counter (skipped for subscribers and when founder is sold out), Monday digest with the week's script count. Daily cron at /api/email/cron (8am UTC, vercel.json), CRON_SECRET bearer auth like push. email_log unique (user_id, email_key) makes every send idempotent. One click unsubscribe via HMAC link flips profiles.email_opt_out. Missing RESEND_API_KEY degrades to no op, never blocks. Needs in Vercel: RESEND_API_KEY, EMAIL_FROM, CRON_SECRET, plus domain verification at Resend.

**Migration numbering rule after the collision:** main took 018 to 020 (curriculum matrix, digi brain, school link) while two branches each created their own 018. This branch renumbered to 021 and 022. The lesson branch's 018_schools_product.sql still needs renumbering to 023 or later before it merges. Rule going forward: check origin/main's migration list at session start, take the next free number, never reuse.

**decisions.md conflict resolution:** The lesson branch and main both appended different sections at the same spot (the branch diverged before the kids research and content engine entries landed on main). Resolution keeps all three sections in date order, nothing dropped. This log is append only precisely so conflicts always resolve by keeping both sides.

**Production database was ten migrations behind (found 3 Jul):** The live Supabase project (the one with real users and the scripts/profiles/children tables) only ever had migrations 001, 003 and 007 applied. Everything from 002 and 008 onwards, including the full script library seeds, device guides, lessons, push subscriptions and the new agreements and email tables, was never run against production. A second Supabase project also named GuidedChildhood is completely empty (no tables, no users) and is being renamed OLD and retired. Catch up package lives in supabase/catchup/: 01 applies all missing migrations in order, 02 loads the content seeds behind a guard that aborts if scripts are already loaded plus adds a unique index on scripts.sort_order, 03 verifies row counts. The new_scripts_batch1 and 2 seed files are a superseded earlier generation of the library (they collide with the expansion set's sort orders) and are deliberately excluded.

**Production database caught up (3 Jul, confirmed):** Justin ran the full 17 step catch up against the live project and all steps passed, verify shows 160 scripts, 100 lessons, 57 moment cards, 54 AI lessons, 19 device guides. Production schema now matches the repo through migration 022. Two Supabase editor gotchas learned and fixed at source: semicolons inside seed copy strings break the dashboard's statement splitting (psql is fine with them), and insert select from values gets mangled where plain single row inserts do not. Future seed and migration files: plain inserts, no semicolons in copy text.

**Homepage motion was scaffolded but dead, now wired (3 Jul):** 92 elements on the homepage carried the fade up class fu and nothing animated them. New HomeReveals component drives them all with GSAP: hero sequences in on load, every other section fades up on scroll in 90ms staggered batches, prefers-reduced-motion turns it off, and content stays visible without JavaScript because hiding only happens client side. Polish primitives added to globals.css: .lift card hover (4px rise, warm deepened shadow), butter selection colour, text-wrap balance on headings. Stage cards and the what-you-get grid use .lift. Verified with headless Chromium on desktop 1440 and mobile 390: zero elements stuck invisible after full scroll, no real console errors. Justin's brief for the wider marketing look: keep the copy, raise the craft to goodinside.com and Apple level. This is pass one; the full teardown pass follows.

**Hero redesigned to the Good Inside pattern (3 Jul, Justin brief):** Justin judged the old hero basic and AI looking next to goodinside.com and apple.com: giant 900 weight three line headline with two lines of yellow text, loud butter pill eyebrow, floating chips, credential boxes. New rules learned and applied: yellow is a shape, never text (the big butter circle bleeding off the page edge, exactly GI's gesture). Headlines are all ink, weight 800, calmer scale (2.9rem max, was 3.9), natural wrap. Eyebrows are quiet muted mono text, not pills. Floating chips deleted. Credentials are one muted mono line, not four boxes. The two shouting section h2s (clamp 3rem, 900, tight tracking) calmed to 800 at 2.5rem. Dashboard mock card kept, deeper soft shadow, floats over the circle.

**Hero circle replaced with a blended wash, yellow softened (3 Jul, Justin):** The big butter circle is out. The hero background is now a soft radial blend, warm butter at the top right washing into cream, no hard shapes. Brand yellow eased one step toward pastel: --terracotta #E9B949 to #EDC35F, --terracotta-dark #C29018 to #C99A28, everywhere via the tokens. Verified both viewports headless.

**Hero now leads with the cliff edge (3 Jul, Justin):** New headline: "Social media arrives at 16. Ready is built from age 4." The ban creates the cliff edge, the pathway is the preparation, and the sub carries the rest of the positioning: the ban delays the apps but does not prepare your child, school level digital literacy taught at home, exact scripts for the everyday screen struggles, DiGi at 11pm. Same framing pushed into the meta description and social share titles. This is the positioning line to reuse across marketing alongside "arriving with habits beats arriving with rules".

**Hero mirrors the Good Inside formula for our niche (3 Jul, Justin):** Eyebrow "From age 4 through 16", headline "Raising kids with screens gets a lot clearer from here.", sub is the GI category claim adapted: the only parenting platform built on one consistent, science backed approach, not random tips, every device and every app, what to teach, what to say in the moment, how to put things right, how to keep your child safe. Justin's draft said "Parenting digital literacy gets clearer", adjusted to natural parent language. The cliff edge line ("Social media arrives at 16. Ready is built from age 4.") stays in the meta description and social share cards, and the announcement bar keeps the ban urgency: bar sells the deadline, hero sells the relief.

---

## 2026-07-03 — Two sessions built Phase 2 twice: the collision and the sync rules

**What happened:** Two sessions were both told to continue the build, both read the same roadmap, and both executed the same Phase 2 boxes in parallel. PR 55 (this session's sibling on claude/continue-build-ldot8v) merged first with the agreements builder, the email system, the honest numbers fix and the service key fix. PR 56 (claude/continue-build-zbcqbi) had independently built the same features with different migration files (a second 021, email_sends versus email_log) and was closed as superseded rather than merged. In-flight work is invisible until it merges, and neither session checked open PRs before claiming.

**Salvage from the closed PR, rebuilt on top of main:** two small deltas PR 55 did not cover. First, getRecommendedScript now takes a preferFree option and /dashboard/scripts/recommended uses it for unpaid accounts, so the activation redirect can never land a free parent (or a fresh payer whose webhook has not fired) on a paid script and bounce them into the upgrade wall. Second, the onboarding checkout forms carry from=onboarding and the Stripe success URL sends those payers to /dashboard/scripts/recommended, so the paid exit gets the same activation moment as the free exit.

**Sync rules now in CLAUDE.md (MULTI-SESSION SYNC):** check open PRs and recent branches before claiming any roadmap box; claim by opening the draft PR immediately with the boxes in the title; migration numbers are claimed the same way; one lane per concurrent session and never the same open ended prompt in two sessions at once; merge or close the same day. The draft PR is the lock, because GitHub is the only state every session can see.

---

## 2026-07-02 — Algorithm literacy Unit 3.5 written up in full

**Unit 3.5 (Audit your own feed) is now a full lesson plan:** Lesson 8 in part-09-curriculum/lesson-plans.md, the KS3 capstone. It was the only unit the parent workshops already promised a mirror of but which existed only as a footnote pointing at Worksheet D. The KS4 kinder-feed lesson renumbered from 8 to 9.

**In-class audits run on invented personas, never real feeds:** the new Mystery Feed game (game 6 in games-and-experiments.md) packs twelve feed cards, a goal card, and a sealed history card per persona. Students deduce the signals, sort serving vs holding, and prescribe the three reset actions. A pupil's own audit lives only on the private take-home page of the new Worksheet G, never collected, never assessed. This is the safe pattern under the under-16 ban world: never assume access, never imply circumvention.

**Reset action wording is now locked across home and school:** clear the bad signals, search and finish good content, follow variety. Exactly as the parent workshops phrase it and as the Year 9 outcomes ladder tests it. Do not paraphrase these three in future content.

**Positive capability layer added across the part 9 curriculum (Justin request):** four additions, all platform-neutral and invented-example only. (1) Co-viewing is now a taught technique with five locked rules: they hold the device, your feed first, curious questions, amnesty, short and regular. Lives in Workshop 2 slide 4 and the Worksheet G home page. (2) Success stories are a stance: new fourth rule in the part 9 README ("Capability, not just defence"), one Mystery Feed pack is always a success persona, Worksheet G Q6 asks for the upside. (3) Future AI skills framing: new README section "From steering feeds to steering AI" plus a closing beat in Lesson 8, the transfer from steering feeds to briefing AI assistants and agents, named out loud every lesson. (4) AI entrepreneurs framing kept generic: young builders who trained a feed into a tutor then built with AI tools, named as possible, never promised as easy, no real names ever (neutrality rule, dating risk).

**Social media included via the arrival at 16 framing (Justin clarification):** the curriculum stays ban-compliant (never assume access, never imply circumvention) but now names social media explicitly as the destination: access begins at 16 under current UK policy, a fresh account learns fastest, so the first week decides what the feed becomes. Lives in a new README section (Social media, and the arrival at 16), the Lesson 8 closing beat (near horizon social media, far horizon AI), a new-arrival Mystery Feed persona (eight cards, five week-one signals), the Worksheet G private page, and Workshop 2 take-home 5 (plan the arrival, co-viewed week-one audit). The line to reuse: arriving with habits beats arriving with rules.

---

## 2026-07-03 — Schools product: spec v2, Phase 1 and Phase 2 (lesson branch)

**DiGi is the star shape, everywhere, including DiGi Junior (Justin, 3 Jul 2026):** the robot and owl designs are legacy and must never be rendered again for DiGi or DiGi Junior. The schools pause beat was re-rendered as the golden star (job bc3337b7) and the robot take (8be302c2) marked superseded in digi-squad/README.md.

**Schools Phase 2 teacher workspace core built (3 Jul 2026):** /educator home (school setup, classes with class codes, scheme list), class page with one tap teach-and-register (delivery recorded, all pupils default met), marking screen with three state one tap judgements. Migration 019 adds onboarding policies. Pupil names trimmed to first name plus initial server side.

**Schools Phase 1 built (3 Jul 2026):** LANDSCAPE_CONFIG live at lib/config/landscape.ts (re-exports the consumer social_media_law flag, adds video_models keys). Migration 018 creates the full schools schema (school_accounts through generated_reports, RLS per school, class codes not pupil accounts) and seeds the reference lesson (KS3 module 12) with 16 slides reusing the migration 017 player contract. Four video beats rendered on kling3_0 secondary classroom staging (Zara x3 + first DiGi Junior pause library clip), job IDs logged in digi-squad/README.md. Educator preview at /educator/preview using the existing LessonPlayer with new school_lesson completion source. Gate: JP approves the reference lesson before the 21 module build. DevTools mobile/desktop check pending first deploy with schools migration applied.

**Schools build spec v2 merged (Justin request):** JP's SCHOOLS_LESSON_BUILD_SPEC.md merged with the platform's existing assets and four research streams into /plans/schools-lesson-build-spec.md, the single source of truth for the schools product. Key decisions locked in it: video is 8 to 15 second character beats threaded through lessons (15s is the hard single-generation ceiling; Seedance 2.0 for identity beats, Kling 3.0 for dialogue, cloned voice per character created once, post-sync over native dialogue for series consistency, Kling Avatar 2.0 for long-form assembly/CPD talking segments; never build on Sora, API dies Sep 2026). Class codes not pupil accounts (first name + initial only, no MIS in v1, market-confirmed norm). Signpost CPOMS/MyConcern, never integrate. "Inspection-ready/governor-ready" copy, never literal "Ofsted prep" (deep dives abolished Nov 2025). Published pricing as differentiator (primary £595 to £795, secondary £995 to £1,295 working anchors vs Jigsaw). Reference lesson KS3 module 12 fully scripted in the spec; JP approves it before the full build. Character casting: squad kids primary, animal guides + DiGi secondary, DiGi only for sensitive modules. Confirmed market gap: nobody free has characters/ritual/parents, nobody paid has serious AI literacy, character video at secondary exists nowhere.

---

## 2026-07-03 — Lesson branch merged with main, schools migrations renumbered

**Migration collision resolved per the main rule:** the lesson branch took 018/019 while main took 018 to 022. Schools migrations renumbered: 018_schools_product.sql is now 023_schools_product.sql, 019_schools_onboarding.sql is now 024_schools_onboarding.sql. They run AFTER 022_email_log.sql. Anyone who already ran the old 018/019 files can safely run 023/024, everything is create-if-not-exists. decisions.md conflict resolved by keeping all sections in date order, nothing dropped, per the append only rule.
