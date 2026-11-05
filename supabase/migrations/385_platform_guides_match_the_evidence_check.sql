-- 385: the per platform settings guides say what each company's own page says.
--
-- The Road to 16 printable (PR 1403) was red teamed on 5 November 2026 against
-- each platform's terms and help pages and against UKCIS. The guide was
-- corrected, and the check found the same stale lines in the app's own rows
-- from migration 093 (its section 5, "Product follow ups"). This brings the
-- rows into line. 093 is never edited, so a fresh database runs 093 then this.
--
--   Roblox    min_age 13 becomes 5. The UK, EEA and Switzerland terms
--             (effective 1 November 2026): "Users ages 5 and older may have
--             an Account, but certain features ... must be enabled by a
--             parent". Chat needs an age check (Roblox newsroom, 7 January
--             2026). The settings page words an age under 13 as "with a
--             parent", so a 5 never reads as a go ahead.
--   YouTube   Restricted Mode can be locked through Family Link only for a
--             child "not eligible for a supervised experience" (YouTube Help
--             174084). A supervised child gets a content setting instead
--             (YouTube Help 10314074). The Shorts timer at zero was "soon" on
--             14 January 2026, so the row no longer says turn the feed off,
--             and "the hardest to put down" had no source.
--   Facebook  Meta's supervision shows time and contacts: "These tools do not
--             allow parents to read their teen's messages" (Meta newsroom,
--             27 June 2023, with updates). "Message oversight" is gone.
--   WhatsApp  Parent managed accounts for under 13s were announced on
--             11 March 2026, rolling out gradually. The UK terms say "if it
--             is available in your country", and UK availability is not
--             confirmed, so the row says so.
--   Snapchat  Teens are not suggested in Quick Add "unless they have multiple
--             mutual connections" (Snap, 25 June 2024, updated 23 August
--             2024). Quick Add off stops suggestions to friends of friends,
--             not to strangers.
--
-- Every update is guarded on the old value, so it runs once, is a no op on a
-- second run, and leaves alone any row a later edit has already moved on.
-- Supabase editor rules: flat statements, no DO blocks, no semicolons inside
-- string literals. No dashes in any copy.

set lock_timeout = '3s';

-- ── Roblox · accounts from 5 with a parent ──────────────────────────────────
update public.social_platform_guides
   set min_age = 5
 where platform_key = 'roblox' and min_age = 13;

-- ── YouTube · the content setting, not a lock most children cannot have ─────
update public.social_platform_guides
   set settings = jsonb_set(settings, '{1}',
       '{"name":"Choose the content setting for their age","how":"Set it up through Google Family Link and choose the content setting that fits their age. Family Link can lock Restricted Mode only for some children, so use the setting it offers yours."}'::jsonb)
 where platform_key = 'youtube' and settings->1->>'name' = 'Lock Restricted Mode';

update public.social_platform_guides
   set settings = jsonb_set(settings, '{2}',
       '{"name":"Cap the Shorts feed","how":"On supervised accounts, set a daily time limit on the Shorts feed."}'::jsonb)
 where platform_key = 'youtube' and settings->2->>'how' = 'On supervised accounts, set a daily Shorts time limit, or turn the Shorts feed off. It is the strongest pull.';

update public.social_platform_guides
   set watch_fors = jsonb_set(watch_fors, '{0}', to_jsonb('The Shorts feed scrolls on with no natural end, so set its limit first'::text))
 where platform_key = 'youtube' and watch_fors->>0 = 'The Shorts feed is the hardest to put down, cap it first';

update public.social_platform_guides
   set watch_fors = jsonb_set(watch_fors, '{2}', to_jsonb('Age restricted content can still slip through on any setting, so watch together at first'::text))
 where platform_key = 'youtube' and watch_fors->>2 = 'Age restricted content still slips through if Restricted Mode is only toggled, not locked';

-- ── Facebook and Messenger · time and contacts, never the messages ─────────
update public.social_platform_guides
   set supervision = 'Meta Family Center covers Facebook and Messenger for time spent and who they are in touch with. It does not let a parent read their messages.'
 where platform_key = 'facebook' and supervision = 'Meta Family Center covers Facebook and Messenger for time, contacts and message oversight.';

-- ── WhatsApp · parent managed accounts, maybe not in the UK yet ─────────────
update public.social_platform_guides
   set blurb = 'Usually arrives with the class and club group chats at secondary. A standard account has no parental dashboard, so this one is managed with settings and conversation.'
 where platform_key = 'whatsapp' and blurb = 'Usually arrives with the class and club group chats at secondary. There is no parental dashboard, so this one is managed with settings and conversation.';

update public.social_platform_guides
   set supervision = 'A standard account has no parental dashboard, so manage it at the phone level with Screen Time or Family Link. WhatsApp is rolling out parent managed accounts for under 13s, which may not have reached the UK yet.'
 where platform_key = 'whatsapp' and supervision = 'None. WhatsApp has no parental dashboard, so manage it at the phone level with Screen Time or Family Link.';

-- ── Snapchat · Quick Add reaches friends of friends ─────────────────────────
update public.social_platform_guides
   set settings = jsonb_set(settings, '{3}',
       '{"name":"Turn Quick Add off","how":"Stops the app suggesting your child as a friend to friends of friends they have never met."}'::jsonb)
 where platform_key = 'snapchat' and settings->3->>'how' = 'Stops the app suggesting your child to strangers as a friend.';

update public.social_platform_guides
   set watch_fors = jsonb_set(watch_fors, '{2}', to_jsonb('Quick Add suggesting them to friends of friends they have never met'::text))
 where platform_key = 'snapchat' and watch_fors->>2 = 'Stranger contact through Quick Add';
