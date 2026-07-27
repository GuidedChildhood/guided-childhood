-- Guided Childhood — Migration 064
-- Shared notes and scripts, delivered to the child's own app. When a parent
-- shares a note for their child (from a script) or anything else meant for
-- them, it lands here, pings their phone through the reminders they turned on,
-- and waits on their own quest link to be read and re-read. This replaces the
-- old SMS handoff for a child who has their app, and the read together option
-- (bedtime, lunchbox) stays for the no phone ages. Always from the parent,
-- never a message from us to the child.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons
-- inside string literals, flat statements only.

create table if not exists public.child_shares (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  child_id   uuid        not null references public.children(id) on delete cascade,
  kind       text        not null default 'note' check (kind in ('note', 'script')),
  title      text        not null,
  body       text        not null,
  ref        text,
  created_at timestamptz not null default now(),
  read_at    timestamptz
);

create index if not exists idx_child_shares_child on public.child_shares (child_id, created_at desc);

alter table public.child_shares enable row level security;

drop policy if exists "child_shares_own" on public.child_shares;

create policy "child_shares_own" on public.child_shares
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
