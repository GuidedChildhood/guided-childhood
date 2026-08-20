-- 219_parent_lessons_scaffold.sql
-- Tags the Stage 1 co watch lessons (ages 4 to 7) with the child facing
-- scaffold Notice, Choose, Tell.
-- Plan: plans/2026-08-20-foundation-scaffold-and-cs-borrows.md
--
-- Non destructive on purpose. Adds one nullable column and populates it.
-- No validated lesson copy (title, catchphrase, intentions, keyword) is
-- touched. Content stays in the database, non negotiable 6.
--
-- The mapping (balanced 4 / 3 / 3):
--   NOTICE, see what the screen is doing, real or pretend, the machine:
--     1.1 me on a screen vs real, 1.5 real or pretend, 1.8 someone made that,
--     1.9 some voices are not people.
--   CHOOSE, you bring the stop, balance, you decide, you can say no:
--     1.3 the internet remembers (stop before you share), 1.6 screens and
--     sleep, 1.10 the yes no button (you can say no).
--   TELL, there is always a grown up to tell, ask, the never share list:
--     1.2 kind words (tell if unkind), 1.4 when screens make you sad,
--     1.7 my privacy shield.

begin;

alter table public.parent_lessons
  add column if not exists scaffold text
  check (scaffold in ('NOTICE', 'CHOOSE', 'TELL'));

update public.parent_lessons set scaffold = 'NOTICE'
  where stage_id = 1 and lesson_code in ('1.1', '1.5', '1.8', '1.9');

update public.parent_lessons set scaffold = 'CHOOSE'
  where stage_id = 1 and lesson_code in ('1.3', '1.6', '1.10');

update public.parent_lessons set scaffold = 'TELL'
  where stage_id = 1 and lesson_code in ('1.2', '1.4', '1.7');

commit;
