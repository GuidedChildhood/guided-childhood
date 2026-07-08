# The Lesson Format — how every Guided Childhood Schools lesson fits together
**Created 4 Jul 2026 · The reusable anatomy behind all 21 modules · Worked example: the reference lesson (KS3 module 12), live in the product**

This is the practical companion to the build spec (schools-lesson-build-spec.md). The spec says why; this says exactly what gets made, in what order, and how JP red pens it. When the reference lesson is approved, the other 20 modules are produced to this format mechanically.

---

## 1. One lesson = one database row = everything generated from it

A lesson is a single row in `school_lessons`. Every artefact a teacher, pupil, parent, governor or inspector ever touches is generated from that one row. Nothing is written twice, nothing is filed, nothing goes stale separately:

| Artefact | Generated from | Where |
|---|---|---|
| The interactive lesson (slides + video beats + checks) | `slides` JSON | Player at /educator (same player the parent platform proved) |
| The paper pack (teacher one pager, bookmark strip, worksheet, start/exit cards, parent note) | `slides` + `teacher_notes` + `parent_note` + `dsl_note` | /educator/print/[module], one click, five pages |
| Statutory evidence line | `statutory_hooks` + `efcw_strands` + `evidence_anchor` | Printed on the teacher one pager, rolled up into the coverage matrix (Phase 4) |
| Marking | `assessment` shape + the checks in `slides` | Auto marked in the player, one tap judgements on the marking screen |
| The register and coverage record | `lesson_deliveries` (one tap) | Feeds every report |
| Parent communication | `parent_note` | Last page of the paper pack, goes home, no login |
| Safeguarding briefing | `dsl_note` | On the one pager, flagged modules only |

This is the paperwork cut: the teacher prints one pack and taps one register. The subject lead never builds a spreadsheet. The evidence assembles itself from what was actually taught.

## 2. The lesson rhythm in practice (what 60 minutes looks like)

Fixed spine, every module, so teachers always know where they are:

```
0:00  VIDEO BEAT: character intro (8 to 15s)      the hook, board text = the lesson in child language
0:01  RETRIEVAL: last lesson's check + last lesson's action commitment revisited
0:06  LEARNING CYCLE 1: teacher models the concept        slides
0:14  VIDEO BEAT: character teaches the core idea (8 to 12s)
0:15  CHECK 1 (auto marked)
0:17  LEARNING CYCLE 2: guided practice, whole class      slides
0:27  VIDEO BEAT: DiGi Junior pause (8s, golden star, from the reusable library)
0:28  LEARNING CYCLE 3: independent practice              the worksheet (paper first)
0:43  CHECK 2 + corrections
0:48  VIDEO BEAT: character mission beat (8s)             hands over the action
0:49  EXIT QUIZ (auto marked) + action commitment captured
0:55  PLENARY: the human skill closer + family question via parent note
```

Rules that keep it industry leading rather than generic:
- **Characters pop up, they never lecture.** Four beats, 45 to 60 seconds of animation total, each beat opens a segment and hands over. Mayer segmenting, Rosenshine modelling, Jigsaw distancing, all in one mechanic no UK competitor has.
- **One action outcome.** Every lesson ends on one thing a child can do that night, captured as a commitment, revisited next lesson. Never a rules list.
- **Paper first.** The identical lesson runs from the printed pack with one photocopier and zero screens. Video needs one teacher screen only; the beats are described in the teacher script for screenless rooms.
- **Locked wording.** Key formulations (the three checks, reset actions, arrival at 16 lines) are canonical and shared across home and school products. Red pen changes to locked wording propagate everywhere or not at all.

## 3. The slide grammar (our own slide system)

Seven slide types, all proven in the live player: `title`, `video`, `concept`, `choice` (auto marked check), `quote` (say it like the character), `tryit` (worksheet moment), `recap`. Plus the eighth, added for schools v2: `interactive` (below). A lesson is 14 to 18 slides using only these. New slide types require a decisions.md entry, not an improvisation. The animation layer is beats referenced by the `video_beats` JSON (character, seconds, board text, model, Higgsfield job id) so any beat can be re rendered or voice swapped without touching the lesson.

### 3.1 The interactive layer (animated HTML components inside lessons)

The eighth slide type: `{ "type": "interactive", "component": "<key>", "config": {...}, "caption": text }`. The lesson row names a component by key and passes config; the component code lives in the app at `components/lessons/interactives/`. This keeps rule 6 intact (content in the database, code in the app), keeps every animation GSAP only (no Three.js), and means a new interactive in one module is instantly available to all 21.

Rules for every interactive:
- **Teacher screen first.** Must work class paced on one projector with the teacher tapping (a show of hands becomes taps on the board). Pupil paced mode is a bonus, never a requirement.
- **If it captures answers, it IS a check:** results write to `check_responses` exactly like a choice slide (class tally mode when there are no pupil devices).
- **Paper twin required.** Every interactive has a described unplugged equivalent in the teacher notes (the equity rule), usually the cut out card version from the print pack.
- **Reduced motion respected, 60fps or it ships simpler.** Subtle, purposeful motion; the animation teaches the mechanic, it never decorates.

The v1 component set (built in the v2 pass, mapped to modules):

| Key | What it does | Modules |
|---|---|---|
| `feed-loop` | The feedback loop drawn live: watch, signal, more of the same, watch more, circling with increasing speed until the loop closes into a bubble | 6, 10, 12 |
| `verdict-sort` | Post cards the class flicks into piles (believe / pause / do not share, or serving / holding) with the DeckViewer flick away motion; tallies animate per pile | 6, 8, 12, 13, 15 |
| `signal-meter` | Tap an action (like, comment, watch to end, rewatch), the signal strength bar animates; watch time visibly outweighs everything | 6, 12 |
| `spread-race` | Two posts race across an animated network, the outrage one pulling ahead; then the class dampens the reaction weighting and re runs it | 12, 15 |
| `class-tally` | The whole class check for no device rooms: teacher taps hands counted per option, bars animate, result saved as the class check response | every module |
| `star-breath` | DiGi Junior golden star breathing pause, expanding and contracting with a 4 second cycle | every module (pause beat companion) |

Source material: the algorithm literacy project in this repo already specifies the mechanics for feed-loop and spread-race (Parts 5 and 8: the paper algorithm, echo chamber and virality simulations); the interactives are their classroom grade GSAP ports.

## 4. Updates to authorities without rewrites

Every lesson carries its statutory tags as data (`statutory_hooks`, `efcw_strands`, AILit domains). When guidance changes (KCSIE annual update, RSHE revisions, the 2028 curriculum): update `LANDSCAPE_CONFIG` and the tags, and every one pager, coverage matrix and governor pack regenerates on next print. No documents to chase, because there are no documents, only generated views of the database. The refresh protocol and triggers live in the spec, section 2.2.

## 5. The red pen protocol (how JP reviews a lesson)

Every lesson passes through this before it ships. The reference lesson goes first and sets the bar.

1. **Watch the beats** (in the player or the Higgsfield library). Verdict per beat: keep / re render (staging wrong) / re voice (words wrong). A re voice is cheap; say so freely.
2. **Play the lesson as a pupil.** Get one check wrong on purpose. Verdict on: difficulty, the feedback lines, pacing, whether the mission lands.
3. **Read the paper pack** (one click print). Verdict on: teacher one pager (would a real teacher walk in confident?), worksheet items, parent note voice.
4. **Red pen anything** in three categories: **wording** (say exactly what to change, it is a one line database update), **structure** (a slide added, removed or reordered), **locked wording objections** (these need a decisions.md entry because they propagate across products).
5. **Sign off** = the words "approved" against the module id. Approval of the reference lesson approves the FORMAT; the other 20 modules then only get red penned on their content, not their shape.

Red pen turnaround target: changes land the same day, content edits are database updates, not releases.

## 6. Where this leaves the industry bar

Already true in the product as of today: character video teaching at secondary (exists nowhere else in the UK market), auto marked checks feeding a live pupil record (no online safety scheme has it), one click paper pack generation (Jigsaw ships boxes of print; ours regenerates from data), one tap register and exceptions only marking (under five minutes teacher admin), statutory tags as data (inspection evidence that assembles itself). Still to come per the spec phases: the coverage matrix and governor pack generators (Phase 4), assembly films via the Avatar pipeline, CPD module, and the pilot machinery (Phase 5).
