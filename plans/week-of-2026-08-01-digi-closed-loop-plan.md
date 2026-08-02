# DiGi's closed loop: from "gives advice" to "knows what works"

Written 1 August 2026, from Justin's six part ask after a real conversation
about Teo going straight to the TV in the morning and not eating breakfast.

> "if we get asked similar thing by several users is DiGi able to store and
> remember this... when we offer advice we gather and catch up in a few days to
> see if our solution worked, and if yes we weight it for future solutions, and
> if no we offer the next best alternative and again catch up and learn from
> feedback until DiGi is super intelligent in his field."

---

## The honest state, checked against the code, not remembered

| # | The ask | Today |
| --- | --- | --- |
| 1 | Check up in a few days | **Built.** `schedule_followup` writes `digi_followups`, the 07:15 cron turns it into a `follow_up` prompt card. |
| 2 | Conversation summary in the weekly catch up | **Partly.** `buildWeeklyReview` weaves in the parent's written reflections from `digi_feedback`. It does not summarise the conversations. |
| 3 | Common issues on insights, with add as moment or script | **Partly.** The daily insight agent themes what parents ask and ranks what to build. There is no button that turns a theme into either. |
| 4 | Learn combinations, "early morning, age 8, will not come off the TV" | **No.** Themes are labels. Nothing records time of day, trigger and age band as one shape. |
| 5 | Recognise a known combination and answer fast | **No.** Every question is a fresh model call. |
| 6 | Did it work, weight it, offer the next best, learn | **No, and this is the hole.** |

### Why 6 is the hole, precisely

DiGi already asks "how did that go?" The card is delivered by
`app/api/cron/followups/route.ts`, it is labelled "Checking back, as promised",
and it lands on the dashboard.

**And then the parent can only dismiss it.** There is no answer field, no
verdict, nothing written back. The promise is kept and the answer is dropped on
the floor.

So `digi_wisdom`, the thing that is supposed to hold what works, is built from
proxies instead: concerns that changed status, scripts a parent ticked as
worked, reflections. And its `evidence_count`, which `getProvenSolutions`
weights on, is **the model's own estimate parsed out of its JSON**, not a
counted fact. That is already recorded as a known soft spot in
`digi/00-how-digi-works.md`. Building more on top of an estimate makes the
estimate louder, not truer.

Nothing anywhere links **a specific thing DiGi suggested** to **whether it
worked for that family**. Until that exists, every other item on this list is
decoration: there is no signal to weight, no alternative to rank second, and no
combination worth caching.

---

## The spine: one row per suggestion, one verdict per row

`digi_outcomes`. Written when DiGi schedules a follow up, completed when the
parent answers the card.

- **The situation**, as a shape rather than a sentence: age band, topic slug,
  time of day band, and the trigger in a few words ("goes straight to the TV").
  This is what makes "early morning, age 8, will not come off the TV" a thing
  that can be counted across families.
- **The suggestion**, in DiGi's own words at the time.
- **The verdict**: worked, partly, not really, or still open.
- **What the parent said**, when they say anything.

Everything else in the list reads from this table.

### What that unlocks, in order

1. **Weighting that is counted, not guessed.** `getProvenSolutions` ranks on
   real verdicts. `evidence_count` stops being load bearing.
2. **The next best alternative.** "Not really" is the one answer that should
   open DiGi rather than close a card, carrying what was already tried so the
   second suggestion is not the first one again.
3. **Combinations.** Group outcomes by (age band, time band, topic) and a
   pattern with enough verdicts behind it becomes a known situation.
4. **Speed.** A recognised situation with a well rated answer can be offered
   immediately while the full reply is still being written. Not a cached reply
   sent as if it were fresh thinking, an opener that is honest about being one.
5. **The founder board.** Common situations ranked by how often they come up and
   how well our best answer scores, with the two buttons Justin asked for: make
   this a moment, make this a script.

---

## Rails that do not move

- **Nothing here writes across families without de-identification.** Same rule
  as `rebuildWisdom`: counts and labels we chose, never a family's raw words.
- **A verdict is evidence, never an instruction.** Same rail as every tool.
- **Nothing auto publishes.** A combination becoming a moment or a script is a
  founder tapping a button, exactly as the research bank works today.
- **A parent is never chased.** An unanswered follow up stays unanswered. Three
  pending per family, already enforced.

---

## Order of work

**This pass (the spine).** Migration 147: `digi_outcomes`, plus `suggestion` and
`situation` on `digi_followups` so the follow up carries what it is following
up on. The follow up card gets a verdict, the answer writes an outcome, and "not
really" opens DiGi with the thread. `getProvenSolutions` reads real verdicts.

**Next.** Combination clustering, the founder board surface with the two
buttons, the fast opener, and conversation summaries in the weekly catch up.

Nothing in the second half is worth building before there are verdicts in the
table, because all of it is ranking, and there is currently nothing to rank.

---

## Separately: DiGi felt slow

Justin, same message: "DiGi took a little bit long to load answer." Worth
measuring rather than guessing at. The first message of a thread pays for lane
classification, two parallel gather rounds, and a tool round trip that is a
whole extra model turn whenever `search_knowledge` fires. Any of those could be
the cost. Measure before touching it.
