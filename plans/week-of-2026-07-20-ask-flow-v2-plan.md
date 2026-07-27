# Week of 20 July 2026 — Ask flow v2 (completes the merged PR 408)

The child's device time becomes ask first for everyone. The button is a plain
ask, the picker always comes first, the grown up answers yes or not yet, and
the child taps one big Start when the yes lands. PR 408 merged the one Today
list groundwork and the ask first plan; this branch builds everything that
plan promised and the newer additions on top of it.

## The pieces

1. Child button and picker (DeviceTimeCard)
   - Main action reads "Use device time now". Tapping always opens the device
     picker first: TV, Stay on this phone, Tablet, Console (the same DEVICES,
     phone relabelled for the child), then minutes, then the ask is sent.
   - When trust is ask the deal is plain: "This asks your grown up. They get a
     ping, and when they say yes your timer starts."
   - An ask may go past the day's healthy amount (the grown up decides): one
     gentle line plus the offline ideas pills. Watch and trusted keep the hard
     cap at the guide.

2. Child top status banner (KidAskBanner), under the greeting, on the poll
   - pending: "Asked your grown up for m min on the device. Waiting for their
     yes ⏳"
   - granted: "Your grown up said yes! Tap to start your timer" with one big
     butter Start button that starts the countdown both sides.
   - declined: "Not right now. Your stars are safe." Warm, dismissable.
   - chores blocking: "Do job first, then ask again. Your grown up gets a
     ping when it is done."
   - in app nudges from the parent's Remind button land here too.
   - New GET /api/quests/time/status (kid token) feeds the existing 12s poll.

3. Default trust becomes ask
   - Migration 081: children.device_trust default becomes 'ask', existing
     'watch' rows (the untouched default) flip to 'ask'; a parent who wants
     watch taps once in "Who starts the timer?". device_requests gains a
     'started' status. New kid_nudges table (user_id, child_id, quest_id,
     message, seen, created_at, owner RLS, idempotent).
   - Code reads that fell back to 'watch' fall back to 'ask' (not the DiGi
     route, which is out of scope).

4. Parent side
   - Trust control retitled "Who starts the timer?", one plain line per
     option, easy to find.
   - Pending ask shows device and minutes with "Yes, start it" and "Not yet",
     in BOTH the card approve box and the redesigned Screen time is locked
     banner. Yes marks the ask approved and pings the child, whose Start
     button begins the countdown.
   - Locked banner: pending ask first, blocking jobs grouped by title with a
     red count chip for repeats, each row a butter "Remind Name" mini button
     that pushes if subscribed and always writes a kid_nudges row.

5. Contract wording follows trust: contractRule(level, trust); 11 plus with
   ask reads "I ask first with one tap, then my timer starts".

6. QR share: the Share app tile becomes "Share to Name", the share flow leads
   with the QR as hero, copy link quieter below.

7. Colour: espresso buttons on the quests page (Set a new goal, share tab
   send buttons, active picker pills) become standard butter.

8. One list verify: KidTodayList is the only to do surface on the kid screen.

Fixture page app/ref-ask-first for screenshots. No migrations applied to
Supabase. app/api/digi/route.ts and the device-time cron untouched.
