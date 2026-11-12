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

## 5. What heads, subject leads and teachers are expected to do (primary sources)

Opened on 11 November 2026. These are what guidance asks of schools. No survey of what
teachers say they want was opened, so this is not that.

| Expectation | Source | Us today |
|---|---|---|
| "the curriculum is coherently planned and sequenced so that pupils build knowledge and skills sequentially and cumulatively" | Ofsted school inspection toolkit, in use from September 2026 | Sequenced inside each key stage. No year by year map to show it |
| "It identifies clear end points and is appropriately sequenced to build on what has already been taught and learned" | Same | End points exist per lesson ("I can"). Prior learning is named in the rows but shown nowhere, and missing on eight lessons |
| "time is available within the curriculum for revisiting content and dealing with gaps in knowledge and skills" | Same | A starter retrieves the last lesson in 26 of 34. Nothing cumulative across a term or a year |
| Leaders "prioritise feedback, retrieval practice and assessment" | Same | Starter and exit quizzes on every lesson, on paper |
| "The curriculum should build knowledge and skills sequentially, with regular feedback provided on pupil progress ... assessments should identify where pupils need extra support or intervention" | DfE RSHE statutory guidance, in force 1 September 2026, paragraph 50 | The class record shows how many, not who. The pupil's own learning record sheet holds who, on paper, in school |
| Baseline, assessment for learning, end point, "I can" statements: an ipsative model, a pupil measured against their own starting point | PSHE Association assessment guidance | Both ends exist (starter quiz, exit quiz). Nothing joins them |
| "there are no nationally agreed levels of assessment" in computing | NCCE Key Stage 2 teacher guide | So our three words are legitimate, if we say what each means |
| "there needs to be formative and summative assessment of phonics knowledge in both reading aloud and dictation" | Ofsted languages research review, 2021 | The French scheme does exactly this, three checkpoints over two years |
| Secondary teachers should be given "a clear summary of the language curriculum pupils in key stage 2 have been taught" | Teaching Schools Council MFL pedagogy review, 2016 | Nothing goes to a secondary yet |
| "We do not need leaders to produce documents specifically for an Ofsted inspection" | Ofsted toolkit | So any leader's pack is sold as a working document, never as something Ofsted wants |

## 6. Rated against the best, line by line

Each line names the platform whose own pages showed the strongest version, and scores us
out of ten against it. Rivals are not given overall scores: we saw their public pages, not
inside their paid portals, and a number would be invented.

### Digital, online safety and PSHE platforms (13 opened)

| Line | Best seen, and what it does | Us | Why |
|---|---|---|---|
| Zero prep delivery | Oak: slides, worksheet, two quizzes, a misconception note and a video of the lesson taught | **9** | A script on every slide, a run sheet, a short route and a paper pack. No rival page claims a script per slide |
| Home link | Jigsaw Families (school run parent sessions) | **9** | A parent note and share link per lesson, the passport, and a parents app behind it |
| Statutory maps for leaders | Kapow, SCARF | **8** | RSHE 2026 and computing maps, safeguarding crosswalk |
| Class record without pupil data | ProjectEVOLVE: a class knowledge map before and after a unit | **8** | One tap, both subjects, no accounts. Missing the "before" |
| Per lesson sheets | SCARF: a knowledge organiser per unit | **8** | Organiser, two quizzes with answers, pupil learning record |
| Teacher subject knowledge | Kapow: a CPD video and a "teacher knowledge" section for every lesson | 5 | Subject knowledge on 14 of 34 lesson pages, 17 briefings |
| Before and after measure | SCARF: the same activity before and after each unit | 4 | Both quizzes exist. Nothing records or compares them |
| Progression map across years | Kapow: every unit links "relevant prior learning" and "build on the learning" | 4 | Three rival theme sets, no grid, no links shown |
| Leader reports and export | Natterhub: pupil, school and trust level, with a spreadsheet | 4 | One class at a time, print only, no tile on the Hub |
| Level descriptors | Teach Computing: a rubric of emerging, expected, exceeding per unit | 3 | Written for 4 lessons of 34 and shown on no page |
| Breadth and revisiting | Jigsaw and Natterhub: about 36 lessons a year | 3 | 34 lessons across fourteen years, two or three a year group |
| Year group placement | Every scheme opened is planned by year group | 2 | 33 of 34 lessons carry the whole key stage |
| Price for what you get | Oak, Teach Computing, ProjectEVOLVE and Common Sense are free. SCARF is £405 to £810 for whole primary PSHE | 4 | £495 to £1,995 for a specialist strand |
| Per pupil tracking | Natterhub: automated, with pupil logins and names | 0 | By design. The paper learning record holds it in school |

**Where that leaves us.** First or second on five lines, middle on four, last or near last
on five. On progression and assessment alone we sit behind Kapow, SCARF, ProjectEVOLVE and
Natterhub. On running a lesson and reaching home we are ahead of all of them.

Two things to know. Oak already has a free Year 6 lesson on fake and AI generated images,
so AI literacy is no longer ours alone. And THE-STORY.md says Jigsaw starts "from £495",
checked 9 September: on 11 November its pricing page shows only "Request a Price", so that
line cannot be confirmed today.

### Primary languages schemes (7 opened fully)

| Line | Best seen, and what it does | Us | Why |
|---|---|---|---|
| Level descriptors | iLanguages: age related expectations with exemplar answers | **8** | Unit specific SOLO descriptors for every statement. No rival page is as specific |
| Class tracking | Language Angels: "the progress of each pupil, each class, and the school as a whole" | **8** | The progress page and the trend table, with no pupil names |
| Pupil self assessment | Language Angels: pupil self assessment sheets | **8** | What I can do |
| Phonics progression | Language Angels: phonics lessons at the start of each year, with mats | 7 | A taught strand with three checkpoints, two years only |
| End of unit assessment | Language Angels: skills assessments in all four skills at KS2 | 7 | Mon bilan in three versions, in two units so far |
| Leader's pack | Kapow: an intent, implementation and impact statement and an audit toolkit (behind its sign in) | 6 | The three handbook pages, added this week |
| Grammar progression | The Hawkes scheme (open licence, non commercial): grammar and phonics "overlap 100% with the new GCSE subject content" | 6 | A clear ladder for two years |
| Vocabulary progression | The Hawkes scheme: planned at word level, with a 90 to 96% vocabulary overlap with GCSE | 5 | A fixed core plus pupil chosen words |
| Progression map Years 3 to 6 | Kapow: long term plan, skills and vocabulary progression, with mixed age versions | 4 | Years 3 and 4 only |
| Completeness | Every paid rival covers Years 3 to 6 today | 2 | 12 of 72 lessons have slides |
| Per pupil tracking | Language Angels: each pupil's progress, with pupil names processed where the school enters them. Kapow: a per pupil, per lesson assessment spreadsheet | 2 | A paper class tracker per unit |
| Native speaker audio | Primary Languages Network: a native speaker on screen co teaches every lesson while the teacher manages the room | 2 | In the slide decks and songs only |
| Transition to Year 7 | Lightbulb: a free one page pupil summary. Hawkes: built to feed KS3 | 1 | Nothing |
| Mixed age or short lessons | Kapow: a two year cycle and a condensed plan | 0 | None |

**Where that leaves us.** The assessment design is the best we saw. As a scheme a school
could buy today it is behind every rival that covers four years, and the two largest gaps
(Years 5 and 6, and audio for the class teacher, who Language Trends England 2025 reports provides most primary language teaching) are
hers to close, not ours.

**How far to trust the rival facts.** The languages claims were checked a second time
against each vendor's own pages: 5 confirmed, 6 corrected (the corrections are in the
table above), 1 thrown out. The digital platform claims were opened once, on the vendors'
own pages, and not checked a second time. Before anything here is said to a head:

- **Do not quote a Kapow price.** Its sign up page shows only a placeholder, and the
  figures first reported could not be traced.
- **Language Angels' own pages disagree**: £259 for one KS2 language on its pricing page,
  £239 on its home page, both excluding VAT.
- **Primary Languages Network's own pages disagree**: £210, £290 and £420 on its pricing
  page, £200, £275 and £395 on another.
- **Never say a rival "stores pupil names" as a flat fact.** Language Angels' terms list
  pupil names, and optionally date of birth and SEND, as data it processes where the
  school enters them. Primary Languages Network markets "No pupil names needed" for its
  games, which is the same ground we stand on.
- The Language Trends figures are from the 2025 report. The 2026 report exists and could
  not be opened.

## 7. The road to first: amendments in order

"First" is defined so it can be reached: **the best scheme a school can run with no pupil
data and no prep, that shows a head exactly where each class is.** It is not first at
being Jigsaw. Two lines stay low on purpose (per pupil tracking, 36 lessons a year)
because closing them means becoming a different product.

Each amendment went through the feedback filter: it is here because it serves a head
signing or a teacher teaching, breaks none of our commitments, and is not already built.

| # | Amendment | Lifts | Size | Needs from Justin |
|---|---|---|---|---|
| 1 | **Fix the 21 musts in the lessons**, starting with the five answer keys that contradict the lesson. One guarded migration, each change quoted from the lesson's own words | Lessons 6.5 to about 7.3 | Medium | A yes: it edits live lessons |
| 2 | **Say what good looks like.** Three lines per lesson (secure, developing, needs revisiting), written only from that lesson's own misconceptions and check questions, in one vocabulary, shown under the record buttons and on the run sheet. The four lessons that have them are the pattern | Descriptors 3 to 8. Lessons to about 8.2 | Medium | A yes, and a read of the first five before the rest |
| 3 | **A year for every lesson, and the map that shows it.** A suggested year group on each lesson, then one page: themes down the side, years across, each lesson linked to what it builds on and what it leads to | Year placement 2 to 8. Progression map 4 to 8 | Medium | The placement itself. I can propose it from the lessons' own hints for you to correct. Also the two orders: should KS3 open on harassment and KS4 on county lines? |
| 4 | **Before and after, for the class.** After the starter quiz and the exit quiz, the teacher taps how the class did on each. The progress page shows the move. No names | Before and after 4 to 8 | Medium | A yes |
| 5 | **One record, easy to find.** A tile on the Hub. Finishing a lesson on the board leads to Record. All classes on one page with a year picker. One spreadsheet download. One name for each thing | Leader reports 4 to 7 | Small | Nothing |
| 6 | **The leader's page.** The school's record joined to the 57 RSHE requirements and the computing statements: what has been taught, to whom, and what is left. Sold as a working document | Leader reports 7 to 9 | Medium | Nothing. It is in the approved spec |
| 7 | **A termly look back.** A ten question quiz for each term and each key stage, built from the question banks every lesson already has | Revisiting 3 to 6 | Small | A yes |
| 8 | **French, ours to do.** Label the three plan only units honestly. Show which judgements can be made today. A consistency report at each sync for the author. Her sound hint and songs beside each lesson. A class tracker spreadsheet the school keeps, built from her statements, so a named record exists without a name reaching us. A one page class summary for the next teacher | French class tracking and transition | Medium | Nothing |
| 9 | **French, hers to do.** The assessment plan for the ten units without one, SOLO 5 for the five statements that have none, a recording or respelling for each core phrase, the end of Year 4 expectation, then Years 5 and 6 | Completeness, audio, coverage | Large | A conversation with her. Nothing may be written in her name |

After 1 to 7 the digital side would score first or second on ten of the fourteen lines.

### Deliberately not on the list

| Idea | Why not |
|---|---|
| Pupil accounts and a named digital record | Needs pupil data and a different legal footing. The spreadsheet in amendment 8 and the paper learning record cover it in school |
| Thirty six lessons a year | We are the digital strand a school adds to its PSHE scheme, not a replacement for it. Say that plainly on the pricing page |
| A CPD video for every lesson | Large, and the script on every slide already does that job. Finish the subject knowledge notes on the other 20 lessons first |
| "Ofsted ready" on anything | The toolkit says inspectors do not review internal data and do not want documents made for them |
