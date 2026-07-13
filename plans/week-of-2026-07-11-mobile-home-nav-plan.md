# Mobile home and navigation: the clear daily routine

Week of 2026-07-11. Lane: platform UX (dashboard home + nav). Approved by Justin.

The concern: on mobile the home shows fifteen cards at once with no single "do
this now", Scripts and Quests are not reachable from the tab bar (Scripts is a
card buried down Home, which is why it "does not work"), and the type flashes a
generic system font before Nunito loads. Reference: Good Inside (one daily deck,
"a reason to come back like a daily quest", five minutes a day) and Duolingo (a
single path, one lit next node, streak). Justin's own Good Inside notes: "Our
job a win every day, your job one simple action".

## PR 1 — quick wins (shipped)

- **Tab bar becomes five real tabs:** Home, Scripts, DiGi, Quests, Progress.
  Scripts and Quests are no longer buried on Home.
- **Help now moves to a floating action** just above the tab bar (mobile) plus
  the existing desktop pill, so crisis words stay one tap away without taking a
  nav slot. Hidden on the DiGi chat page where the compose bar lives.
- **Nunito and IBM Plex Mono load through next/font**, self hosted and
  preloaded, instead of a render blocking CSS @import. The type is sharp from
  the first paint. Nunito stays, it is the brand font.

## PR 2 — the Home "Today's Path" (next)

Match Justin's mockup exactly: a horizontal stepper at the top of Home,
CHECK IN, MOMENT, SCRIPT, DIGI, DONE, with the current node glowing and the DiGi
star sitting on it ("tap the glow, do this next"), an "X of 4" counter, and a
"Next: <step>, N steps to finish today" bar with one Go button. DiGi is the
interior guide, walking the parent through the day one lit step at a time.

Then collapse the pile of discovery cards below the path into a tidy Explore
section (or lean on the new tabs), so Home opens with one clear thing to do, the
Duolingo pattern, not a wall.

## Guardrails

Nunito plus IBM Plex Mono only. Checker tokens. No dashes. Motion via GSAP,
subtle. Mobile checked before done.
