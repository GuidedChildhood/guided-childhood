# One curriculum, two rooms: the school and home sync plan

Version 2, 9 October 2026. Written after a twelve lens panel read the 34 module
decks, the schools teach, run and print routes, the child version built today
in PR 1 (`visibleSlides`), and the home code bridge; then read version 1 of this
plan against the code and sent it back with corrections. Version 2 takes every
correction. The panel's own verdict was that the remaining fixes are sentences,
not design, so there is no third round: the next review is of the diff.

Justin asked: "how will this all sync with school curriculum and can we run the
same agents over the school curriculum adding an Ofsted agent, school superior
top private schooled education, teachability, easy to use, and any other agents,
as all needs to fit and sync with lessons on here so taking best of both
versions for both." Then, on his phone: "check things like this as print run
sheet not working and the quality of prints need to be high."

This is out of the once a term cycle (Justin, 21 September 2026) on purpose:
the lessons plan changes how every lesson reaches a child and PR 5 adds content
to all 34 decks. So the term rule applies: the MUST findings are built now, the
SHOULD findings wait for next term, and nothing that is already good is
rewritten.

## The answer in one line

**Class teaches, home proves, tea closes it.** One set of 34 lessons, two
renderings of it, and one record of what a child has actually shown they know,
wherever they met the lesson first.

## Scores

| Lens | Round 1 (today) | Round 2 (plan built) |
|---|---|---|
| Ofsted inspector | 7 · 5 · 4 | 8 · 7 · 7 |
| Head of PSHE, leading independent school | 7 · 6 · 5 | 8 · 7 · 7.5 |
| Non specialist teacher (teachability) | 6 · 5 · 4 | 7 · 7 · 7 |
| Designated safeguarding lead | 8 · 4 · 5 | 9 · 6 · 6 |
| SENCo and inclusion | 7 · 4 · 5 | 7 · 7 · 6 |
| Expert teacher | 8 · 5 · 4 | 8.5 · 7 · 6.5 |
| Learning scientist | 7 · 6 · 3 | 7 · 6 · 7 |
| Learning app lead | 7 · 5 · 4 | 8 · 7 · 6 |
| Parent UX | 7 · 7 · 4 | 7 · 7 · 6 |
| Child lens | 7 · 4 · 4 | 7 · 6 · 6 |
| Design lead | 8 · 5 · 4 | 8 · 7 · 7 |
| Sync engineer | 7 · 5 · 3 | 8 · 6 · 6 |
| **Mean (school · home · sync)** | **7.3 · 5.1 · 4.1** | **7.7 · 6.7 · 6.5** |

Round 2 scored version 1. The lowest round 2 scores all trace to one fault in
version 1's section C (an empty road for some year groups) and to Show it being
defined two ways; version 2 fixes both.

## Already done today

- **The run sheet prints properly** ([#1233](https://github.com/GuidedChildhood/guided-childhood/pull/1233)).
  The button was firing; the printout was the fault. Every phase was one
  unbreakable card, so the KS3 run sheet printed on 13 pages, the first nearly
  blank. Now 8 full pages on white, measured on the live page. The print pack,
  booklet, organiser and overview already break cleanly, and their character
  images are 1024px shown at about 60px, sharp on paper. No outside image tool
  is needed for print quality; a server made PDF download is the next step only
  if a phone's own print path still fails.

## The verdicts, by where they land

Every point was weighed with `.claude/skills/feedback-filter`. Each line names
the lenses that raised it independently.

### A. PR 1, before it merges, because PR 1 creates them

All code in `shared/lesson-slides.ts`, the player or the child pages; no deck
changes.

1. **Same cards twice.** When a deck's class sort is a core slide, the worksheet
   does not become a second sort for the child; the tryit is dropped. When the
   class sort is flagged `extension` (ks2-05, ks2-07, ks2-08, ks2-09, ks3-13,
   ks4-15, ks4-16, ks5-20), the worksheet sort stays and the class sort goes, so
   no deck is ever left without practice. *(child, app lead, teacher, design,
   SEND, learning scientist)*
2. **Classroom lines a child alone cannot follow.** The half time breath on 32
   decks ("tell your neighbour... write it on your sheet"), 13 scenario prompts
   ("Hands up", "Vote", "with your partner"), and 15 title slides ("One hour").
   The kid and together audiences rewrite or drop these through the filter, and
   the guard lists every phrase the child must never see. *(child, teachability,
   teacher, SEND, design)*
3. **The reasoning card becomes Think it, not deleted.** The sixth worksheet card
   on 20 decks asks "Do you agree? Explain your reasoning" over verdict buttons.
   For the child it becomes a Think it with two reasons to choose between, the
   card's own teaching point against one of the deck's listed misconceptions, so
   the child's practice still asks why. Card reasons lose their teacher prefixes
   ("Recognise:", "Apply:", "Explain:") and any "Strong answers" sentence.
   *(independent, child, teacher)*
4. **The passport beat leaves the child's deck.** It fills a page from the
   classroom's memory before the check is marked; the child's tick comes from
   the pass. *(design)*
5. **Think it.** It says "Only you see this. It is not saved." It offers "I said
   it out loud" and "Pass for now" beside the typed word, so a child who cannot
   spell the word is not stopped. On the prompts that ask who the child would
   tell, every answer gets the same calm line plus the people they can tell,
   never "Nice". *(DSL, child, SEND)*
6. **A way to tell, inside the player.** The page header sits under the full
   screen player and is never seen, so everything goes into the player: on the
   17 DSL flagged modules a quiet "Need to talk to someone?" link on every slide
   to the child's existing tell page (`/k/[token]/tell`), and a route block on
   the finish screen and the back link. In the deck text, only "before the bell"
   changes, to "your grown up, a teacher you trust, or Childline 0800 1111"; the
   school lead stays a route, because the harm can be at home. The whole home
   endings for ks3-27 and ks4-29 are content and land in PR 5. *(DSL, child,
   design)*
7. **The same friend, the same tool.** The mission page passes the host friend,
   the register and the tool to the player, so the child meets Bloop, a calm DiGi
   on the KS4 safeguarding decks, and the three checks strip. The eyebrow counts
   the child's own road, never the wall's key stage count, so the two never
   disagree one tap apart. *(design)*
8. **The star badge goes into the player** for the same reason as A6. *(design)*
9. **The child's own list reads the one count.** `app/k/[token]/lessons/page.tsx`
   reads `loadChildLessonPath` and joins guard section 6; it was missed in 1.3.
   *(sync engineer)*
10. **The classroom hide of `kid_only` ships now**, while there are none, so the
    schools app can never show a child only item whatever order the two apps
    deploy in. *(sync engineer)*

### B. The home code records coverage, not a pass (PR 2, migration 367)

**The fault, verified in the code.** `app/api/school-code/route.ts` writes a
`school_lesson` completion with `passed: true`. School lessons never get
`lesson_pass_by` rows, so the legacy credit rule counts it: the module shows as
passed, counts toward the stage's lessons, drops off the child's list, and a
later real pass at home loses its five a day tick and its score (the first
finish still sends the tea question; a retake does not). The route's comment says
the opposite. The code is the same for every school every year, so one photo in a
parents' group passes the lesson for anyone, and a code with no child credits
every child in the house. The stamp itself also needs the stage check
(`lib/pathway/stamped.ts`), so the public verify page and the passport must share
that one rule; the verify page is checked and joined to it here. *(all twelve)*

**The fix.**
- A `lesson_coverage` table: child, module id, source (`home_code`, later
  `child_said`), date; the parent's own rows; no school, class or pupil id ever
  crosses. It joins to missions and completions through the catalogue's
  `module_id` to row id map.
- A code requires a child and records coverage. It survives sign up: a signed
  out parent who scans the QR keeps the code in a cookie and the end of the
  starter pack redeems it for the new child. *(app lead)*
- **Until PR 5's child only questions exist, coverage ticks nothing and pays
  nothing.** The two classroom questions were answered aloud in class, sit in
  position A on the printed card 57 times in 68, and give the answer away by
  length or wording on most decks, so a check made of them would be a stamp
  resting on a gameable gate. The "We did this at school" chip ships with PR 5
  for the same reason. *(independent, child, learning scientist)*
- **Every parent facing promise that the code fills the passport is rewritten in
  PR 2**: the passport line on 32 parent notes, the parent sheet's "Today filled"
  line and its "No login needed" line, the booklet, the `/home-code` landing page,
  and the code card's "Stamp it in", "Stamped in" and fill animation. They say
  the class met the lesson and the child's own check puts it on the passport.
  *(parent UX, app lead, teachability)*

### C. A child's lessons follow their school year (PR 1)

**The fault in version 1.** Home picks a child's stage from their birthday and
school teaches by year group. Version 1 kept the birthday stage and hid any module
above the child's school year, which leaves a road of nothing but "Waits for Year
10" for a Year 8 or 9 child for up to two years, and the same for a Year 6 child
at 11. *(Ofsted, DSL, teacher, sync engineer, child, design)*

**The fix.** `schoolYearFromDob` in shared (1 September cut off, guarded so
"Reception" and "Years 7 and 8" parse). A child's lessons come from the key stage
their school year sits in: Reception to Year 2 Foundation, Years 3 to 6 KS2,
Years 7 to 9 KS3, Years 10 and 11 KS4, Years 12 and 13 KS5. No year group ever
meets an empty road, and every child meets a lesson in the year their class
does. With no date of birth the age band decides, as today. The gate is enforced
where a mission starts, in the child's opener and the parent's send route, not
only in the list. *(sync engineer)*

**The heavy lessons wait for a grown up, briefly.** Only the six whose content
needs a parent beforehand wait: ks3-14, ks3-27, ks4-16, ks4-17, ks4-18, ks4-29.
Not the other eleven flagged modules, and never under 7, where a grown up already
reads the lesson. Forty eight hours before one opens the parent gets a note built
from the deck's parent facing text (`parent_note`, `parent_questions`,
`try_this`; never the staff `dsl_note`), with a "Ready" link; the lesson opens on
the tap or after 48 hours either way, so no lesson ever depends on a parent
remembering. PR 1 sends the note as a push and an email; PR 3 adds it to Home.
*(parent UX, DSL, app lead, child)*

### D. One stage map (PR 2, migration 367)

Three copies disagree: `shared/passport-stages.ts`, `lib/lessons/school-path.ts`
and `scripts/check-module-contract.mjs`. So the ks3-12 parent sheet says "Today
filled the Making choices page" while home ticks Explorer, and the wall's
passport beat reads its page from the slide itself. All three derive from one
table in shared; the passport beat reads its page from the module id, not the
slide; the stamps follow the cast (Explorer Orbit, Shaper Nova, Independent
Cosmo); KS5 fills Independent, as home counts it today; the "Today filled" line
on the 18 KS3 to KS5 printed notes changes with it, owned by PR 2 as a print
change; and a guard holds the copies equal. *(sync engineer, independent,
design)*

### E. Statutory teaching that only the teacher says (PR 5, content)

The passages marked "Say this, as written" in the scripts of ten decks hold
statutory RSHE lines (harassment and upskirting, help for your own behaviour,
grooming, pornography and entitlement, prejudice beyond misogyny), and 36 of the
149 RSHE evidence phrases exist only in scripts. In class they are said and never
checked; at home the filter deletes them; the coverage guard counts them anyway.
PR 5 adds a `kid_only` slide for each passage with one check item on it, and the
coverage guards (`rshe-evidence.mjs`, `protected-phrases.mjs`,
`check-computing-coverage.mjs`) count a phrase as taught at home only from the
child's visible text and as taught in class only from outside `kid_only`. Next
term the passages move on screen in the classroom deck too. *(Ofsted, DSL)*

### F. The school version's own must fixes (one small schools PR, now)

1. **Safeguarding on the board.** On the projector the script bar starts open,
   so on ks4-17 a Year 10 class can read "Watch for bravado from some boys". The
   13 September decision to open it stands for every other lesson; on the 17
   flagged lessons it starts closed, and slide 1 is preceded by one teacher only
   screen naming the school's safeguarding lead, the quiet exit route and that
   the script is folded. PR 5 then moves the private "watch for" notes into a
   run sheet only field and reopens the script. *(teachability, DSL)*
2. **The exit card prints answer A 57 times in 68.** Print uses the player's
   seeded shuffle, and the answer key prints from the same order. *(Ofsted)*
3. **The parents page decides withdrawal for the school.** It says the programme
   teaches no sex education while ks3-14, ks4-16 and ks4-17 map to the RSE
   block. It says the school decides, names the three, and offers the parent
   sheet that goes home before them. *(Ofsted)*
4. **The run sheet prints each lesson's real short route.** Lessons run 59 to 75
   minutes and 15 titles say "One hour". The run sheet prints the core minutes
   computed from the deck and which slides to skip to reach them, never a
   promised 55, and `scripts/check-lesson-core.mjs` (which fails on ks3-34 today
   and runs nowhere) is wired into a script CI runs. *(teachability, Ofsted)*
5. **The KS4 order.** ks4-28 moves after ks4-15, the lesson it calls itself the
   sequel to. Starters that retrieve across a key stage or out of order say
   "from an earlier lesson" (PR 5 copy). *(teacher, Ofsted)*
6. **ks4-19 and ks2-26 tell one true story about the law.** ks4-19 is worded so
   it is true whether or not the under 16 rules have started ("The law is
   changing"), and ks2-26 names the coming change beside the 13 rule. PR 5.
   *(independent)*
7. **Look for lines stored as lists** (ks2-23, ks3-22) print as one run on string
   on the wall; the player renders them as a list. *(design)*
8. **SEND notes stored as plain text** on four decks (three flagged: ks3-27,
   ks4-28, ks4-29) render no SEND card on the lesson page. It is a display bug,
   so it ships now. *(SEND)*

### G. Plan v10 corrections

1. **What trims a long lesson.** The kid decks run 16 to 27 minutes and the
   `extension` flag sits on 106 of the child's active slides, including the
   practice sort on eight decks. So no trim ever removes a practice slide, a
   question slide, a Think it, or a slide a reteach points to, whatever its
   flag. Trimming takes opening films first (never the teaching films, which are
   the only slides that teach without reading), then quote, stat and keywords.
   *(learning scientist, teacher, app lead, SEND)*
2. **Learn it and Show it, one definition.** Learn it is the teaching and the
   practice, up to the first check. Show it is a four card warm up from the
   deck's practice sort (unscored), the check, and the tea question, about four
   minutes, opened the next day at the earliest. A child new to a lesson does
   Learn it then Show it; after a class lesson, once PR 5's items exist, Show it
   alone, two or more days after the code. A miss in Show it opens Learn it
   (read aloud where the grown up switch is on) before any second check. Show it
   on the class route pays a smaller award than the full lesson. *(teacher,
   learning scientist, app lead, SEND, design, child)*
3. **A grown up switch per child.** The lesson's key stage decides whether a
   grown up reads it, so an eight year old reads a KS2 deck of up to 2,600 words
   alone. The parent can set "does lessons with me" for any child (a column on
   `children`, so it rides migration 367 in PR 2), which plays the together
   audience; a read aloud button uses the device's British voice, passed into
   the shared player as a prop (no model call on the child's side). *(SEND)*
4. **Quiet pushes on the flagged lessons.** Every push about the 17 flagged
   modules, to the parent and to the child (pass, fail, stall, nudge, next),
   reads "this week's lesson", never the title, and never the tea question in the
   body. The title and the private "say this" close open inside the app. After a
   miss on these, the parent gets the sentence to say tonight, not "nothing to do
   tonight". PR 1 item 1.5 owns the push. *(parent UX, DSL)*
5. **The tea question and the printed pack.** PR 2 owns the print change its
   family question rewrite makes (the parent sheet's "Dinner table question" and
   the booklet's "Ask at home tonight"), uses one label everywhere, "Ask at tea",
   and prints `listen_for` and `then_ask` under it. The six heavy lessons in C get
   a private "say this" close instead of the "teach me" question. *(parent UX,
   sync engineer)*
6. **New items avoid both cues.** PR 5's rule against the longest answer gains
   one against the answer echoing the lesson's wording more than any distractor,
   keeps "the question never names the tool", and adds at least two items per
   deck that apply the idea to a new case. The stage check draws a module's child
   only items once they exist. *(learning scientist, independent, child)*
7. **The child's note.** PR 4's `child_note` is saved and shown to the parent, so
   it says "Your grown up will see this", unlike Think it. *(DSL)*
8. **The home starter.** One recall question from the child's own last passed
   lesson, then its model answer, replaces "from last time" about whichever
   lesson the deck was written to follow. PR 4. *(learning scientist)*

### H. Next term (SHOULD, parked with the reason)

- A year by year plan with end points from each module's `i_can`, and a
  recommended `year` per module. C serves key stages by school year now, which
  carries the urgent half. *(Ofsted)*
- KS3 to KS5 depth: one extended writing or structured debate task per module,
  and a second research camp in ks3-10. *(independent)*
- A "Before next lesson" sheet carrying the child only items into class.
  *(learning scientist)*
- Scripts split into `say` and `notes`, the equipment line generated from the
  pack, "Exit quiz" relabelled; the under 7 together lines reuse the classroom
  actions when PR 5 writes them. *(teachability)*
- SEND notes on the run sheet and print pack, and a reading key in each deck's
  SEND notes. *(SEND)*
- A quiet exit route in the ground rules of every flagged KS3 and KS4 deck,
  beyond the board screen in F1. *(DSL)*
- Reception decks as three carpet sessions. *(Ofsted)*
- The QR carries the school's `/s/` link so the families a school brings can be
  counted. *(app lead)*

### Declined

- **Making some KS3 or KS4 modules "together only".** The distancing in those
  lessons depends on privacy (DSL). The before note and the school year rule do
  the job instead.
- **A class feed where a teacher marks a module taught.** It needs a class
  identifier, the first step to holding pupil records. The home code and the
  child's own check are enough.

## Decisions for Justin

1. **Does class coverage alone ever count?** Recommended no: the code records
   coverage, the child's own check ticks. Every lens agreed.
2. **A child's lessons follow their school year, not their birthday.**
   Recommended yes, as in C. It means a Year 8 child aged 13 does KS3 lessons at
   home alongside their class. Whether the passport's stage pages also move to
   school years is a bigger question about the stages themselves, and C does not
   need it answered.
3. **ks4-19's wording on the under 16 rules.** Version 2 words it to be true
   either way; tell me if the legal position has moved.

## Order

- **PR 1** gains A, C and G4.
- **PR 2** (migration 367) gains B, D, G3 and G5.
- **One small schools PR now**, beside #1233: F1 to F5, F7 and F8.
- **PR 4** takes G1, G2, G7 and G8.
- **PR 5** takes E, F6 and G6, and the content halves of A6 and F1.

Nothing here edits a slide before PR 5.
