# DiGi read a little slower: 31 of 100 done, out of credits

JP asked for the Imogen read to be a little bit slower. `seed_audio` takes a
`speech_rate`, so the pace is a number in the batch rather than a rewrite of
the wording. Measured on script 1's say this line:

| speech_rate | Duration |
| --- | --- |
| 0, what is live now | 12.18s |
| -10 | 14.53s |
| -20 | 14.76s |
| -40 | 25.47s |

-10 and -20 land in the same place and -40 is more than double, so -10 is the
one that matches "a little bit". JP picked -10.

## Where it stopped

The generator's own `get_cost` preflight quoted 0.2 credits a line, so 100 lines
looked like 20 credits against a balance of 42.27. The real charge came out
around 1.2 a line, roughly six times the quote, and the workspace ran dry after
31. The preflight is not trustworthy for this model, so budget from the measured
rate instead: the remaining 69 lines need about 85 credits.

Nothing has been pointed at these files yet. `lib/content/script-voice.ts` still
serves the full set of 100 at the original pace, because a map that was 31 slow
and 69 normal would trade one inconsistency for another, and consistency of
voice is the whole reason the Imogen batch was made in the first place.

## Resuming

The 31 below are generated, paid for and live on the CDN. Top the workspace up,
generate the sort orders listed under Still to generate at Imogen
(`voice_id` 3811e986-0891-47cf-a1f5-78a1d62a547a) with `speech_rate: -10` and
`format: wav`, then replace the whole map in one go.

The generator rate limits at about four concurrent, so batch four at a time with
roughly twenty seconds between.

The say this text comes from the seed SQL, and several seed files reuse the same
sort_order for different scripts. Match on the title in the trailing comment of
`script-voice.ts`, not on sort_order alone, or some recordings will be made for
the wrong script.

## Generated at -10

```
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
```

## Still to generate

Sort orders: 115, 116, 117, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512
