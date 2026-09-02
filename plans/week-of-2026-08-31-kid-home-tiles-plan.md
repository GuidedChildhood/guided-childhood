# Child home tiles: the happy news finish, and games back on the front

Justin, 2 September 2026, with the child's home grid: "without changing
anything underneath, make the design of the child app home page more Apple
level UX, happy news webpage style icons, to look as good as the printables
page. Check Mobbin, super top level design for kids. Also where do games
appear?"

## What is there

- The grid is inline in KidQuestScreen: Use my time full width, then six
  white tiles (My wins, My passport, My lessons, Our deal, Make it mine, Ask
  for a job, Printables), then Meet the Planet Friends and Telling a grown
  up. Phone emoji in pale squares, hairline borders, a soft grey ledge.
- Games live on the Lessons tab as a sub tab (Watch, Learn, Games), and the
  five a day can point at them. Nothing on the home grid says Games.

## Reference (Mobbin)

Duolingo Math Games: white tiles, one big drawn icon centred, the label
under it. Duolingo ABC library: every tile a picture first. That is the
shape, in our ink edges, hard ledges and crayon colours.

## The build

- `components/kid/KidHomeTiles.tsx`: the grid as a component with the same
  tile list and the same handlers passed in. Tiles wear the bold finish
  (2px ink edge, 0 4px 0 ink ledge, radius 20), a big drawn icon centred on
  a crayon tint, the label under it, the sub line small.
- `HappyIcon`: a drawn set in the printables style (ink line, crayon
  fills): time, wins, passport, lessons, deal, make, ask, print, games,
  tell, friends.
- A Games tile when the stage has games, opening the Lessons tab on Games.
- Use my time keeps its full width shape with the same finish and the
  minutes on a sticker.
- Dev fixture /dev/kid-home.

## Checks

- Phone width screenshot of the fixture, every tile tapped in the real app
  still opens the same thing (handlers unchanged).
- tsc, wiring, dash grep, checkin guard.
