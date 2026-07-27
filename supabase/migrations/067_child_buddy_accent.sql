-- Guided Childhood — Migration 067
-- The child makes their app their own: which DiGi squad buddy greets them, and
-- an accent colour. Personalisation by the child's own choice, never by an
-- assumption about them. Both optional, the app falls back to DiGi and the
-- default warm accent when unset.

alter table public.children add column if not exists buddy text;
alter table public.children add column if not exists accent text;
