# Planet Friends slice 2: the missions, and the moons they bring home

Justin, 2 September 2026, after merging slice 1 (PR 961): "Yep ready."
Migration 252 is applied in production. This is the Real World Copycat
Engine from `plans/planet-friends-architecture.md`, section 3.2, and the
place where the three threads he named meet: offline activity, balanced
device use, and the online lessons.

## What ships in this slice

- **A mission board on the planet.** Tier 1 (ages 3 to 5) is offered one
  mission at a time, always with a grown up. Tier 2 (6 to 9) sees a board of
  three. Every card names its reward up front (a green moon, a leaf flag, a
  ring), so there is never a mystery box.
- **The starter catalogue** as data (`lib/planet/missions.ts`): plant a real
  seed, a walk for three leaves, a five minute stretch, water a real plant,
  read a real book, screens off dinner, the counting hunt, and **do a
  lesson**, which is the online education thread made visible on the planet.
- **Four kinds of proof, the server deciding every one.** A grown up's tap
  (the ask lands in AskPopup beside device time asks, exactly like the pod
  ask); a real timer the server holds; a code the child finds in the real
  world (three pictures in order at 6 to 7, a word at 8 to 9, the answer in
  the mission data); and a Star Lesson passed on the child's own link since
  the mission was started.
- **The reward lands on the planet.** A moon in the sky, a flag on the
  surface, a ring, a pool in a crater, a lamp, a bright star, a picnic
  blanket. Fixed, named, never random. Missions pay on the planet only,
  never stars (Justin's decision 1).
- **Not now is not a no.** A parent's Not now puts the mission back on the
  board with a kind line. No failure language, no cooldown before trying
  again.

## Data and routes

- No migration. Mission state and rewards live inside the planet document
  (`planet_homes.state`), the ask rides the same `ask` column with a `kind`,
  and the ledger (`planet_events`) records every start, claim and answer.
- New client events on `app/api/kid/planet/event`: `mission_start`,
  `mission_claim` (with a code when the proof is a code), `mission_seen`.
- The parent's answer reuses `app/api/quests/planet/ask` with the ask's
  kind, and `/api/quests/time/active` carries the mission ask to AskPopup.

## Not in this slice (slice 2b)

The printed paper twin of each mission, and the hidden card with a code
generated per child and printed through the printables engine. Both need the
parent's print path to carry a child's code, which is its own piece of work.
The grown up prompt on each card stays in the registry for now; moving it to
the `scripts` table is a follow up.

## Checks

- `npx tsc --noEmit`, `node scripts/wiring-check.mjs`,
  `node scripts/check-child-has-no-model.mjs`,
  `node --experimental-strip-types scripts/check-planet-logic.mjs` (the
  mission machine gets its own checks).
- Playwright against `/dev/planet` at 390 and 1280: open the board, start a
  timer mission, claim a grown up mission and see Asked, enter a wrong code
  then the right one, see the reward land and the decor appear.

## Status, 2 September 2026

Built and checked: tsc clean, wiring check with nothing new, child side
guard green, 18 logic checks, 24 mission checks and 21 slice 1 checks in
Playwright at 390 and 1280 with no console errors. Two things found on the
way and fixed in the same PR: the pods and the orbit read any pending ask as
a wake ask (a mission ask would have hidden the wake door), and the fixture
returned nothing from a claim. Slice 2b stays as written above.
