# At school, rebuilt around homework: simple, and on the parent's side

Justin, 17 October 2026, with a screenshot of "What Teo is learning": simplify
it, make it super helpful, research the best homework tools, and solve the
homework problem. Help when a parent is not sure what level of homework is
right, check whether what the child says is fine against school advice, help
the parent help the child, nudges and tips. Simple UX.

## What three specialists found (17 October)

- **Research** (sources in the PR): England has had no national homework rule
  since 2012; schools set their own. Typical published policies: Y1 to Y2
  reading 10 to 20 min a night and weekly spellings; Y3 to Y4 add times
  tables (MTC in June of Y4); Y5 to Y6 about 30 min a night; Y7 to Y8 40 to 60;
  Y9 60 to 90; Y10 to 11 60 to 90 plus revision. Homework helps secondary more
  than primary and more time stops helping. HOW a parent helps matters more
  than how much: supporting the child's own effort works, taking over does
  not (Patall 2008, Xu 2024). Specific prompts beat portals (Bergman 2017,
  EEF texting parents 2016). Few, personal, encouraging nudges.
- **Mobbin**: the range bar "standardised to your age" with a marker and a
  one line verdict (Bevel, BitePal, Oura); one big snap or paste button
  (Google Lens homework); a week strip (Calm, Babbel); three tips with a
  mascot (Yazio). Remove the bold DfE quote, the intro paragraph and the tabs.
- **Platform map**: almost everything exists. `minutesGuide` (lib/homework/
  help.ts) is the only age guide and it is in the child's voice with no
  source; `kid_homework_notes` (what the child says they have) is shown only
  on Quests; the After school routine quest exists; the 15:30 school window
  push and card exist; the decoder returns a `help` line; four homework
  scripts exist. No new table, no new push, no new cron.

## The page, top to bottom (390 phone)

1. Title "Homework and school", child pills, one mono line "Year 6 · Autumn
   term · week 7".
2. **How much is normal for Year 6**: a range bar in crayon (light, about
   right, a lot) for minutes a night, with what the school policies usually
   say in one line, and the honest note that the school's own policy wins.
3. **What did they say tonight?** Tap chips (None, A little, About 20 min,
   About 40 min, An hour or more, Tears). The marker lands on the bar and a
   one sentence verdict says what to do: fine, check together, or talk to the
   teacher. Tonight's note from the child's own app shows here when there is
   one. Nothing stored beyond what exists; the tap is a view.
4. **Snap or paste the homework**: the one butter button, to the decoder.
5. **How to help tonight**: three short moves for the age, and the homework
   scripts link.
6. **This week in class**: one plain line (subject and strand), the dinner
   table question, and Make it a job.
7. **Make it a routine**: one tap to the After school routine quest
   (homework before screens, twenty minutes reading), which brings the 16:30
   reminder the app already sends.
8. Quiet links: the whole term, what is coming, where this comes from.

## Out of scope

The parent's own nudges beyond the existing pushes; a stored "says none"
counter (it would need a table, a later step if the view earns it).
