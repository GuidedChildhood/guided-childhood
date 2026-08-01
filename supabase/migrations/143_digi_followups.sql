-- Guided Childhood — Migration 143
--
-- DiGi can come back to you.
--
-- Justin: "build 1 to 5."
--
-- This is number two on that list and the one that changes what DiGi IS. Until
-- now it could only ever answer when spoken to. A parent asks about bedtime on
-- Tuesday, tries the thing, and unless they think to come back and say so,
-- nobody ever finds out whether it worked. The parent carries the follow up, and
-- the parents who most need this are the ones with the least room to carry
-- anything.
--
-- Now DiGi can say "I will ask how that went on Thursday" and mean it.
--
-- HOW IT IS DELIVERED, and why nothing new was built for it:
--
--   A due follow up becomes a digi_prompts row, which is the proactive card the
--   dashboard already renders and the push cron already sends. Building a second
--   delivery path would mean two places a parent can be interrupted from, two
--   things to mute, and two ways to get the quiet hours wrong. So it joins the
--   queue that already exists and inherits everything that queue already
--   respects.
--
-- WHY due_on IS A DATE AND NOT A TIMESTAMP:
--
--   "Ask me on Thursday" is a day, not a moment. Storing a timestamp would
--   invent a precision nobody asked for and put us in the business of guessing
--   whether 07:00 or 19:00 is the kind thing. The delivery cron runs in the
--   morning and the card sits there until the parent is ready.
--
-- Capped at three pending per family, enforced in the tool rather than here,
-- because a guide that queues up nine things to ask you about is a guide you
-- start avoiding.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

create table if not exists public.digi_followups (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  child_id     uuid        references public.children(id) on delete set null,
  -- The day to ask, in Europe/London. A day, not a moment. See above.
  due_on       date        not null,
  -- What DiGi wants to ask, in its own words, written at the time it decided.
  question     text        not null,
  -- What it was following up ON, so the card can carry the thread rather than
  -- arriving as a question with no history attached.
  context      text,
  status       text        not null default 'pending'
                 check (status in ('pending', 'delivered', 'cancelled')),
  created_at   timestamptz not null default now(),
  delivered_at timestamptz
);

-- The delivery cron scans by day and status, so the index leads on both.
create index if not exists idx_digi_followups_due
  on public.digi_followups (status, due_on);

create index if not exists idx_digi_followups_user
  on public.digi_followups (user_id, status, due_on);

alter table public.digi_followups enable row level security;

-- The parent can see and cancel their own. They should be able to: a promise to
-- come back on Thursday that cannot be called off is a nuisance, not a service.
drop policy if exists "Users manage own digi followups" on public.digi_followups;
create policy "Users manage own digi followups"
  on public.digi_followups for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- The delivery cron writes a prompt card of a new kind, so the existing check
-- constraint has to learn the word. Dropped and recreated rather than altered,
-- which is the only way to widen a check.
alter table public.digi_prompts
  drop constraint if exists digi_prompts_kind_check;

alter table public.digi_prompts
  add constraint digi_prompts_kind_check
  check (kind in ('watch_for', 'tip', 'parent_care', 'new_research', 'celebration', 'follow_up'));

comment on table public.digi_followups is
  'Follow ups DiGi decided to make during a conversation. Delivered as digi_prompts cards on the due day, so they inherit the existing proactive queue rather than opening a second channel a parent has to mute separately.';
