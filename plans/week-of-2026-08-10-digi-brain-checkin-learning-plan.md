# DiGi Brain: check-in learning loop — plan

Claimed 12 August 2026. Claims migration **190**. PR 814.

Justin's ask, in his words cleaned up:

1. Check-in data must go onto the DiGi brain. DiGi must learn what we did
   when the rating goes up.
2. At some point summarise this to the user, learn from what did not work,
   try other solutions. Like natural selection: examine what works and why
   from the data, and either give Justin ways of improving the system or
   have the system suggest solutions based on data. Feed it into DiGi's
   thinking process.
3. Check: when do treasure chests appear on the pathway (age related,
   school homework, decide, nudge etc)?
4. Check: are we still doing the poll?
5. Make sure DiGi stores conversation data and uses it to learn.

## What the audit found (12 August 2026)

- `wellbeing_checks` (the weekly child tracker) DOES reach DiGi chat context,
  but averaged to one number per week with a two point trend, and no cron
  ever reads it for learning. The five dimensions are flattened away.
- `wellbeing_checkins` (the Sunday parent check-in, including the AGREED
  WEEKLY PLAN) reaches DiGi not at all. DiGi cannot say "last Sunday you
  agreed X, how did it go".
- No loop anywhere connects a rating rise or fall to what the family did
  that week. The wisdom rebuild learns from concerns and script ticks only.
- `getRatedForSituation` in lib/digi/outcomes.ts (cross family verdicts for
  a situation shape) is fully built and has zero callers. Dead code.
- The quick one tap check-in clobbers the full form's notes on the same
  week key (app/api/tracker/quick/route.ts).
- Conversations ARE stored (digi_conversations rolling 12 turns,
  digi_questions append only) and ARE reused (history + one extracted
  digi_memory fact per turn, semantic retrieval). That half is healthy.
- Treasure chests: the child's daily path chest is unreachable dead code
  since the child pathway was removed (the road redirect); the parent's
  School Chest is live, ungated, label only age awareness. Reported to
  Justin, no build.
- The poll (community bite) is live, days 1 to 7 of each month, seeded to
  July 2027. Reported, no build.

## The build: natural selection on advice

Variation, selection, heredity:

- **Selection data** — migration 190 creates `checkin_shifts`: one row per
  child per week comparing this week's tracker ratings with the previous
  week's, per dimension, plus a jsonb list of what the family actually did
  in the window (scripts and verdicts, the agreed Sunday plan, answered
  follow ups, moments, lessons) and whether an agreed plan was live.
- **The measuring cron** — /api/cron/checkin-learning, Sundays 05:30 UTC
  (before digi-wisdom at 06:00 so wisdom can read fresh shifts). Pure
  computation in lib/digi/rating-loop.ts so scripts/check-checkin-shifts.mjs
  can test it without a token. On a rise it also writes a digi_memory row
  (kind win, source rating_loop) so the semantic brain remembers what was
  done the week things got better; on a fall with a live plan, a kind
  observation row saying the plan did not move things.
- **Heredity, per family** — DiGi chat context gains: the agreed Sunday plan
  (last two weeks), recent shifts ("the week of X the rating rose and that
  week you did Y"), per dimension tracker lines instead of one average, and
  an honest trend (halves comparison, not endpoints).
- **Heredity, cross family** — rebuildWisdom gains shift signals (rises with
  their actions as wins, falls under a live plan as misses).
  getRatedForSituation gets wired into the chat route behind a cheap keyword
  situation inference (lib/digi/situation.ts), so verdicts counted across
  families finally reach answers.
- **Try other solutions** — generateWeeklyPlan is told what last week's plan
  was and whether the rating moved; when it did not move or fell, the prompt
  demands a different angle, never the same steps again.
- **Summarise to the user** — the Sunday weekly review names what moved and
  what the family did that week.
- **Summarise to Justin** — the daily insight agent reads shift aggregates
  (which actions most often precede rises and falls) and its report gains a
  system_changes section: concrete changes to Guided Childhood the data
  argues for.
- **Data quality** — the quick check-in merges instead of clobbering.

Out of scope: resurfacing the child path chest (removed on purpose), any
poll change, conversation storage changes (already healthy).
