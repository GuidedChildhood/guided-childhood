# One door: the starter pack front, the wizard back, one road between them

Justin, 15 September 2026: *"a yes to one door but the best designed door, so fluid
flows, and as a top expert app would advise."*

## What is wrong today

Two doors into an account, and only one is advertised.

| | `/starter-pack` | `/signup` |
| --- | --- | --- |
| Shape | three questions, a personalised reveal, then email and password at the END | name, email, password FIRST, then a four screen wizard |
| Linked from | every advert, marketing page, site header and email | exactly one place: "New here?" under the login form |
| Asks the time question | yes | no |
| Asks about devices | no | yes |
| Shows the welcome walkthrough | no | yes |
| Writes `onboarding_answers.challenge` as | a ChallengeId | a raw worry id |

So each door leaves a family missing something the other one asks for, and the
two write different vocabularies into the same column. Nothing is visibly broken
today only because two lookup tables were widened to accept both.

**The single line that splits them:** `lib/starter/finish-setup.ts:122` writes
`onboarding_complete: true`, and `app/onboarding/page.tsx:228` bails to the
dashboard the moment it sees that. A starter pack family is marked finished
before they have been asked anything the wizard asks.

## The references (Mobbin, pulled 15 September 2026)

- **Monzo, "Setting up an account"** ([flow](https://mobbin.com/flows/9d51a6c1-b8ae-408b-81d5-35c65e309e27)).
  The one to take. A **section checklist**: "You're halfway there…" over four
  cards, the finished ones greyed with a tick, the current one outlined, the
  rest waiting. Later: "Almost done, last section now…". It turns several
  unrelated chunks into one visible road, which is exactly our problem.
- **YNAB, "Setting up account"** ([flow](https://mobbin.com/flows/dd621846-2646-48f2-bf88-c5a0e6fc31a7)).
  A thin progress bar across every question, one question per screen, a back
  arrow, big friendly heading, emoji led option rows. And interstitial value
  screens between blocks so a long setup does not read as a form.
- **Rocket Money** ([flow](https://mobbin.com/flows/fed2772b-6edd-432f-b195-0691f2d84d04)).
  Personalisation first, name asked late. Confirms the starter pack's order.
- **Snapchat** ([flow](https://mobbin.com/flows/f7cd286e-264f-4d61-8774-44a975af90bc)).
  "Create account, Step 3 of 5" in the header: explicit step counting.

Ours in our own tokens, never a copy: butter and ink, Nunito, chunky buttons,
the ink ledge. The checklist cards wear `var(--edge)` and `var(--lift)`; the
done ones carry the green tick the check in already uses.

## The road

Five stops. A parent coming through the starter pack arrives with the first two
already ticked, which is the good feeling Monzo creates: you open the list and
you are already most of the way.

1. **About your child** — the quiz. Ticked on arrival.
2. **Your account** — just made. Ticked on arrival.
3. **Their birthday** — so the child ages up through the stages. The gap today.
4. **Devices at home** — the gap today.
5. **How it works** — the welcome walkthrough. Starter pack families never see it today.

## The build

Small, because the wizard already knows how to skip what the quiz answered
(`setPrefilled(true)` at `app/onboarding/page.tsx:253`).

1. `lib/starter/finish-setup.ts` — stop writing `onboarding_complete: true`.
   The wizard finishing is what completes setup, for both doors.
2. `app/onboarding/page.tsx`
   - a new first screen, `road`, the Monzo style checklist, shown only when the
     parent arrived with quiz answers. Everyone else keeps the DiGi welcome.
   - write `challenge: challengeFor(challenges[0])` so both doors store a
     ChallengeId rather than two vocabularies in one column.
   - default `timeCommitment` rather than writing null, so DiGi is never told
     "not specified" for a parent who was never asked.
3. `app/(auth)/signup/page.tsx` — redirect to `/starter-pack`, carrying `?email=`.
4. `app/(auth)/login/LoginForm.tsx` — "New here?" points at `/starter-pack`.

## Guard

`scripts/check-one-door.mjs`: the starter pack must not mark setup complete,
both doors must write a ChallengeId, `/signup` must redirect rather than render
a form, and nothing may link to `/signup` as a place to create an account.
Mutation tested. Wired into CI.

## Out of scope

The trial safe name write that only `/signup` does, and the returning starter
pack parent creating a child with no date of birth. Both are real and both are
fixed by stop 3 asking for the birthday, so they are checked at the end rather
than built separately.
