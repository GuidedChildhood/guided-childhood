# Cosmo at sixth form: the spec, waiting on the first school

**Status: not started, on purpose. Two things need Justin before anyone opens
an editor. Zero credits. Migration 302 is free.**

Justin, 14 September 2026, on the merged voice work: "happy with your
recommendations but do remind me once live schools you re do cosmo."

So this file is the work, written while the detail was fresh, waiting for its
trigger. The trigger is the first school going live. The reminder that fires
is in three places: the note the cron emails Justin the moment a pilot row
lands (`app/api/cron/invoice-requests/route.ts`), one line in THE-STORY.md
section 12, and one clause in review.md section 7.

## What is true today

Migration 301 (applied to production, 14 September) put both sixth form title
slides on DiGi with a line that is not a second hello, because Cosmo was
appearing on the title with a generic default line and never speaking again.
That fixed the double hello. It also left Cosmo fronting **nothing**: after
the manifest was corrected the same morning, Cosmo is the only friend in the
cast with zero modules. The schools home page now filters him out on its own
rather than selling a friend who teaches nothing, and he returns there
automatically the day the manifest gives him these two lessons.

- The two modules: `ks5-20-ai-mastery-data-rights` (30 slides) and
  `ks5-21-digital-identity-future-work` (29 slides).
- Their cast lines both read "DiGi with motion graphics".
- `plans/schools-lesson-build-spec.md` (lines 266, 268, 403) casts KS5 as
  "Cosmo plus DiGi plus motion graphics", **both of them**. So putting Cosmo
  on the title is restoring the original design, not reversing this morning.
- **`ks5-21` is in no pilot set.** `PILOT_SET.post16` is `ks4-19` and
  `ks5-20` only. A sixth form pilot school sees `ks5-20` and nothing else of
  KS5, so `ks5-20` is the urgent half and `ks5-21` is licence only.
- Cosmo's canon (`digi-squad/README.md` line 23): stage 5, 16 plus, orange,
  verb **Lead**, "Confident, independent, ready to lead."

## Zero credits

Everything needed already exists. Checked, not assumed:

- The intro clip: `hf_20260830_005603_76794415-8bc1-45e5-ba88-dd47b7d49c14.mp4`
  in `shared/intro-characters.ts`, approved 30 August 2026.
- The cutouts and the three expression stills in `CHARACTERS.cosmo` in
  `shared/schools-curriculum.ts`, including
  `hf_20260913_081941_f602f40f-76e7-4554-bcbd-e363c9c33981.png`.

No Higgsfield job is needed to do this work. That matters, because the
balance was 57 credits after the expression stills.

## Justin decides, one: the title slides

Migration 301 wrote two title lines this morning and they are good:

- ks5-20: "You already use the tools. This hour is about running them."
- ks5-21: "Two questions today, and both decide the next ten years."

**Recommendation: change the `character` key on both title slides to Cosmo
and leave both lines exactly as they are.** One field per row, no copy risk,
no undoing of approved work. The alternative is rewriting the lines, and a
rewrite was drafted and judged weaker than what it replaces.

## Justin decides, two: the nine year callback

The obvious creative idea is Cosmo as the last friend, calling back to Pebble
in Reception. **It is false for every student who will hear it for about a
decade.** The scheme shipped in 2026; nobody in Year 13 came up through it,
and a sixth form pilot school never sees a Pebble lesson at all.

**Recommendation: do not put it on the wall.** Keep it as an optional line in
the teacher script for the year it becomes true, with a dated note. Cosmo
introduces himself on his own terms instead, forward facing, because his verb
is Lead and not farewell.

## Settled, no decision needed

Whoever builds this must not walk into these. All verified against the live
rows.

1. **Cosmo must not repeat DiGi.** On ks5-20 the mission beat (ord 29) and
   DiGi's sign off (ord 30) already say the same triad one slide apart. Give
   the triad to one of them. On ks5-21 nothing Cosmo says may claim finality:
   DiGi speaks after him at ord 29 and ends the scheme.
2. **Keep "the same AI" in Cosmo's mouth.** The starter quiz, the endurance
   test and the parent note all hang on that phrase.
3. **"Say it like Cosmo" is wrong on ks5-21.** Its quote is written in the
   student's own first person ("my judgement, my taste, my name"). Leave that
   label neutral; the booklet only falls back to the friend's name when no
   label is set.
4. **The register is Still, the oldest on the ladder.** Level, adult, no
   exclamation marks, no cheerleading. Compare Orbit and Nova's arrivals,
   which open on a question rather than a greeting.
5. **The cast lines change with the key**, or `scripts/check-character-voices.mjs`
   rule 1 fails: the friend key must match the first friend the cast line
   names. Suggested: "Cosmo opens, DiGi closes".
6. **The printed sheets change colour.** `friendFor` takes the first friend
   named in the cast line, so six print routes per module flip from the gold
   star to Cosmo in orange. If a school is mid pilot on KS5, tell them.
7. **Give the two lessons different pause lines.** They share one word for
   word today, which is a missed beat on the two lessons that close the whole
   scheme.

## Also found, not part of this job

- `ks5-20` ord 30 line 1 reads "Twenty modules, and here is where they were
  all heading." There are 25. Either it means the twenty that precede this
  one, in which case write that down, or it is a stale number on a sixth form
  wall. **Justin's call**, and it is one line in the same migration.
- Nobody has written down what Cosmo *is*. DiGi can say "I am a machine" and
  a room of seventeen year olds accepts it because the lesson is about
  machines. Cosmo is an orange rocket who leads, and that is all the repo
  says. Worth a sentence in `digi-squad/README.md` before he speaks.

## When this ships, take the reminder down

Three surfaces carry it and all three come out in the same pull request: the
sixth form paragraph in THE-STORY.md section 12, the Cosmo clause in review.md
section 7, and the second paragraph of the pilot note in
`app/api/cron/invoice-requests/route.ts`. A reminder that outlives its job is
the next thing nobody trusts.

## Size

One migration (302 is free), two manifest lines, two cast lines, the home page
returns Cosmo on its own. Half a day with the decisions made. Zero credits.
