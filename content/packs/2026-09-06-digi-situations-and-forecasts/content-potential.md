# DiGi's situations and forecasts, content potential note

Distribution review, 6 September 2026. Reviewed against viral-post,
linkedin-engagement, hidden-thread and family-social. This note ranks the
verified findings; drafting stays with content-engine, viral-post and
family-social. Source: `briefings/2026-09-06-digi-situations-and-forecasts-v2.html`,
Key Findings and Source Ledger only. Proof paths were checked against the live
routes and migrations on the same day.

## The strongest LinkedIn play

**Lead finding.** Finding 1, the device in the bedroom overnight. Reliability
9 out of 10, no lens challenged it, both sources confirmed against the primary,
and the fix is a house rule that costs nothing. It is the one finding in the
whole pack that a hostile expert, a headteacher and a tired parent all agree
on, and it lands a brick of the thesis (structure the whole house keeps beats a
wall around the child) without stating the thesis.

**Hook flavour.** The precise number, results first. The reader is named in
line three per the 2026 rewrite: the parent whose eleven year old's phone
charges on the pillow.

> 125,198 children.
>
> A phone in the bedroom, switched off, still cost them sleep.

Then the setup: Carter and colleagues, JAMA Pediatrics 2016, 20 studies, mean
age 14.5. Used at bedtime, odds of too little sleep 2.17 times higher. Merely
present in the room and unused, still 1.79 times higher. The US ABCD cohort,
10,280 ten to fourteen year olds, a screen in the bedroom raised the risk of
trouble falling or staying asleep by 27 percent, and a ringer left on overnight
by 23 percent. The Skeptic's line does the credibility work: only the boring
findings survive, and this is the most boring finding in child media research.

**The honest pivot line.** "That is an association, not a cause. A tired child
reaches for the phone too, and a bedroom television did the same thing to third
graders in 2005. The phone is not the villain here. The place is."

**The one concrete contrast.** Two twelve year olds, the same phone, the same
hour of Roblox. One phone charges in the kitchen at nine. The other sleeps on
the pillow, switched off. The second child's odds of too little sleep are 1.79
times higher. Then the turn to meaning: across 57 studies, rules aimed only at
the child sit near zero (Collier 2016, restrictive r minus 0.06), and the one
randomised trial that moved children's mental health cut leisure screens for
the whole household for two weeks (Schmidt Persson 2024, 89 families, 181
children, d 0.53). The rule that works is about a place, and the parent keeps
it too. That is the brick. Do not land poverty or CAMHS in this post; the log
shows zero Wednesdays since the last thesis post, so this is a brick, not the
one in ten.

**Format.** Native PDF carousel, the flagship treatment, eight slides: cover
(125,198 and the switched off phone), the finding (2.17 and 1.79), the ABCD
27 percent, the honest pivot, credibility (JAMA Pediatrics, Sleep Health, ABCD,
and the Dunedin filmed nights as the kicker), the two children, the point
(rules about place kept by the whole house, r 0.06 versus d 0.53), the close.
Text plus card fallback if speed matters: hero stat 125,198 in terracotta,
caption "A device in the bedroom overnight, switched off. Odds of too little
sleep 1.79 times higher", two bars used at bedtime 2.17 (ink) against merely
present 1.79 (terracotta), italic kicker "Switched off is not the same as out
of the room."

**Close.** One question only a parent can answer: "Where does your child's
phone sleep, and where does yours?" Principled repost ask: the response to
this should be proportional to the evidence, and this evidence points at a
plug socket, not a ban. Link in the first comment to the starter pack stage
check, with the pre empt written in: these are associations, tired children
reach for phones, and the mean age is teenage, which is exactly why the rule
goes in before the phone does.

## The strongest family Instagram and Facebook play

**Research Wednesday, the same finding, two days after LinkedIn**, the
sanctioned overlap in weekly-rhythm.md. Recognition mode, not effect sizes.
A brick, not the one in ten.

Cold open on the moment a parent has lived: the phone on the pillow, switched
off, and the belief that switched off counts. The claim they have heard: as
long as it is off, it is fine. What the research found: in the biggest review
of children and sleep, a device just being in the room overnight still cost
sleep, and the morning is mostly lost the night before. The honest pivot: that
is a pattern, not a proof, a tired child reaches for the phone too, and it was
mostly teenagers. The tonight line, the whole reason the post exists: pick one
charging spot outside the bedrooms tonight, and the grown ups' phones go there
too. Close on a question a stranger can answer: "Where do the phones sleep in
your house?" Any "our house" detail must come from founding-story.md; nothing
in this pack is a family fact.

**Proof path into the product.**
- The family agreement has a bedroom rule with a time and a place:
  `/dashboard/agreement`, migration `021_family_agreements.sql`
  (`bedroom_rule_time`, `bedroom_rule_location`), signed by everyone, printed
  for the fridge.
- The star quest already pays for it: "Device on charge downstairs" and
  "Phone charged outside the bedroom" are one star evening jobs at every age
  band in `lib/quests/best-jobs.ts`, and the star quest leads every list of
  what is inside.
- The child learns it in their own words: the "Where does the tablet go at
  night" and "Why do screens sleep outside the bedroom" questions in
  migration `245_question_balance_foundation_builder.sql`.

**Formats.** Instagram: a five card carousel, the moment, the finding, the
pivot, the tonight line, the question, no link in the caption. Facebook: one
tall card ("Switched off is not the same as out of the room") plus the full
text and a real link to /starter-pack in the body. Never a carousel on
Facebook.

## Verdicts per finding

1. **Bedroom device, switched off, still costs sleep (9/10).**
   LinkedIn: hook worthy. A precise, strange number with no lens against it
   and the fix in the headline, so it passes every line of the Haidt test.
   Family: Research Wednesday, brick. The tonight line is one plug socket and
   the proof path runs through the agreement, the star job and the child's
   lesson.

2. **Hours are a poor thermometer (9/10).**
   LinkedIn: card stat, not a hook. The 0.4 percent post already ran on 20
   August, so the fresh card is the six times a day study, hero stat "46, 44,
   10", with "63 adolescents, 2,155 moments" in the caption, and the
   Clinician's challenge as the honest pivot (the 10 percent are the ones in
   clinic). The potatoes line is confirmed in the Oxford release and may be
   quoted.
   Family: Research Wednesday, brick. "Ask how they felt afterwards, not how
   long" is the tonight line; proof path is Balance at `/dashboard/stats`
   sorted by what the device was for, and the check in at `/dashboard/checkin`.

3. **The parent's own phone is inside the loop (8/10).**
   LinkedIn: card stat with a vulnerable hook available. 46 percent of teens
   versus 31 percent of parents is the contrast, marked US, Pew 2024, 1,453
   teens. The 183 couple study is under fives and may not be blended with the
   teen figure. This is a real driver brick (parental stress inside the
   effect), so it walks toward the thesis without naming it.
   Family: Research Wednesday, brick, written as "we" and never as "you",
   because the family account never shames a parent. Proof path is the
   agreement signed by the adults too at `/dashboard/agreement`. The parent's
   protected phone free slot is a proposed script in the briefing, not a built
   one, so it cannot be claimed as a service.

4. **Occupy is fine, calm is the pattern to watch (8/10).**
   LinkedIn: hook worthy, contrarian. "Two thirds of parents use a screen to
   get dinner made. That was never the problem." The guilt is aimed at the
   wrong thing, which is the honest middle. The r 0.20 in boys goes in the
   body only, with "422 children, a convenience sample, parent reported" beside
   it, and the reversed loop stated (reactivity drives calming use too).
   Family: Research Wednesday, brick, with the fix leading: occupy and calm are
   two different jobs. Proof path is the calm down corner in the printables
   registry (`lib/printables/registry.ts`, `/dashboard/printables`) and the
   moments timeline where a flagged moment becomes a concern.

5. **The first phone lands at 11 and shows up in sleep first (8/10).**
   LinkedIn: carousel material, and only with the fix leading (the Year 6
   phone plan, the charging spot before the box is opened). The obesity and
   depression odds never appear in a hook or on a card; sleep is the line, the
   Skeptic's caveat ("families who give phones early differ") is attached in
   the same slide, and every figure reads "association". The 56 to 83 jump was
   the hook of the 27 August WhatsApp pack, so here it is body support.
   Family: Service Friday, the phone bridge. Proof path `/dashboard/secondary`,
   `components/home/PhoneBridgeCard.tsx`, `lib/learning/transition.ts` (which
   already names bedroom, bedtime and the fridge agreement), and the first
   phone guide at `/dashboard/phone-setup`. The family copy never carries the
   obesity or depression figure.

6. **The money arrives before the phone (8/10).**
   LinkedIn: hook worthy, the precise number: "Of the 100 top grossing iPhone
   games that contain loot boxes, none asked a parent." Wording must keep the
   corrected denominator. Epic and the $245 million are named honestly, then
   the camera turns to the child and the habit (the gift card as the lever, a
   fixed amount agreed in advance) or the post fails Haidt test line two. Card
   stat: 97 percent play, 53 percent spend, 32 percent of recent spenders often
   regret it, with the regret figure cited to Ofcom's spending report, not the
   experiences report.
   Family: Research Wednesday, brick, or a Service Friday on the devices
   register. Proof path `/dashboard/devices`, migration
   `014_device_safety_hub.sql` (purchase PINs per device). The gift card rule
   script is proposed, not built, so the gift card line is advice in a caption,
   never a service claim.

7. **Loving a game is not a disorder (8/10, one source demoted).**
   LinkedIn: card stat only, and only as "about 3 in 100" from Stevens 2021
   (3.05 percent pooled, 2023 corrigendum). Never "3 to 4 in 100", because the
   4 rests on the untraced Kim 2022 figure. Never Drummond's r 0.059; the
   violent games line stands on Przybylski and Weinstein 2019 (1,004 British
   14 and 15 year olds, no association) instead. The WHO three part test and
   the NHS door (13 and over, self referral) are the responsible close.
   Family: unpostable. The word disorder frightens before it informs on a
   recognition account, and the fix is a clinic, not a tonight line.

8. **Rules aimed only at the child barely move problem use (7/10).**
   LinkedIn: carousel material and the ratio slide of the lead post. Restrictive
   r minus 0.06 across 57 studies, both mediation styles at zero for problem
   internet use, strict rules tracking slightly more problem use over 14
   (Lukavska 2022, confirmed), against the Danish whole family trial d 0.53.
   The Clinician's challenge is the honest pivot: the bedroom rule is a rule
   and it works. Never "parental control adoption is falling"; the 28 to 22
   percent figure was removed.
   Family: Research Wednesday, brick. "Rules the whole family keeps" is the
   agreement built together, signed by everyone, cleared and re agreed on a
   birthday: `/dashboard/agreement`, `/api/cron/age-up`.

9. **Children go quiet when telling costs them the phone (6/10).**
   LinkedIn: body support only. The Children's Commissioner wording is
   confirmed (many children would not turn to family first; parents urged not
   to simply confiscate) but the "fear of losing the phone" line was softened,
   and the ban figures around it are corrected or belong to the ban series.
   Family: Service Friday, entry 19, the child's own scripts. This is the
   strongest family Friday in the pack after the phone bridge, because the
   promise is already in the product: the agreement default "a parent is your
   first call, not your last, no overreaction, no instant confiscation"
   (`lib/content/agreement-defaults.ts`), the child's openers at
   `/k/[token]/tell`, the parent side at `/dashboard/tell-a-parent`, migration
   `163_child_to_parent_scripts.sql`. The DSIT and Girlguiding figures never
   appear on the family account.

10. **AI is already here, mostly for homework (8/10).**
    LinkedIn: carousel material. The cleanest slide is the Turkish trial:
    answers lifted practice and left pupils 17 percent worse on the exam, hints
    lifted practice by 127 percent and largely mitigated the harm, with
    "largely mitigated, and a PNAS correction exists that we could not read"
    stated on the slide. Card stat: 56 percent of UK 8 to 17s have used AI,
    11 percent as someone to talk to (Ofcom, UK). All Pew and Common Sense
    figures are marked US. The lonely or SEND child who says it feels like a
    friend is a waiting list brick and should be written as one, with the fix
    (more human contact, tools used together) leading. The "no one under 18"
    line is Common Sense's separate April 2025 risk assessment and must be
    cited as such.
    Family: Service Friday, entry 16, the AI module (`/dashboard/ai-module`,
    tables `ai_lessons`, `ai_updates`, the quest games in
    `lib/quest-games/registry.ts`), or Happy News Saturday with the AI road
    framed as a road. Tonight line: ask it something together, then check the
    answer with a person. The companion figures never appear as fear.

11. **Different children, different transitions (7/10, one source demoted).**
    LinkedIn: body support only. Ophir 2023 is demoted, so "screens do not
    cause autism" cannot lead or sit on a card; only "a 2023 meta analysis in
    JAMA Network Open found the link not sufficiently supported" survives. The
    ADHD r 0.12 and OR 1.10 are small, bidirectional, and never "cause".
    Family: unpostable until the V3 SEND lens has run. The briefing itself
    calls this evidence thin, adult sized and mostly about hours, and the
    family claim check forbids developmental outcome claims.

12. **The ending is the fight; let the content stop itself (6/10).**
    LinkedIn: hook worthy, contrarian, as a text plus real photo story post,
    never a carousel. "The two minute warning made it worse" earns dwell, and
    the body must say 27 interviews plus a 28 family diary study of one to
    five year olds, US, and that the "every way we sliced it" line is from the
    university press release. The "I can't pause it" quote was removed and
    cannot be used.
    Family: Research Wednesday, brick, high recognition. Tonight line: agree
    the end of the episode or the match before it starts. Proof path is the
    ask first flow at `/dashboard/quests/timer`, migration
    `081_ask_first_kid_nudges.sql`, and the copy must lead on "agreed before
    play starts", never sell the countdown as the fix, because this finding
    says the spoken countdown is the weakest tool in the box.

13. **The game is a room full of friends (6/10).**
    LinkedIn: body support only. A filmed panel of 21 children aged 8 to 18 is
    a picture, not a number, and the senior audience will say so.
    Family: Happy News Saturday. This is what Saturday is for, the genuine
    positive shown rather than argued: the game as a social room, "ask who
    they were playing with before how long". No stat needed; the Ofcom panel
    can be named as a filmed panel of 21 children.

14. **Holidays are hard because the structure goes (5/10).**
    LinkedIn: unpostable as a finding. Weekend versus weekday obesity data in
    US primary children is not a holiday screen study and the briefing caps it
    at 5. The two or three anchors a day principle may sit in the body of a
    holiday bank post with no study attached.
    Family: unpostable as research, and off calendar in September. The
    principle can live inside a Service Friday on the holiday bank (entry 15)
    next June without citing Brazendale.

15. **The ban will move the pull, not remove it (8/10).**
    LinkedIn: hook worthy, and it belongs to The Wrong Villain, not the new
    series. Four sources are corrected, so the safe wording is narrow: the
    announcement says the platforms "could include" the six named; messaging
    is not intended to be covered; games are not named (never "gaming
    untouched by the age wall", the gaming extension could not be verified);
    Australia restricted 4.7 million accounts in the first half of December
    2025 and eSafety's July 2026 survey of 803 children aged 10 to 15 found
    more than eight in ten still on social media. Per the Australia lesson in
    viral-post Part 8, re anchor to the UK inside the post ("the same pattern
    is heading here in spring 2027") or the reach exports. The Byron swimming
    pool sentence is confirmed verbatim and is the honest close.
    Family: unpostable. The family account never relitigates the ban in either
    direction; spring 2027 is settled background only.

16. **Every panic ended with the same parenting move surviving (7/10).**
    LinkedIn: carousel material, the historian deck: over 4,000 children in
    five cities with Norwich before and after the transmitter (1958), 23
    preschoolers who remembered more with an adult naming the letters (Reiser
    1984), 570 adolescents where content mattered more than the medium
    (Anderson 2001), a bedroom television costing about 8 points in maths in
    2005. The Clinician's challenge is the honest pivot: no past panic had the
    parent's own phone in the loop. Never attribute "asked what television
    displaced" or "two hours a day" to Himmelweit; both lines were removed.
    Family: Research Wednesday, brick. Tonight line: sit beside them and ask
    what they are watching. Proof path is the shared lesson player where the
    parent and child work on it together, and the moments timeline.

## Never post, or only with the caveat attached

**Demoted sources, never built on, any channel.**
- Drummond 2020. The r 0.059 and "best practice" figures are untraced. Only
  its direction survives, and the violent games sentence stands on Przybylski
  and Weinstein 2019 instead.
- Ophir 2023. The 46 studies, 562,131 children and the bias correction
  wording are untraced. Only the one line conclusion survives, and "screens do
  not cause autism" never leads a post or sits on a card.

**Figures removed in a corrected row, never post.**
- McDaniel and Radesky 2018: the 90 percent and 48 percent daily interference
  figures.
- Common Sense Zero to Eight 2025: 25 percent calming and 44 percent out and
  about.
- Ofcom Children and Parents 2026: 55 percent think their child's use is too
  high, six in ten have their own profile, three quarters on a large platform.
  93 percent with a rule is the 2025 report. 40 percent trusting AI news is
  among teenage AI users only.
- Stoilova 2023: the 28 to 22 percent adoption decline, and therefore
  "parental control adoption is falling" from the Economist panel.
- DSIT 2026: 19 percent of children backing 16 is wrong (two thirds of
  children support some under 16 restrictions); 72 percent left out and
  14,000 children removed. This retires the "parents 90 versus children 19"
  contrast in the 27 August WhatsApp pack; do not reuse it.
- Internet Matters 2025: 12 percent "no one else to talk to" and 47 percent
  schoolwork.
- Pew 2025 chatbots: 4 percent almost constantly.
- Himmelweit 1958: two hours a day and the displacement lines.
- Baughan 2024: the "I can't pause it, it's online" child quote, still visible
  in the contradiction map and never quotable.
- GOV.UK 15 June 2026: the YouTube Kids exemption and any explicit gaming
  extension.
- eSafety Australia: the 750,000 Meta figure.
- Stevens 2021: the Kim 2022 4.06 percent, so never "3 to 4 in 100".
- Borzekowski 2005 and Mougharbel 2023: no sample size or mean age for either.

**Safe only with the caveat in the same sentence or slide.**
- Barzilay 2025: "1.3, 1.4 and 1.6 times", never decimals; "association, not
  proof"; families who give phones early differ; never in a hook.
- Xiao and Lund 2025: the denominator is the top 100 games that contain loot
  boxes.
- Girlguiding 2025: nearly 2,000 boys and girls aged 10 to 16, never "62
  percent of girls" (the ban readiness bullet in the briefing gets this
  wrong).
- Ofcom Media Lives 2025: 21 children aged 8 to 18, a filmed panel.
- Beyens 2020: 63 adolescents, 2,155 assessments.
- Radesky 2023: 422 children, convenience sample, parent report, boys r 0.20.
- Hiniker 2016: one to five year olds, US, and the "every way we sliced it"
  line is the press release.
- Bastani 2025: hints "largely mitigated" the harm; a PNAS correction exists
  that was not read.
- Common Sense companions 2025: "no one under 18" is the separate April 2025
  risk assessment; personal information is 24 percent of companion users.
- Collier 2016: restrictive is minus 0.06, active nonsignificant overall.
- Ra 2018: 2,587 tenth graders in Los Angeles County, OR 1.10, self report.
- Livingstone and Bovill: the 63 percent own television figure is 1999 data.
- Mazurek and Wenstrup 2013: 202 children with ASD and 179 siblings, 8 to 18.
- Brazendale 2017: a principle from weekend data, reliability 5, never a
  holiday screen stat.
- Coyne 2020: 385 adolescents, so "about one in ten drifted" carries the n.
- Every Pew, Common Sense and ABCD figure is marked US in the copy.

**Words and framings, any channel, per the briefing's own marketing row and
the Haidt test.** "Addiction", "dopamine like drugs", "screens cause ADHD or
autism", and any teen survey about what harms other teens (the 48 percent
versus 14 percent line in the contradiction map).

**Family account only.** No ban figure in either direction (Girlguiding, DSIT,
eSafety). No obesity or depression odds from the first phone finding. No
gaming disorder prevalence. Nothing from the temperament finding until the
SEND lens has run. No service claim for the six proposed scripts (no
confiscation promise, end of the match, Year 6 phone plan, gift card, AI
together, parent's protected slot), because they are recommendations in the
briefing, not rows in the scripts table yet; the tell a parent cards and the
agreement default are the built versions and are the only ones to point at.

## Series fit

**A new series, not Wrong Villain continued.** The Wrong Villain argues
proportionality, which villain is the wrong one. This pack argues what to do
at 8pm, which is a different job and a different reader (the parent in the
moment, not the policy debate). Proposed name, borrowed from the Skeptic lens:
**The Boring Findings**, numbered from Part 01, with the bedroom rule as Part
01 and the two minute warning, the calming shortcut, the loot box consent gap,
the hints not answers trial and the 1958 Norwich study as the next five.
Series numbering is the proven return reader device from Part 8, and staying
in one lane for a run of posts is the topic authority the 2026 model rewards.
Finding 15, the relocation of the pull, is the exception: it stays filed as
The Wrong Villain continued, re anchored to the UK. The family account
mirrors the same run on Research Wednesdays two days after each LinkedIn post,
per the sanctioned overlap, with Fridays taking the phone bridge, the child's
scripts and the AI module in that order.