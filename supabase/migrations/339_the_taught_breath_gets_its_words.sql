-- 339: the taught breathing beat gets its own words.
--
-- Found 22 September 2026 while checking for repeated interactives. Three
-- lessons run star-breath twice. In eyfs-01 the two sit nine slides apart and
-- that is fine. In these two they are ADJACENT, and the second one carried
-- only { "seconds": 4 }.
--
-- With no config the component falls back to the golden DiGi star, the
-- heading "Star breath, everyone together" and the words "Follow the star".
-- So the class saw the lesson's own friend lead a generic half time pause,
-- and then immediately the generic star lead the lesson's actual taught
-- activity. The dressed one was the throwaway and the bare one was the
-- teaching, which is backwards.
--
-- Both are real beats and neither is deleted. The second simply gets the
-- words its own script already teaches:
--
--   ks1-02 s12  the calm bodies practice. Script: "Everyone sits tall, hands
--               on tummies, and we follow the star for six slow breaths
--               without talking." Now says that, led by Pebble.
--   ks4-17 s22  practising the pause. Script: "panic is the lever this crime
--               pulls ... before any of the three lifelines comes a pause".
--               Now says that, on the star, in the still register.
--
-- No slide is added or removed and no minutes move.

begin;

create table schools.school_lessons_backup_339 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_339 enable row level security;

create temp table miss(module text, target text);

-- Guarded on the slide being the bare star breath, so a replay or a lesson
-- that has since been rewritten aborts rather than overwriting real words.
create or replace function schools.dress_breath_339(p_module text, p_pos int, p_expect jsonb, p_new jsonb)
returns void language plpgsql as $$
declare s jsonb;
begin
  select l.slides->p_pos into s from schools.school_lessons l where l.module_id = p_module;
  if s is null or s->>'component' <> 'star-breath' then
    insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' is not a star-breath'); return;
  end if;
  if s->'config' <> p_expect then
    insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' config is not the bare one this was written against'); return;
  end if;
  update schools.school_lessons l
     set slides = jsonb_set(l.slides, array[p_pos::text, 'config'], p_new)
   where l.module_id = p_module;
end $$;


select schools.dress_breath_339('ks1-02-kind-screens-calm-bodies', 11, '{"seconds":4}'::jsonb, '{"prompt":"Sit tall, hands on tummies. Six slow breaths with Pebble, no talking. Then see if your body feels quieter.","heading":"Calm bodies, six slow breaths","seconds":4,"register":"bouncy","character":"pebble"}'::jsonb);

select schools.dress_breath_339('ks4-17-sextortion', 21, '{"seconds":4}'::jsonb, '{"prompt":"Four breaths in time with the star. Panic is the lever this crime pulls, so the pause comes before any of the three lifelines.","heading":"Practise the pause","seconds":4,"register":"still","character":"digi"}'::jsonb);

do $$
declare n int; d text;
begin
  select count(*), string_agg(module || ': ' || target, E'\n  ') into n, d from miss;
  if n > 0 then raise exception E'339 aborted, % guard(s) missed:\n  %', n, d; end if;
end $$;

-- Nothing but those two config objects moved.
do $$
declare bad text;
begin
  select string_agg(x.module_id || ' changed ' || x.n || ' slide(s)', ', ') into bad from (
    select l.module_id,
           (select count(*) from generate_series(0, jsonb_array_length(l.slides) - 1) i
             where l.slides->i is distinct from b.slides->i) as n
      from schools.school_lessons l join schools.school_lessons_backup_339 b using (module_id)
  ) x
   where (x.module_id in ('ks1-02-kind-screens-calm-bodies', 'ks4-17-sextortion') and x.n <> 1)
      or (x.module_id not in ('ks1-02-kind-screens-calm-bodies', 'ks4-17-sextortion') and x.n <> 0);
  if bad is not null then raise exception '339 aborted, the wrong slides moved: %', bad; end if;
end $$;

drop function schools.dress_breath_339(text, int, jsonb, jsonb);

commit;
