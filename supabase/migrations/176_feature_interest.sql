-- Guided Childhood — Migration 176
-- Ask before you build, and keep the answer.
--
-- Justin, 9 August 2026, on the school alerts email: "the school alerts system
-- is not set up yet so maybe we could say coming soon but let us know if this
-- is a feature you would use. Not sure how we manage that. Maybe a poll or
-- button reply?"
--
-- Buttons, not replies. A reply cannot be counted, it lands in an inbox
-- somebody has to read, and almost nobody writes a sentence to answer a yes or
-- no. Email clients have no real poll either, what looks like one is always
-- two links. So the email carries two one click links and this is where the
-- click lands.
--
-- One row per person per feature, so a parent who taps twice, or taps no and
-- then changes their mind, updates their answer instead of stuffing the table.
-- That is the unique constraint below, and it is what makes the count
-- trustworthy: rows are people, not clicks.
--
-- No RLS policy on purpose. The table is written by the interest route with
-- the service role and read by us. RLS on with no policy means nobody else
-- reaches it at all, which is the right default for a table of who wants what.

create table if not exists public.feature_interest (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  feature text not null,
  answer text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.feature_interest enable row level security;

create unique index if not exists feature_interest_one_per_person
  on public.feature_interest (user_id, feature);
