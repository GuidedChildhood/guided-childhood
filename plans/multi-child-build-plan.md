# The multi child build plan

Justin, 18 August 2026: "set up the best plan to get this all done, as currently
working on the passport page in another session and that also needs to be multi
child, and the multi child needs to sync with the right child app. Do a thorough
check on what needs to be fixed and then let me know, build step by step."

Evidence: plans/multi-child-audit-18-aug.md (the platform), plans/multi-child-
shape.md (the design and the Mobbin research), plus the child app and passport
sweeps folded in below.

## LANES, BEFORE ANYTHING ELSE

Two sessions are live and multi child touches nearly every file. Three migration
collisions in three days already came from exactly this. So:

- **THEIR LANE:** `/dashboard/pathway`, `/dashboard/passport`, PassportBook,
  IsItWorkingReport, LiteracyAreas, StageRoad. Step 6 below is written FOR them
  and I will not touch those files.
- **MY LANE:** shared plumbing, the child app, DiGi, and the schema.
- **Migration numbers claimed here: 206, 207.** Named now so nobody else takes
  them.

## THE ONE FREE WIN, TAKE IT FIRST

`lesson_pass_by` ALREADY exists with child_id, and lesson-complete ALREADY writes
it (migration 162; app/api/kid/lesson-complete/route.ts:126). Nothing reads it.
So the worst lesson bug needs NO migration, only changed reads. That is the
cheapest real fix on the list and it is step 2.

---

## STEP 1 — Carry `?child=` through the app  *(no migration, one merge)*

The root cause. ChildSwitcher writes `?child=` into one page's URL; six links in
the whole codebase carry it forward; NavTabs and MobileTabBar carry nothing.

- Thread the selected child through the dashboard layout so nav tabs, the mobile
  tab bar and the tiles append it.
- Add ChildSwitcher to the seven deep pages: stats, devices, lessons, moments,
  daily, digi. (Passport is theirs.)
- Each of those reads `pickChild` + `?child=` instead of `is_primary`.

Fixes most of audit tier 3 in one change. **Nothing else should start before it**,
because every later step assumes the selection survives a tap.

## STEP 2 — The four silent corruptions  *(migration 206, one merge)*

Writing wrong rows today. Ordered by damage.

1. **Lessons credited to the wrong child.** `/dashboard/lessons/together/[code]`
   writes the completion against `is_primary`. Take the child from `?child=`.
2. **`lesson_completions` is family wide.** Read `lesson_pass_by` (child_id, free,
   above) for done/score/next everywhere the child app and lessons pages show a
   tick. The one-lesson-a-week gate is the sharpest: today, if the eldest passes
   one on Monday, the youngest is offered nothing all week.
3. **A family job pays every child.** `quest_ticks` is unique on
   `(quest_id, tick_date)` with no child. Migration 206 adds child_id to the key
   so each child banks their own tick.
4. **DiGi files everything against the primary child.** Covered in step 5, but the
   WRITE half is urgent: memory, concerns and questions must take the child being
   discussed.

## STEP 3 — The child app  *(migration 206 continued, one merge)*

The child app is otherwise very good: every route resolves the token to one child
and scopes correctly. Three breaks.

1. **`/k/[token]/deal`** reads `family_quests` by user_id with no child filter, so
   a child prints a wall document listing their sibling's jobs at their sibling's
   star rates, under their own name. `star-chart/page.tsx:47` already does it
   correctly; copy that one line.
2. **Lessons** as step 2.2 above, on the child side.
3. **School items**, which needs step 4.

## STEP 4 — School per child  *(migration 207, one merge)*

`school_actions` has NO child_id across 205 migrations, and `sent_to_child` is a
single boolean. So every school item lands on every child's phone: the seven year
old sees GCSE coursework, the fourteen year old sees show and tell, and a parent
sending "this one to their phone" sends it to all of them.

There is no schema shape in which a school reminder can belong to one child, so
this one genuinely needs the migration: nullable child_id, null meaning the whole
family, exactly the pattern 194 used for concerns.

Also here: `sendPush` has no childId, and eleven call sites use the broadcast
`audience: 'kids'` door for child specific news. And the approval push does not
say WHICH child ticked, which is unreadable when both have a job called "Tidy
your room".

## STEP 5 — DiGi per child, and the family picture  *(no migration, one merge)*

The non-negotiable is a calibrated pathway, and it is calibrating to the wrong
child. Every retrieval, research, wisdom, proven solutions, outcomes, moments and
the recommended script, is keyed to the PRIMARY child's stage.

1. Pass the child being discussed, from `?child=`, into every retrieval.
2. Select `child_id` on concerns and wellbeing and LABEL them by name in the
   prompt. Today two children's worries merge into one list and DiGi will
   attribute one child's to the other.
3. Give `get_child_history` a child parameter. It is the tool DiGi reaches for
   when asked about one child, and it returns an unlabelled blend introduced as
   authoritative.
4. Give the prompt the FAMILY picture: how many children, their ages and stages,
   so DiGi can answer "the older one is fine, the younger copies him" and can ask
   "which one do you mean?" when it is ambiguous. It has only a roster of names
   today.

## STEP 6 — The passport  *(THEIR LANE. This is the handover.)*

Every number behind every stamp is family level, so all children show an
identical passport. Specifically, for whoever is in that file:

- PassportBook: lessons done, scripts resolved, devices set and contentComplete
  are family wide. Switch child and nothing moves.
- The stamp celebration flags are global localStorage keys with no child id, so
  the first child's stamp BURNS the second child's celebration.
- "Moments to resolve", "What we are working on" and the tailored card read
  `concerns` without `child_id`, though the column exists. A worry about the
  teenager drags the six year old's percentage down.
- The four strands vary only by stage number; every input is family level.
- "Stars earned this week" sums every child while the copy names one.
- The weekly check in reads `wellbeing_checks` by parent, and its form hard reads
  the primary child, so pressing it can save the answer against the wrong child.

## STEP 7 — Agreements per child  *(migration after 207, one merge)*

Last, because it sits inside all of the above. Design already settled in
plans/next-first-run-and-reminders.md sections 9 and 9b: nullable child_id, null
means the household agreement, and the sibling copy carries only the clauses the
sibling's TYPE also has, lands on the clauses step pre-filled, and never inherits
a signature.

Includes the bug nobody has reported: `app/k/[token]/page.tsx` reads
family_agreements by user_id, so a younger sibling reads the agreement written
about the older one.

---

## IF THERE IS A CLOCK

Steps 1 and 2 remove every silent data corruption and the worst of the confusion.
They are the stopping point that leaves the product honest. 3 to 7 are a second
pass and can wait without anything being written wrongly in the meantime.
