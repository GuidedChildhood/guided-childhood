# Make the star chart builder the app starter pack

Lane: platform code (printables). Branch `claude/etsy-printables-research-izl4ex`
(restarted from main after PR 550 merged). No migration.

## Decisions taken (from Justin)

- Retire the old multi page Starter Pack **in the app only**. Keep the marketing
  email lead magnet (the separate MAGNETS registry + `/starter-pack` +
  `/printables/starter-pack-colour.pdf`) exactly as it is.
- Move the "Ran the chart on paper this week?" log a week card from the Quests
  page to sit **under** the "Build your star chart" card on Printables.

## Changes

- `lib/printables/registry.ts`: add `retired?: boolean`; mark the `starter-pack`
  printable `retired: true`. `printablesForStage` now drops retired sheets;
  new `LIBRARY_PRINTABLES` (retired filtered out) powers the library grid.
  `getPrintable` is left unfiltered so old completions and any by key lookup
  still resolve. The marketing lead magnet is untouched.
- `app/(dashboard)/dashboard/printables/page.tsx`: build the grid from
  `LIBRARY_PRINTABLES`; fetch the named children; render `FridgeChartLog` under
  the star chart card; refresh the card blurb to name the chart plus the cut out
  stars (it is the starter pack now).
- `app/(dashboard)/dashboard/quests/page.tsx`: remove `FridgeChartLog` (moved).

## Not done (deliberately)

- Passport page icons / cleaner stars: Justin said this is detailed in other
  chats I do not have. Left out of this change.
- Porting the old booklet's extra activity pages (wake up workout, breakfast
  plate, print and play game) into the builder: the chart is the hero and we
  agreed the characters were enough. Can add specific pages on request.
