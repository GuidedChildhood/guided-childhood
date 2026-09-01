# Add a job, Apple level

Justin, 1 September 2026, with a screenshot of the Add a job tab on his
phone: make adding quests top visual UX like the best Mobbin examples of
apps that do this, Apple level, where the best jobs for the child's age
appear in order of most useful, super easy to add and send to the child's
app, happy news style icons showing the jobs, and matching the look of the
child's app.

## What the screenshot shows

The suggestions are a tag cloud of pill chips. On a phone with the text
turned up each chip wraps to two or three lines, the emoji sizes drift, the
Now button sits on top of the chips, and a chip bleeds under the tab bar.
The ideas are one flat list of 30 with play first, so a parent of a four
year old sees Bins out and a parent of a fifteen year old sees Shoes away.
Tapping a chip starts a two question wizard before anything is added.

## Mobbin, read this evening

- Greenlight, Add Chore: Add your own chore as the first row, then
  Suggested Chores as a list of rows, one emoji and a chevron each.
- GoHenry, Add a task: task name input, then Popular tasks as rows with a
  tinted rounded square icon tile on the left and the value on the right.
- Finch, Goal ideas: category tabs across the top, rows with a plus each,
  the added row turns green with a tick and stays in place.
- Liven, New task: category tabs, rows with a plus, the input above.

The lesson: rows, not chips. One icon tile, one title, one value, one
plus. Own input first. Categories as one scroll row. Added means a green
tick in place, never a jump.

## The build

1. `lib/quests/best-jobs.ts`: for each of the five stages, the twelve to
   fourteen most useful jobs at that age in usefulness order, each with a
   one line why, a kind (routine, home, school, play, kind, growing up),
   the stars, the repeat and the time of day. Titles reuse the library's
   own wording where it exists so dedupe against the board still works.
2. `components/quests/JobPicker.tsx`: the picker. A header with the
   stage's Planet Friend in the happy news ring saying whose picks these
   are, a scroll row of kinds, then the ranked rows: a 52px tinted icon
   tile matching the child app's tiles, the title, the why, the star pill
   and repeat, and a round butter plus. One tap adds with the job's own
   repeat and sends it to the child's app; the plus becomes a green tick
   and the row says Sent to Alfie. Tapping the row itself opens the four
   repeat chips inline for anyone who wants to change it first. Used
   before sits above as the same rows. More ideas folds below.
3. `ManageJobs` Add tab: the composer stays on top for typed jobs, the
   chip sections go, the picker takes their place, and the page carries
   enough bottom padding that the last row clears the Now button and the
   tab bar.
4. Dev fixture at /dev/add-job so Playwright can screenshot the picker at
   390 and 1280, with the text turned up.

## BUILT, 1 September 2026, late evening

All four steps, on PR 947's branch. The library carries 64 ranked jobs
across the five stages, each with its why and its kind. The picker is the
Greenlight and GoHenry shape in our tokens: the Planet Friend's ring from
the child app's happy news, the child app's tinted tiles, the value over
the plus, one tap to add and send, the row turning sage with a tick and
Sent to Alfie's app, the repeat chips inline for anyone who wants them,
used before as the same rows, and the rest of the library folded under
More ideas. Verified with Playwright at 390 (default and 22px root text),
and 1280: zero sideways overflow, zero page errors, the failure state says
so and offers a retry. tsc, wiring (0 new) and the check in guard green.
The Now button and the tab bar no longer sit on the last row because the
page carries 150px of bottom padding instead of 48.
