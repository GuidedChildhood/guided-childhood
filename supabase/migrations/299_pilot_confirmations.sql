-- 299: the school hears back too.
--
-- The schools letterbox (migration 195) stamps notified_at when the hourly
-- cron has told Justin about a row. Nothing ever told the SCHOOL anything:
-- a head who requested an invoice, a teacher who asked for the taster pack,
-- and now a school asking for a pilot all saw "request received" on screen
-- and then silence until Justin wrote by hand (the schools review, 13
-- September 2026, decision 2 and the buying journey).
--
-- The cron now sends the school its own confirmation, and this column is how
-- it knows it has. Separate from notified_at on purpose: the two sends can
-- fail independently, and stamping one column for both would either lose a
-- school's confirmation for good or email Justin twice.
--
-- The pilot itself needs no new table or column. It is a fourth kind of row
-- in the same letterbox, band 'pilot', the pattern /draw and the taster set.
alter table schools.invoice_requests
  add column if not exists confirmed_at timestamptz;

comment on column schools.invoice_requests.confirmed_at is
  'When the school itself was sent its confirmation by the parent app cron. Null until sent.';
