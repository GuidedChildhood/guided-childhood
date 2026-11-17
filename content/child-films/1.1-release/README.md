# Film 1.1, Me on a screen and me in real life: the public versions

16 November 2026. Film 1.1 re-voiced in DiGi's voice (Tamsin, a little slower)
and built in both public shapes, the same way as 1.3
(`../1.3-release-test/README.md`). **Nothing here has been uploaded, posted or
scheduled.**

## Now in Isla's voice, 16 November

Justin heard Tamsin as not real enough and chose Isla on ElevenLabs
(`../voice-test-2/`, sample 5). Both public films below are now the Isla
versions: the YouTube cut is 5:00 and the family cut is 1:09. All 49 lines were
generated again (Higgsfield text2speech_v2, variant elevenlabs, preset
7367e919-3069-5a0b-939e-dfb1c0fd91b4), each one transcribed against its words
before the build. The original film is saved as `work/orig.mp4` (not
committed). The Tamsin notes below are kept as the record of the first
re-voice.

## What is in this folder

| File | What it is |
| --- | --- |
| `me-on-a-screen-and-me-in-real-life-youtube-16x9.mp4` | The whole film in Isla's voice, 5:00, 1920 by 1080. The line "And grown up, you just gave your child something they'll keep for life." is cut, picture and sound. Six seconds at the stage check are added at the end |
| `me-on-a-screen-and-me-in-real-life-family-9x16.mp4` | 1:09, 1080 by 1920, for Instagram and Facebook. From "Today we learn one big thing" to "A game might look like a lovely present and not be one", on cream, full captions under the picture, five seconds at the stage check |
| `me-on-a-screen-and-me-in-real-life-thumbnail-1280x720.png` | YouTube thumbnail: "A photo is a tiny slice", the photo and the jumping boy |
| `me-on-a-screen-and-me-in-real-life.en-GB.srt` | Subtitles for the YouTube version, 83 lines |
| `film.json` | The 49 lines with their times and captions, the cut, the vertical window and the card words |
| `isla-lines.json`, `isla-ledger.tsv` | The words sent to Isla, and every Higgsfield result file. The Tamsin files (`tamsin-lines.json`, `tamsin-ledger.tsv`) are kept as the record of the first re-voice |

How to rebuild, from `content/child-films/`:
`VOICE=isla python3 revoice/revoice.py 1.1-release build 1.1-release/work/orig.mp4`, then
`VOICE=isla python3 revoice/revoice.py 1.1-release finish`, then
`bash revoice/build.sh 1.1-release`.

## Cost and lines redone

- **28.6 credits**, read from the balance before and after (443.07 to 414.47).
  More than 1.3's 20.9 because the film is longer (49 lines, 641 words) and
  four lines were redone.
- Line 6 was redone because the machine transcript heard "until you're grown
  up" where the line says "and tell your grown up". A second model heard it
  right, but it was redone to be safe.
- Line 21 came back with a stray sound before "Pause me here".
- Line 42 dropped "Ask" and the whole "Wiggle, giggle" sentence twice. It now
  reads "Ask them, what can the real you do that the photo can't? Then wiggle,
  giggle, and pull the silliest face in the world." One retry failed on
  Higgsfield's side and left no file.
- The vertical cut stops before "And you know what?". Running on to "All of
  those feelings are okay" made it 1:45, over the 60 to 100 seconds aimed for.

## What was checked

- Every line was transcribed and matches its words.
- The last 30 seconds of the YouTube version were transcribed after the build:
  "Got it? Brilliant. Remember, screens are better together. See you next
  time." The promise is gone.
- Four frames of the vertical cut were looked at. Everything a person reads sits
  between y 285 and y 1550 and nothing overlaps.

## What was not checked

- **Nobody has listened to the whole film.** How the lines sound next to each
  other was not judged by ear.
- The subtitles come from a machine transcript and were read, not checked by
  ear. One word in the old film was unclear and was written by meaning: "A
  mirror shows the real, whole you."
- The vertical cut keeps the film's sound. It was built to read silent.

## Words to go with it, drafts

**YouTube title.** Me on a screen and me in real life. A film to watch with your 4 to 7 year old

**YouTube description.**
A five minute film to watch together. A photo only shows a tiny slice of a
person, and the real you is so much more. Your child learns one small rule: if
anything on a screen makes you feel funny inside, say no and tell your grown up.

Afterwards, play the mirror game and ask: "If something on a screen made you
feel funny inside, what would you do?" Then cheer the answer.

What stage is your child? Three questions, no sign up.
guidedchildhood.com/starter-pack

**Family account caption.**
We watched this one together. A photo shows a tiny slice of a person, and the
real you laughs, hugs and pulls silly faces.

The rule our little ones took away: if a screen makes you feel funny inside,
say no and tell your grown up.

Tonight, ask: "If something on a screen made you feel funny inside, what would
you do?" Then cheer the answer.

What stage is your child? Three questions, no sign up. The link is in our profile.

## Before it can go out, Justin's side

1. Watch both films once with the sound on.
2. Confirm the YouTube version is set as made for kids.
