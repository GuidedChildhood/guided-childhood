-- Guided Childhood — Migration 303
-- The letterbox, unparked, and made easy enough that a parent finishes it.
--
-- Justin, 17 September 2026: "yes the MX is live, unpark it and do slice 0 but
-- before we go ahead we need to make super easy for user to set up as this was
-- the issue."
--
-- Setup was the issue, and the shape of the problem was typing. The old flow
-- asked for a school name AND a comma separated list of the school's sender
-- addresses BEFORE it would hand over an address. Nobody knows their school's
-- noreply address, so the first screen of the feature was a question its own
-- user cannot answer.
--
-- So the address now comes first and costs nothing, and everything we used to
-- ask for is learned from the first email that arrives.
--
-- 1. school_name becomes nullable. An address can exist before we know whose
--    school it is. The first email tells us, and the parent confirms with one
--    tap instead of typing.
-- 2. The arrival stamps. A parent who has just set up forwarding is staring at
--    the screen wondering whether it worked; the setup screen polls these so it
--    can say "nothing yet" honestly and then celebrate the moment one lands.
--    Without them the only truthful answer we could give was silence.
-- 3. learned_domain is what the first email's sender was, so the optional
--    sender allowlist can be offered as a single yes rather than a text box.
--
-- Supabase editor rules: idempotent, no DO blocks, no semicolons inside
-- strings, flat statements only.

alter table public.school_connections alter column school_name drop not null;

alter table public.school_connections
  add column if not exists first_email_at timestamptz;

alter table public.school_connections
  add column if not exists last_email_at timestamptz;

alter table public.school_connections
  add column if not exists emails_caught int not null default 0;

alter table public.school_connections
  add column if not exists learned_domain text;
