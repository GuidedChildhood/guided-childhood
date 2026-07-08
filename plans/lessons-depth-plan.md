# Private school quality lessons — the depth plan

**Written 8 Jul 2026 · How every one of the 45 lessons earns the words "private school quality" · Builds on lessons-engine-plan.md, lesson-format.md and the curriculum matrix, does not replace them**

Justin's ask: make the lessons really in depth, private school quality, and give me a plan. We already have the machine (one lesson equals one database row, slides JSON, seven slide types plus interactives, video beats, school and parent renderings from one master). What we do not yet have is depth. Forty five topics are seeded as stubs and one exemplar is live. This plan defines what depth means here, sets the bar, and lays out how we hit it lesson by lesson without slowing to a crawl.

---

## 1. What "private school quality" actually means (so it is a bar, not a vibe)

A good private school is not better because it is posher. It is better because of six concrete things a parent can feel. We copy those six, on purpose, into the lesson format.

1. **Small steps, high challenge.** Nothing is dumbed down. The thinking is genuinely hard, but it arrives in steps small enough that every child gets there. Rosenshine's principles, already named in lesson-format.md, are the spine.
2. **The teacher clearly knows more than the lesson shows.** Depth behind the surface. Every lesson carries subject knowledge the child never sees but that makes the answers, the misconception warnings and the follow up questions unusually sharp.
3. **It connects outward.** A private school lesson on persuasion touches rhetoric, advertising, politics and the child's own group chat in one arc. Our lessons must reach across the strand and into real life, not sit in a box.
4. **Talk is the method.** The best lessons are mostly good questions and real discussion, not slides read aloud. Oracy is taught explicitly. Our "together" and family question moments carry this.
5. **Mastery, then move on.** A child does not progress because a week passed. They progress because they can do the thing. Assessment is real and the next lesson genuinely builds on the last.
6. **Enrichment as standard.** There is always a way up for the child who is flying: a harder question, a wider reading, a real project. Never a dead end at the bottom of the class's pace.

If a lesson has all six, it is private school quality. If it is missing any, it is not, however pretty the slides.

---

## 2. The depth upgrade to the lesson row (what a lesson stores now)

The current lesson row (slides, teacher_notes, parent_note, dsl_note, statutory_hooks, video_beats) proved the format. Private school depth needs a richer row. We add these fields to `school_lessons` (one migration, additive, nothing rewritten):

- **`big_question`** — the one genuinely open question the whole lesson orbits. Not "what is a strong password" but "who is a secret actually for". Displayed on the title slide and revisited at the close.
- **`knowledge_core`** — the subject knowledge behind the lesson, written for the adult (teacher or parent), 200 to 400 words. The thing that makes them sound like they know the field. Never shown to the child; printed on the teacher one pager and surfaced in the parent note as "what you actually need to know".
- **`misconceptions`** — an array of the three most common wrong ideas a child holds on this topic, each with the sharp question that surfaces it and the line that corrects it. This is the single biggest quality lever; it is what separates an expert teacher from a script reader.
- **`vocabulary`** — three to five words the lesson makes a child own, each with a child definition and a sentence that uses it well. Tier two academic vocabulary, taught on purpose (the private school habit that quietly widens the gap).
- **`oracy_move`** — the explicit talk task for this lesson (sentence stems, a structured disagreement, a paired explain back). Oracy is planned, not hoped for.
- **`stretch`** — the enrichment ladder: one harder question, one thing to go and read or watch, one real project a keen child could run for a week.
- **`prior` / `next_builds`** — the mastery links: exactly what must be secure before this lesson, and exactly what the next lesson assumes this one delivered. Turns 45 topics into five real learning journeys.
- **`assessment_gate`** — the mastery check that actually gates progress in the parent rendering: the specific thing a child must be able to do before the strand's next lesson unlocks (soft unlock, never a hard wall, per non negotiable 1).

None of this changes the player. It is depth the row carries so that everything generated from the row (the lesson, the paper pack, the parent note, the DiGi context) is sharper. Content in the database, code in the app, rule 6 intact.

---

## 3. The depth spine (what 45 minutes of a deep lesson looks like)

We keep the proven rhythm from lesson-format.md and thread the six quality marks through it. The changes from the current spine are marked NEW.

```
0:00  BIG QUESTION on the board (NEW)          the open question, no answer yet
0:01  VIDEO BEAT: character hook
0:02  RETRIEVAL: last lesson's must-be-secure knowledge, low stakes quiz (mastery link)
0:07  VOCABULARY: the words we will own today (NEW)   three words, taught not glossed
0:10  MODEL: teacher/parent works the hard idea    small steps, thinking made visible
0:18  VIDEO BEAT: character teaches the core idea
0:19  CHECK 1 (auto marked) + a MISCONCEPTION probe (NEW)   the wrong idea surfaced on purpose
0:24  ORACY MOVE: structured talk (NEW)            paired, with sentence stems
0:30  INDEPENDENT PRACTICE: worksheet / interactive
0:40  CHECK 2 + corrections aimed at the misconception
0:44  RETURN TO THE BIG QUESTION (NEW)             now answer it, having earned it
0:47  MISSION + action commitment captured
0:50  STRETCH offered to anyone flying (NEW)       harder question or the project
0:52  CLOSE: the human skill closer + family question home
```

The private school feel comes from three of these being new and non negotiable: the big question that frames real thinking, the misconception probe that shows the lesson knows where children go wrong, and the oracy move that makes talk the method. The parent rendering compresses this to the sofa (shorter model, one check, the family question), but the big question, one misconception and the stretch survive into the home version. That survival is what makes the parent lesson feel like a real lesson and not a tip.

---

## 4. Producing 45 to this bar without stalling

We do not write 45 deep lessons by hand from scratch. We build one gold standard, then produce the rest against it with a disciplined pipeline.

**Step 1 — the gold standard (this week).** Take the one live exemplar (Explorer, Managing online information, "How the algorithm decides") and upgrade it to carry every new field in section 2 and every new beat in section 3. This becomes the reference for depth, the way the KS3 module 12 was the reference for format. JP red pens it against the six marks in section 1 explicitly: is the big question genuinely open, is the knowledge core something a teacher would be glad to have, are the three misconceptions the real ones.

**Step 2 — depth packs, one strand at a time.** A strand is five lessons (one per stage) telling one story from age 4 to 16. Produce a whole strand as a unit so the mastery links (`prior` / `next_builds`) are real, not bolted on. Order by demand: Health wellbeing and lifestyle first (sleep, mood, the cool down lap: the things parents are fighting about tonight), then Managing online information, then Online relationships, then the rest of the matrix.

**Step 3 — the knowledge core is researched, not invented.** Each strand's `knowledge_core` and `misconceptions` are built from the kids-research skill in this repo (six lens STORM briefing with adversarial citation verification) so the subject knowledge behind our lessons is genuinely expert and genuinely sourced. This is the private school teacher's degree, encoded. It is also our moat: no competitor's online safety scheme carries researched misconceptions.

**Step 4 — one master, still two renderings.** Nothing here breaks write once sell twice. The depth fields enrich both the school one pager and the parent note. School gets the full knowledge core and oracy structure; the parent gets "what you actually need to know" and one thing to talk about on the sofa. Same row.

**Step 5 — the mastery journey feeds the pathway.** `prior` / `next_builds` / `assessment_gate` are exactly what the pathway journey (PathwayJourney, the lessons strand) needs to sequence lessons properly and unlock the next one on real mastery rather than on time. The depth work and the pathway work are the same work. Building depth into the row is what makes the "do the next lesson" strand honest.

---

## 5. Quality control: the red pen checklist per lesson

Every lesson ships only when a reviewer can tick all six. This is the format-level red pen from lesson-format.md, sharpened to the depth bar:

- [ ] **Small steps, high challenge**: the hardest check is genuinely hard, and the steps to it are genuinely small. Nothing dumbed down, nothing left as a leap.
- [ ] **Depth behind the surface**: the knowledge core would make a non specialist parent or teacher feel properly briefed, not patronised.
- [ ] **Connects outward**: the lesson names at least one real world link the child recognises from their own week.
- [ ] **Talk is the method**: the oracy move is a real task with structure, not "discuss with a partner".
- [ ] **Mastery links are real**: `prior` names something the previous lesson actually taught; `next_builds` is something the next lesson actually needs.
- [ ] **Enrichment exists**: the stretch is a real way up, not "do more of the same".

Turnaround target unchanged: content edits are database updates, land same day.

---

## 6. Why this wins

Every UK online safety scheme (Jigsaw, the PSHE Association packs, the free NCA and Internet Matters resources) is a mile wide and an inch deep: a slide, a discussion prompt, a worksheet, one lesson per year group, no researched misconceptions, no mastery links, no oracy structure, no enrichment ladder. A parent who went to or pays for a good school knows the difference between that and a real lesson in their bones, even if they cannot name it. The six marks in section 1 are that difference, made concrete and shipped from one database row into both the classroom and the sofa. That is the product no one else in this market is close to, and it is the reason a family pays.

---

## 7. First actions

1. Migration: add the eight depth fields in section 2 to `school_lessons` (additive, claim the next migration number in the draft PR at build time per the multi session rules).
2. Upgrade the live exemplar to the gold standard and put it in front of JP for the six mark red pen.
3. Run kids-research on strand one (Health wellbeing and lifestyle) to build its knowledge core and misconceptions.
4. Produce strand one, all five stages, as the first depth pack.
5. Wire `prior` / `next_builds` / `assessment_gate` into the pathway lessons strand so mastery, not time, unlocks the next lesson.
