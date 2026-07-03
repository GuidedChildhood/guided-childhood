-- GUIDED CHILDHOOD CATCH UP · STEP 15 · verify
-- Paste into a NEW query tab, Run, look for the COMPLETE message.

-- Run after parts 1 and 2. Expected: scripts 160, device_guides 18,
-- daily_moments and ai_lessons well above zero, agreements and email
-- log at zero until families use them.
select 'scripts' as what, count(*) as rows from public.scripts
union all select 'daily_moments', count(*) from public.daily_moments
union all select 'device_guides', count(*) from public.device_guides
union all select 'lessons', count(*) from public.lessons
union all select 'ai_lessons', count(*) from public.ai_lessons
union all select 'push_subscriptions', count(*) from public.push_subscriptions
union all select 'family_agreements', count(*) from public.family_agreements
union all select 'email_log', count(*) from public.email_log
order by what;

select 'STEP 15 COMPLETE · verify' as status;
