-- Guided Childhood production catch up, part 1 of 2: migrations.
-- The live database only has migrations 001, 003 and 007 applied.
-- This applies everything else in order. Run ONCE in the SQL Editor
-- of the LIVE project. Safe design: creates use IF NOT EXISTS.


-- ════════════════ migrations/002_add_category.sql ════════════════

-- Guided Childhood — Migration 002
-- Adds category column to scripts table for the expanded script library.
-- Run in Supabase SQL Editor after 001_initial.sql.

alter table public.scripts
  add column if not exists category text;

-- Index for category filtering
create index if not exists idx_scripts_category
  on public.scripts(category, is_free, sort_order);

-- Update existing 17 scripts with sensible categories
update public.scripts set category = 'first-device'   where sort_order in (1, 2, 3);
update public.scripts set category = 'first-device'   where sort_order in (4, 5, 6);
update public.scripts set category = 'social-media'   where sort_order in (7, 8, 9);
update public.scripts set category = 'social-media'   where sort_order in (10, 11, 12);
update public.scripts set category = 'gaming'         where sort_order in (13, 14, 15);
update public.scripts set category = 'first-device'   where sort_order in (16, 17);

-- ════════════════ migrations/002_ai_module.sql ════════════════

-- Guided Childhood: AI Literacy module
-- Run AFTER 001_initial.sql.
-- Two tables:
--   ai_lessons  : the evergreen, age-tiered AI literacy content (rarely changes)
--   ai_updates  : the living layer of current AI news and safety items, drafted
--                 by the refresh job and published only after human approval.

-- ─────────────────────────────────────────────
-- ai_lessons (evergreen content)
-- audience covers the same age tiers as the rest of the platform plus parents
-- and teachers. Content is educational and public, so anyone can read it and
-- DiGi can draw on it.
-- ─────────────────────────────────────────────
create table if not exists public.ai_lessons (
  id            uuid primary key default uuid_generate_v4(),
  audience      text not null
                  check (audience in ('age_7','age_9','age_11','age_13','age_16','parent','teacher')),
  category      text not null,
  title         text not null,
  the_idea      text not null,
  why_it_matters text not null,
  try_this      text not null,
  key_message   text not null,
  digi_prompt   text not null,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.ai_lessons enable row level security;

-- Evergreen AI lessons are educational and public (free to all, like the free scripts).
create policy "AI lessons are public"
  on public.ai_lessons for select
  using (true);

create policy "Service role full access to ai_lessons"
  on public.ai_lessons for all
  using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- ai_updates (the living layer)
-- One row per current item (a new model, a safety guidance, a scam pattern).
-- origin: 'claude' means drafted by the refresh job, 'editor' means written by a
--   human. status: a draft is never shown to families. Only 'published' rows are
--   public. This human-in-the-loop step is deliberate: a children's product must
--   not surface unreviewed, machine-generated claims about the latest AI.
-- ─────────────────────────────────────────────
create table if not exists public.ai_updates (
  id            uuid primary key default uuid_generate_v4(),
  headline      text not null,
  summary       text not null,
  audience      text not null default 'parent'
                  check (audience in ('age_7','age_9','age_11','age_13','age_16','parent','teacher')),
  category      text not null default 'ai_news',
  source_name   text,
  source_url    text,
  origin        text not null default 'editor'
                  check (origin in ('claude','editor')),
  status        text not null default 'draft'
                  check (status in ('draft','approved','published','archived')),
  published_at  timestamptz,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.ai_updates enable row level security;

-- Only published updates are visible to families.
create policy "Published AI updates are public"
  on public.ai_updates for select
  using (status = 'published');

-- The refresh job and editors use the service role to draft, review, and publish.
create policy "Service role full access to ai_updates"
  on public.ai_updates for all
  using (auth.role() = 'service_role');

create index if not exists ai_lessons_audience_idx on public.ai_lessons (audience, sort_order);
create index if not exists ai_updates_status_idx on public.ai_updates (status, published_at desc);

-- ════════════════ migrations/008_digi_feedback.sql ════════════════

-- DiGi daily feedback loop
-- One reflective question per user per day, answered by the parent.
-- Stored responses seed the next day's DiGi context for personalization.

CREATE TABLE IF NOT EXISTS public.digi_feedback (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id         uuid        REFERENCES public.children(id) ON DELETE SET NULL,
  feedback_date    date        NOT NULL DEFAULT CURRENT_DATE,
  question         text        NOT NULL,
  parent_response  text,
  digi_insight     text,  -- DiGi's stored interpretation, used as next-session seed
  responded_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT digi_feedback_user_date_unique UNIQUE (user_id, feedback_date)
);

ALTER TABLE public.digi_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own digi feedback"
  ON public.digi_feedback FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for efficient lookup by user + recent dates
CREATE INDEX IF NOT EXISTS idx_digi_feedback_user_date
  ON public.digi_feedback (user_id, feedback_date DESC);

-- ════════════════ migrations/009_daily_moments.sql ════════════════

-- 009_daily_moments.sql
-- Moment cards: each row is a real parenting scenario with DiGi context

CREATE TABLE IF NOT EXISTS public.daily_moments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text NOT NULL,
  category       text NOT NULL CHECK (category IN ('Morning','Digital','School','Food','Evening','Transitions','Emotions')),
  age_bands      text[] NOT NULL DEFAULT '{}',
  icon           text NOT NULL DEFAULT '💡',
  science_brief  text NOT NULL,
  digi_opener    text NOT NULL,
  solutions      jsonb NOT NULL DEFAULT '[]',
  expert_note    text,
  sort_order     integer NOT NULL DEFAULT 0,
  active         boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Completions: parent marks a moment as done today
CREATE TABLE IF NOT EXISTS public.moment_completions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id    uuid REFERENCES public.children(id) ON DELETE SET NULL,
  moment_id   uuid NOT NULL REFERENCES public.daily_moments(id) ON DELETE CASCADE,
  completed_on date NOT NULL DEFAULT CURRENT_DATE,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT moment_completions_unique UNIQUE (user_id, moment_id, completed_on)
);

ALTER TABLE public.daily_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moment_completions ENABLE ROW LEVEL SECURITY;

-- Everyone can read moments
CREATE POLICY "moments_readable_by_all" ON public.daily_moments
  FOR SELECT USING (true);

-- Users manage their own completions
CREATE POLICY "completions_own" ON public.moment_completions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_daily_moments_category  ON public.daily_moments (category);
CREATE INDEX IF NOT EXISTS idx_daily_moments_sort      ON public.daily_moments (sort_order);
CREATE INDEX IF NOT EXISTS idx_completions_user_date   ON public.moment_completions (user_id, completed_on DESC);

-- ════════════════ migrations/010_push_subscriptions.sql ════════════════

-- Push notification subscriptions
create table if not exists push_subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  endpoint      text not null unique,
  p256dh        text not null,
  auth          text not null,
  stage         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table push_subscriptions enable row level security;

create policy "Users manage own subscriptions"
  on push_subscriptions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Service role can read all (for sending notifications)
create policy "Service role reads all"
  on push_subscriptions
  for select
  using (auth.role() = 'service_role');

create index on push_subscriptions(user_id);

-- ════════════════ migrations/011_daily_feedback.sql ════════════════

-- 011_daily_feedback.sql
-- Add moment feedback to daily sessions so the next day's card can be personalised

ALTER TABLE public.daily_sessions
  ADD COLUMN IF NOT EXISTS moment_feedback jsonb NOT NULL DEFAULT '[]';

-- ════════════════ migrations/012_ai_checkin.sql ════════════════

-- Guided Childhood: AI Literacy check-in for parents of children aged 11+
-- Stores parent answers to a short AI readiness questionnaire.
-- One row per user (upsert on user_id).
create table if not exists public.ai_literacy_checkins (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  answers    jsonb not null default '{}',
  created_at timestamptz not null default now(),
  constraint ai_literacy_checkins_user_unique unique (user_id)
);

alter table public.ai_literacy_checkins enable row level security;

create policy "Users can read own checkins"
  on public.ai_literacy_checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert own checkins"
  on public.ai_literacy_checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can update own checkins"
  on public.ai_literacy_checkins for update
  using (auth.uid() = user_id);

create index if not exists ai_checkins_user_idx on public.ai_literacy_checkins (user_id);

-- ════════════════ migrations/013_lessons_hub.sql ════════════════

-- Guided Childhood: Lessons Hub (not yet linked in the app)
-- Run AFTER 012_ai_checkin.sql.
-- General digital parenting curriculum content, organized by stage, separate
-- from ai_lessons (which stays AI-literacy specific). The /dashboard/lessons
-- pages exist but are not linked from navigation yet. Real content will be
-- teaching modules with slides, matching the format built for schools. This
-- table and its seed rows are a placeholder until that format lands.
--
-- audience of 'parent' or 'teacher' lets the same topic exist in two voices,
-- parent facing and school facing, without a rewrite of the schema. This
-- mirrors the pattern already proven in ai_lessons.

create table if not exists public.lessons (
  id             uuid primary key default uuid_generate_v4(),
  stage_id       text not null
                   check (stage_id in ('foundation','builder','explorer','shaper','independent')),
  audience       text not null default 'parent'
                   check (audience in ('parent','teacher')),
  category       text not null, -- screen_habits / safety / wellbeing / online_risks
  title          text not null,
  the_idea       text not null,
  why_it_matters text not null,
  try_this       text not null,
  key_message    text not null,
  digi_prompt    text not null,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now()
);

alter table public.lessons enable row level security;

-- Lessons are educational and public, same pattern as ai_lessons and scripts.
create policy "Lessons are public"
  on public.lessons for select
  using (true);

create policy "Service role full access to lessons"
  on public.lessons for all
  using (auth.role() = 'service_role');

create index if not exists lessons_stage_idx on public.lessons (stage_id, audience, sort_order);

-- ─────────────────────────────────────────────
-- Seed: 2 parent-facing lessons per stage, plus one teacher-facing lesson
-- to prove out the school-facing variant. This is placeholder content until
-- the slide based lesson format (matching the schools build) replaces it.
-- ─────────────────────────────────────────────
insert into public.lessons (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order) values

-- Foundation (ages 4 to 7)
('foundation', 'parent', 'screen_habits', 'Building the first device routine',
 'A timer and a fixed spot for the device do more than any rule you say out loud.',
 'Children at this age cannot regulate device use themselves. A visible, predictable routine removes the daily negotiation before it starts.',
 'Tonight, agree a fixed screen time and a charging spot outside the bedroom. Use a visual timer, sand timer or a smart speaker, so the timer is the rule, not you.',
 'The routine is the boundary. You are not the referee, the timer is.',
 'How do I build a screen time routine for a 4 to 7 year old without daily fights?', 10),
('foundation', 'parent', 'safety', 'What to do before you hand over a screen',
 'Same room, same screen is the entire safety plan at this age. Nothing else matters yet.',
 'Supervision at this stage is not about trust, it is about developmental readiness. A 5 year old cannot judge what is safe to click.',
 'Sit with your child for their next screen session. Notice what they gravitate toward. That tells you what to set up next, not a settings menu.',
 'At this age, safety means presence, not permissions.',
 'What settings actually matter for a young child using a shared family device?', 20),

-- Builder (ages 8 to 10)
('builder', 'parent', 'screen_habits', 'Setting the bedroom rule before it is hard',
 'Where a device sleeps at night matters more than how long it is used during the day.',
 'Sleep is the non negotiable. Set the bedroom rule now, before a personal device arrives, and it becomes how things have always worked.',
 'Ask as a family question, not an announcement: where should our devices sleep? Let everyone including you follow the same answer.',
 'Set it before they need it, and it is a family norm, not a punishment.',
 'How do I introduce the bedroom rule at this age without a fight?', 10),
('builder', 'parent', 'safety', 'Talking about strangers online without frightening them',
 'The goal is not fear, it is a clear, calm plan for what to do if something feels wrong.',
 'Scare tactics make children hide problems instead of reporting them. A calm, rehearsed response keeps the door open.',
 'Practise one sentence with your child: if anything online ever feels weird, you tell me straight away and I will not be angry. Say it out loud together.',
 'A child who has rehearsed telling you is a child who actually will.',
 'How do I talk to my 8 to 10 year old about online strangers without scaring them?', 20),

-- Explorer (ages 11 to 13)
('explorer', 'parent', 'online_risks', 'Understanding the algorithm together',
 'Showing curiosity about how a feed is built protects more than any warning about screen time.',
 'This is the highest risk window identified by Cambridge MRC research. Children here are forming identity through comparison, and the algorithm amplifies whatever it finds.',
 'Open their feed together tonight. Ask one question: why do you think it showed you that? Stay curious for ten minutes, no judgment.',
 'The parent who can talk about the algorithm without alarm is the strongest protective factor at this age.',
 'How do I have the algorithm conversation with my 11 to 13 year old?', 10),
('explorer', 'parent', 'wellbeing', 'Reading the mood signal before it becomes a pattern',
 'A single bad evening is not a pattern. A dip every Sunday after the same app is.',
 'Mood tracking without judgment gives you real evidence before you say anything, instead of a hunch you cannot explain to your child.',
 'For one week, note mood before and after phone use, just a word or two. Share it as an observation, not a conclusion: I noticed this, does it feel true to you?',
 'Track for a week before you speak. Evidence lands better than instinct.',
 'How do I know if my child''s mood changes are actually linked to phone use?', 20),

-- Shaper (ages 13 to 15)
('shaper', 'parent', 'safety', 'Keeping the door open when something goes wrong',
 'A teenager who fears losing their phone is a teenager who hides the problem instead of telling you.',
 'Things do go wrong online at this age. What determines the outcome is whether your child believes you are the first call, not the last.',
 'Say this once, clearly, before anything happens: if anything ever goes wrong online, I am the first call you make, not the last. I will not overreact.',
 'Say it before it is needed. That is the whole strategy.',
 'How do I keep my 13 to 15 year old talking to me about problems online?', 10),
('shaper', 'parent', 'online_risks', 'Talking about digital footprint without a lecture',
 'What they post now follows them further than they can currently imagine, and lecturing them about it never lands.',
 'Identity formation is happening in public at this age. A judgment free look at their own footprint teaches more than a warning ever will.',
 'Ask your teenager to search their own name with you. Look at what comes up together, as curious observers, not as an inspection.',
 'Show them their footprint. Do not describe it to them.',
 'How do I talk to my teenager about their digital footprint without it becoming a lecture?', 20),

-- Independent (ages 16 and above)
('independent', 'parent', 'wellbeing', 'Building genuine digital literacy before they leave home',
 'The goal at 16 is not compliance, it is a young person who can articulate their own relationship with technology.',
 'Within a year or two most will be managing their digital life with nobody checking in. The habits and self-awareness need to be theirs, not yours.',
 'Suggest a joint digital audit. Go through their online presence together as peers. Ask: what does this say about you, and what would you change?',
 'You are not managing their digital life anymore. You are helping them see it clearly.',
 'How do I help my 16 year old build real digital literacy before they leave home?', 10),
('independent', 'parent', 'safety', 'Deepfakes, sextortion, and having the direct conversation',
 'This is not a distant risk at this age. A specific, matter of fact conversation now is genuine protection.',
 'AI generated content and sextortion scams target this age group directly. Vague warnings do not prepare anyone. Specifics do.',
 'Have one direct, unemotional conversation: if anyone ever threatens you with an image, real or fake, you come to me immediately, no matter what led to it. This is a when, not an if.',
 'Specific and calm beats vague and alarmed, every time.',
 'How do I talk to my 16 plus year old about deepfakes and sextortion risks?', 30),

-- Teacher-facing variant (same underlying topic as the Explorer mood lesson, reframed for the classroom)
('explorer', 'teacher', 'wellbeing', 'Reading the mood signal in the classroom',
 'A single low day is not a pattern. A dip that repeats around the same lesson or same time each week is worth noting.',
 'Teachers see patterns parents do not, because the classroom is a consistent environment. A brief, factual note home is more useful than a general concern.',
 'If you notice a repeated pattern, log the day and context, then share it with the parent as a specific observation, not a diagnosis: this is what I have noticed, has this come up at home?',
 'Specific, repeated, and factual. That is what makes a home note useful.',
 'What should I include in a note home about a pattern of mood change I have noticed at school?', 10)
;

-- ════════════════ migrations/014_device_safety_hub.sql ════════════════

-- Guided Childhood: Device Safety Hub
-- Run AFTER 013_lessons_hub.sql.
-- device_guides: evergreen, public setup guide per device, seeded from the
--   content already live at tools.guidedchildhood.com so both surfaces stay
--   consistent. steps is a jsonb array of strings; a leading **word** marks
--   the part of the step that should render bold.
-- device_setup_progress: one row per user per device once they mark it done,
--   mirroring the pattern already used in script_completions.

create table if not exists public.device_guides (
  id          uuid primary key default uuid_generate_v4(),
  device_key  text not null unique,
  name        text not null,
  category    text not null,
  emoji       text not null,
  min_age     int not null,
  subtitle    text not null,
  why         text not null,
  steps       jsonb not null default '[]',
  note        text not null,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.device_guides enable row level security;

create policy "Device guides are public"
  on public.device_guides for select
  using (true);

create policy "Service role full access to device_guides"
  on public.device_guides for all
  using (auth.role() = 'service_role');

create index if not exists device_guides_category_idx on public.device_guides (category, sort_order);

create table if not exists public.device_setup_progress (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  device_key   text not null,
  completed_at timestamptz not null default now(),
  unique(user_id, device_key)
);

alter table public.device_setup_progress enable row level security;

create policy "Users can manage their own device progress"
  on public.device_setup_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_device_setup_progress_user
  on public.device_setup_progress (user_id);

-- ─────────────────────────────────────────────
-- Seed: 18 devices across 5 categories, content adapted from the live
-- Device Setup Pathway tool at tools.guidedchildhood.com.
-- ─────────────────────────────────────────────
insert into public.device_guides (device_key, name, category, emoji, min_age, subtitle, why, steps, note, sort_order) values

('iphone', 'iPhone and iPad', 'Phones and Tablets', '📱', 13,
 'Screen Time, Apple''s own parental controls',
 'Screen Time is the most powerful parental control on any consumer platform, but most families use a fraction of it. These are the settings that actually change behaviour.',
 '["**Set a Screen Time Passcode, different from the unlock PIN.** Settings, then Screen Time, then Use Screen Time Passcode. If your child knows both, the controls do nothing.", "**Turn on Downtime.** Schedule from a set evening time, only approved apps work. Settings, then Screen Time, then Downtime. This is the sleep layer, automated.", "**Set Communication Limits.** Contacts only during downtime for younger children. Settings, then Screen Time, then Communication Limits.", "**Content and Privacy Restrictions.** Set age ratings for apps, films and music, and block explicit content. Settings, then Screen Time, then Content and Privacy Restrictions.", "**Review the weekly report together.** Look at it with your child, not at them. Self awareness changes behaviour more than control."]',
 'Screen Time data is most powerful as a conversation starter. Ask, was that what you wanted, or did it just happen?', 10),

('android', 'Android Phone and Tablet', 'Phones and Tablets', '🤖', 13,
 'Google Family Link',
 'Family Link gives you oversight of your child''s whole Android device. It should be set up before their Google account is created, since retrofitting is harder.',
 '["**Install Google Family Link** on your phone and link your child''s Google account. Under 13s must be created through Family Link by law.", "**Turn on app approval,** so every Play Store download needs your permission. The single most important control to enable.", "**Enable SafeSearch** in Family Link to filter explicit results. Pair with router level filtering for full coverage.", "**Set daily limits and a bedtime.** When bedtime hits, the device locks automatically.", "**Review weekly activity reports** together, time per app, most used sites, location."]',
 'Family Link''s automatic controls reduce at 13. Mark that birthday with a conversation about what trust looks like next. Make it a milestone, not a sudden loss.', 20),

('firetablet', 'Amazon Fire Tablet', 'Phones and Tablets', '🔥', 4,
 'Amazon Kids and Kids Plus',
 'Fire tablets are common first devices for young children. Amazon Kids turns a wide open tablet into a genuinely controlled environment in minutes.',
 '["**Set up an Amazon Kids profile** for your child. Settings, then Profiles and Family Library. This restricts content automatically.", "**Set daily time limits and an age filter** in the Parent Dashboard. You can set different limits for educational versus entertainment use.", "**Disable the adult browser and store** from the Kids profile so they cannot wander out or make purchases.", "**Use Bedtime settings** to lock the tablet overnight. Keep it out of the bedroom regardless.", "**Review the Parent Dashboard weekly** to see exactly what was watched, read and played."]',
 'Even with a locked down Fire tablet, co view with under 7s. The device manages content, you model how to use it.', 30),

('switch', 'Nintendo Switch', 'Gaming', '🎮', 7,
 'The best parental controls in gaming',
 'Nintendo''s controls come as a dedicated app, survive a factory reset, and give remote oversight from your phone. Best in class. Eight minutes to set up.',
 '["**Download the Nintendo Switch Parental Controls app** and link it to the Switch using a code.", "**Set a restriction level.** This locks content to the right age rating automatically and cannot be changed without your PIN.", "**Set a daily play limit and bedtime.** The console suspends or hard locks when reached.", "**Disable online play and chat** until your child is older. Online multiplayer connects them with strangers.", "**Review friend requests together.** Online friends should be people known in real life."]',
 'Gaming is not the enemy. A child who stops when the timer goes is practising self regulation, a skill worth far more than the game.', 40),

('xbox', 'Xbox', 'Gaming', '🕹️', 7,
 'Xbox Family Settings app',
 'The Xbox Family Settings app puts full control on your phone, screen time, spending, content, and who your child can talk to online.',
 '["**Install the Xbox Family Settings app** and add your child''s account to your family group.", "**Set content filters by age** so games and apps above the limit are blocked automatically.", "**Set screen time schedules** per day. The console signs out when time runs out.", "**Control communication and multiplayer.** Restrict voice and text chat to friends only, or off entirely for younger children.", "**Require approval for purchases** so no surprise spending on add ons or games."]',
 'Voice chat with strangers is the main risk on console gaming. For under 13s, keep it to friends only or off, and revisit as trust is earned.', 50),

('playstation', 'PlayStation 5', 'Gaming', '🎯', 7,
 'PlayStation Family Management',
 'PS5 family controls are set through your account and cover age ratings, play time, spending, and online communication for each child.',
 '["**Create a child account** under your family on the PlayStation Network and set their date of birth accurately.", "**Set age level restrictions** for games, Blu ray and streaming apps.", "**Set monthly spending limits** and require your approval for purchases.", "**Restrict communication and user generated content.** Control messaging and who can interact with your child.", "**Set play time limits** by day, with an automatic logout when reached."]',
 'Set the child''s real birth date. Many controls apply automatically based on age, so an inflated age quietly removes protections.', 60),

('roblox', 'Roblox', 'Gaming', '🟥', 8,
 'Account restrictions and parental PIN',
 'Roblox is hugely popular with under 13s and contains user created content and chat. Default settings are too open, these tighten it considerably.',
 '["**Set the correct age** on the account. Under 13 accounts get stronger default protections automatically.", "**Add a Parental PIN** (Settings, then Security) so your child cannot change the safety settings themselves.", "**Enable Account Restrictions** to limit your child to a curated set of age appropriate experiences.", "**Set chat to off or friends only** under Settings, then Privacy. Control who can message and chat in game.", "**Turn off the ability to spend** by not storing card details and reviewing any Robux purchases together."]',
 'Roblox is social, not just a game. Treat it like an early social platform. Talk about who they play with and what online friends really means.', 70),

('youtube', 'YouTube and YouTube Kids', 'Streaming and Smart Home', '▶️', 13,
 'The platform most parents underestimate',
 'YouTube is the most used platform by UK children and the one with the biggest gap between assumed safety and reality. The algorithm optimises for watch time, not wellbeing.',
 '["**Under 10, use YouTube Kids only.** Enable Approved Content Only for the youngest. Delete or restrict the main app.", "**Turn off Autoplay everywhere.** This single setting restores the moment of decision, where self regulation lives.", "**For 13 plus, use Supervised Accounts** (Family Link) to set content level and pause history without using their login.", "**Enable Restricted Mode** on shared devices and lock it with your Family Link PIN.", "**Watch together sometimes.** Ask how did this get on your feed, to build algorithm literacy."]',
 'Say it plainly. YouTube is very good at knowing what keeps you watching, that is its job. Your job is knowing when to stop.', 80),

('alexa', 'Amazon Echo and Alexa', 'Streaming and Smart Home', '📢', 4,
 'Voice assistant and smart speaker',
 'Alexa listens by default and, linked to your account, can buy things, play anything, and reach the open internet by voice. Five minutes of setup makes it genuinely family safe.',
 '["**Enable Amazon Kids** on the child''s profile to filter content and block explicit music.", "**Set a voice purchasing PIN** (Settings, then Voice Purchasing) so no command can charge your account.", "**Turn off Drop In** for children''s devices to prevent unexpected call ins.", "**Set Do Not Disturb** for night hours, and keep Alexa out of bedrooms entirely.", "**Review voice history weekly** in the Alexa app, the transparency layer of the pathway."]',
 'Talk to your child about what Alexa is. It hears everything in this room, so we treat it the way we treat any conversation.', 90),

('firestick', 'Amazon Fire TV and Fire Stick', 'Streaming and Smart Home', '📺', 6,
 'Streaming device on any TV',
 'A Fire Stick turns any TV into full streaming access, Netflix, YouTube, Prime and more. Without controls, your child has open adult access.',
 '["**Turn on Parental Controls** (Settings, then Preferences, then Parental Controls) and set a PIN.", "**Set the content rating ceiling** appropriate to your child''s age.", "**Require a PIN for purchases and app installs** so nothing new appears without you.", "**Set PINs and profiles inside each app.** Fire controls what is installed, each app controls what is watched.", "**Keep the TV in a shared space,** no streaming devices in bedrooms."]',
 'Turn off autoplay in every streaming app. The habit of choosing what to watch, not just watching what comes next, is a real skill.', 100),

('appletv', 'Apple TV', 'Streaming and Smart Home', '🖥️', 6,
 'tvOS Screen Time and restrictions',
 'Apple TV uses the same Screen Time system as iPhone, with content restrictions, purchase controls and downtime for the whole household screen.',
 '["**Turn on Screen Time** (Settings, then Screen Time) and set a passcode only you know.", "**Set Content Restrictions** for films, TV and apps by age rating.", "**Require a passcode for purchases and downloads.**", "**Set Downtime** for evenings so the main screen winds down with the household.", "**Use separate profiles** so each family member''s limits and watch history stay distinct."]',
 'Shared family screens are a chance to model good habits. Co view, talk about what you watch, and end on a decision rather than a cliffhanger.', 110),

('roku', 'Roku', 'Streaming and Smart Home', '📡', 6,
 'PIN and content controls',
 'Roku controls live in your Roku account online rather than the device. A PIN stops new channels and purchases, profiles control what each viewer sees.',
 '["**Set a PIN** in your Roku account (my.roku.com) and require it for purchases and adding channels.", "**Create a Kids profile** or use Roku''s content level settings to filter mature channels.", "**Disable the channel store** for children so they cannot add apps without you.", "**Set PINs inside streaming apps** (Netflix, Disney Plus) for a second layer of control.", "**Keep streaming out of the bedroom** and review what has been added periodically."]',
 'Whole home protection still starts at the router. Combine Roku''s PIN with router level DNS filtering for the strongest setup.', 120),

('smarttv', 'Smart TV (Samsung, LG, Sony)', 'Streaming and Smart Home', '📺', 6,
 'Built in TV parental controls',
 'Modern smart TVs have their own app stores, browsers and voice assistants. The built in controls vary by brand but all support a PIN and content lock.',
 '["**Find Parental Controls** in Settings (often under Broadcasting, General, or System) and set a PIN.", "**Set a programme rating lock** so content above your chosen rating needs the PIN.", "**Restrict or PIN lock the app store** so new streaming apps cannot be added freely.", "**Disable the built in web browser** if your TV has one, it usually has no filtering.", "**Apply your family DNS at the router** so the TV''s apps and browser are filtered too."]',
 'The TV''s own controls only cover live broadcast and its app store. The real protection for everything streamed comes from the router and each app''s own settings.', 130),

('chromebook', 'Chromebook', 'Computers', '💻', 8,
 'Family Link supervised account',
 'Chromebooks are standard school devices. A supervised Google account gives you site filtering, app approval and activity reports across the whole machine.',
 '["**Sign in with a supervised Google account** managed through Family Link.", "**Turn on app and extension approval** so nothing installs without you.", "**Set SafeSearch and website filters,** allow or block specific sites.", "**Set screen time and bedtime limits** through Family Link.", "**Note that school managed devices** may have their own controls. Ask the school what is already in place."]',
 'If the Chromebook is school issued, your home controls may be limited. Ask what filtering the school applies and what you can add at the router.', 140),

('windows', 'Windows PC', 'Computers', '🪟', 8,
 'Microsoft Family Safety',
 'Microsoft Family Safety covers screen time, content filters, spending and activity reporting across a Windows PC and Xbox under one family group.',
 '["**Create a child account** and add it to your Microsoft family group.", "**Turn on web and search filtering** to block mature sites and force SafeSearch in Edge.", "**Set app and game limits by age rating.**", "**Set screen time schedules** across devices in the family group.", "**Review the weekly activity email** Microsoft sends you."]',
 'Web filtering only works fully in Microsoft Edge. Consider blocking other browsers for younger children, and filter at the router as a backstop.', 150),

('tiktok', 'TikTok', 'Social and Messaging', '🎵', 13,
 'Family Pairing and restrictions',
 'TikTok''s minimum age is 13. Its algorithm is among the most powerful at holding attention. Family Pairing links your account to your teen''s to set guardrails together.',
 '["**Use Family Pairing** (Settings, then Family Pairing) to link your phone to your teen''s account.", "**Set screen time limits** and turn on Restricted Mode to filter mature content.", "**Set the account to private** and limit who can comment, duet and message.", "**Turn off direct messages** for younger teens, or restrict to friends.", "**Review the For You feed together.** Talk about why certain content keeps appearing."]',
 'Before any social account, have the algorithm conversation. The feed is not random, engineers design it to keep you watching. Ask yourself, did I choose this, or did it choose me?', 160),

('snapchat', 'Snapchat', 'Social and Messaging', '👻', 13,
 'Family Center and location',
 'Snapchat''s disappearing messages and location sharing (Snap Map) carry specific risks. Family Center lets you see who your teen is talking to without reading the messages.',
 '["**Set up Family Center** (Settings, then Family Center) to see who your teen messages, without content.", "**Turn off the Snap Map** or set it to Ghost Mode so your child''s location is not shared.", "**Set Contact Me and Story privacy** to Friends Only.", "**Disable Quick Add** so strangers cannot easily find and add your child.", "**Talk about disappearing messages.** Nothing online truly disappears, screenshots last."]',
 'Snap Map location sharing is the setting parents most often miss. Check it together and make Ghost Mode the default.', 170),

('instagram', 'Instagram', 'Social and Messaging', '📷', 13,
 'Teen Accounts and supervision',
 'Instagram now defaults under 18s into Teen Accounts with built in protections. Supervision lets you set limits and see who they follow.',
 '["**Confirm they have a Teen Account.** These are private by default with restricted messaging.", "**Set up Supervision** (Settings, then Supervision) to set daily limits and see new followers.", "**Set the account to private** and limit messaging to people they follow.", "**Turn on Restricted or Sensitive Content controls** to reduce mature content in Explore.", "**Set a daily time limit and a break reminder.**"]',
 'Comparison is the hidden harm here, especially for girls. When you see someone''s highlight reel, you are comparing it to your behind the scenes, that is always an unfair fight.', 180),

('whatsapp', 'WhatsApp', 'Social and Messaging', '💬', 13,
 'Privacy and group settings',
 'WhatsApp has limited built in parental controls, so the protection comes from privacy settings and conversation. Groups are the main place children encounter unknown contacts.',
 '["**Set privacy to My Contacts** for profile photo, last seen, and about (Settings, then Privacy).", "**Control who can add them to groups.** Set to My Contacts to stop strangers adding them.", "**Turn on disappearing messages awareness** and talk about screenshots.", "**Show them how to block and report** a contact, and that doing so is always fine.", "**Agree that unknown numbers are never replied to** without checking with you."]',
 'Group chats are where most issues start. Keep the door open. If a group ever gets nasty or weird, you can always show me, you will not be in trouble.', 190)
;

-- ─────────────────────────────────────────────
-- Stage device guidance, adapted from the same tool, used at the top of
-- the Device Safety Hub to frame the guides for the child's actual stage.
-- Mirrors the stage naming already used across the rest of the app
-- (foundation, builder, explorer, shaper, independent).
-- ─────────────────────────────────────────────
create table if not exists public.device_stage_notes (
  stage_id  text primary key
              check (stage_id in ('foundation','builder','explorer','shaper','independent')),
  desc_text text not null,
  science   text not null
);

alter table public.device_stage_notes enable row level security;

create policy "Device stage notes are public"
  on public.device_stage_notes for select
  using (true);

create policy "Service role full access to device_stage_notes"
  on public.device_stage_notes for all
  using (auth.role() = 'service_role');

insert into public.device_stage_notes (stage_id, desc_text, science) values
('foundation', 'At this age it is shared screens and co-viewing, no solo devices, no feeds. Your presence is the protection.',
 'The AAP recommends no more than one hour a day of high quality content for ages 2 to 5, always co-viewed. For 6 and above, the focus shifts to consistent limits that protect sleep, activity and family time. Keep bedrooms and mealtimes device free.'),
('builder', 'Peer pressure around phones begins. Build the vocabulary, algorithms, privacy, digital footprint, before they own a device that needs it.',
 'For school age children the AAP advises consistent limits, commonly cited as up to two hours of recreational screen time, with parental controls in place and screens out of bedrooms 30 to 60 minutes before bed.'),
('explorer', 'The highest care stage. Guided smartphone use, no social media yet. This is when to hold the pathway closest.',
 'Cambridge research (Orben) identifies 11 to 13 as the peak sensitivity window, where social media shows its strongest link to lower life satisfaction, especially for girls. Watch for mood changes after use. Up to around 2 hours, with balance actively coached.'),
('shaper', 'Monitored social media enters the picture. The goal shifts from prevention to navigation and judgement.',
 'The research is consistent, social media amplifies existing vulnerabilities rather than harming all children equally. Transparency, open oversight rather than secret monitoring, and protected sleep remain the strongest levers at this age.'),
('independent', 'Full, trust based access, the destination the whole pathway was building towards. AI literacy and judgement, not removed restrictions.',
 'By 16, the evidence supports graduated full access for young people who have built the skills. The protective factors that matter most remain sleep, strong relationships, and the ability to self regulate, not surveillance.')
;

-- ════════════════ migrations/015_script_worked_feedback.sql ════════════════

-- Guided Childhood: Migration 015
-- Adds a lightweight "did this work" signal to script_completions so DiGi
-- can reference which scripts actually helped this family, not just which
-- were read.

alter table public.script_completions
  add column if not exists worked text
    check (worked in ('yes', 'somewhat', 'no'));

-- ════════════════ migrations/016_lesson_completions.sql ════════════════

-- Guided Childhood — Migration 016
-- Tracks which lessons a user has marked done. Neither the lessons table nor
-- ai_lessons had any per-user completion state before this, so lesson
-- progress could never be counted toward anything. lesson_source
-- disambiguates which table lesson_id points into, since ids are not
-- unique across the two tables.

create table if not exists public.lesson_completions (
  id            uuid        primary key default uuid_generate_v4(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  lesson_id     uuid        not null,
  lesson_source text        not null check (lesson_source in ('lesson', 'ai_lesson')),
  completed_at  timestamptz not null default now(),
  unique(user_id, lesson_id, lesson_source)
);

create index if not exists idx_lesson_completions_user
  on public.lesson_completions(user_id, completed_at desc);

alter table public.lesson_completions enable row level security;

create policy "Users can manage their own lesson completions"
  on public.lesson_completions
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ════════════════ migrations/017_lesson_slides.sql ════════════════

-- Guided Childhood: slide based lessons
-- Run AFTER 016_lesson_completions.sql.
-- This is the format 013 promised: teaching modules delivered as slides,
-- matching the planned schools build. A lesson with a non null slides column
-- renders in the interactive player; lessons without slides keep the four
-- section text layout, so existing seed content keeps working untouched.
--
-- Slide shapes (validated in the app, lib/content/lesson-slides.ts):
--   { "type": "title",   "eyebrow": text, "title": text, "body": text }
--   { "type": "concept", "heading": text, "body": text, "emoji": text }
--   { "type": "quote",   "label": text, "text": text }
--   { "type": "choice",  "question": text, "options": [{ "text", "correct", "feedback" }] }
--   { "type": "tryit",   "heading": text, "body": text }
--   { "type": "recap",   "heading": text, "points": [text] }

alter table public.lessons    add column if not exists slides jsonb;
alter table public.ai_lessons add column if not exists slides jsonb;

-- ─────────────────────────────────────────────
-- Exemplar: the flagship slide lesson, proving the format end to end.
-- Explorer stage, the algorithm lesson, because it is the conversation
-- every parent of an 11 to 13 year old is about to have.
-- ─────────────────────────────────────────────
insert into public.lessons (stage_id, audience, category, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, slides) values
('explorer', 'parent', 'online_risks', 'How the algorithm decides what your child sees',
 'The feed is not a window, it is a test. Every video your child finishes teaches the app what to show next.',
 'Understanding the mechanic is more protective than removing the app. A child who knows they are being tested watches differently.',
 'Sit together and deliberately like three videos about a hobby. Watch how fast the feed changes. Ten minutes, and the algorithm goes from invisible to obvious.',
 'The app shows you things to keep you watching, not because they are true or normal.',
 'How do I explain to my 12 year old how the TikTok algorithm works?',
 5,
 '[
   {
     "type": "title",
     "eyebrow": "Explorer · Ages 11 to 13",
     "title": "How the algorithm decides what your child sees",
     "body": "Two minutes, one experiment to run together tonight. What every parent should know before the TikTok conversation."
   },
   {
     "type": "video",
     "src": "https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_205017_2052451b-a1d7-4932-9839-fd875b134903.mp4",
     "caption": "DiGi explains the algorithm to the class"
   },
   {
     "type": "concept",
     "emoji": "🔬",
     "heading": "It is not a feed. It is a test.",
     "body": "Every scroll is a question the app asks your child: what makes you stay? Every pause, replay and finished video is an answer. The feed your child sees tomorrow is built from the answers they gave today."
   },
   {
     "type": "choice",
     "question": "Your child watches one upsetting video all the way to the end. What does the app learn?",
     "options": [
       { "text": "Nothing. One video is not a pattern.", "correct": false, "feedback": "It learns instantly. Watching to the end is the strongest signal a viewer can send, stronger than a like." },
       { "text": "That this content holds their attention, so show more of it.", "correct": true, "feedback": "Exactly. The app does not know the video was upsetting. It only knows it worked. More arrives within minutes." },
       { "text": "It only learns from videos they like or share.", "correct": false, "feedback": "Likes are the weakest signal. Watch time is the vote that counts, and it is cast silently." }
     ]
   },
   {
     "type": "concept",
     "emoji": "🪞",
     "heading": "Why this matters at 11 to 13",
     "body": "Research at Cambridge identifies ages 11 to 13 as the highest sensitivity window, particularly for girls. A feed that quietly doubles down on body image or sadness content lands exactly when it does the most damage. The protection is not deleting the app. It is a child who can see the test happening."
   },
   {
     "type": "quote",
     "label": "Say this, not a lecture",
     "text": "The app shows you things to keep you watching, not because they are true or normal. Want to see how fast we can change what it shows you?"
   },
   {
     "type": "tryit",
     "heading": "The ten minute reset, together",
     "body": "Open the app side by side. Deliberately search and like three videos about something your child actually loves, football skills, baking, a game. Then scroll. Watch the feed bend toward it in real time. Once a child has steered the algorithm on purpose, they never unsee it."
   },
   {
     "type": "recap",
     "heading": "What to remember",
     "points": [
       "Watch time is the vote. Finishing a video tells the app to send more, even when the video felt bad.",
       "Ages 11 to 13 are the sensitivity window. The feed conversation belongs now, not at 16.",
       "Steering the feed together once teaches more than any lecture about it."
     ]
   }
 ]'::jsonb)
on conflict do nothing;

-- ════════════════ migrations/018_curriculum_matrix.sql ════════════════

-- Guided Childhood: the curriculum matrix
-- Run AFTER 017_lesson_slides.sql.
-- Nine strands (the eight UKCIS Education for a Connected World strands plus
-- AI safety) by five stages, seeded as titled stubs in both audiences. Stubs
-- carry status 'stub' and are hidden from the hub until their slides land on
-- Days 4 and 5; existing lessons stay 'live'. The Explorer information strand
-- slot is already covered by the live algorithm lesson from 017, so it is
-- tagged rather than duplicated. The 013 placeholder seeds keep a null strand
-- until they are absorbed or replaced during the writing days.

alter table public.lessons add column if not exists strand text;
alter table public.lessons add column if not exists status text not null default 'live'
  check (status in ('live', 'stub'));
alter table public.ai_lessons add column if not exists strand text;

update public.lessons
  set strand = 'information'
  where title = 'How the algorithm decides what your child sees';

insert into public.lessons (stage_id, audience, strand, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, category) 
select v.stage_id, v.audience, v.strand, v.title, v.the_idea, v.why_it_matters, v.try_this, v.key_message, v.digi_prompt, v.sort_order, v.status, v.strand
from (values
('foundation', 'parent', 'identity', 'Me on a screen and me in real life', 'Knowing the difference between a picture of a thing and the thing itself.',
 'How children see themselves is shaped by what screens reflect back. This strand keeps the real self in charge of the online one.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Knowing the difference between a picture of a thing and the thing itself.', 'My child is 4 to 7. Help me with the lesson topic: Me on a screen and me in real life.', 500, 'stub'),
('builder', 'parent', 'identity', 'Your first avatar', 'Choosing what we show about ourselves in games and apps, and what we keep back.',
 'How children see themselves is shaped by what screens reflect back. This strand keeps the real self in charge of the online one.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Choosing what we show about ourselves in games and apps, and what we keep back.', 'My child is 8 to 10. Help me with the lesson topic: Your first avatar.', 500, 'stub'),
('explorer', 'parent', 'identity', 'Filters are not faces', 'Seeing how edited images work so they stop setting the standard for real ones.',
 'How children see themselves is shaped by what screens reflect back. This strand keeps the real self in charge of the online one.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Seeing how edited images work so they stop setting the standard for real ones.', 'My child is 11 to 13. Help me with the lesson topic: Filters are not faces.', 500, 'stub'),
('shaper', 'parent', 'identity', 'Who are you online?', 'Running different accounts while staying one honest person.',
 'How children see themselves is shaped by what screens reflect back. This strand keeps the real self in charge of the online one.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Running different accounts while staying one honest person.', 'My child is 13 to 15. Help me with the lesson topic: Who are you online?.', 500, 'stub'),
('independent', 'parent', 'identity', 'Your identity is yours to write', 'Presenting yourself for adult life, from group chats to first job applications.',
 'How children see themselves is shaped by what screens reflect back. This strand keeps the real self in charge of the online one.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Presenting yourself for adult life, from group chats to first job applications.', 'My child is 16 plus. Help me with the lesson topic: Your identity is yours to write.', 500, 'stub'),
('foundation', 'parent', 'relationships', 'Kind words on screens', 'Speaking to people through a screen the way you would face to face.',
 'Connection is the strongest protective factor in all the research. This strand teaches warmth, boundaries and judgement with people through screens.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Speaking to people through a screen the way you would face to face.', 'My child is 4 to 7. Help me with the lesson topic: Kind words on screens.', 500, 'stub'),
('builder', 'parent', 'relationships', 'Friends you know and friends you do not', 'Telling the difference between a real friend online and a stranger who plays one.',
 'Connection is the strongest protective factor in all the research. This strand teaches warmth, boundaries and judgement with people through screens.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Telling the difference between a real friend online and a stranger who plays one.', 'My child is 8 to 10. Help me with the lesson topic: Friends you know and friends you do not.', 500, 'stub'),
('explorer', 'parent', 'relationships', 'Group chats without the drama', 'Muting, leaving and standing up for someone kindly.',
 'Connection is the strongest protective factor in all the research. This strand teaches warmth, boundaries and judgement with people through screens.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Muting, leaving and standing up for someone kindly.', 'My child is 11 to 13. Help me with the lesson topic: Group chats without the drama.', 500, 'stub'),
('shaper', 'parent', 'relationships', 'Relationships, pressure and phones', 'Recognising pressure in private messages and knowing consent applies online.',
 'Connection is the strongest protective factor in all the research. This strand teaches warmth, boundaries and judgement with people through screens.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Recognising pressure in private messages and knowing consent applies online.', 'My child is 13 to 15. Help me with the lesson topic: Relationships, pressure and phones.', 500, 'stub'),
('independent', 'parent', 'relationships', 'Meeting people from the internet', 'Moving an online connection into real life safely, like an adult.',
 'Connection is the strongest protective factor in all the research. This strand teaches warmth, boundaries and judgement with people through screens.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Moving an online connection into real life safely, like an adult.', 'My child is 16 plus. Help me with the lesson topic: Meeting people from the internet.', 500, 'stub'),
('foundation', 'parent', 'reputation', 'The internet remembers', 'Understanding that what goes on a screen can stay there.',
 'What goes online stays reachable. This strand builds the habit of thinking in years, not minutes.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Understanding that what goes on a screen can stay there.', 'My child is 4 to 7. Help me with the lesson topic: The internet remembers.', 500, 'stub'),
('builder', 'parent', 'reputation', 'Think before you post', 'The five second check before anything is sent or shared.',
 'What goes online stays reachable. This strand builds the habit of thinking in years, not minutes.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'The five second check before anything is sent or shared.', 'My child is 8 to 10. Help me with the lesson topic: Think before you post.', 500, 'stub'),
('explorer', 'parent', 'reputation', 'Your digital footprint is already real', 'Searching yourself and understanding what is already out there.',
 'What goes online stays reachable. This strand builds the habit of thinking in years, not minutes.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Searching yourself and understanding what is already out there.', 'My child is 11 to 13. Help me with the lesson topic: Your digital footprint is already real.', 500, 'stub'),
('shaper', 'parent', 'reputation', 'Reputation and the long game', 'Reading your own posts the way a sixth form, a coach or an employer will.',
 'What goes online stays reachable. This strand builds the habit of thinking in years, not minutes.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Reading your own posts the way a sixth form, a coach or an employer will.', 'My child is 13 to 15. Help me with the lesson topic: Reputation and the long game.', 500, 'stub'),
('independent', 'parent', 'reputation', 'Owning your online record', 'Auditing, cleaning up and deliberately building the record you want found.',
 'What goes online stays reachable. This strand builds the habit of thinking in years, not minutes.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Auditing, cleaning up and deliberately building the record you want found.', 'My child is 16 plus. Help me with the lesson topic: Owning your online record.', 500, 'stub'),
('foundation', 'parent', 'bullying', 'When screens make you sad', 'Telling a grown up every time something on a screen feels bad.',
 'Every child will see unkindness online. This strand makes sure they know what to do, whether it lands on them or someone else.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Telling a grown up every time something on a screen feels bad.', 'My child is 4 to 7. Help me with the lesson topic: When screens make you sad.', 500, 'stub'),
('builder', 'parent', 'bullying', 'Mean messages', 'What to do, what not to do, and who to tell when messages turn unkind.',
 'Every child will see unkindness online. This strand makes sure they know what to do, whether it lands on them or someone else.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'What to do, what not to do, and who to tell when messages turn unkind.', 'My child is 8 to 10. Help me with the lesson topic: Mean messages.', 500, 'stub'),
('explorer', 'parent', 'bullying', 'Bystander or upstander', 'Breaking a group chat pile on instead of feeding it.',
 'Every child will see unkindness online. This strand makes sure they know what to do, whether it lands on them or someone else.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Breaking a group chat pile on instead of feeding it.', 'My child is 11 to 13. Help me with the lesson topic: Bystander or upstander.', 500, 'stub'),
('shaper', 'parent', 'bullying', 'Screenshots, shame and standing firm', 'Surviving public embarrassment online and helping someone else survive theirs.',
 'Every child will see unkindness online. This strand makes sure they know what to do, whether it lands on them or someone else.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Surviving public embarrassment online and helping someone else survive theirs.', 'My child is 13 to 15. Help me with the lesson topic: Screenshots, shame and standing firm.', 500, 'stub'),
('independent', 'parent', 'bullying', 'Calling it out safely', 'Supporting a target without becoming one, and knowing when to report instead.',
 'Every child will see unkindness online. This strand makes sure they know what to do, whether it lands on them or someone else.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Supporting a target without becoming one, and knowing when to report instead.', 'My child is 16 plus. Help me with the lesson topic: Calling it out safely.', 500, 'stub'),
('foundation', 'parent', 'information', 'Real or pretend?', 'Spotting the difference between stories, adverts and true things on a screen.',
 'Feeds are built to hold attention, not to tell the truth. This strand teaches how information really reaches us and how to check it.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Spotting the difference between stories, adverts and true things on a screen.', 'My child is 4 to 7. Help me with the lesson topic: Real or pretend?.', 500, 'stub'),
('builder', 'parent', 'information', 'Adverts are everywhere', 'Noticing when something on a screen is trying to sell you something.',
 'Feeds are built to hold attention, not to tell the truth. This strand teaches how information really reaches us and how to check it.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Noticing when something on a screen is trying to sell you something.', 'My child is 8 to 10. Help me with the lesson topic: Adverts are everywhere.', 500, 'stub'),
('shaper', 'parent', 'information', 'Deepfakes and doctored truth', 'Verifying before believing or sharing, because seeing is no longer proof.',
 'Feeds are built to hold attention, not to tell the truth. This strand teaches how information really reaches us and how to check it.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Verifying before believing or sharing, because seeing is no longer proof.', 'My child is 13 to 15. Help me with the lesson topic: Deepfakes and doctored truth.', 500, 'stub'),
('independent', 'parent', 'information', 'Your news diet', 'Building an information diet you chose on purpose instead of one chosen for you.',
 'Feeds are built to hold attention, not to tell the truth. This strand teaches how information really reaches us and how to check it.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Building an information diet you chose on purpose instead of one chosen for you.', 'My child is 16 plus. Help me with the lesson topic: Your news diet.', 500, 'stub'),
('foundation', 'parent', 'wellbeing', 'Screens, sleep and growing bodies', 'Why screens live outside the bedroom from the very start.',
 'Sleep, mood and movement are where screens bite first. This strand builds routines that protect all three without a daily fight.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Why screens live outside the bedroom from the very start.', 'My child is 4 to 7. Help me with the lesson topic: Screens, sleep and growing bodies.', 500, 'stub'),
('builder', 'parent', 'wellbeing', 'The cool down lap', 'Ending screen time without a meltdown, every time.',
 'Sleep, mood and movement are where screens bite first. This strand builds routines that protect all three without a daily fight.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Ending screen time without a meltdown, every time.', 'My child is 8 to 10. Help me with the lesson topic: The cool down lap.', 500, 'stub'),
('explorer', 'parent', 'wellbeing', 'Mood and the scroll', 'Noticing what the feed does to how you feel, and acting on it.',
 'Sleep, mood and movement are where screens bite first. This strand builds routines that protect all three without a daily fight.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Noticing what the feed does to how you feel, and acting on it.', 'My child is 11 to 13. Help me with the lesson topic: Mood and the scroll.', 500, 'stub'),
('shaper', 'parent', 'wellbeing', 'Sleep is not optional', 'Keeping nine hours a night when the phone wants them all.',
 'Sleep, mood and movement are where screens bite first. This strand builds routines that protect all three without a daily fight.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Keeping nine hours a night when the phone wants them all.', 'My child is 13 to 15. Help me with the lesson topic: Sleep is not optional.', 500, 'stub'),
('independent', 'parent', 'wellbeing', 'Designing your own digital life', 'Choosing habits on purpose before university and work choose them for you.',
 'Sleep, mood and movement are where screens bite first. This strand builds routines that protect all three without a daily fight.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Choosing habits on purpose before university and work choose them for you.', 'My child is 16 plus. Help me with the lesson topic: Designing your own digital life.', 500, 'stub'),
('foundation', 'parent', 'privacy', 'My privacy shield', 'Knowing what we never tell a screen: name, school, address, passwords.',
 'Personal information is valuable and children give it away without knowing. This strand builds the privacy shield early and keeps it growing.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Knowing what we never tell a screen: name, school, address, passwords.', 'My child is 4 to 7. Help me with the lesson topic: My privacy shield.', 500, 'stub'),
('builder', 'parent', 'privacy', 'Passwords are secrets', 'Making strong passwords and understanding why they are never shared.',
 'Personal information is valuable and children give it away without knowing. This strand builds the privacy shield early and keeps it growing.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Making strong passwords and understanding why they are never shared.', 'My child is 8 to 10. Help me with the lesson topic: Passwords are secrets.', 500, 'stub'),
('explorer', 'parent', 'privacy', 'Location, cameras and microphones', 'Knowing what your phone shares without asking and turning it off.',
 'Personal information is valuable and children give it away without knowing. This strand builds the privacy shield early and keeps it growing.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Knowing what your phone shares without asking and turning it off.', 'My child is 11 to 13. Help me with the lesson topic: Location, cameras and microphones.', 500, 'stub'),
('shaper', 'parent', 'privacy', 'Scams aimed at teenagers', 'Recognising sextortion, fake offers and pressure tactics, and what to do next.',
 'Personal information is valuable and children give it away without knowing. This strand builds the privacy shield early and keeps it growing.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Recognising sextortion, fake offers and pressure tactics, and what to do next.', 'My child is 13 to 15. Help me with the lesson topic: Scams aimed at teenagers.', 500, 'stub'),
('independent', 'parent', 'privacy', 'Your data, your accounts, your money', 'Securing an adult digital life before it holds anything worth stealing.',
 'Personal information is valuable and children give it away without knowing. This strand builds the privacy shield early and keeps it growing.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Securing an adult digital life before it holds anything worth stealing.', 'My child is 16 plus. Help me with the lesson topic: Your data, your accounts, your money.', 500, 'stub'),
('foundation', 'parent', 'ownership', 'Someone made that', 'Understanding that pictures, songs and games belong to the people who made them.',
 'Everything online was made by someone. This strand teaches respect for other peoples work and pride in your own.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Understanding that pictures, songs and games belong to the people who made them.', 'My child is 4 to 7. Help me with the lesson topic: Someone made that.', 500, 'stub'),
('builder', 'parent', 'ownership', 'Copying and creating', 'Using other peoples work fairly and starting to make your own.',
 'Everything online was made by someone. This strand teaches respect for other peoples work and pride in your own.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Using other peoples work fairly and starting to make your own.', 'My child is 8 to 10. Help me with the lesson topic: Copying and creating.', 500, 'stub'),
('explorer', 'parent', 'ownership', 'Remix culture', 'Memes, edits and giving credit where credit is due.',
 'Everything online was made by someone. This strand teaches respect for other peoples work and pride in your own.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Memes, edits and giving credit where credit is due.', 'My child is 11 to 13. Help me with the lesson topic: Remix culture.', 500, 'stub'),
('shaper', 'parent', 'ownership', 'Your work has value', 'Protecting what you make and post, because it is worth something.',
 'Everything online was made by someone. This strand teaches respect for other peoples work and pride in your own.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Protecting what you make and post, because it is worth something.', 'My child is 13 to 15. Help me with the lesson topic: Your work has value.', 500, 'stub'),
('independent', 'parent', 'ownership', 'Creating and getting paid', 'Ownership, licensing and earning from what you make online.',
 'Everything online was made by someone. This strand teaches respect for other peoples work and pride in your own.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Ownership, licensing and earning from what you make online.', 'My child is 16 plus. Help me with the lesson topic: Creating and getting paid.', 500, 'stub'),
('foundation', 'parent', 'ai_safety', 'Some voices are not people', 'Knowing that assistants and characters are tools, not friends.',
 'AI will be the water this generation swims in. This strand teaches what it is, what it is not, and how to use it to grow rather than shrink.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Knowing that assistants and characters are tools, not friends.', 'My child is 4 to 7. Help me with the lesson topic: Some voices are not people.', 500, 'stub'),
('builder', 'parent', 'ai_safety', 'What is a robot brain?', 'Understanding that AI learns from examples, and gets things wrong.',
 'AI will be the water this generation swims in. This strand teaches what it is, what it is not, and how to use it to grow rather than shrink.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Understanding that AI learns from examples, and gets things wrong.', 'My child is 8 to 10. Help me with the lesson topic: What is a robot brain?.', 500, 'stub'),
('explorer', 'parent', 'ai_safety', 'AI companions and real friends', 'Feeling the pull of an AI that always agrees, and keeping it in its place.',
 'AI will be the water this generation swims in. This strand teaches what it is, what it is not, and how to use it to grow rather than shrink.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Feeling the pull of an AI that always agrees, and keeping it in its place.', 'My child is 11 to 13. Help me with the lesson topic: AI companions and real friends.', 500, 'stub'),
('shaper', 'parent', 'ai_safety', 'Using AI to learn, not to skip learning', 'Homework, honesty and using AI to get stronger instead of weaker.',
 'AI will be the water this generation swims in. This strand teaches what it is, what it is not, and how to use it to grow rather than shrink.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Homework, honesty and using AI to get stronger instead of weaker.', 'My child is 13 to 15. Help me with the lesson topic: Using AI to learn, not to skip learning.', 500, 'stub'),
('independent', 'parent', 'ai_safety', 'Building with AI', 'Moving from user to maker: prompting, judgement and the changing world of work.',
 'AI will be the water this generation swims in. This strand teaches what it is, what it is not, and how to use it to grow rather than shrink.',
 'The full lesson with its video is on the way. Ask DiGi to walk you through this topic today.',
 'Moving from user to maker: prompting, judgement and the changing world of work.', 'My child is 16 plus. Help me with the lesson topic: Building with AI.', 500, 'stub')
) as v(stage_id, audience, strand, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status)
on conflict do nothing;

-- The school voice: every parent stub exists as a teacher stub too. Slides
-- and the materials layer differ when written; the topic spine is shared.
insert into public.lessons (stage_id, audience, strand, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, category)
select stage_id, 'teacher', strand, title, the_idea, why_it_matters, try_this, key_message, digi_prompt, sort_order, status, category
from public.lessons
where status = 'stub' and audience = 'parent'
on conflict do nothing;

-- ════════════════ migrations/019_digi_brain.sql ════════════════

-- Guided Childhood: DiGi's brain
-- Run AFTER 018_curriculum_matrix.sql.
-- Three tables: the expert knowledge corpus DiGi cites (researchers, clinical
-- experts, associations and reports, extendable forever by inserting rows),
-- structured per family memory DiGi saves and learns from, and the proactive
-- prompt queue DiGi fills so it leads with watch fors, daily life tips and
-- parent care rather than only answering.

create table if not exists public.expert_knowledge (
  id           uuid primary key default uuid_generate_v4(),
  source_type  text not null check (source_type in ('researcher','expert','association','report')),
  source_name  text not null,
  finding      text not null,
  age_bands    text[] not null default '{}',
  topics       text[] not null default '{}',
  url          text,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);
alter table public.expert_knowledge enable row level security;
create policy "Expert knowledge is public" on public.expert_knowledge for select using (true);
create policy "Service role manages expert knowledge" on public.expert_knowledge for all using (auth.role() = 'service_role');

create table if not exists public.digi_memory (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  child_id   uuid references public.children(id) on delete set null,
  kind       text not null check (kind in ('observation','concern','win','preference','context')),
  content    text not null,
  source     text not null default 'chat' check (source in ('chat','tracker','moments','system')),
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_digi_memory_user on public.digi_memory(user_id, created_at desc);
alter table public.digi_memory enable row level security;
create policy "Users manage own digi memory" on public.digi_memory for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.digi_prompts (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  child_id   uuid references public.children(id) on delete set null,
  kind       text not null check (kind in ('watch_for','tip','parent_care','new_research','celebration')),
  title      text not null,
  body       text not null,
  reason     text,
  status     text not null default 'pending' check (status in ('pending','seen','dismissed','acted')),
  created_at timestamptz not null default now()
);
create index if not exists idx_digi_prompts_user on public.digi_prompts(user_id, status, created_at desc);
alter table public.digi_prompts enable row level security;
create policy "Users manage own digi prompts" on public.digi_prompts for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics) values
('researcher', 'Prof Candace Odgers', 'Screen effects depend on the childs vulnerability and environment, not the device alone. Structure and warm relationships are protective; the same hours of use land differently in different homes.', '{4-7,8-10,11-13,13-15,16+}', '{screen_time,mood,routines}'),
('researcher', 'Prof Candace Odgers', 'Large correlational studies find small average associations between screen use and wellbeing. Panic is not the evidence based response; targeted support for already struggling children is.', '{8-10,11-13,13-15,16+}', '{screen_time,mood,anxiety}'),
('researcher', 'Dr Amy Orben', 'Developmental sensitivity windows exist: roughly ages 11 to 13 for girls and 14 to 15 for boys, when social media use and lower life satisfaction are most linked. Watchfulness matters most in these windows.', '{11-13,13-15}', '{social_media,mood,anxiety}'),
('researcher', 'Dr Amy Orben', 'Average effects of screen time on wellbeing are small; individual variation is large. Track your own childs pattern rather than applying a universal rule.', '{8-10,11-13,13-15,16+}', '{screen_time,mood}'),
('researcher', 'Prof Andrew Przybylski', 'The Goldilocks pattern: moderate digital engagement is not associated with harm and can be beneficial; harm concentrates at the extremes of very heavy use, especially when it displaces sleep and activity.', '{8-10,11-13,13-15,16+}', '{screen_time,sleep,gaming}'),
('researcher', 'Prof Sonia Livingstone', 'Children need skills and agency online, not only restriction. Heavy restriction lowers risk but also strips away digital opportunity and learning; guided use builds resilience.', '{4-7,8-10,11-13,13-15,16+}', '{safety,screen_time,relationships}'),
('researcher', 'Prof Sonia Livingstone', 'Active mediation, talking about and sharing online life, protects better than covert monitoring, which damages trust when discovered.', '{8-10,11-13,13-15,16+}', '{relationships,safety,social_media}'),
('expert', 'Dr Becky Kennedy', 'Sturdy leadership: hold the boundary and validate the feeling at the same time. The boundary is the decision, empathy is the delivery. Neither alone works.', '{4-7,8-10,11-13,13-15}', '{routines,mood,relationships}'),
('expert', 'Dr Becky Kennedy', 'Behaviour is a signal, not the problem. A meltdown at screen off is a child struggling with a transition, not defiance; teach the skill, keep the boundary.', '{4-7,8-10,11-13}', '{screen_time,gaming,mood}'),
('expert', 'Dr Becky Kennedy', 'Repair beats perfection. If you shouted, going back later to say sorry and reconnect teaches more emotional regulation than never losing your temper would.', '{4-7,8-10,11-13,13-15,16+}', '{relationships,parent_wellbeing,mood}'),
('expert', 'Catherine Knibbs', 'Children process distressing online experiences like real world trauma. Respond with calm and curiosity, never device confiscation as punishment for disclosure, or the next incident stays secret.', '{8-10,11-13,13-15,16+}', '{safety,trauma,relationships}'),
('expert', 'Catherine Knibbs', 'Secrecy is the risk multiplier online. The single most protective factor is a child who believes they can tell you anything they saw without losing their device.', '{8-10,11-13,13-15,16+}', '{safety,trauma,social_media}'),
('expert', 'Sue Atkins', 'Structure beats willpower for families. Predictable routines around screens remove the daily negotiation; the routine is the boundary so the parent does not have to be.', '{4-7,8-10,11-13}', '{routines,screen_time}'),
('expert', 'Sue Atkins', 'Side by side conversations, in the car, on the school run, while cooking, open children up far more than face to face interrogation. Use the school run as the talking window.', '{4-7,8-10,11-13,13-15,16+}', '{relationships,mood,routines}'),
('expert', 'Dr Tanya Byron', 'The Byron Review principle: risk online cannot be eliminated, so the goal is resilience through graduated, age appropriate access with support, the same way we teach road safety.', '{4-7,8-10,11-13,13-15,16+}', '{safety,screen_time}'),
('researcher', 'Dr Lisa Damour', 'For adolescent girls, treat feelings as data, not emergencies. Distress after social media use is information to explore together, not automatically a crisis or a reason to confiscate.', '{11-13,13-15,16+}', '{anxiety,mood,social_media}'),
('researcher', 'Dr Lisa Damour', 'Sleep displacement is the clearest mechanism by which phones harm adolescent mental health. Protecting nine hours does more than any content rule.', '{11-13,13-15,16+}', '{sleep,mood,anxiety}'),
('researcher', 'danah boyd', 'Teenagers seek autonomy and social connection online, not danger. Blanket restriction pushes the same behaviour underground where no adult can help.', '{11-13,13-15,16+}', '{social_media,relationships,safety}'),
('expert', 'Devorah Heitner', 'Mentorship over monitoring: children need adults who help them navigate what they will inevitably encounter, not surveillance that ends the conversation.', '{8-10,11-13,13-15,16+}', '{safety,relationships,social_media}'),
('researcher', 'Prof Christopher Ferguson', 'Media technology panics follow a repeating historical pattern and the measured effects are consistently smaller than public fear. Calibrate concern to your childs actual signals, not headlines.', '{4-7,8-10,11-13,13-15,16+}', '{screen_time,mood}'),
('association', 'NHS and RCPCH guidance', 'There is no evidence based universal safe screen time number. The useful questions: is screen use displacing sleep, exercise, schoolwork or family time, and is the child in control of stopping?', '{4-7,8-10,11-13,13-15,16+}', '{screen_time,sleep,routines}'),
('association', 'NHS and RCPCH guidance', 'Device free bedrooms are the single highest impact household rule for childrens sleep and mood, and the evidence is strongest here of any screen intervention.', '{4-7,8-10,11-13,13-15,16+}', '{sleep,routines,mood}'),
('association', 'MindEd and NHS guidance', 'Parent mental health is child mental health: parental stress and burnout transmit directly to children. A regulated parent is the intervention; parents caring for their own sleep, support and downtime is not selfish, it is protective.', '{4-7,8-10,11-13,13-15,16+}', '{parent_wellbeing,mood,routines}'),
('association', 'UK crisis signposting', 'Red flags need humans, not apps: self harm, suicidal talk, disclosure of abuse or grooming. Same day GP or NHS 111; CAMHS via GP referral; Childline 0800 1111 for the child; Samaritans 116 123 for anyone; CEOP for online exploitation reports.', '{4-7,8-10,11-13,13-15,16+}', '{safety,trauma,anxiety,crisis}');

-- ════════════════ migrations/020_school_link.sql ════════════════

-- Guided Childhood: the school link
-- Run AFTER 019_digi_brain.sql.
-- Parents forward school emails to a private per family DiGi address (one
-- time forwarding rule filtered by the school's sender, works with Gmail,
-- Outlook or anything else, no OAuth needed). An inbound webhook extracts
-- the actionable items (kit reminders, payments, homework, trips, deadlines)
-- into school_actions and surfaces them through the existing digi_prompts
-- dashboard cards. Raw email bodies are not retained, only the extracted
-- actions, which keeps the child data footprint minimal.

create table if not exists public.school_connections (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  school_name      text not null,
  sender_addresses text[] not null default '{}',
  forward_token    text not null unique,
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);
alter table public.school_connections enable row level security;
create policy "Users manage own school connections" on public.school_connections for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.school_actions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  kind        text not null check (kind in ('kit','payment','homework','event','deadline','notice')),
  title       text not null,
  detail      text,
  due_date    date,
  status      text not null default 'open' check (status in ('open','done','dismissed')),
  created_at  timestamptz not null default now()
);
create index if not exists idx_school_actions_user on public.school_actions(user_id, status, due_date);
alter table public.school_actions enable row level security;
create policy "Users manage own school actions" on public.school_actions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- The dashboard prompt cards gain a school kind.
alter table public.digi_prompts drop constraint if exists digi_prompts_kind_check;
alter table public.digi_prompts add constraint digi_prompts_kind_check
  check (kind in ('watch_for','tip','parent_care','new_research','celebration','school'));

-- ════════════════ migrations/021_family_agreements.sql ════════════════

-- Guided Childhood — Migration 021
-- The family agreement builder. One living agreement per account,
-- negotiated per stage, signed by parent and child, with a review date
-- so the agreement gets revisited each term instead of going stale.
-- Version counts how many times the family has re agreed it.

create table if not exists public.family_agreements (
  id                    uuid        primary key default uuid_generate_v4(),
  user_id               uuid        not null references auth.users(id) on delete cascade,
  version               int         not null default 1,
  stage_id              text,
  agreed_date           date,
  review_date           date,

  -- Agreement sections, filled in by the family together
  family_values         text,
  bedroom_rule_time     text,
  bedroom_rule_location text,
  social_media_terms    text,
  when_things_go_wrong  text,
  extra_agreements      text,

  signed_by_parent      boolean     not null default false,
  signed_by_child       boolean     not null default false,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique(user_id)
);

alter table public.family_agreements enable row level security;

create policy "Users can manage their own family agreement"
  on public.family_agreements
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ════════════════ migrations/022_email_log.sql ════════════════

-- Guided Childhood — Migration 022
-- Email system support. email_log makes every lifecycle send idempotent:
-- one row per user per email key, so the daily cron can never double
-- send. Weekly digests use a dated key (digest-2026-28). email_opt_out
-- on profiles is the one switch the unsubscribe link flips.

create table if not exists public.email_log (
  id         uuid        primary key default uuid_generate_v4(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  email_key  text        not null,
  sent_at    timestamptz not null default now(),
  unique(user_id, email_key)
);

create index if not exists idx_email_log_user
  on public.email_log(user_id);

alter table public.email_log enable row level security;

-- Written only by the service role (cron and server routes). Users can
-- see their own send history, nothing else.
create policy "Users can view their own email log"
  on public.email_log
  for select
  using (auth.uid() = user_id);

alter table public.profiles
  add column if not exists email_opt_out boolean not null default false;
