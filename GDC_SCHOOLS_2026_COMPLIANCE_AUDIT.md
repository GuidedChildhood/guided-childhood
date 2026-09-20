# Guided Childhood Schools: statutory coverage and lesson audit

**Date:** 19 September 2026
**Scope:** the 25 module schools scheme as it stands in production, audited against the English statutory requirements that bite on 1 September 2026.
**Status:** audit only. No application code, database row, route, component or wiring has been changed.
**Revision:** second pass. The first pass could not obtain KCSIE 2026 and said so. KCSIE 2026 has now been read in full and every claim that depended on it is settled below, by paragraph number.
**Re-audit:** 20 September 2026. Every gap this document names is closed, and the closure is proved against production rather than asserted. The section immediately below records it. Nothing beneath that section has been edited, because it is the record of what was found.

Every number in this document was produced by querying the live `schools.school_lessons` table in production (732 slides across 25 modules, 666,157 characters of lesson text) and by reading the schools application source. Where something is absent, the absence was established by a word boundary search across all 732 slides, and the search is quoted so it can be re run. Where something could not be verified, it says so rather than guessing.

---

## Re-audit, 20 September 2026: what was done about it, and the proof

This section was added the day after the audit below, when the work it asked for was finished. The method is the same: every number here was produced by querying the live `schools.school_lessons` table in production, and the queries are in the repository so they can be re run.

**Production on 20 September 2026:** 29 modules, 856 slides, 15 safeguarding flagged. The 25 module scheme audited below gained four modules, and five existing modules gained fourteen sentences.

**The 57 requirements: 57 taught, 0 part taught, 0 not covered, 0 handed to the school's own scheme.**

That sentence is not a claim, it is a test result. Every one of the 57 is held to short phrases that must appear in the named module's live slide text. On 20 September, 147 such phrases were run against the production table as a case insensitive substring test scoped to each requirement's own modules: **147 checked, 0 not found.** The hash of exactly what was tested is recorded in `scripts/fixtures/rshe-evidence.json`, and `scripts/check-rshe-coverage.mjs` fails continuous integration if the data module ever drifts from it. The same guard carries a ratchet, set on 19 September to 11 outstanding and 9 gaps. It is now set to 0 and 0, and it only ever comes down.

### What closed what

| Migration | What it did | Requirements closed |
|---|---|---|
| 309, 310, 311 | Named clauses appended to existing slides on 19 September, no slide added, no minute changed | Took the count taught in full from 18 to 40 |
| 312, `ks2-26-why-thirteen` | KS2, 31 slides. The age rule as a mechanism: thirteen is a data protection age, four protections are wired to the number, games and gambling sites carry numbers with different jobs | RSHE-P-OSA-3, RSHE-P-WO-5 |
| 313, `ks3-27-when-it-turns-on-you` | KS3, 31 slides. Why conflict escalates online, four behaviours by their real names including coercive control, name it save it say it, the bystander's three moves | RSHE-S-OSA-9, RSHE-S-OSA-10, RSHE-S-WO-3, RSHE-S-RR-6 |
| 314, `ks4-28-the-money-and-the-odds` | KS4, 31 slides. The price a game currency hides, the house edge, the speed of the loop, what gambling harm does to a person, and where to take it | RSHE-S-WO-4, RSHE-S-MW-8 |
| 315, `ks4-29-did-not-go-looking` | KS4, 31 slides. Content that arrives unasked: self harm and violent content, drug and knife supply, you are not in trouble, stop it report it say it | RSHE-S-WO-7, RSHE-S-WO-6, the violence half of RSHE-S-OSA-8, the law half of RSHE-S-BS-11 |
| 316 | Fourteen sentences across ks1-02, ks2-08, ks4-16, ks4-17 and ks4-18, no slide added, no minute changed | The six rows this document's successor marked as belonging to the school's own scheme: RSHE-P-GW-9, RSHE-S-RR-9, RSHE-S-BS-1, RSHE-S-BS-2, RSHE-S-BS-11, RSHE-S-BS-16. Justin's decision on 19 September was to teach all six, framed through the online context |

Migrations 312 to 315 were carried into production in hash verified chunks, because a module migration is forty to seventy thousand characters and the channel available could not carry that in one statement reliably. Each one's entry in the migration history is an executable assertion that recomputes the hash on the server and raises if a single character differs. All four hold.

KCSIE 2026 now independently names the same harm for 36 of the 57 requirements, one more than on 19 September, because RSHE-S-WO-6 (drug and knife supply) is anchored to paragraph 165 contact.

### What is still not claimed, and will not be

- **This does not make a school compliant.** The eight rows marked NOT A LESSON REQUIREMENT in the matrix stand exactly as written: staff reading and training under KCSIE, recording and referral, filtering and monitoring, the RSE policy, the DPIA and governor assurance are the school's, and no scheme of work discharges them.
- **This scheme teaches no sex education.** Consent is now taught in full, in all contexts including online as the guidance words it, and that is relationships education. The parental right to request withdrawal does not bite on any lesson here.
- **It covers the digital and online requirements, 57 of the 195, never all of them.** The guidance has 28 strands. This is the online safety and digital literacy spine and sits inside a school's wider provision.
- **The national curriculum for computing is still not audited**, for the reason given in section 2: the document was not obtained and this audit does not paraphrase a statutory document from memory.
- **"Published on 15 July 2025" is still unverified.** Neither document body carries the day.
- **The judged lesson quality findings in section 6 were not re run.** The counted checks were. The lesson council (`scripts/council.mjs`, the arithmetic checks only) was run over all 29 modules on 20 September against a fixture of the production rows. Prose 9.81 of 10, blocks 9.68, engagement 9.41, passport 10.00, every one above the floor it had before the new modules. The one place the four new modules sat below the other twenty five was prose: five concept slides in `ks4-28` and `ks4-29` ran 120 to 165 words against a ceiling of 105 measured on the real projector. Migration 318 trimmed the five to at most 103 words each, moving nothing off the wall except into the teacher script on the same slide, and the 147 phrase attestation was re run afterwards: 147 checked, 0 not found. Prose is 9.95 after it. The four new modules also pass the same module contract as the other twenty five, and were built on the same Rosenshine arc with the same scripted, paper fallback, DSL noted shape, and that is the extent of the claim.

### How to re run this

```
npm run rshe-generate            # rebuilds the data module and the CSV from scripts/rshe/
npm run rshe-evidence            # prints the SQL; run it against production
node scripts/check-rshe-coverage.mjs
```

A TOTAL row with zero failures means every claim holds. Anything else means a lesson no longer says what the data module claims it says, and the claim is what is wrong.

---

## 1. Executive verdict

**The teaching is good. The mapping is not yet true. The claims are ahead of both.**

Three findings decide everything else.

**One.** The scheme's compliance story rests on a list of ten topics in `shared/schools-curriculum.ts` called `RSHE_2025_TOPICS`. That list is not the structure of the statutory guidance. The July 2025 guidance is organised into 28 named strands containing 195 numbered curriculum content items. The ten topic list is a selection of themes someone wrote, and the whole mapping matrix, the Hub, the FAQ and the public home page all render from it. Nothing downstream can be more accurate than that list, and the list has never been checked against the document.

**Two.** Of the 57 statutory requirements that this scheme could reasonably be expected to teach, **18 are fully covered, 28 are partially covered, 2 are covered only indirectly, and 9 are not taught at all.** The nine that are missing are not obscure. They include the minimum age of 13 for social media, why services are age restricted, online bullying and harassment at secondary, online gambling, and content promoting self harm or suicide.

**Three.** The public site currently says every module is mapped to the guidance "line by line" and the FAQ says the scheme provides "the taught curriculum mapped to every relevant requirement". Neither sentence is supportable today. They are the first things to change, and they can be changed this week without touching a single lesson.

**Is it sellable?** Yes, to pilot schools, with the claims corrected first. The classroom product is genuinely strong and in several places better than what schools currently buy. What is not ready is the compliance wrapper around it, and the compliance wrapper is what a head teacher reads before they believe the classroom product.

---

## 2. Source and status table

The user supplied the primary material for this audit because every UK government domain is blocked by this environment's network policy (`www.gov.uk`, `assets.publishing.service.gov.uk` and `www.legislation.gov.uk` all return 000 to curl and EGRESS_BLOCKED to WebFetch). The provenance of each source is recorded honestly below, including what still could not be checked.

| Source | What it actually is | Status | Does it create teaching requirements? | How it was obtained |
|---|---|---|---|---|
| **Relationships Education, Relationships and Sex Education (RSE) and Health Education**, DfE, July 2025 | Statutory guidance issued under s80A Education Act 2002 and s403 Education Act 1996. Schools **must have regard to it**. The subjects themselves are compulsory under the Children and Social Work Act 2017 regulations. | **STATUTORY CURRICULUM** | **Yes.** 195 numbered curriculum content items across 28 strands. | Supplied twice and cross checked: the official PDF, text extracted here (47 pages), and an independent markdown conversion. **Both give 28 strands and 195 items with identical wording on every item checked.** |
| **Keeping Children Safe in Education 2026**, DfE, in force September 2026 | Statutory safeguarding guidance for schools and colleges. | **STATUTORY SAFEGUARDING** | **No**, but it is not silent on teaching: para 160 sets out what a preventative education programme "will tackle, at an age-appropriate stage", and para 165 defines the four areas of online risk. | Full document supplied, split by part with PDF page markers. Cited by paragraph number throughout this audit. |
| **Sharing nudes and semi-nudes: advice for education settings**, UKCIS with the NPCC, February 2024 | Advice on responding to incidents, plus a section on educating children (section 3). | **NON STATUTORY ADVICE** | **No.** It states its own status: "This advice is non-statutory." | Full text supplied. **Note its currency: it cites the 2019 RSHE guidance, so it predates the July 2025 revision.** |
| **Teaching online safety in schools**, DfE | The document states in its own words: "This **non statutory** guidance outlines how schools can ensure their pupils understand how to stay safe and behave online as part of existing curriculum requirements" and "**There are no additional teaching requirements.**" | **NON STATUTORY ADVICE** | **No.** Explicitly none. | Full text supplied. |
| **Education for a Connected World** (UKCIS) | A non statutory framework of eight strands. | **NON STATUTORY FRAMEWORK** | No. | Already encoded per module in `efcw_strands`. |
| **National curriculum for computing** | Statutory for maintained schools. Contains online safety content at all key stages. | **STATUTORY CURRICULUM** | Yes, but **still not audited**: the primary document was not obtained and this audit will not paraphrase a statutory document from memory. | Not obtained. |
| **Filtering and monitoring standards** | Technical standards referenced by KCSIE. | **TECHNICAL STANDARD** | No. | Not obtained. |

### Provenance, now settled

1. **"Becomes compulsory on 1 September 2026" is verified.** Not from the RSHE document body, which carries no commencement date, but from a second statutory document: **KCSIE 2026 para 159** states that in teaching these subjects "schools must have regard to the statutory guidance, which can be found here **(revised for introduction September 2026)**". Cite that, and the claim is unimpeachable.
2. **"Published on 15 July 2025" is still unverified.** The PDF cover carries only "July 2025" and neither document body gives the day. Either cite the GOV.UK publication page or drop the day. This is the one provenance detail still outstanding, and it is trivial.

### The KCSIE sentence on the mapping page: verified, with two corrections

The Hub currently says KCSIE 2026 "now names generative AI, deepfakes, misinformation, disinformation and conspiracy theories" **alongside** the four Cs. Every one of those five is genuinely in KCSIE 2026. Two details are wrong and both are easy to fix:

- They are named **inside** the four areas of risk, not alongside them. Para 165: **content** includes "misinformation, disinformation (including fake news) and conspiracy theories"; **contact** includes "harmful online interaction with other users **or generative AI applications that simulate this**"; **conduct** includes "making, sending and receiving explicit images, **including those generated using AI**".
- **Deepfakes are not in para 165.** They appear in the definitions section ("digitally altered or wholly generated using artificial intelligence, including what are sometimes described as 'deepfakes' or 'deep nudes'") and in **para 160**, which says a preventative education programme will tackle "understanding online harms such as sharing images, **the prevalence of deepfakes, pornography and misogynistic influencers** and when and where to seek help".
- The fourth C in KCSIE 2026 is **commerce**: "risks such as **online gambling**, inappropriate advertising, phishing and or financial scams."

### Five per module KCSIE hooks are now verified rather than asserted

| Module | Hook it carries | Now verified against |
|---|---|---|
| ks2-23, ks3-22 (AI as a friend) | "KCSIE 2026 (AI simulating harmful interaction as a contact risk)" | **para 165 contact**, word for word: "or generative AI applications that simulate this" |
| ks4-16 (consent, images, law) | "UK law on under 18 images" | **para 165 conduct**: explicit images "including those generated using AI", plus the definitions section on deepfakes and deep nudes |
| ks3-12 (deepfakes) | "KCSIE 2026 content risks" | **para 160**: "the prevalence of deepfakes" |
| ks3-14 (bodies, image, pressure) | "RSHE 2026 (body image, pornography)" | **para 160**: "pornography"; **para 165 content**: "pornography" |
| ks4-18 (radicalisation, misogyny) | "Prevent; KCSIE; RSHE (misogyny)" | **para 160**: "misogynistic influencers"; Annex C records "further references to misogyny" added in 2026 |

### What this audit still could not verify

- **The computing national curriculum.** Several modules carry a `Computing` hook. Still unverified.
- **The Online Safety Act and the Children's Wellbeing and Schools Act 2026.** Two modules carry these as hooks. Still unverified. KCSIE 2026's own Annex C refers to "the Children's Wellbeing and Schools **Bill**", so check the commencement position before any page calls it an Act.

---

## 3. Complete statutory coverage matrix

The full matrix is `GDC_SCHOOLS_COVERAGE_MATRIX.csv`, one row per requirement, 65 rows, 15 columns, with the requirement text quoted verbatim from the statutory guidance and a column recording where KCSIE 2026 names the same harm.

*A note for whoever edits that file: the `requirement_text_verbatim` column is quoted government text and contains hyphens (face-to-face, under-age, bi-directional). Leave them. The house rule about dashes governs our copy, not a quotation from a statutory document, and altering quoted text would break the audit trail.*

### Scope and denominator, stated plainly

The July 2025 guidance contains **195 numbered curriculum content items**: 80 primary, 115 secondary. This scheme is a digital literacy and online safety spine, not a whole RSHE scheme, and it should never be measured against all 195.

The honest denominator is the requirements that are digital or online in nature:

- **39 items** sit in the four explicitly online strands: Online safety and awareness (primary, 6), Wellbeing online (primary, 11), Online safety and awareness (secondary, 15), Wellbeing online (secondary, 7).
- **18 further items** in other strands have a substantial digital element (online bullying, privacy, consent and images, grooming, peer influence online, pornography, misogyny).

**57 requirements assessed. This is the number to use in any public claim.**

### The verdicts

| Verdict | Count | Share |
|---|---|---|
| **FULL** | 18 | 32% |
| **PARTIAL** | 28 | 49% |
| **INDIRECT** | 2 | 4% |
| **NONE** | 9 | 16% |

Plus **8 rows** marked NOT A LESSON REQUIREMENT: duties no scheme of work can discharge.

### What FULL, PARTIAL, INDIRECT and NONE mean here

- **FULL:** a named module teaches the requirement substantively, in pupil facing words, with a check that the pupils understood it.
- **PARTIAL:** some of the requirement's named elements are taught and others are absent. Every PARTIAL row in the CSV names exactly which clause is missing.
- **INDIRECT:** the idea is reachable through an adjacent lesson but the requirement's own content is not named.
- **NONE:** no lesson teaches it. Established by word boundary search, and the search is recorded.

### The nine requirements with no coverage

| ID | Requirement (abridged) | Phase | Evidence of absence |
|---|---|---|---|
| RSHE-P-OSA-3 | The minimum age for joining social media sites (currently 13) and why it protects children | Primary | Zero hits for `thirteen`, `aged 13`, `age of 13`, `minimum age`, `age limit`, `age restrict` in EYFS, KS1 or KS2 |
| RSHE-P-WO-5 | Why social media, apps, games and gambling sites are age restricted | Primary | Zero hits for `age restrict`, `age rating`, `age limit`, `age verif`, `PEGI` anywhere in 732 slides |
| RSHE-S-OSA-10 | Technology and social media used in bullying, harassment, stalking, coercive and controlling behaviour | Secondary | Zero secondary hits for `bully`, `harass`, `abuse`, `stalk`, `coercive`, `controlling` |
| RSHE-S-WO-3 | Identify harmful behaviours online (bullying, abuse, harassment), how to report or find support | Secondary | As above |
| RSHE-S-RR-6 | Types of bullying including online bullying, impact, bystander responsibility, where to get help | Secondary | As above |
| RSHE-S-WO-4 | Online gambling and gambling like content within gaming, including accumulation of debt | Secondary | Zero secondary hits for `gambl`, `loot box`, `debt`. The only gambling teaching in the scheme is one KS2 slide |
| RSHE-S-MW-8 | Gambling can lead to serious mental health harms including anxiety, depression and suicide | Secondary | As above |
| RSHE-S-WO-6 | Risks of illegal behaviours online including drug and knife supply | Secondary | Zero hits anywhere for `knife`, `county lines`, `illicit`, drug supply |
| RSHE-S-WO-7 | Content promoting self harm, suicide or violence, how to report it, how to get support after viewing | Secondary | **Zero hits anywhere in 732 slides for `self harm` or `suicide`** |

### Seven of the nine are named by both statutory documents

This is the finding that hardens everything else. The CSV carries a column, `also_named_by_kcsie_2026`, recording where KCSIE 2026 independently names the same harm. **Thirty five of the 57 requirements have a KCSIE anchor. Seven of the nine gaps do.**

| Gap | RSHE requires it | KCSIE 2026 also names it |
|---|---|---|
| Why services are age restricted | Wellbeing online, primary, item 5 | para 165 **commerce**: "risks such as online gambling, inappropriate advertising, phishing and or financial scams" |
| Bullying, harassment, stalking, coercive control | Online safety, secondary, item 10 | para 165 **conduct**: "online bullying"; para 160: "how to recognise and report concerns about an abusive relationship, including coercive and controlling behaviour" |
| Harmful behaviours online and how to report | Wellbeing online, secondary, item 3 | para 160: "the concepts of, and laws relating to all forms of sexual harassment, and abuse, and how to access support" |
| Types of bullying at secondary | Respectful relationships, secondary, item 6 | para 165 **conduct**: "online bullying" |
| Online gambling and gambling like content | Wellbeing online, secondary, item 4 | para 165 **commerce**: "risks such as online gambling" |
| Gambling and mental health harms | Mental wellbeing, secondary, item 8 | para 165 **commerce**: "risks such as online gambling" |
| Self harm, suicide and violent content | Wellbeing online, secondary, item 7 | para 165 **content**: "self-harm, suicide, extreme sexual or physical violence" |

A gap named by one statutory document is a curriculum gap. A gap named by the curriculum guidance **and** the safeguarding guidance is the kind a DSL notices.

### The pattern behind the gaps

Seven of the nine missing requirements are secondary, and four of those seven are taught well at KS2 and then dropped. **Bullying, gambling, and the mechanics of loot boxes all end at Year 6.** A school buying the secondary scheme is buying a scheme with no bullying content in it, and both statutory documents name bullying at secondary.

### Three places where the current matrix marks coverage that the lessons do not deliver

These are the ones that would embarrass the product in front of a PSHE lead who checks.

1. **Online gambling.** `RSHE_2025_TOPICS` carries a `gambling` key labelled "Online gambling and gambling style mechanics", and the mapping page names online gambling as one of the newly named topics the matrix covers. The word `gambl` appears in **one slide in the entire scheme** (ks2-05 slide 19), and it is a good slide, but it is KS2 and it is about loot boxes. There is no secondary gambling content.
2. **Conspiracy theories.** The Hub's KCSIE table has a row for conspiracy theories pointing at ks3-12 and ks4-18. The word `conspiracy` appears twice in the whole scheme, in ks3-10 ("Follow the evidence, not the conspiracy") and ks4-15 ("This is not a conspiracy, it is a business model"). **Both are figures of speech, and neither is in a module the table names.**
3. **Self harm.** The pricing page tells buyers that scripts mean a teacher is "not improvising about consent or self harm at nine on a Monday". There is no self harm content in the scheme. Consent is taught in full at ks4-16. Self harm is not taught at all.

### Where the scheme is genuinely strong

Eighteen FULL verdicts, and several of them are better than the requirement asks for:

- **Deepfakes and AI content** (ks3-12): 33 slides, a sourced detection study, and identification taught as a skill rather than a warning.
- **Images, consent and the law** (ks4-16): 38 slides across the scheme touch the law; Report Remove is taught by name in 15 slides, described accurately as free and confidential, with the line that a pupil will not be in trouble for asking for help. **NCMEC's Take It Down is also named**, which the UKCIS nudes advice recommends and which most schemes miss. CEOP and the National Crime Agency appear in 11 slides across ks4-17 and ks4-18.
- **Sextortion** (ks4-17): the script, the countdown, the order to tell nobody, and three lifelines. This is a hard topic handled calmly.
- **Scams and fraud** (ks3-13): fraud taught as a criminal offence rather than bad luck.
- **AI companions** (ks2-23, ks3-22) and **cognitive offloading** (ks3-24, ks2-25): these are ahead of the statutory requirement, which only asks that pupils know AI chatbots can create fake intimacy or give harmful advice. The scheme teaches the mechanism.
- **The trusted adult route** from Reception: "feel it, name it, tell a grown up" and "you are never in trouble for telling" is taught, repeated and tested.

---

## 4. Reception to Year 13 progression audit

Twenty five modules distributed as: EYFS 1, KS1 2, KS2 7, KS3 6, KS4 5, KS5 2.

### Strand by strand

| Strand | Introduced | Practised | Expanded | Applied independently | Verdict |
|---|---|---|---|---|---|
| Trusted adults and help seeking | eyfs-01 | ks1-02 | ks2-08 | ks4-17 (lifelines), ks4-16 (Report Remove) | **Strong**, though the language changes register sharply at KS3 with no bridge |
| Source evaluation | eyfs-01 ("is this real?") | ks1-03 | ks3-12 | ks5-20 | **Strong** |
| Healthy device habits, sleep and balance | ks1-02 | ks2-04 | ks3-10 | none | **Stops at KS3.** Nothing at KS4 or KS5 |
| Algorithms and persuasive design | ks2-06 | ks3-10 | ks4-15 | ks5-20 | **Strong, the best spiral in the scheme** |
| Privacy and online identity | ks2-07 | none | ks4-19 (defaults) | ks5-21 | **Weak.** One primary module, nothing at KS1 or KS3 |
| Misinformation | ks1-03 | ks3-12 | ks4-15 | ks5-20 | **Good**, but a four year gap between KS1 and KS3 |
| Deepfakes | ks1-03 (foundation) | ks3-12 | none | none | Taught once properly |
| Cyberbullying | ks2-08 | none | none | none | **Taught once and never again.** Statutory at secondary |
| Scams and money | ks2-05 | ks3-13 | ks4-17 | none | **Good** |
| Gambling mechanics | ks2-05 | none | none | none | **Taught once, at primary only.** Statutory at secondary |
| Social media | none at primary | ks3-11 | ks4-19 | none | **Starts too late.** The statutory age 13 content belongs at KS2 |
| Sexual content and images | ks3-14 | ks4-16 | ks4-17 | none | **Good** |
| Grooming and exploitation | ks2-07 (implicit) | ks4-17 | ks4-18 | none | **Gap at KS3** |
| AI and chatbots | ks2-23 | ks3-22, ks3-24 | ks5-20 | ks5-21 | **Strong**, but **no AI module at KS4 at all** |
| Digital citizenship, copyright and ownership | ks2-09 | ks2-25 | none | none | **Dies at Year 6** |
| Relationships online | ks1-02 | ks2-08 | ks3-22 (with a machine) | none | **Weak at secondary** for human relationships |
| Harmful and upsetting content | eyfs-01 | ks2-08 | ks4-18 | none | **Patchy**, and self harm content is absent entirely |

### Flags the user asked for specifically

- **Unnecessary repetition:** none found. The scheme is unusually disciplined about this. If anything it under repeats.
- **Age inappropriate material:** none found. ks3-14 handles pornography at KS3 with the calm register the guidance asks for, and explicitly tells pupils they are not in trouble.
- **Missing progression:** cyberbullying, gambling and copyright all terminate at Year 6. Sleep and balance terminates at Year 9.
- **Concepts introduced too late:** the minimum age of 13 and why services are age restricted. Both are primary statutory requirements and neither is taught at all, at any stage.
- **Concepts introduced too early:** none found.
- **The primary to secondary gap:** this is the biggest structural weakness. Three KS2 strands do not cross into KS3.
- **Statutory outcomes taught once and never reinforced:** deepfakes, gambling, copyright, cyberbullying.
- **Thin stages:** Reception has one lesson for a year. KS1 has two for two years. KS5 has two for two years. KS2 carries seven. A primary school buying this gets a rich Years 3 to 6 and a very light Reception to Year 2.

---

## 5. Lesson quality audit

### Teacher usability: strong, and the strongest part of the product

Pressing one button (`/teach/[module]`) gives a teacher: what they are teaching, why, the preparation list, the duration, the learning objective, every slide, a word for word script on every slide, the questions, the activity, the assessment, the safeguarding note where one applies, and what goes home. The print room (`/print/[module]`) generates the pack, pupil booklet, organiser, starter quiz, exit quiz, overview and learning record.

Every lesson has a complete paper fallback. No pupil devices are needed. A non specialist can teach any module cold.

**Unnecessary workload found:** none. This is a genuine strength and it should be sold harder than the compliance story.

### The one instrumentation defect

Twenty three of 25 modules carry the full assessment block: `action_commitment`, `exit_quiz`, `in_lesson_checks`, `retrieval_starter`, `teacher_judgement`.

**Two do not.** `ks2-25-stay-the-maker` and `ks3-24-is-it-doing-my-thinking` carry only `exit_quiz` and `retrieval_starter`. They are missing the action commitment, the in lesson checks and the teacher judgement descriptor.

This matters commercially as well as educationally: **ks3-24 is one of the two lessons in the secondary pilot set.** A pilot school's first secondary lesson is one of the two weakest instrumented modules in the scheme.

### Pupil experience: strong

Age appropriateness, clarity and register are good throughout. Interactivity is real (choice slides with per option feedback, discussion prompts with `lookFor` guidance for the teacher, sort activities, paper tasks). Every video beat has an accessible alternative. Fear based messaging is consistently avoided: ks2-05 says "You are not silly for wanting the prize. The whole machine is built by experts", ks3-14 says pupils who have seen pornography are "not unusual and not in trouble", ks4-15 says "Feeling immune is the most exploitable state there is".

**SEND and EAL:** teacher notes name the words to pre teach for each module and several say the lesson "survives in any language once [the core word] is solid". Scaffolds exist per module. This is better than most schemes and is not currently claimed anywhere on the site.

### Educational quality: the recognise, understand, practise, decide, seek help, apply arc is real

The scheme does not tell children rules. Every module runs the Rosenshine arc (connect, starter, teach, practise, prove, close) and every module ends in a single action outcome written in the child's voice ("I can decide what not to share", "I can name the technique being used on me").

**Where an activity would improve learning:** the nine NONE requirements are all places where content is missing rather than where an activity is missing. The pedagogy is not the problem.

---

## 6. GDC philosophy check

The curriculum holds the philosophy. This is not a generic online safety scheme wearing our branding.

| Principle | Evidence |
|---|---|
| Age staged preparation | Reception to Year 13, one action outcome per module, each written for the age |
| Trusted adult relationships | Taught from Reception, repeated, tested, and never framed as telling tales |
| Capability rather than fear | ks2-05: "You are not silly for wanting the prize." ks3-10 refuses the moral panic and teaches the actual research position |
| Preparation rather than delay | ks4-19 is literally a lesson on planning for full access when it arrives. ks3-11 teaches why the real age keeps protections on, rather than banning the workaround |
| Balance rather than screen time counting | ks3-10 teaches that raw hours barely predict wellbeing and replaces counting with the mood audit |
| Algorithm and media literacy | ks2-06 to ks4-15 to ks5-20, the strongest spiral in the scheme |
| Gradual independence | The single action outcomes escalate from "ask a grown up" to "defend where I checked its work" |
| Real world rehearsal | Scenario slides, verdict sorts, paper practice in every module |
| Safeguarding without blaming the child | ks4-17: "it is not my fault" is the module's stated outcome. ks4-16 teaches that a pupil will not be in trouble for asking for help |
| A delay is not preparation | ks4-19 is built on exactly this sentence |

**One philosophical inconsistency worth naming.** The scheme is deliberately ban neutral, but it does not teach the age 13 minimum, and one reason may be discomfort with anything that sounds like a rule. That is a mistake. The guidance requires it, and it can be taught the GDC way: not "you are banned until 13" but "here is what the rule is protecting, and here is what switches off when you get round it". ks3-11 already does exactly this at KS3. The same move belongs at KS2.

---

## 7. Digital Passport audit

### What is actually wired

- Four areas (`safe`, `balance`, `ai`, `social`) mirrored from the parents app, with a CI guard (`scripts/check-passport-areas.mjs`) that fails if the two sides drift.
- Every module is assigned exactly one area by hand, with a guard that every module has one.
- Every lesson has a passport beat (migration 297). The class taps "fill the page" on the wall.
- `PassportPage.tsx` draws the same page everywhere: in the lesson, on the prep card, in the print room, on `/hub/passport`.
- The finish screen shows the filled page and the home code, which carries the learning into the child's own passport in the parents app.

### What it does not do, and this must be understood before it is sold

The schools side record of "which pages this screen has filled" lives in **`localStorage` on the classroom device**. From `shared/schools-taught.ts`:

> "It is a fact about a screen in a classroom, the way a wall display is. It names no child, it is never sent anywhere, and clearing the browser clears it. The same module tapped twice unfills."

Therefore:

- **Lesson completion does not update a per pupil Passport.** There is no per pupil Passport on the school side, by design, because the schools app holds no pupil data and the DPA is written on that promise.
- The device memory is not evidence of delivery. A teacher on a different laptop sees an empty Hub. Clearing the browser clears the record.
- The real evidence of progression in school is **the printed learning record in the child's book**, and that is a good answer, but it is paper and it is not in the platform.

### Does it demonstrate capability rather than attendance?

The printed page does: it carries what the child can now do, in the child's voice, and it is filled as an act at the end of the lesson rather than awarded for turning up. The device memory does not: it records that a page was filled on this screen, which is closer to attendance.

**No Passport wiring should be changed.** The design is coherent and the privacy promise is worth more than the dashboard would be. What must change is how it is described.

---

## 8. Compliance and evidence dashboard audit

### What the platform could truthfully show a school today

| The dashboard would want to show | Can it, truthfully? |
|---|---|
| What curriculum outcomes are relevant | **Not yet.** The ten topic list is not the guidance's structure. The CSV produced by this audit is the first version of a real answer |
| Where each is taught | **Yes, once the mapping is rebuilt** on the 57 requirements rather than the 10 topics |
| Which year group receives it | **Yes.** Key stage and year band are on every module row |
| Whether it has been delivered | **No.** The platform holds no delivery state. The only signal is device local |
| Evidence of delivery | **No, and deliberately so.** The evidence is the paper in the child's book and the school's own systems |
| Gaps still outstanding | **Yes, once the mapping is rebuilt.** This audit has computed them |
| Last reviewed date | **No.** Nothing on any Hub page carries a reviewed date |
| Source and guidance version | **Partly.** The mapping page names July 2025 but the document version is not stored as data |

### The conceptual design

```
CURRICULUM COVERAGE
Digital and online requirements, RSHE statutory guidance July 2025

  FULL      18
  PARTIAL   28
  INDIRECT   2
  NONE       9
            ──
            57 requirements assessed

  Source: DfE RSHE statutory guidance, July 2025, in force 1 September 2026
  Mapping last reviewed: [date]   Reviewed by: [name]
```

Clicking a requirement opens:

```
Requirement   verbatim text from the guidance, with its strand and item number
Taught in     module id, title, key stage, year band
Objective     the module's single action outcome
Activity      the slides and the check that test it
Delivery      recorded in your school's own systems (this platform holds no pupil data)
```

**Per the instruction in the brief, no percentages or scores should be implemented until the underlying mapping is verified.** The counts above are now verified for the 57 rows in the CSV, but the CSV is a first pass by one auditor and should be read by a PSHE lead before it drives a customer facing number.

### The second panel, which matters as much as the first

```
SCHOOL RESPONSIBILITIES OUTSIDE GUIDED CHILDHOOD LESSONS

  Safeguarding policy and child protection procedures      your school
  DSL and deputy arrangements, training and cover          your school
  Staff safeguarding training and KCSIE Part one reading   your school
  Filtering and monitoring, reviewed at least annually     your school
  Incident response and recording                          your school
  RSE policy, parent consultation and publication          your school (we supply model text)
  DPIA                                                     your school (we supply the processing description)
  Governor assurance and judgement of quality              your governing body
```

Eight rows in the CSV are marked NOT A LESSON REQUIREMENT and map directly onto this panel. `hub/faq` already carries the best sentence on the site, and it should be promoted rather than buried: **"No product can make a school compliant, and we will not pretend otherwise."**

---

## 9. Free lesson and pilot audit

### The journey as built

The public taster is `TASTER_MODULES = ['ks3-12-misinfo-deepfakes']`, one module, open without a code, reachable through `/draw` and the taster bar. A pilot code opens two phase matched lessons plus the Hub:

| Phase | Pilot lessons |
|---|---|
| primary | ks1-03-real-pretend-computer, ks2-06-how-algorithms-work |
| secondary | ks3-24-is-it-doing-my-thinking, ks4-15-manipulation-persuasion |
| post16 | ks4-19-readiness-at-16, ks5-20-ai-mastery-data-rights |

### Does the free lesson demonstrate the strongest aspects of the product?

Partly. ks3-12 is the best built module in the scheme: 33 slides, six animated beats, sourced statistics, the Instagram style photo the video points at, and a topic that is unambiguously on the statutory list.

**But it is a Year 7 to 9 lesson, and it is the only free lesson.** A primary school, which is where seven of the 25 modules sit and where most first conversations will come from, arrives at the site and can only open a KS3 lesson. They cannot see the DiGi Squad at the age their children are.

It also does not demonstrate: age staging (one lesson cannot), the Passport (the taster is one module so the page fills once with nothing around it), or the curriculum mapping (behind the code door).

### Recommendation

**Do not build a separate free pilot programme.** Add one primary module to `TASTER_MODULES`. The right choice is **ks2-06-how-algorithms-work**: it is already the primary pilot lesson, it is the start of the strongest spiral in the scheme, it has a DiGi video beat, it carries no DSL note, and "why does my feed keep me watching" is the question primary parents and teachers ask most. That is a one line change to `lib/taster.ts` plus whatever the taster bar needs to name two modules.

---

## 10. Commercial claim audit

Every school facing claim, classified.

### DO NOT CLAIM (fix before the pilot opens)

| Claim | Where | Why |
|---|---|---|
| "every module is mapped to it **line by line**" | `schools/app/page.tsx`, public FAQ | The mapping is to a ten topic list, not to the guidance's 195 numbered items. "Line by line" describes something that does not exist |
| "the taught curriculum mapped to **every relevant requirement**" | `schools/app/hub/faq/page.tsx` | 9 of 57 relevant requirements are not taught at all |
| "One row per **statutory outcome**, the module that covers it" | `schools/app/pricing/page.tsx` | The year plan does not have one row per statutory outcome. It has modules by term |
| Online gambling listed among the topics the matrix covers | `RSHE_2025_TOPICS`, mapping page | One KS2 slide. No secondary content |
| Conspiracy theories mapped to ks3-12 and ks4-18 | Hub KCSIE table | The word appears twice in the scheme, in neither of those modules, and both uses are figures of speech |
| "not improvising about consent or **self harm** at nine on a Monday" | `schools/app/pricing/page.tsx` | There is no self harm content in the scheme |
| "The mapping matrix shows **exactly** which statutory topics it covers" | `hub/faq` | It shows which of ten chosen themes it covers |

### NEEDS QUALIFICATION

| Claim | Where | Suggested fix |
|---|---|---|
| "published on 15 July 2025" | mapping page | **The only provenance point still open.** Cite the GOV.UK page, or write "July 2025". Neither document body gives the day |
| "KCSIE 2026 now names generative AI, deepfakes, misinformation, disinformation and conspiracy theories **alongside** the four Cs" | mapping page | **Now verified, with two wording fixes.** All five are in KCSIE 2026, but they sit **inside** the four areas of risk (para 165), not alongside them, and deepfakes are in para 160 and the definitions rather than para 165. The fourth C is **commerce** |
| "mapped to the statutory RSHE guidance, KCSIE 2026 and all eight Education for a Connected World strands" | home, curriculum | The EfCW half is **true and verified** (the union of `efcw_strands` across the manifest is exactly {1..8}). The KCSIE half is now defensible per module for five modules (see section 2). The RSHE half needs the mapping rebuilt first |
| "Statutory ground: [hooks]" per module | `hub/dsl` | Five hooks are now verified by paragraph. The rest are free text prose, not a controlled mapping. Either cite the paragraph or say "the anchors this lesson was written against" |
| "What evidence does it give us for Ofsted?" | `hub/faq` | The answer is good and honest already. Add that delivery is not recorded in the platform, which the answer nearly says |

### SAFE TO CLAIM (supported today)

- "No product can make a school compliant, and we will not pretend otherwise." **This is the best sentence on the site.**
- "The guidance becomes compulsory on 1 September 2026." **Now verified**, citing KCSIE 2026 para 159, which calls the RSHE guidance "revised for introduction September 2026".
- "{N} modules, Reception to Year 13" with N computed from the manifest.
- "Covers all eight Education for a Connected World strands." **Verified.**
- "No pupil logins, no pupil names, no tracking, no profiling, no advertising." Verified in code: the schools app holds no pupil data, no teacher accounts and no session.
- "Every slide carries a word for word script, so a non specialist can teach any module." Verified.
- "Every lesson has a complete paper fallback." Verified: the print room generates seven artefacts per module.
- "One projector teaches the whole lesson. No pupil devices." Verified.
- "Parents can see every lesson, and our licence permits it." Verified.
- "{N} modules are safeguarding flagged, each with a DSL note and a staff briefing." Verified.
- "It is the digital literacy and online safety spine, designed to sit inside your wider PSHE provision, not to replace it." True and important: say it louder.

### Words to police

No page claims DfE approval, Ofsted approval, accreditation or endorsement. **That is clean and must stay clean.** The word "evidence based" does not appear as a blanket claim; individual statistics carry named sources. Keep that discipline.

---

## 11. Critical gaps, ranked

1. **The ten topic list is not the guidance.** Everything compliance facing renders from `RSHE_2025_TOPICS`. Until it is rebuilt on the real strands and items, every downstream page is approximate. *Statutory, critical.*
2. **Self harm and suicide content: zero, and the pricing page implies otherwise.** *Statutory and safeguarding.*
3. **Bullying, harassment and abuse at secondary: zero.** Three separate statutory requirements. *Statutory.*
4. **Online gambling at secondary: zero, and it is listed as covered.** Two statutory requirements. *Statutory and claim risk.*
5. **The minimum age of 13, and why services are age restricted: zero anywhere.** Two primary statutory requirements. *Statutory.*
6. **"Line by line" and "every relevant requirement" on public pages.** *Commercial risk, one hour to fix.*
7. **Conspiracy theories mapped to modules that do not teach it.** A PSHE lead who checks will find this. *Claim risk.*
8. **ks2-25 and ks3-24 have incomplete assessment blocks, and ks3-24 is in the secondary pilot set.** *Educational quality and pilot risk.*
9. **Only a KS3 lesson is free.** Primary schools cannot see the product at their own age. *Commercial.*
10. **No reviewed date or guidance version anywhere in the Hub.** An inspection file needs both. *Evidence quality.*

Three more worth naming below the line: illegal supply online (statutory, zero); privacy and location settings as settings rather than judgement (statutory at both phases, one slide); and the two missing clauses inside ks4-16, which are **the cheapest high value fix in the whole scheme**. That module already teaches the image law well. What it does not say is that the offence covers imagery created using AI, and that sharing indecent images of people over 18 without consent is also a crime. Both are confirmed absent by query. Both are named by the RSHE guidance and by KCSIE 2026 (para 165 conduct, and the definitions section on deepfakes and deep nudes). Two slides in a module that is already strong.

---

## 12. Minimum fixes before the pilot opens

Kept deliberately small. None of these touches a lesson's teaching.

1. **Correct the seven DO NOT CLAIM sentences.** Copy only. No lessons, no database, no wiring. Half a day.
2. **Replace `RSHE_2025_TOPICS` with the real mapping.** Use the 57 rows in `GDC_SCHOOLS_COVERAGE_MATRIX.csv` as the data source. The matrix page keeps its layout and its honesty note, and starts telling the truth, including the nine gaps. Two to three days.
3. **Show the gaps rather than hiding them.** A matrix that says "these nine requirements are not covered by this scheme, and here is where they sit in your wider PSHE provision" is a stronger sales document than one that implies total coverage. It is also the only version that survives contact with a PSHE lead.
4. **Fix the two incomplete assessment blocks** (ks2-25, ks3-24) so every module carries the same five part contract. One migration.
5. **Add ks2-06 to the taster** so a primary school can see a primary lesson. One line.
6. **Add a reviewed date and a source version** to the mapping page. One hour.
7. **Correct the KCSIE sentence's two wording errors.** ~~Someone needs to read KCSIE 2026.~~ Done: the document has been read and the claim is verified. What remains is one sentence saying the five risks are named **inside** the four areas rather than alongside them, that the fourth C is **commerce**, and that deepfakes come from para 160.

**Not on this list, deliberately:** writing the missing lessons. A pilot can open with a mapping that names its gaps honestly. It cannot open with a mapping that claims coverage it does not have.

---

## 13. After the pilot

0. **Two slides inside ks4-16**, closing the AI generated imagery clause and the over 18 without consent clause. This is small enough to do before the pilot if there is an hour spare, and it is the highest value per slide in the scheme.
1. **A secondary bullying, harassment and coercive control module** at KS3. This closes three statutory requirements and the biggest progression break in the scheme, and KCSIE 2026 names online bullying under conduct and coercive control in para 160.
2. **A secondary gambling module**, or a gambling strand inside an existing KS4 module. Closes two requirements.
3. **The age 13 content at KS2**, taught the GDC way: what the rule protects, what switches off when you get round it. ks3-11 already has the pattern.
4. **Self harm and suicide content**, which needs care, a clinical read and a DSL note before it is written.
5. **Privacy and location settings as settings**, not just as judgement, at KS2 and KS3.
6. **Sleep and balance at KS4 and KS5**, where the strand currently dies.
7. **Copyright and ownership at secondary**, where the strand currently dies.
8. **Search engines and how results are selected**, a primary requirement currently met only through the algorithms module.
9. **A KS4 AI module.** The scheme has AI at KS2, KS3 and KS5, and nothing at KS4.
10. **Reception and KS1 depth.** One lesson a year is thin for a school paying an annual licence.

---

## 14. Exactly what can be said to a head teacher or DSL today

> Guided Childhood Schools is a digital literacy and online safety scheme of work for Reception to Year 13. Twenty five modules, taught from a projector with a word for word script on every slide, so a non specialist can teach any lesson cold. Every lesson has a complete paper version, and no pupil devices are needed.
>
> It is the online safety spine that sits inside your PSHE provision. It is not a whole RSHE scheme and it does not pretend to be.
>
> We have mapped it against the digital and online requirements of the July 2025 RSHE statutory guidance, which comes into force this September. Of the fifty seven requirements that a scheme like this could be expected to teach, we teach eighteen in full and twenty eight in part, and there are nine we do not cover at all. The matrix names every one of them, including the gaps, so you know before you buy which ones stay with your wider scheme.
>
> The platform holds no pupil data. No accounts, no names, no logins, no tracking, no profiling. Your school signs in with one code. The record of learning is the printed page in the child's book, which stays in school. That means delivery is recorded in your systems, exactly as it is for your other subjects, because we hold nothing to record it against.
>
> Thirteen of the twenty five modules carry a safeguarding flag. Each one has a DSL note, disclosure handling written into the script, and a ten minute staff briefing.
>
> No product can make your school compliant, and we will not pretend otherwise. Your policies, your parent consultation, your filtering and monitoring, your safeguarding systems and your judgement of quality remain yours.

*(Thirteen verified against `FLAGGED_MODULES` in `shared/schools-curriculum.ts`. Re check it if the manifest changes.)*

---

## 15. Exactly what should not be said yet

Do not say, in these words or any close variant:

- "Every module is mapped to the guidance **line by line**."
- "Mapped to **every relevant requirement**."
- "**Full** statutory coverage" / "**complete** coverage" / "covers **everything** the guidance requires."
- "One row per **statutory outcome**."
- "**Compliant** with the new RSHE guidance" (say "mapped against", never "compliant with").
- "We cover **online gambling**." (One KS2 slide.)
- "We teach **conspiracy theories**." (We do not.)
- "Teachers are not improvising about **self harm**." (There is no self harm content.)
- "The matrix shows **exactly** which statutory topics it covers."
- Anything implying **DfE or Ofsted approval, endorsement or accreditation**. Nothing on the site does this today. Keep it that way.
- "Meets **KCSIE**" or "satisfies your safeguarding duties." KCSIE duties are not teaching duties and no lesson discharges them.
- Any percentage or score until a PSHE lead has read the CSV.

---

## 16. Recommended implementation sequence

Nothing below has been started. This is a proposal awaiting approval.

**Step 1, copy only (half a day, zero risk).** Correct the seven DO NOT CLAIM sentences. Fix the two provenance statements. Promote the "no product can make a school compliant" line. No lessons, no database, no components touched.

**Step 2, the mapping data (two to three days).** Turn `GDC_SCHOOLS_COVERAGE_MATRIX.csv` into the source of truth: a new module beside `RSHE_2025_TOPICS` holding the 57 requirements with their strand, item number, verbatim text, verdict and evidence. Keep `RSHE_2025_TOPICS` exported until nothing imports it, so nothing breaks mid change. Add a guard that fails if a requirement loses its evidence or a module id in the mapping no longer exists.

**Step 3, the matrix page (one day).** Same layout, same honesty note, real data. Add the gap section. Add the reviewed date and source version. The page already renders from the manifest, so this is a data swap rather than a redesign.

**Step 4, the two small fixes (half a day).** One migration for the ks2-25 and ks3-24 assessment blocks. One line for the primary taster. Both guarded by the existing checks.

**Step 5, verify (half a day).** Run every guard by exit code, typecheck, and render the changed pages at 390 and 1440 in Chrome DevTools before declaring anything done.

**Step 6, done.** KCSIE 2026 has been obtained and read. The mapping page's KCSIE claim is verified and needs only the two wording corrections in section 10. The one outstanding source is the computing national curriculum, which matters for the `Computing` hooks on four modules and can be checked after the pilot opens.

**Then, and only then, the pilot opens.** Lesson writing for the nine gaps is post pilot work and should be sequenced by the ranking in section 13.

---

## Final report, A to G

**A. What exists now.** Twenty five modules, Reception to Year 13, 732 slides of real classroom content in production. A projector player with a word for word script on every slide. Seven printables per module. Thirteen Hub pages covering policy, DSL, CPD, data protection, parents, accessibility, vocabulary, year plan, passport, tracker, induction, FAQ and AI governance. A code door that fails closed, a public taster, and a phase matched pilot set. No pupil data anywhere. A Digital Passport mirrored from the parents app with a CI guard holding the two sides together.

**B. What genuinely satisfies the requirements.** Eighteen statutory requirements are fully covered, and several are taught better than the guidance asks: deepfakes, images and the law, Report Remove, sextortion, scams and fraud, algorithms and persuasive design, AI companions, cognitive offloading, and the trusted adult route from Reception. All eight Education for a Connected World strands are covered, and that claim is verified.

**C. What is partially covered.** Twenty eight requirements. In almost every case the scheme teaches the judgement and misses a named clause: privacy settings as settings, public versus private spaces, the AI generated imagery clause in the image law, pornography's effect on behaviour, conspiracy theories, search engines, data rights as rights. Every one is named in the CSV.

**D. What is missing.** Nine requirements with no coverage: the age 13 minimum, why services are age restricted, bullying and harassment and coercive control at secondary (three requirements), online gambling at secondary (two requirements), illegal supply online, and content promoting self harm or suicide. Seven of the nine are secondary, four are strands taught well at KS2 that then stop, and **seven of the nine are named by KCSIE 2026 as well as by the RSHE guidance**, which is the difference between a curriculum gap and one a DSL will ask about.

**E. What cannot be solved by lessons.** Eight duties, in the CSV and in section 8: the safeguarding policy, DSL arrangements, staff training and KCSIE reading, filtering and monitoring, incident recording, the RSE policy and parent consultation, the DPIA, and governor assurance. No scheme of work touches any of them, and the Hub should show them on the same screen as the coverage so the line is never blurred.

**F. Minimum changes before the pilot.** Seven items in section 12. Realistically two to four days of work, and the first half day is copy corrections that carry no technical risk at all.

**G. Is it ready to sell to pilot schools?**

**The classroom product: yes.** It is strong, it is differentiated, and the teacher usability is better than most of what schools buy. I would put any of the eighteen FULL modules in front of a head teacher tomorrow.

**The compliance wrapper: not yet, and it is a one week fix rather than a rebuild.** The gap is not the teaching. It is that the mapping is built on a ten topic list nobody checked against the document, and the public claims are written as though the mapping were exhaustive. A PSHE lead who opens the guidance next to the matrix will find the mismatch in about ten minutes, and that is the worst possible moment for them to find it.

Fix the claims, rebuild the mapping on the fifty seven requirements, show the nine gaps honestly, and the product is ready. A scheme that names what it does not cover is more credible than one that implies it covers everything, and it is the only version that is true.

---

*Audited against production data on 19 September 2026. No application code, database content, route, component or wiring was changed. Awaiting approval before any implementation.*
