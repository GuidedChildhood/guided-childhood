-- 295: the latency row knows which model answered
--
-- Sunday 13 September 2026, the DiGi review. The ladder moved to a new
-- generation today (Opus 5 on chat at medium effort, Fable 5.1 on the deep
-- jobs, fast mode behind a flag). A change like that has to be measurable
-- afterwards or it is a hope, and migration 149 records how long a reply took
-- without recording WHO answered it. A fallback to the second model in the
-- ladder and a slow day on the first look identical in the table.
--
-- Four things the row learns:
--
--   WHICH MODEL, AT WHAT EFFORT, IN WHICH SPEED. So the median can be sliced by
--   the thing that was changed, and a quiet fallback to Sonnet is visible.
--
--   WHETHER THE CACHE HIT. The static system prompt carries cache_control and
--   nothing has ever checked that it works. A cache that silently stopped
--   hitting looks exactly like a model that got slower, and the fix for one is
--   not the fix for the other. cache_read_tokens at zero across repeated rows
--   is the tell.
--
--   THE STOP REASON. The new generation can return a refusal with no text,
--   which the rescue path handles and the row could not name.
--
--   TOKENS IN AND OUT. Cost per answered question, at last.
--
-- WHAT CHANGED IN THE OLD COLUMNS. From today the lane call and round two of
-- the context gather run at the same time, so gather2_ms is the time round two
-- took BEYOND the lane call, not its whole duration. total_ms is unchanged in
-- meaning: still the sum to first token.
--
-- Supabase editor rules: idempotent, no DO blocks, flat statements.

alter table public.digi_latency add column if not exists model text;
alter table public.digi_latency add column if not exists effort text;
alter table public.digi_latency add column if not exists fast boolean;
alter table public.digi_latency add column if not exists stop_reason text;
alter table public.digi_latency add column if not exists cache_read_tokens integer;
alter table public.digi_latency add column if not exists cache_write_tokens integer;
alter table public.digi_latency add column if not exists input_tokens integer;
alter table public.digi_latency add column if not exists output_tokens integer;

comment on column public.digi_latency.model is
  'The model that produced the first turn of this reply, after any fallback down the ladder. Null before 13 September 2026.';

comment on column public.digi_latency.effort is
  'The output_config effort sent on the first turn, or null when the model does not take one (Haiku) or the task runs at the API default.';

comment on column public.digi_latency.fast is
  'Whether the first turn ran in fast mode. Null before 13 September 2026, false when the flag is off or the model cannot.';

comment on column public.digi_latency.stop_reason is
  'The first turn''s stop reason: end_turn, tool_use, max_tokens, refusal. A refusal with replied false is the model declining, not a bug in the loop.';

comment on column public.digi_latency.cache_read_tokens is
  'Prompt tokens served from the cache on the first turn. Zero across many rows means the cache_control on the static prompt has stopped working.';

comment on column public.digi_latency.gather2_ms is
  'Round two of the context gather. From 13 September 2026 it runs alongside the lane call, so this is the time it took beyond that call, not its whole duration.';
