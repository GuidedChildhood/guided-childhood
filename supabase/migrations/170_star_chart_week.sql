-- Guided Childhood — Migration 170
--
-- A printed star chart now knows which week it was for.
--
-- Justin: "can we add print my weekly star chart, customise it as a Sunday one,
-- the five jobs rotation every Sunday ready for the week."
--
-- The chart was already customised: it reads the family's real active jobs off
-- the quests board. What it had no idea about was TIME. star_chart_prints
-- recorded that a chart had been printed, once, ever, and the Quests tile used
-- that one fact to drop its "To print" badge and stay quiet forever after.
--
-- So there was nothing a weekly rhythm could be built on. "Has this family
-- ever printed a chart" cannot answer "is there one on the fridge for the week
-- that starts on Monday", and those are the two different questions the tile
-- was being asked to answer with one column.
--
-- The star week already runs Monday to Monday in London (lib/quests/star-week.ts),
-- because that is when the app resets a child's earned minutes. The paper chart
-- now names the same week, so the sheet on the fridge and the numbers in the
-- app stop and start on the same morning.
--
-- Null for every row printed before today. Deliberately not backfilled to a
-- guess: we know those charts were printed, we do not know which week they were
-- for, and inventing one would make the first weekend after this ships either
-- nag a family who printed on Sunday or stay silent for one who did not. Null
-- reads as "printed, week unknown", which keeps the existing badge honest and
-- simply means the weekly offer starts from the next print.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

alter table public.star_chart_prints
  add column if not exists week_start date;

comment on column public.star_chart_prints.week_start is
  'The Monday of the star week this chart was printed for, Europe/London. Null for rows printed before migration 170, which means printed but week unknown.';

-- The question the Quests tile asks every weekend: is there a print for this
-- family for the week starting on this Monday. Leads on the user, carries the
-- week.
create index if not exists idx_star_chart_prints_week
  on public.star_chart_prints (user_id, week_start);

-- CHECK:
--   select week_start, count(*) from public.star_chart_prints group by 1 order by 1;
-- Expect every existing row on null, then real Mondays appearing as charts are
-- printed from the builder.
