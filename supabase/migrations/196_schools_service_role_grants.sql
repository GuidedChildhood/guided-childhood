-- Guided Childhood — Migration 196
-- The grant migration 195 forgot, and the reason the first invoice request
-- sat in the letterbox with nobody able to read it.
--
-- WHAT BROKE. /api/cron/invoice-requests returned 500 on every run: the
-- school's form could INSERT (195 granted that to anon) but the cron reads
-- as the SERVICE ROLE, and nothing had granted the service role anything
-- on schools.invoice_requests. Bypassing RLS is not the same as holding a
-- table privilege, and the row stayed unread.
--
-- WHY ONLY THIS TABLE. The eleven tables that moved into the schools schema
-- in 177 carried their existing grants with them, service_role included,
-- because a schema move preserves privileges. invoice_requests was CREATED
-- inside the schools schema, where Supabase's automatic public schema
-- grants do not apply, so it started life with only what 195 named.
--
-- The default privileges line is the real fix: every future schools table
-- gets this without anyone having to remember.
--
-- Supabase editor rules: idempotent, flat statements. Safe to re-run.

grant select, insert, update, delete on schools.invoice_requests to service_role;

alter default privileges in schema schools grant all on tables to service_role;
alter default privileges in schema schools grant all on sequences to service_role;
