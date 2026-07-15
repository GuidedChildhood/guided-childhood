-- Guided Childhood — Migration 059
-- How each child uses their app: own means their own device gets the app (their
-- tablet or phone, opened from the link or QR then added to the home screen),
-- coview means the grown up opens it on their own device and they do it
-- together, best for a very young child with no device of their own. Null means
-- not set yet, so the app falls back to a sensible default by age. Kept per
-- child so a family with a mix, say a nine, an eleven and a four year old, sets
-- each one the way that fits.

alter table public.children add column if not exists use_mode text
  check (use_mode in ('own', 'coview'));
