-- Guided Childhood — Migration 034
-- The agreement built from taps: which type the family chose and the
-- exact clauses with their picked options, stored as structure so the
-- builder can reopen exactly what was agreed. The legacy text columns
-- stay filled on every save so the printed fridge copy never changes.

alter table public.family_agreements add column if not exists agreement_type text;

alter table public.family_agreements add column if not exists clauses jsonb;
