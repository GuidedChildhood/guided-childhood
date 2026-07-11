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
  201: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144826_ec02712f-9ded-4125-a506-372593506674.mp3', // Getting their first console
  202: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144828_8431792f-d49a-4698-9323-cd876ace79c6.mp3', // Gaming instead of homework
  203: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144831_2140874c-27d4-42c5-8e3c-5602a2210485.mp3', // Aggressive behaviour after gaming
  204: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144835_cd6662d6-97ad-4c3f-8821-c93a00a31e67.mp3', // Online gaming with strangers
  205: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144838_a064e10d-5a34-4944-b29e-da4abbe4bc06.mp3', // Requests for in-game purchases
  206: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144840_2e920f29-bb4f-4f80-82d3-40d508c0e69a.mp3', // Gaming until very late
  207: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144843_fa442d57-428c-4158-ab03-6a74fb0b7def.mp3', // Online gaming friends they have never met
  208: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144846_4418e4e9-2d94-4363-8e74-85c86b26553a.mp3', // Losing badly and getting angry
  209: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144848_bb8c50f3-ee86-42a6-b82c-9582e6f26e64.mp3', // Obsessive gaming, nothing else matters
  210: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144850_c1e4b661-52b9-421d-8306-4087c621273c.mp3', // Gaming culture and toxic masculinity
  211: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144853_20ccb6f5-4e2a-42ec-8df6-f9649f849847.mp3', // Gambling mechanics in games
  212: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144855_de6e4685-d349-49b4-9369-76cf3883ce7e.mp3', // Serious esports ambitions
  213: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144858_842e0a6e-479d-4ecf-98b0-8ba592d7ffcd.mp3', // Gaming to cope with anxiety
  214: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144900_4e6a3b95-44d4-4571-99a8-7b79f21e6b71.mp3', // Healthy gaming versus addiction
  215: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144903_ccedb76f-61f0-4555-98a1-836ce8803640.mp3', // Gaming affecting university or work
  216: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144906_7e540e98-efb7-4e89-a3d5-9ad75e568734.mp3', // Devices and sleep
  217: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_144909_c578ac94-e2b5-4a52-ae28-37cf1b79137a.mp3', // Early body image messages from media
  301: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145102_8d97387a-f565-432c-b89e-7f70397b3fd2.mp3', // Too young for a first social media account
  302: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145107_e0034677-ffb1-4006-a623-974eaf4fa8ca.mp3', // Asking for Instagram at twelve
  303: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145109_340347c0-51b0-4ab8-87c6-5e715688796d.mp3', // Comparing followers and likes
  304: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145111_682290bd-6ce8-4b25-be9a-26095708b81b.mp3', // Posting content they might regret
  305: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145113_8c2ea389-243c-431d-a49c-6363906a7bcf.mp3', // Seeing something upsetting on TikTok
  306: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145115_0cc7f4bf-5fb1-4986-8da3-20bc0ed71933.mp3', // Following people they do not know
  307: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145118_e17ece08-4207-45a1-9e30-09718eb7a762.mp3', // Social media affecting sleep
  308: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145120_6801eed4-cad8-47dd-9b13-c310cbba6462.mp3', // Performing for social media rather than living
  309: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145122_f2afeba6-b3e6-4c8e-ad59-98555bf5c362.mp3', // Being caught in an online pile-on
  310: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145125_ce8d6c54-2eac-410a-9da5-6584cf71ef65.mp3', // Fear of missing out driven by social media
  311: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145127_b34c2f32-9ce2-4492-a83c-cc29c2e95b50.mp3', // Sexting or pressure to share images
  312: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145129_fa7cbb4e-fde3-459b-ab03-c87bb12b96bf.mp3', // Influencer culture and unrealistic standards
  313: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145132_b1d1fabd-42bd-4483-8890-0ebc2d7fa30e.mp3', // Privacy settings and what to share
  314: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145135_1a6b882c-84de-436a-8ef5-106cc829cd0e.mp3', // Using social media to cope with loneliness
  315: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145137_0e4f9cfe-cc7d-4253-9246-8d3cd5dbe8d2.mp3', // Social media and political radicalisation
  316: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145140_ee9ac8bb-2671-4d16-b2e0-d088db9621fb.mp3', // Social media and mental health awareness
  317: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145142_37080632-2a57-4a21-b920-186f2011fce4.mp3', // Building a positive online presence
  318: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145144_491071e4-57c9-4ca3-96a9-600c98d8c168.mp3', // Recognising algorithm manipulation
  319: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145146_4399cd77-ef57-4dee-90b3-49ceddade848.mp3', // Social media for mental health versus escapism
  320: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_145149_cfba078f-7fab-40ee-974c-23b53fa8f278.mp3', // Social media fast or digital detox
}

export function scriptVoiceUrl(sortOrder: number): string | null {
  return SCRIPT_VOICE[sortOrder] ?? null
}
