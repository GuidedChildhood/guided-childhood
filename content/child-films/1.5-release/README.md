# Film 1.5, Real or pretend?: the public versions

16 November 2026. Film 1.5 re-voiced in DiGi's voice (Tamsin, a little slower)
and built in both public shapes, the same way as 1.3
(`../1.3-release-test/README.md`). **Nothing here has been uploaded, posted or
scheduled.**

## Now in Isla's voice, 16 November

Justin heard Tamsin as not real enough and chose Isla on ElevenLabs
(`../voice-test-2/`, sample 5). Both public films below are now the Isla
versions: the YouTube cut is 4:15 and the family cut is 1:26. All 45 lines were
generated again (Higgsfield text2speech_v2, variant elevenlabs, preset
7367e919-3069-5a0b-939e-dfb1c0fd91b4), each one transcribed against its words
before the build. The original film is saved as `work/orig.mp4` (not
committed). The Tamsin notes below are kept as the record of the first
re-voice.

## What is in this folder

| File | What it is |
| --- | --- |
| `real-or-pretend-youtube-16x9.mp4` | The whole film in Isla's voice, 4:15, 1920 by 1080. The line "And grown up, you just gave your child a question they'll use for the rest of their life." is cut, picture and sound. Six seconds at the stage check are added at the end |
| `real-or-pretend-family-9x16.mp4` | 1:26, 1080 by 1920, for Instagram and Facebook. From "Today we learn one big thing" to "Even grown ups have to stop and think", on cream, full captions under the picture, five seconds at the stage check |
| `real-or-pretend-thumbnail-1280x720.png` | YouTube thumbnail: "Real or pretend?", the real dog and the cartoon dog |
| `real-or-pretend.en-GB.srt` | Subtitles for the YouTube version, 76 lines |
| `film.json` | The 45 lines with their times and captions, the cut, the vertical window and the card words |
| `isla-lines.json`, `isla-ledger.tsv` | The words sent to Isla, and every Higgsfield result file. The Tamsin files (`tamsin-lines.json`, `tamsin-ledger.tsv`) are kept as the record of the first re-voice |

How to rebuild, from `content/child-films/`:
`VOICE=isla python3 revoice/revoice.py 1.5-release build 1.5-release/work/orig.mp4`, then
`VOICE=isla python3 revoice/revoice.py 1.5-release finish`, then
`bash revoice/build.sh 1.5-release`.

## Cost and lines redone

- **20.2 credits**, read from the balance before and after (414.47 to 394.27),
  including three lines redone.
- Line 23 ("I'll wait.") came back with an extra "I'll" after it.
- Line 30 came back as "You are so clever" instead of "You were so clever".
- Line 33 dropped "Then a great big high five". The voice was sent it without
  the quote marks the second time ("When we are not sure, we ask. Then, a great
  big high five!") and it came back whole. The caption is unchanged.

## What was checked

- Every line was transcribed and matches its words.
- The last 30 seconds of the YouTube version were transcribed after the build:
  "Got it? Brilliant. Remember, screens are better together. See you next
  time." The promise is gone. (The transcriber also wrote "Thanks for watching"
  over the silent end card. Nothing is said there; it is a known habit of the
  transcriber on silence.)
- Four frames of the vertical cut were looked at. Everything a person reads sits
  between y 285 and y 1550 and nothing overlaps.

## What was not checked

- **Nobody has listened to the whole film.** How the lines sound next to each
  other was not judged by ear.
- The subtitles come from a machine transcript and were read, not checked by
  ear. In the recap the old film has a short sound after "Can you say it?" that
  could not be made out. It was left out, so the pause is there for the child to
  answer.
- The pictures carry the old film's burned in labels, and two of them use
  punctuation the house rules would not ("SNUGGLE UP" and "PAUSE AND CHAT" have
  a long dash, "GROWN-UPS" a hyphen). They are part of the drawings and were
  not changed. The grown ups label shows in the vertical cut.
- The vertical cut keeps the film's sound. It was built to read silent.

## Words to go with it, drafts

**YouTube title.** Real or pretend? A film to watch with your 4 to 7 year old

**YouTube description.**
A four minute film to watch together. Some things on screens are made up, even
when they look real, and the clever thing is to ask. Your child learns the
magic question: "Is this real?"

Afterwards, play the real or pretend game. When they ask "Is this real?", say:
"Good question. Let's look together."

What stage is your child? Three questions, no sign up.
guidedchildhood.com/starter-pack

**Family account caption.**
We watched this one together. One dog drives a car to the moon, one licks your
face. Some things on screens are pretend, even when they look real.

The question our little ones took away: "Is this real?"

Tonight, when they ask it, say: "Good question. Let's look together."

What stage is your child? Three questions, no sign up. The link is in our profile.

## Before it can go out, Justin's side

1. Watch both films once with the sound on.
2. Confirm the YouTube version is set as made for kids.
