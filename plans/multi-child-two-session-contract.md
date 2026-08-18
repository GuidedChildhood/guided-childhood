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

## 5. FAMILY OR CHILD: the rule, and it is not a judgement call

Justin, 18 August 2026, asked directly whether the passport to do is family or
child focused: "we are working on making all aspects such as scripts, moments,
lessons child related not family, so the passport should follow. Make sure there
is no overlap or confusion here."

So there is one rule and it is short.

**If a child does it, learns it, or is talked to about it, it is per child.**
**Family level is the account only: the profile, the subscription, the parent's**
**own settings.**

Everything on the passport, every rung of its to do, is about the child in
`?child=`. Not the household, not the primary child, that child.

### The one deliberate exception, named so it stops being a question

A job can be created as a WHOLE FAMILY job: `family_quests.child_id is null`,
which is how "everyone tidies the kitchen" is meant to work, and it appears on
every child's board on purpose.

That is not an exception to the rule, because the rule is about DOING. The job
may be shared; the doing of it never is. Each child banks their own tick, which
is precisely what migration 206 fixes. So even here the passport reads per child.

### What that rule reclassifies, and it is more than it first looks

Two tables I previously listed as legitimately family level are NOT, under this
rule, and both are live faults today rather than tidying:

- **`daily_sessions`** is `unique (user_id, session_date)`. One session per
  FAMILY per day. So doing Today with Teo marks the day complete for Alma too,
  and the second child's day is over before it started. This is the sharpest one
  on the list because Today is the daily loop.
- **`script_completions`** is `unique(user_id, script_sort_order)`. A script is a
  conversation with ONE child, and reading it with the eldest retires it for the
  younger one, who never gets offered it.

Both need child_id. Claimed as **migration 208** below.

### The reference list

**Genuinely per child already (has child_id, use it):**
concerns (194), wellbeing_checks (001), quest_ticks (029, but see the key fault),
quest_requests, star_goals, star_spends, stage_passports, device_sessions,
kid_links, printable_assignments, kid_nudges, stage_quiz_passes (098),
learning_sheet_results, earned_stickers, checkin_shifts, lesson_pass_by (162).

**Per child by the rule, but not yet in the schema:**
- `lesson_completions` — no child_id. **Use `lesson_pass_by` instead**: it exists
  with child_id, is already written (162, lesson-complete/route.ts:126) and
  nothing reads it. Free fix, no migration.
- `daily_sessions`, `script_completions` — migration 208, above.
- `school_actions` — no child_id across 205 migrations. Migration 207.
- `family_agreements` — per child, migration 209, step 7.

**Family level, and correctly so:** profiles, and the subscription on it.
That is the whole list.

## 6. RESERVED, SO WE DO NOT COLLIDE AGAIN

Three migration collisions in three days, all from parallel sessions.

- **206, 207, 208 and 209 are mine.** 206 quest_ticks child key, 207
  school_actions child_id, 208 daily_sessions and script_completions child_id,
  209 family_agreements per child. 208 and 209 are a CORRECTION: I told the
  passport session 208 was free before Justin's rule reclassified two more
  tables, and the agreements migration moved to 209.
- **Take 210 upward** and name your number in your PR title the moment you take
  it, per CLAUDE.md. The passport session has confirmed it needs none.
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

## 8. WHICH PAGES CARRY THE CHILD, from Justin, 18 August 2026

Named directly, so neither session has to infer it:

> "Scripts page for all children with toggle. Quests page with child toggle.
> Lessons making sure it toggles for child and the lessons shown first are age
> related to that child. And DiGi of course, although it also has family so
> keeps knowledge of all children to help better family advice."

> "Setup is not by child in general, although sharing the app, agreements (as
> other children are added a step before) and check in are all per child."

So the rail belongs on: **Home, Today, Check in, Scripts, Quests, Lessons, DiGi,
Stats, Devices, Moments, School, Passport.**

It does NOT belong on: **the Setup Quest itself, Settings, billing, Upgrade,
Orders, Notifications.** Setup is a job the FAMILY does once. Three of its steps
happen to be per child (share the app, the agreement, and the check in that
follows it), and each of those handles its own children INSIDE the step, which is
why the quest page as a whole needs no pill row.

### The DiGi exception, which is not an exception

DiGi reads EVERY child, always, and must keep doing so: a family's advice is
better for knowing there is a fifteen year old in the house when the question is
about the nine year old. What changed on 18 August is only where DiGi FILES what
it learns. It talks with the whole family in mind, and it writes against the
child in `?child=`.

### Lessons: order, not just scope

Justin asks for something beyond the toggle here: the lessons shown FIRST should
be the ones for that child's age. Switching to the six year old should reorder
the library, not merely relabel it. That is a sort, and it is the difference
between a toggle that works and a toggle that matters.
