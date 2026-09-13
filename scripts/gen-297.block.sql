do $$
declare
  r record;
  s jsonb; x jsonb; o jsonb;
  n int; i int; ld int; removed int; added int;
  run int; maxrun int; srun int; smax_before int; smax_after int;
  tot int; lead int; m text; timing text;
  total_before int; total_after int; bad int;
begin
  select coalesce(sum(jsonb_array_length(slides)), 0) into total_before from schools.school_lessons;

  -- 0. one beat per module with a page, and nothing for the two after it
  if (select count(*) from schools._m297) <> 23 then
    raise exception 'guard 0: expected 23 beat rows, found %', (select count(*) from schools._m297);
  end if;
  if (select count(*) from schools._m297 h join schools.school_lessons l using (module_id)) <> 23 then
    raise exception 'guard 0: a beat row names a module that does not exist';
  end if;
  if exists (select 1 from schools._m297 h join schools.school_lessons l using (module_id) where l.key_stage = 'KS5') then
    raise exception 'guard 0: a KS5 module must not carry a passport beat';
  end if;
  if (select count(*) from schools.school_lessons where coalesce(teacher_notes->>'passport_stage', '') not in ('', 'after')) <> 23 then
    raise exception 'guard 0: the scheme has % modules with a page, expected 23',
      (select count(*) from schools.school_lessons where coalesce(teacher_notes->>'passport_stage', '') not in ('', 'after'));
  end if;

  -- 1. no dash in any new copy
  select count(*) into bad from (
    select unnest(array[
      h.beat->>'script', h.beat->'config'->>'heading', h.beat->'config'->>'prompt',
      h.beat->'config'->>'after', h.beat->'config'->>'button'
    ]) as t from schools._m297 h
  ) q where t ~ '[‐-―]' or t ~ '[A-Za-z] - [A-Za-z]' or t ~ '[A-Za-z]-[A-Za-z]';
  if bad > 0 then raise exception 'guard 1: % new copy strings carry a dash', bad; end if;

  for r in select h.module_id, h.beat, l.slides, l.teacher_notes
             from schools._m297 h join schools.school_lessons l using (module_id) order by h.module_id loop
    s := r.slides;
    n := jsonb_array_length(s);

    -- 3. the beat names its own module and the page the row already knows
    if r.beat->>'type' <> 'interactive' or r.beat->>'component' <> 'passport-page' or r.beat->>'phase' <> 'close' then
      raise exception 'guard 3: % beat is not a close phase passport-page interactive', r.module_id;
    end if;
    if r.beat->'config'->>'moduleId' is distinct from r.module_id then
      raise exception 'guard 3: % beat names another module', r.module_id;
    end if;
    if coalesce(r.teacher_notes->>'passport_stage', '') in ('', 'after') then
      raise exception 'guard 3: % has no passport page', r.module_id;
    end if;
    if r.beat->'config'->>'placement' is distinct from r.teacher_notes->>'passport_stage' then
      raise exception 'guard 3: % beat says page % but the row says %', r.module_id,
        r.beat->'config'->>'placement', r.teacher_notes->>'passport_stage';
    end if;

    -- 2. the deck closes on DiGi and carries no beat yet
    ld := null;
    for i in 0..n-1 loop
      if s->i->>'type' = 'digi' then ld := i; end if;
      if s->i->>'type' = 'interactive' and s->i->>'component' = 'passport-page' then
        raise exception 'guard 2: % already carries a passport beat', r.module_id;
      end if;
    end loop;
    if ld is null or ld <> n - 1 then raise exception 'guard 2: % does not close on DiGi', r.module_id; end if;

    -- the stricter contract rule, before
    srun := 0; smax_before := 0;
    for i in 0..n-1 loop
      x := s->i;
      if x->>'type' in ('choice','discussion','interactive','tryit') then srun := 0;
      else srun := srun + coalesce((x->>'minutes')::int, 0); if srun > smax_before then smax_before := srun; end if; end if;
    end loop;

    -- the splice: lesson 1's old passport slide out, the beat in before the close
    o := '[]'::jsonb; removed := 0;
    for i in 0..n-1 loop
      x := s->i;
      if x->>'type' = 'digi' and x->>'heading' = 'The passport' then
        removed := removed + coalesce((x->>'minutes')::int, 0);
        continue;
      end if;
      if i = ld then o := o || r.beat; end if;
      o := o || x;
    end loop;

    -- 4. the council's rule holds afterwards, and the stricter rule is no worse
    run := 0; maxrun := 0; srun := 0; smax_after := 0; tot := 0;
    for i in 0..jsonb_array_length(o)-1 loop
      x := o->i;
      tot := tot + coalesce((x->>'minutes')::int, 0);
      if x->>'type' in ('choice','discussion','tryit','interactive','scenario','quote')
         or (x->>'type' = 'diagram' and jsonb_array_length(coalesce(x->'verdicts','[]'::jsonb)) > 0) then
        run := 0;
      else
        run := run + coalesce((x->>'minutes')::int, 0);
        if run > maxrun then maxrun := run; end if;
      end if;
      if x->>'type' in ('choice','discussion','interactive','tryit') then srun := 0;
      else srun := srun + coalesce((x->>'minutes')::int, 0); if srun > smax_after then smax_after := srun; end if; end if;
    end loop;
    if maxrun > 4 then raise exception 'guard 4: % has a passive run of % minutes after the beat', r.module_id, maxrun; end if;
    if smax_after > greatest(smax_before, 4) then
      raise exception 'guard 4: % strict passive run grew from % to %', r.module_id, smax_before, smax_after;
    end if;

    -- 5. the timing string keeps telling the truth
    timing := r.teacher_notes->>'timing';
    lead := substring(timing from '^\d+')::int;
    if lead is null then raise exception 'guard 5: % timing has no leading total', r.module_id; end if;
    added := coalesce((r.beat->>'minutes')::int, 0) - removed;
    if added <> 0 then
      timing := regexp_replace(timing, '^\d+', (lead + added)::text);
      m := substring(timing from 'close (\d+)');
      if m is null then raise exception 'guard 5: % timing has no close count', r.module_id; end if;
      timing := regexp_replace(timing, 'close \d+', 'close ' || (m::int + added)::text);
    end if;
    if lead + added <> tot then
      raise exception 'guard 5: % timing would state % but the deck runs %', r.module_id, lead + added, tot;
    end if;

    update schools.school_lessons
       set slides = o,
           teacher_notes = jsonb_set(teacher_notes, '{timing}', to_jsonb(timing))
     where module_id = r.module_id;
  end loop;

  -- 6. the scheme grew by exactly the beats less lesson 1's old slide
  select sum(jsonb_array_length(slides)) into total_after from schools.school_lessons;
  if total_after <> total_before + 22 then
    raise exception 'guard 6: the scheme has % slides, expected %', total_after, total_before + 22;
  end if;

  -- 7. every module with a page carries exactly one beat naming itself, right
  --    before the close; no module after the passport carries one
  select count(*) into bad from schools.school_lessons l
   where coalesce(l.teacher_notes->>'passport_stage', '') not in ('', 'after')
     and (select count(*) from jsonb_array_elements(l.slides) sl
           where sl->>'type' = 'interactive' and sl->>'component' = 'passport-page'
             and sl->'config'->>'moduleId' = l.module_id
             and sl->'config'->>'placement' = l.teacher_notes->>'passport_stage') <> 1;
  if bad > 0 then raise exception 'guard 7: % modules with a page do not carry exactly one beat naming themselves', bad; end if;
  select count(*) into bad from schools.school_lessons l
   where coalesce(l.teacher_notes->>'passport_stage', '') not in ('', 'after')
     and l.slides->(jsonb_array_length(l.slides) - 2)->>'component' is distinct from 'passport-page';
  if bad > 0 then raise exception 'guard 7: % beats are not right before the close', bad; end if;
  select count(*) into bad from schools.school_lessons l
   where l.teacher_notes->>'passport_stage' = 'after'
     and exists (select 1 from jsonb_array_elements(l.slides) sl where sl->>'component' = 'passport-page');
  if bad > 0 then raise exception 'guard 7: % modules after the passport carry a beat', bad; end if;
  select count(*) into bad from schools.school_lessons l, jsonb_array_elements(l.slides) sl
   where sl->>'type' = 'digi' and sl->>'heading' = 'The passport';
  if bad > 0 then raise exception 'guard 7: % old passport digi slides survived', bad; end if;

  raise notice '297 applied: % slides before, % after', total_before, total_after;
end $$;
