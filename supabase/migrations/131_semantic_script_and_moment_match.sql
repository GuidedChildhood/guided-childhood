-- DiGi finds the right script by meaning, not by shared words.
--
-- The matcher scored a script by counting how many words over three letters
-- from the parent's message appeared literally in its title, situation or
-- category, and needed two before it would offer anything at all.
--
-- A real message: "teo is crying when swith is tunred off". After the stop list
-- that leaves crying, swith and tunred. Two are typos matching nothing and the
-- child's name is too short to count, so the score was one, under the
-- threshold, and DiGi was handed no scripts whatsoever. It talked in general
-- and linked the index page, while the library held "Will not come off the
-- game", which is exactly the moment the parent was describing and shares not
-- one word with how they described it.
--
-- Keyword overlap cannot connect those two sentences. Meaning can, and the
-- embedding infrastructure for it already runs in production for DiGi's memory,
-- so scripts and moments now carry the same 1024 dimension vectors and are
-- searched the same way.

alter table public.scripts add column if not exists embedding vector(1024);
alter table public.daily_moments add column if not exists embedding vector(1024);

-- 233 scripts is a small enough library that an exact scan beats an approximate
-- index on both accuracy and simplicity. No ivfflat here: it would need tuning
-- and a rebuild as the library grows, to save a few milliseconds on a query
-- that already runs inside a model call taking seconds.
comment on column public.scripts.embedding is
  'Meaning vector of title, situation and category. Null until backfilled; the keyword matcher covers nulls.';
comment on column public.daily_moments.embedding is
  'Meaning vector of the moment. Null until backfilled.';

-- Scripts a parent asked for by meaning, ranked.
--
-- Returns the distance so the caller can apply its own floor: a nearest match
-- is always a nearest match, even when nothing in the library is close, and
-- offering the least bad script to a parent in a hard moment is worse than
-- admitting we do not have one yet.
create or replace function match_scripts(
  query_embedding vector(1024),
  match_count int default 3
)
returns table (
  sort_order int,
  title text,
  situation text,
  category text,
  similarity float
)
language sql
stable
security definer
set search_path = public
as $$
  select s.sort_order, s.title, s.situation, s.category,
         1 - (s.embedding <=> query_embedding) as similarity
  from scripts s
  where s.embedding is not null
  order by s.embedding <=> query_embedding
  limit match_count;
$$;

create or replace function match_moments(
  query_embedding vector(1024),
  match_count int default 2
)
returns table (
  id uuid,
  title text,
  similarity float
)
language sql
stable
security definer
set search_path = public
as $$
  select m.id, m.title,
         1 - (m.embedding <=> query_embedding) as similarity
  from daily_moments m
  where m.embedding is not null
  order by m.embedding <=> query_embedding
  limit match_count;
$$;

-- What parents asked for that we had nothing close to.
--
-- script_requests already existed for the manual "request a script" form. The
-- same table now also receives the asks DiGi could not answer from the library,
-- which is the more honest source: it is what parents actually said in the
-- moment, not what they thought to fill in on a form afterwards.
alter table public.script_requests add column if not exists source text default 'form';
alter table public.script_requests add column if not exists best_similarity real;

comment on column public.script_requests.source is
  'form for the manual request, digi for a gap DiGi found while answering.';
comment on column public.script_requests.best_similarity is
  'How close the nearest script was. Low numbers repeated across parents are the strongest signal for what to write next.';
