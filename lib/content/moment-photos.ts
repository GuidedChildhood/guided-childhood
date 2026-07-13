// Illustrated tiles for the moment cards: one warm hand drawn picture book
// style across the set (12 July 2026 batch), because photos die at 84px and
// flat art reads instantly. Served from the cloudfront CDN allowed in
// next.config. Every moment title maps to a tile, never an emoji fallback.
// Restyle later = one Higgsfield batch + swap these URLs, never a code change.

const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'

export const MOMENT_PHOTOS: Record<string, string> = {
  shoes_door:           BASE + 'hf_20260712_195640_c3a311b2-e805-4084-9516-17c5cfe49cd7.png',
  tablet_sofa:          BASE + 'hf_20260712_195641_ad5279ce-73f5-4455-98ec-3c4397dc80f7.png',
  bed_morning:          BASE + 'hf_20260712_195522_9efc8c47-00fc-48b1-980e-80b14282cd99.png',
  tv_remote:            BASE + 'hf_20260712_195608_c76bf013-2af1-465e-b738-b671beb07995.png',
  phone_table:          BASE + 'hf_20260712_195649_74e650d8-1cfa-47c5-a11f-6d78f291f3e9.png',
  uniform:              BASE + 'hf_20260712_195532_9c239412-7636-447c-bfdd-1e46c2b0f711.png',
  breakfast:            BASE + 'hf_20260712_195651_974230c7-cea5-4a6d-8fee-a701c836dbb5.png',
  teeth:                BASE + 'hf_20260712_195230_c72a633f-c475-44ec-9807-72b73a55067f.png',
  smartphone:           BASE + 'hf_20260712_195702_bb1b1b3d-57f7-4c45-b346-77b17901c64c.png',
  social_phone:         BASE + 'hf_20260712_195704_448dfd4c-90f6-49f6-8fcc-d8fc4bc19f20.png',
  gaming:               BASE + 'hf_20260712_195232_a89d2990-1ae2-4faf-9f25-24a6ce8ac899.png',
  phone_dark_bed:       BASE + 'hf_20260712_195716_a0080796-1751-4b09-9b2c-6eb2a5ed96dc.png',
  phone_notifications:  BASE + 'hf_20260712_195718_4da016a1-de16-4539-995b-0046a12e9c39.png',
  homework:             BASE + 'hf_20260712_195617_8549b253-7fd5-42cf-a5b2-5b10e77f51f6.png',
  exam:                 BASE + 'hf_20260712_195727_81f84ea2-99a5-4a8a-9f32-b38793f0c7f4.png',
  sports_bag:           BASE + 'hf_20260712_195533_c352c366-cbe4-4e9d-9d94-fcb3b0abfd03.png',
  dinner_plate:         BASE + 'hf_20260712_195606_8e50d8a3-fad4-4379-afd7-b24df34d6513.png',
  lunchbox:             BASE + 'hf_20260712_195544_426e0356-48e9-430a-a82a-5e9dd1ca7c3a.png',
  bedtime_lamp:         BASE + 'hf_20260712_195628_1bbd76a4-02cd-4793-bbdd-c7ee4c609ac4.png',
  night_bed:            BASE + 'hf_20260712_195630_048877a9-a9ed-4168-b3aa-750694b07b44.png',
  moving_boxes:         BASE + 'hf_20260712_195729_0411669f-15b7-4ebc-996f-80e61b8ca2cc.png',
  overnight_bag:        BASE + 'hf_20260712_195739_330b76ad-411a-495b-9467-241f155936eb.png',
  board_game:           BASE + 'hf_20260712_195740_c97259f6-c156-4481-9e85-d266de88714b.png',
  laptop_open:          BASE + 'hf_20260712_195801_7ebe6c72-e96f-45f7-9af5-60d1f5165158.png',
  two_mugs:             BASE + 'hf_20260712_195749_3a134594-53b8-4807-9336-71a0ec97cd8a.png',
  closed_door:          BASE + 'hf_20260712_195751_08c58628-9d2f-47b7-95ba-c2976058b790.png',
}

// Title to tile, most specific patterns first so the right photo wins. Covers
// every one of the seeded moment cards across all nine categories.
const TITLE_TO_PHOTO: [RegExp, keyof typeof MOMENT_PHOTOS][] = [
  // Parent support first, so parental guilt does not match the emotions guilt
  [/shouting|failure as a parent|as a parent|mental health|parent burnout/i, 'two_mugs'],

  // Digital and phone specifics
  [/first smartphone|smartphone decision|first phone/i, 'smartphone'],
  [/phone before school/i, 'phone_table'],
  [/dinner table phone|phone at (the )?(dinner|table)/i, 'phone_table'],
  [/tiktok|instagram|influencer|self.?worth|social media/i, 'social_phone'],
  [/group chat|friendship fallout|friend/i, 'phone_notifications'],
  [/screen time limit/i, 'tv_remote'],
  [/morning tv|tv battle/i, 'tv_remote'],
  [/youtube|passive viewing/i, 'tablet_sofa'],
  [/gaming/i, 'gaming'],
  [/mood crash|secretive phone|bedroom rule|put the phone down/i, 'phone_dark_bed'],
  [/deepfake|ai content|stranger danger|online stranger/i, 'laptop_open'],

  // School
  [/homework/i, 'homework'],
  [/exam|revision|study/i, 'exam'],
  [/school refusal|school anxiety|morning meltdown/i, 'shoes_door'],
  [/won't tell you about school|about school/i, 'closed_door'],
  [/clubs|activities|sport/i, 'sports_bag'],

  // Morning
  [/get out of bed|out of bed/i, 'bed_morning'],
  [/dressed|uniform|clothes/i, 'uniform'],
  [/breakfast/i, 'breakfast'],
  [/teeth|brush/i, 'teeth'],

  // Food
  [/packed lunch|lunch/i, 'lunchbox'],
  [/snack/i, 'lunchbox'],
  [/dinner|picky eating|won't eat/i, 'dinner_plate'],

  // Evening and sleep
  [/nighttime anxiety|night.*worry|bedtime/i, 'bedtime_lamp'],
  [/overtired|staying up|too late|sleep/i, 'night_bed'],

  // Transitions
  [/moving school|moving|new house/i, 'moving_boxes'],
  [/grandparent|holiday|separated family|divorce/i, 'overnight_bag'],
  [/new sibling|sibling/i, 'night_bed'],

  // Emotions
  [/losing|anger|tantrum|outburst|jealous/i, 'board_game'],
  [/anxiety|worry/i, 'night_bed'],
  [/low mood|sad|shy|withdrawal|won't talk|feelings|guilt|shame/i, 'closed_door'],

  // Any remaining phone or screen mention
  [/phone|screen/i, 'phone_dark_bed'],
]

export function momentPhotoForTitle(title: string): string | null {
  const hit = TITLE_TO_PHOTO.find(([re]) => re.test(title))
  return hit ? MOMENT_PHOTOS[hit[1]] : null
}
