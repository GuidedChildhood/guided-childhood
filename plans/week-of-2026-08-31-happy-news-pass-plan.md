# The Happy News pass: circle plates, story icons, butter tab bar

Justin, 2 September 2026, after the teardown of The Happy Newspaper
(design-refs/happy-newspaper-notes.md): "go for your pick". The pick was
three of the six, as one child app pass.

## The build

1. **Circle plates.** A soft pastel circle behind the hero drawing, the way
   the post box sits in a pink circle: the friend on the day done screen,
   the friend on the squad intro, the cutout on the friend arrival. One
   component, `Plate` in HappyNewsBits: a crayon tinted circle with a thin
   ink edge and two smiley dots, the drawing on top.
2. **Story icons.** The home tile icons show the situation, not the
   object: Ask for a job is a hand holding up an idea card, Use my time is
   a timer with a job ticked beside it, My lessons is a book with a bulb
   lit over it, Printables is a crayon drawing a smiley on paper.
3. **Butter tab bar.** The child's sticky Quests, Lessons, Printables bar
   becomes a butter surface with an ink edge and ledge; the chosen tab is
   a white card, the others ink on butter. The one place butter is a
   surface, like the yellow shop strip.

Nothing underneath changes: same tabs, same taps, same badges.

## Checks

- /dev/kid-home (tiles, icons), /dev/kid-day-done (plate), the tab bar on
  the fixture at phone width.
- tsc, wiring, dash grep, checkin guard.
