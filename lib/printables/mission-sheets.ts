import type { CodeMode, Tier } from '@/lib/planet/logic'
import { MISSIONS, missionByKey, type Mission } from '@/lib/planet/missions'
import type { MissionSheetSpec } from '@/components/printables/drawn/MissionSheet'

// Every Planet Friends mission is also a printable (slice 2b): a registry
// entry with the key planet-<mission>, drawn by MissionSheet. This file is
// the one place a printable key meets a mission key, and the one place the
// sheet's words are built from the catalogue, so the parent's print page,
// the child's copy and the printables grid all draw the same sheet.

export const PLANET_PREFIX = 'planet-'

export const planetPrintableKey = (missionKey: string) => PLANET_PREFIX + missionKey.replace(/_/g, '-')

export function missionForPrintable(printableKey: string): Mission | undefined {
  if (!printableKey.startsWith(PLANET_PREFIX)) return undefined
  return missionByKey(printableKey.slice(PLANET_PREFIX.length).replace(/-/g, '_'))
}

/** The printables stages (1 Foundation to 5 Independent) a mission's tiers reach. */
export function stagesForTiers(tiers: Tier[]): number[] {
  const by: Record<Tier, number[]> = { 1: [1], 2: [1, 2], 3: [2, 3, 4, 5] }
  const out = new Set<number>()
  for (const t of tiers) for (const s of by[t]) out.add(s)
  return [...out].sort((a, b) => a - b)
}

const BLURB: Record<string, string> = {
  plant_seed: 'A pot, some soil, one seed and a little water. The planet grows a garden dome the moment it is done; the seed takes its own sweet time.',
  leaf_walk: 'Ten minutes outside for three different leaves. A leaf flag goes up on the planet for it.',
  stretch: 'Five real minutes of reaching for the sky. The ring on the planet fills as they go.',
  water_plant: 'A drink for a real plant, not a flood. A crater on the planet fills with water.',
  read_book: 'Ten minutes with a paper book, no notifications inside it. A story lamp lights on the planet.',
  spider_legs: 'Find a spider, count its legs, tap the number. A pale moon rises when it is right.',
  screens_off_dinner: 'Every screen on the charger, grown ups too, and one good thing each. A picnic blanket lands under the stars.',
  do_lesson: 'Pass a lesson you sent them on their own link. A bright new star appears in their sky.',
  moonflower_card: 'Print the card, hide it, and let them hunt. The code on it is made for your child only. A moonflower opens on the planet, and glows at night.',
}

export const blurbFor = (missionKey: string) => BLURB[missionKey] ?? 'A real world mission for the planet.'

/** The catalogue in printable order, for the registry. */
export const MISSIONS_FOR_PRINT = MISSIONS

/**
 * The sheet for a printable key, from the catalogue alone. The parent's
 * print page adds the scripts row's line and the child's card; every other
 * caller (the grid tile, the child's copy) gets the sheet without them.
 */
export function missionSheetFor(printableKey: string, extra: { prompt?: string | null; card?: { code: string[]; mode: CodeMode } | null } = {}): MissionSheetSpec | undefined {
  const m = missionForPrintable(printableKey)
  if (!m) return undefined
  return {
    key: m.key, title: m.title, emoji: m.emoji, steps: m.steps, stepArt: m.stepArt, rewardLabel: m.rewardLabel,
    prompt: extra.prompt || m.grownupLine, scriptOrder: m.scriptOrder, perChild: !!m.perChild, card: extra.card ?? null,
  }
}
