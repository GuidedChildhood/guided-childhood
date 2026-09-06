# Guided Childhood: current state verification and improvement audit

5 September 2026. Read only. Baseline origin/main 97ef53a. Provenance and method in 00-provenance.md. Machine readable ledger in ledger.csv (75 rows, six statuses). Evidence appendices A1 to A6 carry the path:line quotes.

## 1. Executive verdict

The external report's thesis is right and its scorecard is roughly right. Of its 62 specific findings, 29 are already handled or partly handled in code and four were never true of this codebase. The product is stronger than the report says on stars, DiGi's child boundary, row level security, curriculum depth and reduced motion. It is weaker than the report says in three places the report did not look: an unauthenticated service role API route, a consent gate that only exists in the browser, and a Terms page that describes a product that does not exist.

Ledger totals across 75 items (62 from the report, 13 new):

| Status | Count |
|---|---|
| RESOLVED AND VERIFIED | 8 |
| IMPLEMENTED, NOT FULLY VERIFIED | 1 |
| PARTIALLY RESOLVED | 18 |
| STILL PRESENT | 42 |
| NOT APPLICABLE, PRIOR FINDING UNSUPPORTED | 3 |
| BLOCKED, UNKNOWN | 3 |

What blocks trust right now, in order: the Terms page (seven day trial, card at signup, everything unlocked, "move to the free tier": all four false), six unsourced homepage claims two of which are pushed into Google's FAQ markup, one API route anyone can call with a service role behind it, the wellbeing consent gate that the API does not enforce, testimonials that differ page to page, and a set of legacy static pages still served at their .html addresses carrying Stripe Payment Links that skip the founder cap.

What the report got wrong and should not be redone: the star system already caps, expires, never goes negative, never confiscates, protects bedtime and mealtimes, ranks nobody, and pays most for play. DiGi is parent facing only and a guard script fails the build if a model import appears on the child side. All 21 school modules are full lessons in the database with scripts, misconceptions, worksheets with answers, assessment shapes, parent notes and DSL notes. Every table has row level security. The parent site reveal animation is safe without JavaScript and respects reduced motion.

## 2. Scope and provenance

See 00-provenance.md. Short form: origin/main 97ef53a audited read only through six parallel sweeps; safe local checks pass (typecheck 0 errors, wiring 0 new, check in guard green); production domains unreachable from this container so the deployed revision is assumed equal to main; two open PRs (967 Planet Friends with migration 254, 968 parent app finish). Nothing was changed for the audit. One exception happened after the audit began and on Justin's separate message that 967 and 968 showed conflicts: the PR 968 branch received a merge of main and a three file build fix (see N10), pushed to its own branch, nothing merged.

## 3. Reconciliation ledger

ledger.csv, keyed H01 to H62 for the external report's hypotheses and N01 to N13 for new findings. Each row carries status, path:line evidence and the proposed action. Section 4 groups the ones that matter by priority.

## 4. Findings by priority

### P0: fix before the next paid acquisition or school pilot

1. **N01 Unauthenticated service role route.** app/api/push/subscribe/route.ts builds a service role client and takes userId from the request body with no session check. Anyone who knows a user id can attach a push endpoint to that account or delete a family's subscriptions. Fix: require getUser() and use the session's id.
2. **H13, H14, H09 in Terms: the Terms page describes a different product.** terms/page.tsx:40-44 says 7 day trial, card at signup, everything unlocked, and "you simply move to the free tier". Code: four days, card only on the founder door, starter set plus three DiGi messages a day, and the whole dashboard locks after the trial (middleware.ts:93-106). The same "free tier" wording is in six Resend templates and the trial pushes. Under the 2026 subscription rules this is the exposure the external report was right about. Fix: rewrite the trial, billing and cancelling paragraphs (section 5), retire "free tier" from templates.ts:247, 499, 1424, 1456, 1488, 1563 and trial-pushes/route.ts:101.
3. **N04 Standard tier families are told they are founders.** webhook/route.ts:156-163 writes plan_choice founder for every subscription checkout, so a family paying £12.99 gets settings, the countdown and the pre charge email saying "your founder rate of £7.99 starts". Fix: write plan_choice from the tier metadata.
4. **H01 to H05, H08 Homepage claims.** Six unsourced lines on app/page.tsx (:101, :109, :156, :164, :591, :708), two of them in FAQPage JSON-LD. Section 5 has the replacement copy. The page also contradicts itself ("it is the phone" at :109, "the problem is not the phone" at :889).
5. **N02, H37 Special category data.** The wellbeing write routes (app/api/tracker/route.ts, tracker/quick) do not check wellbeing_consent_at; the gate is a client prop. The notice promises two year retention and no purge job exists. digi_safety_flags keeps question and reply text after account deletion. Fix: server side consent check, a purge cron or a truthful retention line, redact flags on delete.
6. **N05, H52, H60 Legacy static pages.** public/index.html, starter-pack.html, scripts.html, device-checklist.html, trust.html, schools.html and others are still served at their .html paths with "Join the waitlist", "131 parents", "Free forever", "7 science backed rules", "validated clinical screening tools", Social Billboard footers and buy.stripe.com Payment Links that bypass the founder cap, the trial and the webhook metadata. Fix: delete or redirect them (Justin's call, section 9).
7. **H35, H36 Legal identity and DPIA.** No company number or registered address on privacy or terms; no DPIA, ROPA, DPA or incident process, while special category data about named children is already being processed. The go live checklist from 28 July lists exactly what is needed.
8. **N10 PR 968 was red on Vercel.** A server component imported the crayon colours from a file that imports createContext. Fixed and pushed; merge when Vercel reports green.

### P1: the next two weeks

- **DiGi (H28, H29, H31, H34).** The crisis regex exists but the main chat never calls it before the model; only the rescue tile does. No deterministic handling for grooming, abuse, exploitation, eating disorders, violence or emergencies; no CEOP or school DSL route. No parent memory controls despite tools.ts:32 claiming one line deletability. "Every lesson and every DiGi answer reviewed weekly" (app/page.tsx:322, 903) overstates what runs (13 fixed evals, 5 rotating cases, a flag count). Privacy notice says "questions" go to Anthropic when six weeks of wellbeing scores, notes, the family agreement and the memory table go too.
- **Pricing (H15, H16, H17, N06, N07).** "Two months free" is 4.38 months; £57 is £56.88. Prices exist only as strings in about 20 files. Founder counters use three different sources, one with a literal 50. A 30 day no questions refund is promised on the homepage and upgrade page and absent from the Terms. No renewal reminder before a monthly or annual charge.
- **Stars (H19, H21, H22).** Core time is built but defaults to zero, so for any family that never opens the setting all recreation is earned, which is the report's real point. Minutes are the headline unit on every child surface and the only non screen sink is one parent set goal. Homework and bedtime routine jobs pay screen minutes; homework on a computer costs stars; the fair play star is keyed off the parent's disclosure grade; one flat "chores first" deny survives in start/route.ts:254. Section 7 gives my view.
- **Schools (H42, H43, H46, H47, H50, H54, H10).** "21 of 21 modules live in the pilot · the rest are in production" renders both halves. Pricing page says "the whole curriculum catalogue is open: pick a module and teach it this week" while every lesson is behind the code. Module 12's hooks print "KCSIE 2025" on the public matrix and the site description says "2025 RSHE guidance". The matrix maps to ten topic names, not paragraphs, under a "line by line" claim. The unlock placeholder is the template's sample code. The schools hero ships opacity 0 in server HTML. "Statutory by construction" and "the coverage evidence Ofsted asks for" sit next to a teach route that records nothing.
- **Evidence (H58, H61, H11, N08, N09).** No claim register. /evidence is a code marked draft with four uncited paragraphs and no names, while the homepage promises "five of the world's leading researchers" live there. ban-workarounds cites Ofcom, IWF and NASUWT figures with no verification file. Scripts are "160" and "100 plus" on different pages; Australia is 60%, 61% and two thirds on three surfaces. join/page.tsx:482 cites a "UK Surgeon General Advisory", which does not exist.
- **Privacy notice completeness (H37, H38, H39).** Missing: transfers, AI memory, embedding providers (Voyage or OpenAI per lib/digi/embeddings.ts), child phone, device settings, child typed notes. The schools data protection pack exists but is gated behind the school code.
- **Security (N11, H40, H51).** A kid link can be minted for a child id the caller does not own. School codes are a plain text env list with a 500 ms delay and no rotation, expiry or audit.

### P2: worth a ticket, not a rush

Accessibility statement, skip link, a global focus ring, three contrast failures on the schools pages (matrix ticks at 1.57:1); CSP and HSTS headers; two cron routes without a null guard on CRON_SECRET; passport called three things across the funnel; 20 of 21 lessons with no Connect slide and empty video beats; SEND and EAL never named in lesson content; retired human cast names in content/lesson-scripts; CLAUDE.md routing to docs/ files that are not on main; the unused sm13 lesson set and educator tables.

## 5. Exact proposed changes (copy and technical)

Copy, in Justin's voice, no dashes. Nothing here has been applied.

| Where | Now | Proposed |
|---|---|---|
| terms/page.tsx:40 | "new members get a 7 day free trial with everything unlocked. A card is collected at signup and your plan begins when the trial ends unless you cancel before then." | "Free days: every new member gets four free days. If you take the founder or standard door we ask for a card and nothing is charged until the four days end. If you take the free door no card is taken. During the free days you get the starter set of scripts and three DiGi questions a day, and everything else opens when you join." |
| terms/page.tsx:43 | "we do not lock you out afterwards, you simply move to the free tier." | "you keep access to the end of the period you have paid for. After that the app waits for you, your data stays safe, and you can come back and join at any time." |
| lib/email/templates.ts:247, 499, 1424, 1456, 1488, 1563; trial-pushes:101 | "the free tier stays free" and variants | "the app waits for you" and state the four days |
| app/page.tsx:101 | "Blue light delays sleep onset by 90 minutes and teenagers need 9 hours." | "Screens in the evening, and especially in bed, push sleep later. The argument is not about the phone. It is about the bedroom." |
| app/page.tsx:109 | "The research says yes, it is the phone." | "A flat mood after screens can have a few causes: a rewarding thing stopping, tiredness, hunger, what they were watching, who they were talking to. Track it for two weeks. The pattern becomes the conversation." |
| app/page.tsx:156 | "One consistent routine replaces most daily arguments within two weeks." | "One consistent routine takes most of the daily negotiation out of it. You rate the worry each day and watch your own number move." |
| app/page.tsx:164 and FaqAccordion.tsx:11 | "The UK ban delays social media access until 16 but does not teach children anything." | "The UK plans to restrict under 16 access to some social media from spring 2027. A deadline delays the apps. It does not teach a child anything." |
| app/page.tsx:591 | "Nine in ten parents argue with their kids over screens" | Keep only with the primary survey cited beside it; otherwise "Most parents argue with their kids over screens" |
| app/page.tsx:708 | "Kids disable them in days" | "Children learn the workarounds, and every fight gets worse." |
| app/page.tsx:26, 36, 44, 190, 297 | "all science backed" | "evidence informed and updated as the research changes" |
| app/page.tsx:322, 903 | "Reviewed weekly ... Every lesson and every DiGi answer reviewed weekly" | "DiGi is tested every Monday against a fixed set of hard cases, and the research library is refreshed twice a month with a human deciding what goes in." |
| app/page.tsx:978, join:750, PlanChooser:51 | "Save £57. Two months free." | "£8.25 a month. Save £56.88 against paying monthly." |
| join/page.tsx:482 | "the same evidence base as the UK Surgeon General Advisory" | Remove the sentence |
| starter-pack/ResultScreen.tsx:355, FreeDoor:87, upgrade:175, TrialCountdown:107, pushes | "Everything open" / "all of it open" / "full access" | "Four days to try it: the starter set of scripts, three DiGi questions a day, the daily check in and your child's app." |
| lib/content/passport.ts:41 | "around 60 percent of children found a way around the ban within weeks" | Use the one pinned figure from the 5 September briefing, with its source line, on all three surfaces |
| schools/app/page.tsx:234 | "Statutory by construction" | "Built on the statutory guidance" |
| schools/app/page.tsx:24, 336 | "the coverage evidence Ofsted asks for" | "the coverage record a school can show" |
| schools/app/curriculum/page.tsx:54 | "21 of 21 modules live in the pilot · the rest are in production" | Render "the rest are in production" only when liveCount is below the total |
| schools/app/pricing/page.tsx:92-94 | "The whole curriculum catalogue is open: pick a module and teach it this week" | "The map is open. Ask for a pilot code and teach any module this week." |
| schools/app/unlock/UnlockForm.tsx:60 | placeholder oakfield-2026 | placeholder "your school code" |
| schools/app/page.tsx:747, join:820, digitalwellbeing:117 | "© 2026 The Social Billboard" | "© 2026 Guided Childhood" |
| join/page.tsx:141-170 | Four five star quotes from Sarah, Emma, Mark, Laura | Use the three real ones from the homepage or label these "what parents tell us, names changed" |

Technical, smallest first:

1. app/api/push/subscribe/route.ts: authenticate and drop the body userId.
2. app/api/tracker/route.ts and tracker/quick: return 403 unless profiles.wellbeing_consent_at is set.
3. app/api/stripe/webhook/route.ts:156-163: plan_choice from the tier metadata.
4. app/api/digi/route.ts: call hasCrisisLanguage on the incoming message before the model and prepend the fixed signpost; extend CRISIS_TERMS with the other risk classes and add CEOP and the school DSL to the rescue response.
5. A purge cron for wellbeing rows older than two years, and redaction of digi_safety_flags on account delete.
6. lib/config/prices.ts read by every surface; one founder count function.
7. schools/components/Reveal.tsx: render visible by default and animate in.
8. app/api/quests/route.ts:218-228: verify children.parent_id before minting a kid link.
9. Migration for module 12 hooks (KCSIE 2026) and the three 2025 headings.
10. Delete or 301 the public/*.html pages.

## 6. Curriculum verification summary

All 21 modules exist as complete lesson rows (A6 section 1): 12 to 27 scripted slides, 800 to 2,150 script words, three misconceptions, support and stretch, paper fallback, a six item worksheet with expected verdicts, an assessment shape, a parent note and a DSL note (required on 10). Interactives run in two modules, video beats are empty in all 21, and 20 of 21 have no Connect slide although six phases are marketed. The mapping matrix is ten topic columns; nothing maps to a paragraph or outcome ID. The public surface says 2025 and 2026 in different places and prints KCSIE 2025 hooks from module 12. Nothing teachable is visible without a code, and the pricing page says it is. The report's "outlines only" and "heading plus one bullet" findings do not hold.

## 7. DiGi verification summary, and the star system view

DiGi. Parent facing only, enforced by scripts/check-child-has-no-model.mjs. Model from DIGI_MODEL with a default and a fallback ladder, never hardcoded in a route. The prompt carries a crisis rule above everything with Samaritans, 999, GP, CAMHS, Childline, Papyrus, Beat and YoungMinds, a never diagnose rule, a never allow or deny rule and a data minimisation rule. The regex layer catches diagnosis, verdicts and binary language after the reply and logs flags for Monday review. The gaps: the crisis regex runs before the model only on the rescue tile, not in the main chat; no scripted handling for grooming, abuse, exploitation, eating disorders, violence or emergencies; no parent view or delete of the memory table; no retention on conversations or memory; no confidence or review date on the knowledge bank; the "reviewed weekly" copy overstates.

The star system, my view. The external report's redesign list is mostly already built, and the 26 August evidence pack argued the case honestly before the report existed. Cap not bank, no debt, no confiscation, protected windows, play pays best, no sibling comparison, readiness by skills: all verified in code. Four things are genuinely worth changing, in this order:

1. Core time should not default to zero. The story says a core of time is theirs unconditionally; the code ships it off. Either default it on at a modest amount by age or ask in setup. This is the one point where the report's "screen minutes as the ultimate prize" critique still lands. It is Justin's call because pillar 4 says earned, not granted.
2. Move homework, teeth, room tidy before bed and device on charge to family jobs by default (streak, no stars), and let a homework session on a computer run free. Paying screen minutes for school essentials and the bedtime routine is the one line in the evidence pack's own "what must still change" list that was not closed.
3. Give the child a second thing stars can do. One parent set goal exists; two or three family rewards shown beside the minutes, with the sticker book's restraint credit made louder, would answer the report without a rebuild.
4. Two small honesty fixes: the "chores first" 400 becomes an ask like every other start, and the fair play star keys off the child's own act.

I would not run a randomised routine only pilot now. The families with core time on versus off already exist in the data; comparing their conflict scores in concern_events is a week of work and answers the same question.

## 8. Do not redo

- Row level security: every table, owner scoped; the permissive policies are read only content tables.
- The star ledger: append only, recomputed on read, weekly cap and expiry, no negative balances.
- The child boundary: no model on the child side, guard script in the build.
- Child transparency note in the kid app; wellbeing consent capture with version and real deletion on withdrawal.
- Account deletion cascade through children to wellbeing, memory, feedback and prompts; suppression before delete.
- Reduced motion on both sites; the parent site reveal safe without JavaScript.
- 21 full lessons in the database; the schools philosophy page's sourcing and no endorsement line.
- Trial length as one config value; founder cap counted in Stripe at checkout.
- The starter pack as the entry with no signup and every CTA routing to it.
- The contrarian briefing's banned numbers list from 5 September, which already covers three of the report's claims.

## 9. Decisions only Justin can make

1. The legal entity. Sole trader or limited company, with the registration details, so privacy, terms and both footers can say the same thing.
2. Core time default on, or asked at setup, against pillar 4.
3. Whether the legacy public/*.html pages come down or get redirects. They carry the waitlist, the Payment Links and the Social Billboard name.
4. Whether the 30 day no questions refund is real. If yes it goes in the Terms; if no it comes off the homepage and the upgrade page.
5. Whether the Stripe billing portal is switched on in the Stripe dashboard (the cancel button depends on it).
6. Whether oakfield-2026 is a live school code.
7. The passport's one name across both sites.
8. Commissioning the DPIA and the solicitor review the July checklist already scoped.
9. Whether "Digital Health Check" on the digitalwellbeing microsite keeps its Trust Score and Signal Score without a published method.
10. Which of the three testimonial sets are real and consented.

## 10. Staged implementation proposal

Stage 1, one day, copy and config only, one PR: Terms trial and cancellation paragraphs; the six homepage lines and the ban tense; the two "reviewed weekly" lines; the annual saving; the UK Surgeon General line; the three Social Billboard footers; the unlock placeholder; the schools 21 of 21 line and the pricing page catalogue line; the "everything open" trial lines. Each is a string edit listed in section 5.

Stage 2, two days, small code, one PR each: push subscribe auth; server side consent gate; webhook plan_choice; crisis gate in the main chat plus CEOP and DSL; kid link ownership check; schools hero visible by default; a prices config and one founder counter.

Stage 3, one week: legacy pages decision executed; privacy notice additions (entity, transfers, memory, embedding providers, child notes) and the retention purge; the module 12 hook migration and the 2025 headings; the DiGi memory settings screen; a renewal reminder cron.

Stage 4, the month: DPIA and ROPA from A5; the claim register seeded from A1 and the contrarian ledger, with /evidence rebuilt as its readable view; one public sample module per phase; the star system changes in section 7 after Justin's call on core time; school codes to a table with expiry and attempt limits.

## 11. Required tests before any of it ships

Existing gates: npx tsc --noEmit (root and schools), npm run wiring, npm run checkin-guard, scripts/check-child-has-no-model.mjs, scripts/check-signup-charging.mjs, the dash grep on the diff, phone and desktop screenshots. Add for stage 2: a request to push/subscribe without a session returns 401; a tracker write without consent returns 403; a standard tier checkout writes plan_choice standard; a crisis message in the main chat returns the signpost first; a kid link for another family's child returns 403.

## 12. Five most useful next actions

1. Merge PR 968 once Vercel is green, and PR 967 when its own session reports it done.
2. Approve stage 1 (copy only) and I will open it as one PR against section 5.
3. Approve stage 2 (the seven small code fixes), starting with push subscribe and the consent gate.
4. Answer decisions 1, 3, 4 and 6 above, which unblock the Terms, the legacy pages, the refund line and the school unlock page.
5. Commission the DPIA from the July checklist; everything in A5 section 1 and 7 is the input.
