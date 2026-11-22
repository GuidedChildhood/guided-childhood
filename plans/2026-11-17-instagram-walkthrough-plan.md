# Instagram walkthrough, every service: the review and the new posts

17 November 2026, marketing lane. PR 1611 merged with only the claim; the work is in the follow up PR. Justin: "review all things we are
adding to do instagram high quality walkthrough of every service to advertise".
**Drafts only. Nothing posted or scheduled.**

## What already existed

The 20 post walkthrough (PR 1475, `plans/week-of-2026-11-09-walkthrough-campaign-plan.md`)
was built on 10 November and starts tonight, Tuesday 17 November 19:30. It
already gives every service in `content/brand-story/service-post-map.md` a
post. So this pass did not rebuild it. It did three things:

1. Checked the 20 against what changed in the app since 10 November.
2. Walked every service at 390 wide and logged what is broken or unclear.
3. Built posts for what the 20 do not cover: the services added since.

## 1. Inventory: every service, its post, and whether it is live

| Service | Live on main? | Post |
|---|---|---|
| The stage check and pathway | Merged. New worry question 16 Nov (1574, 1577), one tap open 14 Nov (1541) | Run post 1; **new post 2** |
| DiGi | Merged | Run post 12 (Film 10) |
| Daily check in | Merged | Run post 14 |
| Five a day and quests | Merged; Quests page is the day 15 Nov | Run posts 4, 19 |
| Stars and the screen timer | Merged | Run posts 4, 7 |
| Planet Friends and the sticker book | Merged | Run post 19 |
| Passport | Merged (1603); stickers and Stage done in 1608, **open** | Run post 18 (needs fixes, below) |
| Fridge star chart | Merged 17 Nov, PR 1600 | Run post 17 card 3: re-capture now |
| Our school week sheet and family week pack | Merged 17 Nov, PR 1607 | 1607 carries its own carousel; post it as is |
| School calendar: snap, forward, reminders | Merged 17 Nov, PR 1610 (Add from school first, Forward an email button); cards captured after it | Run post 16; **new post 1** |
| Watch it together | Merged 17 Nov (1589, 1598, migration 400) | **New post 3** |
| Lessons | Merged | Run post 18 |
| Scripts | Merged; page rebuilt as three shelves 17 Nov | Run post 9 (re-capture card 2) |
| Printables | Merged; every taster on /free 16 Nov | Run post 17 |
| The Guided Planet newspaper | Merged | Its own channel (`publishing/README.md` prepares its social posts per edition). Not in this run |
| Schools | Live on its own site | Run posts 2, 6, 11, 15 |

## 2. The walk at 390 wide

33 fixture and reference pages, one per screen of each service, every visible
button tapped (`walk.mjs` in the session scratchpad). Every page loaded, none
scrolls sideways, no page errors. The 401 and 500 console lines are fixture
pages calling the API with no session, which is expected.

**Fixed here**
- Two stage check tiles promised "safe" ("Safe friends lists", "Safe, smart use"), an outcome for a child that no filmed screen may show. Now "Friends lists you set up together" and "Clear rules for AI, by age" (`lib/onboarding/worries.ts`). Each line is still the short form of its answer.

**Listed, not fixed**
- The school reminders week grid is cramped at 390 inside Home's fold: the item column is about 120px, so the tick and cross drop under the name and "they get it too" breaks inside its pill. Keeping the chip on one line made it spill past its card, so that was reverted. The real fix is a wider column (drop one of the nested frames at phone width). Platform lane.
- The stage check intro still says "step by step to a safe, capable 16" (`/starter-pack`). Same outcome word. Justin's call, since it is the landing line.
- The passport book and the child's planet fixtures carry Teo's name; the capture tools swap it before any pixel, so it never reaches a post. Recorded so nobody captures them by hand.

## 3. What changed under the 20 (the stale check)

| Post | Date | Problem | Fix |
|---|---|---|---|
| **1** | **Tonight** | Showed the old worry question and three retired tiles from 10.8s to 15.6s | **Done.** The current screen laid over those seconds, crossfades rebuilt, sound untouched. Post the unnumbered file; the old one is `-v1` |
| 4 | Sun 22 Nov | Says outside play "pays the most"; it now pays the same, with praise (15 Nov) | s4 to "Outside comes first", crop the star count; caption "Outside play leads the list". Needs the Mac render |
| 10 | Tue 1 Dec | "Four days of everything" | Use the live line: DiGi a few times a day and the starter scripts |
| 18 | Tue 15 Dec | Card 3 says stamps fill from jobs and check ins; they come from lessons, scripts and the big check. Card 5 shows the old passport | Card 3: "from lessons, the talks you have, and their big check". Re-capture card 5 after 1608 |
| 9, 17 | 29 Nov, 13 Dec | Scripts page and star chart sheet both redesigned 17 Nov | Re-capture both (1600 is merged) |
| 7 | 27 Nov | Timer clips may say "healthy amount"; the app now says "today's guide" | Watch both clips |
| 5 | 24 Nov | Card 5 shows "with safe settings" | Crop that line, or Justin's yes |

## 4. The new posts: "New in Guided Childhood", 1 of 3 to 3 of 3

Its own short run, so the run of 13 on screen stays true. Real screens only,
captured from the fixture pages with the film family's names
(`content/campaigns/new-in-the-app/screens/capture.mjs`). Carousels through
`tools/social-cards`, last card save and send, the stage check in the caption.
Mobbin (Partiful calendar sync, Quizlet and Dropbox scan flows): one action per
card, then the result on the next card, which is the order every deck follows.

| # | Service | Parent problem hook | Format | Screens | Proof path |
|---|---|---|---|---|---|
| 1 | School calendar: snap the letter, forward the email | "The letter said Wednesday. I found it on Thursday." | Carousel, 7 | snap card, Letterbox, week grid, child's week | `components/school/SchoolCatch.tsx`, `/dev/school-letterbox`, `SchoolWeek.tsx`, `app/k/[token]` |
| 2 | The stage check's twelve | "The twelve things parents ask us for help with." | Carousel, 7 | the q2 grid in four crops | `starter-pack/page.tsx`, `lib/onboarding/worries.ts`, `plans/2026-11-16-worry-question-top-12.md` |
| 3 | Watch it together | "We kept saying we would watch it together." | Carousel, 7 | book, booked, home card, child's film time | `WatchBookingPanel.tsx`, migration 400, PRs 1589, 1598 |

Each draft carries captions for Instagram and Facebook (one card, link in the
text), alt text and a proof path for every claim. Children are never named;
the screens say Ava, the film family's invented child.

Why these three are the strongest: each answers a problem parents raise
unprompted (school admin, the worry list, "later"), each is new since the run
was planned, and post 2 is the stage check itself.

## 5. Posting order (proposed, Justin decides)

The family account rhythm is full in the evenings, so the new run takes the
free **Sunday mornings at 10:00** on the family account:

1. **Tonight, 19:30**: run post 1, the re-laid film.
2. **Saturday 21 Nov**: the family week pack carousel from PR 1607 (merged) as Free Saturday.
3. **Sunday 22 Nov, 10:00**: new 2, the twelve. No dependency; everything is live.
4. **Sunday 29 Nov, 10:00**: new 1, the school letter (PR 1610 is merged, so nothing waits).
5. **Sunday 6 Dec, 10:00**: new 3, watch it together.

This adds one ask a week for three weeks on top of the run's three. Links to
make first on Admin, Film links: `new-01`, `new-01-fb`, `new-02`, `new-02-fb`,
`new-03`, `new-03-fb`.

## Checks

- `node scripts/check-ai-tells.mjs` on all new copy and the post 1 draft: pass.
- Every card read at full size; one overflowing card re-cropped.
- Post 1 checked frame by frame across the re-laid seconds.
- Not done: the marketer review that `product-shorts` asks for. Run it on Justin's word.
