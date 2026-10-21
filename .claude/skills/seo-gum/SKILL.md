---
name: seo-gum
description: The weekly search pass for guidedchildhood.com and schools.guidedchildhood.com, using gum (gumcli.dev) to read Google Search Console. Use when Justin says "gum", "SEO", "search console", "what are people searching", "how are we ranking", "submit the sitemap", "is this page indexed", or commits a content/seo/pull file, and on Mondays beside research-radar. Turns the numbers into a short list of page leads, each mapped to a real product surface, and feeds the Phase 4 roadmap box for public search pages. Never writes a page for a query with no proof path in the product. Never deletes anything in Search Console and never uses the Indexing API.
---

# SEO with gum, the weekly pass

The plan and the why: `plans/2026-10-21-gum-seo-plan.md`. The code:
`scripts/seo-gum.mjs` (`npm run seo`). Read THE-STORY.md sections 1, 2 and 9
first, per CLAUDE.md: search is channel five, and every search page ends at
the stage check (`/starter-pack`).

## What runs where

| Step | Where | Needs gum |
| --- | --- | --- |
| `npm run seo -- doctor` | Justin's Mac | yes |
| `npm run seo -- pull` | Justin's Mac, Mondays | yes |
| `npm run seo -- report` | any session, cloud included | no |
| `npm run seo -- inspect` | Justin's Mac, once a month | yes |
| `npm run seo -- submit --allow-write` | Justin's Mac, after a sitemap change | yes |

Search Console in gum is bring your own OAuth, a browser consent on the
machine running gum. A cloud session cannot finish that login, so never ask
Justin for a token or a client secret in chat. The pull file is the handover:
he commits `content/seo/pull-<date>.json`, and the session reads it.

## One time setup on the Mac (about 15 minutes, Justin)

1. Install: `brew tap ehmo/tap && brew install ehmo/tap/gum`. Plain
   `brew install gum` is a different tool (charmbracelet's), so the tap matters.
2. Google Cloud console: a project (any name), enable **Google Search Console
   API**, set up the OAuth consent screen with his Google account as a test
   user, then create an OAuth client of type **Desktop app**.
3. Hand gum the client, without the secret touching the shell history:
   `pbpaste | gum auth use-oauth-client --client-id <client id> --secret-stdin`
   (copy the secret first).
4. `gum login --service searchconsole`, approve in the browser.
5. In the repo: `npm run seo -- doctor`. It lists the properties the login
   can read and marks ours ok or MISSING. A Domain property
   (`sc-domain:guidedchildhood.com`) covers both apps; if he has URL prefix
   properties instead, change `siteUrl` in `content/seo/config.json`.
6. `npm run seo -- submit --allow-write` once, so Google has the corrected
   sitemap (five pages were missing until PR 1376).

Optional, for search volumes before our own impressions arrive: a Google Ads
account plus a developer token (`gum auth use-ads-developer-token`), then
`gum login --service googleads` and
`gum read googleads.keywordPlanIdeas.generateKeywordIdeas --args '{"customerId":"<id>","keywords":["when should my child get a phone"],"geoTargetConstants":["2826"],"language":"1000"}'`
(2826 is the United Kingdom, 1000 is English).

## The weekly pass

1. `npm run seo -- report` on the newest pull. It writes
   `content/seo/report-<date>.md` with six sections per app: striking
   distance (position 8 to 20), seen but not clicked, new queries, pages
   rising, pages falling, sitemap pages never shown.
2. **Every row is a lead, not a task.** For each striking distance or new
   query, ask the research-radar question: which real surface proves the
   answer? A script in the scripts table, a device guide
   (`lib/content/device-issues.ts`), a lesson, the passport, the stage check.
   No surface, no page; the query goes in the parked list at the foot of the
   report with the reason.
3. **Seen but not clicked** is a title and description fix on a page that
   already exists. Draft the new `metadata` in Justin's voice (research/01,
   `npm run ai-tells`, no dashes). Small, ship it in the same PR.
4. **Striking distance** with a proof path becomes a page brief for the
   Phase 4 box "Public SEO pages generated from device guides and script
   problems": the query in the parent's words, the surface that proves it,
   the one script or tip shown free on the page, and the stage check at the
   foot. One brief a week, the highest impressions first. The forty pages
   get built in the order the data gives, not all at once.
5. **Never shown** for three weeks running means `npm run seo -- inspect` on
   the Mac. Not indexed, or Google chose a different canonical, is a bug:
   fix it in code (metadata, canonical, internal link), not with a request.
6. Report back to Justin in the CLAUDE.md three line format: what moved,
   the one lead worth building, what he needs to do (usually: run the pull).

## Rules

- Read freely. The only write is `submit`, and only with `--allow-write`.
- Never `sites.delete`, `sitemaps.delete` or any `gum destructive` call.
- Never the Indexing API. Google limits it to job postings and livestreams.
- A new marketing page goes in `app/sitemap.ts`, or in the exclusions in
  `scripts/check-sitemap-coverage.mjs` with its reason. `npm run
  sitemap-guard` enforces it on every pull request.
- Query data is aggregate and anonymous; the pull files are fine in git.
  Never commit gum's own config or credential folders.
