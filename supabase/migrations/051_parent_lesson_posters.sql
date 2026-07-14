-- 051 parent lesson posters
-- Adds the poster image for each watch together lesson, used by the parent
-- front page thumbnail grid. Posters live on the CDN, one 16:9 JPG per
-- lesson. Idempotent: the column add is guarded, the updates set by code.

alter table public.parent_lessons add column if not exists poster_url text;

update public.parent_lessons set poster_url = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/de76c1d6-dfd9-42d7-9f00-d76bb45e7abd.jpg' where lesson_code = '1.1';
update public.parent_lessons set poster_url = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/a505f02c-9732-4225-a721-fe0be1be70a6.jpg' where lesson_code = '1.2';
update public.parent_lessons set poster_url = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/10539ba7-6243-48b9-a53c-4f022201cbe0.jpg' where lesson_code = '1.3';
update public.parent_lessons set poster_url = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/af3172f2-5692-4e19-bd56-a8f0afd21e61.jpg' where lesson_code = '1.4';
update public.parent_lessons set poster_url = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/fd50c2bc-2c8f-4850-a810-2a387af96b94.jpg' where lesson_code = '1.5';
update public.parent_lessons set poster_url = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/323c749a-530e-4253-a060-1fa390bd07ef.jpg' where lesson_code = '1.6';
update public.parent_lessons set poster_url = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/fae3a1cb-1a15-4f3d-9278-8d28b874af90.jpg' where lesson_code = '1.7';
update public.parent_lessons set poster_url = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/8fa060a9-0452-4fe7-a339-22f9d28f1416.jpg' where lesson_code = '1.8';
update public.parent_lessons set poster_url = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/deddf23d-5093-40fd-ab72-7acf16e78547.jpg' where lesson_code = '1.9';
update public.parent_lessons set poster_url = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/7d457069-e6f8-484d-925d-d26fe3f96213.jpg' where lesson_code = '1.10';
