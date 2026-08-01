-- Guided Childhood — Migration 145
--
-- Sources you can click, and a researcher's name spelled correctly.
--
-- Justin: "this list of researchers, how does it actually grab their research?"
--
-- Answering that honestly turned up two things.
--
-- ONE. Forty two findings have no url at all. They came from migrations 019 and
-- 042, written before the url column was used, so the board says "64 sources"
-- and links the ones that have a link, which leads a reader to assume the rest
-- are equally checkable. They are not. If a head teacher asked where a line
-- came from, the honest answer today is that we paraphrased it and did not
-- record from where.
--
-- TWO, and worse. WE HAVE BEEN SPELLING HER NAME WRONG. It is Candice Odgers,
-- not Candace. Wrong in the bank, wrong in DiGi's brain file, wrong in the
-- research agent's own prompt, and wrong on the public /join page, on a line
-- that reads "we can defend every name". A misspelled academic is the smallest
-- possible error and exactly the one a sceptic uses, because it says we never
-- checked.
--
-- WHY THESE URLS ARE PROFILES RATHER THAN PAPERS, and it is not laziness:
--
--   Most of these findings characterise a researcher's POSITION, not one study.
--   "Effects depend on the child's vulnerability and environment" is the shape
--   of Odgers' argument across years of work. Hanging that on a single paper
--   would be a false precision, and a reader who followed the link and could not
--   find that exact sentence would be right to feel misled. The institutional
--   profile is the honest destination for a position. A paper url belongs only
--   where the finding is about that paper, which is how 139 was written.
--
-- Every url below was verified by search rather than recalled, because a url is
-- a specific, and specifics are the thing not to trust to memory. This is the
-- first batch. Twenty six sources still have none and are listed at the bottom
-- so the next pass has a work list rather than starting again.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

-- The name. Both rows, and safe to run twice.
update public.expert_knowledge
set source_name = 'Prof Candice Odgers'
where source_name = 'Prof Candace Odgers';

-- Verified profile and organisation pages, first batch.
update public.expert_knowledge set url = 'https://experts.communications.uci.edu/profile.php?e=candice.odgers'
where source_name = 'Prof Candice Odgers' and url is null;

update public.expert_knowledge set url = 'https://www.mrc-cbu.cam.ac.uk/people/amy.orben/'
where source_name = 'Dr Amy Orben' and url is null;

update public.expert_knowledge set url = 'https://www.lse.ac.uk/people/sonia-livingstone'
where source_name = 'Prof Sonia Livingstone' and url is null;

update public.expert_knowledge set url = 'https://www.oii.ox.ac.uk/people/profiles/andrew-przybylski/'
where source_name = 'Prof Andrew Przybylski' and url is null;

update public.expert_knowledge set url = 'https://www.catherineknibbs.co.uk/'
where source_name = 'Catherine Knibbs' and url is null;

update public.expert_knowledge set url = 'https://www.ofcom.org.uk/media-use-and-attitudes/media-habits-children/childrens'
where source_name = 'Ofcom media use research' and url is null;

update public.expert_knowledge set url = 'https://www.samaritans.org/about-samaritans/media-guidelines/'
where source_name = 'Samaritans media guidance' and url is null;

-- STILL WITHOUT A SOURCE, for the next pass. Left here deliberately rather than
-- in a ticket, because the list belongs next to the thing it describes:
--   Dr Becky Kennedy, Sue Atkins, Dr Lisa Damour, danah boyd, Roskam and
--   Mikolajczak, Prof Sander van der Linden, Prof Matthew Walker, Prof Jean
--   Twenge, Prof Christopher Ferguson, Prof Charles Czeisler, Dr Jacqueline
--   Nesi, Dr Tanya Byron, Dr Dan Siegel, Dr Dan Hughes, Dr Anna Lembke,
--   Devorah Heitner, CHADD and ADHD research, NHS and RCPCH guidance, World
--   Health Organization, UK crisis signposting, Royal College of Psychiatrists,
--   NSPCC and CEOP, NICE guidance, MindEd and NHS guidance, Internet Matters
--   and UKCIS, Beat eating disorders.
