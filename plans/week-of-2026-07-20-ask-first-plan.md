# Week of 20 July 2026 — Ask first device time

The child's device time becomes ask first by default. The button is a clear
ask, the picker always comes first, the grown up says yes or not yet from
their card, and the healthy guide keeps steering both sides.

Builds on the age based contract branch (claude/kid-one-list, merged into
this branch) because the 11 plus contract wording now follows the actual
trust setting.

## The pieces

1. Child button and picker (DeviceTimeCard)
   - Main action reads "Use device time now". Tapping always opens the
     device picker first: TV, Stay on this phone, Tablet, Console, then
     minutes.
   - When trust is ask the flow says plainly: it asks your grown up, they
     get a ping, the timer starts when they say yes. The primary button
     asks, it never starts.
   - A waiting state after the ask, polling the new status endpoint. On
     yes the timer starts right there. On not yet the child sees "Not
     right now. Your stars are safe", never shame, with the offline ideas
     pills.
   - An ask may go past the day's healthy amount (the grown up decides):
     the picker shows one gentle line and the offline ideas alongside.
     Watch and trusted keep the hard cap at the guide.

2. Default trust becomes ask
   - Migration 081: children.device_trust default becomes 'ask', existing
     'watch' rows flip to 'ask' (watch was the untouched default; a parent
     who chose it taps once to loosen again).
   - Every code read that fell back to 'watch' falls back to 'ask'.

3. Parent card (ParentDeviceTime)
   - Trust control retitled "Who starts the timer?" with one plain line
     per option.
   - Pending ask keeps "Yes, start it", decline becomes "Not yet", and the
     decline sends the child a warm push.

4. Contract wording follows trust
   - contractRule(level, trust): 11 plus with ask reads "I ask first with
     one tap, then my timer starts". Watch and trusted keep "I start it
     myself and it winds up at the healthy amount".

5. New endpoint: GET /api/quests/time/status (kid token auth) returning
   the live session and any pending ask, so the child screen picks up the
   yes without a reload.

6. Fixture ref page app/ref-ask-first for screenshots of the picker, the
   waiting state and the parent yes or not yet box.

Verify: tsc clean, screenshots from the ref page, cron end and guide
alerts confirmed as shipped (verification only, no cron changes).
