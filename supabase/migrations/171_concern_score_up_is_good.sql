-- 171: the concern scale now climbs as things get better.
--
-- The check in number flips. It was severity, 0 fine to 10 the worst it
-- gets, which meant a family's chart FELL as their weeks improved. Justin,
-- 8 August: the range should run 1 to 10 with 1 not good and 10 best, so
-- improvement over time reads as a rising line on every surface that will
-- ever show it, from the parent's own progress page to the evidence the
-- service stands on.
--
-- So the columns are renamed to say what they now mean: score, 1 really
-- tough to 10 going great. Existing rows are inverted rather than thrown
-- away: an old 0 (fine) becomes 10, an old 10 (worst) becomes 1, which is
-- the new floor since the scale starts at 1. The 0 to 10 check constraints
-- from 164 still hold 1 to 10 values, so they stay as they are.
--
-- Supabase editor rules: idempotent, flat statements.

alter table public.concern_events rename column severity to score;
alter table public.concern_events rename column severity_at_start to score_at_start;

update public.concern_events set score = greatest(1, 10 - score) where score is not null;
update public.concern_events set score_at_start = greatest(1, 10 - score_at_start) where score_at_start is not null;

comment on column public.concern_events.score is 'The parent''s own read, 1 really tough to 10 going great. Up means better. Null whenever we did not ask or they did not answer.';
comment on column public.concern_events.score_at_start is 'Asked once at resolution, looking back: where was it when this started, same 1 to 10 scale.';
