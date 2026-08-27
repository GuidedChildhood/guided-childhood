-- Guided Childhood — Migration 224
-- Job steps, phase 2 of the three tier plan (the Dr Becky layer,
-- plans/week-of-2026-08-26-star-tiers-plan.md).
--
-- The one chart she does endorse: a plain checklist that chunks a big job
-- into steps, no prizes attached. A parent can add up to five short steps to
-- a quest ("Clean your room" becomes clothes away, books on the shelf, floor
-- clear). The steps are scaffolding on the child's card, ticked locally as
-- they go; the stars sit on the finished job only, never per step, so the
-- chunking teaches the shape of the work without pricing each piece.
--
-- Null means no steps, which is every existing quest, so nothing changes for
-- any family until a parent adds some.
--
-- Supabase editor rules: idempotent, flat statements only.

alter table public.family_quests add column if not exists steps text[];
