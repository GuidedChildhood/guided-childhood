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
  kind: 'bucket' | 'hunt' | 'challenge' | 'brain'
  // Stage ids this sheet suits (1 Foundation to 5 Independent), same
  // scheme as the quest games so every surface gates the same way.
  stages: number[]
  minutes: string
  setting: 'indoors' | 'outdoors' | 'anywhere'
  skill: string
  stars: number
  blurb: string
  sheetUrl: string
  previewUrl: string
}

export const PRINTABLES: Printable[] = [
  {
    key: 'summer-bucket-list',
    title: 'My Summer Bucket List', emoji: '☀️', kind: 'bucket',
    stages: [1, 2], minutes: 'All summer', setting: 'anywhere', skill: 'Family time',
    stars: 5,
    blurb: 'Sixteen real world summer wins, coloured in one by one. Fill the page before September.',
    sheetUrl: BASE + 'hf_20260713_124922_ba0709ec-ec0d-4c0d-a8a6-af46bd990fae.png',
    previewUrl: BASE + 'hf_20260713_124936_d5894552-b377-4835-b103-599872e5b4d5.png',
  },
  {
    key: 'rainy-day-bucket-list',
    title: 'My Rainy Day Bucket List', emoji: '🌧️', kind: 'bucket',
    stages: [1, 2], minutes: 'One wet day', setting: 'indoors', skill: 'Creativity',
    stars: 5,
    blurb: 'The screens stay off and the rain stays out. Forts, baking, kitchen discos and hot chocolate.',
    sheetUrl: BASE + 'hf_20260713_125301_6f2b5e5d-85e2-4a91-bbc6-e0f2367e5908.png',
    previewUrl: BASE + 'hf_20260713_125305_b235e9e2-d3c2-4fd0-aef6-a6c0c90e8a5b.png',
  },
  {
    key: 'kindness-bucket-list',
    title: 'My Kindness Bucket List', emoji: '💛', kind: 'bucket',
    stages: [1, 2, 3], minutes: 'A few weeks', setting: 'anywhere', skill: 'Wellbeing',
    stars: 5,
    blurb: 'Every box coloured made someone’s day better. Thank you notes, baking for a neighbour, three real compliments.',
    sheetUrl: BASE + 'hf_20260713_125323_1242da82-d705-4bec-83f4-2acfc357b38c.png',
    previewUrl: BASE + 'hf_20260713_125326_94438fa2-9760-4981-b058-205ea2623e2f.png',
  },
  {
    key: 'reading-bucket-list',
    title: 'My Reading Bucket List', emoji: '📚', kind: 'bucket',
    stages: [1, 2, 3], minutes: 'A month of stories', setting: 'anywhere', skill: 'Reading',
    stars: 5,
    blurb: 'Eight ways to read: outside, to someone, about space, a book they chose themselves.',
    sheetUrl: BASE + 'hf_20260713_125341_14a3ecc6-7706-4ccf-b1ca-67eee4e9bad9.png',
    previewUrl: BASE + 'hf_20260713_125344_3aaa7475-b816-4b0b-8d3f-932fd86f48f2.png',
  },
  {
    key: 'nature-scavenger-hunt',
    title: 'Nature Scavenger Hunt', emoji: '🍃', kind: 'hunt',
    stages: [1, 2], minutes: '45 minutes', setting: 'outdoors', skill: 'Attention',
    stars: 5,
    blurb: 'Take it on a walk. A feather, a snail, a funny shaped cloud. Look, spot, colour.',
    sheetUrl: BASE + 'hf_20260713_125401_9fc5d6aa-042a-4c2c-906c-495d1a71b442.png',
    previewUrl: BASE + 'hf_20260713_125404_e98b9bff-4d58-43e9-976f-8e7704586b31.png',
  },
  {
    key: 'family-challenge-list',
    title: 'Family Challenge List', emoji: '🏆', kind: 'challenge',
    stages: [1, 2, 3, 4], minutes: 'A few weekends', setting: 'anywhere', skill: 'Family time',
    stars: 5,
    blurb: 'Done together or not at all: game night, a screen free evening, a walk somewhere new.',
    sheetUrl: BASE + 'hf_20260713_125421_89d1c68e-fb50-4046-8a9c-d33bbfa4759c.png',
    previewUrl: BASE + 'hf_20260713_125425_decdd972-db44-4eb1-9b37-56ea142bee1d.png',
  },
]

export function getPrintable(key: string): Printable | null {
  return PRINTABLES.find(p => p.key === key) ?? null
}

export function printablesForStage(stageId: number | null | undefined): Printable[] {
  const stage = stageId && stageId >= 1 && stageId <= 5 ? stageId : 2
  return PRINTABLES.filter(p => p.stages.includes(stage))
}
