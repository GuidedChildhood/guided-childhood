# Appendix A3: stars, quests, device time, balance and readiness (evidence)

Read only sweep of origin/main 97ef53a on 5 September 2026. Paths relative to repo root. docs/ does not exist on main; design record used instead: THE-STORY.md section 3 pillar 4, plans/week-of-2026-08-26-star-tiers-plan.md, plans/star-economy-weekly-reset-plan.md, plans/passport-readiness-review.md, content/packs/2026-08-26-star-system-evidence/rewards-evidence.md.

## 1. What earns stars

Every earning source lands in one of six tables that getStarBanks sums (lib/quests/bank.ts:118-139): quest_ticks (via family_quests.stars), kid_lesson_missions, parent_lesson_completions, star_bonuses, tutor_lessons, less star_spends.

| Source | Stars | Who approves | Automatic | Evidence |
|---|---|---|---|---|
| Quest or job tick | family_quests.stars, templates default 1 to 5; play and outside pay most (4 to 5), chores 1 to 3 | Parent. Child tick lands pending | No | app/api/quests/tick/route.ts:74-81, app/api/quests/approve/route.ts:153-162; lib/quests/templates.ts:43-75 |
| Family job (is_family_job) | 0, "contribution is belonging, not payment" | Parent approves; counts for streaks only | n/a | lib/quests/bank.ts:145-174, approve/route.ts:76-80 |
| Child pitched quest (quest_requests) | Parent sets stars; max 5 pending, 5 per day | Parent | No | app/api/quests/request/route.ts:11-14,53-84 |
| Star lesson mission (kid_lesson_missions) | default 3, check 1..10 | Counted at status done; kid copy says once your grown up approves | UNKNOWN which route sets done | migrations/034_kid_lesson_missions.sql:16, KidQuestScreen.tsx:2331-2332, bank.ts:210-213 |
| Watch together parent lesson | 10 first completion, plus 2 per redo | Parent side completion API | Yes | app/api/parent-lessons/complete/route.ts:114,129 |
| Tutor lesson | tutor_lessons.stars default 3, paid once on done_at | Parent sends; child finishes | Yes on finish | migrations/188_tutor_lessons.sql:56, bank.ts:228-233 |
| Path chest | 1 per day | None. Needs any tick today not rejected (a pending tick suffices) | Yes | app/api/kid/chest-claim/route.ts:25-35,54-57 |
| Path quiz | 2 per day, server checks 4 of 5 | None | Yes | app/api/kid/quiz-claim/route.ts:13,58-61 |
| Path complete | 3 per day | None | Yes | app/api/kid/path-complete/route.ts:5-11,70-73 |
| Printable | printable.stars default 5, check 0..20 | Parent confirms | No | app/api/kid/printable-done/route.ts:9-10, app/api/printables/confirm/route.ts:181-184 |
| Learning sheet (private tutor) | SHEET_STARS | Parent submits | Yes on submit | app/api/learning/complete/route.ts:73-80 |
| Spot something good | 1 to 5, parent chips | Parent | No | app/api/quests/bonus/route.ts:18-21, components/quests/SpotSomethingGood.tsx:11-18 |
| Jobs streak reward (5 days) | Parent picks kind: printable, device_time, lesson, tutor, other; only device_time pays stars (1..20, default 3) | Parent | No | app/api/quests/streak-reward/route.ts:13,35-41 |
| Fair play week | 1 star per child with timer sessions that week, when the parent's weekly DiGi fair play answer is graded green | Trigger is the parent's disclosure grade | Yes once graded | app/api/digi/literacy-checkin/route.ts:158-185 |
| Paper fridge chart week | Parent types the week's total | Parent | No | app/api/quests/fridge-week/route.ts:6-26,105 |
| Five a day completed day | Not stars: 5 holiday minutes per finished day | None | Yes | lib/quests/holiday-daily.ts:333,355-370 |
| Streaks (completed days) | Not stars: Planet Friends at 2, 10, 22, 38, 58 days | None | Yes | lib/pathway/streak-unlock.ts:41 |
| Unused minutes | Not stars: 30 unused minutes = 1 sticker credit at Monday rollover | None | Yes | lib/quests/star-week.ts:138, app/api/cron/star-week-rollover/route.ts:133-146 |
| Stars above the weekly cap | Banked as holiday minutes, capped at one day's guide per week | None | Yes | star-week-rollover/route.ts:101-131 |
| Parent gift of time | 0 stars, records gift_debts.stars_owed, settled by the next single approved tick | Parent | n/a | app/api/quests/time/parent-start/route.ts:61-65,159-165, approve/route.ts:39-56 |
| Check ins, tell, DiGi, friends, planet | No stars | | | star_bonuses insert sites are only the routes above |

WEEKEND_BONUS_MINUTES = 30 is declared (lib/quests/star-week.ts:147) but no grant site was found: UNKNOWN whether wired.

## 2. What stars convert into

- Minutes. One star = STAR_MINUTES (env NEXT_PUBLIC_STAR_MINUTES, default 5, clamped 1..60) lib/quests/templates.ts:25-28; per child override child_time_settings.star_minutes 1..60 (migration 225) lib/quests/time-tiers.ts:28-33.
- Real world goal. One star_goals row per child (migrations/029_family_quests.sql:46), redeemed from the lifetime balance, app/api/quests/goal/redeem/route.ts:29-46; "One redemption per goal, until the parent sets a new one" :10. A single parent set goal, not a family reward list.
- Non screen streak rewards: kinds printable, device_time, lesson, tutor, other; only device_time is priced in stars.
- Stickers, Friends, shop: sticker book pays restraint and completed days, not stars (lib/stickers/book.ts:12-20); shop charms are real money gated on earned Friends (lib/shop/earned.ts). Stars buy nothing there.
- Copy the child sees: "Jobs earn stars. Every quest gives you stars. One star is worth N minutes of screen time." and "Stars buy screen time. You choose when to use them." KidQuestScreen.tsx:2689-2690. Tick celebration "That is N minutes of screen time earned. Superstar!" :959. Bank line "N minutes ready to use" :1773. Approval push "You earned N stars, that is N minutes of device time to use." approve/route.ts:80. Counterweights: "This app is always free, it never uses your minutes." KidQuestScreen.tsx:1973; rollover push "Screen time you earned and did not use is now yours to keep." star-week-rollover/route.ts:189.

## 3. Baseline allowance and contingency

- Core time exists but defaults to zero: core_minutes_daily int not null default 0 (0..240), "stays off until the parent turns it on" migrations/223_star_time_tiers.sql:15-17,29; time-tiers.ts:20-21. When set it spends first, before stars and holiday minutes (time-tiers.ts:247-278). THE-STORY section 3 pillar 4 describes it as unconditional; in code it is opt in.
- Contingent access: the product is an honour timer, not device control. blocks_screens jobs gate a child's self start only, never an ask or an approved ask (app/api/quests/time/start/route.ts:154-258); ask first trust is default since migration 081; the 1.5x guide brake converts a start into an ask (:178-203).
- Essential access exemptions: none. Homework on a computer session is filed into the learning bucket for reporting only (lib/quests/device-time.ts:60-78); planTieredSpend has no activity exemption.

## 4. Caps, expiry, debt

- Weekly cap = 7 x age daily guide / star rate (lib/quests/star-week.ts:130-135); guides 60/75/90/120/120 minutes for 4-7/8-10/11-13/13-15/16+ (lib/quests/screen-balance.ts:36-42), holiday aware. Cap applied to what was earned that week (bank.ts:252-264).
- Expiry: spendable balance is this star week only, Monday to Monday London, computed not stored (bank.ts:19-34); unused converts to sticker credits; surplus above cap banks to holidays; holiday bank never expires and is spendable only in school holidays (lib/quests/holiday-bank.ts:12-20). Lifetime balance survives only for goals.
- Daily: daily_limit_minutes parent set 15..300 or null (app/api/quests/route.ts:199-207), enforced client side only in the child's card (components/quests/DeviceTimeCard.tsx:176-192); the start route does not read it. Server side brake is the 1.5x guide ask. Parent grants past the guide are tagged treat.
- Negative balance and deductions: not possible. Math.max(0, ...) bank.ts:250,261; star_spends.stars check 1..1000 (047_quest_economy.sql:26); manual spend clamps to balance (spend/route.ts:78); rejecting a tick pays nothing. No route deducts stars for behaviour. Early stop refunds the unused part.
- Debt language: gift_debts.stars_owed exists, but "One job says thanks for one gift, however big either was, because the pay back is a gesture, never a ledger" approve/route.ts:39-42. The parent card sums "owed" stars (time/active/route.ts:66-80).
- Loss spirals: earned stickers permanent (lib/stickers/book.ts:12-14); wins page shows no days missed (KidWins.tsx:28-30); declined ask "Your stars are safe." request/route.ts:134.

## 5. Sleep and bedtime

- Bedtime windows default by band: 19:00, 20:00, 21:00, 22:00 to 07:00; 16+ none (time-tiers.ts:39-45); mealtimes and school hours optional (:47-55).
- Child self start inside a window becomes an ask, never a block (start/route.ts:205-226,238,299-358); child line "Screens are resting now. I know that is disappointing. Morning is coming." time-tiers.ts:119.
- Parent started sessions inside a window run anyway, tagged in_protected_window (parent-start/route.ts:77-98,152). That tag is written but never read anywhere.
- A running session that crosses into bedtime: no cut off found.
- Sleep adjacent tasks that pay screen minutes: "Room tidy before bed", "Teeth brushed, no reminders", "Device on charge downstairs" templates.ts:54,59,61; "Phone charged outside the bedroom" lib/quests/best-jobs.ts:108.

## 6. Disclosure and rewards

- Parent wellbeing and concern check ins pay no stars. The child's sticker book "Sorted together" page stamps when the parent's rating of a worry reaches five stars (KidStickers.tsx:181-190, lib/concerns/sorted.ts:1-25). A sticker, not minutes, keyed off the parent's rating.
- Fair play: 1 star per child hinges on the parent's weekly honesty answer being graded green (literacy-checkin/route.ts:45,158-185).
- Child tell page: scripts to borrow, no reward (app/k/[token]/tell/page.tsx:12-15,117). Ask first requests earn nothing. No child side mood check in exists.

## 7. Sibling comparison

None in the child app: "It never shows a sibling's numbers, never ranks anybody, and never says who is ahead." components/kid/KidWins.tsx:12-18. Parent card lists each child's own balance side by side, no ranking (time/active/route.ts:108-131). DiGi weekly review "their own numbers, nothing compared to anyone else" lib/digi/weekly-review.ts:266.

## 8. Age bands

- Per band: screen guide (above), job load 3 jobs/30 min rising to 6/90 (lib/quests/job-load.ts:50-56), reading 10 to 30 min, social bucket 0 for 4-7 and 8-10.
- Contract wording: under8 "A grown up starts my timer, and screens go off calmly"; 8to10 "Every screen runs through my timer. A grown up says yes first"; 11plus "I start it myself and it winds up at the healthy amount" lib/content/kid-contract.ts:25-27,38.
- Co use: use_mode defaults to coview for 4-7 and 8-10 (app/api/quests/route.ts:160); no_phone flag switches to fridge and parent managed flow (migration 105).
- Tokenised minutes for 4 to 7: yes, the same screens render for every age; "worth N minutes" BalanceToday.tsx:239 and the intro card KidQuestScreen.tsx:2689 have no age branch.
- Teen autonomy: device_trust ask/watch/trusted, parent set; 16+ no bedtime default. No child self set limits or self review. The fade ladder is spec only (plans/week-of-2026-08-26-star-tiers-plan.md phase 3).

## 9. Passport and readiness

- Stamp rule: "the stage's lessons and scripts all done, AND the big check passed by this child" lib/pathway/stamped.ts:19-25. Check: 5 questions from the stage's lessons, pass 4 of 5, "No marks lost for a retry" (lib/content/stage-quizzes.ts:22-23); lessons pass at 70% real choice questions (app/api/kid/lesson-complete/route.ts:15).
- Passport rows: devices, moments, lessons, jobs, balance (lib/pathway/passport-sections.ts:151-220); jobs and balance are kept up rather than ticked off, "Never a lock, just the honest heads up" :69,121-122. Stamp "Deliberately not gated on a four week streak" progress.ts:43-48.
- Stars are not read anywhere in stamped.ts, progress.ts or passport-sections.ts. Readiness is skills and content, not accumulation.

## 10. Never allow or deny

- Rail: lib/digi/system.ts:46,121; verifier flags binary language (lib/digi/safety.ts:40-41,136).
- Ask flow honours it: no stars, protected window, over guide and ask trust all become asks with a parent line, "NEVER A REFUSAL HERE" start/route.ts:283-299; the parent's no is relayed as "Not right now, your stars are safe" request/route.ts:129-134.
- One flat deny remains: a watch or trusted child self starting with an open blocks_screens job gets { error: 'chores first' } 400 and no ask is created (start/route.ts:239-258); child copy "One job comes before screens today. Do that one and this starts." lib/quests/start-errors.ts:36.

## 11. Tables and ledger design

family_quests, quest_ticks (unique quest_id, child_id, tick_date since 206), quest_requests, star_spends (stars 1..1000), star_bonuses (stars 1..20), star_goals, kid_lesson_missions, parent_lesson_completions, tutor_lessons, printable_completions, learning_sheet_results, device_requests, device_sessions (treat, core_minutes, in_protected_window, activity), child_time_settings (core_minutes_daily, bedtime_start/end, protect_mealtimes, protect_school_hours, star_minutes), holiday_allowance, sticker_credits (service role only), earned_stickers, gift_debts, job_streaks, kid_days, kid_links, children (age_band, device_trust, use_mode, no_phone, daily_limit_minutes), stage_quiz_passes, lesson_pass_by, literacy_checkins.

Ledger: append only inserts; balance recomputed on every read, "never trusted from a client" bank.ts:9-10,192-282. Exceptions: the start route deletes its own spend on rollback; fridge week deletes and reinserts that week's rows. Fragile: structured data rides in star_spends.note (request/route.ts:81-86, start/route.ts:95-108).

## 12. Neutral verdict against the external critique

Already holds: cap not bank; no debt, no loss spirals, no confiscation; protected sleep, meal and school windows with ask not block; no sibling comparison; play pays best, family jobs unpaid, rewards on controllable acts; readiness skills based; co use default under 11; child disclosure not rewarded.

Genuine present risks: core time opt in and default 0; minutes are the headline unit on every star surface with one parent set goal as the only non screen sink; school essentials and bedtime routine jobs pay screen minutes and homework on a computer costs stars; one flat deny (chores first); two child rewards keyed off the parent's own reports; 4 to 7 see the same tokenised minutes UI; daily limit client side only; in_protected_window never read; teen self regulation spec only.

Not applicable: uncapped bank, negative balances, penalty deductions; screen rewards attached to food, affection or wellbeing disclosure; routine only versus stars experiment (both modes exist, no measurement).
