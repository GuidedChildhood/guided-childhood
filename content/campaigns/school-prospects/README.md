# School prospects, built weekly

Justin, 23 November 2026: grow the schools list every week, without LinkedIn
scraping. Every Monday a scheduled session adds up to 30 new schools to
Mailchimp, tagged `Schools Invite v2 batch` and `Schools Prospect <date>`, and
schedules two emails for that week's tag: the invitation on Tuesday at 09:30,
and one reminder two Tuesdays later to anyone not tagged `School pilot` or
`Schools In Conversation`. Then nothing more. (No Mailchimp flow is needed: the
API cannot build flows, so each week's emails are replicated regular campaigns,
copied from c8b7570191 and c090097802.)

The first batch (Schools Prospect B04, 34 schools): invitation scheduled
Tuesday 24 November 09:30, reminder Tuesday 8 December 09:30.

The rules the weekly run follows:
- Source: the government school register (GIAS open data CSV) for the school,
  phase, town and website, plus the office or enquiries address published on
  the school's own website. Never LinkedIn, never a personal address guessed
  from a pattern, never a bought list.
- Order: nearest to Winscombe first, widening outwards; trusts' central teams
  are welcome. Skip special schools unless the phase is clear.
- Skip any address already in the Mailchimp audience, whatever its status
  (subscribed, unsubscribed, cleaned), and any URN already in `log.csv`.
- At most 30 a week, to keep the sender reputation healthy.
- Every row goes into `log.csv` (domain only, never the full address), and the
  run opens a pull request so the week's list is visible.
- Schools are organisations, so this is business to business email under
  PECR; every email carries the unsubscribe link.
