-- 080: Gift with a pay back, and the age based timer contract.
--
-- gift_debts: a parent can gift screen minutes now that debit jobs to do
-- later. The block starts without spending stars and the debt is recorded
-- here. The next approved quest tick settles the oldest open debt. A gift
-- is a gift: the pay back is framed as saying thanks, never a punishment.
--
-- kid_links gains the contract acceptance: agreed_at is when the child
-- tapped I agree on their first run, agreed_level is which age wording they
-- agreed (under8, 8to10, 11plus). Both live on kid_links so either side of
-- the family, and later DiGi's context, can read the acceptance in one
-- simple select.

create extension if not exists "uuid-ossp";

create table if not exists public.gift_debts (
  id         uuid        primary key default uuid_generate_v4(),
  user_id    uuid        references auth.users(id) on delete cascade,
  child_id   uuid,
  minutes    int,
  stars_owed int,
  note       text,
  settled    boolean     not null default false,
  created_at timestamptz default now()
);

alter table public.gift_debts enable row level security;

drop policy if exists "gift_debts_own" on public.gift_debts;
create policy "gift_debts_own" on public.gift_debts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists gift_debts_open_by_child
  on public.gift_debts (child_id, created_at) where not settled;

alter table public.kid_links add column if not exists agreed_at    timestamptz;
alter table public.kid_links add column if not exists agreed_level text;
