// Real photo tiles for the moment cards. Generated on Higgsfield in one warm
// no people lifestyle style, served from the same cloudfront CDN as the
// homepage stage photos (allowed in next.config). Every moment title maps to
// a tile here, so a card never falls back to an emoji.

const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'

export const MOMENT_PHOTOS: Record<string, string> = {
  shoes_door:          BASE + 'hf_20260709_142536_149fd280-0c12-479d-a171-7c08d4d4d5cb.png',
  tablet_sofa:         BASE + 'hf_20260709_142544_1bd89b80-f7ad-47b1-9aee-00d3999857f3.png',
  bed_morning:         BASE + 'hf_20260709_151840_d75acb9e-5198-4e0e-8605-b494de20a9fe.png',
  tv_remote:           BASE + 'hf_20260709_151853_46b69b55-8cfb-46c6-8b6e-c053f19d9642.png',
  phone_table:         BASE + 'hf_20260709_151908_67c0dd0b-5567-46cc-8dc5-3d4532aa7534.png',
  uniform:             BASE + 'hf_20260709_151910_9396e814-37df-48b3-9a03-871813b968ee.png',
  breakfast:           BASE + 'hf_20260709_151911_b07e15f2-59ef-405f-8dd3-87768079651f.png',
  teeth:               BASE + 'hf_20260709_151914_70b929d7-da6c-40e1-a0c0-b7178ec1365d.png',
  smartphone:          BASE + 'hf_20260709_151915_72312dc6-234d-4c54-9641-265ec872a1d1.png',
  social_phone:        BASE + 'hf_20260709_151917_47d961e8-2a77-4c28-9f9d-f47287f8415c.png',
  gaming:              BASE + 'hf_20260709_151919_69d7d356-bc0b-45ab-9b30-c9ad1ba940d8.png',
  phone_dark_bed:      BASE + 'hf_20260709_151920_fd0d8c5b-2a54-40f5-a498-44f4fd8a774e.png',
  phone_notifications: BASE + 'hf_20260709_151940_a0c362b4-e68d-4b50-a6ef-5cd74a5904b0.png',
  homework:            BASE + 'hf_20260709_151942_5dd5d92b-74dc-4f65-be20-b99b9d091b51.png',
  exam:                BASE + 'hf_20260709_151944_4c8c2d0e-7643-46ff-ba9e-9b552d866fdd.png',
  sports_bag:          BASE + 'hf_20260709_151945_646becef-6062-4363-8732-1f6850e95d4d.png',
  dinner_plate:        BASE + 'hf_20260709_151947_456053df-f023-4135-b478-db340e4f4186.png',
  lunchbox:            BASE + 'hf_20260709_151949_6fb63bca-faaf-4fbd-8554-e710e867ac3e.png',
  bedtime_lamp:        BASE + 'hf_20260709_151950_c25d437d-8272-458a-b077-023d1ed2c7bd.png',
  night_bed:           BASE + 'hf_20260709_151952_9aedb6f9-53f7-4141-b306-eed2883847c2.png',
  moving_boxes:        BASE + 'hf_20260709_151954_4239283e-2ba5-4902-93d7-e780c601e80e.png',
  overnight_bag:       BASE + 'hf_20260709_151955_c438d429-3e09-4160-9003-8ca62e327de3.png',
  board_game:          BASE + 'hf_20260709_151957_10bbafcb-2120-46be-9975-d4589940260c.png',
  laptop_open:         BASE + 'hf_20260709_151959_cd0a3c82-5084-4b5a-b866-a6eb775c3e6b.png',
  two_mugs:            BASE + 'hf_20260709_152001_35f29b02-c209-4eed-8047-53c63676edab.png',
  closed_door:         BASE + 'hf_20260709_152002_a7ef5ac7-aabd-44a4-bade-87939cc1f92d.png',
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
