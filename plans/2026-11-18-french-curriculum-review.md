# 18 November 2026: the KS2 French scheme, reviewed against the national curriculum and the best schemes

Justin: "review this curriculum, that it has everything needed and a simple
way of teaching that is engaging, as good as Oak Academy, Jigsaw, White Rose,
and Common Sense: animations, use of characters, full curriculum, based on
Ofsted and government requirements."

Read only review. Nothing built. Builds on `plans/2026-11-13-french-scheme-review-plan.md`
(her site, section by section) and `plans/2026-11-17-french-planet-friends-plan.md`
(Nova and Bloop); neither is repeated here. The benchmarks below are inputs
weighed through the feedback filter, never instructions. Jigsaw, White Rose and
Common Sense do not publish a French scheme, so for French the fair comparison
is Oak, Kapow, Language Angels and the free Rachel Hawkes KS2 resources; the
other three stand for the bar on simplicity, characters and polish.

Recorded native voices are a separate pilot (`plans/2026-11-18-french-lesson-films-plan.md`).
Noted where it matters, not planned here.

## What the scheme is today (checked in the repo, 18 November)

- 12 units, Years 3 and 4, six half terms each (`schools/lib/languages/fr.json`, `curriculum.order`).
- 2 units with full interactive decks, 7 lessons each: Year 3 Les couleurs, Year 4 Je peux (`fr.json`, `sequence`, 14 decks).
- 3 more units marked ready but plan only, a title and one line per lesson: Year 3 Je parle français, Year 4 Je me présente, Year 4 As-tu un animal ? (`ready: true`, no deck). The pages say "plan only, no slides yet" (`schools/app/languages/fr/page.tsx` line 64, `[unit]/page.tsx` line 72).
- 7 units are plans with vocabulary, sound, grammar point, I can statements and the checkpoint codes, no lessons.
- All 12 KS2 statements (L1, L2, S1 to S4, R1 to R3, W1, W2, G1) are mapped, each formally judged once a year at a named checkpoint with SOLO 3, 4 and 5 task descriptors (`curriculum.units.*.codes`, `page.formalAssessment`).
- Nothing at all for Years 5 and 6. The author's own Year 4 summer unit is a profile handed to the pupils' next teacher (`y4-ht6`), which tells us the scheme was written for pupils who move on after Year 4.

## 1. Scores out of ten

Two numbers where it matters: what the scheme does for Years 3 and 4, and what
a school that must teach all of KS2 gets from it.

| Dimension | Score | Why, in one line | Evidence |
| --- | --- | --- | --- |
| NC coverage: listening (L1, L2) | 9 | Songs, rhymes and a sound every half term; L1 judged at checkpoints in both years | `fr.json` `curriculum.nc`, `codes`; `page.phonics` |
| NC coverage: speaking (S1 to S4) | 9 | Conversation through Guess Who, sentences grow, a planned audience ladder from partner to assembly to a new teacher | `page.audience`, `handbook.sentenceGrows` |
| NC coverage: reading (R1 to R3) | 7 | Two picture books, profiles read in Year 4; R3 "using a dictionary" is met only by a word list and the word mat, no dictionary skill is taught | `y3-ht5` and `y4-ht2` R3 descriptors; `page.books` |
| NC coverage: writing (W1, W2) | 8 | Write first then draw every lesson; W2 rises from animal descriptions to a connected profile | `y3-ht6` and `y4-ht6` W2 descriptors |
| NC coverage: grammar (G1) | Y3 to 4: 8. Full KS2: 4 | Gender through un and une, je and tu with peux, vois, aime, ai, suis, negation. Adjective agreement is ruled out, plural persons and verb conjugation beyond je and tu never arrive. Right for two years, short of the statement for four | `page.grammar`; `y3-ht3` grammar line "Adjective agreement is not taught" |
| NC coverage: phonics | 9 | One sound per half term, decode then transcribe every lesson, three progress checks, CaReFuL silent letters | `page.lesson`, `page.phonics`, `formalAssessment.phonicsChecks` |
| Progression Year 3 to Year 6 | Y3 to 4: 9. Full KS2: 3 | The ladder from chunks to modal plus infinitive to receptive third person is explicit and visible. It stops at the end of Year 4 | `page.grammar`, `curriculum/page.tsx` |
| Lesson simplicity for a non specialist | Decked units: 8. Overall today: 4 | Get ready, Teach, Record, and the board does the French. But 10 of 12 units have no slides, and a plan only unit asks a non specialist to lead French from one line per lesson | `[unit]/[lesson]/page.tsx`, `teach/page.tsx` |
| Engagement: songs, characters, animation | 6 | Three song videos per decked unit, games inside the decks (splat, bingo, Guess Who), Nova and Bloop set the volume. No animated story or character film inside a lesson yet; decks still say Pierre and Marie, covered by the slide note | `fr.json` `units.*.songs`; `FrenchFriends.tsx`; `fr-friends.ts` `slideNote()` |
| Pronunciation support | 5 | The phonics strand is strong, but every word is spoken by the browser's built in voice, which changes from laptop to laptop, and there is no teacher pronunciation guide. The voice pilot is the fix | films plan, "What her lesson is today" |
| Assessment | 9 | One formal judgement per statement per year on a named task, SOLO descriptors per task, end of year statements by strand, Mon bilan, phonics checks. Ahead of most schemes | `assessment/page.tsx`, `page.formalAssessment`, `page.endOfYear` |
| SEND and inclusion | 8 | Every sheet in class, adapted and inclusion versions with answers, inclusion games, step back from fast games. Only for the two decked units, since the others have no sheets | `print/page.tsx` lines 76 to 82; `page.inclusion` |
| Teacher recording and leader oversight | 8 | One button per lesson; the head's progress page and export update the same day, counts not names; coverage grid; subject lead kit | `progress/page.tsx`, `progress/export/route.ts`, `coverage/page.tsx`, `schools/app/hub/subject-lead/page.tsx` |

**Overall, for Years 3 and 4 as written: strong, about 8.** For a school that
reads "KS2 French" as Years 3 to 6: about 5, because half the key stage is
missing and most of the first half is still a plan.

## 2. The biggest gap, plainly

**The scheme stops at Year 4.** The national curriculum programme of study
is for the whole of Key Stage 2 and expects pupils to "make substantial
progress in one language" and to "understand and communicate ideas, facts and
feelings in speech and writing"
([DfE, languages programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-languages-progammes-of-study/national-curriculum-in-england-languages-progammes-of-study)).
Ofsted found strong primaries "mapped each small step" of harder grammar and
that many schools were "barely out of the starting block" by Year 6
([Ofsted blog, languages in outstanding primaries, 2021](https://educationinspection.blog.gov.uk/2021/05/04/languages-in-outstanding-primary-schools/)).
A Year 3 to 6 primary using only this scheme would have two years and then
nothing, and G1 would be met only in part.

The Hub card is titled "Included: KS2 French" (`schools/app/hub/page.tsx`
line 85). The body says Years 3 and 4, and so do the pricing line and the
languages page, so nothing is false, but the title is the line a head reads.

**What a school needing Years 5 and 6 would do today**, best first:

1. **Carry on with Oak's free Year 5 and Year 6 French units.** Oak's
   current KS2 French curriculum is national curriculum aligned and runs to
   Year 6, with Year 5 units on plural être, plural regular verbs with negation
   and est-ce que, and plural avoir, and Year 6 units on school, aller and faire
   ([Oak KS2 French units](https://www.thenational.academy/teachers/curriculum/french-primary/units)).
   Those are exactly the grammar steps our Year 4 leaves open. The catch: Oak's
   Years 3 and 4 run a different, grammar first route (singular être and avoir
   in Year 3), so a few early Oak lessons would repeat what our pupils know and
   some vocabulary would be new. A bridge page can say which.
2. **Use the free Rachel Hawkes KS2 French resources** (slides with audio,
   knowledge quizzes, workbooks, CC BY NC SA 4.0), built on the same three
   pillars ([LDP primary resources, University of York](https://ldpedagogy.york.ac.uk/resources/primary-resources)).
3. **Buy a paid scheme for Years 5 and 6.** Language Angels advises Intermediate
   units first and Progressive units by the end of Year 5 and 6, never
   Progressive before a range of earlier units
   ([Language Angels FAQ](https://www.languageangels.com/schools/faq)).
   A school paying for that will ask why it is not using it for all four years.
4. **Start Years 5 and 6 on our Year 3 units** if they have had no French.
   Possible, but the songs and toys are pitched at 7 and 8 year olds, and it
   leaves two years of the key stage to cover in two.

For us, the choice is Justin's (see MUST 1): ask the author whether she will
write Years 5 and 6 on the same data shape (it would sync with no code change),
write them ourselves on that shape, or publish a bridge to Oak as the honest
interim.

## 3. MUST (would be marked down, or a real national curriculum gap)

| # | What | Why a head, lead or inspector would mark it down | Surface it changes | Size |
| --- | --- | --- | --- | --- |
| 1 | **A Years 5 and 6 route.** Justin decides: the author writes them, we write them, or a bridge. Meanwhile, a short "After Year 4" page saying what Year 4 leaves secure, what is still to come in G1 and R3, and which Oak units follow on. Hub card title to say "KS2 French, Years 3 and 4" | Half the key stage is absent and the card title says KS2. The NC and Ofsted both judge progress across the whole key stage | New `/languages/fr/after-year-4` page; `schools/app/hub/page.tsx` card title | Bridge page and title: small. Writing two years of units: large, and not ours to start without the author's answer |
| 2 | **A teach it now route for plan only units.** For each unit without slides, put on its unit page what a non specialist needs to get through the half term: the word list with the sound of the half term marked, the I can lines, the checkpoint task and descriptors already in the data, and a matching free Oak lesson where one exists | A school adopting now has 14 decked lessons out of roughly 72 in the two years. A non specialist cannot teach a half term from one line per lesson, and that is the teacher Ofsted says most needs support | `schools/app/languages/fr/[unit]/page.tsx` (plan only branch), `french.ts` read helpers; no fr.json change | Medium |
| 3 | **The coverage grid says "begun" where Years 3 and 4 meet only part of a statement.** G1: gender and singular je and tu forms are taught; adjective agreement, plural persons and conjugating high frequency verbs are not. R3: dictionary use is not taught | Today the grid counts G1 as covered in several units (`coverage/page.tsx` counts planned units per code). A languages lead will read the G1 wording and see agreement ruled out on the Year 3 animals unit. Better we say it first | `schools/app/languages/fr/coverage/page.tsx`, a "part of the statement" note per code; the same line on the curriculum page | Small |

Three, not five. Everything else below is survivable for a term.

## 4. SHOULD (real, for a later term)

| What | Surface | Size |
| --- | --- | --- |
| Hub card says "Slides with audio". Until the voice pilot lands, say the slides speak the words with the computer's French voice, so a teacher hearing a robot is not surprised. Evidence or silence | `schools/app/hub/page.tsx` line 86 | Small |
| A teacher pronunciation guide per sound of the half term, a few words each, so the adult can model before the board does. Kapow ships teacher videos for pronunciation ([Kapow KS2 French](https://www.kapowprimary.com/subjects/french/key-stage-2/)). Falls out of the voice pilot's recordings once they exist | Approach page phonics section, unit page sound line | Small once the pilot's audio exists |
| Mixed age classes. Small primaries teach Year 3 and 4 together; Kapow offers mixed age and condensed plans ([Kapow French](https://www.kapowprimary.com/subjects/french/)). A cycle A and B note, or a question to the author | Plan page, approach page | Small note now; medium if the author re plans |
| A taught dictionary moment for R3 (bilingual glossary or dictionary hunt), ideally in the Year 4 pets or café unit. Ask the author, it is her content | Author request; syncs into `fr.json` | Small for us |
| Characters inside the lesson, not only in the bar. The pilot's films will put Nova and Bloop on the board; until then the name setting in her decks (already proposed on 17 November) is the cheaper fix | Author request; `teach/page.tsx` | Small for us |
| Songs for the plan only units. Only the two decked units carry songs (`units.*.songs`). The pilot's "our own song" per lesson covers it in time | Pilot | Noted, not planned |
| Transition into the next school. Her Year 4 profile handed to the next teacher is good practice, and Ofsted found transition "underdeveloped" (blog above). If Years 5 and 6 arrive, the same handover belongs at the end of Year 6 for KS3 | Future Year 6 unit | Small, later |
| Per pupil record. Progress is counts by design and her pupil tracker downloads per unit. Some heads will ask for names in our app; park until data protection says yes | Park | n/a |

## 5. What we already do better

- **Assessment that answers Ofsted's complaint.** Ofsted's research review found
  primary language assessment "scarce and limited in effectiveness" and asked
  for assessment linked to a sequenced curriculum
  ([Ofsted curriculum research review: languages, 2021](https://www.gov.uk/government/publications/curriculum-research-review-series-languages/curriculum-research-review-series-languages)).
  One planned judgement per statement per year, on a named task with its own
  SOLO descriptors, recorded with one tap and on the head's page the same day,
  is further than any scheme we checked publishes.
- **The three pillars, on the timetable.** The same review names phonics,
  vocabulary and grammar as the building blocks and wants sound and spelling
  taught explicitly. Every lesson opens with three minutes of decoding and three
  of transcription on the half term's sound, before any new language
  (`page.lesson`, `page.pillars`).
- **Progression you can see.** One sentence grows across a unit and the grammar
  ladder is written out per year (`handbook.sentenceGrows`, `page.grammar`),
  which is what Ofsted said weaker schools lacked ("little in the way of
  linguistic progression").
- **A planned audience.** Partner, group, class, assembly, older pupils, a new
  teacher (`page.audience`). No other scheme we read names the audience as a
  progression.
- **Three versions of every sheet, with answers beside it**, filterable in the
  print room. Kapow's public page does not describe SEND versions.
- **The board does the French.** Teach mode frames her interactive deck full
  screen with the song, games and the whisper or shout friend, then one tap to
  record. Simpler than a lesson plan plus slides plus a separate tracker.
- **Our own friends, used for a teaching job.** Nova whispers, Bloop shouts,
  and the class sets its singing volume by them. The character does something,
  rather than decorating the slide.
- **Included in the licence.** Language Angels lists a single language at £239
  a year excluding VAT ([Language Angels](https://languageangels.com/french_mfl/welsh));
  French costs a school nothing extra on top of our licence, and one lesson is
  open to try.
- **It keeps itself current.** The nightly sync brings each new unit in with no
  code change, so the plan only units become decked units as she finishes them.

## Sources

- DfE, languages programmes of study, KS2: https://www.gov.uk/government/publications/national-curriculum-in-england-languages-progammes-of-study/national-curriculum-in-england-languages-progammes-of-study
- Ofsted, curriculum research review series: languages (2021): https://www.gov.uk/government/publications/curriculum-research-review-series-languages/curriculum-research-review-series-languages
- Ofsted, languages in outstanding primary schools (2021): https://educationinspection.blog.gov.uk/2021/05/04/languages-in-outstanding-primary-schools/
- Oak National Academy, KS2 French curriculum units: https://www.thenational.academy/teachers/curriculum/french-primary/units
- LDP (NCELP successor), primary resources, Rachel Hawkes KS2 schemes: https://ldpedagogy.york.ac.uk/resources/primary-resources
- Kapow Primary French: https://www.kapowprimary.com/subjects/french/ and https://www.kapowprimary.com/subjects/french/key-stage-2/
- Language Angels FAQ and pricing: https://www.languageangels.com/schools/faq and https://languageangels.com/french_mfl/welsh

Not found: a 2024 or 2025 Ofsted subject report for primary languages. The 2021
review and blog are the current Ofsted sources. A Language Angels post says the
renewed inspection framework drops subject deep dives
([Language Angels, April 2026](https://languageangels.com/news/curriculum-teaching-for-foreign-languages-in-new-ofsted-framework));
that is a vendor's reading, not checked against Ofsted's own text, so the
subject lead kit's deep dive questions stay useful as a leader's own check.

## Questions for Justin

1. Years 5 and 6: ask the author first (recommended, it keeps one voice and
   syncs for free), write our own, or a bridge to Oak as the interim? The
   bridge page is worth shipping whichever you pick.
2. Ship MUST 2 and 3 in one small PR on the French pages? Neither touches
   fr.json or the sync.
