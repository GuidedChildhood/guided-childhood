# The daily loop, changes one to three

Justin, 5 September 2026, after the loop review: "Let's build 1 to 3, and
roughly ten minutes for both children, or do you suggest a change that
additional children maybe a little longer?"

Answer given: keep ten minutes a day as the family promise. With change three
the only per child steps are the check in and approving jobs, about a minute
each, so a second child adds two minutes, not ten. No copy change.

## One: the Tonight rung (migration 255)

On connect days, right after the check in, a rung that names the live
mechanism for the child's top worry, built from what the family already has:
bedtime screens becomes "Phones to bed" with the bedtime window; will not put
it down becomes "The timer" with ask first; mood after screens becomes
"Tonight's words"; morning TV becomes "Tomorrow morning"; controller fights
becomes "The end of the game". One tap on /dashboard/tonight says it is on,
stored in tonight_confirmations (one row per child per day). No live worry,
no rung. lib/pathway/tonight.ts holds the pure mapping.

## Two: last night's words

The check in opens with "Last night's words: {title}. Did you use them?" when
a script was opened in the last day and a half for this child with no rating
yet. Yes, sort of, not yet, one tap, written to script_completions.worked
through /api/completions, the row the scripts already keep. No new table.

## Three: household ticks

The moment and the script tick for every child once one child has done them,
and the road says who under the label ("with Jonny") so a green tick is never
a mystery. The check in and the jobs stay per child. The rows stay keyed per
child (migration 219) so the passport keeps knowing whose conversation it was.

## Checks

tsc, wiring, checkin-guard, dash grep; the road fixture at 390 with a Tonight
node and a noted script node; the check in fixture with the words question.
Migration 255 goes to production on Justin's word.
