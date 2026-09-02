# Planter Friends: Growing Up Digital

**System architecture and feature design, Fable 5.1 edition.** Written
2 September 2026 from Justin's brief. Status: design only, nothing built.
When it is built, the code is right and this file gets updated, the same rule
THE-STORY.md runs on.

**What this file is.** The whole design for an open ended digital toy that
lives on the child link: the entities and components, the scene nodes, every
state machine, the sync hooks between the real world and the screen, and how
it scales from a three year old on a parent's lap to a tween running their
own study timer. Read the one line and section 1 for the idea. Read 2 to 5 to
build it. Section 6 says what it reuses, what is new, and the three things
Justin has to decide.

## The one line

A garden of plant friends who need the real world to grow. They get sleepy on
screens, they grow while the child is away, and the best seeds are only found
outside.

Said at the school gate: *it is like Toca Boca, except the plants go to sleep
when it is time to put the tablet down, and they grow while you are out on a
walk.*

## Where it sits in the product

- It lives on the child link (`app/k/[token]`) as a My garden tile beside
  Games to play. Token scoped, no account, no login, and no model, ever.
- The grown up's side is the parent app they already open every morning.
  Missions and night time asks arrive in the same pop up sheet as device time
  asks (`components/quests/AskPopup.tsx`), and the paper twin of every mission
  prints through the printables engine.
- The cast is the cast. DiGi the golden star is the guide. The Planet Friends
  the child has earned (`lib/content/stage-characters.ts`) are the gardeners.
  The plants are new characters that belong to the toy. A child who has not
  earned a Friend yet gardens with DiGi.
- The star economy is untouched. The toy mints no stars and spends none. Its
  rewards are seeds, pots and growth, so there is never a second currency to
  reconcile with `streakCurrency`.

## The Fable 5.1 vocabulary as used here

| Term | Meaning here | What it becomes in this repo |
| --- | --- | --- |
| Entity | A thing in the world with an id and components | A typed object inside the garden state document |
| Component | A bag of state with invariants, attached to an entity | A TypeScript type plus pure update functions in `lib/planter/` |
| Node | A scene or overlay in the scene graph | A React component under `components/planter/` |
| FsmNode | A node driven by an explicit state machine | A pure reducer in `lib/planter/fsm/` with a transition table and unit tests |
| SyncHook | A bridge between real time or a real person and the toy | A browser event, a token scoped route, or a parent app approval |
| Registry | Content as data | `lib/planter/registry.ts`, the same shape as the quest games registry |

The renderers live in the app, the content lives as data, and scoring and
time are decided by the server. That is how the quest games were built
(`lib/quest-games/registry.ts`, `components/quest-games/QuestGamePlayer.tsx`)
and the toy follows it exactly.

## 0. The rules it inherits

Every mechanic below was checked against these. If a future change breaks
one, the change is wrong, not the rule.

1. **Never allow or deny.** A lock in this toy is a lock on the plants, never
   on the child. Every locked state carries one door, Ask my grown up, and
   the ask lands on the parent as a Yes or a Not now.
2. **Connection is the protection.** Nothing here polices. The toy models the
   habit through the plants and hands the real decisions to the family.
3. **The child is a participant.** Missions are things the child chooses to
   do with a grown up. The grown up's tap is a shared moment, not an
   inspection.
4. **Evidence or silence.** The tier timings lean on the screen guides
   already in `lib/quests/screen-balance.ts` (WHO, AAP, RCPCH) and on
   nothing invented.
5. **Zero model calls on the child's side.**
   `scripts/check-child-has-no-model.mjs` gains `lib/planter`,
   `components/planter` and `app/api/kid/planter` the day they exist.
6. **Nothing buzzes a child at night, and this toy never buzzes a child at
   all.** A nap that ends, a seed that is ready, a Friend that woke up: all
   of it waits quietly for the next open. The toy never calls the child back.
7. **No loss language.** Plants get sleepy. They are never sick from neglect
   and never dead. A garden left for a month is a garden that grew for a
   month.
8. **Anti slot machine** (`plans/quest-games-plan.md`, section 8). Fixed and
   transparent rewards, no random drops, no countdown urgency, no daily login
   pressure, calm finality.
9. **No new collection of a child's data without Justin's explicit yes.** The
   toy stores one play state document per child and nothing else. No camera,
   no microphone, no location, no light sensor, and no free text at Tier 1
   or 2.
10. **The design system.** Nunito, IBM Plex Mono, butter and ink, the child's
    own chosen theme colour (`lib/kid/theme.ts`), 16px radius buttons with
    the hard 5px ledge, GSAP only, no Three.js, no physics engine.
11. **No dashes** in any line a child or parent sees.
12. **Content as data.** The mission catalogue, the plant catalogue and every
    spoken line are registry entries or database rows, never strings inside
    a renderer. The grown up conversation prompt that rides each mission is a
    `scripts` table row, so it updates without a deploy.

---

## 1. Architectural overview and the hybrid play loop

### 1.1 Global design intent: Phygital Balance

A Toca Boca toy is brilliant because it has no goals, no scores and no fail
state, and a child can play it for two hours. That last part is the problem
this toy solves. Planter Friends keeps the first three and changes the fourth:
the toy ends its own sessions, gently and by design, because the plants
themselves need things that are not on the screen.

Three laws.

**The screen is never the prize and never the punishment.** The toy never
says "you have played too long". The plants get sleepy, which is a fact about
plants, and the child is the one who tucks them in. The family's own deal
(core minutes, stars, protected windows) governs the device. The toy governs
the plants. The two agree because every play length in section 5 sits inside
the daily guides the family deal already uses.

**Growth happens while you are away.** This is the whole mechanic. Watering
and tending on screen is fun but grows nothing. Growth ticks during naps,
during real world missions and overnight, and the first thing a child sees on
return is what changed while they were gone. Coming back is rewarded. Staying
is not punished, it simply grows nothing.

**The real world is proven by time and by a grown up, never by
surveillance.** No camera to check the leaf, no microphone, no location for
the walk, no light sensor for the sunny window. A real clock the child cannot
skip, and a grown up's tap, are the only two kinds of proof the toy accepts.
That is a privacy position, and it is also the point: the grown up's tap is
the shared moment the whole product is built around.

### 1.2 The hybrid play loop

One loop, four beats, and the child always knows which beat they are in.

1. **PLAY.** The tactile sandbox. Drag water, dig, shade, dress the plants,
   hand a Friend its LeafPhone. Every touch makes a sound and nothing can be
   done wrong. Length by tier: 15 minutes at Tier 1, 20 at Tier 2, the
   child's own setting at Tier 3.
2. **SLEEPY.** Energy runs down. A plant yawns, the greenhouse light warms
   and lowers, the Friend puts its LeafPhone on the charger by itself. This
   is the modelling beat: the character does the thing we want the child to
   do, before the child is asked to do anything.
3. **OFFLINE.** One of three exits, all in real time: the nap (the child's
   choice, it locks the plants), the sunlight mission (three minutes at a
   real window), or the ambient wait (fifteen minutes of the music box or
   the slow clock). At Tier 2 and 3 a real world mission can be picked here
   too.
4. **RETURN.** The garden has changed because they were away: a plant is
   taller, a bud opened, the leaves from the walk are now a nest. One "while
   you were away" line, then straight back to PLAY.

Everything in sections 2 to 5 makes one of those four beats richer. Nothing
adds a fifth.

### 1.3 Fable 5.1 system setup

#### Core entities

```ts
// lib/planter/entities.ts   (design sketch, not code yet)

type EntityId = string

/** A plant character the child looks after. One to six per garden by tier. */
type PlanterFriend = {
  id: EntityId
  kind: 'planter'
  species: SpeciesKey            // from the plant registry: sunny sunflower, moonflower, ...
  name: NameKey                  // picked from a list at Tier 1 and 2, typed at Tier 3
  gardener: 'digi' | StageCharacterKey   // DiGi, or an earned Planet Friend
  energy: EnergyDrainComponent
  growth: GrowthComponent
  mood: MoodComponent
  pot: PotComponent
  deviceId: EntityId | null      // the LeafPhone or SproutPad it is holding
  lock: SecurityLockComponent | null   // present once the malware loop has been remediated
  schedule: ScheduleComponent | null   // Tier 3 only
}

/** A pretend device a PlanterFriend can hold. Never the child's real device. */
type DigitalDevice = {
  id: EntityId
  kind: 'device'
  model: 'LeafPhone' | 'SproutPad'
  state: DeviceStateComponent
  ownerId: EntityId | null
}

/** The one node that knows about real time and real people. A singleton. */
type OfflineSyncNode = {
  kind: 'sync'
  serverNow: string              // London time from the server, the clock of record
  cooldown: OfflineCooldownTimer | null
  bedtime: BedtimeWindow         // read from child_time_settings, never set by the toy
  pendingAsks: PendingAsk[]      // missions and night asks waiting for a grown up
  lastSyncedAt: string
}

/** The whole save. One JSON document per child, one row in planter_gardens. */
type GardenRoot = {
  version: number
  childId: string
  tier: TierComponent
  scene: 'greenhouse' | 'playground' | 'cafe'
  overlay: 'none' | 'nursery' | 'clock' | 'musicbox' | 'night' | 'growrest'
  friends: PlanterFriend[]
  devices: DigitalDevice[]
  inventory: { seeds: SeedKey[]; pots: PotKey[]; decorations: DecorKey[] }
  missions: MissionState[]
  sync: OfflineSyncNode
}
```

#### Fundamental components

```ts
// lib/planter/components.ts   (design sketch)

/** What a pretend device is doing. Drives the Photosynthesis loop. */
type DeviceStateComponent = {
  state: 'Docked' | 'InUse' | 'Recharging'
  battery: number                // 0 to 100
  activity: 'photos' | 'sproutnet' | 'game' | 'homework' | null
  sinceServerTime: string        // when the state last changed, server clock
}

/** The plant's energy. One number, activity multipliers, tier scaled. */
type EnergyDrainComponent = {
  energy: number                 // 0 to 100
  drainPerMinute: number         // base rate: 100 divided by the tier's play length
  multiplier: 1 | 2 | 3          // 1 sandbox, 2 holding a device, 3 at a cafe table
  sleepyAt: 20                   // the yawn threshold
  depletedAt: 0
}

/** A real world wait the client displays and the server decides. */
type OfflineCooldownTimer = {
  reason: 'nap' | 'recharge' | 'sunlight' | 'ambient' | 'bench' | 'grow_and_rest'
  startedAt: string              // server clock
  endsAt: string                 // server clock, computed server side
  lengthMinutes: number
  earlyExit: 'ask_grownup'       // the one door, always present
}

/** Growth only ever moves during offline beats. */
type GrowthComponent = {
  stage: 0 | 1 | 2 | 3 | 4 | 5   // seed, sprout, leaf, bud, bloom, seedhead
  progress: number               // 0 to 100 toward the next stage
  lastGrewAt: string
  grewWhileAway: number          // shown once on return, then cleared
}

type MoodComponent = {
  mood: 'happy' | 'sleepy' | 'wobbly' | 'poorly' | 'asleep' | 'focused'
}

type PotComponent = { pot: PotKey; decorations: DecorKey[] }

type SecurityLockComponent = {
  appliedAt: string
  ritual: ('told_grownup' | 'closed_popup' | 'updated_shell' | 'flower_password')[]
  immuneUntil: string            // a while, then a mushroom can come back to be practised on
}

type TierComponent = {
  tier: 1 | 2 | 3
  stageId: 1 | 2 | 3 | 4 | 5     // the platform stage, for the gardener and the copy
  derivedFrom: 'date_of_birth' | 'age_band'
}

/** Tier 3 only. The child programs the plant's day. */
type ScheduleComponent = {
  blocks: { kind: 'grow' | 'rest'; minutes: number; label: ScheduleLabelKey }[]
  plantBedtime: { start: string; end: string } | null
  trust: 'grownup' | 'shared' | 'self'
}
```

Invariants, enforced in the pure update functions and their tests:

- `energy` never rises while `overlay` is `none` and the tab is visible. Energy
  is restored only by an `OfflineCooldownTimer` the server has closed.
- `growth.progress` never rises inside PLAY. Growth is applied by the server
  when it closes a cooldown, approves a mission, or crosses a bedtime end.
- A `DigitalDevice` with `battery` 0 is `Recharging` and cannot be picked up.
- `plantBedtime` may sit inside the family's bedtime window, never outside it.
  Stricter is allowed, looser becomes an ask.
- Exactly one `overlay` at a time, and every overlay except `none` renders the
  `AskDoor`.

#### Where the state lives

Three tables. Migration numbers are claimed at build time under the multi
session rules; 250 is the highest on main today.

| Table | Row | Why |
| --- | --- | --- |
| `planter_gardens` | one per child: `child_id`, `state jsonb`, `version`, `updated_at` | The save. Versioned so two tabs cannot overwrite each other |
| `planter_events` | append only: `child_id`, `kind`, `payload jsonb`, `created_at` (server) | The ledger the server decides from: cooldown started and ended, mission claimed and approved, dome used, schedule set, bedtime ask |
| `planter_codes` | `child_id`, `mission_key`, `code`, `printed_at`, `used_at` | The hidden card codes for Tier 2 missions |

`app/api/account/delete/route.ts` cascades all three, so the deletion promise
stays true. The child app is a home screen web app, so the garden is mirrored
in localStorage under the token and the sandbox plays with no network. The
mirror is a cache, never a truth: every offline beat asks the server.

#### Real time sync hooks

| Hook | Fires when | What it does |
| --- | --- | --- |
| `onVisibilityChange` | the tab hides or shows | Pause the drain when hidden (a hidden toy costs no energy, because putting the device down is the goal). On show, run `reconcile()` |
| `onServerTick` | every 60 seconds while visible | `GET /api/kid/planter/state`. Adopt `serverNow`, close any cooldown that has ended, apply `grewWhileAway` |
| `onCooldownStart` | nap, recharge, sunlight, ambient, bench, grow and rest | `POST /api/kid/planter/event` with the reason. The server writes `startedAt` and `endsAt` from its own clock and returns them. The client counts down from the server's numbers |
| `onReturn` | the toy opens, or the tab shows after a cooldown | The server compares now to `endsAt`. Over: apply growth, clear the timer, queue the while you were away line. Not over: the plants are still asleep, whatever the device clock says |
| `onGrownupAnswer` | the parent taps Yes or Not now in AskPopup | Polled every 20 seconds, the cadence AskPopup already uses. A Yes ends a nap early, opens a bedtime window, or approves a mission |
| `onBedtime` | `serverNow` crosses the bedtime start or end in `child_time_settings` | Section 3.3 |
| `onSettingsChange` | the parent edits bedtime or trust on the parent app | Picked up on the next tick. Nothing is pushed to the child |

The client reports, the server decides. A child who winds the device clock
forward sees nothing move, because growth is applied by the server on return
and the server has its own clock. That is the standing rule for every game
score in the product and it holds for every minute in this one.

---

## 2. Playsets and environment node definitions

The scene graph, with the offline transition zones marked. An offline
transition zone is any place in the world where a plant recovers, and every
one of them starts a real timer.

```
PlanterWorldRoot
  GreenhouseHomeNode              the sandbox, the default scene
    WateringSlot                  drag the can, the water pours where it is held
    DirtPatchSlot x3              dig, plant a seed, pat it down
    SunShadeSlot                  slide the shade, the light changes
    PotShelf                      swap pots and decorations
    SeedDrawer                    the seeds the child has found
    NapArea                       the bed. Drag a plant in to start a nap
    SunnyWindow        (zone)     the sunlight mission
    MissionBoard                  Tier 2 and 3, the offline missions
  DigitalPlaygroundNode           sub scene, the pretend devices
    DeviceShelf                   LeafPhone and SproutPad
    ChargerDock        (zone)     devices recharge here, in real minutes
  ScreenTimeCafeNode              sub scene, over use made visible
    CafeTable x3                  sit a Friend down with its device
    GardenBench        (zone)     nutrients recover
    ReadingCorner      (zone)     nutrients recover, Tier 2 and 3
  Overlays, one at a time, each with the AskDoor
    NightNurseryNode              during a nap
    AmbientClockNode              the fifteen minute wait
    MusicBoxNode                  Tier 1 sleepy exit, audio first
    NightSupportNode              bedtime, section 3.3
    GrowAndRestNode               Tier 3 study timer, section 5.3
```

Reference patterns pulled from Mobbin before design: Finch's home scene with
the companion in the middle and an away timer ("adventuring, back in 2:33")
for the away beat; Forest's grow ring around the plant with one big number
and one button for the Tier 3 timer; Alan's breathing companion with a single
control for the night overlays; the fixed length sleep timer lists in
Blinkist and ElevenReader for the nap length picker; Duolingo ABC's room
scene, two characters and almost no chrome, for the sandbox. Mobbin holds no
Toca Boca or Sago Mini screens, so the sandbox tactility rules below come from
those toys as published and from Pok Pok Playroom, which is already on our own
curated list. Everything is translated into butter and ink and Nunito, never
copied.

### 2.1 GreenhouseHomeNode

**Purpose.** The sandbox. This is where a Toca Boca child lives, and it has to
be at least as much fun as the thing it replaces.

**Tactility rules, all of them non negotiable for this node.**

- Everything that looks liftable lifts. Drag is pointer events on SVG, no
  physics engine. Held objects scale up 6 percent and cast the hard 5px
  ledge shadow, the same ledge as every button in the product.
- Every touch makes a sound. Water pours, dirt pats, the shade squeaks, a
  plant giggles when tickled. Sound is on by default inside the toy, one mute
  control top right, and nothing plays outside the toy.
- Nothing scores, nothing fails, nothing is timed on screen. There is no
  progress bar in PLAY. The only clock the child sees is the sun moving
  across the greenhouse roof, which is the energy component made visible.
- Chrome is two controls: back to my quests (top left, always) and mute. The
  scene changes (playground, cafe) are doors drawn in the world, not tabs.
- Mobile first, one thumb. The greenhouse is a single screen at phone width
  with no scrolling, and it widens to show the whole bench on a tablet or
  desktop. Checked at both before it is called done.

**Interactive slots.**

| Slot | Interaction | Effect on components |
| --- | --- | --- |
| WateringSlot | Drag the can over a plant, tilt by holding | `mood` to happy for a moment, a sparkle. No growth. Water is fun, not fuel |
| DirtPatchSlot | Tap to dig, drag a seed in, pat | Plants a seed: a new `PlanterFriend` at growth stage 0 |
| SunShadeSlot | Slide the shade | Changes the light and the plant's expression. At Tier 2 and 3 a shaded plant drains 20 percent slower, which is the first hint that light and energy are linked |
| PotShelf | Drag a pot or decoration onto a plant | `PotComponent`. Pure dressing up, the Toca Boca joy |
| SeedDrawer | Open, pick a seed | Seeds come only from missions and overnight growth (section 3.2). The drawer shows what each locked seed needs, in words or pictures by tier, so nothing is a mystery box |
| SunnyWindow | Drag a sleepy or depleted plant to the window | Starts the sunlight mission (section 3.1) |
| NapArea | Drag a plant into the bed | Starts a nap for that plant. When every plant is asleep the scene locks |
| MissionBoard | Tap, Tier 2 and 3 | Opens the offline missions (section 3.2) |

**The Nap Area, in detail.** This is the physical "put it to bed" of the
brief, and it is the most important slot in the toy.

1. The child drags a plant into the bed. It yawns, curls into its pot, and
   the pot pulls a leaf blanket up. `mood` becomes `asleep`.
2. `onCooldownStart('nap')` posts to the server, which returns `endsAt`. Nap
   length is 15 real minutes at Tier 1 and 2, and the child's own setting at
   Tier 3 from a fixed list (5, 10, 15, 20, 25).
3. When every plant in the garden is asleep, `NightNurseryNode` overlays the
   scene and PLAY is locked. At Tier 1 there is one plant, so one bedtime
   locks the screen, which is the direct physical feedback the brief asks
   for. At Tier 2 and 3 a child can keep one plant awake and carry on, and
   that plant keeps draining, so the loop still ends itself.
4. `NightNurseryNode`: the greenhouse goes dark blue, a moon rises, the pots
   breathe slowly, a soft loop plays. Taps do not wake anyone: a tap makes a
   ripple and a whispered "shh". Tier 1 shows no numbers, the moon fills.
   Tier 2 shows a simple clock face. Tier 3 shows the minutes.
5. Two ways out, both always present. **Back to my quests** leaves the toy
   and the nap keeps running on the server, so the child returns later to
   awake plants and growth. **Ask my grown up** is the door: one tap sends an
   ask that lands in AskPopup ("Teo wants to wake the plants early, 9 minutes
   left"). A Yes closes the cooldown early. A Not now says so kindly and the
   moon keeps filling. There is no third state and no punishment for asking.
6. When the server closes the nap, growth is applied and the next open shows
   the while you were away line, in the plant's own voice: "I grew a new leaf
   while I was napping!"

**What it teaches.** The plant sleeps because sleeping is what makes it grow.
The child is the one who decides bedtime for the plant, which is a rehearsal
for deciding it for themselves.

### 2.2 DigitalPlaygroundNode

**Purpose.** The plants have their own devices, and the child watches them use
those devices well. Every rule the family has about screens is acted out by a
character first.

**Entities instantiated here.** The DeviceShelf holds one LeafPhone at Tier 1,
a LeafPhone and a SproutPad at Tier 2 and 3. Dragging a device onto a plant
sets `deviceId`, sets `DeviceStateComponent.state` to `InUse`, and sets the
plant's `multiplier` to 2. The battery drains at the same rate as the plant's
energy, so the two gauges always agree and the child learns to read either.

**What a plant does with a device.** Small, finite, delightful activities,
each a registry entry:

| Activity | Tier | What happens |
| --- | --- | --- |
| Photos | 1, 2, 3 | Tap to snap a flower. A pretend gallery of six frames. Full means done |
| Tiny game | 2, 3 | A two tap catch the raindrop. Ends on its own after eight drops. No score |
| SproutNet | 2, 3 | Section 4.2 |
| Homework corner | 3 | The plant "works" beside the child. Section 5.3 |

**The ChargerDock, the offline transition zone of this scene.** A device at
battery 0 goes `Recharging` and cannot be picked up. Recharge is a real
5 minutes on the dock (`onCooldownStart('recharge')`), or a nap. The plant
puts its device on the dock by itself when it gets sleepy, before the child
is asked to do anything. The child can dock it early at any time, and the
plant says thank you when they do. The dock has a printed twin already: the
Phones Go To Bed sheet in the drawn printables set, so the paper on the
fridge and the dock in the toy say the same thing.

**What it teaches.** Devices are fine and fun. They run out. They go to bed on
the dock, and the plant that docks its phone early is the one with energy
left to play in the garden.

### 2.3 ScreenTimeCafeNode

**Purpose.** Over use, made visible and made kind. The cafe is a lovely place
where the plants sit with their devices, and staying too long is what makes
them wobbly.

**Layout.** Three cafe tables (as many as the tier allows plants), a counter
with a fixed menu, slightly bluer light than the greenhouse, and two exits:
the GardenBench outside the window and the ReadingCorner (Tier 2 and 3).

**The drain.** A plant at a table with a device has `multiplier` 3. Two gauges
run down together and both are drawn in the world, never as bars: the
device's battery (the screen dims) and the plant's soil nutrients (the leaves
go floppy, `mood` becomes `wobbly` at energy 20). The Tier 3 homework corner
is the exception: a device used for learning drains at 1, because learning is
the one bucket the family deal invites upward
(`lib/quests/device-time.ts`, the activity buckets).

**The no fail rule.** A plant cannot be left at a table past depletion. At
energy 0 it stands up, walks to the bench on its own, and says its line:
"Too much scrolling, my leaves went floppy. Bench time." The child never
caused harm and is never told they did. What the child can do is spot the
wobble early and carry the plant out first, which earns a happier line
("You noticed before I did!") and nothing else. The noticing is the reward.

**The offline transition zones.** GardenBench and ReadingCorner start a real
2 minute cooldown (`onCooldownStart('bench')`). During it the plant visibly
perks up, leaf by leaf, and the cafe carries on behind it. A plant coming off
the bench is at energy 60, not 100. Only a nap or a night gets it to 100,
which is true of children as well.

**What it teaches.** The cafe is not bad. The bench is where you go when you
feel wobbly. Leaving is a thing you do for yourself, and you come back
happier.

---

## 3. Core phygital mechanics

### 3.1 The Photosynthesis Cooldown Loop (FsmNode)

One machine per plant. It runs on `EnergyDrainComponent` and
`DeviceStateComponent` together, so a plant with a device in its hand and a
plant without one are the same machine at different rates.

```
PhotosynthesisFsm
  states: Charged | Draining | Sleepy | Depleted | Recharging | Waking
  routes out of Recharging: Nap | SunlightMission | AmbientWait | Bench
```

| From | Event | Guard | To | Effect |
| --- | --- | --- | --- | --- |
| Charged | `tick` | tab visible, overlay none | Draining | Energy falls by `drainPerMinute` times `multiplier` |
| Draining | `tick` | energy at or below 20 | Sleepy | The yawn. `mood` sleepy. Sun lowers, light warms. A plant holding a device docks it |
| Draining | `deviceHanded` | | Draining | `multiplier` 2. Battery ticks with energy |
| Draining | `satAtCafe` | | Draining | `multiplier` 3 |
| Sleepy | `tick` | energy 0 | Depleted | The plant sits down where it is. Device, if any, goes `Recharging` on the dock |
| Sleepy | `draggedToBed` | | Recharging (Nap) | `onCooldownStart('nap')`. Section 2.1 |
| Sleepy | `draggedToWindow` | | Recharging (SunlightMission) | `onCooldownStart('sunlight')`, 3 minutes |
| Depleted | `draggedToBed` | | Recharging (Nap) | as above |
| Depleted | `draggedToWindow` | | Recharging (SunlightMission) | as above |
| Depleted | `tick` | 20 seconds with no drag | Recharging (AmbientWait) | `onCooldownStart('ambient')`, 15 minutes. The overlay becomes AmbientClockNode |
| Sleepy or Depleted | `draggedToBench` | in the cafe | Recharging (Bench) | `onCooldownStart('bench')`, 2 minutes, restores to 60 |
| Recharging | `cooldownClosed` | server says `endsAt` has passed | Waking | Energy restored (100, or 60 from the bench). Growth applied by the server. `grewWhileAway` set |
| Recharging | `grownupYes` | an ask was answered | Waking | As above. The early wake still grows, by the minutes actually slept |
| Recharging | `grownupNotNow` | | Recharging | The plant says it is still sleepy, kindly. No change |
| Waking | `shown` | the while you were away line has been read | Charged | `grewWhileAway` cleared |

**The two speeds of waking, and why neither is better.** The brief asks for a
fast way and a slow way. The slow way is the ambient wait: the screen becomes
`AmbientClockNode`, fifteen real minutes, no taps needed. The fast way is the
sunlight mission: the child carries the device to a real sunny window and
taps the plant to "catch" the light, and the plant charges in three minutes
while a slow sun fills the screen. Both routes end at the same energy and the
same growth. The mission is faster, not better, so there is no pressure to do
it and no loss for not doing it. That is what keeps the fast route from
becoming a nag.

**The sunlight mission, exactly.**

1. The child drags a sleepy plant to the SunnyWindow slot, or taps the window
   when a plant is depleted.
2. The plant says "Find me some real sunshine. Take me to your sunniest
   window." At Tier 1 it adds "Ask your grown up to come too."
3. The screen goes to a single frame: the plant in its pot, a pale sky, and
   one big round button, Catch the sunshine. Nothing else on the screen. No
   timer is shown at Tier 1.
4. The child taps it at the window. The toy trusts the tap. There is no
   sensor and there never will be. The server starts a 3 minute cooldown, and
   the sun on the screen rises slowly over those three minutes. Taps during
   the wait add sparkles and nothing else.
5. When the server closes it, the plant stretches, says "That was real
   sunshine, I can feel it," and returns to the greenhouse at full energy.

The mission is real because the three minutes are real and because the child
physically moved. A child who taps it on the sofa gets three minutes of
looking at a sun. Nothing is lost either way and nothing is checked.

**The AmbientClockNode.** A passive overlay for the fifteen minute wait: a
slow clock face with one hand, the moon or sun by time of day, and the music
box playing a nursery rhyme at Tier 1, a slower instrumental at Tier 2 and 3.
No buttons except the AskDoor and Back to my quests. The screen dims to 40
percent brightness by CSS. The intent is a screen that is boring in the most
beautiful way, so the child puts the device down and plays with something
real while the plant recharges. When they come back the plant is up.

**Timings by tier** are in the table in section 5.

### 3.2 The Real World Copycat Engine

The engine that turns a real world activity into a change in the garden.
Rare seeds and custom pots come only from here, so "rare" has a precise
meaning in this toy: found offline, never found by chance.

**The catalogue.** Content as data. Each mission is a registry entry, and the
grown up prompt that rides it is a `scripts` row.

```ts
// lib/planter/registry.ts   (design sketch)

type Mission = {
  key: string                      // 'plant_a_real_seed'
  title: string                    // 'Plant a real seed'
  tiers: (1 | 2 | 3)[]
  steps: string[]                  // three lines at most, child reading level by tier
  together: 'required' | 'invited' | 'optional'   // grown up presence, by tier
  proof: 'grownup_tap' | 'timer' | 'hidden_code' | 'self'
  timerMinutes?: number            // for proof 'timer': the real minutes it takes
  reward: { kind: 'seed' | 'pot' | 'decoration'; key: string }   // fixed, shown up front
  transform: TransformKey          // what changes in the greenhouse when it lands
  paper: DrawnKey | null           // the printable twin in the drawn sheets registry
  scriptKey: string                // the grown up conversation prompt, scripts table
}
```

Starter catalogue, one line each:

| Mission | Tiers | Proof | Reward | Transform |
| --- | --- | --- | --- | --- |
| Plant a real seed | 1, 2, 3 | grown up tap | Sunny sunflower seed | A real terracotta pot appears on the shelf, the plant's own "twin" |
| Go for a walk and collect three leaves | 1, 2, 3 | grown up tap | Leaf nest decoration | A leaf pile blows into the greenhouse corner |
| Five minute stretch with your grown up | 1, 2, 3 | timer, 5 min | Tall bamboo seed | The greenhouse roof lifts a little higher |
| Water a real plant in your house | 1, 2 | grown up tap | Watering can, gold | The can on the WateringSlot turns gold |
| Count ten steps outside, find the card | 2 | hidden code | Moonflower seed | A moon window opens in the roof |
| Read a book in the reading corner, real one | 2, 3 | timer, 10 min | Bookshelf decoration | The ReadingCorner in the cafe gets a lamp |
| Screens off dinner, whole family | 2, 3 | grown up tap | Feast table pot | The cafe grows a garden table outside |
| Study block with your plant | 3 | timer, from the schedule | Study lamp, then seed rungs | The GrowAndRest desk fills with books |
| Teach your grown up one thing about a game you love | 3 | grown up tap | Two player seed | A second chair appears at the homework corner |

Every reward is named on the card before the mission starts. There are no
mystery seeds, no rolls, no bonus drops. A child at Tier 2 who wants the
Moonflower knows exactly which walk to take.

**The flow (FsmNode).**

```
MissionFsm
  states: Offered | Chosen | Doing | Claimed | Approved | NotNow | Transformed
```

| From | Event | To | Effect |
| --- | --- | --- | --- |
| Offered | `childPicks` or `parentSends` | Chosen | The card shows steps, who to do it with, and the named reward. A parent can also send a mission from the parent app, exactly like sending a quest |
| Chosen | `printTapped` | Chosen | The paper twin prints through the printables route, branded, A4 in millimetres, one side |
| Chosen | `startTapped` | Doing | For proof `timer`, `onCooldownStart` with the mission's minutes and a `GrowAndRestNode` style ring on screen. For every other proof, the toy simply waits, with no timer and no pressure |
| Doing | `weDidItTapped` | Claimed | The Mission Accomplished button, in child words: We did it. Proof `grownup_tap`: an ask lands in AskPopup ("Teo says you planted a real seed together. Yes?"). Proof `timer`: the server checks its clock and approves on its own. Proof `hidden_code`: the child types the code from the card, the server checks `planter_codes`. Proof `self`: Tier 3 with trust `self`, the server approves |
| Claimed | `grownupYes` | Approved | Written to `planter_events` with who approved |
| Claimed | `grownupNotNow` | NotNow | "Not this time, and that is fine. It is still on your board." The mission stays Chosen. No language of failure, no cooldown before trying again |
| Approved | `returnToGarden` | Transformed | The GSAP moment: the reward drops into the drawer, the transform plays once (the roof lifts, the leaf pile blows in). Then calm |

**The proof types, and who taps.** The child is the participant, the grown
up is the witness, the server is the clock. `grownup_tap` is the default at
Tier 1 and the norm at Tier 2. `timer` is for missions whose whole point is
the minutes. `hidden_code` is the Tier 2 special (section 5.2). `self` exists
only at Tier 3 and only when the parent has set trust to self, which is the
top rung of the same ladder the star quest runs (parent regulation, then
shared, then self). The asks travel through the same pipe as device time asks
and quest pitches, so AskPopup and the quest board carry them with no new
parent surface. Whether that is a `kind` column on the existing request table
or a small new one is decided at build time with the migration number.

**Why missions do not pay stars.** The toy's rewards are in the garden. If a
parent wants the real seed planting to earn stars as well, they add it as a
quest on the board they already have, and the star loop pays it through the
approval it always uses. The toy never mints, so there is never a second
count to reconcile with `streakCurrency`, and the day two surfaces disagree
about a child's stars does not come back. Justin's call, listed in section 6.

**The paper twin.** Every mission with `paper` set is also a drawn sheet: the
steps as pictures, a big circle to colour in when done, the star strip, and
the brand. It prints from the parent app or the child asks for it through the
existing printable ask flow. A family with no phone in the child's hand at
all can run the whole engine from paper and the parent's Yes.

### 3.3 Device Bedtime Sync (structural node)

`BedtimeSyncNode` is the one piece of the toy that runs on the family's real
routine. It never sets a bedtime. It reads the one the family already agreed
in `child_time_settings` (`lib/quests/time-tiers.ts`), in London time, and
the defaults by age band when the family has not set one:

| Age band | Default bedtime window |
| --- | --- |
| 4 to 7 | 19:00 to 07:00 |
| 8 to 10 | 20:00 to 07:00 |
| 11 to 13 | 21:00 to 07:00 |
| 13 to 15 | 22:00 to 07:00 |
| 16 plus | none, the balance is being handed over |

For a Tier 1 child under 4 the toy uses the 4 to 7 window, the youngest
default there is, until a parent sets one.

```
BedtimeSyncFsm
  states: Day | WindDown | Bedtime | Morning
```

| From | Event | Guard | To | Effect |
| --- | --- | --- | --- | --- |
| Day | `serverTick` | now is within 30 minutes of bedtime start | WindDown | Greenhouse lights dim to evening. Every plant yawns once. Plants holding devices dock them. The cafe closes its shutters. A line: "Nearly bedtime in the greenhouse." |
| WindDown | `serverTick` | now is past bedtime start | Bedtime | Every plant changes into pyjamas (a registry of five, matched to the pot), crawls into its pot, pulls the leaf blanket up. PLAY locks. `NightSupportNode` overlays |
| Day | `open` | now is inside the window | Bedtime | The toy opens straight on the night overlay, never on the sandbox. The plants were already asleep |
| Bedtime | `askTapped` | | Bedtime | An ask lands in AskPopup: "Teo opened the garden at bedtime. Ten minutes?" |
| Bedtime | `grownupYes` | | Day (window) | A 10 minute play window inside bedtime, the same protected window ask the device timer already runs. It ends by itself and returns to Bedtime with no second ask that night |
| Bedtime | `grownupNotNow` | | Bedtime | "Night night. See you in the morning." No repeat prompt |
| Bedtime | `serverTick` | now is past bedtime end | Morning | Growth applied for the whole night by the server. The plants wake, stretch, and the while you were away line is the biggest of the day: "We all grew in the night!" |
| Morning | `shown` | | Day | Back to PLAY |

**The NightSupportNode.** Peaceful and non stimulating, on purpose. Dark
blue ground, the pots breathing, a night light in the corner, DiGi the star
very small and slow in the sky, and a music box at Tier 1 that fades out
after ten minutes. Two controls only: Back to my quests, and the AskDoor. No
numbers, no countdown to morning, no "wake up in 9 hours". The one line of
copy changes with the tier: Tier 1 "The plants are asleep. Night night."
Tier 2 "Everyone is asleep. They grow while you sleep too." Tier 3 "Garden
closed till morning. Tomorrow's plan is on the desk," with the schedule the
child set shown as tomorrow's first block.

**Sync rules that make it structural rather than decorative.**

- The window is read every tick and on every open, so a parent who moves
  bedtime earlier on the parent app at 18:50 sees the greenhouse dim at
  18:50 on the child's screen. Nothing is pushed; the toy simply reads.
- Bedtime is decided by the server's London clock (`lib/time/london.ts`),
  never by the device, so the clocks changing in October cannot open the
  garden at the wrong hour and a device clock wound back cannot open it at
  all.
- Bedtime outranks everything in the toy. A nap, a mission timer or a Tier 3
  study block that runs into bedtime is closed by the bedtime transition and
  its growth is banked, so nothing is lost by stopping.
- A Tier 3 child can set `plantBedtime` earlier than the family window, and
  the plants go to bed at the child's time. Later than the family window is
  not a setting, it is an ask, sent to the parent as a proposal (section
  5.3).
- Nothing in this node ever notifies the child. `pushToChild` is not called
  from the toy. The quiet hours rule in `lib/push/quiet-hours.ts` already
  forbids it at night, and the toy simply never needs it in the day either.

---

## 4. State machines for digital citizenship

Two machines that teach safety by letting the child rescue a plant, never by
frightening the child. Both follow the judge games rule from the quest games:
every beat carries its why, in the plant's voice.

### 4.1 The Privacy and Malware loop (FsmNode)

```
MalwareFsm
  states: Idle | SuspiciousPopupTriggered | Told | InfectedState | RemediatedState
```

The trigger is a glowing mushroom that sprouts on a plant's LeafPhone screen
while the plant is using it. It is a pretend pop up: at Tier 1 "FREE RAINBOW
SEEDS! Tap now!", at Tier 2 "Your plant is in DANGER, tap to fix", at Tier 3
"Log in to SproutNet again to keep your flowers" from a sender that is
almost, but not quite, the real one.

| From | Event | To | Effect and the why line |
| --- | --- | --- | --- |
| Idle | `mushroomSprouts` | SuspiciousPopupTriggered | Guard: the plant is `InUse` and `immuneUntil` has passed. At most one a day, never in the first session of the toy. The mushroom glows and wiggles. The plant looks at the child |
| SuspiciousPopupTriggered | `shownToWiseTree` | Told | The child drags the phone to the wise old tree (DiGi's voice). "Well spotted. Glowing things that want a tap right now are usually tricks." The mushroom closes. Immunity for a while. A small bloom on the plant, bigger than anything the fix path gives, so telling beats fixing |
| SuspiciousPopupTriggered | `mushroomTapped` | InfectedState | The digital cold. The plant sneezes glitter, its leaves droop, the phone shows three silly pop ups that multiply when tapped. `mood` poorly. Energy drains at 2 while poorly. Nothing dies, nothing is lost |
| SuspiciousPopupTriggered | `ignoredFor60s` | Idle | The mushroom wilts on its own. "It gave up. They do, when you do not tap." |
| InfectedState | `remedyStep` | InfectedState | The Security Lock ritual, four drags in any order: take the phone to the wise tree (told grown up), tap the X on each pop up (closed pop up), put the phone on the dock for a real 2 minute cooldown (updated shell), and lay three flowers in a pattern the child chooses (a new password). Each step has a why line |
| InfectedState | `ritualComplete` | RemediatedState | `SecurityLockComponent` attached. A small padlock charm hangs on the pot. The plant perks up: "All better. And now I know the trick." |
| RemediatedState | `shown` | Idle | `immuneUntil` set. Later mushrooms sprout again, sneakier by tier, so the loop is practice rather than a one off |

**The telling path pays more than the fixing path.** That is deliberate and
it is the family agreement default in code already: "Nobody ever gets in
trouble for telling." The wise tree is a grown up in disguise. At Tier 1 the
plant itself suggests the tree after five seconds so a three year old cannot
get stuck. At Tier 2 the child works it out. At Tier 3 the mushroom is the
sort of thing a tween actually meets: a fake login, a too good to be true
offer, a friend request from a plant they have never met, and the remediation
adds "check who sent it" as a fifth step.

**What it never does.** No red screens, no alarm sounds, no "your plant will
die", no shame line for tapping. A tap on the mushroom is the most natural
thing in the world for a child and the toy says so: "Everyone taps one once.
Now you know."

### 4.2 The SproutNet social loop

A safe simulated network. The design constraint that makes it safe is simple
and absolute: SproutNet only ever contains the child's own plants. No other
child, no other family, no real message, nothing that leaves the device,
nothing that arrives from outside it. It is a puppet show of a social feed,
and the child holds every puppet.

**The feed.** A pretend timeline on the SproutPad where each of the child's
plants posts a picture of its flower. Posting is a two tap act at Tier 2, and
at Tier 3 it carries a ThinkBeforePost beat first: the SproutPad asks "Who
will see this?" and shows the answer, which is always "your garden", so the
child rehearses the question in a place where the answer is safe.

**Positive input: the WaterDropletEvent.** A droplet is a kind comment from
one plant to another, from a fixed list ("Love your petals!", "Your leaves are
so shiny"). Droplets are never random and never on a timer, which is the anti
slot machine rule applied to social approval. They arrive on two fixed
triggers only: one droplet back for every droplet the child's plant gives
(kindness in, kindness out, one for one), and a small set during a nap or
overnight, reported on return as "your garden sent you three droplets while
you slept", because good things happen when you are not watching the feed.

A droplet landing triggers a growth burst: a GSAP scale and glow on the
receiving plant, and `growth.progress` rises by a small fixed amount. This is
the one place growth moves on screen, and it is capped at one burst per
droplet with no stacking, so a child cannot farm it.

**Negative input: the MudSplatEvent and the TooManyDroplets flood.** Two
kinds of harm, both from the child's own plants in the puppet show, so no
real unkindness is ever shown to a child. A grumpy plant (there is always one
in the registry, and it is lovable) throws a mud splat: "Your flower is
boring." And sometimes there are too many droplets at once, the feed fills
and the plant cannot see the garden, which teaches that even attention can be
too much.

**The GlassDomeShield, a physical bounding box tool.** When a splat is in
the air, the child draws with a finger around the plant they want to protect.
The drawn loop snaps to a glass dome. The dome is a bounding box in the
scene: inside it, splats slide off and droplets still get through, so the
tool is a boundary and never a wall. Drawing the dome is the whole point.
The muscle memory the toy builds is "I can put a boundary around myself",
made physical.

Inside the dome the plant offers three small choices, each a registry line
with its why:

| Choice | What happens | The why line |
| --- | --- | --- |
| Tell the wise tree | The splat is cleaned up by the tree. The grumpy plant gets a talking to, kindly, and a droplet of its own | "Telling is the fastest way to make it stop, and it is never telling tales" |
| Mute for now | The grumpy plant's posts go quiet for the session | "You are allowed to not listen to that" |
| Step away | The plant leaves SproutNet and sits on the bench for a real 2 minute cooldown | "Sometimes the best button is the one that puts it down" |

There is no block in the destructive sense and no revenge splat. The grumpy
plant stays in the garden, because in real life the grumpy one is often a
friend on a bad day, and repair over punishment is the house position.

**Stage 4 and the ban flag.** Nothing in the loop changes when the law does.
The copy layer reads `SOCIAL_MEDIA_LAW` (`shared/social-media-law.ts`). Under
`none` the Tier 3 lines talk about "when you are on real networks". Under
`partial_ban` and `full_ban_u16` they say "the pretend network where you
practise, so you are ready at 16", and nothing ever names a real platform or
hints at a way round anything. That is a config value, never a rewrite.

---

## 5. Multi age adaptive data tiering

`TierComponent` is derived once, from `date_of_birth` on the child record
when it is set (it is asked once at signup, which is the simplification
agenda) and from `age_band` otherwise. It maps onto the platform's stage spine
like this:

| Tier | Ages | Platform stage and guide | Gardener |
| --- | --- | --- | --- |
| 1 | 3 to 5 | Hog and Robin years into Foundation | DiGi, or Pebble once earned |
| 2 | 6 to 9 | Foundation and Builder | The Friend the child chose as buddy |
| 3 | 10 plus | Explorer, Shaper, Independent | The Friend the child chose as buddy |

A Tier 1 child runs the toy on the grown up's device, opened from the
parent dashboard or from the child link on the parent's phone, which is the
Foundation guidance in the stage model already: shared family device, same
room, same screen. The child app's own stage gating starts at 4 and is not
changed by this toy. Below 4 the only surface a child meets is the garden.

**The tier configuration, in one table.** These numbers are the toy's whole
tuning and they live in one registry object so nothing is hardcoded twice.

| Setting | Tier 1 (3 to 5) | Tier 2 (6 to 9) | Tier 3 (10 plus) |
| --- | --- | --- | --- |
| Plants in the garden | 1 | up to 3 | up to 6 |
| Play before sleepy | 15 minutes | 20 minutes | the child's own setting, 15 to 45 |
| Sleepy warning | none, the plant yawns and sleeps | 3 minutes before, the sun sets | the schedule shows it |
| Nap length | 15 minutes, fixed | 15 minutes, fixed | the child picks: 5, 10, 15, 20, 25 |
| Sleepy exit | MusicBoxNode, audio first | AmbientClockNode | GrowAndRestNode or AmbientClockNode |
| Sunlight mission | 3 minutes, grown up invited | 3 minutes | 3 minutes |
| Mission proof | grown up tap, always | grown up tap, timer, hidden code | grown up, shared, or self by trust |
| Reading needed | none, pictures and sound only | short words, pictorial codes at 6 to 7 | full text |
| Devices for plants | one LeafPhone, photos only | LeafPhone and SproutPad | LeafPhone, SproutPad, homework corner |
| Cafe | closed | open, one table | open, three tables |
| Malware loop | the plant suggests the tree after 5 seconds | the child works it out | realistic pop ups, check the sender |
| SproutNet | off | on, dome tool | on, dome tool, think before post, ban flag copy |
| Night overlay | music box, near dark, no numbers | night light, clock face | quiet card with tomorrow's plan |
| Names for plants | picked from a list | picked from a list | typed, a short allowed list of characters |

**The evidence behind the play lengths.** Around an hour a day of screen at
4 to 7 and a plan rather than a number from 6 is where the WHO, AAP and RCPCH
guidance in `lib/quests/screen-balance.ts` settled. A 15 minute session at
Tier 1 fits inside that with room for the rest of the day, and a 20 minute
session at Tier 2 is short enough to end before the transition tantrum the
Stage 1 script warns about. Tier 3 hands the number to the child on purpose,
which is the self regulation rung of the ladder.

### 5.1 Tier 1 (ages 3 to 5): direct physical feedback

The toy is one plant, one greenhouse, one bed. Everything is a picture and a
sound. After fifteen minutes of play the plant gets sleepy in its body first:
it slows, it yawns twice, it rubs its leaves, it looks at the bed. If the
child does nothing for a minute, the plant walks to the bed itself and lies
down, which is the modelling. Then the screen becomes the `MusicBoxNode`.

**MusicBoxNode.** The screen goes nearly dark: a slow moon, the pot breathing,
nothing to tap. The audio is the whole design: a music box nursery rhyme from
a fixed list of six, played once through, about ten minutes, then a fade to
silence. The intent is that the device is put on the shelf face up and the
toddler listens while playing with real toys. Two controls remain, both for
the grown up: Back to my quests and the AskDoor.

**The honest constraint.** In a home screen web app, audio stops if the
device locks its own screen. So the music box keeps the screen on and dim
while it plays, and if the device is locked the music stops, and that is
fine, because the device being down is the point. Background audio arrives
with the native wrap that is already on the open work list, and this node
needs no redesign for it.

**Missions at Tier 1** are three, all with a grown up, all proved by the grown
up's tap: plant a real seed, collect three leaves, water a real plant. The
paper twin is a colouring sheet with the three steps as pictures. There is no
mission board; the gardener simply offers one mission after each nap, and
never the same one twice in a day.

### 5.2 Tier 2 (ages 6 to 9): goal oriented tasks

The greenhouse gains the MissionBoard, the cafe and SproutNet, and the
missions gain a mechanic of their own: the code.

**Unlock code puzzles.** A mission with proof `hidden_code` is a small
scavenger hunt the family runs. "Count ten steps out of the back door and
look for the Moonflower card." The card is the paper twin, and the code on it
is generated by the server for this child (`planter_codes`), printed through
the printables route, and hidden by the grown up wherever the mission says.
The child finds it in the real world, types the code into the SeedDrawer, and
the server checks it. At 6 to 7 the code is three pictures the child taps in
order (a pictorial code, no reading needed). At 8 to 9 it is a four letter
word. A wrong code says "not quite, have another look" and nothing else, with
no lockout and no count of tries.

Some codes need no card, because the answer is fixed in the mission data:
"How many legs on the spider in the shed? Bring me the number." The registry
marks these `answer` and the server checks that instead. Both shapes are the
same flow to the child.

**Goals without pressure.** The board shows at most three missions, each with
its named seed. There is no streak, no "3 of 5 this week", no expiry. A
finished mission goes off the board and the next one comes on. The garden
fills over months and the SeedDrawer is the record.

### 5.3 Tier 3 (ages 10 plus): custom boundary settings

The tween programs the plant's day. This is the top of the ladder: the toy
stops setting timings and starts holding the ones the child sets.

**The ScheduleComponent, as a screen.** A simple block builder, borrowed from
Forest's grow ring rather than from any calendar: pick Grow blocks (study,
reading, homework, practice, from a fixed label list so no free text is
stored) and Rest blocks, each a length from a list (5 to 45 minutes). The
plant's bedtime is a separate row, preset to the family's window and movable
earlier only. Moving it later is a button that reads "Ask to change our
deal", and it sends a proposal to the parent app in the words the family
agreement builder already uses. The parent's Yes changes the family setting,
not the toy's copy of it, so the paper deal on the fridge, the timer and the
garden never disagree.

**GrowAndRestNode.** The Tier 3 offline exit and the productivity timer the
brief asks for. The plant sits at a desk in the greenhouse and "works" beside
the child: it reads when the block is reading, writes when it is homework,
and the ring around it fills over the real minutes. The screen is a focus
card, not a game: the plant, the ring, the block's label, one big number, and
one button, Pause. At the end of a Grow block the plant stretches and the
Rest block starts by itself, and at the end of a Rest block the plant looks
up and waits. It never buzzes. A block the child abandons is banked for the
minutes done and says so; there is no "you gave up" and no broken ring.

Growth at Tier 3 comes almost entirely from Grow blocks, which is the whole
message for this age: the plant grows while you do your real work, and the
study lamp, the bookshelf and the two player seed are the rewards on that
path.

**Trust.** The parent sets `trust` on the parent app: grown up (every claim
is an ask), shared (timer and code missions self approve, the rest ask), or
self (the child's We did it is enough). The default is shared. The setting
is the same ladder the star quest runs and it fades the same way, toward the
system becoming unnecessary.

---

## 6. What it reuses, what is new, and the build order

**Reused as it is.**

- The child link, token scoping, the no model guard, the theme
  (`lib/kid/theme.ts`), the buddy (`lib/kid/buddy.ts`).
- The Planet Friends cast and art (`lib/content/stage-characters.ts`).
- Bedtime, protected windows and the London clock
  (`lib/quests/time-tiers.ts`, `lib/time/london.ts`).
- AskPopup and the ask pipe on the parent side, polled every 20 seconds.
- The printables engine and the drawn sheets (A4 in millimetres, example
  mode on the tile) for every paper twin.
- The `scripts` table for the grown up prompts.
- The quest games pattern: registry data, renderers in the app, the server
  decides.

**New.**

- `lib/planter/` (entities, components, registry, the four state machines
  with tests) and `components/planter/` (the three scenes, five overlays, the
  drag layer, the sounds).
- Three tables and the cascade in the delete route.
- Three token scoped routes under `app/api/kid/planter/` (`state`, `event`,
  `code`), and the parent side approval riding the existing ask pipe.
- Plant character art in the house plush style (six species, five pyjama
  sets, the grumpy one, the wise tree), generated in the Higgsfield style
  already used for the Friends, cut out like the Friends.
- Six music box tracks and a small sound set, licensed or made, no third
  party audio library.

**Build order, four slices, each shippable.**

1. Greenhouse, one plant, the Nap Area, the Photosynthesis loop, the bedtime
   sync, Tier 1 and Tier 2 timings. This is the toy. Ship it on the child
   link behind the stage gate and watch a real family use it.
2. The Copycat Engine with the starter catalogue, the paper twins, the ask
   in AskPopup, hidden codes.
3. The Digital Playground, the Screen Time Cafe and the malware loop.
4. SproutNet with the dome tool, and the Tier 3 schedule and GrowAndRest.

**Checks before any slice is called done.** Playwright at 390 and 1280 with
every slot dragged and every button tapped, the child guard script green, the
dash check over every registry line, and a real evening where the greenhouse
dims at the family's bedtime on a real phone.

**Three things Justin decided, 2 September 2026.** ("1 agreed with
direction 2 ship together 3 new can be typed let's go ahead.")

1. Missions pay in the garden only, never stars directly. A parent who wants
   the same activity to earn stars adds it as a quest on the board they
   already have.
2. Slice 1 ships to Tier 1 and Tier 2 together.
3. Plant names at Tier 3 are typed, the toy's only free text field.

Slice 1 is being built on the same branch. Its plan is
`plans/week-of-2026-08-31-planter-friends-slice-1-plan.md`.

---

*Update this file when the build changes it. It earns its place by being
true.*
