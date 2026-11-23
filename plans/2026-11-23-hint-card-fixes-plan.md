# Hint card fixes, 23 November 2026

Justin: "pick up the hint card fixes". The three product findings from the
23 November radar (PR 1668), each now weighed against Stanford's 2026 review
of 52 studies, which files Bastani (hints beat answers) and Cao (answers beat
hints) as conflicting.

## 1. Say what the evidence says (migration 404)

- Script "Ask the AI together, hints not answers" (migration 261): the second
  paragraph of why_it_works gave Bastani's 17 and 127 percent as settled. It
  now says one trial, that a later preprint disagreed, and what the review
  does find. The rule stays, as a sensible default.
- The Bastani row in expert_knowledge (migration 263): the same correction.
- Lessons that cite Bastani (292, 294, 349 and others) are curriculum, so they
  wait for the termly review, per CLAUDE.md. Listed in the PR.

## 2. Have a go before the next hint

- "Still stuck? Another hint" stays locked until the child writes their go at
  the "Try this" question (three characters or more).
- The server requires the attempt for hint 2 and 3, so the rule is real and
  not only on the screen. The attempt goes to DiGi so the next hint builds
  from where the child got to. DiGi does not say right or wrong, so the box
  cannot be used to check guesses.
- The attempt is not kept, like the homework itself.

## 3. Parents can see hint card use

- Migration 404 adds `hints` and `subjects` to kid_homework_help_uses. Only
  the count and the one word subject DiGi already returns (Maths, Spelling).
  The homework, the photo and the attempt are still never stored.
- /dashboard/homework shows each child's last seven days: how many hints, in
  which subjects. Read through the admin client, scoped to the parent's own
  children.

## Checks

check-homework-help, tsc, ai-tells, Playwright on the kid card and the parent
page at phone and desktop width.
