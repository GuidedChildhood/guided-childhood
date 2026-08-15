-- Guided Childhood — Migration 196
-- Sign up asks the question the front page already answered.
--
-- Justin, 14 August 2026: "At the end of sign up, the parent chooses one of
-- exactly two paths."
--
-- ── WHAT THE HOMEPAGE PROMISES AND THE APP DOES NOT KEEP ────────────────────
--
-- PR 849 and 851 put three things on the front page:
--
--   the trial      four days, no card, "DiGi, with a daily limit" and "a
--                  starter set of scripts".
--   the founder    £7.99 a month for life, first 50 families, and the words
--                  "The founder rate is claimed at sign up".
--   the standard   £12.99 a month or £99 a year, for everybody after that.
--
-- None of the three is true inside the app today. The two doors are at
-- /dashboard/choose behind first_checkin_at, so the offer arrives days after
-- the page that sold it. The trial hands over the entire product, all 246
-- scripts and unlimited DiGi, rather than the sample being advertised. And a
-- founder with a card on file gets no warning before the first charge.
--
-- This migration is the data half of closing that gap. Three things:
--
--   1  when the four days began, so a pre charge reminder can be sent,
--   2  the trial limits as data rather than as constants in the app,
--   3  which scripts a trialling family may actually open.
--
-- Supabase editor rules: idempotent, no DO blocks, no semicolons inside string
-- literals, flat statements only.


-- ── 1. WHEN THE FOUR DAYS BEGAN ─────────────────────────────────────────────
--
-- trial_ends_at has always been stored. The START has not, and the day 3 email
-- needs it: inferring it backwards as "the end minus four days" hardcodes the
-- trial length into a cron, so changing the length in config would silently
-- move an email that a UK consumer regulation expects to arrive before the
-- money moves. Store the fact instead of deriving it.
--
-- Deliberately NOT added to the authenticated update grant in migration 175.
-- It is a clock column, same family as trial_ends_at, and a parent who can
-- write it can move their own charge date.

alter table public.profiles add column if not exists trial_started_at timestamptz;

comment on column public.profiles.trial_started_at is
  'When the four free days began. Written once, by the server, at the moment the parent picks a path. The day 3 pre charge email is timed from this rather than from the end date, so changing the trial length never moves the reminder off its legal footing.';

-- Everybody already mid trial keeps an honest start date rather than a null
-- the cron would have to guess around. Four days back from their own end date
-- is exactly when it started, because four is what they were given.
update public.profiles
   set trial_started_at = trial_ends_at - interval '4 days'
 where trial_ends_at is not null
   and trial_started_at is null;

-- The chosen path is plan_choice, which already exists and already holds
-- exactly the two values this needs. A second column saying the same thing in
-- different words is how the two drift apart.
comment on column public.profiles.plan_choice is
  'Which of the two paths they took at sign up. founder means a card was taken and a founder place is held. free means no card. Null means the choice is still owed, which is what the block at the end of sign up reads.';


-- ── 2. THE TRIAL LIMITS, AS DATA ────────────────────────────────────────────
--
-- The DiGi cap was `const FREE_DAILY_LIMIT = 3` in app/api/digi/route.ts and
-- the trial length is a constant in lib/access.ts. Both are pricing decisions
-- wearing the clothes of code, and changing either one meant a deploy.
--
-- Service role only, on purpose. There are no policies on this table, so RLS
-- denies every browser client outright: these values are the terms of the
-- offer, and a value a parent can read is a value somebody will eventually try
-- to write. The app reads it server side and caches it.
--
-- The app keeps its own fallbacks. A table that cannot be reached must never
-- be able to take the product down, so a missing row or a database blip falls
-- back to the same numbers seeded here.

create table if not exists public.platform_config (
  key         text primary key,
  value       jsonb not null,
  note        text,
  updated_at  timestamptz not null default now()
);

alter table public.platform_config enable row level security;

insert into public.platform_config (key, value, note) values
  ('trial_days', '4'::jsonb,
   'How many free days both paths get. Changing this changes the Stripe trial_period_days on the founder path too, so the card and the app can never disagree about when it runs out.'),
  ('trial_digi_daily_limit', '3'::jsonb,
   'DiGi messages a day while the trial is running, on BOTH paths. The homepage sells "DiGi, with a daily limit" and this is the number behind those words.')
on conflict (key) do nothing;

comment on table public.platform_config is
  'The terms of the offer, as data. Read by the server and cached, never reachable from a browser. Every key has a fallback in the app so this table can never take the product down.';


-- ── 3. THE STARTER SET OF SCRIPTS ───────────────────────────────────────────
--
-- "A starter set of scripts" is a row level decision about content, so it
-- lives on the rows rather than in a number somewhere. Justin can move a
-- script in or out of the sample in the admin console without a deploy, which
-- is what the scripts in the database rule is actually for.
--
-- SEEDED FROM is_free PLUS THE TOP SIX PER STAGE, and the second half is the
-- part that matters. Migration 187 kept is_free as an editorial judgement
-- about which scripts we would show as a sample, and it was made when there
-- were far fewer scripts: migration 148 counted the free ones per stage as
-- Foundation 5, Builder 3, Explorer 1, Shaper 1, Independent 1. A parent of a
-- fourteen year old trialling on one script would conclude we have nothing for
-- them, which is the exact mistake 148 was written to stop us making again.
--
-- So every stage gets at least its first six by sort_order, which is the order
-- the app already puts them in, so the sample is the top of the list rather
-- than an arbitrary handful.

alter table public.scripts add column if not exists starter_set boolean not null default false;

comment on column public.scripts.starter_set is
  'Openable during the four day trial. The sample the homepage calls "a starter set of scripts". Editable per row: this is a content decision, not a constant.';

update public.scripts set starter_set = true where is_free = true and starter_set = false;

with ranked as (
  select id, row_number() over (partition by stage_id order by sort_order, id) as rn
    from public.scripts
)
update public.scripts s
   set starter_set = true
  from ranked r
 where r.id = s.id
   and r.rn <= 6
   and s.starter_set = false;

create index if not exists idx_scripts_starter on public.scripts(stage_id, starter_set, sort_order);


-- ── 4. THE POLICY LEARNS THE DIFFERENCE ─────────────────────────────────────
--
-- One policy used to answer both questions at once: active subscription OR a
-- live trial, and either one returned all 246 rows. There was no way to
-- express "trialling" separately because nothing needed it until now.
--
-- Two policies, and PostgreSQL ORs permissive policies together, so the wider
-- one always wins for a member. The rule the whole thing turns on:
--
--   a live trial_ends_at means the trial is RUNNING, whichever path they took
--
-- which is why the founder path is limited too. Their card is on file and
-- their subscription reads active, because Stripe says trialing and we map
-- that to active so they are never locked out of their own free days. But they
-- have not been charged, and the four days are meant to be the same four days
-- for both paths. The app ends the clock the moment the first payment lands:
-- the webhook writes trial_ends_at = now() when Stripe moves the subscription
-- out of trialing, so the limits lift on the same event that takes the money
-- and can never lag behind it.
--
-- past_due joins the member policy, which it should always have done. It is in
-- PAYING_STATUSES in lib/access.ts, a family whose card bounced keeps the
-- product while Stripe retries, and the policy quietly disagreed.

drop policy if exists "Paid scripts visible to active members" on public.scripts;

drop policy if exists "Members see every script" on public.scripts;

create policy "Members see every script"
  on public.scripts for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and subscription_status in ('active', 'past_due')
        and (trial_ends_at is null or trial_ends_at <= now())
    )
  );

drop policy if exists "A live trial sees the starter set" on public.scripts;

create policy "A live trial sees the starter set"
  on public.scripts for select
  using (
    starter_set = true
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and trial_ends_at is not null
        and trial_ends_at > now()
    )
  );

-- ANYBODY ALREADY PAYING GETS THEIR CLOCK CLOSED, before the policies above
-- can narrow them. A member with a stale trial_ends_at still in the future
-- would otherwise wake up on the starter set, and their trial genuinely ended
-- the day they paid. This is the same write the webhook does from here on, run
-- once over the rows that predate it.

update public.profiles
   set trial_ends_at = now()
 where subscription_status in ('active', 'past_due')
   and trial_ends_at is not null
   and trial_ends_at > now();

-- CHECK IT WORKED. Signed in as a trialling parent, this should return the
-- starter set rather than the full count:
--
--   select stage_id, count(*) from public.scripts group by stage_id;
--
-- and the same query as a member should return all of them. Run as the service
-- role it always returns everything, which is the point: the number is only
-- ever different from where a parent is standing.
