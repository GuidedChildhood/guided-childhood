-- 371: the ending is agreed before it starts, not warned at the end.
--
-- The DiGi shorts research panel (12 October 2026) found the library telling
-- parents two opposite things. Scripts 9650 and 9671, DiGi's research bank
-- and the under 7 shelf all say what the one close study of screen endings
-- found: endings set by the show or a timer went more smoothly than a parent
-- calling time, and warned endings were followed by more upset, not less
-- (Hiniker, Suh, Cao and Kientz, CHI 2016, families of children aged 1 to 5).
-- What helped was the ending being agreed before the screen went on. Yet four
-- older paid scripts and two moment cards still told parents to give a two or
-- five minute warning, and one card said a warning was "consistently more
-- effective than a hard stop", which no study we hold says. Justin asked for
-- all of it fixed (12 October 2026, "Fix all three").
--
-- THE EDITS
--   Script 2, 103 and 1302: the Tonight step and the check back now agree the
--     ending first instead of warning at the end. The rest of each script is
--     unchanged.
--   Script 9650: "went far better" and "made the ending worse on every
--     measure" overstate a diary study; it now says what was found.
--   Script 9671: the study's ages are named (it was 1 to 5 year olds, and this
--     script is for 8 to 10s, which the RCPCH line carries), and "let us"
--     reads as "let's".
--   Moment card 22: the "consistently more effective" claim goes.
--   Moment card 330: the warning advice and the two lines built on it go.
--
-- Script 115 (dinner) carried the same advice in the seed and was already
-- rewritten on the live table, so it is not touched here.
--
-- Every edit is a replace on the exact current phrase, guarded on that phrase,
-- so a replay or a row rewritten since changes nothing. The check at the end
-- aborts if any script or card still advises a warning. The old phrases are
-- written out in each statement, so this file is its own undo. The seed files
-- are updated to match in the same change. Embeddings are left alone: no
-- edit changes what a script is about.

begin;

-- ── Script 2, Foundation: Meltdown when screen time ends ──────────────────
update public.scripts
   set tonight = 'This week, agree the ending before the screen goes on: one episode, or until the timer goes. When it ends, name the feeling and go straight into the wind down together. Watch whether the meltdowns get shorter.'
 where sort_order = 2
   and tonight = 'Give a two-minute warning before every screen ending this week. Watch whether the meltdowns reduce.';

update public.scripts
   set check_back = replace(check_back, 'whether the two minute warning is softening the switch off', 'whether ending at the agreed point is softening the switch off')
 where sort_order = 2
   and check_back like '%whether the two minute warning is softening the switch off%';

-- ── Script 103, Builder: Refusing to stop when time is up ─────────────────
update public.scripts
   set tonight = 'Tomorrow, before the screen goes on, agree together what ends it: the end of the level, the episode, or the kitchen timer. Then the ending is the deal you made, not a surprise, and you have nothing to add when it comes.'
 where sort_order = 103
   and tonight = 'Set a two-minute warning alarm tomorrow so your child gets a heads-up before time ends, giving their brain a chance to prepare rather than being cut off abruptly.';

update public.scripts
   set check_back = replace(check_back, 'whether the two-minute warning made switching off', 'whether agreeing the ending first made switching off')
 where sort_order = 103
   and check_back like '%whether the two-minute warning made switching off%';

-- ── Script 1302, Foundation: When Screen Time Ends in Tears ───────────────
update public.scripts
   set tonight = 'This week, agree the ending before every session starts: one episode, or until the timer goes. It is not a negotiation. An ending they knew about before the screen went on is easier to land than a warning at the end.'
 where sort_order = 1302
   and tonight = 'Give a five minute warning before ending screen time every session this week. It is not a negotiation. It is a predictable signal that reduces the crash.';

update public.scripts
   set check_back = replace(replace(check_back,
         'whether the crash after the five minute warning is shorter', 'whether the crash at the agreed ending is shorter'),
         'turned the tablet off after the warning today', 'turned the tablet off when we said it would end today')
 where sort_order = 1302
   and check_back like '%whether the crash after the five minute warning is shorter%'
   and check_back like '%turned the tablet off after the warning today%';

-- ── Script 9650, Foundation: The two minute warning is making it worse ────
update public.scripts
   set why_it_works = replace(why_it_works,
         'Researchers who watched 55 families of under sixes found that endings set by the technology, the episode finishing or the device timing itself out, went far better than endings called by a parent, and the spoken two minute warning made the ending worse on every measure they looked at.',
         'Researchers who studied 55 families of under sixes found that endings set by the technology, the episode finishing or the device timing itself out, went more smoothly than endings called by a parent, and endings with a spoken two minute warning were followed by more upset, not less.')
 where sort_order = 9650
   and why_it_works like '%went far better than endings called by a parent, and the spoken two minute warning made the ending worse on every measure they looked at.%';

-- ── Script 9671, Builder: The stopping point agreed in a calm moment ──────
update public.scripts
   set say_this = replace(say_this, 'so let us decide the stopping before we start', 'so let''s decide the stopping before we start')
 where sort_order = 9671
   and say_this like '%so let us decide the stopping before we start%';

update public.scripts
   set why_it_works = replace(why_it_works,
         'The one close study of how screen time ends in families, 28 families and 380 endings, found two things.',
         'The one close study of how screen time ends in families (28 families with children aged 1 to 5, and 380 endings) found two things.')
 where sort_order = 9671
   and why_it_works like '%The one close study of how screen time ends in families, 28 families and 380 endings, found two things.%';

-- ── Moment card 22: Screen time limit battle ──────────────────────────────
update public.daily_moments
   set solutions = jsonb_set(solutions, '{0}', to_jsonb('Agree the stopping point before it starts, the end of the level or the episode, so the limit lands at a natural ending rather than mid game.'::text))
 where title = 'Screen time limit battle'
   and solutions->>0 like 'A five-minute warning before the limit is up is consistently more effective than a hard stop%';

-- ── Moment card 330: Turning the screen off ends in tears ─────────────────
update public.daily_moments
   set science_brief = replace(science_brief, 'being pulled out with no warning feels like a loss', 'being pulled out mid scene feels like a loss'),
       digi_opener = replace(digi_opener, 'because a warning lands best in the calm before?', 'because the ending is easiest to agree in the calm before?'),
       solutions = jsonb_set(solutions, '{0}', to_jsonb('Give the ending a shape they can see, agreed before it starts: the end of the episode, not mid scene.'::text))
 where title = 'Turning the screen off ends in tears'
   and solutions->>0 = 'Give the ending a shape they can see, a two minute warning and a natural stopping point, the end of the episode, not mid scene.';

do $$
begin
  if exists (select 1 from public.scripts s
              where s::text ~* '(two|2|five|5)[ -]minute warning (alarm )?(before|tomorrow)|give a (clear )?(two|2|five|5)[ -]minute warning before|five minute warning is shorter|after the warning today|so let us decide the stopping|went far better than endings called by a parent') then
    raise exception '371 aborted, a script still advises a warning or carries the old wording';
  end if;
  if exists (select 1 from public.daily_moments d
              where d::text ~* '(two|2|five|5)[ -]minute warning (before|and a natural)|consistently more effective than a hard stop|a warning lands best') then
    raise exception '371 aborted, a moment card still advises a warning';
  end if;
end $$;

commit;
