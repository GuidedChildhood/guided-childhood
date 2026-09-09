# The lesson council: ten checks, and which of them can honestly hold a gate

Justin, 9 September 2026: ten agents, each running a test on its findings, each
scoring at least 8.5 out of 10, reiterating until every question and outcome
passes. Plus the passport built onto the whole platform.

---

## 1. The problem with a self scored gate, and how this design answers it

**An agent that scores its own work and re-runs until it hits 8.5 will hit 8.5.**
Same model, same judgement, marking its own homework, with the loop condition
telling it what answer ends the loop. That produces a wall of eights and nines
that means nothing, and it is worse than no score, because it retires the
question.

So every check below is one of two kinds, and the kind is stated, never blurred.

**COUNTED.** The score is computed from the database, the code or a rendered
page. It is arithmetic. A counted check can hold a hard gate, and a re-run only
passes if the product actually changed. Seven of the ten are counted, and two
more are partly counted.

**JUDGED.** The score is a model's opinion. It is reported, never gated, never
re-run to convergence, and always carries its reasoning so a human can disagree.
A judged check is a prompt to look, not a certificate.

**The one rule that keeps this honest:** a judged check may never be re-run for a
better score. If it comes back at 6, the answer is to change the product, not to
ask again. Re-running a judged check until it passes is the exact failure this
section exists to prevent, and the skill must refuse to do it.

---

## 2. The ten, mapped

| # | Justin's ask | Kind | What is actually measured | Passes at |
| --- | --- | --- | --- | --- |
| 1 | Recommendations are live in the platform | **Counted** | Every accepted recommendation has a migration or commit that landed on main, and the field it promised is non null on every module it claimed | 10/10 or it names the misses |
| 2 | Appearance: slides, colour, animation, motion, aimed at engagement | **Counted** | Every projected text size against the ISO 9241 floor by age band; contrast against WCAG AA; motion durations against the age table; decoration behind text = automatic fail | 8.5 = 85 percent of slides pass every rule |
| 3 | Engagement at the highest level | **Counted** | Share of slides carrying an all pupil response moment; minutes between pupil actions; the five ranked interaction patterns present or absent | 8.5 = a pupil action at least every 4 minutes and all five patterns available |
| 4 | No other provider teaches this well | **Judged**, with a counted spine | Counted: our artefact list against Oak, Kapow and Common Sense, feature by feature. Judged: the quality of what is inside them | Reported. Never gated |
| 5 | A teacher would recommend it | **Judged** | An adversarial teacher persona rewarded for finding the reason not to recommend | Reported. Never gated |
| 6 | Assessment technique at top private school level | **Counted** | Every question typed against Bloom; the ratio of recall to application to evaluation; whether any item measures behaviour rather than recall; whether the exit quiz changes what happens next | 8.5 = at least 40 percent above recall, and at least one behavioural item per module |
| 7 | Ease of use, and the child's safety knowledge and happiness | **Split** | Counted: clicks and pages from catalogue to teaching, and the reading age of every pupil facing line. Judged: happiness | Counted half gates at 8.5. Happiness reported |
| 8 | 9 out of 10 from child, parent, teacher, head, decision maker | **Neither yet** | This needs real people. The council builds and maintains the questionnaire; the number comes from respondents | Not scored until real responses exist |
| 9 | Always suggests changes as the science and the AI world move | **Counted** | Every claim in every lesson checked against its source; anything whose source has been retracted, superseded or contradicted is raised | 10/10 or it names the stale claims |
| 10 | The passport, built onto the platform | **Counted** | Passport visible on every module, a stamp at every completion, the child's own view, and the shop | 8.5 = 18 of 21 modules |

**Item 8 is the honest one.** A model cannot tell you what a head teacher would
score you. It can write the questionnaire, it can predict, and the prediction is
not the number. The council will hold the instrument and the real responses.

---

## 3. What each counted check runs against

Not opinions about the product, queries against it.

- **Check 1** reads `plans/decisions.md` and the migration list, then asserts the
  promised field is non null on every module claimed. A recommendation that was
  written down and never shipped fails loudly.
- **Check 2** walks all 479 slides, resolves every font size the player would
  render at projector scale, and compares to the age band floor. It fails a
  slide, names it, and says by how much.
- **Check 3** counts, per module, the gaps between pupil actions in minutes,
  from the `minutes` field that every slide already carries.
- **Check 6** classifies every starter and exit quiz item. We already store both
  banks on all 21 modules, so this is arithmetic on existing data.
- **Check 9** walks every `stat` slide (12 of them), every `evidence_anchor` and
  every `evidence_base` row, and re-fetches the source.
- **Check 10** asserts the passport surface on each module.

Each counted check writes its score and its failing rows to a table, so the
score has a receipt and a trend rather than a number in a chat message.

---

## 4. The passport, item 10

**Most of it exists, in the parents app.** The passport pages, the stage quiz,
the todo list, the nightly `passport-check` cron, and a sticker catalogue keyed
by a stable `sticker_key` so the art and the earned records cannot drift.

**In the schools app it does not exist at all.** The word "passport" appears in
`schools/app/philosophy/page.tsx` as an argument, and nowhere else. It is not on
a lesson, not stamped at the end of one, and not visible to a child in a
classroom.

So the build is:

1. A passport stage on every module, so a lesson says which stamp it earns.
2. A stamp at the close of the lesson, in the player, visible to the class.
3. The child's own view, in the parents app, showing the Planet Friends stamps
   collected and the ones still to earn.
4. The shop: the physical passport and the sticker sheets.

Order matters. Nothing is worth building until (1) exists, because until a
lesson knows what it earns, there is nothing to stamp.

---

## 5. Honest limits, before anyone builds this

- **Seven counted checks are only as good as their thresholds.** The ISO 9241
  legibility floor is a real standard. "A pupil action every four minutes" is
  our judgement dressed as a number, and it should be argued about.
- **A counted check can be gamed by changing the check.** The checks live in
  the repo and change through pull requests, so gaming them leaves a trail.
- **None of this measures whether a child is safer.** It measures whether the
  lesson meets the standard we set. Those are different claims and we should
  never merge them in front of a school.

