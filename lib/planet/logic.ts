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

/** The child's home planet: the Friends on it and how far it has grown. */
export type Home = {
  version: 1
  tier: Tier
  friends: Friend[]
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

/** The one door every locked state has. At most one at a time. */
export type HomeAsk = {
  id: string
  kind: 'wake'
  status: 'pending' | 'approved' | 'declined'
  createdAt: string
  answeredAt: string | null
  /** Minutes the Friends had left to rest when the child asked. */
  minutesLeft: number
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
    friends: ACTIVE_BY_TIER[tier].map(newFriend),
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
  return { ...home, growthStage: stage, growthProgress: progress, grewWhileAway: home.grewWhileAway + points }
}

export function startCooldown(friend: Friend, reason: CooldownReason, minutes: number, nowIso: string): Friend {
  return { ...friend, cooldown: { reason, startedAt: nowIso, endsAt: addMinutes(nowIso, minutes), lengthMinutes: minutes } }
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
export function applyEvent(home: Home, ev: HomeEvent, nowIso: string): Home {
  const cfg = TIERS[home.tier]
  const forFriend = (key: FriendKey, f: (fr: Friend) => Friend): Home =>
    ({ ...home, friends: home.friends.map(fr => (fr.key === key ? f(fr) : fr)) })

  switch (ev.kind) {
    case 'tick': {
      // Only real play drains: the seconds since the last tick, capped, and
      // only Friends that are awake. A resting Friend is not playing.
      const seconds = Math.max(0, Math.min(TICK_CAP_SECONDS, secondsBetween(home.energyTickedAt, nowIso)))
      const friends = home.friends.map(f => {
        if (f.cooldown) return f
        const energy = Math.max(0, f.energy - (seconds / 60) * drainPerMinute(cfg, f.cloud))
        return { ...f, energy: Math.round(energy * 100) / 100 }
      })
      return { ...home, friends, energyTickedAt: nowIso }
    }
    case 'nap_start':
      return forFriend(ev.friend, f => (f.cooldown ? f : startCooldown(f, 'nap', cfg.napMinutes, nowIso)))
    case 'sunlight_start':
      return forFriend(ev.friend, f => (f.cooldown ? f : startCooldown(f, 'sunlight', cfg.sunlightMinutes, nowIso)))
    case 'ambient_start':
      // Only a fully drained Friend rests by itself. Anything else is a drag
      // the child chose, which is one of the two events above.
      return forFriend(ev.friend, f => (f.cooldown || f.energy > 0 ? f : startCooldown(f, 'ambient', cfg.ambientMinutes, nowIso)))
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
