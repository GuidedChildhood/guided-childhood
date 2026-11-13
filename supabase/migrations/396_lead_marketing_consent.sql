-- 396: a free download no longer signs anyone up to marketing (13 November 2026).
--
-- Found while building Free Saturday. Under PECR, marketing email needs
-- consent, and the ICO says consent is unlikely to be valid when it is a
-- condition of getting something. The "soft opt in" covers people who bought,
-- or were negotiating to buy, which a free download is not. Until now every
-- free page sent the printable AND enrolled the address in the lead emails
-- (the taster week, the nurture, the teasers), with only "unsubscribe any
-- time" under the box.
--
-- So the gate now has its own unticked box ("Send me the tips too"), and the
-- printable goes out whether it is ticked or not, as a transactional email.
--
--   marketing_consent      true   ticked the box on a free page
--                          false  left it unticked on a free page
--                          null   captured before the box existed, or by the
--                                 stage check, which has its own flow; the
--                                 programmes treat these exactly as before
--   marketing_consent_at   when it was ticked
--
-- The email cron skips false in every lead programme. A later unticked
-- download never overwrites an earlier tick: leaving a box empty is not
-- withdrawing, the stop link in every email is.

alter table public.starter_leads
  add column if not exists marketing_consent    boolean,
  add column if not exists marketing_consent_at timestamptz;

comment on column public.starter_leads.marketing_consent is
  'true: ticked the optional tips box on a free page; false: left it unticked (the download still went, nothing else does); null: captured before the box or by the stage check, treated as before. The email cron skips false.';
comment on column public.starter_leads.marketing_consent_at is
  'When the tips box was ticked.';
