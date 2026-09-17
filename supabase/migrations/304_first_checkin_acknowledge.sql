-- DAY ONE ACKNOWLEDGES, IT DOES NOT RATE.
--
-- Justin, 17 September 2026, after signing up a fresh account and watching his
-- own first check in: "it's just to acknowledge first concerns raised so seems
-- overkill to ask them to do a check in maybe we should just acknowledge they
-- are added to solve first and are on next day".
--
-- Read from production on that account: seven concerns written fifteen seconds
-- after the account existed, and all seven rated between 20:59:29 and 21:00:04.
-- Seven ratings in thirty five seconds, every one scored the same, by a parent
-- who had not yet watched a single day with any of those worries in mind. That
-- reading is what the weekly email compares against, what the passport stamp is
-- earned from, and what sits behind every "is it getting better" sentence in
-- the product.
--
-- WHY THIS IS ITS OWN COLUMN and not a reuse of first_checkin_at. The two now
-- mean different things:
--
--   concerns_confirmed_at  they have seen their list and agreed we start on it
--   first_checkin_at       they have given us a reading
--
-- lib/checkin/today.ts keys its review filter ("do not ask about something
-- flagged today") off the second one, and that must keep being true, or the
-- baseline gets deleted on the day a family signs up. That exact bug has been
-- fixed twice already. It does not get a third go.
alter table profiles add column if not exists concerns_confirmed_at timestamptz;

comment on column profiles.concerns_confirmed_at is
  'When the parent confirmed the worries we start on. Null means day one: show the acknowledgement rather than the rating.';

-- EVERY FAMILY ALREADY HERE HAS OBVIOUSLY SEEN THEIR LIST, because they have
-- rated it. Without this backfill the change would hand the acknowledgement
-- screen to households on week ten, which is a screen that says "these are the
-- ones we start on" about worries they have been working for months.
update profiles
   set concerns_confirmed_at = first_checkin_at
 where concerns_confirmed_at is null
   and first_checkin_at is not null;
