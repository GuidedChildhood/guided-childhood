# The private tutor, phase 1: homework in, lesson out, onto the child's phone

## Context

Justin, 11 August 2026:

> "The homework decoder, can it match whatever evidence we can research for typical
> homework given for a particular part of the syllabus, then can we develop a lesson
> to match that can be sent to a child. Also if a parent is concerned about their kid
> learning at school we can provide a private tutor linked to DiGi and run through the
> best typical lessons. Also have tests that the curriculum would recommend at every
> stage that the parent could send as jobs and quests to a kid to earn device time.
> Also make sure navigation goes back to what the child is learning, not printables.
> Let's build this plan to make it the best private tutor to work at every stage."

Then, across the same conversation: the Guided Childhood curriculum (device use, AI,
social media, vibe coding, the changing job market) should sit alongside the school
one and be available to DiGi; and specialist coaches in the shape of Good Inside's,
whose real coaches cost 195 dollars for forty minutes.

**The finding that shapes everything: most of this already exists, pointed the other
way.** `/api/learning/make-quest` already turns curriculum objectives into a job on a
child's phone. It runs child to parent: the child flags what was tricky on a practice
sheet, and one small task comes back. Justin is asking for parent to child, starting
from the homework in front of them.

So phase 1 is not a new pipeline. It is the existing one reversed, plus the one thing
genuinely missing: a route that generates a playable lesson.

---

## The four decisions that set the architecture

Asked and answered before designing anything.

### 1. No live model on the child's phone

Today there are **zero Anthropic calls anywhere on the child side** and no child facing
system prompt exists. The only route from DiGi to a child is a parent rewriting an
answer and sending it, and migration 064 states the rule outright: *always from the
parent, never a message from us to the child.*

The tutor does not overturn that. **The parent reviews and sends; the child does a real
lesson with no model call on their device.** Same shape as Star Lessons, which already
work this way. A conversational tutor a child can talk to remains possible later, but it
needs a child safe prompt, its own safety layer, parent readable logs and age gating,
and it is not phase 1.

### 2. No stored grades

The learning surface has refused assessment data repeatedly and says so in the code:
*we hold no assessment data and could not answer that question honestly if we tried.*
The only per child learning signal in the product is which objectives a child flagged
as tricky themselves.

So the tests are **practice for the checkpoints a child will actually sit**: the Year 1
phonics screening, the Year 4 multiplication tables check, the Year 6 SATs. Those are
real, national, dated, and already flagged on the `checkpoint` column of
`curriculum_objectives`. The child sees their own progress. The parent sees that
practice happened, never a score. Practising for a real test is not us grading a child.

### 3. Phase 1 is homework to lesson to phone, plus the navigation fix

The coaches, the Guided Childhood curriculum in DiGi's brain, and Years 7 to 11 are
phases 2 to 4. Notes on each at the end.

### 4. Researched content goes behind the approval gate

Migration 108 makes `source` NOT NULL on every objective and says why: *an objective
nobody can trace cannot be inserted at all. That is deliberately awkward. It is the one
thing standing between this feature and a confident, plausible, wrong worksheet.*

Any curriculum we research inherits that. The model drafts with web search into a
candidates table marked pending, Justin approves on `/dashboard/insights`, and only then
does it go live. That machinery already exists for the knowledge bank.

---

## What phase 1 builds on, and does not rebuild

| Piece | Where | What it already does |
| --- | --- | --- |
| Curriculum | `curriculum_objectives`, migrations 108/114/115 | 448 objectives, England, Years 1 to 6, DfE verbatim wording, mandatory source |
| Year group | `lib/learning/term.ts` | The proper 31 August cutoff, so a child born in October stays in their year all year |
| Homework decoder | `app/api/learning/decode/route.ts` | Matches pasted homework to that year's objectives, revalidates every returned id, stores nothing |
| Task writer | `app/api/learning/make-quest/route.ts` | Objectives to one child voice job, pushed to the phone |
| Slide contract | `shared/lesson-slides.ts` | 15 slide types, defensive parser |
| The player | `shared/components/LessonPlayer.tsx` | One player for everything. `kidMode`, stars, 70 percent pass, retake at first wrong, and `completeEndpoint={null}` already supported |
| Send to child | `/api/quests/lessons`, `kid_lesson_missions` | Parent previews a deck, then sends it |
| Stars to minutes | `lib/quests/templates.ts`, `lib/quests/star-week.ts` | 5 minutes a star, weekly cap, chores gate |

**The one genuinely new thing is a route that generates `slides`.** Nothing in the
product does this today; every deck was authored by hand in a migration.

---

## The navigation fix

Justin: *"make sure navigation goes back to what the child is learning, not printables."*

Two lines, both reading `← Printables`:

- `app/(dashboard)/dashboard/homework/page.tsx:34`
- `app/(dashboard)/dashboard/printables/learning/page.tsx:50`

Every route into both pages now comes from the learning surface, so every back tap
ejects a parent into printables. The practice sheet page is not even listed on the
printables index, making it a one way door to somewhere that does not contain the thing
they just left.

Both should return to `/dashboard/learning`, the homework one to `?tab=homework` and the
sheet one to `?tab=ahead`, which are the tabs they were launched from.

A comment at `app/(dashboard)/dashboard/learning/LearningYear.tsx:24-40` already
describes this exact bug and claims it was fixed. The tabs were built; the back links
never were. That comment needs correcting in the same commit, or the next person reads
it and believes it.

---

## Implementation

### The shape, in one line

Parent pastes or photographs the homework → it matches the curriculum as it already
does → **a new route generates a playable deck** → parent previews and sends → the deck
is stored → the child plays it on their phone with no model call → passing pays stars,
which are already minutes.

### 1. Migration 188, `tutor_lessons`

One table, because a generated deck is made for one child and there is no catalogue to
separate from an assignment.

```
id, user_id, child_id
origin        'homework' | 'checkpoint' | 'objective'
year_group, subject, term
objective_ids uuid[]        the objectives it was built from, for provenance
title, emoji
slides        jsonb         the deck, in the shared/lesson-slides contract
stars         int 1..10
created_at, sent_at, done_at, cleared_at
```

`slides` is stored rather than generated on demand, and that is the whole architecture.
**It is what lets a child play a lesson with no Anthropic call on their device**, which
is decision 1. Generation happens once, on the parent's side, before they send it.

`objective_ids` earns its place: it is the provenance trail migration 108 insists on, so
any deck can be traced back to the statutory lines it came from.

RLS: a family reads and writes only its own rows. The child route reads through
`createAdminClient()` scoped by token, exactly as `app/k/[token]/lesson/[mission]` does.

### 2. `POST /api/learning/lesson`, the route that generates the deck

New file, modelled closely on `app/api/learning/decode/route.ts`.

Inherit, without changing them:

- `callDigi` with the `DIGI_MODEL` plus `DIGI_MODEL_FALLBACKS` ladder
- Fetch **only that child's year group** of objectives, and revalidate every id the model
  returns against the set that was sent, so an invented statutory line cannot reach a
  family
- Strip dashes from all model prose
- Refuse rather than guess when the year group is unknown

The prompt asks for a deck in the **Rosenshine arc the slide contract already carries**:
a `starter` retrieval slide, `teach` concept slides, `practise`, at least two `choice`
slides for the `prove` phase, and a `recap` to close. Choice slides are not decoration:
`LessonPlayer` computes its 70 percent pass from them, so a deck without them passes on
being tapped through.

The child voice rules come straight from `make-quest` and are the load bearing part:
never name it as something they are bad at, no tricky or struggling or behind, never
quote curriculum wording at the child, no dashes.

Validate the returned deck through `parseSlides()` before storing. It skips unknown
types rather than failing, so a model that invents a slide type degrades to a shorter
lesson rather than a broken one.

### 3. Parent preview and send

`/api/quests/lessons` already does exactly this for Star Lessons, including `GET ?lesson=`
to return a deck for preview before sending. Follow it.

- Preview renders in `LessonPlayer` with **`completeEndpoint={null}`**, which the player
  already supports and which writes nothing.
- Send sets `sent_at` and pushes the child with `pushToChild`, the same call
  `make-quest` uses.
- A parent can bin a generated deck they do not like. Generation is cheap; a bad lesson
  reaching a child is not.

### 4. The child's side

- Route `app/k/[token]/tutor/[id]/page.tsx`, modelled on `app/k/[token]/lesson/[mission]/page.tsx`.
- Token regex, admin client, scope by `child_id` from `kid_links`.
- **Strip `script` from every slide before it reaches the client**, as both existing child
  lesson routes do.
- `LessonPlayer` with `kidMode`, `kidStars`, and the child's accent through
  `resolveTheme(child.accent)`.
- Completion posts to a new `/api/kid/tutor-complete`, which follows
  `app/api/quests/lesson-complete`: award stars once on pass, replays never mint again,
  counts capped server side.

On the child's home it appears as a **hero card at the top**, the same treatment the
assigned printable gets in `KidQuestScreen`, rather than joining the five a day rotation.
A parent sent this deliberately; it should not depend on a dice roll. It ticks the
existing `homework` five a day step on completion.

### 5. Practice for the checkpoints

No new content needed. `curriculum_objectives.checkpoint` already flags
`multiplication_tables_check`, `phonics` and `SATs`.

A second entry point on the same generator: filter that year's objectives by
`checkpoint`, generate a practice deck, send it the same way. The child sees their own
correct count inside the player, which it already shows. **Nothing is stored but the
pass**, which is decision 2.

`lib/learning/calendar.ts` already holds `SCHOOL_EVENTS` with `tables_check`,
`phonics_check` and `sats`, so the parent prompt can be timely rather than generic: the
tables check is in June, and offering practice in May is worth more than offering it in
November.

### 6. The navigation fix

Two one line changes plus a correction:

- `app/(dashboard)/dashboard/homework/page.tsx:34` → `/dashboard/learning?tab=homework`
- `app/(dashboard)/dashboard/printables/learning/page.tsx:50` → `/dashboard/learning?tab=ahead`
- Correct the stale comment at `LearningYear.tsx:24-40` that claims this is already fixed

### Files at a glance

| Create | |
| --- | --- |
| `supabase/migrations/188_tutor_lessons.sql` | the table |
| `app/api/learning/lesson/route.ts` | generate a deck |
| `app/api/learning/lesson/send/route.ts` | preview to sent |
| `app/api/kid/tutor-complete/route.ts` | stars on pass |
| `app/k/[token]/tutor/[id]/page.tsx` | the child plays it |
| `components/learning/TutorLessonCard.tsx` | parent preview and send |
| `app/dev/tutor-lesson/page.tsx` | fixture |
| `scripts/check-child-has-no-model.mjs` | the guard, below |

| Modify | |
| --- | --- |
| `app/(dashboard)/dashboard/homework/HomeworkDecoder.tsx` | add "make a lesson from this" |
| `app/(dashboard)/dashboard/homework/page.tsx` | back link |
| `app/(dashboard)/dashboard/printables/learning/page.tsx` | back link |
| `app/(dashboard)/dashboard/learning/LearningYear.tsx` | stale comment |
| `app/k/[token]/page.tsx`, `KidQuestScreen.tsx` | the hero card |
| `lib/kid/five-a-day.ts` | tick `homework` on completion |

---

## Verification

**The rule that needs a mechanical guard, not a promise.** Decision 1 says no model ever
runs on the child's side. That is true today and easy to break by accident later, so
`scripts/check-child-has-no-model.mjs` greps `app/k`, `app/api/kid`, `lib/kid` and
`components/kid` for `@anthropic-ai/sdk` and fails the moment one appears. It is the
cheapest possible enforcement of the single most important decision here.

**The rest:**

- Generate a deck for each of Years 1 to 6 and confirm every `objective_id` on the row
  exists, proving revalidation held.
- `parseSlides` accepts every generated deck, and each has at least two `choice` slides
  so the 70 percent pass is real.
- No dashes in any generated text. The house rule, and there is precedent for the model
  slipping them in.
- No word from the deficit list reaches a child: tricky, struggling, behind, wrong.
- A child on a token can only load their own lesson, and `script` is absent from the
  payload.
- Stars land once and a replay does not mint more.
- `/dev/tutor-lesson` renders a stored deck in the player at 390 and 1280, checked in
  Chrome DevTools before anything is called done.
- The two back links go where they say, walked by hand from the learning page and back.

## What I would watch

**Generation cost and latency.** A deck is a much bigger completion than the decoder's
700 tokens. If it is slow, generate on send rather than on view, and show the parent the
decode result immediately while the deck builds.

**The term caveat still applies.** We can say what Year 4 covers. We cannot say what a
particular school is teaching this week, and the learning rules in
`lib/learning/digi-context.ts` already forbid claiming otherwise. A lesson generated from
homework is grounded in the homework itself, which sidesteps this; a lesson generated
from the term is not, and its copy must stay on the right side of that line.

**Years 7 to 11 are still missing**, so this whole feature is silent for a child over 11.
That is phase 4, and it is the reason a secondary parent will not see the point of the
tutor yet.

---

## Later phases, in the order they were asked for

**Phase 2, the coaches.** Named Guided Childhood specialists in the Good Inside shape:
specialism chips, a plain line saying what this one helps with, a face, pick by problem.
Ours, not a reproduction of theirs. Building AI personas from five real, named,
identifiable people currently working for a competitor is a passing off and personality
rights exposure that a child safety brand should not take, and the format is available
without it.

The valuable half is **leave with a plan**, which is Good Inside's third step and the one
an AI can do better. Their coach cannot put a job on a child's phone at the end of a
call. Every component exists already: scripts are the words, quests are the next steps,
the family agreement is the thing you share, the save flow keeps it. What is missing is
the assembly, so a DiGi conversation ends as a plan with a name on it rather than as a
conversation.

The honest framing for the whole feature came out of Justin's own reference to Eton and
Clifton: what those schools sell is not teaching, it is the **tutor system**, a person who
knows the child, meets them weekly and tracks the whole child rather than the grades.
Every child gets what a Clifton parent pays for.

**Phase 3, the Guided Childhood curriculum into DiGi's brain.** The 135 lessons exist but
are organised by stage, not by topic or year, so DiGi cannot look them up. Making the
existing library addressable is worth more than writing new lessons. Vibe coding and the
changing job market are genuinely new, and are also the two that date fastest, so they
want the refresh cron pointed at them rather than being written once.

**Phase 4, Years 7 to 11.** The biggest content gap: there is no curriculum data above
Year 6 at all, so nothing school related works for a child over 11. Researched into
candidates, approved before it goes live, same as everything else.

---

## What actually shipped, 11 August 2026

Phase 1, built as planned, with four differences worth writing down.

**The validation moved out of the route.** Everything that decides whether a
generated deck is fit for a child now lives in `lib/learning/tutor-deck.ts` as
pure functions, and `scripts/check-tutor-deck.mjs` throws 37 bad cases at them.
The reason is blunt: a guarantee you can only test by calling Anthropic and
paying for it is a guarantee nobody tests. That file deliberately imports no
value from `@gc/shared`, only a type, so it runs straight from a check script.

**Stars had to be added to the bank.** `lib/quests/bank.ts` reads a fixed set of
tables and a finished tutor lesson was in none of them, so the stars a child
earned would have been a number on a screen and nothing else. It reads
`tutor_lessons` now, keyed on `done_at`, which is written once.

**The layout check is checked in.** `scripts/check-tutor-layout.mjs` walks all
ten slides of the fixture at 390 and 1280 and fails on a sideways scroll, a
dash, or a console error. Its first version stopped at the first question,
because the disabled forward button on a question slide reads "Pick an answer to
continue" and the walker matched it on the word continue: five slides out of
ten, all passing. Worth remembering, because a walker that stops early looks
exactly like a walker that finished.

**No stat, video or scenario slides.** The allowlist is six of the contract's
fifteen types. Those three want a real figure with a real source, a URL that
exists, and a fabricated social post, and a model asked for a maths lesson will
produce all three inventions on request.

Still to do, in order: the checkpoint entry point on the learning page (the
generator already takes `origin: 'checkpoint'` and reads the `checkpoint` column,
so it is a card and a button rather than new machinery), then phases 2 to 4 as
written above.
