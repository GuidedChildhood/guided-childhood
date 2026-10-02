-- 359 DIGI REMINDERS: "REMIND ME AT SIX TO START THE WIND DOWN".
--
-- Justin, 2 October 2026: DiGi should be able to log a reminder. He chose a
-- reminder at a set time, which digi_followups cannot hold: a follow up is a
-- DAY (due_on), delivered at 07:15, because a question about how something
-- went can wait for the morning. A reminder cannot. "Remind me at six" arriving
-- at quarter past seven the next morning is a broken promise.
--
-- So a table of its own, written by DiGi's set_reminder tool and sent by
-- /api/cron/digi-reminders every five minutes. The parent's own words, the
-- moment to send them, and an optional repeat for "every evening this week".
--
-- The second rail on DiGi's tools holds: small, visible and reversible. The
-- parent sees every waiting reminder in the DiGi chat and can cancel it, so
-- RLS lets them read and update their own and nobody else's.
--
-- digi_prompts learns the kind 'reminder', for the parent with no push device:
-- the reminder becomes a Home card instead, so it is never sent into nothing.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

create table if not exists public.digi_reminders (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  child_id     uuid        references public.children(id) on delete set null,
  -- What to remind them of, in the parent's terms, one short line.
  body         text        not null check (char_length(body) between 1 and 200),
  -- The real moment to send, worked out from a UK wall clock time by the tool.
  remind_at    timestamptz not null,
  -- How many more days it repeats after this one. 0 is a one off. Capped so a
  -- reminder nobody remembers asking for cannot run for ever.
  repeat_days  smallint    not null default 0 check (repeat_days between 0 and 14),
  -- missed: the send ran more than an hour late, so it was not sent at all.
  status       text        not null default 'pending'
                 check (status in ('pending', 'sent', 'missed', 'cancelled')),
  created_at   timestamptz not null default now(),
  sent_at      timestamptz
);

-- The cron scans pending rows that are due, so the index leads on both.
create index if not exists idx_digi_reminders_due
  on public.digi_reminders (status, remind_at);

create index if not exists idx_digi_reminders_user
  on public.digi_reminders (user_id, status, remind_at);

alter table public.digi_reminders enable row level security;

-- Named, because Supabase stops granting new public tables to the Data API by
-- default on 30 October 2026. The parent's client reads and cancels through
-- RLS; the send cron runs as the service role.
grant select, insert, update, delete on public.digi_reminders to authenticated;
grant select, insert, update, delete on public.digi_reminders to service_role;

drop policy if exists "Users manage own digi reminders" on public.digi_reminders;
create policy "Users manage own digi reminders"
  on public.digi_reminders for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Widened, never narrowed: every kind the live constraint held on 2 October
-- 2026, read from pg_constraint, plus 'reminder'.
alter table public.digi_prompts
  drop constraint if exists digi_prompts_kind_check;

alter table public.digi_prompts
  add constraint digi_prompts_kind_check
  check (kind in ('watch_for', 'tip', 'parent_care', 'new_research', 'celebration', 'school', 'follow_up', 'stage_arrival', 'insight', 'reminder'));

comment on table public.digi_reminders is
  'Reminders a parent asked DiGi for, at a set UK time. Sent as a push by /api/cron/digi-reminders, or as a Home card when the family has no push device. Visible and cancellable in the DiGi chat.';
