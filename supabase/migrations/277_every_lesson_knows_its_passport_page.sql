-- THE PASSPORT PROMISE, KEPT ON THE LESSON SIDE.
--
-- Every one of the 21 school modules already sends this home in its parent
-- note, and has since the scheme launched:
--
--   "Today filled a little of your child's passport page. The passport is the
--    journey to sixteen that home and school walk together ... each stage ends
--    with a stamp that is earned, never just a birthday reached."
--
-- Nothing recorded which page or which stamp. The council's passport check
-- scored 0 out of 10 on exactly that, and it is the one binary check in the
-- set: a module either knows what it earns or it does not.
--
-- This closes the lesson half. It writes no completion, no stamp and no code
-- for any child; public.stage_passports and the codes stay with the passport
-- codes lane, as the 31 August plan sets out. A lesson knowing its page is the
-- prerequisite for stamping one, not the stamping.
--
-- THE MAPPING IS DERIVED, NOT INVENTED. The only age signal a module carries is
-- its key stage, and the stage vocabulary and its key stage mapping already
-- exist on the parents side (lib/stickers/book.ts and
-- shared/curriculum-badges.ts). Reusing both is the point: one passport, two
-- products. shared/passport-stages.ts holds the map and the two honest
-- imprecisions in it.
--
-- KS5 FILLS NOTHING, ON PURPOSE. The passport is the journey TO sixteen and
-- Years 12 and 13 are past it. Those two modules record 'after' rather than
-- being left blank, because a blank cannot be told apart from work not done,
-- and a check that demanded all 21 name a stage would push somebody into
-- inventing a page for a child who has already finished the book.

begin;

update schools.school_lessons
set teacher_notes = coalesce(teacher_notes, '{}'::jsonb) || jsonb_build_object(
  'passport_stage',
  case key_stage
    when 'EYFS' then 'foundation'   -- Reception sits just under it; Pebble carries both
    when 'KS1'  then 'foundation'
    when 'KS2'  then 'builder'
    when 'KS3'  then 'shaper'       -- explorer straddles Y7 to Y8 and no module records that
    when 'KS4'  then 'independent'
    when 'KS5'  then 'after'        -- past sixteen, the book is finished
  end
)
where key_stage in ('EYFS', 'KS1', 'KS2', 'KS3', 'KS4', 'KS5');

-- ── Guards ──────────────────────────────────────────────────────────
do $$
declare
  n int;
  bad text[] := '{}';
  r record;
begin
  -- 1. Every module knows. This is the binary check made true, and it is
  --    stated over the whole table so a 22nd module cannot arrive silent.
  select count(*) into n from schools.school_lessons
  where teacher_notes->>'passport_stage' is null;
  if n > 0 then raise exception '% modules still do not know their passport page', n; end if;

  -- 2. Only vocabulary the parents app already understands. A stage invented
  --    here would be a stamp in the passport that nothing can ever award.
  select count(*) into n from schools.school_lessons
  where teacher_notes->>'passport_stage'
    not in ('foundation', 'builder', 'explorer', 'shaper', 'independent', 'after');
  if n > 0 then raise exception '% modules carry a passport stage nothing else knows', n; end if;

  -- 3. The mapping is the one in shared/passport-stages.ts, module by module.
  --    Asserted rather than assumed, because the update above and the TypeScript
  --    map are two copies of one decision and this is the only place they meet.
  for r in
    select module_id, key_stage, teacher_notes->>'passport_stage' as got,
      case key_stage
        when 'EYFS' then 'foundation' when 'KS1' then 'foundation'
        when 'KS2' then 'builder' when 'KS3' then 'shaper'
        when 'KS4' then 'independent' when 'KS5' then 'after'
      end as want
    from schools.school_lessons
  loop
    if r.got is distinct from r.want then
      bad := bad || format('%s (%s): %s, wanted %s', r.module_id, r.key_stage, r.got, r.want)::text;
    end if;
  end loop;
  if array_length(bad, 1) > 0 then
    raise exception 'passport mapping disagrees: %', array_to_string(bad, '; ');
  end if;

  -- 4. Exactly the two KS5 modules sit after the passport. If that count moves,
  --    somebody has either added a sixth form module or quietly excused a
  --    lesson that should be filling a page.
  select count(*) into n from schools.school_lessons
  where teacher_notes->>'passport_stage' = 'after';
  if n <> 2 then raise exception '% modules sit after the passport, expected 2', n; end if;

  -- 5. Nothing that belongs to the passport codes lane was touched.
  select count(*) into n from public.stage_passports;
  raise notice 'stage_passports untouched, % rows', n;
end $$;

commit;
