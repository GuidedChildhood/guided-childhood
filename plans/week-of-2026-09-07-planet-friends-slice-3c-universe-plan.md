# Planet Friends slice 3c: the universe, every planet floating

Status: built 6 September 2026 on Justin's "Apply migrations and go 3c", in PR 986 on the Planet Friends lane, no migration. The sky is twice the screen, panned by dragging the dark, DiGi recentred by the small star; every planet drifts and a planet dragged anywhere stays there (planet_move, home.world.places); the eight far away planets each have their first room with spots, a launch pad, tap pieces and drop pieces, and the keys of the 7.5 table open them. Not in this slice: the rocket pocket and things travelling between planets (7.2), which waits with the drops. Proposed 6 September 2026 from Justin's note the same day ("I would like all the planets floating in a universe so the child can explore each one").

## The one line

Every planet is in the sky from the first day, floating, and the child can
look at all of them and land on the ones that are open.

## What changes

1. **A universe, not a map.** The sky is twice the size of the screen and
   the child pans it by dragging the dark. DiGi stays in the middle and a
   small star button brings the view back to DiGi. Every planet floats with
   a slow bob, and drifts no faster than a cloud. A planet dragged anywhere
   stays there (`planet_move` replaces the orbit angle with a place).
2. **All eleven planets.** The home planet, Moonbase School and the
   Playground are built. This slice adds a first room for each of the rest:
   the Space Port (launch pad, rockets, the rover in its garage, a fuel pump
   that pours starlight), the Wild planet (a forest, a pond, a burrow, a rope
   swing), the Observatory (the big telescope, a star map, deckchairs on the
   roof), the Star Cafe (the counter, tables, cushions, a bench under the
   stars), StarNet Studio (a studio and a feed wall, Tier 2 and 3), the Ice
   planet (igloos, an ice slide, a snowman), the Volcano planet (warm pools,
   stepping stones, a lava lamp rock), the Rainbow planet (a rainbow slide, a
   cloud bed, paint pots). Each is a room drawn by RoomScene from data, with
   spots for things and parts and a launch pad. The parts box and the phones
   work on all of them.
3. **Keys that open by whichever comes first.** Each planet lists its keys
   (a lesson count, a mission, a growth stage) and opens on the first to
   land, so a three year old who cannot do a lesson alone sees the universe
   light up through missions and growth, and a nine year old lights it
   through the Learn tab. The table in 7.5 says which.
4. **A planet not open is still there.** Pale, floating, with its key drawn
   on it (a book, the mission's emoji, a sprout). No padlock.

## What stays

Everything before it. Lessons still count on the server. Nothing new is
collected about the child.

## The build, in order

1. `lib/planet/logic.ts`: `PLANETS` grows to eleven with `opens: any of`
   and a universe place for each; `planet_move`; `planetOpen` reads the
   lessons, the missions landed and the growth stage. Checks.
2. `lib/planet/world.ts`: the words for each planet and its room.
3. `components/planet/ThingArt.tsx`: the pieces, about forty. `RoomScene.tsx`:
   eight rooms. `StarMap.tsx` becomes the universe: the pan, the drift, the
   recentre, the eleven planets' faces.
4. `components/planet/PlanetFriends.tsx`: the room lines and drops.
5. The event route, the fixture params (`stage=` already; `missions=` for
   the keys), the checks: logic, Playwright at 390 and 1280, the child
   guard, no dashes.

## What Justin decides

- The go.
- Whether the Star Cafe and StarNet Studio stay Tier 2 and 3 only (the
  design says so; a Tier 1 child would see them floating, pale, always).
