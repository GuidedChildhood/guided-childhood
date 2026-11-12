# Ten out of ten on every lens (agreed 12 November 2026)

Justin asked how each board lens gets to ten before it becomes the session
goal, and to agree the recommendations first. This is what was agreed. The ten
row for each lens is in `.claude/agents/review-<lens>.md`; the gaps are from
the 12 November run (`plans/review-board/runs/2026-11-12.md`).

## The honest ceiling

Four lenses cannot reach ten on code alone. Their ten rows need real families:
a paying family (will pay), the loop proven to hold someone (keeps coming
back), proof the parent can be reached (right audience), three things felt in
week one (value above AI). Claude can build everything around them; the last
point on each is Justin's task `five-real-families-run-a-week`.

## Justin's answers

- **DiGi model:** test Fable 5.2 against 5.1 with the DiGi evals and switch
  only if it scores as well or better. Report the numbers either way.
- **Home screen:** the lead plus one rotating slot. The eight extra cards take
  turns in the slot through `lib/home/next-up.ts`; the rest go to More.
- **Focus:** schools, French, Etsy and ads keep going as now. Not paused.
- **Agreed small adds:** under 4 email capture, a named 14 to 16 first step,
  a hard cap of two reminders per parent per day.
- **Not agreed:** opening the 17 November walkthrough with the stage check.
- **Already decided:** the /dashboard/pathway route keeps its address (the
  rename was declined), so it is a choice, not a gap.

## Per lens: score now, what gets it to ten, owner

| Lens | Now | To ten | Owner |
|---|---|---|---|
| Value above AI | 9 | Three of the four things shown in the first 48 hours (Day 1 starting point line, "last time you told me" quote, child app first open nudge), and a "first week, three felt" count in the pulse. | Claude, then real families |
| Solves the problem | 8 | First week payoff shows the start point when a worry has one or two ratings; walk the three top loops end to end with a seeded family and save the report. | Claude |
| Right audience | 7 | Home page title, description and FAQ in the parent's words; plain ages beside stage names; 14 to 16 first step; under 4 email capture; signups by channel in front of Justin. | Claude, then real families |
| Will pay | 7 | Paywall quotes the family's own history; Stripe test mode checkout smoke test in CI; one real paying family or the named reason. | Claude, then Justin |
| Simple to use | 6 | Lead plus one home; merge stats and week into What is working. | Claude |
| Keeps coming back | 8 | Lifetime days beside the flame and a warm restart line; two reminders a day cap; five families run a week. | Claude, then Justin |
| Marketing | 7 | Every parent piece ends at the stage check, with a guard; the weekly per channel number put where it is read; one bet with a measure in the master plan; .co.uk links fixed in outreach plans. | Claude |
| UX expert | 7 | Hex to tokens with a baseline guard; designed loading, empty and error states on dashboard routes; a saved 390 and 1280 walkthrough. | Claude |
| Competitor watch | 8 | TAP sighting logged; agreed together and earned time stated plainly on the stage check result and home page. | Claude |
| AI and tools | 7 | Board and walkthrough routines save their output; Fable 5.2 eval; fast tier and batch check. | Claude |
| Business running | 5 | Board routine saves every week; tasks close when a merge names them; THE-STORY section 12 current; ICO fee and Vercel project done; five families running. | Claude, then Justin |

## Build order

1. Routines that save (board, walkthrough). Every later score depends on the
   board recording it.
2. Marketing guard and stage check endings, before the campaign on 17 November.
3. Reminder cap, flame lifetime days, first 48 hours value lines.
4. Lead plus one home, payoff page merge.
5. Home page copy, ages, 14 to 16 step, under 4 capture, competitor lines.
6. Paywall with family history, checkout smoke test.
7. Fable 5.2 eval.
8. UX tokens and states, saved walkthrough.

Each step is its own small PR claimed before building, per CLAUDE.md.
