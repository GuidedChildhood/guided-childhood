-- The four character videos rendered on 1 July were only ever wired into
-- the parent exemplar lesson (migration 017). This puts each clip into
-- its matching module deck as a video slide right after the opener, so
-- Star Lessons and the schools player finally show the videos. Guarded:
-- a deck that already carries a video slide is left alone.

update public.school_lessons
set slides = jsonb_insert(slides, '{1}', '{"type":"video","src":"https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_205017_2052451b-a1d7-4932-9839-fd875b134903.mp4","caption":"DiGi explains how the algorithm works","phase":"starter","minutes":1,"script":"Play the clip once through. Then ask: what is the app really watching?"}'::jsonb)
where module_id = 'ks2-06-how-algorithms-work'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'video');

update public.school_lessons
set slides = jsonb_insert(slides, '{1}', '{"type":"video","src":"https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210302_73a1ddee-7a31-429c-b382-339dd740fdc9.mp4","caption":"Oliver on being the boss of your screen","phase":"starter","minutes":1,"script":"Play the clip once through. Then ask: who decides when screen time ends in your house?"}'::jsonb)
where module_id = 'ks2-04-screen-routines'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'video');

update public.school_lessons
set slides = jsonb_insert(slides, '{1}', '{"type":"video","src":"https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210314_08e5094c-a1ad-42bc-aed4-ca3f2df62cde.mp4","caption":"Sofia asks: real or fake?","phase":"starter","minutes":1,"script":"Play the clip once through. Then ask: how could we check?"}'::jsonb)
where module_id = 'ks1-03-real-pretend-computer'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'video');

update public.school_lessons
set slides = jsonb_insert(slides, '{1}', '{"type":"video","src":"https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260701_210333_95e07492-9204-4682-99e3-fdbfb8effd35.mp4","caption":"Build your privacy shield","phase":"starter","minutes":1,"script":"Play the clip once through. Then ask: what belongs behind your shield?"}'::jsonb)
where module_id = 'ks2-07-privacy-reputation'
  and slides is not null
  and not exists (select 1 from jsonb_array_elements(slides) s where s->>'type' = 'video');
