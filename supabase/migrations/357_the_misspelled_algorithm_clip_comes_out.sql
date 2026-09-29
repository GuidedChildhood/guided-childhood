-- 357_the_misspelled_algorithm_clip_comes_out.sql
--
-- Justin, 29 September 2026, from the parent lesson "How the algorithm decides
-- what your child sees", slide 3 of 12: the board behind DiGi reads "HOW THE
-- ALETLIOIM WORKS". The lettering was drawn by the video model on 1 July, and a
-- video model's lettering is not text, it is a picture of text, so nothing in
-- the build could ever have caught the spelling.
--
-- The school scheme used the same clip until the 11 September re-render and no
-- longer does, so this parent lesson is the only place it still plays. The
-- slide comes out; the lesson reads whole without it (the concept slide after
-- it carries the idea). Plan: plans/2026-09-29-lessons-plan.md. When the clips
-- are remade it is with a blank board and the words laid over as real text.
--
-- Idempotent. Backed up first.

begin;

create table if not exists public.lessons_backup_357 as
  select id, slides, now() as backed_up_at
  from public.lessons
  where slides::text like '%2052451b-a1d7-4932-9839-fd875b134903%';

alter table public.lessons_backup_357 enable row level security;

update public.lessons l
   set slides = (
     select coalesce(jsonb_agg(t.s order by t.ord), '[]'::jsonb)
       from jsonb_array_elements(l.slides) with ordinality as t(s, ord)
      where coalesce(t.s->>'src', '') not like '%2052451b-a1d7-4932-9839-fd875b134903%'
   )
 where l.slides::text like '%2052451b-a1d7-4932-9839-fd875b134903%';

do $$
declare left_over int;
begin
  select count(*) into left_over from public.lessons
   where slides::text like '%2052451b-a1d7-4932-9839-fd875b134903%';
  if left_over > 0 then
    raise exception 'Migration 357: the misspelled clip is still in % lesson(s)', left_over;
  end if;
end $$;

commit;
