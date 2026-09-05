# Planet Friends slice 3a: the Den and the charging shelf

Status: proposed 5 September 2026, waiting on Justin's go. Written from his
note the same day: "this should have planets they can move around, like Toca
Boca works, and to progress they get devices and put them in a charging port
in the kitchen for example, and add in the lessons to unlock planets. This
must have as many ideas and possibilities as the Toca Boca game." The design
is section 7 of plans/planet-friends-architecture.md. This file is the first
slice of it; 3b (the star system map and travel, lessons unlock planets), 3c
(the device ladder and the Star Cafe) and 3d (breadth drops) follow.

## The one line

The Friends have a house on the home planet, their phones run down, and they
charge them on the shelf in the kitchen every night, by themselves, before
the child is asked to do anything.

## What changes

1. **Rooms.** One renderer, `RoomScene`, draws any room from data: backdrop,
   floor line, spots by zone (wall, floor, table, sky, dock), placed things,
   a door each side, the map button. The outdoors the child already builds
   on becomes the first room of the home planet. The Den is its house:
   kitchen and bedroom in this slice, bathroom and living room if the art
   allows, every room furnished from day one and with free spots for the
   child's own things.
2. **Things, not only parts.** Furniture, food and devices join the parts as
   things with uses: holdable, edible, sleepable, openable, usable. The
   fridge opens with food in it. Food is eaten in bites. The beds sleep. The
   parts box becomes the pocket: drag a thing off the bottom of any room to
   pocket it, drop it in any room.
3. **The MoonPhone.** Every active Friend gets one with the Den, a named gift
   on the map, no roll. A Friend holding it is taking photos (the pretend
   gallery of six frames), drains starlight at double, and the battery runs
   down with it, drawn on the device as the screen dimming, never a bar.
4. **The charging shelf.** The kitchen comes with it. A device at battery
   zero goes on the shelf for a real five minutes on the server's clock and
   cannot be picked up until then. At wind down every Friend carries its
   device to the shelf by itself. At bedtime the shelf glows in the dark
   kitchen with every device on it. The bedroom has no dock on purpose: a
   device left there at bedtime walks itself downstairs.
5. **Found on the way, fixed already in slice 2c:** the "Do a lesson"
   mission now reads Learn tab passes as well as Star Lessons.

## What stays

Everything slices 1 to 2c built: the starlight loop, the pods, the sunshine
mission, the orbit, the night side, growth while away, the plots, the parts,
the missions, the sheets, the Comet card. Nothing new is collected about the
child. No migration: the world lives in `home.world` in the same document.

## The build, in order

1. `lib/planet/world.ts`: the registry. `Planet`, `Room`, `Spot`, `Thing`,
   the Den with its rooms, spots and furnishings, `DEVICES`, the Friends'
   lines per thing. No dashes in any line.
2. `lib/planet/logic.ts`: `World` on `Home`, `newWorld`, reconcile fills it
   for homes made before, events `room_move`, `thing_place`, `thing_move`,
   `thing_pocket`, `thing_give`, `thing_take`, `device_dock`, `eat`; the
   battery in `tick`; wind down and bedtime moving devices to the shelf;
   the five minute charge on the server clock. Checks for every rule.
3. `components/planet/RoomScene.tsx` and `ThingArt.tsx`: the renderer and
   one drawing per thing, the same SVG pattern as PartArt, the doors, the
   dock glow at night.
4. `components/planet/PlanetFriends.tsx`: the door from the outdoors into
   the house, room to room, the pocket tray replacing the parts box, a
   device onto a Friend and onto the shelf, the gallery.
5. The event route kinds, the fixture params (`room=`, `things=`,
   `battery=`), `app/dev/planet` states for every room by day and night.
6. Checks: logic, Playwright at 390 and 1280 (walk every door, place, move,
   pocket, hand a phone over, dock it, the wind down walk, the glow), the
   child guard, no console errors, no dashes.

## What Justin decides

- The go for 3a, or a different first slice (3b puts the map and the lesson
  unlocks first, with the Den as the second planet).
- Whether the Den's bathroom and living room ship in 3a or follow as a drop.
- The MoonPhone's one activity at launch: photos (proposed), or the tiny
  game from the Playground brought forward.
