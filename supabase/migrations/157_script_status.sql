-- Guided Childhood — Migration 157
--
-- Opening a script is not the same as using it.
--
-- Justin: "when you click scripts on the parent pathway there should be a not
-- needed at this time button, and a see the next one for this age. There also
-- needs to know that the scripts have been done, and rerun them to finish the
-- pathway."
--
-- All of that is one bug wearing four hats.
--
-- THE SCRIPT PAGE MARKS A SCRIPT DONE THE MOMENT IT LOADS. Look at
-- app/(dashboard)/dashboard/scripts/[id]/page.tsx: an upsert into
-- script_completions on every open, with a comment explaining the reasoning,
-- which was "opening it IS using it". That is true when a parent goes looking
-- for the words to say tonight. It is false when they open one from the
-- pathway to see whether it applies, decide it does not, and go back.
--
-- And scriptsPct in lib/pathway/progress.ts counts those rows, at THIRTY PER
-- CENT of the stage blend. So a parent who browses ten scripts has moved their
-- child's passport a third of the way through a stage without having a single
-- conversation, and none of those ten will ever be offered again, because as
-- far as the pathway is concerned they are finished.
--
-- That is why there is no "not needed" button and no way to finish the
-- pathway: one row was carrying three different meanings, and the product
-- could not tell them apart because they were never written down.
--
--   opened      I looked at this. Says nothing about whether I used it.
--   used        We had the conversation. This is what the pathway is for.
--   not_needed  Read it, does not apply to us right now. A real decision,
--               and it counts as resolved, but it comes BACK later, because
--               "not now" at seven is not "not ever" at eleven.
--
-- EXISTING ROWS ARE GRANDFATHERED TO 'used', deliberately, and it is worth
-- saying why rather than leaving it as a default.
--
-- Those rows were written under a rule that said opening is using. Deciding
-- retroactively that they do not count would drop every family's progress
-- overnight to fix a premise they never agreed to, which is changing the deal
-- after the fact on the one number the whole product is built around. The
-- stricter rule applies from here. The old rows keep the meaning they were
-- created with, even though we know that meaning was too generous.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

alter table public.script_completions
  add column if not exists status text not null default 'opened';

-- Everything already here predates the distinction, so it keeps the old
-- meaning. New rows default to 'opened' and only move when a parent says so.
update public.script_completions set status = 'used' where status = 'opened';

alter table public.script_completions
  drop constraint if exists script_completions_status_check;

alter table public.script_completions
  add constraint script_completions_status_check
  check (status in ('opened', 'used', 'not_needed'));

comment on column public.script_completions.status is
  'opened = merely viewed and counts for nothing. used = the conversation happened. not_needed = read and does not apply right now, counts as resolved but returns after not_needed_until.';

-- When a "not needed" comes back round.
--
-- Null for every other status. A script set aside is not gone: a family with a
-- seven year old rightly skips the first serious social media request, and
-- rightly meets it again at eleven. Ninety days is the default the app writes,
-- and it is a product decision rather than a law, so it lives in code where it
-- can be argued with.
alter table public.script_completions
  add column if not exists not_needed_until date;

-- The pathway asks "which of this stage's scripts are resolved", so the index
-- leads on the user and carries the status.
create index if not exists idx_script_completions_status
  on public.script_completions (user_id, status);

-- CHECK, before and after a parent uses the new buttons:
--   select status, count(*) from public.script_completions group by 1;
-- Expect everything on 'used' immediately after this runs, then 'opened' and
-- 'not_needed' start appearing as the product is used.
