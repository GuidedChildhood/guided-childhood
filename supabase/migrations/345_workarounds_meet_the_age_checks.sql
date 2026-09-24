-- 345: The workarounds lesson meets the age checks.
--
-- The V1 evidence pass, 24 September 2026. ks3-11 was written before the
-- Online Safety Act child safety duties took effect in July 2025, and it said
-- the platform knows only the age you typed in. Many platforms now check age
-- with facial scans, ID or card checks, so it now says the age on your account,
-- and the teacher script says why the workarounds exist at all.
--
-- The statistic slide quoted an Ofcom figure from 2022 whose primary could not
-- be opened from the build environment (Ofcom refuses automated reads). It is
-- replaced by the government's own survey of 14 July 2026: 39 percent of 11 to
-- 17 year olds say they have got around an age check, most often by pretending
-- to be older, and half of those then came across harmful content.
--
-- Three smaller corrections: "reports from a child account are prioritised"
-- had no source and now says what the law requires (clear, easy reporting for
-- children); "its only job is to keep you there longer" now says what TikTok
-- says its feed does (ranks by predicted interest); and "millions of adults"
-- loses a number nobody checked.
--
-- Plus this module's four hard questions, never migrated from 21 September.
-- Guarded on the exact old text, evidence written only onto an empty base,
-- string hash recomputed on the server against the source JSON.

begin;

create table schools.school_lessons_backup_345 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_345 enable row level security;

create temp table miss(target text) on commit drop;

-- Swaps one string at a path. The md5 pins the whole old string, so it runs only against
-- the exact text this was written against; then the find text is replaced (it occurs once), or
-- with a null find the whole string is replaced.
create or replace function schools.swap_345(p_col text, p_path text[], p_md5 text, p_find text, p_rep text)
returns void language plpgsql as $fn$
declare cur text; nu text;
begin
  if p_col not in ('slides', 'teacher_notes', 'parent_note', 'dsl_note') then raise exception 'column %', p_col; end if;
  execute format('select %I #>> $1 from schools.school_lessons where module_id = $2', p_col) into cur using p_path, 'ks3-11-social-workarounds'::text;
  if cur is null or md5(cur) <> p_md5 or (p_find is not null and position(p_find in cur) = 0) then
    insert into miss values (p_col || '.' || array_to_string(p_path, '.') || ' is not the text this was written against');
    return;
  end if;
  nu := case when p_find is null then p_rep else replace(cur, p_find, p_rep) end;
  execute format('update schools.school_lessons set %I = jsonb_set(%I, $1, to_jsonb($2::text)) where module_id = $3', p_col, p_col)
    using p_path, nu, 'ks3-11-social-workarounds'::text;
end $fn$;

select schools.swap_345('slides', array['4', 'script'], '6a6e5a31325e4e9989280a85d92f735b',
  $f$A VPN is a normal tool millions of adults use for work every day.$f$,
  $r$A VPN is a normal tool lots of adults use for work every day.$r$);
select schools.swap_345('slides', array['4', 'words', '0', 'meaning'], 'ec46b6ed7545f27b9bd4ceedd0c826db',
  null,
  $r$The system that decides what your feed shows you next, picking what it predicts will keep you watching.$r$);
select schools.swap_345('teacher_notes', array['keywords', '0', 'definition'], 'ec46b6ed7545f27b9bd4ceedd0c826db',
  null,
  $r$The system that decides what your feed shows you next, picking what it predicts will keep you watching.$r$);
select schools.swap_345('slides', array['6', 'body'], '24a87863c6bf97e877d6a91e4bbf8854',
  null,
  $r$When you open an account, the platform builds a profile of you: the age on your account, what you watch, what you pause on, what you search late at night. The algorithm uses that profile to decide what you see next, picking whatever it predicts will keep you watching.$r$);
select schools.swap_345('slides', array['6', 'script'], '4fabcec28aac302d8dc7680fa07374bb',
  null,
  $r$Build the profile concretely: the age on your account, what you watch, what you pause on, what you search late at night. Then let the last line sit: it picks whatever it predicts will keep you watching.$r$);
select schools.swap_345('slides', array['7', 'body'], 'dcefe1588f1bbbe5ef2e16bf75340a16',
  $f$It knows the age you typed in, and it builds your entire world from that.$f$,
  $r$It knows the age on your account, and it builds your entire world from that.$r$);
select schools.swap_345('slides', array['7', 'script'], '451e1ddb7bb76c8542f27ef4cfbf95b0',
  $f$it knows the age you typed in, and it builds your world from that.$f$,
  $r$it knows the age on your account, and it builds your world from that. Since July 2025 many platforms check age with more than a typed birthday, which is exactly why the workarounds in this lesson exist.$r$);
select schools.swap_345('slides', array['9', 'steps', '2', 'text'], 'd6c7eb7f2d1be65aa605d24a4e2d335e',
  null,
  $r$Children must get clear, easy ways to report, and the help tools point you to real support.$r$);
select schools.swap_345('slides', array['10', 'claim'], 'f7ae5995535f3ba9b1a7b4d8360516c5',
  null,
  $r$In a 2026 government survey, 39 percent of young people aged 11 to 17 said they had got around an age check at least once, most often by pretending to be older.$r$);
select schools.swap_345('slides', array['10', 'figure'], '97eb0a10c2b6e6a6ffcdf83186d9c161',
  null,
  $r$39%$r$);
select schools.swap_345('slides', array['10', 'source'], 'a5cbcb714c07d88e3b4012ece64c97f8',
  null,
  $r$Department for Science, Innovation and Technology, Children's circumvention behaviours online, July 2026$r$);
select schools.swap_345('slides', array['10', 'script'], '1d797d4ed5fb72c0a4e712afde780b63',
  null,
  $r$Let the number land before you speak. Nearly two in five young people in this country say they have got past an age check, and pretending to be older is the most common way. Then the honest question: did those children become adults when they typed a different birthday? No. So what happened to the protections wired to their real age? Switched off, and nobody sent them a warning about it. Half of the ones who got round a check say they then came across harmful content. Nothing looked different that day. That is the trap.$r$);
select schools.swap_345('slides', array['11', 'options', '0', 'feedback'], '2d061d08a3684aba0b78b0dd55e96343',
  $f$filters, contact limits, prioritised reports and tuned recommendations$f$,
  $r$filters, contact limits, reporting built for children and tuned recommendations$r$);
select schools.swap_345('slides', array['13', 'body'], '1e056547f884317957fe11f0eb70b1d4',
  $f$Type an adult birthday and the filters relax, the contact limits drop, and the algorithm starts treating you as someone who can handle anything.$f$,
  $r$If an adult birthday gets through, the filters relax, the contact limits drop, and the algorithm starts treating you as an adult.$r$);
select schools.swap_345('slides', array['15', 'options', '1', 'feedback'], '7c8ed3bb3ce35bdfa5244bf4b5b68580',
  $f$and that one line switches off every child protection on the account.$f$,
  $r$and if that one line gets through, it switches off the child protections on the account.$r$);
select schools.swap_345('slides', array['22', 'config', 'posts', '0', 'why'], '55ba33bab2f6f3ed5e50b9157460d6d3',
  null,
  $r$The VPN dodges the age check and the adult birthday does the rest. If it gets through, that one line switches off the filters, the contact limits and the reporting built for children in a single move.$r$);
select schools.swap_345('teacher_notes', array['worksheet_items', '0', 'teaching_point'], '55ba33bab2f6f3ed5e50b9157460d6d3',
  null,
  $r$The VPN dodges the age check and the adult birthday does the rest. If it gets through, that one line switches off the filters, the contact limits and the reporting built for children in a single move.$r$);
select schools.swap_345('teacher_notes', array['misconceptions', '1'], '3db5778cc8dba5f45d519078ee72c04e',
  $f$with filters, contact limits and prioritised reporting wired to it$f$,
  $r$with filters, contact limits and reporting built for children wired to it$r$);
select schools.swap_345('teacher_notes', array['exit_quiz', '1', 'answer'], 'cfc9fc19b6c131dd6416f99f5f2a6d22',
  null,
  $r$To treat you as an adult, and if it gets through, it will.$r$);
select schools.swap_345('teacher_notes', array['key_learning_points', '2'], 'c92e1ae2b29e383d843dc86c6d5cedea',
  null,
  $r$A false age tells the machine to treat you as an adult, and if it gets through, it will.$r$);

-- The hard questions written on 21 September reached content/modules and never production.
do $$ begin
  if (select teacher_notes ? 'hard_questions' from schools.school_lessons where module_id = 'ks3-11-social-workarounds') then
    insert into miss values ('hard_questions already present, refusing to overwrite');
  end if;
end $$;
update schools.school_lessons l
   set teacher_notes = l.teacher_notes || jsonb_build_object('hard_questions', $hq$[{"question":"Is a VPN illegal?","answer":"No, and plenty of people use one for good reasons. The question this lesson asks is narrower. When you use one to get around an age check, which specific protection did you just step outside, and would you have chosen that if somebody had named it?"},{"question":"Age rules just exist to keep us off the internet.","answer":"The rule is the visible bit. Behind it sit things like what gets recommended to you, who can message you, and what happens when you report something. Those are what you lose, and nobody mentions them at the sign up screen."},{"question":"It is my cousin's account, so it is safe.","answer":"Trusting your cousin is not the issue. The account is set up as an adult, so the platform treats you as one: adult recommendations, adult contact settings, adult reporting. The protection was never about who handed you the password."},{"question":"Everyone does it.","answer":"A lot of people do, and I am not going to pretend otherwise. This lesson is not asking you to be the only one who does not. It is asking you to know what you are giving up, so it is a decision rather than a default."}]$hq$::jsonb)
 where l.module_id = 'ks3-11-social-workarounds' and not (l.teacher_notes ? 'hard_questions');

-- The evidence base is written only onto an empty one, never over real rows.
do $$
declare n int;
begin
  select coalesce(jsonb_array_length(l.teacher_notes->'evidence_base'), 0) into n
    from schools.school_lessons l where l.module_id = 'ks3-11-social-workarounds';
  if n <> 0 then insert into miss values ('evidence_base already has ' || n || ' rows, refusing to overwrite'); end if;
end $$;
update schools.school_lessons l
   set teacher_notes = jsonb_set(coalesce(l.teacher_notes, '{}'::jsonb), '{evidence_base}', $ev$[{"claim":"In a 2026 government survey, 39 percent of young people aged 11 to 17 said they had got around an age check at least once, most often by pretending to be older.","source":"Department for Science, Innovation and Technology, Children's circumvention behaviours online, research by BMG, published 14 July 2026. 2,299 young people aged 11 to 17 across the UK, surveyed in May 2026. Of those who had got round a check, 63 percent had pretended to be someone else, most often with a false date of birth, and 41 percent of them did it to get onto social media they were too young for. 51 percent said they came across harmful content after getting round a check. Self reported, so the true figures could be higher or lower.","status":"verified"},{"claim":"Behind the age setting sit real protections: strangers kept out of your messages, harmful content filtered harder, and feeds that are meant to stop pushing harmful content at a child.","source":"GOV.UK, Keeping children safe online: changes to the Online Safety Act explained, Department for Science, Innovation and Technology, 1 August 2025: under Ofcom's codes platforms must make sure strangers have no way of messaging children, children should not be recommended accounts to connect with, and platforms check ages with methods like facial scans, photo ID and credit card checks. The government's Online Safety Act explainer adds that children must have clear ways to report problems, and that the law treats an algorithm repeatedly pushing content at a child as one way harm happens.","status":"verified"},{"claim":"Instagram's own teen settings are one example of what an age setting switches on.","source":"Meta, Introducing Instagram Teen Accounts, September 2024, updated 2025: teen accounts are private by default, teens can only be messaged by people they follow or are already connected to, and they are placed in the most restrictive sensitive content setting. Meta also says teens may lie about their age, and that it is building technology to find teen accounts that list an adult birthday. One platform's own description; others differ.","status":"verified"},{"claim":"Platforms face serious fines when their protections fail.","source":"Online Safety Act 2023, Schedule 13, paragraph 4: a penalty of up to £18 million or 10 percent of qualifying worldwide revenue, whichever is greater.","status":"verified"},{"claim":"The feed picks whatever it predicts you will keep watching.","source":"TikTok, How TikTok recommends videos #ForYou: videos are ranked by how likely you are to be interested, and finishing a longer video is weighted as a strong signal. The platform's own description of its system.","status":"mechanism"},{"claim":"A VPN is legal in the UK. The risk in this lesson is what it gets used to switch off.","source":"GOV.UK, Keeping children safe online: changes to the Online Safety Act explained, 1 August 2025: VPNs are legal in the UK, and platforms have a clear responsibility to prevent children from bypassing safety protections.","status":"verified"},{"claim":"The lesson says the age on your account, not the age you typed in.","source":"Since the Online Safety Act child safety duties took effect in July 2025, many platforms check age with more than a typed birthday. The 2026 survey above found 45 percent of 11 to 17 year olds had met a check such as facial age estimation, ID upload or a card check.","status":"Changed on 24 September 2026 after checking: the earlier wording assumed a typed birthday was the only check. The trade the lesson teaches is unchanged, because a workaround that gets through still switches the protections off."}]$ev$::jsonb, true)
 where l.module_id = 'ks3-11-social-workarounds' and coalesce(jsonb_array_length(l.teacher_notes->'evidence_base'), 0) = 0;

do $$
declare n int; d text;
begin
  select count(*), string_agg(target, E'\n  ') into n, d from miss;
  if n > 0 then raise exception E'345 aborted, % guard(s) missed:\n  %', n, d; end if;
end $$;

-- Nothing moved in any other module.
do $$
declare bad text;
begin
  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join schools.school_lessons_backup_345 b on b.module_id = l.module_id
   where l.module_id <> 'ks3-11-social-workarounds'
     and (l.slides is distinct from b.slides or l.teacher_notes is distinct from b.teacher_notes
          or l.parent_note is distinct from b.parent_note or l.dsl_note is distinct from b.dsl_note
          or l.assessment is distinct from b.assessment or l.video_beats is distinct from b.video_beats
          or l.evidence_anchor is distinct from b.evidence_anchor);
  if bad is not null then raise exception '345 aborted, other modules moved: %', bad; end if;
end $$;

-- And this module now matches content/modules/ks3-11-social-workarounds.json string for string:
-- 31 slides, 465 strings, multiset hash 7fc44828825c745cc66f3839cb5ab724 (scripts/module-string-hash.mjs).
do $$
declare got_hash text; got_n int; got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
  from (
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x
    where l.module_id = 'ks3-11-social-workarounds' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x
    where l.module_id = 'ks3-11-social-workarounds' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x
    where l.module_id = 'ks3-11-social-workarounds' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x
    where l.module_id = 'ks3-11-social-workarounds' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x
    where l.module_id = 'ks3-11-social-workarounds' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x
    where l.module_id = 'ks3-11-social-workarounds' and jsonb_typeof(x) = 'string'
    union all
    select module_id from schools.school_lessons where module_id = 'ks3-11-social-workarounds'
    union all
    select title from schools.school_lessons where module_id = 'ks3-11-social-workarounds'
    union all
    select key_stage from schools.school_lessons where module_id = 'ks3-11-social-workarounds'
    union all
    select year_band from schools.school_lessons where module_id = 'ks3-11-social-workarounds'
    union all
    select audience from schools.school_lessons where module_id = 'ks3-11-social-workarounds'
    union all
    select evidence_anchor from schools.school_lessons where module_id = 'ks3-11-social-workarounds'
    union all
    select single_action_outcome from schools.school_lessons where module_id = 'ks3-11-social-workarounds'
    union all
    select character_cast from schools.school_lessons where module_id = 'ks3-11-social-workarounds'
    union all
    select scaffold from schools.school_lessons where module_id = 'ks3-11-social-workarounds'
    union all
    select unnest(statutory_hooks) from schools.school_lessons where module_id = 'ks3-11-social-workarounds'
    union all
    select unnest(ailit_domains) from schools.school_lessons where module_id = 'ks3-11-social-workarounds'
  ) q;
  select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = 'ks3-11-social-workarounds';
  if got_hash is distinct from '7fc44828825c745cc66f3839cb5ab724' or got_n <> 465 or got_slides <> 31 then
    raise exception '345 aborted, ks3-11-social-workarounds does not match its source JSON: % strings, hash %', got_n, got_hash;
  end if;
end $$;

drop function schools.swap_345(text, text[], text, text, text);

commit;
