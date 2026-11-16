# Ask the parent who stopped

Justin, 15 November 2026, after seeing that Rachael signed up and never came
back: capture the questions, keep nudging if they are not answered, and alert
him on his phone when an answer lands.

## What is built

1. A page, `/tell-us`, opened from a signed link in an email. No sign in.
   Question one is one tap ("What stopped you carrying on?"), so a single tap
   is already an answer. Five short optional questions follow. Pattern from
   Mobbin's leaving surveys (Givingli, Neo Financial, Blue Apron): tap a
   reason first, words second.
2. `parent_answers` (migration 397): one row per parent per question.
3. Three emails, spaced, each a different angle, then silence:
   three days after sign up with nothing done, then four days later, then a
   week after that. Any answer, a first check in or a finished day stops them.
   They ride the one programme email a week floor like everything else.
4. Every answer pushes to Justin's own phone and is listed at the top of
   `/dashboard/admin/asks`.

## Not built

- No in app prompt: a parent who never chose a plan cannot reach the app.
- Where the plan choice sits is Justin's decision and is untouched.
