-- 300: the letterbox rows that were already answered by hand are marked
-- confirmed, so the new confirmation letter only ever goes to new rows.
--
-- Migration 299 added confirmed_at so the parent app cron
-- (app/api/cron/invoice-requests) can send every school its own
-- confirmation once. The rows already in the table were answered by Justin
-- himself before there was a letter to send; without this each of them
-- would get a confirmation weeks late saying the invoice is on its way.
-- Rows the cron has not yet passed to Justin (notified_at null) are left
-- alone: they are still in flight and get both emails as intended.
update schools.invoice_requests
   set confirmed_at = notified_at
 where confirmed_at is null
   and notified_at is not null;
