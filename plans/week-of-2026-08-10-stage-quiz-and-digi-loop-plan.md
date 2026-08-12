# Week of 10 August 2026 — Stage quiz, curriculum review, DiGi's learning loop

Session lane: platform code, continuing the build in Justin's set order.
Branch: claude/guided-childhood-build-0xzkvs

## Claimed in this session's draft PR

- The stage quiz (end of stage, writes stage_quiz_passes, ticks the passport)
- Treasure chest opened state moved server side (localStorage fault, same fix
  as the streak celebrations that moved into kid_milestones), after verifying
  its exact trigger conditions
- The curriculum review, folding in the grown up audience check, the per stage
  coverage recount, and the ai_lessons question recheck
- DiGi's learning loop: what writes digi_outcomes, verdict history into the
  prompt, a periodic summariser of what is not working, and a retention and
  privacy position on conversation storage BEFORE any storage is built

## Migration numbers claimed: 189, 190, 191

Highest on origin/main is 188 (tutor_lessons). No open PR claims a number
above that (checked 12 August, only PR 810 open, briefing only). This session
takes 189 to 191 for: chest opened state or quiz support if needed, and the
learning loop tables. Unused numbers are released by this file changing.

## Build order (Justin's)

1. Stage quiz. Sits at the END of a stage, not per lesson. Gathers questions
   already asked across that stage's lessons. Passing ticks the stage on the
   passport. stage_quiz_passes (098) exists and stage-quiz-status.ts reads it;
   nothing writes it yet.
2. Curriculum review, top school level, age appropriate. Includes:
   a) whether lesson bodies address the grown up while a child can see them
      (both parent_lessons co-view AND lessons on the child's page reach
      children; audience says written for, not visible to),
   b) coverage recount (was Foundation 6, Builder 6, Explorer 7, Shaper 20,
      Independent 7),
   c) ai_lessons question recheck (was 0 across 46).
3. DiGi's learning loop: (i) confirm digi_outcomes writers, (ii) feed verdict
   history into the prompt (getProvenSolutions exists), (iii) periodic
   summariser that surfaces what is NOT working and proposes alternatives,
   (iv) conversation storage RAISED to Justin with an ICO Children's Code
   position first, not built unprompted.

Plus, first: verify the SchoolChest trigger conditions, then the server side
opened state fix.

## Not started unprompted (waiting on Justin)

Scripts copy sweep, child push notification count and cuts, parent home steps
3 and 4. DigiWelcomeSheet stays.
