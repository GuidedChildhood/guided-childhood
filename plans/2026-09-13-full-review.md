# Full review, 13 September 2026

Justin: "at the end run a full review to check all flows, all works quickly
and efficiently with the best coding, all industry leading navigation, buttons
back and forth working quickly, making flow sense, and makes parents rely on
this service."

Judged against `review.md`: must fix, should fix, okay to ship. Every item
below was measured, not guessed, and the ones marked fixed are in PR 1057.

## What was run

- Every CI guard, locally: 42 of 42 pass.
- The phone width overflow walk across all 118 routes: 118 of 118 pass at
  390. One pre existing reference sheet fails at 320 (`/ref-kid-home`, a
  marketing shot reference, not a screen a parent sees).
- A button and link walk of every public page and every fixture screen at
  390 and 1280: 175 screen loads, every internal link resolving, every tap
  target measured, console errors read, time to first byte recorded.
- A code review of the whole PR diff at high effort, every hunk read, callers
  and table schemas traced.
- Typecheck and a production build after the fixes.

What this container cannot do: log in. The signed in dashboard and the child's
app were reviewed through their fixture screens (the same components with
made up data) and by reading the code, not by walking them live. The Vercel
preview on the PR is where that walk happens, and the weekly UX walkthrough
routine does it against the live product.

## Must fix (all fixed)

1. **DiGi could never see a lesson pass.** The moment reader and its morning
   cron filtered `lesson_completions` on a column that does not exist
   (`created_at`; the table has `completed_at`). The query would have errored
   and the reader's own first trigger, a first lesson passed, could never
   fire. Fixed in both places.
2. **A stage crossing could be consumed without being said.** The baseline
   row the old prompts route wrote was gone, so no crossing could ever be
   noticed for a new family, and the mark was written whenever DiGi spoke
   about anything. The baseline is back and the mark is written only when the
   card was about the arrival.
3. **A horizon could be said twice.** The sources already said were read from
   the last twelve step in rows, and quiet rows accrue one a day. Now the
   spoken rows, today's quiet row and every source ever said are three
   separate reads.

## Should fix (all fixed)

4. **The join page waited on the database.** Every CTA on the site lands on
   `/join`, and it rendered nothing until a founder count came back: seven
   seconds here with the database unreachable. The count now has a 1.5 second
   clock and the page ships with the safe default. The founder cap is enforced
   at checkout, never on this page.
5. **Tap targets under 44px on product screens.** Measured at phone width:
   the four hand rolled back links on the quests pages (19 to 24px tall), the
   job schedule chips (29px), the passport's page dots (8px) and arrows
   (34px), the school week's done and delete buttons (28px), the not owned
   buttons on your screens (27px wide), the day close, not now, see all and
   see the jobs controls, the child app nudge's dots and fold button, the
   announcement dismiss, and the homepage footer links (23px). Every one is
   now 44px or a 44px hit area around the same picture.
6. **The Safe online bar disagreed with the number above it** after the four
   things card started drawing bars from lesson counts. Safe and balance draw
   from their printed value again; AI and social draw from the numbers.
7. **The Explorer check taught that AI starts at 11**, one line after the
   product said it starts at four. Reworded to the algorithm and the feed.

## Okay to ship, named out loud

- DiGi's chat anchor now reads the family state on every turn: about nine
  more queries, all in parallel with the reads already in that round. First
  token wait is the number to watch in `digi_latency` (gather2_ms). If it
  moves, the fix is one shared fetch between progress and readiness areas.
- Time to first byte on the public and fixture routes: median 4ms, ninetieth
  percentile 15ms locally. The only slow route was `/join`, fixed above.
- Thirteen fixture routes 404 in this container because they read the
  database on render. Not customer facing.
- One fixture links to a placeholder child token. Not customer facing.
- Every page has a way back: 71 dashboard pages and 19 child pages checked.
  The four flagged by the static check carry their own back inside the
  component (the slide player, the star chart, the quest games, the craft
  pack), and the child's pages sit inside the tab bar shell.
- Console errors on the public pages are the container's proxy refusing
  external fonts and images (certificate errors), not the app.
- Largest client chunk is 228KB. No route above the platform's own budget
  was found, but no route budget is enforced. A guard for that is a future
  piece, not this one.

## What makes a parent rely on it, honestly

The walk can prove speed, targets, links and the absence of errors. It cannot
prove trust. The two things in this PR that earn it are the passport saying
what a child has learned to be, in counts a parent can check, and DiGi staying
quiet most days and stepping in when something real moved. The first is
measured. The second is on the record from the first step in.
