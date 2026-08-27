-- Guided Childhood — Migration 225
-- The per child star rate, phase 3 of the star tiers plan
-- (plans/week-of-2026-08-26-star-tiers-plan.md).
--
-- One star has been five minutes for everyone, an env config per deployment.
-- The rate now lives on the child, so a family can make a star buy ten
-- minutes for the teenager and five for the eight year old, and the fade
-- ladder can hand more of the deal to the child as they grow. Default 5, so
-- every existing family keeps exactly the rate they have today.
--
-- Supabase editor rules: idempotent, flat statements only.

alter table public.child_time_settings add column if not exists star_minutes int not null default 5 check (star_minutes between 1 and 60);
