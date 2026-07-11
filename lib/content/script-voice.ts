// Justin's own voice, reading the say this line of a script aloud.
//
// The script reader's Hear it aloud button plays this recording when one
// exists for the script, and falls back to the device voice when it does not.
// Generated in Justin's cloned voice (Higgsfield, ElevenLabs engine, the
// Justin-Claude-new voice from a denoised sample). Served from the generation
// CDN for now; the plan is to move these to our own hosting once the full set
// is signed off. Keyed by the script sort_order (the id in the URL
// /dashboard/scripts/<sort_order>).

export const SCRIPT_VOICE: Record<number, string> = {
  1: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144027_27fb8491-85d1-42ce-91ea-c28f57b2ffa8.mp3', // First device moment
  2: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144035_29de6843-e9be-4c92-bf87-6d43e0377605.mp3', // Meltdown when screen time ends
  3: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144040_ec95fbc8-9531-4975-830a-f40e7312c3dc.mp3', // Asking for their own phone
  4: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_140159_675008d1-43cf-4700-b7e6-d79ec8d0a4d6.mp3', // First social platform request
  5: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144048_9b6ed583-bd70-4d83-bf39-a736dd163dda.mp3', // Gaming going over time
  6: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144107_2042d025-51f8-4ba8-b8d2-4a214b1e1c6a.mp3', // Asking to watch YouTube unsupervised
  7: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144110_6ae25ced-9b19-4dbf-a856-ed8d6a52038d.mp3', // The social media ask
  8: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144112_0ecb26e9-0f77-4688-ace7-0d4a5492e39a.mp3', // Mood change after phone use
  9: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144115_7511978f-9764-4938-860c-1080ce464ae5.mp3', // Screenshot and group chat incident
  10: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144117_ef20e030-8115-409c-bbc0-e8abae642501.mp3', // Refusing to come off their phone
  11: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144131_9feb058a-f2a5-4006-84e1-0996bb683428.mp3', // Social media causing anxiety
  12: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144134_068e2cf7-bb27-46ed-b389-4d5899b7b24d.mp3', // Late night device use
  13: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144136_8a47bb05-366b-4d0e-a9a8-eabbf0578f87.mp3', // Content causing distress
  14: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144139_035972c6-df40-4def-a252-9c3de49bd528.mp3', // Your online footprint and your future
  15: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144141_e8a32839-9365-4f33-bf9e-20d8ab3a8587.mp3', // Phone-free conversation
  16: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144143_c38d824d-9815-4ff6-b3f9-fdcf425c36b9.mp3', // Family agreement conversation
  17: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144145_43cfa48e-38e5-4f36-9277-d94947e626b5.mp3', // The ban conversation
  101: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144503_ec7d2827-6008-4daa-b376-8cafaf9616fa.mp3', // Asking for more screen time
  102: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144505_2d7f2a93-85eb-4c58-bf21-688e2ab5d2ff.mp3', // Screens before bed
  103: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144507_d8429155-765f-4fad-9028-160720a119b6.mp3', // Refusing to stop when time is up
  104: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144510_c560a5d1-97d3-4d07-bc49-3fbebe26faa9.mp3', // Screens replacing outdoor play
  105: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144512_ded79fc2-3fa9-4477-9485-05a2c90315bf.mp3', // Sneaking screen time
  106: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144514_28ed8499-ffe8-4d2b-b028-88650d0dc4c3.mp3', // Phone constantly out at meals
  107: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144517_172644c0-ab68-4827-9a42-2ad41f092324.mp3', // Screen time tied to mood
  108: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144519_d441729c-5ce5-4ad3-8d30-eaecf30886fb.mp3', // Homework on a device with constant distraction
  109: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144522_79428e48-f2f4-4c88-9717-2df0b9ee00fd.mp3', // Binge watching
  110: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144536_3e7c4c13-fad5-4843-9aa1-e71eaaded928.mp3', // Always on their phone, ignoring family
  111: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144538_868fa03f-2990-4c59-a716-b799f02846e6.mp3', // Negotiating screen time limits
  112: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144540_be034b52-a90f-4b83-8ecd-acbb736341b2.mp3', // Using screens to avoid difficult emotions
  113: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144543_e2a5583e-4121-4860-b307-6aeb95456614.mp3', // Comparing screen time to friends' limits
  114: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144545_c45d3c31-d96d-4778-ad26-5bea978f17c0.mp3', // Managing their own screen time as a young adult
  115: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144548_63def5a6-e229-4b09-bc74-9474ac39a201.mp3', // Late night phone use affecting sleep
  116: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144551_7b592ac2-0dfd-4754-8963-a740f866878e.mp3', // Learning versus entertainment
  117: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144553_5ecedf7d-426c-48f6-a9eb-4a41fb2e5da1.mp3', // The game their friends play
}

export function scriptVoiceUrl(sortOrder: number): string | null {
  return SCRIPT_VOICE[sortOrder] ?? null
}
