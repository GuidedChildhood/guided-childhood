-- 360 GIVE £5, GET £5: REFERRALS (Guided Childhood side).
--
-- Justin, 3 to 4 October 2026, plan in plans/2026-10-03-cross-referral-plan.md.
-- A parent shares their code. The friend gets £5 off their first month (a
-- Stripe coupon at checkout). Once the friend has paid twice (annual: 60 days
-- after paying) the person who shared is owed £5, paid by PayPal in a monthly
-- run. No yearly cap; anyone over ten rewards in a month is checked by hand.
--
-- Two tables.
--   referral_codes   one per parent who asks for one, with the PayPal email
--                    their rewards go to. The code carries no personal data.
--   referrals        one per friend who started a checkout with a code. The
--                    daily cron /api/cron/referrals moves it along:
--                    started -> joined (first payment) -> qualified (second
--                    payment, £5 owed) -> paid (in a PayPal run), or void.
--
-- A parent can read their own code and the referrals it brought, never the
-- friend's details: the referrals view they get is status and dates only,
-- through the API, not the table. Writes happen server side.
--
-- Supabase editor rules: idempotent, flat statements, no drops.

create table if not exists public.referral_codes (
  user_id       uuid        primary key references auth.users(id) on delete cascade,
  code          text        not null unique check (code ~ '^[A-Z0-9]{4,16}$'),
  paypal_email  text        check (paypal_email is null or position('@' in paypal_email) > 1),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.referrals (
  id                  uuid        primary key default gen_random_uuid(),
  code                text        not null references public.referral_codes(code) on update cascade,
  referrer_id         uuid        not null references auth.users(id) on delete cascade,
  referred_user_id    uuid        not null unique references auth.users(id) on delete cascade,
  stripe_customer_id  text,
  status              text        not null default 'started'
                        check (status in ('started', 'joined', 'qualified', 'paid', 'void')),
  void_reason         text,
  reward_pence        integer     not null default 500,
  joined_at           timestamptz,
  qualified_at        timestamptz,
  paid_at             timestamptz,
  created_at          timestamptz not null default now()
);

create index if not exists idx_referrals_referrer on public.referrals (referrer_id, status);
create index if not exists idx_referrals_status on public.referrals (status, created_at);

alter table public.referral_codes enable row level security;
alter table public.referrals enable row level security;

-- Named, because Supabase stops granting new public tables to the Data API by
-- default on 30 October 2026.
-- Codes are issued server side, so a parent cannot pick their own code; they
-- can only read it and change where the money goes.
revoke all on public.referral_codes from anon, authenticated;
revoke all on public.referrals from anon, authenticated;
grant select on public.referral_codes to authenticated;
grant update (paypal_email, updated_at) on public.referral_codes to authenticated;
grant select, insert, update, delete on public.referral_codes to service_role;
grant select on public.referrals to authenticated;
grant select, insert, update, delete on public.referrals to service_role;

create policy "Parents manage their own referral code"
  on public.referral_codes for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- The person who shared sees the referrals their code brought. The friend's
-- identity is never selected by the app; only status and dates are shown.
create policy "Referrers see their own referrals"
  on public.referrals for select
  using (auth.uid() = referrer_id);

comment on table public.referral_codes is
  'Give £5, get £5 (migration 360). One code per parent, plus the PayPal email their £5 rewards are paid to.';
comment on table public.referrals is
  'One row per friend who checked out with a code. Moved along daily by /api/cron/referrals: started, joined, qualified (£5 owed), paid, or void.';
