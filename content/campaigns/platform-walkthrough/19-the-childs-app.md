# 19 · Their side of it

| | |
|---|---|
| Run | Parents, 12 of 13 |
| Service | The child's app, the games, and AI (map entries 11 and 16) |
| Format | Reel, about 30 seconds. Not built |
| Channels | Guided Childhood Instagram and Facebook Reels, TikTok cut |
| Proposed | Friday 18 December, 19:00, the last day of term |
| Free step | The stage check |

## Hook

> Every screen time app is built for the parent. So the child pushes back.

## Script, shot by shot

| Beat | On screen | Real screen |
|---|---|---|
| Open | Every screen time app is built for the parent. | None |
| 1 | So we built one for them. A link. No login. No account. | The child's home |
| 2 | Their five for today. | "Your five for today" |
| 3 | Their stars, and what they are saving for. | The balance |
| 4 | They can pitch a job. You approve it. | "Got a quest idea?", Pitch it |
| 5 | Games that teach the hard stuff. Real or Fake? Scam or Safe? | The games |
| 6 | And no chatbot. Your child never chats with an AI here. | The child's home again |
| End | INSIDE GUIDED CHILDHOOD, 12 OF 13. What stage is your child? Three questions, no sign up. `guidedchildhood.com/v/tour-19` | End card |

## Caption, Instagram

Send this to the parent whose child treats the rules as the enemy.

1. Your child gets their own app. A private link, no login, no account.
2. It shows their five for today, their stars and what they are saving for.
3. They can pitch a job. You say yes or not yet.
4. Games like Real or Fake? and Scam or Safe? earn stars too.
5. There is no chatbot. Your child never chats with an AI in it.

A child who helped write the deal has less reason to fight it.

12 of 13. What stage is your child? Three questions, no sign up. The link is
in our bio.

What job would your child pitch if you let them name the price?

## Caption, Facebook

Nearly every screen time tool is built for the parent. The child is the
thing being managed, so of course they push against it.

So one of the biggest things we built is not for you at all. It is your
child's own app.

It opens from a private link. There is no login and no account, and it sits
on their home screen with its own icon. Inside are their jobs for today,
their stars, what they are saving for, their lessons and the button that
asks you for screen time.

They can pitch a job of their own. You approve it or you do not. Either way
they are now proposing the deal and not just resisting it.

There are games in there that pay stars for spotting a scam, telling real
from fake and knowing what to keep private. So learning how AI fools people
buys screen time, which is the whole idea in one loop.

And one thing is not in there. Your child never chats with an AI in our
app. That is a rule the code checks every time we change it.

Younger children do not need a device at all. A paper chart does the same
job.

12 of 13. What stage is your child? Three questions, no sign up:
guidedchildhood.com/v/tour-19-fb

What job would your child pitch if you let them name the price?

## Visual brief

- Same film frame as post 1. Film from `app/ref-kid-home`, `app/ref-kid-five`, `app/ref-kid-suggest` and the games. Stills of the child's home and jobs exist already.
- The demo child is Sam, from the name swap. No real child's name, no face, no avatar that looks like a real child.
- Crop above "If you fancy more" on the jobs screen.
- Bloop or Orbit beside the end card, whichever stage the demo child is at.

## Proof

- `/k/[token]`: token link, no login, its own manifest (the home screen icon is "My Jobs"), `kid_links`.
- "Your five for today", "Pitch a job", "Got a quest idea?": `app/k/[token]`.
- Games: `lib/quest-games/registry.ts`, 32 games, including "Real or Fake?", "Scam or Safe?", "Share or Keep Private?" and "Password Power".
- The AI module for parents and by age: `/dashboard/ai-module`, "How AI really works, and how to use it wisely".
- The child never chats with a model: `scripts/check-child-has-no-model.mjs`, run in CI.
- No device needed for younger children: `children.no_phone`, the paper chart.

## Checks

- **One exception to say honestly if asked.** For ages 10 and over there is a homework hint card: one fixed card, no follow up box, nothing stored. That is not a chat, and "never chats with an AI" is the rule as Justin worded it on 16 October. The Facebook text says "chats", not "no AI anywhere".
- The service map's hook for this entry ("The app my daughter opens…") is a story about one of the children, so it is not used. Its AI hook names the youngest and is not used either.
- No claim about what the games do for a child. They pay stars for getting it right.
