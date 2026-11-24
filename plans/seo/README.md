# The weekly search plan

Justin, 23 November 2026: build a plan each week so the search agent keeps
improving, not just one fix at a time.

Every Monday the search session (scheduled task "Weekly SEO fix (Monday)",
08:47 London) writes `plans/seo/<monday>-plan.md` before it builds anything, in
this shape, under a page:

1. **Last week, checked.** Each fix planned last week: merged or not, and the
   number it was meant to move, before and after (Search Console impressions or
   position for that page, PostHog visits, the Ahrefs count). "Too soon to
   tell" is a fine answer; a guess is not.
2. **Where search stands.** The eight parts from
   `.claude/agents/review-search.md`, one line each with a score and the reason.
3. **This week's three fixes, ranked.** Each with the page or file, the proof
   path in the product, the number it should move and how we will read it next
   Monday. The first is built this session; the second too if it is small.
4. **Needs Justin.** At most two things, plainly, with how long each takes.

The three fixes also go on the phone dashboard's setup table, so Justin sees
the plan without opening GitHub. A fix that did not move its number after four
weeks is dropped from the list with the reason, so the plan learns.
