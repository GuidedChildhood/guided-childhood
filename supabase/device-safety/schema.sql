-- =============================================================
-- GUIDED CHILDHOOD: DEVICE SETTINGS BEFORE YOU START
-- Supabase schema for device and platform safety settings,
-- risks, per-family tracker, and research watch layer.
-- Design principles carried over from the master build docs:
--   * Durable spine vs volatile config: anything that changes
--     with legislation, platform policy or app UI is marked
--     volatile and dated, never hardcoded into copy.
--   * DiGi is pathways only: these tables feed guidance,
--     never allow/deny decisions.
--   * Stages: explorer, learner, navigator, voyager, independent.
-- =============================================================

-- ---------- ENUMS ----------
create type entity_type as enum ('device', 'os', 'platform', 'service', 'network');
create type stage as enum ('explorer', 'learner', 'navigator', 'voyager', 'independent');
create type setting_priority as enum ('essential', 'recommended', 'optional');
create type volatility as enum ('durable', 'semi_volatile', 'volatile');
create type risk_severity as enum ('low', 'medium', 'high', 'critical');
create type check_status as enum ('not_started', 'in_progress', 'done', 'not_applicable', 'needs_review');

-- ---------- 1. ENTITIES: every device, OS, platform, service ----------
create table entities (
  id text primary key,                      -- slug, e.g. 'ios', 'instagram'
  entity_type entity_type not null,
  name text not null,
  vendor text,
  category text,                            -- 'smartphone', 'console', 'social', 'video', 'gaming_platform', 'messaging', 'broadband', 'vr', 'tv'
  min_age_official int,                     -- vendor stated minimum age, null if none
  in_uk_ban_scope boolean default false,    -- driven by social_media_law config; keep as data not copy
  parental_tool_name text,                  -- e.g. 'Screen Time', 'Family Link', 'Family Pairing'
  official_guide_url text,
  notes text,
  last_verified date
);

-- ---------- 2. SETTINGS: the master settings table ----------
create table settings (
  id text primary key,                      -- slug, e.g. 'ios_ask_to_buy'
  entity_id text not null references entities(id),
  setting_name text not null,
  what_it_does text not null,
  why_it_matters text not null,             -- plain parent-facing rationale
  how_to_path text not null,                -- step path, kept short; full steps live in guidance content
  default_state text,                       -- what the vendor ships as default
  requires_parent_account boolean default false,
  priority setting_priority not null default 'recommended',
  bypass_risk text,                         -- known workaround children use, honest not alarmist
  volatility volatility not null default 'semi_volatile',
  source_url text,
  last_verified date,
  -- Stage recommendations. Values: 'on', 'on_locked', 'off',
  -- 'parent_choice', 'na' (feature or platform not appropriate at this stage)
  stage_explorer text default 'na',
  stage_learner text default 'na',
  stage_navigator text default 'parent_choice',
  stage_voyager text default 'parent_choice',
  stage_independent text default 'parent_choice'
);

-- ---------- 3. RISKS: known risks per entity ----------
create table risks (
  id text primary key,
  entity_id text not null references entities(id),
  risk_name text not null,
  description text not null,
  severity risk_severity not null,
  stages_affected text not null,            -- csv of stages, e.g. 'learner,navigator,voyager'
  mitigation_setting_ids text,              -- csv of settings.id that reduce this risk
  residual_note text,                       -- what settings cannot fix; feeds honest evidence handling
  source_url text,
  last_verified date
);

-- ---------- 4. FAMILY TRACKER: per child tick-off ----------
create table setting_checks (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null,                  -- fk to your families table
  child_id uuid not null,                   -- fk to your children table
  setting_id text not null references settings(id),
  status check_status not null default 'not_started',
  checked_at timestamptz,
  snoozed_until date,
  notes text,
  unique (child_id, setting_id)
);

-- ---------- 5. RESEARCH WATCH: agent-maintained change detection ----------
create table research_watch (
  id uuid primary key default gen_random_uuid(),
  entity_id text references entities(id),
  setting_id text references settings(id),
  watch_topic text not null,                -- e.g. 'iOS 27 Ask to Browse rollout'
  watch_query text not null,                -- search query the agent runs
  check_frequency_days int default 30,
  last_checked timestamptz,
  last_known_state text,
  change_detected boolean default false,
  change_summary text,
  proposed_update text,                     -- agent drafts, human approves (review queue rule)
  approved boolean default false
);

-- ---------- 6. GUIDANCE CONTENT: steps, scripts, game cards ----------
create table guidance_content (
  id text primary key,
  setting_id text references settings(id),
  entity_id text references entities(id),
  content_type text not null check (content_type in ('step_guide','script','game_card')),
  title text not null,
  body text not null,                       -- markdown; steps numbered; scripts verbatim parent lines
  stage_min stage,
  stage_max stage,
  approved boolean default false            -- review queue: nothing surfaces until approved
);

-- Helpful view: full checklist for a child at a given stage
-- (app resolves stage from child's year group)
create or replace view v_stage_checklist as
select s.id as setting_id, s.entity_id, e.name as entity_name,
       s.setting_name, s.priority, s.how_to_path,
       s.stage_explorer, s.stage_learner, s.stage_navigator,
       s.stage_voyager, s.stage_independent
from settings s join entities e on e.id = s.entity_id;

-- Row level security left to your existing auth pattern.
-- Seed data: import entities.csv, settings.csv, risks.csv via Supabase table editor or COPY.
