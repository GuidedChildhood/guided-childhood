# 04 · We wrote down the price

| | |
|---|---|
| Run | Parents, 2 of 13 |
| Service | The star quest: jobs, stars, minutes, and the holiday bank (map entries 2 and 15) |
| Format | Reel, about 30 seconds. Not built |
| Channels | Guided Childhood Instagram and Facebook Reels, TikTok cut |
| Proposed | Sunday 22 November, 19:30 |
| Free step | The stage check |

## Hook

> We stopped negotiating about screen time. We wrote down the price instead.

## Script, shot by shot

| Beat | On screen | Real screen |
|---|---|---|
| Open | A THING PARENTS SAY. "Can I have ten more minutes?" Forty times a day. | None |
| 1 | You set the jobs. | The parent's quests page, "The deal: quests earn stars", Add a job |
| 2 | They tick them off. | The child's jobs: "Feed the dog before school, worth 3 stars", "One hour of outside play, worth 5 stars" |
| 3 | Stars turn into minutes. | The ask box: "That is 6 stars" for 30 minutes |
| 4 | Outside pays the most. | The same list, the 5 star job highlighted |
| 5 | Some time cannot be bought. | The time tiers screen: bedtime, mealtimes, school hours |
| End | INSIDE GUIDED CHILDHOOD, 2 OF 13. What stage is your child? Three questions, no sign up. `guidedchildhood.com/v/tour-04` | End card |

Never shown: any job that pays stars for reading. Stars are for jobs.

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
