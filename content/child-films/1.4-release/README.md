# Film 1.4, When screens make you sad: the public versions

16 November 2026. Film 1.4 re-voiced in DiGi's voice (Tamsin, a little slower)
and built in both public shapes, the same way as 1.3
(`../1.3-release-test/README.md`). **Nothing here has been uploaded, posted or
scheduled.**

## Now in Isla's voice, 16 November

Justin heard Tamsin as not real enough and chose Isla on ElevenLabs
(`../voice-test-2/`, sample 5). Both public films below are now the Isla
versions: the YouTube cut is 4:59 and the family cut is 1:25. All 51 lines were
generated again (Higgsfield text2speech_v2, variant elevenlabs, preset
7367e919-3069-5a0b-939e-dfb1c0fd91b4), each one transcribed against its words
before the build. The original film is saved as `work/orig.mp4` (not
committed). The Tamsin notes below are kept as the record of the first
re-voice.

## What is in this folder

| File | What it is |
| --- | --- |
| `when-screens-make-you-sad-youtube-16x9.mp4` | The whole film in Isla's voice, 4:59, 1920 by 1080. Nothing is cut: the ending to the grown up ("every time they run to you instead of hiding, that's your win. Keep the door open.") is advice, not a promise about the child, so it stays. Six seconds at the stage check are added at the end |
| `when-screens-make-you-sad-family-9x16.mp4` | 1:25, 1080 by 1920, for Instagram and Facebook. From "Today we learn one big thing" to "you can still turn it over and tell", on cream, full captions under the picture, five seconds at the stage check |
| `when-screens-make-you-sad-thumbnail-1280x720.png` | YouTube thumbnail: "The uh oh feeling", the child and the grown up cheering beside a phone turned over |
| `when-screens-make-you-sad.en-GB.srt` | Subtitles for the YouTube version, 88 lines |
| `film.json` | The 51 lines with their times and captions, the vertical window and the card words |
| `isla-lines.json`, `isla-ledger.tsv` | The words sent to Isla, and every Higgsfield result file. The Tamsin files (`tamsin-lines.json`, `tamsin-ledger.tsv`) are kept as the record of the first re-voice |

How to rebuild, from `content/child-films/`:
`VOICE=isla python3 revoice/revoice.py 1.4-release build 1.4-release/work/orig.mp4`, then
`VOICE=isla python3 revoice/revoice.py 1.4-release finish`, then
`bash revoice/build.sh 1.4-release`.

## Cost and lines redone

- **25.4 credits**, read from the balance before and after (369.07 to 343.67).
- Line 2 ("Lovely. Now, my memory question.") came back twice with the first
  word clipped or doubled. It was sent a third time with a pause in front
  ("... Lovely.") and came back whole.
- Two jobs failed on Higgsfield's side and left no file (lines 19 and 31); both
  were resubmitted. Line 31 was resent without its opening quote mark.
- Line 44 sat in Higgsfield's queue for over ten minutes and was resubmitted.
  The first job then finished late, so that line was paid for twice. The late
  file is recorded in the ledger and not used.

## What was checked

- Every line was transcribed and matches its words.
- The last 30 seconds of the YouTube version were transcribed after the build
  and run to "Keep the door open. Remember, little one, all your feelings are
  okay. Every single one. And remember, screens are better together. See you
  next time." (On this pass the transcriber heard "screams" for "screens"; the
  line on its own transcribes as "screens".)
- Four frames of the vertical cut were looked at. Everything a person reads sits
  between y 285 and y 1550 and nothing overlaps.

## What was not checked

- **Nobody has listened to the whole film.** How the lines sound next to each
  other was not judged by ear.
- The subtitles come from a machine transcript and were read, not checked by
  ear.
- **One line for Justin to decide.** After the grown up is asked to say "you
  can always come to me", DiGi adds "Say it slowly, like you mean it. They'll
  remember it forever." That is a small promise about the child. It was not on
  the cut list, so it stays, but it could come out the same way the closing
  lines did in the other films.
- The vertical cut keeps the film's sound. It was built to read silent.

## Words to go with it, drafts

**YouTube title.** When screens make you sad. A film to watch with your 4 to 7 year old

**YouTube description.**
A five minute film to watch together. Sometimes a screen gives us the uh oh
feeling, a wobbly tummy or a fast heart. Your child learns two little steps:
turn it over, and go and tell.

Afterwards, play the high five game, and say: "You will never be in trouble
for telling me." Then keep that promise the first time it is tested.

What stage is your child? Three questions, no sign up.
guidedchildhood.com/starter-pack

**Family account caption.**
We watched this one together. When a screen gives you the uh oh feeling, your
body is being a good helper.

The two little steps our little ones took away: turn it over, go and tell.

Tonight, say: "You will never be in trouble for telling me." Then keep that
promise the first time it is tested.

What stage is your child? Three questions, no sign up. The link is in our profile.

## Before it can go out, Justin's side

1. Watch both films once with the sound on.
2. Confirm the YouTube version is set as made for kids.
3. Say whether "They'll remember it forever" stays.
