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
// Read a little slower, at speech_rate -10. Justin asked for the Imogen read
// to be a little bit slower, and the pace is a number in the batch rather than
// a rewrite of the wording, so nothing here is timed to the recordings: both
// consumers are a Hear it button beside the say this text.
//
// All 100 are at that pace. A map that was part slow and part normal would
// trade one inconsistency for another, and consistency of voice is the whole
// reason the Imogen batch exists.
//
// Regenerating in a different voice or at a different pace is one batch and a
// rewrite of this map, never a code change. Served from the generation CDN for now; these are the
// only assets left hotlinked after the art was vendored into public/art, and
// they want the same treatment once there is somewhere sensible to put fifty
// megabytes of audio. Keyed by the script sort_order (the id in the URL
// /dashboard/scripts/<sort_order>).

export const SCRIPT_VOICE: Record<number, string> = {
  1: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_133605_5c0cbbd0-a9a0-476d-bf87-b1a8cb538473.wav', // First device moment
  2: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135327_501c675e-82b1-49eb-b48f-95aa2d67659f.wav', // Meltdown when screen time ends
  3: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135329_894bed5f-4af5-472f-914d-f0457eb879b9.wav', // Asking for their own phone
  4: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135330_ee1b536c-d84d-4b00-8abb-4f0b77884550.wav', // First social platform request
  5: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135332_35da0039-e90d-4309-993d-1a4d16128410.wav', // Gaming going over time
  6: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135334_04c7659c-545e-429a-900a-b07ef314a6f1.wav', // Asking to watch YouTube unsupervised
  7: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135334_1f68fdbb-eadb-45a7-bc6e-9d0631f47123.wav', // The social media ask
  8: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135427_76b12334-7757-4ad2-ba07-a1c354fb2ec7.wav', // Mood change after phone use
  9: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135429_9269d352-01f2-4011-a56a-217f43c290c7.wav', // Screenshot and group chat incident
  10: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135430_72797653-5414-4c0e-b196-f38996d5f50d.wav', // Refusing to come off their phone
  11: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135432_a4189aae-822a-477a-a39b-ad12315377a2.wav', // Social media causing anxiety
  12: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135435_e80c580f-c500-4765-8448-e38d099b41c1.wav', // Late night device use
  13: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135508_55d7f4f2-8b4e-451f-912f-bab657ba2d20.wav', // Content causing distress
  14: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135510_c8a1bc69-af37-4652-964e-fd9c9566f5b5.wav', // Your online footprint and your future
  15: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135512_645dc800-19b3-4d22-8130-854c839050c8.wav', // Phone-free conversation
  16: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135513_892e7c7b-3c0e-46b4-9f0c-ddb47bdfe01b.wav', // Family agreement conversation
  17: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135622_9ba675f6-088a-494f-99ae-30d961612ae0.wav', // The ban conversation
  101: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135623_ccb3a927-8c03-47b3-9361-d445d3d77185.wav', // Asking for more screen time
  102: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135626_b7151565-582e-42af-975d-bc3600ef5ef7.wav', // Screens before bed
  103: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135627_a05eacaf-df83-473e-836a-41c3e9bbc795.wav', // Refusing to stop when time is up
  104: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135659_b86058cc-3928-4d30-b262-f1cf75c6967e.wav', // Screens replacing outdoor play
  105: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135700_bd89fae7-5404-4baf-bf7f-185c89f6ca1b.wav', // Sneaking screen time
  106: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135703_3e28ad1c-d26c-423b-b395-4d22df38fea7.wav', // Phone constantly out at meals
  107: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135704_580d5fb9-26b1-4758-8ac3-d74c0fca335a.wav', // Screen time tied to mood
  108: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135745_0f405ff0-0040-4380-90ff-9f244306f903.wav', // Homework on a device with constant distraction
  109: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135747_eedeb845-7ed9-41d0-a539-a179fd9791a1.wav', // Binge watching
  110: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135748_a955a813-78d7-441f-8e3c-6dc2769272e5.wav', // Always on their phone, ignoring family
  111: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135749_fcf15f8d-e88c-4c47-bbb5-e8d9fc184b26.wav', // Negotiating screen time limits
  112: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135822_8b481206-20de-45df-880d-8db8ecc4c34d.wav', // Using screens to avoid difficult emotions
  113: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135825_ee789616-323f-43e6-9859-5e6ee8a782dc.wav', // Comparing screen time to friends' limits
  114: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260728_135825_ef83eece-e59c-4f10-b176-09a21762c3fb.wav', // Managing their own screen time as a young adult
  115: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_105614_07aaeafa-7b66-406b-a8a8-2e8ed10d9ac8.wav', // Late night phone use affecting sleep
  116: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_105653_701cd5fe-1c01-4e3a-96af-6db299ebeb58.wav', // Learning versus entertainment
  117: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_105701_8711c608-f243-48de-b28c-355057f9b2cf.wav', // The game their friends play
  201: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_105940_caa7ac39-4324-4319-8c09-a4e481d01319.wav', // Getting their first console
  202: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_105948_86e549bd-e3b0-4356-b53f-88749fc75267.wav', // Gaming instead of homework
  203: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_105955_51218bcf-648b-4175-9411-7d6cdd60c553.wav', // Aggressive behaviour after gaming
  204: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110001_8d3f5fce-a474-489c-a1d6-5ba5480a0c0a.wav', // Online gaming with strangers
  205: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110010_10cc9777-6975-49e0-85ae-196a02e5b3e2.wav', // Requests for in-game purchases
  206: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110018_56f6a4fb-36b2-4346-bea0-bbf53a8bc8ae.wav', // Gaming until very late
  207: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110028_f6fccfde-98a4-486b-ae3f-f6257af0c9bf.wav', // Online gaming friends they have never met
  208: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110034_62cf8754-9dd6-45df-86ed-e4e640a6bf49.wav', // Losing badly and getting angry
  209: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110046_ce54ffa3-7ac0-4d09-97e8-a7c83860951b.wav', // Obsessive gaming, nothing else matters
  210: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110053_3199a48b-c93e-4358-a8e8-7c6d88d07e72.wav', // Gaming culture and toxic masculinity
  211: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110101_81c5b329-34a4-499e-a467-1656bb2a8319.wav', // Gambling mechanics in games
  212: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110110_2dd865ce-404b-4c24-89f6-337f251a7055.wav', // Serious esports ambitions
  213: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110120_4385fa64-3c5e-41a1-a413-53fcc0fc22b0.wav', // Gaming to cope with anxiety
  214: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110128_f0c7328b-ea4d-4484-bb92-5cd92e8d40a2.wav', // Healthy gaming versus addiction
  215: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110135_a8b4e97a-2b75-4128-addc-2e408ff829e5.wav', // Gaming affecting university or work
  216: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110143_0a857c63-688a-4584-81d6-d5567f6a989b.wav', // Devices and sleep
  217: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110150_868e6917-c08b-4826-b9b2-e4e4ac67fe61.wav', // Early body image messages from media
  301: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110207_cacdfcc4-85c7-4c52-9014-507e9f6a9203.wav', // Too young for a first social media account
  302: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110215_d6d2af7b-e507-4115-a2cc-171b9fe141be.wav', // Asking for Instagram at twelve
  303: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110222_6065ef64-280d-4c5c-bdff-9a59af235047.wav', // Comparing followers and likes
  304: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110328_abe92bb1-2059-4fd0-ac0c-5b22a69e3d6c.wav', // Posting content they might regret
  305: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110337_c71fe85c-c1b9-405b-9e9b-dc5186bd26e0.wav', // Seeing something upsetting on TikTok
  306: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110349_96ec54e6-0096-4792-82b4-aea0400ced06.wav', // Following people they do not know
  307: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110403_3338e749-ca56-4957-95ac-5b2ec27daff3.wav', // Social media affecting sleep
  308: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110412_0bc5ac79-bb8e-44f8-925a-e9fc5bfec2c2.wav', // Performing for social media rather than living
  309: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110422_4a6fa0a9-bcdd-410a-8841-ffa510ffe564.wav', // Being caught in an online pile-on
  310: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110430_6b564844-dc97-44df-9b3d-d716751f92d2.wav', // Fear of missing out driven by social media
  311: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110525_7213c969-482f-4924-9192-5d9720256973.wav', // Sexting or pressure to share images
  312: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110534_a50025f3-755d-45ec-855f-0c39774f3b58.wav', // Influencer culture and unrealistic standards
  313: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110542_fad3f94d-3ac8-44ce-88c6-9c4d1916da00.wav', // Privacy settings and what to share
  314: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_110549_e36d6f8b-b87a-4874-b965-2349c2dcd7df.wav', // Using social media to cope with loneliness
  315: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_112725_97a3dfd3-54ed-458b-ac5c-fbc9e01a0aea.wav', // Social media and political radicalisation
  316: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_112733_b22cec85-9d06-47bc-849c-44f66fafb64a.wav', // Social media and mental health awareness
  317: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_112738_5d4949e5-8d80-4aff-bf58-b55091ccbfe5.wav', // Building a positive online presence
  318: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_112744_5a58c192-5a90-4105-9f00-7a1ccf0cb789.wav', // Recognising algorithm manipulation
  319: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_112749_63f96249-f1a9-46af-a74b-2b959d4e19f9.wav', // Social media for mental health versus escapism
  320: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_112755_f5667235-4e6b-4b18-8325-7e631ee3d270.wav', // Social media fast or digital detox
  401: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113227_873f72af-72bc-466c-bbce-9d8a0141366b.wav', // Strangers online
  402: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113232_56c0fe68-736d-49c4-a140-d9802a6729e6.wav', // Clicking suspicious links
  403: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113238_41320eb5-ab63-4e82-bc44-13cdca195061.wav', // Sharing personal information
  404: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113249_1a45b6ed-9b63-435c-848e-c10d18f4d7c2.wav', // Someone asking to meet in person
  405: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113256_cc23cb5d-4027-47cf-99df-50133175b725.wav', // Recognising grooming warning signs
  406: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113301_bd07bf28-2edf-4e1d-b0c1-1e88fb0a2be0.wav', // Password safety
  407: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113356_cd85c1ab-6442-41d9-9d40-df4e3282a192.wav', // Screenshot culture and privacy
  408: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113402_95b97c21-38b5-4390-93d9-1cd1531e4725.wav', // Deepfakes and manipulated images
  409: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113407_10df4d17-f1f8-462d-b557-264767009bf2.wav', // Scams targeting teenagers
  410: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113412_f67ac8fc-0bf5-452a-93a4-3ea74953cb17.wav', // Revenge porn and image-based abuse
  411: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113418_73f32aff-ebae-44c2-b53a-04b30c01af91.wav', // Online predators
  412: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113432_0be6e327-ec1b-45b5-85d1-850d557c1cdc.wav', // Privacy on dating apps
  413: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113443_712165b7-2d28-43fd-b49b-6d622b0021a9.wav', // Digital security habits
  414: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113447_e5521041-132e-4b45-827f-07de434ca7d0.wav', // Doxxing and online harassment
  415: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113453_daa347a5-5314-4373-8ba9-028e1f0045af.wav', // Protecting personal data
  416: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113500_4bc38267-d322-47ab-b1a1-7aef0da033d6.wav', // Spotting misinformation and manipulation
  417: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113505_4d30e21f-cb7b-4900-bf4b-9c7006d24531.wav', // Renegotiating the phone-free bedroom
  501: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113525_8b1d3514-9d8f-4cfd-a16c-256d97306b67.wav', // They are being bullied online
  502: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113530_0f08897e-fd4c-469f-af27-ee63f0872318.wav', // Screenshots of group chat exclusion
  503: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113535_83e5276b-931a-4762-bbe9-09b73233143a.wav', // Someone is spreading rumours
  504: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113541_814a31d7-faff-4e92-b596-21ad7c985485.wav', // They are the one doing the bullying
  505: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113601_2554a293-d08f-4f73-a710-aa5e48c89e09.wav', // Pile-on in a group chat
  506: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113606_6ad5bbd4-a06e-458d-a273-1030ae92ad7f.wav', // Revenge posting and screenshot sharing
  507: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113611_2613459d-2e2a-4780-9235-262eb89d2099.wav', // The bully is a friend in real life
  508: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113655_c4c76ea8-0c11-47e6-8c07-828712b0e923.wav', // They do not want to report it
  509: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113701_372bba42-8594-40ef-a7cd-80db09365aea.wav', // The school is involved
  510: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113710_2729ef71-c8fd-422f-9546-38dfa8d9aea6.wav', // It has escalated to threats
  511: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113716_14b5fce2-d708-4d47-a926-13bf5bed40ea.wav', // Sleep and study balance
  512: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260729_113724_896f875d-59ac-4c59-ae6c-88381ddc1ce7.wav', // A mature conversation about image sharing and the law
}

export function scriptVoiceUrl(sortOrder: number): string | null {
  return SCRIPT_VOICE[sortOrder] ?? null
}
