-- Guided Childhood — Migration 302
-- The supplies letterbox: a school asking for printed passport books and
-- sticker sheets for its classes.
-- Plan: plans/2026-09-16-per-child-passport-plan.md (Justin said yes on
-- 16 September 2026, and said quote form rather than price).
--
-- WHY THIS EARNS ITS OWN TABLE WHEN THE DRAW, THE TASTER AND THE PILOT DID
-- NOT. Those three are LEADS FOR THE SAME PRODUCT, a licence, and they fit
-- schools.invoice_requests exactly: school, contact, email, pupil count,
-- a marker band and a note. Nothing is lost by sharing.
-- Supplies is a different product with fields that table does not have:
-- which items, how many of each, which key stages, and where the box goes.
-- Those would have to live in `notes` as prose, which means nobody can total
-- an order, filter by item or hand a supplier a list without writing a parser
-- for free text first. A guess in the data is worse than a second table.
--
-- ONE CRON, THOUGH. /api/cron/invoice-requests reads both letterboxes in the
-- same run, so this adds a table and not a second job. The schools app still
-- carries no email, no payment and no auth code (wiring check 7): the form
-- inserts through the anon key and the parent app does the sending.
--
-- NOTHING HERE IS ABOUT A PUPIL. No child name, no class list, no pupil
-- level anything. The delivery address is the SCHOOL's, never a home, which
-- is what keeps the supplies line entirely outside the data processing
-- agreement.
--
-- A QUOTE, NOT AN ORDER. There is no supplier, no stock and no landed cost
-- yet, so po_number is nullable on purpose: asking a teacher for a purchase
-- order before we have given them a price is asking them to leave. The PO
-- comes later, on the invoice, the way a licence already works.
--
-- RLS: the world may post a request (insert only, like a letterbox), and
-- nobody but the service role may read the pile. No select, update or
-- delete policies on purpose. Migration 196's default privileges line gives
-- service_role its grants on any new schools table, so this does not repeat
-- the mistake 195 made.
--
-- Supabase editor rules: idempotent, flat statements. Safe to re-run.

create table if not exists schools.supply_requests (
  id               uuid        primary key default gen_random_uuid(),
  school_name      text        not null,
  contact_name     text        not null,
  email            text        not null,
  -- 'books', 'stickers' or 'both'. Checked in the action, not constrained
  -- here, so a fourth item added later is a deploy and not a migration.
  want             text        not null,
  -- Free text so a school can say "KS1 and KS2" or "Years 3 to 6" in its
  -- own words. We are quoting, not provisioning.
  key_stages       text,
  book_count       int,
  sticker_count    int,
  -- The school's delivery address, for the quote's postage line.
  delivery_address text,
  po_number        text,
  notes            text,
  notified_at      timestamptz,
  created_at       timestamptz not null default now()
);

alter table schools.supply_requests enable row level security;

drop policy if exists "Anyone may request supplies" on schools.supply_requests;
create policy "Anyone may request supplies" on schools.supply_requests
  for insert to anon, authenticated with check (true);

grant insert on schools.supply_requests to anon, authenticated;
grant select, insert, update, delete on schools.supply_requests to service_role;
