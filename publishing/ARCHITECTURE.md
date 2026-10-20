# The Guided Planet: the audit, and the decisions

Written 13 October 2026, when the engine was built. Phase 1 of the build brief.

## What the audit found

| Asked | Found |
| --- | --- |
| Architecture | Next.js 16 App Router, React 19, TypeScript; parent app at the root, `schools/` its own app, `shared/` the common package. Node scripts run TypeScript with `--experimental-strip-types` and `scripts/lib/ts-resolve.mjs`. |
| Deployment | Vercel (`vercel.json`, 39 crons, `withHeartbeat`, `CRON_SECRET`); GitHub Actions for checks (`wiring.yml`) and a Monday Python job. |
| Brand assets and tokens | `shared/tokens.css` (wins over everything), `brand/GDC_SOCIAL_VISUAL_SYSTEM.md`, fonts in `app/fonts` (Nunito variable, IBM Plex Mono 400 to 700). `docs/05` and `docs/07`, named in CLAUDE.md, do not exist. |
| Planet Friends and Bloop | `digi-squad/README.md` (behaviour), `public/digi-squad/friends/*.png` (512px cutouts), fifteen 1024px mood stills on the CDN (`shared/schools-curriculum.ts`), DiGi as `public/digi-squad/DiGi-star.svg`. Bloop: stage 2, ages 8 to 10, green, always mid build and one piece short. |
| Supabase | `createClient` (`lib/supabase/server.ts`), `sessionUser`, `createAdminClient`; the founder gate is `FOUNDER_NOTIFY_EMAIL` compared on every admin page and route. No storage buckets in use. 376 migrations. |
| Research workflows | The knowledge refresh cron (`expert_knowledge_candidates`, approved on `/dashboard/insights`) is the human gate pattern followed here. |
| Google Drive | Connector only, in skills. No API code. |
| Mailchimp | No code. Resend is the house email (`lib/email`, one email a week floor). |
| Higgsfield | Connector only. Plus plan, 1,107 credits on 13 October 2026. Reference elements exist for Justin and Cosmo; none for Bloop. House rule: never regenerate a character. |
| Existing paper work | The Planet Post (PR 1284, 13 October): a four page free Happy News printable, drawn in React, printed from `app/print-free`. A different product; its lessons are reused here, its look is not. |

## The decisions, and the one reason for each

1. **A self contained module in `publishing/`**, not a Next route. The routine
   runs on a GitHub runner with no app server; the dashboard imports only the
   pure parts (`engine/workflow.ts`, `engine/hash.ts`, `engine/store-supabase.ts`).
   Nothing in the parent, child or schools apps changes behaviour.
2. **HTML and CSS printed by Chromium (Playwright), fixed page boxes, not
   Paged.js.** A newspaper page is designed, not poured. Fixed boxes let the
   validator measure every frame; Chromium keeps text as text, embeds fonts and
   keeps vector art vector; Playwright is already in the repo. Paged.js solves
   long text flowing across pages, which this paper never does.
3. **The issue is one JSON file; layouts are templates.** A second edition is a
   second file (Issue 002 proves it).
4. **Characters are composited, never generated.** Higgsfield paints
   environments only; the approved files are hash checked at every render.
5. **Every art slot has a vector default** drawn in code, so no generation can
   hold a page back, and Issue 001 is complete at zero credits.
6. **Two stores, one interface.** Supabase (migration 377) for the dashboard,
   a file store for local runs and tests, so every guard is tested against the
   code that runs.
7. **Approvals bind by hash.** Approval one binds the story selection, approval
   two the content and the PDF; publication refuses a changed file.
8. **Our code verifies research, not the model.** It fetches each source and
   looks for the quoted words; a refusing site stays unverified for a person.
9. **Publishing is idempotent and mostly prepared, not posted.** One release per
   issue, channel and PDF hash. The website is a pull request Justin merges;
   Mailchimp is a draft; social is for Justin to post, matching the house rule
   that the skills never post.
10. **The animated cover is made in code** from the real cover at zero credits;
    Higgsfield video is an option behind the budget.
11. **Research and drafting models are settings** (`PLANET_RESEARCH_MODEL`,
    `PLANET_DRAFT_MODEL`, default `claude-opus-5-5`), separate from `DIGI_MODEL`.

## What is not built, honestly

- The research and drafting steps are written and unit tested around the API,
  but have not been run against the live Anthropic API from here (no key in the
  session). Issue 001 was researched by Claude Code agents with web tools and
  verified by an adversarial citation check instead.
- The dashboard has not run against a real database (migration 377 is not
  applied). Its fixture at `/dev/planet-desk` was checked on a 390px phone and
  a 1280px desktop.
- QR codes are generated from the URL and the payload is checked, but not
  optically decoded (no decoder in the repo). Approval two asks Justin to scan
  them with his phone.
- No Higgsfield credits were spent. The brief for Issue 001 is ready.
