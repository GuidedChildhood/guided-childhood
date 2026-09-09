# The anatomy of a Guided Childhood lesson

**What this is.** Every part of every lesson, named, counted and located, so the
whole process is visible in one place. Written 9 September 2026 from the live
database, not from the design intent. Where the two disagree, this document
follows the database and says so.

**How to read it.** Section 1 is the shape of the scheme. Section 2 is what one
lesson contains. Section 3 is what a teacher receives. Section 4 is the honest
gap list. If you read one section, read section 4.

---

## 1. The scheme, in numbers

| | |
| --- | --- |
| Modules | 21 |
| Coverage | Reception to Year 13 |
| Slides in total | 479 |
| Slides per module | 22.8 average, 15 fewest, 27 most |
| Slide types available | 15 |
| Teacher note fields | 24 |
| Lesson length | 45 to 66 minutes depending on key stage |

Every module carries, without exception: an assessment, a parent note, a DSL
safeguarding note, statutory hooks, Education for a Connected World strands, an
AI literacy domain mapping, a starter quiz and an exit quiz.

---

## 2. What one lesson is made of

### 2a. The arc

Six phases, in order. The slide count is the whole scheme.

| Phase | What it is for | Slides | Modules carrying it |
| --- | --- | --- | --- |
| connect | Hook the child's own experience before teaching | 2 | **1 of 21** |
| starter | Retrieval of prior learning, low stakes | 87 | 21 |
| teach | New material in cycles, each with its own minutes | 241 | 21 |
| practise | Guided then independent application | 42 | 21 |
| prove | The child shows they can do it | 42 | 21 |
| close | Land the point, commitment, what goes home | 65 | 21 |

**Teach is half the lesson.** 241 of 479 slides. That is the shape of a
knowledge lesson, and this is partly a behaviour subject, so it is worth
questioning rather than assuming.

### 2b. The fifteen slide types

| Type | Count | What it does |
| --- | --- | --- |
| choice | 105 | A question with options, auto marked, the workhorse |
| concept | 63 | A single idea explained |
| diagram | 44 | A drawn model, steps or a flow |
| scenario | 40 | A mocked social post or message to read and judge |
| discussion | 37 | A timed talk task with a "look for" for the teacher |
| digi | 22 | A character speaks, one per module plus one |
| interactive | 22 | A live component the class drives |
| keywords | 21 | The vocabulary for the lesson |
| objective | 21 | What we are learning and why |
| quote | 21 | A line worth sitting with |
| recap | 21 | What we now know |
| title | 21 | The opening |
| tryit | 21 | A thing to do now |
| stat | 12 | A number with its source on the slide |
| video | 8 | A clip, each with a written alternative |

Every one of the 479 slides carries four fields without exception: `type`,
`phase`, `minutes`, and `script`, the word for word teacher script. There is no
slide anywhere in the scheme a teacher has to improvise.

### 2c. The twenty four teacher note fields

On all 21 modules:

**Planning:** learning_objective, essential_question, i_can, key_learning_points,
prior_knowledge, timing, cycles, equipment, tool

**Teaching:** teacher_tip, misconceptions, differentiation, send, keywords,
commitment_stem, paper_fallback

**Assessing:** starter_quiz, exit_quiz, worksheet, worksheet_items

On 1 module only, the ks3-14 worked example:

**Subject mastery:** subject_knowledge, hard_questions, parent_questions,
evidence_base

That last group is the gap named in the perfect lesson standard plan and it is
still one module of twenty one.

### 2d. What sits outside the slides

| Field | Purpose |
| --- | --- |
| statutory_hooks | The DfE RSHE guidance this lesson satisfies |
| efcw_strands | Education for a Connected World strand mapping |
| ailit_domains | AI literacy domains, on all 21 since migration 272 |
| assessment | How the learning is judged |
| parent_note | What goes home, and the dinner table question |
| dsl_note | The safeguarding brief for the designated lead |
| evidence_anchor | The source the lesson rests on, one string |
| home_code | The code that links the lesson to the family app |

---

## 3. What a teacher receives

Five surfaces, from one module page.

| Surface | Route | What it is |
| --- | --- | --- |
| Prep page | `/lesson/[module]` | Everything about the lesson before teaching it |
| Projector player | `/teach/[module]` | The interactive lesson, full screen, sized for the back of the room |
| Run sheet | `/lesson/[module]/run` | The whole lesson walked through on paper, every script, start to finish |
| Print pack | `/print/[module]` | One button, the whole paper pack |
| Separate sheets | `/print/[module]/…` | Starter quiz, exit quiz, record sheet, booklet, organiser, overview |

Plus, one click from any lesson: the DSL note, the statutory mapping, the CPD
briefings, the parent pack and the data protection pack.

---

## 4. The gaps, named honestly

These are what this document exists to surface. Each is a fact from the
database or the routes, not an opinion.

1. **Connect is missing on 20 of 21 modules.** We describe a six phase arc and
   deliver five. Connect is where a child's own experience is hooked before any
   teaching, which in a behaviour subject is arguably the phase that earns the
   rest.

2. **Practise is 9 percent of slides.** 42 of 479. For a subject whose measure
   of success is what a child does at 10pm on a Tuesday, not what they recall
   in a test, that ratio deserves challenging.

3. **Subject mastery exists on one module.** subject_knowledge,
   hard_questions, parent_questions and evidence_base are the four fields that
   turn a lesson plan into a teacher who understands the subject. Twenty
   modules do not have them.

4. **There is no single action that hands a teacher everything.** The sales
   page says "A teacher opens one page. The whole lesson is already there. No
   hunting through a portal." The prep page is that page, but it dispatches to
   five places rather than delivering one thing. The promise is nearly true.

5. **evidence_anchor is a single string.** A parent challenging the content of
   a sensitive module gets one line back. The worked example shows what a real
   evidence table looks like; the other twenty modules do not have one.

6. **The character on the slides is the retired cast.** The 22 digi slides and
   the 8 videos carry the original DiGi Squad. The Planet Friends animation
   system (`plans/2026-09-07-planet-friends-lesson-animation-system.md`) is the
   replacement and has not been applied to the slides.

---

*Source: `schools.school_lessons`, 21 rows, read 9 September 2026. Route list
from `schools/app`. Regenerate the counts before quoting them anywhere
external, because content migrations move them.*
