-- Guided Childhood — Migration 215
-- School items and family agreements belong to one child.
--
-- ── SCHOOL ────────────────────────────────────────────────────────────────
--
-- school_actions has carried NO child_id across 214 migrations. It does have
-- added_by_child_id, which is a different question entirely: who typed it in,
-- not whose it is. So every school item lands on every child. The seven year
-- old sees GCSE coursework and the fourteen year old sees show and tell, and
-- sent_to_child is one boolean for the household, so sending an item to one
-- child marks it sent to all of them.
--
-- ── AGREEMENTS ────────────────────────────────────────────────────────────
--
-- Justin, 19 August 2026, confirming after his brief said household level:
-- "yes sorry, child level."
--
-- He is right, and the table already half knew: family_agreements carries a
-- stage_id, so it has always been shaped by ONE child's stage while being
-- unique on user_id. A household with a six year old and a fourteen year old
-- has one agreement at one stage, and it is wrong for at least one of them.
--
-- The existing agreement keeps a null child. That is not a gap, it is what it
-- is: the household agreement this family actually signed, which counts for
-- everybody until a per child one replaces it. Assigning it to a child would be
-- inventing a fact about which child it was written for.
--
-- Additive and loosening. Nothing is deleted and no existing row can violate
-- the replacement key.

alter table public.school_actions add column if not exists child_id uuid references public.children(id) on delete cascade;
alter table public.family_agreements add column if not exists child_id uuid references public.children(id) on delete cascade;

do $$
declare con_name text;
begin
  select c.conname into con_name
  from pg_constraint c
  join pg_class cl on cl.oid = c.conrelid
  join pg_namespace n on n.oid = cl.relnamespace
  where n.nspname='public' and cl.relname='family_agreements' and c.contype='u'
    and (select array_agg(a.attname::text order by a.attname)
         from unnest(c.conkey) k join pg_attribute a on a.attrelid=c.conrelid and a.attnum=k)
        = array['user_id']
  limit 1;
  if con_name is not null then
    execute format('alter table public.family_agreements drop constraint %I', con_name);
  end if;
end $$;

create unique index if not exists uq_family_agreements_child
  on public.family_agreements (user_id, child_id) where child_id is not null;
create unique index if not exists uq_family_agreements_family
  on public.family_agreements (user_id) where child_id is null;

-- A school item on a one child account is unambiguous. On a bigger family it
-- stays null and keeps landing for everybody, which is what it did yesterday,
-- until the parent says whose it is.
update public.school_actions t set child_id = k.id
from public.children k
where t.child_id is null and k.parent_id = t.user_id
  and (select count(*) from public.children c2 where c2.parent_id = t.user_id) = 1;

create index if not exists idx_school_actions_child on public.school_actions (user_id, child_id, due_date);
create index if not exists idx_family_agreements_child on public.family_agreements (user_id, child_id);
