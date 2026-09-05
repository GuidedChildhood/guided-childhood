import type { FriendKey, RoomZone, ThingKey, Where } from './logic'
import { PHOTOS_MAX } from './logic'

// The Den, in words (slice 3a). The rules are in ./logic; this is what the
// child reads and what things are called. No dashes in any line, ever. The
// drawings live in components/planet/ThingArt.tsx and RoomScene.tsx.

export const ROOM_TITLES: Record<Where, string> = {
  outdoors: 'My planet',
  kitchen: 'The kitchen',
  living: 'The living room',
  bedroom: 'The bedroom',
}

export const ROOM_EMOJI: Record<Where, string> = { outdoors: '🪐', kitchen: '🍳', living: '🛋️', bedroom: '🛏️' }

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
  outdoors: 'Back outside.',
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
