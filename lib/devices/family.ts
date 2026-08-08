// The devices a family actually owns.
//
// Everything about screens in this app used to be measured against our
// catalogue rather than their house. The passport said "devices set up 21%"
// because it counted nineteen setup guides, four of which are social apps and
// most of which the family will never own. And a timer could be started on
// "tablet" but never on the tablet, so a house with two of them had no way to
// say which one the twenty minutes were for.
//
// This is the list that fixes both: the real things in this home, named by the
// parent. Asked once at setup, added to whenever something new arrives.

import type { DeviceKind } from '@/lib/quests/device-time'

export type FamilyDevice = {
  id: string
  label: string
  kind: DeviceKind
  /** device_guides.device_key for the settings walkthrough that covers it. */
  guideKey: string | null
  shared: boolean
  retiredAt: string | null
}

/** A row as it comes back from Supabase. */
export type FamilyDeviceRow = {
  id: string
  label: string
  kind: string
  guide_key: string | null
  shared: boolean
  retired_at: string | null
}

export function toFamilyDevice(row: FamilyDeviceRow): FamilyDevice {
  return {
    id: row.id,
    label: row.label,
    kind: (row.kind as DeviceKind) ?? 'tablet',
    guideKey: row.guide_key ?? null,
    shared: row.shared ?? false,
    retiredAt: row.retired_at ?? null,
  }
}

// The tap to add list. Every one of these is a thing a UK family plausibly has
// in the house, named the way they would say it out loud rather than the way a
// catalogue would list it, and each carries the setup guide that covers it so
// adding a device puts the right walkthrough in front of them straight away.
//
// Deliberately short. A parent choosing from fourteen familiar names in ten
// seconds gives us a truthful list; a parent scrolling nineteen guides
// deciding which are devices gives us an abandoned screen.

export type DeviceSuggestion = {
  label: string
  kind: DeviceKind
  guideKey: string | null
  emoji: string
  /** Most homes have exactly one, so a second tap is almost always a mistake. */
  single?: boolean
}

export const DEVICE_SUGGESTIONS: DeviceSuggestion[] = [
  { label: 'iPhone',          kind: 'phone',    guideKey: 'iphone',      emoji: '📱' },
  { label: 'Android phone',   kind: 'phone',    guideKey: 'android',     emoji: '🤖' },
  { label: 'iPad',            kind: 'tablet',   guideKey: 'iphone',      emoji: '📲' },
  { label: 'Android tablet',  kind: 'tablet',   guideKey: 'android',     emoji: '📲' },
  { label: 'Fire tablet',     kind: 'tablet',   guideKey: 'firetablet',  emoji: '🔥' },
  { label: 'Smart TV',        kind: 'tv',       guideKey: 'smarttv',     emoji: '📺' },
  { label: 'Fire TV Stick',   kind: 'tv',       guideKey: 'firestick',   emoji: '📺' },
  { label: 'Apple TV',        kind: 'tv',       guideKey: 'appletv',     emoji: '🖥️' },
  { label: 'Roku',            kind: 'tv',       guideKey: 'roku',        emoji: '📡' },
  { label: 'Nintendo Switch', kind: 'console',  guideKey: 'switch',      emoji: '🎮' },
  { label: 'Xbox',            kind: 'console',  guideKey: 'xbox',        emoji: '🕹️' },
  { label: 'PlayStation',     kind: 'console',  guideKey: 'playstation', emoji: '🎯' },
  { label: 'Chromebook',      kind: 'computer', guideKey: 'chromebook',  emoji: '💻' },
  { label: 'Windows laptop',  kind: 'computer', guideKey: 'windows',     emoji: '🪟' },
]

export function suggestionFor(label: string): DeviceSuggestion | null {
  const want = label.trim().toLowerCase()
  return DEVICE_SUGGESTIONS.find(s => s.label.toLowerCase() === want) ?? null
}

/** The emoji for a device, from its suggestion when it came from the list,
 *  from its kind when the parent typed their own name for it. */
export function deviceIcon(device: Pick<FamilyDevice, 'label' | 'kind'>): string {
  return suggestionFor(device.label)?.emoji ?? KIND_EMOJI[device.kind]
}

export const KIND_EMOJI: Record<DeviceKind, string> = {
  phone: '📱', tablet: '📲', tv: '📺', console: '🎮', computer: '💻',
}

export const KIND_LABEL: Record<DeviceKind, string> = {
  phone: 'Phone', tablet: 'Tablet', tv: 'TV', console: 'Console', computer: 'Computer',
}

export function isDeviceKind(v: unknown): v is DeviceKind {
  return typeof v === 'string' && v in KIND_LABEL
}

// The passport's devices percentage for one stage, measured against the
// family's own list rather than our catalogue.
//
// Only devices with a setup guide behind them count. A parent's own "Old
// laptop" with no guide is not a job we have given them, so it neither counts
// as outstanding nor pads the denominator to make the number look better.
//
// A stage the family owns nothing for reads as 100, exactly as the catalogue
// version did: nothing asked, nothing outstanding.
export function stageDevicePct(args: {
  homeDevices: { guideKey: string | null }[]
  stageOfGuide: (guideKey: string) => string | null
  stageId: string
  doneGuideKeys: Set<string>
}): { pct: number; done: number; total: number } {
  const inStage = args.homeDevices.filter(
    d => d.guideKey && args.stageOfGuide(d.guideKey) === args.stageId
  )
  const done = inStage.filter(d => args.doneGuideKeys.has(d.guideKey as string)).length
  return {
    pct: inStage.length > 0 ? Math.round((done / inStage.length) * 100) : 100,
    done,
    total: inStage.length,
  }
}

/**
 * Is this particular screen set up?
 *
 * One rule, in one place, because the devices page and the passport were each
 * answering it separately and both got it wrong in the same way. A guide key
 * covers a guide, not a screen: "iPhone and iPad" is one guide over two
 * devices, so reading the guide told a family with both that the second one was
 * already done. Migration 169 gives each screen its own row and this reads it.
 *
 * doneDeviceIds is null when that migration has not been applied yet, and only
 * then does it fall back to the guide. The fallback is the old bug, kept
 * deliberately for the window between deploy and migration, because the
 * alternative is every family's ticks vanishing for a day.
 *
 * A screen with no guide behind it, a parent's own "Old laptop", is always
 * done: there is nothing we have asked them to do with it.
 */
export function deviceIsDone(
  d: FamilyDevice,
  doneGuideKeys: Set<string>,
  doneDeviceIds: Set<string> | null,
): boolean {
  if (!d.guideKey) return true
  if (doneDeviceIds) return doneDeviceIds.has(d.id)
  return doneGuideKeys.has(d.guideKey)
}

// How set up is this home? The number that replaces the catalogue percentage
// on the passport.
export function homeSetupCount(
  devices: FamilyDevice[],
  doneGuideKeys: Set<string>,
  doneDeviceIds: Set<string> | null = null,
): {
  done: number
  total: number
  pct: number
  next: FamilyDevice | null
} {
  const live = devices.filter(d => !d.retiredAt)
  const isDone = (d: FamilyDevice) => deviceIsDone(d, doneGuideKeys, doneDeviceIds)
  const done = live.filter(isDone).length
  return {
    done,
    total: live.length,
    // No devices listed is not nought percent, it is nothing asked of them yet.
    pct: live.length > 0 ? Math.round((done / live.length) * 100) : 100,
    next: live.find(d => !isDone(d)) ?? null,
  }
}
