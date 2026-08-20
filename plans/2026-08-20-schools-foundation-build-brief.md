# Schools foundation build brief: SEL mapping, implementation guide, drop in, primary lessons

Written 20 August 2026. The remaining schools side work from the Common Sense review
(plans/2026-08-19-common-sense-curriculum-review.md) and the foundation scaffold
(plans/2026-08-20-foundation-scaffold-and-cs-borrows.md). Written as a brief the schools session
builds into public.school_lessons and the schools app, so it lands in the right place and does not
collide with the parent app. No dashes. Every claim carries a framework anchor (the road to 16 rule).

Scope of this doc, four parts:
1. The SEL and CASEL mapping (a finished reference).
2. The primary implementation guide (a finished one page for a head or PSHE lead).
3. The 20 minute drop in spec (a format to add to existing decks).
4. The primary school lessons build brief (KS1 and KS2, ready to author into school_lessons).

The scaffold across all of it is Notice, Choose, Tell (already tagged on parent_lessons in migration
221 and school_lessons in migration 220).

---

## 1. SEL AND CASEL MAPPING (finished reference)

Why: the review found Common Sense maps to CASEL, which widens the schools buyer, especially SEL led
and international schools. We already map to UKCIS Education for a Connected World (EFCW) and
statutory RSHE. This adds the CASEL competency layer on top, it does not replace the EFCW mapping in
the school_lessons.efcw_strands column.

CASEL five competencies: Self awareness, Self management, Social awareness, Relationship skills,
Responsible decision making.

### The scaffold to CASEL (the clean bridge)
- NOTICE maps to Self awareness and Social awareness. Noticing what the machine is doing, noticing
  your own feelings on a screen, noticing there is a real person on the other side.
- CHOOSE maps to Self management and Responsible decision making. Bringing the stop, balance, saying
  no, choosing before you share or press.
- TELL maps to Relationship skills and Responsible decision making. Asking a trusted adult, seeking
  help, reporting, repair.

### The 15 KS3 (13+) modules to CASEL (for the existing school lessons)
Primary CASEL competency per module, using the scaffold tag from migration 220.

| Module | Scaffold | Primary CASEL competency |
|---|---|---|
| 01 how the machine works | NOTICE | Self awareness |
| 02 the deal you signed | NOTICE | Responsible decision making |
| 03 locking your doors | CHOOSE | Self management |
| 04 the highlight reel | NOTICE | Self awareness |
| 05 bodies and filters | NOTICE | Self awareness |
| 06 influencers and the sell | NOTICE | Responsible decision making |
| 07 how people treat each other | TELL | Relationship skills |
| 08 strangers, dms and grooming | TELL | Relationship skills |
| 09 nudes, the law and sextortion | TELL | Responsible decision making |
| 10 rabbit holes and radicalisation | NOTICE | Social awareness |
| 11 the inner life | CHOOSE | Self awareness |
| 12 sleep, attention and the body | CHOOSE | Self management |
| 13 the good side held honestly | CHOOSE | Social awareness |
| 14 taking the wheel | CHOOSE | Self management |
| 15 ai companions and chatbots | NOTICE | Responsible decision making |

How to land it: add a nullable casel_competency text column to school_lessons in a new migration
(claim the next free number, currently 221 is the highest so 222), populate by module_id, and surface
it on the curriculum page filter next to the EFCW strands. Non destructive, mirrors 220.

---

## 2. PRIMARY IMPLEMENTATION GUIDE (finished, one page for a head or PSHE lead)

The thing Common Sense has and we do not. A scope and sequence and a roll out a leader can act on in a
minute. Lives as a page in the schools app (a printable and a screen), sourced from the ladder.

**Guided Childhood for primary, in one page.**

- What it is. A digital literacy pathway for Reception to Year 6, taught by the DiGi Squad, mapped to
  all eight Education for a Connected World strands and to RSHE. Every lesson has one child facing
  idea and one thing they can do, held together by three words the whole school shares: Notice,
  Choose, Tell.
- The three words. NOTICE what the screen is doing. CHOOSE the stop yourself. TELL a trusted adult,
  and you will not be in trouble. From Reception to Year 6 the same three words, deeper each year.
- Scope and sequence. One short lesson per half term per year group, six a year, plus a start of year
  assembly on the three words. KS1 (Reception to Year 2) uses Pebble, lower KS2 (Years 3 to 4) uses
  Bloop, upper KS2 (Years 5 to 6) uses Orbit, the pre secondary bridge.
- How to run it. Twenty minutes, drops into a PSHE or computing slot, tutor time or assembly. No prep,
  no download wall, no booking. A teacher opens a module and teaches it today.
- Safeguarding fit. Aligns to the school's statutory online safety duty (KCSIE) and RSHE. Each lesson
  carries a DSL note flagging what to watch for and where a disclosure goes. The scaffold's TELL is
  the reporting route made child sized.
- The home link. A one page family agreement per age band goes home, built on the same three words,
  so school and home say the same thing. This is the parent product's on ramp, and the schools
  distribution multiplier (one primary is roughly 268 families, DfE census).
- The evidence. Framework anchored throughout: EFCW, RSHE, Rosenshine lesson design, Day of AI and
  UNESCO for the AI seeds, CASEL for the SEL mapping.

Roll out in three steps: assembly on the three words in week one, then one lesson per year group per
half term, then the family agreement home before the winter break.

---

## 3. THE 20 MINUTE DROP IN SPEC

Add a short version to every young lesson, the format the market now expects. Same school_lessons row,
a shorter slides array flagged as the drop in.

Shape, five beats, about 20 minutes:
1. The three words recall, 2 minutes. Which word is today, Notice, Choose or Tell.
2. One idea, 5 minutes. The single knowledge intention, one Planet Friend, one worked example.
3. Try it, 6 minutes. The one activity, the single_action_outcome made real.
4. Quick check, 4 minutes. Two or three choice questions, high success, warm feedback, never a red X.
5. Catchphrase and the word, 3 minutes. Say the catchphrase, name the scaffold word, DiGi handoff.

Implementation: a slides_short jsonb column on school_lessons, or a boolean drop_in flag on a second
lighter lessons row. The schools session picks the cleaner one. This is a schema plus authoring job,
not covered by the migrations already merged.

---

## 4. PRIMARY SCHOOL LESSONS BUILD BRIEF (KS1 and KS2, ready to author)

The bigger gap. The parent app has the ages 4 to 7 co watch set (parent_lessons 1.1 to 1.10). The
SCHOOL versions do not exist below KS3. Author these as public.school_lessons rows (audience teacher),
mirroring the 109 to 112 row shape, hosted by the Planet Friend for the band, scaffold tagged, EFCW
and RSHE mapped. Outcomes come straight from the road to 16 ladder, so nothing new is invented.

Row shape reminder (school_lessons): module_id, title, key_stage, year_band, audience 'teacher',
efcw_strands int[], statutory_hooks, ailit_domains, evidence_anchor, single_action_outcome,
character_cast, slides jsonb (017 contract), assessment jsonb, teacher_notes, dsl_note, sort_order.
EFCW strand ints follow the order already used in 109 to 112.

### KS1, Pebble, ages 4 to 7 (mirror the parent 4 to 7 set, classroom version)

| module_id | title | Scaffold | EFCW strand | single_action_outcome |
|---|---|---|---|---|
| ks1-01-real-me | Me on a screen and me in real life | NOTICE | Self image and identity | I can say a photo is only a slice of the real, whole me |
| ks1-02-real-or-pretend | Real or pretend? | NOTICE | Managing online information | I can ask the magic question, is this real |
| ks1-03-kind-words | Kind words on screens | TELL | Online relationships | I send one kind message and know to tell if a message is unkind |
| ks1-04-uh-oh-feeling | When screens make you feel funny | TELL | Health wellbeing and lifestyle | I turn the screen over and go and tell a grown up |
| ks1-05-internet-remembers | The internet remembers | CHOOSE | Online reputation | I stop and ask a grown up before I share |
| ks1-06-sleep | Screens, sleep and growing bodies | CHOOSE | Health wellbeing and lifestyle | I know screens go to bed first |
| ks1-07-privacy-shield | My privacy shield | TELL | Privacy and security | I name my private things and check before sharing them |
| ks1-08-someone-made-that | Someone made that | NOTICE | Copyright and ownership | I know a real person made it, I ask first and say their name |
| ks1-09-voices | Some voices are not people | NOTICE | Managing online information | I know some voices are machines and machines can be wrong |
| ks1-10-yes-no-button | The Yes No Button | CHOOSE | Online relationships | I ask a grown up before I press yes, and I can say no |

Anchors: EFCW EYFS to 7, RSHE primary, Day of AI ages 5 to 7 (for 09), Rosenshine format.

### Lower KS2, Bloop, ages 8 to 10 (the Builder ladder, classroom version)

| module_id | title | Scaffold | EFCW strand | single_action_outcome |
|---|---|---|---|---|
| ks2-01-strong-passwords | Strong doors, strong passwords | CHOOSE | Privacy and security | I make and keep a strong password |
| ks2-02-real-friend-or-stranger | A real friend or a stranger playing one | TELL | Online relationships | I can tell a real friend online from a stranger, and I tell |
| ks2-03-telling-plan | My telling plan | TELL | Online relationships | I have a rehearsed plan to tell, with no fear of losing the device |
| ks2-04-spot-the-sell | Spot the sell | NOTICE | Online reputation | I spot when a screen is selling and do the five second check |
| ks2-05-ai-gets-it-wrong | AI learns, and AI gets it wrong | NOTICE | Managing online information | I check an AI answer with a person |
| ks2-06-what-screens-push-out | What screens push out | CHOOSE | Health wellbeing and lifestyle | I can name what screens push out, sleep, play, people |

Anchors: EFCW 7 to 11, CSM Privacy and Security and News and Media Literacy grades 3 to 5, Day of AI
grades 3 to 5 and UNESCO Understand level (for 05).

### Upper KS2, Orbit, ages 11 (the pre secondary bridge, before any account)

| module_id | title | Scaffold | EFCW strand | single_action_outcome |
|---|---|---|---|---|
| ks2-07-how-the-feed-is-built | How a feed gets built | NOTICE | Self image and identity | I can explain the feed is built from watch time |
| ks2-08-filters-are-not-faces | Filters are not faces | NOTICE | Self image and identity | I know a filtered image is not a real face |
| ks2-09-run-your-permissions | Running your own settings | CHOOSE | Privacy and security | I can find and set location, camera and mic permissions |

Anchors: EFCW 11 to 14, CSM grades 6 to 8. These three are the on ramp to the existing 13+ set, so
sort_order sits them just before sm13-01.

### Build order and definition of done
1. Author KS1 first (mirrors validated parent copy, fastest, highest value). Then upper KS2 (the
   bridge into the live 13+ set). Then lower KS2.
2. Each row: full seven beat slides, one Planet Friend host, DiGi closes, assessment jsonb, dsl_note.
   No dashes, never allow or deny, wrong answers get warm feedback.
3. Add the 20 minute drop in version (part 3) as each is authored.
4. Surface on the schools /curriculum page, so the pilot count rises from the 13+ set to the full
   Reception to Year 6 pathway.

## What is needed from a human
- A yes to the KS1 lesson titles and the scaffold tags above, then the schools session authors the
  slides.
- The exact CASEL surfacing decision (filter on the curriculum page, or just data) for part 1.
- Verify EFCW strand numbers against the 109 to 112 convention before inserting rows.
