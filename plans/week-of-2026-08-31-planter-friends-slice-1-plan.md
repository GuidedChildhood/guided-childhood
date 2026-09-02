# Planter Friends slice 1: the greenhouse, the nap, the sun and the night

Justin, 2 September 2026, on the design document: "1 agreed with direction
2 ship together 3 new can be typed let's go ahead." So missions pay in the
garden only, slice 1 ships to Tier 1 and Tier 2 together, and typed plant
names are allowed at Tier 3 (slice 4). This is the first build slice from
`plans/planter-friends-architecture.md`, section 6.

## What ships in this slice

- The greenhouse sandbox on the child link at `/k/{token}/garden`, reached
  from a My garden tile on the Games tab. One plant at Tier 1 (ages 3 to 5),
  two at Tier 2 (ages 6 to 9), tier derived from date of birth, else from
  the age band. Tier 3 waits for slice 4, so the tile hides for it.
- Tactile play: drag the watering can, tap and pat the soil, tickle a plant,
  slide the sun shade (Tier 2). Sound on every touch, mute in the corner.
- The Photosynthesis loop: energy runs down while the child plays (15 minutes
  at Tier 1, 20 at Tier 2), the plant yawns at 20, sits down at 0, and rests
  three ways, all on the server's clock: the nap (drag to the bed, 15 real
  minutes, locks the screen when every plant is asleep), the sunlight mission
  (drag to the window, Catch the sunshine, 3 real minutes), and the ambient
  wait (15 minutes with the slow clock and the music box). Growth is applied
  only when a rest closes, and the child sees it on return.
- The night: bedtime read from `child_time_settings`, never set by the toy.
  Thirty minutes before, the greenhouse dims and the plants yawn. At bedtime
  they pull on pyjamas, curl into their pots and the screen becomes the night
  overlay. Overnight growth lands once per night and is the biggest reveal of
  the day.
- Never allow or deny, inside a toy: every locked overlay carries Ask my
  grown up. The nap ask pops up in the parent's AskPopup beside device time
  asks (Yes wakes the plants early, Not now says so kindly). The bedtime ask
  IS the existing device time ask: ten minutes on this screen, which inside a
  protected window already goes to the parent, and the parent's yes opens a
  play window in the greenhouse.

## Data and routes

- Migration 251 (claimed in the PR title): `planter_gardens` (one JSON save
  per child, plus the pending ask) and `planter_events` (append only ledger).
  Both cascade from `children` and `auth.users`, so deletion stays true.
- `app/api/kid/planter/state` (GET, token) and `app/api/kid/planter/event`
  (POST, token). The client reports, the server decides: cooldown end times
  and growth are computed server side from London time.
- The parent feed `/api/quests/time/active` carries the garden ask, and
  `app/api/quests/planter/ask` (parent session) answers it.
- `scripts/check-child-has-no-model.mjs` gains `lib/planter` and
  `components/planter`. No model anywhere near this.

## Where the logic lives

`lib/planter/logic.ts` is pure and import free: the tier table, energy drain,
cooldowns, growth, the bedtime phase and the night key. The server, the dev
fixture and `scripts/check-planter-logic.mjs` all run the same functions, so
the toy cannot disagree with itself.

## Checks

- `npx tsc --noEmit`, `node scripts/wiring-check.mjs`,
  `node scripts/check-child-has-no-model.mjs`,
  `node --experimental-strip-types scripts/check-planter-logic.mjs`.
- Playwright against `/dev/planter` at 390 and 1280: every slot dragged,
  every button tapped, the nap lock, the sunlight frame, the night overlay.
- The dash check over every line in `lib/planter/registry.ts`.

## Not in this slice

Missions and the seed drawer (slice 2), the playground, the cafe and the
malware loop (slice 3), SproutNet and the Tier 3 schedule (slice 4).
