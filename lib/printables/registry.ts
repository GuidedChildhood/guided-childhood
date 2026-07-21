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
    sheetUrl: BASE + 'hf_20260713_124922_ba0709ec-ec0d-4c0d-a8a6-af46bd990fae.png',
    sheetUrlEs: BASE + 'hf_20260713_132550_1294330c-1bf1-4803-b1ab-f4bd1f054f6f.png',
    previewUrl: BASE + 'hf_20260713_124936_d5894552-b377-4835-b103-599872e5b4d5.png',
  },
  {
    key: 'rainy-day-bucket-list',
    title: 'My Rainy Day Bucket List', emoji: '🌧️', kind: 'bucket',
    stages: [1, 2, 3], minutes: 'One wet day', setting: 'indoors', skill: 'Creativity',
    stars: 5,
    blurb: 'The screens stay off and the rain stays out. Forts, baking, kitchen discos and hot chocolate.',
    sheetUrl: BASE + 'hf_20260713_125301_6f2b5e5d-85e2-4a91-bbc6-e0f2367e5908.png',
    sheetUrlEs: BASE + 'hf_20260713_132555_33e47caa-d096-43ee-8294-f18bf561d992.png',
    previewUrl: BASE + 'hf_20260713_125305_b235e9e2-d3c2-4fd0-aef6-a6c0c90e8a5b.png',
  },
  {
    key: 'kindness-bucket-list',
    title: 'My Kindness Bucket List', emoji: '💛', kind: 'bucket',
    stages: [1, 2, 3, 4], minutes: 'A few weeks', setting: 'anywhere', skill: 'Wellbeing',
    stars: 5,
    blurb: 'Every box coloured made someone’s day better. Thank you notes, baking for a neighbour, three real compliments.',
    sheetUrl: BASE + 'hf_20260713_125323_1242da82-d705-4bec-83f4-2acfc357b38c.png',
    sheetUrlEs: BASE + 'hf_20260713_132622_2f3c7661-f22d-4f7a-8d58-2c34ac5ede9e.png',
    previewUrl: BASE + 'hf_20260713_125326_94438fa2-9760-4981-b058-205ea2623e2f.png',
  },
  {
    key: 'reading-bucket-list',
    title: 'My Reading Bucket List', emoji: '📚', kind: 'bucket',
    stages: [1, 2, 3, 4], minutes: 'A month of stories', setting: 'anywhere', skill: 'Reading',
    stars: 5,
    blurb: 'Eight ways to read: outside, to someone, about space, a book they chose themselves.',
    sheetUrl: BASE + 'hf_20260713_125341_14a3ecc6-7706-4ccf-b1ca-67eee4e9bad9.png',
    sheetUrlEs: BASE + 'hf_20260713_132628_59a9f6de-080b-4765-9a58-5ebce84fb951.png',
    previewUrl: BASE + 'hf_20260713_125344_3aaa7475-b816-4b0b-8d3f-932fd86f48f2.png',
  },
  {
    key: 'nature-scavenger-hunt',
    title: 'Nature Scavenger Hunt', emoji: '🍃', kind: 'hunt',
    stages: [1, 2, 3], minutes: '45 minutes', setting: 'outdoors', skill: 'Attention',
    stars: 5,
    blurb: 'Take it on a walk. A feather, a snail, a funny shaped cloud. Look, spot, colour.',
    sheetUrl: BASE + 'hf_20260713_125401_9fc5d6aa-042a-4c2c-906c-495d1a71b442.png',
    sheetUrlEs: BASE + 'hf_20260713_132647_97614a78-c23d-40c8-aa1c-a02632ce75d9.png',
    previewUrl: BASE + 'hf_20260713_125404_e98b9bff-4d58-43e9-976f-8e7704586b31.png',
  },
  {
    key: 'family-challenge-list',
    title: 'Family Challenge List', emoji: '🏆', kind: 'challenge',
    stages: [1, 2, 3, 4, 5], minutes: 'A few weekends', setting: 'anywhere', skill: 'Family time',
    stars: 5,
    blurb: 'Done together or not at all: game night, a screen free evening, a walk somewhere new.',
    sheetUrl: BASE + 'hf_20260713_125421_89d1c68e-fb50-4046-8a9c-d33bbfa4759c.png',
    sheetUrlEs: BASE + 'hf_20260713_132652_0b2abeb9-04eb-4c6b-9fda-753a7c9c8242.png',
    previewUrl: BASE + 'hf_20260713_125425_decdd972-db44-4eb1-9b37-56ea142bee1d.png',
  },
  {
    key: 'bucket-list-craft',
    title: 'Bucket List Craft', emoji: '✂️', kind: 'craft',
    stages: [1, 2, 3], minutes: 'One afternoon', setting: 'indoors', skill: 'Creativity',
    stars: 5,
    blurb: 'Two pages, one craft: cut out the bucket, glue on the handle and friends, write the list, colour the lot.',
    sheetUrl: BASE + 'hf_20260713_135347_bd5adb12-5316-4d17-a99a-68dca28c1d07.png',
    extraSheetUrls: [BASE + 'hf_20260713_135351_23e3bb15-5856-4759-95cf-b989098f9faa.png'],
    sheetUrlEs: BASE + 'hf_20260713_135730_8cd335c2-8065-4c3d-9416-bdd52eb1c322.png',
    extraSheetUrlsEs: [BASE + 'hf_20260713_135734_8c8dee4f-dd30-4a87-a5d6-f1568d371767.png'],
    previewUrl: BASE + 'hf_20260713_140432_f5db6b56-1610-47bb-a7bf-bb4b29a07d73.png',
  },
  {
    key: 'spanish-bucket-list',
    title: 'My Spanish Bucket List', emoji: '🇪🇸', kind: 'bucket',
    stages: [1, 2, 3, 4], minutes: 'A week of words', setting: 'anywhere', skill: 'Spanish',
    stars: 5,
    blurb: 'Hola, gracias, uno dos tres. Six first steps into Spanish, said out loud and coloured in.',
    sheetUrl: BASE + 'hf_20260721_103653_637f3e46-fb57-4722-ae5b-9e55680c6e97.png',
    previewUrl: BASE + 'hf_20260721_103653_637f3e46-fb57-4722-ae5b-9e55680c6e97.png',
  },
]

export function getPrintable(key: string): Printable | null {
  return PRINTABLES.find(p => p.key === key) ?? null
}

export function printablesForStage(stageId: number | null | undefined): Printable[] {
  const stage = stageId && stageId >= 1 && stageId <= 5 ? stageId : 2
  return PRINTABLES.filter(p => p.stages.includes(stage))
}
