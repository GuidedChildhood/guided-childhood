import type { PlanetKey, PlanetSign } from './logic'

// The star system in words and art (design 7.1 and 7.5, slice 3b): one row
// per planet, the way the missions and the Den's words already work. The
// RULES for a planet, its rooms and the keys that open it, are PLANETS in
// ./logic, which stays import free so the checks can run it; this file is
// everything the child sees. A new planet is a row in both files plus its
// rooms, never new code and never a migration. No dashes in any line, ever.
//
// Two builds of this slice met on 6 September 2026 (PR 984 and PR 986). The
// catalogue of every planet, its colours and motifs, and the self builder
// came from PR 984; the map you can drag, the rooms with things in them and
// the reveals came from PR 986. This file is where the two were folded into one.

export type PlanetMotif = 'grass' | 'book' | 'slide' | 'mug' | 'rocket' | 'tree' | 'dome' | 'screen' | 'ice' | 'lava' | 'rainbow'

export type PlanetWords = {
  title: string
  blurb: string
  emoji: string
  /** The map drawing: body colour, a darker edge, one motif, and its radius. */
  colour: string
  edge: string
  motif: PlanetMotif
  r: number
}

export const PLANET_WORDS: Record<PlanetKey, PlanetWords> = {
  home: { title: 'Home planet', blurb: 'Where the Friends live.', emoji: '🪐', colour: '#8FD1B4', edge: '#5F8F4A', motif: 'grass', r: 30 },
  school: { title: 'Moonbase School', blurb: 'A classroom with a board, two desks, a globe, and DiGi at the front.', emoji: '🏫', colour: '#8EC3F0', edge: '#5A93C4', motif: 'book', r: 24 },
  playground: { title: 'The Playground planet', blurb: 'A slide, the swings, a sandpit and a bench under a tree.', emoji: '🛝', colour: '#F7A23B', edge: '#C99A28', motif: 'slide', r: 24 },
  port: { title: 'Space Port', blurb: 'Rockets, the rover, and a fuel pump that pours starlight.', emoji: '🚀', colour: '#B9C4D6', edge: '#84919F', motif: 'rocket', r: 22 },
  wild: { title: 'Wild planet', blurb: 'A forest, a pond, a burrow and a rope swing.', emoji: '🌳', colour: '#7FB069', edge: '#527A42', motif: 'tree', r: 22 },
  observatory: { title: 'The Observatory', blurb: 'A telescope, a star map, the comet and deckchairs.', emoji: '🔭', colour: '#C8B8E8', edge: '#8F7BB8', motif: 'dome', r: 22 },
  cafe: { title: 'Star Cafe', blurb: 'Tables, the counter, the menu, cushions and books.', emoji: '☕', colour: '#F2A58F', edge: '#C4765F', motif: 'mug', r: 22 },
  starnet: { title: 'StarNet Studio', blurb: 'The dome tool and the pretend feed.', emoji: '📺', colour: '#F2957A', edge: '#BF6A52', motif: 'screen', r: 20 },
  ice: { title: 'Ice planet', blurb: 'Igloos, an ice slide, a snowman and a warm hut.', emoji: '🧊', colour: '#CFE8F5', edge: '#93B9CC', motif: 'ice', r: 20 },
  volcano: { title: 'Volcano planet', blurb: 'Warm pools, a lava lamp rock, stepping stones and steam.', emoji: '🌋', colour: '#E28B6B', edge: '#A85E3D', motif: 'lava', r: 20 },
  rainbow: { title: 'Rainbow planet', blurb: 'A rainbow slide, a cloud bed, paint pots and a sun shower.', emoji: '🌈', colour: '#F5D7E8', edge: '#C79BB4', motif: 'rainbow', r: 22 },
}

/** The little picture on a pale planet: the small honest sign of what opens it. No padlock, ever. */
export const OPEN_SIGNS: Record<PlanetSign, string> = {
  lesson: '📖',
  mission: '🚩',
  stage: '🌱',
  later: '✨',
}

/** The words under a pale planet, from Tier 2. Tier 1 gets the picture only. */
export const SIGN_WORDS: Record<PlanetSign, string> = {
  lesson: 'PASS A LESSON',
  mission: 'LAND A MISSION',
  stage: 'KEEP GROWING',
  later: 'FAR AWAY',
}

/** The self builder, in words. Tier 1 hears these read by a grown up or not at all; the swatches carry the meaning. */
export const SELF_LINES = {
  makeMe: 'Make me',
  title: 'This is me',
  me: 'Me',
  hair: 'Hair',
  suit: 'Suit',
  done: 'Done',
  hello: 'There you are! Ready to explore.',
  changed: 'Looking good!',
  tapMe: 'That is you. Tap yourself any time to change your look.',
} as const
