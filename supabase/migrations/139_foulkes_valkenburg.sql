-- Guided Childhood — Migration 139
--
-- Two researchers into the brain, and they are the two that most support what
-- this product actually argues.
--
-- Justin listed ten researchers in a LinkedIn post about how DiGi is built.
-- Eight were genuinely in expert_knowledge. Lucy Foulkes and Patti Valkenburg
-- were not in the codebase at all, which would have made a public, checkable
-- claim false, in a post whose whole argument is that this one is the honest
-- one, and against DiGi's own rule that it never invents a source. So rather
-- than drop the names, the findings go in.
--
-- Both were checked against the published work rather than written from memory,
-- and both carry their url so the claim stays checkable by anyone.
--
-- WHY THESE TWO MATTER more than the other eight:
--
--   Foulkes is the academic case for "education, not alarm". The prevalence
--   inflation hypothesis is that awareness campaigns may themselves raise
--   reported rates, by teaching young people to notice, label and
--   over-interpret ordinary distress as disorder. It is the closest thing in
--   the literature to a peer reviewed defence of this platform's whole tone,
--   and it is the reason DiGi never leads with the most alarming finding.
--
--   Valkenburg is the empirical justification for working child by child. The
--   Beyens, Pouwels and Valkenburg experience sampling work found the effect of
--   social media on wellbeing is negative for about 28 percent of adolescents,
--   positive for about 26 percent, and negligible for roughly half. That single
--   finding is why a blanket rule is the wrong instrument and why the product
--   asks about THIS child.
--
-- Topics and age bands are chosen carefully rather than generously. They are
-- what lib/digi/brain.ts scores a parent's question against, so a finding tagged
-- with everything wins questions it has nothing to say about, and one tagged too
-- narrowly sits in the table and never surfaces.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url)
select 'researcher', 'Dr Lucy Foulkes',
  'Raising awareness of mental health has real benefits, but it may also carry a cost: campaigns that encourage young people to notice and label difficult feelings can lead some to interpret ordinary distress as a disorder, and more adolescents now self diagnose than in the past. The practical implication for a parent is to take a child seriously without rushing to a label. Name the feeling, stay curious about what is going on around it, and treat low mood after a hard week as a hard week until there is reason to think otherwise.',
  '{11-13,13-15,16+}', '{mood,anxiety,self_esteem,social_media}',
  'https://www.sciencedirect.com/science/article/pii/S0732118X2300003X'
where not exists (select 1 from public.expert_knowledge where source_name = 'Dr Lucy Foulkes');

insert into public.expert_knowledge (source_type, source_name, finding, age_bands, topics, url)
select 'researcher', 'Prof Patti Valkenburg',
  'Measured moment by moment rather than averaged across a population, social media affects adolescents very differently from one child to the next: for roughly a quarter the effect on wellbeing is negative, for roughly a quarter it is positive, and for about half it is negligible. The average tells you almost nothing about any individual child. So the useful question is never whether social media is good or bad, it is what it is doing to THIS child, which is answered by watching mood, sleep and friendships around their use rather than by counting hours.',
  '{11-13,13-15,16+}', '{social_media,mood,screen_time,friendships}',
  'https://www.nature.com/articles/s41598-020-67727-7'
where not exists (select 1 from public.expert_knowledge where source_name = 'Prof Patti Valkenburg');
