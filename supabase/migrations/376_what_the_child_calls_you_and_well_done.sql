-- 376: what the child calls the grown up, and a well done the child can read.
--
-- Justin, 13 October 2026, approving the parent side of the child's home:
-- the child's app names the grown up "if it is set on the account". It was
-- not set anywhere (profiles holds only full_name, and a child does not call
-- their dad Justin), so the app said "Mum or Dad". This column is that
-- setting, per child, because each child calls the same parent their own way.
--
-- And the bell gains the child's wins (a finished day, a passed lesson) with a
-- Send a well done button. The well done lands in kid_nudges like every other
-- note to the child; kind and ref say what it was for, so the win leaves the
-- bell once it has been answered and can never be sent twice.
--
-- Additive and idempotent. The code reads every column here softly, so it
-- runs the same before this lands, with "Mum or Dad" and wins that stay in
-- the bell for their two days.

alter table public.children add column if not exists calls_grown_up text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'children_calls_grown_up_len') then
    alter table public.children add constraint children_calls_grown_up_len
      check (calls_grown_up is null or char_length(calls_grown_up) between 1 and 24);
  end if;
end $$;

alter table public.kid_nudges add column if not exists kind text;
alter table public.kid_nudges add column if not exists ref text;

create unique index if not exists kid_nudges_one_well_done
  on public.kid_nudges (child_id, ref) where kind = 'well_done';
