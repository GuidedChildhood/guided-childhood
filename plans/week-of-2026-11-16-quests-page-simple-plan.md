# Quests page, made simple (week of 16 November 2026)

Justin, 15 November, with a screenshot of the parent Quests page: "seems way
too much, needs to look tidy, easy to use, industry leading ... it's linked to
the child's app so all wiring needs to work."

## What was measured

The page as it stands, at 390 by 844 with a two child family (10 jobs and 1):

- 17.2 phone screens tall, 124 tappable things.
- `/api/quests` fetched by three components on one page.
- The daily part (what needs me, how are the children doing) is the first
  screen and a half. Everything after it is setup: the whole QuestManager
  (child picker, star summary, balance, hand over, four tabs, pings, do this
  first, job list, routines, idea lists, done this week).
- `/dashboard/quests/manage` already does add, agree and send on its own page,
  so most of the manager is a second copy of something that has a home.

## References (Mobbin, pulled 15 November)

- Greenlight Chores tab: child picker, one state line ("No chores due today"),
  one button. Allowance below as a single card.
- GoHenry child earning: one headline number, a segmented bar, the list, one
  primary button pinned at the bottom.
- Earlier pull in `design-refs/quests-mobbin-notes.md` still stands.

## The change

A page does one job (THE-STORY section 11). Quests is: is anything waiting on
me, how is each child doing today, and one way to add a job.

1. What needs you (the status board and the silent when empty queues). Unchanged.
2. Each child today (the Family Quests card). Unchanged wiring.
3. Two actions: Add a job (primary), Screen timer.
4. Give a star.
5. More: one quiet list of the other places, badges kept. Lessons leaves the
   list, it has a bottom tab.
6. The balance read and homework notes, folded.
7. QuestManager moves, whole and untouched, to `/dashboard/quests/setup`.
   Old links (`?tab=`, `?routine=`, `?child=`, `#quest-manager`) are sent on.

No migration. No API change. The child app is not touched; every call the
parent page makes to it is the same call from the same component.

## Checks

- Fixture page `app/dev/quests-page`, phone and desktop, quiet and busy days.
- Tap approve, remind, give a star, and each link; confirm the same API calls.
- `npm run ai-tells`, lint, typecheck, review.md.
