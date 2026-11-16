# Film 1.2, Kind words on screens: the public versions

16 November 2026. Film 1.2 re-voiced in DiGi's voice (Tamsin, a little slower)
and built in both public shapes, the same way as 1.3
(`../1.3-release-test/README.md`). **Nothing here has been uploaded, posted or
scheduled.**

## What is in this folder

| File | What it is |
| --- | --- |
| `kind-words-on-screens-youtube-16x9.mp4` | The whole film in Tamsin's voice, 6:01, 1920 by 1080. It keeps "And grown up, one kind message tonight." and cuts what came after it, picture and sound: "plants kindness for life", the line that the child now knows they can always come to you, and "You're doing a wonderful job". Six seconds at the stage check are added at the end |
| `kind-words-on-screens-family-9x16.mp4` | 1:26, 1080 by 1920, for Instagram and Facebook. From "Today we learn one big thing" to "Kind words land warm, like a hug, like sunshine", on cream, full captions under the picture, five seconds at the stage check |
| `kind-words-on-screens-thumbnail-1280x720.png` | YouTube thumbnail: "Kind words land warm", the paper plane through the window |
| `kind-words-on-screens.en-GB.srt` | Subtitles for the YouTube version, 99 lines |
| `film.json` | The 56 lines with their times and captions, the cut, the vertical window and the card words |
| `tamsin-lines.json`, `tamsin-ledger.tsv` | The words sent to the voice, and every Higgsfield job id with its result file |

How to rebuild, from `content/child-films/`:
`python3 revoice/revoice.py 1.2-release build <1.2 full film>`, then
`python3 revoice/revoice.py 1.2-release finish`, then
`bash revoice/build.sh 1.2-release`.

## Cost and lines redone

- **25.2 credits**, read from the balance before and after (394.27 to 369.07).
  The longest of the four (56 lines, 663 words).
- No line needed redoing. The machine transcript missed "Hi." at the end of
  line 13, but a second model heard it, and the pause before it is where the
  film types the word.
- Granddad was sent to the voice and is captioned "Grandad", the UK spelling.

## What was checked

- Every line was transcribed and matches its words.
- The last 30 seconds of the YouTube version were transcribed after the build:
  "Got it? Brilliant. And, grown up, one kind message tonight. Remember,
  screens are better together. See you next time." The promise is gone.
  (The transcriber also wrote "Thanks for watching" over the silent end card.
  Nothing is said there.)
- Four frames of the vertical cut were looked at. Everything a person reads sits
  between y 285 and y 1550 and nothing overlaps.

## What was not checked

- **Nobody has listened to the whole film.** How the lines sound next to each
  other was not judged by ear.
- The subtitles come from a machine transcript and were read, not checked by
  ear.
- The closing scenes (from "Before I go") are still in the warmer, different
  drawing style the inventory noted. They were not redrawn.
- The vertical cut keeps the film's sound. It was built to read silent.

## Words to go with it, drafts

**YouTube title.** Kind words on screens. A film to watch with your 4 to 7 year old

**YouTube description.**
A five minute film to watch together. The screen is not glass, it is a window,
and on the other side is a real person with real feelings. Your child learns
that kind words land warm, and that if someone is unkind it is never their
fault.

Afterwards, ask: "Who shall we send one kind message to?" Then send it
together.

What stage is your child? Three questions, no sign up.
guidedchildhood.com/starter-pack

**Family account caption.**
We watched this one together. Every message is a little paper plane, and a real
person catches every one.

What our little ones took away: kind words land warm, and if someone is unkind,
it is never your fault. Go and tell.

Tonight, ask: "Who shall we send one kind message to?" Then send it together.

What stage is your child? Three questions, no sign up. The link is in our profile.

## Before it can go out, Justin's side

1. Watch both films once with the sound on.
2. Confirm the YouTube version is set as made for kids.
3. Decide whether the closing scenes' change of drawing style is fine for YouTube.
