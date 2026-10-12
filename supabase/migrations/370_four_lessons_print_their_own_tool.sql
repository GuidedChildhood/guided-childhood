-- 370: four lessons print their own tool.
--
-- ks2-26-why-thirteen, ks3-27-when-it-turns-on-you,
-- ks4-28-the-money-and-the-odds and ks4-29-did-not-go-looking hold
-- teacher_notes.tool as one sentence ("STOP IT, REPORT IT, SAY IT. In that
-- order..."), where every other lesson holds { heading, lines, strapline }.
-- The paper pack reads tool.heading and tool.lines, finds neither, and prints
-- the reference lesson's three checks ("Who made this, and how do they
-- know?") on all four sets of bookmarks and in the parent note's tool box, so
-- pupils and families take home a tool the lesson never taught. The
-- organiser printed an empty tool box and the lesson page hid the tool.
--
-- WHAT MOVES. teacher_notes.tool on those four rows, to the object
-- content/modules holds, written from each lesson's own slides and script.
-- Nothing else: no other key, no other column, no other lesson.
--
-- GUARDED before anything is written. Each row must hold the exact sentence
-- read from production on 12 October 2026, or the object already (a rerun).
-- Anything else aborts the whole migration.
--
-- PROVED before commit: every row equals its state at the start of this
-- migration, every column and every teacher notes key, except the four tools,
-- which equal the objects below. And no lesson in the table is left with a
-- tool that is not an object.
--
-- Idempotent: a second run finds the objects in place, writes the same values
-- and passes the same proof. Backed up first.
--
-- Generated from content/modules by scripts/gen-370.mjs, never by hand.

begin;

create table if not exists schools.school_lessons_backup_370 as
  select module_id, teacher_notes, now() as backed_up_at
  from schools.school_lessons
  where module_id in ('ks2-26-why-thirteen', 'ks3-27-when-it-turns-on-you', 'ks4-28-the-money-and-the-odds', 'ks4-29-did-not-go-looking');

alter table schools.school_lessons_backup_370 enable row level security;

-- Every row as it stands now, for the proof at the end.
create temp table before_370 on commit drop as select * from schools.school_lessons;

-- The sentence each row was read holding, and the tool it moves to.
create temp table tools_370 (module_id text primary key, was jsonb not null, tool jsonb not null) on commit drop;
insert into tools_370 (module_id, was, tool) values
  ('ks2-26-why-thirteen',
   to_jsonb('SHIELD: find the number, ask what it is protecting, then choose.'::text),
   '{"heading":"Shield up","lines":["Find the number","Ask what it is protecting","Then choose"],"strapline":"Your real age is what holds the shield up."}'::jsonb),
  ('ks3-27-when-it-turns-on-you',
   to_jsonb('NAME IT, SAVE IT, SAY IT. In that order, because saving stops being possible if you leave it.'::text),
   '{"heading":"Name it, save it, say it","lines":["Name it, so you and the adult mean the same thing","Save it, before you reply","Say it, to one person who can act"],"strapline":"In that order, because saving stops being possible if you leave it."}'::jsonb),
  ('ks4-28-the-money-and-the-odds',
   to_jsonb('THE PRICE, THE ODDS, THE LOOP. Three questions in that order, for anything that takes money and hands back a chance.'::text),
   '{"heading":"The price, the odds, the loop","lines":["What does one chance cost in real money?","Who set the odds, and what do they keep?","How fast is the loop?"],"strapline":"Three questions in that order, for anything that takes money and hands back a chance."}'::jsonb),
  ('ks4-29-did-not-go-looking',
   to_jsonb('STOP IT, REPORT IT, SAY IT. In that order, because only the first one is on a clock.'::text),
   '{"heading":"Stop it, report it, say it","lines":["Stop it, so it goes no further than you","Report it, in the app behind the three dots","Say it, to one actual person"],"strapline":"In that order, because only the first one is on a clock."}'::jsonb);

do $$
declare bad text;
begin
  select string_agg(t.module_id, ', ') into bad
    from tools_370 t
    left join schools.school_lessons l using (module_id)
   where l.module_id is null
      or ((l.teacher_notes -> 'tool') is distinct from t.was
          and (l.teacher_notes -> 'tool') is distinct from t.tool);
  if bad is not null then raise exception '370: not the tool it was read with, in %', bad; end if;
end $$;

update schools.school_lessons l
   set teacher_notes = jsonb_set(l.teacher_notes, '{tool}', t.tool)
  from tools_370 t
 where l.module_id = t.module_id;

do $$
declare bad text; n int;
begin
  if (select count(*) from schools.school_lessons) <> (select count(*) from before_370)
     or exists (select module_id from before_370 except select module_id from schools.school_lessons) then
    raise exception '370: the set of lessons changed';
  end if;

  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join before_370 b using (module_id)
    left join tools_370 t using (module_id)
   where (to_jsonb(l) - 'teacher_notes') is distinct from (to_jsonb(b) - 'teacher_notes')
      or (l.teacher_notes - 'tool') is distinct from (b.teacher_notes - 'tool')
      or (l.teacher_notes -> 'tool') is distinct from coalesce(t.tool, b.teacher_notes -> 'tool');
  if bad is not null then raise exception '370: changed beyond the four tools: %', bad; end if;

  select count(*) into n
    from schools.school_lessons
   where jsonb_typeof(teacher_notes -> 'tool') is distinct from 'object';
  if n <> 0 then raise exception '370: % lessons still hold a tool that is not an object', n; end if;
end $$;

commit;
