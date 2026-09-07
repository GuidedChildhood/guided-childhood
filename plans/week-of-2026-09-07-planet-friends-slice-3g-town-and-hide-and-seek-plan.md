# Planet Friends slice 3g: the town on every planet, and hide and seek

Status: designed 6 September 2026 from Justin's evening note ("When you
press a planet it should show a city in the planet where there are
buildings, when you press a building you go inside, then find mini baby
Planet Friends hidden in a house and you get a clue, like where you put your
device at night, and similar device related clues to find them, and when
you get one it gives you the clue to the next one"). Sections 7.10 and 7.11
of plans/planet-friends-architecture.md hold the design; the canvas holds
the picture (the town, and the kitchen with a little one found). Waiting on
Justin's go. No migration: the hunt is play state in planet_homes.state.

## The one line

Press a planet and see its town; press a building and go inside; find the
five little ones by clues about where devices live in a good week, each one
handing you the clue to the next.

## What changes

1. **A town on every planet.** Landing goes to the town, not the room. The
   town is data (TOWNS) drawn by one renderer (TownScene): the ground, the
   sky, the buildings, a road, the launch pad, the Friends and the self
   walking about. A building whose room is built opens on a tap; a room
   still to come is a signed plot, never a lock.
2. **The little ones.** Five mini Planet Friends who live in the nursery
   dome and hide across the child's open planets. Fixed, named, all five
   from the first day, at every tier.
3. **The hunt.** DiGi gives the first clue; each little one found gives the
   next; the fifth says "All home!" and the named part lands in the box.
   Twelve hiding places, each with one fixed clue about a device habit
   (the charging shelf at night, the bed with no phone in it, the table with
   every screen away, the real book, the laptop that closes after the
   lesson, the telescope, the fuel pump, the burrow, the warm hut, the cafe
   counter, the feed wall, the paint pots). The server picks five per hunt
   from a seed, filtered to what the child can reach, walking outward from
   home. A new hunt the next day, with no reminder.

## What stays

Everything before it. The client reports and the server decides
(mini_found is the one event; the device holds only the current clue).
Nothing new is collected about the child. No model near the child, no timer
on screen, no padlock, no loss language, a fixed and named reward.

## The build, in order, each part shippable

1. **3g.1 The towns (four planets).** lib/planet/town.ts: TOWNS for the
   home planet, Moonbase School, the Playground and the Space Port, with
   the buildings' keys, rooms, places and sizes. components/planet/
   TownScene.tsx from data. PlanetFriends: the landing goes to the town, a
   building tap goes inside, the room's back button returns to the town, the
   pad returns to the universe. The fixture takes ?town=school. Checks:
   Playwright at 390 and 1280 walking every building on the four towns.
2. **3g.2 The little ones and the hunt.** lib/planet/logic.ts: the hiding
   places table, newHunt(home, seed), huntClue(home), applyEvent mini_found
   (the server checks the place), the day roll. lib/planet/hunt.ts: the
   clues and the lines, no dashes. The nursery start, the clue card (words
   from Tier 2, pictures at Tier 1), the little ones' art (the baby figure
   at half size), the hiding places wired to the fridge, the shelf, the
   bed, the bookshelf, the desk, the telescope, the fuel pump, the burrow,
   the warm hut, the counter, the feed wall, the paint pots. The event
   route. The named reward. Checks: the rules (a hunt never points off the
   open planets, the order walks outward, a wrong tap changes nothing, the
   fifth find ends it, the next day starts again), Playwright for a whole
   hunt on the home planet and one that crosses to Moonbase School.
3. **3g.3 The far towns.** TOWNS for the Wild planet, the Observatory, the
   Star Cafe, StarNet Studio, the Ice, Volcano and Rainbow planets, with
   their skylines. Art from data, no new code.

## What Justin decides

- The go, and whether 3g.1 and 3g.2 ship together or one at a time.
- The name: "the little ones" (this plan), or another.
- The reward for a full hunt: a bright star (this plan), or another part.
- A hunt a day (this plan), or a hunt whenever the child asks.
