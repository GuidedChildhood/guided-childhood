-- Guided Childhood — Migration 077
-- The safe online settings catalogue completed: the browser and everything
-- online, age appropriate, so the Safe online tick can honestly mean every
-- doorway is set, not only the devices. Idempotent by device_key.

set lock_timeout = '3s';

insert into public.device_guides (device_key, name, category, emoji, min_age, subtitle, why, steps, note, sort_order)
select * from (values
('google_safesearch', 'Google SafeSearch', 'Browsing and Search', '🔎', 4,
 'Filters explicit results out of every Google search',
 'Search is the widest open door in the house. SafeSearch closes the worst of it in one setting, on every device the account touches.',
 '["**Turn on SafeSearch.** google.com/preferences, tick Filter explicit results, Save.", "**Lock it with Family Link** for a child account, so it cannot be switched back off.", "**Check it on every browser** the child uses, it is per account and per browser."]'::jsonb,
 'SafeSearch is a filter, not a guarantee. The stop and tell rule still does the real work.', 200),
('youtube_restricted', 'YouTube and YouTube Kids', 'Browsing and Search', '📺', 4,
 'The right YouTube for the age, with Restricted Mode above it',
 'YouTube is where most children actually live online. The Kids app for under 9s, a supervised account 9 to 12, Restricted Mode beyond, each is one setting.',
 '["**Under 9: YouTube Kids only**, with the age band set inside the app.", "**9 to 12: a supervised account.** Family Link, then YouTube settings, choose Explore.", "**13 plus: turn on Restricted Mode** in YouTube settings on every device and browser."]'::jsonb,
 'Autoplay is the real opponent. Turning it off matters as much as the filter.', 210),
('browser_controls', 'The browser itself', 'Browsing and Search', '🌐', 8,
 'Chrome, Safari and Edge set to the child''s age',
 'Once a child browses beyond apps, the browser is the doorway. Each big browser has a family mode worth five minutes.',
 '["**Chrome: manage with Family Link**, block sites and turn on safe browsing for the child profile.", "**Safari on iPhone and iPad: Screen Time, Content and Privacy Restrictions, Web Content**, choose Limit Adult Websites or Allowed Websites Only for younger children.", "**Edge: Family Safety at family.microsoft.com**, web and search filters on."]'::jsonb,
 'A younger child does best with an allowed list, an older one with filters plus conversation.', 220),
('home_broadband', 'Home broadband filters', 'Browsing and Search', '📡', 4,
 'The whole house filter at the router',
 'Every UK provider ships free home filters, BT, Sky, Virgin, TalkTalk and the rest. One setting covers every device on the wifi, including visiting ones.',
 '["**Log into your provider''s app or account** and find Parental Controls or Web Safe.", "**Turn the family filter on** and pick the age level.", "**Set homework time if offered**, social and gaming paused at set hours for named devices."]'::jsonb,
 'The router filter does not travel with mobile data. The device settings above still matter out of the house.', 230),
('app_store_ratings', 'App store age ratings', 'Browsing and Search', '🛍️', 6,
 'Downloads gated to the age, with approval asks',
 'The store is where new doors get opened. Age gating plus ask to buy means every new app is a conversation, not a surprise.',
 '["**Apple: Screen Time, Content and Privacy Restrictions, Content Restrictions**, set the app age rating, and turn on Ask to Buy in Family Sharing.", "**Android: Family Link, Google Play settings**, set the rating and require approval for downloads.", "**Review the asks together**, the point is the chat before the download, not the block."]'::jsonb,
 'Say yes often to reasonable asks. The gate earns its trust by being fair.', 240),
('search_engines_kids', 'Child friendly search', 'Browsing and Search', '🧒', 4,
 'A search engine sized to a young child',
 'For the youngest browsers, a child first search engine like Swiggle or Kiddle sidesteps the whole problem while the habits are forming.',
 '["**Set the browser homepage** on the child''s profile to a child friendly search engine.", "**Show them how to search there first**, so asking the open web is the exception.", "**Retire it naturally** around 8 to 9 as the filtered grown up tools take over."]'::jsonb,
 'This is scaffolding, not a wall. It comes down as judgement grows.', 250)
) as v(device_key, name, category, emoji, min_age, subtitle, why, steps, note, sort_order)
where not exists (select 1 from public.device_guides g where g.device_key = v.device_key);
