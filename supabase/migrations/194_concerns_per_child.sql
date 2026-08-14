-- Guided Childhood — Migration 194
--
-- ONE WORRY PER FAMILY BECOMES ONE WORRY PER CHILD.
--
-- Justin, 14 August 2026: "for multi child nearly everything has to duplicate
-- for that particular child and report everything."
--
-- THE ROOT CAUSE OF THE WHOLE MULTI CHILD PROBLEM IS THIS ONE CONSTRAINT.
-- Verified against the live database rather than read off the repo:
--
--   concerns_user_id_slug_key   UNIQUE (user_id, slug)
--
-- So a family can hold exactly ONE row per worry, for the whole house. Teo and
-- Olga cannot both have "Bedtime screens" open. When the second child's worry
-- is raised it does not create a row, it collides with the first child's and
-- bumps times_flagged on it, and from then on one status, one last_checked_at
-- and one score answer for both children.
--
-- Everything downstream inherits that. The check in asks once and files the
-- answer against whichever child_id happens to be on the row. What is working
-- draws one line where there should be two. DiGi reads one arc. The weekly
-- email reports one number. None of those are separate bugs to fix one at a
-- time: they are all this constraint, seen from different pages.
--
-- child_id has been on the table since the beginning and every one of the 27
-- live rows has it set. It was simply never in the key, so it could never
-- separate anything.
--
-- WHY NULLS NOT DISTINCT. child_id is nullable, and Postgres treats NULLs as
-- distinct in a unique index by default, which would let an unlimited number of
-- (user_id, NULL, slug) rows pile up: the exact duplication this is meant to
-- prevent, just moved to the family wide rows. Postgres 15 added NULLS NOT
-- DISTINCT and this database is 17, so a family wide worry stays genuinely
-- single while each child gets their own.
--
-- ORDER MATTERS. The backfill runs BEFORE the swap, because rows that are
-- already duplicated under the new key would make the constraint fail to
-- create. There are none today (all 27 carry a child_id and the old key already
-- forbade repeats) but a migration that only works on one database is not a
-- migration.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

-- Any concern with no child named goes to the primary child, which is who the
-- app has been assuming all along. Only where a primary child exists: a family
-- without one keeps its family wide row rather than gaining a false owner.
update public.concerns c
   set child_id = ch.id
  from public.children ch
 where c.child_id is null
   and ch.parent_id = c.user_id
   and ch.is_primary = true;

alter table public.concerns
  drop constraint if exists concerns_user_id_slug_key;

create unique index if not exists concerns_user_child_slug_key
  on public.concerns (user_id, child_id, slug) nulls not distinct;

-- The reads that matter most are "this child's live worries", which is the
-- check in list and the What is working page.
create index if not exists idx_concerns_child_status
  on public.concerns (user_id, child_id, status);
