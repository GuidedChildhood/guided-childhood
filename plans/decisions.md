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

## 2026-07-02 — Algorithm literacy Unit 3.5 written up in full

**Unit 3.5 (Audit your own feed) is now a full lesson plan:** Lesson 8 in part-09-curriculum/lesson-plans.md, the KS3 capstone. It was the only unit the parent workshops already promised a mirror of but which existed only as a footnote pointing at Worksheet D. The KS4 kinder-feed lesson renumbered from 8 to 9.

**In-class audits run on invented personas, never real feeds:** the new Mystery Feed game (game 6 in games-and-experiments.md) packs twelve feed cards, a goal card, and a sealed history card per persona. Students deduce the signals, sort serving vs holding, and prescribe the three reset actions. A pupil's own audit lives only on the private take-home page of the new Worksheet G, never collected, never assessed. This is the safe pattern under the under-16 ban world: never assume access, never imply circumvention.

**Reset action wording is now locked across home and school:** clear the bad signals, search and finish good content, follow variety. Exactly as the parent workshops phrase it and as the Year 9 outcomes ladder tests it. Do not paraphrase these three in future content.

**Positive capability layer added across the part 9 curriculum (Justin request):** four additions, all platform-neutral and invented-example only. (1) Co-viewing is now a taught technique with five locked rules: they hold the device, your feed first, curious questions, amnesty, short and regular. Lives in Workshop 2 slide 4 and the Worksheet G home page. (2) Success stories are a stance: new fourth rule in the part 9 README ("Capability, not just defence"), one Mystery Feed pack is always a success persona, Worksheet G Q6 asks for the upside. (3) Future AI skills framing: new README section "From steering feeds to steering AI" plus a closing beat in Lesson 8, the transfer from steering feeds to briefing AI assistants and agents, named out loud every lesson. (4) AI entrepreneurs framing kept generic: young builders who trained a feed into a tutor then built with AI tools, named as possible, never promised as easy, no real names ever (neutrality rule, dating risk).
