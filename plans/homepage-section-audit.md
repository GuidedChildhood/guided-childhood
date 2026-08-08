# Homepage Section Audit

Stage 1b of the homepage rebuild plan (plans/homepage-rebuild-plan.md).
File audited: app/page.tsx (2,930 lines). Date: 8 August 2026.
Every section listed in page order. Verdicts map to the 10 slot spine in the plan:

1. Hero (locked message)
2. The 11 o'clock moment (DiGi)
3. We drive you (the five stages as the visual pathway)
4. Inside the platform (proof, not promises)
5. Watching with you (safety, mental health, offline balance)
6. Three acts (tonight, this term, sixteen with the passport)
7. Stage cards with real parent quotes
8. Justin's story and the research bench
9. Testimonials and the 30 day guarantee, with pricing
10. Final CTA

Page chrome (AnnouncementBar line 273, sticky nav 360 to 411, HomeReveals GSAP wrapper 274, footer 2859 to 2926) is not scored. Nav CTAs: Log in routes to /login, Get Started routes to /starter-pack.

## Section by section

### 1. Hero · lines 416 to 582 · id "hero", aria-label "Hero"
Says: the pathway promise, three benefit ticks, founder rate badge, proof bar with one real quote, two coded app preview cards.
Headline: "Raise a digitally literate child, ready by 16."
Verdict: KEEP, feeds slot 1. Headline and subline are replaced wholesale by the locked message ("A clear digital pathway from first screen to 16.") and the CTA label becomes "Start with the free check".
Port: founder rate badge copy "First 50 families, 7.99 a month for life" (452 to 456), proof bar naming Odgers, Orben, Knibbs, NHS, NSPCC (465 to 467), Rachel quote slot (468 to 472), benefit ticks (433 to 437), the coded dashboard and child quest preview cards (479 to 577). The secondary anchor link "Or find your stage first" (458) is cut, one CTA only.

### 2. Product moment · lines 590 to 717 · aria-label "Inside the platform"
Says: parent card and child card side by side, tonight's script, road to 16 progress, star timer, DiGi row.
Headline: "Here is what tonight looks like"
Verdict: MERGE into slot 6 (act one, tonight) or slot 4.
Port: both coded cards (605 to 714), the line "Even at 11pm, especially at 11pm" (646), the bedtime handover script "The phone charges in the hallway from tonight. Whole house rule, mine included." (620), figcaptions "Your side · ten minutes a day" and "Their side · quests, stars and earned screen time" (651, 711).

### 3. The problem · lines 723 to 741 · aria-label "The problem"
Says: three felt problem lines then the turn to a third way.
Headline (eyebrow): "The bit nobody says out loud"; turn line: "There is a third way, a guided one. End the screen time fight, for good."
Verdict: MERGE into slots 1 and 2. The line "Every answer you find says ban it all, or give in and dread it. Neither one teaches your child a single thing." (729 to 730) is the best ban framing on the page and belongs right under the locked hero.

### 4. How it helps · lines 746 to 800 · aria-label "How it helps"
Says: the model in three numbered steps: ten minutes a day, the road to 16, they earn their screen time.
Headline: "Three things, done daily"
Verdict: MERGE into slot 3 (We drive you). These three cards ARE the drive pillar in embryo.
Port: all three step bodies (760 to 778), CTA label "Start tonight" (796).

### 5. What early families say · lines 806 to 843 · aria-label "What early families say"
Says: the only three real testimonials on the site.
Headline: "Real words from real parents"
Verdict: KEEP, feeds slot 9 (Rachel also seeds the hero proof bar).
Port: the three quote objects verbatim (816 to 828): Rachel, Joanne Reed, Maria Daniels. Joanne's quote proves pillar 2 (DiGi memory): "I have so many moments like that in a week, and DiGi remembers them."

### 6. Authority bar · lines 848 to 866 · aria-label "Research foundations"
Says: one strip of institutions, "Built on research from".
Headline: none (strip).
Verdict: MERGE into slot 8 (research bench).
Port: institution list (853 to 859): UC Irvine, Oxford Internet Institute, University of Cambridge MRC, LSE London, Prof. Sonia Livingstone.

### 7. Stats strip · lines 871 to 889 · no label
Says: four big numbers.
Headline: none.
Verdict: MERGE into slot 4 (specific claims beat adjectives).
Port: the stats array (874 to 877): 160 scripts, 100 lessons, 5 stages, 2027 ban. Verify counts against the database before shipping.

### 8. PassportSection · line 896 · component components/marketing/PassportSection.tsx
Says: the passport as the idea the platform turns on, cover plus stamped page visual.
Headline (in component, lines 26 to 29): "Your child's social media passport"
Verdict: KEEP, feeds slot 6 (the finish line at sixteen). Pending Justin's open decision 3 in the plan; if he says move it, it goes to /passport and slot 6 keeps a smaller passport moment.
Port: the whole component import (page.tsx line 9). Its secondary link to /passport (component line 175) is reviewed under the one CTA rule.

### 9. SeeInside · line 902 · component components/marketing/SeeInside.tsx
Says: real product screenshots, "the primary trust signal".
Headline (in component, lines 48 to 51): "This is the real thing, not a mockup"
Verdict: KEEP, feeds slot 4 (proof, not promises).
Port: component import (page.tsx line 10) and its tiles including "Stamped, not nagged". Its CTA already routes to /starter-pack.

### 10. DigiGreeter · line 906 · component
Behaviour, not a section: DiGi pops up once per visit, CTA to /starter-pack.
Verdict: KEEP as chrome supporting slot 2.

### 11. What you get · lines 912 to 1003 · aria-label "What you get"
Says: one card, eight icon benefits covering the whole platform.
Headline: "One calm system. Every part earns its place."
Verdict: MERGE into slot 4. This is the single best platform inventory on the page.
Port: all eight benefit items (927 to 975) including "DiGi, your always on guide", "The road to 16, with passport stamps", "The star timer", "Their own app"; the footer line naming the family agreement, wellbeing tracker, printables in English and Spanish, and 24 learning games (994 to 995).

### 12. The digital literacy divide · lines 1008 to 1092 · aria-label "The digital literacy divide"
Says: OECD and LSE essay, the second digital divide, the deep water swimming reframe with DigiWalker.
Headline: "Every child has a device now. That was never the hard part."
Verdict: MERGE, heavily cut, into slot 3. The essay is a library block, but the swim analogy is the strongest "nobody tells you what to build" writing on the site.
Port: the deep water pair of cards (1052 to 1066), the line "Guardrails you teach. Not gates you lock." (1073), the sources line (1087). The three stat tiles (1029 to 1032) move to a blog or /pathway page, not the homepage.

### 13. Stage pathway walkthrough · lines 1097 to 1320 · no label
Says: the five stages again, as photo cards with a connector line, then a DiGi trust block.
Headline: "From first screen to digital independence"
Verdict: CUT. Duplicates section 14 (same STAGES array rendered twice on one page).
Port before cutting: the five stage photo URLs (1135 to 1141), the DiGi trust lines (1299 to 1303: "My answers are checked against the science every week", "I have guardrails, and the guide in your family is always you") which feed slot 2, and the line "Multiple children at different stages? One account covers all of them." (1270).

### 14. Stage cards · lines 1325 to 1479 · id "stages"
Says: the five stages as coloured cards, each opening with a verbatim parent quote.
Headline: "Where is your child right now?"
Verdict: KEEP, feeds slot 7 exactly (stage cards that open with a parent quote is the Good Inside pattern named in the plan).
Port: the STAGES array itself (43 to 80).

### 15. Features grid · lines 1484 to 1611 · no label
Says: nine tool cards on sage green.
Headline: "Our digital parenting tools"
Verdict: CUT. Repeats section 11 with more words.
Port before cutting: two unique lines: family agreement "Agreed rules hold. Imposed rules do not." (1569) and the wellbeing tracker description (1556); fold both into slot 4 or 5.

### 16. What this covers · lines 1616 to 1677 · no label
Says: five problem and fix rows (morning, homework, gaming, bedtime, TikTok).
Headline: "The fights you have every day. Scripts for all of them."
Verdict: CUT. Same moments as the PLACARDS data, told a third time.

### 17. Flipping placards · lines 1682 to 1701 · no label
Says: 13 tap to flip cards, verbatim parent language on the front, the exact script on the back.
Headline: "The situations every parent is dealing with right now."
Verdict: MERGE into slots 2 and 4. Do not ship 13 cards; pick the three strongest (Bedtime every night, Mood crash, I keep shouting) as the 11 o'clock proof.
Port: the full PLACARDS array (84 to 189). This is the best audience language asset in the codebase and also feeds Stage 1a research.

### 18. Transformation timeline · lines 1706 to 1795 · aria-label "What changes"
Says: week 1, month 1, month 3, month 6 outcome markers.
Headline: "Here is what changes and when"
Verdict: MERGE into slot 6, reshaped to the plan's three acts (tonight, this term, sixteen).
Port: all four marker objects (1728 to 1756), especially "You trust yourself as a parent again."

### 19. Script categories · lines 1800 to 1903 · no label
Says: 160 scripts across six areas, photo card grid.
Headline: "What to say in every situation"
Verdict: MERGE into slot 4. Keep the six area names as a quiet list, not six photo cards.
Port: category data and image filenames (1823 to 1828), the research pill line (1816 to 1818).

### 20. Balance · lines 1908 to 1950 · no label
Says: screens and outdoors both, done well.
Headline: "Both, done well"
Verdict: MERGE into slot 5 (the spine names balancing tech with offline explicitly).
Port: both body paragraphs (1929 to 1933), the three ticks (1936 to 1939), the outdoor photo URL (1917).

### 21. How it works · lines 1955 to 2076 · id "how-it-works"
Says: four problem and solution walkthroughs, a time stats strip, the 100 lesson coverage list, a schools and home educator card with a mailto CTA.
Headline: "Your situation. The exact script. Tonight."
Verdict: MERGE, mostly cut. Walkthroughs repeat PLACARDS. Port the unique bits.
Port: curriculum coverage list (2026 to 2034) to slot 4, time stats (2007) if the daily minutes claim is unified first, WALKTHROUGHS array (193 to 218) held in reserve for slot 3. The schools mailto card (2044 to 2073) moves to /schools.

### 22. DiGi section · lines 2081 to 2220 · no label
Says: the full DiGi pitch with a coded chat mock showing a real script exchange.
Headline: "DiGi has read every study. Ask anything."
Verdict: KEEP, feeds slot 2. Rebuild the opening around the locked 11 o'clock moment ("It's 11 o'clock and you've just seen something on their phone") and add pillar 2's memory claim, which is currently missing here.
Port: the chat mock (2117 to 2216) including the Stage 2 transition script, the four tick list (2100 to 2104), "Not general advice. The script for tonight." (2097), "Available at 11pm when the guilt spiral kicks in" (2103).

### 23. 20 issues · lines 2225 to 2277 · id "issues"
Says: twelve behaviour issues plus eight digital literacy gaps as bullet lists.
Headline: "Twenty things showing up in homes right now"
Verdict: CUT. A library listing that repeats the moments already shown.
Port before cutting: BEHAVIOUR_ISSUES (222 to 235) and DIGITAL_GAPS (237 to 246) into the audience language research file.

### 24. Mental health signals · lines 2282 to 2337 · no label
Says: behaviour signals and mental health signals, what the research says to watch.
Headline: "What the research says to pay attention to"
Verdict: MERGE into slot 5 (what to look for, child and parent mental health).
Port: both signal columns (2296 to 2308). The Digital Health Report link here (2331) is an off funnel CTA, see the CTA list.

### 25. Online risks · lines 2342 to 2387 · no label
Says: contact, content and conduct risks mapped to stages.
Headline: "Every major online risk. What it is. What you do."
Verdict: MERGE into slot 5, compressed to one row of three quiet columns or a link out.
Port: the three risk columns (2356 to 2371).

### 26. TRUST method · lines 2392 to 2434 · id "how"
Says: the five letter TRUST framework.
Headline: "One framework that runs the lot"
Verdict: CUT from the homepage. The spine has no framework slot; TRUST lives on /pathway.
Port: TRUST array (250 to 256) for the /pathway page.

### 27. About Justin · lines 2439 to 2481 · no label
Says: founder story, photo, three sentences, exactly the Good Inside pattern the plan asks for.
Headline: "I watched my daughter scroll for three hours and realised the conversation I was missing"
Verdict: KEEP, feeds slot 8.
Port: the whole block including the photo URL (2452) and "The problem is not the phone. The problem is nobody gave parents a map." (2473).

### 28. What changes · lines 2486 to 2546 · no label
Says: three outcome cards (framework not tips, skills not compliance, confidence not certainty).
Headline: "How this shows up in your home"
Verdict: CUT. Repeats the transformation timeline's message.
Port before cutting: "You trust yourself as a parent" card copy (2510 to 2512) if slot 6 wants it.

### 29. Not too late · lines 2553 to 2565 · no label
Says: the reassurance close.
Headline: "No, it is not too late."
Verdict: MERGE into slot 10. Two sentences above the final button: "There are more school pickups, more car journeys, more evenings ahead of you than behind you." (2559 to 2561).

### 30. Research · lines 2570 to 2625 · id "research"
Says: four researcher cards, the thesis in plain language, a Digital Health Report CTA box.
Headline: "Built on evidence, not panic"
Verdict: MERGE into slot 8 (the research bench beside Justin).
Port: RESEARCHERS array (260 to 265), the four thesis bullets (2600 to 2604). The report CTA box (2614 to 2623) breaks the funnel, see the CTA list.

### 31. Policy strip · lines 2628 to 2635 · plain div
Says: Online Safety Act, DfE, RSE, Ofcom compliance names.
Verdict: CUT as a section; the items (2629) move into the footer.

### 32. Schools · lines 2640 to 2686 · id "teachers"
Says: full school programme pitch with curriculum list.
Headline: "Not just safety. Full digital education."
Verdict: CUT as a full section. The plan allows exactly one quiet secondary link for schools; this becomes a single line near slot 4 or the footer, and the content lives on /schools.
Port: curriculum list (2665 to 2672) already exists at /schools.

### 33. Pricing · lines 2691 to 2802 · id "pricing"
Says: founder rate banner, three tiers (free starter pack, annual £99, monthly £12.99 with £7.99 founder lock).
Headline: "Start free. Stay as long as you need."
Verdict: KEEP, feeds slot 9 (vivid future framing above it, guarantee said once).
Port: the founder banner (2701 to 2716) and the three plan objects (2719 to 2761). Fix the two /join CTAs, see the CTA list. Founder cap of 50 is stated; confirm the code enforcement path is untouched by the rebuild.

### 34. FAQ · lines 2807 to 2818 · component FaqAccordion
Headline: "And in case you are wondering"
Verdict: CUT from the visible spine (ten sections only). Keep the FAQPage JSON-LD (307 to 344) for SEO, updated to the locked message, and consider FaqAccordion on /starter-pack instead.

### 35. Final CTA · lines 2823 to 2854 · no label
Says: the closing panel with badge, headline, two buttons.
Headline: "Start your family's guided childhood today"
Verdict: KEEP, feeds slot 10. Drop the second button (health report, external) so one CTA remains, keep "No card required · 30 day money back on launch" (2851) as the single guarantee statement.

## 1. Tally

* KEEP: 9 (Hero, Early families, PassportSection, SeeInside, Stage cards, DiGi section, About Justin, Pricing, Final CTA)
* MERGE: 16 (Product moment, The problem, How it helps, Authority bar, Stats strip, What you get, Digital divide, Flip placards, Timeline, Script categories, Balance, How it works, Mental health signals, Online risks, Not too late, Research)
* CUT: 9 (Pathway walkthrough, Features grid, What this covers, 20 issues, TRUST method, What changes, Policy strip, Schools section, FAQ)
* Total scored: 34 blocks (the "about 25 sections" estimate undercounted; DigiGreeter and page chrome not scored)

The maths of the rebuild: 9 keeps compress into the 10 spine slots, 16 merges donate their best lines, 9 blocks disappear from the homepage entirely.

## 2. The port list

Named data and components, with source lines in app/page.tsx unless stated:

* STAGES array, lines 43 to 80. Five stages with verbatim parent quotes, KS mapping, device policy per stage, colour tokens. Feeds slots 3 and 7. The single most reusable asset.
* PLACARDS array, lines 84 to 189. Thirteen moment cards: verbatim parent language front, exact script back, stage and age tagging. Feeds slots 2 and 4, and Stage 1a audience research.
* WALKTHROUGHS array, lines 193 to 218. Four problem and solution pairs. Reserve for slot 3.
* BEHAVIOUR_ISSUES (222 to 235) and DIGITAL_GAPS (237 to 246). To research/homepage-audience-language.md.
* TRUST array, lines 250 to 256. To /pathway, not the homepage.
* RESEARCHERS array, lines 260 to 265. Odgers, Orben, Przybylski, Livingstone with one line findings each. Slot 8.
* Real testimonials, lines 816 to 828. Rachel, Joanne Reed, Maria Daniels. The only real quotes; never invent more (the page's own comment at 2548 to 2551 says the same). Slot 9 plus the hero proof bar.
* PassportSection component, import line 9, file components/marketing/PassportSection.tsx. Slot 6, pending Justin's decision.
* SeeInside component, import line 10, file components/marketing/SeeInside.tsx. Real product screenshots. Slot 4.
* DigiGreeter (import 11), DigiCharacter (import 13), DigiWalker (import 7), FlipCards (import 6), HomeReveals (import 8, the GSAP fade up system), AnnouncementBar (import 4), MarketingNav (import 12), FaqAccordion (import 5).
* DiGi chat mock, lines 2117 to 2216, with the Stage 2 transition script. Slot 2.
* Coded parent and child app cards, lines 605 to 714 (and the hero variants 479 to 577). Slot 6 or 4.
* Deep water reframe copy, lines 1052 to 1066, plus "Guardrails you teach. Not gates you lock." line 1073, and sources line 1087. Slot 3.
* Stats: 160, 100, 5, 2027 (874 to 877); time stats (2007); divide stats (1029 to 1032). Verify all counts before porting.
* Curriculum coverage list, lines 2026 to 2034. Slot 4.
* Mental health signal data, lines 2296 to 2308; online risk data, lines 2356 to 2371. Slot 5.
* Timeline markers, lines 1728 to 1756. Slot 6.
* Founder rate badge (452 to 456) and pricing founder banner (2701 to 2716). Slots 1 and 9.
* Not too late copy, lines 2556 to 2561. Slot 10.
* Image URLs: five stage photos (1135 to 1141), six script category images (1823 to 1828), outdoor play photo (1917), Justin's photo (2452). All on the d8j0ntlcm91z4.cloudfront.net CDN. The plan's five asset budget means most of these do not return; keep the list for reference.
* JSON-LD structured data block, lines 277 to 355 (Organization, WebSite, FAQPage, Article). Keep, rewritten to the locked message.
* Metadata block, lines 15 to 39. Rewrite title, description and OG copy to the locked message.

## 3. CTAs that do not route to /starter-pack

House rule: every CTA on the page routes to /starter-pack, with one quiet schools link allowed.

* Pricing tiers: "Start now" on Annual OS (data line 2746) and "Start now" on monthly (data line 2758), both href /join, rendered at line 2789. The plan's funnel is quiz first; these should route to /starter-pack (the /join page itself then routes onward per non negotiable 9).
* "Run a report here." line 2331, external, https://www.guidedchildhood.com/digitalwellbeing.
* "Get your child's Digital Health Report" line 2622, same external URL, styled as a primary gold button.
* "Get the health report" line 2841, same external URL, second button inside the final CTA panel, directly competing with the last /starter-pack button on the page.
* "Contact us to find out more" line 2054, mailto:hello@guidedchildhood.com (schools and home educators card).
* "See the full school programme" line 2655, /schools, styled as a full btn-ink button, heavier than the one quiet link the plan allows. The other /schools link at 1082 is already quiet.
* PassportSection secondary link to /passport, component file line 175.
* Hero secondary anchor "Or find your stage first" line 458, href #stages; not off site but a competing action in the first screen.
* Navigation (Log in /login, footer columns, #stages and #pricing anchors) is navigation, not CTA, and is fine.

Decision needed: whether the Digital Health Report keeps any homepage presence at all. If yes, it is one quiet text link, never a button, or it becomes a step inside /starter-pack.

## 4. Contradictions and conflicts with the locked message

* The hero headline is a different message. Current: "Raise a digitally literate child, ready by 16." Locked: "A clear digital pathway from first screen to 16." The whole first screen (425 to 473) is rewritten, not tweaked.
* The CTA label is "Get Started" (446); locked copy is "Start with the free check".
* The page argues at least three theses at once: end the screen time fight (738), the real divide is who gets taught (1013 to 1015), ready is built from age 4 (OG metadata line 25). Under one message discipline they all become supporting beats beneath the locked line, or they go.
* The daily time claim contradicts itself: "Ten minutes a day" (763, figcaption 652, hero card badge 499) versus "5 min A daily moment" (2007), "Five minutes a day, a two minute check in each week" (2017), and "around five minutes a day" in the FAQ JSON-LD (331). Pick one number before build; the locked subline says week by week, so the chosen number must survive a hostile reader.
* Pillar 1 (WE DRIVE YOU, week by week, from any starting age) has no section on the current page. Closest fragments: "Weekly three action plan" (2740), the weekly round up (967 to 968), "Start where your child is" (1332). The rebuild must state the drive claim explicitly; nothing portable says it today.
* Pillar 2 (DiGi remembers, your family's history shapes every answer) is absent from the DiGi section (2081 to 2220), which sells knowledge and availability but never memory. The only memory proof on the page is Joanne Reed's quote (822). Slot 2 must add the memory claim and the "what you tell us matters" line.
* The 11 o'clock framing: the page says 11pm in three places (646, 2103, 1313); the locked copy opens with "It's 11 o'clock and you've just seen something on their phone". Align the wording when porting.
* Metadata and JSON-LD (15 to 39, 277 to 355) still carry the old messages ("Social media arrives at 16. Ready is built from age 4.") and must be rewritten with the locked line or SEO will say one thing while the page says another.
* The stats strip's "2027 Social media ban. Start now." (877) is compatible with the locked framing (the ban tells you what to take away) but must be presented as the setup for what we build, not as a fear close.
* Copy hygiene: no dashes found in rendered copy; the founder cap of 50 is consistently stated (455, 2705, 2752); the 30 day guarantee appears once (2851), which matches the plan's "said once, clearly".
