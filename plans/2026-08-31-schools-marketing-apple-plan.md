# The schools marketing page, to the Apple bar

Justin, 30 August 2026: the schools marketing page must reach the level of
the parents page. Apple level UX. Every year of the curriculum clear, White
Rose clear. The evidence spine on the page: government guidance, Common
Sense, Dr Becky, Catherine Knibbs, Cambridge. Why we believe what is right
at each year. Character images and short explainer animations. SEO perfect.
Verified with agents until checked, not until tired.

## What is wrong with the page today (schools/app/page.tsx)

1. No per year detail. The curriculum section is chips in a row; a head
   cannot see what Year 4 actually covers or why.
2. No evidence spine. Not one named source on the page, when the whole
   pitch is that experts would look at this and recognise it as right.
3. Stale statutory labels: the compliance cards still say RSHE 2025 and
   KCSIE 2025; KCSIE 2026 is in force 1 September and names generative AI,
   deepfakes, misinformation and conspiracy theories.
4. The DiGi Squad blurbs contradict the shipped casting: Nova hosts the
   KS4 modules and Cosmo hosts KS5 AI and future work (migration 233), but
   the page still calls Nova "mood and wellbeing" and Cosmo "scams".
5. No animation beyond fade ups, when five character intro clips already
   sit on our own CDN as finished mp4 files.
6. SEO is one title and one description. No structured data, no sitemap,
   no per section semantics.

## The build

1. **Rebuild schools/app/page.tsx.** Keep the hero shape and pricing
   section (they work). Add: the year by year journey (every year band
   Reception to Year 13, its modules, what is covered, and the one line of
   why this content belongs at this age, sourced); the evidence spine
   section (regulators first, then scientists, then practitioners, then
   us); character clips as short muted looping animations doing real work
   in the journey section; corrected casting lines from the shared
   manifest; corrected statutory labels.
2. **New open page /philosophy.** The full "why we believe what we
   believe": DfE RSHE 2026, KCSIE 2026, Education for a Connected World,
   Common Sense (kinship, never claimed as UK alignment), Dr Becky
   (readiness framing, never implied endorsement), Catherine Knibbs
   (cybertrauma informed handling of issues, never implied endorsement),
   Cambridge as two separate strands (Orben windows of sensitivity; van
   der Linden inoculation and the social media passport argument), UKCIS
   and Livingstone. Per source: where we align, where we differ. Never a
   causal mental illness claim. Added to OPEN_PATHS and the robots note.
3. **SEO.** JSON-LD (Course and Organization) on home and curriculum,
   app/sitemap.ts for the open pages, canonical URLs, tuned titles and
   descriptions per open page.

## Evidence rules for this page

Research agents verify every claim to a primary source before it renders.
Named experts are cited as kinship and framing only, with no implied
endorsement. No "safe" as a promise, no "the only way", no causal mental
illness claims, no venue claims for the passport. The honesty line stays:
readiness is an educational judgement; it reduces risk, it does not remove
it. All copy dash free, Justin's voice.

## Verification gate (not done until all pass)

Both apps build and typecheck; wiring check 0 new; gate check per route
(home and /philosophy open, everything gated still 307); Playwright
screenshots at 390 and 1280 of every section; banned vocabulary sweep;
review.md pass; SEO checked with a rendered head inspection (title, meta,
JSON-LD parse).

## Lane and claims

Lane: schools marketing surface (home, /philosophy, SEO files). No
migrations needed. Claimed by the draft PR carrying this plan.
