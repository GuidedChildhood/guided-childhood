# Week of 5 August 2026, closing the passport gaps

Follow on from `plans/passport-readiness-review.md`, which audited the five
stage passport against the six things named as the test for full access at 16
and found three of the six holding, one broken in production, and two barely
existing.

This plan takes items 1, 2 and 3 off that document's "what would close it"
list. Items 4, 5 and 6 are content and volume work, left for a later lane.

## Claimed in this lane

- Migration **163**. Checked against origin/main and every open pull request
  on 5 August 2026, highest was 162.
- The child to parent half of the scripts library.
- The child app telling page and its entry tile.

## Item 1, apply the missing migrations

The review found `/dashboard/social-settings` reading from a table that did
not exist in the live database, so it rendered empty for every family.

Diffing the repo's `create table` statements against the live schema turned up
four missing tables rather than one, plus one missing column. Three migration
files had never been applied:

| Migration | What was missing |
|---|---|
| 093 | `social_platform_guides`, the eight platform guides |
| 094 | `phone_setup_guides` and `learning_apps` |
| 135 | `school_alert_sent`, the hour before alert guard |
| 059 | `children.use_mode` |

All four are additive and idempotent, `if not exists` on the tables and
columns, `where not exists` on every seeded row, policies guarded against
`pg_policies`. Applied to the live database in that order. No repo change,
the files were always correct, they had just never been run.

## Item 2, the child to parent scripts

Every one of the 296 scripts runs parent to child. The child who needs to
raise something has nothing to pick up.

A new table rather than a `direction` column on `scripts`. Two reasons. The
shape genuinely differs: a parent script carries `not_this`, `why_it_works`
and `tonight`, none of which mean anything when a child is the one speaking,
and a child needs `if_it_goes_wrong` and `who_else`, which a parent script has
no use for. And there are roughly twenty call sites reading `scripts` today,
none of which filter on direction, so adding a column would have quietly
leaked child rows into every parent list and the recommender.

Five per stage, twenty five in total, covering the asks that actually go
unsaid: something frightened me, someone was unkind, I broke a rule, I want
more, and I am worried about someone else.

## Item 3, the what to tell a parent card

One card per stage, and it has two halves. The first is what to tell, which
mostly exists scattered across lessons already. The second is what happens
when you do, which is nowhere, and it is the half that earns the telling.

A child weighs telling against losing the device. If the card cannot say what
happens next, the honest answer a child assumes is confiscation, so they say
nothing. So every card carries a promise, a what happens next, and an explicit
never, and the parent side shows the parent the promise their child has been
shown.

## Surfaces

- `/k/[token]/tell`, the child's page, their stage's card and their five
  scripts.
- A tile on the child home screen, because a page a child cannot find is the
  same as no page.
- `/dashboard/tell-a-parent`, the parent's view of the same card, so the
  promise is one both sides have read.

## Checks before done

- Mobile and desktop in Chrome DevTools.
- No dashes in any copy.
- Child pages stay on the link token trust model, no account, no login.
