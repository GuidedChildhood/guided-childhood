# Oak as the basis: the lesson standard, 7 September 2026

Justin sent a complete Oak National Academy resource pack and asked: use Oak
as the basis, plan the lessons on it, and get the same finish or better.

## What was actually read

The pack, not Oak's reputation:

- **Slide deck**, 32 slides: KS1 Computing, "Painting using computers"
  (unit: Digital Painting), Oak with the Raspberry Pi Foundation, 2024.
- **Worksheet answers**, 2 pages, Task A and Task B with model answers.
- **Starter quiz**, question and answer versions, 4 questions.
- **Exit quiz**, question and answer versions, 4 questions.
- **Aila prompt guide v11**, Oak's own specification for how a lesson is
  built, including the ten sections every Aila lesson contains.
- Oak's published curriculum principles: Rosenshine's principles of
  instruction, Sweller on cognitive load, Mayer on multimedia learning,
  EEF guidance. Lessons "chunked into learning cycles", "frequent checks
  for understanding", "guided and independent practice".

Note on sources: labs.thenational.academy is blocked by this environment's
network egress proxy, so the Labs page itself was not read. Everything here
comes from the downloaded pack, which is the stronger source anyway because
it is the actual output rather than the marketing of it.

## Oak's ten sections, from their own guide

1. Lesson details: key stage, subject, title
2. Learning outcome: one "I can" statement
3. Learning cycle outcomes: the lesson broken into named cycles
4. Prior knowledge: what pupils need before they start
5. Key learning points: the knowledge taught
6. Misconceptions: and how to address each
7. Keywords: core vocabulary with definitions
8. Starter quiz: activates and checks prior knowledge
9. Learning cycles: each with explanation, checks for understanding,
   practice task, and feedback
10. Exit quiz: assesses the knowledge from the lesson

## What the deck actually does, slide by slide

The shape worth copying, observed in the Digital Painting deck:

- Title, then a standing slide explaining how the resources are designed
- The "I can" outcome on its own slide
- Keywords with pupil facing definitions, four of them
- **A cycle map slide** listing the lesson's cycles, shown again at every
  cycle boundary so pupils always know where they are (slides 5 and 22)
- Inside each cycle: a question to the room, then the explanation, then
  **named pupil voices** (Lucas, Aisha, Izzy, Jun) modelling answers in
  first person, then a misconception slide putting a right and a wrong
  statement side by side and asking "Why?", then a check for understanding
  as multiple choice, then the practice task, then a feedback slide with
  model answers ("Your shapes may have looked like this", "You might have
  said")
- A summary slide restating the key learning points in plain sentences
- Licence and attribution

The quizzes are four questions, mixed formats: tick one, true or false,
match with letters, fill the blank. Every quiz ships as a question version
and an answer version, and the worksheet ships with model answers.

## Where we already match Oak, or beat it

Said honestly, because the point is to find the gaps, not to feel good:

- **Scripts.** Every one of our slides carries a word for word teacher
  script. The Oak deck has no speaker notes at all. This is our single
  biggest advantage and it is why a non specialist can teach our lessons.
- Named characters modelling answers: the DiGi Squad already does what
  Lucas and Aisha do, and carries the register through the lesson.
- Checks for understanding with feedback on right AND wrong answers.
- Misconceptions named and dismantled by their own question.
- Practice task with a full answer key and teaching point per item.
- Recap slide, keywords, "I can" outcome, learning record.
- Beyond Oak entirely: safeguarding and DSL notes, staff briefings, the
  fifteen minute induction, SEND and EAL adaptations on four needs, the
  parent note and home bridge, the passport, paper fallback for every
  lesson, class interactives, video beats, statutory mapping.

## Where Oak is genuinely ahead of us

1. **Named learning cycles.** Ours are implicit: the timing string says
   "cycle one 8, cycle two 10" but nothing in the data or on screen names
   them, gives each an outcome, or shows pupils the map. Oak's cycle map
   slide is cheap to build and does real work for cognitive load.
2. **Prior knowledge as data.** We open with a retrieval question but
   never state what a pupil needs to know before the lesson. A teacher
   deciding whether their class is ready cannot see it.
3. **Key learning points as data.** We have recap points at the end and
   objective gains at the start, but no single list a teacher can scan.
4. **The starter quiz as a real printable.** Oak: four questions, tick
   boxes, question and answer versions. Ours: one start card prompt.
5. **The exit quiz as a real printable.** Oak: four questions, mixed
   formats, both versions. Ours: an exit card and two in slide choices.
6. **Keywords missing on some modules.** ks3-12 carries none in its
   teacher notes and the vocabulary page falls back to reading them off a
   slide. This needs auditing across all 21.
7. **The download.** Oak gives a lesson plan, slide deck, worksheet and
   quizzes as files. We give a print room, which is better for paper, but
   there is no deck download. The master audit already flagged this as
   P2 item 13, "the Oak expectation".

## The plan

Three phases, exemplar first, the brief's own order. Migration numbers
claimed here: **268, 269, 270**. Main's ledger ends at 267 (applied);
264 remains the other lane's, unapplied.

### Phase 1: the contract (migration 268)

Add the four missing Oak sections to `teacher_notes`, as data, for all 21
modules:

- `cycles`: an array of `{ title, outcome }`, two or three per lesson,
  named from what the lesson already teaches. Each slide gains a `cycle`
  number so the player and the print pack can group by cycle.
- `prior_knowledge`: three statements per module, what a pupil needs
  before this lesson, drawn from the preceding module in the spiral.
- `key_learning_points`: four or five statements, the knowledge taught,
  which the recap slide already implies.
- `keywords`: audited to 21 of 21 with pupil facing definitions, filling
  ks3-12 and any others found empty.

### Phase 2: the quizzes and the surfaces (migration 269)

- `starter_quiz` and `exit_quiz` become real question banks in the data:
  four to six questions each, mixed formats (tick one, true or false,
  match, fill the blank), each with its answer and a teaching point.
  The existing in lesson choice slides stay: they are the checks for
  understanding, which is a different job from the quizzes.
- Four new print routes in the Oak pattern: `/print/[module]/starter-quiz`
  and `/print/[module]/exit-quiz`, each with a question version and an
  answer version, in our own tokens and typography.
- A **cycle map slide** in the player, rendered at each cycle boundary
  with the current cycle marked, plus the cycle name in the slide chrome
  so a pupil always knows where they are.

### Phase 3: the exemplar, then the twenty (migration 270)

ks3-12 first, because it is already the gold standard exemplar at 94 and
the shape is proven there before it is scaled. Take it through Oak's ten
sections end to end, re run the fifteen pass QA with three new passes
added for the Oak sections, and publish the delta. Then the other twenty
in key stage batches: EYFS and KS1, then KS2, then KS3, then KS4 and KS5,
one migration per batch, so no batch is a mass rewrite and each can be
checked before the next.

### What we deliberately do not copy

- Oak's lessons have no scripts. We keep ours on every slide.
- Oak minimises images to manage cognitive load; our video beats and
  interactives earn their place because they teach the thing that words
  cannot (a fake spreading, a feed learning). We keep them and we keep
  reduced motion honoured.
- Oak's licence is Open Government Licence. Ours is not, and nothing from
  their pack is copied into our lessons: the shape is the lesson here,
  never the content.

## Rules that hold

Backup table per migration with RLS, idempotent, applied only after the
diff is verified. No dashes in any copy. Nothing claims what does not
exist. Wiring check, both typechecks, and the Playwright pass at 390 and
1280 before anything is called done. Every claim on a school facing page
keeps a proof path in the product.
