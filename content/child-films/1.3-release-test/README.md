# Film 1.3, The internet remembers: the release test

14 November 2026. One film taken all the way to both public shapes, for Justin
to approve before the other four are made the same way. **Nothing here has been
uploaded, posted or scheduled.**

## Justin's four answers, 14 November

1. The first five go out in the look they have now. A remake can replace them later.
2. The closing promise to the grown up is cut from the public versions.
3. One full test on 1.3 first, then the other four the same way.
4. Remakes start after the first five are out, with 1.6 first.

## Re-voiced again in Isla's voice, 16 November

Justin heard Tamsin as not real enough. From nine samples
(`content/child-films/voice-test-2/`) he chose number 5: Isla on ElevenLabs
(Higgsfield text2speech_v2, variant elevenlabs, preset
7367e919-3069-5a0b-939e-dfb1c0fd91b4). The two public films below are now the
Isla versions, 4:30 and 1:32; the Tamsin and Mabel versions are in git history.

- 44 lines, job ids in `isla-ledger.tsv`, the words in `isla-lines.json`.
  Every line transcribed against its words; all match.
- About 0.15 credits a line, so under 7 credits for the film.
- Rebuild: `VOICE=isla python3 ../revoice/revoice.py . build work/orig.mp4`,
  then `VOICE=isla python3 ../revoice/revoice.py . finish`, then
  `bash ../revoice/build.sh .`. The original film is the `full` segment of
  "The internet remembers" in `parent_lesson_segments`.

## Re-voiced in DiGi's voice, 16 November

Justin chose Tamsin, a little slower, as DiGi's voice
(`content/child-films/voice-test/`), and asked for 1.3 to be re-voiced first.
The two films below are now the Tamsin versions; the Mabel versions are in git
history.

- 44 lines generated one at a time on Higgsfield (seed_audio, preset
  9eb5a147-c322-4f8a-8bc5-a30679dfaf5c, speech rate minus 10). Job ids in
  `tamsin-ledger.tsv`, the words in `tamsin-lines.json`.
- **Cost: 20.9 credits for the whole film**, read from the balance before and
  after (75.37 to 54.47), including two lines redone. Budget about 21 credits a
  film for the other four.
- The name is said "Didgee" everywhere, as in the app.
- Each picture is slowed to fit its new line, so the pictures still match the
  words. The read runs at 120 words a minute while speaking, 110 with the pauses.
- The generator pads every line with silence and long gaps between sentences.
  `revoice.py` trims them to at most 0.45 seconds.
- Two lines came back wrong and were redone: one with a stray sound before it,
  one that dropped "and the child says" twice. That line now reads "Now the
  little one answers. Stop. Ask."
- The opening picture now holds for 14 seconds while the slower greeting plays.
  The old film held some pictures for 13.

How to rebuild: `python3 revoice.py build <1.3 full film>`, then
`python3 finish_tamsin.py`, then `bash build_tamsin.sh`.

## What is in this folder

| File | What it is |
| --- | --- |
| `the-internet-remembers-youtube-16x9.mp4` | The whole film in Tamsin's voice, 4:59, 1920 by 1080. The line "you just gave your child a habit that will help them for years. Lovely work." is cut. Six seconds at the stage check are added at the end |
| `the-internet-remembers-family-9x16.mp4` | 1:40, 1080 by 1920, for Instagram and Facebook. The one big thing from the film on cream, full captions under the picture so it reads with the sound off, five seconds at the stage check |
| `the-internet-remembers-thumbnail-1280x720.png` | YouTube thumbnail |
| `the-internet-remembers.en-GB.srt` | Subtitles for the YouTube version, 75 lines |
| `build.sh`, `cards.mjs`, `captions.py` | How the first (Mabel) version was made |
| `revoice.py`, `finish_tamsin.py`, `build_tamsin.sh` | How the Tamsin version is made, so the other four are a rerun with new words |

## What was checked

- The new ending was transcribed after the cut. It runs "Of course she did.
  Remember, screens are better together. See you next time." The promise is gone.
- Frames from both films were looked at: the end card, the vertical frame, the
  captions and the join.
- Everything a person reads in the vertical cut sits between y 285 and y 1550.

## What was not checked

- **Nobody has listened to the whole film.** Each of the 44 lines was
  transcribed and matches its words, and the ending was transcribed again after
  the build. How the lines sound next to each other was not judged by ear. The old
  films have no music under the voice (their pauses measure as silence), so
  nothing was lost by replacing the sound.
- **The subtitles were written from a machine transcript and read, not checked
  by ear.** Read them against the film once before they are uploaded.
- The vertical cut keeps the film's sound. It was built to read silent, and was
  not judged with the sound on.

## Words to go with it, drafts

**YouTube title.** The internet remembers. A film to watch with your 4 to 7 year old

**YouTube description.**
A four minute film to watch together. Ellie the elephant never forgets, and the
internet is a little bit like Ellie. Your child learns one small rule: stop,
ask a grown up, then share.

Afterwards, make the ask first sign together and pop it near the tablet.

What stage is your child? Three questions, no sign up.
guidedchildhood.com/starter-pack

**Family account caption.**
We watched this one together on the sofa. Ellie the elephant never forgets, and
it turns out the internet is a bit like Ellie.

The rule our little ones took away: stop, ask a grown up, then share.

Tonight, say: "Stop. Ask. Then share. Shall we make our sign?"

What stage is your child? Three questions, no sign up. The link is in our profile.

## Before it can go out, Justin's side

1. Watch both films once with the sound on.
2. Say where the YouTube version goes, and confirm it is set as made for kids.
3. Say yes, and the other four (1.1, 1.5, 1.2, 1.4) are made the same way.
