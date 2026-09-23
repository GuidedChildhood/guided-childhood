-- 343: one question at a time, in the one library script that asked two.
--
-- Pam, a clinician reviewing the parent track on 23 September 2026, named the
-- rule a good clinical interview keeps: never ask two things in one question,
-- never assume a young person already knows what they want from their phone,
-- and never call their use "just a habit", which belittles everything they
-- value about it. The worst of it was in lib/content/stages.ts, fixed in the
-- same change. A sweep of all 339 library scripts for the same shape found
-- one more, in the lines written to a sixteen year old: "is your phone
-- working for you, or is it winning?" is an either or with a loaded second
-- half. It becomes two questions asked one at a time, the good one first.
--
-- The same sweep found a typo in a Foundation script: "your childs apps".
--
-- The other four hits were left alone on purpose: two are the parent's own
-- thoughts ("or is it just me?", "or just safer"), one describes the parent's
-- situation, and one is a sorting game ("making something or just watching").
--
-- Each update fires only on the exact current text, so a replay, or a script
-- rewritten since, changes nothing and the check below says so. The embedding
-- is left alone: neither edit changes what the script is about. One field in
-- each of two rows, and the old text is written out below, so this file is
-- its own undo.

begin;

update public.scripts
   set for_your_child = 'At sixteen this is genuinely your call, and that is not a trick. Two questions worth asking yourself, one at a time. What are the best things your phone gives you? And is there anything it costs you? Nobody can answer that for you, and nobody can fix it for you either. Two hours you took off yourself are worth more than two hours somebody took off you.'
 where stage_id = 'independent' and title = 'They are sixteen and you have run out of rules'
   and for_your_child = 'At sixteen this is genuinely your call, and that is not a trick. Worth asking yourself honestly though: is your phone working for you, or is it winning? Nobody can answer that for you, and nobody can fix it for you either. Two hours you took off yourself are worth more than two hours somebody took off you.';

update public.scripts
   set tonight = 'Tonight, sort two of your child''s apps together into making something or just watching, out loud.'
 where stage_id = 'foundation' and title = 'Learning versus entertainment'
   and tonight = 'Tonight, sort two of your childs apps together into making something or just watching, out loud.';

do $$
begin
  if not exists (select 1 from public.scripts
                  where stage_id = 'independent' and title = 'They are sixteen and you have run out of rules'
                    and for_your_child like '%Two questions worth asking yourself, one at a time.%') then
    raise exception '343 aborted, the sixteen year old script was not the text this was written against';
  end if;
  if not exists (select 1 from public.scripts
                  where stage_id = 'foundation' and title = 'Learning versus entertainment'
                    and tonight like '%your child''s apps%') then
    raise exception '343 aborted, the Foundation script was not the text this was written against';
  end if;
  if exists (select 1 from public.scripts s where s::text ~* 'or is it winning|just (a )?habit') then
    raise exception '343 aborted, an either or about habit is still in the library';
  end if;
end $$;

commit;
