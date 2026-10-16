# The passport journey, simple enough to read in five seconds (version 3)

Justin, 15 October 2026, in short: the passport journey, systematically on the
pathway. The daily loop says what is done and what to do. Parents see the child
is actually learning as they get older, and what earns each stamp, with
Duolingo simplicity. The PWA updates parents. The child is more protected near
13 and 16, with AI education in it. Simple, uncluttered, fits what is built, and
linked to ordering the printed passport. Until it is 100 percent.

Every existing file named below exists; new files say (new).

---

## 0. The test this plan has to pass (the "100 percent")

Each item is proved by a guard section in a script CI already runs (PR 1,
Guards) or by an observed screen, never by a claim.

| # | The test | Proved by |
|---|---|---|
| T1 | The top of the passport answers where they are, what is done and what is next, in one look. | Screenshots, phone and desktop. Section "tree". |
| T2 | One number counts exactly what earns the stamp, printed "7 of 12 done", never a percent. The legend splits it by who. The child sees only their lessons and the check. | Section "number", on fixtures, child book included. |
| T3 | Every day each child has one passport line in the daily loop, riding pushes that already fire, and a calm "done for this week" while the next lesson waits. | Section "today": one writer, one Home reader, two children, a pass three days ago, a stamped page. |
| T4 | Nothing written for the parent (text, link, price, a worry in their words) reaches the child's device. | `check-passport-readonly` (keepsakes, `/api/social-road`, `£`, `/dashboard`, seal copy, `concerns.label`, "stamp earned", "stamp is yours"); `check-kid-notes`. |
| T5 | Page, lessons and check follow the school year; 13 and 16, the contract and screen minutes follow the birthday. | Section "clock", over the file list in 1.1. |
| T6 | A stamp once earned stays earned, and there is one stored stamp. | Section "stored": no stamp decision outside `stamped.ts`, no `stage_passports` writer. |
| T7 | Near 13 and 16, social media and AI skills show and come back first; copy follows all three `social_media_law` states. No `FLAGGED_MODULES` title or `only_on_signal` script on a lock screen, in a preheader or as a Next. | Fixtures at Years 3, 6, 8 and 11 under each flag; all 17 `FLAGGED_MODULES` through `pushLine`. |
| T8 | The printed passport is offered after the stamp moment, never inside it, never to the child, never with nothing new to print. | Section "order". |
| T9 | Five blocks at most, no two butter buttons above the record, the next step named in five seconds. | Section "tree" counts `data-block`; parent lens on a screenshot. |
| T10 | Never allow or deny. Learning is claimed only from what is recorded: lessons passed at 70 percent, warm ups right first time, the check marked on the server; "remembered after ninety days" only once `remember` rows exist. Never says {Kid} is ready or safe. | Copy guard ("is safe", "ready at 13", "ready at 16", "Social media ready", "AI friend", retired seal phrases; the page name allowed), `npm run ai-tells`. |
| T11 | A family in the trial, or lapsed, gets a step it can finish and is told plainly what membership opens. | Sections "day one" and "member". |

---

## 1. What exists, and what is wrong with it

**Already built, and kept:** stages and stamps (`shared/stage-map.ts`); one lesson count with `school.next` and `keptRings` (`lib/pathway/lesson-path.ts`); the stamp rule (`lib/pathway/stamped.ts`); one school lesson a week (`newMissionAllowed`, `lib/lessons/school-path.ts`); five rows (`lib/pathway/passport-sections.ts`); the flip book (`components/pathway/PassportBook.tsx`), the child's book (`components/kid/KidPassport.tsx`), `MiniRoad` (`components/pathway/StageRoad.tsx`), the child's road (`components/kid/KidRoad.tsx`); `spokenFor` (`lib/pathway/passport-todo.ts`); the daily rung (`lib/pathway/daily-tasks.ts`); the lesson, check and evening pushes (`lib/push/evening.ts`, held after seven quiet nights since PR 1314); two weekly emails (`lib/email/templates.ts`); the heavy heads up (`lib/lessons/heavy.ts`); the never speak first gates `scripts.only_on_signal` (migration 185) and `FLAGGED_MODULES` (17 `dsl` modules); the £14 booklet and £4 sticker sheet, never sold inside the celebration (31 July); `stage_arrivals` (migration 218) and `surface_events` (migration 238, `lib/events/record.ts`).

**Not built:** the Remember check, items 6.3 to 6.5 of `plans/2026-10-08-lessons-hub-plan.md`.

**What is wrong:**
1. **"Next" in six places, three percentages, about 13 blocks.**
2. **Two stamps, neither safe.** The computed one vanishes when a module is added; the stored one, `stage_passports` (migration 049), is written by `app/api/parent-lessons/complete` on another rule and counted by `lib/email/month-progress.ts`.
3. **Two clocks.** Page and check move on the birthday, lessons on the school year.
4. **The check tests the wrong lessons, scored by the client** (`body.correct`).
5. **The next lesson bounces six days in seven**, since `school.next` ignores the weekly gate.
6. **The child is told what is not true or not theirs:** "stamp earned" before the parent's part, a pass screen pointing at a gone road, "Done" on the mission row too early, KidRoad promising accounts, worry stamps in the parent's own words.
7. **No age milestones**, and nothing on the passport reads the flag.

---

## 2. The design in one paragraph

One passport, four blocks. **Now and Next**, one hero card like a Duolingo unit header joined to its button: the page, the friend stamp, one bar split by who, the one step, and most days an honest "done for this week". The **Road**, the existing MiniRoad with the age milestones; tapping a stamp turns the book. The **Book**, the book and one quiet order row. **The record**, folded. Home, pushes, emails and the child's screens read one function, so the daily update is the passport speaking.

Mobbin references, translated into butter, ink and Nunito: Duolingo's unit header (https://mobbin.com/screens/fd077091-e8e9-413f-9aff-bb68984e5b04), Tripadvisor's one bar, one button card (https://mobbin.com/screens/c96b10a3-7058-447e-a2b2-a5df034982fb), Clue's countdown (https://mobbin.com/screens/4109e86e-82be-4437-8709-fa3f54efcdda), GoHenry's done and to do bar (https://mobbin.com/screens/8c96f881-62da-4f5f-842d-0325a3e06555).

---

## 3. The build, in six pull requests

**Order: PR 1, PR 6, PR 2, PR 3, PR 4, PR 5**, so the first real stamp never lands on a dead end. Items marked (wave two) wait.

### PR 1: one truth (numbers, clock, storage, the child's book)

**1.1 One clock, moved at the writers.** Every `children.stage_id` writer uses `lessonStageFor`: `app/api/cron/age-up/route.ts`, `app/(dashboard)/dashboard/settings/page.tsx`, `app/onboarding/page.tsx` (382, 386, 406), `app/api/quests/route.ts` (197) and `lib/starter/finish-setup.ts` (146, the `/starter-pack` signup). The cron moves `age_band` on the birthday and `stage_id` on 1 September.
- The cron claims the September push (`where stage_id = old returning`) and sends it only on a forward move, never on the switch over run; a backward move writes `stage_arrivals` silently. Copy: "{Kid}'s Year {N} lessons open today. A few cover harder topics, and each one sends you a note first." It opens a list behind login of each heavy lesson and its `headsUpCopy` covers line.
- The birthday push drops "stage opens"; at 13 and 16 it carries the Road's line and the `say_this` of the lesson PR 6 brings back, parent only.
- Readers moved, Home first: `app/(dashboard)/dashboard/page.tsx` (525, 685, 719, 825), `app/k/[token]/quiz/page.tsx`, `app/api/kid/stage-quiz/route.ts`, `app/k/[token]/lessons/page.tsx`, `app/(dashboard)/dashboard/pathway/check/page.tsx`, `app/k/[token]/page.tsx` (430), `app/api/email/digest/route.ts` (99), `lib/digi/moment.ts`, `app/api/kid/lesson-complete/route.ts` (54), `app/api/kid/day/route.ts` (76), `components/pathway/IsItWorkingReport.tsx` (207), `app/api/email/cron/route.ts` (305), `app/api/digi/route.ts` (442). `getStageFromAgeBand` stays only at the birthday readers, each listed in the guard: the 13 and 16 markers, the contract and `agreed_level`, screen minutes, the deal in `lib/pathway/passport-child.ts` (126).
- `lib/pathway/pace.ts` ends a stage on 31 August of Year 2, 6, 9 or 11, and its `EXIT_AGE` header says why.

**1.2 The stamp is stored, once.** Migration 378 (free on main; open PRs hold 379 and 380, so check again before the first push), `passport_pages`:
- user_id, child_id (references children, on delete cascade), stage_num, primary key (child_id, stage_num), nullable stamped_at, lessons_done_at_stamp, lessons_total_at_stamp, check_ready_pushed_at, stamp_pushed_at, celebrated_at, seen_at. Revoke all from anon and authenticated first (as 354 and 360 do), then select to the owner.
- It drops the parent insert policy on `stage_passports`; `app/api/parent-lessons/complete` stops writing it and says "finished every Adventure for this stage"; `month-progress.ts` counts `passport_pages`. Old rows are not backfilled: a different rule.
- `awardStampIfEarned(admin, childId, stageNum)` runs from both check routes, `app/api/quests/lesson-complete`, `app/api/completions`, `app/api/scripts/status` and on read, writing page and sticker together; pushes claimed with `update ... where ... is null returning`.
- `isStageStamped` gains a `stored` set for every caller: `app/verify/[code]/page.tsx` (120), both print pages, the pathway page (191, 382), `app/k/[token]/page.tsx`, `lib/stickers/book.ts`, `passport-todo.ts`, `passport-attention.ts`, `app/api/pathway/attention/route.ts` (52), `lib/digi/brain.ts` (397). Never removed; backfilled in SQL from computed stamps and the `stamp-*` sticker rows.
- The parent's seal sets `celebrated_at` through a small service role route; the child's moment keys on `earned_stickers.celebrated` (migration 109), so each side plays once.

**1.3 The AI modules leave the stamp's lessons count** (decision 1 of the 8 October lessons plan, forward only). AI counts through the child's eleven school modules tagged `ai`; the parent's become "Your part", in the record. `passportLessons` becomes `path.school`.

**1.4 One number, printed as a count.** `pagePct`: (lessons passed + scripts resolved + check) over (lessons + scripts + 1), scripts leaving out `only_on_signal` (decision 6), printed "7 of 12 done". The hero, the book's ring, catch up chips, PassportPeek, `lib/digi/brain.ts` and `passportOutstanding` read it.

**1.5 The areas count the child's own lessons**, and `AREAS.social` (`shared/passport-areas.ts`) and `LITERACY_AREAS.social` (`lib/content/literacy.ts`) become "Social media skills", short "Social skills", on both sides.

**1.6 The check asks what the child was taught, marked on the server.** `gatherStageQuizPool(admin, stageId, childId)` draws from the page's modules the child passed, first try misses first, the parent library as the floor. The route marks answers against the served pool, as `markAnswers` does, and returns `stamped`. A retake after a miss opens the next day ("Come back tomorrow and it asks again").

**1.7 The child's book is safe to hold.** `kidPassport(child)` (new, `lib/kid/kid-passport.ts`) strips help, alert, detail and href, and names sorted stamps by slug, never `concerns.label`: the parent's own words become "Something you are sorting together", the stars still climbing (Justin, 2 September). The current page slims on `readOnly` too: page card, friend, a ring of lessons and the check, and "Your grown up's part" with no count. `passLine` says "Opens in Year 7", not `OPENS_AT` ages, and tells the child "Pass the lessons, then the big check."

**Guards, in wired scripts only.** `scripts/check-passport-pass.mjs` gains tree, number, today, clock, stored, order, day one, member and pace (taking over the unwired `scripts/check-pace.mjs`); `scripts/check-passport-readonly.mjs` checks every occurrence on every child screen named here; `scripts/check-kid-notes.mjs`. `passport-next.ts` and `passport-today.ts` are pure over rows, so fixtures run under `scripts/lib/ts-resolve.mjs`.

### PR 2: the simple passport page

**The page tree**, each block carrying `data-block`. Header (not counted): "{Kid}'s passport", "Road to sixteen". Then 1 Now and Next, 2 The Road, 3 The Book, 4 The record. Foot, unpaid only: the founder card reading `getFounderCount` (`lib/stripe`), £7.99 while places remain, then £12.99 a month or £99 a year. Gone: `NextOnTheApplication`, `PassportToDo`, `StageReadiness`, the foot children list and "Multiple children" line (ChildRail covers it), and from the Book its label row, "Passport complete" card, cover door button and "pages behind you" card. `PathwayComplete` becomes the hero's all stamped state.

**Now and Next, one hero card** (`components/passport/PassportNowNext.tsx`, new), on the stage pastel with `--edge`, `--lift`, `--radius-card`:
- The friend at 56px in full colour on a white plate, 2px friend colour edge. Mono eyebrow "Page 3 · Explorer · Year 8"; title in Nunito 900, "Asking questions".
- One bar: lessons, scripts, a check pip, ending in the existing 32px stamp circle (`components/pathway/PassportStamps.tsx`), inked when the page stamps. Legend: "Sam's lessons 5 of 9 · Your scripts 2 of 2 · then the check". A stamped page reads "Kept 3 of 9" from `keptRings`.
- At most one subline: after a pass in the last 28 days, "Sam remembered last week's lesson: 3 of the last 4 warm ups right first time" (`starter` phase `first_correct`, three or more; under half, "{Lesson} took a second go. Those questions come back first in the check."); else the clock notice for 14 days.
- Under a dashed rule: a mono who chip (You, Sam or Together), the step in Nunito 800, one how line, one button by who: "Start", "Start it together", "Send it to Sam", or "It is on Sam's app" and no button. When the bar first moves for an unsubscribed parent, a text button "Hear when Sam's page moves" opens PushPrompt's own flow.

**The Next step** (`lib/pathway/passport-next.ts`, new) names only work the bar counts, first that applies, through a week gate lifted from `app/k/[token]/lessons/page.tsx` into `lib/lessons/school-path.ts`:
1. the check is ready
2. this week's lesson, while the week is open; a heavy lesson, waiting or not, is "Read the note first", to `/dashboard/lessons/heads-up?child=&lesson=`
3. the next script, by `eligibleScripts` and `chooseScript` (`lib/pathway/recommend-pick.ts`), so never `only_on_signal`
4. the Remember check, when due
5. **Done for this week**: "Nothing to do on Sam's page this week. Next lesson, {title}, opens {weekday}." No button; `spokenFor` under it as "Say this at tea".

Not a member: "Your scripts for this page open with membership. Everything Sam has done stays saved.", the `.btn` to `/dashboard/upgrade`; lessons still move one a week. Catch up never leads the hero. The guard asserts every step raises `pagePct` or is a dated wait.

Motion: still on first paint; the bar grows once from its value at `seen_at` (seven days at most), not under reduced motion; the rest fades up with GSAP (y 10, 0.45s, stagger 0.07). Eight states drawn first: first visit, lesson waiting, done for this week, heads up, check ready, stamped, not a member, no child app.

**The Road** is `MiniRoad`, extended, with `showDigi={false}`:
- StageDot gains `earned`: white ground, friend colour edge, the friend at 28px; earlier unstamped pages stay dashed ("Catch up, one lesson a week").
- Each dot is a labelled button with a 44px hit area that turns the book to its page. Labels print school years and may wrap.
- Milestones are 20px pins, filled once ticked: HappyIcon `phone` at Year 6, `ask` for AI that acts like a friend (`ks2-23`, `ks3-22`, from the child's pass), and 13 and 16 as numerals in an ink pill. Words only in the one line under the road, for the next milestone.
- The mono eyebrow carries "16 in about 3 years" and the pace line; with no birthday, "Add a birthday to see this".

**The Book**: the book, its arrows and caption, one flat order row. On the current page of both books, no "Work at this stage", `PassportPass`, next row or CTA; `StageSlots` draws lessons, scripts and the check only, the ring prints the count, and the home rows go to the record. A fresh stamp holds the `openAtStage` flip: the seal plays, dismissing it turns the page, then the after seal line fades up.

**Names, from one helper in `shared/stage-map.ts`:** parents read the page name ("Sam's Asking questions page"), children the friend ("Your Orbit page"); "Explorer" only in mono. Counts in sentences carry "done". School years, never ages.

**The record**, folded, opened on a hash by `components/passport/RecordHashOpen.tsx` (new), under three mono subheads: This week (IsItWorking, FiveADay, evidence); Helps at home (Balance, StrandCards, devices, moments, home rows); Your part and why ("For your family right now", Your part, `PathwayIntro`, Manage children, why the number changed).

### PR 3: the daily loop speaks the passport

**One function.** `passportToday(family)` (new, `lib/pathway/passport-today.ts`) returns per child `{ line, pushLine, moved, next, who }`. `line`: "Sam's Asking questions page: 7 of 12 done. Next for you: {step}." (or "Next for Sam:", "Together:", "Nothing this week, next lesson Sunday."). `moved`: "Since you last looked: one lesson passed" (`seen_at`). `pushLine` turns a heavy title into "a lesson that comes with a note for you first", other `FLAGGED_MODULES` into "this week's lesson", and never names an `only_on_signal` script.

**One place on Home: the daily loop.** The passport rung belongs to the selected child: the step as its label, under 28 characters; a mono note "Asking questions · 7 of 12 done", then up to two siblings ("Mia: 4 of 10 done, nothing for you this week", with `?child=`). Done: on passport day the look completes it, as now; otherwise the parent's own step done today; a child's step or a shut week is `clear` ("Sam's turn"), never open. When the step is already the day's Script or Lesson rung, it shows the count only. Passport day fires when something moved in seven days or a step is due, replacing the five row fallback (`daily-tasks.ts` 473). `DigiGreeting` drops "is on stamp N of 5", HomeRows' Passport row is a plain door, streaks never enter `pagePct`.

**Pushes, no new sender:**
- Every passport push url carries `?child={id}` (section "today" asserts it), `?open=N` where it fits, and `src`. A lesson pass lands on the hero, titled "Sam passed a lesson · 8 of 12 done", the body ending "The next one opens Thursday." once the week shuts. The last lesson's push says the check is ready; the check push says the stamp.
- The evening push carries `pushLine` only when the step is the parent's and no passport push went that day (`surface_events`, surface `push`, event `sent`), keeping PR 1314's seven night hold, under 110 characters, `WIND_DOWN` untouched. The heads up push never merges.
- A page opened from `src=push_<kind>` writes `opened`; `runManagementReview` (`lib/ops/management-review.ts`) reports opens by kind and parent subscriptions weekly. If subscriptions fall two weeks running, the evening `pushLine` goes first.
- The monthly child push (`app/api/cron/passport-check`) retires (decision 7). The trial value push (`app/api/cron/trial-pushes`) and `trialEndingEmail` gain "Sam's Asking questions page: 2 of 9 done already. It stays saved whatever you decide."

**Email**, in both weekly emails, one row per child in place of the stats table's Lessons row: the friend from `public/digi-squad/friends/email/` at 48px, name and page, a two cell bar, a mono "7 of 12 done", the Next as a text link; the email keeps its one button. When a page moved, the block goes first and the subject says "Sam's page moved: 8 of 12 done".

**The child**, all from `kidPassport`, naming the grown up through `readCallsGrownUp` (`lib/kid/calls-grown-up.ts`):
- KidPassport's page card is the child's Now: "5 of 9 lessons, then the big check". One Next: this week's lesson, "This one opens on {day}" with no button, "The big check is ready", or "Your part is done. {Mum} is finishing theirs, then the stamp lands."
- The pass screen is LessonPlayer's kidMode finish (`shared/components/LessonPlayer.tsx`), fed by `app/k/[token]/lesson/[mission]/page.tsx`: "6 of 9 on your Orbit page", or "All 9 passed. The big check is ready."; a near miss, "This one counts once you pass it." Both "dot on your road" lines go.
- The check result (`components/kid/KidStageQuiz.tsx`) inks the friend only when `stamped`: "That is the Orbit stamp. The whole page, done." Otherwise: "Big check passed, 4 of 5 right! Your part of the Orbit stamp is done. It lands when {Mum} finishes theirs." The "you have got" line goes; KidLessonList's check card matches.
- KidMission's safety row (`lib/kid/mission.ts`) becomes the child's daily passport line, "My passport", done only from `stamped_at`.
- Locked lessons look like waiting rows, with no padlock, dimmed friend or money words; only locked left, "The next lesson opens from {Mum}'s app."
- (Wave two) the tile's "N new stickers", the slot filling, inked stamp sticker art, and the child's stamp push, "Your Orbit page is stamped. Come and see it.", skipped in quiet hours.

### PR 4: more protected as 13 and 16 come closer

- **Social progress sits on the Road's 13 line** from Explorer, led by Nova at 24px: "Social media skills: 1 of 3 on this page", counting `ks2-26` (Why thirteen) and the Explorer social modules open to this child. Teaching order never changes by area; PR 6 brings social lessons back first in the 90 days before 13 and 16.
- **Marker copy for all three flag states.** Only `BANNED_PLATFORMS` are named; never "banned", never a workaround. An unknown flag value reads as `none` and fails the guard.

| Flag | 13 | 16 |
|---|---|---|
| none | Most apps say 13. | Sixteen: the Ready at sixteen page. |
| partial_ban | Most apps say 13. The UK is moving social media to 16. | 16: the UK line for social media, expected from spring 2027 once the rules are made. |
| full_ban_u16 | 13: most messaging apps say 13. Group chats and games are where the practice starts. | 16: the UK line for social media. The Making choices page plans the first week. |

- Under both ban states, one record line: "Already on one of these apps? The plan still works, and the door stays open.", linking `ks3-11` and script 1403, which is never a Next under `full_ban_u16` until its text is updated.
- **The first phone pin sits at Year 6**: "Most children have their own phone by 11 (Ofcom, 2026). Talk before secondary school." `components/pathway/PhoneHeadsUp.tsx` and `lib/content/passport.ts` (91) drop their unsourced "Around 9 to 10". Source: `content/packs/2026-10-09-digi-shorts/research/02-parent-voice-mumsnet-and-uk-data.md` (56 percent at 10, 83 percent at 11).
- **The seal says what was measured:** "{Kid} passed every lesson on this page and the check." All stamped: "Every page stamped: every lesson passed and every check done." The overlay draws the inked friend, not a tick.
- **The child**: one flag aware table feeds the page card and KidRoad: no account promised, no age number, "is yours" only once stamped. Explorer, none: "When your own accounts come is a family decision, and you will have the skills before it does." partial_ban: "Group chats come first, with {Mum}. Social media comes later, and you will already know how it works." full_ban_u16: "Group chats and games with real friends come first. Social media waits for 16, and none of it will be new." Shaper: "The full phone comes when you and {Mum} agree."
- (Wave two) **SocialRoadNova folds into the Explorer and Shaper pages**, parent only.

docs/11 is named in CLAUDE.md but missing on main. This PR writes the short version: the flag, its states, this table.

### PR 5: ordering the printed passport, linked to the stamps

- **The doors, parent only, shown only when this child has a stored stamp on no order** (`passport_pages` against `order_items.personalisation`) and never within seven days of the after seal line: the first sticker card (`components/home/StickerNewsCard.tsx`), the monthly sheet (`components/shop/MonthlyShopSheet.tsx`), Home's `shop` card (`lib/home/next-up.ts`), the Book's row. In the trial or lapsed, the sticker card offers the free A4 fold; the trial's one ask is membership.
- **The after seal line follows this child's orders.** Never ordered: "That page is stamped for good. The printed passport has every stamp so far, and the sticker sheet adds the rest as they come.", to `/dashboard/keepsakes?child={id}#p-passport_printed`. Ordered: "The Orbit stamp is on your sticker sheet. Stick it in.", no link.
- **Checkout snapshots the stamps** into `order_items.personalisation` (`app/api/shop/checkout/route.ts`), and the print file renders from the order when `?order=` is passed.
- (Wave two) **The seal overlay moves to GSAP** with a `reduceMotion()` guard.

### PR 6: the Remember check, in the core (lessons hub plan, 6.3 to 6.5)

Built as that plan specifies (no open PR claims it), before PR 2's stamped state: `lib/kid/remember-due.ts` (new), three questions from modules passed, due at 5 to 9 days, 30, then every 90, weekly once the page is all passed, as source `remember` wired into `childLessonPath`; no stars, no stamp. In the 90 days before 13 it asks `ks2-26`, `ks3-11`, `ks3-13` and `ks3-34` first, before 16 `ks4-19`. Then the Tool of the week (6.4) and kept rings (6.5). A stamped page's Next is the due check or the Tool; only then may the hero say "4 lessons still remembered after ninety days". Fixtures: Year 3, Builder stamped in November, a doable Next in each of the next twelve weeks; Years 8 and 11, 60 days before 13 and 16.

---

## 4. Decisions for Justin, each with a recommendation

1. **The passport moves with the school year, on 1 September.** Yes: two clocks lock a Year 3 child out of their own check.
2. **The parent's AI modules leave the stamp.** Yes, as decision 1 of the lessons plan.
3. **No new push: the page rides the lesson and check pushes, and the evening push only when the step is yours.** Yes; five texts a week raised opt out by 58 percent.
4. **At five stamps, offer a fresh printed passport once.** Yes (wave two): an earlier booklet holds only the stamps it was ordered with.
5. **Check `NEXT_PUBLIC_SOCIAL_MEDIA_LAW` is `partial_ban` on Vercel.** Unset or mistyped shows the `none` copy; a change needs a redeploy.
6. **Never speak first scripts leave the stamp's total.** Yes: `only_on_signal` scripts stay in the library, search and Right Now, and 1401 (a photo and a money demand) joins them. Totals only shrink, so no stamp is lost.
7. **Retire the monthly child push and PassportToDo's Send button.** Yes: their count disagrees with the child's page, and the mission row says it daily.

---

## 5. Risks

- **The clock change moves some pages.** The parent sees "{Kid}'s passport now follows the school year, so this is the page their class is on." for 14 days; the child, once, "Everything you earned is still yours." Fixture: Year 9, age 13, no push.
- **The number drops** when four non stamp rows leave it; the record says so once.
- **Push fatigue:** no new sender, the seven night hold, the weekly count and the stop rule.
- **Collisions:** PR 3 rebases on open PRs 1320 (`daily-tasks.ts`) and 1331 (`templates.ts`).

---

## Panel log

**Round 1, 16 October.** Scores 5 to 6. Adopted 54 of 56: one clock, stored stamps, the check from lessons passed, the child's book stripped, one hero, a counted tree. Declined: that no code reads the flag, and four areas on the hero.

**Round 2, 16 October.** Parent 7.5, learning lead 6, child 6, safeguarding 7, SaaS 7, design 6.5 (looks 7, flow 6), engineer 6.5. All 27 musts checked in the code and adopted, two corrected (`FLAGGED_MODULES` is 17, the eighteenth match a comment; `passport-child.ts` 126 stays a birthday reader); all 27 shoulds adopted, four in part. Landed: done for this week, the rung's done rule, the Remember check in the core, one stored stamp, the never speak first gates, the child's true lines, the Road and Book cut, counts not percents, the member state, pushes counted, doors gated. Conflicts: the Remember check stays in wave one over the SaaS cut, as learning that shows as they grow is Justin's ask; parents name pages, children friends; no dimmed friend; no promised accounts. Declined parts: a household email button, words and lesson ticks on the pins, quoting the first go score. PR 1314 merged today, replacing round 1's "no evening backoff".
