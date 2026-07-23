// The printables: high quality colouring book sheets a family prints,
// completes away from screens, and hands back for stars. The offline
// pathway. Artwork is generated in one locked style (white sheet, hand
// lettered title, colouring book line art, the 5 star strip) and hosted
// on the CDN next.config already allows. Adding a printable is a data
// entry here plus two generations, never a code change.
//
// Stars flow through the existing quest approve loop: Add to quests
// creates a one off family quest, the child hands the finished sheet
// back, the parent ticks it, the stars land in the time bank.

const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'

export type Printable = {
  key: string
  title: string
  emoji: string
  kind: 'bucket' | 'hunt' | 'challenge' | 'brain' | 'craft'
  // Stage ids this sheet suits (1 Foundation to 5 Independent), same
  // scheme as the quest games so every surface gates the same way.
  stages: number[]
  minutes: string
  setting: 'indoors' | 'outdoors' | 'anywhere'
  skill: string
  stars: number
  blurb: string
  sheetUrl: string
  // Spanish artwork when it exists; the PDF route serves it with ?lang=es.
  sheetUrlEs?: string
  // Multi page printables (crafts) list their remaining pages here and
  // the PDF route appends them after the first sheet.
  extraSheetUrls?: string[]
  extraSheetUrlsEs?: string[]
  previewUrl: string
}

export const PRINTABLES: Printable[] = [
  {
    key: 'summer-bucket-list',
    title: 'My Summer Bucket List', emoji: '☀️', kind: 'bucket',
    stages: [1, 2, 3], minutes: 'All summer', setting: 'anywhere', skill: 'Family time',
    stars: 5,
    blurb: 'Sixteen real world summer wins, coloured in one by one. Fill the page before September.',
    sheetUrl: BASE + 'hf_20260722_110249_9222b05c-e58b-4035-b376-723bfb02a03e.png',
    sheetUrlEs: BASE + 'hf_20260722_122910_c7938e56-a03c-47ba-841c-1d3a4669cdb1.png',
    previewUrl: BASE + 'hf_20260713_124936_d5894552-b377-4835-b103-599872e5b4d5.png',
  },
  {
    key: 'rainy-day-bucket-list',
    title: 'My Rainy Day Bucket List', emoji: '🌧️', kind: 'bucket',
    stages: [1, 2, 3], minutes: 'One wet day', setting: 'indoors', skill: 'Creativity',
    stars: 5,
    blurb: 'The screens stay off and the rain stays out. Forts, baking, kitchen discos and hot chocolate.',
    sheetUrl: BASE + 'hf_20260722_110252_6c5a3564-5f2f-414f-948f-2bef16fa978a.png',
    sheetUrlEs: BASE + 'hf_20260722_122913_8935b9b3-71c1-4514-8023-e30e081cf413.png',
    previewUrl: BASE + 'hf_20260713_125305_b235e9e2-d3c2-4fd0-aef6-a6c0c90e8a5b.png',
  },
  {
    key: 'kindness-bucket-list',
    title: 'My Kindness Bucket List', emoji: '💛', kind: 'bucket',
    stages: [1, 2, 3, 4], minutes: 'A few weeks', setting: 'anywhere', skill: 'Wellbeing',
    stars: 5,
    blurb: 'Every box coloured made someone’s day better. Thank you notes, baking for a neighbour, three real compliments.',
    sheetUrl: BASE + 'hf_20260722_110300_e6831a25-796a-4d58-8e24-486a56683717.png',
    sheetUrlEs: BASE + 'hf_20260722_122921_d147a484-fb66-41a5-8248-7380d91dfd4d.png',
    previewUrl: BASE + 'hf_20260713_125326_94438fa2-9760-4981-b058-205ea2623e2f.png',
  },
  {
    key: 'reading-bucket-list',
    title: 'My Reading Bucket List', emoji: '📚', kind: 'bucket',
    stages: [1, 2, 3, 4], minutes: 'A month of stories', setting: 'anywhere', skill: 'Reading',
    stars: 5,
    blurb: 'Eight ways to read: outside, to someone, about space, a book they chose themselves.',
    sheetUrl: BASE + 'hf_20260722_110303_5c28f7af-1d9a-4a3f-bb03-a5d84c7c47e5.png',
    sheetUrlEs: BASE + 'hf_20260722_122923_526700d3-41c9-417f-8b31-f781821d8582.png',
    previewUrl: BASE + 'hf_20260713_125344_3aaa7475-b816-4b0b-8d3f-932fd86f48f2.png',
  },
  {
    key: 'nature-scavenger-hunt',
    title: 'Nature Scavenger Hunt', emoji: '🍃', kind: 'hunt',
    stages: [1, 2, 3], minutes: '45 minutes', setting: 'outdoors', skill: 'Attention',
    stars: 5,
    blurb: 'Take it on a walk. A feather, a snail, a funny shaped cloud. Look, spot, colour.',
    sheetUrl: BASE + 'hf_20260721_152826_19a6c2b0-d195-496c-8f6f-dcb128419b54.png',
    sheetUrlEs: BASE + 'hf_20260722_122935_9531a458-ca41-4e5b-8804-daa0bcaf69e2.png',
    previewUrl: BASE + 'hf_20260713_125404_e98b9bff-4d58-43e9-976f-8e7704586b31.png',
  },
  {
    key: 'family-challenge-list',
    title: 'Family Challenge List', emoji: '🏆', kind: 'challenge',
    stages: [1, 2, 3, 4, 5], minutes: 'A few weekends', setting: 'anywhere', skill: 'Family time',
    stars: 5,
    blurb: 'Done together or not at all: game night, a screen free evening, a walk somewhere new.',
    sheetUrl: BASE + 'hf_20260722_110311_fdc24488-64e3-451d-aaed-1bc317f17bf8.png',
    sheetUrlEs: BASE + 'hf_20260722_122939_99b00997-c232-46ce-809d-75ea7984317a.png',
    previewUrl: BASE + 'hf_20260713_125425_decdd972-db44-4eb1-9b37-56ea142bee1d.png',
  },
  {
    key: 'bucket-list-craft',
    title: 'Bucket List Craft', emoji: '✂️', kind: 'craft',
    stages: [1, 2, 3], minutes: 'One afternoon', setting: 'indoors', skill: 'Creativity',
    stars: 5,
    blurb: 'Two pages, one craft: cut out the bucket, glue on the handle and friends, write the list, colour the lot.',
    sheetUrl: BASE + 'hf_20260722_122949_d76a94fa-873d-434a-97eb-1d725fcded32.png',
    extraSheetUrls: [BASE + 'hf_20260722_122952_c1dc8750-7494-4d3e-92d1-004708dadaa9.png'],
    sheetUrlEs: BASE + 'hf_20260722_123013_7e5fdfdd-2cca-4dfe-b7d0-9a494802915c.png',
    extraSheetUrlsEs: [BASE + 'hf_20260722_123017_3f1f0526-a079-45c8-b2c6-36bcc85a58aa.png'],
    previewUrl: BASE + 'hf_20260713_140432_f5db6b56-1610-47bb-a7bf-bb4b29a07d73.png',
  },
  {
    key: 'spanish-bucket-list',
    title: 'My Spanish Bucket List', emoji: '🇪🇸', kind: 'bucket',
    stages: [1, 2, 3, 4], minutes: 'A week of words', setting: 'anywhere', skill: 'Spanish',
    stars: 5,
    blurb: 'Hola, gracias, uno dos tres. Six first steps into Spanish, said out loud and coloured in.',
    sheetUrl: BASE + 'hf_20260722_110316_0eaf5193-a07e-4936-a8c0-246d3b214238.png',
    previewUrl: BASE + 'hf_20260722_110327_09f96b0e-2738-4ed7-9c2b-3ad726c6aa1f.png',
  },
  // DiGi's Planet Friends, one colour in sheet each, tied to the stage that
  // unlocks that Friend. Both preview and sheet are the empty line art: a
  // printable is a page to colour in, so the card shows exactly that. The
  // finished, coloured Friend lives on the app, not here.
  {
    key: 'meet-pebble',
    title: 'Colour in Pebble', emoji: '🟡', kind: 'craft',
    stages: [1], minutes: 'One sitting', setting: 'anywhere', skill: 'Creativity',
    stars: 5,
    blurb: 'Your Stage 1 Planet Friend, full of curiosity and wonder. Colour Pebble in however you like.',
    sheetUrl: BASE + 'hf_20260723_121101_b9370321-6338-41b6-8c06-220c937d6705.png',
    previewUrl: BASE + 'hf_20260723_121101_b9370321-6338-41b6-8c06-220c937d6705.png',
  },
  {
    key: 'meet-bloop',
    title: 'Colour in Bloop', emoji: '🟢', kind: 'craft',
    stages: [2], minutes: 'One sitting', setting: 'anywhere', skill: 'Creativity',
    stars: 5,
    blurb: 'Your Stage 2 Planet Friend, creative and clever. Bring Bloop to life with colour.',
    sheetUrl: BASE + 'hf_20260723_121102_5535f574-b642-4f8f-bcc3-8d4a7ff2c334.png',
    previewUrl: BASE + 'hf_20260723_121102_5535f574-b642-4f8f-bcc3-8d4a7ff2c334.png',
  },
  {
    key: 'meet-orbit',
    title: 'Colour in Orbit', emoji: '🔵', kind: 'craft',
    stages: [3], minutes: 'One sitting', setting: 'anywhere', skill: 'Creativity',
    stars: 5,
    blurb: 'Your Stage 3 Planet Friend, always exploring. Colour Orbit ready for the next big question.',
    sheetUrl: BASE + 'hf_20260723_121113_c6a1b8e9-da55-43d5-bf5f-9bdf7ffa9954.png',
    previewUrl: BASE + 'hf_20260723_121113_c6a1b8e9-da55-43d5-bf5f-9bdf7ffa9954.png',
  },
  {
    key: 'meet-nova',
    title: 'Colour in Nova', emoji: '🟣', kind: 'craft',
    stages: [4], minutes: 'One sitting', setting: 'anywhere', skill: 'Creativity',
    stars: 5,
    blurb: 'Your Stage 4 Planet Friend, thoughtful and kind. Colour Nova your way.',
    sheetUrl: BASE + 'hf_20260723_121115_b411f979-744c-4e51-89ee-7e3266ec8abe.png',
    previewUrl: BASE + 'hf_20260723_121115_b411f979-744c-4e51-89ee-7e3266ec8abe.png',
  },
  {
    key: 'meet-cosmo',
    title: 'Colour in Cosmo', emoji: '🟠', kind: 'craft',
    stages: [5], minutes: 'One sitting', setting: 'anywhere', skill: 'Creativity',
    stars: 5,
    blurb: 'Your Stage 5 Planet Friend, confident and independent. Colour Cosmo ready to lead.',
    sheetUrl: BASE + 'hf_20260723_121116_41d12750-7101-4c14-a3b0-671c45b1b570.png',
    previewUrl: BASE + 'hf_20260723_121116_41d12750-7101-4c14-a3b0-671c45b1b570.png',
  },
]

export function getPrintable(key: string): Printable | null {
  return PRINTABLES.find(p => p.key === key) ?? null
}

export function printablesForStage(stageId: number | null | undefined): Printable[] {
  const stage = stageId && stageId >= 1 && stageId <= 5 ? stageId : 2
  return PRINTABLES.filter(p => p.stages.includes(stage))
}
