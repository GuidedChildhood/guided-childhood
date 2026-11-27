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
  in the admin schools page (`school_links.licensed_until`, migration 408).
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

## Not in this change

- No copy on the marketing site or the schools pricing page yet; that waits
  for the first paying school.
- The upgrade page does not yet name the pass.
