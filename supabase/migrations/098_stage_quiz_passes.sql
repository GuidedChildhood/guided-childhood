-- Guided Childhood — Migration 098
-- Stage quiz passes. The final green before a passport stage is stamped is a
-- short quiz drawn from what the stage taught, the lessons and scripts the
-- child worked through. Passing it, alongside the other greens, earns the stamp
-- and unlocks the next Planet Friend. This table records each attempt so the
-- passport can read whether a child has passed a stage, and DiGi can read the
-- last score for the end of stage readiness check. Attempts are kept as history,
-- the passport simply looks for one passed row per child and stage.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons inside
-- string literals, flat statements only.

create table if not exists public.stage_quiz_passes (
  id        uuid        primary key default gen_random_uuid(),
  user_id   uuid        references auth.users(id) on delete cascade,
  child_id  uuid        references public.children(id) on delete cascade,
  stage_id  int         not null check (stage_id between 1 and 5),
  score     int         not null default 0,
  total     int         not null default 0,
  passed    boolean     not null default false,
  taken_at  timestamptz not null default now()
);

create index if not exists idx_stage_quiz_child_stage on public.stage_quiz_passes (user_id, child_id, stage_id);
create index if not exists idx_stage_quiz_passed       on public.stage_quiz_passes (user_id, child_id, stage_id, passed);

alter table public.stage_quiz_passes enable row level security;

drop policy if exists "stage_quiz_passes_own" on public.stage_quiz_passes;

create policy "stage_quiz_passes_own" on public.stage_quiz_passes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
