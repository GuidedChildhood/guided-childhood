-- Guided Childhood — Migration 088
-- What each child loves, so screens can point back at the real world.
-- A short free text interest per child (football, singing, crafts). DiGi
-- turns it into a "for you" tip on the pathway: watch a little, then go and
-- do the real thing. Parent entered on the child's setup, one place, works
-- for every age including the youngest who are co viewed.
--
-- Supabase editor rules: idempotent, flat statements, no DO blocks.

alter table public.children add column if not exists interests text;
