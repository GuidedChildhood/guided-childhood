# The Lesson Standard

How one lesson is built, and how a teacher runs it start to finish.
Written 15 August 2026. Lesson 1 is the worked example; the other twenty follow it.

---

## The honest diagnosis

Justin, 15 August: *"the level of lesson is just our own slides, these need to be
the level of Kapow and other competitors."*

I went through lesson 1 (`eyfs-01-screens-kindness`) field by field before
agreeing. The finding is not the one either of us expected.

**The content is already at Kapow's level. Almost none of it reaches anybody.**

Sitting in the database for that one lesson, already written, already good:

* a learning objective, and a pupil voice outcome
* 12 slides, every one carrying a word for word script averaging 412 characters,
  every one tagged with its phase and its minutes
* three keywords with child facing definitions
* **three misconceptions**, named and answered
* **differentiation**, both support and stretch
* a six item worksheet where every item carries an **expected verdict** and a
  **teaching point**
* a paper fallback that runs the whole lesson with no screen at all
* a commitment stem, a parent note, a family question, a timing breakdown

That is a better lesson record than Kapow publishes. The problem is what happens
to it:

| What exists | Where a teacher meets it |
| --- | --- |
| The 12 slides | `/teach`, and they play well |
| Misconceptions, differentiation, objective, timing | buried in the print room |
| Expected verdicts and teaching points | **nowhere. Read out of the database and never rendered.** So the answer key does not exist |
| Video beats | rendered nowhere, and only 1 lesson of 21 has any authored |
| The six interactive components we built | **nowhere. Zero lessons use any of them** |

That last line is the one that answers his complaint exactly. We built
`verdict-sort`, `signal-meter`, `star-breath`, `feed-loop`, `spread-race` and
`class-tally`, they all work, and not one lesson calls a single one. The lesson
feels like slides because it currently *is* only slides. The fun was built and
never plugged in.

**So this is not a rewrite. It is a wiring job plus one honest content upgrade.**
That is a much better position than it looked, and it is why lesson 1 can reach
the standard this week rather than this month.

---

## What the competition actually ships

From the benchmark sweep (full notes in the research report; the four vendor
sites were blocked from this sandbox so the visual claims are unverified).

**Oak** does not ship flat slide runs. Every lesson is two or three named
**learning cycles**, each one explain, check, practise, feedback. They publish an
editable deck, a starter quiz, an exit quiz, a worksheet, keywords,
misconceptions, a teacher tip and a unit level "why this, why now". Free, no
login, Open Government Licence.

**Jigsaw** ships a **ritual**: six named parts in the same order every lesson.
Connect us, Calm me, Open my mind, Tell me or show me, Let me learn, Help me
reflect. A named character per year group. A chime that marks the calm moment.
And the move worth taking: at the end of a unit, **the child colours in the
attainment descriptor they think they reached, the teacher colours in theirs, and
then they talk about the gap.**

**Kapow** ships a **teacher video per unit**, which is CPD disguised as prep, and
"knowledge catchers" before and after.

The floor to be taken seriously: written plan, editable deck, worksheet, a quiz
at each end, keywords, misconceptions, differentiation, and an RSHE mapping.
**We have all of that written.** We are behind on delivery, not on substance.

Where we can beat all three: none of them has a real interactive player. They
all ship PowerPoint. Our 15 slide types and six interactive components are the
whole opportunity, and they are currently switched off.

---

## The Lesson Standard

Every one of the 21 modules must carry all of this before it counts as done.

### 1. The shape: six phases, always the same order

Today the phase enum is `starter, teach, practise, prove, close`. That is
Rosenshine and it is sound. Two changes, both cheap:

* **Add `connect` at the front.** Additive only, no existing slide changes.
  This is the Jigsaw move Rosenshine has nothing to say about, and it is the one
  that matters in a subject where children are asked to talk about themselves.
* **Relabel `close` as "Reflect"** for teachers. Label only, no data change.

The strip a teacher and an observing head see:

| Phase | What happens | Origin |
| --- | --- | --- |
| **Connect** | Charter, DiGi greets, the star pause to settle | Jigsaw |
| **Recall** | 3 to 5 retrieval questions, never skippable | Rosenshine 1 and 10 |
| **Teach** | Small steps, DiGi models it, worked example | Rosenshine 2 and 4 |
| **Practise** | Guided then independent, at a high success rate | Rosenshine 5 to 9 |
| **Prove** | Exit questions, every child answers | Rosenshine 6 |
| **Reflect** | What changed, the commitment, where to get help | Jigsaw |

Rendered as a **persistent strip across the top of the player**, derived from the
`phase` field already on every slide, current phase filled, done ones ticked.
This is the single clearest signal to a visitor that the lesson has a structure.

### 2. At least two interactive slides, one of them in Practise

Non negotiable, and it is the whole difference between a slideshow and a lesson.
The six components exist. Every module names at least two.

### 3. A real answer key

`expected_verdict` and `teaching_point` are already authored for every worksheet
item. They must be **rendered in the teacher pack**, on a page the teacher can
put beside them while children work. Right now they are read out of the database
and thrown away.

### 4. A lesson home page

One gated route, `/lesson/[module]`, that assembles everything already written
into the page a teacher opens the night before:

* why this, why now, and what changes for a child by the end
* the objective, the keywords, the three misconceptions, the differentiation
* the timing breakdown and the phase strip preview
* what to print, linking straight into the existing pack
* the safeguarding note where there is one
* the parent note
* and one large button: **Teach this lesson**

Nothing on this page is new writing. It is assembly of what exists.

### 5. A child facing record

One side of A4 the child keeps. Three "I can" statements in child language, and
the child colours the one they think they reached. The teacher marks theirs
alongside. Then they talk. This is the Jigsaw move and it is the cheapest real
differentiator available to us.

### 6. Export

A download of the deck and the pack. Oak has set the expectation that a school
owns and adapts the file. Without this we read as less flexible than the free
option. PDF first, editable format later.

---

## The teacher workflow, start to finish

What a teacher does, in order, with nothing left implicit.

**The night before, five minutes.**
Opens `/lesson/eyfs-01-screens-kindness`. Reads the objective and the three
misconceptions. Sees the lesson runs 30 minutes and how that splits. Taps
**Print the pack**, which gives worksheets, the answer key, the bookmark strip
and the parent notes in one job. Done.

**On the day, before the children come in, one minute.**
Opens the same page, taps **Teach this lesson**. Full screen. Phase strip across
the top showing all six.

**Connect, 2 minutes.** Title slide. Pebble and DiGi Junior arrive. The class does
the star pause together, run by the `star-breath` interactive on the board, so
the settle is timed and the same every week.

**Recall, 4 minutes.** In lesson 1 there is nothing to recall, so it is the warm
up question instead, and the script says so honestly. From lesson 2 onward this
is retrieval and it is never skipped.

**Teach, 10 minutes.** The three special words with actions. Real and made up,
with the elephant in pyjamas. The three step tool, taught with whole body
actions, each step on the board.

**Practise, 8 minutes.** `verdict-sort` on the board: real, made up, or ask a
grown up. The six worksheet items, one at a time, whole class first then on
paper. The teacher has the answer key beside them, and it carries the teaching
point for each one so they know what to say when a child gets it wrong.

**Prove, 4 minutes.** Two questions, every child votes with actions. The teacher
sees the split on the board.

**Reflect, 2 minutes.** The chant with actions. The commitment: each child names
their grown up. DiGi Junior says goodbye. The parent note goes home.

**After, under two minutes.** One tap per child on the register, pre filled as
met, teacher changes only who differs. That last step needs teacher accounts and
is the next build after this one.

---

## Lesson 1, rebuilt to the standard

Concrete changes to `eyfs-01-screens-kindness`. It goes from 12 slides to 15,
from 30 minutes to 32, and from zero interactives to two.

| # | Change | Phase |
| --- | --- | --- |
| new | `interactive` slide, `star-breath`, the settle | Connect |
| 1 to 4 | unchanged, retagged Connect and Recall | Connect, Recall |
| 5 to 7 | unchanged, they are good | Teach |
| new | `interactive` slide, `verdict-sort`, three bins, six posts drawn from the worksheet items | Practise |
| 8 | unchanged | Practise |
| 9 to 10 | unchanged | Prove |
| new | `recap` slide, the three things we learned | Reflect |
| 11 to 12 | unchanged | Reflect |

Plus, outside the slides: the answer key rendered, the lesson home page built,
the child record designed, and one video beat authored for the explainer.

**What I am not touching:** the scripts. They are genuinely good, they are written
in Justin's voice, and they are pitched correctly for Reception. Nothing about
the complaint is fixed by rewriting them.

---

## Build order

1. **Phase strip and `connect` phase.** Player change plus the enum. Everything
   else hangs off the shape being visible.
2. **Wire the interactives into lesson 1.** Migration, slides only. This is the
   change Justin will feel first.
3. **The answer key in the print pack.** Smallest fix on the list, and it is a
   real hole in the teacher's day.
4. **`/lesson/[module]`, the lesson home page.** The one button surface.
5. **The child record**, one side of A4, printable.
6. **Roll the standard across the other twenty**, one migration per key stage.
7. **Export**, and the video beats, which are the long tail.

Steps 1 to 5 are lesson 1 at the highest level, start to finish. That is the
piece to build now and put in front of a real Reception class before touching
the other twenty.

## House rules that apply throughout

Checker tokens only, Nunito and IBM Plex Mono, chunky buttons, GSAP only. Mobbin
references pulled before any new screen is drawn. No dashes in any copy. Never
allow or deny, always a calibrated pathway. Scripts live in the database, never
in the app. Mobile and desktop checked in DevTools before anything is called
done.
