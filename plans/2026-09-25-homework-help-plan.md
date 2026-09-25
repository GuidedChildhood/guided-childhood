# Homework help (25 September 2026)

Justin: "a weekly note of what they might be studying, one line, with a click
for homework help where they can upload an image or type the homework, and
DiGi gives them an idea of how it links to the curriculum, tips, ideas and
asks questions. Industry leading, simple, up to date on expectations, stress
free."

His answers:
- Age based, "as long as the child does not access the LLM version". Read as:
  aged 10 and over the child gets guided hint cards; there is no chat box and
  no free conversation, only the homework in and structured cards out. Under
  10, the button asks their grown up.
- Photos yes, read once, never stored.
- The "From school this week" job becomes one line, no stars.
- The weekly line changes on Monday, in the app only. (lib/learning/this-week
  already moves on Monday with no model call.)

## What exists and is reused
- lib/learning/this-week: the deterministic weekly objective (the line).
- /k/[token]/homework + KidHomework: the child's homework note. Help lives
  here, under the note, so there is one homework place.
- /api/learning/decode: the parent decoder's curriculum match and the id
  revalidation discipline, copied for the child route.
- lib/school/photo.ts: phone photo to a small JPEG in the browser.

## Build (phase 1, this PR)
1. KidQuestScreen: the weekly card becomes "This week in Year N: <strand>"
   with a "Stuck on homework?" button to /k/[token]/homework. No tick, no stars.
2. /api/kid/homework-help (token auth):
   - mode 'hint' (10 and over, server checked): homework text and/or photo in,
     JSON out: the curriculum objective (revalidated ids, Year 1 to 6 only),
     what the teacher is looking for, one hint, one question to try, a calm
     time guide. Hint level 1 to 3; never the answer, never writes it for them.
     A worrying message returns a "talk to your grown up" card instead.
   - mode 'grownup' (any age): pushes the parent "N would like a hand with
     homework", linking to the parent decoder. No model call.
   - Nothing about the homework is stored. A per child daily count caps use
     (migration 354, kid_homework_help_uses), failing open if not yet run.
3. HomeworkHelp component on the child's homework screen.

## Phase 2 (later)
- Photo on the parent decoder, and the same weekly line on the parent's Home
  with "ask them about it".
