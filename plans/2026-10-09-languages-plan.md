# Languages: French and Spanish, age by age, lesson by lesson

## Context

Justin wants a French and Spanish curriculum that beats every other provider. It should take the best of what each provider does, use current learning science, build up age by age and lesson by lesson, and have the statutory mapping and admin done. The teacher presses a button to teach or print.

**Decided (9 Oct 2026):**
- Languages live inside Guided Childhood, schools first.
- They stay hidden from the site until finished.
- They sit behind their own licence code, separate from the online safety code.

**Why now:** every primary school in England must teach a language in Years 3 to 6. Duolingo for Schools closes its classrooms on 31 July 2027, so a pack ready for September 2027 lands in a real gap. Our home loop (ten minutes a day with stars) answers the weakness of school languages: under an hour a week of exposure.

**Defaults taken (Justin can overturn any of them):**
- KS2 first, then KS3, then early years and KS1 songs, then GCSE.
- **French and Spanish together for primary** (confirmed 9 Oct: the first pilot teacher teaches both at primary). One shared spine frame, with two word lists and two sound sequences.
- Native speaker recorded audio before the paid launch. Synthetic voices are allowed in the pilot only.

**Step one of the build:** copy this plan to `plans/2026-10-09-languages-plan.md` and open the draft PR that claims the lane.

## Where it lives, and the first school (added 9 Oct 2026)

Our first pilot teacher, a primary teacher who teaches both French and Spanish, will teach from it and wants her school to have it. The best home is the **schools app, under its own gated `/languages` area**. It does not need a separate site, and it should not go in the parent app.

- **Her school needs no logins and no pupil data.** The schools app holds no accounts, so there is nothing for a school to clear with its data protection officer before it starts. Staff type one code.
- **Her own code.** Her school gets a languages code (`SCHOOLS_LANGUAGES_CODES`, e.g. `code:es`) on day one. She shares it with colleagues, and it opens languages only. It works while everything stays hidden from the public.
- **Teach and print are already built** in that app (the projector, teacher script, print room and hub), so she presses one button to teach or to print.
- **Her school is the design partner.** Phase 1 builds the year group and language she teaches first. She is the first pilot and the first native reviewer of the Spanish (with her consent for any voice recording).
- **Privacy:** her name and her school's name never appear in any copy, page or commit. The pilot is family, AMBER in `content/brand-story/founder-context.md`.

## What we take from each provider (structure and ideas only, never their text)

| Provider | Best thing | How we beat it |
|---|---|---|
| NCELP / Rachel Hawkes | Phonics, high frequency vocabulary and explicit grammar as the three pillars | Keep the pillars, add the non specialist ease and the home loop |
| Language Angels | A non specialist can teach it, with native audio | The same, plus a word for word teacher script and a pronunciation tip on every slide |
| Kapow, Twinkl | Done for you planning and coverage | Generated from the lesson rows, so it never drifts |
| Duolingo | Spaced repetition, streaks, short daily practice | Per child word bank at home, with parent involvement and stars |
| Oak | Free, sequenced, quality assured | Our sequence is a guarded spine, checked in CI |

**Licences:** NCELP resources are non commercial, so we study them and never reuse them. The DfE programme of study and the GCSE word lists are Crown copyright and can be quoted. Both points are to be verified in Phase 0.

## Images and animation: better than theirs, and ours

Justin, 9 Oct: the images and animations must be much better than the market's.

- **Study, then make.** We look at a provider's lessons (including Justin's own Language Angels subscription) only to note what they do and where it falls short: pacing, how a word is shown, how a song is animated, what a non specialist teacher needs. The output is a written gap list.
- **Never their assets.** We take no screenshots into the repo, no downloads, and never feed their images or videos into Higgsfield as a reference or for image to image. A subscription licence covers teaching with their content, not copying it into a rival scheme.
- **Every image and animation is ours,** made on Higgsfield from our own Planet Friends reference art (`digi-squad/`) in the house style, or animated in code with GSAP and HyperFrames.
- **Third party stock** is used only under a licence that allows commercial use (for example Pixabay), and the licence is recorded per asset.

## The learning design (each idea maps to a feature)

1. **Sounds first.** Every lesson opens with a three minute phonics slot that teaches sound and spelling links in a set order across Years 3 and 4.
2. **Words chosen by frequency, topics as context.** The spine is about 450 high frequency words for KS2. "Colours, fruit, animals" is the trap the Ofsted languages research review (2021) names.
3. **Grammar taught explicitly, little and often,** and recycled in every later unit.
4. **Spaced retrieval.**
   - Every word comes back at about 1, 3, 7 and 21 days, then once per unit.
   - The class starter is built from the words that are due.
   - At home, a per child word bank schedules reviews in the child app.
5. **Interleaving.** Old words and grammar are mixed into new practice.
6. **Readable stories.** Each unit has a mini reader that uses at least 95% known words.
7. **Speaking in every lesson:** choral repetition, partner talk and reading aloud.
8. **Dictation**, which the new GCSE now tests, starts in Year 4.
9. **A picture for every concrete word**, in house style art with the Planet Friends.
10. **Movement and songs** for the youngest classes.
11. **A real 70% pass** in the existing player, so a lesson cannot be tapped through.

## Age ladder

| Band | Ages | Status in England | Focus |
|---|---|---|---|
| EYFS, KS1 | 4 to 7 | Not statutory | Songs, sounds, movement (Phase 4) |
| **KS2, Y3 to Y6** | **7 to 11** | **Statutory** | Phonics, about 450 words, core grammar, short reading and writing |
| KS3, Y7 to Y9 | 11 to 14 | Statutory | Builds directly to the GCSE word lists |
| KS4 | 14 to 16 | GCSE, optional | DfE 2022 subject content (Phase 5) |

**Shape:** 6 units a year × 6 lessons = 36 lessons a year, so 144 lessons per language for KS2. Lessons are about 40 minutes, with a core and an extension like the online safety scheme.

## Architecture: reuse almost everything, keep it sealed off

**Separate tables, not new rows in `school_lessons`.** This stops any leak into `/curriculum`, the module counts, the tracker, the guards that count modules, or `lib/quests/star-lesson-catalogue.ts`.

Migration number: the next free number at claim time. 369 or later; re-check origin/main and open PRs right before the first push.

- `schools.language_units`: lang, year, unit, title, words, grammar, sounds, pos_hooks.
- `schools.language_lessons`: the same slide JSONB shape as `school_lessons`, so `shared/components/LessonPlayer.tsx` plays it unchanged. Adds lang, year, unit, lesson, words[], grammar[], sounds[], teacher_notes.
- `schools.language_words`: lang, word, gender, plural, English gloss, frequency rank, first lesson, audio path, image key.
- `kid_word_reviews` (Phase 3, child data, so a human reviews it before merge): child, word, due_at, interval, ease.

**Content source:** `content/languages/{es,fr}/y3/u01-l01.json`, using the same contract as `content/modules/*.json`. A generator modelled on `scripts/module-to-migration.mjs` writes the SQL, and the hash proof follows `scripts/module-string-hash.mjs`.

**Player:**
- New slide types in `shared/lesson-slides.ts`: `listen`, `say`, `match`, `sounds`, `dictation`, `story`, `song`.
- Their interactives go in `shared/components/interactives/index.tsx`.
- `parseSlides()` already skips unknown types, so older surfaces stay safe.

**Voice:**
- Stored audio files go in Supabase storage, one per word and sentence.
- `lib/voice/*` is hard set to en-GB and needs a language parameter.
- Speech recognition (optional "say it" feedback) runs in the browser only. No child audio is ever stored.

**The separate licence code**, extending `schools/lib/access.ts`:
- New env list `SCHOOLS_LANGUAGES_CODES`. Each entry is `code:es|fr|both`, and a bare code means both.
- Its own cookie, `gc_languages_access`, signed the same way.
- `schools/proxy.ts` gates `/languages/*` on that cookie only.
- An online safety licence does not open languages, and a languages code does not open the online safety scheme.
- `/unlock` accepts either kind of code and sets the right cookie.

**Hidden until finished:**
- Env flag `LANGUAGES_LIVE`, off by default. While it is off, every `/languages/*` route returns 404 unless the visitor holds a valid languages code. That lets pilot schools and Justin in.
- No links from nav, `/curriculum`, `/pricing`, the sitemap or the parent and child apps.
- A `noindex` header on all language routes.
- A new guard, `scripts/check-languages-hidden.mjs`, fails CI if any file outside `schools/app/languages/` links to `/languages` while the flag is off.

## Press a button: teach and print (reuse the existing routes)

**Teach:**
- `schools/app/languages/teach/[lesson]`: wraps the existing projector and teacher script setup from `schools/app/teach/[module]/page.tsx`.
- `.../run`: the run sheet.

**Print** (`schools/app/languages/print/[lesson]/*`, built on `schools/components/print/kit.tsx` and `PrintButton`):
- The paper pack
- Worksheet
- Vocabulary flashcards
- Phonics mat
- Knowledge organiser, with a QR code to the audio
- Starter and exit quiz
- Dictation sheet
- Mini reader booklet
- End of unit test

## Admin done for you (generated from the rows, never hand kept)

This follows the RSHE pattern (`shared/schools-rshe-2026.ts`, `scripts/rshe/*`, `scripts/check-rshe-coverage.mjs`).

**Statutory mapping:**
- `shared/languages-pos.ts`: the KS2 and KS3 programme of study statements, verbatim.
- `scripts/languages/` generator and a CSV coverage matrix.
- `scripts/check-languages-coverage.mjs`, with a ratchet that only ever comes down.

**Hub (`/languages/hub/*`):**
- Long term plan
- Progression map (phonics, vocabulary and grammar strands, Y3 to Y6)
- Medium term plan per unit
- Coverage matrix
- Assessment framework (four skills, end of unit checks)
- Class tracker
- KS2 to KS3 transition record, printed per class. This fixes the known pain of secondary schools starting again from zero.
- Subject leader deep dive pack (intent, implementation, impact)
- Languages policy template
- SEND and EAL adaptations
- Parent letter
- Staff pronunciation CPD
- Data protection note on in-browser speech

## Quality guards (new, plus existing ones scoped to languages)

**Existing:**
- `check-module-contract.mjs`, run on language lesson JSON.
- `npm run ai-tells`. French hyphenated words (est-ce que, vingt-et-un) must pass as real compounds; confirm the guard allows this or add a target language allowance. Dialogue goes in speech bubbles, never dialogue dashes.

**New:**
- `check-language-vocab.mjs`:
  - Every target language word in a lesson is either taught there or taught earlier.
  - Every word has audio and an English gloss.
  - Stories use at least 95% known words.
- `check-language-spacing.mjs`: every taught word is revisited at least N times across the next units.
- `check-languages-coverage.mjs` and `check-languages-hidden.mjs`, described above.

## How we make 144 lessons to a high standard (the pipeline)

1. **Spine first, per language.** The sound sequence, frequency word list, grammar sequence and unit map for Y3 to Y6, saved as `content/languages/{lang}/spine.json`. Everything else is generated against it.
2. **Generate lesson JSON from the spine** with agents, then run the guards.
3. **Panel review per unit**, with four lenses: pedagogy, native speaker, non specialist teacher and child. The design lens follows the panel memory.
4. **A native speaker human signs off** every unit before it can be marked finished.
5. **Audio and art** are rendered or recorded from the word table, using existing character art only.
6. **Full play through** of every lesson, teach mode and every print, on mobile and desktop.

## Phases

| Phase | What | Done when |
|---|---|---|
| 0 | Claim lane and draft PR, plan into `plans/`. Research brief verifying: statutory text, Ofsted research review, Curriculum and Assessment Review 2025 outcome for languages, GCSE content, competitor teardown with prices and licences. **KS2 spines for French and Spanish** | Both spines pass review, with the first pilot teacher as reviewer |
| 1 | Engine: tables, languages code gate, `LANGUAGES_LIVE` flag, new slide types, audio, print kinds, hub skeleton. **Unit 1 of the year group she teaches first, in French and Spanish (12 lessons), end to end.** Her school gets its languages code | She teaches it in her school, hidden from the public |
| 2 | The rest of that year in both languages, plus the full admin bundle. Her school is the pilot; add 1 or 2 more schools in spring term 2027 | Pilot feedback filtered through `feedback-filter` |
| 3 | The other KS2 years in both languages. Child app home practice and word bank behind the same flag | KS2 complete in both languages with native sign off |
| 4 | Launch for September 2027: pricing, open selling pages, flag on. Then early years and KS1 songs | Live |
| 5 | KS3, then GCSE | Later |

## Verification (every phase)

**Guards:**
- `npm run ai-tells`, `module-contract` on language JSON, and the new vocabulary, spacing, coverage and hidden guards.
- `npm run context-guard` if CLAUDE.md changes.

**Hidden and gated, checked in the browser pane:**
- With the flag off and no code, `/languages` returns 404.
- With a languages code it returns 200.
- An online safety code still returns 404.
- A languages code does not open `/teach/*`.
- Public pages show no link to `/languages`.

**Teach and print:**
- Play every lesson through to a real pass.
- Screenshot every print route at A4 with `.claude/skills/webapp-testing`, on mobile and desktop.
- `scripts/check-print-fit.mjs` for page counts.

**People:** native speaker sign off per unit, and the review.md check before every push.

## Open for Justin (not blocking Phase 0)

- Which year group the pilot teacher teaches first: that decides Unit 1. KS2 first and recorded native voices remain defaults.
- Whether she reviews the French as well as the Spanish. A second native French reviewer is advised either way.
- Who records the audio: a hired native speaker per language, or someone he knows. Family is AMBER privacy, so naming them in copy is his call.
- Price of the languages licence, decided before Phase 4.
