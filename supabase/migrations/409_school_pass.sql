-- The school pass (Justin, 27 November 2026).
-- Plan: plans/2026-11-27-school-pass.md.
--
-- A school that pays for the licence gets something for its families: while
-- the licence runs, a family who came in through that school's link
-- (profiles.school_link, migration 353) keeps lessons, the homework helper,
-- the star chart and the school calendar free after the four free days, and
-- gets a taste of the paid core: ten scripts and ten DiGi messages in total.
-- Everything else is the ordinary membership.
--
-- 353 kept the newsletter link and the paid licence apart on purpose, so a
-- newsletter was never counted as a customer. This keeps that: a link is
-- attribution until Justin puts a date in licensed_until, which he does from
-- the admin schools page when the invoice is paid. No date, no pass.

alter table public.school_links
  add column if not exists licensed_until date;

comment on column public.school_links.licensed_until is
  'The last day of the school''s paid licence. Set by the founder when the invoice is paid. Null means the link is attribution only and grants nothing.';

-- What a pass family has used of the taste: one row per script opened and per
-- DiGi message sent. A script already opened stays open, so a parent who goes
-- back to the bedtime words is never charged twice for them.
create table if not exists public.school_pass_usage (
  user_id  uuid not null references auth.users(id) on delete cascade,
  kind     text not null check (kind in ('script', 'digi')),
  ref      text not null check (length(ref) between 1 and 64),
  used_at  timestamptz not null default now(),
  primary key (user_id, kind, ref)
);

alter table public.school_pass_usage enable row level security;

create policy "Parents read their own school pass use" on public.school_pass_usage
  for select using (auth.uid() = user_id);

-- Writes go only through school_pass_use below, which holds the cap.
grant select on public.school_pass_usage to authenticated;
grant all on public.school_pass_usage to service_role;
revoke all on public.school_pass_usage from anon;

-- The last day of this parent's pass, or null when there is none. Definer, so
-- the middleware can ask with the parent's own session while school_links
-- stays service role only. A parent can ask only about themselves.
create or replace function public.school_pass_until(p_user uuid)
returns date
language sql
stable
security definer
set search_path = public
as $$
  select l.licensed_until
  from public.profiles p
  join public.school_links l on l.code = p.school_link
  where p.id = p_user
    and l.active
    and l.licensed_until is not null
    and l.licensed_until >= current_date
    and (p_user = auth.uid() or auth.role() = 'service_role')
$$;

revoke all on function public.school_pass_until(uuid) from public, anon;
grant execute on function public.school_pass_until(uuid) to authenticated, service_role;

-- May this parent use one more of the taste? True when the pass is live and
-- this item is already theirs, or there is room under the cap (p_claim adds
-- it). False when there is no pass or the ten are used. The cap is passed in
-- from the code so a pricing change is not a migration, and clamped here so a
-- caller cannot hand itself a hundred.
create or replace function public.school_pass_use(p_kind text, p_ref text, p_cap int, p_claim boolean)
returns boolean
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  used int;
begin
  if uid is null or p_kind not in ('script', 'digi') or p_ref is null or length(p_ref) not between 1 and 64 then
    return false;
  end if;
  if public.school_pass_until(uid) is null then
    return false;
  end if;
  if exists (select 1 from public.school_pass_usage where user_id = uid and kind = p_kind and ref = p_ref) then
    return true;
  end if;
  -- One parent at a time, so two taps at once cannot both take the tenth.
  perform pg_advisory_xact_lock(hashtext(uid::text || p_kind));
  select count(*) into used from public.school_pass_usage where user_id = uid and kind = p_kind;
  if used >= least(greatest(coalesce(p_cap, 0), 0), 50) then
    return false;
  end if;
  if p_claim then
    insert into public.school_pass_usage (user_id, kind, ref) values (uid, p_kind, p_ref)
    on conflict do nothing;
  end if;
  return true;
end;
$$;

revoke all on function public.school_pass_use(text, text, int, boolean) from public, anon;
grant execute on function public.school_pass_use(text, text, int, boolean) to authenticated;
