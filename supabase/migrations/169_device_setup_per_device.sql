-- Guided Childhood — Migration 169
-- Setting up is per screen, not per guide.
--
-- Justin, 8 August 2026, having just added two devices: "I've added these
-- devices and it is automatically saying set up although I haven't."
--
-- He was right and the cause is in the key. device_setup_progress has always
-- been keyed (user_id, device_key), where device_key names one of OUR published
-- guides. But one guide covers more than one screen: 'iphone' is the guide
-- called "iPhone and iPad", so a house with both has two rows in
-- family_devices pointing at one row in device_setup_progress. Tick the iPhone
-- and the iPad ticks itself. On his account the iPad added this morning
-- inherited a tick earned on the iPhone guide on 29 July, for settings nobody
-- had touched.
--
-- That is not a display bug. Screen Time is configured on the device, so an
-- iPad whose row says "settings in place" because a different iPad was done is
-- the app telling a parent their child is protected when they are not. It is
-- the one kind of wrong this page cannot be.
--
-- So a progress row can now belong to a specific screen in the house. Guide
-- level rows stay exactly as they are and keep their meaning, because the
-- coverage board and the catalogue are about which guides have been worked
-- through, not about which screens are safe.
--
-- Supabase editor rules: idempotent, no DO blocks, no semicolons inside string
-- literals, flat statements only.

alter table public.device_setup_progress
  add column if not exists family_device_id uuid references public.family_devices(id) on delete cascade;

-- The old unique(user_id, device_key) is the constraint that made two Apple
-- screens share one row, so it goes. Its replacement counts a null
-- family_device_id as a value rather than as unknown, which is what NULLS NOT
-- DISTINCT means and what keeps guide level rows one per guide while letting
-- each screen have its own. One constraint rather than two partial indexes,
-- deliberately: PostgREST can name it on conflict, and a partial index it
-- cannot name would have broken every upsert this table takes.
alter table public.device_setup_progress
  drop constraint if exists device_setup_progress_user_id_device_key_key;

alter table public.device_setup_progress
  drop constraint if exists device_setup_progress_user_key_device_uniq;

alter table public.device_setup_progress
  add constraint device_setup_progress_user_key_device_uniq
  unique nulls not distinct (user_id, device_key, family_device_id);

create index if not exists idx_device_setup_progress_family_device
  on public.device_setup_progress (family_device_id);

-- Carry every tick already earned onto a real screen, so nobody opens the page
-- tomorrow and finds their work gone.
--
-- Where two screens share a guide the tick is genuinely ambiguous: the parent
-- worked through "iPhone and iPad" once and we cannot know which one was in
-- their hand. It goes to the screen that has been in the list longest, which
-- keeps the tick they earned and leaves the newer screen honestly blank. That
-- is the right way round: an unticked screen that is actually set up costs a
-- parent one tap, and a ticked screen that is not costs a child their
-- protection.
insert into public.device_setup_progress (user_id, device_key, family_device_id, status, completed_at)
select p.user_id, p.device_key, first_owned.id, p.status, p.completed_at
from public.device_setup_progress p
join lateral (
  select fd.id
  from public.family_devices fd
  where fd.user_id = p.user_id
    and fd.guide_key = p.device_key
    and fd.retired_at is null
  order by fd.created_at asc, fd.id asc
  limit 1
) as first_owned on true
where p.family_device_id is null
  and p.status = 'done'
on conflict do nothing;
