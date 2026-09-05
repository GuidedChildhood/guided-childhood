-- The Tonight rung: one tap a day that says the live mechanism for the
-- child's top worry is on tonight (phones to bed, the timer, the words).
--
-- Justin, 5 September 2026, on the daily loop review: build the Tonight rung.
-- The road had three reflections before anything touched the fight at 8pm;
-- this is the one action a connect day asks for. One row per child per day.

create table if not exists public.tonight_confirmations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid references public.children(id) on delete cascade,
  -- The day in Europe/London, like every other date in the app.
  day date not null,
  -- Which mechanism was confirmed: bedtime, timer, words, morning, gaming.
  mechanism text not null,
  created_at timestamptz not null default now(),
  unique (user_id, child_id, day)
);

create index if not exists tonight_confirmations_user_day_idx
  on public.tonight_confirmations (user_id, day);

alter table public.tonight_confirmations enable row level security;

drop policy if exists "Own tonight confirmations" on public.tonight_confirmations;
create policy "Own tonight confirmations" on public.tonight_confirmations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
