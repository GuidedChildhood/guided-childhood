# DiGi's word: the proactive insight, twice a week

Justin, 6 September 2026: "Would it be possible for DiGi to review what is
happening on the platform and have a little alert button that says DiGi wants
to tell you something, and DiGi gives them an insight that really hooks and
tells them what to do next for the child at that particular age, taking into
account the information they have received, DiGi chats across parents,
searching what is actually best at that moment regarding social media, AI and
children's mental health. Proactive, once or twice a week, with a real piece
of insight."

## What already exists

The prompts route writes light tips every few days from a handful of
triggers (a mood dip, a streak, a stage arrival) into digi_prompts, and Home
shows them through the DiGi flash up gate at most twice a week. The follow
up cron drops "How did that go?" cards into the same table. Push works
(lib/push/send.ts). The research bank (expert_knowledge) is refreshed twice
a month, the cross family wisdom rebuilt weekly with a review gate, and the
family's own memory, concerns, scripts, questions, jobs and check in shifts
are all in tables. Nothing yet reads all of that at once and says one thing.

## The build

- Migration 256: digi_prompts gains kind 'insight', plus source, cta,
  reaction (helped or not) and seen_at.
- lib/digi/word.ts: buildWordFor(userId). Picks the child with the most
  signal (open concerns, questions, scripts; ties go to the primary child),
  gathers the family's last fortnight (concerns and their latest scores, the
  check in shifts, scripts used and whether they worked, DiGi questions, the
  memory, jobs approved, minutes spent, tonight confirmations, moments), the
  freshest research rows for the child's age band, the proven solutions for
  that band, and the last three insights with their reactions (never repeat,
  lean toward what helped). One deep model call returns JSON: hook, insight,
  do_next, source, href, cta. The href is checked against a whitelist built
  from the real scripts and lessons for the stage plus the fixed routes; the
  source must be a name from the bank handed in. Stored as one digi_prompts
  row, kind 'insight'. A push goes out: "DiGi wants to tell you something".
- /api/cron/digi-word, Tuesday and Friday 06:00 UTC (07:00 UK), for every
  family active in the last 21 days without an unread insight. Capped and
  best effort per family.
- /api/digi/word: GET the recent insights; POST seen, acted, dismissed, and
  a reaction that also lands in digi_feedback so the wisdom rebuild reads it.
- Home: a "DiGi wants to tell you something" alert right under the now slot
  when an insight is unread, the hook on it, one tap to /dashboard/word.
- The DiGi tab wears a butter badge while an insight is unread (red stays
  reserved for a person waiting).
- /dashboard/word: the insight in full in the answer layout (numbered
  points, the source in mono), the do next button in butter, Helped and Not
  really underneath, older insights beneath.
- The prompts route stops listing kind 'insight' so it never shows twice.
- Fixture at /dev/digi-word for the alert and the page.

## Checks

tsc, wiring, checkin guard, no dashes, fixtures at 390 and 1440. Migration
256 goes to production on Justin's word. The first live run is the Tuesday
after merge; the cron can be fired by hand before that to see a real one.
