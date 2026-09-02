import type { SpeciesKey, Tier } from './logic'

// Planter Friends: content as data. The plants, the starting garden per tier,
// the names a child picks from, and every line the toy says. Renderers live
// in components/planter and never carry a string of their own, the same rule
// as the quest games registry. No dashes in any line, ever.

export type Species = {
  key: SpeciesKey
  label: string
  /** Petal, centre and leaf colours, drawn by the plant renderer. */
  petal: string
  centre: string
  leaf: string
  defaultName: string
}

export const SPECIES: Record<SpeciesKey, Species> = {
  sunny: { key: 'sunny', label: 'Sunflower', petal: '#F4C542', centre: '#6B4423', leaf: '#4E9A5B', defaultName: 'Sunny' },
  daisy: { key: 'daisy', label: 'Daisy', petal: '#FFFFFF', centre: '#F2B705', leaf: '#5AA86C', defaultName: 'Pip' },
  bell: { key: 'bell', label: 'Bluebell', petal: '#7A8CE0', centre: '#4C5BBF', leaf: '#4E9A5B', defaultName: 'Bell' },
}

/** What grows in a new garden at each tier (design section 5). */
export const STARTERS: Record<Tier, SpeciesKey[]> = {
  1: ['sunny'],
  2: ['sunny', 'daisy'],
  3: ['sunny', 'daisy', 'bell'],
}

/** Names a plant can wear at Tier 1 and 2. Typed names arrive at Tier 3 with slice 4. */
export const PLANT_NAMES = ['Sunny', 'Pip', 'Bud', 'Fern', 'Poppy', 'Sprout', 'Petal', 'Bell']

export function starterPlants(tier: Tier): { id: string; species: SpeciesKey; name: string }[] {
  return STARTERS[tier].map((species, i) => ({ id: `p${i + 1}`, species, name: SPECIES[species].defaultName }))
}

/** The stage names, for the grown up's eyes and the fixture. A child sees the drawing. */
export const STAGE_LABELS = ['Seed', 'Sprout', 'Leaf', 'Bud', 'Bloom', 'Seedhead']

// Every line the toy says, in the plant's own voice. Short, warm, child
// reading level. Tier 1 hears these read by a grown up or not at all, so the
// pictures carry the meaning there.
export const LINES = {
  welcome: 'Hello! Water me, tickle me, tuck me in.',
  yawn: 'I am getting sleepy.',
  tired: 'So sleepy. I need a rest.',
  napStart: 'Night night. See you soon.',
  nursery: 'Shh. Everyone is asleep.',
  ambient: 'Resting. Back soon.',
  sunlightPrompt: 'Find me some real sunshine. Take me to your sunniest window.',
  sunlightGrownup: 'Ask your grown up to come too.',
  sunlightButton: 'Catch the sunshine',
  sunlightWaiting: 'Mmm. Real sunshine.',
  sunlightDone: 'That was real sunshine. I can feel it!',
  grewAway: 'I grew while you were away!',
  grewLeaf: 'I grew a new leaf while I was resting!',
  grewNight: 'We all grew in the night!',
  windDown: 'Nearly bedtime in the greenhouse.',
  nightTier1: 'The plants are asleep. Night night.',
  nightTier2: 'Everyone is asleep. They grow while you sleep too.',
  askDoor: 'Ask my grown up',
  asked: 'Asked. Your grown up will see it.',
  yes: 'Your grown up said yes!',
  notNow: 'Not this time, and that is fine.',
  nightNotNow: 'Night night. See you in the morning.',
  startWindow: 'Start my minutes',
  backToQuests: 'Back to my quests',
  backToGarden: 'Back to the garden',
  watered: 'Lovely!',
  tickled: 'Hee hee!',
  dug: 'Pat pat.',
  shadeOn: 'Ahh, shade.',
  shadeOff: 'Hello sunshine.',
  everyoneToBed: 'Everyone to bed',
} as const

/** The pyjama set each species wears at bedtime, by nightcap colour. */
export const PYJAMAS: Record<SpeciesKey, { cap: string; blanket: string }> = {
  sunny: { cap: '#F28C6A', blanket: '#F9D9C8' },
  daisy: { cap: '#7AA7E8', blanket: '#D6E4FA' },
  bell: { cap: '#B48CE8', blanket: '#E6DAFA' },
}
