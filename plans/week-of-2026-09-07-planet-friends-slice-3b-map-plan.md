# Planet Friends slice 3b: the star system, and lessons unlock planets

Status: in build from 6 September 2026 on Justin's "Go 3b". The design is
section 7 of plans/planet-friends-architecture.md (7.1 the map, 7.4 the
lessons, 7.5 the catalogue). Slice 3a (the Den and the charging shelf) is
live. No migration: the world stays in `home.world`, and the count of lessons
passed is read on the server from tables that already exist.

## The one line

The sky is a map. Every lesson the child passes lights the next planet, and
the rocket takes the Friends there.

## What changes

1. **The star system map.** DiGi is the star in the middle and the planets
   orbit. The home planet is the first. Tap a planet to look; drag a Friend
   onto a lit planet and the rocket flies them there; drag a planet to move
   its orbit, which changes nothing and is saved. A planet not yet open is a
   pale outline with a book on it: a lesson opens it. No padlock, no nag.
   At Tier 1 a tap on an open planet takes Pebble by itself.
2. **Two planets to fly to.** Moonbase School (a classroom: the board, two
   desks, the globe, DiGi's desk) opens with the first lesson passed. The
   Playground planet (the slide, the swings, the sandpit, a bench) opens with
   the second. Each is a room drawn by RoomScene from data, with spots for
   things and parts, and a door back to the launch pad. A Friend on the
   swings swings, on the slide slides, in the sandpit digs.
3. **Lessons unlock planets.** The server counts the lessons this child has
   passed (lesson_completions on the Learn tab, plus Star Lessons done in
   kid_lesson_missions) on every read and carries the count in the save,
   never from the client. The catalogue order decides which planet opens
   next, so a curriculum change can never strand a planet.
4. **The reveals.** A planet that opened while the child was away shows on
   the map as new, with the rocket ready beside it, until it is visited. On
   the Learn tab's pass screen, one line says a new planet is waiting.
5. **The Friends can be anywhere.** `where` grows to the new rooms; the
   phones, the pocket and the missions work on every planet.

## What stays

The Den, the shelf and everything before it. Nothing new is collected about
the child: the lessons passed are already stored.

## The build, in order

1. `lib/planet/logic.ts`: `PlanetKey`, `PLANETS` (rooms, opens by), the new
   rooms in `RoomKey`, `openPlanets(home)`, `lessonsPassed` on the save,
   `world.orbits` and `world.visited`, events `orbit_move` and `planet_seen`,
   the `room_move` rule refusing a planet not yet open. Checks.
2. `lib/planet/world.ts`: the planets' names, blurbs and keys in words, the
   map lines, the classroom and playground lines.
3. `components/planet/StarMap.tsx`: the map, the Friends tray, the flight.
   `ThingArt.tsx`: the board, the desks, DiGi's desk, the globe, the slide,
   the swings, the sandpit, the bench, a tree. `RoomScene.tsx`: the two rooms
   and the door to the launch pad.
4. `components/planet/PlanetFriends.tsx`: the map scene, the map button, the
   travel, the new reveal.
5. `lib/planet/server.ts`: the count of lessons passed on every read. The
   lesson complete route says when a pass opened a planet, and the pass
   screen shows the line.
6. The event route, the fixture params (`lessons=`, `orbits=`), the dev
   states, the checks: logic, Playwright at 390 and 1280, the child guard,
   no dashes.
