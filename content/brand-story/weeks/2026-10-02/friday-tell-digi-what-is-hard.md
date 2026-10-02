# Service Friday · Tell DiGi what is hard

**Status: HOLD.** Not postable until PR 1186 is merged and migration 359 is
applied, and then not until Justin has used it on his own account once.
Proposed as service map entry 23. This is THE-STORY.md section 10 in one post:
you tell it what actually went wrong, it gives you the one thing to do and the
words, and it keeps track.

---

## Instagram

> The bedtime fight. The phone at breakfast. The way they go quiet after a
> match.
>
> Three worries, and nobody keeping track of any of them except you, at
> eleven at night.
>
> So we built somewhere to put them.
>
> 1. Tell DiGi what is hard right now, typed or out loud.
> 2. Each worry goes on your daily check in and stays there until you say it is sorted.
> 3. DiGi gives you one thing to try for it. One, not a list of ten.
> 4. A few days later it asks how that went, right there on the check in.
> 5. Want a nudge? Say "remind me at six" and the reminder arrives at six.
>
> Every answer goes back into what DiGi knows about your family, so the next
> idea is a new one, not the same one again.
>
> Written down, a worry stops being the thing you lie awake remembering.
>
> If you could hand one worry to someone to keep track of, which would it be?
>
> What stage is your child? Three questions, no sign up, link in bio.

## Facebook

> The bedtime fight. The phone at breakfast. The way they go quiet after a
> match.
>
> Three worries, and nobody keeping track of any of them except you, at
> eleven at night, when you are too tired to remember which one you tried
> what for.
>
> So we built somewhere to put them, inside DiGi, the guide in Guided
> Childhood.
>
> 1. Tell DiGi what is hard right now, typed or out loud.
> 2. Each worry goes on your daily check in and stays there until you say it is sorted.
> 3. DiGi gives you one thing to try for it. One, not a list of ten.
> 4. A few days later it asks how that went, right there on the check in, so you are not the one who has to remember to report back.
> 5. Want a nudge? Say "remind me at six to start the wind down" and the reminder arrives at six. You can cancel it with one tap.
>
> Every answer goes back into what DiGi knows about your family, so the next
> idea is a new one, not the same one again. It never tells you to allow
> something or ban it. It tells you where you are, the next step, and the
> words.
>
> Written down, a worry stops being the thing you lie awake remembering.
>
> If you could hand one worry to someone to keep track of, which would it be?
>
> What stage is your child? Three questions, no sign up:
> https://guidedchildhood.com/starter-pack

---

## Screen recording shot list (default format)

Real screen, real account, any child's name blurred.

1. The empty DiGi chat. Thumb taps "Tell DiGi what is hard right now". (2s)
2. Typing or speaking: "Bedtime is a fight every night and she will not put
   the tablet down." (4s)
3. DiGi's answer arrives, with the one thing to try. (4s)
4. Cut to Home: the daily check in, the new worry sitting in the list. (3s)
5. A reminder set in the chat, the strip above the box showing the time, and
   the × to cancel it. (3s)
6. End card: "What stage is your child? Three questions, no sign up." (3s)

Text on screen: beat 1 "Tell it what is hard", beat 4 "It stays here until
it is sorted", beat 5 "Reminders at the time you choose".

Facebook: one tall image of beat 4, the check in with the worry on it.

---

## Proof path

- The opener: `startWorries` in
  `app/(dashboard)/dashboard/digi/DigiChat.tsx` (PR 1186).
- Onto the daily check in until sorted: `save_memory` kind concern calls
  `raiseConcern` (`lib/concerns/raise.ts`), in `lib/digi/tools.ts`.
- One thing to try, checked back on the check in: `schedule_followup` with
  `worry`, asked on the check in by `lib/checkin/today.ts` (21 September
  2026 change recorded in `app/api/cron/followups/route.ts`).
- The next idea is a new one: the worry strand, `approach` on
  `digi_followups` (migration 307).
- Reminders at a set time: `set_reminder` in `lib/digi/tools.ts`, table
  `digi_reminders` (migration 359), sent by `/api/cron/digi-reminders`,
  cancelled from the strip in the chat.
- Never allow or deny: non negotiable 1, `digi/00-how-digi-works.md`.
