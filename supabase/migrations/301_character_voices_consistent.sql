-- 301: THE CHARACTER VOICES, MADE CONSISTENT (14 September 2026).
--
-- Justin: "make sure the character voices are consistent, not to confuse
-- kids." A voice audit of all 25 lessons (every title, digi beat, quote and
-- beat line against digi-squad/README.md and the register ladder) found the
-- lessons themselves coherent by key stage and a handful of lines that were
-- not. This migration fixes the lines. The curriculum map's manifest, which
-- named a different friend from the lesson on nine modules, is fixed in
-- shared/schools-curriculum.ts in the same pull request.
--
-- Content only. No schema change. Every replacement is a no op where the
-- text is not there, so the migration is safe to run twice.

begin;

-- 1. Orbit fronted one KS2 lesson (ks2-09) with no handover: a Year 4 child
--    whose friend is Bloop met Orbit once, then Bloop came back, and the
--    lesson's own passport line already said Bloop's stamp. The lesson is
--    about being a maker, which is Bloop's verb. Bloop fronts it now, in
--    every field, and DiGi still closes.
update schools.school_lessons
set character_cast = 'Bloop',
    slides = regexp_replace(regexp_replace(slides::text, '"character":\s*"orbit"', '"character": "bloop"', 'g'), '\mOrbit\M', 'Bloop', 'g')::jsonb,
    teacher_notes = regexp_replace(teacher_notes::text, '\mOrbit\M', 'Bloop', 'g')::jsonb,
    parent_note = regexp_replace(parent_note::text, '\mOrbit\M', 'Bloop', 'g')::jsonb
where module_id = 'ks2-09-copyright-ownership';

-- 2. The sixth form said hello twice: Cosmo on the title slide, then DiGi
--    introducing itself on the next, and Cosmo never seen again. The KS5
--    register is DiGi with motion graphics (the cast line already says so),
--    so the title is DiGi's, with a line that is not a second hello.
update schools.school_lessons l
set slides = (
  select jsonb_agg(
    case when s.ord = 1 and s.slide->>'type' = 'title' and s.slide->>'character' = 'cosmo'
      then s.slide || jsonb_build_object(
        'character', 'digi',
        'line', case l.module_id
          when 'ks5-20-ai-mastery-data-rights' then 'You already use the tools. This hour is about running them.'
          else 'Two questions today, and both decide the next ten years.' end)
      else s.slide end
    order by s.ord)
  from jsonb_array_elements(l.slides) with ordinality as s(slide, ord))
where module_id in ('ks5-20-ai-mastery-data-rights', 'ks5-21-digital-identity-future-work');

-- 3. The four calm register lessons said "Hello. I am DiGi." on the title
--    line and again as the first line of the arrival. The title keeps it;
--    the arrival opens on its question.
update schools.school_lessons l
set slides = (
  select jsonb_agg(
    case when s.slide->>'type' = 'digi' and s.slide->>'phase' = 'starter' and s.slide->'lines'->>0 = 'Hello. I am DiGi.'
      then jsonb_set(s.slide, '{lines}', (s.slide->'lines') - 0)
      else s.slide end
    order by s.ord)
  from jsonb_array_elements(l.slides) with ordinality as s(slide, ord))
where module_id in ('ks3-14-bodies-image-pressure', 'ks4-16-consent-images-law', 'ks4-17-sextortion', 'ks4-18-radicalisation-misogyny');

-- 4. ks2-08: DiGi Junior is the Reception and KS1 closer; at KS2 DiGi
--    closes, as in every other KS2 lesson. Orbit was named in the cast line
--    and never spoke. Bloop is named with a pronoun that changed by slide;
--    the name is used instead.
update schools.school_lessons
set character_cast = 'Bloop',
    slides = replace(replace(replace(slides::text,
      'DiGi Junior closes the mission', 'DiGi closes the mission'),
      'Let DiGi Junior land the ending', 'Let DiGi land the ending'),
      'Bloop says it like she means it, so should the class.', 'Bloop means every word, so should the class.')::jsonb,
    teacher_notes = replace(teacher_notes::text, 'from Orbit', 'from Bloop')::jsonb
where module_id = 'ks2-08-kind-safe-online';

-- 5. ks1-02: DiGi Junior closes it, so the cast line names DiGi Junior the
--    way the other two Pebble lessons do; and Pebble by name, not "her".
update schools.school_lessons
set character_cast = 'Pebble with DiGi Junior',
    slides = replace(slides::text, 'Pebble taught you her three steps', 'Pebble taught you three steps')::jsonb
where module_id = 'ks1-02-kind-screens-calm-bodies';

-- 6. Orbit and Nova were still written as the retired fox character:
--    "Orbit the fox", "a fox's pockets", "street smart", "a little sly".
--    Orbit's canon is bigger worlds and big questions; Nova's is steady,
--    calm, good choices.
update schools.school_lessons
set slides = replace(replace(replace(replace(replace(slides::text,
      'Orbit the fox, who has seen every trick going and does not gasp at any of them', 'Orbit, who has seen every trick going and does not gasp at any of them'),
      '🦊', '🔭'),
      'Street smart is knowing the price', 'Being sharp is knowing the price'),
      'a reason that sounds street smart pasted over a price', 'a reason that sounds clever pasted over a price'),
      'Being street smart was never about knowing the tricks.', 'Spotting the trick was never the point. Knowing the price is.')::jsonb
where module_id = 'ks3-11-social-workarounds';

update schools.school_lessons
set slides = replace(slides::text, 'nobody empties a fox''s pockets', 'nobody empties my pockets')::jsonb
where module_id = 'ks3-13-scams-fraud-money';

update schools.school_lessons
set slides = replace(slides::text,
      'Nova has been the street smart voice of KS4 all year, so give it her delivery: unbothered, certain, a little sly.',
      'Nova has been the steady voice of KS4 all year, so give it Nova''s delivery: level, certain, unhurried.')::jsonb
where module_id = 'ks4-19-readiness-at-16';

update schools.school_lessons
set slides = replace(slides::text,
      'Nova has been on the streets these techniques were built for', 'Nova has seen every one of these techniques up close')::jsonb
where module_id = 'ks4-15-manipulation-persuasion';

-- 7. Bloop wore Sofia's cape and Oliver's coral: the retired cast's clothes.
update schools.school_lessons
set slides = replace(slides::text, 'Bloop, our safety expert in green', 'Bloop, in green, with a shield to build today')::jsonb
where module_id = 'ks2-07-privacy-reputation';

update schools.school_lessons
set slides = replace(slides::text, 'Bloop''s coral energy', 'Bloop''s playful energy')::jsonb
where module_id = 'ks2-05-gaming-time-spend';

-- 8. Pronouns drifted for the same friend (he, she, it). The name, every time.
update schools.school_lessons
set slides = replace(slides::text, 'he loves them too', 'Bloop loves them too')::jsonb
where module_id = 'ks2-04-screen-routines';

-- The pause beats: "in as Bloop grows and out as it shrinks" names the
-- friend and then calls the friend "it". The star breath ("in as the star
-- grows and out as it shrinks") keeps its "it": the star is a thing.
update schools.school_lessons
set slides = regexp_replace(regexp_replace(slides::text,
      'in as (Pebble|Bloop|Orbit|Nova|Cosmo) grows and out as it shrinks', 'in as \1 grows and out as \1 shrinks', 'g'),
      'with (Pebble|Bloop|Orbit|Nova|Cosmo): in as it grows, out as it shrinks', 'with \1: in as \1 grows, out as \1 shrinks', 'g')::jsonb
where slides::text ~ '(in as (Pebble|Bloop|Orbit|Nova|Cosmo) grows and out as it shrinks|with (Pebble|Bloop|Orbit|Nova|Cosmo): in as it grows, out as it shrinks)';

-- 9. DiGi quoted Orbit saying something Orbit never said.
update schools.school_lessons
set slides = replace(slides::text, 'Orbit says steady wins, and Orbit is right.', 'Orbit says the pattern is the answer, and Orbit is right.')::jsonb
where module_id = 'ks3-10-mood-and-screens';

commit;
