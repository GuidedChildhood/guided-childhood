-- Screens wait: a parent can mark any quest as one that comes before
-- device time. The kid page lifts these to the top as the before screens
-- list, and the printed device time contract carries them as the first
-- clause. A prompt in the app ("the bedroom is not tidy") is just a one
-- off quest with this flag on.

alter table family_quests
  add column if not exists blocks_screens boolean not null default false;
