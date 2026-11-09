# The usual rows: thirty everyday flashpoints, pre empted

Justin, 9 November 2026: the Monday morning row over an 11 year old's room,
with a parent who is already stressed straight after waking. "We need to
research how we deal with this, a way of helping parents manage, and find 29
other common issues just like this to help advise both parents and child. Some
way of letting parents know these things happen and we are here to pre empt
and assist."

## What exists (so nothing is rebuilt)

- `lib/content/device-issues.ts`: the bank of top DEVICE problems by age, read
  by DiGi (`device-issues-match.ts`), Home (issue of the week) and the
  recommender. Everyday rows that are not about screens have no bank.
- 44 everyday routine scripts already in the table, including The Messy
  Bedroom, The nagging about jobs, After you lost your temper, Getting out of
  the house. These are the proof paths.
- The morning, after school and evening pushes in `app/api/push/cron`, one
  window per family, rotating (`lib/home/school-window.ts`).
- Concerns (`lib/concerns/raise.ts`) and the five face check in that tracks
  them.

## What gets built

1. **The bank**, `lib/content/family-flashpoints.ts`: thirty rows, the messy
   bedroom first. Each: the parent's words, when it happens (day and window),
   what is going on, the parent's first line (steady yourself first), the
   plan, the child's side, what a stage earlier prevents, the source, the
   real scripts, the concern slug, keywords, and the heads up push copy.
2. **The page**, `/dashboard/flashpoints`: "These happen in every house."
   The thirty by age, each opening to the plan. One tap, "This happens in our
   house", raises it as a concern (so the check in tracks it), and turns on its
   heads up. "Share with the other parent" sends the plan by the phone's own
   share sheet, because there is no second parent account.
3. **The heads up**: in the existing window pass, a family who has said a
   flashpoint is theirs gets its heads up instead of the rotation line, on the
   day and window it happens (the room row: Monday morning, before the parent
   opens the door). No new push slot, no extra push, at most two days a week
   per flashpoint, one push per window as now.
4. **DiGi**: when no device issue matches, the message is matched against the
   flashpoints by keyword and the route prints the pathway with its real
   scripts, the same shape as the device issue block. Nothing else in the DiGi
   path changes (not DIGI_MODEL, the knowledge bank, the refresh cron or
   digi-context).
5. **The guard**, `scripts/check-family-flashpoints.mjs`: thirty rows, unique
   keys, every script exists in the seeds, sources have URLs, no dashes, push
   bodies fit, heads up at most two days, the matcher lands every row, the
   cron and DiGi read the bank. In the checkin-guard chain.

Research: two agents (the room and the morning temper in depth; the 29 others
ranked by how often UK parents raise them), then the citation check on the
sources the rows lean on. Figures stay out of copy unless the paper was opened.

No migration. Not touched: DIGI_MODEL, the knowledge bank, the refresh cron,
lib/learning/digi-context.ts.
