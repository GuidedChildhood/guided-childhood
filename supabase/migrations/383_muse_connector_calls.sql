-- 383: the Meta Muse connector, counted and capped.
--
-- Justin, 20 October 2026: connect Guided Childhood to Meta's Muse agent.
-- Parents ask Muse, Muse calls /api/muse/ask or /api/muse/scripts, and every
-- answer ends at the stage check (plans/week-of-2026-10-19-muse-connector-plan.md).
--
-- Muse traffic is anonymous and a DiGi answer costs a model call, so the ask
-- route counts its model answers per day against MUSE_DAILY_CAP and answers
-- from the free scripts once the day is spent. This table is that count.
--
-- One row is one call and nothing else: what kind it was and when. No
-- question, no age, no address, nothing about a parent or a child. That is
-- the sentence the privacy policy makes, so it is the shape of the table.
--
-- Additive and idempotent. Supabase editor rules: flat statements, no DO
-- blocks, no semicolons inside string literals.

create table if not exists public.muse_calls (
  id         uuid        primary key default gen_random_uuid(),
  kind       text        not null check (kind in ('ask', 'ask_fallback', 'signpost', 'scripts')),
  created_at timestamptz not null default now()
);

create index if not exists idx_muse_calls_kind_created
  on public.muse_calls (kind, created_at desc);

-- Service role only: the routes write with the admin client and the founder
-- reads through it. No policy, so no parent session can see a row.
alter table public.muse_calls enable row level security;

grant select, insert, delete on public.muse_calls to service_role;

-- The stage check counts ?src=muse against this row (migration 379), so the
-- founder page shows Muse checks per week beside every other channel.
insert into public.video_links (code, title, channel) values
  ('muse', 'Meta Muse connector answers', 'other')
on conflict (code) do nothing;
