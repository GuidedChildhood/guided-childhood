// Planet Friends: the rules, pure.
//
// Design: plans/planet-friends-architecture.md. The toy's Fable 5.1 state
// machines compiled down to plain functions: starlight drain, the three
// rests (the pod, real sunshine, the slow orbit), the planet's growth, the
// night, the tier table, and who is still a baby. It imports nothing on
// purpose. The server runs it against its own clock (the client reports, the
// server decides), the dev fixture runs it against a pretend clock, and
// scripts/check-planet-logic.mjs runs it under node with type stripping, so
// the same function answers every time and the toy cannot disagree with
// itself.
//
// Time arrives as ISO strings and London minutes, never as Date objects, so
// nothing here can accidentally read the machine clock.

export type Tier = 1 | 2 | 3
export type FriendKey = 'pebble' | 'bloop' | 'orbit' | 'nova' | 'cosmo'
export type CooldownReason = 'nap' | 'sunlight' | 'ambient'

export type Cooldown = {
  reason: CooldownReason
  startedAt: string
  endsAt: string
  lengthMinutes: number
}

/** One of the child's Planet Friends, looked after on the home planet. */
export type Friend = {
  key: FriendKey
  /** Starlight, 0 to 100. Falls while the child plays, restored only by a rest. */
  energy: number
  cooldown: Cooldown | null
  /** A little cloud over this Friend (Tier 2 slows the drain a fifth). */
  cloud: boolean
}

export type MissionProof = 'grownup_tap' | 'timer' | 'code' | 'lesson'
/**
 * A part the child can build with (slice 3). Missions and growth put parts in
 * the box; the child puts them on the planet. RewardKey is the old name.
 */
export type PartKey =
  | 'flag' | 'bench' | 'lamp' | 'rocket' | 'telescope' | 'trampoline' | 'rover' | 'swing' | 'tent'
  | 'campfire' | 'dish' | 'night_light' | 'moon' | 'comet' | 'star' | 'robot' | 'ring'
export type RewardKey = PartKey
export type Outfit = 'party_hat' | 'glasses' | 'helmet' | 'cape' | 'crown'
export type Zone = 'sky' | 'horizon' | 'ground' | 'ring'

/** The mechanics of a mission. The words live in lib/planet/missions.ts. */
export type MissionDef = {
  key: string
  tiers: Tier[]
  proof: MissionProof
  /** For proof timer: the real minutes it takes. */
  timerMinutes?: number
  /** For proof code: the answer, one token per tap (digits, letters or pictures). */
  answer?: string[]
  /** For proof code: the answer is made by the server for this child and printed on a card (slice 2b). The server merges it into `answer` before a claim. */
  perChild?: boolean
  reward: RewardKey
}

export type MissionStatus = 'doing' | 'claimed' | 'approved' | 'notnow' | 'done'

export type MissionState = {
  key: string
  status: MissionStatus
  startedAt: string
  /** For proof timer: when the server says the minutes are up. */
  timerEndsAt: string | null
  claimedAt: string | null
  approvedAt: string | null
}

// ── The self (slice 3b): the child's own explorer figure ─────────────────────
// Justin, 6 September 2026: "build the self, like skin colour, hair, put on
// a space suit and more." The cast stay the cast (design 7.6); this is the
// child's OWN figure, an explorer in a space suit, standing with the Friends
// and riding the rocket on the map. Choices are indices into the option
// tables so the save stays tiny and a bad index from a stale client is
// rejected, never drawn wrong. Play state, changed any time. Built in PR 984
// by the other session on this lane and kept whole in the merge.

export type Self = {
  /** Index into SELF_SKINS. */
  skin: number
  /** Index into SELF_HAIRS. */
  hair: number
  /** Index into SELF_HAIR_COLOURS. */
  hairColour: number
  /** Index into SELF_SUITS. */
  suit: number
}

/** Six skin tones, dark to light, drawn from the drawn paper palette family. */
export const SELF_SKINS = ['#5C3A21', '#7A4A2B', '#9C6644', '#C68642', '#E0AC69', '#F1C9A5'] as const
/** Hair shapes, each drawn in SelfFigure. */
export const SELF_HAIRS = ['curls', 'afro', 'braids', 'bun', 'swoop', 'spikes'] as const
export const SELF_HAIR_COLOURS = ['#1A1A2E', '#3B2A20', '#6B4423', '#A0522D', '#C97B54', '#E6B93E', '#B0B7C4', '#D95970'] as const
/** Space suit colours, one per Friend's family plus two of the child's own. */
export const SELF_SUITS = ['#E6B93E', '#7CB342', '#4C9FD6', '#9B72CF', '#E8873C', '#F2957A'] as const

export const isSelf = (v: unknown): v is Self => {
  if (!v || typeof v !== 'object') return false
  const s = v as Record<string, unknown>
  const idx = (n: unknown, max: number) => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < max
  return idx(s.skin, SELF_SKINS.length) && idx(s.hair, SELF_HAIRS.length) && idx(s.hairColour, SELF_HAIR_COLOURS.length) && idx(s.suit, SELF_SUITS.length)
}

/** The child's home planet: the Friends on it and how far it has grown. */
export type Home = {
  version: 1
  tier: Tier
  /** The child's own explorer figure, or null before they build one. */
  self: Self | null
  friends: Friend[]
  /** Missions started, claimed or landed. A mission not listed here is simply on the board. */
  missions: MissionState[]
  /** The parts the child owns, in the box or on the planet, in the order they arrived. */
  rewards: PartKey[]
  /** Where the parts are and who wears what (slice 3). */
  build: Build
  /** The Den, the things in it, the MoonPhones and the shelf (slice 3a). */
  world: World
  /**
   * How many lessons this child has passed, counted by the server from the
   * lessons tables on every read and never from the client (slice 3b). It
   * decides which planets are open. Missing on an older save reads as 0.
   */
  lessonsPassed?: number
  /** 0 bare rock, 1 first grass, 2 a flag, 3 a little house, 4 rings, 5 a moon. */
  growthStage: number
  /** 0 to 100 toward the next stage. Moves only when a rest closes. */
  growthProgress: number
  /** Growth points gained since the child last looked. Shown once, then cleared. */
  grewWhileAway: number
  /** Server time of the last drain, so a tick drains only real play. */
  energyTickedAt: string
  /** The London date whose night has already been applied. */
  lastNightAppliedOn: string | null
  createdAt: string
  lastSeenAt: string
}

/** The one door every locked state has, and the grown up's tap on a mission. At most one at a time. */
export type HomeAsk = {
  id: string
  kind: 'wake' | 'mission'
  status: 'pending' | 'approved' | 'declined'
  createdAt: string
  answeredAt: string | null
  /** Wake asks: minutes the Friends had left to rest when the child asked. */
  minutesLeft: number
  /** Mission asks: which mission, and the line the parent reads ("says you planted a real seed together"). */
  missionKey?: string
  title?: string
}

export type Mood = 'happy' | 'sleepy' | 'tired' | 'asleep' | 'sunbathing' | 'resting'

export type TierConfig = {
  /** Play before a Friend is fully drained of starlight. */
  playMinutes: number
  napMinutes: number
  sunlightMinutes: number
  ambientMinutes: number
  /** A Friend under a cloud drains 20 percent slower, the first hint that light and starlight are linked. */
  cloudSlows: boolean
  /** Whether the child reads words on screen. Tier 1 is pictures and sound. */
  words: boolean
}

// The whole tuning, in one place (design section 5). Tier 3 is here so the
// tier is always resolvable; its own settings arrive with slice 4.
export const TIERS: Record<Tier, TierConfig> = {
  1: { playMinutes: 15, napMinutes: 15, sunlightMinutes: 3, ambientMinutes: 15, cloudSlows: false, words: false },
  2: { playMinutes: 20, napMinutes: 15, sunlightMinutes: 3, ambientMinutes: 15, cloudSlows: true, words: true },
  3: { playMinutes: 25, napMinutes: 15, sunlightMinutes: 3, ambientMinutes: 15, cloudSlows: true, words: true },
}

/** Which Friends the child looks after at each tier. The rest are babies in the nursery dome. */
export const ACTIVE_BY_TIER: Record<Tier, FriendKey[]> = {
  1: ['pebble'],
  2: ['pebble', 'bloop'],
  3: ['pebble', 'bloop', 'orbit'],
}

/** The whole cast, in the order they grow up. */
export const FRIEND_KEYS: FriendKey[] = ['pebble', 'bloop', 'orbit', 'nova', 'cosmo']

/**
 * The age a Friend grows up. Justin, 2 September 2026: "the younger one could
 * be mini characters as babies until they all reach the age." The cast is on
 * the planet from the first day; each Friend is a baby until the child
 * reaches the bottom of that Friend's own stage, then it grows up alongside
 * them. The same numbers as the stage spine in lib/content/stages.ts.
 */
export const FRIEND_MIN_AGE: Record<FriendKey, number> = { pebble: 4, bloop: 8, orbit: 11, nova: 13, cosmo: 16 }

/** Growth points a rest is worth. A full stage is 100. Night is the big one. */
export const GROWTH: Record<CooldownReason | 'night', number> = { nap: 25, sunlight: 10, ambient: 15, night: 40 }
export const SLEEPY_AT = 20
export const MAX_STAGE = 5
/** A tick drains at most this much real time, so a child who was away is not drained for the absence. */
export const TICK_CAP_SECONDS = 90
export const WIND_DOWN_MINUTES = 30
/** After this long drained with no touch, the Friend rests by itself. */
export const AMBIENT_AFTER_SECONDS = 20

const BAND_FLOOR: Record<string, number> = { '4-7': 4, '8-10': 8, '11-13': 11, '13-15': 13, '16+': 16 }

/**
 * The child's age in whole years. Date of birth when it is known (asked once
 * at signup); the bottom of the age band otherwise, which is the honest
 * reading of a band: a child in 8 to 10 is at least 8.
 */
export function childAgeFor(dateOfBirth: string | null | undefined, ageBand: string | null | undefined, now: Date = new Date()): number {
  if (dateOfBirth) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateOfBirth)
    if (m) {
      const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3])
      let age = now.getUTCFullYear() - y
      const notYet = now.getUTCMonth() + 1 < mo || (now.getUTCMonth() + 1 === mo && now.getUTCDate() < d)
      if (notYet) age -= 1
      return Math.max(0, age)
    }
  }
  if (ageBand && ageBand in BAND_FLOOR) return BAND_FLOOR[ageBand]
  return 11
}

/** Which tier a child is on: ages 3 to 5 are Tier 1, 6 to 9 Tier 2, 10 and up Tier 3. */
export function tierFor(dateOfBirth: string | null | undefined, ageBand: string | null | undefined, now: Date = new Date()): Tier {
  const age = childAgeFor(dateOfBirth, ageBand, now)
  if (age < 6) return 1
  if (age < 10) return 2
  return 3
}

/** A Friend is a baby until the child reaches the bottom of its stage. */
export function isGrownUp(key: FriendKey, childAge: number): boolean {
  return childAge >= FRIEND_MIN_AGE[key]
}

export function addMinutes(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60000).toISOString()
}

function secondsBetween(fromIso: string, toIso: string): number {
  return (new Date(toIso).getTime() - new Date(fromIso).getTime()) / 1000
}

/** Whole minutes still to rest, never below zero. */
export function minutesLeft(cooldown: Cooldown, nowIso: string): number {
  return Math.max(0, Math.ceil(secondsBetween(nowIso, cooldown.endsAt) / 60))
}

export function newFriend(key: FriendKey): Friend {
  return { key, energy: 100, cooldown: null, cloud: false }
}

export function newHome(tier: Tier, nowIso: string, nightKey: string | null): Home {
  return {
    version: 1,
    tier,
    self: null,
    friends: ACTIVE_BY_TIER[tier].map(newFriend),
    missions: [],
    rewards: [...STARTER_PARTS],
    build: newBuild(),
    world: newWorld(ACTIVE_BY_TIER[tier]),
    growthStage: 1,
    growthProgress: 0,
    grewWhileAway: 0,
    energyTickedAt: nowIso,
    // The night that has already passed is not owed to a planet that did not
    // exist yet, so a planet made at ten in the morning does not wake up
    // grown at ten past.
    lastNightAppliedOn: nightKey,
    createdAt: nowIso,
    lastSeenAt: nowIso,
  }
}

/** Growth points onto the planet, carrying over stages, stopping at the moon. */
export function grow(home: Home, points: number): Home {
  if (points <= 0 || home.growthStage >= MAX_STAGE) return home
  let stage = home.growthStage
  let progress = home.growthProgress + points
  while (progress >= 100 && stage < MAX_STAGE) { progress -= 100; stage += 1 }
  if (stage >= MAX_STAGE) progress = 0
  // Every stage reached while the child was away brings a gift into the box.
  let rewards = home.rewards
  let build = home.build
  for (let s = home.growthStage + 1; s <= stage; s++) {
    const gift = STAGE_GIFTS[s]
    if (gift?.part && !rewards.includes(gift.part)) rewards = [...rewards, gift.part]
    if (gift?.outfit && !build.outfits.includes(gift.outfit)) build = { ...build, outfits: [...build.outfits, gift.outfit] }
  }
  return { ...home, growthStage: stage, growthProgress: progress, grewWhileAway: home.grewWhileAway + points, rewards, build }
}

export function startCooldown(friend: Friend, reason: CooldownReason, minutes: number, nowIso: string): Friend {
  return { ...friend, cooldown: { reason, startedAt: nowIso, endsAt: addMinutes(nowIso, minutes), lengthMinutes: minutes } }
}

/** A rest for one Friend: the cooldown starts and whatever it was holding is put away first. */
function restFriend(home: Home, key: FriendKey, reason: CooldownReason, minutes: number, nowIso: string): Home {
  const f = home.friends.find(x => x.key === key)
  if (!f || f.cooldown) return home
  const put = handsEmpty(home, key, nowIso)
  return { ...put, friends: put.friends.map(x => (x.key === key ? startCooldown(x, reason, minutes, nowIso) : x)) }
}

function fractionRested(cooldown: Cooldown, nowIso: string): number {
  const total = cooldown.lengthMinutes * 60
  if (total <= 0) return 1
  return Math.max(0, Math.min(1, secondsBetween(cooldown.startedAt, nowIso) / total))
}

/**
 * Close a rest. The growth it was worth arrives in full when it ran to the
 * end, or by the fraction actually rested when a grown up's yes woke the
 * Friend early. Starlight comes back to full either way: a yes is a yes.
 */
export function closeCooldown(friend: Friend, fraction = 1): { friend: Friend; points: number } {
  if (!friend.cooldown) return { friend, points: 0 }
  const points = Math.round(GROWTH[friend.cooldown.reason] * Math.max(0, Math.min(1, fraction)))
  return { friend: { ...friend, cooldown: null, energy: 100 }, points }
}

/**
 * Bring the planet up to now on the server's clock: rests that have ended
 * close and pay their growth, the night lands once per London date, and a
 * long absence resets the drain clock so the first tick back costs nothing.
 * Runs before every event and every read. Idempotent.
 */
export function reconcile(home: Home, nowIso: string, nightKey: string | null): Home {
  // A planet saved by slice 1 has no missions yet. Filled in here, once, so
  // nothing downstream has to ask.
  if (!Array.isArray(home.missions) || !Array.isArray(home.rewards)) {
    home = { ...home, missions: Array.isArray(home.missions) ? home.missions : [], rewards: Array.isArray(home.rewards) ? home.rewards : [] }
  }
  // A planet saved before the build (slice 3) gets a box with the starters in
  // it, and anything the garden left behind is let go.
  if (!home.build || !Array.isArray(home.build.placed)) {
    const kept = home.rewards.filter(isPartKey)
    home = { ...home, rewards: [...STARTER_PARTS.filter(p => !kept.includes(p)), ...kept], build: newBuild() }
  }
  // The self (slice 3b): a save from before it simply has none yet, and a
  // mangled one reads as none rather than being drawn wrong.
  if (home.self === undefined || (home.self !== null && !isSelf(home.self))) {
    home = { ...home, self: isSelf(home.self) ? home.self : null }
  }
  // The Den (slice 3a): a save from before it gets a world, and a Friend who
  // joined at a tier change gets a MoonPhone.
  home = ensureWorld(home)
  home = settleWorld(home, nowIso)
  let points = 0
  let friends = home.friends.map(f => {
    if (f.cooldown && new Date(f.cooldown.endsAt).getTime() <= new Date(nowIso).getTime()) {
      const closed = closeCooldown(f)
      points += closed.points
      return closed.friend
    }
    return f
  })
  let lastNightAppliedOn = home.lastNightAppliedOn
  if (nightKey && lastNightAppliedOn !== nightKey) {
    friends = friends.map(f => {
      if (f.cooldown) { const closed = closeCooldown(f, fractionRested(f.cooldown, nowIso)); points += closed.points; return closed.friend }
      return { ...f, energy: 100 }
    })
    points += GROWTH.night
    lastNightAppliedOn = nightKey
  }
  const away = secondsBetween(home.energyTickedAt, nowIso)
  const energyTickedAt = away > TICK_CAP_SECONDS || away < 0 ? nowIso : home.energyTickedAt
  return grow({ ...home, friends, lastNightAppliedOn, energyTickedAt }, points)
}

export type HomeEvent =
  | { kind: 'tick' }
  | { kind: 'nap_start'; friend: FriendKey }
  | { kind: 'sunlight_start'; friend: FriendKey }
  | { kind: 'ambient_start'; friend: FriendKey }
  | { kind: 'cloud'; friend: FriendKey; on: boolean }
  | { kind: 'seen' }
  | { kind: 'wake_all' }
  | { kind: 'mission_start'; key: string }
  | { kind: 'mission_claim'; key: string; code?: string[] }
  | { kind: 'mission_approve'; key: string }
  | { kind: 'mission_notnow'; key: string }
  | { kind: 'mission_seen'; key: string }
  | { kind: 'part_place'; part: PartKey; slot: string }
  | { kind: 'part_move'; part: PartKey; slot: string }
  | { kind: 'part_remove'; part: PartKey }
  | { kind: 'outfit_set'; friend: FriendKey; outfit: Outfit | null }
  | { kind: 'self_set'; self: Self }
  | { kind: 'room_move'; friend: FriendKey; where: Where }
  | { kind: 'thing_place'; thing: Movable; room: RoomKey; spot: string }
  | { kind: 'thing_home'; thing: Movable }
  | { kind: 'thing_give'; thing: ThingKey | DeviceKey; friend: FriendKey }
  | { kind: 'eat'; friend: FriendKey }
  | { kind: 'snap'; friend: FriendKey }
  | { kind: 'device_dock'; device: DeviceKey }
  | { kind: 'planet_move'; planet: PlanetKey; x: number; y: number }

/** Starlight lost per minute of play for this tier and cloud. */
export function drainPerMinute(cfg: TierConfig, cloud: boolean): number {
  return (100 / cfg.playMinutes) * (cloud && cfg.cloudSlows ? 0.8 : 1)
}

/**
 * One event against the planet. Every rule of the starlight loop is a branch
 * here (design section 3.1). Unknown Friends and impossible transitions
 * return the planet unchanged rather than throwing, because a stale client
 * is a fact of life on a child's phone and must never break it.
 */
export function applyEvent(home: Home, ev: HomeEvent, nowIso: string, defs: Record<string, MissionDef> = {}): Home {
  const cfg = TIERS[home.tier]
  const forFriend = (key: FriendKey, f: (fr: Friend) => Friend): Home =>
    ({ ...home, friends: home.friends.map(fr => (fr.key === key ? f(fr) : fr)) })
  const missionOf = (key: string): MissionState | undefined => home.missions.find(m => m.key === key)
  const withMission = (m: MissionState): Home =>
    ({ ...home, missions: [...home.missions.filter(x => x.key !== m.key), m] })
  const land = (m: MissionState): Home => {
    const def = defs[m.key]
    const rewards = def && !home.rewards.includes(def.reward) ? [...home.rewards, def.reward] : home.rewards
    return { ...withMission({ ...m, status: 'approved', approvedAt: nowIso }), rewards }
  }

  switch (ev.kind) {
    // ── The build: the client asks, these rules decide ──────────────────
    case 'part_place': {
      const b = home.build
      if (!home.rewards.includes(ev.part) || b.placed.some(p => p.part === ev.part)) return home
      // A part in a room of the Den is not in the box (slice 3a).
      if (home.world?.placed?.some(p => p.thing === ev.part)) return home
      if (!slotTakes(ev.slot, ev.part) || b.placed.some(p => p.slot === ev.slot)) return home
      if (b.placed.length >= plotsFor(home.growthStage)) return home
      return { ...home, build: { ...b, placed: [...b.placed, { part: ev.part, slot: ev.slot }] } }
    }
    case 'part_move': {
      const b = home.build
      const cur = b.placed.find(p => p.part === ev.part)
      if (!cur || cur.slot === ev.slot) return home
      if (!slotTakes(ev.slot, ev.part) || b.placed.some(p => p.slot === ev.slot)) return home
      return { ...home, build: { ...b, placed: b.placed.map(p => (p.part === ev.part ? { ...p, slot: ev.slot } : p)) } }
    }
    case 'part_remove': {
      const b = home.build
      if (!b.placed.some(p => p.part === ev.part)) return home
      return { ...home, build: { ...b, placed: b.placed.filter(p => p.part !== ev.part) } }
    }
    case 'outfit_set': {
      const b = home.build
      if (!home.friends.some(f => f.key === ev.friend)) return home
      if (ev.outfit && !b.outfits.includes(ev.outfit)) return home
      // One wearer per outfit: it moves from whoever had it.
      const wearing: Build['wearing'] = {}
      for (const [k, o] of Object.entries(b.wearing)) if (o && o !== ev.outfit && k !== ev.friend) wearing[k as FriendKey] = o
      if (ev.outfit) wearing[ev.friend] = ev.outfit
      return { ...home, build: { ...b, wearing } }
    }
    case 'self_set': {
      // The child built or changed their own figure. Bad indices from a
      // stale client leave the save untouched, the same manner as every
      // other impossible transition here.
      if (!isSelf(ev.self)) return home
      return { ...home, self: { skin: ev.self.skin, hair: ev.self.hair, hairColour: ev.self.hairColour, suit: ev.self.suit } }
    }
    case 'mission_start': {
      // From the board, or back from a not now. A mission already under way
      // or already landed stays as it is.
      const def = defs[ev.key]
      if (!def || !def.tiers.includes(home.tier)) return home
      const cur = missionOf(ev.key)
      if (cur && cur.status !== 'notnow') return home
      return withMission({
        key: ev.key, status: 'doing', startedAt: nowIso,
        timerEndsAt: def.proof === 'timer' ? addMinutes(nowIso, def.timerMinutes ?? 5) : null,
        claimedAt: null, approvedAt: null,
      })
    }
    case 'mission_claim': {
      // We did it. What that means depends on the proof, and the server is
      // the one holding the clock and the answer.
      const def = defs[ev.key]
      const cur = missionOf(ev.key)
      if (!def || !cur || cur.status !== 'doing') return home
      if (def.proof === 'timer') {
        if (!cur.timerEndsAt || new Date(cur.timerEndsAt).getTime() > new Date(nowIso).getTime()) return home
        return land({ ...cur, claimedAt: nowIso })
      }
      if (def.proof === 'code') {
        const want = (def.answer ?? []).join('').toLowerCase()
        const got = (ev.code ?? []).join('').toLowerCase()
        if (!want || got !== want) return home
        return land({ ...cur, claimedAt: nowIso })
      }
      // A grown up's tap and a lesson are decided outside this file: the
      // claim is recorded and the server layer asks or checks.
      return withMission({ ...cur, status: 'claimed', claimedAt: nowIso })
    }
    case 'mission_approve': {
      const cur = missionOf(ev.key)
      if (!cur || (cur.status !== 'claimed' && cur.status !== 'doing')) return home
      return land({ ...cur, claimedAt: cur.claimedAt ?? nowIso })
    }
    case 'mission_notnow': {
      // Back on the board, kindly. No cooldown, no count.
      const cur = missionOf(ev.key)
      if (!cur || cur.status !== 'claimed') return home
      return withMission({ ...cur, status: 'notnow', claimedAt: null })
    }
    case 'mission_seen': {
      const cur = missionOf(ev.key)
      if (!cur || cur.status !== 'approved') return home
      return withMission({ ...cur, status: 'done' })
    }
    case 'tick': {
      // Only real play drains: the seconds since the last tick, capped, and
      // only Friends that are awake. A resting Friend is not playing. A
      // Friend holding its MoonPhone drains double (design 3.1), and the
      // phone's battery runs down at the base rate with it.
      const seconds = Math.max(0, Math.min(TICK_CAP_SECONDS, secondsBetween(home.energyTickedAt, nowIso)))
      let next: Home = home
      const friends = home.friends.map(f => {
        if (f.cooldown) return f
        const energy = Math.max(0, f.energy - (seconds / 60) * drainPerMinute(cfg, f.cloud) * drainMultiplier(home, f.key))
        return { ...f, energy: Math.round(energy * 100) / 100 }
      })
      next = { ...next, friends, energyTickedAt: nowIso }
      for (const f of friends) {
        const dev = heldDevice(next, f.key)
        if (!dev) continue
        const d = next.world.devices[dev]
        if (!d) continue
        const battery = Math.max(0, Math.round((d.battery - (seconds / 60) * (100 / cfg.playMinutes)) * 100) / 100)
        next = { ...next, world: { ...next.world, devices: { ...next.world.devices, [dev]: { ...d, battery } } } }
        // Flat, or sleepy: the Friend puts its phone on the shelf by itself.
        // The modelling beat, before the child is asked to do anything.
        if (battery <= 0 || f.energy <= SLEEPY_AT) next = dockDevice(next, dev, nowIso)
      }
      return next
    }
    case 'nap_start':
      return restFriend(home, ev.friend, 'nap', cfg.napMinutes, nowIso)
    case 'sunlight_start':
      return restFriend(home, ev.friend, 'sunlight', cfg.sunlightMinutes, nowIso)
    case 'ambient_start': {
      // Only a fully drained Friend rests by itself. Anything else is a drag
      // the child chose, which is one of the two events above.
      const f = home.friends.find(x => x.key === ev.friend)
      if (!f || f.cooldown || f.energy > 0) return home
      return restFriend(home, ev.friend, 'ambient', cfg.ambientMinutes, nowIso)
    }
    // ── The Den: rooms, things, the MoonPhones and the shelf (slice 3a) ──
    case 'room_move': {
      const f = home.friends.find(x => x.key === ev.friend)
      if (!f || f.cooldown || !isWhere(ev.where)) return home
      const planet = planetOf(ev.where)
      if (!planetOpen(home, planet)) return home
      const visited = home.world.visited ?? []
      return { ...home, world: { ...home.world, where: { ...home.world.where, [ev.friend]: ev.where }, visited: visited.includes(planet) ? visited : [...visited, planet] } }
    }
    case 'planet_move': {
      // The child dragged a planet somewhere in the sky and it stays there.
      // Clamped inside the sky so a planet can never be lost off the edge.
      if (!isPlanetKey(ev.planet) || !Number.isFinite(ev.x) || !Number.isFinite(ev.y)) return home
      const place = clampPlace({ x: Math.round(ev.x), y: Math.round(ev.y) })
      return { ...home, world: { ...home.world, places: { ...(home.world.places ?? {}), [ev.planet]: place } } }
    }
    case 'thing_place': {
      const w = home.world
      if (!isMovable(ev.thing) || !ROOM_KEYS.includes(ev.room)) return home
      const spot = ROOM_SPOTS[ev.room].find(sp => sp.id === ev.spot)
      if (!spot || spot.zone !== roomZoneOf(ev.thing)) return home
      if (w.placed.some(p => p.room === ev.room && p.spot === ev.spot && p.thing !== ev.thing)) return home
      if (isPartKey(ev.thing) && (!home.rewards.includes(ev.thing) || home.build.placed.some(p => p.part === ev.thing))) return home
      if (isThingKey(ev.thing) && w.eaten[ev.thing]) return home
      if (isDeviceKey(ev.thing)) { const d = w.devices[ev.thing]; if (!d || charging(d, nowIso)) return home }
      const lifted = lift(home, ev.thing)
      const devices = isDeviceKey(ev.thing) && lifted.world.devices[ev.thing] ? { ...lifted.world.devices, [ev.thing]: { ...lifted.world.devices[ev.thing]!, at: 'placed' as const, chargedAt: null } } : lifted.world.devices
      return { ...lifted, world: { ...lifted.world, devices, placed: [...lifted.world.placed, { thing: ev.thing, room: ev.room, spot: ev.spot }] } }
    }
    case 'thing_home': {
      // Back where it lives: the fridge, the toy box, the parts box. A phone
      // lives on the shelf, which is device_dock.
      if (!isMovable(ev.thing) || isDeviceKey(ev.thing)) return home
      return lift(home, ev.thing)
    }
    case 'thing_give': {
      const w = home.world
      const f = home.friends.find(x => x.key === ev.friend)
      if (!f || f.cooldown) return home
      if (!(isThingKey(ev.thing) || isDeviceKey(ev.thing))) return home
      if (isThingKey(ev.thing) && w.eaten[ev.thing]) return home
      if (isDeviceKey(ev.thing)) {
        const d = w.devices[ev.thing]
        if (!d || d.owner !== ev.friend || charging(d, nowIso)) return home
      }
      // The hand holds one thing: what was there goes back where it lives.
      let next = handsEmpty(home, ev.friend, nowIso)
      next = lift(next, ev.thing)
      const devices = isDeviceKey(ev.thing) && next.world.devices[ev.thing] ? { ...next.world.devices, [ev.thing]: { ...next.world.devices[ev.thing]!, at: 'hand' as const, chargedAt: null } } : next.world.devices
      return { ...next, world: { ...next.world, devices, held: { ...next.world.held, [ev.friend]: ev.thing } } }
    }
    case 'eat': {
      const held = home.world.held[ev.friend]
      if (!held || !isFoodKey(held)) return home
      const { [ev.friend]: _gone, ...rest } = home.world.held
      void _gone
      return { ...home, world: { ...home.world, held: rest, eaten: { ...home.world.eaten, [held]: dayOf(nowIso) } } }
    }
    case 'snap': {
      const dev = heldDevice(home, ev.friend)
      if (!dev) return home
      const d = home.world.devices[dev]
      if (!d || d.battery <= 0 || d.photos >= PHOTOS_MAX) return home
      return { ...home, world: { ...home.world, devices: { ...home.world.devices, [dev]: { ...d, photos: d.photos + 1 } } } }
    }
    case 'device_dock':
      return dockDevice(home, ev.device, nowIso)
    case 'cloud':
      return forFriend(ev.friend, f => ({ ...f, cloud: ev.on }))
    case 'seen':
      return { ...home, grewWhileAway: 0, lastSeenAt: nowIso }
    case 'wake_all': {
      // The grown up said yes: every rest ends now and pays by the minutes
      // actually slept.
      let points = 0
      const friends = home.friends.map(f => {
        if (!f.cooldown) return f
        const closed = closeCooldown(f, fractionRested(f.cooldown, nowIso))
        points += closed.points
        return closed.friend
      })
      return grow({ ...home, friends }, points)
    }
    default:
      return home
  }
}

/** How many missions the board offers at once. Tier 1 is one at a time, with a grown up. */
export const BOARD_SIZE: Record<Tier, number> = { 1: 1, 2: 3, 3: 3 }

/**
 * What the board shows: missions under way first, then the next ones not yet
 * landed, up to the tier's board size. Landed missions leave the board so a
 * new one comes on. Pure, so the server and the screen agree.
 */
export function boardFor(home: Home, defs: MissionDef[]): string[] {
  const eligible = defs.filter(d => d.tiers.includes(home.tier))
  const stateOf = (key: string) => home.missions.find(m => m.key === key)
  const active = eligible.filter(d => { const st = stateOf(d.key); return st && (st.status === 'doing' || st.status === 'claimed' || st.status === 'approved') })
  const fresh = eligible.filter(d => { const st = stateOf(d.key); return !st || st.status === 'notnow' })
  return [...active, ...fresh].slice(0, BOARD_SIZE[home.tier]).map(d => d.key)
}

export function moodOf(friend: Friend): Mood {
  if (friend.cooldown?.reason === 'nap') return 'asleep'
  if (friend.cooldown?.reason === 'sunlight') return 'sunbathing'
  if (friend.cooldown?.reason === 'ambient') return 'resting'
  if (friend.energy <= 0) return 'tired'
  if (friend.energy <= SLEEPY_AT) return 'sleepy'
  return 'happy'
}

/** Every Friend is resting, so the planet itself rests. */
export function allResting(home: Home): boolean {
  return home.friends.length > 0 && home.friends.every(f => f.cooldown !== null)
}

/** Which overlay the whole planet wears when every Friend is resting. */
export function restOverlay(home: Home): 'pods' | 'orbit' | null {
  if (!allResting(home)) return null
  return home.friends.every(f => f.cooldown?.reason === 'nap') ? 'pods' : 'orbit'
}

function inWindow(at: number, start: number, end: number): boolean {
  if (start === end) return false
  return start < end ? at >= start && at < end : at >= start || at < end
}

export type BedtimePhase = 'day' | 'winddown' | 'bedtime'

/**
 * Where the family's bedtime window puts this minute of the London day.
 * Thirty minutes before the window is the wind down; inside it is bedtime;
 * no window (16 plus) is always day.
 */
export function bedtimePhase(minutesNow: number, startMin: number | null, endMin: number | null): BedtimePhase {
  if (startMin === null || endMin === null) return 'day'
  if (inWindow(minutesNow, startMin, endMin)) return 'bedtime'
  const untilStart = (startMin - minutesNow + 1440) % 1440
  if (untilStart > 0 && untilStart <= WIND_DOWN_MINUTES) return 'winddown'
  return 'day'
}

/**
 * The London date of the most recent morning that has already happened: the
 * night that is owed. Today's date once the window has ended, yesterday's
 * before that. Null when the family has no bedtime window.
 */
export function nightKeyFor(dateStr: string, minutesNow: number, endMin: number | null): string | null {
  if (endMin === null) return null
  if (minutesNow >= endMin) return dateStr
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr)
  if (!m) return null
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) - 1))
  return d.toISOString().slice(0, 10)
}

// ── The hidden code card (design 5.2, slice 2b) ─────────────────────────────
// A code the server makes for one child and prints on a card the grown up
// hides. At 6 and 7 it is three pictures tapped in order, no reading needed.
// From 8 it is a four letter word. Both are tokens, one per tap, and the
// check above joins them and compares. The randomness is handed in, so this
// file stays pure and the checks can be exact.

export type CodeMode = 'pictures' | 'letters'

export const PICTURE_TOKENS = ['star', 'moon', 'rocket', 'planet', 'comet', 'sun'] as const
export const CODE_WORDS = ['moon', 'star', 'glow', 'dust', 'beam', 'leaf', 'seed', 'dawn', 'nest', 'wave', 'wind', 'snow', 'rain', 'rock', 'ship', 'leap'] as const

/** Pictures before 8, letters from 8: the reading line the tiers already draw. */
export function codeModeFor(childAge: number): CodeMode {
  return childAge < 8 ? 'pictures' : 'letters'
}

/** One code. `pick(n)` returns an integer from 0 to n minus 1. */
export function makeCode(mode: CodeMode, pick: (n: number) => number): string[] {
  if (mode === 'letters') return CODE_WORDS[pick(CODE_WORDS.length)].split('')
  const left = [...PICTURE_TOKENS]
  const out: string[] = []
  while (out.length < 3 && left.length) out.push(left.splice(pick(left.length), 1)[0])
  return out
}

/** The mission defs with one child's answers merged in, so a claim can be checked. */
export function withChildAnswers(defs: Record<string, MissionDef>, answers: Record<string, string[]>): Record<string, MissionDef> {
  const out: Record<string, MissionDef> = { ...defs }
  for (const [key, code] of Object.entries(answers)) {
    if (out[key]?.perChild) out[key] = { ...out[key], answer: code }
  }
  return out
}

// ── The build (slice 3): parts, plots, slots, gifts, outfits ─────────────────
// Justin, 2 September 2026: "How is this like Toca Boca? Surely they build
// rooms and stuff." So the child builds their planet. A mission's reward is
// a part in the box; the child puts it anywhere it fits, moves it, takes it
// back. The planet has fixed places a part can go, and how many the child
// may fill grows while they are away: growth is more room to build.

export type Placed = { part: PartKey; slot: string }
export type Build = {
  placed: Placed[]
  /** The outfits the child owns. */
  outfits: Outfit[]
  /** Who wears what. One outfit per Friend, one wearer per outfit. */
  wearing: Partial<Record<FriendKey, Outfit>>
}

export const PART_KEYS: PartKey[] = ['flag', 'bench', 'lamp', 'rocket', 'telescope', 'trampoline', 'rover', 'swing', 'tent', 'campfire', 'dish', 'night_light', 'moon', 'comet', 'star', 'robot', 'ring']
export const OUTFIT_KEYS: Outfit[] = ['party_hat', 'glasses', 'helmet', 'cape', 'crown']
export const isPartKey = (k: unknown): k is PartKey => typeof k === 'string' && (PART_KEYS as string[]).includes(k)
export const isOutfit = (k: unknown): k is Outfit => typeof k === 'string' && (OUTFIT_KEYS as string[]).includes(k)

/** Where each part can go. */
export const PART_ZONE: Record<PartKey, Zone> = {
  flag: 'ground', bench: 'ground', lamp: 'ground', rocket: 'ground', trampoline: 'ground', rover: 'ground',
  tent: 'ground', campfire: 'ground', night_light: 'ground', robot: 'ground',
  telescope: 'horizon', swing: 'horizon', dish: 'horizon',
  moon: 'sky', comet: 'sky', star: 'sky',
  ring: 'ring',
}

/** The places on the planet, by id and zone. Where they are drawn lives in HomePlanet. */
export const SLOTS: { id: string; zone: Zone }[] = [
  { id: 'sky1', zone: 'sky' }, { id: 'sky2', zone: 'sky' }, { id: 'sky3', zone: 'sky' },
  { id: 'hz1', zone: 'horizon' }, { id: 'hz2', zone: 'horizon' },
  { id: 'g1', zone: 'ground' }, { id: 'g2', zone: 'ground' }, { id: 'g3', zone: 'ground' },
  { id: 'g4', zone: 'ground' }, { id: 'g5', zone: 'ground' }, { id: 'g6', zone: 'ground' },
  { id: 'ring', zone: 'ring' },
]
export const slotZone = (id: string): Zone | null => SLOTS.find(s => s.id === id)?.zone ?? null
export const slotTakes = (id: string, part: PartKey): boolean => slotZone(id) === PART_ZONE[part]

/** How many parts may be on the planet at each growth stage: growth is room to build. */
export const PLOTS_BY_STAGE = [3, 5, 7, 9, 11, 12] as const
export const plotsFor = (stage: number): number => PLOTS_BY_STAGE[Math.max(0, Math.min(PLOTS_BY_STAGE.length - 1, Math.floor(stage)))]

/** In the box from the first day, so building starts at once. */
export const STARTER_PARTS: PartKey[] = ['flag', 'bench', 'lamp']
export const STARTER_OUTFITS: Outfit[] = ['party_hat', 'glasses']

/** What each stage reached while the child was away brings into the box. Fixed, named, no rolls. */
export const STAGE_GIFTS: Record<number, { part?: PartKey; outfit?: Outfit }> = {
  1: { outfit: 'helmet' },
  2: { part: 'star' },
  3: { part: 'ring' },
  4: { outfit: 'cape' },
  5: { outfit: 'crown' },
}

export function newBuild(): Build {
  return { placed: [], outfits: [...STARTER_OUTFITS], wearing: {} }
}

/** The parts in the box: owned and not on the planet. */
export function boxParts(home: Home): PartKey[] {
  return home.rewards.filter(p => isPartKey(p) && !home.build.placed.some(x => x.part === p) && !home.world.placed.some(x => x.thing === p))
}

/** The outfits in the box: owned and not being worn. */
export function boxOutfits(home: Home): Outfit[] {
  const worn = new Set(Object.values(home.build.wearing))
  return home.build.outfits.filter(o => !worn.has(o))
}

// ── The Den (slice 3a): rooms, things, the MoonPhones and the shelf ──────────
// Justin, 5 September 2026: "to progress they get devices and put them in a
// charging port in the kitchen for example." The Friends have a house on the
// home planet. Their phones run down while they hold them and charge on the
// shelf in the kitchen for a real five minutes, and a Friend that gets sleepy
// or flat takes its phone to the shelf by itself, before the child is asked
// to do anything. Food lives in the fridge and is eaten in bites; toys live
// in the toy box; the parts from the box can come indoors. One rule for all
// of it: a thing is in exactly one place, a spot, a hand, or where it lives.

export type RoomKey =
  | 'kitchen' | 'living' | 'bedroom' | 'classroom' | 'playground'
  // The first room of each far away planet (slice 3c): the launch pad, the forest, the dome, the cafe, the studio, the igloo field, the hot springs, the colour field.
  | 'launchpad' | 'forest' | 'dome' | 'cafe' | 'studio' | 'igloos' | 'springs' | 'colours'
export type Where = 'outdoors' | RoomKey
export type RoomZone = 'wall' | 'floor' | 'table'
export type FoodKey = 'apple' | 'toast' | 'juice' | 'cake'
export type ToyKey = 'teddy' | 'ball' | 'book'
export type ThingKey = FoodKey | ToyKey
export type DeviceKey = `phone_${FriendKey}`
/** Anything that can sit in a room spot. */
export type Movable = ThingKey | PartKey | DeviceKey

export type Device = {
  owner: FriendKey
  /** 0 to 100. Runs down in the hand, fills on the shelf. */
  battery: number
  at: 'hand' | 'shelf' | 'placed'
  /** On the shelf and not yet full: when the charge completes, on the server's clock. */
  chargedAt: string | null
  /** The pretend gallery: six frames, then it is full, which is done. Cleared by a full charge. */
  photos: number
}
export type RoomPlaced = { thing: Movable; room: RoomKey; spot: string }
export type World = {
  /** Which room each active Friend is in. Not listed means outdoors. */
  where: Partial<Record<FriendKey, Where>>
  placed: RoomPlaced[]
  /** What each Friend holds. One thing per hand. */
  held: Partial<Record<FriendKey, ThingKey | DeviceKey>>
  /** Food eaten today, by the day it was eaten. The fridge restocks tomorrow. */
  eaten: Partial<Record<ThingKey, string>>
  devices: Partial<Record<DeviceKey, Device>>
  /** Where the child dragged each planet in the sky (slice 3c). Missing means the catalogue's place. */
  places?: Partial<Record<PlanetKey, { x: number; y: number }>>
  /** The planets the child has landed on, so a newly opened one can say it is new until then. */
  visited?: PlanetKey[]
}

export const ROOM_KEYS: RoomKey[] = ['kitchen', 'living', 'bedroom', 'classroom', 'playground', 'launchpad', 'forest', 'dome', 'cafe', 'studio', 'igloos', 'springs', 'colours']
/** The walk through the house: the kitchen is the front door, the bedroom the far end. */
export const ROOM_ORDER: Where[] = ['outdoors', 'kitchen', 'living', 'bedroom']
export const FOOD_KEYS: FoodKey[] = ['apple', 'toast', 'juice', 'cake']
export const TOY_KEYS: ToyKey[] = ['teddy', 'ball', 'book']
export const THING_KEYS: ThingKey[] = [...FOOD_KEYS, ...TOY_KEYS]
export const THING_ZONE: Record<ThingKey, RoomZone> = { apple: 'table', toast: 'table', juice: 'table', cake: 'table', teddy: 'floor', ball: 'floor', book: 'table' }
export const THING_HOME: Record<ThingKey, 'fridge' | 'toybox'> = { apple: 'fridge', toast: 'fridge', juice: 'fridge', cake: 'fridge', teddy: 'toybox', ball: 'toybox', book: 'toybox' }
/** Where an outdoor part goes indoors. The ring stays outside. */
export const PART_ROOM_ZONE: Record<Zone, RoomZone | null> = { ground: 'floor', horizon: 'floor', sky: 'wall', ring: null }
/** The places in each room, by id and zone. Where they are drawn lives in RoomScene. */
export const ROOM_SPOTS: Record<RoomKey, { id: string; zone: RoomZone }[]> = {
  kitchen: [
    { id: 'k_t1', zone: 'table' }, { id: 'k_t2', zone: 'table' },
    { id: 'k_f1', zone: 'floor' }, { id: 'k_f2', zone: 'floor' },
    { id: 'k_w1', zone: 'wall' },
  ],
  living: [
    { id: 'l_t1', zone: 'table' },
    { id: 'l_f1', zone: 'floor' }, { id: 'l_f2', zone: 'floor' },
    { id: 'l_w1', zone: 'wall' },
  ],
  bedroom: [
    { id: 'b_t1', zone: 'table' },
    { id: 'b_f1', zone: 'floor' }, { id: 'b_f2', zone: 'floor' },
    { id: 'b_w1', zone: 'wall' }, { id: 'b_w2', zone: 'wall' },
  ],
  classroom: [
    { id: 'c_t1', zone: 'table' }, { id: 'c_t2', zone: 'table' },
    { id: 'c_f1', zone: 'floor' }, { id: 'c_f2', zone: 'floor' },
    { id: 'c_w1', zone: 'wall' },
  ],
  playground: [
    { id: 'p_t1', zone: 'table' },
    { id: 'p_f1', zone: 'floor' }, { id: 'p_f2', zone: 'floor' }, { id: 'p_f3', zone: 'floor' },
    { id: 'p_w1', zone: 'wall' },
  ],
  // The far away planets (slice 3c). Outdoors, a wall spot is the sky above the room: a moon or a star hangs there.
  launchpad: [{ id: 's_f1', zone: 'floor' }, { id: 's_f2', zone: 'floor' }, { id: 's_w1', zone: 'wall' }],
  forest: [{ id: 'w_f1', zone: 'floor' }, { id: 'w_f2', zone: 'floor' }, { id: 'w_w1', zone: 'wall' }],
  dome: [{ id: 'o_t1', zone: 'table' }, { id: 'o_f1', zone: 'floor' }, { id: 'o_f2', zone: 'floor' }, { id: 'o_w1', zone: 'wall' }],
  cafe: [{ id: 'f_t1', zone: 'table' }, { id: 'f_t2', zone: 'table' }, { id: 'f_f1', zone: 'floor' }, { id: 'f_w1', zone: 'wall' }],
  studio: [{ id: 'n_t1', zone: 'table' }, { id: 'n_f1', zone: 'floor' }, { id: 'n_w1', zone: 'wall' }],
  igloos: [{ id: 'i_f1', zone: 'floor' }, { id: 'i_f2', zone: 'floor' }, { id: 'i_w1', zone: 'wall' }],
  springs: [{ id: 'v_f1', zone: 'floor' }, { id: 'v_f2', zone: 'floor' }, { id: 'v_w1', zone: 'wall' }],
  colours: [{ id: 'r_f1', zone: 'floor' }, { id: 'r_f2', zone: 'floor' }, { id: 'r_w1', zone: 'wall' }],
}
/** A real five minutes on the shelf, on the server's clock. */
export const CHARGE_MINUTES = 5
export const PHOTOS_MAX = 6

export const isRoomKey = (k: unknown): k is RoomKey => typeof k === 'string' && (ROOM_KEYS as string[]).includes(k)
export const isWhere = (k: unknown): k is Where => k === 'outdoors' || isRoomKey(k)
export const isFoodKey = (k: unknown): k is FoodKey => typeof k === 'string' && (FOOD_KEYS as string[]).includes(k)
export const isThingKey = (k: unknown): k is ThingKey => typeof k === 'string' && (THING_KEYS as string[]).includes(k)
export const isDeviceKey = (k: unknown): k is DeviceKey => typeof k === 'string' && k.startsWith('phone_') && (FRIEND_KEYS as string[]).includes(k.slice(6))
export const isMovable = (k: unknown): k is Movable => isThingKey(k) || isPartKey(k) || isDeviceKey(k)
export const deviceOf = (friend: FriendKey): DeviceKey => `phone_${friend}`

/** The room zone a movable thing needs. Null for the ring, which never comes indoors. */
export function roomZoneOf(thing: Movable): RoomZone | null {
  if (isThingKey(thing)) return THING_ZONE[thing]
  if (isDeviceKey(thing)) return 'table'
  return PART_ROOM_ZONE[PART_ZONE[thing]]
}

/** A new phone: full, on the shelf in the kitchen. The child hands it over; the play lengths in TIERS are for a Friend without one. */
export function newDevice(owner: FriendKey): Device {
  return { owner, battery: 100, at: 'shelf', chargedAt: null, photos: 0 }
}

/** A fresh world: everyone outdoors, every phone full on the shelf, the fridge full, nothing in anyone's hands. */
export function newWorld(friends: FriendKey[]): World {
  const devices: World['devices'] = {}
  for (const f of friends) devices[deviceOf(f)] = newDevice(f)
  return { where: {}, placed: [], held: {}, eaten: {}, devices }
}

/** A save from before the Den gets a world; a Friend who joined later gets a phone. */
export function ensureWorld(home: Home): Home {
  let world: World = home.world && Array.isArray(home.world.placed) ? home.world : newWorld(home.friends.map(f => f.key))
  // The other build of this slice (PR 984, one afternoon on main) wrote the
  // classroom as 'school'. That room is 'classroom' here, and a Friend
  // anywhere unknown simply comes home. Same for a planet key the catalogue
  // no longer has.
  const where: World['where'] = {}
  let mended = false
  for (const [k, v] of Object.entries(world.where ?? {}) as [FriendKey, string][]) {
    const fixed = v === 'school' ? 'classroom' : v
    if (isWhere(fixed)) where[k] = fixed
    if (fixed !== v || !isWhere(fixed)) mended = true
  }
  if (mended) world = { ...world, where }
  if (world.visited && world.visited.some(v => !isPlanetKey(v))) world = { ...world, visited: world.visited.filter(isPlanetKey) }
  if (world.places && Object.keys(world.places).some(k => !isPlanetKey(k))) {
    const places: World['places'] = {}
    for (const [k, v] of Object.entries(world.places)) if (isPlanetKey(k) && v) places[k] = v
    world = { ...world, places }
  }
  for (const f of home.friends) {
    const key = deviceOf(f.key)
    if (world.devices[key]) continue
    world = { ...world, devices: { ...world.devices, [key]: newDevice(f.key) } }
  }
  return world === home.world ? home : { ...home, world }
}

export const dayOf = (iso: string): string => iso.slice(0, 10)

/** Still charging on the shelf: it cannot be picked up. */
export function charging(d: Device, nowIso: string): boolean {
  return d.at === 'shelf' && !!d.chargedAt && new Date(d.chargedAt).getTime() > new Date(nowIso).getTime()
}

/** The battery as it is right now: what was stored, filling over the five minutes on the shelf. */
export function batteryNow(d: Device, nowIso: string): number {
  if (!charging(d, nowIso) || !d.chargedAt) return d.at === 'shelf' && !d.chargedAt ? 100 : d.battery
  const start = new Date(d.chargedAt).getTime() - CHARGE_MINUTES * 60000
  const f = Math.max(0, Math.min(1, (new Date(nowIso).getTime() - start) / (CHARGE_MINUTES * 60000)))
  return Math.round(d.battery + (100 - d.battery) * f)
}

/** The phone in this Friend's hand, if it is holding one. */
export function heldDevice(home: Home, friend: FriendKey): DeviceKey | null {
  const h = home.world?.held?.[friend]
  return h && isDeviceKey(h) ? h : null
}

/** A Friend holding its phone drains double (design 3.1). */
export function drainMultiplier(home: Home, friend: FriendKey): number {
  return heldDevice(home, friend) ? 2 : 1
}

/** Where every Friend is. */
export function whereIs(home: Home, friend: FriendKey): Where {
  return home.world?.where?.[friend] ?? 'outdoors'
}

/** The food and toys where they live: not on a spot, not in a hand, not eaten today. */
export function atHome(home: Home, place: 'fridge' | 'toybox'): ThingKey[] {
  const w = home.world
  const held = new Set(Object.values(w.held))
  return THING_KEYS.filter(t => THING_HOME[t] === place && !w.eaten[t] && !held.has(t) && !w.placed.some(p => p.thing === t))
}

/** Take a thing out of wherever it is: any spot, any hand. Pure bookkeeping, no rules. */
function lift(home: Home, thing: Movable): Home {
  const w = home.world
  const held: World['held'] = {}
  for (const [k, v] of Object.entries(w.held)) if (v && v !== thing) held[k as FriendKey] = v
  return { ...home, world: { ...w, held, placed: w.placed.filter(p => p.thing !== thing) } }
}

/** One Friend's hand emptied: a phone goes to the shelf, anything else goes back where it lives. */
export function handsEmpty(home: Home, friend: FriendKey, nowIso: string): Home {
  const h = home.world.held[friend]
  if (!h) return home
  if (isDeviceKey(h)) return dockDevice(home, h, nowIso)
  return lift(home, h)
}

/** The phone onto the shelf. Below full it charges for the real five minutes; nobody can pick it up until then. */
export function dockDevice(home: Home, device: DeviceKey, nowIso: string): Home {
  const d = home.world.devices[device]
  if (!d || d.at === 'shelf') return home
  const lifted = lift(home, device)
  // A phone that is all but full is full: five minutes for the last sliver would be silly.
  const full = d.battery >= 95
  const docked: Device = { ...d, at: 'shelf', battery: full ? 100 : d.battery, chargedAt: full ? null : addMinutes(nowIso, CHARGE_MINUTES) }
  return { ...lifted, world: { ...lifted.world, devices: { ...lifted.world.devices, [device]: docked } } }
}

/** Wind down and bedtime: every phone goes on the shelf and every hand is empty. The Friends do it themselves. */
export function dockAllDevices(home: Home, nowIso: string): Home {
  let next = home
  for (const f of home.friends) next = handsEmpty(next, f.key, nowIso)
  for (const key of Object.keys(next.world.devices) as DeviceKey[]) next = dockDevice(next, key, nowIso)
  return next
}

/** Charges that have completed complete, and the fridge restocks each new day. Idempotent. */
export function settleWorld(home: Home, nowIso: string): Home {
  const w = home.world
  let devices = w.devices
  for (const [key, d] of Object.entries(w.devices) as [DeviceKey, Device][]) {
    if (d.at === 'shelf' && d.chargedAt && new Date(d.chargedAt).getTime() <= new Date(nowIso).getTime()) {
      devices = { ...devices, [key]: { ...d, battery: 100, chargedAt: null, photos: 0 } }
    }
  }
  const today = dayOf(nowIso)
  const eaten: World['eaten'] = {}
  for (const [t, day] of Object.entries(w.eaten)) if (day === today) eaten[t as ThingKey] = day
  if (devices === w.devices && Object.keys(eaten).length === Object.keys(w.eaten).length) return home
  return { ...home, world: { ...w, devices, eaten } }
}

// ── The star system (slices 3b and 3c): the planets, and the keys that open them ──
// Justin, 5 September 2026: "planets they can move around, like Toca Boca
// works ... and add in the lessons to unlock planets", and 6 September: "all
// the planets floating in a universe so the child can explore each one."
// DiGi is the star in the middle of a sky twice the size of the screen, and
// every planet of the catalogue (design 7.5) floats in it: each has a place
// the child can change by dragging, and a first room to land in. A key is a
// lesson count, a mission landed or a growth stage, and any one of a planet's
// keys opens it; the count of lessons is the server's, never the client's.
// This file holds the rules; the words and the art are rows in ./universe.

export type PlanetKey = 'home' | 'school' | 'playground' | 'port' | 'wild' | 'observatory' | 'cafe' | 'starnet' | 'ice' | 'volcano' | 'rainbow'
export type PlanetOpens =
  | { kind: 'free' }
  | { kind: 'lesson'; count: number }
  | { kind: 'mission'; key: string }
  | { kind: 'stage'; stage: number }
/** What a pale planet shows: the kind of key that opens it, or later while its rooms are not drawn yet. */
export type PlanetSign = 'lesson' | 'mission' | 'stage' | 'later'

/** The sky the planets float in, in scene units: twice the screen each way, DiGi in the middle. */
export const SKY = { w: 780, h: 900, cx: 390, cy: 450 } as const
const PLACE_MARGIN = 56
export const clampPlace = (p: { x: number; y: number }): { x: number; y: number } => ({
  x: Math.max(PLACE_MARGIN, Math.min(SKY.w - PLACE_MARGIN, p.x)),
  y: Math.max(PLACE_MARGIN, Math.min(SKY.h - PLACE_MARGIN - 24, p.y)),
})

export const PLANET_ORDER: PlanetKey[] = ['home', 'school', 'playground', 'port', 'wild', 'observatory', 'cafe', 'starnet', 'ice', 'volcano', 'rainbow']
export const PLANETS: Record<PlanetKey, { rooms: Where[]; opens: PlanetOpens[]; tiers: Tier[]; at: { x: number; y: number } }> = {
  home: { rooms: ['outdoors', 'kitchen', 'living', 'bedroom'], opens: [{ kind: 'free' }], tiers: [1, 2, 3], at: { x: 270, y: 530 } },
  school: { rooms: ['classroom'], opens: [{ kind: 'lesson', count: 1 }, { kind: 'stage', stage: 2 }], tiers: [1, 2, 3], at: { x: 520, y: 380 } },
  playground: { rooms: ['playground'], opens: [{ kind: 'lesson', count: 2 }, { kind: 'stage', stage: 3 }], tiers: [1, 2, 3], at: { x: 480, y: 590 } },
  // The Space Port waits on the rocket launch or growth stage 2, so a first day shows the home planet alone (Justin, 6 September 2026).
  port: { rooms: ['launchpad'], opens: [{ kind: 'mission', key: 'rocket_launch' }, { kind: 'stage', stage: 2 }], tiers: [1, 2, 3], at: { x: 150, y: 420 } },
  wild: { rooms: ['forest'], opens: [{ kind: 'mission', key: 'explorer_walk' }, { kind: 'lesson', count: 4 }], tiers: [1, 2, 3], at: { x: 230, y: 720 } },
  observatory: { rooms: ['dome'], opens: [{ kind: 'mission', key: 'star_hunt' }, { kind: 'stage', stage: 4 }], tiers: [1, 2, 3], at: { x: 620, y: 230 } },
  cafe: { rooms: ['cafe'], opens: [{ kind: 'lesson', count: 3 }], tiers: [2, 3], at: { x: 330, y: 300 } },
  starnet: { rooms: ['studio'], opens: [{ kind: 'lesson', count: 5 }], tiers: [2, 3], at: { x: 150, y: 260 } },
  ice: { rooms: ['igloos'], opens: [{ kind: 'lesson', count: 6 }, { kind: 'stage', stage: 5 }], tiers: [1, 2, 3], at: { x: 660, y: 700 } },
  volcano: { rooms: ['springs'], opens: [{ kind: 'lesson', count: 7 }, { kind: 'mission', key: 'helping_hands' }], tiers: [1, 2, 3], at: { x: 110, y: 610 } },
  rainbow: { rooms: ['colours'], opens: [{ kind: 'lesson', count: 8 }, { kind: 'mission', key: 'moon_jumps' }], tiers: [1, 2, 3], at: { x: 650, y: 480 } },
}
export const isPlanetKey = (k: unknown): k is PlanetKey => typeof k === 'string' && (PLANET_ORDER as string[]).includes(k)

/** Which planet a room is on. */
export function planetOf(where: Where): PlanetKey {
  for (const p of PLANET_ORDER) if (PLANETS[p].rooms.includes(where)) return p
  return 'home'
}

/** The first room of a planet: where the rocket lands. Null while its rooms are not drawn yet. */
export const landingRoom = (planet: PlanetKey): Where | null => PLANETS[planet].rooms[0] ?? null

/** The planets of this tier: the catalogue this child can see at all. */
export const shownPlanets = (home: Home): PlanetKey[] => PLANET_ORDER.filter(p => PLANETS[p].tiers.includes(home.tier))

/** How many lessons this child has passed, as the server last counted. */
export const lessonsPassedOf = (home: Home): number => Math.max(0, Math.floor(home.lessonsPassed ?? 0))

/** One key, turned or not: free, that many lessons passed, that mission landed, or the planet grown that far. */
export function keyTurned(home: Home, o: PlanetOpens): boolean {
  if (o.kind === 'free') return true
  if (o.kind === 'lesson') return lessonsPassedOf(home) >= o.count
  if (o.kind === 'stage') return home.growthStage >= o.stage
  return home.missions.some(m => m.key === o.key && (m.status === 'approved' || m.status === 'done'))
}

/** A planet is open when it is in the child's tier, its rooms are drawn, and any one of its keys has turned. */
export function planetOpen(home: Home, planet: PlanetKey): boolean {
  const p = PLANETS[planet]
  return p.tiers.includes(home.tier) && p.rooms.length > 0 && p.opens.some(o => keyTurned(home, o))
}

export const openPlanets = (home: Home): PlanetKey[] => PLANET_ORDER.filter(p => planetOpen(home, p))

/** The small honest sign on a pale planet: the kind of key that opens it, a lesson first, or later while its rooms are not drawn. */
export function planetSign(planet: PlanetKey): PlanetSign {
  const p = PLANETS[planet]
  if (p.rooms.length === 0) return 'later'
  const kinds = p.opens.map(o => o.kind)
  return kinds.includes('lesson') ? 'lesson' : kinds.includes('mission') ? 'mission' : 'stage'
}

/** How many more lessons open this planet by its lesson key, or null when it has none or is open. */
export function lessonsToOpen(home: Home, planet: PlanetKey): number | null {
  if (planetOpen(home, planet)) return null
  const o = PLANETS[planet].opens.find(x => x.kind === 'lesson')
  return o && o.kind === 'lesson' ? Math.max(1, o.count - lessonsPassedOf(home)) : null
}

/** The mission that opens a pale planet, when one does. */
export function missionKeyFor(planet: PlanetKey): string | null {
  const o = PLANETS[planet].opens.find(x => x.kind === 'mission')
  return o && o.kind === 'mission' ? o.key : null
}

/** The planets that opened and have not been landed on yet: new on the map. */
export function newPlanets(home: Home): PlanetKey[] {
  const visited = home.world?.visited ?? []
  return openPlanets(home).filter(p => p !== 'home' && !visited.includes(p))
}

/** The nearest planet a lesson can still open, and how many lessons away it is; null when none is waiting. */
export function lessonsToNextPlanet(home: Home): { planet: PlanetKey; lessons: number } | null {
  let best: { planet: PlanetKey; lessons: number } | null = null
  for (const p of shownPlanets(home)) {
    if (PLANETS[p].rooms.length === 0) continue
    const left = lessonsToOpen(home, p)
    if (left !== null && (!best || left < best.lessons)) best = { planet: p, lessons: left }
  }
  return best
}

/** Where a planet floats in the sky: where the child left it, or the catalogue's place. */
export function planetPlace(home: Home, planet: PlanetKey): { x: number; y: number } {
  const p = home.world?.places?.[planet]
  return p && Number.isFinite(p.x) && Number.isFinite(p.y) ? clampPlace(p) : PLANETS[planet].at
}
