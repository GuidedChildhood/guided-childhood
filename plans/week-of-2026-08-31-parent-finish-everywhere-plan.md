# The happy news finish across the whole parent platform

Justin, 5 September 2026: "Can we also make sure all icons and new look is
across the parent platform so all consistent."

The finish (ink edge, hard ledge, butter on the thing to tap, story icons in
ink edged plates, Nunito 900 headings) reached Home, the daily path, Quests,
Add a job, Lessons, Passport, Printables and Settings on 5 September. Every
other parent surface still carried the soft grey edge, the blur shadow and
emoji doing icon work: 183 files in app/(dashboard) and components.

## How

1. One sed swaps every `var(--border)` edge in the parent surfaces for the
   ink edge (167 files). Kid app, marketing, print sheets and admin untouched.
2. Four lanes, in parallel, finish the rest from one rulebook
   (scratchpad/finish-rules.md, copied below in short): ledges on card shells,
   blur shadows out, section dividers ink and row dividers dotted, straggler
   sage and grey edges to ink, primary buttons butter, emoji in plates to
   HappyIcon where one of the 28 names fits. Lanes: dashboard pages; home,
   daily, digi, setup and ui; quests, games, scripts, balance; pathway,
   school, lessons, devices, insights.
3. Gates: tsc, wiring, checkin-guard, dash grep, then screenshots of the dev
   fixtures at 390 and 1440, and Justin's own walk through on the phone.

## Rules in short

- Edges `2px solid var(--ink)`. Semantic colour edges and white rings stay.
- Card shells `boxShadow: '0 4px 0 var(--ink)'`; rows, chips, inputs inside
  a card have the edge and no ledge.
- Buttons: butter `var(--terracotta)` with ink text for the thing to tap,
  white for the rest, both with the ledge. Done is retro green.
- Icons: HappyIcon in an ink edged plate. Emoji from data stays.
- No dashes, no logic changes, no new dependencies.
