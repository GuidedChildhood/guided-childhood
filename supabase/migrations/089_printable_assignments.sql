-- Guided Childhood — Migration 089
-- Parent assigned printables: a grown up picks a sheet and sends it to a
-- child, and it lands at the top of the child's to do. The child prints it,
-- does it at home, and it flows into the existing printable confirm loop
-- (087). Cleared once the child sends it to be confirmed, so it never lingers.
--
-- Supabase editor rules: idempotent creates, flat statements, no DO blocks.

create table if not exists public.printable_assignments (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  child_id      uuid        not null references public.children(id) on delete cascade,
  printable_key text        not null,
  title         text        not null,
  emoji         text,
  created_at    timestamptz not null default now(),
  cleared_at    timestamptz
);

create index if not exists idx_printable_assignments_open
  on public.printable_assignments (child_id, created_at desc) where cleared_at is null;

alter table public.printable_assignments enable row level security;

drop policy if exists "printable_assignments_own" on public.printable_assignments;

create policy "printable_assignments_own" on public.printable_assignments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
