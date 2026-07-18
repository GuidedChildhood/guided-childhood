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
