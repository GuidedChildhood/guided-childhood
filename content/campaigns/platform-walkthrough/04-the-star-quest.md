# 04 · We wrote down the price

| | |
|---|---|
| Run | Parents, 2 of 13 |
| Service | The star quest: jobs, stars, minutes, and the holiday bank (map entries 2 and 15) |
| Format | Reel, 33 seconds, 1080 by 1920. **Built** |
| Channels | Guided Childhood Instagram and Facebook Reels, TikTok cut |
| Proposed | Sunday 22 November, 19:30 |
| Free step | The stage check |
| Files | `built/04-the-star-quest/we-wrote-down-the-price.mp4`, cut at `videos/2026-10-09-digi-shorts/cuts/walkthrough-04.json` |

## Hook

> We stopped negotiating about screen time. We wrote down the price instead.

## Script, shot by shot

| Time | On screen | Real screen |
|---|---|---|
| 0.0 | A THING CHILDREN SAY. "Can I have ten more minutes?" Then: INSIDE GUIDED CHILDHOOD, 2 OF 13 | None |
| 3.4 | We wrote down the price. Jobs. Stars. Minutes. | None |
| 6.0 | FAMILY QUESTS. 1. You set the jobs | The parent's board: "On Ava's board", with a family job that pays no stars and "Homework done before the phone comes out" |
| 10.6 | THEIR APP. 2. They tick them off | The child's jobs: "Feed the dog before school, worth 3 stars" |
| 15.2 | ASK FIRST. 3. Stars turn into minutes | The ask box: "That is 6 stars on the Console." |
| 19.6 | ON PURPOSE. 4. Outside pays the most | "One hour of outside play, worth 5 stars" |
| 23.8 | BEDTIME, MEALS, SCHOOL. 5. Some time is not for sale. It still comes to you as an ask | The ask inside a rest window: "Screens are meant to be resting right now. Saying yes still works." |
| 28.4 | One plan for screens, phones and AI. What stage is your child? Three questions, no sign up. `guidedchildhood.com/v/tour-04` | End card |

Never shown: any job that pays stars for reading. The child's jobs screen is cropped above "If you fancy more".

## Caption, Instagram

Send this to the parent who negotiates screen time forty times a day.

1. You set real jobs. Feed the dog. Shoes by the door.
2. Each job is worth stars, and you decide how many.
3. Stars become minutes. One star is five minutes unless you change it.
4. An hour outside pays more than anything else on the board.
5. Bedtime, mealtimes and school hours are not for sale at any price.

Once the price is written down, there is nothing left to argue about.

Extra they earn in term can be saved for the school holidays too.

2 of 13. What stage is your child? Three questions, no sign up. The link is
in our bio.

What would be the first job on your board?

## Caption, Facebook

We used to negotiate screen time all day long. Ten more minutes, one more
episode, but you said.

What ended it was writing the price down.

You set real jobs and say what each one is worth in stars. Feed the dog
before school is three. An hour of outside play is five, because the board
pays the most for the things that get them off the screen. Stars become
minutes, five minutes a star unless you change it for your child.

Some time is theirs anyway, and some cannot be bought at all: bedtime,
mealtimes, school hours. Anything extra they earn in term can be saved for
the holidays.

The deal does the arguing, so we do not have to.

2 of 13 in our walk through everything we built. What stage is your child?
Three questions, no sign up: guidedchildhood.com/v/tour-04-fb

What would be the first job on your board?

## Visual brief

- Same film frame as post 1. Bloop may stand beside the end card, since jobs and routines are his stage.
- Film from `app/ref-job-board`, `app/ref-kid-jobs`, `app/ref-ask-first` and `app/ref-time-tiers`. Stills of three of these already exist in `videos/2026-10-09-digi-shorts/assets/captures/`.
- Crop the child's jobs screen above the "If you fancy more" block.

## Proof

- Jobs, stars and minutes: `/dashboard/quests`, `lib/quests/templates.ts` (`STAR_MINUTES`, default 5, per child rate from migration 225).
- The timer page's own line: "One star is worth five minutes of screen time."
- Three kinds of time: THE-STORY section 3, commitment 4; the time tiers screen.
- The holiday bank: `lib/quests/holiday-bank.ts`, "{n} min saved for the school holidays".

## Checks

- No claim that a child will behave differently. The claim is that the argument has somewhere else to go.
- Family jobs sit outside the stars. If a beat shows one, it is labelled as unpaid.
- The hook is the service map's own, in the family "we". It is a family screen argument, which the founder context marks amber, so it is flagged here for Justin's yes.
- Built 10 November from the reference pages `ref-job-board`, `ref-kid-jobs`, `ref-ask-first` and `ref-ask-popup`. The time tiers screen was blank in the old capture, so the rest window ask stands in for it.
