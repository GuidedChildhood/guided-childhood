# The passport journey, simple enough to read in five seconds (version 4)

Justin, 15 October 2026, in short: the passport journey, systematically on the
pathway. The daily loop says what is done and what to do. Parents see the child
is actually learning as they get older, and what earns each stamp, with
Duolingo simplicity. The PWA updates parents. The child is more protected near
13 and 16, with AI education in it. Simple, uncluttered, fits what is built, and
linked to ordering the printed passport. Until it is 100 percent.

Every existing file named below exists on origin/main; new files say (new). This
worktree is 103 commits behind main, so rebase before PR 1, recheck every line
number, and anchor guards on symbols (`passportOutstanding`, `eveningHeldForQuiet`).

---

## 0. The test this plan has to pass (the "100 percent")

Each item is proved by a guard section in a script CI already runs (PR 1,
Guards) or by an observed screen, never by a claim.

| # | The test | Proved by |
|---|---|---|
| T1 | The top of the passport answers where they are, what is done and what is next, in one look. | Screenshots, phone and desktop. Section "tree". |
| T2 | One number counts exactly what earns the stamp, printed once as "7 of 12 done", never a percent. Captions split it by who. The child sees only their lessons and the check. | Section "number", on fixtures, child book and KidRoad included. |
| T3 | Every day each child has one passport line in the daily loop, riding pushes that already fire, and a calm "done for this week" with the tea question, never an open Lesson rung, while the next lesson waits. | Section "today": one writer, one Home reader, two children, a pass three days ago, a stamped page. |
| T4 | Nothing written for the parent (text, link, price, a worry in their words, a parent quiz question) reaches the child's device, and no child line changes with membership. | `check-passport-readonly` over every child screen and string named in 1.7 and PR 3b, the padlock (outside `KidPath.tsx`) and the parent bank included; `check-kid-notes`; "member". |
| T5 | Page, lessons and check follow the school year. 13 and 16, the contract, screen minutes, Right Now and scripts follow the birthday. | Section "clock", over the reader list in PR 1b. |
| T6 | A stamp once earned stays earned, and there is one stored stamp. | Section "stored": no stamp decision outside `stamped.ts`, no `stage_passports` writer, no unguarded `stamped_at` write, no school lesson pass from the client. |
| T7 | Near 13 and 16, social media and AI lessons show and come back first; copy follows all three `social_media_law` states, a bad value reading as `none`. No `FLAGGED_MODULES` title or tea line and no `only_on_signal` script on a lock screen, in a preheader or as a Next; every flagged question the child meets carries the tell route. | Sections "flag" and "copy": Years 3, 6, 8 and 11 under each value and a bad one; all 17 `FLAGGED_MODULES` through `pushLine`; a `ks4-17` check. |
| T8 | The printed passport is offered after the stamp moment, never inside it, never to the child, never with nothing new since this child's last fulfilled order. The first sticker card and the Book's quiet link are doors, not offers. | Section "order". |
| T9 | Five blocks at most, no two butter buttons above the record, seven text lines at most on the hero, the next step named in five seconds. | Section "tree" counts `data-block` and every bordered or lifted card above the record; parent lens on a screenshot. |
| T10 | Never allow or deny. Learning is claimed only from what is recorded: a school lesson passes when every prove question is right on its settled answer; a together pass is finished, never known; warm ups and Remember checks count solo first taps; the check is marked on the server; "still remembered" needs a right first tap ninety days on. Never says {Kid} is ready or safe. | Copy guard ("is safe", "ready at 13", "ready at 16", "Social media ready", "Ready for the world", "AI friend", "remembered last week", retired seal phrases; page names allowed; dev and ref pages exempt), `npm run ai-tells`, a together retake fixture. |
| T11 | A family in the trial gets a step it can finish. A lapsed family, kept off the passport by the paywall, sees its child's count on the upgrade page and in the win back email. | Sections "day one" and "member". |

---

## 1. What exists, and what is wrong with it

**Already built, and kept:** stages and stamps (`shared/stage-map.ts`); the lesson count, `school.next` and `keptRings` (`lib/pathway/lesson-path.ts`); the stamp rule (`lib/pathway/stamped.ts`); one school lesson a week (`newMissionAllowed`, `lib/lessons/school-path.ts`); five rows (`lib/pathway/passport-sections.ts`); `PassportBook.tsx`, `KidPassport.tsx`, `MiniRoad` (`StageRoad.tsx`) and `KidRoad.tsx`; a tea question and what to listen for in all 34 `parent_note`s; one nudge per lesson (`app/api/quests/lessons/route.ts`); the daily rung (`lib/pathway/daily-tasks.ts`); the lesson, check and evening pushes (`lib/push/evening.ts`, held after seven quiet nights); two weekly emails (`lib/email/templates.ts`); the heavy heads up (`lib/lessons/heavy.ts`); the never speak first gates `scripts.only_on_signal` (migration 185) and 17 `FLAGGED_MODULES`; the £14 booklet and £4 sheet, never sold inside the celebration (31 July); the paywall (`lib/access.ts`), open to a lapsed parent only on upgrade, settings and orders; `surface_events` (`lib/events/record.ts`).

**Not built:** the Remember check, items 6.3 to 6.5 of `plans/2026-10-08-lessons-hub-plan.md`.

**What is wrong:** (1) "Next" in six places, three percentages, about 13 blocks. (2) Two stamps, neither safe: the computed one vanishes when a module is added; the stored `stage_passports` (migration 049) is written by `app/api/parent-lessons/complete` on another rule and counted by `lib/email/month-progress.ts`. (3) Two clocks: page and check on the birthday, lessons on the school year. (4) The check tests the wrong lessons, from a parent bank, scored by the client (`body.correct`). (5) The next lesson bounces six days in seven, on the passport and Home's Lesson rung, as `school.next` ignores the weekly gate. (6) The child is told what is not true or not theirs: "stamp earned" too early, a percent and an owned buddy on KidRoad, promised accounts, worry stamps in the parent's words. (7) Learning claims rest on rules the code lacks: a 70 percent mark only the client route uses, a kept ring that counts a wrong answer. (8) No age milestones, and nothing reads the flag.

---

## 2. The design in one paragraph

One passport, four blocks. **Now and Next**, one hero card like a Duolingo unit header joined to its button: the page, one count, one bar split by who ending in the stamp, the one step, and most days an honest "done for this week" with the question to ask at tea. The **Road**, MiniRoad with the age milestones, is the Book's index. The **Book** has one quiet order link. **The record** is folded. One `StampSeal` draws every stamp. Home, pushes, emails and the child's screens read one function, so the daily update is the passport speaking.

Mobbin references, in butter, ink and Nunito: Duolingo's unit header (https://mobbin.com/screens/fd077091-e8e9-413f-9aff-bb68984e5b04), Tripadvisor's one bar, one button card (https://mobbin.com/screens/c96b10a3-7058-447e-a2b2-a5df034982fb), Clue's countdown (https://mobbin.com/screens/4109e86e-82be-4437-8709-fa3f54efcdda), GoHenry's done and to do bar (https://mobbin.com/screens/8c96f881-62da-4f5f-842d-0325a3e06555).

---

## 3. The build, in eight small pull requests

**Order: PR 1, PR 1b, PR 6, PR 2, PR 3, PR 3b, PR 4, PR 5**, each small enough to merge the same day, so the first real stamp never lands on a dead end. Items marked (wave two) wait, and so do the record regroup, `RecordHashOpen`, the bar growing from `seen_at`, the evening push merge, the Tool of the week and kept rings.

### PR 1: one truth (numbers, storage, the check, the child's book)

**1.2 The stamp is stored, once.** Migration 378 (free: 379 is in open PR 1323, 380 is merged; check again before the first push), `passport_pages`:
- user_id, child_id (references children, on delete cascade), stage_num, primary key (child_id, stage_num), nullable stamped_at, lessons_done_at_stamp, lessons_total_at_stamp, arrival_pushed_at, check_ready_pushed_at, stamp_pushed_at, celebrated_at, seen_at. Revoke all from anon and authenticated; select to authenticated, all four to service_role; RLS with one select policy on `auth.uid() = user_id`. Every write goes through the service role, `seen_at` and `celebrated_at` through one small route.
- The same migration, on Justin's yes to decision 6: `update scripts set only_on_signal = true where sort_order = 1401`, and `false` for 405. It also renames the `ks2-26` "Social media ready" slide text (1.5).
- It drops the parent insert policy on `stage_passports`; `app/api/parent-lessons/complete` stops writing it and says "finished every Adventure for this stage"; `month-progress.ts` counts `passport_pages`. The backfill reads only `earned_stickers` `stamp-*` rows, never the rule rewritten in SQL; `awardStampIfEarned` on read does the rest.
- `awardStampIfEarned(admin, childId, stageNum)` runs from both check routes, `app/api/quests/lesson-complete`, `app/api/completions`, `app/api/scripts/status` and on read, writing page and sticker together; `lib/stickers/book.ts` calls it instead of inserting stamp keys itself. Every `stamped_at` write uses `.is('stamped_at', null)`; pushes are claimed with `update ... where ... is null returning`.
- `isStageStamped(progress, passed, n, stored)` serves its callers (`app/verify/[code]/page.tsx`, both print pages and the zine, the pathway page, `app/k/[token]/page.tsx`, `book.ts`, `passport-todo.ts`) and replaces the inline copies (verify's `contentComplete` alone, the pathway page's two, `app/api/pathway/attention/route.ts`, `passport-attention.ts`, `lib/digi/brain.ts`), which section "stored" then forbids outside `stamped.ts`.
- `app/api/lessons/complete` drops `school_lesson` (no caller sends it), so only the server marked route passes a school lesson.
- The parent's seal sets `celebrated_at`; the child's moment keys on `earned_stickers.celebrated` (migration 109), so each side plays once.

**1.3 The AI modules leave the stamp's lessons count** (decision 1 of the 8 October lessons plan, forward only). AI counts through the child's eleven school modules tagged `ai`; the parent's become "Your part", in the record. `passportLessons` becomes `path.school`.

**1.4 One number, printed as a count.** `pagePct`: (lessons passed + scripts resolved + check) over (lessons + scripts + 1), scripts leaving out `only_on_signal` (decision 6), printed "7 of 12 done". The hero, the book's ring, catch up chips, PassportPeek, `lib/digi/brain.ts` and `passportOutstanding` read it.

**1.5 The areas count the child's own lessons**, and every user facing "Social media ready" becomes "Social media skills", short "Social skills": `shared/passport-areas.ts`, `lib/content/literacy.ts`, `LiteracyCheckIn.tsx` and its route, Home's area names, `StageAreas.tsx`, the clause label in `agreement-clauses.ts`, the module in `LessonsBrowser.tsx` and social settings, and `ks2-26` by migration.

**1.6 The check asks what the child was taught, marked on the server.** `gatherStageQuizPool(admin, stageId, childId)` draws only from the page's school modules the child passed (choice slides and `assessment.exit_quiz`), misses first; `lib/content/stage-quizzes.ts` and the parent `lessons` table stay on the parent's check. The check opens once every lesson passes, so the pool exists; if short, the run shortens at the same pass share. The route marks answers against the served pool, as `markAnswers` does, returns `stamped`, and opens a retake the next day ("Come back tomorrow and it asks again"). A flagged module's question brings `tellHref` into `KidStageQuiz`: TellBlock under it and on the result, the calm finish, no 🎉, as `LessonPlayer` does; PR 6's Remember page matches.

**1.7 The child's book is safe to hold.** `kidPassport(child)` (new, `lib/kid/kid-passport.ts`) strips help, alert, detail and href, and names sorted stamps by slug, never `concerns.label` ("Something you are sorting together", the stars still climbing; Justin, 2 September). Every page slims: no percent, `PassportPass`, script counts or parent `passLine`, and "Your grown up's part" has no count. An earlier unstamped page reads "Meet Bloop. This page came before yours. It stays open."; a later one "Opens in Year 10". `statusLabel` gets a child set (Stamped, Your page, Earlier, Later), in school years, never `STAGE_AGES`. The child is told "Pass the lessons, then the big check."

**Guards, in wired scripts only.** `scripts/check-passport-pass.mjs` gains tree, number, today, clock, stored, order, day one, member, flag, copy and pace (taking over the unwired `scripts/check-pace.mjs`); `scripts/check-passport-readonly.mjs` checks every child screen named here; `scripts/check-kid-notes.mjs`. Each assertion this work reverses is rewritten in the same PR: the passport pair in `check-lesson-path.mjs` becomes `path.school`, `check-readiness-areas.mjs` rule E stops requiring AI in `passportLessons`, `check-passport-pass.mjs` rules A and C expect "Opens in Year N" and no `PassportPass` on the current page, and rule G retires. `passport-next.ts` and `passport-today.ts` are pure over rows, so fixtures run under `scripts/lib/ts-resolve.mjs`.

### PR 1b (item 1.1): one clock, moved at the passport readers, straight after PR 1

Every writer and `children.stage_id` stay on the birthday, so Right Now, scripts, the family agreement and DiGi do not move. `passportStageFor(child)` (new, in `lib/lessons/school-path.ts`; it is `lessonStageFor`) is read by these passport readers only: the pathway page and its check page, the attention and passport todo routes, both print pages, verify, the child's home, quiz and lessons pages, both check routes, Home, the digest and email cron, `app/api/kid/day`, `app/api/kid/lesson-complete`, `lib/digi/moment.ts`, `IsItWorkingReport.tsx` and `lib/digi/brain.ts`. Section "clock" asserts each reads it, never `stage_id` or `getStageFromAgeBand`; the birthday readers (the 13 and 16 markers, the contract and `agreed_level`, screen minutes, the deal in `lib/pathway/passport-child.ts`) stay.
- The 1 September push: `app/api/cron/age-up` compares `passportStageFor(child, yesterday)` with today, sends only on a forward move, claimed by `arrival_pushed_at`. Copy: "{Kid}'s Year {N} lessons open today." Only when the new page holds a `HEAVY_MODULE_IDS` module: "A few cover harder topics, and you get a note before {Kid} can open each one alone.", opening a list behind login of each heavy lesson and its `headsUpCopy` covers line. Years 3 and 12 get the first sentence only.
- The birthday push drops "stage opens"; at 13 and 16 it carries the Road's line and a tea question, parent only: `ks2-26`'s "Explain to me what the age number on an app is actually for." and `ks4-19`'s "Can you teach me your arrival plan? Explain why the first week decides the feed." Neither is flagged; section "copy" fails if a flagged module's `parent_note` reaches a push body.
- `lib/pathway/pace.ts` ends a stage on 31 August of Year 2, 6, 9 or 11, and its `EXIT_AGE` header says why.

### PR 2: the simple passport page

**The page tree**, each block carrying `data-block`. Header (not counted): "{Kid}'s passport". Then 1 Now and Next, 2 The Road, 3 The Book, 4 The record, folded as it stands. Gone: `NextOnTheApplication`, `PassportToDo`, `StageReadiness`, the foot children list and "Multiple children" line (ChildRail covers it), the founder foot card and the not a member state (the paywall keeps a lapsed parent off this page), and from the Book its label row, "Passport complete" card, cover door button, pager dots and "pages behind you" card. `SocialRoadNova` moves inside the record, and "tree" fails if it renders outside. `PathwayComplete` becomes the hero's all stamped state.

**`StampSeal`** (`components/passport/StampSeal.tsx`, new), lifted from the Book's earned seal (`PassportBook.tsx` 653 to 690): the friend cutout in grayscale, the stage text ink screened over at 0.28, a 3px ring, minus 10 degrees, on the stage pastel. One size prop: 32 on the hero bar, 36 on a Road dot, 84 in the Book, 130 in the overlay. Unstamped, an empty 2px dashed ring in the stage text colour. Section "tree" asserts every stamp renders through it.

**Now and Next, one hero card** (`components/passport/PassportNowNext.tsx`, new), on the stage pastel with `--edge`, `--lift`, `--radius-card`:
- Row 1: the friend plate at 56 (white, 2px friend colour edge), its mood from `CHARACTERS[key].moods` where one exists (thinking while waiting, wave on a first visit or check ready, happy when done or stamped). Beside it the mono eyebrow "Page 3 of 5 · Year 8", the title in Nunito 900 `--text-xl`, "Asking questions", and the one count, "7 of 12 done". No "Explorer" on the hero.
- Row 2: twelve 8px pill segments, 3px gaps, done in `--terracotta`, to do in `--border`, ending in `StampSeal` 32. Mono `--text-xs` captions under the groups, counting only what is unfinished: "SAM 5 OF 9", "YOU DONE", "BIG CHECK".
- Row 3: at most one subline, `--text-sm`, first that applies: `moved` ("Since you last looked: one lesson passed"); a solo Remember check in 14 days ("Remember check on Tuesday: 2 of 3 right first time, a week after the lessons."); warm ups ("Warm ups on earlier lessons: Sam got 3 of the last 4 right first time."), from `starter` first taps on solo runs whose previous module this child passed, three or more in 28 days; the clock notice for 14 days.
- Row 4, under a 1.5px dashed rule: a mono who chip, the step in Nunito 800 `--text-lg`, one how line, one button, always the parent's next counted step ("Start", "Start it together", or "Send it to Sam" as `.btn-outline`). A child's step on the child's app is a mono line above ("Sam: this week's lesson is on Sam's app"); alone, when the parent has nothing counted left, it gets a text button "Give Sam a nudge", once per lesson ("Nudged" after), through the existing nudge route and its quiet hours.
- With no butter button, a text link: "Hear when Sam's page moves. Only when it moves, about once a week." It subscribes with empty slots, so page pushes arrive and the three daily nudges do not.
- Seven text lines at most. Ten states drawn first: first visit (PathwayIntro's one sentence, gone after the first tap), lesson waiting, done for this week, heads up, check ready, Remember due, stamped, all stamped, trial day one, no child app.

**The Next step** (`lib/pathway/passport-next.ts`, new), first that applies, through a week gate lifted from `app/k/[token]/lessons/page.tsx` into `lib/lessons/school-path.ts`:
1. the check is ready
2. this week's lesson, while the week is open; a heavy lesson, waiting or not, is "Read the note first", to `/dashboard/lessons/heads-up?child=&lesson=`
3. the next script, by `eligibleScripts` and `chooseScript` (`lib/pathway/recommend-pick.ts`), so never `only_on_signal`
4. the Remember check, when due
5. an earlier page's lesson, only when this page's lessons are all passed and the week is open; in the 90 days before 13, an unpassed `ks2-26` may come here first, still one a week
6. **Done for this week**: "Nothing to do on Sam's page this week. Next lesson, {title}, opens {weekday}." No button. For seven days after a pass the step is "Ask Sam at tea: {family_question}", how line "Listen for: {listen_for}", from that module's `parent_note`. With no lesson left it names the next dated thing ("Sam's big check opens again tomorrow"). `spokenFor` stays only for the check.

The guard asserts every step raises `pagePct`, is a due Remember check or is a dated wait, and that a shut week's tea line never comes from `SPOKEN.lessons`. Fixture: an open child week and an unresolved script give one button, the script. Motion: still on first paint; blocks fade up with GSAP (y 10, 0.45s, stagger 0.07).

**The Road** is `MiniRoad`, extended, with `showDigi={false}` and a new `pulse` prop, default true so `components/home/DayCheckup.tsx` is unchanged, passed false:
- Dots: earned is `StampSeal` 36; here, white with a 3px butter edge; ahead, cream with an edge. For a child who joined above them, earlier pages read "Before Sam joined, optional" in mono, with no behind look (decision 9). Each dot is a labelled 44px button that turns the book; labels print school years.
- Pins share one grammar, a 20px white pill with `--edge`, filled butter once ticked: HappyIcon `phone` at 14 for Year 6 (ticked by a signed `first-phone` family agreement, else a plain marker), "AI" in mono for the next AI module only (`ks2-23`, `ks3-22`), "13" and "16". Four at most.
- One line under the road, for the next milestone, with one text link: phone to `/dashboard/phone-setup`, AI to that lesson's row, 13 to `SocialRoadNova` in the record.
- The mono eyebrow carries "16 in about 3 years" and the pace line; with no birthday, "Add a birthday to see this".

**The Book** rests on its cover (Justin, 13 September); the cover tap opens the current page, a Road dot or `?open=N` its page. Two 44px arrows and a mono "Page 3 of 5" replace the pager dots. The caption row holds one quiet parent link, never on `readOnly`, beside today's A4 fold line: "Sam's printed passport, £14. Every stamp so far, printed in.", to `/dashboard/keepsakes?child={id}#p-passport_printed`. The current page of both books loses "Work at this stage", `PassportPass`, the next row and CTA; `StageSlots` draws lessons, scripts and the check, fading up instead of its `back.out` pop; the tilt uses `var(--ease)`, no overshoot; the ring prints the count; home rows go to the record. A fresh stamp holds the `openAtStage` flip: the seal plays, dismissing it turns the page, then the after seal line fades up.

**Names, from one helper in `shared/stage-map.ts`:** parents read the page name ("Sam's Asking questions page"), children the friend: "Orbit's page" until `earnedFriends` covers that friend, then "Your Orbit page" (fixture: a Year 7 child on 5 full days never reads "Your Orbit"); "The big Orbit check", "the Orbit stamp". "Explorer" only in mono, parent side. Counts in sentences carry "done". School years, never ages.

### PR 3: the daily loop speaks the passport

**One function.** `passportToday(family)` (new, `lib/pathway/passport-today.ts`) returns per child `{ line, pushLine, moved, next, who }`. `line`: "Sam's Asking questions page: 7 of 12 done. Next for you: {step}." (or "Next for Sam:", "Together:", "Nothing this week, next lesson Sunday."). `moved`: "Since you last looked: one lesson passed" (`seen_at`). `pushLine` turns a heavy title into "a lesson that comes with a note for you first", other `FLAGGED_MODULES` into "this week's lesson", and never names an `only_on_signal` script.

**One place on Home: the daily loop.** The Lesson rung reads `passportNext`, not `school.next`: on a shut week the lesson day leads with a due Remember check, else falls back to connect, and the rung reads "Done this week"; a lesson on the child's app is `clear`, "Sam's turn". The passport rung is the selected child's: the step under 28 characters in Nunito 800, a 26px friend in the 38px plate, the mono note "ASKING QUESTIONS · 7 OF 12 DONE"; a sibling gets a line only with a parent step today ("Mia: a script for you", to `?child=`). It is done by the look on passport day, as now, otherwise by the parent's own step today, and shows the count only when the step is already the day's Script or Lesson rung. Passport day fires when something moved in seven days or a step is due, replacing the five row fallback (`passportOutstanding`). `DigiGreeting` drops "is on stamp N of 5", HomeRows' Passport row is a plain door, streaks never enter `pagePct`.

**Pushes, no new sender.** Every passport push goes through `sendPassportPush(kind, input)` (new, `lib/push/passport-push.ts`), which calls `sendPush` and, when sent, records `{ surface: 'push', item: kind, event: 'sent' }` with the child (both unions in `record.ts` widen). It replaces the direct calls in quests and kid lesson complete, both check routes, parent lessons complete, age up and trial pushes; section "today" asserts no passport push calls `sendPush` directly and every url carries `?child={id}`, `src`, and `?open=N` where it fits.
- A lesson pass lands on the hero, titled "Sam passed a lesson · 8 of 12 done", the body keeping "Ask them at tea: {question}" (never on a flagged lesson) and ending "The next one opens Thursday." once the week shuts. The last lesson's push says the check is ready; the check push says the stamp. Titles 40 characters at most, bodies 110, no emoji or image.
- `runManagementReview` (`lib/ops/management-review.ts`) reports weekly by kind: sent, opened (`src=push_<kind>`), pruned parent endpoints as a share of parents sent to, and the Remember first go rate. Pruned above a share Justin sets (start at 3 percent a week), or a kind opened under 5 percent two weeks running, pauses that kind.
- The monthly child push (`app/api/cron/passport-check`) retires (decision 7). The trial value push and `trialEndingEmail` gain "Sam's Asking questions page: 2 of 9 done already. It stays saved whatever you decide." only when the count is at least 1.
- (Wave two) the evening push carries `pushLine` only when the parent's step is that day's open Script or Lesson rung, so doing it closes the day, keeping PR 1314's hold and `WIND_DOWN`.

**Lapsed.** `/dashboard/upgrade`, where a lapsed parent lands, shows `passportToday`'s line above the price block once anything counted is done: "Sam's Asking questions page: 7 of 12 done. Everything Sam has done stays saved." It builds on PR 1329's `WhatYouKeep` if that merges first; `winBackEmail` gains the same row.

**Email.** The Monday digest only: one row per child in place of the stats Lessons row (the 48px friend from `public/digi-squad/friends/email/`, the page, a two cell bar, "7 OF 12 DONE", the Next as a text link), first when a page moved, with the subject "Sam's page moved: 8 of 12 done". The Sunday review gets one line, "Sam's page: 8 of 12 done".

### PR 3b: the child's screens tell the truth

All from `kidPassport`, naming the grown up through `readCallsGrownUp` (`lib/kid/calls-grown-up.ts`); no child string varies with `subscription_status`. The names helper reaches KidRoad, `KidStageQuiz` (its `stampName` stops reading `READINESS`, now parent only), the quiz and lessons pages, `STAGE_TITLES` in `app/k/[token]/page.tsx`, and the five stamp stickers' names and earn lines in `lib/stickers/catalog.ts` (keys kept).
- **KidPassport's page card** is the child's Now: "Orbit's page", "5 of 9 lessons, then the big check", and while Orbit is still to come, "Orbit comes home in 8 more full days." One Next: "Your Remember check is ready. Three questions, about a minute."; this week's lesson; "This one opens on {day}" with no button; "The big Orbit check is ready"; "Your part is done and saved."
- **The child's half lands the day it is earned.** The check slot inks and the existing celebration plays once: "Your half of the Orbit stamp. Saved for good." The daily line stops naming the grown up's progress after seven days.
- **KidRoad** reads `kidPassport`: one count, "5 of 9 lessons, then the big check", a bar with no percent, the same Next, no button on a shut week, no grayscale friend. "Is yours" only once stamped, naming the page friend, never the buddy. An earlier unstamped stage reads "This page came before yours. It stays open."
- **The pass screen** (LessonPlayer kidMode, fed by `app/k/[token]/lesson/[mission]/page.tsx`): "6 of 9 on your Orbit page", or "All 9 passed. The big Orbit check is ready."; a near miss, "This one counts once you pass it."; "Your grown up just got the good news" becomes "It is on your passport, and on {Mum}'s too." Both "dot on your road" lines go. A flagged module keeps its calm heading and TellBlock.
- **The check result** (`components/kid/KidStageQuiz.tsx`) inks the friend only when `stamped`: "That is the Orbit stamp. The whole page, done." Otherwise: "Big check passed, 4 of 5 right! Your half of the Orbit stamp is saved." `KidLessonList`'s check card waits as `StampSeal`'s empty ring, "After your last lesson", with no padlock or dimming.
- **KidMission's row** (`lib/kid/mission.ts`) is "My passport" in five states: "Lesson ready" (to the lesson), "Next lesson Thursday" (no link), "Big check ready" (to the check), "Your part is done" (no link), "Stamped" (done, from `stamped_at`). Lifetime lesson stickers leave the row for the book. The intro becomes "Every full day adds up: balanced screens, your passport, and a Friend for the days you finish." The tile's friend is in full colour (thinking, then happy once stamped), never grayscale, its label at `--text-xs`.
- Locked lessons look like waiting rows, with no padlock, dimmed friend or money words; only locked left, "The next lesson opens from {Mum}'s app."
- (Wave two) the tile's "N new stickers", the slot filling, inked stamp sticker art, and the child's stamp push, "Your Orbit page is stamped. Come and see it.", skipped in quiet hours.

### PR 4: more protected as 13 and 16 come closer

- **Social progress sits on the Road's 13 line** from Explorer, led by Nova at 24px: "13: most apps say 13. Social media skills: 1 of 3 so far", counting `ks2-26` (Why thirteen) and the Explorer social modules open to this child; its link opens `SocialRoadNova` in the record. Teaching order never changes by area.
- **The AI pin's line** quotes the sourced figure or nothing: "11 percent of AI users aged 8 to 17 have used AI as someone to talk to or as a friend (Ofcom, 2026). One lesson covers it." Source for this and the phone pin: `content/packs/2026-10-09-digi-shorts/research/02-parent-voice-mumsnet-and-uk-data.md`.
- **Marker copy for all three flag states.** `shared/social-media-law.ts` normalises the value to one of three, an unknown one becoming `none` with a server warning, so DiGi, the script ban note and the passport agree. The marker and child tables are pure functions of the flag. Only `BANNED_PLATFORMS` are named; never "banned", never a workaround.

| Flag | 13 | 16 |
|---|---|---|
| none | Most apps say 13. | 16: the Making choices page plans the first week. |
| partial_ban | Most apps say 13. The UK is moving social media to 16. | 16: the UK line for social media, expected from spring 2027 once the rules are made. |
| full_ban_u16 | 13: most messaging apps say 13. Group chats and games are where the practice starts. | 16: the UK line for social media. The Making choices page plans the first week. |

- Under both ban states, one record line: "Already on one of these apps? The plan still works, and the door stays open.", linking `ks3-11`, and script 1403 only under `partial_ban`, since its text says the ban is not in force yet.
- **The first phone pin sits at Year 6**: "Most children have their own phone by 11 (Ofcom, 2026). Talk before secondary school." linking "How to set it up, our way". `components/pathway/PhoneHeadsUp.tsx`, `lib/content/passport.ts` (91) and the phone setup page swap "Around 9 to 10" for "Years 5 and 6" and the sourced line (56 percent at 10, 83 percent at 11).
- **The seal says what was measured:** "{Kid} passed every lesson on this page and the check." With any `done_together` pass on the page: "{Kid} finished every lesson on this page with you, and passed the check." All stamped: "Every page stamped: every lesson passed and every check done." The overlay draws `StampSeal` 130, never a tick, and skips the burst spans under `reduceMotion()`.
- **The child**: `KID_STAGE_DEALS` (`lib/content/readiness.ts`) becomes fully flag aware, all five `later` lines and every `greatNow` chip, describing practice, not outcomes: no account promised, no age number. Builder: "Group chats come further up the road, once your habits are yours." Explorer, none: "If and when accounts come is a family decision. You will have practised the skills first." partial_ban: "Group chats come first, with {Mum}. Social media comes later, and you will have practised how it works." full_ban_u16: "Group chats and games with real friends come first. Social media comes later for everyone your age, and you will have practised most of it." Shaper: "The full phone comes when you and {Mum} agree.", its "First accounts, set up together" chip only under `none`.

docs/11 is named in CLAUDE.md but missing on main. This PR writes the short version: the flag, its states, these tables.

### PR 5: ordering the printed passport, linked to the stamps

- **The first sticker card stays as built** (`components/home/StickerNewsCard.tsx`), once per child and outside the celebration, as Justin decided on 14 September: the first badge points at the printed passport and sticker sheet.
- **The repeat doors, parent only** (`components/shop/MonthlyShopSheet.tsx`, Home's `shop` card in `lib/home/next-up.ts`, the after seal line), show only when a stamp or sticker has landed since this child's last fulfilled passport order (`orders.child_id`, `orders.fulfilled_at`): none while a paid order is unfulfilled or within seven days of the after seal line, and one shop door on Home a day. In the trial the sticker card offers the free A4 fold. This replaces the checkout snapshot and the `?order=` print change.
- **The after seal line follows this child's orders.** Booklet and sheet: "The Orbit stamp is on your sticker sheet. Stick it in." Booklet only: "Orbit's page is waiting in your printed passport." Never ordered: "That page is stamped for good. The printed passport has every stamp so far, and the sticker sheet has all five stamps to add as each one lands.", to `/dashboard/keepsakes?child={id}#p-passport_printed`.
- (Wave two) **The seal overlay moves to GSAP** with a `reduceMotion()` guard.

### PR 6: the Remember check, in the core (lessons hub plan, 6.3)

Built as that plan specifies, before PR 2's stamped state: `lib/kid/remember-due.ts` (new), three questions from the child's own school modules passed, due at 5 to 9 days, 30, then every 90, weekly once the page is all passed, as source `remember` in `childLessonPath`; no stars, no stamp; flagged questions carry the tell route. In the 90 days before 13 it asks `ks2-26`, `ks3-11`, `ks3-13`, `ks3-34`, `ks3-22` (and `ks2-23` once passed) first; before 16, `ks4-19`, `ks3-22`, `ks4-15`. A stamped page's Next is the due check. Fixtures: Builder from September of Year 3 to August of Year 6, a doable Next or dated wait every week and a Road change each term; Years 8 and 11, 60 days before 13 and 16, an AI item first.

(Wave two) the Tool of the week (6.4) and kept rings (6.5): a ring advances only on a right first tap (`lesson_question_answers.first_correct`, migration 366) ninety days after the mission's `completed_at`, not `paid_at` (set on the first finish, pass or fail); only then may the hero say "Still remembered after three months: 3 of 9". Fixture: a wrong answer at day 95 keeps the hero silent.

---

## 4. Decisions for Justin, each with a recommendation

1. **The passport moves with the school year, on 1 September.** Yes: two clocks lock a Year 3 child out of their own check. Only passport readers move.
2. **The parent's AI modules leave the stamp.** Yes, as decision 1 of the lessons plan.
3. **No new push: the page rides the lesson, check and stamp pushes; the evening merge waits for wave two.** Yes; five texts a week raised opt out by 58 percent.
4. **At five stamps, offer a fresh printed passport once.** Yes (wave two): an earlier booklet holds only the stamps it was ordered with.
5. **Check `NEXT_PUBLIC_SOCIAL_MEDIA_LAW` is `partial_ban` on Vercel.** After PR 4 an unset or mistyped value reads as `none` everywhere, DiGi included; a change needs a redeploy.
6. **Never speak first scripts leave the stamp's total.** Yes: they stay in the library, search and Right Now. 1401 (a photo and a money demand) joins them; 405 ("Recognising grooming warning signs") leaves them, being preventative and outside migration 185's own rule.
7. **Retire the monthly child push and PassportToDo's Send button.** Yes: their count disagrees with the child's page, and the mission row says it daily.
8. **Builder's last three lessons open from Year 5.** At one a week a September Year 3 joiner passes all nine by November, so `ks2-23`, `ks2-25` and `ks2-26` (Why thirteen) land at 7 or 8. Yes: the lifted week gate reads the floor, the child's row says "Opens in Year 5", teaching order is untouched.
9. **Earlier pages are optional for a child who joined later.** Yes, and First steps (the under 7 together deck) stops showing from Year 7.

---

## 5. Risks

- **The clock change moves some pages.** The parent sees "{Kid}'s passport now follows the school year, so this is the page their class is on." for 14 days; the child, once, "Everything you earned is still yours." Fixture: Year 9, age 13, no push.
- **The number drops** when four non stamp rows leave it; the record says so once.
- **Push fatigue:** no new sender, the seven night hold, counts by kind and the pruned stop rule.
- **Collisions:** open PRs 1328 and 1329 change `/dashboard/upgrade` (PR 3 builds on 1329's `WhatYouKeep`); PRs 1320 and 1331 have merged, so rebase first.

---

## Panel log

**Rounds 1 and 2, 16 October.** Scores 5 to 6, then 6 to 7.5. Adopted 54 of 56, then all 27 musts (two corrected) and 27 shoulds (four in part): one clock, stored stamps, the check from lessons passed, the child's book stripped, one hero, done for this week, the Remember check in the core, the never speak first gates, counts not percents, doors gated; parents name pages, children friends. Declined: that no code reads the flag, four areas on the hero, a household email button, words on the pins, quoting the first go score.

**Round 3, 16 October.** Parent 8, learning lead 7, child 7, safeguarding 7, SaaS 7.5, design 7.5 (looks 7.5, flow 7), engineer 7.5; all build. All 26 musts checked against origin/main and adopted. The two biggest: the clock moves at the passport readers, as moving `stage_id` would move Right Now and the agreement; and the not a member hero goes, as the paywall keeps a lapsed parent off the page, so the count moves to the upgrade page. 28 of 29 shoulds adopted, some in part, with the SaaS cut. Conflicts: the first sticker door stays as built (Justin, 14 September); the one button is the parent's step; one quiet order link, not a row and a link. Declined: the child's group chat count and birthday milestone, clutter the flag aware deal line covers.
