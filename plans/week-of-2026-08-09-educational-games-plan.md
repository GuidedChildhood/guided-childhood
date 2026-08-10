# Week of 9 August 2026 — Our versions of the most popular educational games

Justin asked for research into the most popular educational games with a view to
building Guided Childhood versions. Research done 9 August. This plan records
what was found and claims the first build.

## What the research found

The most popular educational games in August 2026 and the loop that makes each
one work:

| Game | Ages | Scale | The loop |
|---|---|---|---|
| Prodigy Math | 6 to 12 | 100M+ registered | Answering a maths question casts your spell in a Pokemon style battle. Pets, levels, zones. The maths IS the combat. Adaptive difficulty. |
| Khan Academy Kids | 2 to 8 | 21M+ students | A named mascot fronts each subject. 5,000+ activities on a personalised path. Free, ad free. |
| Duolingo ABC | 3 to 6 | Duolingo scale | Tap, trace and match phonics mini games. Streaks and XP drive a daily habit through loss avoidance. |
| ABCmouse | 2 to 8 | Paid leader | Full curriculum with a ticket reward economy. |
| SplashLearn | 5 to 11 | 40M+ | Adaptive maths and reading in themed worlds. |

Six mechanics repeat across every winner: the learning is the game verb, adaptive
difficulty, named characters per subject, collect and progress loops, instant
feedback with no fail states for under 8s, and short 3 to 7 minute sessions.

The one big app mechanic we must not copy is Duolingo's streak pressure.
quest-games-plan.md section 8 already rules out streak pressure, daily login
rewards, countdowns, FOMO and variable rewards. Our versions keep the fun verb
and drop the compulsion loop.

## What we already have

The engine ships: lib/quest-games/registry.ts (about 30 games as data),
components/quest-games/QuestGamePlayer.tsx, server side star scoring through the
game_key branch of app/api/quests/lesson-complete/route.ts. Pairs, judge, sums,
fishing, coins and wheel cover memory match, sorting, maths sprint, phonics
catch, money play and the quiz wheel. The star economy, sticker book and Planet
Friend unlock ladder all exist.

## The gap, in order of crowd appeal per unit of effort

1. **Quiz battle** (Prodigy's core) — nothing like it in the registry
2. **Tracing** (Duolingo ABC's core) — Foundation is our thinnest stage
3. **Word builder** — tap letters to spell
4. **Story sequencer** — order the cards
5. **Adaptive difficulty** — later, parent opt in only (Children's Code:
   profiling off by default)

## CLAIMED THIS WEEK: DiGi Quiz Battle

A new `battle` mechanic on the existing engine. Our Prodigy, built to our rules:

- The child's Planet Friend faces a cheerful opponent. Answering a question
  powers the Friend's move. The answer IS the attack.
- No losing and no fail state. A wrong answer means the move fizzles, the game
  shows the right answer kindly, and the same question comes back later in the
  set. The battle always ends in a win once the set is cleared.
- No timer, no randomness, fixed stars declared up front, calm ending with no
  autoplay into the next game (quest-games-plan section 8).
- Question banks live in the game data in the registry, per stage: number bonds
  and doubles for stage 1, times tables for stage 2, fractions and percentages
  plus media literacy for stage 3.
- Scoring stays server side through the existing game_key route. No migration
  needed. Migration 181 is claimed by the five a day work and this build does
  not touch the database.

Build shape: one type added to the union in registry.ts, one BattleView
component, one switch branch in QuestGamePlayer.tsx, game entries as data,
thumbnails in public/games/.

Not claimed, left for later sessions: tracing, word builder, sequencer, the
adaptive layer, and the printable and outdoor Batch 1 from
games-expansion-plan.md, which stays the named on brand priority for Foundation
offline play.

## Verification

- Fixture first, no database: play every path in the browser.
- Playwright screenshots, mobile and desktop, tap every button.
- Confirm the star lands as a pending quest tick once and cannot be farmed.

## CLAIMED 10 August: Trace with Pebble

Justin picked tracing as the next build. A new `trace` mechanic on the quest
games engine, our version of Duolingo ABC's core loop for Foundation (4 to 7),
the thinnest stage. First game: the first six phonics letters in school order
(s a t p i n), finger traced stroke by stroke with a start dot and guide
points, Pebble cheering each one. Forgiving input, generous touch targets, no
timer, fixed stars, calm finish. Letters are game data, so later sets (more
letters, numbers) are data only. No migration.
