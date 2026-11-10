# 01 · The plan, in thirty seconds

| | |
|---|---|
| Run | Parents, 1 of 13 |
| Service | The pitch: the loop, with the star quest leading |
| Format | Reel, 29 seconds, 1080 by 1920. **Built** |
| Channels | Guided Childhood Instagram and Facebook Reels. TikTok takes the same cut |
| Proposed | Tuesday 17 November, 19:30 |
| Free step | The stage check |
| Files | `built/01-the-plan-in-thirty-seconds.mp4`, cut at `videos/2026-10-09-digi-shorts/cuts/walkthrough-01.json` |

## Hook

On screen, from frame one, under the eyebrow A THING PARENTS SAY:

> "It's utterly miserable constantly policing screen time."

A parent wrote that on Mumsnet, word for word
(`research/homepage-audience-language.md`). It is shown as a thing parents
say, with no name on it.

## Script, shot by shot

Silent first. Every line below is on screen. There is no voice.

| Time | On screen | Real screen underneath |
|---|---|---|
| 0.0 | A THING PARENTS SAY. "It's utterly miserable constantly policing screen time." Then: INSIDE GUIDED CHILDHOOD, 1 OF 13 | None |
| 3.4 | Not a ban. A plan. | None |
| 6.0 | 1. They earn the screen time | The ask box: "Sam is asking for 30 minutes. That is 6 stars on the Console." Yes, or Not yet |
| 10.6 | 2. You tap what is hard right now | The stage check, question two: "What are you dealing with right now?" |
| 15.0 | 3. You get the words for tonight | The script deck, the Say this card |
| 20.0 | 4. And you watch it move | The check in: five faces, one tap, the line that comes back |
| 24.4 | One plan for screens, phones and AI. What stage is your child? Three questions, no sign up. See what to do tonight. `guidedchildhood.com/v/tour-01` | The end card, with the approved DiGi star |

Slate on the first and last frame: "An example family. Real app screens."

## Caption, Instagram

Send this to the parent who is tired of being the screen police.

Not a ban. A plan. Here it is in four moves.

1. They earn screen time with real jobs, so the deal does the arguing.
2. You tap what was hard today.
3. You get the words to say tonight.
4. You check in with one tap and watch it move.
5. A screen you both agreed to is a screen you do not have to police.

This is 1 of 13. We are walking through everything we built, one piece at a
time.

What stage is your child? Three questions, no sign up, about two minutes. The
link is in our bio.

What is the screen fight in your house at the moment?

#screentime #parentinguk #firstphone #guidedchildhood

## Caption, Facebook

"It's utterly miserable constantly policing screen time." A parent wrote that
on a forum, and we have not forgotten it.

So we built a plan instead of a ban, and over the next few weeks we are going
to show you all of it, one piece at a time. This is the short version.

Your child earns screen time with real jobs. You tap what was hard today. You
get the words to say tonight. Then you check in with one tap and watch it
move.

An example family in the film, real app screens.

What stage is your child? Three questions, no sign up:
guidedchildhood.com/v/tour-01-fb

What is the screen fight in your house at the moment?

## Caption, TikTok

Not a ban. A plan. Four moves, thirty seconds. 1 of 13. What stage is your
child? Three questions, no sign up: guidedchildhood.com/v/tour-01-tt

## Visual brief

- Butter ground, ink text, Nunito and IBM Plex Mono, from the film engine.
- Four numbered step cards, one per beat, so the film reads with the sound off.
- Every screen is a real capture or recording already in
  `videos/2026-10-09-digi-shorts/assets/`, with the film family's names (Ava
  and Sam).
- One gold highlight per screen, on the line being read.
- Supplied Pixabay track, low, lifting on the first step.

## Proof

- The ask box and the stars: `/dashboard/quests/timer`, `lib/quests/device-time.ts`, filmed from `app/ref-ask-first`.
- The worry tiles: `app/(marketing)/starter-pack/page.tsx`, question two, labels in `lib/pathway/challenge-labels.ts`.
- The script deck: the `scripts` table, shown by `app/ref-script-deck`.
- The check in and its faces: `components/daily/ConcernCheckIn.tsx`, `/dashboard/checkin`.
- The loop itself: THE-STORY section 10.

## Checks

- No outcome is promised for a child. "Watch it move" is the parent's own rating.
- Nothing says safe, proven or fix.
- `tour-01`, `tour-01-fb` and `tour-01-tt` must be made on Admin, Film links, before posting.
- Still to do before it is posted: the marketer review and feedback filter pass from `product-shorts`.
