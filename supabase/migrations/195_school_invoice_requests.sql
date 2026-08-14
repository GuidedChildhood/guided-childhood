-- Guided Childhood — Migration 195
-- The schools commercial layer, the letterbox half. A school that wants a
-- licence fills in the invoice request form on the schools site (five band
-- pricing, decided 13 August): school name, pupil count, contact and the
-- PURCHASE ORDER NUMBER finance will bounce an invoice without. The schools
-- app has no email, no auth and no payment code by design (wiring check 7),
-- so the form INSERTS here through the anon key and the parent app's hourly
-- cron emails Justin. Nothing in this table takes payment: invoices are
-- raised by hand in the Stripe dashboard with 30 day terms.
--
-- RLS: the world may post a request (insert only, like a letterbox), and
-- nobody but the service role may read the pile. No select, update or
-- delete policies on purpose.
--
-- Supabase editor rules: idempotent, flat statements.

create table if not exists schools.invoice_requests (
  id           uuid        primary key default gen_random_uuid(),
  school_name  text        not null,
  band         text        not null,
  pupil_count  int,
  contact_name text        not null,
  email        text        not null,
  po_number    text        not null,
  notes        text,
  notified_at  timestamptz,
  created_at   timestamptz not null default now()
);

alter table schools.invoice_requests enable row level security;

drop policy if exists "Anyone may request an invoice" on schools.invoice_requests;
create policy "Anyone may request an invoice" on schools.invoice_requests
  for insert to anon, authenticated with check (true);

grant insert on schools.invoice_requests to anon, authenticated;
