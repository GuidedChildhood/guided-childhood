// DiGi's voice, reading the say this line of a script aloud.
//
// The script reader and the Right Now rescue play this recording when one
// exists for the script, and fall back to the device voice when it does not.
// One character voice owns all spoken audio across the platform, the
// Duolingo pattern: DiGi teaches, DiGi reads, DiGi coaches. Generated with
// the Skye preset on the Higgsfield seed audio engine, the same voice the
// lessons use; regenerating in a different voice is one batch and a rewrite
// of this map, never a code change. Served from the generation CDN for now;
// the plan is to move these to our own hosting later. Keyed by the script
// sort_order (the id in the URL /dashboard/scripts/<sort_order>).

export const SCRIPT_VOICE: Record<number, string> = {
  1: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_110820_9fe4d7fe-3aee-4ea0-858a-412f2728abd7.wav', // First device moment
  2: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_110822_7ffc4997-1bcb-45ee-a8fd-c1043c493264.wav', // Meltdown when screen time ends
  3: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_110825_2c0b6c3b-b328-49de-8498-96ae86c7c5a9.wav', // Asking for their own phone
  4: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_110827_1c95193a-eceb-4df8-b52e-4ddfb691ed18.wav', // First social platform request
  5: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_110829_1f1caa0e-ca86-49f0-bbd9-a07648aef879.wav', // Gaming going over time
  6: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_110838_95e1df30-572a-422f-81f5-e009d8d86570.wav', // Asking to watch YouTube unsupervised
  7: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_110905_f95fc7cc-a54b-4418-8999-0caab6f2248c.wav', // The social media ask
  8: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_110919_7128f07d-27ac-4169-9253-2c64973fbe56.wav', // Mood change after phone use
  9: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_110934_c27f080a-6e22-4ab3-90bc-4940fdf722fc.wav', // Screenshot and group chat incident
  10: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_110847_7d4008a6-3876-46e7-a926-67f9dd03f1a6.wav', // Refusing to come off their phone
  11: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_110949_b9f212cf-8e37-4530-bc82-8cce31a48fcf.wav', // Social media causing anxiety
  12: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_110951_283086ce-a7fb-4822-b6e3-287be36cb5c6.wav', // Late night device use
  13: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_110954_fe74617b-cd50-4738-9331-3de3ec4a7df5.wav', // Content causing distress
  14: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111007_8003e449-bfdc-4dda-b8be-2a56bd3a8c7c.wav', // Your online footprint and your future
  15: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111009_697c1bd7-0e67-463b-9a36-485a7efedf23.wav', // Phone-free conversation
  16: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111011_8f0d8999-540c-448e-a211-60055df28b2a.wav', // Family agreement conversation
  17: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111024_06127a69-19aa-4e0d-a6b6-e6e85b553cc4.wav', // The ban conversation
  101: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111030_b158c5c8-973d-4151-a7c6-aff5bf59f5ff.wav', // Asking for more screen time
  102: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111033_90cb6535-68ad-4eb8-aea0-3fc0d337f923.wav', // Screens before bed
  103: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111045_1cbf3b1d-c799-4257-9bd5-6f2bd7e6594c.wav', // Refusing to stop when time is up
  104: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111048_0df8c4f2-0627-4037-8df4-fcfd06e464be.wav', // Screens replacing outdoor play
  105: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111051_8d056ed9-9b94-457b-ab20-a6780202366c.wav', // Sneaking screen time
  106: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111103_724e690a-3155-4ea5-9bb7-87a2757a0ee3.wav', // Phone constantly out at meals
  107: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111105_b1853e51-2a59-406d-b9f5-a027a0ef9e90.wav', // Screen time tied to mood
  108: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111108_2cb765ce-fabb-45ec-af55-f0fe8c959d69.wav', // Homework on a device with constant distraction
  109: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111117_88518a0e-1ce8-42e1-922c-854a00db7487.wav', // Binge watching
  110: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111120_1868bbcf-0a1e-412f-862d-3eea931777cc.wav', // Always on their phone, ignoring family
  111: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111122_d9278dab-f692-4047-8c69-eb01183b9dbe.wav', // Negotiating screen time limits
  112: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111132_2f48daf8-b320-42f4-88f8-de94d6cae692.wav', // Using screens to avoid difficult emotions
  113: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111134_0471fde5-f32f-4953-84bc-ceaaea796f6a.wav', // Comparing screen time to friends' limits
  114: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111137_71ad7272-7d21-4ff9-a265-acbd753e10b3.wav', // Managing their own screen time as a young adult
  115: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111148_74051bc5-55fc-48e2-89df-2a488e23788e.wav', // Late night phone use affecting sleep
  116: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111152_a8bac6d6-0e08-4bf6-9006-f71fe6664ef4.wav', // Learning versus entertainment
  117: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111154_3df750c5-4712-48a6-8e7d-2cbb2d37d5fc.wav', // The game their friends play
  201: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111207_d1489e36-dd12-4c7c-a139-60f96535615a.wav', // Getting their first console
  202: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111210_7d025d77-2eeb-4cbd-a453-025a15bd5c55.wav', // Gaming instead of homework
  203: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111216_b8189d72-012a-463b-bf7f-24b5c1abe55d.wav', // Aggressive behaviour after gaming
  204: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111230_464689c4-944a-4255-82e0-c4f77939b347.wav', // Online gaming with strangers
  205: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111232_7d5f6bf1-ca48-4893-b4d2-9e853e81626e.wav', // Requests for in-game purchases
  206: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111238_e03fca52-26e2-4d00-923f-23a469237111.wav', // Gaming until very late
  207: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111250_50ff699c-481a-41f9-9397-9cd08811fb0a.wav', // Online gaming friends they have never met
  208: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111252_eababf48-a1da-42b0-8748-4a24df521410.wav', // Losing badly and getting angry
  209: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111307_9c7e03c6-3326-479c-8b4a-e5fcdb218b2b.wav', // Obsessive gaming, nothing else matters
  210: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111319_6820d622-3d7b-46e3-b2be-a084fb546571.wav', // Gaming culture and toxic masculinity
  211: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111321_a86f9108-706f-4702-9900-726773f4f8bd.wav', // Gambling mechanics in games
  212: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111336_457494a8-60cf-45c4-a34a-404188c67a8d.wav', // Serious esports ambitions
  213: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111340_2f64de20-d984-44ec-975a-4512008320a4.wav', // Gaming to cope with anxiety
  214: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111352_dcc9d956-8ce6-4fe7-a340-8752ed3bca46.wav', // Healthy gaming versus addiction
  215: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111355_0e4bd43f-0d1b-4ebb-ba23-af7c16300069.wav', // Gaming affecting university or work
  216: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111413_bd8abebd-ac3d-4800-a5cb-b781574e3e1f.wav', // Devices and sleep
  217: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111416_70a9d078-309d-407c-b745-335f24d5f309.wav', // Early body image messages from media
  301: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111431_8119e4be-6edd-4315-95f2-eafc404c0e5b.wav', // Too young for a first social media account
  302: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111434_d35a06ea-ca16-4b1c-ba6a-9c92b73317c5.wav', // Asking for Instagram at twelve
  303: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111452_a6133314-cde4-47b6-a888-e0a1960477a0.wav', // Comparing followers and likes
  304: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111455_8712d85c-0403-4edb-b283-95f17730fbc2.wav', // Posting content they might regret
  305: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111510_bb4f0cf7-f1a2-4615-8af1-6edf389b2298.wav', // Seeing something upsetting on TikTok
  306: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111513_178e28bf-0c83-454f-9dee-8609fe189984.wav', // Following people they do not know
  307: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111523_c06b719c-b3c7-4e9b-9108-a801781f087a.wav', // Social media affecting sleep
  308: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111526_223c28cd-7841-4233-9614-441aec7bb386.wav', // Performing for social media rather than living
  309: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111537_53e6b9e4-751d-4c97-8948-b151727fdbe5.wav', // Being caught in an online pile-on
  310: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111539_abc9c9e3-715d-43f2-913e-397bbb375909.wav', // Fear of missing out driven by social media
  311: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111550_c179616d-5e05-423c-817e-5d23344bdeeb.wav', // Sexting or pressure to share images
  312: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111553_edb9419f-bd7d-4ed7-9bdf-e240612e6cc1.wav', // Influencer culture and unrealistic standards
  313: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111602_b015a632-3626-467d-97bf-48457b55cc13.wav', // Privacy settings and what to share
  314: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111610_cb24fb08-1ad9-4ea3-8e70-8eed50879149.wav', // Using social media to cope with loneliness
  315: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111625_c55f7b05-9e91-49f4-9caf-fdc9a160c43f.wav', // Social media and political radicalisation
  316: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111628_4dd6d7ba-b449-44d9-acdb-20d1bfc884d4.wav', // Social media and mental health awareness
  317: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111637_33449cf7-b662-44bf-9b3e-f95b99c8292d.wav', // Building a positive online presence
  318: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111640_a147a858-3781-41a1-a346-dbcba52746a0.wav', // Recognising algorithm manipulation
  319: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111652_d5f65e9b-8d5c-474e-90a6-954caace68a3.wav', // Social media for mental health versus escapism
  320: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111655_98a54f93-e0cb-4208-be0a-c29b08ae212c.wav', // Social media fast or digital detox
  401: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111706_ca7d07ff-f570-42b0-89fd-00ece187c741.wav', // Strangers online
  402: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111708_701e13c1-ec0c-4b57-a3ce-67f63ca677e4.wav', // Clicking suspicious links
  403: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111718_592aa7b4-01f5-460d-9a85-696e3e44c2cf.wav', // Sharing personal information
  404: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111720_b827dd13-54c0-4419-ab00-12dd434b1d56.wav', // Someone asking to meet in person
  405: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111731_39569e35-51c2-417d-94ac-a90b21b11bd0.wav', // Recognising grooming warning signs
  406: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111739_fb34ef24-a7a2-400a-a3d3-d2b0dede37ff.wav', // Password safety
  407: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111751_c7bee8eb-f67f-4417-9541-a26ce5d0bf62.wav', // Screenshot culture and privacy
  408: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111757_ac2feeba-6e6f-4a87-bed4-12cc2df21bb7.wav', // Deepfakes and manipulated images
  409: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111814_371abd04-9d99-4807-b3af-b8776fd83f6d.wav', // Scams targeting teenagers
  410: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111821_7ccbdfda-4a04-4ed4-82a1-0247fde68c86.wav', // Revenge porn and image-based abuse
  411: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111839_f778f28e-e365-4367-85b8-a8ee9ddf0dc8.wav', // Online predators
  412: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111841_363a4319-664c-4a2d-957b-48c572af2d3d.wav', // Privacy on dating apps
  413: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111855_2c0ad802-c818-4cea-8b82-c6b6f9df396d.wav', // Digital security habits
  414: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111859_8c9653cd-ec43-4665-8302-538e3fb88613.wav', // Doxxing and online harassment
  415: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111909_8fe4104a-d8d5-43b7-adfc-8135f26b8fb3.wav', // Protecting personal data
  416: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111918_1a7e67b4-0322-48f5-bde0-bc81b19bac40.wav', // Spotting misinformation and manipulation
  417: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111934_0d9593e0-e4c8-4c9a-8b50-fb87b7850277.wav', // Renegotiating the phone-free bedroom
  501: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111941_2ef3ee9c-8055-469c-9883-f11b5eff1d85.wav', // They are being bullied online
  502: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111957_b3515c80-bc61-4987-8ddf-5a2c67fe709a.wav', // Screenshots of group chat exclusion
  503: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_111959_815407db-cd65-4ac0-af70-30e1efd6a492.wav', // Someone is spreading rumours
  504: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_112008_0e435b9c-a55d-4ac2-8bbf-8fd298343a0e.wav', // They are the one doing the bullying
  505: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_112014_3a00f2e1-478b-4e05-a392-d5cbd8f59e40.wav', // Pile-on in a group chat
  506: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_112026_81f1ef20-4a72-41ba-94d4-3b0edc444356.wav', // Revenge posting and screenshot sharing
  507: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_112029_f375604c-0067-4ec6-b620-8e00e6f37b99.wav', // The bully is a friend in real life
  508: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_112040_b1d9de9b-66ec-426a-a16a-3930528a124f.wav', // They do not want to report it
  509: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_112043_c64fd27e-c7d2-4fac-a83a-d738a36805bb.wav', // The school is involved
  510: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_112052_a9c440ea-faaf-431a-b5cc-4d3f206570a6.wav', // It has escalated to threats
  511: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_112055_428c5150-4dc2-4a62-83da-6b258303fe81.wav', // Sleep and study balance
  512: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260712_112057_ad4429dc-d050-406c-a609-42c019698613.wav', // A mature conversation about image sharing and the law
}

export function scriptVoiceUrl(sortOrder: number): string | null {
  return SCRIPT_VOICE[sortOrder] ?? null
}
