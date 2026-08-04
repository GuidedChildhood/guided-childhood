# The stage quiz, then the curriculum review

**4 August 2026.** Lane: curriculum and the quiz that closes a stage.
Migration claimed: **156**. Branch: `claude/childhood-stage-quiz-curriculum-19lst2`.

Build order Justin set: the stage quiz first, the curriculum review last and
thorough. "Private top school level of research, of the highest degree, but age
appropriate of course."

---

## First, a correction to the brief I was given

The brief said `stage_quiz_passes` exists from migration 098 and **nothing writes
to it**. That is no longer true, and it matters because it changes what is left
to build.

As of `origin/main` today the quiz is wired end to end:

- `lib/content/stage-quizzes.ts` — a hand written bank, five stages, 33 questions
- `app/api/pathway/stage-quiz/route.ts` — writes `stage_quiz_passes` under RLS
- `components/pathway/StageReadiness.tsx` — the quiz UI, on the pathway page
- `app/(dashboard)/dashboard/pathway/page.tsx` — reads the passes back

It landed on 2 August. PR 693 is merged, not open and draft as the brief had it.
There are **no open pull requests** on the repo right now, so the lane is free.

So the quiz is not missing. What is missing is the one thing Justin actually
specified about it.

## What is genuinely missing: the questions do not come from the lessons

Justin's design: the quiz **gathers the questions already asked across that
stage's lessons**. The shipped quiz does not do that. It is a separate bank of
33 questions typed into a TypeScript file, with no connection to any lesson a
family has worked through.

Two things are wrong with that, and they are the same thing twice:

1. **It breaks non negotiable 6.** Content lives in the database, not hardcoded
   in the app. A 33 question bank in `lib/content/` is exactly the pattern that
   rule exists to stop.
2. **It tests something the stage never taught.** A quiz drawn from nowhere is a
   general knowledge round. A quiz drawn from the stage's own lessons is the
   retrieval practice the lesson player already believes in: every deck opens on
   a starter the player labels **Retrieval** (`ROSENSHINE_LABELS`). The stage
   quiz is that same idea at stage scale, and it is the reason passing it is
   allowed to tick the passport.

### The questions already exist, and there are enough of them

Lesson questions are `choice` slides inside `lessons.slides` (JSONB, contract in
017, extended by 031 and 032). Counted across the seed migrations:

| migration | choice slides |
|---|---|
| 076_lesson_library_fill | 30 |
| 092_social_media_module | 12 |
| 074_rosenshine_family_lessons | 10 |
| 104 / 105 / 106 / 103 (social media 13 plus) | 16 |
| 017_lesson_slides | 2 |

About 70 authored questions across the library, before the floor. Lessons with
no authored deck still get one: `autoSlidesFromLesson` builds a `prove` phase
choice slide from the lesson's own key message, so **every** lesson can
contribute at least one question. That is the pool the stage quiz should sample.

### The shape of the fix

- **Migration 156** is not needed for the gather itself, the slides are already
  there. It is needed for the coverage work below.
- New `lib/pathway/stage-quiz-gather.ts`: read the stage's lessons, parse slides,
  pull every `choice` slide, normalise to the existing `StageQuizQuestion` shape.
- The existing sample, shuffle, five of them, pass at four, and the write to
  `stage_quiz_passes` all stay exactly as they are. They are good.
- The hand written bank stays as the **floor**, not the source: a stage whose
  lessons cannot yield five questions still gets a full five rather than a short
  quiz.

> **Measured, and it corrected two guesses above.** I expected Foundation and
> Builder to be the short stages. They are not. Every stage fills a run from its
> own lessons: foundation 8, builder 10, explorer 10, shaper 25, independent 11,
> against a run of five, so the floor bank is never reached today.
>
> I also expected "sits after a scenario slide" to be the right test for whether
> a question can travel. It is much too blunt. It threw away "why is one reused
> password across ten accounts worse than one weak password on one account",
> which needs nothing around it, and dropped Explorer under a full run on its own.
> The test is the words, not the neighbours. That leaves four dropped questions
> across the whole library, and all four genuinely need their slide.

### One open question, asked rather than assumed

The shipped quiz is parent facing and its own header says it is "never a test of
the child". The lesson questions it would now gather are written for children.
Those two do not sit together comfortably, so **who taps through the stage quiz
is a question for Justin, not a thing to guess.** The gatherer is the same work
under either answer, so it gets built first while the answer comes back.

---

## Then the curriculum review, and three things fold into it

Not three separate jobs. One read of the library that answers all three.

### 1. Does the lesson body ever address the reader as the grown up

Both libraries reach children. `parent_lessons` (10, illustrated, co view, shown
as **Watch together**) and `lessons` (46 live, on the child's own Lessons page at
`/k/[token]/lessons`, stage gated behind the paywall).

The `audience` column says who a row was **written for**, not who can **see** it.
The check is the prose itself, so the sweep is for second person grown up address
in the body: "your child", "you will notice they", "at this age they". A child
reading "your child" on their own Lessons page is being handed a page that was
not meant for them.

### 2. Coverage is lopsided

Foundation 6, Builder 6, Explorer 7, Shaper 20, Independent 7. Shaper has more
than the other four stages put together, because the social media 13 plus series
(migrations 103 to 106) all landed in it.

Shaper is not wrong to be big, 13 plus is when the most arrives at once. The
problem is the other end: **Foundation and Builder are the years the whole
pathway says are the building years**, and they have six lessons each. That is
also exactly where the quiz has too few questions to sample from, so the two
problems are one problem.

### 3. ai_lessons has 0 questions across all 46

`ai_lessons` gained a `slides` column in 017. No row uses it for a `choice`
slide. In the player they fall to `autoSlidesFromLesson`, so a child does meet
one generated prove check, built from the lesson's key message with two fixed
wrong answers. It is a floor, not a lesson question. Real authored questions is
the fix, and it is the same authoring pass as the coverage fill.

---

## Also queued, Justin's call already given

**The scripts copy sweep.** 121 of 233 scripts assert something about the
reader's own child as fact ("Your child has broken a digital agreement"), 0 of
233 are phrased as a scenario, 2 assume a gender the app does not know. He has
seen the numbers and has not said full sweep or sample first. **Not started
until he says which.** The two gender assumptions are the exception: those are
a bug in any reading, and go whichever way the rest goes.

## Parked, waiting on a count not a guess

Cutting child push notifications. Still parked. The count comes first.

---

## What the curriculum review found, and what it still cannot answer

**Done and verified end to end:** the grown up address. 15 of the 44 lesson
seeds put it in `key_message`, the one field every child reads on their own
lessons list, and all 15 are the social media 13 plus series. Fixed by
migration 156 and the two child surfaces. Findings 1 and 2 turned out to be one
finding: that series arriving is both the grown up voice AND the Shaper bulge.

**Blocked, and I will not guess at it:** the coverage rebalance and the
`ai_lessons` question count. Justin's numbers come from the live database
(46 lessons live, 10 parent lessons, ai_lessons 46). Reconstructing that state
from 155 migration files by regex gives 41 to 44 depending on the parse, because
of retires, status flips and three different insert forms. Those numbers are
close enough to be dangerous and not close enough to author against: deciding
which stage is short, and writing lessons to fill it, on a count that might be
wrong by five is how the wrong five lessons get written.

**The Supabase MCP is in the session but every query returns "requires
approval", so I have no read.** That is the one thing needed to finish the
review properly. With it the remaining pass is: confirm the live counts per
stage, confirm the `ai_lessons` deck state, and author questions and lessons
where the count says they are missing.

## Order of work

1. The gatherer, the wiring, the floor. Stage quiz drawn from lesson questions.
2. Ask Justin the surface question, keep building while it comes back.
3. The curriculum read: audience, coverage, questions, in one pass.
4. Author what the read says is missing, Foundation and Builder first.
5. Scripts sweep only when Justin says full or sample.
