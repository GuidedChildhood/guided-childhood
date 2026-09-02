# Device time: easy to ask, one tap to agree, stars come off on the yes

Justin, 2 September 2026, with the child's balance card: "tidy up and make
user friendly device: easy to select device type and minutes, can still
request if no time, pops up on parent app so they can agree it, deducts from
star account, so can add task to balance. Make sure all easy to use and
wired in."

## What is there (traced 2 September)

- The card is the My balance card above the Quests tab; "Use device time
  now" opens a picker in place: five device kinds (or the family's own
  screens), a minus and plus stepper in star blocks, then Ask or Start.
- At 0 minutes the ask is BLOCKED twice: the card refuses to open the picker
  and the start route answers "not enough stars" before it ever reaches the
  ask branch. A child with no stars cannot put the question, which
  contradicts never allow or deny.
- The parent's yes writes a status only. The stars come off when the child
  taps Start, a separate later tap against a bank that may have changed.
- The parent learns of an ask by web push, or by a row that appears on a
  polled card. Nothing pops up inside the app.
- The minutes ready headline uses the deployment star rate, not the child's.

## The build

Child side (`components/quests/DeviceTimeCard.tsx`, `KidQuestScreen`):
- The card wears the happy news finish: ink edges, hard ledges, butter for
  the thing to tap. Device tiles two across, the chosen one butter. Minute
  chips (10, 15, 20, 30, 45, 60 at the child's star rate) above the big
  number, the stepper kept for fine tuning.
- The ask is always allowed. At 0 minutes the button reads "Ask for screen
  time" and opens the picker; the cost line says how many stars short and
  that the grown up can still say yes. A short pick shows the earn more
  path: the jobs still to do today and the minutes they would bring, one tap
  to the jobs list.
- After a yes the child's screen refreshes its bank, so the stars they see
  are the stars they have.

Server:
- `app/api/quests/time/start`: the "not enough stars" refusal moves below
  the ask branch, and a start that cannot be paid for becomes an ask instead
  of a refusal, for every trust level. A start from an ask the parent already
  charged reuses that charge rather than spending twice.
- `app/api/quests/time/request` (the yes): charges the bank on approval,
  core minutes first, then stars, then holiday minutes, exactly as a start
  would. When the bank cannot cover the whole ask the yes covers the rest,
  named as the grown up's treat, never a refusal. The child's push says the
  stars have gone and to tap Start when they are at the screen.

Parent side:
- `components/quests/AskPopup.tsx`: a bottom sheet that pops up anywhere in
  the dashboard when a child's ask is waiting, polled every twenty seconds
  while the app is open. Who, how long, on what, what it costs and what they
  have. Yes ⭐ and Not now, in the bold finish. Dismissed once, it stays down
  for that ask.
- The pending ask box on the timer and quests pages says the same: the yes
  takes the stars now.

## Checks

- `/dev/device-time` fixture: idle with stars, idle at 0, picking, short.
- The parent pop up on a fixture route.
- tsc, wiring, dash grep, checkin guard.
