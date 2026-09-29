---
name: talking-head-video
description: Turn a phone recording of Justin (or Natalia) into a finished, captioned, branded video the same way every time, using HyperFrames and the student kit's cutting tools. Use whenever Justin says "edit this video", "I recorded this", "make this into a reel", "a video for LinkedIn", "a video to send to <a person>", "my video to Penny", "make the scripts easy to read", or hands over any footage. Three lanes: long form talking head (LinkedIn, YouTube, lesson explainers), short form for the family account and TikTok (silent, vertical, ends on the stage check), and a one to one video to a named person. Never generates a synthetic person presented as a real parent. Never publishes.
---

# Talking head to finished video

Built 29 September 2026 from Nate Herk's five step method (transcribe, cut,
plan the beats, use skills, verify) weighed in
`plans/2026-09-29-nate-video-method-weighed.md`. His mechanics, our register.

## Read first

- THE-STORY.md sections 1, 2 and 10. Every video is a road to the stage check.
- `videos/guided-childhood-intro/frame.md`: the house frame (cream, ink, butter,
  Nunito, IBM Plex Mono, white cards with the 3px ink outline and hard shadow).
  Copy it into every new project. Never let a preset repaint it.
- `motion-standard.md` in this folder: the bar every video is checked against
  (Nate's eleven laws and reel grammar, translated to paper and ink). Read it
  before Step 5 and run its section 4 before Step 7.
- `.claude/skills/silent-ugc/SKILL.md` for any vertical video. Its rules win.
- `.claude/skills/family-social/SKILL.md` for anything on the family account.

## What this hinges together

| Job | Tool | Where |
|---|---|---|
| Transcribe, word level, free and local | `npx hyperframes transcribe assets/raw.mp4` (whisper-cpp, small.en) | HyperFrames CLI |
| Cut dead air | `cut-silences` | `hyperframes-student-kit/.claude/skills/cut-silences` |
| Cut stutters, false starts, retakes | `cut-mistakes` (proposals, reviewed, then applied) | `hyperframes-student-kit/.claude/skills/cut-mistakes` |
| Plan the beats | `video-storytelling` beat sheet | student kit |
| Long form graphics over the face | `/talking-head-recut` | HyperFrames workflow |
| Plain captions only | `/embedded-captions` | HyperFrames workflow |
| Reels and Shorts | `short-form-edit` | student kit |
| Motion stings under 10s | `/motion-graphics` | HyperFrames workflow |
| Check, preview, render | `npx hyperframes lint`, `check`, `snapshot`, `preview --background`, `render` | HyperFrames CLI |

## Non negotiables (inherited, do not relitigate)

1. No synthetic person presented as a real parent or user. The face on screen
   is Justin or Natalia, filmed by a phone.
2. No dashes in any on screen copy. Ages as "4 to 16".
3. Our tokens only. No Inter, no glass, no purple, no generic AI look.
4. Never allow or deny. Never claim an outcome for a child. Never "safe" or
   "ready for social media"; the wording is "completed the stage".
5. Every social video ends on the hook: *What stage is your child? Three
   questions, no sign up.* Identical every time.
6. Product shots are real screens from the live app, never rebuilt or generated.
7. Silent by default, captioned always. Music only when HeyGen is signed in
   and the video is for a platform that plays sound.
8. This skill renders. Justin publishes.

## Justin's part: recording

One page, stick it by the phone.

1. Phone at eye level, landscape for lanes A and C, portrait for lane B.
   Window light in front of you, never behind.
2. Quiet room. Kitchen at night is fine. Say the first line twice; we keep the
   better one.
3. Read from the read sheet, one card at a time. Pause two seconds between
   cards. Mistakes do not matter, say the line again and carry on. The cutting
   tools remove the rest.
4. Point or look where a graphic should land and say what it is ("the star
   bank comes in here"). Those words become the beat plan.
5. Finish with the hook, exactly: "What stage is your child? Three questions,
   no sign up."
6. AirDrop the file to the Mac. Do not trim it in Photos. Nothing else.

## The read sheet (what the scripts become)

Every script is rewritten onto cards before recording, in
`videos/<project>/READ-SHEET.md`:

```
CARD 3 of 7
[Look at the camera]

It's eleven o'clock and you've just seen
something on their phone.

[Pause]

You cannot ring anyone.

[Point right: the DiGi chat comes in here]
```

Rules: one idea per card, at most three lines, big type when printed, a
bracketed direction only where a graphic lands. The 21 lesson scripts in
`content/lesson-scripts/` are already in seven beats, so one beat is one card.

## The pipeline (run this for any video)

**Step 0, intake.** Create `videos/<yyyy-mm-dd>-<slug>/`, put the recording at
`assets/raw.mp4`, copy the house `frame.md`, write `BRIEF.md` (lane, platform,
audience, the one message, the beats Justin named on camera). Never touch
`raw.mp4` again.

**Step 1, transcribe.** `npx hyperframes transcribe assets/raw.mp4 --json`.
Word level times on the raw timeline. On the 8 GB Mac, a take over ten minutes
is split into beats first.

**Step 2, cut dead air.** `cut-silences --apply`. Keep pauses that carry meaning
(after a question, before the hook). Output `silenced.mp4` plus its retimed
transcript.

**Step 3, cut mistakes.** `cut-mistakes` proposals into `approved-cuts.json`.
Read each against the speech. Then apply, output `clean.mp4` and the final
transcript. Never use raw timings against the clean video.

**Step 4, plan the beats.** A beat sheet from the clean transcript: spoken
anchor, on screen idea, which real asset, entry time, exit. Justin's on camera
pointers are beats first; add at most one graphic per twenty seconds beyond
them. Big text, few words, one idea per beat. The last beat is the hook.

**Step 5, build.** Route by lane (below). Graphics come from the house frame:
white cards, ink outline, hard shadow, Nunito 900 headlines, mono eyebrows,
the Planet Friends and the DiGi star as the only characters. Captions on, in
the house caption skin, in the bottom band.

**Step 6, verify, twice at least.** `lint`, `check`, then `snapshot` at every
beat's entry and the cuts. Read the contact sheet. Watch the preview. Fix
anything that lands off its word, overlaps the face, or reads as a slide
dump. Run it again. Only then is it "done".

**Step 7, review and render.** `preview --background`, tell Justin the URL and
the frame ids. He says render or names a frame and a change. Then
`render --quality high --output renders/video.mp4`. Deliver the MP4, the
contact sheet and the folder.

**Step 8, learn.** Justin's one line of feedback goes under `## Learned` below,
so the next run starts better. If he says it twice, it becomes a rule above.

## The three lanes

**A. Long form talking head.** LinkedIn, YouTube, lesson explainers. 1920x1080.
`/talking-head-recut`: Justin's face stays full frame or a rounded crop on
the left, cards and real screens land right of him on their spoken word. Up to
three minutes. Captions on. The lesson scripts use the host character pop ins
from `lesson-video`.

**B. Short form for the family account and TikTok.** 1080x1920, ten to twenty
seconds, silent. `short-form-edit` with silent-ugc's rules: the text hook does
the work, one held shot, then the real product screen, ending on the stage
check. On the family account the voice and face are Natalia's. Never a
carousel on Facebook. Every service claim carries its proof path in the caption
draft.

**C. One to one, to a named person.** A video Justin sends to one person (for
example Penny). 1920x1080, under ninety seconds. No hook, no music. Opens with
their name and why he is sending it, one real screen if it helps, one ask at
the end. Captions on because it will be watched on a phone with the sound off.
Rendered, then Justin sends it himself. Not published anywhere.

## Setup on the Mac, once

```bash
brew install whisper-cpp
```

ffprobe is missing too (ffmpeg was installed on its own). `brew install ffmpeg`
puts both on the path. Then `npx hyperframes doctor` from any video project
should show whisper-cpp and FFprobe green. This Mac is a 4 core i5 with 8 GB,
so: `small.en`, draft renders first, no local music or voice models.

## Honest limits

- Transcription accuracy on a phone recording in a kitchen is good, not
  perfect. Names and product words are checked by hand before captions burn.
- The Mac renders slowly. A three minute long form video is a coffee, not a
  moment.
- The beat plan is only as good as Justin's pointers. A recording with no
  pointers gets one card per idea and nothing clever.

## Learned

- 29 September 2026, the first intro: a preset remix mapped every pastel onto
  a muddy butter. Always paste the site's own tints into frame.md by hand
  after `build-frame`, and check the ornament layer is stars only.
