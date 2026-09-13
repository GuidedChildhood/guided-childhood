# DiGi as the driving force, and the stamp that means AI literate (13 September 2026)

Justin, 13 September 2026, decoded from a voice note: "Now DiGi is at the level
of 5.1 it should be able to think when to step in and advise the user what is
best for the goals we set. Proactively looking for wow moments to help parents:
age related common parenting worries, what part of our service will help, and
getting to the goal of a completed passport in steps. Aware of the social media
changes happening on platforms, making sure we stay on top, relevant and a
unique must have tool. DiGi should become an agentic driving force, learning on
its own from our philosophy, truly unique, not replicable, better than AI
services if possible, and demonstrating why."

My assessment and recommendations went back the same morning. Justin: "Go with
your recommendations." This plan is those recommendations as a build.

## What exists (audited before writing this)

DiGi already has most of the parts: a knowledge bank of 142 findings, a per
family memory, follow ups it keeps, the Sunday weekly review, the twice weekly
word, the monthly passport check, the horizons by age (`lib/digi/horizons.ts`,
already rendered into every chat call), the cross family wisdom rebuild, the
did it work loop, the monthly self review, the fortnightly research updater
with Justin as the gate. Live usage is tiny: 8 conversations, 79 questions, 3
outcomes, 0 platform updates ever drafted.

Three gaps, none of them a missing part:

1. **It does not know the goal.** `getPathwayPosition` (`lib/digi/brain.ts`)
   gives DiGi the stage and the next lesson or script. It says nothing about
   the four things, the worry that has moved, or the child's own days.
2. **Stepping in is on a calendar.** `findTriggers` fires on four hard rules
   plus a drumbeat every three days (a tip, a parent care nudge). The twice
   weekly word fires on Tuesday and Friday whatever happened.
3. **Platform changes have a table and no source.** `ai_updates` has a
   drafting route that nothing calls and a draft that nothing shows.

## The build, in order

### A. The AI modules gate the stamp (passport, approved)

`lib/pathway/progress.ts` counts the age band's AI modules (`ai_lessons`) in
`lessonsDone` and `lessonsTotal` for both the single stage and the all stages
reading, so the ring, the row, the sticker tile, the to do and the stamp all
move together and `contentComplete` requires them. Same credit rule as every
lesson (`lesson-credit.ts`). Guard rule added to `check-readiness-areas.mjs`.

### B. The goal, every turn

`lib/digi/family-state.ts`: one reading of where the family is against the
goal, for one child. The four areas for the stage (`readiness-areas.ts`), the
worry that has moved the most (`improvedLine`), the child's own days and timer
days (`passport-child.ts`), the check status. `getPathwayPosition` renders it
into every chat call, and the word's brief carries it too. No new model call:
the judgement of when to name it is 5.1's, with one rule kept from today:
one calibrated next step, never a list.

### C. The moment reader, with a cap

`lib/digi/moment.ts` replaces the four rules and the drumbeat. It is run from
two places: the dashboard visit (the prompts route, where `findTriggers` ran)
and a daily 07:20 UK cron for families where something changed yesterday.
It gathers the family state, what changed since DiGi last stepped in (a check
in band moving, a lesson passed, a device added, a stage arrived, a birthday
inside a month, a horizon for this band not yet said, the timer unused for a
week while the balance is over), the hard signals `findTriggers` still finds,
and what DiGi said before. Then one question to the model: is there something
worth an interruption today. Most days the answer is no and nothing is written.

The cap is code, not prompt: `DIGI_STEP_IN_PER_WEEK` (default 2) and never two
days running, checked before the model is called. A step in is a
`digi_prompts` row in an existing kind (no migration: the kind check
constraint stays as it is), with `reason` starting `step_in:` and `source` set
to the horizon it leaned on, so a horizon is never said twice. It pushes
through `sendPush`, which already holds quiet hours and mute.

Horizons said early live here: a horizon for the NEXT band, when the child is
within three months of it, is a strong reason to speak. That is the wow moment
Justin described: hearing about the first group chat a term before it lands.

### D. Platform changes, from a source, through the gate

`lib/config/platform-sources.ts`: four feeds, Ofcom, ICO, Common Sense Media
and the platform newsrooms (TikTok, Meta, YouTube, Snap). A weekly cron fetches
them, keeps items from the last eight days that touch children, teens, age or
safety, and drafts through the existing AI updates prompt into `ai_updates`
as drafts (`lib/ai-updates/draft.ts`, lifted out of the route). Justin gets
the same kind of email the research updater sends. Approval is a founder
action; on publish, one `new_research` prompt goes to families whose child's
band matches the audience. Nothing reaches a family without his click.

### Guards

- `check-readiness-areas.mjs` gains rule E: progress.ts counts `ai_lesson`
  passes for the band in `contentComplete`.
- `check-digi-step-in.mjs`: the cap is config with default 2; the never two
  days running rule holds; the reader writes nothing when the model says no;
  the drumbeat literal is gone from the prompts route; every written kind is
  one the table accepts. Mutation tested, in CI.

## Decisions recorded

- Cap: twice a week, never two days running, as config.
- Human gate on self learning stays. Nothing here writes to the bank or to
  families without Justin's click, except the step in itself, which is DiGi
  speaking, the same as chat.
- No migration. The kind constraint on `digi_prompts` stays; provenance lives
  in `reason` and `source`.
- Same branch and PR as the passport work (1057), because this session may
  only push to that branch. Small PRs are the rule; this one is not, and the
  PR body says so.
