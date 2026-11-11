# Progression and assessment: where we stand against the best, and the road to first (11 November 2026)

Justin, 11 November 2026: review what heads and teachers expect of the progression
structure when these lessons are taught over years, how the top educational platforms do
it, and apply it to ours. "Do not totally disregard what we have built, just check what we
can add to make it super easy to use and cover everything that needs to be assessed."
Then review each lesson and the platform as a whole, rate us against platforms like
these, and suggest amendments until we get to number one.

Nothing in this document is built. It is the review and the ranked list.

## How it was done

Eight separate passes, then put together here.

| Pass | What it read |
|---|---|
| Two researchers | The leading platforms' own pages, and the primary sources on what heads, subject leads and teachers are expected to do. Opened on 11 November 2026 |
| Four lesson reviewers | All 34 scheme lessons and the 3 standalone lessons, against the house rubric (`scripts/lesson-rubric.md`), scored as a head and a class teacher would |
| One French reviewer | The whole synced scheme (`schools/lib/languages/fr.json`). The slide decks themselves were not opened, only their titles |
| One codebase map | What already exists, so nothing here asks for a second build |

**What the lesson scores are, and are not.** They score progression and assessment only:
does a lesson say what it builds on, does it assess what it says it teaches, can a teacher
tell what good looks like, is it a real step up, and can it be run cold. They are not a
score of the slides or the teaching, which were reviewed against the rubric in September
and sit on the once a term cycle (decision of 21 September). The reviewers were told to be
hard markers and that "no amendment needed" was a welcome answer.

## 1. The lessons: 6.5 out of 10 on progression and assessment

No lesson reached 9. None fell below 5. The spread is narrow because the same two or
three things hold every lesson back.

| Band | Lessons | Average | Strongest | Weakest |
|---|---|---|---|---|
| EYFS and KS1 | 7 | 6.4 | eyfs-30, eyfs-31, ks1-32, ks1-33 (7) | ks1-02 (5) |
| KS2 | 9 | 6.6 | ks2-04, 06, 08, 09, 26 (7) | ks2-05, 07, 23, 25 (6) |
| KS3 | 9 | 6.2 | ks3-14, 27, 34 (7) | ks3-24 (5) |
| KS4, KS5, standalone | 12 | 6.9 | ks4-28, ks4-17 (8) | ks5-20 and two standalones (6) |

By what was scored, across all 37:

| Scored | About | What it means |
|---|---|---|
| Can be run cold | 7.5 | The strength. Every slide has a script and minutes, hard questions have answers, there is a paper fallback and a short route |
| A real step up | 7.3 | Demand does rise. Three KS3 lessons repeat a cycle their KS2 half already taught |
| Objectives match the assessment | 7.0 | Mostly aligned. Five answer keys contradict the taught wording (below) |
| Says what it builds on | 6.4 | Strong in the older chains, broken in the eight newest lessons |
| **What good looks like** | **4.6** | **The gap. 30 of 34 lessons give a teacher no words for secure, developing or needs revisiting** |

### The one finding all four reviewers made independently

**A teacher is asked to judge a class with no description of what they are judging.** The
record button offers Secure, Developing, Needs revisiting. Thirty lessons have nothing
written for any of the three. Worse, the lesson rows carry four different vocabularies:

- `working_towards, met, exceeded`, defaulting to "met", on 25 lessons;
- `secure, developing, needs_support` with real prose on 4 (ks2-26, ks3-27, ks4-28, ks4-29);
- a paragraph on 2 (ks2-23, ks3-22);
- nothing on 3 (ks2-25, ks3-24, ks3-34).

No page shows any of them, so nobody has seen the clash yet. The four lessons that do have
descriptors are the model: "Names the three missing brakes without prompting",
"Converts a game currency back into pounds without prompting".

### Real defects: an answer key that marks the taught answer wrong

These are not style. In each, the wall teaches one wording and the key or the next
lesson's retrieval expects another, so a teacher marking from the key marks a pupil who
learned the lesson as wrong.

| Lesson | The clash |
|---|---|
| ks2-05 gaming | The wall, recap and parent note teach three spotters (rushing me, hiding the price, random like a raffle). Exit quiz item 4 and key learning point 5 expect three different ones |
| ks2-07 privacy | Slide 9 teaches four kinds of private thing. The exit key for "the four things on the private list" lists a different four |
| ks2-08 kind and safe | Slide 6 retrieves "the share test" in words ks2-07 never taught |
| ks3-12 misinformation | The diagram, tool and recap teach three questions. Key learning point 3 and exit item 2 expect a different three |
| ks4-19 readiness | Slide 6 retrieves the check from ks4-18, but no option matches what ks4-18 taught. A pupil who remembers correctly has no right answer |

### The other musts (21 in all, one line each)

| Kind | Lessons |
|---|---|
| The five key clashes above | ks2-05, ks2-07, ks2-08, ks3-12, ks4-19 |
| Prior knowledge that never names the lesson it builds on, so a cycle repeats instead of being retrieved | ks2-23 (ks1-33), ks2-25 (ks2-09), ks3-11 (ks2-26), ks3-22 (ks2-23), ks3-24 (ks2-25) |
| "Last lesson" pointing at the wrong lesson since the order changed | ks4-16 (slides 6, 14), ks4-18 (starter question 1) |
| A taught strand with no exit question | ks1-02 (take a break), ks3-13 (where to report), ks4-29 (the offer) |
| An exit question that cannot evidence the outcome | ks2-26 ("How many? Four"), ks3-10 (asks about a week pupils have not run yet) |
| One "I can" standing for three cycles | ks3-27 |
| A task the age cannot do, or an outcome nobody is seen doing | eyfs-01 (Reception told to write), ks1-03 (every fake is impossible, so silly clues always solve it), ks5-20 (nobody writes a brief) |

The full tables, with the field each must would change, are in the four reviewers' reports
kept with this session. Shoulds are listed there and deliberately left for a later term.

### Progression across the years: what a head would notice

1. **Nothing says which year teaches which lesson.** 33 of 34 lessons carry the whole key
   stage ("Years 3 to 6"). The year plan spreads a key stage's lessons across the three
   terms of one year. A Year 3 class and a Year 6 class are served identically, while the
   lessons themselves hint at years ("seven year olds", "a Year 4 class", "some Year 6
   pupils"). This is the first question a head asks and we have no answer.
2. **The chain is strong in the older lessons and stops at the newer ones.** ks2-04 to 09,
   ks3-10 to 14 and ks4-15 to 19 each open on the previous lesson's tool. The eight newest
   lessons have no retrieval slide.
3. **Two orders that need a decision.** KS3 opens on ks3-27 (harassment, stalking, coercive
   control) and KS4 on ks4-29 (self harm content, county lines), each before its own
   foundation. Nothing recorded says why.
4. **Two clashes between lessons.** ks2-09 calls ownership of an AI picture "genuinely
   unsettled"; ks2-25 marks "the computer" as correct. ks1-32 and ks2-07 each teach four
   private things and the two lists differ.
5. **No rung beneath the hardest KS4 lessons.** No KS3 lesson uses the words consent,
   Report Remove, sextortion or radicalisation, so ks4-16 to 18 arrive cold.
6. **Stale lines.** Three scripts say "mark as working towards on the register". There is
   no register and no pupil record.

## 2. The French scheme: 4.8 out of 10 as a whole, 8 to 9 for the two finished units

Scored hard, and scored as a head buying a two year scheme would.

| Scored | Score | Why |
|---|---|---|
| Sequence | 6 | The phonics and grammar ladders are real. Seven of twelve units say what they build on, in prose only. Four small contradictions in the data (below) |
| Coverage | 6 | All twelve statements are assessed, 46 judgements over two years. Only 19 of the 46 sit in ready units. L2 and S4 sit in none |
| Descriptors | 5 | SOLO 3 and 4 written for 46 of 46. SOLO 5 for 8 of 46. Five statements have no SOLO 5 anywhere |
| Evidence | 4 | When, how and what to keep is fully specified in 2 units of 12 |
| Non specialist | 5 | Two units are fully runnable. Three "ready" units give a title and one line per lesson |
| Completeness | 3 | 12 of 72 lessons have slides. Years 5 and 6 do not exist |

**The two finished units (Les couleurs, Je peux) score 8 to 9 on every line.** The scheme's
assessment design is the best thing in either subject: every unit names its statements
with unit specific descriptors, each statement is assessed twice a year, and the handbook
says how each one gets harder in Year 4. No rival's page we opened is as specific.

Contradictions the sync could catch: the transcription scaffold for Year 4 half terms 2
and 3 differs between the phonics table and the unit notes; a Year 4 half term 4
descriptor expects liaison, taught in half term 5; a Year 3 descriptor expects the
negative, absent from Year 3 grammar; Les couleurs names a favourite colour song that is
not among its three songs.

**Whose work each gap is.** It is her scheme and nothing may be written in her name.

| Gap | Whose |
|---|---|
| The assessment plan (lesson, written or observed, what to keep, SOLO 5) for the ten units without one | Hers |
| Pronunciation for every core phrase, as her recordings or respellings | Hers |
| One page: the end of Year 4 expectation, a descriptor below SOLO 3, where Years 5 and 6 pick up | Hers |
| Years 5 and 6 | Hers |
| An honest readiness label: "plan only" on the three ready units with no slides, and a map of which judgements can be made today | Ours, from data we hold |
| A consistency report at each sync (the four contradictions above) for her to resolve | Ours |
| Her sound hint and songs shown beside each lesson | Ours |

## 3. What already exists (so none of it is rebuilt)

Verified in the code, with a teacher able to use each today.

- Per lesson: knowledge organiser, starter quiz and exit quiz with answer versions, pupil
  learning record (Me and Teacher stars per "I can"), run sheet with a short route, paper
  pack, parent note and share link.
- For leaders: the RSHE 2026 and computing maps, the safeguarding crosswalk, the year
  plan, the passport editions.
- The record: Mark lesson delivered on the lesson page, the run sheet and every French
  lesson; both class progress pages; the audit trail.
- French: the curriculum, assessment, approach and coverage pages, and the SOLO
  descriptors on each unit.

Partly there: a progression map (three rival theme sets: ten behaviours, eight strands,
four passport areas), a whole school view (one class at a time, no tile on the Hub), a
leader's pack (the maps exist, nothing joins them to the record), an export (print only).

## 4. Things a teacher would trip over between the two subjects

1. **Finishing the board.** French ends in "Finished? Record it". The digital player
   finishing a deck only ticks this laptop, and the button is at the foot of another page.
2. **Two digital records.** The Hub leads with the browser tracker as "your coverage
   record". The school's own record, the one on every laptop, has no tile.
3. **"Record" means three things**: the pupil's learning record sheet, the school's record,
   and the French step.
4. **Levels.** Digital judges the class per lesson; French counts pupils per statement, and
   also calls its sheet versions "levels".
5. **Labels.** "Print for your subject lead" on one progress page, "Print for the head" on
   the other.
6. **Two codes.** A school with both subjects has two records that never meet.
