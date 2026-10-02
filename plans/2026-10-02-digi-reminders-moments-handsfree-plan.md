# DiGi reminders, moments, worries and hands free (2 October 2026)

Justin, 2 October 2026, after DiGi voice went live: could DiGi log a reminder,
add it as a moment when that fits, be triggered by voice, speak, and answer
questions about what the platform knows, with a switch to turn it on or off.

He chose: reminders at a set time, log it as a moment, the hands free switch,
and "adds a new moment picked up in conversation so we could ask the user to
tell DiGi their issues, it will add to the tracker each day until resolved and
assist on methods to resolve".

He did not pick a "Hey Siri" shortcut. A true "Hey DiGi" wake word would mean
a microphone open all day, which a web app cannot do and which we would not
want for a parenting product. The hands free switch is the honest version.

## 1. Reminders at a set time (migration 359)

- New table `digi_reminders`: one row per reminder, the parent's own words,
  `remind_at` (a real time, not a day), `repeat_days` (0 to 14, for "every
  evening this week"), status pending, sent, missed or cancelled. RLS: a
  parent sees and cancels only their own.
- New DiGi tool `set_reminder`: time as HH:MM UK clock plus days from today.
  A time already gone today rolls to tomorrow and DiGi says so. Cap of five
  waiting per family.
- New cron `/api/cron/digi-reminders` every five minutes. Sends a push to the
  parent's devices. No push device means a card on Home instead, so a parent
  without notifications still sees it. More than an hour late (a missed run)
  is marked missed, never sent: "start the wind down" arriving at nine is
  worse than nothing.
- Upcoming reminders show as a small strip in the DiGi chat, each with a
  cancel. Every write small, visible and reversible (the second rail).

## 2. Log it as a moment (no migration)

- New DiGi tool `log_moment`: when a parent says a moment actually happened
  (the morning TV standoff went fine, the switch off was a fight), DiGi files
  it against the closest moment card in the library and ticks today's Moment
  step, exactly as opening the card would.
- The model names the card. A name that is not a real title for the child's
  age gets the list back, so it picks a real one or none. Never a guess.

## 3. Worries tracked until sorted (no migration)

Most of this exists: `save_memory` kind concern with a slug and label puts the
worry on the daily check in, scored every day until the parent marks it
sorted, and `schedule_followup` with `worry` attaches the method tried to it.
What fails today:

- The model saves the worry and schedules the follow up in the same turn, the
  tools run in parallel, so the follow up cannot find a worry that does not
  exist yet. Fix: save_memory runs first, and schedule_followup looks the
  label up in the family's concerns when it is not in the list it was shown.
- The rules now say it plainly: when a parent tells you what is hard, put each
  worry on the tracker, tell them it will be on their check in each day until
  sorted, and give one method to try with a follow up attached.
- An opener chip in the chat: "Tell DiGi what is hard right now".

## 4. Hands free (no migration)

- A switch in the DiGi chat, parents only, off by default, remembered on that
  phone. On: the microphone opens, a question sends itself after a short
  pause, DiGi reads the answer aloud, and the microphone reopens when it
  finishes. A clear "Hands free, listening" sign the whole time.
- Turns itself off after two quiet minutes, when the page is hidden, or on
  any tap of the switch. Never on when the page opens.
- Extends `scripts/check-digi-voice.mjs` with these rules.

## 5. Questions about what the platform holds

DiGi already reads the family state and the history tool. The history tool
now also returns the moments logged lately and the reminders waiting, so
"what reminders have I got" and "what moments have we done" have an answer.

## Gates

- [ ] Migration 359 written; applied only on Justin's yes
- [ ] tsc, check-digi-voice (shown to fire), ai-tells on new copy
- [ ] Phone 390 and desktop screenshots: reminders strip, hands free on
- [ ] review.md pass, context-guard
- [ ] PR, CI green
