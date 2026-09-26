-- 352: The privacy lesson says what the apps actually do.
--
-- The V1 evidence pass, 25 September 2026. ks2-07 had no evidence panel, and
-- every line about apps was checked against the company's own help pages,
-- because a ten year old knows how Snapchat behaves:
--   screenshots  "you will never know they did"; Snapchat tells the sender,
--                and Instagram blocks screenshots of disappearing photos. It now
--                says some apps tell you, and nobody can stop a second phone.
--   delete       "only removes it from YOUR view"; unsend and delete for
--                everyone exist. It now says they cannot reach a screenshot, a
--                save or a forward, and the poster demo shows exactly that.
--   the company  "still holds it"; Instagram keeps deleted posts for 30 days.
--   passwords    pet name, street and favourite teacher "unlock passwords";
--                the NCSC names a first pet's name as a security question, and
--                nothing sources the favourite teacher, so the line keeps the
--                pet and adds the NCSC's own fix, a second check.
--   location     "a location switch in most apps"; it is the camera setting. The
--                privacy half stays, said as what the settings do (ICO code,
--                standard 7), because it is the RSHE requirement this slide covers.
--   who looks    secondary schools, clubs and teams had no source; employers
--                do (YouGov, 2017), so the garden keeps only the employer.
--   strangers    "most of what goes wrong involves somebody known"; ONS says
--                most children bullied online named someone from their school.
--
-- Plus this module's four hard questions, never migrated from 21 September.
-- Guarded on the exact old text of every string it changes, evidence written
-- only onto an empty base, string hash recomputed on the server against the
-- source JSON, so the row matches content/modules exactly or nothing commits.

begin;

create table schools.school_lessons_backup_352 as select * from schools.school_lessons;
alter table schools.school_lessons_backup_352 enable row level security;

create temp table miss(target text) on commit drop;

-- Swaps one string at a path. The md5 pins the whole old string, so it runs only against
-- the exact text this was written against; then the find text is replaced (it occurs once), or
-- with a null find the whole string is replaced.
create or replace function schools.swap_352(p_col text, p_path text[], p_md5 text, p_find text, p_rep text)
returns void language plpgsql as $fn$
declare cur text; nu text;
begin
  if p_col not in ('slides', 'teacher_notes', 'parent_note', 'dsl_note') then raise exception 'column %', p_col; end if;
  execute format('select %I #>> $1 from schools.school_lessons where module_id = $2', p_col) into cur using p_path, 'ks2-07-privacy-reputation'::text;
  if cur is null or md5(cur) <> p_md5 or (p_find is not null and position(p_find in cur) = 0) then
    insert into miss values (p_col || '.' || array_to_string(p_path, '.') || ' is not the text this was written against');
    return;
  end if;
  nu := case when p_find is null then p_rep else replace(cur, p_find, p_rep) end;
  execute format('update schools.school_lessons set %I = jsonb_set(%I, $1, to_jsonb($2::text)) where module_id = $3', p_col, p_col)
    using p_path, nu, 'ks2-07-privacy-reputation'::text;
end $fn$;

select schools.swap_352('slides', array['4', 'words', '1', 'meaning'], '6ffecae6280ffffd21fdf9ac6774fe79',
  null,
  $r$A photo of a screen. Some apps tell you when someone takes one, but nobody can stop a person photographing a screen with another phone.$r$);
select schools.swap_352('teacher_notes', array['keywords', '1', 'definition'], '6ffecae6280ffffd21fdf9ac6774fe79',
  null,
  $r$A photo of a screen. Some apps tell you when someone takes one, but nobody can stop a person photographing a screen with another phone.$r$);
select schools.swap_352('slides', array['12', 'steps', '2', 'text'], '5e35dee2f4d94c7e180366135ae91ac7',
  null,
  $r$Some apps send an alert and some do not. Nothing can stop a photo of the screen taken on another phone.$r$);
select schools.swap_352('teacher_notes', array['key_learning_points', '2'], '010531c8e7c9bf83c6122f5d84d5e092',
  null,
  $r$Anyone can copy anything you send, with a screenshot or another phone, and you may never know.$r$);
select schools.swap_352('slides', array['5', 'options', '0', 'feedback'], '9b1ada6f321aa77ca55e56d46fcc9473',
  $f$That loop never switches off,$f$,
  $r$That loop keeps going unless someone changes the settings,$r$);
select schools.swap_352('slides', array['8', 'steps', '2', 'text'], 'e591dd09a2b98b2741d2bc2bbdaf9617',
  null,
  $r$Passwords, and the secret questions that get you back into an account, like your first pet's name.$r$);
select schools.swap_352('slides', array['16', 'script'], '455ac8d0b61a4dba9ebf25379fd68b2e',
  $f$pet name, street, favourite teacher are the exact backup questions that unlock forgotten passwords.$f$,
  $r$a first pet's name is a common secret question for getting back into an account, and where you live is the kind of fact used to pretend to be you.$r$);
select schools.swap_352('slides', array['17', 'options', '0', 'feedback'], '90d2bfa240884d8c5be23be48fbfb0f4',
  $f$Pet names and streets unlock forgotten passwords, so they live in the vault.$f$,
  $r$A first pet's name is a common secret question for getting back into an account, so it lives in the vault.$r$);
select schools.swap_352('slides', array['17', 'options', '1', 'feedback'], '28cf855e57a58271a5ad337c03206ffa',
  $f$Real pet names and streets are the clue questions behind passwords, and honest answers hand over the keys.$f$,
  $r$A real pet's name is a common secret question behind accounts, and honest answers hand over the keys.$r$);
select schools.swap_352('slides', array['20', 'config', 'posts', '0', 'why'], 'c7dd07625830cfb7dd68faa04f9710d7',
  $f$Pet names and streets are the backup questions that unlock passwords.$f$,
  $r$A first pet's name is a common secret question for getting back into an account, and where you live helps someone pretend to be you.$r$);
select schools.swap_352('teacher_notes', array['worksheet_items', '0', 'teaching_point'], 'c7dd07625830cfb7dd68faa04f9710d7',
  $f$Pet names and streets are the backup questions that unlock passwords.$f$,
  $r$A first pet's name is a common secret question for getting back into an account, and where you live helps someone pretend to be you.$r$);
select schools.swap_352('slides', array['22', 'options', '0', 'feedback'], 'bbdba43ede82468382a2f039131ec7f4',
  $f$and an answer you have posted about is a key left in the door.$f$,
  $r$and an answer you have posted about is a key left in the door. Even better, a grown up can help turn on a second check, like a code sent to a phone.$r$);
select schools.swap_352('slides', array['10', 'body'], '22d175ae1db125580f709c18740f16da',
  $f$but unsending is impossible. The moment something leaves your device, anyone who sees it can screenshot it, save it or forward it, and you will never know. Pressing delete only removes it from YOUR view, like turning your back on a poster that is still on the wall.$f$,
  $r$but taking it back is not. The moment something leaves your device, anyone who sees it can screenshot it, save it or forward it, and you may never know. Some apps let you unsend a message, but that cannot take back a screenshot, a save or a forward.$r$);
select schools.swap_352('slides', array['10', 'script'], 'ec42269f945651ae24dc5afaa23d869a',
  $f$Do the poster demo: stick a piece of paper on the board, then turn your back on it and announce, deleted! Ask the class: is it gone? They can all still see it. That is exactly what delete does online.$f$,
  $r$Do the poster demo: stick a piece of paper on the board and have one pupil copy it onto their own sheet. Then take the poster down and announce, deleted! Ask the class: is it gone? The poster is, the copy is not. That is exactly what delete does online.$r$);
select schools.swap_352('slides', array['13', 'options', '0', 'text'], '2be008ef84485234fab1531304fa1dfc',
  $f$because delete only removes YOUR copy$f$,
  $r$because delete cannot reach a screenshot or a forward$r$);
select schools.swap_352('slides', array['13', 'options', '1', 'feedback'], 'cbe959401451ed5fb39a4876da47df1a',
  null,
  $r$Delete can take it out of the chat, but not out of screenshots, saved copies or forwards. Those live on devices you cannot reach.$r$);
select schools.swap_352('slides', array['13', 'script'], 'd5fad54806d6f89a3ee228367128dce6',
  $f$Bring back the poster on the board: did turning your back make it disappear? Same rule, every time.$f$,
  $r$Bring back the poster demo: the poster came down, the copy stayed. Same rule, every time.$r$);
select schools.swap_352('slides', array['23', 'options', '0', 'feedback'], '90636af1edde01a3b933d6d2907fd107',
  $f$Delete removes your copy, not the copies on other devices.$f$,
  $r$Delete cannot reach the copies on other devices, like screenshots and forwards.$r$);
select schools.swap_352('slides', array['23', 'options', '1', 'feedback'], '8c84246cc06b5180048732d61993dfbe',
  $f$Delete only removes it from your view.$f$,
  $r$Delete can take it out of the chat at most.$r$);
select schools.swap_352('slides', array['23', 'script'], 'b0d2bb52a9a66534ebf2212828b073f6',
  $f$prompt for the poster on the board, the reason$f$,
  $r$prompt with the poster demo: the poster came down, the copy stayed. The reason$r$);
select schools.swap_352('teacher_notes', array['paper_fallback'], 'bd43c6838763725226c41f333810ffca',
  $f$(stick paper on the board, turn your back, ask if it is gone)$f$,
  $r$(stick paper on the board, have a pupil copy it, take the poster down, ask if it is gone)$r$);
select schools.swap_352('teacher_notes', array['misconceptions', '0'], 'd23219a5f0b00b30e60085de5a708986',
  $f$(delete only removes your copy, screenshots and forwarded copies live on devices you cannot reach)$f$,
  $r$(delete cannot reach screenshots or forwarded copies, which live on devices you cannot reach)$r$);
select schools.swap_352('slides', array['14', 'body'], '3b2bf97dc652285c0da96f04da6753c2',
  $f$years from now, secondary schools, clubs and even employers may wander through and look around.$f$,
  $r$years from now, even an employer may wander through and look around.$r$);
select schools.swap_352('slides', array['14', 'script'], 'cc1adde3c22b2593471d2de216bafff4',
  $f$someone deciding whether to pick you for a team, a school or a job will type your name into a search bar.$f$,
  $r$someone deciding whether to give you a job may type your name into a search bar.$r$);
select schools.swap_352('slides', array['15', 'caption'], 'd9d859553eee7d201633679bb8bb5495',
  $f$And one more thing you can do before any of this: most apps have a settings page with a privacy switch and a location switch on it. Turning location off means a photo stops carrying a little map of where you were.$f$,
  $r$And two things a grown up can help with before any of this: the app's privacy settings, which choose who sees your posts, and the camera setting that saves where each photo was taken.$r$);
select schools.swap_352('slides', array['15', 'script'], 'b56121955149960b1efd1ecdb7b8594b',
  $f$Say it simply: apps have a settings page, and two of the switches on it are privacy and location. Location off means the photo stops carrying a map. Do not walk through any one app, because they all differ and they all change. The point is that the switches exist and are theirs to find, with a grown up.$f$,
  $r$Say it simply: in the app, the privacy settings decide who can see what you post, and on the phone, the camera can store the place each photo was taken. A grown up can help with both, and switching the camera location off changes new photos, not old ones. Do not walk through any one app or phone, because they all differ and they all change. The point is that the settings exist and are theirs to find, with a grown up.$r$);
select schools.swap_352('teacher_notes', array['misconceptions', '1'], '9503c718093a0f6bfa6cef9acd5057eb',
  $f$most oversharing happens in friendly places$f$,
  $r$a lot of oversharing happens in friendly places$r$);

-- The evidence anchor is a plain text column, guarded the same way.
do $$ begin
  if (select md5(evidence_anchor) from schools.school_lessons where module_id = 'ks2-07-privacy-reputation') is distinct from 'f29f5932e96f6479ef9549a2a4db32bc' then
    insert into miss values ('evidence_anchor is not the text this was written against');
  end if;
end $$;
update schools.school_lessons set evidence_anchor = $r$CEOP and NCSC advice, the apps' own help pages, ONS 2020 on online bullying$r$
 where module_id = 'ks2-07-privacy-reputation' and md5(evidence_anchor) = 'f29f5932e96f6479ef9549a2a4db32bc';

-- The hard questions written on 21 September reached content/modules and never production.
do $$ begin
  if (select teacher_notes ? 'hard_questions' from schools.school_lessons where module_id = 'ks2-07-privacy-reputation') then
    insert into miss values ('hard_questions already present, refusing to overwrite');
  end if;
end $$;
update schools.school_lessons l
   set teacher_notes = l.teacher_notes || jsonb_build_object('hard_questions', $hq$[{"question":"I deleted it, so it is gone.","answer":"It might be gone from the chat or your page, which is not the same as gone. Anybody could have screenshotted or saved it, and the app may keep a copy for a while: Instagram keeps deleted posts for 30 days. Deleting is worth doing. It is just not a rubber."},{"question":"So I should not share anything ever?","answer":"No, and a lesson that ended there would be useless to you. Sharing is how you have friends. The three questions are there so you can tell the share that is fine from the one you would not want on the screen at the front of this room."},{"question":"Only strangers are the risk.","answer":"When children are picked on online, most say it was someone from their own school, so it is not only strangers. That is uncomfortable, and it is what a national survey found. It is also why the test is about the information, not about who is asking."},{"question":"What if it is already out there?","answer":"Then you tell somebody today, and you are not in trouble. Things that feel unfixable at eleven at night are usually a lot more fixable with an adult and a morning. Come and find me or any adult here."}]$hq$::jsonb)
 where l.module_id = 'ks2-07-privacy-reputation' and not (l.teacher_notes ? 'hard_questions');

-- The evidence base is written only onto an empty one, never over real rows.
do $$
declare n int;
begin
  select coalesce(jsonb_array_length(l.teacher_notes->'evidence_base'), 0) into n
    from schools.school_lessons l where l.module_id = 'ks2-07-privacy-reputation';
  if n <> 0 then insert into miss values ('evidence_base already has ' || n || ' rows, refusing to overwrite'); end if;
end $$;
update schools.school_lessons l
   set teacher_notes = jsonb_set(coalesce(l.teacher_notes, '{}'::jsonb), '{evidence_base}', $ev$[{"claim":"Some apps tell you when someone takes a screenshot, but nobody can stop a person photographing a screen with another phone.","source":"Snapchat Support: the Chat screen shows 'A screenshot has been taken of your Chat', and a Story shows its owner if a screenshot was taken; its safety page adds that people you send Snaps to can still take a screenshot or take a picture of the Snap with another device. Instagram (Meta help): screenshots are disabled for disappearing photos and videos sent in a chat, and it flags a screenshot if it detects one.","status":"verified"},{"claim":"Unsend and delete for everyone can take a message out of the chat, but not what someone already saw, screenshotted, saved or forwarded.","source":"Instagram (Meta help): once you unsend a message it is no longer visible to people in the chat, but they may have already seen it. Snapchat Support: when you delete a message it tries to remove it from its servers and your friends' devices, your friends can see that a message was deleted, and they can still take a screenshot before you delete it.","status":"verified"},{"claim":"An app may keep a deleted post for a while: Instagram keeps deleted posts in Recently deleted for 30 days.","source":"Instagram (Meta help): deleted content moves to Recently Deleted and is automatically deleted 30 days later; completing the deletion process can take up to 90 days, and copies may remain in backup storage after that.","status":"verified"},{"claim":"A first pet's name is a common secret question for getting back into an account, and quizzes can collect facts like it.","source":"NCSC, Setting up 2 step verification (2SV): some services use memorable information or a security question, such as 'What was the name of your first pet?', which does not offer the same protection, so turn on 2SV where it is available. GOV.UK, Stop! Think Fraud: fraudsters use fake content including quizzes, and can use facts such as your birthday, where you live, family relationships or pet names to steal your identity.","status":"verified"},{"claim":"Your name, date of birth, address or school, and a school uniform can all show who you are and where to find you.","source":"CEOP Education, a parent's guide to personal information: personal information includes a child's name, date of birth, home address or school name, and photos or videos, and an identifier like a school uniform might show where a child is, lives or goes to school.","status":"verified"},{"claim":"An app's privacy settings choose who sees your posts, and a phone's camera can save where each photo was taken; a grown up can help with both.","source":"Apple Support, personal safety user guide: when Location Services is on for the Camera app it records the location where a photo or video is taken, and it can be turned off in Settings, Privacy and Security, Location Services, Camera, Never; photos already taken keep their location unless it is removed. The ICO Children's code tells online services that settings must be high privacy by default (standard 7) and that geolocation must be switched off by default for children (standard 10).","status":"verified"},{"claim":"One day an employer may look you up online.","source":"YouGov, 10 April 2017, a survey of UK business decision makers: 48 percent said they would or do check an applicant's LinkedIn profile, 46 percent said the same for Facebook, and 19 percent had turned down a candidate because of their online activity.","status":"verified"},{"claim":"When children are bullied online, most say it was someone from their own school, so the risk is not only strangers.","source":"ONS, Online bullying in England and Wales, year ending March 2020: 7 in 10 (70 percent) children aged 10 to 15 who experienced online bullying said it was by someone from their school. The year ending March 2023 release puts it at 64.7 percent.","status":"verified"}]$ev$::jsonb, true)
 where l.module_id = 'ks2-07-privacy-reputation' and coalesce(jsonb_array_length(l.teacher_notes->'evidence_base'), 0) = 0;

do $$
declare n int; d text;
begin
  select count(*), string_agg(target, E'\n  ') into n, d from miss;
  if n > 0 then raise exception E'352 aborted, % guard(s) missed:\n  %', n, d; end if;
end $$;

-- Nothing moved in any other module.
do $$
declare bad text;
begin
  select string_agg(l.module_id, ', ') into bad
    from schools.school_lessons l
    join schools.school_lessons_backup_352 b on b.module_id = l.module_id
   where l.module_id <> 'ks2-07-privacy-reputation'
     and (l.slides is distinct from b.slides or l.teacher_notes is distinct from b.teacher_notes
          or l.parent_note is distinct from b.parent_note or l.dsl_note is distinct from b.dsl_note
          or l.assessment is distinct from b.assessment or l.video_beats is distinct from b.video_beats
          or l.evidence_anchor is distinct from b.evidence_anchor);
  if bad is not null then raise exception '352 aborted, other modules moved: %', bad; end if;
end $$;

-- And this module now matches content/modules/ks2-07-privacy-reputation.json string for string:
-- 29 slides, 465 strings, multiset hash 70061a5a931f5a88fe25a06bbb2b5fd9 (scripts/module-string-hash.mjs).
do $$
declare got_hash text; got_n int; got_slides int;
begin
  select md5(string_agg(md5(v), '' order by md5(v))), count(*) into got_hash, got_n
  from (
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.slides, '$.**') as x
    where l.module_id = 'ks2-07-privacy-reputation' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.video_beats, '$.**') as x
    where l.module_id = 'ks2-07-privacy-reputation' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.assessment, '$.**') as x
    where l.module_id = 'ks2-07-privacy-reputation' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.parent_note, '$.**') as x
    where l.module_id = 'ks2-07-privacy-reputation' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.teacher_notes, '$.**') as x
    where l.module_id = 'ks2-07-privacy-reputation' and jsonb_typeof(x) = 'string'
    union all
    select x #>> '{}' as v from schools.school_lessons l, lateral jsonb_path_query(l.dsl_note, '$.**') as x
    where l.module_id = 'ks2-07-privacy-reputation' and jsonb_typeof(x) = 'string'
    union all
    select module_id from schools.school_lessons where module_id = 'ks2-07-privacy-reputation'
    union all
    select title from schools.school_lessons where module_id = 'ks2-07-privacy-reputation'
    union all
    select key_stage from schools.school_lessons where module_id = 'ks2-07-privacy-reputation'
    union all
    select year_band from schools.school_lessons where module_id = 'ks2-07-privacy-reputation'
    union all
    select audience from schools.school_lessons where module_id = 'ks2-07-privacy-reputation'
    union all
    select evidence_anchor from schools.school_lessons where module_id = 'ks2-07-privacy-reputation'
    union all
    select single_action_outcome from schools.school_lessons where module_id = 'ks2-07-privacy-reputation'
    union all
    select character_cast from schools.school_lessons where module_id = 'ks2-07-privacy-reputation'
    union all
    select scaffold from schools.school_lessons where module_id = 'ks2-07-privacy-reputation'
    union all
    select unnest(statutory_hooks) from schools.school_lessons where module_id = 'ks2-07-privacy-reputation'
    union all
    select unnest(ailit_domains) from schools.school_lessons where module_id = 'ks2-07-privacy-reputation'
  ) q;
  select jsonb_array_length(slides) into got_slides from schools.school_lessons where module_id = 'ks2-07-privacy-reputation';
  if got_hash is distinct from '70061a5a931f5a88fe25a06bbb2b5fd9' or got_n <> 465 or got_slides <> 29 then
    raise exception '352 aborted, ks2-07-privacy-reputation does not match its source JSON: % strings, hash %', got_n, got_hash;
  end if;
end $$;

drop function schools.swap_352(text, text[], text, text, text);

commit;
