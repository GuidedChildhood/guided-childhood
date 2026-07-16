-- Guided Childhood — Migration 063
-- The lead nurture slice of the status aware funnel. A starter_lead is an
-- email captured before an account exists (the magnet downloads, and quiz
-- drop offs who gave their email but never finished signup). We want to send
-- them one warm nudge to come start the free trial, without ever emailing the
-- same lead twice. There is no user_id for a lead, so the email_log
-- idempotency the account emails use does not apply; this timestamp is the
-- lead's own once only guard.

alter table public.starter_leads
  add column if not exists nurtured_at timestamptz;
