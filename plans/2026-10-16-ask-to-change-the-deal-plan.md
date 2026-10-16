# Ask to change the deal (16 October 2026)

Justin, 16 October: "Yes" to the one Kairoo idea we did not have. The child can
ask to change a promise in the family deal from their own app, with a reason,
and the parent decides. Lane: platform code. Migration claimed: **381**.

## Why

Today the child reads the deal in Our family deal and taps I agree, and then it
is locked: only the parent can change it. Commitment 4 says the child is a
participant, not a subject. An ask with a reason practises the skill the
product teaches (make the case calmly) and matches the pattern we already use
for screen time inside a protected window: an ask to the parent, never a flat
no.

## What gets built

1. **Migration 381, `deal_change_requests`.** One row per ask: family, child,
   the promise it is about (title as the child saw it), what they would like
   instead, why, status (`pending`, `yes`, `not_now`, `talk`), the parent's
   short reply, timestamps. RLS: the parent reads and answers their own rows;
   inserts come only through the token scoped child route with the service
   role, like `quest_requests`.
2. **Child side, `FamilyDeal` in `app/k/[token]/KidQuestScreen.tsx`.** Under
   the agreed promises, once the child has agreed, a quiet "Ask to change
   something" button. Three steps: pick the promise, say what you would like
   instead, say why. Sends to **`POST /api/kid/deal-change`** (token auth, one
   open ask at a time, three a week, words trimmed and capped). While it is
   open the child sees it waiting; once answered they see the answer.
   No model call on the child side.
3. **Parent side, `components/deal/DealChangeAsks.tsx`** on the Quests page,
   with the other things waiting on a yes, and on the agreement page. Each ask
   shows the promise, the wish and the reason, and three answers:
   - **Yes, let's change it**: marks it yes and opens the agreement editor,
     where the change is made and both agree again (the editor already
     versions a changed deal).
   - **Not this time**: an optional one line reply the child sees.
   - **Let's talk**: marks it and opens DiGi with the ask already written in,
     so the parent gets the words for the conversation (scripts stay in the
     database; DiGi returns a calibrated pathway, never a yes or no).
   Answered through **`GET/POST /api/deal-change`** (parent auth).
4. **Push** to the parent when an ask lands, through `sendPush`, the same as a
   quest pitch. Nothing is ever sent to the child, so their quiet hours are
   never touched.

## Not in scope

Changing the deal automatically on yes; the parent edits it, on purpose.
Asks about jobs (quest pitches and swaps already exist) or about the timer rule.

## Checks before it ships

Typecheck, lint, the repo guards (including the no model on the child side
guard), `npm run ai-tells` on every new line of copy, Playwright on phone and
desktop widths for the child popup and the parent card, review.md pass.
Applying migration 381 to the live database is Justin's call.
