<!--
Lane file of the UK school resources sweep, 17 September 2026.
READ research/uk-school-resources/README.md FIRST. Nothing in this file has been
verified against a primary source: every page fetch in the session that produced
it was refused by the network egress policy, so all of it rests on the search
result layer. No line here is a verbatim quotation of a statutory document, and
no figure here may enter parent facing copy until the verification queue in the
README has been worked.
-->

# Little Wandle Letters and Sounds Revised: structural analysis of the parent facing material

Research date: 17 September 2026. Lane: architecture and genre, not content.
Purpose: understand how a validated phonics scheme sequences parent facing
material across a school year, establish exactly what they claim ownership of,
and identify the public statutory material we may legally build on.

---

## 0. EVIDENCE WARNING, READ THIS FIRST

This is the honest part, and it changes how you should use everything below.

**I could not fetch a single page.** Every direct fetch in this session was
refused by the organisation network egress proxy. The exact error, repeated for
every attempt:

> `{"error_type":"EGRESS_BLOCKED","domain":"www.littlewandlelettersandsounds.org.uk","message":"Access to www.littlewandlelettersandsounds.org.uk is blocked by the network egress proxy."}`

Hosts I attempted and was refused: `www.littlewandlelettersandsounds.org.uk`,
`littlewandlelettersandsounds.org.uk`, `www.littlewandle.org.uk`,
`collins.co.uk`, and as a control `en.wikipedia.org` and `example.com`. Command
line requests returned nothing at all for every host tested. The block is
blanket, not specific to Little Wandle, so this is not the site refusing us. The
proxy README is explicit that a policy denial must be reported rather than
routed around, so I did not attempt any mirror, cache or proxy service, and I
did not go near any login or download gate.

**What that means for this document.** The only working channel was web search,
which returns page titles, URLs and index derived summaries. So:

- **URLs below are real and were returned by search**, but I did not open them.
  Treat them as verified to exist, not verified as to content.
- **Descriptions of the parent material are index derived**, meaning they come
  from the search provider's rendering of those pages, not from my reading of
  them. They are consistent across many independent searches and corroborated by
  dozens of UK school websites describing the same scheme, which is reasonable
  evidence, but it is second hand.
- **Section 4, the terms of use, has a genuine gap, and I have flagged it rather
  than filled it.** I will not present a paraphrase as a quotation on the one
  question where you might make a legal decision on my wording.

Anything I could not stand behind is marked `[UNVERIFIED]` or `[GAP]`. Sections 5
to 7 are the least affected: the statutory material is well documented and
section 7 is our own thinking.

**To close the gaps, one of these:** re-run this brief from a session with normal
web access, or open the four URLs in section 4 yourself and paste the text back.
Section 4 needs about five minutes of your time and nothing else.

---

## 1. Site structure

### 1.1 Two domains, one site

The scheme runs on two hostnames that appear to serve the same site, with
matching page titles and matching paths:

- `https://www.littlewandlelettersandsounds.org.uk/`
- `https://www.littlewandle.org.uk/`

The same page exists at both, for example `/resources/for-parents/` resolves on
each. The short domain looks like the newer primary and the long one like the
original, kept alive because several thousand school websites link to it.
`[UNVERIFIED]` which is canonical.

A third hostname appeared in search results,
`https://wpe.littlewandlelettersandsounds.org.uk/resources/for-parents/`. The
`wpe` prefix is the conventional WP Engine preview host, so this looks like a
staging environment that has been indexed by accident. It tells us the site is
WordPress. I did not open it. Incidental finding, not our business, but it is
the kind of thing worth knowing exists before you assume a competitor's site is
tightly run.

An old sibling domain also carries their PDFs:
`https://www.lettersandsounds.org.uk/` with page title "Home - Letters and
Sounds". Note carefully that "Letters and Sounds" is the name of the original
2007 Department for Education programme, which is public material, and Little
Wandle's product name is "Little Wandle Letters and Sounds Revised". The shared
name is doing a lot of quiet work for them. More on this in section 5.

### 1.2 Top level sections

Reconstructed from observed URL paths. All confirmed to exist by search, none
opened.

| Section | Path | What it holds |
| --- | --- | --- |
| Home | `/` | Positioning. Page title observed: "Letters and Sounds \| A complete Phonics resource to support children" |
| What's included | `/whats-included/` | The product contents, sold to schools |
| Resources | `/resources/` | The download library, the parent area sits inside it |
| Everybody read! | `/everybody-read/` | A reading for pleasure strand with its own downloads and parent workshop material |
| Membership | `/membership/` | Plans and pricing |
| Join now | `/join-now/` | Conversion |
| Help centre | `https://faqs.littlewandlelettersandsounds.org.uk/` | A separate HubSpot style knowledge base |
| Terms and conditions | `/terms-conditions/` | See section 4 |
| Privacy policy | `/privacy-policy/` | |
| Content restricted | `/content-restricted/` | The gate page a non member lands on |

Sub pages observed under What's included:

- `/whats-included/getting-started/`
- `/whats-included/support-for-parents/`
- `/whats-included/support-for-reading/`
- `/whats-included/foundations/` (nursery and pre school)
- `/whats-included/whole-school-cpd/`

Product pages observed under Membership:

- `/membership/pricing/`
- `/product/membership-uk-school/`
- `/product/membership-fluency/`
- `/product/membership-itt-provider/`

### 1.3 The architectural point worth stealing

The existence of a page titled **"Content restricted"** at
`/content-restricted/` tells you the whole commercial design in one URL. This is
a **two tier site**:

- **Tier one, public.** The parent area. Free, no login, deliberately
  linkable, because the buyer is the school and the parent area is what makes
  the school look organised to its own families. It is a sales asset dressed as
  a service.
- **Tier two, gated.** Everything a teacher needs to actually run the scheme:
  planning, assessment, CPD modules, the full progression detail. Behind school
  membership.

The parent material is therefore **not the product**. It is the product's
shop window and its retention mechanism, aimed at the school's relationship with
its parents rather than at the parent directly. Every piece is described in their
own copy as something for schools to **signpost**, **share** or **send home**.
One index derived line makes the intent plain:

> Videos and resources in the For parents area have been specifically designed
> to support Little Wandle schools to introduce important concepts to families
> and to answer their FAQs.

`[UNVERIFIED]` as an exact quotation, index derived from
`https://www.littlewandle.org.uk/whats-included/support-for-parents/`.

**Why this matters to us.** Our position is the inverse. We sell to the parent
directly, so our equivalent material cannot be a shop window, it has to be the
thing itself. That single difference drives every choice in section 7.

### 1.4 Every URL found that is aimed at parents

Parent facing, public tier:

1. `https://www.littlewandle.org.uk/resources/for-parents/`
   and the same page at
   `https://www.littlewandlelettersandsounds.org.uk/resources/for-parents/`
   The main parent hub. Page title observed: "For parents \| Letters and Sounds"
2. `https://www.littlewandle.org.uk/everybody-read/parent-workshop-resources/`
   Page title observed: "Parent workshops \| Letters and Sounds"
3. `https://www.littlewandle.org.uk/everybody-read/section/downloads/`
   Page title observed: "Everybody Read Category: Downloads \| Letters and Sounds"
4. `https://faqs.littlewandlelettersandsounds.org.uk/knowledge/parents`
   Page title observed: "Parents \| Help Center"

Parent facing, addressed to the school about parents (tier one, but the reader is
a teacher):

5. `https://www.littlewandle.org.uk/whats-included/support-for-parents/`
   Page title observed: "Support for parents \| Letters and Sounds"
6. `https://faqs.littlewandlelettersandsounds.org.uk/knowledge/supporting-parents`
7. `https://faqs.littlewandlelettersandsounds.org.uk/knowledge/how-can-i-support-our-parents-to-understand-little-wandle-foundations`
8. `https://faqs.littlewandlelettersandsounds.org.uk/knowledge/what-does-little-wandle-foundations-offer-for-families`
9. `https://faqs.littlewandlelettersandsounds.org.uk/knowledge/how-can-we-support-parents-using-wordless-books-at-home`
10. `https://faqs.littlewandlelettersandsounds.org.uk/knowledge/are-there-any-videos-to-support-parents-with-reading-at-home`

Adjacent help centre pages that shape what a parent is told:

11. `https://faqs.littlewandlelettersandsounds.org.uk/knowledge/should-i-set-reading-homework`
12. `https://faqs.littlewandlelettersandsounds.org.uk/knowledge/what-is-the-three-reads-model`
13. `https://faqs.littlewandlelettersandsounds.org.uk/knowledge/how-do-reading-practice-sessions-work`
14. `https://faqs.littlewandlelettersandsounds.org.uk/knowledge/year-1`
15. `https://faqs.littlewandlelettersandsounds.org.uk/knowledge/foundations`

One of their own PDFs, on the old domain, which happens to be the clearest
statement of the progression:

16. `https://www.lettersandsounds.org.uk/uploads/images/Programme-Overview_Reception-and-Year-1.pdf`
    Search returned its title as "Programme progression Reception and Year 1
    overviews" and, separately, as "© 2021 Wandle Learning Trust. All rights
    reserved." I did not download it. See section 4.

---

## 2. The parent material, piece by piece

`[UNVERIFIED]` throughout this section, index derived. Formats and groupings are
consistently reported across searches. **Durations are almost entirely absent
from the index**, and I will not invent them. Where their copy says "short" I say
"short".

### 2.1 How the hub is organised

The parent hub at `/resources/for-parents/` is split into **three named
buckets**. This is the genre's basic shape and it is worth noting how few
buckets there are:

1. **Support for phonics.** Downloads. The sound charts and grapheme sheets.
2. **How we teach.** Videos. A growing bank of short films explaining elements of
   the programme.
3. **Books coming home.** Videos and guidance. The single most common parent
   confusion, addressed on its own.

Index derived summary of the hub's own promise to the parent:

> The resources on this page help parents support their child with saying their
> sounds and writing their letters, and there are useful videos so parents can
> see how children are taught at school and feel confident about supporting
> their reading at home.

### 2.2 The pieces

**A. Grapheme information sheets (Support for phonics)**

- Format: PDF download, one per phase or per term.
- Length: `[GAP]` not stated in the index. From the school copies indexed, these
  appear to be one or two sides.
- Addressed to: the parent, though distributed by the school.
- What it asks the parent to do: nothing active. It is a **reference object**.
  It shows each grapheme with a picture cue, the formation, and the pronunciation
  the school uses, so the parent's version matches the classroom's.
- The critical design choice: this is the artefact that stops the parent teaching
  it wrong. Their whole parent strategy pivots on **pronunciation alignment**
  rather than on parent instruction.

**B. Sound pronunciation videos (Support for phonics)**

- Format: video, embedded on the web page.
- Length: short. `[GAP]` no duration stated.
- Coverage: Phase 2 sounds and Phase 3 sounds have their own videos. Phase 5 has
  guidance too. Index derived: the parent area provides "videos of how to
  pronounce the Phase 2 and Phase 3 sounds".
- Addressed to: the parent, spoken to camera.
- What it asks the parent to do: **watch, then imitate**. Say the pure sound,
  `mmm` not `em`. That is the entire ask, and it is one behaviour.

**C. "How we teach" films**

- Format: video, a growing bank.
- Length: short. `[GAP]`.
- Addressed to: the parent.
- Subjects observed: how a phonics lesson runs, blending, tricky words, teaching
  Phase 5.
- What it asks the parent to do: **watch and calibrate expectations**. Not to
  replicate the lesson. This is a transparency piece, and it converts a parent's
  anxiety into recognition.

**D. "Books coming home" video and guidance**

- Format: short video plus web page copy.
- Addressed to: the parent.
- What it asks the parent to do: **understand two different acts and do both**.
  Index derived: it explains "the difference between reading and sharing books".
  The book the child can already decode is for the child to read aloud. The book
  the parent reads to the child is for pleasure and vocabulary.
- It answers the scheme's number one parent complaint head on, described in their
  copy as why "the Little Wandle book that goes home is one that their child can
  already read". This is the sharpest piece of parent communication in the whole
  set, because it pre empts a specific objection with a specific reason.

**E. Tricky words guidance**

- Format: PDF plus video. Index derived: "a parent friendly version of the For
  teachers resource".
- What it asks the parent to do: **practise a named, closed list** of words that
  cannot be fully decoded yet.
- Note the pattern: they take an existing teacher artefact and produce a parent
  edition of it. Same spine, different register. That is cheap to produce and it
  guarantees alignment.

**F. Parent workshop pack** (at `/everybody-read/parent-workshop-resources/`)

- Format: presentation deck plus accompanying handouts, described as "ready to
  use".
- Addressed to: **the teacher**, for delivery to a room of parents.
- Subjects: how a Little Wandle phonics lesson works, and the importance of
  reading for pleasure.
- What it asks the parent to do: attend, then take the handout home.
- This is the school's evening event in a box.

**G. Book bag leaflets**

- Format: printed leaflet, described in their copy as "impactful book bag
  leaflets".
- Addressed to: the parent, via the child's bag.
- The physical channel matters. They do not assume a parent will visit a website.

**H. Parent help centre**

- Format: web pages, a searchable knowledge base, one question per page.
- Addressed to: partly the parent, partly the teacher answering a parent.
- Observed questions include whether to set reading homework, when a child starts
  taking reading practice books home in Reception, how to support wordless books
  at home, and what Little Wandle at Home flashcards are.
- What it asks the parent to do: nothing. It **removes** a task by answering the
  question that would otherwise become an email to the teacher.

**I. Little Wandle Foundations family material** (nursery and pre school)

- A separate strand for the under fours, with its own family resources, nursery
  rhyme material, and a stated need to help families understand that "more formal
  phonics learning starts in Reception".
- Relevant to us because our age range starts at 2, and it shows the genre's
  answer to the pre school parent: rhymes, talk, and shared books, not phonics.

### 2.3 How the progression is broken up, and what each parent sees

This is the part you asked about specifically, and it is the most transferable
finding in the document.

The parent downloads are cut **by term, not by phase**, even though the teaching
spine underneath is organised by phase. Index derived, the downloadable parent
guides showing how children are taught to say their sounds exist for:

- **Reception Autumn 1**
- **Reception Autumn 2**
- **Reception Spring 1**
- **Year 1**

So the granularity is **fine at the start and coarse later**. Four or five
discrete parent artefacts across two school years, front loaded into the first
two terms of Reception, then a single Year 1 object.

**A parent of a Reception child sees:** a term stamped sheet naming the exact
sounds being taught right now, with the formation and the pronunciation, plus the
Phase 2 and Phase 3 pronunciation videos, plus the books coming home explanation
because this is the year the first decodable book arrives in the bag. The
material is **synchronised to the week they are in**. The implicit promise is
that what is on the fridge is what happened in class today.

**A parent of a Year 1 child sees:** one consolidated object, plus the Phase 5
material, plus the tricky words list. The term by term synchronisation stops. The
frame shifts from "here is this term's sounds" to "here is the alternative
spellings work and here is the screening check in June".

**Why it changes.** By Year 1 there are no new single sounds to learn, so a
term stamped sound sheet has nothing new to say. The parent's job changes from
learning the pure sounds to supporting fluency and the check. The material honestly
follows the pedagogy rather than manufacturing twelve units for the sake of
symmetry.

**The lesson for us.** Resist the urge to build an equal sized unit for every
half term. Put the weight where the parent's job is genuinely new, which is the
first two terms, and consolidate afterwards. Their shape is four to five pieces
across two years, not twelve.

---

## 3. The pedagogic spine

`[UNVERIFIED]` index derived, but this material is corroborated across many
independent UK school websites describing the same scheme, and the underlying
phase structure is public material predating Little Wandle entirely. This is the
genuinely useful part as a model of sequencing.

### 3.1 The phases

The phase numbering is **not Little Wandle's invention**. It comes from the
Department for Education's original Letters and Sounds, 2007, which is public.
Little Wandle revised the pacing and the resources around it. Remember that when
you assess what is ownable.

- **Phase 1**, pre school, listening and oral blending, no letters.
- **Phase 2**, the first 19 or so graphemes. Reported set: s, a, t, p, i, n, m,
  d, g, o, c/k, ck, e, u, r, h, b, f/ff, l/ll, ss. Chosen so that a child can
  read real words within days.
- **Phase 3**, the remaining single letter sounds plus the main digraphs. j, v,
  w, x, y, z/zz, qu, then the vowel digraphs.
- **Phase 4**, **no new sounds**. Consonant clusters. CCVC and CVCC words.
- **Phase 5**, alternative spellings and alternative pronunciations. The same
  sound written several ways.

### 3.2 The calendar

Index derived and widely corroborated:

- **Reception Autumn 1**: settling, Phase 2 begins.
- **Reception Autumn 2**: Phase 2 graphemes.
- **Reception Spring**: Phase 3.
- **Reception Summer**: Phase 4.
- **Year 1 Autumn**: recap Phases 3 and 4.
- **Year 1 Spring and Summer**: Phase 5, aimed at the phonics screening check in
  June.

Index derived summary: "Reception children learn phase 2 graphemes during the
Autumn 2, phase 3 in the Spring Term and phase 4 in the Summer term", and "Year 1
recap phase 3 and 4 in the Autumn term and then focus on phase 5 to prepare them
for the phonics screening check taking place in the summer term". A 26 week
Reception programme was also reported.

Note the **single fixed external deadline**: the statutory phonics screening
check in June of Year 1. Everything before it is paced against it. A scheme with
one hard checkpoint two years out is structurally the same problem as ours, where
the hard checkpoint is the phone.

### 3.3 The teaching routine

- **Daily phonics lesson**, every day, short.
- **Daily Keep up**, same day intervention for any child who did not get it. The
  principle is that the gap is closed within twenty four hours rather than
  allowed to compound.
- **Reading practice sessions**, three times a week, in small groups.

### 3.4 The three reads model

This is their signature routine and the most elegant thing in the scheme.
Index derived from
`https://faqs.littlewandlelettersandsounds.org.uk/knowledge/what-is-the-three-reads-model`
and the related sessions page: each of the three reading practice sessions is
"a dedicated 20 minutes of reading for decoding, prosody and comprehension", with
the teacher able to "tap in" to hear every child read three times a week.

- **Read 1, decoding.** Applying phonic knowledge to word reading.
- **Read 2, prosody.** Reading aloud with appropriate meaning, stress and
  intonation.
- **Read 3, comprehension.** What it meant.

**Same book, three times, one focus each time.** The stated benefits are that
each session has a very clear focus, children benefit from repeated practice,
and using the same strategies as the daily lesson "helps reduce cognitive load".

**This is the single most portable idea on the site.** It is not a curriculum, it
is a **rereading protocol with one job per pass**, and the reason it works is
that it refuses to ask a beginner to decode, perform and comprehend
simultaneously. The idea of splitting one artefact into three passes with one
cognitive job each is not copyrightable, and it maps directly onto our ten
minutes a day format. See section 7.

### 3.5 Pronunciation guidance

The load bearing piece of their parent strategy. The entire risk in parent
involvement with phonics is that a well meaning parent says "em" for m, or adds
a schwa, and actively makes blending harder. Their answer is not a written
instruction, it is a **video of a mouth**, per phase, free and public.

The general principle: pure sounds, not letter names. Confirmed in the Read
Write Inc material too, index derived: "make sure children say sounds like
'mmm', not letter names like 'em'".

### 3.6 The three structural moves to copy

Stripped of their content, the scheme's architecture is three moves:

1. **One hard external checkpoint**, named early, everything paced against it.
2. **Parent material synchronised to the week the child is in**, so the parent is
   never guessing what is current.
3. **A repeated routine with one job per pass**, so the parent's ten minutes has
   a single focus rather than a vague instruction to practise.

None of those three is theirs to own. All three are ours to use.

---

## 4. Terms of use, copyright and reuse

**Read the caveat in this section carefully. This is where the fetch block hurts
most, and I have chosen a flagged gap over a confident paraphrase.**

### 4.1 The copyright notice

The notice appears on their documents in a consistent form. Search returned the
following as the **literal indexed titles of PDF documents**, meaning the strings
were extracted from inside those documents rather than written by me:

> "© 2021 Wandle Learning Trust. All rights reserved."

Source document: `https://www.lettersandsounds.org.uk/uploads/images/Programme-Overview_Reception-and-Year-1.pdf`

> "1 ©2022 Wandle Learning Trust. All rights reserved."

Source document: `https://www.littlewandle.org.uk/wp-content/uploads/2022/07/Weekly-Wandle-July-4th-2022-LS-KEY-GUIDANCE-GETTING-STARTED-PD02-1.pdf`

> "© 2023 Wandle Learning Trust. All rights reserved. Little Wandle tricky words"

Source document: `https://www.htpd.surrey.sch.uk/_site/data/files/send/A082723223CE66F353B88BC8D6E3056A.pdf`

> "1 © 2023 Wandle Learning Trust. All rights reserved."

Source documents include
`https://hambleton.n-yorks.sch.uk/wp-content/uploads/2026/01/curriculum-phonics-Little-Wandle-Spelling-Programme-Progression-detail.pdf`
and `https://www.moorfirstschool.co.uk/wp-content/uploads/2024/08/Little-Wandle-Fluency-scheme-overview.pdf`

**Confidence: high.** The string `© <year> Wandle Learning Trust. All rights
reserved.` is corroborated across three separate years and at least six
independent hosts. I did not download any of these files. The strings above come
from search result titles, which search engines derive from document content.

**The owner is Wandle Learning Trust**, a multi academy trust, not a commercial
publisher. Worth remembering when you consider tone: their public posture is a
school helping schools, and they will be more sensitive to reputational framing
than a publisher would be, and possibly less litigious. Do not test it.

### 4.2 The terms and conditions

**URL:** `https://www.littlewandlelettersandsounds.org.uk/terms-conditions/`
(page title observed: "Terms and conditions | Letters and Sounds")

**`[GAP]` I DO NOT HAVE VERBATIM TEXT AND I AM NOT GOING TO PRETEND OTHERWISE.**

What I have is the search provider's **summary**, which I reproduce here clearly
labelled as a summary and **not** as a quotation:

- Index derived summary: the terms grant a non exclusive, non transferable
  licence to access and use the digital content in electronic format for internal
  business use and teaching purposes, with permissions differing between a one off
  purchase and membership content. All other uses of digital content other than as
  permitted by the terms are prohibited. For membership digital content the
  licence runs for the membership term. Anyone wanting to use the content in a way
  the terms do not authorise is told to contact them.
- Index derived summary, from a separate search: on termination of membership,
  users must immediately delete, destroy and make no further use of any hard or
  electronic copies of digital content provided, and must remove any reference to
  the programme or programme resources from their school website, school policy
  documents and guidance documents to parents.

**Do not quote either bullet to anyone as their words.** The wording is the
search index's, not theirs.

**What the summaries do reliably tell us, and it is enough to act on:**

1. The licence is **per school and non transferable**.
2. It is **term limited** and dies with the membership.
3. It covers **internal use and teaching**, which is not publishing.
4. **Everything not expressly permitted is prohibited.** That is the important
   clause shape. There is no residual freedom to fall back on.
5. They assert control **even over a school's own parent facing documents**,
   requiring references to be stripped on termination. That is an unusually long
   reach and it tells you how tightly they hold the brand and the material.

**Action for you, five minutes:** open the URL above and paste the sections
headed licence, intellectual property and termination. Also
`https://www.littlewandle.org.uk/product/membership-uk-school/` for the per
school scope. Then this section becomes evidence rather than inference.

### 4.3 Open licensing

**They publish nothing under an open licence.** No Creative Commons, no Open
Government Licence, no reuse permission of any kind surfaced anywhere in this
research. The notice is "All rights reserved", the terms prohibit anything not
expressly permitted, and the gate page at `/content-restricted/` exists to
enforce it.

Treat the entire Little Wandle corpus as **fully reserved commercial copyright**:
the PDFs, the videos, the sound charts, the mnemonics, the picture cues, the
phrase "Little Wandle", the specific pacing tables, and the specific wording of
their parent guidance. Note also that **their free public parent material is no
less protected for being free.** Free to view is not free to reuse. That is the
mistake to avoid.

### 4.4 Where the name creates a false impression of ownership

One nuance that works in our favour. The phrase "Letters and Sounds", the phase
numbering 1 to 5, and the basic grapheme sequence are **from the Department for
Education's 2007 Letters and Sounds programme**, which is public sector
information. Little Wandle's product is called "Little Wandle Letters and Sounds
**Revised**", and the site's own page titles render simply as "Letters and
Sounds". The effect is that many schools and most parents believe the phases
belong to Little Wandle. They do not.

So the fence runs like this. **Theirs:** their text, their videos, their images,
their mnemonics, their exact pacing tables, their brand. **Not theirs:** the
phase concept, the phase numbering, the order of graphemes as set out in public
DfE material, the screening check, the national curriculum content, and the
pedagogic principles of synthetic phonics.

---

## 5. What is not theirs to own: the public statutory spine

This is the legally safe foundation. `[UNVERIFIED]` as to my having opened them,
all URLs returned by search and all standard gov.uk locations.

### 5.1 The DfE criteria for systematic synthetic phonics programmes

- **Core criteria and self assessment:**
  `https://www.gov.uk/government/publications/phonics-teaching-materials-core-criteria-and-self-assessment`
- **Validation supporting documentation:**
  `https://www.gov.uk/government/publications/phonics-teaching-materials-core-criteria-and-self-assessment/validation-of-systematic-synthetic-phonics-programmes-supporting-documentation`
- **Collection page:** `https://www.gov.uk/government/collections/phonics-choosing-a-programme`
- **Guidance:** `https://www.gov.uk/government/publications/choosing-a-phonics-teaching-programme`
- An archived copy of the December 2021 guidance:
  `https://dera.ioe.ac.uk/id/eprint/38810/1/Choosing%20a%20phonics%20teaching%20programme%20-%20GOV.UK.pdf`

Index derived: revised core criteria were published in April 2021 alongside a new
validation process. Publishers self assessed, independent evaluators reviewed, and
after three rounds 45 programmes were validated. The criteria require that a
programme presents synthetic phonics as the prime approach to decoding, starts
early in Reception, is designed for daily teaching, teaches the main grapheme to
phoneme correspondences in a clearly defined incremental sequence, begins with a
defined group of correspondences that let children read and spell many words
early, and progresses from simple to complex, cumulatively covering all the major
correspondences in English.

**Licence: Open Government Licence v3.0**, the gov.uk default. Confirm on each
page footer.

**Why this is gold for us.** This document is the **specification every validated
scheme was built to**. It is the shared skeleton beneath Little Wandle, Read
Write Inc and the other 43. Building from the criteria rather than from any
scheme's expression of them gives us a defensible, on thesis foundation and a
paper trail for the evidence rule.

### 5.2 The validated programmes list

- `https://www.gov.uk/government/publications/choosing-a-phonics-teaching-programme/list-of-phonics-teaching-programmes`
- `https://www.gov.uk/government/publications/choosing-a-phonics-teaching-programme/contact-details-for-the-validated-systematic-synthetic-phonics-ssp-programmes`

Index derived: 45 validated programmes, and validation means "a programme has
been self assessed by its publisher and judged by a small panel with relevant
expertise and that both consider it to meet all of the Department for Education
(DfE) criteria for an effective systematic synthetic phonics programme".
`[UNVERIFIED]` as exact wording.

**Note for our copy standard.** Validation is publisher self assessment plus
panel review. It is **not** an efficacy trial. If we ever reference validation we
say what it is, per the evidence or silence rule.

### 5.3 The national curriculum programme of study for English

- **Framework page:**
  `https://www.gov.uk/government/publications/national-curriculum-in-england-framework-for-key-stages-1-to-4`
- **English key stages 1 and 2 PDF:**
  `https://assets.publishing.service.gov.uk/media/5a7de93840f0b62305b7f8ee/PRIMARY_national_curriculum_-_English_220714.pdf`
- **Full primary framework PDF:**
  `https://assets.publishing.service.gov.uk/media/5a81a9abe5274a2e8ab55319/PRIMARY_national_curriculum.pdf`

Published September 2013. Contains the year by year reading and writing
requirements including word reading, plus the spelling, vocabulary, grammar and
punctuation appendices.

**Licence: Open Government Licence v3.0.** This is the same material our 448
objective curriculum spine already uses in DfE verbatim wording with a mandatory
source, per THE STORY. So the precedent and the pattern exist in our codebase
already.

### 5.4 The phonics screening check materials

- **2026 materials:** `https://www.gov.uk/government/publications/phonics-screening-check-2026-materials`
- **Assessment and reporting arrangements:**
  `https://www.gov.uk/government/publications/phonics-screening-check-assessment-and-reporting-arrangements-ara/2025-phonics-screening-check-assessment-and-reporting-arrangements`
  and `https://www.gov.uk/government/publications/assessment-and-reporting-arrangements-phonics-screening-check/assessment-and-reporting-arrangements-phonics-screening-check`
- **Practice materials collection:**
  `https://www.gov.uk/government/collections/national-curriculum-assessments-practice-materials`
- **A past paper:**
  `https://assets.publishing.service.gov.uk/media/62b03685d3bf7f0affd65591/STA228473e_YR1_2022_Phonics_pupils_materials_standard.pdf`
  and `https://assets.publishing.service.gov.uk/media/68efa2b2e7b6794c076bbec2/2023_phonics_screening_check_pupils_materials.pdf`

**This is the most important licence finding in the document.** Index derived
from the STA materials: the test materials are **Crown copyright** and **can be
re used free of charge in any format or medium in accordance with the Open
Government Licence v3.0**, with attribution stating the material was "developed
by the Standards and Testing Agency for national curriculum assessments".

`[UNVERIFIED]` as exact wording, and **verify the attribution string on the
actual PDF before shipping it**, because if we reproduce screening check items we
must carry that attribution exactly.

**What this unlocks.** The real, statutory, nationally administered check that
every Year 1 child in England sits in June is material **we may legally
reproduce, adapt and use commercially, with attribution.** We do not need
anyone's practice words. We can use the actual check. That is a stronger asset
than anything behind Little Wandle's paywall, and it is free.

### 5.5 The Open Government Licence itself

- `https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/`
- Older version: `https://www.nationalarchives.gov.uk/doc/open-government-licence/open-government-licence.htm`
- User guidance PDF:
  `https://cdn.nationalarchives.gov.uk/documents/information-management/ogl-user-guidance.pdf`

Index derived: OGL v3.0 permits use and re use of information in any format for
**both commercial and non commercial purposes without charge**, subject to an
attribution statement naming the title, the owner or creator, and the date of
publication. Published 31 October 2014 by The National Archives. Exemptions
include personal data, **logos and crests**, military insignia, third party
rights, and other intellectual property including patents and trade marks.

**The two practical consequences.** First, we may build a commercial product on
OGL material, which is the whole basis of section 7. Second, the logo exemption
means **we attribute in words and never reproduce a crown crest, a DfE logo or an
STA logo.**

### 5.6 The public predecessor programme

The original **Letters and Sounds (2007)** was DfE published material and is the
source of Phases 1 to 5 and the broad grapheme sequence. A site at
`https://www.lettersandsounds.org.uk/` carries that name, though note it also
hosts Wandle Learning Trust copyrighted PDFs, so it is not a clean public source.
`[GAP]` I could not confirm the current canonical location or licence status of
the 2007 document, and it should be confirmed before being cited as the source
for our phase structure. It is worth the ten minutes, because it is the cleanest
possible provenance for the phase numbering.

---

## 6. The genre: how other validated programmes handle parent material

`[UNVERIFIED]` index derived throughout.

**Read Write Inc (Ruth Miskin, published by Oxford University Press).** The
structure is materially different from Little Wandle's in one respect: it is
**split across three properties**. Publisher pages at
`https://global.oup.com/education/content/primary/series/rwi/oxford-owl/`, a
parent facing consumer site at
`https://home.oxfordowl.co.uk/reading/reading-schemes-oxford-levels/read-write-inc-phonics-guide/`
with a general phonics hub at `https://home.oxfordowl.co.uk/reading/phonics/`
and a video hub at `https://home.oxfordowl.co.uk/phonics-videos/`, plus the
author's own site at `https://www.ruthmiskin.com/parentsandcarers/` titled
"Learning to read at home". The content mix is the same genre furniture: how to
videos, Speed Sounds sheets to download, free eBooks, handy guides, and parent
tutorial films from Ruth Miskin Training on pronouncing the sounds, blending and
digraphs. The same pure sounds instruction appears, "make sure children say
sounds like 'mmm', not letter names like 'em'". The one structural divergence
that matters: **Read Write Inc puts its eBook library behind a free account**,
index derived, "parents and carers will need to create a free account on Oxford
Owl for Home to access the eBooks". So they trade a registration wall for a
direct relationship with the parent, where Little Wandle keeps the parent area
entirely open and keeps the relationship with the school. That is a genuine fork
in the genre and it is the same fork we face.

**Essential Letters and Sounds (Oxford University Press).** Pages at
`https://global.oup.com/education/content/primary/series/essential-letters-and-sounds/`,
`https://home.oxfordowl.co.uk/reading/reading-schemes-oxford-levels/essential-letters-and-sounds/`
and a parent route at `https://essentiallettersandsounds.org/parents/`. Their
distinctive move is **commercial**: "Three ELS Home Learning Kits cover Letters
and Sounds Phases 2 to 5 and provide everything that parents and carers need",
alongside flashcard packs of 55 cards with a sound on one side and an
illustration on the other. They sell the parent a physical box. Their digital
parent asset is an eBook library of 127 decodable titles, and critically it is
described as "organized by term and week", the same synchronisation principle
Little Wandle uses on its sound sheets, applied to books.

**The genre's conventions, then, are four, and they are remarkably stable.**
Every programme provides (1) a pronunciation guide in **video**, because text
cannot teach a mouth shape, (2) a **downloadable sound reference** for the
fridge, (3) a **transparency film** showing what a lesson looks like, so the
parent stops worrying and stops improvising, and (4) an explanation of **why the
book coming home is easy**, because that is the universal parent objection. What
varies is only the **business posture**: Little Wandle gives it all away free and
open to serve the school, Read Write Inc gates it behind a free account to own
the parent relationship, and Essential Letters and Sounds sells the parent a kit.
The pedagogy is shared, standardised by the DfE criteria. The differentiation is
entirely in **who pays and who owns the parent relationship**, which tells us the
opportunity is not a better phonics explanation but a better shaped parent
product.

---

## 7. WHAT WE WOULD BUILD INSTEAD

Built on the DfE criteria, the national curriculum English programme of study and
the OGL licensed phonics screening check. Owing nothing to Wandle Learning
Trust's text, videos, images, mnemonics or pacing tables. In our voice, at ten
minutes a day, parent and child together.

**The spine we own.** Six units across two school years, not twelve, following
their honest finding that the parent's job is new in the first two terms and
consolidating after that. Reception Autumn, Reception Spring, Reception Summer,
Year 1 Autumn, Year 1 Spring, Year 1 Summer. Each unit is sourced to the national
curriculum reference and the DfE criteria clause it serves, with the mandatory
`source` field populated, exactly as migration 108 requires for every other
objective. The one hard checkpoint is named on day one: the phonics screening
check, June of Year 1.

**The pieces.**

1. **The Sound Board.** One A4 PDF per unit, six in total. Our own butter and ink
   and Nunito, our own picture cues drawn in the digi squad style, never theirs.
   Each shows the graphemes for that term, the formation stroke, and a QR code to
   the pronunciation clip. *Asks the parent to:* put it on the fridge and point at
   one row a day.

2. **Ten Second Sounds.** A pronunciation clip per grapheme, eight to twelve
   seconds, mouth on camera, silent captions. Roughly 45 clips across Reception,
   about 20 more for Phase 5. *Asks the parent to:* watch once, then say it back
   before saying it with the child. One behaviour, pure sounds, never letter
   names.

3. **The Ten Minute Loop.** The core mechanic, one web page per unit with a
   three pass routine of our own design, built on the public principle that a
   beginner cannot decode, perform and understand at once. Pass one, read it.
   Pass two, read it like you mean it. Pass three, tell me what happened.
   Three to four minutes each. *Asks the parent to:* do one pass a night across
   three nights with the same book, and tap which pass they did.

4. **Why The Book Is Easy.** One 90 second film plus a card for the bag. Answers
   the objection every parent in the genre raises, in our words, with our reason.
   *Asks the parent to:* do nothing differently, and stop worrying. It removes a
   task rather than adding one.

5. **The Two Books Rule.** One page, 200 words. The book the child reads to you,
   and the book you read to the child. *Asks the parent to:* keep both going and
   never let the second one become homework.

6. **Stage Check: Reading.** A six question check in at the end of each unit,
   two minutes, feeding the existing `concern_events` measurement spine so the
   first check in is the baseline. No overall score, per the philosophy. *Asks
   the parent to:* rate where they are, and get DiGi's next step, never a verdict.

7. **The Real Check, Explained.** One page plus a two minute film, released in
   Year 1 Autumn. Reproduces genuine phonics screening check items under OGL v3.0
   with the Standards and Testing Agency attribution carried exactly, and never a
   crown crest or DfE logo. *Asks the parent to:* try four real items with the
   child, in June of Year 1, calmly, once.

8. **DiGi answers phonics.** No new artefact. The unit content lands in the
   knowledge bank behind the human gate on `/dashboard/insights`, so a parent
   asking "she keeps guessing the word, what do I do" gets a calibrated pathway,
   never allow or deny, grounded in the unit she is actually in. All scripts as
   database rows in the `scripts` table, never hardcoded.

**Total build:** six PDFs, about 65 short clips, six web pages, two films, one
check in flow. Every asset ours. Every claim with a proof path in the product.

**The fence, written down.** We never reproduce their text, films, images,
mnemonics, picture cues or pacing tables, we never use the phrase "Little
Wandle", and we never imply endorsement or validation. We do use the phase
numbering and grapheme sequence from the public DfE material, cited to it, and
the screening check under OGL with attribution. Free to view was never free to
reuse, and their parent area being open changes nothing.

---

## 8. Verdict and what is needed

**Buildable, comfortably, without touching their material.** The pedagogy is
standardised by public DfE criteria that every one of the 45 validated
programmes was built to, the phase structure and grapheme sequence come from
public DfE material rather than from them, the national curriculum is OGL v3.0,
and the phonics screening check is Crown copyright reusable free of charge in any
format or medium under OGL v3.0 with attribution. What is genuinely theirs is
expression: their words, their films, their pictures, their pacing tables, their
brand. We need none of it, and section 7 uses none of it.

**What is needed from you.**

1. **Five minutes on the terms page.** Open
   `https://www.littlewandlelettersandsounds.org.uk/terms-conditions/` and paste
   back the licence, intellectual property and termination sections. That closes
   the one real gap in this document.
2. **A decision on scope.** Section 7 is a six unit early reading track for
   Reception and Year 1. Confirm it belongs in the parent app curriculum spine
   before anything gets built.
3. **Network access, if you want this verified properly.** Every fetch in this
   session was refused by the egress proxy. Re run this brief from a session with
   web access and the `[UNVERIFIED]` tags come off.
