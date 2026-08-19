-- Guided Childhood — Migration 217
-- A device belongs to a child, even when the telly is the same telly.
--
-- Justin, 19 August 2026: "devices, yes, need to add per child, so when they
-- use the timer they click their device so reports work. The same device might
-- be used by both children but that's ok, as it's not an actual device id, just
-- 'smart TV' for example. So devices are added per child, and if both are
-- watching they need to start both timers, as it might be child specific."
--
-- That settles a question this schema was hedging. family_devices carries a
-- `shared` boolean, which is the other model: one physical thing, several
-- users. Justin's answer is simpler and truer to what the product measures. It
-- is not tracking a television, it is tracking a child's time, and the label is
-- only there so a parent recognises what they are looking at. Two children
-- watching the same telly is TWO sessions, because it is two childhoods.
--
-- device_sessions and device_requests already have child_id and always did, so
-- the timers and the balance reports have been per child all along. It is the
-- device LIST and its setup progress that were not.
--
-- Null keeps the old meaning: a household device every child can pick, which is
-- what every existing row is.

alter table public.family_devices
  add column if not exists child_id uuid references public.children(id) on delete cascade;

alter table public.device_setup_progress
  add column if not exists child_id uuid references public.children(id) on delete cascade;

update public.family_devices d set child_id = k.id
from public.children k
where d.child_id is null and k.parent_id = d.user_id
  and (select count(*) from public.children c2 where c2.parent_id = d.user_id) = 1;

update public.device_setup_progress p set child_id = k.id
from public.children k
where p.child_id is null and k.parent_id = p.user_id
  and (select count(*) from public.children c2 where c2.parent_id = p.user_id) = 1;

do $$
declare con_name text;
begin
  select c.conname into con_name
  from pg_constraint c
  join pg_class cl on cl.oid = c.conrelid
  join pg_namespace n on n.oid = cl.relnamespace
  where n.nspname='public' and cl.relname='device_setup_progress' and c.contype='u'
  limit 1;
  if con_name is not null then
    execute format('alter table public.device_setup_progress drop constraint %I', con_name);
  end if;
end $$;

create unique index if not exists uq_device_setup_child
  on public.device_setup_progress (user_id, child_id, device_key, family_device_id)
  nulls not distinct where child_id is not null;

create unique index if not exists uq_device_setup_family
  on public.device_setup_progress (user_id, device_key, family_device_id)
  nulls not distinct where child_id is null;

create index if not exists idx_family_devices_child on public.family_devices (user_id, child_id) where retired_at is null;
