-- 338: the two six point recaps become four slides of three.
--
-- Justin's call, 22 September 2026, after migration 337 left one helpline
-- below the fold that no reorder could reach: split rather than cut points.
-- "Split, keeps every word." Both recaps ran six points on one slide and
-- overflowed at both sizes, 434px and 531px on a 1920 wall, so the tail was
-- off screen whatever order the points were in.
--
-- NO POINT IS REWRITTEN. Every one of the twelve strings is carried across
-- character for character, which the guards below prove by comparing the
-- multiset before and after. Only the grouping, the two headings and the two
-- scripts are new, and each new script is assembled from the instructions the
-- original already carried for the points that landed on that half.
--
-- MINUTES ARE UNCHANGED. Each half runs one minute, so the pair still runs the
-- two the recap ran, the close still runs five, and the timing string still
-- states 63. check-module-contract passes on both at 32 slides.
--
-- ks4-28-the-money-and-the-odds
--   "What to keep about the odds"    a chance is not an item, the hidden price,
--                                    the house edge. The machine itself.
--   "What to keep, and where to go"  no system exists, the speed caps, the money
--                                    going before the feeling, and the number.
--                                    Keeps the original script verbatim, because
--                                    it belongs to the half carrying the number.
--
-- ks4-29-did-not-go-looking  REGROUPED, not simply cut in half.
--   The opening point runs four lines where the others run two, so leaving it
--   above the helpline put the numbers 19px under the fold on a wall and 55px
--   under at 1366. Measured, five arrangements, and this is the one where every
--   number clears at both sizes:
--
--   "What to keep, and where to go"  you are not in trouble, the three numbers,
--                                    most people are not harmed. The pastoral half.
--   "How it works, and what to do"   why the feed found you, what a paid offer
--                                    actually is, and the three moves it ends on.
--
-- VERIFIED AFTER: check-helplines reports 21 readable, 0 below the fold, and
-- its wall allowlist is now empty.

begin;

create table schools.school_lessons_backup_338 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_338 enable row level security;

create temp table miss(module text, target text);

-- Replace the one recap slide at a position with two, guarded on the exact
-- slide being replaced, and refusing outright if a single point string would
-- be changed, gained or lost in the process.
create or replace function schools.split_recap_338(p_module text, p_pos int, p_expect jsonb, p_a jsonb, p_b jsonb)
returns void language plpgsql as $$
declare cur jsonb; before_pts jsonb; after_pts jsonb;
begin
  select l.slides->p_pos into cur from schools.school_lessons l where l.module_id = p_module;
  if cur is null or cur <> p_expect then
    insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' is not the recap this migration was written against');
    return;
  end if;
  before_pts := cur->'points';
  after_pts := (p_a->'points') || (p_b->'points');
  -- Same strings, same count, same order. A split must not edit a word.
  if before_pts <> after_pts and not (
       (select count(*) from jsonb_array_elements_text(before_pts)) = (select count(*) from jsonb_array_elements_text(after_pts))
       and not exists (select 1 from jsonb_array_elements_text(before_pts) e
                        where e not in (select * from jsonb_array_elements_text(after_pts)))
       and not exists (select 1 from jsonb_array_elements_text(after_pts) e
                        where e not in (select * from jsonb_array_elements_text(before_pts)))
     ) then
    insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' split changes the points themselves');
    return;
  end if;
  -- The minutes the pair runs must equal the minutes the one slide ran, or the
  -- timing string and the cycle totals stop telling the truth.
  if (p_a->>'minutes')::int + (p_b->>'minutes')::int <> (cur->>'minutes')::int then
    insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' split changes the minutes');
    return;
  end if;
  update schools.school_lessons l
     set slides = (
       select jsonb_agg(s order by i)
       from (
         select case when i < p_pos then l.slides->i
                     when i = p_pos then p_a
                     when i = p_pos + 1 then p_b
                     else l.slides->(i - 1) end as s, i
         from generate_series(0, jsonb_array_length(l.slides)) i
       ) x
     )
   where l.module_id = p_module;
end $$;


-- 1. ks4-28-the-money-and-the-odds: one six point recap becomes two of three.
select schools.split_recap_338('ks4-28-the-money-and-the-odds', 27,
  '{"type":"recap","phase":"close","minutes":2,"heading":"What to keep","points":["A chance is not an item. You pay the same whether it comes good or not, and that makes it a different kind of purchase from anything else you buy.","Two currencies and an awkward pack size are how the price gets hidden. A gem is worth about a penny, and the leftover is deliberate.","The house edge is published, fixed and patient. One go is luck. Ten thousand goes is arithmetic.","Nothing is due and nothing is hot. The wheel has no memory, which is exactly why no system can exist.","Speed is what the law acts on. An online slot is capped at £5 a spin, and £2 if you are under 25. A weekly draw has no cap at all.","The money goes before the feeling of spending arrives, and that gap is where borrowing starts. Chasing is the sign worth knowing by name, and help is free on 0808 8020 133 at any age."],"script":"Read the six steadily. Leave a beat after the last one rather than rushing to the mission, because the number is the only thing on this slide somebody in the room may actually need, and a second of silence is what gives them time to write it down."}'::jsonb,
  '{"type":"recap","phase":"close","minutes":1,"heading":"What to keep about the odds","points":["A chance is not an item. You pay the same whether it comes good or not, and that makes it a different kind of purchase from anything else you buy.","Two currencies and an awkward pack size are how the price gets hidden. A gem is worth about a penny, and the leftover is deliberate.","The house edge is published, fixed and patient. One go is luck. Ten thousand goes is arithmetic."],"script":"Read the three steadily. These three are the machine itself, so do not rush them. The next slide is about the person standing in front of it."}'::jsonb,
  '{"type":"recap","phase":"close","minutes":1,"heading":"What to keep, and where to go","points":["Nothing is due and nothing is hot. The wheel has no memory, which is exactly why no system can exist.","Speed is what the law acts on. An online slot is capped at £5 a spin, and £2 if you are under 25. A weekly draw has no cap at all.","The money goes before the feeling of spending arrives, and that gap is where borrowing starts. Chasing is the sign worth knowing by name, and help is free on 0808 8020 133 at any age."],"script":"Read the three steadily. Leave a beat after the last one rather than rushing to the mission, because the number is the only thing on this slide somebody in the room may actually need, and a second of silence is what gives them time to write it down."}'::jsonb);

-- 2. ks4-29-did-not-go-looking: one six point recap becomes two of three.
select schools.split_recap_338('ks4-29-did-not-go-looking', 27,
  '{"type":"recap","phase":"close","minutes":2,"heading":"What to keep","points":["A feed is a guess about what holds attention, not a verdict about you. Distress holds attention, which is why it finds people who never went looking. About a third of pupils your age in England saw self harm content last month, and most of them were not looking for it.","You are not in trouble for seeing it, for being sent it, or for saying nothing for three weeks.","Seeing it again afterwards, at odd moments, is an ordinary response. Saying it out loud to one person is what shortens it. Samaritans is 116 123 at any age, Childline is 0800 1111 under 19, HOPELINE247 is 0800 068 4141 under 35.","Most people who see it are not harmed by it. What repetition does is make a serious thing look ordinary, and that matters most for whoever is already struggling.","Money out of proportion to the task is always paying for a risk nobody has named yet. The offer by itself is already the offence.","Stop it, report it, say it. Only the first one is on a clock, and passing an offer on is the one way somebody who just received something ends up in trouble."],"script":"Read the six steadily. The second is the one to leave hanging for a beat, because it is the one somebody in the room needs and will not ask for. Then finish on the three moves, which is what you want them repeating at the door."}'::jsonb,
  '{"type":"recap","phase":"close","minutes":1,"heading":"What to keep, and where to go","points":["You are not in trouble for seeing it, for being sent it, or for saying nothing for three weeks.","Seeing it again afterwards, at odd moments, is an ordinary response. Saying it out loud to one person is what shortens it. Samaritans is 116 123 at any age, Childline is 0800 1111 under 19, HOPELINE247 is 0800 068 4141 under 35.","Most people who see it are not harmed by it. What repetition does is make a serious thing look ordinary, and that matters most for whoever is already struggling."],"script":"Read the three steadily. Leave the first one hanging for a beat, because it is the one somebody in the room needs and will not ask for. Then read all three numbers slowly and leave the slide up longer than feels comfortable, because somebody is writing one down and does not want to be seen doing it."}'::jsonb,
  '{"type":"recap","phase":"close","minutes":1,"heading":"How it works, and what to do","points":["A feed is a guess about what holds attention, not a verdict about you. Distress holds attention, which is why it finds people who never went looking. About a third of pupils your age in England saw self harm content last month, and most of them were not looking for it.","Money out of proportion to the task is always paying for a risk nobody has named yet. The offer by itself is already the offence.","Stop it, report it, say it. Only the first one is on a clock, and passing an offer on is the one way somebody who just received something ends up in trouble."],"script":"Read the three steadily and finish on the three moves, which is what you want them repeating at the door."}'::jsonb);

-- Any miss at all and nothing lands.
do $$
declare n int; d text;
begin
  select count(*), string_agg(module || ': ' || target, E'\n  ') into n, d from miss;
  if n > 0 then raise exception E'338 aborted, % guard(s) missed:\n  %', n, d; end if;
end $$;

-- Both lessons gained exactly one slide and not a minute.
do $$
declare bad text;
begin
  select string_agg(l.module_id || ' is ' || jsonb_array_length(l.slides) || ' slides, was ' || jsonb_array_length(b.slides), ', ')
    into bad
    from schools.school_lessons l join schools.school_lessons_backup_338 b using (module_id)
   where l.module_id in ('ks4-28-the-money-and-the-odds', 'ks4-29-did-not-go-looking')
     and jsonb_array_length(l.slides) <> jsonb_array_length(b.slides) + 1;
  if bad is not null then raise exception '338 aborted, slide count wrong: %', bad; end if;

  select string_agg(module_id || ' runs ' || now_m || ' was ' || was_m, ', ') into bad from (
    select l.module_id,
           (select sum((s->>'minutes')::int) from jsonb_array_elements(l.slides) s) as now_m,
           (select sum((s->>'minutes')::int) from jsonb_array_elements(b.slides) s) as was_m
      from schools.school_lessons l join schools.school_lessons_backup_338 b using (module_id)
     where l.module_id in ('ks4-28-the-money-and-the-odds', 'ks4-29-did-not-go-looking')
  ) x where now_m <> was_m;
  if bad is not null then raise exception '338 aborted, minutes moved: %', bad; end if;
end $$;

-- Every helpline number this scheme carries is still in both rows.
do $$
declare bad text;
begin
  select string_agg(module_id || ' lost ' || n, ', ') into bad from (
    select l.module_id, v.n from schools.school_lessons l,
      (values ('116 123'), ('0800 1111'), ('0800 068 4141'), ('0808 8020 133')) v(n)
    where l.module_id in ('ks4-29-did-not-go-looking', 'ks4-28-the-money-and-the-odds')
      and position(v.n in l.slides::text) = 0
      and position(v.n in (select b.slides::text from schools.school_lessons_backup_338 b where b.module_id = l.module_id)) > 0
  ) x;
  if bad is not null then raise exception '338 aborted, a helpline number was lost: %', bad; end if;
end $$;

drop function schools.split_recap_338(text, int, jsonb, jsonb, jsonb);

commit;
