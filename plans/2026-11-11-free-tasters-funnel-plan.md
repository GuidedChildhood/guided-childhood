# The free tasters funnel (11 November 2026)

Justin, 11 November: "the email funnel that gives our printables away for free,
lead magnets set up with all printables available, we promised Saturdays for
Guided". His ruling of 9 November: **tasters free, full on Etsy**. A follower
gets two or three pages of a pack for their email; the full pack stays paid on
Etsy (and free inside the app, as every Etsy pack has been since 6 November).
Never a full paid pack given away.

## What exists (checked on origin/main e351897df)

- `lib/magnets/registry.ts`, `components/marketing/MagnetGate.tsx`,
  `app/api/magnet/route.ts`: the gate saves to `starter_leads`
  (`source = magnet:<slug>`) and sends `magnetEmail` through Resend
  (`kind: 'transactional'`, so the one a week floor does not hold it).
- Free pages: `/free/planet-post`, `/free/guided-times`, `/five-questions`,
  `/evidence`; the `/free` index lists the first two.
- Attribution: `shared/utm.ts` (slug only, nothing about the person),
  `/v/<code>` sets a UTM cookie and always lands on `/starter-pack`.
- The lead programme in `app/api/email/cron/route.ts`: day 1 nurture, teasers
  from day 3, all under the six day floor in `sendEmail`.
- The two PRs the brief names ("Let /v/ source links point at any free page",
  "Stop paid printable PDFs downloading for free") do not exist yet, open or
  closed, and no session is running them. So this PR does the attribution
  itself, through the page and the body, and leaves `/v/` and the public paid
  PDFs alone for their own tasks.

## What this builds

1. **One source of truth**: `content/printables/free-tasters.json`. Per
   taster: slug, title, ages, url, status, plus the build facts (source PDF,
   pages, Etsy listing, blurb, page notes). The Saturday engine reads slug,
   title, ages, url and status; the site and the build read the rest.
2. **The taster PDFs**: `scripts/build-tasters.mjs` (pdf-lib) copies the chosen
   pages from the A4 product, stamps a band on every page, "Free taster · the
   full pack is on Etsy" with the listing link (or the /free link when there is
   no listing yet), and renders page previews with pdftoppm. Out:
   `public/printables/free/tasters/<slug>-taster-a4.pdf` and `-p1.png` to
   `-p3.png`. Default pages 1 to 3 (cover, the grown ups guide, the first
   activity); the Passport takes Pebble's stage page (the brief's own taster)
   and the Countdown takes the tree and doors 1 to 6, because its page 3 lists
   all 24 activities.
3. **`/free/[slug]`**: one template in the `/free/planet-post` pattern (pages
   shown ungated, `MagnetGate` at the download, the stage check after, the
   Etsy link). The existing static pages keep their own routes.
4. **Attribution**: `MagnetGate` sends the page's `src` and `utm_*` in the POST
   body (never a URL carrying anything about the person); the API falls back to
   the `/v/` UTM cookie. Migration 392 adds `free_download_events` (one row per
   claim: slug, src, the four UTMs, new lead or not, `lead_id` set null on
   erasure) and `starter_leads.taster_slug` and `taster_at` for the nurture.
5. **The emails**: email 1 is the taster at once (`magnetEmail`, transactional).
   Email 2, day 1: the free stage check. Email 3, day 7: the full pack on Etsy,
   or free in the app, and the membership. Days 0, 1 and 7, which is the only
   way three emails fit seven days under the six day floor. Keys in
   `lead_email_log`, run before the generic nurture so a taster lead is not
   sent both day 1 emails; the day 1 send stamps `nurtured_at`.
6. **`/free` index** lists every taster from the JSON, newspapers first.

## Out of scope, named

- The 12 single listings being prepared in `ETSY/etsy-shop-assets/new-listings`
  (car bingo, feelings cards and the rest): mostly one or two pages cut from a
  pack, so a taster would be the whole product, and that work is in flight in
  another worktree.
- Bundles (the whole system, the Christmas phone bundle): not free items.
- The Starter Pack (free in full by Justin's 5 Nov ruling) and the Road to 16
  guide (a Passport reward): they already have their own pages.
- The Family Technology Covenant: one page, no ages, overlaps the Family Phone
  Agreement.

## Tests

`npm run build`, the unit tests, every guard in `wiring.yml`, `npm run
ai-tells` on the copy, and each `/free/<slug>` rendered and captured in local
dev on phone and desktop with Resend unset, so no email reaches anyone.
