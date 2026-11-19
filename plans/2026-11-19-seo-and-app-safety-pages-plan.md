# SEO foundations and the app safety pages, plan before build

Justin, 19 November 2026: make Google and AI search the main way parents find
us. Four phases, one at a time, each stopping for a preview check. Nothing is
built until he approves this plan.

## What exists today (read from main, 19 November 2026)

- **Framework.** Next.js 16.2 App Router, React 19, TypeScript, Tailwind 4,
  on Vercel (region lhr1). Public pages sit in `app/(marketing)`, the home
  page is `app/page.tsx`. The schools app is its own Next app in `schools/`
  on schools.guidedchildhood.com, with its own sitemap.
- **Routing.** Folder based. `next.config.ts` redirects exactly `/schools`
  (not its sub paths) and `/educator/*` to the schools site, and rewrites
  `/ingest` to PostHog EU. `middleware.ts` 404s `/ref-` pages in production.
- **Origin.** One constant, `SITE_URL = https://www.guidedchildhood.com`, in
  `lib/config/site.ts`.
- **Sitemap and robots.** `app/sitemap.ts` (dynamic, reads the guides and the
  free tasters) and `app/robots.ts` (allow all, disallow the app routes). No
  named AI crawler rules, no llms.txt. `npm run sitemap-guard` fails when a
  marketing page is in neither the sitemap nor its exclusions list. Every
  entry's lastModified is the build time.
- **Metadata.** Root layout sets metadataBase, a title template, a default
  description, one site wide Open Graph and Twitter card, and the Pinterest
  verification tag. Most pages set their own title and description, but only
  6 of 33 set a canonical, and none set their own Open Graph, so every page
  shares the home page's share card title. `/starter-pack`, `/join`,
  `/get-started` and `/digi-squad/lesson` set no metadata at all.
- **Structured data.** Organization JSON-LD on the home page only (not site
  wide). One more block on the guide pages. No FAQPage, no
  SoftwareApplication. No Google verification tag.
- **Analytics.** PostHog (EU, cookieless, `persistence: memory`), only on an
  allowlist of public paths, only named events, URLs cleaned to path plus
  `utm_*` and `ref` (`lib/analytics/posthog-policy.ts`, tested by
  `npm run posthog-test`). Loads only when `NEXT_PUBLIC_POSTHOG_KEY` is set.
  External referrers are kept as the bare host, so nothing tags AI sources yet.
  Search Console is meant to be read by gum on Justin's Mac (seo-gum skill),
  but `content/seo/` holds no pull yet, so it looks unset up.
- **Rendering.** Every public page is a server component except the stage
  check (`/starter-pack`) and the old lesson demo, which are client pages.
- **Lint.** No lint script and no ESLint in the repo. "Lint" in Phase 4 means
  `tsc --noEmit` plus the house guards.

## The conflict to settle first

The brief says the free tools lead into "the paid Digital Health Report at
/digitalwellbeing". In the repo:

- `/digitalwellbeing` is a page describing a **free** health check whose
  buttons go to `wellbeing.guidedchildhood.com/signup`, a separate site that
  is not in this repo.
- On 24 September 2026 every Health Checker and Digital Health Report call to
  action was taken off the site (`plans/2026-09-30-control-room.md`), and the
  product facts say it is "not the main line", with no price to quote.
- THE-STORY and CLAUDE.md: every call to action routes to the stage check
  (`/starter-pack`), and search pages end there.
- In this product "starter pack" already names the stage check page, so "an
  email capture for a free starter pack" needs a different name. The two
  captures that exist are the topic email course (`/api/course`) and the
  printable magnet (`/api/magnet`).

Recommendation: the mini check result leads to the stage check (free, in this
repo, counted in PostHog, the door to the paid app), the Digital Health Report
is a secondary link, and the email capture reuses the topic email course for
that app's topic. Justin decides.

## Phase 1, SEO foundations

1. `lib/seo/meta.ts`: one helper that returns title, description, canonical,
   Open Graph and Twitter for a path. Applied to every public page. A layout
   gives the four client pages their metadata. Pages with no search intent
   (thanks, tell us, home codes, from school token pages, Etsy bonus,
   investor pages, the Muse connector page) get `noindex`.
2. `robots.ts`: named groups for GPTBot, OAI-SearchBot, ChatGPT-User,
   ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User,
   Google-Extended, Applebot-Extended and Bingbot, each repeating the private
   path disallows (a named group replaces `*` for that bot, so it must).
3. Sitemap: stays dynamic; lastModified comes from each page's own date, not
   the build time.
4. JSON-LD: Organization and WebSite in the root layout; FAQPage wherever a
   page shows FAQs; SoftwareApplication on `/digitalwellbeing` (offer price
   only if Justin gives one).
5. Google verification: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel feeds
   `verification.google` in the root layout; no tag when empty. DNS
   verification is still the recommended route.
6. `/llms.txt`: a static route built from the same data as the sitemap, so it
   never falls behind.
7. AI search tagging: `lib/analytics/ai-source.ts` reads the referrer host and
   `utm_source` (ChatGPT adds `utm_source=chatgpt.com`) and names chatgpt,
   perplexity, gemini, claude or copilot. Registered as an `ai_source`
   property on every event of the visit, plus one `ai_referral` event. Added
   to the policy allowlist and its test.
8. Core Web Vitals pass: plain `img` to `next/image` where it matters, check
   the stage check's first paint is in the server HTML, report anything left.

## Phase 2, the app safety pages

- **Data.** `lib/app-safety/apps.ts`, typed, one entry per app (the 20
  named): minimum age, PEGI and App Store and Google Play ratings, risks,
  controls, setup steps, similar apps, last checked date. Every fact carries
  its source URL; anything unconfirmed carries `TODO-JP-REVIEW`. Researched
  from the platforms' own terms and help centres, pegi.info and the store
  listings, then checked against `device_guides` (the in app guides) and
  `lib/content/device-issues.ts` so the app and the pages agree.
- **Routes.** Next cannot put a parameter inside a segment (`is-[app]-safe`),
  so one `app/(marketing)/[slug]/page.tsx` with `generateStaticParams` builds
  exactly `is-<app>-safe` and `is-<app>-safe-for-<age>-year-old` (ages 6 to
  15) and `dynamicParams = false`, so every other address still 404s. 20 app
  pages plus 200 age pages, all static at build.
- **Different by age.** Three sources of difference, not word swaps: an age
  block per year (school year, the child's stage from `lib/content/stages`,
  what changes developmentally), the gap to the app's minimum age (well under,
  a year or two under, at the line, over), and app notes for the ages that
  matter (13 for most social apps, the YouTube Kids upper age).
- **Never allow or deny.** The two sentence direct answer gives the official
  age with its source and then the pathway for this age, never "yes, safe" or
  "no". No page promises "safe" in its copy.
- **The mini check.** One small client island; the rest is server HTML. Age,
  how much they use it, worries. A pure function scores each TRUST letter
  (Timing, Relationships, Upstream design, Sleep, Transparency) as in place,
  worth working on, or start here, with the next step for each. No overall
  score, per the evidence or silence rule. Nothing stored, no login. One
  anonymous `mini_check_done` event with the app and nothing else.
  `lib/app-safety/trust.ts` defines the five letters and maps them onto the
  existing trust framework (`digi/07-trust-framework.md`).
- **Each page.** Direct answer, the check, the controls guide, FAQs with
  FAQPage schema, the call to action and email capture, links to nearby ages
  and similar apps.
- **Hub.** `/app-safety-guide`, every app and its age pages.
- **Copy.** Calm, sourced, British English, no dashes (`npm run ai-tells`).

## Phase 3, the school share kit

`/schools/parent-pack` on the main site (the redirect only catches bare
`/schools`). Copyable blurb, a QR code drawn on the server with the existing
`qrcode` package, links to the free tools. `?school=Name` shows "Shared by
Name" and every link and the QR carry `utm_source=school`,
`utm_medium=newsletter`, `utm_campaign=<school slug>`, which PostHog already
keeps. The name is cleaned and length capped. Canonical is the plain page.
Linked from the schools hub.

## Phase 4, checks

`npm install`, `next build`, `tsc --noEmit`, sitemap guard, ai-tells,
posthog test, token and hex guards, Playwright screenshots on phone and
desktop. Then every new URL and every TODO-JP-REVIEW item.

## Handover

`SEO-SETUP-GUIDE.md` at the repo root, as briefed.
