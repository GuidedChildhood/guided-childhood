import type { FriendKey, PlanetKey, RoomZone, ThingKey, Where } from './logic'
import { PHOTOS_MAX } from './logic'

/** What the child is looking at: a place, or the star system map (slice 3b). */
export type SceneKey = Where | 'map'

// The Den, in words (slice 3a). The rules are in ./logic; this is what the
// child reads and what things are called. No dashes in any line, ever. The
// drawings live in components/planet/ThingArt.tsx and RoomScene.tsx.

export const ROOM_TITLES: Record<SceneKey, string> = {
  outdoors: 'My planet',
  kitchen: 'The kitchen',
  living: 'The living room',
  bedroom: 'The bedroom',
  classroom: 'Moonbase School',
  playground: 'The Playground planet',
  map: 'My star system',
}

export const ROOM_EMOJI: Record<SceneKey, string> = { outdoors: '🪐', kitchen: '🍳', living: '🛋️', bedroom: '🛏️', classroom: '🏫', playground: '🛝', map: '🚀' }

/** The planets in words (slice 3b). The rules for what opens them are PLANETS in ./logic. */
export const PLANET_WORDS: Record<PlanetKey, { title: string; blurb: string; opensBy: string; emoji: string; colour: string }> = {
  home: { title: 'Home planet', blurb: 'Where the Friends live.', opensBy: '', emoji: '🪐', colour: '#8FD1B4' },
  school: { title: 'Moonbase School', blurb: 'A classroom with a board, two desks, a globe, and DiGi at the front.', opensBy: 'Pass a lesson on the Learn tab to open it.', emoji: '🏫', colour: '#8EC3F0' },
  park: { title: 'The Playground planet', blurb: 'A slide, the swings, a sandpit and a bench under a tree.', opensBy: 'Pass another lesson on the Learn tab to open it.', emoji: '🛝', colour: '#F7A23B' },
}

export const MAP_LINES = {
  welcome: 'The star system. Tap a planet to look, or drag a Friend onto one to fly there.',
  welcomeTier1: 'The star system. Tap a planet and Pebble flies there.',
  tray: 'Who is flying?',
  flying: (name: string, planet: string) => `${name} is flying to ${planet}.`,
  landed: (name: string, planet: string) => `${name} landed on ${planet}.`,
  shut: (planet: string, lessons: number) => `${planet} is not open yet. ${lessons === 1 ? 'One more lesson' : `${lessons} more lessons`} on the Learn tab and it lights up.`,
  shutTier1: (planet: string) => `${planet} is not open yet. A lesson with a grown up opens it.`,
  isNew: (planet: string) => `A new planet! ${planet} is open. Fly there.`,
  newWaiting: 'A new planet is waiting on your map.',
  orbit: 'You moved it. It stays there.',
  digi: 'DiGi, the star in the middle. Everything goes round DiGi.',
  learnTab: 'Open the Learn tab',
  resting: (name: string) => `${name} is resting. Nobody flies while they rest.`,
  nobody: 'Nobody is awake to fly.',
  home: 'Home. Everyone knows the way.',
} as const

export const SCHOOL_LINES = {
  enter: 'Moonbase School. DiGi is at the front.',
  board: 'Chalk squeak.',
  desk: 'A desk. Put something on it.',
  digi: 'Hello! I am DiGi. Learning is how planets open.',
  globe: 'Round and round.',
  books: 'So many books.',
  launch: 'Drag a Friend to the launch pad to fly home.',
} as const

export const PARK_LINES = {
  enter: 'The Playground planet. Drag a Friend onto the swings, the slide or the sandpit.',
  swing: 'Wheee!',
  slide: 'Whoosh!',
  sandpit: 'Dig dig dig.',
  bench: 'A little sit down.',
  tree: 'Rustle rustle.',
  sign: 'The sign points home.',
} as const

export const THING_LABELS: Record<ThingKey, string> = {
  apple: 'An apple',
  toast: 'Toast',
  juice: 'Juice',
  cake: 'A slice of cake',
  teddy: 'A teddy',
  ball: 'A ball',
  book: 'A picture book',
}

/** What the Friends say about a thing when it is tapped. One line each, no model anywhere near it. */
export const THING_LINES: Record<ThingKey, string> = {
  apple: 'Crunchy.',
  toast: 'Warm toast.',
  juice: 'Glug glug.',
  cake: 'Cake!',
  teddy: 'Squeeze.',
  ball: 'Bounce.',
  book: 'Once upon a time.',
}

export const ZONE_HINTS: Record<RoomZone, string> = {
  table: 'That one goes on a table.',
  floor: 'That one goes on the floor.',
  wall: 'That one hangs on the wall.',
}

export const HOUSE_LINES = {
  enter: 'Come in. This is the Den.',
  kitchen: 'The kitchen. The shelf is where the phones charge.',
  living: 'The living room. Sit anywhere.',
  bedroom: 'The bedroom. No phones in here. They charge downstairs.',
  classroom: 'Moonbase School. DiGi is at the front.',
  playground: 'The Playground planet. Drag a Friend onto the swings, the slide or the sandpit.',
  outdoors: 'Back outside.',
  map: 'The star system.',
  door: 'Drag a Friend to the door to go through.',
  fridge: 'The fridge. Take something out.',
  fridgeEmpty: 'All gone. The fridge fills up again tomorrow.',
  toybox: 'The toy box. Take something out.',
  toyboxEmpty: 'The toys are all out.',
  gave: (name: string, label: string) => `${name} has ${label.replace(/^(A|An) /, '').toLowerCase()}. Tap ${name} to use it.`,
  eatHint: (name: string) => `Tap ${name} to eat it.`,
  munch: 'Munch munch munch. All gone.',
  phoneTaken: (name: string) => `${name} has the MoonPhone. Tap ${name} to take a photo.`,
  snap: (n: number) => `Snap! Photo ${n} of ${PHOTOS_MAX}.`,
  galleryFull: 'Six photos. The gallery is full, and full means done.',
  phoneFlat: (name: string) => `${name}'s phone is flat, so it went on the shelf. All by itself.`,
  sleepyDock: (name: string) => `${name} is sleepy, so the phone went on the shelf. All by itself.`,
  docked: 'On the shelf. Five real minutes and it is full again.',
  dockedFull: 'On the shelf, all charged.',
  charging: (min: number) => `Still charging. ${min} more minute${min === 1 ? '' : 's'}.`,
  notYours: (owner: string) => `That is ${owner}'s phone.`,
  windDown: 'Nearly bedtime. Every phone goes on the shelf in the kitchen, and the Friends do it themselves.',
  noDockHere: 'No shelf in here. Phones charge downstairs in the kitchen.',
  shelf: 'The charging shelf. Phones go here when they are flat, and every night.',
  bed: (name: string) => `${name} is in bed. Night night.`,
  sofa: 'Comfy.',
  cooker: 'Sizzle sizzle.',
  picture: 'Wobble wobble.',
  musicBox: 'The music box plays.',
  window: 'Look out of the window.',
  wardrobe: 'The wardrobe. Drag an outfit onto a Friend.',
  lamp: 'Click.',
  placed: (label: string) => `${label}. Nice spot.`,
  home: (label: string) => `${label} is back where it lives.`,
  noSpot: 'No free spot here for that.',
  phoneToShelf: 'Drag the phone onto the shelf to charge it.',
} as const

export const HOLD_LABEL = (name: string): string => `${name}'s MoonPhone`

/** The lines the outdoors reveal says when a phone walks itself to the shelf while the child is outside. */
export const friendName = (key: FriendKey, names: Record<FriendKey, string>): string => names[key]
