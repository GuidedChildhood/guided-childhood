# 8 October 2026: the Lessons hub, child first, one number everywhere

Justin, looking at Lessons for Teo on his phone: "these are really for the
child to do ... it looks like we are asking the parent to take the lesson.
Come up with the best way to run this so it is coherent, flows and loops, so
the parent can be confident the child learns, the lesson is for the child,
giving the parent options, knowing it is not a lesson for them. What we come
up with must encourage ticking off on the system (lesson done, passport) and
the child's app wiring works."

## What is true today (read from the code, 8 October)

The model was decided on 29 September (`plans/2026-09-29-lessons-plan.md`,
PR 1177): the child learns it, the parent closes it. The child's lessons are
the school modules for their stage, played in the child's own app
(`/k/[token]/lessons`, each opening on the star lesson player); a 70 percent
pass writes a `school_lesson` completion against the child, ticks the five a
day, ticks the passport (`lib/pathway/progress.ts`), and pushes the parent one
question to ask at tea. The passport's Lessons and tests row opens
`/dashboard/lessons/path`, which shows the same list, the same n of N, the
tea question under each pass, and Do it together for under 7s. All of that
works.

What the Lessons hub (`/dashboard/lessons`) says is from before that
decision, and it is the page Justin opened:

1. The Lessons tab is the parent library (26 lessons written for adults), and
   the banner over it says "These move Teo's progress · Stage 3 lessons, 0 of
   18 passed". Since 29 September they do not. The passport counts Teo's ten
   KS3 school modules. Two surfaces, two numbers.
2. The subtitle reads "Films to watch with Teo, and lessons you lead". So the
   library reads as the parent's homework.
3. Teo's actual lessons, the ones that move the passport, are not on the hub
   at all. The only way in is the passport row.
4. Home still counts the parent library: `lib/pathway/journey.ts` reads
   `lesson:` and `ai_lesson:` completions for the stage, and the alerts row
   "Do a lesson with Teo · Next up: <parent library title>" points there.
5. There is no send for a school lesson from the parent side. The missions
   machinery exists (`kid_lesson_missions`, `/api/quests/lessons` POST pings
   the child with stars attached) and nothing in the app calls it any more.
   The child's list shows the stage's modules anyway, and the five a day pulls
   the next one, so the child side works; the parent has no "send this one".
6. The parent closes it only by push. The tea question lives on the push and
   on `/path`; there is nothing on Home to tick and the weekly email cannot
   name a school lesson pass (`gatherWeek` looks titles up in the parent
   `lessons` table only, so a child's pass is dropped from the Sunday email).

## The model, said once

The child does the lesson in their app. The parent has two options for every
lesson, send it to the child's phone or do it together now, and one job after
a pass: ask the tea question. Every number about lessons comes from
`progress.ts`. The parent library is for the parent and never claims to move
the child.

## Build (medium, one PR, no migration)

1. **The hub opens on Teo's lessons.** `/dashboard/lessons` gets three tabs:
   `Teo's lessons` (first, the school modules for Teo's stage from
   `schoolModulesForStage`, status per module from the same completion rows the
   passport reads: Passed with score, Next, Ahead, Locked), `Watch together`
   (the films, as now, for ages 4 to 10), and `For you` (the parent library,
   renamed). The banner "These move Teo's progress" moves onto the first tab
   and reads "Teo's lessons, 2 of 10 passed. Teo does these in their app;
   passing the check ticks the passport." computed by `progress.ts`, so it is
   the passport's own number. `/dashboard/lessons/path` becomes a redirect to
   the first tab with the same query, so the passport row, DiGi's lesson links
   and old bookmarks land in one place.
2. **Two actions on every one of Teo's lessons.** "Send to Teo's phone" posts
   to `/api/quests/lessons` (a mission with stars, a push naming the lesson,
   the button then reads "On Teo's app, sent Tuesday"), and "Do it together
   now" opens `/k/[token]/school/[id]` on this phone so the pass lands on Teo,
   for every age, not only under 7. Under 7 the send button is hidden and the
   copy says do it together. No child app yet: one line and the set up link,
   as `/path` already does.
3. **The parent closes it, visibly.** On a pass, `lesson-complete` also writes
   a `digi_prompts` row (kind `celebration`, source `lesson:<id>`, once per
   lesson) carrying the tea question with the one button "We talked". Home and
   Notifications already render those rows; the tap dismisses it. The weekly
   email names school lesson passes: `gatherWeek` looks the id up in the star
   lesson catalogue as well as the parent table.
4. **One reader on Home.** `journey.ts` takes its lessons count and next title
   from `progress.ts` (school modules), and the alerts row becomes "Teo's next
   lesson: <module>. Send it to their phone or do it together", linking to the
   hub's first tab. The DiGi lesson nudge stays for the films at Stages 1 and 2.
5. **The library stops claiming.** "For you" carries one line: "Written for
   you, not for Teo. These do not move Teo's passport." The passed count on it
   becomes "3 of 18 read" with no stage framing.
6. **A quiet nudge for a stuck lesson.** The Sunday review prompt is told when
   Teo's next lesson has been sent and unpassed for seven or more days, so the
   suggestion can say so once. No new cron.
7. **Guard** `scripts/check-lessons-model.mjs` in the checkin guard chain: the
   hub's first tab is the school modules; its n of N comes from `progress.ts`;
   `journey.ts` no longer counts `lesson:` for the stage; the library copy
   never says "move <child>'s progress"; the send button posts to the missions
   route; the pass writes the tea question prompt once; the weekly email can
   title a school lesson pass.

## Not building

- A new assignment table or a new player: the missions table, the star lesson
  player and the completion route already do the work.
- Stars for the parent library. It is the parent's reading.
- A daily nudge to the child about the lesson: the five a day already asks
  for the next one every day.

## The loop, end to end

Parent opens Lessons, sees Teo's lessons and 2 of 10, taps Send on the next
one. Teo's phone gets the push with the stars, the five a day shows it, Teo
plays it and passes the check. The pass writes the completion (passport ticks,
five a day ticks), the stars land, the parent's phone gets "Teo passed X. Ask
at tea: …", and Home shows the same with We talked. Sunday's email names the
pass. If Teo does not get to it, the next Sunday says so once. Under 7 the
parent opens the lesson on their own phone and the same pass lands on Teo.
