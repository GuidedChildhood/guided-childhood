# The Oak QA: passes 16 to 18, and the delta on ks3-12

Phase 3 of the Oak plan. The brief: take the exemplar through Oak's ten
sections end to end, re run the fifteen pass QA with three new passes added
for the Oak sections, and publish the delta.

The fifteen passes and the 94 they produced are in
`research/2026-09-06-ks3-12-gold-standard-qa.md`. Nothing in migrations 268,
269 or 270 touches a slide, a script, a worksheet or a note, so those fifteen
stand as they were. What follows is the three new passes, run on ks3-12 and
then on the whole scheme, because the finding turned out not to be local.

## Pass 16: the contract is complete, and every line of it is true of the deck

Oak's ten sections, checked against ks3-12 as it stands live.

| Oak section | Ours | Verdict |
| --- | --- | --- |
| Lesson details | key_stage, year_band, title, character cast | PASS |
| Learning outcome | single_action_outcome plus the three statement i_can ladder | PASS |
| Learning cycle outcomes | cycles, one outcome each | PASS, after 270 |
| Prior knowledge | three statements, each naming the module it comes from | PASS |
| Key learning points | five statements | PASS |
| Misconceptions | three, each dismantled by its own in lesson question | PASS |
| Keywords | four with pupil facing definitions | PASS, filled by 268 |
| Starter quiz | four questions, mixed formats, both versions | PASS |
| Learning cycles | explanation, checks, practice and feedback inside each | PASS |
| Exit quiz | five questions, mixed formats, both versions | PASS |

Read for truth rather than presence. The prior knowledge points at ks1-03,
ks2-09 and ks2-06 and each of those modules does teach the thing claimed. The
five key learning points are each taught on a named slide. The teacher tip
(run one check on something true first) describes a real risk in this deck,
which opens on a fake. The equipment line says nothing beyond the board and
that is accurate: every example in the deck is invented, so no live post,
account or person is opened in the room.

## Pass 17: the quizzes check what the lesson actually did

The starter's four questions map onto the three prior knowledge statements
plus one that establishes the lesson's own frame (looking real is not
evidence). The exit's five map onto the five key learning points. Formats are
mixed in both, per Oak. Every answer carries a teaching point, which Oak's
answer sheets do not: theirs say what the right answer was, ours say what to
do about a wrong one.

Answers checked against the deck rather than against the writer's memory. The
three checks in the exit quiz match the diagram on slide 11 word for word. The
misinformation and disinformation definitions match the keywords slide. PASS.

One note, not a finding: the in lesson choice slides were left alone on
purpose. They are checks for understanding, discussed out loud mid cycle. The
quizzes are marked at the edges. Both jobs exist and neither replaces the
other.

## Pass 18: the cycle map tells a pupil the truth about where they are

**FINDING, fixed in migration 270 and the player change beside it.**

Phase 2 derived which cycle a slide sat in by spending each cycle's stated
minute budget against the minutes the slides already carried. It was verified
against a nine slide fixture in which every teach slide was its own cycle,
which is the easy case, and that is what hid this.

Run against the 21 production decks, that derivation opened a cycle on the
slide it is named after **28 times out of 61**. On this exemplar, a pupil
looking at the slide headed "The three checks" was shown
"Notice: Content can be manufactured" in the chrome. The map was confidently
wrong on more than half the scheme, which is worse than having no map.

Root cause: minute budgets are approximations, so a boundary lands a slide
early or late; and seven cycle titles had been written from the timing
string's prose rather than from a slide, so they named nothing in their own
deck at all.

The fix has two halves and needs both.

*The data, migration 270.* The seven titles are retitled to the deck's own
heading. Every cycle's minutes are recomputed from the slides it actually
contains, so the number on the map is a measured runtime rather than a budget
nobody ever checked it against. Two structural corrections the audit
surfaced: ks2-04 had five taught concepts under three cycles with a third
swallowing eight slides and nineteen minutes, so it gains a fourth cycle its
deck already taught without naming; ks4-17 had a second cycle of one slide
and two minutes, re anchored on a real beat to give 10, 8 and 10.

*The code.* The player now anchors a cycle to the slide whose heading it
names. A title that anchors nowhere leaves the deck unmapped rather than
guessed at, because a wrong cycle name on screen is worse than none, and the
migration's guard exists so that branch stays unreachable.

**After: 62 of 62 cycles open on the slide they are named after, and 62 of 62
print the minutes their own slides actually run.** Verified three ways: the
shipped derivation replayed against all 21 production decks, a guard in the
migration that refuses any module whose cycle minutes do not equal its teach
phase, and the exemplar stepped slide by slide in a browser at 390 and 1280,
where all fifteen teach slides now name the right cycle.

## The delta

Before phase 3: fifteen passes clean, score 94, and a sixteenth to eighteenth
that had never been run. Pass 18 would have failed, hard, and nobody would
have seen it from the data alone. It took reading the real decks.

After: 18 of 18 clean. **Score: 94, unchanged**, and that is deliberate. The
six points held back are still the two things a database cannot claim: this
lesson has not been taught in front of a real class by a non specialist, and
the video beats are four of a planned fuller set. Finding and fixing a bug we
shipped does not earn points back; it returns the lesson to the standard it
was already claiming.

## What this means for the other twenty

Two things carry into the key stage batches.

1. **The cycle fix is already scheme wide.** Migration 270 covered all 21
   modules, not just the exemplar, because the bug was in a mechanism shared
   by every deck. There is no per module cycle work left in the batches.
2. **Verify against the real artefact, never a fixture.** The whole finding
   exists because phase 2 proved the derivation on a stub that happened to be
   the easy case. Every ENHANCE pass reads production.

Three modules still open a cycle in under four minutes: eyfs-01 [3, 7],
ks1-02 [3, 10] and ks2-04 [2, 7, 10, 9]. In the two early years lessons that
is honest, because the lesson genuinely opens with one concept slide before
it starts applying it. ks2-04's two minute opener is worth revisiting in the
KS2 batch, and is named here so it is not quietly forgotten.
