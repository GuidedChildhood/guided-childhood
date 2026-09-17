<!--
Lane file of the UK school resources sweep, 17 September 2026.
READ research/uk-school-resources/README.md FIRST. Nothing in this file has been
verified against a primary source: every page fetch in the session that produced
it was refused by the network egress policy, so all of it rests on the search
result layer. No line here is a verbatim quotation of a statutory document, and
no figure here may enter parent facing copy until the verification queue in the
README has been worked.
-->

# English secondary, Years 7 to 11: what schools actually use, and what a pupil's device day looks like

Research run 17 September 2026. Lane: English secondary, Years 7 to 11.

## READ THIS FIRST: how everything below is known

**Nothing in this file was fetched.** Every external fetch attempt in this
session was refused by the organisation egress policy with `EGRESS_BLOCKED`, and
`curl` through the same proxy returned `CONNECT tunnel failed, response 403`.
Hosts refused include www.gov.uk, www.legislation.gov.uk,
assets.publishing.service.gov.uk, dera.ioe.ac.uk, commonslibrary.parliament.uk,
en.wikipedia.org, www.aqa.org.uk, sparxmaths.com, support.sparxmaths.com,
support.sparxreader.com and edtechimpact.com. The coordinator independently
confirmed the same denial log, adding ocr.org.uk, eduqas.co.uk,
senecalearning.com, educake.co.uk and tassomai.com. The proxy rules say a 403 is
an organisation policy denial to report rather than retry or route around, so
fetching was abandoned rather than bypassed.

Everything below therefore comes from **WebSearch results only**: the search
engine's own summary of a page, plus that page's real URL. The URLs are genuine
and worth recording. The content attributed to them is one step removed.

**Two tags are used, on every row and every claim:**

- **[FETCHED]** means a page was actually opened and read. **This tag appears
  nowhere in this file**, because no fetch succeeded. It is defined here only so
  the next session can use it.
- **[SEARCH INDEX ONLY]** means the claim came back inside a WebSearch result
  summary and no page was opened. **This is the status of every external claim
  below.**
- **[REPO]** is used once, for a fact already verified in this repository by an
  earlier session.

**No exact quotes.** An earlier draft of this file set several statements in
quotation marks. That was wrong and it has been removed throughout, because a
string returned by a search summary is not a verified quote and must not be
dressed as one. Where wording matters, particularly the Department for Education
mobile phones guidance, the document is **named and described and tagged, and
deliberately not quoted**. House rule 2 requires statutory material to be quoted
rather than paraphrased, and the honest consequence of the fetch block is that
**this lane cannot yet satisfy house rule 2 at all.** Nothing here is ready for a
parent facing claim until the primary pages are opened.

**Prevalence figures carry the weakest warrant of anything here.** A percentage
is exactly the kind of claim that needs a primary source, and none was reachable.
Where a figure came back through the search index it is recorded with its tag so
the next session can confirm or kill it. Where no figure came back at all, the
entry reads **not found, fetch blocked**, never an estimate.

**A second blocker also bit.** WebSearch replied "this session has used its web
search budget (200 of 200 WebSearch calls)" partway through. Only about 16 were
mine, so the budget was nearly spent before this lane started. That is why
roughly 30 of the resources named in the brief have no row at all. Raising
`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` is the fix. Per the coordinator's
instruction, no new research was started after the stop.

**What is actually solid here.** The inventory itself: resource name, publisher,
subject, year groups, what the thing is, and whether it needs a device. That is
well attested across multiple independent search results and is the part worth
building on. Prices, school counts and percentages are not solid.

---

## TABLE 1: resources with a source, Years 7 to 11

Ten rows. Columns are as briefed, plus the Evidence column.

| Resource | Publisher | Subject | Year groups | What it is (one line) | Parent facing material? | Device needed | How widespread | Official URL | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| Sparx Maths | Sparx Learning | Maths | Years 7 to 11 (ages 11 to 16) | Weekly personalised maths homework where every question must be answered correctly before the week counts as complete. | Paid via school. Sparx emails parents a homework update when compulsory homework is set. Individual schools publish their own parent guide PDFs, for example Gloucester Academy's 2025/26 Sparx guide for parents. | Yes, and normally the child's or family's own device at home | Vendor claims reported by the search index: over 2500 schools and millions of students; Sparx Learning separately claims over 2.4 million students and reach into over half of UK schools for ages 11 to 16. **No independent figure. Not fetch confirmed.** | https://sparxmaths.com/ | [SEARCH INDEX ONLY] (sparxmaths.com/sparx-schools, sparx-learning.com/our-story, support.sparxmaths.com/en/articles/342343-monitoring-homework-completion, gloucesteracademy.co.uk) |
| Sparx Reader | Sparx Learning | English and reading | Years 7 to 11, most heavily Year 7 | Weekly reading homework: the pupil reads a book of their choice on screen and answers questions at checkpoints to earn Sparx Reader Points. | Paid via school. Schools publish their own parent pages and FAQ PDFs, for example Wath Academy, Barnsley Academy, and King Edward VI School Birmingham. | Yes, and normally the child's or family's own device at home. The book is in the browser, so there is no paper route. | Vendor claim reported by the search index: 2,600+ schools, 75,000+ teachers, 2.2 million+ students in the UK. **No independent figure. Not fetch confirmed.** | https://sparxreader.com/ | [SEARCH INDEX ONLY] (sparxreader.com, support.sparxreader.com/en/articles/342308, wathacademy.com, barnsley-academy.org, knsb.kevibham.org) |
| HegartyMaths | Colin Hegarty, then Sparx Learning | Maths | Was Years 7 to 11 | **Retired.** Video and quiz maths homework platform. Sold to Sparx Learning September 2019, folded into Sparx Maths after about three years, now redirects to Sparx Maths. | None, it no longer exists | n/a | At acquisition the stated aim was over 1 million users in over 1,300 schools. **Closure date not established: search results conflict between 2022 and late 2023.** | Redirects to https://sparxmaths.com/ | [SEARCH INDEX ONLY] (tes.com entrepreneur-teacher-sells-online-maths-business, en.wikipedia.org/wiki/HegartyMaths, sparx-learning.com/our-story, shinetrust.org.uk) |
| MathsWatch | MathsWatch Ltd | Maths | Years 7 to 11 (KS3 and GCSE), plus AS Pure Core | Library of short maths videos plus auto marked practice questions, set as homework and used for revision. | Paid via school. The videos are the parent facing asset: schools present it as a way for parents to see the methods taught in class. | Yes, normally the child's or family's own device at home | **Not found, fetch blocked.** No school count surfaced. | https://www.mathswatch.co.uk/ | [SEARCH INDEX ONLY] (new.mathswatch.co.uk/products/gcse, educationalappstore.com/app/mathswatch-gcse, structural-learning.com/post/mathswatch) |
| Dr Frost Maths | Dr Frost Learning, a registered charity | Maths | Years 7 to 11 and beyond | Free question bank and resource library, including real past paper questions from the major boards, with auto marking. | Free resources and a student login. A students page exists. No dedicated parent pack surfaced. | Yes for the platform, optional for the PDF resources, which print | Vendor claims reported by the search index: resources downloaded over 20 million times, over 800 million questions answered. **School count not found, fetch blocked.** | https://www.drfrost.org/ | [SEARCH INDEX ONLY] (drfrostmaths.com/page.php?id=27, drfrost.org/students, drfrost.org/pricing, register-of-charities.charitycommission.gov.uk) |
| Corbettmaths | Corbettmaths (John Corbett) | Maths | Years 7 to 11, plus a separate primary site | Free maths videos, topic worksheets and the daily 5-a-day practice sheets, all downloadable as PDFs. | **Free downloads and videos, no login.** The strongest parent facing maths resource found in this sweep. | **No.** Everything prints. Videos are optional. | **Not found, fetch blocked.** No usage figure surfaced. | https://corbettmaths.com/ (primary: https://corbettmathsprimary.com/) | [SEARCH INDEX ONLY] (corbettmaths.com, corbettmaths.com/more/about/terms-of-use) |
| Method Maths | Method Maths | Maths | Years 2 to 11; secondary use is GCSE focused | Self marking real exam papers, mostly Pearson Edexcel GCSE, with raw score to grade conversion and built in hints. | Paid via school, and there is a dedicated parents page. | Yes, normally the child's or family's own device at home | Vendor claim reported by the search index: used by over 700 schools. **Not fetch confirmed.** | https://www.methodmaths.info/ (note **.info**, not .co.uk as the brief assumed) | [SEARCH INDEX ONLY] (methodmaths.info, methodmaths.info/gcse, methodmaths.info/parents) |
| Mathletics | 3P Learning | Maths | Ages 9 to 16, so Years 7 to 11 at the older end | Gamified maths practice and fluency activities with a points and certificate loop. | **Paid direct to parents** as a separate home subscription with its own price list. | Yes, normally the child's or family's own device at home | Vendor claims cover all 3P Learning products in all territories: 4 million students, 18,000+ schools. **No UK secondary figure found, fetch blocked.** Mathletics is more commonly a primary tool. | https://www.mathletics.com/uk/for-schools/ | [SEARCH INDEX ONLY] (mathletics.com/uk/for-schools, mathletics.com/uk/for-home, parent.3plearning.com/s/product-pricing, 3plearning.com) |
| Educake | Educake | Science first, also maths, English, computer science and others | KS2, KS3, GCSE and some A level, so Years 7 to 11 | Auto marked online quizzing from a bank of about 100,000 specification mapped questions, used for homework, assessment and revision. | Paid via school, plus free sample quizzes with no login. Vendor says analytics are provided for teachers and parents. | Yes, normally the child's or family's own device at home | **Not found, fetch blocked.** Independently evaluated by the Association for Science Education. | https://www.educake.co.uk/ | [SEARCH INDEX ONLY] (educake.co.uk, educake.co.uk/sample-quizzes, ase.org.uk/news/ase-evaluated-educake-online-quizzing) |
| Kerboodle | Oxford University Press | Science, maths, English, MFL and more | KS3, GCSE, A level, so Years 7 to 11 | OUP's subscription digital service: online textbooks matched to a specification, plus resources and auto marked assessment. | Paid via school. **Login needs a username, a password and an institution code the school issues**, which is the login a parent most often has to chase. | Yes, normally the child's or family's own device at home. It is the digital textbook, so there is often no paper copy at home. | **Not found, fetch blocked.** | https://global.oup.com/education/secondary/subjects/kerboodle-online-learning/ | [SEARCH INDEX ONLY] (global.oup.com kerboodle-online-learning, kerboodle.com/users/login) |

### Prices reported, all unconfirmed

Useful because a school that has paid means the homework is not optional. All
three came from third party review sites through the search index, not from a
publisher price list, so **treat every number as unconfirmed**.

| Resource | Price reported | Evidence |
|---|---|---|
| Educake | £880 + VAT a year for Science KS3 and GCSE; £880 + VAT per subject for English, maths and science; £550 + VAT other subjects; discounts for four or more schools in a MAT; free 30 day teacher trial | [SEARCH INDEX ONLY] (edtechimpact.com/products/educake, structural-learning.com/post/educake) |
| MathsWatch | GCSE or IGCSE £375 + VAT a year; KS3 £150 + VAT a year; secondary bundles £450 to £500 + VAT a year; one subscription covers up to 1500 users on a single site | [SEARCH INDEX ONLY] (structural-learning.com/post/mathswatch, quote form at mathswatch.co.uk/order) |
| Method Maths | From £20 + VAT per month | [SEARCH INDEX ONLY] (methodmaths.info) |

---

## TABLE 2: named in the brief, no source reached

No row is given for any of these, because no search result was obtained for any
of them before the search budget ran out. Inventing a row would break house rule
1. **This is an inventory gap caused by the search budget, not by the fetch
block**, so a session with search budget can fill it without needing egress
opened. This is the pick up list, in priority order within each block.

| Resource | Subject area | What still needs finding | Evidence |
|---|---|---|---|
| Satchel One (Show My Homework) | Homework platform | **Top priority.** School count, the parent app, notification behaviour, price | none |
| ClassCharts | Behaviour and homework | **Top priority.** School count, the parent app, live behaviour point notifications | none |
| Arbor | MIS | Share against SIMS and Bromcom, the Arbor parent app | none |
| Bromcom | MIS | Share, the MyChildAtSchool parent app | none |
| SIMS Parent (ESS) | MIS | Share, the SIMS Parent app, whether ESS still leads secondary MIS | none |
| Edulink One | Parent app | School count, which MIS it sits on | none |
| MyEd | Parent app | Whether still trading, which MIS it sits on | none |
| Google Classroom | Homework and delivery | UK secondary share, Chromebook tie in, guardian summaries | none |
| Microsoft Teams for Education | Homework and delivery | UK secondary share, Assignments, parent access or lack of it | none |
| Firefly Learning | VLE and homework | School count, parent portal | none |
| Provision Map | SEND | Publisher, school count, whether parents ever see it | none |
| AQA | Exam board | What a parent can read free: specification PDF, past paper embargo, subject content, and the copyright position | none |
| Pearson Edexcel | Exam board | Same, plus the free past paper position | none |
| OCR | Exam board | Same | none |
| WJEC Eduqas | Exam board | Same, plus the England versus Wales distinction | none |
| Seneca Learning | Cross subject revision | Free tier terms, the widely quoted student number, Premium price, school count | none |
| BBC Bitesize | Cross subject | **Terms of use for reuse**, which is the licence question that matters most to us, plus usage figures | none |
| Oak National Academy | Cross subject | Product shape at KS3 and KS4. **Licence already known, see section C.** | none for product |
| Tassomai | Science, cross subject | Daily goal length in the vendor's own words, school count, parent material, price | none |
| Isaac Physics | Physics | Licence, University of Cambridge backing, free access terms, school count | none |
| Save My Exams | Cross subject revision | Free versus paid split, whether schools or pupils buy it, parent pages | none |
| GCSEPod | Cross subject | Podcast and video model, school count, parent material, price | none |
| Bedrock Learning | English, vocabulary | Weekly homework length, school count, price, parent reporting | none |
| Accelerated Reader (Renaissance) | Reading | Secondary specific use, ZPD and book level mechanics, parent reports, whether quizzing needs a device | none |
| LitCharts | English literature | **The interesting one:** how schools treat it, whether it is discouraged as a substitute for reading, and its terms of use | none |
| Massolit | English, humanities | Whether schools or pupils subscribe, price, licence | none |
| Carousel Learning | Cross subject retrieval | Free tier, school count, price | none |
| Quizlet | Cross subject | Free versus Plus, school licensing, whether Learn mode is paywalled | none |
| Anki | Cross subject | How schools actually use it, shared deck licensing, that it is free and open source | none |
| Century Tech | Cross subject AI | Whether still trading at scale in England, school count | none |
| Memrise | MFL | Whether schools still use it after the consumer pivot | none |
| Duolingo for Schools | MFL | Whether English secondaries actually use it, and its free terms | none |

---

## A. PARENT FACING MATERIAL

**Status: thin, and the thin part is honest.** This section was scheduled for the
second half of the sweep and the budget ran out first.

### What a source exists for

- **Individual schools write their own parent guide per platform and publish it
  as a PDF on the school website.** This is a real, repeatable genre and live
  examples surfaced. Gloucester Academy publishes a document titled 2526 Sparx
  Guide for Parents. King Edward VI School Birmingham publishes a Sparx Reader
  Guide FAQs PDF whose first listed question is about whether the reading timer
  slows down or changes. Wath Academy and Barnsley Academy both run a standing
  Sparx Reader page in site navigation. **The shape to copy: one platform, one
  short PDF or one page, a login reminder, a what good looks like line, an FAQ
  block. Not a booklet.** [SEARCH INDEX ONLY] (gloucesteracademy.co.uk,
  knsb.kevibham.org, wathacademy.com, barnsley-academy.org)
- **Publishers email parents directly, and a teacher toggle controls it.** Sparx
  sends parents homework update emails, and reportedly does not send them when
  homework is set to optional only. If that holds, a parent's sense of whether
  homework exists is partly a product of a setting they cannot see.
  [SEARCH INDEX ONLY] (support.sparxmaths.com/en/articles/342343-monitoring-homework-completion)
- **Publishers also sell to parents over the school's head.** Mathletics runs a
  separate paid home subscription with its own price list. Method Maths runs a
  dedicated parents page. [SEARCH INDEX ONLY] (mathletics.com/uk/for-home,
  parent.3plearning.com/s/product-pricing, methodmaths.info/parents)
- **A third party parent guide market exists**, which is itself a signal the
  official material is not doing the job. Example: a commercial Sparx Maths
  Parent Guide 2025 at familytechhub.co.uk. Worth reading as a competitor before
  we build ours. [SEARCH INDEX ONLY]
- **The free, no login, printable end of the market is thin and one name owns
  it.** Corbettmaths gives away every video, worksheet and 5-a-day sheet with no
  account. For maths at Years 7 to 11 that is the parent facing benchmark to
  beat. [SEARCH INDEX ONLY] (corbettmaths.com)

### Not reached, and not to be written against

Each of these was in the brief and none was reached. No shape, no page count, no
timing is asserted for any of them.

- The curriculum overview page on a school website.
- The year group curriculum booklet.
- The options booklet in Year 8 or Year 9.
- The revision timetable.
- The parents evening booking platform. SchoolCloud is the name I would expect
  to find, **I have no source for it, so it stays out.**
- Whether any of the above routinely names the homework platforms and their
  logins, which is the single most useful thing for us to know.

---

## B. DEVICE EXPOSURE

The section the product turns on. It is also the section where the fetch block
hurts most, because the load bearing document is a Department for Education
publication I could not open.

### B1. The phone policy a Year 7 to Year 11 pupil will meet

Three things appear to have happened in sequence. **All three are
[SEARCH INDEX ONLY] and none is quoted.**

1. **February 2024.** The Department for Education published non statutory
   guidance for England titled *Mobile phones in schools*. As reported, it said
   schools should develop a policy prohibiting the use of mobile phones and
   other smart technology with similar functionality throughout the school day
   including break times, leaving the method to each school.
   [SEARCH INDEX ONLY] (House of Commons Library briefing CBP-10241 at
   commonslibrary.parliament.uk/research-briefings/cbp-10241/;
   brownejacobson.com/insights/not-quite-a-blanket-ban-on-mobile-phones-in-schools;
   tes.com/magazine/news/general/schools-should-ban-mobile-phone-use-says-new-guidance)
2. **19 January 2026.** The guidance was updated. **The updated wording is the
   thing I most want and least have.** As reported by legal commentary, the
   update sets a default expectation that schools are free of mobile phones,
   with anything other than that by exception only. **That is a description, not
   a quote, and it must not be presented as the guidance's words.** An archived
   PDF of the updated page, carrying an Updated 19 January 2026 line, sits at
   dera.ioe.ac.uk/id/eprint/41821/, and the live page is at
   gov.uk/government/publications/mobile-phones-in-schools/mobile-phones-in-schools.
   Both refused the fetch. The expectation is reported to cover the whole school
   day: lessons, the time between lessons, break times and lunchtime.
   [SEARCH INDEX ONLY] (brownejacobson.com/insights/dfe-guidance-update-steps-to-phone-free-schools;
   wrigleys.co.uk mobile-phones-in-schools-guidance-to-become-statutory)
3. **29 June 2026.** Section 36 of the **Children's Wellbeing and Schools Act
   2026** is reported to have come into force, requiring state funded schools in
   England to have regard to published guidance on mobile phones, which is what
   gives the guidance legal weight. From September 2026 Ofsted is reported to
   consider a school's policy, staff and pupil understanding of it, and its
   effectiveness, as part of every school inspection.
   [SEARCH INDEX ONLY] (legislation.gov.uk/ukpga/2026/21/section/36/enacted;
   brownejacobson.com/insights/kcsie-2026/mobile-phones-in-schools;
   schoolsweek.co.uk/dfe-set-to-make-school-phone-ban-guidance-statutory;
   freeths.co.uk the-children-s-wellbeing-and-schools-act-2026)

**If only one thing from this file gets checked, check this.** The move from non
statutory guidance to statutory footing is the strongest strategic finding in the
lane and the weakest evidenced. Three separate law firms and Schools Week were
reported as saying it, which is reassuring, and it is still second hand.

**Exceptions**, as reported and not quoted: adaptations for specific pupils to
meet legal duties for pupils with medical conditions under the Children and
Families Act 2014 and reasonable adjustments for disabled pupils under the
Equality Act 2010; boarding schools outside the school day; residential and
other school trips outside the school day. Methods are reported as examples
rather than a direction, including lockers and handing phones in at the start of
the day. [SEARCH INDEX ONLY] (brownejacobson.com, wrigleys.co.uk)

### B2. How common the restrictions are

**Every figure in this table is [SEARCH INDEX ONLY] and none is fetch
confirmed.** They are kept because they came from search results rather than
from me, and because they measure genuinely different things that press coverage
tends to blend. They are not yet usable in public copy.

| Figure as reported | Year | Reported source |
|---|---|---|
| 90 percent of secondary schools had policies restricting phone use, and 99.8 percent of primaries. Survey of 12,730 state funded primary and 2,467 secondary schools in England, attributed to Children's Commissioner for England work. | April 2025 | lordslibrary.parliament.uk smartphones-in-schools |
| 3.5 percent of secondary schools prohibited pupils bringing a phone to school at all, against 21 percent of primaries. | April 2025 | lordslibrary.parliament.uk smartphones-in-schools |
| 5 percent of secondary teachers worked in schools where phones were not allowed on the premises; a further 9 percent in schools that took possession of phones during the day. Teacher Tapp. | February 2024 | fullfact.org/education/phone-bans-in-schools |
| 48 percent of secondary teachers said pupils were not allowed to use phones at all during the day; a further 21 percent said not unless directed by a teacher. Teacher Tapp. | 2024 | teachertapp.com teacher-tapp-dials-in-on-mobile-phones, via fullfact.org |
| 20 percent of secondary pupils said mobile phones were used in most lessons without permission. DfE National Behaviour Survey. | published April 2024 | fullfact.org/education/phone-bans-in-schools |
| 70 percent of the 137 secondary schools in England that answered said cell phone use is not allowed on school premises. PISA. | late 2022 | fullfact.org/education/phone-bans-in-schools |

**The honest reading, and Full Fact is reported as making this point itself:
there can be a large gap between the number of schools that ban phones and the
number where the ban is effectively enforced.** So a reported 90 percent have a
policy, a reported 3.5 percent keep the phone out of the building, and a
reported one in five pupils still sees phones in most lessons. A parent is not
sending a child into a phone free day. They are sending them into a day where
the phone is in a bag or a locker and against the rules. [SEARCH INDEX ONLY]

### B3. The device the school itself puts in front of them

**All [SEARCH INDEX ONLY], all via third party summaries of the DfE report
rather than the report.**

| Figure as reported | Source reported | Evidence |
|---|---|---|
| Laptops available in 94 percent of secondaries and 90 percent of primaries | DfE Technology in Schools Survey 2024 to 2025, published November 2025 | [SEARCH INDEX ONLY] (edtechinnovationhub.com; official report page gov.uk/government/publications/technology-in-schools-survey-report-2024-to-2025) |
| Assistive technology availability in secondaries rose from 40 percent to 59 percent | same survey | [SEARCH INDEX ONLY] (edtechinnovationhub.com) |
| Lack of staff skills and confidence cited as a barrier by 70 percent of secondary leaders, up from 60 percent in 2023 | same survey | [SEARCH INDEX ONLY] (edtechinnovationhub.com) |
| Secondary schools with a digital strategy rose from 54 percent to 68 percent | DfE Technology in Schools Survey, 2022 to 2023 comparison | [SEARCH INDEX ONLY] (gridserve.co.uk, seesaw.com) |
| The average secondary school has around 520 devices available for teachers and pupils | BESA ICT in UK State Schools | [SEARCH INDEX ONLY] (besa.org.uk/insight/device-provision-school-spending) |
| Pupils move between school and college devices and their own personal devices through the day | DfE Technology in Schools Survey 2024 to 2025 | [SEARCH INDEX ONLY] (edtechinnovationhub.com) |

**How many English secondaries issue a device to every pupil: not found, fetch
blocked.** This is the most important unanswered question in the brief. The
number did not appear in any search summary, and the DfE PDF that would settle
it refused the fetch. What the next session needs to know is that the 2024 to
2025 report is reported to contain a figure on whether pupils provided with
portable digital devices by school are allowed to take them home, so take home
provision is covered in there. Report PDF:
`https://assets.publishing.service.gov.uk/media/692834a6ce50d215cae9610e/Technology_in_schools_survey_2024_to_2025_research_report.pdf`,
mirrored at dera.ioe.ac.uk/id/eprint/41655/. Everything the search index returned
on one to one schemes was United States or Scotland, not England.

**Bring your own device prevalence in English secondaries: not found, fetch
blocked.** No England wide figure surfaced.

Adjacent context, useful but not transferable: the closest United Kingdom one to
one picture is Scotland, where pupils in Primary 6 and above are reported to have
been issued iPads in Edinburgh, Falkirk, Glasgow and Scottish Borders, and
Chromebooks in Aberdeen, Highland, Stirling and West Dunbartonshire.
**Do not present that as an English figure.** [SEARCH INDEX ONLY]
(callscotland.org.uk). There is also a live Mumsnet thread of parents comparing
which secondaries issue laptops and tablets, good audience language and not
evidence [SEARCH INDEX ONLY] (mumsnet.com/talk/secondary/5269565).

### B4. Homework that only works on a screen

Reporting only what the search results actually said, with no quotation marks.

- **Sparx Maths.** The search result reported that the main compulsory homework
  usually takes around 30 minutes to complete, rising to around 60 minutes when
  the pupil or class is set to receive optional only homework. Two mechanics
  were also reported and both matter to a parent. First, every question must be
  answered correctly for the week's homework to be marked complete, so 30
  minutes reads as a floor rather than a ceiling and a struggling child's 30
  minutes becomes longer. Second, homework length varies per pupil, particularly
  while the system is still learning their working speed. Sparx is also reported
  as citing an independent evaluation by the University of Cambridge Faculty of
  Education to the effect that completing the recommended 60 minutes a week for a
  whole school year yields on average a 0.24 grade improvement at GCSE. A
  Cambridge programme page and a key findings PDF are reported to exist at
  educ.cam.ac.uk/research/programmes/sparx/. On the XP loop, a pupil completing
  all compulsory homework is reported to earn about 5,000 XP every 10 weeks.
  **All [SEARCH INDEX ONLY]** (support.sparxmaths.com/en/articles/342349-key-concepts-of-a-sparx-maths-homework;
  support-new.sparxmaths.com/en/articles/342247-student-rewards-and-recognition;
  educ.cam.ac.uk/research/programmes/sparx/)
- **Sparx Reader.** The search result reported a weekly target of 300 Sparx
  Reader Points, equated by the publisher to around 30 minutes of slow, careful
  and accurate reading per week, with the rider that this does not include the
  time taken to read and answer the questions at each check. Note what this
  means: **reading homework has moved onto a screen.** The book is in the
  browser, the points only accrue on the platform, and a paper book earns
  nothing. **[SEARCH INDEX ONLY]** (support.sparxreader.com/en/articles/342308;
  school FAQ PDF at knsb.kevibham.org)
- **Kerboodle.** The textbook is the subscription. Where a school has gone
  Kerboodle there is frequently no paper textbook at home, so any reading or
  question set from the book needs a screen and the school issued institution
  code. **[SEARCH INDEX ONLY]** (global.oup.com kerboodle-online-learning)
- **Educake, MathsWatch and Method Maths** are all auto marked and online only
  for the homework function, though MathsWatch also ships worksheets and Method
  Maths covers real papers that exist on paper elsewhere. **[SEARCH INDEX ONLY]**
- **Corbettmaths is the exception that proves the point.** Free, no login, and
  every worksheet and 5-a-day sheet prints. **[SEARCH INDEX ONLY]**

**Total minutes of screen homework a week at secondary: not found, fetch
blocked.** No survey figure was reached. The only thing that can be said, and
only with its tag attached, is that the two Sparx products alone account for a
reported 60 minutes a week at the Year 7 end, 30 for maths and 30 for reading,
before science or languages, and before the correct answer rule stretches the
maths half. **That is a floor assembled from two vendor help pages read through a
search index. It is not a total and must not be presented as one.**

### B5. Logins a parent is asked to manage

From the ten rows above, a Year 7 parent can expect to hold or help with the
Sparx Maths login, the Sparx Reader login, the Kerboodle login, a MathsWatch
login issued by the teacher, and an Educake login. Add the homework platform and
the MIS parent app, neither of which was reached. **The Kerboodle institution
code is worth singling out: reportedly a school issued code on top of username
and password, so it is the one a parent cannot recover alone and has to email the
school about.** [SEARCH INDEX ONLY]

### B6. Notifications that reach a child's phone

**Largely not reached.** ClassCharts and Satchel One are the two products that
push hardest and neither was reached, so nothing is asserted about push
notifications to a pupil's own phone. One mechanism was reported: Sparx emails
parents a homework update when compulsory homework is set, and not when it is
optional only. [SEARCH INDEX ONLY] (support.sparxmaths.com/en/articles/342343)

### B7. The tension, named plainly, and graded honestly

The tension the brief asked us to name does hold up, and the grading matters as
much as the naming.

**Well evidenced, from multiple independent search results:** schools restrict
phones through the school day, and the same schools set homework that cannot be
done without a screen. Both halves came back repeatedly and from unrelated
sources. This is safe to build a product argument on.

**Reasonably evidenced but second hand:** that the restriction is now statutory
rather than advisory, via section 36 of the Children's Wellbeing and Schools Act
2026 from 29 June 2026, with Ofsted inspecting implementation from September
2026. Four separate reporters, no primary text.

**Weakly evidenced, do not publish yet:** every percentage. The 90 percent with
a policy, the 3.5 percent that keep phones out of the building, the 20 percent of
pupils seeing phones in most lessons. All reported, none confirmed.

**Not evidenced at all:** how many English secondaries hand every pupil a
device, how much total screen homework a week a secondary sets, and whether a
school running bring your own device has to justify itself against a by
exception only default.

With those grades attached, the shape of it is this. The school day is expected
to be free of phones, and the school then sets homework that runs on a screen the
school usually does not supply, so the device the homework runs on at home is for
most families the child's own phone, tablet or laptop. **The school takes the
phone away in the morning and hands the screen back at four o'clock with a task
on it, a points target, a league table and a completion email to the parent.**
That is the gap the product sits in. A parent following the school's own lead
gets a restricted day and an unstructured screen evening, and nothing in either
half teaches the child to handle the thing.

**One question to put to a head rather than assume.** The reported exceptions
cover medical conditions, disability, boarding and trips. Nothing surfaced saying
a school may permit phones because it uses them for learning. Given a by
exception only default, a school running bring your own device might have to
justify it. That would be genuinely useful to be able to tell a parent and it
needs the actual guidance text. **Do not assert it either way.**

---

## C. LICENCE AND TERMS

Reuse matters because we build in the same genre and redistribute nothing. Two
licences were located. The rest are open, and **because nothing was fetched, even
the two located ones are not safe to rely on yet.**

### Located

**Corbettmaths.** The search index reported the terms of use page as saying, in
substance, that all resources are free and will always be free for individual
use or for use by teachers and tutors with their classes or students, and that no
Corbettmaths resource may be used by anyone for profit making purposes, with
private tuition excluded from that prohibition. The site is also reported to ask
colleagues to link to resources rather than upload copies, because worksheets are
constantly updated and stale versions circulating is the thing he wants to avoid.
**Described, not quoted. [SEARCH INDEX ONLY]**
(corbettmaths.com/more/about/terms-of-use; second page at
corbettmaths.com/2018/05/17/terms-and-conditions)

**Read this as a hard no for us, and read it that way now rather than later.**
Guided Childhood is a commercial product. If the profit making clause is as
reported, it rules out any Corbettmaths sheet in anything we sell, and it rules
out bundling one into a free lead magnet that feeds a paid product. We can link
to Corbettmaths and tell a parent it exists and is excellent. We cannot
reproduce a single sheet. Linking is reportedly what he asks for, so a
signposting section in our own material is both compliant and welcome. **Confirm
the wording before relying on the exact scope of the exclusion.**

**Oak National Academy: Open Government Licence version 3.0.** This is the one
fact here that does not depend on this session's blocked network. Source is this
repository's own earlier research: `research/2026-09-07-oak-and-common-sense-source-mining.md`,
line 165. **[REPO]** That file also records the standing decision, which holds
and is not relitigated here: we take the shape of a lesson and never the
substance, and nothing from Oak goes into our decks. OGL v3.0 would in principle
permit adaptation with attribution, and the repo decision is deliberately
stricter than the licence allows.

**Dr Frost Maths, a caution rather than a licence.** Reported as a registered
charity, Dr Frost Learning, charity number 1194954, describing itself as an
educational non profit. **But it is also reported to operate a pricing page at
drfrost.org/pricing offering a subscription or a free trial**, so Dr Frost is
free is not a safe claim as written. The free versus paid split needs checking
before we say anything about it. No reuse or copyright statement surfaced.
**[SEARCH INDEX ONLY]**

### Not located

No licence, copyright or terms statement surfaced for Sparx Maths, Sparx Reader,
MathsWatch, Method Maths, Mathletics, Educake or Kerboodle. All seven are
commercial subscription products and all should be treated as all rights
reserved until their terms are read.

**BBC Bitesize, Isaac Physics, LitCharts, Seneca, Save My Exams, Quizlet and all
four exam boards were not reached at all.** The exam board copyright position on
specifications and past papers is the most commercially relevant open question in
this lane, because a parent facing what your child is actually being examined on
resource, written in our own words, depends on knowing exactly what may and may
not be taken from a specification. Note that ocr.org.uk and eduqas.co.uk are both
in the confirmed egress denial log, so two of the four boards need the allowlist
opened and not just search budget.

### The working rule until the rest is read

Assume all rights reserved. Link, never reproduce. Write every explanation in our
own words from a specification's structure rather than its sentences. Where a
statutory or curriculum document has to be quoted, quote it from the page itself,
mark it as their wording, and cite it. **That last step is exactly what this
session could not do, which is why this file quotes nothing.** The existing repo
decision on Oak already works this way and it generalises cleanly.

---

## WHAT TO DO NEXT

1. **Two different blockers, two different fixes, and they unlock different
   things.** Raising `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` fills table 2,
   which is 32 resources of pure inventory and does not need egress. Opening the
   egress allowlist is what upgrades this file from [SEARCH INDEX ONLY] to
   [FETCHED] and is the only route to satisfying house rule 2 on the statutory
   material. Ask for both, and if only one arrives, search budget buys breadth
   and egress buys defensibility.
2. **First three fetches when egress returns**, in this order:
   - `https://www.gov.uk/government/publications/mobile-phones-in-schools/mobile-phones-in-schools`
     for the exact guidance wording, the exception list, and anything on devices
     used for learning.
   - `https://assets.publishing.service.gov.uk/media/692834a6ce50d215cae9610e/Technology_in_schools_survey_2024_to_2025_research_report.pdf`
     for the one to one and take home device percentages.
   - `https://www.legislation.gov.uk/ukpga/2026/21/section/36/enacted` for the
     statutory text.
3. **Then table 2 in the order given**, Satchel One and ClassCharts first,
   because the homework and behaviour platform is what a parent logs into daily
   and it is the biggest hole in section B.
4. **Nothing in this file goes into parent facing copy until its tag changes.**
   The inventory columns are safe to plan against. The percentages, the prices
   and the statutory position are not.
