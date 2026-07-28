-- Guided Childhood — Migration 118
-- The home broadband guide, which was missing entirely.
--
-- The Devices page has a "DiGi can walk me through it" button for home
-- broadband and WiFi. It could never work: there are 24 device guides and not
-- one of them is a router, so DiGi was asked to walk a parent through a guide
-- that did not exist. With nothing to ground it, it answered from whatever was
-- last in the conversation, which is how a parent asking about their WiFi got
-- told about TikTok again. The Fire tablet button worked for the same reason in
-- reverse: firetablet is a real row.
--
-- It belongs first rather than somewhere in the list. Router level filtering is
-- the only layer that covers every screen in the house at once, including the
-- ones with no controls of their own (a visitor's phone, an old smart TV, a
-- console signed into someone else's account), and it is the one setup that
-- protects a device you have not thought of yet.
--
-- min_age 4 so it never trips the ahead of age warning on the passport. A
-- router is not a thing a child owns too early, it is the house.
--
-- Supabase editor rules: idempotent creates, no DO blocks, flat statements.

insert into public.device_guides (device_key, name, category, emoji, min_age, subtitle, why, steps, note, sort_order) values

('broadband', 'Home Broadband and WiFi', 'Home Broadband', '📶', 4,
 'Your internet provider''s own filter, free and already included',
 'This is the only control that covers every screen in the house at once, including the ones you cannot set up individually. Every major UK provider gives it away free and most families never switch it on. It takes about ten minutes and it is the single widest piece of cover you can get.',
 '["**Find your provider''s filter and turn it on.** BT Parental Controls, Sky Broadband Shield, Virgin Media Web Safe, TalkTalk HomeSafe, Plusnet SafeGuard, Vodafone Secure Net, EE Content Lock. All free, all in your account settings on the provider''s website rather than on the router itself.", "**Choose the filter level that matches your youngest child,** not your oldest. Everyone on the WiFi gets the same filter, so it has to suit the one who needs the most cover.", "**Set the watershed timer if your provider has one.** BT and Sky both let the filter relax after a set hour and tighten again in the morning, so an adult household is not filtered at midnight.", "**Change the router admin password** from the one printed on the sticker. An older child who can reach the router settings can turn the whole thing off in a minute, and the default password is usually on the box.", "**Test it before you trust it.** Try to reach something that should be blocked, on a device connected to the WiFi. A filter you have not tested is a filter you are only assuming."]',
 'The gap worth knowing: this covers WiFi only. The moment a phone leaves the house and drops to mobile data, none of it applies, so a child with their own data plan needs the mobile network''s filter turned on separately. Ask your provider for their content lock. It does not cover a VPN either, which is worth a conversation rather than a lockdown once they are old enough to find one.', 5)

on conflict (device_key) do update set
  name = excluded.name,
  category = excluded.category,
  emoji = excluded.emoji,
  min_age = excluded.min_age,
  subtitle = excluded.subtitle,
  why = excluded.why,
  steps = excluded.steps,
  note = excluded.note,
  sort_order = excluded.sort_order;
