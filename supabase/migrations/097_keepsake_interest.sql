-- Guided Childhood — Migration 097
-- Keepsakes interest. When a family reaches a milestone we offer a real world
-- reward: a professionally printed copy of their child's digital passport, and
-- a set of the five Planet Friend charms (Croc style). Print on demand is not
-- wired yet, so this table simply captures a parent registering interest, keyed
-- loosely so the same parent can register for more than one item. Best effort
-- from the API: a failure never blocks the page.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only.

create table if not exists public.keepsake_interest (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        references auth.users(id) on delete set null,
  email      text        not null,
  item       text        not null check (item in ('printed_passport', 'charm_set', 'both')),
  child_name text,
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists idx_keepsake_interest_created on public.keepsake_interest (created_at desc);
create index if not exists idx_keepsake_interest_user    on public.keepsake_interest (user_id);

alter table public.keepsake_interest enable row level security;

drop policy if exists "keepsake_interest_own" on public.keepsake_interest;

create policy "keepsake_interest_own" on public.keepsake_interest
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
