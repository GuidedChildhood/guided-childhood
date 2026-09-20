begin;

-- Migrations 309, 310, 311 and 316 each backed up schools.school_lessons
-- before rewriting it, the same way migration 308 and every one before it
-- did. 308's backup table enables row level security straight after the
-- create table as, and every migration up to it does too. These four
-- dropped that one line, so the daily advisor sweep on 20 September found
-- them the only four of roughly forty backup tables with no policy AND no
-- RLS at all, meaning PostgREST could serve them to anyone. No policy is
-- added, matching every sibling backup table: RLS on with nothing granted
-- locks the table down completely, which is all a dead snapshot needs.

alter table schools.school_lessons_backup_309 enable row level security;
alter table schools.school_lessons_backup_310 enable row level security;
alter table schools.school_lessons_backup_311 enable row level security;
alter table schools.school_lessons_backup_316 enable row level security;

commit;
