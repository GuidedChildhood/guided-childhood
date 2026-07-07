# Week plan — Monday 7 July 2026

The platform is feature complete enough to be red penned as a whole.
This week turns yesterday's sprint into a stable, honest, testable
product and starts the lessons engine properly.

## Today, Monday

**Justin, in this order:**
1. Merge PR 94 (path strip truth, desktop Help now, kid screen fixes,
   Game Pack). Run the SQL block from the PR 93 body if not already run:
   scripts depth columns (032), star_goals.daily_stars (033), plus 030
   children.phone and 031 push_subscriptions.child_id from PR 92.
2. GoDaddy: add the MX record for in.guidedchildhood.com so the school
   letterbox can be tested live today.
3. Red pen the whole platform, phone AND laptop. Checklist below.

**Claude, this session (platform lane):**
- Fix red pen findings as they arrive, small PRs, same day merges.
- Task 11: dashboard home reorder, problem first cards.
- If the day allows: per child switcher on Progress.

**Lessons engine (school lane, separate session):** adopt the 7 type
slide grammar from lesson 3.5, DB schema, convert the flagship. Needs
its own decisions.md entry per the lesson session protocol. Not claimed
by this session.

## Red pen checklist for today

- Home: path strip says the right count, Go button obvious, quest board
  prominent, setup path one step at a time.
- Daily: cards sound human, check in reachable after the deck is done.
- Any script: six steps appear (DiGi writes the deeper half on first
  view), the note for the child reads warm, Text it opens Messages.
- Quests: day goal set and visible both sides, ping lands on the kid
  phone, editable quests, minutes shown everywhere.
- Game Pack: print one sheet per age band ON PAPER, judge like a parent.
- Alma's phone: coming up list, ask for more quests, Add to Home Screen
  walkthrough, reminders on, test ping from the manager.
- Laptop: Help now pill bottom right, sheet opens, print works.
- School email: forward one real school email to the letterbox address
  once the MX record is live.

## Rest of the week

- Tuesday: pathway page as journey map with You Are Here (task 12),
  per child Progress switcher if not done Monday.
- Wednesday: free to paid gating decided with Justin (plan section 13
  is the banked proposal), then applied in code. Feature adoption
  emails into the cron.
- Thursday: homepage rewrite, route first like Bark, coaching promise
  hero, age buttons, truth sweep on every number and testimonial.
- Friday: layout and console check on mobile and desktop, deploy,
  decisions.md tidy.

## Standing rules that bit us yesterday

- Local clone can roll back between messages: always fetch and rebase
  onto origin before pushing, never assume local history is the truth.
- Every merged PR ends the branch chapter: new work means checking
  whether a fresh PR is needed.

## Banked from Justin, 7 July afternoon

- Marketing site AND onboarding: service tiles that flip over on tap.
  Front: the service name and icon. Back: what it achieves, where it
  lives on the phone and in the platform. One tile per service including
  a school messages tile and a lessons tile. Marketing session owns the
  marketing site version; platform lane owns the onboarding version.
- Agreement wizard shipped (type chooser with age recommendation, tap
  the clauses, options per clause, sign, saved view, Friday check that
  pays stars). Migration 034 required.

## Banked: together games on the kid link (Justin, 7 July)

In app family games hosted on the platform (they are just pages, no
external hosting needed), each one a together game played on one phone
passed around, never solo screen time, so the play pays best philosophy
holds: the screen is the board, the family is the game.

- v1 pair: Snap or memory pairs for the younger ones, and a Qwirkle
  style tile matching game for 8 plus.
- Finishing a game creates a pending quest (Played Snap together ⭐2)
  through the same lesson-complete pattern: parent approves, stars land.
- Games tab joins My quests and My lessons on the kid link.
- Build after the launch blockers (gating, homepage, Stripe test).

## Banked: evidence and literacy framing in emails (Justin, 7 July)

The day 3 tour email closes with one honest line ("built on the actual
research, not opinion") but does not cite specifics yet. Justin asked
to mix in real evidence on education, literacy and child protection
later, not now. When the market evidence work resumes, weave one or
two verified stats per relevant service (scripts, school catcher,
lessons) into the tour email and the day 7 founder email, sourced only
from plans/market-evidence-2026-07.md, never invented numbers.
