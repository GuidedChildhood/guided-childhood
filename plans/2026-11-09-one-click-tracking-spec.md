# 10. One click lesson tracking and automated reporting: audit and specification (9 November 2026)

Justin, 9 November 2026: "One lesson. One click. All relevant records updated."
Audit first, smallest effective changes, nothing built until approved.

This is the audit and the spec. Nothing in it is built yet.

---

## 1. Current functionality (what exists today, with file paths)

### 1.1 A tracker exists, but it lives in one browser

| Piece | Where | What it does |
|---|---|---|
| Step model | `shared/schools-progress.ts` | Nine steps per lesson (read, lookback, pack, record, board, taught, passport, dsl, notes_home), each `auto` or `yours`, stored in **localStorage** |
| Taught on finish | `schools/components/tracker/TrackedPlayer.tsx:31` | The deck reaching its finish slide calls `markStep(moduleId, 'taught')`. **This is already a zero click delivery signal**, just stored in the wrong place |
| Passport fill | `shared/schools-taught.ts` | Module ids whose passport page the class filled, localStorage |
| Run sheet panel | `schools/components/tracker/TrackerPanel.tsx` | What is left on a lesson, each row carrying the tap that does it |
| Roll up | `schools/app/hub/tracker/` | Every lesson, done or not, plus "N of 57 statutory requirements evidenced", prints as a coverage sheet with an appendix |

The tracker page says it plainly: *"Counted on this screen only, in this browser. A
different laptop shows nothing, a shared classroom machine shows the last teacher's."*
So a school with three teachers on three laptops has three partial records and no
whole school view. **That is the gap the whole request is about.**

### 1.2 The curriculum mappings already exist and are audited

Every lesson already knows what it covers. Nobody needs to map anything again.

| Framework | Source of truth | Granularity |
|---|---|---|
| RSHE 2026 statutory (57 requirements) | `shared/schools-rshe-2026.ts` (`RSHE_2026`, `RSHE_2026_SOURCE`, verdict FULL / PARTIAL / BY_DESIGN) | requirement to module |
| National curriculum computing | `shared/schools-computing-pos.ts` (`COMPUTING_POS`, verdict FULL / PARTIAL / YOUR_SCHEME) | statement to module |
| UKCIS Education for a Connected World | `shared/efcw.ts` + `school_lessons.efcw_strands` | strand per lesson row |
| RSHE 2025 named topics | `shared/schools-curriculum.ts` `rshe` | topic per module |
| AI literacy | `school_lessons.ailit_domains` | domain per lesson row |
| Statutory hooks | `school_lessons.statutory_hooks` | per row |
| Learning objectives | `school_lessons.teacher_notes.i_can` | **37 of 37 rows have them** |
| Assessment items | `school_lessons.assessment` | **37 of 37 rows have them** |

The tracker already credits only FULL verdicts, so it does not overclaim. That rule carries over.

### 1.3 Who a "school" is

- No accounts, no logins, no sessions. A school has a **code** (`SCHOOLS_ACCESS_CODES`,
  `SCHOOLS_PILOT_CODES` env lists) that becomes a signed cookie (`schools/lib/access.ts`).
- `schools/lib/licence.ts` `currentSchool()` reads the verified code server side.
- `shared/parent-share.ts` `schoolShareRef(code, secret)` already turns a code into a
  **pseudonym** that never reveals the code. This is exactly the key a delivery record needs.

### 1.4 Lesson categories that actually exist

| Category in the request | In the platform today |
|---|---|
| PSHE / RSHE, online safety, computing, AI literacy, social media and algorithms, digital wellbeing, device readiness | **The 34 scheme modules**, EYFS to KS5 (`schools.school_lessons`, `CURRICULUM`). These are topics across one lesson type, not separate types |
| Standalone lessons | **3 rows** (entrepreneur, smart glasses, what problem would you solve), outside the scheme sequence |
| Workshops | **Marketing only** (`schools/lib/workshops.ts`, hidden). No workshop lesson exists yet; phase 2 would add the flagship as a lesson row |
| Assemblies | **None exist** |
| Tutor time activities | **None exist** |
| Cross curricular | Not a type; a property of mapping |

So the test "every existing lesson category" today means: scheme modules at each key
stage, and standalone lessons. The spec still designs for the other three so they slot
in with no new tracking code.

### 1.5 Locked positions this request runs into

1. **29 August 2026, "bridge b"** (`plans/2026-08-29-passport-codes-and-graduation-plan.md`,
   restated in `plans/2026-09-16-lesson-tracker-plan.md`): *no lesson delivery state on the
   server*. **Everything in this request needs that rule reversed for delivery records.**
2. **DPA and privacy policy** (`schools/lib/legal/dpa.ts:88`): *"No pupil data, no teacher
   accounts and no session data, by design ... the classroom player sends nothing to the
   server."* That sentence becomes untrue the day this ships, so the legal text changes
   in the same PR. The DPA already anticipates it (`dpa.ts:42`: a feature storing class
   records makes us the school's processor, section 5 applies automatically).
3. **No pupil data, ever.** Unchanged. Nothing here records a pupil.

---

## 2. Missing functionality

| Required | Status |
|---|---|
| Delivery record that survives the laptop | MISSING (localStorage only) |
| Whole school view across teachers | MISSING |
| Mark Delivered button | PARTIAL (the finish slide records silently; there is no visible button and no confirmation) |
| Class or year group on a delivery | MISSING |
| Academic year | MISSING |
| Lesson version | MISSING (rows change through migrations with no version stamp) |
| Optional assessment (whole class or per objective) | MISSING (objectives exist on every row, nowhere to record an outcome) |
| Correction with audit trail | PARTIAL (a local unmark, no trail) |
| Multi class delivery (assembly, workshop) | MISSING |
| Planned vs delivered vs assessed | PARTIAL (planned = the year plan sequence; delivered = local; assessed = nothing) |
| Reports | PARTIAL (one coverage print; no progression, assessment, online safety, SLT or pilot report; no CSV) |
| Teacher / lead / SLT views | MISSING (one page) |
| Cross school isolation | n/a today (nothing on the server); must be designed in |
| Lesson type field | MISSING (`school_lessons` has `audience` only) |

---

## 3. Proposed teacher journey

```
Open lesson  ->  teach it on the board  ->  finish slide
                                              |
                       +----------------------+----------------------+
                       |  MARK LESSON DELIVERED   (one big button)   |
                       |  Class: 6B  (remembered on this device,     |
                       |              tap to change; add another     |
                       |              class for an assembly)         |
                       +----------------------+----------------------+
                                              |
                                  Delivered. Saved for St Example.
                                  How did the class do? (optional)
                         [ Secure ] [ Developing ] [ Needs revisiting ] [ Skip ]
                                  By objective instead  ›   Add a note  ›
                                              |
                                            Done
```

- **One tap** when the class is remembered. The first time on a device the class field
  is the only thing asked, because it is the only thing the system cannot know.
- The button also sits on the lesson page and the run sheet, for a lesson taught from paper.
- **Delivered is never assessed.** Skipping the assessment stores `not_assessed`, shown
  as such everywhere.
- Undo sits on the confirmation for ten minutes. After that a record is corrected from the
  tracker with a reason, never deleted.
- The silent finish slide signal stays as a prompt ("You reached the end: mark it
  delivered?"), not an automatic record, so previewing a deck at home never counts.
- Works the same at 390 px, a tablet and the board; the buttons are the house chunky
  buttons, 56 px tall.

---

## 4. Reusable tracking architecture

### The one rule

**Store the event once. Compute everything else at read time.**

A delivery row says *this school taught this lesson version to these groups on this date,
and (optionally) this is how they did*. It stores **no** framework credits. Every
dashboard and report joins the row to the audited mapping files when it is read. So:

- a lesson mapped to RSHE, computing and UKCIS is **one delivery**, credited to three
  frameworks; lesson counts count rows, framework counts count distinct requirements;
  **no double counting is possible**;
- correcting a mapping (the audit finds a PARTIAL that should be FULL) fixes every past
  report on the next load, with no data migration;
- adding a framework later is a new mapping file, not a schema change.

### Lesson identity and type

- `school_lessons.module_id` stays the stable id.
- Add `school_lessons.lesson_type` text, check in `scheme`, `standalone`, `workshop`,
  `assembly`, `tutor_time`, default `scheme`. The three standalone rows are set once.
  An assembly or tutor time activity is a new row of that type and is tracked by the same
  button with no new code.
- Lesson version: a trigger keeps `school_lessons.content_hash` = md5 of slides plus
  assessment. The delivery stores the hash it was taught from, so a report can say which
  version a class met.

### School identity

- `school_ref` = `schoolShareRef(code)`, the existing pseudonym. The code itself is never
  stored. Pulling a code from the env list locks the school out of its records the same way
  it locks it out of the lessons, and re-issuing the same code restores them.
- **Isolation is structural, not a filter someone can forget**: the browser never sends a
  school id. Every read and write runs in a server action that derives `school_ref` from
  the verified cookie. RLS is on with **no anon or authenticated policy**, so the table is
  unreachable except through those actions.

---

## 5. Database and API requirements

One migration (next free number checked against origin/main and open PRs at claim time).

```sql
schools.lesson_deliveries
  id              uuid pk
  school_ref      text not null            -- pseudonym of the code
  module_id       text not null            -- references school_lessons.module_id
  content_hash    text not null            -- the version taught
  delivered_on    date not null default current_date
  academic_year   text not null            -- '2026-27', computed: Sept to Aug
  groups          text[] not null          -- ['6B'] or ['Year 5','Year 6'] for an assembly
  year_groups     int[]                    -- parsed from groups where possible, for filters
  taught_by       text                     -- OPTIONAL initials, decision C below
  assessment      text                     -- secure | developing | revisit | not_assessed
  objective_marks jsonb                    -- { "0": "secure", "2": "revisit" } by i_can index
  note            text                     -- OPTIONAL, 280 chars, decision D below
  status          text not null default 'delivered'   -- delivered | withdrawn
  created_at, updated_at timestamptz
  index (school_ref, academic_year)

schools.lesson_delivery_events             -- append only audit trail
  id, delivery_id, school_ref, action (created | assessed | corrected | withdrawn | undone),
  before jsonb, after jsonb, reason text, at timestamptz
```

Server actions in `schools/app/hub/tracker/actions.ts` (the app already uses actions,
no new API surface):

- `markDelivered({ moduleId, groups, deliveredOn? })`
- `assessDelivery({ id, assessment?, objectiveMarks?, note? })`
- `correctDelivery({ id, changes, reason })`, `withdrawDelivery({ id, reason })`, `undoDelivery({ id })` (within ten minutes)
- `importThisScreen()`: one time button that lifts the localStorage ticks into the record, dated as they were, marked "imported", so no school loses what it has already done

Plus one read module, `schools/lib/records.ts`, holding the queries every view uses.
CSV is one route handler, `schools/app/hub/reports/[report]/csv/route.ts`, over the same queries.

Retention: the life of the licence plus one year, then deleted by a scheduled job (the parent
app crons already run). Stated in the DPA schedule.

---

## 6. Dashboard update logic

There are no accounts, so there are no roles to gate views. Anyone holding the school's
code sees the school's record, which is the same trust model as the lessons themselves.
**Three views, one page, one query**, as tabs on `/hub/tracker`:

| View | Reads | Shows |
|---|---|---|
| **My class** (teacher) | deliveries where groups contains the class remembered on this device | done, left (from the year plan for that key stage), assessment status, objectives marked revisit |
| **Curriculum** (subject lead) | all deliveries this academic year | coverage by year group, by framework (RSHE FULL credits, computing, UKCIS strands, AI literacy), delivered against the year plan, unassessed deliveries |
| **Whole school** (SLT) | the same rows, summarised | lessons delivered, statutory requirements evidenced, share assessed, top three gaps, the next lesson for each year group |

"Updates everywhere" is free: each view is server rendered from the table on load
(`dynamic = 'force-dynamic'`, as the tracker already is). No cache to invalidate, no copies.

**Missing data versus incomplete teaching**, shown as two different states: a year group
with no deliveries at all reads "Nothing recorded yet for Year 4" (possibly taught on paper,
not recorded); a year group part way through reads "3 of 6 delivered".

---

## 7. Reporting specification

All seven reports are **one print page and one CSV** each, under `/hub/reports/<name>`,
filtered by academic year (default current) and optionally key stage or year group. PDF is
the browser's print to PDF, the way every pack in the product already prints. Every report:

- has three columns that never merge: **Planned, Delivered, Assessed**;
- stamps the mapping version it used (`RSHE_2026_SOURCE` and the computing source);
- carries the same line at the foot: *"This records lessons delivered and the teacher's own
  judgement of the class. It is not a measure of pupil outcomes."*;
- regenerates on every load, so a correction shows up at once.

| Report | Built from |
|---|---|
| Curriculum coverage | year plan (planned) vs deliveries vs assessed, per year group |
| Progression | per objective: introduced (first delivery), revisited (a later lesson in the same strand), assessed (an objective mark) |
| Assessment | outcomes by lesson and objective; everything marked revisit, grouped |
| PSHE / RSHE | the 57 requirements, which delivered lesson evidences each (FULL only), PARTIAL listed separately with its reason |
| Online safety education | deliveries grouped by UKCIS strand plus AI literacy domains |
| School leadership | one page: totals, evidenced requirements, gaps, three next steps (computed: the lowest coverage strands and the next lesson in sequence) |
| Pilot impact | **Justin only**, across pilot schools, read through the Supabase MCP or a founder page in the parent app: lessons delivered, share assessed, feedback received. Never names a pupil; school names come from the invoice record, not the delivery table |

**No AI in any of it.** Every number is a SQL count over the delivery rows joined to the
mapping files. An optional narrative summary can come later, generated from the computed
figures only, and labelled as such.

---

## 8. Acceptance tests

| # | Test | How |
|---|---|---|
| 1 | One click delivery | Playwright: finish a deck with a remembered class, one tap, row exists |
| 2 | Every view updates | after test 1, all three tabs and all seven reports show the delivery |
| 3 | Mappings credited correctly | unit test: a module's credits equal its FULL rows in `RSHE_2026` and `COMPUTING_POS` and its row's strands |
| 4 | No double counting | unit test: one delivery of a three framework lesson = 1 lesson delivered, N distinct requirements; delivering it twice = 2 deliveries, same N |
| 5 | Unassessed stays unassessed | skip the sheet, every report shows "not assessed", none shows a percentage that includes it |
| 6 | Reports match records | test fixture of 12 deliveries, every report total asserted against a direct SQL count |
| 7 | Corrections | correct the date, withdraw one, undo one: reports change, events table holds all three with reasons |
| 8 | Assemblies and workshops | one delivery with groups ['Year 5','Year 6'] credits both year groups once each |
| 9 | No cross school leakage | two made up local codes (never a real school code), A cannot read, correct or count B's rows through any action or report; SQL test that anon and authenticated roles get zero rows |
| 10 | Desktop, tablet, mobile | Playwright at 390, 820 and 1440, keyboard only through the button and sheet |

Run against a KS1, KS2, KS3, KS4 and KS5 scheme lesson and one standalone lesson (the two
lesson types that exist), and a fixture assembly row to prove the type slots in.

---

## 9. Estimated effort and the simplest path in

Four PRs, each shippable alone, roughly five working sessions in total.

| PR | Contents | Size |
|---|---|---|
| 1 | Migration (two tables, `lesson_type`, `content_hash`), `records.ts`, server actions, the button on the finish slide, lesson page and run sheet, the assessment sheet, undo, import this screen, DPA and privacy text | Medium |
| 2 | `/hub/tracker` reads the server record; three tabs; correction and withdraw with reasons; missing vs incomplete states | Medium |
| 3 | The seven report pages and the CSV route | Medium |
| 4 | Pilot impact view for Justin, retention job, acceptance test suite in CI | Small |

**The simplest version that already solves the core problem is PR 1 plus PR 2.** That
alone gives one tap delivery, whole school records across laptops, assessment that is
never confused with delivery, and the existing coverage print fed by real data.

What it reuses rather than rebuilds: the finish slide signal, the step model's honesty
rules, the mapping files, the FULL only rule, the code cookie, the parent share pseudonym,
the print pattern, and the year plan as "planned".

What it deliberately does not do: teacher accounts, pupil records, attendance, per school
custom curriculum planning, AI generated evidence.

---

## 10. Decisions only Justin can make

| | Decision | Recommendation |
|---|---|---|
| A | Reverse the 29 August "no delivery state on the server" rule, for delivery records only | **Yes.** Nothing in this request is possible without it, and it needs no accounts and no pupil data |
| B | Who can see and correct the school's record | **Anyone with the school code**, as with the lessons. Roles need accounts, which is a large build and a new legal footing |
| C | Record who taught it | **Optional initials, off by default.** A teacher's name is staff personal data; initials keep the DPA simple |
| D | Free text note on a delivery | **Keep, 280 characters, with "no pupil names" under the box.** The DPA currently says no free text about pupils, so the wording changes to "free text written by staff, which must not name pupils" |
| E | Legal text | The DPA line "the classroom player sends nothing to the server" and the privacy policy change in PR 1. Worth a read before it ships |

## Decided, 9 November 2026 (Justin, through the question cards)

| | Decision |
|---|---|
| A | **Reversed** the 29 August "no delivery state on the server" rule, for delivery records only. No pupil data, no accounts. |
| B | **Anyone holding the school code** sees and corrects the record; corrections logged with a reason. |
| C | **Optional teacher initials**, off by default. |
| D | **Optional note, 280 characters**, "no pupil names" under the box. |
| E | Justin **reads the DPA and privacy wording** before the first tracking PR merges. |
| French | The Mark delivered button comes to French first among the improvements; French media **moves to our storage now**; French stays **hidden until launch**. |

Build order: PR 1 (records, button, assessment sheet, legal draft) then PR 2 (tracker on server records), with French wired into PR 1.
