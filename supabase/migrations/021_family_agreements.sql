-- Guided Childhood — Migration 021
-- The family agreement builder. One living agreement per account,
-- negotiated per stage, signed by parent and child, with a review date
-- so the agreement gets revisited each term instead of going stale.
-- Version counts how many times the family has re agreed it.

create table if not exists public.family_agreements (
  id                    uuid        primary key default uuid_generate_v4(),
  user_id               uuid        not null references auth.users(id) on delete cascade,
  version               int         not null default 1,
  stage_id              text,
  agreed_date           date,
  review_date           date,

  -- Agreement sections, filled in by the family together
  family_values         text,
  bedroom_rule_time     text,
  bedroom_rule_location text,
  social_media_terms    text,
  when_things_go_wrong  text,
  extra_agreements      text,

  signed_by_parent      boolean     not null default false,
  signed_by_child       boolean     not null default false,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique(user_id)
);

alter table public.family_agreements enable row level security;

create policy "Users can manage their own family agreement"
  on public.family_agreements
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
