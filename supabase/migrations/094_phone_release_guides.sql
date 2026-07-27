-- Guided Childhood — Migration 094
-- The first smartphone, our way: not a brick phone, but a locked down phone
-- released bit by bit. Two tables, both content in the database so DiGi can
-- keep a parent updated as the settings move.
--
-- phone_setup_guides: per operating system, how to start a phone near brick in
-- settings, then release time and apps incrementally as trust grows, with a
-- time allowance and earn back. Grounded in Google Family Link and Apple
-- Screen Time, current to July 2026.
--
-- learning_apps: the small set of apps that make a locked down phone a genuine
-- educator, so the first apps a child gets are the ones that build good habits.
--
-- The belief, stated plainly for the parent facing copy: the danger is the
-- open unmanaged phone, not the phone itself. Used well, with safe settings and
-- a small allowance, a phone teaches self regulation and can be a great tutor
-- long before the stakes of social media. Idempotent, guarded. No dashes.

set lock_timeout = '3s';

create table if not exists public.phone_setup_guides (
  id uuid primary key default uuid_generate_v4(),
  os_key text not null unique,            -- android | ios
  name text not null,
  emoji text not null,
  blurb text not null,
  lockdown jsonb not null,                -- [{ "name": "...", "how": "..." }] the near brick start
  release jsonb not null,                 -- [{ "name": "...", "how": "..." }] the incremental release
  time_management text not null,          -- the daily allowance and earn back approach
  parental_tool text not null,
  official_url text not null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.learning_apps (
  id uuid primary key default uuid_generate_v4(),
  app_key text not null unique,
  name text not null,
  emoji text not null,
  teaches text not null,
  why_good text not null,                 -- why it is easy to manage and worth allowing first
  from_age text not null,
  url text not null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
);

alter table public.phone_setup_guides enable row level security;
alter table public.learning_apps enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'phone_setup_guides' and policyname = 'phone_setup_guides_read') then
    create policy phone_setup_guides_read on public.phone_setup_guides for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'phone_setup_guides' and policyname = 'phone_setup_guides_service') then
    create policy phone_setup_guides_service on public.phone_setup_guides for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'learning_apps' and policyname = 'learning_apps_read') then
    create policy learning_apps_read on public.learning_apps for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'learning_apps' and policyname = 'learning_apps_service') then
    create policy learning_apps_service on public.learning_apps for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
  end if;
end $$;

-- ── Android · the cheaper, more controllable first phone ────────────────────
insert into public.phone_setup_guides (os_key, name, emoji, blurb, lockdown, release, time_management, parental_tool, official_url, sort_order)
select 'android', 'Android', '🤖',
  'Often the cheaper first phone and the easier to lock right down. Family Link lets you start it near brick and hand back access a little at a time.',
  $j$[
    {"name":"Set it up through Family Link","how":"Create the child account inside Google Family Link so you approve everything from your own phone."},
    {"name":"Approve every app install","how":"Turn on approval for all downloads, so nothing arrives without you."},
    {"name":"Start with the essentials only","how":"Calls, texts, maps, camera, and a couple of learning apps. Nothing else on day one."},
    {"name":"Block the browser and the store feed","how":"Turn off or filter the browser to start, and keep app store browsing behind approval."},
    {"name":"Set content filters","how":"SafeSearch on, restricted content on the Play Store and YouTube."}
  ]$j$::jsonb,
  $j$[
    {"name":"Add one app at a time","how":"As trust grows, approve a new app and talk about why. One step, not a flood."},
    {"name":"Grow the daily time slowly","how":"Start small and raise the allowance as they show they can stop on time."},
    {"name":"Open the browser later, filtered","how":"When ready, allow a filtered browser, not the open web all at once."},
    {"name":"Social media stays last","how":"Messaging and social wait until the readiness is built, not the day they get the phone."}
  ]$j$::jsonb,
  'Set a daily screen time allowance in Family Link, with bedtime downtime. The move that works well is a small allowance plus earn back: a child can request more time through the app, and you approve it, so stopping and asking becomes the habit rather than sneaking.',
  'Google Family Link governs the whole phone from your device, app by app and minute by minute.',
  'https://families.google.com/familylink/', 10
where not exists (select 1 from public.phone_setup_guides where os_key = 'android');

-- ── iPhone · Screen Time is the whole toolkit ───────────────────────────────
insert into public.phone_setup_guides (os_key, name, emoji, blurb, lockdown, release, time_management, parental_tool, official_url, sort_order)
select 'ios', 'iPhone', '📱',
  'A little pricier, but Screen Time built into it is a full toolkit. Set it up as a child in Family Sharing and it starts locked down and opens as you choose.',
  $j$[
    {"name":"Add them as a child in Family Sharing","how":"So Screen Time and Ask to Buy are yours to control from your phone."},
    {"name":"Turn on Ask to Buy","how":"Every download and purchase needs your approval first."},
    {"name":"Start with the essentials only","how":"Phone, Messages, Maps, Camera, and a couple of learning apps. Hide the rest."},
    {"name":"Content and Privacy restrictions","how":"Set app age ratings low, limit web content to approved sites, and lock the changes with a Screen Time passcode."},
    {"name":"Communication limits to contacts","how":"Calls and messages from known contacts only to start."}
  ]$j$::jsonb,
  $j$[
    {"name":"Approve apps one at a time","how":"Use Ask to Buy to add a new app when the moment is right, with a conversation each time."},
    {"name":"Raise App Limits gradually","how":"Start tight and lift the daily limit as they show they can stop when it ends."},
    {"name":"Widen web access slowly","how":"Move from approved sites only to a filtered open web when ready, not before."},
    {"name":"Social media stays last","how":"Keep social networking at zero minutes until the readiness is built."}
  ]$j$::jsonb,
  'Use Screen Time App Limits and Downtime for the daily allowance and a screen free night. The habit that sticks is a small allowance with earn back: they ask for more time, the request comes to your phone, and you decide together, so stopping and asking is normal.',
  'Apple Screen Time and Family Sharing control the phone from yours, with a passcode so the limits hold.',
  'https://support.apple.com/en-gb/HT201304', 20
where not exists (select 1 from public.phone_setup_guides where os_key = 'ios');

-- ── The learning apps: the good first apps that make a phone a tutor ────────
insert into public.learning_apps (app_key, name, emoji, teaches, why_good, from_age, url, sort_order)
select 'duolingo', 'Duolingo', '🦉', 'Languages',
  'A few minutes a day, gentle streaks, and easy to manage. A friendly first taste of a phone that gives back, and free to start.',
  'From about 8', 'https://www.duolingo.com', 10
where not exists (select 1 from public.learning_apps where app_key = 'duolingo');

insert into public.learning_apps (app_key, name, emoji, teaches, why_good, from_age, url, sort_order)
select 'ttrs', 'Times Tables Rock Stars', '🎸', 'Times tables',
  'Short bursts, set by many UK schools already, so it fits the homework rhythm. Quick wins that build real number fluency.',
  'From about 7', 'https://ttrockstars.com', 20
where not exists (select 1 from public.learning_apps where app_key = 'ttrs');

insert into public.learning_apps (app_key, name, emoji, teaches, why_good, from_age, url, sort_order)
select 'reading_eggs', 'Reading Eggs', '🥚', 'Reading and phonics',
  'Structured reading practice in small steps, with progress a parent can see. Screen time that reads back as learning.',
  'From about 4', 'https://readingeggs.co.uk', 30
where not exists (select 1 from public.learning_apps where app_key = 'reading_eggs');

insert into public.learning_apps (app_key, name, emoji, teaches, why_good, from_age, url, sort_order)
select 'khan_kids', 'Khan Academy Kids', '🌱', 'Reading, maths and more',
  'Completely free, no ads, no feed, and covers a lot of ground for the younger ones. A safe, broad first app.',
  'From about 4', 'https://khankids.org', 40
where not exists (select 1 from public.learning_apps where app_key = 'khan_kids');

insert into public.learning_apps (app_key, name, emoji, teaches, why_good, from_age, url, sort_order)
select 'bbc_bitesize', 'BBC Bitesize', '📚', 'Whole curriculum support',
  'Follows the UK curriculum, free, and no social feed. Handy homework help that never turns into a scroll.',
  'From about 5', 'https://www.bbc.co.uk/bitesize', 50
where not exists (select 1 from public.learning_apps where app_key = 'bbc_bitesize');
