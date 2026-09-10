-- 281_cycle_budgets_catch_up_with_the_beats.sql
--
-- THE COST OF 280, PAID.
--
-- 267 and 270 set out to remove dishonest arithmetic from the lesson timings.
-- 270's rule was that a cycle's stated minutes equal the minutes of the slides
-- it actually contains, and it made that true of all 62 cycles.
--
-- 280 then inserted engagement beats into the decks. Fourteen of them landed in
-- a teach phase, which is where the cycles live, and nothing recomputed the
-- budgets. So twelve modules now under report: four minutes on ks2-05 and
-- ks4-17, which took two beats each, and two minutes on the other ten. A
-- teacher reading "cycle two, 14 minutes" is planning against a cycle that runs
-- sixteen. That is the arithmetic 267 and 270 removed, reintroduced by a
-- migration that was careful about everything except this.
--
-- WHICH CYCLE ABSORBS EACH BEAT IS NOT A JUDGEMENT CALL. It looked like one
-- until the player was read properly. A cycle opens on the slide whose heading
-- it names and runs to the slide before the next cycle opens, so a beat already
-- belongs to whichever cycle it physically sits inside, and the chrome already
-- tells a class so. The only thing wrong is the number. Every figure below is
-- the sum of the slides that cycle already contains, computed by replaying the
-- player's own anchoring (LessonPlayer.tsx, cycleOfSlide) against the live
-- decks. No slide, script, quiz, outcome or verb is touched.
--
-- AND ONE THING THAT WAS ALREADY BROKEN. Replaying the anchoring turned up
-- ks4-16, whose cycle three is titled "Pressure". No slide heading in that deck
-- contains the word. The player scores a title against each heading, needs half
-- its words to match, finds nothing, and returns an empty map rather than guess,
-- so ks4-16 has been rendering with no cycle map at all. Its cycles array says
-- cycle three is seven minutes and that is right: the cycle opens on "Everyone
-- is not sending them", where the deck turns from what the law says to what
-- pressure feels like. Retitled to that heading, which is what 270 did for the
-- seven titles that named nothing in their own deck. Minutes unchanged.
--
-- STILL WRONG AFTER THIS, deliberately left for its own migration: all 21
-- timing strings under state the lesson total, by two to six minutes, because
-- none was recomputed after 271, 278, 279 or 280. That is prose in several
-- shapes, one carrying a whole alternative plan for a 55 minute period, so it
-- wants writing rather than a regular expression. Numbers in decisions.md.
--
-- Non destructive apart from the cycles array, which is replaced whole.
-- Idempotent. Backed up first.

begin;

create table if not exists schools.school_lessons_backup_281 as
  select id, module_id, teacher_notes, now() as backed_up_at
  from schools.school_lessons;

alter table schools.school_lessons_backup_281 enable row level security;

-- ks2-05-gaming-time-spend: 9, 14, 5 -> 11, 16, 5  (teach phase runs 32)
update schools.school_lessons
   set teacher_notes = jsonb_set(jsonb_set(teacher_notes, '{cycles,0,minutes}', '11'::jsonb), '{cycles,1,minutes}', '16'::jsonb)
 where module_id = 'ks2-05-gaming-time-spend';

-- ks2-06-how-algorithms-work: 11, 9, 8 -> 13, 9, 8  (teach phase runs 30)
update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles,0,minutes}', '13'::jsonb)
 where module_id = 'ks2-06-how-algorithms-work';

-- ks2-07-privacy-reputation: 11, 7, 10 -> 13, 7, 10  (teach phase runs 30)
update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles,0,minutes}', '13'::jsonb)
 where module_id = 'ks2-07-privacy-reputation';

-- ks2-08-kind-safe-online: 10, 6, 12 -> 10, 6, 14  (teach phase runs 30)
update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles,2,minutes}', '14'::jsonb)
 where module_id = 'ks2-08-kind-safe-online';

-- ks2-09-copyright-ownership: 11, 8, 9 -> 11, 8, 11  (teach phase runs 30)
update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles,2,minutes}', '11'::jsonb)
 where module_id = 'ks2-09-copyright-ownership';

-- ks3-11-social-workarounds: 10, 11, 7 -> 12, 11, 7  (teach phase runs 30)
update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles,0,minutes}', '12'::jsonb)
 where module_id = 'ks3-11-social-workarounds';

-- ks3-13-scams-fraud-money: 12, 10, 8 -> 12, 12, 8  (teach phase runs 32)
update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles,1,minutes}', '12'::jsonb)
 where module_id = 'ks3-13-scams-fraud-money';

-- ks3-14-bodies-image-pressure: 6, 16, 6 -> 6, 18, 6  (teach phase runs 30)
update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles,1,minutes}', '18'::jsonb)
 where module_id = 'ks3-14-bodies-image-pressure';

-- ks4-17-sextortion: 10, 8, 10 -> 14, 8, 10  (teach phase runs 32)
update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles,0,minutes}', '14'::jsonb)
 where module_id = 'ks4-17-sextortion';

-- ks4-19-readiness-at-16: 14, 6, 11 -> 16, 6, 11  (teach phase runs 33)
update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles,0,minutes}', '16'::jsonb)
 where module_id = 'ks4-19-readiness-at-16';

-- ks5-20-ai-mastery-data-rights: 9, 11, 4 -> 11, 11, 4  (teach phase runs 26)
update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles,0,minutes}', '11'::jsonb)
 where module_id = 'ks5-20-ai-mastery-data-rights';

-- ks5-21-digital-identity-future-work: 9, 10, 7 -> 9, 12, 7  (teach phase runs 28)
update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles,1,minutes}', '12'::jsonb)
 where module_id = 'ks5-21-digital-identity-future-work';

-- ks4-16: cycle three is titled "Pressure" and no heading in the deck
-- contains that word, so the player anchors nothing and renders no map at
-- all. Retitled to the heading the cycle actually opens on, which is what
-- 270 did for the seven titles that named nothing. Minutes unchanged.
update schools.school_lessons
   set teacher_notes = jsonb_set(teacher_notes, '{cycles,2,title}', '"Everyone is not sending them"'::jsonb)
 where module_id = 'ks4-16-consent-images-law';

-- Guards. The two 270 ended on, because they are the properties this migration
-- restores, plus a third for what 270's guard could not see: a cycle title that
-- anchors nowhere passes every minute check and still leaves a class with no map.
do $$
declare bad int;
begin
  select count(*) into bad from schools.school_lessons l
   where exists (select 1 from jsonb_array_elements(l.teacher_notes->'cycles') c
                  where not (c ?& array['verb','title','outcome','minutes']));
  if bad > 0 then
    raise exception 'Migration 281: % module(s) with an incomplete cycle', bad;
  end if;

  select count(*) into bad from schools.school_lessons l
   where (select sum((c->>'minutes')::int) from jsonb_array_elements(l.teacher_notes->'cycles') c)
      <> (select coalesce(sum((s->>'minutes')::int), 0) from jsonb_array_elements(l.slides) s
           where s->>'phase' = 'teach');
  if bad > 0 then
    raise exception 'Migration 281: % module(s) whose cycle minutes do not match the teach phase', bad;
  end if;

  -- Every cycle after the first must name a teach slide heading in its own deck.
  -- Weaker than the player's word scoring, which no reasonable amount of SQL
  -- reproduces; the exact rule is asserted by scripts/check-cycle-anchors.mjs.
  -- What this catches is the blunt version of the ks4-16 failure: a title whose
  -- first significant word appears in no heading in the deck.
  select count(*) into bad from schools.school_lessons l
   where exists (
     select 1 from jsonb_array_elements(l.teacher_notes->'cycles') with ordinality c(cy, n)
      where n > 1
        and not exists (
          select 1 from jsonb_array_elements(l.slides) s
           where s->>'phase' = 'teach' and s->>'heading' is not null
             and lower(s->>'heading') like '%' || lower(
                   split_part(regexp_replace(cy->>'title', '^(The|A|An) ', ''), ' ', 1)) || '%'));
  if bad > 0 then
    raise exception 'Migration 281: % module(s) with a cycle that names no slide in its own deck', bad;
  end if;
end $$;

commit;
