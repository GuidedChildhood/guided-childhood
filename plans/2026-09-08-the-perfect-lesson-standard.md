# The perfect lesson standard

Justin, 8 September 2026, in one breath: are we sure each lesson really covers
what the RSHE matrix claims? Do we give teachers what the best providers give,
including the subject knowledge they need to learn the area before they teach
it? Can a panel of ten expert lenses, including Catherine Knibbs and the
practical family tech people, drive every lesson to perfect? Does AI run
through it? A live feed of changes, a hub blog that captures an email and keeps
schools updated automatically, a teacher facing DiGi for training and parent
questions, and the passport running through the lessons. Show me one lesson
worked all the way through.

This answers the first question with evidence, then plans the rest.

---

## 1. Are we sure we cover what the matrix claims? Almost, and here are the three that fail

Checked every one of the 45 topic claims in the RSHE matrix against what the
module's own deck and teacher notes actually contain.

**42 of 45 hold up. Three are padding**, and they fail the honesty note the
matrix itself prints ("a module is marked only where it substantively teaches
the topic"):

| Module | Claims | What the deck actually teaches | Its own statutory hook | Verdict |
| --- | --- | --- | --- | --- |
| ks2-04 screen routines | Online safety and harms | Routines, the cool down lap, where screens sleep, the bedtime spiral | "RSHE health and wellbeing" | **Drop the claim.** It is a wellbeing lesson and says so itself |
| ks1-03 real, pretend, computer | Online safety and harms | Three kinds of picture, the detective question | "EfCW managing online information" | **Drop the claim.** Media literacy, not safety |
| ks3-13 scams, fraud and money | Illegal online behaviours | The three tells, phishing, why accounts get stolen, stop check refuse | "Citizenship digital financial literacy" | **Teach it.** Fraud IS a crime and the lesson should say so |

The third is the interesting one. ks3-13 teaches a pupil to avoid being a
victim and never mentions that fraud is a crime, that there is a law, or that
Action Fraud exists. That is a real hole in a lesson a school buys partly for
its legal grounding, and it is a small addition rather than a rewrite.

So: two tags come off, one lesson gains a beat. After that the matrix is true.

### The other coverage gap: AI is mapped on 12 of 21 modules

`ailit_domains` exists on the table and is populated on **12 of 21**. Justin
asked whether we believe in including the AI future. We half do. The nine
unmapped modules need their AI literacy domains named, and several need an
actual AI beat rather than a tag.

---

## 2. Do we give teachers what the best providers give? Mostly, with one named hole

The teacher pack is genuinely strong. All 21 modules carry all 20 of these:

`essential_question` · `learning_objective` · `i_can` · `cycles` · `timing` ·
`prior_knowledge` · `key_learning_points` · `keywords` · `misconceptions` ·
`teacher_tip` · `equipment` · `differentiation` · `send` · `paper_fallback` ·
`tool` · `worksheet` · `worksheet_items` · `starter_quiz` · `exit_quiz` ·
`commitment_stem`

Plus per module: `statutory_hooks`, `efcw_strands`, `evidence_anchor`,
`assessment`, `parent_note`, `dsl_note`, and now the video `alternative`.

That is ahead of most providers on structure. **The hole is the one Justin
named**, and it is the difference between a lesson plan and a teacher who
understands the subject:

| Missing | What it is | Who does it well |
| --- | --- | --- |
| **Subject knowledge** | What the teacher needs to understand BEFORE they teach it. Not how to run the lesson, the actual content knowledge | Oak ships "teacher subject knowledge" per lesson |
| **Parent questions** | The three questions a parent asks after this lesson goes home, and how to answer them | Nobody does this well. It is our opening |
| **Hard pupil questions** | "But my brother does it" and "what if it already happened to me", with an answer that does not wing it | PSHE Association briefings |
| **The evidence base** | We carry one `evidence_anchor` string. A teacher challenged by a parent needs the actual source | Common Sense cites its research |

Four new fields. That is the whole gap, and it is what turns a non specialist
covering the lesson at ten minutes' notice into someone who can hold the room.

---

## 3. The expert panel: ten lenses, honestly built

Justin asked for the top educators in the field as ten agents driving every
lesson to perfect.

**One integrity rule first, and it is not negotiable.** No agent speaks AS a
named living person. We do not put words in Catherine Knibbs's mouth, or
anyone else's, and we never imply an endorsement nobody gave. What we do is
name the DISCIPLINE and cite the published work that informs it. That is
useful, honest, and it is the version a school's lawyer is comfortable with.

| # | Lens | Informed by | The question it asks of every lesson |
| --- | --- | --- | --- |
| 1 | **Cybertrauma** | Catherine Knibbs's published work on child cybertrauma | Could this re traumatise a child who has already lived it? Is the distancing doing its job? |
| 2 | **Practical family tech** | The hands on family tech educators | Does this advice actually work on a real device this term, or is it a poster? |
| 3 | **Safeguarding** | KCSIE 2026, the DSL role | What happens in the ninety seconds after a disclosure? Is the route named? |
| 4 | **PSHE pedagogy** | PSHE Association quality framework | Is this a PSHE lesson or a talk with slides? Where is the pupil voice? |
| 5 | **Explicit instruction** | Rosenshine, Oak's lesson structure | Retrieval, small steps, modelling, checks for understanding. Are all four there? |
| 6 | **Digital literacy frameworks** | Education for a Connected World, Common Sense | Which strand, which progression step, and what came before this? |
| 7 | **SEND and access** | The graduated approach | Can every child in the room reach this, including the one with no device at home? |
| 8 | **Adolescent development** | Developmental psychology | Is this age appropriate, and does it respect a teenager's autonomy rather than lecture it? |
| 9 | **Evidence** | The Odgers test | Would a hostile expert kill any claim on these slides? Is every number sourced and dated? |
| 10 | **The near future** | UNESCO AI competency frameworks, DfE AI guidance | Does this prepare a child for the world three years from now, not the one behind us? |

**How it runs.** A `lesson-council` skill, same STORM shape as `kids-research`:
ten lenses in parallel over one module, each returning findings against its own
question, then a contradiction map (they WILL disagree, and the disagreements
are the valuable part), then a single prioritised change list. Not a rubber
stamp: a lesson that passes all ten unchanged means the panel is too soft.

The four new teacher fields in section 2 are mostly written BY this panel:
lens 1 and 3 write the hard questions, lens 9 writes the evidence base, lens 2
and 4 write the parent answers, lens 5 and 6 write the subject knowledge.

---

## 4. The living hub: feed, blog, email, and DiGi for teachers

Four connected things Justin asked for. They share one spine: **a school signs
up once and never has to check whether anything changed.**

### 4a. The changes feed

A dated feed of what moved: a KCSIE update, an Online Safety Act phase, an
Ofcom code, a new platform age rule, a lesson we revised. Each entry says what
changed, which modules it touches, and what the school needs to do (usually
nothing, which is the point).

Lives at `/hub/whats-changed`, renders from a `curriculum_updates` table, and
every entry links to the modules it affects. The lesson page shows a quiet
"updated" chip when its module has a recent entry.

### 4b. The blog, and the email that follows it

Public, indexed, the top of the schools funnel: a post per change or per idea,
written in Justin's voice. At the end of a post, one field: your school email,
and we keep you updated. That list then receives the feed automatically when a
new entry lands, so the blog is both the acquisition surface and the retention
surface.

The rule: no dashes, every claim sourced, and the email is a genuine service
rather than a drip campaign. A school that never opens one still has a correct
curriculum, because the updates land in the product too.

### 4c. DiGi for teachers

A teacher facing DiGi in the schools app. Same character, same calibrated
pathway rule (never allow or deny, always a pathway), different job:

- **Training.** "I have never taught sextortion, walk me through it." Answers
  from the module's own subject knowledge and DSL note.
- **In the moment.** "A Year 8 just asked me X, what do I say?" Answers from
  the hard questions field.
- **Parent facing.** "A parent has emailed me about the deepfakes lesson."
  Answers from the parent questions field and the evidence base.

It answers from OUR content, cites which module and field it came from, and
says plainly when it does not know rather than inventing. A safeguarding
question always ends by naming the DSL, never by handling it alone.

`DIGI_MODEL` stays a config value, default `claude-fable-5`. Never hardcoded.

### 4d. The passport through the lessons

The five stage passport to sixteen already exists and lesson 1 already teaches
what it is (migration 231). What it does not do is show up in the other twenty.
Every module should name which passport stage it feeds and what the child is
earning, so a pupil in Year 9 knows this lesson counts toward something and a
teacher can say so.

---

## 5. One lesson, worked all the way through

The worked example is **ks3-14 bodies, image and pressure**, and it is chosen
on purpose. It is DSL flagged, it carries the pornography topic, it is hosted
by DiGi in the calm register, and it is the lesson where a non specialist is
most likely to be out of their depth. If the standard works here it works
everywhere.

The full spec is in `content/lesson-standard/ks3-14-worked-example.md`,
alongside this plan. It shows every existing field as it stands today, plus
the four new ones written out in full, plus the panel findings that produced
them.

---

## 6. Phases

| Phase | What | Cost | Blocked on |
| --- | --- | --- | --- |
| **0** | Fix the three matrix claims. Two tags off, one beat added to ks3-13 on fraud as a crime and how to report it | Free, one migration | Nothing |
| **1** | Map `ailit_domains` on the nine unmapped modules | Free, one migration | Nothing |
| **2** | The four new teacher fields on the ks3-14 worked example, and the lesson page and print pack that render them | Free | Justin likes the worked example |
| **3** | The `lesson-council` skill, ten lenses | Free to build, runs cost tokens | Approval of the ten lenses |
| **4** | Run the council over all 21 modules, fill the four fields everywhere | Token cost, one run per module | Phase 3 |
| **5** | The changes feed and the updated chip | Small build | Nothing |
| **6** | The hub blog and the email list | Medium build, needs an email sender decision | Justin picks the sender |
| **7** | DiGi for teachers | Medium build | Phases 2 and 4, because it answers from those fields |
| **8** | Passport stage on every module | Free, one migration | Nothing |

Phases 0, 1 and 8 are three small migrations and could go together this week.

---

## 7. What is needed from Justin

1. **The three matrix fixes.** Two tags off, one fraud beat added. My
   recommendation is above; it is a content call so it is yours.
2. **The ten lenses.** Approve the list, or swap any of them. And confirm you
   are happy with the integrity rule that no agent speaks as a named person.
3. **A look at the worked example** before I run the pattern across 21 modules.
4. **An email sender** for the blog list, if we build 6.
5. **Whether DiGi for teachers is in scope this term** or is a next term thing.
   It is the biggest build here.
