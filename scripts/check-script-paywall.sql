-- Does the paywall actually hold at the row?
--
-- Justin, 11 August 2026, twice: "I don't want the scripts free so that needs to
-- be paywalled, as everything should be 4 days free paywall."
--
-- Migration 187 closes the permanent free tier by dropping one policy, and the
-- whole change rests on a claim that cannot be checked by reading it: that once
-- "Free scripts are public" is gone, a visitor holding the anon key gets nothing.
-- The anon key ships in the browser bundle by design, so if that claim is wrong
-- the paywall is a client side suggestion.
--
-- The app cannot answer it either. It reads through a signed in session and
-- would show a locked tile whatever the database did, which is exactly how the
-- hole got there: on 8 August the profiles table had the same shape, the screen
-- enforcing a rule the row did not.
--
-- So this asks Postgres, with row level security actually switched on, as each
-- of the four people who matter.
--
-- Usage, against a scratch database (NOT against Supabase):
--   psql -f scripts/check-script-paywall.sql
--
-- Every check raises on failure, so a clean run means every line passed.

-- ── A small replica: just enough of the two tables the policies name ────────

drop schema if exists auth cascade;
create schema auth;

-- Supabase resolves these from the request's JWT. Here they come from a session
-- setting, so a test can be somebody in one line.
create function auth.uid() returns uuid language sql stable as
  $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
create function auth.role() returns text language sql stable as
  $$ select coalesce(nullif(current_setting('test.role', true), ''), 'anon') $$;

drop table if exists public.scripts cascade;
drop table if exists public.profiles cascade;

create table public.profiles (
  id uuid primary key,
  subscription_status text,
  trial_ends_at timestamptz
);

create table public.scripts (
  id serial primary key,
  sort_order int not null,
  title text not null,
  is_free boolean not null default false
);

insert into public.scripts (sort_order, title, is_free) values
  (100, 'A free one', true),
  (101, 'Another free one', true),
  (200, 'A paid one', false),
  (201, 'Another paid one', false);

-- Four people. The names are the point.
insert into public.profiles (id, subscription_status, trial_ends_at) values
  ('11111111-1111-1111-1111-111111111111', 'active', null),                        -- a member
  ('22222222-2222-2222-2222-222222222222', null,     now() + interval '2 days'),   -- day two of four
  ('33333333-3333-3333-3333-333333333333', null,     now() - interval '1 day'),    -- the trial ran out
  ('44444444-4444-4444-4444-444444444444', null,     null);                        -- never started one

alter table public.scripts enable row level security;

-- ── The two policies exactly as they stand before 187 ───────────────────────
--
-- The first is migration 001's, the one 187 removes. The second is 148's, which
-- already says what lib/access.ts says and is left as the only way in.

create policy "Free scripts are public"
  on public.scripts for select
  using (is_free = true);

create policy "Paid scripts visible to active members"
  on public.scripts for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and (
          subscription_status = 'active'
          or (trial_ends_at is not null and trial_ends_at > now())
        )
    )
  );

-- profiles has to be readable by the policy's own subquery. In Supabase this is
-- a separate policy; here the table simply has RLS off, which is the same effect
-- and keeps the file about the one table under test.

-- ── A tiny harness ──────────────────────────────────────────────────────────

create or replace function test_visible(who text, uid text) returns int
language plpgsql as $fn$
declare n int;
begin
  perform set_config('test.uid', uid, true);
  perform set_config('test.role', case when uid = '' then 'anon' else 'authenticated' end, true);
  select count(*) into n from public.scripts;
  return n;
end;
$fn$;

create or replace function expect(what text, got int, want int) returns void
language plpgsql as $fn$
begin
  if got <> want then
    raise exception 'FAIL  %  saw % scripts, expected %', what, got, want;
  end if;
  raise notice 'PASS  %  % scripts', what, got;
end;
$fn$;

-- Policies apply to a non superuser. Without this every check trivially passes,
-- which is the way this file could quietly certify nothing.
create role paywall_test nologin;
grant usage on schema public, auth to paywall_test;
grant select on public.scripts, public.profiles to paywall_test;
grant execute on function auth.uid(), auth.role(), test_visible(text, text), expect(text, int, int) to paywall_test;

set role paywall_test;

-- ── BEFORE 187: the tier is real and this proves the test can see it ────────

select expect('before 187, a logged out visitor', test_visible('anon', ''), 2);
select expect('before 187, a trial that ran out', test_visible('expired', '33333333-3333-3333-3333-333333333333'), 2);

reset role;

-- ── MIGRATION 187 ───────────────────────────────────────────────────────────

drop policy if exists "Free scripts are public" on public.scripts;

set role paywall_test;

-- THE CLAIM THE WHOLE CHANGE RESTS ON.
select expect('a logged out visitor gets nothing', test_visible('anon', ''), 0);
select expect('and so does anyone holding only the anon key', test_visible('anon again', ''), 0);

-- The people the paywall is actually for.
select expect('a trial that ran out gets nothing', test_visible('expired', '33333333-3333-3333-3333-333333333333'), 0);
select expect('and an account that never started one', test_visible('never started', '44444444-4444-4444-4444-444444444444'), 0);

-- AND IT MUST NOT HAVE SHUT THE DOOR ON THE PAYING FAMILIES.
select expect('a member still sees every script', test_visible('member', '11111111-1111-1111-1111-111111111111'), 4);
select expect('and day two of four sees every script', test_visible('in trial', '22222222-2222-2222-2222-222222222222'), 4);

reset role;

-- ── IDEMPOTENT, because it will be run by hand and possibly twice ───────────

drop policy if exists "Free scripts are public" on public.scripts;
drop policy if exists "Free scripts are public" on public.scripts;

set role paywall_test;
select expect('still nothing after running 187 twice', test_visible('anon', ''), 0);
select expect('and a member is still fine', test_visible('member', '11111111-1111-1111-1111-111111111111'), 4);
reset role;

-- ── is_free survives, because it is editorial data and not a grant ──────────

select expect('the free flags are still on their rows',
  (select count(*)::int from public.scripts where is_free), 2);

select 'all passed' as result;
