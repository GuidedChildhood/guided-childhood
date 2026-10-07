-- 361_lesson_clips_every_browser_can_play.sql
--
-- Justin, 7 October 2026, on the free taster: "the video here, DiGi intro not
-- playing ... press play doesn't work."
--
-- Every video slide in the scheme, 11 slides in 6 lessons, pointed at the
-- generator's raw output on its CDN: HEVC Main 10, 10 bit, in an hvc1 MP4. A
-- browser plays that only with a hardware decoder for it. Firefox has none,
-- Chrome on Linux has none, and a school laptop without one shows a black box
-- whose play button does nothing ("The element has no supported sources"),
-- which is what Justin met on slide 2 of the taster. Two of the six lessons are
-- the primary pilot pair (ks1-03 and ks2-06, schools/lib/pilot.ts), so a pilot
-- primary school would have met it in both of its lessons.
--
-- The same clips, converted to H.264 High 4.0, 8 bit 4:2:0, AAC, moov first,
-- now ship with the schools site in schools/public/clips under their generator
-- filenames, so the job each one came from stays traceable. This points every
-- video slide at its clip. The address is absolute because the parents app
-- plays these same rows as star lessons (app/k/[token]/lesson), where a bare
-- /clips path would be a 404 on the wrong domain.
--
-- Only video slides on the generator's CDN move, only their src changes, and
-- nothing else in any slide is touched. The mirrors in content/modules and
-- content/standalone carry the same addresses, and scripts/check-lesson-clips.mjs
-- holds every video slide to a clip that exists and is H.264, so the next clip
-- out of the generator cannot ship in a format a school laptop cannot play.
--
-- APPLY AFTER THE DEPLOY that carries schools/public/clips is live, so no
-- lesson ever points at a file that is not there yet.
--
-- Idempotent. Backed up first. Proved: no video slide is left on the CDN,
-- exactly eleven point at the clips, and no lesson changed its slide count.

begin;

create table if not exists schools.school_lessons_backup_361 as
  select module_id, slides, now() as backed_up_at
  from schools.school_lessons
  where slides::text like '%d8j0ntlcm91z4.cloudfront.net%';

alter table schools.school_lessons_backup_361 enable row level security;

update schools.school_lessons l
   set slides = (
     select jsonb_agg(
              case
                when t.s->>'type' = 'video'
                 and t.s->>'src' like 'https://d8j0ntlcm91z4.cloudfront.net/%.mp4'
                then jsonb_set(t.s, '{src}', to_jsonb(
                       'https://schools.guidedchildhood.com/clips/' || regexp_replace(t.s->>'src', '^.*/', '')))
                else t.s
              end
              order by t.ord)
       from jsonb_array_elements(l.slides) with ordinality as t(s, ord)
   )
 where exists (
   select 1 from jsonb_array_elements(l.slides) v
    where v->>'type' = 'video'
      and v->>'src' like 'https://d8j0ntlcm91z4.cloudfront.net/%.mp4'
 );

do $$
declare left_over int; moved int; resized int;
begin
  select count(*) into left_over
    from schools.school_lessons l, jsonb_array_elements(l.slides) v
   where v->>'type' = 'video' and v->>'src' like 'https://d8j0ntlcm91z4.cloudfront.net/%';
  if left_over > 0 then
    raise exception 'Migration 361: % video slide(s) still point at the generator CDN', left_over;
  end if;

  select count(*) into moved
    from schools.school_lessons l, jsonb_array_elements(l.slides) v
   where v->>'type' = 'video' and v->>'src' like 'https://schools.guidedchildhood.com/clips/hf\_%.mp4';
  if moved <> 11 then
    raise exception 'Migration 361: expected 11 video slides on the clips, found %', moved;
  end if;

  select count(*) into resized
    from schools.school_lessons_backup_361 b
    join schools.school_lessons l using (module_id)
   where jsonb_array_length(b.slides) <> jsonb_array_length(l.slides);
  if resized > 0 then
    raise exception 'Migration 361: % lesson(s) changed their slide count', resized;
  end if;
end $$;

commit;
