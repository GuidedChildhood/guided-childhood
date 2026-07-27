-- Guided Childhood — Migration 082
-- DiGi device check ins. The memory behind DiGi noticing a device pattern
-- and asking about it: one row each time a check in card is shown to the
-- parent for a child, with what they answered. The rows carry the two
-- promises the surface makes:
--   at most one device check in per child per week (latest shown_at gates
--     the next one), and
--   Not really quiets that prompt for three weeks (suppressed_until).
-- Signals themselves are computed live from device_sessions, nothing about
-- the child's usage is copied here.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons
-- inside string literals, flat statements only.

create table if not exists public.digi_device_checkins (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references auth.users(id) on delete cascade,
  child_id         uuid        not null references public.children(id) on delete cascade,
  prompt_id        text        not null,
  device           text,
  shown_at         timestamptz not null default now(),
  response         text        check (response in ('yes', 'not_really')),
  responded_at     timestamptz,
  suppressed_until timestamptz
);

create index if not exists idx_digi_device_checkins_child on public.digi_device_checkins (child_id, shown_at desc);

create index if not exists idx_digi_device_checkins_user on public.digi_device_checkins (user_id, shown_at desc);

alter table public.digi_device_checkins enable row level security;

drop policy if exists "digi_device_checkins_own" on public.digi_device_checkins;

create policy "digi_device_checkins_own" on public.digi_device_checkins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
