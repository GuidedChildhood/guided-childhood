-- Guided Childhood — Migration 166
--
-- One row per device, so one reminder is one buzz.
--
-- Justin, 6 August 2026: "Every reminder eg jobs or agree timer seems to send 4
-- pwas to child's phone."
--
-- Counted in the live database rather than guessed:
--
--   (parent)  fcm.googleapis.com      17 rows   4 July to 31 July
--   (parent)  web.push.apple.com       6 rows   4 July to 11 July
--   Teo       web.push.apple.com       5 rows  14 July to 31 July
--
-- Teo has one phone. He has five subscriptions to it, and four of them still
-- deliver, which is exactly the four buzzes. His parent is on twenty three.
--
-- ── Why the rows pile up ────────────────────────────────────────────────────
--
-- Both subscribe routes upsert `onConflict: 'endpoint'`, and an endpoint is not
-- a device. A push service hands out a NEW endpoint whenever the subscription
-- is recreated: reinstalling the PWA, clearing site data, an iOS update, or the
-- service rotating it on its own schedule. Every one of those inserts a fresh
-- row, and nothing ever removes the one before it, because the old endpoint
-- usually keeps accepting messages for a while and the send path only deletes
-- on a permanent refusal.
--
-- So the table is not a list of devices, it is a log of every subscription that
-- device has ever had, and every send fans out across the whole log.
--
-- This is the same fault as the school reminder test earlier today, which was
-- patched in one route. It was never one route. It is every sender.
--
-- ── What changes ────────────────────────────────────────────────────────────
--
-- device_id is a stable id the browser makes once and keeps in localStorage. It
-- survives the endpoint rotating, which is the whole point, and it is the only
-- thing that can tell "this phone again" from "a second phone". The subscribe
-- routes now clear a device's older rows before writing the new one.
--
-- No unique index on it. A subscribe is best effort and runs while a child is
-- looking at a permission prompt, and turning a lost race into a 500 there
-- would trade four buzzes for no reminders at all. The routes delete then write
-- in one request, and lib/push/devices.ts collapses anything that still slips
-- through at send time, which is where it actually matters.
--
-- ── The cleanup below ───────────────────────────────────────────────────────
--
-- Keeps the NEWEST row per user, per child, per push service host, and deletes
-- the rest. One phone talks to exactly one push service, so the host is the
-- best identity available for rows written before device_id existed.
--
-- It is not perfect. A parent with a phone and a laptop both on Chrome shares
-- fcm.googleapis.com and will lose the older of the two. That is a real cost
-- and it is worth it: they are being sent seventeen copies of every message
-- today, the lost device resubscribes the next time they open the app, and from
-- then on device_id keeps genuine second devices apart properly.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

alter table public.push_subscriptions
  add column if not exists device_id text;

comment on column public.push_subscriptions.device_id is
  'Stable per browser id from localStorage. Survives endpoint rotation, so one device keeps one row instead of accumulating one per resubscribe. Null on rows written before migration 166.';

create index if not exists idx_push_subscriptions_device
  on public.push_subscriptions (user_id, child_id, device_id);

-- The accumulated duplicates. Newest wins, per family, per child, per host.
--
-- coalesce on child_id because a parent row has child_id null and null never
-- equals null, so without it every parent row lands in its own group and
-- nothing is ever removed.
delete from public.push_subscriptions p
using (
  select id,
         row_number() over (
           partition by
             user_id,
             coalesce(child_id, '00000000-0000-0000-0000-000000000000'::uuid),
             split_part(split_part(endpoint, '//', 2), '/', 1)
           order by coalesce(updated_at, created_at) desc nulls last, created_at desc nulls last, id desc
         ) as rn
  from public.push_subscriptions
) ranked
where p.id = ranked.id
  and ranked.rn > 1;
