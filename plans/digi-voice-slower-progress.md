# DiGi read a little slower: DONE, all 100 at -10

Finished 29 July. `lib/content/script-voice.ts` now serves all 100 at
`speech_rate: -10`. The notes below are kept because the two corrections and
the real credit rate are worth having the next time a voice batch is run.

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

## Two corrections, found the hard way on the resume

**Imogen is a `preset`, not an `element`.** The id below is right, but the first
resume call passed `voice_type: 'element'` as this file implied and got back a
flat `400 Voice not found`. `list_voices` is the authority: Imogen is
`voice_type: 'preset'`, id `3811e986-0891-47cf-a1f5-78a1d62a547a`.

**The real rate is 1.70 credits a line, not 1.2.** Measured on the resume by
reading the balance either side of a single generation: 200.87 to 199.17. So
the preflight quote of 0.2 is out by roughly EIGHT times, not six, and the full
69 costs about 117 credits rather than the 85 estimated below. Budget from 1.70
and check the balance before starting.

**It rate limits harder than four at a time suggests.** Firing back to back
without pauses returned `429 rate_limit_reached` after about twenty lines. Leave
a real gap between batches rather than relying on the concurrency number.

## Resuming

The 31 below are generated, paid for and live on the CDN. Top the workspace up,
generate the sort orders listed under Still to generate at Imogen
(`voice_id` 3811e986-0891-47cf-a1f5-78a1d62a547a, `voice_type: 'preset'`) with
`speech_rate: -10` and `format: wav`, then replace the whole map in one go.

To find out what a part finished run already did, call `show_generations` with
`type: 'audio'` and match on the prompt text. Every generation carries its
prompt back, and the prompt is the `say_this` column, so nothing needs to be
tracked by hand while a batch is in flight.

The `say_this` text is best read from the DATABASE rather than the seed files:
`select sort_order, title, say_this from scripts`. Checked on 28 July, there are
ZERO duplicate sort_orders in the live table, so the warning below about
matching on title rather than sort_order no longer applies to current data.
Matching on sort_order is safe.

The generator rate limits at about four concurrent, so batch four at a time with
roughly twenty seconds between.

The say this text comes from the seed SQL, and several seed files reuse the same
sort_order for different scripts. Match on the title in the trailing comment of
`script-voice.ts`, not on sort_order alone, or some recordings will be made for
the wrong script.


## All 69 remaining generated on 29 July

Every one of the sort orders under Still to generate has now been generated at
Imogen, `speech_rate: -10`, `format: wav`. 88 credits for the first 57, so about
1.54 a line in practice.

The finished file for a job is `results.rawUrl` from `show_generations`, and the
FILENAME CONTAINS THE JOB ID, so these ids are all that is needed to rebuild the
map: fetch the audio generations, then match each rawUrl to a sort order by the
uuid inside it. No prompt matching required.

```
sort_order  job_id
115 07aaeafa-7b66-406b-a8a8-2e8ed10d9ac8
116 701cd5fe-1c01-4e3a-96af-6db299ebeb58
117 8711c608-f243-48de-b28c-355057f9b2cf
201 caa7ac39-4324-4319-8c09-a4e481d01319
202 86e549bd-e3b0-4356-b53f-88749fc75267
203 51218bcf-648b-4175-9411-7d6cdd60c553
204 8d3f5fce-a474-489c-a1d6-5ba5480a0c0a
205 10cc9777-6975-49e0-85ae-196a02e5b3e2
206 56f6a4fb-36b2-4346-bea0-bbf53a8bc8ae
207 f6fccfde-98a4-486b-ae3f-f6257af0c9bf
208 62cf8754-9dd6-45df-86ed-e4e640a6bf49
209 ce54ffa3-7ac0-4d09-97e8-a7c83860951b
210 3199a48b-c93e-4358-a8e8-7c6d88d07e72
211 81c5b329-34a4-499e-a467-1656bb2a8319
212 2dd865ce-404b-4c24-89f6-337f251a7055
213 4385fa64-3c5e-41a1-a413-53fcc0fc22b0
214 f0c7328b-ea4d-4484-bb92-5cd92e8d40a2
215 a8b4e97a-2b75-4128-addc-2e408ff829e5
216 0a857c63-688a-4584-81d6-d5567f6a989b
217 868e6917-c08b-4826-b9b2-e4e4ac67fe61
301 cacdfcc4-85c7-4c52-9014-507e9f6a9203
302 d6d2af7b-e507-4115-a2cc-171b9fe141be
303 6065ef64-280d-4c5c-bdff-9a59af235047
304 abe92bb1-2059-4fd0-ac0c-5b22a69e3d6c
305 c71fe85c-c1b9-405b-9e9b-dc5186bd26e0
306 96ec54e6-0096-4792-82b4-aea0400ced06
307 3338e749-ca56-4957-95ac-5b2ec27daff3
308 0bc5ac79-bb8e-44f8-925a-e9fc5bfec2c2
309 4a6fa0a9-bcdd-410a-8841-ffa510ffe564
310 6b564844-dc97-44df-9b3d-d716751f92d2
311 7213c969-482f-4924-9192-5d9720256973
312 a50025f3-755d-45ec-855f-0c39774f3b58
313 fad3f94d-3ac8-44ce-88c6-9c4d1916da00
314 e36d6f8b-b87a-4874-b965-2349c2dcd7df
315 97a3dfd3-54ed-458b-ac5c-fbc9e01a0aea
316 b22cec85-9d06-47bc-849c-44f66fafb64a
317 5d4949e5-8d80-4aff-bf58-b55091ccbfe5
318 5a58c192-5a90-4105-9f00-7a1ccf0cb789
319 63f96249-f1a9-46af-a74b-2b959d4e19f9
320 f5667235-4e6b-4b18-8325-7e631ee3d270
401 873f72af-72bc-466c-bbce-9d8a0141366b
402 56c0fe68-736d-49c4-a140-d9802a6729e6
403 41320eb5-ab63-4e82-bc44-13cdca195061
404 1a45b6ed-9b63-435c-848e-c10d18f4d7c2
405 cc23cb5d-4027-47cf-99df-50133175b725
406 bd07bf28-2edf-4e1d-b0c1-1e88fb0a2be0
407 cd85c1ab-6442-41d9-9d40-df4e3282a192
408 95b97c21-38b5-4390-93d9-1cd1531e4725
409 10df4d17-f1f8-462d-b557-264767009bf2
410 f67ac8fc-0bf5-452a-93a4-3ea74953cb17
411 73f32aff-ebae-44c2-b53a-04b30c01af91
412 0be6e327-ec1b-45b5-85d1-850d557c1cdc
413 712165b7-2d28-43fd-b49b-6d622b0021a9
414 e5521041-132e-4b45-827f-07de434ca7d0
415 daa347a5-5314-4373-8ba9-028e1f0045af
416 4bc38267-d322-47ab-b1a1-7aef0da033d6
417 4d30e21f-cb7b-4900-bf4b-9c7006d24531
501 8b1d3514-9d8f-4cfd-a16c-256d97306b67
502 0f08897e-fd4c-469f-af27-ee63f0872318
503 83e5276b-931a-4762-bbe9-09b73233143a
504 814a31d7-faff-4e92-b596-21ad7c985485
505 2554a293-d08f-4f73-a710-aa5e48c89e09
506 6ad5bbd4-a06e-458d-a273-1030ae92ad7f
507 2613459d-2e2a-4780-9235-262eb89d2099
508 c4c76ea8-0c11-47e6-8c07-828712b0e923
509 372bba42-8594-40ef-a7cd-80db09365aea
510 2729ef71-c8fd-422f-9546-38dfa8d9aea6
511 14b5fce2-d708-4d47-a926-13bf5bed40ea
512 896f875d-59ac-4c59-ae6c-88381ddc1ce7
```

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
