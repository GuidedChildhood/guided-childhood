# The star chart on both phones: print it anywhere, enter the week for stars

## Context

Justin, 10 August 2026, from Teo's printables tab: "Where is the star chart on
child's app, this is a key printable, plus parents should be able to enter the
charts results on their app end of week to give stars if not done on child's
phone."

What exists today, and the two gaps:

- The proper weekly star chart lives ONLY on the parent dashboard: the builder
  at /dashboard/printables/star-chart reads the family's real active jobs
  (family_quests), lets the parent type their own, and prints a two page sheet
  (the chart table plus cut out gold stars) via window.print. It records each
  print in star_chart_prints with the week it was for (migrations 117, 170).
  The child's printables tab has only the old static "Earn Your Screen Time"
  sheet buried under the Dares filter chip. **Gap 1: the child cannot see or
  print the real family chart.**
- A half feature already banks paper stars: FridgeChartLog on
  /dashboard/printables posts one total to /api/quests/fridge-week, which
  chunks rows into star_bonuses (the ledger lib/quests/bank.ts already counts
  as earned). But it names no week, so it cannot dedupe: logging twice doubles
  the stars, entering Monday morning attributes last week's chart to this
  week, and the card is hidden on a page a parent has no weekly reason to
  visit. **Gap 2: no safe, findable end of week entry.**

Decisions made with Justin: entry is ONE TOTAL PER CHILD, and the CHILD CAN
PRINT the chart from their own app. No new migration is needed: star_bonuses
(086) and star_chart_prints (117 + 170) already carry everything.

## Part 1 — The star chart, on both phones (build now, one PR)

No migration. Reuses star_bonuses (086) and star_chart_prints (117 + 170).
Commit order gates tsc + wiring after each step.

1. **Extract the printable sheet** from StarChartBuilder.tsx (lines ~61 to 97
   and ~394 to 537) into `components/printables/StarChartSheet.tsx`, a pure
   presentational, server renderable component:
   `{ name: string; weekLabel: string | null; jobs: SheetJob[] }` with
   `SheetJob = { emoji, text, stars }`, exporting `MAX_ROWS = 11`. The blank
   pen row padding moves into it; it owns the sheet scoped print CSS
   (`@page`, `.print-sheet`, `.cut-page`); chrome hiding stays per consumer.
   The builder re imports it: a pure lift, zero behaviour change.

2. **Token authed print record**: new `app/api/kid/school-add` style route at
   `app/api/kid/star-chart-print/route.ts`. POST `{ token, weekStart }` →
   resolve kid_links via admin client → insert star_chart_prints
   `{ user_id, child_id, week_start }` (junk week drops to null, same rule as
   the parent route). A child's print then quiets the parent quest board's
   "To print" and "For Monday" badges with zero board-status changes.

3. **Child print surface**: `app/k/[token]/star-chart/page.tsx` (server, the
   week page pattern): reads active family_quests filtered IN SQL to
   `child_id is null or child_id = this child` (sibling safe), capped at
   MAX_ROWS; week = `chartWeekStart()` + `formatWeekBeginning`. Renders a
   tiny client `KidChartToolbar` (Back to `/k/[token]?tab=print`, a Print
   button that fire and forgets the record POST then `window.print()`, no
   popup, so nothing to block) above the shared `StarChartSheet`. No jobs →
   blank pen rows, never the builder's POOL (printing our guesses onto a
   child's chart invents jobs the parent never agreed to); toolbar copy says
   to write them on with a pen or ask the grown up.

4. **Child hero card**: exported `KidStarChartHero({ token })` mounted at the
   TOP of the print tab in KidQuestScreen (before the sheets tally, ~line
   2454). Copy (no dashes): "My star chart. Print your chart for the fridge
   and do your jobs on paper all week. At the end of the week your grown up
   puts your stars in the app and they land in your bank. Print it →".

5. **Week aware, idempotent parent entry**: upgrade
   `app/api/quests/fridge-week/route.ts` to take `weekStart` (must equal
   `starWeekStart()` or `previousStarWeekStart()`, else 400), stamp the week
   into the note (`Star chart, week of 2026-08-04`), and REPLACE per
   child + week: select existing rows by exact note → delete by filter →
   insert chunked ≤20 rows → fire and forget `sendPush` to the child ("Your
   star chart stars landed ⭐"). Returns `{ added, replaced, updated }`.
   Legacy 'Fridge chart, this week' rows are never touched. Accepted quirks
   commented in the route: the non transactional replace race converges on
   the next entry; a Last week entry attributes to the current bank week by
   created_at (all time balance, the number that matters, is exact).

6. **FridgeChartLog.tsx** gains This week / Last week chips (labelled with
   `formatWeekBeginning`), sends `weekStart`, and its done card says
   Updated vs Added. Props unchanged, so existing mounts need no wiring.

7. **Mounts**: keep `/dashboard/printables`; ADD the card under the builder
   on `/dashboard/printables/star-chart` (the quest board tile's
   destination can then both print the week and enter it). Deliberately NOT
   on the quests page: that is the app run week's home, and a paper total
   there invites double crediting a week already ticked in the app.

8. **Fixture**: `app/ref-star-chart-sheet/page.tsx` rendering the REAL
   StarChartSheet (5 jobs, empty, 11 jobs undated), KidChartToolbar,
   KidStarChartHero and FridgeChartLog with fake kids. Screenshots at 320,
   390, 430; tsc; wiring 0 new. The parent dashboard cannot be screenshotted
   in the sandbox (no login): compensated by the fixture rendering the real
   components and the builder change being a pure markup lift.

Key files: components/printables/StarChartSheet.tsx (new),
app/(dashboard)/dashboard/printables/star-chart/StarChartBuilder.tsx,
app/k/[token]/star-chart/* (new), app/api/kid/star-chart-print/route.ts
(new), app/api/quests/fridge-week/route.ts,
components/quests/FridgeChartLog.tsx, app/k/[token]/KidQuestScreen.tsx,
app/(dashboard)/dashboard/printables/star-chart/page.tsx,
app/ref-star-chart-sheet/page.tsx (new).

## Part 2 — My School Planner: built by the child, alive online, printed for real

### What the research says

**Market.** UK school planner printers (Boomerang, SchoolPlanner.co.uk,
HomeworkPlanners.co.uk, ePrint) sell school branded diaries to SCHOOLS in
bulk; retail kids planners cluster at £6 to £17 (our own Etsy research in
briefings/etsy/01-planners-kits-channel.md maps that band, the Sept to Aug
academic dating rule, and re date never relist). Nobody on the market offers
what we can: a planner the CHILD builds, that lives as a working planner
online fed by their real school diary, with a printed copy on demand. Our
own "My School Year Planner" printable already sells at £8.99 on Etsy
(content/printables/school-year-planner: 22 pages, build scripts, three
editions), so the page architecture is proven.

**Print on demand.** Nothing is wired in code today, on purpose (the shop's
own doctrine: fulfilment by hand for the first fifty, no printer integrated
before anybody has bought). The repo's plans already shortlist Mixam, Doxzoo,
Apprintable and Imprint Digital for run of one digital booklets and name the
Prodigi API for the printed passport. Fresh research adds **Lulu Print API**
as the strongest planner fit: free API, pay per order, A5 coil or perfect
bound (coil lies flat, right for a planner), prints and ships in the UK,
roughly £3 to £8 landed for a planner sized book, which supports a £14.99 to
£19.99 shop price with honest margin.

**"Happy news style" confirmed in repo.** The house newspaper style lives in
content/printables/starter-pack/print.html (masthead with ink rules, mono
kickers, Nunito 900 titles, cream never white, 2.5px ink borders with hard
shadows, ink friendly mode), with content/brand-story/visual-system.md naming
The Happy Newspaper as the mood (energy, never the artwork). The planner
wears exactly this.

### What already exists to build on (no reinvention)

- **Money**: products (price_pence in DB), orders, order_items with a
  personalisation jsonb, /api/shop/checkout (payment mode, GB shipping
  collection, order row written BEFORE Stripe), the webhook's shop branch,
  and the founder only fulfilment board. A new product is a products row.
- **Personalisation data**: children.date_of_birth → year group
  (lib/learning/term.ts, hard rule: no birthday, no guess), term and holiday
  windows (lib/learning/holidays.ts, deliberately approximate, so term dates
  print as a fill in page exactly like the Etsy planner does), the child's
  buddy and accent, and the school diary (school_actions) with its routines.
- **Build it then print it precedent**: the star chart builder; and the
  Playwright print.html → PDF pipeline used by every finished printable.

### The build, phased so each PR merges the same day

**Phase A — the living planner, online (child app).** New page
`/k/[token]/planner`: the child's planner as a real, usable surface in the
newspaper style. Cover (their name, year group when dob is known, their
Planet Friend and accent), this week (their real school diary items and
routines via the shared child-items rules), the monthly spread for the
current month, homework tracker (kid_homework_notes), reading log. Pages are
server renderable components under components/planner/, one shared source
for screen and print. A "My planner" card joins the child home tile grid.
No migration: it reads what exists.

**Phase B — the builder plus the printed edition on the shop.**
- Builder at /dashboard/printables/planner (parent app, child friendly):
  pick cover colour and Friend, confirm the name and year, tick which
  sections to include, live preview using the SAME components as Phase A.
  Built config saved to a new `planner_builds` table (one migration: id,
  user_id, child_id, config jsonb, created_at; number claimed in the draft
  PR per the sync rules).
- A print edition page renders the FULL dated planner (12 monthly spreads
  computed for the academic year, Sept to Aug, like gen-planner.mjs does)
  from a build id, in the print.html conventions (A5 pages, ink friendly
  variant, 3mm margins per plans/print-design-system.md).
- Shop: migration upserts a `school_planner_printed` products row
  (personalised = true, price Justin's call, suggest 1499 pence against a
  £3 to £8 Lulu cost; active). Shop.tsx needs only its existing plumbing:
  order_items.personalisation carries { build_id }. Checkout, webhook and
  the founder board work unchanged.
- Fulfilment, by hand first (the shop's stated doctrine): the orders board
  gains a "Print PDF" link per planner order that opens the print edition
  page for that build; Justin prints to PDF and places the order at Mixam
  or Lulu manually for the first fifty.

**Phase C — automated print fulfilment (only after real orders).** Wire the
Lulu Print API: on webhook payment for a planner order, generate the PDF
(offline worker or route), POST a Lulu print job with the shipping_json
address, store the Lulu order id on the order row (one column, migration),
and mark fulfilled from Lulu's webhook. Falls back to the by hand board on
any error. This phase is deliberately gated on Phase B selling.

### Order of work and verification

1. Part 1 (star chart) ships first as its own PR: it is small, Justin asked
   for it first, and its StarChartSheet extraction establishes the shared
   sheet component pattern the planner reuses.
2. Then Phase A, Phase B, Phase C as separate PRs, each claimed with a draft
   PR at the start (Phase B claims its migration numbers the moment it
   opens). Plan copied into the repo at /plans/2026-08-10-star-chart-and-planner.md
   per CLAUDE.md, decisions.md appended on each merge.
3. Every child surface gets a ref-* fixture rendering the real components,
   screenshotted at 320, 390 and 430; tsc and wiring (0 new) gate every
   commit; the shop change is verified through the existing ref-shop
   fixture pattern plus code review (no sandbox login).

### Needed from Justin along the way

- The printed planner's shop price (suggest £14.99; the products row makes
  it a one line change any time).
- A Lulu account (free) when Phase C arrives, and its API keys as env vars.
- Whether the planner cover should offer all five Planet Friends or only
  the child's earned ones (suggest all five: a cover is a choice, not a
  reward).
