# Mumsnet replies to the ten parents post, weighed

24 November 2026. Two replies to Justin's Non-member requests post (the draft is
`content/packs/2026-11-24-ten-parents/messages.md`, section 4). Weighed with
`.claude/skills/feedback-filter`. Neither reviewer clicked the link, so every
point is about the post, not the product.

## Reply 1 (named poster withheld)

| # | Their words | Verdict | Objective | Size |
|---|---|---|---|---|
| 1 | "sounds so ridiculously Chat GPTd that it is actually painful to read" | **Adopt.** The post was drafted by Claude and read as drafted. On a forum, the voice is the proof that a real person is asking. The rewrite is shorter, plainer, and has one real scene in it. Any future forum post goes through `founder-voice-review` before Justin posts it. | The customer (trust before the click). Non negotiable 8 | Small |
| 2 | "tell us what that need was, how you spotted it and what this is" | **Adopt.** The draft named a category of pain ("screen time battles"). It never named a moment Justin lived. founder-context.md has real GREEN scenes: the row when a screen goes off, arguments in the car over what to watch, timers and rules that did not hold. Use one of them. Never invent one. | The customer | Small |
| 3 | "you get to the point at the end... What will you do with our data? Why should we do this?" | **Adopt.** The ask now comes first: ten parents to try a free three question check and tell me what is wrong with it. The data line comes up front too: nothing is kept unless you save a plan. | The goal (stage checks) | Small |
| 4 | "introduce your company name and include a website address that we can google... visible from the homepage" | **Adopt.** Name Guided Childhood, give the bare domain `guidedchildhood.com` to type, and say it is the "Find my child's stage" button on the home page. Drop the long tagged link in the post. Tracking comes from the button instead. Small loss: the utm tag. Fix: Mumsnet can be a `/v/` code on Admin, Film links, or we accept that it shows as direct. | The goal. Evidence or silence (they can check we are real) | Small |
| 5 | "who is Justin? Where in the world are you? How old are your kids?" | **Adapt.** Justin, a dad of three in the Bath area (Justin, 24 November: do not concede the ChatGPT point; he wrote it). Their ages are Justin's call, because the children's details are AMBER or RED in founder-context.md. The draft leaves a gap for him to fill. Never Alma's name or school. | The customer. Privacy rules | Small |
| 6 | (did not click) "clicking on links from unknown sources is generally a really bad idea" | **Adopt.** This is the same point as 4: give a domain they can type themselves. | The goal | Small |

## Reply 2, Chunkybabythighs

| # | Their words | Verdict | Objective | Size |
|---|---|---|---|---|
| 7 | "The advice on what to say is basically... There's a time limit and we stick to it. I mean did I need an app for that?! Seems incredibly pointless." | **Adopt the finding, decline the conclusion.** She is reacting to our own line, "you get the words to use tonight". It sells the obvious part. Every parent knows the rule. The hard part is sticking to it at 6pm without being the bad guy. THE-STORY section 10 already says the star quest leads every list: jobs earn stars, stars become minutes, and a shared timer ends it, not the parent. Our post broke that rule and led with scripts. The rewrite leads with the hard part. | The goal. THE-STORY section 10 (star quest leads) | Small |

**Already built:** the star quest, the shared timer and the child's own app (`/k/[token]`, `/dashboard/quests/timer`). The finding is that the post hid them, not that they are missing.

**Worth a check, not a build:** whether the free stage check result itself reads as "set a limit and stick to it" for a coming off screens worry. If it does, she would be right about the product too. Check `app/(marketing)/starter-pack/ResultScreen.tsx` for that worry tile before the next post goes out.

## What changes

- The rewritten post and the two replies are in
  `content/packs/2026-11-24-ten-parents/mumsnet-rewrite.md`, for Justin to edit
  and post. Nothing is posted by us.
- Rule for every forum or group post: say who you are and what you want in
  the first two lines, give a domain to type rather than a link, name one real
  scene, and lead with the star quest, not the scripts.

## Reply 3, MrsDanversGlidesAgain

| # | Their words | Verdict | Objective | Size |
|---|---|---|---|---|
| 8 | "Is this a plan to tell you what to talk about with your children? it's not at all clear from the post." | **Adopt.** Three readers in, nobody can say what it is. This confirms point 7: a product described as "the words and a plan" sounds like a script service. The rewrite says what it does in one line (jobs earn minutes, a timer ends it), then the plan and the words. The reply answers her directly. | The customer | Small |

## Reply 4, the bedroom line

| # | Their words | Verdict | Objective | Size |
|---|---|---|---|---|
| 9 | "'Phones sleep in the kitchen. The bedroom is for sleep.' That's an immediate contradiction... Any vaguely savvy child will home in on weaknesses in the words used" | **Adopt.** She is right, and it was on the live site: the ages 7 to 10 script in `lib/content/stages.ts` (the stage check result, /pathway, /scripts), the printed script card, and two old static pages. Rewritten so there is no metaphor to argue with: phones charge in the kitchen, mine too, a buzzing phone keeps your brain awake, you get it back at breakfast. The "why" also dropped a blue light claim our own evidence rule avoids. | Philosophy (the words must work at 6pm). Evidence or silence | Small |
| 10 | "get actual children to evaluate them" | **Adopt as a process.** Every script line gets read aloud to a child of the right age and the first comeback is written down before it ships. Justin's three are the first panel; the ten parent testers are asked for their child's comeback too. A full pass over all scripts is a larger job and is parked for a session of its own. | The customer | Medium, parked |

## Reply 5, mysittingduck (the first who used it)

| # | Their words | Verdict | Objective | Size |
|---|---|---|---|---|
| 11 | "I used the app briefly and it was confusing. I wasn't sure where it was heading." | **Adopt, and find out where.** The most important reply so far: the only reader who went through it, and the journey did not say where it was going. Point 7 again, inside the product: the stage check result should open by saying what happens next (your plan, then the jobs and timer, then the lessons). Before changing anything, ask her where she stopped and what she expected, and watch the PostHog recordings for today's Mumsnet visits. | The goal (stage check to plan) | Small to find, size of fix unknown |
| 12 | "the 'bedroom is for sleep, phones sleep in the kitchen' even more so" | **Already fixed** (point 9). | | |

## Reply 6, agreeing with FroggyNo

| # | Their words | Verdict | Objective | Size |
|---|---|---|---|---|
| 13 | "The app implies that we need screens to enable us to avoid screens... address the fact that screens are addictive... Adults as well as children." | **Adapt.** It is a fair worry and the answer is true in the product: the jobs are offline, the scripts are spoken, and the bedroom line already says "mine too". The reply agrees and closes. We do not argue about "addictive": that word needs evidence we would have to source, and a thread reply is not the place. Messaging lesson for every post: say early that most of it happens with the phone down, and that the rules cover adults too. | The customer. Evidence or silence | Small |

## What the Mumsnet visitors actually did (PostHog, 24 November, 12:37 to 14:13)

No recordings exist: session replay is switched off in the project (and
`disable_session_recording: true` in `components/Analytics.tsx`). This is from
the events alone.

- About 24 real visitors from the thread. Each showed up twice, because the
  page reloaded itself on a first visit (fixed in PR 1717, `PwaRegister.tsx`).
- About half left on the intro screen without answering a question.
- About 10 answered all three and reached the result.
- One went on to the account step. Nobody else clicked anything after the
  result: they stayed 25 to 90 seconds, then left.
- mysittingduck posted at 13:19. The only visit that fits is a desktop one at
  13:16: three questions in 52 seconds, the result at 13:17, then gone. Likely
  her, not certain. If so, "not sure where it was heading" is the result page.

Finding: the result page does not say what happens next. That matches point
11. The fix is a clear "here is what you get next" at the top of the result,
then one button. Check `app/(marketing)/starter-pack/ResultScreen.tsx` before
any more forum traffic is sent.
