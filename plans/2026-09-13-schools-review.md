# The schools platform, reviewed: sellable to schools, and finished to the Apple bar?

13 September 2026, session 0u09q9. Justin: "make sure a review now of the site and
what is left to do to make it sellable to schools, and the appearance of the whole
school platform has been finished to Apple UX level."

## The verdict, in three lines

1. **Sellable: not yet.** The teaching is there and it is better than Rosenshine,
   Oak, Jigsaw and White Rose on the things a teacher touches: the prep page, the
   run sheet, the scripted player, the six printables, the hub. The buying is not
   there: a school cannot raise a purchase order against a site with no legal
   entity, no terms, no VAT line, no confirmation email, and a pilot that lives
   on Mailchimp.
2. **Apple bar: not yet.** The bones are right (one type pair, one palette, big
   calm pages, reduced motion honoured, no dashes, no AI voice). What breaks the
   spell is the detail: three different headers, the wrong module count on eleven
   pages, three visible copy bugs on compliance pages, four lessons whose printed
   quizzes crash, a pupil booklet that prints the wrong lesson's words on 24 of 25
   modules, and a player whose Continue button sits below the fold on a 900px
   screen.
3. **Distance.** About two focused days of small fixes to be honest and consistent
   everywhere, then the buying documents (which need things only Justin has),
   then the staffroom, which is the one large build and the thing every competing
   scheme charges for.

## How it was reviewed

- **Rendered.** Every route of `schools/` locally: 38 routes at 390 and 1440,
  about 130 frames, the six printables as A4 PDFs, on the full production
  catalogue (all 25 rows exported through the Supabase MCP into the render
  fixture, five modules with full decks plus the taster). The live domain is
  unreachable from this container, so these are local renders of production data.
- **Read.** The buyer and teacher journeys from the code (a read only agent pass,
  101 tool calls), review.md section 7, and a SQL check of the quiz shapes across
  all 25 live rows.
- **Not seen.** The animated intros and the CDN video (blocked here), ink on real
  paper, and the invoice email path end to end.

## Must fix (blocks selling)

1. **Four modules crash their quiz printables in production.** ks3-22, ks2-23,
   ks3-24 and ks2-25 store `starter_quiz` and `exit_quiz` as
   `{title, instructions, questions}`; the 21 older rows store arrays. The print
   pages call `questions.map` and answer 500. Verified against the live table
   today. `schools/app/print/[module]/starter-quiz/page.tsx:46`, the exit quiz
   page, `schools/components/QuizSheet.tsx`. Fix: one reader that accepts both
   shapes, and the shape pinned in `scripts/check-module-contract.mjs`. Small.
2. **The pupil booklet prints module 12 on every module.** "Bloop needs a
   detective", "Circle your verdict: Believe, Pause, Do not share", "The next time
   I see a shocking post I will", "Case closed, detective", all on the Stay the
   maker booklet, seen on the A4 PDF. `schools/app/print/[module]/booklet/page.tsx`
   lines 58, 99, 102, 103, 115, 134. The right words already exist in
   `worksheet.verdict_options`, `commitment_stem` and the module's tool, and the
   paper pack reads them correctly. Small.
3. **The module count is wrong in eleven customer strings.** "21" or "twenty one"
   where 25 are live: the price bullet (`schools/lib/pricing.ts:76`), the policy
   paragraph a school pastes into its published policy, the unlock page, the
   curriculum page (one line above "25 of 25 modules live"), the site description,
   the OG description and the JSON-LD, the induction, the vocabulary and DSL
   pages, the philosophy. Plus "one of twenty three" on the taster bar and "of 23
   lessons" on the passport hub. Compute from `CURRICULUM.length` everywhere.
   Small.
4. **Three visible copy bugs on compliance pages.** `&rsquo;` printed literally on
   /hub/cpd (twice) and /hub/faq; "12of the 21 modules" on /hub/dsl (missing space
   and the wrong total). Small.
5. **The compliance pages contradict each other.** KCSIE 2025 on /hub and inside
   the policy text, 2026 everywhere else. The safeguarding flagged count is five
   (policy), ten (CPD, induction), twelve (DSL, computed) and six (the manifest).
   M22 and M23 are flagged and have no briefing while the CPD page says all ten
   do. One computed number and one year, or a school publishes the wrong one under
   its own name. Small.
6. **The player does not fit a 900px screen on a choice slide.** At 1440 by 900
   the three options end at 845px and the Back and Continue bar is below the
   fold; the teacher scrolls to move on. The same on the KS4 deck. The wall scale
   fits the type, not the navigation. Pin the bar to the bottom or scale the
   options. `shared/components/LessonPlayer.tsx`. Small.
7. **The script and the timing are hidden in the classroom.** The teacher script
   panel opens closed (`LessonPlayer.tsx:989`), the minutes are hidden whenever
   projector is on (`:1672`), and the panel is the one surface with no wall
   scaling (`:1517`). The teacher test says both live on the slide. Small.
8. **Buying needs a phone call.** No legal entity, company number or address (the
   footer says "© 2026 Guided Childhood · Justin Phillips"); no terms of business;
   no privacy notice for schools; no VAT statement; no DPA to download although
   the data pack promises one for signature; the PO number is required even for a
   trust priced "On application"; the school receives no confirmation email after
   requesting an invoice (only Justin is emailed by the hourly cron); five of the
   home page's calls to action leave for Mailchimp. Medium, and it needs Justin's
   details first.

## Should fix (the Apple bar)

**One system, everywhere.**
- Three headers on one site: the home page's own, the philosophy page's single
  link, and SiteNav on the rest. On the open pages SiteNav shows Print room and
  The Hub, which bounce a prospect to /unlock. One header, gated items hidden on
  open pages, and an "I have a school code" door: today no page links to /unlock.
- The mobile nav wraps onto two rows with 28px tap targets. One row and 44px.
- Hub card titles alternate butter and ink with no rule, because the legacy
  aliases collapse green, coral and gold into butter (`shared/tokens.css`), so
  the "coral" safeguarding borders cannot stand out either. One title colour;
  the emoji carries the difference.
- /curriculum is the one page whose column is left aligned inside a wider
  container (196 to 1010px on a 1440 screen); every other page is centred.
- Tab titles: most hub pages, the print pages and the player carry the site's
  default title. A teacher with eight tabs open cannot find the run sheet.
- No favicon and no share image in `schools/app`: a blank tab, and a bare text
  link when a head forwards the site.

**The first screen.**
- Home at 1440 by 900: the five line headline pushes the primary button below the
  fold. Three lines, or a shorter paragraph, so the button is on the first screen.
- The taster's lead form sits above the teach buttons and fills a phone's first
  screen; the lesson should come first and the form after it.
- The pricing form's validation is the browser's native bubble; inline messages
  in the house style, and a real textarea for "anything we should know".

**Phones.**
- /hub/year-plan overflows sideways at 390 and squeezes three columns to one
  word per line; stack the terms.
- The cast section stacks six tall video cards on a phone, about 2,300px of
  scrolling; a horizontal row or compact cards.
- The prep page's six action buttons on a phone are six left aligned pills of
  different widths; a two column grid.
- 9 to 11px text on the passport hub, the lesson page and the learning record;
  12px floor on screen.

**Print.**
- The teacher one pager's safeguarding card splits across pages one and two, and
  worksheet item six splits; `break-inside: avoid` on every card.
- No `@page { size: A4 }` and pixel widths throughout, one millimetre value in the
  booklet. A4 in millimetres, then check on paper, not in CSS.
- The unit overview labels the arrival beat "DiGi closing", because the digi
  slide type now serves arrivals and missions too.
- The booklet prints "HOME-6757on the Lessons page" with the space missing, the
  same bug fixed on the finish screen this week.
- The print room is 25 identical cards with six buttons each; a table grouped by
  key stage reads faster.

**Words.**
- Internal words on teacher pages: "beat" eight times, "the register to hold"
  (means tone, reads as attendance), "Back to the lesson hub" on a button that
  goes to the curriculum, "Page 5" on two sections of the pack.
- Claims without a proof path: "8 of 8 strands covered" is asserted, never
  computed (compare the RSHE matrix, which computes); "every pupil's family gets
  the parent app" is not in what the licence includes.
- Three reply promises: 48 hours (home), two working days (invoice form), the
  same day (FAQ).
- The home section grid leaves the "Never allow or deny" card alone in a row.
- The public mapping matrix prints "Statutory hooks load when the module row is
  live" for any module without a row.

## Okay to ship (named out loud)

- The prep page, the run sheet, the learning record, the knowledge organiser, the
  unit overview and the RSHE matrix are genuinely better than the four schemes'
  equivalents. They are the sales argument and the taster proves it.
- Zero em or en dashes in customer copy, zero AI voice, no Inter, the two fonts
  only, the tokens hold, reduced motion honoured, the gate fails closed, the
  service key never reaches a browser.
- The data protection pack, the FAQ's "Does subscribing make us compliant? No",
  and the philosophy page's "no expert named here endorses this product" are the
  strongest trust lines on the site.
- Every route answers 200 apart from the four quiz pages above; no console
  errors on the open pages; no sideways overflow apart from the year plan on
  phones.

## What is left to be sellable, in the buyer's order

A head's journey: find, trust, try, price, buy, onboard, teach, prove.

1. **Find.** Per page titles, favicon, share image, `robots.ts`, canonicals, and
   sitemap entries for /draw and /hub/data-protection. Small.
2. **Trust.** The counts, the years and the copy bugs (must fix 3 to 5), and the
   legal footer: entity, number, address. Small, plus Justin's details.
3. **Try.** The taster works; move its form under the teach buttons and bring the
   pilot request into the product on the same letterbox as the invoice form.
   Medium.
4. **Price.** A VAT line, the band rule (which pupil number, on which date), and a
   quote path for trusts with no PO. Small.
5. **Buy.** A confirmation email to the school with a reference and a copy of the
   request; terms of business; a privacy notice; the DPA as a download. Medium,
   from Justin's inputs or a solicitor's pass on drafts.
6. **Onboard.** The school code door on every open page, and a welcome email that
   carries the code. The induction page already exists. Small.
7. **Teach.** The player fixes (script open, timing on the slide, the bar always
   visible), the quiz crash, the booklet. Small.
8. **Prove.** The staffroom: a class name, a taught record that survives the
   browser, a term coverage report and the Ofsted evidence print. Large, and the
   one thing every competing scheme charges for. Today the only memory is a
   localStorage array per device with a "forget" button.

## Recommended order, one lane

- Day 1: must fix 1 to 7, all small, one PR, every guard green.
- Day 2: the Apple bar list, one PR, rendered again at 390 and 1440 and printed
  to A4 before it is called done.
- Day 3: find, price and onboard, all small.
- Then the buying documents as Justin's inputs arrive.
- Then the staffroom as its own plan, with the class record designed before a
  line is written.

## Decisions for Justin

1. The legal entity for the footer and the invoice: trading name, company number,
   registered address, VAT registered or not. Answered the same day: Guided Digital
   Childhood Ltd, 17299814, Apple Acre, Star, Winscombe, BS25 1QF, not VAT
   registered. Now in `shared/legal.ts` and on every page.
2. The pilot: keep Mailchimp, or bring the request into the product.
3. The school code door: show "I have a school code" in the header of every open
   page.
4. Terms, privacy notice and DPA: draft them from the data pack for a solicitor's
   pass now, or wait.
5. Merge PR 1058 first, so the fixes start from a fresh branch off main.

## Not in this review

The parents app, the child app and DiGi. The schools platform only.

## Day one, done (13 September, afternoon)

Must fix 1 to 7 shipped, plus the legal identity from must fix 8: the quiz
reader and its contract rule, the booklet from its own row, the module count
from the manifest, the three copy bugs, KCSIE 2026 and one flagged count with
briefings for M22 and M23 and a guard, the player's script open and scaled with
the minutes on the wall and the bar pinned on a projector, and the footer,
pricing and data pack carrying the company and the VAT position.

Left from day one: on a choice slide at 1440 by 900 the open script now sits
below the third option, reachable by scroll; a tighter option scale at small
heights is a day two item. The rest of must fix 8 (terms, privacy notice, DPA,
the confirmation email, the quote path, the Mailchimp pilot) waits on decisions
2 to 4.
