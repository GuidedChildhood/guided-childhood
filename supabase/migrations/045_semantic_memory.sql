-- Guided Childhood — Migration 045
-- Semantic memory: DiGi finds a family memory by MEANING, not just matching
-- words. "He will not get off Fortnite" now surfaces the old note about
-- gaming after school going over time, even though they share no words.
-- Run AFTER: create extension if not exists vector;
--
-- The embedding column stores a 1024 dimension vector for each memory
-- (Voyage or OpenAI, both asked for 1024 so the column fits either).
-- match_digi_memory is the search: locked to the calling user via auth.uid(),
-- so RLS discipline holds and no query can read another family's memories.

alter table public.digi_memory add column if not exists embedding vector(1024);

create index if not exists idx_digi_memory_embedding
  on public.digi_memory using hnsw (embedding vector_cosine_ops);

create or replace function public.match_digi_memory(
  query_embedding vector(1024),
  match_count int default 20
)
returns table (kind text, content text, created_at timestamptz, similarity float)
language sql stable
as $$
  select m.kind, m.content, m.created_at,
         1 - (m.embedding <=> query_embedding) as similarity
  from public.digi_memory m
  where m.user_id = auth.uid()
    and m.active = true
    and m.embedding is not null
  order by m.embedding <=> query_embedding
  limit match_count;
$$;
