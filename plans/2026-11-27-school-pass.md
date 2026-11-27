# The school pass

Justin, 27 November 2026, after the Hive meeting
(plans/2026-11-27-liz-hive-meeting-weighed.md), chose both recommended options:

1. Families who come in through a school that holds a licence get lessons, the
   homework helper, the star chart and the school calendar free, for as long as
   the licence runs. DiGi and scripts stay paid after a free taste.
2. The taste is ten scripts and ten DiGi messages in total, for those school
   families only. Everyone else keeps today's four day trial.

## How it works

- A school's newsletter link (migration 353) is still attribution only. When a
  school's invoice is paid, Justin puts the last day of its licence on the link
  in the admin schools page (`school_links.licensed_until`, migration 409).
- A family whose `profiles.school_link` points at a link with a live date holds
  the pass. `school_pass_until()` answers that for the parent's own session or
  the service role.
- The dashboard gate (middleware.ts) lets a pass family into Home, lessons,
  learning, homework, quests, the school calendar, printables, scripts, DiGi
  and setup (`lib/school-pass.ts`, tested). Every other page meets the upgrade
  page as before.
- Scripts: the page only asks; the browser's real open (`/api/completions`)
  spends one of the ten, so a prefetch never uses the taste. A script already
  opened stays open. The slide deck claims on open.
- DiGi: each message past the free days claims one of ten in `/api/digi`
  before anything streams. A lapsed account with no pass now gets a 402 there
  too: the route sat outside the dashboard gate, so DiGi was reachable by a
  direct call after the trial.
- The child's link (`/k/[token]`): lessons and printables open with the pass.

## Only school families (Justin, 27 November 2026)

"This change is only for families that sign up via school ... must not affect
normal families signing up without code."

- A family is a school family only when its account carries the school's link,
  and the pass only switches on when that school also has a licence date. A
  family with neither sees exactly what they saw before. The sign up form is
  unchanged: no school question for anyone.
- Two ways in for school families. The school's link (/s/<code>) records the
  school at sign up, as it has since migration 353. Or the family code from the
  school's letter, typed on Settings or on the upgrade page (the box renders
  nothing until it knows the family's school). The admin schools page shows
  each school's family code for the letter.
- The school is written once and never replaced, the same rule as the link.
- The one change that touches every family: /api/digi now refuses a lapsed
  account called directly. A lapsed family could not reach the DiGi page
  anyway, so nothing they can see changes.

## Not in this change

- No copy on the marketing site or the schools pricing page yet; that waits
  for the first paying school.
- The upgrade page does not yet name the pass.
