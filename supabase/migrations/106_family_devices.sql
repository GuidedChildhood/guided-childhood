-- Guided Childhood — Migration 106
-- The devices a family actually owns.
--
-- Until now the app had two half answers and no whole one. device_guides is a
-- catalogue of nineteen setup guides, some of which are not devices at all
-- (TikTok, WhatsApp), and the passport measured "devices set up" against that
-- whole catalogue, so a family with an iPad and a Switch was scored against
-- seventeen things they do not own. Meanwhile device_sessions.device was a
-- check constraint of four generic words, so a timer could only ever be
-- started on "tablet", never on Ella's iPad, and a house with two tablets had
-- no way to tell them apart.
--
-- family_devices is the missing middle: the real things in this home, named by
-- the parent, each optionally pointing at the setup guide that covers it. The
-- passport then measures their home rather than our catalogue, and a timer
-- runs against a device with a name on it.
--
-- The four word kinds stay, as the KIND of a device rather than its identity,
-- because every existing session, request and weekly breakdown is keyed on
-- them. Computer is added, since a Chromebook is the one real device a child
-- uses that the four words could not describe.
--
-- Supabase editor rules: idempotent creates, no DO blocks, no semicolons
-- inside string literals, flat statements only.

create table if not exists public.family_devices (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  -- What the family calls it. "Ella's iPad", "Living room TV", "The Switch".
  label       text        not null check (char_length(label) between 1 and 60),
  kind        text        not null check (kind in ('phone', 'tablet', 'tv', 'console', 'computer')),
  -- The device_guides row whose settings walkthrough covers this device, when
  -- one does. Deliberately a loose text key rather than a foreign key: guides
  -- get renamed and retired over time, and losing a guide should never delete
  -- a family's device.
  guide_key   text,
  -- A device the whole house shares, as opposed to one child's own. Shared
  -- devices still take timers, they just are not counted as anybody's phone.
  shared      boolean     not null default false,
  -- Sold, broken, outgrown. Kept rather than deleted so old sessions still
  -- say which device they ran on.
  retired_at  timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists idx_family_devices_user on public.family_devices (user_id, retired_at, created_at);

alter table public.family_devices enable row level security;

drop policy if exists "family_devices_own" on public.family_devices;

create policy "family_devices_own" on public.family_devices
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- A timer runs on a real device when we know one, and still runs on a kind
-- when we do not, so nothing that exists today stops working.
alter table public.device_sessions
  add column if not exists family_device_id uuid references public.family_devices(id) on delete set null;

alter table public.device_requests
  add column if not exists family_device_id uuid references public.family_devices(id) on delete set null;

-- Computer joins the four kinds, in both places they are checked.
alter table public.device_sessions drop constraint if exists device_sessions_device_check;

alter table public.device_sessions add constraint device_sessions_device_check
  check (device in ('phone', 'tablet', 'tv', 'console', 'computer'));

alter table public.device_requests drop constraint if exists device_requests_device_check;

alter table public.device_requests add constraint device_requests_device_check
  check (device in ('phone', 'tablet', 'tv', 'console', 'computer'));

-- Have we asked this family what is in their home? Null means never asked, so
-- the passport keeps its old catalogue based reading and the app prompts. Once
-- set, an empty list is a real answer and is treated as one.
alter table public.profiles
  add column if not exists devices_asked_at timestamptz;
