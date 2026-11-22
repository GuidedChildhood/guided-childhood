# French lesson films

Our own film for each KS2 French lesson: Nova and Bloop in their French look,
native French voices, our own song made with the program the Planet Friends rap
used (ACE-Step on Justin's Mac). Plan: `plans/2026-11-18-french-lesson-films-plan.md`.

## The engine
- `engine/film.html`: the stage, 1280 by 720, house tokens. The approved
  French cutouts, moved in code (GSAP), never redrawn. Built from a lesson's
  `cue.json`: who speaks, when, the word on screen, its colour, whisper or shout.
- `engine/render.mjs`: steps the timeline frame by frame and lays the sound
  under it. `node content/languages/fr-films/engine/render.mjs <lesson> <audio> <out.mp4>`

## A lesson folder (`y3-ht2-1`, Year 3 Colours lesson 1, the pilot)
- `words/`: every French word recorded once (Higgsfield text2speech, ElevenLabs
  engine): `nova-*` soft (voice Celine, provisional), `bloop-*` loud (voice Andre,
  provisional). These also replace the robot voice when the deck moves into our player.
- `cue.json`: the timeline. Today it times the preview to the word recordings.
- `les-couleurs-1-preview.mp4`: 26 seconds, the preview. Nova whispers the five
  colours, Bloop shouts them, Bravo.
- `lyrics.txt`, `style.txt`, `song.py`, `make_song.sh`: the song. On the Mac:
  `sh content/languages/fr-films/y3-ht2-1/make_song.sh 42`. Then the cues move
  to the song's beats and the film renders again with the song under it.

Cost so far: 2.55 credits (five voice samples and twelve word recordings).
