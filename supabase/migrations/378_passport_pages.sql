-- 378: a stamp, once earned, is stored and stays earned.
--
-- Plan: plans/2026-10-16-passport-journey-plan.md (v4, PR 1, item 1.2).
-- Justin took the plan's nine decisions on 17 October 2026.
--
-- Until now a passport stamp was never stored. Every surface worked it out
-- again on every view from today's lesson list (lib/pathway/stamped.ts), so
-- adding one module to a key stage would quietly take the stamp off a page the
-- family had been told was stamped for good, and off a booklet already
-- printed. This table is the record: one row per child per page, written once
-- by lib/pathway/stamp-store.ts the first time the page is earned, and read
-- before the rule on every surface after that.
--
-- The other columns are the once only marks the page's pushes and moments
-- need, so a push about a page can never go twice:
--   check_ready_pushed_at  "ready for its check", once per page
--   stamp_pushed_at        "earned the stamp", once per page
--   arrival_pushed_at      "Year N lessons open today", once per page
--   celebrated_at          the parent's seal played
--   seen_at                the parent last looked at this page
--
-- The old stage_passports table (049) is the parent lessons model's own
-- record and was written on a different rule. It stays readable for history;
-- the parent write policy goes, because a parent's session must never be able
-- to stamp a page.
--
-- And, on Justin's yes to decision 6: script 1401 (someone has a photo and is
-- demanding money) asserts something has happened to this child, so it joins
-- the never speak first scripts of migration 185; 405 (recognising grooming
-- warning signs) is preventative and leaves them, by 185's own rule.
--
-- Additive and idempotent. The code reads this table softly, so it runs the
-- same before this lands: stamps are worked out from the rule, as today.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

create table if not exists public.passport_pages (
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  stage_num smallint not null check (stage_num between 1 and 5),
  stamped_at timestamptz,
  lessons_done_at_stamp smallint,
  lessons_total_at_stamp smallint,
  arrival_pushed_at timestamptz,
  check_ready_pushed_at timestamptz,
  stamp_pushed_at timestamptz,
  celebrated_at timestamptz,
  seen_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (child_id, stage_num)
);

create index if not exists idx_passport_pages_user on public.passport_pages (user_id);

comment on table public.passport_pages is
  'One row per child per passport page. stamped_at is set once, the first time the page is earned, and never cleared. Written by the service role only (lib/pathway/stamp-store.ts).';

alter table public.passport_pages enable row level security;

revoke all on public.passport_pages from anon, authenticated;
grant select on public.passport_pages to authenticated;
grant select, insert, update, delete on public.passport_pages to service_role;

drop policy if exists "parents read own passport pages" on public.passport_pages;
create policy "parents read own passport pages" on public.passport_pages
  for select to authenticated using (auth.uid() = user_id);

-- A parent's session may read the old record but never write it.
drop policy if exists "parents write own children passports" on public.stage_passports;

-- Decision 6.
update public.scripts set only_on_signal = true where sort_order = 1401;
update public.scripts set only_on_signal = false where sort_order = 405;
