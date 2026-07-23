-- Guided Childhood — Migration 093
-- Per platform social media settings guides, so a parent gets the exact
-- settings to lock on each platform, delivered at the age it becomes relevant.
-- Content in the database, not the app, so it stays a living document a parent
-- can be kept current on as platforms change (they rename and move toggles
-- often). UK context, current to July 2026, grounded in each platform's own
-- help pages plus Internet Matters, NSPCC, Childnet and Ofcom.
--
-- The honest through line on every row: the minimum age is the platform's own
-- account rule, not a readiness signal. Readiness is the child, the settings
-- and the conversation, never the birthday the sign up screen accepts.
--
-- first_seen_stage is the pathway stage the guide starts surfacing at, so
-- YouTube and Roblox appear early, the social apps at the secondary transition,
-- and the messaging and community apps a little later. Idempotent, guarded on
-- platform_key. No dashes in any copy.

set lock_timeout = '3s';

create table if not exists public.social_platform_guides (
  id uuid primary key default uuid_generate_v4(),
  platform_key text not null unique,
  name text not null,
  emoji text not null,
  min_age int not null,
  first_seen_stage int not null,          -- 1 to 5, the stage it becomes age relevant
  blurb text not null,                    -- one warm line on what it is and why it matters
  settings jsonb not null,                -- [{ "name": "...", "how": "..." }, ...]
  watch_fors jsonb not null,              -- ["...", "..."]
  supervision text not null,              -- the official parental tool, or the honest none
  official_url text not null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now()
);

alter table public.social_platform_guides enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'social_platform_guides' and policyname = 'social_platform_guides_read') then
    create policy social_platform_guides_read on public.social_platform_guides for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'social_platform_guides' and policyname = 'social_platform_guides_service') then
    create policy social_platform_guides_service on public.social_platform_guides for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
  end if;
end $$;

-- ── YouTube · often the earliest, surfaces from Builder ─────────────────────
insert into public.social_platform_guides (platform_key, name, emoji, min_age, first_seen_stage, blurb, settings, watch_fors, supervision, official_url, sort_order)
select 'youtube', 'YouTube', '📺', 13, 2,
  'Usually the first platform a child meets, often on a shared TV or tablet. Under 13s belong on YouTube Kids or a supervised account, not the open app.',
  $j$[
    {"name":"Use YouTube Kids or a supervised account","how":"For under 13s, set it up through Google Family Link rather than a standard account."},
    {"name":"Lock Restricted Mode","how":"On a standard account, turn Restricted Mode on and lock it through Family Link so it cannot be switched off."},
    {"name":"Cap the Shorts feed","how":"On supervised accounts, set a daily Shorts time limit, or turn the Shorts feed off. It is the strongest pull."},
    {"name":"Turn comments and live chat off","how":"Keep them hidden or disabled for younger tiers."},
    {"name":"Turn autoplay off and pause history","how":"Autoplay off, and pause watch and search history to calm the recommendations."}
  ]$j$::jsonb,
  $w$["The Shorts feed is the hardest to put down, cap it first","Recommendations can drift from gentle to edgier on their own","Age restricted content still slips through if Restricted Mode is only toggled, not locked"]$w$::jsonb,
  'Google Family Link governs supervised accounts and a supervised experience for 13 to 17s.',
  'https://support.google.com/youtube/answer/13877231', 10
where not exists (select 1 from public.social_platform_guides where platform_key = 'youtube');

-- ── Roblox · gaming, met young, surfaces from Builder ───────────────────────
insert into public.social_platform_guides (platform_key, name, emoji, min_age, first_seen_stage, blurb, settings, watch_fors, supervision, official_url, sort_order)
select 'roblox', 'Roblox', '🧩', 13, 2,
  'A game and a social space in one, often first met at 6 to 10. Chat and social features are age gated, and safer account tiers now set defaults for younger children.',
  $j$[
    {"name":"Set a Parental PIN","how":"A four digit code that locks the parental controls section so settings cannot be changed."},
    {"name":"Restrict chat by age","how":"Since early 2026 a child passes an age check before chat works. Set chat off or restricted for younger children."},
    {"name":"Limit content maturity","how":"Restrict experiences by their maturity label and block individual games."},
    {"name":"Set a monthly spending limit","how":"In Parental Controls, cap Robux with the PIN required to change it."},
    {"name":"Turn off who can chat and message","how":"For under 13s, set who can chat with me and who can message me to no one."}
  ]$j$::jsonb,
  $w$["In experience chat and user made games can contain adult content","Robux spending and free Robux scams target children","Adults can still attempt contact despite age banding"]$w$::jsonb,
  'A parent linked account with Parental Controls and a Parental PIN.',
  'https://en.help.roblox.com/hc/en-us/articles/203313120-Parental-Controls', 20
where not exists (select 1 from public.social_platform_guides where platform_key = 'roblox');

-- ── WhatsApp · the secondary transition ─────────────────────────────────────
insert into public.social_platform_guides (platform_key, name, emoji, min_age, first_seen_stage, blurb, settings, watch_fors, supervision, official_url, sort_order)
select 'whatsapp', 'WhatsApp', '💬', 13, 3,
  'Usually arrives with the class and club group chats at secondary. There is no parental dashboard, so this one is managed with settings and conversation.',
  $j$[
    {"name":"Groups set to My contacts","how":"Settings, Privacy, Groups. So strangers cannot add your child to groups without a private invite."},
    {"name":"Hide last seen, photo, about and status","how":"Set each to My contacts, not Everyone."},
    {"name":"Set a disappearing messages default","how":"Choose a default timer for new chats if you want messages to clear."},
    {"name":"Silence unknown callers","how":"Turn on so calls from numbers not in contacts are muted, and use Blocked contacts."},
    {"name":"Turn on strict account settings","how":"The Advanced switch that blocks attachments from unknown senders and tightens profile and group controls."}
  ]$j$::jsonb,
  $w$["Being added to large groups by unknown numbers","Disappearing messages hiding history you might want to see later","Unsolicited contact and images from unknown numbers"]$w$::jsonb,
  'None. WhatsApp has no parental dashboard, so manage it at the phone level with Screen Time or Family Link.',
  'https://faq.whatsapp.com/', 30
where not exists (select 1 from public.social_platform_guides where platform_key = 'whatsapp');

-- ── Instagram · the secondary transition ────────────────────────────────────
insert into public.social_platform_guides (platform_key, name, emoji, min_age, first_seen_stage, blurb, settings, watch_fors, supervision, official_url, sort_order)
select 'instagram', 'Instagram', '📸', 13, 3,
  'Under 18s are placed in Teen Accounts by default, private with strict messaging. Good defaults, but not safe on their own, so walk them together.',
  $j$[
    {"name":"Keep the account private","how":"The Teen Account default. Leave it on."},
    {"name":"Messages from people they follow only","how":"The strictest messaging setting, so strangers cannot start a chat."},
    {"name":"Limit sensitive content","how":"Set the sensitive content control to the most limited state."},
    {"name":"Turn on Sleep mode","how":"Mutes notifications overnight, and set a daily time reminder."},
    {"name":"Turn on Hidden Words","how":"Filters offensive comments and message requests."},
    {"name":"Check the birthday is real","how":"Teen protections only apply if the age is set honestly, so verify it."}
  ]$j$::jsonb,
  $w$["Teens registering as an adult to escape the protections","Vanish mode and disappearing photos in messages","Social comparison and late night use, so lock Sleep mode"]$w$::jsonb,
  'Meta Family Center shows who they follow, time spent, and who they message, and under 16s cannot weaken key protections without a parent.',
  'https://familycenter.meta.com/our-products/instagram/', 40
where not exists (select 1 from public.social_platform_guides where platform_key = 'instagram');

-- ── TikTok · the secondary transition ───────────────────────────────────────
insert into public.social_platform_guides (platform_key, name, emoji, min_age, first_seen_stage, blurb, settings, watch_fors, supervision, official_url, sort_order)
select 'tiktok', 'TikTok', '🎵', 13, 3,
  'The For You feed personalises fast, so the settings that slow it down matter most. Family Pairing lets you set them from your own phone.',
  $j$[
    {"name":"Link Family Pairing","how":"Connect your account to theirs to set the controls below remotely."},
    {"name":"Set daily screen time","how":"Separate weekday and weekend caps, plus screen time breaks."},
    {"name":"Lock Restricted Mode","how":"Filters mature content. Set through Family Pairing so it cannot be turned off."},
    {"name":"Direct messages","how":"Off entirely for under 16s already. For 16 to 17, set to friends only or no one."},
    {"name":"Private account and restrict duet and stitch","how":"Set who can view, comment, duet and stitch to friends or no one."}
  ]$j$::jsonb,
  $w$["How fast the For You feed narrows to one kind of content","LIVE and gifting, which Restricted Mode turns off","Attempts to age up past the under 16 message block"]$w$::jsonb,
  'Family Pairing links your account to your teen account so you can set and lock these controls.',
  'https://www.tiktok.com/safety/', 50
where not exists (select 1 from public.social_platform_guides where platform_key = 'tiktok');

-- ── Snapchat · the secondary transition ─────────────────────────────────────
insert into public.social_platform_guides (platform_key, name, emoji, min_age, first_seen_stage, blurb, settings, watch_fors, supervision, official_url, sort_order)
select 'snapchat', 'Snapchat', '👻', 13, 3,
  'Disappearing messages and a live location map make this one distinct. One toggle, Ghost Mode, does the most protecting of all.',
  $j$[
    {"name":"Turn Snap Map to Ghost Mode","how":"Snap Map, gear, Ghost Mode on, so location is hidden from everyone."},
    {"name":"Contact Me set to My Friends","how":"Privacy Controls, so strangers cannot send snaps or messages."},
    {"name":"Story to Friends Only","how":"Set who can view my story to friends or a custom list."},
    {"name":"Turn Quick Add off","how":"Stops the app suggesting your child to strangers as a friend."},
    {"name":"Know about My Eyes Only","how":"A passcode protected hidden folder. Family Center cannot see inside it, so talk about it openly."}
  ]$j$::jsonb,
  $w$["Location exposure on Snap Map, Ghost Mode is the single most important toggle","Disappearing content and the hidden My Eyes Only folder","Stranger contact through Quick Add"]$w$::jsonb,
  'Family Center shows who they are friends with and have messaged in the last 7 days, and lets you request their Snap Map location.',
  'https://parents.snapchat.com/', 60
where not exists (select 1 from public.social_platform_guides where platform_key = 'snapchat');

-- ── Facebook and Messenger · a little later ─────────────────────────────────
insert into public.social_platform_guides (platform_key, name, emoji, min_age, first_seen_stage, blurb, settings, watch_fors, supervision, official_url, sort_order)
select 'facebook', 'Facebook and Messenger', '👍', 13, 4,
  'Lower priority for most UK children now, but Messenger reaches them earlier through family. Messenger Kids is the parent controlled option for 6 to 12s.',
  $j$[
    {"name":"Keep Teen Account defaults","how":"Only friends and people with their number can send message requests, and adults cannot start chats with unconnected teens."},
    {"name":"Limit who can message","how":"Privacy, Inbox, set to friends or friends of friends."},
    {"name":"Friend requests from friends of friends","how":"Restrict who can send a friend request."},
    {"name":"Posts and story to Friends","how":"Set who can see your posts and future posts to friends, and lock past posts."},
    {"name":"Turn location off in Messenger","how":"Stop location being shared in chats."}
  ]$j$::jsonb,
  $w$["Message and friend requests from unknown adults","Older public posts still visible, so lock them down","Marketplace and Groups exposure"]$w$::jsonb,
  'Meta Family Center covers Facebook and Messenger for time, contacts and message oversight.',
  'https://familycenter.meta.com/our-products/facebook-messenger/', 70
where not exists (select 1 from public.social_platform_guides where platform_key = 'facebook');

-- ── Discord · a little later, gaming and community ──────────────────────────
insert into public.social_platform_guides (platform_key, name, emoji, min_age, first_seen_stage, blurb, settings, watch_fors, supervision, official_url, sort_order)
select 'discord', 'Discord', '🎮', 13, 4,
  'Open community chat with voice, direct messages and age gated spaces, often gaming driven. Better suited to older teens, with the safety settings on.',
  $j$[
    {"name":"Filter all direct messages","how":"Set the content filter to scan and filter explicit images from everyone."},
    {"name":"Route non friend messages","how":"Send message requests from non friends to a separate inbox."},
    {"name":"Limit friend requests","how":"Set who can send a friend request to friends of friends or server members only."},
    {"name":"Turn off server member DMs","how":"Disable allow direct messages from server members on each server."},
    {"name":"Confirm the teen safety defaults are on","how":"The global teen defaults rolling out in 2026, and keep age gated spaces blocked."}
  ]$j$::jsonb,
  $w$["Stranger direct messages and grooming risk in public servers","Voice channels, which are not monitored","Age gated adult spaces"]$w$::jsonb,
  'Family Center shows servers joined, friends added and call minutes, but not message or voice content.',
  'https://support.discord.com/hc/en-us/articles/14155060633623-Family-Center-for-Teens', 80
where not exists (select 1 from public.social_platform_guides where platform_key = 'discord');
