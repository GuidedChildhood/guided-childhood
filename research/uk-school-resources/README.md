# What UK schools actually use, subject by subject, year by year

Compiled 17 September 2026 for the school resources shelf
(`plans/week-of-2026-09-14-school-resources-shelf-plan.md`, PR #1106).

Justin asked for three things that turn out to be one thing: the resources
schools give parents, our own version of that genre, and an honest picture of
the device use a child meets through school. All three need the same missing
layer, which is a reference list of what schools actually use. This is that
list, assembled by six parallel research lanes in one day.

---

## READ THIS FIRST: the evidence status of everything in this folder

**Nothing in this folder has been verified against a primary source, because no
primary source could be opened.**

Every page fetch in this session was refused by the network egress policy. The
proxy answered 403 to CONNECT for gov.uk, assets.publishing.service.gov.uk,
legislation.gov.uk, bbc.co.uk, thenational.academy and every publisher domain
tried. The proxy rules say report a policy denial rather than retry it or route
around it, so that is what happened. Web search still worked, because it runs
outside the proxy, and its session budget was then spent at 200 of 200.

So every claim here came through the search result layer: real titles, real
URLs, and the search engine's summary of pages nobody opened. The consequence,
stated plainly because the product depends on it:

1. **Nothing here is a verbatim quotation of a statutory document.** Our rule on
   curriculum text is quote, never paraphrase. That rule is not satisfied yet
   for a single line in this folder.
2. **No figure here may go into parent facing copy, a post, or a school
   document until it has been opened and quoted.** The verification queue at the
   end of this file is ordered by how load bearing each item is.
3. **Section by section tags say how each claim is known.** `[pub]` is a
   publisher's claim about itself, `[3rd]` an independent source, `[gov]` an
   official page named by URL but not opened, `[SEARCH INDEX ONLY]` a claim
   resting on a search summary alone.

What this folder IS good for right now: the inventory. Which schemes exist, who
publishes them, which years they cover, whether they need a screen, and what
each publisher gives parents. That is the part search results attest well, it is
the part we needed to plan against, and none of it is invented.

---

## The findings that change what we build

Twelve, in the order they matter to the product.

**1. The phonics market is a two horse race, so the scheme question is short.**
Teacher Tapp reports the top two schemes are Read Write Inc and Little Wandle
Letters and Sounds Revised, that more than half of schools use one of those two,
and that 80 per cent use one of the top six. `[3rd]` The DfE validation process
closed after three rounds with 45 programmes validated and no plans to repeat
it, so the list is effectively fixed. A parent funnel of two questions gets most
families to the right answer, which is what makes the scheme question in the
plan cheap enough to ship.

**2. The screens arrive in Reception, not at SATs, and nobody is telling
parents.** The Year 1 phonics screening check and both Key Stage 2 English
papers are pen and paper. The Reception baseline assessment is reported as
delivered one to one on two digital devices, the practitioner on one and the
child answering on a separate touchscreen, within six weeks of starting school.
The Year 4 multiplication tables check is on screen, 25 questions, six seconds a
question, no pass mark, 1 to 12 June 2026. So: screen in the first six weeks of
school, screen in Year 4, paper in Year 1 and Year 6. That is a complete parent
resource on its own and it sits exactly on our thesis.
Standards and Testing Agency guidance, `[SEARCH INDEX ONLY]`.

**3. The phone arrives at the school gate of Year 7, and Ofcom has the number.**
Smartphone ownership jumps from 56 per cent at age 10 to 83 per cent at age 11.
Ofcom, Children and Parents Media Use and Attitudes, 21 May 2026.
`[SEARCH INDEX ONLY]` This is the single most useful figure in the whole folder
for what we sell: the cliff edge our customers can feel coming is a real,
measured, one year jump, and it lands exactly at secondary transfer. Verify it
first and then it can lead a post, a page and the stage check copy.

**4. Almost nobody publishes a dose, and the two who do agree with us.**
Across every practice app in primary maths and English, only two published
figures for how long a child should be on it: DoodleMaths at about ten minutes a
session, little and often, and Maths Whizz at 45 to 60 minutes a week across two
or more sessions. Everyone else leaves it to the school. Our ten minutes a day
sits exactly where the only two published numbers sit, which is worth knowing
the next time anyone asks where the number came from.

**5. Homework has moved onto a screen, and out of school hours with it.**
Seven in ten parents say homework has moved online, and 84 per cent of families
using online learning systems say children are expected to access them outside
designated learning hours. Digital Poverty Alliance 2026 UK School Census, June
2026. `[SEARCH INDEX ONLY]` **The publisher is a campaigning body with an
interest in the answer**, so this one needs either a second independent source
or careful attribution before it is used anywhere public. If it holds, it is the
proof that the screen time a parent is fighting about was partly set by the
school.

**6. The biggest audited reach in primary maths comes with zero parent
material.** DfE management information for the Maths Hubs programme reports 44.2
per cent of primary schools (7,408) engaged with Teaching for Mastery in 2023 to
2024, 19.1 per cent (3,196) doing Mastering Number at Reception and Key Stage 1,
and 6.6 per cent (1,101) at Key Stage 2. NCETM and the Maths Hubs publish
essentially nothing for parents. Large reach, nothing for families, which is the
clearest gap in the lane.

**7. Publishers hand out a login and leave the school to write the leaflet.**
Collins, Pearson and Renaissance all give families access behind a school issued
login. The artefact that actually circulates to parents is a two page "how to
log in" guide written by the school, not the publisher. A neutral, plain English
"what your school just asked you to log into" page is unowned ground, and it is
a small build.

**8. The phone rule may now be backed by law, and the two lanes disagree about
it.** This is recorded as a disagreement on purpose, because it is the claim
most likely to embarrass us if we get it wrong.

- The secondary lane reports a clean sequence, corroborated across four
  independent legal commentaries: the February 2024 guidance was non statutory,
  it was updated on 19 January 2026, and section 36 of the Children's Wellbeing
  and Schools Act 2026 came into force on 29 June 2026 requiring state funded
  schools in England to have regard to it, with Ofsted considering
  implementation at every inspection from September 2026.
- The device exposure lane reports the same substance but found **the date
  sequence self contradictory in the search record**, and says plainly that
  nobody should say a word publicly until the House of Commons Library briefing
  CBP 10241 has been read.

Take the second position. The substance is probably right and the dates are not
safe, so **CBP 10241 and the legislation itself are item 3 in the verification
queue and nothing about the legal status goes into copy until they are open.**

**9. The tension is arithmetic, not rhetoric.** Sparx Maths says its compulsory
weekly homework usually takes around 30 minutes. Sparx Reader describes its
weekly 300 point target as around 30 minutes of reading, excluding question
time. So roughly 60 stated minutes a week of screen homework at the Year 7 end,
usually on a device the school does not supply, inside a school day that is
expected to be phone free. Alongside it, from the Children's Commissioner for
England, April 2025: 90 per cent of secondary schools restrict phone use, but
only 3.5 per cent stop a phone entering the building at all, against 21 per cent
of primaries, across about 19,000 schools. The DfE National Behaviour Survey is
reported as finding 20 per cent of secondary pupils say phones are used in most
lessons without permission. The rule is real and the reality is not the rule,
and both halves are sourced.

**10. The school by school layer may be obtainable after all.** English schools
are required to publish curriculum information on their websites. The two
documents that set out what, neither of them read, are the School Information
(England) Regulations 2012 for maintained schools and the DfE guidance "What
academies, free schools and colleges should publish online". If those require
curriculum content by subject and academic year, then the year group curriculum
map is a national, findable artefact for every school in England, and the thing
we assumed was unknowable becomes a dataset. **This is the highest value unknown
in the folder and the first thing to check when the network opens.**

**11. There is more legally reusable curriculum material than we thought, and
one piece of it is enormous.** The wider primary lane came back with a licence
taxonomy rather than a licence to do list, sorting every resource into Open
Government Licence, free but not open, Creative Commons, and all rights
reserved. What sits in the first bucket:

- **The national curriculum programmes of study.** Crown copyright, reusable
  free of charge in any format under the Open Government Licence, including
  commercially, with attribution. This is the footing our 448 objectives already
  stand on.
- **The Teach Computing Curriculum** from the National Centre for Computing
  Education. Reported as free and editable under the Open Government Licence,
  covering Key Stage 1 to Key Stage 4, roughly 500 hours. This is the single
  largest piece of legally reusable curriculum material found anywhere in the
  six lanes.
- **The Model Music Curriculum**, Open Government Licence v3.0.
- **Oak National Academy**, Open Government Licence, plus a free Open API for
  developers. Oak's licence was already known and settled: the decision of
  7 September 2026 (`plans/2026-09-07-oak-as-the-basis-plan.md`) is that we
  borrow the shape of a lesson and never the content, and that stands. The new
  part is the Open API, which is a route to knowing what a subject covers
  without us transcribing anything.
- **Not yet confirmed, and needed:** the statutory RSHE guidance and Education
  for a Connected World are Crown copyright and almost certainly follow the same
  pattern, but the licence statement inside each PDF could not be read. Do not
  treat either as Open Government Licence until someone opens them.

The practical effect: the parent resources in the plan can be written from
openly licensed source material for every subject, not just the three we hold
objectives for.

**12. Somebody is already teaching supervised social media to five to eleven
year olds, and it is our own thesis in a classroom.** Natterhub is a simulated
social media platform for ages 5 to 11 where children post and comment for real
inside a network described as gated to the class and supervised by the teacher,
across more than 300 lessons. It is reported as now free to UK primary schools
holding a Twinkl Ultimate subscription, which means adoption could move quickly.
`[SEARCH INDEX ONLY]`

Two consequences. First, it belongs in the device exposure card: a parent whose
Year 4 comes home talking about posting at school is probably describing this,
and they will want to know what it is. Second, it is the closest thing in the
English primary system to our own argument, that you do not prepare a child for
social media by keeping them away from it, and it is worth a proper look rather
than a line in a table.

### One contradiction worth keeping

On whether screens help children learn at all, the Education Endowment
Foundation digital technology strand is reported at four months average impact,
with individual reviews ranging from two months to over a year, and the strand
lost a padlock of evidence strength. `[SEARCH INDEX ONLY]` That is the honest
picture and it is not a tidy story. Our material should carry it as it is, since
a parent who has read the sceptical coverage will trust us more for saying the
evidence is mixed than for picking the half that suits us.

## The Little Wandle question, answered

Justin asked whether we can scrape and analyse their site and build our own
equivalent. The answer is yes to the analysis, no to the material, and the
reason is that we do not need their material.

**What they own.** Their copyright notice, corroborated across documents from
2021, 2022 and 2023 on six independent hosts, reads "© 2023 Wandle Learning
Trust. All rights reserved." `[SEARCH INDEX ONLY]`, so even this short notice is
corroboration rather than a page we opened. They publish nothing under any open
licence. The
terms of use page could not be opened, so the precise licence, intellectual
property and termination wording is the one real gap in that lane, and it is the
one point on which someone might make a legal decision. It is named in the
verification queue rather than paraphrased here.

**What they do not own, and we can build on.** The pedagogy is standardised by
the public DfE criteria that all 45 validated programmes were written to. The
phases and the grapheme sequence come from the public 2007 DfE Letters and
Sounds, not from them. The national curriculum programme of study is Open
Government Licence v3.0. The phonics screening check materials are Crown
copyright and reusable free of charge in any format under the same licence with
attribution to the Standards and Testing Agency. That is a stronger asset than
anything behind their membership wall, and it is the same footing our 448
curriculum objectives already stand on.

**What is worth copying is the architecture, not the content.** Their parent
area is free, open and unlocked because the buyer is the school and the parent
area is its shop window, while the teacher material sits behind membership.
Their parent downloads are cut by term and front loaded: Reception Autumn 1,
Autumn 2, Spring 1, then one consolidated Year 1 object. Four or five artefacts
across two years, not twelve. A parent is never handed the whole programme, only
the fortnight they are in. That termly slicing is the single best idea in the
genre and it is an idea, not an asset.

**The house rule this sets for the whole lane:** read their material, write our
own, link to theirs, redistribute nothing.

---

## The operating rule, which needs nobody's permission

Assembled from the licence position across all six lanes, and it is the rule the
build follows so the question never has to be reopened per resource:

1. **Name it.** A scheme's name is a fact about the world and naming it is not a
   licence question.
2. **Describe it in our own words.** Never their blurb, never their diagram.
3. **Link to theirs.** If a publisher gives parents something good, send the
   parent there. A link costs us nothing and makes the shelf trustworthy.
4. **Write every example ourselves, from the programme of study.** The national
   curriculum is the source, and it is the one body of text published under the
   Open Government Licence that we may use at length.
5. **Host nobody's PDF.** Not their worksheets, not their grapheme mats, not
   their overviews, not "just for our members".

Every claim in the plan's resource shelf can be built inside those five lines,
which is why the licence gaps in this folder block the verification pass and do
not block the build.

## The honest gap: what a parent can and cannot be told

This is the edge of what we hold, written down so no copy oversteps it.

**National, and knowable without asking the parent anything.** What a year group
is taught, in the Department's own wording. The statutory assessment calendar
and the format of each check, which is a date and a format rather than an
opinion. The national position on phones in school. The duty every school is
under to filter and monitor. How a school issued Google or Microsoft account
works as a product. What the evidence says about screens and learning, quoted
fairly including where it disagrees with itself.

**School by school, and unknowable unless the parent tells us.** What their
school is teaching this week. Which scheme their school bought. Which apps their
child has a login for. What their school's phone policy actually says. What
their school's device configuration allows. The age at which their school issues
an account, for which there is no national figure at all.

The code already refuses to guess at the first of those, in
`lib/learning/digi-context.ts`, and that refusal is correct. Everything in this
folder is a likelihood until a parent confirms it, and the product has to word it
that way.

---

## What we already ship in this genre

The genre research is catching up with the product rather than leading it. We
already build two of the seven artefacts a school sends home:

- The pupil knowledge organiser, one page per module, at
  `schools/app/print/[module]/organiser/page.tsx`. Its own code comment names
  the Jigsaw pupil knowledge organiser as its reference point.
- The module overview at `schools/app/print/[module]/overview/page.tsx`.
- School letter templates at `lib/email/school-letters.ts`.

Anyone building the parent version should read those three first.

---

## The verification queue, in priority order

Each of these is load bearing for something we would say to a parent. None can
be done until the egress policy allows the host, so the blocked hosts are named
in each line.

1. **The DfE validated phonics programmes list** (gov.uk). Transcribe all 45
   names and publishers and the wording on what validation means. The partial
   list in the English lane file is explicitly marked do not publish.
2. **The Reception baseline assessment IT guidance** (gov.uk). The two device
   requirement is the strongest device exposure fact we have and it needs the
   government's own words.
3. **The mobile phones guidance as updated 19 January 2026, and section 36 of
   the Children's Wellbeing and Schools Act 2026** (gov.uk,
   legislation.gov.uk). Four law firms agree on the substance. We still quote
   nothing until the primary text is open.
4. **The multiplication tables check assessment framework and the Key Stage 2
   test administration guidance** (gov.uk). The screen versus paper split per
   check, confirmed rather than reported.
5. **The School Information (England) Regulations 2012 and the academies
   publication guidance** (legislation.gov.uk, gov.uk). Finding 8 above. Check
   this first if the aim is the school by school layer.
6. **Little Wandle's terms of use** (littlewandlelettersandsounds.org.uk). The
   licence, intellectual property and termination sections, quoted.
7. **The Open Government Licence terms for DfE and STA material**
   (nationalarchives.gov.uk). This is the one body of text we could quote at
   length and legitimately, so it is worth being certain about.
8. **Publisher terms of use** for the top six phonics schemes and the main
   practice apps. Treat as a to do list, not as cleared permission.
9. **Two figures to pin down or drop.** The "over 80 per cent of UK primary
   schools" claim for Oxford Reading Tree, which no primary source supports, and
   the Jolly Phonics 54 per cent IPSOS-RSL figure, which carries no date.
10. **A sourced White Rose usage figure**, or none. Three uncited numbers
    circulate, 70, 80 and 85 per cent, all on commercial blogs with something to
    sell. Until a real one exists the defensible sentence is "the most widely
    used primary maths scheme, with third party estimates between 70 and 85 per
    cent, none of them cited", or nothing numeric at all.

---

## The files

| File | Lane | Rows |
| --- | --- | --- |
| `01-english-and-phonics.md` | Primary phonics, reading, writing, spelling, handwriting | 33 resources plus 8 statutory checkpoints |
| `02-maths.md` | Primary maths, schemes, practice apps, intervention | 70 |
| `03-wider-primary.md` | Every other primary subject, plus the platforms schools buy once | see file |
| `04-secondary.md` | Years 7 to 11, and the homework infrastructure a parent logs into | 10 verified plus 32 named and not reached |
| `05-device-exposure.md` | The device use school brings, and what schools send parents | see file |
| `06-little-wandle-analysis.md` | The structural analysis and the licence position | n/a |

Each file opens with its own evidence statement and ends with what it could not
verify. Those sections are the most useful part of each file and should not be
trimmed.
