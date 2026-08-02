-- Guided Childhood — Migration 152
--
-- The twelve scripts migration 151 could not see.
--
-- 151 consolidated fourteen category values down to eight so the library could
-- be browsed by tab. It ran cleanly and the eight are live. What it never
-- touched was the twelve rows whose category was NULL or empty: every statement
-- in it reads "where category in (...)" or "where category = 'daily-moments'",
-- and NULL matches none of those. So twelve scripts came out of the tidy up
-- exactly as they went in, with no category at all.
--
-- That is invisible until the tabs ship, and then it is a hole: twelve real
-- scripts, several of them the hardest ones we have written (intimate images
-- and the law, gambling apps, doomscrolling), reachable by search and by stage
-- but absent from every category a parent can click. A parent browsing
-- staying-safe would not find the image sharing card.
--
-- Keyed on id rather than title. Titles are copy and copy gets edited; 151
-- matched on long title strings and any one of them being reworded would have
-- silently skipped that row. An id cannot drift.
--
-- The three close calls, recorded because the next person will wonder:
--
--   Gambling and betting apps        could be gaming. It is staying-safe: the
--                                    card is about designed manipulation and
--                                    harm, not about a hobby.
--   Renegotiating the phone-free bedroom
--                                    could be screen-time. It is family-rules:
--                                    the card is about renegotiating a rule,
--                                    and the bedroom is the example.
--   Sleep and study balance          could be school-and-ai. It is screen-time:
--                                    the situation names late nights on screens
--                                    as the cause and study as the casualty.
--
-- After this, 233 scripts across 8 categories and none left over.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements. Re-running
-- is a no op because every row already holds its new value.

update public.scripts set category = 'screen-time'     where id = 'ded831b8-927e-4688-92fe-43cc6c8645c3'; -- Devices and sleep
update public.scripts set category = 'mood-confidence' where id = 'e7764a9e-d7c9-4f48-bfbc-812e66ea53c2'; -- Early body image messages from media
update public.scripts set category = 'screen-time'     where id = '9a671e61-4615-469f-bfd2-f4fecc5b391d'; -- Learning versus entertainment
update public.scripts set category = 'gaming'          where id = 'a979b76f-5385-4311-a749-432617fa4545'; -- The game their friends play
update public.scripts set category = 'staying-safe'    where id = '4083e4af-aa73-465b-8779-d77c051214ab'; -- A mature conversation about image sharing and the law
update public.scripts set category = 'staying-safe'    where id = 'e2702acc-9aa8-453b-9a0e-71ba215d1eb5'; -- Gambling and betting apps
update public.scripts set category = 'mood-confidence' where id = '278d5c39-84ce-48ca-b67f-102d543625bf'; -- Knowing when and how to seek help
update public.scripts set category = 'screen-time'     where id = 'd2229dca-e667-46b4-8471-1d367c2ea736'; -- Sleep and study balance
update public.scripts set category = 'family-rules'    where id = 'f20e18c6-b69b-42b1-abec-5d59cb6ccc89'; -- The lifelong, ongoing nature of this conversation
update public.scripts set category = 'mood-confidence' where id = '55b8f19b-4339-4fe4-87a0-315b5a0b144e'; -- World event anxiety and doomscrolling
update public.scripts set category = 'family-rules'    where id = '5048e112-92c3-449a-89ea-b8f066ed08df'; -- Renegotiating the phone-free bedroom
update public.scripts set category = 'school-and-ai'   where id = 'f1a75d11-aeeb-4bc9-b865-6fc554b36868'; -- Spotting misinformation and manipulation

-- The safety net 151 lacked. Any script added later with no category, or any of
-- the twelve above whose id has changed since this was written, lands in
-- everyday-routines rather than nowhere. A slightly wrong tab is recoverable;
-- being in no tab at all is not, because nobody goes looking for what is
-- missing.
update public.scripts set category = 'everyday-routines'
  where coalesce(trim(category), '') = '';
