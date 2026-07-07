-- Guided Childhood — Migration 037
-- Routines that repeat every week (PE every Thursday, library books
-- every Friday) instead of a single due date. recurs_weekday is UK
-- weekday number, 0 Sunday through 6 Saturday, JavaScript's own
-- convention so no translation layer is needed anywhere it is read.
-- auto_send_to_child means the child gets their own reminder every
-- single week it comes round, with no parent tap required each time.

alter table public.school_actions add column if not exists recurs_weekday int check (recurs_weekday between 0 and 6);

alter table public.school_actions add column if not exists auto_send_to_child boolean not null default false;
