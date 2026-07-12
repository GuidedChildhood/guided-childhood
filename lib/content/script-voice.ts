// DiGi's voice, reading the say this line of a script aloud.
//
// The script reader and the Right Now rescue play this recording when one
// exists for the script, and fall back to the device voice when it does not.
// One character voice owns all spoken audio across the platform, the
// Duolingo pattern: DiGi teaches, DiGi reads, DiGi coaches. Generated with
// the Alistair preset on the Higgsfield seed audio engine; regenerating in a
// different voice is one batch and a rewrite of this map, never a code
// change. Served from the generation CDN for now; the plan is to move these
// to our own hosting later. Keyed by the script sort_order (the id in the
// URL /dashboard/scripts/<sort_order>).

export const SCRIPT_VOICE: Record<number, string> = {
  1: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104042_28d3cb15-f042-4e51-8135-dfc082625a02.wav', // First device moment
  2: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104045_14df6b6e-8930-48a3-9646-968e8b033c1a.wav', // Meltdown when screen time ends
  3: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104050_a92da182-a20e-437a-b985-813ed314322f.wav', // Asking for their own phone
  4: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104053_4614c23e-5ce4-499f-84c0-f54951678645.wav', // First social platform request
  5: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104058_5fbb1101-bf60-4e92-b883-242c144694a4.wav', // Gaming going over time
  6: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104125_5bc944be-26a2-4314-8617-02c5be446736.wav', // Asking to watch YouTube unsupervised
  7: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104130_d6e0b1a3-8960-4b59-af01-a41fadef7f32.wav', // The social media ask
  8: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104133_71632a45-cafc-4554-b9bc-2ef44246000e.wav', // Mood change after phone use
  9: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104141_a37fa29d-43be-4459-b354-53976df74222.wav', // Screenshot and group chat incident
  10: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104144_aea12031-3784-49b7-a78b-e16835eb4945.wav', // Refusing to come off their phone
  11: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104211_81757608-3214-4d35-9815-9115a8d80439.wav', // Social media causing anxiety
  12: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104213_5670aaba-2db6-4188-a991-e4f9271cc59f.wav', // Late night device use
  13: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104220_4660c478-b626-49fa-9825-20e18d4b4ac4.wav', // Content causing distress
  14: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104223_90dbe275-5e15-4a09-a63d-8c4f798ba183.wav', // Your online footprint and your future
  15: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104227_b8c251ba-4886-41a3-a936-ba5461291b82.wav', // Phone-free conversation
  16: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104252_cc6901f5-bcfd-4561-8be9-9a4194116d42.wav', // Family agreement conversation
  17: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104254_4255a679-59b4-4de4-a595-3101c738ddfb.wav', // The ban conversation
  101: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104256_ce6836ec-c383-49c3-98fd-5cda1df46071.wav', // Asking for more screen time
  102: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104303_b3daa54e-8b82-4058-ad99-b0d97dea7948.wav', // Screens before bed
  103: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104310_2dcd1a18-36fe-4dec-bf4a-f56c446bf0df.wav', // Refusing to stop when time is up
  104: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104334_d338805d-1467-42c4-9791-74904587b4a6.wav', // Screens replacing outdoor play
  105: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104339_b8c56e60-c65b-4bb1-bbb9-b02b70193d61.wav', // Sneaking screen time
  106: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104342_5ec347ca-1841-4692-974b-e0d0bd799aa3.wav', // Phone constantly out at meals
  107: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104344_ce6f32d8-9518-4372-9eb4-a86c30332391.wav', // Screen time tied to mood
  108: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104346_005f582c-b4ef-46f5-8353-d8b950a00035.wav', // Homework on a device with constant distraction
  109: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104416_20770f38-147d-418c-92d4-da6f5357cf62.wav', // Binge watching
  110: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104419_041d1183-9936-4e36-8e82-3fd534bd50da.wav', // Always on their phone, ignoring family
  111: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104421_1c6db202-fd2d-4bc3-8ecd-a471ed83e319.wav', // Negotiating screen time limits
  112: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104423_961349c7-3d34-4795-8fcc-5de1feb0574a.wav', // Using screens to avoid difficult emotions
  113: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104425_30fb4fe7-073d-4826-acd0-6f01c727e540.wav', // Comparing screen time to friends' limits
  114: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104452_4991bce0-c1ee-4d8e-bbf8-2755249a4173.wav', // Managing their own screen time as a young adult
  115: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104456_8674eeb0-b938-41b9-bed3-261557e725ad.wav', // Late night phone use affecting sleep
  116: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104458_5d246f26-741d-41fa-8b9d-201f520d4d78.wav', // Learning versus entertainment
  117: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104500_6f519199-f22d-4da8-8e5e-532920b4135c.wav', // The game their friends play
  201: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104502_9d14c277-4de1-4d53-92e0-fd2199eac91d.wav', // Getting their first console
  202: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104526_8b276389-1db3-4b22-947f-cb73d877d345.wav', // Gaming instead of homework
  203: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104529_ca07115d-09a0-4f63-b296-ef55011a228c.wav', // Aggressive behaviour after gaming
  204: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104531_dbaae110-07b8-47c2-b60b-ad5910980a59.wav', // Online gaming with strangers
  205: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104533_d18163ec-25d5-4c26-a72b-1c88855de314.wav', // Requests for in-game purchases
  206: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104536_4c92f5b1-14ea-4c76-824a-ff0a02b4abd4.wav', // Gaming until very late
  207: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104619_ba9812a3-3238-49e0-a2a1-82054d38ab9f.wav', // Online gaming friends they have never met
  208: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104625_193967ff-6542-46a7-b3bf-55ce23251b1b.wav', // Losing badly and getting angry
  209: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104628_5a74b37a-a2b4-4ff3-ae1e-759cef334dbb.wav', // Obsessive gaming, nothing else matters
  210: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104630_38c22b1d-74b3-4876-9fcd-d66c53292165.wav', // Gaming culture and toxic masculinity
  211: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104635_0c6f14e3-a85a-4c72-a0c5-5af8ce036f24.wav', // Gambling mechanics in games
  212: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104703_f99b5ac2-63f2-48a6-8200-628cbf1033b9.wav', // Serious esports ambitions
  213: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104705_3995a422-066e-47e5-a6f9-cdef90e6f2b5.wav', // Gaming to cope with anxiety
  214: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104712_e6de06c6-c108-48e7-aa78-d3bcf649ae12.wav', // Healthy gaming versus addiction
  215: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104717_e989212a-6be5-480b-b3cf-97842c395178.wav', // Gaming affecting university or work
  216: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104719_e010703d-1ace-455a-90bb-362fa1f60ad5.wav', // Devices and sleep
  217: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104738_56ab1b49-0eed-45ac-af33-7bfff6a86d56.wav', // Early body image messages from media
  301: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104742_9c3e0034-3f4c-4c04-a319-89bfd5d4e5ef.wav', // Too young for a first social media account
  302: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104745_ba8ba045-c72e-4a66-b47f-40cd7b8bc1f6.wav', // Asking for Instagram at twelve
  303: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104749_198b074f-a0b6-4208-adf9-274336027045.wav', // Comparing followers and likes
  304: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104751_ba1dc303-e053-452a-929e-e0d01f4eff5b.wav', // Posting content they might regret
  305: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104813_6a2f5b4b-9b57-4639-84f3-8822ce7b4ffa.wav', // Seeing something upsetting on TikTok
  306: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104819_14ece1b9-7d49-40ba-b37f-9fe3390fd666.wav', // Following people they do not know
  307: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104822_209876a6-88ca-4557-94e1-6190552fc51c.wav', // Social media affecting sleep
  308: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104824_dc34e1be-d19d-4f34-9f3c-218c7138826e.wav', // Performing for social media rather than living
  309: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104826_6aceddd3-d1a3-4985-ae29-9fae8cb49409.wav', // Being caught in an online pile-on
  310: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104900_05379563-b963-440f-8dbf-95f95f5f3a80.wav', // Fear of missing out driven by social media
  311: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104902_a511fb3c-5533-4811-b13e-d4b26daf1732.wav', // Sexting or pressure to share images
  312: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104905_d5dc1f5f-3184-45a6-9ece-78032936665c.wav', // Influencer culture and unrealistic standards
  313: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104907_0e066973-f96c-4bf6-b41d-7f9a79a8f1ae.wav', // Privacy settings and what to share
  314: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104909_4222f46f-87e5-422a-81be-b0dc96891482.wav', // Using social media to cope with loneliness
  315: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104929_e1322cb1-1287-4ca8-9796-f49408e97551.wav', // Social media and political radicalisation
  316: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104937_3093d885-d70e-440f-a307-46aae64cd135.wav', // Social media and mental health awareness
  317: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104940_d334dbf4-5678-47e5-948a-0319c6cf19b4.wav', // Building a positive online presence
  318: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104942_df05b27b-2e2a-4aaa-a2d3-59e47e47abc4.wav', // Recognising algorithm manipulation
  319: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_104948_be2f0534-0a70-477c-80d7-32cca543a740.wav', // Social media for mental health versus escapism
  320: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105014_3889cbb1-f02f-42fb-8638-5c79ffa375d7.wav', // Social media fast or digital detox
  401: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105016_188d5049-69d9-43af-bced-2129e20075e8.wav', // Strangers online
  402: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105020_4f17f5bd-0ca4-4422-82b4-121b97e8bbeb.wav', // Clicking suspicious links
  403: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105022_b46fd912-fc93-41e9-af64-ac7a5ba20caf.wav', // Sharing personal information
  404: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105024_3078e57e-b9dc-49af-a5c7-9c69b08037a3.wav', // Someone asking to meet in person
  405: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105049_868b8723-5a7d-4592-a4cb-89af2e75eb17.wav', // Recognising grooming warning signs
  406: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105052_980ea9fa-1f5e-47b1-8a3c-b668792d3bf3.wav', // Password safety
  407: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105054_8d9b9901-6763-4076-bfca-cc656c4ff470.wav', // Screenshot culture and privacy
  408: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105058_5aa2eb09-b480-4b78-acd3-c2e7b88cd468.wav', // Deepfakes and manipulated images
  409: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105101_0eb96769-2348-469c-9b5a-f139e19c7b89.wav', // Scams targeting teenagers
  410: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105126_e2e59201-53b2-41ea-9dc3-4ae0dd030417.wav', // Revenge porn and image-based abuse
  411: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105128_ca3676e2-2157-44ea-be3b-0848df3011a3.wav', // Online predators
  412: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105134_fd0b685b-f04b-4254-a752-1748b7def042.wav', // Privacy on dating apps
  413: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105136_5991b87d-1b4d-4f1d-95a2-fd01d3261fc0.wav', // Digital security habits
  414: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105139_c0b9c720-cf26-4f02-970b-9307e48f05be.wav', // Doxxing and online harassment
  415: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105204_03556bdb-a662-4936-83f7-71243d0e31a5.wav', // Protecting personal data
  416: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105208_1d6692bf-d718-4b93-86c4-bbe28ce88d76.wav', // Spotting misinformation and manipulation
  417: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105211_7a7ca4d9-7bc2-4ade-a602-5fa8c27275db.wav', // Renegotiating the phone-free bedroom
  501: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105214_4b434af5-262c-48ec-90f3-d6d5af73f1bb.wav', // They are being bullied online
  502: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105216_be772754-1069-4d0a-8636-f4997f63572c.wav', // Screenshots of group chat exclusion
  503: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105242_554547da-6bdc-4629-855e-199a22c9fbd5.wav', // Someone is spreading rumours
  504: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105245_8672e69d-242e-4ff7-8da0-0f429e48c43c.wav', // They are the one doing the bullying
  505: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105248_2bbbbf86-292c-42a7-91b8-dc834319b944.wav', // Pile-on in a group chat
  506: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105250_a93b46b7-b129-4303-9cb9-6932941844a6.wav', // Revenge posting and screenshot sharing
  507: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105253_008bee4d-fc49-4f35-ad12-47cb19f6dabc.wav', // The bully is a friend in real life
  508: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105314_2b53a30a-d7e8-4551-a0a3-4196d3562668.wav', // They do not want to report it
  509: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105317_cf07200e-55b2-4197-976c-1a8e9ab6485b.wav', // The school is involved
  510: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105320_cf7e8f8b-c2ab-4a8d-8f5f-f52237584b65.wav', // It has escalated to threats
  511: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105322_76d45432-fb80-4d96-be98-be882d030b62.wav', // Sleep and study balance
  512: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_105325_92645f87-4b52-43e6-8362-32613bc284fc.wav', // A mature conversation about image sharing and the law
}

export function scriptVoiceUrl(sortOrder: number): string | null {
  return SCRIPT_VOICE[sortOrder] ?? null
}
