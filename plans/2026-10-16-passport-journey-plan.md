# The passport journey, simple enough to read in five seconds (version 1)

Justin, 15 October 2026, in short: bring the passport journey up
systematically on the pathway. The daily loop gives a simple update on
progress: what is done, what needs doing. Parents get confidence the child is
actually learning as they get older. Tracking is easy, and so is knowing what
earns the next stamp, with Duolingo simplicity. Use the PWA to update parents
on the child's progress along the pathway. The child is more protected as
social media age gets nearer, and AI education is in it too. It fits what is
already built. The passport view is simple, uncluttered and easy to read:
progress, what to do and how to do it. It links properly with ordering the
passport. Run agents with agents until this is 100 percent.

This plan is built on two code maps run on 15 and 16 October against
origin/main. Every file named below exists.

---

## 0. The test this plan has to pass (the "100 percent")

Each item is checked by a guard or by an observed screen, never by a claim.

| # | The test | Proved by |
|---|---|---|
| T1 | The top of the passport answers three questions in one look: where they are, what is done, what is next. | Screenshot, phone and desktop. Guard: the page renders the Now card and the Next card first. |
| T2 | The one number on the page counts exactly what earns the stamp, and no second percentage disagrees with it. | Guard runs the number and the stamp rule on fixtures. |
| T3 | Every day the parent sees one passport line, either what moved today or the one next step, in a place they already look. It never adds a second new daily push. | Guard: one function writes the line, and every reader imports it. |
| T4 | The child sees their own page and their next sticker each day, in the child's words, with nothing written for the parent. | Guard (the 13 October rule that nothing for the parent reaches the child). |
| T5 | The page and the lessons follow one clock, the school year. | Guard: every passport reader calls `lessonStageFor`. |
| T6 | A stamp once earned stays earned, and a printed booklet shows the same stamps it was ordered with. | Migration plus guard: stamped reads the stored row first. |
| T7 | As 13 and 16 come closer, the passport makes social media readiness and AI literacy visible, and the next step is the protective one. The copy follows `social_media_law`. | Fixtures at Years 6, 8 and 10. |
| T8 | The printed passport is offered at the moment a stamp lands, and the print file reads the stored stamps. | Guard plus screenshot. |
| T9 | Simple: no more than five top level blocks on the passport page, and a new reader can name the next step in five seconds. | Count in the guard. Five second read by the panel's parent lens on a screenshot. |
| T10 | The philosophy holds: never allow or deny, evidence or silence. "Learning" is claimed only from what we measure: lessons passed at 70 percent, checks passed, and lessons still remembered at ninety days. Nothing ever says a child is safe. | Copy guard plus ai-tells. |

---

## 1. What exists, and the five things wrong with it

**Already built, and kept:**
- The five stages and Planet Friend stamps (`shared/stage-map.ts`).
- The one lesson count (`lib/pathway/lesson-path.ts`).
- The stamp rule (`lib/pathway/stamped.ts`): content complete AND the child's stage check.
- The five row passport (`lib/pathway/passport-sections.ts`).
- What earns a pass (`lib/pathway/passport-pass.ts`).
- The flip book (`components/passport/PassportBook.tsx`).
- The catch up line, which already says "N things left on {stage}. Start with {label}." (`lib/pathway/passport-todo.ts:204`).
- Home's PassportPeek with one reason a day (`lib/pathway/passport-attention.ts`).
- The evening push, the only daily per parent push (`lib/push/evening.ts`).
- The weekly digest (`weeklyDigestEmail`).
- The child's "My passport" tile and book.
- The printed £14 A6 booklet: ordered from keepsakes, fulfilled by hand, with the print file at `keepsakes/passport-print`.
- The age up cron.

**The five things wrong:**
1. **The page says "next" in six places, with three percentages.** The header ring averages five rows, but two of those rows (moments and balance) are not part of the stamp. The catch up chips use `overallPct`. The pass bars use a third count. There are about 13 top level blocks.
2. **Stamps are not stored.** The stamp is worked out again on every view. Add a module to a key stage and a page we told the family was "stamped for good" quietly loses its stamp, and so does a booklet already printed.
3. **Two clocks.** The passport page moves on the birthday (`children.stage_id`, `getStageFromAgeBand`). Lessons move on the school year (`lessonStageFor`, decided 9 October). A Year 8 child who turns 13 sits on the Shaper page, counted against KS4 lessons they cannot open.
4. **The parts disagree on which lessons count.** The stamp counts school modules plus the parent's AI modules. The child cannot open the AI modules. The areas, the stage check questions and the social road read the parent library. So "the check draws on what they learned" is not true of what the child actually did.
5. **The age milestones are missing from the passport.** Nothing marks first phone, 13 or 16. The social media cards live only on Home, `SocialRoadNova` is bolted on below the book, and nothing on the passport reads `social_media_law`.

---

## 2. The design in one paragraph

One passport, one answer. At the top, a **Now** card like Duolingo's unit header. It shows the stage, the stamp with its Planet Friend, and one bar split into done and to do, with a legend in GoHenry's way. Under it, a **Next** card like Duolingo's popover: one step, who does it (You, {Kid} or Together), one button. Then the **Road**: five stamps in a line, with the age milestones on it and a countdown to sixteen in Clue's way ("Ready at sixteen: about 3 years"). Then the **Book**, unchanged in spirit. Then **The record**, folded. Five blocks. Home, the evening push, the weekly email and the child's tile all read the same Now and Next from one function, so the daily update is the passport speaking, never a new system.

References pulled from Mobbin on 15 October:
- Duolingo's path and unit header: https://mobbin.com/screens/fd077091-e8e9-413f-9aff-bb68984e5b04
- Clue's weeks until countdown: https://mobbin.com/screens/4109e86e-82be-4437-8709-fa3f54efcdda
- GoHenry's done and to do bar: https://mobbin.com/screens/8c96f881-62da-4f5f-842d-0325a3e06555
- Greenlight's level card: https://mobbin.com/screens/c7930268-5663-4943-b06c-867b37a7cd01

They are translated into butter, ink and Nunito, never copied.

---

## 3. The build, in five pull requests

### PR 1: one truth (numbers and storage, almost no visible change)

**1.1 One clock.** The passport's current page is `lessonStageFor(child)`, the school year, everywhere:
- `lib/pathway/progress.ts`: the current stage
- `app/(dashboard)/dashboard/pathway/page.tsx`
- `app/k/[token]/page.tsx`: replace `getStageFromAgeBand`
- `passport-sections.ts`, `passport-attention.ts` and `journey.ts`
- `pace.ts`: the stage now ends on 31 August of Year 2, 6, 9 or 11, not on a birthday, and `paceLine` says "by the end of Year 9"
- `app/api/cron/age-up`: the "new stage opens" push moves to the first school day of September, keyed per child per stage so it fires once

**1.2 The stamp is stored.** Migration 378, `passport_pages`:
- Columns: child_id, stage_num, stamped_at, lessons_done_at_stamp, lessons_total_at_stamp, check_ready_pushed_at and stamp_pushed_at.
- RLS: the parent reads their own children. The service role writes.
- One writer, `awardStampIfEarned(admin, childId, stageNum)`, called from both stage check routes and from the lesson complete route when it finishes the last item.
- `isStageStamped` reads the stored row first. A stored stamp is never removed.
- The migration number is re-checked against main and every open PR right before the first push (memory: migration number re-check).

**1.3 The AI modules leave the stamp's lessons count.** This is decision 1 of the 8 October lessons plan, recommended there and covered by "go build as recommended". It applies forward only, which 1.2 makes safe.
- AI literacy counts through the child's own school AI modules (`shared/passport-areas.ts` `SCHOOL_MODULE_AREA`, nine modules tagged `ai`).
- The parent's AI modules move to "Your part" on the passport, the grown up's own learning, shown and never blocking.
- `passportLessons` becomes `path.school`, one edit as its comment promises.

**1.4 One number.** The ring equals the stamp's progress: (lessons passed + scripts resolved + the check) over (lessons + scripts + 1).
- The catch up chips, PassportPeek and the Now card all read it from one function, `pagePct(progress, checkPassed)`.
- The five rows stay as the work of the page but carry no percentage of their own.

**1.5 The areas count the child's own lessons.** On the child's book and the parent's book, the four area counts read the child's school passes through `SCHOOL_MODULE_AREA`. The parent library keeps its own counts on the parent's lessons page only.

**Guards:** `check-passport-truth.mjs` (new) covers one clock, stored first, one number, and the areas from school modules, all on fixtures. `check-passport-pass` and `check-readiness-areas` are updated to the new rules.

### PR 2: the simple passport page

**The Now card**, new, `components/passport/PassportNow.tsx`:
- The eyebrow is "{Kid} · Year 8".
- The title is the page name ("Asking questions"), with Orbit's existing stamp art.
- One bar in three colours: lessons, scripts, the check. The legend reads "7 done · 5 to do".
- When there is something to show, a measured learning line: "4 lessons still remembered after ninety days" (the kept rings from `lesson-path.ts`).

**The Next card**, new, `components/passport/PassportNext.tsx`:
- One step and one button, with who does it: You, {Kid} or Together.
- It comes from the new `lib/pathway/passport-next.ts`, which merges the ordering of `NextOnTheApplication`, `PassportToDo`, `catchUpLine` and `StageReadiness`.
- The order, most urgent first:
  1. the check is ready
  2. this week's lesson is waiting, or waiting on the heads up
  3. the next script
  4. the next device to set up
  5. moments to resolve
- "How to do it" is one line under the step, taken from the same help text the book's next row already uses.

**The Road**, `components/passport/PassportRoad.tsx`, rebuilt from the dead `KidRoad` code where its art helps:
- Five stamps in a line, the current one lit.
- Milestones: "First phone talk" (Builder), "13: most apps' minimum age" (Explorer), and "16: the UK line" (Shaper), with that copy from `social_media_law`.
- The countdown: "Ready at sixteen: about 3 years".

**The Book** stays. Its current page drops the blocks the Now and Next cards replace.

**The record**, folded: IsItWorking, FiveADay, evidence, Balance, StrandCards.

**Removed from the top of the page**, all merged into Now and Next: `NextOnTheApplication`, `PassportToDo`, `StageReadiness`, the pace line (it moves into Now), and `PathwayIntro` (it moves into the record).

**Order the printed passport** stays in one place, the stamped page of the book and the stamp celebration (see PR 5).

**The h1** reads "{Kid}'s passport", with "Road to sixteen" as the subtitle (the 15 October naming decision).

### PR 3: the daily loop speaks the passport

**One line.** `passportToday(child)` in `lib/pathway/passport-today.ts` returns `{ line, moved, next }`, where:
- `line` reads "{Kid}'s Asking questions page: 7 of 12. Next: {step}."
- `moved` reads "Today: one lesson passed" when something counted today, otherwise null.

It is read in four places, with no new card:
- **DigiGreeting** replaces the static "is on stamp N of 5" with the line.
- **PassportPeek** gains a fourth, quiet reason, `today`, when nothing urgent stands. The first check in gate and "Not now" are kept.
- **HomeRows' Passport row** shows the same line.
- **TodayPathBig's finished state** reads "Today moved {kid}'s page to 8 of 12" in place of "See what it moved".

**The evening push**, `lib/push/evening.ts`:
- When `moved` is set, the passport line rides inside the existing push.
- When it is not, and the next step is the parent's own, it rides there instead.
- This is never a second daily push.

**Two event pushes, each once per page**, recorded on `passport_pages`:
- "{Kid}'s Asking questions page is ready for its check" (`check_ready_pushed_at`).
- "{Kid} earned the Orbit stamp" (`stamp_pushed_at`), which links to the stamp moment and its order card.
- The existing stage check push merges into the stamp push when the check is what completes it, so there is one buzz, not two.

**The weekly digest email** gains a passport block: what moved this week, the page count, and the one next step.

**The child**:
- The "My passport" tile line becomes "Next sticker: {child words}".
- KidFiveADay's mission line names the page in the child's words: "Your Orbit page: 7 of 12".
- The child gets one push per page, when the stamp lands, never at night (quiet hours already enforce that).
- The monthly passport note stays as it is.

**Caps:** at most one passport push a day per parent, enforced in `passportToday`'s push helper, and none before the first check in.

### PR 4: more protected as the social media age comes closer

From the Explorer page (Year 7 on):
- **The Now card leads with the Social media ready area.** It counts the child's school modules tagged `social`, "3 of 7", and the Next card prefers a social module when two are equal.
- **The Road's 13 and 16 markers explain themselves in one line each.** The copy follows `social_media_law`: "Most apps say 13. The UK is moving to 16." or "The UK line is 16, and this page is the plan for it." Never "banned", never allow or deny.
- **`SocialRoadNova` folds into the book's Explorer and Shaper pages** as their social strand. It is no longer a separate block.
- **The first phone marker on Builder links to the existing `PhoneHeadsUp` content.** That content stays on Home too.
- **The AI area shows on every page from Foundation**, counted from the child's own school AI modules.
- **The heavy lessons heads up** (13 October) already protects the six hardest. The Next card shows the heads up state ("Read the note") when it applies.

docs/11 is named in CLAUDE.md but does not exist on main. This PR writes the short version of it, the flag, its three states and what each surface says, so the next session can find it.

### PR 5: ordering the printed passport, linked to the stamps

- **The stamp celebration and the stamped book page carry one order card.** It reads "Put the Orbit stamp on paper: the printed passport, £14", and goes to `/dashboard/keepsakes#p-passport_printed` with the child preselected.
- **The print file reads `passport_pages.stamped_at`.** The order line already records the passport code, so the booklet always matches the stamps stored at checkout.
- **Before any stamp, the order card is never shown.** The free A4 fold at home stays in the record.
- **The founder's order board shows the stamps stored on each order.**

---

## 4. Decisions for Justin, each with a recommendation

1. **The passport page moves with the school year, on 1 September, not on the birthday.** Recommended: yes. Lessons already moved that way on 9 October, and two clocks is how a Year 8 child lands on KS4.
2. **The parent's AI modules leave the stamp's lessons count, and AI literacy counts through the child's own school AI modules.** Recommended: yes. This was decision 1 of the lessons plan, already "go build as recommended". The child cannot open the parent's modules, so a stamp that needs them is a stamp the child cannot earn alone.
3. **No new daily push. The passport line rides the evening push you already get, and there are only two passport event pushes per page: check ready and stamp earned.** Recommended: yes. The research behind the school window pushes found five texts a week raised opt out by 58 percent.

---

## 5. Risks

- **Changing the clock moves some children's current page.** A child on the birthday page who is a year behind on school stages will see their page change. The plan shows a one time line: "{Kid}'s passport now follows the school year, so this is the page their class is on." Stored stamps stay.
- **The number changes.** The ring drops when the moments and balance rows leave it. Say so once on the page, in the record.
- **Push fatigue.** This is held by the one per day cap and the no new daily push rule.
- **Scope.** Five PRs. PR 1 and PR 3 are the core of Justin's ask. PR 2 is the visible win. PR 4 and PR 5 are small once PR 1 has landed.
