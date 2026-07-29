-- Guided Childhood — Migration 118
-- Deepen the existing home broadband guide. Does NOT create a new one.
--
-- This file originally inserted a guide under the key 'broadband', on the
-- belief that no router guide existed. That was wrong, and the mistake is worth
-- recording: the check was made against migration 014, which seeds 24 devices
-- and has no router among them. The router guide arrived later, in 077, under
-- the key home_broadband. Reading the first seed file and concluding the
-- catalogue held nothing is the same error as reading one branch of an if and
-- concluding what the function does.
--
-- Had it shipped as written, the app would have carried two competing home
-- broadband guides under two keys, and whichever the button happened to name
-- would have been the one a parent saw. Nothing would have looked broken.
--
-- The real bug was never a missing guide. The Devices button asked DiGi to walk
-- the parent through home broadband without naming which guide, so the route
-- loaded none and DiGi answered from whatever was last in the conversation.
-- That fix is one word in DeviceCoverageBoard.
--
-- What is left worth doing is the content. Justin asked for the device guides
-- to be thorough and current, and this one was three steps that stopped before
-- the two that decide whether the filter actually holds: the router's own admin
-- password, which is printed on the box and lets an older child switch the lot
-- off in a minute, and testing it before trusting it.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

update public.device_guides set
  subtitle = 'Your provider''s own filter, free and already included',
  why = 'This is the only control that covers every screen in the house at once, including the ones you cannot set up individually: a visitor''s phone, an old smart TV, a console signed into someone else''s account. Every major UK provider gives it away free and most families never switch it on.',
  steps = '["**Find your provider''s filter and turn it on.** BT Parental Controls, Sky Broadband Shield, Virgin Media Web Safe, TalkTalk HomeSafe, Plusnet SafeGuard, Vodafone Secure Net, EE Content Lock. All free, all in your account on the provider''s website or app rather than on the router itself.", "**Choose the level that matches your youngest child, not your oldest.** Everyone on the wifi gets the same filter, so it has to suit the one who needs the most cover.", "**Set the watershed timer if your provider offers one.** BT and Sky both let the filter relax after a set hour and tighten again in the morning, so an adult household is not filtered at midnight.", "**Change the router admin password** from the one printed on the sticker. An older child who can reach the router settings can turn all of this off in a minute, and the default is usually on the box.", "**Test it before you trust it.** Try to reach something that should be blocked, on a device connected to the wifi. A filter you have not tested is a filter you are only assuming."]',
  note = 'The gap worth knowing: this covers wifi only. The moment a phone leaves the house and drops to mobile data none of it applies, so a child with their own data needs the mobile network''s filter turned on separately, which they will call a content lock. It does not cover a VPN either, which is worth a conversation rather than a lockdown once they are old enough to find one.'
where device_key = 'home_broadband';
