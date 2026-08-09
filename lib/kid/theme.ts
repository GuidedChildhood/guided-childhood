// The colour the child chose, everywhere they go.
//
// Justin, 9 August 2026, looking at Telling a grown up on the child app:
// "this page needs to be app chosen colours."
//
// He was looking at the one screen, but the fault was the shape of the code.
// Make it mine recolours the whole background, and it worked: the home screen
// went the colour they picked. It went nowhere else. The theme lived privately
// inside KidQuestScreen, so every other screen a child can reach (Telling a
// grown up, Ask for a job, the balance, a lesson, an adventure, the quiz) fell
// back to the anthracite default in tokens.css. A child on Coral got a peach
// home and a slate grey everything, which reads as a different app rather than
// a choice they made.
//
// Same reasoning as lib/kid/buddy: two copies of what colour the child is means
// two answers, and the child sees both.
//
// ── ON BACKGROUND COLOURS ──
//
// Moving the map alone would not have been enough. The sub pages were written
// against a dark background and hardcode white text on it (#F7F7F5, then
// rgba(255,255,255,0.78) for the sentence under it). Handing those pages a
// pastel wash without touching the text would have printed white on cream, so
// the fix would have read as a worse bug than the one it fixed.
//
// So a theme carries its own foreground: the text that reads on it, the muted
// tone for the mono eyebrows, a translucent panel that sits ON the background
// rather than a white card, and the shadow colour underneath. Dark themes get
// white overlays, light themes get ink ones. A screen asks the theme rather
// than deciding for itself, and a new colour added below is legible on every
// screen the day it ships without anybody visiting them.
//
// The white cards themselves are untouched and stay white on every theme. That
// was already true on the home screen, it reads on both, and it is the surface
// the whole child app is built from.

export type KidTheme = {
  /** Display name, shown in the Make it mine picker. */
  name: string
  /** The accent: rings, card edges, the chunky button faces. */
  hex: string
  /** The full page background. */
  bg: string
  /** Strong text directly on the background. */
  ink: string
  /** Secondary text directly on the background. */
  inkSoft: string
  /** True for the anthracite and midnight washes, false for the pastels. */
  dark: boolean
  /** Mono eyebrows and small labels on the background. */
  inkMuted: string
  /** A translucent panel resting ON the background, not a white card. */
  panel: string
  panelBorder: string
  /** The chunky shadow under a card sitting on this background. */
  shadow: string
}

// Each theme is the full background the child lives in, plus the ink that reads
// on top of it and the accent used on their rings and cards. The default is a
// premium dark anthracite, and the colour bar lets them own it. Ids stay the
// same as before so a child who already picked one keeps it.
//
// Graphite is a lighter, premium anthracite that keeps white text. Every colour
// is a soft pastel wash with dark readable ink, all built the same gentle way so
// none looks heavier than the others. The accent stays a deeper tone so rings
// and card edges still read on white.
const BASE: Record<string, { name: string; hex: string; bg: string; dark: boolean }> = {
  graphite: { name: 'Graphite', hex: '#E7A33E', bg: 'linear-gradient(180deg, #4C5057 0%, #34373D 100%)', dark: true },
  ocean:    { name: 'Ocean',    hex: '#2E8B9E', bg: 'linear-gradient(180deg, #DCEEF6 0%, #C6E0EE 100%)', dark: false },
  grass:    { name: 'Grass',    hex: '#57A06A', bg: 'linear-gradient(180deg, #E1F1E6 0%, #CBE7D4 100%)', dark: false },
  sunshine: { name: 'Sunshine', hex: '#E19A2E', bg: 'linear-gradient(180deg, #FBEFCF 0%, #F6E3AE 100%)', dark: false },
  coral:    { name: 'Coral',    hex: '#E56B57', bg: 'linear-gradient(180deg, #FBE3DB 0%, #F6D0C4 100%)', dark: false },
  berry:    { name: 'Berry',    hex: '#C65B8E', bg: 'linear-gradient(180deg, #F8E2EC 0%, #F1CEDE 100%)', dark: false },
  sky:      { name: 'Sky',      hex: '#4C9FD6', bg: 'linear-gradient(180deg, #E4F1FB 0%, #CFE6F7 100%)', dark: false },
  mint:     { name: 'Mint',     hex: '#3FA98A', bg: 'linear-gradient(180deg, #E0F4EC 0%, #C9ECDD 100%)', dark: false },
  lavender: { name: 'Lavender', hex: '#8A72C9', bg: 'linear-gradient(180deg, #EEE9FA 0%, #E0D6F3 100%)', dark: false },
  peach:    { name: 'Peach',    hex: '#E58A4E', bg: 'linear-gradient(180deg, #FCECDC 0%, #F8DBC2 100%)', dark: false },
  bubblegum:{ name: 'Bubblegum',hex: '#DD6BA6', bg: 'linear-gradient(180deg, #FBE6F1 0%, #F6D2E5 100%)', dark: false },
  midnight: { name: 'Midnight', hex: '#6FA8DC', bg: 'linear-gradient(180deg, #2C3A57 0%, #202B40 100%)', dark: true },
}

export const DEFAULT_ACCENT = 'graphite'

// The eight the picker offers: one clean choice from each part of the
// spectrum plus a dark, so the row is a proper rainbow with no two the same
// family. The other named colours stay in the map above so a child who already
// picked one keeps it, they are just no longer offered as fresh duplicates.
export const PICKER_ACCENTS = ['coral', 'peach', 'sunshine', 'mint', 'sky', 'lavender', 'bubblegum', 'midnight']

// The foreground half, derived rather than typed out twelve times. The dark
// values are exactly what the sub pages already hardcoded, so a child on the
// default sees no change at all: this lands as a fix for everyone else.
function dress(t: { name: string; hex: string; bg: string; dark: boolean }): KidTheme {
  return t.dark
    ? {
        ...t,
        ink: '#F7F7F5',
        inkSoft: 'rgba(255,255,255,0.74)',
        inkMuted: 'rgba(255,255,255,0.66)',
        panel: 'rgba(255,255,255,0.09)',
        panelBorder: 'rgba(255,255,255,0.16)',
        shadow: 'rgba(0,0,0,0.18)',
      }
    : {
        ...t,
        ink: 'var(--ink)',
        inkSoft: 'rgba(26,26,46,0.60)',
        // Darker than inkSoft rather than lighter. On a pastel wash a mono
        // eyebrow at 0.66 white was invisible; the equivalent here has to go
        // the other way, and small uppercase mono needs more contrast than
        // body text, not less.
        inkMuted: 'rgba(26,26,46,0.66)',
        // White at 62 percent, so the panel still reads as a panel against a
        // pale background instead of disappearing into it.
        panel: 'rgba(255,255,255,0.62)',
        panelBorder: 'rgba(26,26,46,0.10)',
        shadow: 'rgba(26,26,46,0.13)',
      }
}

// A mixed colour: the child slides the hue wheel and gets their own soft pastel
// wash, built the exact gentle way as the named ones (light background, dark
// readable ink, a deeper accent for rings and edges), so any colour they land
// on still looks on brand and never heavier than the others. Stored as h<hue>.
function hueWash(h: number): KidTheme {
  return dress({
    name: 'Mine',
    hex: `hsl(${h}, 52%, 45%)`,
    bg: `linear-gradient(180deg, hsl(${h}, 60%, 93%) 0%, hsl(${h}, 54%, 87%) 100%)`,
    dark: false,
  })
}

/**
 * Resolve whatever is saved on the child row into a full theme: a named colour,
 * a mixed hue, or the default if it is neither. Never throws and never returns
 * null, because a screen that cannot work out its own background is a screen a
 * child cannot read.
 */
export function resolveTheme(accent: string | null | undefined): KidTheme {
  if (accent && BASE[accent]) return dress(BASE[accent])
  const m = /^h(\d{1,3})$/.exec(accent ?? '')
  if (m) return hueWash(Math.max(0, Math.min(360, Number(m[1]))))
  return dress(BASE[DEFAULT_ACCENT])
}

/** Is this a saved accent we recognise (named or mixed hue)? */
export function knownAccent(a: string | null | undefined): a is string {
  return typeof a === 'string' && (Boolean(BASE[a]) || /^h\d{1,3}$/.test(a))
}
