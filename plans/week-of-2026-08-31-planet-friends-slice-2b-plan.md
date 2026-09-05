# Planet Friends slice 2b: the paper twins, the Moonflower card, the grown up prompts

Written 2 September 2026 after Justin's "Word" (the go for 2b) and his
"can't see the new game?" (fixed separately in PR 963: the planet is a tile
on the child's home now, for every age). Design: plans/planet-friends-architecture.md
sections 3.2 (the paper twin), 5.1 (the Tier 1 colouring sheet) and 5.2 (the
unlock code puzzles). This plan was written against a code map of what
exists, so every piece below lands on a real file.

## The three things it ships

1. **A printed twin of every mission.** One A4 sheet per mission through the
   drawn sheets engine the printables already use: the steps as big pictures
   a child who cannot read can follow, a circle to colour when it is done, the
   reward drawn on it, and the grown up's prompt at the bottom. A family with
   no phone in the child's hand at all can run the whole engine from paper
   and the parent's yes.
2. **The Moonflower card.** A new Tier 2 and 3 mission with a hidden card: the
   grown up prints it, hides it where the mission says, the child finds it
   and taps the code from it on the planet. The code is made by the server for
   this child, never shown to the child's device, and checked by the server.
   At 6 and 7 it is three pictures tapped in order; from 8 it is four letters
   from a small word. A wrong code says not quite and nothing else, with no
   lockout and no count of tries. The reward is a moonflower, a pale flower on
   the planet that opens at night.
3. **The grown up prompts as scripts rows.** Every mission's "one thing to
   talk about" leaves the code and becomes a row in the `scripts` table, so it
   updates without a deploy and the parent can open it like any other script.
   The mission ask in AskPopup gets a "Talk about it" link to it and the
   printed sheet carries its lines.

## What exists and is reused (from the code map)

- Drawn sheets: `components/printables/drawn/index.tsx` (`DRAWN_KEYS`,
  `DrawnSpec`, one switch), `HappyPaper.tsx` (A4 at 794 by 1077, 285mm on
  purpose, `@page` and the zoom reset, `TickCircle`, `WriteLine`, the crayon
  palette), `shared/components/PrintBrand.tsx`.
- The parent route `app/(dashboard)/dashboard/printables/sheet/[key]/page.tsx`
  with `SheetPrintClient.tsx` (session, paywall, child pills, the print
  button that opens away from the installed app).
- The printables registry `lib/printables/registry.ts`: a `drawn` entry per
  sheet, listed on `/dashboard/printables` with `PrintableActions`.
- The child twin `app/k/[token]/print/page.tsx` for a token scoped print.
- Scripts: `public.scripts`, keyed by `sort_order` (the URL of a script is
  `/dashboard/scripts/<sort_order>`), seeded by delete then flat insert,
  high water mark 9624. Detail view `components/scripts/ScriptDetailView.tsx`.
- Codes: `227_passport_codes.sql` for the pgcrypto pattern.
- The planet: `lib/planet/logic.ts` (`applyEvent(home, ev, now, defs)` checks
  a code proof against `defs[key].answer`, so a per child answer is merged
  into the defs by the server and the pure rules stay pure), `missions.ts`,
  `server.ts`, `components/planet/MissionBoard.tsx` (the digit pad).

## The build, in order

1. **Migration 253** (claimed in the PR title).
   `planet_codes(child_id uuid references children on delete cascade,
   mission_key text, code text[] not null, made_at timestamptz, printed_at
   timestamptz, primary key (child_id, mission_key))`, RLS own rows through
   `children.parent_id`, service role full. Plus the scripts rows for the
   nine missions in a fresh block from 9630, stage by the youngest tier the
   mission serves, category per the eight in `151_script_categories.sql`,
   `is_free true` (the toy is on the child link for every family). Idempotent:
   delete the block, flat insert, no DO blocks.
2. **The catalogue.** `moonflower_card` in `lib/planet/missions.ts` (tiers 2
   and 3, proof `code`, `perChild: true`, reward `moonflower`), a `scriptOrder`
   on every mission, `grownupLine` retired in favour of the row. `RewardKey`
   gains `moonflower`; `HomePlanet.tsx` draws it (closed by day, open and
   glowing on the night side); `REWARD_LABELS` names it.
3. **The server.** `lib/planet/server.ts`: `codesFor(admin, childId)` reads
   `planet_codes`; `applyHomeEvent` merges the child's answers into the defs
   for a `mission_claim`; `HomeView.printed` lists the mission keys whose card
   has been printed, so the board knows. `makeCode(childAge)` builds three
   pictures from six or a four letter word from a fixed safe list. The parent
   sheet route makes the code on first print (`upsert` on the pair) and
   stamps `printed_at`.
4. **The pad.** `MissionBoard.tsx` renders the pad by `Mission.pad`: digits
   (the counting hunt), pictures (six big tiles, the three tapped shown above
   as filled slots, Duolingo ABC's grown up gate shape), or letters (the
   word's letters among decoys). Before the card is printed the card mission
   says "Your grown up prints the Moonflower card first" and shows no pad.
   `childAge` comes in as a prop from `HomeView`.
5. **The sheets.** `DRAWN_KEYS` gains `mission-sheet`; `DrawnSpec` gains
   `mission?: { key; steps; reward; prompt; code? }`; `MissionSheet.tsx`
   draws it on `HappyPaper`: title and kicker, three numbered picture steps,
   the reward named and drawn, one big tick circle to colour, the grown up
   prompt from the scripts row, and for the card the code tokens inside a cut
   out frame with "hide me" on it. Nine registry entries `planet-<key>` with
   `drawn: 'mission-sheet'`, kind `challenge`, stages by tier, free. The sheet
   page reads the mission from the printable key. `/dev/drawn-sheets` shows
   them all.
6. **The parent surfaces.** `AskPopup` mission variant: a "Talk about it"
   link to `/dashboard/scripts/<scriptOrder>`. `/dashboard/quests`: one line
   under the deal block per child, "Print their Planet Friends missions",
   linking to the printables page. The printables page already lists the new
   entries under Made for {child}.
7. **Checks before the PR leaves draft.** `scripts/check-planet-logic.mjs`
   gains the per child answer case; a print fit check on all nine sheets (one
   page each, the `check-print-fit.mjs` pattern); Playwright at 390 and 1280
   for the pad in all three shapes, the not printed state, the sheets
   rendering; `tsc`, `wiring-check`, the child guard, the dash grep over every
   new line of copy.

## Not in 2b

The Tier 3 schedule, the study timer and trust (slice 4). Pictorial codes
printed as stickers (a card is enough). A parent sending a mission from the
parent app (the design's `parentSends`) waits until the board has lived a
week.

## References gathered before building (Mobbin)

Duolingo ABC's grown up gate for the pad (chunky tiles, the typed sequence as
big glyphs with an empty slot), Opera's code grid for the highlighted tokens,
Optimal Workshop's guide list with its print button top right for the parent
entry. Translated into butter and ink and Nunito, never copied.
