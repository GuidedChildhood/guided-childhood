# 13 October 2026: the child's home, simpler and properly linked

Justin, with screenshots of Teo's app: parent DiGi advice was showing on the
child's home, and "can we simplify the app home page first page ... loop, fun
... super easy to follow through ... the most useful parent linked app."

Four agents reviewed the home first: a code map of every block, a real browser
walkthrough at 390 and 1280 as a 7 and an 11 year old, a Mobbin sweep (Duolingo,
Finch, GoHenry, Greenlight, Headspace, Fabulous), and an audit of every child to
parent loop.

## Shipped

- PR 1263: parent advice never reaches the child. Send to their phone only
  under the child's version; dashboard links refused; markdown stripped; any
  stored parent note hidden; long notes clamp. Guard: check-kid-notes.
- PR 1268: a "not done yet" reaches the child kindly and the job can be ticked
  again (it used to be silently blocked while the parent was still pushed).
  Guard: check-job-not-yet.
- PR 1264, this plan's first pass:
  - each tab is its own page: Lessons and Printables no longer redraw the home
  - red badges count only what a grown up sent (no more 9+ every day), which
    also stops a finished child being moved off the home
  - a rejected job is not counted done on the home
  - the yes card prices at the child's own rate, thanks a family job, refreshes
    the bank; Use my time uses the child's rate
  - "Do a job" in the presence nudge goes to the jobs (was a dead scroll)
  - the jobs step wears its stars ("+6 ⭐"), the Duolingo reward on the button
  - "step 6 of 5" clamped; the "do X first, then ask again" card only after a
    real ask; the tab bar is capped on desktop
  - Guard: check-kid-home-simple.

## Proposed next, needs Justin's call (each reverses an earlier decision of his)

1. One streak, not four. The streak bar, "N days in a row", the balance card's
   day streak and the greeting's full days are four counters from four props.
   Keep the streak bar with the next Friend; drop the other three.
2. The five a day at the top. Today the school diary, greeting and streak bar
   come first and the page scrolls itself down to the day. Merge the greeting
   into the day card's header and make the diary one slim line (his 9 August
   order put the diary first).
3. Use my time as the end of the loop: one reward card, dimmed until the day is
   done ("finish your five to unlock 40 min"), merging the balance card.
4. Reminders asked once after the first finished day, not above the jobs (his
   earlier choice put them above).
5. Parent link on the home: one line under the day, "⏳ 2 waiting for Mum to
   say yes", and a "Since you last looked" card for a yes that landed overnight
   (pushes to children are held 19:00 to 07:00, so evening approvals are never
   seen today).
6. Parent side: a "Teo read it ✓" on Remind, finished days and passed lessons
   in the bell with a "Send a well done" button, screen time asks in the bell.
