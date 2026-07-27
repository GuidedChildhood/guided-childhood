# No phone setting and firmer timer alarm

Two small, connected improvements to the parent managed experience. The system
already infers a no phone child from age plus no kid link, and already alarms a
timer with a rising tone and a push. This makes both explicit and reliable.

## 1. An explicit "no phone" per child setting

Today the app guesses: a child in the 4 to 7 band, or an 8 plus child with no
kid link, is treated as parent managed and nudged to share the QR. A family who
will never give a phone still gets the nudge.

- Migration 105: `children.no_phone boolean default false`, mirroring the
  existing `device_trust` per child column.
- A parent scoped update route, mirroring `quests/time/trust`.
- In the Quests handover prompt, a quiet "they have no phone" action that sets
  it and dismisses the nudge for good. A no_phone child is excluded from the
  handover prompt, so the app stops asking and leans fully into the fridge and
  parent managed flow that already works (parent ticks jobs, parent starts the
  timer, stars still land).

## 2. Firmer timer alarm

The end of timer alarm is a rising tone plus a push. The tone is best effort
(browsers need the page open and tapped), so the push is the reliable channel.
If a parent has not turned notifications on, the alarm can be missed.

- On the screen time card, when notifications are not granted, show a clear
  turn on the alarm prompt, reusing the existing PushPrompt so the reliable
  channel gets set up right where the timer lives.

## Not in scope now

- The bulk log a week fridge total (separate, small, later).
- A guaranteed audible alarm with no push (would need a native wrapper).
