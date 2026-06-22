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
