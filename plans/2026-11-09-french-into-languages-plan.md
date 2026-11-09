# French: the pilot teacher's KS2 lessons, brought into the languages tab (9 November 2026)

Justin, 9 November 2026: check what we have for the language section, and put the pilot
teacher's French lessons on the platform as a separate tab from the digital section,
brought into its structure, with ideas on how to make it better. Her site:
french-curriculum.pages.dev.

Privacy: she is the pilot teacher in `plans/2026-10-09-languages-plan.md`, AMBER in
`content/brand-story/founder-context.md`. Her name and her school appear in no page,
copy or commit. The pages say "the scheme", never whose it is.

## What we had (audit)

- `/languages` exists as a gated shell: its own code (`SCHOOLS_LANGUAGES_CODES`), its own
  cookie, hidden behind `LANGUAGES_LIVE` (404 to strangers), guarded by
  `scripts/check-languages-door.mjs`. The home page says "Year 3, Unit 1 is being built
  first". **No lessons, no tables, no content.** The 9 October plan's Phase 0 spine was
  never started.
- So her site is not competing with anything: it is the content the shell was waiting for.

## What her site has

- Years 3 and 4, six half term units each (12). Five marked ready (Y3 HT1, HT2; Y4 HT1,
  HT2, HT3) with lessons, vocabulary, I can statements, phonics sound, grammar, culture,
  exit questions and word mats. Two units (Y3 HT2 Les couleurs, Y4 HT2 Je peux) carry the
  full set: 14 interactive slide decks, songs (MP4), and about 90 printable PDFs in class,
  adapted and inclusion versions.
- An assessment model per unit: national curriculum statements (L1, L2, S1 to S4, R1 to
  R3, W1 to W4) each with a working towards, expected and greater depth descriptor, and a
  SOLO taxonomy table.
- All of it lives in four data files (`units.js`, `curriculum.js`, `codes.js`,
  `sequence.js`). That is what makes this cheap: the pages can be generated, not retyped.
- The media is heavy: **186 MB for the two full units**, mostly decks (about 1.9 MB each,
  images inline) and song videos.

## What gets built (this PR)

1. **`scripts/languages/sync-french.mjs`**. Fetches the four data files from her site,
   parses them as data (never runs her code), drops anything personal or operational
   (form key, artifact links), turns dashes in her English copy into words to match the
   house rule, and writes `schools/lib/languages/fr.json`. She keeps editing her own site
   while she builds; one command brings the changes across.
2. **`schools/lib/languages/french.ts`**: the typed reader over that file (years, units,
   lessons, files, the statements) and the one place the media origin is named.
3. **The pages, in our structure and our design system** (Nunito, Plex Mono, butter on
   cream, the hub's cards and the scheme's lesson page shape):
   - `/languages`: French opens, Spanish says it is coming.
   - `/languages/fr`: the year at a glance, Year 3 and Year 4, six units each.
   - `/languages/fr/[unit]`: the unit page (sound, words, grammar, culture, I can, lessons,
     songs, word mats, assessment and teacher files).
   - `/languages/fr/[unit]/[lesson]`: the lesson page, like `/lesson/[module]`: what pupils
     learn, the words, the activity, the sheets in three levels, and one button to teach.
   - `/languages/fr/[unit]/[lesson]/teach`: her deck full screen on the board.
   - `/languages/fr/coverage`: the KS2 languages statements against every unit, generated.
4. **The tab.** `navAccess()` learns about the languages cookie, and `SiteNav` shows a
   **Languages** tab to anyone holding a languages code, beside the digital rooms but
   separate from them. Strangers still see nothing (the 9 October hidden rule holds), and
   the guard is updated to allow exactly that one conditional link and to fail if it ever
   becomes unconditional.

**Media stays on her host for now.** Decks, songs and PDFs open from
french-curriculum.pages.dev (it allows framing and cross origin). 186 MB for two units
does not belong in git, and her files are still changing. When a unit is final, its media
moves to Supabase storage and the origin constant changes; no page changes.

## Ideas to make it better (for Justin and her to choose from, not built)

Ordered by what a school would notice first.

1. **One click delivery and assessment.** Her model already has the descriptors; the spec
   in `plans/2026-11-09-one-click-tracking-spec.md` gives each lesson a Mark delivered
   button and a three level judgement against her own L, S, R and W statements. Her paper
   class tracker becomes automatic.
2. **Words that come back.** Her phonics note already does retrieval within a half term.
   Carry every word forward: each unit's starter pulls words due again from earlier units
   (about 1, 3, 7 and 21 days, then once a unit, as the 9 October plan sets out), and a
   check fails if a word is taught once and never seen again.
3. **More high frequency language beside the topics.** Colours, animals and sports are
   good hooks; the 9 October plan (citing the Ofsted 2021 languages research review) warns
   that topic nouns alone leave pupils unable to build sentences. Thread the verbs and
   structures (avoir, être, aller, il y a, j'aime, the negative) through every topic so a
   Year 4 pupil can say new things, not just name things.
4. **Native audio for every word.** A tap on any word in the word list or deck plays it.
   The sync can generate the list of words that still need a recording.
5. **The home loop.** Ten minutes a day at home with stars in the parents app, using the
   same word list. School languages get under an hour a week; this is the gap nobody else
   fills, and it is what we already do for online safety.
6. **Lighter decks.** At 1.9 MB with images inline, a deck takes seconds on school wifi
   and has to reload in full. Shared image files would make each one far smaller and cache
   across lessons.
7. **The four empty Y3 and Y4 units and the Spanish twin.** Same data shape, so each new
   unit she finishes appears here on the next sync.
8. **A KS2 to KS3 transition record** per class, printed from what was delivered, so
   secondary does not start again from bonjour.

## Checks

Typecheck, `check-languages-door` (with its new rule), ai-tells and the scale and hex
guards on every new file, Playwright at 390 and 1440 with a made up local languages code
(never a real one): no code gets a 404, a French code sees the tab and every page, a
scheme code sees no tab.
