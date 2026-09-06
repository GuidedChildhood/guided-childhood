# Appendix A6: curriculum, schools statutory language, UX, accessibility and branding (evidence)

Read only sweep of origin/main 97ef53a on 5 September 2026. Paths relative to repo root. No docs/09 or schools/01 document exists on main.

## 1. Curriculum inventory

- Module manifest (21 entries): shared/schools-curriculum.ts:112-281; header :1-6 "Playable lesson CONTENT stays in the database (school_lessons rows). A module here with a matching school_lessons row is live; without one it shows as in production."
- Table school_lessons created supabase/migrations/023_schools_product.sql:64-85 (slides jsonb, video_beats, assessment, parent_note, teacher_notes, dsl_note); moved to schema schools in 177.
- Seeds: ks3-12 in 023 (repaired 026, decks 031, 032, interactive 038); the other 20 in 033_full_curriculum.sql; lesson 1 upgrades 199, 200, 231; KS4/5 intro characters 233.
- A separate 15 module KS3 set (sm13-01 to 15) is seeded in 109 to 112 from content/curriculum/social-media-13plus/*.md; not in the manifest, not surfaced; 220_school_lessons_scaffold.sql:9-11 says the live database carries no sm13 rows.
- Counts: EYFS 1, KS1 2, KS2 6, KS3 5, KS4 5, KS5 2 = 21, all 21 seeded.

Per module completeness (parsed from the seed JSON): every one of the 21 rows has a slide deck with a teacher script on every slide, phase and minutes on every slide, an assessment object (retrieval_starter, in_lesson_checks, exit_quiz, teacher_judgement, action_commitment), parent_note, teacher_notes (objective, timing, 3 misconceptions, differentiation support and stretch, paper_fallback, keywords, worksheet with 6 items and expected verdicts, commitment stem) and dsl_note. video_beats is an empty array on all 21 (033:1-6 "until the Higgsfield render pass").

| M | module_id | Slides | Script words | Minutes | DSL note | Interactives | Score 0 to 5 |
|---|---|---|---|---|---|---|---|
| 01 | eyfs-01-screens-kindness | 12 plus 3 via 199/231 | 947 | 30 | not required | star-breath, verdict-sort, I can record | 5 |
| 02 | ks1-02-kind-screens-calm-bodies | 14 | 903 | 39 | required | none | 4 |
| 03 | ks1-03-real-pretend-computer | 14 | 812 | 40 | no | none | 4 |
| 04 | ks2-04-screen-routines | 22 | 1443 | 60 | no | none | 4 |
| 05 | ks2-05-gaming-time-spend | 23 | 1449 | 60 | no | none | 4 |
| 06 | ks2-06-how-algorithms-work | 22 | 1304 | 60 | no | none | 4 |
| 07 | ks2-07-privacy-reputation | 22 | 1394 | 60 | required | none | 4 |
| 08 | ks2-08-kind-safe-online | 23 | 1661 | 60 | required | none | 4 |
| 09 | ks2-09-copyright-ownership | 22 | 1504 | 60 | no | none | 4 |
| 10 | ks3-10-mood-and-screens | 23 | 1442 | 60 | required | none | 4 |
| 11 | ks3-11-social-workarounds | 23 | 1571 | 60 | required | none | 4 |
| 12 | ks3-12-misinfo-deepfakes | 27 | 1006 | 60 | seed 023 | verdict-sort, video slide | 5 |
| 13 | ks3-13-scams-fraud-money | 23 | 1361 | 60 | no | none | 4 |
| 14 | ks3-14-bodies-image-pressure | 22 | 1579 | 60 | required | none | 4 |
| 15 | ks4-15-manipulation-persuasion | 23 | 1348 | 60 | no | none | 4 |
| 16 | ks4-16-consent-images-law | 23 | 1754 | 60 | required | none | 4 |
| 17 | ks4-17-sextortion | 22 | 2149 | 60 | required | none | 4 |
| 18 | ks4-18-radicalisation-misogyny | 23 | 1603 | 60 | required | none | 4 |
| 19 | ks4-19-readiness-at-16 | 25 | 1795 | 60 | no | none | 4 |
| 20 | ks5-20-ai-mastery-data-rights | 22 | 1570 | 55 | no | none | 4 |
| 21 | ks5-21-digital-identity-future-work | 21 | 1606 | 55 | no | none | 4 |

Score 5 = all text fields plus interactive components; 4 = all text fields, no video beats, no interactives (199:8-12 "We built six interactive components and not one lesson called a single one, across all 21" before lesson 1 was fixed). The "outline only" hypothesis does not hold for the database rows.

Voiceover scripts content/lesson-scripts/*.md still name the retired human cast (Sofia, Zara, Oliver, Vix, Brock) while the manifest casts Pebble, Bloop, Orbit, Nova, Cosmo.

## 2. Public wording on counts and availability

Open routes only /, /pricing, /draw, /unlock, /curriculum, /hub/rshe-mapping, /philosophy (schools/lib/access.ts:60).

- schools/app/curriculum/page.tsx:54 "{liveCount} of {CURRICULUM.length} modules live in the pilot · the rest are in production" renders "21 of 21 modules live in the pilot · the rest are in production" once all rows exist. Contradiction holds.
- :51 "Pick a module and teach it today. No download wall, no prep, nothing to book." but every module card links to gated /lesson/... (:178).
- schools/app/page.tsx:24 "A complete digital literacy scheme of work ... 21 modules"; :336 "Ready in your classroom tomorrow."; :620 "all {totalModules} modules, from £1.50 per pupil per year."
- schools/app/pricing/page.tsx:92-94 "You do not need a licence to try it. The whole curriculum catalogue is open: pick a module and teach it this week, then decide." Contradicts the gate (access.ts:53-56).
- Parent site app/page.tsx:162 "160 scripts ... 100 lessons you can teach at home".
- shared/components/LessonPlayer.tsx:841 "The full school curriculum goes deeper: complete schemes of work by key stage".

## 3. Statutory language

- schools/app/page.tsx:24 "the coverage evidence Ofsted asks for. Mapped to the statutory RSHE guidance, KCSIE 2026 and all eight Education for a Connected World strands"; :60-61 FAQ "Does this meet the new statutory RSHE guidance? Yes. The guidance published in July 2025 becomes compulsory on 1 September 2026, and every module is mapped to it line by line"; :234-235 title "Statutory by construction"; :336 "coverage evidence Ofsted asks for"; :418 "The compliance hub"; :581 "Ready for inspection, ready for parents"; :748 footer "RSHE statutory 2026 · KCSIE 2026 · Education for a Connected World".
- schools/app/layout.tsx:29 "built on the Education for a Connected World framework and the 2025 RSHE guidance" (site wide description).
- schools/app/philosophy/page.tsx:66 "We teach first by construction: every module is mapped to this guidance line by line"; :169 "We are built on the UK frameworks a head is inspected against".
- schools/app/hub/rshe-mapping/page.tsx:34 h1 "RSHE 2025 mapping matrix"; :37-38 "published on 15 July 2025 and becomes compulsory on 1 September 2026"; :43 honesty note; :85 "KCSIE 2026 · the newly named risks".
- "compliant", "approved", "accredited", "certified": none on public pages.

Year check: the matrix header says KCSIE 2026 but module 12's seed hooks print "KCSIE 2025 content risks" and evidence anchor "KCSIE 2025 content risk expansion" (023:243-244, 026:199) on the public matrix (rshe-mapping:117). layout.tsx:29 says "2025 RSHE guidance", the home page "RSHE statutory 2026", the matrix h1 "RSHE 2025". Hypothesis holds.

Mapping granularity: 10 broad topic columns (shared/schools-curriculum.ts:48-59) ticked per module from m.rshe tags. No paragraph or outcome IDs anywhere. Statutory hooks are free text tags of mixed vocabulary (033:16, 338, 1072, 3126, 5706, 7276, 7773). EfCW strands print as bare numbers. In the KCSIE list (rshe-mapping:93-96) M03 appears in three rows and M12 in all four. "Line by line" (page.tsx:61, 235, 586; philosophy:66; curriculum:71) is not what the matrix shows.

Evidence claim vs product: hub/faq/page.tsx:20 "Delivery is recorded with one tap per lesson ... per pupil judgements take a tap each", while schools/app/teach/[module]/page.tsx:8-11 passes completeEndpoint null because "this app has no API surface ... nobody to record a completion against" (:82).

## 4. Public sample lesson

None on the schools site. /lesson/*, /teach/*, /print/*, /hub/cpd, /hub/dsl are gated; sitemap.ts:12-16 lists only the five open pages. The home page "SEE A LESSON OPEN" (page.tsx:373-398) shows MapPreview module cards and the phase pills, not a lesson.

Publicly served legacy files: public/GC-Module9-TeacherNotes.html, GC-Module9-Worksheet.html, GC-Module9-FeedbackSheet.html (titled "Teacher Notes — Module 9", marked "Confidential — not for distribution", 44 dashes). They describe "Social Media and the Brain", which is not manifest module 9. Root GC-Module9-SocialMediaBrain-KS3.pptx (not served) has 10 slides with 9 to 18 paragraphs each plus notes: "heading plus one bullet" does not hold.

Parent app: one free taste lesson per stage after signup (lib/content/lesson-access.ts:3-7), not public.

## 5. Six phase lesson model

Defined shared/lesson-slides.ts:35-47, labels Connect, Recall, Teach, Practise, Prove, Reflect. Marketed at schools/app/page.tsx:382-386 and philosophy:177. Data: all 21 decks carry starter, teach, practise, prove, close only. connect exists in one lesson (199_lesson_1_to_the_standard.sql:48, :61). lesson-slides.ts:32-34 admits "connect was added last ... nothing in the twenty one live lessons needed rewriting." So 20 of 21 lessons have an empty Connect phase on the strip.

## 6. SEND and EAL, disclosure guidance, CPD

- Differentiation: every module has support, stretch and paper_fallback (033:242-246), rendered as "Reaching everyone" (lesson/[module]/page.tsx:284). SEND and EAL appear 0 times in 033; only in plans/world-class-curriculum.md:77.
- Disclosure: DSL notes on 10 of 21 rows; lesson page "Before you teach this one" (:305-311); crosswalk schools/app/hub/dsl/page.tsx (gated).
- CPD: schools/app/hub/cpd/page.tsx:6-8, five briefings hardcoded in the page (:15-56: M08, M14, M16, M17, M18), gated, not in the database.

## 7. Parent homepage sections and CTAs

app/page.tsx (1,208 lines): header :224; hero :279; "Ask DiGi anything" :426; how it works :583; "Inside the platform" :645 (with SeeInside, its own section); "Safety without surveillance" :700; "What changes and when" :747; PassportSection :791; stages :798; about :854; testimonials and pricing :912 (pricing :942); FAQs :1066 (9); "Start today" :1086; footer :1114. 12 sections plus 2 component sections = 14 blocks, each padded about 72 to 120px top and bottom. Pixel length not measured; "seventeen viewports" cannot be confirmed from source.

CTAs on the homepage route to /starter-pack at :300, 416, 460, 548, 635, 844, 891, 951, 971, 997, 1010, 1101, PassportSection.tsx:117, SeeInside.tsx:94, HeaderActions.tsx:87, DigiGreeter.tsx:107; /passport (PassportSection.tsx:120); /evidence (:903); schools redirect (:690). /join: every CTA is /starter-pack (:199, 238, 325, 349, 464, 623, 711, 734, 760, 796). Non negotiable 9 holds.

## 8. Reveal animation

Parent components/marketing/HomeReveals.tsx: :19 returns early on prefers-reduced-motion; :32-37 hides only .fu elements below 0.9 x innerHeight via gsap.set opacity 0; :38-42 ScrollTrigger.batch once with clearProps; hero excluded :26. Comment :15-16 "content is fully visible without JavaScript because hiding only happens here." app/globals.css has no .fu or .reveal rule setting opacity 0. Schools HomeReveals.tsx is the same pattern.

Exception: schools/components/Reveal.tsx:23 useState(false) then :46 opacity: shown ? 1 : 0 inline. Server HTML ships opacity 0 and it becomes visible only after the IntersectionObserver in useEffect (:32-36). It wraps the schools hero (schools/app/page.tsx:329, 350), so the headline and "Request a free pilot" are invisible before hydration and stay invisible if JS fails. Hypothesis holds for the schools hero only. Global reduced motion CSS: globals.css:524-527 and tokens.css:396-399.

## 9. Accessibility

- Accessibility statement: none. Skip link: none.
- Focus: the only :focus-visible rule is .placard-wrapper:focus-visible (globals.css:601). tokens.css:327 .input outline none with focus shown only by border colour; 23 tsx files set outline none inline. No global visible focus ring for links and buttons.
- Tab bars: components/kid/KidTabBar.tsx:40-64 buttons carry a visible label plus icon, about 46px tall, no aria-current or aria-pressed; components/dashboard/MobileTabBar.tsx:125-166 links carry a visible label and aria-current (:145). Icon only hypothesis does not hold.
- Forms: UnlockForm 1 label 1 input, InvoiceForm 7 labels 6 inputs, DrawForm 5 and 5.
- Contrast (computed from shared/tokens.css): butter #EDC35F on ink #1A1A2E 10.2:1 pass. Failures: --green-dark aliased to butter (tokens.css:84) used as text for the matrix ticks (rshe-mapping:69) and "Why now:" (curriculum:115) at 1.57:1; white on #C99A28 "Ready to teach" (curriculum:178-183) 2.58:1; --ink-muted #8888A0 3.46:1 on white (mono eyebrows, the "21 of 21" line curriculum:53); --ink-light #AEAEC0 2.18:1 (footer copyright schools/app/page.tsx:747, curriculum:200); --terracotta-dark link text 2.58:1 (curriculum:71).

## 10. Branding: Social Billboard

Decision on record: lib/content/contact.ts:20, Justin 9 August 2026 "Not by the social billboard." Still live, user facing:
- schools/app/page.tsx:747 footer "© 2026 The Social Billboard · Justin Phillips".
- app/(marketing)/join/page.tsx:820 footer "© 2026 The Social Billboard".
- app/(marketing)/digitalwellbeing/page.tsx:117 footer "© 2026 The Social Billboard · Justin Phillips".
- app/page.tsx:886 founder bio "founder of The Social Billboard and Guided Childhood" (intentional, historic).
- schools/app/page.tsx:36 MAILCHIMP_ENQUIRY = mailchi.mp/thesocialbillboard/school (pilot CTA at :339, 700, 703, 741).
- schools/app/hub/data-protection/page.tsx:106 "Questions to justin@thesocialbillboard.com" (gated).
- Static public/*.html: index.html:1104 footer and :23 JSON-LD worksFor "The Social Billboard", 20 plus Mailchimp waitlist buttons; schools.html:442-761; evidence.html:291; five-questions.html:163; school-pack.html:128-366; social-billboard-landing.html (whole page). digitalwellbeing/index.html:539-657 "provided by The Social Billboard".
- Backend defaults justin@thesocialbillboard.com in 35 API, cron and admin files (env fallback, not user facing).

## 11. Passport naming

Locked decision plans/decisions.md:9016-9017 and :9046: never "digital passport" in UK school marketing (UKCIS collision). Schools site complies ("the passport to sixteen", schools/app/page.tsx:29, 253, 566, 718). Parent site uses "Digital Passport": app/page.tsx:26, 36, 44, 162, 164, 190, 297, 677; components/marketing/PassportSection.tsx:48. /passport page title is "The Social Media Passport" (app/(marketing)/passport/page.tsx:13), description "your child's social media passport" (:15); join/page.tsx:126 "A passport to sixteen". Three names on one funnel.

## 12. Summary

Hold: the 21 of 21 plus "rest in production" line; scheme not inspectable and pricing says the catalogue is open; 2025 on 2026 pages and KCSIE 2025 hooks on the public matrix; mapping to broad names with "line by line" overstated; no public sample lesson; legacy Social Billboard footers on schools home, /join, /digitalwellbeing and every static page; passport naming inconsistent against the locked decision; schools hero SSR renders opacity 0; no accessibility statement, skip link or global focus visible; several sub 3:1 text colours.

Do not hold: "files are outlines" (21 DB lessons carry 12 to 27 scripted slides with 800 to 2,150 script words, misconceptions, differentiation, paper fallback, worksheet with answer key, assessment, parent note, DSL note); "slide deck is heading plus one bullet"; ".fu reveal hides content before JS" on the parent site; "icon only tab buttons"; "statutory by construction suggests certification" (phrase exists, no approved or accredited wording; the risk is implication); seventeen viewports unmeasured.

Top five gaps: evidence claims outrun the product (teach route records nothing, matrix maps to topic names); no inspectable lesson for a head; date and vocabulary drift; six phases marketed but 20 of 21 decks have no Connect slide, video beats empty, interactives on 2 of 21; accessibility baseline missing.
