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
  rocket_launch: 'A rocket from a box or a bottle, a countdown out loud, and a blast off with arms up. A rocket for the planet.',
  moon_jumps: 'Twenty moon jumps outside, as high as they go, a grown up counting. A trampoline for the planet.',
  explorer_walk: 'A walk somewhere they have never been, and one thing worth remembering. A moon rover for the planet.',
  stretch: 'Five real minutes of reaching for the sky while the ring fills. A swing for the planet.',
  helping_hands: 'One job at home nobody asked for, done properly. A robot helper for the planet.',
  star_hunt: 'After dark, at a window or outside, count the real stars. A telescope for the planet.',
  read_book: 'Ten minutes with a paper book, no notifications inside it. A story tent for the planet.',
  spider_legs: 'Find a spider, count its legs, tap the number. A pale moon for the sky.',
  screens_off_dinner: 'Every screen on the charger, grown ups too, and one good thing each. A campfire for the planet.',
  do_lesson: 'Pass a lesson you sent them on their own link. A satellite dish for the planet.',
  phone_to_bed: 'The device on the charger at bedtime, before anyone asks. A night light for the planet.',
  comet_card: 'Print the card, hide it, and let them hunt. The code on it is made for your child only. A comet for their sky.',
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
