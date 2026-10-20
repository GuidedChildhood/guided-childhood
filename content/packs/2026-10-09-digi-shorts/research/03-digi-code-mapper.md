# DiGi and the platform: a code map for the next cut

Read only. No file was edited. All paths are relative to `/Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/`.

## 0. Where the brief or the existing film disagrees with the code

| The brief or film says | What the code actually does |
|---|---|
| DiGi has five tools | It has **seven**: `search_knowledge`, `get_child_history`, `save_memory`, `schedule_followup`, `set_reminder`, `log_moment` and `web_search` (`lib/digi/tools.ts:252`). `digi/00-how-digi-works.md` still says five, so the doc is out of date. |
| Free accounts get three messages a day | The cap applies during the **4 day starter trial** (`inStarterTrial`, `app/api/digi/route.ts`). It defaults to 3 and is set in `platform_config.trial_digi_daily_limit` (`lib/config/trial.ts`). Paid and allowlisted accounts have no cap. |
| "How did that go?" arrives as a lock screen push (film scene 3, 21:14) | **No push is sent for follow ups.** The cron at `/api/cron/followups` runs at 07:15 UTC. It makes a Home card (`digi_prompts`, kind `follow_up`). If the follow up is tied to a worry, the question appears as one line on the daily check in instead. Only two DiGi pushes exist: "DiGi stepped in" and "A reminder you asked DiGi for". |
| DiGi hands over the *script* "Bedtime stalling and one more thing" | That title is a **moment card** in `daily_moments` (`supabase/migrations/073_moments_library_by_age.sql:225`), not a script. In the chat, script and moment links show as underlined bold links inside the text. They are never a "Read the script" card. |
| "Bedtime: going great. Resting for a week." | This string does not exist in the code. The real lines are in section (c). |
| "Remembers your family" memory cards | There is **no screen where a parent can see DiGi's memory.** `digi_memory` is read only into the prompt. |
| 142 findings, each added after a human approves on /dashboard/insights | The human gate only covers rows suggested by the research updater. The original rows came in through migrations. "142 of 142 carry a named source on 7 October" is a code comment (`lib/email/momentum.ts:27`). I did not check the live count. |
| Every answer is safety checked | Crisis and safeguarding messages get a fixed human signpost **before** the model replies. The checker runs **after** the reply is finished and only records what it finds (`lib/digi/safety.ts`, `route.ts` `after()`). |
| Show the pathway (StageRoad) | The full `StageRoad` default export, "The road to 16", **is not mounted anywhere**. `DayCheckup`, which draws MiniRoad and the strand pills, is only imported by `app/ref-checkup`. What a parent really sees is `TodayPathBig` on Home, `PassportBook` on `/dashboard/pathway`, and the child's `KidRoad` and `KidPath`. |

The DiGi visual is confirmed. The in-app `DigiCharacter` (`shared/components/DigiCharacter.tsx`) renders `/digi-squad/DiGi-star-3d.png`. That is a 384px transparent cutout of the same clay star as `DiGi-star.png`, which is 1024px on a white background and needs the background removed. It has GSAP moods: idle, speak, happy, thinking and wave. In the thinking mood the star rotates to -10° and lifts 4px, over 1.2s, back and forth.

---

## (a) DiGi's eight best skills, ranked by wow × how provable on screen

| # | Skill | Wow | Provable | Best real footage |
|---|---|---|---|---|
| 1 | One next step, the words to say, and a **Tonight.** line, for this child | 5 | 4 | `ref-digi-chat?chat=1` (the text is authored), or a real account |
| 2 | A worry said once in chat becomes a worry tracked every day | 5 | 4 | DiGi line "it is on their check in now", then the check in row "New. You raised this with DiGi today." |
| 3 | Watches the number move: five faces, sorted after one great day, back in a week | 4 | 5 | `ref-baseline-checkin`, `/dev/concern-scale`, `/dev/what-is-working` |
| 4 | Comes back to ask how it went, and never offers again what failed | 4 | 4 | Home card or the check in line (see c) |
| 5 | Rehearse the conversation, with DiGi playing your child | 5 | 4 | `ref-script-premium?view=chat` |
| 6 | Puts it in words for your child and sends it to their phone | 4 | 4 | Chat buttons, real account |
| 7 | Routes to a real person first, every time (crisis and safeguarding) | 3 (trust 5) | 5 | Fixed text, so it can be shown word for word |
| 8 | Remembers this family and its signed deal | 4 | 3 | Only visible through answers |

**1. The next step and the words, for this child, tonight**
- **How it works:** `app/api/digi/route.ts` gathers context in two parallel rounds before the model starts:
  - profile and every child;
  - this child's live worries, with the latest check in band and direction, including "A DIP from ..." (around line 790);
  - the signed family agreement, in the family's own words, quoted back;
  - timer minutes over the last 7 days and the age guide;
  - the Sunday plan, scripts tried and whether they worked, and what this family already tried (`lib/digi/outcomes.ts`);
  - the issue bank match (`lib/content/device-issues.ts` via `device-issues-match.ts`) with real script links;
  - script matches (`lib/digi/script-match.ts`), moment cards, lessons (`lib/digi/lesson-match.ts`), 6 research findings (`lib/digi/brain.ts`), family memory, upcoming milestones (`lib/digi/horizons.ts`) and pathway position (`getPathwayPosition`).

  `PRECEDENCE_RULES` set the order: safety, then the family's agreement, then research, then this family's fit, then other families, then name any conflict, then never invent. `lib/digi/system.ts` fixes the shape: under 120 words, at most two **bold** lead ins, and a closing **Tonight.** line. At most one script link, as `[Title](/dashboard/scripts/N)`. A dash stripper runs on the stream (`lib/digi/text.ts`).
- **What it achieves:** an answer to the actual fight, with one move, the words, and a link to a real script or moment card. It never gives a flat yes or no.
- **Honest limit:** the reply is written by the model, so any reply in the film must be captured from a real account or labelled illustrative. A link only appears when the matcher found one and the model judged it fits. The `ref-digi-chat?chat=1` reply is authored fixture text, and its line "At Stage 3 the answer is not yet, with a date." comes close to a verdict. Do not present it as DiGi's real answer.

**2. A worry said in chat goes on the tracker**
- **How it works:** `TOOL_RULES` in `lib/digi/tools.ts` contains "A WORRY TOLD TO YOU GOES ON THE TRACKER". `save_memory` is called with kind `concern`, `concern_slug` and `concern_label`. That calls `raiseConcern` (`lib/concerns/raise.ts`), which writes a `concerns` row with source `digi`. The tool then tells the model: "Saved, and it is on their daily check in now. Tell the parent once, in plain words, that it is on their check in, then give one method to try." If the model skips the tool, a fallback extraction pass in `after()` raises the worry anyway. The next check in row reads "New. You raised this with DiGi today." (`ConcernCheckIn.tsx` `newSourceLine`).
- **Honest limit:** the model decides whether something is "a pattern they want to change" or a passing grumble. The check in asks at most **3 worries per child per day** (`DAILY_CAP = 3`, `lib/checkin/today.ts:151`). The rest wait their turn, "longest unasked first".

**3. Watches the number move**
- **How it works:** five faces post 2, 4, 6, 8 or 10 (`lib/concerns/bands.ts`). The outcome copy comes from `lib/concerns/outcome.ts`. One top score rests a worry (`SILVER_RUN = 1`, `lib/concerns/resting.ts`). It comes back after 7 days, or straight away if the worry is raised again. The first "going great" sends the child a push (`app/api/daily/concern-check/route.ts`). `/dashboard/what-is-working` shows movement for each worry and never adds worries together.
- **Honest limit:** these are the parent's own ratings, not measurements. The page says things happened in sequence, never that one caused the other. A rest lasts one week; it is not a cure.

**4. Comes back to ask how it went**
- **How it works:** `schedule_followup` takes 1 to 21 days (default 4), with at most 3 pending per family. It carries the suggestion, topic, time of day, trigger and worry (`lib/digi/tools.ts`). `app/api/cron/followups/route.ts` runs at 07:15 UTC:
  - it makes a `digi_outcomes` row;
  - for a follow up tied to a worry, the question is asked on the check in instead of a card (that question was answered 15 times out of 40 on the check in, against 0 out of 6 on a card);
  - otherwise it makes a Home card;
  - one card per child at a time, cards expire after 14 days, and an expiring card's thread is raised as a worry (`lib/digi/followup-queue.ts`).

  The verdict buttons, "It worked", "Helped a bit" and "Not really", post to `/api/digi/outcome`. "Not really" reopens DiGi with "We tried this and it did not work for us: {suggestion}. What else could we try?" `getTriedAlready` and the worry strand (`lib/digi/approaches.ts`) stop a failed idea being offered again.
- **Honest limit:** not a push. The model decides when to book one; before the 8 August rewrite it had booked 0, against 53 memory saves. Cross family "this worked" needs 3 verdicts on the same situation, and outcomes were few (6 rows on 18 September, per a code comment).

**5. Rehearse with DiGi playing your child**
- **How it works:** `components/scripts/RehearseWithDigi.tsx` and `app/api/scripts/rehearse/route.ts` have three modes: `child` (role plays the child at their age, shown as Pebble), `coach` (steps out of character and coaches using the research bank) and `suggest` (three lines to say next, following the refusal ladder in `lib/content/refusal-ladder.ts`). While it thinks it shows "DiGi is thinking about Teo's answer..." and "DiGi is thinking about how it went...".
- **Honest limit:** full access only (402 "Rehearsing with DiGi is part of full access."). It is a practice run, not a prediction of how your child will react.

**6. Words for your child, sent to their phone**
- **How it works:** a "Put this in words for my child" button sends "Put that in simple words for my child to read, at their age, so we can go through it together." The system prompt section "A VERSION FOR THE CHILD" handles the rewrite. A "Send to their phone" button calls `app/api/digi/send-to-child/route.ts`, which writes a `kid_nudges` row and sends a push. Button states: "Sending…", "On their phone ✓", "Their app is not set up yet", "Did not send, try again".
- **Honest limit:** the child needs the kid app link set up. Push delivery is best effort.

**7. Safety first, every time**
- **How it works:** `CRISIS_OPENER` and `SAFEGUARDING_OPENER` (`lib/digi/safety.ts`) are streamed before the model says a word whenever a keyword matches. Crisis text: "This needs a real person before anything I say. If anyone is in immediate danger, call 999. Samaritans are on 116 123, any hour. Childline is 0800 1111 for your child themselves. Your GP is the door to CAMHS tomorrow. What follows is the words around that." `lexicalFlags` records allow or deny language, diagnosis, verdicts and dashes on every finished reply into `digi_safety_flags`. The chat footer reads: "DiGi is a guide, not a crisis line, and can make mistakes. In an emergency call 999, or Samaritans on 116 123."
- **Honest limit:** detection is by keyword. The after check cannot change the reply. The model graded review runs only in the monthly eval suite (`/api/cron/answer-review`, 14 cases).

**8. Remembers this family and its deal**
- **How it works:** `getFamilyMemory` ranks 12 memories by meaning, kind and recency (`lib/digi/brain.ts`). There is one thread per child, and a name rule across siblings. The family agreement terms are read and DiGi is told to "quote their own wording back". It also reads the Sunday plan and `getWhatWorked`.
- **Honest limit:** memory is invisible except through answers. Meaning search needs `EMBEDDING_API_KEY`; without it, keyword ranking takes over silently.

**Honourable mentions:**
- `set_reminder`, only when asked: push "A reminder you asked DiGi for".
- Hands free voice: "Hands free: just talk, DiGi answers aloud".
- `log_moment`, which ticks today's Moment step.
- Proactive step in: push "DiGi stepped in", model decided, at most 2 a week and never two days running (`lib/digi/moment.ts`, `DIGI_STEP_IN_PER_WEEK`).
- Sunday review and plan (`lib/digi/weekly-review.ts`, `weekly-plan.ts`).

---

## (b) The thinking messages: `components/digi/ThinkingReassurance.tsx`

These are the 13 lines, word for word, in fixed order:
1. Checking our reviewed research, not the open web.
2. Reading what the research says for a child this age.
3. Finding where your child is on their pathway.
4. Never a flat yes or no. Working out your next step.
5. Connection before control. Keeping your bond at the centre.
6. Weighing it against the scientists we trust.
7. Seeing what worked for other families with a child this age.
8. What other parents found, never who they are.
9. Your own family history is part of this answer.
10. Looking for the words you can actually use.
11. If it is ever serious, DiGi points you to real people first.
12. Every answer is checked afterwards, and anything worrying is reviewed.
13. Your feedback goes back in and shapes the next answer.

**Timing:**
- It always starts at line 1 when it appears. Each line stays for **2,200ms** with a 0.5s fade in and no fade out. A full cycle takes 28.6s and then loops.
- It shows in `DigiChat.tsx` (around line 1509) while `loading && (!streamingReply || thinkingFloor)`. It sits next to three bouncing dots and the clay star in the `thinking` mood, labelled "DiGi".
- There is a minimum floor of **1,400ms** (`setThinkingFloor`, around line 717).
- A typical reply starts in about 4s (code comment), so most parents see **lines 1 and 2**, sometimes 3. Replies that use a tool take longer and show more lines.
- The input bar says "DiGi is thinking".

**Honest framing:** the lines describe what goes into every answer. They are **not** a live progress log; the context is gathered in parallel before the model is called. Do not film them as live steps happening one after another.

**Filming:** `ref-digi-chat` has no session, so a send fails at once and only line 1 is seen. To capture the rotation, stub `POST /api/digi` with a held response, for example a Playwright route that waits about 30s.

---

## (c) A moment tracked from start to finish

**1. Ways a worry is born** (all go through the `concerns` ledger, created or bumped):
- **Setup:** baseline worries Bedtime screens, Coming off screens, Mood after screens, Phones and messaging. The onboarding map also gives Morning TV, Controller fights, Social media, AI chatbots, What they come across online (`lib/concerns/worry-map.ts`). The day one fixture heading is "Heard. These are on your tracker" (`ref-checkin-acknowledge`).
- **Daily moments deck:** 20 tiles in 6 time groups, Morning 7am, School 9am, After school 3pm, Out and about 5pm, Evening 6pm, Bed 8pm (`lib/content/daily-moments.ts`, `components/daily/MomentTimeline.tsx`). The flag goes to `app/api/daily/feedback`. bedtime becomes "Bedtime screens", come_off becomes "Coming off screens", tv_morning becomes "Morning TV". Any other tile uses its own label, for example "Sibling fighting".
- **DiGi chat:** `save_memory` or the fallback extraction, source `digi`.
- **Right now:** source `rightnow`.
- **Expired follow up card:** the follow ups cron raises it as a worry, named from the parent's trigger words or the topic label.

**2. The check in** (`/dashboard/checkin`, `components/daily/ConcernCheckIn.tsx`):
- Heading: "How is it going with {name}?" (first time: "Where things are with {name}").
- Small label: "Still on the list" (first time: "Where things are now").
- Intro: "One tap each. Going great and it comes off your list; anything less stays on it and we keep working on it with you." (first time: "One tap each, just to see where things stand. No right answer.")
- Row labels: "New. You raised this with DiGi {today}." / "New. From a moment you logged {today}." / "Come up {n} times, still on your list" / "Added when you set up".
- **Five faces:** Really tough, Hard going, Up and down, Getting there, Going great. Last time shows as a grey face, and there is a "Skip" link. The save lands after 1,000ms and the result stays readable for 1,800ms before the row folds.
- **Last night's words** card: "{title}. Did you use them?" with Yes, Sort of, Not yet.

**3. The outcome line** (`lib/concerns/outcome.ts`):
- **Going great:** "🎉 Sorted! That is a great day." then "Off your list. We will check in a week that it held. If it comes back, log it as a moment."
- **Really tough or Hard going:** "Tough one. Thank you for telling us." then "We are on it with you. Here is help for tonight." with buttons **Ask DiGi** (pre-filled: "{label} is {word} at today's check in for {name}. What is our next move?") and **Get the words**.
- **Up and down or Getting there:** "{Word}, up from {last}." / "{Word}, down from {last}." / "{Word}, same as last time." / "{Word}. First one logged." then "Stays on your list. We will ask again next check in."
- **Folded verdicts:** "Sorted, off your list", "Up from hard going", "Dipped this time", "Holding steady", "First one logged", "Starting point set", "Skipped".
- **Finish:** "{name} is done ✓ We will read these into next week." If more are waiting: "That is today's check in done … We are still on those and will ask over the next few days, longest unasked first, so nothing gets dropped."

**4. Server side** (`app/api/daily/concern-check/route.ts`):
- Status moves open, then improving, then resolved.
- A low score (band 2 or below) creates a Home card labelled "Worth watching this week", titled "DiGi can help with {label}", with body "{name}'s {label} was {word} at today's check in. Talk it through when you have a minute, or get the words for tonight." and a "Talk it through" button.
- The **first going great pushes to the child**: "{name}, a stamp in your passport 🛂" / "{label}: sorted. Your grown up gave it five stars. That was you."

**5. Resting and the weekly return** (`lib/concerns/resting.ts`): a worry rests after one top score, provided nothing has raised it since and it was scored within 7 days. After 7 days it returns to the daily list. A moment, a DiGi ask or Right now brings it back straight away.

**6. DiGi reads it:** the next chat sees "Bedtime screens: open, flagged 3 times; last check in today: hard going, A DIP from getting there" and is told to start there.

**7. The follow up:**
- **On the check in**, when tied to a worry: "DiGi suggested: {suggestion}" / "Did you get to try it?" with Yes, Sort of, Not yet. Replies: "Noted. Now, how is it going?" / "Noted. Sort of counts. Now, how is it going?" / "Noted. It stays on the list. Now, how is it going?"
- **As a Home card** otherwise (`components/digi/DigiPrompts.tsx`): label "Checking back, as promised", title "How did that go?", body is DiGi's question. Buttons: "It worked", "Helped a bit", "Not really". Placeholder: "Anything you want to add, in your own words. Optional." Note under the buttons: "Not really is the most useful answer here. It gets you a different approach next, and it counts for every family on the same worry." Plus "Not now". Tapping the card opens DiGi with "You said you would check back on this: {question} Let us pick it up from there."

**Top issue moments** (Justin's "top 5"). The code ranks issues by age band (`BAND_ORDER` in `lib/content/device-issues.ts`, from briefings 2026-09-09 and 2026-09-13):
- **8 to 10:** "Five more minutes, every single day"; "Roblox and the Robux"; "Everyone in the class has a phone"; "The Year 6 WhatsApp group"; "She wants TikTok and all her friends have it".
- **4 to 7:** "The meltdown when the screen goes off"; "Grumpy and rude for an hour afterwards"; "Bored the second the screen goes off"; "One more video is never one"; "Tablet before school and now we are late".

The file itself warns that its Ofcom and Mumsnet figures "came through search extracts, so a figure only enters public copy once someone has opened the paper". The `words` fields marked VERBATIM carry Mumsnet links I have **not** opened, so do not use them as parent quotes until they are checked.

---

## (d) The pathway as the app shows it

**TodayPathBig** (Home, `components/daily/TodayPathBig.tsx`; fixture `ref-today-path`):
- Title: "{kid}'s path today" / "{kid}'s path, done".
- Lines under it: "Understand one moment, and walk away with the exact words for it." / "One tick makes today count: {step}. The rest is extra, not homework." / "Today counts, your streak is safe. {n} left if you have the time." / "Today is made. Anything more is yours to take."
- Small label: "Today · do this next" / "Today counts". Meter: "{x} of {10} min". Daily budget chips: 5 "A quick day", 10 "The usual", 15 "Room to go deep". Counter: "{n} of {m} done · {s} day streak".
- A meandering path of round nodes, with the clay star sitting beside the current node and one big **Go** button.
- Node labels (`lib/pathway/daily-tasks.ts`): Check in, Moment, Lesson, Script, The deal, Approve / First job / No jobs waiting / Quests, Passport, Ask DiGi, Done.
- Hints change with the time of day, for example "Start the day: thirty seconds on how yesterday's worry went" and "Tell DiGi how today actually went".
- Close: "Your {minutes} minutes, done 🎉" then "You are readier for {kid} today than yesterday. … Your streak is safe."

**PassportBook** (`/dashboard/pathway`, `components/pathway/PassportBook.tsx`; `ref-passport-book?stage=2`):
- A cover, then one page per stage: Foundation (Ages 4 to 7), Builder (8 to 10), Explorer (`stages.ts` says "Ages 11 to 12" but the fixture says "11 to 13", so check before filming), Shaper (13 to 15), Independent (16 and above).
- Checklist rows: Devices set up, Moments to resolve, Lessons and tests, Jobs and routines, Screen balance. A finished page shows "All five, done. This page is stamped."
- Buttons: "Start the next step →", "Catch this page up →", "Peek at what it teaches →", "Look back at this stage". Also "One page behind you" and "One worry sorted so far, on your own stars."
- Stamp celebration: "{name} has the {Stage} habits in place for their age now. A real step on the road to a confident, capable 16."
- Cover: "Check it any time at guidedchildhood.com/verify".

**StageRoad** (`components/pathway/StageRoad.tsx`):
- Only its parts are live. `StageDot` is used in the child's `KidRoad` inside `KidQuestScreen`. `MiniRoad` and `StrandPills` are used by `DayCheckup`, which only `ref-checkup` renders.
- The full road's copy ("The road to 16", "You are here", "Can do at this stage", "Social media walked into with open eyes, not fallen into off a cliff") is not on any live screen.

**Child path:** `KidPath` (`ref-kid-path`) shows job stones, a chest, a printable, a quiz, minutes used against the guide, and the star balance.

---

## (e) The screen timer, in full

**Stars and the rate**
- A star counts as earned once the parent approves it: approved job ticks, star lessons and watch together lessons (`lib/quests/bank.ts`).
- The default rate is **5 minutes per star** (`STAR_MINUTES`, env `NEXT_PUBLIC_STAR_MINUTES`). It can be set per child to 5, 10 or 15 (`TimeTiersCard` `RATE_PRESETS`, allowed range 1 to 60).
- Requested minutes must be multiples of the rate. Cost is the minutes divided by the rate, rounded up.

**Weekly cap**
- The star week runs Monday to Monday, London time.
- The spendable balance is this week's earnings, capped at `weeklyStarCap` = daily guide × 7 ÷ rate (`lib/quests/star-week.ts`). For an 8 to 10 year old at rate 5 that is 525 minutes, or 105 stars (the fixture shows `weekCap: 105`).
- Stars earned above the cap go into a **holiday bank**, which never expires and can only be spent in the school holidays.
- Minutes not used by Monday buy sticker credits, at 30 minutes per credit.
- The lifetime balance is only used for real world goals, for example "Cinema trip", 40 stars.

**Daily guide** (`lib/quests/screen-balance.ts`)
- 4 to 7: 60 minutes. 8 to 10: 75. 11 to 13: 90. 13 to 15: 120. 16 plus: 120. Relaxed in the school holidays.
- The code names no source for these numbers; it says they "lean on where mainstream public health guidance has settled".

**Free daily core** (`lib/quests/time-tiers.ts`)
- Presets are 0, 15, 20 or 30 minutes; 0 means off.
- It is spent first because it disappears at midnight. Stars are spent next, because they reset on Monday. The holiday bank is spent last.

**Protected windows** (`checkProtectedWindow`)
- Bedtime defaults per age band are one hour before a typical bedtime: 18:00, 19:00, 20:00 and 21:00, each running to 07:00. 16 plus has none.
- Mealtimes, if switched on: 07:30 to 08:00, 12:00 to 12:45, 17:30 to 18:30.
- School hours, if switched on: 08:45 to 15:15 on weekdays in term time.
- A child starting inside a window **becomes an ask**. The parent's yes "runs it anyway".

**The ask flow** (`app/api/quests/time/start/route.ts`)

A start becomes an ask, never a refusal, in any of these cases:
- the trust level is "Ask first" (the default);
- the child is inside a protected window;
- the start would take today past 1.5 × the guide (except a trusted 16 plus, who just gets an advisory push);
- the child is short of stars.

Other rules:
- For "watch" or "trusted" children, jobs the parent marked as gating screens must be done first. The child sees "Finish first: {jobs}. Then your time can start."
- Pushes to the parent:
  - "{name} is asking for screen time ⏳" / "{mins} minutes on {screen}, that is {n} stars. Tap to say yes on your board."
  - Protected window: "{name} is asking for screen time in a protected window 🌙" / "{mins} minutes on {screen}. It is inside their bedtime window, so it came to you instead of starting. Yes runs it anyway, your call."
  - Short: "… that is {n} stars and they have {b}. Your yes covers the rest, or say not today."
  - Over the guide: "{name} wants more screen time today ⏳".
- Trust levels: "Ask first", "They start, you watch", "Trusted".
- Ways a parent can grant time: "Spend their stars" ("The default. Earned time, the deal as agreed."), "Gift it" ("Starts now, no stars spent. Jobs pay it back later."), "Free bonus" ("A treat with no strings. Spends nothing, owes nothing.").

**What the parent sees**
- `ParentDeviceTime.tsx` explainer:
  - "They earn stars by doing quests. One star is worth five minutes of screen time." (this is hard coded and ignores a custom rate)
  - "The countdown runs on their phone and yours at the same time, so you both see it ticking down."
  - "When it reaches zero, both phones get the alarm. Then it is time to agree the next quests."
- After a yes: "✅ Yes sent. {name} taps Start on their screen and the countdown shows here too."
- The ask pop up warns "Screens are meant to be resting".
- Three kinds of time card: "Their time, three kinds" / "Free time is always theirs, no stars needed, so the screen never becomes the prize. Earned time comes from stars on top. Protected time cannot be bought at all, though a start inside it still comes to you as an ask, your call every time." / "An hour before bed, not at bed."
- Pushes from the device time cron:
  - "{name}'s screen time is up ⏰" / "The {device} timer has finished. Time to set the next quests." (sent as urgent)
  - "{name} has reached the healthy amount for today 🌱"
  - "{name} started {mins} minutes on the {device} ⏱️"

**What the child sees** (`DeviceTimeCard.tsx`, `KidAskBanner.tsx`)
- Asking: "Ask for {n} min 🙋" / "Start {n} min ⏱️" / "Asked your grown up for 30 min on the TV" / "They said yes! Tap to start your timer" / "▶ Start my 30 minutes" / "Not right now" / "Your stars are safe."
- Protected window: "🌙 Screens are resting now. I know that is disappointing. Morning is coming."
- Running out: blips, vibration, and a spoken "Ten more seconds, then it is time for some offline fun." Then "Time for offline fun!" or "That is the healthy amount for today. Your stars are safe for tomorrow."
- Balance lines: "You have {n} minutes to use now, {c} of them free time" / "No minutes ready yet. You can still ask your grown up, or do a job to earn some".

**Ref routes for filming the timer:** `ref-ask-first` (`?view=child|parent|share|share-young|timer`), `ref-ask-popup` (`?bedtime=1`), `ref-timer-nudge`, `ref-time-tiers` (stub `/api/quests/time/settings`), `ref-kid-today` (`?holiday=ready|empty|banked`, `?view=contract`), `ref-kid-path`, `ref-kid-jobs` (`?waiting=1`, `?empty=1`), `ref-kid-home`, `ref-balance`, `ref-status-board`, `ref-job-board`. Also `/dev/device-time` (`?view=popup`), `/dev/parent-timer` and `/dev/timer-short`.

**Honest limit:** **no device is locked.** It is a shared countdown with pushes. Enforcement is the deal and the relationship, which matches "we are not parental controls".

**Research leads for the timer film.** These come from `device-issues.ts`. Every one must be opened and checked before use:
- Hiniker et al., CHI 2016, on screen time tantrums and the two minute warning;
- Radesky et al., JAMA Network Open 2022, on autoplay and manipulative design;
- Carter et al., JAMA Pediatrics 2016, on bedroom devices and sleep;
- Tam and Inzlicht, 2024, on boredom;
- Fitzpatrick et al., JAMA Pediatrics 2024.

---

## (f) The research pipeline

- **Store:** the `expert_knowledge` table: `source_type`, `source_name`, `finding`, `age_bands`, `topics`, `url`, `active`, `embedding`.
- **How a finding gets in:** original rows came through migrations (042, 142 and others). New rows come from `/api/cron/knowledge-refresh`, on the 1st and 15th at 06:00 UTC. A model with `web_search` reads the last 30 days of parent questions and drafts up to 6 candidates, under the rule "never invent a study… educate not ban". They go into `expert_knowledge_candidates` as `pending`, and the founder is emailed.
- **The human gate:** approval is founder only, in the InsightsBoard on `/dashboard/insights` (`app/api/admin/knowledge-bank/candidates/route.ts`, POST approve). Nothing reaches the live bank without that click. This is not a parent feature.
- **Retrieval:** `getExpertKnowledge` (`lib/digi/brain.ts`) mixes two searches:
  - meaning search (`match_expert_knowledge` on a query embedding, which needs `EMBEDDING_API_KEY` and `/api/cron/knowledge-embed`);
  - keyword scoring (the `WORD_TO_TOPIC` list, age band, a bump for crisis topics, and 2 findings suited to the age when nothing else matches).

  The top 6 are passed as "EXPERT KNOWLEDGE BASE (cite the source by name…)". DiGi can also search for itself with `search_knowledge`.
- **How DiGi cites:** names only, inside the sentence. The finding's `url` is **not** passed to the model, and the chat has **no citation UI or links**. The system prompt allows DiGi to state a researcher's general position from memory, but numbers, years, titles and quotes must come from the bank or a search, or be left out.
- **What can be shown honestly:**
  - DiGi names researchers in its answers.
  - A human approves every new finding the updater suggests.
  - Every finding carries a named source (per a code comment of 7 October; check the live count with `select count(*) from expert_knowledge where active`).
  - DiGi checks the bank, not the open web, for parenting advice. Web search is barred from general advice (`TOOL_RULES`).
- **Do not use without checking against the paper:** the system prompt's line "across 355,358 adolescents, sleep and breakfast carry associations several times the size of technology use".

---

## (g) Ref routes useful for filming (all 54 read)

All of these return 404 in production (`middleware.ts:37`). Use the local dev server or a preview deployment. Unless noted, the best viewport is a phone at about 390px.

| Route | Params | What it shows | Use for the film |
|---|---|---|---|
| ref-digi-chat | `?chat=1`, `?kids=1` | Real DigiChat in the dashboard shell, with child rail and tab bar | High (thinking lines need a stubbed POST) |
| ref-script-premium | `?view=chat` | Script detail; rehearsal open with thinking state and chips | High |
| ref-baseline-checkin | none | First check in and a running check in, five faces | High |
| ref-checkin-acknowledge | none | "Heard. These are on your tracker" with two children | Medium |
| ref-checkin-waiting | none | Copied text: the cap of 3 and "nothing gets dropped" | Low (copied, not the component) |
| ref-today-path | `?done=1`, `?clear=1` | TodayPathBig | High |
| ref-day-tick | `?first=1`, `?part=1` | The day tick confirmation | Medium |
| ref-passport-book | `?stage=1-5` | PassportBook and intro (desktop or phone) | High |
| ref-passport-zine | none | Printable passport (A4 landscape) | Low |
| ref-application | `?done=1`, `?behind=1` | Passport application strands and balance zone | Medium |
| ref-checkup | none | DayCheckup with MiniRoad and strands (not live) | Low |
| ref-ask-first | `?view=child\|parent\|share\|share-young\|timer` | Child ask banners, picker, parent locked banner, QR share, running timer | High (timer) |
| ref-ask-popup | `?bedtime=1` | The parent's ask pop up, with the protected window warning | High |
| ref-timer-nudge | none | Parent timer row with "jobs left" | High |
| ref-time-tiers | stub settings API | Three kinds of time card | High |
| ref-balance | `?days=2` | Balance report | Medium |
| ref-kid-today | `?view=contract`, `?holiday=` | Child home with bank, goal, holiday bank | High |
| ref-kid-home | none | Whole child home screen | Medium |
| ref-kid-path | `?claimed=1`, `?jobs=none\|done` | Child path with minutes against the guide | Medium |
| ref-kid-jobs | `?empty=1`, `?waiting=1` | Child jobs and their waiting asks | Medium |
| ref-kid-five | `?view=part\|fresh\|done\|streak\|sticker\|kind`, `?accent=` | Child five a day and streak takeover | Medium |
| ref-kid-suggest | `?view=empty` | Child "Ask for a job" | Low |
| ref-kid-week | none | Child school week | Low |
| ref-job-board, ref-status-board, ref-quest-board, ref-add-job | add-job: `?tab=agree\|theirs`, `?child=` | Job board and status (quest-board and add-job need `/api/quests` stubbed) | Medium |
| ref-roundup-card | stub weekly-review | Weekly round up card | Low |
| ref-needs-you | none | Home "now" row, trial countdown, Today card | Low |
| ref-catchup | none | "While you were away" card | Low |
| ref-child-rail | `?kids=3`, `?done=`, `?cal=` | Child switcher | Low |
| ref-your-screens | `?done=1`, `?from=today` | Device list | Low |
| ref-sticker-book, ref-friend-arrival, ref-friends-poster, ref-shop (`?earned=`, `?ordered=1`), ref-kid-icons | as listed | Planet Friends and rewards | Low for a DiGi short |
| ref-reveal | `?risk=1` | Stage check result screen | Medium (end card) |
| ref-choose, ref-upgrade-block | `?soldout=1` | Pricing blocks | Medium (sales close) |
| ref-og-card | none | 1200×630 share card | Thumbnail |
| ref-watch-stages | `?stage=1-5` | Lessons browser | Low |
| ref-homework-help, ref-learning-*, ref-curriculum-sheet, ref-school-*, ref-email-*, ref-code-fill, ref-buttons, ref-star-chart-sheet, ref-kid-chrome | various | School, email and layout fixtures | No |

Useful `/dev` fixtures (gated off on the live site): `/dev/concern-scale`, `/dev/what-is-working`, `/dev/digi-answer`, `/dev/digi-question`, `/dev/digi-wondering`, `/dev/parent-timer`, `/dev/device-time`, `/dev/issue-of-week` (`?band=`), `/dev/moment-timeline`, `/dev/moments-to-resolve`, `/dev/social-road`.

---

## (h) Ten scripts for common screen fights

Sort orders come from the seed files. Check them against the live database before linking `/dashboard/scripts/{n}`.

| Title | Stage, category, sort, free | Situation (word for word) |
|---|---|---|
| The Just Five More Minutes Loop | explorer, daily-moments, 1308, paid | "It is bedtime. You have already extended twice. Your child says five more minutes again." |
| Refusing to stop when time is up | builder, screen-time, 103, paid | "Your child knows their screen time is up but flatly refuses to stop, either ignoring you, arguing, or having a meltdown." |
| The two minute warning is making it worse | foundation, screen-time, 9650, free | "You give the warning, you count down, and the ending still ends in tears. Every day. You have started to dread the word "off" as much as they do." |
| When Screen Time Ends in Tears | foundation, daily-moments, 1302, paid | "You have ended tablet time. Your child has dissolved into tears or rage." |
| The Morning TV Standoff | foundation, daily-moments, 1301, free | "It is 7:45am. Your child will not turn off the TV before school. You have asked three times." |
| They cannot stop in the middle of a match | builder, gaming, 9620, free | "You have said it is time to come off and they have gone from fine to furious in about four seconds. They are mid game, other children are relying on them, and leaving now costs them something real." |
| Evening TV Will Not Turn Off | builder, daily-moments, 1344, paid | "It is 7:30pm. You have said the TV is going off. It has not gone off. You have been saying it for twenty minutes." |
| The phone is in their room all night | shaper, screen-time, 9622, free | "Your teenager takes their phone to bed. They are tired in the mornings, hard to wake, and flat by the afternoon, and every conversation about it so far has ended in a row." |
| Asking for more screen time | foundation, screen-time, 101, free | "Your young child has used up their screen time for the day and is asking for more, becoming upset or persistent when you say no." |
| Everyone Else Has It | explorer, daily-moments, 1318, paid | "Your child is furious that they are the only one without the app, the game, or the device that everyone else apparently has." |

Alternates: Negotiating screen time limits (shaper, 111), Gaming Rage (1317), When They Say Everything Is Boring Without a Screen (1323, free), Screen Time Before School Has Happened Again (1356), The Year 6 phone plan, before the box is opened (9653, free), Binge watching (109).

Example "say this" line, from 9650: "When this episode finishes, the tablet finishes too. Not me, the tablet. Let us watch the last bit together and see the end come. Then it is your turn to press the button."

---

## (i) What a video must NOT claim

1. That it locks, blocks or switches off a device, an app or a TV. The timer is a shared countdown.
2. That "How did that go?" arrives as a lock screen push. It is a Home card or a line on the check in.
3. That DiGi messages the parent unprompted whenever something happens. Step ins are decided by the model, capped at 2 a week and never on two days running, and the push title is "DiGi stepped in". Any message text in the film must be labelled illustrative.
4. That there is a screen of DiGi's memories, or memory cards a parent can browse.
5. That the chat hands over a script card with a "Read the script" button. Links sit inside the text. Also, "Bedtime stalling and one more thing" is a moment card, not a script.
6. Any check in or outcome copy that is not in section (c), including "Resting for a week".
7. "Five tools" (there are seven), or "free accounts get 3 a day" (the cap is the 4 day trial's default).
8. That every answer is safety checked before you see it. Only crisis and safeguarding openers come first; the checker runs afterwards.
9. That DiGi links to or shows its sources. It names them in the text only.
10. That DiGi or the AI learns from families or is trained on them. It learns about a family, inside that family's own records.
11. Any count or percentage for what worked for other families. Cross family suggestions need 3 verdicts, and some "wisdom" counts are the model's own estimates.
12. That the 60, 75, 90 and 120 minute guides are NHS, WHO or official limits. No source is named in the code.
13. The Ofcom and Mumsnet figures or "verbatim" lines in `device-issues.ts`, until each source has been opened.
14. Any promised outcome: ends the fights, fixes bedtime, makes your child sleep. The faces are the parent's own report, and What is working shows sequence, not cause.
15. That every finding passed the /dashboard/insights gate, or "142 findings" as a live number, before checking it.
16. The thinking lines as a live step by step log. They rotate on a 2.2s timer.
17. Rehearse with DiGi as part of the trial or free tier. It is full access only.
18. That DiGi monitors the child's apps, messages or content. It does not.
19. Any DiGi line that reads as yes or no. Avoid the `ref-digi-chat` fixture line "the answer is not yet, with a date".
20. The three homepage testimonials (`app/page.tsx:133`, marked "the only real testimonials"). I cannot verify them; Justin must confirm they are real, that the person consented, and the source URL.
21. Mixed wording in the product itself: the parent check in uses faces, but the child's passport push says "five stars", and What is working and the passport say "stars". Film whichever wording is actually on screen.