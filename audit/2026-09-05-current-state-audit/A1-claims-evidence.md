# Appendix A1: public claims register (evidence)

Read only sweep of origin/main 97ef53a on 5 September 2026. Paths relative to repo root.

Surface key: parent site = the Next app (app/, components/marketing, lib/content); legacy public HTML = static files in public/*.html, still served at their .html paths (no redirect touches them, not in app/sitemap.ts); schools site = schools/app; evidence pages = digitalwellbeing/index.html (Digital Health Report site), public/evidence.html, public/evidence-report.html and the two root PDFs; email = emails/; app or DiGi = lib/digi, shared/social-media-law.ts, DB seeds; content drafts = content/, briefings/, research/, plans/, .claude/skills.

## 1. "Blue light delays sleep onset by 90 minutes"

| Quote | Path:line | Surface |
|---|---|---|
| "You are not overreacting. Blue light delays sleep onset by 90 minutes and teenagers need 9 hours. The argument is not about the phone. It is about the bedroom." | app/page.tsx:101 (flip card "Bedtime every night") | parent site homepage, no source |
| "Screens off 60 to 90 minutes before bed." / "Children's melatonin suppression from blue light is 2.7 times greater than adults ... Lee et al. (2018)" | public/trust.html:588-589 | legacy public HTML |
| "Devices off 90 minutes before bed. The Chang et al. PNAS study used four hours of evening screen use..." | public/trust.html:648 (also 689, 735, 777, 821, 865) | legacy public HTML |
| "Blue light blocking in the evening ... advances melatonin onset by 30-90 minutes in adolescents." | supabase/seeds/009_daily_moments_seed.sql:303 | app, moment cards in DB |
| "pre-sleep use extends sleep onset by 60 min on average" | digi/06-scenarios.md:224 | internal DiGi doc |

## 2. "It is the phone"

| Quote | Path:line | Surface |
|---|---|---|
| "The research says yes, it is the phone. A mood drop after screens is a tracked signal, particularly for girls aged 11 to 13. The phone creates a contrast effect: real life feels flat after the stimulation." | app/page.tsx:109 (flip card "Mood crash") | parent site homepage |
| "The problem is not the phone. The problem is nobody gave parents a map." | app/page.tsx:889 | same page, direct contradiction of :109 |
| "It is the phones. It is social media. We see it every single day." (frontline view, then argued against) | public/evidence-report.html:157, :206 | evidence essay |

## 3. "One consistent routine replaces most daily arguments within two weeks"

| Quote | Path:line | Surface |
|---|---|---|
| "The fix is structural, not stricter. One consistent routine replaces most daily arguments within two weeks." | app/page.tsx:156 (FAQ; the FAQS array is serialised into FAQPage JSON-LD at :210-217) | parent site homepage plus structured data |
| "Track it for two weeks. The pattern becomes the conversation." | app/page.tsx:109 | parent site |
| "Ten seconds to read, works within a week when you hold it warmly and consistently." | emails/01-welcome-day-0.html:16 | email |
| "Stage 3 and 4 parents see real change within weeks." | public/index.html:873 | legacy public HTML |

## 4. "Nine in ten parents argue"

| Quote | Path:line | Surface |
|---|---|---|
| "Nine in ten parents argue with their kids over screens, and policing without a plan is exactly what every parent has been left to do." | app/page.tsx:591 | parent site homepage |
| "Nine in ten parents argue with their kids over screen time. 54 percent regret ... 47 percent feel..." | THE-STORY.md:39-41 | internal source of the copy |
| "Survey backing: 9 in 10 parents argue with their kids over screen time, half at least weekly; 28 per cent ... (StudyFinds)" | research/homepage-audience-language.md:18 | the only provenance, a StudyFinds secondary |
| "9 in 10 UK parents worried about their child's online safety. Yet 73% feel they lack the knowledge to help." | public/pitch-deck.html:1006, pitch-deck-print.html:492 | legacy investor deck, different claim |

"90% of parents": NOT FOUND.

## 5. "Kids disable control apps in days"

"Control apps sell certainty and deliver an arms race. Kids disable them in days, and every fight gets worse." app/page.tsx:708, parent site homepage, no source.

## 6. Poverty 32% and social media 3%

NOT FOUND on any live user facing surface. Found only in content drafts and a skill: .claude/skills/viral-post/SKILL.md:36-44 (the reference post: "child poverty accounts for an estimated 32% of child mental health outcomes consistent with every major longitudinal study including the Avon Longitudinal Study and the British Journal of Psychiatry 2025 ... Social media sits at roughly 3%"); content/voice-samples/viral-posts.md:16-22; content/packs/2026-07-04-the-haidt-phenomenon/haidt-pack.md:81; content/packs/2026-07-08-posting-calendar/README.md:12; content/packs/2026-08-13-louder-than-the-evidence/carousels/post-3-the-wrong-villain.html:43. The repo's own note content/packs/2026-07-06-big-social-media-investigation/verification-notes.md:28 says the beta 0.061 figure and the 3% vs 32% fractions "are DIFFERENT measurements from DIFFERENT analyses. Never present as one figure or one source."

Nearest 32% on a public surface is a different fact: "Meta internal research: 32% of teenage girls said Instagram worsened their body image" public/evidence.html:212.

## 7. Australian ban "60% bypassed"

| Quote | Path:line | Surface |
|---|---|---|
| "In Australia around 60 percent of children found a way around the ban within weeks, and the most influential stayed on, so the social norm never shifted." source line "Reported outcomes of the Australian under 16 ban" | lib/content/passport.ts:41-42 (rendered at app/(marketing)/passport/page.tsx:184 and components/pathway/SocialMediaReadiness.tsx:42) | parent site /passport plus app, no named source |
| "61% of Australian under-16s retained access within six months. 70% found circumvention easy." "(Molly Rose Foundation, March 2026, n=1,050)" "only ~25% compliance among 14 to 15 year-olds" | public/evidence.html:153, 181-186, 202 and both root PDFs | evidence pages |
| "Australian data shows two thirds of the target group remain on banned platforms through workarounds." | shared/social-media-law.ts:25 (DiGi context, only under full_ban_u16 flag) | app, DiGi prompt |

Three different figures (60%, 61%, two thirds) for the same fact.

## 8. Ban stated as already in force

| Quote | Path:line | Surface | Tense |
|---|---|---|---|
| "The UK ban delays social media access until 16 but does not teach children anything." | app/page.tsx:164 (FAQ plus FAQPage JSON-LD) | parent site | present tense, reads as in force |
| "The ban delays the apps until 16 but teaches nothing." | components/marketing/FaqAccordion.tsx:11 (used on /join) | parent site | present tense |
| "The UK under 16 social media ban was announced. Spring 2027." | components/marketing/AnnouncementBar.tsx:29 | parent site | correct |
| "UK social media ban confirmed · Spring 2027" / "The ban comes into force." / "Spring 2027 is the date." / "The ban is coming." | app/(marketing)/join/page.tsx:217, 561, 618, 621 | parent site | correct |
| "The under-16 social media ban starts Spring 2027." / "The Children's Wellbeing and Schools Act 2026 bans under-16s from social media in Spring 2027." | app/(marketing)/ban-workarounds/page.tsx:6, 218, 224 | parent site | correct (hyphenated "under-16s") |
| "The ban comes in Spring 2027." | app/(marketing)/pathway/page.tsx:338 | parent site | correct |
| "The under 16 social media ban is coming, and it will take the apps." / "The ban is not the plan. It removes the apps until sixteen." | schools/app/philosophy/page.tsx:219, 306 | schools site | first correct, second present tense |
| "UK LEGISLATION IN FORCE: Full access ban for under-16s on social media is now live." | shared/social-media-law.ts:25, only if NEXT_PUBLIC_SOCIAL_MEDIA_LAW=full_ban_u16; partial_ban text at :24 says "The ban is not yet in force" | app | flag driven, correct |
| Comment: "The under 16 ban. Announced 15 June 2026 and NOT YET LAW ... expected SPRING 2027 ... anything that implies the ban has landed would be wrong for months" | supabase/migrations/153_three_missing_scripts.sql:27-31 | internal rule, contradicted by app/page.tsx:164 |

## 9. "Science backed", "proven", "validated", "evidence based", "Ofsted", "statutory by construction"

| Quote | Path:line | Surface |
|---|---|---|
| "Age by age lessons, habits and quests for UK families, all science backed, finished with your child's Digital Passport." | app/page.tsx:26 (meta), :36 (OG), :44 (Twitter), :190 (Organization JSON-LD), :297 (hero sub) | parent site |
| "Built on five of the world's leading researchers in children, social media and mental health, and live data from more than ten national bodies. Reviewed weekly" | app/page.tsx:322; near duplicate :903 "Five leading researchers ... more than ten national associations, NHS and NSPCC among them. Every lesson and every DiGi answer reviewed weekly against the newest findings" | parent site |
| "DiGi your evidence led guide" | app/layout.tsx:69; app/page.tsx:162; join/page.tsx:77; pathway/page.tsx:366; investor/page.tsx:31 | parent site |
| "Research-backed. Tested with parents. TRUST runs through every action, script, and lesson from age 4 to 16." | join/page.tsx:366 | parent site |
| "DiGi is trained on the same evidence base as the UK Surgeon General Advisory and Ofcom's media literacy framework. No opinions. Just the science." | join/page.tsx:482 (there is no UK Surgeon General; the Advisory is US) | parent site |
| "The framework is evidence based not fear based" | components/marketing/FaqAccordion.tsx:35; public/index.html:881 | parent site and legacy |
| footer tags 'Online Safety Act 2023', 'DfE', 'Ofcom', 'Statutory RSE' | app/page.tsx:1196 | parent site, implied alignment |
| "the coverage evidence Ofsted asks for" | schools/app/page.tsx:24 (meta), :336 (hero) | schools site |
| "Statutory by construction" (title) "The RSHE guidance becomes compulsory on 1 September 2026 and every module maps to it line by line." | schools/app/page.tsx:234-235 | schools site |
| "What evidence does it give us for Ofsted?" / "under the renewed Ofsted framework" | schools/app/hub/faq/page.tsx:20; schools/app/hub/dsl/page.tsx:51 | schools site, gated hub |
| "We will never tell you social media has been proven to cause mental illness ... And no expert named on this page endorses this product" | schools/app/philosophy/page.tsx:319 | schools site, the disclaimer |
| "Five evidence-based principles ... Built on peer-reviewed research from Harvard, Oxford, UC Berkeley and LSE" / "7 science-backed rules" / "validated clinical screening tools used by sleep and child health specialists" | public/trust.html:7, 12, 289, 292, 574, 575, 668, 867, 974 | legacy public HTML |
| "Built for Ofsted readiness." / "In force · Ofcom enforcing · Ofsted aware" / "UKCIS 2020 · DfE recommended" | public/index.html:455, 647, 1000, 1003, 1005 | legacy public HTML |
| "Ofsted evidence, ready to print" / "Evidence-informed. Research-backed. Built on Orben, Odgers, Przybylski, and Livingstone." / "Ofsted aware" / "DfE recommended" | public/schools.html:535, 541-542, 669, 671 | legacy public HTML |
| "Built, validated, growing." | public/pitch-deck.html:1014, pitch-deck-print.html:500 | legacy investor |
| "trained on peer-reviewed child development research, attachment theory, digital media studies, and real-world parenting data" | lib/digi/system.ts:35, 43 | DiGi prompt |
| "The signals we look for come from trusted, peer reviewed research by leading experts" | digitalwellbeing/index.html:594 | evidence microsite |
| "it has read the research from Odgers, Orben, Livingstone and the NHS guidance" | emails/03-digi-nudge-day-4.html:16 | email |

"DfE approved": NOT FOUND. "Ofsted ready": NOT FOUND verbatim. "Proven": only in the schools disclaimer and code comments.

## 10. Named researchers

- Orben: app/page.tsx:158 ("Research by Dr Amy Orben at Cambridge identifies ages 11 to 13 as the highest sensitivity window, particularly for girls"), :452 ("Built on Odgers, Orben, Przybylski, Livingstone and the NHS guidance"); join/page.tsx:489; digitalwellbeing/page.tsx:96; digitalwellbeing/index.html:443, 597; schools/app/page.tsx:241 (with Nature Comms 2022 and correlational caveat); schools/app/philosophy/page.tsx:90-96 (link plus "We never cite this work as proof"); lib/content/readiness.ts:147; lib/content/stage-quizzes.ts:55; emails/03:16; public/index.html, public/schools.html:542, public/school-pack.html:356, public/GC-Module9-TeacherNotes.html:201-204.
- Przybylski: app/page.tsx:160, 452; join:490; schools/app/philosophy/page.tsx:106 (Psych Sci 2017 link); public/evidence.html:190; PDFs.
- Odgers: app/page.tsx:160, 452; join:488; digitalwellbeing:96; digitalwellbeing/index.html:599; schools/app/philosophy:122; lib/content/social-insights.ts:14-30 (six in app insight cards each "source: 'Candice Odgers'"); lib/content/readiness.ts:147; emails/03:16.
- Haidt: public/trust.html:368-371 (quoted, with a caveat); content and PDFs (critiqued); lib/digi/system.ts:61. Not on the live parent or schools site.
- Twenge: digitalwellbeing/index.html:598 ("Kids born between 1995 and 2012 show more depression ... which is why we set limits by age and gender. Jean Twenge") uncaveated; public/trust.html:1005; PDFs (critiqued).
- OECD: app/page.tsx:170 ("OECD research finds device access among UK teenagers is now nearly universal"), no citation.
- Ofcom: app/page.tsx:1196; join:482; ban-workarounds/page.tsx:436 ("73% of UK teenagers who know about the ban say they plan to find a workaround ... Ofcom · Children and Parents Media Use and Attitudes 2025"); public/evidence.html:253; public/digital-literacy.html:643-647.
- Livingstone: app/page.tsx:452; join:491; emails/03:16; public/schools.html:542.
- Fassi, Brosnan, Tang, POSTnote: NOT FOUND anywhere.

Only schools/app/philosophy/page.tsx:319 states that no expert endorses the product. The parent site's "five of the world's leading researchers" (app/page.tsx:322) never names the five; the /evidence page names nobody.

## 11. Testimonials

| Quote (abridged) | Path:line | Surface | Label |
|---|---|---|---|
| Rachel; Joanne Reed; Maria Daniels | app/page.tsx:125-138, rendered :915-931; Rachel in hero :327 | homepage | "From our first families" / "Real words from real parents". Code comment :123 "The only real testimonials. Never invent a fourth." |
| Sarah (Stage 2), Emma (Stage 3), Mark (Stage 3), Laura (Stage 4), each five stars | join/page.tsx:141-170, rendered :581-600 | /join | "What parents say". No illustrative label. Four names that are not the three the homepage calls the only real ones. |
| Sarah M., Tom K., Clare H. with five stars | public/index.html:717-719 | legacy | No label |
| "131 parents already on their pathway" / waitlist | public/index.html:473, 492, 498, 891 | legacy | social proof count |
| Five stage quotes ("I cannot get my four year old off the iPad...") | app/page.tsx:58-87 (comment :51 "verbatim parent quotes per stage"), rendered :826-828 | parent site | unattributed |
| "That took one parent 20 seconds to ask, and it changed their evenings." | emails/03:16 | email | anecdote |

The word "illustrative" appears on no user facing surface.

## 12. Numbers in marketing copy

Parent site: "160 scripts" app/page.tsx:407, 657, :162, join:69, 234, 250, 699, 727, starter-pack/ResultScreen.tsx:333; "100 plus scripts" scripts/page.tsx:64, pathway/page.tsx:366, emails/04:16 (conflicts with 160); "100 lessons" app/page.tsx:407, 658, :162, join:110-111, 252, FaqAccordion.tsx:7; "All 20 units" pathway/page.tsx:358, 366; "5 stages"; "24 age gated learning games" app/page.tsx:162, 687; "five of the world's leading researchers ... more than ten national bodies" :322, :903; "Ten minutes a day" :599; ban-workarounds "73% ... Ofcom 2025" :434-436, "2 min ... Internet Watch Foundation 2025" :440-442, "6 in 10 Secondary school teachers ... NASUWT Teacher Survey 2025" :443-445 (none of these three appears in any research or verification file in the repo).

Schools site: "21 modules" schools/app/page.tsx:24, 29, :280, philosophy:82; stats strip "8 of 8 Connected World strands", "0 pupil accounts", "48 hrs from enquiry to your pilot" :360-363; "From £1.50 per pupil per year" pricing/page.tsx:15, 34; "£795 a year or £1.80 per child" pricing:74. "330 statements": NOT FOUND. "X schools": NOT FOUND.

Evidence pages: digitalwellbeing/index.html "3.2 Trust Score", "4 signals across 2 apps" :317-318; "18 to 20 months ... CAMHS" :519-520 (no source); "£29.99 /month", "£9.99 one time" :560-575; public/evidence.html "r < 0.04", "n=355,358" :145, 189-190; "61%", "70%", "~25% compliance" :153, 181-186; "32% of teenage girls" :212; "£18 million or 10% of global revenue. Six fines" :253; public/evidence-report.html:131 "Across 355,000 adolescents, digital use explained under one percent of the variance".

Legacy: public/index.html "131 parents"; public/trust.html:589 "2.7 times", :1012 "61% higher risk ... Medical Daily (2026) N=50,231"; public/digital-literacy.html:643-647 "97% of UK children aged 3 to 17 are online Ofcom 2024".

## 13. app/(marketing)/evidence/page.tsx

Code comment :14-15: "DRAFT: the evidence stance, plain and defensible. Swap in the full cited library from the kids-research briefings when ready." Four stance paragraphs (:17-20: displacement, balance beats bans, repair, boredom), none cited; "Where DiGi gets its answers ... grounded to named sources" (:39-42) names no researcher, body or paper; an email gate MagnetGate slug evidence (:45-49). The homepage sends readers here for the names (code comment app/page.tsx:897 "Science backed, said once, names live on the evidence page"). Not in app/sitemap.ts.

## 14. Existing claim register

None. Nearest: research/2026-08-31-marketing-evidence-research.md (graded VERIFIED / LIKELY / UNVERIFIED with URLs and HARD RULE lines, scoped to the schools /philosophy page); research/homepage-audience-language.md (parent language mining); .claude/agents/citation-verifier.md (process agent); per pack verification notes in content/packs/*; supabase/migrations/145_source_urls_and_odgers_spelling.sql (source URLs on knowledge rows); shared/lesson-slides.ts:156 "stat" slide type. Nothing covers the homepage claims in items 1 to 5 and 8.

## 15. The "Wrong Villain" evidence experience

evidence.guidedchildhood.com: NOT FOUND anywhere in the tree. "Wrong Villain" in this repo is a LinkedIn series name. It lives in .claude/skills/viral-post/SKILL.md:22-52 (the reference post: "46 studies and 79 effect sizes ... beta = 0.061 ... child poverty ... 32% ... ACEs 24% ... parental mental health 14% ... social media roughly 3%" and "The full 54 year interactive data tool is live drop PATHWAY in the comments" at :50), content/voice-samples/viral-posts.md, the ban and Haidt packs, and post-3-the-wrong-villain.html. The interactive data tool is not in the repo and no method or data dictionary is published. briefings/2026-08-28-meta-sentiment-and-settlement-v3.html:499 traces beta 0.061 to Ferguson, Kaye, Branley-Bell and Markey (2025), DOI 10.1037/pro0000589.

The root PDFs evidence-paper.pdf (11 pages) and evidencepaper.pdf (7 pages) are "The Social Media Ban and the Evidence We Owe Children", a self described narrative review ("This paper is not peer-reviewed. Every source it cites is."). Neither is in public/, so the download link in public/evidence.html:314 (/evidencepaper.pdf) would 404.

digitalwellbeing/index.html uses its own causal framing without method: "Social media did not start the problem. But it found it." :379; the Twenge claim :598; "18 to 20 months" CAMHS wait :520; a "Trust Score" and "Signal Score" :318, :497 with no published scoring method.

## Dashes as punctuation in user facing copy

Next app pages, components/marketing, schools/app and emails/ are clean (hits are code comments, arithmetic or compounds such as "under-16s" at ban-workarounds/page.tsx:6, 45, 224). Dashes survive in: public/starter-pack.html:308, 317, 319, 330, 340, 372 and en dashes in age options :204-234, 256, 276; public/pathway.html:450; public/digital-literacy.html:790-792; public/school-pack.html:208; public/trust.html:280, 648; public/index.html:775, 1049; public/schools.html:693; public/evidence.html:198; supabase/seeds/009_daily_moments_seed.sql:126, 276, 303 (moment card text shown to parents); lib/digi/system.ts:35, 44, 48 and shared/social-media-law.ts:24 (prompt text, stripped on output by the dash filter).

## Most important observations

1. The homepage app/page.tsx carries items 1, 2, 3, 4, 5 and 8 verbatim or near verbatim (:101, :109, :156, :164, :591, :708), none sourced, and two (:156, :164) are also in FAQPage JSON-LD so Google indexes the two week promise and the present tense ban wording.
2. The same page contradicts itself: "it is the phone" (:109) against "The problem is not the phone" (:889).
3. The /evidence page is a code marked DRAFT with four uncited paragraphs and no researcher named; "five leading researchers" and "more than ten national bodies" are never listed on the parent site.
4. Testimonials are inconsistent: three "only real" on the homepage, four different names on /join, a third set plus "131 parents" on the still served public/index.html. Nothing is labelled illustrative.
5. Product numbers drift: 160 vs "100 plus" scripts; "100 lessons" vs "All 20 units"; Australia 60% vs 61% vs two thirds.
6. Legacy public/*.html pages remain reachable with the strongest overclaims in the repo, and public/evidence.html links a PDF that is not there.
7. ban-workarounds/page.tsx:434-445 attributes three statistics to Ofcom, IWF and NASUWT with no verification file behind them.
8. join:482 claims a "UK Surgeon General Advisory" (no such office).
9. The 32% / 3% attribution is not on any public product surface; it lives in the viral post skill and content packs, and the repo's own verification note warns against it.
10. The schools /philosophy page is the one surface that does this well; its backing file research/2026-08-31-marketing-evidence-research.md is the closest thing to a claims register.
11. shared/social-media-law.ts already provides the flag; app/page.tsx:164 and FaqAccordion.tsx:11 bypass it, against the rule in migration 153:27-31.
