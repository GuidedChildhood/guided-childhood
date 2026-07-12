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

// The illustrated tiles (12 July 2026 batch): hand drawn picture book art on
// the CDN, replacing the photo real renders that blurred at icon size.
const ART_BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'

const MOMENT_ART: Record<string, string> = {
  morning:   ART_BASE + 'hf_20260712_195522_9efc8c47-00fc-48b1-980e-80b14282cd99.png',
  teeth:     ART_BASE + 'hf_20260712_195230_c72a633f-c475-44ec-9807-72b73a55067f.png',
  dressed:   ART_BASE + 'hf_20260712_195524_e038b112-fd6b-4452-857a-82e5aaf84c35.png',
  bag:       ART_BASE + 'hf_20260712_195533_c352c366-cbe4-4e9d-9d94-fcb3b0abfd03.png',
  lunch:     ART_BASE + 'hf_20260712_195544_426e0356-48e9-430a-a82a-5e9dd1ca7c3a.png',
  dropoff:   ART_BASE + 'hf_20260712_195545_609c2120-1c3b-4b9e-beda-f02afde26d06.png',
  pickup:    ART_BASE + 'hf_20260712_195556_5a33cb6d-6398-4867-8218-237e280d6cbd.png',
  snacks:    ART_BASE + 'hf_20260712_195557_2e95adbc-761a-41f4-8693-7fc2e52f939e.png',
  dinner:    ART_BASE + 'hf_20260712_195606_8e50d8a3-fad4-4379-afd7-b24df34d6513.png',
  tv_eve:    ART_BASE + 'hf_20260712_195608_c76bf013-2af1-465e-b738-b671beb07995.png',
  homework:  ART_BASE + 'hf_20260712_195617_8549b253-7fd5-42cf-a5b2-5b10e77f51f6.png',
  clothes:   ART_BASE + 'hf_20260712_195532_9c239412-7636-447c-bfdd-1e46c2b0f711.png',
  fighting:  ART_BASE + 'hf_20260712_195619_6c3c845c-755f-4608-8575-528cc01bc831.png',
  bedtime:   ART_BASE + 'hf_20260712_195628_1bbd76a4-02cd-4793-bbdd-c7ee4c609ac4.png',
  sleep:     ART_BASE + 'hf_20260712_195630_048877a9-a9ed-4168-b3aa-750694b07b44.png',
}

export function momentImageSrc(slug: string): string | null {
  return MOMENT_ART[slug] ?? null
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
