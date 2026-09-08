-- 274_the_curriculum_stops_being_public.sql
-- Closes the content leak found on 8 September 2026.
--
-- Pairs with: schools/lib/supabase/server-db.ts (the server only read path)
--             scripts/wiring-check.mjs section 8a (the static half of the rule)
--
-- WHAT WAS OPEN. schools.school_lessons carried an RLS policy of
-- USING (true) roled to PUBLIC, and the anon role held the table grant. The
-- access gate in the schools app is real and fails closed, but it protects
-- the PAGES. The table sat behind the same public API as everything else, so
-- a stranger could skip the site entirely and read all 21 modules, 479
-- slides, every exit quiz answer key, every DSL note and every teacher note
-- with one request. The key needed to do it is NEXT_PUBLIC_SUPABASE_ANON_KEY,
-- which is published by design and is already in every parents app browser
-- bundle. Verified on 8 September by running the select as the anon role.
--
-- Two things this is NOT. No personal data was reachable: every other table
-- in this schema gates on auth.uid() through is_school_member,
-- is_class_member or is_delivery_member, and each was checked rather than
-- assumed. And nothing here suggests it was read, only that it could be.
--
-- WHY THE AUTHENTICATED ROLE GOES TOO. Revoking anon alone would leave the
-- whole curriculum one free parent signup away, which is the same hole with
-- a longer walk to it. Nothing reads this table as a logged in user: the
-- schools app has no auth capable Supabase client at all (the product
-- boundary in the wiring check forbids one), and the single parents app
-- reader, app/k/[token]/page.tsx, goes through lib/supabase/admin. Checked
-- file by file before writing this.
--
-- WHAT STILL WORKS. The schools server reads with the service role key,
-- which bypasses RLS, so every lesson page, print route and hub page is
-- unaffected. Nothing in either app reads this table from a browser.
--
-- THE BACKUP TABLES. Fourteen of them, one per content migration, each a
-- full copy of the curriculum. They are already unreadable because RLS is on
-- and they carry no policies at all, but that is a single switch away from
-- open and it is not the switch anyone would think to check. Their grants go
-- the same way, so the protection is two independent things rather than one.
-- They are revoked rather than dropped: they are the rollback path for
-- migrations 199 to 273 and they cost nothing where they sit.

begin;

-- 1. The policy that said yes to everyone.
drop policy if exists "School lessons are public" on schools.school_lessons;

-- The replacement is deliberately not a policy. A policy would still need a
-- grant, and the grant is the thing being taken away. The service role
-- bypasses RLS entirely, so the existing "Service role full access" policy
-- and the grant below are the whole read path now.
revoke all on schools.school_lessons from anon, authenticated;
grant select, insert, update, delete on schools.school_lessons to service_role;

-- 2. The fourteen copies.
do $$
declare t record;
begin
  for t in
    select c.relname
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'schools'
       and c.relkind = 'r'
       and (c.relname like '\_backup\_lesson\_%' or c.relname like 'school\_lessons\_backup\_%')
  loop
    execute format('revoke all on schools.%I from anon, authenticated', t.relname);
    execute format('alter table schools.%I enable row level security', t.relname);
  end loop;
end $$;

-- 3. Supabase grants anon and authenticated SELECT on every new table in an
-- exposed schema by default, so a future migration that creates a table here
-- reopens the same door without anyone deciding to. Turn the default off for
-- this schema. Existing tables are untouched by this: the pupil and delivery
-- tables keep their grants and go on being gated by auth.uid() in their
-- policies, which is the right design for them.
alter default privileges in schema schools revoke select on tables from anon;

-- ── Guards ───────────────────────────────────────────────────────────
do $$
declare n int; c bigint;
begin
  -- The content is still all here. A revoke that quietly took rows with it
  -- would be a worse day than the leak.
  select count(*) into c from schools.school_lessons;
  if c <> 21 then
    raise exception 'Migration 274: expected 21 modules after the revoke, found %', c;
  end if;

  -- Neither public role can read the lessons any more, by grant.
  if has_table_privilege('anon', 'schools.school_lessons', 'SELECT') then
    raise exception 'Migration 274: anon can still SELECT schools.school_lessons';
  end if;
  if has_table_privilege('authenticated', 'schools.school_lessons', 'SELECT') then
    raise exception 'Migration 274: authenticated can still SELECT schools.school_lessons';
  end if;

  -- And no policy is left that would let them if a grant came back.
  select count(*) into n
    from pg_policy p
   where p.polrelid = 'schools.school_lessons'::regclass
     and p.polcmd in ('r', '*')
     and coalesce(pg_get_expr(p.polqual, p.polrelid), '') = 'true';
  if n > 0 then
    raise exception 'Migration 274: % permissive read policy(ies) still USING (true)', n;
  end if;

  -- The server can still do its job.
  if not has_table_privilege('service_role', 'schools.school_lessons', 'SELECT') then
    raise exception 'Migration 274: service_role lost SELECT, every lesson page is now blank';
  end if;

  -- Every backup copy is locked by grant as well as by RLS.
  select count(*) into n
    from pg_class cl join pg_namespace ns on ns.oid = cl.relnamespace
   where ns.nspname = 'schools' and cl.relkind = 'r'
     and (cl.relname like '\_backup\_lesson\_%' or cl.relname like 'school\_lessons\_backup\_%')
     and (has_table_privilege('anon', cl.oid, 'SELECT')
          or has_table_privilege('authenticated', cl.oid, 'SELECT')
          or not cl.relrowsecurity);
  if n > 0 then
    raise exception 'Migration 274: % curriculum backup table(s) still readable', n;
  end if;

  -- Nothing else in the schema lost a grant it needed. The pupil, class and
  -- delivery tables are gated by auth.uid() in their policies and the
  -- educator app reads them as a logged in user, so if this migration had
  -- been too broad they would be the casualty.
  select count(*) into n
    from pg_class cl join pg_namespace ns on ns.oid = cl.relnamespace
   where ns.nspname = 'schools' and cl.relkind = 'r'
     and cl.relname in ('pupils','school_classes','school_accounts','school_educators',
                        'lesson_deliveries','check_responses','action_commitments',
                        'evidence_items','teacher_judgements','generated_reports')
     and not has_table_privilege('authenticated', cl.oid, 'SELECT');
  if n > 0 then
    raise exception 'Migration 274: % educator table(s) lost the authenticated read they need', n;
  end if;
end $$;

commit;
