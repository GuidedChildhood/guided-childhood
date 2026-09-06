import type { Home, Tier } from './logic'

// The star system (design 7.1, slice 3b): the catalogue of planets as data,
// the way the missions and the Den's words already work. The rules stay in
// ./logic; which planets are OPEN is decided in ./server at view time from
// lessons passed, missions approved and the growth stage, and arrives on
// HomeView as PlanetLight[]. Nothing here is a table: a new planet is a row
// in this file plus art, never new code and never a migration.
// No dashes in any line, ever.

/** Every planet on the map. The home planet carries the Den inside it. */
export type UniverseKey =
  | 'home' | 'school' | 'playground' | 'cafe' | 'port'
  | 'wild' | 'observatory' | 'starnet' | 'ice' | 'volcano' | 'rainbow'

/** The rooms a child can land in away from home, this slice. */
export type AwayKey = 'school' | 'playground'

export type OpenRule =
  | { kind: 'free' }
  | { kind: 'lesson'; count: number; hint: string }
  | { kind: 'mission'; key: string; hint: string }
  | { kind: 'stage'; stage: number; hint: string }
  | { kind: 'later'; hint: string }

export type UniversePlanet = {
  key: UniverseKey
  title: string
  tiers: Tier[]
  opens: OpenRule
  /** A planet the child can land on this slice. The rest light up and wait for their rooms (3c, 3d). */
  landable: boolean
  /** The map drawing: body colour, a darker edge, and one motif. */
  colour: string
  edge: string
  motif: 'grass' | 'book' | 'slide' | 'mug' | 'rocket' | 'tree' | 'dome' | 'screen' | 'ice' | 'lava' | 'rainbow'
  /** Which ring it sits on (0 nearest DiGi) and where along it, 0 to 1. */
  ring: 0 | 1 | 2
  at: number
  /** Radius on the map, home is the big one. */
  r: number
}

/** The little picture on a pale planet: the small honest sign of what opens it. */
export const OPEN_SIGNS: Record<OpenRule['kind'], string> = {
  free: '',
  lesson: '📖',
  mission: '🚩',
  stage: '🌱',
  later: '✨',
}

export const UNIVERSE: UniversePlanet[] = [
  { key: 'home', title: 'My planet', tiers: [1, 2, 3], opens: { kind: 'free' }, landable: true, colour: '#8FBF6F', edge: '#5F8F4A', motif: 'grass', ring: 0, at: 0.14, r: 44 },
  { key: 'school', title: 'Moonbase School', tiers: [1, 2, 3], opens: { kind: 'lesson', count: 1, hint: 'A lesson opens this one' }, landable: true, colour: '#8EC3F0', edge: '#5A93C4', motif: 'book', ring: 0, at: 0.62, r: 34 },
  { key: 'playground', title: 'Playground planet', tiers: [1, 2, 3], opens: { kind: 'lesson', count: 2, hint: 'Two lessons open this one' }, landable: true, colour: '#F4C542', edge: '#C99A28', motif: 'slide', ring: 1, at: 0.05, r: 34 },
  { key: 'cafe', title: 'Star Cafe', tiers: [2, 3], opens: { kind: 'lesson', count: 3, hint: 'Three lessons open this one' }, landable: false, colour: '#F2A58F', edge: '#C4765F', motif: 'mug', ring: 1, at: 0.38, r: 28 },
  { key: 'port', title: 'Space Port', tiers: [1, 2, 3], opens: { kind: 'mission', key: 'rocket_launch', hint: 'The rocket mission opens this one' }, landable: false, colour: '#B9C4D6', edge: '#84919F', motif: 'rocket', ring: 1, at: 0.72, r: 30 },
  { key: 'wild', title: 'Wild planet', tiers: [1, 2, 3], opens: { kind: 'lesson', count: 4, hint: 'Four lessons open this one' }, landable: false, colour: '#7FB069', edge: '#527A42', motif: 'tree', ring: 2, at: 0.1, r: 30 },
  { key: 'observatory', title: 'The Observatory', tiers: [2, 3], opens: { kind: 'mission', key: 'star_hunt', hint: 'The star hunt opens this one' }, landable: false, colour: '#C8B8E8', edge: '#8F7BB8', motif: 'dome', ring: 2, at: 0.32, r: 27 },
  { key: 'starnet', title: 'StarNet Studio', tiers: [2, 3], opens: { kind: 'lesson', count: 5, hint: 'Five lessons open this one' }, landable: false, colour: '#F2957A', edge: '#BF6A52', motif: 'screen', ring: 2, at: 0.55, r: 27 },
  { key: 'ice', title: 'Ice planet', tiers: [1, 2, 3], opens: { kind: 'later', hint: 'A far away one, for later' }, landable: false, colour: '#CFE8F5', edge: '#93B9CC', motif: 'ice', ring: 2, at: 0.74, r: 24 },
  { key: 'volcano', title: 'Volcano planet', tiers: [1, 2, 3], opens: { kind: 'later', hint: 'A far away one, for later' }, landable: false, colour: '#E28B6B', edge: '#A85E3D', motif: 'lava', ring: 2, at: 0.88, r: 24 },
  { key: 'rainbow', title: 'Rainbow planet', tiers: [1, 2, 3], opens: { kind: 'later', hint: 'A far away one, for later' }, landable: false, colour: '#F5D7E8', edge: '#C79BB4', motif: 'rainbow', ring: 1, at: 0.9, r: 24 },
]

export const universePlanet = (key: UniverseKey): UniversePlanet => UNIVERSE.find(p => p.key === key)!

export const AWAY_KEYS: AwayKey[] = ['school', 'playground']
export const isAwayKey = (k: unknown): k is AwayKey => k === 'school' || k === 'playground'

/** What the server tells the map: which planets shine, and why the pale ones wait. */
export type PlanetLight = {
  key: UniverseKey
  open: boolean
  landable: boolean
  hint: string
}

/**
 * The lights, pure: lessons passed and the home decide, so the server and
 * the dev fixture agree. Only planets of this tier appear at all.
 */
export function planetLights(home: Home, lessonsPassed: number): PlanetLight[] {
  const approved = new Set(home.missions.filter(m => m.status === 'approved' || m.status === 'done').map(m => m.key))
  return UNIVERSE.filter(p => p.tiers.includes(home.tier)).map(p => {
    const o = p.opens
    const open =
      o.kind === 'free' ? true :
      o.kind === 'lesson' ? lessonsPassed >= o.count :
      o.kind === 'mission' ? approved.has(o.key) :
      o.kind === 'stage' ? home.growthStage >= o.stage :
      false
    return { key: p.key, open, landable: p.landable && open, hint: o.kind === 'free' ? '' : o.hint }
  })
}

// ── The away rooms, in words (the Den pattern, world.ts) ────────────────────

export const AWAY_TITLES: Record<AwayKey, string> = {
  school: 'Moonbase School',
  playground: 'Playground planet',
}

export const AWAY_EMOJI: Record<AwayKey, string> = { school: '🏫', playground: '🛝' }

/** What the lead Friend says when a piece of an away room is tapped. The renderer carries no string of its own. */
export const AWAY_PROP_LINES: Record<AwayKey, Record<string, string>> = {
  school: {
    board: 'Look at the board. DiGi drew that.',
    digi_desk: 'DiGi teaches here.',
    desk: 'A desk just for you.',
    books: 'So many stories.',
  },
  playground: {
    slide: 'Wheee!',
    swings: 'Higher, higher!',
    sandpit: 'Dig dig dig.',
  },
}

/** The builder, in words. Tier 1 hears these read by a grown up or not at all; the swatches carry the meaning. */
export const SELF_LINES = {
  makeMe: 'Make me',
  title: 'This is me',
  me: 'Me',
  hair: 'Hair',
  suit: 'Suit',
  done: 'Done',
  hello: 'There you are! Ready to explore.',
  changed: 'Looking good!',
} as const

export const UNIVERSE_LINES = {
  map: 'Our star system. Tap a bright planet to fly there.',
  paler: 'That one is still waking up.',
  fly: (title: string) => `Off to ${title}!`,
  schoolEnter: 'Moonbase School. DiGi teaches here.',
  playgroundEnter: 'The Playground planet. Wheee!',
  homeAgain: 'Home again.',
  mapButton: 'The map',
  needFriend: 'Everyone is resting. The rocket waits.',
} as const
