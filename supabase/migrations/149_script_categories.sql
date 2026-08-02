-- Guided Childhood — Migration 149
--
-- One vocabulary for the script library, so it can be browsed.
--
-- Justin: "scripts all good now and loads there, is there a better way of
-- showing so many? Could we have tabs on the page for each category rather
-- than fill the whole page?"
--
-- Right instinct, and the blocker was never the UI. The library had FOURTEEN
-- category values plus twelve with none, and the page's own CATEGORY_META knew
-- a different eight, overlapping on three. Chips built on that would have come
-- up mostly blank.
--
-- Live counts before this migration, 233 scripts:
--
--   daily-moments 59   social-media 26   screen-time 21   gaming 18
--   online-safety 15   family-rules 10   mental-health 10  identity 10
--   cyberbullying 10   ai-technology 10  first-device 8    school 8
--   body-image 8       relationships 8   (none) 12
--
-- WHY EIGHT AND NOT THE SEVEN JUSTIN APPROVED. Filing the 59 daily-moments by
-- hand is what turned this up, and it is worth stating plainly rather than
-- burying in a mapping table.
--
-- Roughly half of them are not about screens at all. The Teeth Brushing
-- Standoff. Getting Dressed is a War. Lunch Not Packed. Clothes Not in the
-- Washing Bag. Choosing Dinner is a Crisis. Older Sibling Being Unkind. They
-- Were Rude to You Today. A Good Day Worth Noticing.
--
-- Twenty four scripts of ordinary family life with no device in them. Every
-- one of the seven approved chips is a digital topic, so filing those under
-- "Screen time" would have been simply false, and a parent tapping Screen time
-- and finding teeth brushing learns not to trust the filter. So there is an
-- eighth, "Everyday routines", and it is the only place those can honestly go.
--
-- The other 35 daily-moments genuinely are digital and are filed across the
-- seven by what they are actually about, one at a time, by title.
--
-- WHY BY TITLE RATHER THAN BY A RULE. There is no keyword that separates "The
-- Morning TV Standoff" (screen time) from "Evening TV Will Not Turn Off"
-- (screen time) from "TV Shows That Are Too Old" (staying safe). All three say
-- TV. A pattern match would have put the third in the wrong place, and the
-- third is the one about a child seeing something they should not.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

-- ── 1. The fourteen collapse to eight ─────────────────────────────────────
-- Straight renames first. Safe to run twice: the second run matches nothing.

update public.scripts set category = 'staying-safe'      where category in ('online-safety', 'cyberbullying');
update public.scripts set category = 'mood-confidence'   where category in ('mental-health', 'body-image', 'identity');
update public.scripts set category = 'family-rules'      where category in ('relationships', 'first-device');
update public.scripts set category = 'school-and-ai'     where category in ('school', 'ai-technology');
-- screen-time, social-media and gaming keep their names and need no statement.

-- ── 2. The 59 daily moments, filed one at a time ──────────────────────────
-- Scoped to category = 'daily-moments' so a title that also exists elsewhere
-- in the library is never caught by accident.

update public.scripts set category = 'screen-time' where category = 'daily-moments' and title in (
  'The Morning TV Standoff',
  'When Screen Time Ends in Tears',
  'The After School Device Rush',
  'Saturday Morning Screen Spiral',
  'The Dinner Table Check',
  'The Before School Phone Argument',
  'The Just Five More Minutes Loop',
  'The Car Journey Phone Bubble',
  'When You Notice the Light Under the Door at Midnight',
  'The 2am Discovery',
  'When They Say Everything Is Boring Without a Screen',
  'Evening TV Will Not Turn Off',
  'Screen Time Before School Has Happened Again'
);

update public.scripts set category = 'mood-confidence' where category = 'daily-moments' and title in (
  'When They Come Home and Go Straight to Their Room',
  'Sunday Night and the Device Spiral',
  'When They Come Downstairs in a Dark Mood',
  'The Weekend Disappearing Act',
  'When They Stop Talking to You and Talk to Their Phone',
  'When They Use Their Phone to Avoid an Awkward Situation'
);

update public.scripts set category = 'staying-safe' where category = 'daily-moments' and title in (
  'When Group Chat Drama Comes Home',
  'Finding Something Upsetting on Their Device',
  'When You Discover They Have Been Messaging Someone Unknown',
  'When They See Something Violent or Disturbing Online',
  'TV Shows That Are Too Old'
);

update public.scripts set category = 'gaming' where category = 'daily-moments' and title in (
  'Gaming Rage',
  'When They Haven''t Eaten Because They Were Gaming'
);

update public.scripts set category = 'family-rules' where category = 'daily-moments' and title in (
  'Everyone Else Has It',
  'When the Phone Breaks or Gets Lost',
  'When Your Rules Are Different From Their Friends'' Parents',
  'Sibling Fights Over One Device'
);

update public.scripts set category = 'school-and-ai' where category = 'daily-moments' and title in (
  'The Homework versus Screens Standoff',
  'The Homework Panic Spiral',
  'Homework Every Night is a Battle',
  'The Forgotten Homework Discovery'
);

update public.scripts set category = 'social-media' where category = 'daily-moments' and title in (
  'The Instagram Comparison Crash'
);

-- Everything still sitting in daily-moments is family life without a device in
-- it. Written as the catch all deliberately: a new daily moment added later
-- lands here rather than nowhere, and here is the honest default for one.
update public.scripts set category = 'everyday-routines' where category = 'daily-moments';

-- ── 3. What is left ───────────────────────────────────────────────────────
-- Twelve scripts have no category at all and cannot be filed from here without
-- reading them. They are not guessed at. Until somebody files them they simply
-- do not appear under a chip, which is the honest failure: missing from a
-- filter rather than wrong inside one.
--
-- To see them:
--   select sort_order, stage_id, title, situation
--   from public.scripts where category is null order by sort_order;

-- ── 4. Check ──────────────────────────────────────────────────────────────
-- Expect eight rows plus (none), and no daily-moments:
--   select coalesce(category,'(none)') c, count(*) from public.scripts
--   group by 1 order by 2 desc;
