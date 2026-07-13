# Video script sessions — the scaffold the research fills
**7 Jul 2026 · The reusable screenplay template for every module's video content, parent track and child track. The deep research (Internet Matters early years + Digital Matters + Common Sense synthesis) drops its topic map straight into this format, and the scripts become `video_beats` JSON on the lesson rows (rule 6: content in the database). Scripts are writable NOW with zero Higgsfield credits; only renders wait.**

## The two tracks per topic

Every topic ships as a pair. The parent learns first, then sends the child version
as a Star Lesson. This is the loop none of the three benchmark resources close:
Internet Matters teaches parents but hands off weakly, Common Sense is school
first, Digital Matters is KS2/3 only. We close it with Star Lessons.

### Track P — the parent session (60 to 90 seconds)
The Internet Matters early years model, our voice. Watched on a phone, one handed,
probably at 9pm. Structure:

```
P-BEAT 1 — THE MOMENT (10 to 15s, dialogue beat)
  The real household moment, named exactly. "Your four year old grabs the
  phone the second you put it down." No preamble, no statistics first.

P-BEAT 2 — THE REFRAME (20 to 30s, concept beat)
  The calibrated pathway view. Never allow or deny: what this behaviour is
  actually telling you, and the one structural move that helps. Evidence
  named honestly if used ("the sleep research says..." with a real source).

P-BEAT 3 — TRY THIS TONIGHT (15 to 20s, mission beat)
  ONE action, doable today, specific wording the parent can borrow.
  Ends with the handoff: "and when you are ready, send the kids version,
  DiGi teaches it and they earn stars."

P-BEAT 4 — OPTIONAL DIGI TAG (5s, from the DiGi library)
  DiGi star wave: "Questions? Ask me any time." Routes to the advisor.
```

### Track C — the child session (a complete flowing deck, not just beats)
The Section 10.2 screenplay format for the animation beats, cast by key
stage, PLUS the slides woven between them so the whole session flows as
one piece: DiGi opens it, slides and beats alternate, DiGi closes it.

```
OPEN     — DIGI INTRO (digi slide or 5s library beat): DiGi the golden star
           welcomes them in by mission name. "Detectives, today's case..."
BEAT 1   — INTRO   (12s dialogue beat: the hook, board text, case open)
SLIDES   — 1 to 3 slides from the existing grammar between every pair of
           beats: concept, scenario (a feed post to judge), diagram,
           keywords, choice (the check), discussion, or interactive
           (verdict-sort, signal-meter, feed-loop, spread-race,
           class-tally, star-breath). Name the slide type and write its
           content. The deck must read as ONE flow, never a video dump.
BEAT 2   — CONCEPT (10s identity beat: the tool taught in one breath)
SLIDES   — the practice moments (choice checks, an interactive)
BEAT 3   — PAUSE   (8s DiGi Junior library: breath, five word share)
SLIDES   — the apply moments (scenario, discussion, the last two choice
           slides are the quiz that proves the lesson)
BEAT 4   — MISSION (8s identity beat: the handover, one action this week)
CLOSE    — DIGI FINISH (digi slide, always last, 3 to 4 bubbles). Two
           variants written for every topic:
           · School close: mission set, exit quiz goes out, see you next
             lesson.
           · Home close (the Star Lesson version): DiGi tells the child
             the lesson is COMPLETE, their grown up is getting the good
             news right now, and their stars have landed, and stars turn
             into device time. Example register: "Case closed! ⭐ Your
             grown up just got the news, and your stars are in the bank.
             Stars mean screen time, you earned it the smart way."
```

Screenplay fields per beat (unchanged from the spec):
CHARACTER / SETTING / BOARD / MOOD / per shot ACTION + LINE (or VOICE).
One idea per beat. Max two shots. Board text is the lesson title in the
child's language. No dashes in any spoken line.

## Age banding (research fills the exact topics)

| Band | Parent track framing | Child track cast |
|---|---|---|
| 0 to 5 | Parent ONLY (child never watches), co viewing and routines | none, or Sofia for a co view moment |
| 5 to 7 | Parent first, then co watch together | Sofia + DiGi Junior |
| 7 to 11 | Parent first, child version via Star Lesson | squad adventure cast |
| 11 to 14 | Parent primer (shorter), child version leads | Zara / Vix / Brock detective register |
| 14 to 16 | Parent briefing, near adult child version | Vix + DiGi straight talk |

## The pipeline

1. Research lands → combined 0 to 16 topic map, mapped to the 21 modules, gaps named.
2. Each topic gets a session file: `plans/script-sessions/<band>-<topic>.md` with Track P + Track C in this format.
3. JP red pens (wording is a one line edit).
4. Scripts land in the database: child beats into `video_beats` on school_lessons rows, parent sessions into the parent content system.
5. Renders queue for Higgsfield when credits land. Everything above works without them.
