-- 337: the helpline hotfix. Three slides, so a child can read the number.
--
-- FOUND 22 September 2026 by measuring, on a 1920x1080 wall, where the DIGITS
-- of every helpline in the scheme sit relative to the fold. Five dialable
-- numbers were below it. The teacher scripts make clear this is not cosmetic:
--
--   ks4-29 s14  "Read all three numbers slowly and leave the slide up far
--               longer than feels comfortable, because somebody is writing one
--               down and does not want to be seen doing it."
--   ks4-28 s28  "the number is the only thing on this slide somebody in the
--               room may actually need, and a second of silence is what gives
--               them time to write it down."
--
-- The wall is the surface a pupil copies the number from, by design, and on
-- these slides the number was not on it. There is no worksheet or print route
-- carrying them: the slides are the only pupil facing place they exist.
--
-- ORDERED BY HOW LITTLE CURRICULUM IT TOUCHES. Two of the three change no
-- words at all.
--
--   1. ks4-29-did-not-go-looking s28  reorder, NO WORDS CHANGE
--      The helpline point sat 4th of 6 and started below the fold. Moved to
--      3rd, the only slot the script allows: it says "the second is the one to
--      leave hanging" so point 2 is fixed, and "finish on the three moves" so
--      point 6 is fixed. Reading order becomes: you are not in trouble, here
--      is where to go, most people are not harmed.
--
--   2. ks4-28-the-money-and-the-odds s19  drop verdicts, NO WORDS CHANGE
--      The three chips read "Lock it | Tell someone | Free help", character for
--      character the three step titles directly above them.
--
--   3. ks4-28-the-money-and-the-odds s19  steps[2] text and script
--      The NHS clinic sentence sat between the two numbers and pushed
--      Childline's under the fold. Moved into the script so the teacher says
--      it; it also remains in teacher_notes.evidence_base, verified. Both
--      numbers and the no minimum age line stay on the wall.
--
--   4. ks4-29-did-not-go-looking s14  body, two phrases of flourish
--      The only words cut. Over by 5px, so HOPELINE247's number sat in the
--      fade. Cut "to something out of the ordinary" and "which breaks the
--      private loop". Kept whole: all three numbers, every age rule, "not on
--      the phone bill", and both reassurances.
--
-- VERIFIED AFTER, by re-measuring the digits: 5 numbers below the fold became
-- 1. The one left is ks4-28-the-money-and-the-odds s28, where the number is
-- deliberately the closing point of a six point recap and cannot be reordered
-- without breaking the script. That one needs a curriculum decision and is
-- deliberately NOT in this migration.
--
-- Every edit guards on the exact text it replaces, so a replay aborts rather
-- than writing twice.

begin;

create table schools.school_lessons_backup_337 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_337 enable row level security;

create temp table miss(module text, target text);

-- A string at a path, proven by the slide's identity and its exact current text.
create or replace function schools.helpline_set_337(p_module text, p_pos int, p_ident text, p_path text[], p_expect text, p_new text)
returns void language plpgsql as $$
declare cur text; have text;
begin
  select (l.slides->p_pos->>'type') || ':' || coalesce(l.slides->p_pos->>'heading', l.slides->p_pos->>'title', l.slides->p_pos->>'question', l.slides->p_pos->>'prompt', l.slides->p_pos->>'component', '')
    into have from schools.school_lessons l where l.module_id = p_module;
  if have is distinct from p_ident then insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' is ' || coalesce(have, 'absent') || ', expected ' || p_ident); return; end if;
  select l.slides #>> (array[p_pos::text] || p_path) into cur from schools.school_lessons l where l.module_id = p_module;
  if cur is null or cur <> p_expect then insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' ' || array_to_string(p_path, '/') || ' is not the expected text'); return; end if;
  update schools.school_lessons l set slides = jsonb_set(l.slides, array[p_pos::text] || p_path, to_jsonb(p_new)) where l.module_id = p_module;
end $$;

-- A whole json array replaced, guarded on the exact current array. Used for the
-- recap reorder, where every string is identical and only the order moves, so
-- the guard also proves nothing was rewritten in passing.
create or replace function schools.helpline_arr_337(p_module text, p_pos int, p_ident text, p_key text, p_expect jsonb, p_new jsonb)
returns void language plpgsql as $$
declare cur jsonb; have text;
begin
  select (l.slides->p_pos->>'type') || ':' || coalesce(l.slides->p_pos->>'heading', l.slides->p_pos->>'title', '')
    into have from schools.school_lessons l where l.module_id = p_module;
  if have is distinct from p_ident then insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' is ' || coalesce(have, 'absent') || ', expected ' || p_ident); return; end if;
  select l.slides->p_pos->p_key into cur from schools.school_lessons l where l.module_id = p_module;
  if cur is null or cur <> p_expect then insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' ' || p_key || ' is not the expected array'); return; end if;
  -- Same multiset in, same multiset out: a reorder must never lose a point.
  if (select count(*) from jsonb_array_elements_text(p_expect)) <> (select count(*) from jsonb_array_elements_text(p_new))
     or exists (select 1 from jsonb_array_elements_text(p_expect) e where e not in (select * from jsonb_array_elements_text(p_new)))
  then insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' ' || p_key || ' reorder changes the contents'); return; end if;
  update schools.school_lessons l set slides = jsonb_set(l.slides, array[p_pos::text, p_key], p_new) where l.module_id = p_module;
end $$;

-- A key removed, guarded on its exact current value.
create or replace function schools.helpline_drop_337(p_module text, p_pos int, p_ident text, p_key text, p_expect jsonb)
returns void language plpgsql as $$
declare cur jsonb; have text;
begin
  select (l.slides->p_pos->>'type') || ':' || coalesce(l.slides->p_pos->>'heading', l.slides->p_pos->>'title', '')
    into have from schools.school_lessons l where l.module_id = p_module;
  if have is distinct from p_ident then insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' is ' || coalesce(have, 'absent') || ', expected ' || p_ident); return; end if;
  select l.slides->p_pos->p_key into cur from schools.school_lessons l where l.module_id = p_module;
  if cur is null or cur <> p_expect then insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' ' || p_key || ' is not the expected value'); return; end if;
  update schools.school_lessons l set slides = jsonb_set(l.slides, array[p_pos::text], (l.slides->p_pos) - p_key) where l.module_id = p_module;
end $$;


-- 1. ks4-29-did-not-go-looking s28: the helpline point moves from 4th to 3rd. No words change.
select schools.helpline_arr_337('ks4-29-did-not-go-looking', 27, 'recap:What to keep', 'points',
  '["A feed is a guess about what holds attention, not a verdict about you. Distress holds attention, which is why it finds people who never went looking. About a third of pupils your age in England saw self harm content last month, and most of them were not looking for it.","You are not in trouble for seeing it, for being sent it, or for saying nothing for three weeks.","Most people who see it are not harmed by it. What repetition does is make a serious thing look ordinary, and that matters most for whoever is already struggling.","Seeing it again afterwards, at odd moments, is an ordinary response. Saying it out loud to one person is what shortens it. Samaritans is 116 123 at any age, Childline is 0800 1111 under 19, HOPELINE247 is 0800 068 4141 under 35.","Money out of proportion to the task is always paying for a risk nobody has named yet. The offer by itself is already the offence.","Stop it, report it, say it. Only the first one is on a clock, and passing an offer on is the one way somebody who just received something ends up in trouble."]'::jsonb,
  '["A feed is a guess about what holds attention, not a verdict about you. Distress holds attention, which is why it finds people who never went looking. About a third of pupils your age in England saw self harm content last month, and most of them were not looking for it.","You are not in trouble for seeing it, for being sent it, or for saying nothing for three weeks.","Seeing it again afterwards, at odd moments, is an ordinary response. Saying it out loud to one person is what shortens it. Samaritans is 116 123 at any age, Childline is 0800 1111 under 19, HOPELINE247 is 0800 068 4141 under 35.","Most people who see it are not harmed by it. What repetition does is make a serious thing look ordinary, and that matters most for whoever is already struggling.","Money out of proportion to the task is always paying for a risk nobody has named yet. The offer by itself is already the offence.","Stop it, report it, say it. Only the first one is on a clock, and passing an offer on is the one way somebody who just received something ends up in trouble."]'::jsonb);

-- 2. ks4-28-the-money-and-the-odds s19: the three chips repeat the three step titles verbatim.
select schools.helpline_drop_337('ks4-28-the-money-and-the-odds', 18, 'diagram:Where to take it', 'verdicts',
  '["Lock it","Tell someone","Free help"]'::jsonb);

-- 3. ks4-28-the-money-and-the-odds s19 steps[2] text: the NHS sentence moves off the wall.
select schools.helpline_set_337('ks4-28-the-money-and-the-odds', 18, 'diagram:Where to take it', array['steps','2','text']::text[],
  'The National Gambling Helpline is free on 0808 8020 133, day or night, and it has no minimum age. There is an NHS clinic in England for this that takes people from thirteen. Childline is free on 0800 1111.',
  'The National Gambling Helpline is free on 0808 8020 133, day or night, and it has no minimum age. Childline is free on 0800 1111.');

-- 3b. ks4-28-the-money-and-the-odds s19 script: the teacher says the NHS clinic instead.
select schools.helpline_set_337('ks4-28-the-money-and-the-odds', 18, 'diagram:Where to take it', array['script']::text[],
  'Walk the three. Be specific on the middle one: say the actual role and, if you can, the actual name, because a pupil who has to work out who to tell usually tells nobody. On the third, say the no minimum age part out loud, because every pupil in the room assumes a gambling helpline is for adults and that assumption is the barrier. Read both numbers slowly and leave the slide up longer than feels necessary, because somebody is writing one down and will not want to be seen doing it. Worth knowing yourself: Childline does not appear on a bill, and it can still sit in the call history on the handset, which Childline''s own advice tells young people to clear.',
  'Walk the three. Be specific on the middle one: say the actual role and, if you can, the actual name, because a pupil who has to work out who to tell usually tells nobody. On the third, say the no minimum age part out loud, because every pupil in the room assumes a gambling helpline is for adults and that assumption is the barrier. Read both numbers slowly and leave the slide up longer than feels necessary, because somebody is writing one down and will not want to be seen doing it. Say the NHS clinic part rather than reading it off the wall: there is a clinic in England for this that takes people from thirteen. It is off the slide on purpose, because the two numbers are what somebody needs to copy down and they have to be on screen to do it. Worth knowing yourself: Childline does not appear on a bill, and it can still sit in the call history on the handset, which Childline''s own advice tells young people to clear.');

-- 4. ks4-29-did-not-go-looking s14 body: two phrases of flourish, no number touched.
select schools.helpline_set_337('ks4-29-did-not-go-looking', 13, 'concept:What helps afterwards', array['body']::text[],
  'Seeing something you were not ready for can keep coming back, uninvited. That is an ordinary response to something out of the ordinary. It is not weakness, and not a sign anything is wrong with you. Two things shorten it: saying it out loud to one person, which breaks the private loop, and knowing the free routes are there if it does not fade. Samaritans on 116 123, any age, day or night, not on the phone bill. Childline on 0800 1111 for under 19s. HOPELINE247 on 0800 068 4141 for anyone under 35, or worried about somebody else.',
  'Seeing something you were not ready for can keep coming back, uninvited. That is an ordinary response. It is not weakness, and not a sign anything is wrong with you. Two things shorten it: saying it out loud to one person, and knowing the free routes are there if it does not fade. Samaritans on 116 123, any age, day or night, not on the phone bill. Childline on 0800 1111 for under 19s. HOPELINE247 on 0800 068 4141 for anyone under 35, or worried about somebody else.');

-- Any miss at all and nothing lands.
do $$
declare n int; d text;
begin
  select count(*), string_agg(module || ': ' || target, E'\n  ') into n, d from miss;
  if n > 0 then raise exception E'337 aborted, % guard(s) missed:\n  %', n, d; end if;
end $$;

-- Every number this migration exists to protect is still in the row.
do $$
declare bad text;
begin
  select string_agg(module_id || ' lost ' || n, ', ') into bad from (
    select l.module_id, v.n from schools.school_lessons l,
      (values ('116 123'), ('0800 1111'), ('0800 068 4141'), ('0808 8020 133')) v(n)
    where l.module_id in ('ks4-29-did-not-go-looking', 'ks4-28-the-money-and-the-odds')
      and position(v.n in l.slides::text) = 0
      and position(v.n in (select b.slides::text from schools.school_lessons_backup_337 b where b.module_id = l.module_id)) > 0
  ) x;
  if bad is not null then raise exception '337 aborted, a helpline number was lost: %', bad; end if;
end $$;

drop function schools.helpline_set_337(text, int, text, text[], text, text);
drop function schools.helpline_arr_337(text, int, text, text, jsonb, jsonb);
drop function schools.helpline_drop_337(text, int, text, text, jsonb);

commit;
