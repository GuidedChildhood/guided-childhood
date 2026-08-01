-- Guided Childhood — Migration 142
--
-- The research bank learns to be searched by MEANING, the way family memory
-- already is.
--
-- Justin: "how can we make it a learning agent."
--
-- This is the first half of that, and it is a correction before it is a feature.
-- Half of DiGi's brain understood what a parent meant and the other half was
-- doing string matching:
--
--   digi_memory has an embedding column, an hnsw index and match_digi_memory,
--   so "she has been quiet since the sleepover" finds a memory about friendship
--   trouble even though they share no words. That has worked since migration 45.
--
--   expert_knowledge had none of it. It was scored against a hand maintained
--   list of about seventy words, so a finding was reachable only if a parent
--   happened to type one of them. Lucy Foulkes goes in tagged mood, anxiety,
--   self_esteem and social_media. A parent writing "she keeps saying she thinks
--   she has ADHD because of a video" reaches none of those, and the single most
--   relevant finding in the bank sits there unread.
--
-- Adding research to a bank that cannot be searched properly is buying books for
-- a library with no catalogue, which is why this comes before any more sources.
--
-- Same 1024 dimensions as digi_memory, so one EMBEDDING_API_KEY covers both and
-- either provider (Voyage or OpenAI) fits the same column.
--
-- No auth.uid() filter in the match function, unlike match_digi_memory. That is
-- deliberate and correct here: expert_knowledge is already "select using (true)"
-- because it is a published research bank with nothing personal in it. There is
-- no family data to leak.
--
-- Run AFTER: create extension if not exists vector;  (already true in this
-- project since migration 45)
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

alter table public.expert_knowledge
  add column if not exists embedding vector(1024);

create index if not exists idx_expert_knowledge_embedding
  on public.expert_knowledge using hnsw (embedding vector_cosine_ops);

-- Age band filtering happens INSIDE the function rather than after it. Filtering
-- afterwards means the age filter eats most of an already short list and the
-- best on topic finding for the right age never makes the cut.
--
-- A row with no age bands at all is general guidance and always qualifies.
create or replace function public.match_expert_knowledge(
  query_embedding vector(1024),
  match_count int default 8,
  band text default null
)
returns table (
  source_name text,
  finding text,
  topics text[],
  age_bands text[],
  similarity float
)
language sql stable
as $$
  select k.source_name, k.finding, k.topics, k.age_bands,
         1 - (k.embedding <=> query_embedding) as similarity
  from public.expert_knowledge k
  where k.active = true
    and k.embedding is not null
    and (band is null or cardinality(k.age_bands) = 0 or band = any(k.age_bands))
  order by k.embedding <=> query_embedding
  limit match_count;
$$;

comment on column public.expert_knowledge.embedding is
  'Meaning vector of source_name plus finding, 1024 dimensions, written by embedMissingKnowledge. Null means not embedded yet, which is safe: retrieval falls back to the keyword scoring that has always worked.';
