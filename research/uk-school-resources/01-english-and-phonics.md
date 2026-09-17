<!--
Lane file of the UK school resources sweep, 17 September 2026.
READ research/uk-school-resources/README.md FIRST. Nothing in this file has been
verified against a primary source: every page fetch in the session that produced
it was refused by the network egress policy, so all of it rests on the search
result layer. No line here is a verbatim quotation of a statutory document, and
no figure here may enter parent facing copy until the verification queue in the
README has been worked.
-->

# Primary phonics, reading and English schemes in England

Lane: primary English. Compiled 17 September 2026 for Guided Childhood, so we can
(a) tell a parent what their child is learning and which resources their school is
likely using, (b) build our own parent facing material in the same genre in our own
words, and (c) tell a parent what device use their child will meet at school.

## READ THIS FIRST: evidence status of this file

Two tool limits shaped what follows, and they matter for how much weight each line carries.

1. **No page was fetched directly.** WebFetch returned `EGRESS_BLOCKED` for every
   domain attempted (gov.uk, assets.publishing.service.gov.uk, dera.ioe.ac.uk,
   littlewandle, ruthmiskin, wikipedia, English hub sites). A direct `curl` of the
   DfE page failed with `CONNECT tunnel failed, response 403`, which the proxy
   README defines as an organisation egress policy denial, not a transient error.
2. **WebSearch is the only channel that worked, and its budget is now spent**
   (200 of 200 calls for the session, shared with the other agents running today).

So every claim below came through the WebSearch layer, which returns real result
titles and URLs plus a summary of the retrieved pages. Nothing here is invented, and
where I had no evidence I have written "not found". But two consequences must be
stated plainly:

- **Nothing in this file is a verbatim quotation of a statutory or curriculum
  document.** The house rule is quote, never paraphrase for anything statutory. I
  could not open a single statutory page, so I have recorded the substance with its
  official URL and marked it `[via search]`. Before any of this appears in a parent
  facing product, the statutory lines need a verification pass that opens the gov.uk
  pages and quotes them exactly.
- **Section C (licence and terms) is the weakest section.** Publisher terms pages
  could not be opened, so I can only report the fragments of licence wording that
  surfaced in search results, with the URL to check. Treat it as a to do list, not
  as cleared permission. We redistribute nothing either way.

Tags used below: `[pub]` a publisher's own claim about itself, `[3rd]` an
independent or third party source, `[gov]` an official government page named by URL
but not opened.

---

## 1. The phonics spine: the DfE validated programmes list

The authoritative source is the DfE page **"Choosing a phonics teaching programme:
list of phonics teaching programmes"**, at
https://www.gov.uk/government/publications/choosing-a-phonics-teaching-programme/list-of-phonics-teaching-programmes
(part of the collection https://www.gov.uk/government/collections/phonics-choosing-a-programme).
`[gov]` Blocked, not opened. A search summary reported the page as last updated
10 September 2025; unverified.

What the search layer reported about the process, with sources:

- In April 2021 the DfE published revised core criteria for systematic synthetic
  phonics (SSP) teaching programmes and launched a new validation process. Further
  rounds followed in November 2021 and February 2022. Programmes on the previous
  validated lists had to reapply by 31 March 2022 or drop off the list.
  `[3rd, via search]` https://peters.co.uk/news-page/dfe-phonics-changes-faqs and
  https://www.phonicsplay.co.uk/validation-update
- After three rounds, **45 SSP programmes were validated**, and the 2021 to 2022
  process is complete with no imminent plans to repeat it. `[3rd, via search]`
  same two sources. This is the single most useful fact for a parent: the list is
  effectively closed, so the scheme their school uses is almost certainly on it.
- **Letters and Sounds 2007 was removed** from the department's validated list, and
  the DfE published a questions and answers post about it in May 2021. `[gov]`
  https://educationhub.blog.gov.uk/2021/05/17/the-removal-of-letters-and-sounds-2007-from-the-departments-list-of-validated-phonics-programmes-teachers-questions-answered/
  This is why so many schemes carry "Letters and Sounds" in the name: they are
  revisions of the withdrawn 2007 document.
- Supporting documentation on the core criteria sits at `[gov]`
  https://www.gov.uk/government/publications/phonics-teaching-materials-core-criteria-and-self-assessment/validation-of-systematic-synthetic-phonics-programmes-supporting-documentation

**Which of the 45 I can name.** The search layer returned a partial alphabetical run
of names, explicitly "not limited to", so I treat it as a lead list to verify rather
than evidence. Names reported, unverified against the DfE page: A Flying Start with
Letters and Sounds, ACET Phonics, All Aboard Phonics, ALS Phonics: Letters and Sounds,
Anima Phonics, Bug Club Phonics, Dramatic Progress in Literacy Phonics (DPiL),
Essential Letters and Sounds, Extend Letters and Sounds, FFT Success for All Phonics,
First Class Phonics, Fishing for Phonics, Floppy's Phonics, GES Simply Letters and
Sounds, Jolly Phonics, Junior Learning Letters and Sounds, Lesley Clarke's Letters and
Sounds, Letterland, Little Wandle Letters and Sounds Revised, McKie Mastery Power
Phonics, Monster Phonics, No Nonsense Phonics, Pearl Phonics, Phonics International,
Phonics Shed, Phonics Steps, Ready Steady Phonics, Read Write Inc. Phonics,
Sounds-Write, Twinkl Phonics, Unlocking Letters and Sounds. Do not publish this list
until the DfE page has been opened and transcribed.

**Market concentration, which is the number a parent actually needs.** Teacher Tapp,
the teacher survey panel, reported that the top two schemes by some way are Read
Write Inc. and Little Wandle Letters and Sounds Revised, that **more than half of
schools use one of those two**, and that **80 per cent use one of the top six**
validated schemes. `[3rd, via search]`
https://teachertapp.com/articles/what-is-the-most-popular-validated-phonics-scheme/
and the 2025 update
https://teachertapp.com/articles/what-is-the-most-popular-validated-phonics-scheme-2025-update/
The 2025 update also reported both schemes taking Teacher Tapp Gold Awards on more
than 90 per cent of users recommending them, Essential Letters and Sounds gaining
awareness since 2023, and Twinkl Phonics rising on recommendations. For our product
this means a two question funnel gets most parents to the right answer: is it Read
Write Inc., is it Little Wandle, or is it one of four others.

---

## 2. The resource table

Columns are exactly as briefed. "Parent facing material" describes what the publisher
puts in front of a parent, not what a school photocopies.

| Resource | Publisher | Subject | Year groups | What it is (one line) | Parent facing material? | Device needed | How widespread | Official URL |
|---|---|---|---|---|---|---|---|---|
| Little Wandle Letters and Sounds Revised | Little Wandle (programme body; decodable readers published with Collins Big Cat) | Phonics and early reading | Nursery, Reception, Year 1, Year 2, plus catch up and SEND | DfE validated SSP built as a revision of Letters and Sounds, with matched decodable books and a strong home reading routine | Free downloads and videos on an open "For parents" area, plus school shareable phase guides | No for the phonics itself; optional for the parent videos, parent's own device | "over 5,500 schools", publisher claim `[pub]` | https://www.littlewandle.org.uk/ and https://www.littlewandle.org.uk/resources/for-parents/ |
| Read Write Inc. Phonics | Ruth Miskin Literacy, published by Oxford University Press | Phonics, reading, writing | Reception to Year 2, continuing into Years 3 to 6 where needed | DfE validated SSP with Speed Sounds, Fred Talk and fully matched storybooks, delivered in ability groups | Paid Home Learning Kits and flashcards written for untrained parents, plus free parent films | No at school; optional at home | "over 8,000 UK primary schools" and "10 million children", publisher claims `[pub]`; Teacher Tapp puts it joint top `[3rd]` | https://www.ruthmiskin.com/phonics/ and https://global.oup.com/education/content/primary/series/rwi/phonics/ |
| Jolly Phonics | Jolly Learning | Phonics | Reception and Year 1 mainly, resources to Year 6 | DfE validated SSP taught through 42 sounds in 7 groups with an action and a song per sound | Free four page Teacher and Parent Guide, paid parent workbooks | No | "used in 54% of UK Primary Schools" citing IPSOS-RSL, publisher claim, no date found `[pub]`, treat as unreliable; "over 150 countries" `[pub]` | https://jollylearning.com/en-gb/our-programmes/jolly-phonics |
| Sounds-Write | Sounds-Write Ltd | Phonics, linguistic phonics | Reception to Year 2, intervention to Year 6 and secondary | DfE validated SSP taught from sound to spelling rather than letter to sound, teacher training led | Two free online parent courses, "Help your child to read and write" parts 1 and 2, hosted on Udemy, plus a free resources page | Optional, parent's own device for the course | "over fifteen thousand classroom practitioners" trained on intensive courses, publisher claim `[pub]`; school count not found | https://sounds-write.co.uk/ and https://sounds-write.co.uk/free-resources/ |
| Essential Letters and Sounds (ELS) | Oxford University Press, originated by an English Hub | Phonics | Reception to Year 2 | DfE validated SSP written by teachers in a DfE English Hub, with ELS on Oxford Owl for digital delivery | Paid Home Learning Kits covering Phases 2 to 5, plus free advice on Oxford Owl for Home | Optional; ELS on Oxford Owl is a school subscription, teacher device | Not found. Publisher's 2023 impact study surveyed 163 teachers, 99 per cent agreeing it supported consistent phonics teaching `[pub]` | https://global.oup.com/education/content/primary/series/essential-letters-and-sounds/ and https://home.oxfordowl.co.uk/reading/reading-schemes-oxford-levels/essential-letters-and-sounds/ |
| Bug Club Phonics (formerly Phonics Bug) | Pearson | Phonics | Reception to Year 2 | DfE validated SSP with printed and eBook decodable readers allocated to children through ActiveLearn Primary | Home access to allocated eBooks through the child's ActiveLearn login | Yes. Pearson states ActiveLearn Primary works on Mac and PC, iPad and Android tablets, and is not recommended for mobile phones because of screen size. Usually the family's own device at home | Not found | https://www.pearson.com/en-gb/schools.html product page https://www.pearson.com/international-schools/british-curriculum/primary-curriculum/bug-club-family/bug-club-phonics.html |
| Twinkl Phonics | Twinkl | Phonics | Nursery to Year 2, levels 1 to 6 | DfE validated story led SSP bundled into the wider Twinkl subscription, with its own app | Paid through a Twinkl parent subscription; the Twinkl Phonics App is pitched as bridging home and school | Optional to yes for the app, family device | Not found for schools. Publisher cites 800,000 plus resources across the platform `[pub]`. DfE validation reported as 17 December 2021 `[pub]` | https://www.twinkl.co.uk/phonics |
| Floppy's Phonics | Oxford University Press | Phonics and early reading | Reception to Year 2 | DfE validated SSP built around the Oxford Reading Tree characters, sounds and letters route | Paid readers; free advice via Oxford Owl for Home | Optional | Not found | https://global.oup.com/education/content/primary/key-issues/phonics/systematic-synthetic-phonics-programmes/ |
| Monster Phonics | Monster Phonics | Phonics | Reception to Year 2, catch up beyond | DfE validated SSP that colour codes graphemes and attaches a monster character to each sound | Paid parent resources and books | Optional | Not found | https://monsterphonics.com/dfe-validation/ |
| Phonics Shed | EdShed | Phonics | Reception to Year 2 | DfE validated SSP delivered through the EdShed platform alongside Spelling Shed | Paid through an EdShed parent subscription | Optional to yes, family device | Not found | https://www.phonicsshed.com/ |
| Oxford Reading Tree | Oxford University Press | Reading scheme and book bands | Reception to Year 6, 20 Oxford Levels mapped to Book Band colours | The Biff, Chip and Kipper scheme, the default reading ladder in a large share of primaries | Free eBook library plus levels explainers on Oxford Owl for Home | No for the print books; optional for the eBooks, family device | "30 million children" have learned to read with it, publisher claim `[pub]`. A claim of "over 80% of UK primary schools" appeared in search results but I could not pin it to a primary source, so unverified | https://global.oup.com/education/content/primary/series/oxford-reading-tree/ |
| Oxford Owl for Home | Oxford University Press | Parent facing reading and phonics support | Ages 3 to 11 | The free parent wing of OUP's schools business: eBook library, levels guide, phonics explainers | Free, no school login needed for the free library | Optional, family device to read the eBooks | "over 130 free books" on the parent site `[pub]`; a third party count of "over 250 free Oxford Reading Tree eBooks" `[3rd]` https://www.callscotland.org.uk/blog/Free-online-Oxford-Reading-Tree-eBooks-from-Oxford-Owl/ | https://home.oxfordowl.co.uk/reading/free-ebooks/ |
| Collins Big Cat | HarperCollins (Collins) | Reading scheme and book bands | Reception to Year 6, Lilac to Lime bands | Banded fiction and non fiction reading books, also the decodable readers matched to Little Wandle | eBook library access for families through The Collins Hub with a school issued login, plus free KS1 eBooks | Optional to yes for eBooks, family device | "more than 12,000 UK schools" and "2 million children every year", publisher claim `[pub]`; "330+ free KS1 ebooks" via Collins Connect `[pub]` | https://collins.co.uk/pages/collins-big-cat and https://collins.co.uk/pages/big-cat-ebook-parent-access |
| Bug Club (reading, on ActiveLearn Primary) | Pearson | Guided and independent reading | Reception to Year 6 | Banded reading books plus allocated eBooks with comprehension quizzes, run by the teacher through ActiveLearn | Home reading of allocated eBooks with the child's login; Pearson publishes parent advice | Yes, family device at home | Not found | https://www.pearson.com/international-schools/british-curriculum/primary-curriculum/bug-club-family/bug-club.html |
| Accelerated Reader | Renaissance | Reading practice and quizzing | Typically Year 2 to Year 6, and into secondary | Child reads a levelled book then takes an online quiz on it; Star Reading sets a ZPD range | Renaissance Home Connect lets a parent see books read, quiz results and progress to target | Yes for the quizzes, school device usually, home access if the school enables it | Not found for UK school numbers. Publisher and school guides report "nearly 25,000 quizzes" `[3rd]` | https://www.renaissance.com/products/accelerated-reader/ (parent guide example https://wickfordprimary.uk/wp-content/uploads/2021/04/AR-Parent-Guide.pdf) |
| Reading Plus (now DreamBox Reading Plus) | Discovery Education | Reading fluency, comprehension and stamina | Years 2 to 11 | Adaptive online reading programme that paces the text on screen to build fluency and silent reading stamina | Little published for parents; schools often set it as home practice | Yes, screen based by design, school device or family device at home | "over 1,400 schools across the UK" `[pub]` | https://www.readingplus.com/reading-plus-for-uk/ ; independent trial listed at https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/reading-plus-2024-25-trial |
| Epic | Epic (Epic! Creations) | Digital reading library | Ages roughly 2 to 12 | Subscription library of children's eBooks, audiobooks and videos, widely used as free reading time | Free Epic Basic tier, paid Epic Unlimited or Family; parents can link to a child's school account | Yes, family device or school tablet | "more than 2 million teachers" globally, publisher claim `[pub]`. Epic School is stated as free for educators in the US and Canada, so UK school status is not confirmed. UK school count not found | https://www.getepic.com/educators |
| Lexia Core5 Reading | Lexia Learning (Cambium) | Structured literacy intervention | Reception to Year 6 | Adaptive online programme across phonological awareness, phonics, structural analysis, fluency, vocabulary and comprehension | A school issued home use letter and a login; myLexia reporting is for staff | Yes. Browser at lexiacore5.com or the Core5 iPad app, school device, family device if the school enables home use | Not found for England | https://www.lexialearning.com/core5 (UK home use letter https://www.lexialearningresources.com/core5/public/core5_home_use_letters/Core5_School_Year_Home_Use_Letter_UK.pdf) |
| Nessy Reading and Spelling | Nessy Learning, Bristol | Phonics, reading and spelling, dyslexia friendly | Ages 5 to 12 | Multisensory Orton Gillingham style games, used mainly as SEND and catch up provision | Direct to parent subscriptions and home products | Yes, family or school device | Not found for school numbers. Developed at the Bristol Dyslexia Centre and in use since 1999 `[pub]`. Home from £102 a year; school licences quoted from £22 per user for 1 to 9 down to £8.50 for 50 plus `[pub]` | https://www.nessy.com/en-gb/ |
| Reading Eggs | 3P Learning | Early reading, phonics and comprehension | Ages 4 to 13, with Reading Eggs Junior below and Reading Eggspress above | Gamified online reading lessons plus a large eBook library | Direct to parent subscriptions, reported around £83 a year in the UK | Yes, family device at home, school device in class | Not found. Publisher cites "over 4,000 books" in the library `[pub]` | https://readingeggs.co.uk/schools/pricing/ |
| Talk for Writing | Pie Corbett and Talk for Writing (Talk4Writing) | Writing, and reading into writing | Reception to Year 6, into Year 7 | Imitate, innovate, invent approach built on learning a model text orally before writing | Free home school booklets by year group, with model texts and audio recordings | No, printable; optional for the audio | "Thousands of schools in the UK, and beyond" follow the approach, publisher claim, no figure `[pub]` | https://www.talk4writing.com/english-booklets/ |
| Pathways to Write | The Literacy Company | Writing | EYFS to Year 6, progression mapped to Year 7 | Mastery writing units built around a quality text, with gateway and mastery keys | Not found as published parent material | No | "over 1050 schools nationwide" `[pub]`. Priced from £315 plus VAT for one year group to £1,975 plus VAT whole school, then a £250 annual membership for a single form school `[pub]` | https://www.theliteracycompany.co.uk/pathways-literacy/pathways-to-write/ |
| Pathways to Spell | The Literacy Company | Spelling | Year 1 to Year 6 | The spelling companion to Pathways to Write | Not found | No | Not found separately from the Pathways figure above | https://www.theliteracycompany.co.uk/pathways-literacy/pathways-to-spell/ |
| CUSP English | Unity Schools Partnership (Curriculum with Unity Schools Partnership) | Reading, writing, spelling, vocabulary | Reception to Year 6 | Trust built, cognitive science led curriculum with knowledge notes and heavy vocabulary teaching, originated by Alex Bedford | Knowledge notes are the closest thing, and many schools publish them on their own websites | No | Reported as "600 schools" on one page and "over 700 schools" on another, both publisher claims, so the figure is soft `[pub]` | https://www.unity-curriculum.co.uk/ and https://www.unitysp.co.uk/cusp/ |
| The Literacy Tree (The Literary Curriculum) | Literacy Tree | English, book based | Reception to Year 6, into Year 7 | Whole school English built entirely from quality children's books, with Literary Leaves and Spelling Seeds | "Home Learning Branches" and Learning Log Videos sit inside the school membership | No | "Nearly 1,000 member schools worldwide" `[pub]`. Whole school membership £714 for a single form school, individual £3.99 a month `[pub]` | https://literacytree.com/memberships/ |
| The Write Stuff | Jane Considine Education | Writing | Reception to Year 6 | Sentence stacking lessons built on the FANTASTICs, the Writing Rainbow and Rainbow Grammar | Not found as published parent material; schools commonly publish their own summary for parents | No | Not found. Unit plans from £24.99 a year individual, £149.99 whole school licence `[pub]` | https://www.janeconsidine.com/ |
| No Nonsense Spelling | Babcock LDP primary literacy team (written by the Devon County Council primary literacy team), published by Raintree | Spelling | Year 2 to Year 6 | Five teacher books plus editable files, termly overviews and daily short spelling lessons mapped to the national curriculum | None | No | "thousands of schools", publisher claim, no figure `[pub]`. Listed at £195 `[pub]` | https://www.raintree.co.uk/products/9781474709811 |
| No Nonsense Grammar | Babcock LDP, published by Raintree | Grammar and punctuation | Year 1 to Year 6 | The grammar companion volume to No Nonsense Spelling | None | No | Not found | https://www.raintree.co.uk/products/9781474720328 |
| Spelling Shed (EdShed) | EdShed | Spelling, and phonics via Phonics Shed | Year 1 to Year 6 | Spelling lists set as homework and practised as a game, with a school leaderboard | Direct to parent subscription at £4.99 a month or £29.99 a year, plus a £2.99 app | Yes, family device for homework, school device in class | "over 170,000 educators" and "over 2.5 million children every month", publisher claims `[pub]` | https://www.edshed.com/ and https://www.spellingshed.com/ |
| Grammarsaurus | Grammarsaurus | Grammar, punctuation, spelling and wider primary English | Year 1 to Year 6 | Teacher made grammar and writing resources from practising teachers and writing moderators, founded 2016 | Not found as a parent product; individual membership exists at £59.98 a year | No | Not found. School memberships from £160 plus VAT, one form entry £399 a year `[pub]` | https://grammarsaurus.co.uk/portal/ |
| Letter-join | Letter-join (Lettering Delights Ltd trading as Letter-join) | Handwriting | Reception to Year 6 | Whole school handwriting scheme with animated letter formation, printed, lead in cursive and cursive script fonts | Home access is included with a school subscription, so a parent can log in with school issued pupil details; a standalone home subscription is £50 a year | Yes for the animations, PCs, interactive whiteboards and tablets at school, family device at home | Not found. Eight classroom accounts quoted at £396 plus VAT year one then £296 plus VAT `[pub]` | https://www.letterjoin.co.uk/ |
| Nelson Handwriting | Oxford University Press | Handwriting | Reception to Year 6 (Starter Level to Book 6, mapped P1 to P7) | Long standing print and workbook handwriting scheme, third edition linked to Letters and Sounds, with optional teaching software and fonts | Paid workbooks that parents can buy; no free parent pack found | No for the books, optional for the teaching software, teacher device | Not found | https://global.oup.com/education/content/primary/series/nelson-primary/nelson-handwriting-3ed/ |
| Kinetic Letters | Kinetic Letters (Margaret Williamson) | Handwriting | Reception to Year 6 | Handwriting programme that starts from body strength and posture, four strands, delivered through school training | Schools publish their own parent information sheets; publisher parent material not found | No; training is delivered to staff as eLearning | Not found | https://www.kineticletters.com/ |

**Row count: 33 resources.**

### Statutory checkpoints in this lane

Same evidence caveat: official pages named but not opened, so nothing here is a verbatim quotation.

| Checkpoint | Who sits it | When | Format and marks | Paper or on screen | Source |
|---|---|---|---|---|---|
| Year 1 phonics screening check | All Year 1 pupils, plus Year 2 pupils who did not meet the standard in Year 1. Still statutory after KS1 SATs became optional | Week beginning 8 June 2026 reported for 2026 | 40 words read aloud, 20 real words and 20 pseudo words, administered one to one by a familiar adult | **Paper**, a booklet of words read aloud to a teacher | `[gov]` https://www.gov.uk/government/publications/phonics-screening-check-2026-materials ; `[3rd]` https://doodlelearning.com/exam-tips/phonics-screening-check |
| Phonics screening check threshold 2026 | as above | Threshold announced 22 June 2026 | **31 out of 40**, one mark lower than the 32 used every previous year. The check is built to the same specification each year but the words change, so the threshold can move | n/a | `[3rd]` https://www.hfleducation.org/blog/year-1-phonics-screening-check-2026-threshold-one-mark-lower-story-really-any-different ; https://classroomsecrets.co.uk/blogs/what-has-changed-in-the-year-1-phonics-screening-check-administration-guidance ; https://primarytools.co.uk/files/Tests/KS1/2026/2026%20KS1%20Thresholds.pdf |
| KS2 English grammar, punctuation and spelling | Year 6 | Monday 11 May 2026 | Paper 1 grammar and punctuation, 45 minutes, 50 marks. Paper 2 spelling, 20 spellings read aloud by the teacher, 1 mark each | **Paper** | `[gov]` https://www.gov.uk/government/publications/key-stage-2-tests-2026-english-grammar-punctuation-and-spelling-test-materials ; `[3rd]` https://primary.lbq.org/hub/ks2-sats-guide |
| KS2 English reading | Year 6 | Tuesday 12 May 2026 | One hour, three texts, 50 marks | **Paper** | `[3rd]` https://primary.lbq.org/hub/ks2-sats-guide ; https://thirdspacelearning.com/blog/sats-2026-guide/ ; `[gov]` https://educationhub.blog.gov.uk/2026/03/ks2-sats-2026-what-parents-need-to-know |
| KS2 English writing | Year 6 | across the year | **No written test.** Writing is teacher assessed from work produced across the year | n/a | `[3rd]` https://primary.lbq.org/hub/ks2-sats-guide |
| Reception baseline assessment (RBA) | Reception, in the first six weeks | Autumn term | Short one to one activities in early literacy, communication, language and maths | **On screen for delivery.** Reported: from June 2025 guidance the RBA is delivered one to one using two digital devices, the practitioner running it on one and the pupil responding on a separate touchscreen device, with schools needing a minimum of two compatible devices | `[gov]` https://www.gov.uk/guidance/reception-baseline-assessment-it-guidance and https://www.gov.uk/government/publications/reception-baseline-assessment-administration-guidance/2026-reception-baseline-assessment-administration-guidance ; campaign source `[3rd]` https://safescreens.org/reception-baseline-assessment-rba/ |
| KS1 SATs | Year 2 | n/a | Non statutory from the 2023 to 2024 academic year; optional teacher assessment guidance remains | n/a | `[gov]` https://www.gov.uk/government/publications/key-stage-1-teacher-assessment-guidance ; `[3rd]` https://www.tes.com/magazine/news/primary/key-stage-1-decision-scrap-sats-2023-welcome-say-heads |
| Year 4 multiplication tables check | Year 4. Outside this lane but it is the on screen precedent | Two weeks from 1 June 2026 | 25 questions, timed, results go direct to the DfE | **On screen**, desktop, laptop or tablet at school | `[gov]` https://gov.uk/guidance/multiplication-tables-check-it-guidance ; `[3rd]` https://primary.lbq.org/hub/multiplication-tables-check-guide |

The honest headline for a parent: **the English checkpoints are still pen and paper.
The screens arrive earlier, in Reception, through the baseline assessment, and in
Year 4 through the tables check.** Ofqual and the DfE commissioned an on screen
assessment research study (https://www.gov.uk/government/publications/on-screen-assessment-research-study),
and a Tes report says full digital assessment is unlikely until the 2030s
(https://www.tes.com/magazine/news/general/digital-assessment-unlikely-until-2030s-ofqual),
so do not tell parents that SATs are going digital.

---

## A. PARENT FACING MATERIAL

This is the genre we are copying in our own words, so the shape and length matter more
than the content. Six schemes publish real quantities of it.

**1. Little Wandle Letters and Sounds Revised. The strongest model, and the one to
study first.** Its parent material sits in a public area, no school login, split into
two halves that map neatly onto what parents ask: *Support for phonics* and *How we
teach*. The shapes reported:

- **Short explainer videos**, one per element of the programme, pitched at parents and
  carers rather than teachers. These are the "why does my child say it like that"
  answer.
- **Pronunciation guides by term**, a separate one for Reception Autumn 1, Reception
  Autumn 2, Reception Spring 1 and Year 1. That termly slicing is the single best idea
  in the genre: a parent is never handed the whole programme, only the fortnight they
  are in.
- **Grapheme mats**, a one page grid of every sound taught so far with its picture cue.
- **Grow the Code charts**, one page, showing the alternative spellings of each sound.
- **Letter formation practice sheets**, printable.
- **A parent version of a teacher resource** for practising tricky words at home.
- Sources: https://www.littlewandle.org.uk/resources/for-parents/ and
  https://www.littlewandle.org.uk/whats-included/support-for-parents/
- Shape to copy for us: one page per fortnight, one video per idea, and the words a
  parent should say.

**2. Oxford Owl for Home (Oxford University Press).** The biggest free parent library
in the market and the one most schools link to. What a parent gets: a **free eBook
library** (publisher says over 130 free books, a third party count says over 250
Oxford Reading Tree titles), a **levels and book bands explainer** that translates
Oxford Levels into Book Band colours, per scheme parent guides including one for
Essential Letters and Sounds, and age banded activity pages. Length: web pages of a
few hundred words each plus the library. Sources
https://home.oxfordowl.co.uk/reading/free-ebooks/ and
https://home.oxfordowl.co.uk/reading/reading-schemes-oxford-levels/oxford-reading-tree-levels/
Shape to copy: the translation table. Parents arrive knowing a colour and wanting a
meaning.

**3. Talk for Writing.** The most generous free downloads in the writing half of the
market, and the closest thing to a finished parent product anywhere in this lane.
**Home school booklets, one per year group**, each containing a model text, the audio
recording of it, and a sequence of activities. These were written for home learning
during school closures and were left up. They are booklet length, tens of pages, not
one pagers. Source https://www.talk4writing.com/english-booklets/ Shape to copy: the
model plus the audio plus a fortnight of steps, in one file a parent can print.

**4. Read Write Inc. (Ruth Miskin and OUP).** Sells rather than gives. The parent
product is the **Home Learning Kit and flashcards**, explicitly built for parents who
have had no training in the programme, sold through OUP. Free parent films exist on the
Ruth Miskin site. Source https://www.ruthmiskin.com/phonics/ Shape to note: the paid
kit is proof parents will buy a home version of a school scheme, which is our business
model in one line.

**5. Sounds-Write.** The only scheme found giving parents a **structured free course**
rather than leaflets: "Help your child to read and write" parts 1 and 2, hosted on
Udemy, part 2 normally £19.99 and reported as free. A course, not a handout, is the
nearest neighbour to what Guided Childhood does, and worth watching for its lesson
length and sequencing. Sources https://sounds-write.co.uk/free-resources/ and
https://www.udemy.com/course/help-your-child-to-read-and-write/

**6. Collins Big Cat and Pearson Bug Club.** Both give the parent an **eBook library
behind a school issued login**, and both have effectively outsourced the explaining to
schools: the parent facing artefact that actually circulates is a **two page "logging
in" guide** produced by the school, not the publisher. Real examples found:
https://www.sacredheart.notts.sch.uk/wp-content/uploads/sites/13/2024/11/The_Collins_Hub_Big_Cat_eBook_Library_User_Guide_for_Parents.pdf
and https://wickfordprimary.uk/wp-content/uploads/2021/04/AR-Parent-Guide.pdf for
Accelerated Reader. Shape to note: there is an obvious gap here. The publishers give a
login and the schools write the leaflet. A neutral, plain English "what your school just
asked you to log into" page is unowned ground for us.

Formats worth building, ranked by how often they appear across the six: the **termly or
half termly one page overview**, the **sound or grapheme mat**, the **90 second
pronunciation video**, the **how we teach reading leaflet**, the **login and routine
guide**, and the **model text with audio**. Notably absent from every scheme: a
**workshop slide deck for parents** published openly. Schools build those themselves,
which is why our gc-slides parent evening pack has room.

## B. DEVICE EXPOSURE

What actually puts a screen in front of a primary child in England, on the evidence
gathered.

**Statutory, and unavoidable.**
- **Reception baseline assessment.** The earliest screen contact of a child's school
  life, in the first six weeks of Reception. Reported as delivered one to one on two
  digital devices, the practitioner on one and the child answering on a separate
  touchscreen tablet, with schools required to have at least two compatible devices.
  This is the finding parents will be most surprised by. `[gov]`
  https://www.gov.uk/guidance/reception-baseline-assessment-it-guidance
- **Year 4 multiplication tables check.** On screen at school, desktop, laptop or
  tablet. Outside this lane but it is the same conversation.
- **Year 1 phonics screening check and KS2 English SATs are paper.** Nothing to install.

**School device, in class, usually no parent action.** Lexia Core5 (browser or Core5
iPad app), Accelerated Reader quizzes, Reading Plus, Epic in free reading time, Phonics
Shed and Spelling Shed in class, Letter-join animations on the interactive whiteboard,
Nelson Handwriting teaching software on the teacher's machine.

**Family device, because the school sets it as homework. This is where the parent gets
asked to install or log into something.** In rough order of how often it comes up:

1. **Spelling Shed (EdShed).** Weekly spelling list set as a game. Parent installs the
   app or opens play.edshed.com and keeps a school issued login. Leaderboards mean
   children ask for more turns.
2. **Pearson ActiveLearn Primary (Bug Club and Bug Club Phonics).** The school allocates
   eBooks and the child reads them at home. Pearson's own guidance says it works on Mac
   and PC, iPad and Android tablets, and is **not recommended for mobile phones** because
   of screen size, which in practice means the child is handed a tablet or a laptop, not
   a phone.
3. **Collins Hub Big Cat eBook library.** School issued username and password at
   ebooks.collinsopenpage.com.
4. **Oxford Owl.** Two doors, a free parent library needing no school login and a school
   subscription area (including Essential Letters and Sounds) that does.
5. **Accelerated Reader with Renaissance Home Connect.** Parent logs in to see books
   read, points and progress to target. A monitoring surface pointed at a child's
   reading, which is worth naming honestly in our own material.
6. **Reading Plus (DreamBox).** Screen based by design, frequently set for home practice.
7. **Nessy and Reading Eggs.** Often bought by the parent directly rather than the school,
   so they arrive as a family subscription.
8. **Twinkl Phonics App and Letter-join home access.** Both explicitly pitched as
   home and school bridges.

**Puts no screen in front of a child at all:** Little Wandle's own teaching, Read Write
Inc. lessons, Jolly Phonics, Sounds-Write, Talk for Writing, Pathways to Write, CUSP
English, The Literacy Tree, The Write Stuff, No Nonsense Spelling and Grammar,
Kinetic Letters, and the print side of every reading scheme. Worth saying out loud to
parents: **the actual teaching of reading and writing in England is overwhelmingly off
screen. The screens are in assessment, in practice and in homework.**

## C. LICENCE AND TERMS

Weakest section in the file, and deliberately marked as such. No publisher terms page
could be opened, so what follows is the licence wording that surfaced in search results
plus the URL where the real terms live. **Nothing here should be treated as cleared
permission, and we redistribute none of it in any case.** Our position stays: read their
material, write our own, link to theirs.

- **Talk for Writing.** The strongest wording recovered, reported from the booklets and
  the booklets page: the materials are copyright Pie Corbett and Talk for Writing and are
  to be used to support children, staff and parents in home learning only, not for
  commercial gain and not for training or sharing widely. Reported, not fetched, so treat
  as indicative until checked. https://www.talk4writing.com/english-booklets/
- **The Literacy Company (Pathways).** Their public sample pack is itself marked
  **"Not for redistribution"** in the document title, which is as clear a signal as a
  publisher gives.
  https://26004251.fs1.hubspotusercontent-eu1.net/hubfs/26004251/Pathways%20Documents/Pathways%20to%20Write%20Mixed-Age%20-%20Sample%20Pack.pdf
- **Grammarsaurus.** A school subscription is described as including a licensing fee that
  allows use across all classes in the school, which implies a per school licence with no
  onward sharing. https://grammarsaurus.co.uk/portal/faq-support-page/
- **Little Wandle.** The "For parents" area is described as a public area, which is why
  schools link to it directly rather than copying it. Terms not verified.
  https://www.littlewandle.org.uk/resources/for-parents/
- **Collins.** Free KS1 eBooks are offered through Collins Connect, and family access to
  Big Cat eBooks runs through school issued logins on The Collins Hub, which is a
  licensed access model, not a redistribution one.
  https://collins.co.uk/pages/big-cat-ebook-parent-access
- **Pearson.** Access is through ActiveLearn accounts allocated by the school. Terms not
  verified. https://www.pearson.com/en-gb/schools.html
- **Oxford University Press.** Free Oxford Owl parent content sits alongside paid school
  subscriptions. Terms not verified. https://home.oxfordowl.co.uk/
- **Twinkl.** Subscription platform, resources are licensed to the subscriber. Terms not
  verified. https://www.twinkl.co.uk/
- **Not verified at all, licence page to be read:** Ruth Miskin and Read Write Inc.,
  Jolly Learning, Sounds-Write, Essential Letters and Sounds, Monster Phonics,
  Phonics Shed and EdShed, Renaissance, Discovery Education, Epic, Lexia, Nessy,
  3P Learning, Unity Schools Partnership, Literacy Tree, Jane Considine, Raintree,
  Letter-join, Kinetic Letters.
- **Crown copyright and the Open Government Licence.** DfE and STA material, including
  the national curriculum wording and past test papers, is normally published under
  Crown copyright with OGL terms. I could not open the gov.uk pages to confirm the terms
  statement, so this must be verified before we lean on it. This matters, because it is
  the one body of material we could quote at length and legitimately.

---

## What to verify when egress is restored

In priority order, because each one is load bearing for a parent facing claim.

1. Open the DfE validated programmes list and transcribe all 45 names, the publisher
   for each, and the wording about what validation means and whether the list is closed.
2. Quote the 2026 phonics screening check administration guidance and the threshold
   announcement exactly. The drop from 32 to 31 is a real news hook for us and it must be
   quoted, not summarised.
3. Quote the reception baseline assessment IT guidance on the two device requirement.
   This is the strongest device exposure fact in the lane and it needs the government's
   own words.
4. Confirm the KS2 English papers, timings and marks from the STA materials pages.
5. Read the terms of use for the top six schemes and record the exact reuse wording.
6. Pin down or drop the "over 80% of UK primary schools" claim about Oxford Reading Tree,
   and date or drop the Jolly Phonics 54 per cent IPSOS-RSL figure.
