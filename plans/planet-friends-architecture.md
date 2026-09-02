# Planet Friends: Growing Up Digital

**System architecture and feature design, Fable 5.1 edition.** Written
2 September 2026 from Justin's brief, rebuilt the same day after the brief's
own typo was found. Status: design plus slice 1 built. When the code and this
file disagree, the code is right and this file gets updated, the same rule
THE-STORY.md runs on.

**What this file is.** The whole design for an open ended digital toy on the
child link, built on the cast the platform already has: the Planet Friends
(Pebble, Bloop, Orbit, Nova, Cosmo) and DiGi the golden star. The entities
and components, the scene nodes, every state machine, the sync hooks between
the real world and the screen, and how it scales from a three year old on a
parent's lap to a tween running their own study timer. Read the one line and
section 1 for the idea. Read 2 to 5 to build it. Section 6 says what it
reuses, what is new, and what Justin decided.

**The correction, so nobody repeats it.** The brief arrived as "Planter
Friends" and was plant themed end to end (a greenhouse, seeds, photosynthesis,
a LeafPhone). It was a typo for Planet Friends, the cast we already had. The
first build was a garden and was merged as PR 957 with migration 251. Justin,
2 September: "it's not Planter Friends, it's Planet Friends ... the cast we
have as Planet Friends, already designed, and planets not gardens ... give it
a full rebuild." This document and slice 1 are that rebuild. Migration 252
retires the garden tables (both empty) and creates the planet ones.

## The one line

The child's own Planet Friends live on a little planet and grow up alongside
them. They run on starlight, they get sleepy on screens, the planet grows
while the child is away, and the best moons are only found outside.

Said at the school gate: *it is like Toca Boca, except the characters put
their phones on charge when it is bedtime, and the planet grows while you are
out on a walk.*

## What it is for

Justin, 2 September 2026: "remember we are trying to combine offline activity
and balance responsible device use with online education." The toy is the
place where those three meet in a child's hands:

- **Offline activity.** Growth happens only while the child is away: the
  pod, real sunshine at a real window, the slow orbit, the night, and from
  slice 2 the missions done with a grown up.
- **Balanced, responsible device use.** The Planet Friends model it. Each has
  a MoonPhone that goes on the charger when the star goes down. They get
  sleepy on screens, they rest, they come back. The child is the one who
  tucks them in, which is a rehearsal for tucking themselves in.
- **Online education.** The Friends are the same cast that fronts the child's
  lessons. Every growth reveal carries a door into the Learn tab, and slice 2
  makes lessons a mission with a reward on the planet.

## Where it sits in the product

- It lives on the child link (`app/k/[token]/planet`) as a My planet tile on
  the Games tab, after the games. Token scoped, no account, no login, and no
  model, ever.
- The cast is the cast. `lib/content/stage-characters.ts` is the one source
  of truth for names, colours and the cut out art, and the toy reads it. DiGi
  stays the guide.
- The grown up's side is the parent app they already open every morning.
  Asks arrive in the same pop up as device time asks
  (`components/quests/AskPopup.tsx`), and the paper twin of every mission
  prints through the printables engine.
- The star economy is untouched. The toy mints no stars and spends none. Its
  rewards are moons, flags, rings and growth, so there is never a second
  currency to reconcile with `streakCurrency`.

## The Fable 5.1 vocabulary as used here

| Term | Meaning here | What it becomes in this repo |
| --- | --- | --- |
| Entity | A thing in the world with an id and components | A typed object inside the home planet document |
| Component | A bag of state with invariants, attached to an entity | A TypeScript type plus pure update functions in `lib/planet/` |
| Node | A scene or overlay in the scene graph | A React component under `components/planet/` |
| FsmNode | A node driven by an explicit state machine | A pure reducer in `lib/planet/logic.ts` with a transition table and checks |
| SyncHook | A bridge between real time or a real person and the toy | A browser event, a token scoped route, or a parent app approval |
| Registry | Content as data | `lib/planet/registry.ts`, the same shape as the quest games registry |

The renderers live in the app, the content lives as data, and scoring and
time are decided by the server. That is how the quest games were built and
the toy follows it exactly.

## 0. The rules it inherits

Every mechanic below was checked against these. If a future change breaks
one, the change is wrong, not the rule.

1. **Never allow or deny.** A lock in this toy is a lock on the Friends,
   never on the child. Every locked state carries one door, Ask my grown up,
   and the ask lands on the parent as a Yes or a Not now.
2. **Connection is the protection.** Nothing here polices. The toy models
   the habit through the Friends and hands the real decisions to the family.
3. **The child is a participant.** Missions are things the child chooses to
   do with a grown up. The grown up's tap is a shared moment, not an
   inspection.
4. **Evidence or silence.** The tier timings lean on the screen guides
   already in `lib/quests/screen-balance.ts` (WHO, AAP, RCPCH) and on
   nothing invented.
5. **Zero model calls on the child's side.**
   `scripts/check-child-has-no-model.mjs` covers `lib/planet`,
   `components/planet` and `app/api/kid/planet`.
6. **Nothing buzzes a child at night, and this toy never buzzes a child at
   all.** A rest that ends, a moon that arrived, a Friend that woke up: all
   of it waits quietly for the next open. The toy never calls the child back.
7. **No loss language.** Friends get sleepy. They are never ill from neglect
   and never gone. A planet left for a month is a planet that grew for a
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
12. **Content as data.** The mission catalogue and every spoken line are
    registry entries or database rows, never strings inside a renderer. The
    grown up conversation prompt that rides each mission is a `scripts`
    table row, so it updates without a deploy.

---

## 1. Architectural overview and the hybrid play loop

### 1.1 Global design intent: Phygital Balance

A Toca Boca toy is brilliant because it has no goals, no scores and no fail
state, and a child can play it for two hours. That last part is the problem
this toy solves. Planet Friends keeps the first three and changes the fourth:
the toy ends its own sessions, gently and by design, because the Friends
themselves need things that are not on the screen.

Three laws.

**The screen is never the prize and never the punishment.** The toy never
says "you have played too long". The Friends run out of starlight, which is a
fact about Planet Friends, and the child is the one who tucks them into their
pods. The family's own deal (core minutes, stars, protected windows) governs
the device. The toy governs the Friends. The two agree because every play
length in section 5 sits inside the daily guides the family deal already
uses.

**Growth happens while you are away.** This is the whole mechanic. Sprinkling
stardust and tickling on screen is fun but grows nothing. The planet grows
during rests, during real world missions and overnight, and the first thing a
child sees on return is what changed while they were gone: grass, a flag, a
little house, rings, a moon. Coming back is rewarded. Staying is not
punished, it simply grows nothing.

**The real world is proven by time and by a grown up, never by
surveillance.** No camera, no microphone, no location for the walk, no light
sensor for the sunny window. A real clock the child cannot skip, and a grown
up's tap, are the only two kinds of proof the toy accepts. That is a privacy
position, and it is also the point: the grown up's tap is the shared moment
the whole product is built around.

### 1.2 The hybrid play loop

One loop, four beats, and the child always knows which beat they are in.

1. **PLAY.** The tactile sandbox. Sprinkle stardust, tickle a Friend, boop a
   crater, float a cloud over someone, and later hand a Friend its MoonPhone.
   Every touch makes a sound and nothing can be done wrong. Length by tier:
   15 minutes at Tier 1, 20 at Tier 2, the child's own setting at Tier 3.
2. **SLEEPY.** Starlight runs down. A Friend yawns, the star lowers and the
   sky warms, and the Friend puts its MoonPhone on the charger by itself.
   This is the modelling beat: the character does the thing we want the
   child to do, before the child is asked to do anything.
3. **OFFLINE.** One of three exits, all in real time: the pod (the child's
   choice, it locks the planet), the sunshine mission (three minutes at a
   real window), or the slow orbit (fifteen minutes of the music box). At
   Tier 2 and 3 a real world mission can be picked here too.
4. **RETURN.** The planet has changed because they were away, and one door
   to the lessons rides on the reveal. One line, then straight back to PLAY.

Everything in sections 2 to 5 makes one of those four beats richer. Nothing
adds a fifth.

### 1.3 The cast, and who is a baby

Justin, 2 September 2026: "the younger one could be mini characters as babies
until they all reach the age." So the whole cast is on the planet from the
first day, and each Friend is a baby until the child reaches the bottom of
that Friend's own stage. Then it grows up, alongside them.

| Friend | Grows up at | Stage it fronts |
| --- | --- | --- |
| Pebble | 4 | Foundation, 4 to 7 |
| Bloop | 8 | Builder, 8 to 10 |
| Orbit | 11 | Explorer, 11 to 13 |
| Nova | 13 | Shaper, 13 to 15 |
| Cosmo | 16 | Independent, 16 plus |

The Friends the child looks after (starlight, rests) are the tier's active
set: Pebble at Tier 1, Pebble and Bloop at Tier 2, three at Tier 3. The rest
sleep in the nursery, a small dome in orbit, and a tap on it giggles. A three
year old therefore looks after baby Pebble, sees the four others napping in
the nursery, and on their fourth birthday Pebble is standing up in the real
art. Nothing has to be earned for the cast to be there; being earned through
streaks stays what it is on the rest of the child link.

### 1.4 Fable 5.1 system setup

#### Core entities

```ts
// lib/planet/logic.ts   (the shapes as built)

type FriendKey = 'pebble' | 'bloop' | 'orbit' | 'nova' | 'cosmo'

/** One of the child's Planet Friends, looked after on the home planet. */
type PlanetFriend = {
  key: FriendKey
  energy: number                 // starlight, 0 to 100
  cooldown: OfflineCooldownTimer | null
  cloud: boolean                 // a little shade over this Friend (Tier 2)
}

/** A pretend device a Friend can hold (slice 3). Never the child's real device. */
type DigitalDevice = {
  id: string
  model: 'MoonPhone' | 'StarPad'
  state: DeviceStateComponent
  ownerKey: FriendKey | null
}

/** The one node that knows about real time and real people. A singleton. */
type OfflineSyncNode = {
  serverNow: string              // London time from the server, the clock of record
  bedtime: BedtimeWindow         // read from child_time_settings, never set by the toy
  ask: HomeAsk | null            // the wake early ask waiting for a grown up
  screenAsk: ScreenAsk | null    // the device time ask made from the night overlay
}

/** The whole save. One JSON document per child, one row in planet_homes. */
type Home = {
  version: 1
  tier: 1 | 2 | 3
  friends: PlanetFriend[]
  growthStage: number            // 0 bare rock, 1 first grass, 2 a flag, 3 a little house, 4 rings, 5 a moon
  growthProgress: number         // 0 to 100 toward the next stage
  grewWhileAway: number          // shown once on return, then cleared
  energyTickedAt: string
  lastNightAppliedOn: string | null
  createdAt: string
  lastSeenAt: string
}
```

#### Fundamental components

```ts
/** What a pretend device is doing. Drives the starlight loop in slice 3. */
type DeviceStateComponent = {
  state: 'Docked' | 'InUse' | 'Recharging'
  battery: number
  activity: 'photos' | 'starnet' | 'game' | 'homework' | null
  sinceServerTime: string
}

/** The Friend's starlight. One number, activity multipliers, tier scaled. */
type EnergyDrainComponent = {
  energy: number                 // 0 to 100
  drainPerMinute: number         // base rate: 100 divided by the tier's play length
  multiplier: 1 | 2 | 3          // 1 sandbox, 2 holding a device, 3 at a cafe table (slice 3)
  sleepyAt: 20
  depletedAt: 0
}

/** A real world wait the client displays and the server decides. */
type OfflineCooldownTimer = {
  reason: 'nap' | 'sunlight' | 'ambient'
  startedAt: string              // server clock
  endsAt: string                 // server clock, computed server side
  lengthMinutes: number
}

/** The planet's growth. Moves only during offline beats. */
type GrowthComponent = { growthStage: number; growthProgress: number; grewWhileAway: number }

type MoodComponent = { mood: 'happy' | 'sleepy' | 'tired' | 'asleep' | 'sunbathing' | 'resting' }

type SecurityLockComponent = {           // slice 3
  appliedAt: string
  ritual: ('told_grownup' | 'closed_popup' | 'updated_shell' | 'star_password')[]
  immuneUntil: string
}

type TierComponent = { tier: 1 | 2 | 3; childAge: number; derivedFrom: 'date_of_birth' | 'age_band' }

type ScheduleComponent = {               // Tier 3, slice 4
  blocks: { kind: 'grow' | 'rest'; minutes: number; label: ScheduleLabelKey }[]
  friendBedtime: { start: string; end: string } | null
  trust: 'grownup' | 'shared' | 'self'
}
```

Invariants, enforced in the pure update functions and checked by
`scripts/check-planet-logic.mjs`:

- `energy` never rises while the planet is open and the tab is visible.
  Starlight is restored only by a rest the server has closed.
- `growthProgress` never rises inside PLAY. Growth is applied by the server
  when it closes a rest, approves a mission, or crosses a bedtime end.
- A Friend is a baby exactly when the child's age is below its stage floor.
- `friendBedtime` may sit inside the family's bedtime window, never outside
  it. Stricter is allowed, looser becomes an ask.
- Exactly one overlay at a time, and every overlay except none renders the
  AskDoor.

#### Where the state lives

| Table | Row | Why |
| --- | --- | --- |
| `planet_homes` (migration 252) | one per child: `child_id`, `state jsonb`, `version`, `ask jsonb`, `updated_at` | The save, plus the one live ask. Versioned so two tabs cannot overwrite each other |
| `planet_events` (migration 252) | append only: `child_id`, `kind`, `payload jsonb`, `created_at` (server) | The ledger the server decides from: a Friend went to its pod, sunshine caught, the night applied, an ask sent and answered |

Both cascade from `children` and `auth.users`, so the deletion promise
stays true. The child app is a home screen web app, so the planet is mirrored
in memory and plays with no network between events. The mirror is a cache,
never a truth: every offline beat asks the server.

#### Real time sync hooks

| Hook | Fires when | What it does |
| --- | --- | --- |
| `onVisibilityChange` | the tab hides or shows | Nothing is sent while hidden (a hidden toy costs no starlight, because putting the device down is the goal). On show, refresh |
| `onTick` | every 60 seconds while visible and playing | `POST /api/kid/planet/event {kind: tick}`. The server drains at most 90 seconds of real play, never the absence |
| `onCooldownStart` | pod, sunshine, slow orbit | The server writes `startedAt` and `endsAt` from its own clock and returns them. The client counts down from the server's numbers |
| `onReturn` | the toy opens, or the tab shows after a rest | `GET /api/kid/planet/state`. Over: growth applied, the while you were away card. Not over: still resting, whatever the device clock says |
| `onGrownupAnswer` | the parent taps Yes or Not now in AskPopup | Polled every 20 seconds while a rest or an ask is live, the cadence AskPopup uses. A Yes ends a rest early, opens a bedtime window, or approves a mission |
| `onBedtime` | `serverNow` crosses the bedtime start or end in `child_time_settings` | Section 3.3 |
| `onSettingsChange` | the parent edits bedtime or trust on the parent app | Picked up on the next read. Nothing is pushed to the child |

The client reports, the server decides. A child who winds the device clock
forward sees nothing move, because growth is applied by the server on return
and the server has its own clock. That is the standing rule for every game
score in the product and it holds for every minute in this one.

---

## 2. Playsets and environment node definitions

The scene graph, with the offline transition zones marked. An offline
transition zone is any place in the world where a Friend recovers, and every
one of them starts a real timer.

```
PlanetWorldRoot
  HomePlanetNode                  the sandbox, the default scene
    StardustShaker                drag it over a Friend, sparkles fall
    Craters x3                    boop, a puff of moon dust
    Clouds                        Tier 2: tap to float a little shade over a Friend
    ChargerPad                    where MoonPhones rest when the star goes down
    NurseryDome                   in orbit: the babies who have not grown up yet
    SunCatcher         (zone)     the sunshine mission
    SleepPod           (zone)     drag a Friend in to start a nap
    MissionBoard                  Tier 2 and 3, the offline missions (slice 2)
  DigitalPlaygroundNode           sub scene, the pretend devices (slice 3)
    DeviceShelf                   MoonPhone and StarPad
    ChargerDock        (zone)     devices recharge here, in real minutes
  ScreenTimeCafeNode              sub scene, over use made visible (slice 3)
    CafeTable x3, ObservationBench (zone), ReadingCorner (zone)
  Overlays, one at a time, each with the AskDoor
    PodsNode                      during a nap, the pods and the filling moon
    OrbitClockNode                the fifteen minute wait, one slow orbit
    MusicBoxNode                  Tier 1 sleepy exit, audio first
    NightSupportNode              bedtime, the planet's night side
    GrowAndRestNode               Tier 3 study timer, section 5.3
```

Reference patterns pulled from Mobbin before design: Finch's home scene with
the companion in the middle and an away timer for the away beat; Forest's
grow ring with one big number and one button for the Tier 3 timer; Alan's
breathing companion with a single control for the night overlays; the fixed
length sleep timer lists in Blinkist and ElevenReader for the rest lengths;
Duolingo ABC's room scene, two characters and almost no chrome, for the
sandbox. Everything is translated into butter and ink and Nunito, never
copied.

### 2.1 HomePlanetNode

**Purpose.** The sandbox. This is where a Toca Boca child lives, and it has to
be at least as much fun as the thing it replaces.

**Tactility rules, all of them non negotiable for this node.**

- Everything that looks liftable lifts. Drag is pointer events on SVG, no
  physics engine. A held Friend scales up 6 percent and casts the hard 5px
  ledge shadow, the same ledge as every button in the product.
- Every touch makes a sound. Stardust tinkles, a crater boops, a Friend
  giggles when tickled, a cloud taps. Sound is on by default inside the toy,
  one mute control top right, and nothing plays outside the toy.
- Nothing scores, nothing fails, nothing is timed on screen. There is no
  progress bar in PLAY. The only clock the child sees is the star moving
  across the sky, which is the starlight component made visible.
- Chrome is two controls: back to my quests (top left, always) and mute. The
  scene changes (playground, cafe) are doors drawn in the world, not tabs.
- Mobile first, one thumb. The planet is a single screen at phone width with
  no scrolling, and it widens on a tablet or desktop. Checked at both before
  it is called done.

**Interactive slots.**

| Slot | Interaction | Effect on components |
| --- | --- | --- |
| StardustShaker | Drag the shaker over a Friend | `mood` to happy for a moment, a sparkle. No growth. Stardust is fun, not fuel |
| Craters | Tap | A puff of moon dust and a boop. Pure tactility |
| Clouds | Tap, Tier 2 | A cloud floats over the Friend. It drains 20 percent slower, which is the first hint that light and starlight are linked |
| ChargerPad | Watched, never operated | Each Friend's MoonPhone appears here the moment that Friend is sleepy or resting. The modelling beat |
| NurseryDome | Tap | The babies giggle. "Still babies. They grow up with you." |
| SunCatcher | Drag a Friend onto the dish | Starts the sunshine mission (section 3.1) |
| SleepPod | Drag a Friend into the pod | Starts a nap for that Friend. When every active Friend is asleep the planet locks |
| MissionBoard | Tap, Tier 2 and 3 | Opens the offline missions (section 3.2, slice 2) |

**The SleepPod, in detail.** This is the physical "put it to bed" of the
brief, and it is the most important slot in the toy.

1. The child drags a Friend into the pod. It curls up, the pod lid closes,
   the blanket in its own colour comes up. `mood` becomes `asleep`.
2. `onCooldownStart('nap')` posts to the server, which returns `endsAt`. Nap
   length is 15 real minutes at Tier 1 and 2, and the child's own setting at
   Tier 3 from a fixed list (5, 10, 15, 20, 25).
3. When every active Friend is asleep, `PodsNode` overlays the scene and
   PLAY is locked. At Tier 1 there is one Friend, so one nap locks the
   screen, which is the direct physical feedback the brief asks for. At
   Tier 2 and 3 a child can keep one Friend awake and carry on, and that
   Friend keeps draining, so the loop still ends itself. Everyone to bed is
   one tap.
4. `PodsNode`: the sky goes dark blue, a moon fills as the nap passes, the
   pods breathe, a soft loop plays. Taps do not wake anyone: a tap makes a
   whispered "shh". Tier 1 shows no numbers. Tier 2 shows the minutes.
5. Two ways out, both always present. **Back to my quests** leaves the toy
   and the nap keeps running on the server, so the child returns later to
   awake Friends and a grown planet. **Ask my grown up** is the door: one tap
   sends an ask that lands in AskPopup ("Teo wants to wake the Planet
   Friends, 9 minutes left"). A Yes closes the rest early. A Not now says so
   kindly and the moon keeps filling. There is no third state and no
   punishment for asking.
6. When the server closes the nap, growth is applied to the planet and the
   next open shows the while you were away card: "Our planet grew while you
   were away!"

**What it teaches.** The Friend sleeps because sleeping is what makes the
planet grow. The child is the one who decides bedtime for the Friend, which
is a rehearsal for deciding it for themselves.

### 2.2 DigitalPlaygroundNode (slice 3)

**Purpose.** The Friends have their own devices, and the child watches them
use those devices well. Every rule the family has about screens is acted out
by a character first.

**Entities instantiated here.** The DeviceShelf holds one MoonPhone at
Tier 1, a MoonPhone and a StarPad at Tier 2 and 3. Dragging a device onto a
Friend sets `DeviceStateComponent.state` to `InUse` and the Friend's
`multiplier` to 2. The battery drains at the same rate as the Friend's
starlight, so the two gauges always agree and the child learns to read
either.

| Activity | Tier | What happens |
| --- | --- | --- |
| Photos | 1, 2, 3 | Tap to snap a moon. A pretend gallery of six frames. Full means done |
| Tiny game | 2, 3 | A two tap catch the shooting star. Ends on its own after eight. No score |
| StarNet | 2, 3 | Section 4.2 |
| Homework corner | 3 | The Friend "works" beside the child. Section 5.3 |

**The ChargerDock, the offline transition zone of this scene.** A device at
battery 0 goes `Recharging` and cannot be picked up. Recharge is a real
5 minutes on the dock, or a nap. The Friend puts its device on the dock by
itself when it gets sleepy, before the child is asked to do anything. The
child can dock it early at any time, and the Friend says thank you when they
do. The dock has a printed twin already: the Phones Go To Bed sheet in the
drawn printables set, so the paper on the fridge and the dock in the toy say
the same thing.

**What it teaches.** Devices are fine and fun. They run out. They go to bed on
the dock, and the Friend that docks its phone early is the one with starlight
left to play.

### 2.3 ScreenTimeCafeNode (slice 3)

**Purpose.** Over use, made visible and made kind. The cafe is a lovely place
where the Friends sit with their devices, and staying too long is what makes
them wobbly.

**Layout.** Three cafe tables (as many as the tier allows Friends), a counter
with a fixed menu, slightly bluer light than the planet, and two exits: the
ObservationBench under the stars and the ReadingCorner (Tier 2 and 3).

**The drain.** A Friend at a table with a device has `multiplier` 3. Two
gauges run down together and both are drawn in the world, never as bars: the
device's battery (the screen dims) and the Friend's starlight (it slumps,
`mood` becomes `wobbly` at 20). The Tier 3 homework corner is the exception:
a device used for learning drains at 1, because learning is the one bucket
the family deal invites upward (`lib/quests/device-time.ts`, the activity
buckets).

**The no fail rule.** A Friend cannot be left at a table past depletion. At
starlight 0 it stands up, walks to the bench on its own, and says its line:
"Too much scrolling. My starlight went out. Bench time." The child never
caused harm and is never told they did. What the child can do is spot the
slump early and carry the Friend out first, which earns a happier line ("You
noticed before I did!") and nothing else. The noticing is the reward.

**The offline transition zones.** The bench and the reading corner start a
real 2 minute rest. A Friend coming off the bench is at starlight 60, not 100.
Only a nap or a night gets it to 100, which is true of children as well.

---

## 3. Core phygital mechanics

### 3.1 The Starlight Recharge Loop (FsmNode)

One machine per Friend. It runs on `EnergyDrainComponent` and, from slice 3,
`DeviceStateComponent` together, so a Friend with a device in its hand and a
Friend without one are the same machine at different rates.

```
StarlightFsm
  states: Charged | Draining | Sleepy | Depleted | Recharging | Waking
  routes out of Recharging: Pod | SunshineMission | SlowOrbit | Bench
```

| From | Event | Guard | To | Effect |
| --- | --- | --- | --- | --- |
| Charged | `tick` | tab visible, overlay none | Draining | Starlight falls by `drainPerMinute` times `multiplier` |
| Draining | `tick` | starlight at or below 20 | Sleepy | The yawn. `mood` sleepy. The star lowers, the sky warms. The MoonPhone goes to the charger pad |
| Draining | `deviceHanded` | slice 3 | Draining | `multiplier` 2 |
| Draining | `satAtCafe` | slice 3 | Draining | `multiplier` 3 |
| Sleepy | `tick` | starlight 0 | Depleted | The Friend sits down where it is |
| Sleepy or Depleted | `draggedToPod` | | Recharging (Pod) | `onCooldownStart('nap')`. Section 2.1 |
| Sleepy or Depleted | `draggedToCatcher` | | Recharging (SunshineMission) | `onCooldownStart('sunlight')`, 3 minutes, after the Catch the sunshine tap |
| Depleted | `tick` | 20 seconds with no touch | Recharging (SlowOrbit) | `onCooldownStart('ambient')`, 15 minutes. The overlay becomes OrbitClockNode when everyone is resting |
| Sleepy or Depleted | `draggedToBench` | in the cafe, slice 3 | Recharging (Bench) | 2 minutes, restores to 60 |
| Recharging | `cooldownClosed` | server says `endsAt` has passed | Waking | Starlight restored. Growth applied to the planet by the server. `grewWhileAway` set |
| Recharging | `grownupYes` | an ask was answered | Waking | As above. The early wake still grows, by the minutes actually slept |
| Recharging | `grownupNotNow` | | Recharging | The Friend says it is still sleepy, kindly. No change |
| Waking | `shown` | the while you were away card has been read | Charged | `grewWhileAway` cleared |

**The two speeds of waking, and why neither is better.** The slow way is the
orbit: the screen becomes `OrbitClockNode`, a small planet going once around
its star over fifteen real minutes, no taps needed. The fast way is the
sunshine mission: the child carries the device to a real sunny window and
taps Catch the sunshine, and the Friend charges in three minutes while the
star rises on the screen. Both routes end at the same starlight and the same
growth. The mission is faster, not better, so there is no pressure to do it
and no loss for not doing it. That is what keeps the fast route from
becoming a nag.

**The sunshine mission, exactly.**

1. The child drags a Friend onto the sun catcher dish.
2. The Friend says "Find me some real sunshine. Planets need their star. Take
   me to your sunniest window." At Tier 1 it adds "Ask your grown up to come
   too."
3. The screen goes to a single frame: the Friend, a pale sky, and one big
   round button, Catch the sunshine. Nothing else. No timer is shown at
   Tier 1.
4. The child taps it at the window. The toy trusts the tap. There is no
   sensor and there never will be. The server starts a 3 minute rest, and
   the star on the screen rises slowly over those three minutes. Taps during
   the wait add sparkles and nothing else.
5. When the server closes it, the Friend stretches, says "That was real
   sunshine. I can feel it," and is back on the planet at full starlight.

The mission is real because the three minutes are real and because the child
physically moved. A child who taps it on the sofa gets three minutes of
looking at a star. Nothing is lost either way and nothing is checked.

**The OrbitClockNode.** A passive overlay for the fifteen minute wait: the
star in the middle, a small planet in the child's own colour going once
around it, the resting Friends drawn small, and the music box playing
Twinkle Twinkle at Tier 1, the same tune slower and lower at Tier 2 and 3.
No buttons except the AskDoor and Back to my quests. The intent is a screen
that is boring in the most beautiful way, so the child puts the device down
and plays with something real while the Friends recharge.

### 3.2 The Real World Copycat Engine (slice 2)

The engine that turns a real world activity into a change on the planet.
Rare moons and custom flags come only from here, so "rare" has a precise
meaning in this toy: found offline, never found by chance.

**The catalogue.** Content as data. Each mission is a registry entry, and the
grown up prompt that rides it is a `scripts` row.

```ts
type Mission = {
  key: string
  title: string
  tiers: (1 | 2 | 3)[]
  steps: string[]                  // three lines at most, child reading level by tier
  together: 'required' | 'invited' | 'optional'
  proof: 'grownup_tap' | 'timer' | 'hidden_code' | 'self'
  timerMinutes?: number
  reward: { kind: 'moon' | 'flag' | 'ring' | 'decoration'; key: string }   // fixed, shown up front
  transform: TransformKey          // what changes on the planet when it lands
  paper: DrawnKey | null           // the printable twin in the drawn sheets registry
  scriptKey: string                // the grown up conversation prompt, scripts table
}
```

Starter catalogue, one line each:

| Mission | Tiers | Proof | Reward | Transform |
| --- | --- | --- | --- | --- |
| Plant a real seed | 1, 2, 3 | grown up tap | Green moon | A little garden dome appears on the planet |
| Go for a walk and collect three leaves | 1, 2, 3 | grown up tap | Leaf flag | A flag in leaf colours goes up |
| Five minute stretch with your grown up | 1, 2, 3 | timer, 5 min | Stretchy ring | The planet gets its first ring |
| Water a real plant in your house | 1, 2 | grown up tap | Blue crater pool | A crater fills with water |
| Count ten steps outside, find the card | 2 | hidden code | Moonflower moon | A pale moon rises |
| Read a real book for ten minutes | 2, 3 | timer, 10 min | Story lamp | The reading corner gets a lamp |
| Do a lesson on the Learn tab | 2, 3 | the lesson's own pass | Bright star | A new star appears in the sky |
| Screens off dinner, whole family | 2, 3 | grown up tap | Picnic blanket | A blanket appears under the stars |
| Study block with your Friend | 3 | timer, from the schedule | Study lamp, then rungs | The desk fills with books |
| Teach your grown up one thing about a game you love | 3 | grown up tap | Two seat rocket | A second seat appears in the rocket |

Every reward is named on the card before the mission starts. There are no
mystery moons, no rolls, no bonus drops. A child at Tier 2 who wants the
Moonflower moon knows exactly which walk to take. And the lesson mission is
the online education thread, made visible on the planet.

**The flow (FsmNode).**

```
MissionFsm
  states: Offered | Chosen | Doing | Claimed | Approved | NotNow | Transformed
```

| From | Event | To | Effect |
| --- | --- | --- | --- |
| Offered | `childPicks` or `parentSends` | Chosen | The card shows steps, who to do it with, and the named reward. A parent can also send a mission from the parent app, exactly like sending a quest |
| Chosen | `printTapped` | Chosen | The paper twin prints through the printables route, branded, A4 in millimetres, one side |
| Chosen | `startTapped` | Doing | For proof `timer`, `onCooldownStart` with the mission's minutes and a Grow and Rest style ring on screen. For every other proof, the toy simply waits, with no timer and no pressure |
| Doing | `weDidItTapped` | Claimed | The Mission Accomplished button, in child words: We did it. Proof `grownup_tap`: an ask lands in AskPopup. Proof `timer`: the server checks its clock. Proof `hidden_code`: the child enters the code from the card, the server checks it. Proof `self`: Tier 3 with trust `self`, the server approves |
| Claimed | `grownupYes` | Approved | Written to `planet_events` with who approved |
| Claimed | `grownupNotNow` | NotNow | "Not this time, and that is fine. It is still on your board." The mission stays Chosen. No language of failure |
| Approved | `returnToPlanet` | Transformed | The GSAP moment: the reward drops onto the planet, the transform plays once. Then calm |

**The proof types, and who taps.** The child is the participant, the grown
up is the witness, the server is the clock. `grownup_tap` is the default at
Tier 1 and the norm at Tier 2. `timer` is for missions whose whole point is
the minutes. `hidden_code` is the Tier 2 special (section 5.2). `self` exists
only at Tier 3 and only when the parent has set trust to self, which is the
top rung of the same ladder the star quest runs.

**Why missions do not pay stars.** Decided by Justin, 2 September 2026. The
toy's rewards are on the planet. If a parent wants the real seed planting to
earn stars as well, they add it as a quest on the board they already have,
and the star loop pays it through the approval it always uses. The toy never
mints, so there is never a second count to reconcile with `streakCurrency`.

**The paper twin.** Every mission with `paper` set is also a drawn sheet: the
steps as pictures, a big circle to colour in when done, the star strip, and
the brand. A family with no phone in the child's hand at all can run the
whole engine from paper and the parent's Yes.

### 3.3 Device Bedtime Sync (structural node, built in slice 1)

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
| Day | `serverTick` | now is within 30 minutes of bedtime start | WindDown | The sky goes evening. "Nearly bedtime on our planet." MoonPhones go to the charger |
| WindDown | `serverTick` | now is past bedtime start | Bedtime | Every Friend pulls on a nightcap in its own colour, curls into its pod, the blanket comes up. PLAY locks. `NightSupportNode` overlays |
| Day | `open` | now is inside the window | Bedtime | The toy opens straight on the night overlay, never on the sandbox. The Friends were already asleep |
| Bedtime | `askTapped` | | Bedtime | The ask IS the existing device time ask: ten minutes on this screen, which inside a protected window already goes to the parent |
| Bedtime | `grownupYes` | | Day (window) | The parent's yes runs an ordinary device time session, and the planet is open until it ends. It ends by itself and returns to Bedtime with no second ask that night |
| Bedtime | `grownupNotNow` | | Bedtime | "Night night. See you in the morning." No repeat prompt |
| Bedtime | `serverTick` | now is past bedtime end | Morning | Growth applied for the whole night by the server. The Friends wake, and the while you were away card is the biggest of the day: "Our planet grew in the night!" |
| Morning | `shown` | | Day | Back to PLAY |

**The NightSupportNode.** Peaceful and non stimulating, on purpose. The
planet's night side: dark blue, the pods breathing, a night light in the
corner, DiGi the star very small and slow in the sky. Two controls only: Back
to my quests, and the AskDoor. No numbers, no countdown to morning. The one
line of copy changes with the tier: Tier 1 "Everyone is asleep. Night night."
Tier 2 "Everyone is asleep in their pods. They grow while you sleep too."
Tier 3 "Planet closed till morning. Tomorrow's plan is on the desk."

**Sync rules that make it structural rather than decorative.**

- The window is read on every read and every open, so a parent who moves
  bedtime earlier on the parent app at 18:50 sees the planet go to evening at
  18:50 on the child's screen. Nothing is pushed; the toy simply reads.
- Bedtime is decided by the server's London clock (`lib/time/london.ts`),
  never by the device, so the clocks changing in October cannot open the
  planet at the wrong hour and a device clock wound back cannot open it at
  all.
- Bedtime outranks everything in the toy. A nap, a mission timer or a Tier 3
  study block that runs into bedtime is closed by the bedtime transition and
  its growth is banked, so nothing is lost by stopping.
- A Tier 3 child can set `friendBedtime` earlier than the family window.
  Later than the family window is not a setting, it is an ask, sent to the
  parent as a proposal (section 5.3).
- Nothing in this node ever notifies the child. `pushToChild` is not called
  from the toy.

---

## 4. State machines for digital citizenship (slices 3 and 4)

Two machines that teach safety by letting the child rescue a Friend, never by
frightening the child. Both follow the judge games rule from the quest
games: every beat carries its why, in the Friend's voice.

### 4.1 The Privacy and Malware loop (FsmNode)

```
MalwareFsm
  states: Idle | SuspiciousPopupTriggered | Told | InfectedState | RemediatedState
```

The trigger is a glowing space rock that lands on a Friend's MoonPhone
screen while the Friend is using it. It is a pretend pop up: at Tier 1
"FREE MOONS! Tap now!", at Tier 2 "Your planet is in DANGER, tap to fix", at
Tier 3 "Log in to StarNet again to keep your moons" from a sender that is
almost, but not quite, the real one.

| From | Event | To | Effect and the why line |
| --- | --- | --- | --- |
| Idle | `rockLands` | SuspiciousPopupTriggered | Guard: the Friend is `InUse` and `immuneUntil` has passed. At most one a day, never in the first session. The rock glows and wiggles. The Friend looks at the child |
| SuspiciousPopupTriggered | `shownToDiGi` | Told | The child drags the phone to DiGi. "Well spotted. Glowing things that want a tap right now are usually tricks." The rock fizzles. Immunity for a while. A bigger reward than the fix path gives, so telling beats fixing |
| SuspiciousPopupTriggered | `rockTapped` | InfectedState | The space cold. The Friend sneezes glitter, slumps, the phone shows three silly pop ups that multiply when tapped. `mood` poorly. Starlight drains at 2 while poorly. Nothing is lost |
| SuspiciousPopupTriggered | `ignoredFor60s` | Idle | The rock fizzles on its own. "It gave up. They do, when you do not tap." |
| InfectedState | `remedyStep` | InfectedState | The Security Lock ritual, four drags in any order: take the phone to DiGi (told grown up), tap the X on each pop up (closed pop up), put the phone on the dock for a real 2 minute rest (updated shell), and arrange three stars in a pattern the child chooses (a new password). Each step has a why line |
| InfectedState | `ritualComplete` | RemediatedState | `SecurityLockComponent` attached. A small padlock charm hangs on the pod. "All better. And now I know the trick." |
| RemediatedState | `shown` | Idle | `immuneUntil` set. Later rocks land again, sneakier by tier, so the loop is practice rather than a one off |

**The telling path pays more than the fixing path.** That is deliberate and
it is the family agreement default in code already: "Nobody ever gets in
trouble for telling." At Tier 1 the Friend itself suggests DiGi after five
seconds so a three year old cannot get stuck. At Tier 3 the rock is the sort
of thing a tween actually meets: a fake login, a too good to be true offer, a
friend request from a Friend they have never met, and the remediation adds
"check who sent it" as a fifth step.

**What it never does.** No red screens, no alarm sounds, no "your planet
will die", no shame line for tapping. "Everyone taps one once. Now you
know."

### 4.2 The StarNet social loop

A safe simulated network. The design constraint that makes it safe is simple
and absolute: StarNet only ever contains the child's own Planet Friends. No
other child, no other family, no real message, nothing that leaves the
device, nothing that arrives from outside it. It is a puppet show of a social
feed, and the child holds every puppet.

**The feed.** A pretend timeline on the StarPad where each Friend posts a
picture of the planet. Posting is a two tap act at Tier 2, and at Tier 3 it
carries a ThinkBeforePost beat first: the StarPad asks "Who will see this?"
and shows the answer, which is always "your planet", so the child rehearses
the question in a place where the answer is safe.

**Positive input: the StardustEvent.** A sprinkle of stardust is a kind
comment from one Friend to another, from a fixed list ("Love your moon!").
Stardust is never random and never on a timer, which is the anti slot machine
rule applied to social approval. It arrives on two fixed triggers only: one
sprinkle back for every sprinkle the child's Friend gives (kindness in,
kindness out, one for one), and a small set during a nap or overnight,
reported on return as "your Friends sent you three sprinkles while you
slept", because good things happen when you are not watching the feed.

A sprinkle landing triggers a glow burst and a small fixed growth point on
the planet, capped at one per sprinkle, so a child cannot farm it.

**Negative input: the MudSplatEvent and the TooMuchStardust flood.** Two
kinds of harm, both from the child's own Friends in the puppet show, so no
real unkindness is ever shown to a child. A grumpy Friend (there is always
one in the registry, and it is lovable) throws a splat: "Your moon is
boring." And sometimes there is too much stardust at once, the feed fills and
the Friend cannot see the planet, which teaches that even attention can be
too much.

**The GlassDomeShield, a physical bounding box tool.** When a splat is in the
air, the child draws with a finger around the Friend they want to protect.
The drawn loop snaps to a glass dome, which on a planet is exactly what a
dome is for. Inside it, splats slide off and stardust still gets through, so
the tool is a boundary and never a wall. Drawing the dome is the whole
point. The muscle memory the toy builds is "I can put a boundary around
myself", made physical.

Inside the dome the Friend offers three small choices, each a registry line
with its why:

| Choice | What happens | The why line |
| --- | --- | --- |
| Tell DiGi | The splat is cleaned up. The grumpy Friend gets a talking to, kindly, and a sprinkle of its own | "Telling is the fastest way to make it stop, and it is never telling tales" |
| Mute for now | The grumpy Friend's posts go quiet for the session | "You are allowed to not listen to that" |
| Step away | The Friend leaves StarNet and sits on the bench for a real 2 minute rest | "Sometimes the best button is the one that puts it down" |

There is no block in the destructive sense and no revenge splat. The grumpy
Friend stays on the planet, because in real life the grumpy one is often a
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
when it is set and from the bottom of the `age_band` otherwise. It maps onto
the platform's stage spine like this:

| Tier | Ages | Platform stage | Active Friends | Grown up by then |
| --- | --- | --- | --- | --- |
| 1 | 3 to 5 | Hog and Robin years into Foundation | Pebble | Pebble from 4 |
| 2 | 6 to 9 | Foundation and Builder | Pebble, Bloop | Bloop from 8 |
| 3 | 10 plus | Explorer, Shaper, Independent | Pebble, Bloop, Orbit | Orbit from 11, Nova 13, Cosmo 16 |

A Tier 1 child runs the toy on the grown up's device, opened from the child
link on the parent's phone, which is the Foundation guidance in the stage
model already: shared family device, same room, same screen. The child app's
own stage gating starts at 4 and is not changed by this toy. Below 4 the only
surface a child meets is the planet.

**The tier configuration, in one table.** These numbers are the toy's whole
tuning and they live in one registry object so nothing is hardcoded twice.

| Setting | Tier 1 (3 to 5) | Tier 2 (6 to 9) | Tier 3 (10 plus) |
| --- | --- | --- | --- |
| Friends looked after | 1 | 2 | 3 |
| Play before sleepy | 15 minutes | 20 minutes | the child's own setting, 15 to 45 |
| Sleepy warning | none, the Friend yawns and sits | 3 minutes before, the star sets | the schedule shows it |
| Nap length | 15 minutes, fixed | 15 minutes, fixed | the child picks: 5, 10, 15, 20, 25 |
| Sleepy exit | MusicBoxNode, audio first | OrbitClockNode | GrowAndRestNode or OrbitClockNode |
| Sunshine mission | 3 minutes, grown up invited | 3 minutes | 3 minutes |
| Mission proof | grown up tap, always | grown up tap, timer, hidden code | grown up, shared, or self by trust |
| Reading needed | none, pictures and sound only | short words, pictorial codes at 6 to 7 | full text |
| Devices for Friends | one MoonPhone, photos only | MoonPhone and StarPad | MoonPhone, StarPad, homework corner |
| Cafe | closed | open, one table | open, three tables |
| Malware loop | the Friend suggests DiGi after 5 seconds | the child works it out | realistic pop ups, check the sender |
| StarNet | off | on, dome tool | on, dome tool, think before post, ban flag copy |
| Night overlay | music box, near dark, no numbers | night side, minutes | quiet card with tomorrow's plan |
| Names | the cast's own | the cast's own | the cast's own, plus a typed name for the planet |

**The evidence behind the play lengths.** Around an hour a day of screen at
4 to 7 and a plan rather than a number from 6 is where the WHO, AAP and RCPCH
guidance in `lib/quests/screen-balance.ts` settled. A 15 minute session at
Tier 1 fits inside that with room for the rest of the day, and a 20 minute
session at Tier 2 is short enough to end before the transition tantrum the
Stage 1 script warns about. Tier 3 hands the number to the child on purpose,
which is the self regulation rung of the ladder.

### 5.1 Tier 1 (ages 3 to 5): direct physical feedback

The toy is one Friend, one planet, one pod. Everything is a picture and a
sound. After fifteen minutes of play the Friend gets sleepy in its body
first: it slows, it yawns, its MoonPhone goes to the charger, it looks at the
pod. If the child does nothing for a while, the Friend rests where it is,
which is the modelling. Then the screen becomes the `MusicBoxNode`.

**MusicBoxNode.** The screen goes nearly dark: a slow moon, the pod
breathing, nothing to tap. The audio is the whole design: a music box
nursery rhyme, played through, about ten minutes, then a fade to silence.
The intent is that the device is put on the shelf face up and the toddler
listens while playing with real toys. Two controls remain, both for the grown
up: Back to my quests and the AskDoor.

**The honest constraint.** In a home screen web app, audio stops if the
device locks its own screen. So the music box keeps the screen on and dim
while it plays, and if the device is locked the music stops, and that is
fine, because the device being down is the point. Background audio arrives
with the native wrap that is already on the open work list, and this node
needs no redesign for it.

**Missions at Tier 1** are three, all with a grown up, all proved by the grown
up's tap: plant a real seed, collect three leaves, water a real plant. The
paper twin is a colouring sheet with the three steps as pictures. There is no
mission board; Pebble simply offers one mission after each nap, and never the
same one twice in a day.

### 5.2 Tier 2 (ages 6 to 9): goal oriented tasks

The planet gains the MissionBoard, the cafe and StarNet, and the missions
gain a mechanic of their own: the code.

**Unlock code puzzles.** A mission with proof `hidden_code` is a small
scavenger hunt the family runs. "Count ten steps out of the back door and
look for the Moonflower card." The card is the paper twin, and the code on it
is generated by the server for this child, printed through the printables
route, and hidden by the grown up wherever the mission says. The child finds
it in the real world, enters the code on the MissionBoard, and the server
checks it. At 6 to 7 the code is three pictures the child taps in order (a
pictorial code, no reading needed). At 8 to 9 it is a four letter word. A
wrong code says "not quite, have another look" and nothing else, with no
lockout and no count of tries.

Some codes need no card, because the answer is fixed in the mission data:
"How many legs on the spider in the shed? Bring me the number." The registry
marks these `answer` and the server checks that instead. Both shapes are the
same flow to the child.

**Goals without pressure.** The board shows at most three missions, each with
its named reward. There is no streak, no "3 of 5 this week", no expiry. A
finished mission goes off the board and the next one comes on. The planet
fills over months and the sky is the record.

### 5.3 Tier 3 (ages 10 plus): custom boundary settings

The tween programs the Friends' day. This is the top of the ladder: the toy
stops setting timings and starts holding the ones the child sets.

**The ScheduleComponent, as a screen.** A simple block builder, borrowed from
Forest's grow ring rather than from any calendar: pick Grow blocks (study,
reading, homework, practice, from a fixed label list so no free text is
stored) and Rest blocks, each a length from a list (5 to 45 minutes). The
Friends' bedtime is a separate row, preset to the family's window and
movable earlier only. Moving it later is a button that reads "Ask to change
our deal", and it sends a proposal to the parent app in the words the family
agreement builder already uses. The parent's Yes changes the family setting,
not the toy's copy of it, so the paper deal on the fridge, the timer and the
planet never disagree.

**GrowAndRestNode.** The Tier 3 offline exit and the productivity timer the
brief asks for. The Friend sits at a desk on the planet and "works" beside
the child: it reads when the block is reading, writes when it is homework,
and the ring around it fills over the real minutes. The screen is a focus
card, not a game: the Friend, the ring, the block's label, one big number,
and one button, Pause. At the end of a Grow block the Friend stretches and
the Rest block starts by itself, and at the end of a Rest block the Friend
looks up and waits. It never buzzes. A block the child abandons is banked for
the minutes done and says so; there is no "you gave up" and no broken ring.

Growth at Tier 3 comes almost entirely from Grow blocks, which is the whole
message for this age: the planet grows while you do your real work, and the
study lamp, the bright stars and the two seat rocket are the rewards on that
path.

**Trust.** The parent sets `trust` on the parent app: grown up (every claim
is an ask), shared (timer and code missions self approve, the rest ask), or
self (the child's We did it is enough). The default is shared. The setting
is the same ladder the star quest runs and it fades the same way, toward the
system becoming unnecessary.

**The planet's name.** Decided by Justin, 2 September 2026: at Tier 3 the
child may type a name for the planet, the toy's one free text field. The
cast keep their own names at every tier.

---

## 6. What it reuses, what is new, the build order, and what Justin decided

**Reused as it is.**

- The child link, token scoping, the no model guard, the theme
  (`lib/kid/theme.ts`).
- The Planet Friends cast and art (`lib/content/stage-characters.ts`).
- Bedtime, protected windows and the London clock
  (`lib/quests/time-tiers.ts`, `lib/time/london.ts`).
- AskPopup and the ask pipe on the parent side, polled every 20 seconds.
- The device time ask for the bedtime door, unchanged.
- The printables engine and the drawn sheets for every paper twin.
- The `scripts` table for the grown up prompts.
- The quest games pattern: registry data, renderers in the app, the server
  decides.

**New.**

- `lib/planet/` (logic, registry, view, server, sounds) and
  `components/planet/` (the scene, the Friend figure, the root with its
  overlays).
- Migration 252 (two tables; 251's garden tables retired, both empty).
- Three token scoped routes under `app/api/kid/planet/` (`state`, `event`)
  plus the parent side answer route `app/api/quests/planet/ask`.
- Six music box rounds and a small sound set, all Web Audio, no files.

**Build order, four slices, each shippable.**

1. The home planet, the pod, the starlight loop, the bedtime sync, Tier 1
   and Tier 2 timings, the babies in the nursery, the MoonPhone on its
   charger, and the Learn door on the growth reveal. Built.
2. The Copycat Engine with the starter catalogue including the lesson
   mission, the paper twins, the ask in AskPopup, hidden codes.
3. The Digital Playground, the Screen Time Cafe and the malware loop.
4. StarNet with the dome tool, and the Tier 3 schedule and GrowAndRest.

**Checks before any slice is called done.** Playwright at 390 and 1280 with
every slot dragged and every button tapped, the child guard script green, the
dash check over every registry line, `scripts/check-planet-logic.mjs`
passing, and a real evening where the planet goes to its night side at the
family's bedtime on a real phone.

**What Justin decided, 2 September 2026.**

1. Missions pay on the planet only, never stars directly. A parent who wants
   the same activity to earn stars adds it as a quest on the board they
   already have.
2. Slice 1 ships to Tier 1 and Tier 2 together.
3. A typed name is allowed at Tier 3, the toy's only free text field (it
   names the planet; the cast keep their names).
4. The toy is Planet Friends, the cast we already have, and planets not
   gardens. The first build was a garden and was rebuilt in full.
5. The younger child meets the cast as babies until they reach each
   Friend's age.

---

*Update this file when the build changes it. It earns its place by being
true.*
