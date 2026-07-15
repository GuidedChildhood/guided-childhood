-- Guided Childhood — Migration 061
-- Redeeming a saved-for reward. When a child has saved enough stars for their
-- goal (watch the match, a trip out, a treat) they cash it in, and that spends
-- the stars just like screen time does, so the bank stays honest. A reward is
-- not screen time though, it has no minutes, so the star_spends minutes check
-- is relaxed to allow zero. The stars still come off the bank the same way.

alter table public.star_spends drop constraint if exists star_spends_minutes_check;
alter table public.star_spends add constraint star_spends_minutes_check check (minutes between 0 and 1440);
