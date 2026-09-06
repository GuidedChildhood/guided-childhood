# Planet Friends slice 3d: the self, the child's own explorer

Status: built 6 September 2026 by the other session on this lane (PR 984: SelfFigure, SelfBuilder, home.self, self_set) and kept whole in the PR 986 merge, where the explorer also stands in every room of the Den and on the away planets. Its four choices are skin tone, hair shape, hair colour and suit colour, palette indices only, no free text, no photo. The visor, badge, backpack and boots of this plan, and the child's first name as a label, remain open for a later drop. Proposed 6 September 2026 from Justin's note the same day ("build the self, like skin colour, hair, put on a space suit and more").

## The one line

The child makes themself, puts on a space suit, and goes everywhere the
Friends go.

## What changes

1. **The maker.** A "Me" button on the planet opens a sheet, the way the
   parts box does. Tiles, never words: skin tone (eight), hair shape (eight)
   and colour (eight), eyes (four), the space suit in any theme colour with
   a stripe in a second, and more (a visor, a badge, a backpack, boots). The
   figure in the sheet changes as they tap. Tier 1 gets skin, hair and suit,
   one screen each with big tiles; Tier 2 and 3 get the lot.
2. **The explorer.** `MeFigure.tsx`, drawn in SVG in the toy's own ink and
   crayon, wearing the child's first name as its label. It stands with the
   Friends outdoors, walks every room, rides the rocket on the map, and the
   outfits box dresses it too. No starlight of its own: it never tires and
   never needs a pod, so the loop stays about the Friends.
3. **What is stored.** Palette indices in `world.me`, checked on the server
   (`me_set`). No free text, no photo. The cast stay the cast.

## The build, in order

1. `lib/planet/logic.ts`: `Me`, the palettes' sizes, `me_set`, a default
   explorer for every save. Checks.
2. `components/planet/MeFigure.tsx`, `MeMaker.tsx` (the sheet).
3. The explorer in `HomePlanet.tsx`, `RoomScene.tsx`, `StarMap.tsx`.
4. The event route, the fixture param (`me=`), the checks.

## What Justin decides

- The go.
- Whether the explorer carries the child's first name as its label (the app
  already knows it) or no label at all.
