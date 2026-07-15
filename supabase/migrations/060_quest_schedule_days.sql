-- Guided Childhood — Migration 060
-- Quests on chosen days of the week. Until now a quest was daily, weekdays,
-- weekend or once. This adds schedule_days: a list of weekday numbers (0 Sunday
-- through 6 Saturday, JavaScript's own convention) so a parent can set a job for
-- exactly the days that fit, tidy the room Monday, Wednesday and Friday, PE kit
-- every Thursday, which is how three times a week is really set. Null or empty
-- means fall back to the schedule text, so nothing changes for existing quests.

alter table public.family_quests add column if not exists schedule_days smallint[];
