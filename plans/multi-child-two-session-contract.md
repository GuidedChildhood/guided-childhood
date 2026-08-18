# Working contract: the passport session and the plumbing session

Written 18 August 2026 for whoever is rebuilding the passport, so the two
sessions meet in the middle rather than in a merge conflict.

## 1. READ THIS FIRST: I changed two of your files today, and both are on main

- `55aa7ed1` **Four blocks left the passport page for Today's rotation.** Removed
  from `/dashboard/pathway` and `IsItWorkingReport`: the Your focus strip, the
  School chest, the BalanceReport block and LiteracyCheckIn. Each is going to the
  daily or weekly rotation instead. The `#screen-balance` anchor was deliberately
  left behind as an empty div, because the checklist above still taps down to it.
- `9a25fd1a` **The weekly tier.** Added a `#why-this-works` anchor immediately
  above `<PathwayEvidence />` on the pathway page, which a weekly rotation card
  now links to.

**If you branched before those merged, rebase on main before you go further.**
And one open loop that is yours to close or hand back: LiteracyCheckIn, DiGi's
four strands question, is now rendered NOWHERE. It was removed before its
rotation item existed. It needs one adding, or putting back.

## 2. THE PROTOCOL: `?child=` is how the parent app says which child

One convention, already in the codebase, and everything must use it.

- `lib/children/select.ts` → `pickChild(children, param)`. Falls back to
  `is_primary` then first, so old bookmarks behave as before.
- `components/children/ChildSwitcher.tsx` writes `?child=<id>`, hides itself
  below two children, and keeps the clean URL for the primary child.

**Never read `is_primary` to decide what to display.** That is the single fault
behind almost the entire audit: it is the de facto "which child" on about forty
surfaces, and migration 203 closing the multi primary hole turned a silent crash
into a silent wrong child, which is harder to notice.

## 3. DO NOT ADD A SECOND SWITCHER

`IsItWorkingReport.tsx:174` renders a ChildSwitcher INSIDE the pathway page,
which already has one at `pathway/page.tsx:306`. Two switchers on one page can
disagree.

**My step 1 puts the switcher and the selection into the dashboard layout**, so
it survives a tap and every page inherits it. So on the passport: read the param,
render no switcher of your own, and delete the inner one when step 1 lands.

Say the word in the PR and I will sequence step 1 before or after your rebuild,
whichever you prefer. It only has to happen once.

## 4. THE THREE WAY SYNC, which is the thing Justin actually asked about

The same child must look the same in three places. They agree ONLY if all three
key on the same `children.id`.

    PARENT TOGGLE  ?child=<id>          the parent chose this child
    PASSPORT       reads that id        the parent's view of that child
    CHILD APP      /k/<token> -> kid_links.child_id -> the SAME id

The child app is already correct: every route resolves the token to one child and
scopes to it. `kid_links` has `unique (child_id)`, so one token is exactly one
child. It is the parent side that drifts.

**So the test for any passport block is one sentence:** switch to Olga on the
parent app, and does this number match what Olga sees in her own app? If the
block reads by `user_id` alone, the answer is no.

## 5. PER CHILD OR FAMILY: the reference list, so nobody has to re-derive it

**Genuinely per child (has child_id, use it):**
concerns (since 194), wellbeing_checks, quest_ticks, quest_requests, star_goals,
star_spends, stage_passports, device_sessions, kid_links, printable_assignments,
kid_nudges, stage_quiz_passes, learning_sheet_results, earned_stickers,
checkin_shifts, lesson_pass_by.

**Family only, and that is a BUG where content is child specific:**
- `lesson_completions` — no child_id at all. **Use `lesson_pass_by` instead**: it
  already exists with child_id and is already written (migration 162,
  lesson-complete/route.ts:126) and nothing reads it. Free fix, no migration.
- `school_actions` — no child_id across 205 migrations. Needs migration 207,
  which is mine, step 4.
- `family_agreements` — per child is planned, migration after 207, step 7.

**Legitimately family level, leave alone:**
family_quests with a null child_id is a whole family job by design; profiles;
daily_sessions; script_completions.

## 6. RESERVED, SO WE DO NOT COLLIDE AGAIN

Three migration collisions in three days, all from parallel sessions.

- **206 and 207 are mine** (quest_ticks child key; school_actions child_id).
- **Take 208 upward** and name your number in your PR title the moment you take
  it, per CLAUDE.md.
- I will not touch `/dashboard/pathway`, `/dashboard/passport`, `PassportBook`,
  `IsItWorkingReport`, `LiteracyAreas` or `StageRoad` until you say you are done.

## 7. WHAT THE PASSPORT NEEDS, from the sweep

Every number behind every stamp is family level today, so all children show an
identical passport.

- PassportBook: lessons done, scripts resolved, devices set and contentComplete
  are all family wide. Switch child and nothing moves.
- The stamp celebration flags are global localStorage keys with no child id, so
  the FIRST child's stamp burns the second child's celebration. That one is
  invisible and unrecoverable, so it is worth doing early.
- Moments to resolve, What we are working on, and the tailored card read
  `concerns` without `child_id`, though the column exists and is in the unique
  key. A worry about the teenager drags the six year old's percentage down.
- The four strands vary only by stage number; every input is family level.
- Stars earned this week sums every child while the copy names one.
- The weekly check in reads `wellbeing_checks` by parent, and its form hard reads
  the primary child, so pressing it can save an answer against the wrong child.
