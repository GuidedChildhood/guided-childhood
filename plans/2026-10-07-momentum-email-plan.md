# 7 October 2026: the momentum block, successes and nuggets without a new email

Justin, 7 October 2026: "every now and again email the successes to keep
momentum, motivated, and some info research on helping parents, top experts
quotes and why our system works, all in digestible clever email form,
automated, not too often, and how it benefits your child, and support parents
with some nuggets on parents' time, don't get stressed around guilt, shouting,
losing it, how to help support it."

Justin said yes the same afternoon ("2 yes plus future emails can echo this"). Built as `lib/email/momentum.ts`, drawn by `lib/email/templates.ts` inside the Sunday review and the monthly review, held by `scripts/check-momentum-block.mjs`.

## What already sends, so nothing is built twice

- Days 0 to 7, then the weekly service programme (`lib/email/weekly-programme.ts`,
  weeks 17 to 26): one part of the service a week, Justin's why, one thing to
  do today.
- The method week (`lib/email/method-week.ts`): the thinking under the tools,
  anchored to first use.
- The spotlight registry (`lib/email/spotlights.ts`): one service a week named
  in the weekly digest, a registry so it never goes stale.
- The Sunday DiGi weekly review (`app/api/cron/weekly-review`): each family's
  own numbers, stored and pushed.
- The monthly review (`lib/email/month-progress.ts`): per child, what moved,
  what rested, the biggest mover, lessons passed, stages stamped.
- The floor: `sendEmail` refuses a programme email inside six days of the last
  one (`lib/email/floor.ts`). One email a week from all systems is a property
  of the platform, not a policy.

## The recommendation: a block, not a new email

A new fortnightly email would fight the six day floor and lose, and "not too
often" is already enforced by it. So the momentum content rides inside the two
emails a family already gets, as one block each:

1. **The success line, first.** Built from the same reads the monthly review
   uses, per child: "Bedtime went from hard going to going great and came off
   your list" or "Two worries moved this month." Never a composite score.
   When nothing moved, the line is honest and small: what is still being
   tracked and that we are on it.
2. **One nugget, with its source.** Drawn from `expert_knowledge`
   (`source_type`, `source_name`, `finding`, `topics`, `age_bands`), matched
   to the child's age band and to a worry the family actually has. Evidence or
   silence: a finding with a named source or no nugget that week. No invented
   quotes; a quote is used only where the row carries the exact words.
3. **Why it works, one sentence, tied to what they just did.** The same
   three ideas THE-STORY.md section 3 holds, one at a time: connection is the
   protection, earned not granted, the positive pathway. Rotated from a
   registry like the spotlights, so it is written once and never goes stale.
4. **The parent support nugget.** Guilt, shouting, losing it, repair. One
   line and one deep link to the matching script in the `scripts` table
   (the repair scripts, "I shouted, now what" family). Check the table for the
   category before writing a word; if no repair script exists, that is the
   first thing to add, in the database, not the email.

Order matters: the success first because a parent reads the first line, the
nugget second because it is interesting, the support line last because it is
the one they will remember.

## Guards before it ships

- `npm run ai-tells` on every block (no dashes, no stock phrases).
- A guard that fails if a nugget has no `source_name`.
- `check-monthly-review.mjs` stays green: the block reads, it never writes.
- The floor untouched: the block cannot add a send, only ride one.

## Size

Medium. One registry file, two block renderers, one read helper shared with
`month-progress.ts`, one guard. No migration. One PR.
