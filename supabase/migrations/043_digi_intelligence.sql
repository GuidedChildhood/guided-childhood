-- Guided Childhood: DiGi intelligence, steps 5 to 7
-- Run AFTER 019_digi_brain.sql. Two tables:
--   digi_safety_flags: the safety verifier's log. DiGi's reply streams to the
--     parent, so the verifier cannot block it. Instead it runs after the reply
--     and records anything it caught here, for the founder to review and for the
--     evals to lean on. Service role writes, founder reads through the admin
--     client. No parent ever reads or writes this.
--   digi_wisdom: aggregate, de-identified patterns of what tends to work across
--     all families, so DiGi can lean on the wider track record. Readable by the
--     authenticated DiGi route (same public read as expert_knowledge), only the
--     service role writes. Only paraphrased patterns live here, never a family's
--     raw content.

create table if not exists public.digi_safety_flags (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users(id) on delete set null,
  stage_id     text,
  question     text,
  reply        text,
  violations   jsonb not null default '[]'::jsonb,
  severity     text not null default 'low' check (severity in ('low','medium','high')),
  source       text not null default 'live' check (source in ('live','eval')),
  created_at   timestamptz not null default now()
);
create index if not exists idx_digi_safety_flags_created on public.digi_safety_flags(created_at desc);
create index if not exists idx_digi_safety_flags_severity on public.digi_safety_flags(severity, created_at desc);
alter table public.digi_safety_flags enable row level security;
-- Service role only. No parent facing policy on purpose: this is founder review data.
create policy "Service role manages safety flags" on public.digi_safety_flags for all
  using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create table if not exists public.digi_wisdom (
  id             uuid primary key default uuid_generate_v4(),
  topic          text not null,
  age_band       text,
  what_works     text not null,
  evidence_count integer not null default 1,
  active         boolean not null default true,
  updated_at     timestamptz not null default now(),
  created_at     timestamptz not null default now()
);
create index if not exists idx_digi_wisdom_active on public.digi_wisdom(active, updated_at desc);
alter table public.digi_wisdom enable row level security;
-- Public read like expert_knowledge, so the authenticated DiGi route can pull it
-- into context. It holds only aggregate paraphrased patterns, nothing identifying.
create policy "Aggregate wisdom is public" on public.digi_wisdom for select using (true);
create policy "Service role manages wisdom" on public.digi_wisdom for all
  using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
