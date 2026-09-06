# The universe and the self, 6 September 2026

Justin: "I would like all the planets floating in a universe so the child
can explore each one, also build the self, like skin colour, hair, put on
a space suit and more." The first half is slice 3b of the planet friends
architecture (plans/planet-friends-architecture.md section 7.1, designed
and unbuilt); the second half is new, recorded in decisions.md, and sits
beside the locked "cast stay the cast" rule rather than against it: the
Friends stay exactly who they are, and the child gets their OWN explorer
figure, which the cast rule never covered.

Lane: the child planets (kid toy). No migration numbers claimed: the
architecture's own rule holds, the save stays one document in
planet_homes.state and the planets are registry data, so there are no
table changes.

## What ships in this slice

1. THE STAR SYSTEM MAP. A full screen sky in the toy's night palette,
   DiGi the star at the centre, orbit rings, and every planet of the
   section 7.5 catalogue floating on them: the home planet bright and
   drawn at its growth stage, open planets lit, everything else a pale
   outline with the small picture of what opens it (a book for a lesson,
   the mission's emoji, a sprout for growth). No padlock, no countdown,
   no nag. GSAP drift, reduced motion honoured, reached from a map
   button on the home planet.
2. UNLOCKS ON THE SERVER. Which planets are open is computed at view
   time from lesson_completions and kid_lesson_missions counts, missions
   approved and the growth stage, exactly as section 7.4 orders it, and
   arrives on HomeView as data. The client reports, the server decides:
   a travel event into a locked planet is dropped in server.ts, and the
   pure rules never need to know about unlocking.
3. TRAVEL. Tap an open planet, one short GSAP flight, and the child
   lands in its first room with the Friend they brought. Moonbase School
   (the classroom) and the Playground planet open by the first and
   second lesson passed, each shipping one visitable room this slice;
   their second rooms and their things arrive as drops (3c, 3d). Where a
   Friend is persists through the existing room_move event with the
   Where union extended, so the Den machinery is untouched.
4. THE SELF. The child builds their own explorer: skin tone, hair style,
   hair colour, space suit colour. Drawn in SVG in the FriendFigure
   idiom (feet origin, ink outlines, the house palette), standing with
   the Friends on the home planet and riding the rocket on the map. The
   builder is a sheet in the Duolingo pattern: big live preview, chunky
   tabs, swatch grids a four year old can tap. Saved as home.self via a
   new self_set event validated in the pure rules; play state in the
   existing document, nothing new collected about the child, and the
   choices are the child's own to change any time.

## Rules that hold

Server authoritative clock, no model on the child side (the child guard
script covers the new files), nothing buzzes the child, no scores, no
timers on screen, a locked planet never nags, and the Playwright pass at
390 and 1280 walks the map, the flight, both new rooms and the whole
builder before this ships.

## Mobbin references

Tolan's universe screen (planets on orbit rings in deep space) for the
map's bones; Duolingo's avatar builder and Alan's create your avatar for
the builder's shape. Translated into the toy's own night palette, Nunito
and ink outlines, never a copy.

## Out of scope, queued behind this

The rocket pocket and things travelling (7.2), the device ladder beyond
the MoonPhone (3c), the Star Cafe, the Wild planet and the drops (3d),
orbit dragging, and outfits for the self figure beyond the suit colours
(a drop once the wardrobe pattern extends to it).
