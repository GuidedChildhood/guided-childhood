-- 321: the keyword meanings the wall could not see
--
-- Eight lessons written since 11 September store each keyword's meaning under
-- "definition"; the keywords slide draws w.meaning and the vocabulary page maps
-- w.meaning, so those classes saw the words and no meaning, and the council's
-- blocks check counted the missing meanings as nothing to measure. Found by
-- scripts/check-lesson-rubric.mjs on 20 September 2026; the rename is done
-- here and in content/modules by scripts/gen-321.mjs, and contract rule 14
-- keeps it from recurring.
--
-- Every rename is guarded: the slide must be the keywords slide, every word
-- must carry exactly the definition text the file has and no meaning yet. Any
-- miss aborts the whole migration.
--
-- THE LESSONS (8): ks2-23-when-a-machine-talks-like-a-friend, ks2-25-stay-the-maker, ks2-26-why-thirteen, ks3-22-when-an-ai-acts-like-a-friend, ks3-24-is-it-doing-my-thinking, ks3-27-when-it-turns-on-you, ks4-28-the-money-and-the-odds, ks4-29-did-not-go-looking

begin;

create table schools.school_lessons_backup_321 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_321 enable row level security;

create temp table miss(module text, target text);

create or replace function schools.rename_keyword_meanings_321(p_module text, p_pos int, p_expect jsonb)
returns void language plpgsql as $$
declare have jsonb; renamed jsonb;
begin
  select l.slides->p_pos->'words' into have from schools.school_lessons l where l.module_id = p_module and l.slides->p_pos->>'type' = 'keywords';
  if have is null then insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' is not the keywords slide'); return; end if;
  if (select jsonb_agg(jsonb_build_object('word', w->>'word', 'definition', w->>'definition')) from jsonb_array_elements(have) w) is distinct from p_expect
     or exists (select 1 from jsonb_array_elements(have) w where w ? 'meaning') then
    insert into miss values (p_module, 'slide ' || (p_pos + 1) || ' words are not the expected definitions'); return;
  end if;
  select jsonb_agg((w - 'definition') || jsonb_build_object('meaning', w->'definition')) into renamed from jsonb_array_elements(have) w;
  update schools.school_lessons l set slides = jsonb_set(l.slides, array[p_pos::text, 'words'], renamed) where l.module_id = p_module;
end $$;

select schools.rename_keyword_meanings_321('ks2-23-when-a-machine-talks-like-a-friend', 4, '[{"word":"programmed","definition":"Somebody wrote the instructions telling it what to say."},{"word":"alive","definition":"Grows, needs food and rest, and feels things."},{"word":"remember","definition":"A machine can store what you typed. Storing is not knowing."},{"word":"trusted adult","definition":"A grown up you can tell anything to and never be in trouble."}]'::jsonb);
select schools.rename_keyword_meanings_321('ks2-25-stay-the-maker', 4, '[{"word":"maker","definition":"The person who made it. Not the person who asked for it. If you can explain how it works and why, you are the maker."},{"word":"helper","definition":"Something that helps you do a job. A ruler, a dictionary, a grown up, a computer. A helper does not take the job away from you."},{"word":"stuck","definition":"When you cannot see what to do next. Being stuck is normal and it is not a problem. Staying stuck for ages is the problem."}]'::jsonb);
select schools.rename_keyword_meanings_321('ks2-26-why-thirteen', 4, '[{"word":"age rule","definition":"A number on an app, a game or a website saying who it was built for. It is not a guess. Somebody chose it, for a reason."},{"word":"protection","definition":"Something switched on to keep you safer. The best ones work quietly, so you never notice they are there."},{"word":"shield","definition":"Everything the app switches on when it believes you are a child. Your age is what holds the shield up."}]'::jsonb);
select schools.rename_keyword_meanings_321('ks3-22-when-an-ai-acts-like-a-friend', 4, '[{"word":"companion app","definition":"An app built so talking to it feels like talking to a person."},{"word":"personalisation","definition":"The product changing to fit you, using what you told it."},{"word":"agreeable","definition":"Going along with what you say. It is a setting, not a personality."},{"word":"confide","definition":"To tell someone private because you trust them."}]'::jsonb);
select schools.rename_keyword_meanings_321('ks3-24-is-it-doing-my-thinking', 4, '[{"word":"offload","definition":"To hand a job to something outside your head. A calculator, a note, a friend, a chatbot. Offloading is not cheating. Everybody does it every day."},{"word":"fluent","definition":"Smooth and easy. Watch this one. Work that feels smooth while you do it is often the work you remember least."},{"word":"calibrated","definition":"When how sure you feel matches how right you actually are. Today you find out whether yours is."}]'::jsonb);
select schools.rename_keyword_meanings_321('ks3-27-when-it-turns-on-you', 4, '[{"word":"escalate","definition":"To get bigger and harder to stop. Online conflict escalates by default, which is a fact about the place rather than about the people."},{"word":"harassment","definition":"Behaviour aimed at one person that keeps going after they have made it clear they want it to stop. The repeat is what makes it harassment."},{"word":"coercive control","definition":"Where one person steadily takes another person''s choices away. Who they talk to, where they go, what they post. It is a pattern, not a row."},{"word":"bystander","definition":"Anyone who can see it happening. There is no neutral seat: watching and saying nothing is a choice the machine counts."}]'::jsonb);
select schools.rename_keyword_meanings_321('ks4-28-the-money-and-the-odds', 4, '[{"word":"house edge","definition":"The share of everything staked that the operator keeps on average. It is fixed, it is published, and it does not care whether you are lucky today."},{"word":"near miss","definition":"A result built to look like you almost won. Two matching symbols and the third just above the line. It is not close. It is a loss, styled."},{"word":"chasing","definition":"Staking again to win back what you just lost. It is the clearest single sign that something has stopped being a game."},{"word":"loot box","definition":"Paying for a sealed item without knowing what is inside until it opens. Money in, chance out, and the same price either way."}]'::jsonb);
select schools.rename_keyword_meanings_321('ks4-29-did-not-go-looking', 4, '[{"word":"recommender","definition":"The system that chooses what appears next in a feed. It is not a list of what you asked for. It is a guess about what will keep you there."},{"word":"normalise","definition":"To make something come to seem ordinary by seeing it often. It happens without permission and without being noticed, which is what makes it worth knowing about."},{"word":"exploitation","definition":"Being used by somebody who is getting something out of you. The offer usually looks like an opportunity first, and it is meant to."},{"word":"county lines","definition":"Drug supply organised across areas using young people to carry and sell. Recruitment often starts as a friendly message about easy money."}]'::jsonb);

do $$
declare n int; list text;
begin
  select count(*), string_agg(module || ' / ' || target, '; ') into n, list from miss;
  if n > 0 then raise exception 'MIGRATION ABORTED. % target(s) not as expected: %', n, list; end if;
end $$;

-- ── the proof: every keyword on every keywords slide in the scheme has a meaning and no definition ──
do $$
declare cnt int; list text;
begin
  select count(*), string_agg(distinct l.module_id, '; ') into cnt, list
  from schools.school_lessons l, jsonb_array_elements(l.slides) s, jsonb_array_elements(s->'words') w
  where s->>'type' = 'keywords' and (w ? 'definition' or coalesce(btrim(w->>'meaning'), '') = '');
  if cnt > 0 then raise exception 'MIGRATION ABORTED. % keyword(s) still without a meaning the wall draws: %', cnt, list; end if;
end $$;

-- ── the proof: the eight rows equal their files in content/modules, string for string ──
-- The same multiset hash scripts/module-string-hash.mjs computes from each
-- file (a rename moves no string, so the hash is the pre and the post state),
-- in one loop rather than eight copies of the query so the migration stays
-- small enough to carry.
do $$
declare got_hash text; got_n int; got_slides int; m record;
begin
  for m in select * from (values
    ('ks2-23-when-a-machine-talks-like-a-friend', 33, 543, '37a47980206aa2c3c87b7e1fe7d10897'),
    ('ks2-25-stay-the-maker', 31, 472, 'ea2f2b8a634e8529d4f18e848f5b096c'),
    ('ks2-26-why-thirteen', 31, 441, '264587c87b256b7d2dec1bb1e8d9facd'),
    ('ks3-22-when-an-ai-acts-like-a-friend', 31, 526, '15bf5a28099271214069c4e1e7ae2990'),
    ('ks3-24-is-it-doing-my-thinking', 31, 486, '5a7ff4be39bf9f469b3edf7aa294d151'),
    ('ks3-27-when-it-turns-on-you', 31, 446, '22385dc9bbdb4c7a1092e91a16222ca9'),
    ('ks4-28-the-money-and-the-odds', 31, 481, '586b102ed9901b83f154432460c1fbaa'),
    ('ks4-29-did-not-go-looking', 31, 481, '15c6256c30c61ab88730157537eaa707')
  ) as t(module_id, slides, strings, hash)
  loop
    select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
    from (
      select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x where l.module_id = m.module_id and jsonb_typeof(x) = 'string'
      union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x where l.module_id = m.module_id and jsonb_typeof(x) = 'string'
      union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x where l.module_id = m.module_id and jsonb_typeof(x) = 'string'
      union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x where l.module_id = m.module_id and jsonb_typeof(x) = 'string'
      union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x where l.module_id = m.module_id and jsonb_typeof(x) = 'string'
      union all select x #>> '{}' from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x where l.module_id = m.module_id and jsonb_typeof(x) = 'string'
      union all select module_id from schools.school_lessons where module_id = m.module_id
      union all select title from schools.school_lessons where module_id = m.module_id
      union all select key_stage from schools.school_lessons where module_id = m.module_id
      union all select year_band from schools.school_lessons where module_id = m.module_id
      union all select audience from schools.school_lessons where module_id = m.module_id
      union all select evidence_anchor from schools.school_lessons where module_id = m.module_id
      union all select single_action_outcome from schools.school_lessons where module_id = m.module_id
      union all select character_cast from schools.school_lessons where module_id = m.module_id
      union all select scaffold from schools.school_lessons where module_id = m.module_id
      union all select unnest(statutory_hooks) from schools.school_lessons where module_id = m.module_id
      union all select unnest(ailit_domains) from schools.school_lessons where module_id = m.module_id
    ) q;
    select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = m.module_id;
    if got_slides is distinct from m.slides or got_n is distinct from m.strings or got_hash is distinct from m.hash then
      raise exception '321_keyword_meanings_on_the_wall: % is not intact (slides %, strings %, hash %)', m.module_id, got_slides, got_n, got_hash;
    end if;
  end loop;
end $$;

commit;
