-- 395: two reminders a day, at most, for any parent (12 November 2026).
--
-- Justin agreed on 12 November: "Max 2 reminders a day". Each scheduled push
-- capped itself (the evening line stops after quiet nights, the window pass
-- sends one per family), but nothing capped the total. On a bad day one parent
-- could get the morning window line, the home window line, the evening line, a
-- trial push, a lesson drip and the weekly review. The review board's keeps
-- coming back lens named it: a gentle nudge is a capped one.
--
-- What counts: the scheduled nudges that invite a parent back (sendPush with
-- nudge: true, see lib/push/nudge-cap.ts for the list). What never counts: a
-- reminder the parent asked for, a school item they added, the timer, or news
-- that something just happened. Capping those would hide something real.
--
-- One row per parent per London day with the number sent. claim_parent_nudge
-- adds one and says yes only while the day is under the cap, in one statement,
-- so two crons firing together cannot both take the last slot. Rows hold a
-- uuid, a date and a count; nothing a family typed.
--
-- Written and read by the server only (service role). RLS on, no policy.

create table if not exists public.parent_nudge_log (
  user_id  uuid not null references auth.users(id) on delete cascade,
  day      date not null,
  sent     int  not null default 0 check (sent >= 0),
  primary key (user_id, day)
);

alter table public.parent_nudge_log enable row level security;
revoke all on public.parent_nudge_log from anon, authenticated;
grant select, insert, update, delete on public.parent_nudge_log to service_role;

comment on table public.parent_nudge_log is
  'How many scheduled nudges each parent was sent each London day, so no parent gets more than the cap (lib/push/nudge-cap.ts). A uuid, a date and a count.';

create or replace function public.claim_parent_nudge(p_user uuid, p_day date, p_cap int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  n int;
begin
  insert into public.parent_nudge_log (user_id, day, sent)
  values (p_user, p_day, 1)
  on conflict (user_id, day) do update
    set sent = parent_nudge_log.sent + 1
    where parent_nudge_log.sent < p_cap
  returning sent into n;
  return n is not null;
end;
$$;

revoke all on function public.claim_parent_nudge(uuid, date, int) from public, anon, authenticated;
grant execute on function public.claim_parent_nudge(uuid, date, int) to service_role;
