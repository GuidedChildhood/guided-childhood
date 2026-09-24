-- 348: write down, explicitly, who may reach every existing public table.
--
-- Supabase, email of 23 September 2026: from 30 October 2026 new tables in
-- the public schema are no longer granted to the Data API by default. Our 115
-- existing tables keep the grants they have, so the live app is unaffected.
--
-- What is NOT safe is a rebuild. 143 of our 145 table creating migrations
-- relied on the old default and never granted anything. Replay them on a
-- fresh project after 30 October (a restore, a branch, a staging copy) and
-- every table comes back invisible to supabase-js: the whole app answers
-- 42501 permission denied.
--
-- So this migration states today's grants exactly, read from the live
-- catalogue on 24 September 2026 (information_schema.role_table_grants):
--   authenticated and service_role: every privilege, on all 115 tables.
--   anon: every privilege, EXCEPT no SELECT on the 15 tables earlier
--   migrations deliberately closed to the public, and no UPDATE on profiles.
-- Nothing is widened or narrowed. On the live database every statement is a
-- no op; on a rebuild it restores what the old default used to give.
--
-- A table that no longer exists when this is replayed is skipped rather than
-- failing the run, since some tables were created outside the migration
-- history. Row level security is untouched: all 115 already have it on, and
-- RLS is what decides which rows each role sees.
--
-- New tables from here on grant themselves in their own migration;
-- scripts/check-migration-grants.mjs fails the build if one does not.

do $$
declare
  r record;
begin
  for r in select * from (values
    ('ai_lessons', 'insert, update, delete, truncate, references, trigger'),
    ('ai_literacy_checkins', 'select, insert, update, delete, truncate, references, trigger'),
    ('ai_updates', 'select, insert, update, delete, truncate, references, trigger'),
    ('checkin_shifts', 'select, insert, update, delete, truncate, references, trigger'),
    ('child_scripts', 'insert, update, delete, truncate, references, trigger'),
    ('child_shares', 'select, insert, update, delete, truncate, references, trigger'),
    ('child_time_settings', 'select, insert, update, delete, truncate, references, trigger'),
    ('children', 'select, insert, update, delete, truncate, references, trigger'),
    ('community_poll_votes', 'select, insert, update, delete, truncate, references, trigger'),
    ('community_polls', 'select, insert, update, delete, truncate, references, trigger'),
    ('concern_events', 'select, insert, update, delete, truncate, references, trigger'),
    ('concerns', 'select, insert, update, delete, truncate, references, trigger'),
    ('cron_runs', 'select, insert, update, delete, truncate, references, trigger'),
    ('curriculum_objectives', 'select, insert, update, delete, truncate, references, trigger'),
    ('daily_moments', 'insert, update, delete, truncate, references, trigger'),
    ('daily_sessions', 'select, insert, update, delete, truncate, references, trigger'),
    ('device_guide_candidates', 'select, insert, update, delete, truncate, references, trigger'),
    ('device_guides', 'insert, update, delete, truncate, references, trigger'),
    ('device_requests', 'select, insert, update, delete, truncate, references, trigger'),
    ('device_sessions', 'select, insert, update, delete, truncate, references, trigger'),
    ('device_setup_progress', 'select, insert, update, delete, truncate, references, trigger'),
    ('device_stage_notes', 'insert, update, delete, truncate, references, trigger'),
    ('digi_answer_flags', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_answer_reviews', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_conversations', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_device_checkins', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_feedback', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_followups', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_insights', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_lane_keywords', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_lane_misses', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_latency', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_memory', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_outcomes', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_prompts', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_questions', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_safety_flags', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_tester_runs', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_weekly_reviews', 'select, insert, update, delete, truncate, references, trigger'),
    ('digi_wisdom', 'insert, update, delete, truncate, references, trigger'),
    ('earned_stickers', 'select, insert, update, delete, truncate, references, trigger'),
    ('email_addresses', 'select, insert, update, delete, truncate, references, trigger'),
    ('email_log', 'select, insert, update, delete, truncate, references, trigger'),
    ('expert_knowledge', 'insert, update, delete, truncate, references, trigger'),
    ('expert_knowledge_candidates', 'select, insert, update, delete, truncate, references, trigger'),
    ('family_agreements', 'select, insert, update, delete, truncate, references, trigger'),
    ('family_devices', 'select, insert, update, delete, truncate, references, trigger'),
    ('family_quests', 'select, insert, update, delete, truncate, references, trigger'),
    ('feature_interest', 'select, insert, update, delete, truncate, references, trigger'),
    ('gift_debts', 'select, insert, update, delete, truncate, references, trigger'),
    ('holiday_allowance', 'select, insert, update, delete, truncate, references, trigger'),
    ('job_streaks', 'select, insert, update, delete, truncate, references, trigger'),
    ('keepsake_interest', 'select, insert, update, delete, truncate, references, trigger'),
    ('kid_days', 'select, insert, update, delete, truncate, references, trigger'),
    ('kid_homework_notes', 'select, insert, update, delete, truncate, references, trigger'),
    ('kid_lesson_missions', 'select, insert, update, delete, truncate, references, trigger'),
    ('kid_links', 'select, insert, update, delete, truncate, references, trigger'),
    ('kid_milestones', 'select, insert, update, delete, truncate, references, trigger'),
    ('kid_nudges', 'select, insert, update, delete, truncate, references, trigger'),
    ('lead_email_log', 'select, insert, update, delete, truncate, references, trigger'),
    ('learning_apps', 'insert, update, delete, truncate, references, trigger'),
    ('learning_sheet_results', 'select, insert, update, delete, truncate, references, trigger'),
    ('legal_watch_items', 'select, insert, update, delete, truncate, references, trigger'),
    ('lesson_completions', 'select, insert, update, delete, truncate, references, trigger'),
    ('lesson_pass_by', 'select, insert, update, delete, truncate, references, trigger'),
    ('lesson_question_answers', 'select, insert, update, delete, truncate, references, trigger'),
    ('lessons', 'insert, update, delete, truncate, references, trigger'),
    ('literacy_checkins', 'select, insert, update, delete, truncate, references, trigger'),
    ('management_findings', 'select, insert, update, delete, truncate, references, trigger'),
    ('moment_completions', 'select, insert, update, delete, truncate, references, trigger'),
    ('order_items', 'select, insert, update, delete, truncate, references, trigger'),
    ('orders', 'select, insert, update, delete, truncate, references, trigger'),
    ('parent_lesson_cards', 'insert, update, delete, truncate, references, trigger'),
    ('parent_lesson_completions', 'select, insert, update, delete, truncate, references, trigger'),
    ('parent_lesson_segments', 'insert, update, delete, truncate, references, trigger'),
    ('parent_lessons', 'select, insert, update, delete, truncate, references, trigger'),
    ('phone_setup_guides', 'insert, update, delete, truncate, references, trigger'),
    ('planet_codes', 'select, insert, update, delete, truncate, references, trigger'),
    ('planet_events', 'select, insert, update, delete, truncate, references, trigger'),
    ('planet_homes', 'select, insert, update, delete, truncate, references, trigger'),
    ('platform_config', 'select, insert, update, delete, truncate, references, trigger'),
    ('printable_assignments', 'select, insert, update, delete, truncate, references, trigger'),
    ('printable_completions', 'select, insert, update, delete, truncate, references, trigger'),
    ('products', 'insert, update, delete, truncate, references, trigger'),
    ('profiles', 'select, insert, delete, truncate, references, trigger'),
    ('push_subscriptions', 'select, insert, update, delete, truncate, references, trigger'),
    ('quest_requests', 'select, insert, update, delete, truncate, references, trigger'),
    ('quest_ticks', 'select, insert, update, delete, truncate, references, trigger'),
    ('recommended_tools', 'select, insert, update, delete, truncate, references, trigger'),
    ('school_actions', 'select, insert, update, delete, truncate, references, trigger'),
    ('school_alert_sent', 'select, insert, update, delete, truncate, references, trigger'),
    ('school_connections', 'select, insert, update, delete, truncate, references, trigger'),
    ('schools', 'select, insert, update, delete, truncate, references, trigger'),
    ('script_candidates', 'select, insert, update, delete, truncate, references, trigger'),
    ('script_completions', 'select, insert, update, delete, truncate, references, trigger'),
    ('script_lines_used', 'select, insert, update, delete, truncate, references, trigger'),
    ('script_requests', 'select, insert, update, delete, truncate, references, trigger'),
    ('scripts', 'select, insert, update, delete, truncate, references, trigger'),
    ('social_platform_guides', 'insert, update, delete, truncate, references, trigger'),
    ('spotlight_shown', 'select, insert, update, delete, truncate, references, trigger'),
    ('stage_arrivals', 'select, insert, update, delete, truncate, references, trigger'),
    ('stage_passports', 'select, insert, update, delete, truncate, references, trigger'),
    ('stage_quiz_passes', 'select, insert, update, delete, truncate, references, trigger'),
    ('star_bonuses', 'select, insert, update, delete, truncate, references, trigger'),
    ('star_chart_prints', 'select, insert, update, delete, truncate, references, trigger'),
    ('star_goals', 'select, insert, update, delete, truncate, references, trigger'),
    ('star_spends', 'select, insert, update, delete, truncate, references, trigger'),
    ('starter_leads', 'select, insert, update, delete, truncate, references, trigger'),
    ('sticker_credits', 'select, insert, update, delete, truncate, references, trigger'),
    ('surface_events', 'select, insert, update, delete, truncate, references, trigger'),
    ('tell_a_parent_cards', 'insert, update, delete, truncate, references, trigger'),
    ('tonight_confirmations', 'select, insert, update, delete, truncate, references, trigger'),
    ('tutor_lessons', 'select, insert, update, delete, truncate, references, trigger'),
    ('wellbeing_checkins', 'select, insert, update, delete, truncate, references, trigger'),
    ('wellbeing_checks', 'select, insert, update, delete, truncate, references, trigger')
  ) as t(tbl, anon_privs)
  loop
    if to_regclass(format('public.%I', r.tbl)) is null then
      continue;
    end if;
    execute format('grant select, insert, update, delete, truncate, references, trigger on public.%I to authenticated, service_role', r.tbl);
    execute format('grant %s on public.%I to anon', r.anon_privs, r.tbl);
  end loop;
end
$$;
