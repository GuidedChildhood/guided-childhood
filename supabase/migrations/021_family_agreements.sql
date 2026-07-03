-- Guided Childhood — Migration 021
-- Family agreements: the negotiated per stage agreement the upgrade page
-- has been selling. One live agreement per child. Clauses are stored as
-- jsonb arrays of plain strings so the builder can mix suggested clauses
-- with ones the family writes themselves. Both sides sign: what the child
-- agrees and what the grown ups agree, because a one sided list of rules
-- is a contract a child never owns.

create table if not exists public.family_agreements (
  id               uuid        primary key default uuid_generate_v4(),
  user_id          uuid        not null references auth.users(id) on delete cascade,
  child_id         uuid        references public.children(id) on delete cascade,
  stage_id         text        not null,
  child_name       text,
  child_agrees     jsonb       not null default '[]'::jsonb,
  parent_agrees    jsonb       not null default '[]'::jsonb,
  when_it_goes_wrong text,
  review_date      date,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique(user_id, child_id)
);

create index if not exists idx_family_agreements_user
  on public.family_agreements(user_id, updated_at desc);

alter table public.family_agreements enable row level security;

create policy "Users can manage their own family agreements"
  on public.family_agreements
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
