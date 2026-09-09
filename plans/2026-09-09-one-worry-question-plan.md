# One worry question, asked in the quiz

Justin, 9 September 2026, on a screenshot of the live `/starter-pack` quiz:
"You said we were changing to 9 here still only 6? Also not happy new design?
Is there a reason this is not latest design, also says start here on several
icons which does not make sense."

He was right on all three, and the cause was that the nine worries landed on
the SETUP screen after sign up (PR 1004, PR 1006) while the public quiz kept
its own older copy of the same question. Asked which way he wanted it, he
chose: **one question, asked in the quiz.** They answer once, before they pay,
and setup shows them what we heard instead of asking again.

## What is true today

Two screens ask the same thing.

- `/starter-pack` Q2 renders `CHALLENGE_OPTIONS` from `lib/content/stages.ts`:
  six options, emoji icons, soft gold cards, and a "Start with this" chip on
  every ticked tile that is not first.
- `/onboarding` challenges renders `WORRIES` from `lib/onboarding/worries.ts`:
  nine worries plus a Something else, drawn icons, ink edge and ledge.
- `OLD_TO_NEW_CHALLENGE` in the wizard translates one into the other, and the
  wizard ALREADY skips its own question when the quiz answered it
  (`prefilled`). So the plumbing for "ask once" exists. Only the question the
  parent actually sees is the old one.

## The move

Make the quiz ask the new question, and let the existing skip do the rest.

1. **`lib/content/stages.ts`** keeps `ChallengeId` exactly as it is. It is not
   the parent's vocabulary any more, it is the CONTENT ROUTING key: every
   stage's `challengeActions` is written against those six, and so are
   `challenge-map`, `recommend` and `daily-tasks`. Widening it would drag all
   of that behind a cosmetic change. `CHALLENGE_OPTIONS` stays too, because
   returning parents have its ids in localStorage and in the database.
2. **New `WORRY_TO_CHALLENGE`** in `lib/onboarding/worries.ts`: worry id to
   `ChallengeId`, so the reveal keeps getting a routing key it has content for
   while the parent only ever sees their own words.
3. **`StarterAnswers` gains `worries?: string[]`**, the exact ticks, most
   pressing first. `challenge` and `concerns` are still written, derived, so
   nothing downstream has to change on the same day.
4. **The quiz Q2** renders `WorryPicker`, with a `primary` prop added for the
   marker. Same nine, same drawn icons, same ink edge and ledge as setup.
5. **"Start with this" goes.** It was a button dressed as a label, repeated on
   every ticked tile. The first one ticked is the one we open on, one pill on
   that tile says so, one line under the grid says it in words. Changing it is
   untick and retick, which is two taps and needs no chrome.
6. **The wizard** reads `worries` first and falls back to the old mapped path,
   so a parent mid funnel with old answers saved still lands right.
7. **`CHALLENGE_TO_CATEGORY`** gains `social_media`, `ai_chatbots` and
   `seen_something`, or the scripts filter silently matches nothing for the
   three worries only the new set can name. `something_else` stays unmapped on
   purpose: a catch all cannot pick a category honestly.

## What must still be true afterwards

- Setup never asks the worry question to a parent who came through the quiz.
- A parent who signs up WITHOUT the quiz still gets asked, unchanged.
- Every tick still becomes a concern row on the first check in
  (`seedBaselineConcerns`), which is what `scripts/check-focus-labels.mjs`
  guards.
- The reveal still names the worry back in the parent's words.
- Old saved answers (six ids) still resolve.

## Checks

`npx tsc --noEmit`, `npm run wiring`, `node scripts/check-focus-labels.mjs`,
the dash grep on the diff, and Playwright at 390 and 1200 through the quiz to
the reveal.
