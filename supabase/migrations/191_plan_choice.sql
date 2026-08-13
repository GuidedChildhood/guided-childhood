-- 191: the two doors, and the moment they are offered.
--
-- Nothing blocked on sign up, so nobody was ever asked to pay. Ten of the
-- eleven accounts on the platform read subscription_status 'free'.
--
-- The offer screen DID exist, last in onboarding, and it was unreachable in
-- practice: onboarding_complete is written four screens earlier, at
-- personalisation, and the init guard sends anybody carrying that flag
-- straight to the dashboard. So a reload, a closed tab, a lock screen, any
-- pause at all between DiGi's introduction and the last tap, and the one
-- screen in the product that asks for money was deleted for that parent for
-- ever.
--
-- The answer is not to move the write. It is to stop asking at sign up at
-- all. The offer now lands after the first check in, when a parent has given
-- something and had something back, so it arrives on a moment of value rather
-- than as a wall in front of one.
--
-- Three columns, all on profiles, so the gate costs no extra read: the
-- middleware already loads this row on every dashboard path it can block.

-- Which door they took: 'founder' (card now, charged when the free days end)
-- or 'free' (no card, the same free days, then a full block). Null means the
-- question has not been answered yet, which is what the block reads.
alter table profiles add column if not exists plan_choice text;
alter table profiles add column if not exists plan_choice_at timestamptz;

-- When their first ever check in landed. The check in is the baseline every
-- later reading is measured against, and it is also the moment that earns the
-- right to ask. Null means never checked in, and a family who has never
-- checked in is never shown the block.
alter table profiles add column if not exists first_checkin_at timestamptz;

comment on column profiles.plan_choice is
  'founder or free. Null means the two door block is still owed.';
comment on column profiles.first_checkin_at is
  'First ever check in. The baseline, and the moment the block may be shown.';

-- Anybody already on the platform has been here longer than the block is
-- meant to interrupt, so they are not walked into a decision screen on the
-- morning this ships. Existing subscribers are recorded as founders; everyone
-- else keeps a clean null and meets the block after their next first check in
-- only if they have never checked in at all.
update profiles
   set plan_choice = 'founder', plan_choice_at = now()
 where subscription_status in ('active', 'past_due')
   and plan_choice is null;
