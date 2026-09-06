-- DiGi's word: the proactive insight, twice a week.
--
-- Justin, 6 September 2026: "a little alert button that says DiGi wants to
-- tell you something, and DiGi gives them an insight that really hooks and
-- tells them what to do next for the child at that particular age."
--
-- The insight is one more kind of digi_prompts row, so it rides the same
-- table, status and ownership the tips and follow ups already use. Four
-- columns join it: the named source the insight leans on, the words on its
-- button, the parent's reaction (helped or not, which the wisdom rebuild
-- reads), and when it was first opened.

alter table public.digi_prompts drop constraint if exists digi_prompts_kind_check;
alter table public.digi_prompts add constraint digi_prompts_kind_check
  check (kind in ('watch_for','tip','parent_care','new_research','celebration','school','follow_up','stage_arrival','insight'));

alter table public.digi_prompts add column if not exists source text;
alter table public.digi_prompts add column if not exists cta text;
alter table public.digi_prompts add column if not exists reaction text
  check (reaction is null or reaction in ('helped','not'));
alter table public.digi_prompts add column if not exists seen_at timestamptz;

create index if not exists digi_prompts_user_kind_status_idx
  on public.digi_prompts (user_id, kind, status);
