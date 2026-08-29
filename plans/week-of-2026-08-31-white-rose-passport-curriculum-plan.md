# School lessons to White Rose standard, feeding the passport

**The full plan, 30 August 2026, replacing the 29 August stub.** Built from a
twelve agent research fleet (six lenses, each adversarially audited; the
distillation with sources and corrections is
`research/2026-08-30-passport-curriculum-research.md`) plus the passport
language and codebase audits. Lesson 1 already runs end to end (PR #926: the
run sheet, the passport moment, the phase choreography); this plan takes the
same standard across the scheme.

## Lane boundaries, unchanged

The passport codes lane (#924) owns migration 227, passport numbers, the
verify page, bridge a and graduation. This lane owns curriculum content:
**migrations 228 and 229 stay claimed here** for the platform cards and the
risk register. Nothing in this plan writes a completion, a stamp or a code.

## The one fact that reframes everything

**The UK announced an under 16 social media ban on 15 June 2026** (Australia
model; TikTok, Snapchat, Instagram, YouTube, Facebook, X; messaging apps and
YouTube Kids excluded; regulations before Parliament by end of 2026, force
expected spring 2027, Ofcom enforcing, default protections continuing for 16
and 17 year olds). "Social media ready at 16" stops being a philosophy and
becomes alignment with the coming legal minimum. Three consequences:

1. The `social_media_law` config flag (non negotiable 7) was built for
   exactly this; Stage 3 and 4 content that assumes a 13 to 15 year old can
   legally hold accounts needs the flag driven variant ready before spring.
2. The ban excludes WhatsApp, Discord and gaming platforms, so under 16
   social life migrates there; the risk layer must never treat the ban as
   coverage.
3. The credential must never read as an access or age assurance document,
   and copy must never say "at 16 they are on their own" (16 and 17 year
   olds keep default protections).

Also days away: **KCSIE 2026 is in force 1 September** and names generative
AI, deepfakes, misinformation, disinformation and conspiracy theories as
risks schools must address. Our coverage map has to show them explicitly this
term.

---

## Part 1 · The White Rose standard

What actually makes White Rose the default (64 percent of surveyed teachers,
a trust owned spin out from the Halifax maths hub): a rigidly predictable
spine, an atomic unit smaller than a lesson, an identical artefact set for
every unit, retrieval built in, loud versioning, and a free open progression
that made them the standard everyone else aligns to. The ten rules, adapted:

1. **The small step is the atomic unit**, defined for this subject as one
   observable behaviour or judgement in one named context, always writable
   as "The child can [verb] [situation]" and always provable with a scenario
   question. "Spot a streak mechanic and say what it wants from you." If a
   teacher cannot observe it, it is not a step.
2. **A fixed spine, never varied**: Module → Block → Small steps, published
   week counts, a consolidation slot per term, and the full mapping of every
   step to EfCW strands and RSHE 2025 bullets.
3. **An identical artefact contract per step**: the teacher step page (notes
   and guidance, key questions, word for word sentence stems, things to look
   out for), the slides, the printable, the expected response key. We
   already ship this per LESSON (PR #858 and #926); the work is modelling
   steps under lessons. **Steps and lessons are separate linked entities**:
   one step does not equal one lesson, ever, and the schema must not weld
   them.
4. **The Flashback Four**: four scenario retrieval questions opening every
   lesson — one from last lesson, one from earlier this module, one from
   last term, one from last year. The starter phase already exists and is
   never skippable; this formalises what fills it.
5. **Assess at two grains, refuse grade boundaries**: end of block checks
   (the Prove phase, formalised) and end of term assessments that inform
   teacher judgement, with no published thresholds below the passport stage
   gates.
6. **Give the map away, sell the classroom** — DECISION NEEDED, see the end.
7. **Version loudly, never silently**: a version stamp on every artefact,
   block by block release ahead of term, the old version frozen for a
   parallel year, every change announced. Plus what White Rose never needed:
   a risk currency layer that updates FACTS mid year without touching the
   TEACHING (part 3 makes that split real).
8. **Publish a named pedagogy** schools can quote (part 5, the philosophy
   page, is where it lives).
9. **Spiral behaviours, not topics**: the roughly ten core behaviours
   (privacy, verification, persuasion resistance, AI judgement, help
   seeking, footprint, balance, money, identity, kindness) appear at every
   stage, deeper each time.
10. **Stable public step IDs** in the database, keyed from every slide,
    script, printable, Flashback item and assessment question.

**What does not transfer**: right answer variation (our Practise and Prove
accept ranges of defensible responses scored on reasoning, the never allow
or deny rule made assessable); daily cadence (design for the weekly PSHE
slot); and one grammar for all ages (EYFS gets a provision based format,
post 16 gets a careers facing format, exactly as White Rose treats Reception
and post 16 differently).

## Part 2 · The passport in schools

The parents app passport is canon and is not forked: **five stages**
(Foundation 4 to 7, Builder 8 to 10, Explorer 11 to 12, Shaper 13 to 15,
Independent 16 and above), five named stamps, DiGi's five question check.
School lessons are credit toward the same pages (shipped for lesson 1 in
PR #926). What the research adds:

- **The name.** "Digital Passport" is doubly collided: a live US trademark
  (Common Sense Media, reg 4246911, the product retired but the mark
  surviving) and a UK safeguarding tool of the same name run under UKCIS for
  care experienced children. The locked decision already bans it in UK
  school marketing. Candidates that keep the metaphor: **DiGi Passport**,
  **The Road to 16 Passport**, **The Passport to Sixteen**. A UK IPO
  clearance search is needed before any public naming (the register was
  unreachable from this environment).
- **The credential anatomy** every trusted children's scheme shares
  (Bikeability, Swim England, DofE, music grades, iDEA): named visual
  stages, published can do outcomes a teacher reads in one page, a defined
  assessor, a physical artefact, and a verifiable record. Evidence depth
  must visibly rise with age or heads discount the whole thing as stickers:
  observation at EYFS, play disguised checks at KS1, ipsative baseline and
  endpoint at KS2, scenario simulations against pathway rubrics at KS3, and
  a capstone readiness review at KS4 recorded as **"completed the
  preparation"**, never a warranty.
- **Marking is Demonstrated or Not Yet.** Never pass or fail, never a
  percentage, never a score stored against a child. Not Yet rolls forward
  Bikeability style and can be re demonstrated any time. Nothing about a
  child in free text in the database, ever: paper carries the richness, the
  database stores outcome codes, and no readiness is ever computed from
  usage data (Children's Code: profiling off by default).
- **The claim wording** is modelled on national curriculum swimming: "has
  demonstrated that they can use social media and AI tools competently,
  confidently and responsibly", with the honesty line always attached:
  readiness is an educational judgement by their teachers and family;
  it reduces risk, it does not remove it; it is not permission, age
  assurance, or a safety guarantee.

## Part 3 · The living risk layer (migrations 228 and 229)

Platform facts churned constantly in two years (WhatsApp 16 to 13, Roblox
facial age checks, Discord teen by default, Character.AI ending under 18
chat, ChatGPT for Teens) while the National Online Safety weekly guide
proved the distribution model. So: facts live in the database, lessons
interpolate them at render time, and freshness is enforced by the player
rather than by hope.

- **Migration 228, `schools.platform_cards`**: platform_id, display name,
  category (social, messaging, gaming, video, AI chatbot), stated minimum
  age with notes, age assurance method, UK regulatory status
  (**investigation and finding are different template sentences**; stating
  an open investigation as a finding is a defamation risk), headline risks
  with per fact source URL and as of date, next_review_due, change_log.
  AI chatbots are first class cards from day one (KCSIE 2026 names
  generative AI this September). Seeded with the audited facts from the
  research file, nothing unverified.
- **Migration 229, `schools.risk_register`**: the recurring sources and
  their cadence (Ofcom Children and Parents each May, KCSIE each
  1 September, Online Nation each December, Internet Matters each March,
  rolling Ofcom bulletins, ad hoc alerts), each ingested item logged
  against the cards it touched, so the change log doubles as the audit
  trail for "constantly updated".
- **Freshness in the player**: a card past next_review_due renders with
  fallback wording ("check the current age with your teacher") and blocks
  any Prove question testing a volatile fact; every rendered claim carries
  an "as of date, source" line a teacher can defend to a parent.
- **The weekly guide**: generated from platform card diffs, one page,
  parent facing, sources on the page, inside the school licence — the
  WakeUpWednesday mechanic with our evidence discipline instead of harm
  cataloguing.

## Part 4 · AI and your future (KS4 and KS5)

Anchored to the machinery a careers lead answers to: the May 2025 statutory
guidance with the updated Gatsby Benchmarks, the CDI six learning areas,
Provider Access Legislation. Six lessons at KS4 (tasks not jobs; exposure is
not elimination; the skills that appreciate; AI at work in practice; money
and the online economy of work; my adaptable plan), four to six pathway
facing sessions at KS5 including the entry level squeeze taught straight.

Hard rules from the evidence audit: every statistic carries one of three
labels, **measured, modelled, or expected by employers**; the 65 percent
"jobs that do not exist yet" myth is never used; exposure is never presented
as job loss; the graduate vacancy fall is never attributed wholly to AI;
DiGi is never a careers adviser and the strand never claims to deliver
Gatsby Benchmark 8 (a qualified adviser's interview) — it generates the
"take this to your careers adviser" artefact that feeds it. Every hard
number is a database row refreshed each summer, because a hardcoded 2025
labour market taught in 2028 is exactly the failure this scheme exists to
avoid.

## Part 5 · The philosophy page (/hub/philosophy)

Ordered as regulators, then scientists, then practitioners, then us, so
every claim sits on a named source a journalist can check:

1. **DfE RSHE July 2025** (in force 1 September 2026): teach first by
   construction; we build on it and add the positive capability side the
   guidance mostly lacks. Cite the in force PDF, never the 2019 version.
2. **KCSIE 2026** and the four Cs plus misinformation: adopted verbatim as
   the risk spine; we differ in progressively handing calibrated
   responsibility to the child, which KCSIE never does.
3. **Common Sense Media**: philosophical kin, cited as kinship only, never
   as UK statutory alignment.
4. **Dr Becky and Good Inside**: the readiness question in parenting
   language; calibrated pathways include firm floors. Framing only, never
   their brand or implied endorsement.
5. **Cambridge, quoted as two separate strands**: Orben's windows of
   sensitivity (girls 11 to 13, boys 14 to 15) as the scientific warrant
   for staging, and DEFI's education futures optimism — never conflated,
   or Cambridge academics will object. (Van der Linden's social media
   passport proposal, already cited in the passport codes plan, joins this
   section as the direct academic backing for the credential.)
6. **Livingstone**: context over minutes, risk is not harm, resilience
   through managed exposure — plus the one plain sentence her community
   will look for: platform accountability and regulation matter, and this
   product does not shift that burden onto families.
7. **Haidt and his critics, published honestly**: we share the 16
   threshold and ride the cultural wave; we differ on method (readiness
   earned through teaching, not delay through ban alone); and Odgers and
   Przybylski are right that the causal science is unsettled. **Never one
   causal mental illness claim anywhere.**
8. **Recognised schools**: Mersey Park's SWGfL Online Safety Mark and pupil
   e‑Safety Cadets as the proven taught not banned model (and cadet style
   pupil roles join the primary stages). Never "Ofsted outstanding for
   online safety", which does not exist as a judgement.

## Part 6 · The updater routines

On the pattern that already exists for DiGi's research bank: **draft with
web search, human gate, only then live.** Nothing reaches a classroom
without Justin's approval.

1. **The anchor watch** (scheduled to the real calendar: May, 1 September,
   December, March): reads the new publication, drafts platform card and
   risk register updates with sources, opens the review queue.
2. **The weekly diff**: platform newsroom and regulator feeds in, card
   change candidates plus the weekly parent guide draft out.
3. **The summer careers refresh**: WEF, PwC, Skills England, IMF each
   summer before September teaching, relabelled measured, modelled or
   expected.

Each run logs what it read against what it changed, so "constantly updated"
is an auditable property rather than a slogan.

## Build order

1. **Migration 228 platform cards + 229 risk register**, seeded from the
   audited research; the lesson page and hub gain the "as of" rendering.
2. **KCSIE 2026 coverage line** on the RSHE mapping page (generative AI,
   deepfakes, misinformation named) before 1 September.
3. **The philosophy page**, which is mostly written above.
4. **Small steps under lessons**: schema (step IDs, lesson links), then the
   21 modules decomposed, then the Flashback Four into the starter phase.
5. **The updater routines**, anchor watch first (its first real event is
   KCSIE on 1 September).
6. **AI and your future**, KS4 first.
7. **Assessment architecture** (Demonstrated and Not Yet) — sequenced last
   because per child recording rides on the staffroom or bridge a, whichever
   lands first.

## Decisions needed from Justin

1. **The open map** (White Rose rule 6): publish the full 21 module small
   step progression and the EfCW and RSHE mapping openly, no access code,
   while lessons, scripts, packs and assessment stay behind the code. The
   research is unambiguous that free progressions become the standard others
   align to, and equally clear the paid wall belongs around the classroom
   materials. This narrows the 15 August "everything behind the code"
   decision, so it is yours to make, not mine.
2. **The name**: DiGi Passport, The Road to 16 Passport, or The Passport to
   Sixteen — after the UK IPO clearance search, which needs doing from a
   normal connection.
3. **Board or tablets** for the interactives, still open from 15 August; it
   shapes how the other twenty modules use them.

## Verification

Per build step: both apps build and typecheck; wiring check 0 new; the gate
covers every new route; banned vocabulary sweep (digital passport, test,
pass, fail, safe as a claim) over schools/ and shared/; migration numbers
free per the ledger; and for anything rendered, DevTools at 390 and 1280.
Content claims: nothing marked partial or unverified in the research file is
printed without a primary source check, and every statistic in the careers
strand carries its evidence label.
