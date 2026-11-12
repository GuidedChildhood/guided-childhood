# Building the nine amendments (11 November 2026)

Justin, 11 November 2026, on `plans/2026-11-11-progression-and-assessment-review.md`:
"go ahead with all but dont change price."

So: amendments 1 to 8 are built. Amendment 9 is the French author's to write and nothing
is written in her name. No price changes anywhere: no pricing page, and the "from £495"
line in THE-STORY.md stays as it is.

One branch, one increment at a time, each pushed when it passes its checks.

## The order

| # | Increment | Amendment | Touches | Migration |
|---|---|---|---|---|
| A | The record is easy to find and says what good looks like | 2 (display), 5 | Hub lead card, `RecordLesson` descriptors, all classes view, year picker, CSV, the board's finish leads to Record, one set of names | none |
| B | The lesson musts and the three descriptors | 1, 2 (content) | `content/modules/*.json`, `content/standalone/*.json`, one guarded migration | 392 |
| C | A suggested year for each lesson and the progression map | 3 | `shared/schools-curriculum.ts`, a new Hub page | none |
| D | Before and after, from the quizzes the lesson already has | 4 | record gains two counts per lesson, progress page | 393 |
| E | The leader's page: the record against the statutory content | 6 | reads the existing RSHE and computing maps and the record | none |
| F | The termly look back quiz | 7 | built from each lesson's own exit questions | none |
| G | French, ours | 8 | plan only labels, what can be judged today, sound hint and song beside the lesson, class tracker sheet, class summary, consistency report at sync | none |

## Rules that hold for every increment

- **Lesson edits are the musts only**, plus the three descriptors. The shoulds stay in the
  review file for a later term (the once a term rule).
- Every lesson edit is made twice and guarded: in the content file, and in the migration
  with the old value checked first, so a row that has moved raises instead of being
  overwritten. File and row stay equal.
- Descriptors are written only from the lesson's own misconceptions, check questions and
  exit answers. No new fact. One vocabulary everywhere: secure, developing, needs
  revisiting, the three the record already stores.
- A class count, never a pupil. Before and after is "how many hands", typed as two numbers.
- Never "Ofsted ready", never "a legal requirement", never "expected level" as if national.
  The leader's page is a working document for the subject lead.
- KS3 opening on ks3-27 and KS4 on ks4-29 is not changed. It is a question for Justin.
- Year placements are suggestions a school can ignore, and say so on the page.

## What increment A decides

- The three descriptor lines live in the lesson row at `assessment.teacher_judgement`,
  as `{ scale: ["secure","developing","revisit"], descriptors: { secure, developing, revisit } }`.
  The four older shapes are replaced by this one in migration 392. Until 392 lands the
  buttons show with no descriptor, exactly as today.
- "The record" means the school's record of lessons delivered, at `/hub/progress`. The
  tracker stays what it is, this laptop's own ticks, and is named that way.
- The CSV is the school's own data, one row per delivery: date, class, lesson, judgement,
  note. No pupil. Served only to the school the signed cookie names.

## Checks, every increment

Typecheck, the guard list, `npm run ai-tells`, Playwright at 390 and 1440 with made up
codes against the local stand in, and `npm run context-guard` before the push.
