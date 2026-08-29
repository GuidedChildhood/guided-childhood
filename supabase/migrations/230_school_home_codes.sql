-- Guided Childhood — Migration 230
-- Bridge a: the home code on every school module, so a lesson taught in class
-- can be credited at home, and a home educating family can use the same pack.
-- Plan: plans/2026-08-29-passport-codes-and-graduation-plan.md (merged, #922).
-- Numbers 228 and 229 belong to the curriculum session (White Rose plan, #923).
--
-- The shape of the bridge, decided in the plan:
--   One STATIC code per module, printed on the parent note sheet that already
--   goes home with every lesson. The whole class shares it, which is fine
--   because this is CREDIT, not assessment: the school said "we covered
--   this", the passport records it. The redemption route writes a
--   lesson_completions row with lesson_source 'school_lesson', the slot the
--   check constraint has held open since migration 023.
--   The stamp never records the venue (the Cambridge private candidate rule):
--   school and home earn the identical record.
--
-- HOME-XXXX in Crockford base32 (no I, L, O or U): short enough for a
-- worksheet, unambiguous read out loud. Low stakes by design, a guessed code
-- credits one module and unlocks nothing else.

alter table schools.school_lessons
  add column if not exists home_code text unique;

-- New modules get a code as they are seeded, the same pattern as the
-- passport number trigger in 227. Security definer so the collision check
-- sees every row regardless of who runs the seed.
create or replace function schools.set_home_code()
returns trigger
language plpgsql
security definer
set search_path = schools, public, extensions
as $$
declare
  alphabet constant text := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  raw bytea;
  candidate text;
  i int;
  attempt int := 0;
begin
  if new.home_code is not null then
    return new;
  end if;
  loop
    raw := gen_random_bytes(4);
    candidate := '';
    for i in 0..3 loop
      candidate := candidate || substr(alphabet, (get_byte(raw, i) % 32) + 1, 1);
    end loop;
    candidate := 'HOME-' || candidate;
    exit when not exists (
      select 1 from schools.school_lessons where home_code = candidate
    );
    attempt := attempt + 1;
    if attempt > 5 then
      raise exception 'could not allocate a home code after 5 attempts';
    end if;
  end loop;
  new.home_code := candidate;
  return new;
end;
$$;

drop trigger if exists school_lessons_home_code on schools.school_lessons;
create trigger school_lessons_home_code
  before insert on schools.school_lessons
  for each row execute function schools.set_home_code();

-- Backfill every existing module, row by row so each allocation sees the
-- previous ones. The unique constraint stays the final guarantee.
do $$
declare
  alphabet constant text := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  lesson record;
  raw bytea;
  candidate text;
  i int;
  attempt int;
begin
  for lesson in select id from schools.school_lessons where home_code is null loop
    attempt := 0;
    loop
      raw := extensions.gen_random_bytes(4);
      candidate := '';
      for i in 0..3 loop
        candidate := candidate || substr(alphabet, (get_byte(raw, i) % 32) + 1, 1);
      end loop;
      candidate := 'HOME-' || candidate;
      begin
        update schools.school_lessons set home_code = candidate where id = lesson.id;
        exit;
      exception when unique_violation then
        attempt := attempt + 1;
        if attempt > 5 then
          raise exception 'could not backfill a home code for %', lesson.id;
        end if;
      end;
    end loop;
  end loop;
end;
$$;
