-- Guided Childhood — Migration 109
-- A sticker is celebrated on the child's path exactly once. Earning is
-- reconciled on read and persisted by whoever opens first (the parent Passport
-- or the child's path), so a plain "is it earned" check cannot tell whether the
-- child has seen the moment yet. This flag does: the child's path celebrates
-- any earned sticker still marked not celebrated, then sets it, so the moment
-- fires once regardless of read order and never repeats.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

alter table public.earned_stickers
  add column if not exists celebrated boolean not null default false;
