# Planet Friends slice 1: the home planet, the pod, the star and the night

Justin, 2 September 2026: "it's not Planter Friends, it's Planet Friends ...
the cast we have as Planet Friends already designed and planets not gardens
... give it a full rebuild please and the younger one could be mini
characters as babies until they all reach the age ... I did migrate the 251
so please redo all of it properly ... remember we are trying to combine
offline activity and balance responsible device use with online education."

This is the rebuilt first slice from `plans/planet-friends-architecture.md`,
section 6. The garden build (PR 957, migration 251) is retired by it.

## What ships in this slice

- The home planet on the child link at `/k/{token}/planet`, reached from a
  My planet tile on the Games tab, after the games. The child's own Planet
  Friends from `lib/content/stage-characters.ts`, real cut out art. Pebble at
  Tier 1 (ages 3 to 5), Pebble and Bloop at Tier 2 (6 to 9), tier and age
  from date of birth, else from the age band. Tier 3 waits for slice 4.
- The cast as babies: every Friend is on the planet from day one, a baby in
  a bonnet until the child reaches the bottom of that Friend's stage (Pebble
  at 4, Bloop 8, Orbit 11, Nova 13, Cosmo 16), then grown up in the real
  art. The Friends not yet looked after sleep in a nursery dome in orbit.
- Tactile play: drag the stardust shaker over a Friend, tickle a Friend, boop
  a crater, float a cloud over someone (Tier 2). Sound on every touch, mute
  in the corner.
- Balanced device use, modelled: each Friend has a MoonPhone in hand while
  it plays, and the phone goes to the charger pad the moment the Friend is
  sleepy or resting, before the child is asked to do anything.
- The Starlight loop: starlight runs down while the child plays (15 minutes
  at Tier 1, 20 at Tier 2), the Friend yawns at 20 and sits at 0, and rests
  three ways on the server's clock: the pod (drag to the pod, 15 real
  minutes, locks the screen when every Friend is asleep), the sunshine
  mission (drag to the sun catcher, Catch the sunshine, 3 real minutes), and
  the slow orbit (15 minutes with the orbit clock and the music box). The
  planet grows only when a rest closes, and the child sees it on return.
- Online education, one door away: the growth reveal carries Learn with
  Pebble into the child's lessons. Slice 2 makes a lesson a mission with a
  reward on the planet.
- The night: bedtime read from `child_time_settings`, never set by the toy.
  Thirty minutes before, the sky goes evening and the phones go to the
  charger. At bedtime the Friends pull on nightcaps, curl into their pods and
  the planet turns to its night side. Overnight growth lands once per night.
- Never allow or deny, inside a toy: every locked overlay carries Ask my
  grown up. The pod ask pops up in the parent's AskPopup beside device time
  asks. The bedtime ask IS the existing device time ask, and the parent's yes
  opens a play window.

## Data and routes

- Migration 252 (claimed in the PR title): drops the empty garden tables
  from 251 and creates `planet_homes` and `planet_events`. Both cascade from
  `children` and `auth.users`.
- `app/api/kid/planet/state` (GET, token) and `app/api/kid/planet/event`
  (POST, token). The client reports, the server decides.
- The parent feed `/api/quests/time/active` carries the planet ask, and
  `app/api/quests/planet/ask` (parent session) answers it.
- `scripts/check-child-has-no-model.mjs` covers `lib/planet` and
  `components/planet`.

## Where the logic lives

`lib/planet/logic.ts` is pure and import free: the tier table, the baby
rule, starlight drain, rests, the planet's growth, the bedtime phase and the
night key. The server, the dev fixture and `scripts/check-planet-logic.mjs`
all run the same functions.

## Checks

- `npx tsc --noEmit`, `node scripts/wiring-check.mjs`,
  `node scripts/check-child-has-no-model.mjs`,
  `node --experimental-strip-types scripts/check-planet-logic.mjs`.
- Playwright against `/dev/planet` at 390 and 1280: every slot dragged,
  every button tapped, the baby and grown up cast, the pod lock, the
  sunshine frame, the orbit clock, the night overlay.
- The dash check over every line in `lib/planet/registry.ts`.

## Not in this slice

Missions and the mission board (slice 2), the playground, the cafe and the
malware loop (slice 3), StarNet and the Tier 3 schedule (slice 4).
