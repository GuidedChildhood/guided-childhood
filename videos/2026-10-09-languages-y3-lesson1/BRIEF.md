# Year 3 languages, Lesson 1: the teach along film, in Spanish and in French

9 October 2026. Asked for by Justin: "a sample video for both Spanish and French
Year 3 from start to finish, better than Language Angels but take the best from
theirs". It is a sample of what every lesson in the languages scheme will feel
like on a classroom projector. It is hidden like the rest of languages: nothing
links to it from any public page.

workflow: general-video
flow: standalone
destination: classroom projector (teacher presses play, the class joins in), 16:9, 1920 by 1080
length: about 5 minutes per language, two renders from one build: renders/es.mp4 and renders/fr.mp4

## What the lesson teaches

The words, the sound of the day, the grammar point and the three "I can"
statements come from Year 3, Unit 1, Lesson 1 of the spines:
`content/languages/es/spine.json` and `content/languages/fr/spine.json`. Read
them; never invent a word or a sound the spine does not teach in that lesson.
Recycled words do not exist yet in lesson 1, so the starter is a "listen and
copy Bloop" warm up, not a recall.

## The run of the film, nine parts

1. **Bloop says hello** (about 10s). A new clip per language that uses only
   lesson 1 words (for Spanish: ¡Hola! ¡Buenos días!). The earlier sample
   clips in `assets/hello-es.mp4` and `assets/hello-fr.mp4` say "my name is",
   which is lesson 2, so they are only the reference for look and voice.
2. **Today we will** (about 10s). The three "I can" statements, read in English
   and shown one at a time.
3. **The sound of the day** (about 40s). The letters of the sound of the day
   build on screen, glow and get underlined; silent letters fade. The native
   voice says the sound, then three example words, each with the sound lit.
   A plain English tip on how to make the sound, the way a kind teacher would
   say it ("round your lips like you are blowing out a candle").
4. **New words** (about 90s). Each new word gets the same short routine, so
   children learn the routine as well as the word:
   listen twice, then a "Your turn" pause with a visible countdown ring
   (about 3 seconds) for the class to say it together, then the word builds
   in writing with its sound lit, then once more all together. A picture for
   concrete words, a gesture shown by Bloop for the rest.
5. **Bloop asks, you answer** (about 40s). A tiny conversation using only
   today's words. Bloop asks in the language, a "Your turn" pause, then a model
   answer. Then the class asks Bloop.
6. **Sing it** (about 50s). An original chant using only today's words, sung
   twice: first time listen, second time join in. Every word lights as it is
   sung (karaoke), with a simple beat composed in code. Write the chant
   ourselves; never borrow a tune or lyric from anyone.
7. **Spot the sound** (about 40s). Three quick questions: the voice says a
   word, three words appear, a countdown, then the right one glows and Bloop
   celebrates. Only words the children met today, plus one easy distractor.
8. **What we learned** (about 20s). The three "I can" statements again, each
   ticked. Then the job for home: teach someone at home today's words
   tonight (for Spanish, hello, good morning and goodbye). This is the home loop the whole of Guided Childhood
   runs on.
9. **Bloop says goodbye** (about 8s). A new clip, Bloop waving off, in each
   language.

Teacher friendly throughout: English instructions are spoken and shown as
captions, target language is always spoken by the native voice and always
shown in writing, and every "Your turn" pause is long enough for a class of
thirty seven year olds.

## Better than Language Angels, and what we take from them

From `research/languages/2026-10-09-language-angels-study.md`:

- **Match them:** native audio on every word and phrase.
- **Beat them:**
  - The sound and spelling link is taught in every lesson, not as a four lesson extra.
  - The words light up as they are sung.
  - Bloop reacts to the class.
  - Every word gets the same listen, repeat, read routine.
  - The job for home closes the loop.
- **Their pictures are flat clip art; ours are the Planet Friends** in the house style.

## Voices (ElevenLabs through Higgsfield `text2speech_v2`, variant `elevenlabs`)

| Use | Voice | Voice id |
| --- | --- | --- |
| Spanish (Castilian) | Marisol | `75e72cd5-011b-4130-a474-e8b1ab341f04` |
| French (metropolitan) | Celine | `57ccb351-84d7-54ba-afd4-26b566ca6023` |
| English teacher voice | Isla, a warm British voice from `list_voices`, the same one in both films | `7367e919-3069-5a0b-939e-dfb1c0fd91b4` |

The native voices are on approval from our pilot teacher, a native speaker,
so the voice ids live in `beats.json` and swapping one is an edit and a
re-render. Cost is about 0.15 credits a line; generate every line once, save
the files under `assets/audio/<lang>/`, and record the job ids.

## Bloop

Identity comes from the reference art `public/digi-squad/friends/bloop.png`,
uploaded to Higgsfield as media `f6969b5d-8152-4475-9fe0-cda44e7dfd13`.

- New clips on `seedance_2_0_mini`, 720p, 16:9, `image_references`, with the
  house preamble and the Playful register from
  `plans/2026-09-07-planet-friends-lesson-animation-system.md`.
- The prompt describes the ACTION only, never what Bloop looks like.
- Clips needed:
  - **Goodbye**, one per language.
  - **Listening.** Bloop cups an ear and waits, silent. It is reused in every pause.
  - **Celebrate.** Bloop hops and cheers, silent.
- Each clip costs about 8 credits. Silent clips set `generate_audio: false`.
- Anywhere else Bloop appears, use the cutout PNG animated in GSAP: hops,
  squash and stretch, bobbing to the beat.

## Look

- **Brand:** the house design system.
  - Nunito for everything, 800 to 900 for display.
  - IBM Plex Mono for eyebrows.
  - Cream #F9F8F6 canvas, ink #1A1A2E, butter #EDC35F accent, gold dark #C99A28.
  - Bloop green #6C9E38 lights the sound of the day.
- **Projector sizing:** a target language word is at least 140px tall at 1080p. English captions sit in the lower third.
- **Motion:** GSAP only. Subtle fade ups and staggered letter builds; nothing 3D, no purple, no dark tech look.

## Rules

- **Copy:**
  - No dashes of any kind in any on screen string or copy in code. French compounds such as "est-ce que" are real words, so keep a narrow allowance for target language strings only.
  - British English throughout.
  - Check every English line against `.claude/skills/content-engine/ai-tells.md`.
- **People:** no child's face and no synthetic person. Never name our pilot teacher or her school.
- **Music:** the chant beat is composed in code, never a library track.
- **Build:** the house way, as in `videos/2026-10-08-digi-launch/` (beats.json → build.mjs → index.html, one paused GSAP timeline, HyperFrames owns the audio). `node build.mjs --lang es` and `--lang fr` give the two films from one beats file.
- **Before showing Justin:**
  - Render a half size draft first.
  - Check it with contact sheets.
  - Check that every "Your turn" pause really is silent.

Report back in three things: what changed, whether it worked, what is needed from Justin.

## How it was built, 9 and 10 October 2026

- `beats.json` holds every line in both languages and the three voice ids;
  `node build.mjs --lang es|fr [--half]` writes `index.html`. One paused GSAP
  timeline; HyperFrames owns every sound.
- Nothing is timed by hand. `tools/measure.mjs` finds where the speech sits
  in each voice file; `tools/clips.mjs` strips the Seedance audio, blurs the
  small generated text tags on three clips, and finds where Bloop's mouth
  moves so the ElevenLabs line lands on it.
- Build guards: no dash in English, the ai-tells phrases, every target
  language word must be a Lesson 1 spine word, sound example or grammar
  example, and no sound may run into a "Your turn" window.
- The chant beat and the right answer chime are written as WAV by the build.
  Spanish chant: ¡Hola, hola, buenos días! / ¡Sí! ¡No! / ¡Hola, hola, buenos
  días! / ¡Adiós, adiós! French: Bonjour, bonjour ! / Merci ! Merci ! /
  Bonjour, bonjour ! / Au revoir ! Au revoir ! Ours, each sung twice.
- Gold text uses #8F6D1C, a darker gold than #C99A28, because the check
  needs 4.5:1 on cream. #C99A28 and butter stay for fills and borders.
- Spanish runs about 6 minutes 18 seconds (two sounds, five words); French
  about 5 minutes 4 seconds.
- `tools/verify.mjs` makes the contact sheet and reads the loudness of every
  Your turn window from the render.
