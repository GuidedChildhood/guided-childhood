-- GUIDED CHILDHOOD CATCH UP · STEP 06 · seed-guards
-- Paste into a NEW query tab, Run, look for the COMPLETE message.

create unique index if not exists uq_scripts_sort_order on public.scripts(sort_order);
create unique index if not exists uq_daily_moments_title on public.daily_moments(title);
create unique index if not exists uq_ai_lessons_key on public.ai_lessons(audience, sort_order);
select 'STEP 06 COMPLETE · seed-guards' as status;
