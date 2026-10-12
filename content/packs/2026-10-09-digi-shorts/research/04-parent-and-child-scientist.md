# Screen problems for parents: what the evidence supports, and a claim by claim review of the DiGi launch film

**Scope and honesty note.** I worked from primary sources wherever I could open them. Each citation says what I actually read:
- **[Full]**: the full text or the publisher's own page.
- **[Abstract]**: the abstract or the authors' own institutional release.
- **[Secondary]**: news or review coverage only, so check it before putting it on screen.

The session hit its web search limit near the end. These were **not verified**: Kaminski et al. (2008) on parent training components, the AASM sleep duration consensus, Common Sense Media's AI companion survey, and the exact Internet Matters and eSafety PDF figures (both PDFs would not open). I collected **no parent quotes**, so none appear here. Nothing below should be read as a verbatim parent voice.

---

## 1. Verdict in ten lines

1. **The film's structure is evidence friendly.** It shows the product doing things: one action, the words, a follow up, the parent's own rating. It never promises an outcome for a child. Keep that.
2. **The researcher row has three overclaims.** "The 11 to 13 window" covers girls only. "A safe middle" uses a word the research does not support. "Four researchers lead" implies they are involved with the product.
3. **"A ban delays. Preparation lasts."** has no supporting evidence and is not ban neutral. The UK government committed to an under 16 ban in June 2026. Replace it with the house line "A deadline is not a plan."
4. **"Peer reviewed papers and the big UK datasets"** is not accurate. The bank also holds NSPCC, Internet Matters, Common Sense and Pew material (I counted the source names in `supabase/migrations`). "Approved by a human" means the founder's click on the insights board (`068_knowledge_candidates.sql`).
5. **The invented family has no "illustrative" label anywhere.** I grepped `index.html`, `build.mjs` and `beats.json` and found none. The hard rules require one.
6. **The real thinking line "Checking our reviewed research, not the open web." is only partly true.** DiGi has a live `web_search` tool, used up to 3 times a turn for apps, law and researcher figures (`lib/digi/tools.ts`). Don't feature this line in the ad.
7. **The live moment card "Turning the screen off ends in tears" advises a two minute warning.** The best known study of screen transitions found parent given two minute warnings went with more upset, at least in 1 to 5 year olds. Do not put that advice on screen.
8. **`digi/02-scientists.md`, which DiGi loads, has factual errors:**
   - The Orben window is wrong (it should be girls 11 to 13, boys 14 to 15, both at 19).
   - The 0.4 percent and "glasses" comparison is credited to the wrong paper.
   - From my own knowledge, not re-checked this session: a Twenge and Campbell paper is listed under Przybylski, and "The Class" is credited to Blum-Ross (it is Livingstone and Sefton-Green, 2016).
9. **The findings safest to put on screen are UK guidance.** The UK CMOs' "phones out of the bedroom" and RCPCH's "no evidence for a daily cut off, agree limits, screens off an hour before bed" hold up. Single effect sizes mostly do not survive a hostile expert once shown on screen.
10. **For the screen timer film,** the evidence supports agreed, predictable, autonomy supportive limits and protected time. It warns against hyping screens as a reward. Using screens as reward or punishment is associated with more screen time.

---

## 2. Problem by problem: what helps, what DiGi must say, what to keep out of the film

### 2.1 Bedtime device battles

**What the evidence says**
- **Device access at night goes with worse sleep, even unused.** Meta analysis of 20 studies, 125,198 children (Carter et al. 2016, JAMA Pediatrics):
  - Bedtime use: OR 2.17 (1.42 to 3.32) for too little sleep; 1.46 (1.14 to 1.88) for poor quality; 2.72 (1.32 to 5.61) for daytime sleepiness.
  - Access without use: OR 1.79 (1.39 to 2.31), 1.53 (1.11 to 2.10) and 2.27 (1.54 to 3.35).
  - All included studies were cross sectional and GRADE rated the evidence low. [Full] [PMC5380441](https://pmc.ncbi.nlm.nih.gov/articles/PMC5380441)
- **UK Chief Medical Officers (2019)** gave precautionary advice: leave phones outside the bedroom at bedtime and keep meals screen free. They set no time limit because the evidence would not support one. [Secondary] [BMJ news](https://www.bmj.com/content/364/bmj.l643.full)
- **RCPCH (2019):** no evidence based daily cut off. Families should agree limits, and screens should go off about an hour before planned sleep. [Abstract, guide excerpts] [RCPCH guide PDF](https://www.justonenorfolk.nhs.uk/media/vxrhvmdh/rcpch_screen_time_guide_-_final.pdf)
- **Routine:** the more nights a week a bedtime routine happens, the better reported sleep, in a straight line (Mindell et al. 2015, Sleep). Caveats: 10,085 mothers in 14 countries, children 0 to 5, self report, sponsored by Johnson & Johnson. [Abstract] [AASM release](https://aasm.org/study-shows-that-children-sleep-better-when-they-have-a-nightly-bedtime-routine/)
- **Behavioural treatment for bedtime problems:** 94 percent of 52 studies reported clinically significant improvement, and about 82 percent of children benefited (Mindell et al. 2006, AASM review). Ages 0 to 5. [Abstract] [PubMed 17068979](https://pubmed.ncbi.nlm.nih.gov/17068979/)
- **The bedtime pass:** one ticket for one "one more thing", then steady sameness. A small RCT (19 children aged 3 to 6, J Pediatr Psychol 2007) reportedly cut settling time and crying, and the gains held at three months. [Secondary only: I could not open the paper] [NPR](https://www.npr.org/sections/health-shots/2015/09/18/441492810/the-bedtime-pass-helps-parents-and-kids-skip-the-sleep-struggles); single case replication [Freeman 2006, PMC1702334](https://pmc.ncbi.nlm.nih.gov/articles/PMC1702334)
- **Caution against promising better sleep.** In the Danish SCREENS cluster RCT, cutting family leisure screen use to under 3 hours a week for two weeks made **no significant difference to EEG measured sleep**. It did raise children's active time by about 45 minutes a day (Pedersen et al. 2022, JAMA Pediatrics). [Abstract] [PubMed 35604678](https://pubmed.ncbi.nlm.nih.gov/35604678/)

**In the moment:**
- Short, warm, the same words every night.
- The device leaves the room at the agreed time, rather than a debate at lights out.
- A little planned closeness before lights out.
- For "one more thing": one, then the same line.

**Over weeks:**
- The same steps in the same order every night (routine is the "dose").
- A family charging spot outside bedrooms, adults included. The CMOs asked parents to model the habit.
- Check after a few nights.

**A good DiGi answer contains:**
- One action for tonight.
- Exact words.
- The why in one line ("devices in the room tend to go with less sleep").
- A repair line if tonight already went badly.
- A booked follow up.
- No promise that she will sleep better.

**Keep out of the film:** "screens wreck sleep", blue light claims, "children sleep X hours more", any number from Carter shown as cause.

### 2.2 Meltdowns when the screen goes off

**What the evidence says**
- **Hiniker et al. (CHI 2016):** 27 parent interviews plus a two week diary from 28 families, children aged 1 to 5.
  - 59 percent of screen endings were neutral, 19 percent positive, 22 percent negative.
  - Parent given **two minute warnings were followed by more upset**.
  - Endings went better inside a routine, at natural stopping points, and when the technology ended the session rather than the parent.
  - Small, young sample, observational. [Abstract, UW release] [UW News](https://www.washington.edu/news/2016/05/05/two-minute-warnings-make-kids-screen-time-tantrums-worse/)
- **Using a device to calm a child** went with more emotional reactivity six months later, in boys (Radesky et al. 2023, JAMA Pediatrics 177(1):62 to 70; ages 3 to 5; parent report; observational). [Secondary] [Michigan Medicine](https://michiganmedicine.org/health-lab/frequently-using-digital-devices-soothe-young-children-may-backfire)
- **Tablet use and anger ran both ways:** tablet use at 3.5 predicted anger at 4.5 (standardised 0.22, CI 0.01 to 0.44), and anger at 4.5 predicted tablet use at 5.5 (Fitzpatrick et al. 2024, JAMA Pediatrics; n=315, Nova Scotia, during the pandemic). The interval nearly touches zero. Press coverage wrongly called this "22 percent more outbursts". [Secondary] doi:10.1001/jamapediatrics.2024.2511
- **Emotion coaching (Tuning in to Kids):** several small RCTs against waitlists show more parent emotion coaching and fewer behaviour problems. Most results are parent rated and the developers ran the trials. Promising, not definitive. [Secondary] [University of Melbourne](https://medicine.unimelb.edu.au/research-groups/psychiatry-research/sophie-havighurst)

**In the moment:**
- Name the feeling and hold the limit ("You wish it could keep going. It's still time to stop.").
- End at a natural stopping point agreed beforehand.
- Let the timer be the messenger.
- Don't use another screen to calm the storm.

**Over weeks:**
- Predictable endings built into routines.
- Agree the finish line before starting.
- Turn off autoplay.

**A good DiGi answer contains** a validating line plus a firm line, a stopping point the child can see, and a plan for the next activity.

**Keep out of the film:** "addicted", "screens cause tantrums", a child mid meltdown, and the two minute warning.

### 2.3 "Everyone else has a phone / Snapchat"

**What the evidence says**
- **Ofcom, 21 May 2026:** smartphone ownership rises from **56 percent of 10 year olds to 83 percent of 11 year olds**. At 9 or 10, "everyone" is about half; by 11 it is most. [Full] [Ofcom](https://www.ofcom.org.uk/online-safety/protecting-children/younger-phone-owners-the-rise-of-ai-and-consumption-over-creation-our-latest-look-at-uk-childrens-media-lives)
- **About 40 percent of under 13s have a social media profile** (Ofcom 2025, per MLex coverage). [Secondary, not verified against the report]
- **Age of first phone is contested:**
  - Barzilay et al. 2025, Pediatrics 157(1), ABCD study: earlier phone acquisition was associated with obesity and insufficient sleep at 12. A first phone in the past year by 13 was associated with clinical threshold psychopathology. Association only, and use was not measured. [Secondary] doi:10.1542/peds.2025-072941
  - Sun et al. 2023, Child Development: 263 low income Latinx children followed for five years, preregistered. **No meaningful association** between phone ownership or age of acquisition and depressive symptoms, grades or sleep. [Abstract] [PMC9780147](https://pmc.ncbi.nlm.nih.gov/articles/PMC9780147)
- **Grooming:** NSPCC FOI data shows 7,263 Sexual Communication with a Child offences recorded by 44 UK forces in 2024/25. Snapchat accounted for 40 percent where the platform was known, but the platform was known in only 2,111 cases. These are FOI figures, not official statistics. [Secondary] [NSPCC](https://www.nspcc.org.uk/about-us/news-opinion/2025/data-shows-how-criminals-are-using-private-messaging-platforms-to-manipulate-and-groom-children/)

**In the moment:** hear the belonging need first. The live tile already says this well. Don't argue the statistics.

**Over weeks:**
- Separate belonging from the device (another way into the group).
- Agree a "when and how" plan with reasons.
- Build the skills that have to be true first.

**A good DiGi answer contains:**
- Validation.
- A "not yet, and here is the plan" pathway, never a flat no.
- Something the child can say to friends.

**Keep out of the film:** "phones before 12 cause depression" (Barzilay is association, and Sun found nothing). Also keep out grooming numbers used as a fear hook.

### 2.4 Constant policing and fights

**What the evidence says**
- **Parents' knowledge comes mostly from what children choose to tell them,** not from tracking. Feeling controlled went with poorer adjustment (Kerr & Stattin 2000, Dev Psychology; 1,186 Swedish 14 year olds). [Abstract] [PubMed 10830980](https://pubmed.ncbi.nlm.nih.gov/10830980)
- **Style matters as much as the rule.** Restriction delivered in an autonomy supportive way went with better outcomes; controlling or inconsistent restriction did not (Valkenburg et al. 2013, Human Communication Research; 761 children aged 10 to 14, plus follow up studies). [Abstract] [UvA](https://dare.uva.nl/id/634e86a0-f852-4731-8fde-8a3d45c16371)
- **Meta analysis** (Chen & Shi 2019; 52 studies, n=74,159): restriction did more to cut time, while talking and co-use did more to cut risk. [Abstract] [SAGE](https://journals.sagepub.com/doi/10.1177/1077699018754908)
- **Enabling vs restrictive mediation** (Livingstone et al. 2017, J Communication; 6,400 parents in 8 countries): restrictive mediation goes with fewer risks *and* fewer opportunities. [Abstract] [LSE](https://eprints.lse.ac.uk/68612/)
- **Parental control apps:** in 736 child reviews of 37 apps, three in four gave one star (Ghosh et al. CHI 2018). In 215 parent and teen pairs, more parental control was associated with more online risk (association only). [Abstract] [UCF PDF](https://www.eecs.ucf.edu/~jjl/pubs/pn1838-ghoshA.pdf)

**In the moment:** stop renegotiating. Point to the agreement, not to your mood.

**Over weeks:**
- Fewer, clearer rules made together, with the why explained.
- A consistent consequence agreed in advance (RCPCH says the same).
- Warmth kept separate from the rule.

**A good DiGi answer contains** the agreement as the referee, plus autonomy support (a choice inside the limit).

**Keep out of the film:** "parental controls make kids less safe". That is an association, and it would be an attack on competitors with weak evidence. "We are not parental controls" is fine as positioning.

### 2.5 Secret use and lying

**What the evidence says**
- **Punitive environments breed better liars.** Among 3 and 4 year olds who peeked in a temptation task, nearly all from a punitive school lied, against just over half from a non punitive school. Liars from the punitive school also covered their tracks better (Talwar & Lee 2011, Child Development; n=84; a natural experiment, not randomised). [Abstract] [PMC3218233](https://pmc.ncbi.nlm.nih.gov/articles/PMC3218233/)
- **Disclosure follows reception:** Kerr & Stattin 2000, as above. Tilton-Weaver et al. 2010 is widely cited for "validating reactions predict more future disclosure", but I could not open the original. [Secondary]

**In the moment:**
- Lower the cost of telling the truth ("Thank you for telling me. You're not losing the phone for telling me.").
- Separate any safety issue from the broken rule.

**Over weeks:** repair, then reset the agreement together.

**A good DiGi answer contains:**
- An amnesty phrase.
- A safety branch: if there is sexual contact, extortion or threats, keep the evidence, report it and get help. DiGi's safety precedence must come before anything else.

**Keep out of the film:** secret monitoring as a fix, and "your child will tell you everything".

### 2.6 Gaming that will not stop

**What the evidence says**
- **Gaming disorder is uncommon and often overstated.** Pooled prevalence was 3.05 percent (95% CI 2.38 to 3.91) across 53 studies and 226,247 people. It fell to 1.96 percent in studies with stricter sampling, and is inflated by screening tools (Stevens et al. 2021, ANZJP; a corrigendum followed in 2023). [Abstract] [PubMed 33028074](https://pubmed.ncbi.nlm.nih.gov/33028074/)
- **Time spent playing is unlikely to affect wellbeing much either way; why they play matters** (Vuorre et al. 2022, R Soc Open Sci; 38,935 players, 6 weeks of real play data, 7 games). [Abstract] [PMC9326284](https://pmc.ncbi.nlm.nih.gov/articles/PMC9326284)
- **Moderate use was not associated with lower wellbeing; very high use was** (Przybylski & Weinstein 2017, Psych Science; over 120,000 English 15 year olds; correlational). [Abstract] [Cardiff ORCA](https://orca.cardiff.ac.uk/id/eprint/99720)

**In the moment:** stop at the game's natural break (end of the match), agreed before they start, never mid round.

**Over weeks:**
- Ask what the game gives them (friends, mastery).
- Watch sleep, school and mood rather than minutes.
- Escalate only if there is real impairment over months.

**A good DiGi answer contains** a finish line agreed in advance and a curious question about what the game is for.

**Keep out of the film:** "addiction" and "X percent of kids are hooked". Also soften the live tile's "caught by the design" and "calm the nervous system", which are pop neuroscience phrasing.

### 2.7 Content, strangers and AI

**What the evidence says**
- **Ofcom, May 2026:**
  - Nearly three quarters of 11 to 17s say they have seen harmful content, and 35 percent saw it in their personalised feed.
  - 56 percent of 8 to 17s use AI.
  - 11 percent of 8 to 17s have used AI "as someone to talk to or as a friend". [Full] link as in 2.3.
- **Internet Matters (July 2025):** 64 percent of 9 to 17s have used AI chatbots; 35 percent of users say it feels like talking to a friend; 12 percent say they have no one else to talk to. [Secondary: the PDF would not open] [Internet Matters](https://www.internetmatters.org/wp-content/uploads/2025/07/Me-Myself-AI-Report.pdf)
- **APA Health Advisory on AI and Adolescent Well-being (2025):** AI companions can displace human relationships and create overdependence. Talk with teens about them, and make clear AI empathy is not human understanding. [Secondary] [YouthREX listing](https://youthrex.com/report/artificial-intelligence-and-adolescent-well-being-an-apa-health-advisory/)
- **EU Kids Online 2020:** 25,101 children aged 9 to 16 in 19 countries; 7 to 45 percent had been bothered or upset online. As Livingstone put it: "not all risk results in self-reported harm to a child." [Full] [LSE blog](https://blogs.lse.ac.uk/parenting4digitalfuture/2020/02/11/eu-kids-online-2020-finds-more-risk-to-children-online-but-not-always-more-harm)

**In the moment:** calm first ("Thank you for telling me"), the facts gently, then practical steps together.

**Over weeks:**
- Talk about strangers before it happens: moving to private chat and asking for photos are the red flags.
- Explain what AI is and is not.
- Know the reporting routes.

**A good DiGi answer contains** a reception line, a safety step, and a "you are not in trouble" guarantee.

**Keep out of the film:**
- "Predators on every app".
- Any implication that DiGi watches the child (it talks to the parent).
- Shrinking the visible footer "DiGi is a guide, not a crisis line, and can make mistakes…" out of legibility when you zoom into the phone.

### 2.8 Teen mood and social media

**What the evidence says**
- **Sensitive windows, small effects, both directions.** In longitudinal UK data (17,409 people aged 10 to 21), higher use predicted lower life satisfaction a year later in girls at 11 to 13, boys at 14 to 15, and both at 19 (standardised β about −0.07 to −0.12). The authors say "the effect sizes of both paths were small in magnitude". Lower life satisfaction also predicted more use, and they caution that the windows "will most probably meaningfully differ across individuals" (Orben et al. 2022, Nat Commun). [Full] [PMC8960761](https://pmc.ncbi.nlm.nih.gov/articles/PMC8960761/)
- **Technology use explains at most 0.4 percent of the variation in adolescent wellbeing** (Orben & Przybylski 2019, Nat Hum Behav; n=355,358). [Abstract, OII release] [OII](https://www.oii.ox.ac.uk/technology-use-explains-at-most-0-4-of-adolescent-wellbeing/)
- **Pathways in girls:** in 12,866 English teens, cyberbullying, lost sleep and lost physical activity accounted for 58 percent of the link with poor mental health (GHQ) and 80 percent of the link with life satisfaction. In boys it was 12 percent (Viner et al. 2019, Lancet Child Adolesc Health). [Abstract] [UCL Discovery](https://discovery.ucl.ac.uk/id/eprint/10081099/)
- **Millennium Cohort, 10,904 14 year olds:** compared with 1 to 3 hours a day, 5 or more hours went with depressive symptom scores 50 percent higher in girls and 35 percent higher in boys. The main routes were poor sleep, online harassment and body image (Kelly et al. 2019, EClinicalMedicine; association). [Abstract] [UCL](https://www.ucl.ac.uk/news/2019/jan/depression-linked-social-media-twice-high-among-girls)
- **Who is at risk:** 488 teens followed for 8 years. Risk concentrated in those with parental hostility, bullying, anxiety and low media monitoring (Dyer et al. 2024, J Adolescence). [Abstract, Wiley release] [Wiley](https://newsroom.wiley.com/press-releases/press-release-details/2024/Which-adolescents-are-at-risk-of-depression-following-early-social-media-use/default.aspx)
- **Gallup (2023), 1,591 teens:** with a strong parent relationship, social media hours "no longer predicts mental health problems". This held on 3 of 16 outcomes, and the survey cannot show cause. [Full] [Gallup](https://news.gallup.com/poll/513248/parenting-mitigates-social-media-linked-mental-health-issues.aspx)
- **Experiments are contested:**
  - SCREENS 2024 (181 children, 2 weeks at 3 hours a week or less): parent rated SDQ total difficulties improved, Cohen's d 0.53. Caveats: open label, parent rated, motivated volunteers. [Full] [PMC11245724](https://pmc.ncbi.nlm.nih.gov/articles/PMC11245724/)
  - Ferguson's 2024 meta analysis of experiments found d=0.088, with a CI crossing zero. Haidt and Rausch dispute it. [Secondary]
- **Odgers (Nature, 2024):** no evidence that platforms are rewiring brains or driving an epidemic; bans are unlikely to work and could backfire; platforms still need major reform. Haidt disputes this. [Secondary, excerpts]

**In the moment:** ask about the specific thing (sleep, a falling out, comparison, what they saw), not the hours. Keep reactions steady so they keep talking.

**Over weeks:**
- Protect sleep.
- Deal with bullying.
- Keep connection.
- Know the red flags (persistent low mood, self harm, withdrawal) and route to the GP, Childline or Samaritans.

**A good DiGi answer contains:**
- Safety triage first.
- No diagnosis.
- No "it's the phone" or "it's not the phone".
- Calibrated next steps.

**Keep out of the film:** "rewiring", "epidemic", "social media causes depression", and equally "screens don't matter".

---

## 3. What every DiGi answer must contain (the evidence based checklist)

1. **Safety triage first** (crisis, abuse, self harm or extortion route to real people).
2. **Reflect what happened and the child's feeling** (emotion coaching evidence: promising, small trials).
3. **One action for tonight.** Never a list.
4. **The exact words:** short, warm, firm, and the same every time (routine and consistency evidence).
5. **The child's voice inside the limit:** an agreement, a choice, a reason (autonomy supportive mediation; Kerr & Stattin on disclosure).
6. **A repair line** if it already went badly.
7. **The why in one sentence, drawn from the bank,** with no invented numbers and no cause claimed from an association.
8. **A booked follow up.** This is consistent with:
   - Text nudges to parents: READY4K, 8 months of texts, parent involvement up 0.15 to 0.29 SD, child literacy up about 0.11 SD (York, Loeb & Doss 2019, J Human Resources). [Abstract] [JHR](https://jhr.uwpress.org/content/54/3/537)
   - Planning research: implementation intentions, d=0.65 on goal attainment (Gollwitzer & Sheeran 2006). [Secondary]
   - Both are different domains. They support the principle; they are not evidence that DiGi works.
9. **No promise, no blame.** "That's a shift" is the right register.
10. **Age fit** to the child's stage.

There is **no trial of DiGi itself**. Meta analyses of online parenting programmes show small to moderate effects on child behaviour (pooled g −0.32 in Thongseiratch 2020; about d −0.58 reported for Spencer 2020) [Secondary] [Springer review](https://link.springer.com/article/10.1007/s10567-024-00477-4). DiGi is not one of those programmes and must never borrow their numbers.

---

## 4. What can go on screen, and what is contested

| Finding | Citation | Size | On screen? |
|---|---|---|---|
| UK CMOs: phones outside the bedroom at night, screen free meals, no time limit set | UK CMOs 2019 [Secondary] | Guidance, precautionary | **Yes**, as "The UK's Chief Medical Officers advise phones out of the bedroom at night." |
| RCPCH: no evidence for a daily cut off; agree limits; screens off an hour before bed | RCPCH 2019 [Abstract] | Guidance | **Yes** |
| Smartphone ownership 56% at 10, 83% at 11 | Ofcom, May 2026 [Full] | Survey | **Yes**, with source and year |
| Tech use explains at most 0.4% of wellbeing variation | Orben & Przybylski 2019 [Abstract] | Variance | **With care**: cross sectional, and wrongly read as "harmless" |
| Sensitive windows: girls 11 to 13, boys 14 to 15, both 19 | Orben et al. 2022 [Full] | β about −0.1, "small" | **With care**: always both sexes, always "small" |
| Device in the bedroom goes with less sleep | Carter 2016 [Full] | OR 1.79 access, 2.17 use | **Not as a number**: cross sectional, low GRADE |
| Sleep, bullying and activity explain much of the link in girls | Viner 2019 [Abstract] | 58 to 80% mediated | **Paraphrase only**: mediation is a model |
| Parent two minute warnings went with more upset | Hiniker 2016 [Abstract] | Diary, n=28 families | **No**: toddlers only. Use it inside the product |
| Strong parent bond, hours no longer predict problems | Gallup 2023 [Full] | 3 of 16 outcomes | **No**: one survey. Good for a blog, not an ad |
| Two weeks with less screen time improved parent rated SDQ | SCREENS 2024 [Full] | d 0.53 | **No**: open label, 2 weeks |
| Phone before 12 harms | Barzilay 2025 vs Sun 2023 | Mixed | **No**: contested |
| Social media drives a teen mental health epidemic | Haidt vs Odgers 2024 | Contested | **No**, either way |
| Experiments prove harm, or prove none | Ferguson 2024 vs Haidt and Rausch | d 0.088, disputed | **No** |
| Screens as reward go with more screen time | Tang et al. 2018 [Abstract] | About 20 min more at weekends (press release) | **No**, but it governs how the timer is framed (§6) |
| Under 16 ban, 3 months in: account ownership 52.4% to 42.1%; any use 85.9% to 81.5% | eSafety, July 2026 [Secondary] | Early, single wave | **No**: politically live; we are ban neutral |
| School phone bans and wellbeing: no difference | Goodyear et al. 2025, SMART Schools [Abstract] | Cross sectional, n=1,227 | **No**: don't sell "protected school time" as a health effect |

---

## 5. Claim by claim review of the existing film (`beats.json`)

| Scene | On screen | Verdict | Why, and the fix (no dashes) |
|---|---|---|---|
| All | Ava, 9, and her mum; "WE DID IT" | **Must fix** | Invented family with no label, which breaks the hard rule. Add a small mono line at first sight: "Illustrative family. Ava and her mum are made up." |
| 1 | "Bedtime was a fight again. What do I actually say?" | OK | Framed as a scenario. The label above covers it. |
| 1 | "Bedtime has been hard going three check ins running." | OK | It reads the parent's own ratings. Nothing clinical. |
| 1 | Card "Bedtime stalling and one more thing" | OK, check content | The live tile's advice (same steps, warm sameness, "one more and then sleep") matches the routine and bedtime pass evidence. Change "usually a bid for connection" in its brief to "often". |
| 2 | "The one thing to do, and the words to say" | OK | Describes the product, not an outcome. |
| 3 | "That's a shift. Same words tonight?" | **Exemplary** | Calibrated. No victory claimed after one wobble. |
| 3 | "Warm, and the same every night." | OK | Routine and consistency evidence (Mindell 2006 and 2015). |
| 4 | Memory cards, "Wants a phone like her friends", "Snapchat talk at school" | OK | Plausible at 9 (Ofcom 2026: 56% own a smartphone at 10). |
| 4 | "I remember, so you don't have to." | **Should fix** | Reads as handing the parenting to the AI, and it showcases stored child data without showing parent control. Try: "I keep the thread, so you don't carry it alone." If the product lets parents view and delete memories, show it for one beat. |
| 5 | "Watches the number move" and "Bedtime: going great. Resting for a week." | **Should fix** | "The number" is the parent's own five face rating, not a measured child outcome. A hostile viewer will assume a score. Add a small label "Your own check in" beside the face. The resting rule is real (`lib/concerns/outcome.ts`: "We will check in a week that it held"). |
| 6 | "Four researchers lead, for now" | **Must fix** | Implies they lead DiGi, so it reads as endorsement. Use: "Built on published research by". Add small type: "Named for their published work. No endorsement implied." Check the CAP Code rules on endorsements before any paid use. I did not verify the rule wording. |
| 6 | Odgers: "Risk online starts offline" | Should fix | It implies offline problems cause online risk, and the evidence shows exceptions (sleep, new forms of bullying). Use: "Offline life predicts online risk." |
| 6 | Orben: "The 11 to 13 window" | **Must fix** | Girls only. Boys are 14 to 15, and both are sensitive at 19. Effects are small and run both ways. Use: "Timing matters, girls earlier than boys." |
| 6 | Przybylski: "Small effects, a safe middle" | **Must fix** | "Safe" is not a research finding. Goldilocks is correlational, and his 2022 work says time alone shows neither benefit nor harm. Use: "Small effects. How, not just how long." |
| 6 | Livingstone: "Skills, as well as protection" | OK | Supported by Livingstone et al. 2017. |
| 6 | "142 findings, every one with a named source" | OK with date | True on 7 October (`lib/email/momentum.ts`). It will date. Use "Over 140" or lock it to the render date. |
| 6 | "Peer reviewed papers and the big UK datasets, each approved by a human first." | **Must fix** | The bank also holds charity and survey sources. "Approved by a human" overstates expertise. Use: "Studies, national surveys and charity reports. Each one checked by a person before DiGi can use it." |
| 6 | "DiGi asks how it went, remembers, and shares only what worked. Never a family's words." | Should fix | "What worked" is parent reported, not tested. Use the real thinking line: "What other parents found worked. Never who they are." |
| 6 | "Never allow or deny. Always the next step." | OK | Product rule. |
| 6 | "Connection is the protection." | OK as a rule | Directionally supported (Kerr & Stattin; Dyer 2024; Gallup 2023), but associational. Keep it in "Our own rules", never in the papers layer. |
| 6 | "A ban delays. Preparation lasts." | **Must fix** | No study shows preparation outlasts a ban, and none has tested restrictions in under 16s. It reads as anti ban while the UK government is legislating one (consultation closed 26 May 2026, with "9 in 10 parents backing a social media ban for under‑16s"; [GOV.UK](https://www.gov.uk/government/consultations/growing-up-in-the-online-world-a-national-consultation)). Replace with: "A deadline is not a plan." |
| 6 | "Nobody gets blamed. Everybody gets the words." | OK | Philosophy line. |
| 7 | "What stage is your child? Three questions, no sign up." | OK | Describe stages as "your child's stage on our pathway", never as validated developmental stages. |

---

## 6. Research for Justin's notes on the next cut

**Thinking messages.** Use real lines from `components/digi/ThinkingReassurance.tsx`, but **leave out** "Checking our reviewed research, not the open web." DiGi can search the web for apps, law and researcher figures (`lib/digi/tools.ts`, max_uses 3). These lines are safe and true:
- "Finding where your child is on their pathway."
- "Never a flat yes or no. Working out your next step."
- "Looking for the words you can actually use."
- "What other parents found, never who they are."
- "If it is ever serious, DiGi points you to real people first."

**Top 5 issue moments.** Don't call them "the top 5" unless you have the product's own usage data with a date. These five real tiles from `073_moments_library_by_age.sql` have the strongest evidence based answers:
1. Bedtime stalling and one more thing
2. Turning the screen off ends in tears (fix the two minute warning line first)
3. Everyone else has a phone
4. Cannot come off the game
5. Saw something upsetting online

The live tiles name clinicians in `expert_note` (Becky Kennedy, Sue Atkins, Catherine Knibbs). Migrations 123 and 125 unnamed them, so check the live rows before any card appears on screen.

**The screen timer film:**
- **What the evidence supports:**
  - Agreed, predictable limits (RCPCH).
  - Protected time at bedtime and meals (CMOs, RCPCH).
  - Rules delivered in an autonomy supportive way: "an ask, never a flat no" fits Valkenburg 2013.
  - Hiniker's finding that endings go better when the technology ends the session (toddlers only, so a hypothesis for older children, not proof).
- **Caution 1:** using screens as a reward or punishment goes with more screen time. Tang et al. 2018, BMC Obesity: 62 children aged 1.5 to 5, cross sectional, significant for mothers only; the press release says about 20 minutes more at weekends [Abstract](https://bmcobes.biomedcentral.com/articles/10.1186/s40608-018-0214-4). The free daily core, the weekly cap and protected time all reduce this risk. Frame the feature as "jobs and screen time in one fair system she can see", not "earn your screens".
- **Caution 2:** tangible rewards tied to doing or finishing an interesting task reduce later free choice motivation: d −0.40 for engagement and −0.36 for completion, stronger in children. Positive feedback raised it, d 0.33 (Deci, Koestner & Ryan 1999) [Abstract](https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf). So stars should go to chores, not to things the child already loves, such as reading. Don't claim the quest "builds motivation" or "responsibility". That is unevidenced.
- **Don't sell minutes as health.** Time alone shows neither benefit nor harm (Vuorre 2022), and RCPCH sets no cut off. The timer's honest promise is fewer arguments about time, not a healthier child.

**Code fix that matters beyond the film:** correct `digi/02-scientists.md`, which DiGi loads.
- The Orben window: girls 11 to 13, boys 14 to 15, both at 19.
- Move the 0.4 percent, glasses and potatoes comparison to Orben & Przybylski 2019, *Nature Human Behaviour*.
- My own knowledge, not re-checked this session: remove "Associations between screen time and lower psychological well-being" from Przybylski (it is Twenge & Campbell 2018), and credit "The Class" to Livingstone & Sefton-Green, 2016.

**Files referenced:**
- `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/videos/2026-10-08-digi-launch/beats.json`
- `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/components/digi/ThinkingReassurance.tsx`
- `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/lib/digi/tools.ts`
- `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/digi/02-scientists.md`
- `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/supabase/migrations/073_moments_library_by_age.sql`
- `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/supabase/migrations/068_knowledge_candidates.sql`
- `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/lib/concerns/outcome.ts`