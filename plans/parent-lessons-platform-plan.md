# Parent lessons on the platform: age gating, completion, redo, stars and the stage passport
**14 Jul 2026 · Written by the curriculum content lane as the build handoff for the platform lane. The videos exist and are hosted; this plan is the wiring. No migrations or app code from the content lane (rule: platform lane lands it).**

## What already exists (ready to wire)

1. **Ten rendered Stage 1 parent and child co view lessons** (ages 4 to 7), each ~4 to 5 minutes, Mabel narration, DiGi golden star opens and closes, captions burned in, validated against Education for a Connected World by the July validation audit (see the scripts folder in Drive and plans/script-sessions/ for the written layer):
   1.1 Me on a screen and me in real life (v3, strand corrected) · 1.2 Kind words on screens (v3, includes unkind and pretend beat plus upstander) · 1.3 The internet remembers · 1.4 When screens make you sad · 1.5 Real or pretend? · 1.6 Screens, sleep and growing bodies · 1.7 My privacy shield (catchphrase now "Check with your grown up first!") · 1.8 Someone made that · 1.9 Some voices are not people · 1.10 The Yes No Button (new, closes the consent gap)
2. **Each lesson ships as four MP4s**: the full linear video plus segments A, B and C split at the pause points, so the platform can interleave its own interactive slides (quick check after A, say this tonight after B). Files hosted on the existing Higgsfield CloudFront CDN; URL map in the animation folder's cdn-urls.json (v2 set live; v3 re upload queued, same structure).
3. **Per lesson content already written**: two pause and talk prompts (with older child variants), a What would DiGi do quiz scenario with three options and one seeded misconception, catchphrase, try it tonight activity, parent note lines.

## The rules to build

### Age gating (catch up included)
- The child's age band (children.age_band → stage) gates VISIBILITY FORWARD only: a child sees every lesson from Stage 1 up to and including their current stage, nothing above.
- Rationale: a nine year old who joins late needs the Stage 1 habits before the Stage 2 content lands. Catch up is a feature, not a remedial flag: older children doing younger lessons still earn stars, and the copy never calls it catching up ("the early adventures" register).
- Current band lessons are featured first; earlier bands sit under "earlier adventures".

### Completion and redo
- A lesson counts complete when the child reaches the final segment's end (segment C ended) AND answers the two quiz choice slides. Store: child_id, lesson_code, first_completed_at, times_completed, last_completed_at, quiz_right_first_try.
- Complete lessons show the tick and STAY OPEN: redo any time (the whole point is rewatching with the grown up).
- Stars: full stars on first completion; a smaller fixed redo award afterwards (keeps redo worth doing, prevents farming). Stars flow into the EXISTING stars bank and stars into device time economy — no new currency.
- The Star Lesson send flow and kid link work unchanged; this adds the completion write back and the parent push ("good news, [name] just finished The Yes No Button").

### The stage passport (the goal that makes it a quest)
- When every lesson in a stage is complete for a child, award the STAGE PASSPORT: a celebration screen (DiGi, stars, the stage's animal guide stamp), a passport entry in the child's view, and a parent push + dashboard moment.
- Store: child_id, stage_id, awarded_at. Passports are permanent; redo never removes them.
- Passports earned for earlier stages (catch up) award retroactively the moment their last lesson completes.
- The passport is the bridge into the existing quest and device time system: completing a stage is the big quest payoff, and the passport wall shows the journey 1 to 5.

### Parent access
- Parents see every lesson at every stage (no gating), each with its parent note, the pause card text, and their child's completion state.
- The parent's Track P session (60 to 90s watch one then act videos, scripts in plans/script-sessions/) attaches to the same lesson row when those render.

## Build order suggestion (platform lane)
1. Lessons + segments tables seeded from the CDN URL map (content in the database, rule 6).
2. Player route: segment A → quick check slide (the What would DiGi do scenario is written per lesson) → segment B → say this tonight card → segment C → quiz → completion write.
3. Completion + stars wiring into the existing bank; redo award.
4. Age gate on the child lessons list (stage ≤ child's stage).
5. Stage passport award + celebration + passport wall.
6. Parent dashboard completion view + push.

## Open decisions for JP
- Redo star amount (suggestion: 20 percent of first completion award).
- Whether quiz wrong answers block completion (suggestion: no — reactions teach, completion still lands; quiz_right_first_try is the quiet quality signal for the evidence file).
- Whether the passport unlocks anything concrete beyond celebration (suggestion: a printable certificate through the existing print system).
