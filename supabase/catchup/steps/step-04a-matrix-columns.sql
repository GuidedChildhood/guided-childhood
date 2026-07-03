-- GUIDED CHILDHOOD CATCH UP · STEP 04a · curriculum matrix columns
-- Paste into a NEW query tab, Run, look for the COMPLETE message.

alter table public.lessons add column if not exists strand text;
alter table public.lessons add column if not exists status text not null default 'live'
  check (status in ('live', 'stub'));
alter table public.ai_lessons add column if not exists strand text;

update public.lessons
  set strand = 'information'
  where title = 'How the algorithm decides what your child sees';

select 'STEP 04a COMPLETE · curriculum matrix columns' as status;
