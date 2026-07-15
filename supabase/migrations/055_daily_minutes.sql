-- Guided Childhood — Migration 055
-- The daily habit, sized to a real life. A parent picks how much they have
-- today, five, ten or fifteen minutes, and the day is counted done when they
-- have spent that, not when every step is ticked. A busy day of five minutes
-- still keeps the streak alive, and the steps they did not reach simply wait
-- for tomorrow. The point is to be there for them every day, never to guilt
-- them for a short one.
--
-- Supabase editor rules: idempotent, flat statements only.

-- Added as a plain default column, not NOT NULL, so it is a metadata only
-- change that never rewrites the table or blocks on a lock. Every existing
-- and new row still reads 10 by default, and the app treats a missing value
-- as 10 anyway.
alter table public.profiles add column if not exists daily_minutes int default 10;
