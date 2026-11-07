-- 387: the pilot's licence link carries a token, not the school's details.
--
-- The pilot confirmation (lib/email/school-letters.ts, migration 299) ends
-- with "turn the pilot into a licence", a link to the schools pricing page
-- with the invoice form already filled in. Until 6 November 2026 it filled
-- the form by putting the school name, the contact's name and their email in
-- the query string (/pricing?school=&name=&email=). A URL is not a private
-- place: it lands in the server's request logs, in any analytics, in browser
-- history on a shared staff room machine, and in the Referer header of the
-- next request (the funnel audit, Research Pack 11, fix 8).
--
-- So the link now carries one opaque value, this column, and the pricing page
-- looks the row up on the server and fills the form from it. The token is a
-- random v4 uuid (122 random bits from the database's own generator), not
-- derived from anything about the school, so it cannot be guessed or
-- reversed. The schools app reads it with the service role, and only for
-- band 'pilot' rows, the only letter that carries the link.
--
-- The volatile default gives every existing row its own token as the column
-- is added, so a pilot still waiting for its letter gets one too.
--
-- Supabase editor rules: idempotent, flat statements.

alter table schools.invoice_requests
  add column if not exists prefill_token uuid not null default gen_random_uuid();

create unique index if not exists invoice_requests_prefill_token_key
  on schools.invoice_requests (prefill_token);

comment on column schools.invoice_requests.prefill_token is
  'Opaque token in the pilot letter''s licence link. The schools pricing page resolves it server side to prefill the invoice form, so no name or email travels in a URL. Migration 387.';
