# Planet Friends slice 2c: the child builds their planet

Status: built 5 September 2026 (migration 254). The design document's slice 3
is still the Digital Playground and the cafe, which is why this is 2c.

Written 2 September 2026 after Justin: "Seems to be plant missions still?
How is this like Toca Boca? Surely they build rooms and stuff." and his yes to
the direction below. Meant to fold into PR 964 with slice 2b (the sheets, the
card, the prompts), but Justin merged 964 on 3 September before the build was
committed, so this is its own PR on the same branch, and the garden missions
it replaces were on main for two days without migration 253 applied.

## The one line

The child builds their planet, and everything real they do earns a part to
build with.

## What changes

1. **Parts, not decor.** A mission's reward is a part in the child's parts
   box, named on the card before they start. The child puts it anywhere they
   like on the planet, moves it, takes it back. Nothing lands where we say.
2. **Plots.** The planet has twelve places a part can go (sky, the horizon
   behind the Friends, the ground, and the ring). How many the child may fill
   grows while they are away: 3 on bare rock, then 5, 7, 9, 11, 12. Growth is
   more room to build, not grass and rings appearing by themselves.
3. **Growth gives too.** Each stage the planet reaches while the child is
   away brings a gift into the box: a helmet, a star, the ring, a cape, a
   crown. Fixed, named, no rolls.
4. **Dress up.** Outfits drag onto a Friend: party hat and glasses from day
   one, the helmet, cape and crown as the planet grows. A Friend wears one.
5. **The Friends play with the parts.** Drop a Friend on the trampoline and
   it boings, on the swing and it swings, on the rocket and it counts down.
   One line, one wiggle, back to standing. Tactile, never scored.
6. **The missions go space and adventure.** Plant a seed, water a plant, the
   leaves and the moonflower are gone. Twelve missions: rocket launch, star
   hunt, twenty moon jumps, an explorer walk, a five minute stretch, ten
   minutes with a real book, the counting hunt, screens off dinner, a lesson,
   phone to bed unasked, helping hands, and the Comet card (the hidden code
   card, was the Moonflower card). Each names the part it earns.

## What stays

The starlight loop, the pods, the bedtime side, the missions engine and its
four proofs, the sheets, the per child code card, the scripts rows, never a
star, the server deciding every placement (a part must be owned, unplaced,
the slot free and inside the plots). The layout lives in the planet's save,
so no new migration: 253 stays the codes table and the scripts block, with
the twelve prompts in place of the nine.

## The build, in order

1. `lib/planet/logic.ts`: `PartKey`, `Outfit`, the part registry (zone per
   part), `SLOTS` (id and zone; positions live in HomePlanet), `PLOTS_BY_STAGE`,
   `STARTER_PARTS`, `STARTER_OUTFITS`, `STAGE_GIFTS`, `Home.build`
   (`placed`, `outfits`), events `part_place`, `part_remove`, `outfit_set`,
   reconcile fills the build and the starters, growth drops its gift in the
   box. Checks for every rule.
2. `lib/planet/missions.ts`: the twelve, script orders 9630 to 9641, step
   pictures, part labels and the Friends' lines on each part.
3. `components/planet/HomePlanet.tsx`: slot positions, one drawing per part,
   placed parts drawn in their slots, the ring, empty slots shown while
   something is being placed. `FriendFigure.tsx`: the outfits.
4. `components/planet/PlanetFriends.tsx`: the parts box (a tray under the
   planet), drag a part from the tray onto a slot, drag a placed part to
   another slot or back to the tray, drag an outfit onto a Friend, drop a
   Friend on a part. The reveal says the part is in the box.
5. The event route kinds, the fixture params (`parts`, `placed`, `outfits`).
6. The sheets and the migration follow the new catalogue: blurbs, the Comet
   card, twelve scripts rows.
7. Checks: logic, Playwright at 390 and 1280 (place, move, take back, dress,
   a Friend on the trampoline, the plots cap), the twelve sheets at one page.
