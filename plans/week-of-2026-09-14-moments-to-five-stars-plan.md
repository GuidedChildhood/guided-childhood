# Every moment chased to five stars, and proof that it happened

Justin, 18 September 2026, dictated:

> it should say add any new moments as copy and then [an] add moments
> [control] so they can add a new moment to go on check in and fall into
> [the routine] each day until [it] gets 5 stars.
>
> 1. [check] that any moments added are caught until they get 5 stars and
>    marked as done, and we report a monthly review [showing] these have all
>    progressed, by email and PWA, saying the monthly email summary is in, and
>    that the results also [summarise] the child's progress and passport
>    progress.
> 2. that we are relentless in getting moments check ins to 5 stars, trying
>    every possible solution in our knowledge, and that DiGi knows it is a goal
>    over days to try every possible scientific, expert way to achieve the goal
>    of fixing moments.

Four strands. Two of them are mostly wiring, two of them are real builds.

## What already exists, measured before planning anything

Read from production, all families:

| source of the worry | reached done | still being chased | total |
| --- | --- | --- | --- |
| checkin | 3 | 112 | 115 |
| digi | 14 | 8 | 22 |
| moment | 3 | 13 | 16 |
| rightnow | 3 | 1 | 4 |

**23 have reached done. 134 are still open.** That is the number this whole
piece of work is about, and it is the honest starting point: the loop that is
supposed to drive a worry to five stars is finishing about one in seven.

Some of that is simply age, because most rows are recent. But the rule is
strict on purpose and worth naming: `TOP_BAND` is 9, `SILVER_RUN` is 2, and
resolving needs `improving` then better again. So a worry needs **two good
readings in a row** to rest, and today nothing works to make that happen except
the parent's own effort.

Confirmed working already, so not to be rebuilt:

- A moment raised anywhere becomes a `concerns` row and joins the check in.
  The live rows carry `source` of `rightnow`, `moment`, `digi` and `checkin`,
  and `rightnow-phone-handover` style slugs prove the path end to end.
- Five stars rests the worry and stops it being asked about
  (`lib/concerns/resting.ts`), and two better readings mark it resolved
  (`app/api/daily/concern-check/route.ts`).
- A monthly email route exists, `app/api/email/monthly/route.ts`, but it is
  the **screen time balance review only**. It says nothing about worries, the
  child's progress or the passport.
- Push exists: `lib/push/send.ts`, with quiet hours and per device tokens.

## Strand 1, the words and the way in (small)

The check in's finished screen says "Did anything else happen today?" and links
to the deck. Justin wants the wording to name moments, and an add control right
there rather than a link away.

- Copy becomes "Add any new moments" in his words.
- The existing add moment sheet (`components/rightnow/RightNowButton.tsx`) is
  reachable from the check in screen itself, so adding one is one tap from
  where the question is asked.
- After adding, the card says the line that closes the loop: it is on the
  tracker and the next check in will ask about it.

## Strand 2, proof that nothing is dropped (small, mostly a report)

Already true in the code. What is missing is anywhere a parent or we can SEE
it. So: one query behind the monthly review that answers, per child, how many
worries are being chased, how many moved, how many rested at five stars.

## Strand 3, the monthly review that reports progress (medium)

Extend the existing monthly route rather than adding a second one, because two
monthly emails to the same parent in the same week is the bug this would
otherwise create.

- Per worry: where it started, where it is now, and whether it rested.
- The child's progress: lessons, stars, days kept.
- Passport progress: which stage, what moved this month.
- A push when it lands, saying the monthly summary is in, through the existing
  quiet hours so it never fires at night.

## Strand 4, DiGi treats an open worry as a goal (large, and the real one)

This is the half that would actually move 134 to 23 the other way round.

Today DiGi answers what it is asked. Justin is asking for something different:
that an open worry is a GOAL DiGi holds across days, and that it works through
every approach it knows until the worry rests, rather than waiting to be asked.

Shape to agree before building:

- A per worry record of what has already been tried and what the reading did
  after it, so approach two is never approach one again.
- An ordered bank of approaches per worry type drawn from the research already
  in `expert_knowledge`, so "every possible expert way" is a real list rather
  than a promise.
- A rule for when DiGi offers the next approach, which has to respect the
  twice a week step in cap from 16 September, or it becomes nagging.

## What is needed from Justin

Strand 4 is the one that needs his call before it is built, because "every
possible way" has to mean something specific and the wrong reading would turn
a calm product into one that pesters. Strands 1 to 3 do not need him.

## The DiGi strand (18 September 2026, approved)

Justin: every moment added is caught "until they get 5 stars and marked as
done", and DiGi "knows it's a goal over days to try every possible scientific
expert way" to get there. Approved shape: a record per worry of what has been
tried and what the reading did afterwards, an ordered bank of approaches drawn
from the research already in `expert_knowledge`, and the existing twice a week
step in cap kept so it never turns into nagging.

Built by extending what exists, not beside it.

1. **Migration 307.** `approach`, `band_at_suggestion` on `digi_followups`;
   `approach`, `band_at_suggestion`, `band_after` on `digi_outcomes`, plus the
   per worry index.
2. **The record was never being written.** `digi_outcomes.concern_id` has
   existed since migration 154, indexed and documented. Read live: 6 rows, 0
   with a worry attached. The followups cron copied `moment_id` and dropped
   `concern_id`. Fixed, and the two bands ride with it.
3. **`lib/digi/approaches.ts`**, a reader. The bank per worry, walked in order
   with what was tried taken out, plus the block DiGi sees.
4. **`schedule_followup` gains `worry`.** The model names a worry it can read
   off its own context; the SERVER decides which approach that counts as.
5. **The restraint.** A worry at silver is out of the block, and its approach
   is not marked spent. Nothing here writes a prompt card, so the twice a week
   cap stays the only door DiGi can knock on.
6. **`scripts/check-worry-strand.mjs`**, 38 rules, 32 of 32 mutations caught,
   in the `concern-guards` job.

The find worth keeping: `devices` is the topic a phone worry infers, and the
research bank has zero rows tagged `devices`, it files them under `phone`. So
`phones-and-messaging`, the second most common worry on the product, would
have found no research at all. Rule A of the guard holds that join now.
