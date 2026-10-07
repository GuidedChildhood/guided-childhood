-- 362_the_scripts_count_the_answers_the_way_the_wall_does.sql
--
-- Found by the pilot review, 7 October 2026: three teacher scripts tell the
-- room to answer "for a, b, c", and the wall numbers the same three answers 1,
-- 2 and 3 on keycaps. A teacher reading the script aloud asks for a letter the
-- class cannot see. Two of the three are in the free sample lesson, the first
-- thing a school opens.
--
--   ks3-12-misinfo-deepfakes   slides 12 and 17
--   ks3-10-mood-and-screens    one slide
--
-- Each becomes "for one, two or three", the way the rest of the scheme already
-- says it. Only the script text moves; the mirrors in content/modules carry the
-- same words.
--
-- Idempotent. Backed up first. Proved: no "a, b, c" left in either lesson,
-- three scripts changed, and neither lesson changed its slide count.

begin;

create table if not exists schools.school_lessons_backup_362 as
  select module_id, slides, now() as backed_up_at
  from schools.school_lessons
  where module_id in ('ks3-12-misinfo-deepfakes', 'ks3-10-mood-and-screens');

alter table schools.school_lessons_backup_362 enable row level security;

update schools.school_lessons
   set slides = replace(slides::text, 'for a, b, c.', 'for one, two or three.')::jsonb
 where module_id in ('ks3-12-misinfo-deepfakes', 'ks3-10-mood-and-screens')
   and slides::text like '%for a, b, c.%';

do $$
declare left_over int; changed int; resized int;
begin
  select count(*) into left_over
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id in ('ks3-12-misinfo-deepfakes', 'ks3-10-mood-and-screens')
     and s->>'script' like '%a, b, c%';
  if left_over > 0 then
    raise exception 'Migration 362: % script(s) still say a, b, c', left_over;
  end if;

  select count(*) into changed
    from schools.school_lessons l, jsonb_array_elements(l.slides) s
   where l.module_id in ('ks3-12-misinfo-deepfakes', 'ks3-10-mood-and-screens')
     and s->>'script' like '%for one, two or three.%';
  if changed < 3 then
    raise exception 'Migration 362: expected at least 3 scripts to read one, two or three, found %', changed;
  end if;

  select count(*) into resized
    from schools.school_lessons_backup_362 b
    join schools.school_lessons l using (module_id)
   where jsonb_array_length(b.slides) <> jsonb_array_length(l.slides);
  if resized > 0 then
    raise exception 'Migration 362: % lesson(s) changed their slide count', resized;
  end if;
end $$;

commit;
