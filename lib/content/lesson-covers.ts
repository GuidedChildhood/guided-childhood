// Happy News style cover icons for the lesson library tiles: one warm hand
// drawn picture book badge per lesson (20 July 2026 batch), because the book
// emoji repeated forty times reads as a wall, and a single object that tells
// the lesson's story reads instantly at tile size. Served from the cloudfront
// CDN allowed in next.config. Restyle later = one Higgsfield batch + swap
// these URLs, never a code change.

const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'

export const LESSON_COVERS: Record<string, string> = {
  // The four Justin approved from the style test (20 July 2026 morning).
  stop_and_tell:        BASE + 'hf_20260720_103442_dff20e6b-c68b-4858-a839-e535b9a263eb.png',
  what_is_ai:           BASE + 'hf_20260720_103445_6d63f84b-613a-4d9d-ab5f-ee6a87232b1c.png',
  keep_your_secrets:    BASE + 'hf_20260720_103447_ad839685-d45d-4820-9df6-c8c8e32593b2.png',
  screen_goes_to_sleep: BASE + 'hf_20260720_103450_d705bfea-ac97-4a49-a35d-1b2119c79192.png',
}

// Exact lesson title to cover key. Titles are seeded verbatim in the
// migrations, so an exact match on the normalised title is all we need,
// no regex patterns.
const TITLE_TO_COVER: Record<string, keyof typeof LESSON_COVERS> = {
  'the stop and tell rule': 'stop_and_tell',
  'what is ai?': 'what_is_ai',
  'keep your secrets': 'keep_your_secrets',
  'when the screen goes to sleep': 'screen_goes_to_sleep',
}

export function lessonCoverForTitle(title: string): string | null {
  const key = TITLE_TO_COVER[title.trim().toLowerCase()]
  return key ? LESSON_COVERS[key] : null
}
