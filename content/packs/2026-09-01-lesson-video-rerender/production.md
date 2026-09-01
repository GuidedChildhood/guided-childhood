# Re-render of the damaged lesson video windows, 1 September 2026

Justin: "Re render." The proper cure for the three lessons that carried held
frame repairs (1.10 The Yes No Button) or untouched frozen stretches (1.2
Kind words on screens, 1.7 My privacy shield). Every damaged window now
carries real, new picture matched to the narration, with a gentle slow zoom.
The narration was never touched: the audio stream in every fixed file is bit
identical to the original (verified by stream md5).

## Method

1. Transcribed the narration inside each damaged window with faster whisper
   in the Higgsfield sandbox, so the new picture illustrates what is actually
   being said.
2. Pulled a clean frame from beside each window and fed it to Nano Banana Pro
   as a style and character reference, so the new art matches the existing
   look and keeps DiGi on model.
3. Generated one new 16 by 9 illustration per beat (six in total), house
   style block applied, no dashes in any on screen words.
4. Spliced each illustration into its window with ffmpeg (slow Ken Burns
   zoom, 1080p30, crf 19), audio copied untouched, then verified durations,
   the audio md5s, and picture from frame zero.
5. Uploaded and repointed the seven `parent_lesson_segments` rows. Live data
   change, no migration: those rows carry no URLs in any seed file.

## The five windows and their new picture

| Lesson | File(s) | Window | Narration (whisper) | New picture | Image job |
| --- | --- | --- | --- | --- | --- |
| 1.10 | A + full | 0 to 12.2s | "Hello, I'm DiGi... snuggle up... big breath" | DiGi welcomes a child and grown-up snuggled on the sofa | 393cf90a |
| 1.10 | A + full | 21.6 to 33.5s | magic words recap, "like two puzzle pieces" | Two puzzle pieces joining, "Check with your grown up first" | a77e3e4a |
| 1.10 | A + full | 33.5 to 49.7s | "our special word is permission... asking first" | The word Permission, child asking their grown-up | c4e60198 |
| 1.10 | C + full | 0 to 17.1s (C) / 217.1 to 235.0s (full) | the pop-up game homework | Grown-up as cheeky pop-up, child does stop, hands off | e0f445ef |
| 1.2 | C + full | 47.5 to 72.5s (C) / 263.9 to 289.0s (full) | one thing you remember, one kind message tonight | Bedtime chat, gold heart, tablet face down | 5452ddd4 |
| 1.7 | B + full | 25.3 to 44.7s (B) / 154.6 to 174.1s (full) | "you don't send it, you go and check" | App asks for a photo, child goes to grown-up, green shield | c418578d |

## The seven fixed files (uploaded media ids)

| Segment row | Media id |
| --- | --- |
| 1.10 A | 6e427b9e-6193-4a8d-a01e-82da44522e46 |
| 1.10 C | a6ae2c7f-9ff7-41a5-be35-5d98e4c8b5ca |
| 1.10 full | 8ab314c6-a92c-475f-a939-d9fb7b0d037f |
| 1.2 C | 13c08a58-a0c1-42de-b44f-1a37255295b4 |
| 1.2 full | 749df60e-915f-43d2-897e-a2e71a0b89f0 |
| 1.7 B | ac3c31ad-6bad-4070-baad-cee6396fbd14 |
| 1.7 full | 0bee5321-5dd0-4a73-a26f-3f5fb33e6af8 |

## Verification

- All seven outputs 1920x1080 at 30fps, same as the originals.
- Audio stream md5 identical to the original in all seven files.
- 1.10 opens on bright picture from frame zero (luma average 198 on a cream
  ground, values moving frame to frame, so the zoom is live).
- The two 1.2 files previously carried inflated container durations (97.7s
  and 314.1s of video timestamps against 83.75s and 300.20s of audio); the
  fixed files now match the database durations exactly.

## Honest limit

Each replaced window is one still with a slow zoom, not multi-shot animation
like the surrounding video. It reads as a calm illustrated beat and the
picture now matches the words, but a fully animated re-export from the
original project files would still be the gold standard if those files ever
turn up.
