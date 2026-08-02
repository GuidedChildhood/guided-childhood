-- Guided Childhood — Migration 150
--
-- The routing vocabulary, in the database, plus whether DiGi actually answered.
--
-- THE MISS THAT STARTED IT. Justin asked DiGi about Teo and the television.
-- classifyLane did not recognise it as a parenting message, so it paid for a
-- model call to work that out: 1332ms on his 14:05 message, measured, not
-- guessed. The reason is embarrassing once seen. The keyword list has youtube,
-- roblox, xbox and ipad in it, and does not have the television.
--
--   NO MATCH  <- Teo wakes up sbd puts tv on first thing then cries...
--   NO MATCH  <- he wont get off the telly
--   NO MATCH  <- she watches netflix all evening
--
-- In a product whose entire argument is that it is not the device, it is what
-- is on it.
--
-- WHY THE LIST MOVES TO THE DATABASE. Justin wants to review the misses weekly
-- and tap a word to add it. A button cannot edit a TypeScript array. Same rule
-- as scripts, non-negotiable 6: the thing the founder edits lives in a table.
--
-- WHAT THIS COSTS ON THE CLOCK. Nothing. The list is read in the FIRST gather
-- round, which is already thirteen queries in parallel, so it hides behind the
-- slowest one. It is also cached in the running instance, so most requests
-- never query at all. And if the read fails, lane.ts still has the built in
-- list, because a routing hint must never be the reason a parent gets no reply.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

-- ── 1. The vocabulary ──────────────────────────────────────────────────────

create table if not exists public.digi_lane_keywords (
  word text primary key,
  category text not null default 'other',
  -- 'seed' shipped with the migration, 'founder' was added from the Insights
  -- board. Kept apart so it is always clear which words we chose deliberately
  -- and which were learned from real parents.
  source text not null default 'seed',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.digi_lane_keywords is
  'Words that mark a message as being about a child and a screen, so classifyLane can answer without a model call. A speed optimisation, never a safety mechanism.';

comment on column public.digi_lane_keywords.active is
  'Turned off rather than deleted, so a word that caused false positives stays visible as a decision already taken.';

-- ── 2. Did it actually answer ──────────────────────────────────────────────
--
-- Migration 149 recorded how long every phase took and not whether an answer
-- came out, so when Justin asked which of four rows was his failure there was
-- no way to tell. Speed measured, outcome forgotten.

alter table public.digi_latency
  add column if not exists replied boolean;

comment on column public.digi_latency.replied is
  'Whether any text actually reached the parent. Without this a four second failure and a four second success are the same row.';

alter table public.digi_latency
  add column if not exists reply_chars integer;

comment on column public.digi_latency.reply_chars is
  'Length of the reply. A very short one is worth seeing even when replied is true.';

alter table public.digi_latency
  add column if not exists failure text;

comment on column public.digi_latency.failure is
  'Which failure, since the parent facing text cannot tell them apart: empty, model_error, or stream_error. Null when it answered.';

-- ── 3. The words we did not know ───────────────────────────────────────────
--
-- PRIVACY, and this is the whole design rather than a footnote. Words, never
-- messages. lane.ts drops stopwords, anything capitalised mid sentence (names),
-- and caps how many words one message can contribute. The Insights board then
-- refuses to show a word until TWO OR MORE separate families have used it, so
-- one family's word is never shown to anybody, including Justin.
--
-- That is the same de-identification rule that governs rebuildWisdom: counts
-- and labels we chose, never a family's own words.

create table if not exists public.digi_lane_misses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  word text not null,
  -- Only ever used to COUNT DISTINCT families in the founder view, never to
  -- look up what one family said. Cascades so a deleted account takes its
  -- words with it.
  user_id uuid references auth.users(id) on delete cascade
);

comment on table public.digi_lane_misses is
  'Candidate words from messages the keyword pass could not classify. Single words only, never messages. Nothing surfaces until two or more families have used it.';

create index if not exists digi_lane_misses_word_idx
  on public.digi_lane_misses (word);

create index if not exists digi_lane_misses_created_at_idx
  on public.digi_lane_misses (created_at desc);

-- ── RLS ────────────────────────────────────────────────────────────────────
--
-- Keywords: every signed in user reads them, because the route reads the list
-- as the signed in parent. Nobody writes from a browser; the Insights button
-- goes through a founder gated API route using the admin client.

alter table public.digi_lane_keywords enable row level security;

drop policy if exists "keywords readable" on public.digi_lane_keywords;
create policy "keywords readable" on public.digi_lane_keywords
  for select using (auth.uid() is not null);

-- Misses: insert own, and no select policy at all. Aggregate across families is
-- founder only and reached with the admin client, exactly like
-- management_findings.

alter table public.digi_lane_misses enable row level security;

drop policy if exists "own miss insert" on public.digi_lane_misses;
create policy "own miss insert" on public.digi_lane_misses
  for insert with check (auth.uid() = user_id);

-- ── The seed ───────────────────────────────────────────────────────────────
--
-- Justin: "can we do an overall keyword search on everything a kid would watch
-- social media and everything most likely".
--
-- DELIBERATELY EXCLUDED, and this is the careful half. A false positive is not
-- free: it sends a general question to the parenting lane, which is the exact
-- thing the general lane was built to stop. So these are left out even though
-- they are real: bare 'x' (matches everywhere), 'prime' (prime minister, prime
-- time), 'lol' (laughter), 'kick', 'signal', and bare 'watch' or 'watching'
-- ("watching the news"). The phrases go in instead: prime video, apple tv.
--
-- The suffix rule in lane.ts already handles plurals and possessives, so the
-- singular is enough.

insert into public.digi_lane_keywords (word, category) values
  -- Television and streaming, the hole this migration exists to fill
  ('tv', 'watching'), ('telly', 'watching'), ('television', 'watching'),
  ('netflix', 'watching'), ('disney', 'watching'), ('iplayer', 'watching'),
  ('hulu', 'watching'), ('paramount', 'watching'), ('peacock', 'watching'),
  ('prime video', 'watching'), ('apple tv', 'watching'), ('now tv', 'watching'),
  ('cbbc', 'watching'), ('cbeebies', 'watching'), ('nickelodeon', 'watching'),
  ('nick jr', 'watching'), ('cartoon network', 'watching'), ('cartoon', 'watching'),
  ('boxset', 'watching'), ('box set', 'watching'), ('episode', 'watching'),
  ('season', 'watching'), ('movie', 'watching'), ('film', 'watching'),
  ('binge', 'watching'), ('autoplay', 'watching'), ('remote', 'watching'),
  ('channel', 'watching'), ('streaming', 'watching'), ('subtitles', 'watching'),

  -- Social
  ('tiktok', 'social'), ('instagram', 'social'), ('insta', 'social'),
  ('snapchat', 'social'), ('facebook', 'social'), ('whatsapp', 'social'),
  ('youtube', 'social'), ('shorts', 'social'), ('reels', 'social'),
  ('twitter', 'social'), ('threads', 'social'), ('bereal', 'social'),
  ('pinterest', 'social'), ('tumblr', 'social'), ('discord', 'social'),
  ('reddit', 'social'), ('twitch', 'social'), ('telegram', 'social'),
  ('messenger', 'social'), ('dm', 'social'), ('story', 'social'),
  ('follower', 'social'), ('following', 'social'), ('unfollow', 'social'),
  ('block', 'social'), ('comment', 'social'), ('post', 'social'),
  ('profile', 'social'), ('selfie', 'social'), ('filter', 'social'),
  ('viral', 'social'), ('trend', 'social'), ('meme', 'social'),
  ('hashtag', 'social'), ('livestream', 'social'), ('screen time', 'social'),

  -- Games, and the money inside them
  ('roblox', 'gaming'), ('minecraft', 'gaming'), ('fortnite', 'gaming'),
  ('xbox', 'gaming'), ('playstation', 'gaming'), ('ps5', 'gaming'),
  ('ps4', 'gaming'), ('nintendo', 'gaming'), ('wii', 'gaming'),
  ('steam', 'gaming'), ('among us', 'gaming'), ('call of duty', 'gaming'),
  ('cod', 'gaming'), ('fifa', 'gaming'), ('gta', 'gaming'),
  ('valorant', 'gaming'), ('overwatch', 'gaming'), ('apex', 'gaming'),
  ('brawl stars', 'gaming'), ('clash', 'gaming'), ('candy crush', 'gaming'),
  ('subway surfers', 'gaming'), ('gacha', 'gaming'), ('pokemon', 'gaming'),
  ('mario', 'gaming'), ('sonic', 'gaming'), ('multiplayer', 'gaming'),
  ('robux', 'gaming'), ('v bucks', 'gaming'), ('vbucks', 'gaming'),
  ('skin', 'gaming'), ('battle pass', 'gaming'), ('loot box', 'gaming'),
  ('in app purchase', 'gaming'), ('level up', 'gaming'), ('respawn', 'gaming'),
  ('lobby', 'gaming'), ('headset', 'gaming'), ('controller', 'gaming'),

  -- Creators and formats
  ('youtuber', 'creator'), ('streamer', 'creator'), ('influencer', 'creator'),
  ('mrbeast', 'creator'), ('sidemen', 'creator'), ('ksi', 'creator'),
  ('skibidi', 'creator'), ('unboxing', 'creator'), ('asmr', 'creator'),
  ('prank', 'creator'), ('challenge', 'creator'), ('vlog', 'creator'),
  ('podcast', 'creator'), ('clickbait', 'creator'), ('sponsored', 'creator'),

  -- Devices
  ('smartphone', 'device'), ('iphone', 'device'), ('android', 'device'),
  ('computer', 'device'), ('pc', 'device'), ('chromebook', 'device'),
  ('kindle', 'device'), ('smartwatch', 'device'), ('alexa', 'device'),
  ('airpods', 'device'), ('headphones', 'device'), ('vr', 'device'),
  ('oculus', 'device'), ('charger', 'device'), ('notification', 'device'),
  ('parental control', 'device'), ('password', 'device'), ('setting', 'device'),

  -- The day, the family, the feelings. These already existed in lane.ts and are
  -- seeded here so the table is the whole list rather than an extra list.
  ('child', 'family'), ('children', 'family'), ('kid', 'family'),
  ('son', 'family'), ('daughter', 'family'), ('teen', 'family'),
  ('teenager', 'family'), ('toddler', 'family'), ('year old', 'family'),
  ('yr old', 'family'), ('sibling', 'family'), ('brother', 'family'),
  ('sister', 'family'), ('boy', 'family'), ('girl', 'family'),
  ('screen', 'device'), ('phone', 'device'), ('mobile', 'device'),
  ('tablet', 'device'), ('ipad', 'device'), ('laptop', 'device'),
  ('device', 'device'), ('console', 'gaming'), ('snap', 'social'),
  ('gaming', 'gaming'), ('game', 'gaming'), ('app', 'device'),
  ('online', 'device'), ('internet', 'device'), ('wifi', 'device'),
  ('social media', 'social'), ('algorithm', 'social'), ('feed', 'social'),
  ('group chat', 'social'), ('bedtime', 'day'), ('sleep', 'day'),
  ('homework', 'day'), ('school', 'day'), ('teacher', 'day'),
  ('classroom', 'day'), ('playground', 'day'), ('chore', 'day'),
  ('pocket money', 'day'), ('routine', 'day'), ('morning', 'day'),
  ('breakfast', 'day'), ('dinner', 'day'), ('tea time', 'day'),
  ('anxious', 'feelings'), ('anxiety', 'feelings'), ('worried', 'feelings'),
  ('mood', 'feelings'), ('meltdown', 'feelings'), ('tantrum', 'feelings'),
  ('lonely', 'feelings'), ('bullied', 'feelings'), ('bullying', 'feelings'),
  ('confidence', 'feelings'), ('friend', 'feelings'), ('friendship', 'feelings'),
  ('withdrawn', 'feelings'), ('boundary', 'feelings'), ('discipline', 'feelings'),
  ('consequence', 'feelings'), ('grounded', 'feelings'), ('crying', 'feelings'),
  ('cries', 'feelings'), ('shouting', 'feelings'), ('argument', 'feelings'),
  ('digi', 'product'), ('pathway', 'product'), ('passport', 'product'),
  ('stage', 'product'), ('lesson', 'product'), ('script', 'product'),
  ('star', 'product'), ('quest', 'product')
on conflict (word) do nothing;
