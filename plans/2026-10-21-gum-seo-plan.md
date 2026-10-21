# SEO with gum: the plan

**Asked, 21 October 2026.** Justin, with a photo of gumcli.dev on the TV:
"Build this for my apps, gum for seo plan."

**What gum is.** An open source Go binary (github.com/ehmo/gum, MIT, v2.3.1)
that gives an agent or a terminal one controlled path into Google APIs. One
local credential, a searchable catalogue of operations, and every call
dispatched by risk class: `gum read`, `gum write --allow-write`, and
`gum destructive`, which needs a confirmation token. Credentials stay on the
machine that logged in, never in a prompt.

**The apps it is for.** The two properties we own that can rank:

| Property | What it is | Sitemap |
| --- | --- | --- |
| `https://www.guidedchildhood.com` | Parent app and the marketing pages, one codebase | `app/sitemap.ts` |
| `https://schools.guidedchildhood.com` | The schools app, its open catalogue | `schools/app/sitemap.ts` |

## Where SEO sits in the story

Search pages are channel five of six in THE-STORY.md (after LinkedIn, parent
groups, the share loop and paid creators). The money rule applies: never pay
to find out if something works. gum is free, so the first job is not to write
pages but to **measure** what Google already sends us, and only then build the
roadmap box "Public SEO pages generated from device guides and script
problems" in the order the data says. Every search page still ends at the
stage check (`/starter-pack`), and every claim on it has a proof path in the
product: a real script, a real device guide, a real lesson.

## What gum can do for us (checked against the v2.3.1 catalogue)

| Job | gum operation | Risk |
| --- | --- | --- |
| Which queries and pages get impressions, clicks, CTR, position | `searchconsole.searchanalytics.query` | read |
| Is a URL indexed, which canonical Google chose, mobile usability | `searchconsole.urlInspection.index.inspect` | read |
| List and submit sitemaps | `searchconsole.sitemaps.list`, `searchconsole.sitemaps.submit` | read, write |
| Verified properties | `searchconsole.sites.list` | read |
| Search volume for seed phrases (needs a Google Ads account and developer token) | `googleads.keywordPlanIdeas.generateKeywordIdeas` | read |

What gum does **not** cover: Google Analytics 4 and PageSpeed. Not needed for
this plan; Vercel already reports Core Web Vitals.

What we will **not** use: the Indexing API. Google limits it to job postings
and livestream pages, and using it for ordinary pages is against their terms.
Also never `sites.delete` or `sitemaps.delete`; the skill says so.

## The build (this PR)

1. **`npm run seo`** (`scripts/seo-gum.mjs`), a thin wrapper over gum with
   five subcommands:
   - `doctor` checks gum is installed and logged in, and lists properties.
   - `pull` takes the last 28 days and the 28 before, by query and by page,
     for both properties, and writes one dated JSON file to `content/seo/`.
     Read only.
   - `report` turns the newest pull into `content/seo/report-<date>.md`:
     striking distance queries (position 8 to 20), CTR gaps (page one but a
     low click rate), rising and falling pages, and sitemap pages Google has
     not shown once. Needs no gum, so a cloud session can run it on a pull
     Justin committed.
   - `inspect` runs URL Inspection on every sitemap URL (read only).
   - `submit` resubmits both sitemaps (the one write, behind `--allow-write`).
2. **`.claude/skills/seo-gum/`**, the weekly pass: run the report, map each
   opportunity to a real product surface through the same proof path rule as
   research-radar, and hand the page ideas to the roadmap box. It never
   writes a page for a query with no proof path.
3. **Sitemap fix, found while building.** `/evidence`, `/five-questions`,
   `/free` and `/passport` are public, indexable pages that were missing from
   `app/sitemap.ts`, so Google was only finding them by links. Added, plus
   `npm run sitemap-guard`, which fails if a public marketing page is neither
   in the sitemap nor on its list of deliberate exclusions.

## Week by week

- **Week 1 (Justin, once, about 15 minutes):** install gum on the Mac, make
  the OAuth client, `gum login --service searchconsole`, then
  `npm run seo -- doctor` and `npm run seo -- submit --allow-write`. Steps are
  in the skill.
- **Week 1 onward, Mondays:** `npm run seo -- pull` on the Mac, commit the
  file, and the Monday session runs `report` and the skill beside
  research-radar.
- **Week 3:** first `inspect` pass once Google has recrawled; fix anything not
  indexed or with the wrong canonical.
- **Week 4:** first search page brief from the report, the highest striking
  distance query that maps to a script or device guide. The 40 page box is
  built in the order the data gives, not all at once.
- **Optional, any time:** Google Ads keyword ideas, if Justin wants volumes
  before the first impressions arrive. Needs an Ads account and developer
  token; the skill has the two commands.

## Why the pull runs on the Mac, not in the cloud

Search Console operations in gum are bring your own OAuth: a browser consent
on the machine that runs gum. A cloud session cannot complete that loopback
login, and a service account is not accepted for these operations. So the
credential lives on Justin's Mac and only the numbers reach the repo, as one
small JSON file a week. Query data is aggregate and anonymous, safe to commit.

## What Justin needs to do

1. Confirm both properties are verified in Search Console (a Domain property
   `sc-domain:guidedchildhood.com` covers both apps in one).
2. Run the one time setup in `.claude/skills/seo-gum/SKILL.md`.
3. Commit the first pull, so the first report can run.
