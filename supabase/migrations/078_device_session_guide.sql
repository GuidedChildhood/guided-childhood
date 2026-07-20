-- Guided Childhood — Migration 078
-- Device session guide accountability. Two small columns on device_sessions:
--   treat: the parent knowingly granted this block beyond the day's healthy
--     guide for the child's age. A treat runs its full length untouched, and
--     the mid session guide crossing never ends it early.
--   guide_alerted_at: set once when the daily guide crossing alert has fired
--     for this session, so the parent is told exactly once and the cron can
--     never double fire.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons
-- inside string literals, flat statements only.

alter table public.device_sessions add column if not exists treat boolean not null default false;

alter table public.device_sessions add column if not exists guide_alerted_at timestamptz;
