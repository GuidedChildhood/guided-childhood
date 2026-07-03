-- GUIDED CHILDHOOD CATCH UP · STEP 03 · device-hub
-- Paste into a NEW query tab, Run, look for the COMPLETE message.

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

-- Guided Childhood: Migration 015
-- Adds a lightweight "did this work" signal to script_completions so DiGi
-- can reference which scripts actually helped this family, not just which
-- were read.

alter table public.script_completions
  add column if not exists worked text
    check (worked in ('yes', 'somewhat', 'no'));

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

select 'STEP 03 COMPLETE · device-hub' as status;
