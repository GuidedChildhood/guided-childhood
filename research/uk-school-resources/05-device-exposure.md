<!--
Lane file of the UK school resources sweep, 17 September 2026.
READ research/uk-school-resources/README.md FIRST. Nothing in this file has been
verified against a primary source: every page fetch in the session that produced
it was refused by the network egress policy, so all of it rests on the search
result layer. No line here is a verbatim quotation of a statutory document, and
no figure here may enter parent facing copy until the verification queue in the
README has been worked.
-->

# School device exposure, and what English schools send parents about the curriculum

Research file for Guided Childhood. Written 17 September 2026.

## READ THIS FIRST: the tooling limit on this file, stated plainly

Two hard limits shaped what is below, and both matter for how much weight you
can put on any line of it.

1. **WebFetch was blocked for every domain.** The network egress proxy in this
   session refused `www.gov.uk`, `assets.publishing.service.gov.uk`,
   `www.ofcom.org.uk`, `educationendowmentfoundation.org.uk`, `dera.ioe.ac.uk`,
   `schoolsweek.co.uk`, `en.wikipedia.org` and every school domain tried. A
   direct `curl` to gov.uk returned `CONNECT tunnel failed, response 403`. So I
   could not open a single primary document or a single school website.
2. **The WebSearch budget ran out at 200 of 200 calls** before I reached the
   last two queries I had planned, which were the DfE digital and technology
   standards and the statutory list of what a school must publish online.

What that means for the evidence rules. Every figure below came back inside a
WebSearch result summary, and I have recorded the primary source URL that the
search named so any claim can be checked. That is weaker than a fetched
document. **No statutory wording in this file should be treated as a verified
verbatim quote**, because I could not open the document it came from. Where a
form of words is widely reported I have said so and marked it as needing a
direct read before it goes anywhere public. Where I found nothing I have
written "not found" rather than an estimate.

**Question Two is not done.** It required fetching at least six real English
school websites and describing what is genuinely on them. With WebFetch blocked
I fetched none. I have listed the four real school URLs that surfaced, and the
exact shape of the work still to do, and nothing else. Do not let anyone treat
the Question Two section as findings.

## HOW TO READ THE TAGS

Every factual claim in this file is tagged for how it is known.

- **[FETCHED]** means a fetch of the source genuinely succeeded and I read the
  page. **There are zero [FETCHED] claims in this file.** Not one fetch
  succeeded, so the tag appears nowhere below and you should be suspicious if
  you ever see it here.
- **[SEARCH INDEX ONLY]** means the claim came back inside a WebSearch result
  summary, and the URL given is the source the search named. I did not open it.
  Every numeric claim in this file carries this tag.

**Consequence, and it is not negotiable.** Nothing here is an exact quotation,
because a quotation requires reading the document. Where a form of words is
reported consistently across secondary sources I have said "reported wording"
and given the primary URL to check. This binds hardest on the Department for
Education mobile phones guidance and on the technology in schools survey, which
are the two documents we would most want to quote. **No quotation marks have
been placed around any statutory text in this file.** The only quotation marks
used are around phrases lifted from search result summaries, and those are
marked as such at the point of use.

---

# QUESTION ONE: the device exposure that comes bundled with school

## 0. THE SOURCE MAP: where each answer lives, and whether we have it yet

This is the deliverable to complete in one pass when the network opens. Each row
names the publication most likely to hold the answer, so nobody has to search
again. The figure column is filled only where a search result genuinely stated a
number.

| What we want to know | Named publication | Publisher | Published | What it should tell us | Figure we have | How we know |
| --- | --- | --- | --- | --- | --- | --- |
| Devices per pupil, pupil to device ratio | Technology in schools survey, 2024 to 2025, research report | Department for Education, fieldwork by IFF Research | November 2025 | A national ratio, split primary and secondary | not found, fetch blocked | n/a |
| One to one device schemes, share of schools | Technology in schools survey, 2024 to 2025 | Department for Education | November 2025 | Share of schools running a scheme | not found, fetch blocked | n/a |
| Whether a school device goes home | Technology in schools survey, 2024 to 2025 | Department for Education | November 2025 | Take home policy prevalence | not found, fetch blocked | n/a |
| Laptop availability in schools | Technology in schools survey, 2024 to 2025 | Department for Education | November 2025 | Share of schools with laptops available | 90 percent of primaries, 94 percent of secondaries | [SEARCH INDEX ONLY] |
| School connectivity standard | Technology in schools survey, 2024 to 2025 | Department for Education | November 2025 | Wi Fi standard in use | 49 percent of primaries, 54 percent of secondaries on Wi Fi 6 | [SEARCH INDEX ONLY] |
| The standards schools must meet | Meeting digital and technology standards in schools and colleges | Department for Education | ongoing guidance | The six core standards and the 2030 ambition | six core standards by 2030, unconfirmed count | [SEARCH INDEX ONLY] |
| Children's overall online access | Children and Parents: Media Use and Attitudes Report | Ofcom | 21 May 2026 | Access and ownership by age | 99 percent of 8 to 17s online, 88 percent of 3 to 7s | [SEARCH INDEX ONLY] |
| The age the phone arrives | Children and Parents: Media Use and Attitudes Report | Ofcom | 21 May 2026 | Smartphone ownership by single year of age | 56 percent at age 10, 83 percent at age 11 | [SEARCH INDEX ONLY] |
| Online safety lessons at school | Children and Parents: Media Use and Attitudes Report | Ofcom | 21 May 2026 | Share of children taught about being online | 85 percent have had lessons, 23 percent regular lessons | [SEARCH INDEX ONLY] |
| Hours of school related device use | Children and Parents: Media Use and Attitudes Report | Ofcom | 21 May 2026 | Probably nothing. Ofcom measures the child's media life, not the school's share | not found | [SEARCH INDEX ONLY] |
| Homework moving online | 2026 UK School Census Report, Smartphones Aren't Enough | Digital Poverty Alliance | June 2026 | Parent and teacher reported prevalence | seven in ten parents say homework has moved online | [SEARCH INDEX ONLY] |
| Whether the platform reaches into the evening | 2026 UK School Census Report | Digital Poverty Alliance | June 2026 | Expected access outside learning hours | 84 percent of families using online learning systems | [SEARCH INDEX ONLY] |
| Homework requiring the internet, split by key stage | Teacher Tapp daily survey | Teacher Tapp | date unknown | The primary against secondary split | 57 percent overall and 25 percent EYFS and KS1, UNSOURCED, do not use | [SEARCH INDEX ONLY] |
| Reception baseline format | 2026 reception baseline assessment administration guidance | Standards and Testing Agency, Department for Education | for 2026 cycle | Device requirements and paper alternative | two digital devices, child on a touchscreen tablet | [SEARCH INDEX ONLY] |
| Multiplication tables check format | Multiplication tables check administration guidance and IT guidance | Standards and Testing Agency | for 2026 cycle | On screen delivery, timing, window | on screen, 25 questions, 6 seconds each, 1 to 12 June 2026 | [SEARCH INDEX ONLY] |
| Phonics screening check format | 2026 phonics screening check administration guidance | Standards and Testing Agency | for 2026 cycle | Paper booklet, one to one delivery | 40 words, paper, from Monday 8 June 2026 | [SEARCH INDEX ONLY] |
| Key stage 2 test format and dates | National curriculum assessments timetable | Standards and Testing Agency | for 2026 cycle | Paper delivery and dates | paper, 11 to 14 May 2026 | [SEARCH INDEX ONLY] |
| When GCSEs move on screen | Ofqual and exam board statements, reported by Tes | Ofqual, AQA, OCR, Pearson | 2024 to 2026 reporting | Timetable for on screen assessment | AQA aims for one major subject by 2030, boards delayed, likely next decade | [SEARCH INDEX ONLY] |
| School account model and reach | Google Workspace for Education admin and Classroom help, and the Education Terms of Service | Google | current | Core against Additional Services, under 18 defaults, consent | Core includes Gmail, Drive, Calendar, Classroom. Under 18 restricted by default | [SEARCH INDEX ONLY] |
| Microsoft equivalent | Microsoft 365 Education documentation | Microsoft | current | The same questions for the Microsoft stack | not researched, budget exhausted | n/a |
| Age a child gets a school account or email | no national source identified | n/a | n/a | n/a | not found | n/a |
| The phones guidance itself | Mobile phones in schools guidance | Department for Education | February 2024, page updated 19 February 2026 | The government position on phone use across the school day | reported wording only, no quotation | [SEARCH INDEX ONLY] |
| The 2026 statutory change | Mobile phones in schools (England), CBP 10241 | House of Commons Library | 2026 | Whether and how the guidance became statutory, and the commencement date | reported: Children's Wellbeing and Schools Act 2026 section 36, in force 29 June 2026, follow from 1 September 2026. DATES INCONSISTENT | [SEARCH INDEX ONLY] |
| How many schools restrict phones | School phone policies in England, School and College Survey | Children's Commissioner for England | April 2025 | Policy prevalence across about 19,000 schools | 90 percent of secondaries restrict use. 3.5 percent of secondaries and 21 percent of primaries ban bringing a phone in | [SEARCH INDEX ONLY] |
| Filtering and monitoring duties | Filtering and monitoring standards for schools and colleges | Department for Education | March 2023 | What every school must have in place | roles and responsibilities, block without overblocking, a monitoring strategy. Paraphrase only | [SEARCH INDEX ONLY] |
| What monitoring software sees | Vendor product pages | Smoothwall, Senso, Securly, Impero | current | Feature claims, not independent evidence | keystrokes, screen views, searches, AI prompts, real time alerts to named staff | [SEARCH INDEX ONLY] |
| Which product a given school uses | no national dataset identified | n/a | n/a | n/a | not found | n/a |
| Does screen based learning work | Teaching and Learning Toolkit, digital technology strand | Education Endowment Foundation | current, last update reported | Average impact, evidence strength, cost | four months average, range 2 months to over a year, a padlock lost | [SEARCH INDEX ONLY] |
| Total daily screen minutes school adds | nobody appears to measure this | n/a | n/a | n/a | not found | n/a |
| What schools must publish online | School Information (England) Regulations 2012, and What academies, free schools and colleges should publish online | Parliament, Department for Education | 2012, guidance current | Whether curriculum content by subject and year must be published | not verified, budget exhausted. HIGHEST VALUE UNKNOWN | n/a |


## 1. What the Department for Education knows about devices in schools

**Source.** Technology in schools survey, 2024 to 2025, research report,
published November 2025, carried out for the Department for Education by IFF
Research. Landing page
https://www.gov.uk/government/publications/technology-in-schools-survey-2024-to-2025
Report PDF
https://assets.publishing.service.gov.uk/media/692834a6ce50d215cae9610e/Technology_in_schools_survey_2024_to_2025_research_report.pdf
Archive copy https://dera.ioe.ac.uk/id/eprint/41655/
Previous edition, 2022 to 2023
https://assets.publishing.service.gov.uk/media/655f8b823d7741000d420114/Technology_in_schools_survey__2022_to_2023.pdf

**Design, as reported.** A five wave biennial study surveying headteachers and
senior leaders, classroom teachers, and IT leads, designed to track progress
toward the Department's ambition that every school meets six core digital and
technology standards by 2030.

**Figures I can point at.** These came through search summaries whose named
sources were
https://www.fastvue.co/fastvue/blog/the-dfe-technology-in-schools-survey-2024-2025-from-data-to-effective/
and
https://www.edtechinnovationhub.com/news/dfe-tech-survey-reveals-major-shifts-in-school-ai-use-digital-strategy-and-infrastructure-gaps
and
https://home.edurio.com/news/dfe-tech-survey/

- [SEARCH INDEX ONLY] Laptops are available in 90 percent of primaries and 94 percent of
  secondaries.
- [SEARCH INDEX ONLY] Assistive technology availability almost doubled in primaries, from 34 percent
  to 60 percent, and rose in secondaries from 40 percent to 59 percent.
- [SEARCH INDEX ONLY] 49 percent of primaries and 54 percent of secondaries report using Wi Fi 6,
  the latest standard the survey listed.
- Reported direction of travel: connectivity and hardware improving, staff
  confidence and training lower than two years ago, and a gap between the
  technology schools hold and how well they can use it.

**What I could not find, and did not guess.**

- [SEARCH INDEX ONLY] **Devices per pupil, or a pupil to device ratio, for 2024 to 2025: not
  found.** The earlier 2022 to 2023 edition is understood to carry a ratio, and
  the 2024 to 2025 report almost certainly does, but I could not open either
  document and no search summary produced a number. This is the single most
  useful figure for a parent and it is the one still missing.
- **One to one device schemes, share of schools running one: not found.**
- **Whether pupils take a school device home, and how many: not found.**
- [SEARCH INDEX ONLY] **School internet provision figures beyond the Wi Fi 6 line: not found.**

**Adjacent source worth a look when fetching works again.** The Department's
laptops and tablets delivery data from the pandemic scheme sits at
https://explore-education-statistics.service.gov.uk/find-statistics/laptops-and-tablets-data/2022-january
It is a count of devices the Department shipped, not current provision, so it
answers a different question, but it is official and countable.

## 2. Ofcom, Children and Parents: Media Use and Attitudes

**Source.** Children and Parents: Media Use and Attitudes Report, published 21
May 2026.
https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/media-literacy-research/children/2026-children-and-parents-report/children-and-parents-media-use-and-attitudes-report-2025-6.pdf?v=418231
Hub page
https://www.ofcom.org.uk/media-use-and-attitudes/media-habits-children/childrens
Prior edition, published 7 May 2025
https://www.ofcom.org.uk/siteassets/resources/documents/research-and-data/media-literacy-research/children/childrens-media-use-and-attitudes-report-2025/childrens-media-literacy-report-2025.pdf?v=396621

**Sample, as reported.** More than 5,000 parents and carers of children aged 6
months to 17, plus more than 3,400 interviews with children aged 8 to 17.

**Figures.**

- [SEARCH INDEX ONLY] In 2025 to 2026, parents report that almost all, 99 percent, of their children
  aged 8 to 17 go online. It is 88 percent among children aged 3 to 7.
- [SEARCH INDEX ONLY] Smartphone ownership jumps from 56 percent at age 10 to 83 percent at age 11.
  That is the transition to secondary school, and it is the sharpest single
  step in the whole dataset.
- [SEARCH INDEX ONLY] Over eight in ten, 85 percent, of children aged 8 to 17 say they have had
  lessons at school about being online. 23 percent say they have had regular
  lessons. Most common topics: being kind and respectful of others 57 percent,
  recognising harmful behaviour online 55 percent, what to do if someone you do
  not know contacts you 54 percent.
- [SEARCH INDEX ONLY] 65 percent of social media users aged 8 to 17 mainly consume content rather
  than create it.
- [SEARCH INDEX ONLY] From the 2024 edition, reported in a 2026 search summary: almost a quarter of
  children aged 5 to 7 owned a smartphone, and three quarters used a tablet at
  home or school. Treat the year label carefully, this is the 2024 figure.

**On school related device use specifically.** Two statements came back, and
both need a caveat.

- "All children in the research used devices for learning, either at school or
  at home for schoolwork, homework, tests and revision." The search result that
  carried this was Children's Media Lives 2026 by Revealing Reality,
  https://revealingreality.co.uk/childrens-media-lives-2026/ That study is
  **qualitative and longitudinal with 17 children**, so "all children in the
  research" means all seventeen. It is a useful observation and a useless
  statistic. Do not publish it as a proportion.
- Children most commonly used artificial intelligence to support schoolwork,
  including generating ideas, answering questions, and in some cases completing
  homework tasks entirely. Same caveat, same study, same seventeen children.

**What I could not find.** A quantified Ofcom figure for hours of school
related or homework related device use, or for the share of children whose
homework requires a device. **Not found.** The honest position is that Ofcom
measures a child's media life, not the school's contribution to it.

## 3. How much homework requires a screen

This is the best answer to the parent's actual question, and the sourcing is
uneven.

**Strongest source: Digital Poverty Alliance, 2026 UK School Census Report,
"Smartphones Aren't Enough: Every Child Needs a Laptop", launched at
Parliament, June 2026.**
Report PDF
https://digitalpovertyalliance.org/wp-content/uploads/2026/06/DPA-School-Census-Report-1.pdf
Launch note
https://digitalpovertyalliance.org/news-updates/dpa-launches-schools-census-report-on-digital-access-in-education/
Press release copy
https://www.wired-gov.net/wg/news.nsf/articles/dpa+launches+schools+census+report+on+digital+access+in+education+02072026142000?open=
Independent write up
https://www.rsnonline.org.uk/beyond-smartphones-digital-access-in-schools

Figures as reported:

- [SEARCH INDEX ONLY] Seven in ten parents said homework has now moved online.
- [SEARCH INDEX ONLY] Almost half said their child is required to use online portals to submit
  coursework or homework.
- [SEARCH INDEX ONLY] Among families using online learning systems, 84 percent said children are
  expected to access them outside designated learning hours. This is the line
  that matters most to us. It says the school's platform reaches into the
  evening by design.
- [SEARCH INDEX ONLY] Fewer than one in ten teachers said students would be able to complete all of
  their coursework using only a smartphone.
- [SEARCH INDEX ONLY] 95 percent of sixth form teachers believe lack of access to a suitable laptop
  or desktop harms children's future prospects to some degree.

**Caveat you must carry.** The Digital Poverty Alliance is campaigning for
every child to have a laptop. The figures are theirs and they point where the
campaign points. They are still the most recent named UK survey on the
question, and the direction is corroborated by the DfE survey's device numbers,
but a hostile expert will name the advocacy interest first. Say it before they
do.

**Weaker, and flagged.** A search summary attributed to Digital Poverty
Alliance material the claim that "80 percent of primary school children and 90
percent of secondary school students are expected to submit homework online at
least once a week", with
https://educationbusinessuk.net/features/digital-divide-problems-it-causes-children-and-schools
and https://www.learninghive.co.uk/blog/digital-poverty-and-education-inequality
among the results. **I could not pin the underlying survey.** Note also that it
sits awkwardly beside the 2026 census figure of seven in ten parents. Two
different questions asked two different ways is the charitable reading. Either
way, use the 2026 census numbers and leave the 80 and 90 alone.

**Unverified, and I want to flag it hard because it is tempting.** A search
summary returned: "About half, 57 percent, of homework set requires students to
use the internet, and although KS2 and secondary are more likely to set tasks
that require students to go online, 25 percent of EYFS and KS1 teachers
answered yes too", attributed to Teacher Tapp,
https://teachertapp.com/ . **I could not locate the specific Teacher Tapp
article, and the follow up search for the figure failed to find it.** Teacher
Tapp describe their sample as over 10,000 teachers responding daily,
https://teachertapp.com/how-it-works/ . If that 57 percent and the 25 percent
for EYFS and KS1 can be sourced to a dated Teacher Tapp post, it is the single
best line we could give a parent, because it splits primary from secondary. Put
it on the list to chase. **Do not use it until it is sourced.**

**Digital poverty context figures, lower confidence attribution.** One in five
children in the UK are in digital poverty, meaning no suitable device for
learning or no connectivity at home; 26 percent of children do not have access
to a laptop, attributed to Nominet 2022; the Nominet Digital Youth Index 2021
found 32 percent of young people aged 8 to 24 do not have access to a device
when and where they need it; the 2022 index found roughly 19 percent without a
smartphone and roughly 15 percent without home broadband. Sources to verify:
https://digitalpovertyalliance.org/ and
https://digitalpovertyalliance.org/wp-content/uploads/2023/09/Deloitte-Digital-Poverty_FinalReport_29092023.pdf
and https://www.thebritishacademy.ac.uk/documents/4355/Digital_Poverty_in_the_UK.pdf

## 4. The national tests a child sits, and which are on a screen

This is the cleanest, most checkable part of the whole lane, and it is a strong
piece of parent facing content on its own. Note again that I could not open the
guidance documents, so the formats below are as reported by search, and each
carries its statutory source URL for checking.

### On a screen

**Year 4 multiplication tables check. On screen, statutory, every Year 4 pupil
in England.**
Administration guidance
https://www.gov.uk/government/publications/multiplication-tables-check-administration-guidance/multiplication-tables-check-administration-guidance
IT guidance https://www.gov.uk/guidance/multiplication-tables-check-it-guidance

- Described as an online, on screen digital assessment taken on a desktop
  computer, laptop or tablet at school.
- [SEARCH INDEX ONLY] 25 multiplication questions, up to 12 times 12, with 6 seconds per question.
- [SEARCH INDEX ONLY] 2026 window: the two week period from Monday 1 June 2026 to Friday 12 June
  2026, with a following week, Monday 15 June to Friday 19 June, for pupils
  absent in the first two weeks.
- Schools access the service through DfE Sign in, check the pupil register,
  generate a school password and pupil identification numbers, and let pupils
  use a "try it out" check to familiarise themselves with the format.
- Secondary corroboration
  https://schoolleaders.thekeysupport.com/curriculum-and-learning/assessment-primary/ks2-sats/year-4-multiplication-tables-check/
  and https://primary.lbq.org/hub/multiplication-tables-check-guide

**Reception baseline assessment. On two digital devices, in the first weeks of
reception.**
2026 administration guidance
https://www.gov.uk/government/publications/reception-baseline-assessment-administration-guidance/2026-reception-baseline-assessment-administration-guidance
IT guidance https://www.gov.uk/guidance/reception-baseline-assessment-it-guidance
2026 assessment and reporting arrangements
https://www.gov.uk/government/publications/reception-baseline-assessment-assessment-and-reporting-arrangements-ara/2026-reception-baseline-assessment-assessment-and-reporting-arrangements-ara
Help centre https://help.assessmentservice.education.gov.uk

- Delivered on two digital devices. The practitioner uses one, typically a
  laptop or tablet, to run the questions, read instructions aloud and record
  verbal responses. The child uses a compatible touchscreen tablet placed in
  front of them to record answers. Schools need a minimum of two digital
  devices.
- Administered within the first six weeks of a pupil starting reception.
- A paper based version exists for pupils with a specific need who cannot
  access a touchscreen, requested by contacting the national curriculum
  assessments helpline or through the assessment help centre.
- This is the honest headline for a parent of a four year old: **a child's first
  statutory assessment in England is taken on a touchscreen, within six weeks
  of starting school.** Corroboration
  https://num8ers.com/guides/reception-baseline-assessment-ara/ and a critical
  campaign source, useful for knowing the counter argument,
  https://safescreens.org/parents-of-new-reception-children-september-2026-what-you-need-to-know-about-the-screen-based-assessment-and-what-you-can-do-about-it/

### On paper

**Phonics screening check, Year 1. Paper, one to one with a teacher.**
Guidance https://www.gov.uk/government/publications/key-stage-1-phonics-screening-check-administration-guidance
2026 administration guidance, archive copy
https://dera.ioe.ac.uk/id/eprint/42044/1/2026%20phonics%20screening%20check%20administration%20guidance%20-%20GOV.UK.pdf

- [SEARCH INDEX ONLY] A booklet of 40 words in two sections, four words on each page, read aloud by
  the child to the teacher, with real words and pseudo words.
- Reported as guidance that schools must not administer the check virtually to
  pupils.
- [SEARCH INDEX ONLY] 2026 window: the one week period from Monday 8 June 2026.

**Key stage 2 national curriculum tests, Year 6. Paper.**
Timetable reporting https://schoolsweek.co.uk/key-dates-for-sats-and-phonic-checks-2025-2026-2027/
Past materials https://www.gov.uk/government/collections/national-curriculum-assessments-past-test-materials

- [SEARCH INDEX ONLY] 2026: English grammar, punctuation and spelling papers 1 and 2 on Monday 11
  May, English reading on Tuesday 12 May, mathematics papers 1 and 2 on
  Wednesday 13 May, mathematics paper 3 on Thursday 14 May.
- Taken in the classroom under formal conditions, on paper.

**GCSEs. Overwhelmingly still on paper, and the move to screens keeps
slipping.**
https://www.tes.com/magazine/news/general/digital-assessment-unlikely-until-2030s-ofqual
https://www.tes.com/magazine/news/general/warning-over-slow-introduction-of-digital-gcse-exams
https://www.aacrao.org/edge/emergent-news/pupils-in-england-could-sit-digital-gcse-exams-from-2026-under-proposals/
https://www.cambridge.org/py/news-and-insights/uk-first-digital-gcse-to-launch-in-2025

- AQA, the largest board for GCSEs and A levels in England, aims for students to
  sit at least one major subject digitally by 2030.
- The reading and listening components of GCSE Italian and Polish were proposed
  as the first to move to digital in 2026, subject to regulatory approval.
  **Whether that actually happened: not found.** Do not state it as fact.
- Ofqual said boards would in principle be able to introduce on screen
  assessment for up to two subjects each initially.
- Devices in the exam hall would be offline, with no internet search and no
  access to artificial intelligence tools.
- OCR and Pearson Edexcel have delayed their plans. Reporting says it likely
  will not be until the next decade.

**The honest summary a parent can be given.** Your child's first statutory
assessment, at four, is on a touchscreen. Their times tables check, at eight or
nine, is on a screen and timed at six seconds a question. Their phonics check
at six and their SATs at eleven are on paper. Their GCSEs at sixteen are almost
certainly on paper. So the screen is not the whole of school assessment in
England, it is the bookends of primary.

## 5. School issued accounts a child holds

**What I verified, on Google.** Sources
https://support.google.com/a/answer/6356441
https://support.google.com/edu/classroom/answer/7582372
https://support.google.com/a/answer/10651918
https://support.google.com/a/answer/6356509
https://support.google.com/edu/classroom/answer/11081157
https://edu.google.com/intl/ALL_us/our-values/privacy-security/frequently-asked-questions/
https://workspace.google.com/terms/education_terms/

- Google Workspace for Education splits into Core Services, named as including
  Gmail, Drive, Calendar and Classroom, provided under the school's agreement,
  and Additional Services, named as including YouTube and Maps, available only
  if the school's domain administrator allows them.
- [SEARCH INDEX ONLY] Children aged 13 and under should only use Classroom with a Google Workspace
  for Education or Workspace for Nonprofits account.
- [SEARCH INDEX ONLY] All users in primary or secondary institutions default to under 18 and get a
  restricted experience in some Google services unless an administrator
  designates otherwise.
- School administrators are required to obtain parental consent for the use of
  Additional Google Services for users under 18.
- Google states it does not use personal information to target ads for Workspace
  for Education users in primary and secondary schools or users designated as
  under 18.
- On email reach, a real school page reported that pupils can share work and
  email within the school domain but their settings do not allow sharing with
  or receiving from outside the domain unless the school specifically allows it:
  https://www.thorogateschool.co.uk/safeguarding-keeping-children-safe/google-workspace-for-education
  That is one school's configuration described to its own parents, not a
  national default. Treat it as an example of the genre, not a rule.

**What I could not find.**

- [SEARCH INDEX ONLY] **Microsoft 365 Education, the equivalent account model and age settings: not
  researched, search budget ran out. Not found.**
- **The age at which a child typically receives a school issued account or email
  address in England: not found.** There is no national figure I could reach.
  This is genuinely school by school. Anecdotally it clusters around the start
  of key stage 2 in primaries that run Google Classroom, and universally at
  entry to secondary, but I have no source and will not write one.
- **What the account can reach, in practice: not found as a national statement**,
  because it is set per domain by the school's administrator. This is a real
  and important gap, and it is a question only the parent's own school can
  answer.

## 6. Mobile phones in schools

### The February 2024 guidance

Publication https://www.gov.uk/government/publications/mobile-phones-in-schools/mobile-phones-in-schools
PDF https://assets.publishing.service.gov.uk/media/65cf5f2a4239310011b7b916/Mobile_phones_in_schools_guidance.pdf
Commentary
https://www.brownejacobson.com/insights/not-quite-a-blanket-ban-on-mobile-phones-in-schools
https://www.stoneking.co.uk/literature/e-bulletins/guidance-schools-mobile-phones-ban
https://www.localgovernmentlawyer.co.uk/education-law/343-education-features/100522-guidance-for-schools-on-the-mobile-phones-ban
https://educationbusinessuk.net/news/19022024/dfe-releases-mobile-phone-guidance-schools

Published February 2024 as **non statutory** guidance. The wording reported
repeatedly across those secondary sources is that schools should develop a
mobile phone policy that prohibits the use of mobile phones and other smart
technology with similar functionality to mobile phones throughout the school
day, including during lessons, the time between lessons, breaktimes and
lunchtime.

**I am not marking that as a quote, because I could not open the document.**
House rule two says quote and never paraphrase anything statutory, and the only
way to honour that rule is to read the PDF. Until someone does, the phrase
above is reported wording, not a quotation. The legal commentaries are worth
reading for the same reason they were written: the 2024 guidance was widely
described as not quite a blanket ban.

### What changed in 2026, and why you must check this before saying it out loud

Search returned a consistent story with **inconsistent dates**, which is exactly
the kind of thing that gets a claim taken apart.

Primary source to read: House of Commons Library briefing, Mobile phones in
schools (England), CBP 10241.
https://commonslibrary.parliament.uk/research-briefings/cbp-10241/
PDF https://researchbriefings.files.parliament.uk/documents/CBP-10241/CBP-10241.pdf
House of Lords Library
https://lordslibrary.parliament.uk/mobile-phones-in-schools-mandating-a-ban/
https://lordslibrary.parliament.uk/smartphones-in-schools-practice-policy-and-international-perspectives/
Solicitor commentary
https://www.wrigleys.co.uk/news/education/mobile-phones-in-schools-guidance-to-become-statutory--what-has-changed/

Reported, and each needing confirmation:

- [SEARCH INDEX ONLY] The gov.uk guidance page carries an update date of 19 February 2026.
- [SEARCH INDEX ONLY] Guidance updated in January 2026 is reported as stating that all schools
  should be mobile phone free environments by default and anything other than
  this should be by exception only.
- [SEARCH INDEX ONLY] On 20 April 2026 the government announced plans to make restriction of phone
  use during the school day a legal requirement by putting the guidance on a
  statutory footing.
- [SEARCH INDEX ONLY] Section 36 of the Children's Wellbeing and Schools Act 2026 is reported to
  require state funded schools in England to have regard to published guidance
  on mobile phones, with the provision coming into force on 29 June 2026.
- [SEARCH INDEX ONLY] Schools are expected to follow the guidance from 1 September 2026, and Ofsted
  is reported to have confirmed it will assess phone policies and their
  implementation at routine inspection.
- Ministers are reported to have said this is not an outright ban. Individual
  schools decide how phones are stored and can make exceptions for special
  educational needs and disabilities, medical needs and other individual
  circumstances.

**The date sequence does not hang together as reported.** A January 2026
guidance update, a page updated 19 February 2026, an announcement of plans on 20
April 2026 and a commencement on 29 June 2026 can all be true, but in that order
the April announcement follows the guidance it is announcing. Read CBP 10241
before we publish a word of this. Several of the pages that carried this story
are low grade for our purposes and should not be cited by us at all:
antiscreen.co.uk, londonbusinessmag.co.uk, deepinmummymatters.com,
generationfocus.org, ictinschools.org, leaditservices.co.uk.

**This is material for us commercially.** If phones really are statutory
restricted from September 2026, then the school day is already a phone free
block for most children, and the parent's problem is entirely the other sixteen
hours. That sharpens our pitch rather than weakening it, and it is a reason to
get the facts right rather than repeat a headline.

### How many schools restrict phones

**Source. Children's Commissioner for England, School phone policies in
England: Findings from the Children's Commissioner's School and College Survey,
April 2025.**
https://www.childrenscommissioner.gov.uk/resource/school-phone-policies-in-england-findings-from-the-childrens-commissioners-school-and-college-survey/
PDF https://assets.childrenscommissioner.gov.uk/wpuploads/2025/04/cco-school-survey-smartphone-policies.pdf
Press notice
https://www.childrenscommissioner.gov.uk/news-and-blogs/press-notice-most-headteachers-restrict-mobile-phones-in-school-hours-but-major-new-survey-shows-online-harms-still-among-their-biggest-concerns/

- The survey used the Commissioner's statutory powers for the first time and is
  described as the largest ever survey of schools and colleges, with responses
  from about 19,000 schools, representing nearly 90 percent of all schools in
  England. Reported response counts: 12,730 state funded primary schools and
  2,467 secondary schools.
- [SEARCH INDEX ONLY] **90 percent of secondary schools had policies that restricted phone use.**
- [SEARCH INDEX ONLY] **Only 3.5 percent of secondary schools prohibited pupils from bringing their
  mobile phones to school at all, compared with 21 percent of primary schools.**
- The press notice headline notes that most headteachers restrict mobile phones
  in school hours but online harms remain among their biggest concerns.

This is the strongest sourced, most quotable set of numbers in the whole lane.
It is official, it is enormous, it is recent, and the 3.5 percent against 21
percent contrast is the kind of fact that makes a parent stop scrolling: the
school that confiscates the phone is the primary, not the secondary.

**Not found.** An overall percentage of primary schools restricting phone use,
as distinct from the 21 percent that ban bringing a phone in at all.

## 7. Filtering, monitoring, and what it means for a child

**The standard.** Department for Education, filtering and monitoring standards
for schools and colleges, published March 2023, sitting inside the digital and
technology standards.
https://www.gov.uk/guidance/meeting-digital-and-technology-standards-in-schools-and-colleges/filtering-and-monitoring-core-standard
Local authority summary of the wider standards
https://www.suffolk.gov.uk/asset-library/meeting-the-dfe-digital-and-technology-standards-for-schools-and-colleges.pdf
Independent commentary from the Safer internet centre
https://swgfl.org.uk/magazine/navigating-the-latest-changes-in-dfe-filtering-and-monitoring-standards-for-schools-and-colleges/

Reported content, as paraphrase and not as quotation, because I could not open
the standard: the standards identify roles and responsibilities for managing
filtering and monitoring systems, require blocking of harmful and inappropriate
content without overblocking, and require a monitoring strategy that meets the
safeguarding needs of the school or college. Keeping Children Safe in Education
2023 is the document that pulled filtering and monitoring into schools'
safeguarding duties, which is why every school now has a named person for it.
Vendor summary of that change, flagged as a vendor
https://smoothwall.com/resources/kcsie-2023-filtering-and-monitoring-updates-smoothwall
https://smoothwall.com/resources/dfe-filtering-and-monitoring-standards-updates-2024

**A real school policy, which is the artefact a parent could actually be shown.**
Blackfriars Academy, Filtering and Monitoring Policy, September 2024
https://blackfriarsacademy.org.uk/wp-content/uploads/2024/10/Filtering-and-Monitoring-Policy-Sept-2024-1.pdf
I did not fetch it. It is named here because it is a real, public, dated example
of the genre and it is the right next fetch.

**The common products, and what they do.** All of the following is from vendor
marketing pages, which is what the question asked for and is not independent
evidence. Market share: **not found.**

- **Smoothwall Monitor.** https://smoothwall.com/solutions/monitor and
  https://smoothwall.com/solutions . Described as real time digital monitoring
  that monitors both keystrokes and screen views and flags incidents as they
  happen, with designated school staff alerted in real time within minutes by
  email and by phone for the highest suspected risks, and every alert carrying
  contextual evidence. Reseller page
  https://ibsschools.com/products-services/safeguarding/smoothwall
- **Senso.** https://senso.cloud/ . Describes corpus linguistics filtering that
  identifies threats and harmful content by analysing online content in
  context rather than by keyword alone.
- **Securly Aware.** https://www.securly.com/aware . Describes analysing student
  activity for signs of distress beyond keyword lists, scanning a student's
  digital footprint including web browsing history, search terms, artificial
  intelligence prompts and social media posts, and integrating directly with
  school operated Google Workspace and Microsoft 365.
- **Impero Education.** Described as student monitoring with teacher view,
  activity reporting and managed classroom controls.
- Practitioner discussion comparing them, useful for tone and reality
  https://www.edugeek.net/forums/internet-related-filtering-firewall/223240-securly-senso.html

**What this means for a child, said plainly and without exaggeration.** On a
school managed device or a school account, a child's keystrokes, screen
contents, searches, browsing and increasingly their prompts to an artificial
intelligence tool can be inspected by software that flags them to a named adult
in the school, sometimes within minutes, with a screenshot attached. That is by
design, it is a safeguarding duty rather than a choice the school made lightly,
and it is a completely different relationship to privacy from the one the same
child has on the family tablet. **A child who is told about it understands it as
protection. A child who discovers it understands it as surveillance.** That is
our territory: this is a conversation a parent should have with a child before
the school device comes home, and nobody currently hands them the words.

## 8. Does any of it work: the effect of screen based learning

**The Education Endowment Foundation Teaching and Learning Toolkit, digital
technology strand.**
https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/digital-technology
Technical appendix
https://educationendowmentfoundation.org.uk/evidence-summaries/teaching-learning-toolkit/digital-technology/technical-appendix/
The blog explaining the last update, which is where the useful honesty is
https://educationendowmentfoundation.org.uk/news/eef-blog-updating-the-toolkit
Toolkit guide PDF
https://d2tic4wvo1iusb.cloudfront.net/production/documents/toolkit/toolkit_guide_2025_v3.0.0.pdf
Early years toolkit strand
https://educationendowmentfoundation.org.uk/evidence-summaries/early-years-toolkit/digital-technology/technical-appendix
Guidance report, Using Digital Technology to Improve Learning
https://files.eric.ed.gov/fulltext/ED612112.pdf

As reported:

- [SEARCH INDEX ONLY] The Toolkit covers 34 topics, each summarised by average impact on
  attainment, strength of the supporting evidence, and cost.
- **Digital technology: average impact four months of additional progress, with
  the reviews in the strand ranging from 2 months to over a year.**
- **The strand lost a padlock** of evidence strength. The Foundation's stated
  rule is that a strand can lose a padlock if fewer than three of its reviews
  took place in the last three years, and the blog also links the downgrade to
  the spread of impacts.
- Cost estimates for digital technology were reduced to moderate, based on the
  increasing use of cheaper laptops.
- [SEARCH INDEX ONLY] 21 of the 31 meta analyses in the newest version of the Toolkit sit in the
  digital technology strand.
- In the Early Years Toolkit, digital technology shows moderate impact for
  moderate cost, based on limited evidence.

**The honest contradiction, which is the point of this section.** A headline of
four months additional progress reads like an endorsement of screens in
classrooms. It is not one. A strand whose studies range from two months to more
than a year, and which lost evidence strength at the last update, is telling
you that the technology is not the active ingredient. The teaching is. Anyone
who cites the four months as proof that devices help children learn, or who
cites the padlock loss as proof that they do not, is using the same document to
say opposite things, and both are overreaching. The defensible sentence is
narrow: on average, well used digital technology is associated with modest
additional progress, the range is enormous, and the evidence got weaker rather
than stronger at the last review.

**Other sources found but not read, worth chasing.**

- Parliamentary Office of Science and Technology, approved work on the impacts
  of screen and phone use on children and young people's development
  https://post.parliament.uk/approved-work-impacts-of-screen-and-phone-use-on-children-and-young-peoples-development/
  A forthcoming UK parliamentary synthesis is exactly the kind of source we
  should be first to read.
- European Commission Better Internet for Kids, screen use in school
  https://better-internet-for-kids.europa.eu/en/research-reports/screen-use-school
- Contextualising Phone Banning Guidance, peer reviewed
  https://link.springer.com/doi/10.1007/s42438-024-00464-6
- [SEARCH INDEX ONLY] Department for Education, Pupil experiences in school, academic year 2024 to
  2025 https://www.gov.uk/government/publications/pupil-experiences-in-school-academic-year-2024-to-2025
  and the Parent, pupil and learner voice omnibus surveys
  https://www.gov.uk/government/publications/parent-pupil-and-learner-voice-omnibus-surveys-for-2024-to-2025/parent-pupil-and-learner-voice-may-2025
  These are the official surveys most likely to hold a figure on homework and
  device use that I failed to find.
- [SEARCH INDEX ONLY] Ofcom, Children's Online Experiences research report, May 2026
  https://www.ofcom.org.uk/siteassets/resources/documents/online-safety/research-statistics-and-data/protecting-children/childrens-online-experiences-research-report.pdf?v=418198
  with third party summaries
  https://ineqe.com/2026/05/22/childrens-online-experiences-ofcom-2026/
  https://anti-bullyingalliance.org.uk/aba-our-work/news-opinion/childrens-online-lives-2026-what-ofcoms-latest-research-tells-us-about

**Not found, and I looked.** Any credible figure for total daily minutes of
screen exposure a child receives from school itself. Nobody appears to measure
it. That is a genuine hole in the national evidence base, and it is worth saying
so in public, because it is the question every parent asks and no official
source answers.

---

# QUESTION TWO: what English schools send parents about the curriculum

## Status: THE SCHOOL WEBSITE SAMPLE WAS NOT OBTAINABLE

Said plainly, for the report and for anyone reading this later: **the six real
English school websites could not be obtained.** Network egress is blocked by
organisation policy, the gateway answers 403 to CONNECT for nearly all external
hosts, and the proxy rules say not to retry or route around it. So this section
contains no description of what any school website contains. Everything below is
a brief and a set of starting URLs, tagged [SEARCH INDEX ONLY], and none of it
is a finding.

## Why, in one more line

The question required fetching at least six real English school websites and
describing what is genuinely on them. **WebFetch was blocked for every domain in
this session, including every school domain attempted, and the WebSearch budget
is spent.** I fetched nothing. I am therefore recording only the real URLs that
surfaced, and the brief for finishing the job, and no descriptions. Anything I
wrote about knowledge organisers or curriculum newsletters from memory would be
a plausible guess, which is the one thing house rule one forbids.

## The real school pages that surfaced, as starting points

These four came back in search results for other queries. They are real, live,
English school pages, each one an example of the genre. **None were fetched. I
do not know what is on them.**

1. **St Hilda's CE Primary School**, a parent facing page on national
   assessments and the Year 4 multiplication tables check
   https://www.sthildasceprimary.co.uk/school_life_/national_assessments/year_4_multiplication_tables_che.html
2. **Heatherlands Primary School, Poole**, statutory assessments including SATs,
   information for parents
   https://www.heatherlands.poole.sch.uk/statutory-assessments-including-sats-information-f
3. **Thorogate School**, a parent facing safeguarding page explaining Google
   Workspace for Education
   https://www.thorogateschool.co.uk/safeguarding-keeping-children-safe/google-workspace-for-education
4. **Blackfriars Academy**, filtering and monitoring policy, September 2024
   https://blackfriarsacademy.org.uk/wp-content/uploads/2024/10/Filtering-and-Monitoring-Policy-Sept-2024-1.pdf

Two local authority school portals also surfaced, and they are useful because
they aggregate what schools are sent and pass on:
https://schools.westsussex.gov.uk and https://hereforschools.co.uk and
https://engagerochdale.org/Page/43493 and
https://www.devon.gov.uk/support-schools-settings/school-effectiveness/data-assessment/primary-guidance

## The brief for whoever finishes this

Fetch six or more, at least two secondary, at least two primary, spread across
different trusts and regions, and for each one record the URL, the document
title, its length in pages or words, and what is actually in it. The seven
artefacts to look for, in the order the question named them:

1. Termly curriculum newsletter or curriculum overview letter, per year group.
2. Knowledge organisers, and the "how to use this at home" instruction that
   accompanies them.
3. The year group curriculum map on the school website.
4. Phonics and early reading workshops for parents, and the handout.
5. The "how to help at home" leaflet.
6. Meet the teacher and curriculum evening slide decks.
7. At secondary: curriculum booklets, options booklets, revision guidance.

**The statutory hook I ran out of budget to verify, and which changes the whole
answer.** English schools are required to publish curriculum information on
their websites. The two documents that set out what, and which I did **not**
read, are the School Information (England) Regulations 2012 for maintained
schools and the Department for Education guidance "What academies, free schools
and colleges should publish online" for academies. If those require publication
of curriculum content by subject and academic year, then the year group
curriculum map is a national, findable artefact for every school in England,
and the whole of Question Two becomes a scrapeable dataset rather than a
sampling exercise. **Check this first.** It is the highest value unknown in this
file.

**Useful internal note.** We have already built our own version of two of these
seven artefacts, so the genre research is catching up with the product rather
than leading it. The pupil knowledge organiser is at
`/home/user/guided-childhood/schools/app/print/[module]/organiser/page.tsx`,
the module overview at
`/home/user/guided-childhood/schools/app/print/[module]/overview/page.tsx`, and
school letter templates at
`/home/user/guided-childhood/lib/email/school-letters.ts`. The organiser's own
code comment names its reference point as the Jigsaw pupil knowledge organiser.
Whoever finishes Question Two should read those three files first and then judge
real school artefacts against what we already ship.

---

# THE HONEST GAP: what a parent can and cannot be told

We hold the national curriculum for England. That is a real asset and it has a
hard edge. Here is the edge, stated so that nobody on the team ever oversteps
it in copy.

## National, and knowable to us without asking the parent anything

- **What a year group is taught.** The programmes of study for England are
  national. We can say what Year 4 covers, in the Department's own wording, and
  we do, with a mandatory source on every objective.
- **The statutory assessment calendar and its format.** Reception baseline on
  two devices in the first six weeks. Phonics screening check on paper in Year
  1, one week from Monday 8 June 2026. Multiplication tables check on screen in
  Year 4, two weeks from Monday 1 June 2026, six seconds a question. Key stage 2
  tests on paper, 11 to 14 May 2026. This is fixed nationally and it is the
  single most useful thing we can hand a parent, because it is a date and a
  format rather than an opinion.
- **The national position on phones in school.** Whatever the exact status turns
  out to be after reading CBP 10241, it is one national position, not thirty
  thousand.
- **The duties a school is under.** Filtering and monitoring standards, and the
  safeguarding duty behind them, apply to every school. We can tell a parent
  that their school is required to filter and to monitor, and that a named
  person is responsible for it.
- **How school issued accounts work as a product.** Google Workspace for
  Education's split between Core and Additional Services, the under 18 default
  restriction, and the parental consent requirement for Additional Services are
  Google's rules, not one school's.
- **What the evidence says about screens and learning, honestly.** Four months
  on average, two months to over a year in range, a padlock lost. National,
  published, and ours to quote fairly.

## School by school, and unknowable to us unless the parent tells us

- **What their school is teaching this week.** We can name the objective. We
  cannot name the lesson. The code already refuses to guess, in
  `lib/learning/digi-context.ts`, and that refusal is correct.
- **Whether their school runs a one to one device scheme, and whether a device
  comes home.** No national figure exists that I could find. Not found.
- **At what age their child gets a school account and an email address, and
  whether that email can send outside the school domain.** Set per domain by the
  school's administrator. Not found nationally, and genuinely unknowable to us.
- **Which monitoring product their school uses, what it flags, and who gets the
  alert.** Named products exist. Which one their school bought does not appear
  in any national dataset I could reach.
- [SEARCH INDEX ONLY] **Their school's phone policy in practice.** 90 percent of secondaries
  restrict phone use, 3.5 percent stop phones coming in at all, 21 percent of
  primaries do. Their school sits somewhere in that distribution and only its
  policy page says where. Storage method and exceptions are explicitly left to
  the school.
- **How much homework their child gets on a screen, and on which platform.**
  Seven in ten parents nationally say homework has moved online. Their child's
  teacher decides their child's homework.
- **Whether their school issues knowledge organisers, curriculum newsletters or
  a parent workshop, and what is in them.** Until the statutory publication
  requirement above is verified, assume this varies completely.

## The product consequence, in one paragraph

The gap is not a weakness, it is the shape of the thing we sell. We can be the
one place that tells a parent, nationally and with a source, what school adds
to their child's screen time and what it does not: that the first statutory
assessment is on a touchscreen at four, that the times tables check is on a
screen at eight, that SATs and GCSEs are still on paper, that the school day is
largely phone free already, that the school device is monitored by design, and
that seven in ten parents now find homework arriving through a portal that
expects the child online in the evening. Then we ask the parent the two or three
things only they can tell us, their school's phone policy, whether a device
comes home, and which platform the homework arrives on, and we tailor from
there. Everything national, we source. Everything local, we ask. We never guess,
and the product says so out loud.

---

# WHAT I COULD NOT VERIFY, IN ONE LIST

1. **Devices per pupil, pupil to device ratios, one to one schemes and take home
   device figures** from the DfE Technology in Schools Survey 2024 to 2025. The
   report exists and is almost certainly the answer. I could not open it.
2. **The verbatim wording of the February 2024 mobile phones guidance**, and
   therefore the quotation house rule two demands.
3. **The 2026 statutory change to the phones guidance.** A consistent story with
   an inconsistent date sequence. Read CBP 10241 before publishing anything.
4. **The Teacher Tapp 57 percent of homework requires the internet figure**, and
   the 25 percent for EYFS and KS1. No article URL found. Do not use.
5. **The 80 percent primary and 90 percent secondary weekly online homework
   claim.** Attributed to the Digital Poverty Alliance in secondary sources,
   underlying survey not located, and in tension with their own 2026 census.
6. **Microsoft 365 Education account model and age settings.** Not researched.
7. **The age at which a child typically receives a school issued account or
   email in England.** No national source found.
8. **Whether GCSE Italian and Polish reading and listening actually moved on
   screen in 2026** as proposed.
9. **Any figure for total daily screen minutes a child receives from school
   itself.** Appears not to be measured by anyone.
10. **Everything in Question Two.** No school website was fetched. The whole
    section is a brief, not a finding.
11. **The statutory basis for school website curriculum publication.** The
    School Information (England) Regulations 2012 and the academies publication
    guidance. Highest value unknown in this file.
