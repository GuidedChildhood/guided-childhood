// DiGi's voice, reading the say this line of a script aloud.
//
// The script reader and the Right Now rescue play this recording when one
// exists for the script, and fall back to the device voice when it does not.
// One character voice owns all spoken audio across the platform, the
// Duolingo pattern: DiGi teaches, DiGi reads, DiGi coaches.
//
// English, not American. The first set of these was generated on the Skye
// preset, which is American, and it read DiGi with an American vowel that is
// simply not how the name sounds here. Every line was regenerated on Imogen,
// a warm English female voice, which is also what lib/voice/english-voice.ts
// asks the browser for when there is no recording to play. One accent, whether
// the words come from a file or the device.
//
// Regenerating in a different voice is one batch and a rewrite of this map,
// never a code change. Served from the generation CDN for now; these are the
// only assets left hotlinked after the art was vendored into public/art, and
// they want the same treatment once there is somewhere sensible to put fifty
// megabytes of audio. Keyed by the script sort_order (the id in the URL
// /dashboard/scripts/<sort_order>).

export const SCRIPT_VOICE: Record<number, string> = {
  1: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123053_91ba1093-6f95-4880-9f95-a00ce3d063a6.wav', // First device moment
  2: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123154_93b54859-f095-4831-b021-822939847a17.wav', // Meltdown when screen time ends
  3: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123155_29e78593-1f7f-408a-87e6-32b4b33539e4.wav', // Asking for their own phone
  4: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123157_a8af5f17-b5b2-4c74-8df3-c2eb4ab801ed.wav', // First social platform request
  5: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123158_dc605e32-fb72-4fee-a6d6-21e9371ce629.wav', // Gaming going over time
  6: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123159_06594a2f-34c4-493e-a8b2-b6b6b2a9d9ee.wav', // Asking to watch YouTube unsupervised
  7: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123201_25f7ed2a-7c7c-46c9-ba55-80e2f08c5415.wav', // The social media ask
  8: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123247_bdc4377a-ac0a-4dc3-a0c2-26b3124c1cad.wav', // Mood change after phone use
  9: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123248_a4c19a1b-9de3-4bc1-ac73-dfa6212173b3.wav', // Screenshot and group chat incident
  10: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123249_07fdcec1-10df-47a4-8ee1-7d9cd7d4e562.wav', // Refusing to come off their phone
  11: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123250_c3bf5b2d-b0e2-45bb-ad81-c0b629dc61a3.wav', // Social media causing anxiety
  12: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123252_68bc3d01-9d3b-4953-b1cb-c42e571d8992.wav', // Late night device use
  13: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123309_cdee75ee-694a-40fe-873d-8ecef6bc409a.wav', // Content causing distress
  14: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123424_d73170de-68b8-4e46-af40-0455d03d95d3.wav', // Your online footprint and your future
  15: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123425_af2ff2db-5626-489a-a3ad-b44c92063143.wav', // Phone-free conversation
  16: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123426_01e99037-467a-4a8d-b0b1-e94ccf0793ae.wav', // Family agreement conversation
  17: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123316_21f6dbb9-757a-4198-ad7e-11e97c9d33a6.wav', // The ban conversation
  101: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123427_650e5dbe-c02b-4d11-8f3c-659ba712507a.wav', // Asking for more screen time
  102: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123428_84966d46-6e2d-4e82-b584-33bc5b9b6f50.wav', // Screens before bed
  103: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123535_878b33cc-a93a-47f4-a9af-194bfb594f7a.wav', // Refusing to stop when time is up
  104: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123536_294c6857-a12e-41ce-8c9b-7a25cc4aba74.wav', // Screens replacing outdoor play
  105: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123538_c20d27fd-509c-4b7f-9795-fedb17f4eb8e.wav', // Sneaking screen time
  106: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123539_788947ff-c58e-496b-ba82-2df41c45da4c.wav', // Phone constantly out at meals
  107: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123540_6035d353-598c-479c-a90f-6e3e28497550.wav', // Screen time tied to mood
  108: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123650_b5c31963-07a0-4dd6-8f06-954359734c24.wav', // Homework on a device with constant distraction
  109: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123651_ea34d115-71f0-44aa-985f-f6eee9c43149.wav', // Binge watching
  110: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123652_58690fda-fdf7-4a56-8d6a-c2cc244226e0.wav', // Always on their phone, ignoring family
  111: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123653_a31d0570-0142-4a98-a1e0-8357b4dc81ec.wav', // Negotiating screen time limits
  112: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123654_e53f80eb-1503-4462-bb59-897c9aee4a97.wav', // Using screens to avoid difficult emotions
  113: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123801_c2ce4372-876e-4274-8fd9-463dd426a1ee.wav', // Comparing screen time to friends' limits
  114: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123803_4f66538e-c635-4ac1-8603-a0bc83ccfac2.wav', // Managing their own screen time as a young adult
  115: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123804_5f192143-f2ad-4520-b5ed-ded8cfbb8336.wav', // Late night phone use affecting sleep
  116: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123805_28d05afa-b280-4c7d-973f-d65970921099.wav', // Learning versus entertainment
  117: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123806_0420dea9-37ef-4d25-9feb-52853e5a1937.wav', // The game their friends play
  201: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123916_c2b32450-1957-4083-9613-085fc096b241.wav', // Getting their first console
  202: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123917_5d777f13-5198-421f-acbe-102c4571ae5c.wav', // Gaming instead of homework
  203: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123918_3a766983-3fea-4a9b-8409-194d7d1465a0.wav', // Aggressive behaviour after gaming
  204: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123920_13d3efb6-f51e-4cfe-8eac-16311756c5ba.wav', // Online gaming with strangers
  205: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_123921_0d95eef7-025a-4eb8-a734-307597c47113.wav', // Requests for in-game purchases
  206: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124028_6549b3e2-8a7d-491a-8135-54ff3c396a4a.wav', // Gaming until very late
  207: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124029_9f794070-fb4a-40f8-aae7-94a9b7221876.wav', // Online gaming friends they have never met
  208: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124031_c601d05c-806d-4d85-8fee-154e0fa9f78f.wav', // Losing badly and getting angry
  209: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124031_583d9230-a3e2-419d-b9e3-bcdb912269bf.wav', // Obsessive gaming, nothing else matters
  210: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124033_f62c2281-bf82-4a2d-a22c-a9514a4906e7.wav', // Gaming culture and toxic masculinity
  211: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124143_1800465f-b267-40b2-94fe-b8d2ee240ae0.wav', // Gambling mechanics in games
  212: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124144_601969fa-8896-4f53-8841-96cd7a272583.wav', // Serious esports ambitions
  213: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124146_33413395-42c5-4da0-a851-eb7005138a6e.wav', // Gaming to cope with anxiety
  214: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124147_56f7489b-67f3-40a3-b2d1-7847cc976f74.wav', // Healthy gaming versus addiction
  215: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124148_ad26641d-1651-4488-8689-dba3d5558b11.wav', // Gaming affecting university or work
  216: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124255_98ffd9be-df00-4636-803c-84bce452f8c2.wav', // Devices and sleep
  217: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124256_13ab793b-d8b5-4211-aafa-f5b9affb38f3.wav', // Early body image messages from media
  301: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124257_4380ed01-f623-4465-8f45-44bdbb73b76d.wav', // Too young for a first social media account
  302: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124259_ddf22021-416f-461e-9e52-e3f1b1305905.wav', // Asking for Instagram at twelve
  303: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124300_8615a417-37cb-4ef1-8ae5-18c092cf6357.wav', // Comparing followers and likes
  304: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124412_014fe055-515a-43cd-a33e-58d1f24e303e.wav', // Posting content they might regret
  305: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124414_15db5728-c5bd-47b3-a8b5-1ff4f9e2a9fb.wav', // Seeing something upsetting on TikTok
  306: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124415_52b0812f-9206-45c8-be2d-c49d530f309b.wav', // Following people they do not know
  307: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124416_b317d0bc-d0c3-45f0-bdd6-915de067cb9c.wav', // Social media affecting sleep
  308: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124417_27b53f1c-1bdf-4ae3-88db-c0896cadba49.wav', // Performing for social media rather than living
  309: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124524_c424dbcf-8a5c-49c9-b6e0-1cbf05022763.wav', // Being caught in an online pile-on
  310: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124525_3d8b17b1-3f2a-48c7-b56c-c6f874366392.wav', // Fear of missing out driven by social media
  311: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124527_45ca8fe6-d760-4234-9d18-c4b8bd076456.wav', // Sexting or pressure to share images
  312: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124528_a02688f9-2b4d-45c2-8e21-2c6c27a13821.wav', // Influencer culture and unrealistic standards
  313: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124530_9c35f758-f46a-4fc6-82f6-62da6a6c46ed.wav', // Privacy settings and what to share
  314: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124640_aedc6063-ff8a-428b-b703-ef86b917047a.wav', // Using social media to cope with loneliness
  315: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124641_c8f4a856-4662-4de4-b0ab-fdf3992c32da.wav', // Social media and political radicalisation
  316: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124642_f0e0988a-fa5e-4917-b6eb-18834781a71f.wav', // Social media and mental health awareness
  317: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124644_1c62736e-7980-4c97-974b-46712f46ef27.wav', // Building a positive online presence
  318: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124645_cd52a5e3-ee9b-46a7-9066-bf8509e0f5cf.wav', // Recognising algorithm manipulation
  319: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124754_222a0f1f-27f6-491e-9078-ce5c440b43e7.wav', // Social media for mental health versus escapism
  320: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124755_4fd21cf7-3711-404d-a948-f0d86bd29454.wav', // Social media fast or digital detox
  401: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124757_f1cccaa0-7e77-4eca-8c6e-9ca8366bcee7.wav', // Strangers online
  402: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124758_246fbd0d-39f7-4191-8a80-145a3e660763.wav', // Clicking suspicious links
  403: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124800_77a6e26e-6580-4de5-b77c-cb5a3cfd4dc6.wav', // Sharing personal information
  404: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124910_7f462956-9171-4fbe-8d88-e36e64f011e4.wav', // Someone asking to meet in person
  405: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124911_7f1a4bbe-0a76-436a-bb99-436519fc8fe4.wav', // Recognising grooming warning signs
  406: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124913_162c425a-8940-4bd2-b6fe-96bc746f3130.wav', // Password safety
  407: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124914_83b46be6-4830-4450-807f-d3ce999bd555.wav', // Screenshot culture and privacy
  408: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_124915_d11f6aef-d53d-4bc2-bd25-d5dba166539d.wav', // Deepfakes and manipulated images
  409: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125023_b7bf79e4-60c8-479d-8810-3a10f3329411.wav', // Scams targeting teenagers
  410: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125024_842343de-abfb-4e44-8489-d2a9f3caf1fa.wav', // Revenge porn and image-based abuse
  411: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125025_5b4595f6-32a2-447a-a084-a67fa6b93d69.wav', // Online predators
  412: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125027_b06cc134-9cc5-45f9-bd90-803b5e19d6a0.wav', // Privacy on dating apps
  413: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125028_37e0242e-f35a-495b-8d75-be508131706a.wav', // Digital security habits
  414: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125137_a2949403-3adc-4b06-9ca1-b836e9f73cc5.wav', // Doxxing and online harassment
  415: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125139_c92078da-5eb1-426e-afb5-3e40c5f35855.wav', // Protecting personal data
  416: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125141_60545b66-5c1a-4f67-bb40-94401fe69e0a.wav', // Spotting misinformation and manipulation
  417: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125142_73405a53-9194-47d2-87d4-4555eec4bc5e.wav', // Renegotiating the phone-free bedroom
  501: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125144_ccc010b7-a874-445b-9f11-8449ab8d6ed7.wav', // They are being bullied online
  502: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125253_023845cd-1b68-4588-a9cf-7b20de126dea.wav', // Screenshots of group chat exclusion
  503: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125254_a4d95569-ce4d-46a4-ac82-ea77ac0b872e.wav', // Someone is spreading rumours
  504: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125255_af00f5fe-9413-46bb-b62c-7541d3b7c233.wav', // They are the one doing the bullying
  505: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125257_4151eda1-5111-4ea4-8104-908f11134c2b.wav', // Pile-on in a group chat
  506: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125258_262ca5b2-8a6a-44c2-98ce-e1ca860d26a1.wav', // Revenge posting and screenshot sharing
  507: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125416_c4365757-3dd8-4222-90e6-52fa58976827.wav', // The bully is a friend in real life
  508: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125417_de6fa39f-2858-4f47-850a-d08ec9b880c3.wav', // They do not want to report it
  509: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125418_ce667da9-bfaf-449c-8709-8e3ce294eed3.wav', // The school is involved
  510: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125419_25e5ccf3-df8e-401c-8254-8ad77c6b7c2e.wav', // It has escalated to threats
  511: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125420_9fc7c6a8-6db4-4f6e-86c3-5cff83e7216b.wav', // Sleep and study balance
  512: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_125530_7316cbee-dadf-46cd-aa40-904b49013735.wav', // A mature conversation about image sharing and the law
}

export function scriptVoiceUrl(sortOrder: number): string | null {
  return SCRIPT_VOICE[sortOrder] ?? null
}
