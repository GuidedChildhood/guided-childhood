# Evidence of outcomes: where a parent started, where they ended up

Research, 6 August 2026. Justin's ask: we need to be able to demonstrate where a
parent started, what their problems were, where they ended up, which problems got
solved, and how.

This is research and a recommendation. Nothing here is built yet.

## The short version

We already collect nearly everything needed. The problem is not capture, it is
that **the data model overwrites its own evidence**. Every concern is one row that
gets UPDATEd in place as it moves from open to improving to resolved, so at any
moment we know the current state and have lost the journey. We cannot say when it
resolved, how long it took, how many times it went backwards, or what the parent
did in between.

Four changes fix it, and three of them are small.

## What we have today, measured

Live numbers from the database on 6 August 2026, not from the schema.

| Table | Rows | Verdict |
|---|---|---|
| `concerns` | 67 across 44 parents | Working. This is the spine. |
| `script_completions` | 55 | Working. What they tried. |
| `lesson_completions` | 37 | Working. |
| `digi_conversations` | 20 | Working. |
| `wellbeing_checks` | 12 | Thin. |
| `family_agreements` | 3 | Thin. |
| `wellbeing_checkins` | 2 | Effectively dead. This was meant to be the monthly re-measure. |
| `stage_quiz_passes` | 0 | Never written to. |
| `digi_outcomes` | 0 | Never written to. Was meant to record whether DiGi's advice worked. |
| `script_lines_used` | 0 | Never written to. |
| `stage_passports` | 0 | Never written to. |
| `evidence_items` | 0 | Schools side. Exists, unused. |
| `generated_reports` | 0 | Schools side. Exists, unused. |

The concern arc is genuinely moving on its own:

| Status | Count | Ever checked in on |
|---|---|---|
| open | 35 | 13 |
| resolved | 23 | 23 |
| improving | 9 | 9 |

23 resolved and 9 improving out of 67 is a real signal, and it is the single most
valuable thing we own. It is also, right now, almost unusable as evidence, for the
reasons below.

The problems parents actually bring, in their own words, are the ordinary ones:
bedtime battles, phone handover fights, turning the TV off, homework refusal,
sibling fights over a device, school pick up. Not extreme cases. That matters for
how we tell the story.

## The structural flaw

`app/api/concerns/status/route.ts` and `app/api/daily/concern-check/route.ts` both
do the same thing: read the concern, compute a new status, UPDATE the row.

```
better → improving, and a second better in a row → resolved
same   → stays open
hard   → stays open
```

That logic is good. The storage is the problem. One row per `(user_id, slug)`, and
`status` plus `last_checked_at` are overwritten every time. Consequences:

1. **No resolved_at.** We cannot say "solved in 11 days". We only know it is solved
   now. `last_checked_at` is the last touch of any kind, not the resolution.
2. **No severity.** open, improving and resolved is a three state flag. A parent who
   goes from screaming matches every night to one grumble a week reads as the same
   single step as a parent who was mildly annoyed.
3. **No attribution.** Nothing links a resolution to the script, lesson or DiGi
   conversation that preceded it. We cannot answer "how".
4. **No history.** A concern that resolved, recurred and resolved again looks
   identical to one that resolved first time. `times_flagged` survives, the arc does
   not.

Everything else in this document depends on fixing this one thing.

## What to add

### 1. An append only event log (the whole ballgame)

A `concern_events` table. One row every time anything happens to a concern: first
flagged, rated, checked in on, resolved, recurred. Never updated, only inserted.
`concerns` keeps its current state as a fast read; `concern_events` becomes the
evidence.

Minimum columns: `concern_id`, `user_id`, `event` (flagged, rated, resolved,
recurred), `severity` (see below), `source` (which surface), `linked_type` and
`linked_id` (the script, lesson or DiGi conversation this followed), `created_at`.

This is cheap, it is additive, and it starts accruing value the day it ships. Every
day we do not have it is a day of evidence we cannot reconstruct later.

### 2. A 0 to 10 severity rating, at first flag and at each check in

The three state flag is too coarse to show distance travelled. Ask once, in plain
words, when a concern is first raised: *how bad is this right now, 0 is fine and 10
is the worst it gets*. Then re-ask at each check in.

This is the **Goal Based Outcomes** approach, developed by Dr Duncan Law and used
across UK CAMHS: the person names the problem in their own words, rates it 0 to 10
at the start, and re-rates over time. The outcome is the movement along the scale.
It has been tested for test retest stability, convergent validity and sensitivity
to change.

It fits us almost exactly, because our concerns are *already* the parent's own
named problems rather than items from a questionnaire. That is the hard part of
GBO and we did it by accident.

**Licensing caution.** The GBO materials are shared under Creative Commons
BY-NC-SA 4.0, which is a **non commercial** licence, and we are a paid product.
CORC's own pages also say the material is free to use with credit, so the position
is not clean. The method itself (ask someone to name a problem and rate it 0 to 10)
is not something anyone can own, but their forms, wording and the GBO name are.

Recommendation: use the approach, write our own words, do not reproduce their forms
and do not call it "the GBO" in the product. If we ever want to name it in a
research paper or a schools tender, email CORC first and get it in writing. That is
a cheap email and it removes the only real risk here.

### 3. Attribution: what was tried in between

We already record `script_completions`, `lesson_completions` and
`digi_conversations` with timestamps. Once concern events are timestamped too, "the
parent used the bedtime script on the 4th and rated bedtime 8 down to 4 by the
11th" is a join, not a new feature.

The honest version of this is a sequence, not a cause. See the limits section.

`script_lines_used` at 0 rows is worth reviving here: which *line* worked is the
most specific evidence we could possibly have, and the table already exists.

### 4. Revive the re-measure

`wellbeing_checkins` has 2 rows. Whatever the intent was, it is not running. A
before and after needs an after, and a monthly prompt that nobody answers gives us
neither. Either make it a real part of the loop or drop it and rely on the per
concern ratings, which are answered far more often because they are attached to a
live problem rather than to a calendar.

My recommendation is the second. Per concern ratings are better evidence anyway,
because they are specific.

## What we can claim, and what we cannot

This is the part that decides whether the evidence survives contact with a hostile
expert, a journalist, or a school's safeguarding lead.

**We can say, once the above is built:**

- What parents arrive with, in their own words, with real frequencies.
- How many named problems moved, by how much, and over what period.
- What those parents did in between, specifically.
- How many problems recurred, which is the number most people never publish and the
  one that makes the rest believable.

**We cannot say, and must not imply:**

- **That we caused it.** There is no control group. A pre/post design with no
  comparison cannot separate our effect from time passing, the child getting older,
  the school term changing, or anything else the family did.
- **That the improvement is not partly regression to the mean.** This one is
  specifically dangerous for us. Parents sign up *at their worst moment*, during a
  crisis. Things measured at a peak tend to improve regardless of what anyone does.
  Any honest write up has to name this, because the first competent critic will.
- **That self reported ratings are objective.** They are the parent's perception,
  scored by a parent who has invested money and hope in the thing being scored.
  Response shift is real: people re-calibrate what "7 out of 10" means as they learn
  more about the problem.

**Two cheap things that meaningfully strengthen it:**

1. **A retrospective pre-test.** At the point a concern resolves, also ask the
   parent to re-rate *how bad it was at the start, looking back now*. Comparing the
   retrospective baseline to the outcome is the standard correction for response
   shift, and it costs one extra question.
2. **Publish the failures.** Report the concerns that stayed open and the ones that
   recurred, with the same prominence as the wins. A 48% resolution rate reported
   alongside its own denominator is far more persuasive than a selected 90%, and it
   is the difference between marketing and evidence.

## The three audiences want different things

**The parent.** Wants to see their own journey: here is what you came in with in
March, here is where it is now, here is what you did. This is also the strongest
retention feature we could build, because it makes progress visible in a product
where progress is otherwise slow and invisible. `stage_passports` at 0 rows was
presumably reaching for this.

**Schools.** Want aggregate, anonymised, and mapped to something they already
report against. The schools side already has `evidence_items` and
`generated_reports` tables sitting empty, which suggests this was designed once
already. Schools will also ask about validated instruments, which is where SDQ and
SWEMWBS come up.

**Press, funders and partners.** Want a method they can check. This is where the
limits section above becomes an asset rather than a liability.

### On the validated instruments, and what they cost

Worth knowing before anyone promises a school we use them:

- **SDQ** (Strengths and Difficulties Questionnaire, the UK standard for child
  wellbeing). Paper use is free for non profit use, but **no one except Youthinmind
  is authorised to create electronic versions**. A digital implementation needs a
  licence. Their own product, SDQpro, is priced per child per year (rising to about
  US$3 per child from August 2026).
- **SWEMWBS** (Short Warwick Edinburgh Mental Wellbeing Scale). Free on a non
  commercial licence with registration. The **commercial licence is £6,000** for up
  to 30,000 participants.

Neither is free to us as a paid product. Neither is needed for the parent facing
work. If a school or a formal evaluation ever demands one, the sane route is for the
school or the research partner to hold the licence, not us.

For our own product, the 0 to 10 per concern rating is the right tool: free, ours,
specific to the problem the parent actually named, and answered far more often than
a 25 item questionnaire ever would be.

## Recommended order

1. **`concern_events`, append only, with severity.** Nothing else works without it,
   and every day of delay is lost evidence. One migration, two route changes.
2. **The 0 to 10 question** at first flag and at each check in, in our own words.
3. **The parent facing "how far you have come" view**, reading from the event log.
   Earns its keep as retention on the day it ships, before any external claim.
4. **The retrospective pre-test question** at the point of resolution.
5. **Aggregate reporting**, for schools and for us, once there is enough history to
   be worth reading. Not before.

Steps 1 and 2 are the ones that matter. Everything after is reading what they
record.

## Sources

- Goal Based Outcomes, CORC directory of outcome measures:
  https://www.corc.uk.net/outcome-measures-guidance/directory-of-outcome-measures/goal-based-outcomes-gbo/
- Law, D. & Jacob, J., Goals and Goal Based Outcomes, third edition:
  https://www.corc.uk.net/media/1219/goalsandgbos-thirdedition.pdf
- Duncan et al. (2022), test retest stability, convergent validity and sensitivity
  to change for the GBO:
  https://eprints.whiterose.ac.uk/id/eprint/190251/
- Youthinmind copyright terms for the SDQ: https://youthinmind.com/copyright/
- WEMWBS licences and pricing, Warwick Innovations:
  https://warwick.ac.uk/services/innovations/wemwbs/licenses/
- EIF evidence standards: http://guidebook.eif.org.uk/eif-evidence-standards
- Cochrane handbook, chapter 25, assessing risk of bias in non randomised studies:
  https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-25
