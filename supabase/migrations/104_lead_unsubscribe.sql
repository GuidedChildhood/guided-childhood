-- One click stop for the pre sign up email sequence.
--
-- Leads have no account, so there was no user id to opt out and the footer
-- offered nothing but a mailto. That failed the person it most needed to serve:
-- a parent who downloaded a printable with one address, joined with another,
-- and then kept being sold the thing they had already bought, with no way to
-- stop it but writing to us. The account check in the cron matches on address,
-- so two addresses defeat it and always will. A working stop link is the answer
-- that does not depend on guessing that two addresses are the same person.
--
-- It is also what the bulk sender rules ask for: a link that works in one tap.

alter table public.starter_leads
  add column if not exists unsubscribed_at timestamptz;

-- The lifecycle cron reads this on every run, so keep the skip cheap.
create index if not exists starter_leads_unsubscribed_idx
  on public.starter_leads (unsubscribed_at)
  where unsubscribed_at is null;
