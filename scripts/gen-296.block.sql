do $$
declare
  r record;
  s jsonb; x jsonb; o jsonb;
  n int; i int; ti int; fp int; ld int;
  run int; maxrun int; srun int; smax_before int; smax_after int;
  reduced boolean; added int; tot int; lead int; m text; timing text;
  total_before int; total_after int; bad int;
begin
  select coalesce(sum(jsonb_array_length(slides)), 0) into total_before from schools.school_lessons;

  -- 0. the holding table holds the 24 non pilot modules and nothing else
  if (select count(*) from schools._m296) <> 24 then
    raise exception 'guard 0: expected 24 beat rows, found %', (select count(*) from schools._m296);
  end if;
  if exists (select 1 from schools._m296 where module_id = 'ks3-12-misinfo-deepfakes') then
    raise exception 'guard 0: the pilot must not be touched';
  end if;
  if (select count(*) from schools._m296 h join schools.school_lessons l using (module_id)) <> 24 then
    raise exception 'guard 0: a beat row names a module that does not exist';
  end if;

  -- 1. no dash in any new copy (the text fields, not the identifiers)
  select count(*) into bad from (
    select t from schools._m296 h, lateral (
      select unnest(array[
        coalesce(h.arrival->>'heading',''), coalesce(h.arrival->>'script',''),
        h.pause->>'script', h.pause->'config'->>'heading', h.pause->'config'->>'prompt',
        h.mission->>'heading', h.mission->>'script', coalesce(h.title_line,'')
      ] || array(select jsonb_array_elements_text(coalesce(h.arrival->'lines','[]'::jsonb)))
        || array(select jsonb_array_elements_text(h.mission->'lines'))) as t
    ) q
  ) q2 where t ~ '[‐-―]' or t ~ '[A-Za-z] - [A-Za-z]' or t ~ '[A-Za-z]-[A-Za-z]';
  if bad > 0 then raise exception 'guard 1: % new copy strings carry a dash', bad; end if;

  for r in select * from schools._m296 order by module_id loop
    select slides into s from schools.school_lessons where module_id = r.module_id;
    n := jsonb_array_length(s);
    ti := null; fp := null; ld := null;
    for i in 0..n-1 loop
      if ti is null and s->i->>'type' = 'title' then ti := i; end if;
      if fp is null and s->i->>'phase' = 'practise' then fp := i; end if;
      if s->i->>'type' = 'digi' then ld := i; end if;
    end loop;

    -- 2. the deck has the shape the splice assumes
    if ti is null or fp is null or ld is null then
      raise exception 'guard 2: % has no title, practise phase or digi close', r.module_id;
    end if;
    if ld <> n - 1 then raise exception 'guard 2: % does not close on DiGi', r.module_id; end if;
    if ti >= fp then raise exception 'guard 2: % title after practise', r.module_id; end if;

    -- 3. an arrival goes exactly where no video beat already plays
    if r.arrival is not null and s->(ti+1)->>'type' = 'video' then
      raise exception 'guard 3: % already has a video arrival', r.module_id;
    end if;
    if r.arrival is null and coalesce(s->(ti+1)->>'type', '') <> 'video' then
      raise exception 'guard 3: % has neither an arrival beat nor a video', r.module_id;
    end if;

    -- the stricter contract rule, before
    srun := 0; smax_before := 0;
    for i in 0..n-1 loop
      x := s->i;
      if x->>'type' in ('choice','discussion','interactive','tryit') then srun := 0;
      else srun := srun + coalesce((x->>'minutes')::int, 0); if srun > smax_before then smax_before := srun; end if; end if;
    end loop;

    -- the splice
    o := '[]'::jsonb; reduced := false;
    for i in 0..n-1 loop
      x := s->i;
      if i = ti then
        x := x || jsonb_build_object('character', r.title_key);
        if r.title_line is not null then x := x || jsonb_build_object('line', r.title_line); end if;
      end if;
      if i = fp then o := o || r.pause; end if;
      if i = ld then
        if (x->>'minutes')::int >= 2 then
          x := jsonb_set(x, '{minutes}', to_jsonb((x->>'minutes')::int - 1));
          reduced := true;
        end if;
        o := o || r.mission;
      end if;
      o := o || x;
      if i = ti and r.arrival is not null then o := o || r.arrival; end if;
    end loop;

    -- 4. the council's engagement rule holds afterwards, and the stricter
    --    contract rule is no worse than it was
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
    if maxrun > 4 then raise exception 'guard 4: % has a passive run of % minutes after the beats', r.module_id, maxrun; end if;
    if smax_after > greatest(smax_before, 4) then
      raise exception 'guard 4: % strict passive run grew from % to %', r.module_id, smax_before, smax_after;
    end if;

    -- 5. the timing string keeps telling the truth
    select teacher_notes->>'timing' into timing from schools.school_lessons where module_id = r.module_id;
    lead := substring(timing from '^\d+')::int;
    if lead is null then raise exception 'guard 5: % timing has no leading total', r.module_id; end if;
    added := (case when r.arrival is null then 0 else 1 end) + 1 + (case when reduced then 0 else 1 end);
    timing := regexp_replace(timing, '^\d+', (lead + added)::text);
    if r.arrival is not null then
      m := substring(timing from 'starter (\d+)');
      if m is null then raise exception 'guard 5: % timing has no starter count', r.module_id; end if;
      timing := regexp_replace(timing, 'starter \d+', 'starter ' || (m::int + 1)::text);
    end if;
    m := substring(timing from 'practi[cs]e (\d+)');
    if m is null then raise exception 'guard 5: % timing has no practise count', r.module_id; end if;
    timing := regexp_replace(timing, '(practi[cs]e) \d+', '\1 ' || (m::int + 1)::text);
    if not reduced then
      m := substring(timing from 'close (\d+)');
      if m is null then raise exception 'guard 5: % timing has no close count', r.module_id; end if;
      timing := regexp_replace(timing, 'close \d+', 'close ' || (m::int + 1)::text);
    end if;
    if lead + added <> tot then
      raise exception 'guard 5: % timing would state % but the deck runs %', r.module_id, lead + added, tot;
    end if;

    update schools.school_lessons
       set slides = o,
           teacher_notes = jsonb_set(teacher_notes, '{timing}', to_jsonb(timing))
     where module_id = r.module_id;
  end loop;

  -- the pilot's title stops naming a July slot
  update schools.school_lessons
     set slides = jsonb_set(slides, '{0,character}', '"orbit"'::jsonb)
   where module_id = 'ks3-12-misinfo-deepfakes' and slides->0->>'type' = 'title';

  -- 6. the scheme grew by exactly the beats: 20 arrivals, 24 pauses, 24 missions
  select sum(jsonb_array_length(slides)) into total_after from schools.school_lessons;
  if total_after <> total_before + 68 then
    raise exception 'guard 6: the scheme has % slides, expected %', total_after, total_before + 68;
  end if;

  -- 7. every title in the scheme now carries a real key
  -- (aliased sl, not x: x is a variable of this block and Postgres refuses
  -- the ambiguity, which rolled the first run back before it wrote a thing)
  select count(*) into bad from schools.school_lessons l, jsonb_array_elements(l.slides) sl
   where sl->>'type' = 'title' and coalesce(sl->>'character','') not in ('pebble','bloop','orbit','nova','cosmo','digi');
  if bad > 0 then raise exception 'guard 7: % title slides still carry an unknown character key', bad; end if;

  raise notice '296 applied: % slides before, % after', total_before, total_after;
end $$;
