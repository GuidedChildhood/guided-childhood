# 12 · It asks if it worked

| | |
|---|---|
| Run | Parents, 7 of 13 |
| Service | DiGi, and the check back (map entries 4 and 21) |
| Format | Reel, 43 seconds. **Reused:** Film 10, "DiGi learns you", built 4 November and never posted |
| Channels | Guided Childhood Instagram and Facebook Reels, TikTok cut |
| Proposed | Friday 4 December, 19:00 |
| Free step | The stage check |
| Files | `content/packs/2026-10-09-digi-shorts/films/digi-short-10-learns.mp4` and `digi-short-10-learns-tt.mp4` (post the files with no suffix) |

## Hook

> Every parenting expert gives advice. Ours asks if it worked.

That is the caption's first line. The film's own opening stays as it is: THE
PROBLEM, in a parent's words, "Screens off. Same fight, every single day.
What do I say?"

## Script

The film is finished and is not re cut. In order: the problem, then six
numbered cards saying what DiGi does, each over the real screen that proves
it.

1. Gives you the words for tonight
2. Puts the worry on a check in
3. Asks how it went
4. Remembers your family
5. Keeps what worked. Changes one thing.
6. Starts from your check in

It closes on "It asks. It checks in. It remembers. It adjusts." and the stage
check end card.

The film has no series count on it. The count goes in the caption and on the
cover frame: INSIDE GUIDED CHILDHOOD, 7 OF 13, over the cover line "It read
your check in".

## Caption, Instagram

Send this to the parent who has had plenty of advice and no one asking how
it went.

1. Ask DiGi about the thing that went wrong today.
2. It gives you the words for tonight, for your child's stage.
3. It puts that worry on a check in.
4. A few days on, it asks how it went.
5. The next answer starts from what you told it.

Advice that never hears back cannot get any better.

An example family, real app screens, example replies. Built on research.

7 of 13. What stage is your child? Three questions, no sign up. The link is
in our bio.

When did somebody last ask you whether their advice worked?

## Caption, Facebook

Every parenting book, podcast and expert gives advice and then walks away.
The book does not ask how Tuesday went.

DiGi does. That is the part of it we care about most.

You ask about the thing that went wrong today. It gives you words for
tonight that fit your child's stage, because the answer for a nine year old
is not the answer for a fourteen year old. It will not tell you to allow it
or ban it. It gives you where you are, the next step and what to say.

Then it puts the worry on a check in, and a few days later it asks how it
went. One tap. The next answer starts from what you told it.

If what you type is a crisis, it does not leave that to an AI. The crisis
numbers come up first, every time.

An example family in the film, real app screens, example replies.

7 of 13. What stage is your child? Three questions, no sign up:
guidedchildhood.com/v/digi-learns-fb

When did somebody last ask you whether their advice worked?

## Visual brief

- Nothing to make. Add the cover frame text only.
- The film's end card already carries `guidedchildhood.com/v/digi-learns`.

## Proof

- `/dashboard/digi`, `lib/digi/system.ts` (the rails, never allow or deny).
- The check back: `schedule_followup` in `lib/digi/tools.ts`, the 07:15 cron `/api/cron/followups`, the buttons "It worked", "Helped a bit", "Not really".
- Crisis routing before the model: `CRISIS_OPENER` in `lib/digi/safety.ts` (999, Samaritans, Childline).
- The thinking line on screen is the real one: "Your own family history is part of this answer."

## Checks

- The codes are the film's own, already named: `digi-learns`, `digi-learns-fb`, `digi-learns-tt`, `digi-learns-ig`. Check each exists on Admin before posting.
- The posting plan says to post Short 1 (the switch off film) first, because this film is its second week. Short 1 is not logged as posted. **For Justin:** post Short 1 before this, or accept that this one stands alone. It reads fine alone.
- The DiGi hero film goes out on 15 November and the Robux film on 12 November. This is a different film and a different point (it remembers), so it is not a repeat.
- "The only one that rings back" from the service map is left out. "Only" is a claim about everybody else.
