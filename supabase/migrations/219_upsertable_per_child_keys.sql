-- Guided Childhood — Migration 219
-- The per child keys become REAL constraints, so upserts work again.
--
-- Justin, red penning: "I did a script for Jody and again it did not update
-- Today." The save was failing silently: migrations 212 to 217 replaced the
-- household unique constraints with PAIRS of partial unique indexes, and
-- PostgREST's onConflict cannot target a partial index, so every upsert that
-- named the old key had nothing to land on. Ten write sites were quietly
-- broken: scripts, lessons, DiGi's daily feedback, the weekly review, the AI
-- literacy check in and device setup progress.
--
-- Postgres 17 has the right tool: UNIQUE NULLS NOT DISTINCT, one constraint
-- per table that treats the household's null child as a value. One row per
-- child per thing, one household row, and ON CONFLICT works.
--
-- (Applied live 19 August; see the apply_migration call. This file mirrors it.)

do $$
declare r record; con_name text;
begin
  for r in
    select * from (values
      ('moment_completions',   array['uq_moment_completions_child_day','uq_moment_completions_family_day'], 'uq_moment_completions',   'user_id, child_id, moment_id, completed_on'),
      ('digi_feedback',        array['uq_digi_feedback_child_day','uq_digi_feedback_family_day'],           'uq_digi_feedback',        'user_id, child_id, feedback_date'),
      ('lesson_completions',   array['uq_lesson_completions_child','uq_lesson_completions_family'],         'uq_lesson_completions',   'user_id, child_id, lesson_id, lesson_source'),
      ('script_completions',   array['uq_script_completions_child','uq_script_completions_family'],         'uq_script_completions',   'user_id, child_id, script_sort_order'),
      ('script_lines_used',    array['uq_script_lines_used_child','uq_script_lines_used_family'],           'uq_script_lines_used',    'user_id, child_id, script_sort_order, line'),
      ('ai_literacy_checkins', array['uq_ai_literacy_child','uq_ai_literacy_family'],                       'uq_ai_literacy',          'user_id, child_id'),
      ('digi_weekly_reviews',  array['uq_digi_weekly_child','uq_digi_weekly_family'],                       'uq_digi_weekly',          'user_id, child_id, week_start'),
      ('device_setup_progress',array['uq_device_setup_child','uq_device_setup_family'],                     'uq_device_setup',         'user_id, child_id, device_key, family_device_id')
    ) as t(tbl, old_indexes, new_con, cols)
  loop
    foreach con_name in array r.old_indexes loop
      execute format('drop index if exists public.%I', con_name);
    end loop;
    if not exists (select 1 from pg_constraint where conname = r.new_con) then
      execute format('alter table public.%I add constraint %I unique nulls not distinct (%s)', r.tbl, r.new_con, r.cols);
    end if;
  end loop;
end $$;
