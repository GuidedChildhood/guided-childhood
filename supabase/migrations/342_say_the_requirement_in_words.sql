-- 342: the statutory evidence row names its requirement in words.
--
-- Migration 341 gave ks3-12 its evidence base, and its first row cited the
-- deepfakes requirement by its id, RSHE-S-OSA-7. That id is teacher facing
-- copy on the lesson page, and the module contract counts a hyphen between two
-- letters as a dash in copy, deliberately: "AI-Native" once slipped through a
-- cited title the same way and was only found by eye. The contract caught this
-- one, after 341 had been applied, which is the order the checks should not
-- have run in. Next time the contract runs on the mirror before production.
--
-- Same requirement, said the way the data file itself describes it: the
-- secondary phase, the online safety and awareness strand, item 7. A teacher
-- finds it on the RSHE page by exactly those words.
--
-- One field in one row, so no table backup: the update fires only on the
-- exact old text, and the old text is written out below, which makes this file
-- its own undo.

begin;

update schools.school_lessons l
   set teacher_notes = jsonb_set(l.teacher_notes, '{evidence_base,0,source}', to_jsonb(
     'Department for Education, Relationships Education, RSE and Health Education, July 2025, in force 1 September 2026. Secondary, online safety and awareness, item 7. The full mapping, requirement by requirement, is on the RSHE page.'::text))
 where l.module_id = 'ks3-12-misinfo-deepfakes'
   and l.teacher_notes #>> '{evidence_base,0,source}' =
     'Department for Education, Relationships Education, RSE and Health Education, July 2025, in force 1 September 2026, requirement RSHE-S-OSA-7. The full mapping, requirement by requirement, is on the RSHE page.';

do $$
begin
  if not exists (
    select 1 from schools.school_lessons
     where module_id = 'ks3-12-misinfo-deepfakes'
       and teacher_notes #>> '{evidence_base,0,source}' like '%Secondary, online safety and awareness, item 7.%'
  ) then
    raise exception '342 aborted, evidence row 0 was not the text this was written against';
  end if;
  -- Scoped to the evidence base, which is all copy. The rest of teacher_notes
  -- holds identifiers the contract exempts, such as a tool's component id, so
  -- scanning the whole object would abort on a hyphen that is allowed.
  if exists (
    select 1 from schools.school_lessons
     where module_id = 'ks3-12-misinfo-deepfakes'
       and (teacher_notes->'evidence_base')::text ~* '(?<=[a-z])-(?=[a-z])'
  ) then
    raise exception '342 aborted, a letter to letter hyphen is still in the evidence base';
  end if;
end $$;

commit;
