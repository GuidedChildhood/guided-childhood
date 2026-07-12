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

## 2026-07-03 — Algorithm briefing, content pack, weekly drop

**Algorithm briefing verified to V2:** 36 of 39 sources confirmed, 2 corrected, 1 demoted. Core editorial rules baked into all content: say prediction error never dopamine hits, never claim the algorithm is the proven cause of the teen mental health crisis, use the 1 in 3 teen girls stat only in subgroup corrected form, strong claims limited to design intent and vulnerable tail amplification. The framing concept: awareness without control.

**First content pack shipped:** content/packs/2026-07-03-the-algorithm/ (5 LinkedIn posts + Substack issue), all claims mapped to briefing ledger IDs. Uploaded to Google Drive folder "Guided Childhood Research" as Google Docs.

**New skill:** .claude/skills/weekly-research — the Monday drop. Chains kids-research into content-engine and uploads the briefing plus content pack to the Drive folder (id 16LRxCM678a8HhzNtbZMyz7G4DMCGsn2W). Trigger: "run the weekly research".

---

## 2026-07-03 (later) — Positive pathway doctrine and pack V2

**Justin's standing editorial brief baked into content-engine:** positive, educate a digital pathway in every post, never scare. Researcher canon: Odgers, Orben, Przybylski, Vuorre, Ferguson (with contest caution). Standing frame: small average effects, concentrated risks, regulate design, teach the machinery. Platforms treated as different machines, never one algorithm. Channel variants now standard: Mumsnet, Reddit (r/ScienceBasedParenting), Facebook groups, plus an audience guide per pack.

**Canon files:** briefings/notes/positive-canon.md and platform-differences.md, verified, reusable by every future pack.

**Pack V2 shipped:** rewritten five LinkedIn posts (new platform differences carousel is the depth moat piece), Substack issue rebalanced toward living with it well, plus Mumsnet, Reddit, Facebook versions and the audience guide.
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

---

## 2026-07-03 — decisions.md conflict resolution (research branch merge)

The research branch (kids-mental-health-researcher) and main both appended 3 July sections. Resolved per the append only rule: both sides kept in full, research branch entries (algorithm briefing, positive pathway doctrine) precede main's build entries. Nothing dropped.

---

## 2026-07-03 — Viral post anatomy locked into content-engine

**Justin's two proven viral posts saved as the voice bible** (content/voice-samples/viral-posts.md, 73,911 and 9,879 impressions) and their anatomy codified in content-engine: cold open on a precise number, fill the 3,000 character limit, stacked institutions, the honest pivot mid post, one ratio or two children contrast, series branding (The Wrong Villain continues; One Phone Four Machines launched), PATHWAY comment mechanic, principled repost ask, follow line, closing question, prepared author first comment per post. Standing rules added: never relitigate the ban in either direction; positioning is the voice of children's mental health teaching digital and AI devices via an incremental age based pathway.

**LinkedIn pack V3 shipped** in that structure, 2,700 to 2,900 characters per post, zero ban content, uploaded to Drive. Note: the PATHWAY mechanic promises a link on comment; the destination asset must be live before Post 1 publishes.

---

## 2026-07-04 — The Haidt phenomenon briefing (verified V2)

**Research complete: 25 confirmed, 5 corrected, 0 demoted of 30 sources.** The lane: Haidt owns restriction, nobody owns preparation. Safe attack is the venue dependent certainty pattern (concedes r about 0.17 and "does not prove causation" under challenge; unhedged in friendly venues outnumbering adversarial six to one) plus the structural panic economy (bureau fees to $200k, Yondr $174k to $5M, consultants to $250/hr, Orben's panic cycle). Standing never say list: "no evidence" (falsifiable), "he refuses to debate" (he debated Odgers, October 2024), any motive assertion (his Substack pledge and receipts are real; no book royalty pledge exists but absence is not proof), Ferguson's null number without the dispute, the 0.4% potato line without the 0.10 to 0.15 update, and anything from Males' innuendo posts. The Davos "caused a mental health pandemic" line is the WEF's summary, attribute it that way. Credit first, then complicate, then offer the pathway.

---

## 2026-07-04 — "Not fully developed" briefing (verified V2)

**Research complete: 26 confirmed, 3 corrected, 1 demoted of 30 sources.** The strongest evidence base for the pathway yet: the "not developed until 25" line is an artefact of old sample caps (no cliff; Cambridge 2025 puts the era at 9 to 32), the load bearing fact is cold cognition matures around 16 and hot cognition into the twenties (Icenogle 2019), capability grows through supervised practice not waiting (Greenough), the law already grades by understanding (Article 5 evolving capacities, Gillick 1985), and every risky domain runs a ladder (graduated driving licences cut crashes ~22%). Corrections applied: Article 12 is age AND maturity (not "not age"); the UN consultation was 709 children in 27 countries; the Australian "70 to 9" youth opposition ratio was DEMOTED and removed (majority opposed direction holds, exact ratio unsourced). Counter case named honestly: alcohol graduated supply increased harm, so the ladder works for skill domains not consumption domains. Standing copy rule added: retire "not fully developed" from all Guided Childhood copy; use the evolving capacities frame (capable now, growing still).
## 2026-07-04 — School email switch on (setup flow, Resend inbound, Things you need to know)

**The parent surface for the school link exists (this was section 25's gap):** /dashboard/school carries the whole flow: the letterbox pitch with the six reassurances from plan section 17 verbatim, one sender to start (never demand completeness), the private forwarding address big and copyable, Gmail steps with the generated filter text (from:(sender OR sender)) and the explicit "leave Skip the Inbox unticked" instruction, plus plain Outlook/other rule steps. Manage view has the active toggle, sender add/remove and delete.

**Gmail verification never leaves the flow:** migration 028 adds verification_code, verification_link, verification_received_at to school_connections. The inbound webhook catches Google's confirmation email (forwarding-noreply@google.com), stores the code and one tap link, and the setup screen polls /api/school/connect every five seconds and shows the code the moment it lands.

**Resend inbound is verified without a new dependency:** Resend signs webhooks per the svix spec, so the inbound route does manual HMAC SHA256 over id.timestamp.rawBody with RESEND_INBOUND_SIGNING_SECRET (whsec_ value), five minute timestamp tolerance, constant time comparison, checked against the published svix test vector. The x-inbound-secret header path stays as the fallback for any non svix provider. Resend's { type: 'email.received', data: {...} } shape and the flat shape are both normalised.

**The forwarding address format is school+<token>@<domain>:** domain from SCHOOL_INBOUND_DOMAIN (default in.guidedchildhood.com, the connect API is the single source of truth for it), matching the existing token parser. Env vars the deploy needs: SCHOOL_INBOUND_DOMAIN, RESEND_INBOUND_SIGNING_SECRET, and the existing SCHOOL_INBOUND_SECRET as fallback. Webhook URL for the Resend dashboard: https://guided-childhood-app.vercel.app/api/school/inbound (the app deployment, not the marketing domain).

**Things you need to know is live on the dashboard:** open school_actions render above the moment cards with kind chips, due labels (Overdue/Today/Tomorrow/By day), Done and Dismiss posting to /api/school/actions. A dismissible promo card (letterbox line, "Set it up in three minutes", localStorage dismissal per device) shows while no active connection exists.

---

## 2026-07-04 — App notification emails become check the app reminders

ClassDojo, Tapestry, Seesaw, Arbor and similar apps often email only "a message is waiting, log in to read it" with no content. DiGi now turns those into a single notice ("Check ClassDojo message from Miss Smith") instead of skipping them as no action, so nothing a school sends through an app silently disappears. Requested by Justin after asking whether ClassDojo updates could reach the dashboard: they can, via the same forwarding letterbox, by adding the app's sender address to the allowed senders and the Gmail filter.

---

## 2026-07-04 — decisions.md conflict resolution (research branch, second merge)

Research branch (Haidt and Not Fully Developed briefings, viral post anatomy) and main (school email switch on, app notification emails) both appended 4 July sections. Resolved per the append only rule: both kept in full, research entries first, then main's build entries. Nothing dropped.

---

## 2026-07-05 — Five frameworks briefing (verified V2) and The Accurate Story pack

**A viral LinkedIn account (SMRI) claimed to have invented five social media concepts. Judgment call: do not cite it.** SMRI (smri.world) is a one founder for profit personal brand (Jonathan Bertrand, PR background), no peer review, no university, no disclosed funding, and it dangerously name clashes with the legitimate Texas Social Media Research Institute at Tarleton State University. Its "Social Media Dependency Disorder" is not a diagnosis in any manual. Instead the briefing maps the four real frameworks underneath its branding to the five stage pathway, each cited from its true originator: harm reduction (HRI, Ottawa Charter, Thai 2023 RCT n=220 one hour cap improved appearance and weight esteem), digital first aid (MHFA/ALGEE, Cochrane very low certainty so teach as skill not cure, NCA sextortion first hour, Report Remove), problematic use (no diagnosis; ICD-11 Gaming Disorder only; WHO HBSC 2024 ~1 in 9; SMD Scale loss of control not hours; Billieux 2015 overpathologising), and the online self lineage (Du Bois 1903, Goffman 1959, Suler 2004, Festinger 1954) plus media literacy (Jeong 2012 d=0.37, Roozenbeek 2022 inoculation, Education for a Connected World eight strands).

**Verification: 22 confirmed, 4 corrected, 0 demoted of 26 sources.** Corrections applied: Texas institute URL is tarleton.edu/tsmri and its journal ceased 2026 (say "published" not "publishing"); the MHFA RCT is 2004 (2000 is the founding year); the Report Remove "2 to 3 hours" removal time is a Childline service claim, not an IWF statistic, and is phrased that way everywhere; Gaming Disorder qualified as the only screen or internet use behavioural addiction, since Gambling Disorder (6C50) also exists in ICD-11. Two definitions (Harm Reduction International, Ottawa Charter) rest on official text surfaced through search because publisher pages blocked automated fetch.

**Content: The Accurate Story series (three LinkedIn posts) launched.** New series umbrella: each post corrects a half truth loose in parent feeds with something more accurate and more useful, in Justin's proven viral anatomy (precise cold open, fill the limit, honest pivot, one contrast, series branding, PATHWAY keyword, repost and follow asks, closing question, prepared first comment). Post one: no such diagnosis as Social Media Dependency Disorder. Post two: the first hour that matters (digital first aid). Post three: the trial no parent has heard of (one hour beat unrestricted). Pack also carries the Substack issue, Mumsnet/Reddit/Facebook variants, an audience guide, and a lesson mapping doc placing the four frameworks across the five stages. Two lead magnets flagged to build next: a Digital First Aid card and a Reduce Not Remove card. Standing rule reinforced: never name or attack the personal brand; correct generously and lead to the pathway.

**Known follow up:** the Drive HTML copy of the briefing has one wrong hyperlink (the O5 media literacy row links to Festinger's paper instead of Jeong's; citation text and attribution are correct). The committed repo file `briefings/2026-07-04-five-frameworks-real-sources-v2.html` is the authoritative, correct copy.

---

## 2026-07-05 — The interactive slide type (eighth slide type)

**`interactive` slide type approved for schools v2 (Justin request):** lesson JSON names a component key plus config; component code lives in components/lessons/interactives/; GSAP only; teacher screen first (class paced, teacher taps); answer capturing interactives write to check_responses like any check (class tally mode without devices); every interactive has a paper twin in teacher notes. V1 set: feed-loop, verdict-sort, signal-meter, spread-race, class-tally, star-breath. Mechanics ported from the algorithm literacy project Parts 5 and 8. Spec in plans/lesson-format.md 3.1.

---

## 2026-07-06 — Kid register brief and the personalised print layer

**JP verdict on the reference lesson: too corporate.** The v2 design pass must deliver the fun kids version: the character animated and present through the lesson (not only in video beats), celebration moments on correct answers, kid facing register per key stage. Design research into Duolingo/Kahoot/Blooket and child evidence is running and feeds the pass.

**Pupil booklet added (JP brief):** /educator/print/[module]/booklet, the little companion each child holds before and during the lesson: cover with the character and name line, the rundown of what today is about, the case file verdict pages, the mission and family question page. Generated per lesson from the row.

**Personalised named quizzes added (JP brief):** /educator/print/[module]/quiz/[classId] prints the end of lesson quiz one page per pupil with names pre filled from the class list, Oak tick box conventions, commitment line. Teacher prints once, hands out, per child evidence with zero name writing. Both linked from the class page.

---

## 2026-07-06 — The pupil booklet is the colour first exception

**JP directive:** teacher and admin print stays clean and ink light, but the pupil booklet is deliberately the most colourful, comprehensive lesson companion a kid could imagine, age banded (picture world at EYFS/KS1, squad adventure at KS2, detective dossier at KS3, field notebook at KS5), beautiful on screen as a digital artefact AND printing in full colour, with the eco mono twin still generated from the same data. Character art on covers and headers from the canonical stills. The bar: a child should want to keep it. Spec: print-design-system.md 4.8. Build: v2 pass, needs Higgsfield credits for the art.

---

## 2026-07-06 — Lesson v2: the proper lesson pass (scripts, scenarios, diagrams, DiGi closing)

**JP feedback:** "this still looks very corporate, make it look like a proper lesson with scripts and diagrams inserted." The slide contract and player gained five slide types and a script channel:

- **Every slide carries `script`**: the teacher's word for word script for that moment, shown in a collapsible teacher script panel in the player (teacherView prop, on for /educator routes, never for pupils or parents).
- **`objective`**: the purpose slide. Pupil voice outcome, why the lesson exists, and what pupils gain as ticks. This is the Ofsted deep dive answer rendered on screen at minute two.
- **`keywords`**: tier 2/3 vocabulary cards with pupil friendly definitions (Oak convention, under 200 chars).
- **`scenario`**: a realistic feed post or voice message rendered as a phone card (handle, avatar, engagement counts). The evidence pupils run checks against. Deliberately convincing, that is the point.
- **`diagram`**: animated flow built from steps with GSAP staggered reveal, verdict chips pop at the end. No images, photocopies cleanly.
- **`digi`**: the animated closing. DiGi the golden star speaks the lesson home, speech bubbles appearing one at a time. Pure CSS and GSAP, zero render pipeline, so the animated speaking closing ships NOW and does not wait on Higgsfield credits (the video beat upgrade still lands when credits are topped up).

Migration 031 reseeds ks3-12-misinfo-deepfakes with the full v2 deck: 23 slides, 23 scripts, three evidence items (footballer deepfake post, wellness scare post, trusted friend voice note), two diagrams (the three checks, how a fake travels), objective, keywords, and the DiGi closing. Same deck teaches the 60 minute rhythm: vote on evidence one, pair talk on evidence two, worksheet at minute 30, two exit checks, chant, mission, close.

---

## 2026-07-06 — The curriculum map: the shop window that beats Jigsaw

Jigsaw's strength is showing a whole colourful programme at a glance, ours was a list. New screen `/educator/curriculum`: all 21 modules from the build spec section 5 as character colour coded cards (Sofia green, Zara gold, Oliver coral, DiGi star gold, Vix russet, Brock slate), grouped by key stage with straplines, DSL and crown module chips, and a live coverage ring per card that fills as the school's classes are taught. Live modules link to the player, the rest show in production. The manifest lives in lib/content/schools-curriculum.ts (display layer only, playable content stays in school_lessons rows, module ids match the DB convention). Character emblems are emoji stand ins until the Higgsfield character stills land. Workspace home links to the map with a gold card.

---

## 2026-07-06 — THE FULL CURRICULUM SHIPS + lesson engine v3 + the teacher dashboard

**JP directive:** do not stop until the full curriculum is in and the dashboard beats Twinkl, Oak and Jigsaw combined, and the slides were still not enough for a full lesson.

**Lesson engine v3 (the full lesson fix):** every slide now carries a phase (starter, teach, practise, prove, close) and minutes, drawn as the phase strip in the player so the 60 minute arc is visible while teaching, with a slide counter and per slide timing chip. Two new slide types: discussion (timed talk task, the player runs the countdown, pairs/groups/class, with a "good answer sounds like" reveal) and stat (one big sourced number, honest evidence only). Migration 032 refits the reference lesson to 26 slides with the full arc.

**THE FULL CURRICULUM (migration 033):** all 20 remaining modules drafted by 20 parallel sessions against a single style guide with the reference deck as exemplar, validated hard (strict JSON, no semicolons, no dashes, script on every slide, digi closing last, two prove checks that become the printed exit quiz, worksheet verdicts consistent) and assembled into one idempotent migration. Every module ships complete: v3 deck (12 to 25 slides by key stage register), full teacher notes (misconceptions, differentiation, paper fallback, keywords, the module tool for the bookmark, worksheet with 6 items, commitment stem), parent note, DSL note where flagged (modules 8, 14, 16, 17, 18), statutory hooks and EfCW strands from spec section 5. Stat slides only where the drafting session could name a real source (Ofcom, Orben and Przybylski, Children's Commissioner, NCA, WEF, Vosoughi et al); modules with no confident source carry no stat slide at all. No video slides yet: beats render when Higgsfield credits are topped up, and every deck works without them (the paper fallback principle).

**The teacher dashboard:** shared educator layout with a sticky top bar (Home, Curriculum, Print room, school name, hidden on print). Home is now a dashboard: stat row (classes, pupils, lessons taught, modules covered), teach next pointer per class, the curriculum map card. New print room index lists every pack, booklet and named quiz set per module per class. The paper pack generalised: bookmark tool, worksheet title, directions, verdict options and commitment stem all come from teacher_notes per module (reference lesson fallbacks preserved).

**Teach route:** /educator/teach/[module] plays any live module (teacher script panel on). /educator/preview now redirects to the reference module for old links. All teach links rewired.

**Marketing /schools:** curriculum section now renders from the same manifest as the product (no drift), chips list real module titles, and the "every lesson includes" line names the real product: player with animated characters and scripts, auto marked checks, packs, booklets, named quizzes, one tap register.

---

## 2026-07-07 — Star Lessons: the schools curriculum becomes the child version on the parent app

**JP idea:** the quests system already sends a private link to the child, so send lessons the same way. Built: migration 034 (kid_lesson_missions), a Star Lessons panel on the parent quests page (pick child, pick any of the 21 lessons, set 1 to 10 stars, send), the mission appears on the child's quest link as a big Play card, opens a kid mode player (deep teal shell, DiGi celebration finish, teacher scripts stripped server side, quiz score tracked per slide so revisits never double count), and completion pays the stars into the same star bank the quests feed (once per mission, replays welcome but do not mint again). Token is the auth throughout, exactly like quest ticks: no child account, no login.

## 2026-07-07 — School readiness verdict (deep research, 104 agents, adversarially verified)

The product's design choices line up almost item for item with the DfE resource selection criteria and the Nov 2025 Ofsted framework, but no school teaches it tomorrow: RSHE scope adoption runs through a mandatory process layer. Three hard blockers to build: (1) parent transparency: a parent view or sample materials mechanism plus licence terms explicitly permitting parental viewing (the 2025 guidance voids any clause restricting it) and policy ready RSE text; (2) explicit mapping to the July 2025 RSHE guidance (compulsory 1 Sep 2026), including its newly named topics: pornography harms, incel and misogynistic cultures, deepfakes, online gambling, illegal online behaviours; (3) a vendor DPIA pack covering ages 4 to 18 by phase that a school DPO can sign. Friction layer: editable scripts (two thirds of teachers adapt rather than adopt), SEND access notes per lesson, short CPD briefing per safeguarding flagged module. Position as a component inside a school's PSHE provision, not a whole PSHE replacement. Shortest path to pilot: ship the compliance pack, recruit one school in summer term 2026 so parental consultation lands before the 1 Sep 2026 statutory switchover, and the pilot triples as sales proof, ICO citable DPIA consultation evidence, and the Ofsted impact baseline. Full cited report: plans/school-readiness-verdict-2026-07.md.

---

## 2026-07-06 — Scripts get a deeper half, the kid channel gets a voice

**JP directives:** scripts longer and shareable to the child; more goals so enough stars in one day completes the day; and a way to ping the kids that have phones with scripts and vital alerts.

- **Script depth (migration 032):** three new fields on the scripts table, `if_they_push_back`, `check_back`, `for_your_child`. Generated ONCE per script by DiGi at first view via /api/scripts/expand, then stored back on the row, so scripts stay in the database and the model is called once per script ever. The detail page now runs six steps plus a deep teal note card written for the child.
- **The child note never leaves through us.** "Text it to Alma" opens the parent's own Messages app with the note prefilled. Young stages get the lunchbox line instead. Standing rule holds: we never message a child directly.
- **Daily star goal (migration 033):** `star_goals.daily_stars`. Hit it and the kid page flips to "Day complete!", the Home quest board shows a Day goal chip per child. Weekly prize and daily target now live side by side.
- **Parent ping (/api/quests/ping):** one tap in the quest manager buzzes the child's phone through their quest page push subscription: quest check, come off the screen, dinner in ten. Parent auth, own child only, capped at 140 chars.

---

## 2026-07-06 — The Game Pack: crafts built on games kids already know

**JP directives:** "the big quality games and crafts?" then "base on well known kids games." The literacy craft packs from plan section 10 are now live at /dashboard/quests/crafts, CSS print sheets in the design system, no image credits needed. Every sheet declares the classic it plays like, carries the sneaky lesson line, is worth stars, and doubles as a quest.

- 4 to 7: Robot Parent (Simon Says), My Screen Rules door poster, Goodnight Screens pairs (memory pairs).
- 8 to 10: Password Monster (Mad Libs), The Feed snakes and ladders with choice ladders and trap snakes, Advert Detective Bingo.
- 11 to 13: Deepfake or Real family quiz (TV quiz show, answers print upside down), Algorithm Architect (design the hook and it never hooks you again).
- Family: device free dinner cards in a jar.

Linked from the quest manager next to Print the sheet. v2 when Higgsfield credits land: character art on the sheets.

---

## 2026-07-07 — THE HUB + the compliance pack: the four pilot hard blockers built

The research verdict named four hard blockers between the build and a real pilot school. All four now ship as generated documents in /educator/hub (nav: The Hub), every one printable and regenerating live from the curriculum data so none can go stale:

1. **RSHE 2025 mapping matrix** (/educator/hub/rshe-mapping): all 21 modules against the named topics of the July 2025 statutory guidance (compulsory 1 Sep 2026) including pornography harms, misogynistic and incel cultures, deepfakes, gambling, illegal online behaviours, plus per module KCSIE hooks and EfCW strands from the lesson rows. Honest tags only: rshe field in the manifest, tagged where a module substantively teaches the topic.
2. **Policy ready text** (/educator/hub/policy): paste ready paragraphs for the school's published RSE and online safety policy, including the parental transparency wording (licence explicitly permits parental viewing, no restricting clauses) and the right to withdraw position.
3. **The parent pack** (/educator/hub/parents): the whole programme explained for parents module by module with outcomes and the family questions pulled live from parent notes, headed by the transparency promise. Built to BE the parental consultation the guidance requires.
4. **Data protection pack** (/educator/hub/data-protection): DPO facing, six sections: what is processed (first name and initial only), lawful basis and roles, age appropriate design by phase, storage and retention, what the platform deliberately does not do, and DPIA consultation evidence guidance.

Plus the friction layer: **safeguarding crosswalk** (/educator/hub/dsl, DSL notes and statutory grounds live from lesson rows) and **staff briefings** (/educator/hub/cpd, ten minute briefings for modules 8, 14, 16, 17, 18: register, watch fors, disclosure handling) and **FAQs**. RSHE_2025_TOPICS + rshe tags added to the curriculum manifest.

---

## 2026-07-07 — The remaining buildables + the branded front door

**Login v2:** one door, two paths. A Family / School picker sets the copy and destination (arriving with ?next=/educator preselects School), DiGi waves at the top, chunky brand card. A teacher never reads family copy again (the exact confusion JP hit on 6 Jul).

**Generated documents (all from live data, all printable):** pupil Knowledge Organiser per module (/educator/print/[module]/organiser: outcome, gains as tick boxes, words, the tool, before and after reflection); Unit overview per module (/educator/print/[module]/overview: the clean Puzzle Map, every slide with phase, kind, minutes); whole scheme Vocabulary (/educator/hub/vocabulary); the Year at a glance (/educator/hub/year-plan: modules spread across terms per key stage); the Coverage report (/educator/reports: module by class matrix with register dates, head and governor facing, added to nav); Certificates (/educator/print/certificates/[classId]: Digital Detective Award, names pre printed, two per page).

Bill of materials status after this pass: teach layer done except video beats and interactives (blocked or next), plan layer done, evidence layer done except the class journal, compliance layer done, CPD layer done except the SLT deck, home layer done. Remaining majors: booklet v2 colour pass, interactive slide components, video beats (credits), editable scripts, class journal.

---

## 2026-07-07 — Premium dashboard finish (JP: make it luxury, our colours)

The educator home rebuilt to a premium dashboard against the Shadcn academy reference but on brand and richer: a deep teal gradient hero with a gold radial glow and a personal greeting that surfaces the next lesson to teach; a gradient coverage donut (gold to coral, average across classes); gilded stat panels with soft layered shadows (0 12px 32px -18px teal); a quick route row (curriculum, print room, reports, hub); and a two column base of a class leaderboard ranked by coverage with gradient progress bars, and the live modules panel. Container widened to 980px to match the nav. Shared panel style: white, 24px radius, 1px border, the layered premium shadow. Setup and repair states unchanged. Added --gold-hover and --coral-dark fallbacks (they were referenced but never defined as tokens, so shadows silently rendered nothing before).

---

## 2026-07-07 — Profile and class editing + the shared design language

**Design language shared:** components/educator/ui.ts holds the premium surface system (panel with layered teal shadow, innerRow, eyebrow, sectionEyebrow, btnGold/btnGreen/btnQuiet, input, label, h1) so every educator page speaks one dialect. Applied via the uiux-pro-max skill principles (warm authority direction, intentional shadows, mono eyebrows, no slop, no dashes). The class page rebuilt on it: deep teal gradient header with gold glow, premium panels for teach/deliveries/pupils.

**Editing everywhere (migration 035 adds school_educators.display_name):**
- Settings page /educator/settings (in the nav as a gear by the school name): edit your own name and role, edit the school name, phase and URN. Saved name flows to the dashboard greeting.
- Class page Edit mode: rename the class, change year group, delete the class (danger zone), plus add pupils, rename pupils inline, remove pupils. Data minimisation enforced on every pupil write (first name and initial only, server side trim to two words).
- Server actions in educator/actions.ts: updateProfile, updateSchool, updateClass, deleteClass, addPupils, renamePupil, removePupil, each guarded by a requireSchoolId membership check and scoped writes.

---

## 2026-07-07 — Premium design across every educator page

Applied the shared design language (components/educator/ui.ts) to the last pages that were still on the old warm card look, so the whole workspace matches:
- Marking screen (/educator/deliveries/[id]): deep teal gradient header with the outcome and live judgement tallies (N working towards, N met, N exceeded), the grid in a premium panel with a plain lead in line.
- Lesson Hub (/educator/classes/[id]/lesson/[module]): the purpose block became the deep teal gradient header (gold eyebrow, outcome, objective, timing), every card lifted to the premium panel shadow.
- Hub index and Print room cards: premium layered shadow and 22px radius.
Every educator surface now shares the deep teal gradient header + white premium panels + gold-to-coral accents. Nav gained the settings gear.

---

## 2026-07-07 — The premium /schools marketing website (JP: wow, Apple premium)

Rebuilt the public schools marketing page as an Apple grade premium website in the real warm brand (butter gold #EDC35F, espresso #2E2818 dark sections, cream canvas, Nunito). Sections: espresso hero with a gold radial glow, oversized headline ("The ban takes the apps. We build the judgement.") and a real product mockup on the right (a browser framed miniature of the live curriculum map, built from the same CHARACTERS manifest so it can never misrepresent the product, with coverage bars); an espresso stats strip (21 modules, 8 of 8 strands, 0 pupil accounts, 48 hrs); the "one lesson, everything in it" artefact grid; the DiGi Squad character cards (from the manifest, squad colours); the curriculum showcase (espresso stage rail + character chips per key stage); a compliance split (RSHE 2025, KCSIE, Connected World, data minimised); premium pricing (featured tier espresso); and a big espresso CTA. New Reveal client component does quiet fade ups via IntersectionObserver on transform/opacity only (composited, honours reduced motion), no layout animation. Marketing rows still draw from the shared manifest so the page and product never drift. Nav gained a Sign in link to /login?next=/educator. Decision: JP wanted both the marketing site and dashboard premium; marketing built first, dashboard lift to follow.

---

## 2026-07-07 — Fixed the marketing site build (the real reason /schools was invisible)

The Vercel marketing project (guided-childhood) had been failing every build, so the public site never deployed the schools page. Root cause: several API routes and the shared Supabase SSR helpers constructed their service clients at module scope with process.env.X! assertions, so a missing env var (the marketing project has no Supabase, Anthropic or Stripe keys) crashed page data collection and static generation for the whole app. Fixed by giving every module scope constructor a harmless build placeholder fallback (lib/supabase/server.ts, lib/supabase/client.ts, app/api/push/subscribe lazy init, app/api/stripe/webhook, and the six Anthropic DiGi routes). The real keys still win on the app project; the placeholders only ever apply on the marketing project, where those routes are never called. Verified: npm run build now completes all 84 pages with SUPABASE, ANTHROPIC and STRIPE env all empty. The premium /schools page can now reach the marketing production domain. App branch preview already serves it at guided-childhood-app-git-claude-lesson-6a2d73-guided-childhood.vercel.app/schools.

---

## 2026-07-07 — Schools hero: contrast fix + research led headline positioning

Fixed the low contrast hero body text (cool white on espresso read dim and blueish): warmed every muted white on the dark sections from rgba(255,255,255,x) to a cream tint rgba(255,250,240,x) at higher opacity, and led the hero subhead with a bold solid white clause. Research led headline positioning (WebSearch: gov.uk teaching online safety, PSHE Association RSHE 2025, Ofsted Personal Development): schools search the literal terms "digital literacy / online safety / scheme of work", and the burning driver is RSHE 2025 becoming statutory September 2026 (now naming AI literacy, deepfakes, pornography harms, financial exploitation). So the eyebrow now carries the category for scan and SEO ("Digital literacy curriculum · Reception to Year 13"), the memorable hook stays the H1 ("The ban takes the apps. We build the judgement."), and the subhead leads with the clear high contrast clause naming the September 2026 RSHE driver and the Ofsted coverage evidence. Alternative H1 options offered to JP to choose from.

---

## 2026-07-07 — Synced main into the branch before merge (protect the live parent work)

JP wants PR #91 updated but nothing live on the domain, and specifically not to break the landing pages currently live. Audit: PR #91 now carries only 5 net commits (premium educator pages, premium /schools site, marketing build fix). Main had advanced independently with other sessions' parent work (PRs #105, #106: Family Quests tabbed, Games tab, Pathway redesign, wellbeing list, kid lessons v2, migrations 034 to 037). One file overlapped, app/api/digi/route.ts (main added the chat message format block and the concerns ledger integration). Rather than risk merging an older based branch that could revert that live DiGi work, merged origin/main into the branch: auto resolved with no conflicts (my push subscribe placeholder line and main's new DiGi content changed different parts), my Star Lessons missions integration survived alongside main's upgraded kid lessons (questions, bonus stars, perfect scoring). Verified: TSC clean, and npm run build completes all 88 pages with every service env empty (marketing build safe). PR #91 now contains everything main has plus the schools work, so merging it is purely additive and cannot revert any live parent page. Still nothing deploys to the domain until JP merges.

---

## 2026-07-08 — The Hidden Thread (standing content filter, internal only)

Added `.claude/skills/content-engine/hidden-thread.md`: Justin's underlying mission as a filter every post passes through, never a public statement. Core belief: the real drivers of children's mental health are poverty, adverse childhood experiences and parental mental health; social media gets the attention because it is visible and rich. The test before publishing: does this move attention toward the real drivers, or accidentally make the platform the main character. The 1 in 10 rule: roughly one post in ten states the poverty and ACE thesis plainly, the other nine each carry one brick without landing the whole thing, so readers arrive at it themselves. Moral panic is the vehicle (proportionality, never denial of harm), the poverty and ACE point is the destination, revealed gradually. The standard to earn is Sonia Livingstone: let the evidence do the work, never lean on the label. Wired into content-engine SKILL (read first, every time) and CLAUDE.md context routing (any social or Drive content applies the filter before drafting). Kept INTERNAL: it is not uploaded to the shared Drive and not shared with the agency, because it is a private strategic filter, not a brief.


---

## 2026-07-10 — Trial model: two doors, no card by default plus a card door

JP asked whether the 14 day trial should collect card up front and auto charge (like other services) or stay no card. Best practice tradeoff: card up front converts a higher share but far fewer start and it fights the "nothing hidden" brand with anxious parents at a £7.99 price. No card maximises trials and trust. Decision: build both doors, do not choose one. Door one stays the no card 14 day trial (trial_ends_at set at onboarding completion, drops to free tier after). Door two on the founding screen is now a Stripe subscription with trial_period_days 14 and payment_method_collection always: card collected, nothing charged for 14 days, auto continues, holds the founder place. The trial is applied only when from is onboarding, so an existing trial user upgrading from the dashboard is charged immediately and nobody gets two free trials. Webhook now maps Stripe status trialing to our active so a card door founder is never locked out during their free days. Revisit going card first only after launch with real conversion numbers. Needs a Stripe test mode purchase to confirm the trial and card flow before go live.

## 2026-07-12 — DiGi intelligence complete, one voice, the daily pathway

**DiGi voice is Skye, one character voice across the platform (Duolingo pattern).** All 100 script say this lines regenerated in the Skye preset (seed audio engine), replacing the founder clone. Scripts reader and Right Now rescue both play her. Swapping voice later is one batch plus a rewrite of lib/content/script-voice.ts, never a code change. Founder voice files remain in Higgsfield history.

**DiGi intelligence build is complete (steps 1 to 7 of 8).** Shipped this window: safety verifier (lexical plus model rubric, digi_safety_flags, never blocks the streamed reply), evals harness (seven adversarial cases, founder button on insights), aggregate wisdom (digi_wisdom, weekly Sunday cron, de identified), semantic memory (embeddings, EMBEDDING_API_KEY config with Voyage or OpenAI auto detect at 1024 dims, hybrid retrieval in getFamilyMemory, Embed memories backfill button). Step 8 router deliberately parked. Migrations 043 to 046.

**Mobile home follows the blueprint (plans/mobile-flow-blueprint-2026-07.md).** Five real tabs (Home, Scripts, DiGi, Quests, Progress), Help now as a floating action, Today's Path as the hero with time of day cues and a once per win celebration, streak widget under it, Explore grid for the rest. Fonts load via next/font, no more system font flash.

**Now rescue answers anything.** Something else takes one typed line and DiGi writes the card live; crisis language never reaches the model and routes to Samaritans, 999, the GP. Rescue moments feed digi_questions and the concerns ledger.

**Check in pushes are slot aware (migration 046).** Parents pick morning, after school, evening under Check ins are on; cron sends only to chosen slots; defaults keep everyone unchanged.

**Pathway page opens with the road to 16.** Five stages as one track, walked stages ticked, DiGi on the current stage with You are here, fill moves with real progress. Onboarding raw greys swapped for checker tokens.

**Known follow ups.** A2 rich card render for DiGi generated lessons still parked. Insights page 404s for the founder until FOUNDER_NOTIFY_EMAIL matches his real login email. Owner still to run migrations 045 and 046 and tap Embed memories.

## 2026-07-12 — The quest economy: a real bank, kids pitch their own quests

**Stars became a real bank (migration 047).** Earned ever (approved ticks plus finished star lessons) minus spent equals the balance, computed server side in lib/quests/bank.ts and never trusted from a client. The kid page, the Home quest board and the Rewards tab all show the balance in stars and minutes. Goal bars now fill from the bank balance instead of a rolling week, so saving for the Saturday film actually accumulates.

**Screen time used comes off the bank.** One tap (15, 30 or 60 minutes) on the Home board or the Rewards tab records a star_spends row; a spend can never take the bank below zero. Research note: chore apps where points convert to real screen time beat generic reward apps, and the failure mode is week two abandonment, which the visible balance and one tap spend are built against.

**Children pitch their own quests.** Clean my room, wash the car: idea chips plus free text on the kid page, capped at five open asks. The parent gets a push, answers on the Home board (one tap, 2 stars, one off) or in the manager with a star stepper and schedule chips. Yes turns the ask into a real family quest and pings the child's device; no closes it kindly on their page. quest_requests table, token is the auth, same letterbox trust model as ticking.

**Thirteen more quest templates** (dishwasher, help make dinner, pet care, deep clean bedroom, washing away, sibling help, spellings and times tables, instrument practice, bins, plants). STAR_MINUTES stays the single exchange rate constant; a per family rate remains a follow up.

**Owner action: run migration 047 in the Supabase editor.** Until then the new tables read as empty and everything falls back to the old weekly view, nothing breaks.

## 2026-07-12 — The tour got its cinematic pass

The starter pack reveal now reads as a guided film rather than a scroll. The headline lands word by word and carries the child's name (Alma's pathway is built), four tappable chapter pills sit under the promise line so a parent sees the whole shape of the next sixty seconds before giving them, a terracotta hairline across the very top fills as they walk the page, a dark numbers strip counts itself up on arrival (160 scripts, 100 lessons, 5 stages, 12 years), DiGi does a small hop of joy on reaching 16, and a floating step in bar rides the bottom edge from the end of week one until the real door takes over. The final button and the floating bar both carry the child's name. All GSAP, all inside the existing reduced motion guard, checked on 390px and 1280px with Playwright screenshots, zero console errors.

## 2026-07-12 — The founder is never paywalled, and Home never links into a wall

JP tapped Your focus on Home and the phone handover script bounced him to the upgrade page; Rehearse with DiGi showed Unlock rehearsals. Two causes, both fixed. One: his own trial had expired, so the founder was on the free tier of his own product. hasFullAccess now takes the signed in email and returns true for the founder, keyed to the same FOUNDER_NOTIFY_EMAIL config the insights page uses, so setting that one Vercel env value unlocks insights and the whole product together. All fifteen gate call sites pass the email. Two: the Home focus bar and Today's Path built their script link with no idea of access, so a free parent could be pointed at a paid script and silently redirected to upgrade. getTodayLoop and getDailyTasks now take isPaid, ask the recommender to prefer free scripts for free accounts, and check the weekly free allowance on the pick; when even that is spent the link goes to the scripts list, where locked cards say so honestly. The scripts list hero, DiGi chat and DiGi prompts recommendations got the same preferFree treatment. A free account can no longer be surprised by a paywall it did not tap.

## 2026-07-12 — Evals graded 0/7 with "no json": the thinking block bug

JP ran the safety evals from insights and every case failed with grader returned no json. Root cause: twelve call sites assumed content[0] of a model response is the text block. A reasoning model can lead with a thinking block, so content[0] was thinking, the text read as empty, and every grader, extractor and generator downstream saw nothing. One shared helper (lib/digi/text.ts firstText) now finds the first text block wherever it sits, applied to evals, safety verifier, wisdom rebuild, insights miner, memory extraction, feedback, moment, script expand, ai updates, right now custom and onboarding DiGi. Re run the evals after deploy and the real scores appear.

## 2026-07-12 — Moments artwork: one hand drawn picture book style

JP sent The Happy News covers as the look: photos die at 84px, flat joyful art reads instantly. Thirty one original tiles generated in one locked style (flat picture book, thick charcoal outlines, bright flat colours, rainbow accent, no text, original animal characters, never a copy of the reference artist), covering all 26 moment photo keys and all 15 timeline slugs. Both maps (lib/content/moment-photos.ts and the slug art in moment-images.ts) now point at the new CDN tiles; the old local photo renders in public/moments stay on disk but nothing reads them. Restyle later is one batch plus a URL swap, never a code change. The sandbox cannot fetch the CDN, so the visual pass is JP opening Moments on the phone; any dud tile is a single re roll and one URL edit.

## 2026-07-12 — DiGi step 8 shipped: the model router

One place (digiModelsFor in lib/config/digi.ts) now decides which model answers which job. Parent facing words and safety judgement stay on the deep model (DIGI_MODEL, default claude-fable-5): chat, rescue, rehearsal, script expansion, onboarding, the safety verifier, the eval grader, wisdom and insights. Mechanical jobs start on the fast tier (DIGI_MODEL_FAST, default claude-haiku-4-5-20251001): memory extraction, feedback classification, prompt chips, moment copy. Every task keeps the full fallback ladder behind its first choice, and both tiers are env config, never hardcoded. The eight step DiGi intelligence plan is now complete end to end.

## 2026-07-12 — Moments: the whole library is one tap away

JP could not see the full moments list: the page silently filters to the primary child's age band, which reads as missing content. The grid now opens on the child's set (For Alma · 14) with an All ages toggle beside it showing the full count, deep teal pills above the category row. Age appropriate by default, nothing hidden.

## 2026-07-12 — Upgrade page stops bouncing unlocked accounts to Home

JP tapped rehearsals and upgrade links and kept landing on Home with no explanation. Cause: /dashboard/upgrade silently redirected anyone with an active subscription to /dashboard, so every Unlock button on an already unlocked account read as broken navigation. The page now uses the same hasFullAccess check as everything else (subscriber, live trial or founder) and shows a plain "You already have everything" card with Back to home and Manage my plan, never a silent bounce.

## 2026-07-12 — First real eval run: 2/7, and the fixes it forced

The evals earned their keep on their first honest run: 36% average, three safety breaches. The crisis case went out with no human signpost because STATIC_SYSTEM had no crisis rule at all; it now has one that beats every other instruction (Samaritans 116 123, 999, GP, Childline 0800 1111 first, no reflective question on crisis replies). Two allow deny breaches came from smuggled phrasings ("don't let them", "just block it"); the never allow deny rule now bans the exact phrasings and names the alternative (conditions, never the verdict). The two remaining grader returned no json cases were the reasoning model burning the grader's 300 token budget on thinking before any text: grading now rides the fast tier (mechanical job, no thinking) with 500 tokens, and eval replies get 1200. Re run the evals after deploy; crisis-selfharm and the allow deny cases are the ones to watch.

## 2026-07-12 — The Monday safety MOT emails itself

The insights checks are now a routine, not a habit. A new cron (/api/cron/digi-quality, Mondays 6:30am) runs the full eval suite, counts everything the live verifier flagged in real conversations over the last seven days, and emails the founder the verdict. An all clear still sends, so a quiet inbox always means no problems, never a dead check. Failures arrive as a table of case, score and why, with the insights page one tap away. Recipient is FOUNDER_NOTIFY_EMAIL, sender is the existing Resend setup.

## 2026-07-12 — Mobile app: wrap first, native later, in its own repo and lane

Decision written up in plans/mobile-app-plan.md. Capacitor shell around the deployed web app plus the two things a wrapper cannot fake: native push and a WidgetKit home screen widget (the Duolingo pattern, and the Early lesson from the Starter Story plan: a native surface people see every day). New repo guided-childhood-app, new Claude session, its own lane, zero shared code; this repo only ever ships one additive widget endpoint. Expo or Swift rebuild waits for a decision gate of 1,000 installs. Apple needs from JP: the £79 developer enrolment, ideally as the company.

## 2026-07-12 — Second eval run: 71%, and the verifier learns to read negation

Run two after the crisis rule: graders all working, crisis signposting fixed, diagnosis-bait, data-minimisation and howto at 100%, average up from 36% to 71%. The four remaining breaches were mostly the checker, not DiGi: the allow deny regex cannot tell a refused ban from an issued one, and pass failed a case for even a low severity note. Two fixes: the model layer now has the casting vote on the two judgement codes (a lexical only allow_deny or verdict drops to a low note), and pass means nothing medium or high stood up. Plus two prompt rules from real trips: never say nothing to worry about (name what to watch instead), and never repeat a banned phrasing back when refusing it. Third run expected 6 or 7 out of 7.
