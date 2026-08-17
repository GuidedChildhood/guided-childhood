# Next up: the first run, the reminders step, and the monthly checks

Written 17 August 2026 at the end of a long session, from Justin's own words, so
the next session starts from the spec rather than from a summary of a summary.
Nothing below is built.

## 1. THE FIRST LOGIN IS SETUP, AND IT BLOCKS

Justin: "the very first on first log in has to be set up and until all ticked it
can not progress."

And the reasoning he arrived at himself, which is the important half:

> "It looks like the check in is just saying done as I guess your logic is there
> is no issues to check? If that's the case then we shouldn't have check in on
> first ever homepage for new people. We should have tell us a moment that
> happened in your household first, maybe the what came up today."

He is right, and it settles an argument this session kept losing. Three separate
faults were fixed to make the day one check in work, and the honest answer is
that a day one check in should not exist. A check in MEASURES MOVEMENT. On the
first morning there is nothing to have moved from, so the best possible version
of it is still asking a parent to rate four worries a stranger picked for them.

So:

- **Day one Home is the Setup Quest and nothing else.** It does not progress
  until all four steps are green.
- **The check in does not appear at all** until there is something to check in
  ON, meaning a moment logged or a worry raised.
- **In its place: "what came up today"**, the moment. That is the right first
  ask because it COLLECTS rather than measures, and everything the product does
  later is built on what it collects.
- The baseline seeding stays: it gives the second day's check in something real
  to open with. It just stops being the thing a parent meets first.

This supersedes "the check in leads every day" from the earlier plans, and it
supersedes the day one baseline framing in
`plans/setup-quest-three-steps.md`.

## 2. THE REMINDERS STEP: A DONE BUTTON, AND A MONTHLY RE-CHECK

Justin: "set up notification should have a button click done then it should also
then trigger marked as done unless there is a way of confirming it is done? It
drops off list on home page so can move on to complete next set up, but run a
monthly check to see if it is still set up working and remind them again to set
it up so to get notifications."

There IS a way of confirming, and it should be preferred over a tap:

- `push_subscriptions` row = the browser granted notifications. Fact.
- `display-mode: standalone` = the app is on a home screen. Fact, and already
  written to `profiles.home_screen_at` by migration 197.

So the order is: take the proof if there is proof; offer the button when there
is not; and never let the button masquerade as proof.

- **Confirmed** (subscription or standalone) → green, drops off, nothing else.
- **Asserted** (they tapped Done) → green, drops off, so setup can finish, but
  recorded as an ASSERTION, in its own column rather than in the same one. It
  needs a migration; the highest number is 201.
- **The monthly check** re-reads the facts. No subscription and no standalone
  open in the last month means the reminders are not actually working, whatever
  was tapped, so it asks once. Once a month, never more, on the same clock
  discipline as the install banner: stamped when SHOWN.

The laptop case Justin also named: "needs to have option for laptop, and there
needs to be a skip button, but say that adding to home screen means you can get
vital notifications. It can't keep coming up again and again."

So the step's copy carries the reason (vital notifications) rather than the
mechanic, offers a laptop path, and Skip is a real answer that ticks the step and
starts the monthly clock.

## 3. THE MONTHLY AGREEMENT REVIEW

Justin: "once a month we will prompt if they need to change it and link them."

`family_agreements.review_date` exists with a three month default, so the data is
there and the surface is not. Same shape as the monthly shop sheet: the popup
lock, a month stamp written when shown, and a link straight into the builder.

## 4. STILL QUEUED BEHIND THOSE

- DiGi learning the family agreement and the check in scores. `family_agreements`
  is read NOWHERE in `lib/digi/`. `lib/digi/wisdom.ts` does read `concern_events`
  including `score_at_start`, which is the "where they started, where they are
  now" story, so half the material exists.
- The DiGi tab always opening on its intro page, then scrolling.
- The back to school email, the founder offer email, and the research email
  chain (see `plans/week-of-2026-08-15-emails-and-home-plan.md`).

## THE LESSON FROM TODAY, WORTH CARRYING

Justin spent the day testing production while every fix sat on an unmerged
branch, and reported things as broken that were already fixed. Only the two
database repairs reached him, because those bypass the deploy.

**Push early, say plainly that a PR is needed, and do not let a branch collect
eight commits before it merges.** CLAUDE.md already says this: "Merge or close
the same day. Long lived branches are the duplication window."

---

## 5. SIGNUP CAN FINISH WITHOUT A CHILD, AND IT IS THE OLD FAULT AGAIN

Justin, 17 August 2026: "we need to make sure they have to add child to go
through sign up process."

He is right, and the ordering in `app/onboarding/page.tsx` is why:

- `onboarding_complete: true` is written at line 304, and again at 323 as a retry.
- The child row is inserted at line 337. **After.**

So anything that interrupts between the two, a failed request, a closed tab, a
reload, leaves a profile that says onboarding is finished with no child on it.
The init guard then sends that parent straight to the dashboard for ever.

This is the SAME fault that deleted the two door payment screen, recorded in
plans/week-of-2026-08-13: "onboarding_complete is written four screens earlier,
so any reload between DiGi's introduction and the final tap deleted the one
screen that asks for money, permanently." The flag was moved for the payment
screen. It was never moved for the child.

THE FIX: write the child FIRST and only set onboarding_complete once the insert
has come back without an error. A parent who gets interrupted then simply lands
back in onboarding, which is the correct outcome and the whole reason the flag
exists.

Three live accounts currently sit in this state, though on this database they are
collateral from deleting the Toon test children rather than proof the race has
fired in the wild. The ordering is a real bug either way.

## 6. A CHILD ADDED FROM SETUP IS NOT QUITE A WHOLE CHILD

Justin: "I thought we had built the ability for everything to run when they add
another child from set up?"

Most of it, and the biggest piece is there: `seedChildBaseline` runs on add
(app/api/quests/route.ts:180), so a sibling gets their own worries and appears at
the next check in. That was the 15 August fix.

What the add route does NOT write, which onboarding and the starter pack do:

- **date_of_birth.** The starter pack collects month and year and writes it. Without
  it `lib/learning/term.ts` cannot say which school year the child is in, so the
  learning sheets cannot be built for them. The setup form does not even ask.
- **daily_limit_minutes.** Onboarding writes it; the add route leaves it null, so
  the screen time guide falls back for that child.

Justin's own instruction points at the fix: "use the same form which is simple to
add other children". Same form means the same QUESTIONS, so the setup step should
ask month and year of birth exactly as signup does, and the route should accept
and write both fields.
