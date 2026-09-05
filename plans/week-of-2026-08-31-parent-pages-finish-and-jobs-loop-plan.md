# Parent pages in the happy news finish, and the jobs loop that did not update

Justin, 5 September 2026, late, with three screenshots (the Quests tiles, the
home path showing "First job" still current, the Quests top with Todd's code
card): "New look looks great apply to all other pages and check loop as added
job for Jonny and has not updated in jobs for today parents. They need to be
able to add several jobs, guided on kid too many, then ask them to pick
today's tasks."

## What was found

1. The job landed. The database has "Twenty minutes lost in a book", daily,
   after school, for Jonny, written at 23:19. The add is fine.
2. The home path a minute later still said "First job", because every link in
   the mobile tab bar carries `prefetch`, and on a dynamic page that keeps a
   full copy in the router cache for five minutes. Tap Quests, add a job, tap
   Home: Home is the copy fetched before the job existed. The same holds for
   every tab in the bar.
3. Adding several jobs in one go already works on the Add a job page (the
   composer never closes, the schedule and band persist between adds) and the
   composer says a gentle word at five jobs. What is missing is the child's
   side: a child with more jobs than the age guide opens their app to a wall.

## What ships

1. **Loop fix.** The tab bar links stop full prefetching, so a tab always
   renders the page as it is now. Desktop nav checked for the same.
2. **Guided on the kid's side.** The child's jobs list reads the age sweet spot
   from `lib/quests/job-load.ts`. When today's due jobs exceed it, the first N
   sit under Today and the rest fold under "If you fancy more", each with a
   tap to bring it up. No new table, no migration: the fold is presentation,
   the jobs and stars are untouched.
3. **The finish on the other parent pages.** The same ink edge, hard ledge,
   butter for the thing to tap, green for done, story icons: shared tiles
   (`components/ui/SectionTiles.tsx`, used by Quests, Passport and the home
   explore grid), the Quests page and its cards, Add a job, the child code
   card, DiGi, Lessons hub, Passport, Printables header, Settings shells.
   Logic untouched; styling only.

## Checks

tsc root, wiring, checkin-guard, dash grep, Playwright at 390 and 1280 on the
Quests page, Add a job, home path after an add (the loop), the child jobs list
with seven jobs at age 8 to 10, DiGi, Lessons, Passport.
