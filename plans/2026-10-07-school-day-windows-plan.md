# 7 October 2026: the two school day windows, built on what is already there

**Status, 7 October 2026, evening: built in PR 1210 (draft until Justin has
seen it), migration 363 waiting to be applied.** Two deviations from the plan
below, both recorded in the PR: the Home card is its own component
(`components/home/SchoolWindowCard.tsx`) rather than a `slot` kind in the
alerts rows, because those rows have no body and no buttons and sit under a
fold; and the migration number is 363, since 361 landed with the lesson clips and 362 with the quiz slides.
The briefing it rests on is the verified V3 (the Early Years lens added), `briefings/2026-10-07-school-day-routines-v3.html`.

From the research briefing `briefings/2026-10-07-school-day-routines-v3.html`
(nine lenses, platform mapped) for Justin's ask: "research the best morning
before school routine and after school return so we can build advice in and
cleverly pre empt what happens ... as well as giving parents opportunity to
log as a moment so we can track and provide best advice."

## The three things the evidence changed about the ask

1. **Lead with sleep and food, not the screen.** Two randomised experiments,
   the UK cohort and the Orben datasets all say the morning is paid for the
   night before and at the last meal. The morning card's first line is a
   state check and one low demand move. The after school card leads with
   hunger, company and a predictable stopping point.
2. **The minute is worth single digits; the loop is the product.** Three
   texts a week beat five (five raised opt out 58 percent and helped nobody);
   timing added a few points at most in two microrandomised trials; stressed
   people ignore prompts built for their stressed moment; web push reaches
   5 to 8 percent of a web app's families. So: one window per family by
   default, parent chosen, the card pinned on Home, and the one tap moment
   on the card itself.
3. **Never name a syndrome.** "Restraint collapse" is a 2016 blog term whose
   mechanism failed replication. Describe the pattern. And never claim
   morning screens cause lateness: there is no study, and the DfE publishes
   no lateness figures.

## Build (medium, one migration, one PR)

Verdicts from the platform mapper are in the briefing; nothing below is new
plumbing except two columns and a button.

1. **Migration 361**: `children.school_start_minutes` and
   `children.home_minutes`, nullable; plus an idempotent seed by title of four
   scripts: The first twenty minutes home (feed first, ask later); The snack
   before the question; How was school, without asking it; The stopping
   point agreed in a calm moment. Check live titles first; nine morning and
   homework scripts already exist.
2. **Settings**: two half hour pickers beside `school_region`
   (`app/(dashboard)/dashboard/settings/page.tsx`).
3. **The slot sends** (`app/api/push/cron/route.ts`): replace the two
   broadcasts with a per family pass on the `runEveningPass` pattern.
   Morning target = start minus 50 minutes, afternoon = home plus 15;
   defaults 07:30 and 15:30; gated on `isSchoolDay(now, region)` from
   `lib/quests/job-time.ts`. ONE window per family by default (the parent
   picks morning or after school at the setting; both only if they opt up).
   Body from the child's band `daily_moments` Morning or After school row,
   or the family's top morning worry. Deep link to Home. No new cron.
4. **The Home card**: a `slot` kind in `lib/alerts/suggestions.ts` using the
   `ukHour` it already receives, shown in the family's window on school days:
   one move, "Read the words" (script href via `lib/content/signal-map.ts`),
   and the one tap moment, "It happened" and "Went fine", posting to
   `/api/daily/feedback` with the moment key (`tv_morning`, `morning`,
   `come_off`, `homework`) and the child, which already raises the worry and
   wakes the check in. "I tried it" through `/api/moments/tried` writes the
   `digi_outcomes` row with its time band. Framed as logging it with the
   child, never about them.
5. **Copy by band**, in the tables: primary cards speak to the parent at
   the gate (warm, wordless, snack in the bag, no questions for twenty
   minutes); secondary cards speak to the parent who arrives later (the
   bedroom, the phone charging downstairs, one specific question at tea).
   Morning cards: "Same time up, early night tonight", "food before the
   demand", the screen only after dressed, teeth and bag by the door.
6. **DiGi rails** (`lib/digi/brain.ts` prompt text, no new door): describe
   the after school pattern, never name it; at 07:20 lead with sleep and
   food; a morning fight on school days only with a stomach ache is school
   avoidance until shown otherwise, route to the school and the GP. Add
   sourced `expert_knowledge` rows tagged `morning` and `after_school` per
   band from the briefing's verified ledger (fewer than three morning rows
   exist outside the situations seed).
7. **One metric**: card to moment rate in week four, 15 percent or above,
   kill or redesign under 10 percent, push opt outs under 5 percent. Plus a
   pure read grouping `device_sessions` and flagged moments by London hour
   band (nothing does this today).

## Do not build

- A per family right minute inference layer.
- Both windows every school day by default.
- A parent streak, badges or habit meter around the cards.
- A daily DiGi prompt card for the morning: `scripts/check-digi-step-in.mjs`
  rule E fails the build on any cadence trigger, and the step in cap is the
  only door DiGi knocks on.
- A fourth home for the advice. It lives in `daily_moments`, `scripts` and
  `expert_knowledge`; the card reads from them.

## Schools (separate PR, after the parent build)

A morning and after school home guide in the schools parent pack pattern
(printable, no login, links new parents to `/starter-pack`), sent by a school
through its own MIS with one link, once: to the half termly late list by the
attendance champion, as the parent letter for the statutory sleep lesson in
force from 1 September 2026, and in the breakfast club welcome pack and the
Sunday evening message before each term. The DSL confirms in writing that a
logged moment stays with the family. Prove it in one pilot primary with the
L and U register marks before and after.

## Guards to keep green

`check-digi-step-in`, `check-daily-moments`, `check-device-issues`,
`check-habit-loop`, `check-silver-rule`, `check-checkin-outcome`,
`check-followup-once`, `npm run ai-tells`, `npm run context-guard`.
