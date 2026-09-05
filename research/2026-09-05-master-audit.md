# The master audit: fourteen reports before anything is rebuilt

Compiled 5 September 2026, against the master school platform brief received
31 August (plans/2026-08-31-master-audit.md records receipt, the lane claim
and the five reconciliation points). Per the brief's section 64, nothing is
rebuilt here. These reports are the evidence base; building waits for
approval.

Sources, all verifiable: a live read-only audit of the production database
(project zgkdfiwtnzqmtfgfsxzo, schema schools, run 5 Sept), a file-level
sweep of the shipped code in this repo, a fresh statutory verification sweep
(WebSearch, graded VERIFIED / LIKELY / UNVERIFIED), and the existing
research and plan documents (digital-literacy-landscape.md, the Common Sense
review, lesson-standard-plan.md, the White Rose passport curriculum plan,
the passport codes and graduation plan). Every claim below has a path.

Classification labels are the brief's own: A statutory, B statutory
guidance have regard, C Ofsted relevant, D safeguarding good practice,
E government recommendation, F evidence based best practice, G Guided
Digital Childhood enhanced standard.

---

## REPORT 1 — EXISTING GDC ARCHITECTURE

What already exists and where it lives. This is a real product, not a
skeleton.

**Platform.** npm workspaces monorepo: the parents app at root, the schools
app in /schools, the shared player and curriculum in /shared (@gc/shared).
Three Vercel deployments. Supabase Postgres, schema `schools` for the
school product. The schools app is deliberately stateless: no API routes,
no auth, no writes, an anon Supabase client behind an HMAC signed class
code cookie (schools/lib/access.ts: "A code is a door, not an identity").
Open paths: /, /pricing, /unlock, /curriculum, /hub/rshe-mapping,
/philosophy. Everything else 307s to /unlock.

**Curriculum.** 21 modules, Reception to Year 13, in
schools.school_lessons: 458 slides total, zero slides missing a script,
average script 366 characters. Every module carries misconceptions (3
each), differentiation support and stretch, timing, paper fallback,
keywords, evidence anchor, EfCW strands and statutory hooks, a parent
note, an assessment block and a single action outcome. 120 worksheet items
across 20 modules, every one with expected_verdict and teaching_point.
Spiral behaviours and per key stage "why now" lines ship in
shared/schools-curriculum.ts (KEY_STAGE_WHY, SPIRAL_BEHAVIOURS).

**Lesson model.** Six phases (Connect, Recall, Teach, Practise, Prove,
Reflect) which contain the brief's 15 beat arc (reconciliation point 4).
15 slide types declared in shared/lesson-slides.ts; DB usage: choice 105,
concept 62, diagram 44, scenario 40, discussion 37, digi 22, the six
per-deck types 21 each, stat 12, video 8, interactive 2. Six interactive
components built (verdict-sort, signal-meter, star-breath, feed-loop,
spread-race, class-tally).

**Teacher journey.** /lesson/[module] (preview: four buttons, phase chips
with minutes, misconceptions, differentiation, DSL box, what goes home),
/lesson/[module]/run (the run sheet: before ticks, every slide's script
with deep links, after ticks), /teach/[module] (the player: script panel,
phase strip with done ticks, timing chips, keyboard, swipe, discussion
timer), /class/[lessonId] (projector showcase, scripts stripped). Print
room: five page pack, overview, organiser, booklet, learning record.

**The Hub.** Nine printable school documents generated live from the
database so they cannot drift: RSHE mapping, policy, parents pack, data
protection, DSL crosswalk, CPD briefings, year plan, vocabulary, FAQ.

**Passport.** The Guided Childhood Passport (locked name, decisions.md 30
Aug): computed from lesson completions, never stored; public verify lane
at /verify/[code] (migration 227); one static HOME code per module
(migration 230) redeemed in the parents app, writing lesson_completions
with lesson_source='school_lesson', deliberately not counted toward stage
stamps.

**Characters and media.** Pebble, Bloop, Orbit, Nova, Cosmo and DiGi, with
CDN art and approved intro clips (shared/intro-characters.ts); migration
233 (applied) wires Nova onto all five KS4 title slides and Cosmo onto
both KS5. Six marketing films in production (three complete, 22 beats
rendered). Marketing: rebuilt schools home page (the wall at sixteen
hero), /philosophy with named experts and counter evidence, White Rose
style open curriculum map, JSON-LD, sitemap.

**Back end designed but never written to.** Migration 023 defines the full
delivery and assessment pipeline: school_educators, pupils,
lesson_deliveries, check_responses, teacher_judgements,
action_commitments, evidence_items, generated_reports (kinds include
governor_pack, evidence_pack, impact_report). Row counts today: all zero.
Not one line of application code references any of them. school_accounts
2, school_classes 1, invoice_requests 3, public.stage_passports 0.

**Documentation gap.** CLAUDE.md routes school features to schools/01 and
docs/09; neither path exists in this repo. THE-STORY.md section 6 still
describes the schools catalogue as "open with no login", stale since the
15 August gate.

---

## REPORT 2 — GOVERNMENT REQUIREMENTS

The verified register, 14 items. Full sources and grading in the sweep;
what each requires a school to DO, with class.

1. **RSHE statutory guidance** (DfE, 15 July 2025, compulsory 1 September
   2026, so in force now). Names deepfakes, misogynistic content,
   gambling, pornography harms. Schools must publish an RSHE policy,
   consult parents, and provide a materials viewing route; confidentiality
   clauses cannot block parents seeing materials. Withdrawal right covers
   sex education only, with secondary opt back from three terms before 16.
   Class B on an A base. VERIFIED.
2. **KCSIE 2026** (in force 1 September 2026). Names generative AI,
   deepfakes, misinformation, disinformation, conspiracy theories; makes
   the annual filtering and monitoring review explicit. Class B (have
   regard is effectively mandatory) plus D. VERIFIED.
3. **Ofsted renewed framework** (in force 10 November 2025; report cards;
   toolkit version for use from September 2026 published). Online safety
   sits in Personal development and wellbeing plus the binary safeguarding
   judgement. Schools must evidence taught online safety and pupil digital
   wellbeing. Class C. VERIFIED (the September 2026 toolkit diff is an
   open check).
4. **DfE filtering and monitoring standards** (updated October 2024, June
   2026 AI update: a new AI tool triggers an out of cycle review). Class
   B/D plus C. VERIFIED.
5. **Computing programmes of study** (2013, still statutory). E-safety at
   every key stage. Curriculum and Assessment Review (November 2025):
   computing rebalanced toward digital literacy, revised curriculum spring
   2027, first teaching September 2028. Class A. VERIFIED.
6. **SEND Code of Practice** (2015, still in force; new code phasing
   2026 to 2028 announced in the February 2026 White Paper). Graduated
   approach; digital literacy lessons must be adaptable. Class A/B.
   VERIFIED.
7. **Equality Act 2010.** Materials must not discriminate and must be
   accessible; PSED due regard when commissioning materials. Class A.
   VERIFIED.
8. **Prevent duty** (2023 statutory guidance, updated March 2025). Build
   resilience to radicalisation through the curriculum; online
   misinformation and extremist content explicitly in scope. Class A.
   VERIFIED.
9. **ICO Children's Code** (statutory code, 2021). Edtech providers ARE in
   scope; profiling off by default; schools must DPIA edtech. Constrains
   us as a provider more than the school. Class A plus statutory code.
   VERIFIED.
10. **Online Safety Act** (Protection of Children Codes in force 25 July
    2025). Duties fall on platforms, not schools; it is the environment we
    teach about. Class A for platforms, D context for schools. VERIFIED.
11. **Under 16 social media ban** (announced 15 June 2026, powers in the
    Children's Wellbeing and Schools Act 2026; regulations NOT yet laid;
    force expected spring 2027, unconfirmed; 15 July 2026 announcement of
    curfews and engagement features off for 16 to 17s). Nothing for
    schools yet; drives our social_media_law flag and Stage 4 content.
    Class A pending. VERIFIED as state.
12. **Teaching Online Safety in Schools** (DfE, last confirmed update
    January 2023). The underpinning knowledge model our curriculum already
    follows. Class E plus C. LIKELY current; open check for a later stamp.
13. **DfE generative AI in education** (January 2025 papers plus June 2025
    materials; product safety expectations for any GenAI used with
    pupils). Class E hardening toward B. VERIFIED.
14. **Recent quarter sweep**: new statutory suspensions and exclusions
    guidance in force 26 July 2026 (relevant where online behaviour drives
    sanctions), Ofcom media literacy statement scheduled June 2026
    (publication unconfirmed, open check). VERIFIED / UNVERIFIED as noted.

**Two open checks before the register is stamped final**: the gov.uk
Teaching Online Safety in Schools page for any post January 2023 update,
and the September 2026 Ofsted toolkit diff plus the Ofcom June 2026 media
literacy statement (gov.uk and ofcom.org.uk are unreachable from this
sandbox; a one minute manual check or a later session closes both).

---

## REPORT 3 — COMPLETE COMPLIANCE MATRIX

Requirement by requirement against what is shipped, with the brief's
coverage labels. GDC PROVIDES versus SCHOOL RESPONSIBILITY is stated for
each, and must also become data (see roadmap P1); today the distinction
lives in copy only.

| Requirement | Class | Where it lands in GDC | Coverage | School still must |
|---|---|---|---|---|
| RSHE 2026 named harms (deepfakes, misogyny, pornography, gambling) | A/B | ks3-12, ks3-14, ks4-15 to 18; RSHE mapping doc | PARTIALLY COVERED. ks3-12 (misinfo and deepfakes) is the weakest module in the DB: no worksheet, shortest scripts | Adopt policy, consult parents |
| RSHE parental materials viewing route | B | /hub/parents pack; open /curriculum map; print packs | COVERED, NEEDS IMPROVEMENT. The route exists but is not named as the statutory viewing route anywhere | Publish policy, run the viewing route |
| RSHE withdrawal rules | B | Not stated anywhere in product copy | MISSING (one paragraph of guidance in the parents pack fixes it) | Operate withdrawal |
| KCSIE 2026 online safety themes | B/D | dsl_note on all 10 flagged modules (substantive, concern form linked); /hub/dsl crosswalk; CPD briefings for M08, M14, M16, M17, M18 | STRONGLY COVERED for content; PARTIAL for staff (5 of 21 modules briefed) | Staff training, policies, annual review |
| KCSIE filtering and monitoring annual review | B | Out of scope for a curriculum product; /hub/data-protection notes it | NOT OURS. Say so plainly | Entirely school side |
| Computing PoS e-safety strands | A | All 21 modules; EfCW strands and statutory hooks stored per module | STRONGLY COVERED | Timetable it |
| Ofsted personal development evidence | C | Hub documents, year plan, RSHE matrix | PARTIALLY COVERED. Documents yes; delivery and coverage evidence NO (nothing is recorded) and the FAQ claims otherwise | Judge and evidence provision |
| Prevent through curriculum | A | ks4-18 radicalisation and misogyny; ks3-12 misinformation | COVERED | Wider Prevent duty |
| SEND adaptable materials | A/B | differentiation.support/stretch on 21/21; paper_fallback 21/21 | PARTIALLY COVERED. One sentence each, no SEND or EAL specificity | Graduated approach |
| Equality Act accessible materials | A | rem based tokens; player keyboard support | PARTIALLY COVERED. Player ARIA and reduced motion are weak | PSED, adjustments |
| ICO Children's Code (us as provider) | A | No accounts, no pupil data, profiling impossible by architecture | STRONGLY COVERED, best in class posture | DPIA on adoption (we should hand them the template) |
| Under 16 ban readiness | A pending | ks4-19 readiness at 16; wall at sixteen positioning; social_media_law flag (docs/11) | STRONGLY COVERED and ahead of the market | Nothing yet |
| GenAI product safety expectations | E to B | DiGi is a parents app feature; the schools app ships no pupil facing AI | NOT APPLICABLE today; becomes A grade work if DiGi enters classrooms | Risk assess any AI tools |
| AI literacy teaching | E/F/G | ks5-20; ailit_domains tagged on only 7/21 modules | PARTIALLY COVERED as data, better in content | none |

Statutory floor verdict: content coverage of every relevant statutory
requirement exists or is one module fix away. The genuine exposures are
evidential (Ofsted row) and the ks3-12 weakness sitting exactly on the
most named statutory ground. Enhanced standard (G) areas already beyond
statutory: the passport, the home bridge, calibrated pathways, the wall at
sixteen framing, character led delivery, the open map.

---

## REPORT 4 — PROVIDER BENCHMARK

From the July landscape sweep (digital-literacy-landscape.md), the August
Common Sense review, and lesson-standard-plan.md. One line each, then what
the strong ones do that we must match.

- **Common Sense Education**: the world standard, free, dilemma based,
  Harvard partnership; US framed, weak behaviour change evidence, assets
  behind a free account.
- **ProjectEVOLVE (SWGfL) / UKCIS EfCW**: the de facto national framework
  and free toolkit, complete 3 to 18, assess then teach; utilitarian, text
  heavy, no characters, weak parent link. We map to its strands as data.
- **Oak National**: lessons as two or three named learning cycles, full
  deck and pack downloadable; sets the expectation that a school can take
  the materials away.
- **White Rose**: the default scheme (64 percent of surveyed teachers) by
  small steps, an open public map, versioned changes announced. Our
  curriculum map already copies the open map rule; the small step
  discipline is the standard our slides are judged against.
- **Kapow**: teacher video per unit (CPD disguised as prep); the
  lesson-standard-plan verdict stands: our per lesson record already beats
  what Kapow publishes, but far less of ours reaches the teacher.
- **PSHE Association / Jigsaw**: the statutory PSHE spine, 3 to 16 spiral;
  online safety a thread, not a specialism, slide led.
- **National Online Safety**: compliance and CPD giant, trains adults,
  no engaging pupil curriculum.
- **Natterhub, Interland**: the immersive primary products; stop at 11.

Field wide failures that are our openings (verified in the landscape
research): knowledge to behaviour is everyone's failure; no provider owns
a delightful 4 to 16 pathway; AI is bolted on everywhere; the home to
school link is broken; teacher burden versus pupil delight is treated as
either or. Our differentiators map one to one onto those five.

What the benchmark says we must match before claiming parity: Oak's
takeaway downloads (we have print, not deck download), Kapow's per unit
teacher video (our films are marketing, not CPD), ProjectEVOLVE's
assess then teach loop (our assessment is designed, unwired: Report 11).

---

## REPORT 5 — GDC GAP ANALYSIS

The brief's four buckets, honestly.

**STRONG (keep as is).** The 21 module content base (458 slides, zero
missing scripts, misconceptions and differentiation everywhere). The run
sheet. The Hub's nine live generated documents. The privacy architecture
(nothing to breach). The passport concept and verify lane. The home code
bridge, live end to end. The open curriculum map and philosophy page. The
statutory hook and EfCW tagging as data.

**PARTIAL (improve in place).** Interactives: six built, two used, one
module. Title characters: 8 of 21 modules. Learning record: 1 of 21.
ailit_domains: 7 of 21. Video: 5 modules, 8 slides, beats on 1. CPD: five
briefings, no pathway. SEND: sentences, not adaptations. Player
accessibility: partial. parent_note.passport: 1 of 21 (the passport card
on the lesson page covers the gap from the PASSPORT_STAGE map, so this is
data hygiene, not a user facing hole).

**MISSING.** Delivery recording, per pupil assessment capture, coverage
tracking, evidence exports: the whole 023 pipeline (schema exists, zero
code). Staff onboarding and SLT/governor surfaces. SEND and EAL
specificity. Withdrawal rules copy. A ks3-12 worksheet. Deck download.
Graduation (planned, 2026-08-29 plan).

**UNNECESSARY DUPLICATION.** None found at module level; the 21 module
spiral holds. Two adjacent risks: the parents app and schools app both
carry lesson players by design (shared component, fine), and the brief
itself arrived proposing structures that already exist (six phases, the
Planet Friends), which the reconciliation notes in
plans/2026-08-31-master-audit.md close.

**The single biggest exposure, named plainly.** The product's centre
holds a structural contradiction. schools/lib/access.ts and
/hub/data-protection promise "no session, no user, no personal data of
any kind". The FAQ (lines 16 and 20), the home page (lines 24 and 336)
and the player's own end of lesson copy (LessonPlayer.tsx lines 977 and
841) sell one tap delivery recording, live coverage, per pupil judgements
and per child progress evidence. None of that exists in code. Either the
copy moves or the build moves, and until one does, the FAQ answer a head
would read before an Ofsted visit is false. This is P0.

---

## REPORT 6 — DIGITAL PASSPORT AUDIT

**Canon, confirmed everywhere it appears.** Never a licence, never a
permission slip, never pass or fail. The lesson page copy is carefully
right: "credit toward that page", "the passport never records where a
page was filled". The brief's section 25 matches the shipped canon
exactly. Name stays The Guided Childhood Passport (trademark decision, 30
August; the brief's own PRESERVE principle points the same way; flagged,
not silently decided).

**How it works today.** Computed, never stored (lib/pathway/progress.ts);
rendered in the parents app (PassportBook, PassportStamps, StageRoad);
public verification at /verify/[code] shows first name and stamps only,
exact match or 404; public.stage_passports table exists with zero rows.
School lessons feed it through the home code bridge: HOME-XXXX printed on
page 5 of every pack, redeemed in the parents app, recorded as
lesson_source='school_lesson', deliberately not counted toward stage
stamps.

**How it should connect to outcomes (the brief's question).** The
connective tissue already exists as data: every module carries a
PASSPORT_STAGE mapping and a single action outcome; the assessment block
defines teacher_judgement and action_commitment. The missing link is any
record that a child met an outcome. Two honest routes, which are not
exclusive: (a) home route, already live, where the family completes the
matched lesson and the passport page fills at home; (b) school route,
which requires the 023 pipeline and real identity, a product line
decision, not a patch. Until (b) is decided, the passport's outcome
connection is the home route plus the printed learning record, and copy
must say so.

**Gaps.** parent_note.passport on 1 of 21 (the stage map covers display;
backfill is hygiene). Graduation: two prose mentions, no route, no gate,
no certificate; the 2026-08-29 plan holds the design. stage_passports
zero rows means nothing verifiable has ever been issued; the verify lane
is ready ahead of demand, which is the right order.

---

## REPORT 7 — ONE-CLICK LESSON AUDIT

The brief's question: what currently prevents the ideal teacher
experience.

**Already true.** A teacher with a class code is genuinely one click from
teaching: /lesson/[module] → Teach → a player with every script, timing
chips, phase strip, keyboard and swipe, discussion timers, projector
typography. The run sheet covers the walk through case. The five minute
teacher test passes for preview → teach on the strength of what ships.
The brief's list of things a teacher should never do (research, build
slides, invent activities, look up answers, work out safeguarding) is
met by the content base for 20 of 21 modules.

**What blocks the ideal, in order of weight.**
1. Nothing persists. completeEndpoint is null by design; no register, no
   delivery record, nothing a teacher did last week. The player then tells
   the teacher "one tap on the register records the delivery", which is
   false (the copy contradiction, Report 5).
2. The interactive layer is unshipped. Six components, 2 slides in one
   module. Twenty modules teach persuasion, algorithms and spread with no
   feed-loop, no spread-race, no signal-meter. This is the largest gap
   between what is built and what a child experiences.
3. ks3-12 is below standard: no worksheet, 200 average script, on the
   most statutory ground we cover.
4. No deck or pack download (Oak expectation); print only.
5. Teacher cannot adjust anything: no timing override, no hide slide, no
   note to self. Acceptable for v1; listed for completeness.
6. Character warmth is inconsistent: title characters on 8 of 21 modules
   (approved clips exist for the other three planet friends; wiring KS1
   to KS3 is one migration away once Justin approves the casting).

---

## REPORT 8 — STAFF TRAINING GAP ANALYSIS

**Exists.** /hub/cpd: five safeguarding register briefings (M08, M14,
M16, M17, M18) with covers / register / watch for / disclosure / line,
printable, honestly disclaimed ("support your safeguarding training, they
do not replace it"). /hub/dsl as reference. The run sheet is implicit
just in time training per lesson, and it is good.

**Missing.** Essential onboarding (the home page currently markets its
absence as a feature: "no training session first"; that positioning is
right for sales and still needs a fifteen minute induction page behind
the gate for the school that wants it). Subject knowledge CPD for adults.
A DSL facing module with scenario practice. Anything for subject leads,
SLT or governors (generated_reports even names governor_pack; never
generated). Training records: impossible under the no identity
architecture; if training becomes product, completion must live on the
school account, not a person, or wait for the identity decision.

**Verdict.** Training is the biggest genuinely absent product area (the
brief treats staff training as product, section 8). It is also the
cheapest to start: CPD briefings for the remaining 16 modules and one
induction page are content work on an existing pattern.

---

## REPORT 9 — SAFEGUARDING GAP ANALYSIS

**Strong.** Safeguarding by design in the data: all 10 modules flagged as
requiring a DSL note carry a substantive note with concern_form_linked
true; the other 11 explicitly record required false, which is itself
evidence of a considered pass. The /hub/dsl crosswalk maps module to
statutory hook to disclosure note, generated live. The five CPD
briefings cover the heaviest modules (sextortion, radicalisation,
consent and image law among them). Content never promises safety, never
allow/deny, always a calibrated pathway and help seeking (KCSIE 2026
themes are taught, not just filtered).

**Gaps.** No disclosure recording, stated honestly in
/hub/data-protection ("No disclosure recording"), and that is the correct
current posture given no identity; the gap is that the product does not
say what a school SHOULD do instead beyond the crosswalk (a one page
disclosure flow insert in the DSL doc closes it). CPD covers 5 of 10
flagged modules; the other five flagged modules (including ks1-02 and
ks2-07/08, ks3-10/11/12/14 among the flagged set) deserve the same
briefing treatment. No safeguarding changelog: when KCSIE changes, no
surface says "what changed for you"; the register (Report 2) makes this
nearly free to generate annually.

---

## REPORT 10 — SEND / ACCESSIBILITY GAP ANALYSIS

**Data.** Differentiation is exactly two free text sentences per module
(support, stretch), 21 of 21. Rendered as "Reaching everyone". Zero
substantive hits repo wide for SEND, EAL, adaptive teaching or
scaffolding. paper_fallback (21/21) is the strongest inclusion feature
and is about devices, not learners.

**Player.** Reduced motion honoured in exactly one place (phase strip
auto scroll); GSAP reveals, DiGi animation, timers and interactives are
not reduced motion aware. ARIA sparse: no live regions, no slide change
announcement, two labels across all six interactives. Keyboard works;
no authored focus ring. The rem token migration (tokens.css, 4,279
hardcoded sizes replaced) means OS text size reaches every screen, which
is genuinely good; LessonPlayer still carries dozens of inline clamp/px
sizes.

**Required by.** SEND Code (A/B), Equality Act (A), and the brief's own
SEND specificity mandate. The new SEND Code phasing 2026 to 2028 will
raise the bar further.

**Fix shape.** Per module SEND adaptation is content work on the
existing teacher_notes shape (add send_adaptations alongside
differentiation, following the misconceptions pattern). Player
accessibility is one focused engineering pass: honour
prefers-reduced-motion globally, add a slide live region, focus styles,
labels on interactives. An accessibility statement page belongs in the
Hub. None of this needs identity or new architecture.

---

## REPORT 11 — ASSESSMENT GAP ANALYSIS

Richly designed, almost entirely unwired. The complete state:

| Surface | State |
|---|---|
| Worksheet expected_verdict + teaching_point | LIVE on paper: answer key page 4, 120/120 items (ks3-12 has none) |
| Prove phase | LIVE as structure in every deck |
| choice slides (105 across DB) | LIVE in lesson, ephemeral; 70 percent pass gate computed then discarded; never persisted |
| Exit tickets / retrieval cards | LIVE on paper (pack page 5) |
| My Learning Record (i_can) | LIVE for 1 module of 21 (migration 200); button hidden elsewhere |
| assessment jsonb (retrieval_starter, in_lesson_checks, exit_quiz, teacher_judgement, action_commitment) | AUTHORED 21/21, read nowhere except what the pack prints |
| check_responses, teacher_judgements, lesson_deliveries, action_commitments | SCHEMA ONLY, zero rows, zero code |
| Baseline | parents app concept only |
| DiGi five question stage check | parents app only |

Per pupil recording in the schools app today: none, by architecture, and
the code says so in plain comments. The White Rose plan's standard holds:
assess at two grains, refuse grade boundaries; nothing shipped violates
it because almost nothing shipped records.

**The decision this report forces** (it is the same decision as Reports
5, 7 and 12): either assessment stays paper and copy says paper proudly,
or the 023 pipeline gets built with real educator identity. The honest
middle exists and is small: extend the learning record to 21 modules and
name the paper loop as the product ("the record is the child's book, not
our database"), which matches the privacy posture we sell.

---

## REPORT 12 — LEADERSHIP / ADMIN / COMPLIANCE EVIDENCE GAP

**Strong.** The Hub's nine documents are genuinely good compliance
provision: policy, data protection, RSHE matrix, DSL crosswalk, year
plan, vocabulary, parents pack, FAQ, CPD, all generated from the
database so they cannot drift from the taught curriculum. For a
paperwork audit, a school subscribing today gets more than most paid
competitors ship.

**Missing.** Everything live: no coverage state (the curriculum page says
so honestly), no delivery record, no evidence pack, no head or governor
surface. generated_reports enumerates coverage, progress, governor_pack,
evidence_pack, impact_report, dsl_summary; none has ever been generated.

**False today, must move first**: /hub/faq line 20 answers the Ofsted
question with "Delivery is recorded with one tap per lesson, coverage
builds live on the curriculum map, per pupil judgements take a tap
each"; line 16 claims we hold "a first name and initial... and lesson
delivery records"; the home page sells "the coverage record a school can
show"; /hub/data-protection line 37 repeats the first name claim. The
app holds nothing. Fixing these sentences is an afternoon and it is P0
regardless of which way the recording decision goes, because today's gap
between promise and product would fail any due diligence a MAT ran.

**GDC PROVIDES vs SCHOOL RESPONSIBILITY** should become a rendered
section of the policy and FAQ documents (the brief wants it in backend
mapping, dashboard, exports and marketing; the documents are the shipped
surface it can land in this quarter).

---

## REPORT 13 — PARENT PATHWAY INTEGRATION GAPS

**Live and working.** parent_note on 21/21 renders on the lesson page
("What goes home"), the run sheet and pack page 5. The home code bridge
is live end to end: printed code → parents app redemption →
lesson_completions tagged school_lesson → star lesson catalogue,
deliberately outside stage stamps. Passport verify lane live. The
parents consultation pack (/hub/parents) exists and matters more now the
RSHE viewing right is in force.

**Gaps.** No school side view of redemption (by design; keep, but say it
in the FAQ so it reads as principle, not absence). parent_note.passport
1/21 (hygiene backfill). Withdrawal rules unstated (Report 3). The RSHE
materials viewing route exists in substance (open map, printable packs)
but is never named as the statutory route; one paragraph in the parents
pack and policy doc claims that credit. Graduation unbuilt (planned).

**Judgement.** This is the healthiest report of the six gap areas. The
home to school thread the whole field lacks (Report 4) exists here in
working code; what remains is naming and finishing, not building.

---

## REPORT 14 — PRIORITISED PRODUCT ROADMAP

P0 fix before claiming complete provision; P1 excellent delivery; P2
differentiator; P3 future. Size in brackets. Nothing below starts before
Justin approves these reports.

**P0**
1. Make every sentence true (SMALL). Rewrite /hub/faq 16 and 20,
   /hub/data-protection 37, home page 24 and 336, LessonPlayer 977 and
   841 to describe the paper loop and privacy posture we actually ship.
   Copy work only; no recording claims survive.
2. ks3-12 misinfo and deepfakes to standard (SMALL/MEDIUM). Worksheet
   with expected verdicts, scripts to the 350+ norm. It is our weakest
   module on the most statutory ground.
3. Statutory naming pass (SMALL). RSHE viewing route named in the
   parents pack and policy; withdrawal rules paragraph; GDC PROVIDES vs
   SCHOOL RESPONSIBILITY section in policy and FAQ.
4. Close the two register checks (SMALL, needs a browser outside the
   sandbox): TOSIS update stamp; Ofsted Sept 2026 toolkit diff and Ofcom
   June statement.
5. Player accessibility pass (MEDIUM). Global reduced motion, slide
   live region, focus styles, interactive labels, accessibility
   statement in the Hub. Equality Act adjacent; also blocks school
   procurement checklists.

**P1**
6. Interactives into the spiral (MEDIUM/LARGE, content). Every module
   gets its matched component (feed-loop for algorithms, spread-race for
   misinfo, signal-meter for persuasion...); the six exist, 20 modules
   wait. Follow the eyfs-01/199 pattern, one migration per key stage.
7. THE RECORDING DECISION (decision, then LARGE if yes). Paper proudly,
   or build 023 with educator identity. Everything in Reports 11 and 12
   hangs on it; recommend deciding after the first paying school's
   feedback, not before.
8. Learning record to 21/21 (MEDIUM). i_can per module, the record
   button everywhere; it is the paper answer to assessment evidence.
9. CPD briefings for the remaining flagged modules + one induction page
   (MEDIUM). Starts training as product on the shipped pattern.
10. SEND adaptations per module + ailit_domains and
    parent_note.passport backfill (MEDIUM). Data completeness on
    existing shapes.
11. Title characters for KS1 to KS3 (SMALL, one migration, needs
    Justin's casting approval).

**P2**
12. The gold standard exemplar lesson (brief section 66): pick one
    module (recommend ks3-12 straight after its P0 fix, killing two
    birds), take it through the 15 pass QA to 90+, and make it the
    template every ENHANCE pass follows.
13. Deck and pack download (MEDIUM). The Oak expectation.
14. Evidence pack v1 (MEDIUM if paper route: a generated PDF bundling
    year plan, coverage intent, RSHE matrix, signed off by the school,
    no pupil data). Governor pack same pattern.
15. Lesson films into lessons (MEDIUM once credits topped up): the six
    marketing films finish, then video_beats per module via the
    lesson-video skill.
16. Safeguarding changelog page, annual, from the register (SMALL).

**P3**
17. Graduation and certificates (2026-08-29 plan).
18. Behaviour measures per strand (the field's open credential,
    Report 4).
19. 2028 curriculum positioning: map our modules onto the revised
    digital literacy heavy PoS the day the draft lands (spring 2027).
20. DiGi in the classroom (would trigger the GenAI product safety
    expectations, Report 3; not before).

**Sequence note.** After approval the brief's own order applies: the
definitive curriculum table with KEEP / ENHANCE / MERGE / UPDATE / NEW /
RETIRE labels (Report 5 already implies most labels: nothing currently
earns RETIRE), then ONE gold standard exemplar (item 12), then scale.
Not mass production first.

---

## What is needed from Justin

1. Read and approve (or amend) these reports; nothing gets rebuilt until
   then.
2. The two one minute browser checks in Report 2 if wanted sooner than
   the next session with open egress.
3. The P1 recording decision can wait; the P0 copy fix cannot, and I can
   ship it the moment the reports are approved.
