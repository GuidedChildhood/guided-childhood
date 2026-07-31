-- What the child was actually doing, for the devices where the device cannot say.
--
-- The balance model sorts screen time into four activity buckets and treats
-- them differently: watching, gaming and social are kept in check, learning is
-- invited upward. Four of the five devices answer that question by themselves.
-- A console is gaming, a TV is watching, a phone is social.
--
-- A computer is all four, and bucketForDevice had no case for it. It matched
-- chromebook, laptop, desktop and pc under learning and never matched
-- `computer`, which is the key the app actually stores, so every computer
-- session fell through to the watching default. Homework was counted against
-- the watching guide, and the learning bucket the child was filling stayed
-- empty and carried on nudging them to do more of what they were already doing.
--
-- So the child is asked, once, at the moment they pick the device. Stored here
-- rather than guessed later.
--
-- Nullable on purpose, and left null for every device that does not need it.
-- A null means "read it from the device", which is exactly right for the four
-- unambiguous ones and for every session written before this column existed.
-- Backfilling the old computer rows is not possible and not honest: nobody
-- knows what those children were doing, and inventing a bucket for them would
-- put made up minutes into a report a parent is meant to trust.

alter table device_sessions
  add column if not exists activity text;

comment on column device_sessions.activity is
  'learning, watching, gaming or social. Null means infer from the device, which is correct for every device except computer.';

-- The same on the ask, so a request that waits for a parent's yes carries the
-- answer with it. Without this the child picks Homework, waits, gets approved,
-- and the session starts having forgotten what they said.
alter table device_requests
  add column if not exists activity text;

comment on column device_requests.activity is
  'Carried onto the session when the ask is approved. Same values as device_sessions.activity.';

-- Both are constrained rather than free text, because this column decides which
-- guide a minute counts against and a typo would silently move minutes between
-- buckets. Null stays allowed and stays the default.
alter table device_sessions
  drop constraint if exists device_sessions_activity_check;
alter table device_sessions
  add constraint device_sessions_activity_check
  check (activity is null or activity in ('learning', 'watching', 'gaming', 'social'));

alter table device_requests
  drop constraint if exists device_requests_activity_check;
alter table device_requests
  add constraint device_requests_activity_check
  check (activity is null or activity in ('learning', 'watching', 'gaming', 'social'));
