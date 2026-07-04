-- Guided Childhood Schools: fix infinite recursion in the educators policy
-- Run AFTER 024_schools_onboarding.sql.
--
-- The select policy on school_educators referenced school_educators inside
-- its own using clause (to let colleagues at the same school see each
-- other). Postgres rejects self referencing policies at query time with
-- "infinite recursion detected", so every membership lookup silently
-- failed: /educator kept showing the school setup form while each submit
-- quietly inserted another school. This replaces it with the simple rule.
-- Colleague visibility returns later through a security definer function
-- or the service role, never through a self referencing policy.

drop policy if exists "Educators read own membership" on public.school_educators;

create policy "Users read own educator rows"
  on public.school_educators for select
  using (user_id = auth.uid());
