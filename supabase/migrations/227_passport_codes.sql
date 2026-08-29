-- Guided Childhood — Migration 227
-- The passport number: a public, human readable identifier for each child's
-- passport, so the printed keepsake can carry a code that a school, a club or
-- a grandparent can check at /verify.
-- Plan: plans/2026-08-29-passport-codes-and-graduation-plan.md (merged, #922).
--
-- Design rules carried in from the plan:
--   The document is a pointer, the database is the credential.
--   The code is PUBLIC, so it must reveal nothing by itself. It is not the
--   kid_links token (that is a secret credential and is never printed) and it
--   encodes no name, age, stage or date.
--   Shape GC-XXXX-XXXX in Crockford base32 (no I, L, O or U), so it survives
--   being read out loud over a phone or copied from a fridge door.
--   40 bits of randomness across 8 characters: at one guess per second it
--   takes on average seventeen thousand years to find one real code, and the
--   verify page answers a miss with silence.

-- ── The generator ───────────────────────────────────────────────────────────
-- Crockford base32 alphabet. gen_random_bytes needs pgcrypto, which Supabase
-- ships in the extensions schema; the guarded create covers a fresh database.

create extension if not exists pgcrypto with schema extensions;

create or replace function public.generate_passport_code()
returns text
language plpgsql
volatile
set search_path = public, extensions
as $$
declare
  alphabet constant text := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  raw bytea;
  code text := '';
  i int;
begin
  raw := gen_random_bytes(8);
  for i in 0..7 loop
    code := code || substr(alphabet, (get_byte(raw, i) % 32) + 1, 1);
  end loop;
  return 'GC-' || substr(code, 1, 4) || '-' || substr(code, 5, 4);
end;
$$;

-- ── The column ──────────────────────────────────────────────────────────────

alter table public.children
  add column if not exists passport_code text unique;

-- ── New children get a code as they are born ────────────────────────────────
-- A BEFORE INSERT trigger rather than app code, so every route that creates a
-- child (onboarding, add a child, anything future) is covered without
-- remembering to. The retry loop handles the astronomically unlikely clash.

-- Security definer, because the collision check must see EVERY child's code
-- and RLS would otherwise show an inserting parent only their own rows. The
-- unique constraint stays the final guarantee either way.
create or replace function public.set_passport_code()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  attempt int := 0;
begin
  if new.passport_code is not null then
    return new;
  end if;
  loop
    new.passport_code := public.generate_passport_code();
    exit when not exists (
      select 1 from public.children where passport_code = new.passport_code
    );
    attempt := attempt + 1;
    if attempt > 5 then
      raise exception 'could not allocate a passport code after 5 attempts';
    end if;
  end loop;
  return new;
end;
$$;

drop trigger if exists children_passport_code on public.children;
create trigger children_passport_code
  before insert on public.children
  for each row execute function public.set_passport_code();

-- ── Backfill every existing child ───────────────────────────────────────────
-- Row by row so the unique check sees each earlier allocation. The unique
-- constraint remains the final guarantee.

do $$
declare
  child record;
  candidate text;
  attempt int;
begin
  for child in select id from public.children where passport_code is null loop
    attempt := 0;
    loop
      candidate := public.generate_passport_code();
      begin
        update public.children set passport_code = candidate where id = child.id;
        exit;
      exception when unique_violation then
        attempt := attempt + 1;
        if attempt > 5 then
          raise exception 'could not backfill a passport code for %', child.id;
        end if;
      end;
    end loop;
  end loop;
end;
$$;
