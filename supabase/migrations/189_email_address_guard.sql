-- Guided Childhood — Migration 189
-- One place that answers two questions about an email address: may we write to
-- it at all, and when did we last.
--
-- Justin, 12 August 2026, after thirty copies of the same email landed in his
-- inbox: "we must be careful only to send one once per week from all systems."
--
-- ── WHAT ACTUALLY HAPPENED, BECAUSE IT EXPLAINS BOTH COLUMNS ────────────────
--
-- The thirty were a false alarm and a real bug standing next to each other.
--
-- The false alarm: thirty four separate starter_leads rows each got exactly one
-- email, and thirty two of those rows were plus aliases of Justin's own two
-- addresses. Gmail funnels every plus alias into one inbox, so thirty two
-- correct sends looked like one email thirty two times.
--
-- The real bug underneath: they had all been suppressed for a month by the rule
-- that a lead who already has an account never gets a start your trial email.
-- Overnight the test accounts were deleted. The suppression evaporated with
-- them, and the whole backlog went out at once.
--
-- That generalises, and it is the serious half. DELETING AN ACCOUNT TURNS THAT
-- PERSON BACK INTO A FRESH LEAD. starter_leads is keyed by address, not by user
-- id, so it does not cascade with auth.users. A parent who uses Delete my
-- account has asked to be forgotten, and the next morning they would get "your
-- pathway is a couple of minutes away" followed by the whole seven email drip.
-- That is not an annoyance, it is the erasure promise in the privacy policy
-- being broken by the feature that exists to keep it.
--
-- ── WHY A SUPPRESSION ROW SURVIVES AN ERASURE, WHICH LOOKS WRONG ────────────
--
-- Deleting every trace of someone who asked to be forgotten is exactly how you
-- end up emailing them again: with nothing left to remember them by, the next
-- magnet download or stale lead row makes them a stranger we are allowed to
-- write to. Keeping a minimal, purpose limited record that this address must
-- not be marketed to is the recognised way to honour the request rather than a
-- loophole in it, and the ICO expects it. Their lead row and their account are
-- genuinely deleted. What stays is one address and one timestamp, held for the
-- single purpose of never contacting them again.
--
-- And it is not a life sentence. A suppression blocks PROGRAMME mail only, the
-- drips and digests we decide to send. If that person comes back tomorrow and
-- asks us for a printable, that is fresh consent, the magnet route lifts the
-- suppression, and the thing they just asked for reaches them. Transactional
-- mail was never blocked: a school reminder they set up, a receipt, the file
-- they are waiting for.
--
-- ── AND WHY last_sent_at SITS IN THE SAME TABLE ─────────────────────────────
--
-- On the same morning, five addresses got two emails 1.1 seconds apart, a lead
-- nurture and a teaser. The two blocks run in the same pass over overlapping
-- windows and keep separate ledgers, so a lead aged between three and thirty
-- days is due one from each and nothing anywhere asks "when did we last write
-- to this person". Three ledgers already existed (email_log, lead_email_log,
-- starter_leads.nurtured_at) and not one of them could answer that question,
-- because each only knows about its own programme.
--
-- This column is the question all of them were missing, in one row per address,
-- checked inside sendEmail so the next feature that writes to a parent gets it
-- without knowing it exists. Same shape as the child quiet hours gate, which
-- lives inside pushToChild for the same reason.
--
-- Supabase editor rules: idempotent creates, flat statements, no DO blocks.

create table if not exists public.email_addresses (
  -- Always stored lowercased and trimmed. Normalising is the caller's job and
  -- lib/email/address-guard.ts is the only thing that writes here, so there is
  -- exactly one place that has to get it right. Plain text rather than citext
  -- so this needs no extension.
  address       text        primary key,
  last_sent_at  timestamptz,
  -- Which programme sent last. Diagnostic only: when a parent says they are
  -- getting too much, this says what.
  last_key      text,
  -- Set when a parent deletes their account, or otherwise asks to be forgotten.
  -- Blocks programme mail for good, until a fresh opt in clears it.
  suppressed_at timestamptz,
  suppressed_reason text,
  created_at    timestamptz not null default now()
);

create index if not exists idx_email_addresses_suppressed
  on public.email_addresses (suppressed_at) where suppressed_at is not null;

alter table public.email_addresses enable row level security;

-- No policy, deliberately. Every read and write goes through the service role
-- in lib/email/address-guard.ts. A table that says which addresses have asked
-- to be forgotten is not something a browser should ever be able to query, and
-- with RLS on and no policy the anon key sees nothing at all.

comment on table public.email_addresses is
  'One row per email address: when we last sent it programme mail, and whether it has asked never to hear from us again. Checked inside sendEmail so every system shares one floor. Service role only, no RLS policy by design. See migration 189.';

comment on column public.email_addresses.suppressed_at is
  'This address asked to be forgotten, usually by deleting their account. Blocks programme mail permanently. Cleared by a fresh opt in such as a new magnet download. Never blocks transactional mail the person is actively waiting for.';

comment on column public.email_addresses.last_sent_at is
  'When programme mail last went to this address, across every system. The one per week floor is enforced against this inside sendEmail rather than in any single programme, because the fault it fixes was two programmes each correctly sending one.';
