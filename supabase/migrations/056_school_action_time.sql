-- Guided Childhood — Migration 056
-- A school action can carry a time of day, not just a date. A dentist at
-- 09:00, a class assembly at 14:30: the written time is what lets the
-- reminder escalate as it nears (calm all morning, red in the last hour)
-- and lets the calendar file drop a real timed event instead of an all
-- day one. Null means the old behaviour, a date only or seen by reminder.

alter table public.school_actions add column if not exists due_time time;
