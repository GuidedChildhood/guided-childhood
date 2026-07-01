-- Guided Childhood: Migration 015
-- Adds a lightweight "did this work" signal to script_completions so DiGi
-- can reference which scripts actually helped this family, not just which
-- were read.

alter table public.script_completions
  add column if not exists worked text
    check (worked in ('yes', 'somewhat', 'no'));
