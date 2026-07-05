// Tile artwork for the daily moments timeline and the Device Safety Hub.
// A slug or key listed here promises that the matching file exists in
// /public/moments/<slug>.png or /public/devices/<key>.png. The Higgsfield
// asset batch landed on 4 July 2026, one square 512px tile per entry.

export const MOMENT_IMAGE_SLUGS: string[] = [
  'morning',
  'teeth',
  'dressed',
  'bag',
  'lunch',
  'dropoff',
  'pickup',
  'snacks',
  'dinner',
  'tv_eve',
  'homework',
  'clothes',
  'fighting',
  'bedtime',
  'sleep',
]

export function momentImageSrc(slug: string): string | null {
  return MOMENT_IMAGE_SLUGS.includes(slug) ? `/moments/${slug}.png` : null
}

// Database moments carry a title, not a slug. Match the title to a tile by
// keyword; null (emoji fallback) when no confident match exists.
const TITLE_TO_SLUG: [RegExp, string][] = [
  [/teeth/i, 'teeth'],
  [/dress|clothes|uniform/i, 'clothes'],
  [/homework/i, 'homework'],
  [/dinner|meal|table/i, 'dinner'],
  [/snack/i, 'snacks'],
  [/lunch/i, 'lunch'],
  [/fight|sibling|argu/i, 'fighting'],
  [/pick\s?up/i, 'pickup'],
  [/drop\s?off/i, 'dropoff'],
  [/bag|pack/i, 'bag'],
  [/bed|sleep|night/i, 'bedtime'],
  [/tv|screen|film|watch/i, 'tv_eve'],
  [/morning|before school|school run|phone/i, 'morning'],
]

export function momentImageForTitle(title: string): string | null {
  const hit = TITLE_TO_SLUG.find(([re]) => re.test(title))
  return hit ? momentImageSrc(hit[1]) : null
}

// Device keys mirror device_guides.device_key from migration 014.
export const DEVICE_IMAGE_KEYS: string[] = [
  'iphone',
  'android',
  'firetablet',
  'switch',
  'xbox',
  'playstation',
  'roblox',
  'youtube',
  'alexa',
  'firestick',
  'appletv',
  'roku',
  'smarttv',
  'chromebook',
  'windows',
  'tiktok',
  'snapchat',
  'instagram',
  'whatsapp',
]

export function deviceImageSrc(key: string): string | null {
  return DEVICE_IMAGE_KEYS.includes(key) ? `/devices/${key}.png` : null
}
