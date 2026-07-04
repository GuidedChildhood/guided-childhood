-- Guided Childhood: school inbound verification
-- Run AFTER 027_concerns.sql.
-- Gmail will only forward to an address it has verified: it emails a
-- confirmation code (and a one tap confirmation link) to the forwarding
-- address itself. Our inbound webhook catches that email (sender
-- forwarding-noreply@google.com), stores the code and link here, and the
-- setup screen polls and displays them so the parent completes the Gmail
-- step without ever leaving the flow.

alter table public.school_connections
  add column if not exists verification_code        text,
  add column if not exists verification_link        text,
  add column if not exists verification_received_at timestamptz;
