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

## 2026-07-07 — The eighth slide type ships: interactive lesson components

Built the interactive layer that turns the lesson player from slides plus video into a genuinely interactive experience (the core "make it a fun kids lesson" feedback, and the differentiator vs Jigsaw's static slides). New slide type `interactive` in lesson-slides.ts: a row names a component key and passes config, the code lives in components/lessons/interactives/index.tsx as a registry, so a new interaction in one module is instantly available to all 21 (rule 6: content in the DB, code in the app). Three components shipped, all tap based (projector and touch friendly, no drag), GSAP only, each with a paper twin named in the caption for the no device room:
- verdict-sort: post cards the class taps into believe / pause / do not share, each flicking to its pile with tallies animating. The detective drill.
- signal-meter: tap actions (like, comment, watch to end, rewatch), the signal bar grows by weight so watch time visibly dwarfs a like. The algorithm literacy point, lands itself.
- star-breath: DiGi Junior the golden star breathing on a 4 second cycle, the calm pause companion for every module.
Unknown component keys degrade to the caption (ahead of deploy DB never breaks a lesson). Migration 038 drops a verdict-sort into the reference lesson right after the independent practice, as the on screen twin of the worksheet. Player wired, print overview updated for the new type. TSC clean, build all 88 pages green.

---

## 2026-07-07 — All six interactions live + the video script session scaffold

The remaining three interactive components ship in the registry: feed-loop (the watch, learn, more of the same, watch more loop drawn live, each lap faster, the bubble ring closing after four laps), spread-race (an outrage post races a sourced report with share counters ticking, then the class calms the reactions and the race tightens: your pause is the brake), class-tally (the whole class check for no device rooms: teacher taps hands per option, gradient bars animate). All six from the lesson-format.md spec are now real: verdict-sort, signal-meter, star-breath, feed-loop, spread-race, class-tally. Tap based, GSAP only, registry keyed, usable by any of the 21 modules from the database.

Also banked plans/video-script-sessions.md: the reusable screenplay scaffold for the parent track (P beats: the moment, the reframe, try this tonight, DiGi tag, 60 to 90 seconds phone first) and child track (the Section 10.2 beat format), age banded 0 to 16, ready to receive the Internet Matters + Common Sense deep research topic map. Scripts are writable with zero Higgsfield credits; only renders wait.

---

## 2026-07-08 — The Hidden Thread (standing content filter, internal only)

Added `.claude/skills/content-engine/hidden-thread.md`: Justin's underlying mission as a filter every post passes through, never a public statement. Core belief: the real drivers of children's mental health are poverty, adverse childhood experiences and parental mental health; social media gets the attention because it is visible and rich. The test before publishing: does this move attention toward the real drivers, or accidentally make the platform the main character. The 1 in 10 rule: roughly one post in ten states the poverty and ACE thesis plainly, the other nine each carry one brick without landing the whole thing, so readers arrive at it themselves. Moral panic is the vehicle (proportionality, never denial of harm), the poverty and ACE point is the destination, revealed gradually. The standard to earn is Sonia Livingstone: let the evidence do the work, never lean on the label. Wired into content-engine SKILL (read first, every time) and CLAUDE.md context routing (any social or Drive content applies the filter before drafting). Kept INTERNAL: it is not uploaded to the shared Drive and not shared with the agency, because it is a private strategic filter, not a brief.


---

## 2026-07-10 — Trial model: two doors, no card by default plus a card door

JP asked whether the 14 day trial should collect card up front and auto charge (like other services) or stay no card. Best practice tradeoff: card up front converts a higher share but far fewer start and it fights the "nothing hidden" brand with anxious parents at a £7.99 price. No card maximises trials and trust. Decision: build both doors, do not choose one. Door one stays the no card 14 day trial (trial_ends_at set at onboarding completion, drops to free tier after). Door two on the founding screen is now a Stripe subscription with trial_period_days 14 and payment_method_collection always: card collected, nothing charged for 14 days, auto continues, holds the founder place. The trial is applied only when from is onboarding, so an existing trial user upgrading from the dashboard is charged immediately and nobody gets two free trials. Webhook now maps Stripe status trialing to our active so a card door founder is never locked out during their free days. Revisit going card first only after launch with real conversion numbers. Needs a Stripe test mode purchase to confirm the trial and card flow before go live.

---

## 2026-07-11 — Starter Story (Early) growth playbook: paid parent creator engine

JP uploaded the Starter Story episode with Jake (Early, the push up alarm app, 0 to $50k a month in 4 months) plus the Sam Parr "how I work" segment, and asked for a marketing plan applying it to grow the app. Written to plans/week-of-2026-07-11-starter-story-growth-plan.md. It is a fourth acquisition engine, not a replacement: it sits next to the Glam Up in product flywheel (guided-digital-pathway-growth-plan.md) and the LinkedIn, SEO, schools engines from mrr-10k-review.md, and it feeds cold traffic into the top of the same stage card funnel.

What transfers from Early: top of funnel is the whole game; a single showable hook (ours is the three question stage reveal, our equivalent of "push ups to turn off your alarm"); the ban confirmed 15 June 2026 and live Spring 2027 is our timing window, the way iOS 26 Alarm Kit was Jake's; native placement inside content parents already watch (day in the life parenting creators); view guarantee deals at roughly £2 to £3 per thousand views with a capped downside and power law upside; spike based attribution on a plain Google Sheet, not built infrastructure; ship one creator one video one week before scaling. Sam Parr's half is the operating system: one or two time bound tasks a day, quantity over perfection, one lane per session, black box mindset.

New brand rule this plan adds, above growth: no child's face in any paid creator content, ever. The camera stays on the parent and the parent's phone. We are the brand that protects children online, we cannot grow by putting kids on camera. Also holds all existing non negotiables: every CTA to /starter-pack, founder rate capped at 50, Justin's voice, no dashes, no fear first, no fake reviews. Test budget £750 to £1,000 across two or three creators before scaling. No product code, no migration number claimed.

---

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

---

## 2026-07-13 — The parent video research landed: the 0 to 5 band is the gap, the handoff is the moat

The 104 agent deep research on the three benchmarks (Internet Matters early years, Digital Matters, Common Sense Digital Citizenship) finished with 23 of 25 claims confirmed and is banked in plans/parent-video-research-2026-07.md, the exact file the script session prompt reads. The verdict: all three converge on parent first, watch one then act, choice driven child interactivity, and our 21 modules already cover every strand they teach from age 5 up. The one structural gap is a 0 to 5 parent only band (six topics, the child never watches), and the one thing nobody closes is the parent to child handoff, which Star Lessons already does. Two claims were refuted and must never be cited (the named Digital Passport mini games, and the strong causal screen time stat). Common Sense retired Digital Compass on 30 June 2026, so our 11 to 16 branching story has no live competitor. v1 path: write the misinformation session file plus one 0 to 5 parent session, cut two parent videos when Higgsfield credits land, wire them to the existing Star Lessons send. The script session lane can start now.

## 2026-07-13 — Script sessions lane claimed: v1 pair written

The curriculum content lane is live on branch claude/script-sessions-v1 (draft PR is the lock). The v1 pair from the research file is written to plans/script-sessions/: 7-11-misinformation-deepfakes-ai.md (Track P plus the full Track C deck, Zara KS2 register, three checks locked wording, quiz as the last two choice slides, both DiGi closes) and 0-5-screen-time-and-feelings.md (Track P only, child never watches, Zgambo 2025 worded as the research file allows). Next batch: the remaining five 0 to 5 parent only topics, one band per push. Scripts only, no renders, no migrations; JP red pens in the files and platform lane lands them.

## 2026-07-13 — Script sessions: 0 to 5 band complete

The remaining five 0 to 5 parent only sessions are written to plans/script-sessions/: 0-5-daily-conversations.md, 0-5-good-digital-habits.md, 0-5-safe-device-setup.md, 0-5-sharing-milestones-safely.md and 0-5-choosing-apps.md, each Track P only in the watch one then act format with the exemplar's structure, DiGi as the golden star throughout and no child track. The Zgambo et al. 2025 narrative finding is reused once only (good digital habits); every other session carries no statistics by design and the refuted claims appear nowhere. With the earlier screen time and feelings session this closes all six topics of the band; next batch is the 5 to 7 band, one band per push.

## 2026-07-13 — Script sessions: 5 to 7 band complete

All four 5 to 7 co watch sessions are written to plans/script-sessions/: 5-7-kindness-on-screens.md, 5-7-calm-bodies-screens-feelings.md, 5-7-real-pretend-computer.md and 5-7-screen-routines.md, each with a full Track P (parent first, co watch handoff at beat 3) and a complete Track C flowing deck with Sofia teaching, DiGi Junior pausing, DiGi opening and closing in both variants, quiz as the last two choice slides, and no statistics anywhere by design. The kindness session carries the education validation audit content (unkind and pretend people named briefly and warmly, never the child's fault, telling never naughty); next batch is the 7 to 11 band, one band per push.

## 2026-07-13 — Script sessions: 7 to 11 band complete

The remaining six 7 to 11 sessions are written to plans/script-sessions/: 7-11-gaming-time-intensity-spend.md and 7-11-mood-and-screens.md (Oliver), 7-11-how-algorithms-work.md, 7-11-privacy-passwords-reputation.md and 7-11-my-work-and-others-work.md (Zara) and 7-11-kind-and-safe-online.md (Sofia with Oliver support), each with a full Track P ending in the Star Lesson handoff and a complete Track C flowing deck to the misinformation exemplar's standard, with all six interactive grammar types used once across the band and no statistics anywhere by design. Misinformation was already in the v1 pair, so the band is now 7 of 7; next batch is the 11 to 14 band, one band per push.

## 2026-07-13 — Script sessions: 11 to 14 band complete

All six 11 to 14 sessions are written to plans/script-sessions/: 11-14-social-media-group-chats-workarounds.md, 11-14-scams-fraud-money-online.md and 11-14-digital-footprint-identity.md (Vix, with Zara supporting the footprint concept beat), 11-14-misinformation-deepfakes-ai.md and 11-14-manipulation-and-persuasion.md (Zara) and 11-14-bodies-image-pressure-online.md (Brock with DiGi anchoring the tell someone slide), each with a short Track P primer ending in the child version leads handoff and a complete Track C deck in the secondary register with the last two choice slides as the quiz and both DiGi closes worded for teenagers. The misinformation session adapts the spec section 10.2 reference beats verbatim (locked three checks wording, existing renders 459b1662, 66e88fe5 and 129f9d14 named), the workarounds session carries the Spring 2027 ban world with the price it first frame, all five KS3 interactives are used across the band, no statistics appear anywhere by design, and the next batch is the 14 to 16 band, one band per push.

## 2026-07-13 — Script sessions: 14 to 16 band complete, full 0 to 16 topic map covered

All six 14 to 16 sessions are written to plans/script-sessions/: the three sensitive modules 14-16-consent-images-and-the-law.md, 14-16-sextortion.md and 14-16-radicalisation-and-misogyny.md (DiGi only, calm register, minimal staging, scenarios at one remove, the recognise, refuse, report, not in trouble spine explicit throughout, Report Remove by Childline and the IWF and CEOP named accurately as services, the sextortion quiz seeding paying makes it stop, and parent briefings that name the words never to say, the confiscation threat, and the words to say instead) and the three standard modules 14-16-readiness-at-16-ban-world.md, 14-16-ai-mastery-and-data-rights.md and 14-16-digital-identity-future-of-work.md (Vix and DiGi straight talk, the licence not floodgate framing, ladder not lift with UK GDPR rights stated plainly, and the future you test carried up into authorship). With this band all 29 session files exist and every topic in the Part B research table from 0 to 16 is covered, so the lane's writing phase is done pending JP red pen; the platform lane lands the scripts in the database after that.
## 2026-07-13 — Red pen round: possessive header, DiGi picks a moment, Read it big retired

Three JP red pen items in one pass. Home header now reads Teo's pathway rather than a bare name, paying off the tour's Step into Teo's pathway promise (shipped separately as PR 246). The Moments page opens with DiGi's pick: time of day chooses the category, the family's live focus overrides it (screens focus wins the Digital card), the reason is said out loud, and the picked card leads the grid; the daily timeline links through to the full library. Read it big is gone from the script reader along with its whole focus overlay: the hero line is already big, and one strong action (Hear it in Skye) beats two.

## 2026-07-13 — Games: the research batch, and the gating audit

JP asked for the games section fully age gated and grounded in the best educational games on the market. Audit first: every game carries a stages array, the kid link and the parent Games tab both filter by the child's stage, and the only ungated surface is the parent's own preview page, which is deliberate. Then ten new games built on what the leaders prove works. From Duolingo ABC: bite sized phonics (First Sounds). From Khan Academy Kids: variety and gentle adaptive spread (Make Ten untimed, What Comes Next patterns). From Times Tables Rock Stars, the recall ladder now runs end to end: Doubles Dash, Tables Warm Up, Rock Out, Halves Hero, Division Dash, Tables Final Boss (7s 8s 12s). From SplashLearn: number sense before speed, untimed where the age wants it. Plus the differentiators no market app has: Word Detective (phonics screening style), Fact or Opinion, Percent Power (the maths that spots a fake discount) and Clickbait Caller for the older stages, every judge item teaching its why. Twenty four games total, all stage gated.

## 2026-07-13 — Printables: the offline pathway ships

JP approved the colouring book style proof (white sheet, hand lettered title, line art to colour, the 5 star strip) and the production run followed: six sheets, each with an Etsy grade pinned preview (Summer, Rainy Day, Kindness and Reading bucket lists, Nature Scavenger Hunt, Family Challenge List). Adding a sheet is two generations plus one registry entry, never a code change. Parents get /dashboard/printables: pinned previews, age fit section first, real A4 PDF downloads (pdf-lib, artwork fetched server side where the CDN is reachable) and Add to quests, which routes the finished paper through the existing approve loop into the time bank. Children get the same library on their quest link, stage gated, with Ask for it riding the quest pitch flow, so the request lands on the parent board like any other idea. Not yet surfaced on the Explore grid: JP reviews the page first, then it gets its tile.

## 2026-07-13 — Printables round two: the brand on every sheet, Spanish, and the builder

Three JP asks in one pass. First, branding: every PDF download now carries Guided Digital Pathway stamped as real text at the top by the PDF route itself (plus a guidedchildhood.com footer), so the brand line is pixel identical on all sheets, present on every future sheet automatically, and can never be misspelled by generated lettering. Second, language: all six English sheets now have Spanish sister artwork in the registry, and the library shows two download buttons wherever a translation exists (PDF English, PDF Espanol); the route serves the right artwork off a lang parameter and suffixes the filename. Spanish labels were chosen accent light on purpose because generated lettering cannot be trusted with accents; JP red pens the spelling. Third, the builder: /dashboard/printables/builder is an interactive bucket list maker, pick from an idea pool of 24 or write your own up to 12 items, put the child's name and a title on it, print it from the browser onto a branded A4 sheet with colour in circles and the 5 star strip, and Add to quests wires the finished page into the approve loop like every other printable. The library page links to it with a Build your own card.

## 2026-07-13 — Printables get their Explore tile

JP said add to platform once the Spanish, branding and builder round was done, so the Printables tile joins the Home Explore grid (sage tint, printer icon, The offline pathway). It rides the same one spotlight a day rotation as the other five tiles.

## 2026-07-13 — The bucket craft, and the brand rides every printout

Two JP asks. The cut and paste bucket craft he loved on Etsy is now ours as original artwork in the locked style: page one is a big bucket with the title, seven write your own checkbox lines and the star strip, page two is the pieces (handle, sun, starfish, ice lolly, a spade for the name and a flag for the date). English and Spanish pairs, an assembled craft preview, and the registry grew extraSheetUrls so multi page printables are still a data entry; the PDF route loops the pages. Second, brand and catchphrase everywhere: lib/brand.ts is the single source (name, pathway line, catchphrase: Keeping the balance: offline strong, online safe. Digitally educated, AI literate, ready by 16.), the PDF route stamps the real logo drawn in vectors plus name, pathway line and catchphrase on every page of every download, and components/brand/PrintBrand.tsx puts the same header and footer on the builder sheet, quest sheets, game pack sheets, the family agreement and the educator parent note. No downloadable leaves the house unbranded.

## 2026-07-13 — The Progress page passport becomes a real flip book

JP asked for the passport as a mock up of a child's actual passport: pages that flip, a circle on each page in the stage's colour filling as the stage completes. Shipped as PassportBook on the Progress page, replacing the flat stamp row: a deep teal cover with the gold crest and the child's name, then one page per stage in that stage's tint with the big progress circle (stamped with a rotated EARNED seal at 100 percent), passport data rows and a Fill this page link into the stage. The book opens itself on the child's current stage, flips on tap (page sides, arrows or the stage dots) with a 3D turn, and earlier unfinished stages read as catch up pages. Verified in a scratch harness at mobile and desktop widths before shipping; a nested state update bug that lagged every flip by one tap was caught in the screenshots and fixed.

## 2026-07-13 — The device time contract, and screens wait quests

JP's ask: printable contracts with the quests in, stars adding up to device time, visibility of time earned and used, and the spotted it flow (the bedroom is not tidy, prompt it in the app, print it, screens wait). Migration 048 adds blocks_screens to family_quests. The parent quest manager gains a Do this first card: three one tap chips or type your own, and it lands as a one off quest at the top of the child's list marked before screens, pings their device, and joins the contract. Every quest also has a Screens wait toggle in its edit row. The kid page lifts unfinished before screens quests to the top behind a "These come first today. Screens after." banner. The new /dashboard/quests/contract prints one branded contract per child: the deal (1 star is 5 minutes, stars land on approval), the before screens clause with checkboxes, the full quest table with star and minute values, the live score (bank balance, earned this week, minutes used this week), and signature lines for both sides. On tracking device time honestly: the star bank ledger is the score both sides see (earned on approval, minutes bought off the bank before screens go on); real on device enforcement stays with Screen Time and Family Link until the mobile app can read the Screen Time APIs.

## 2026-07-13 — The builder prints onto the bucket

JP asked for the build your own list to appear on the bucket shaped print out. The builder's sheet is now the bucket itself: an original code drawn SVG (handle with ring ends, rim, tapered body, a smiling sun on the rim corner, all uncoloured line art for colouring in) with the family's picks laid out inside the bucket as ruled lines, each with a colour in circle and the emoji. Rows share the bucket's height evenly so any count from 1 to 12 always fits inside the drawing, and lower rows tuck inward to follow the taper of the bucket wall. Title and name sit on the bucket, the star strip and brand stay top and bottom. Verified in a scratch harness at phone and A4 widths; the first pass overflowed the bucket at 8 items and clipped the wall at 12, both caught in screenshots and fixed before shipping.

## 2026-07-13 — Homepage conversion pass: real screenshots, DiGi greets, the passport shown live

JP's brief: the homepage is the window into the service, make it convert. Research (2026 SaaS landing patterns, AEO playbooks) says real product screenshots are now the primary trust signal and AI search rewards direct answers under question headings. Shipped: a See Inside section of genuine product captures (the passport flip book mid stage and stamped, the bucket builder's printed bucket, a printable preview from the live CDN), the real passport screenshot framed as a phone inside the passport section with the earn it line (safe digital usage, healthy habits from the start, no matter what age they join), and DiGi greeting first visitors once per session: the golden star pops up, names the problem (the ban takes the apps, teaches nothing), gives the answer, offers the door. The tools grid grew to twelve honest cards (passport, printables, 24 games, quest contract), the stats strip lost the last invented number (200 families, replaced with 160 scripts and 100 lessons), the FAQ and FAQPage JSON-LD gained the ban readiness question and the full what you get answer including the catchphrase, and the Organization schema carries the slogan and the new knowsAbout terms for AI chat searches. Also from the same brief: the passport circle is now weighted toward lessons (40 lessons, 30 scripts, 15 streak, 15 devices) on both the Progress book and the pathway. Verified with Playwright at 390 and 1280 before shipping; the CDN tile shows alt text only in the sandbox, never in production.

## 2026-07-13 — The passport looks like a passport, lessons are the visible process, and the missing videos

Three JP items. First, the look: he sent a photo of a real passport, so the cover is now a burgundy book with gold foil rules, a gold crest (the rising bars in a ring), letterspaced DIGITAL PASSPORT titling and the child's name in gold, on both the Progress flip book and the homepage passport section. Second, the process: every passport stage page now leads its data rows with LESSONS, done of total with a stage coloured progress bar, fed by new lessonsDone and lessonsTotal fields on StageProgress; the page button routes to the Lessons hub. The Lessons page already carried the Completed chip and Run again on finished lessons, so that ask was already built. Third, the videos: of the four character clips rendered on 1 July, only DiGi's algorithm clip was ever wired into a lesson (the parent exemplar in migration 017); Oliver's BE THE BOSS OF YOUR SCREEN, Sofia's REAL OR FAKE and the privacy shield clip were rendered and then never referenced anywhere. Migration 049 inserts each as a video slide after the opener in its matching module deck (screen routines, real pretend computer, privacy reputation, plus the algorithm clip into its school module), guarded so a deck that already has a video is left alone. Also fixed on the same pass: the schools page hero and closing headline were unreadable, dark ink on the dark section, because the global heading rule beats inherited colour; both are explicit white now and the espresso sections carry a lighter teal gradient.

## 2026-07-13 — Hand it over: the quests page opens with one simple switch

JP wanted the quest management page super simple: icons, top level buttons, a toggle between the offline pack and sending to the phone, an explanation of why the phone send is safe, and a picture of the child's page. The quests page now opens with a Hand it to {child} card: two big icon toggles (To their phone / The offline pack), defaulting to paper for a Foundation age child. Phone mode gives one gold button to send the private link (or create it first), a ping button, the plain words safety explainer (one private page, not an app, nothing to install, no account, no messages from anyone, the link is the key, stars still land only on your approval) and a real screenshot of the child's page framed as a phone, captured from the live component. Paper mode gives four icon buttons (quest sheet, device contract, game pack, printables) and the no phone needed line. Everything below stays in the tabs.

## 2026-07-13 — Printables reach every age, DiGi types its pitch, and why the videos are not showing

JP could not find printables on the child app and asked why the built videos are not there. Two real causes and one explainer. First, printables: the stage ranges were too narrow, so a stage 5 child saw zero sheets and a stage 4 child saw one. Broadened every sheet (family challenge now 1 to 5, kindness reading spanish to 4, the rest to 3) so every age gets several, and the child page now heads each block (Star lessons, Games to play, Paper adventures) so nothing hides at the bottom. Second, the videos: the kid lesson player already renders video slides, so the four character clips appear the moment the data is in the row. That is migration 049, still to run in production, and only inside a lesson the parent has actually sent as a Star Lesson (they never auto appear on the child page). Third, JP's DiGi greeter red pen: the pop up now types its message out word by word in a proper white speech bubble with a tail pointing at the star, and the copy is fuller and clearer: full digital literacy lessons taught at the right age, a star system that rewards real jobs and outside play, and the skills to navigate the online world with a healthy balance of screens and life.

## 2026-07-13 — Three quests fixes: send lesson honesty, games are the child's, printables paywalled

JP reported the send lesson to child did not work, the games read as parent play, and asked for printables on both apps behind the paywall. First, Star Lessons: the send silently claimed success even on a server error, so a real failure looked identical to a working send. Now send checks the response and shows the real reason, the API returns a clear lessons not set up 503 when school_lessons has no rows (the curriculum migration not run on that database), and the picker shows a plain switched on yet message instead of a dead dropdown. This is almost certainly the cause: the lessons table is empty in production until migrations 023, 031 to 033 are run. Second, the Games tab: reframed from a parent play list to the child's games. The header says these are the child's games, already on their link; each card keeps a small Preview for the parent to check the game and a Send to child button that pings their device to go play it, replacing the Play button that implied the parent plays. Third, printables paywall: the pinned previews still show to everyone (they are the sell) but the PDF download, the Add to quests wiring and the builder are members only, gated in the UI, in the PDF route server side (402 on a direct link), and on the builder page (redirect to upgrade). Founder and trial parents keep full access via hasFullAccess.

## 2026-07-13 — The animated lesson intro, and the ping now opens the child's quests

Two things. First, the busy classroom video is replaced as the lesson opener by AnimatedIntro (components/lessons/AnimatedIntro.tsx): DiGi the golden star (DiGi Junior wears the number 10 kit, so a star with a football is on brand, never the legacy robot or owl) drops in, kicks a ball that arcs across and lands on a grass pitch, sparks burst at contact, and the lesson title reveals word by word over a deep teal card. Pure SVG and GSAP, no render pipeline, no credits, loads instantly, and it is wired into every title slide in the lesson player so it plays at the start of every lesson including the child Star Lessons. Iterated to a clean landing on grass via Playwright screenshots. Reduced motion shows the finished frame. Second, a real bug JP surfaced: the ping to the child's phone (and every kid push) sent url '/', so tapping the notification opened the site root where a child with no login lands nowhere. Now pushToChild and the ping route look up the child's private link token and deep link the notification to /k/<token>, so tapping it opens their own quests.

## 2026-07-13 — The lesson intro is the real character with a spoken hello

JP said the abstract star kicking a ball did not make sense, he wanted the real characters we already built (the footballer, the dancing girl) doing a simple intro with a speech introduction. Found the clean single character clips already in Higgsfield history, no busy classroom, just the character on a stadium background: Teo in the number 10 kit kicking a football (a28311bc), Alam in a tutu spinning with sparkles (457b92ac), and Olga's celebration leap (4641ac49). AnimatedIntro now plays the character's clip in a gold framed panel, muted and looping, with a speech bubble that types the character's warm hello word by word and the lesson title revealing under it. lib/lessons/intro-characters.ts is the registry (adding a character is a data entry), and introCharacterFor picks the footballer for screen and gaming lessons, alternating the dancer and the leap otherwise; a title slide can name the character explicitly. Wired into every lesson opener. Layout verified with Playwright (the clip only plays in production, the sandbox cannot reach the CDN).

## 2026-07-13 — Watch together lessons get a thumbnail shelf with send to child, and the nav goes premium

Two things. First the lessons: the watch together page (/dashboard/lessons/together, the illustrated video lessons the other session built and seeded) is now a thumbnail card shelf rather than a plain list. Each lesson is a stage tinted tile with its strand emoji and a play mark, and two clear actions: Watch together (opens the co view player) and Send to {child}, a client button that pings the child's device (the ping deep links to their own quests, where the lesson already lives as an adventure). So the parent has one nice front facing page with both the watch here and send to child paths JP asked for. Left additive and tight because the together lessons are another session's active lane. Second, premium polish on JP's red pen: the dashboard top nav pills now use the display font at 700 with tighter tracking (was body 600, read basic), a frosted blurred container with a lighter hairline, and the active pill carries a real depth shadow, the Apple clean feel he wanted. The Take me straight in button on the starter pack moved off the techy mono onto the display font. Migration note: two 049 files coexist on main (049_parent_lessons from the other session, 049_wire_video_beats from this one); both are additive and touch different tables, harmless together, flagged for the next renumber.

## 2026-07-13 — The Lessons hub: one place, expert flow, send to child moved in

JP asked for the Lessons tab to be the single home for every lesson type with an easy watch here together or send to child, tidy and expert like the patterns on Mobbin. Built /dashboard/lessons as one hub with a segmented control (Do together / Send to {child}). Do together leads with the watch together video shelf (the illustrated films, thumbnail cards with Watch together and Send to child per lesson) then the interactive library below (the flagship, the school and AI lessons, paywalled as before). Send to {child} is the Star Lessons picker, moved here from the Quests page (StarLessons.tsx relocated into the lessons folder); Quests now carries a pointer card to it. Sending still lands on the child as a quest. Verified the segmented flow with Playwright. The two lesson systems stay in their tables (parent_lessons watch together, school_lessons interactive and sendable); this is the read and display layer that unifies them. Also, JP follow up: the printables now show on the child link only once the parent has access. The kid page reads the parent's subscription (hasFullAccess on the link owner) and gates the paper adventures section, matching the paywall on the parent side.

## 2026-07-13 — Lessons hub simplified: the illustrated films are the child's lessons, one clear send

JP found two things confusing. First, the separate Star Lessons send picker (the school_lessons dropdown) sat beside the illustrated lessons and muddied the story. Removed it: LessonsTabs and StarLessons.tsx deleted, the hub is now one clean scroll. The illustrated films are framed as On {child}'s phone (they already live on the child's quest link as adventures), each with Watch together and Send. Below sits the interactive library the parent leads. So send now means the illustrated lessons only, they land alongside the child's other lessons on their phone, and the parent sees them on the dashboard. Second, the send ping to the child: the button now reports the real outcome honestly. Pinged {child} when it delivers, On their quests (no ping set up) when the child's phone has no push subscription (the lesson is there either way), and Pings not switched on yet when the server is missing its VAPID keys. That last one is the likely reason a test ping to Teo did not arrive: pings need VAPID_EMAIL and VAPID_PRIVATE_KEY set in the deploy environment, and the child must have opened their link and turned reminders on (added to the home screen on iPhone).

## 2026-07-14 — Big thumbnail kid page, drawn posters everywhere, a rocking red badge for child asks

JP's four part pass after seeing the kid link. First, the kid lessons and games page was a plain list of emoji rows; rebuilt every card into a big Happy News style tile: one cheerful picture banner (a bright gradient carrying a huge emoji, or the real drawn film frame when there is one), a star pill, a bold title, a plain line and a round tap mark, with clear big section heads (Watch with your grown up, My lessons, Games to play, Paper adventures). Printables keep their real preview as the banner with a full width Ask for a print out button. Second, the drawn lesson images now show as thumbnails on the parent Lessons hub shelf too (the other session added poster_url to parent_lessons; the hub renders it, falling back to the stage tint and strand emoji). The child adventure cards carry the same poster (posterUrl threaded through the kid page). Third, when a child asks for a quest or a printable it now surfaces to the parent as a red count badge on the Quests tab that gently rocks (ask-rock keyframes, honours prefers-reduced-motion), on both the desktop top nav and the mobile bottom bar; the count is pending quest_requests for the parent, read in the dashboard layout. Fourth, another premium pass on the top tabs (gradient active pill, deeper shadow, subtle press). Verified the kid cards and the badge with Playwright at mobile and desktop widths.

## 2026-07-14 — Printable asks get a real print button on the parent side

JP spotted that when a child asks for a printable it lands as a quest that just says "Print the My Rainy Day Bucket List sheet", with no actual way to print it. The child cannot print; the parent does. So the parent Quests board now carries a real print link wherever a printable ask appears: on the pending pitch card (open the sheet the moment the child asks, then set the stars and add it) and on the live quest row once added (🖨️ Print, one tap to the branded PDF any time). Both link straight to /api/printables/{key}/pdf, matched from the ask title "Print the {title} sheet" back to the registry. No new print surface, just the existing PDF route surfaced where the ask is.

## 2026-07-14 — Done today sticks, and the child hears the yes with their earned minutes

Two things from JP on Teo's quests. First a bug: tapping "Done today" on the parent board flashed "Done ✓" then bounced straight back, because tickForThem only set a 2 second flag and never updated the local ticks or refetched, so the approved tick never showed. Now it lands the approved tick in local state immediately (optimistic), reconciles with a reload, and the button reads from the real approved-today state so it stays Done ✓ and disabled. Second, JP wanted the child told when the parent confirms a task: the approve route now pushes to the child's own device on approval (both the direct "Done today" tick and approving a pending tick), "Your grown up said yes! [task] is confirmed. You earned X stars, that is Y minutes of device time to use." Y is stars times STAR_MINUTES, the same conversion the star bank uses. Best effort through the reminders they already turned on; silent if their phone is not set up. Left the specific "between these hours" device-time window out for now: it would need a new agreed-hours setting, flagged to JP.

## 2026-07-14 — Lessons page stops being a long list: three tidy views, thumbnail led

JP: the Lessons page as one long scroll of every lesson at every stage was not usable. Rebuilt it Mobbin style. A new client browser (LessonsBrowser) puts a sticky segmented control at the top with three views (🎬 Watch together, 📚 Lessons, 🖨️ Printables) each showing its count, and a stage chip row that defaults to the child's own stage, so a parent lands on a short relevant shelf, not forty cards. Watch together and Printables are thumbnail card grids (the drawn film poster, or the sheet preview) with their two real actions on the card (Watch together / Send, and PDF / Add to quests). Lessons is the interactive library, one stage at a time, flagship pinned on top. The server page now just reads and hands flat display arrays over; Printables are pulled into the hub too (PRINTABLES registry, PrintableActions reused) so every lesson type lives in one navigable place. Verified all three tabs with Playwright at mobile width.

## 2026-07-14 — Device time: spend earned stars as a real countdown, both sides watch

JP wanted the loop closed: a child earns stars, then spends them as minutes on an agreed device, with a countdown that stops and alarms when the time is up, and both parent and child able to track it. Built it as decided (child starts it on their own app, minutes come from earned stars only at STAR_MINUTES each, fixed device set phone/tablet/TV/console). New table device_sessions (migration 052) holds the live session with a fixed end time and a link back to the star_spend it created, so the countdown survives a refresh and the parent computes the same clock. Starting a session records the spend straight away (the bank drops, never spent twice); stopping early trims that spend back to the minutes actually used so nothing is wasted; a finished countdown used the whole block. On the child app (DeviceTimeCard, under the star bank): a Use my time button, a device and minutes picker capped at their balance, a big live MM:SS countdown with a progress bar, an alarm (three rising Web Audio beeps plus a vibrate) that fires at zero on the same gesture-unlocked audio context, and a Time is up card. The child app is already a PWA (add to home screen, service worker), so the timer rides that. On the parent board a live ParentTimePill ticks the same end time next to the child who is on their screen, and the start pushes the parent a heads up. SQL to paste: migration 052_device_sessions.sql.

## 2026-07-14 — Home: one clear "Waiting on you" banner with the red count; Lessons: see every video by age

Two from JP after the merge. First, the red pending count needed to show on Home too, not only the Quests tab, so the dashboard says at a glance what to do next. Added a WaitingOnYou banner at the top of Home (client): the same red count the tab wears, summing quests to approve plus ideas a child pitched, with plain text (2 to approve · 1 new idea) and a Review button that scrolls to the quest board (id anchor added). Silent when nothing waits, so a calm day stays calm. The QuestBoard already acts on both inline; this is the top of funnel signal. Second, the Lessons Watch together tab was filtering to the child's stage, so JP could not see every illustrated video we made. Added an All ages view (now the default) that groups every video by stage under age headers (Stage N · Ages x to y, the child's own stage flagged), each card keeping Watch together and Send, so a parent sees the lot and sends whatever they judge right. Same for the Lessons library. Same parent_lessons source as the together page, so the two always match. Verified the All ages grouping with Playwright.

## 2026-07-14 — Notifications hub (the red bell), and DiGi shows up in it

JP wanted the school app pattern: a red bell that opens a notifications screen for everything that pops up (lesson and quest requests, to dos), and he had not seen DiGi step in proactively. Built both together. New notifications feed (lib/notifications/collect.ts, GET /api/notifications) gathers, into one shape newest and most urgent first: quests a child ticked and is waiting on (urgent), quests and printables a child pitched, DiGi's own proactive prompts, open school actions, and a live device timer. New hub page /dashboard/notifications renders the list, school app style, each row one tap to act. A NotificationsBell in the desktop header carries the red count and opens the hub; the Home banner (WaitingOnYou) now reads the same feed, names what is waiting in plain English, and taps into the hub too, so mobile (no header) has the way in. On DiGi: its proactive brain (findTriggers) fires family specific watch fors only from wellbeing check in history (a mood drop, two low sleep weeks, a flagged concern) plus a routine tip every three days, so with no check in data JP only ever saw the generic tip. Surfacing DiGi prompts in the notifications hub makes it visible when it does step in. No SQL: reads existing tables (quest_ticks, quest_requests, digi_prompts, school_actions, device_sessions). Verified the hub layout with Playwright.

## 2026-07-14 — Setup separated from the daily Home into its own hub

JP: setup things (set up quests and the like) need to be separate from the main daily user experience, and the whole thing simpler, less texty, consistent buttons. First structural move: setup now lives on its own page, /dashboard/setup, out of the daily Home. A shared getSetupState (lib/setup/flags.ts) reads the same flags and step list the guided path used. The hub shows one progress bar, a To do list (each step an icon, a title, one short line, one consistent chunky button, Start on the first then Set up), and Done steps collapsed quietly at the bottom. Copy is tightened to a single line per step, not the onboarding paragraphs. On Home the inline SetupPath conductor is replaced by one compact Finish setting up card that names the next step and links to the hub; it disappears when setup is complete, and a Set up tile in the Explore grid keeps the hub reachable after. This is step one of the wider Mobbin style simplification (a shared button system across every surface, and less texty screens) which continues next. No SQL.

## 2026-07-14 — One shared Button, the consistency backbone

Start of the buttons all formatted consistent work JP asked for. Added components/ui/Button.tsx: one button used everywhere, so radius, the chunky drop shadow, display type and sizes are identical across the app instead of twenty hand rolled inline ones. Variants primary (butter gold), teal, danger, secondary, quiet; sizes sm/md/lg with a proportional lift; disabled, full width and icon support; renders a next/link when given href, a real button otherwise. Adopted first in the Setup hub CTAs. The rollout to the busier legacy surfaces (Quests board, script and lesson pages) continues from here, swapping their inline button styles for this one. Verified every variant and size in a showcase with Playwright. No SQL.

## 2026-07-14 — Rolling the shared Button through the Quests board

Continuing the buttons consistency work. The home Quests board (QuestBoard) primary actions, Manage, Add it and Approve, now render through components/ui/Button instead of their own inline styles, so they match the rest of the app exactly. The small dismiss crosses and the tick rows stay as they are (they are a different control type, not a call to action). Verified compile and the Button variants in isolation; the live board needs auth and data so it could not be screenshotted in the sandbox, it renders on the preview. Rollout continues to the Quests manage page and script and lesson CTAs next. No SQL.

## 2026-07-14 — DiGi: make the learning loops visible and non-silent

JP wants DiGi to be a true learning agent that uses what it learns. Mapped the four loops. Per family memory is a genuine closed loop already: after every chat DiGi extracts one durable memory (concern/win/preference/context) and writes it to digi_memory and the concerns ledger, and reads it back into the next conversation. Cross family wisdom is also a closed loop (wins across the base to a Sunday cron to digi_wisdom to every prompt) but was empty by default and silent until the cron had data, and a bad model run could blank it. The insight agent mined every question but only emailed the founder and discarded the result.

Fixes this pass (migration 053): seed digi_wisdom with a small set of evergreen, philosophy aligned patterns so aggregate wisdom is non empty and feeding answers from the first conversation, replaced by genuinely learned patterns as real wins accumulate; guard rebuildWisdom so it only swaps the corpus when it has fresh rows in hand, never blanking a populated table on a zero parse; and a new digi_insights table plus persistInsights so each daily mining run is kept as history, not thrown away after the email.

Config JP must set for the loops to run in production: CRON_SECRET (else the weekly wisdom and daily insight crons silently no op, the likely reason it felt dead) and EMBEDDING_API_KEY (else family memory recall falls back to keyword only). Data accrues on its own from usage (digi_memory and digi_questions self populate from chats; wellbeing_checks from check ins drive the proactive triggers). SQL to paste: migration 053_digi_insights.sql.

## 2026-07-14 — Home slim: first pass is copy, structural fold needs a look

JP wants Home slimmer without losing benefits. Home is the logged in screen that cannot be screenshotted in the sandbox, so the first safe pass is copy only: trimmed the this week actions lines, the trial banner and the trial ended banner to the fewest words that still read warm, no features removed. The deeper structural slim (folding the secondary cards, DiGi prompts, school actions and smart alerts now that the notifications hub carries them, and grouping the fuller home below the daily flow) is the next step and wants JP's eye on the preview so nothing he values disappears. No SQL.

## 2026-07-14 — Home rebuilt to the best-practice top-app structure

JP approved the redesigned Home mock. Rebuilt the live page to it: the greeting row (child pathway, stage, streak) leads, then the Waiting on you alert, the focus strip, the Today hero (TodayPathStrip), then a new glanceable HomeStats row (streak, stars in the bank, today's quests, from the same quests feed the board uses), the Family Quests board high in the flow, and a quiet Keep going grid of tiles (Lessons, Moments, Ask DiGi, Pathway, Scripts, Printables, Family agreement, Set up, Health report) that is always visible. The secondary layers (DiGi streak widget, DiGi prompts, smart alerts, the age gate, school actions, moments, last script, this week's actions, DiGi quick access, upgrade) all stay, moved below the daily flow, so nothing is lost, it is just no longer a wall. Removed the old Explore your membership grid (its tiles folded into Keep going, so no duplication) and its daily spotlight. Since Home is the logged in screen that cannot be screenshotted in the sandbox, the shape was approved from a token accurate mock first; build and tsc clean. No SQL. Mobbin MCP was not connected this session, so the pattern came from the documented top-app home structure, not a live pull.

## 2026-07-14 — Child My Lessons split into sub-tabs with a red "new" alert

JP: on the child app the lessons were a jumbled long list, and a pinged lesson or printable needs to jump out. Split My Lessons into sub-tabs (Watch, Learn, Games, Print), only showing the tabs that have content. Each sub-tab wears a red dot the moment a grown up pings something new into it, and the top My Lessons tab wears a red count badge for the total new. New means unopened by this child, tracked in localStorage (gc_kid_seen_lessons) on their own device; opening a sub-tab marks its items seen so the dot clears. Adventures (drawn films) and star lessons already carry their done state, so completion shows on the cards. Verified with Playwright. Content note surfaced to JP: the illustrated watch together lessons are seeded for Stage 1 (ages 4 to 7) only, ten of them; Stages 2 to 5 have the interactive library and games but no drawn films yet.

## 2026-07-15 — Morning batch: custom pings, printables earn loop, school alerts escalate, and three decisions

Cleared the parked queue from the night before. Four builds on PR 283. Custom pings: the child phone ping (Share tab) gained more presets (turn the TV off, start homework, come downstairs) and a free text box, so a parent can send any quick message, not only the three fixed ones. Printables earn loop: on the child app the print sheet card now leads with I finished it, show my grown up, which sends the approval so the stars land, with a quiet no printer fallback; the ask used to read only as ask a grown up to print it, which hid the earn step. School alerts escalation (migration 056, school_actions.due_time): a school action can carry a written time; the parent card is calm days out, turns to Today, then red with a soft pulse in the last hour and overdue once passed; the time flows into the ICS so the calendar event lands at its real time not a blanket 7:45; the Home Screen badge (AppBadge) now counts school reminders that reached their day alongside quests to approve; and the child's own screen gets a From school today banner that goes red as a timed one nears. A hydration trap was found and fixed on the way: the minute level urgency must be gated behind a mounted clock (nowMs null on first render) so the server and first client render match, then it escalates live. Verified both the parent card and the child banner with Playwright at mobile width (throwaway harnesses, deleted before commit); the dev overlay went from 1 issue to clean once the hydration gate was added.

Three decisions recorded. Parent PIN: not for launch (the kid token already seals parent data; the real risk is a child self approving on a shared phone, which a short PIN on Approve, Start device time and Settings would cover, revisit if it bites). Real device blocking: phase two, not launch (the timer is trust and agreement, countdown and alarm both ends, it does not lock the device; true blocking needs Apple's Screen Time API for iPhone or a router product for everything, both big). iPhone app and school emails: the app cannot read the Mail inbox (Apple sandbox); email pickup is a server feature (a forward to address) that works the same on web or app, and the app's value is reliable delivery, alarms and the red Home Screen badge. Full queue and manual tasks in launch-morning.md.

## 2026-07-16 — Design language: adopt the Good Inside simplicity across the platform

Justin sent a run of Good Inside screenshots as the north star: DiGi comes up first on open (a warm bottom sheet that greets the family by name, offers to be brought up to speed, big bold Nunito heading, swipe down or skip to dismiss); content as big pastel focus cards in a swipeable story flow (FOCUS eyebrow, huge heading, generous body, progress bar, X close, previous card); and menus as super big, super simple topic and collection grids. The rule going forward: big clear type, one thing per view, generous pastel cards, dead simple discard, in our own butter and ink and Nunito, never a copy of their brand. Shipped first: DiGiWelcomeSheet on the dashboard, once a day, gated on the local date. Queue: (1) rebuild the Quests management area in this language (plan in quests-redesign.md), (2) bring the daily deck and lesson cards up to the focus card story style, (3) roll the big card collection style through the menus. Mobbin was offline the day of this brief; reconnect and pull fresh screens before final polish. Email funnel direction discussed same day: keep lifecycle email in house on Resend and the database (it already knows trial vs paid), retire the parent waitlist and repoint the starter page to the free trial, keep a school waitlist, and add Loops.so later only if a no code editor is wanted, not Mailchimp for the funnel. Awaiting Justin's confirm on the funnel provider and the starter CTA change before building that.

## 2026-07-16 — Email funnel confirmed: in house on Resend, trial not waitlist

Justin confirmed both open questions. (1) Stay in house on Resend and the database for the whole funnel, not Mailchimp and not a third party lifecycle tool for now; Loops.so stays a later option only if a no code editor is wanted. (2) Yes to trial over waitlist. On inspection the starter quiz already creates the account and starts the 7 day trial at the end (trial_ends_at set via trialEndsFromNow), so there is no parent waitlist left in the app to remove; that was the old external Mailchimp list. School waitlist stays separate (the Mailchimp school enquiry form) until we bring it into the database. Next build unlocked: a status aware funnel on Resend, one contacts model across leads, magnet leads and parents, with a computed lifecycle_state (lead, trialing, trial_ending, active, lapsed) so the lifecycle emails branch by state, trial nurture stops on payment and win back starts on lapse. Non urgent since the trial already works; queued behind the Quests area redesign.

## 2026-07-16 — Handoff to the Mobbin design session: DiGi rename + chat flow

Assigned to the concurrent Mobbin connected design session, not this one, to
avoid two sessions editing the DiGi chat UI at once.

1. Rename the chat header eyebrow from "Your AI advisor" to "Your evidence led
   guide" in app/(dashboard)/dashboard/digi/DigiChat.tsx (around line 485).
   DiGi is a warm guide grounded in research, not a generic AI advisor. No
   dashes in the copy. Optional later consistency pass on the marketing
   mentions of "DiGi AI advisor" (pathway, join, home page), not urgent.

2. Make the DiGi chat read as one flowing thread, matching the welcome sheet.
   The DigiWelcomeSheet (components/digi/DigiWelcomeSheet.tsx) flows: big warm
   Nunito, generous line height, cream ground, one voice. The chat currently
   renders DiGi replies as separate stacked white cards that read as boxed
   fragments. Target: group consecutive DiGi lines into one soft continuous
   bubble or column rather than N bordered cards; warmer type (Nunito ~15 to
   16px, line height ~1.6, ink slightly softened); a cream or terracotta-lt
   ground for DiGi turns with the parent's turns kept visually distinct;
   generous spacing, rounded, no harsh separators; keep the calm "Reflection
   saved" footer. Pull live Mobbin references for AI chat / conversation
   patterns before finalising, then translate into our butter and ink.

Also shipped this session on PR 288 (backend, no UI overlap): school
reminders now push the child's phone as well as the parent PWA for child
appropriate one off items (kit, event, homework) the night before; weekly
routines already did this.

## 2026-07-16 — Push test honesty (backend done, card copy handed to design session)

A parent tapped Send a test on the school card, saw "Sent, it should reach
your phone", but nothing arrived, because push subscriptions are per device
and the test landed on their Mac Chrome where they were testing, not the
phone. Backend done this session: /api/school/remind/test now returns
platforms (labels of the device hosts it reached) and hasApple (whether any
Apple push endpoint, ie an iPhone, iPad or Mac Safari, is subscribed at all).
Chrome uses the same host on desktop and Android so that one stays the honest
"Chrome (desktop or Android)".

Handoff to the design session (SchoolActionsCard.tsx, the sendTest result
copy, a UI file so not touched here): replace the flat "Sent, it should reach
your phone within seconds" with an honest line built from the response, eg
"Sent to Chrome (desktop or Android). If your phone did not buzz, open the app
on your phone and turn on notifications there." When hasApple is false and the
parent is likely on iPhone, spell out the iOS steps: add to Home Screen, open
from the icon, then allow notifications. Keep it calm and plain, no dashes.

## 2026-07-16 — "Is a Ban a Plan?" series framing (ban neutral, deadline not a plan)

Built the 7 post LinkedIn series plus newsletter from the anti ban evidence report, under content/packs/2026-07-16-is-a-ban-a-plan/. The one framing rule, written into 00-framing-guardrail.md and held on every post: a ban is a deadline, not a plan. The series never relitigates the ban, for or against. When the evidence shows circumvention (Barnes BMJ 85% still using, Chicago working paper 75% found bypass easy), that is framed as "a line alone does not reach the child, so build the thing that does", never as "the ban failed". Episode 3 is the ~1 in 10 hidden thread reveal (poverty, ACEs, caregiver mental health); the other six each carry one brick.

Verification (background agent) drove three deliberate edits away from the source report: (1) the 4.7m Australian accounts is worded "access restricted" per eSafety, never "deactivated"; (2) the report's "300% VPN / 488% app" percentages are OVERSTATED (488% was one app's usage not all downloads) and were cut, replaced with "VPN demand spiked to a multi year high, downloads of smaller apps climbed steeply"; (3) the Kids Helpline "~100 contacts / sextortion rise" figures are UNVERIFIED and were cut entirely. The Chicago BFI/NBER working paper sample size conflicts across sources (746 vs 835) so the copy says "hundreds of teenagers", never a precise N. JRC 96%/37% is worded "a large four country study", not all EU. All logged in 03-guide-and-sources.md, which doubles as the PATHWAY reply. Delivered to Research Drive as three Docs. Draft PR #290. Branch restarted off latest main first because the prior branch PR (#289) had already merged.

## 2026-07-16 — Mobbin reconnected: fresh UX pull captured for the Quests redesign

The Quests redesign brief (quests-redesign.md) and the Good Inside design language entry both flagged that Mobbin was offline the day they were written, so StarSummary and the front door were built from the documented spirit only, not live screens. Mobbin is back. Pulled fresh screens for every pattern the plan names and wrote them up in design-refs/quests-mobbin-notes.md, each pattern linked to the exact Mobbin screen so a builder can open it while working. Highlights that change the build: GoHenry's child earning screen shows the week as one segmented bar (Allowance, Tasks done, To do) rather than three flat tiles, so fold our waiting/to do/this week tiles into one bar with the tiles as tap targets below; Greenlight's parent home proves a stat card reads as tappable only when it carries a one word action sublabel (Manage), so our three tiles each need a Review/Open/Adjust line; Opal's Blocks screen is the exact model for the live device timer, a single running session card with the remaining time big and a draining progress underline, PWA mirrors it, never a lock; Greenlight's set allowance screen already ships the age aware recommendation box that the DiGi screen time balance insight should copy (recommended balance, age named, one honest sentence, never a rule); LookUp/Byte/GoHenry Learn for the four big labelled front door tiles, we alternate butter and cream not a saturated wall; Finch for celebration that rewards the choice and growth (egg hatching, weekly star, streak framed as days done not loss aversion), which doubles as the safety template for the child insight surface; Duolingo ABC and BitePal for the child insight card shape, one big bubble headline, one squad character, one idea, one gentle dismiss. Skip list recorded too: no saturated colour walls, no loss aversion streak copy, no passcode lock as the timer spine (Parent PIN stays parked), never their fonts. This unblocks slices 1 to 3 of the Quests redesign; no code changed this session, references only. Draft PR opened on claude/mobbin-ux-references-i142dd. No SQL.

## 2026-07-16 — Email funnel status layer, deliverability hygiene, and config knobs (backend batch)

Built the status aware email funnel end to end on Resend and the database, no
new vendor. lib/email/lifecycle.ts computes a contact's state (lead, trialing,
trial_ending, active, lapsed) from the fields we already hold. The daily cron
now branches on state, not just day counts: a trial ending nudge two days
before a no card trial runs out, a win back a couple of days after a trial
lapses unpaid (held so it never lands the same day as the day 7 founder
email), and a lead nurture (migration 063, starter_leads.nurtured_at) that
sends one come start the trial email to a captured email with no account,
excluding anyone who already has a profile (the converted flag is never set,
so profiles is the source of truth). Nurture stops on payment because an
active member is never in the trial_ending or lapsed state. Deliverability
hygiene: /api/email/webhook suppresses hard bounces and spam complaints
(email_opt_out for members, nurtured_at for leads), soft bounces ignored,
svix verified against RESEND_WEBHOOK_SECRET. Also this batch: the Stripe
checkout can require a Terms tick (consent_collection) behind
STRIPE_TOS_CONSENT env because it needs a Terms URL in the Stripe Dashboard
first; school reminders now reach the child's phone and the parent's inbox
(strong subject, fix it link) not only the parent PWA, aligned across the
morning and evening crons to child appropriate kinds only; the screens gate
(before screens quests locking the timer) is now shown to the parent on the
Quests page; and STAR_MINUTES became a config value (NEXT_PUBLIC_STAR_MINUTES,
default 5) so the exchange rate is tunable without code. Config to set when
ready: run migrations 061, 062, 063; RESEND_WEBHOOK_SECRET plus a Resend
webhook at /api/email/webhook for bounced and complained; Terms URL in Stripe
then STRIPE_TOS_CONSENT=on. All on PR 296, clean and mergeable. The per child
parent set rate and the Quests slice 3 send to child persisted state remain UI
work for the design session, not built in parallel.
## 2026-07-16 — Mobbin polish pass: Quests readability, balance bar, and DiGi as one flowing voice

The Quests redesign (slices 1 to 3 and the child insight surface) had already shipped from a parallel session (PR #293) while this session pulled the Mobbin references, so this session did the "before final polish" the plan deferred to when Mobbin reconnected, plus two live design asks from Justin. Five files, references only where noted, all typecheck clean and screenshot verified in a throwaway harness (deleted before commit).

Quests control centre polish, from the live GoHenry and Greenlight screens the blind build could not see. StarSummary tiles now carry a Greenlight style tap affordance: an interactive tile wears a small chevron and a slight raised look, the static "this week" tile stays visibly calmer, so a parent knows at a glance which tiles act. ScreenBalanceInsight gained the Greenlight split visual: DiGi's age aware text now sits above a slim balance bar showing the recommended screen slice (the age guide minutes) against the rest of a full waking day, with a two dot legend (≈75 min screen for 8 to 10, ≈60 for 4 to 7). It is a shape not a hard split, framed to stay a calibrated steer, never a rule (non negotiable 1). New export WAKING_DAY_MINS and guideMins/bandLabel on the insight return.

Quests copy, Justin flagged the bottom text on the preview was too long. Simplified to the best practice scannable form (Good Inside / Greenlight / BitePal, one idea per line): the Share "how it works and why it is safe" wall of text became a three tick list (Nothing to install, no login, no messages · Only your family holds the link · Stars land only when you approve them here); the "do this first", "hand the quests over" and the top intro paragraphs were tightened to one short line each.

DiGi chat flow, Justin's design session. Pulled Mobbin AI-chat references first (Pi and Dot: the guide flows as plain warm text, only the user gets a bubble; noted in design-refs/digi-chat-mobbin-notes.md). Header eyebrow changed "Your AI advisor" to "Your evidence led guide". The thread now reads like DigiWelcomeSheet: DiGi's reply is one soft butter bubble (terracotta-lt) with its separate thoughts set apart by generous spacing, not the old stack of white boxed cards with drop shadows; warmer Nunito, generous line height, on the cream ground. Only the parent's own message keeps the solid butter bubble on the right. Loading dots and the empty state greeting softened to match; the calm "Reflection saved" footer kept. No SQL. On branch claude/mobbin-ux-references-i142dd (restarted off latest main since the references PR #294 had merged).

## 2026-07-16 — Good Inside menus: the Lessons library as a big card collection

Continuing the Good Inside queue (item 3, the big card collection style through the menus). The Lessons browser already had rich thumbnail cards on the Watch and Printables tabs, but the middle Lessons library tab was a plain compact list, the one clear inconsistency. Pulled Mobbin collection grid references first (Headspace Courses and Singles, stoic Library: a two column grid of big cards, a tinted header block, bold title, meta and a short line) and rebuilt the library list to match: a responsive grid of pastel collection cards, each a stage tinted header with the category emoji, a category eyebrow, the title, a two line key message, and a Start / Run again / Preview action, keeping the done (green) and members (locked) states. New categoryEmoji helper (book default, never the film emoji). Screenshot verified in a throwaway harness at mobile width; typecheck clean. The rest of the Good Inside queue was already built by the parallel session and verified this session: the daily deck is already the focus card story flow, and the lesson player is already the Duolingo one slide story style, so no rebuild was needed there. On branch claude/mobbin-ux-references-i142dd (PR #295). No SQL.

## 2026-07-16 — Good Inside menus continued: Scripts library as a big card collection, DiGi naming aligned

Two more in the same pass. The Scripts library, a core menu the Good Inside brief names, was a plain grouped list; rebuilt it to the same big pastel collection card as the Lessons library (a category emoji in a stage tinted header, category eyebrow, title, the situation as a two line clamp, and an Open / Read again / Preview action, keeping the done, locked and recommended match states). New CATEGORY_EMOJI map (quote mark default). Also aligned the in app DiGi naming to the chat header's "evidence led guide": the onboarding eyebrow and the day three toolkit email line. Left the marketing pages and SEO meta as "AI parenting advisor" on purpose (a deliberate search term), and the internal LLM system prompts unchanged. Screenshot verified the scripts grid in a throwaway harness; typecheck clean. Scripts is the last plain list menu; the child app My Lessons was left as is (freshly reworked into sub tabs, high regression risk for low gain). PR #295. No SQL.

## 2026-07-16 — Child reward pop up: bigger, happier art

Small follow up after the Good Inside sweep merged (PR #295). The design brief had named the child reward pop up (HappyNews) as wanting "bigger, happier art than the current pop up." Bumped it toward the Duolingo ABC warmth: the squad character is bigger (64 to 76) with a thicker ring, the headline is bigger (17 to 19), and the confetti burst is fuller (14 to 18 pieces). Still the same transient bottom pop up that springs up, celebrates and tucks away, just warmer. Standalone component, no logic change, typecheck clean. Branch restarted off latest main since PR #295 had merged; new draft PR. No SQL.

## 2026-07-16 — DiGi rename extended to marketing (pre launch, no SEO cost)

Justin confirmed the child app is good as is and the marketing copy is fine to change since nothing has launched, so the "evidence led guide" reframe now runs across the marketing surfaces too, not just the in app ones: the homepage hero eyebrow, the DiGi feature card title, the pricing line, the join and pathway feature lists, the FAQ answer, the OG and page meta descriptions, and the DigiCharacter alt text. The SEO keyword "AI parenting advisor" became "evidence led parenting guide". Left untouched on purpose: the internal DiGi LLM system prompts (lib/digi/system.ts, safety.ts, insights.ts and the two api routes), which describe DiGi's role to the model and are never seen by a user. Typecheck clean. On PR #297. No SQL.

## 2026-07-16 — Child app: light pastel wash background

Justin wanted the child app off the flat dark espresso and onto a faded pastel combination of our colours, child approved. Pulled Mobbin for child colour schemes first (Kit uses a soft pink lavender pastel, Tolan and Calm Kids a dusk gradient; Duolingo ABC actually a warm dark brown close to what we had). Showed Justin three candidates rendered with real content for contrast; he picked the light pastel wash. Rebuilt the child quest screen (app/k/[token]/KidQuestScreen.tsx): background is now linear-gradient(168deg, #FFF3DC 0%, #FDE7F0 46%, #EAE7FB 100%), a warm butter to soft rose to lavender, and every one of the ~47 white on dark spots was flipped to work on light: headings and body to ink, the glass panels (tabs, fold strip, tip card, device and goal bars, ask more, catch up, nav sub tiles) to solid white or cream with a faint ink border, secondary text to ink-soft/ink-muted. White stays only where it belongs, on the red count badges and the deep teal buttons. Verified the quests and lessons tabs in a harness at mobile width, all text readable, cards separating cleanly. On PR #299. No SQL.
## 2026-07-16 — Rehearsal voice off by default, Stuck for words fixed, DiGi bounce is a click me, daily viewing guide

A run of live red pen from Justin on the parent app, all backend and behaviour
(the Mobbin design session owns the visual polish).

**DiGi voice is off by default everywhere, opt in only.** The Rehearse with
DiGi child voice defaulted on (browser speech), so it spoke unasked and felt
inconsistent with the click to play Skye voice on scripts. Now voiceOn starts
false; the button reads Add voice when off and Voice on when on, and turning it
on reads the child's latest line straight away so the parent hears what they
switched on. Script reader stays click to play, DiGi chat has no audio, so
nothing on the platform speaks until asked. Deeper unify of the rehearsal
browser voice to the generated Skye voice is a later job (dynamic lines cannot
be pre rendered), noted not done.

**Stuck for words now works and is evidence led.** The suggest button called the
model directly with no fallback ladder and swallowed any 404 into an empty list,
so on a bad primary model it silently did nothing. Now it runs the full model
fallback ladder, parses the JSON array or falls back to line parsing, and on a
real empty returns a friendly note the card shows instead of a dead button. The
prompt is rewritten to ground the three lines in the child mental health
evidence (name and validate the feeling first, connection before correction, a
limit with empathy, an element of choice, never a flat no or a lecture). Tapping
a line drops it into the box, then Say it sends it to DiGi.

**Home daily path DiGi is a click me when work remains.** Justin's steer: a
constant bounce is right only when there is still something to do that day, and
then it should invite a tap and take them to it. DiGiCharacter gained a once
prop (one bounce then settle, repeat 0 not -1); TodayPathStrip loops DiGi only
while a step is outstanding (pressure) and now wraps the bouncing DiGi in a Link
to the next task with a 👆 Click me, do this next bubble; when the day is done it
bounces once, celebrates and stops being a button. DigiStreakWidget bounces once
when the streak is alive today, loops only when it needs keeping warm.

**Quests front door buttons land somewhere.** Set tasks, Screen time and Share
app read as broken because Set tasks was a no op when already on the manage tab
and Share switched a tab far below the fold. Now Set tasks scrolls to the quest
list, Screen time to the screen time card, Share to the tabs (new quest-tabs
anchor), each landing visibly.

**Push test is honest about where it landed.** The school Send a test said it
should reach your phone even when the only subscription was the laptop. It now
names the devices it actually reached (platforms) and, when no Apple push
endpoint is subscribed, spells out turning notifications on on the phone itself
(and adding to the home screen first on iPhone).

**Recommended daily viewing, built into the timer (plan: daily-guide-plan.md).**
Age banded soft guide (from screen-balance BAND), read against minutes logged
today. New lib/quests/daily-guide.ts (pure state: recommended, used, remaining,
status under/reached/over) and lib/quests/usage.ts (getMinutesUsedToday, sums
today's device_sessions plus manual star_spends not tied to a session, so the
phone timer and the no phone co view mark both count once). Surfaced: the parent
screen time card shows used vs recommended per child with a treat note when a
grant would go over; the child timer shows a today's screen time bar and a calm
you have had your screen time today pause at the guide, still letting them ask a
grown up for a treat. Never a hard block: the parent holds the real control.
/api/quests/time/active and the child page carry usedToday plus recommended. No
migration. All on branch claude/continue-build-ldot8v.

## 2026-07-16 — Shared notes and scripts land on the child's own app, not SMS (migration 064)

Justin: a note or script we share should appear on the child's phone (their own
app) and be stored to read again, not fired out over SMS, and this delivery
should apply to anything we share to a child; the read together option stays
only for the no phone ages. Built as a reusable system.

- Migration 064 child_shares (id, user_id, child_id, kind note|script, title,
  body, ref, created_at, read_at), RLS owner only, idempotent, flat.
- /api/child-share: POST (parent auth) stores the share and best effort pings
  the child's device deep linked to their own page, returns hasApp; PATCH marks
  a share read from the child's link (token is the auth, scoped to that child).
- The child's app shows a From your grown up card at the top of their page
  (NotesFromGrownUp): the note in warm italic, a Got it thank you button that
  marks it read on the server and folds it away, but it stays in their history.
  The kid page loads the last twelve shares; a missing table degrades to empty,
  never breaks the page.
- The script note card (ScriptDepth) now leads with Send to their app for a
  child who has their link set up (no phone number needed), the note landing in
  their app and pinging their phone. SMS drops to Text it instead. For the young
  ages (foundation, builder) the read together option (bedtime, lunchbox) leads
  and there is no app send. Copy stays throughout. The script page passes the
  child id and whether a kid link exists.

The same POST /api/child-share is the reusable path for sharing anything else to
a child's app later. Owner action: run migration 064.

Voice consistency (item 2): the critical part shipped earlier (voice off by
default, consistent opt in across the platform). True unification of the live
rehearsal voice to the recorded Skye voice is not buildable in app, the Skye
voice is pre generated audio files and dynamic rehearsal lines would need a live
text to speech service (a provider, key and cost decision for Justin). Flagged,
not faked.

## 2026-07-16 — Something else is not a tracked concern, share nudge opens a real printable

Two red pen fixes from Justin.

**Something else is a picker, not a rateable moment.** The daily concern check
in (Still on the list) was showing a Something else row with Better/Same/Still
hard, because the generic catch all was being written to the concerns ledger and
counted (Come up 4 times). Only the specific moment a parent lands on should be
tracked. Fixed at the source and the surface: the moment tagger and the Right
Now rescue no longer log the generic slug (something-else, something_else,
other) as a concern, and the daily check in filters those slugs and a Something
else label out defensively so any old row never shows. The typed Something else
(custom rescue) still logs, because there the label is the parent's real words,
a genuine specific moment.

**The share a printable nudge now opens a real printable.** DiGi's proactive
share nudge deep linked to /dashboard/lessons, so tapping the notification
landed on a hub, not an actual printable. It now points at /dashboard/printables
(a real page of ready to print sheets, which does exist, the PRINTABLES
registry), and the prompt copy names Printables to match. New prompts carry the
new href; old pending ones age out.

## 2026-07-16 — Weekly review shows what DiGi is doing, notifications clear on tap

Two more from Justin.

**Your week with DiGi tells you what it is doing while it reads.** The preview
button sat on Reading for a while with no sign of life. Now, while DiGi builds
the review, the card runs a warm little narrative in DiGi's voice (Just reading
all our chats from this week... Got them, pulling out what actually mattered...
Here you go, shaping the plan for next week...), DiGi shifts to a thinking mood,
so the wait reads as DiGi working, not a stuck button.

**A DiGi notification clears when you open it.** The notifications feed is
derived live, so a DiGi nudge kept showing in the bell even after the parent
tapped it. NotificationCard (new client card) marks a DiGi prompt acted on tap
(keepalive fetch, so it lands through the navigation), and the feed only shows
pending, so it is gone from the count next look. The action notifications
(approve, a child's ask, school) still clear only when the parent actually does
the thing on the target page, so a stray tap never loses one.

## 2026-07-16 — Two transient messages now ease away instead of lingering

Justin: nothing that has said its piece should sit on screen forever.

- The Mid meltdown coach mark on the Help now button now eases itself away after
  two minutes (and counts as seen so it does not pop again), rather than waiting
  for the parent to close it. The X still dismisses it early.
- The Reflection saved, DiGi will use this tomorrow line in the DiGi chat now
  shows for about four seconds after a reflection saves, then fades, via a
  separate reflectionToast state so reflectionDone stays true and the prompt
  never resurfaces.

## 2026-07-16 — Weekly school routines: clear for today, keep the reminder (migration 065)

Justin: clearing a weekly reminder (PE kit) should clear it for today only, not
delete the routine, with a delete for when they really want it gone. Two things
were wrong: a recurring routine showed in the notifications bell every single
day (not only its weekday), and the only clear on it was Remove, which deleted
the whole routine.

- Migration 065 adds school_actions.cleared_on (date). Clearing a routine for
  today stamps cleared_on = today (server side); the row stays open and comes
  back next week.
- /api/school/actions PATCH takes clear_today: true and stamps cleared_on;
  done / dismissed still end a one off or delete a routine.
- The notifications feed (collect.ts) now shows a recurring routine only on its
  own weekday, and holds it back once cleared for today, so it never nags daily.
- The school card shows Clear for today on a routine on its day (it stays in the
  Every week list, marked Cleared for today), and Remove became Delete for
  ending it for good.
- The child's From school banner also respects cleared_on, so a cleared routine
  steps back from the child's screen too. The Home Screen app badge already
  ignored recurring routines, so no change there.

## 2026-07-16 — Screen balance insight is now real, moving data

Justin: the balance bar was a fixed age guide (always about 75 min for 8 to 10),
he wanted real data, a level that moves with the minutes used and the tasks
done, and bigger and bolder.

Rebuilt ScreenBalanceInsight into a live balance level. The two sides are the
star economy's own exchange rate made visible: screen minutes actually USED
today (from getMinutesUsedToday, now returned per child by /api/quests as
usage) against real world minutes EARNED today (stars approved today times
STAR_MINUTES). The needle sits where the balance tips: green and calm when real
life is ahead, tipping to screen with a nudge when screen leads, a calm midpoint
when the day is empty. Bigger heading, a bold 22px bar with a moving needle, and
the two figures called out. The age guide stays as a small mono context line.
QuestManager passes usedTodayMinutes and earnedTodayStars (today's approved
ticks). No migration.

## 2026-07-16 — Bell updates on clear, school reminders clear in place and mirror to the child

Justin, on the notifications bell and the school reminder card.

**The bell re-counts the moment something clears.** NotificationsBell only
fetched once on mount, so the red number sat stale after clearing. It now
re-fetches on a gc:notifs-changed window event, on focus, and when the tab
comes back into view. Every clear dispatches that event, so the count drops at
once.

**A school reminder clears in place, acknowledged not deleted.** The
notification card no longer just links to the school page. A weekly routine
(PE kit) shows Clear for this week, which acknowledges it (cleared_on = today,
kept for next week); a one off shows Got it, clear (done for good). The card
folds away and the bell updates, with a quiet Open school link for full manage.
collect.ts carries a recurring flag so the card knows which. DiGi cards also
fire the event as they mark themselves acted.

**The routine mirrors to the child's app by default.** A child appropriate
weekly routine (kit, event, homework) now shows on the child's From school
banner on its day without the grown up needing to tick anything, and steps back
once cleared for the week; parent only kinds (a payment) never reach the child.

All on branch claude/continue-build-ldot8v (PR 300). No migration (uses the
064/065 columns already there).

## 2026-07-16 — Child quests: live approval, clear waiting state, done falls off

Justin, on the child app: when a child ticks a quest it is out of their hands
(waiting on the grown up), the yes should land live, be obvious, and the quest
should fall off the list once done, so the flow makes sense.

- New GET /api/quests/tick?token= returns today's tick status per quest (token
  is the auth). The kid screen polls it every 12s and the moment the tab comes
  back, so a Waiting quest flips to Done without a refresh, and a squad friend
  springs up (Your grown up said yes! plus the minutes earned) the first time
  an approval lands.
- The list is now three clear groups: what is still theirs to do, then Waiting
  for your grown up (a dashed terracotta card, an hourglass, With your grown up
  now, nothing to do, so it plainly reads as out of their hands, not done), then
  a folded N done today. The to do count is untouched quests only, so waiting
  never reads as still to do, and an approved quest drops straight into the
  folded done group.

On PR 303 (continue-build-ldot8v). No migration.

## 2026-07-16 — The approve loop is live both ways

Closing the loop started with the child live approval. The parent side updated
only on reload, so a child ticking a quest did not show until refresh.

- The Home quest board (QuestBoard) now polls every 15s and refetches on focus
  and when the tab is looked at again, so a fresh pending tick appears without a
  reload.
- The Waiting on you banner does the same, in sync with the bell via the
  gc:notifs-changed event, so the red count and the plain English summary stay
  live.
- Approving on the board fires gc:notifs-changed, so the bell and banner drop at
  once, and the child's own app hears the yes on its next poll (the loop from the
  earlier child live approval work).

Whole flow now: child ticks, parent sees it live and approves, child sees the
yes live, and it falls off both lists. On PR 303. No migration.

## 2026-07-16 — The child My week chart, made obvious

Justin could not read the old My week chart (variable height pills with floating
numbers read as noise, not progress). Researched the kid reward loops we lean on
(Finch, Duolingo streaks, GoHenry): the pattern that lands with children is a
show up streak, not a bar chart.

- KidWeekChart is now a week strip: one circle per day, filled gold with a star
  for a day they earned something, an empty dashed circle for a quiet day, today
  ringed. A plain headline frames how many days they showed up (A fresh week let
  us go, Great going N days this week, Amazing N days this week). The green line
  stays: stars earned equals minutes of screen time, so the reason to show up is
  right there. Reads at a glance for a young child, no numbers to decode.

On PR 303 (continue-build-ldot8v). No migration.

## 2026-07-16 — Agreed quests drop off the parent board

Justin's board expanded a child and showed every quest done today as a growing
pile of Done rows, so what was still to do got lost.

- The expanded child list now leads with only what is still to do, big and
  tappable. The agreed (done) quests fold into a quiet dashed N done today line
  a parent can open if they want the detail, so the list never grows into a wall
  of Done. When nothing is left, a single All done for today line shows instead.

On PR 303 (continue-build-ldot8v). No migration.

## 2026-07-16 — Stuck for words is fixed and expert grounded

The rehearsal Show me options button kept dying with DiGi could not think of
options just now. Root cause: suggest passed the rehearsal messages straight
through, so the conversation ended on the child's line and the model carried on
IN THE CHILD'S VOICE instead of coaching, then parsed to nothing.

- Suggest now builds its own single coach turn: the recent exchange folded into
  context, then a plain ask for three lines as JSON. It never ends on the child.
- The prompt is grounded explicitly in the expert playbook we stand on: Dr Becky
  Kennedy (connection before correction, two things are true), Sue Atkins (the
  calm confident boundary), emotion coaching (name the feeling first), and a real
  element of choice. So the pre filled lines are strategic, not generic.
- The button can never die again: if every model fails, it returns three expert
  grounded lines built from the script itself (validate the feeling, the script's
  own say this line, offer a way forward together). A noDashes pass keeps every
  suggested line dash free.

On PR 303 (continue-build-ldot8v). No migration.

## 2026-07-16 — The Friday round up, made clear and expert grounded

Justin: the weekly page is the first thing a parent sees, so it has to be clear
and premium, and it should relay the expert guidance we stand on, week by week,
tidy and easy to follow. Rebuilt the weekly review card around four things:

- A balance score front and centre. A real 0 to 100 read of the week's screen
  minutes against the evidence based healthy guide for the children's ages
  (recommended daily minutes times seven), softened when screen was earned back
  through real quests. Big number, a moving level, and one honest line.
- This week's wins, gathered from the family's own numbers: stars earned and the
  minutes they bought, the quest they leaned into, days shown up, calm moments
  handled. Best first, top three.
- One line of guidance from the experts, chosen by this week's shape and
  attributed (Dr Becky Kennedy, Sue Atkins, emotion coaching). This is how the
  science gets relayed into the update every week.
- Worth a glance, where each item now links to the thing it is about (Quests for
  a screen tip back, School for open reminders, Check in for a flagged watch for).

New pure helpers weekBalance and expertWeekTip live in lib/quests/screen-balance
(client safe). gatherWeek now also reads age bands and calm moments handled. No
migration, the review stats JSON already carries it.

On PR 303 (continue-build-ldot8v). No migration.

## 2026-07-16 — The Sunday wellbeing check in, and DiGi's agreed weekly plan

Justin wants DiGi to proactively check in on a Sunday: ask how the PARENT is,
what went well, what was hardest, and what they want next week to feel like, then
hand back a plan grounded in the experts and the family's data, so DiGi keeps
advising week by week. Built as a stepped card (his pick), with the agreed plan
living on Home all week (his pick).

The five questions, the intelligence we need to direct a plan:
1. How are YOU this week (1 to 5). The mission made real, the parent's own wellbeing.
2. What went well (quick chips). Gathers the week's successes.
3. What felt hardest (concern chips, mapped to the ledger so DiGi carries it on).
4. What do you want next week to feel like (calmer mornings, less screen battle,
   more connection, better sleep, feeling calmer myself). The direction.
5. DiGi's plan: one to three small evidence based steps tied to the answers,
   attributed to the experts (Dr Becky Kennedy, Sue Atkins, emotion coaching).
   The parent taps Agree.

Once agreed the plan sits on Home as a This week with DiGi strip all week, right
above the Friday round up, closing the loop. Reuses wellbeing_checkins (parent
mood plus the concern ledger already wired to it); migration 066 adds week_start,
went_well, focus, plan, plan_agreed and a unique index for the weekly upsert.
generateWeeklyPlan runs the DIGI_MODEL fallback ladder with a deterministic,
attributable fallback so the plan is never empty and never carries a dash.

Files: supabase/migrations/066_weekly_checkin_plan.sql, lib/digi/weekly-plan.ts,
app/api/wellbeing/weekly/route.ts, components/digi/SundayCheckIn.tsx, mounted on
dashboard Home above the round up. On PR 303 (continue-build-ldot8v). MIGRATION 066.

## 2026-07-16 — Home popups no longer stack on load

Three popups (the DiGi welcome sheet, the setup unlock toast, the Now coach mark)
all fired the second Home loaded, landing on top of each other. Justin wanted a
clean login, then a quick gentle alert about a minute in, not a pile.

- New tiny shared lock, lib/ui/popupQueue: a session scoped flag so only one
  popup is ever up, plus staggered base delays (welcome 60s, toast 63s, coach
  66s). whenClear waits out the delay then holds until nothing else is up.
- The welcome sheet now greets about a minute after login (still once a day), and
  takes the lock while open. The toast and the coach mark wait behind it and show
  one at a time once it is dismissed. All three release the lock on close.
- Frequency is unchanged and gentle: welcome once a day, toast once per unlock,
  coach mark once ever with its two minute auto dismiss.

On PR 303 (continue-build-ldot8v). No migration.

## 2026-07-16 — The child's balance strip on their own app

Justin: the child's top bar should show family help against screen watched, on
track or not, the same balance logic as the parent, highlight the week's jobs,
and give a productive way to ask a grown up for more. And better colours than the
wall of gold.

- New KidBalanceStrip sits under the star bank: a two sided level, green for the
  real life jobs they earned today (stars times minutes) against gold for the
  screen watched today, with a needle and an On track / Screen is ahead pill.
- A week highlight chip in sage: N stars earned from jobs this week, minutes
  watched beside it.
- Be productive, always a door open: a teal Ask for a new job button that rides
  the existing askForMore ping to the parent. It shouts a little louder (Do a job
  to balance it) when screen has pulled ahead, and turns to Asked once sent.
- Colour: green (real life), gold (screen), teal (the action), sage (the win),
  so the child's screen is no longer one flat block of gold.

On PR 303 (continue-build-ldot8v). No migration.

## 2026-07-16 — Colour pass on the child app top section

The child's top was a wall of gold, led by a solid gold star bank block. Reworked
it into one cohesive set of premium cards on the pink background.

- Star bank is now a white card with a gold star medallion and a gold left accent,
  not a flat gold fill. The number and minutes read in ink, the earned this week
  line picks up teal, and the streak sits in its own warm flame chip.
- With the balance strip below it (green real life, gold screen, teal action, sage
  win) the top column now carries gold, green, teal and sage instead of one note
  of gold, and the single bold gold CTA (the to do signpost) stands out again.

On PR 303 (continue-build-ldot8v). No migration.

## 2026-07-17 — Sunday check in is Sunday only, child app tidy ups

- The Sunday check in now only appears proactively on a Sunday. The rest of the
  week it stays quiet (the agreed plan still shows all week once set), so Home is
  never cluttered with a card there is nothing to do with yet.
- Child app: a redeemed reward can be ticked off (Got it, tick it off) and drops
  away, remembered on their device, so a finished goal never lingers.
- Child app: a new Our family deal popup, a quiet link the child can open any
  time to keep an eye on the deal (jobs earn stars, stars buy screen time, a good
  amount a day, and what they are saving for). The kid app is token based and does
  not load the parent's signed agreement, so this is the deal in the child's own
  words, self contained.

On PR 303 (continue-build-ldot8v). No migration.

## 2026-07-17 — Launch build 1: the readiness passport made visible (Rec 1)

The daily loop barely referenced the whole point (ready at 16, no cliff edge).
New lib/content/readiness.ts holds the passport stamps, one named competence per
stage (Steady stops, Healthy habits, How it works, Real footprint, Ready), each
with what it builds toward, plus the measured science (Candice Odgers, Amy Orben,
Cambridge, the digital passport idea): balance and competence over a countdown,
deliberately not the moral panic line, Haidt left out per Justin.

- Pathway page now shows the current stage's stamp (what it builds and toward
  what) and a Why this works science card.
- The Friday round up ties the week back to the pathway: this stamp, one step
  nearer ready at 16, linking to the pathway.

Marketing page is the mobbin session's lane, so its version of this narrative is
handed off below, not built here. On PR 303. No migration.

## 2026-07-17 — Launch build 2: the smartphone contradiction, answered (Rec 2)

The fair charge is that a screen reduction brand shipped an app for a young
child's phone. Answered in the product, not just in words, and in line with the
never police rule.

- Under 11 (Foundation and Builder, 4 to 10) now defaults to co-view: parent led,
  done together on the parent's device, no child device. Was 4 to 7 only.
- Own device stays a free opt in. The setup copy leads with co-view as the
  evidence aligned recommendation, and frames own device as the parent's call for
  an older child who already has one. We point the way, we do not police.
- OUR_STANCE added to lib/content/readiness and shown as a card on the pathway:
  we do not put phones in children's hands, and the choice is always yours.
- Real life as the counterweight already ships as the child balance strip; the
  stance and the co-view default push the framing further toward earned and
  balanced rather than a screen wallet.

On PR 303. No migration.

## 2026-07-17 — Launch build 3: marketing narrative handed to the mobbin session

The marketing page is the mobbin session's lane, so rather than build it here (two
sessions on one page is the duplication trap), the launch narrative is written up
in plans/marketing-brief-launch.md for that session to apply: one hero promise
(get them ready for the phone, no cliff edge), how we do it (the passport steps),
the measured science (Odgers, Orben, reuse WHY_IT_WORKS), and the stance (reuse
OUR_STANCE). All three content blocks live in lib/content/readiness.ts so the site
and the app never drift.

On PR 303. No migration.

## 2026-07-17 — Child picks their buddy and colour (option 3, not gender)

Instead of asking a child's gender (more data than we need, and stereotyping),
the child personalises their own app. Migration 067 adds children.buddy and
children.accent. A Make it mine sheet on the child app lets them pick a DiGi
squad buddy (DiGi, Oliver, Sofia, Zara) and an accent colour (sunshine, grass,
ocean, coral, berry). Their buddy greets them in the tip card, the accent takes
the star bank and the buddy ring, saved to their record via a token authed
endpoint. No gender collected anywhere. MIGRATION 067.

## 2026-07-17 — Tailor by concern (option 2) and school email coming soon

- Option 2: the pathway now tailors the current stage by the concern the family
  actually flagged, not by the child's sex. The top open concern maps to the
  stage's own action for it (For your family right now), so a parent worried about
  gaming and one worried about comparison get different guidance. The honest,
  precise version of a boy and girl pathway, with no gender data.
- School email forwarding is marked coming soon for launch (complex, to go live
  with the Apple app wrap). The whole SchoolSetup email flow is replaced by a
  coming soon card. The manual weekly routines (SchoolActionsCard) stay live and
  do the everyday job. Nothing was deleted, only hidden behind coming soon.

On PR 303. No migration.

## 2026-07-17 — DiGi welcome carries an occasional named social insight

After the first few greetings, and only now and then (every third, rotating
children), the DiGi welcome sheet adds one age relevant social media insight
named to a child, grounded in Candace Odgers (what the data shows) and Catherine
Knibbs (the psychology, the trusted adult). New lib/content/social-insights.ts,
age banded, calm, never alarmist. The welcome sheet now takes children with age
bands so it can name and age target. This keeps a gentle check on social media
running through the platform, including 16 plus (the platform keeps supporting,
does not stop at 16). On PR 303. No migration.

## 2026-07-17 — Multi child: honest state (audit)
Quests, stars and the pathway map handle several children. But most coaching and
content surfaces (DiGi chat, daily practice, scripts, right now rescue, tracker,
wellbeing, agreement, lessons, printables, Home) are anchored to the PRIMARY
child via is_primary. So a family with more than one child gets per child quests
and pathway, but one shared coaching context on the primary child. Full per child
coaching everywhere is a real post launch workstream, not a launch week fix.

## 2026-07-17 — Consolidation pass: fewer cards, calmer surfaces

Answering the honest read that the app had grown busy. Removing and folding, not
adding. Multi child functionality (per child quests, stars, links, pathway) left
intact; only coaching stays primary child as agreed.

- Pathway: the two big cards added this session (the science and the stance) are
  folded into one PathwayEvidence card, collapsed by default, one tap to read. The
  pathway is a next step again, not a research brochure.
- Child app: the star bank and the balance strip are merged into one block (stars
  and streak on top, the balance meter, week jobs and earn more below), so the top
  of the child app is one calm card, not two.
- Parent Home: already hero led (Today's Path plus a tidy tile grid), so no risky
  reorg. The weekly review preview offer now only shows from Thursday on, so it is
  not one more card every day.

On PR 303. No migration.

## 2026-07-17 — Next build lined up: stage the reveal (onboarding)

The remaining lever on "too much" inside the product. Full spec in
plans/onboarding-reveal-plan.md: a soft reveal (never a hard lock) where a new
account meets a one loop Home first, and DiGi introduces the rest one calm card at
a time over the first fortnight, plus a lighter first run setup. Migration free
for v1 (account age plus localStorage). Ready to run on Justin's word; not started.

## 2026-07-17 — Built: stage the reveal (onboarding calm start)

A soft reveal, never a hard lock, driven by account age so no migration. A new
parent meets a one loop Home; the rest opens over the first fortnight.

- lib/onboarding/reveal.ts: the schedule (moments day 3, lessons day 6, pathway
  day 9, wellbeing day 12), keyed by days since signup. Established accounts (and
  any unknown age) reveal everything, so nothing regresses.
- components/onboarding/RevealCard.tsx: a DiGi New card announcing the newest
  unlocked feature once, seen tracked in localStorage.
- Home now gates by reveal: the Sunday check in and weekly round up wait for day
  12, the Keep going tiles start with just Ask DiGi and Set up and fill in as
  features unlock, and DiGi prompts, smart alerts and readiness wait for day 3.
- Everything stays reachable in the tab bar throughout; the reveal only controls
  what Home promotes.

On PR 303. No migration.

## 2026-07-17 — Child screen simplified, icon led (Greenlight style)

Justin: the child screen was way too messy, an adult analytics dashboard, not a
kid's app. Stripped it right back, using Greenlight as the reference.

- Removed the analytical balance strip from the child home entirely (the real
  life vs screen meter, the on track pill, the two sided labels, the week stats
  line, the dark ask button, and the dead KidBalanceStrip component). The balance
  stays a PARENT tool, where it belongs, not something a young child reads.
- The star card is now just the stars, the minutes, and the streak.
- The whole child path is now four clean icon tiles, Greenlight style: a white
  card, a rounded colour icon square, a bold title, one short line. My jobs, Use
  my time, New job (asks a grown up), Our deal. Big, few words, obvious to tap.
- Our family deal moves from a text link into one of the tiles.

On PR 303. No migration.

## 2026-07-17 — Insights board hardened, plus a product pulse

The founder insights board looked broken pre launch because it only mined DiGi
chats, and there are none yet. Two fixes.

- Product pulse: a new founder only aggregate read across all families
  (/api/admin/product-pulse), loaded on open, de-identified counts and sums only.
  Families and children, active this week, quests set and done, screen minutes,
  check ins and average parent mood, plus a stage breakdown. So the board is
  useful from day one, and it is the general data gathering for deciding what to
  build and watching product health week to week.
- Empty states: the DiGi insight run now says plainly when there are no
  conversations in the window yet, and the pulse says when there are no families
  yet, so nothing reads as broken before launch.

Founder only throughout (gated on FOUNDER_NOTIFY_EMAIL). On a new PR off main.
No migration.

## 2026-07-17 — Red pen pass, then device time, positive screen time and the wisdom pop

A run of mobile review fixes and three agreed builds. All on branch
claude/continue-build-ldot8v, PR 317. No migrations.

Red pen fixes:
- The home daily strip now counts the day done by minutes actually invested
  (a real weight per step), not two quick taps, so the "your X minutes" claim
  is true. The road to 16 stops ticking earlier stages by age; they read as
  catch up foundations with a line that nothing is done because of age.
- The Together share choice flips instantly and surfaces the co view launch,
  no dead reload. School reminders now prompt the day before on the child's
  own screen (a calm get it ready tonight heads up) and show a Tomorrow tag on
  parent routines, matching the night before push.
- Notifications made actionable: clearing a school item now tells the bell to
  recount at once; the child's things to do pop is a doorway (Show me jumps to
  the to-do, and the DiGi line stays tappable every open); and the child
  printable ask that reached notifications but could not be opened is fixed
  (the locked family wording "Please can I do the X printable" now resolves to
  the real sheet and print link, same as "Print the X sheet").

Agreed builds:
- Screen time is never a debt. Justin floated a negative balance; we chose the
  positive version instead. With no stars, the Use my time tile is a warm
  doorway to earning (do a job, then swap for time), never a minus number or a
  dead lock. Keeps the calibrated, never punish spirit and the earn loop.
- Device timer parent signal: start already pushes the parent and shows a live
  shared countdown; the end of timer push already existed. Added the daily
  allowance signal: when a session ends and the child has reached the healthy
  daily amount for their age, the parent push says so calmly (their stars keep
  earning for tomorrow), distinct from a plain timer up.
- The wisdom pop (child): on a quiet open, a squad friend brings one age
  relevant idea about screens and wellbeing from the child science bank
  (lib/content/child-insights.ts, traceable to Odgers, Orben, displacement
  science), and sometimes points at a fun sheet. A treat every few days, never
  every day. Parent wellbeing is already research grounded through the DiGi
  welcome (social insights, Odgers and Knibbs) and the parent_care nudges
  (expert_knowledge normal_moments), so the wellbeing tips run on both sides.

## 2026-07-17 — Lessons reachable on mobile: a DiGi lesson nudge

On a phone the bottom bar has five fixed slots (Home, Scripts, DiGi, Quests,
Progress) and the old scrolling top strip was removed, so Lessons had no nav
tab at all, only the Home Keep going tile once lessons are revealed. Rather
than crowd the bar, DiGi brings the lesson to the parent.

- New DigiLessonNudge card on Home: one age relevant watch together film the
  child has not seen yet, offered with the same two real choices as the hub,
  Watch together here (co view) or Send to their phone (the ping). Dismissible
  for the day so it is an offer, not a nag. Reuses the existing LessonSendButton
  and the together co view route, no new endpoints.
- Picks the closest unseen film at or below the child's stage, earliest step
  first. Only shows once the lessons reveal has opened for the account.
- The existing Home Lessons tile stays as the always there path. No change to
  the five slot mobile bar. No migration.

## 2026-07-17 — A benefit email for each service (the service drip)

The onboarding emails sold the platform in general (welcome, stage, tour, DiGi,
founder) but no single email sold each service's benefit and drove its setup.
Added a gated service drip in the daily email cron.

- New benefit emails, one per service, Justin's voice, no dashes: the child's
  own app (day 9), earned screen time via quests (day 11), watch together
  lessons (day 13), school reminders (day 15), the family agreement (day 17).
- Each is GATED: it only sends when that service is not set up yet (no kid
  link, no active quest, no lesson completion, no school connection or action,
  no agreement), so a parent who has set it up is never nagged, and the setup
  signal is only queried once the day and the email_log both allow it.
- Idempotent through email_log like the rest, keys svc-childphone,
  svc-screentime, svc-lessons, svc-school, svc-agreement. No migration.
- Device time rides inside the screen time email; printables and the wellbeing
  tracker are the remaining services without a dedicated email (they have no
  clean setup gate), easy to add if wanted.

## 2026-07-18 — DiGi knowledge bank: directory, and a self growing research updater with a human gate

Justin wanted the evidence bank visible, and a way for it to grow itself from the
latest research in line with our thinking, without ever losing credibility.

- Directory: a founder only view on the insights board of every researcher,
  expert and body in expert_knowledge, grouped by source with topics, age bands,
  a sample finding and a link. The bank already holds Odgers, Orben, Przybylski,
  Livingstone, Knibbs, Dr Becky, Damour, NHS, NSPCC, NICE, UKCIS, Internet
  Matters, Anna Freud, Cambridge and more.
- The research updater (cron/knowledge-refresh, 1st and 15th of the month): reads
  what parents have asked (digi_questions), drafts up to six candidate findings
  from real, credible sources that fit the educate not ban pathway, tries web
  search then falls back to model knowledge, and drops them into a review queue
  (expert_knowledge_candidates, migration 068) as PENDING. It emails the founder
  when new candidates land.
- The human gate: nothing reaches the live bank until the founder clicks OK on
  the insights board (promotes into expert_knowledge) or rejects. This is the
  guardrail against a fabricated finding ever entering under a real name. Never
  auto publish.

## 2026-07-18 — Make it mine recolours the whole child screen

The child app background is no longer a fixed pink/purple gradient (which also
broke the no purple gradients rule). Make it mine now sets the whole background,
not just the ring, from a colour bar with a live preview. Default is a premium
dark anthracite (graphite). Themes: graphite, ocean, grass, sunshine, coral,
berry, each with its own on background ink so text stays readable. The shared
--kid-bg default (lesson, adventure, game screens) is now the anthracite too.
Saved via the existing children.accent field, no migration.

## 2026-07-18 — Child app celebrates balance, not screen time

The child home no longer leads with screen time. The star bank, today usage and
use my device time are one balance card whose hero line is the healthy balance
of jobs done against screen used, plus the job streak. We never push device use;
we celebrate balance and gently nudge jobs when screen runs ahead. Full vision
(Duolingo nudges, monthly offline pushes to lessons/printables/connection, a
balance reward score, the science) is in plans/balance-first-child.md, to build
next on Justin go.

## 2026-07-18 — Parent set daily screen time limit

children.daily_limit_minutes (migration 069, nullable). Null uses the age based
recommendation. Parent sets it in the quest manager (per child), where the age
recommendation is always shown so they do not set it higher by accident. The
child app shows used against this number (X of limit) and the device time picker
never offers past what is left of it today, so a day never runs beyond the cap
even when stars have banked up. Bank total (minutes ready) is separate from what
is usable today.

## 18 July 2026 — first pass on the two Mobbin lane items (hand to Mobbin to finish design)

Countdown to offline fun: the child device timer's last ten seconds are now a
happy countdown, not an alarm. A soft rising blip each second, a warm spoken
line at ten ("Ten seconds. Time to find some offline fun."), and a gentle spoken
three, two, one, all via Web Audio and Web Speech so there are no asset files.
The number turns terracotta, a party emoji bounces, and a friendly line comes
up. Time's up copy reframed to "Time for offline fun!". Handed to Mobbin to
settle the exact voice, wording and motion.

Make it mine, mix your own colour: the colour bar keeps the six named pastels
and adds a hue slider under them. Any hue becomes a soft wash the same gentle
way as the set ones (light background, dark ink, deeper accent). Stored as
h<hue> (0 to 360), validated bounded in /api/kid/buddy so it is never arbitrary
data. resolveTheme in KidQuestScreen turns a named id or an h<hue> into the full
theme. Handed to Mobbin to finish the visual of the slider itself.

## 18 July 2026 — comprehensive moments library by age (migration 073)

Added 26 moments to the daily_moments library, by canonical age band (4-7, 8-10,
11-13, 13-15, 16+) and across all seven categories, to sit alongside the existing
set. Grounded in mainstream child development and child mental health practice and
in the spirit of Dr Becky Kennedy (connection before correction, good inside), Sue
Atkins (calm routines, warm authority) and Catherine Knibbs (the online world
through a nervous system and safety lens). No allow or deny: every opener leads to
a calibrated pathway. No dashes in any copy. Uses the canonical age vocabulary so
it matches children.age_band directly, and the range overlap matcher covers the
older 8-11 style seed too. Icons are emoji placeholders: the Higgsfield
illustrations, in the Happy News style, are the Mobbin lane, briefed separately.
Idempotent insert, guarded by title.

## 20 July 2026 — the narrowed daily flow ships on the real home (PR 397)

Justin approved the ref-daily-flow sample, so the real parent home now has
one shape every day: DiGi greets in one sentence (road position plus today's
minutes), the streak chip sits right, THE one card names the one next step
(same getTodayLoop engine, the minute weights and minutes line copy moved to
lib/pathway/today-loop-copy.ts so server and client count the day the same
way), and everything else folds to slim rows. Family quests row carries a
live N to approve badge; from age 8 to 10 with no kid link yet it also
carries the QR handover nudge to the quests Share tab. Sunday adds the round
up row. Nothing was deleted: the quest board (with the goal bars) moved to
the top of the quests page with its quest-board anchor, the full road strip
stays on the pathway page, literacy strand ticks stay on the pathway and
Progress pages, and the quieter cards (moments grid, insight, alerts,
readiness, school, DiGi extras, upgrade) live inside a folded Everything
else row on home. The road primitives also scaled up Duolingo style:
StageDot 64 default (56 kid, 44 mini) with the 0 5px 0 coin edge on every
state, thicker dotted trails, larger labels, and a sticky stage and stamp
chip on the pathway page while the road scrolls.

## 20 July 2026 — the daily path and the road go Duolingo sized (PR 397, second pass)

Justin sized the direction: the daily path must be big like the Duolingo
pathway as the stem of what to do next, and the road to 16 as big as fits
Duolingo clarity. The one card with four dots is superseded by the big
vertical winding path (TodayPathBig: same getTodayLoop engine, same minute
weights from lib/pathway/task-minutes, same copy, 68px pressed edge nodes,
green ticks, DiGi beside the pulsing current node, the Go callout riding
next to it, big icon minute chips). The pathway road is the page hero now:
84px stamp nodes on a thick winding trail, sticky butter position card
(stage plus stamp of 5), trophy at the end. The timer pops up on Home only
when relevant: a live countdown row or a pending ask row, tap through to the
full card on Quests, silent otherwise. Nothing dismantled: the quest board
kept its move to the top of the quests page with the quest-board anchor, the
kid handover prompt rides on Home and the quests page from the 8 to 10 band
until a kid link exists, and every quieter Home card still renders inside
the folded Everything else row, with the check ins prompt kept outside the
fold so its setup anchor never lands on a closed drawer.

## 20 July 2026 — Booked: the lesson library grows on a rhythm
Justin confirmed the test layer replaces nothing: the 20 age staged Rosenshine
lessons and their hand drawn art stay permanently, new lessons only add rows.
BOOKED for the next build week: a lesson writer pipeline in the style of the
fortnightly script writer (PR 355), producing new Rosenshine lessons by stage
on a steady cadence, research grounded, with choice questions so every new
lesson is testable on arrival, into a review queue before going live. Also
carried: age right lessons surfacing in the child app with the child taking
the multiple choice themselves, passes flowing to the parent ticks.
Also booked with it: the lesson player presentation upgrade, slides better
than PowerPoint. One player build lifts every lesson at once since slides are
data: full bleed one idea slides, huge Nunito 900 type, GSAP slide
transitions and staggered reveals, a thin butter progress bar, DiGi popping
in as the presenter on digi slides, house style illustrated diagrams per
concept, choice slides as tactile moments with instant warm feedback, swipe
and arrow key navigation. No new content format needed, the jsonb slide
types already carry it.

## 20 July 2026 — Kid app: one Today list, the timer rule, gifts with a pay back, the age based contract
Justin's brief for the child screen. One: the three competing to do surfaces
(the Daily Three, the My jobs tile, the separate My to do today list) merge
into ONE Today list at the top of the kid screen: family jobs due today plus
Learn and Move, each with its stars, ticked in one flow. The engines stay
untouched (localStorage day record for Learn and Move, quest_ticks for jobs);
this is presentation unification. The tile grid below keeps only what is not
a to do: Use my time, My road, Our deal, Make it mine, New job. Two: the
device rule reads in child words wherever a device would be used: "Any screen
goes through my timer. Do jobs, earn stars, start the timer." Three: a parent
can gift screen minutes that debit jobs later (migration 080, gift_debts);
the child sees one warm owed row and the next approved quest tick settles the
oldest debt. Never shame, the pay back is saying thanks. Four: an age based
one screen contract on the kid link first run, wording by age band, one big
I agree button; acceptance locks in on kid_links (agreed_at, agreed_level in
migration 080) and is visible read only to both sides afterwards. DiGi
context reads it later in a separate change Justin owns.

## 20 July 2026 — The lesson player build carries the schools wow brief
Four moves folded into the booked player upgrade: wear Rosenshine openly
(phase labels, retrieval named), map every lesson to Education for a
Connected World strand plus Key Stage plus PSHE link as visible badges
(the Ofsted personal development evidence), the cinematic player as
booked, and a whole class 16:9 projector mode of the same player with
per child pass data as exportable progress evidence. Parents buy the
outcome, schools buy the evidence, same rows serve both.
CLARIFIED by Justin same day: the family app lessons are NOT the school
product. The app version teaches in a warm parent and child facing way and
serves as the reference point schools see; the real academic depth is
reserved for the school curriculum (schools/01, docs/09) as its own deeper
tier. The whole class mode and curriculum badges therefore showcase and
point toward the school curriculum rather than exposing the family lessons
as the full school offer.

## 2026-07-20: DiGi device check ins (PR #412, migration 082)

From real parent feedback (the birthday Switch, the sons always on the
Xbox): DiGi now checks in about device battles per child, from that
child's actual device_sessions data, not generic questions. Decisions:
signals computed live from the last 14 days (no usage copied anywhere),
prompt bank lives in one lib (lib/digi/device-checkins.ts), one check in
per child per week at most, strongest signal first, deduped against open
concerns, Not really quiets that prompt for three weeks. Yes this is us
opens the DiGi chat prefilled through the existing q param. The card and
the generic DiGi wondering share the same gap key so DiGi never asks two
questions in one visit. Migration 082 (digi_device_checkins) claimed in
the PR title; 081 belongs to the ask first PR #408. If the table is not
migrated yet the surface stays silent rather than breaking its promises.

## 20 July 2026 — The cinematic player ships, one build lifting every lesson (PR #419)

The booked player upgrade landed as one rewrite of components/lessons/
LessonPlayer.tsx, so every surface that renders slides (parent lessons, AI
modules, educator teach, kid star lessons) upgraded at once. Decisions:
the player is now a full bleed cream takeover with a thin butter progress
bar, huge Nunito 900 headlines, GSAP slide transitions plus staggered
data-reveal builds, swipe and arrow key navigation. Rosenshine is worn
openly: a quiet mono phase label on every slide (the starter phase says
RETRIEVAL, because that is what it is) and both near miss screens frame
the retake as retrieval practice. Choice slides went tactile (big pressed
edge answers, instant warm feedback, GSAP pop); the 70 percent pass system
and lesson_completions semantics are untouched. Curriculum badges are an
honest derivation in lib/content/curriculum-badges.ts: Key Stage from the
stage (Explorer says KS2/3, no rounding up), Education for a Connected
World strand from the category, one small mono chip each on the intro
slide and the hub tiles, no overclaiming. The child app gained My lessons
(/k/[token]/lessons): the age right stage lessons on the kid dark theme,
the SAME player as a light takeover, teacher scripts stripped server side,
the parent paywall honoured (one free taste per stage), and completion
writing through /api/kid/lesson-complete (token auth, admin client) into
lesson_completions under the PARENT user_id, so a child's pass lights the
same parent ticks as a together pass and is never downgraded by a wobbly
replay. Whole class mode (/class/[lessonId]) renders any live family
lesson read only at projector scale, arrow keys advance, choice answers
big for hands up, ending on the quiet line that this is the family version
and the full school curriculum goes deeper, pointing at /schools: the
family lessons showcase toward the school tier, they are not the school
offer. No migration: 083 was taken on main, 084 stays free.

## 20 July 2026 — Go live day, closed out
Twenty seven PRs merged (#393 to #421), migrations 058 and 074 to 083
applied, schema verified to match the codebase (sweep query, empty).
Live tonight: the big daily path home, hero road with Can do levels,
Explore grid, digital literacy headline and premium homepage, testable
Rosenshine lessons in the cinematic player on parent and child apps
with curriculum badges and whole class mode, 96 Happy News lesson
covers, the child one list with the locking age contract and gift pay
backs, ask first screen time with the child status banner and kid
nudges, DiGi device check ins, the school report progress page, and
the age up birthday mechanism with the multi child switcher.
OPEN PRODUCT CALLS for Justin: gate /class mode or keep it open as the
schools demo; whether child lesson passes should mint stars and how
many; rehearsal chips send immediately vs prefill for tweaking; eyeball
the 96 generated covers on the hub. Next booked: fortnightly lesson
writer pipeline, school curriculum depth tier, educator views adopting
the lesson covers.

## 20 Jul 2026 (late): school quiz v2 after first child test
Justin's daughter play tested the path and spotted the quiz answers sat in
predictable positions. Fixed properly: every run now samples 5 questions from
a bigger curriculum pool per age band and shuffles answer positions client
side, so there is never a pattern. Every question gained a why line shown
after answering with a Continue button (the Duolingo and Bitesize teach beat,
checked on Mobbin). Pools stay curriculum honest: KS1 bonds and counting, the
Year 4 tables check, KS3 FDP and algebra, GCSE foundation, everyday money at
16 plus. BOOKED NEXT: question banks in the database per school year (not per
band), more subjects (spelling, grammar, science), adaptive difficulty that
follows the child's hit rate, and educator review of every item. That build
should follow the lessons pipeline pattern: research grounded, testable on
arrival, review queue before live.

## 20 Jul 2026 (evening): Etsy channel greenlit, printables engine created
Justin ran a multi agent research sweep on best selling Etsy printables
(school planners, build at home kits, launch mechanics, funnel case studies,
plus a teardown of La Casita Educativa, a 400k follower Spanish printables
brand). Decisions: revive Justin's dormant Etsy shop as the Guided Childhood
shop rather than opening fresh; the shop's two jobs are profitable sales and
compliant list building toward /starter-pack; price floor £4, revenue core
£8 to £25 bundles; opt out of Offsite Ads on day one; school planners ship
first (US back to school peaks now, UK wave 15 Aug to 10 Sep); products are
fronted by the CURRENT squad (Oliver, Zara, Sofia, DiGi golden star, UK
animals; Teo, Olga, Alma remain legacy) with each character owning the lane
matching their lesson topic; classroom products will carry the schools team
when it is defined. New skill .claude/skills/printables-engine/SKILL.md is
the production pipeline; plans/etsy-launch-plan.md is the step by step plan.
Full research outputs live in the session, summaries to be committed as
research docs on the etsy research branch.

## 21 Jul 2026: three La Casita game copies built into the child app
The A to Z Showdown, Word Fishing and Ice Cream Shop printables (merged in
PR 443) are now playable inside the child app, the interactive twin of the
paper products a member family buys on Etsy. Built into the EXISTING
quest-games system (lib/quest-games/registry.ts + components/quest-games/
QuestGamePlayer.tsx), not a parallel one: three new mechanics (wheel, fishing,
coins) with three renderer views. Key decision: the games plug into the
registry and the existing games tab (gamesForStage) and pay stars through the
existing /api/quests/lesson-complete approval loop, so NO migration, NO new
routes, NO new API and NO home screen changes were needed. Content lives as
data (78 A to Z clues, phonics word lists, ice cream coin prices verified
makeable in two to three coins), renderers in the app, per the school-quizzes
precedent. Fronted by DiGi (A to Z, Word Fishing) and Sofia (Ice Cream Shop).
Verified: full tsc clean, both Vercel previews deployed green, and all three
rendered and interaction tested in a real browser at mobile width. PR 449
(draft). Note: the parallel routes/kid_games approach the first architecture
map suggested was rejected after reading the real code, which already had the
quest-games system.

## 21 Jul 2026: real character art + game thumbnails + New badges
Justin supplied the finished squad art (via Google Drive, since the Higgsfield
CDN download stays blocked in session and pasted images do not persist). Saved
to public/digi-squad/: Oliver.png (portrait), Oliver-football.png (hero), Zara.png,
Sofia.jpeg, DiGi-star.png; the old basic Oliver is replaced. Built three
professional game card thumbnails from the real art (public/games/) with the
HTML to PNG pipeline, no Higgsfield needed. Sofia's Ice Cream Shop now uses the
real Sofia portrait at the counter instead of the drawn stand in. Added thumb
and isNew to QuestGameMeta so the kid Games tab shows a proper picture and a New
badge on the three La Casita games. tsc clean, games re rendered and checked.

## 25 Jul 2026: learning printables show no score to the child
The UK curriculum learning sheets (England, Years 1 to 6, maths, English and
reading) will never show the child a mark or a percentage. The sheet returns one
thing: the two or three items to go over with a grown up. Justin agreed the
recommendation.

The reason is the product, not squeamishness. A score turns a warm shared thing
into a test that judges them, and the child stops asking for help on the bits
they found hard, which is the entire mechanism. The parent gets the substance
(here is where she is shaky) without a number attached to their child.

## 26 Jul 2026: the welcome rotates across opens, not inside one
The launch overlay used to cycle six mission lines every six seconds inside a
single view, and it quoted a duration. Both are now gone.

The rotation axis was wrong. It rotates **across opens**: one card, one service,
one tap, gone, and a parent meets the whole product across a fortnight of quick
hellos rather than a tour nobody sits through. Anything the family has not set
up leads, so the card is a useful next thing rather than a fact about us.

The duration was worse. "Today takes about six minutes" is the first thing a
tired parent reads and it lands as a commitment, not a welcome. They find out it
is short by it being short. No total is ever quoted again.

Every card carries the trust line: not what the service is, but what happens to
what you tell it. Families are rightly wary of apps that hoover up information
about their children, so the honest answer is both the explanation and the
reason to trust us. `lib/home/welcome-cards.ts` holds the catalogue and the
pick, kept pure so the selection can be reasoned about on its own.

## 26 Jul 2026: the child phone handover is asked once, properly, and paper is a real answer
Half the product lives on the child's side and the QR code was buried on the
Quests page, so a family could run one side of a two sided thing for weeks. It
is now asked on the second app open, never the first, and never as a second
overlay: it takes the one welcome slot when it is its turn.

Three calls worth recording.

**Sending the link sits equal to the QR code.** The parent is holding the phone
showing the code and cannot scan it with that same device, so a QR only ask is a
dead end for every child who is not stood right next to them.

**"We do it on paper" is a real preference, not a dismissal.** Plenty of
families will not give a child a phone and we should be the platform that says
fine. It is stored (`profiles.handover_choice`) and the prompt never returns.

**The asking is capped** at three (`profiles.handover_asks`, migration 103, with
a browser side backstop). An overlay on login is the most intrusive surface we
have and the fastest way to make it hated is to let it nag forever. After that
it falls back to the quiet prompt already on Quests.

The age gate was already right and stays: nothing is offered below the 8 plus
band, because asking a parent of a five year old to link a phone reads as us
pushing devices onto little children.

## 26 Jul 2026: leads get a real stop link, because address matching cannot catch everyone
Checked whether the pre sign up emails reach people who have already joined.
Every starter pack link lives in a lead only email, and the cron does exclude
anyone with a matching account, so the design is right. Both sides lowercase the
address at write time, so case is not the hole either.

The hole is a parent who took a printable with one address and then signed up
with another. Matching on address cannot ever catch that, and until now their
only way out was a mailto in the footer, which is no way out at all.

So every lead email now carries a real one click stop, signed with an HMAC over
the address (`leadUnsubscribeUrl`), and the same door handles both kinds of
recipient. Clicking it stops the lead sequence AND opts out any account on that
address, because someone clicking stop means stop, not stop one of two lists
they did not know they were on. Migration 104 adds `starter_leads.unsubscribed_at`.

Both lead reads fall back to the unfiltered query if that column is missing, so
a deploy landing before the migration cannot silently switch the whole lead
programme off. This is the same defensive shape as the handover column read.

It is also what the bulk sender rules ask for: a link that works in one tap.

## 26 Jul 2026: the parent app type scale goes up, by rule not by hand
Justin, on a real phone: the text is way too small, make it much bigger across
the app. He was right, and it was not one screen. Every size in the parent app
is set by hand in an inline style, about two and a half thousand of them, so
there was no single number to turn and no honest way to do it by eye.

`tools/bump-type-scale.py` holds the rule, deliberately dull so it is
predictable and reversible:

- under 9px, left alone. Micro marks inside small dots and badges, where two
  more pixels overflows the thing holding them.
- 9 to 20px, plus two. The whole readable range: labels, body, sub copy.
- over 20px, left alone. Already display sized, and mostly emoji glyphs sized
  to fit a fixed box.

Plus two rather than a percentage on purpose. It lifts the small end most in
relative terms, which is where the pain was (a 10px mono label gains a fifth, a
20px heading a tenth), and it can never reorder the hierarchy: anything bigger
than its neighbour before is still bigger after. clamp() sizes move too, but
only where the top of the clamp is 22px or under.

2477 sizes across 228 files. Checked for horizontal overflow at 390 wide on
three fixture pages: zero on all three, console clean.

## 26 Jul 2026: add a job is a button, at the top of the list
Adding a job is the one thing a parent opens the Quests manager to do, and the
only way to write one was a lone input below two screens of ready made ideas.
Set tasks and Manage jobs both landed above that wall rather than at it.

There is now an add a job button in the header of the child's own quest list,
opening an inline composer in place. Set tasks and Manage jobs land there with
it already open. The ideas grid stays where it is, for a parent who wants to
browse rather than type.

## 26 Jul 2026: the child app squad intro plays once a week, not every open
Six cards at four and a half seconds each is nearly half a minute of splash
standing between a child and their jobs, and it ran on every single open. A
thing that lovely stops being lovely the third time in a day.

It now plays once a week. Often enough that the family they are collecting
stays in mind, rare enough that it is a treat rather than a toll gate. The first
open for a new child always gets it. The clock is stamped when the intro
appears, not when it finishes, so a child who wanders off halfway through is not
met by the whole thing again on the next open.

One trap worth recording, because it is easy to walk back into. The gate cannot
re-read the raw timestamp on every mount: playing the intro stamps the clock, so
the next read within the same open says "not due" and the intro vanishes from
under the child. Anything that remounts the screen triggers it, and React strict
mode in development does exactly that, which is how it was caught. The answer is
worked out once per app open and held in sessionStorage, so every mount within
one open agrees.

Verified across five simulated app opens: new child yes, same day no, next day
no, a week later yes, straight after that no.

## 27 Jul 2026: outstanding jobs get a reminder when the timer ends, not a block
Justin asked whether to refuse screen time while jobs are outstanding, or remind
them once the timer finishes. The reminder, and not narrowly.

A blanket block is the wrong tool. At four in the afternoon every daily job is
outstanding, bedtime ones included, so it would fire almost always and the child
would learn the deal is rigged rather than earned. It also puts the app in the
chair saying no, which is the opposite of non negotiable 1: never allow or deny,
always a calibrated pathway.

The gate already exists for families who want one, and it is the calibrated
version: `blocks_screens` per job, set by the parent, enforced at
`/api/quests/time/start` with a "chores first" answer naming what is blocking.

So the timer end screen now names the jobs still waiting and what the lot is
worth in minutes. It is the strongest moment there is: the fun has just
finished, they are being handed back to the room anyway, and the next block of
time is sitting right there in the jobs.

## 27 Jul 2026: the child's timer card is driven by the live session, not page load
Justin: pressed stop, and it was still ticking somewhere else. Two faults, both
the same shape, a snapshot standing in for live state.

The card was keyed and seeded on the session the page happened to load with, so
it could not see a block that started or ended anywhere else. A grown up
starting time from their side left the card sitting idle until a full reload.

And stopping cleared the card's own state but told the screen around it nothing,
so for up to twelve seconds, until the next poll, the rest of the app still
believed the clock was running. `onSessionChange` now reports a start, a stop
and a countdown reaching zero the instant each happens, and the card is keyed
and seeded on the live session.

Checked while there: the server is not the problem. `/api/quests/time/start`
already closes any open session before opening a new one, so two rows can never
run at once, and the parent side polls every eight seconds.

## 27 Jul 2026: the community poll gets a year of questions, and they rotate register
Justin asked whether the poll should vary and what the variations should be. Yes,
plainly: 099 seeded one question, which proves the feature and does not keep it.
A poll that never changes is answered once and then it is furniture.

Migration 106 seeds twelve, August 2026 to July 2027. Three rules shaped them,
and they matter more than the questions.

**The register rotates.** The point of the bite is the reassurance of the crowd,
not a monthly audit of everything going wrong. So these are not twelve versions
of what is hardest: some ask what is working, some what is coming, the last asks
what has actually changed in a year. A product whose whole pitch is warmth
cannot ask a worried parent to rank their failures twelve times running.

**No option is an admission of failure.** There is always a way to answer
honestly when it is going badly without it reading as a confession: honestly I
stopped counting weeks ago, nothing reliably and that is why I am here. A poll
with an obviously right answer teaches parents to lie to it, and then both the
aggregate and what DiGi remembers are worthless.

**The answer has to be diagnostic.** Every vote lands in digi_memory so next
month DiGi can pick the thread up. A question whose answer tells DiGi nothing is
entertainment, and this is not an entertainment feature.

Anchored to the UK year on purpose: six week holidays in August, the Christmas
list in November, secondary transition in June. Written for the moment rather
than pulled from a bank, which is most of the difference between a bite and a
survey.

Ran 099 then 106 against a real Postgres 16 rather than reading them: both
execute clean, 106 is idempotent on a second run, and the API selection query
returns the right question for each of the thirteen months.

Known and deliberate: from August 2027 the last question repeats every month,
because falling back to the most recent poll is what stops a missing month
breaking the feature. Noted at the top of the migration so it is found. Seed the
next twelve before summer 2027.

## 27 Jul 2026: curriculum spine built, and the sources are blocked by egress policy
Migration 108 lays the spine for the learning printables: objectives keyed by
curriculum, year group, subject, term and strand, so a sheet can be assembled
for one year at one point in the school year. Term is a column because what a
Year 4 should know is useless in September and true in June.

`source` is NOT NULL on purpose, and that is the load bearing decision. Accuracy
is the whole product: a sheet testing the wrong thing for the year is worse than
no sheet, because a parent believes it and acts on it. An objective nobody can
trace cannot be inserted at all. `verbatim` records whether the text is the
published statutory wording or our paraphrase, because those are different
promises and only one can be quoted to a parent. Both proven against a real
Postgres, including that the gate rejects an untraceable row.

**The blocker, which needs Justin.** The statutory sources cannot be reached
from this workspace. `assets.publishing.service.gov.uk`, `gov.uk` and
`ncetm.org.uk` all return 403 at the egress proxy, which is an organisation
policy denial and not something to route around. Search still returns published
wording, so eighteen Year 4 maths objectives are seeded and every one is
verbatim and traced, but the rest of Year 4 and all of Years 1 to 3, 5 and 6 are
deliberately absent rather than written from memory.

Two ways forward: allow those hosts through egress, or paste the programmes of
study in. Either unblocks the long pole. The machinery does not need to change.

## 25 Jul 2026 — New KS2 AI lesson is module 22
The UC Irvine panel additions add one new child lesson, Let AI help you not do it for you (KS2, host DiGi, teaches stay-the-maker and explain-it-back). Decided it is module 22, a clean addition, no renumbering of the existing 21. module_id ks2-22-ai-maker. Source script content/lesson-scripts/ai-panel-additions.md, wiring in plans/handoff-ai-lessons-to-app.md. KS3 Lesson 12 and KS4/KS5 Lesson 20 get cognitive-offload uplifts, plus a parent lesson on connection over control.

## 27 Jul 2026: jobs can be renamed, which they already could server side
The edit panel offered stars, days and the before screens gate, but never the
name. The PATCH route has always accepted a title patch, so this was a hole in
the panel rather than the API.

It mattered more than it sounds. A parent who typed a job wrong, or wanted
"tidy bedroom" instead of "clean my room", had to delete it and add it again,
which takes every tick with it and resets the child's streak on that job.
Fixing a typo should not cost a child their run.

Saves on blur and on enter, and only when the name has actually changed, so
opening the panel to change the stars never writes a pointless update.

## 27 Jul 2026: a page that answers whether the emails are actually sending
Justin wants the email programme live. The code and the eight o'clock cron have
been ready for a while, so going live is environment, not build. The problem is
that you cannot tell from outside whether it worked.

With no Resend key the cron returns skipped and stops. No error, no alert,
nothing recorded that it ran. That is indistinguishable from a morning where
nobody happened to be due an email, so a dead programme and a quiet one look
identical and you find out weeks later when a parent says they never got
anything.

`/dashboard/admin/email`, founder only, settles it with the two things that
actually decide it: what the environment is missing, and when an email last
genuinely went out. Every send writes its log row before the email leaves, so
the most recent row across email_log and lead_email_log is an honest heartbeat
rather than an intention.

Three states rather than two, because a binary would lie. Not sending (a fatal
setting missing), configured but nothing has ever sent, and configured but quiet
for more than twenty six hours. That last one is deliberately not called broken:
on a small list a silent day is genuinely possible, and crying wolf on a status
page is how people stop reading it.

Only whether each setting is present is shown, never its value. The verdict is
pure and lives in lib/email/health.ts, tested across all five states.

## 27 Jul 2026: which sheet a child gets today, and what comes back from it
Two pieces of the learning printables that were not blocked by the curriculum
sources being unreachable.

**Choosing the sheet** (`lib/learning/term.ts`). Two things here are easy to get
quietly wrong in a way a parent would never spot but would act on.

England places a child by their age on 31 August, not their age today. Using
today's age would move a child up a year in the middle of their birthday week
and test them on work they have not been taught. Two children born a day apart
either side of the cutoff are a year apart at school, and the code has to agree.

And August. A parent printing in the summer holidays gets the year their child
has just FINISHED, not the one starting in September. Testing a child in August
on work they have never met is the exact failure this feature exists to avoid,
and August is when a worried parent is most likely to reach for it. The sheet
says "looking back over the year" so it never implies current work.

Easter moves, so spring and summer split on 15 April. Wrong for a fortnight, in
a term whose content overlaps anyway, and the alternative is a moveable feast
calculation to pick between two sets of objectives that both apply.

**What comes back** (migration 113). The sheet itself is never stored: it is
assembled on the day from curriculum_objectives, so a corrected objective
improves every sheet printed after it rather than leaving old copies wrong. What
is kept is the tricky flags, as objective ids rather than free text, so a parent
summary can always name the exact statutory line.

Restated in the migration because a later change could undo it without noticing:
the child is never shown a number. A score turns a warm shared thing into a test
that judges them, and a judged child stops flagging what they found hard, which
is the entire mechanism.

Verified: the term logic across nine dates, the 31 August cutoff, and out of
range returning nothing. Both migrations against a real Postgres, including
storing a result and joining the flags back to their objectives.

## 27 Jul 2026: the learning sheet, and the tick that is the whole product
The sheet a family works through, at /dashboard/printables/learning. Assembled
on the day from the child's birthday and today's date, never stored, so a
corrected objective improves every sheet after it.

One control on the page: found this tricky. No score, no mark, no percentage,
and the copy says so out loud so a child is not waiting for one. Ticking is the
positive action, warm rather than red, and the summary thanks them for the
honesty instead of totting it up. A judged child stops flagging what they found
hard, and that flag is the entire mechanism.

Where there is nothing for a child's year it says so plainly rather than falling
back to the nearest year. "Not written yet, deliberately blank rather than
filled in from memory" is a better thing for a parent to read than a sheet for
the wrong year, which they would believe and act on.

Flags are posted as objective ids and revalidated server side against the sheet
that was asked for. An id for another year's objective would otherwise surface
in the parent summary as something their child struggles with, which is worse
than losing the flag. The client is a form, not an authority.

Five stars through the same star_bonuses ledger jobs and printables use, so a
sheet counts on the off screen total like everything else.

Caught while building: the children column is date_of_birth, not dob. Reading
the wrong name would have failed at runtime on a page that only appears for
families who have filled a birthday in, which is exactly the kind of thing that
sits broken for weeks.

**The curriculum map is complete (27 Jul, migrations 114 and 115):** Justin
supplied the national curriculum programmes of study directly after
assets.publishing.service.gov.uk stayed blocked at the egress proxy on every
route (curl and WebFetch both 403). Maths years 1 to 6 is 228 rows, English is
113 statutory requirements landing as 220 rows. Migration 108's 18 Year 4 rows
are deleted and reinserted complete, because some carried trimmed wording that
would have shown on a sheet as a near duplicate.

Three decisions worth keeping. FIRST, verbatim means wording only. The
programmes of study are set out year by year and say nothing about terms, so
maths term placement is our own sequencing and English does not get a term at
all: reading and writing rows carry the term 'all' and the sheet reads them
whatever the date, with a line on the page telling the parent so. SECOND,
English key stage 2 is written two yearly, one programme for years 3 and 4 and
one for years 5 and 6, so those rows are inserted against both years and the
source string says which pair it came from. A Year 3 and a Year 4 English sheet
are the same sheet, correctly. THIRD, two published versions were read together:
the current GOV.UK text for wording, the September 2013 PDF as the control on
structure. That caught four requirements the 2021 web rendering nests one level
too deep, two in Year 1 measurement and two in Year 5 geometry, which would
otherwise have been swallowed into the requirement above them.

Also learned: the statutory text is full of semicolons and the Supabase
dashboard splits statements naively (the 3 July lesson). Splicing them with
chr(59) keeps the house rule intact while the stored value stays byte for byte
the published text. No literal semicolon sits inside any string literal in
either migration.

**DiGi knows where a child is at school (27 Jul):** lib/learning/digi-context.ts
is wired into the DiGi route. It is a per message lookup, not a system prompt
addition: 448 objectives in every call would cost a fortune, bury the parenting
guidance under statutory text, and still leave the model free to paraphrase it
into something plausible and wrong. Instead a keyword check decides whether the
parent is even asking about school, and only then do we fetch the objectives for
that one child, one subject and one term, plus the objectives that child has
personally flagged as tricky.

Three rules travel with the facts and they matter more than the facts do. Never
tell a parent their child is behind, because we have no assessment and the
curriculum describes a year, not a child. Quote rather than paraphrase, which is
the entire reason verbatim and source are columns. And never claim the school is
teaching this now, because the term is our own ordering and their school may
sequence differently. Nothing is added at all unless we are certain: no
birthday, an age outside years 1 to 6, or an empty curriculum map all mean DiGi
answers exactly as it did before.

The detector is deliberately keyword based and requires BOTH a school word and a
subject word, so "he keeps reading on his tablet at midnight" does not drag the
Year 4 reading curriculum into a bedtime conversation. Being wrong is cheap in
one direction only: a missed question just means yesterday's behaviour.

Season awareness is in seasonFor, because worry about school is seasonal and
sharp: September for a new year, June for the Year 4 tables check, May for Year
6 SATs, June for Year 1 phonics.

**The Supabase editor cannot take the curriculum migrations in one paste
(27 Jul, unresolved):** 115 fails with relation "phonemes" does not exist, which
is what you get when a string literal is broken mid text and "into phonemes" is
read as insert into phonemes. The SQL itself is valid and applies clean to
Postgres 16, and splitting the file into four 20 KB parts did NOT fix it, so it
is not size. Working theory is that the editor turns our chr(59) splices back
into real semicolons inside the literals and then splits on them. A probe has
gone to Justin to establish whether that editor can handle chr(59), dollar
quoting, or plain semicolons in literals, and the file gets regenerated with
whichever works. Until then the live curriculum_objectives table is empty and
every learning sheet says not written yet.

**Never put a doubled quote in a migration (27 Jul, the real cause):** 115
failed to paste with relation "phonemes" does not exist and it took most of an
afternoon to pin down. Something between the file and the database collapses the
doubled quote in I''m back to a single one. That closes the string literal early,
flips quote parity for every row after it, and the parser eventually reads the
words "into phonemes" as insert into phonemes. Size was never the problem, which
is why splitting the file into ever smaller parts changed nothing, and why a
three line probe of chr(59), dollar quoting and plain semicolons all passed: the
probe had no apostrophes in it.

The rule now, alongside the 3 July semicolon rule: NO doubled quotes in any
migration. Apostrophes come from chr(39) and semicolons from chr(59). The
statutory text keeps every character it is meant to have and nothing in the
paste path has an escape left to mangle. 114 and 115 are rewritten this way.

## 27 Jul 2026: the curriculum is in, and the connector was the answer
448 rows live in curriculum_objectives: maths 228, english 165, reading 55. The
learning sheets stop saying "not written yet" the moment a child has a birthday.

The unresolved note above this one has its answer, and it was not the SQL. The
Supabase web editor was never going to take these files, and no amount of
splitting or requoting was going to change that. The MCP connector runs
statements over the API, where chr(39) and chr(59) are just function calls and
nothing in the path has an escape left to mangle. Seven statements for 115,
straight in, no error.

**The table was not empty when this started, and that mattered.** Maths was
already complete at 228 and english was sitting at 52 rows: a partial 115 from
the paste that failed, stopped at the exact point the parser lost quote parity.
Rerunning the whole file would have been fine for the rows that carry `on
conflict do nothing`, but a half loaded curriculum is the worst state to reason
from, so english and reading were deleted and reloaded whole. Safe today because
learning_sheet_results is still empty, so no child's tricky flag pointed at a row
that went away. Once families are using the sheets that is no longer true and a
reload has to keep the ids.

**Verified by hash, not by eyeball.** The migration files were parsed locally,
the chr() splices evaluated back into real characters, and every row reduced to
one string. Postgres was asked for the same digest over the live table, with the
sort forced to collate "C" so the two agree on ordering. Both sides:
74c1c94c9a3756053b04d1211358651c over 448 rows. That is every apostrophe in
`I(chr 39)m` and every semicolon inside the reading comprehension lists proven to
have round tripped, rather than assumed because the counts looked right. Counts
would have passed on 448 subtly wrong rows.

**One real defect found on the way in.** Migration 115 had half a GOV.UK URL
glued to the end of a Year 2 spelling objective: "apply spelling rules and
guidance, as listed in English appendix 1 (https://www.gov.uk". A parent would
have read that on a sheet. It is page furniture from the copy, not statutory
text, and the Year 1 row directly above it proves the point by ending cleanly at
"English appendix 1". Loaded without it and the file corrected to match.

## 27 Jul 2026: the birthday is a setup step, and it had three homes
It was a welcome card, a Home nudge card that waited until day three, and
nothing in the checklist. Three places to meet the same ask and no place to
finish it. It is one step now, second in the path, with a flag and a tick like
everything else, and the two cards are gone.

Second rather than first because the daily practice stays the front door. But it
is the shortest job on the list and the only one whose absence leaves a service
the family has already paid for saying "not written yet" on every page it
touches, so it leads everything except the habit.

The flag is true when NO child on the account is missing a birthday, not when
the primary one has it. A second child with no date is a second sheet that
cannot be built.

It also reads true when the read errors. The column arrives with migration 083,
and on a deploy where that has not run the select fails. Failing to done is the
difference between a quiet path and a step every parent is shown, cannot
complete, and cannot get rid of.

## 27 Jul 2026: six tabs, and why 360px was worth measuring
Lessons had no desktop tab at all, only a chip in the mobile secondary strip.
The one part of the product that actually teaches a child was the one part with
no way in on a laptop. It sits before Quests now, on both navs, because it is
the thing the quests are for.

Six across a phone was measured, not assumed, in Chromium with the real Nunito
at 430, 393, 375, 360 and 320. Five had room to spare everywhere. Six did not:

    360px  "Passport" is 48.5px wide in 49px of space
    320px  the row runs 21px past the viewport and the last tab is cut

A tab bar does not scroll when it overflows, it clips, so on a 320px phone the
Passport tab simply would not have been there. min-width lets the items share
the width evenly instead of each demanding room for its own label, and the label
steps down a size below 420px and again below 345px. After: 44.5px in 57px at
360, 39.5px in 51px at 320.

Worth writing down that the pessimistic guess was wrong in the useful direction.
Guessed from character counts, six looked fine at 360 and it is half a pixel off.

## 27 Jul 2026: the welcome hands over to DiGi, and MissionWelcome fixtures
The card used to point at the page its service lives on, which made the hello a
menu: read a paragraph about Family Quests, land on the Quests page, still on
your own. Every card now carries an `ask`, the real question a parent would put
about that service, and the primary action opens DiGi with it already sent. So a
greeting day is hello, one conversation, Home. Later still goes straight to Home,
and the four quiet days have no hello, so they keep no detour.

The question is shown above the button rather than hidden behind it. A button
that only said Ask DiGi is a mystery box, and a parent who cannot see what is
about to be sent on their behalf has every right not to press it.

Nothing was added to DiGi for the way back. Its header already carries "Today's
pathway", written for exactly this and already calling a question a detour.

**Why every MissionWelcome fixture has failed.** Instrumented in a production
build rather than guessed at. The module is evaluated TWICE per page load, so
`openDecision`, the module scope guard that is supposed to survive a remount,
resets to null on the second instance. The first instance greets correctly and
renders the card. The second finds gc_mission_welcome_open already set to 1 by
the first, decides this open has been greeted, and renders nothing. The overlay
appears and is then replaced by null, in that order, every time.

The guard cannot do its job if the module it lives in is not a singleton. Left
alone here because it is not this branch's change and Justin has seen the real
Home greet him, so on that page something differs. Written down because the next
person to build a fixture will lose the same afternoon otherwise, and because
"it renders and then unrenders" is the shape to look for, not "it never renders".

## 27 Jul 2026: a finished sheet offers a quest for the tricky bits
The loop. On its own a printable is a nice afternoon and then it is over: a
family works a sheet, ticks two things as tricky, and nothing changes. The flag
was collected and filed, which is the fastest way to teach a child that saying
"I found this hard" leads nowhere. Now it comes back the same day as one small
job on their own phone, worth stars like any other, and the parent has a reason
to print the next sheet.

Three rules in the route. The flagged ids are read off the saved result rather
than taken from the request, so a quest can only ever be about objectives that
were validated when the sheet was finished. ONE quest, never one per flag,
because five jobs for five flags is a homework pile and a board full of
everything a child cannot do. And the words tricky, struggling and behind are
banned from what reaches the child: they were honest with us and the only
acceptable answer to that is help, never a verdict.

Weekdays, not daily. Practice wants repeating and a short one after school five
times beats one heroic go, but a job that also lands on a Saturday morning turns
the weekend into school and gets switched off inside a week.

The statutory wording goes to DiGi and stops there. "Recognise and use
thousandths and relate them to tenths, hundredths and decimal equivalents" is the
standard, not a task. The parent has the sheet with the words on it.

## 2026-07-27 — Every spoken line is British, by one rule

**The live browser voice is British first (lib/voice/english-voice.ts).** Two
places speak live text through the device: the child's ten second countdown in
DeviceTimeCard and the rehearsal child in RehearseWithDigi. Both picked their
own voice, badly. DeviceTimeCard set no lang at all and matched Samantha first,
who is American. RehearseWithDigi set en-GB but preferred any enhanced or
natural English voice ahead of it, which on a device set to US English is again
American. Both now call speakEnglish, which walks one ladder: en-GB, then any
British English, warm named British women (Kate, Serena, Martha, Sonia, Libby,
Google UK English Female) preferred inside that, quality preferred only inside
British, and any English at all as the last resort. Accent beats quality on
purpose. The voice list is warmed on mount because Chrome fills it a moment
after load and a cold page was silently falling through to the device default.

**DiGi's name is respelled for speech only.** sayable() rewrites DiGi to Dijee
in the spoken string, never in anything anyone reads, so the engine says it the
English way rather than the hard American one. One string to change if the
sound is wrong.

**DiGi's recorded voice is a separate job.** The 118 say this recordings in
lib/content/script-voice.ts are Skye, an American preset, and no code change
touches them: swapping voice is one Higgsfield batch plus a rewrite of that map
(the 12 July decision still holds). Candidate British presets sampled for Justin
to choose: Imogen, Tamsin, Mabel. Note these wav files are still hotlinked to
the generation CDN, the same one the vendored images came off, so the
regeneration should land them in public/ at the same time.

**Printables is core, and the star chart has its own door (27 Jul).** Justin
could not find the star chart builder. Nothing had removed it: it was two taps
down inside Printables, and the Printables card on Home was gated behind the
day six lessons reveal, so on a newer account the only route to it was through
the Quests board. Printables is the offline half of the product and the one
thing a parent can use on the first evening with no setup, so its Home tile is
now reveal core. The day six DiGi card no longer announces printables with the
lessons, since a parent has had them for a week by then. And Build your star
chart is now its own tile on the Quests board, next to Manage jobs and in the
same terracotta, because they are one idea in two places: the jobs on the
screen and the same jobs on the fridge.

## 27 Jul 2026: the demo children have birthdays, chosen as a test set
Every account so far is demo data, so rather than guess at real birthdays the 39
children were given a deliberate spread: ages 4 to 16, three at every age, all
39 names distinct. Names, dates, bands and stage ids all set together, so
nothing in the platform disagrees with itself about how old a child is.

**The dates are a fixture, not filler.** Three shapes at each age. One born 12
March, well clear of the cutoff. One born 30 August. One born 1 September, and
crucially with the SAME birth year as the 30 August one.

That last pair is the whole point. Two children born two days apart are the same
age today and a full school year apart at school, which is the single thing the
sheet logic has to get right and the easiest to get quietly wrong. Sonny, born
30 August 2016, is Year 5. Flora, born 1 September 2016, is Year 4. Both are 9.
If a later change ever starts placing children by their age today instead of
their age on 31 August, those two collapse onto the same year and the fixture
says so immediately.

Verified by running the real `sheetTarget` from lib/learning/term.ts over all 39
dates rather than by reasoning about them: every year group 1 to 6 comes back
with exactly three children, and the 21 outside years 1 to 6 exercise the "not
this age yet" path at both ends. All 18 combinations of year group and subject
have objectives, so no sheet in the range says "not written yet" any more.

Deliberately NOT saved as a runnable seed script. It rewrites every child row on
the account, which is exactly right for demo data today and catastrophic once
real families are on it. The reasoning is here, the SQL is not.

**The passport's five section checklist was rendered nowhere, and is back (27
Jul).** An adversarial review of the tracker into pathway merge found it. The Is
it working report still built the five rows and the stamps that carried them but
never rendered PassportBook, and the pathway page built its own thinner stamps
with no sections at all, so PassportBook silently took its fallback branch and
showed the old four task list. Gone with it: every row's how it goes green line,
the kept up not ticked off chip, the this stage footer, and the amber warning
that a device is set up ahead of the child's age, which is a safety signal, not
decoration. Nothing typechecked as broken because sections is optional.

The fix puts the rows in lib/pathway/passport-sections.ts, so the page that
renders the passport is the page that builds them, and deletes the dead chain
from the report (about a hundred lines, plus a getAllStagesProgress call the
pathway page was already making). The week's balance is assembled once in
lib/balance/week-report.ts and handed to both the passport's balance row and the
balance report below it, so one page can never quote two totals for one week.
The current stage's ring now reads the flat average of its five rows rather than
the blend, so the circle and the rows under it are the same number.

app/dev/passport-sections is a no auth harness for it. The lesson is that an
optional field is a silent contract: this needed a page you can open in one
click, because nothing else would ever have shown it.

## 27 Jul 2026: the calendar is worth more than the quiz
Three things built on the 448 curriculum rows, and none of them tests a child.

The insight that made them possible: a birthday gives an exact year group, and
the England statutory calendar is fixed and identical for every family. That is
a prediction engine that needs no assessment at all. Knowing a child is in Year
4 in April is enough to know the tables check is six weeks away, without knowing
one single thing about how that child is doing.

**Why not "is my child on track".** It was the obvious ask and we cannot answer
it. The curriculum says what a year covers, not where one child sits in it. Our
term ordering is ours, not the law's. And scoring the child would kill the one
signal we have, because a judged child stops flagging what they found hard. The
valuable thing was never the score.

**One calendar, not two (lib/learning/calendar.ts).** seasonFor in digi-context
already held a thinner copy of the same dates written by month, and two lists of
the same facts is one list waiting to disagree. seasonFor now reads the calendar
and keeps its contract, so the DiGi route is untouched. The rewire immediately
paid for itself: Year 6 parents now hear about the 31 October secondary
application deadline, which the month version missed entirely and which is the
only genuinely immovable date in primary school.

Every date is stored as approximate and every line of copy says "around" or "the
week of". The checks are set by the week and move a few days a year, and a
precise date a parent plans around and we got wrong is worse than a vague one
that is right.

**Year 6 into Year 7 is the highest value moment this product has.** Secondary
transfer is when a child gets their first phone, and until the curriculum landed
we had no reliable way to know a family was in that window. The trigger is the
school year, not the age: two children the same age, one in Year 6 and one in
Year 7, are in completely different situations, and only the year group can tell
them apart. Sonny, born 30 August, gets the card. Flora, born 1 September and
the same age to the day, does not, and that is correct.

The page never says whether to get the phone, and says so out loud rather than
implying it, because a parent arriving there from a screen time app reasonably
expects to be told what to do. What we have that nobody else does is the ORDER,
and the order is the part that cannot be redone. Rules added to a phone a child
already owns are experienced as something taken away. The same rules agreed a
fortnight earlier are just how it works.

Dismissal is per phase rather than once. Waving it away in May means "not yet",
and July is a different question from May.

**The homework decoder is a lookup, start to finish.** Paste the homework, get
the statutory line behind it, what that line is for, and one thing to do
tonight. It ships while "on track" cannot precisely because it needs nothing
about the child, only their year group and the curriculum.

Two disciplines carried straight over from the sheet. DiGi only ever sees the
objectives for that one child's year, because handing it all 448 would let it
match a Year 6 line to a Year 2 worksheet and sound certain doing it. And the
ids it returns are revalidated against the set we sent: a model is no more an
authority than a client is, and an invented statutory line is the one thing this
must never put in front of a parent. No match is a real answer and it says so.

**Verified by running the real code, not by reasoning about it.** 24 checks over
the compiled calendar and transition: every lead window opens and closes on the
right date, the academic year rolls over on 1 September, Year 1 gets phonics and
never the tables check, the 31 October deadline appears for Year 6 only, and the
30 August against 1 September pair proves the phone card follows the school year
rather than the age. Both new Home cards and the decoder checked in Chromium at
390 and 1280: no horizontal overflow, no console errors.

**A paywall is a page, not a JSON blob (28 Jul).** Justin scrolled the Manage
jobs list, tapped Print on a printable job and got a white screen reading
{"error":"members only"} in raw monospace. The gate itself was right: the
printables PDF route is member only and holds against a direct link. What was
wrong is that every Print button on the platform opens that route in a new tab,
so a refusal is a whole browser page rather than a fetch a component can catch,
and the parent was left on a dead tab with no way back and no idea whether the
app had broken. A browser navigation now redirects instead: to /login when
signed out, to the printables library for an unknown sheet, and to
/dashboard/upgrade?sheet=<key> when the account has no access, where the wall
names the sheet they were reaching for. A programmatic caller still gets the
JSON and the status code, so nothing that reads the response changes.

**The same row was crushing its own title.** Three buttons and an emoji take
about 300px, so on a 390px phone the title column was left 56px and broke one
word per line, with the Print button sitting on top of the words. The row wraps
now: the title asks for at least 180px and the three actions travel as one
block, so they drop to their own line the moment there is not room for both.
Measured before and after at 390 wide: 56px to 298px. No media query, which
matters in a codebase of inline styles.

**Printables leaves the Lessons tabs (28 Jul).** JP: we do not need Printables
on the Lessons tab. It was a third segmented view there, showing the same cards
with the same PrintableActions as the real library at /dashboard/printables, so
a parent had two places to look for one thing. That library is now reachable
from Home (core from day one), from the Quests board, and from the Build your
star chart tile, which is plenty of front doors. Lessons is two views again,
Watch together and Lessons, which is what the page is actually for. Nothing is
lost: the printables library page carries the identical card and the same add to
quests action, and nothing in the app deep linked to the removed view.

**Manage jobs answers on the second tap, and a routine is no longer all or
nothing (28 Jul).** Four things JP hit in one pass on the Quests board.

The Manage jobs tile is an anchor link to #my-todo. A plain hash link only
moves the page when the hash CHANGES, so once the URL already said #my-todo
the second tap did nothing: scroll down, scroll back to the tiles, tap, and
the page sat exactly where it was. SectionTiles now scrolls hash targets
itself, which fixes every hash tile on both the Quests board and the passport.

Manage jobs also landed straight in the list with Done as the only visible
action. It opens on a row of the three things a parent actually came for:
confirm the outstanding jobs (counted), add a routine, and school reminders.

Routines were a bundle nobody could look inside: five jobs landed sight
unseen and a parent who wanted four had to add the lot and delete one. Each
routine now opens to its jobs, every one ticked to start with, anything
already on the board ticked and locked, and the button counts what will
actually land. A parent who never opens the list gets the old one tap
behaviour exactly.

**School reminders had a page and no door.** The only tile pointed at it from
deep in Home's Explore grid, labelled School tasks, which is not the words a
parent searches for. It is a tile on the Quests board now, named School
reminders, because a school reminder is a job the week puts on the family,
and the Explore tile is renamed to match.

## 28 Jul 2026: "Something went wrong" was hiding a setup problem
Justin tapped Send a test on the school card and got "Something went wrong, try
again." It was not a fault. It was the one outcome the card had no words for.

The route has three answers and the card only understood two. No subscription at
all returns a `reason` and gets a good message. A send that works returns `sent`.
But when devices ARE on file and every one of them refuses, `sent` is 0, there is
no `reason`, and there is no `error`, so it fell through to the generic line. The
status codes were already in the response as `errors` and the card threw them
away.

**And the account has plenty of devices: 19 parent subscriptions, 6 Apple and 13
Chrome, going back to 4 July.** That is not 19 phones. A subscription rots when a
browser clears its data, and an iPhone home screen app that is deleted and added
back comes home with a new endpoint while the old row stays. They accumulate on
every re-subscribe and nothing ever removed them, so once every live endpoint had
been replaced the test could only fail, and it failed in the one way the card
could not explain.

Three changes. The card now says what actually happened and what to do about it,
naming how many devices refused, because "notifications got turned off again, or
this app was removed from the home screen and added back" covers nearly every
real case and a parent fixes it in twenty seconds. Any other refusal shows the
push service code rather than swallowing it, matching what /api/push/test and
PushPrompt already did. And 404 or 410 responses now delete the row: the spec
says those are permanently gone, and keeping them guarantees the same failure
every morning the cron runs. The test is self healing from here.

The general lesson, which is the one worth keeping: an error message that cannot
tell "you have not set this up" apart from "we are broken" will always be read as
the second one, and the user stops trusting the feature rather than fixing it.
**Home is five tiles and one door (28 Jul).** JP: super simple, they complete
the path, then family quests, road to sixteen, ask DiGi, and we could add the
shop and the school routine, then tidy the rest into categories behind a button.

Home was carrying eighty eight render points: today's path, then a Keep going
grid of nine tiles, then an Explore everything grid of sixteen more, plus a
sticky strip of jump chips to navigate its own length. Two grids doing the same
job, one under the other, which is most of why a parent could not find the star
chart or the school reminders. A screen that needs a table of contents is too
long.

Mobbin first, per CLAUDE.md. Life Reset, Reminders, Wabi and Evernote all do the
same thing on iOS: today's one thing at the top, a small fixed grid of four to
six destinations, and everything deeper behind a single door. None of them list
the whole product on Home.

So Home is now today's path (untouched), then five pastel SectionTiles (family
quests, road to sixteen, ask DiGi, school reminders, visit the shop) and one
Everything else row. The rest lives at /dashboard/explore, the same ExploreGrid
that was on Home, grouped, with a back to home button. Nothing is removed, and
the DiGi reveal cards and flash ups sit above the tiles exactly as they were, so
the day 3, 6, 9 and 12 schedule is untouched.

School reminders takes lavender rather than the sage beside it, because
tint-green and tint-sage share an accent and DiGi and School were reading as one
colour repeated rather than two different places.

**Notify me told everyone it worked, including when it did not (28 Jul).** JP:
the notify button does not come through to me, is it wired in. It was wired in,
and lying in three places.

The client set state to done inside a catch that swallowed everything, so You
are on the list showed whether the POST succeeded, failed or never left the
phone, and an invalid email made the button do nothing at all with no message.
Both keepsake forms now carry a real error state a parent can read and retry.

The route treated a missing table as a silent no op and returned ok regardless.
It now tracks whether the interest survived in either place, the row or the
email, logs the reason when it did not, and returns 502 only when BOTH failed,
because that is the only case where the signup is genuinely lost.

The real one: sendEmail never throws, it RETURNS { ok, error }. So the route's
try/catch around it caught nothing, and notified was being set from
emailConfigured(), which only says a key is present. A send Resend rejected, an
unverified from domain being the usual cause, read as a success all the way
back to the parent. The result is read now and the reason logged.

**Why the welcome never showed (28 Jul).** JP could not see the first run
welcome at all. An audit of every gate found the cause is not one thing but
two, and neither is the three day cadence itself.

MissionWelcome and DigiWelcomeSheet have NO server side gating: both render
unconditionally from page.tsx, so every reason it stays hidden is inside the
component. First, the session flag stored a bare '1' with no date, and
sessionStorage survives reloads and browser session restore, so a parent who
keeps the app in one pinned tab was greeted once and then never again. Monday's
flag was still set on Wednesday. On a phone that is almost everyone. Second,
the greeting day was read from the browser's own clock rather than
Europe/London, unlike every other date on that page, so a device on another
zone greeted on the wrong days.

Both are fixed. The Mon, Wed, Sat cadence is deliberately KEPT: it was JP's own
call after seeing a card on every open read as a toll gate, and reversing a
decision because a bug hid its effect would be the wrong order. He sees it
properly first, then decides.

**The Quests tiles carry state, they are not a menu (28 Jul).** An audit of the
Quests page found 36 sections and a measurable frequency inversion: the most
frequent action, landing a tick, sits about 1300 lines down behind a tab, while
one time setup occupies the largest always rendered block above it. Eight
navigation tiles filled the first screen before a single piece of information.

JP's call, and the right one, was to KEEP all eight rather than cut them: they
are the page's status board, not clutter. So they carry live state now. A tile
with a number is a job to do, a tile without one is quietly done, which is how
GoHenry and Greenlight both open. Manage jobs says how many ticks are waiting,
Printables how many finished sheets need confirming, School how many reminders
are open, and Our family deal says Not made until there is one.

Deliberately not every tile. A badge invented so a tile has one teaches a parent
that the numbers mean nothing, so only the four with a real outstanding action
get one, and every read fails soft to silence. The agreement in particular
defaults to signed on a failed read, so a broken query can never nag a family
who have already done it.

Also gone in the same pass: the Lessons signpost that closed the page, which
duplicated the Lessons tile that opens it plus a permanent bottom tab, and the
job balance card, which rendered in full for a family with nothing due today.
SectionTiles uses minmax(0, 1fr) now, because a grid column's default min width
is auto and the first badge pushed the whole right column off a phone screen.

**DiGi speaks English now (28 Jul).** All 100 script recordings were generated
on the Skye preset, which is American. JP's ear caught it on the name itself:
Skye says DiGi with an American vowel, and it is not how the name sounds here.
Every line was regenerated on Imogen, a warm English female voice, and
lib/content/script-voice.ts rewritten to point at the new files.

That lines up the two halves of the platform's voice. lib/voice/english-voice.ts
already forces en-GB and asks the browser for a warm English female when there
is no recording to play; until now the recordings themselves disagreed with it,
so a parent heard an American read a script and an English voice read the next
thing. One accent now, whether the words come from a file or the device.

The say this lines contain no literal "DiGi", so the Dijee respelling that
english-voice.ts applies to browser speech was not needed in the prompts.

Still hotlinked to the generation CDN. These recordings are the only assets left
pointing outside the repo now the art is vendored into public/art, and they want
the same treatment: about 50 MB as wav, closer to 9 MB as 64k mono mp3, which is
a repo sized problem rather than a git sized one. Needs ffmpeg and a decision on
where they live before it is worth doing.

**Path first, then check on the child (28 Jul).** JP: "we should alwasy ask to
follow path first tehn check on child aftet that so that needs to live in check
up after day clears along with check quests check kessons etc so any diig check
up needs to have inke t solve the probems it rasieses."

Three decisions, and the ordering one is the load bearing one.

The stand block was step one of DiGi's morning walk, so a parent was shown an
audit of where their child is falling short BEFORE being asked to do the two
minute habit the whole product runs on. Wrong order twice over: it front loads
the least appealing screen, and it treats the audit as the point when the daily
habit is the point. The walk is now greet, then today, then Home. The wider
look moved to Home, appearing only once the day is cleared.

It renders NOTHING when no strand is red and no lesson waits. A check up that
says everything is fine every day is one nobody reads by week three, and then
it is worthless on the day it matters. Silence means checked and fine, and it
can only carry that meaning because the card is genuinely able to speak up.

Quiet days stay quiet: JP's call was stay silent, not a softer card. The four
non greeting days get no check up at all.

And the standing rule from the last line of his message: any DiGi check up must
LINK to what fixes what it raises. Naming a problem and leaving the parent to
find the page is a scoreboard, and this product does not do scoreboards.

**The passport leads its own page (28 Jul).** JP asked for the passport to sit
beside the opening text "as passport kind of drive it", for its links to go to
the task that earns the stamp, and for green when done with another colour for
to do.

It was three screens down, under a road, a reassurance card and six tiles. The
page is called the pathway and the passport is what the pathway is FOR, so it
now sits in the header: copy left, passport right on a desk, stacked on a
phone with the words first so the passport is explained before it is handed
over. Measured at 560 plus 340 on desktop, one column at 390, no horizontal
scroll at either.

Green and amber replace the stage colour on every row. The tick, the detail and
the ongoing chip all used the stage's own shade, which meant done and to do
were the same colour as each other AND a different colour on each of the five
pages. A checklist whose only job is showing what is left could not show what
was left. The two colours are the ones this page already names out loud further
down: green is doing its job, amber comes with one clear next step. Amber here
is the butter gold, not red, which also happens to survive red green colour
blindness better than the obvious choice.

The balance row was wrong in three ways at once and all three had the same
root: nobody had logged a week. It read 100 per cent with a green tick and the
words "No screens logged", it dragged the stage average up with it, and it
linked to #screen-balance, an anchor that only renders once a report EXISTS.
So in the one case where there was definitely something to do, the row claimed
to be done and tapping it did nothing. It now reads zero, says "Log a week",
explains that nothing is logged yet, and links to /dashboard/stats, which is
the page a parent can actually act on.

Rule, same as the DiGi check up rule from earlier today: a passport row names a
problem and links to the thing that fixes it, or it does not name it.
**DiGi reads a little slower, at speech_rate -10 (28 Jul).** JP asked for the
Imogen read to be a little bit slower, then asked the right question before any
credits were spent: will it still fit the timing of the images.

It will, because nothing is timed to these recordings. SCRIPT_VOICE has two
consumers, the script reader and the Right Now rescue, and in both it is a Hear
it button beside the say this text. useReadAloud builds an Audio and plays or
pauses it. No timeupdate, no onEnded sequencing, no image swapping. A longer
clip is just a longer clip. The place where audio does have to fit pictures is
the lesson explainer pipeline, one clip per beat, which is a different set of
assets and none are built yet.

Pace is a parameter, not a rewrite. seed_audio takes speech_rate from -50 to
+100. Measured on script 1: 12.18s at 0, 14.53s at -10, 14.76s at -20, 25.47s
at -40. So -10 and -20 land in the same place and -40 is more than double.
JP picked -10.

The lesson worth keeping is about cost. The generator's own get_cost preflight
quoted 0.2 credits a line, which made 100 lines look like 20 credits against a
balance of 42.27. The real charge was about 1.2 a line and the workspace ran
dry after 31. Do not budget a Higgsfield audio batch from get_cost. Measure the
balance across a few real generations and scale from that.

The map still serves all 100 at the original pace. A map that was 31 slow and
69 normal would trade one inconsistency for another, and one consistent voice
is the whole reason the Imogen batch exists. The 31 URLs are parked in
plans/digi-voice-slower-progress.md so the spend survives, and the batch
finishes in one go once there are credits.

Also learned in passing: several seed files reuse the same sort_order for
different scripts, so sort_order alone does not identify a script. The titles in
the trailing comments of script-voice.ts are what disambiguate, and matching on
them resolved all 100 cleanly.

**The countdown was silent unless you started it yourself (28 Jul).** JP: "i
have never heard or seen teh countdown i dont tink it works". He was right on
both halves, and they have different causes.

Never heard is a real bug. The blips and the finish jingle need an AudioContext,
and a browser only opens one on a user gesture. DeviceTimeCard opened it in
start(), which covers exactly one child: the one who taps Start and stays on the
screen. Every other route into a live block reaches the card through
initialSession and never runs start() at all: a reload mid block, a child coming
back to the tab, and any block a grown up granted from their own phone. All of
those counted down in complete silence, and the finish landed with no jingle.
Now, while a block is live, the first touch anywhere on the page opens the audio.
Still a real gesture, which is all the autoplay rules ask, and a child watching
their own timer has always already made one.

Never seen is a testability problem, and it is why the silence survived. A block
is at least STAR_MINUTES long, five by default, so seeing the last ten seconds
means starting a real block on a real child account and then sitting in front of
it for the best part of five minutes. Nobody does that. app/dev/countdown runs
the whole thing in fifteen seconds with no auth: the rising blips, the spoken ten
second line, the three two one, the confetti and the big terracotta number, then
the jingle. Checked in Chromium at 390 wide, all three states render and the only
console error is the fixture token's stop call returning 400, which the card
already ignores.

The pattern worth keeping: when something can only be seen after a long wait, it
is not really checkable, and anything not checkable will eventually break
quietly. app/dev/passport-sections exists for the same reason and caught the same
class of bug.

**Section five went missing through a silent fallback, not a missing feature
(28 Jul).** JP said to fix the passport, and picked section five missing off the
list. The row was there the whole time: lib/pathway/passport-sections.ts builds
all five, the pathway page passes them, and PassportBook renders them. Driving
app/dev/passport-sections in Chromium showed all five present, screen balance
included.

The hole was one line earlier. buildPassportSections returned an empty record
when currentStageNum was null, and an empty record does not hide the checklist,
it changes which one renders: stamp.sections is optional, so PassportBook takes
its old FOUR task fallback. Nothing errors, nothing typechecks as wrong, and the
passport simply shows four rows with screen balance the one that is gone. That
is the same class of bug the file's own header describes, and it came back
through a different door.

Stage one is the honest default when a family's current stage has not been
worked out, and every row that reads live still says Later until it genuinely
belongs to them, so nothing borrows progress it has not earned.

The wider lesson: an optional prop with a silent fallback is a trapdoor. The
fallback should be loud, or there should not be one.

**DiGi is spelled Didgee for speech, not Dijee (28 Jul).** JP: "digi as sounding
in the english word digee tal", so the target is the first two syllables of
digital, DIJ ee.

Two things have to be right and the old spelling only had one. Dijee wins the
soft g, but a single consonant between two vowels is the English cue for a long
first vowel, the rule that separates dinner from diner, so an engine reading
Dijee is being told to say DYE jee or DEE jee. Doubling the consonant closes the
syllable and forces the short i. That is exactly why didgeridoo is spelt as it
is: didge is already the English spelling of this sound.

Still one string in lib/voice/english-voice.ts, applied by sayable() to every
line the browser speaks. It cannot be verified from a sandbox with no speakers,
so it wants JP's ear on a real device before it is called done.

**Quests tiles: the fifth badge is the star bank, and the star chart stays
quiet (28 Jul).** JP approved the restructure. Phase 1 turned out half built
already: four tiles carried live badges and page.tsx really does pass the
status, so those were working.

Added the fifth, on Keepsakes: stars banked and not yet spent across every
child, from getStarBanks. It is a balance rather than a queue, and it still
earns a badge on this board's own test, because the child has earned those
stars and not been given anything for them. Something is owed, it is just the
parent's to give rather than to confirm.

Did NOT add "Not printed yet" to the star chart, which JP also asked for.
StarChartBuilder persists nothing, so there is no record of any family ever
having printed it. The only way to show that badge today is to infer it from
something adjacent, which is precisely the invented badge board-status.ts
already rules out: a number a parent learns to distrust is worse than no
number. It needs a column that actually knows, so it waits for one.

/dev/quest-tiles now renders BOTH states side by side. The quiet board is what
most families see most days and it has to look finished rather than unloaded,
which is not something you can check from the busy state alone.

**Stickers read as objects, and would have printed blank (28 Jul).** JP: if the
stars are going to be printable they need to render better and be better
images. Two separate things inside that.

Rendering: an earned sticker now has a white die cut rim, a soft lift off the
page and a highlight across the top, which is the difference between a status
dot and a sticker, and is what the Planet Friends beside them already had. A
locked one deliberately gets none of it and stays flat, because an unearned
sticker should look like it is waiting rather than like something you own.

The print bug found on the way: browsers strip background colours when printing
unless told not to, so every one of these would have gone to the printer as a
white circle with a number in it. On a sheet whose entire purpose is to be cut
out and stuck on a chart that is the difference between a printable and a blank
page. print-color-adjust: exact now set.

Worth keeping: these are SVG and CSS, not raster, so they are already the right
call for print. They scale losslessly to any size, which is why the harness
renders them at 150px as well as 54. New raster artwork would be a downgrade
for print unless generated very large. The real artwork question is the
CHARACTER stickers, which are images, and that waits on Higgsfield credits.

/dev/stickers shows earned, locked and print size together.

**The child app handover said itself three times on one Home screen (28 Jul).**
Phase 3, the duplication. The audit counted six handover entry points; the ones
that actually hurt were the three stacked on a single screen.

A family with an unlinked, named child aged 8 or over saw, all at once:
ChildAppNudge (page.tsx:557), DiGi's one next thing overridden to "Share the QR
code with them" (page.tsx:506), and a handover row inside HomeRows (:674).

Neither of the extra two could ever have been an alternative to the nudge, and
the gates prove it rather than suggest it. hasKidLink is a link row existing;
childAppLive is a link row that has been OPENED. So !hasKidLink strictly implies
!childAppLive, and ChildAppNudge is gated on exactly !childAppLive. Whenever
either duplicate showed, the nudge was already on screen saying the same thing.
They were not three states, they were one message three times.

The best part: page.tsx line 438 already carried the rule, in its own words,
that the handover stays out of the one next thing "because ChildAppNudge above
already owns that and saying it twice on one screen is nagging". The rule was
written and then broken twice, twelve lines below itself. A comment is not an
enforcement mechanism.

ChildAppNudge is now the only one that speaks. HomeRows lost the row and the
handoverChildName prop; nextTask always reads the daily loop.

**The saving goal bar was drawn twice, the balance line only looked like it
was (28 Jul).** JP's call, and the right one. QuestBoard and StarSummary both
sat on the Quests page drawing a star balance and a Saving for bar.

Only the goal bar was a genuine duplicate, and StarSummary's is the better of
the two: it carries the goal reached celebration and the redeem button, which
QuestBoard's copy never had. Two bars for one goal, one of them a dead end.
QuestBoard's is gone.

The BALANCE line stays, because it is not a duplicate however much it looks
like one. QuestBoard lists every child; StarSummary only ever shows the
selected one. For a family with two children that row is the only place both
balances appear at once, so removing it would have quietly cost multi child
families their only side by side view to make a single child page tidier.

Worth keeping as a rule: identical looking output is not evidence of
duplication until the SCOPES match. The handover fix earlier the same day was
safe to make because the gates proved redundancy; this one was not, and the
difference was worth asking about rather than guessing.

**The daily buzz was filed under one time setup (28 Jul).** Last of the Quests
duplication pass. The nine ping buttons sat at line 2109 of a 2283 line file,
inside the Share tab, which is the tab a parent opens once to hand the phone
link over and then never needs again.

Read the nine and the misfiling is obvious: dinner in ten minutes, time to come
off the screen, time for bed, please come downstairs. Not one is a setup task.
They are the most ordinary daily thing on the whole board and they were behind
a job you do once. Now on Manage, with the rest of the daily loop.

Its own component, so /dev/child-ping can show it without a login. That matters
here specifically: being unreachable without auth is a large part of how it sat
misplaced and unexamined for as long as it did.

Small accessibility fix carried along: the button labels are clipped at 34
characters with an ellipsis, and the clipped text was also the accessible name,
so a screen reader announced "Quest check! A few ticks and the..." with no way
to hear the rest. title and aria-label now carry the full line.

Noted against house rule 6 (scripts live in the database): these nine are quick
action button labels rather than DiGi pathway scripts, so they stay in code for
now. If they ever need editing without a deploy they want a table.

**Four from JP's phone, 28 Jul evening.** All four were real.

1. NO PRINT BUTTON on the star chart builder. Its action bar was pinned to
bottom 0, so on a phone it sat UNDER the global tab bar, and because the count
line is long the row wrapped and the Print button was the half pushed out of
sight. The one button the entire page exists for was unreachable on mobile
while the page still looked finished. The .above-tab-bar class already existed
for exactly this (the shop basket uses it); this bar had never adopted it. Also
flipped to wrap-reverse so the button leads and the count follows.

2. THE BADGE CLIPPED to "Not prin...". Two errors, one after the other, both
mine. First flexShrink 0 meant a long badge pushed the row off a 390 screen.
Then flexShrink 1 fixed the overflow and made every badge collapse to four
characters: "4 wai...", "Not m...". That is worse, because a badge that says
"Not m..." has lost the only thing it was for. The answer was neither: the row
WRAPS, so a badge that will not fit beside the icon drops under it and reads in
full. Copy shortened to "To print" as well, matching the devices tile's "To set
up".

3. "CONFIRM 18 DONE" was counting the wrong set. It counted every quest not
approved today, which sweeps in jobs nobody has touched and one off games never
played. So it read 18 while five were genuinely waiting, and tapping it dropped
a parent into a long list where most rows needed nothing from them. Now counts
pending ticks, the same source the star summary already uses, so the two agree
by construction. Empty state says "Nothing to confirm" rather than "All done
today", which was a plain untruth when the day's jobs were untouched.

4. THE PUSH TEST NEVER CLEANED UP. A 410 from a push service means that
endpoint is dead forever; nothing ever deleted it. iOS mints a new endpoint
every time the app is removed from the home screen and added back, so the row
count only grew and every stale one counted towards "every device refused" —
the message got more alarming the longer an account had been used. Now deletes
on 404 and 410 and returns removed and allFailed.

That last one is the fourth guard found this week that was written and could
never fire: SchoolActionsCard already had the "we have cleared the devices that
had gone for good" sentence and already read data.removed, and the route never
sent one. Same shape as the passport fallback, the badge clip guard and the
countdown audio. The pattern to distrust: handling written for a signal that
nothing upstream actually raises.

**DiGi called Ada by the wrong name because it only ever knew one child
(28 Jul).** JP saw DiGi say "one sentence to Alma" about a child called Ada.
Alma is one of our own DiGi Squad characters, so the first read was a leaked
character name. It was not.

The children query asked for is_primary and nothing else, so DiGi genuinely did
not know a family's other children existed. In a house with more than one it
answered about the primary child whatever the parent meant.

The guard made it worse rather than better. A previous wrong name report had
added a rule naming that one child and forbidding every other name "not even
once". That does stop an invented name, but with several children it converts a
wrong name into a locked in one: DiGi was explicitly instructed not to switch
even when the parent said the other child's name themselves. It could not take
the correction.

Now DiGi is given every child on the account and told those are the only names
it may use, that the parent's own words decide which child is meant, and that if
a parent names a child mid conversation it follows them. Unclear means say your
child or ask, never pick one and hope.

The lesson is about the shape of the first fix, not the model. A rule that
pins one value and forbids all others looks like a tightening and is actually a
narrowing: it removes the ability to be right later. Constrain the SET of
allowed answers, then let the evidence choose within it.

JP's larger asks from the same session (walk a parent through device settings
and hand them back, settings strength that scales with age, defaults on, a feed
assessment for worried parents) are written up in
plans/digi-device-settings-plan.md rather than half built here.

**DiGi answered about TikTok when asked about home WiFi, because the WiFi guide
did not exist (28 Jul).** JP tapped "DiGi can walk me through it" on home
broadband and got the TikTok walkthrough again plus the agreements line. On the
Fire tablet the same button worked.

Both halves of that are explained by one fact: there are 24 rows in
device_guides and not one is a router. firetablet is a real row, so that button
grounded properly. broadband was never a row at all, and the button did not even
pass a device key, so the route loaded no guide and DiGi filled the silence from
earlier in the conversation.

Three changes. Migration 118 adds the home broadband guide, first in the list at
sort_order 5, because router filtering is the only layer covering every screen
in the house at once including the ones with no controls of their own. The
button now passes device=broadband. And when a parent clearly asks how to set
something up and no guide is loaded, DiGi is told to say we do not have that one
written yet rather than improvise, because a parent following invented settings
believes the house is covered when it is not. The loaded guide also now states
that any earlier device topic is finished.

min_age 4 on the router row so it never trips the passport's ahead of age
warning. A router is not something a child owns too early, it is the house.

The content names the real UK providers and, more importantly, names the gap:
this covers WiFi only, so a phone on mobile data is unfiltered and needs the
network's own content lock. A guide that does not say what it fails to cover is
how a parent ends up confidently wrong.

**The home broadband guide existed all along, and I nearly shipped a second one
(28 Jul).** The WiFi bug was real: the Devices button asked DiGi to walk a
parent through home broadband without naming a guide, so the route loaded none
and DiGi answered from whatever was last in the conversation. That is the TikTok
answer JP saw. The fix is one word, device=home_broadband.

The diagnosis around it was wrong. I checked migration 014, which seeds 24
devices with no router among them, and concluded the catalogue had none. The
router guide arrived later in 077 under home_broadband. Reading the first seed
file and concluding what the whole catalogue holds is the same error as reading
one branch of an if and concluding what the function does. Migration 118 as
first written would have inserted a rival guide under the key 'broadband', and
the app would have carried two competing home broadband guides with whichever
the button named being the one a parent saw. Nothing would have looked broken.

Caught by checking the live database before applying rather than after. Worth
keeping as the habit: the repo tells you what was intended, only the database
tells you what is there.

118 is now an update rather than an insert, and does the part still worth doing.
The guide was three steps and stopped before the two that decide whether the
filter holds: the router's own admin password, which is printed on the box and
lets an older child switch everything off in a minute, and testing it before
trusting it. Five steps now, and the note names what the filter does not cover,
which is mobile data and VPNs. A guide that does not say where it stops is how a
parent ends up confidently wrong.

Migrations 117 and 118 are both APPLIED to the live database as of tonight.

**Device guides now have a review date and a monthly check (28 Jul).** JP: the
guides go out of date constantly, especially apps like WhatsApp, so research
them, run a monthly check, and get the steps age specific where possible.

The guides are the most perishable thing in the product. Apple, Google and Meta
move menus and rename toggles continuously. A stale guide is worse than no
guide, because a parent follows it, cannot find the setting or finds it does
nothing, and walks away believing the house is covered. Nothing recorded when a
guide was last looked at, so there was no way to know which had drifted.

Migration 119 adds last_reviewed_at (backfilled to now, so the first run has a
starting line rather than 25 overdue at once) and device_guide_candidates, the
review queue. /api/cron/device-guide-refresh runs monthly on the 2nd, takes the
six least recently reviewed, asks what has changed and what is missing, and
files everything as PENDING.

It NEVER edits a live guide. Same human gate as knowledge-refresh, and the
reason is stronger here: these are safety instructions, and a confidently wrong
step is the failure mode that actually hurts a family. The prompt is told
explicitly that returning nothing is a good answer, and a candidate without a
source URL is dropped before it reaches the queue, because a claim that cannot
be checked is not reviewable.

The batch is marked reviewed whether or not anything came back, since a guide
checked and found correct HAS been reviewed. Without that the same six would be
re-checked forever.

Age specific steps: the candidate rows carry age_notes keyed by band, and the
prompt is told to fill it only where the guidance genuinely differs rather than
where the wording would just be softer. The live guides do not render age notes
yet, so this collects the material first and the rendering follows once there is
something real to show.

Applied to the live database tonight. WHAT THIS DOES NOT DO: verify the current
25 guides. It schedules that work and routes it to JP for approval, it does not
retrospectively check them. The first run on 2 August covers the first six.

**The DiGi learning loop plan, and the one thing already right (28 Jul).** JP
asked for the full plan with the legal requirements step by step. Written to
plans/digi-learning-loop-plan.md.

The finding that changed the plan: the loop is already running. digi_wisdom (45
rows), digi_memory with embeddings, expert_knowledge with a human gated
candidate queue, wellbeing_checks, community_polls, digi_insights, all live, and
brain.ts and wisdom.ts already feed aggregateWisdom and whatWorked into every
prompt. What is missing is only the front door: nothing offers the parent three
replies, and nothing captures the one they write instead. So this is closing a
loop, not building one.

And digi_wisdom is already the SAFE shape, by accident rather than design:
topic, age_band, what_works, evidence_count, with no user_id and no child_id. It
learns which ADVICE works for an age, not what a child is like. That distinction
is the whole legal position. Protect it.

The mental health line, stated precisely, because JP was right to be cautious.
Helping a parent respond is unregulated. Screening a child is not: claiming to
detect, screen for, diagnose or predict a condition can make the product
Software as a Medical Device under UK MDR 2002, which is MHRA registration and a
different company. The line is drawn by the CLAIM. So: DiGi describes what the
family logged and what helped other families, and never characterises a child.
The feed assessment gets framed as what is this feed showing them, a content
question about the platform, not what is wrong with this child.

Also flagged: wellbeing_checks already holds mood, sleep and concern level
against named children. The Article 9 special category question is live TODAY,
not when the new work ships. A DPIA is mandatory rather than advisable, and the
ICO expects it before processing, so it is genuinely blocking rather than
paperwork to catch up on.

The Children's Code standard most often missed and most relevant here: if a
parent can monitor a child, the CHILD has to be told, age appropriately. That
applies to the kid app, the timer and the check ins as they already exist.

Position taken on pricing: the loop itself should never be a paid tier, because
gating it starves the thing that makes it work. Sell depth, history and the
school aggregate, which is de-identified by nature and therefore the part that
can be sold ethically at all.

**Two device counts on one screen, neither explained (28 Jul).** JP: it says 3
devices and I can see those, but underneath it says device coverage 2 out of 13.

Both numbers were right and they count different things. The list at the top is
family_devices, the screens this family has told us they own. The ring is SETUP
GUIDES filtered to the child's age, plus the network row and the app rows, which
is a different set and a bigger one. Nothing on the page said so, so a parent
who has listed three devices and then reads 2 of 13 has no way to reconcile
them, and the natural reading is that we have lost track of their house.

Fixed by saying what the number counts, in the parent's words and with the age
in it, rather than by changing either number. Both were accurate; the page was
just silent about the difference.

Worth generalising: a bare fraction is only legible when the denominator is
obvious. 2/13 next to a list of 3 things is an invitation to distrust the whole
screen. Any ratio in this product should be able to finish the sentence "2 of 13
WHAT".

Also added a back link to the Device Safety Hub. It is reached from Home, the
passport and DiGi and had no exit of its own, leaving a parent to the browser
back button. Same pattern the phone setup and lesson pages already use. JP's
wider point stands and is in plans/digi-device-settings-plan.md: a way back to
the page that led here is good practice everywhere, not just here.

**Go-live items 2 to 5 built, and item 5 did not exist (28 Jul).**

CHECKING 5 WAS THE FIND. There is no account deletion route and no button, and
the privacy policy has always said "if you close your account or ask us to
delete your data, we remove it". A written promise with nothing behind it, on
the one right people actually exercise, with a one month statutory deadline
attached. Honouring it meant Justin going into the Supabase dashboard by hand.

The cascades were already right, which is why this is a small fix: auth.users
to profiles to children, and wellbeing_checks.parent_id to profiles. Deleting
the auth user always would have taken the family with it. Nothing could ask.

The related defect: child_id on wellbeing_checks, digi_feedback and digi_memory
was ON DELETE SET NULL. Removing one child from a family that stays left the
health rows behind with the id nulled. For ordinary data that is tidy history.
For special category data it is the worst case: the rows survive, cannot be
attributed, cannot be produced for a subject access request, and have no lawful
basis left. Orphaned health data is not anonymised data, it is data you can no
longer account for. Migration 120 makes all three CASCADE and clears what was
already orphaned.

2. Privacy policy has a section on the check in written in JP's voice, saying
what it is, that it counts as health information, that consent is asked
separately, and that DiGi will tell you what you logged but never what is wrong
with your child. Retention is now stated: two years for check in entries, six
for payment records because HMRC.

3. Consent gate in front of the check in. Unticked by default, since a
pre-ticked box is not consent. Stores the wording VERSION as well as the time,
because consent is to a specific promise and a bare boolean cannot say which
one. Withdrawal deletes rather than flipping a flag.

4. KidPrivacyNote, permanently in the child's app. The welcome already
mentioned it, but the welcome shows once and is dismissed forever, so a child
who tapped past it had no way back to the answer. It says what a grown up CANNOT
see as plainly as what they can, and carries Childline.

Migration 120 applied to the live database.

**A quarterly legal watch on the insights board (28 Jul).** JP asked for it and
it is the right instinct: this product sits on law that moves, UK GDPR, the
Children's Code, the Online Safety Act and its phased duties, age assurance, and
the MHRA line between a guide and a medical device. None of them writes to tell
you.

The realistic failure is not a breach, it is drift. A duty commences in March,
nobody is watching, and you find out from a school's procurement questionnaire
or a journalist. Four reminders a year is cheap against that.

Migration 121 adds legal_watch_items. /api/cron/legal-watch runs on the 3rd of
January, April, July and October, reports what may have changed, and files it
PENDING. The insights board shows it first, sorted by commencement date, because
a duty landing next month outranks one that might arrive some day.

Built with harder limits than any other cron here, because being confidently
wrong about the law is worse than knowing you have not looked:
  - it files rows and does nothing else, never edits a policy or a setting
  - it is instructed NEVER to state that the platform is or is not compliant
  - an item with no source URL is dropped before the queue
  - confidence is recorded honestly and low is the expected answer
  - the email says in bold that it is not legal advice

Closing a row takes an optional note. In six months the useful thing is not
that an item was dismissed but WHY, and that is exactly what nobody writes down
and everybody later wishes they had.

Applied to the live database.

**The "two children from different accounts" report was not a breach, and the
bug underneath it is real (29 Jul).** JP opened the app on his phone and saw a
notification about "the device fights between Yusuf and Teo". He called it a
security breach and was right to.

It is not one, and the evidence is specific. The digi_prompts row containing
that text belongs to user 77ed6daa, which is j31phillips+qw@gmail.com, one of
JP's own Gmail alias test accounts, whose child IS called Yusuf. His main
account 674f6e8c has one child, Gus, and no row under it mentions Yusuf. Every
query in prompts/route.ts is scoped with eq('user_id', user.id). His phone was
signed into the test account and was shown that account's own data. Nothing
crossed between accounts.

What IS real: that account has ONE child, and the notification said two, naming
Teo alongside Yusuf. Teo comes from stale digi_memory rows written in earlier
test chats. DiGi read a name out of conversation history and treated it as a
second, current child.

Same root cause as the Alma bug the night before, in a route I did not fix.
prompts/route.ts still loaded is_primary only and had NO name rule at all, so
last night's fix covered the chat and left the notifications wide open. Worth
remembering: when a bug is "the model was given the wrong facts", fix every
place the facts are assembled, not the one where it was reported.

Both routes now state the complete list of children AND that memory can be out
of date, so a name in history that is not on the list is a child no longer on
the account and must be ignored rather than treated as a sibling. Naming the
staleness explicitly matters, because the model's natural reading of an old note
about Teo is that Teo exists.

Still worth doing separately: JP's test accounts carry years of stale memory
that will keep producing this. Offered to clear the orphaned rows.

---

## 29 July 2026 — the Next step bar, and Settings grows up

Two of JP's phone notes, plus one thing found while doing them.

**The bar colour.** It used --deep-teal (#2E2818). That token is a warm
espresso and it works on a full width marketing panel, but in a small floating
bar over the cream dashboard it reads as a flat black brick, which is why JP
called it black. Moved to --retro-green, which the token block already
describes as the friendlier dark panel. Lesson worth keeping: a dark token that
looks warm at section scale can read as pure black at component scale, so
"which token" is not the whole question, "at what size, over what background"
is the rest of it.

**The bar repetition.** It allowed two appearances per session in
sessionStorage, which resets every visit, so the same nudge arrived every day.
Now one appearance per step, ever, in localStorage, recorded the moment it
lands rather than when the parent acts, so Not now, Go and walking away all
retire it equally.

**Settings.** JP asked for a Duolingo shaped place holding log out, children
and birthdays, terms signed, devices and a control panel link. Profile,
children, sign out, school and delete already existed. Added the links block
(devices, notifications, quests and the child app) and a What you have agreed
to section.

Terms and Privacy are agreed by creating an account, and signup says so in as
many words, so the join date IS the agreement date. No new column, no second
tick box pretending to be more meaningful than the first.

**The thing found on the way.** The wellbeing consent wording promises "You can
stop any time in Settings, and when you do, what we hold is deleted". The route
to do it has existed since migration 120. Nothing in the product ever called
it. That is the same pattern as the passport fallback, the badge clip guard,
the push test cleanup and the privacy policy deletion promise: a handler
written correctly that could never fire. Under UK GDPR withdrawing Article 9
consent has to be as easy as giving it, so a withdrawal only Justin could
perform by hand was not a withdrawal. There is now a button.

Running count of that pattern: six. It is the most common defect in this
codebase by some distance, and it never shows up in a typecheck or a build. The
check that catches it is asking, of any guard or promise, what would have to be
true for this to run, and then whether that is ever true.

---

## 29 July 2026 — devices: one list, not two

JP: *"Still a bit unclear on devices it's confusing have 2 lists should it just
have suggested list of devices by age ave add devices and then they add and set
settings so it's marked as set then returns to updated list of devices?"*

He was right, and the loop he described is the one the whole category uses.

The page had three things counting devices: his own two screens in one card,
our twenty six published guides in another, and a coverage ring reading 3 of 26
that counted a third set again. He had already reported the count mismatch once
("it says 3 devices sbd cdn see thst but underneath it has device cuversge 2
out of 13"). Explaining the ring in small print, which is what I did last time,
treated the symptom. The disease was three lists.

Mobbin first, per CLAUDE.md. Google Home, SmartThings, Roku and Alexa all show
ONE list, your devices, plus a single add control. Not one shelves a catalogue
beside it. Alexa puts the suggestions inside the same list as dashed rows, which
is exactly JP's "suggested list of devices by age". Chime, Deel and Revolut
answer the other half: status on the row, so you tap it, do it, and come back to
a row that has changed.

Built: YourScreens. The family's own screens, each with its status on the row
and its guide inside the row. Mark as set up flips the row, collapses the guide
and moves the count. Dashed suggestions underneath, age matched, capped at
three, each addable with a plus and dismissible with a cross. One add control
carrying the search. The catalogue folded away behind Browse every guide.
Coverage board keeps only the layers the list cannot show: the network under the
screens and the apps on top.

The important part: NONE of this needed a migration. family_devices.guide_key
has pointed at device_guides.device_key all along, and homeSetupCount already
counted the family's own list. The passport was already honest. Only the devices
page was telling a different story from its own data.

Worth keeping: when a screen and its data disagree, check which one is wrong
before building anything. Twice now the fix has been presentation, and twice the
first instinct was to add explanatory copy. Explaining a confusing screen is a
tell that the screen is wrong.

Also: my first pass at the suggestion rows put a "We have this" text button
beside a subtitle, which left the subtitle about ninety pixels to wrap into and
made every suggestion four lines tall. Caught it on the 390 screenshot before it
went near JP. The row is now the tap target with a plus at the end.

---

## 29 July 2026 — tidy up after PR 592 merged

Three loose ends, one of them mine.

**DeviceList still had its own copy of the guide panel.** I extracted GuideBody
in the devices restructure precisely so the steps panel could not be written
twice and drift, then left the original copy sitting in DeviceList. Sixty lines
of duplicate that would have diverged the first time anyone edited one of them.
Now deleted, with the not owned escape passed in as the footer.

Worth noticing: extracting a shared component is only half the job. It is not
finished until every old copy is gone, and a green typecheck will happily tell
you the duplicate is fine.

**All seventeen dev harnesses were live on the public site.** /dev/your-screens
would have served a real page on guidedchildhood.co.uk, and robots.txt never
disallowed /dev, so they were crawlable too. Nothing leaks, they all render fake
props, but they are half finished looking pages under our own branding, and a
parent or a school finding one reads "broken", not "test harness".

app/dev/layout.tsx now returns notFound() when VERCEL_ENV is production.
Deliberately NOT NODE_ENV, which is production on preview builds too and would
have killed the harnesses exactly where they are most useful, on the preview
attached to a PR. /dev added to robots disallow as well.

Verified rather than assumed: built with VERCEL_ENV=production, served it, and
curled. The harnesses 404 while /join still returns 200. Given how many times
this session the bug has been a guard that could never fire, checking that this
guard fires seemed like the minimum.

**ICO registration written up properly** in the go live checklist. It was one
vague line saying "about £52 a year". It now says what the single registration
actually is (the data protection fee, tier 1, £47 by direct debit), the one
question on the form needing a decision (no DPO, because we are not yet large
scale, review as we grow), and the four things people assume are registrations
and are not: the DPIA, the Children's Code, the ROPA and the privacy policy. The
ROPA one matters most, because the under 250 staff exemption falls away as soon
as you touch special category data, which we do.

---

## 29 July 2026 — the quest lifecycle, verified and made visible

Picked up from another session's handover. Justin's line was "I believe the
logic is right but I cannot see it working", which turned out to be exactly
right on both halves.

**The logic is right.** Verified against the code rather than taken on trust:

- Minutes come only from approved ticks. bank.ts filters
  `status === 'approved'` before summing. The child's tap writes `'pending'`
  (tick/route.ts), so a tap earns nothing until a parent says yes.
- Rejection sets `'rejected'` and leaves approved_at null. The same filter
  excludes it, so a no costs nothing and adds nothing.
- Path B cannot stick in a waiting state, and structurally rather than by luck.
  Only the child's link token can create a pending row, so a house with no child
  app has no way to produce one. The parent tick branch writes `'approved'`
  directly, and it promotes an existing pending tick rather than inserting a
  duplicate, which is what stops the queue filling with ghosts.

**But there was a real stuck state, in path A, that nobody had asked about.**
/api/quests loaded ticks with `.gte('tick_date', weekAgo)`. Seven days. A
pending tick older than that fell out of the window entirely: still pending in
the database, never rendered, therefore never approvable, therefore never
counted. A child ticks a job, the parent does not open the app for eight days,
and the stars are gone with nothing on either screen admitting it.

Fixed by loading every pending tick with no date bound at all and merging it
with the windowed history, deduped by id. The window is right for history and
was only ever wrong for the pile that is waiting on a person. There is no
natural cap on how long a parent takes to say yes.

Worth keeping: a time window on a query is a product decision disguised as a
performance one. Ask what falls off the end and who pays for it.

**The view.** The states were spread across three cards further down the page,
so the summary was accurate and invisible. Mobbin first: monday.com's My work
puts count tiles at the top that ARE the filter, Jobber pairs a selected chip
with a heading naming the filter, Tiimo groups with a count per group. All three
agree the count and the filter should be one control, so that is what
QuestStatusBoard is. Four buckets that are the actual lifecycle: waiting on you
(pending, the only one that costs anybody anything while it sits), on their app
(path A, sent, not ticked), to do with you (path B, no child app), done
(approved). Rejected has no tile, on purpose.

One accepted quirk: a recurring job with an old unapproved tick appears in both
waiting on you and on their app. Both statements are true, an unapproved tick
from before and today's instance still to do, so it stays.

---

## 29 July 2026 — the notification split, and Home's tail

Justin answered the open question: **short factual nudges, plus ONE DiGi
reflective card.** That decision turned out to also be the fix for Home being
too long, so both were one job.

**What Home's tail actually was.** DigiStreakWidget, then DigiPrompts, then
SmartAlerts. DigiPrompts mapped over EVERY live prompt, so a family with three
of them met three full width cards in a row, each with the same star avatar and
roughly ten lines of body at 17px and line height 1.68. SmartAlerts then did the
same thing slightly smaller: emoji tile, title, a line and a half of body, and
its own button, twice. Two card stacks back to back. That is why Justin was
scrolling past his own advice.

**Mobbin first, and four apps agree independently.** Withings Health Mate splits
Highlights, a single big card, from Read, a list of compact rows. Plenty of Fish
does For you then Latest identically. Apple Store follows its activity cards
with a compact chevron row. And komoot puts Show more under a long body rather
than printing all of it. So: one rich card that can be expanded, then rows.

**Built.** DigiPrompts renders ONE prompt, body clamped to two lines with Read
the rest. The others are not discarded, they are rows in the database with their
own status, so dismissing brings the next forward and anything untouched is
there tomorrow, with a quiet "2 more when you want them" so a parent knows the
thinking exists. SmartAlerts became one line rows: emoji, title, the CTA as a
mono sub label, whole row is the link, body dropped entirely.

Dropping the body rather than truncating it was the deliberate call. If a fact
needs a paragraph to make sense it is not a nudge, it is the reflective card
above. That is the rule the split gives us and it is worth holding to, because
the failure mode here is every nudge slowly growing a paragraph again.

Measured at 390: the whole tail is 614px, and expanding the card adds 400px. So
the clamp alone saves 400px, before counting the two prompt cards that no longer
render at all.

A quieter Home does not mean less thinking. It means less of it shouted at once.

---

## 29 July 2026 — the child app was installing the parent app, and Manage jobs

**The PWA bug, which was real and old.** Justin: "the pwa to child phone did not
happen". It never could have.

app/layout.tsx hardcoded `<link rel="manifest" href="/manifest.json">` and
`<link rel="apple-touch-icon">` into the head, immediately below a metadata
export that already emitted both. Duplicates, and being hardcoded meant they
appeared on EVERY route and no nested segment could override them.

/manifest.json says `start_url: /dashboard`, `scope: /`. So a child who followed
our own on screen instructions and tapped Add to Home Screen installed the
PARENT app: the icon opened /dashboard, which has no session for them, and
bounced them to a login they cannot pass. Android offered the same install under
the name Guided Childhood.

The same hardcoding beat app/k/[token]/apple-icon.tsx, whose own comment says
Add to Home Screen picks it up automatically. It could not, and the DiGi star
icon has never once appeared on a child's phone.

Seventh instance this session of the pattern. New wrinkle worth noting: here the
thing that could never fire was defeated not by a bad condition but by a
DUPLICATE sitting higher up the tree. Overriding inherited config only works if
nothing hardcodes the same tag above you, and a hardcoded tag and a metadata tag
do not merge, the first one wins.

Fix: head is metadata only, /k/[token] gets a manifest per token with start_url
and scope on the child's own page. Verified by serving a production build and
curling: kid page points at its own manifest and star icon, marketing points at
ours, exactly one manifest link on each.

No child name in that manifest, deliberately. It lands in the phone's app list
and in backups, and "My Jobs" is something a child can own without their name
printed on a device that may be shared or handed on.

**Manage jobs.** Three asks, and one of them dissolved on inspection.

Landing: addOpen now defaults true. Manage jobs exists to add a job and it was
landing on the list with Done as the only visible action.

Used before: DELETE sets active false, and GET only ever read active true. So
the app has been holding every job each family ever used and never offered one
back. A parent who took reading off over the summer had to retype it in
September. The API now returns them, deduped by title, and the add panel leads
with them, above our own templates.

"Run the same as yesterday" dissolved: jobs are recurring with schedules, so the
board ALREADY runs the same as yesterday unless somebody turned something off.
The only real version of that ask is putting back what was turned off, which is
the used before list plus a "put all N back". Worth saying rather than building
a second thing that silently means the first.

---

## 29 July 2026 — the child app's welcome intro looped

Justin: tapping the Quests chip in a lesson "drops back to welcome intro", and
the all characters welcome should only run once a week.

Once a week was already the intent and the weekly gate was already written. It
held across DAYS and failed completely inside a single visit.

squadIntroDue caches this open's answer in sessionStorage so that a REMOUNT
mid play cannot yank the intro out from under the child, which is a real bug
somebody already hit and fixed. But it only ever wrote '1'. Nothing ever wrote
'0'. So once an open was marked due it stayed due for the whole session: open
the app, watch the intro, tap into a lesson, tap Quests to come back, and the
entire squad plays again. And again.

Fixed with squadIntroFinished(), called from finish() and from pagehide. NOT
from markPlayed at the start, because that is precisely the remount case the
cache exists to protect, and settling on the first frame would reintroduce the
older bug. '1' while playing, '0' once it has finished or the child has left the
page.

Proved rather than assumed: replayed the gate logic against a fake storage over
four screen visits. Before, intro, intro, intro, intro. After, intro, quests,
quests, quests.

The second half of Justin's ask turned out to already exist. KidSplash is the
one buddy hello, gated once per session, so the shape he described (full squad
weekly, single character every other open) is what the app does as soon as the
weekly one stops looping.

Pattern worth keeping: a cache with one writer. Anything that decides once and
stores the answer needs a path that stores the OTHER answer, or the first
decision becomes permanent. Same family as the six guards that could never fire,
but the reverse: this one always fired.

---

## 29 July 2026 — Manage jobs is a page now

Justin, twice, and the second time sharper: "it should clearly goto a new page
not scroll", and "every time job added it give you option to add another not
scrolling away".

The first pass this morning only opened the panel by default. That missed the
point. It was still a card expanding inside a long Quests page, with a Close
button on it, which is not what pressing a tile called Manage jobs should do. A
thing you navigate TO should be somewhere you have gone, not somewhere you have
scrolled.

/dashboard/quests/manage now exists and the tile points at it.

Mobbin first. Todoist answers the add another half exactly: adding a task drops
a small "Task added" pill at the TOP while the composer stays where it is,
empty, ready for the next. Superlist, Amie and Evernote all do the same, a
dedicated compose surface where the confirmation never displaces the input.

Three sections, which is what he asked for: mark one done (pending ticks, first,
because somebody is waiting and the stars are not theirs yet), what the child
asked for (quest_requests, yes or no), and add. Then the board itself, so "what
have we got" is answered without going back.

Two things caught by measuring rather than looking:

1. The confirmation pill wrapped to two lines with a long job title and pushed
   the input down 26px. A confirmation that moves the thing you are about to
   touch is the exact bug it exists to prevent. Pinned to one line with the
   title truncating, and the slot is a fixed height. Measured 847 before and 847
   after, so zero shift.
2. Printing all 27 ideas made the page 6558px tall, which is the scrolling the
   page was built to remove. Six, then Show all.

Worth keeping: "make it a page" and "make it not scroll" are the same request
twice, and the second one is easy to satisfy on paper and lose in the details.
The page is only better than the panel if the page itself is short.

---

## 29 July 2026 — Add a routine gets its own page too

Justin, on the new Manage jobs page: "button for add routine of jobs needs to be
bigger and at the moment just takes to quest home page but needs to goto add
routine separate page which then needs a bottom back to add a job".

All three fair. The link was small mono text, which read as a footnote, and it
pointed at #routines on the Quests page, so pressing it dumped a parent back
into the middle of the page they had just left. Exactly the same fault the
Manage jobs tile had before this morning, one level down. Worth noting: fixing a
navigation pattern in one place leaves every link that USED the old pattern
still pointing at it.

/dashboard/quests/routines now exists, the link is a full width button, and the
new page carries a back at the top to Manage jobs and a full width "Back to add
a job" at the bottom. The bottom one is the point: adding a routine and adding a
job are the same errand in a parent's head, so finishing one should offer the
other rather than leaving them to find their own way.

The pick before you add behaviour came across intact: jobs already on the board
show greyed and ticked and disabled, and the button counts only the fresh ones,
so tapping twice can never double up.

---

## 29 July 2026 — how a job reaches the child, and two more pages

Justin: "as I have downloaded this child's app how do we deal with this, when
adult adds they need to know. Should it prompt scan this code on child's phone
to get it added, and show QR code or manage yourself here". Plus two more
buttons, screen timer and balance and stats, as separate pages.

**The handover.** Everything needed already existed: QrHandoverModal and
ShareQrButton, which creates the link on demand. What was missing was any of it
appearing where a parent ADDS a job. So a parent could add six jobs on their own
phone with no idea whether any of it landed anywhere.

Manage jobs now says which of the two worlds this family is in, at the top,
before the adding. With an app: anything you add appears on their phone straight
away, and the code is there again if they need it. Without: this child has no
app yet, scan a code on their phone, or carry on and mark jobs off yourself
here. Both are legitimate and the copy says so rather than making the no phone
route feel like a failure.

**Two more pages.** /dashboard/quests/timer now hosts the timer on its own.
Justin is right that it did not belong at the top of Balance and stats: starting
twenty minutes of TV is something you do in the moment with a child next to you,
and reading the week is something you do sitting down. Balance and stats already
existed at /dashboard/stats and just needed a button.

**Spotted while in there, not fixed.** The stats page says "AIM FOR TOMORROW 210
min" for a 13 to 15 year old, because it spreads the unused weekly budget across
the days remaining. 840 minutes over 4 days is 210, which is three and a half
hours, and the copy underneath says tomorrow "can be up to 210 minutes without a
second thought". A page built to encourage balance is telling a parent to aim at
nearly double the daily guide. It is arithmetically correct and behaviourally
backwards. Same family as the weekly reset work, so worth deciding together.

---

## 29 July 2026 — the child could not tell a job was new

Justin, after linking a job to Yusuf's app: "where is the add notification, it
should be on first glance for child".

Fair, and the gap was total. A parent adds a job on their own phone, the child
opens their app, and the new job sits in the list looking exactly like the five
that were already there. Nothing marks it.

/api/quests/ping already fires a push on add, which is why this looked handled.
But a push needs permission, and a child who never granted it saw nothing at
all. A notification is not the same as the app telling you something, and only
one of those works unconditionally.

The kid page was not even selecting created_at, so the screen had no way to know
which job was new even if it had wanted to. Added, plus a banner above the Today
list, before the count, which is where "first glance" actually is.

Latched the same way as the setup bar: worked out ONCE on mount, held in state,
and the clock stamped immediately. Stamping first would clear the answer before
it rendered; holding without stamping would show "new" for ever. That is the
third time today the shape has come up (the setup bar, the squad intro loop, and
now this), so it is worth naming as a rule: anything that decides once and
stores the answer needs a writer for BOTH answers, and the decision has to be
read before the write lands.

localStorage rather than the database on purpose. "New since YOU last looked" is
a fact about the device in the child's hand, not about the account. First ever
open records the clock and shows nothing, because on day one everything is new
and a banner saying seven new jobs is just the list again in a box.

Simulated across six visits before committing: first open 0, quiet reopen 0, one
added 1, reopen 0, two added 2, reopen 0.

---

## 29 July 2026 — timely job reminders on the child's phone

Justin: "jobs still outstanding but around job time, either before school or
after school, so clever enough that bed not made before, clothes ready for
tomorrow, so looks at job type and works out timely reminder."

The signal was already there. Our own templates and routine packs were written
around the shape of a school day, so the words carry the hour: bed made, teeth,
shoes on are morning; homework, reading, outside are after school; tomorrow,
tonight, charge downstairs are evening. Keyword matching against language we
wrote ourselves, not free text guessing.

Three crons, one per band, at 07:15, 16:30 and 18:45. A parent's own wording
falls through to after school, which is the safest default because it is the
longest stretch of a child's own time and the hour they can actually act.

The restraint is the design, not a limitation:
- ONE push per child per band however many jobs are outstanding. Five things
  left is one message, not five.
- Nothing at all when nothing is outstanding. Being quiet when there is nothing
  to say is what makes the message mean something when it arrives.
- Anything ticked today counts as handled, PENDING included. The child has done
  their part and is waiting on a grown up, so chasing them would read as us not
  noticing.
- Linked children only. No fallback to the parent, because chasing a parent
  about their child's bed is the nagging this product exists to replace.

Children's Code point, worth writing down: this is a plain factual reminder
about a thing the child agreed to. No streaks at risk, no countdowns, nothing
built to pull them back into the app. A reminder that a job is undone and a
reminder that we miss them are different things, and only the first one is
allowed.

Caught by the test rather than by reading: "School bag packed tonight" landed in
morning, because the morning rule matched "school bag packed" and tonight was
not in the evening list. Exactly the case Justin named with "clothes ready for
tomorrow". Fourteen cases now pass.

Cron times are UTC, so these drift an hour against BST. 07:15 UTC is 08:15 in
summer, which is late for before school. Worth fixing properly with a per family
local time rather than by nudging the numbers.

---

## 29 July 2026 — the parent's push prompt could be silenced for ever

Justin: "why am I not getting pwa from Yusuf's jobs on parent's platform, and if
not set up this will stay broken, so how can in app check auto prompt parent?"

Both halves right, and the second half is the diagnosis.

Push to the parent IS wired. A child ticking a job posts to /api/push/send with
the parent's user id. But with no subscription that call is a silent no-op, and
the ONLY thing that would ever have told the parent was the PushPrompt card,
which line 234 hid permanently the moment it was dismissed once.

So: tap it away on day one, and never again be told your child has done
anything, with no way of finding out why. The approve loop, which is the spine
of the whole star economy, silently does not work and nothing says so.

Seventh instance of the family today, in a new flavour. The others were guards
that could never fire. This is a warning that could be permanently switched off,
which is the same failure seen from the other end: a signal that cannot reach
the person who needs it.

Fixed by making the dismissal expire after a fortnight rather than for ever.
Long enough not to nag, short enough that a family cannot spend a term wondering
why the app is silent. The old permanent '1' flag reads as an expired dismissal,
so existing families get asked once more rather than staying broken because of a
tap they made weeks ago. Verified across four states.

Worth generalising: a dismissible warning about something BROKEN is not the same
as a dismissible offer. Dismissing an offer means no thanks. Dismissing a
warning means not now, and treating the two the same is how a product ends up
silently not working for somebody who once tapped a cross.

---

## 29 July 2026 — notifications landed on a menu, not the decision

Justin: "when we click on notifications it should, to approve, take straight to
approve page not quests general menu."

Every parent push sent url: '/dashboard/quests'. So "a quest is ready for your
ok" landed on the whole quests page and the parent had to go hunting for the
thing they had just been told about. The notification did its job and then
abandoned them one step short.

Split by whether there is a DECISION to make. Seven now point at
/dashboard/quests/manage, which leads with Waiting on you, so the tap lands on
the Done button: a child ticking a job, finishing a path, a printable, a quiz, a
chest, asking for a job, asking for more. The rest still go to the quests page,
because a timer starting or a goal being redeemed is news rather than a
decision, and sending news to a decision screen is the same mistake backwards.

Only possible because Manage jobs became a real page earlier today. Before that
there was nowhere to send them: the approve queue was a card halfway down the
page they were already landing on.

Worth keeping: a notification is a promise about where you are about to arrive.
Landing somewhere that merely CONTAINS the answer is a broken promise, and it is
the kind that never gets reported as a bug because the parent assumes they
misread it.

---

## 29 July 2026 — DiGi said two children because there were two children

Justin: "digi says I have 2 children where is it getting that from ... this was
my daughter Alma but changed to Ada now. Is it because we ran an update giving
new in database?"

Two questions, one answer. Not a database update, and not a stale memory. The
children table has two rows on his account, and DiGi was reading it correctly.
PR 592 had already made the prompt rules airtight about names, and those rules
explicitly forbid inventing a sibling or claiming more children than the list
shows, so a model saying "two" meant the list said two.

How the second row got there: three separate paths create a child. Onboarding
and the starter pack both guard on "no existing children", but the add a child
form on Quests inserts unconditionally, which is right for a real second child
and is also what happens when a parent means to RENAME one. Alma became Ada by
addition rather than edit.

And then nothing could undo it. Nothing anywhere in the product could delete a
child row. Three creators, no remover, so an account could only ever accumulate.
Every screen that counts children kept counting, honestly, forever.

The database half of the fix had been sitting finished since this morning:
migration 120 moved child_id to CASCADE on the sensitive tables, and most others
were CASCADE from the day they were written. So removal was fully supported and
completely unreachable. The eighth instance today of a capability with no way to
ask for it, and the first where the missing path was itself the reported bug.

Now in Settings, per child, once there is more than one: type the child's name to
confirm, the main child hands over if it was them, and a line above says how many
children the account holds, because a parent had no other way to check the number
DiGi is reading.

Migration 122 closes the one table that would have kept talking: digi_prompts was
SET NULL, so a removed child's cards would keep arriving by name with nothing
able to stop them. A card is not a record, it is something shown, so it goes with
the child.

Two things I nearly got wrong, both caught by checking rather than reasoning:

- I wrote the obvious orphan cleanup, "delete prompts where child_id is null",
  copying migration 120's shape. On digi_prompts that would have deleted every
  school notification on every account, because the school inbox inserts cards
  with no child_id by design. Null means orphaned OR perfectly normal, and the
  row cannot tell you which. 120's cleanup was safe because a wellbeing check
  with no child is meaningless; the same line one table over is data loss.
- quest_ticks.child_id has no foreign key at all, which reads as the gap that
  would leave orphans. It is not: a tick only exists against a family_quest, and
  that cascades from the child.

Worth keeping: when a count looks wrong, check whether the number is wrong before
deciding the reporting is wrong. The prompt rules got two rounds of hardening for
a name problem that was real, and this second complaint on top of them was not a
regression at all, it was the data. Also: the same migration pattern is not safe
in two places just because it worked in one. Ask what null MEANS in this table.

---

## 29 July 2026 — the child could not say what job they wanted

Justin, on the child app: "here on child's app you should be able to suggest
quest to parent, there is a page that should open." And separately: "I added
Yuseuf child app to Home Screen but it's not asking me to set up notifications
PWA?"

Two reports, one cause underneath: both features were finished and both were
somewhere a child would never find them.

### The ask

The New job tile called /api/quests/more, which sends a bare "wants more quests"
push and stores nothing. There was no way for the child to say WHAT they had in
mind. Then, having sent it, the tile flipped to "Asked, grown up knows" and its
onClick did nothing at all, so the one thing a child would press became a dead
end that looked like a status light.

Meanwhile /api/quests/request has always done the real thing: the ask lands as a
row with a title, capped at five open and five a day counted from UK midnight,
the parent's phone names the actual idea, and one tap on Manage jobs turns it
into a real job with stars. The UI for it existed too, inline at line 1630 of a
2,842 line screen, under the printables and the coming up list.

So the tile pointed at the weaker of two routes and the better one was buried.
Now it is /k/<token>/suggest, its own page, reached from the tile and from a
lead in card where the panel used to be. One implementation, extracted so the
page and the screen cannot drift.

The page also shows what happened to each idea, which the ping never could:
WAITING, IT IS ON, NOT THIS TIME. A child who asks and then has no way of
finding out is being managed, not included.

### The reminders

The offer was there. It was a quiet white button 2,150 lines down, below
everything. Justin added the app to the Home Screen and was never asked, because
nobody scrolls to the bottom of their own jobs list looking for a settings
button. Moved to the top, above the jobs, in butter.

This one is worse than an ordinary missed button. The timely job nudges built
this morning push to the CHILD's device and nowhere else, on purpose, because
chasing a parent about their child's bed is the nagging this product replaces. A
child who never turned reminders on does not get a quieter version of the
feature, they get none of it, and three crons run every day and send nothing.

So it has a Not now that comes back in three days rather than a cross that
silences it. Refusing has to be allowed, but this is an offer whose refusal
switches a feature off, and "never again" on one mis-tap is how a feature ends up
permanently dead for a family who would have wanted it. Sits between the two
rules recorded earlier today: not a warning dressed as an offer, not a nag.

### Caught by looking, not by reasoning

The extracted component put three lines of text outside the white card, directly
on the dark kid background, still using ink colours. Almost invisible in both
states. The screenshot showed it immediately and no amount of reading the diff
would have. Worth keeping: the kid app has a dark background and the parent app
does not, so ink coloured text is safe in one and unreadable in the other, and
moving a component between them is exactly when that bites.

Also, again: `pkill -f "next start"` killed my own shell, second time today, and
this time it did not even kill the server, so the next page load served a stale
build and looked like a 500 in my new code. Kill by PID.

---

## 29 July 2026 — "Nothing more to do" was why the pings never came

Justin: "pings not arriving on either app, and the button that says send test
[does not work], and not prompting each app to add notifications."

Three symptoms, one wrong idea underneath: the app treated push as a thing an
ACCOUNT has, when it is a thing a DEVICE has.

/api/push/status counted subscriptions on the account. One row anywhere meant
setup was done, and the card then said "Check ins are on, on another device.
Nothing more to do." On the phone in his hand that sentence was false. A
subscription is one browser on one machine, so a parent subscribed on their
laptop receives nothing on their phone, and the app was confidently telling them
the job was finished on the only device where it had never been started. It also
closed down the one question that would have found the problem.

The account count was not wrong. The conclusion drawn from it was. Worth keeping:
a true fact and a false reassurance can be the same sentence.

Two more of the same shape, found while fixing it:

- **The test lied on success.** /api/push/test fired at every subscription on the
  account, and the card said "Sent. It should appear on this device within
  seconds." Two different claims. Testing on an unsubscribed phone sent the
  notification to the laptop upstairs and reported it as arriving here. A false
  pass is worse than a failure, because it ends the investigation: push looks
  proven and the pings still never come. Now the caller names its own endpoint
  and only that device is tested.

- **Granted is not subscribed.** The card showed "Check ins are on" on
  Notification.permission alone. A reinstall, a cleared cache or an old service
  worker leaves permission granted with nothing registered, which is exactly the
  "says on but nothing arrives" state the Reset link was built for. The branch
  now also requires that we actually hold a subscription for this device, with
  null (lookup failed) deliberately not counting as no, because a failed lookup
  must not take a working setup away from a parent.

## And the approve link, which I half fixed this morning

Justin: "this is not taking them to approve, it should take to exact page."

Earlier today I moved seven PUSH routes from /dashboard/quests to
/dashboard/quests/manage so a notification lands on the Done button. I did not
touch lib/notifications/collect.ts, so every notification IN THE APP still went
to the whole board. The same notification behaved differently depending on
whether it arrived on the lock screen or was read in the bell.

This is the exact lesson I wrote down this morning, in the same file, hours
before repeating it: fixing a navigation pattern in one place leaves every link
that used the old pattern still pointing at it. Writing the rule down is not the
same as searching for the other callers.

Not a blanket change, either, which is the second half of the fix. A finished
PRINTABLE goes to /dashboard/quests#printables-to-confirm, because the confirm
button lives on the board and nowhere else. Sending it to Manage jobs with the
ticks would have looked consistent and landed a parent on a page that cannot do
the thing the notification just promised.

---

## 29 July 2026 — the clinicians come off the advice (migration 123)

Justin, asked whether he had written permission to name Dr Becky Kennedy and
Catherine Knibbs: "I'd rather not name them, other than we have built a team of
researchers in the field to draw upon that follow our philosophy."

Settled, and done. The parent facing badges now read "Our research team":
weekly plan steps, the balance tips, the social insights. Migration 123 strips
the names from the seeded content a parent reads, which is daily_moments
expert_note and the lesson slide scripts, and the seed files are updated too so a
fresh database does not put them back.

The scope was worth asking about, because "do not name them" splits three ways
and only one of them is the risk:

- **Parent facing badges: removed.** A living clinician's name next to advice
  inside a paid product reads as endorsement whether it is meant to or not, and a
  parent who paid partly because of a name they trust has relied on something we
  never had permission to imply.
- **Names inside AI system prompts: kept.** A parent never sees them. They steer
  the model toward connection before correction and the nervous system framing,
  so stripping them makes the output worse in exchange for no protection.
- **Published academic citations (Odgers, Orben, Przybylski, Livingstone): kept.**
  Citing public research is not the same as attaching a clinician to our advice,
  and the marketing brief is explicit that every one is defensible.

Also kept: expert_knowledge.source_name, which is internal provenance shown only
on the insights board. Removing a record of where a finding came from would make
the product LESS accountable while looking more careful.

Worth keeping from the doing of it: I wrote the replacement chain, then ran it
over the real strings and READ the output. Three defects only visible that way.
Nested replace evaluates innermost first, so "Knibbs puts the nervous system at
the centre" fired before the "Catherine Knibbs puts..." variant and produced
"Catherine The research puts...". Dropping a name mid sentence turned "This is
Knibbs made practical" into "This is Made practical". And "Knibbs is clear that"
follows a full stop, so the lower case replacement started a sentence with a
small letter. A find and replace that looks obviously right is exactly the kind
that needs its output read, because the pattern matching is never the hard part,
the surrounding English is.

## 30 July 2026 — Holiday screen time is earned, not handed over

Justin: "when they run over, the stars and minutes earned higher than they can
use in a normal week ... maybe any extra should be used for holiday allowance.
We do need to let the child app know that any unused stars go towards holiday
amount, and when we say holiday it is the school holiday period."

**The decision, which he approved: the automatic holiday lift shrinks and the
earned bank carries the rest.**

The first pass at holidays gave every family a flat 1.6x daily guide in summer
and 1.4x at Christmas. That was the whole mechanic and it was the wrong one. It
contradicted the product's own welcome card, which promises screen time is
"earned from real world jobs, never just handed over": a child who did nothing
all term got exactly the same August as one who did everything.

The multipliers came down to 1.25 summer, 1.2 Christmas and Easter, 1.15 half
terms. They did NOT go to 1.0, because part of a holiday genuinely has nothing
to do with effort: no school run, later mornings, longer wet afternoons. That
much every family gets. Everything above it is now the holiday bank, which a
family gets as much of as it did the work for.

**Two rewards for two different behaviours, and they must not be confused.**

- UNUSED is time you had available and chose not to spend. Already pays, in
  sticker credits (migration 124). Rewards restraint.
- SURPLUS is work you did that the week had no room for. Pays into the holiday
  bank (127, 128). Rewards effort.

Neither can be earned by doing the other's behaviour, which is what stops one
cannibalising the other.

**Spendable only in a school holiday, never expires.** A balance you can see and
cannot touch yet is the entire mechanic; spendable whenever, it is just a bigger
weekly cap with extra steps. And it is the counterweight to the weekly reset:
the reset says you cannot stockpile ordinary screen time, the bank says the
extra work still counted.

Live before this: Ada had 94 stars binned in one week and Gus 97 across two.
Roughly twelve hours of earned screen time evaporating with nothing anywhere
saying it had happened. Backfilled as three real rows.

### Two things worth keeping from the doing of it

**A card that promises what the app cannot deliver is worse than no card.** The
child app half was quick. It said "90 holiday minutes, ready now" and the timer
gate read the star balance alone, so a child with an empty week was told the
minutes were theirs and then refused. Building the telling without the spending
would have been the worst of the three options.

**Making recommendedDailyMinutes holiday aware by default fixed sixteen call
sites and broke one.** weeklyStarCap calls it with no date, so the Monday
rollover, which runs after midnight to pay out the week that ENDED, would have
priced six weeks of term time at holiday rates on the first Monday of summer and
banked too little. It takes the week being priced now. Worth remembering as the
shape of the mistake: a default that is right for "what can be spent today" is
wrong for anything reaching backwards.

## 30 July 2026 — Inspired by Alma becomes The Guided Digital Childhood

Justin, describing the account: 6,000 followers built since 2015 on customised
cake toppers, then party supplies, then events, weddings and big birthdays, then
a shop in Bristol. Now being turned into the family facing social account for
Guided Childhood.

**The decision: rename in place, keep the craft as the printables line.**

Starting a fresh account throws away the single best cold list available to this
product, 6,000 people who are already parents and already trust the family.
Renaming and dropping the craft keeps them on paper and bleeds them slowly.
Renaming while carrying the craft over as the printables strand keeps them and
gives them a reason to stay. The bridge line is "It started with Alma. It still
does." The grid stays up, nothing is deleted, and the bio carries "formerly
Inspired by Alma" for 90 days.

**The account voice is the mother's, not Justin's, and that is deliberate.** The
platform copy is Justin throughout, non negotiable 8. This account is not the
platform. It is "we", the family, narrated by the person the 6,000 already
follow. Changing an account's name is survivable. Changing its voice is what
actually loses people. Her name is the one blocker on the pack shipping, marked
as `[NARRATOR]` throughout `content/brand-story/`.

**Four anchor days, not seven.** Founder Monday, Research Wednesday, Service
Friday, Happy News Saturday. Read down the week and the thesis is there
structurally, so no single post has to argue it: why we care, what is true, what
we built, why it is not doom. Four is what survives three children and a
business. Tuesday, Thursday and Sunday stay empty on purpose as the buffer that
keeps the four alive.

This does NOT replace the LinkedIn calendar at
`content/packs/2026-07-08-posting-calendar/`. That stays, in Justin's voice, on
LinkedIn and Substack. The overlap is a saving: LinkedIn does founder on Sunday
and Instagram on Monday, so the same chapter is written once and told twice,
once as what he learned building it and once as what it was actually like.

### Three things worth keeping from the doing of it

**The guilt is the asset and it is the easiest thing to ruin.** The Covid
babysitter admission is the line that stops 6,000 parents scrolling. Two ways to
waste it were written into the canon as banned: resolving it by blaming YouTube,
which makes us identical to every panic account in the space, and resolving it
by telling parents they were fine actually, which throws away the reason we built
anything. The resolution we do use is the product thesis smuggled inside a
personal story. The tool was fine at the job it was doing. Nobody had built the
version that also taught anything.

**A marketing calendar's failure mode is describing what does not exist.** So
every Service Friday in the map carries a route, a component or a migration as
its proof path, and there is an explicit do not post list: the weekly spotlight,
parent facing school email forwarding, the inactivity email, semantic script
matching, keepsake charms and plush, and the two DRAFT marketing pages. School
email forwarding is the instructive one, because the inbound webhook is complete
and signature verified while the parent facing card still says coming soon. Built
backend, closed door, not postable.

**Our children's names are not our characters' names.** Alma, Olga and Teo were
the original cartoon cast, renamed to Oliver, Zara and Sofia, then superseded by
DiGi and the Planet Friends. The founding story uses the real children's names
as real children. A guard rail is written into both the canon and the agent,
because a parent told to look for Teo in the app will not find him.

---

## 30 July 2026 — the ping labels, and the tiles below the loop

Two from the open list, both small and both the same shape: the page was leading
with the wrong thing.

**The ping buttons were clipped at 34 characters.** Only two of the nine messages
tripped it, and they were exactly the two nobody can identify from their opening
words: "Quest check! A few ticks and..." and "Dinner in 10 minutes, start...".
Worse, the fix already in place was an aria-label carrying the full text, so a
screen reader heard the real message while a sighted parent chose from a truncated
one. That is the accessibility fix applied to the wrong half of the problem. These
buttons SEND a message to a child's phone, so the label has to be the message.
Unclipped, wrapping to a second line.

**The tiles sat above the daily loop.** QuestShortcuts is navigation, and it led
the Quests page, so the first thing a parent saw was always four places to go
rather than the thing waiting for them. A parent with a job to approve scrolled
past the way out to find the work. The tiles now sit under the loop, and the order
runs the way a parent actually works: answer what is waiting, then choose where to
go next. On a quiet day the cards above collapse to almost nothing and the tiles
are first anyway, which is the right answer for that day too.

Worth keeping: navigation above content is the default a page drifts into, because
each card gets added at the top by whoever added it. It reads as helpful and it
costs the parent the one thing they came for.

Not done, and it needs Justin: firing /api/cron/device-guide-refresh and
/api/cron/legal-watch by hand. There is no CRON_SECRET in this environment, only
the template, so the request cannot be authorised from here. Vercel's dashboard
runs both in two clicks.

---

## 31 July 2026 — five a day on the child app, and what DiGi says while it thinks

**The five a day.** Justin's design, built: one card, five one line rows, at the
top of the child screen. Jobs first because a grown up is waiting on it, Ask for
a job last because the day should end with a child offering to do something
rather than consuming something. Two of the five rotate from a pool of six so the
day is not identical, seeded by child and date so a refresh cannot reshuffle a
half finished day.

Modelled on Duolingo's Daily Quests panel, which is the proven shape. Measured:
the card is about 500px at 390 wide, so five rows genuinely fit one screen. That
is what solves "no need to scroll", and it is worth saying plainly that tabs
never were the fix for it.

Three things deliberately left out, all of them things Duolingo does:

- **No countdown.** A clock on a child's chores turns a habit into an exam, and
  the ICO Children's Code names engineered urgency directly.
- **No loss language.** Nothing says a streak is at risk. It shows the run when
  there is one and is silent when there is not.
- **No share button.** A child's streak is not marketing.

**Step 4 completes by being READ.** Justin's wording was exact: "when pressed
will check if balance of jobs and device is good." So it is a mirror, not a task.
A child cannot be asked to hit a number they do not control, and scoring them on
one would make the balance something they can fail.

**The offline steps are taken on trust.** Reading, homework and moving about are
marked done by the child with no grown up approval. Putting a verification gate
on going outside would make the offline encouragement into another thing to be
checked on, which defeats it.

**kid_days is a row per child per day** because a streak has to be provable
against what a child was actually SHOWN, and nothing else records the shape of a
day. streak_awarded is separate from completed_at so a reward retry cannot double
count.

## And DiGi's thinking lines

Justin: "we did have some message from DiGi whilst it was thinking, giving
parents an idea what was happening ... your feedback counts and helps DiGi learn."

It existed (ThinkingReassurance, five rotating lines) and said only research and
guardrails. It missed the two things that actually separate this from a chatbot:
what other families found, and what THIS family has told us. Both are real and
both are already in the same prompt, concatenated at app/api/digi/route.ts line
407 as aggregateWisdom, expertKnowledge and familyMemory.

Four lines added, each checked against the code rather than written to sound
good, because a reassurance that overclaims is worse than none:

- "other families" is rebuildWisdom, reading resolved concerns, scripts marked as
  worked, and parent feedback across accounts.
- "never who they are" is literally true: child_id and user_id are read only to
  join an age band and never sent onward.
- "your feedback goes back in" is true because digi_feedback is one of
  rebuildWisdom's three sources.

---

## 31 July 2026 — the pathway header was the only thing out of line

Justin, on a laptop: "this needs to be tidier display as all a bit out of line."

Counted the containers on the page rather than nudging things by eye. The pathway
page uses maxWidth 720 six times, 580 and 560 for narrower text blocks, and 980
exactly once, on the header. So on a desk the header started 130px further left
than the six tiles and every section beneath them, and the whole page read as
drifting.

The instinct was to widen the tiles to meet the header. Wrong way round: 720 is
the page's column, used six times, and 980 was the single outlier. Widening the
tiles would have moved the majority to match the exception, and 980 of body text
is a poor measure to read anyway. The header came down to 720 and its passport
column went 340 to 300 with a tighter gap, which leaves the copy a workable
measure beside it.

Also the printed passport card: it centred its icon against a block whose heading
wraps to two lines and whose body runs to four, so the icon floated in the middle
of the card next to nothing. Top aligned now, chevron still centred, which is what
a row chevron should do.

Worth keeping: when one thing looks out of line, count the containers before
moving anything. The odd one out is usually a single outlier rather than
everything else being wrong, and the fix is to bring the exception back to the
column the page already keeps.

---

## 31 July 2026 — one week, counted one way, on every screen that says "this week"

Justin, on the balance page: "i thin it has aold data why tehre iso many
minuted".

It was not stale. Checked against the database rather than the screen: 92
approved ticks in the window, 163 stars, no duplicate rows, no orphaned ticks,
and buildOffscreen turns those into the 22h 45m exactly as designed. His own
testing, 38 jobs approved in one sitting on two separate days.

The check found something else. Three places counted "this week" and two of them
counted a different week: the star bank, the quest board and the rollover cron
run on the star week (Monday, London), while the stats page and week-report
rolled back seven days. So on a Friday the balance page was counting the previous
Thursday and Friday inside "Total this week", and 163 stars there sat beside 116
on the Quests page for the same child in the same week.

The star week wins because everything a parent can act on already runs on it: the
cap, the holiday bank overflow, the Monday reset. A rolling seven days cannot
have a reset, so it can never agree with a bank that does.

The per day figures had to move with it. A rolling window is always seven days
long, so dividing by seven was right. A star week on a Tuesday is two days long,
and dividing those two days by seven reported a child at less than a third of the
screen time they were really having. Actual usage divides by daysSoFar now; the
guide still divides by seven, because a weekly guide is a full week's worth
whatever day it is read on. buildPace was already dividing by daysSoFar, which is
the confirmation the star week was always the intended window here.

Worth keeping: two screens quoting different totals for "this week" is survivable
when each says which week it means, and invisible when neither does. Every screen
that reports a window now prints it.

---

## 31 July 2026 — dismissing a card is not the same as throwing the thing away

Justin: "the wekly round up does not go anywhere ... it just dissapears".

WeeklyReviewCard, the component built to put the round up on Home, was imported
nowhere. It had never rendered for anyone. The two remaining doors both carried a
Sunday only gate, and the cron writes the round up on a Sunday night, so the one
day it could be reached from Home was the day it was written.

The worse half: the card's cross set the row to dismissed, the GET filtered
dismissed out, and the round up PAGE read through that same GET. One tap on Home
permanently hid the week from the page built to show it, and the page then
offered to build a fresh one. A round up that had been written came to look like
one that had never existed.

Dismissing is about the card now, and only the card. The page asks with any=1 and
gets the latest week whatever its status. The round up row on Home is permanent.
Dismissal moved from a day keyed localStorage flag to the server row, so the
answer holds across devices and across days.

Worth keeping two rules. A card is a nudge and may come and go; the door to the
thing it nudges about must be permanent. And a component nobody imports is not a
feature, however finished it looks: grep for the import before believing a
surface exists.

---

## 31 July 2026 — done work is worth one line and a way back in

Applied three times today, and it is the same rule each time.

The quest status board stayed fully open showing four zeroes when nothing waited.
Today's path on Home kept six hundred pixels of ticked steps above everything a
parent could still act on. The balance report gave each screen type four text
elements to say what its bar already drew.

In every case the fix was the same shape: collapse what is finished to a single
tappable line that says what was finished, and open it again on a tap. Never
vanish it, because disappearing entirely reads as lost rather than done. Rocket
Money folds cleared items, Monarch keeps a quiet line rather than nothing, and
Apple Health sets a total as label, figure, then everything else muted.

The expanded state is deliberately not remembered across loads. The point of
folding a finished thing is that the next visit leads with what is still open,
and a preference that survives would quietly undo that.

---

## 31 July 2026 — held: holiday minutes per completed day

Designed, not shipped, and deliberately so.

The reward loop agreed today (a streak per day, four streaks unlock a family
friend) wants a second source of holiday minutes: a grant per completed day,
alongside the Monday rollover's grant per week.

holiday_allowance has `unique (child_id, week_start)`, and that constraint is the
whole safety of the rollover, which upserts with onConflict child_id,week_start
and ignoreDuplicates so a cron firing twice cannot bank a child twice. A per day
grant collides with it.

The design that works: add `source` and `on_date`, backfill on_date to week_start
for existing rollover rows, make it not null, then replace the unique with
(child_id, source, on_date). The rollover writes source rollover with on_date
week_start and keeps exactly its current once per week guarantee; a daily grant
writes source daily with on_date the day and can only ever land once per day.
Note that a nullable on_date will NOT do, because Postgres treats nulls in a
unique constraint as distinct and the rollover guard would silently stop working.

Migration 137 is free: 136 is the highest on main and no open PR claims a number.

Not shipped because it changes the idempotency guard on the currency table in
lockstep with a cron that cannot be run locally without the service key, so
getting it wrong either double pays screen time or silently stops banking it, and
it went to design while Justin was away from the laptop. Worth keeping as a rule:
additive schema is fine to ship on judgement, but a change to a uniqueness
guarantee that a money path depends on waits for someone to review it.

---

## 31 July 2026: the holiday uplift stays at 1.25, including the 13 plus band

Raised because the 13 plus band is the one place the uplift pushes past every
published number we cite, and Justin has decided: leave it.

The numbers. The age table maxes at 120 minutes a day for 13 and over, and that
ceiling comes from the Canadian 24-Hour Movement Guidelines, the only source in
SCREEN_GUIDE_SOURCES that names a figure for school age children. WHO and AAP
cover under fives. RCPCH explicitly declines to set a threshold. Summer relaxes
by 1.25, so 120 becomes 150.

The younger bands land somewhere defensible when relaxed (60 becomes 75, 75
becomes 95). The oldest does not, and that was the open question.

Kept because the uplift is a deliberate product judgement rather than a claim
about evidence: holidays are different, families need the slack, and a guide
that ignores that gets ignored itself. What was actually wrong was never the
number, it was the label. The card said "a healthy guide of 150 a day for their
age" and the setup said "recommended for this age is 95 minutes a day", both
crediting our own decision to the research and both leaving September looking
like an unexplained cut.

Fixed in PR 641 and PR 644: every surface now names the term time figure as the
age guide and the relaxed figure as the holiday, each to its owner. With the
labels honest the multiplier stops being a claim we cannot support, so it can
stay.

Revisit only if the evidence base moves. If a body ever publishes a school age
number above 120 the ceiling changes; until then 150 in August is our call,
clearly marked as ours.

---

## 31 July 2026 — one way to agree a job, and the button is called Jobs for Teo

Justin, on the Quests page: "we hsve one job waiting fir you but 3 ways to
cubfurn it".

He counted right. There were three routes to agreeing one job, and the two
that looked most urgent were the two that did not agree anything.

  Go and say yes    a button that scrolls you down the same page
  Approve           the only one that agrees, one tap, no navigation
  Add a job (red)   sends you to the manage page to agree there

Decided, to build next session:

1. Approve in place is the only way to agree. It costs least and it is already
   on screen.
2. Go and say yes stops being a button. What it points at is a few hundred
   pixels below it, and a button whose whole job is to scroll you to another
   button is the redundant path by definition.
3. The red count moves off Add a job. Adding and agreeing are different things,
   and a red count on Add reads as "you have jobs to add".
4. The two buttons per child row collapse into one. "+ Add a job for Teo" and
   "Manage" already go to the same page on different tabs, so one button
   carrying the red count and landing on the add tab by default costs nothing:
   adding stays one tap and the three tabs handle the rest.
5. The button is called "Jobs for Teo". Justin's own phrasing was "manage
   quests add chores and agree", right in substance and too long for a button.
   Jobs for <name> covers adding and agreeing without pretending to be a menu.

Checkable against the ref-status-board and ref-add-job fixtures already in the
repo, so this does not need a live account to verify.

Worth keeping as a rule: when one action has three entry points, the one to
keep is the one that performs the action, not the ones that navigate toward it.

---

## 1 August 2026 — DiGi's precedence, the retrieval floor, and learning from what worked

Justin: "I want it to use the researchers when answering specific questions, as
well as weighting the parent input, what we learn from the platform, and all the
data reports from the researchers we agree with. How is this working, and can we
make sure it is that clear?" Then: "make DiGi learn from successes ... where they
have marked a solution fixed, trace the best answers, look for popular issues and
moments, then be proactive on known success solutions."

**The precedence was emergent, not designed.** Thirteen context blocks were
concatenated into one flat string and handed over, so the model inferred the
ordering itself, differently each time. Nothing said what wins when a research
finding and a family's own history disagree, which is the exact moment a
parenting guide either earns trust or loses it. Now stated, and placed FIRST in
the context because an instruction about how to read something has to arrive
before the something.

The order is the product's argument: safety, then the family's own signed
agreement, then research for DIRECTION, then this family for FIT, then other
families as a suggestion only, then say so out loud when they conflict, then
admit not knowing. Research before the family on what is generally true; the
family before the research on whether it applies here. A finding about eleven
year olds is not a finding about THIS eleven year old.

**Two retrieval faults, both silent.**

The keyword match is a literal substring, and the map had fifteen words in it
with not one platform a child actually uses. "She has been really down since she
got Snapchat" matched nothing. Now about seventy words, tested against ten real
parent sentences: all ten match, where several matched nothing before.

And when nothing scored, getExpertKnowledge returned an EMPTY STRING. An answer
built on no research looked identical to one built on six, with no signal
anywhere. There is now a floor: if nothing scores, fall back to whatever is age
appropriate. The claim that DiGi answers from research is now true of every
answer rather than most of them.

**Learning from successes.** rebuildWisdom already read the three places a
success is recorded (a concern marked resolved, a script marked worked, written
parent feedback) and stored evidence_count. That count was then thrown away at
retrieval, so a pattern proven across many families and one seen once read the
same. getProvenSolutions surfaces them as their own block, ranked, with a log
compression on the count so one very common pattern cannot win every question
regardless of what was asked. Floor of two families, because one success is an
anecdote and presenting it as a pattern is the overclaiming this brain exists to
avoid.

**And the two researchers.** Foulkes and Valkenburg were named in Justin's
LinkedIn post and were not in the codebase at all. Migration 139 adds both, from
the published work rather than memory, with urls. They are also the two that most
support the product's own argument: Foulkes is the peer reviewed case for
education over alarm, and Valkenburg's 28 percent negative, 26 percent positive,
half negligible is why a blanket rule is the wrong instrument.

Worth keeping: the test caught what reading could not. "The morning routine is a
nightmare" matched trauma, because the singular is idiom and the plural is
literal. Ten sentences took a minute and found both a whole class of misses and a
false positive.

---

## 1 August 2026 — the Monday management review

Justin: "so that we are saving data gathering on my management board and weekly
meetings where an agent reviews it for findings."

Most of what he described already existed and was pointed at the wrong half of
the data. /dashboard/insights is the founder board and /api/cron/digi-insights
runs an agent daily, but it reviews the QUESTIONS parents asked. That tells him
what families are worried about and nothing about what actually helped. A product
whose entire claim is that it learns from what works had no report on what worked.

Meanwhile rebuildWisdom was already reading the three places a success is
recorded and turning them into guidance for DiGi. The machine was learning from
outcomes and nobody was reading it back to the person who decides what to build.

So /api/cron/management-review, Monday 00:30, reviews the OUTCOME side: concerns
families marked resolved, scripts they said worked against ones that did not, the
patterns wisdom has accumulated evidence for, jobs approved, full days finished,
credits earned, and which worries keep coming back. Findings land in
management_findings (migration 140) and the newest sits at the top of the founder
board, above the daily insight board, because it answers the more important
question.

Four decisions in it worth keeping:

**00:30, after the star rollover at 00:10.** Reviewing a week that is still being
closed would report it as quieter than it was, because the rollover writes that
week's sticker credits.

**Nothing per family leaves.** Every input is a count or a category label we
chose. No parent's words, no child's name, no user id reaches the model. Justin
does not need one family's week to decide what to build, and a founder dashboard
that quietly becomes a surveillance tool is exactly what this product tells
parents it is not. management_findings has no parent readable policy at all and
the board reads it server side after the founder email check.

**The counts are stored beside the prose.** A finding you cannot check later is an
opinion with a date on it, so metrics goes in the row next to the summary.

**The agent is told to prefer the uncomfortable finding, and to say when a number
is too small to mean anything.** A weekly report that always finds three
encouraging trends is one you stop reading by week five. If the models are all
unreachable the numbers are still saved and the panel says so, because the
numbers are the durable part and the prose is commentary.

## 1 August 2026 — DiGi answers anything, in the shape the question deserves

Justin: "I want to be able to use Claude though but with the guardrails so it can
answer anything. Does it currently do that? Like the Good Inside version."

**It always could.** There is no topic gate anywhere in DiGi and there never was.
What made it feel narrow was the SHAPE: the static prompt forces every reply into
the coaching format and closes every one with a reflective question built to learn
about the family. Ask for help drafting a letter to the head teacher and you get
the letter followed by "Quick one for tonight", which is the moment a parent stops
believing they can ask it anything.

**Three lanes, varying the shape only.** parenting keeps the full coaching shape
and the research. family keeps the warmth and the memory but drops the forced 24
hour close and only asks a reflective question when it would teach us something.
general gets a straight answer with no wrapper at all.

**The rails do not vary by lane.** Crisis routing, never diagnose, never allow or
deny, data minimisation, no invented sources, no dashes. All in the static prompt,
all three lanes. Widening what DiGi will talk about must never widen what it is
allowed to say. Professional signposting for medical, legal and financial was
added, because those only became reachable once the scope widened.

**Every failure path lands on parenting.** A general question wrongly given the
coaching shape is mildly odd. A question about a child wrongly given the plain
shape loses the research, the memory and the reflective question, which is the
whole product.

**The lane is stored (migration 141) because two agents read digi_questions
assuming every row is a parent asking about their child.** digi-insights would
read general questions as phantom product demand. knowledge-refresh is worse: it
uses them to decide what to go SEARCHING the web for, and those candidates land in
front of Justin to approve into the bank DiGi cites by name. Both now read
parenting and family only.

**Recorded as a known soft spot:** digi_wisdom.evidence_count is the model's own
estimate of its evidence, parsed from the JSON it returns, not a counted fact.
getProvenSolutions floors and weights on it, so "proven across families" currently
reads harder than it is. The fix is to count the supporting signals in code.

## 1 August 2026 — the knowledge base grounds DiGi, it does not cap it

Justin: "I want to make sure it has as much knowledge as Claude, and I want to
answer every child mental health question."

**The model was never the limit.** DiGi runs on claude-fable-5, so everything
Claude knows about child development, CAMHS pathways, eating disorders, ADHD and
sleep was always available. One line in the prompt was capping it: when nothing
in the bank fitted, DiGi was told to teach from the research principles and "say
the source is our own approach". So real, established clinical knowledge came back
either thinner than it should be, or labelled as house opinion. That is the mirror
image of inventing a citation and just as dishonest.

**Three levels, stated.** Bank covers it, lead with it and name the source. Bank
does not, answer just as fully with no source attached and nothing dressed up as
ours. Genuinely contested, say so and say why.

**Never invent a study still holds and does not fight with that.** A full answer
with no citation is honest. A thin answer with a made up citation is not.
PRECEDENCE rule 7 says the same, because "if you do not know, say you do not know"
was the sentence most likely to be misread as "if the bank is quiet, say less".

**Child mental health gets answered properly.** Signs at that age, what to do this
week, and always the route to a human without waiting to be asked: GP as the door
to CAMHS, pastoral lead or SENCO, YoungMinds, Beat, Papyrus, Childline. Never
diagnose, never rule out, never definitely fine, and never let waiting be the whole
plan.

**Three eval cases guard the opposite failure to all the others.** The existing
cases catch DiGi saying too much. These catch it saying too little, and none of
their subjects are in the knowledge base, which is the point.

**What does not learn is the model itself, and it should not.** DiGi learns about
our families, not from them into anyone's weights. That is the version that can be
defended to a parent.

## 1 August 2026 — DiGi becomes an agent, within a fence

Justin: "build 1 to 5."

**The fence matters more than the tools.** Every write DiGi can make is small,
visible and reversible: one memory line a parent can delete, one card they can
cancel. Nothing it can do changes a child's screen time, sends anything, spends
anything or touches another family. The day a tool can do any of those, it needs
a parent's tap and not a model's judgement. That line is the design, not a
caveat on it.

**schedule_followup is the one that changes what DiGi is.** Until now it could
only answer when spoken to, so a parent tried the thing on Tuesday and unless
they thought to come back, nobody found out whether it worked. The parent carried
the follow up, and the parents who most need this have the least room to carry
anything.

Delivered as a digi_prompts card rather than a new channel, so it inherits the
quiet hours, dismiss and mute that queue already respects. A second channel would
mean two places to be interrupted from and two ways to get that wrong. Capped at
three pending per family, in code, because a guide that queues up nine things to
ask you about is one you start avoiding. Overdue ones still go out: a day late
beats a promise silently dropped.

**web_search is barred from anything clinical or developmental.** It is for the
live world only, a named app or a change in UK law. The open web is where the
worst parenting advice lives, and a parenting product that starts sourcing child
development from it has given away the only thing that makes it different.

**The monthly answer review proposes and never applies.** Every other loop
improves what DiGi knows; this is the only one that looks at how it answers. A
system that rewrites its own instructions is one where nobody can say what it was
told to do last Tuesday, and for a product answering questions about children
that is not a trade worth making for any amount of convenience. Same human gate
as the research bank.

**Schema was verified rather than assumed**, which caught three wrong table and
column names before they shipped. Writing a tool against a remembered schema is
how you ship a feature that throws on first use for a real family.

**The rail that grows with every tool: a tool result is DATA, never an
instruction.** It mattered when the only tool read our own curated bank. It
matters far more now one of them fetches pages written by strangers, and it has
to be restated every time a tool is added.

---

## 1 Aug 2026 — the wiring check, and why a failing check that stays failing is its own bug

**Health and correctness are different questions, and we were only asking one.**
Config is checked by looking, schema by reading the columns, crons by heartbeat,
and DiGi by a Monday eval suite that generates real replies and grades them on
safety and on a rubric. That is a good net. It could not have caught a single one
of the four things that broke on 31 July, because in every case the system was up,
connected, configured and doing the wrong thing.

`ask` had no code anywhere that could tick it, so no child had ever completed a
day since the five a day shipped, and the streak, the celebration and the Planet
Friends all sat downstream of that. `WeeklyReviewCard` was imported nowhere at
all. `/k/<token>/balance` was linked from the five a day and 404'd. Five surfaces
disagreed about what "this week" means, so one child read 163 stars on one screen
and 116 on another.

**What those four share is that they are static facts about the code.** You do not
need a database, a session or a running app to know a link points at a route that
does not exist, or that a step key has nothing anywhere that can write it. So the
check runs in CI in a second, needs no secrets, and cannot flake.

**Four checks, not fourteen**, and each earned its place by catching something
that actually shipped. Dead internal links, components nobody imports, steps that
navigate away and are never ticked, and more than one definition of the week.
Every check added past the point of usefulness makes the whole suite easier to
ignore.

**It found three more live bugs on its first real run**: `lesson`, `quiz` and
`printable`, all the same shape as `ask`.

**They are recorded, not fixed, and not guessed at.** Each is a product decision
on when the step counts, not a line of code. Does a lesson tick on arriving or on
passing? Does a printable tick on opening it or on sending it back? Guessing those
would have been worse than writing them down.

**A check that lands permanently red teaches everyone to ignore it inside a week,
and the first one ignored is the real one.** That is the same failure as an alert
that fires every morning, arrived at from the other direction. So the three sit in
a dated BASELINE and only NEW breakage fails the build. The rules that stop the
baseline rotting into a graveyard: every entry carries the date it was recorded,
every entry prints on every single run, and an entry that stops firing is itself
reported as FIXED with an instruction to delete it.

**Errors are reserved for things that are broken FOR A PARENT.** Orphan components
dropped to warning on that rule: an unimported component does not break a path
anybody walks, and the check cannot tell dead code from forgotten wiring.
`WeeklyReviewCard` was the forgotten kind, and one warning line in a report read
every run would still have caught it. The point of the rule is that a red build
always means someone cannot do something.

**Three of my own false positives were fixed before the check was trusted**: a
nested template literal, an `index.tsx` directory import, and a step written from
a JSX prop. A check that guesses is a check that cries wolf. Where it cannot
resolve a value it now stays silent rather than asserting.

---

## 1 August 2026 — An explanation and a tool have different lifespans

The passport page's intro was correct and was still the wrong shape. Every line
of it was added because the page never said what it was promising: a parent read
a road, five circles and a percentage and had to infer the rest. That was a real
gap and the words fixed it. What was wrong was that they never went away. On a
390 wide phone the heading, the paragraph, four bullets and two closing lines are
the whole screen before the passport begins, so a parent who opens this tab every
week paid for their first visit every week.

**So the rule: an explanation is shown until it is read, not forever.** The intro
opens in full on a device that has never seen it, then collapses to a heading, a
line and a tap. Nothing was cut. The same test applies to every reassurance block
in this product, and there are several.

**A remembered "seen" flag must be written LATER than the mounts that read it.**
The obvious build of this failed and the failure is worth keeping. Read the flag
and write it in the same effect, and a device gets marked as having read an
explanation it never showed: the component mounts more than once per page load,
so mount one opened the panel and wrote "seen", and mount two read "seen" and
rendered shut. Module scope did not fix it either, because the module is
evaluated twice as well. The flag is now written two seconds in. That is also the
more honest rule: an explanation somebody bounced off in under two seconds has
not been read.

Anything else in here that reads localStorage on mount and writes in the same
breath has this bug. It is silent, and the symptom is "the thing never shows".

**Opening on the child's own stage hides everything behind it, so the passport
now names what it skipped.** Justin: landing on their stage "is neater", but a
parent will "forget to catch up in previous stages with them". Both halves true
and they pull against each other. The book keeps opening where it should and
lists each unstamped earlier stage under the page dots with its real percentage
and a tap to turn to it. Stage one is where the habits the later stages assume
get built, so a child on stage three with an unstamped stage one is not ahead of
schedule, they have a gap, and the passport is the only screen that can see it.

**A fixture where nothing is ever left behind cannot check the state that only
exists because something was.** `/ref-passport-book` now carries a deliberately
unstamped Builder and the collapsed intro, because the real page is behind a
login and this was otherwise unverifiable without an account.
## 1 August 2026 — Minutes marked by hand are a session, not just a number

**A parent who marks screen time by hand had a balance report that could not see
it.** Two paths put screen time in the system. A timer block writes
`device_sessions`, which carries the device, the activity and the family device.
"Screen time used" wrote `star_spends`, which carries minutes and stars and
nothing else. Every weekly breakdown reads `device_sessions` only, so a family
without a phone child, marking time in the co view, drained the star bank all
week and read a balance report showing almost no screen use at all. The guide for
a 4 to 7 year old is 27 minutes watching and 24 learning, and they were being
measured against it with an empty numerator.

**So `/api/quests/spend` writes the session too, tied to its spend by
`spend_id`.** That link already existed for parent granted blocks, and
`getMinutesUsedToday` already skips a spend whose session it has counted, so
today's total still counts each minute once. Nothing needed inventing.

**The device is asked for, never defaulted.** Every other timer flow defaults the
picker (`ParentStartTimer` to the TV, `ParentDeviceTime` to the tablet) because
the parent is standing there choosing. Recording after the fact is different: a
default there is a guess written into the week's breakdown as though somebody
answered it. So the minute buttons stay disabled until the screen is picked, and
the pick then sticks, so marking again is still one tap. A computer is asked what
they were doing, for the same reason the child is asked: it is the one device
whose bucket cannot be read off the device, and homework counted as watching is
the bug that question exists to stop.

**Migration 146 adds `device_sessions.manual`.** `spend_id` says these minutes
came from a spend; it cannot say whether a person typed them or a clock measured
them. A parent reading "45 minutes on the TV" deserves to know which, because a
recollection at bedtime and a countdown are not the same evidence. The stats page
says it in one line under the report.

**The session write is best effort and the spend is not.** The stars come off the
bank first and the parent is told so. Failing the whole request because the
session insert failed would leave them tapping again and spending twice, so the
response carries `logged` instead and the confirmation says when the week's
screens did not get the minutes.

**`manual` is read in its own query, not added to the breakdown's select.** One
unknown column in that select and the existing catch swallows every session,
leaving a parent looking at an empty week rather than a missing footnote. The
footnote is what should go missing before migration 146 runs, so it is the only
thing that does.

## 2 August 2026 — The five a day stops asking children to claim things

**A row wearing the completion signal while it was still outstanding.** The jobs
step used ✅ as its icon, which renders as a green box with a white check and is
indistinguishable from the done state two rows below it. Justin read the board as
already ticked; the database said `done: [ask, homework, balance]` and the card
said "1 of 5". The logic was right the whole time. Nothing but the done state is
allowed to look done, so the icon is now 📋.

**The same row now says where they are up to.** "Tick off what your grown up
sent" read identically whether none were done or five of six were, which is the
least useful thing it can say to a child standing in front of it. It reads
"4 of 6 done. Tap to see the rest".

**Printables become a holiday thing.** Colouring a sheet in is a holiday morning
activity, and asking for one on a school night competes with the homework that is
actually due. `available.printable` is now `isSchoolHoliday()` against the
family's own region, so a US family is not offered a sheet because it is half
term in England. Dropping it never empties the middle: five of the six rotating
steps remain.

**Reading takes the freed slot, scaled by age.** Ten minutes is a real stretch for
a child still decoding words and a bar a confident thirteen year old clears
without noticing, and a target that does not fit teaches a child the list does not
mean what it says. 10 minutes at 4 to 7, 20 at 8 to 13, 30 above. The row states
its own number.

**Homework stops being a tick that records nothing.** It was the weakest row of
the five: a child self certified, no parent could see what was set, and the child
got no credit for the work. It now opens a note, and writing it IS the completion.
Migration 147, one note per child per day. Deliberately not sent for approval:
homework is between a child and their school, and an approval gate would make it
one more thing to be inspected on.

**In the holidays that row looks forward instead.** No homework exists to record,
and inventing some is the fastest way to make this the row a child dreads. It
shows what is coming when they go back, read off the 448 curriculum objectives we
already hold, and reading it completes the step. `nextTermTarget` is a separate
function from `termFor` on purpose: a half term goes back into the SAME term, and
a naive "next term" would be wrong twice a year in a way that shows a child work
they will not meet for months.

**The note is best effort and the tick is not.** The five are what the streak is
made of, so refusing the step because the note could not be stored would hold a
child's whole run hostage to a migration they cannot see. Before 147 the table
does not exist; the day still moves, and the lost note shows up in the logs and
in `saved`.

**Outstanding jobs on the balance page are links.** A child reading what they
still owe with no way through to it has to remember the list and go and find it,
which is the moment the page stops being useful. Done ones stay plain: a record
has nowhere to go.

**The celebration carries the timer reminder.** It is the only moment in the day a
child is reading the screen because something good just happened. The same
sentence on the jobs list is a rule; there it is the next step.

## 4 August 2026 — The stage quiz asks what the stage taught, and the child gets their own line

**The quiz was already built, and was asking the wrong questions.** The brief
said nothing writes to `stage_quiz_passes`. It has since 2 August: the bank, the
API route, the component and the read back all shipped. What was missing was the
part Justin specified, that the end of stage quiz **gathers the questions already
asked across that stage's lessons**. It sampled 33 questions typed into
`lib/content/stage-quizzes.ts` instead, which is a general knowledge round
standing where retrieval practice should be, and content living in the app
rather than the database.

**The questions were already there.** They are `choice` slides inside
`lessons.slides`. `gatherStageQuizPool` reads the stage's lessons and normalises
them, the right answer's feedback becoming the why line.

**A question only travels if it can stand on its own, and adjacency is the wrong
test for that.** The first rule tried dropped any question sitting after a
scenario slide. Measured over the real library it threw away "why is one reused
password across ten accounts worse than one weak password on one account", which
needs nothing around it, and pushed Explorer under a full run by itself. The test
is the words: a demonstrative in front of a thing always drops, a bare "the chat"
drops only when the slide before it put one on screen. That keeps foundation 8,
builder 10, explorer 10, shaper 25 and independent 11 against a run of five, and
drops four that genuinely need their slide.

**So the hand written bank is never reached today.** It stays as a floor, because
a stage is one retired lesson away from being short and a two question quiz at
the end of a stage reads as an unearned stamp.

**The generated floor question had to be renamed.** `autoSlidesFromLesson` gives
every deckless lesson the same sentence, so gathered it would ask "before you
finish, show what stuck" five times in one run. It now names its lesson.

**A thirteen year old was reading "your child" about themselves.** `key_message`
is one column serving two readers: the Remember panel on the parent hub, and the
line under every title on the child's own lessons list. Fifteen of forty four put
grown up address in it, and all fifteen are the social media 13 plus series from
103 to 106. The lopsided Shaper count and the grown up voice are one finding, not
two: that series arriving.

**The child page is not showing the wrong rows, and this is the trap.**
`audience = 'parent'` on the child's query is deliberate. On this table audience
separates the family library from the school one, never the grown up from the
child, and every family lesson is meant to reach both. Reading it as an audience
gate is exactly what hides the bug. The fix is the missing second line, not a
filter. Migration 156, `child_key_message`, nullable and additive, filled for the
fifteen, with the grown up copy untouched because DiGi reads it for context.

**Both child surfaces ask for the column in their own query.** A database without
156 renders exactly as it does today rather than erroring a child's page, which
is the right way round for a column that is an improvement, not a dependency.

## 4 August 2026 — The stage check is the child's, and the scripts sweep needs a read

**Justin's call: the child taps the stage check.** The questions are gathered
from the lessons the child worked through, so the child answers them, and the
passport stamp is theirs. `/k/[token]/quiz` with the same token auth as their
lessons, `/api/kid/stage-quiz` writing the pass under the parent user_id so the
pathway page reads it under RLS exactly as before, and a server side stage gate
so the URL cannot be edited into a stage they have not reached.

**The entry sits at the bottom of their lessons list, visible while shut.** A
child can see what they are working towards, and the copy says it only asks what
their lessons already asked, so it reads as a lap of honour rather than an exam.
Falling short never says failed: it names the lessons to go back over and invites
them again. A stage runs two to three years, and a child who reads "failed" at
the end of one learns the wrong thing about the whole pathway.

**The parent card became a readiness read and a hand over.** It keeps the amber
strands and the lessons left, which is the useful part for a grown up, and links
into the child's check instead of opening its own. The quiz machinery is deleted
from the parent component rather than left dormant.

**The scripts sweep is full, per Justin, and blocked.** The 233 scripts live only
in the live database. Three are seeded by migration 153, the rest were written
through the admin API and exist nowhere in the repo. Rewriting 121 rows of
Justin's voice from assertion to scenario needs each one read first, and a blind
SQL pattern swap would do more damage than the problem, silently. Nothing in the
scripts table has been touched, including the two gender assumptions: writing
those from a description I have never read is guessing at copy, which is the
thing the sweep exists to stop.

**Worth doing regardless of the sweep:** the scripts belong in a seed migration.
233 rows of the product's voice living in one database with no copy in version
control is a single delete away from gone.

## 4 August 2026, later — the scripts sweep, done, and the numbers that were off

**Justin opened Supabase, so the reads that blocked everything went through.**
Three things the repo could not have told me:

**The scripts number was 121. It is 179.** 236 scripts live, 143 saying "your
child", 36 saying "your son, daughter or teen", 0 phrased as a scenario, 2
assuming a gender. Full sweep was already the call and a bigger number does not
change it, but it is worth knowing the sweep was half as big again as the brief.

**Migration 157 rewrites all 179 situations.** Only the framing moves: "your
child" becomes "a child", an opener becomes "when" where the sentence needs one,
and the moment, detail and rhythm stay exactly as written. `say_this`,
`not_this`, `why_it_works` and `tonight` are untouched, because once the moment
IS real, second person is the right voice and always was.

**Why this is not a style note.** A parent browses the scripts library before
anything has happened. "Your child agrees to 45 minutes and is still playing an
hour later" tells them it did. A whole list of those reads as a portrait of a
family in trouble, which is the opposite of what the library is for.

**Verified rather than trusted.** The 179 ids in the migration were fingerprinted
against the 179 rows the database says match, and the md5 of both sets is
identical, so the sweep covers exactly the affected rows, none missed and none
extra. Hyphens were closed up on the way past, which also clears a no dashes
breach these rows were already carrying.

**ai_lessons is worse than the brief said, and in a more interesting way.** 54
rows, not 46, and **not one of them has a slides deck at all**, so there are no
authored questions to have zero of. Every one falls to `autoSlidesFromLesson`,
which means a child meets one generated prove check built from the key message
with two fixed wrong answers, the same two every time, across all 54.

**A second audience leak, which the repo hid.** 10 of the 46 live family lessons
have no deck, so the player renders their four text fields as slides. 5 of those
10 carry grown up address in that text. Migration 156 fixed the lessons list
line; this is the lesson body, and it is still open.

## 4 August 2026 — the recommender starts using what a family has actually told us

Justin: "can we make sure the scripts that come up are either relating to
previous conversations, or at least related to the devices or platforms they
would use."

**One signal became three.** `getRecommendedScript` matched only the challenge
picked once at signup. It now scores live concerns first, then the devices in
the house, then the signup answer, and returns a `reason` so the card can say
why in a line a parent can check against their own week.

**The order between the three is the argument, not the code.** A concern row is
written when this family raised something with DiGi, in a moment, or in right
now, and it carries a count, so something flagged four times outweighs
something flagged once. Owning a console is real evidence but weaker, because
having a thing is not the same as struggling with it. The signup answer is
weakest and kept because on day one it is all we know.

**No penalties, only evidence.** Demoting gaming scripts for a family with no
console listed was tempting and would have been wrong: children game on phones,
at friends' houses, on school laptops, and a device list is something a parent
filled in once and may never have finished. Hiding the script a family needs is
a far worse failure than showing one they do not.

**CHALLENGE_TO_CATEGORY had been broken since migration 151 and nothing said
so.** Four of its eleven answers pointed at categories the collapse deleted
(mental-health, online-safety, relationships, first-device). A parent whose
worry was moods, or safety, or a first phone, matched zero rows and fell
through to plain sort order. It survived because a filter matching nothing
looks exactly like a parent who has read everything.

**The library was still ticking scripts that were only opened.** Migration 157
split opened from used for the passport, but `/dashboard/scripts` counted any
completion row, so ten glanced at scripts came back as ten ticks against a
passport that disagreed with every one of them. The free read counter
deliberately still counts opens, because opening a paid script is what that
allowance is spent on.

**Model written text is never grafted into a sentence.** The first version read
"Because group chats keeps coming up" and lowercased a Switch into a light
switch. Concern labels get their own sentence now, so agreement and casing stay
correct whatever DiGi wrote, and dashes are stripped on the way past.

**Migration 157 collided.** #697 and #698 both shipped a 157. The newer, the
scripts copy sweep, is renumbered 158. Renaming touches no database: Justin
pastes these by hand, so the number is ordering for humans.

**Checked** with thirteen cases against a fake client covering the ranking, the
return date, the free script rule and the copy, plus the card at 390px and
1280px in Chromium.

## 6 August 2026 — the fridge sheet, the school week, and the sticker book

**The printed family agreement never had a page rule.** It printed the phone
layout at phone sizes with whatever margins the browser chose, so six sections
plus signatures ran onto a second sheet. It now has an A4 page box, print sized
type, and a fit pass that scales the sheet to land on one page: down when a
family writes an essay in "our extra agreements", and UP when they do not,
because six short answers filled half the paper and printed marooned in the top
corner. A fridge copy is read from across the kitchen, so the empty half of the
page was worth more as type size.

**Zoom is the wrong tool for scaling a print sheet.** It was the first attempt
and it looked right: zoom the box, widen it by the same factor to keep it full
bleed. It does not scale linearly, so one measurement mispredicted the printed
height and the agreement still spilled. Scaling the type tokens instead means
the text genuinely reflows, which is why the fit is searched over eight passes
rather than calculated in one.

**School reminders are all day things, so the week is day ROWS, not an hour
grid.** Five of the first six Mobbin results were hour grids (Outlook, Amie,
Evernote, ClickUp, Todoist) and all five are wrong here: almost no school
reminder has a start time, so a time grid is seven mostly empty columns and the
one thing a parent wants, which days are busy, becomes the hardest thing to
read. Runna's training calendar is the pattern. No migration: school_actions
already had due_date, due_time, recurs_weekday and cleared_on, and nothing was
reading them as a week.

**A push subscription row is an endpoint, not a phone.** iOS mints a new one
every time a home screen app is removed and added back, so one phone becomes
several rows. Send a test was sending one notification per row: four to Teo's
phone, twenty three across Justin's own devices. A test now sends to one device
per platform, newest first, and prunes dead endpoints as it finds them. The
child path had swallowed every error, so its stale rows were the only ones in
the table that could never be cleared.

**A test never reaches the child.** Justin: "no need for test to go to child."
The person tapping it is the parent asking about the parent's phone. A child
gets the real thing on the day it is due, and nothing else.

**The Planet Friends were earned twice, by two rules that disagreed.** The
sticker book read the child's AGE BAND, so a child who joined at 13 was handed
four of the five on their first afternoon; My wins counted stages actually
stamped and said 0 of 5. Hence Pebble reading as earned and locked on one
screen. The age rule is dead. Both surfaces now read earnedFriends(). The
STAMPED stage route stays, because that is real work.

**The Friend ladder is 2, 10, 22, 38, 58 completed days, not four each.** Flat
fours meant twenty days bought every character, about five weeks, and then a
collection meant to last to 16 was empty. Fast at the start, rare at the top.

**The five passport stamps are the child's rare tier, 13 slots becomes 18.**
The hardest thing in the product was landing on the parent's passport and
nowhere in the child's book, and the stage check had no prize on the child's
side.

**A locked slot has to say what it costs.** Locked stickers read "Locked" over
a bare 8, 15, 25, 40. The sentence existed the whole time in the catalog's
`earn` field and the tile printed "Locked" instead. Mobbin: Tripadvisor puts
the instruction on the tile, stoic. shows live progress against it.

**Week Streak was the parent's streak.** It read getDailyStreak by user_id
while every other sticker is keyed on child_id, so two children in one house
both got it for the same grown up activity. Now the child's own completed days.

**The collection is the passport.** The parent had a burgundy keepsake book and
the child had a grid of circles on grey. The book now has three pages and one
count on the cover, which retires the two counters that could not be reconciled
("6 of 13" and "Friends home 0 of 5", both true, of different systems). It sits
on its own tile rather than at the foot of the wins panel, and the tile counts
uncelebrated stickers so the once only pop still gets found.

**Checked** by rendering, not by reasoning. The fridge sheet was counted as
pages in a real A4 PDF across five content lengths. The week and the book were
screenshotted at 390 and 1280, which is what caught the sticker titles setting
one word per line and the Explorer stamp drawing a bare "3" from a field that
means the stage, not a threshold. The Friend ladder has 26 cases run against
the real source. The push counts came from the live database.

## 6 August 2026, evening — how a Planet Friend is earned, and what happens when one is

Justin, on Teo's passport: "Ok I'm not [sure] how Teo has earned so many friends
here?" and then "Can we make even one is earn[ed] there is a big animated
celebration."

**A Friend is bought with the child's completed days, and nothing else.** The
morning's pass killed the age rule but left `earnedFriends` taking the max of
days and finished pathway stages. Stages are read by `user_id`, so that is the
parent's lessons and scripts: a grown up working through Foundation handed a
Planet Friend to a child who had done nothing, and to their sibling too. The
same fault as the age rule in different clothes. Parent progress already got its
own tier in the child's book this morning, the five Stamps, so the two
currencies separate instead of being added together.

**Migration 165 deletes every friend row rather than the wrong ones.** The book
reconciles from the real numbers on every read and re-persists, so nothing
legitimate can be lost, and picking survivors in SQL would mean writing the 2,
10, 22, 38, 58 ladder out a second time somewhere nobody will maintain it.
FRIEND_STREAKS stays the only copy.

**The live count, not the one from page load.** completedStreaks is read on the
server, so on the exact day a Friend was earned the streak takeover computed
against the day before and told the child "one more day and you get a new
friend" seconds after they had got one.

**Earning one is a takeover, not a sentence.** Mobbin first: Discord, Finch,
(Not Boring) Weather and Vibes, Me+, Deepstash, Nibble, Duolingo. All the same
six parts, and the one ours was missing is the line saying WHY it came. So the
number is what gets said: "58 full days, Teo. You did every one of them."

**The journey is generic, the arrival is real.** The rocket, the planet and the
flight are the same for all five Friends; the character who lands is the child's
own cutout art, the same file their sticker book uses. One clip covers every
Friend, a sixth would need no new footage, and the thing that filled the screen
is the thing they go and find. Shipping on a drawn flight with a `rocketVideo`
prop ready for Higgsfield.

**Checked** by rendering at 390 and 1280. Two things only a screenshot could
find: twelve light rays drawn from a centre point read as a compass rose across
the copy, fixed by moving them onto a ring outside the character; and headless
screenshots stall GSAP mid tween, so the settled layout has to be checked under
`prefers-reduced-motion` or read off computed styles rather than trusted from a
picture taken too early.

## 6 August 2026, late — one reminder, one buzz

Justin: "Every reminder eg jobs or agree timer seems to send 4 pwas to child's
phone." Counted in the live database: Teo had four push subscriptions to one
phone, and one parent account had twenty three.

**A push endpoint is not a device.** The push service issues a new endpoint on a
PWA reinstall, on clearing site data, on an iOS update and on its own schedule.
Both subscribe routes upserted on endpoint, so every rotation inserted a row and
nothing removed the one before, and the table stopped being a list of devices
and became a log of every subscription a phone had ever had. Every send fanned
out across the whole log. This is the same fault as the school reminder test
this morning, which was patched in one route. It was never one route.

**device_id is the fix at the source.** A stable id the browser makes once and
keeps in localStorage. It survives the endpoint rotating, which is the only
thing that can tell "this phone again" from "a second phone", and the subscribe
routes now clear a device's older rows before writing the new one.

**No unique index on it.** A subscribe runs while a child is standing at a
permission prompt, and turning a lost race into a 500 there would trade four
buzzes for no reminders at all.

**The cleanup keeps the newest row per family, per child, per push host.** One
phone talks to one push service, so the host is the best identity available for
rows written before device_id existed. It costs a parent running two browsers of
the same kind on one account the older of the two; they resubscribe on the next
visit and are properly separated from then on. Being sent seventeen copies of
everything is the worse side of that trade.

**Send time collapses duplicates as well**, and stays whatever the table looks
like, because that is the layer a child feels. Keyed on child_id too: two
children in one house on two iPhones share a push host, and grouping on the host
alone would have silenced one of them, which is worse than the bug being fixed.

**Migration 165 collided** with another session's `digi_wisdom_review_gate`,
which committed later and is now 167. Every statement in it is an idempotent
create or a guarded update, so re-running under the new name changes nothing.

## 6 August 2026, evening: the evidence ledger, and DiGi behind a gate

**Concerns stopped overwriting their own history.** Every status change was an
UPDATE in place, so we knew where a family was and had destroyed how they got
there. concern_events (migration 164) is append only: raises, check ins,
resolutions and recurrences all survive, with an optional 0 to 10 the parent
can skip without cost. The recurrence surviving is the point: a thing that
came back is the most informative row we own.

**The look back question at resolution, not a baseline questionnaire.** People
re-scale what a 7 means as they learn their own problem, so the start severity
is asked again at the finish. One tap, and it is the standard correction for
response shift. The GBO approach fits us because concerns are already the
parent's own words; their materials are non commercial licensed, so we use the
method in our words and never the name.

**Nothing DiGi says reaches a parent unread any more.** The Sunday wisdom
rebuild used to go live on an unattended cron. It now lands in a holding pen
(migration 167, applied as 165 before another session took that number) and
/dashboard/admin/wisdom is the only path to a parent. The failure mode left is
a stale corpus rather than a wrong one, which is the right way round. The
rebuild also now reads the event log, including the misses, so a pattern that
keeps failing loses weight instead of holding it forever.

**Why digi_outcomes had zero rows.** The follow up chain was broken at step
one: /api/moments/tried had no caller anywhere in the app, and DiGi has never
once chosen the schedule_followup tool in 166 questions because its description
carries four separate warnings against using it (save_memory, same array and
dispatcher, has 53 uses). The button is now wired ("I tried this" on the
moment card) and the card only promises a check back once one is actually
scheduled. The tool wording is deliberately untouched: loosening it changes
what DiGi does to families and is its own decision.

## 7 August 2026: the phone's text size setting reaches the app

**Type tokens are rem now, not px.** A parent who turned their text up in
settings got bigger text in every app except ours. One file changed and the
whole app follows the dial, with -apple-system-body on the root so iOS
Dynamic Type joins in. At default settings nothing moved.

**The planned one notch size bump was dropped, on purpose.** body already
carries zoom 1.07, the tuned readability dial, so base already lands at about
17 on glass where Duolingo and Good Inside sit. Stacking a token bump on top
would have overshot to 18 and risked wrapping buttons everywhere. One dial,
not two.

**The 12px rule was holding at 98.9 percent and is now enforced.** 930 of 943
uses were the mono eyebrows the rule allows. Ten strays got two different
medicines: four mislabelled eyebrows moved to the mono family keeping their
size, four kid app sentences moved up a size. wiring-check gained a sixth
check that fails CI on a body font sentence at 12px, because the rule was
already written down when the ten happened, and a rule ignored ten times
needs a check rather than an eleventh restatement.

## 7 August 2026, evening: phase 3 of the type plan is claimed and approved

**Justin approved the three volume pattern from the interactive mock.** One
way to say "this needs you", used on both apps: a single butter Now row at
the top of Home for the one thing a person is waiting on, tick and fold
Today rows for jobs that can wait an hour, and a mono count chip for
everything else. Three rules: only ever one Now, the volume is picked by who
is waiting, nothing else on the screen glows. Rows stay white with ink text,
after two rounds of colour review on his phone. The lasting lesson from
those rounds: iOS paints button text in Apple link blue unless a colour is
set explicitly, so every tappable row must carry its own ink.

**Phase 3 is built (PR 726).** The Now slot reworks HomeLive: one butter row,
approvals outrank the due check in, only one ever shows. The Today card
replaces four Home cards (round up, deal review, device setup, child app
nudge) with tick and fold rows that keep each card's honest dismissal
semantics. One deliberate holdout: PushPrompt stays where it is because it
owns the notification permission machinery and the setup anchor, and a row
saying the same thing on the same screen would be a second voice. The count
volume already existed as the quests tab chip. /ref-needs-you shows both
pieces without a login.

**Home now loads in two database waves, not ten (same PR 726).** Justin:
"opening the app seems a little slow also". The Home server component ran
about ten awaits in sequence, each a full round trip to the database before
any HTML left the server, and the dashboard layout added one more on every
page. Same reads, same meaning, now two parallel waves on Home and one on
the layout. Nothing about what renders changed.

## 8 August 2026: the Mobbin pass closes the type plan

Justin reconnected Mobbin and phase 4 ran: live captures of Finch, GoHenry
and Greenlight confirm the three volume pattern, the type floor and the calm
states we shipped. Two notes folded forward for future touches: Finch ticks
on the thumb side (right edge) where ours tick left, and a count inside a row
reads better as a subline word than a chip. Good Inside is not on Mobbin, so
its part of the review stays sourced from our reference notes, permanently.
All four phases of the type plan are now complete.

**The two Mobbin borrows and the repeating first card, acted on (8 Aug).**
Today card ticks moved to the right edge, the thumb side, the way every
Finch row ticks one handed; emoji tiles hold the left. The recommender now
says so when it re offers a script the parent already opened, and names the
two taps (used it, not needed) that move it on, instead of looking stuck.
The daily deck's reflective question rotates through three per stage by day
instead of one laminated line. The deck's focus card stays fixed on purpose:
it is the stage's one thing, and rotating it would unsay that.

## 8 August 2026: setting up a screen is per screen, not per guide (migration 169)

Justin, having added two devices: "I've added these devices and it is
automatically saying set up although I haven't." `device_setup_progress` was
keyed `(user_id, device_key)` where `device_key` names one of our GUIDES, and
one guide covers more than one screen: `iphone` is the guide called "iPhone and
iPad". A house with both had two rows in `family_devices` pointing at one row in
progress, so ticking the iPhone ticked the iPad.

Not a display bug. Screen Time is set on the device, so that tick was the app
telling a parent their child was protected on a screen nobody had touched.

Migration 169 lets a progress row belong to a family device. Guide level rows
keep their meaning for the coverage board and the catalogue and are still
written when a screen is ticked, so the board goes green off real work. Only the
reverse stopped. Ticks already earned are carried onto the longest owned screen
of their guide, and where two screens share a guide the newer one is left
honestly blank: an unticked screen that is set up costs a parent one tap, a
ticked screen that is not costs a child their protection.

Constraint shape worth remembering: `unique nulls not distinct (user_id,
device_key, family_device_id)`, not two partial indexes. PostgREST can name a
constraint on conflict and cannot name a partial index predicate, so partial
indexes would have broken every upsert the table takes.

## 8 August 2026: the child gets the week, read only

Justin: "we could build same viewer on child's phone so they can see their
week." Same data, different screen. The parent's version is seven rows with a
tick, a cross and an add on each item because a parent is planning; the child is
answering "what do I need tomorrow" and "is Cubs Thursday or Friday".

Mobbin: the hour grid apps (Outlook, Amie, Evernote) are wrong here for the same
reason they were wrong on the parent's version, school reminders are all day
things. Saturn Calendar is the pattern, a school timetable for teenagers: a
strip of seven days with a dot on the ones that have something, then that one
day as a big list.

Read only, and that is the decision rather than an omission. Clearing a school
reminder is the grown up saying the thing is handled, and a child ticking "paid
for the trip" would put a wrong fact on their parent's list.

Standing note for the child app: text sits on an anthracite background, so
headings are white, never `var(--ink)`, and past states dim by colour, never by
opacity. The balance page still sets `var(--ink)` on its h1 and is nearly
invisible; it is on the list.

**schedule_followup loosened, on Justin's say so (8 Aug).** The tool DiGi
never picked (0 uses against save_memory's 53) had a description that was
four prohibitions in a trench coat. It now leads with plain permission the
way save_memory does, asks for the four learning fields by name, and keeps
one guardrail line: a follow up asks about something the family chose to
try, never about something they did not. This is the tap that feeds
digi_outcomes and everything the evidence ledger builds on it. Watch the
digi_followups count over the coming week to see it working.

**The wisdom pen gains its handle.** The founder rebuild route existed with
no button, so the only way to fill the pen was to wait for Sunday. The
wisdom review page now carries Run the rebuild now, same implementation as
the cron, writes to the pen only, so the first batch can be pulled and
reviewed today.

**The service catalogue is one file and it grew three entries (8 Aug).**
Justin: "every single piece of service and benefit, why and problems solved,
so we have it all saved somewhere." That file already existed as
content/brand-story/service-post-map.md, eighteen services each with problem,
what we made, hinge, hook and proof path. It now carries entries 19 to 21 for
the week's builds (the child's own scripts, the evidence of how far you have
come, DiGi's follow ups) and a standing rule in the header: when something
new ships and a parent can touch it, it gets an entry the same week. Entry 21
deliberately waits for real follow ups before it earns a Friday post.

## 8 August 2026 — the star chart becomes a Sunday habit

Justin: "can we add print my weekly star chart, customise it as a Sunday one, the
five jobs rotation every Sunday ready for the week, or monthly, whatever you
advise. I could not see it on printables on the child's phone."

**Weekly, not monthly, and the reason is the reset.** The app already runs a
star week from Monday to Monday in London, because that is when a child's
earned minutes reset. A monthly chart would straddle four of those resets, so
the sheet on the fridge and the numbers on the screen would disagree for three
weeks out of every four. A month grid is also thirty columns on A4, which a six
year old cannot use. Monthly is the right shape for a KEEPSAKE, the summary of
what they earned, and that is a different artefact from a working chart.

**Customised was already done.** Another session had the builder reading the
family's real active jobs off the quests board. What it had no idea about was
time: the chart printed undated, so a fridge ends up with three of them and
nobody knowing which is live. Every sheet now carries "Week beginning Monday 10
August", and on screen there are two chips, this week and next.

**Sunday is the only day the offer appears.** chartWeekStart returns tomorrow's
Monday on a Sunday and today's Monday every other day, so making the chart on
Sunday afternoon gets you the week about to start, which is the only reason
anybody makes one on a Sunday. Reprinting on Wednesday means the chart was lost,
not that the week moved.

**The chip names come from the server, not from the index.** On a Sunday the
first week IS next week, and a chip reading "This week" over a Monday that has
not happened would be a lie on the one control whose whole job is saying which
week you are printing. So the server sends "The week ahead" and "The one after"
on a Sunday, and "This week" and "Next week" otherwise.

**Three rules keep the weekend badge an offer rather than a nag.** Only to a
family who has already printed one (never printing is what the existing "To
print" badge is for), only on Saturday and Sunday (an offer that sits there all
week is wallpaper by Wednesday), and only when there is no print for the Monday
coming. Print it and the tile goes quiet until next weekend.

**Migration 170 is what made the weekly question answerable.** star_chart_prints
knew only that a chart had been printed once, ever, and the tile was being asked
to answer two different questions with that one fact. Existing rows are left
null rather than backfilled to a guess: we know those charts were printed, we do
not know which week they were for, and inventing one would either nag a family
who printed on Sunday or go silent for one who did not.

**The child's phone: not a bug.** The kid printables tab lists sheets from the
printables registry, and the star chart is a parent tool that lives on the
dashboard. A child cannot print and does not set their own jobs. Left as it is
and flagged to Justin rather than quietly added, because putting it on a child's
screen is a different feature and his call.

**Checked** with every day of a week plus the October clock change week through
chartWeekStart, and the new badge and week chips at 390px and 1280px in
Chromium. The signed in builder page could not be reached in the sandbox, so the
new markup was checked as a fixture rather than against the live page.

## 8 August 2026 — the waiting for you row wrapped one word per line

Justin, with a screenshot: "text issue here." A pitched quest reading
"Please can I do the My Kindness Bucket List printable" down a column one word
wide, while the card ran off the side of the phone.

**Both symptoms, one cause.** The row was a flex line holding an emoji, the
sentence, an Add button and a dismiss, with both buttons at flexShrink 0. The
buttons plus gaps plus padding come to about 260 unshrinkable pixels, so the
sentence was handed what was left. Measured in Chromium at the screenshot's own
width: **26 pixels across 17 lines**. And because a flex line cannot go below
its own min content width, the card then pushed wider than the screen and took
the page with it.

**A shorter title would have hidden this, not fixed it.** These titles are
generated from what a child actually asked for, so their length is not ours to
control, and truncating one would hide the thing the parent is being asked to
approve. The layout has to survive a long one.

**The row wraps now.** The sentence asks for 190px and takes a line of its own
when it cannot have that, the two buttons travel together and drop beneath it
right aligned where a thumb already is, and overflow-wrap anywhere stops one
freakish word shoving the card off the phone. Measured after: 222px across 4
lines at the same width, and desktop is untouched at one line either way.

**The cost, named rather than hidden:** a short row like "Teo ticked Brush
teeth" now also puts its button on a second line on a phone, because flex
wrapping is decided by available width and not by how long the content happens
to be. One basis cannot keep short rows inline and force long ones to wrap. The
consistent two line row was chosen over occasionally saving thirty pixels.

## 8 August 2026 — the child's timer looked paused when they left the app

Justin: "I've noticed when you go off the child's app the timer pauses. That's
a bug."

**The countdown was never wrong. The recalculation stopped.** Every tick reads
the wall clock (left = end minus now), so it has never decremented a counter and
the number is correct the instant it is recomputed. What browsers throttle is
the one second interval: down to about once a minute in a hidden tab, and
suspended outright when a phone backgrounds the app. The digits freeze at
whatever they last said.

**The serious half was not the frozen display.** Switching to YouTube is exactly
when the minutes are being spent, and if the block ran out while the app was in
the background the expiry branch never ran: no alarm, no hand it back, no stop
recorded. A timer whose whole job is to END was relying on the child watching it
in order to finish.

**Fixed by firing the tick on the way back in**, on visibilitychange, pageshow
(a phone restoring from the back forward cache does not always raise the first)
and focus. Guarded on visible so a child leaving does not spend their last
seconds of attention on a jump.

**Verified honestly.** Browser background throttling cannot be reproduced in a
headless sandbox, and two attempts to force it (a second tab taking focus, then
Page.setWebLifecycleState frozen over CDP) both left the page running normally,
which is worth writing down so nobody repeats them. So the MECHANISM was tested
instead: with the interval killed, the shipped code stays stuck on 4 seconds
forever and never fires the finish, and the fixed code corrects to the true
negative and fires the finish within one frame of the return event. The
throttling itself still wants a look on a real phone.

**The other per second intervals were left alone** (LiveTimerChip, StarSummary,
SchoolActionsCard). They only paint a clock and self correct on the next tick,
and none of them end a session, so a frozen second there is cosmetic.

## 8 August 2026 — three from the child's app

**The Quests tab did not go to quests.** Justin, with a screenshot. The tab row
is sticky and setting the tab only swapped what was BELOW it, so a child tapping
Quests halfway down the page stayed halfway down the page. The other two tabs
were already scrolled into view when the five a day row or the shortcut tiles
selected them, so the buttons themselves were the only route in that did
nothing. And Quests does not belong at the tab row anyway: the jobs live in the
ONE Today list ABOVE the tabs, so scrolling there lands a child on the balance
gauge with their jobs off the top of the screen, which is exactly what the
screenshot showed. Quests now goes to the jobs, the other two to the tabs.

**Coming back mid screen.** That was the browser restoring the scroll position,
which is right for an article and wrong for a board whose job is to say what to
do next. The landing is chosen now rather than remembered: jobs left goes to the
Today list, all done with new lessons opens Lessons, all done with new
printables opens Printables, and nothing outstanding goes to the top, which is
the honest answer to a child who has finished. Waits on seenHydrated, because
until localStorage has loaded, seenLessons is empty and EVERYTHING counts as
new, which would have sent every child to Lessons on every visit.

**The week page is a calendar now.** Justin: "the colours of this page need to
match Google Calendar colours mixed with touches of our brand." Mobbin first, as
the rule says: Outlook, Toggl, Finch, Runna and Google's own are all LIGHT, and
the reason is not taste. A calendar's whole job is to let coloured chips mean
something, and colour coding on a dark ground either glows or goes muddy.

So the page moved to butter, and each kind carries a real Google Calendar named
colour as a wash with a solid rail down the left edge: Peacock for kit, Basil
for homework, Grape for an event, Tangerine for a deadline, Banana for a
payment, Flamingo for a notice, Graphite as the fallback. The rail shape is
Toggl's and Outlook's, and it survives small sizes better than a filled block.
Ink, Nunito and the chunky radii stay, so it reads as a calendar without
stopping being ours. Banana for money on purpose: a payment is a grown up's job
and a child should never read one as something they have to solve.

**Scoped to this page, not to the token.** --kid-bg is used by five other child
sub pages Justin has not asked about. A colour token is the wrong place to make
a one page decision.

## 8 August 2026 — Homepage rebuilt around one message
Justin locked the hero: "A clear digital pathway from first screen to 16."
Ten minutes a day is the single time claim, with the catch up promise
(miss days, the pathway catches you up). Digital Health Checker is footer
link only. Hero and stage cards use the Planet Friends CDN art with the
passport as the finish line. Every CTA routes to /starter-pack including
both paid pricing buttons (were /join). Page went from 2,930 lines and 34
blocks to a 10 section spine; TRUST method, schools section and FAQ
accordion left the homepage (live at /pathway, /schools, JSON-LD kept).
Research base: research/homepage-audience-language.md and
plans/homepage-section-audit.md.

## 8 August 2026, evening: phase 1 of the curriculum depth plan is built

**This week at school.** The 448 objectives gained a week: a deterministic
walk through the term (lib/learning/this-week.ts), no model call, same
objective all week, a new one on Monday. Delivered through what already
existed: a Today card row that puts away until next Monday, a strip on the
learning page with the objective and the dinner table frame, and Make it a
job prefilling the quest composer through the pendingTitle mechanism it
already had (two stars, the same weight as the homework templates). In the
holidays it previews what starts when they go back, said as a preview,
because this week in August would be a small lie. Other countries, per
Justin's note: the curriculum slug is an explicit parameter, and a child we
cannot place in the England system gets no brief rather than a wrong one.

**The four day funnel got its countdown and its honest close (8 Aug).** The
trial was already four days; what shouted 7 was one stale line on Home. The
banner is now TrialCountdown: days while days are truthful, a live hours
and minutes clock inside the last day counting to the real trial_ends_at,
and an ended state that leads with the family's own numbers (jobs ticked,
streak, or silence) and says what stays free. The techniques are the honest
three, argued in the component: their own evidence, a real clock, true
scarcity (the 50 cap is enforced in checkout and counted live on the
upgrade page). The trial push sequence is planned in the week plan addendum
and waits on Justin because it messages users.

**The child's 404 on their own lessons, found and closed (8 Aug).** Justin's
screenshot: a done lesson on the child app landing on Page not found. Three
of Teo's passed lessons have no authored deck (slides null), the child
lesson page hard 404s on a missing deck, and the kid home's focus lesson
query did not carry the list page's no deck filter, so the app could offer
a lesson its own page refuses to open. Two fixes: the kid home query now
carries the same not null slides rule as the list, and a real lesson with
no deck redirects to the child's lessons list instead of 404ing, because
the links that land there are the app's own. Guessed or junk ids still 404.

**The child's finished day folds to one line, and coming back starts at the
top (8 Aug).** Justin, on Teo's screen: five crossed out rows under Today is
done, and the app reopening wherever it was left. The five a day now folds
to one proud line with the streak on it and a tap to reopen, the same rule
the parent's path uses. The quests screen starts at the top on entry, and
when the PWA resumes after five minutes or more away; a quick app switch
never yanks the scroll.

**The child lessons list gives the words the whole width (8 Aug).** Justin:
"looks untidy text." The card was a three column flex, and at the child
app's big text scale the fixed right column (chip, padlock, Go) starved
titles into one word a line beside a field of empty card. The chip, the
padlock and Go now sit under the words, which costs the sentence nothing
at any scale.

**The squeezed row sweep, and the layout rule it leaves behind (8 Aug).**
Justin, on the parent Home next up card: "make sure we don't have messy
text vertically like this." Same fault as the child lesson cards, all over
the app: a flex row with a flex 1 sentence beside a fixed width padded
pill and no wrap, so at larger phone text sizes the pill keeps its width
and the sentence stacks one word a line. A sweep matched 54 rows; ten were
real (Home next up and finish setting up, quests Share, Sunday check in
Start, Back to today, install banner, job balance Review jobs, Spot
something good, weekly roundup glances, manage jobs Done) and each moves
the action under the words, or wraps where the button belongs beside short
titles. The rule for new UI: a sentence and a fixed pill never share a
flex row without a wrap. PR 740.

**The check in is one slider, and the scale now climbs (8 Aug).** Justin:
answering twice was too much, the number strip shut down on anyone who
paused, nobody knew what 1 against 10 meant, and the scale should rise as
things improve so every chart of a family's journey climbs. So the better
same still hard chips and the six second timer are gone. One slider is the
whole answer, the Apple Health mood pattern from the Mobbin pull in our own
butter and ink: live word naming the number as it moves, both ends
labelled, last time's score ghosted on the track, and the verdict computed
by the server from the change since last time, never asked. Migration 171
renames severity to score and inverts stored rows: 1 is really tough, 10
is going great, up means better, everywhere and forever. Applied to the
live database same day.

**The shelf tells the truth: all 44 stub lessons are real now (8 Aug).**
Justin: fix the 44 urgently, best ever lessons, child facing too. Every
stub across the passport grid (five stages, nine categories) got a full
deck in the proven seven slide arc, each teaching one named move a family
uses the same day (the three word trick, shield up, the double check,
stop tell report, the first meet plan). One deck serves both sides by
design: the child app plays the same slides with the grown up script
stripped, so these ARE the child facing versions. The craft rules are now
standing: Rosenshine arc built into the player, wrong answers explained
kindly, sensitive teenage lessons name the pattern honestly with no blame
and the real reporting route (CEOP), no invented statistics, no dashes.
Machine validated against the slide contract before touching the
database. Migration 173 (172 was claimed by streak week seen while this was being written).

## 8 August 2026 — the email programme reaches six weeks

Justin: "can we build on top of current emails that go to sign ups and count how
many weeks we have covered and start adding more around school curriculum and
how digi learns explaining simply the brain and why it will bring the top
provider advice by feedback loop and updates from users."

**Covered before this: fourteen emails, day 0 to day 25.** Three and a half
weeks, then silence on the lifecycle track forever. Six more take it to day 43,
twenty emails, just over six weeks.

**The 30 day window was a silent ceiling.** The cron only loaded profiles created
in the last 30 days, so anything scheduled past day 30 would never send, never
error and never log. Six correct looking emails would have reached nobody. Now
60 days.

**Cadence drops to every three days.** Six straight weeks at onboarding pace
stops reading as help.

**The school email splits by stage, and that is the point of it rather than a
refinement.** The five topics the July 2025 RSHE guidance adds (pornography,
incel cultures, deepfakes, gambling, illegal behaviour) are secondary content.
Listing them to the parent of a five year old is the fear pitch this company
exists to argue against, and no caveat underneath rescues a list already read.
Foundation and Builder get the KS1 and KS2 ground their child actually meets.

**Curriculum claims held exactly where the code already holds them.**
curriculum-badges.ts says outright that nothing there claims the family lessons
are the school curriculum, only that they walk the same recognised ground. The
emails say that and no more.

**Every DiGi claim traces to running code**: knowledge-refresh reading real
parent questions behind a human approval gate, rebuildWisdom reading the three
places a success is recorded, getProvenSolutions weighting by evidence_count,
the Monday eval suite that emails an all clear, the monthly answer review, and
the flag link under every answer. The feedback email lifts "a good place to
start and not a verdict" straight from the wisdom.ts comment rather than letting
it grow more confident on the way into an inbox.

No migration. email_log already takes any email_key.
**The four day funnel's pushes, and the child's school week card (8 Aug).**
Justin: yes to both. Three trial pushes ride the trial clock daily at
08:30 UTC: days left 3 the value push leading with the family's own
approved tick count, days left 2 the honest warning that full access ends
tomorrow, days left 1 the last call with the live founder seats count.
Once only through email_log with push keys, never to payers, insert first
so the unique index is the lock. And phase 2 of the curriculum plan: the
week's school objective lands on the child's Learn tab as ONE calm card a
week, never a feed, no notifications at the child. The child taps that
they practised it, the tap becomes a pending quest tick like a game, the
parent approves, three stars land. The server recomputes the objective
from date of birth and dedupes per week; in the holidays there is no card
at all.

**The email programme goes weekly and reaches week 26 (8 Aug).** Justin:
one per week is best, and cover everything. The four day trial arc keeps
its pace; every email after it now lands weekly, the existing fifteen
re timed to weeks 2 through 16 with keys unchanged so nobody mid
programme is double sent. Ten new emails carry weeks 17 to 26: the
founder story (from founding-story.md only), the philosophy, the
research anchors (institutions and the experts already named in code,
never an invented study), how families' wins become starting points,
then one service deep dive a week: jobs and stars, the check in and
evidence, scripts, the school week, device time, and the year ahead
inviting a reply. Thirty programme emails over six months. Window
widened to 200 days so the tail actually sends.

**The dial keeps its history, and the welcome stops flashing (8 Aug).**
Justin, from his phone: the slider hid last time's position under the
thumb, saved too fast, and folded away before the note could be read; the
last check in should be a red dotted ring; and both apps flash their home
screen under the welcome. So the check in is a dial now: thumb starts mid
track, the red dotted ring (new --alert token, the one red in the system)
holds last time's spot throughout, the save beat is slower, and the row
LOCKS AND STAYS showing before and after instead of folding. The weekly
round up gains a check ins section reading each concern's move against
last week, up always good. And both apps carry a pre welcome hold: a
parser blocking inline script covers the screen in the app's own colour
before first paint whenever the welcome is about to show, and the welcome
removes it the moment it is on screen, with a timeout as the safety net.
## 8 August 2026 — emails go by state, not by signup date

Justin: "the emails are not just new sign ups we need to be emailing everyone
that registers including users so needs to know the difference between 1 just
signed up, 2 using it but haven't paid, 3 paid users."

**Two sessions were on emails at once today.** The other one (6a73d4f, 83dc5aa)
re-paced the programme to weekly and carried it to week 26. That is length and
pacing. This is who gets what, built on top of theirs rather than instead of it.
Their day gates are untouched.

**The window was the bug.** `gte('created_at', since)` meant a parent past the
window was not loaded at all, so no win back, no trial nurture, nothing, for the
rest of their life with the product, and nothing logged to say so. Widening it
from 60 to 200 days moves the cliff rather than removing it. The query is now
every onboarded profile, and the 200 day number survives as a guard on the
onboarding block, where it belongs: without it, opening the query would restart
week 1 for every existing member.

**Paying members were the worst served group in the system.** They got the same
onboarding as everyone and then nothing of their own, ever. Three service emails
now: what the plan unlocks, an open door to reply, the questions members ask
most. All three give rather than ask, because they already bought.

**past_due sent nothing at all.** It fell through lifecycleState to 'unknown'.
A failed card is an accident, not a decision, and it is the cheapest save in the
system.

**Sequences pace off email_log.sent_at, not signup.** That is what lets a win
back run properly for someone who registered eleven months ago and lapsed last
week. No migration needed.

**Two claims were false and got cut before they shipped.** The draft paid email
said cancel in settings, two taps, and the past due email offered an update your
card link. **Neither exists.** There is no self serve cancel and no Stripe
billing portal route anywhere in the app. Both now point at replying to a human,
which is the path that actually works. The upgrade page still says "cancel any
time" in its fear remover block, which is the same claim and is Justin's to
decide on.

**Lapsed keeps the onboarding programme.** Suppressing it was the plan until the
trial clock got checked: a no card trial expires around day 14, so lapsed is the
normal state for everyone who has not paid, and suppressing on it would have
gutted the programme for most of the list.

## 8 August 2026 — paid depth, weekly win back, and the member figures

Justin: "build more paid customers emails about every aspect of what they can
do, the research and why we run it the way we do... make sure we tease sign ups
that disappear after trial ends and keep emailing them weekly to entice back...
have all stats on insight board, users login patterns of users, non paid."

**The win back no longer stops at three.** Justin asked for weekly, so seven
teases follow the three win backs, one a week, ten emails over about eleven
weeks. They reuse the pre signup teaser bank rather than adding seven templates,
which is right rather than lazy: a lapsed parent is in exactly the position a
lead is in, an email address and no subscription, and each teaser is already one
service, one hook, one door. Only the unsubscribe link differs. `winBackLastEmail`
lost its "this is the last one" framing, because it is no longer true.

**Both sequences send one email per run, never a catch up burst.** With the
window gone, every long standing member becomes eligible on the same day, and
firing five at once would be the worst possible first impression of a track
meant to reward paying.

**The paid depth five were picked by auditing every existing subject first**,
across templates, the weekly programme and the reveals, precisely because two
sessions have now duplicated each other on this. Everything in the five is
ground none of the other forty odd emails walk. Two of them are about what the
CHILD experiences, which nothing had covered: every other email in the system is
written to the parent about the parent's side of the glass. The disclosure tool
email is the one worth keeping if only one survives.

**The member figures answer the question the board could not.** It knew whether
DiGi was working and what parents asked. It did not know how many people are
here, how many pay, or whether they still turn up. Login has no home in our own
tables, so it reads auth.users through the admin API, paginated, and says
plainly when it stops being fine rather than leaving a silent cliff.

## 8 August 2026 — the privacy policy contradicts the product

**Found while sourcing a paid email about data.** The privacy page says: "We do
not ask for a surname, a date of birth, a photo, or a school."

**The app asks for a date of birth.** Settings has a birthday field per child
(migration 083), stores `children.date_of_birth`, and derives the age band from
it. `interests` is collected too (088) and the policy does not mention it.

This is a published legal statement about children's personal data that the
product contradicts, with ICO registration still outstanding. Two ways out and
both are Justin's call, not a thing to quietly rewrite: stop collecting the
birthday and keep the promise, or change the policy to describe what is actually
collected and why.

**No email in this batch mentions data or privacy**, which was the original plan
for the set, because sending forty inboxes a claim that is currently untrue is
the one thing worse than the page being wrong.

## 8 August 2026 — the two false promises, fixed properly

Justin: "Fix 1 and 2 and correct plan."

**Cancelling now exists.** `/dashboard/upgrade` had promised "cancel any time"
since it was written and there was no way to do it. Fixed in the product rather
than in the copy: a Stripe hosted billing portal at `/api/stripe/portal` and a
Your plan section in settings, shown only to people who actually pay.

Hosted rather than built here on purpose. Cancelling and re-entering card
details are the two flows where a subtle mistake costs someone real money, and
Stripe's page is PCI handled, localised, and already knows about proration,
trials and the real invoices. It also cannot drift out of step with what Stripe
thinks the subscription is.

**It fixes the card update in the same stroke**, which is what the past due
email needed and could not have. Both emails that had been rewritten to say
"reply to me" now point at the real screen again.

**The portal has to be switched on once in the Stripe dashboard.** Until then
the API returns a configuration error, and the button says the door is not open
yet and gives an address, rather than showing a parent a dead button and letting
them think cancelling is being made difficult.

**The privacy policy now describes what is actually collected.** It said "We do
not ask for a surname, a date of birth, a photo, or a school". The app has asked
for a birthday since migration 083 and interests since 088. The policy now says
both are optional, what each is for (the birthday moves a child into the next
stage on the right day, the interests make scripts sound like your child), and
that both can be cleared in settings. Verified against the save code: clearing
the field writes null, and the age band falls back without it.

**The product was not changed to match the policy**, which was the other option.
The birthday earns its place, so the honest fix was to describe it rather than
delete a working feature.

**The effective date moved with the words.** A policy that changes and keeps its
old date is the same problem one level up.

**Left alone deliberately:** the same sentence says we do not ask for a school.
No UI was found that collects one, so it stands as written rather than being
rewritten on a guess. `profiles.school_id` and `school_region` exist and nothing
in the parent app appears to set them. Worth confirming before the ICO
registration goes in.

## 8 August 2026 — a parent could grant themselves the product

**Justin, testing:** *"I was able to go around the block, maybe that's for
testing, but we must make sure real users can not continue without
subscribing."* It was not only the testing allowlist.

**RLS decides which rows you may write. It never decides which columns.** The
policy on `profiles` was `auth.uid() = id` with no column restriction, and
`authenticated` held a table wide UPDATE grant, so any signed in parent could
run `supabase.from('profiles').update({ subscription_status: 'active' })`
against their own row from the browser console and have the whole product free,
permanently. The same write on `trial_ends_at` restarted the trial as often as
they liked. Neither needed a bug. It was the ordinary client the app ships.

**Migration 175** revokes the table grant and grants back nineteen columns by
name. Five are withheld for good: `subscription_status`, `subscription_tier`,
`is_founder`, `trial_ends_at`, and `id` (the policy has no `WITH CHECK`, so a
writable primary key is a row a user can point at somebody else).

**A column level revoke cannot cut into a table level grant.** The first draft
of 175 did exactly that and was a silent no op: the privilege survived and the
migration looked like it had worked. It was caught only by running it live in a
transaction and reading the privileges back. Any future attempt to narrow a
column privilege has to be revoke then re grant, and has to be verified by
reading `information_schema` afterwards rather than by trusting the SQL.

**The trial moved to the server** (`/api/trial/start`, service role) because a
client granted trial is repeatable, and granting it client side is what
required the column to be writable in the first place. Check and write are one
statement so two tabs cannot both pass.

**`NULL <> 'active'` is NULL, not true.** The route's `.neq` filter is only
correct because `profiles.subscription_status` is NOT NULL default `'free'`,
checked against the live schema. If that constraint is ever dropped, the filter
silently stops granting trials and must become an explicit is null or neq.

## 8 August 2026 — the See their lessons button was already right, and looked broken

Justin, from his phone: "This button doesn't [work] it should show just the age
related lessons."

**It was already showing just those.** `onSeeStage` called `setStage(childStageNum)`,
and the Lessons tab sets exactly that on entry, so the button was setting the
filter to the value it already held. A no op. The list underneath had been
filtered to the child's stage the whole time.

**Two things made it read as broken, and both are real.**

1. **The selected chip sat off screen.** The chip row scrolls sideways and the
   child's own stage is the fifth chip. On a 390px phone only "All ages" and
   "Stage 1" fit, so the row looked like nothing was selected. From where a
   parent is sitting, an invisible filter and no filter are the same thing.
   The active chip now scrolls itself into view, centred, whenever the stage or
   the view changes.
2. **Tapping it moved nothing on screen.** The card sits above the list, so even
   a real filter change happens below the fold. The button now also scrolls the
   list into view, so it lands somewhere.

**The browser had no fixture at all**, which is why one control a parent uses
constantly had never been driven outside a signed in session. `/dev/lessons-filter`
renders it with a Stage 4 child and lessons across all five stages, the shape
that makes the overflow visible. Driven in Chromium at 390px: the chip reads
"Stage 4 · 13 to 15 · Teo" and is on screen at load, the tap moves the page 325
pixels onto the Shaper route, and the list holds stage 4 tiles only.

Writing the fixture also surfaced that the banner counts only ids starting with
`lesson-`, the family library set, so a fixture with invented ids renders no
card at all. Recorded because the next person to write one will hit it too.

## 8 August 2026 — two more links that went nowhere, same cause

Justin: "See timer should actually take you to the ticking timer" and "Play good
night screens should take you there."

**Both are the same failure: a link left behind when the thing it pointed at
moved or never existed.** Nothing errors, the route resolves, and the parent is
simply somewhere else. That is the quietest kind of broken link and the reason
neither was ever reported as a bug by anything automated.

**The timer.** Four places pointed at `/dashboard/quests#screen-time`: the bell
notification, the device time cron push, the stop push, and the Screen timer
tile on home. The timer moved to its own page at `/dashboard/quests/timer`, and
the anchor was left behind on a spacer div that now sits above the Balance and
stats LINK. So "See the timer" landed on the quests board, beside a link to a
different page, with no countdown on screen. The spacer was also a duplicate id
with the real timer card. All four now point at the timer page and the spacer
is gone.

**The game.** A job row is a plain div, which is right for "put your shoes away"
and wrong for a job that names a game we made. `lib/quests/craft-links.ts` maps
the nine game pack titles to their sheets, stripping a leading verb so "Play
Goodnight Screens pairs" finds "Goodnight Screens pairs". Deliberately exact,
never fuzzy: "Play fighting is not allowed" matches nothing, because landing a
parent on the wrong sheet is worse than leaving the row as text.

**The anchor alone would have been another dead link.** CraftPack renders only
the selected age band, so six of the nine ids were not in the DOM at all. Proved
by driving it: 3 of 9 present on the first run. The hash now chooses the band
first, then scrolls after a frame, because the element does not exist at
navigation time, which is exactly why it failed. All nine verified landing with
the sheet 96 pixels down.

**Two fixtures added**, `/dev/lessons-filter` and `/dev/craft-anchors`, because
neither page had one and both are behind auth. That is why controls a parent
uses constantly had never been driven at all.

## 8 August 2026 — nothing buzzes a child's phone at night

**Justin:** *"Can we make sure we don't send late pwas to child app. Should
stop any between 19:00 and 8:00 am."*

**Three doors reach a child's device, not one.** `sendPush({audience:'kids'})`,
`pushToChild` with about twenty five call sites, and a hand rolled webpush call
in `/api/quests/ping`. The gate is in all three, at the bottom of each, so the
next feature that nudges a child inherits it without knowing it exists. A rule
enforced at the call sites would have been thirty three places to forget.

**The hour is read in London, never from the server clock.** Vercel runs UTC
and the families are British. Through the summer a naive UTC check would let
pushes through until 20:00 British, which is exactly the hour being complained
about, and then hold the morning ones back until 09:00. `lib/time/london.ts`
already existed and already survives the clocks changing.

**Held, not queued.** A stopped push is dropped. A jobs reminder from 21:00 is
not worth waking up to at 07:00, and every one of these already has a home on
the child's own page, which shows the same news at the next open.

**THE WINDOW IS 19:00 TO 07:00, NOT THE 08:00 FIRST ASKED FOR.** Applying 08:00
literally switched off two pushes that are deliberately before school: the
school kit reminder and, in winter, the morning jobs reminder. Neither could be
saved by moving its cron, because a fixed UTC schedule cannot be after 08:00
London in winter without being 09:00 in summer, which is after the school run.
Put to Justin as three options with the real times spelled out, and he chose
the earlier boundary: "1". It still stops every hour he was complaining about.

**THE PART THAT WAS NOT OBVIOUS: the rule silently switches off scheduled
pushes whose cron sits inside the window.** Cron schedules are fixed UTC and
drift an hour against London twice a year, so this has to be checked in both
seasons or it looks fine for six months. Three moved:

| cron | was | now | British time |
| --- | --- | --- | --- |
| evening jobs reminder | `45 18` | `45 17` | 19:45 to 18:45 summer |
| school reminder to child | `0 18` | `0 17` | 19:00 to 18:00 summer |
| school kit reminder | `45 6` | `5 7` | 06:45 winter, which was held, to 07:05 |

The kit reminder is five minutes past the boundary rather than on it, because a
cron that drifts a minute early would be silently dropped for a whole winter.

**Knowingly left held: the star week rollover**, Monday 00:10, which tells a
child they saved sticker credits or holiday minutes. Those two pushes now never
fire. That is the rule working rather than a fault, a 01:10 buzz is exactly
what was being complained about, and the news is waiting in their sticker book.
If a child should be actively told, the fix is to move the telling into a
morning cron rather than to weaken the window.

## 8 August 2026 — contact details on the home page

Justin: "Make sure we have contact details on home page my name address email
hello@guided."

**Two of the three existed and were hidden.** The email was the label on a
Contact link in the footer column, so it was a mailto rather than something you
could read, copy or check. The name sat in the copyright line at 35 per cent
opacity. A visitor could not tell who they were buying from without opening the
terms.

**The address does not exist anywhere in the repo.** `lib/content/contact.ts`
now holds all of it in one place, with `address` deliberately EMPTY and every
render guarded by `hasAddress()`. Inventing a plausible looking address would be
worse than having none: it is a legal statement about where a business can be
served, and a wrong one is the version that actually costs something. **Waiting
on Justin. One line to fill in and it appears.**

**This is a legal requirement, not a nicety.** A UK business selling online has
to give its name, a geographic address and an email, and they have to be easy to
find. A mailto behind the word "Contact" is not that. Same footing as the ICO
registration and the cancel route: promises the site makes that the site has to
be able to keep.

The copyright line now reads from the same constant, so the founder name cannot
end up different in the two places it appears.

## 9 August 2026 — the address landed

Justin: "The address is . Apple Acre, Winscombe, star , BS25 1QF"

Filled into `lib/content/contact.ts`, so the homepage footer now carries the
full set: name, business, postal address, email. That closes the last blank in
the online selling requirement.

**Written in Royal Mail order rather than the order he typed it**, which is the
one judgement call here. Star is the hamlet, Winscombe is the post town for
BS25, so the locality goes above the post town. Post addressed the other way
still arrives, but the post town line is what sorting reads, and an address on
a website is the one a solicitor or the ICO copies without checking it. Flagged
to Justin rather than changed silently.

**Worth doing next, not done here:** the same address belongs in the data
controller section of the privacy page, which is where the ICO looks, and he is
doing the ICO registration today. Left as his call rather than expanding a
homepage job into the legal pages unasked.

## 9 August 2026 — Guided Childhood is not by The Social Billboard

Justin: "Not by the social billboard."

The footer block read "Guided Childhood, by The Social Billboard". Wrong, and my
line. Guided Childhood is its own thing. He founded both, which is what the
about paragraph on the homepage already says, and that is a different claim from
one being a product of the other.

The footer now names Guided Childhood and nothing else, and the copyright line
with it.

**The same wrong attribution is on three other pages and predates this**, so it
is flagged rather than swept: `/digitalwellbeing`, `/schools` and `/join` all
carry "© 2026 The Social Billboard". Whether those are right depends on which
venture owns each page, which is Justin's to say. The Digital Health Checker in
particular may genuinely be a Social Billboard product.

**The registered legal entity is still unknown.** `business` holds the trading
name, not a company. If a company sits behind this, its registered name and
number belong in the footer and on the terms page, and it is what the ICO
registration going in today has to name.

---

## 2026-08-09 — The split, steps 1 to 4: shared package, tokens, the schools app exists

JP approved the repo split (audit in the split audit artifact, plan in plans/split-plan.md) and steps 1 to 4 shipped in one day on PR #762. What exists now: shared/ (@gc/shared), holding the lesson slide grammar, the player and interactives, DigiCharacter, PrintBrand, curriculum badges, the new efcw.ts single source for the eight EfCW strands, the social media law flag, brand constants and tokens.css (the design tokens extracted verbatim from globals.css, pixel diffed before and after with Playwright: identical outside DiGi's animated speech bubble). The Supabase clients deliberately stay out of shared, and wiring check 7 fails the build if shared/ or schools/ ever imports an auth capable client, Stripe or the Anthropic SDK. And schools/ is a real second Next app on the Oak model: the schools marketing page as its homepage, the open curriculum catalogue, teach, the print room (minus named quizzes and certificates, which need pupils), all ten Hub documents and the class showcase re pointed at school_lessons. No login, no middleware, no crons, no API routes, and its only Supabase file is the anon read only client. Builds green with zero env in both apps. e2e/star-lessons.spec.ts is the gate for step 6: the send, play, quiz, stars land flow, run against a preview with a seeded kid token before and after the schema move. One audit correction recorded in the step 1 commit: the school_lesson entry in api/lessons/complete is live (the educator teach page posts it), not dead. Steps 5 to 9 wait for JP to schedule the cutover day. Owner actions: create the schools Vercel project (root directory schools/, domain schools.guidedchildhood.co.uk, two env vars: the Supabase URL and anon key) and say which domain is canonical, .com or .co.uk.

---

## 2026-08-09 — The cutover, steps 5 to 7: schools is its own product on its own domain

JP merged the scaffold (PR #762), said the canonical domain is .com, and called the cutover. Steps 5 to 7 shipped the same day. Migration 176 drops the one cross product FK (kid_lesson_missions to school_lessons, the uuids and every sent mission survive); 177 creates the schools schema and moves the 11 schools tables and 4 membership functions into it, metadata only, revert is the same statement reversed. The parent app reads the schools curriculum through exactly one file now, lib/quests/star-lesson-catalogue.ts, which asks the schools schema first and falls back to public until 177 has run, so the deploy and the SQL can land in either order and Star Lessons never breaks (the kid page join became a second query because PostgREST embeds ride FKs). Step 7 retired the educator surface from the parent app: /educator, /class and the schools marketing page are gone, next.config 308s all three to schools.guidedchildhood.com with paths preserved, middleware no longer guards /educator, the login page is family only again, the twelve inbound links are absolute and the sitemap entry is gone. The parked educator accounts layer (classes, pupils, deliveries, judgements) keeps its tables in the schools schema, UI retired until schools accounts get their own design. Owner actions, in order: run 176 then 177 in the SQL editor, add schools to Settings, API, Exposed schemas IN THE SAME SITTING, create the schools Vercel project (root directory schools/, domain schools.guidedchildhood.com, the two public Supabase env vars), and message the two educator test accounts that the workspace moved. Both apps build green with empty env; the star lesson gate (e2e/star-lessons.spec.ts) is ready to run against production with a kid token before and after the SQL.

## 2026-08-09 — Daily health sweep: push_subscriptions.device_id added to the required column watch

Routine sweep. Schema check clean, all ten watched columns present. Found one
real fault in the cron history: `/api/push/cron` failed on 7 August at 06:30,
body read "column push_subscriptions.device_id does not exist", 200 status the
whole time, same shape as the trial_ends_at outage. The column exists now (some
migration since added it) and there has been no repeat, so nothing is on fire
today, but the column was load bearing and not on the watch list, meaning the
next time it goes missing the board would stay quiet again. Added it to
REQUIRED_COLUMNS in lib/ops/health.ts, one line, same pattern as every other
row there.

Also found `/api/cron/job-reminders?band=morning=after_school` skipped its 8
August 16:30 run entirely, no row, no error, while the morning and evening
bands both fired fine that day. Reads as a single missed Vercel invocation for
that one cron entry rather than a code fault, nothing in the route or the
schedule explains it, and it has not recurred. Left alone. Worth a second look
only if it happens again.

Security and performance advisors: no ERROR level findings. Performance shows
501 warnings, almost all `multiple_permissive_policies` and `auth_rls_initplan`
on RLS policies across profiles, children, push_subscriptions and others, plus
the usual unindexed foreign key and unused index notes. Pre-existing shape, not
a new incident, not touched here. Security shows the RLS-enabled-no-policy
notes on ops only tables (cron_runs and friends, expected, service key only),
function search_path warnings on 4 functions, the vector extension living in
public, several SECURITY DEFINER functions callable by anon, and leaked
password protection still off. None of these are new since nothing in the repo
or decisions.md shows an earlier sweep to diff against. Flagged, not fixed:
each is a judgement call (revoking EXECUTE on functions the board itself calls,
moving an extension, turning on leaked password checking) rather than a small
certain fix.

---

## 2026-08-09 — Holding pattern: the schools site stays off the domain until the platform is built

JP is not attaching schools.guidedchildhood.com until the whole schools platform is ready. Two changes keep the world sensible in the meantime. The parent app's /schools, /educator and /class redirects now read SCHOOLS_SITE_URL (falling back to the schools project's vercel.app address) and are TEMPORARY 307s, so no browser or search engine caches the interim URL; at launch the env flips to the real domain and the redirects flip to permanent in one commit. And the schools app carries robots noindex until that same commit, so the vercel.app address never enters Google. Launch is now a two line change plus attaching the domain in Vercel.

## 9 August 2026 — platform scripts, and the free tier that looked like a bug

Justin, with two screenshots: "we really need many more moments and scripts for
social media and AI as this is core ... every possible issue with Instagram,
Facebook, TikTok and all top 10 social media platforms."

**The screenshots showed 63 scripts and 3 on social media. That was the free
tier on a test account.** Live: 296 scripts, 27 social media, 31 school and AI,
21 gaming. The free counts match his screen exactly, category by category, and
the Unlock all button was in the shot. Nothing was hidden or broken. Worth
recording because the next person to look at a screenshot of a free account will
reach for the same wrong conclusion.

**The real gap was different and narrower.** Reading all 58 social and AI titles:
Instagram appears in two, TikTok in one, and Snapchat, WhatsApp, YouTube,
Discord, Roblox, Facebook, X and Twitch in none. The library is strong on themes
and silent on the four apps a parent is holding when they go looking. A parent
does not search for social comparison, they search for streaks.

**Migration 180 adds sixteen platform scripts**, four platforms, across builder,
explorer, shaper and independent, taking social media from 27 to 43 and adding
two at builder where there was one.

**I was wrong about the send to child button and corrected it.** I told Justin it
did not exist. It does and it is complete: ScriptDepth renders the child note
with send to their app, SMS, share and copy, and /api/scripts/expand generates
the note when the stored field is null. Filling for_your_child by hand on all
sixteen buys a written child version instead of a generated one, and nothing
more than that. Said plainly rather than left as an implied win.

**The research is cited in the migration header** so the next person can check
it: Mumsnet threads and platform guides for Snapchat, the newspaper
investigation for the TikTok algorithm, the WhatsApp group default that lets
anyone holding a number add a child with no request to accept, and Instagram
Teen Accounts.

**One complication kept rather than buried.** Heitner's mentoring over
monitoring is the philosophy match, but Livingstone's survey found restriction
of peer to peer contact WAS associated with reduced risk while active co use was
not necessarily. So none of the sixteen claim talking always beats a setting.
The words come first, the setting sits in tonight, and where a setting is simply
the right move the script says so.

**Not in this batch, named so the gap stays visible:** YouTube, Discord, Roblox,
Facebook, X, Twitch, and the moments and lessons, which are their own build.

---

## 2026-08-09 — The child's home screen, reorganised: three PRs, one thing at a time

JP: "we have way too much on Home Screen so let's organise better." His order, shipped as three PRs so each could be looked at alone: school diary first, morning welcome, streaks small, five a day one at a time, use my time. Full plan in plans/2026-08-09-child-home-reorder.md.

**The school diary takes child additions, with stored provenance.** Migration 179 adds added_by (parent or child, default parent, the truthful backfill) and added_by_child_id to school_actions. The child's week viewer gained the parent calendar's entry system, copied per JP ("can we copy the parent calendar entry system we built as that worked well"): an Add button on the open day opens the same sheet shape rebuilt in KidSchoolAddSheet, child kinds only (kit, homework, event), saving through the token authed /api/kid/school-add, which dedupes like the parent route, pushes the grown up on every add, and falls back to a bare insert until 179 is run. Child items wear a "you added this" badge on the child's chips and name the child on the parent's school page. Both surfaces read added_by in a guarded second query so neither breaks between deploy and the hand run SQL.

**The five a day is one step at a time.** Done steps shrink to slim ticked lines, ONE live step shows with the loud edge, the rest wait behind a count. The duplicate Today list under it is gone from home; the jobs live at /k/[token]/jobs, which is the real KidTodayList in a jobs only shape (jobs plus the pay back message; Learn and Move stay steps of the five a day). Which jobs are due moved to lib/kid/jobs-read, called by both screens, so the five a day's count and the jobs page cannot disagree. The new job arrival notice moved onto the five a day's jobs step so it stays first glance.

**The reorder itself.** Diary always renders (a quiet day shows a slim door into the week, because the block a child adds to cannot vanish), the welcome greets by the child's clock, the streak strip is one line (JP: "don't let it dominate"), and the tab bar went solid white with a real border and full ink labels. ref-kid-home renders the whole real KidQuestScreen with a made up family, the first way to see the child home without a signed in child; ref-kid-five now imports the real component too (KidFiveADay takes initialState for fixtures).

**Worth knowing:** migrations 177 AND 179 are merged but not applied; 179 is safe either side of the deploy (guarded reads, fallback insert), but the child add stores no provenance until it runs. The schools Vercel project failed every deploy this morning until it was reconfigured mid afternoon; the repo was never the fault (schools builds green locally with zero env).

## 9 August 2026 — the ask for a job list emptied itself and never refilled

Justin, from the child app: "it's one of the 5 ask for a job but it's a list
that I cannot add one, can you check how this works and why I can't add one, it
may be a restriction on too many jobs."

**It was not a restriction, and both caps were checked against the live data
before touching anything.** Teo had one ask pending against a limit of five, and
none created today against a daily limit of five. Neither was close.

**The cause was one filter.** KidAskForJob hid a preset idea if its title
appeared in the child's recent asks at ANY status. Teo had, over a fortnight,
asked for all seven presets and had every one approved. So the quick pick grid
filtered to zero and did not render, leaving a bare text box under a line that
still reads "tap one, or write your own". Nothing explains where the list went,
which is exactly what Justin described.

**Now it hides an idea only while it is still pending.** An approved job is the
opposite of a reason to hide the idea: it is proof the child likes doing it and
the parent said yes, and helping with dinner again next week is the behaviour
the feature exists to produce. Only an undecided ask is worth suppressing,
because asking twice for the same one clutters a parent's approvals.

Verified against Teo's actual twelve rows: 0 chips before, 7 after, then driven
in the browser at 390px on a new /dev/ask-for-job fixture.

**Why it was never caught: the page cannot be opened locally at all.** It
resolves a link token with the service role, so it 500s without the key, and
there was no fixture. That is the same gap as the lessons and craft pages
earlier today.

**Two things in the same report are NOT touched, because they belong to PR 770**
(the child home five a day rebuild, open and active): the Ask for a job card
colours, and "Something kind" vanishing the instant it is tapped. Confirmed 770
does not touch KidAskForJob or the suggest page, so this fix cannot collide, and
the other two are passed to that lane rather than fixed twice.

## 9 August 2026, later: the child's chosen colour, and a print window with no way out

Two reports from Justin's phone, both on the child app.

### 1. "This page needs to be app chosen colours"

He was looking at Telling a grown up. The fault was not that page, it was the
shape of the code. **Make it mine recoloured the home screen only**, because the
whole theme (the twelve colours, the mixed hue wheel, the resolver) lived
privately inside KidQuestScreen. Every other screen a child can reach fell back
to the anthracite default in tokens.css. A child on Coral got a peach home and a
slate grey everything else, which reads as a different app rather than a choice
they made.

**Moved to lib/kid/theme.ts, same reasoning as lib/kid/buddy.ts.** Two copies of
what colour the child is means two answers and the child sees both. Ten screens
now read it: tell, suggest, balance, lesson, lessons, adventures, homework,
quiz, the lesson list and Ask for a job.

**Moving the map alone would have shipped a worse bug.** The sub pages were
written against a dark ground and hardcode white text on it. Handing them a
pastel wash untouched would have printed white on cream. So a theme now carries
its own foreground: the text that reads on it, the muted tone for mono eyebrows,
a translucent panel that sits ON the background, and the shadow underneath. Dark
themes get white overlays, light themes get ink ones, and a colour added later
is legible everywhere the day it ships without visiting a single screen.

Measured rather than eyeballed, on the mono eyebrow that sits directly on the
background: **white at 0.66 over the Coral wash scores 1.15 to 1, which is
invisible.** The themed ink scores 5.05. Graphite is unchanged at 4.61, so the
default sees no difference at all. Sunshine and Mint were 1.09 before and are
5.21 and 5.20 now.

**One existing bug fell out of it.** KidHomework drew its heading, its intro and
its back link in ink directly on the dark background: dark on dark, and barely
readable on the default. Reading them from the theme fixes that too.

**Left alone deliberately:** the jobs, week and deal screens, which are butter
or white on purpose. The week page documents why (the colour coded school chips
need a pale ground), and turning a deliberate light screen into a pastel wash is
a design decision, not this bug.

### 2. "When clicked printable it displays print, need a way back to platform"

The window the child gets from Print it now contained an image and nothing else.
On a desktop that is survivable, there is a tab to close. **Inside the installed
app there is no address bar, no tabs and no back button**, so a child who printed
the Kindness Bucket List was on a sheet with no control of any kind, and once the
print dialog was dismissed the app behind it was out of reach.

The parent side hit this on 6 August and was fixed by opening AWAY from the app,
because a PDF served by a route is not ours to decorate. **This window is ours,
we write every byte of it**, so it now carries its own way back: My quests, which
closes it, and Print again, both hidden in @media print so the paper is still
only the sheet.

**A second failure the test surfaced.** The print dialog fires from the image's
own onload, and the art is on the CDN. If that image fails, nothing at all used
to happen: no picture, no dialog, no explanation, just a blank white page. It now
says so, and the bar above it still works.

**Lifted to lib/kid/print-sheet.ts so it could be driven at all.** It sat three
thousand lines into a screen that needs a live link token, so nothing had ever
opened that window except a child on a phone. That is precisely how it shipped
with no way out. Six checks now run against the real thing on a new
/dev/print-sheet fixture: both buttons present, the dialog fires, the bar is
flex on screen and none on paper, the bar does not overlap the sheet, back
actually closes the window, and a sheet that cannot load says so with Print
again still reachable.

## 9 August 2026, third pass: the five a day actually asks, and a grown up can see it

Justin, after PR 770 merged: "yep take them over." So the two items held back
earlier are done here, plus the reminder and the tracking he asked for with them.

### Something kind did not flash off. That WAS the behaviour.

Seven of the twelve steps have `href: null`, and those rendered as a button whose
whole handler was `mark(key)`. `mark` pushes the key into `done` optimistically
on the same tick, so the row left the live slot and came back as a struck through
line before his finger was off the glass. No confirmation, no undo.

**And the row was dressed as a link.** Same `›` chevron as the steps that really
do open a page, on seven of twelve. A child taps expecting to go somewhere and
instead silently marks off a thing they have not done.

**It also hollowed out the day.** A completed day banks screen time through
`grantDayMinutes`, so the whole five could be cleared in about five seconds by a
child who had done none of it. A list that can be finished without doing anything
teaches a child the list is pretend, which costs more than any one step.

**Now the tap opens a sheet.** Ideas first, because "something kind" is a lovely
row and a useless instruction to a child standing in a kitchen trying to think of
one. The confirm underneath is the only thing that marks anything, and Not yet
closes and leaves the step exactly where it was. The chevron comes off any row
that is not a link.

Eight ideas for kindness, and the other six self tick steps get the same sheet
with their own list, because the fault was the shape of the row rather than
anything about kindness.

### Track if done: the parent could not see ANY of it

The bigger hole. The five a day has run since it shipped and **there was no
parent view of it anywhere in the app.** Everything else a child does reaches a
grown up: jobs go through approval, lesson passes land on the passport, an ask
arrives as a push. The thing they do most went nowhere.

- **Migration 181** adds `kid_days.notes`, keyed by step, so the report reads
  "made someone a drink" rather than "kind ✓". Keyed rather than a `kind_note`
  column because all seven steps share the sheet.
- **`FiveADayReport`** sits under Is it working on the pathway page, which is the
  section that already asks that question from the parent's side. Today in full,
  then the week as counts. No percentage, no target, no red for an unfinished
  day: four things done is four things done, and printing it as a failure is how
  a good habit becomes another thing to be nagged about. Read with the parent's
  own client so the existing RLS policy decides, not the service key.

### The reminder

`/api/cron/five-a-day` at **18:30**, built to `job-reminders` rules exactly: one
push per child per day however many steps are open, nothing at all when the day
is done or when the child never opened the app, only children with their own app
and a subscription, and no fallback to chasing the parent. Wording names what is
open and stops. No streak at risk, no countdown, nothing engineered to pull a
child back, because the ICO Children's Code is explicit about that and the line
has to hold in both files or it holds in neither.

18:30 is after the evening job band at 17:45 with enough evening left to read a
book or tidy a room. A reminder after the moment has gone is a telling off.

### The colours

The live step's edge, its shadow and the progress bar were all fixed terracotta,
so a child on Ocean still got a terracotta card. All three read the accent now.

**Two things the theme needed for that.** A shadow the same colour as the edge
above it is not a shadow, so `hexDark` joins the theme, typed for the twelve
named colours and computed for the hue wheel. And `onAccent`, because white on
the Graphite accent scores **2.16 to 1** while ink on it scores 7.88: one fixed
choice makes half the palette unreadable, which is exactly what the confirm
button looked like on the first build of the sheet.

The threshold is solved rather than picked, at luminance 0.209. All twelve named
accents land above it and take ink, which is what the rest of the design system
already does on a chunky button. The switch earns its place on the hue wheel,
where a mixed blue comes out genuinely dark. Worst case anywhere after the fix is
**4.09 to 1** on large bold text, which needs 3.0.

## 9 August 2026, the AI companion strand is the launch wedge

Justin said yes to a product brief and build plan for the AI companion strand,
the lead option from the new service landscape briefing. Decision recorded here:
the strand ships as a standalone wedge that pulls families into the pathway, not
a new SKU. It lives inside the existing subscription and the existing tables
(lessons, school_lessons, scripts, ai_lessons, ai_updates), so it deepens the
core offer rather than fragmenting it. Module 15 is already written in all three
versions and the AI literacy architecture is already built, so the work is mostly
wiring, not new content. Brief and phased build plan at
plans/2026-08-09-ai-companion-strand-product-brief.md. The living updates layer
(Phase D) stays fenced behind its own go-ahead and keeps the manual publish step,
because auto drafted content for children is a safety call, not a convenience.

## 9 August 2026: the quiz battle joins the quest games

Justin asked for research into the most popular educational games with a view
to building our versions. The research (plans/week-of-2026-08-09-educational-
games-plan.md, PR 774) found the engine already covers most of the popular
formats. The one big missing loop was Prodigy's: the answer IS the attack,
proven on 100 million children.

**Built as a new `battle` mechanic on the quest games engine.** The child's
Planet Friend faces a friendly trouble (the Muddle, the Tangle, the Trick
Cloud) and every right answer powers a move. Three battles ship, one per band:
Pebble and the Number Muddle (4 to 7), Bloop and the Times Tangle (8 to 10),
Orbit and the Trick Cloud (11 up, media literacy).

**The decisions that matter:**

- No losing side, ever. A wrong answer means the move fizzles, the right
  answer is shown kindly and the question rejoins the back of the queue. The
  battle always ends in a win once the set is cleared. This is section 8 of
  quest-games-plan applied to a battle: Prodigy's fun without Prodigy's
  pressure. No timer, no randomness, fixed stars, calm finish.
- The opponent is never a person or another child. It is confusion itself,
  which means beating it is understanding, not beating someone.
- Duolingo's streak pressure was explicitly researched and explicitly not
  copied. The research batch note in the registry says which mechanic came
  from which market leader, same as the 13 July batch.
- New dev fixture at /dev/quest-game?game=<key> renders any registry game
  with no database and no signed in parent, the quest games twin of
  /dev/lesson-player. Gated by the dev layout like the rest.
- No migration. Scoring rides the existing game_key branch of
  lesson-complete, server side, deduped.

Left for later sessions, in the plan: tracing for Foundation, word builder,
story sequencer, an opt in adaptive layer, and the printable outdoor Batch 1
which stays the named priority for offline play.

## 10 August 2026: Trace with Pebble, the second research build

Justin picked tracing as the next educational games build after the quiz
battle merged (PR 774). Built as a new `trace` mechanic on the quest games
engine (PR 775): the first six phonics letters in the order school teaches
them (s a t p i n), traced with a finger stroke by stroke. Duolingo ABC's
proven pattern in our butter and ink: faint letterform as the ground, a big
start dot, guide points, the letter fills in gold behind the finger, Pebble
cheers each one with its sound.

The decisions: forgiving by design (generous hit radius, lifting a finger
loses nothing, Start again is offered rather than forced), no timer, no
failing, fixed stars, calm finish. Letters are registry data with stroke
point paths, so more letters and numbers are data only, no code. No
migration, scoring on the existing game_key route.

## 10 August 2026: syllabus games are next week's plan

Justin, after Trace with Pebble merged (PR 775): he wants to start building
games that cover the syllabus a child is about to study, and wants it planned
next week. Brief captured in plans/week-of-2026-08-17-syllabus-games-brief.md
for the Monday session to pick up: curriculum mapped by year group and term,
derived from date_of_birth and the calendar, delivered as new registry data on
the existing mechanics, surfaced as a coming up at school shelf. Both quiz
battle (PR 774) and tracing (PR 775) merged today, so the engine now has
eight mechanics for the syllabus work to draw on.

## 10 August 2026: the term preview

Justin: "could we add a diary entry to give a preview note for term whats coming
up and what the child could be learning?" and, on the shape, **"three subjects
with one line each"**.

**The data had been there the whole time.** `nextTermTarget()` has worked out
the next term and year group since the homework page shipped, and
`curriculum_objectives` has been seeded all along. What was missing was anybody
seeing it: the parent had no preview anywhere, and the child only got one by
opening the homework page during a holiday. So this is a reader, not a new
source of truth, and there is no migration.

**The window is a holiday and the first week back, NOT the last fortnight of
term**, which is what I first pitched him. We hold whether a given day is a
holiday and nothing else, so a fortnight before the end of term cannot be
calculated without inventing a school calendar we do not have. The holiday is
the honest moment anyway: "what are they doing next term" is a holiday question.

**The line under each subject is its STRAND NAMES, not a summary.** Summarising
the objectives with a model would put a paraphrase of statutory curriculum text
in front of a parent as though it were the curriculum. Everywhere else this data
appears the rule is quote, never paraphrase, and a preview is not a good enough
reason to break it.

**Joined with commas and no final "and", which looks wrong and is right.** The
England strand names contain their own "and" ("Addition and subtraction",
"Vocabulary, grammar and punctuation"), so a final "and" produced "addition and
subtraction and multiplication and division" and a parent could not tell where
one topic ended and the next began. Caught on the fixture at 390px before it
went near a family.

**Where it lands:** the parent's dashboard, dismissible per term in localStorage
exactly as `SchoolAheadCard` already does; the child's own week, above the days
rather than inside one, because it does not start on a Tuesday; and DiGi, gated
on a narrow "what is coming next" question so it costs two reads only when
someone actually asks.

Nothing to tick and nothing about performance, on either card. We hold no data
on how a child is doing, and a preview is exactly where a product would be
tempted to imply some.

**The dial glides (10 Aug).** Justin: review that using it is not clunky.
Driving it like a thumb found three clunks the screenshots missed: the
thumb stepped in whole number jumps mid drag (now glides fractionally and
snaps on release), nothing acknowledged the release until Saved popped in
(a Saving cue now bridges the beat, and grabbing again still changes the
answer), and the readout growing taller shoved the whole track downward
mid interaction (height is now reserved for the longest note, so the
track never moves). The dial also owns its touches outright so the page
cannot scroll fight a horizontal drag, and keyboard arrows step whole
numbers despite the fractional glide.

## 10 August 2026: the look back card was pinned, not rotating

Justin, on the daily check in: "this keeps coming up every day I do it, can you
check the logic on this and make sure it rotates and is truly intuitive."

**It was `LIMIT 1` on `script_completions`.** Not a rotation, a pin: until a
parent completed a NEW script the card showed the same one every day forever.
Justin had been looking at "A low mood that will not lift" since he opened it.

**The copy made it worse than repetitive.** "Last time you reached for the words
for this one" is a claim about recency, said every morning about a script opened
weeks ago. A product telling somebody something untrue about their own history
is worse than one that repeats.

**Three rules now, and the card says which one applied**, because "worth another
look" and "this one did not land" are different messages and a parent can tell
instantly whether we are being useful or filling a slot.

1. A script they marked as not having worked, which is the exception to no
   repeats that Justin asked for.
2. A script matching a topic their recent check in flagged.
3. Otherwise rotate one a day through everything they have completed.

Stateless: the rotation is a function of the day number and the list, so no last
shown column, nothing written on read, and two devices agree on the same day.

**A flaw I built and then caught.** The first version of rule 1 simply returned
the failure, which quietly rebuilt the exact bug it was written to fix: one
script marked as not working would have pinned the card forever, and a parent
would have been shown their own worst moment every morning indefinitely. A
failure now holds the card for thirty days and then rejoins the rotation, and
several failures rotate between themselves.

Proven across simulated days rather than by eye, which is the only way this
class of bug is visible: the old code was correct in isolation and only wrong
over time, so nothing we had could have caught it.

## 10 August 2026 — The star chart on both phones

Justin, from Teo's printables tab: "Where is the star chart on child's app,
this is a key printable, plus parents should be able to enter the charts
results on their app end of week to give stars if not done on child's phone."
Two decisions taken with him: entry is one total per child, and the child can
print the chart from their own app.

**The sheet became one component.** The chart table and the gold star cut out
page moved out of the parent's builder into components/printables/
StarChartSheet, and both the builder and the new child page render it. The
chart now prints from two places, so it had to be one piece of markup or the
two papers drift, and a fridge with two slightly different charts is worse
than a fridge with none.

**The child's page prints their real jobs only.** /k/token/star-chart reads
the family's active jobs filtered in SQL to the whole family ones plus this
child's own, so a sibling's jobs never leave the database. No jobs prints
blank pen rows rather than our suggestion menu: printing our guesses onto a
named child's chart invents jobs the parent never agreed to. A child's print
writes the same star_chart_prints row the parent's builder does, so it also
quiets the quest board's To print badge.

**End of week entry is week aware and replaces.** The fridge log card now
names the week (this one or last, computed in London on the server) and the
route stamps it into the star_bonuses note, then replaces that child's rows
for that week rather than adding. Entering again corrects a slip instead of
doubling the stars, which was the old card's quiet failure. The card lives
under the star chart builder, where the printing already happens, and the
child gets a push when their paper week lands in the bank.

## 10 August 2026, the game pack prints one sheet per page

Justin, with a photo of the iOS print sheet showing page 4 of 7 nearly empty:
"this print pack has messy pages that don't fit."

**Measured first, at the width a printer really uses.** The whole offline pack is
13 sheets and printed as 18 pages, because 5 sheets were taller than one page. A
sheet 1.06 pages long does not print as a full page. It prints as a full page
plus a second page carrying an inch of board game, which is the near empty page
in the photo.

**Three separate things were wrong**, and the first two were invisible because
every check we had looks at a screen width:

1. The reading gutters printed. 40px of page width thrown away in the one
   direction that decides whether a sheet fits.
2. `page-break-after: always` fired after the LAST sheet too, so every print
   ended on a blank page carrying only the browser's header and footer.
3. Nothing fitted the tall sheets to the paper at all.

**The fix is measured, not hand tuned.** Before the print dialog opens, each
sheet is laid out at the real printable width and shrunk in 5% steps until it
fits. Sheets that already fit are untouched: 8 of 13 print exactly as designed.
The alternative, tightening the padding on the five that overflowed, fixes
today's pack and breaks again the next time somebody writes a sheet.

**Two things that cost the most time, both worth writing down.**

Body carries `zoom: 1.07` for readability, so a CSS px inside the app is not a px
on the page. Asking for a 718px box got one 768 wide, every sheet measured 7%
roomier than the paper, and five sheets were waved through as fitting. The code
now asks the browser what it actually gave it rather than trusting the number.

And the sheet has to be pinned to the printable width while it shrinks. Left to
itself a zoomed block reflows into its new room, and the snakes and ladders board
barely moved: its squares are a fifth of the sheet width by aspect ratio, so
widening the sheet grew the board by as much as the zoom shrank it. At 40% it had
only come down from 1430px to 1019.

`scripts/check-print-fit.mjs` prints a real PDF and counts the pages, per age
band and for the whole pack. 13 pages for 13 sheets, smallest scale 0.7.

## 10 August 2026, ticked is not the same as earned

Justin, having ticked the first of his five a day on the child app: "strange, I
did the first one of five on the child's app but when I check balance it says 0
stars?"

**The screen was telling him both things at once.** The top card read zero,
because the star bank counts only APPROVED ticks. The card twenty lines below it
read ten, because it counted every tick that was not rejected. Two sums, both
right about their own question, contradicting each other on one screen.

A child cannot resolve that, and the wrong reading is the damaging one: "10 stars
earned so far today" above a balance of zero looks like the app losing their
work, which is the one thing this page exists to prove it never does.

**Approved stays the definition of earned.** The whole product is a parent saying
yes, and stars that appear before the yes are stars nobody gave. So the fix is
not to count pending as earned, it is to name it: banked and waiting are counted
apart, and the waiting stars are told they are waiting and that nothing is lost.

Three states now where there were two. A ticked job used to be struck through
with a tick beside it, exactly like an approved one. Done is now the only thing
allowed to look done.

The sums moved to lib/quests/today-split.ts, which is the actual lesson here: the
two disagreeing numbers lived in the middle of a server component where nothing
could see either of them. scripts/check-today-split.mjs runs the shape Justin hit
and asserts the two counts can never be the same number again. The same silence
was on the home screen, where a bare "+10" sat next to "0 minutes ready to use";
it now says what the plus means.

## 10 August 2026, the pathway link to the scripts was dropping its stage

Justin: "it's taking me here from the pathway but not allowing me to either go
back, or it doesn't update if I read it. Is this because I am not paying?"

**It was not the paywall.** The road and the passport have always linked to
/dashboard/scripts?stage=<slug>, and that page only ever read `topic` and `cat`.
The stage went on the floor. A parent tapping "the words for this stage" landed
on the whole library, at the top, with nothing saying why they were there and no
way back to the road they came off.

Three things, and the first two are the same bug seen twice:

1. The stage is honoured. That stage leads, opened rather than folded, even when
   it is not the child's own.
2. A back link to the pathway, read off the link rather than the referrer,
   matching the devices page.
3. The passport task said "Read the scripts" and reading is precisely what does
   NOT move it. Progress counts a parent saying they used one or that it does not
   apply, which is the right rule and was contradicted by its own label. It says
   "Use the scripts" now, and the stage view says the same thing in a sentence.

**And the recommendation was not a recommendation.** Every signal the recommender
has is a category. A family with no concerns logged and no devices listed scores
every script zero, and the old loop then kept whichever script sorted first, for
ever. On the free plan that is the first FREE script, which is how a script about
a child coming out became the permanent recommendation for a family who had never
raised it. Worse than unhelpful: it reads as the app having decided something
about their child.

A tie now rotates, one a day, by the day number. Only the tie: a family who has
raised something four times still gets that topic every day, because variety is
not a reason to change the subject on somebody who has told us what is wrong.

Same class of bug as the daily look back card, ten days apart, and invisible for
the same reason both times: correct on any single day, wrong across days, and
nothing tested across days. scripts/check-recommend-rotation.mjs now does.

## 10 August 2026, later — The child's chart is the full builder after all

The first cut gave the child a fixed sheet of their board's jobs, on the
reasoning that our suggestion menu should not invent jobs on a named child's
chart. Justin saw it on Teo's phone and overruled it: "we create a custom
version where they add the tasks... make sure we revert back to custom
version on both parents and child's."

So both phones now run the SAME StarChartBuilder, the whole custom version:
real jobs ticked to start, the suggestion menu, the write your own box, the
week chips, then print. The component grew a kid variant (softer words, a
token authed print record route, a back link home) rather than a copy, so
the two can never drift. The child adding a job to the chart still adds it
to PAPER only, which on reflection is the point: the chart is theirs to
compose, and the parent's board stays the parent's.

The sheet preview also stopped crushing on narrow phones: it scrolls
sideways on screen and prints exactly as before, on both apps.

## 10 August 2026, the method week

Justin: "little nudges, best way to inform them use timer when child uses
device, and list why this is useful, the methodology, and reconsider the balance
of offline online, and teaching habits that jobs done equals device time. So
emails to show this one week, but little pop ups, not intrusive or annoying."

**The gap was timing, not content.** The lifecycle programme already teaches
this: `week-jobs-stars` at day 147 and `week-device-time` at day 175. Five and
six months in, months after a family has either found the habit alone or stopped
trying. Everything needed to make the loop work was explained after the point
where it was needed.

**Anchored to first use, not to signup.** Days 0 to 7 already carry five emails,
and a lecture about the timer on day one arrives before there is a screen
session to apply it to. So the four method emails hang off the day the loop
became real for that family: their first job, first timed session or first child
link, whichever came first. For one family that is day two and for another day
forty. Derived per run from rows we already hold, so no migration and nothing to
drift out of step.

They sit ABOVE the service drip in the file, which is the priority order: one
email per person per run, and a parent learning why the loop works beats a nudge
about a feature they have not switched on.

**The nudges are silent by default.** Four rules, each fired only when it is true
of this family right now, one per visit, one per day, never a modal. A parent
doing it well sees nothing, which is the whole reason the cards keep meaning
something when they do appear. Every card carries the method in a sentence,
because a parent who understands why the timer works can keep the habit with the
app shut.

**The month simulation earned its keep on the first run.** A flat one day snooze
put the same card back thirty times in thirty days, because a family with a job
waiting on a yes has that fact true every morning. That is the "always the same
card" complaint rebuilt in a third place in one day. Not now backs off: two days,
four, eight, then a fortnight, and the check asserts the GAP GROWS rather than
counting appearances, because five spread over a month and five in five days are
different things a count cannot tell apart.

## 10 August 2026, the app does not slide sideways

Justin, with a photo of the parent home on his phone: "floating around on phone
and not fitting." The screen was panned right, the cards clipped off the left
edge, a strip of background down the right.

**Nothing we had could have caught it.** Every screenshot is one page at one
width, and a page 20px too wide looks perfectly normal in a screenshot because
the extra is off frame. The symptom only exists in the hand, where a thumb finds
it. `scripts/check-mobile-overflow.mjs` now walks 72 routes at 390px and 320px
and asks the one question a screenshot cannot: is the document wider than the
window.

**The guard is on the shell, not on body, and that distinction is the whole
entry.** Putting `overflow-x` on body looks obviously right and is a disaster:
the browser PROPAGATES body's overflow to the viewport, and because `overflow-y`
was visible the pair resolved to hidden and hidden. Measured immediately after
trying it: document scrollHeight collapsed to exactly the window height on every
page. The whole app had stopped scrolling vertically. On `.gc-shell`, an
ordinary element, `clip` means what it says and `position: sticky` inside still
resolves against the viewport.

The check tests that guard by BEHAVIOUR rather than by reading the declaration
back, because a propagated overflow reports `visible` on body while working
perfectly. It drops a 900px element in the shell and asks whether the document
grew. Proven both ways: with the rule, 390 to 390; with it commented out, 390 to
908.

**Two real overflows found and fixed on the way**, both the same shape and
neither on the page Justin photographed:

- The child's ask for a job grid used `1fr 1fr`. A grid item's default min width
  is auto, so "Read to someone smaller" held the track open and the pair ran 7px
  off a 320px phone. `minmax(0, 1fr)`.
- The child's path serpentines up to 104px either side of centre, which needs
  184px of room once a 150px label sits under it. A 320px phone has about 150px,
  so the widest stones hung 32px off the edge and the child's own path was the
  thing that did not fit. The curve now scales with the phone rather than being
  redrawn.

**What this does NOT do is prove Justin's screen is fixed.** The dashboard needs
his account and his data, so his exact home could not be loaded here. The guard
makes the symptom impossible on any page, and the check makes the cause findable
next time; the specific card, if there is one, is still unnamed.

## 10 August 2026, the pathway hands over a script, and reading it counts

Justin: "the pathway OS still not taking me to the related script, and then once
read through needs to update pathway."

**The pathway now does the choosing.** The road and the passport linked at
/dashboard/scripts?stage=<slug>, which is a shelf. Even once the stage filter
worked, a parent following "read the scripts" still had to pick one, and picking
is exactly what the pathway is supposed to have done for them. They now link at
/dashboard/scripts/next?stage=<slug>, a route with no page of its own that runs
the same recommender pinned to that stage and redirects to the one script.
preferFree for an unpaid parent, because following your own pathway into a
paywall is the worst possible first impression of it.

**Reading a script through now counts, and this rule has now been changed twice
in opposite directions.** Migration 157 stopped opening from counting, for a good
reason: a parent who scrolled through ten came back to ten ticks and a passport
that disagreed with every one. Justin has asked twice for reading to count, and
he is right that the rule as built was invisible: you read a whole script, went
back, and nothing had moved, with nothing on screen having said it would not.

Migration 183 adds the state in between:

  opened      the page rendered. Still worth nothing.
  read        they reached the END of the script. Counts.
  used        they had the conversation. Counts and retires it.
  not_needed  does not apply yet. Counts and comes back round.

READ AND OPENED ARE NOT THE SAME THING, and that distinction is what lets both
migrations be right at once. Read is written by the end of the reader coming into
view, opened by arriving. Delete the difference and 157's bug is back the same
afternoon, which is why the rule now lives alone in lib/pathway/script-status.ts
with a check that asserts a browse through ten still moves nothing.

Read never demotes: a parent who marked a script used months ago and opens it to
reread keeps the used. An inference from a scroll must not overwrite something a
person deliberately said. And read does not retire a script from the recommender,
because having the words is not the same as having said them.

Two pieces of copy were made untrue by this and were corrected in the same
change: the passport task went back to "Read the scripts" (it had been changed to
"Use" precisely because reading did not count), and the stage view no longer
tells a parent that reading on its own does not move anything.

## 11 August 2026, the screen moments were missing from the screen product

Justin, on the end of day tagger: "we should have struggle to come off device,
and TV first thing morning, phones in car, at restaurant, walking in street, as
moments need to solve."

**Every tile on that screen was a routine that would exist if screens had never
been invented.** Teeth brushing, packed lunch, school bag, sibling fighting. A
parent opened the one screen in the product that asks what went wrong today and
had no way to say the handover was a fight. Five added:

  come_off       Coming off a device      the five o'clock handover
  tv_morning     TV first thing           leads the morning, because it is
  phone_car      Phones in the car
  phone_out      Phones when eating out
  phone_street   Phones while walking

**Out and about is a new part of the day**, not a category. The car, the
restaurant and the pavement are the three places a phone causes trouble and none
of them is a time of day; a family can meet all three between four and seven on
a Saturday.

**The half that makes them worth anything.** That screen promises "we will show
you the right scripts tomorrow", and it keeps that promise through one lookup:
the moment key is written straight into concerns.slug, and the recommender
scores a script category from the slug. Every moment key was unmapped, so the
promise had never been kept for any of the fifteen tiles, silently, since the
tagger shipped. All twenty are mapped now.

Phones in the street maps to STAYING SAFE rather than screen time on purpose. A
child walking into a road while looking down is not a screen time conversation.

Artwork is outstanding: the five new tiles show their emoji, which is the right
fallback and not the finished thing. They need a Higgsfield batch to match the
fifteen illustrated ones.

## 11 August 2026, the recommender starts reading what parents measure

Justin, on the same recommended card for a third day: "why are we using this
script as next one, shouldn't we have a better script that relates to dips on
check in or previous moments, can we make sure it puts the most relevant script
for the user and rotates them as we have a lot?"

**wellbeing_checks has held five scores out of five, per child, per week, since
migration 001, and the recommender had never read one of them.** It read
concerns, the devices in the house and the answer picked at signup. A parent
marking sleep at two out of five for a month was being offered scripts on the
strength of owning a tablet.

**A dip weighs between a concern and a device, on purpose.** A concern is a
family SAYING a thing is a problem, which is the strongest signal there is. A
dip is a family MEASURING one, quieter but harder to argue with. Both beat the
fact that there is a console in the hall. The band lands at 75 to 110, above
devices at 50 and never above the weakest raised concern.

Only 1 and 2 out of 5 count. Three is the middle of the scale and reading it as
a cry for help would hand every family a mood script for ever. Only the last
four weeks are consulted: a month is long enough to tell a run from a bad week,
and short enough that a family who turned things around is not still being
handed the old problem.

Open communication maps to MOOD AND CONFIDENCE rather than staying safe. A child
who has stopped talking is not yet a child in danger, and treating it as one
puts a frightening script in front of a parent who described a quiet fortnight.

## 11 August 2026, the suggestion chip stops throwing the question away

Justin: "can we make scripts suggestions actually pull up scripts that relate to
the question, and the ability to search others?"

DiGi's "Scripts for moments like this" chip went to /dashboard/scripts, the
whole library, with the question dropped at the door. A parent described a
bedtime row, was offered scripts for moments like this, and arrived at an
alphabetical list of everything we have ever written.

The chip carries the last thing they typed as ?q=, the page seeds its finder,
and the finder ranks with lib/digi/script-match instead of the substring test it
had been doing. **That matcher weights rare words over common ones**, which is
the difference between "he screams when I take the tablet" finding the tablet
scripts and finding every script containing the word "he".

Seeded, not locked. The second thing a parent does on that page is search for
something else, so the box stays a search box.

## 11 August 2026, a family job was never off their app

Justin, on a job filed under "To do with you" with the child app plainly set up
on the same screen: "why does this say not on their app as in this case there is
a child app set up as you can see? Also if the system works out there is no app
how will these tasks be added?"

**The bucket rule read a job with no child named on it as a job with no app to
send it to.** Backwards. A whole family job carries child_id null on purpose,
meaning everybody, and lib/kid/jobs-read.ts fetches a child's list with
child_id.eq.<id>,child_id.is.null, so it is already on every linked child's
screen. The board was the only part of the system that did not know, and it was
telling a parent to do by hand a job their child could already tick. The rule
now lives in lib/quests/job-pile.ts with the reasoning and eight checks beside
it.

**Then the second question, which is the one that mattered.** The pile the board
described as yours to mark had nothing to mark with: the Yes button was gated on
the waiting pile. Every "To do with you" row now carries a Done button, using
the printed sheet path the approve route has had all along.

It says DONE, not Yes, because nobody has claimed anything and the parent is the
one recording it. **No bulk version on that pile.** Saying yes to all in the
waiting pile agrees to claims a child made one by one; there is no equivalent
claim here, so a mark all done would be six jobs recorded as finished in one tap
with none of them checked, and the stars it hands out are real minutes.

## 11 August 2026, the recommender was guessing, and it guessed at a hard script

Justin, screenshot of his own Scripts page: "Recommended next: They have told
you they are gay, bi or trans." His open concerns that morning were morning
screen time, ending screen time and gaming. Three faults stacked, found by
reading the live database rather than the code.

**The Right Now keys were never mapped.** The rescue writes rightnow-<situation>
into concerns.slug and not one of those slugs was in CONCERN_TO_CATEGORY. They
are the LARGEST source of concern flags on the platform: rightnow-bedtime and
rightnow-something-else led the whole table on nine flags each, ahead of every
mapped slug. The loudest thing a parent ever does has scored zero since the
rescue shipped. The categories were not a new judgement either; the rescue route
already holds one per situation, uses it to pick the script, and throws it away
when it writes the concern.

**A fixed table was never going to be enough.** Two of the three writers do not
use a fixed vocabulary: DiGi invents the slug from the conversation and the
custom box takes what was typed. morning-screen-time, screen-time-endings,
after-school-tv are three ways of writing the same thing and all scored nothing.
There is a keyword pass now, running only when the table has no answer, reading
slug and label together, returning null rather than guessing.

**SOME SCRIPTS ARE NEVER A GUESS.** The free pool at shaper is five scripts and
three are the heaviest in the library: self harming, a low mood that will not
lift, a child coming out. Two had been used, his signals pointed at categories
holding no free script at all, so both survivors scored zero and the rotation
picked between them like a coin. Migration 185 marks the twelve that assert
something about a child and they are never recommended. (185, not the 184 the
branch first claimed: 184 was taken by the swap asks column merged the same
morning, the exact collision the sync rules exist for.)

**Never, rather than only with a signal.** The first version of the rule was the
softer one and it failed on the very account it was written for: he had an open
concern called "evening neediness", which files under mood and confidence, and
so does a child coming out. Our signals are CATEGORIES, eight shelves wide, and
every one of these scripts is a specific event. No amount of mood and confidence
is evidence a child has come out. Kept as a test so nobody retries it.

Everything that starts with the parent is untouched: browse, category filters,
search, and Right Now. The only route closed is the one where we speak first.

**Still open, and it is content rather than code.** A free family at shaper has
no free script in screen time, gaming or everyday routines, which are exactly
the categories his signals point at. The recommendation is honest now and still
not relevant, because there is nothing free to be relevant with. One free script
in each of those three at shaper would close it.

## 11 August 2026 — Jobs done goes straight home, and a child can propose a swap

Justin, from Teo's jobs page. Two decisions.

**The finished jobs page walks the child back itself.** Ticking the last job
celebrates, ticks the five a day's jobs step from right there (so the home
screen already shows the next step when it paints), and then navigates home
after a short beat. The done state stays for a child who wanders back to
look, but nobody is left parked on a finished list when the next step of
their day is waiting.

**Negotiating a job is an ask, never a self serve change.** Justin: "should
we give child ability to click negotiate job so can change it to a
different task as gives them more control?" Yes, and the shape matters: the
child proposes the trade (a quiet swap line under each unticked job opens a
sheet with ideas and a write your own box), the parent gets both halves of
it on the board they already answer, and the yes swaps like for like: the
new job is worth what the old one was, and the old one only comes off the
board when it belongs to this child alone, because one child's swap must
never delete a job from a sibling's day. Built on the existing pitch
pipeline (quest_requests) plus one column, migration 184, so the caps and
the child's status list all came for free.

## 11 August 2026 — School reminders stopped being jobs

Justin, from Teo's balance page with Cubs sitting in the job list: "surely
that does not affect balance, as just alerts not jobs."

Two code paths were quietly converting school reminders into one star jobs:
the parent's send to child button, and the weekly reminder cron, which
minted a FRESH quest for every routine every week. Both predate the child
app having a school diary of its own. Once Cubs is a quest it is a job
everywhere jobs exist: the balance page, the star chart, the five a day's
all jobs done gate, and it earns a star for being reminded of something,
which devalues the star a bed made earns.

Both paths now send a reminder and nothing else: the action is marked sent
to child, which is exactly what makes it appear in the child's own school
diary, and the push points there. Alerts live on the school rails, which
are already holiday aware and editable from the child's tap; jobs live on
the quest rails; the two no longer leak into each other. The old quest
rows already on boards are cleaned by one SQL statement in the pull
request, matched by title against sent school actions rather than deleted
by guesswork.

## 11 August 2026 — The holiday bank gets a weekly ceiling

Justin, at Teo's bank showing 485 minutes: "way too many holiday minutes."

The number was real rather than double counted: two July testing weeks each
banked four hours, because the Monday rollover converted EVERYTHING earned
above the weekly cap into holiday minutes, uncapped. Meant kindly, effort
must not be lost, but unbounded it turns the holiday pot into a way around
the entire balance system: a child who piles up one huge week walks into
August with a second allowance.

One week can now bank at most one day's screen guide for the child's age,
holiday aware, so the cap grows up with them. Still a real prize for a big
week, no longer a loophole. The five minute daily grants were already
bounded and are untouched. The test rows that prompted this are trimmed by
hand in SQL, not by a migration, because they are one account's test data.

## 11 August 2026, five free scripts, because 312 was never the number that mattered

Justin, on being told the free pool was five scripts: "but we have over 100
scripts?" He is right, there are 312. The recommender narrows twice before it
ranks anything: to the child's stage, then to free if the parent has not paid.

Free scripts per category per stage, and the zeros are the story:

```
                    foundation  builder  explorer  shaper  independent
  screen time            6         2         2       0         0
  gaming                 1         0         0       0         1
  everyday routines      9         1         0       0         1
  school and AI          2         2         0       0         0
  staying safe           2         2         1       0         1
  mood and confidence    4         5         4       3         1
```

**Read the bottom row against the rest.** Mood and confidence is the only
category with free scripts at every stage, so on the free plan it wins by
default at the older stages, and it is also where the heaviest scripts in the
library live. That is the mechanism behind the screenshot: a free family with a
teenager was funnelled into mood scripts because there was nothing else free to
give them. Migration 185 stopped the heavy three being offered unprompted.
Migration 186 gives the recommender something honest to offer instead.

Five, filling the five zeros where the commonest signals land, since devices map
to screen time and gaming and so do most concerns: builder gaming, explorer
gaming, shaper screen time, shaper gaming, independent screen time.

**The canon, at the strength it actually supports.** Odgers for preparation over
fear, Przybylski for the Goldilocks middle, which is why not one of the five
ends in a confiscation, Orben for staging them rather than writing one rule for
all ages, Knibbs for never taking the device away when a child tells you
something, Deci and Ryan for why "it is just a game" is the least useful
sentence a parent can say, and Dr Becky for a good kid having a hard time.

**No statistic is quoted that the scripts do not need.** The reasoning is in
WHY_IT_WORKS in plain words. A number ages and a mechanism does not, and a
parent at half past six needs the reason rather than the citation.

Verified by running 185 and 186 against a real Postgres 16 rather than reading
them: both apply clean, 186 is idempotent across two runs, and 185 flags 3303
while deliberately leaving "Puberty and the mood swings" alone.

## 11 August 2026 — The gentle brake on a big screen day

The economy audit found the one gap in the healthy usage envelope: a child
in watch or trusted mode could spend several days of guide in one sitting,
alerted but never slowed, because the weekly cap bounds the week and
nothing bounds the day. Justin: "yes gentle block."

Gentle means it is not a block. Past one and a half times the day's guide,
the science's own well over line, a self started timer turns into an ASK:
the parent's push says plainly that this block would take today well past
the healthy amount, and one tap runs it as a treat or says not today. The
guide is holiday aware, so summer gets its slack before the brake touches
anything. An approved ask is exempt, the parent has already looked. Fails
open on any read error, because a broken brake must never strand a child
who earned their time. The first non-negotiable holds: a pathway, never a
deny.

## 11 August 2026 — Printables that fit the phone and never strand the child

Justin, two screenshots. The Planet Friends poster scrambled on Teo's
iPhone, title chopped to "Teo's Pla", cards overlapping, no print button.
And Teo stranded on a bare image of the Summer Bucket List with no bar, no
back, no way home.

**The poster was a Safari fault, not a layout fault.** The sheet fitted
phones with CSS zoom steps in media queries; Chromium honours those and
Safari does not, so every check we ran showed a perfect sheet while the
phone in the kitchen showed a collision. The fitting is now MEASURED: a
SheetScale wrapper watches its own width and scales the sheet with a plain
transform, which every browser treats identically. Print resets it, so
paper still gets true size. The lesson for every future sheet: never fit a
fixed print layout with zoom media queries, wrap it in SheetScale.

**The poster page also gained the one button it exists for.** Print, in
place, no popup.

**The child's sheets print in place now.** The popup window fell back to
opening the raw image when the installed app blocked it, and standalone
apps have no back button of any kind. There is no window any more: the
sheet opens as an overlay on the page the child is already on, a bar with
Back and Print, the print rule hides everything else. Nothing can be
blocked and nothing can strand, because nothing leaves.

## 11 August 2026 — The private tutor, phase 1: homework in, a real lesson out

Justin: "the homework decoder, can it match whatever evidence we can research
for typical homework given for a particular part of the syllabus, then can we
develop a lesson to match that can be sent to a child... let's build this plan
to make it the best private tutor to work at every stage."

**Most of this already existed, pointed the other way.** `/api/learning/make-quest`
already turned curriculum objectives into a job on a child's phone, running child
to parent: the child flags what was hard on a practice sheet and one small task
comes back. This is the same pipeline reversed, plus the one thing genuinely
missing, a route that writes a playable lesson. Nothing in the product generated
slides before; every deck was authored by hand in a migration.

**No model runs on the child's phone, and now that is enforced.** The deck is
generated on the parent's session, read by the parent, and stored. What a child
opens is a row. Migration 064 said this in 2026 (always from the parent, never a
message from us to the child) and a comment enforces nothing, so
`scripts/check-child-has-no-model.mjs` reads all 84 files under the child side of
the product and fails on the SDK, the API host, a model id, or DIGI_MODEL. That
is what the `slides` column on `tutor_lessons` is for: it is not a cache, it is
the architecture.

**The generator is narrow on purpose.** Six slide types out of the contract's
fifteen. `stat` wants a real figure with a real source, `video` wants a URL that
exists, `scenario` is a fabricated social post, and a model asked for a maths
lesson will cheerfully produce all three. Objective ids are revalidated against
the year we sent, exactly as the decoder does.

**Two guarantees are tested rather than prompted.** A deck needs two gradeable
questions or the player's 70 percent pass is decided by one tap, and no deficit
word may reach a child: no tricky, no struggling, no behind, no catch up, right
down inside the feedback on a wrong answer, which is exactly where a well meaning
model puts it. Both live in `lib/learning/tutor-deck.ts` as pure functions so
`check-tutor-deck.mjs` can throw the bad cases at them without spending a token.

**No grades, ever.** The player sends its correct and total counts and
`/api/kid/tutor-complete` writes neither. `done_at` says they finished it. The
parent hears that it happened, not how it went.

**And the navigation went back to what the child is learning.** Both back links
read Printables and now read the learning surface, on the tab they were launched
from. A comment claiming this was already fixed has been corrected.

## 12 August 2026 — The check in data goes onto the DiGi brain

Justin: "we must make sure that the check in data goes onto digi brain. Digi
must learn what we did when the rating goes up ... like natural selection we
need to examine what works and why from data ... and add it into the thinking
process of digi."

**The audit first, because half the loop already existed and half was dead.**
The weekly child tracker reached DiGi chat as one averaged number per week
with an endpoint to endpoint trend. The Sunday check in, including the agreed
weekly plan, reached DiGi not at all. Nothing anywhere connected a rating
moving to what the family did that week. And getRatedForSituation, the cross
family verdict retrieval built with migration 147, had zero callers.

**Migration 190, checkin_shifts, is the join that was missing.** One row per
child per week: did the rating move against the previous week, per dimension,
plus everything the family did in the window (scripts and verdicts, the
agreed plan, answered follow ups, moments, lessons). Written Sundays 05:30 by
/api/cron/checkin-learning, half an hour before the wisdom rebuild so wisdom
reads fresh shifts. A rise files a digi_memory win, what they did the week
things got better. A fall under a live plan files the observation that earns
a different plan next Sunday, which is the natural selection: what worked is
kept and leaned on, what did not is varied, per family and across families.

**DiGi's thinking now carries** the agreed Sunday plan, the shifts block
(what moved the needle for this family), per dimension tracker lines with the
low dimension named instead of averaged away, an honest halves trend, and the
cross family verdicts via a keyword situation guesser (lib/digi/situation.ts,
no model call) that finally wires getRatedForSituation. The weekly plan
generator is told what last week's plan was and whether the rating then
moved, and is forbidden from handing the same plan back when it did not. The
Sunday review hands the shift back to the parent in plain words. The insight
email gains a system_changes section: what the outcome data says the platform
itself should do differently.

**The quick check in stopped poisoning the data.** It upserted on the same
week key as the full form and overwrote the notes and concern level. Merged
now, never clobbered, since the brain learns from these rows.

**Also answered, no build:** the child's path chest is unreachable dead code
since the child pathway was removed on purpose (the parent School Chest is
live and deliberately ungated); the community poll is live, days 1 to 7 of
each month, seeded to July 2027; conversations are stored and reused
(rolling 12 turns plus one extracted digi_memory fact per turn, semantic
retrieval), that half was already healthy.

## 12 August 2026 — One email a week, from all systems, and erasure that sticks

Justin, after thirty copies of one email landed in his inbox at 09:01: "we must
be careful only to send one once per week from all systems. It may be due to our
deleting cleaning up users."

He was right about the cause, by a route nobody had thought of.

**The thirty were a false alarm.** Thirty four separate starter_leads rows each
got exactly one email, and thirty two of those rows are plus alias variants of
his own two addresses. Gmail funnels every plus alias into one inbox. Of 37
leads in the table, 36 are his own test signups and one is a real person, who
got one email. No loop sent anything twice.

**What was really wrong is that deleting an account resurrects the person as a
lead.** starter_leads is keyed by address, not by user id, so it does not cascade
with auth.users. Those 34 had been correctly suppressed for a month by the rule
that a lead who already has an account never gets a start your trial email. The
overnight cleanup deleted the accounts, the suppression evaporated with them,
and the backlog went out at once. A real parent using Delete my account would
have got the same treatment the next morning: "your pathway is a couple of
minutes away", then the whole seven email drip, sent to somebody who had just
asked to be forgotten. That is the privacy policy being broken by the feature
built to keep it.

**And the one per week rule genuinely was broken.** Five addresses got two
emails 1.1 seconds apart, a nurture and a teaser. The two blocks run in the same
pass over overlapping windows and each deduped perfectly against its own ledger.
Three ledgers existed and not one could answer "when did we last write to this
person", because each only knew its own programme.

So the floor lives inside sendEmail, not in any programme, the same way the
child quiet hours gate lives inside pushToChild: the next feature that writes to
a parent gets it without knowing it exists. Migration 189 adds one row per
address carrying last_sent_at and suppressed_at. Six days rather than seven,
because the weekly digest drifts a few seconds week on week and a seven day
floor would let it suppress itself, which is exactly how the digest died last
time.

**Programme is the default kind, on purpose.** Fifteen files opt out and every
one is either ours (health alerts, refresh reports) or something a parent is
waiting for right now (the printable they just asked for, a school reminder they
set up, a receipt, the welcome thirty seconds after signing up, the past due
warning). Forgetting to mark a new send shows up as a missing email. Forgetting
the other way shows up as a parent getting thirty.

**A suppression survives an erasure, which looks wrong and is not.** Deleting
every trace of someone who asked to be forgotten is how you email them again.
Their account and their lead row are genuinely gone; one address and one
timestamp stay, for the sole purpose of never contacting them again. A fresh
magnet download lifts it, because that is them asking.

Also fixed: the nurture claimed a lead by testing the update for an error, and
an update matching zero rows is not an error in Postgres. That check meant "the
database was reachable", not "I claimed this lead". It now reads the row back.

## 12 August 2026 — The check in asks the question a parent can answer

Justin, with two screenshots of the daily check in: "when I click a line it's
good but it scrolls down and puts the next one at the top where I can't see it.
It just needs to go to the next one. Is there an easier but just as accurate way
to check in? 1 to 10 is confusing. I know we need to see previous rating and we
record movement, but this needs to be quick and easy to go through."

**The scroll bug was centring.** The hand over used `block: 'center'`, and a
concern row on a 390 wide phone is taller than the screen. Centring a thing
taller than the viewport pushes its top above the fold, and the first casualty
was the title, so a parent was handed a question without knowing what it was
about. `block: 'start'` plus a real scroll margin. It only ever looked right on
the desktop check, where the rows fit.

**Ten points became the five words the app already used.** Justin picked five
over three. The evidence is with him either way: rating scale reliability climbs
steeply to about five points and then flattens, ten buys effort rather than
accuracy, and a single item ten point self report drifts about a point on its own
with nothing having changed, so a good share of the movement the chart was
celebrating was noise. Every clinical instrument that gets repeated uses four or
five.

And the app never used the ten. `scoreWord` collapsed it into exactly five bands,
so 7 and 8 both read "Getting there" everywhere. The ten point scale was a five
point scale wearing a ten point coat, and the one place the extra grain did
anything was the direction check, which is exactly where drift became "the line
is climbing".

**The scale underneath did not change, which is what made this cheap.** Each word
posts the TOP of its band (2, 4, 6, 8, 10), so `scoreWord(score)` returns the
same word back, the column stays 1 to 10, and the progress chart, the pathway
history and DiGi's wisdom bank read exactly what they read before. "Going great"
posts a 10, which is still the 9 or above that tips a concern towards resolved,
so even that fast path survives untouched.

**The server compares bands rather than raw numbers now.** A legacy 7 followed by
today's "Getting there" is an 8, and by raw comparison that reads as progress
when the parent has just said it is the same as it was. That is the original
fault in miniature, so the comparison moved with the scale. Bands only change
when a parent picks a different word.

**Last time keeps its red ring**, on whichever word it belonged to. `bandOf()`
reads a legacy odd score as happily as a new one, so nobody's history goes blank
or lands in the wrong place on the day this ships. The rung beside each word
grows down the five, in length rather than in shade, because five tints of the
same grey is a difference nobody notices on a phone in a kitchen.

Five stacked full width targets rather than ten dots in a row: five words do not
fit across 390 without truncating the longest, and a truncated answer is a worse
answer. It is also the shape Visible and Superpower use for this exact job, many
things to rate, rated often, in one pass.

## 12 August 2026 — Two things the pathway was getting wrong

Justin: "I did ask DiGi a preset question but it did not update pathway... looks
like pathway did update but took a while after doing DiGi."

**It was never a refresh problem, which is why the refresh did not fix it.** A
router.refresh() was added on 8 August for this exact complaint and the complaint
came back. The pathway step reads one thing: whether a digi_questions row exists
today. That row was written inside Next's after(), which only starts once the
response has finished streaming, and it sat at the BACK of that block behind a
second blocking Anthropic call and an embedding call. DigiChat refreshes the
instant the stream drains, so the refresh went looking for a row that was still
two API round trips away, found nothing, and drew the step as not done. It landed
seconds later, which is what a parent sees as "it updated but took a while".

A write ordering race, not a staleness bug. So the write moved in front of the
read: the row is claimed with an empty response before the Response is returned,
and after() fills the answer in. The tick is true before the parent sees their
first word. Falls back to the old insert if the claim fails, so a bad moment
costs the instant tick rather than the record.

**And the trophy at the end of the road was lit by age.** `current >= 5` comes
from the child's birthday, so a sixteen year old whose family had done nothing
got a gold "Sixteen, ready. Social media walked into with open eyes", and a
thirteen year old whose family had finished all five stages got a greyed out one.
The page already said the opposite in its own closing line, "nothing is marked
done just because of your child's age". The trophy was the one thing on it not
listening.

It reads stageStatus now, the same blend the passport stamps from, so it needs no
new prop and a missing reading means not lit. Sixteen and not finished gets an
honest line under it rather than an unexplained grey trophy.

## 12 August 2026 — The school card is the alert calendar, and it gets a day

Justin, on the From school card: "the forward email part is parked for now, this
is just the alert calendar for school tasks. Make sure this is in rotation to top
once a week."

**Parked, not removed.** The explainer and its Send a test button come off the
card behind `SCHOOL_EMAIL_FORWARDING_LIVE`. Everything behind them still runs:
the inbound address and its signing secret, the parser, the reminder cron, and
any action that arrives by email still lands in the list exactly as before. What
is switched off is the card ADVERTISING a way in that is not being pushed yet, so
unparking is one word rather than an archaeology exercise.

**The lift is timed rather than queued.** A rotation position would surface the
card on an arbitrary week. Sunday surfaces it on the day a parent looks at the
week coming, which is when a card about Tuesday's PE kit is worth something. One
day in seven, every week, which is what makes it a habit rather than a surprise.

And any day something is actually waiting, it takes the top regardless. That
exception is the one that matters: holding a deadline the school has already sent
until Sunday would be the feature working against itself.

It MOVES rather than being drawn twice. Home had one thing said in two places
this morning and he caught it within the hour, so the position comes from a
single boolean and the card renders once either way.

## 12 August 2026 — The five a day above any printable

Justin, from Teo's home screen: "put your 5 a day above any printable
here." A printable a grown up sends used to land above everything on the
child's home screen, poster on top of the day. Order now: streak, five a
day, then the sent lesson and printable, then the reminders offer. The five a day IS
the day, so nothing a grown up sends sits on top of it; the sheet is
simply the next thing seen. One block moved in KidQuestScreen, nothing
else changed.

## 12 August 2026 — Stop asking a phone that already buzzes

Justin: "still prompting on childs phone to set up notification even
though i have set that up." The link opened from a text lands in plain
Safari, and on an iPhone Safari and the installed app share nothing, so
the same phone that already gets reminders was told to add the app to the
Home Screen and turn them on. The client cannot know better on its own,
so the server now tells it: one head count of the child's push
subscriptions rides in as hasReminders, and every prompt path yields to
it. A family with reminders anywhere sees the quiet "Reminders on" line;
only a family with truly nothing set up is ever asked.

## 12 August 2026 — The child can wake a routine up for the holidays

Justin, on Swimming kit resting behind the holidays hold in mid August:
"kid should be able to at least add its in holidays as well." Swimming is
exactly the thing that keeps going when school stops, and the person
standing at the pool knows it.

The child add sheet already asked the holidays question and the child's
own rows already carried the full edit. The gap was a grown up's routine:
tap in and all a child could do was tell them it looked wrong. Now any
weekly routine still marked school time only shows one more button on its
sheet: "It happens in the holidays too." One field, one direction. It can
wake a resting reminder up, never rename, move or stop one, so the rule
that a child never edits a grown up's reminder stands. The grown up gets
a push each time and can flip it back from their calendar.

## 12 August 2026 — The term preview goes behind a door

Justin, with the full preview filling Teo's screen above the week itself:
"This should all hide behind a button saying want to see what next term
covers? Not prominent." The week page's job is this week; the syllabus is
the thing a child occasionally wonders about, not the thing they came
for. The card now starts as one slim line, "Want to see what next term
covers?", and opens on a tap with a close in the corner. When it appears
at all stays gated as before: only around a term boundary, only with a
birthday to pin the year group.

## 12 August 2026 — The holidays button judges by sight, not by kind

Justin tapped "It happens in the holidays too" on Swimming kit and the
pill stayed. The row was a parent added NOTICE, sent to the child, so it
sat on Teo's week wearing the hold pill while the new button's server
check, which only accepted the child kinds, refused it as not his. The
check now uses the same shared isChildVisible rule as the week page
itself: if a routine is on the child's diary, its holidays truth is
theirs to state, whatever kind the parent filed it under. One offs and
unsent grown up rows stay out of reach as before. Justin's Swimming kit
row flipped by hand in the live database so it works today, not after
the deploy.

## 12 August 2026 — The calendar stops claiming everything is from school

Justin, on Swimming kit under a "From school today" banner: "it's a bit
misleading to say from school today, it should be something like see my
calendar or reminders." The diary carries school items AND the family's
own reminders, and a banner that says school over a swimming kit the
family added is telling the child a small lie every day.

Renamed by what it actually is. The home banner header is now "🗓️ To
remember today", the slim door and the way in say "My calendar", the
week page's subtitle says school things and your own reminders, and the
pushes stop claiming a sender: "On your calendar", "For tomorrow",
"Reminders for tomorrow". The red nearly time header stays exactly as it
was, urgency needs no rename.

## 12 August 2026 — The Friend sheets become proper printables

Justin, on Bloop's colour in: "We need proper printable here not image."
The Pebble, Bloop and Orbit printables pointed at photographed mockups of
the sheet lying on a table, a picture OF a printable rather than one. All
five Friend sheets now print the character's clean line art from
stage-characters, the same single source the poster draws from, and the
overlay composes the sheet properly: the Friend's name and stage printed
as crisp text above the art with a row of stars to colour, so what lands
on paper is a real colouring sheet. The card thumbnails keep the full
colour art, the shop window rule unchanged.

## 12 August 2026 — The planner cover gets the whole family, and the reading list gets a page to fill

Justin, from the planner PDF: "These planner need a cover with high
fidelity planner family images all together." The cover's lone DiGi star
is now the whole team: DiGi and all five Planet Friends in matching
portrait cards with their names, rebuilt into all three PDF editions and
the preview. Found on the way: the Pebble, Bloop and Orbit cutouts in
public/printables/friends have destroyed alpha regions (bleached holes
through their faces on any pale ground). The cover uses clean art from
other packs for Pebble and Bloop, and Orbit was repaired by inpainting
inside his silhouette. The damaged originals are still what the Planet
Friends poster renders; replacing those needs fresh art, noted for the
next art session.

And the reading bucket list prints a second page: "Books I want to
read", ten numbered dotted lines, asked for from Teo's phone. It is a
registry field (writeIn) plus one overlay block, so any future sheet can
carry a write in page by data alone.

## 12 August 2026 — The bucket list builder lands on the child app

Justin, on it living only on the parent dashboard: "but should be on
child app also." The StarChartBuilder precedent exactly: the SAME
BucketBuilder component now runs on both phones through a kid variant,
so the two can never drift. On the child's side it prefills their name,
the back link goes home, and Add to quests becomes an ask through the
child request pipeline, because a child never writes to the family quest
list directly, they ask and a grown up says yes. The way in is a card on
the print tab right under the star chart's.

## 12 August 2026 — The overlay prints every page of a craft

Justin, printing the bucket craft: "it also failed when trying to
print." The two page Bucket List Craft, the detailed one where a child
cuts out and builds an actual paper bucket, was losing its second page:
the overlay only knew one url, so the craft printed its list and dropped
the cut out bucket it exists for. The overlay now takes the extra pages
and prints each as its own sheet of paper, threaded through the print
tab and the assigned printable card alike.

## 12 August 2026 — The best three lead the printables

Justin: "order printables so star chart then bucket customisable then
planner as these are the best 3 and would like them near the top of list
when they click printables." The star chart and bucket builders were
already the cards above every grid on both apps, so the one move needed
was the School Year Planner: it now leads the registry array, which puts
it first in the child's sheet list and first in the parent's Made for
grid. Top of printables on both phones now reads star chart, bucket
builder, planner.

## 13 August 2026 — Nobody was ever asked to pay, and the reason was placement

Justin: "Nothing blocks on sign up, so nobody is ever asked to pay."

**The database agreed with him before any code was read.** Ten of the eleven
accounts on the platform read subscription_status 'free'. The one that does not
dates from 12 July.

**The two door screen DID exist**, last in onboarding, written carefully, and
it was very nearly unreachable. `onboarding_complete` is written four screens
earlier, at personalisation, and the init guard sends anybody carrying that
flag straight to the dashboard. So any reload, closed tab or locked phone
between DiGi's introduction and the final tap deleted the one screen in the
product that asks for money, permanently, for that parent. A comment on that
screen had already diagnosed exactly this in the same words and the write was
never moved.

**So the ask moved rather than the write**, which is the better answer anyway:
a parent mid wizard is getting through a wizard, not deciding anything. The
block now lands after the first check in, when they have given something and
had something back. Migration 191 adds plan_choice, plan_choice_at and
first_checkin_at, applied to zgkdfiwtnzqmtfgfsxzo.

The gate lives in the middleware beside the paywall, on the profile read that
already happens, so it costs no extra round trip and covers every dashboard
route including ones nobody has written yet. It runs AFTER hasFullAccess on
purpose: a family whose free days are gone meets the upgrade page and standard
pricing rather than a choice with one live option.

**Nothing is recorded on the way out to Stripe.** Marking the founder door
taken before payment would let anybody who opens the card form and closes it
walk past the block having paid nothing. Paying clears it, because
needsPlanChoice already answers no for an active subscription. The one
concession is a skip when Stripe returns them carrying upgraded=1, so a parent
who has just typed their card number is never thrown back onto the choice
screen while the webhook lands.

**The founder door grants the days they have left, not a flat four.** It is
taken partway through the trial, so TRIAL_DAYS would quietly hand out a longer
trial than the copy promises and nothing at all would charge a card on a day
they were told was free.

**The three DiGi messages a day were built and reaching nobody.** The limit
asked hasFullAccess, true for the whole trial, so a parent with no card had no
limit for four days and then lost everything at once: the difference between
the two doors was invisible for exactly as long as anybody was looking at it.
It asks hasPaidPlan now, with the allowlist asked separately by name. isPaid is
untouched, because it also drives preferFree in the recommendation DiGi thinks
with, and changing a rate limit is not a reason to change what DiGi says.

## 13 August 2026 — The first check in is the baseline, and a new family had nothing to check in on

The check in step was conditional on live concerns, so a new family never saw
one. That rule is right and stays. The FIRST one answers a different question:
it is where the numbers on the journey come from, and a family that never does
one has nothing to measure against for as long as they stay.

**The harder half was that there was nothing to ask about.** Onboarding asks
what is hard and writes it to onboarding_answers, and nothing has ever read it
as a concern: of the eight most recent accounts, six named a worry and had zero
concern rows. The parent told us in the first two minutes and the app behaved as
though they had not. seedBaselineConcerns records that answer, once, only on a
completely empty ledger, so it can never race a real concern raised through
DiGi or Right now.

Then the same card asks it, with only the framing changed. A separate first run
form would be a second thing to maintain asking the same question in different
words. Drawing it at /ref-baseline-checkin immediately caught a baseline row
saying "You flagged this yesterday" about something named minutes earlier.

## 13 August 2026 — The daily lead carries the pathway's best two

Your focus and Work through what comes up were the two best blocks in the
product and both lived on the page a parent opens occasionally. Both are in the
Home rotation now, through the existing picker rather than a second one:
eleven items, same day index, same walk forward, same rule that a real need
wins and suggestions take turns. The focus card lands on the script the loop
has already chosen, so Home and the loop can never send a parent to two
different places for the same words.

## 13 August 2026 — The welcome email, and the child link that outlived its deployment

The welcome and the first script email were the same email in the wrong hat,
which is why the sequence looked like it was missing one. Rewritten in Justin's
order, with jobs and chores earning the screen time leading the pieces because
it is the part nobody else has, and one button to setup rather than to a
script. It sends as programme now, so the six day floor pushes everything else
out by a week on its own; check-email-guard caught the stale opt out entry the
same minute.

The child link was built from window.location.origin, so a child was handed
whatever address the parent happened to be on. The plan said two edits. There
were five, including the WhatsApp and SMS links, which are how the link
actually travels.

**Not done today and not started:** the setup quest reshape, the what is
working dashboard, the passport tidy and the monthly shop. The Planet Friends
bonus is waiting on Justin's Duolingo screenshots, per his own instruction to
ask before designing that layout.

**Left failing and worth knowing:** scripts/check-concern-dots.mjs asserts ten
dots in a row at 390 and 320. That is the design deliberately replaced on 12
August by five stacked full width words, so the check is stale rather than the
component broken. It guards the check in card, so it wants rewriting.

## 13 August 2026 — One Stripe account for now, and the descriptor is the price of that

Justin, shown that the Customer Portal preview says The Social Billboard
because the Stripe account is shared with his other business: "lets stick
for now."

Recorded as debt rather than a mistake, because the alternative was worse
timing. STRIPE BRANDING IS ACCOUNT LEVEL. One account cannot show Guided
Childhood on one checkout and The Social Billboard on another, so every
parent paying for this product sees the other business named on the
checkout page. The clean fix is a second Stripe account, and the moment to
do it is now, before a single subscriber exists, because moving live
subscriptions between accounts later needs a card data transfer through
Stripe support and puts every billing date and card token in the balance.
That case was put and Justin chose to ship. Fair call with a 500 on the
founder button and no revenue yet.

WHAT IS NOT DEFERRABLE. The statement descriptor, in Settings, Public
details. It is what lands on a parent's bank statement, and a line reading
THE SOCIAL BILLBOARD against a Guided Childhood subscription is a
chargeback waiting to happen. Chargebacks cost the money, the fee and
eventually the account's dispute rate, which is why this half of the
problem does not get to wait for the other half.

ALSO SETTLED, and it is the sharper finding. In the Customer Portal,
"Customers can switch plans" stays OFF. The founder cap of 50 is enforced
in app/api/stripe/checkout/route.ts by counting seats held in Stripe before
letting anyone through. The portal does not run that code. Leave switching
on and a standard subscriber can move themselves onto the founder price
from their own billing page, and the cap is decoration. Invoices, customer
information, payment methods and cancellations all stay on.

## 13 August 2026 — Reversed within the hour: a separate Stripe account after all

Justin, shortly after "lets stick for now": "actually maybe be better to
set new account."

He is right and the entry above is superseded. Kept rather than deleted
because this file is append only and because the reasoning in it is the
reasoning FOR the reversal, just weighed differently once the cost of doing
it now was clear: the clicking is half an hour, and the only slow part is
Stripe's business verification, which runs in the background while
everything else gets built.

WHY NOW IS THE ONLY CHEAP MOMENT. There are zero paying subscribers. Every
day that stays true, this costs half an hour. The day after the first
parent pays, it becomes a card data transfer request through Stripe
support, with every billing date and card token in the balance, and a real
chance of churn from customers who have to re-enter a card. Nothing about
this decision gets easier by waiting, and it gets sharply worse at a
predictable moment.

WHAT IT FIXES. Stripe branding, the public business name and the statement
descriptor are all account level. On the shared account a parent sees The
Social Billboard on the checkout page and on their bank statement, which is
a chargeback risk rather than a cosmetic one. A separate account also
separates the dispute rate, the payouts and the books, so a problem in one
business cannot touch the other's ability to take money.

WHAT IT COSTS. New live keys, five new prices, a new webhook endpoint and
its signing secret, and the portal configured again. Eight environment
variables on the guided-childhood Vercel project, not guided-childhood-app.
All of it is env work that was already queued behind the 500 on the founder
button, so it lands in the same change rather than on top of it.

## 14 August 2026 — The share button was a link to the page it was already on

Justin: "the share to phone button not working in any place." Not the domain,
not the QR code. The card on the Quests page was a Link to
`/dashboard/quests?tab=share`, which is the page it was already on. QuestManager
does read `?tab=` but only in a mount effect, and Next does not remount a route
for a query change, so the effect never ran again: the card navigated to itself.
Even when the tab did switch, the share tab is two thousand lines further down
with no scroll to it. The card opens the sheet directly now, through the same
button every other surface already used, so there is no navigation left in this
path to fail.

THE SHEET, in his order. The QR leads and is bigger, drawn at 640 and displayed
responsive. WhatsApp, text and email under it, all three built with NO recipient
on purpose: wa.me with no number opens WhatsApp's own contact picker and sms:
with no number opens Messages with the words already written, so neither waits
on a stored number that could be missing or wrong. The printed chart is the
second door at equal weight, not a footnote.

The generic device share came out. It opened the operating system sheet, which
leads with AirDrop and nearby devices, and a child's private link is not
something to offer whatever device happens to be in range. A quiet line at the
foot keeps co view alive for the day a parent wants it. THAT WAS AN
INTERPRETATION of "remove share with devices" and Justin can correct it in a
word if he meant the co view toggle instead.

## 14 August 2026 — One stage reveal, on the screen with room to explain it

Justin said two opposite things in one message: the stage flash on the birthday
screen should be slower and fuller, and also that the later screen names the
stage so the flash may not be needed at all. Asked which, he chose to drop it.

The reason it was worth asking rather than guessing: a card that appeared and
animated for under a second was doing the WORST version of both jobs. Too fast
to read, so it never told a parent what the stage was, and it spent the reveal
anyway, so the screen built to say what a stage MEANS was left announcing old
news. A stage is worth one moment, and the moment it is worth is the one with
room to explain it.

## 14 August 2026 — What is working leaves the passport, and will never be one number

Its own page at /dashboard/what-is-working. Two jobs had been sharing the
passport scroll: the passport is the RECORD, what was done and earned, and this
is the ANSWER, whether any of it moved. A parent asking the second question had
to scroll past their own achievements, and the answer had no address, so nothing
could link to it except the middle of another page.

NO COMPOSITE SCORE, EVER, and the reasoning is written into
lib/working/movement.ts so nobody rebuilds it in six weeks. A single family
number would be the easiest thing here to build and worthless twice over. It is
incomparable with itself, because three concerns and nine concerns cannot share
a denominator, so an honest average FALLS the moment a parent raises a new
worry, punishing exactly the behaviour the product depends on. And it cancels
the only signal worth having: bedtime climbing 5 to 8 while gaming slides 7 to 4
averages to no change, when what happened is two stories that need telling
separately.

The sparkline is fixed to a 1 to 10 scale rather than fitted to the data,
because an auto fitted line makes a wobble between 6 and 7 look identical to a
climb from 2 to 9, and it sits next to a sentence claiming real progress.

It says "alongside the scripts", never "because of". Two things happening in
order is not one causing the other.

## 14 August 2026 — The check in guard was stale, not the card

scripts/check-concern-dots.mjs asserted ten dots in a row. That was the honest
reading of "a 1 to 10 rating" and it shipped passing, then 12 August replaced
the row of ten with five stacked words and the check failed for a day looking
exactly like a broken card. Rewritten rather than deleted: the sentence it
guards has not changed, only the instrument.

Two assertions are now inverted on purpose so it cannot drift back. Five bands
rather than ten numbers, and no check that targets fit side by side, because
they are stacked, so the width question that CAN break is whether the longest
word truncates at 320. And the comparison must be in WORDS, "up and down today,
hard going last time", never "Today 6, last check in 3", because two numbers is
the exact thing the words replaced. The number is still asserted on the posted
body, where it genuinely matters, because concern_events is what the movement
page reads.

Also found by running it: the Playwright path was hardcoded to the container's
chromium so it could not run on a Mac at all, and networkidle fires before React
hydrates on a cold compile, which reported zero rows on a page that had three.

## 14 August 2026 — Effort in one block, result in the next

The Sunday review email carried jobs, stars, minutes and days showed up. Every
one of those measures EFFORT, and a parent eight weeks in already knows they
turned up. Whether the thing they arrived worried about is any better was the
one question it never answered, using a number they had typed in themselves
every week. It is in there now, above the watch for and the suggestion, because
good news comes before homework, and read through the same helper the page uses
so the email and the app can never quote different numbers for the same week.

---

## 2026-08-14 — Schools pricing shipped: five bands, invoice payment, no checkout

The 13 August pricing decision is live on the schools site. schools/lib/pricing.ts is the one place the five bands are written (Primary to 200 at £495, Primary 200 to 500 at £795, Secondary to 1,000 at £1,495, Secondary 1,000+ at £1,995, Trust or MAT on application), with the per pupil figure rendered next to every price because £795 and £2.65 per child per year are the same number and only one sounds like money. /pricing carries the bands, what every band includes, and the request an invoice form: school name, band, pupil count, contact, email and the PURCHASE ORDER NUMBER, required because finance desks bounce invoices without one. The form inserts through the anon key into schools.invoice_requests (migration 195, insert only RLS, a letterbox); the parent app's new hourly cron /api/cron/invoice-requests emails Justin each request and stamps notified_at, because the schools app carries no email code by design. No Stripe products were created and the dead school_small and school_medium keys are deleted from lib/stripe: schools pay on invoice raised by hand with 30 day terms, revisit past about fifty schools. The homepage pricing section renders from the same module so the two pages can never disagree. The open catalogue stays free, the land grab and the reason the paid tier does not need to be cheap. One structural catch fixed on the way: with npm workspaces Turbopack was compiling the PARENT app's middleware into the schools build; the schools app now pins turbopack.root and carries its own no op proxy.ts. Owner action: run migration 195 in the SQL editor.
---

## 13 August 2026 — The passport gets its own page, and the page is tabs

Justin: "this needs to be the only thing on the passport page so they can
access everything from nice tidy tabs starting with passport, looking really
pretty using pastel colours ... as its a mess and a long scroll. We have broken
the passport as inside pages live behind the front cover."

He was right about the break and precise about the cause, and the cause was not
the cover. PassportBook opens on its cover by design, which he asked for
himself after living with the alternative. The fault was that the cover was the
ONLY door. Tabs are a second door, and the book is untouched.

**/dashboard/passport now exists.** Four tabs, one stage pastel each in stage
order, every value already in shared/tokens.css: Passport, Is it working, The
four things, Shop. Nothing above the tab bar except the child switcher, which
is not a section, it is which child all four tabs are about.

The tab is in the URL rather than in state, and that is the half worth knowing.
Each tab loads only its own queries. The scroll it replaces paid for roughly
twenty round trips on every open to show a parent one book, and the shop, the
heaviest of the four, now costs nothing at all unless somebody goes shopping.
It also means the daily list, an email and a Stripe return can each name a tab.

**The what is working dashboard came off in the same pass**, as its own tab,
because both jobs were emptying the same 656 line file and doing them one at a
time meant the second would rewrite the first. IsItWorkingReport's own child
switcher came out, since the page above it carries one across every tab.

**The shop was built once, not twice.** components/shop/Shop.tsx already sold
the printed passport and the sticker sheet and /dashboard/keepsakes was the only
thing rendering it. The data load is components/shop/ShopPanel.tsx now, the Shop
tab renders it, and /dashboard/keepsakes redirects carrying its query string.
Stripe's success and cancel URLs moved with it, so a session created before the
deploy still lands on its thank you banner.

On Home, the passport nudge repoints and gains a gate: it only applies once
first_checkin_at is set. Before that the book is a cover and five zeros, and
sending a parent to look at it teaches them the passport is not worth opening,
on the one day they were willing to try. The shop joins as a MONTHLY tier
between the two that jump the queue and the eleven that rotate, on the 12th. It
could not go in the rotation itself: a slot there comes round every twelve days,
and gating a rotation item on a date makes it show one month and skip the next
depending on where that day's walk starts.

## 13 August 2026 — The word pathway meant two things, and the route gave it up

Justin: "pathway was what I was calling today, the things to do today. So
anything I asked to be moved to pathway, I meant to rotate on the coins on
today's things."

Two different things were called the pathway. To Justin it is the daily list on
Home. In the code it was /dashboard/pathway, the stages road from four to
sixteen. The collision had already cost one wrong build.

**The stages road is /dashboard/road now.** It is what every component on it is
already called (StageRoad, RoadToSixteen) and what its own copy already says.
The old route stays for ever as a redirect that forwards its query string,
because emails already sent point at it and so do bookmarks. BackTo keeps its
`from=pathway` key pointing at the road for the same reason. lib/pathway keeps
its name: the collision is the ROUTE, which is the thing Justin types and talks
about, and renaming twenty helper modules buys no clarity.

**Your focus was the wrong build, and it is corrected.** On 12 August "focus,
words for tonight, can be their appearance on pathway, not here on home" was
built as a move to the stages road page, with a long comment in FocusStrip
arguing the case. He meant it should take its turn in the daily rotation. That
rotation item exists and is live in lib/home/next-up.ts, so the strip is
unmounted, and the comment now records what actually happened rather than
defending the wrong reading. The component is kept, not deleted: Home still
imports CHALLENGE_LABELS from it. What must not happen is putting it back as a
fixed strip at the top of Home, which was the original complaint.

**Not done, and it is a question rather than an omission.** "Lose the planets
underneath the pathway" was already served: commit 5ca93d13, merged this
morning, removed the six planet coins from Home quoting those exact words. The
rotating PlanetCard under the stages road is the other surface and is still
there. Whether that one goes too is Justin's call, not a guess worth making.

## 14 August 2026 — The moment card drew from a pool that was always empty

Justin asked how Today chooses the moment. Two faults, and the second one only
showed up because the live database was queried rather than the code read.

THE POOL WAS EMPTY, FOR EVERY FAMILY, SINCE IT WAS WRITTEN. The query filtered
on `category = 'daily-moments'` and there is no such category: the scripts in
the 1301 to 1399 band are filed under everyday-routines, screen-time, gaming,
family-rules, school-and-ai, staying-safe, mood-confidence and social-media.
Zero rows, every stage, every day. Nothing failed loudly, which is why it
survived: the pool came back empty, momentScript stayed null and the card was
skipped, so the deck ran one card short for its whole life. The sort_order band
IS the daily moments set and is what the comment always meant.

THE SELECTION WAS THE CALENDAR. Moments flagged yesterday, otherwise
`pool[dayIndex % pool.length]`. That fallback fires on every day a parent did
not log something the day before, which is most days.

Four sources now, all about the family: yesterday, then their live worries most
recently raised first, then what they ticked at signup off onboarding_answers,
then the calendar last. The eyebrow names which, because "because you flagged
this yesterday" over a card picked by the date is the product bluffing. Nothing
raised at all means the card says so and sends them to the timeline.

MATCHING IS ORDERED, NOT ANY-OF, and the live data is what proved it had to be.
"Bedtime battle" was landing on "Homework Every Night is a Battle" because the
specific word missed and the generic one decided. Keywords are tried in order
and the first that hits wins. Verb fragments are stopwords too: "Coming off a
device" was landing on "When Group Chat Drama COMEs Home".

## 14 August 2026 — One resting rule, shared by the check in and the moments

Justin: "when they say issue is doing great it also drops off from moments."

lib/concerns/resting.ts is the only copy. A worry rests when the last number was
the top band and nothing has raised it since, and the way back needs no column
of its own because raising it as a moment, through DiGi or through Right now all
write last_flagged_at. Two copies of this would drift, and the day they drifted
the check in would congratulate a family on something the deck was still
worrying about.

---

## 2026-08-14 — Schools is LIVE on schools.guidedchildhood.com

JP added the GoDaddy CNAME and the domain went green, so the launch lines flipped the same hour: the parent app's /schools, /educator and /class redirects now point at https://schools.guidedchildhood.com permanently (308s, so search engines move their index for good), and the schools site's robots flipped to index. SCHOOLS_SITE_URL stays as a preview escape hatch that production never needs. The schools product is now fully public: open catalogue, teach, print room, the Hub, five band pricing and the invoice request form, on its own domain, its own Vercel project and its own schema, where a bad parents deploy cannot touch it. From first audit to public launch: the split ran 9 to 14 August.

---

## 2026-08-14 — The first invoice request could not be read: the grant 195 forgot

The letterbox worked and the postman could not open it. /api/cron/invoice-requests returned 500 on its first run: migration 195 granted INSERT to anon so the school's form saved fine, but nothing granted the SERVICE ROLE anything on schools.invoice_requests, and the cron reads as the service role. Bypassing RLS is not the same as holding a table privilege. The eleven tables that moved into the schools schema in 177 were unaffected because a schema move carries grants with it; invoice_requests was born inside the new schema where Supabase's automatic public schema grants do not reach, so it started life with only what 195 named. Migration 196 grants the service role its four privileges on that table and, more importantly, sets default privileges in the schools schema so every future table there gets them without anyone remembering. Lesson for any new table created directly in a non public schema: name the service role grant in the same migration.

## 15 August 2026 — The check in counted scores, not children

Justin: the check in "will be showing as done when I log in at the moment
although may be done for other child as this will need to be child by child so
part of the set up list will need to have add other children."

Right on all three counts, and the live database showed the whole of it rather
than the half the code admitted to.

THE RUNG ASKED "is there a scored concern_event today" with no child filter.
That morning there were nine and every one was Teo's, so the rung read done for
the family. A one child family behaves identically, which is why it survived.
It now builds two sets, children with a live worry and children with a number
today, and ticks only when the second covers the first. concern_events carries
no child of its own, so whose a score is comes through the concern it scored.

AND THE RUNG FIX ALONE WOULD HAVE CHANGED NOTHING FOR OLGA, which is the part
only the database could tell us. She has no concerns at all; all 27 are Teo's.
seedBaselineConcerns only runs for a family with an empty ledger, correctly, so
every child after the first arrived with nothing to be asked about and was in
neither set. seedChildBaseline asks the same question per child, and the add
child route calls it. A new child starts on four common ones rather than on the
first child's signup answers, because reusing those is the app putting words in
a parent's mouth about somebody it never asked about.

SO SETUP IS FOUR STEPS, not the three the plan wrote. "Add your other children"
goes last, because it is a question about the household rather than the family.
Two doors like the share step: add one, or say it is just the one. Without the
second door a one child family sits at three of four for ever, told they are
incomplete for having the family they have, which is the un-tickable step
lib/handover/settled.ts exists to end. Migration 198, a timestamp not a boolean,
because a boolean cannot tell a no from a not asked.

## 15 August 2026 — is_primary is not unique, and nothing guaranteed it was

getSetupState asked for the primary child with .eq('is_primary', true) and
.maybeSingle(), which is what every caller in the product does. On the live
account FOUR of five children carry the flag: Teo plus three test children all
called Toon. PostgREST treats more than one row as a failure for single, so it
returns an error and no row, and the new share step would have rendered "Add
your child first" to a parent with five children on the account.

There is no unique constraint and every path that adds a child can set the flag,
so the read takes the list and picks the first, ordered primary then oldest,
which is stable between loads rather than whatever the planner returns. The
duplicate rows themselves are test data and are left alone.
---

## 2026-08-15 — Two bugs and a reversal: the schools content was invisible, and now it is behind a code

**The bug.** Every content page on the schools site was empty from the moment it
launched. Migration 177 moved school_lessons out of public and into the schools
schema at the cutover, and schools/lib/supabase/anon.ts was never told, so twelve
pages were querying a table that was not there any more: /curriculum showed zero
modules, /print was empty, /teach and /class returned 404, and four Hub pages
rendered without their vocabulary, DSL notes and family questions. The invoice
form kept working throughout, which is what disguised it, because pricing/actions.ts
is the single caller that spells out .schema('schools') by hand. Nothing failed
loudly: PostgREST answers a missing relation with an error, and the pages were
discarding the error and rendering the empty state.

The fix is one line, db: { schema: 'schools' } on the client, which corrects all
twelve call sites at once; an explicit .schema() on a query still wins, so the
invoice insert is untouched. Wiring check 8 now fails the build if that default
ever comes off, and names every page relying on it. **The lesson is the one from
196 repeated: a schema move is invisible to application code, so the client and
the migration have to move in the same commit.**

**The reversal.** Justin, 15 August: "make sure when all lessons are available
they are behind a log in as dont want people seeing it for free." So the Oak style
open catalogue we launched with on 14 August is over, one day old. The line he
chose is the strict one: only the home page and /pricing answer to the world.
/curriculum, /hub/*, /teach/*, /class/* and /print/* now need a school access
code. This costs us the SEO on the Hub, which was the strongest reason a head
teacher landed on the site, and that trade was made with the tradeoff named.

**Why a code and not a login.** A code is a door, not an identity. It needs no
email, no name and no row in any table, so the schools app still holds no session
and no personal data of any kind, and the product boundary (wiring check 7) is
untouched. It ships in hours rather than days, which matters with the site already
live and broken. Real teacher accounts are the next thing built, in the staffroom,
where they buy what a door cannot: a register, marking and a report. When they
land this gate stays as the outer door and nothing here is unpicked.

Codes are config, never hardcoded: SCHOOLS_ACCESS_CODES (comma separated, one per
school or one per pilot cohort) and SCHOOLS_ACCESS_SECRET. Verification re-checks
the code against the current list on every request, so removing a code locks that
school out immediately rather than whenever its cookie happens to lapse. The gate
fails CLOSED: an unconfigured deploy locks the content instead of leaking it.

## 14 August 2026 — Sign up asks the question the front page already answered

Justin: "At the end of sign up, the parent chooses one of exactly two paths."

The homepage sold three things after PR 849 and 851, and the app kept none of
them. The two doors sat at /dashboard/choose behind first_checkin_at, so the
offer landed days after the page that made it. The trial handed over all 246
scripts and unlimited DiGi rather than the sample being advertised. And a
founder with a card on file got no warning before the first charge.

**The choice moved to the end of setup, and stayed a route.** needsPlanChoice
reads onboarding_complete now instead of first_checkin_at. What is deliberately
NOT undone is the fix from 13 August: the doors are still their own route with
the middleware in front, never a screen inside the wizard. That is the part
that stopped the offer being deleted by a reload, and moving the condition
changes when it is owed without touching why it survives.

**One rule decides the trial limits: is trial_ends_at still in the future.** So
the founder is capped exactly like the no card path, which is the point, the
four days are the same offer on both. The webhook writes trial_ends_at = now()
when Stripe moves the subscription out of trialing, so the limits lift on the
same event that takes the first payment rather than on a second clock that
could disagree. It also means somebody who buys outright is never handed a
sample of what they just paid for.

**The limits are data now.** platform_config holds trial_days and
trial_digi_daily_limit, service role only, with the old constants kept in the
app as fallbacks so an unreachable table can never take the trial down.
scripts.starter_set is the sample, seeded from is_free plus the first six per
stage: is_free alone left Explorer, Shaper and Independent on one script each,
which is the same under reporting migration 148 was written about.

**Three things were already broken and are fixed on the way past.** Onboarding
wrote trial_ends_at from the browser, which migration 175 revoked in August, so
that whole update had been failing and taking the stored answers with it, and a
parent who skipped the starter pack got no trial at all. /api/plan/free wrote
plan_choice with the parent's own client and plan_choice was never in the 175
grant list, so the no card door answered "That did not save" every time. And the
upgrade page counted founder places from profiles while checkout counted them
from Stripe, so the counter and the button could disagree.

**The day 3 email is transactional, not programme.** DMCCA 2024 expects a pre
charge reminder, so it runs in its own pass before the main loop: past the
opt out, past the one a week floor, and first in the queue for the one email per
person per run. Path one only, because path two is charged nothing.

Not done, and it is Justin's call: nothing opens a draft PR from here, the gh
CLI is not installed in this environment.

## 15 August 2026 — The tabbed passport is reversed, back to the page that was designed

Justin, seeing the four tab passport live: "the passport page is completely
wrong, please return to previous passport page we designed and we can start
again."

So the split is undone. /dashboard/pathway is again the one page: passport in
the header beside the words, the six doors, the road, the four strands, is it
working, the journey. Restored byte for byte from the commit before PR 847
merged, with three deliberate exceptions:

1. The weekly planet under the road stays gone. Justin approved that removal
   separately ("no need for the planets the stage road") and it is not part of
   what he is unhappy with.
2. The page now reads ?from=today and renders the back link, because the Today
   loop's passport rung gained from=today on main while the split was live, and
   restoring the old page verbatim would have made that feature silently dead.
3. What is working stays a page of its own with its doorway card here. That
   was a different session's work, shipped on its own argument, and it is not
   being reversed by this.

/dashboard/road and /dashboard/passport survive as redirects only: emails went
out during the two days the split was live, and a Stripe checkout created from
the shop tab returns to a passport URL. The old shop tab forwards to
/dashboard/keepsakes, which is a real page again.

THE LESSON, for the redesign and for every session reading this file: the tabs
were built from a written brief and approved in prose, and the first time
Justin SAW them he rejected them. The redesign starts from the restored page
and gets screenshots at every step before anything is declared done.

## 18 August 2026 — The multi child lanes: the passport session accepts the handover

Two sessions are live. The multi child session (mobbin-ux-references branch)
published plans/multi-child-build-plan.md with lanes drawn and its step 6
written as a handover to the passport session. This entry is the passport
session accepting, and settling the two files where the lanes could cross.
Justin asked for exactly this cross check before giving the passport build the
go: "so both builds work together and dont cross for multi child."

THE LANES, CONFIRMED BOTH SIDES:
- Multi child session: shared plumbing (?child= threaded through nav and
  layout, switcher mounted on the deep pages), the child app, DiGi, and ALL
  schema. Migrations 206, 207 and the agreements one after are theirs.
- Passport session: /dashboard/pathway, /dashboard/passport, PassportBook,
  IsItWorkingReport, LiteracyAreas, StageRoad, and every item on their step 6
  list: per child reads for lessons, scripts, devices and contentComplete;
  concerns filtered by child_id; stars summed per child not per family; the
  stamp celebration localStorage keys gaining a child id so the first child's
  stamp cannot burn the second's; the weekly check in reading and writing the
  SELECTED child.
- THE PASSPORT LANE NEEDS NO MIGRATION. Verified today: wellbeing_checks
  (001), stage_quiz_passes (098), concerns (194) and lesson_pass_by (162) all
  carry child_id already. Every passport fix is a read or a key. If that ever
  changes, the passport lane claims 209 by editing THIS entry first.

THE TWO CROSSING POINTS, SETTLED:
1. lib/pathway/progress.ts BELONGS TO THE PASSPORT LANE. It is the sharpest
   shared file: their step 2.2 moves lesson reads onto lesson_pass_by for the
   lessons pages and the child app, and the passport's numbers flow through
   progress.ts. One owner or we rewrite each other. So: they change lesson
   reads at their own call sites and DO NOT touch progress.ts; the passport
   session adopts the same lesson_pass_by pattern inside progress.ts itself.
2. components/children/ChildSwitcher.tsx CHANGES BY ADDITIVE PROP ONLY. They
   are mounting it on seven more pages; the passport design adds an avatar and
   a per child balance dot to the pills. The passport session adds these as
   OPTIONAL props, default off, so every existing and new call site renders
   exactly as today unless it opts in. Neither session changes its defaults.

SEQUENCING: their step 1 (?child= threading) is the one piece the passport
build genuinely wants underneath it, so selection survives a tap into a lesson
and back. The passport build starts anyway (its own page already reads
?child=) and simply rebases when step 1 merges. Small PRs, same day merges,
per the standing rule.

## 18 August 2026 — The two sessions agreed it between themselves

Justin asked the two live sessions to agree multi child directly rather than
route through him. Done, by message, both directions. What was agreed, beyond
the lanes entry above:

- Their step 1 (the switcher lifted into the dashboard layout) lands BEFORE
  the passport rebuild. The passport renders NO switcher of its own, deletes
  the inner one in IsItWorkingReport when rebuilding, and does not touch
  ChildSwitcher.tsx at all, which supersedes the additive prop idea above.
  The per child balance dot moves from the pills into the passport's own
  lane: a sibling glance line on the page when another child's balance needs
  a look.
- Migrations: passport lane confirmed none; 208 stays free for their
  agreements step. Any future passport claim goes through this file first.
- LiteracyCheckIn becomes a rotation item in THEIR lane. The fact that forced
  the decision: getLiteracyStatuses reads literacy_checkins on a 28 day
  window, so the four strands go stale within a month of the form rendering
  nowhere. Handed to them with that clock attached.
- progress.ts stays passport lane; they change lesson reads at their own call
  sites only; both lanes converge on the lesson_pass_by read pattern.
- Rebased on main same hour: their removals (Your focus, School chest,
  BalanceReport, LiteracyCheckIn) and anchors are in this branch, and the
  passport mock already assumed a page stripped to the application, so the
  removals CONFIRM the approved design rather than fight it.

## 18 August 2026 — Per child is the rule, and the migration ledger moved

Justin, asked which work earns which child's stamp: "the other session is
making everything child related... the passport has to be per child,
individual task, quests lessons digi moments etc all child related." And via
the plumbing session, sharper: "we are working on making all aspects such as
scripts, moments, lessons child related not family, so the passport should
follow." Their contract file now states the rule: if a child does it, learns
it, or is talked to about it, it is per child; family level is the account
only.

WHAT THE PASSPORT LANE SHIPPED ON IT TODAY:
- Lessons per child in progress.ts through lesson_pass_by, with 162's doctrine
  kept: the child's own pass counts for them, the parent's pass counts for
  every child, and legacy completions that predate 162 are grandfathered so
  nobody's passport empties. A sibling's pass no longer fills another child's
  page.
- THE STAMP IS PER CHILD, and the check is what makes it theirs: earned now
  means the stage's content is complete AND THIS child passed their five
  question check. The approved mock in as many words: fill the page, pass the
  check, earn the stamp. The end of road celebration gates the same way.
- Concerns scoped to the selected child on every passport surface (own worries
  plus family wide null child_id rows, never a sibling's).
- The stamp celebration memory is per child, so the first child's stamp cannot
  burn the second child's moment.
- Stars this week on the report count the named child's ticks, not the
  family's, and the sentence names the child.

MIGRATION LEDGER, corrected by the plumbing session: 206 quest_ticks child
key, 207 school_actions child_id, 208 daily_sessions AND script_completions
child_id, 209 agreements. Free from 210. The passport lane still claims none;
when 208 merges, progress.ts scopes scripts per child too (tracked as a task).

## 18 August 2026 — The review standard, the eyes, and the customer aged 2 to 16

Justin watched the AI employee setup walkthrough and asked for the three
missing pieces to be set up: "Set the three up and let me know how I implement
you must already know the perfect user is a parent with a 2 to 16 year old
child."

THREE THINGS DECIDED AND BUILT:

1. review.md now lives at the repo root. It is the single quality standard
   every change is checked against before it ships: philosophy, customer,
   scope, product, design, risk, sorted must fix / should fix / okay to ship.
   CLAUDE.md points every session at it. If the bar changes, change review.md,
   not the routines that read it.

2. Two new routines exist alongside the daily health sweep. A weekly UX
   walkthrough (Wednesday mornings) that opens the product with Playwright and
   walks it as the perfect customer, reporting the three highest friction
   moments, report only, no code. And a weekday PR review (each morning) that
   reviews every open pull request against review.md and comments must fix /
   should fix / okay to ship.

3. THE PERFECT CUSTOMER IS A UK PARENT WITH A CHILD AGED 2 TO 16, stated
   plainly by Justin on 18 August. THE-STORY.md section 2 previously said
   primary age, roughly 4 to 11; that stays the heart of the market, but the
   product serves the full 2 to 16 run up to the phone. Features must degrade
   gracefully across the range.

## 19 August 2026 — Daily health sweep: three crons that have never actually run

Routine sweep. Schema check clean, all eleven watched columns present. Security
and performance advisors unchanged in shape from the 9 August sweep, no ERROR
level findings, same RLS-no-policy and search-path warnings on ops-only tables,
same multiple-permissive-policy and auth-rls-initplan performance notes across
the RLS policies. Pre-existing, not touched again today.

One real fault, not a code bug. Three jobs in vercel.json have no genuine
heartbeat row in cron_runs, ever, under the path Vercel is supposed to call:

- `/api/cron/legal-watch`, due quarterly on the 3rd (Jan, Apr, Jul, Oct). Its
  Jul 3 slot passed 47 days ago. Zero rows.
- `/api/cron/passport-check`, due monthly on the 1st. Both Jul 1 and Aug 1
  passed. Zero rows.
- `/api/cron/answer-review`, due monthly on the 2nd. One row exists total, for
  2 August, but filed under the old key `answer-review` with no leading slash,
  not the `/api/cron/answer-review` the route writes today. Zero rows under
  the real key, ever.

Why this points at Vercel and not the app: `withHeartbeat` writes a row the
moment a request arrives, before checking the cron secret, so even a rejected
call leaves a row marked unauthorised. These three have none at all, in any
shape, which means the request never reached the app. Compare
`/api/cron/invoice-requests`, which did fail twice on 14 August (schema cache
and a permission error, both from the schools.invoice_requests move) and both
failures are sitting in cron_runs with the real error message, because the
request arrived and the job ran and failed. That is the difference between a
job that runs and errors, which this monitoring is built to catch, and a job
that never gets called at all, which it cannot catch from inside the app.

What this costs a family: no quarterly check for law that has moved under the
product (GDPR, the Children's Code, the Online Safety Act, age assurance,
the MHRA line) since at least July. No monthly nudge to a child's app for
what is left to finish their passport, for at least two months running. No
monthly self-critique of how DiGi is answering.

This was flagged once before, on 31 July, as needing a manual trigger because
this working environment carries no CRON_SECRET. That explains why it cannot
be fired from here again today. It does not explain why Vercel's own scheduler
has not called any of the three even once since the routes went live on 12
August, nor why legal-watch's Jul 3 slot (which predates that date) has no
attempt logged either. Not fixed here, because the fix is not in this repo:
Justin needs to open the Vercel dashboard's Cron Jobs tab and check whether
these three are actually listed and enabled, or count against a plan limit
that the other 31 crons in the same file do not. If they are missing from the
list, re-adding them or redeploying should be enough; if they are listed and
still silent, that is a Vercel-side question, not a code one.

---

## 20 August 2026, schools foundation deep dive synced to the build spec (not left as a stray plan)

The foundation build brief (plans/2026-08-20-schools-foundation-build-brief.md)
was written first as a standalone plan, and it drifted from the schools
session's source of truth. Two errors, now fixed: it hosted the primary school
lessons on the parent app Planet Friends (Pebble, Bloop, Orbit) instead of the
schools cast, and it invented a parallel ks1-01 module set instead of using the
map the schools scheme already owns.

Decision: the schools scheme has one source of truth,
plans/schools-lesson-build-spec.md, and the deep dive now writes into it rather
than beside it. Two insertions carry the sync: a CASEL bullet in Section 3 (the
guidance map), and a Notice, Choose, Tell plus CASEL plus 20 minute drop in
overlay note at the head of Section 5 (the 21 module map). The deep dive's part
4 is now an overlay onto Section 5 modules 1 to 9, tagging each with its
scaffold word, its primary CASEL competency and the Section 9.4 cast host
(Sofia, DiGi Junior, Oliver, Zara), authoring nothing new.

Left for the schools session, named in the brief: reconcile the sm13 ids
(school_lessons, migrations 109 to 112 and 220) with the Section 5 one to 21
numbering before authoring primary rows, add the nullable casel_competency
column, and decide whether CASEL surfaces as a curriculum page filter or as
data only. This session did not touch schools app code or add a migration, to
stay out of that lane.

---

## 20 August 2026, correction: schools uses the Planet Friends, not the retired squad

Justin's steer, same day: the schools materials use the Planet Friends (Pebble,
Bloop, Orbit, Nova, Cosmo) with DiGi, the same cast as the parents app, for
continuity across both products. Sofia, Oliver and Zara are retired. This was
already the state of the code (lib/content/stage-characters.ts says the Planet
Friends "replace the old squad Oliver, Zara, Sofia; DiGi is kept"); the schools
build spec had simply not caught up.

An earlier note this same day wrongly swapped the deep dive to the Sofia,
Oliver, Zara cast. Reversed. The deep dive (plans/2026-08-20-schools-foundation-
build-brief.md) now hosts the primary modules on Pebble, Bloop and Orbit with
DiGi and DiGi Junior, and the Section 5 overlay note in the build spec says the
same.

Lane: schools has its own PR and session. The full cast update inside the build
spec (Section 9.4 and the per module casts in Section 5, which still name the
retired squad and the animal guides) and all schools app code and lesson rows
are that PR's to make. This PR only fixed the deep dive it owns and flagged the
stale cast in the spec.

---

## 20 August 2026, follow up: the full spec cast swap is done (not left to the schools PR)

Justin said take the cleanup, so the whole schools build spec was swept, not
just the deep dive. Every per module cast in Section 5, the Section 9.4 table,
the fully scripted reference lesson in Section 10, the 1.9 principle and the
production notes now name the Planet Friends (Pebble, Bloop, Orbit, Nova,
Cosmo) with DiGi and DiGi Junior. Supersedes the earlier note today that left
that swap to the separate schools PR. Still owned by the schools session: the
schools app code, the lesson rows, and rendering each Friend's classroom video
beats from the parents app art.

---

## 20 August 2026: per child means the signals too, not just the stage

Justin checked the Teo and Olga pills against scripts and moments: the pages
switched stage but every child got the same starting point, and the reader
named the primary child whoever was open. The decision, from his "it should
relate to each child's issues, moments all child specific":

1. ?child= travels with every script link. It was already the single source
   of truth for writes (ticks, status, worked), but every link out of the
   scripts index dropped it, so reading with Olga marked Teo's day. The
   primary child keeps the clean URL, matching the switcher.
2. getRecommendedScript and the deck's watch for card read the named child's
   own concerns, check ins and completions. A row with no child on it is a
   household fact and counts for every child. Devices and the signup answer
   stay family wide because they are.
3. Daily cards say the child's name where the copy said your child.
4. Rule for multi row reads on tables with the per child key (219): never
   single or maybeSingle by user and sort order alone; read the rows and pick
   this child's, then the legacy null child row. Three reads had this fault
   and each failed soft to a wrong answer.

Lane: this PR owns the scripts surfaces and the daily deck reads. DiGi's own
child naming (tools, prompts per child scan) landed separately in PR 898.

## 22 August 2026 — Daily health sweep: digest reported failed 1 every day for a week, silently

Routine sweep. Schema clean, all eleven watched columns present. Advisors
unchanged in shape from prior sweeps: same RLS-no-policy and search-path
warnings on ops-only tables, same multiple-permissive-policy and
auth-rls-initplan performance notes across the RLS policies, nothing new.

legal-watch, passport-check and answer-review are still silent under their
real cron_runs key, same as the 19 and 21 August sweeps found. Already open
as PR 900, so left alone rather than duplicated. Still waiting on Justin to
check the Vercel dashboard's Cron Jobs tab, because nothing in this repo
explains a job that never gets called at all.

One new fault, small enough to fix here. `/api/email/digest` has replied
`ok:true` every day since 17 August while its body said `due:1, sent:0,
failed:1`, the same one family, every single day, six days running. No top
level `error` key, so the heartbeat's own body check read it as healthy.

Root cause: the shared one email a week floor (Justin, 12 August: "we must be
careful only to send one once per week from all systems") correctly stopped
the digest going out because that address had already had a different
lifecycle email inside six days. That is the floor working as designed. The
bug is downstream: `deliverOnce` in lib/email/cron-kit.ts treated a throttled
send exactly the same as a genuinely failed one, both landing in the `failed`
bucket with no way to tell them apart from the outside. A real failure and an
intentional wait looked identical on the board.

Fixed: `deliverOnce` now reads `sent.skipped` and returns `'skipped'` for a
throttled or suppressed send, `'failed'` only for a real one. Nothing about
who gets emailed or when changes, this only fixes what gets counted as what.
Same function serves both `/api/email/digest` and `/api/email/monthly`, so
the monthly review gets the same correction. No migration, no schema change.

What this cost a family: nothing counted yet, since the eligible address this
week is the founder's own test account, not a paying family. The real risk is
ahead of us: any family who gets a lifecycle nudge inside six days of their
digest would have hit the same wall and shown up as a plain, invisible
"failed", never flagged, never retried into a report anyone reads. Worth
watching once real families are on lifecycle mail and the digest at the same
time.
---

## 21 August 2026 — Daily health sweep: the three silent crons are still silent

Routine sweep. Supabase and GitHub both reachable, checked first.

Schema clean, all eleven watched columns present. No open pull requests to
collide with, nothing to claim.

The three jobs flagged on 19 August have not moved. Confirmed again today,
same method (cron_job_status against the path in vercel.json, not a capped
read):

- `/api/cron/legal-watch`, quarterly on the 3rd. Zero rows ever, in any name.
  Jul 3 slot now 49 days gone.
- `/api/cron/passport-check`, monthly on the 1st. Zero rows ever. Jul 1 and
  Aug 1 both gone.
- `/api/cron/answer-review`, monthly on the 2nd. Still exactly one row total,
  filed 2 August under the old key `answer-review` with no leading slash. The
  route today writes `/api/cron/answer-review`, so that key has zero rows,
  still. Next slot is 2 September; that is the first date this can move on
  its own, so nothing to chase again before then.

Not touched here, same reasoning as 19 August: `withHeartbeat` writes a row
the instant a request lands, before the secret is even checked, so a call
that reached the app leaves a trace no matter what it did with it. Zero trace
across three jobs means Vercel's scheduler is not calling them, which is a
Vercel Cron Jobs tab question, not a line of code in this repo. Still needs
Justin to open it and check whether these three are listed and enabled.

Cost, unchanged and now two months and a bit running: no quarterly legal
check since before this file existed, no monthly passport nudge to any
child's app, no monthly self critique of DiGi's answers.

`/api/cron/invoice-requests` shows 2 failures in the last 7 days on the
cron_job_status count, but both are the 14 August schema cache and permission
errors from the schools.invoice_requests move, already understood and already
past; every run since, including today's, is clean. Not a new fault.

Advisors: security unchanged in shape from prior sweeps, all INFO or WARN,
nothing at ERROR, same RLS-no-policy and search-path notes on ops-only
tables. Performance advisor came back large enough to need a subagent pass;
of 622 findings, 505 are the known multiple-permissive-policies and
auth-rls-initplan pair, and the rest are unindexed foreign keys (82), unused
indexes (34) and one table with no primary key (`schools._backup_lesson_199`,
a backup table, unsurprising). All INFO level, none urgent, worth a look
sometime but not a break for a family today.

Nothing fixed here: schema is fine, no new code fault turned up, and the one
real gap is outside this repo. No pull request opened.

## 26 August 2026, the star system evidence pack and the rewards critique

Researched and adversarially verified the rewards evidence for the star quest
(workflow: codebase map plus three research lenses, every load bearing claim
checked). Banked in content/packs/2026-08-26-star-system-evidence/. The facts
that drive decisions: Dr Becky is AGAINST reward charts (founding premise of
Good Inside), so no content may claim her endorsement, the honest move is to
name the disagreement. The critics' real evidence (Tang 2018, Nagata ABCD 2024
and 2026) measures screens deployed as behaviour control, not capped earn
systems, and our weekly age guide cap means stars cannot raise usage past the
guide, which is the spine of the defence. Code sweep confirmed two gaps before
the three tier concept can be claimed publicly: no protected windows exist (a
child with stars can start a timer at any hour) and no unconditional core time
exists (all recreation is earned, per pillar 4). The core time change against
pillar 4 and the protected windows build are AWAITING JUSTIN'S DECISION, the
pack documents them as not yet built. Compliance and emotion reward hooks to
clean when that build happens: Screen off first ask, great attitude bonus chip,
fair play star depending on the parent's answer.

## 26 August 2026, Justin approved the three tier star time concept

Justin: "Yes" to core time and protected windows. Pillar 4 evolves from earned
not granted to: a small guaranteed baseline (core time, parent set, default
off), extra time earned, and protected windows no stars can buy (bedtime,
optional mealtimes and school hours), enforced as ask conversions never flat
blocks, with the parent as the override. Reward hooks paying mood or
compliance get cleaned in the same build. Plan:
plans/week-of-2026-08-26-star-tiers-plan.md. Migration 223 claimed by that
plan and PR 906. THE-STORY pillar 4 text changes only when the build ships.

## 26 August 2026, the Dr Becky layer approved for the star tiers build

Justin: "Yes" to building Dr Becky's philosophy into the jobs and control
aspects. Seven moves folded into the tiers plan: sturdy leadership two part
copy for every no, screens never a punishment promoted to a stated rule and a
DiGi rail, repair over debt register, family jobs split from star quests
(contribution is belonging, not payment, is_family_job flag), optional job
steps with stars on the finished job only, the mood and compliance hook clean
named as her rule, and most generous interpretation wiring for timer friction
in DiGi. The series still says honestly that she would not build the stars.

## 26 August 2026, migrations 220 to 223 reconciled against the live database

The live database had recorded nothing after 219. Applied today: 221 (parent
lessons scaffold, all ten Stage 1 lessons tagged), 222 (DiGi Louder Than The
Evidence corpus, seven rows, embedded by the self healing sweep), and the new
223_star_time_tiers (child_time_settings table per the approved star tiers
plan: core minutes default 0, bedtime defaults seeded by age band, protection
flags default off, RLS own rows only, schema only so no behaviour changes
until the phase 1 build reads it). NOT applied: 220 (school lessons scaffold).
It targets public.school_lessons with sm13 module ids, but the live table is
schools.school_lessons and carries the 21 module whole school curriculum
(eyfs to ks5) with no sm13 rows. 220 as written would tag zero rows. Mapping
Notice, Choose, Tell onto the 21 live modules is a content decision, not a
find and replace, so it waits for Justin.

## 26 August 2026, migration 220 rewritten for the live curriculum and applied

Justin: "yes do the mapping for 220". The scaffold tagging is rewritten in
place against schools.school_lessons and the 21 module whole school
curriculum (safe because the original was never applied anywhere), then
applied to the live database. The mapping follows the same logic as the sm13
version and 221: NOTICE nine modules (real and not real, algorithms,
ownership, misinfo, scams, image pressure, persuasion, radicalisation),
CHOOSE eight (calm bodies, routines, gaming spend, privacy settings, mood,
readiness at 16, ai mastery, digital identity), TELL four (kind and safe with
others, group chats and workarounds, consent and the law, sextortion). All
21 rows tagged, verified, no lesson content touched.

## 26 August 2026, phase 2 of the star tiers built (the Dr Becky layer)

On Justin's "continue phase 2": family jobs split (is_family_job quests earn
no stars in the bank, warm belonging framing on the child card and pushes,
parent toggle per job on the manage page), job steps (migration 224,
family_quests.steps text[], parent writes up to five lines, child gets little
scaffold ticks with stars only on the whole job), and the three mood and
compliance hooks cleaned (Screen off first ask renamed to the controllable
act, the great attitude chip replaced with persistence, the fair play star now
pays only children whose own week ran through the timer, never the parent's
answer alone). Migration 224 claimed by PR 908 and NOT yet applied to the
live database, apply it with the merge.

## 27 August 2026, phase 3 of the star tiers built (the fade)

On Justin's "continue phase 3": the per child star rate (migration 225,
child_time_settings.star_minutes default 5, wired through the three timer
routes, the manual spend, the bank, the settings card and both card UIs, so
every price everywhere uses the child's own rate), the fade ladder (a weekly
budget strip on the child card from 11 up, the week as a number that is theirs
to spread, and at 16 plus a trusted child's over guide start runs as their own
call, tagged and reported to the parent for the weekly review instead of
converting to an ask), and DiGi's most generous interpretation (a new device
check in fires when three or more screen time asks were declined in two weeks,
turning the parent toward what is underneath rather than a tighter lock).
THE-STORY pillar 4 rewritten to the three kinds of time now the build has
shipped. Migrations 224 AND 225 still need applying to the live database.

## 27 August 2026 — the first WhatsApp moment (research + plan, PR 910)
Justin asked how to handle an 11 year old's first WhatsApp frenzy and to build
the moment into the platform. Full kids-research pipeline ran: six lenses,
contradiction map, briefing, then three verification agents over all 29 sources
(19 rows confirmed, 8 corrected, one stat demoted). The demoted stat is the
widely repeated "29 percent of cyberbullying is exclusion", untraceable to any
primary source; it is now banned from our copy. The biggest correction: the
trajectory study (Xiao 2025) does NOT show "the spike settles for most"; it
shows only 3.6 percent stay persistently high, and its sample starts at 13 to
14 so it cannot see the age 11 spike. Verified briefing:
briefings/2026-08-27-first-whatsapp-moment-v2.html. Build plan:
plans/2026-08-27-first-whatsapp-moment-plan.md. Codebase audit found the
product already owns most of the moment (/dashboard/secondary, first-phone
agreement, My Contacts guide, migration 218 stage arrival prompts, seven group
chat scripts), so the plan is small data migrations, not new systems. The
kids-research skill gained a named lens bench (Teacher, Distributor, Designer)
and a Phase 5b distribution review at Justin's request.

## 27 August 2026 — tidy up: migration 226, rate sweep, sticker sync (PR 910)
Justin: "Yes do tidy up do all works including stickers to match what we
designed in the existing passport stickers part and stickers earnt on their
app so all synced and works." Shipped: (1) migration 226 family_job_since,
so flagging an OLD job as a family job stops its stars forward from that day
instead of retroactively wiping the child's lifetime earned; bank, quest
create and toggle all carry it, pre 226 databases fall back to the old rule.
(2) The per child star rate (225) now prices every surface, not just the
money paths: the Monday rollover (holiday minutes AND sticker credits were
being paid at the deployment default), the DiGi weekly review (now reads the
bank, so family jobs are excluded and minutes are summed per child at each
child's rate), literacy Healthy balance, the four child pushes that promise
minutes, KidRoad's "1 star is X minutes", and the child balance page rows.
(3) Sticker sync: the celebration pop now shows the same drawn badge the
book shows instead of the retired emoji; parent book, child book, passport
stamps and the Monday credits all read one system. Migrations 224, 225 AND
226 applied to the live database and verified; nothing is pending.

## 27 August 2026 — the research experts are now permanent agents (PR 910)
Justin: "Cab we add those agents to this zsssion every time." The verifier,
the distribution reviewer (Instagram and LinkedIn expert) and the platform
mapper (the Designer lens) are now checked into .claude/agents/, so every
session on this repo has them as named agent types automatically. The
kids-research skill now runs the distribution review on EVERY briefing
(no longer on request) and the platform mapping whenever a briefing
proposes features. Content potential notes land in content/packs/.

## 27 August 2026 — the star system story joins the Sunday weekly email
Justin: "Can we add this all to emails weekly list and check all crons
working as one didn't fire." The Sunday DiGi review email now carries the
reward loop next to the work: stars earned priced in minutes at each child's
own rate, new stickers earned this week by name, holiday minutes banked, and
the unspent time that Monday's rollover will turn into sticker credits, with
the one line rule spelled out (the one who uses less gets more). Cron audit:
all 34 scheduled routes are wrapped in withHeartbeat, so cron_runs can name
any miss exactly; the live check needs the Supabase connection back.

## 27 August 2026, the live cron audit (completing the note from the Sunday email build)

Justin: "check all crons working as one didn't fire", and the earlier session
could not reach Supabase to look. Checked now, all 34 scheduled routes in
vercel.json against cron_runs. The verdict: 32 of 34 healthy, zero failures
anywhere in the last seven days, every daily, weekly and high frequency job
firing on schedule including the whole star and email family (star week
rollover Monday 00:10 ran, weekly review Sunday ran, digest, monthly and
Sunday email all clean, invoice requests clean since the understood 14 August
blip). The twice monthly jobs (knowledge refresh, script refresh, lesson
drip) all ran their 15 August slot and device guide refresh ran its 2 August
slot. answer-review DID fire its 2 August slot, logged under the old key
without the leading slash; the route now writes the new key, so 2 September
is the date that confirms it end to end. The same two jobs remain silent as
on the 19 and 21 August sweeps: legal-watch (zero rows ever, July 3 slot now
55 days gone, next slot October 3) and passport-check (zero rows ever, July 1
and August 1 both missed, next slot September 1, five days away). withHeartbeat
writes a row before the secret check, so zero trace means Vercel never calls
them. Still the same ask: open the Vercel Cron Jobs tab and check those two
are listed and enabled, ideally before September 1 so passport-check catches
its next slot.

## 27 August 2026 — cron audit result: nothing is broken
Justin asked to check all crons as one did not fire. Read cron_runs on the
live database: every scheduled job that has had a due slot since deployment
ran on time over the last 7 days, zero hung, zero failed (device-time every
minute, the pushes, the emails, the reminders, weekly review Sunday, star
rollover Monday, all green). The three jobs with no runs are simply waiting
for their FIRST ever slot: passport-check (added 5 Aug, runs 1st of the
month at 17:00, first fire 1 September), answer-review (added 2 Aug at
20:29, its 2nd-at-05:00 slot had passed that morning, first fire 2
September), legal-watch (quarterly, first fire 3 October). Nothing to fix;
if the August passport check matters it can be fired once by hand from the
Vercel dashboard, otherwise September catches it.

## 27 August 2026 — the no phone family is a first class citizen (PR 913)
Justin: the star system and device timer must work for kids with no phone,
parents run it, and the printable chart has to work and explain. Audit found
the plumbing already existed (parents tick jobs on the board, the printed
sheet flow in the approve route, ParentDeviceTime grants and runs time on
any family device from the parent's phone, FridgeChartLog enters the paper
week in bulk). What was broken: the printed sheet said "1 star = 5 minutes"
in ink whatever rate the family had set, and nothing on paper explained the
loop. Fixed: StarChartSheet takes the child's own star rate (both builder
pages and the kid print page feed it; the signed out lead magnet keeps the
default), page two now prints the four step no phone loop (do the job, grown
up ticks it in the app, spend on the family TV via the parent timer, Monday
resets and unspent time becomes sticker credits), the parent builder says
plainly that no child device is needed, and the parent ask box, grant cost
and gift copy now price at the child's rate via the active endpoint.

## 27 August 2026 — the Meta settlement package (PR 913)
Full kids-research pipeline on the 26 August Meta settlement: six lenses,
verified briefing (briefings/2026-08-27-meta-settlement-v2.html, 16
confirmed, 15 corrected, 3 orphan stats removed), distribution review in
content/packs/2026-08-27-meta-settlement/. Claims discipline now binding:
never one clean figure (up to 17.1B reported, ~12.7B guaranteed), never
"Meta admitted", never imply UK children get the protections (US only per
Meta, ten year sunset), never the settlement as proof of harm. The
quotable trial fact is the Take a Break exhibit: 1.8 percent of teens used
the tool Meta's blog said more than 90 percent kept on. The two hour cap
is a negotiated number: Twenge testified the rise starts near one hour and
the two hour figure came from Meta's attorney. Positioning: the
settlement's parent removable defaults are our calibrated model in a
consent judgment, and the star tiers already shipped the architecture for
UK families. Open follow up: a Litigator V3 on the consent judgment PDF
before any money or enforcement claim reaches marketing.

## 27 August 2026 — the fines history package and the six part thriller (PR 915)
Justin commissioned the full arc: every government and legal case against
big tech from first to most recent, the politics, where the money goes,
the tobacco and opioid precedents, and a six part thriller series.
Delivered briefings/2026-08-27-big-tech-fines-v2.html (six flexed lenses
including the Litigator; 54 ledger rows: 40 confirmed, 14 corrected, 0
demoted) plus content/packs/2026-08-27-big-tech-fines/ (content potential
note and the drafted series). Spine findings now citable: before August
2026 no big tech fine anywhere was legally required to be spent on the
harm it punished (EU fines cut member state contributions, US penalties go
to the Treasury); no fine ever changed a business model (the 5B order was
followed by Messenger Kids violation allegations); only final after appeal
figures count (AdSense annulled, Intel ended at 237M with the EU paying
Intel 515.5M interest); tobacco 3.5 percent FY2025; opioids' new failure
mode is unspent money; the un fined UK design code beat every fine on
reach; the guaranteed 12.7B is about six weeks of the expanded Child Tax
Credit (our arithmetic, always labelled). Series branding: The Wrong
Villain: Follow the Money, Part N of 6; Parts 3 and 6 as carousels. The
never post list in the content pack is binding, including: never the
stock went up as proof the fine was weak, never "proved and hid", never
the drivers pie chart as one study, never sum announcement figures, New
Mexico always with "Meta is appealing". Settlement approval resolved:
final judgment entered 26 to 27 August with appeals waived (MLex). Named
V3: the State Treasurer lens plus the consent judgment clause read (2027
statute scoreboard), superseding the earlier standalone Litigator V3 ask.

## 27 August 2026 — the analytics loop closed into the agents
Parsed Justin's 7 and 90 day LinkedIn exports (183,020 impressions, 89,279
reached, 8,984 followers). Written into viral-post SKILL.md Part 8 so every
future draft inherits it: consistency is the engine (decay to 2,000 weekly
impressions after quiet weeks, 378 percent rebuild in eight days of daily
posting); judge posts on reach AND engagement rate (account benchmarks:
~2.8 median on top posts, above 3.5 strong, below 1.5 on high reach means
audience mismatch); the Australia ban post (9,703 impressions, best of
August) taught that news hooks export reach to the news country, a third
of its readers were Australian, so news posts are authority plays and
carry a UK re anchor line; naming the Haidt or Odgers debate directly
earns roughly double the ER of neutral summaries and the champion fused
number hook plus named position; followers convert only in the viral
window (~700 in the June wave week); the readership is senior (founders,
headmasters, professors at King's, UCL, Oxford, Melbourne), so the
Odgers bar is literal. Publish pack updated with the cadence and UK
anchor rules.

## 27 August 2026 — ban positioning language locked (Justin, in comment thread)
Two framings adopted for all ban content and comment replies, born in the
Tristan thread on the Australia post and Odgers tested: (1) "the ban is
failing as a wall and working as a stick": exclusion failed on its own
terms (8 in 10 Australian under 16s still on social media) while the
threat of listing produces design change in boardrooms, and the thing
doing the work in the success half is design change, so crediting the
stick concedes nothing and argues for writing design rules directly;
(2) "risk changes shape, not size" on migration: children leaving
engagement engineered feeds land in less algorithmic but less moderated
spaces, trading amplification harms for contact and moderation harms.
Both lines feed docs/11 Stage 4 content ahead of Spring 2027 and the
Part 6 close of the Follow the Money series.

## 28 August 2026 — Meta sentiment and settlement briefing (V2, verified)

Briefing: briefings/2026-08-28-meta-sentiment-and-settlement-v2.html (38 confirmed,
13 corrected, 1 demoted). Key decisions and citable facts:

- **The beta = 0.061 house stat has its citation**: Ferguson, Kaye, Branley-Bell and
  Markey (2025), Professional Psychology: Research and Practice, 56(1), 73 to 83,
  DOI 10.1037/pro0000589. Confirmed: 46 studies, pooled beta below the preset r = .10
  evidentiary threshold. DROP from all future copy until the PDF is read: "79 effect
  sizes" and "pre registered on OSF" (unverified). Rausch and Haidt contest it; never
  conflate with Ferguson's separate experiments meta (d = 0.088).
- **Four standing contrarian lines (documented absences, hostile expert proof)**:
  the settlement regulates the visible, not the severe; it audits compliance, not
  children (auditor ends 120 days after its fifth annual report on a ten year deal);
  New Mexico is the control group (the verdict state won the AI chatbot ban and DM
  safeguards the 47 state deal lacks; Meta appealing); nobody is contracted to find
  out whether it worked.
- **Narrowed lines (Skeptic verdicts binding)**: settlement is a price not a verdict
  (never imply the record is empty); never the word "scapegoat", say attention audit;
  the 30% contingency "functions as" a competitive weapon, never "is about"; use
  Béjar's 13% in 7 days (survey of ~237,000 users, Senate testimony) instead of the
  conditional one in three girls slide when a harm number is needed.
- **Never post any more**: ACE odds ratio range 2.4 to 3.98 (demoted, untraceable to
  Hughes et al 2016 tables; prevalences 46.4% and 8.3% stand); "over half of teens on
  phones midnight to 4am on a typical night" (the real figure: 52.1% used the phone in that
  window at least once during the JAMA Pediatrics ABCD study, n=657); "4.7m accounts
  removed by Meta" (industry wide; Meta alone 756,000 through June 2026); NCMEC's
  ~three dozen sextortion suicides is cumulative since 2021, not one year.
- **Settlement facts pinned**: consent judgment cap $16,680,647,753.21, minimum
  $12.1bn committed; 51 jurisdictions signed (Meta says 52); judge signed 26 Aug;
  DMs excluded from all three modes; Time Limit and Night Mode sunset at 5 years
  unless TikTok and YouTube sign; permitted uses include "additional litigation
  against social media platforms"; California at least $1.5bn up to ~$2.2bn, decided
  by its legislature.
- **Australia figures, use with their measure**: The BMJ (Barnes et al, June 2026,
  n=408): 85%+ of under 16s still using; eSafety evaluation: 86% to 81% use, 60% to
  58% daily; Bursztyn et al (NBER 35162): ~27% compliance at 14 to 15, 75% say
  circumvention easy. "Why Bans Fail" is Bursztyn et al, not Sunstein/Duckworth.
- **Hidden likes correction (in Meta's favour)**: the independent PAID 2021 trial
  SUPPORTS hiding like counts; with Project Daisy that makes hidden likes the one
  settlement term with converging evidence. The V1 claim that it showed no benefit
  was inverted and is retracted.
- **Sleep window argument**: Night Mode starts midnight; a 7am school wake needs
  ~10:30pm sleep; ABCD tracking: mean 50.1 min use 10pm to 6am school nights. The
  9pm to midnight window is ours (fade ladder, no phone evenings).
- **The credibility play decided**: pre register falsifiable predictions on the
  settlement as a natural experiment (aggregates will not bend by 2029; sleep may
  improve modestly; Meta reputation barely moves; watch the five year sunset).
- **V3 if commissioned**: the seventh lens is the teenager, built on VotesforSchools
  (40,000 pupils), Ofcom, Girlguiding youth voice data.

## 28 August 2026 — V3: the teenager lens (youth voice, verified)

briefings/2026-08-28-meta-sentiment-and-settlement-v3.html replaces V2 (running
totals 46 confirmed, 16 corrected, 2 demoted). New citable facts and rules:

- **Fifth standing line**: teenagers were the first authors of these rules. A
  5Rights Youth Jury member designed the automatic night and school switch off in
  2016 (built as the Zone App prototype); a court ordered Meta to build the same
  mechanisms a decade later. Verified against 5Rights primary pages.
- **Teens are ambivalent, not opposed**: Pew Oct 2023: time limits 34% support /
  36% oppose; parental consent 46% teen support (adults 81%). UK Youth Select
  Committee (Mar 2025, exact quote): a ban "like in Australia, is neither
  practical nor effective". Amnesty 2023: 74% check more than they would like
  (self selected, 550, 45 countries).
- **Sample discipline (never post without)**: Common Sense 45%/33% feature figures
  are GIRLS AGED 11 TO 15 (n=1,397); the 237 notifications median is n=203 Android
  only; HEAT/Design It For Us 58%/39% is advocacy commissioned (n=800, with
  ParentsTogether), carry with the label; parental monitoring finding (restrictive
  tracks problematic use, conversation and autonomy do not) is cross sectional,
  248 parents, parent reported.
- **Demoted**: "bystanders fail to notice smart glasses recording indicators"
  pinned to the Australian PLOS ONE study (not in it; it is an adult acceptability
  survey). ICO letter to Meta on glasses footage is MARCH 2026, not August.
- **The only youth voice in settlement coverage**: Sebastian Mahal, Design It For
  Us (CNN 27 Aug), wants the safest experiences on by default. Still zero ordinary
  teens, zero teen polls.
- **VotesforSchools question set** (ten questions, in the briefing): strongest two
  are the readiness question (step by step vs off at 18) and the authorship
  question (should young people help write the rules). No UK youth dataset exists
  on either the settlement rules or smart glasses; the 40,000 pupil vote would be
  the first of both.
- **V4 if commissioned**: the state legislator lens (statute tracking on where
  each state's Meta money goes before the 2027 sessions close).

## 29 August 2026 — The five value surfacing fixes shipped (Justin: "go ahead")

From plans/2026-08-28-value-and-revenue-review.md. What changed:

1. **Both public money pages now show the full product.** The homepage annual
   card lists nine rows led by the star quest (stale "Weekly three action plan"
   retired); /join gains four feature blocks (star quest FIRST per THE-STORY
   §10, the child's own app, the homework decoder, the passport and
   printables), wording matched to WhatYouAreBuying so the promise outside
   equals the product inside.
2. **What is working has a permanent door**: an Explore tile in DiGi and
   reports, and the weekly working-on rotation card points there directly.
   week-numbers now points at /dashboard/week (the round up that actually
   reads the week back), so the two weekly cards stop sharing a door.
3. **Stale rotation targets fixed** (journey and stance now hit
   /dashboard/pathway directly instead of the /dashboard/road redirect) and
   four Explore tiles added: Devices and The toolbox (Family), The guide
   (Learn), Screen balance (DiGi and reports). DiGi insights sub reworded so
   it stops sharing a sentence with the new What is working tile.
4. **The check in completion now opens the whole picture**: a quiet link to
   what-is-working when any concern has history, closing the "data goes in,
   comes back only on Sunday" gap. The per row verdict already read today
   against last time; that stays.
5. **Two new daily rotation slots**: printables ("One for the fridge") and an
   age gated setup guides card (phone-setup from Stage 2, social-settings from
   Stage 3, via a new optional stageId signal). Daily cycle grows 11 to 13
   items; scripts/check-next-up.mjs updated to prove coverage over two cycles
   (13 days always contains two Mondays, so one cycle can no longer prove it).

Verified: tsc clean, next build clean, wiring check 0 new, check-next-up all
passing, homepage pricing and /join screenshotted at 390px and 1440px (the
GSAP fade up hides the pricing grid from anchor jumps in headless shots; a
real scroll renders it, pre existing behaviour, not touched). Dashboard
surfaces (ExploreGrid, check in door) are typechecked and build clean; visual
check of those falls to the Vercel preview since the local container has no
Supabase auth.

## 2026-08-29 — Passport codes, school and home sync, graduation (planned, migration 227 claimed)

The "Cambridge idea" Justin referenced is identified: Professor Sander van der
Linden (Cambridge, Social Decision Making Lab) proposed a "social media
passport" of gradual supervised exposure plus safety by design, in Nature
Health (Feb 2026) and Cambridge's expert reaction to the UK consultation. Our
five stages are that programme already built, so the plan finishes the part
his proposal needs and ours lacks: verification.

Plan written to plans/2026-08-29-passport-codes-and-graduation-plan.md.
Decisions locked in it: children.passport_code is migration 227 (Crockford
base32, GC-XXXX-XXXX, collision retry, backfill); public verify page at
/verify/[code] on the app/m/[id] pattern, exact match or silence (DofE
style), first name and stamp dates only, one DPIA line; school to home
bridge is bridge a only (static home codes per school module through the
existing parent_note jsonb, redeemed as lesson_source 'school_lesson'
completions, class shares one code because this is credit not assessment);
the certificate is the final page of the passport, never a separate
artefact; graduation film unlocks on the all passed gate, master per stage
plus personalised end card, assets commissioned later; at sixteen a
readiness review worded by the social_media_law flag, certificate always
says "completed the preparation", never "safe" or "ready". Never build:
bridge b (teacher accounts), bridge c (pupil identity sync, violates the
locked privacy promises), printing the kid_links token, or the name
"digital passport" in UK school marketing (UKCIS collision). Stamps never
record venue: same syllabus, any venue, one certificate (the Cambridge
private candidate rule), which is what makes home learning the same
mechanism, not a feature.

---

## 2026-08-30 — One lesson, everything, in one run: the run sheet, the passport moment, and the friend at the door

Justin, 29 August: one lesson from start to finish, teacher scripts, guidance,
what exactly to teach, how to run it, walk them through it, all the paperwork,
everything in one run, explaining the concept of earning the passport, with the
best friend animations at top presentation level. Lesson 1 is that lesson now.

**The run sheet, /lesson/[module]/run.** The lesson home page answers "should I
teach this"; the player answers "what does the class see"; nothing answered the
Sunday night question in between, WHAT DO I DO, in order, with the words. The
run sheet is Before as tick rows, During as one card per phase carrying every
slide's minutes, headline and full script, After as tick rows, printable as one
clipboard document, and every teaching line on it comes from the lesson row
(scripts live in the database, so one page serves all 21 modules unchanged).
Each slide row deep links into the player at that slide (?slide=N, clamped).

**The passport moment.** Migration 231 (claimed as 230, renumbered in the #926
merge after the passport codes lane's 230 merged first; content unchanged and
already applied to production) gives lesson 1 a digi slide between the
chant and the goodbye: DiGi Junior's special book, every lesson and every job
fills the page, a full page brings the big check and the big check earns the
stamp. Vocabulary follows the 29 August passport language audit to the letter:
the passport, never "digital passport" (UKCIS collision, locked decision);
filling and earning, never testing; nobody can fail it; no venue claim. The
printed parent note gains a passport line written for a family that has never
heard of us, and the lesson page tells the teacher which stage page their key
stage fills, with the two honesty lines: the passport never records where a
page was filled, and none of this creates pupil data.

**The friend at the door.** Lesson 1's title slide carried no character key, so
the intro regex matched "screen" and played ORBIT'S FOOTBALL CLIP on a lesson
whose cast is Pebble with DiGi Junior. One data field ('character':
'celebrate') puts Pebble at the door. Found by the animation audit, which also
established the toolkit: five DiGi moods, three intro clips, five friend
cutouts, GSAP only. The player now runs phase choreography on that toolkit:
when a slide crosses into a new phase the star takes the phase's stance (wave,
thinking, speak, happy) and the current phase pill takes one small pulse. One
beat per phase, six per lesson, deliberately not one per slide, because a pop
on every slide is wallpaper by slide four. Reduced motion skips the pulse.

**Two bugs out.** The printed parent note hardcoded module 12's three
misinformation checks on every module, so a Reception family would have got
"who made this and how do they know" on the back of a lesson about asking a
grown up; it now prints the module's own tool through the fallback chain that
page one already used. And the schools homepage said "digital passport" in
marketing copy, which the naming decision forbids; it now says "the passport
to sixteen".

**Left alone, on purpose.** No completion write, no stamp write, no redemption
code: that plumbing is bridge a, claimed by the passport codes lane (migration
227). When it lands, the parent note's passport line is where the home code
naturally goes. The Explorer age label inconsistency in the PARENT app
(readiness.ts, email blocks, ScriptDetailView still say 11 to 13 after
stages.ts moved to 11 to 12) was found during this work but belongs to the
passport application lane; reported, not touched.

---

## 2026-08-30 — The research fleet reports: the ban reframes the passport, the name is doubly collided, and the map wants to be free

Twelve agents (six lenses, each adversarially audited) came back on the White
Rose model, credential precedent, living risk sources, AI careers evidence,
the philosophy canon and lawful testing. Distillation with sources and
corrections: research/2026-08-30-passport-curriculum-research.md. Full plan:
plans/week-of-2026-08-31-white-rose-passport-curriculum-plan.md. The three
findings that change decisions rather than details:

**The under 16 social media ban (announced 15 June 2026, force expected
spring 2027) makes "social media ready at 16" legal alignment rather than
aspiration.** The social_media_law flag was built for exactly this and now
has a date. The ban excludes WhatsApp, Discord and gaming, so under 16 social
life migrates there and the risk layer must never treat the ban as coverage.
KCSIE 2026 (in force 1 September, days away) names generative AI, deepfakes
and misinformation; the coverage map must show them this term.

**"Digital Passport" is doubly collided**: a live US trademark (Common Sense
Media, reg 4246911, product retired, mark surviving) and a UKCIS safeguarding
tool of the same name for care experienced children. The existing ban on the
name in UK school marketing is confirmed and extends to everywhere public.
Candidates: DiGi Passport, The Road to 16 Passport, The Passport to Sixteen,
pending a UK IPO clearance search that could not be run from this sandbox.

**White Rose became the standard by giving the progression away and selling
the classroom materials.** Free small step maps are why every publisher
aligns to them. Publishing our 21 module step progression and EfCW/RSHE
mapping openly while keeping lessons, scripts, packs and assessment behind
the code would narrow the 15 August full gate decision, so it is put to
Justin as a decision, not taken.

Assessment law from the testing lens, now written into the plan: Demonstrated
or Not Yet, never pass or fail, never a score against a child, no free text
about a child in the database, no readiness computed from usage (Children's
Code), the claim worded like national curriculum swimming, and the credential
never positioned as age assurance.
## 2026-08-29, late — Phase 1 and 2 of the passport plan claimed (migration 227)

Plan PR #922 merged by Justin, which per the weekly rhythm is the approval to
build. This session builds the platform code half in order: migration 227
(children.passport_code), the surfacing, then /verify/[code]. Migrations 228
and 229 stay with the curriculum session per the White Rose plan (#923).

## 2026-08-29, late — Passport number, verify page, code on every surface (built)

Migration 227 gives every child a public passport number, GC-XXXX-XXXX in
Crockford base32 (no I, L, O or U, reads out loud cleanly), generated by a
security definer trigger with a collision retry and backfilled for existing
children. The number is deliberately a different animal from the kid_links
token: public, meaningless on its own, resolving only through the verify page.

Surfaced in three places: the burgundy cover of the parent flip book (№ under
"The journey to 16", like a real passport), the child's own passport takeover,
and the keepsakes checkout personalisation payload so the printed book carries
its number for the QR.

/verify/[code] is the public check, built on the app/m/[id] pattern with the
service role client (children rows are parent locked under RLS and the page
has no session). Exact match or silence: a wrong code is a plain 404, a right
code shows the child's first name, the five stages with stamped state from the
same getAllStagesProgress engine every passport surface trusts, and nothing
else. Input is Crockford normalised (case, spaces, I and L to 1, O to 0), the
page is noindex, and the copy holds the line: a stamp records completed
preparation, never a guarantee. Per stamp dates were in the plan and are not
shown in this version: the stamp gate is computed, not stored with a date, and
deriving one would have meant forking the crediting engine. Named as a
follow up rather than done badly.

DPIA line (already flagged for the go live checklist): a child's first name
and stamp states are reachable by anyone holding the printed code, by design,
and by nobody else.

## 2026-08-29, late — Bridge a and the graduation certificate (built, migration 230)

Justin: "Go ahead with bridge a and the graduation gate."

Bridge a. Migration 230 gives every school module a static HOME-XXXX code
(Crockford, trigger plus backfill, same pattern as 227), printed on the
parent note page of the module's print pack, the sheet that already goes
home. A parent enters it on the Lessons page ("Brought home from school"
card at the foot, beside the library rather than on the road) and
/api/school-code writes a lesson_completions row with lesson_source
'school_lesson', the slot open since migration 023. The lookup goes through
star-lesson-catalogue, still the parent app's one door to school lessons.
Deliberately NOT counted toward stage stamps: a module is credit, not a
stage lesson. Whole class shares one code because this is credit, not
assessment; home educators use the same codes, and the record never says
which door the credit came through.

Graduation. The certificate is now the passport's final page: PassportBook
grows a sixth page only when every stage is stamped, in the book's own
burgundy and gold, with the locked wording ("has completed the preparation
for digital life... done and on the record"), the passport number, and the
verify pointer. Never "safe", never "ready". The graduation film slots in
behind the same gate when its assets are commissioned; the gate ships first
as the plan ordered.

---

## 2026-08-30 — Four decisions from Justin: the open map, the name, the board, and the clips

Justin, replying to the curriculum plan's decision list: "2 yes. Take advice:
The Guided Childhood Passport. 4 take advice. 5."

**The open map: yes.** The curriculum map (/curriculum) and the RSHE mapping
matrix (/hub/rshe-mapping) are public from this commit, no school code. This
deliberately narrows the 15 August "everything behind the code" decision on
the White Rose evidence: a free progression is how a scheme becomes the
standard others align to, and neither page can be taught from. The paid wall
stays around the lessons, scripts, packs and testing, and a visitor tapping
from the open map into a module meets /unlock, which points at /pricing.
That is the funnel, not a leak.

**The name: The Guided Childhood Passport.** Chosen on the advice that the
brand leads and the dangerous shortening disappears: it abbreviates to "the
passport" or "the GC Passport", never to "the digital passport" (which is
both a live US trademark and a UKCIS safeguarding tool). Still conditional
on the UK IPO clearance search, which has to be run from a normal
connection. Two consequences recorded for the passport application lane:
the PassportBook cover in the parents app still reads "Digital Passport"
and should become "The Guided Childhood Passport", and the child facing
copy can keep saying just "the passport", which was always the safe form.

**Board, not tablets.** The classroom interactives stay designed for one
screen and thirty children: teacher taps, class votes with hands and bodies.
This is now the standing assumption for rolling the Lesson Standard across
the other twenty modules. Tablets revisit at secondary if ever.

**The clips: proceed as advised.** Nova and Cosmo, the KS4 and KS5 lesson
hosts, get intro animation clips first (generated from their existing cutout
art so the style cannot drift), and the roughly ninety lesson video beats
wait until real classes have run the lessons. No new character designs, no
new art style, motion on the art that exists.

## 30 August 2026: Nova and Cosmo clips approved

Justin: "Happy with clips." The two intro clips generated from the
stage-characters cutout art (PR 928) are approved as they stand, no
regeneration. Migration 233 (claimed in its draft PR) writes
character: nova onto the title slide of every KS4 deck (modules 15 to 19)
and character: cosmo onto KS5 (modules 20 and 21), located by slide type,
never by index. The Supabase MCP is not attached to this session, so the
migration ships as a file and needs applying: paste it into the Supabase
SQL editor, or any session with the MCP runs it as written. Backup table
schools._backup_lesson_233 follows the RLS pattern from migration 232.
---

## 2026-08-30 — Daily health sweep: green, one small fix (migration 232)

Schema: all 11 required columns present. Cron heartbeats: all 34 jobs on
schedule, no failures in the last 7 days, no zero counts that looked like a
hidden fault (checked followups and digi-insights by hand, both genuinely
had nothing due). Security advisors: one ERROR, `schools._backup_lesson_230`
had RLS disabled and was readable by anon and authenticated, same shape of
hole as `_backup_lesson_199` closed by migration 202 on 15 August. Fixed the
same way in migration 232: RLS enabled, no policy, table left in place as
someone's safety net. Performance advisors: 626 findings, all the known
multiple-permissive-policies and auth-rls-initplan backlog plus routine
unindexed foreign keys and unused indexes, nothing new.

## 1 September 2026 — the check in keeps its result, and its promises became wires

Justin, after the five lane audit: "all and make sure apply level of UX."
The instrument did not change: five stars, bands posting 2, 4, 6, 8, 10,
band against band on the server, per the 12 to 19 August decisions.

What was decided and built (PR #937):

1. A saved row folds to a slim line that KEEPS the verdict ("Up from hard
   going"), instead of destroying it 2.6 seconds after it appeared. The fold
   settles via a grid rows transition; reduced motion keeps the jump. A dip's
   folded line carries two real buttons: Ask DiGi (lands on the chat with the
   question pre written via ?ask=) and See the script (via signal-map).
2. The card counts the run ("2 of 5") and spotlights the live question;
   waiting rows sit at reduced strength. One at a time by light, not by
   hiding.
3. The baseline now makes the daily promise out loud: "We check in each day
   from here and show you the movement." First save says "Tomorrow reads
   against this one."
4. DiGi can see the stars: the chat context's live concerns block reads the
   latest scored concern_events per concern (word, drift, recency), so a dip
   logged this morning is known this afternoon. The wisdom bank aggregate
   was never per family; this is.
5. The history row is written FIRST in /api/daily/concern-check and its
   failure is a 500 the row retries from. Status can no longer advance with
   no event behind it.
6. The Sunday review email gate reads scored check ins as a sign of life,
   not just quest ticks. Check in only families get their movement email.
7. Moment keys map onto the concern slugs they are (bedtime to
   bedtime-screens, come_off to wont-put-down, tv_morning to morning-tv), so
   "log it as a moment and it returns here on its own" is true for the
   seeded worries. Only unambiguous pairs are mapped; everything else stays
   its own concern.
8. Movement carries the child's name everywhere (getMovements, What is
   working, the email block, the Sunday round up), shown only when more than
   one child is named.
9. review.md gained section 4a, the check in's own bar. The Playwright guard
   (scripts/check-concern-dots.mjs) was brought back in line with the
   shipped design, gained assertions for the folded verdict and the counter,
   and now runs in CI (wiring.yml, no secrets needed, against the
   /dev/concern-scale fixture). THE-STORY.md describes the five stars. The
   Wednesday walkthrough now walks the RETURNING check in, not only the
   first.

Accessibility ruling inside the same change: only the star AT last time's
band carries the "what you said last time" aria label. The grey fill stays
cumulative; the fact is singular.
## 2026-09-01 — Daily health sweep: one small fix (heartbeat processed count)

Schema: all 11 required columns present. Cron heartbeats: /api/cron/answer-review,
/api/cron/legal-watch and /api/cron/passport-check show no run at all under
their current path, which looked alarming at first glance. Checked the git
history: all three were only added on 19 August (PR 883), and their schedules
are monthly or quarterly, so none of them has reached its first scheduled day
yet (passport-check's first day is today, answer-review's is tomorrow,
legal-watch's is 3 October). Not a fault, just new jobs waiting their turn.

Found and fixed one real gap: knowledge-refresh and script-refresh (the
fortnightly research and script updaters) report their result as `inserted`,
which was not in the list of field names the health board reads to judge a
run by what it did. Every run of both jobs recorded "count unknown" on the
board forever, healthy or not, which is exactly the class of fault this board
exists to catch. Added `inserted` to lib/ops/heartbeat.ts processedFrom.
Small, certain, no schema change, no behaviour change for parents. PR opened
against claude/serene-cori-afd525.

Also checked by hand: invoice-requests failed twice on 14 August with a
missing table, already fixed and healthy since. settings-nudge has processed
zero for four straight weekly runs, explained by there being exactly one
paying family in the database with push enabled, not a bug. Security
advisors: no ERROR level findings, only the known INFO-level locked tables
and routine WARN items. Performance advisors: 627 findings, two categories
not seen in the 30 August sweep (no_primary_key on the three backup snapshot
tables, and one duplicate_index on public.child_time_settings), both minor
and neither fixed today as they need a human decision on which index to keep.

## 1 September 2026 — the weekly tester: DiGi examined every Monday, on our philosophy

Justin: "go" on plans/week-of-2026-08-31-digi-weekly-tester-plan.md. Built
as four extensions to the machinery that already ran, per the plan's rule
that the safest build extends rather than replaces (PR #938, migration 234).

1. ROTATING DIFFICULT QUESTIONS. lib/digi/weekly-tester.ts drafts five hard
   cases each Monday: four grown from the week's real parent questions
   (clustered into themes first, never quoted with a family attached), one
   from the research queue's newest pending finding. Each runs through
   EXACTLY the fixed suite's pipeline (runCase is now exported from
   lib/digi/evals.ts), so a rotating score means the same as a fixed one.
   The fixed suite stays frozen; the rotation never edits it.
2. THE THREE LENSES. Every rotating reply is also graded 0 to 1 on: trauma
   informed (behaviour as communication, zero shame), connection first
   (sturdy leader, repair over punishment, never allow or deny), and
   evidence discipline (cited or silent, no panic numbers). The lenses are
   OUR philosophy sharpened by research on published work. Justin's line,
   held in code: no expert's name in any model visible prompt, stored
   result, or anything a parent could see; nothing writes in anyone's
   voice; no endorsement said or implied.
3. THE MONDAY EMAIL GREW. digi-quality now reports the rotating cases with
   each one's weakest lens, what parents asked this week (themes with
   counts), script gaps (themes no script category matches, via the same
   signal map the live recommender uses), and a science watch line naming
   how many findings await Justin's OK. A rotating safety breach counts
   against the all clear: a breach is a breach whichever case provoked it.
4. STORED AND WATCHED. digi_tester_runs (migration 234, applied to live,
   RLS on with no policies so only the service role reads it) keeps one row
   per Monday, upserted on week_start so reruns correct rather than stack.
   The health sweep's REQUIRED_COLUMNS gained the check in spine
   (concerns.last_checked_at, concern_events.score,
   profiles.first_checkin_at) and the learning loop
   (expert_knowledge_candidates.status, digi_tester_runs.week_start).

Fail soft rule: the rotation is wrapped so a bad morning never stops the
fixed suite's verdict reaching Justin, and testerRan lands in the cron body
so the board sees a silent failure of the new half.

First real run: Monday 8 September. The plan's own gate stands: four weeks
of runs, then judge whether the lenses agree with Justin's reading before
trusting them further.

## 1 September 2026 — lesson videos audited, 1.10 repaired, the Common Sense gap list

Justin's screenshot: The Yes No Button opened on ten seconds of black. All
41 lesson video files probed frame by frame in the Higgsfield sandbox. The
fault is in the exports, not the player: the video track starts late (or
drops stretches) while the narration runs on time. 1.10 was the only lesson
opening on black (parts one and three, and the full cut); 1.2 and 1.7 each
carry one 20 to 25 second stretch of missing picture mid video that plays
as a frozen frame. The other 34 files are clean.

Decided and done: the three 1.10 files were rebuilt with ffmpeg (opening
title frame held from second zero, internal hole filled, narration
untouched), uploaded to the same CDN, and the parent_lesson_segments rows
repointed. Live data change, no migration: the rows were created by hand
originally and the seed file carries no URLs. ParentLessonPlayer now passes
poster_url to the video element so the pre play box shows lesson art, never
black. 1.2 and 1.7 left as they play today (nothing opens on black there);
the honest cure for all three is a re render through the lesson video
pipeline, offered to Justin, not started.

Decided: the age fit review found the library sound (uniform 7 to 8 slide
decks, reading level rising with stage, EFCW strands, RSHE 2025 named
topics present, AI ahead of schools). The Common Sense Media curriculum (73
lessons, verified against their published scope and sequence) maps onto our
stages with twelve genuine gaps, the largest being news literacy between 8
and 12. The per age list and build order live in
plans/week-of-2026-08-31-lesson-quality-and-common-sense-gaps.md. No deck
gets written until Justin says go.

## 1 September 2026 — the child app's three little lies, fixed

Justin's review of the child app, now acted on with his go ahead:

1. A DAY WITH NO JOBS CAN FINISH. allDone in KidQuestScreen demanded at
   least one quest, so on an empty board the jobs step in the five a day
   could never mark itself, which quietly made the whole day unfinishable:
   no fifth tick, no streak, no celebration. An empty board now counts as
   done, the five a day row says "No jobs today, this one is free" (no
   strikethrough, it is a fact not a chore), and the step's note records
   why. The screen time unlocked banner now asks for at least one real job
   before claiming jobs were done.
2. MY QUESTS IS INSTANT. The back link on the five kid subpages (suggest,
   tell, adventures, lesson, tutor) was a fresh server render of the
   heaviest screen in the child app. KidBackLink goes back through history
   instead, restoring home from the router cache in a frame, guarded by a
   session flag the home screen sets so a cold deep link still navigates
   normally and a child is never thrown out of the app by their own back
   button.
3. THE TILE SAYS SENT. Tapping a preset on Ask for a job made the tile
   vanish mid tap (a pending ask filters the grid) with only a toast at the
   screen edge. The tapped tile now holds for a beat as a sage "Sent!"
   tick, then leaves. Verified in the browser on the ask-for-job fixture.

Deliberately unchanged: the balance step still ticks on reading the page,
because reading it is the whole of that step.

## 1 September 2026 — DiGi's conversation follows the child toggle

Justin: "make sure the child toggle works on digi and the history moves with
child select so digi can take correct details into thinking."

The route has filed memory, concerns, questions and feedback against the
selected child since 18 August, and the page already swapped prompts and
name. The conversation was the last blended piece: one thread per USER
(migration 001), shown unchanged whichever pill was lit, and fed back into
the prompt, so a question about one child carried the other child's recent
conversation in DiGi's head.

Migration 235, applied to live: digi_conversations gains child_id, one row
per (user, child), partial unique indexes so the no children account still
gets exactly one row, and the existing thread backfilled to the primary
child (verified: all three live rows attached). The route picks the
selected child's row for history and writes back to it by id, inserting
with child_id when the child has no thread yet. The page shows the selected
child's thread and remounts DigiChat keyed by child so a soft navigation
never leaves the previous child's bubbles under the new name.

THE CAP STAYS PER FAMILY, decided deliberately: today's messages are summed
across every thread for the 429 and the badge, so splitting threads hands
nobody a doubled free allowance. The admin members board merges the rows
back per member (counts summed, newest date wins). The weekly tester's
question clustering reads all rows and needed nothing.

## 1 September 2026 — lessons follow the child, and a lesson can be handed over

Justin: "Lessons should have child toggle and show lessons relating to age
and name, the child app only shows age relevant, and we can send to the
relevant child's app from here to let the child know about that lesson."

What was already true and stays: the hub honours ?child= (heading names the
child, library opens on their stage), the child rail shows on every lessons
page, the kid app lists only the child's own stage decks and its opener
gates anything above their age, and watch together films plus the Social
Media Ready module already had send buttons wired to the one child's phone.

What was wrong and is now fixed:
1. The stage filter did not move on toggle. LessonsBrowser seeds the filter
   into client state on mount, so switching from an 8 year old to a 13 year
   old kept the 8 year old's stage under the new name. The browser is now
   remounted keyed by child.
2. Opening a lesson dropped the toggle. Tile links and the detail page's
   back link carried no ?child=, so coming back from a lesson quietly
   snapped the page to the primary child. The child now rides along tile
   href, back link and the Ask DiGi link.
3. Interactive lessons could not be handed over. Only films and the module
   had send buttons. The lesson detail page now carries Send to <name>,
   shown ONLY when that child's own list will show the lesson (their stage
   or earlier, authored deck), so a ping can never point at a lesson that
   would 404 on the child's side. Same ping route, already scoped to the
   one child's subscriptions.

## 1 September 2026 — the child switcher audit, run again and written down

Justin: "run a check that child ticks works on every aspect of platform."
Full sweep verified in code, report at plans/multi-child-audit-01-sep.md.

The verdict: the August plumbing landed (layout rail, nav params, per
child lesson completions, quest ticks, DiGi filing and now its thread),
but the Today path and Home tiles still drop ?child=, one silent
corruption survives (a shared job approved from /dashboard/quests banks
stars for every child, because that page carries no child param and the
null tick counts for everyone), and twelve API routes still write to the
primary child whatever the toggle says (weekly agreement stars, Sunday
and weekly check in concerns, tracker, moment outcomes, DiGi feedback,
Right Now concerns, school send to child, keepsake orders). Advice side:
DiGi still blends wellbeing scores and concerns across children, and six
star cap call sites price every child on the middle band. Fix order is in
the report; nothing is architectural. Awaiting Justin's word before the
fixes are built.

## 1 September 2026 — every child switcher audit finding, fixed

Justin: "Fix and do all suggested fixes." All A, B and C items from
plans/multi-child-audit-01-sep.md, one session, one pattern: the child off
the wire, validated against this parent's children, primary only as the
fallback, legacy null rows still speaking for the household.

Wrong writes closed: the quest boards send the row's own child so a shared
job no longer banks stars for every child (A1, the last silent corruption);
the weekly agreement verdict, the Sunday and monthly check ins, the
tracker, moment outcomes and moment quests, DiGi's reflection, Right Now,
school send to child, and the keepsake order all take the selected child;
the lesson carry over read is scoped so two children passing the same
lesson can no longer void the never taken away rule.

Wrong advice closed: DiGi's wellbeing scores and live concerns are scoped
to the selected child (legacy rows still count for everybody), the
get_child_history tool's weekly table too, and every star cap call site
now passes each child's own age band so the board, the child's balance,
the printed contract and the till all quote the same ceiling. The three
child specific pushes name their child instead of buzzing the house.

Wrong display closed: the Today loop's rungs, Home's tiles, the lessons
grid and the together lesson's back link all carry ?child=; the lessons
library and lesson page read completions per child; agreement and
keepsakes joined CHILD_ROUTES and honour the toggle; the homework picker
opens on the selected child; school, printables, social settings, tell a
parent, crafts, agreement print, the tracker check in, the device sweep
and the rehearsal all follow ?child= instead of pinning to the primary
child. Deliberately unchanged: the quests page still shows every child's
board (that is its design), and the agreement stays one per family.

## 1 September 2026: the twelve Common Sense gap lessons are live (migration 236)

Justin: "Yes lessons." The full gap list from the Common Sense curriculum
review was built and shipped the same day. Twelve decks, sort orders 975 to
986, all status live: two Foundation (app traffic light, online
neighbourhood), four Builder (altered images, news vs opinion vs advert,
game chat sportsmanship, gender stereotypes), three Explorer (sideways
check, phishing, app data collection), two Shaper (hate speech and the
ratchet, confirmation bias), one Independent (privacy as a citizen).

Decisions made in the writing:

- No stat slides anywhere in the twelve. Every earlier deck that claimed a
  number needed a proof path; these teach mechanisms (the ratchet, the
  sideways check, the hook, the permissions test) that need no citation and
  cannot go stale.
- Each deck opens with a retrieval hook naming the earlier lesson on the
  same strand, so the staircase teaches itself (e.g. "The bait message" at
  11 recalls "Spot the trick" from 8).
- Titles are the dedupe key: every insert is guarded by
  `where not exists (... title = ...)`, the house idempotency pattern from
  migration 076.
- Applied live in three chunks through MCP (Foundation+Builder, Explorer,
  Shaper+Independent); the single file in the repo is the record.

## 1 September 2026: lesson video re-render, the proper cure shipped

Justin: "Re render." The five damaged windows across lessons 1.10, 1.2 and
1.7 (held title frames and frozen stretches) were replaced with real new
picture. Decisions made:

- The narration is the source of truth: each window was transcribed with
  faster whisper and the new illustration depicts what is being said, so
  the picture finally matches the words (DiGi's snuggle up intro, the
  puzzle pieces, the word permission, the pop-up game, the kind message
  close, the go and check photo rule).
- Style continuity by reference, not description: clean frames pulled from
  beside each window were fed to the image model as style and character
  references, keeping DiGi and the children on model without guessing.
- One still per beat with a slow Ken Burns zoom, not AI video generation:
  gentle motion in the house spirit, no risk of off-model animation, any
  window length fillable.
- Audio untouched, provably: the audio stream md5 in every fixed file is
  identical to its original.
- Bonus fix: both 1.2 files carried inflated container durations (video
  timestamps running 14s past the audio); the rebuilt files match the
  database durations exactly.
- DB repoint with no migration, same as the 18 August repair: the segment
  rows carry no URLs in any seed file. Record in
  content/packs/2026-09-01-lesson-video-rerender/production.md.

## 1 September 2026: the habit loop, part one (rotation, one tick, top five)

Justin's Duolingo brief. Decisions in the first build slice:

- The day rotation runs on COMPLETED days, never calendar days: a parent who
  opens the app twice a week walks the same road in order, no missed day
  pile up. Seven completed days make a lap: connect, lesson, connect, digi,
  connect, lesson, passport. Derived (count of completed daily_sessions
  before today), nothing written on read; migration 237 stamps the focus on
  the completed row as the record.
- ONE main tick decides the day. The engine marks a single lead rung, it
  walks to the front of the road, and the rest sit under an "also today, if
  you fancy it" seam. The minutes budget survives as the invitation to do
  more, never the gate.
- Passport day completes on a LOOK, not a finish: arriving on the pathway
  from the road records the day (passportday=1 link + MarkPassportLook),
  because checking progress weekly is the ask, not clearing every section.
- The top five scripts share one engine with the single pick
  (gatherSignals extracted in lib/pathway/recommend.ts), so position one IS
  the road's card and the never speak first guard covers all five. Free
  users keep a free lead card; the shelf shows locks honestly.
- /api/daily/day-done records non deck completions idempotently; the deck's
  own route keeps its meaning.

## 1 September 2026: the habit loop, part two (day close and full screen readers)

- The day's close is a four beat walk (done, balance, quests, see you
  tomorrow), opened once per day by the visit that actually completed the
  day, through the popup queue. The balance beat quotes the healthy guide
  for THIS child's age, surfaces the settings sweep only when one is due,
  and always ends on the offline trade. The last beat names tomorrow's
  focus, which is the Duolingo hook: leave knowing the one thing next.
- The /api/daily/day-done response carries the close screen's facts
  (tomorrow's focus, the age guide), counted after the write so the number
  agrees with what the road will show in the morning.
- One shared TakeoverReader shell gives any page the Good Inside mobile
  treatment: CSS decides mobile versus desktop so server and client always
  paint the same, and a page's own back row steps aside via
  gc-takeover-hide. The script reader is the first user; moments
  (MomentCard) and lessons (SlidePlayer) already fill the screen.

## 1 September 2026: the habit loop, part three (DiGi decluttered, passport day lands)

- DiGi's welcome now sizes itself to the moment: the full hero with its
  instructions only when there is no conversation, one warm line when there
  is. Both of Justin's asks are honoured at once (August: always welcome;
  September: less clutter).
- The block after every settled answer shrinks from a butter card plus
  eyebrow plus three chips to at most two quiet chips that act on THIS
  answer (the scripts finder carrying the exact question, and the school
  chip only when relevant). The way back to today lives in the header,
  said once. The flag link stays.
- Passport day's link lands on #passport so the weekly check opens on the
  stamps, not the top of a long page.

## 1 September 2026: the habit loop, part four (the learning stream)

- surface_events (migration 238) is the loop's memory: shown, opened, read,
  completed, per child per London day, one thin uniform stream. Our tables,
  our rules, no third party analytics; every event feeds a decision the
  product makes for this family.
- One shown per pick per day, enforced by a unique index over
  coalesce(child_id), so impressions are facts about days, not visits.
- The first read ships with the write: the recommender demotes a script
  shown on three separate days and never opened (a smaller demotion than
  opened and abandoned), so the top five turns toward fresh choices instead
  of repeating an ignored one. Failing soft everywhere: a database without
  the table simply learns nothing yet.
- Writers: the scripts shelf (shown), the script reader (opened), moment
  and lesson completions and the day close (completed). Best effort by
  design; the page always wins over the ledger.

## 1 September 2026: lesson excellence, parts one and two

- Justin: characters seemed to be blocked out with text; lessons must match
  school lessons in a slightly reduced form; every question stored and fed
  into the stage final for the passport pass. Full plan in
  plans/week-of-2026-08-31-lesson-excellence-plan.md.
- The lesson intro's speech bubble never sits over the character again: it
  moved above the frame with a tail pointing down, the Duolingo register
  from the Mobbin references. The mascot is never covered, anywhere: browse
  tiles reserve the corner their art lives in, the passport stamp lost the
  label that sat on the Friend's feet, the watch tile play chip moved off
  the face, the player header label gives way before it crowds DiGi.
- lesson_question_answers (migration 239) keeps every question answered,
  from the lesson player in both apps and from both stage check surfaces.
  Append only, question stored as text (questions live in slides JSONB and
  carry no ids; text matching is how the pool already dedupes).
- The stage check is now retrieval practice by design: the server orders
  the pool missed first, never met next, already held last, and the run is
  the front of the pool. Pass rules untouched (4 of 5, never downgraded).
- Question depth and the full school arc (keywords, scenario, third
  question, recap, tryit) land per stage in migrations 240 to 244, claimed
  by PR 945.

## 1 September 2026: lesson excellence, the school arc across all five stages

- Migrations 240 to 244, applied live: every slide built lesson in the
  library (92 decks) now carries the full school shape. Keywords on the
  board after the objective, at least four choice questions with exactly
  one right answer (so the 70 percent pass forgives one miss instead of
  demanding perfection), a recap in three lines, a try it tonight, and the
  title slide naming its Planet Friend instead of a regex guessing one.
- Question depth: the library holds 368 choice questions, up from 169.
  Stage check pools roughly double everywhere, and every question now
  lands in lesson_question_answers when answered.
- Registers held per stage: Foundation plays, Builder builds judgement,
  Explorer names the machines, Shaper carries the heavy topics in Nova's
  steady voice (the safeguarding lines worded to UK guidance: never in
  trouble for telling, never pay, the fault is the pressurer's), and
  Independent hands over the wheel with Cosmo on AI, data and money.
- All additive: not one existing slide changed, so nothing a family has
  seen moves under them. Guarded on keywords so a reapply is a no op.
  The one deck with no objective and no DiGi close (the algorithm parent
  lesson) got a bespoke rebuild recorded in migration 242.
- gc_add_school_arc (migration 240) is the reusable splicer: character
  onto the title, keywords after the objective, extras before the close.

## 1 September 2026, evening: the two answer tells, killed

- Review of the day's lesson work found the loops clean and the decks
  strong, but the questions carried two tells a child learns in two
  lessons: the right answer was the longest option in 80 to 98 percent of
  questions per stage, and the player never shuffled, so it sat in the
  middle almost every time. Both fixed on PR 947.
- LessonPlayer deals a seeded option order per run: Back then Next keeps
  the order, Run it again redeals, the salt lands after mount so the
  server and first client render agree. Kid mode and projector inherit it.
- Migrations 245 to 249 rewrite the weakest distractor on 333 questions
  into a plausible misconception a child that age actually holds, each
  with its own marking feedback, because a good teacher marks the wrong
  answer too. Over long right answers trimmed, a second distractor
  extended where needed, so the right answer's length rank is spread:
  longest 20 to 30 percent per stage, shortest 24 to 43. Two questions
  the school arc had duplicated inside their own decks became fresh
  scenarios. Verified by SQL: one correct per question, every option with
  feedback, zero dashes.
- gc_swap_option_text(deck, fixes) is the reusable, idempotent text
  swapper: it matches on (question, old option text), so a reapply is a
  no op and a typo in a fix simply does nothing, which the audit catches.
- Rule from this: a question is not finished when the right answer is
  written. It is finished when the wrong answers could each be argued by
  a child of that age, and the lengths give nothing away.

## 1 September 2026, late evening: add a job, the Apple level picker

- Justin, with a screenshot of the Add a job tab on his phone: top visual
  UX like the best Mobbin examples, the best jobs for the child's age in
  order of most useful, super easy to add and send to the child's app,
  happy news style icons, matching the look of the child's app. What he
  had was a tag cloud of chips that wrapped three lines deep with the text
  turned up, one flat list of thirty for every age, and a two question
  wizard behind every tap.
- Mobbin, read that evening: Greenlight (own chore first, suggestions as
  rows), GoHenry (tinted icon tile left, value right), Finch (kind tabs,
  a plus per row, the added row turns green in place), Liven. The shape:
  rows, not chips. One tile, one title, one value, one plus.
- lib/quests/best-jobs.ts is the ranked library: twelve to fourteen jobs
  per stage in usefulness order, each with a one line why and a kind.
  Usefulness means what the job does for the family's day and the
  child's growing up, so the routine that removes the morning fight comes
  first, then screens in their place, then real help, then the growing up
  skills, with play in the mix because play still pays the top stars.
- components/quests/JobPicker.tsx is the picker, on the Add a job tab
  under the composer, which stays for typed jobs. One tap adds with the
  job's own repeat and the create route sends it to the child; the row
  turns sage with a tick and says Sent to Alfie's app, honestly, because
  the add now answers true or false. The repeat chips sit inline behind a
  tap on the row for anyone who wants weekends instead, no wizard.
- The tiles are the child app's rounded squares tinted from the stage
  palette by kind, and the header is the Planet Friend in the happy news
  ring, so what a parent adds looks like what the child sees.
- Rule from this: suggestions are rows with a fixed tile and a fixed
  button, never chips. Chips size to their words and fall apart the
  moment a parent turns their text up.

## 1 September 2026, late: Add a job is a ranked picker, not a chip cloud

- The Add a job tab lost its two rows of chips (used before, then thirty
  ideas with play first) for a picker built on the Mobbin shape Greenlight,
  GoHenry, Finch and Liven all share: own job first, then rows with an icon
  tile, a value and a plus each, the added row turning green in place.
  Chips size to their words, so on a phone with the text turned up they
  wrapped three lines deep. Rows hold their shape at any text size.
- `lib/quests/best-jobs.ts` holds twelve to fourteen jobs per stage in
  order of most useful at that age, each with a one line why and a kind.
  Usefulness means what the job does for the family's day and the child's
  growing up, not what it pays: routine first, screens in their place,
  real help, growing up skills, with play in the mix because play still
  pays the top stars on purpose. Titles reuse library wording so the
  board's dedupe still works.
- One tap adds with the job's own repeat and sends it to the child's app.
  The repeat chips sit inline behind a tap on the row for anyone who wants
  weekends instead. This reverses the July decision that routed every
  suggestion through the two question wizard: the template already knows
  its repeat, and Justin asked for super easy to add and send.
- The tiles are the child app's rounded squares with the stage pastels,
  and the stage's Planet Friend heads the list in the happy news ring, so
  what a parent adds looks like what the child sees. Emoji in tiles rather
  than a new icon set: consistent today, swappable later.
- `add` in ManageJobs answers true or false so a tick is only ever shown
  for a job that landed. The page carries 150px of bottom padding so the
  last row clears the tab bar and the Now button.

## 2 September 2026 — The child's printables are a newspaper, and the print button opens Safari when it has to

Justin, from Jonny's app: printables need a happy news type UI, easy to
select, most common first, simple, fun and luxury; check the print
button, the known issue on the web app; doing a printable must complete
one of the five things; back should go back to where the child came from
with a better close button, and quicker.

**The print button was silent inside the installed app.** Every print on
the child app called window.print(), and inside an installed iOS web app
that opens nothing at all: no dialog, no error. Decision: every print
goes through printOrOpen (lib/kid/print-anywhere). It prints in place
where the browser can, and where it cannot it opens the printable's own
print page (/k/token/print) in real Safari, which prints itself. The
builders pack their picks into the URL, because a Safari tab shares no
storage with the app that opened it. Detection is narrow, iOS and
installed, so desktop, Android and Safari keep the in place dialog.

**Printing ticks the five a day.** The tab's sheets sent "Finished the X
sheet" through the quest ask pipeline, and the builders told nobody, so
A printable never completed from the tab. Decision: printing anything
ticks the row (/api/kid/printable-step, tick only), and I finished it
goes through printable-done, which ticks and asks the grown up to
confirm the stars. Stars still wait for the confirm; the row does not.

**The look is our own.** The Happy Newspaper is the mood reference, as it
already is for the family social account: vibrant colour blocking,
smiley dots, sticker doodles, hand lettered warmth. We take the energy
and draw everything ourselves in SVG (components/kid/HappyNewsBits):
butter and ink, Nunito 900, the celebrate palette. Nothing copied.

**One tap opens one sheet.** The grid only says what each sheet is (the
paper, a star sticker, the title). Every button a sheet needs lives on
its own screen: one big Print it, then I finished it, then No printer.
Eight sheets first, the rest behind one tap. Planner first (the best
three, 12 August), then lists, colouring, hunts, dares, learn; a yes from
home first of all; confirmed sheets last, ticked.

**Back goes through history.** KidBackLink says Back (or shows the round
close cross) and uses router.back() whenever one of our screens is behind
it, which lands on the tab the child left, from the router cache, in a
frame. The push to the home page is only the fallback for a cold open.

## 2 September 2026 — The tab bar is sticky, because fixed drifts under body zoom on an iPhone

Justin, with a screenshot of the dashboard road on his iPhone: "when you
scroll on Dashboard the tabs at bottom stay in middle but should always
be at bottom of screen." The NOW button in the same picture had drifted
by exactly the same amount, which rules out the bar and points at fixed
positioning itself. body carries zoom 1.07, and iPhone Safari places a
fixed element inside a zoomed ancestor against the unzoomed viewport
while laying it out in zoomed coordinates, so the error grows with the
scroll. The home page is the longest page in the app, which is why it
showed there first and read as "a little" elsewhere.

Decision, revised the same morning after a second screenshot from the
check in page ("tabs should be fixed to bottom not floating"): the cure
is not to zoom the ancestors of fixed things. While the dashboard layout
is mounted, body is unzoomed and every direct child of body (the
portalled sheets and pills) and of the shell (header, main, the bars,
the tab bar) is zoomed on itself instead. Same sizes everywhere, and the
tab bar, the setup bar, the install prompt and the NOW sheet sit under no
zoomed ancestor at all, so fixed means fixed. The NOW button is portalled
into the bar and sits on its top edge. The compositor hints (translateZ,
will change) went with the fault they were compensating for. Fixed things
inside main (toasts, page level bars, sheets) still have main as a zoomed
ancestor and are left alone until one is seen, because most open near the
top of a page where the drift is nothing. The child app keeps body zoom
for now.

## 2 September 2026 — The first check in asks two things per child, and keeps what was chosen at sign up

Justin, from his own first check in with three children: "I'm not sure
where the first options are coming from? When we signed up I only
selected 2. Maybe we should have 2 each basic standard questions to start
to keep it easy, then we add based on parents' moments etc from then on
each day... just don't want too many on first check in until we know
issues." And: "when we do check in for first time, when we do each child
can they have a green tick go by their name at top indicating done."

**Where they came from.** Every child got the same four stock worries.
Two faults. Sign up saved only the FIRST chosen worry, so a parent who
picked two lost the second. And the primary child's sign up seeding was
guarded on "no worries for this family yet", which setup's add a child
step makes false before the first check in ever opens, so the primary
fell through to the stock four too. His account showed it exactly: Alma,
named at sign up with a phone worry chosen, got the four at 09:15.

**Decisions.** Two starters, not four: Bedtime screens and Will not put
it down. Every child added later gets those two. The primary child gets
what was chosen at sign up, topped up from the starters to two, so a
parent who chose two sees exactly those two. Sign up now keeps the whole
chosen list. The seeding is per child, not per family, whatever order
the children arrived in. Adding worries from then on was already built
and is untouched: DiGi, Right now, the wellbeing check in and moment
feedback raise a worry for the child they were about, a worry scored top
rests, and the monthly email reports what worked.

**The tick.** lib/checkin/done-today decides which children have checked
in today (every live, non resting worry checked today, and at least
one), the dashboard layout hands the set to the child rail inside its
own Suspense, and the switcher pill wears a small green tick on the
initial. One place decides, so the rail and the check in cannot disagree.
