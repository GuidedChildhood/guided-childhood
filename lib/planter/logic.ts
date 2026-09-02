// Planter Friends: the rules, pure.
//
// Design: plans/planter-friends-architecture.md. This file is the toy's
// Fable 5.1 state machines compiled down to plain functions: energy drain,
// the three rests (nap, sunlight, ambient), growth, the night, the tier
// table. It imports nothing on purpose. The server runs it against its own
// clock (the client reports, the server decides), the dev fixture runs it
// against a pretend clock, and scripts/check-planter-logic.mjs runs it under
// node with type stripping, so the same function answers every time and the
// toy cannot disagree with itself.
//
// Time arrives as ISO strings and London minutes, never as Date objects, so
// nothing here can accidentally read the machine clock.

export type Tier = 1 | 2 | 3
export type SpeciesKey = 'sunny' | 'daisy' | 'bell'
export type CooldownReason = 'nap' | 'sunlight' | 'ambient'

export type Cooldown = {
  reason: CooldownReason
  startedAt: string
  endsAt: string
  lengthMinutes: number
}

export type Plant = {
  id: string
  species: SpeciesKey
  name: string
  /** 0 to 100. Falls while the child plays, restored only by a rest. */
  energy: number
  /** 0 seed, 1 sprout, 2 leaf, 3 bud, 4 bloom, 5 seedhead. */
  growthStage: number
  /** 0 to 100 toward the next stage. Moves only when a rest closes. */
  growthProgress: number
  cooldown: Cooldown | null
  /** Growth points gained since the child last looked. Shown once, then cleared. */
  grewWhileAway: number
  /** The sun shade over this patch (Tier 2 slows the drain a little). */
  shade: boolean
}

export type Garden = {
  version: 1
  tier: Tier
  plants: Plant[]
  /** Server time of the last drain, so a tick drains only real play. */
  energyTickedAt: string
  /** The London date whose night has already been applied. */
  lastNightAppliedOn: string | null
  createdAt: string
  lastSeenAt: string
}

/** The one door every locked state has. At most one at a time. */
export type GardenAsk = {
  id: string
  kind: 'wake'
  status: 'pending' | 'approved' | 'declined'
  createdAt: string
  answeredAt: string | null
  /** Minutes the plants had left to rest when the child asked. */
  minutesLeft: number
}

export type Mood = 'happy' | 'sleepy' | 'tired' | 'asleep' | 'sunbathing' | 'resting'

export type TierConfig = {
  /** Plants in the garden at the start. */
  plants: number
  /** Play before a plant is fully drained. */
  playMinutes: number
  napMinutes: number
  sunlightMinutes: number
  ambientMinutes: number
  /** A shaded plant drains 20 percent slower, the first hint that light and energy are linked. */
  shadeSlows: boolean
  /** Whether the child reads words on screen. Tier 1 is pictures and sound. */
  words: boolean
}

// The whole tuning, in one place (design section 5). Tier 3 is here so the
// tier is always resolvable; its own settings arrive with slice 4.
export const TIERS: Record<Tier, TierConfig> = {
  1: { plants: 1, playMinutes: 15, napMinutes: 15, sunlightMinutes: 3, ambientMinutes: 15, shadeSlows: false, words: false },
  2: { plants: 2, playMinutes: 20, napMinutes: 15, sunlightMinutes: 3, ambientMinutes: 15, shadeSlows: true, words: true },
  3: { plants: 3, playMinutes: 25, napMinutes: 15, sunlightMinutes: 3, ambientMinutes: 15, shadeSlows: true, words: true },
}

/** Growth points a rest is worth. A full stage is 100. Night is the big one. */
export const GROWTH: Record<CooldownReason | 'night', number> = { nap: 25, sunlight: 10, ambient: 15, night: 40 }
export const SLEEPY_AT = 20
export const MAX_STAGE = 5
/** A tick drains at most this much real time, so a child who was away is not drained for the absence. */
export const TICK_CAP_SECONDS = 90
export const WIND_DOWN_MINUTES = 30
/** After this long depleted with no drag, the plant rests by itself. */
export const AMBIENT_AFTER_SECONDS = 20

/**
 * Which tier a child is on. Date of birth when it is known (asked once at
 * signup), the age band otherwise. Ages 3 to 5 are Tier 1, 6 to 9 Tier 2,
 * 10 and up Tier 3.
 */
export function tierFor(dateOfBirth: string | null | undefined, ageBand: string | null | undefined, now: Date = new Date()): Tier {
  if (dateOfBirth) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateOfBirth)
    if (m) {
      const y = Number(m[1]), mo = Number(m[2]), d = Number(m[3])
      let age = now.getUTCFullYear() - y
      const notYet = now.getUTCMonth() + 1 < mo || (now.getUTCMonth() + 1 === mo && now.getUTCDate() < d)
      if (notYet) age -= 1
      if (age < 6) return 1
      if (age < 10) return 2
      return 3
    }
  }
  if (ageBand === '4-7') return 1
  if (ageBand === '8-10') return 2
  return 3
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

export function newGarden(
  tier: Tier,
  nowIso: string,
  plants: { id: string; species: SpeciesKey; name: string }[],
  nightKey: string | null,
): Garden {
  return {
    version: 1,
    tier,
    plants: plants.map(p => ({ ...p, energy: 100, growthStage: 1, growthProgress: 0, cooldown: null, grewWhileAway: 0, shade: false })),
    energyTickedAt: nowIso,
    // The night that has already passed is not owed to a garden that did not
    // exist yet, so a garden planted at ten in the morning does not wake up
    // grown at ten past.
    lastNightAppliedOn: nightKey,
    createdAt: nowIso,
    lastSeenAt: nowIso,
  }
}

/** Growth points onto a plant, carrying over stages, stopping at the seedhead. */
export function grow(plant: Plant, points: number): Plant {
  if (points <= 0 || plant.growthStage >= MAX_STAGE) return plant
  let stage = plant.growthStage
  let progress = plant.growthProgress + points
  while (progress >= 100 && stage < MAX_STAGE) { progress -= 100; stage += 1 }
  if (stage >= MAX_STAGE) progress = 0
  return { ...plant, growthStage: stage, growthProgress: progress, grewWhileAway: plant.grewWhileAway + points }
}

export function startCooldown(plant: Plant, reason: CooldownReason, minutes: number, nowIso: string): Plant {
  return { ...plant, cooldown: { reason, startedAt: nowIso, endsAt: addMinutes(nowIso, minutes), lengthMinutes: minutes } }
}

/**
 * Close a rest. The growth it was worth arrives in full when it ran to the
 * end, or by the fraction actually rested when a grown up's yes woke the
 * plant early. Energy comes back to full either way: a yes is a yes.
 */
export function closeCooldown(plant: Plant, fraction = 1): Plant {
  if (!plant.cooldown) return plant
  const points = Math.round(GROWTH[plant.cooldown.reason] * Math.max(0, Math.min(1, fraction)))
  return grow({ ...plant, cooldown: null, energy: 100 }, points)
}

function fractionRested(cooldown: Cooldown, nowIso: string): number {
  const total = cooldown.lengthMinutes * 60
  if (total <= 0) return 1
  return Math.max(0, Math.min(1, secondsBetween(cooldown.startedAt, nowIso) / total))
}

/**
 * Bring the garden up to now on the server's clock: rests that have ended
 * close and pay their growth, the night lands once per London date, and a
 * long absence resets the drain clock so the first tick back costs nothing.
 * Runs before every event and every read. Idempotent.
 */
export function reconcile(garden: Garden, nowIso: string, nightKey: string | null): Garden {
  let plants = garden.plants.map(p =>
    p.cooldown && new Date(p.cooldown.endsAt).getTime() <= new Date(nowIso).getTime() ? closeCooldown(p) : p,
  )
  let lastNightAppliedOn = garden.lastNightAppliedOn
  if (nightKey && lastNightAppliedOn !== nightKey) {
    plants = plants.map(p => grow(p.cooldown ? closeCooldown(p, fractionRested(p.cooldown, nowIso)) : { ...p, energy: 100 }, GROWTH.night))
    lastNightAppliedOn = nightKey
  }
  const away = secondsBetween(garden.energyTickedAt, nowIso)
  const energyTickedAt = away > TICK_CAP_SECONDS || away < 0 ? nowIso : garden.energyTickedAt
  return { ...garden, plants, lastNightAppliedOn, energyTickedAt }
}

export type GardenEvent =
  | { kind: 'tick' }
  | { kind: 'nap_start'; plantId: string }
  | { kind: 'sunlight_start'; plantId: string }
  | { kind: 'ambient_start'; plantId: string }
  | { kind: 'shade'; plantId: string; on: boolean }
  | { kind: 'seen' }
  | { kind: 'wake_all' }

/** Energy lost per minute of play for this tier and shade. */
export function drainPerMinute(cfg: TierConfig, shade: boolean): number {
  return (100 / cfg.playMinutes) * (shade && cfg.shadeSlows ? 0.8 : 1)
}

/**
 * One event against the garden. Every rule of the photosynthesis loop is a
 * branch here (design section 3.1). Unknown plant ids and impossible
 * transitions return the garden unchanged rather than throwing, because a
 * stale client is a fact of life on a child's phone and must never break it.
 */
export function applyEvent(garden: Garden, ev: GardenEvent, nowIso: string): Garden {
  const cfg = TIERS[garden.tier]
  const forPlant = (id: string, f: (p: Plant) => Plant): Garden =>
    ({ ...garden, plants: garden.plants.map(p => (p.id === id ? f(p) : p)) })

  switch (ev.kind) {
    case 'tick': {
      // Only real play drains: the seconds since the last tick, capped, and
      // only plants that are awake. A resting plant is not playing.
      const seconds = Math.max(0, Math.min(TICK_CAP_SECONDS, secondsBetween(garden.energyTickedAt, nowIso)))
      const plants = garden.plants.map(p => {
        if (p.cooldown) return p
        const energy = Math.max(0, p.energy - (seconds / 60) * drainPerMinute(cfg, p.shade))
        return { ...p, energy: Math.round(energy * 100) / 100 }
      })
      return { ...garden, plants, energyTickedAt: nowIso }
    }
    case 'nap_start':
      return forPlant(ev.plantId, p => (p.cooldown ? p : startCooldown(p, 'nap', cfg.napMinutes, nowIso)))
    case 'sunlight_start':
      return forPlant(ev.plantId, p => (p.cooldown ? p : startCooldown(p, 'sunlight', cfg.sunlightMinutes, nowIso)))
    case 'ambient_start':
      // Only a fully drained plant rests by itself. Anything else is a drag
      // the child chose, which is one of the two events above.
      return forPlant(ev.plantId, p => (p.cooldown || p.energy > 0 ? p : startCooldown(p, 'ambient', cfg.ambientMinutes, nowIso)))
    case 'shade':
      return forPlant(ev.plantId, p => ({ ...p, shade: ev.on }))
    case 'seen':
      return { ...garden, plants: garden.plants.map(p => ({ ...p, grewWhileAway: 0 })), lastSeenAt: nowIso }
    case 'wake_all':
      // The grown up said yes: every rest ends now and pays by the minutes
      // actually slept.
      return { ...garden, plants: garden.plants.map(p => (p.cooldown ? closeCooldown(p, fractionRested(p.cooldown, nowIso)) : p)) }
    default:
      return garden
  }
}

export function moodOf(plant: Plant): Mood {
  if (plant.cooldown?.reason === 'nap') return 'asleep'
  if (plant.cooldown?.reason === 'sunlight') return 'sunbathing'
  if (plant.cooldown?.reason === 'ambient') return 'resting'
  if (plant.energy <= 0) return 'tired'
  if (plant.energy <= SLEEPY_AT) return 'sleepy'
  return 'happy'
}

/** Every plant is resting, so the greenhouse itself rests. */
export function allResting(garden: Garden): boolean {
  return garden.plants.length > 0 && garden.plants.every(p => p.cooldown !== null)
}

/** Which overlay the whole greenhouse wears when every plant is resting. */
export function restOverlay(garden: Garden): 'nursery' | 'ambient' | null {
  if (!allResting(garden)) return null
  return garden.plants.every(p => p.cooldown?.reason === 'nap') ? 'nursery' : 'ambient'
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
