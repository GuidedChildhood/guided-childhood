// The engine's look. Every colour here comes from shared/tokens.css and
// shared/brand.ts, with one deliberate addition: the warm ivory canvas.
//
// Justin's brief of 16 November 2026 chose the look for evidence posts:
// warm ivory, deep navy type, restrained yellow. The token cream (#F9F8F6)
// reads cool on a phone, so the canvas is warmed here and nowhere else.
// Navy ink, gold and gold dark are the live tokens, unchanged.

export const FORMAT = {
  width: 1080,
  height: 1350,
  fps: 30,
  durationInFrames: 420, // 14 seconds
} as const

export const C = {
  ivory: '#F6F1E7', // warm ivory canvas (the token cream, warmed)
  ivoryDeep: '#EFE7D8', // the soft light falling off at the edges
  ink: '#1A1A2E', // --ink, the deep navy
  inkSoft: '#52526A', // --ink-soft
  gold: '#EDC35F', // --butter, the brand gold. Fills only, never text on ivory
  goldDark: '#C99A28', // --terracotta-dark. Rules and fills only: 2.3 to 1 on ivory, too faint for words
  goldInk: '#7A5A0E', // the DiGi ink from shared/schools-curriculum.ts. Gold coloured words, 5.7 to 1 on ivory
  card: '#FFFDF8',
  hairline: 'rgba(26, 26, 46, 0.14)',
} as const

export const FONT = {
  display: '"GC Nunito", system-ui, sans-serif',
  mono: '"GC Plex Mono", ui-monospace, monospace',
} as const

// Smallest size any word may be set at. A 1080 wide card shows at roughly
// 390 points wide on a phone, so 28px lands near 10 points: the floor for a
// line a parent can read without zooming.
export const MIN_TEXT_PX = 28

export const SAFE = { x: 88, top: 96, bottom: 92 } as const

// The logo as data, copied from shared/brand.ts so the engine has no import
// reaching outside its own folder.
export const LOGO_BARS = [5, 9, 14, 8]
