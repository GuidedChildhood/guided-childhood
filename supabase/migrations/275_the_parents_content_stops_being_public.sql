-- 275_the_parents_content_stops_being_public.sql
-- The parents app half of the leak closed in migration 274.
--
-- Pairs with: app/m/[id]/page.tsx (the one logged out reader, moved to admin)
--
-- WHAT IS OPEN. Fifteen tables in the public schema carry an RLS policy of
-- USING (true) and the anon grant, so anyone with the published anon key can
-- read all of them straight from the REST API: the lessons, the AI modules,
-- the device and phone and social platform guides, the daily moments, the
-- expert knowledge bank, the child scripts, the tell a parent cards, the
-- product list. Same shape and same cause as the schools curriculum, found
-- the same way, by running the read as the anon role rather than by reading
-- the policy.
--
-- CONTENT ONLY. Checked column by column rather than assumed: none of the
-- fifteen carries a user_id, child_id, family_id, parent_id, email or phone.
-- The five columns that matched a "name" pattern are the names of devices,
-- apps, social platforms and products, plus expert_knowledge.source_name,
-- which is a citation. No family data was reachable through any of them.
--
-- WHY ONLY anon, WHEN 274 TOOK authenticated TOO. Because the cost is not
-- the same and pretending otherwise would break the live app. In the schools
-- app nothing read as a logged in user, so revoking authenticated was free.
-- Here thirty five files read this content through lib/supabase/server, which
-- is the anon key plus the parent's cookie, so a logged in parent reads as
-- authenticated. Taking that away needs every one of those content reads
-- moved to a service role client first, roughly seventy call sites in an app
-- families use daily. That is a separate pass with its own testing, not a
-- line in this migration.
--
-- So this closes the door that is open to the whole internet, and leaves the
-- one that needs an account. Named plainly rather than left implied: after
-- this, a free signup can still read this content through the API. That is
-- the next job.
--
-- THE FUNCTIONS GO TOO, and this is the part that would have made the table
-- revoke theatre if it had been skipped. A SECURITY DEFINER function runs as
-- its owner, so it walks past both the grant and the policy:
--
--   match_scripts    SECURITY DEFINER over scripts. The scripts table is
--                    already closed to anon, so this is the only way in. It
--                    returns sort_order, title, situation and category, not
--                    the script body. It returns nothing today because no
--                    script carries an embedding, all 335 are null. That is
--                    a fact about the data, not a protection: the moment the
--                    script-refresh cron backfills them it starts answering.
--   match_moments    SECURITY DEFINER over daily_moments, same shape.
--   prune_cron_runs  SECURITY DEFINER, and it DELETES. An anonymous caller
--                    can wipe the cron heartbeat rows that every health check
--                    is built on, which would make a dead job look healthy.
--                    The worst of the five and the least obvious.
--   cron_job_status  operational detail, no reason for a stranger to have it.
--   required_columns_present  reads information_schema, so it hands out the
--                    shape of the database.
--
-- Two that the security advisor did NOT flag and that are left alone on
-- purpose: match_expert_knowledge and match_digi_memory are SECURITY INVOKER,
-- so they run as the caller and RLS applies normally.

begin;

-- 1. The fifteen content tables.
do $$
declare t text;
declare tables constant text[] := array[
  'ai_lessons','child_scripts','daily_moments','device_guides','device_stage_notes',
  'digi_wisdom','expert_knowledge','learning_apps','lessons','parent_lesson_cards',
  'parent_lesson_segments','phone_setup_guides','products','social_platform_guides',
  'tell_a_parent_cards'
];
declare p record;
begin
  foreach t in array tables loop
    -- THE POLICY IS REPLACED, NOT REMOVED, and getting this wrong would have
    -- taken the parents app down. RLS is on for all fifteen. A logged in
    -- parent still has to read this content, and under RLS a grant with no
    -- permissive policy returns nothing at all. Dropping the USING (true)
    -- policy outright would therefore have left authenticated holding a grant
    -- that reads zero rows, and a guard written against has_table_privilege
    -- would have passed while every lesson page rendered empty. So the
    -- blanket policy is re-created roled to authenticated instead.
    --
    -- That makes anon denied twice over: no grant, and no policy that applies
    -- to it. Either alone would do; both means a future migration that hands
    -- the grant back by accident still does not reopen the door.
    --
    -- A scoped policy on the same table is somebody's deliberate rule and is
    -- left alone: only USING (true) is touched.
    for p in
      select polname from pg_policy
       where polrelid = ('public.'||quote_ident(t))::regclass
         and polcmd in ('r','*')
         and polpermissive
         and coalesce(pg_get_expr(polqual, polrelid), '') = 'true'
         and polroles = '{0}'   -- PUBLIC only; a role-scoped one is not ours
    loop
      execute format('drop policy %I on public.%I', p.polname, t);
    end loop;
    execute format(
      'create policy %I on public.%I for select to authenticated using (true)',
      t||'_readable_by_signed_in', t);
    execute format('revoke select on public.%I from anon', t);
  end loop;
end $$;

-- 2. The five functions a stranger has no business calling.
--
-- FROM PUBLIC, NOT JUST FROM anon, and this is the whole trick. Postgres
-- grants EXECUTE on a new function to PUBLIC automatically, and every one of
-- these five carries it: their ACL reads =X/postgres, where the empty grantee
-- is PUBLIC. anon and authenticated are members of PUBLIC, so revoking from
-- them by name and stopping there would have left every one of these five
-- wide open while every guard I could write said it was shut. Checked the
-- ACLs before writing this line rather than after.
--
-- All five go for authenticated too. Every real caller builds a service role
-- client of its own: app/api/cron/health-alert/route.ts for prune_cron_runs,
-- and lib/ops/health.ts, whose admin() default serves cron_job_status and
-- required_columns_present. match_scripts and match_moments have no caller in
-- the codebase at all. So nothing loses anything it was using.
revoke execute on function public.match_scripts(public.vector, integer) from public, anon, authenticated;
revoke execute on function public.match_moments(public.vector, integer) from public, anon, authenticated;
revoke execute on function public.prune_cron_runs() from public, anon, authenticated;
revoke execute on function public.cron_job_status() from public, anon, authenticated;
revoke execute on function public.required_columns_present(text[]) from public, anon, authenticated;

-- Named explicitly so the crons and the health board keep working even if a
-- future default privilege change takes the implicit grant away.
grant execute on function public.match_scripts(public.vector, integer) to service_role;
grant execute on function public.match_moments(public.vector, integer) to service_role;
grant execute on function public.prune_cron_runs() to service_role;
grant execute on function public.cron_job_status() to service_role;
grant execute on function public.required_columns_present(text[]) to service_role;

-- ── Guards ───────────────────────────────────────────────────────────
do $$
declare n int; t text;
declare tables constant text[] := array[
  'ai_lessons','child_scripts','daily_moments','device_guides','device_stage_notes',
  'digi_wisdom','expert_knowledge','learning_apps','lessons','parent_lesson_cards',
  'parent_lesson_segments','phone_setup_guides','products','social_platform_guides',
  'tell_a_parent_cards'
];
begin
  -- anon can read none of them, by grant.
  n := 0;
  foreach t in array tables loop
    if has_table_privilege('anon', 'public.'||quote_ident(t), 'SELECT') then
      n := n + 1;
    end if;
  end loop;
  if n > 0 then
    raise exception 'Migration 275: anon can still SELECT % of the content tables', n;
  end if;

  -- and no blanket read policy survives that would let them back in.
  n := 0;
  foreach t in array tables loop
    n := n + (select count(*) from pg_policy
               where polrelid = ('public.'||quote_ident(t))::regclass
                 and polcmd in ('r','*') and polpermissive
                 and coalesce(pg_get_expr(polqual, polrelid), '') = 'true');
  end loop;
  if n > 0 then
    raise exception 'Migration 275: % blanket USING (true) read policy(ies) still stand', n;
  end if;

  -- authenticated KEEPS its read. This is the guard that catches the mistake
  -- that would take the parents app down: the thirty five files still read
  -- this content as the logged in parent.
  n := 0;
  foreach t in array tables loop
    if not has_table_privilege('authenticated', 'public.'||quote_ident(t), 'SELECT') then
      n := n + 1;
    end if;
  end loop;
  if n > 0 then
    raise exception 'Migration 275: authenticated lost the read on % table(s); the parents app would go blank', n;
  end if;

  -- service_role keeps everything, which is what the admin client uses.
  n := 0;
  foreach t in array tables loop
    if not has_table_privilege('service_role', 'public.'||quote_ident(t), 'SELECT') then
      n := n + 1;
    end if;
  end loop;
  if n > 0 then
    raise exception 'Migration 275: service_role lost the read on % table(s)', n;
  end if;

  -- The five functions are shut to both public roles. has_function_privilege
  -- resolves membership, so this also catches a surviving PUBLIC grant, which
  -- is the way this revoke would most plausibly fail.
  declare fn text; fns constant text[] := array[
    'public.match_scripts(public.vector,integer)',
    'public.match_moments(public.vector,integer)',
    'public.prune_cron_runs()',
    'public.cron_job_status()',
    'public.required_columns_present(text[])'
  ];
  begin
    foreach fn in array fns loop
      if has_function_privilege('anon', fn, 'EXECUTE') then
        raise exception 'Migration 275: anon can still execute %', fn;
      end if;
      if has_function_privilege('authenticated', fn, 'EXECUTE') then
        raise exception 'Migration 275: authenticated can still execute %', fn;
      end if;
      if not has_function_privilege('service_role', fn, 'EXECUTE') then
        raise exception 'Migration 275: service_role lost EXECUTE on %, the crons and the health board need it', fn;
      end if;
    end loop;
  end;

  -- The content is all still here.
  if (select count(*) from public.lessons) = 0
     or (select count(*) from public.scripts) <> 335
     or (select count(*) from public.daily_moments) <> 89 then
    raise exception 'Migration 275: content row counts moved, which a revoke must never do';
  end if;
end $$;

-- The guard that matters, kept separate because it changes role and a failed
-- role switch should not be mistaken for a passed check: actually READ as
-- each role rather than asking the catalogue about grants. Asking about the
-- grant is what would have let the policy mistake through.
do $$
declare seen bigint;
begin
  set local role authenticated;
  select count(*) into seen from public.lessons;
  reset role;
  if seen = 0 then
    raise exception 'Migration 275: a signed in parent reads zero lessons. The policy replacement did not take, and the app would be blank.';
  end if;

  set local role anon;
  begin
    select count(*) into seen from public.lessons;
    reset role;
    raise exception 'Migration 275: anon still reads % lessons', seen;
  exception
    when insufficient_privilege then
      reset role;   -- correct: the read was refused
    when others then
      reset role;
      raise;
  end;
end $$;

commit;
