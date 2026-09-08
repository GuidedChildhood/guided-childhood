# The setup worries: asked properly, wired to the check in, handed back

Justin, 8 September 2026: "go ahead with changes but make sure wiring all
works, for example the questions they answer makes the check ins as its issues
they have raised, and make sure the tick boxes are happy news icons, and that
we remember the answers, and they know they can add as many or little, and we
will return to ask more questions as we go for anything that comes up with
moments. Make it super easy, clear, and knows their problems."

Direction A from the canvas, plus the widened question, plus the wiring proved
end to end.

## What is already right, and must not be broken

`lib/concerns/baseline.ts` already turns the setup answers into the first
check in rows, and the comments in it are a history of that path being broken
three separate ways (a wrong `source` value, missing slug keys, a family wide
guard that starved the primary child). It works now. Every change here goes
THROUGH that file rather than around it.

## The build

1. **Nine worries, not five.** `asking_for_phone`, `social_media`,
   `ai_chatbots` and `seen_something` join the five the wizard already offers.
   These are the questions parents actually arrive with, and until now three of
   them were folded into `something_else`, which is deliberately unmapped, so
   they could never become a check in.

2. **Every new id gets a slug and a label, in the same commit.** The map has
   fallen behind the wizard twice before and both times the symptom was a new
   family opening their first check in on "All done for today". So:
   `social_media` to `social-media`, `ai_chatbots` to `ai-chatbots`,
   `seen_something` to `seen-something`, and `asking_for_phone` stops being
   thrown away by `OLD_TO_NEW_CHALLENGE` and maps to itself.
   `scripts/check-focus-labels.mjs` is the guard that proves it.

3. **Happy news tiles.** Each worry is a white card with the ink edge and the
   4px ledge, a pastel plate, and a drawn story icon: the situation, not the
   object. A new `components/onboarding/WorryIcon.tsx`, in the same hand as
   the child app's `KidIcon`. Ticked is butter, an ink tick, and a heavier
   ledge, so a chosen one is obvious across a room.

4. **They are told the rules of the question.** "Pick as many or as few as you
   like" above it, and under the button: "We will keep asking as things come
   up, so this does not have to be right first time." Both true statements
   about how the product actually behaves.

5. **The answers survive.** Ticks are written to `localStorage` as they are
   made and read back on the way in, so a phone that drops the tab mid setup
   does not lose them. They were already carried from the starter quiz; this
   covers the other half.

6. **They are handed back.** The walkthrough gains a first card, before the
   seven, that names the worries they just picked with the same icons and says
   plainly that these are already on their first check in and more can be
   added any day. Optional prop, so `/dashboard/how-it-works` (a revisit, with
   no fresh answers) is unchanged.

7. **The number that undersells us.** The scripts card says sixty. There are
   335, 90 of them free. Read from the database on the day this ships.

## Checks

`npx tsc --noEmit`, `npm run wiring`, `node scripts/check-focus-labels.mjs`,
`node scripts/check-checkin-shifts.mjs`, the dash grep on the diff, and both
`/dev/setup-quest` style fixtures in the browser at 390 and 1200: the
challenges step and `/dev/welcome`.

The wiring proof that matters: a fresh account picking AI chatbots and social
media must open its first check in with those two rows on it, by name.
